/**
 * modeSpeedsWy1.test.js — FP WY-1, THE SCALE CHARTER (docs/DESIGN_FP_ARCHITECTURE.md §5
 * block WY-1; docs/DESIGN_FP_ARCH_WY.md §1a, §2a's frozen-digest datum row, §5 WY-1, §8).
 *
 * Absolute realm distance from the map's own km scale, the per-map band derivation and
 * the one mode-speed table, all DATA-GATED by `spatialDigest.kmScale`. The acceptance
 * cases A1-A7 of the lane brief are the describe titles below. The canonize lifecycle
 * arms (create at canonize, re-receive on the rebuild, the heal receipt, the persist
 * path and the undo ring) ride the store suite that drives the real canonize body:
 * tests/store/campaignWorldPulseSpatialCanon.test.js.
 */
import { describe, expect, it } from 'vitest';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  COST_UNITS_PER_MAP_UNIT,
  DEFAULT_KM_SCALE,
  KM_SCALE_REFUSALS,
  KM_SCALE_TUNING,
  MODES,
  MODE_SPEEDS,
  MODE_SPEED_TUNING,
  REACH_BANDS,
  admitKmScale,
  costUnitsPerMapUnit,
  creationKmScale,
  kmScaleForCanonize,
  modeSpeedOf,
  reachBandOf,
} from '../../src/domain/spatial/modeSpeeds.js';
import {
  MAX_HOP_WEEKS,
  activeKmScale,
  calibration,
  hopWeeks,
  pathCost,
  realmReach,
  scaleAdmission,
} from '../../src/domain/spatial/distanceRead.js';
import { buildSpatialDigest, COST_LAW_VERSION } from '../../src/domain/spatial/index.js';
import { COST_SCALE, DIST_SCALE } from '../../src/domain/spatial/spatialCost.js';
import { ensureWorldState } from '../../src/domain/worldPulse/worldState.js';
import { hydratePersistedWorldState } from '../../src/domain/worldPulse/worldStateHydration.js';
import { serializeWorldSnapshotPublic } from '../../src/domain/display/worldSnapshotPublic.js';
import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { codeOnly } from '../helpers/codeOnlySource.js';
import {
  makeGridPack,
  makeIsthmusPack,
  makeLakePack,
  placePortSettlements,
  placeSettlements,
} from '../fixtures/spatialPackFixtures.js';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const sha = (value) => createHash('sha256').update(JSON.stringify(value)).digest('hex');
const SEASONS = [null, 'spring', 'summer', 'autumn', 'winter'];

/** FMG's own distance-scale slider bounds (public/map: distanceScaleInput min .01, max 20). */
const FMG_SCALE_RANGE = [0.01, 20];

/** The REAL digests: every one is built by the production builder over a fixture pack. */
function realGeometries() {
  const golden = makeGridPack({ cols: 24, rows: 18 });
  const small = makeGridPack({ cols: 18, rows: 14 });
  const ports = makeGridPack({ cols: 24, rows: 18 });
  const isthmus = makeIsthmusPack();
  const lake = makeLakePack({});
  return [
    { name: 'golden-24x18-8', input: { pack: golden, placements: placeSettlements(golden, 8) } },
    { name: 'grid-18x14-6', input: { pack: small, placements: placeSettlements(small, 6) } },
    { name: 'ports-24x18', input: { pack: ports, placements: placePortSettlements(ports, { nCoastal: 3, nRiver: 2, nInland: 3 }), seaLanes: true, seasonalRoads: true } },
    { name: 'isthmus', input: { ...isthmus, seaLanes: true } },
    { name: 'lake-4', input: { pack: lake, placements: placeSettlements(lake, 4), lakes: true } },
  ];
}

/** Every unordered pair of a digest's settlements, codepoint-sorted. */
function pairsOf(digest) {
  const ids = [...digest.settlementIds].map(String).sort();
  const out = [];
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) out.push([ids[i], ids[j]]);
  return out;
}

