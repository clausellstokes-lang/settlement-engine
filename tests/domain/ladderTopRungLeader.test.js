/**
 * ladderTopRungLeader.test.js — COHERENCE-POWERS item 4's guard, written first (the chair's ruling of 2026-11-12 on the
 * second seat's proposal): ONE PERSON, ONE FACE carried into the simulation. At first light the top rung of a power's
 * ladder is that power's rank-1 card (the town's leader, for the governing power), and a ladder already saved keeps
 * its rungs: the persisted order is reconciled, never re-derived, so no ruler is re-seated in a world someone holds.
 *
 * The readers that take the governing ladder's top rung as "the ruler" (gratitudeBonds.js :: rulingSeatNidOf and the war
 * seat books through it, warPeaceDecision.js, the ladder's own governing seat, powerStrata.js's seat line,
 * powerStateProse.js DS-POW-3) read the first-lit order through npcLadderState.js :: eligibleMembersOf.
 *
 * RED FIRST at ac03c0c8b: on every seed below the governing power's rank-1 card is not the first-lit top rung (the second
 * seat's probe docs/chair/2026-11-11/probes/COHERENCE-POWERS-2/ladder.mjs: 62 of 660 random births and 217 of 1,800
 * stress-forced births on six tiers). Births go through birthConfig with the browser's dials.
 */
import { beforeAll, describe, expect, it } from 'vitest';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { birthConfig, loadGenerationLawPayloads } from '../../src/domain/density/densityCreateBoundary.js';
import { governingFactionOf, nameOf } from '../../src/domain/rulingPower.js';
import { advanceNpcLadder } from '../../src/domain/worldPulse/npcLadderKernel.js';
import { eligibleMembersOf, ladderFactionKey } from '../../src/domain/worldPulse/npcLadderState.js';
import { npcId } from '../../src/domain/worldPulse/npcAgency.js';

const DIALS = Object.freeze({
  tradeRouteAccess: 'random_trade', culture: 'random_culture', monsterThreat: 'random_threat',
  nearbyResourcesRandom: true, selectedStressesRandom: true, _randomizePriorities: true,
  magicExists: true, contentProfile: 'grounded',
});

/** Seeds where the two disagreed at ac03c0c8b, two per tier on random dials and one per tier under a forced siege. */
const SEEDS = Object.freeze([
  'critique-hamlet-42', 'critique-hamlet-43', 'critique-village-4', 'critique-village-7', 'critique-town-10',
  'critique-town-48', 'critique-city-3', 'critique-city-4', 'critique-metropolis-1', 'critique-metropolis-7',
  'l2-under_siege-hamlet-14', 'l2-under_siege-village-1', 'l2-under_siege-town-0', 'l2-under_siege-city-3',
  'l2-under_siege-metropolis-0',
]);

/** @param {string} seed */
function configOf(seed) {
  const m = /^l2-(.+)-(thorp|hamlet|village|town|city|metropolis)-\d+$/.exec(seed);
  if (m) return { ...DIALS, settType: m[2], selectedStresses: [m[1]], selectedStressesRandom: false };
  return { ...DIALS, settType: seed.split('-')[1] };
}

/** @type {Map<string, any>} */
const births = new Map();
beforeAll(async () => {
  await loadGenerationLawPayloads();
  for (const seed of SEEDS) births.set(seed, generateSettlementPipeline(birthConfig(configOf(seed)), null, { seed, customContent: {} }));
}, 300_000);

/** One lit advance of the ladder over one town (the kernel's own harness shape, tests/domain/npcLadderKernel.test.js). */
function advance(settlement, { weeks = 260, priorLedger = null } = {}) {
  const worldState = {
    simulationRules: { npcLadderEnabled: true },
    calendar: { elapsedWeeks: weeks },
    ...(priorLedger ? { spatialLedgers: { npcLadder: priorLedger } } : {}),
  };
  const item = { id: 'a', name: settlement.name, settlement };
  const r = advanceNpcLadder({ snapshot: { settlements: [item] }, worldState, settlementUpdates: [{ saveId: 'a', settlement }], tick: weeks, now: null });
  return r.worldState?.spatialLedgers?.npcLadder?.a || null;
}

/** The power's rank-1 card's ladder id, or null. @param {any} s @param {string} power */
function firstNid(s, power) {
  const at = (s.npcs || []).findIndex((c) => (c.memberships || []).some((m) => m.power === power && m.rank === 1));
  return at < 0 ? null : npcId('a', s.npcs[at], at);
}

describe('COHERENCE-POWERS item 4 guard — the leader holds the top rung at first light', () => {
  it('the first-lit top rung of the governing ladder is the governing power\'s rank-1 card', () => {
    const misses = [];
    for (const seed of SEEDS) {
      const s = births.get(seed);
      const governing = governingFactionOf(s);
      const leader = firstNid(s, nameOf(governing));
      const rec = advance(s);
      const top = rec?.factions?.[ladderFactionKey(governing)]?.rungs?.[0] || null;
      if (top !== leader) misses.push(`${seed}: ${nameOf(governing)} top rung ${top}, leader ${leader}`);
    }
    expect(misses).toEqual([]);
  });

  it('every power\'s first-lit top rung is its own rank-1 card where it has one', () => {
    const misses = [];
    for (const seed of SEEDS) {
      const s = births.get(seed);
      for (const f of s.powerStructure.factions) {
        const first = firstNid(s, nameOf(f));
        if (!first) continue;
        const rungs = eligibleMembersOf('a', s, f, ladderFactionKey(f));
        if (rungs[0]?.npcId !== first) misses.push(`${seed}: ${nameOf(f)} top ${rungs[0]?.npcId}, first ${first}`);
      }
    }
    expect(misses).toEqual([]);
  });

  it('a ladder already saved keeps its rungs: stepping it reconciles, never re-seats', () => {
    const misses = [];
    for (const seed of SEEDS) {
      const s = births.get(seed);
      const governing = governingFactionOf(s);
      const fkey = ladderFactionKey(governing);
      // the saved world: its first-lit ladder, with the governing rungs in the order a world lit before this cure holds
      // (the leader not first: the rank-1 card moved to the floor, as the old order could leave it)
      const saved = JSON.parse(JSON.stringify(advance(s)));
      const rungs = saved.factions[fkey].rungs;
      const leader = firstNid(s, nameOf(governing));
      saved.factions[fkey].rungs = [...rungs.filter((n) => n !== leader), ...rungs.filter((n) => n === leader)];
      const stepped = advance(s, { weeks: 264, priorLedger: { a: saved } });
      const kept = stepped.factions[fkey].rungs;
      if (JSON.stringify(kept) !== JSON.stringify(saved.factions[fkey].rungs)) misses.push(`${seed}: ${JSON.stringify(saved.factions[fkey].rungs)} -> ${JSON.stringify(kept)}`);
    }
    expect(misses).toEqual([]);
  });
});
