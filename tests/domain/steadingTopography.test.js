/**
 * steadingTopography.test.js — W-E / J-D4 pins: SATELLITE TOPOGRAPHY.
 *
 * The law under test (docs/DESIGN_REALM_DIRECTIVES.md directive 4 + J-D4):
 * "satellites sample spatial rasters READ-ONLY at a seeded draw inside the orbit
 * annulus; they never join the frozen spatial digest; resource derivation uses the
 * sampled topography through the existing resource-strike vocabulary."
 *
 * What is pinned here:
 *   • VOCABULARY TOTALITY — the landform vocabulary is closed and every authored
 *     lean names a REAL RESOURCE_DATA key that is LEGAL on its own ground (an
 *     authored lean the ground forbids would be dead code wearing a table's face).
 *   • THE BAND READS THE REAL COST LAW — landformOfCost is cross-checked against
 *     buildCostField itself, not against a restatement of the arithmetic.
 *   • THE ANNULUS — inside the parent's own country, never water, never another
 *     settlement's ground, bounded, deterministic, occupancy-aware.
 *   • PLACEMENT DETERMINISM — same world, same tick, same site.
 *   • SUITABILITY ACTUALLY WEIGHTS — a derived binomial envelope around the rate
 *     the frozen weights imply, which simultaneously REJECTS the uniform null.
 *   • THE CANONICAL STORY — a resource-strike steading lands at its seam.
 *   • RESOURCES FOLLOW THE GROUND — riverside leans fishing/mill, upland leans
 *     quarry/ore, and nothing illegal at the ground is ever derived.
 *   • CONSERVATION + DORMANCY — Σ stays exact on a spatial world; an ASPATIAL world
 *     samples nothing and its satellite RNG stream is byte-identical to pre-W-E.
 *   • THE DIGEST IS NEVER WRITTEN — deep-frozen input, byte-compared after a drive.
 *   • PERSISTENCE — site and resources survive a JSON round trip and a later tick.
 */
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { createPRNG } from '../../src/kernel/prng.js';
import { buildSpatialDigest } from '../../src/domain/spatial/spatialDigest.js';
import { buildCostField, TERRAIN_CLASSES } from '../../src/domain/spatial/spatialCost.js';
import { RESOURCE_DATA } from '../../src/data/resourceData.js';
import { envelopeBound } from '../helpers/distributionEnvelope.js';
import {
  advanceSettlementLifecycle,
  satellitesOf,
} from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import {
  STEADING_LANDFORMS,
  STEADING_TOPOGRAPHY_TUNING,
  LANDFORM_COST_BANDS,
  LANDFORM_RESOURCE_LEAN,
  LANDFORM_SITE_ACCESS,
  LANDFORM_SUITABILITY,
  LANDFORM_PLACE_NAME,
  TERRAIN_CLASS_LANDFORM,
  chooseSteadingSite,
  deriveSteadingResources,
  landformOfCost,
  landformPlaceName,
  orbitAnnulus,
  seamLandforms,
  siteLegalResources,
} from '../../src/domain/worldPulse/steadingTopography.js';

const T = STEADING_TOPOGRAPHY_TUNING;
const NOW = '2026-01-01T00:00:00.000Z';

// ── A pack builder with per-cell control (the fixture grid's bands are fixed;
//    these pins need a NAMED ground at a NAMED cell). Same shape the iframe
//    capture exposes: cells.h / biome / r / p / c, 4-neighbour adjacency. ───────
/**
 * @param {{ cols: number, rows: number,
 *   ground: (col: number, row: number) => { h: number, biome: number, river?: boolean } }} spec
 */
function bandPack({ cols, rows, ground }) {
  const n = cols * rows;
  const h = new Array(n); const biome = new Array(n);
  const r = new Array(n); const p = new Array(n); const c = new Array(n);
  const idx = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const i = idx(col, row);
      const g = ground(col, row);
      h[i] = g.h; biome[i] = g.biome; r[i] = g.river ? 1 : 0;
      p[i] = [col * 40, row * 40];
      const nb = [];
      if (col > 0) nb.push(idx(col - 1, row));
      if (col < cols - 1) nb.push(idx(col + 1, row));
      if (row > 0) nb.push(idx(col, row - 1));
      if (row < rows - 1) nb.push(idx(col, row + 1));
      c[i] = nb;
    }
  }
  return { cells: { h, biome, r, p, c }, meta: { cols, rows } };
}

