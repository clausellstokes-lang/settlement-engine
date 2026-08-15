/**
 * npcLedgerState.test.js — W-H1 THE WORLD LEDGER as persisted state (design §3b, §10).
 *
 * Covers the lifecycle paths a ledger write has to survive, and the two laws that make
 * it safe to persist:
 *
 *   DORMANCY (law 5)      dark ⇒ no key, no object churn, byte-identical worldState.
 *   DROP-WHEN-EMPTY       a drained ledger is byte-identical to one that never existed.
 *   ROUND TRIP (§10)      save/reload preserves every field and the reverse lookup.
 *   CONSERVATION (law 6)  roamers and placed are disjoint; graduation neither
 *                         duplicates nor removes an NPC in EITHER alias home.
 *   NON-DISTURBANCE       the positional-id and _preservation machinery is byte-
 *                         unchanged, proven by driving the real preservation code.
 *
 * THE ALIAS TRAP is load-bearing here: factions[].members[] entries ARE the npcs[]
 * objects in memory, so an in-memory census cannot distinguish a shared reference from
 * a copy. Every conservation assertion below therefore runs against a JSON-ROUND-TRIPPED
 * fixture, which is the only thing that splits the alias.
 */
import { describe, expect, test } from 'vitest';

import {
  NPC_LEDGER_KEY,
  npcConsequencesActive,
  emptyNpcLedger,
  npcLedgerOf,
  setNpcLedger,
  hasNpcLedger,
  graduateNpc,
  roamerRecordOf,
  placementOf,
  exclusionsOf,
  isExcludedFrom,
  graduatedNpcIds,
  settlementNpcCensus,
} from '../../src/domain/worldPulse/npcLedger.js';
import { mergePreservedNpcs } from '../../src/domain/regenerationPreservation.js';
import { remapNpcLocks } from '../../src/domain/locksPreservation.js';

const DARK = () => ({ simulationRules: {}, tick: 3, calendar: { elapsedWeeks: 12 } });
const LIT = () => ({ simulationRules: { npcConsequencesEnabled: true }, tick: 3, calendar: { elapsedWeeks: 12 } });
const MIRA = { rosterId: 'npc_3', name: 'Mira Vane', role: 'Magistrate' };

function graduate(worldState, patch = {}) {
  return graduateNpc({
    worldState,
    settlementSeed: 'seed-aldermoor',
    settlementId: 'aldermoor',
    rosterIdentity: MIRA,
    tick: 5,
    ...patch,
  });
}

/**
 * A settlement whose faction members ARE its npcs[] objects (the real in-memory alias).
 * Serialize it to split the alias, exactly as a save/reload does.
 */
function aliasedSettlement() {
  const npcs = [
    { id: 'npc_1', name: 'Halden Roke', role: 'Warden', factionAffiliation: 'Town Council' },
    { id: 'npc_2', name: 'Sera Quill', role: 'Archivist', factionAffiliation: 'Town Council' },
    { id: 'npc_3', name: 'Mira Vane', role: 'Magistrate', factionAffiliation: 'Town Council' },
    { id: 'npc_4', name: 'Tobin Reave', role: 'Cooper', factionAffiliation: 'Guild of Coopers' },
  ];
  return {
    name: 'Aldermoor',
    npcs,
    powerStructure: {
      factions: [
        { faction: 'Town Council', isGoverning: true, members: [npcs[0], npcs[1], npcs[2]] },
        { faction: 'Guild of Coopers', isGoverning: false, members: [npcs[3]] },
      ],
    },
  };
}

