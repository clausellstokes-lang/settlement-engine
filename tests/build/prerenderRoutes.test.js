/**
 * prerenderRoutes.test.js — V-19 THE FINDABLE TRUTH, the grade carrier.
 *
 * The discoverability guarantee is that EVERY public route ships a static HTML
 * document whose <head> carries its own truth (a non-JS scraper never sees the
 * homepage for a deep link), and that this can never rot. Two layers:
 *
 *   A. PURE render pins (always run): the prerender's per-route head is exactly
 *      the runtime SPA's head (headForView / compendiumEntryHead — the single
 *      source), the site JSON-LD + canonical are present and valid, the SPA boot
 *      shell survives untouched, and the ROOT keeps its hand-authored marketing
 *      card. Build and SPA cannot drift because both read the same builders.
 *
 *   B. DIST-walk pins (VERIFY_DIST=1, post-build): the ACTUAL emitted files exist
 *      under dist/ with those heads, and the set of prerendered path documents
 *      matches the router's indexable path routes + the per-entry compendium fan
 *      (sitemap == router == dist). Measuring a stale dist is how a prerender goes
 *      vacuous, so the file-reads are gated exactly like the first-paint budget.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ROUTES } from '../../src/lib/routes.js';
import { headForView } from '../../src/lib/seo.js';
import { compendiumEntryHead } from '../../src/lib/seoCompendium.js';
import { COMPENDIUM_INDEX } from '../../src/domain/compendium/searchIndex.js';
import { isIndexable } from '../../scripts/generate-sitemap.mjs';
import {
  renderStatic, renderEntry, staticRouteViews, distFileForPath, DYNAMIC_VIEWS,
} from '../../scripts/prerender-routes.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const requireDistRead = process.env.VERIFY_DIST === '1';

// A representative shell matching index.html's tag ORDER + presence (property
// before content; the AI-reservation robots tag; no canonical / no JSON-LD).
const SHELL = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="robots" content="noai, noimageai" />
    <title>SettlementForge</title>
    <meta name="description" content="Most generators roll on a table. This one simulates." />
    <meta property="og:site_name" content="SettlementForge" />
    <meta property="og:title" content="SettlementForge — Forge a settlement worth running a campaign in." />
    <meta property="og:description" content="Most generators roll on a table. This one simulates." />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://settlementforge.com/" />
    <meta property="og:image" content="https://settlementforge.com/og-craft.png" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="SettlementForge — default" />
    <meta name="twitter:description" content="default" />
    <meta name="twitter:image" content="https://settlementforge.com/og-craft.png" />
    <script type="module" crossorigin src="/assets/index-DEADBEEF.js"></script>
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

// ── head extraction helpers ───────────────────────────────────────────────────
const htmlUnescape = (s) =>
  String(s).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

function metaContent(html, attr, key) {
  const re = new RegExp(`<meta\\s+${attr}="${key.replace(/[/]/g, '\\/')}"\\s+content="([^"]*)"`, 'i');
  const m = html.match(re);
  return m ? htmlUnescape(m[1]) : null;
}
const ogTitle = (h) => metaContent(h, 'property', 'og:title');
const ogDesc = (h) => metaContent(h, 'property', 'og:description');
const ogImage = (h) => metaContent(h, 'property', 'og:image');
const ogUrl = (h) => metaContent(h, 'property', 'og:url');
const titleTag = (h) => {
  const m = h.match(/<title>([\s\S]*?)<\/title>/i);
  return m ? htmlUnescape(m[1]) : undefined;
};
const canonical = (h) => (h.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1];

/** Parse every JSON-LD block (reverse the "<" escaping) → array of {id, obj}. */
function jsonLdBlocks(html) {
  const out = [];
  const re = /<script type="application\/ld\+json"(?:\s+id="([^"]+)")?>([\s\S]*?)<\/script>/g;
  let m;
  while ((m = re.exec(html))) {
    out.push({ id: m[1] || null, obj: JSON.parse(m[2].replace(/\\u003c/g, '<')) });
  }
  return out;
}
const bootIntact = (h) =>
  /<script type="module"[^>]*src="\/assets\/index-[^"]+\.js">/.test(h) && h.includes('<div id="root"></div>');

// The static PATH routes we prerender (home '/' + the rest), and the entries.
const STATIC = staticRouteViews();
const SAMPLE_ENTRIES = ['tier-thorp', 'arch-plague-of-beasts', 'deity', 'op']
  .flatMap((p) => COMPENDIUM_INDEX.filter((e) => e.id === p || e.id.startsWith(p + '-')).slice(0, 2))
  .filter((e, i, a) => a.indexOf(e) === i);

