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
// PURE decode (no fetch, no env): a world code carries its own preset, so the
// card can name real facts (realm size / tone) without any server state. The
// seed inside the code NEVER reaches the head.
import { decodeWorldCode } from '../src/lib/worldCode.js';

/**
 * Match a /world/<code> pathname (seed post). Real codes are DOTTED
 * (`w1.<base64url>.<checksum>` — see src/lib/worldCode.js), so the token class
 * must include `.`; the previous dot-less class rejected every real code on the
 * path form (production survived only because the vercel rewrite passes the code
 * via ?worldCode=). Pinned with a real encodeWorldCode code in metaShell.test.js.
 */
function matchWorldPath(pathname) {
  const m = String(pathname || '').match(/^\/world\/([A-Za-z0-9._-]+)\/?$/);
  return m ? m[1] : '';
}

// Human labels for the world-code preset knobs (mirrors WorldPage.jsx's chips).
const WORLD_REALM_LABEL = { small: 'small realm', medium: 'medium realm', large: 'large realm' };
const WORLD_TONE_LABEL = { quiet_local: 'quiet', realistic_regional: 'realistic', dramatic_campaign: 'dramatic' };

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

  // Seed post: /world/<code> (fold rewrite passes ?worldCode=). SB4: the world
  // family is UNFURL-BUT-NOINDEX, the same posture as unlisted — /world/<code>
  // is an unbounded generated URL space (every decodable code 200s with a
  // near-identical card), so indexing it is soft-200 duplicate content. Kept in
  // lockstep with seo.js NOINDEX_VIEWS ('world') for the SPA + sitemap side.
  const code = p.get('worldCode') || matchWorldPath(pathname);
  if (code) return { kind: 'world', code, noindex: true };

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
      // SB4: decode the code at the pure seam — a valid code yields its preset
      // (realm size / tone), so two different worlds no longer unfurl with one
      // identical generic card. The world's NAME would need full generation
      // (the entire engine inside a serverless function): rejected. The seed
      // never reaches the head. An undecodable code degrades to the generic card.
      const decoded = decodeWorldCode(route.code);
      const preset = (decoded && decoded.basicConfig) || {};
      const realm = WORLD_REALM_LABEL[preset.realmSize] || '';
      const tone = WORLD_TONE_LABEL[preset.tone] || '';
      const name = (data && (data.name || data.title)) || '';
      const title = name
        ? `${name} · ${SITE_NAME}`
        : realm
          ? `A shared ${realm} · ${SITE_NAME}`
          : `A shared world · ${SITE_NAME}`;
      const description = decoded
        ? `A ${realm || 'living world'}${tone ? ` with a ${tone} tone` : ''}, rebuilt byte for byte from its share code. The same seed always builds the same world on SettlementForge.`
        : 'A living world generated and shared on SettlementForge.';
      return {
        title,
        description,
        // Seed-post card seam: the og-image function's world variant is a fold
        // item; until then a valid world card falls back to the site-default.
        image: galleryCardImage(data && data.slug ? data.slug : '', supabaseUrl),
        url: `${origin}/world/${encodeURIComponent(route.code)}`,
        type: 'article',
        // Unfurl-but-noindex (see resolveMetaRoute): the handler adds the
        // X-Robots-Tag header and the injector stamps the robots meta from this.
        noindex: true,
      };
    }

    default:
      return null;
  }
}
