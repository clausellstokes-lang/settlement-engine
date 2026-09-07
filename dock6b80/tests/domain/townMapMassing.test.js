/**
 * tests/domain/townMapMassing.test.js — THE PROCEDURAL MASSING SUBSTRATE (Tranche M, M-0).
 *
 * Behavioural pins for the massing substrate (src/domain/townMap/massing.js): determinism
 * (same inputs ⇒ byte-equal ops), the SEAM dormancy (no shipped lens carries `massingSet`), the
 * op-count budget (a generous per-building ceiling catches a construction blow-up), and the
 * recognition-shape sanity for the signature institutions. The SILHOUETTE TOTALITY (every live
 * glyph kind maps to a composite spec, every component roof is a real form, footprints are
 * inscribed) lives in the enumerated walker tests/lint/townMapMassingSilhouette.walker.test.js.
 *
 * ⚰ TWO PINS WERE EXPRESSED THROUGH A CONSUMER THAT NO LONGER EXISTS (ODQ §725/§772). The
 * panorama draw surface was the only caller of this substrate, and it was retired with the
 * legacy settlement map; the "panorama scene is deterministic ×2" and "the seam only fires
 * when massingSet is present" tests went with it. NEITHER GUARANTEE WAS LOST, and it is worth
 * saying which is which: determinism is pinned DIRECTLY on `buildingMassingOps` by the first
 * test below, over every silhouette kind, which is the stronger statement — it was always the
 * substrate that had to be deterministic, and the panorama only carried the claim. The seam's
 * "it actually fires" half is retired rather than re-pinned, because the seam has no consumer
 * to fire INTO: what remains true, and is still asserted, is that no shipped lens names the
 * capability field. The substrate stays live for the town-scene building profiles.
 */
import { describe, expect, test } from 'vitest';
import {
  buildingMassingOps, makeCavalierProject, OBLIQUE_PROJ, SILHOUETTE_BY_KIND, silhouetteForKind,
} from '../../src/domain/townMap/massing.js';
import { resolveTownMapStyle, TOWN_MAP_LENS_IDS } from '../../src/design/townMapStyles.js';

const STYLE = resolveTownMapStyle('parchment');
const PROJECT = makeCavalierProject(OBLIQUE_PROJ);
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

});

describe('massing substrate — SEAM dormancy', () => {
  test('no shipped lens carries the massingSet capability field', () => {
    for (const id of TOWN_MAP_LENS_IDS) {
      expect(resolveTownMapStyle(id).massingSet, `${id} must not name massingSet`).toBeUndefined();
    }
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
  test('civic, military, rural, temporary, and ruined roles keep distinct massing', () => {
    expect(silhouetteForKind('guildhall').parts.length).toBeGreaterThanOrEqual(4);
    expect(silhouetteForKind('barracks').parts.length).toBeGreaterThanOrEqual(3);
    expect(silhouetteForKind('watchtower').parts[0].hMul).toBeGreaterThan(1.5);
    expect(silhouetteForKind('farmstead').parts.length).toBeGreaterThanOrEqual(2);
    expect(silhouetteForKind('encampment').parts.every(
      (part) => part.roof === 'spire',
    )).toBe(true);
    expect(silhouetteForKind('ruin-shell').parts.every(
      (part) => part.roof === 'flat',
    )).toBe(true);
  });
  test('the generic commons stay single-volume', () => {
    expect(silhouetteForKind('house-a').parts.length).toBe(1);
  });
});
