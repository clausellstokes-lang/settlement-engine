/**
 * scripts/prerender-routes.mjs — V-19 THE FINDABLE TRUTH (prerender: deliverable
 * 1 + the long tail, deliverable 3).
 *
 * WHY: SettlementForge is a client-rendered SPA. An unfurl scraper or a
 * no-JS crawler fetches the raw HTML and never runs the bundle, so EVERY public
 * route previously served the same generic index.html head (site title + default
 * card) and carried no JSON-LD. Discoverability capped at B: deep links unfurled
 * as the homepage, structured data was crawler-invisible, and the compendium
 * funnel stopped at the tab index.
 *
 * WHAT: a POST-BUILD step (npm `postbuild`, so `npm run build` — the Vercel build
 * command — always runs it). For every INDEXABLE public PATH route (the same set
 * the sitemap derives from src/lib/routes.js) plus every per-entry Compendium
 * route (the 289 named entries), it writes a static dist/<path>/index.html whose
 * <head> carries that route's own title / description / Open-Graph + Twitter card
 * / canonical / JSON-LD, and whose <body> keeps the untouched app shell plus a
 * <noscript> text+link summary (real content + a crawl graph for no-JS bots). The
 * SPA boots and hydrates over the shell exactly as before — the head is the
 * deliverable.
 *
 * ZERO new servers, ZERO eager bytes: this runs at build time and only WRITES
 * static files Vercel already serves. Vercel checks the filesystem BEFORE the
 * afterFiles rewrites, so /create serves dist/create/index.html ahead of the SPA
 * catch-all (/((?!.*\.).*) -> /index.html) — the prerendered head wins for
 * scrapers while real browsers still get the SPA.
 *
 * SINGLE SOURCE OF TRUTH: the head content comes from headForView (src/lib/
 * seo.js) and compendiumEntryHead (src/lib/seoCompendium.js) — the SAME pure
 * builders the runtime SPA applies — and the route SET from isIndexable
 * (generate-sitemap.mjs). The prerender pins (tests/build/prerenderRoutes.test.js)
 * assert the baked head matches the runtime head, so build and SPA cannot drift.
 *
 * The gallery INDEX + per-slug family is DELIBERATELY excluded (DYNAMIC_VIEWS):
 * a shared gallery world unfurls per-item via the dynamic meta-shell
 * (api/meta-shell.js + api/gallery-meta.js), and a static dist/gallery/
 * index.html would SHADOW the unlisted ?slug= rewrite the fold connects.
 * The gallery FACET HUBS (src/lib/galleryHubs.js) are the exception (SB4):
 * they are static, deterministic, sitemap-promoted pages, yet /gallery/at-war
 * previously matched the /gallery/:slug rewrite (generic 'Shared settlement'
 * card) and /gallery/terrain|tier/* fell through to the SPA catch-all (homepage
 * card). Baking each hub a static document wins the filesystem check ahead of
 * both rewrites, so a no-JS scraper sees the hub's own head — the same
 * projection setGalleryHubMeta (lib/seoDossier.js) applies at runtime.
 *
 * Run: `node scripts/prerender-routes.mjs`  (reads + writes dist/)
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ROUTES } from '../src/lib/routes.js';
import { headForView, siteGraph } from '../src/lib/seo.js';
import { compendiumEntryHead } from '../src/lib/seoCompendium.js';
import { COMPENDIUM_INDEX } from '../src/domain/compendium/searchIndex.js';
import { GALLERY_HUBS } from '../src/lib/galleryHubs.js';
import { injectGalleryMeta, SITE_NAME } from '../api/_galleryMeta.js';
import { isIndexable } from './generate-sitemap.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const DIST = join(ROOT, 'dist');
const INDEX_HTML = join(DIST, 'index.html');
const ORIGIN = 'https://settlementforge.com';

// Served by the dynamic meta-shell seam, never a static file (see header).
const DYNAMIC_VIEWS = new Set(['gallery']);

// ── pure HTML head transforms (canonical link + JSON-LD; meta reuses the
//    injectGalleryMeta upserts) ───────────────────────────────────────────────
function escapeAttr(v) {
  return String(v)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escapeText(v) {
  return String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/** Upsert <link rel="canonical" href="…">. */
