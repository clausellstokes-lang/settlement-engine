/**
 * npcCirculation.test.js — W-H3 §6 / §6d / §9: REHOSTING, REJECTION, EQUILIBRIUM,
 * THE TURNCOAT FLOW, AND THE DESTRUCTION DISPERSAL.
 *
 * THE FOUR CLAIMS THIS FILE CARRIES, each with an executed anchor:
 *   1. EXCLUSION IS FILTERED FIRST. A banished roamer never rehosts home inside the
 *      window, and the SAME roamer at the SAME tick is admitted somewhere else, which is
 *      what proves the filter is reading the edge rather than refusing everybody.
 *   2. ADMISSION RUNS ON LOCAL BELIEF, NOT GLOBAL TRUTH. One roamer, one truth, two
 *      towns: refused where the story arrived, admitted where it did not.
 *   3. A REJECTION REFERENCES THE ORIGINAL SCANDAL. Asserted on the item's TYPED fields,
 *      so a reworded headline cannot silently drop the reference.
 *   4. THE POOL IS BOUNDED, WITH A FLOOR. Pressure is exactly zero while the floor holds
 *      and rises afterwards, so roaming is neither eternal nor trivially brief.
 *
 * FIXTURES ARE JSON-ROUND-TRIPPED where persistence is the property under test. The
 * ledger is worldState, and worldState is saved; an in-memory-only assertion about a
 * conditional key proves nothing about the bytes a reload produces.
 */
import { describe, test, expect } from 'vitest';
import { collectSeedFailures, expectNoSeedFailures } from '../helpers/seedFailures.js';
import { expectPresentThenAbsent } from '../helpers/anchoredNegatives.js';
import {
  arrivalNewsItem,
  attemptRehost,
  attemptsRehost,
  admissionFor,
  believedNotorietyRank,
  disperseCastToPool,
  poolCeilingFor,
  poolCensus,
  reachableTargets,
  rehostPressure01,
  rejectionNewsItem,
  siblingFactionFor,
  turncoatDestination,
  REJECTION_NEWS_TYPE,
  ARRIVAL_NEWS_TYPE,
  DISPERSAL_NEWS_TYPE,
  SIBLING_BRANCH_WORDS,
} from '../../src/domain/worldPulse/npcCirculation.js';
import {
  ADMISSION_OUTCOMES,
  ARCHETYPE_SCANDAL_AVERSIONS,
  REJECTION_REASONS,
  TURNCOAT_CAPACITIES,
  factionSeatsFor,
  rejectionFor,
  turncoatCapacityFor,
} from '../../src/domain/worldPulse/npcCirculationTable.js';
import { FACTION_ARCHETYPES, supportedFactionArchetypes } from '../../src/domain/factionArchetypes.js';
import { NPC_ROLE_ARCHETYPES } from '../../src/domain/npc/npcFacetContract.js';
import {
  addExclusionEdge,
  exclusionsOf,
  graduateNpc,
  hasNpcLedger,
  npcLedgerOf,
} from '../../src/domain/worldPulse/npcLedger.js';
import { SCANDAL_CLASSES } from '../../src/domain/worldPulse/npcLedgerFacets.js';
import { projectNpcPool, findDmTruthPaths } from '../../src/domain/worldPulse/npcLedgerProjection.js';
import { NPC_CONSEQUENCES_TUNING } from '../../src/domain/worldPulse/npcConsequencesTuning.js';

const SEED = 'seed-aldermoor';

/** A four-town road; `far` is thirty weeks past the scandal. */
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

const LIT = (extra = {}) => ({
  simulationRules: { npcConsequencesEnabled: true, infoMode: 'perfect_delayed' },
  spatialCanonVersion: 1,
  spatialDigest: roadDigest(),
  ...extra,
});

/** A town whose council is a GOVERNMENT faction, which the authored table makes averse
 *  to conspiracy. `seats` controls whether the council is full. */
function councilTown({ seats = 1, tier = 'town' } = {}) {
  return {
    name: 'Councilford',
    tier,
    factions: [{
      name: 'Town Council',
      category: 'government',
      members: Array.from({ length: seats }, (_, i) => ({ id: `m_${i}`, name: `Member ${i}` })),
    }],
  };
}

