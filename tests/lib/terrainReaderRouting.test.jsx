/** @vitest-environment jsdom */
/**
 * tests/lib/terrainReaderRouting.test.jsx — R-4 lane P-6: the display side of the
 * declared legacy-`terrain` shift.
 *
 * WHY THIS FILE EXISTS
 * Wave R-3 gave updateConfig a key allowlist, and `terrain` is not on it: the
 * never-generated legacy key no longer survives a config patch (declared shift,
 * recorded in docs/CAPABILITY_REMEDIATION_PLAN.md). Four DISPLAY readers still
 * read `config.terrain` FIRST, ahead of the engine-written `config.terrainType`,
 * so on a legacy save whose stale `config.terrain` contradicted its rolled
 * `config.terrainType` the gallery tile, the share card, the shared-dossier <head>
 * and the dossier meta line all showed the contradiction. All four now go through
 * domain/resolveTerrain.js — "the ONE terrain read" per its own docstring.
 *
 * THE SHIFT IS BIGGER THAN THE LANE BRIEF ASSUMED (measured here, not reasoned).
 * The brief expected fresh saves to be byte-identical because `terrain` no longer
 * persists. The executed negative control (the pre-fix chain planted back, 19 of
 * these 25 pins red) shows otherwise: because `config.terrain` was NEVER written
 * by any generator path, the old chain's FIRST leg was dead for every
 * wizard-generated settlement, so three of the four surfaces displayed NO terrain
 * at all. Routing them does not only correct legacy contradictions — it makes an
 * always-intended fact appear where it had silently gone missing. Each site
 * declares that in a comment beside its one vetoable line.
 *
 * WHAT IS PINNED
 *   1. Per routed site: a LEGACY-CONTRADICTION fixture resolves to the engine
 *      value, and a FRESH fixture (terrainType only, the shape every generated
 *      and regenerated save has) resolves to that same engine value rather than
 *      to the blank the dead first leg used to produce.
 *   2. The 'auto' UI sentinel never reaches a reader through the two server facet
 *      columns (gallery tile row.terrain, dossier.terrain) — the guard
 *      resolveTerrain.js documents for exactly those columns.
 *
 * The structural half — no routed file reads `config.terrain` again, and no fifth
 * reader appears anywhere under src/ — lives in the enforcer dir, at
 * tests/lint/terrainReadSingleSource.test.js.
 *
 * SCOPE NOTE (deliberate, not a gap): the PDF/Foundry lane reads
 * `resourceAnalysis.terrain` — a different, generator-written record — and is
 * untouched by the config-key shift. It is dispositioned in the lane report, not
 * here.
 */
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';

// ── Fixtures ────────────────────────────────────────────────────────────────
// The R-3 probe's exact contradiction: a legacy blob whose stale hand-written
// `terrain` disagrees with the terrain the engine actually rolled.
const LEGACY_CONTRADICTION = { terrainType: 'riverside', terrain: 'coastal' };
// What every generated / regenerated save carries after R-3 (no `terrain` key).
const FRESH = { terrainType: 'riverside' };

// ── supabase stub (gallery.js reaches sanitizeTile only through an RPC) ──────
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { from: vi.fn(), rpc: vi.fn(() => Promise.resolve({ data: [], error: null })) },
  isConfigured: true,
}));

// ── GalleryDetail's heavy children (mirrors tests/ui/galleryDetailRestore) ───
vi.mock('../../src/hooks/useIsMobile.js', () => ({ default: () => false }));
vi.mock('../../src/lib/seoDossier.js', () => ({ setSharedDossierMeta: vi.fn() }));
vi.mock('../../src/components/PublicDossierView.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryComments.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryMoreByCreator.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryImage.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryReactionChips.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/GalleryReportDialog.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/VoteButton.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/gallery/AlivenessBadge.jsx', () => ({ default: () => null }));
vi.mock('../../src/components/ShareToGallery.jsx', () => ({ default: () => null }));

const storeState = { savedSettlements: [] };
vi.mock('../../src/store/index.js', () => {
  function useStore(sel) { return sel(storeState); }
  useStore.subscribe = () => () => {};
  useStore.getState = () => storeState;
  return { useStore };
});

afterEach(() => { cleanup(); vi.clearAllMocks(); });

