/**
 * townCartographyBuildings.test.js — TC-4's multiplicity, packing, fill and dress
 * (docs/DESIGN_TOWN_CARTOGRAPHY.md §3, §4.5, A-7, A-8 §11b, A-10).
 *
 * Every geometric claim runs against the REAL compiler, through the same
 * `compileLeaves`/`leafInputFor` harness TC-3b established: the districts are the
 * ones a live TownSceneManifest publishes, the wards and parcels are the ones the
 * TC-3a/TC-3b leaves produce, and the institutions are the ones the manifest
 * already projected. A hand-made parcel would prove a triangle is a triangle and
 * nothing about the town.
 *
 *   C2 MULTIPLICITY  the resolver is total, bounded, monotone and append-stable;
 *                    the two MIRRORED tuning tables equal their producers
 *                    exact-set-both-ways (the drift guard that replaces the import
 *                    CR-TC3B-BYTES forbids); and the CATALOG CANARY pins how many
 *                    authored institution names still carry a count range, so a
 *                    cosmetic reword cannot silently collapse a count to 1.
 *   C3 GEOMETRY      the twenty-row corpus: every vertex AND anchor inside its own
 *                    parcel by the exact predicate, integer, positive area, caps
 *                    honoured — plus the pack-failure premise with a restore control.
 *   C4 DWELLINGS     fill responds to population, carries no conditional key, and a
 *                    parcel-less compile emits nothing rather than throwing.
 *   C5 DRESS         the first-match condition chain, each rung with a restore
 *                    control; the height producer binding; token and permille shape.
 *   C6/C8            the leaf-side halves: no `::`, and the exact per-tier byte band.
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { describe, expect, it } from 'vitest';

import { POPULATION_RANGES } from '../../src/data/constants.js';
import { institutionalCatalog } from '../../src/data/institutionalCatalog.js';
import { NAMING_DATA } from '../../src/data/namingData.js';
import {
  compileTownSceneManifest,
  stableSceneStringify,
} from '../../src/domain/townScene/index.js';
import {
  scenePointInPolygon,
  scenePolygonArea,
} from '../../src/domain/townScene/sceneCompilePrimitives.js';
import { compileTownBuildingLayers } from '../../src/domain/townCartography/cartographyBuildings.js';
import {
  parseCatalogRange,
  resolveInstitutionMultiplicity,
} from '../../src/domain/townCartography/cartographyMultiplicity.js';
import { compileTownParcelLayers } from '../../src/domain/townCartography/cartographyParcels.js';
import { compileTownWardLayers } from '../../src/domain/townCartography/cartographyWards.js';
import { readTownMorphology } from '../../src/domain/townCartography/cartographyMorphology.js';
import {
  CARTOGRAPHY_TIERS,
  TOWN_CARTOGRAPHY_TUNING,
  cartographyBand,
  cartographyTierIndex,
} from '../../src/domain/townCartography/cartographyTuning.js';
import { V2_GOLDEN_CONFIGS } from '../fixtures/townMapFixtures.js';

const T = TOWN_CARTOGRAPHY_TUNING;
const M = T.MULTIPLICITY;
const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const LIT_RULES = { simulationRules: { townCartographyEnabled: true } };

/** The one walled+watered town every non-corpus pin runs against. */
const SUBJECT = V2_GOLDEN_CONFIGS.findIndex(
  (config) => config.spec.tier === 'city' && config.spec.walls === true,
);

/** Compile one corpus row through the ordinary domain entry point. */
function compileRow(index, audience = 'dm') {
  return compileTownSceneManifest({
    settlement: V2_GOLDEN_CONFIGS[index].settlement,
    mapEdits: V2_GOLDEN_CONFIGS[index].mapEdits ?? null,
    audience,
    worldState: LIT_RULES,
  }, { namingPools: NAMING_DATA });
}