/** The implied scale of a geometry: the one km scale at which the two reads coincide. */
function impliedScaleOf(input) {
  const scaled = buildSpatialDigest({ ...input, kmScale: 1 });
  return calibration(scaled).impliedKmScale;
}

describe('WY-1 A2 — the mode table: shape frozen, every speed a positive integer in km per week', () => {
  it('the closed mode set is J-D11(b)\'s own list, and the table carries exactly those rows', () => {
    expect(MODES).toEqual(['foot', 'cart', 'river', 'coastal', 'sea']);
    expect(Object.keys(MODE_SPEEDS)).toEqual([...MODES]);
    expect(Object.keys(MODE_SPEED_TUNING)).toEqual(['MODE_SPEEDS']);
    expect(Object.keys(KM_SCALE_TUNING)).toEqual(['DEFAULT_KM_SCALE']);
    expect(MODE_SPEEDS).toBe(MODE_SPEED_TUNING.MODE_SPEEDS);
    expect(DEFAULT_KM_SCALE).toBe(KM_SCALE_TUNING.DEFAULT_KM_SCALE);
    for (const table of [MODES, MODE_SPEEDS, MODE_SPEED_TUNING, KM_SCALE_TUNING, REACH_BANDS, KM_SCALE_REFUSALS]) {
      expect(Object.isFrozen(table)).toBe(true);
    }
  });

  it('every speed is a positive integer, and the default scale is a positive number', () => {
    for (const mode of MODES) {
      expect(Number.isInteger(MODE_SPEEDS[mode]), mode).toBe(true);
      expect(MODE_SPEEDS[mode], mode).toBeGreaterThan(0);
    }
    expect(DEFAULT_KM_SCALE).toBeGreaterThan(0);
    expect(admitKmScale(DEFAULT_KM_SCALE).kmScale).toBe(DEFAULT_KM_SCALE);
  });

  it('an unknown or absent mode reads on foot, the base denomination', () => {
    expect(modeSpeedOf('sea')).toBe(MODE_SPEEDS.sea);
    expect(modeSpeedOf('foot')).toBe(MODE_SPEEDS.foot);
    for (const odd of [undefined, null, 'hovercraft', 7, {}, 'toString', '__proto__']) {
      expect(modeSpeedOf(odd), String(odd)).toBe(MODE_SPEEDS.foot);
    }
  });

  it('the frozen cost law\'s distance unit is spatialCost\'s own two constants (the leaf may not import them)', () => {
    expect(COST_UNITS_PER_MAP_UNIT[COST_LAW_VERSION]).toBe(COST_SCALE * DIST_SCALE);
    expect(costUnitsPerMapUnit(COST_LAW_VERSION)).toBe(COST_SCALE * DIST_SCALE);
    expect(costUnitsPerMapUnit(undefined)).toBe(COST_SCALE * DIST_SCALE);
    // anchored: the known version above answers a number, so these nulls are refusals, not an empty table
    expect(costUnitsPerMapUnit(COST_LAW_VERSION + 1)).toBeNull();
    expect(costUnitsPerMapUnit('1')).toBeNull();
  });

  it('the leaf is import-pinned: its one import is the dependency-free interval table', () => {
    const source = readFileSync(join(ROOT, 'src/domain/spatial/modeSpeeds.js'), 'utf8');
    const imports = [...codeOnly(source).matchAll(/^\s*import\b[^;]*;/gm)].map((m) => m[0]);
    const specifiers = [...source.matchAll(/^\s*import\b[^'"]*['"]([^'"]+)['"]/gm)].map((m) => m[1]);
    expect(imports.length).toBe(1);
    expect(specifiers).toEqual(['../worldPulse/intervalWeeks.js']);
  });
});

describe('WY-1 A1 — the band derivation is total and monotone over the km scale; every band is reachable from real digests (the dead-band law)', () => {
  it('reachBandOf is total over every input and monotone in weeks', () => {
    for (const odd of [undefined, null, 'far', NaN, {}, [], Infinity]) {
      expect(REACH_BANDS, String(odd)).toContain(reachBandOf(odd));
    }
    expect(reachBandOf(NaN)).toBe('beyond_a_year');
    expect(reachBandOf(Infinity)).toBe('beyond_a_year');
    expect(reachBandOf(-Infinity)).toBe('within_a_week');
    const ladder = [-5, 0, 0.5, 1, 1.5, 4, 5, 13, 14, 52, 53, 1e6];
    const ranks = ladder.map((w) => REACH_BANDS.indexOf(reachBandOf(w)));
    for (let i = 1; i < ranks.length; i++) expect(ranks[i]).toBeGreaterThanOrEqual(ranks[i - 1]);
    expect(ladder.map(reachBandOf)).toEqual([
      'within_a_week', 'within_a_week', 'within_a_week', 'within_a_week',
      'within_a_month', 'within_a_month', 'within_a_season', 'within_a_season',
      'within_a_year', 'within_a_year', 'beyond_a_year', 'beyond_a_year',
    ]);
  });

  it('the spectrum and the reach band rise with the km scale and never fall, on every real digest', () => {
    const [lo, hi] = FMG_SCALE_RANGE;
    const steps = 40;
    for (const g of realGeometries()) {
      let prev = null;
      for (let k = 0; k <= steps; k++) {
        const kmScale = lo * (hi / lo) ** (k / steps);
        const reach = realmReach(buildSpatialDigest({ ...g.input, kmScale }));
        expect(reach.kmScale, g.name).toBe(kmScale);
        expect(reach.legs, g.name).toBeGreaterThan(0);
        if (prev) {
          for (const key of ['minWeeks', 'medianWeeks', 'maxWeeks', 'reachWeeks', 'clampedLegs']) {
            expect(reach[key], `${g.name} ${key} @${kmScale}`).toBeGreaterThanOrEqual(prev[key]);
          }
          expect(REACH_BANDS.indexOf(reach.band), `${g.name} @${kmScale}`).toBeGreaterThanOrEqual(REACH_BANDS.indexOf(prev.band));
        }
        prev = reach;
      }
    }
  });

  it('every reach band is reached by a real digest inside FMG\'s own scale range; the normalized arm leaves the year bands dead', () => {
    const [lo, hi] = FMG_SCALE_RANGE;
    const g = realGeometries()[0];
    const seen = new Set();
    for (let k = 0; k <= 60; k++) seen.add(realmReach(buildSpatialDigest({ ...g.input, kmScale: lo * (hi / lo) ** (k / 60) })).band);
    expect([...seen].sort()).toEqual([...REACH_BANDS].sort());
    // The dead-band hazard this law exists for, measured on the same map: the normalized
    // read spans a few weeks, so a band at a year or beyond refuses nothing there.
    const legacy = realmReach(buildSpatialDigest(g.input));
    expect(legacy.kmScale).toBeNull();
    expect(REACH_BANDS.indexOf(legacy.band)).toBeLessThan(REACH_BANDS.indexOf('within_a_year'));
    expect(legacy.clampedLegs).toBe(0);
  });

  it('the spectrum is total: a missing, empty or single-settlement digest reads an empty realm, never a throw', () => {
    for (const odd of [null, undefined, {}, { distanceMatrix: {} }]) {
      const reach = realmReach(/** @type {any} */ (odd));
      expect(reach.legs).toBe(0);
      expect(REACH_BANDS).toContain(reach.band);
    }
    const lone = makeGridPack({ cols: 8, rows: 6 });
    const solo = realmReach(buildSpatialDigest({ pack: lone, placements: placeSettlements(lone, 1), kmScale: 5 }));
    expect(solo.legs).toBe(0);
    expect(solo.band).toBe('within_a_week');
  });
});

describe('WY-1 A3 — the absolute read agrees with the hop-count read at the implied scale and diverges honestly elsewhere (law M: one position model)', () => {
  it('at the implied scale every leg, in every season, reads the same weeks as the normalized read — to the bit', () => {
    for (const g of realGeometries()) {
      const legacy = buildSpatialDigest(g.input);
      const implied = impliedScaleOf(g.input);
      const scaled = buildSpatialDigest({ ...g.input, kmScale: implied });
      // Non-vacuity: the implied scale is a real number and the scaled digest carries it, so the
      // agreement below compares the ABSOLUTE arm against the normalized one, never legacy with legacy.
      expect(Number.isFinite(implied) && implied > 0, g.name).toBe(true);
      expect(scaled.kmScale, g.name).toBe(implied);
      expect(calibration(scaled).kmScale, g.name).toBe(implied);
      expect(calibration(scaled).weeksPerCost, g.name).toBe(calibration(legacy).weeksPerCost);
      for (const [a, b] of pairsOf(legacy)) {
        for (const season of SEASONS) {
          expect(hopWeeks(scaled, a, b, season), `${g.name} ${a}>${b} ${season}`).toBe(hopWeeks(legacy, a, b, season));
        }
      }
    }
  });

  it('one geometry: the scaled digest differs from the unscaled one by the datum alone, and pathCost never moves', () => {
    for (const g of realGeometries()) {
      const legacy = buildSpatialDigest(g.input);
      const scaled = buildSpatialDigest({ ...g.input, kmScale: 7 });
      const { kmScale, ...rest } = scaled;
      expect(kmScale).toBe(7);
      expect(JSON.stringify(rest)).toBe(JSON.stringify(legacy));
      for (const [a, b] of pairsOf(legacy)) expect(pathCost(scaled, a, b)).toBe(pathCost(legacy, a, b));
    }
  });

  it('at another scale the weeks diverge by exactly the scale ratio, and the receipt names both constants', () => {
    const g = realGeometries()[0];
    const legacy = buildSpatialDigest(g.input);
    const implied = impliedScaleOf(g.input);
    const doubled = buildSpatialDigest({ ...g.input, kmScale: implied * 2 });
    const receipt = calibration(doubled);
    expect(receipt.kmScale).toBe(implied * 2);
    expect(receipt.impliedKmScale).toBe(implied);
    expect(receipt.normalizedWeeksPerCost).toBe(calibration(legacy).weeksPerCost);
    expect(receipt.weeksPerCost).toBe(calibration(legacy).weeksPerCost * 2);
    let diverged = 0;
    for (const [a, b] of pairsOf(legacy)) {
      const before = hopWeeks(legacy, a, b);
      const after = hopWeeks(doubled, a, b);
      if (after !== before) diverged += 1;
      expect(after).toBe(Math.min(MAX_HOP_WEEKS, Math.max(1, Math.round(pathCost(legacy, a, b) * receipt.weeksPerCost))));
    }
    expect(diverged).toBeGreaterThan(0);
    // The unscaled receipt keeps its exact pre-WY-1 shape: the scaled keys are drop-when-absent.
    expect(Object.keys(calibration(legacy))).toEqual([
      'weeksPerCost', 'medianPrimaryHopCost', 'primaryHopCount', 'diameterCost', 'diameterWeeks', 'anchorWeeks', 'floor', 'derived',
    ]);
  });

  it('the read is ABSOLUTE: two maps at one declared scale price a km the same, whatever their median hop', () => {
    const [grid, small] = realGeometries();
    const a = buildSpatialDigest({ ...grid.input, kmScale: 4 });
    const b = buildSpatialDigest({ ...small.input, kmScale: 4 });
    // anchored: both medians are read off real builds one line below, so a differing pair is measured, not assumed
    expect(calibration(a).medianPrimaryHopCost).not.toBe(calibration(b).medianPrimaryHopCost);
    const perCost = 4 / (COST_UNITS_PER_MAP_UNIT[1] * MODE_SPEEDS.foot);
    for (const d of [a, b]) expect(calibration(d).weeksPerCost).toBeCloseTo(perCost, 15);
  });

  it('law M binds in every denomination: the one floor and the one cap hold at a tiny and a huge scale', () => {
    const g = realGeometries()[0];
    const tiny = buildSpatialDigest({ ...g.input, kmScale: 1e-6 });
    const huge = buildSpatialDigest({ ...g.input, kmScale: 1e6 });
    for (const [a, b] of pairsOf(tiny)) {
      expect(hopWeeks(tiny, a, b)).toBe(1);
      expect(hopWeeks(huge, a, b)).toBe(MAX_HOP_WEEKS);
    }
    expect(hopWeeks(tiny, 's000', 's000')).toBe(0);
    const reach = realmReach(huge);
    expect(reach.clampedLegs).toBe(reach.legs);
    expect(reach.band).toBe('beyond_a_year');
  });

  it('a named mode reads its own row on a scaled world; on an unscaled world the mode is ignored', () => {
    const g = realGeometries()[0];
    const legacy = buildSpatialDigest(g.input);
    const scaled = buildSpatialDigest({ ...g.input, kmScale: 12 });
    let slower = 0;
    for (const [a, b] of pairsOf(legacy)) {
      for (const mode of MODES) expect(hopWeeks(legacy, a, b, null, mode)).toBe(hopWeeks(legacy, a, b));
      const foot = hopWeeks(scaled, a, b);
      expect(hopWeeks(scaled, a, b, null, 'foot')).toBe(foot);
      expect(hopWeeks(scaled, a, b, null, 'hovercraft')).toBe(foot);
      expect(hopWeeks(scaled, a, b, null, 'sea')).toBeLessThanOrEqual(foot);
      if (hopWeeks(scaled, a, b, null, 'cart') > foot) slower += 1;
    }
    expect(slower).toBeGreaterThan(0);
  });
});

describe('WY-1 A4 — the datum\'s domain lifecycle: create · read · persist · import heal · veil', () => {
  const g = () => realGeometries()[0];

  it('CREATE: the builder stamps an admitted scale as the LAST key, and nothing else', () => {
    const digest = buildSpatialDigest({ ...g().input, kmScale: 5 });
    expect(Object.keys(digest).at(-1)).toBe('kmScale');
    expect(digest.kmScale).toBe(5);
    for (const refused of [undefined, null, 'far', -1, 0, NaN, Infinity, {}]) {
      const plain = buildSpatialDigest({ ...g().input, kmScale: refused });
      // anchored: the admitted build two lines up carries the key, so this absence is the refusal
      expect(plain).not.toHaveProperty('kmScale');
    }
  });

  it('READ: the scale gate admits a finite positive datum and refuses every other shape with a typed reason', () => {
    const base = buildSpatialDigest(g().input);
    expect(scaleAdmission(buildSpatialDigest({ ...g().input, kmScale: 5 }))).toEqual({ kmScale: 5, refusal: null });
    expect(scaleAdmission(base)).toEqual({ kmScale: null, refusal: null });
    const cases = [['far', 'not_a_number'], [-3, 'not_positive'], [0, 'not_positive'], [NaN, 'not_finite'], [Infinity, 'not_finite'], [{ km: 3 }, 'not_a_number']];
    for (const [raw, refusal] of cases) {
      expect(scaleAdmission({ ...base, kmScale: raw }), String(raw)).toEqual({ kmScale: null, refusal });
      expect(KM_SCALE_REFUSALS).toContain(refusal);
    }
    expect(scaleAdmission({ ...base, kmScale: 3, costLawVersion: 99 })).toEqual({ kmScale: null, refusal: 'unknown_cost_law' });
    expect(activeKmScale(null)).toBeNull();
  });

  it('PERSIST: the hot normalizer, a JSON round trip and the cold hydration all carry the datum untouched', () => {
    const digest = buildSpatialDigest({ ...g().input, kmScale: 5 });
    const world = { rngSeed: 'wy1-persist', tick: 3, spatialCanonVersion: 2, spatialDigest: digest };
    const hot = ensureWorldState(world, {});
    expect(hot.spatialDigest.kmScale).toBe(5);
    const saved = JSON.parse(JSON.stringify(hot));
    expect(saved.spatialDigest.kmScale).toBe(5);
    const loaded = hydratePersistedWorldState(saved, {});
    expect(loaded.spatialDigest.kmScale).toBe(5);
    expect(activeKmScale(loaded.spatialDigest)).toBe(5);
    expect(realmReach(loaded.spatialDigest)).toEqual(realmReach(digest));
  });

  it('IMPORT: a datum that is not a scale reads ABSENT through the gate, with its receipt, and prices exactly the legacy weeks', () => {
    const legacy = buildSpatialDigest(g().input);
    for (const [raw, refusal] of [['far', 'not_a_number'], [-2, 'not_positive'], [null, null]]) {
      const imported = hydratePersistedWorldState(
        JSON.parse(JSON.stringify({ rngSeed: 'wy1-import', tick: 1, spatialCanonVersion: 1, spatialDigest: { ...legacy, kmScale: raw } })),
        {},
      );
      expect(scaleAdmission(imported.spatialDigest), String(raw)).toEqual({ kmScale: null, refusal });
      expect(calibration(imported.spatialDigest)).toEqual(calibration(legacy));
      for (const [a, b] of pairsOf(legacy)) expect(hopWeeks(imported.spatialDigest, a, b)).toBe(hopWeeks(legacy, a, b));
    }
    // The re-canonize heals the stored bytes for good, with the receipt naming the refusal.
    expect(kmScaleForCanonize({ priorDigest: { ...legacy, kmScale: 'far' }, supplied: 9 })).toEqual({
      kmScale: null,
      receipt: { kind: 'kmScale_healed_to_absent', from: 'prior_digest', refusal: 'not_a_number', rawType: 'string' },
    });
  });

  it('VEIL: the public world snapshot of a scaled world is byte-identical to the unscaled world\'s', () => {
    const graph = ensureRegionalGraph();
    const scaledWs = ensureWorldState({ rngSeed: 'wy1-veil', tick: 2, spatialCanonVersion: 1, spatialDigest: buildSpatialDigest({ ...g().input, kmScale: 5 }) }, {});
    const plainWs = ensureWorldState({ rngSeed: 'wy1-veil', tick: 2, spatialCanonVersion: 1, spatialDigest: buildSpatialDigest(g().input) }, {});
    const scaledPublic = JSON.stringify(serializeWorldSnapshotPublic(scaledWs, graph, []));
    expect(scaledPublic).toBe(JSON.stringify(serializeWorldSnapshotPublic(plainWs, graph, [])));
    // anchored: the scaled worldState two lines up carries the datum, so its absence here is the veil holding
    expect(scaledPublic).not.toMatch(/kmScale/);
    expect(JSON.stringify(scaledWs)).toMatch(/"kmScale":5/);
  });

  it('the canonize rule: first canonize stamps the supply, a re-canonize re-receives the prior digest and never mints', () => {
    expect(kmScaleForCanonize({ priorDigest: undefined, supplied: 4 })).toEqual({ kmScale: 4, receipt: null });
    expect(kmScaleForCanonize({ priorDigest: undefined, supplied: undefined })).toEqual({ kmScale: null, receipt: null });
    expect(kmScaleForCanonize({ priorDigest: { kmScale: 6 }, supplied: 4 })).toEqual({ kmScale: 6, receipt: null });
    expect(kmScaleForCanonize({ priorDigest: {}, supplied: 4 })).toEqual({ kmScale: null, receipt: null });
    expect(kmScaleForCanonize({ priorDigest: null, supplied: -1 })).toEqual({
      kmScale: null,
      receipt: { kind: 'kmScale_healed_to_absent', from: 'supplied', refusal: 'not_positive', rawType: 'number' },
    });
    expect(kmScaleForCanonize(null)).toEqual({ kmScale: null, receipt: null });
    expect(creationKmScale(undefined)).toBe(DEFAULT_KM_SCALE);
    expect(creationKmScale('3km')).toBe(DEFAULT_KM_SCALE);
    expect(creationKmScale(2.5)).toBe(2.5);
  });
});

/* ── A5: the hash arm ───────────────────────────────────────────────────────────────── */

const NOW = '2026-01-01T00:00:00.000Z';
const IDS = ['a', 'b', 'c', 'd'];
const GRAIN = 'Bulk grain and foodstuffs';
const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const DAWN = deity('custom:wy1_dawn', 'Dawnfather', 'good', 'lawful', 'major');
const MAW = deity('custom:wy1_maw', 'The Maw', 'evil', 'chaotic', 'major');

/** The golden map's frozen digest re-keyed to the campaign's four nodes. */
function hashArmDigest(kmScale) {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placements = placeSettlements(pack, IDS.length).map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements, ...(kmScale === undefined ? {} : { kmScale }) });
}