// ── Site 1 — src/lib/gallery.js sanitizeTile (the gallery listing tile) ──────
describe('P-6 · gallery tile terrain (src/lib/gallery.js)', () => {
  /** Drive sanitizeTile through the one RPC that maps rows straight to tiles. */
  async function tileFor(row) {
    const { supabase } = await import('../../src/lib/supabase.js');
    const { fetchMyGallery } = await import('../../src/lib/gallery.js');
    supabase.rpc.mockResolvedValueOnce({ data: [row], error: null });
    const { items } = await fetchMyGallery();
    return items[0];
  }

  it('a legacy save whose stale config.terrain contradicts terrainType shows the engine value', async () => {
    const tile = await tileFor({ id: 't1', name: 'Ashford', data: { config: LEGACY_CONTRADICTION } });
    expect(tile.terrain).toBe('riverside');
  });

  it('a fresh save (terrainType only) reads the engine terrain, where the dead first leg read blank', async () => {
    const tile = await tileFor({ id: 't2', name: 'Ashford', data: { config: FRESH } });
    expect(tile.terrain).toBe('riverside');
  });

  it('the server facet column still wins when it carries a real terrain', async () => {
    const tile = await tileFor({ id: 't3', name: 'Ashford', terrain: 'desert', data: { config: FRESH } });
    expect(tile.terrain).toBe('desert');
  });

  it("the facet column's 'auto' sentinel never reaches the tile", async () => {
    const tile = await tileFor({ id: 't4', name: 'Ashford', terrain: 'auto', data: { config: FRESH } });
    expect(tile.terrain).toBe('riverside');
  });

  it('a settlement with no terrain anywhere still reads as the empty string', async () => {
    const tile = await tileFor({ id: 't5', name: 'Ashford', data: { config: {} } });
    expect(tile.terrain).toBe('');
  });
});

// ── Site 2 — src/lib/shareImage.js (the client-rendered share card) ──────────
describe('P-6 · share-card terrain (src/lib/shareImage.js)', () => {
  it('resolves the engine value over a contradicting legacy key', async () => {
    const { settlementToShareSummary } = await import('../../src/lib/shareImage.js');
    expect(settlementToShareSummary({ name: 'Ashford', config: LEGACY_CONTRADICTION }).terrain)
      .toBe('riverside');
  });

  it('a fresh save now carries a terrain, and a terrain-less one still reads empty', async () => {
    const { settlementToShareSummary } = await import('../../src/lib/shareImage.js');
    expect(settlementToShareSummary({ name: 'Ashford', config: FRESH }).terrain).toBe('riverside');
    expect(settlementToShareSummary({ name: 'Ashford' }).terrain).toBe('');
  });

  it('the rendered card prints the resolved terrain, not the stale one', async () => {
    const { settlementToShareSummary, buildShareCardSvg } = await import('../../src/lib/shareImage.js');
    const svg = buildShareCardSvg(settlementToShareSummary({
      name: 'Ashford', tier: 'town', config: LEGACY_CONTRADICTION,
    }));
    expect(svg).toContain('Riverside');
    expect(svg).not.toContain('Coastal');
  });
});

// ── Site 3 — src/lib/seoDossier.js (the shared-dossier document head) ────────
describe('P-6 · shared-dossier head terrain (src/lib/seoDossier.js)', () => {
  /** @param {object} dossier */
  async function describeFor(dossier) {
    vi.resetModules();
    document.head.innerHTML = '';
    const { setSharedDossierMeta } = await vi.importActual('../../src/lib/seoDossier.js');
    setSharedDossierMeta(dossier);
    return document.querySelector('meta[property="og:description"]')?.getAttribute('content') || '';
  }

  it('describes a contradicting legacy save by its engine terrain', async () => {
    const text = await describeFor({ name: 'Ashford', slug: 'a1', settlement: { config: LEGACY_CONTRADICTION } });
    expect(text).toContain('riverside terrain');
    expect(text).not.toContain('coastal');
  });

  it('a fresh save now gets the "on <terrain> terrain" clause the dead first leg dropped', async () => {
    const text = await describeFor({ name: 'Ashford', slug: 'a1', settlement: { config: FRESH } });
    expect(text).toContain('riverside terrain');
  });

  it("a dossier-level 'auto' sentinel falls through to the resolved terrain", async () => {
    const text = await describeFor({ name: 'Ashford', slug: 'a1', terrain: 'auto', settlement: { config: FRESH } });
    expect(text).toContain('riverside terrain');
    expect(text).not.toContain('auto');
  });
});

// ── Site 4 — src/components/gallery/GalleryDetail.jsx (the dossier meta line) ─
describe('P-6 · gallery detail meta terrain (GalleryDetail.jsx)', () => {
  /** @param {object} config */
  async function renderWith(config) {
    const GalleryDetail = (await import('../../src/components/gallery/GalleryDetail.jsx')).default;
    render(
      <GalleryDetail
        dossier={{
          id: 'd1', slug: 'x', name: 'Ashford', tier: 'town',
          settlement: { name: 'Ashford', population: 500, config },
          tags: [], importable: false, netVotes: 0, viewCount: 0, commentCount: 0,
          voteState: {}, reactionState: {},
        }}
        auth={{ user: { id: 'u1' }, tier: 'anon' }}
        onNavigate={vi.fn()}
        onVote={vi.fn()}
      />,
    );
  }

  it('prints the engine terrain for a contradicting legacy save', async () => {
    await renderWith(LEGACY_CONTRADICTION);
    expect(screen.queryAllByText(/riverside/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/coastal/i)).toHaveLength(0);
  });

  it('a fresh save now shows a terrain in the meta line, where the dead first leg showed none', async () => {
    await renderWith(FRESH);
    expect(screen.queryAllByText(/riverside/i).length).toBeGreaterThan(0);
  });
});