// ── A. PURE render pins (always) ──────────────────────────────────────────────
describe('prerender — pure render (build head == runtime head, the single source)', () => {
  it('every indexable NON-home static route bakes its own head + canonical + valid site JSON-LD', () => {
    for (const { view, path } of STATIC) {
      if (path === '/') continue;
      const html = renderStatic(SHELL, view, path);
      const h = headForView(view);
      expect(titleTag(html), `${path} <title>`).toBe(h.title);
      expect(ogTitle(html), `${path} og:title`).toBe(h.title);
      expect(ogDesc(html), `${path} og:description`).toBe(h.description);
      expect(ogUrl(html), `${path} og:url`).toBe(h.canonical);
      expect(ogImage(html), `${path} og:image absolute`).toMatch(/^https:\/\/settlementforge\.com\//);
      expect(canonical(html), `${path} canonical`).toBe(h.canonical);
      const ld = jsonLdBlocks(html);
      expect(ld.find((b) => b.id === 'ld-site'), `${path} ld-site`).toBeTruthy();
      expect(bootIntact(html), `${path} SPA boot shell`).toBe(true);
    }
  });

  it('the ROOT / preserves the hand-authored marketing card, only ADDING canonical + JSON-LD', () => {
    const html = renderStatic(SHELL, 'home', '/');
    // Marketing head is untouched (not overwritten with the generic per-view head).
    expect(ogTitle(html)).toMatch(/Forge a settlement worth running a campaign in/);
    // The two additions a scraper newly gets.
    expect(canonical(html)).toBe('https://settlementforge.com/');
    expect(jsonLdBlocks(html).find((b) => b.id === 'ld-site')).toBeTruthy();
    expect(bootIntact(html)).toBe(true);
  });

  it('every compendium entry bakes its DefinedTerm head + JSON-LD + a receipt-true noscript', () => {
    for (const entry of COMPENDIUM_INDEX) {
      const html = renderEntry(SHELL, entry);
      const h = compendiumEntryHead(entry);
      expect(titleTag(html), `${entry.id} <title>`).toBe(h.title);
      expect(ogTitle(html), `${entry.id} og:title`).toBe(h.title);
      expect(ogDesc(html), `${entry.id} og:description`).toBe(h.description);
      expect(ogUrl(html), `${entry.id} og:url`).toBe(h.canonical);
      expect(canonical(html), `${entry.id} canonical`).toBe(h.canonical);
      const ld = jsonLdBlocks(html);
      const term = ld.find((b) => b.id === 'ld-compendium-entry');
      expect(term, `${entry.id} DefinedTerm LD`).toBeTruthy();
      expect(term.obj['@type']).toBe('DefinedTerm');
      expect(term.obj.name).toBe(entry.term);
      expect(ld.find((b) => b.id === 'ld-site'), `${entry.id} ld-site`).toBeTruthy();
      // Receipt-true body: the entry term reaches a no-JS crawler.
      const escText = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      expect(html).toContain(`<h1>${escText(entry.term)}</h1>`);
      expect(bootIntact(html), `${entry.id} SPA boot shell`).toBe(true);
    }
  });

  it('the gallery family is NOT prerendered (it belongs to the dynamic meta-shell seam)', () => {
    expect(DYNAMIC_VIEWS.has('gallery')).toBe(true);
    expect(STATIC.some((r) => r.view === 'gallery')).toBe(false);
  });
});

// ── B. DIST-walk pins (post-build) ────────────────────────────────────────────
describe('prerender — dist walk (the emitted files carry their own truth)', () => {
  // The router's indexable path documents (home '/' + non-dynamic statics) +
  // every per-entry compendium route. Query-param routes (?tab=) are not files.
  const expectedPaths = [
    ...STATIC.map((r) => r.path),
    ...COMPENDIUM_INDEX.map((e) => `/compendium/${e.id}`),
  ];

  it.skipIf(!requireDistRead)('every expected public path has a prerendered dist document with head truth', () => {
    for (const path of expectedPaths) {
      const file = distFileForPath(path);
      expect(existsSync(file), `missing prerendered file for ${path}`).toBe(true);
      const html = readFileSync(file, 'utf8');
      expect(ogTitle(html), `${path} og:title`).toBeTruthy();
      expect(ogDesc(html), `${path} og:description`).toBeTruthy();
      expect(ogImage(html), `${path} og:image absolute`).toMatch(/^https:\/\//);
      expect(canonical(html), `${path} canonical`).toBeTruthy();
      const ld = jsonLdBlocks(html); // throws if any block is invalid JSON
      expect(ld.length, `${path} has JSON-LD`).toBeGreaterThan(0);
      expect(ld.some((b) => b.id === 'ld-site'), `${path} ld-site`).toBe(true);
      expect(bootIntact(html), `${path} SPA boot shell`).toBe(true);
    }
  });

  it.skipIf(!requireDistRead)('sitemap == router == dist: no indexable path route lacks a prerendered file', () => {
    // Every indexable ROUTES path (minus the dynamic-seam gallery, minus query
    // param variants) must have an emitted file — the anti-drift closure.
    for (const r of ROUTES) {
      if (!isIndexable(r) || DYNAMIC_VIEWS.has(r.view)) continue;
      const path = r.view === 'home' ? '/' : r.path;
      expect(existsSync(distFileForPath(path)), `route ${r.view} (${path}) not prerendered`).toBe(true);
    }
  });
});