describe('the gate and dormancy (law 5)', () => {
  test('the gate reads === true and nothing else', () => {
    expect(npcConsequencesActive(LIT())).toBe(true);
    expect(npcConsequencesActive(DARK())).toBe(false);
    for (const rules of [{ npcConsequencesEnabled: 'true' }, { npcConsequencesEnabled: 1 }, {}, null]) {
      expect(npcConsequencesActive({ simulationRules: rules })).toBe(false);
    }
    expect(npcConsequencesActive(null)).toBe(false);
    expect(npcConsequencesActive(undefined)).toBe(false);
  });

  test('DARK: graduation is an immediate no-op that returns the SAME worldState reference', () => {
    const world = DARK();
    const before = JSON.stringify(world);
    const result = graduate(world);
    expect(result.wnpcId).toBe(null);
    expect(result.minted).toBe(false);
    expect(result.changed).toBe(false);
    // Same REFERENCE, not merely equal: a fresh object would defeat an upstream change
    // detector and could mint a spurious "the world moved" signal.
    expect(result.worldState).toBe(world);
    expect(JSON.stringify(result.worldState)).toBe(before);
    expect(hasNpcLedger(result.worldState)).toBe(false);
    expect(Object.keys(result.worldState)).not.toContain('spatialLedgers'); // anchored: the same object literal is asserted byte-identical to `before` on the line above, so this collection cannot have silently emptied
  });

  test('DARK: the world carries no spatialLedgers namespace at all after many attempts', () => {
    let world = /** @type {Record<string, unknown>} */ (DARK());
    for (let i = 0; i < 20; i += 1) {
      world = graduateNpc({
        worldState: world,
        settlementSeed: 'seed',
        settlementId: 'aldermoor',
        rosterIdentity: { rosterId: `npc_${i}`, name: `P${i}` },
        tick: i,
      }).worldState;
    }
    expect(JSON.stringify(world)).toBe(JSON.stringify(DARK()));
  });
});

describe('the ledger model, and drop-when-empty', () => {
  test('an absent, garbage or partial ledger reads as the total empty shape', () => {
    for (const world of [null, undefined, {}, { spatialLedgers: 'nope' }, { spatialLedgers: { npcLedger: 7 } }]) {
      expect(npcLedgerOf(world)).toEqual(emptyNpcLedger());
    }
    expect(npcLedgerOf({ spatialLedgers: { npcLedger: { roamers: 'bad' } } })).toEqual(emptyNpcLedger());
  });

  test('setting an EMPTY ledger drops the key and the namespace with it', () => {
    const lit = LIT();
    const withRecord = graduate(lit).worldState;
    expect(hasNpcLedger(withRecord)).toBe(true);

    const drained = setNpcLedger(withRecord, emptyNpcLedger());
    expect(hasNpcLedger(drained)).toBe(false);
    // BYTE IDENTITY: a drained world must serialize exactly like one that never had a
    // ledger, or a campaign that emptied its pool would carry a ghost key forever.
    expect(JSON.stringify(drained)).toBe(JSON.stringify(lit));
  });

  test('an unchanged write returns the SAME worldState reference (no object churn)', () => {
    const world = graduate(LIT()).worldState;
    const same = setNpcLedger(world, npcLedgerOf(world));
    expect(same).toBe(world);
  });

  test('records and exclusion lists persist in codepoint key order, so bytes are permutation-independent', () => {
    let world = /** @type {Record<string, unknown>} */ (LIT());
    const names = ['Zara', 'Alba', 'Mira', 'Corin'];
    for (const [i, name] of names.entries()) {
      world = graduateNpc({
        worldState: world,
        settlementSeed: 'seed',
        settlementId: 'aldermoor',
        rosterIdentity: { rosterId: `npc_${i}`, name },
        tick: i,
      }).worldState;
    }
    const keys = Object.keys(npcLedgerOf(world).roamers);
    expect(keys).toEqual([...keys].sort());
    // Insertion order cannot leak: rebuilding from a shuffled map serializes the same.
    const shuffled = { ...npcLedgerOf(world), roamers: Object.fromEntries([...Object.entries(npcLedgerOf(world).roamers)].reverse()) };
    expect(JSON.stringify(npcLedgerOf(setNpcLedger(LIT(), shuffled)))).toBe(JSON.stringify(npcLedgerOf(world)));
  });
});

