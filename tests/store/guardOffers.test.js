/**
 * guardOffers.test.js — EM-C4c case A: the guard offers have a WRITER.
 *
 * THE CLAIM: an offer EM-C2's engine minted reaches the act its name means. `proceed` and
 * `keep both` record the guard's OWN id on the entry, so the finding stands MARKED and the
 * act still applies; the two clash offers withdraw the right one of the pair and keep it for
 * the record; `fulfil it for me` stages the guard's own op as the GUARD's entry immediately
 * before the entry it serves; and everything this door cannot write fails closed in one
 * closed, typed vocabulary with the store byte-identical.
 *
 * ⛔ EVERY GUARD IN THIS SUITE IS THE REAL ENGINE'S. `evaluateGuards` is run over a registry
 * EM-C1's own `stage` built, with EM-C3's real rule set and the two real injected writers, so
 * a guard id here is the id the product would mint and not a string typed beside the claim.
 * The two hand-shaped variants (a finding with its `fulfil` dropped and one with its related
 * entry dropped) are named where they are used: the catalogue reaches neither shape today,
 * and a refusal that cannot be reached is a refusal nobody has proven.
 *
 * ⛔ EVERY SET THIS SUITE ITERATES IS IMPORTED FROM ITS PRODUCER — the offers, the refusal
 * set, the act table, the op catalogue, the pool catalogue — never re-typed here
 * (tests/lint/contractTestAntiVacuity.walker.test.js Rule 2).
 *
 * ⛔ NO ARM ASSERTS INSIDE A LOOP: each matrix is COLLECTED and then asserted once.
 *
 * @enforced-by this test
 */

import { describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// The durable cloud-write seam a hydrated save reaches. Stubbed so this suite is headless.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { evaluateGuards, GUARD_OFFERS } from '../../src/domain/edit/guards.js';
import { makeGuardRuleSet } from '../../src/domain/edit/guardRules.js';
import { makeOp, OP_TYPES } from '../../src/domain/edit/operations.js';
import { poolValues } from '../../src/domain/edit/pools.js';
import { DECREE_AUTHORS, stage } from '../../src/domain/edit/registry.js';
import { renormalizeFactionPower } from '../../src/generators/power/rulingStructure.js';
import { checkStructuralValidity } from '../../src/generators/structuralValidator.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  GUARD_OFFER_ACTS,
  GUARD_OFFER_REFUSALS,
  markDecreeApplied,
  selectDecrees,
  takeGuardOffer,
} from '../../src/store/editSlice.js';

const SAVE_ID = 'save-1';
const SEED = 'seed-stoneford-1';
const ORDERED_AT = '2026-09-23T12:00:00.000Z';
const INSTITUTION = 'i1';
const PHANTOM = 'ph-1';

/** The offers by the index EM-C2 orders them at, read from the vocabulary and never spelled. */
const FULFIL = GUARD_OFFERS[0];
const KEEP_BOTH = GUARD_OFFERS[1];
const KEEP_FIRST = GUARD_OFFERS[2];
const KEEP_LAST = GUARD_OFFERS[3];
const PROCEED = GUARD_OFFERS[4];
const REORDER = GUARD_OFFERS[5];
const SELF = GUARD_OFFERS[6];

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'city', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

/**
 * THE WORLD the guards judge. A city that already holds a Citadel and no walls, so the
 * structural validator the prerequisite rule injects really has something to say about it —
 * the finding below is the estate's own authored knowledge, not a fixture's invention.
 */
function fixture() {
  return {
    id: 'city.stoneford', tier: 'city', name: 'Stoneford', population: 9000, _seed: SEED,
    config: { settType: 'city', monsterThreat: 'safe', tradeRouteAccess: 'road' },
    npcs: [{ id: 'npc.alda', name: 'Alda', role: 'Reeve', status: 'active' }],
    institutions: [{ id: INSTITUTION, name: 'Citadel', category: 'military', state: 'sound' }],
    powerStructure: {
      factions: [
        { id: 'f1', faction: 'The Guild', power: 40 },
        { id: 'f2', faction: 'The Reeve', power: 35 },
      ],
      conflicts: [],
    },
    history: { historicalEvents: [], currentTensions: [] },
  };
}

