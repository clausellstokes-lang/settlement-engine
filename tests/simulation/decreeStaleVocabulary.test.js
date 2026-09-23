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

/** ONE real tick over one member save. @param {string} role @param {unknown} decreeCatalogues */
function tickWith(role, decreeCatalogues) {
  const saves = [saveOf('a', ['Steward', 'Reeve'], staged('d1', role))];
  const result = /** @type {any} */ (simulateCampaignWorldPulse({
    campaign: campaignOf(saves), saves, interval: 'one_week', now: NOW,
    ...(decreeCatalogues === undefined ? {} : { decreeCatalogues }),
  }));
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
    // ⭐ EXACTLY ONE POOL IS READ, and it is the one the staged op's own payload names. The
    // other sixteen are never touched — two of them (`name.npc`, `name.settlement`) are cross
    // products of the naming bag and would be thousands of strings on a worker payload.
    expect(Object.keys(bag.pools)).toEqual([ROLE_POOL]);
    // ⭐ ACROSS MEMBER SAVES THE POOL IS THE UNION of what each live settlement offers, which
    // is the one reading that can never withdraw a decree that should have applied.
    expect([...bag.pools[ROLE_POOL]].sort()).toEqual(['Harbourmaster', 'Reeve', 'Steward']);
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
