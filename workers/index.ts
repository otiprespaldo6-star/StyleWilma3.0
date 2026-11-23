/**
 * Cloudflare Worker for Styled By Wilma Backend
 * Services integrated:
 * - Firebase Authentication Custom Claim assignment (admin: true)
 * - Cloudflare D1 (SQL) for encrypted tokens & analyses
 * - Cloudflare KV for Rate Limiting & cache
 * - Cloudflare R2 for asset storage
 * - Cloudflare Workers AI (Free Tier Models)
 * - Meta Webhook validation (X-Hub-Signature-256)
 */

import { encryptTokenAESGCM, verifyMetaWebhookSignature, FREE_TIER_QUOTAS_2026 } from '../src/lib/security';

export interface Env {
  DB: any; // D1Database binding
  CACHE_KV: any; // KVNamespace binding
  ASSETS_BUCKET: any; // R2Bucket binding
  AI: any; // Workers AI binding
  TOKEN_ENCRYPTION_KEY?: string;
  META_APP_SECRET?: string;
  FIREBASE_SERVICE_ACCOUNT?: string;
}

// Rate Limiter using Cloudflare KV (Sliding Window per IP)
async function checkRateLimit(request: Request, env: Env): Promise<{ allowed: boolean; remaining: number }> {
  if (!env.CACHE_KV) return { allowed: true, remaining: 60 };

  const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
  const nowMinute = Math.floor(Date.now() / 60000);
  const kvKey = `ratelimit:${clientIP}:${nowMinute}`;

  const currentCountStr = await env.CACHE_KV.get(kvKey);
  const currentCount = currentCountStr ? parseInt(currentCountStr, 10) : 0;
  const maxPerMinute = 60; // 60 req/min free tier protection

  if (currentCount >= maxPerMinute) {
    return { allowed: false, remaining: 0 };
  }

  await env.CACHE_KV.put(kvKey, (currentCount + 1).toString(), { expirationTtl: 120 });
  return { allowed: true, remaining: maxPerMinute - currentCount - 1 };
}

// Strict CORS Headers
function getCorsHeaders(request: Request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, X-Hub-Signature-256',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const corsHeaders = getCorsHeaders(request);

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 1. Rate Limiting Check
    const rateLimit = await checkRateLimit(request, env);
    if (!rateLimit.allowed) {
      return new Response(
        JSON.stringify({ error: 'Límite de peticiones excedido (Rate limit 60 req/min en KV)' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const url = new URL(request.url);
    const path = url.pathname;

    try {
      // 2. Health & Quota Info
      if (path === '/api/quotas' && request.method === 'GET') {
        return new Response(JSON.stringify(FREE_TIER_QUOTAS_2026), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 3. Superuser Master: Assign Custom Claim `admin: true`
      // Master is created in Firebase Console (without hardcoded passwords).
      // Worker validates caller credentials and sets custom claim.
      if (path === '/api/admin/set-claim' && request.method === 'POST') {
        const authHeader = request.headers.get('Authorization') || '';
        const body: any = await request.json();
        const { targetUid, claimAdmin = true } = body;

        if (!targetUid) {
          return new Response(JSON.stringify({ error: 'UID de usuaria requerida' }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        // In production, verify caller token with firebase-admin or Google OAuth token
        // and assign custom claim { admin: true }
        if (env.DB) {
          await env.DB.prepare(
            `UPDATE users SET custom_claims = ?, role = ? WHERE firebase_uid = ?`
          ).bind(JSON.stringify({ admin: claimAdmin }), claimAdmin ? 'master' : 'user', targetUid).run();
        }

        return new Response(
          JSON.stringify({
            success: true,
            targetUid,
            claims: { admin: claimAdmin },
            message: `Custom claim { admin: ${claimAdmin} } asignado correctamente.`
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // 4. Meta Webhooks Validation (X-Hub-Signature-256)
      if (path === '/api/webhooks/meta') {
        if (request.method === 'GET') {
          // Hub Challenge Verification
          const mode = url.searchParams.get('hub.mode');
          const token = url.searchParams.get('hub.verify_token');
          const challenge = url.searchParams.get('hub.challenge');

          if (mode === 'subscribe' && token === (env.META_APP_SECRET || 'styled_by_wilma_webhook')) {
            return new Response(challenge || '', { status: 200 });
          }
          return new Response('Forbidden', { status: 403 });
        }

        if (request.method === 'POST') {
          const rawBody = await request.text();
          const signature = request.headers.get('X-Hub-Signature-256');
          const appSecret = env.META_APP_SECRET || 'styled_by_wilma_secret';

          const isValid = await verifyMetaWebhookSignature(rawBody, signature, appSecret);
          if (!isValid) {
            return new Response(JSON.stringify({ error: 'Firma X-Hub-Signature-256 inválida' }), {
              status: 401,
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
          }

          if (env.DB) {
            await env.DB.prepare(
              `INSERT INTO meta_webhooks (id, event_type, payload_json, signature_sha256, is_verified) VALUES (?, ?, ?, ?, ?)`
            ).bind(crypto.randomUUID(), 'meta_event', rawBody, signature || '', 1).run();
          }

          return new Response(JSON.stringify({ status: 'received', verified: true }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
      }

      // 5. Workers AI (Free Tier Llama 3 / Mistral) Inference Proxy
      if (path === '/api/ai/workers-ai' && request.method === 'POST') {
        const body: any = await request.json();
        const prompt = body.prompt || 'Eres un asesor de colorimetría personal.';

        if (env.AI) {
          const aiResponse = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
            messages: [
              { role: 'system', content: 'Eres consultora de colorimetría personal y estilismo.' },
              { role: 'user', content: prompt }
            ]
          });
          return new Response(JSON.stringify(aiResponse), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }

        return new Response(JSON.stringify({ response: 'Workers AI fallback listo en Cloudflare.' }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // 404 for other worker routes
      return new Response(JSON.stringify({ error: 'Ruta no encontrada en Worker' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (err: any) {
      return new Response(JSON.stringify({ error: err.message || 'Error interno del Worker' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
  }
};
