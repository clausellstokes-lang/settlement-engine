/**
 * demographicsLifecycleGolden.test.js — wave P5b's FIRST BOTH-FLAGS FENCE.
 *
 * docs/DESIGN_DEMOGRAPHIC_ENGINE.md §11b records a real draw-sequence interaction:
 * `demographicsEnabled` + `settlementLifecycleEnabled` together can complete a
 * plan-driven founding on a tick where the lifecycle seeding integrator alone would
 * not. No preset lights this pair yet, so no existing golden could see the shift.
 *
 * This is a NEW golden boundary, not a recapture of a dormant or single-flag fixture.
 * It drives the real lifecycle host, the real demographic plans, and the one satellite
 * mint over open spatial ground. Each manifest row records both the exact mechanical
 * projection hash and human-adjudicable evidence: founding ticks, plan identity, final
 * populations, satellite ids, and the receipt mix. The same-seed lifecycle-only twin
 * is recorded beside it so the §11b shift cannot collapse into an opaque hash change.
 *
 * Capture/refresh (owner-adjudicated behavior change only):
 *   UPDATE_GOLDEN=1 npx vitest run tests/property/demographicsLifecycleGolden.test.js
 */
import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { createPRNG } from '../../src/kernel/prng.js';
import { buildSpatialDigest } from '../../src/domain/spatial/spatialDigest.js';
import { advanceSettlementLifecycle } from '../../src/domain/worldPulse/settlementLifecycleKernel.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';

const MANIFEST = resolve(process.cwd(), 'tests', 'fixtures', 'demographics-lifecycle-golden.json');
const NOW = '2026-01-01T00:00:00.000Z';
const SEEDS = Object.freeze(['p5b-a', 'p5b-b', 'p5b-c', 'p5b-d']);

function place({ id, tier, population, dailyProduction, prosperity = 'Stable' }) {
  return {
    name: id, tier, population, culture: 'germanic',
    config: { tier, settType: tier, terrainType: 'plains', tradeRouteAccess: 'road' },
    economicState: {
      prosperity,
      foodSecurity: {
        dailyNeed: population * 2, dailyProduction, deficitPct: 0, surplusPct: 0,
        importDependency: 0, storageMonths: 1, resilienceScore: 60,
      },
    },
    powerStructure: { publicLegitimacy: { score: 50 }, factions: [], conflicts: [] },
    activeConditions: [], populationHistory: [], institutions: [], npcs: [],
  };
}

function openGrassPack(cols = 24, rows = 8) {
  const n = cols * rows;
  const h = new Array(n); const biome = new Array(n);
  const r = new Array(n); const p = new Array(n); const c = new Array(n);
  const index = (col, row) => row * cols + col;
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const i = index(col, row);
      h[i] = 40; biome[i] = 4; r[i] = 0; p[i] = [col * 40, row * 40];
      const neighbours = [];
      if (col > 0) neighbours.push(index(col - 1, row));
      if (col < cols - 1) neighbours.push(index(col + 1, row));
      if (row > 0) neighbours.push(index(col, row - 1));
      if (row < rows - 1) neighbours.push(index(col, row + 1));
      c[i] = neighbours;
    }
  }
  return { cells: { h, biome, r, p, c } };
}

function digestFor() {
  return buildSpatialDigest({
    pack: openGrassPack(),
    placements: [
      { id: 'Brimhold', cellId: 26 },
      { id: 'Farvale', cellId: 160 },
    ],
  });
}

function initialUpdates() {
  return [
    {
      saveId: 'Brimhold',
      settlement: place({
        id: 'Brimhold', tier: 'town', population: 9500,
        dailyProduction: 40_000, prosperity: 'Stable',
      }),
    },
    {
      saveId: 'Farvale',
      settlement: place({
        id: 'Farvale', tier: 'village', population: 900,
        dailyProduction: 2000, prosperity: 'Stable',
      }),
    },
  ];
}

function snapshotOf(updates) {
  return {
    settlements: updates.map((update) => ({
      id: update.saveId,
      name: update.saveId,
      settlement: update.settlement,
      causal: {
        scores: update.saveId === 'Brimhold'
          ? { economic_capacity: 45, trade_connectivity: 20 }
          : { economic_capacity: 35, trade_connectivity: 10 },
      },
    })),
  };
}

function histogram(rows) {
  const out = {};
  for (const row of rows) {
    const key = String(row.receipt?.kind || 'unknown');
    out[key] = (out[key] || 0) + 1;
  }
  return Object.fromEntries(Object.entries(out).sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0)));
}

