/**
 * decreeStaleVocabulary.test.js — U72 (the verifier's FIX-3): design §20.3's stale-vocabulary
 * resolver RUNS AT THE HEAD OF THE TICK, over the whole production path.
 *
 * THE CLAIM. "A pending decree that no longer resolves is WITHDRAWN WITH ITS REASON — never
 * dropped, never applied … the resolver is pure and lives with the registry (EM-C1); the tick
 * hook (EM-E1) calls it before it applies anything" (design §20.3, ruling 3). EM-C1 landed
 * `resolveDecree`, EM-E1 landed the guard that consults it — and nothing ever handed the hook
 * a catalogue, so `applyDecreesAtTick`'s own documented absence ("ABSENT, resolution is not
 * consulted and every due entry applies") was the SHIPPING behaviour: a decree whose pool word
 * had been retired was applied at the tick, which is precisely the branch §20.3 REJECTED —
 * "a pin on a fork that no longer means what the DM chose is a lie".
 *
 * ⭐ THE BAG TRAVELS AS AN ARGUMENT, WHICH IS WHY THIS SUITE WALKS THE WHOLE CHAIN. Neither
 * the kernel nor the hook may import the op catalogue, and a pool's values are a function of
 * A SETTLEMENT (`npc.role` reads its institutions), so the ONE layer that can compose the
 * catalogues is the store's advance — which holds the live member clones. The bag then rides
 * `simulateCampaignWorldInterval` to `simulateCampaignWorldPulse` to the hook. This file
 * proves each hop with the real modules: the store's own composer, the orchestrator the
 * default-on `advanceMultiTick` flag routes every DM advance through, and the kernel.
 *
 * ⚠ THE VOCABULARY IS MEASURED, NEVER TRANSCRIBED. The pool the fixture's entry points into
 * is read back out of the op catalogue's own payload spec, and the live words are read with
 * the product's own `poolValues` over the fixture settlement — so a drift in either reds here
 * rather than passing against a word this file spelled.
 *
 * Proof shape as its neighbours: straight-line literal `it`s under ONE literal `describe`,
 * its own `vitest` import, the real kernel and the real store leaf.
 *
 * ⭐ EXTENDED BY U108 (EM-C1e; judgment 311) — WHICH MOMENT THE VOCABULARY IS READ AT, and
 * the last arm of this file is the one that answers it. EM-C1c's seat NOTICED a second
 * `add-npc`, staged between two advances, coming back `withdrawn` for a role the town had
 * offered, and the question it left was whether §20.3 was working ("a pending decree that no
 * longer resolves ... is resolved against the LIVE catalogues" at the head of the tick) or
 * whether the bag was composed from the wrong tick — a valid act withdrawn being a quiet lie.
 * MEASURED over the real store: it is §20.3 working. The advance's own result can MOVE the
 * vocabulary (applying a roster order re-derives the member's record, and a record whose
 * institutions were never generation's own comes back with generation's), and the bag the
 * next advance composes is the reading of the world that tick ENTERS — the same world the
 * hook applies the orders to. U108-1 pins that with a DISCRIMINATOR PAIR whose two verdicts
 * can only both hold for one reading moment.
 *
 * @enforced-by this test
 */
import { describe, expect, it, vi } from 'vitest';

// U108's arm drives the REAL store, so the durable cloud-write seams a hydrated campaign
// reaches are stubbed here exactly as tests/simulation/decreeChronicleVoice.test.js stubs
// them. No arm above reaches one: the composer's three imports are the op catalogue, the
// pool leaf and the kernel's own `saveId`, and nothing here reads a clock or a network.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));
vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const copy = (/** @type {any} */ value) => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: (/** @type {any} */ campaign) => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => copy(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, copy(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn((/** @type {any} */ campaign) => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});
vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = /** @type {any} */ (await importOriginal());
  return { ...actual, track: vi.fn() };
});

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { stage, withdraw } from '../../src/domain/edit/registry.js';
import { OP_TYPES } from '../../src/domain/edit/operations.js';
import { poolValues } from '../../src/domain/edit/pools.js';
import { decreeCataloguesForSaves } from '../../src/store/campaignAdvanceSession.js';
import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';

const NOW = '2026-04-04T00:00:00.000Z';

/** The pool `add-npc`'s `role` field points into, READ OFF THE CATALOGUE rather than typed. */
const ROLE_POOL = /** @type {any} */ (OP_TYPES['add-npc']).payload.role.pool;