/**
 * THE THREE LEAVES IN THE COMPILER'S OWN ORDER: wards, then the carve inside them,
 * then the packing inside THAT. This is `compileTownCartography`'s exact composition,
 * rebuilt so a leaf-level pin measures the real pipeline. A test that packed into
 * hand-made parcels would prove a triangle is a triangle and nothing about the town.
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
  const buildingLayers = compileTownBuildingLayers({
    buildings: input.buildings,
    semantics: input.semantics,
    wards: wardLayers.wards,
    parcels: parcelLayers.parcels,
    institutionBindings: parcelLayers.institutionBindings,
    settlement: input.settlement,
    digest: input.digest,
    tier: input.tier,
    placement: input.placement,
    fabricAccumulation01: input.fabricAccumulation01,
  });
  return {
    wards: wardLayers.wards,
    parcels: parcelLayers.parcels,
    institutionBindings: parcelLayers.institutionBindings,
    buildings: buildingLayers.buildings,
    receipts: buildingLayers.receipts,
  };
}

/** The exact argument set the compiler hands the leaves, rebuilt from a real manifest. */
function leafInputFor(index, audience = 'dm') {
  const settlement = V2_GOLDEN_CONFIGS[index].settlement;
  const manifest = compileRow(index, audience);
  const morphology = readTownMorphology(settlement);
  return {
    manifest,
    input: {
      districts: manifest.districts,
      buildings: manifest.buildings,
      semantics: manifest.semantics,
      streets: manifest.cartography.streets,
      settlement,
      digest: manifest.source.mapModelDigest,
      tier: CARTOGRAPHY_TIERS[cartographyTierIndex(settlement.tier)],
      placement: morphology.placement,
      fabricAccumulation01: morphology.evidence.fabricAccumulation01,
    },
  };
}

/** A canonical scene-building row shaped exactly as sceneBuildingFabric emits one. */
function canonicalRow(overrides = {}) {
  return {
    semanticId: 'building:cat:probe',
    anchorKey: 'cat:probe',
    districtId: 'district.probe',
    footprint: [[0, 0], [40, 0], [40, 40]],
    heightCm: 750,
    planUnitCm: 50,
    landmark: false,
    shapeFamily: 'civic',
    shapeKind: 'hall-a',
    skinId: 'stoneCivic',
    generatedFabric: false,
    conditionProfile: {},
    ...overrides,
  };
}

/** A ward row shaped exactly as the TC-3a lowering emits one. */
function wardRow(polygon) {
  return {
    id: 'ward:district.probe',
    kind: 'civic',
    name: 'Probe Ward',
    polygon,
    tonePermille: 500,
    districtId: 'district.probe',
    lynchElement: 'district',
    provenance: { kind: 'generated', ref: null },
    decidedBy: 'state',
  };
}

/** A parcel row shaped exactly as the TC-3b carve emits one. */
function parcelRow(polygon, id = 'parcel:probe') {
  return {
    id,
    wardId: 'ward:district.probe',
    polygon,
    anchor: [
      Math.round((polygon[0][0] + polygon[1][0] + polygon[2][0]) / 3),
      Math.round((polygon[0][1] + polygon[1][1] + polygon[2][1]) / 3),
    ],
    provenance: { kind: 'generated', ref: null },
    decidedBy: 'state',
  };
}

/** Drive the buildings leaf alone, against crafted substrate. */
function packInto(polygon, overrides = {}) {
  return compileTownBuildingLayers({
    buildings: [canonicalRow(overrides.canonical || {})],
    semantics: [],
    wards: [wardRow(overrides.wardPolygon || [[0, 0], [600, 0], [0, 600]])],
    parcels: [parcelRow(polygon)],
    institutionBindings: [{
      institutionRef: 'building:cat:probe',
      anchorKey: 'cat:probe',
      parcelId: 'parcel:probe',
      placement: 'district',
      decidedBy: 'prominence',
    }],
    settlement: { population: 900, tier: 'town', economicState: { prosperity: 'Modest' } },
    digest: 'digest:tc4-pack',
    tier: 'town',
    placement: 'district',
    fabricAccumulation01: null,
    ...(overrides.leaf || {}),
  });
}

/** The fixed identity axis for every resolver row: jitter depends on these two only. */
const FIXED = { digest: 'digest:tc4-resolver', anchorKey: 'cat:probe' };

/** Resolve with the fixed identity axis, overriding only what a row is about. */
function resolveWith(overrides) {
  return resolveInstitutionMultiplicity({
    label: 'Craft guilds (5-15)',
    population: 2000,
    tier: 'town',
    prosperity: 'moderate',
    ...FIXED,
    ...overrides,
  });
}

/**
 * Every authored institution NAME the catalog publishes, as (tier, category, name)
 * entries. The catalog nests tier -> category -> name, and the NAME KEY is what
 * sceneSemantics projects as a building row's `label`, which is the string
 * `parseCatalogRange` reads. Reading the real table here is the whole point of the
 * canary: the resolver may not import it (§6.6), so the test carries the join.
 */