/** @param {string} seed @param {'both'|'lifecycle'} mode */
function drive(seed, mode) {
  let updates = initialUpdates();
  let worldState = {
    rngSeed: seed,
    tick: 0,
    simulationRules: mode === 'both'
      ? { demographicsEnabled: true, settlementLifecycleEnabled: true }
      : { settlementLifecycleEnabled: true },
    spatialCanonVersion: 1,
    spatialDigest: digestFor(),
  };
  const trace = [];
  for (let tick = 1; tick <= 80; tick += 1) {
    const result = advanceSettlementLifecycle({
      snapshot: snapshotOf(updates), worldState, settlementUpdates: updates,
      pIndex: null, rng: createPRNG(`${seed}::${tick}`), tick, now: NOW,
    });
    worldState = result.worldState;
    updates = result.settlementUpdates;
    for (const receipt of result.receipts) trace.push({ tick, receipt });
  }

  const projection = normalizeForDormancy({
    settlements: updates.map((update) => ({
      id: update.saveId,
      population: update.settlement.population,
      tier: update.settlement.tier,
      populationHistory: update.settlement.populationHistory,
    })),
    satellites: worldState.spatialLedgers?.satellites,
    demographicPlans: worldState.spatialLedgers?.demographicPlans,
    trace,
  });
  const foundingRows = trace.filter((row) => row.receipt?.kind === 'satellite_founded');
  const planFoundings = foundingRows.filter((row) => row.receipt?.sources?.plan === true);
  return {
    hash: createHash('sha256').update(JSON.stringify(projection)).digest('hex'),
    projection,
    evidence: {
      firstFoundingTick: foundingRows[0]?.tick ?? null,
      firstPlanFoundingTick: planFoundings[0]?.tick ?? null,
      foundingTicks: foundingRows.map((row) => row.tick),
      planIds: planFoundings.map((row) => row.receipt.planId),
      finalPopulations: Object.fromEntries(updates.map((update) => [update.saveId, update.settlement.population])),
      satelliteIds: Object.values(worldState.spatialLedgers?.satellites || {})
        .flatMap((parent) => Object.keys(parent?.steadings || {})).sort(),
      receiptHistogram: histogram(trace),
    },
  };
}

function goldenRow(seed) {
  const both = drive(seed, 'both');
  const lifecycle = drive(seed, 'lifecycle');
  return {
    hash: both.hash,
    evidence: {
      ...both.evidence,
      lifecycleOnlyFirstFoundingTick: lifecycle.evidence.firstFoundingTick,
    },
  };
}

describe('demographics + settlement lifecycle — the dedicated both-flags golden', () => {
  if (process.env.UPDATE_GOLDEN) {
    it('captures the new both-flags manifest', () => {
      const out = Object.fromEntries(SEEDS.map((seed) => [seed, goldenRow(seed)]));
      if (!existsSync(dirname(MANIFEST))) mkdirSync(dirname(MANIFEST), { recursive: true });
      writeFileSync(MANIFEST, `${JSON.stringify(out, null, 2)}\n`);
      expect(Object.keys(out)).toEqual([...SEEDS]);
    }, 60_000);
    return;
  }

  it('has a committed manifest dedicated to this configuration', () => {
    expect(existsSync(MANIFEST), 'capture the P5b golden; do not rewrite another fixture').toBe(true);
  });

  const manifest = existsSync(MANIFEST) ? JSON.parse(readFileSync(MANIFEST, 'utf8')) : {};

  it('covers the whole seed family and reproduces every exact projection', () => {
    expect(Object.keys(manifest)).toEqual([...SEEDS]);
    const actual = Object.fromEntries(SEEDS.map((seed) => [seed, goldenRow(seed)]));
    expect(actual).toEqual(manifest);
  }, 60_000);

  it('is non-vacuous: demographic receipts and plan-driven satellite minting both fire', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      const row = manifest[seed];
      expect(row.evidence.receiptHistogram.demographic_step, `${seed}: demography never stepped`)
        .toBeGreaterThan(0);
      expect(row.evidence.firstPlanFoundingTick, `${seed}: no plan reached the satellite mint`)
        .not.toBeNull();
      expect(row.evidence.planIds.length, `${seed}: the founding carried no plan identity`)
        .toBeGreaterThan(0);
      expect(row.evidence.satelliteIds.length, `${seed}: the mint left no child behind`)
        .toBeGreaterThan(0);
    });
    expectNoSeedFailures(failures, 'every both-flags seed exercises demography and the plan-driven mint');
  });

  it('captures §11b\'s same-seed shift instead of mistaking it for corruption at soak time', () => {
    const shifted = SEEDS.filter((seed) => {
      const row = manifest[seed].evidence;
      return row.firstPlanFoundingTick !== row.lifecycleOnlyFirstFoundingTick;
    });
    expect(shifted, 'both flags never moved a founding tick against the lifecycle-only twin')
      .toEqual([...SEEDS]);
  });

  it('replays hash-for-hash on a second pass for every seed', () => {
    const failures = collectSeedFailures(SEEDS, (seed) => {
      expect(drive(seed, 'both').hash).toBe(drive(seed, 'both').hash);
    });
    expectNoSeedFailures(failures, 'every both-flags seed replays hash-for-hash');
  }, 60_000);
});