/** Graduate one disgraced conspirator out of settlement `a`. */
function conspirator(worldState, { tick = 1 } = {}) {
  return graduateNpc({
    worldState,
    settlementSeed: SEED,
    settlementId: 'a',
    rosterIdentity: { rosterId: 'npc_3', name: 'Mira Vane', role: 'Magistrate' },
    tick,
    verdictCause: 'banished',
    reputation: {
      notorietyBand: 'notorious',
      edictMark: 'banishment_edict',
      scandalClass: 'conspiracy',
      alignmentRead: 'evil',
      competenceRead: 'capable',
    },
    dmTruth: { compromiseSource: 'rival_power' },
  });
}

const reloaded = (value) => JSON.parse(JSON.stringify(value));

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — EXCLUSION EDGES ARE FILTERED FIRST', () => {
  test('a banished roamer never rehosts home inside the window, and does elsewhere', () => {
    const graduated = conspirator(LIT());
    const banished = addExclusionEdge(graduated.worldState, graduated.wnpcId, {
      settlementId: 'a', kind: 'banishment_edict', indefinite: true,
    }).worldState;

    const home = attemptRehost({
      worldState: banished, settlement: councilTown(), settlementId: 'a',
      wnpcId: graduated.wnpcId, tick: 20, force: true,
    });
    expect(home.admission).toBeNull();
    expect(home.attempted).toBe(true);
    expect(home.worldState).toBe(banished);

    // THE ANCHOR: the SAME person, the SAME tick, a town with no edge against them.
    const away = attemptRehost({
      worldState: banished, settlement: councilTown(), settlementId: 'far',
      settlementName: 'Farholt', wnpcId: graduated.wnpcId, tick: 20, force: true,
    });
    expect(away.admission).not.toBeNull();
    expect(away.admission.outcome).toBe('admitted_lowest');
  });

  test('the candidate flow reports what the filter removed, and why', () => {
    const graduated = conspirator(LIT());
    const world = addExclusionEdge(graduated.worldState, graduated.wnpcId, {
      settlementId: 'a', kind: 'banishment_edict', indefinite: true,
    }).worldState;
    const flow = reachableTargets({
      worldState: world, wnpcId: graduated.wnpcId, settlementIds: ['a', 'b', 'c', 'far'], tick: 30,
    });
    expect(flow.targets).toEqual(['b', 'c', 'far']);
    expect(flow.filteredOut).toEqual([{ settlementId: 'a', kind: 'banishment_edict' }]);
  });

  test('a windowed cooldown shuts the door and then reopens it', () => {
    const graduated = conspirator(LIT());
    const cooled = addExclusionEdge(graduated.worldState, graduated.wnpcId, {
      settlementId: 'far', kind: 'rehost_cooldown', untilTick: 40,
    }).worldState;
    const inside = reachableTargets({
      worldState: cooled, wnpcId: graduated.wnpcId, settlementIds: ['b', 'far'], tick: 39,
    });
    const outside = reachableTargets({
      worldState: cooled, wnpcId: graduated.wnpcId, settlementIds: ['b', 'far'], tick: 40,
    });
    expectPresentThenAbsent(outside.targets, inside.targets, 'far');
  });

  test('a cooldown is NOT a shut door in the register, but a banishment is', () => {
    const graduated = conspirator(LIT());
    let world = addExclusionEdge(graduated.worldState, graduated.wnpcId, {
      settlementId: 'far', kind: 'rehost_cooldown', untilTick: 999,
    }).worldState;
    world = addExclusionEdge(world, graduated.wnpcId, {
      settlementId: 'a', kind: 'banishment_edict', indefinite: true,
    }).worldState;
    const pool = projectNpcPool({ worldState: world, tick: 5, includeCovert: false });
    expect(pool.roamers).toHaveLength(1);
    // The edict is a public legal fact; the cooldown is private bookkeeping.
    expect(pool.roamers[0].shutDoors).toEqual(['a']);
    // Both edges are nonetheless persisted, so the filter still sees the cooldown.
    expect(exclusionsOf(world, graduated.wnpcId).map((e) => e.kind).sort())
      .toEqual(['banishment_edict', 'rehost_cooldown']);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6b — admission runs against LOCAL BELIEF, never global truth', () => {
  test('refused where the story arrived, admitted where it did not', () => {
    const graduated = conspirator(LIT());
    const world = graduated.worldState;
    const roamer = npcLedgerOf(world).roamers[graduated.wnpcId];

    const near = admissionFor({
      worldState: world, settlement: councilTown(), settlementId: 'b',
      wnpcId: graduated.wnpcId, roamer, tick: 2,
    });
    const distant = admissionFor({
      worldState: world, settlement: councilTown(), settlementId: 'far',
      wnpcId: graduated.wnpcId, roamer, tick: 2,
    });

    expect(near.outcome).toBe('rejected');
    expect(near.reason).toBe('scandal_class_unacceptable');
    expect(distant.outcome).toBe('admitted_lowest');

    // THE ANCHOR, from the SAME derivation: the near town's belief is genuinely loud and
    // the far town's is genuinely silent, so the split above measures belief rather than
    // two arbitrary answers.
    expect(believedNotorietyRank({ worldState: world, observerId: 'b', wnpcId: graduated.wnpcId, roamer, tick: 2 }))
      .toBeGreaterThan(0);
    expect(believedNotorietyRank({ worldState: world, observerId: 'far', wnpcId: graduated.wnpcId, roamer, tick: 2 }))
      .toBe(0);
  });

  test('under omniscient information the truth reaches every gate', () => {
    const world = { ...LIT(), simulationRules: { npcConsequencesEnabled: true, infoMode: 'omniscient' } };
    const graduated = conspirator(world);
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const distant = admissionFor({
      worldState: graduated.worldState, settlement: councilTown(), settlementId: 'far',
      wnpcId: graduated.wnpcId, roamer, tick: 2,
    });
    expect(distant.outcome).toBe('rejected');
    expect(distant.reason).toBe('scandal_class_unacceptable');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — the admission rule, and the authored table behind it', () => {
  test('an open seat admits at the LOWEST position; a full house founds a sibling', () => {
    const graduated = conspirator(LIT());
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const open = admissionFor({
      worldState: graduated.worldState, settlement: councilTown({ seats: 1 }),
      settlementId: 'far', wnpcId: graduated.wnpcId, roamer, tick: 2,
    });
    expect(open.outcome).toBe('admitted_lowest');

    const full = admissionFor({
      worldState: graduated.worldState,
      settlement: councilTown({ seats: factionSeatsFor(councilTown()) }),
      settlementId: 'far', wnpcId: graduated.wnpcId, roamer, tick: 2,
    });
    expect(full.outcome).toBe('founded_sibling');
    expect(full.factionName).toBe('Town Council');
    expect(SIBLING_BRANCH_WORDS.some((word) => full.siblingName === `${word} Town Council`)).toBe(true);
    expect(full.siblingId).toMatch(/^fac\.sibling\.[0-9a-f]{8}$/);
  });

  test('no faction to ask means REMAINED ROAMING, which is an outcome not a failure', () => {
    const graduated = conspirator(LIT());
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const nowhere = admissionFor({
      worldState: graduated.worldState, settlement: { name: 'Empty', tier: 'thorp' },
      settlementId: 'far', wnpcId: graduated.wnpcId, roamer, tick: 2,
    });
    expect(nowhere.outcome).toBe('remained_roaming');
    expect(nowhere.reason).toBeNull();
    expect(ADMISSION_OUTCOMES).toContain(nowhere.outcome);
  });

  test('a founded sibling name is never one already in the settlement', () => {
    const taken = SIBLING_BRANCH_WORDS.map((word) => ({ name: `${word} Town Council` }));
    const settlement = { tier: 'town', factions: [{ name: 'Town Council' }, ...taken] };
    const sibling = siblingFactionFor({
      settlement, settlementId: 'far', parentName: 'Town Council', wnpcId: 'w', tick: 3,
    });
    const names = new Set([...taken.map((f) => f.name), 'Town Council']);
    expect(names.has(sibling.name)).toBe(false);
    expect(sibling.name.startsWith('Town Council') || sibling.name.includes('Town Council')).toBe(true);
  });

  test('the aversion table is TOTAL over the faction archetype vocabulary', () => {
    const missing = supportedFactionArchetypes()
      .filter((archetype) => !Object.prototype.hasOwnProperty.call(ARCHETYPE_SCANDAL_AVERSIONS, archetype));
    expect(missing).toEqual([]);
    // And every listed aversion is a real scandal class, so no cell can be dead.
    const unknown = Object.values(ARCHETYPE_SCANDAL_AVERSIONS)
      .flat()
      .filter((scandal) => !SCANDAL_CLASSES.includes(scandal));
    expect(unknown).toEqual([]);
  });

  test('the underworld refuses nobody (design §6d), and a government refuses a traitor', () => {
    expect(ARCHETYPE_SCANDAL_AVERSIONS[FACTION_ARCHETYPES.CRIMINAL]).toEqual([]);
    const loud = { notorietyBand: 'infamous', scandalClass: 'betrayal', alignmentRead: 'evil' };
    const underworld = rejectionFor({ faction: { name: 'Smugglers ring', category: 'criminal' }, believed: loud });
    const state = rejectionFor({ faction: { name: 'Town Council', category: 'government' }, believed: loud });
    expect(underworld.rejected).toBe(false);
    expect(state.rejected).toBe(true);
    expect(REJECTION_REASONS).toContain(state.reason);
  });

  test('a quiet story does not bite: strictness is a band, not a boolean', () => {
    const whisper = { notorietyBand: 'whispered', scandalClass: 'betrayal', alignmentRead: 'neutral' };
    const known = { notorietyBand: 'known', scandalClass: 'betrayal', alignmentRead: 'neutral' };
    const faction = { name: 'Town Council', category: 'government' };
    expect(rejectionFor({ faction, believed: whisper }).rejected).toBe(false);
    expect(rejectionFor({ faction, believed: known }).rejected).toBe(true);
    expect(NPC_CONSEQUENCES_TUNING.REJECTION_NOTORIETY_RANK).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — a rejection REFERENCES THE ORIGINAL SCANDAL', () => {
  test('the item carries the origin, the verdict cause and the believed scandal as fields', () => {
    const graduated = conspirator(LIT());
    const world = graduated.worldState;
    const attempt = attemptRehost({
      worldState: world, settlement: councilTown(), settlementId: 'b',
      settlementName: 'Bramwell', wnpcId: graduated.wnpcId, tick: 2, force: true,
    });
    expect(attempt.admission.outcome).toBe('rejected');
    const item = attempt.news;
    expect(item.candidateType).toBe(REJECTION_NEWS_TYPE);
    // THE TYPED REFERENCE. Read as fields, so rewording the prose cannot drop it.
    expect(item.originSettlementId).toBe('a');
    expect(item.verdictCause).toBe('banished');
    expect(item.scandalClass).toBe('conspiracy');
    expect(item.rejectionReason).toBe('scandal_class_unacceptable');
    // The address chain names BOTH ends: the gate that shut and the town it happened in.
    expect(item.settlementIds).toEqual(['b', 'a']);
    expect(item.reasons[0]).toContain('a');
    expect(item.reasons.join(' ')).toContain('conspiracy');
  });

  test('a rejection records a cooldown edge, and the roamer stays in the pool', () => {
    const graduated = conspirator(LIT());
    const attempt = attemptRehost({
      worldState: graduated.worldState, settlement: councilTown(), settlementId: 'b',
      wnpcId: graduated.wnpcId, tick: 2, force: true,
    });
    expect(attempt.cooldown).toEqual({
      settlementId: 'b',
      kind: 'rehost_cooldown',
      untilTick: 2 + NPC_CONSEQUENCES_TUNING.REJECTION_COOLDOWN_TICKS,
    });
    const ledger = npcLedgerOf(attempt.worldState);
    expect(Object.keys(ledger.roamers)).toEqual([graduated.wnpcId]);
    expect(Object.keys(ledger.placed)).toEqual([]);
  });

  test('an arrival item names the house that took them', () => {
    const graduated = conspirator(LIT());
    const attempt = attemptRehost({
      worldState: graduated.worldState, settlement: councilTown(), settlementId: 'far',
      settlementName: 'Farholt', wnpcId: graduated.wnpcId, tick: 2, force: true,
    });
    expect(attempt.news.candidateType).toBe(ARRIVAL_NEWS_TYPE);
    expect(attempt.news.factionName).toBe('Town Council');
    expect(attempt.news.admissionOutcome).toBe('admitted_lowest');
    // CONSERVATION: the soul MOVED between the two maps and is in exactly one of them.
    const ledger = npcLedgerOf(attempt.worldState);
    expect(Object.keys(ledger.roamers)).toEqual([]);
    expect(ledger.placed[graduated.wnpcId].hostSettlementId).toBe('far');
  });

  test('a rejection item is safe to hand a reader: no covert payload', () => {
    const graduated = conspirator(LIT());
    const roamer = npcLedgerOf(graduated.worldState).roamers[graduated.wnpcId];
    const item = rejectionNewsItem({
      settlementId: 'b', settlementName: 'Bramwell', wnpcId: graduated.wnpcId, roamer,
      reason: 'scandal_class_unacceptable',
      believed: { notorietyBand: 'notorious', scandalClass: 'conspiracy' }, tick: 3,
    });
    expect(findDmTruthPaths(item)).toEqual([]);
    // THE ANCHOR: the helper is live, and the DM projection of the SAME person reports a
    // covert path through it.
    expect(findDmTruthPaths(projectNpcPool({
      worldState: graduated.worldState, tick: 3, includeCovert: true,
    })).length).toBeGreaterThan(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — EQUILIBRIUM: rising pressure, with a floor and a ceiling', () => {
  test('pressure is EXACTLY zero on the floor and rises afterwards', () => {
    const floor = NPC_CONSEQUENCES_TUNING.ROAM_FLOOR_TICKS;
    for (let t = 0; t < floor; t += 1) expect(rehostPressure01(t)).toBe(0);
    expect(rehostPressure01(floor)).toBeGreaterThan(0);
    const failures = collectSeedFailures(Array.from({ length: 200 }, (_, i) => i), (t) => {
      expect(rehostPressure01(t + 1)).toBeGreaterThanOrEqual(rehostPressure01(t));
      expect(rehostPressure01(t)).toBeLessThanOrEqual(NPC_CONSEQUENCES_TUNING.REHOST_PRESSURE_CEILING);
    });
    expectNoSeedFailures(failures, 'the rehost pressure curve is monotone and capped');
  });

  test('roaming is never trivially brief: nobody attempts inside the floor', () => {
    const attemptsInsideFloor = Array.from({ length: 200 }, (_, i) => attemptsRehost({
      wnpcId: `wnpc_${i}`, tick: i, elapsedTicks: NPC_CONSEQUENCES_TUNING.ROAM_FLOOR_TICKS - 1,
    })).filter(Boolean);
    expect(attemptsInsideFloor).toEqual([]);
    // THE ANCHOR: past the floor, a good share of the same population does try, so the
    // empty list above measures the floor rather than a dead predicate.
    const attemptsLater = Array.from({ length: 200 }, (_, i) => attemptsRehost({
      wnpcId: `wnpc_${i}`, tick: i, elapsedTicks: 200,
    })).filter(Boolean);
    expect(attemptsLater.length).toBeGreaterThan(60);
  });

  test('unassigned roamers eventually settle themselves', () => {
    // One roamer, one welcoming town, 400 ticks: the curve should carry them in.
    const graduated = conspirator(LIT());
    let world = graduated.worldState;
    let settledAt = null;
    for (let tick = 2; tick < 400 && settledAt === null; tick += 1) {
      const elapsedTicks = tick - 1;
      if (!attemptsRehost({ wnpcId: graduated.wnpcId, tick, elapsedTicks })) continue;
      const attempt = attemptRehost({
        worldState: world, settlement: councilTown(), settlementId: 'far',
        wnpcId: graduated.wnpcId, tick,
      });
      world = attempt.worldState;
      if (attempt.admission && attempt.admission.outcome === 'admitted_lowest') settledAt = tick;
    }
    expect(settledAt).not.toBeNull();
    expect(settledAt).toBeGreaterThanOrEqual(NPC_CONSEQUENCES_TUNING.ROAM_FLOOR_TICKS);
    expect(poolCensus(world, 4).roaming).toBe(0);
  });

  test('the pool envelope scales with the realm and reports whether it holds', () => {
    expect(poolCeilingFor(4)).toBe(6);
    expect(poolCeilingFor(40)).toBe(60);
    const graduated = conspirator(LIT());
    const census = poolCensus(graduated.worldState, 4);
    expect(census).toEqual({ roaming: 1, placed: 0, ceiling: 6, within: true });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — the turncoat flow', () => {
  test('the capacity vocabulary is closed and the map is TOTAL over role archetypes', () => {
    const failures = collectSeedFailures([...NPC_ROLE_ARCHETYPES, 'nonsense', '', null], (role) => {
      expect(TURNCOAT_CAPACITIES).toContain(turncoatCapacityFor(role));
    });
    expectNoSeedFailures(failures, 'every role archetype maps into the closed capacity vocabulary');
    expect(TURNCOAT_CAPACITIES).toEqual(['advisor', 'agent', 'quartermaster', 'envoy', 'enforcer']);
  });

  test('a destination is chosen deterministically inside the rival sphere', () => {
    const sphere = ['rival_c', 'rival_a', 'rival_b'];
    const first = turncoatDestination({ wnpcId: 'w1', roleArchetype: 'military', sphereSettlementIds: sphere, tick: 4 });
    expect(first.capacity).toBe('enforcer');
    expect(sphere).toContain(first.destinationId);
    // Order-independent: the same SET yields the same destination however it arrives.
    expect(turncoatDestination({
      wnpcId: 'w1', roleArchetype: 'military', sphereSettlementIds: ['rival_b', 'rival_c', 'rival_a'], tick: 4,
    })).toEqual(first);
  });

  test('an empty sphere leaves them roaming rather than inventing a destination', () => {
    expect(turncoatDestination({ wnpcId: 'w1', roleArchetype: 'merchant', sphereSettlementIds: [], tick: 4 }))
      .toEqual({ capacity: 'quartermaster', destinationId: null });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §9 — a destroyed settlement scatters its cast, and kills nobody', () => {
  const doomed = () => ({
    name: 'Ashfall',
    npcs: [
      { id: 'npc_2', name: 'Sera Quill', role: 'Archivist' },
      { id: 'npc_1', name: 'Halden Roke', role: 'Warden' },
      { id: 'npc_3', name: 'Mira Vane', role: 'Magistrate' },
    ],
  });

  test('every named soul enters the pool, and the count is conserved', () => {
    const result = disperseCastToPool({
      worldState: LIT(), settlement: doomed(), settlementSeed: SEED,
      settlementId: 'ashfall', settlementName: 'Ashfall', tick: 12,
    });
    expect(result.dispersed).toBe(3);
    const ledger = npcLedgerOf(result.worldState);
    expect(Object.keys(ledger.roamers)).toEqual(result.wnpcIds);
    expect(Object.keys(ledger.placed)).toEqual([]);
    for (const id of result.wnpcIds) {
      expect(ledger.roamers[id].verdictCause).toBe('destruction_dispersal');
    }
    expect(result.news.candidateType).toBe(DISPERSAL_NEWS_TYPE);
    expect(result.news.dispersed).toBe(3);
    expect(result.news.reasons.join(' ')).toContain('UNRESOLVED');
  });

  test('dispersal is a pure function of the CAST, not of the roster array order', () => {
    const forward = disperseCastToPool({
      worldState: LIT(), settlement: doomed(), settlementSeed: SEED, settlementId: 'ashfall', tick: 12,
    });
    const shuffled = { ...doomed(), npcs: [...doomed().npcs].reverse() };
    const backward = disperseCastToPool({
      worldState: LIT(), settlement: shuffled, settlementSeed: SEED, settlementId: 'ashfall', tick: 12,
    });
    expect(backward.wnpcIds).toEqual(forward.wnpcIds);
  });

  test('dispersal is idempotent: a second pass mints nobody new', () => {
    const first = disperseCastToPool({
      worldState: LIT(), settlement: doomed(), settlementSeed: SEED, settlementId: 'ashfall', tick: 12,
    });
    const second = disperseCastToPool({
      worldState: first.worldState, settlement: doomed(), settlementSeed: SEED,
      settlementId: 'ashfall', tick: 40,
    });
    expect(second.wnpcIds).toEqual(first.wnpcIds);
    expect(Object.keys(npcLedgerOf(second.worldState).roamers)).toHaveLength(3);
  });

  test('a rival-compromised member keeps their turncoat option through dm truth', () => {
    const result = disperseCastToPool({
      worldState: LIT(), settlement: doomed(), settlementSeed: SEED, settlementId: 'ashfall', tick: 12,
      compromiseSourceOf: (npc) => (npc.id === 'npc_3' ? 'rival_power' : 'none'),
    });
    const ledger = npcLedgerOf(result.worldState);
    const carriers = Object.values(ledger.roamers).filter((rec) => rec.dmTruth);
    expect(carriers).toHaveLength(1);
    expect(carriers[0].dmTruth).toEqual({ compromiseSource: 'rival_power' });
    // AND the player never sees it.
    expect(findDmTruthPaths(projectNpcPool({ worldState: result.worldState, tick: 12 }))).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
describe('W-H3 §6 — DORMANCY (law 5) and persistence (§10)', () => {
  test('a dark world circulates nothing and materializes no ledger key', () => {
    for (const rules of [{}, { npcConsequencesEnabled: 'true' }, { npcConsequencesEnabled: 1 }]) {
      const dark = { simulationRules: rules, spatialCanonVersion: 1, spatialDigest: roadDigest() };
      const before = JSON.stringify(dark);
      const rehost = attemptRehost({
        worldState: dark, settlement: councilTown(), settlementId: 'far', wnpcId: 'wnpc_x', tick: 9, force: true,
      });
      const dispersal = disperseCastToPool({
        worldState: dark, settlement: { npcs: [{ id: 'npc_1', name: 'A' }] },
        settlementSeed: SEED, settlementId: 'x', tick: 9,
      });
      expect(rehost.worldState).toBe(dark);
      expect(dispersal.worldState).toBe(dark);
      expect(dispersal.dispersed).toBe(0);
      expect(hasNpcLedger(dark)).toBe(false);
      expect(JSON.stringify(dark)).toBe(before);
    }
  });

  test('a rehost survives the save/reload round trip', () => {
    const graduated = conspirator(LIT());
    const attempt = attemptRehost({
      worldState: graduated.worldState, settlement: councilTown(), settlementId: 'far',
      wnpcId: graduated.wnpcId, tick: 2, force: true,
    });
    const persisted = reloaded(attempt.worldState);
    expect(npcLedgerOf(persisted)).toEqual(npcLedgerOf(attempt.worldState));
    expect(npcLedgerOf(persisted).placed[graduated.wnpcId].hostSettlementId).toBe('far');
    // AND the cooldown edges a rejection wrote survive too.
    const rejected = attemptRehost({
      worldState: graduated.worldState, settlement: councilTown(), settlementId: 'b',
      wnpcId: graduated.wnpcId, tick: 2, force: true,
    });
    expect(exclusionsOf(reloaded(rejected.worldState), graduated.wnpcId))
      .toEqual(exclusionsOf(rejected.worldState, graduated.wnpcId));
  });

  test('the news items are total on a garbage roamer record', () => {
    const item = rejectionNewsItem({
      settlementId: 'b', settlementName: '', wnpcId: '', roamer: null, reason: 'nonsense',
      believed: null, tick: -3,
    });
    expect(item.rejectionReason).toBe('scandal_class_unacceptable');
    expect(item.tick).toBe(0);
    const arrival = arrivalNewsItem({
      settlementId: 'b', settlementName: '', wnpcId: '', roamer: null, tick: 0,
      admission: { outcome: 'nonsense', factionId: '', factionName: '', siblingId: '', siblingName: '' },
    });
    expect(arrival.admissionOutcome).toBe('remained_roaming');
  });
});
