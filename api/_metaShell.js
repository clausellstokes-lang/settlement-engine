/**
 * api/_metaShell.js — the DYNAMIC unfurl seam (V-19 deliverable 2).
 *
 * WHY: some shareable artifacts cannot prerender at build time because they are
 * per-item and created after deploy — a shared gallery world (public via
 * /gallery/:slug, AND unlisted via /gallery?slug=<crypto-slug>) and a seed post
 * (/world/<code>). The existing api/gallery-meta.js already stamps a per-slug
 * card into the served index.html for the PUBLIC gallery path. This module
 * generalizes that into a ROUTE-PATTERN-KEYED resolver so ONE meta-shell function
 * (api/meta-shell.js) can serve every dynamic unfurl kind, and the fold connects
 * V-E's routes (the /gallery?slug= unlisted rewrite + the /world/:code seed-post
 * rewrite) without new serving infrastructure — it reuses Vercel serverless
 * functions, exactly like gallery-meta.
 *
 * PURE + deploy-independent (no fetch, no fs, no env) so it unit-tests in
 * isolation (tests/build/metaShell.test.js) and the noindex + card guarantees are
 * PINNED. The `_` filename prefix keeps Vercel from routing it as its own
 * function. The route CLASSIFICATION keys off the query flags the fold's rewrites
 * set (Vercel merges the original query into the rewrite destination), so the
 * handler never depends on seeing the original pathname.
 *
 * THE CONTRACT WITH THE FOLD (report these rewrites):
 *   { source: '/gallery',       destination: '/api/meta-shell?gallery=1' }
 *   { source: '/world/:code',   destination: '/api/meta-shell?worldCode=:code' }
 * A `/gallery?slug=X` request merges to `?gallery=1&slug=X` -> unlisted (noindex).
 * Bare `/gallery` -> the gallery index card. `/world/:code` -> the seed-post card.
 * The PUBLIC /gallery/:slug path keeps its own gallery-meta rewrite (unchanged).
 */
import {
  buildGalleryMeta,
  galleryCardImage,
  ORIGIN,
  SITE_NAME,
} from './_galleryMeta.js';

/** Match a /world/<code> pathname (seed post). Codes are URL-safe tokens. */
function matchWorldPath(pathname) {
  const m = String(pathname || '').match(/^\/world\/([A-Za-z0-9_-]+)\/?$/);
  return m ? m[1] : '';
}

/**
 * Classify a request into a meta-shell KIND from its path + query. The fold's
 * rewrites encode the pattern into query flags (gallery=1 / worldCode=…); the
 * original path is honored too so the same resolver works for direct tests.
 *
 * @param {{ pathname?: string, searchParams?: URLSearchParams | string }} req
 * @returns {{ kind: 'gallery-index'|'gallery-unlisted'|'world'|'none',
 *   slug?: string, code?: string, noindex: boolean }}
 */
export function resolveMetaRoute(req = {}) {
  const pathname = req.pathname || '';
  const p =
    req.searchParams instanceof URLSearchParams
      ? req.searchParams
      : new URLSearchParams(req.searchParams || '');

  // Seed post: /world/<code> (fold rewrite passes ?worldCode=).
  const code = p.get('worldCode') || matchWorldPath(pathname);
  if (code) return { kind: 'world', code, noindex: false };

  // The gallery family (bare index + unlisted ?slug=). The fold's rewrite sets
  // gallery=1; a direct /gallery path is honored too.
  const onGallery =
    p.get('gallery') === '1' || pathname === '/gallery' || pathname === '/gallery/';
  const slug = p.get('slug') || '';
  if (slug && (onGallery || p.get('unlisted') === '1')) {
    // Unlisted = reachable only by exact link: unfurls, but never indexed (V-20).
    return { kind: 'gallery-unlisted', slug, noindex: true };
  }
  if (onGallery) return { kind: 'gallery-index', noindex: false };

  return { kind: 'none', noindex: false };
}

/**
 * Build the OG/Twitter meta for a resolved route. `data` is the (possibly null)
 * sanitized item record the handler fetched — a nameless/absent record degrades
 * to a generic but still per-item card, never leaking anything. Image + URL never
 * need the record.
 *
 * @param {{ kind: string, slug?: string, code?: string, noindex: boolean }} route
 * @param {object|null} data
 * @param {{ origin?: string, supabaseUrl?: string }} [opts]
 * @returns {{ title: string, description: string, image: string, url: string,
 *   type: string, noindex: boolean } | null}
 */
export function buildMetaForKind(route, data, opts = {}) {
  const origin = opts.origin || ORIGIN;
  const supabaseUrl = opts.supabaseUrl || '';

  switch (route.kind) {
    case 'gallery-index':
      return {
        title: `Gallery · ${SITE_NAME}`,
        description:
          'Browse living settlements and realms shared by the SettlementForge community.',
        image: galleryCardImage('', supabaseUrl), // the site-default card
        url: `${origin}/gallery`,
        type: 'website',
        noindex: false,
      };

    case 'gallery-unlisted': {
      // Reuse the public per-slug card builder (name + coarse facts + per-slug
      // og-image), then force the unlisted URL shape + noindex.
      const m = buildGalleryMeta(route.slug, data, { origin, supabaseUrl });
      return {
        ...m,
        url: `${origin}/gallery?slug=${encodeURIComponent(route.slug)}`,
        noindex: true,
      };
    }

    case 'world': {
      const name = (data && (data.name || data.title)) || '';
      return {
        title: name ? `${name} · ${SITE_NAME}` : `A shared world · ${SITE_NAME}`,
        description: name
          ? `${name}, a living world generated and shared on SettlementForge.`
          : 'A living world generated and shared on SettlementForge.',
        // Seed-post card seam: the og-image function's world variant is a fold
        // item; until then a valid world card falls back to the site-default.
        image: galleryCardImage(data && data.slug ? data.slug : '', supabaseUrl),
        url: `${origin}/world/${encodeURIComponent(route.code)}`,
        type: 'article',
        noindex: false,
      };
    }

    default:
      return null;
  }
}