function hashArmSave(id, name, patron, { exports = [], imports = [], conditions = [] } = {}) {
  return {
    id, name, phase: 'canon',
    settlement: {
      name, tier: 'town', population: 1600,
      config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30, primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron },
      institutions: [],
      economicState: { primaryExports: exports, primaryImports: imports },
      powerStructure: { publicLegitimacy: { score: 34, label: 'Contested' }, factions: [{ faction: 'Merchant League', category: 'economy', power: 55 }], conflicts: [] },
      npcs: [{ id: `reeve_${id}`, name: `Reeve ${name}`, importance: 'key' }],
      activeConditions: conditions,
    },
    campaignState: { phase: 'canon', eventLog: [], locks: {} },
  };
}

/** Four weekly pulses of a famine propagating along grain channels; returns every pulse record. */
function pulseRecords(digest) {
  let saves = [
    hashArmSave('a', 'Ashford', DAWN, { exports: [GRAIN], conditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] }),
    hashArmSave('b', 'Briarwatch', MAW, { imports: [GRAIN] }),
    hashArmSave('c', 'Crownhold', DAWN, { imports: [GRAIN] }),
    hashArmSave('d', 'Deepmoor', MAW, { imports: [GRAIN] }),
  ];
  let campaign = {
    id: 'wy1-hash', name: 'Scale Charter', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'wy1-hash-arm', tick: 1,
      simulationRules: { religionDynamicsEnabled: true, warLayerEnabled: true, propagationMode: 'first_order' },
      stressors: [{ id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 }],
      spatialCanonVersion: 1,
      spatialDigest: digest,
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'trade_partner' },
        { id: 'edge.a.d', from: 'a', to: 'd', relationshipType: 'trade_partner' },
      ],
      channels: ['b', 'c', 'd'].map((to) => ({ id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to, goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed' })),
    }, { now: NOW }), // the fixed clock: the graph's provenance stamps are otherwise wall-clock
    wizardNews: { currentTick: 1, entries: [] },
  };
  const records = [];
  for (let t = 0; t < 4; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    records.push({ worldState: r.worldState, regionalGraph: r.regionalGraph, settlementUpdates: r.settlementUpdates });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return records;
}

