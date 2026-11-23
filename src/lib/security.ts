/**
 * Security & Encryption Utilities
 * - AES-GCM 256-bit token encryption & decryption for D1 storage
 * - Meta Webhook X-Hub-Signature-256 HMAC-SHA256 validation
 * - Cloudflare Free Plan Quotas (2026) constants
 */

// 2026 Free Tier Reference Quotas
export const FREE_TIER_QUOTAS_2026 = {
  workers: {
    requestsPerDay: 100_000,
    cpuMsPerInvocation: 10,
    cost: '$0.00 / mes',
    label: 'Cloudflare Workers (Edge Compute)'
  },
  d1: {
    storageGB: 5,
    rowsReadPerDay: 5_000_000,
    cost: '$0.00 / mes',
    label: 'Cloudflare D1 (Serverless SQL)'
  },
  kv: {
    readsPerDay: 100_000,
    writesPerDay: 1_000,
    storageGB: 1,
    cost: '$0.00 / mes',
    label: 'Cloudflare KV (Cache & Rate Limiting)'
  },
  r2: {
    storageGB: 10,
    egressFee: '$0.00 (Egreso Ilimitado Gratuito)',
    cost: '$0.00 / mes',
    label: 'Cloudflare R2 (Object Storage)'
  },
  pages: {
    buildsPerMonth: 500,
    bandwidth: 'Ilimitado',
    cost: '$0.00 / mes',
    label: 'Cloudflare Pages (Hosting & Edge Functions)'
  },
  workersAI: {
    neuronsPerDay: 10_000,
    models: 'Modelos Gratuitos (Llama 3, Mistral, BGE)',
    cost: '$0.00 / mes',
    label: 'Cloudflare Workers AI'
  },
  firebaseAuth: {
    mauSpark: 50_000,
    providers: 'Email/Password & Google OAuth',
    cost: '$0.00 / mes (Spark Plan)',
    label: 'Firebase Authentication'
  }
};

/**
 * Derives a CryptoKey for AES-GCM 256 from a raw string or base64 secret
 */
async function getCryptoKey(secretKey: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey.padEnd(32, '0').slice(0, 32));
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a plaintext string (e.g. auth token) using AES-GCM 256
 * Returns a base64 string combining IV (12 bytes) + Ciphertext + Tag
 */
export async function encryptTokenAESGCM(plainText: string, secretKey: string): Promise<string> {
  const key = await getCryptoKey(secretKey);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoder = new TextEncoder();
  const encoded = encoder.encode(plainText);

  const cipherBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    encoded
  );

  // Combine IV + ciphertext
  const combined = new Uint8Array(iv.length + cipherBuffer.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(cipherBuffer), iv.length);

  // Convert to base64
  let binary = '';
  combined.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

/**
 * Decrypts an AES-GCM encrypted base64 payload
 */
export async function decryptTokenAESGCM(encryptedBase64: string, secretKey: string): Promise<string> {
  const key = await getCryptoKey(secretKey);
  const binary = atob(encryptedBase64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const iv = bytes.slice(0, 12);
  const ciphertext = bytes.slice(12);

  const decryptedBuffer = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    ciphertext
  );

  const decoder = new TextDecoder();
  return decoder.decode(decryptedBuffer);
}

/**
 * Validates Meta (Facebook / Instagram) Webhook signature (X-Hub-Signature-256)
 * Format: sha256=<hex_digest>
 */
export async function verifyMetaWebhookSignature(
  rawBody: string,
  signatureHeader: string | null | undefined,
  metaAppSecret: string
): Promise<boolean> {
  if (!signatureHeader || !signatureHeader.startsWith('sha256=')) {
    return false;
  }

  const expectedHash = signatureHeader.replace('sha256=', '').trim();
  const encoder = new TextEncoder();
  const keyData = encoder.encode(metaAppSecret);
  const bodyData = encoder.encode(rawBody);

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await crypto.subtle.sign('HMAC', key, bodyData);
  const hashArray = Array.from(new Uint8Array(signatureBuffer));
  const calculatedHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  // Timing-safe equality comparison
  if (calculatedHex.length !== expectedHash.length) return false;
  let result = 0;
  for (let i = 0; i < calculatedHex.length; i++) {
    result |= calculatedHex.charCodeAt(i) ^ expectedHash.charCodeAt(i);
  }
  return result === 0;
}