// Ground presets, chosen so BOTH evidence sources agree where it matters.
const GRASS = { h: 40, biome: 4 };                        // cost 90  → open_lowland
const GRASS_RIVER = { h: 40, biome: 4, river: true };     // cost 120 → river_lowland
const RIDGE = { h: 78, biome: 9 };                        // cost 484 → upland (and terrain class 'mountain')
const DECIDUOUS = { h: 40, biome: 6 };                    // cost 190 → woodland

/** A one-parent world whose whole map is one ground, with optional overrides. */
function worldDigest({ cols = 12, rows = 8, ground, ids = ['a'], seats }) {
  const pack = bandPack({ cols, rows, ground });
  const placements = ids.map((id, i) => ({ id, cellId: seats[i] }));
  return buildSpatialDigest({ pack, placements });
}

// ── Kernel drive helpers (mirror settlementLifecycleKernel.test.js) ────────────
function town(id, { conditions = [], nearbyResources = [] } = {}) {
  return {
    name: `${id}-name`, tier: 'town', population: 4800, culture: 'germanic',
    config: { terrainType: 'plains', tradeRouteAccess: 'road', tier: 'town', settType: 'town', nearbyResources },
    economicState: { prosperity: 'Prosperous' },
    powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
    activeConditions: conditions,
    populationHistory: [], npcs: [],
  };
}
const boomCond = { id: 'condition.boom.t', archetype: 'boom', label: 'Boom', severity: 0.4, affectedSystems: [] };
const strikeCond = (key) => ({
  id: 'condition.strike.t', archetype: 'resource_strike', label: 'Strike', severity: 0.4,
  affectedSystems: [], triggeredAt: { sourceEventTargetId: key },
});
const pIndexOf = (scores = {}) => ({ get: (id, kind) => ({ score: scores[`${id}:${kind}`] ?? 0 }) });

/** One lit tick over a primed integrator; returns the founded record (or null). */
function foundOnce({ digest, conditions = [], seed = 'topo', tick = 300, nearbyResources = [], ledger = null }) {
  const settlement = town('a', { conditions, nearbyResources });
  const snapshot = { settlements: [{ id: 'a', name: settlement.name, settlement }] };
  const updates = [{ saveId: 'a', settlement }];
  const worldState = {
    tick,
    simulationRules: { settlementLifecycleEnabled: true },
    spatialLedgers: { satellites: ledger || { a: { seedAcc: 0.8, steadings: {} } } },
    ...(digest ? { spatialCanonVersion: 1, spatialDigest: digest } : {}),
  };
  const out = advanceSettlementLifecycle({
    snapshot, worldState, settlementUpdates: updates, pIndex: pIndexOf(),
    rng: createPRNG(seed), tick, now: NOW,
  });
  const sats = satellitesOf(out.worldState.spatialLedgers?.satellites || null, 'a');
  return { record: sats[0] || null, out, worldState };
}

// ══ VOCABULARY TOTALITY ══════════════════════════════════════════════════════
describe('the landform vocabulary is closed and every authored table is total', () => {
  it('suitability, site access, lean and place-name all cover EXACTLY the vocabulary', () => {
    const vocab = [...STEADING_LANDFORMS].sort();
    expect(Object.keys(LANDFORM_SUITABILITY).sort()).toEqual(vocab);
    expect(Object.keys(LANDFORM_SITE_ACCESS).sort()).toEqual(vocab);
    expect(Object.keys(LANDFORM_RESOURCE_LEAN).sort()).toEqual(vocab);
    expect(Object.keys(LANDFORM_PLACE_NAME).sort()).toEqual(vocab);
    // The vocabulary is non-vacuous and every band emits a member of it.
    expect(STEADING_LANDFORMS.length).toBeGreaterThanOrEqual(8);
    for (const band of LANDFORM_COST_BANDS) expect(STEADING_LANDFORMS).toContain(band.landform);
  });

  it('the digest terrain-class map covers EXACTLY the frozen TERRAIN_CLASSES', () => {
    expect(Object.keys(TERRAIN_CLASS_LANDFORM).sort()).toEqual([...TERRAIN_CLASSES].sort());
    // Water is the one class that never yields a site.
    expect(TERRAIN_CLASS_LANDFORM.water).toBe(null);
    for (const [cls, landform] of Object.entries(TERRAIN_CLASS_LANDFORM)) {
      if (cls === 'water') continue;
      expect(STEADING_LANDFORMS, `${cls} maps outside the vocabulary`).toContain(landform);
    }
  });

  it('EVERY leaned key is a real RESOURCE_DATA key AND legal on its own ground', () => {
    const dead = [];
    let leaned = 0;
    for (const [landform, keys] of Object.entries(LANDFORM_RESOURCE_LEAN)) {
      const legal = new Set(siteLegalResources(landform));
      for (const key of keys) {
        leaned += 1;
        if (!Object.prototype.hasOwnProperty.call(RESOURCE_DATA, key)) dead.push(`${landform}: ${key} is not a RESOURCE_DATA key`);
        else if (!legal.has(key)) dead.push(`${landform}: ${key} is forbidden on its own ground (a dead lean)`);
      }
    }
    expect(leaned, 'the lean table is non-vacuous').toBeGreaterThanOrEqual(25);
    expect(dead).toEqual([]);
  });

  it('every ground yields a non-empty legal pool through the EXISTING resource vocabulary', () => {
    for (const landform of STEADING_LANDFORMS) {
      const legal = siteLegalResources(landform);
      expect(legal.length, `${landform} has no legal resource at all`).toBeGreaterThan(0);
      // Codepoint-ordered so a seeded index draw over it is device-stable.
      expect(legal).toEqual([...legal].sort());
      for (const key of legal) expect(Object.prototype.hasOwnProperty.call(RESOURCE_DATA, key)).toBe(true);
    }
  });
});

