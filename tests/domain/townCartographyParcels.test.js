/**
 * townCartographyParcels.test.js — TC-3b's carving, ordering, prominence binding and
 * byte band (docs/DESIGN_TOWN_CARTOGRAPHY.md §3, A-5, A-8, A-10).
 *
 * Every claim here runs against the REAL compiler: the districts are the ones a live
 * TownSceneManifest publishes, the wards are the ones TC-3a's leaf lowers, the parcels
 * are the ones TC-3b's leaf carves, and the institutions are the ones the manifest
 * already projected. A hand-written district literal would be a second settlement truth
 * living in the test suite, and the first time buildDistricts changed shape the pins
 * would keep passing against a map the product no longer produces.
 *
 * The two leaves are exercised THROUGH `compileLeaves`, which reproduces exactly the
 * order and the argument set `compileTownCartography` uses. A test that carved from
 * hand-made wards would prove the fan is a fan and nothing about the town.
 *
 *   B2 REPLAY     two compiles and reversed leaf inputs are byte-identical; the five
 *                 placement modes yield FOUR distinct bounded selections; a changed
 *                 digest moves the chaotic selection while the ward ids stay put; and
 *                 candidateCount exceeds parcelCount, so the selection is not vacuous
 *                 ("two runs agree" is trivially true of a stage that emits nothing).
 *   B3 GEOMETRY   the twenty-row map corpus: positive areas, triangles, containment,
 *                 sorted unique ids, caps honoured — plus the NEGATIVE CONTROLS that
 *                 prove each premise is actually checked, each with a restore control.
 *   B4 BINDING    every canonical institution binds exactly once, prominence bands
 *                 bite, roster order does not, an orphan throws, none of it persists.
 *   B5 BUDGET     the corpus stays under the EXACT per-tier byte band, the receipt is
 *                 a real recomputable measurement, and the selection digest is
 *                 domain-separated so a parcel choice cannot alias another draw.
 */
import { describe, expect, it } from 'vitest';

