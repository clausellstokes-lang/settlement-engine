/**
 * sealWriters.test.jsx — EM-E4d: THE SEALS' WRITERS, AND THE CONDITION THAT OPENS THEM
 * (design §13's verbs, §17's acts, §18's preconditions; the chair's judgment 296).
 *
 * THE CLAIM OF UNIT 1: design §17's acts were sixteen words on disabled controls, and the
 * one seal whose act AND whose counterparty the design itself fixes now has a writer — the
 * peace seal seals the standing offer, staged as a decree through the catalogue's own
 * constructor, the catalogue's own validator, EM-C1's own resolver and EM-C4b's ONE registry
 * write site. Every other seal stays shut, because a control whose click does nothing is
 * worse than one that is honestly closed.
 *
 * ⛔ EVERY SET THIS SUITE ITERATES IS IMPORTED FROM ITS PRODUCER — the refusal set, the seal
 * table, the off-stage catalogue, the condition roster — never re-typed here
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
import { DM_ID_NS } from '../../src/domain/edit/dmLayer.js';
import { OP_TYPES, validateOp } from '../../src/domain/edit/operations.js';
import { OFF_STAGE_OP_TYPES } from '../../src/domain/edit/operationsOffStage.js';
import { WORLD_CONDITIONS } from '../../src/domain/edit/worldConditions.js';
import {
  PEACE_OFFER_KEY, draftPeaceOffer, draftTerms, withPeaceOffer,
} from '../../src/domain/worldPulse/peaceTermsDrafting.js';
import { worldConditionsOf } from '../../src/store/phantomMintAction.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  ADD_OP_TYPES, SEAL_ACTS, SEAL_DECREE_REFUSALS,
  selectDecrees, stageAddDecreeIntent, stageSealDecreeIntent,
} from '../../src/store/editSlice.js';

const SAVE_ID = 'save-1';
const SEED = 'seed-ashford-1';
const ORDERED_AT = '2026-09-23T12:00:00.000Z';

/**
 * The seals this member binds, read OFF the table so a rename moves the suite with it. It is
 * a FUNCTION and not a module-level destructure on purpose: a tree with no table at all must
 * red these arms BY TITLE, not blow up at import and report "no tests".
 */
const boundSeals = () => Object.keys(SEAL_ACTS ?? {}).sort(compareCodepoint);
const firstBoundSeal = () => boundSeals()[0];

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

/**
 * ⛔ THE TERMS ARE THE DRAFTING TABLE'S OWN OUTPUT, never a hand-shaped bag: `draftPeaceOffer`
 * refuses a draft with no term at all, so an offer built by hand here could be `null` and
 * every arm below would be asserting over a record the tree would never write. The ranked
 * assets are EM-E4's own suite's (`tests/simulation/directorFork.test.js` E4-12).
 */
const DRAFTED = draftTerms({
  ranked: [{ termType: 'tribute', value: 10 }, { termType: 'reparations', value: 6 }],
  budget: 12, margin01: 0.7, press: 1, tick: 9,
});

/** One STANDING offer, from the producer, so a change to the offer's shape reds here. */
const offerFrom = (fromId) => draftPeaceOffer({
  fromId, toId: 'town.ashford', terms: DRAFTED.terms, budgetSpent: DRAFTED.budgetSpent, tick: 9,
});

/** A settlement carrying a seed, one person, and the standing offers a case asks for. */
function fixture(fromIds = []) {
  const record = {
    id: 'town.ashford', tier: 'town', name: 'Ashford', population: 1500, _seed: SEED,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    npcs: [{ id: 'npc.varn', name: 'Lord Varn', role: 'Reeve', status: 'active' }],
    institutions: [{ id: 'inst.market', name: 'Market', category: 'Market', role: 'Reeve' }],
    powerStructure: { factions: [{ id: 'fac.guild', faction: 'Merchant Guild', power: 100 }], conflicts: [] },
    history: { historicalEvents: [], currentTensions: [] },
  };
  // The key is written by the module's OWN writer, so the fixture's shape is the tree's.
  return fromIds.reduce((carried, id) => withPeaceOffer(carried, offerFrom(id)), record);
}

