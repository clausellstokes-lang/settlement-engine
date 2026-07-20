/**
 * api/meta-shell.js — the DYNAMIC unfurl handler (V-19 deliverable 2).
 *
 * The I/O shell around the pure route-pattern resolver in _metaShell.js. The fold
 * connects the rewrites (see _metaShell.js header):
 *   /gallery        -> /api/meta-shell?gallery=1     (bare index + ?slug= unlisted)
 *   /world/:code    -> /api/meta-shell?worldCode=:code
 * It fetches the served index.html, classifies the request, best-effort fetches
 * the item record, and stamps the per-item Open-Graph card in (via the shared
 * injector). Unlisted links get robots:noindex baked AND an X-Robots-Tag header,
 * so a party-shared world unfurls yet never indexes.
 *
 * Resilience mirrors gallery-meta.js: every I/O step is best-effort; a missing
 * RPC (the V-E unlisted/world fetchers are the fold's) degrades to a generic
 * per-slug card rather than failing. If index.html itself can't be fetched, we
 * redirect to /gallery so the visitor is never stranded.
 *
 * Runtime: default Vercel Node.js serverless function. Reads only public data.
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
import { injectGalleryMeta } from './_galleryMeta.js';
import { resolveMetaRoute, buildMetaForKind } from './_metaShell.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

/** Fetch the deployed index.html (a static, dot-bearing path — no rewrite loop). */
async function fetchIndexHtml(origin) {
  try {
    const res = await fetch(`${origin}/index.html`, { headers: { accept: 'text/html' } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

/** Best-effort POST to a public RPC; null on any failure or absence. */
async function rpc(name, body) {
  if (!SUPABASE_URL || !SUPABASE_ANON) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${name}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: SUPABASE_ANON,
        authorization: `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return Array.isArray(data) ? data[0] || null : data || null;
  } catch {
    return null;
  }
}

/**
 * Fetch the sanitized record for a route kind. The unlisted + world fetchers name
 * V-E's RPCs (get_unlisted_dossier(p_slug); the /world decode is the fold's) and
 * degrade to null (generic card) until the fold lands them — so this file needs
 * no V-E code on its base.
 */
async function fetchDataForRoute(route) {
  if (route.kind === 'gallery-unlisted') {
    return rpc('get_unlisted_dossier', { p_slug: route.slug });
  }
  // 'world' + 'gallery-index' carry no per-record fetch on this base (the seed
  // decode is the fold's). Generic-but-valid cards render without it.
  return null;
}

export default async function handler(request) {
  const url = new URL(request.url);
  const origin = url.origin;
  const route = resolveMetaRoute({ pathname: url.pathname, searchParams: url.searchParams });

  const html = await fetchIndexHtml(origin);
  if (!html) return Response.redirect(`${origin}/gallery`, 302);

  const meta = buildMetaForKind(route, await fetchDataForRoute(route), {
    origin,
    supabaseUrl: SUPABASE_URL,
  });

  // Unknown pattern (kind 'none'): serve the shell unchanged so the SPA boots.
  if (!meta) {
    return new Response(html, {
      status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' },
    });
  }

  const out = injectGalleryMeta(html, meta);
  const headers = { 'content-type': 'text/html; charset=utf-8' };
  if (meta.noindex) {
    // Unlisted: never cache a per-party card at the shared CDN, and belt-and-
    // suspenders the noindex with the header (defense in depth beside the meta).
    headers['cache-control'] = 'private, no-store';
    headers['x-robots-tag'] = 'noindex';
  } else {
    headers['cache-control'] = 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400';
  }
  return new Response(out, { status: 200, headers });
}
