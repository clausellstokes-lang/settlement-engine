/**
 * addDecreeIntent.test.js — EM-E8 case A: the store binder from a CREATE intent to an
 * `add-<card>` decree (design §12's ops, §2.5's registry, §22.3 ruling 9's newcomer).
 *
 * THE CLAIM: a card type and the values a DM typed become ONE pending registry entry whose
 * op passes the catalogue's own validator and whose target is a stable, unique `dm:minted:`
 * id; an undeclared payload key or a value outside its pool is refused in the CATALOGUE's
 * own words with nothing staged; and the read shape a CREATE door renders from names the
 * catalogue's payload fields without the door importing the catalogue.
 *
 * ⛔ EVERY SET THIS SUITE ITERATES IS IMPORTED FROM ITS PRODUCER — the refusal set, the card
 * table, the op catalogue, the pool catalogue — never re-typed here
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
import { declarationsFor } from '../../src/domain/edit/fieldDeclarations.js';
import { makeOp, OP_TYPES, validateOp } from '../../src/domain/edit/operations.js';
import { poolValues } from '../../src/domain/edit/pools.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  ADD_DECREE_REFUSALS,
  ADD_OP_TYPES,
  addOpPayloadFor,
  selectDecrees,
  stageAddDecreeIntent,
} from '../../src/store/editSlice.js';

const SAVE_ID = 'save-1';
const SEED = 'seed-ashford-1';
const ORDERED_AT = '2026-09-23T12:00:00.000Z';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

/** A settlement carrying a seed, a roster for each of the three add-cards, and no layer. */
function fixture() {
  return {
    id: 'town.ashford', tier: 'town', name: 'Ashford', population: 1500, _seed: SEED,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    npcs: [{ id: 'npc.varn', name: 'Lord Varn', role: 'Reeve', status: 'active' }],
    institutions: [{ id: 'inst.market', name: 'Market', category: 'Market', role: 'Reeve' }],
    powerStructure: { factions: [{ id: 'fac.guild', faction: 'Merchant Guild', power: 100 }], conflicts: [] },
    history: { historicalEvents: [], currentTensions: [] },
  };
}

/** A store with the REAL settlement slice, hydrated as opening a DRAFT library save. */
function makeStore() {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState((state) => {
    state.settlement = structuredClone(fixture());
    state.savedSettlements = [{
      id: SAVE_ID, name: 'Ashford', tier: 'town', settlement: structuredClone(fixture()),
      campaignState: { phase: 'draft', eventLog: [], systemState: {}, editedAt: null },
      timestamp: '2020-01-01T00:00:00.000Z',
    }];
    state.activeSaveId = SAVE_ID;
    state.phase = 'draft';
  });
  return store;
}

/** The LIVE pool catalogue for the pools a card's add-op names, read from its producer. */
function poolsFor(cardType, world) {
  const named = addOpPayloadFor(cardType)
    .filter((row) => typeof row.pool === 'string')
    .map((row) => row.pool);
  return Object.fromEntries(named.map((pool) => [pool, poolValues(pool, world)]));
}

/** Drive the binder exactly as a CREATE door would. */
const stageAdd = (store, request) => stageAddDecreeIntent(store.getState, store.setState, request);

/** One well-formed intent for the NPC card: a free name and a live `npc.role` value. */
function npcIntent(world, overrides = {}) {
  const roles = poolValues('npc.role', world);
  return {
    cardType: 'npc',
    values: { name: 'Alda', role: roles[0] },
    pools: poolsFor('npc', world),
    orderedAt: ORDERED_AT,
    ...overrides,
  };
}