/** A store with the REAL settlement slice, hydrated as opening a DRAFT library save. */
function makeStore(fromIds = []) {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState((state) => {
    state.settlement = structuredClone(fixture(fromIds));
    state.savedSettlements = [{
      id: SAVE_ID, name: 'Ashford', tier: 'town', settlement: structuredClone(fixture(fromIds)),
      campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
      timestamp: '2020-01-01T00:00:00.000Z',
    }];
    state.activeSaveId = SAVE_ID;
    state.phase = 'draft';
  });
  return store;
}

/**
 * The seal door, driven on one store EXACTLY as the shell drives it: the counterparty is the
 * one the §18 reading named, so the suite cannot claim an agreement the surface would not make.
 */
function seal(store, request) {
  const named = worldConditionsOf(store.getState().settlement);
  const name = String(request.seal);
  // An own-key lookup, exactly as the door makes it: `constructor` is an unbound seal.
  const act = Object.hasOwn(SEAL_ACTS, name) ? SEAL_ACTS[name] : null;
  const subjects = act === null ? [] : named[act.needs].subjects;
  return stageSealDecreeIntent(store.getState, store.setState, {
    orderedAt: ORDERED_AT,
    counterparty: subjects.length === 1 ? subjects[0] : '',
    ...request,
  });
}

