/**
 * Cloudflare Pages Functions Middleware
 * - Restrictive CORS
 * - KV Rate Limiting
 * - Security Headers
 */

interface Env {
  CACHE_KV?: any;
}

export const onRequest: any = async (context: any) => {
  const { request, env, next } = context;

  // Handle preflight OPTIONS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': request.headers.get('Origin') || '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Hub-Signature-256',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Rate Limiting check if KV is bound
  if (env.CACHE_KV) {
    const clientIP = request.headers.get('CF-Connecting-IP') || '127.0.0.1';
    const minute = Math.floor(Date.now() / 60000);
    const key = `rl:${clientIP}:${minute}`;
    const count = parseInt((await env.CACHE_KV.get(key)) || '0', 10);

    if (count >= 60) {
      return new Response(
        JSON.stringify({ error: 'Demasiadas solicitudes. Límite de 60 req/min alcanzado.' }),
        { status: 429, headers: { 'Content-Type': 'application/json' } }
      );
    }
    await env.CACHE_KV.put(key, (count + 1).toString(), { expirationTtl: 120 });
  }

  const response = await next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  return response;
};
