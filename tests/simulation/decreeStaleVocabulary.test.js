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
 * @enforced-by this test
 */
import { describe, expect, it } from 'vitest';

import { simulateCampaignWorldPulse } from '../../src/domain/worldPulse/pulseKernel.js';
import { simulateCampaignWorldInterval } from '../../src/domain/worldPulse/advanceInterval.js';
import { stage } from '../../src/domain/edit/registry.js';
import { OP_TYPES } from '../../src/domain/edit/operations.js';
import { poolValues } from '../../src/domain/edit/pools.js';
import { decreeCataloguesForSaves } from '../../src/store/campaignAdvanceSession.js';

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
    expect(Object.keys(bag).sort(), 'the bag is the op catalogue and the per-save pools, and nothing else')
      .toEqual(['opTypes', 'poolsBySave']);
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
