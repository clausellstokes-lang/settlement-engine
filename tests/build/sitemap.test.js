/**
 * sitemap.test.js — the committed public/sitemap.xml must stay in lockstep with
 * the router.
 *
 * The generator (scripts/generate-sitemap.mjs) derives the indexable URL set
 * from src/lib/routes.js. This guard asserts:
 *   1. Freshness — the committed file byte-matches a fresh generation, so adding
 *      or renaming a public route without regenerating fails CI.
 *   2. Coverage — every indexable public route is present.
 *   3. Exclusion — no noindex / guarded / retired route leaks in.
 */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { ROUTES } from '../../src/lib/routes.js';
import { GALLERY_HUBS } from '../../src/lib/galleryHubs.js';
import { buildSitemap, staticUrls, galleryHubUrls, NOINDEX_VIEWS, RETIRED_VIEWS } from '../../scripts/generate-sitemap.mjs';

// The per-slug gallery fan-out is ON by default (GALLERY-2 phase 2) but needs
// Supabase credentials to contribute anything. Pin it OFF here so the
// byte-match below is deterministic even in an environment where credentials
// happen to be exported — the committed file is the offline artifact (static
// routes + facet hubs); slugs are appended at deploy where the env has creds.
process.env.SITEMAP_INCLUDE_GALLERY = '0';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const committed = readFileSync(join(ROOT, 'public', 'sitemap.xml'), 'utf8');

describe('public/sitemap.xml', () => {
  it('is byte-identical to a fresh generation (regenerate after route changes)', async () => {
    const fresh = await buildSitemap();
    expect(
      committed,
      'public/sitemap.xml is stale — run `node scripts/generate-sitemap.mjs`',
    ).toBe(fresh);
  });

  it('covers every indexable public route', () => {
    const locs = staticUrls().map((u) => u.loc);
    for (const route of ROUTES) {
      const indexable = route.path && !route.guard && !NOINDEX_VIEWS.has(route.view) && !RETIRED_VIEWS.has(route.view);
      if (!indexable) continue;
      const expected = route.view === 'home' ? 'https://settlementforge.com/' : `https://settlementforge.com${route.path}`;
      expect(locs, `route ${route.view} (${route.path}) missing from sitemap`).toContain(expected);
    }
  });

  it('excludes noindex, guarded, and retired routes', () => {
    const locs = staticUrls().map((u) => u.loc).join('\n');
    for (const view of [...NOINDEX_VIEWS, ...RETIRED_VIEWS]) {
      const route = ROUTES.find((r) => r.view === view);
      if (!route?.path) continue;
      expect(locs, `noindex/retired route ${view} leaked into sitemap`).not.toContain(`${route.path}`);
    }
    // Guarded routes too.
    expect(locs).not.toContain('/account');
    expect(locs).not.toContain('/admin');
  });

  it('canonicalizes home to / and fans the compendium out to seven sections', () => {
    const locs = staticUrls().map((u) => u.loc);
    expect(locs).toContain('https://settlementforge.com/');
    expect(locs).not.toContain('https://settlementforge.com/home');
    const tabs = locs.filter((l) => l.includes('/compendium?tab='));
    expect(tabs).toHaveLength(7);
  });

  // GALLERY-2 phase 2 — the facet hubs (src/lib/galleryHubs.js).
  it('fans the gallery out to every facet hub — one URL per manifest entry, committed', () => {
    const hubLocs = galleryHubUrls().map((u) => u.loc);
    // One URL per hub, no dupes, all under /gallery/.
    expect(hubLocs).toHaveLength(GALLERY_HUBS.length);
    expect(new Set(hubLocs).size).toBe(hubLocs.length);
    for (const hub of GALLERY_HUBS) {
      const loc = `https://settlementforge.com${hub.path}`;
      expect(hubLocs).toContain(loc);
      expect(committed, `hub ${hub.id} missing from the committed sitemap`).toContain(`<loc>${loc}</loc>`);
    }
    // The hub set = 7 terrains + 6 tiers + at-war + most-alive. A vocabulary
    // change legitimately reshapes this — regenerate the sitemap with it.
    expect(GALLERY_HUBS).toHaveLength(15);
  });

  it('the per-slug fan-out contributes nothing when suppressed or credential-less (deterministic committed file)', async () => {
    // The suite-level pin sets SITEMAP_INCLUDE_GALLERY='0'; a fresh build must
    // therefore be exactly static + hubs.
    const fresh = await buildSitemap();
    const urlCount = fresh.match(/<url>/g)?.length ?? 0;
    expect(urlCount).toBe(staticUrls().length + galleryHubUrls().length);
  });
});
