/**
 * seo.js — per-route document head for the client-rendered SPA.
 *
 * index.html carries the site-level defaults + the home canonical; this refines
 * title / description / canonical / OG / Twitter per route (and marks private +
 * app + auth routes noindex) for JS-capable crawlers. Imperative DOM upserts,
 * mirroring the pattern CompendiumPanel already uses — Compendium keeps owning
 * its richer per-TAB description/canonical refinement on top of the base set
 * here.
 *
 * Three layers of social metadata live here:
 *   1. Per-route OG + Twitter cards (title / description / image) so every
 *      public route unfurls coherently, not just the landing.
 *   2. A DYNAMIC per-gallery-item og:image: a shared /gallery/:slug link points
 *      its og:image at the og-image edge function (?slug=…), which renders that
 *      settlement's own card. The shared artifact becomes the advertisement.
 *   3. JSON-LD structured data: the site-level WebSite + SoftwareApplication
 *      graph on every route, plus a per-item CreativeWork for a shared dossier
 *      (emitted by setSharedDossierMeta once the gallery page has its data).
 *
 * NOTE: descriptions/titles authored here are user/crawler-facing copy, so they
 * follow the house voice (no em dash) even though the voiceMechanics guard does
 * not scan this file.
 */
import { titleForView, viewToPath } from './routes.js';

export const ORIGIN = 'https://settlementforge.com';
export const SITE_NAME = 'SettlementForge';
const DEFAULT_DESCRIPTION = 'SettlementForge generates living tabletop-RPG settlements with economies, factions, NPCs, and history, then simulates them as a persistent world for game masters.';

// The site-default unfurl card (1200×630 PNG). Raster, because Facebook, X,
// LinkedIn, Slack, Discord et al. do not rasterize SVG.
// The house-sealed share card (the station device + wordmark), matching the
// static og:image in index.html. Previously og-default.png (the pre-seal
// wordmark-only card) — a JS-rendered route or a fallback then served the old
// image while the static unfurl showed the seal.
const OG_IMAGE_DEFAULT = `${ORIGIN}/og-craft.png`;
const OG_IMAGE_ALT_DEFAULT = 'SettlementForge: living settlements for game masters';

// Supabase project URL, inlined at build. The dynamic OG endpoint is a
// verify_jwt=false edge function, so an unfurl bot fetches it keyless (the same
// posture the Stripe webhook relies on). Read at call time so a misconfigured
// build degrades gracefully rather than capturing '' at module load.
function supabaseUrl() {
  return (import.meta?.env?.VITE_SUPABASE_URL || '').replace(/\/+$/, '');
}

/**
 * The dynamic OG-card URL for a shared dossier. Points at the og-image edge
 * function, which renders that settlement's coarse public projection as a PNG.
 * Falls back to the static default when the project URL is unavailable.
 * Exported for the lazy per-dossier enricher (seoDossier.js).
 */
export function galleryCardImage(slug) {
  const base = supabaseUrl();
  if (base && slug) {
    return `${base}/functions/v1/og-image?slug=${encodeURIComponent(slug)}`;
  }
  return OG_IMAGE_DEFAULT;
}

// Hand-written descriptions for the public content routes. Everything else falls
// back to the site default (and the private routes below get noindex regardless).
const VIEW_DESCRIPTIONS = {
  home:       DEFAULT_DESCRIPTION,
  generate:   'Generate a living tabletop-RPG settlement in seconds: economy, factions, NPCs, institutions, and history, ready for the table.',
  compendium: 'The SettlementForge compendium: settlement tiers, trade and economy, power and faction archetypes, religion, stress, the neighbour system, and the institution catalog.',
  pricing:    'SettlementForge pricing. Generate and save settlements for free, or unlock the Realm, AI narration, and cross-settlement simulation.',
  howto:      'Why SettlementForge can be trusted: a deterministic world simulator built by one person. The covenant, how one town is derived, and where the AI is caged by mechanism, plus the keeper\'s handbook.',
  gallery:    'Browse settlements and realms shared by the SettlementForge community.',
  founders:   'The SettlementForge Founders: thirty lifetime seats, shown as a public lineage. Meet the people who backed the project first.',
  terms:      'The SettlementForge terms of service: your account, acceptable use, subscriptions, cancellation, and refunds.',
  privacy:    'The SettlementForge privacy policy: what we collect, how research telemetry is consent-gated and opt-out, and how to request deletion.',
  // /refunds is a back-compat alias that renders the Terms "Refunds and
  // cancellation" section — kept so a shared /refunds link still unfurls with an
  // accurate refund-policy description, even though the URL is noindex (below).
  refunds:    'The SettlementForge refund policy: how credit refunds on failed generations, subscription cancellation, and PDF entitlements work.',
};

// Private / app / transient routes that must never index. Mirrors robots.txt.
// The primary legal/trust routes (terms/privacy) are DELIBERATELY absent — they
// are public, indexable pages. `refunds` IS here: the standalone refund page was
// retired into the Terms "Refunds and cancellation" section, so /refunds now
// renders the same content as /terms; noindex avoids indexing a duplicate while
// keeping the old URL working.
const NOINDEX_VIEWS = new Set([
  'settlements', 'realm', 'map', 'workshop', 'account', 'admin',
  'signin', 'register', 'reset-password', 'set-new-password',
  'verify-email', 'confirm-email', 'dossier-success',
  'refunds',
  // V-18 — the DM Screen is an at-the-table app tool (reads active state),
  // not indexable content. covenant/bounty ARE public content (absent here).
  'screen',
]);

