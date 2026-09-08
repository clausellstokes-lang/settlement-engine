/**
 * generate-sitemap.mjs — emit public/sitemap.xml from the real ROUTES table.
 *
 * The old sitemap was hand-maintained against the retired `?view=` query
 * routing (and listed the deleted /compare pages). This derives the indexable
 * URL set from src/lib/routes.js so it can never drift from the router: a route
 * is included unless it is noindex (app/auth/transient — IMPORTS seo.js's
 * NOINDEX_VIEWS, the single source), guarded, or a retired redirect surface.
 *
 * Home canonicalizes to '/', and the compendium fans out to one URL per tab
 * (each indexes with its own title via CompendiumPanel's ?tab= deep link).
 *
 * The gallery FACET HUBS (GALLERY-2 phase 2; src/lib/galleryHubs.js) are
 * emitted unconditionally — they are static, deterministic URLs derived from
 * the canonical facet vocabularies, so they live in the committed sitemap and
 * the byte-match test covers them.
 *
 * Public gallery SLUGS are ON BY DEFAULT and best-effort (GALLERY-2 phase 2 —
 * the owner-signed sitemap fan-out flip): with VITE_SUPABASE_URL +
 * VITE_SUPABASE_ANON_KEY in the env (the deploy env has them) this appends
 * every public /gallery/:slug. Without credentials it contributes nothing, so
 * an offline `npm run build` stays deterministic and byte-matches the
 * committed file. Set SITEMAP_INCLUDE_GALLERY=0 to suppress explicitly (the
 * freshness test does, so its byte-match can never depend on ambient
 * credentials). Any fetch failure is swallowed — the static routes always ship.
 *
 * Run: `node scripts/generate-sitemap.mjs`  (writes public/sitemap.xml)
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ROUTES } from '../src/lib/routes.js';
import { GALLERY_HUBS } from '../src/lib/galleryHubs.js';
import { COMPENDIUM_INDEX } from '../src/domain/compendium/searchIndex.js';
import { compendiumEntryPath } from '../src/lib/seoCompendium.js';
import { NOINDEX_VIEWS } from '../src/lib/seo.js';

const ORIGIN = 'https://settlementforge.com';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// SB4: the noindex set is SINGLE-SOURCED in src/lib/seo.js (NOINDEX_VIEWS) —
// previously a hand-copied twin lived here under a comment that falsely claimed
// test-enforced lockstep (sitemap.test.js only ever imported THIS copy). Now the
// SPA's robots meta, the sitemap, and the prerender all read one set by
// construction; re-exported for the sitemap/hub tests, which pin the identity.
export { NOINDEX_VIEWS };

// Retired redirect surfaces (kept in ROUTES so old links still resolve, but they
// forward into the About family and carry no unique content — never indexed).
//
// THE ABOUT SPLIT (docs/DESIGN_ABOUT_PAGES.md) added two of these: `howto`, the
// pre-split About page (its content now lives on the two new pages, so indexing
// /how-to would index a duplicate AND a redirect), and `about`, the bare parent
// path that lands on /about/what-this-is.
export const RETIRED_VIEWS = new Set([
  'compare', 'compare-chatgpt', 'compare-worldographer', 'compare-kanka',
  'howto', 'about',
]);

// Per-view sitemap hints. Views absent here fall back to DEFAULT_HINT.
const DEFAULT_HINT = { changefreq: 'monthly', priority: '0.6' };
const HINTS = {
  home:       { changefreq: 'weekly',  priority: '1.0', loc: `${ORIGIN}/` },
  generate:   { changefreq: 'monthly', priority: '0.9' },
  pricing:    { changefreq: 'monthly', priority: '0.9' },
  gallery:    { changefreq: 'daily',   priority: '0.8' },
  compendium: { changefreq: 'monthly', priority: '0.7' },
  'about-what-this-is': { changefreq: 'monthly', priority: '0.6' },
  'about-guide':        { changefreq: 'monthly', priority: '0.6' },
  terms:      { changefreq: 'yearly',  priority: '0.3' },
  privacy:    { changefreq: 'yearly',  priority: '0.3' },
};

// The compendium sections (CompendiumPanel TABS) — each gets its own URL. The bare
// /compendium is the Overview, so it is not repeated as ?tab=overview here.
const COMPENDIUM_TABS = [
  'tiers', 'economy', 'power', 'institutions', 'operations', 'arcane', 'deities',
  'living', 'lenses', 'facets', 'stress', 'calamity', 'neighbour', 'az',
];

/** Is this ROUTES entry an indexable public content route? */
export function isIndexable(route) {
  return (
    !!route.path &&
    !route.guard &&
    !NOINDEX_VIEWS.has(route.view) &&
    !RETIRED_VIEWS.has(route.view)
  );
}

function xmlEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function urlEntry({ loc, changefreq, priority }) {
  return `  <url>\n    <loc>${xmlEscape(loc)}</loc>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;
}

/** The static, always-emitted URL list derived from ROUTES. */
export function staticUrls() {
  const urls = [];
  for (const route of ROUTES) {
    if (!isIndexable(route)) continue;
    const hint = { ...DEFAULT_HINT, ...(HINTS[route.view] || {}) };
    const loc = hint.loc || `${ORIGIN}${route.path}`;
    urls.push({ loc, changefreq: hint.changefreq, priority: hint.priority });
    // Fan the compendium out to one URL per section.
    if (route.view === 'compendium') {
      for (const tab of COMPENDIUM_TABS) {
        urls.push({ loc: `${ORIGIN}${route.path}?tab=${tab}`, changefreq: 'monthly', priority: '0.5' });
      }
    }
  }
  return urls;
}

/**
 * The gallery facet-hub URLs — static + deterministic (no network), derived
 * from the canonical facet vocabularies via the hub manifest. Always emitted.
 */
export function galleryHubUrls() {
  return GALLERY_HUBS.map((hub) => ({
    loc: `${ORIGIN}${hub.path}`,
    changefreq: 'daily',
    priority: '0.7',
  }));
}

/**
 * The per-ENTRY Compendium URLs (V-19 the long tail) — static + deterministic,
 * derived from the committed compendium index (src/domain/compendium/
 * searchIndex.js). One /compendium/<entry-id> per named entry; the build-time
 * prerender bakes each its own <head>, so the fan is receipt-true and
 * enumeration-deep. Regenerating after a registry change reshapes this set (the
 * byte-match test forces it), exactly like the facet hubs.
 */
export function compendiumEntryUrls() {
  return COMPENDIUM_INDEX.map((e) => ({
    loc: `${ORIGIN}${compendiumEntryPath(e.id)}`,
    changefreq: 'monthly',
    priority: '0.4',
  }));
}

/** Best-effort public gallery slugs (ON by default; opt-out '0'). Never throws. */
async function galleryUrls() {
  if (process.env.SITEMAP_INCLUDE_GALLERY === '0') return [];
  const url = process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];
  try {
    const { createClient } = await import('@supabase/supabase-js');
    const client = createClient(url, anon);
    const slugs = [];
    const pageSize = 100;
    for (let page = 0; page < 100; page++) { // hard cap: 10k slugs
      const { data, error } = await client.rpc('list_gallery_dossiers', {
        p_page: page, p_page_size: pageSize, p_sort: 'recent',
      });
      if (error || !Array.isArray(data) || data.length === 0) break;
      for (const row of data) {
        const slug = row.public_slug || row.slug;
        if (slug) slugs.push(`${ORIGIN}/gallery/${encodeURIComponent(slug)}`);
      }
      if (data.length < pageSize) break;
    }
    return slugs.map((loc) => ({ loc, changefreq: 'weekly', priority: '0.6' }));
  } catch (e) {
    console.warn('[sitemap] gallery slug fetch skipped:', e?.message || e);
    return [];
  }
}

export async function buildSitemap() {
  const urls = [
    ...staticUrls(),
    ...galleryHubUrls(),
    ...compendiumEntryUrls(),
    ...(await galleryUrls()),
  ];
  const body = urls.map(urlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  sitemap.xml — GENERATED by scripts/generate-sitemap.mjs. Do not hand-edit.

  Derived from src/lib/routes.js: every indexable public route (excluding
  noindex app/auth/transient routes, guarded routes, and retired redirect
  surfaces), the compendium sections, every per-entry Compendium route
  (src/domain/compendium/searchIndex.js — the V-19 long tail), the gallery facet
  hubs (src/lib/galleryHubs.js), and — at deploy, where Supabase credentials exist
  in the env (opt out with SITEMAP_INCLUDE_GALLERY=0) — every public
  /gallery/:slug. Vercel serves /public/* as static files. Regenerate with:
  node scripts/generate-sitemap.mjs
-->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;
}

// Run as a script (not when imported by the test).
if (import.meta.url === `file://${process.argv[1]}`) {
  const xml = await buildSitemap();
  const out = join(ROOT, 'public', 'sitemap.xml');
  await writeFile(out, xml, 'utf8');
  const count = xml.match(/<url>/g)?.length ?? 0;
  console.log(`[sitemap] wrote ${count} URLs to public/sitemap.xml`);
}