/** @param {string[]} roles @param {unknown[]|null} decrees */
const settlementOf = (roles, decrees) => ({
  name: 'Ashford', tier: 'city', population: 9000,
  economicState: { prosperity: 'Comfortable' },
  powerStructure: { publicLegitimacy: { score: 55 }, factions: [] },
  institutions: roles.map((role, i) => ({ name: `House ${i}`, role })),
  activeConditions: [],
  ...(decrees ? { decrees } : {}),
});

/** @param {string} role */
const addNpc = (role) => ({
  type: 'add-npc',
  payload: { name: 'Bram', role },
  target: { kind: 'npc', id: 'npc-new' },
});

/** ONE staged, pending `add-npc`. @param {string} id @param {string} role */
const staged = (id, role) => stage([], addNpc(role), { id, orderedAt: NOW });

/** @param {string} id @param {string[]} roles @param {unknown[]|null} decrees */
const saveOf = (id, roles, decrees) => ({
  id, name: `Save ${id}`, phase: 'canon',
  settlement: settlementOf(roles, decrees),
  campaignState: { phase: 'canon', eventLog: [], locks: {} },
});

/** @param {any[]} saves */
const campaignOf = (saves) => ({
  id: 'u72-campaign', name: 'Stale Vocabulary', settlementIds: saves.map((s) => s.id),
  worldState: { rngSeed: 'u72::stale', tick: 1, calendar: { elapsedWeeks: 30 } },
  regionalGraph: { edges: [] },
  wizardNews: { currentTick: 1, entries: [] },
});

/** The registry as the tick left it, read off the update the pulse hands back. */
const registryOf = (/** @type {any} */ result, /** @type {string} */ saveId) => {
  const update = (result?.settlementUpdates || [])
    .find((/** @type {any} */ row) => String(row?.saveId) === saveId);
  return /** @type {any[]} */ (update?.settlement?.decrees || []);
};

/** ONE real tick over a whole realm. @param {any[]} saves @param {unknown} decreeCatalogues */
function tickRealm(saves, decreeCatalogues) {
  return /** @type {any} */ (simulateCampaignWorldPulse({
    campaign: campaignOf(saves), saves, interval: 'one_week', now: NOW,
    ...(decreeCatalogues === undefined ? {} : { decreeCatalogues }),
  }));
}

/** ONE real tick over one member save. @param {string} role @param {unknown} decreeCatalogues */
function tickWith(role, decreeCatalogues) {
  const result = tickRealm([saveOf('a', ['Steward', 'Reeve'], staged('d1', role))], decreeCatalogues);
  return {
    entry: registryOf(result, 'a')[0],
    causes: (result?.pulseRecord?.decreeCauses || []).length,
  };
}