import {
  compileTownSceneManifest,
  sceneDigest,
  stableSceneStringify,
} from '../../src/domain/townScene/index.js';
import {
  scenePointInPolygon,
  scenePointSegmentDistanceSq,
  scenePolygonArea,
} from '../../src/domain/townScene/sceneCompilePrimitives.js';
import {
  bindCanonicalInstitutionsToParcels,
  compileTownParcelLayers,
} from '../../src/domain/townCartography/cartographyParcels.js';
import { compileTownWardLayers } from '../../src/domain/townCartography/cartographyWards.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
  cartographyTierIndex,
} from '../../src/domain/townCartography/cartographyTuning.js';
import { readTownMorphology } from '../../src/domain/townCartography/cartographyMorphology.js';
import { NAMING_DATA } from '../../src/data/namingData.js';
import { V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

const T = TOWN_CARTOGRAPHY_TUNING;
const LIT_RULES = { simulationRules: { townCartographyEnabled: true } };

/** The one walled+watered town every non-corpus pin runs against. */
const SUBJECT = V2_GOLDEN_CONFIGS.findIndex(
  (config) => config.spec.tier === 'city' && config.spec.walls === true,
);

/** Compile one corpus row through the ordinary domain entry point. */
function compileRow(index, audience = 'dm', lit = true) {
  return compileTownSceneManifest(
    {
      settlement: V2_GOLDEN_CONFIGS[index].settlement,
      mapEdits: V2_GOLDEN_CONFIGS[index].mapEdits ?? null,
      audience,
      ...(lit ? { worldState: LIT_RULES } : {}),
    },
    { namingPools: NAMING_DATA },
  );
}

/**
 * THE TWO LEAVES IN THE COMPILER'S OWN ORDER: wards first, then the carve inside
 * them, with the ward leaf's NAMED street container feeding the byte receipt. This is
 * `compileTownCartography`'s exact composition, rebuilt so a leaf-level pin measures
 * the real pipeline rather than an arrangement only the test knows how to make.
 */
function compileLeaves(input) {
  const wardLayers = compileTownWardLayers({
    districts: input.districts,
    streets: input.streets,
    settlement: input.settlement,
    digest: input.digest,
    tier: input.tier,
    namingPools: NAMING_DATA,
  });
  const parcelLayers = compileTownParcelLayers({
    districts: input.districts,
    wards: wardLayers.wards,
    streets: wardLayers.streets,
    buildings: input.buildings,
    digest: input.digest,
    tier: input.tier,
    placement: input.placement,
  });
  return {
    streets: wardLayers.streets,
    wards: wardLayers.wards,
    parcels: parcelLayers.parcels,
    institutionBindings: parcelLayers.institutionBindings,
    receipts: { ...wardLayers.receipts, ...parcelLayers.receipts },
  };
}

/** The exact argument set the compiler hands the leaves, rebuilt from a real manifest. */
function leafInputFor(index, audience = 'dm') {
  const settlement = V2_GOLDEN_CONFIGS[index].settlement;
  const manifest = compileRow(index, audience);
  return {
    manifest,
    input: {
      districts: manifest.districts,
      buildings: manifest.buildings,
      streets: manifest.cartography.streets,
      settlement,
      digest: manifest.source.mapModelDigest,
      tier: CARTOGRAPHY_TIERS[cartographyTierIndex(settlement.tier)],
      placement: readTownMorphology(settlement).placement,
    },
  };
}

/** A convex regular-ish polygon with `count` integer vertices around a centre. */
function convexRing(count, radius = 200, centre = 500) {
  /** @type {Array<[number, number]>} */
  const polygon = [];
  // Integer lattice ring: walk a diamond so no transcendental enters a fixture.
  for (let index = 0; index < count; index++) {
    const phase = (index * 4) / count;
    const leg = phase < 2 ? 1 - phase : phase - 3;
    const other = phase < 1 || phase >= 3 ? 1 - Math.abs(leg) : Math.abs(leg) - 1;
    polygon.push([
      Math.round(centre + radius * leg),
      Math.round(centre + radius * (phase < 2 ? other : -other)),
    ]);
  }
  return polygon;
}

/** A district row shaped exactly as buildDistricts emits one. */
function districtRow(id, footprint, centroid, category = 'civic') {
  return { id, category, footprint, centroid, densityPermille: 400 };
}

/** The empty TC-2 street container, for the synthetic-district negative controls. */
const NO_STREETS = { arterials: [], lanes: [], gateRefs: [], bridgeRefs: [] };

/**
 * A parcel vertex is legitimate when it lies INSIDE the ward or ON its boundary. The
 * subdivision cuts land on a ward edge by construction, and each axis is rounded to
 * an integer, so an on-edge point sits at most sqrt(0.5) from the exact edge. One
 * squared plan unit is therefore a sound boundary tolerance — and NOT a weakening:
 * a vertex that escaped the ward at all would miss every edge by far more.
 * @param {[number, number]} point
 * @param {Array<[number, number]>} polygon
 */
function withinWard(point, polygon) {
  if (scenePointInPolygon(point[0], point[1], polygon)) return true;
  for (let index = 0; index < polygon.length; index++) {
    const a = polygon[index];
    const b = polygon[(index + 1) % polygon.length];
    if (scenePointSegmentDistanceSq(point[0], point[1], a, b) <= 1) return true;
  }
  return false;
}

describe('TC-3b B2 — replay, order independence, and the anti-vacuity half', () => {
  it('two compiles of the same settlement are byte-identical in wards and parcels', () => {
    const first = compileRow(SUBJECT).cartography;
    const second = compileRow(SUBJECT).cartography;
    expect(first.wards.length).toBeGreaterThan(0);
    expect(first.parcels.length).toBeGreaterThan(0);
    expect(stableSceneStringify(second)).toBe(stableSceneStringify(first));
  });

  it('REVERSED leaf inputs produce the identical layers (order rides the data, not the array)', () => {
    const { input } = leafInputFor(SUBJECT);
    const forward = compileLeaves(input);
    const reversed = compileLeaves({
      ...input,
      districts: [...input.districts].reverse(),
      buildings: [...input.buildings].reverse(),
      streets: {
        ...input.streets,
        arterials: [...input.streets.arterials].reverse(),
        lanes: [...input.streets.lanes].reverse(),
      },
    });
    expect(reversed.parcels.length).toBeGreaterThan(0);
    expect(stableSceneStringify(reversed.wards)).toBe(stableSceneStringify(forward.wards));
    expect(stableSceneStringify(reversed.parcels)).toBe(stableSceneStringify(forward.parcels));
    expect(stableSceneStringify(reversed.institutionBindings))
      .toBe(stableSceneStringify(forward.institutionBindings));
  });

  it('a CHANGED digest moves the chaotic parcel selection (agreement is not vacuous)', () => {
    const { input } = leafInputFor(SUBJECT);
    const base = compileLeaves({ ...input, placement: 'dispersed_chaotic' });
    const moved = compileLeaves({
      ...input,
      placement: 'dispersed_chaotic',
      digest: `${input.digest}-moved`,
    });
    expect(moved.parcels.map((parcel) => parcel.id))
      .not.toEqual(base.parcels.map((parcel) => parcel.id));
    // Yet the WARDS themselves are state, not entropy: the same districts, either way.
    expect(moved.wards.map((ward) => ward.id)).toEqual(base.wards.map((ward) => ward.id));
  });

  it('every placement mode selects a bounded, deterministic subset of the same fan', () => {
    const { input } = leafInputFor(SUBJECT);
    /** @type {Map<string, string>} */
    const shapes = new Map();
    for (const placement of ['district', 'clustered', 'dispersed_orderly', 'dispersed_chaotic', 'nonsense']) {
      const once = compileLeaves({ ...input, placement });
      const twice = compileLeaves({ ...input, placement });
      expect(stableSceneStringify(twice.parcels), placement)
        .toBe(stableSceneStringify(once.parcels));
      expect(once.receipts.parcelCount, placement).toBe(once.parcels.length);
      expect(once.receipts.candidateCount, placement)
        .toBeGreaterThan(once.receipts.parcelCount);
      shapes.set(placement, once.parcels.map((parcel) => parcel.id).join('|'));
    }
    // An unknown placement falls back to `dispersed_orderly`, so five modes yield four
    // distinct selections; a single shape here would mean placement decided nothing.
    expect(new Set(shapes.values()).size).toBe(4);
    // FOURTH, NOT FIFTH — and specifically the ORDERLY arm. A bare count of four would
    // also pass if the unknown mode collapsed onto `district`, so the fallback's own
    // identity is pinned here, against a sibling it must NOT equal.
    expect(shapes.get('nonsense')).toBe(shapes.get('dispersed_orderly'));
    expect(shapes.get('nonsense')).not.toBe(shapes.get('district'));
  });
});

describe('TC-3b B3 — geometry and bounds over the twenty-row map corpus', () => {
  it('every fixture carves contained, positive-area, sorted, capped parcels', () => {
    /** @type {string[]} */
    const failures = [];
    for (let index = 0; index < V2_GOLDEN_CONFIGS.length; index++) {
      const settlement = V2_GOLDEN_CONFIGS[index].settlement;
      const tier = CARTOGRAPHY_TIERS[cartographyTierIndex(settlement.tier)];
      const block = compileRow(index).cartography;
      const label = `#${index} ${tier}`;
      const parcelIds = block.parcels.map((parcel) => parcel.id);
      if (parcelIds.join('|') !== [...parcelIds].sort().join('|')) failures.push(`${label} parcels unsorted`);
      if (new Set(parcelIds).size !== parcelIds.length) failures.push(`${label} parcels duplicated`);
      const byWard = new Map(block.wards.map((ward) => [ward.id, ward]));
      /** @type {Map<string, number>} */
      const perWard = new Map();
      for (const parcel of block.parcels) {
        perWard.set(parcel.wardId, (perWard.get(parcel.wardId) || 0) + 1);
        const ward = byWard.get(parcel.wardId);
        if (!ward) {
          failures.push(`${label} ${parcel.id} names no ward`);
          continue;
        }
        if (scenePolygonArea(parcel.polygon) <= 0) failures.push(`${label} ${parcel.id} zero area`);
        if (parcel.polygon.length !== 3) failures.push(`${label} ${parcel.id} is not a triangle`);
        if (!scenePointInPolygon(parcel.anchor[0], parcel.anchor[1], ward.polygon)) {
          failures.push(`${label} ${parcel.id} anchor outside its ward`);
        }
        for (const vertex of parcel.polygon) {
          if (!withinWard(vertex, ward.polygon)) {
            failures.push(`${label} ${parcel.id} vertex ${vertex.join(',')} escaped its ward`);
          }
        }
      }
      for (const [wardId, count] of perWard) {
        if (count > cartographyBand(T.PARCELS_PER_WARD, tier)) failures.push(`${label} ${wardId} over parcel cap`);
      }
      if (block.parcels.length === 0) failures.push(`${label} carved nothing`);
    }
    expect(failures).toEqual([]);
  }, 120_000);

  it('NEGATIVE CONTROL: a concave source, an outside centroid, and an over-cap source all throw the premise error', () => {
    const { input } = leafInputFor(SUBJECT);
    const square = [[100, 100], [300, 100], [300, 300], [100, 300]];
    /** @type {Array<[string, unknown[], string]>} */
    const breaks = [
      ['concave', [districtRow(
        'district.concave',
        [[0, 0], [400, 0], [200, 200], [400, 400], [0, 400]],
        [100, 200],
      )], 'is not convex'],
      ['outside centroid', [districtRow('district.adrift', square, [900, 900])], 'centroid outside'],
      ['over the vertex cap', [districtRow(
        'district.crowded',
        convexRing(T.MAXIMUM_WARD_VERTICES + 1),
        [500, 500],
      )], 'over the 8 cap'],
    ];
    for (const [label, districts, expected] of breaks) {
      expect(() => compileLeaves({ ...input, streets: NO_STREETS, districts, buildings: [] }), label)
        .toThrow(new RegExp(`townCartography TC-3 premise:.*${expected}`));
      expect(() => compileLeaves({ ...input, streets: NO_STREETS, districts, buildings: [] }), label)
        .toThrow(RangeError);
    }
    // RESTORE: the same call with a well-formed convex source succeeds, so the throws
    // above measured the broken premise rather than a broken call.
    const healthy = compileLeaves({
      ...input,
      streets: NO_STREETS,
      districts: [districtRow('district.sound', square, [200, 200])],
      buildings: [],
    });
    expect(healthy.wards.length).toBe(1);
    expect(healthy.parcels.length).toBeGreaterThan(0);
  });

  it('NEGATIVE CONTROL: more canonical districts than the tier ward cap is a premise error, never a truncation', () => {
    const { input } = leafInputFor(SUBJECT);
    const cap = cartographyBand(T.MAXIMUM_WARDS, 'thorp');
    const districts = [];
    for (let index = 0; index <= cap; index++) {
      districts.push(districtRow(
        `district.pad${String(index).padStart(2, '0')}`,
        [[100, 100], [300, 100], [300, 300], [100, 300]],
        [200, 200],
      ));
    }
    expect(() => compileLeaves({
      ...input, streets: NO_STREETS, tier: 'thorp', districts, buildings: [],
    })).toThrow(/townCartography TC-3 premise: \d+ canonical districts exceed the thorp ward cap/);
    // RESTORE: exactly at the cap it compiles, so the red above measured the overflow.
    const atCap = compileLeaves({
      ...input,
      streets: NO_STREETS,
      tier: 'thorp',
      districts: districts.slice(0, cap),
      buildings: [],
    });
    expect(atCap.wards.length).toBe(cap);
    expect(atCap.parcels.length).toBeGreaterThan(0);
  });
});

describe('TC-3b B4 — the institution binding is total, prominent, and unpersisted', () => {
  it('every eligible canonical institution binds exactly once, into its own district ward', () => {
    const { manifest, input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    const canonical = manifest.buildings.filter((row) => row.generatedFabric !== true);
    expect(canonical.length).toBeGreaterThan(0);
    expect(layers.institutionBindings.length).toBe(canonical.length);
    expect(layers.receipts.bindingCount).toBe(canonical.length);
    const parcelById = new Map(layers.parcels.map((parcel) => [parcel.id, parcel]));
    const anchors = new Set();
    for (const binding of layers.institutionBindings) {
      const source = canonical.find((row) => row.anchorKey === binding.anchorKey);
      expect(source, binding.anchorKey).toBeTruthy();
      expect(binding.institutionRef).toBe(source.semanticId);
      expect(binding.decidedBy).toBe('prominence');
      expect(binding.placement).toBe(input.placement);
      const parcel = parcelById.get(binding.parcelId);
      expect(parcel, binding.parcelId).toBeTruthy();
      expect(parcel.wardId).toBe(`ward:${source.districtId}`);
      expect(anchors.has(binding.anchorKey)).toBe(false);
      anchors.add(binding.anchorKey);
    }
    const sorted = [...layers.institutionBindings]
      .sort((a, b) => (a.institutionRef < b.institutionRef ? -1
        : a.institutionRef > b.institutionRef ? 1
          : a.anchorKey < b.anchorKey ? -1 : a.anchorKey > b.anchorKey ? 1 : 0));
    expect(layers.institutionBindings).toEqual(sorted);
  });

  it('a REVERSED roster binds identically, and one added institution moves no existing one', () => {
    const { manifest, input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    const reversed = compileLeaves({
      ...input,
      buildings: [...manifest.buildings].reverse(),
    });
    expect(stableSceneStringify(reversed.institutionBindings))
      .toBe(stableSceneStringify(layers.institutionBindings));

    const seed = manifest.buildings.find((row) => row.generatedFabric !== true);
    const grown = bindCanonicalInstitutionsToParcels({
      buildings: [...manifest.buildings, {
        ...seed,
        anchorKey: `${seed.anchorKey}.newcomer`,
        semanticId: `${seed.semanticId}.newcomer`,
      }],
      wards: layers.wards,
      parcels: layers.parcels,
      digest: input.digest,
      placement: input.placement,
    });
    expect(grown.length).toBe(layers.institutionBindings.length + 1);
    const before = new Map(layers.institutionBindings.map((row) => [row.anchorKey, row.parcelId]));
    for (const binding of grown) {
      if (!before.has(binding.anchorKey)) continue;
      expect(binding.parcelId, binding.anchorKey).toBe(before.get(binding.anchorKey));
    }
  });

  it('A-8 PROMINENCE: a larger footprint may only claim a larger parcel', () => {
    const { input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    const ward = layers.wards[0];
    const parcels = layers.parcels.filter((parcel) => parcel.wardId === ward.id);
    expect(parcels.length).toBeGreaterThanOrEqual(3);
    const byArea = [...parcels].sort((a, b) => scenePolygonArea(b.polygon) - scenePolygonArea(a.polygon));
    /** @param {number} side @returns {Array<[number, number]>} */
    const footprintOf = (side) => [[0, 0], [side, 0], [side, side]];
    /** @param {number} side @returns {string} */
    const bindOne = (side) => bindCanonicalInstitutionsToParcels({
      buildings: [{
        generatedFabric: false,
        semanticId: 'building:cat:probe',
        anchorKey: 'cat:probe',
        districtId: ward.districtId,
        footprint: footprintOf(side),
      }],
      wards: layers.wards,
      parcels: layers.parcels,
      digest: input.digest,
      placement: input.placement,
    })[0].parcelId;
    // side 40 -> area 800 (large), side 20 -> area 200 (medium), side 4 -> area 8 (small).
    const large = byArea.slice(0, Math.max(1, Math.ceil(byArea.length / 3))).map((p) => p.id);
    const medium = byArea.slice(0, Math.max(1, Math.ceil((byArea.length * 2) / 3))).map((p) => p.id);
    expect(scenePolygonArea(footprintOf(40))).toBeGreaterThanOrEqual(T.INSTITUTION_PROMINENCE_AREA_PLAN2.large);
    expect(scenePolygonArea(footprintOf(20))).toBeGreaterThanOrEqual(T.INSTITUTION_PROMINENCE_AREA_PLAN2.medium);
    expect(scenePolygonArea(footprintOf(4))).toBeLessThan(T.INSTITUTION_PROMINENCE_AREA_PLAN2.medium);
    expect(large).toContain(bindOne(40));
    expect(medium).toContain(bindOne(20));
    expect(parcels.map((p) => p.id)).toContain(bindOne(4));
    // Anti-vacuity: the bands are actually NARROWER than the ward, so "contains" bites.
    expect(large.length).toBeLessThan(parcels.length);
  });

  it('NEGATIVE CONTROL: an institution whose district lowered to no ward is a premise error, and none of this is persisted', () => {
    const { manifest, input } = leafInputFor(SUBJECT);
    const orphan = { ...manifest.buildings.find((row) => row.generatedFabric !== true), districtId: 'district.nowhere' };
    expect(() => compileLeaves({ ...input, buildings: [orphan] }))
      .toThrow(/townCartography TC-3 premise: canonical institution .* lowered to no ward/);
    // RESTORE: the untouched roster binds, so the red above measured the orphan.
    expect(compileLeaves(input).institutionBindings.length).toBeGreaterThan(0);

    // The binding is TC-4's input, not a TC-3 record: nothing about it reaches the block.
    const block = manifest.cartography;
    expectAbsentWithAnchor(Object.keys(block), 'institutionBindings', 'parcels', 'lit cartography block');
    const serialized = stableSceneStringify(block);
    expect(serialized.includes('"anchorKey"')).toBe(false);
    expect(serialized.includes('"institutionRef"')).toBe(false);
    // anchored: the two negatives above are measured against the SAME serialization,
    // which the positive below proves is a real, populated block rather than an empty
    // string that would satisfy any absence claim.
    expect(serialized.includes('"parcels"')).toBe(true);
  });
});

describe('TC-3b B5 — the byte band is exact and the domain is separated', () => {
  it('every corpus row measures under its EXACT per-tier TC-3 band', () => {
    /** @type {string[]} */
    const failures = [];
    for (let index = 0; index < V2_GOLDEN_CONFIGS.length; index++) {
      const { input } = leafInputFor(index);
      const layers = compileLeaves(input);
      const band = cartographyBand(T.TC3_LAYER_MAX_BYTES, input.tier);
      if (layers.receipts.byteBudget !== band) failures.push(`#${index} band ${layers.receipts.byteBudget} != ${band}`);
      if (!layers.receipts.withinBudget) failures.push(`#${index} over budget`);
      if (layers.receipts.bytes > band) failures.push(`#${index} ${layers.receipts.bytes} > ${band}`);
      if (layers.receipts.bytes <= 0) failures.push(`#${index} measured nothing`);
      if (layers.receipts.parcelCount !== layers.parcels.length) failures.push(`#${index} parcel receipt drift`);
    }
    expect(failures).toEqual([]);
  }, 120_000);

  it('the byte receipt is a REAL measurement of the emitted layers', () => {
    const { input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    const streetNames = [...layers.streets.arterials, ...layers.streets.lanes]
      .map((street) => ({ id: street.id, name: street.name }));
    const measured = new TextEncoder().encode(stableSceneStringify({
      streetNames,
      wards: layers.wards,
      parcels: layers.parcels,
    })).byteLength;
    expect(layers.receipts.bytes).toBe(measured);
    expect(measured).toBeGreaterThan(1000);
  });

  it('the selection digest is domain-separated, so a parcel choice cannot alias another draw', () => {
    // The binding domain is a LITERAL in the leaf; recomputing it here proves the
    // selection is a pure function of the named inputs and of nothing else.
    const { manifest, input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    const binding = layers.institutionBindings[0];
    const source = manifest.buildings.find((row) => row.anchorKey === binding.anchorKey);
    const wardId = `ward:${source.districtId}`;
    const eligible = layers.parcels.filter((parcel) => parcel.wardId === wardId);
    const stamps = eligible.map((parcel) => sceneDigest({
      domain: 'carto:institution-parcel',
      digest: input.digest,
      anchorKey: binding.anchorKey,
      institutionRef: binding.institutionRef,
      parcelId: parcel.id,
    }));
    expect(new Set(stamps).size).toBe(stamps.length);
    expect(eligible.map((parcel) => parcel.id)).toContain(binding.parcelId);
  });
});