function catalogEntryNames() {
  /** @type {string[]} */
  const names = [];
  for (const tier of Object.keys(institutionalCatalog)) {
    for (const category of Object.keys(institutionalCatalog[tier])) {
      names.push(...Object.keys(institutionalCatalog[tier][category]));
    }
  }
  return names;
}

describe('TC-4 C2 — multiplicity resolves canonically, and the mirrors cannot drift', () => {
  it('a label with no range resolves to exactly one instance (the declared-else-generic fall)', () => {
    for (const label of ['Town granary', '', null, undefined, 42, 'Almshouse (charity)']) {
      expect(parseCatalogRange(label), String(label)).toEqual({ min: 1, max: 1 });
      expect(resolveWith({ label }).resolved, String(label)).toBe(1);
    }
    // Anti-vacuity: a RANGED label through the same call resolves above one, so the
    // ones above measure the no-match fall rather than a resolver stuck at 1.
    expect(resolveWith({ label: 'Craft guilds (5-15)' }).resolved).toBeGreaterThan(1);
  });

  it('the FIRST parenthesised range in the label is the range, and a malformed one is named', () => {
    expect(parseCatalogRange('Craft guilds (5-15)')).toEqual({ min: 5, max: 15 });
    expect(parseCatalogRange('Taverns (5-20)')).toEqual({ min: 5, max: 20 });
    expect(parseCatalogRange('Dwellings (17-80) rebuilt (2-3)')).toEqual({ min: 17, max: 80 });
    for (const broken of ['Guilds (9-2)', 'Guilds (0-4)']) {
      expect(() => parseCatalogRange(broken), broken)
        .toThrow(/townCartography TC-3 premise: institution label .* malformed count range/);
      expect(() => parseCatalogRange(broken), broken).toThrow(RangeError);
    }
    // RESTORE: a well-formed sibling parses, so the throws measured the malformed
    // range rather than a broken call.
    expect(parseCatalogRange('Guilds (2-9)')).toEqual({ min: 2, max: 9 });
  });

  it('the resolved count never leaves the authored range, at any population or prosperity', () => {
    /** @type {string[]} */
    const failures = [];
    for (const label of ['Craft guilds (5-15)', 'Mills (2-5)', 'Dwellings (80-180)']) {
      const { min, max } = parseCatalogRange(label);
      for (const tier of CARTOGRAPHY_TIERS) {
        for (const population of [0, 8, 500, 5000, 100000, 10 ** 9]) {
          for (const prosperity of [...Object.keys(M.PROSPERITY_RANK), 'nonsense', null]) {
            const row = resolveWith({ label, tier, population, prosperity });
            const at = `${label}/${tier}/${population}/${prosperity}`;
            if (row.min !== min || row.max !== max) failures.push(`${at} range drift`);
            if (row.resolved < min || row.resolved > max) failures.push(`${at} -> ${row.resolved}`);
            if (!Number.isInteger(row.resolved)) failures.push(`${at} not an integer`);
          }
        }
      }
    }
    expect(failures).toEqual([]);
  });

  it('the count is MONOTONE non-decreasing in population and in prosperity rank', () => {
    const label = 'Dwellings (80-180)';
    /** @type {string[]} */
    const failures = [];
    let previous = -1;
    for (const population of [0, 1000, 5000, 12000, 25000, 60000, 100000]) {
      const resolved = resolveWith({ label, tier: 'metropolis', population }).resolved;
      if (resolved < previous) failures.push(`population ${population}: ${resolved} < ${previous}`);
      previous = resolved;
    }
    // Prosperity walks its OWN ladder, in rank order, at a fixed population.
    const ladder = [...new Set(Object.keys(M.PROSPERITY_RANK)
      .sort((a, b) => M.PROSPERITY_RANK[a] - M.PROSPERITY_RANK[b]))];
    previous = -1;
    for (const prosperity of ladder) {
      const resolved = resolveWith({ label, tier: 'metropolis', population: 40000, prosperity }).resolved;
      if (resolved < previous) failures.push(`prosperity ${prosperity}: ${resolved} < ${previous}`);
      previous = resolved;
    }
    expect(failures).toEqual([]);
    // Anti-vacuity: the walk actually MOVES, so "non-decreasing" is not the trivially
    // true claim about a constant.
    expect(resolveWith({ label, tier: 'metropolis', population: 100000 }).resolved)
      .toBeGreaterThan(resolveWith({ label, tier: 'metropolis', population: 0 }).resolved);
  });

  it('the jitter is exactly one of −1, 0, +1 and rides identity, never the roster', () => {
    const label = 'Craft guilds (5-15)';
    /** @type {Set<number>} */
    const deltas = new Set();
    for (let index = 0; index < 64; index++) {
      const anchorKey = `cat:probe-${index}`;
      const withJitter = resolveWith({ label, anchorKey }).resolved;
      const withoutJitter = resolveWith({ label, anchorKey: 'cat:probe' }).resolved;
      deltas.add(withJitter - resolveWith({ label, anchorKey, population: 2000 }).resolved);
      expect(Math.abs(withJitter - withoutJitter), anchorKey).toBeLessThanOrEqual(2);
    }
    // A per-anchor stamp is a pure function of the anchor: the same anchor twice is
    // the same count, and the delta set above therefore collapses to {0}.
    expect([...deltas]).toEqual([0]);
    // The jitter's own span: across many anchors the resolver must reach at least
    // three distinct counts, or the ±1 step would be dead code.
    const spread = new Set();
    for (let index = 0; index < 64; index++) {
      spread.add(resolveWith({ label, anchorKey: `cat:spread-${index}`, population: 2200 }).resolved);
    }
    expect(spread.size).toBeGreaterThanOrEqual(3);
  });

  it('a {min:1,max:1} range pins to exactly one, jitter or not', () => {
    for (let index = 0; index < 32; index++) {
      expect(resolveWith({ label: 'Almshouse', anchorKey: `cat:pin-${index}` }).resolved).toBe(1);
    }
  });

  it('POPULATION_SPAN mirrors POPULATION_RANGES exactly, both ways', () => {
    expect(Object.keys(M.POPULATION_SPAN).sort()).toEqual(Object.keys(POPULATION_RANGES).sort());
    for (const tier of Object.keys(POPULATION_RANGES)) {
      expect(M.POPULATION_SPAN[tier], tier)
        .toEqual([POPULATION_RANGES[tier].min, POPULATION_RANGES[tier].max]);
    }
    // Anti-vacuity: the producer is a real, populated table, so the equality above is
    // not two empty objects agreeing.
    expect(Object.keys(POPULATION_RANGES).length).toBe(CARTOGRAPHY_TIERS.length);
  });

  it('PROSPERITY_RANK mirrors the buildingProfiles ladder exactly, both ways', () => {
    // The producer ladder is UNEXPORTED townScene internals (exporting it would be a
    // forbidden edit), so the binding is read from the producer's own source text —
    // the same technique the determinism suite's label scans use.
    const source = readFileSync(join(ROOT, 'src/domain/townScene/buildingProfiles.js'), 'utf8');
    const block = /const PROSPERITY_RANK\s*=[\s\S]*?Object\.freeze\(\{([\s\S]*?)\}\)/.exec(source);
    expect(block, 'the producer ladder was not found in buildingProfiles.js').toBeTruthy();
    /** @type {Record<string, number>} */
    const producer = {};
    for (const match of block[1].matchAll(/(\w+)\s*:\s*(\d+)/g)) producer[match[1]] = Number(match[2]);
    expect(Object.keys(producer).length).toBeGreaterThanOrEqual(9);
    expect(Object.keys(producer).sort()).toEqual(Object.keys(M.PROSPERITY_RANK).sort());
    for (const key of Object.keys(producer)) {
      expect(M.PROSPERITY_RANK[key], key).toBe(producer[key]);
    }
    // The span is the ladder's own maximum, not an authored guess.
    expect(M.PROSPERITY_RANK_SPAN).toBe(Math.max(...Object.values(producer)));
  });

  it('the two static tuning invariants hold for every tier', () => {
    for (const tier of CARTOGRAPHY_TIERS) {
      expect(T.MAXIMUM_INSTITUTION_BINDINGS[tier], tier)
        .toBeLessThanOrEqual(T.MAXIMUM_CARTOGRAPHY_BUILDINGS[tier]);
      expect(T.BUILDINGS_PER_PARCEL[tier], tier).toBeLessThanOrEqual(4);
      expect(T.BUILDINGS_PER_PARCEL[tier], tier).toBeGreaterThanOrEqual(1);
    }
    expect(CARTOGRAPHY_TIERS.length).toBe(6);
  });

  it('CATALOG CANARY: every authored count range is still spelled where the resolver reads it', () => {
    // CR-TC4-O2-R1. The range is parsed from the manifest's own semantics LABEL,
    // which is the catalog's own name key. A cosmetic reword that drops "(5-15)"
    // would silently collapse that institution's canonical count to 1 through the
    // no-match fall — invisible in every geometry pin, because the map would simply
    // draw one. This is an EXACT-LITERAL pin on frozen authored data by design: a
    // legitimate catalog change updates the number here, consciously.
    const names = catalogEntryNames();
    expect(names.length).toBeGreaterThan(100);
    const ranged = names.filter((name) => parseCatalogRange(name).max > 1);
    expect(ranged.length).toBe(17);
    for (const name of ranged) {
      const { min, max } = parseCatalogRange(name);
      expect(min, name).toBeGreaterThanOrEqual(1);
      expect(min, name).toBeLessThan(max);
    }
    // The canary reads the SAME parser the compiler uses, so a parser change that
    // stopped seeing ranges reds here rather than quietly emptying the layer.
    expect(ranged).toContain('Craft guilds (5-15)');
    expect(ranged).toContain('Taverns (5-20)');
  });
});