describe('EM-E8 A — the store binder stages a new roster row as an add-decree', () => {
  it('A1 stages ONE pending decree whose op passes the catalogue\'s own validator, on a stable dm: id', () => {
    const store = makeStore();
    const world = store.getState().settlement;
    const before = selectDecrees(store.getState());
    const result = stageAdd(store, npcIntent(world));
    const after = selectDecrees(store.getState());

    expect(before.length, 'the registry was empty before the act, or the count below proves nothing')
      .toBe(0);
    expect(result.ok, 'the binder accepted a well-formed CREATE intent').toBe(true);
    expect(after.length, 'EXACTLY ONE entry was staged').toBe(1);
    expect(after[0].id, 'the entry carries the id the binder returned').toBe(result.decreeId);
    expect(after[0].status, 'and it is PENDING, waiting for the tick').toBe('pending');
    expect(after[0].addedBy, 'staged by the table\'s own hand').toBe('dm');
    expect(after[0].orderedAt, 'the caller\'s stamp, never a second clock read').toBe(ORDERED_AT);
    expect(result.op.type, 'the op is the catalogue\'s add row for this card')
      .toBe(ADD_OP_TYPES.npc);
    expect(result.op.target, 'the target names the card kind and the newcomer\'s id')
      .toEqual({ kind: 'npc', id: result.decreeId });
    expect(validateOp(result.op, null), 'and the CATALOGUE\'s own validator passes it clean')
      .toEqual({ ok: true, errors: [] });
    expect(result.decreeId.startsWith(`${DM_ID_NS}minted:`),
      'the id is minted inside the layer\'s own identity namespace, never invented').toBe(true);
  });

  it('A2 refuses an undeclared payload key and a value outside its pool in the CATALOGUE\'s own words, staging nothing', () => {
    const store = makeStore();
    const world = store.getState().settlement;
    const withColour = { name: 'Alda', role: poolValues('npc.role', world)[0], colour: 'blue' };
    const undeclared = stageAdd(store, npcIntent(world, { values: withColour }));
    const afterUndeclared = selectDecrees(store.getState());
    const outsidePool = stageAdd(store, npcIntent(world, { values: { name: 'Alda', role: 'a role no pool holds' } }));
    const afterOutside = selectDecrees(store.getState());
    const noPools = stageAdd(store, npcIntent(world, { pools: {} }));
    const unknownCard = stageAdd(store, npcIntent(world, { cardType: 'dragon' }));
    const noSaveStore = makeStore();
    noSaveStore.setState((state) => { state.activeSaveId = null; });
    const noSave = stageAdd(noSaveStore, npcIntent(world));

    // anchored: A1 above stages a decree through this very binder on this very fixture, so a
    // refusal here is the guard firing and not a binder that can never stage anything.
    expect([undeclared.ok, outsidePool.ok, noPools.ok, unknownCard.ok], 'every hostile intent is REFUSED')
      .toEqual([false, false, false, false]);
    expect([afterUndeclared.length, afterOutside.length], 'and NOTHING was staged by either')
      .toEqual([0, 0]);
    expect(undeclared.reason, 'an undeclared key is the OP\'s own fault').toBe('invalid_op');
    expect(undeclared.errors, 'and the reason travels VERBATIM from validateOp, never re-worded here')
      .toEqual(validateOp(makeOp(ADD_OP_TYPES.npc, { kind: 'npc', id: 'probe' }, withColour), null).errors);
    expect([outsidePool.reason, noPools.reason], 'a pooled value the catalogue cannot vouch for is STALE VOCABULARY')
      .toEqual(['stale_vocabulary', 'stale_vocabulary']);
    expect(outsidePool.errors[0], 'and EM-C1\'s own missing-kind word names what moved')
      .toBe('pool-value');
    expect(outsidePool.errors[1], 'with the offending word itself').toBe('a role no pool holds');
    expect(noPools.errors[1], 'an unserved pool names the POOL, which is what the caller owes')
      .toBe('npc.role');
    expect(unknownCard.reason, 'a card with no add-op is an unknown target').toBe('unknown_target');
    expect(noSave.reason, 'and a store with no active save refuses before it reads a record')
      .toBe('no_save');
  });

  it('A3 mints two DISTINCT stable ids on one save, and the same inputs mint the same id', () => {
    const store = makeStore();
    const world = store.getState().settlement;
    const first = stageAdd(store, npcIntent(world));
    const second = stageAdd(store, npcIntent(world, { values: { name: 'Bern', role: poolValues('npc.role', world)[0] } }));
    const replay = stageAdd(makeStore(), npcIntent(world));
    const rows = selectDecrees(store.getState());

    expect([first.ok, second.ok, replay.ok], 'all three acts were accepted').toEqual([true, true, true]);
    expect(first.decreeId === second.decreeId,
      'two mints on ONE save are two DIFFERENT people: a pending entry claims its id, so the'
      + ' second cannot read the layer\'s count and collide').toBe(false);
    expect(replay.decreeId, 'the SAME inputs on the same save state mint the SAME id')
      .toBe(first.decreeId);
    expect(rows.map((row) => row.id), 'and both entries are in the registry, in staging order')
      .toEqual([first.decreeId, second.decreeId]);
    expect(rows.map((row) => row.orderIndex), 'each keeping its own place').toEqual([0, 1]);
  });

  it('A4 binds the THREE add-ops set-equal to the catalogue, and the CREATE read shape is the catalogue\'s payload', () => {
    const catalogueAdds = Object.keys(OP_TYPES).filter((type) => type.startsWith('add-')).sort(compareCodepoint);
    const bound = Object.values(ADD_OP_TYPES).slice().sort(compareCodepoint);
    const npcRows = addOpPayloadFor('npc');
    const declaredNpcFields = declarationsFor('npc').map((row) => row.field);

    expect(bound, 'the store\'s card table names EXACTLY the catalogue\'s add rows, both directions')
      .toEqual(catalogueAdds);
    expect(Object.keys(ADD_OP_TYPES).every((card) => declarationsFor(card).length > 0),
      'and every bound card is one EM-A1 declares fields for').toBe(true);
    expect(npcRows.map((row) => row.field), 'the read shape names the catalogue\'s payload fields, codepoint order')
      .toEqual(Object.keys(OP_TYPES[ADD_OP_TYPES.npc].payload).sort(compareCodepoint));
    expect(npcRows.map((row) => row.kind), 'carrying each field\'s declared kind')
      .toEqual(npcRows.map((row) => OP_TYPES[ADD_OP_TYPES.npc].payload[row.field].kind));
    expect(npcRows.filter((row) => typeof row.pool === 'string').map((row) => row.pool),
      'and the POOL NAME for every pooled field, which is the door\'s contract')
      .toEqual(Object.values(OP_TYPES[ADD_OP_TYPES.npc].payload)
        .filter((spec) => typeof spec.pool === 'string').map((spec) => spec.pool));
    expect(npcRows.every((row) => declaredNpcFields.includes(row.field)),
      'every payload field is a field the card itself declares').toBe(true);
    // anchored: the rows above are non-empty, so the empty answer below is the unknown-card
    // branch and not a reader that always answers nothing.
    expect(npcRows.length).toBeGreaterThan(0);
    expect(addOpPayloadFor('dragon'), 'a card with no add-op reads as the shared empty array').toEqual([]);
  });

  it('A5 carries EXACTLY the exported refusal set, in both directions', () => {
    const store = makeStore();
    const world = store.getState().settlement;
    const seedless = makeStore();
    seedless.setState((state) => { delete state.settlement._seed; });
    const duplicate = makeStore();
    const claimed = stageAdd(duplicate, npcIntent(world));
    duplicate.setState((state) => {
      state.settlement.decrees = [{ id: claimed.decreeId, op: { type: 'set-field' }, status: 'pending', orderIndex: 0, orderedAt: ORDERED_AT, addedBy: 'dm' }];
    });

    const noSaveStore = makeStore();
    noSaveStore.setState((state) => { state.activeSaveId = null; });
    const observed = [
      stageAdd(store, npcIntent(world, { cardType: 'dragon' })),
      stageAdd(noSaveStore, npcIntent(world)),
      stageAdd(seedless, npcIntent(world)),
      stageAdd(duplicate, npcIntent(world)),
      stageAdd(store, npcIntent(world, { values: {} })),
      stageAdd(store, npcIntent(world, { pools: {} })),
    ];

    expect(observed.map((row) => row.ok), 'every arm of this matrix is a refusal')
      .toEqual(observed.map(() => false));
    expect([...new Set(observed.map((row) => row.reason))].sort(compareCodepoint),
      'the CLOSED SET, BOTH DIRECTIONS: a seventh reason the binder can return reds here, and a'
      + ' declared reason it can never reach reds here too')
      .toEqual([...ADD_DECREE_REFUSALS].sort(compareCodepoint));
    expect(observed.every((row) => Array.isArray(row.errors)),
      'and every refusal carries an errors list, empty when it names no catalogue word').toBe(true);
  });
});
