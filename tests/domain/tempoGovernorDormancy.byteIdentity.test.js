/**
 * tempoGovernorDormancy.byteIdentity.test.js — E0 THE ONE ABSOLUTE CONSTRAINT.
 *
 * With the narrative-tempo governor ABSENT (no `narrativeTempo` axis on the rules),
 * every worldPulse projection is BYTE-IDENTICAL to pre-E0. This proves:
 *  - an absent axis materializes NO narrativeTempo ledger key,
 *  - the seam consumes NO rng and adds NO rollExplanation row (deferrals emit ONLY
 *    when the governor is active),
 *  - NO wizardNews `tempo_pressure` receipt appears,
 *  - a present-but-EMPTY narrativeTempo ledger self-strips (byte-neutral under the
 *    dormancy oracle),
 *  - a STRAY non-empty ledger left over from a previously-lit governor DRAINS to
 *    dormant once the axis is off,
 *  - the run is deterministic across two drives.
 *
 * Uses the load-bearing `normalizeForDormancy` oracle (absent === {} === []).
 */
import { describe, expect, test } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/index.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { normalizeForDormancy } from '../helpers/dormancyOracle.js';

// Structural scan: collect every object key appearing anywhere in a value tree
// (local twin of the religionDormancy helper, which is not exported).
function collectKeys(value, into = new Set()) {
  if (Array.isArray(value)) {
    for (const item of value) collectKeys(item, into);
  } else if (value && typeof value === 'object') {
    for (const key of Object.keys(value)) {
      into.add(key);
      collectKeys(value[key], into);
    }
  }
  return into;
}

const NOW = '2026-01-01T00:00:00.000Z';
const GRAIN = 'Bulk grain and foodstuffs';
const IDS = ['a', 'b', 'c', 'd'];

// A HOT multi-settlement grain network + famine at the supplier (mirrors the spatial
// golden fixture): the famine pressures propagate, so the pulse actually births + rolls.
function pulseSettlement(name, { exports = [], imports = [], patch = {} } = {}) {
  return {
    name, tier: 'town', population: 1700,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryExports: exports, primaryImports: imports },
    powerStructure: {
      publicLegitimacy: { score: 30, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 66 },
        { faction: 'Temple Wardens', category: 'religious', power: 52 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `reeve_${name}`, name: `Reeve ${name}`, importance: 'key' }],
    activeConditions: [],
    ...patch,
  };
}

const pulseSave = (id, name, opts) => ({
  id, name, phase: 'canon', settlement: pulseSettlement(name, opts),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

const grainChannel = (to) => ({
  id: `ch.a.${to}`, type: 'trade_dependency', from: 'a', to,
  goods: [{ id: 'grain', label: GRAIN }], strength: 0.7, status: 'confirmed',
});

function makeSaves() {
  return [
    pulseSave('a', 'Ashford', { exports: [GRAIN], patch: { activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.7 }] } }),
    pulseSave('b', 'Briarwatch', { imports: [GRAIN] }),
    pulseSave('c', 'Crownhold', { imports: [GRAIN] }),
    pulseSave('d', 'Deepmoor', { imports: [GRAIN] }),
  ];
}

function makeCampaign(worldStatePatch = {}) {
  return {
    id: 'tempo-dormancy', name: 'Tempo Dormancy Pin', settlementIds: [...IDS],
    worldState: {
      rngSeed: 'tempo-dormancy-seed',
      tick: 1,
      calendar: { elapsedWeeks: 4 },
      stressors: [
        { id: 'world_stressor.famine.a', type: 'famine', severity: 0.9, affectedSettlementIds: ['a'], age: 3 },
        { id: 'world_stressor.market_shock.b', type: 'market_shock', severity: 0.55, affectedSettlementIds: ['b'], age: 1 },
      ],
      ...worldStatePatch,
    },
    regionalGraph: ensureRegionalGraph({
      edges: [
        { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'trade_partner' },
        { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'trade_partner' },
        { id: 'edge.c.d', from: 'c', to: 'd', relationshipType: 'rival' },
        { id: 'edge.a.d', from: 'a', to: 'd', relationshipType: 'trade_partner' },
      ],
      channels: [grainChannel('b'), grainChannel('c'), grainChannel('d')],
    }),
    wizardNews: { currentTick: 1, entries: [] },
  };
}