// ══ THE BAND READS THE REAL COST LAW ═════════════════════════════════════════
describe('landformOfCost is cross-checked against buildCostField itself', () => {
  const cases = [
    { name: 'ocean', h: 10, biome: 0, river: false, landform: null },
    { name: 'grassland', h: 40, biome: 4, river: false, landform: 'open_lowland' },
    { name: 'savanna', h: 40, biome: 3, river: false, landform: 'open_lowland' },
    { name: 'grassland on a river', h: 40, biome: 4, river: true, landform: 'river_lowland' },
    { name: 'savanna on a river', h: 40, biome: 3, river: true, landform: 'river_lowland' },
    { name: 'tundra', h: 40, biome: 10, river: false, landform: 'broken_flat' },
    { name: 'hot desert', h: 40, biome: 1, river: false, landform: 'broken_flat' },
    { name: 'deciduous forest', h: 40, biome: 6, river: false, landform: 'woodland' },
    { name: 'taiga', h: 40, biome: 9, river: false, landform: 'woodland' },
    { name: 'high taiga ridge', h: 78, biome: 9, river: false, landform: 'upland' },
    { name: 'glacier', h: 40, biome: 11, river: false, landform: 'upland' },
  ];

  it('every band boundary is the one the FROZEN cost law actually produces', () => {
    for (const c of cases) {
      // Run the real builder, not a restatement of the arithmetic.
      const field = buildCostField({ h: [c.h], biome: [c.biome], r: [c.river ? 1 : 0] }, 1);
      expect(landformOfCost(field[0]), `${c.name} (cost ${field[0]})`).toBe(c.landform);
    }
  });

  it('the river band is reachable ONLY through the river term (the water-proximity claim)', () => {
    // Sweep every biome with and without the river bias at flat elevation: no BARE
    // biome lands in the river band, so a river_lowland reading is river evidence.
    const bare = [];
    const watered = [];
    for (let biome = 0; biome <= 12; biome += 1) {
      bare.push(landformOfCost(buildCostField({ h: [40], biome: [biome], r: [0] }, 1)[0]));
      watered.push(landformOfCost(buildCostField({ h: [40], biome: [biome], r: [1] }, 1)[0]));
    }
    expect(bare.filter((l) => l === 'river_lowland').length, 'a dry cell never reads as a river course').toBe(0);
    expect(watered.filter((l) => l === 'river_lowland').length, 'watered lowland does').toBeGreaterThan(0);
  });
});