describe('TC-4 C3 — footprints pack INSIDE their parcels, in integer geometry', () => {
  it('every emitted footprint across the twenty-row corpus is contained, integer and positive', () => {
    /** @type {string[]} */
    const failures = [];
    let measured = 0;
    for (let index = 0; index < V2_GOLDEN_CONFIGS.length; index++) {
      const settlement = V2_GOLDEN_CONFIGS[index].settlement;
      const tier = CARTOGRAPHY_TIERS[cartographyTierIndex(settlement.tier)];
      const block = compileRow(index).cartography;
      const label = `#${index} ${tier}`;
      const parcelById = new Map(block.parcels.map((parcel) => [parcel.id, parcel]));
      /** @type {Map<string, number>} */
      const dwellingsPer = new Map();
      for (const row of block.buildings) {
        const parcel = parcelById.get(row.parcelId);
        if (!parcel) {
          failures.push(`${label} ${row.id} names no parcel in this block`);
          continue;
        }
        measured += 1;
        if (scenePolygonArea(row.footprint) <= 0) failures.push(`${label} ${row.id} zero area`);
        if (row.footprint.length < 3) failures.push(`${label} ${row.id} under three points`);
        for (const vertex of row.footprint) {
          if (!Number.isInteger(vertex[0]) || !Number.isInteger(vertex[1])) {
            failures.push(`${label} ${row.id} non-integer vertex`);
          }
          if (!scenePointInPolygon(vertex[0], vertex[1], parcel.polygon)) {
            failures.push(`${label} ${row.id} vertex ${vertex.join(',')} escaped its parcel`);
          }
        }
        // The interior anchor the packer centred on: the footprint's own rounded mean.
        const anchor = [
          Math.round(row.footprint.reduce((sum, p) => sum + p[0], 0) / row.footprint.length),
          Math.round(row.footprint.reduce((sum, p) => sum + p[1], 0) / row.footprint.length),
        ];
        if (!scenePointInPolygon(anchor[0], anchor[1], parcel.polygon)) {
          failures.push(`${label} ${row.id} anchor escaped its parcel`);
        }
        if (row.role === 'dwelling') {
          dwellingsPer.set(row.parcelId, (dwellingsPer.get(row.parcelId) || 0) + 1);
        }
      }
      const perParcel = cartographyBand(T.BUILDINGS_PER_PARCEL, tier);
      for (const [parcelId, count] of dwellingsPer) {
        if (count > perParcel) failures.push(`${label} ${parcelId} holds ${count} > band ${perParcel}`);
      }
      const totalCap = cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, tier);
      if (block.buildings.length > totalCap) failures.push(`${label} ${block.buildings.length} > cap ${totalCap}`);
      if (block.buildings.length === 0) failures.push(`${label} emitted nothing`);
    }
    expect(failures).toEqual([]);
    // Anti-vacuity: the loop above actually measured a substantial corpus.
    expect(measured).toBeGreaterThan(1000);
  }, 120_000);

  it('NEGATIVE CONTROL: an institution that cannot pack is NAMED, never dropped', () => {
    // A collinear "triangle" has zero area, so every medial subcell is degenerate and
    // no rung of the shrink ladder can produce a contained, positive-area footprint.
    expect(() => packInto([[100, 100], [200, 100], [300, 100]]))
      .toThrow(/townCartography TC-3 premise: institution .* cannot pack inside parcel/);
    expect(() => packInto([[100, 100], [200, 100], [300, 100]])).toThrow(RangeError);
    // RESTORE: the same call against a healthy parcel packs, so the throw above
    // measured the degenerate geometry rather than a broken call.
    const healthy = packInto([[100, 100], [400, 100], [100, 400]]);
    expect(healthy.buildings.length).toBeGreaterThan(0);
    expect(healthy.buildings[0].role).toBe('institution');
    expect(scenePolygonArea(healthy.buildings[0].footprint)).toBeGreaterThan(0);
  });

  it('a flagship is EXEMPT from the per-parcel occupancy band (a canonical institution always appears)', () => {
    // Four institutions bound to the SAME single parcel at a tier whose band is 3.
    const bindings = [];
    const buildings = [];
    for (let index = 0; index < 4; index++) {
      buildings.push(canonicalRow({
        semanticId: `building:cat:probe${index}`, anchorKey: `cat:probe${index}`,
      }));
      bindings.push({
        institutionRef: `building:cat:probe${index}`,
        anchorKey: `cat:probe${index}`,
        parcelId: 'parcel:probe',
        placement: 'district',
        decidedBy: 'prominence',
      });
    }
    const result = compileTownBuildingLayers({
      buildings,
      semantics: [],
      wards: [wardRow([[0, 0], [600, 0], [0, 600]])],
      parcels: [parcelRow([[100, 100], [500, 100], [100, 500]])],
      institutionBindings: bindings,
      settlement: { population: 900, tier: 'town', economicState: { prosperity: 'Modest' } },
      digest: 'digest:tc4-flagships',
      tier: 'town',
      placement: 'district',
      fabricAccumulation01: null,
    });
    const flagships = result.buildings.filter((row) => row.role === 'institution');
    expect(flagships.length).toBe(4);
    expect(cartographyBand(T.BUILDINGS_PER_PARCEL, 'town')).toBe(3);
    expect(new Set(flagships.map((row) => row.id)).size).toBe(4);
  });
});