/** The simulated outcome with the digest itself set aside, so only what the pulse DID is compared. */
const outcomeOf = (records) => records.map(({ worldState, ...rest }) => {
  const { spatialDigest, ...world } = worldState || {};
  return { ...rest, worldState: world };
});

// Recorded at ⟨BASE⟩ 3f05e36e0 with the base sources, BEFORE WY-1 existed: the digest is the
// committed keystone golden (tests/fixtures/spatial-digest-golden.json), the pulse records are
// this harness's four ticks. An absent datum must reproduce both, byte for byte.
const BASE_DIGEST_HASH = '3ddda43a3ff1421c339a4b1922cb0b48895083c6c824f8f246e89871dad59c2c';
const BASE_PULSE_HASH = '9dfb641e448d95768d2be1d80405a21054a65d5929c3dfec39c2686950275fd0';

describe('WY-1 A5 — dark by ABSENT DATA: the digest and the pulse record are byte-identical to the base', () => {
  it('ABSENT or refused datum: the golden digest hashes to the base, whatever refused shape was supplied', () => {
    const pack = makeGridPack({ cols: 24, rows: 18 });
    const placements = placeSettlements(pack, 8);
    for (const kmScale of [undefined, null, 'far', -1, 0, NaN, Infinity]) {
      expect(sha(buildSpatialDigest({ pack, placements, ...(kmScale === undefined ? {} : { kmScale }) })), String(kmScale)).toBe(BASE_DIGEST_HASH);
    }
  });

  it('ABSENT datum: four pulse records hash to the base', () => {
    expect(sha(pulseRecords(hashArmDigest(undefined)))).toBe(BASE_PULSE_HASH);
  }, 60_000);

  it('PRESENT datum: the digest carries it and the pulse OUTCOME moves (the arm the base sources must fail)', () => {
    const plain = hashArmDigest(undefined);
    const scaled = hashArmDigest(calibration(hashArmDigest(1)).impliedKmScale * 6);
    expect(scaled.kmScale).toBeGreaterThan(0);
    const before = outcomeOf(pulseRecords(plain));
    const after = outcomeOf(pulseRecords(scaled));
    // anchored: the scaled digest carries its datum (asserted above), so an unmoved outcome would be the datum ignored
    expect(sha(after)).not.toBe(sha(before));
  }, 60_000);
});

