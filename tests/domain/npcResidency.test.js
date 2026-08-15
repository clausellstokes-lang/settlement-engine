/**
 * npcResidency.test.js — W-H3 §6c: UNAFFILIATES, RESIDENCY, AND BOUNDED DRIFT.
 *
 * THE THREE CLAIMS:
 *   1. STAYS ARE BANDED AND STABLE. Weeks to years, seeded per lodging, so a reload
 *      cannot re-roll somebody's stay shorter.
 *   2. PREFERENCE IS WEIGHTED, NEVER BOUNDED. The worst-matched town in the realm keeps
 *      positive weight, so a wanderer can turn up anywhere; a hard filter would produce
 *      tidy dead demographics and is exactly what the design rules out.
 *   3. DRIFT IS BOUNDED WITHIN FACET BANDS AT CAPPED RATES. Every deposit is in the
 *      growth kernel's own closed vocabulary, every magnitude is under the residency
 *      loudness, every tick's total is under the tick cap, and a CENTURY of the harshest
 *      lodging cannot produce a candidate outside the four-word bank.
 *
 * THE LOCAL VIEW IS THE SAME PROJECTION, filtered. One truth, two views (design §6c), so
 * the unaffiliates section of a dossier is pinned as a scoped read of the world register
 * rather than as a second read model that could drift from it.
 */
import { describe, test, expect } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import {
  advanceResidency,
  pickLodging,
  residencyGrowthDeposits,
  residencyPreference01,
  stayDurationTicks,
} from '../../src/domain/worldPulse/npcResidency.js';
import {
  ACQUIRED_TRAIT_VOCAB,
  GROWTH_DEPOSIT_MAP,
  GROWTH_TUNING,
} from '../../src/domain/worldPulse/npcGrowthKernel.js';
import { graduateNpc, npcLedgerOf } from '../../src/domain/worldPulse/npcLedger.js';
import { projectNpcPool } from '../../src/domain/worldPulse/npcLedgerProjection.js';
import { NPC_CONSEQUENCES_TUNING } from '../../src/domain/worldPulse/npcConsequencesTuning.js';

const SEED = 'seed-aldermoor';
const ALL_SIGNALS = [...new Set(GROWTH_DEPOSIT_MAP.map((row) => row.signal))];

function roadDigest() {
  return {
    settlementIds: ['a', 'b', 'c', 'far'],
    gates: [
      { between: ['a', 'b'], cost: 100 },
      { between: ['b', 'c'], cost: 100 },
      { between: ['c', 'far'], cost: 2800 },
    ],
    distanceMatrix: {
      a: { b: 100, c: 200, far: 3000 },
      b: { a: 100, c: 100, far: 2900 },
      c: { a: 200, b: 100, far: 2800 },
      far: { a: 3000, b: 2900, c: 2800 },
    },
    tiers: {
      a: { b: 1, c: 2, far: 3 },
      b: { a: 1, c: 1, far: 3 },
      c: { a: 2, b: 1, far: 3 },
      far: { a: 3, b: 3, c: 3 },
    },
  };
}

const LIT = () => ({
  simulationRules: { npcConsequencesEnabled: true, infoMode: 'perfect_delayed' },
  spatialCanonVersion: 1,
  spatialDigest: roadDigest(),
});

const town = (id, extra = {}) => ({ settlementId: id, settlement: { name: id, tier: 'town', ...extra } });

