/**
 * metaShell.test.js — V-19 deliverable 2 pins: the dynamic unfurl seam, the
 * unlisted class (noindex + sitemap-excluded while STILL unfurling), and the
 * Wave-D AI-crawler posture (legitimate search + unfurl bots must not be blocked).
 *
 * All pure / file-reading — no deploy, no network. The seam the fold connects
 * (V-E's /gallery?slug= unlisted + /world/:code) is verified by classification
 * and card-building here so the guarantees hold before the routes exist.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { resolveMetaRoute, buildMetaForKind } from '../../api/_metaShell.js';
import { injectGalleryMeta, ORIGIN } from '../../api/_galleryMeta.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SUPA = 'https://proj.supabase.co';

describe('meta-shell route resolver (the fold seam)', () => {
  it('classifies the gallery family + seed posts from path OR the fold query flags', () => {
    // bare gallery index
    expect(resolveMetaRoute({ pathname: '/gallery' }).kind).toBe('gallery-index');
    expect(resolveMetaRoute({ pathname: '/api/meta-shell', searchParams: 'gallery=1' }).kind).toBe('gallery-index');
    // unlisted ?slug= (path form AND the merged fold form)
    for (const req of [
      { pathname: '/gallery', searchParams: 'slug=ab12' },
      { pathname: '/api/meta-shell', searchParams: 'gallery=1&slug=ab12' },
    ]) {
      const r = resolveMetaRoute(req);
      expect(r.kind).toBe('gallery-unlisted');
      expect(r.slug).toBe('ab12');
      expect(r.noindex).toBe(true);
    }
    // seed post /world/<code> (path form AND fold form)
    expect(resolveMetaRoute({ pathname: '/world/Zx9-Ab' })).toMatchObject({ kind: 'world', code: 'Zx9-Ab' });
    expect(resolveMetaRoute({ pathname: '/api/meta-shell', searchParams: 'worldCode=Zx9-Ab' })).toMatchObject({ kind: 'world', code: 'Zx9-Ab' });
    // anything else is inert (serve the shell unchanged)
    expect(resolveMetaRoute({ pathname: '/pricing' }).kind).toBe('none');
  });

  it('a public gallery index is indexable; an unlisted slug is NOT', () => {
    expect(resolveMetaRoute({ pathname: '/gallery' }).noindex).toBe(false);
    expect(resolveMetaRoute({ pathname: '/gallery', searchParams: 'slug=secret' }).noindex).toBe(true);
  });
});

describe('the unlisted class UNFURLS but never indexes (V-20)', () => {
  const route = resolveMetaRoute({ pathname: '/gallery', searchParams: 'slug=cryptoSlug42' });
  const dossier = { name: 'Duskhollow', tier: 'town', settlement: { population: 3400, config: { terrain: 'marsh' } } };

  it('builds a real per-item card (title + coarse facts + per-slug og-image) yet flags noindex', () => {
    const m = buildMetaForKind(route, dossier, { supabaseUrl: SUPA });
    // Unfurls as ITSELF: the party sees the settlement, not a generic card.
    expect(m.title).toContain('Duskhollow');
    expect(m.description).toContain('Duskhollow');
    expect(m.image).toBe(`${SUPA}/functions/v1/og-image?slug=cryptoSlug42`);
    // Reachable only by exact link: the URL keeps the ?slug= form, and noindex.
    expect(m.url).toBe(`${ORIGIN}/gallery?slug=cryptoSlug42`);
    expect(m.noindex).toBe(true);
  });

  it('degrades to a generic-but-per-slug noindex card when the record is missing (no leak)', () => {
    const m = buildMetaForKind(route, null, { supabaseUrl: SUPA });
    expect(m.noindex).toBe(true);
    expect(m.image).toBe(`${SUPA}/functions/v1/og-image?slug=cryptoSlug42`);
    expect(m.title).toMatch(/settlement/i);
  });

  it('the served HTML carries robots:noindex, so the shared card unfurls yet stays out of the index', () => {
    const shell = readFileSync(join(ROOT, 'index.html'), 'utf8');
    const m = buildMetaForKind(route, dossier, { supabaseUrl: SUPA });
    const out = injectGalleryMeta(shell, m);
    expect(out).toMatch(/<meta name="robots" content="noindex, nofollow"/);
    // The card is still present (unfurl works): title + per-slug image injected.
    expect(out).toContain('og:title" content="Duskhollow');
    expect(out).toContain(`og:image" content="${SUPA}/functions/v1/og-image?slug=cryptoSlug42"`);
  });
});

// Fix wave 4 (idx36): every dynamically served kind claims ITSELF as canonical.
// The shell arrives carrying the prerendered homepage canonical; the injector
// must replace it with the page's own URL (== og:url) for every route kind.
describe('every served kind is its OWN canonical (never the homepage)', () => {
  const shellWithHomeCanonical =
    '<html><head><title>SF</title>' +
    '<link rel="canonical" href="https://settlementforge.com/" />' +
    '</head><body><div id="root"></div></body></html>';

  const KINDS = [
    { req: { pathname: '/gallery' }, label: 'gallery-index' },
    { req: { pathname: '/gallery', searchParams: 'slug=cryptoSlug42' }, label: 'gallery-unlisted' },
    { req: { pathname: '/world/Zx9-Ab' }, label: 'world' },
  ];

  for (const { req, label } of KINDS) {
    it(`${label}: served canonical == og:url == the page's own URL`, () => {
      const m = buildMetaForKind(resolveMetaRoute(req), null, { supabaseUrl: SUPA });
      const out = injectGalleryMeta(shellWithHomeCanonical, m);
      const canonical = (out.match(/<link\s+rel="canonical"\s+href="([^"]*)"/i) || [])[1];
      const ogUrl = (out.match(/<meta\s+property="og:url"\s+content="([^"]*)"/i) || [])[1];
      expect(canonical, `${label} canonical`).toBe(m.url);
      expect(ogUrl, `${label} og:url`).toBe(m.url);
      expect(out).not.toContain('<link rel="canonical" href="https://settlementforge.com/" />');
    });
  }
});

describe('unlisted is sitemap-excluded BY CONSTRUCTION', () => {
  it('the sitemap draws gallery slugs ONLY from the PUBLIC list RPC — no unlisted source', () => {
    const src = readFileSync(join(ROOT, 'scripts/generate-sitemap.mjs'), 'utf8');
    // The only network slug source is the public listing RPC…
    expect(src).toContain('list_gallery_dossiers');
    // …and no unlisted reader ever feeds the sitemap.
    expect(src).not.toMatch(/get_unlisted_dossier|list_unlisted|unlisted_slug/);
  });
});

describe('Wave-D AI-crawler posture does NOT block legitimate search / unfurl bots', () => {
  const robots = readFileSync(join(ROOT, 'public/robots.txt'), 'utf8');

  // Parse robots.txt into { agent: [disallow lines] } groups.
  const groups = (() => {
    const g = {};
    let current = [];
    for (const raw of robots.split(/\r?\n/)) {
      const line = raw.replace(/#.*$/, '').trim();
      if (!line) continue;
      const ua = line.match(/^User-agent:\s*(.+)$/i);
      if (ua) {
        const name = ua[1].trim();
        g[name] = g[name] || [];
        current = g[name];
        continue;
      }
      const dis = line.match(/^Disallow:\s*(.*)$/i);
      if (dis) current.push(dis[1].trim());
    }
    return g;
  })();

  it('legitimate search + social-unfurl bots are not named with a site-wide block', () => {
    // These must ride the permissive `User-agent: *` group (Allow: /), never get
    // their own Disallow: / — a block here silently kills indexing OR unfurls.
    const mustNotBeBlocked = [
      'Googlebot', 'Bingbot', 'DuckDuckBot', 'Applebot',
      'Slackbot', 'Twitterbot', 'facebookexternalhit', 'LinkedInBot', 'Discordbot',
    ];
    for (const bot of mustNotBeBlocked) {
      const blocked = (groups[bot] || []).includes('/');
      expect(blocked, `${bot} is blocked site-wide in robots.txt`).toBe(false);
    }
    // The wildcard group exists and allows crawling.
    expect(robots).toMatch(/User-agent:\s*\*/);
    expect(robots).toMatch(/^Allow:\s*\/$/m);
  });

  it('the model/AI-training crawlers ARE reserved (defense in depth, still enforced)', () => {
    for (const bot of ['GPTBot', 'ClaudeBot', 'Google-Extended', 'CCBot', 'Bytespider']) {
      expect((groups[bot] || []).includes('/'), `${bot} should be reserved`).toBe(true);
    }
  });

  it('the sitemap is declared so crawlers find the canonical URL set without the JS link graph', () => {
    expect(robots).toMatch(/^Sitemap:\s*https:\/\/settlementforge\.com\/sitemap\.xml$/m);
  });
});