function upsertCanonical(html, href) {
  const tag = `<link rel="canonical" href="${escapeAttr(href)}" />`;
  const re = /<link\s+[^>]*rel=["']canonical["'][^>]*>/i;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

/** Upsert a JSON-LD <script> keyed by id (mirrors seo.js upsertJsonLd's id). */
function upsertJsonLd(html, id, obj) {
  // Escape "<" so a description can never break out of the script element.
  const json = JSON.stringify(obj).replace(/</g, '\\u003c');
  const tag = `<script type="application/ld+json" id="${id}">${json}</script>`;
  const re = new RegExp(
    `<script[^>]*id=["']${id}["'][^>]*>[\\s\\S]*?<\\/script>`,
    'i',
  );
  if (re.test(html)) return html.replace(re, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

// The no-JS crawl graph: a compact internal-link nav baked into every page's
// <noscript> so a scraper that never runs the bundle can still traverse the
// public surface (the SPA's link graph is JS-only; the sitemap + this cover it).
const NAV_LINKS = [
  ['/', 'Home'],
  ['/create', 'Create a settlement'],
  ['/compendium', 'Compendium'],
  ['/pricing', 'Pricing'],
  ['/gallery', 'Gallery'],
  ['/how-to', 'About'],
];

/** A <noscript> body summary: heading + description + the crawl-graph nav. */
function noscriptSummary({ heading, description, extraHtml = '' }) {
  const nav = NAV_LINKS
    .map(([href, label]) => `<a href="${escapeAttr(href)}">${escapeText(label)}</a>`)
    .join(' · ');
  return (
    '<noscript>\n' +
    `      <h1>${escapeText(heading)}</h1>\n` +
    `      <p>${escapeText(description)}</p>\n` +
    (extraHtml ? `      ${extraHtml}\n` : '') +
    `      <nav aria-label="SettlementForge">${nav}</nav>\n` +
    '    </noscript>'
  );
}

/** Inject the noscript summary right after the SPA root div (inert with JS on). */
function injectNoscript(html, block) {
  if (/<div id="root"><\/div>\s*<noscript>/i.test(html)) {
    // Idempotent: replace an existing prerender noscript rather than stacking.
    return html.replace(/(<div id="root"><\/div>)\s*<noscript>[\s\S]*?<\/noscript>/i, `$1\n    ${block}`);
  }
  return html.replace(/(<div id="root"><\/div>)/i, `$1\n    ${block}`);
}

// ── route enumeration (mirrors the sitemap; PATH routes only) ─────────────────
/** Indexable static PATH routes, minus the dynamic-seam views. */
function staticRouteViews() {
  const out = [];
  for (const r of ROUTES) {
    if (!isIndexable(r) || DYNAMIC_VIEWS.has(r.view)) continue;
    // home canonicalizes to '/', matching the sitemap's HINTS.home.loc.
    const path = r.view === 'home' ? '/' : r.path;
    out.push({ view: r.view, path });
  }
  return out;
}

/** dist path for a URL path: '/' -> dist/index.html, '/x/y' -> dist/x/y/index.html. */
function distFileForPath(urlPath) {
  if (urlPath === '/') return INDEX_HTML;
  const rel = urlPath.replace(/^\//, '').replace(/\/+$/, '');
  return join(DIST, rel, 'index.html');
}

function writeHtml(urlPath, html) {
  const file = distFileForPath(urlPath);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html, 'utf8');
}

// ── render ────────────────────────────────────────────────────────────────────
/**
 * Render a static route. The ROOT '/' is special: it is the primary
 * bare-domain share, whose hand-authored marketing card in index.html is
 * deliberately punchier than the generic per-view head, so we PRESERVE its
 * title/OG/description and only ADD the canonical + site JSON-LD + noscript. Every
 * other route gets its route-specific head (an upgrade over the generic default a
 * scraper saw before).
 */
function renderStatic(baseHtml, view, urlPath) {
  const h = headForView(view);
  let html = baseHtml;
  if (urlPath !== '/') {
    html = injectGalleryMeta(html, {
      title: h.title,
      description: h.description,
      image: h.image,
      url: h.canonical,
      type: h.ogType,
    });
  }
  html = upsertCanonical(html, h.canonical);
  html = upsertJsonLd(html, 'ld-site', siteGraph());
  const heading = urlPath === '/' ? 'SettlementForge' : h.title.replace(/ · SettlementForge$/, '');
  html = injectNoscript(html, noscriptSummary({ heading, description: h.description }));
  return html;
}

/** Render a per-entry Compendium route (title/desc/canonical + DefinedTerm LD). */
function renderEntry(baseHtml, entry) {
  const h = compendiumEntryHead(entry);
  let html = injectGalleryMeta(baseHtml, {
    title: h.title,
    description: h.description,
    url: h.canonical,
    type: h.ogType,
  });
  html = upsertCanonical(html, h.canonical);
  html = upsertJsonLd(html, 'ld-site', siteGraph());
  html = upsertJsonLd(html, 'ld-compendium-entry', h.jsonLd);
  // Receipt-true extra: the engine's own descriptor keywords, and a link home
  // to the compendium hub (part of the crawl graph).
  const kw = String(entry.keywords || '').trim();
  const extra =
    `<p>Category: ${escapeText(entry.category)}.` +
    (kw ? ` ${escapeText(kw)}.` : '') +
    ` <a href="/compendium">Back to the Compendium</a></p>`;
  html = injectNoscript(html, noscriptSummary({
    heading: entry.term,
    description: h.description,
    extraHtml: extra,
  }));
  return html;
}

/**
 * Render a gallery FACET HUB (SB4 — see the header). The head is EXACTLY the
 * projection setGalleryHubMeta applies at runtime (title `${hub.title} · SITE`,
 * description = blurb, canonical = the hub's own path, a CollectionPage JSON-LD
 * under the same 'ld-gallery-item' id), pinned against the manifest in
 * prerenderRoutes.test.js. No og:image override: the runtime leaves the
 * site-default card for hubs, and so does the baked head.
 */
function renderHub(baseHtml, hub) {
  const title = `${hub.title} · ${SITE_NAME}`;
  const canonical = `${ORIGIN}${hub.path}`;
  let html = injectGalleryMeta(baseHtml, {
    title,
    description: hub.blurb,
    url: canonical,
    type: 'website',
  });
  html = upsertCanonical(html, canonical);
  html = upsertJsonLd(html, 'ld-site', siteGraph());
  html = upsertJsonLd(html, 'ld-gallery-item', {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: hub.title,
    url: canonical,
    description: hub.blurb,
    isPartOf: { '@type': 'WebSite', name: SITE_NAME, url: `${ORIGIN}/` },
  });
  html = injectNoscript(html, noscriptSummary({ heading: hub.title, description: hub.blurb }));
  return html;
}

// ── main ──────────────────────────────────────────────────────────────────────
function main() {
  if (!existsSync(INDEX_HTML)) {
    console.error(`[prerender] ${INDEX_HTML} not found — run \`vite build\` first.`);
    process.exit(1);
  }
  const baseHtml = readFileSync(INDEX_HTML, 'utf8');

  let written = 0;
  const statics = staticRouteViews();
  for (const { view, path } of statics) {
    writeHtml(path, renderStatic(baseHtml, view, path));
    written++;
  }
  // The 15 facet hubs (SB4). Their paths live under /gallery/<facet>[/<value>],
  // so no dist/gallery/index.html is ever created — the bare-/gallery dynamic
  // seam (unlisted ?slug=) keeps reaching the meta-shell rewrite (pinned).
  for (const hub of GALLERY_HUBS) {
    writeHtml(hub.path, renderHub(baseHtml, hub));
    written++;
  }
  for (const entry of COMPENDIUM_INDEX) {
    writeHtml(`/compendium/${entry.id}`, renderEntry(baseHtml, entry));
    written++;
  }

  console.log(
    `[prerender] wrote ${written} static route documents ` +
    `(${statics.length} views + ${GALLERY_HUBS.length} gallery hubs + ` +
    `${COMPENDIUM_INDEX.length} compendium entries) under dist/`,
  );
}

// Exported for the prerender pins (tests/build/prerenderRoutes.test.js).
export {
  ORIGIN, DYNAMIC_VIEWS, staticRouteViews, distFileForPath,
  renderStatic, renderEntry, renderHub, upsertCanonical, upsertJsonLd, noscriptSummary,
};

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
