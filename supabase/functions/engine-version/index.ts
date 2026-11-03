/**
 * Supabase Edge Function: engine-version — WHICH ENGINE THIS DEPLOYMENT SERVES (ENGINE-1 unit 4).
 *
 *   GET → 200 { engineVersion, builtFromCommit, deployedAt }
 *
 * Read straight from `_shared/engineBundle.meta.json`, the stamp scripts/build-edge-shared.mjs
 * writes beside the bundle engine-generate imports, so the two functions cannot disagree:
 *   engineVersion   — sha256/16 of the bundle bytes (what engine-generate serves and pins
 *                     against; a client compares this before pinning).
 *   builtFromCommit — `git rev-parse HEAD` when the builder ran (the bundle's parent commit;
 *                     the meta's sourceHash pins the exact inputs).
 *   deployedAt      — the bundle's BUILD stamp (meta.generatedAt). `supabase functions deploy`
 *                     packages the committed tree with no build step, so this is the moment the
 *                     deployed engine was made; the platform exposes no deploy-time stamp to a
 *                     function, and none is invented here.
 *
 * Public (verify_jwt = false), like health: no user data, no write path, no client.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import engineMeta from '../_shared/engineBundle.meta.json' with { type: 'json' };

export const ENGINE_VERSION_BODY = Object.freeze({
  engineVersion: engineMeta.engineVersion,
  builtFromCommit: engineMeta.builtFromCommit,
  deployedAt: engineMeta.generatedAt,
});

function corsHeaders(req: Request) {
  return sharedCorsHeaders(req, { methods: 'GET, HEAD, OPTIONS' });
}

export function handleEngineVersion(req: Request): Response {
  const cors = corsHeaders(req);
  if (req.method === 'OPTIONS') return new Response(null, { headers: cors });
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...cors, 'Content-Type': 'application/json' },
    });
  }
  return new Response(req.method === 'HEAD' ? null : JSON.stringify(ENGINE_VERSION_BODY), {
    status: 200,
    headers: { ...cors, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });
}

if (import.meta.main) {
  serve((req) => handleEngineVersion(req));
}