describe('WY-1 A6 — the port program\'s flag is not read by any WY-1 code (a token scan)', () => {
  const WY1_FILES = [
    'src/domain/spatial/modeSpeeds.js',
    'src/domain/spatial/distanceRead.js',
    'src/domain/spatial/spatialDigest.js',
    'src/store/campaignSpatialCanonize.js',
  ];
  const FLAG_RE = /\bportOpportunityEnabled\b/;

  it('no WY-1 file names the flag in executable code', () => {
    const hits = WY1_FILES.filter((rel) => FLAG_RE.test(codeOnly(readFileSync(join(ROOT, rel), 'utf8'))));
    expect(hits).toEqual([]);
    // anchored: the planted read below is found by the same scan, so the empty list is not a blind scanner
    expect(FLAG_RE.test(codeOnly('const lit = rules.portOpportunityEnabled === true;'))).toBe(true);
    expect(FLAG_RE.test(codeOnly('// portOpportunityEnabled stays the port program\'s flag'))).toBe(false);
  });
});

describe('WY-1 A7 — the DRAFT tuning rows exist, unsigned, with every leaf united', () => {
  it('both tables carry a draft row whose unit map covers every leaf', () => {
    const register = JSON.parse(readFileSync(join(ROOT, 'tests/lint/.tuning-register.json'), 'utf8'));
    expect(register.signatureVersion).toBe(0);
    const mode = register.tables['src/domain/spatial/modeSpeeds.js#MODE_SPEED_TUNING'];
    const scale = register.tables['src/domain/spatial/modeSpeeds.js#KM_SCALE_TUNING'];
    for (const row of [mode, scale]) {
      expect(row.status).toBe('draft');
      expect(row.signedAt).toBeNull();
    }
    expect(Object.keys(mode.unit)).toEqual(MODES.map((m) => `MODE_SPEEDS.${m}`));
    expect(Object.keys(scale.unit)).toEqual(['DEFAULT_KM_SCALE']);
  });
});