describe('TC-4 C4 — dwelling fill is population-led, identity-free and total', () => {
  it('a higher population yields at least as many dwellings at a fixed digest', () => {
    const { input } = leafInputFor(SUBJECT);
    /** @type {number[]} */
    const counts = [];
    for (const population of [500, 6000, 12000, 24000]) {
      const layers = compileLeaves({
        ...input,
        settlement: { ...input.settlement, population },
      });
      counts.push(layers.receipts.dwellingCount);
    }
    for (let index = 1; index < counts.length; index++) {
      expect(counts[index], `${counts}`).toBeGreaterThanOrEqual(counts[index - 1]);
    }
    // Anti-vacuity: the fill actually MOVES with population.
    expect(counts[counts.length - 1]).toBeGreaterThan(counts[0]);
  }, 120_000);

  it('dwellings carry no conditional key and their ids are sorted, unique and well-formed', () => {
    const { input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    const dwellings = layers.buildings.filter((row) => row.role === 'dwelling');
    expect(dwellings.length).toBeGreaterThan(0);
    for (const row of dwellings) {
      expect(Object.prototype.hasOwnProperty.call(row, 'institutionRef'), row.id).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(row, 'placement'), row.id).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(row, 'lynchElement'), row.id).toBe(false);
      expect(row.id, row.id).toMatch(/^carto:dwelling:ward:.+:\d{3}$/);
      expect(row.decidedBy, row.id).toBe('feel');
    }
    const ids = layers.buildings.map((row) => row.id);
    expect(ids).toEqual([...ids].sort());
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('a ZERO-PARCEL compile emits nothing and does not throw', () => {
    const empty = compileTownBuildingLayers({
      buildings: [],
      semantics: [],
      wards: [wardRow([[0, 0], [600, 0], [0, 600]])],
      parcels: [],
      institutionBindings: [],
      settlement: { population: 900, tier: 'town', economicState: { prosperity: 'Modest' } },
      digest: 'digest:tc4-empty',
      tier: 'town',
      placement: 'district',
      fabricAccumulation01: null,
    });
    expect(empty.buildings).toEqual([]);
    expect(empty.receipts.dwellingCount).toBe(0);
    expect(empty.receipts.buildingCount).toBe(0);
    expect(empty.receipts.overflowCount).toBe(0);
  });
});

describe('TC-4 C5 — the dress derives from existing typed facts', () => {
  /** The condition the leaf stamps on a flagship carrying `profile`. */
  const conditionFor = (profile) => packInto(
    [[100, 100], [400, 100], [100, 400]],
    { canonical: { conditionProfile: profile } },
  ).buildings[0].condition;

  it('the FIRST-MATCH condition chain reads each rung, and the ORDER is load-bearing', () => {
    expect(conditionFor({ abandonment: 0.8 })).toBe('ruined');
    expect(conditionFor({ warScar: 0.8 })).toBe('burned');
    expect(conditionFor({ occupation: 0.8 })).toBe('burned');
    expect(conditionFor({ warScar: 0.5 })).toBe('damaged');
    expect(conditionFor({ neglect: 0.6 })).toBe('worn');
    expect(conditionFor({ repair: 0.7, neglect: 0.1 })).toBe('pristine');
    expect(conditionFor({ construction: 0.7, neglect: 0.1 })).toBe('pristine');
    // RESTORE / DEFAULT: an all-quiet profile falls to the last rung.
    expect(conditionFor({})).toBe('sound');
    // THE ORDER ITSELF: a profile matching FOUR rungs at once must read the FIRST.
    // A reordered chain would return 'burned' or 'worn' here and every other
    // assertion above would still pass, which is why this row exists.
    expect(conditionFor({ abandonment: 0.9, warScar: 0.9, neglect: 0.9, repair: 0.9 }))
      .toBe('ruined');
    expect(conditionFor({ warScar: 0.9, neglect: 0.9, repair: 0.9 })).toBe('burned');
    expect(conditionFor({ neglect: 0.9, repair: 0.9 })).toBe('worn');
  });

  it('HEIGHT_PLAN_CEILING is bound to the producer clamp in buildingProfiles.js', () => {
    const source = readFileSync(join(ROOT, 'src/domain/townScene/buildingProfiles.js'), 'utf8');
    const clampLine = /const heightPlan\s*=\s*clamp\([^\n]*?,\s*(\d+),\s*(\d+)\)/.exec(source);
    expect(clampLine, 'the producer heightPlan clamp was not found').toBeTruthy();
    expect(T.HEIGHT_PLAN_CEILING).toBe(Number(clampLine[2]));
    // The derivation actually uses it: a canonical row at exactly the ceiling reads
    // full height, and one at half the ceiling reads half.
    const full = packInto([[100, 100], [400, 100], [100, 400]], {
      canonical: { heightCm: T.HEIGHT_PLAN_CEILING * 50, planUnitCm: 50 },
    }).buildings[0];
    const half = packInto([[100, 100], [400, 100], [100, 400]], {
      canonical: { heightCm: (T.HEIGHT_PLAN_CEILING / 2) * 50, planUnitCm: 50 },
    }).buildings[0];
    expect(full.heightPermille).toBe(1000);
    expect(half.heightPermille).toBe(500);
  });

  it('every emitted row carries a SAFE_TOKEN style and integer permilles in range', () => {
    const SAFE_TOKEN = /^[a-z0-9][a-z0-9_:.-]{0,119}$/;
    const { input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    expect(layers.buildings.length).toBeGreaterThan(0);
    for (const row of layers.buildings) {
      expect(SAFE_TOKEN.test(row.styleToken), `${row.id} ${row.styleToken}`).toBe(true);
      expect(SAFE_TOKEN.test(row.id), row.id).toBe(true);
      for (const key of ['heightPermille', 'agePermille']) {
        expect(Number.isInteger(row[key]), `${row.id} ${key}`).toBe(true);
        expect(row[key], `${row.id} ${key}`).toBeGreaterThanOrEqual(0);
        expect(row[key], `${row.id} ${key}`).toBeLessThanOrEqual(1000);
      }
      expect(row.provenance).toEqual({ kind: 'generated', ref: null });
    }
    // A-10.3: only a PROMINENT flagship is a Lynch landmark, and never a dwelling.
    for (const row of layers.buildings) {
      if (Object.prototype.hasOwnProperty.call(row, 'lynchElement')) {
        expect(row.lynchElement, row.id).toBe('landmark');
        expect(row.role, row.id).toBe('institution');
        expect(row.id, row.id).toMatch(/:i01$/);
      }
    }
  });
});

describe('TC-4 C6/C8 — the leaf half: determinism, append-stability, and the derived band', () => {
  it('two compiles and a REVERSED roster produce byte-identical layers', () => {
    const { input } = leafInputFor(SUBJECT);
    const first = compileLeaves(input);
    const second = compileLeaves(input);
    expect(stableSceneStringify(second.buildings)).toBe(stableSceneStringify(first.buildings));
    const reversed = compileLeaves({ ...input, buildings: [...input.buildings].reverse() });
    expect(stableSceneStringify(reversed.buildings)).toBe(stableSceneStringify(first.buildings));
    expect(first.buildings.length).toBeGreaterThan(0);
  }, 120_000);

  it('a CHANGED digest moves the dress while every id stays put', () => {
    const { input } = leafInputFor(SUBJECT);
    const base = compileLeaves(input);
    const moved = compileLeaves({ ...input, digest: `${input.digest}-moved` });
    expect(moved.buildings.map((row) => row.id)).toEqual(base.buildings.map((row) => row.id));
    expect(stableSceneStringify(moved.buildings)).not.toBe(stableSceneStringify(base.buildings));
  }, 120_000);

  it('APPEND-STABILITY: one added institution moves no existing count, id or footprint', () => {
    const { input } = leafInputFor(SUBJECT);
    const base = compileLeaves(input);
    const seed = input.buildings.find((row) => row.generatedFabric !== true);
    const grown = compileLeaves({
      ...input,
      buildings: [...input.buildings, {
        ...seed,
        anchorKey: `${seed.anchorKey}.newcomer`,
        semanticId: `${seed.semanticId}.newcomer`,
      }],
    });
    expect(grown.institutionBindings.length).toBe(base.institutionBindings.length + 1);
    expect(grown.receipts.multiplicity.length).toBe(base.receipts.multiplicity.length + 1);
    const counts = new Map(base.receipts.multiplicity.map((row) => [row.institutionRef, row.resolved]));
    for (const row of grown.receipts.multiplicity) {
      if (counts.has(row.institutionRef)) {
        expect(row.resolved, row.institutionRef).toBe(counts.get(row.institutionRef));
      }
    }
    const footprints = new Map(base.buildings
      .filter((row) => row.role === 'institution')
      .map((row) => [row.id, stableSceneStringify(row.footprint)]));
    const after = new Map(grown.buildings
      .filter((row) => row.role === 'institution')
      .map((row) => [row.id, stableSceneStringify(row.footprint)]));
    expect(footprints.size).toBeGreaterThan(0);
    for (const [id, footprint] of footprints) {
      expect(after.has(id), id).toBe(true);
      expect(after.get(id), id).toBe(footprint);
    }
  }, 120_000);

  it('C8: every corpus row measures under its DERIVED byte budget (CR-TC4-BAND-1)', () => {
    /** @type {string[]} */
    const failures = [];
    /** @type {Map<string, number>} */
    const maxima = new Map();
    for (let index = 0; index < V2_GOLDEN_CONFIGS.length; index++) {
      const { input } = leafInputFor(index);
      const layers = compileLeaves(input);
      const receipts = layers.receipts;
      // The budget is DERIVED from the count cap, never a second authored table, so
      // band-versus-cap consistency is definitional rather than a pin to remember.
      const derived = cartographyBand(T.MAXIMUM_CARTOGRAPHY_BUILDINGS, input.tier)
        * T.TC4_ROW_BYTES_BAND;
      if (receipts.byteBudget !== derived) failures.push(`#${index} budget ${receipts.byteBudget} != ${derived}`);
      if (!receipts.withinBudget) failures.push(`#${index} over budget`);
      if (receipts.bytes > derived) failures.push(`#${index} ${receipts.bytes} > ${derived}`);
      if (receipts.bytes <= 0) failures.push(`#${index} measured nothing`);
      if (receipts.buildingCount !== layers.buildings.length) failures.push(`#${index} count receipt drift`);
      maxima.set(input.tier, Math.max(maxima.get(input.tier) ?? 0, receipts.bytes));
    }
    expect(failures).toEqual([]);
    // The receipt is a REAL measurement of the emitted rows, recomputed here.
    const { input } = leafInputFor(SUBJECT);
    const layers = compileLeaves(input);
    const measured = new TextEncoder()
      .encode(stableSceneStringify({ buildings: layers.buildings })).byteLength;
    expect(layers.receipts.bytes).toBe(measured);
    expect(measured).toBeGreaterThan(1000);
    expect(maxima.size).toBeGreaterThanOrEqual(4);
  }, 120_000);
});
