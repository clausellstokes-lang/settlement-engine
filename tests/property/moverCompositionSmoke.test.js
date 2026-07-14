/**
 * moverCompositionSmoke.test.js — the EVERYTHING-ON composition smoke (test-quality-6).
 *
 * Every mover is soaked SOLO elsewhere (seasons mini-soak, commodity flow, ally
 * intel, the war stack, the spatial goldens). Nothing drives them TOGETHER — the
 * product's moat is mover COMPOSITION (winter slows caravans → stockpiles drain →
 * EV refuses → smugglers run), and the full mover-interaction matrix is deferred to
 * the Living-Realm checkpoint soak. But M10b made `full_simulation` AUTONOMOUS
 * (auto-advances on open), so real users now run the never-executed everything-on
 * path automatically, before that checkpoint exists.
 *
 * This is the cheap INTERIM guard the checkpoint deferral left open: ONE spatial
 * fixture under the LITERAL SIMULATION_RULE_PRESETS.full_simulation.rules —
 * commodityFlow + allyIntelSharing + seasons + the whole war stack + faith, spatial
 * modulation ON — driven 24 real pulse ticks. It is ENVELOPE-style, NOT a golden:
 * it asserts the everything-on path stays ALIVE (no throw), BOUNDED (finite values,
 * ledgers don't explode), and DETERMINISTIC (two runs byte-identical) — leaving the
 * calibrated validation to the checkpoint while closing the "most feature-dense
 * shipped preset has ZERO executed ticks" hole.
 */
import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { buildSpatialDigest } from '../../src/domain/spatial/index.js';
import { SIMULATION_RULE_PRESETS } from '../../src/domain/worldPulse/simulationRules.js';
import { makeGridPack, placeSettlements } from '../fixtures/spatialPackFixtures.js';
import { normalizeForDormancy } from '../domain/religionDormancy.byteIdentity.test.js';

const NOW = '2026-01-01T00:00:00.000Z';
const TICKS = 24;
// The everything-on ceiling, verbatim (commodityFlow + allyIntelSharing + seasons +
// the eight war sub-flags + faith + autonomous progression + infoMode 'full').
const FULL_SIM_RULES = SIMULATION_RULE_PRESETS.full_simulation.rules;

const IDS = ['a', 'b', 'c', 'd'];
const deity = (ref, name, align, law, rank) => ({ _deityRef: ref, name, alignmentAxis: align, lawAxis: law, rankAxis: rank });
const D = {
  lg: deity('custom:fs_dawn', 'Dawnfather', 'good', 'lawful', 'major'),
  ce: deity('custom:fs_maw', 'The Maw', 'evil', 'chaotic', 'major'),
  le: deity('custom:fs_ledger', 'The Ledger', 'evil', 'lawful', 'minor'),
};
const GRAIN = 'Bulk grain and foodstuffs';

function spatialDigest() {
  const pack = makeGridPack({ cols: 24, rows: 18 });
  const placed = placeSettlements(pack, IDS.length);
  const placements = placed.map((p, i) => ({ id: IDS[i], cellId: p.cellId }));
  return buildSpatialDigest({ pack, placements });
}

function settlementFor(name, patron, cults, { exports = [], imports = [] } = {}) {
  return {
    name, tier: 'town', population: 1600,
    config: {
      tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30,
      primaryDeityRef: patron._deityRef, primaryDeitySnapshot: patron,
      ...(cults && cults.length ? { cultDeitySnapshots: cults } : {}),
    },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 38, label: 'Contested' },
      factions: [
        { faction: 'Temple Wardens', category: 'religious', power: 58 },
        { faction: 'Merchant League', category: 'economy', power: 55 },
        { faction: 'City Watch', category: 'military', power: 44 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
  };
}
const saveFor = (id, name, patron, cults, opts) => ({
  id, name, phase: 'canon', settlement: settlementFor(name, patron, cults, opts),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});
const grainChannel = (to) => ({
  id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});

// A rich fixture that actually EXERCISES every family: a grain supplier + a famine
// shock (commodity flow + propagation), rival/hostile edges (war), an ally edge
// (ally intel), deities across the plane (faith), 24 weeks (crosses seasons), spatial
// digest + marker (spatial modulation).
function makeCampaignAndSaves(seed) {
  const saves = [
    saveFor('a', 'Ashford', D.lg, [], { exports: [GRAIN], imports: [] }),
    saveFor('b', 'Briarwatch', D.ce, [D.le], { imports: [GRAIN] }),
    saveFor('c', 'Crownhold', D.lg, [], { imports: [GRAIN] }),
    saveFor('d', 'Deepmoor', D.ce, [], { imports: [GRAIN] }),
  ];
  const campaign = {
    id: 'full-sim-smoke', name: 'Full Sim Smoke', settlementIds: [...IDS],
    worldState: {
      rngSeed: seed, tick: 1,
      simulationRules: { ...FULL_SIM_RULES },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 },
      ],
      spatialCanonVersion: 1,
      spatialDigest: spatialDigest(),
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'rival' },
        { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'hostile' },
        { id: 'edge.a.d', from: 'a', to: 'd', relationshipType: 'ally' },
      ],
      channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
  return { campaign, saves };
}