/** THE FOUR STAGED ENTRIES, built by EM-C1's own `stage` over the catalogue's own ops. */
function registryOf() {
  let rows = [];
  rows = stage(rows, makeOp('add-institution', { kind: 'institution', id: 'new-1' },
    { name: 'Citadel', category: 'military' }), { id: 'd_gate', orderedAt: ORDERED_AT });
  rows = stage(rows, makeOp('send-force', { kind: 'phantom', id: PHANTOM },
    { counterparty: PHANTOM, strength: 3 }), { id: 'd_force', orderedAt: ORDERED_AT });
  rows = stage(rows, makeOp('set-institution-state', { kind: 'institution', id: INSTITUTION },
    { state: 'impaired' }), { id: 'd_state', orderedAt: ORDERED_AT });
  rows = stage(rows, makeOp('remove-institution', { kind: 'institution', id: INSTITUTION }, {}),
    { id: 'd_remove', orderedAt: ORDERED_AT });
  return rows;
}

/** A store with the REAL settlement slice, hydrated as opening a DRAFT library save. */
function makeStore() {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState((state) => {
    state.settlement = { ...structuredClone(fixture()), decrees: registryOf() };
    state.savedSettlements = [{
      id: SAVE_ID, name: 'Stoneford', tier: 'city', settlement: structuredClone(fixture()),
      campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
      timestamp: '2020-01-01T00:00:00.000Z',
    }];
    state.activeSaveId = SAVE_ID;
    state.phase = 'draft';
  });
  return store;
}

/** EM-C3's real rule set with the two real injected writers: the caller's act, as ruled. */
const RULE_SET = makeGuardRuleSet({ checkStructuralValidity, renormalizeFactionPower });

/** The live verdict over the store's own registry and record — the engine, never a fixture. */
const verdictOf = (store) => evaluateGuards(
  selectDecrees(store.getState()), store.getState().settlement, OP_TYPES, RULE_SET,
);

/** One finding of that verdict, addressed the way a reader addresses it: by its own id. */
const guardById = (store, id) => verdictOf(store).guards.find((guard) => guard.id === id);

/** The live registry as the STORE holds it, and one row of it. */
const live = (store) => selectDecrees(store.getState());
const rowOf = (store, id) => live(store).find((row) => row.id === id);

/** The DM's list order, which is the order `reorder` itself addresses and the tick applies. */
const pendingIds = (store) => [...live(store)]
  .filter((row) => row.status === 'pending')
  .sort((a, b) => (a.orderIndex - b.orderIndex) || compareCodepoint(a.id, b.id))
  .map((row) => row.id);

/** The live pool catalogue a fulfil resolves against, read from the producer. */
const poolsFor = (store) => ({
  'institution.class': poolValues('institution.class', store.getState().settlement),
});

/** The three guard ids this suite acts on, asserted present before anything is taken. */
const GATE = 'prerequisite:d_gate:-:gate';
const SEQUENCE = 'connection:d_force:-:sequence';
const CLASH = 'contradiction:d_remove:d_state:-';
const RELATED = 'connection:d_gate:d_remove:related';

const take = (store, request) => takeGuardOffer(store.getState, store.setState, request);
/** One offer on one real finding, addressed by the guard's own `entryId`. */
const offerOn = (store, guardId, offer, extra = {}) => {
  const guard = guardById(store, guardId);
  return take(store, { saveId: SAVE_ID, entryId: guard.entryId, guard, offer, ...extra });
};