/** Drive N ticks, threading worldState + settlementUpdates + evolved graph. */
function driveTicks(worldStatePatch, ticks) {
  let campaign = makeCampaign(worldStatePatch);
  let saves = makeSaves();
  const results = [];
  for (let t = 0; t < ticks; t++) {
    const r = simulateCampaignWorldPulse({ campaign, saves, interval: 'one_month', now: NOW });
    results.push(r);
    const updates = new Map((r.settlementUpdates || []).map((u) => [String(u.saveId), u.settlement]));
    saves = saves.map((s) => (updates.has(s.id) ? { ...s, settlement: updates.get(s.id) } : s));
    campaign = { ...campaign, worldState: r.worldState, regionalGraph: r.regionalGraph || campaign.regionalGraph };
  }
  return results;
}

describe('tempo governor — dormancy byte-identity (THE ONE ABSOLUTE CONSTRAINT)', () => {
  test('the fixture is HOT (anti-vacuity) — the dormant pulse does real work', () => {
    const [r] = driveTicks({}, 1);
    expect(r.selected.length).toBeGreaterThan(0);
    expect(r.rollExplanations.length).toBeGreaterThan(3);
  });

  test('a present-but-EMPTY narrativeTempo ledger is byte-neutral under the oracle', () => {
    const [absent] = driveTicks({}, 1);
    const [emptyLedger] = driveTicks({ narrativeTempo: {} }, 1);

    // worldState byte-identical.
    expect(normalizeForDormancy(absent.worldState)).toEqual(normalizeForDormancy(emptyLedger.worldState));
    // The full projection envelope byte-identical too.
    const envelope = (r) => ({
      selected: r.selected,
      settlementUpdates: r.settlementUpdates,
      rollExplanations: r.rollExplanations,
      wizardNews: r.wizardNews,
    });
    expect(normalizeForDormancy(envelope(absent))).toEqual(normalizeForDormancy(envelope(emptyLedger)));
  });

  test('the dormant run carries NO governor keys anywhere in the envelope', () => {
    const [r] = driveTicks({}, 1);
    const allKeys = collectKeys({
      worldState: r.worldState,
      selected: r.selected,
      settlementUpdates: r.settlementUpdates,
      rollExplanations: r.rollExplanations,
      wizardNews: r.wizardNews,
      candidates: r.candidates,
    });
    for (const forbidden of ['narrativeTempo', 'deferred', 'tempo_pressure', 'tempoDeferred']) {
      expect(allKeys.has(forbidden), `dormant run must not carry key '${forbidden}'`).toBe(false);
    }
  });

  test('NO wizardNews tempo_pressure receipt fires on the dormant run', () => {
    const results = driveTicks({}, 4);
    for (const r of results) {
      const entries = r.wizardNews?.entries || [];
      expect(entries.some((e) => e.kind === 'tempo_pressure' || e.id?.startsWith?.('tempo_pressure'))).toBe(false);
    }
  });

  test('a STRAY non-empty ledger (previously-lit governor, axis now off) DRAINS to dormant', () => {
    // The governor was lit; the axis is now absent. The write fold must drop the key.
    const stray = {
      narrativeTempo: {
        realm: { war: [1, 2], economic_shock: [3] },
        settlement: { a: { lastMajorWeek: 2 } },
        deferred: { plague: [{ week: 1, settlementId: 'b' }] },
      },
    };
    const [r] = driveTicks(stray, 1);
    expect(collectKeys({ worldState: r.worldState }).has('narrativeTempo')).toBe(false);
    // ...and it is byte-identical to the never-lit dormant run.
    const [absent] = driveTicks({}, 1);
    expect(normalizeForDormancy(r.worldState)).toEqual(normalizeForDormancy(absent.worldState));
  });

  test('the dormant multi-tick drive is deterministic across two runs (byte-identical)', () => {
    const one = driveTicks({}, 6).map((r) => normalizeForDormancy({ worldState: r.worldState, selected: r.selected, wizardNews: r.wizardNews }));
    const two = driveTicks({}, 6).map((r) => normalizeForDormancy({ worldState: r.worldState, selected: r.selected, wizardNews: r.wizardNews }));
    expect(JSON.stringify(one)).toBe(JSON.stringify(two));
  });
});