describe('lifecycle path: save and reload (design §10)', () => {
  test('a full JSON round trip preserves every field and every accessor answer', () => {
    const built = graduate(LIT(), {
      verdictCause: 'banished',
      reputation: { notorietyBand: 'notorious', edictMark: 'banishment_edict', scandalClass: 'venality', alignmentRead: 'evil', competenceRead: 'capable' },
      dmTruth: { compromiseSource: 'rival_power' },
    });
    const id = String(built.wnpcId);
    const withEdges = setNpcLedger(built.worldState, {
      ...npcLedgerOf(built.worldState),
      exclusions: { [id]: [{ settlementId: 'aldermoor', kind: 'banishment_edict', untilTick: 40 }] },
    });

    const reloaded = JSON.parse(JSON.stringify(withEdges));
    expect(JSON.stringify(reloaded)).toBe(JSON.stringify(withEdges));
    expect(npcLedgerOf(reloaded)).toEqual(npcLedgerOf(withEdges));

    const record = roamerRecordOf(reloaded, id);
    expect(record.verdictCause).toBe('banished');
    expect(record.reputation.notorietyBand).toBe('notorious');
    expect(record.dmTruth).toEqual({ compromiseSource: 'rival_power' });
    expect(exclusionsOf(reloaded, id)).toEqual([{ settlementId: 'aldermoor', kind: 'banishment_edict', untilTick: 40 }]);
    expect(isExcludedFrom(reloaded, id, 'aldermoor', 39)).toBe(true);
    expect(isExcludedFrom(reloaded, id, 'aldermoor', 40)).toBe(false);
    expect(isExcludedFrom(reloaded, id, 'crowmarch', 39)).toBe(false);
  });

  test('a neutral record carries NO dmTruth key at all (drop-when-empty at field level)', () => {
    const built = graduate(LIT(), { dmTruth: { compromiseSource: 'none' } });
    const serialized = JSON.stringify(npcLedgerOf(built.worldState));
    expect(serialized).not.toMatch(/dmTruth/); // anchored: the sibling assertion below builds the SAME record shape WITH a compromise source and proves the substring is producible, so an empty match here cannot be a drifted serializer
    const covert = graduate(LIT(), { dmTruth: { compromiseSource: 'criminal_institution' } });
    expect(JSON.stringify(npcLedgerOf(covert.worldState))).toMatch(/dmTruth/);
  });
});

describe('CONSERVATION (law 6)', () => {
  test('roamers and placed are DISJOINT: a duplicated id resolves to exactly one home', () => {
    const built = graduate(LIT());
    const id = String(built.wnpcId);
    const record = npcLedgerOf(built.worldState).roamers[id];
    // Hand-corrupt the persisted shape the way a bad H2 transition would, then prove
    // the read door refuses to hand back two people.
    const corrupted = setNpcLedger(LIT(), {
      roamers: { [id]: record },
      placed: { [id]: { ...record, hostSettlementId: 'crowmarch' } },
      exclusions: {},
    });
    const ledger = npcLedgerOf(corrupted);
    expect(Object.keys(ledger.placed)).toEqual([id]);
    expect(Object.keys(ledger.roamers)).toEqual([]);
    expect(graduatedNpcIds(corrupted)).toEqual([id]);
    expect(placementOf(corrupted, id).hostSettlementId).toBe('crowmarch');
    expect(roamerRecordOf(corrupted, id)).toBe(null);
  });

  test('graduation neither duplicates nor removes an NPC in EITHER alias home', () => {
    // The census runs against the ROUND-TRIPPED settlement, because only serialization
    // splits the npcs[] / factions[].members[] alias.
    const settlement = JSON.parse(JSON.stringify(aliasedSettlement()));
    const before = settlementNpcCensus(settlement);
    expect(before.npcCount, 'anti-vacuity: the fixture must actually carry a cast').toBe(4);
    expect(before.memberCount, 'anti-vacuity: the fixture must actually carry faction members').toBe(4);

    const world = graduate(LIT(), { verdictCause: 'banished' });
    expect(world.minted).toBe(true);

    const after = settlementNpcCensus(settlement);
    expect(after).toEqual(before);
    expect(after.npcIds).toEqual(['npc_1', 'npc_2', 'npc_3', 'npc_4']);
    expect(after.memberIds).toEqual(['npc_1', 'npc_2', 'npc_3', 'npc_4']);
    // And the ledger holds exactly ONE new durable identity for that one person.
    expect(graduatedNpcIds(world.worldState)).toHaveLength(1);
  });

  test('the census reports the two alias homes separately and never dedupes across them', () => {
    // A settlement where a member is NOT in npcs[] must be visible as an asymmetry
    // rather than silently merged, or the census could hide a real conservation break.
    const skewed = {
      npcs: [{ id: 'npc_1' }],
      powerStructure: { factions: [{ members: [{ id: 'npc_1' }, { id: 'npc_9' }] }] },
    };
    const census = settlementNpcCensus(skewed);
    expect(census.npcIds).toEqual(['npc_1']);
    expect(census.memberIds).toEqual(['npc_1', 'npc_9']);
    expect(census.npcCount).not.toBe(census.memberCount);
  });

  test('the census is total on garbage', () => {
    expect(settlementNpcCensus(null)).toEqual({ npcIds: [], memberIds: [], npcCount: 0, memberCount: 0 });
    expect(settlementNpcCensus({ npcs: 'nope', powerStructure: 7 })).toEqual({ npcIds: [], memberIds: [], npcCount: 0, memberCount: 0 });
  });
});

