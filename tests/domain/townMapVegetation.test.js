/**
 * townMapVegetation.test.js — MF-T2L's acceptance battery (§287.5 · SPEC §10.6 / §10.5).
 *
 * SIX cases in ONE literal `describe` with straight-line, string-literal titles, and every loop
 * INSIDE a named test — the SP-D idiom the family's census law requires (preamble §P5), so this
 * file is CREDITED rather than parked and its titles are visible to the walker.
 *
 * ⭐ THE GUARD-THE-GUARD ARM IS FIRST (preamble §P6): the closed vocabulary is proved nonempty and
 * pinned by ORDER-SENSITIVE deep equality, and the law version is pinned to its exact literal,
 * BEFORE any membership refusal or derived position is asserted. If either silently emptied or
 * drifted, every arm below would pass on nothing — and the law version is load-bearing rather than
 * cosmetic: it is part of the derivation basis, so a drifted stamp moves every instance position.
 *
 * ⚠ NEGATIVES ARE THROW-ASSERTIONS AND MEMBERSHIP READS, never scanned matchers, so the §31 anchor
 * walker's ceiling of zero holds for this file by construction. `refusalOf` THROWS when nothing
 * threw, so a deleted refusal reds as behaviour rather than passing as an empty string.
 */
import { describe, expect, test } from 'vitest';
import {
  VEGETATION_FIELD_LAW_VERSION, VEGETATION_PHENOLOGY_CLASSES, vegetationFieldInstance,
  vegetationInstanceField, vegetationMass,
} from '../../src/domain/townMap/fabric/vegetation.js';
import { assertSupportAcyclicity, supportSurfaceRef } from '../../src/domain/townMap/fabric/supportSurface.js';
import { solidPartQ } from '../../src/domain/townMap/fabric/massPart.js';
import { solidOverlap } from '../../src/domain/townMap/fabric/solidLegality.js';

const TERRAIN = supportSurfaceRef({ kind: 'TERRAIN_FACE', patchId: 'p1' });
const SQUARE = [[0, 0], [100, 0], [100, 100], [0, 100]];
const WIDE = [[-200, -200], [300, -200], [300, 300], [-200, 300]];

/** The A1/A2 fixture, rebuilt per call so a refusal arm can vary exactly one field. */
const massInput = (over = {}) => ({
  bodyId: 'veg.oak.1',
  support: TERRAIN,
  trunk: { partId: 'veg.oak.1.trunk', footprint: SQUARE, vertical: { baseQ: 0, topQ: 3000 } },
  canopy: {
    canopyId: 'veg.oak.1.canopy', speciesClassId: 'species.oak', footprint: WIDE, topQ: 8000,
  },
  canopyAnchor: { trunkPartId: 'veg.oak.1.trunk', baseHeightAboveSupportQ: 3000 },
  phenologyClass: 'DECIDUOUS',
  ...over,
});

const fieldInput = (over = {}) => ({
  fieldKey: 'orchard-east',
  supportRegion: [[100, 300], [200, 300], [200, 450], [100, 450]],
  instanceCount: 10,
  speciesClassId: 'species.apple',
  phenologyClass: 'DECIDUOUS',
  ...over,
});

/** The refusal's message, or a THROW — an arm that silently returned is not evidence. */
const refusalOf = (/** @type {() => unknown} */ fn) => {
  try { fn(); } catch (error) { return String(/** @type {Error} */ (error).message); }
  throw new Error('expected a refusal, but the call returned a value');
};