// ══ THE ANNULUS ══════════════════════════════════════════════════════════════
describe('the orbit annulus is the parent country, bounded and deterministic', () => {
  const digest = worldDigest({
    ground: (col, row) => (row === 3 ? GRASS_RIVER : (col === 9 ? RIDGE : GRASS)),
    ids: ['a', 'b'], seats: [13, 22],
  });

  it('every candidate sits on the PARENT country, on land, inside the cap', () => {
    const parentIndex = digest.settlementIds.indexOf('a');
    const sites = orbitAnnulus(digest, 'a', {});
    expect(sites.length, 'the annulus is non-vacuous').toBeGreaterThan(0);
    expect(sites.length).toBeLessThanOrEqual(T.CANDIDATE_CAP);
    for (const s of sites) {
      expect(digest.territory[s.cell], 'a candidate in another settlement country').toBe(parentIndex);
      expect(digest.costField[s.cell], 'a candidate on water').toBeGreaterThan(0);
      expect(STEADING_LANDFORMS).toContain(s.landform);
      expect(['gate_terrain', 'cost_band']).toContain(s.source);
    }
    // Distinct cells only.
    expect(new Set(sites.map((s) => s.cell)).size).toBe(sites.length);
  });

  it('is a pure function of (digest, parentId): identical across calls, and empty for an unmapped parent', () => {
    expect(JSON.stringify(orbitAnnulus(digest, 'a', {}))).toBe(JSON.stringify(orbitAnnulus(digest, 'a', {})));
    expect(orbitAnnulus(digest, 'nobody', {})).toEqual([]);
    expect(orbitAnnulus(null, 'a', {})).toEqual([]);
  });

  it('cells an existing steading already holds are excluded (no two steadings on one site)', () => {
    const first = orbitAnnulus(digest, 'a', {})[0];
    const rest = orbitAnnulus(digest, 'a', { occupied: [first.cell] });
    expect(rest.some((s) => s.cell === first.cell)).toBe(false);
  });

  it('the gate cells carry the terrain class the digest NAMED (both evidence sources appear)', () => {
    const sources = new Set(orbitAnnulus(digest, 'a', {}).map((s) => s.source));
    expect(sources.has('cost_band')).toBe(true);
    // The parent shares a gate with b, so the digest names at least one of its cells.
    const gateCells = new Set();
    for (const receipt of Object.values(digest.routeReceipts)) {
      for (const seg of receipt.segments) { gateCells.add(seg.cellA); gateCells.add(seg.cellB); }
    }
    expect(gateCells.size, 'the fixture really has gates').toBeGreaterThan(0);
  });
});

// ══ THE SEEDED, WEIGHTED PICK ════════════════════════════════════════════════
describe('suitability actually weights the seeded draw', () => {
  /** The minimal frozen-digest read shape: two candidate cells, one watered. */
  const twoGround = {
    settlementIds: ['a'],
    territory: [0, 0],
    costField: [90, 120], // open_lowland, river_lowland
    routeReceipts: {},
  };

  it('the hand-built read shape matches a really-built digest (the fixture is not a fiction)', () => {
    const real = worldDigest({ ground: () => GRASS, ids: ['a'], seats: [13] });
    for (const key of Object.keys(twoGround)) {
      expect(typeof real[key], `${key} shape`).toBe(typeof twoGround[key]);
      expect(Array.isArray(real[key])).toBe(Array.isArray(twoGround[key]));
    }
  });

  it('a water-heavy annulus births waterside steadings at the DESIGNED rate, and the uniform null is rejected', () => {
    const n = 400;
    let watered = 0;
    for (let i = 0; i < n; i += 1) {
      const fork = createPRNG(`site-dist-${i}`).fork('satellite:a:1:site');
      const site = chooseSteadingSite({ digest: twoGround, parentId: 'a', draw: () => fork.random() });
      if (site.landform === 'river_lowland') watered += 1;
    }
    // The rate the FROZEN weights imply, derived here rather than guessed.
    const designed = LANDFORM_SUITABILITY.river_lowland
      / (LANDFORM_SUITABILITY.river_lowland + LANDFORM_SUITABILITY.open_lowland);
    const high = envelopeBound({ n, baseRate: designed, direction: 'upper', alpha: 1e-4 });
    const low = envelopeBound({ n, baseRate: designed, direction: 'lower', alpha: 1e-4 });
    expect(high.margin, 'the instrument carries real power').toBeGreaterThan(2);
    expect(watered, `designed rate ${designed.toFixed(4)}; saw ${watered}/${n}`).toBeLessThan(high.bound);
    expect(watered).toBeGreaterThan(low.bound);
    // THE NEGATIVE CONTROL, BUILT IN: an UNWEIGHTED picker over the same two cells
    // would sit at 0.5. The observation must be outside that null's envelope, or
    // "the weighting weights" is unproven.
    const nullHigh = envelopeBound({ n, baseRate: 0.5, direction: 'upper', alpha: 1e-4 });
    expect(watered, 'a uniform picker could have produced this — the weighting is unproven')
      .toBeGreaterThanOrEqual(nullHigh.bound);
  });
});