describe('EM-E4d — the seals get their writers', () => {
  it('E4d-1: the seal table is a MEASURED JOIN — every bound seal stages an OFF-STAGE catalogue act over a condition the roster declares, and the table is the estate\'s data shape', () => {
    expect(DRAFTED.terms.length, 'the drafting table stopped drafting, so every standing offer'
      + ' below is null and the whole suite is vacuous').toBeGreaterThan(0);
    const bound = boundSeals();
    // The table is anchored before anything is compared over it: an emptied table would make
    // every `bound.map(f)` vs `bound.map(g)` below vacuously green.
    expect(bound.length, 'the seal table is EMPTY, so the equalities below assert nothing')
      .toBeGreaterThan(0);

    // (i) EVERY BOUND SEAL'S ACT IS A ROW THE CATALOGUE DECLARES, and an OFF-STAGE one:
    //     design §13's verbs are exactly the off-stage family, and a seal that staged a HOME
    //     op would be acting on this town rather than on a counterparty.
    const types = bound.map((name) => SEAL_ACTS[name].type);
    expect(types.map((type) => Object.hasOwn(OP_TYPES, type))).toEqual(bound.map(() => true));
    expect(types.map((type) => Object.hasOwn(OFF_STAGE_OP_TYPES, type)))
      .toEqual(bound.map(() => true));

    // (ii) EVERY BOUND SEAL'S CONDITION IS A ROW THE WORLD-CONDITION ROSTER DECLARES, so a
    //      condition renamed there cannot leave a seal opening on a fact nothing answers.
    const needs = bound.map((name) => SEAL_ACTS[name].needs);
    expect(needs.map((id) => Object.hasOwn(WORLD_CONDITIONS, id))).toEqual(bound.map(() => true));

    // (iii) AND EVERY BOUND SEAL'S CONDITION NAMES ITS SUBJECTS. A seal whose act takes a
    //       counterparty cannot be written from a boolean, so the row it opens on must be one
    //       that answers WHO — which is the property that makes an open seal always writable.
    const read = worldConditionsOf(fixture(['town.harrow']));
    expect(needs.map((id) => read[id].subjects.length)).toEqual(bound.map(() => 1));
    expect(needs.map((id) => read[id].holds)).toEqual(bound.map(() => true));

    // (iv) THE TABLE IS FROZEN DATA, row and all, as ADD_OP_TYPES is.
    expect(Object.isFrozen(SEAL_ACTS)).toBe(true);
    expect(bound.map((name) => Object.isFrozen(SEAL_ACTS[name]))).toEqual(bound.map(() => true));
  });

  it('E4d-2: the peace seal SEALS THE STANDING OFFER — one pending entry, the catalogue\'s own op, the offer\'s own counterparty, through the one registry write site', () => {
    const store = makeStore(['town.harrow']);
    expect(selectDecrees(store.getState()), 'the registry starts empty, or the count below is'
      + ' not this act\'s').toEqual([]);

    const answer = seal(store, { seal: firstBoundSeal() });
    expect(answer.ok).toBe(true);

    const rows = selectDecrees(store.getState());
    expect(rows.length).toBe(1);
    const entry = rows[0];
    expect(entry.id).toBe(answer.decreeId);
    expect(entry.status).toBe('pending');
    expect(entry.addedBy).toBe('dm');
    expect(entry.orderedAt).toBe(ORDERED_AT);
    expect(String(entry.id).startsWith(DM_ID_NS)).toBe(true);

    // THE OP IS THE CATALOGUE'S OWN, and it is the counterparty the OFFER named.
    expect(entry.op.type).toBe(SEAL_ACTS[firstBoundSeal()].type);
    expect(entry.op.target).toEqual({ kind: OP_TYPES[entry.op.type].target, id: 'town.harrow' });
    expect(entry.op.payload.counterparty).toBe('town.harrow');
    expect(entry.op.stage).toBe(OP_TYPES[entry.op.type].stage);
    expect(entry.op.consequence).toBe(OP_TYPES[entry.op.type].consequence);
    expect(validateOp(entry.op, null).errors).toEqual([]);

    // AND NOTHING ELSE MOVED: the act is a registry row, never a world fact. The standing
    // offer is still standing, because withdrawing it is the TICK's to do and not this door's.
    expect(store.getState().settlement[PEACE_OFFER_KEY]['town.harrow'].fromId).toBe('town.harrow');
    expect(store.getState().settlement.dmLayer).toBe(undefined);
  });

  it('E4d-3: no standing offer and SEVERAL standing offers each stage NOTHING, because a seal writes about the counterparty its own condition named', () => {
    const collected = [['town.harrow', 'town.dunmere'], []].map((fromIds) => {
      const store = makeStore(fromIds);
      const answer = seal(store, { seal: firstBoundSeal() });
      return { ok: answer.ok, reason: answer.reason, rows: selectDecrees(store.getState()).length };
    });
    expect(collected).toEqual([
      { ok: false, reason: 'unknown_target', rows: 0 },
      { ok: false, reason: 'unknown_target', rows: 0 },
    ]);
  });

  it('E4d-4: the door\'s refusals are its own closed set, every reachable one driven, and nothing is staged by any of them', () => {
    const noWriter = makeStore(['town.harrow']);
    const noSave = makeStore(['town.harrow']);
    noSave.setState((state) => { state.activeSaveId = null; });
    const noSeed = makeStore(['town.harrow']);
    noSeed.setState((state) => { delete state.settlement._seed; });

    const driven = [
      // A seal the table carries no row for, and the prototype's own member, which is an
      // unbound seal like any other because the lookup is an own-key one.
      [noWriter, { seal: 'suePeace' }],
      [noWriter, { seal: 'constructor' }],
      [noWriter, { seal: '' }],
      [noSave, { seal: firstBoundSeal() }],
      [noSeed, { seal: firstBoundSeal() }],
    ].map(([store, request]) => {
      const answer = seal(store, request);
      return { reason: answer.reason, rows: selectDecrees(store.getState()).length };
    });
    expect(driven).toEqual([
      { reason: 'no_writer', rows: 0 },
      { reason: 'no_writer', rows: 0 },
      { reason: 'no_writer', rows: 0 },
      { reason: 'no_save', rows: 0 },
      { reason: 'no_seed', rows: 0 },
    ]);

    // THE SET IS CLOSED IN BOTH DIRECTIONS against the words this door can answer, and it is
    // frozen and in codepoint order, as the two doors beside it are.
    expect([...SEAL_DECREE_REFUSALS].sort(compareCodepoint)).toEqual([...SEAL_DECREE_REFUSALS]);
    expect(Object.isFrozen(SEAL_DECREE_REFUSALS)).toBe(true);
    const answered = [...new Set([...driven.map((row) => row.reason), 'unknown_target'])];
    expect(answered.filter((reason) => !SEAL_DECREE_REFUSALS.includes(reason))).toEqual([]);
  });

  it('E4d-5: two seal acts take two entry ids, and the add door\'s own minted identity is UNMOVED by the shared walk', () => {
    // The seal door's claim set is every ENTRY id, so a second act cannot re-use the first's
    // address — which `stage` would answer by returning the rows unchanged.
    const store = makeStore(['town.harrow']);
    const first = seal(store, { seal: firstBoundSeal() });
    const second = seal(store, { seal: firstBoundSeal() });
    expect([first.ok, second.ok]).toEqual([true, true]);
    expect(first.decreeId === second.decreeId).toBe(false);
    expect(selectDecrees(store.getState()).length).toBe(2);

    // ⛔ AND THE NEWCOMER'S ID IS A FUNCTION OF WHAT THE ADD DOOR CLAIMS, WHICH IS THE ADD-OPS'
    //    OWN TARGETS AND NOTHING ELSE. A registry full of seal entries must therefore mint the
    //    SAME newcomer as an empty one: the two doors share ONE walk and keep TWO claim sets,
    //    so no identity this estate already minted moves by this member.
    const card = Object.keys(ADD_OP_TYPES).sort(compareCodepoint)[0];
    const values = { faction: 'The Ashen Hand', category: 'Guild' };
    const clean = makeStore();
    const onEmpty = stageAddDecreeIntent(clean.getState, clean.setState, {
      cardType: card, values, pools: { 'faction.category': ['Guild'] }, orderedAt: ORDERED_AT,
    });
    const afterSeals = stageAddDecreeIntent(store.getState, store.setState, {
      cardType: card, values, pools: { 'faction.category': ['Guild'] }, orderedAt: ORDERED_AT,
    });
    expect([onEmpty.ok, afterSeals.ok]).toEqual([true, true]);
    expect(afterSeals.decreeId).toBe(onEmpty.decreeId);
  });

  it('E4d-6: the §18 reading is bound in the STORE, answers every row of the roster, and is honest about the campaign it does not have', () => {
    const read = worldConditionsOf(fixture(['town.harrow']));
    const ids = Object.keys(WORLD_CONDITIONS).sort(compareCodepoint);
    expect(ids.length, 'the condition roster is EMPTY, so the equalities below assert nothing')
      .toBeGreaterThan(0);
    expect(Object.keys(read).sort(compareCodepoint)).toEqual(ids);
    expect(ids.map((id) => typeof read[id].holds)).toEqual(ids.map(() => 'boolean'));
    expect(ids.map((id) => Array.isArray(read[id].subjects))).toEqual(ids.map(() => true));

    // ⛔ THE CAMPAIGN HALF IS ABSENT AT THIS MOUNT AND IS NOT FAKED. Only the rows that read
    // the RECORD alone can answer here, which is exactly why the surface must never present a
    // campaign-reading row's `false` as a finding about the world.
    const answered = ids.filter((id) => read[id].holds);
    expect(answered).toEqual(['npcPresent', 'pendingPeaceOffer']);
    // And the bound seal's row is one of them, so an open seal is always a real reading.
    expect(answered.includes(SEAL_ACTS[firstBoundSeal()].needs)).toBe(true);

    // MEMOIZED ON THE RECORD BY IDENTITY: the same record gives the same frozen value back,
    // and a different record does not.
    const record = fixture(['town.harrow']);
    expect(worldConditionsOf(record)).toBe(worldConditionsOf(record));
    expect(worldConditionsOf(fixture([])) === worldConditionsOf(record)).toBe(false);
    expect(Object.isFrozen(worldConditionsOf(record))).toBe(true);
    // A record with no offer answers the empty list rather than null, and never a throw.
    expect(worldConditionsOf(null).pendingPeaceOffer).toEqual({ holds: false, subjects: [] });
  });
});