// Exported so the lazy per-dossier enricher (seoDossier.js) reuses one
// implementation without dragging its code into the first-paint entry.
export function upsertMeta(attr, key, content) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertCanonical(href) {
  let el = document.head.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setRobotsNoindex(noindex) {
  const existing = document.head.querySelector('meta[name="robots"]');
  // Private / app / auth routes: keep them out of the index entirely.
  // Public routes: no noindex, but PRESERVE the AI-training reservation
  // (noai, noimageai) that ships statically in index.html — otherwise this
  // per-route pass would STRIP it the moment the SPA mounts, leaving a
  // JS-executing crawler with no meta signal on the very pages (gallery,
  // pricing, compendium) that are crawlable content. The site-wide
  // X-Robots-Tag: noai, noimageai response header (vercel.json) carries the
  // reservation on every response regardless; this keeps the meta coherent.
  const content = noindex ? 'noindex, nofollow' : 'noai, noimageai';
  if (existing) existing.setAttribute('content', content);
  else upsertMeta('name', 'robots', content);
}

/** Upsert a JSON-LD <script> keyed by a stable id, so re-renders replace it. */
export function upsertJsonLd(id, obj) {
  let el = document.head.querySelector(`script[type="application/ld+json"]#${id}`);
  if (!el) {
    el = document.createElement('script');
    el.setAttribute('type', 'application/ld+json');
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(obj);
}

function removeJsonLd(id) {
  const el = document.head.querySelector(`script[type="application/ld+json"]#${id}`);
  if (el) el.remove();
}

// The site-wide identity graph. Ported from the reference index.html so JSON-LD
// coverage no longer depends on a static block our index.html does not carry.
function siteGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
      {
        '@type': 'SoftwareApplication',
        name: SITE_NAME,
        applicationCategory: 'GameApplication',
        operatingSystem: 'Web',
        url: `${ORIGIN}/`,
        description: DEFAULT_DESCRIPTION,
      },
    ],
  };
}

/** Set the OG + Twitter image trio (image, dimensions, type, alt) in one place. */
export function setSocialImage(image, alt) {
  upsertMeta('property', 'og:image', image);
  upsertMeta('property', 'og:image:type', 'image/png');
  upsertMeta('property', 'og:image:width', '1200');
  upsertMeta('property', 'og:image:height', '630');
  upsertMeta('property', 'og:image:alt', alt);
  upsertMeta('name', 'twitter:image', image);
}

/**
 * Apply the per-route head for `view`. Called from App on every route change.
 * Home keeps the canonical '/' (matching the static tag and the '/'-to-/home
 * front door); every other route canonicalizes to its own path — and, for
 * entity routes like /gallery/:slug, to the per-entity path (so each shared
 * dossier gets its own canonical rather than collapsing onto the index).
 *
 * A gallery item page (`view === 'gallery'` with a slug) additionally points its
 * og:image at the dynamic OG endpoint for that slug, so the share unfurls with
 * the settlement's OWN card. setSharedDossierMeta later upgrades the title and
 * emits a CreativeWork once the page has the dossier's name.
 * @param {string} view
 * @param {{ slug?: string, id?: string }} [params] route params (e.g. gallery slug)
 */
export function applyDocumentHead(view, params) {
  if (typeof document === 'undefined') return;
  const title = titleForView(view);
  const description = VIEW_DESCRIPTIONS[view] || DEFAULT_DESCRIPTION;
  const path = view === 'home' ? '/' : (viewToPath(view, params) || '/');
  const canonical = ORIGIN + path;
  const isGalleryItem = view === 'gallery' && !!(params && params.slug);

  document.title = title;
  upsertMeta('name', 'description', description);

  // Open Graph
  upsertMeta('property', 'og:site_name', SITE_NAME);
  upsertMeta('property', 'og:type', isGalleryItem ? 'article' : 'website');
  upsertMeta('property', 'og:title', title);
  upsertMeta('property', 'og:description', description);
  upsertMeta('property', 'og:url', canonical);

  // Twitter card (mirrors OG; large-image card on every public route)
  upsertMeta('name', 'twitter:card', 'summary_large_image');
  upsertMeta('name', 'twitter:title', title);
  upsertMeta('name', 'twitter:description', description);

  // Image: the dynamic per-settlement card for a shared dossier, else the
  // site-default card. setSharedDossierMeta refines the alt text once named.
  const image = isGalleryItem ? galleryCardImage(params.slug) : OG_IMAGE_DEFAULT;
  setSocialImage(image, OG_IMAGE_ALT_DEFAULT);

  upsertCanonical(canonical);
  setRobotsNoindex(NOINDEX_VIEWS.has(view));

  // Site-level structured data on every route (it describes the site, not the
  // page). A shared dossier layers a CreativeWork on top via setSharedDossierMeta
  // (lib/seoDossier.js, loaded lazily with the gallery); leaving a route clears
  // any stale item graph.
  upsertJsonLd('ld-site', siteGraph());
  if (!isGalleryItem) removeJsonLd('ld-gallery-item');
}
