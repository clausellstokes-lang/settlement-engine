/**
 * TownSceneManifest — canonical whole-settlement scene projection.
 */

import { describe, expect, it } from 'vitest';

import {
  TOWN_SCENE_LIGHT_POLICY,
  compileTownSceneGeometry,
  compileTownSceneManifest,
  sceneDigest,
  stableSceneDigests,
  stableSceneStringify,
  townSceneLivingMarkerKind,
  validateTownSceneManifest,
} from '../../src/domain/townScene/index.js';
import { buildTownMapModel } from '../../src/domain/townMap/townMapModel.js';
import {
  normalizeMapEdits,
  withPinNudge,
  withSceneOverride,
} from '../../src/domain/townMap/mapEdits.js';
import {
  TOWN_SCENE_BUILDING_TARGET_BY_TIER,
} from '../../src/domain/townScene/sceneBuildingFabric.js';
import {
  GOLDEN_CONFIGS,
  makeTownFixture,
} from '../fixtures/townMapFixtures.js';

function ids(array, key = 'id') {
  return array.map((value) => value[key]);
}

function expectSortedUnique(array, key = 'id') {
  const values = ids(array, key);
  expect(values).toEqual([...values].sort());
  expect(new Set(values).size).toBe(values.length);
}

function pointInPolygon(x, z, polygon) {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const [xi, zi] = polygon[i];
    const [xj, zj] = polygon[j];
    const crosses = ((zi > z) !== (zj > z))
      && (x < ((xj - xi) * (z - zi)) / ((zj - zi) || 1) + xi);
    if (crosses) inside = !inside;
  }
  return inside;
}

function pointSegmentDistanceSq(px, pz, a, b) {
  const dx = b[0] - a[0];
  const dz = b[1] - a[1];
  const denominator = dx * dx + dz * dz;
  const t = denominator > 0
    ? Math.max(0, Math.min(1, ((px - a[0]) * dx + (pz - a[1]) * dz) / denominator))
    : 0;
  const qx = a[0] + t * dx;
  const qz = a[1] + t * dz;
  return (px - qx) ** 2 + (pz - qz) ** 2;
}

function footprintRadius(building) {
  return Math.max(...building.footprint.map(([x, z]) => (
    Math.hypot(x - building.renderCenter[0], z - building.renderCenter[1])
  )));
}