/** Drive TICKS pulses. Returns the tick-by-tick trace + the final threaded state. */
function drive(seed) {
  let { campaign, saves } = makeCampaignAndSaves(seed);
  const trace = [];
  for (let t = 0; t < TICKS; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_week', now: NOW });
    trace.push({
      tick: r.worldState?.tick,
      stressors: (r.worldState?.stressors || []).length,
      selected: (r.selected || []).length,
      autoApplied: (r.autoApplied || []).length,
      rolls: (r.rollExplanations || []).length,
      arrivals: Object.keys(r.worldState?.spatialLedgers?.spatialArrivals || {}).length,
      rumors: Object.keys(r.worldState?.spatialLedgers?.rumorLedgers || {}).length,
      queuedImpacts: (r.regionalGraph?.queuedImpacts || []).length,
      pantheon: Object.keys(r.worldState?.pantheon || {}).length,
    });
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph, wizardNews: r.wizardNews };
  }
  return { campaign, saves, trace };
}

/** Deep-walk for any non-finite number — JSON.stringify silently coerces NaN/±Inf to
 *  null, so a hash alone would miss a numeric leak. */
function firstNonFinite(value, path = '$') {
  if (typeof value === 'number') return Number.isFinite(value) ? null : `${path}=${value}`;
  if (Array.isArray(value)) {
    for (let i = 0; i < value.length; i++) { const hit = firstNonFinite(value[i], `${path}[${i}]`); if (hit) return hit; }
    return null;
  }
  if (value && typeof value === 'object') {
    for (const k of Object.keys(value)) { const hit = firstNonFinite(value[k], `${path}.${k}`); if (hit) return hit; }
    return null;
  }
  return null;
}

const projectionHash = ({ campaign, saves }) => {
  const patrons = {};
  for (const s of saves) patrons[s.id] = s.settlement?.config?.primaryDeityRef || null;
  const projection = normalizeForDormancy({
    tick: campaign.worldState?.tick ?? null,
    stressors: (campaign.worldState?.stressors || []).map(x => x.id).sort(),
    pantheon: campaign.worldState?.pantheon || {},
    patrons,
    arrivalKeys: Object.keys(campaign.worldState?.spatialLedgers?.spatialArrivals || {}).sort(),
    queuedImpacts: (campaign.regionalGraph?.queuedImpacts || []).length,
    populations: Object.fromEntries(saves.map(s => [s.id, s.settlement?.population ?? null])),
  });
  return createHash('sha256').update(JSON.stringify(projection)).digest('hex');
};

describe('mover-composition smoke — the everything-on path stays alive, bounded, deterministic', () => {
  it(`survives ${TICKS} full_simulation ticks without throwing, and stays BOUNDED`, () => {
    const run = drive('fs-smoke-a'); // a throw in drive() fails the test (ALIVE)

    // ALIVE: the clock advanced one tick per pulse, monotonically, to TICKS+1
    // (the fixture starts at tick 1).
    for (let i = 0; i < run.trace.length; i++) {
      expect(run.trace[i].tick, `tick at pulse ${i}`).toBe(i + 2);
    }

    // BOUNDED: no ledger runs away over the window (envelope caps — generous, they
    // exist to catch an unbounded-growth regression, not to pin exact counts).
    for (const row of run.trace) {
      expect(row.stressors).toBeLessThan(300);
      expect(row.rolls).toBeLessThan(2000);
      expect(row.selected + row.autoApplied).toBeLessThan(500);
      expect(row.arrivals).toBeLessThan(200);
      expect(row.rumors).toBeLessThan(200);
      expect(row.queuedImpacts).toBeLessThan(500);
      expect(row.pantheon).toBeLessThan(100);
    }

    // BOUNDED: populations stay finite and physically plausible — no collapse to ≤0,
    // no runaway past a sane multiple of the starting size.
    for (const s of run.saves) {
      const pop = s.settlement?.population;
      expect(Number.isFinite(pop), `population of ${s.id} is finite`).toBe(true);
      expect(pop).toBeGreaterThan(0);
      expect(pop).toBeLessThan(1_600 * 20);
    }

    // BOUNDED: NOT ONE non-finite number anywhere in the final world/saves (JSON hash
    // alone would launder a NaN into null — this deep-walk catches it).
    expect(firstNonFinite({ worldState: run.campaign.worldState, regionalGraph: run.campaign.regionalGraph, saves: run.saves })).toBeNull();
  });

  it('is DETERMINISTIC: two identical everything-on runs hash the same final projection', () => {
    expect(projectionHash(drive('fs-smoke-a'))).toBe(projectionHash(drive('fs-smoke-a')));
    // And a DIFFERENT seed measurably changes the run (the seed is not inert — the
    // smoke would be worthless if every seed produced the same world).
    expect(projectionHash(drive('fs-smoke-a'))).not.toBe(projectionHash(drive('fs-smoke-z')));
  });
});