describe('§287.5 / SPEC §10.6 · vegetation is a durable trunk/canopy mass AND a deterministic nonpersistent instance field', () => {
  test('guard-the-guard: the phenology vocabulary is closed and ordered and the derivation law is stamped, and only then does a full mass construct frozen and replay byte-identical', () => {
    expect(VEGETATION_PHENOLOGY_CLASSES.length).toBeGreaterThan(0);
    expect(Object.isFrozen(VEGETATION_PHENOLOGY_CLASSES)).toBe(true);
    expect([...VEGETATION_PHENOLOGY_CLASSES])
      .toEqual(['EVERGREEN', 'DECIDUOUS', 'DROUGHT_DECIDUOUS', 'BARREN']);
    expect(VEGETATION_FIELD_LAW_VERSION).toBe('mf-vegfield-era-uniform-rect-v1');

    const mass = vegetationMass(massInput());
    expect(mass.kind).toBe('VEGETATION');
    expect(mass.bodyId).toBe('veg.oak.1');
    expect(mass.phenologyClass).toBe('DECIDUOUS');
    for (const record of [mass, mass.trunk, mass.canopy, mass.canopy.solid, mass.canopyAnchor,
      mass.trunk.footprint, mass.trunk.vertical]) {
      expect(Object.isFrozen(record)).toBe(true);
    }
    expect(Object.keys(mass))
      .toEqual(['bodyId', 'kind', 'trunk', 'canopy', 'canopyAnchor', 'phenologyClass']);
    expect(JSON.stringify(vegetationMass(massInput()))).toBe(JSON.stringify(mass));
  });

  test('one derived ground authority reaches the trunk and the canopy alike, and every door to a second one is refused', () => {
    const mass = vegetationMass(massInput());
    expect(mass.trunk.supportSurfaceId).toBe('support:terrain-face:p1');
    expect(mass.canopy.solid.supportSurfaceId).toBe(mass.trunk.supportSurfaceId);
    expect(mass.canopy.ownerBodyId).toBe(mass.bodyId);
    expect(mass.canopy.solid.partId).toBe('veg.oak.1.canopy');
    expect(mass.canopy.solid.vertical.baseQ).toBe(mass.canopyAnchor.baseHeightAboveSupportQ);
    expect(mass.canopy.solid.vertical.topQ).toBe(8000);

    const alias = refusalOf(() => vegetationMass(massInput({
      support: { kind: 'TERRAIN_FACE', patchId: 'p1', surfaceId: 'support:terrain-face:p9' },
    })));
    expect(alias).toContain('"support:terrain-face:p9"');
    expect(alias).toContain('"support:terrain-face:p1"');
    expect(alias).toContain('not a free alias');

    const onTrunk = refusalOf(() => vegetationMass(massInput({
      trunk: {
        partId: 'veg.oak.1.trunk',
        supportSurfaceId: 'support:terrain-face:p9',
        footprint: SQUARE,
        vertical: { baseQ: 0, topQ: 3000 },
      },
    })));
    expect(onTrunk).toContain('vegetationMass.trunk.supportSurfaceId may not be supplied');
    expect(onTrunk).toContain('ONE ground authority');

    const onCanopy = refusalOf(() => vegetationMass(massInput({
      canopy: {
        canopyId: 'veg.oak.1.canopy',
        speciesClassId: 'species.oak',
        supportSurfaceId: 'support:terrain-face:p9',
        footprint: WIDE,
        topQ: 8000,
      },
    })));
    expect(onCanopy).toContain('vegetationMass.canopy.supportSurfaceId may not be supplied');

    const mismatch = refusalOf(() => vegetationMass(massInput({
      canopyAnchor: { trunkPartId: 'veg.elm.9.trunk', baseHeightAboveSupportQ: 3000 },
    })));
    expect(mismatch).toContain('"veg.elm.9.trunk"');
    expect(mismatch).toContain('"veg.oak.1.trunk"');
  });

  test('the walls this member does not re-spell arrive intact through its own constructions', () => {
    expect(refusalOf(() => vegetationMass(massInput({ phenologyClass: 'SEMI_DECIDUOUS' }))))
      .toContain('must be one of: EVERGREEN, DECIDUOUS, DROUGHT_DECIDUOUS, BARREN');

    expect(refusalOf(() => vegetationMass(massInput({
      support: { kind: 'MAINTAINED_FREE_SPACE', surfaceId: 'support:maintained-free-space:x' },
    })))).toContain('cannot construct MAINTAINED_FREE_SPACE in this era');

    expect(refusalOf(() => vegetationMass(massInput({
      canopy: {
        canopyId: 'veg.oak.1.canopy', speciesClassId: 'species.oak', footprint: WIDE, topQ: 3000,
      },
    })))).toContain('verticalIntervalQ [3000, 3000) is empty or inverted');

    expect(refusalOf(() => vegetationMass(massInput({
      trunk: {
        partId: 'veg.oak.1.trunk',
        footprint: [[0, 0], [100, 0], [200, 0]],
        vertical: { baseQ: 0, topQ: 3000 },
      },
    })))).toContain('zero exact signed area (degenerate ring)');

    const bare = massInput();
    delete bare.canopy;
    expect(refusalOf(() => vegetationMass(bare)))
      .toContain('vegetationMass input must carry canopy');
    expect(refusalOf(() => vegetationMass(massInput({ speciesClassId: 'species.oak' }))))
      .toContain('vegetationMass input.speciesClassId is not a field of this record');
    expect(refusalOf(() => vegetationMass('a tree'))).toContain('vegetationMass input must be an object');
  });

  test('the instance field is the known-count arm over the foundation\'s own rectangle law, and it re-validates its own output', () => {
    const field = vegetationInstanceField(fieldInput());
    expect(Object.isFrozen(field)).toBe(true);
    expect(Object.keys(field)).toEqual([
      'fieldKey', 'supportRegion', 'instanceCount', 'speciesClassId', 'phenologyClass',
    ]);
    expect(field.supportRegion).toEqual([[100, 300], [200, 300], [200, 450], [100, 450]]);
    expect(JSON.stringify(vegetationInstanceField(fieldInput()))).toBe(JSON.stringify(field));
    expect(JSON.stringify(vegetationInstanceField(field))).toBe(JSON.stringify(field));

    expect(refusalOf(() => vegetationInstanceField(fieldInput({
      supportRegion: [[100, 300], [210, 305], [200, 450], [100, 450]],
    })))).toContain('must be a non-empty canonical CCW rectangle');
    expect(refusalOf(() => vegetationInstanceField(fieldInput({
      supportRegion: [[100, 300], [100, 300], [100, 450], [100, 450]],
    })))).toContain('must be a non-empty canonical CCW rectangle');
    expect(refusalOf(() => vegetationInstanceField(fieldInput({
      supportRegion: [[100, 300], [200, 300], [200, 450]],
    })))).toContain('must contain four points');

    expect(refusalOf(() => vegetationInstanceField(fieldInput({ instanceCount: -1 }))))
      .toContain('vegetationInstanceField.instanceCount must be an integer in 0..');
    expect(refusalOf(() => vegetationInstanceField(fieldInput({ instanceCount: 2.5 }))))
      .toContain('vegetationInstanceField.instanceCount must be an integer in 0..');
    expect(vegetationInstanceField(fieldInput({ instanceCount: 0 })).instanceCount).toBe(0);

    expect(refusalOf(() => vegetationInstanceField(fieldInput({ phenologyClass: 'MIXED' }))))
      .toContain('must be one of: EVERGREEN, DECIDUOUS, DROUGHT_DECIDUOUS, BARREN');
    expect(refusalOf(() => vegetationInstanceField(fieldInput({ densityQ: 4 }))))
      .toContain('vegetationInstanceField input.densityQ is not a field of this record');
  });

  test('instances regenerate from (fieldKey, instanceIndex) alone, land inside the half-open region by construction, and carry no identity a receipt could name', () => {
    const field = vegetationInstanceField(fieldInput());

    // THE GOLDEN — exact derived integers, computed by executing this leaf at authoring. A drift
    // in hash32, in the basis spelling or in the law stamp reds here rather than silently moving
    // every tree in the estate. The region starts at 100/300 rather than 0/0 on purpose: a
    // derivation that dropped the region's base could not pass these by luck.
    expect(vegetationFieldInstance(field, 0).positionQ).toEqual([169, 376]);
    expect(vegetationFieldInstance(field, 7).positionQ).toEqual([165, 402]);

    const record = vegetationFieldInstance(field, 3);
    expect(Object.isFrozen(record)).toBe(true);
    expect(JSON.stringify(vegetationFieldInstance(field, 3))).toBe(JSON.stringify(record));
    expect(Object.keys(record)).toEqual([
      'fieldKey', 'instanceIndex', 'positionQ', 'speciesClassId', 'phenologyClass',
    ]);
    expect('instanceId' in record).toBe(false);
    expect('entityId' in record).toBe(false);
    expect('bodyId' in record).toBe(false);
    expect('artifactId' in record).toBe(false);

    for (let index = 0; index < field.instanceCount; index += 1) {
      const [xQ, zQ] = vegetationFieldInstance(field, index).positionQ;
      expect(xQ >= 100 && xQ < 200).toBe(true);
      expect(zQ >= 300 && zQ < 450).toBe(true);
      expect(Number.isSafeInteger(xQ) && Number.isSafeInteger(zQ)).toBe(true);
    }

    expect(refusalOf(() => vegetationFieldInstance(field, -1)))
      .toContain('vegetationFieldInstance.instanceIndex must be an integer in 0..9');
    expect(refusalOf(() => vegetationFieldInstance(field, 10)))
      .toContain('vegetationFieldInstance.instanceIndex must be an integer in 0..9');
    expect(refusalOf(() => vegetationFieldInstance(field, 1.5)))
      .toContain('vegetationFieldInstance.instanceIndex must be an integer in 0..9');

    const felled = vegetationInstanceField(fieldInput({ instanceCount: 0 }));
    for (const index of [0, 1, -1]) {
      expect(refusalOf(() => vegetationFieldInstance(felled, index)))
        .toContain('its instanceCount is 0, so the stand is known to be empty');
    }
  });

  test('the landed legality predicate and the landed acyclicity law consume this member\'s records with zero adaptation', () => {
    const tree = vegetationMass(massInput({
      trunk: { partId: 'veg.oak.1.trunk', footprint: SQUARE, vertical: { baseQ: 0, topQ: 50 } },
      canopy: {
        canopyId: 'veg.oak.1.canopy', speciesClassId: 'species.oak', footprint: SQUARE, topQ: 8000,
      },
      canopyAnchor: { trunkPartId: 'veg.oak.1.trunk', baseHeightAboveSupportQ: 50 },
    }));
    const building = solidPartQ({
      partId: 'bldg.1.range',
      supportSurfaceId: TERRAIN.surfaceId,
      footprint: SQUARE,
      vertical: { baseQ: 30, topQ: 80 },
    });
    const overlap = solidOverlap(tree.trunk, building);
    expect(overlap.kind).toBe('VOLUME');
    expect(overlap.verdict).toBe('OVERLAPPING');
    expect(overlap.sharedAreaQ).toEqual({ numQ: 10000n, denQ: 1n });
    expect(overlap.sharedHeightQ).toBe(20n);
    expect(overlap.sharedVolumeQ).toEqual({ numQ: 200000n, denQ: 1n });

    const tall = vegetationMass(massInput({
      bodyId: 'veg.oak.2',
      trunk: { partId: 'veg.oak.2.trunk', footprint: SQUARE, vertical: { baseQ: 0, topQ: 3000 } },
      canopy: {
        canopyId: 'veg.oak.2.canopy', speciesClassId: 'species.oak', footprint: SQUARE, topQ: 8000,
      },
      canopyAnchor: { trunkPartId: 'veg.oak.2.trunk', baseHeightAboveSupportQ: 3000 },
    }));
    const stacked = solidOverlap(tall.trunk, tall.canopy.solid);
    expect(stacked.sharedVolumeQ).toEqual({ numQ: 0n, denQ: 1n });
    expect(stacked.verdict).toBe('DISJOINT_OR_ABUTTING');

    const wallTop = supportSurfaceRef({
      kind: 'WALL_TOP', ownerBodyId: 'bldg.1', ownerPartId: 'bldg.1.wall', patchId: 'w1',
    });
    const ivy = vegetationMass(massInput({
      bodyId: 'veg.ivy.1',
      support: wallTop,
      trunk: { partId: 'veg.ivy.1.trunk', footprint: SQUARE, vertical: { baseQ: 0, topQ: 500 } },
      canopy: {
        canopyId: 'veg.ivy.1.canopy', speciesClassId: 'species.ivy', footprint: SQUARE, topQ: 900,
      },
      canopyAnchor: { trunkPartId: 'veg.ivy.1.trunk', baseHeightAboveSupportQ: 500 },
      phenologyClass: 'EVERGREEN',
    }));
    const refused = solidOverlap(ivy.trunk, building);
    expect(refused.kind).toBe('REFUSED');
    expect(refused.reason).toBe('DIFFERENT_SUPPORT_SURFACE');
    expect(refused.verdict).toBe(null);
    expect(refused.detail).toContain('need a registered connection');

    // §10.5's own example: a tree anchored to architecture. The roof face is owned by the
    // building part, so the support chain crosses families and the order must put it first.
    const roof = supportSurfaceRef({
      kind: 'ROOF_FACE', ownerBodyId: 'bldg.1', ownerPartId: 'bldg.1.range', patchId: 'r1',
    });
    const rooftop = vegetationMass(massInput({
      bodyId: 'veg.roof.1',
      support: roof,
      trunk: { partId: 'veg.roof.1.trunk', footprint: SQUARE, vertical: { baseQ: 0, topQ: 900 } },
      canopy: {
        canopyId: 'veg.roof.1.canopy', speciesClassId: 'species.rowan', footprint: WIDE, topQ: 2200,
      },
      canopyAnchor: { trunkPartId: 'veg.roof.1.trunk', baseHeightAboveSupportQ: 900 },
    }));
    expect(assertSupportAcyclicity([
      { partId: rooftop.trunk.partId, support: roof },
      { partId: 'bldg.1.range', support: TERRAIN },
    ]).orderedPartIds).toEqual(['bldg.1.range', 'veg.roof.1.trunk']);
  });
});
