/**
 * generate-sitemap.mjs — emit public/sitemap.xml from the real ROUTES table.
 *
 * The old sitemap was hand-maintained against the retired `?view=` query
 * routing (and listed the deleted /compare pages). This derives the indexable
 * URL set from src/lib/routes.js so it can never drift from the router: a route
 * is included unless it is noindex (app/auth/transient — mirrors seo.js
 * NOINDEX_VIEWS + robots.txt), guarded, or a retired redirect surface.
 *
 * Home canonicalizes to '/', and the compendium fans out to one URL per tab
 * (each indexes with its own title via CompendiumPanel's ?tab= deep link).
 *
 * Public gallery slugs are OPT-IN and best-effort: set SITEMAP_INCLUDE_GALLERY=1
 * with VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY in the env and this appends
 * every public /gallery/:slug. Off by default so `npm run build` stays offline
 * and deterministic; the deploy env (4h) flips it on. Any fetch failure is
 * swallowed — the static routes always ship.
 *
 * Run: `node scripts/generate-sitemap.mjs`  (writes public/sitemap.xml)
 */
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ROUTES } from '../src/lib/routes.js';

const ORIGIN = 'https://settlementforge.com';
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

// Mirrors seo.js NOINDEX_VIEWS + robots.txt. App / auth / transient routes that
// must never appear in the sitemap. Kept in lockstep by tests/build/sitemap.test.js.
// `refunds` is here (not a content route): the standalone refund page was retired
// into the Terms "Refunds and cancellation" section, so /refunds now renders the
// same content as /terms — indexing it would duplicate /terms.
export const NOINDEX_VIEWS = new Set([
  'settlements', 'realm', 'map', 'workshop', 'account', 'admin',
  'signin', 'register', 'reset-password', 'set-new-password',
  'verify-email', 'confirm-email', 'dossier-success',
  'refunds',
]);

// Retired redirect surfaces (kept in ROUTES so old links still resolve, but they
// forward to /how-to and carry no unique content — never indexed).
export const RETIRED_VIEWS = new Set([
  'compare', 'compare-chatgpt', 'compare-worldographer', 'compare-kanka',
]);

// Per-view sitemap hints. Views absent here fall back to DEFAULT_HINT.
const DEFAULT_HINT = { changefreq: 'monthly', priority: '0.6' };
const HINTS = {
  home:       { changefreq: 'weekly',  priority: '1.0', loc: `${ORIGIN}/` },
  generate:   { changefreq: 'monthly', priority: '0.9' },
  pricing:    { changefreq: 'monthly', priority: '0.9' },
  gallery:    { changefreq: 'daily',   priority: '0.8' },
  compendium: { changefreq: 'monthly', priority: '0.7' },
  howto:      { changefreq: 'monthly', priority: '0.6' },
  terms:      { changefreq: 'yearly',  priority: '0.3' },
  privacy:    { changefreq: 'yearly',  priority: '0.3' },
};

// The seven compendium sections (CompendiumPanel TABS) — each gets its own URL.
const COMPENDIUM_TABS = ['tiers', 'economy', 'power', 'arcane', 'stress', 'neighbour', 'institutions'];

/** Is this ROUTES entry an indexable public content route? */
function isIndexable(route) {
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

/** Best-effort public gallery slugs (opt-in). Never throws. */
async function galleryUrls() {
  if (process.env.SITEMAP_INCLUDE_GALLERY !== '1') return [];
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
  const urls = [...staticUrls(), ...(await galleryUrls())];
  const body = urls.map(urlEntry).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<!--
  sitemap.xml — GENERATED by scripts/generate-sitemap.mjs. Do not hand-edit.

  Derived from src/lib/routes.js: every indexable public route (excluding
  noindex app/auth/transient routes, guarded routes, and retired redirect
  surfaces), the seven compendium sections, and — when SITEMAP_INCLUDE_GALLERY=1
  in the deploy env — every public /gallery/:slug. Vercel serves /public/* as
  static files. Regenerate with: node scripts/generate-sitemap.mjs
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