/** One roamer whose world reads their intent as EVIL. */
function roamerWorld({ alignmentRead = 'evil', tick = 1 } = {}) {
  return graduateNpc({
    worldState: LIT(),
    settlementSeed: SEED,
    settlementId: 'a',
    rosterIdentity: { rosterId: 'npc_3', name: 'Mira Vane', role: 'Magistrate' },
    tick,
    verdictCause: 'banished',
    reputation: { notorietyBand: 'notorious', scandalClass: 'conspiracy', alignmentRead },
  });
}

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6c — stays are banded, seeded and stable', () => {
  test('every stay lands inside the declared band and re-reads identically', () => {
    const band = NPC_CONSEQUENCES_TUNING.RESIDENCY_STAY_TICKS;
    const cases = Array.from({ length: 300 }, (_, i) => i);
    const failures = collectSeedFailures(cases, (i) => {
      const args = { wnpcId: `wnpc_${i}`, settlementId: `s${i % 13}`, sinceTick: i };
      const stay = stayDurationTicks(args);
      expect(stay).toBeGreaterThanOrEqual(band.min);
      expect(stay).toBeLessThanOrEqual(band.max);
      expect(stay).toBe(stayDurationTicks(args));
    });
    expectNoSeedFailures(failures, 'every stay is inside its band and stable across reads');
    // Weeks to YEARS at one-week ticks: the band is not a token range.
    expect(band.max).toBeGreaterThanOrEqual(52);
  });

  test('the band is genuinely spread rather than collapsed on one value', () => {
    const seen = new Set(Array.from({ length: 300 }, (_, i) => stayDurationTicks({
      wnpcId: `wnpc_${i}`, settlementId: 's', sinceTick: 3,
    })));
    expect(seen.size).toBeGreaterThan(30);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6c — preference is WEIGHTED, never BOUNDED', () => {
  test('the worst-matched town keeps positive weight', () => {
    const graduated = roamerWorld();
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const matched = residencyPreference01({ alignment: 'lawful evil' }, roamer);
    const opposed = residencyPreference01({ alignment: 'neutral good' }, roamer);
    const indifferent = residencyPreference01({ alignment: 'true neutral' }, roamer);

    expect(matched).toBe(1);
    expect(opposed).toBe(NPC_CONSEQUENCES_TUNING.RESIDENCY_PREFERENCE_FLOOR);
    expect(opposed).toBeGreaterThan(0);
    expect(indifferent).toBeGreaterThan(opposed);
    expect(indifferent).toBeLessThan(matched);
  });

  test('a wanderer can still turn up in the town that suits them least', () => {
    const graduated = roamerWorld();
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const candidates = [town('good', { alignment: 'neutral good' }), town('evil', { alignment: 'lawful evil' })];
    const chosen = new Set(Array.from({ length: 300 }, (_, i) => pickLodging({
      wnpcId: `wnpc_${i}`, roamer, candidates, tick: 2,
    }).settlementId));
    // BOTH arms reachable: the lean is a weight, not a gate.
    expect([...chosen].sort()).toEqual(['evil', 'good']);
  });

  test('a person nobody has a read on is at home everywhere equally', () => {
    const graduated = roamerWorld({ alignmentRead: 'unknown' });
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const weights = ['neutral good', 'true neutral', 'lawful evil']
      .map((alignment) => residencyPreference01({ alignment }, roamer));
    expect(new Set(weights).size).toBe(1);
    expect(weights[0]).toBeGreaterThan(0);
  });

  test('the lodging choice is a function of the candidate SET, not its order', () => {
    const graduated = roamerWorld();
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const forward = pickLodging({ wnpcId: 'w', roamer, candidates: [town('a'), town('b'), town('c')], tick: 4 });
    const backward = pickLodging({ wnpcId: 'w', roamer, candidates: [town('c'), town('b'), town('a')], tick: 4 });
    expect(backward).toEqual(forward);
    expect(pickLodging({ wnpcId: 'w', roamer, candidates: [], tick: 4 })).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6c — drift is BOUNDED WITHIN FACET BANDS AT CAPPED RATES', () => {
  const resident = { id: 'npc_3', name: 'Mira Vane', personality: { dominant: 'shrewd', flaw: 'greedy' } };

  test('every deposit is in the growth kernel own vocabulary, and nothing new is minted', () => {
    const rows = residencyGrowthDeposits({
      signals: ALL_SIGNALS, npc: resident, stayTicks: NPC_CONSEQUENCES_TUNING.RESIDENCY_STAY_TICKS.max,
    });
    expect(rows.length).toBeGreaterThan(0);
    const outside = rows.map((row) => row.trait).filter((trait) => !ACQUIRED_TRAIT_VOCAB.includes(trait));
    expect(outside).toEqual([]);
    const unknownSignals = rows.map((row) => row.signal)
      .filter((signal) => !GROWTH_DEPOSIT_MAP.some((entry) => entry.signal === signal));
    expect(unknownSignals).toEqual([]);
  });

  test('the per-row loudness and the per-tick total are both capped', () => {
    const stays = [1, 13, 52, NPC_CONSEQUENCES_TUNING.RESIDENCY_STAY_TICKS.max, 10_000];
    const failures = collectSeedFailures(stays, (stayTicks) => {
      const rows = residencyGrowthDeposits({ signals: ALL_SIGNALS, npc: resident, stayTicks });
      for (const row of rows) {
        expect(row.mag).toBeGreaterThan(0);
        expect(row.mag).toBeLessThanOrEqual(NPC_CONSEQUENCES_TUNING.RESIDENCY_DRIFT_LOUD);
      }
      const total = rows.reduce((sum, row) => sum + row.mag, 0);
      expect(total).toBeLessThanOrEqual(NPC_CONSEQUENCES_TUNING.RESIDENCY_DRIFT_TICK_CAP + 1e-9);
    });
    expectNoSeedFailures(failures, 'residency drift respects both caps at every stay length');
    // Residency bends a person more slowly than office does: the loudness is well under
    // the growth kernel's own per-signal scale.
    expect(NPC_CONSEQUENCES_TUNING.RESIDENCY_DRIFT_LOUD).toBeLessThan(GROWTH_TUNING.DEPOSIT_SCALE);
  });

  test('the ramp is real: a week of lodging marks less than a decade of it', () => {
    const brief = residencyGrowthDeposits({ signals: ALL_SIGNALS, npc: resident, stayTicks: 1 });
    const long = residencyGrowthDeposits({
      signals: ALL_SIGNALS, npc: resident, stayTicks: NPC_CONSEQUENCES_TUNING.RESIDENCY_STAY_TICKS.max,
    });
    const sum = (rows) => rows.reduce((acc, row) => acc + row.mag, 0);
    expect(sum(brief)).toBeGreaterThan(0);
    expect(sum(long)).toBeGreaterThan(sum(brief));
  });

  test('the kernel own distance-from-core resistance is applied, not re-invented', () => {
    const ruthless = { personality: { dominant: 'ruthless', flaw: 'cruel' } };
    const gentle = { personality: { dominant: 'compassionate', flaw: 'trusting' } };
    const magFor = (npc) => residencyGrowthDeposits({ signals: ['betrayal'], npc, stayTicks: 52 })
      .find((row) => row.trait === 'cynical').mag;
    // A cynicism deposit lands harder on somebody already near it.
    expect(magFor(ruthless)).toBeGreaterThan(magFor(gentle));
  });

  test('a century of the harshest lodging stays inside the four-word bank', () => {
    /** @type {Map<string, number>} */
    const stock = new Map();
    const decay = Math.pow(0.5, 1 / GROWTH_TUNING.HALF_LIFE_TICKS);
    for (let tick = 0; tick < 5200; tick += 1) {
      const rows = residencyGrowthDeposits({ signals: ALL_SIGNALS, npc: resident, stayTicks: tick });
      const total = rows.reduce((sum, row) => sum + row.mag, 0);
      expect(total).toBeLessThanOrEqual(NPC_CONSEQUENCES_TUNING.RESIDENCY_DRIFT_TICK_CAP + 1e-9);
      for (const [trait, value] of stock) stock.set(trait, value * decay);
      for (const row of rows) {
        stock.set(row.trait, Math.min(GROWTH_TUNING.STOCK_MAX, (stock.get(row.trait) || 0) + row.mag));
      }
    }
    // A DECADE BENDS A PERSON: the candidates a century of hardship can raise are exactly
    // the closed bank, never a facet residency invented, and the growth kernel's own
    // STOCK_MAX holds every one of them.
    expect([...stock.keys()].sort()).toEqual([...ACQUIRED_TRAIT_VOCAB].sort());
    for (const value of stock.values()) expect(value).toBeLessThanOrEqual(GROWTH_TUNING.STOCK_MAX);
    // IT NEVER REPLACES THEM: the bank is smaller than the concurrent-trait cap plus one,
    // so no length of stay can bury an authored core under acquired words.
    expect(ACQUIRED_TRAIT_VOCAB.length).toBeGreaterThan(GROWTH_TUNING.MAX_ACQUIRED - 1);
  });

  test('a quiet town deposits nothing at all', () => {
    expect(residencyGrowthDeposits({ signals: [], npc: resident, stayTicks: 500 })).toEqual([]);
    expect(residencyGrowthDeposits({ signals: null, npc: resident, stayTicks: 500 })).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6c — transitions on any advance, and the local view', () => {
  test('a soul with no lodging takes one, and a lodged soul stays put until the stay is up', () => {
    const graduated = roamerWorld();
    const candidates = [town('b'), town('c')];
    const first = advanceResidency({
      worldState: graduated.worldState, wnpcId: graduated.wnpcId, tick: 5,
      digest: roadDigest(), candidates,
    });
    expect(first.state).toBe('settled');
    expect(['b', 'c']).toContain(first.atSettlementId);

    const record = npcLedgerOf(first.worldState).roamers[graduated.wnpcId];
    expect(record.residency.settlementId).toBe(first.atSettlementId);
    expect(record.residency.untilTick).toBeGreaterThan(5);

    const held = advanceResidency({
      worldState: first.worldState, wnpcId: graduated.wnpcId, tick: 6,
      digest: roadDigest(), candidates,
    });
    expect(held.state).toBe('settled');
    expect(held.changed).toBe(false);
    expect(held.worldState).toBe(first.worldState);
  });

  test('when the stay ends the roamer DEPARTS and is then mid-route', () => {
    const graduated = roamerWorld();
    const candidates = [town('b'), town('c')];
    const settled = advanceResidency({
      worldState: graduated.worldState, wnpcId: graduated.wnpcId, tick: 5,
      digest: roadDigest(), candidates,
    });
    const until = npcLedgerOf(settled.worldState).roamers[graduated.wnpcId].residency.untilTick;
    const departed = advanceResidency({
      worldState: settled.worldState, wnpcId: graduated.wnpcId, tick: until,
      digest: roadDigest(), candidates,
    });
    expect(departed.state).toBe('departed');
    expect(departed.atSettlementId).toBe('');
    const record = npcLedgerOf(departed.worldState).roamers[graduated.wnpcId];
    expect(record.residency).toBeUndefined();
    expect(record.transit.fromId).toBe(settled.atSettlementId);

    // THE ONE-HOP RULE, from the residency side: they are on the road for the whole leg
    // and land at its far end, never anywhere further. The leg is read off the record
    // rather than assumed, so this holds whether the next town is a week or a season away.
    const leg = record.transit;
    expect(leg.arrivalTick).toBeGreaterThan(leg.departTick);
    const travelling = advanceResidency({
      worldState: departed.worldState, wnpcId: graduated.wnpcId, tick: leg.arrivalTick - 1,
      digest: roadDigest(), candidates,
    });
    expect(travelling.state).toBe('travelling');
    expect(travelling.changed).toBe(false);
    const arrived = advanceResidency({
      worldState: departed.worldState, wnpcId: graduated.wnpcId, tick: leg.arrivalTick,
      digest: roadDigest(), candidates,
    });
    expect(arrived.state).toBe('settled');
    expect(arrived.atSettlementId).toBe(leg.toId);
  });

  test('a long haul really does leave the walker nowhere for many ticks', () => {
    const graduated = roamerWorld();
    // Lodge at c, then leave for far: a twenty-eight week road.
    const lodged = advanceResidency({
      worldState: graduated.worldState, wnpcId: graduated.wnpcId, tick: 5,
      digest: roadDigest(), candidates: [town('c')],
    });
    expect(lodged.atSettlementId).toBe('c');
    const until = npcLedgerOf(lodged.worldState).roamers[graduated.wnpcId].residency.untilTick;
    const departed = advanceResidency({
      worldState: lodged.worldState, wnpcId: graduated.wnpcId, tick: until,
      digest: roadDigest(), candidates: [town('far')],
    });
    const leg = npcLedgerOf(departed.worldState).roamers[graduated.wnpcId].transit;
    expect(leg).toEqual({ fromId: 'c', toId: 'far', departTick: until, arrivalTick: until + 28 });
    let midRoute = 0;
    for (let tick = until; tick < until + 28; tick += 1) {
      const step = advanceResidency({
        worldState: departed.worldState, wnpcId: graduated.wnpcId, tick,
        digest: roadDigest(), candidates: [town('far')],
      });
      if (step.state === 'travelling') midRoute += 1;
    }
    expect(midRoute).toBe(28);
  });

  test('the unaffiliates view is the SAME projection, scoped to where they are resting', () => {
    const graduated = roamerWorld();
    const settled = advanceResidency({
      worldState: graduated.worldState, wnpcId: graduated.wnpcId, tick: 5,
      digest: roadDigest(), candidates: [town('b')],
    });
    const here = projectNpcPool({ worldState: settled.worldState, tick: 6, settlementId: 'b' });
    const elsewhere = projectNpcPool({ worldState: settled.worldState, tick: 6, settlementId: 'c' });
    expect(here.roamers.map((row) => row.wnpcId)).toEqual([graduated.wnpcId]);
    expect(here.roamers[0].restingAt).toBe('b');
    expect(elsewhere.roamers).toEqual([]);
    // The origin no longer lists them: the local view follows the lodging, and the
    // ORIGIN listing before the move is the anchor that proves the fallback was live.
    const beforeMove = projectNpcPool({ worldState: graduated.worldState, tick: 2, settlementId: 'a' });
    const afterMove = projectNpcPool({ worldState: settled.worldState, tick: 6, settlementId: 'a' });
    expectPresentThenAbsent(
      beforeMove.roamers.map((row) => row.wnpcId),
      afterMove.roamers.map((row) => row.wnpcId),
      graduated.wnpcId,
    );
  });

  test('the whole lane survives the save/reload round trip', () => {
    const graduated = roamerWorld();
    const settled = advanceResidency({
      worldState: graduated.worldState, wnpcId: graduated.wnpcId, tick: 5,
      digest: roadDigest(), candidates: [town('b')],
    });
    const persisted = JSON.parse(JSON.stringify(settled.worldState));
    expect(npcLedgerOf(persisted)).toEqual(npcLedgerOf(settled.worldState));
    const next = advanceResidency({
      worldState: persisted, wnpcId: graduated.wnpcId, tick: 6,
      digest: roadDigest(), candidates: [town('b')],
    });
    expect(next.state).toBe('settled');
    expect(next.atSettlementId).toBe('b');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6c — DORMANCY (law 5)', () => {
  test('a dark world lodges nobody and writes nothing', () => {
    for (const rules of [{}, { npcConsequencesEnabled: 'true' }, { npcConsequencesEnabled: 1 }]) {
      const dark = { simulationRules: rules, spatialCanonVersion: 1, spatialDigest: roadDigest() };
      const before = JSON.stringify(dark);
      const step = advanceResidency({
        worldState: dark, wnpcId: 'wnpc_x', tick: 9, digest: roadDigest(), candidates: [town('b')],
      });
      expect(step.state).toBe('idle');
      expect(step.worldState).toBe(dark);
      expect(JSON.stringify(dark)).toBe(before);
    }
  });

  test('an unknown durable id is a no-op, not an invention', () => {
    const step = advanceResidency({
      worldState: LIT(), wnpcId: 'wnpc_deadbeef', tick: 9, digest: roadDigest(), candidates: [town('b')],
    });
    expect(step.state).toBe('idle');
    expect(npcLedgerOf(step.worldState).roamers).toEqual({});
  });
});