describe('TownSceneManifest — deterministic contract', () => {
  it('compiles a complete, valid, JSON-safe manifest without mutating inputs', () => {
    const settlement = makeTownFixture({
      tier: 'city',
      terrain: 'riverside',
      walls: true,
      water: true,
      seed: 'scene-contract',
    });
    const mapEdits = { layoutLawVersion: 2 };
    const beforeSettlement = JSON.stringify(settlement);
    const beforeEdits = JSON.stringify(mapEdits);

    const first = compileTownSceneManifest({
      settlement,
      mapEdits,
      worldState: { calendar: { season: 'winter', year: 4, elapsedWeeks: 170 }, rngSeed: 'world-season' },
      audience: 'dm',
    });
    const second = compileTownSceneManifest({
      settlement,
      mapEdits,
      worldState: { calendar: { season: 'winter', year: 4, elapsedWeeks: 170 }, rngSeed: 'world-season' },
      audience: 'dm',
    });

    expect(validateTownSceneManifest(first)).toEqual({ ok: true, errors: [] });
    expect(stableSceneStringify(first)).toBe(stableSceneStringify(second));
    expect(sceneDigest(first)).toBe(sceneDigest(second));
    expect(JSON.stringify(settlement)).toBe(beforeSettlement);
    expect(JSON.stringify(mapEdits)).toBe(beforeEdits);
    expect(first.kind).toBe('TownSceneManifest');
    expect(first.source.audience).toBe('dm');
    expect(first.terrain.heights).toHaveLength(33 * 33);
    expect(first.buildings.length).toBeGreaterThan(0);
    expect(first.districts.length).toBeGreaterThan(0);
    expect(first.cameraPresets.map((camera) => camera.id)).toEqual([
      'district', 'landmark', 'overview', 'plan', 'street',
    ]);
  });

  it('canonicalizes every identity-bearing collection', () => {
    const manifest = compileTownSceneManifest({
      settlement: makeTownFixture({ tier: 'metropolis', terrain: 'plains', walls: true, seed: 'scene-order' }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    for (const field of ['districts', 'roads', 'walls', 'gates', 'bridges', 'quays', 'buildings', 'vegetation', 'materials', 'provenance', 'cameraPresets']) {
      expectSortedUnique(manifest[field]);
    }
    expectSortedUnique(manifest.semantics, 'sceneId');
    expectSortedUnique(manifest.living.conditions);
    expectSortedUnique(manifest.living.scars);
    expectSortedUnique(manifest.living.reconstruction);
  });

  it('fails closed on malformed records and unresolved internal joins', () => {
    const settlement = {
      ...makeTownFixture({
        tier: 'city',
        terrain: 'riverside',
        walls: true,
        water: true,
        seed: 'scene-invalid-joins',
      }),
      activeConditions: [{
        id: 'condition.shortage',
        archetype: 'shortage',
        label: 'Shortage',
        severity: 0.6,
        severityBand: 'high',
      }],
    };
    const manifest = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const corruptions = [
      {
        label: 'road shape',
        mutate: (value) => { delete value.roads[0].centerline; },
      },
      {
        label: 'building semantic join',
        mutate: (value) => { value.buildings[0].semanticId = 'ghost:building'; },
      },
      {
        label: 'road material join',
        mutate: (value) => { value.roads[0].materialId = 'material:missing'; },
      },
      {
        label: 'wall gate join',
        mutate: (value) => { value.walls[0].gateIds = ['gate:missing']; },
      },
      {
        label: 'living target join',
        mutate: (value) => { value.living.conditions[0].buildingIds = ['building:missing']; },
      },
      {
        label: 'semantic canonical shape',
        mutate: (value) => { value.semantics[0].canonicalRef = null; },
      },
      {
        label: 'declared building budget',
        mutate: (value) => { value.budgets.maximumBuildings = 1; },
      },
    ];

    for (const corruption of corruptions) {
      const invalid = structuredClone(manifest);
      corruption.mutate(invalid);
      const result = validateTownSceneManifest(invalid);
      expect(result.ok, `${corruption.label}: ${result.errors.join('; ')}`).toBe(false);
    }

    const invalidRoad = structuredClone(manifest);
    invalidRoad.roads[0] = { id: invalidRoad.roads[0].id };
    expect(() => compileTownSceneGeometry(invalidRoad)).toThrow(/TownSceneManifest invalid/);
  });

  it('is total across the existing tier/terrain/wall/water corpus', () => {
    for (const fixture of GOLDEN_CONFIGS) {
      const manifest = compileTownSceneManifest({
        settlement: fixture.settlement,
        mapEdits: { layoutLawVersion: 2 },
        audience: 'dm',
      });
      const result = validateTownSceneManifest(manifest);
      expect(result.ok, `${fixture.spec.tier}/${fixture.spec.terrain}: ${result.errors.join('; ')}`).toBe(true);
      const model = buildTownMapModel(fixture.settlement, { layoutLawVersion: 2 });
      expect(manifest.buildings).toHaveLength(
        TOWN_SCENE_BUILDING_TARGET_BY_TIER[fixture.spec.tier],
      );
      const manifestAnchors = new Set(
        manifest.buildings.map((building) => building.anchorKey),
      );
      for (const building of model.buildings) {
        expect(manifestAnchors.has(building.anchorKey)).toBe(true);
      }
    }
  });
});

describe('TownSceneManifest — 2D plan remains authority', () => {
  it('preserves every district/building identity and exact post-pin plan anchor', () => {
    const settlement = makeTownFixture({ tier: 'town', terrain: 'plains', walls: true, seed: 'scene-plan-authority' });
    const baseModel = buildTownMapModel(settlement, { layoutLawVersion: 2 });
    const target = baseModel.buildings[0];
    const edits = withPinNudge({ layoutLawVersion: 2 }, target.anchorKey, 23, -11);
    const model = buildTownMapModel(settlement, edits);
    const manifest = compileTownSceneManifest({ settlement, mapEdits: edits, audience: 'dm' });

    expect(manifest.districts.map((district) => district.id)).toEqual(
      model.districts.map((district) => district.id).sort(),
    );
    const suppliedBuildings = manifest.buildings.filter(
      (building) => building.generatedFabric === false,
    );
    expect(suppliedBuildings.map((building) => building.anchorKey)).toEqual(
      model.buildings.map((building) => building.anchorKey).sort(),
    );
    for (const building of suppliedBuildings) {
      const source = model.buildings.find((candidate) => candidate.anchorKey === building.anchorKey);
      expect(building.mapAnchor).toEqual([source.position.x, source.position.y]);
      expect(building.renderCenter).toEqual(building.mapAnchor);
    }
  });

  it('scene overrides change only bounded presentation fields, never the map anchor', () => {
    const settlement = makeTownFixture({ tier: 'town', seed: 'scene-override' });
    const model = buildTownMapModel(settlement, { layoutLawVersion: 2 });
    const anchor = model.buildings[0].anchorKey;
    let edits = normalizeMapEdits({ layoutLawVersion: 2 });
    edits = withSceneOverride(edits, anchor, {
      variantId: 'mirror',
      skinId: 'marbleTemple',
      headingOffsetStep: 3,
    });
    const baseline = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const changed = compileTownSceneManifest({ settlement, mapEdits: edits, audience: 'dm' });
    const before = baseline.buildings.find((building) => building.anchorKey === anchor);
    const after = changed.buildings.find((building) => building.anchorKey === anchor);

    expect(after.mapAnchor).toEqual(before.mapAnchor);
    expect(after.renderCenter).toEqual(before.renderCenter);
    expect(after.variantId).toBe('mirror');
    expect(after.skinId).toBe('marbleTemple');
    expect(after.headingStep).toBe((before.headingStep + 3) % 16);
    expect(changed.source.structureDigest).not.toBe(baseline.source.structureDigest);
  });
});

describe('TownSceneManifest — complete inhabited fabric', () => {
  it('scales to exact bounded building targets across every settlement tier', () => {
    const counts = [];
    for (const tier of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
      const manifest = compileTownSceneManifest({
        settlement: makeTownFixture({
          tier,
          terrain: 'plains',
          walls: true,
          seed: `scene-fabric-scale-${tier}`,
        }),
        mapEdits: { layoutLawVersion: 2 },
        audience: 'dm',
      });
      counts.push(manifest.buildings.length);
      expect(manifest.buildings).toHaveLength(
        TOWN_SCENE_BUILDING_TARGET_BY_TIER[tier],
      );
      expect(manifest.budgets.maximumBuildings).toBe(manifest.buildings.length);
    }
    expect(counts).toEqual([18, 30, 54, 96, 176, 200]);
  });

  it('keeps every fabric footprint inside its district with district-resolving semantics', () => {
    const manifest = compileTownSceneManifest({
      settlement: makeTownFixture({
        tier: 'metropolis',
        terrain: 'plains',
        walls: true,
        seed: 'scene-fabric-districts',
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const districts = new Map(
      manifest.districts.map((district) => [district.id, district]),
    );
    const semantics = new Map(
      manifest.semantics.map((semantic) => [semantic.sceneId, semantic]),
    );
    const fabric = manifest.buildings.filter((building) => building.generatedFabric);
    expect(fabric.length).toBeGreaterThan(170);
    for (const building of fabric) {
      const district = districts.get(building.districtId);
      expect(building.anchorKey).toMatch(/^fabric:district\.[a-z0-9_]+:\d{3}$/);
      expect(district).toBeTruthy();
      expect(building.footprint.every(([x, z]) => (
        pointInPolygon(x, z, district.footprint)
      ))).toBe(true);
      expect(semantics.get(building.semanticId)).toMatchObject({
        entityKind: 'building',
        districtId: building.districtId,
        canonicalRef: {
          kind: 'district-fabric',
          id: building.anchorKey,
          districtId: building.districtId,
        },
      });
    }
  });

  it('rejects fabric collisions with structures, roads, water, and walls', () => {
    const manifest = compileTownSceneManifest({
      settlement: makeTownFixture({
        tier: 'town',
        terrain: 'riverside',
        water: true,
        walls: true,
        seed: 'scene-fabric-clearance',
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const fabric = manifest.buildings.filter((building) => building.generatedFabric);
    for (const building of fabric) {
      const radius = footprintRadius(building);
      for (const other of manifest.buildings) {
        if (other.id === building.id) continue;
        const dx = building.renderCenter[0] - other.renderCenter[0];
        const dz = building.renderCenter[1] - other.renderCenter[1];
        const separationMargin = other.generatedFabric === true ? 0.75 : 2;
        expect(Math.hypot(dx, dz) + 1e-6).toBeGreaterThanOrEqual(
          radius + footprintRadius(other) + separationMargin,
        );
      }
      for (const road of manifest.roads) {
        const clearance = radius + road.widthPlan / 2 + 2;
        for (let i = 0; i < road.centerline.length - 1; i++) {
          expect(
            pointSegmentDistanceSq(
              building.renderCenter[0],
              building.renderCenter[1],
              road.centerline[i],
              road.centerline[i + 1],
            ) + 1e-6,
          ).toBeGreaterThanOrEqual(clearance * clearance);
        }
      }
      for (const water of manifest.terrain.waterBodies) {
        const clearance = radius + water.widthPlan / 2 + 4;
        for (let i = 0; i < water.path.length - 1; i++) {
          expect(
            pointSegmentDistanceSq(
              building.renderCenter[0],
              building.renderCenter[1],
              water.path[i],
              water.path[i + 1],
            ) + 1e-6,
          ).toBeGreaterThanOrEqual(clearance * clearance);
        }
      }
      for (const wall of manifest.walls) {
        const clearance = radius + wall.widthCm / manifest.space.planUnitCm / 2 + 3;
        expect(
          pointSegmentDistanceSq(
            building.renderCenter[0],
            building.renderCenter[1],
            wall.centerline[0],
            wall.centerline[1],
          ) + 1e-6,
        ).toBeGreaterThanOrEqual(clearance * clearance);
      }
    }
  });

  it('emits coast surfaces plus deterministic bridge/causeway and quay records', () => {
    const coastal = compileTownSceneManifest({
      settlement: makeTownFixture({
        tier: 'city',
        terrain: 'coastal',
        water: true,
        seed: 'scene-coast-vocabulary',
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    expect(coastal.terrain.waterBodies[0].surfacePolygon.length).toBeGreaterThanOrEqual(4);
    expect(coastal.bridges.some((bridge) => bridge.kind === 'causeway')).toBe(true);
    expect(coastal.quays.length).toBeGreaterThan(0);
    for (const record of [...coastal.bridges, ...coastal.quays]) {
      expect(coastal.semantics.some((semantic) => semantic.sceneId === record.id)).toBe(true);
    }
  });
});

describe('TownSceneManifest — living layers and cache axes', () => {
  it('keeps conditions, precise scars, reconstruction, and atmosphere separate', () => {
    const settlement = {
      ...makeTownFixture({ tier: 'town', walls: true, seed: 'scene-living' }),
      activeConditions: [{
        id: 'condition.food-shortage',
        archetype: 'shortage',
        label: 'Food is scarce',
        severity: 0.7,
        severityBand: 'high',
      }],
      urbanFabric: {
        scars: [{ kind: 'siege', severity: 0.8, week: 12, wallSegmentId: 0 }],
        rebirths: [{ classes: ['merchant'], type: 'fire', week: 13 }],
      },
    };
    const manifest = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      worldState: { calendar: { season: 'autumn', year: 2, elapsedWeeks: 70 }, rngSeed: 'living-world' },
      audience: 'dm',
    });

    expect(manifest.living.conditions.some((condition) => (
      condition.id === 'condition:condition.food-shortage'
      && condition.archetype === 'shortage'
    ))).toBe(true);
    expect(manifest.living.scars).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'siege', wallId: 'wall:0', week: 12 }),
    ]));
    expect(manifest.living.reconstruction).toEqual(expect.arrayContaining([
      expect.objectContaining({ type: 'fire', week: 13 }),
    ]));
    expect(manifest.living.atmosphere.season).toBe('autumn');
    expect(manifest.living).not.toHaveProperty('events');
    const semantics = new Map(
      manifest.semantics.map((semantic) => [semantic.sceneId, semantic]),
    );
    for (const condition of manifest.living.conditions) {
      expect(semantics.get(condition.id)).toMatchObject({
        entityKind: condition.kind === 'condition' ? 'condition' : 'hazard',
        canonicalRef: { id: condition.id },
      });
    }
    for (const scar of manifest.living.scars) {
      expect(semantics.get(scar.id)).toMatchObject({
        entityKind: 'scar',
        canonicalRef: {
          kind: 'living-scar',
          id: scar.id,
          wallId: scar.wallId,
        },
      });
    }
    for (const rebuild of manifest.living.reconstruction) {
      expect(semantics.get(rebuild.id)).toMatchObject({
        entityKind: 'reconstruction',
        canonicalRef: {
          kind: 'living-reconstruction',
          id: rebuild.id,
          districtIds: rebuild.districtIds,
        },
      });
    }
  });

  it('a season change invalidates dress, not structural geometry', () => {
    const settlement = makeTownFixture({ tier: 'village', terrain: 'forest', seed: 'scene-cache-axes' });
    const spring = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      worldState: { calendar: { season: 'spring', year: 1 }, rngSeed: 'weather' },
      audience: 'dm',
    });
    const winter = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      worldState: { calendar: { season: 'winter', year: 1 }, rngSeed: 'weather' },
      audience: 'dm',
    });
    expect(spring.source.mapModelDigest).toBe(winter.source.mapModelDigest);
    expect(spring.source.structureDigest).toBe(winter.source.structureDigest);
    expect(spring.source.dressDigest).not.toBe(winter.source.dressDigest);
    expect(stableSceneDigests(spring)).toEqual({
      manifestDigest: sceneDigest(spring),
      structureDigest: spring.source.structureDigest,
      dressDigest: spring.source.dressDigest,
    });
  });

  it('projects the complete bounded living vocabulary from authorized state', () => {
    const settlement = {
      ...makeTownFixture({
        tier: 'town',
        walls: true,
        seed: 'scene-living-vocabulary',
      }),
      activeConditions: [
        {
          id: 'occupation',
          archetype: 'occupation_resistance',
          label: 'An occupying authority holds the gates',
          severity: 0.8,
        },
        {
          id: 'abandonment',
          archetype: 'abandonment',
          label: 'Homes stand abandoned',
          severity: 0.7,
        },
        {
          id: 'neglect',
          archetype: 'custom_crisis',
          label: 'Long neglect marks the ward',
          severity: 0.6,
        },
        {
          id: 'repair',
          archetype: 'siege_lifted',
          label: 'Repairs begin along the wall',
          severity: 0.5,
        },
        {
          id: 'construction',
          archetype: 'reconstruction',
          label: 'Construction crews rebuild the market',
          severity: 0.9,
        },
        {
          id: 'burning-ward',
          archetype: 'fire',
          label: 'Fire burns through the ward',
          severity: 0.8,
        },
        {
          id: 'river-flood',
          archetype: 'flood',
          label: 'Flood waters cover the lower streets',
          severity: 0.7,
        },
        {
          id: 'sickness',
          archetype: 'plague',
          label: 'Plague has closed the market',
          severity: 0.6,
        },
        {
          id: 'encirclement',
          archetype: 'siege',
          label: 'The settlement is under siege',
          severity: 0.9,
        },
      ],
      urbanFabric: {
        scars: [{ kind: 'siege_repairs', severity: 0.6, week: 4 }],
        rebirths: [{ classes: ['merchant'], type: 'rebuilding', week: 5 }],
      },
    };
    const manifest = compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const profile = manifest.buildings[0].conditionProfile;
    expect(profile).toMatchObject({
      corruptionCovert: 0,
      occupation: expect.any(Number),
      abandonment: expect.any(Number),
      neglect: expect.any(Number),
      repair: expect.any(Number),
      construction: expect.any(Number),
    });
    for (const field of [
      'occupation',
      'abandonment',
      'neglect',
      'repair',
      'construction',
    ]) {
      expect(profile[field]).toBeGreaterThan(0);
    }

    const markerKinds = manifest.living.conditions.map(
      (condition) => townSceneLivingMarkerKind(condition, 'condition'),
    );
    expect(markerKinds).toEqual(expect.arrayContaining([
      'occupation',
      'abandonment',
      'neglect',
      'repair',
      'construction',
      'fire',
      'flood',
      'plague',
      'siege',
    ]));
    expect(townSceneLivingMarkerKind({
      id: 'condition.fire-is-only-an-opaque-id',
      kind: 'condition',
      archetype: 'custom_crisis',
      label: 'An undisclosed disturbance',
    }, 'condition')).toBe('condition');
    const occupation = manifest.living.conditions.find(
      (condition) => townSceneLivingMarkerKind(condition, 'condition') === 'occupation',
    );
    expect(occupation.wallIds).toEqual(manifest.walls.map((wall) => wall.id));
    expect(manifest.living.scars).not.toHaveLength(0);
    expect(manifest.living.reconstruction).not.toHaveLength(0);
  });

  it('uses fixed authored daylight because canonical state has no day-phase axis', () => {
    const settlement = makeTownFixture({
      tier: 'village',
      terrain: 'forest',
      seed: 'scene-fixed-light',
    });
    const compileAt = (calendar) => compileTownSceneManifest({
      settlement,
      mapEdits: { layoutLawVersion: 2 },
      worldState: {
        rngSeed: 'fixed-light-world',
        calendar: { season: 'summer', year: 2, ...calendar },
      },
      audience: 'dm',
    });
    const allegedDawn = compileAt({ hour: 6, timeOfDay: 'dawn' });
    const allegedNight = compileAt({ hour: 23, timeOfDay: 'night' });
    expect(TOWN_SCENE_LIGHT_POLICY).toBe('fixed-authored-daylight');
    expect(stableSceneStringify(allegedDawn)).toBe(
      stableSceneStringify(allegedNight),
    );
  });

  it('varies ordinary building silhouettes deterministically within a bounded vocabulary', () => {
    const input = {
      settlement: makeTownFixture({
        tier: 'city',
        terrain: 'plains',
        seed: 'scene-commons-diversity',
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: /** @type {const} */ ('dm'),
    };
    const first = compileTownSceneManifest(input);
    const second = compileTownSceneManifest(input);
    const firstCommons = first.buildings.filter((building) => building.generatedFabric);
    const secondCommons = second.buildings.filter((building) => building.generatedFabric);
    const vocabulary = new Set(['house-a', 'house-b', 'house-c', 'massing']);

    expect(firstCommons).not.toHaveLength(0);
    expect(firstCommons.map((building) => ({
      id: building.id,
      shapeKind: building.shapeKind,
      variantId: building.variantId,
    }))).toEqual(secondCommons.map((building) => ({
      id: building.id,
      shapeKind: building.shapeKind,
      variantId: building.variantId,
    })));
    expect(new Set(firstCommons.map((building) => building.shapeKind)).size)
      .toBeGreaterThanOrEqual(3);
    expect(firstCommons.every((building) => vocabulary.has(building.shapeKind)))
      .toBe(true);
  });

  it('uses district wealth to choose a bounded domestic material vocabulary', () => {
    const manifest = compileTownSceneManifest({
      settlement: makeTownFixture({
        tier: 'city',
        terrain: 'plains',
        seed: 'scene-commons-wealth-material',
        quarters: [
          {
            name: 'Highmanor Hill',
            location: 'hilltop',
            desc: 'noble estates',
            landmarks: ['Manor House'],
          },
          {
            name: 'Commoner Rows',
            location: 'outer',
            desc: 'tenement homestead district',
            landmarks: ['Well Square'],
          },
        ],
      }),
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const wealthyDistrictIds = new Set(
      manifest.districts
        .filter((district) => ['wealthy', 'opulent'].includes(district.wealthBand))
        .map((district) => district.id),
    );
    const ordinaryDistrictIds = new Set(
      manifest.districts
        .filter((district) => !wealthyDistrictIds.has(district.id))
        .map((district) => district.id),
    );
    const wealthyCommons = manifest.buildings.filter(
      (building) => building.generatedFabric
        && wealthyDistrictIds.has(building.districtId),
    );
    const ordinaryCommons = manifest.buildings.filter(
      (building) => building.generatedFabric
        && ordinaryDistrictIds.has(building.districtId),
    );

    expect(wealthyCommons).not.toHaveLength(0);
    expect(ordinaryCommons).not.toHaveLength(0);
    expect(wealthyCommons.every((building) => building.skinId === 'stoneAshlar'))
      .toBe(true);
    expect(ordinaryCommons.every((building) => building.skinId === 'timberVillage'))
      .toBe(true);
  });

  it('scopes explicitly targeted condition treatment while global rows remain global', () => {
    const baseSettlement = makeTownFixture({
      tier: 'town',
      terrain: 'plains',
      seed: 'scene-targeted-condition',
    });
    const baseline = compileTownSceneManifest({
      settlement: baseSettlement,
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const targetDistrictId = baseline.districts[0].id;
    const targeted = compileTownSceneManifest({
      settlement: {
        ...baseSettlement,
        activeConditions: [{
          id: 'targeted-abandonment',
          archetype: 'abandonment',
          label: 'Only this ward is abandoned',
          severity: 0.8,
          districtId: targetDistrictId,
        }],
      },
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });
    const global = compileTownSceneManifest({
      settlement: {
        ...baseSettlement,
        activeConditions: [{
          id: 'global-abandonment',
          archetype: 'abandonment',
          label: 'The settlement is abandoned throughout',
          severity: 0.8,
        }],
      },
      mapEdits: { layoutLawVersion: 2 },
      audience: 'dm',
    });

    const targetedBuildings = targeted.buildings.filter(
      (building) => building.districtId === targetDistrictId,
    );
    const otherBuildings = targeted.buildings.filter(
      (building) => building.districtId !== targetDistrictId,
    );
    expect(targetedBuildings).not.toHaveLength(0);
    expect(otherBuildings).not.toHaveLength(0);
    expect(targetedBuildings.every(
      (building) => building.conditionProfile.abandonment > 0,
    )).toBe(true);
    expect(otherBuildings.every(
      (building) => building.conditionProfile.abandonment === 0,
    )).toBe(true);
    expect(global.buildings.every(
      (building) => building.conditionProfile.abandonment > 0,
    )).toBe(true);
  });
});

describe('stableSceneStringify', () => {
  it('sorts object keys recursively while preserving array order', () => {
    expect(stableSceneStringify({ z: 1, a: { d: 2, b: 3 }, rows: [2, 1] }))
      .toBe('{"a":{"b":3,"d":2},"rows":[2,1],"z":1}');
    expect(sceneDigest({ b: 2, a: 1 })).toBe(sceneDigest({ a: 1, b: 2 }));
  });

  it('fails closed on non-JSON values and cycles', () => {
    expect(() => stableSceneStringify({ bad: undefined })).toThrow(/unsupported undefined/);
    expect(() => stableSceneStringify({ bad: Infinity })).toThrow(/non-finite/);
    const cyclic = {};
    cyclic.self = cyclic;
    expect(() => stableSceneStringify(cyclic)).toThrow(/cyclic/);
  });
});