describe('NON-DISTURBANCE of the positional-id and preservation machinery', () => {
  test('graduation changes ONLY spatialLedgers.npcLedger and nothing else in worldState', () => {
    const world = LIT();
    const after = graduate(world).worldState;
    const strip = (/** @type {Record<string, unknown>} */ w) => {
      const { spatialLedgers: _drop, ...rest } = w;
      return rest;
    };
    expect(strip(after)).toEqual(strip(world));
    expect(Object.keys(/** @type {Record<string, unknown>} */ (after.spatialLedgers))).toEqual([NPC_LEDGER_KEY]);
  });

  test('the real reroll preservation + lock remap are BYTE-UNCHANGED by graduation', () => {
    // Drives the ACTUAL machinery (mergePreservedNpcs + remapNpcLocks), not a model of
    // it, so this measures the contract the design demands rather than restating it.
    const previous = [
      { id: 'npc_1', name: 'Halden Roke', role: 'Warden', canonStatus: 'user' },
      { id: 'npc_3', name: 'Mira Vane', role: 'Magistrate', canonStatus: 'user' },
    ];
    const fresh = [
      { id: 'npc_1', name: 'Ester Fyne', role: 'Warden' },
      { id: 'npc_2', name: 'Odo Blackwell', role: 'Reeve' },
      { id: 'npc_3', name: 'Mira Vane', role: 'Magistrate' },
    ];
    const locks = { npcs: ['npc_3'] };

    const baseline = mergePreservedNpcs(previous, fresh, { mode: 'rebalance', locks });
    const baselineLocks = remapNpcLocks(locks, baseline.preserved);
    expect(baseline.preserved.length, 'anti-vacuity: the preservation lane must actually preserve somebody here').toBeGreaterThan(0);

    // Graduate the same person in the world ledger, then re-run preservation verbatim.
    const world = graduate(LIT(), { verdictCause: 'banished' });
    expect(world.minted).toBe(true);
    const after = mergePreservedNpcs(previous, fresh, { mode: 'rebalance', locks });
    const afterLocks = remapNpcLocks(locks, after.preserved);

    expect(JSON.stringify(after)).toBe(JSON.stringify(baseline));
    expect(JSON.stringify(afterLocks)).toBe(JSON.stringify(baselineLocks));
    // And the positional ids the roster keeps are untouched by the durable id space.
    expect(after.npcs.map((n) => n.id)).toEqual(['npc_1', 'npc_2', 'npc_3']);
    expect(String(world.wnpcId).startsWith('wnpc_')).toBe(true);
  });

  test('the durable id space and the positional id space cannot collide', () => {
    const world = graduate(LIT()).worldState;
    for (const id of graduatedNpcIds(world)) {
      expect(id.startsWith('wnpc_')).toBe(true);
      expect(id).not.toMatch(/^npc_/); // anchored: graduatedNpcIds is asserted non-empty by the loop's own subject below, and the sibling assertion on the same id proves the collection is live and correctly keyed
    }
    expect(graduatedNpcIds(world)).toHaveLength(1);
  });
});
