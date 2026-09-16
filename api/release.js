/**
 * Public, secret-free release identity for post-deploy source verification.
 *
 * Vercel supplies VERCEL_GIT_COMMIT_SHA to deployments. VITE_RELEASE / RELEASE
 * keep the same contract available on other hosts. Only a hexadecimal revision
 * is ever returned; a missing or malformed value fails closed with 503 rather
 * than echoing arbitrary environment data.
 */

const RELEASE_PATTERN = /^[a-f0-9]{7,64}$/i;

/** @param {Request} request */
export default function handler(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response(null, {
      status: 405,
      headers: { Allow: 'GET, HEAD' },
    });
  }

  const candidate = String(
    process.env.VERCEL_GIT_COMMIT_SHA
      || process.env.VITE_RELEASE
      || process.env.RELEASE
      || '',
  ).trim();
  const available = RELEASE_PATTERN.test(candidate);
  const payload = available
    ? {
        schemaVersion: 1,
        ok: true,
        service: 'settlementforge-web',
        release: candidate.toLowerCase(),
      }
    : {
        schemaVersion: 1,
        ok: false,
        service: 'settlementforge-web',
        error: 'release_identity_unavailable',
      };

  return new Response(request.method === 'HEAD' ? null : JSON.stringify(payload), {
    status: available ? 200 : 503,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