// ══ THE CANONICAL STORY: THE CAMP SITS AT THE SEAM ═══════════════════════════
describe('a resource-strike steading lands at its seam (directive 4 founding example)', () => {
  // Lowland everywhere except one ridge column: the mining camp must find the rock.
  const ridgeDigest = worldDigest({
    ground: (col) => (col === 9 ? RIDGE : GRASS),
    ids: ['a'], seats: [13],
  });

  it('seamLandforms sends an ore strike to the high ground and a mill strike to the water', () => {
    expect([...seamLandforms('iron_deposits')]).toEqual(['upland']);
    expect([...seamLandforms('stone_quarry')]).toEqual(['upland']);
    expect([...seamLandforms('river_mills')]).toEqual(['river_lowland']);
    expect([...seamLandforms('river_fish')].sort()).toEqual(['marsh', 'river_lowland']);
    // An unknown key restricts nothing (total function, never a refusal).
    expect([...seamLandforms('not_a_resource')]).toEqual([]);
    expect([...seamLandforms(null)]).toEqual([]);
  });

  it('THE STORY: an iron strike founds its camp ON the ridge, EVERY time, not on the surrounding lowland', () => {
    // TOTALITY, not one lucky seed. The seam law is a restriction, so a strike must
    // land on rock across the whole seed family; a single-seed pin here passed even
    // with the restriction deleted (measured), which is the vacuous-green class.
    const offSeam = [];
    for (let i = 0; i < 32; i += 1) {
      const { record } = foundOnce({
        digest: ridgeDigest, conditions: [boomCond, strikeCond('iron_deposits')], seed: `seam-${i}`,
      });
      expect(record, 'the lane founded').toBeTruthy();
      expect(record.provenance).toBe('resource_strike');
      if (record.site.landform !== 'upland' || ridgeDigest.costField[record.site.cell] <= 280) {
        offSeam.push(`seed seam-${i}: ${record.site.landform} at cost ${ridgeDigest.costField[record.site.cell]}`);
      }
      expect(record.resources[0], 'the vein the camp exists for leads its ledger').toBe('iron_deposits');
    }
    expect(offSeam, 'a mining camp landed off its seam').toEqual([]);
  });

  it('NEGATIVE CONTROL: the SAME world without a strike is not forced onto the ridge', () => {
    // The annulus is overwhelmingly lowland, so an unweighted-by-seam founding must
    // land off the ridge. If this reds, the seam restriction is not doing the work
    // in the test above — the ridge would have won anyway.
    const landforms = new Set();
    for (let i = 0; i < 24; i += 1) {
      const { record } = foundOnce({ digest: ridgeDigest, conditions: [boomCond], seed: `growth-${i}` });
      landforms.add(record.site.landform);
    }
    expect(landforms.has('open_lowland'), 'a growth founding reaches the lowland').toBe(true);
  });
});

// ══ RESOURCES FOLLOW THE SAMPLED GROUND ══════════════════════════════════════
describe('starting resources derive from the sampled ground through the existing vocabulary', () => {
  const drawsFor = (landform, parentResources = []) => {
    const seen = new Set();
    for (let i = 0; i < 60; i += 1) {
      const fork = createPRNG(`res-${landform}-${i}`).fork('satellite:a:1:site');
      for (const key of deriveSteadingResources({ landform, draw: () => fork.random(), parentResources })) seen.add(key);
    }
    return seen;
  };

  it('a riverside site leans FISHING and MILL; an upland site leans QUARRY and ORE', () => {
    const river = drawsFor('river_lowland');
    expect([...river].some((k) => k === 'river_fish'), 'the river feeds a fishery').toBe(true);
    expect([...river].some((k) => k === 'river_mills'), 'and turns a mill').toBe(true);
    const upland = drawsFor('upland');
    expect([...upland].some((k) => k === 'stone_quarry'), 'the rock is quarried').toBe(true);
    expect([...upland].some((k) => k === 'iron_deposits'), 'and the ore is worked').toBe(true);
    // AND THE CROSS-CHECK: neither ground can produce the other's water-locked keys.
    expect([...upland].some((k) => k === 'river_fish' || k === 'river_mills'), 'no fishery on the ridge').toBe(false);
  });

  it('every derived key is LEGAL at its ground and inside the closed vocabulary', () => {
    for (const landform of STEADING_LANDFORMS) {
      const legal = new Set(siteLegalResources(landform));
      for (const key of drawsFor(landform)) {
        expect(legal.has(key), `${key} is not legal on ${landform}`).toBe(true);
        expect(Object.prototype.hasOwnProperty.call(RESOURCE_DATA, key)).toBe(true);
      }
    }
  });

  it('parent inheritance is a WEIGHTED component, never the whole', () => {
    // grain_fields is legal on open lowland but NOT in its lean; a parent that holds
    // it must lift it without monopolising the ledger.
    const withParent = drawsFor('open_lowland', ['grain_fields']);
    expect(withParent.has('grain_fields'), 'the settlers brought their trade').toBe(true);
    const siteNative = [...withParent].filter((k) => LANDFORM_RESOURCE_LEAN.open_lowland.includes(k));
    expect(siteNative.length, 'the ground still speaks for itself').toBeGreaterThan(0);
    // An illegal inheritance is dropped rather than smuggled through.
    const badParent = drawsFor('upland', ['river_fish']);
    expect(badParent.has('river_fish'), 'a trade the ground forbids does not travel').toBe(false);
  });

  it('the derivation is bounded and deterministic per seed', () => {
    const once = () => {
      const fork = createPRNG('res-det').fork('satellite:a:1:site');
      return deriveSteadingResources({ landform: 'river_lowland', draw: () => fork.random(), parentResources: ['grain_fields'] });
    };
    expect(once()).toEqual(once());
    expect(once().length).toBeLessThanOrEqual(T.SITE_RESOURCE_CAP);
  });
});