describe('EM-C4c — the guard offers writer', () => {
  it('C4c-1 — MAIN: the act table is SET-EQUAL in both directions to EM-C2 seven offers, proceed records the guard OWN id on the entry through one write site, exactly that finding reads overridden, and the proceeded entry still applies at the tick', () => {
    // (i) TOTALITY. An offer the engine can mint and this door cannot act on would show up
    //     here rather than falling silently through the dispatch.
    const declared = Object.keys(GUARD_OFFER_ACTS).sort(compareCodepoint);
    const minted = [...GUARD_OFFERS].sort(compareCodepoint);
    expect(declared.length).toBe(GUARD_OFFERS.length);
    expect(declared).toEqual(minted);
    expect(declared.filter((offer) => !minted.includes(offer))).toEqual([]);
    expect(minted.filter((offer) => !declared.includes(offer))).toEqual([]);

    // (ii) THE POPULATION, asserted before any claim is made over it: the four findings the
    //      real rule set makes about this world, each carrying `proceed` as EM-C2 guarantees.
    const store = makeStore();
    const found = verdictOf(store);
    expect(found.guards.map((guard) => guard.id).sort(compareCodepoint))
      .toEqual([CLASH, RELATED, SEQUENCE, GATE].sort(compareCodepoint));
    expect(found.guards.filter((guard) => !guard.offers.includes(PROCEED))).toEqual([]);
    expect(found.guards.filter((guard) => guard.overridden !== false)).toEqual([]);
    expect([...found.unevaluated]).toEqual([]);

    // (iii) PROCEED IS A WRITE. The guard's own minted id lands on the entry, the stored
    //       registry IS the returned array, and nothing else about the entry moved.
    const clash = guardById(store, CLASH);
    const before = rowOf(store, clash.entryId);
    const result = offerOn(store, CLASH, PROCEED);
    expect(result.ok).toBe(true);
    expect([result.offer, result.entryId, result.decreeId]).toEqual([PROCEED, 'd_remove', null]);
    expect(store.getState().settlement.decrees).toBe(result.decrees);
    const after = rowOf(store, clash.entryId);
    expect(after.overrode).toEqual([CLASH]);
    expect([after.status, after.orderIndex, after.orderedAt])
      .toEqual([before.status, before.orderIndex, before.orderedAt]);
    expect(after.op).toEqual(before.op);

    // (iv) THE FINDING STANDS, MARKED — kept in the verdict and never dropped, so the DM's
    //      word sits beside the guard's and a surface may hide what it could never recover.
    const marked = verdictOf(store);
    expect(marked.guards.map((guard) => [guard.id, guard.overridden]).sort())
      .toEqual([[CLASH, true], [RELATED, false], [SEQUENCE, false], [GATE, false]].sort());
    expect(marked.guards.find((guard) => guard.id === CLASH).offers).toEqual(clash.offers);

    // (v) IDEMPOTENT, and KEEP BOTH is the same act: recording one guard twice leaves one id.
    expect(offerOn(store, CLASH, PROCEED).ok).toBe(true);
    expect(offerOn(store, CLASH, KEEP_BOTH).ok).toBe(true);
    expect(rowOf(store, 'd_remove').overrode).toEqual([CLASH]);

    // (vi) AND THE PROCEEDED ENTRY APPLIES. Nothing refused it, the override survives the
    //      application, and the guards — which judge PENDING entries — stop speaking for it.
    const applied = markDecreeApplied(store.getState, store.setState, {
      saveId: SAVE_ID, entryId: 'd_remove', meta: { appliedAt: ORDERED_AT, tickRef: 'tick_1' },
    });
    expect(applied.ok).toBe(true);
    expect(rowOf(store, 'd_remove').status).toBe('applied');
    expect(rowOf(store, 'd_remove').overrode).toEqual([CLASH]);
    expect(verdictOf(store).guards.filter((guard) => guard.entryId === 'd_remove')).toEqual([]);
  });

  it('C4c-2 — CLASH: keep the first withdraws the entry the guard JUDGED and keep the last withdraws the one it NAMES, each kept for the record with its own order index and with no withdrawal reason, which is what says the DM did it by hand', () => {
    const rows = [];

    const first = makeStore();
    const beforeFirst = live(first).map((row) => [row.id, row.status, row.orderIndex]);
    const keptFirst = offerOn(first, CLASH, KEEP_FIRST);
    rows.push(['keepFirst', keptFirst.ok, keptFirst.decreeId,
      rowOf(first, 'd_remove').status, rowOf(first, 'd_state').status,
      Object.hasOwn(rowOf(first, 'd_remove'), 'withdrawnReason'),
      rowOf(first, 'd_remove').orderIndex, live(first).length]);

    const last = makeStore();
    const keptLast = offerOn(last, CLASH, KEEP_LAST);
    rows.push(['keepLast', keptLast.ok, keptLast.decreeId,
      rowOf(last, 'd_state').status, rowOf(last, 'd_remove').status,
      Object.hasOwn(rowOf(last, 'd_state'), 'withdrawnReason'),
      rowOf(last, 'd_state').orderIndex, live(last).length]);

    // ONE TABLE, ONE ASSERTION: the judged entry goes on keepFirst, the named one on
    // keepLast, the survivor stays pending, the withdrawal is bare, the index is the one the
    // entry already held, and application never deleted a row (design 2.5a).
    expect(rows).toEqual([
      ['keepFirst', true, null, 'withdrawn', 'pending', false, beforeFirst[3][2], 4],
      ['keepLast', true, null, 'withdrawn', 'pending', false, beforeFirst[2][2], 4],
    ]);
    // anchored: the same four rows are read on both stores above, so these two orders are a
    // permutation of a live registry rather than the emptiness of a lookup that found nothing.
    expect(beforeFirst.map((row) => row[1])).toEqual(['pending', 'pending', 'pending', 'pending']);
    expect(pendingIds(first)).toEqual(['d_gate', 'd_force', 'd_state']);
    expect(pendingIds(last)).toEqual(['d_gate', 'd_force', 'd_remove']);
  });

  it('C4c-3 — FULFIL: the guard own op, completed by the DM, is staged as the GUARD entry immediately before the entry it serves — through EM-E8 binder for an add-op and through the catalogue own constructor otherwise — and a seed the catalogue cannot express is refused in the catalogue own words with nothing staged', () => {
    // (i) THE ADD ROUTE. The gate finding's fulfil names an institution the town lacks; the
    //     seed carries its NAME and the DM supplies the pooled `category` the row requires.
    const store = makeStore();
    const gate = guardById(store, GATE);
    // ⛔ RE-RECORDED, CAUSE MEASURED (U65, 5bd3271cf on this lineage): the fulfil op is no
    //    longer written beside the rule but SHAPED BY THE CATALOGUE ROW — the row's own
    //    declared target kind against the id the offer is about, and exactly the fields the
    //    row declares. `name` is the value the FINDING computed; `category` is the value THE
    //    ENTRY carries under the same name, and `d_gate` above stages `category: 'military'`.
    //    U65 declared this shift as a count (12 fulfil ops minted / 0 accepted by `validateOp`
    //    to 8 of 8) and named no pin, so the old two-key shape survived here. Planted back,
    //    U65's pre-image answers `{ type, payload: { name } }` again. The arm's INTENT is
    //    unmoved: the seed still names the institution the town lacks, and the DM still
    //    supplies the pooled `category` below.
    expect(gate.fulfil).toEqual({
      type: 'add-institution',
      target: { kind: 'institution', id: 'City walls and gates' },
      payload: { category: 'military', name: 'City walls and gates' },
    });
    expect(gate.offers).toEqual([FULFIL, SELF, PROCEED]);
    const category = poolsFor(store)['institution.class'][0];
    const staged = offerOn(store, GATE, FULFIL, {
      values: { category }, pools: poolsFor(store), orderedAt: ORDERED_AT,
    });
    expect(staged.ok).toBe(true);
    const minted = rowOf(store, staged.decreeId);
    expect([minted.op.type, minted.addedBy, minted.status])
      .toEqual(['add-institution', DECREE_AUTHORS[1], 'pending']);
    expect(minted.op.payload).toEqual({ name: 'City walls and gates', category });
    // PLACED BEFORE THE ENTRY IT SERVES, in the list `reorder` itself addresses.
    expect(pendingIds(store)).toEqual([staged.decreeId, 'd_gate', 'd_force', 'd_state', 'd_remove']);
    expect(staged.decrees).toBe(store.getState().settlement.decrees);

    // (ii) THE NON-ADD ROUTE. The sequence finding's fulfil is an op that mints nobody, so
    //      its subject and its entry id are the caller's, exactly as `stage` contracts.
    const other = makeStore();
    const sequence = guardById(other, SEQUENCE);
    // RE-RECORDED, SAME CAUSE (U65): the row's one REQUIRED `ref` field is filled from the
    // value this entry already carries, and the target is the row's own declared kind against
    // the offer's id. `casusBelli` is not required, so the row does not declare it here.
    expect(sequence.fulfil).toEqual({
      type: 'declare-war',
      target: { kind: 'phantom', id: PHANTOM },
      payload: { counterparty: PHANTOM },
    });
    const war = offerOn(other, SEQUENCE, FULFIL, {
      values: { counterparty: PHANTOM },
      target: { kind: 'phantom', id: PHANTOM },
      id: 'd_war',
      orderedAt: ORDERED_AT,
    });
    expect(war.ok).toBe(true);
    expect(war.decreeId).toBe('d_war');
    expect([rowOf(other, 'd_war').op.type, rowOf(other, 'd_war').addedBy])
      .toEqual(['declare-war', DECREE_AUTHORS[1]]);
    expect(pendingIds(other)).toEqual(['d_gate', 'd_war', 'd_force', 'd_state', 'd_remove']);

    // (iii) THE SEED IS AN OP THE DM HAS NOT ANSWERED FOR. Taken with no completion, the same
    //       offer is refused in the CATALOGUE's own words and the registry is byte-identical.
    //       RE-RECORDED, SAME CAUSE (U65): before it, the seed was catalogue-INCOMPLETE and the
    //       refusal was `invalid_op` ('payload.category is required'). Now the field is present
    //       and carries the ENTRY's own 'military', which `institution.class` does not offer —
    //       so the door answers design 20.3 ruling 3's `stale_vocabulary` and hands back EM-C1's
    //       own `{ missing, was }` pair verbatim. MEASURED: U81 is NOT the mover here; with
    //       pools.js planted at its pre-U81 image the answer is `stale_vocabulary` on the same
    //       'military' word, because that lowercase PRIORITY CATEGORY was never a member of this
    //       pool under either reading of the table. The claim the arm makes is untouched: a
    //       completion the catalogue cannot accept stages nothing.
    const bare = makeStore();
    const before = JSON.stringify(bare.getState().settlement);
    const refused = offerOn(bare, GATE, FULFIL, { pools: poolsFor(bare), orderedAt: ORDERED_AT });
    expect(refused).toEqual({ ok: false, reason: 'stale_vocabulary', errors: ['pool-value', 'military'] });
    expect(JSON.stringify(bare.getState().settlement)).toBe(before);
    expect(live(bare).length).toBe(4);
  });

  it('C4c-4 — COUNTERFORCE: every refusal this door can make is a member of one closed exported set, the set is SET-EQUAL in both directions to the reasons it actually produced, and each refusal leaves the settlement byte-identical with no entry staged, withdrawn or overridden', () => {
    const store = makeStore();
    const before = JSON.stringify(store.getState().settlement);
    const clash = guardById(store, CLASH);
    const gate = guardById(store, GATE);
    const sequence = guardById(store, SEQUENCE);

    // The two shapes the catalogue does not reach today, each derived from a REAL finding by
    // dropping exactly one field: a fulfil offer with no op (a declaration owing two registry
    // types) and a clash offer with no related entry. Named here so no refusal below is
    // unreachable, which would make its row a claim nobody has proven.
    const noOp = { ...sequence, fulfil: null };
    const noRelated = { ...clash, relatedEntryId: null };

    const attempts = [
      ['no_save', { saveId: 'save-9', entryId: clash.entryId, guard: clash, offer: PROCEED }],
      ['unknown_offer', { saveId: SAVE_ID, entryId: clash.entryId, guard: clash, offer: 'constructor' }],
      ['unknown_guard', { saveId: SAVE_ID, entryId: clash.entryId, guard: null, offer: PROCEED }],
      ['unknown_guard', { saveId: SAVE_ID, entryId: gate.entryId, guard: gate, offer: KEEP_LAST }],
      ['unknown_entry', { saveId: SAVE_ID, entryId: 'd_force', guard: clash, offer: PROCEED }],
      ['unknown_entry', { saveId: SAVE_ID, entryId: noRelated.entryId, guard: noRelated, offer: KEEP_LAST }],
      ['no_writer', { saveId: SAVE_ID, entryId: gate.entryId, guard: gate, offer: SELF }],
      ['no_writer', {
        saveId: SAVE_ID,
        entryId: 'd_gate',
        guard: verdictOf(store).guards.find((each) => each.offers.includes(REORDER)),
        offer: REORDER,
      }],
      ['no_fulfil', { saveId: SAVE_ID, entryId: noOp.entryId, guard: noOp, offer: FULFIL }],
      // ⛔ `invalid_op` IS STILL REACHABLE, AND THIS ROW IS WHY THE ROW BELOW COULD MOVE AT
      //    ALL. The row that used to reach it — the fulfil taken with NO completion — no
      //    longer can, because U65 gave the seed its catalogue-COMPLETE payload; so the
      //    attempt written for this refusal is now a DM value the row does not declare,
      //    which `validateOp` convicts in its own words BEFORE the resolver is consulted.
      //    Without it the closed-set assertions at the foot of this arm would pass
      //    vacuously on nine reasons while the door can still produce ten.
      ['invalid_op', {
        saveId: SAVE_ID, entryId: gate.entryId, guard: gate, offer: FULFIL,
        values: { shares: 'half' }, pools: poolsFor(store),
      }],
      // ⛔ RE-RECORDED, CAUSE MEASURED (U65, 5bd3271cf on this lineage): this row was written
      //    for `invalid_op` — the DM completes nothing, and the catalogue answers that the
      //    required `category` is absent. U65 shaped every `fulfil` from the catalogue row,
      //    filling a field the rule does not compute from the value THE ENTRY carries, and
      //    `d_gate` stages `category: 'military'`. The field is therefore present and the
      //    catalogue has no absence to report; what it reports instead is that the word is
      //    not one `institution.class` offers, which is design 20.3 ruling 3 exactly — an act
      //    whose pooled word the live vocabulary no longer holds is refused, never applied
      //    best-effort. Planted back, U65's pre-image answers `invalid_op` here again; and
      //    with pools.js planted at its pre-U81 image the answer is STILL `stale_vocabulary`
      //    on the same word, so U81 is not the mover and the door has no defect to cure.
      ['stale_vocabulary', { saveId: SAVE_ID, entryId: gate.entryId, guard: gate, offer: FULFIL, pools: poolsFor(store) }],
      ['stale_vocabulary', {
        saveId: SAVE_ID, entryId: gate.entryId, guard: gate, offer: FULFIL,
        values: { category: 'a word no pool holds' }, pools: poolsFor(store),
      }],
      ['not_staged', {
        saveId: SAVE_ID, entryId: sequence.entryId, guard: sequence, offer: FULFIL,
        values: { counterparty: PHANTOM }, target: { kind: 'phantom', id: PHANTOM }, id: 'd_force',
      }],
      ['unknown_target', {
        saveId: SAVE_ID, entryId: sequence.entryId, guard: sequence, offer: FULFIL,
        values: { counterparty: PHANTOM }, id: 'd_war',
      }],
    ];
    const outcomes = attempts.map(([wanted, request]) => {
      const answer = take(store, request);
      return [wanted, answer.ok, answer.reason, Array.isArray(answer.errors),
        JSON.stringify(store.getState().settlement) === before];
    });

    // ONE TABLE: each attempt answered with the reason it was written for, in the door's
    // shape, and left the record exactly where it was.
    expect(outcomes).toEqual(attempts.map(([wanted]) => [wanted, false, wanted, true, true]));
    expect(live(store).length).toBe(4);
    expect(live(store).filter((row) => Object.hasOwn(row, 'overrode'))).toEqual([]);

    // THE VOCABULARY, both directions and both sides DERIVED: a reason produced and not
    // declared, or declared and never produced, reds here.
    const produced = [...new Set(outcomes.map((row) => row[2]))].sort(compareCodepoint);
    const declaredRefusals = [...GUARD_OFFER_REFUSALS].sort(compareCodepoint);
    expect(produced.length).toBe(GUARD_OFFER_REFUSALS.length);
    expect(produced).toEqual(declaredRefusals);
    expect(produced.filter((reason) => !declaredRefusals.includes(reason))).toEqual([]);
    expect(declaredRefusals.filter((reason) => !produced.includes(reason))).toEqual([]);
  });
});
