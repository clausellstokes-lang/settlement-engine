/**
 * tests/domain/townMapMassing.test.js — THE PROCEDURAL MASSING SUBSTRATE (Tranche M, M-0).
 *
 * Behavioural pins for the massing substrate (src/domain/townMap/massing.js): determinism
 * (same inputs ⇒ byte-equal ops), the SEAM dormancy (no shipped lens carries `massingSet`, so
 * the panorama is byte-identical everywhere it ships — the temp-worktree byte diff proves the
 * base-vs-branch half of this at the gate), the op-count budget (a generous per-building ceiling
 * catches a construction blow-up), and the recognition-shape sanity for the signature
 * institutions. The SILHOUETTE TOTALITY (every live glyph kind maps to a composite spec, every
 * component roof is a real form, footprints are inscribed) lives in the enumerated walker
 * tests/lint/townMapMassingSilhouette.walker.test.js.
 */
import { describe, expect, test } from 'vitest';
import {
  buildingMassingOps, buildTownMapPanoramaDrawList, makeCavalierProject, OBLIQUE_PROJ,
  SILHOUETTE_BY_KIND, silhouetteForKind, resolveTownMapStyle, TOWN_MAP_LENS_IDS,
} from '../../src/domain/townMap/index.js';

const STYLE = resolveTownMapStyle('parchment');
const PROJECT = makeCavalierProject(OBLIQUE_PROJ);
/** A resolved style carrying the massing capability field (the seam trigger). */
const MASSING_STYLE = Object.freeze({ ...STYLE, massingSet: 'medieval', __resolved: true });

/** A minimal hand-built render model exercising the seam (a religious quarter + a mill). */
const MODEL = Object.freeze({
  meta: { tier: 'town' },
  frame: { water: null, roads: [] },
  districts: [{ id: 'd1', category: 'religious', polygon: [[400, 400], [600, 400], [600, 600], [400, 600]], centroid: { x: 500, y: 500 } }],
  buildings: [
    { anchorKey: 'b1', name: 'Cathedral', kind: 'landmark', districtId: 'd1', position: { x: 500, y: 470 } },
    { anchorKey: 'b2', name: 'Watermill', kind: 'landmark', districtId: 'd1', position: { x: 520, y: 530 } },
  ],
});

/** A generous per-building op ceiling — a keep (5 parts) or cathedral (3 parts + cross) sits
 *  well under this; a construction blow-up (runaway parts / features) trips it. */
const MASSING_OP_CEILING = 48;

const argsFor = (roofKind, anchorKey) => ({
  x: 500, y: 500, footprint: 12, height: 60, roofKind, color: '#7a5a2a', style: STYLE, project: PROJECT, seedId: 's', anchorKey,
});

describe('massing substrate — determinism', () => {
  test('same (building, style, projection) ⇒ byte-identical ops', () => {
    for (const kind of Object.keys(SILHOUETTE_BY_KIND)) {
      const a = buildingMassingOps(argsFor(kind, `k:${kind}`));
      const b = buildingMassingOps(argsFor(kind, `k:${kind}`));
      expect(JSON.stringify(a), `non-deterministic ops for ${kind}`).toBe(JSON.stringify(b));
    }
  });

  test('the panorama massing scene is deterministic ×2', () => {
    const a = buildTownMapPanoramaDrawList(MODEL, MASSING_STYLE);
    const b = buildTownMapPanoramaDrawList(MODEL, MASSING_STYLE);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
    expect(a.length).toBeGreaterThan(0);
  });
});

describe('massing substrate — SEAM dormancy', () => {
  test('no shipped lens carries the massingSet capability field', () => {
    for (const id of TOWN_MAP_LENS_IDS) {
      expect(resolveTownMapStyle(id).massingSet, `${id} must not name massingSet`).toBeUndefined();
    }
  });

  test('the seam only fires when massingSet is present (plain lens ≠ massing lens)', () => {
    const plain = buildTownMapPanoramaDrawList(MODEL, STYLE);
    const massed = buildTownMapPanoramaDrawList(MODEL, MASSING_STYLE);
    expect(JSON.stringify(plain)).not.toBe(JSON.stringify(massed));
  });
});

describe('massing substrate — op-count budget', () => {
  test('every institution silhouette stays under the per-building op ceiling', () => {
    for (const kind of Object.keys(SILHOUETTE_BY_KIND)) {
      const n = buildingMassingOps(argsFor(kind, `k:${kind}`)).length;
      expect(n, `${kind} emitted ${n} ops (ceiling ${MASSING_OP_CEILING})`).toBeLessThanOrEqual(MASSING_OP_CEILING);
      expect(n, `${kind} emitted no ops`).toBeGreaterThan(0);
    }
  });
});

describe('massing substrate — recognition shapes (the silhouette law)', () => {
  test('the cathedral is a multi-part cruciform with a cross', () => {
    const s = silhouetteForKind('spire');
    expect(s.parts.length, 'a cathedral needs multiple volumes').toBeGreaterThanOrEqual(3);
    expect(s.feat.some((f) => f.t === 'cross')).toBe(true);
  });
  test('the mill carries a wheel, the smithy a smoke feature, the keep corner towers', () => {
    expect(silhouetteForKind('wheelhouse').feat.some((f) => f.t === 'wheel')).toBe(true);
    expect(silhouetteForKind('forge').feat.some((f) => f.t === 'smoke')).toBe(true);
    expect(silhouetteForKind('towered-keep').parts.length).toBeGreaterThanOrEqual(5);
  });
  test('the generic commons stay single-volume', () => {
    expect(silhouetteForKind('house-a').parts.length).toBe(1);
  });
});