// ══ END-TO-END: DETERMINISM, CONSERVATION, DORMANCY, PURITY, PERSISTENCE ═════
describe('the lane end to end (determinism, conservation, aspatial identity)', () => {
  const mixedDigest = worldDigest({
    ground: (col, row) => (row === 3 ? GRASS_RIVER : (col === 9 ? RIDGE : (row === 6 ? DECIDUOUS : GRASS))),
    ids: ['a'], seats: [13],
  });

  it('PLACEMENT DETERMINISM: same world, same tick, same site', () => {
    // TWO FULL PASSES over a seed FAMILY, not one seed twice. Back-to-back calls
    // cannot see call-order or wall-clock dependence: a hidden counter flips parity
    // between the two calls and can still land on the same cell by luck (measured).
    // Running the whole family, then running it again, exposes any state that
    // survives between calls.
    const pass = () => Array.from({ length: 16 }, (_, i) => {
      const { record } = foundOnce({ digest: mixedDigest, conditions: [boomCond], seed: `det-${i}` });
      return JSON.stringify(record);
    });
    const first = pass();
    const second = pass();
    expect(second).toEqual(first);
    // Non-vacuous: the family really reaches more than one site.
    const cells = new Set(first.map((json) => JSON.parse(json).site.cell));
    expect(cells.size, 'the seed family reaches several sites').toBeGreaterThan(1);
    for (const cell of cells) expect(mixedDigest.territory[cell], 'every site is parent country').toBe(0);
  });

  it('PURITY, STRUCTURALLY: the topography module holds no mutable state and no ambient clock', () => {
    // A behavioural double pass cannot catch a call-order dependency whose period
    // divides the pass length (measured: a hidden parity counter survived a 16-seed
    // double pass). The habitat is what is checkable: a placement reader with NO
    // module-scope mutable binding and NO ambient entropy cannot be order-dependent.
    const source = readFileSync(
      new URL('../../src/domain/worldPulse/steadingTopography.js', import.meta.url), 'utf8',
    ).replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
    // Guard the guard: the stripper left the real code behind.
    expect(source).toContain('export function chooseSteadingSite');
    const offences = [];
    if (/\bMath\s*\.\s*random\b/.test(source)) offences.push('Math.random');
    if (/\bDate\s*\./.test(source)) offences.push('Date');
    if (/\bglobalThis\b/.test(source)) offences.push('globalThis');
    if (/\bperformance\s*\./.test(source)) offences.push('performance');
    for (const line of source.split('\n')) {
      if (/^(let|var)\s/.test(line)) offences.push(`module-scope mutable binding: ${line.trim()}`);
    }
    expect(offences).toEqual([]);
  });

  it('CONSERVATION: a spatial founding still debits the parent EXACTLY', () => {
    const { record, out } = foundOnce({ digest: mixedDigest, conditions: [boomCond], seed: 'conserve' });
    const parentPop = out.settlementUpdates[0].settlement.population;
    const orbit = record.population;
    expect(parentPop + orbit, 'Σ(parent + orbit) is exact').toBe(4800);
    const receipt = out.receipts.find((r) => r.kind === 'satellite_founded');
    // `founders` is the BIRTH debit; the record also carries the same-tick grow
    // transfer, so the debit is a lower bound on the orbit, and the parent's own
    // history entry is the exact ledger of the founding.
    expect(receipt.founders).toBeLessThanOrEqual(orbit);
    const founding = out.settlementUpdates[0].settlement.populationHistory
      .find((e) => String(e.outcomeId || '').startsWith('lifecycle.found.'));
    expect(founding.delta).toBe(-receipt.founders);
    expect(receipt.site).toEqual(record.site);
  });

  it('ASPATIAL IDENTITY: the satellite RNG stream is untouched by the site fork', () => {
    // The site draws ride their OWN keyed fork, so every value the satellite stream
    // drives — names, founders, starve draws, convergence draws — must be identical
    // with and without a digest. A single founding tick is NOT enough evidence: the
    // name and founders draws come FIRST, so sharing the fork object still leaves
    // them equal and only perturbs the LATER draws (measured). This drives many
    // ticks over a populated, starving, converge-eligible orbit so those later
    // draws are actually exercised, and compares everything except the two new
    // fields and the one chronicle line that names the ground.
    /** Everything about a record the RNG stream decides. */
    const streamShape = (rec) => ({
      id: rec.id, name: rec.name, population: rec.population, tier: rec.tier,
      orbit: rec.orbit, foundedTick: rec.foundedTick, provenance: rec.provenance,
      starvingSince: rec.starvingSince ?? null, charterPending: rec.charterPending ?? null,
      historyLines: rec.history.length,
    });
    const run = (digest) => {
      let settlement = town('a', { conditions: [boomCond] });
      let snapshot = { settlements: [{ id: 'a', name: settlement.name, settlement }] };
      let updates = [{ saveId: 'a', settlement }];
      let worldState = {
        tick: 300,
        simulationRules: { settlementLifecycleEnabled: true },
        spatialLedgers: { satellites: { a: { seedAcc: 0.8, steadings: {
          s1: { id: 's1', name: 'S1', parentId: 'a', tier: 'thorp', population: 40, foundedTick: 100, provenance: 'growth', orbit: 5, inflow: 40, backing01: 0.5, history: ['Founded.'] },
          s2: { id: 's2', name: 'S2', parentId: 'a', tier: 'thorp', population: 45, foundedTick: 100, provenance: 'growth', orbit: 6, inflow: 45, backing01: 0.5, history: ['Founded.'] },
        } } } },
        ...(digest ? { spatialCanonVersion: 1, spatialDigest: digest } : {}),
      };
      const rng = createPRNG('stream-parity');
      const trace = [];
      for (let tick = 300; tick < 330; tick += 1) {
        const out = advanceSettlementLifecycle({
          snapshot, worldState: { ...worldState, tick }, settlementUpdates: updates,
          pIndex: pIndexOf({ 'a:trade': tick > 312 ? 1 : 0 }), rng, tick, now: NOW,
        });
        worldState = out.worldState;
        updates = out.settlementUpdates;
        snapshot = { settlements: updates.map((u) => ({ id: u.saveId, name: u.settlement?.name, settlement: u.settlement })) };
        trace.push({
          tick,
          receipts: out.receipts.map((r) => `${r.kind}:${r.satId ?? ''}:${r.founders ?? ''}`),
          parent: updates[0].settlement.population,
          orbit: satellitesOf(worldState.spatialLedgers?.satellites || null, 'a').map(streamShape),
        });
      }
      return trace;
    };
    const withGround = run(mixedDigest);
    const without = run(null);
    // The probe is not vacuous: the lane really moved over the window.
    const kinds = new Set(withGround.flatMap((t) => t.receipts.map((r) => r.split(':')[0])));
    expect(kinds.has('satellite_founded'), 'a founding fired').toBe(true);
    expect(kinds.size, 'several stream-driven events fired').toBeGreaterThanOrEqual(3);
    expect(JSON.stringify(without)).toBe(JSON.stringify(withGround));

    // OUTCOME PARITY IS NOT ENOUGH. The satellite fork is rebuilt every tick, so a
    // stolen draw only perturbs the REST OF THAT TICK and can hide behind a gate
    // that fails either way (measured: sharing the fork object left this whole
    // 30-tick trace identical). So ACCOUNT for the draws directly: the site stream
    // must be its own key, and the satellite key's draw count must be untouched.
    const countedRun = (digest) => {
      const base = createPRNG('stream-parity');
      /** @type {Map<string, number>} */
      const draws = new Map();
      const rng = {
        fork(key) {
          const f = base.fork(key);
          if (!draws.has(key)) draws.set(key, 0);
          return { random: () => { draws.set(key, draws.get(key) + 1); return f.random(); } };
        },
      };
      let settlement = town('a', { conditions: [boomCond] });
      let snapshot = { settlements: [{ id: 'a', name: settlement.name, settlement }] };
      let updates = [{ saveId: 'a', settlement }];
      let worldState = {
        tick: 300,
        simulationRules: { settlementLifecycleEnabled: true },
        spatialLedgers: { satellites: { a: { seedAcc: 0.8, steadings: {} } } },
        ...(digest ? { spatialCanonVersion: 1, spatialDigest: digest } : {}),
      };
      for (let tick = 300; tick < 306; tick += 1) {
        const out = advanceSettlementLifecycle({
          snapshot, worldState: { ...worldState, tick }, settlementUpdates: updates,
          pIndex: pIndexOf(), rng, tick, now: NOW,
        });
        worldState = out.worldState;
        updates = out.settlementUpdates;
        snapshot = { settlements: updates.map((u) => ({ id: u.saveId, name: u.settlement?.name, settlement: u.settlement })) };
      }
      return draws;
    };
    const groundedDraws = countedRun(mixedDigest);
    const aspatialDraws = countedRun(null);
    expect(groundedDraws.get('satellite:a:300:site'), 'the site stream really ran').toBeGreaterThan(0);
    expect(aspatialDraws.has('satellite:a:300:site'), 'an aspatial world forks no site stream').toBe(false);
    const satelliteKeys = [...groundedDraws.keys()].filter((k) => !k.endsWith(':site')).sort();
    expect(satelliteKeys.length, 'the satellite stream really ran').toBeGreaterThan(0);
    for (const key of satelliteKeys) {
      expect(groundedDraws.get(key), `${key} draw count moved`).toBe(aspatialDraws.get(key));
    }

    // ...and an aspatial record carries NO ground at all (pre-W-E byte shape).
    const single = foundOnce({ digest: null, conditions: [boomCond], seed: 'stream' });
    const grounded = foundOnce({ digest: mixedDigest, conditions: [boomCond], seed: 'stream' });
    expect('site' in single.record).toBe(false);
    expect('resources' in single.record).toBe(false);
    expect('site' in grounded.record).toBe(true);
    expect('resources' in grounded.record).toBe(true);
  });

  it('THE DIGEST IS NEVER WRITTEN (deep-frozen input, byte-identical after a drive)', () => {
    const deepFreeze = (o) => {
      if (o && typeof o === 'object' && !Object.isFrozen(o)) {
        Object.freeze(o);
        for (const v of Object.values(o)) deepFreeze(v);
      }
      return o;
    };
    const frozen = worldDigest({ ground: (col) => (col === 9 ? RIDGE : GRASS), ids: ['a'], seats: [13] });
    const before = JSON.stringify(frozen);
    deepFreeze(frozen);
    const { record } = foundOnce({ digest: frozen, conditions: [boomCond, strikeCond('iron_deposits')], seed: 'frozen' });
    expect(record.site, 'the drive really sampled it').toBeTruthy();
    expect(JSON.stringify(frozen)).toBe(before);
  });

  it('PERSISTENCE: site and resources survive a JSON round trip and a later tick', () => {
    const first = foundOnce({ digest: mixedDigest, conditions: [boomCond], seed: 'persist' });
    const revived = JSON.parse(JSON.stringify(first.out.worldState));
    const rec = satellitesOf(revived.spatialLedgers.satellites, 'a')[0];
    expect(rec.site).toEqual(first.record.site);
    expect(rec.resources).toEqual(first.record.resources);
    // Drive one more tick off the REVIVED ledger: the ground is not re-rolled.
    const settlement = town('a');
    const snapshot = { settlements: [{ id: 'a', name: settlement.name, settlement }] };
    const next = advanceSettlementLifecycle({
      snapshot,
      worldState: { ...revived, tick: 301 },
      settlementUpdates: [{ saveId: 'a', settlement }],
      pIndex: pIndexOf(), rng: createPRNG('persist'), tick: 301, now: NOW,
    });
    const after = satellitesOf(next.worldState.spatialLedgers.satellites, 'a')[0];
    expect(after.site).toEqual(first.record.site);
    expect(after.resources).toEqual(first.record.resources);
  });

  it('THE HERALD names the ground in-world, with no key leaking into prose', () => {
    const { record, out } = foundOnce({ digest: mixedDigest, conditions: [boomCond], seed: 'herald' });
    const beat = out.newsEntries.find((n) => n.impactKind === 'steading_founded');
    expect(beat, 'a founding beat lands').toBeTruthy();
    const place = landformPlaceName(record.site.landform);
    expect(beat.summary.includes(place), `summary names ${place}`).toBe(true);
    expect(beat.reasons.some((r) => r.includes(place))).toBe(true);
    // Closed vocabulary, house voice: no snake_case key ever reaches the reader.
    const prose = `${beat.headline} ${beat.summary} ${beat.reasons.join(' ')}`;
    expect(/[a-z]+_[a-z]+/.test(prose), `a raw key leaked into prose: ${prose}`).toBe(false);
    expect(record.history[0].includes(place), 'the record chronicle names it too').toBe(true);
  });
});