describe('U72 — the tick resolves a stale vocabulary as design §20.3 says', () => {
  it('U72-1 A PENDING DECREE WHOSE POOL WORD HAS BEEN RETIRED IS WITHDRAWN AT THE TICK WITH §20.3\'S REASON, AND NEVER APPLIED', async () => {
    // ⭐ THE STALE WORD IS MEASURED: `Harbourmaster` is absent from what the live settlement's
    // institutions offer, read with the product's own reader, so the fixture cannot rot into
    // a world where the word is legal again and this arm passes vacuously.
    const world = settlementOf(['Steward', 'Reeve'], null);
    const live = poolValues(ROLE_POOL, world);
    expect(live.includes('Harbourmaster'), 'the fixture stopped retiring its word').toBe(false);
    expect(live.includes('Steward'), 'the live pool stopped offering the control word').toBe(true);

    const catalogues = await decreeCataloguesForSaves([saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Harbourmaster'))]);
    const stale = tickWith('Harbourmaster', catalogues);
    expect(stale.entry.status, 'the stale entry was applied instead of withdrawn').toBe('withdrawn');
    expect(stale.entry.withdrawnReason).toEqual({
      kind: 'vocabulary-moved', missing: 'pool-value', was: 'Harbourmaster',
    });
    // ⛔ WITHDRAWN IS NOT DROPPED (design §20.3): the entry keeps its place, its order and
    // every word the DM ordered, and the record carries no cause for it.
    expect(stale.entry.id).toBe('d1');
    expect(stale.entry.orderIndex).toBe(0);
    expect(stale.entry.op.payload.role).toBe('Harbourmaster');
    expect(stale.entry.appliedAt === undefined && stale.entry.tickRef === undefined,
      'a withdrawn entry wears an application').toBe(true);
    expect(stale.causes, 'the tick claimed a cause for an order it refused').toBe(0);
  });

  it('U72-2 THE SAME TICK, THE SAME CATALOGUES, A WORD THAT IS STILL LIVE: the decree APPLIES and lands its cause', async () => {
    // ⛔ THE NEGATIVE CONTROL. Without it "withdrawn" above would also be the answer of a
    // resolver that refuses everything it is shown.
    const catalogues = await decreeCataloguesForSaves([saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Steward'))]);
    const fresh = tickWith('Steward', catalogues);
    expect(fresh.entry.status).toBe('applied');
    expect(fresh.entry.withdrawnReason).toBe(undefined);
    expect(fresh.entry.appliedAt).toBe(NOW);
    expect(String(fresh.entry.tickRef).length, 'an applied entry names its tick').toBeGreaterThan(0);
    expect(fresh.causes).toBe(1);
  });

  it('U72-3 A CALLER THAT COMPOSES NO CATALOGUES RESOLVES NOTHING, which is the hook\'s own documented shape and what keeps every other caller byte-identical', () => {
    // ⛔ THE DORMANCY CLAIM THIS MEMBER RESTS ON. `applyDecreesAtTick` guards its whole
    // resolution on the bag being present, so a preview, a soak, a replay or any direct
    // kernel call composes exactly the tick it composed before this member — including the
    // preset lighting witness, a byte golden over a simulated year.
    const absent = tickWith('Harbourmaster', undefined);
    expect(absent.entry.status).toBe('applied');
    expect(absent.causes).toBe(1);
    // A null bag is the same absence, spelled the way the store spells it on a dormant world.
    const nulled = tickWith('Harbourmaster', null);
    expect(nulled.entry.status).toBe('applied');
    expect(nulled.causes).toBe(1);
  });

  it('U72-4 THE STORE COMPOSES THE LIVE CATALOGUES FROM THE MEMBER SAVES, AND READS ONLY THE POOLS THE PENDING ENTRIES NAME', async () => {
    const saves = [
      saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Steward')),
      saveOf('b', ['Harbourmaster'], staged('d2', 'Harbourmaster')),
    ];
    const bag = /** @type {any} */ (await decreeCataloguesForSaves(saves));
    // The op catalogue is handed over whole and by reference — it is a frozen table, not a copy.
    expect(bag.opTypes).toBe(OP_TYPES);
    // ⭐ EXACTLY ONE POOL IS READ PER MEMBER, and it is the one the staged op's own payload
    // names. The other sixteen are never touched — two of them (`name.npc`,
    // `name.settlement`) are cross products of the naming bag and would be thousands of
    // strings on a worker payload.
    expect(Object.keys(bag.poolsBySave.a)).toEqual([ROLE_POOL]);
    expect(Object.keys(bag.poolsBySave.b)).toEqual([ROLE_POOL]);
    // ⭐ AMENDED BY U86, AND THE AMENDMENT IS THE WHOLE OF THAT MEMBER. This arm read the
    // LAX UNION here — the one reading available to a hook that took ONE bag for N
    // registries — and lane E's own header declared the strict per-save bag as the chair's
    // to rule. It was ruled (U86): the reading below is each member's OWN, keyed by its own
    // save id, and neither town's vocabulary is ever mixed with its sibling's.
    expect([...bag.poolsBySave[saves[0].id][ROLE_POOL]].sort()).toEqual(['Reeve', 'Steward']);
    expect([...bag.poolsBySave[saves[1].id][ROLE_POOL]].sort()).toEqual(['Harbourmaster']);
    // And it is each settlement's OWN reading that goes in: neither town alone offers both.
    expect([...poolValues(ROLE_POOL, saves[0].settlement)].sort()).toEqual(['Reeve', 'Steward']);
    expect([...poolValues(ROLE_POOL, saves[1].settlement)].sort()).toEqual(['Harbourmaster']);
  });

  it('U72-5 A WORLD WITH NO PENDING DECREE COMPOSES NOTHING AT ALL, and an entry already applied or withdrawn is not pending', async () => {
    expect(await decreeCataloguesForSaves([saveOf('a', ['Steward'], null)])).toBe(null);
    expect(await decreeCataloguesForSaves([]), 'an empty realm').toBe(null);
    expect(await decreeCataloguesForSaves(null), 'a caller with no saves at all').toBe(null);
    // A registry holding only history composes nothing either — the resolver's subject is
    // PENDING entries, because an applied entry is history and is never re-resolved.
    const history = staged('d1', 'Steward').map((row) => ({ ...row, status: 'applied' }));
    expect(await decreeCataloguesForSaves([saveOf('a', ['Steward'], history)])).toBe(null);
  });

  it('U72-6 THE BAG IS PLAIN DATA, so it crosses the advance worker\'s structured clone and the R-18 paranoia pass\'s JSON clone unchanged', async () => {
    const bag = /** @type {any} */ (await decreeCataloguesForSaves([saveOf('a', ['Steward'], staged('d1', 'Steward'))]));
    // ⛔ THE WORKER BOUNDARY IS THE REASON THE BAG MAY HOLD NO FUNCTION. `postMessage`
    // structured-clones the payload, and `verifyAdvanceDeterminism` re-runs the same advance
    // in-thread over a JSON clone and DIFFS the two — so a member that survived one clone and
    // not the other would look exactly like a worker/sync divergence.
    const structured = structuredClone(bag);
    expect(JSON.stringify(structured)).toBe(JSON.stringify(bag));
    const json = JSON.stringify(bag);
    expect(JSON.stringify(JSON.parse(json))).toBe(json);
  });

  it('U72-7 THE MULTI-TICK ORCHESTRATOR CARRIES THE BAG TO THE KERNEL — the path every DM advance actually takes', async () => {
    // ⛔ `advanceMultiTick` is PROMOTED default-on (src/lib/flags.js), so a cure that reached
    // only the single-tick kernel call would be dark in production. This drives the real
    // orchestrator, which composes its own per-tick argument bag by hand.
    const saves = [saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Harbourmaster'))];
    const catalogues = await decreeCataloguesForSaves(saves);
    const result = /** @type {any} */ (await simulateCampaignWorldInterval({
      campaign: campaignOf(saves), saves, interval: 'one_week', commit: true, now: NOW,
      decreeCatalogues: catalogues,
    }));
    const entry = registryOf(result, 'a')[0];
    expect(entry.status, 'the orchestrator dropped the catalogues on the way to the kernel').toBe('withdrawn');
    expect(entry.withdrawnReason.kind).toBe('vocabulary-moved');
    // Told nothing, the same interval applies it — the orchestrator invents no bag of its own.
    const untold = /** @type {any} */ (await simulateCampaignWorldInterval({
      campaign: campaignOf(saves), saves, interval: 'one_week', commit: true, now: NOW,
    }));
    expect(registryOf(untold, 'a')[0].status).toBe('applied');
  });
});

describe('U86 — a decree is judged by its OWN save\'s vocabulary, never a sibling\'s', () => {
  it('U86-1 A WORD THAT LIVES ONLY IN A SIBLING TOWN IS NOT THIS TOWN\'S VOCABULARY: the decree is WITHDRAWN at the tick, while the sibling whose own town offers it still applies', async () => {
    const saves = [
      saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Harbourmaster')),
      saveOf('b', ['Harbourmaster'], staged('d2', 'Harbourmaster')),
    ];
    // ⭐ THE SPLIT IS MEASURED WITH THE PRODUCT'S OWN READER, never typed: the word really is
    // absent from A's reading and present in B's, so a fixture that stopped splitting the
    // two towns reds here rather than passing this arm vacuously.
    expect(poolValues(ROLE_POOL, saves[0].settlement).includes('Harbourmaster'),
      'the fixture stopped withholding the word from the first town').toBe(false);
    expect(poolValues(ROLE_POOL, saves[1].settlement).includes('Harbourmaster'),
      'the fixture stopped offering the word in the second town').toBe(true);

    const catalogues = await decreeCataloguesForSaves(saves);
    const result = tickRealm(saves, catalogues);
    const first = registryOf(result, 'a')[0];
    const second = registryOf(result, 'b')[0];
    expect(first.status, 'the first town\'s decree was judged by its SIBLING\'s vocabulary').toBe('withdrawn');
    expect(first.withdrawnReason, 'and §20.3\'s reason names the word that is not this town\'s').toEqual({
      kind: 'vocabulary-moved', missing: 'pool-value', was: 'Harbourmaster',
    });
    // ⛔ THE NEGATIVE CONTROL IS IN THE SAME TICK AND THE SAME BAG. Without it "withdrawn"
    // above would also be the answer of a resolver handed nothing at all.
    expect(second.status, 'the town whose own institutions offer the word was refused it').toBe('applied');
    expect((result?.pulseRecord?.decreeCauses || []).map((/** @type {any} */ c) => c.decreeId),
      'the record claims a cause for the order the tick refused').toEqual(['d2']);
  });

  it('U86-2 THE COMPOSER HANDS THE POOLS PER SAVE — each member\'s own reading under its own id, and the lax union is GONE rather than merely unread', async () => {
    const saves = [
      saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Steward')),
      saveOf('b', ['Harbourmaster'], staged('d2', 'Harbourmaster')),
    ];
    const bag = /** @type {any} */ (await decreeCataloguesForSaves(saves));
    // ⚠ RE-RECORDED BY EM-E4d UNIT 3 (U88), CAUSE NAMED: the bag grew a THIRD table,
    // `consequenceBySave` — design §13's consequence policy resolved per member and per entry,
    // because the head of the tick must apply `home-procedures+record` against a phantom
    // counterparty and `world` against a saved member, and neither the kernel nor the hook may
    // reach the verb that judges reality (case E1-8 pins the hook's imports at exactly two).
    // It is filed under the SAME `saveId` as the pools and travels the SAME way, which is why
    // it lands in this roster rather than beside it. The pools half below is UNMOVED.
    expect(Object.keys(bag).sort(), 'the bag is the op catalogue, the per-save pools and the per-save consequence, and nothing else')
      .toEqual(['consequenceBySave', 'opTypes', 'poolsBySave']);
    expect(Object.keys(bag.poolsBySave).sort(), 'every member that staged a pending decree is named')
      .toEqual(['a', 'b']);
    // ⛔ THE KEY IS THE KERNEL'S OWN SAVE ID, not the array position: `applyDecreesToSaves`
    // reads the bag by `saveId(save)`, so a realm whose members arrive in another order
    // still hands each town its own words.
    expect(bag.poolsBySave[saves[0].id][ROLE_POOL]).toEqual(poolValues(ROLE_POOL, saves[0].settlement));
    expect(bag.poolsBySave[saves[1].id][ROLE_POOL]).toEqual(poolValues(ROLE_POOL, saves[1].settlement));
    // ⛔ STILL PLAIN DATA. The bag crosses the advance worker's structured clone and the
    // R-18 paranoia pass's JSON clone, so a resolver FUNCTION could never have been the
    // shape here however much cleaner it reads.
    expect(JSON.stringify(structuredClone(bag))).toBe(JSON.stringify(bag));
  });

  it('U86-3 A SAVE THE BAG DOES NOT NAME RESOLVES NOTHING AT ALL — design §9\'s tie-break, so a bag composed for another realm can never withdraw an order it never read', () => {
    const saves = [saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Harbourmaster'))];
    // A bag that names a DIFFERENT member. Strictly read, this town's pools would be the
    // empty set and every pool-typed word in it would be stale — a false warning on an
    // order nobody judged, which design §9 costs higher than a missing one.
    const elsewhere = tickRealm(saves, { opTypes: OP_TYPES, poolsBySave: { elsewhere: { [ROLE_POOL]: ['Steward'] } } });
    expect(registryOf(elsewhere, 'a')[0].status, 'a town the bag never read was judged anyway').toBe('applied');
    // And the empty reading is a different fact from an absent one: a member NAMED with no
    // words is a town that offers none, and its order is withdrawn.
    const named = tickRealm(saves, { opTypes: OP_TYPES, poolsBySave: { a: {} } });
    expect(registryOf(named, 'a')[0].status, 'a member named with no words still resolves').toBe('withdrawn');
  });
});

/**
 * ⭐ U97 — THE COMPOSITION IS THE INVARIANT (judgment 305). EM-C1b's tick SKIPS the
 * stale-vocabulary check for a save the catalogue bag does not name, which is the right thing at
 * a tick — a composition gap must never become a mass-withdrawal of a town's orders — and which
 * is INVISIBLE: nothing reports that the check was skipped. 305 rules that what is owed is not a
 * runtime branch but an ARM, and this is it.
 *
 * ⛔ THE INVARIANT IS NARROWER THAN THE QUEUE ROW'S WORDS, AND THE NARROWING IS MEASURED, NOT
 * PREFERRED. U97 says "every advance composes a bag entry for EVERY member save". Against this
 * tree that is FALSE and U97-2 executes the counter-example: `decreeCataloguesForSaves`
 * (`src/store/campaignAdvanceSession.js`) filters to the saves carrying at least one PENDING
 * entry and returns `null` when there are none, while `applyDecreesToSaves`
 * (`src/domain/worldPulse/decreeHook.js`) walks every save whose `decrees` array is merely
 * NON-EMPTY. So a member whose registry holds only history reaches the bag lookup unnamed. The
 * TRUE and load-bearing invariant — the one whose failure would silently skip a real check — is
 * that every save the tick will JUDGE is named, and that is what U97-1 holds in both directions.
 */
describe('U97 — the advance composes a bag entry for every save the tick will JUDGE', () => {
  it('U97-1 A REALM OF FIVE, EVERY MEMBER JUDGED: the composer names all five, the real orchestrator carries the bag to all five, and a bag missing ONE lets that town\'s order through unchecked', async () => {
    const ids = ['a', 'b', 'c', 'd', 'e'];
    const saves = ids.map((id, index) => saveOf(id, ['Steward', 'Reeve'], staged(`d-${index}`, 'Harbourmaster')));
    // ANTI-VACUITY, TWICE. A realm of one would make "all of them" a single fact, and a word
    // some town DID offer would make the withdrawals below prove nothing about the check.
    expect(saves.length, 'a realm of one cannot show a totality').toBeGreaterThan(2);
    const offering = saves.filter((save) => poolValues(ROLE_POOL, save.settlement).includes('Harbourmaster'));
    expect(offering, 'the fixture started offering the stale word somewhere').toEqual([]);

    // (a) THE COMPOSITION, BOTH DIRECTIONS: five members staged an order, five are named.
    const bag = /** @type {any} */ (await decreeCataloguesForSaves(saves));
    expect(Object.keys(bag.poolsBySave).sort(), 'the advance composed a bag that does not name every save it will judge')
      .toEqual([...ids].sort());

    // (b) AND THE BAG REACHES ALL FIVE THROUGH THE REAL ORCHESTRATOR. Five withdrawals is the
    // proof: an unnamed save is SKIPPED and its order APPLIES, so "withdrawn" can only be the
    // answer of a check that actually ran on that town.
    const result = /** @type {any} */ (await simulateCampaignWorldInterval({
      campaign: campaignOf(saves), saves, interval: 'one_week', commit: true, now: NOW,
      decreeCatalogues: bag,
    }));
    expect(ids.map((id) => registryOf(result, id)[0].status), 'a member the bag named was not judged at the tick')
      .toEqual(ids.map(() => 'withdrawn'));

    // (c) ⛔ THE COMPOSITION GAP, EXECUTED — THE THING U97 SAYS NOTHING REPORTS. The same realm
    // with the first member left out of the composition by copy: its order applies UNCHECKED
    // while its four siblings are judged, and no cause, no warning and no record says so.
    const gap = /** @type {any} */ (await decreeCataloguesForSaves(saves.slice(1)));
    expect(Object.keys(gap.poolsBySave).sort(), 'the copy still named the omitted member').toEqual(['b', 'c', 'd', 'e']);
    const skipped = /** @type {any} */ (await simulateCampaignWorldInterval({
      campaign: campaignOf(saves), saves, interval: 'one_week', commit: true, now: NOW,
      decreeCatalogues: gap,
    }));
    expect(registryOf(skipped, 'a')[0].status, 'an unnamed member was judged after all, so (b) proves nothing')
      .toBe('applied');
    expect(['b', 'c', 'd', 'e'].map((id) => registryOf(skipped, id)[0].status), 'the named siblings stopped being judged')
      .toEqual(['withdrawn', 'withdrawn', 'withdrawn', 'withdrawn']);
  });

  it('U97-2 THE DENOMINATOR IS MEASURED, NOT ASSUMED: the composer names the saves with a PENDING entry, and a member carrying only history is walked by the tick without being named — judgment 305\'s documented no-resolution path, not a composition gap', async () => {
    const pending = saveOf('a', ['Steward', 'Reeve'], staged('d1', 'Harbourmaster'));
    const historyOnly = saveOf('b', ['Steward', 'Reeve'], withdraw(staged('d2', 'Harbourmaster'), 'd2'));

    // THE TWO FIXTURES REALLY DIFFER, read with the registry's own verb rather than typed: one
    // registry carries a pending row and the other carries none, and BOTH are non-empty.
    expect(pending.settlement.decrees.map((/** @type {any} */ row) => row.status)).toEqual(['pending']);
    expect(historyOnly.settlement.decrees.map((/** @type {any} */ row) => row.status)).toEqual(['withdrawn']);
    expect(historyOnly.settlement.decrees.length, 'an EMPTY registry would take the hook\'s early return instead')
      .toBeGreaterThan(0);

    // (a) THE COMPOSER'S DENOMINATOR, BOTH DIRECTIONS: pending, not membership.
    const bag = /** @type {any} */ (await decreeCataloguesForSaves([pending, historyOnly]));
    expect(Object.keys(bag.poolsBySave).sort(), 'the composer\'s denominator moved off "has a pending entry"')
      .toEqual(['a']);

    // (b) AND THE UNNAMED MEMBER IS STILL WALKED. Its registry is non-empty, so the hook does not
    // return early on it; it reaches the bag lookup, finds no entry and takes the documented
    // no-resolution path — which leaves its history exactly as it was.
    const before = JSON.stringify(historyOnly.settlement.decrees);
    const result = tickRealm([pending, historyOnly], bag);
    expect(registryOf(result, 'a')[0].status, 'the named member was not judged').toBe('withdrawn');
    expect(JSON.stringify(registryOf(result, 'b')), 'the unnamed member\'s history was touched at the tick')
      .toBe(before);

    // (c) ⛔ THE WHOLE-BAG CASE, so the null return is a measurement and not an inference: a realm
    // where NO member has a pending entry composes no bag at all.
    expect(await decreeCataloguesForSaves([historyOnly]), 'a realm with nothing pending composed a bag anyway')
      .toBeNull();
  });
});

/* ── U108 (EM-C1e) · THE MOMENT THE VOCABULARY IS READ AT ──────────────────────────────── */

/** The seed the tick's re-derivation reads off the record it is about to re-generate. */
const U108_SEED = 'u108::ashford';

/** The file's own member save, carrying that seed and one person for the roster to hold. */
const seededSave = (/** @type {string} */ id, /** @type {string[]} */ roles, /** @type {unknown[]|null} */ decrees) => {
  const save = saveOf(id, roles, decrees);
  return {
    ...save,
    settlement: {
      ...save.settlement,
      _seed: U108_SEED,
      npcs: [{ id: 'npc.varn', name: 'Lord Varn', role: 'Reeve', status: 'active' }],
    },
  };
};

/** A localStorage double. The campaign cache is the only thing in this arm that reaches it. */
function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = /** @type {any} */ ({
    getItem: (/** @type {any} */ key) => data.get(String(key)) ?? null,
    setItem: (/** @type {any} */ key, /** @type {any} */ value) => { data.set(String(key), String(value)); },
    removeItem: (/** @type {any} */ key) => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  });
}

/** The REAL store over the two real slices, holding one campaign and its one member save. */
function storeWith(/** @type {any} */ save) {
  installLocalStorage();
  const store = create(immer((/** @type {any[]} */ ...a) => ({
    savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
    eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
    ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a),
  })));
  store.setState((/** @type {any} */ state) => {
    state.savedSettlements = [save];
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: [save.id],
      regionalGraph: { edges: [] },
      wizardNews: { currentTick: 1, entries: [] },
      worldState: { rngSeed: 'u108::vocabulary', tick: 1, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
  return store;
}

/** The member save as the store holds it — read outside every producer, so it is plain. */
const memberOf = (/** @type {any} */ store) => store.getState().savedSettlements[0];
/** That member's live vocabulary, read with the PRODUCT's own reader and never transcribed. */
const wordsOf = (/** @type {any} */ store) => [...poolValues(ROLE_POOL, memberOf(store).settlement)];
/** Its registry, as the tick left it. */
const rowsOf = (/** @type {any} */ store) => /** @type {any[]} */ (memberOf(store).settlement.decrees || []);
/** ONE real advance of the realm, through the store's own action. */
const advanceOnce = (/** @type {any} */ store) =>
  store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });

/**
 * Two further orders on the member's own registry, through EM-C1's own `stage`. The rows are
 * lifted to plain objects first: they are read off the store outside any producer, and the
 * newcomer's id is the ENTRY's so two orders are two people rather than one written twice.
 */
function stageBoth(/** @type {any} */ store, /** @type {any} */ first, /** @type {any} */ second) {
  const rows = JSON.parse(JSON.stringify(rowsOf(store)));
  const withFirst = stage(rows, { ...addNpc(first.role), target: { kind: 'npc', id: `npc-${first.id}` } },
    { id: first.id, orderedAt: NOW });
  const withBoth = stage(withFirst, { ...addNpc(second.role), target: { kind: 'npc', id: `npc-${second.id}` } },
    { id: second.id, orderedAt: NOW });
  store.setState((/** @type {any} */ state) => { state.savedSettlements[0].settlement.decrees = withBoth; });
}

describe('U108 — a decree is judged against the vocabulary OF THE WORLD IT IS APPLIED TO', () => {
  it('U108-1 THE WITHDRAWAL IS THE WORLD\'S, NOT THE BAG\'S: a word the tick itself retired is withdrawn with §20.3\'s reason while a sibling staged from the SAME post-tick reading applies — one tick, one bag, two verdicts', async () => {
    const store = storeWith(seededSave('a', ['Steward', 'Reeve'], staged('d1', 'Reeve')));

    // ⭐ THE PRE-TICK VOCABULARY, MEASURED with the product's own reader over the very member
    // the advance is about to hand the kernel — this file never types a live word.
    const before = wordsOf(store);
    expect([...before].sort(), 'the fixture town stopped offering exactly the two words it seeds')
      .toEqual(['Reeve', 'Steward']);

    await advanceOnce(store);
    expect(rowsOf(store).map((row) => row.status),
      'the first order APPLIED — the tick ran, and it is that application which moves the world below')
      .toEqual(['applied']);

    // ⛔ THE TICK'S OWN RESULT MOVED THE VOCABULARY, which is U108's whole premise and is a
    // MEASUREMENT here rather than a claim: applying a roster order re-derives the member's
    // record (`applyRosterDecreesAtTick` → the re-derivation seam), and a record whose
    // institutions were never generation's own comes back holding generation's instead. Both
    // directions are read, so a tree where the tick stopped moving the pool reds here rather
    // than passing the pair below vacuously.
    const after = wordsOf(store);
    const retired = before.find((word) => !after.includes(word));
    const minted = after.find((word) => !before.includes(word));
    expect([typeof retired, typeof minted],
      'the tick left the vocabulary unmoved, so nothing below discriminates anything')
      .toEqual(['string', 'string']);

    // ⭐ THE DISCRIMINATOR PAIR, STAGED TOGETHER BETWEEN THE TICKS. `retired` resolves ONLY
    // against the world as it was BEFORE the first tick; `minted` ONLY against the world as
    // that tick left it. Judged in ONE tick against ONE bag, the two verdicts name the moment
    // the bag was read at and nothing else can produce them: a bag from the pre-tick world
    // would apply `retired` and withdraw `minted`, a bag from a third world would withdraw
    // both, and a resolver that refuses everything would withdraw both as well.
    stageBoth(store, { id: 'd2', role: retired }, { id: 'd3', role: minted });

    const bag = /** @type {any} */ (await decreeCataloguesForSaves(
      [JSON.parse(JSON.stringify(memberOf(store)))]));
    expect(bag.poolsBySave.a[ROLE_POOL],
      'the bag the advance composes IS the reading of the world the tick enters')
      .toEqual(poolValues(ROLE_POOL, memberOf(store).settlement));
    expect([bag.poolsBySave.a[ROLE_POOL].includes(retired), bag.poolsBySave.a[ROLE_POOL].includes(minted)],
      'and it holds the live word while the retired one is gone from it')
      .toEqual([false, true]);

    await advanceOnce(store);
    const judged = rowsOf(store);
    expect(judged.map((row) => [row.id, row.status]),
      'the retired word is withdrawn and the live one applies, in the same tick and the same bag')
      .toEqual([['d1', 'applied'], ['d2', 'withdrawn'], ['d3', 'applied']]);
    expect(judged[1].withdrawnReason, '§20.3\'s reason NAMES the word that left the world')
      .toEqual({ kind: 'vocabulary-moved', missing: 'pool-value', was: retired });
    expect([judged[1].op.payload.role, judged[1].orderIndex],
      'and the withdrawn entry keeps its place and every word the DM ordered (§20.3: never dropped)')
      .toEqual([retired, 1]);
    expect(String(judged[2].tickRef).length > 0,
      'while the sibling wears the tick that carried it out').toBe(true);

    // ⛔ AND THE VOCABULARY DID NOT MOVE ACROSS THIS SECOND TICK. That is what makes the pair
    // a measurement of the bag's MOMENT rather than of a second move — `minted` was staged
    // and applied against one and the same reading — and it is U108's headline in one line:
    // a valid act is never withdrawn for a vocabulary that did not move.
    expect(wordsOf(store), 'the second tick left the vocabulary where the first tick put it')
      .toEqual(after);
  }, 20000);
});
