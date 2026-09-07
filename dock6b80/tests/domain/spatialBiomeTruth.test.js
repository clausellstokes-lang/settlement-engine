/**
 * spatialBiomeTruth.test.js — VISION WAVE V-6 BIOME TRUTH pins.
 *
 * The additive biome sub-digest (per-settlement biome id + terrain class, per-leg gate biome)
 * extracted at canonize from the captured pack's per-cell biome array, DARK behind the
 * biomeTexture opt-in. The pins:
 *   1. OMITTED (default) ⇒ NO biomes key ⇒ byte-identical to the pre-V-6 digest (the keystone
 *      golden's contract, restated at this seam).
 *   2. Lit ⇒ a deterministic, byte-stable biomes key; per-settlement biome is the PACK cell
 *      (biome truth, not invented); the key is appended LAST (never reorders the frozen shape).
 *   3. The road scene pulls biome/season texture from the digest's biomes + the corpus, and only
 *      when the digest carries biomes (dark ⇒ no texture ⇒ byte-identical read).
 */
import { describe, it, expect } from 'vitest';
import { buildSpatialDigest, BIOME_TEXTURE_VERSION } from '../../src/domain/spatial/index.js';
import { terrainClassOf } from '../../src/domain/spatial/spatialCost.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { composeRoadSceneBrief } from '../../src/domain/briefs/roadScene.js';

function fixture() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, 8);
  return { pack, placements };
}

describe('V-6 BIOME TRUTH — the biome sub-digest (opt-in; dark ⇒ byte-identical)', () => {
  it('OMITTED (default) ⇒ NO biomes key ⇒ byte-identical to biomeTexture:false', () => {
    const { pack, placements } = fixture();
    const d = buildSpatialDigest({ pack, placements });
    expect('biomes' in d).toBe(false);
    const dFalse = buildSpatialDigest({ pack, placements, biomeTexture: false });
    expect(JSON.stringify(d)).toBe(JSON.stringify(dFalse));
  });

  it('biomeTexture:true ⇒ a deterministic biomes key (per-settlement + per-leg)', () => {
    const { pack, placements } = fixture();
    const d = buildSpatialDigest({ pack, placements, biomeTexture: true });
    expect(d.biomes).toBeTruthy();
    expect(d.biomes.version).toBe(BIOME_TEXTURE_VERSION);
    for (const id of d.settlementIds) {
      const entry = d.biomes.bySettlement[id];
      expect(entry, `settlement ${id} carries a biome entry`).toBeTruthy();
      expect(typeof entry.terrain).toBe('string');
    }
    // Per-leg: one entry per gate (a primary hop), keyed by the gate pair key.
    expect(Object.keys(d.biomes.byLeg).length).toBe(d.gates.length);
    // Deterministic extraction: a second build is byte-identical.
    const d2 = buildSpatialDigest({ pack, placements, biomeTexture: true });
    expect(JSON.stringify(d.biomes)).toBe(JSON.stringify(d2.biomes));
  });

  it('per-settlement biome is the PACK cell (biome truth, never invented)', () => {
    const { pack, placements } = fixture();
    const d = buildSpatialDigest({ pack, placements, biomeTexture: true });
    for (const pl of placements) {
      const entry = d.biomes.bySettlement[String(pl.id)];
      if (!entry) continue; // resolveSeeds legitimately dropped it (not-land / shared-cell)
      expect(entry.biome).toBe(pack.cells.biome[pl.cellId]);
      expect(entry.terrain).toBe(terrainClassOf(pack.cells.h[pl.cellId], pack.cells.biome[pl.cellId]));
    }
  });

  it('the biomes key is appended LAST (never reorders the frozen digest shape)', () => {
    const { pack, placements } = fixture();
    const keys = Object.keys(buildSpatialDigest({ pack, placements, biomeTexture: true }));
    expect(keys[keys.length - 1]).toBe('biomes');
    expect(keys[keys.length - 2]).toBe('reserved');
  });
});

describe('V-6 BIOME TRUTH — the road scene reads biome/season texture (dark ⇒ silent)', () => {
  it('a biomeTexture canon ⇒ each hop carries a texture line; a plain canon ⇒ none', () => {
    const { pack, placements } = fixture();
    const settlements = placements.map((p) => ({ id: String(p.id), name: String(p.id) }));
    const litDigest = buildSpatialDigest({ pack, placements, biomeTexture: true });
    const darkDigest = buildSpatialDigest({ pack, placements });
    const origin = litDigest.settlementIds[0];
    const dest = Object.keys(litDigest.distanceMatrix[origin] || {})[0];
    expect(dest, 'the fixture has a connected pair to route').toBeTruthy();
    const mk = (digest) => composeRoadSceneBrief({
      originId: origin, destId: dest, settlements, regionalGraph: {}, tick: 100,
      // activeSpatialDigest requires a positive integer canon version alongside the digest.
      worldState: { spatialCanonVersion: 1, spatialDigest: digest, tick: 100, calendar: { elapsedWeeks: 100 } },
    });
    const litHops = (mk(litDigest).sections.find((s) => s.id === 'road')?.items || []).filter((it) => it.at);
    expect(litHops.length, 'the road has hops').toBeGreaterThan(0);
    expect(litHops.every((it) => typeof it.terrain === 'string' && it.terrain.length > 0),
      'each hop carries a biome/season texture line when lit').toBe(true);
    const darkHops = (mk(darkDigest).sections.find((s) => s.id === 'road')?.items || []).filter((it) => it.at);
    expect(darkHops.length, 'the dark road still has hops').toBeGreaterThan(0);
    expect(darkHops.every((it) => it.terrain === undefined),
      'no texture field when the digest carries no biomes (byte-identical)').toBe(true);
  });
});
