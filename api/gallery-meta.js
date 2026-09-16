/**
 * api/gallery-meta.js — per-slug gallery prerender (Wave 4h unfurl pass).
 *
 * vercel.json rewrites /gallery/:slug → /api/gallery-meta?slug=:slug (BEFORE the
 * SPA catch-all). This function fetches the already-served index.html, stamps the
 * per-slug Open-Graph meta into it (via the pure injector in _galleryMeta.js), and
 * returns the modified HTML. A non-JS scraper (Reddit / Discord / Slack / Twitter)
 * now sees a real per-settlement card; a real browser still boots the SPA, which
 * reads window.location and renders the gallery detail as before.
 *
 * Resilience: every I/O step is best-effort. The dossier row (title/description
 * upgrade) is optional — if Supabase is unset or the fetch fails, the card still
 * carries the per-slug image + canonical URL. If even index.html can't be fetched,
 * we redirect to /gallery so the user is never stranded.
 *
 * The index.html fetch targets the literal `/index.html` path, which contains a
 * dot and so does NOT match the SPA catch-all rewrite — it serves the static file
 * directly, with no rewrite loop back into this function.
 *
 * Runtime: default Vercel Node.js serverless function (Web-standard Request in,
 * Response out). Reads only public data (the anon get_gallery_dossier RPC).
 *
 * @param {Request} request
 * @returns {Promise<Response>}
 */
import { buildGalleryMeta, injectGalleryMeta } from './_galleryMeta.js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
const SUPABASE_ANON = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

/** Best-effort fetch of the sanitized public dossier row for a slug. */
async function fetchDossier(slug) {
  if (!SUPABASE_URL || !SUPABASE_ANON || !slug) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/get_gallery_dossier`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        apikey: SUPABASE_ANON,
        authorization: `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify({ dossier_slug: slug }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const row = Array.isArray(data) ? data[0] : data;
    return row || null;
  } catch {
    return null;
  }
}

/** Fetch the deployed index.html (a static, dot-bearing path — no rewrite loop). */
async function fetchIndexHtml(origin) {
  try {
    const res = await fetch(`${origin}/index.html`, { headers: { accept: 'text/html' } });
    return res.ok ? await res.text() : null;
  } catch {
    return null;
  }
}

export default async function handler(request) {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug') || '';
  const origin = url.origin;

  const html = await fetchIndexHtml(origin);
  if (!html) {
    // SB4: can't reach the shell — never strand the visitor, and NEVER redirect
    // into a rewritten route: /gallery rewrites into api/meta-shell, which under
    // the same shell outage redirects back to /gallery — an infinite 302 loop.
    // `/` is served from the static filesystem ahead of every rewrite.
    return Response.redirect(`${origin}/`, 302);
  }

  const dossier = await fetchDossier(slug);
  const meta = buildGalleryMeta(slug, dossier, { origin, supabaseUrl: SUPABASE_URL });
  const out = injectGalleryMeta(html, meta);

  return new Response(out, {
    status: 200,
    headers: {
      'content-type': 'text/html; charset=utf-8',
      // Cheap on repeat views: the CDN caches the injected shell for 5 min and can
      // serve stale-while-revalidate for a day, so most /gallery/:slug hits never
      // re-invoke the function.
      'cache-control': 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400',
    },
  });
}
