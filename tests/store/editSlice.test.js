/**
 * editSlice.test.js — EM-C4a cases A1, A2, A3 and A8; EM-C4b cases A1 to A6 and the
 * judgment-264 binder's A7.
 *
 * THE CLAIM: one typed op travels the estate's EXISTING application-command boundary
 * and comes back as a receipt; the record carries the edited value, the DM's layer
 * records that the field is the DM's, nothing re-enters the generation pipeline, and a
 * CANONIZED settlement refuses the same act with one closed, typed reason.
 *
 * ⛔ THE WRITER IS REACHED THROUGH THE ADAPTER, NOT AROUND IT. A1 drives
 * `runPlainEditCommand`, so the envelope, the executor, the registered spec and the
 * injected store verb are all real; only the durable save service is mocked. The
 * refusal matrix calls the writer directly, because a refusal's SITE is what A3 pins
 * and the boundary would hide which arm fired.
 *
 * ⛔ EVERY SET THIS SUITE ITERATES IS IMPORTED FROM ITS PRODUCER — the refusal set,
 * the declaration table, the rename surfaces, the layer's own reason set — never
 * re-typed here (tests/lint/contractTestAntiVacuity.walker.test.js Rule 2).
 *
 * @enforced-by this test
 */

import { describe, expect, it, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// The durable cloud-write seam the rename lane reaches on a hydrated save. Stubbed so
// this suite is headless; nothing here asserts on it.
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { PLAIN_EDIT_APPLY } from '../../src/application/commands/adapters/plainEditApply.js';
import { COMMAND_STATUS } from '../../src/application/commands/commandReceipts.js';
import { runPlainEditCommand } from '../../src/application/commands/plainEditRuntime.js';
import { clearSessionCommandJournal } from '../../src/application/commands/sessionCommandRuntime.js';
import { standardCommandRegistry } from '../../src/application/commands/standardCommandRegistry.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { APPLY_EDIT_REASONS } from '../../src/domain/edit/dmLayer.js';
import { declarationsFor, FIELD_DECLARATIONS } from '../../src/domain/edit/fieldDeclarations.js';
import { EMPTY_RULE_SET, GUARD_KINDS, GUARD_OFFERS } from '../../src/domain/edit/guards.js';
import { makeOp } from '../../src/domain/edit/operations.js';
import * as registry from '../../src/domain/edit/registry.js';
import { NPC_RENAME_SURFACES } from '../../src/domain/factionRename.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  applyPlainEditIntent,
  applyPlainEditToDraft,
  CASCADE_DISPATCH,
  CASCADE_WRITERS,
  DECREE_ACTIONS,
  EDITOR_MODES,
  EDITOR_MODE_OFF,
  EDITOR_MODE_PREF_KEY,
  markDecreeApplied,
  PLAIN_EDIT_REFUSALS,
  readRootKey,
  recordDecreeOverride,
  REDERIVE_SEAM,
  reopenDecree,
  reorderDecree,
  revertDecreesOfTick,
  rootKeyFor,
  selectCanonState,
  selectDecrees,
  selectEditorMode,
  selectGuards,
  stageDecree,
  withdrawDecree,
} from '../../src/store/editSlice.js';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const SLICE_PATH = 'src/store/editSlice.js';
const SAVE_ID = 'save-1';
const OWNER = 'owner-1';
const NPC_ID = 'npc.varn';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

/** A settlement carrying ALL FIVE declared NPC rename surfaces, so a cascade arm that
 *  moved only the first would be visible rather than merely unproven. */
function fixture() {
  return {
    id: 'town.ashford', tier: 'town', name: 'Ashford', population: 1500,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    npcs: [
      { id: NPC_ID, name: 'Lord Varn', role: 'Reeve', status: 'active' },
      { id: 'npc.mira', name: 'Mira', role: 'Smith', status: 'active' },
    ],
    factions: [{ id: 'fac.guild', name: 'Merchant Guild', members: [{ id: NPC_ID, name: 'Lord Varn' }] }],
    relationships: [{ npc1Name: 'Lord Varn', npc2Name: 'Mira' }],
    interSettlementRelationships: [{ npcName: 'Lord Varn', partnerName: 'Ilsa' }],
    powerStructure: { factions: [{ id: 'fac.guild', faction: 'Merchant Guild', power: 40 }], conflicts: [] },
    institutions: [{ id: 'inst.market', name: 'Market' }],
    history: { historicalEvents: [], currentTensions: [] },
  };
}

/** A store with the REAL settlement slice, hydrated as opening a DRAFT library save. */
function makeStore(phase = 'draft') {
  const store = create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
  store.setState((state) => {
    state.settlement = structuredClone(fixture());
    state.savedSettlements = [{
      id: SAVE_ID, name: 'Ashford', tier: 'town', settlement: structuredClone(fixture()),
      campaignState: { phase, eventLog: [], systemState: {}, editedAt: null },
      timestamp: '2020-01-01T00:00:00.000Z',
    }];
    state.activeSaveId = SAVE_ID;
    state.phase = phase;
  });
  return store;
}

/** The writer, called exactly as the adapter calls it. */
const write = (store, request) => applyPlainEditToDraft(store.getState, store.setState, request);

const opFor = (field, value) => makeOp('set-field', { kind: 'npc', id: NPC_ID }, { field, value });

/** One request for the declared (card, entity, field) triple, key and op agreeing. */
function requestFor(cardType, entityId, field, value) {
  return {
    saveId: SAVE_ID,
    op: makeOp('set-field', { kind: 'npc', id: entityId }, { field, value }),
    rootKey: rootKeyFor(cardType, entityId, field).key,
    value,
  };
}

/** The five surfaces, READ from the frozen export's own paths rather than re-typed. */
function renameSurfaceValues(settlement) {
  return {
    'npcs[].name': settlement.npcs[0].name,
    'factions[].members[].name': settlement.factions[0].members[0].name,
    'relationships[].npc1Name': settlement.relationships[0].npc1Name,
    'relationships[].npc2Name': settlement.relationships[0].npc2Name,
    'interSettlementRelationships[].npcName': settlement.interSettlementRelationships[0].npcName,
  };
}

describe('EM-C4a — the store plain-edit half', () => {
  it('A1 — MAIN: a set-field edit on a DRAFT applies through the one adapter, the record carries the value, the layer records one root key, and neither input is mutated', async () => {
    const store = makeStore();
    clearSessionCommandJournal(store);
    const coords = rootKeyFor('npc', NPC_ID, 'role');
    const op = opFor('role', 'Warden');
    const opBefore = structuredClone(op);
    const otherSaveBefore = structuredClone(store.getState().savedSettlements[0]);

    const result = await runPlainEditCommand(
      { ownerKey: OWNER, saveId: SAVE_ID, rootKey: coords.key, op, value: 'Warden' },
      {
        journalScope: store,
        readContext: () => ({ ownerKey: OWNER, saveId: SAVE_ID }),
        applyPlainEdit: (request) => write(store, request),
        now: '2026-01-01T00:00:00.000Z',
      },
    );

    expect(result.ok).toBe(true);
    expect(result.commandReceipt.status).toBe(COMMAND_STATUS.APPLIED);
    expect(result.keys).toEqual([coords.key]);
    expect(store.getState().settlement.npcs[0].role).toBe('Warden');
    expect(store.getState().settlement.dmLayer.roots).toEqual({ [coords.key]: 'Warden' });
    // The layer records ONE key: the second NPC and the sibling field are untouched.
    expect(store.getState().settlement.npcs[1].role).toBe('Smith');
    expect(store.getState().settlement.npcs[0].name).toBe('Lord Varn');
    // The op is data, not a work surface, and the OTHER save is not this save.
    expect(op).toEqual(opBefore);
    expect(store.getState().savedSettlements[0]).toEqual(otherSaveBefore);
  });

  it('A1a — a free-cascade edit moves every declared NPC rename surface through the declared writer, and this module writes none of them itself', async () => {
    const store = makeStore();
    const before = renameSurfaceValues(store.getState().settlement);
    const result = await write(store, requestFor('npc', NPC_ID, 'name', 'Lady Varn'));

    expect(result.ok).toBe(true);
    const after = renameSurfaceValues(store.getState().settlement);
    // Anchored on the frozen export: every declared surface has a value here, and the
    // four that name THIS person all moved while the fifth (the other end of the edge)
    // did not, so the cascade is measured rather than a blanket overwrite.
    expect([...NPC_RENAME_SURFACES].map((surface) => surface.path).sort(compareCodepoint))
      .toEqual(Object.keys(after).sort(compareCodepoint));
    expect(after).toEqual({
      'npcs[].name': 'Lady Varn',
      'factions[].members[].name': 'Lady Varn',
      'relationships[].npc1Name': 'Lady Varn',
      'relationships[].npc2Name': 'Mira',
      'interSettlementRelationships[].npcName': 'Lady Varn',
    });
    expect(before['factions[].members[].name']).toBe('Lord Varn');
    // The layer still records the override at exactly ONE root key.
    expect(store.getState().settlement.dmLayer.roots)
      .toEqual({ [rootKeyFor('npc', NPC_ID, 'name').key]: 'Lady Varn' });
    // A SOURCE SCAN: the module IMPORTS no rename helper and ASSIGNS no name surface.
    const source = readFileSync(join(REPO_ROOT, SLICE_PATH), 'utf8');
    const code = source.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    const imported = [...source.matchAll(/^import[\s\S]*?from '([^']+)';$/gm)].map((hit) => hit[1]);
    const assigned = [...code.matchAll(/([A-Za-z_$][\w$]*(?:\.[\w$]+|\[[^\]]*\])*)\s*=(?![=>])/g)]
      .map((hit) => hit[1]);
    // anchored: both scans are LIVE — the import scan sees the four modules this file
    // really imports, and the assignment scan sees the two layer writes it really makes.
    expect(imported.length).toBe(6);
    expect(assigned.filter((target) => target === 'state.settlement.dmLayer').length).toBe(2);
    expect(imported.filter((specifier) => /factionRename|RenameHelpers|pendingEdits/.test(specifier))).toEqual([]);
    expect(assigned.filter((target) => /npcs|factions|relationships/.test(target))).toEqual([]);
  });

  it('A1b — the declared writer is AWAITED: a write that lands on a later microtask is read back correctly, and an un-awaited read would have missed it', async () => {
    const store = makeStore();
    let wrote = false;
    store.setState((state) => {
      state.renameNPC = async (index, newName) => {
        await Promise.resolve();
        store.setState((inner) => { inner.settlement.npcs[index].name = newName; });
        wrote = true;
        return true;
      };
    });

    const pending = write(store, requestFor('npc', NPC_ID, 'name', 'Lady Varn'));
    // THE NEGATIVE CONTROL: at this instant the writer has NOT written. A reader that
    // did not await would see the old name and score a real rename as a refusal, which
    // is the estate's own recorded failure at settlementPendingEdits.js:313-317.
    const seenUnawaited = store.getState().settlement.npcs[0].name;
    const result = await pending;

    expect(seenUnawaited).toBe('Lord Varn');
    expect(wrote).toBe(true);
    expect(result).toEqual({
      ok: true,
      saveId: SAVE_ID,
      keys: [rootKeyFor('npc', NPC_ID, 'name').key],
      layer: store.getState().settlement.dmLayer,
    });
    expect(store.getState().settlement.npcs[0].name).toBe('Lady Varn');
  });

  it('A1c — the root key and its coordinates are ONE mint, in both directions, and no site in the module re-spells either from the request', () => {
    const declared = Object.entries(FIELD_DECLARATIONS)
      .flatMap(([cardType, rows]) => rows.map((row) => [cardType, row.field]));
    const roundTrips = declared.map(([cardType, field]) => {
      const mint = rootKeyFor(cardType, `${cardType}.entity`, field);
      return { mint: { ...mint }, read: { ...readRootKey(mint.key) } };
    });
    const disagreements = roundTrips.filter(
      (pair) => JSON.stringify(pair.mint) !== JSON.stringify(pair.read),
    );
    // ⭐ EM-F3 MOVES THIS DENOMINATOR BY TWO, BY ADDITION AND NEVER BY DELETION: the phantom
    // card's two rows. They round-trip through the SAME mint as every other row — the key is a
    // (cardType, entityId, field) triple and knows nothing about where a card's subject lives —
    // so the claim this arm makes is unchanged and its population is simply larger.
    expect(declared.length).toBe(19);
    expect(disagreements).toEqual([]);

    // (ii) THE SOURCE SCAN, with its own planted mutant: every `cardType:` and `field:`
    // the module writes into an op must read off the ONE coords record. Without this the
    // pin is a tautology, because one call produced both halves.
    const source = readFileSync(join(REPO_ROOT, SLICE_PATH), 'utf8');
    // ⭐ EM-C4c ADDS ONE ROW THAT IS NOT AN OP COORDINATE, and it is EXCLUDED BY NAME rather
    // than by shape so a fourth row cannot hide behind it: `cardType: card` is the REQUEST key
    // of EM-E8's binder, read off `ADD_OP_TYPES`' own inverse and never off a request, and the
    // claim this scan makes — every coordinate the module writes INTO AN OP reads off the one
    // `coords` record — is unchanged by it.
    const NOT_AN_OP_COORDINATE = Object.freeze(['cardType: card']);
    const rawSources = (text) => [...text.matchAll(/^\s*(cardType|field):\s*([^,\n]+),/gm)]
      .map((match) => `${match[1]}: ${match[2]}`);
    const coordinateSources = (text) => rawSources(text)
      .filter((row) => !NOT_AN_OP_COORDINATE.includes(row));
    const mutant = source.replace('cardType: coords.cardType,', 'cardType: request.cardType,');
    const offenders = (text) => coordinateSources(text)
      .filter((row) => !row.endsWith(`coords.${row.split(':')[0]}`));
    // anchored: the excluded row is asserted PRESENT in the raw scan first, so the exclusion
    // above cannot rot into a filter that silences a row nothing writes any more.
    expect(rawSources(source).filter((row) => row === NOT_AN_OP_COORDINATE[0]).length).toBe(1);
    expect(coordinateSources(source).length).toBe(2);
    expect(offenders(source)).toEqual([]);
    expect(offenders(mutant)).toEqual(['cardType: request.cardType']);

    // (d) THE DECLARATION ↔ CALL PIN. The two tables are ONE fact in two spellings:
    // CASCADE_WRITERS declares which store action owns a declared field, and
    // CASCADE_DISPATCH calls that action by the LITERAL name the dead-op ratchet's
    // scanner can see. Both are read from their frozen exports, never re-typed, and
    // BOTH DIRECTIONS are asserted, so a row added to either table alone reds here.
    // Set semantics, not list equality: two declared fields may lawfully share one
    // writer, which gives CASCADE_WRITERS a repeated value and the dispatch table one key.
    const dispatchKeys = [...new Set(Object.keys(CASCADE_DISPATCH))].sort(compareCodepoint);
    const declaredActions = [...new Set(Object.values(CASCADE_WRITERS))].sort(compareCodepoint);
    expect(dispatchKeys.length).toBeGreaterThan(0);
    expect(declaredActions.filter((action) => !dispatchKeys.includes(action))).toEqual([]);
    expect(dispatchKeys.filter((action) => !declaredActions.includes(action))).toEqual([]);
    expect(dispatchKeys).toEqual(declaredActions);
  });

  it('A2 — the canon rule refuses BOTH spellings, a draft is the negative control, and the declared writer is never called on a canon save', async () => {
    const phaseCanon = makeStore('canon');
    phaseCanon.setState((state) => { state.phase = 'canon'; });
    const stampCanon = makeStore();
    stampCanon.setState((state) => { state.phase = 'draft'; state.canonizedAt = '2026-01-01T00:00:00.000Z'; });
    const spy = vi.fn(async () => true);
    stampCanon.setState((state) => { state.renameNPC = spy; });
    const draft = makeStore();

    const phaseBefore = structuredClone(phaseCanon.getState().settlement);
    const refusedPhase = await write(phaseCanon, requestFor('npc', NPC_ID, 'role', 'Warden'));
    const refusedStamp = await write(stampCanon, requestFor('npc', NPC_ID, 'name', 'Lady Varn'));
    const applied = await write(draft, requestFor('npc', NPC_ID, 'role', 'Warden'));

    expect([refusedPhase, refusedStamp]).toEqual([
      { ok: false, reason: 'canon_locked' },
      { ok: false, reason: 'canon_locked' },
    ]);
    expect(spy).toHaveBeenCalledTimes(0);
    expect(phaseCanon.getState().settlement).toEqual(phaseBefore);
    expect(selectCanonState(phaseCanon.getState(), SAVE_ID))
      .toEqual({ found: true, canon: true, phase: 'canon' });
    expect(selectCanonState(stampCanon.getState(), SAVE_ID).canon).toBe(true);
    // The paired positive control: the same act on a DRAFT applies.
    expect(applied.ok).toBe(true);
    expect(draft.getState().settlement.npcs[0].role).toBe('Warden');
  });

  it('A3 — the closed refusal set is SEVEN in both directions, the layer leaf reasons are a subset, and every hostile row returns a typed reason without throwing', async () => {
    expect([...PLAIN_EDIT_REFUSALS]).toEqual([...PLAIN_EDIT_REFUSALS].sort(compareCodepoint));
    expect(PLAIN_EDIT_REFUSALS.length).toBe(7);
    expect(Object.isFrozen(PLAIN_EDIT_REFUSALS)).toBe(true);
    // Both directions against the leaf's own exported set, so the two can never drift.
    expect([...APPLY_EDIT_REASONS].filter((reason) => !PLAIN_EDIT_REFUSALS.includes(reason))).toEqual([]);
    // BYTE-IDENTICAL to the estate's own spelling of the one reason this packet reuses.
    const dispatcher = readFileSync(join(REPO_ROOT, 'src/store/settlementPendingEdits.js'), 'utf8');
    expect(dispatcher.includes("reason: 'rename_not_applied'")).toBe(true);

    const goodOp = opFor('role', 'Warden');
    const hostile = [
      ['absent op', { saveId: SAVE_ID, op: undefined, rootKey: rootKeyFor('npc', NPC_ID, 'role').key, value: 'x' }, 'invalid_op'],
      ['malformed op', { saveId: SAVE_ID, op: { type: 'not-an-op-type', target: { kind: 'npc', id: NPC_ID }, payload: {} }, rootKey: rootKeyFor('npc', NPC_ID, 'role').key, value: 'x' }, 'invalid_op'],
      ['unknown card type', { saveId: SAVE_ID, op: goodOp, rootKey: rootKeyFor('building', 'b-1', 'name').key, value: 'x' }, 'unknown_target'],
      ['malformed root key', { saveId: SAVE_ID, op: goodOp, rootKey: 'npc:npc.varn', value: 'x' }, 'unknown_target'],
      ['undeclared field', { saveId: SAVE_ID, op: goodOp, rootKey: rootKeyFor('npc', NPC_ID, 'salary').key, value: 'x' }, 'undeclared_field'],
      ['a share row the door does not carry', { saveId: SAVE_ID, op: goodOp, rootKey: rootKeyFor('faction', 'fac.guild', 'power').key, value: 'x' }, 'not_a_draft_field'],
      ['a free-cascade row with no declared writer', { saveId: SAVE_ID, op: goodOp, rootKey: rootKeyFor('institution', 'inst.market', 'name').key, value: 'x' }, 'not_a_draft_field'],
      ['missing save', { saveId: '', op: goodOp, rootKey: rootKeyFor('npc', NPC_ID, 'role').key, value: 'x' }, 'no_save'],
      ['an entity id matching NO npc', { saveId: SAVE_ID, op: goodOp, rootKey: rootKeyFor('npc', 'npc.nobody', 'name').key, value: 'x' }, 'unknown_target'],
    ];
    const outcomes = [];
    await Promise.all(hostile.map(async ([label, request]) => {
      const store = makeStore();
      const before = structuredClone(store.getState().settlement);
      let thrown = null;
      let result = null;
      try { result = await write(store, request); } catch (error) { thrown = String(error); }
      outcomes.push([label, thrown ?? result?.reason, JSON.stringify(store.getState().settlement) === JSON.stringify(before)]);
      return null;
    }));
    expect(outcomes.sort()).toEqual(hostile.map(([label, , expected]) => [label, expected, true]).sort());

    // An entity id matching TWO npcs is no match, never the first.
    const twinned = makeStore();
    twinned.setState((state) => { state.settlement.npcs[1].id = NPC_ID; });
    expect(await write(twinned, requestFor('npc', NPC_ID, 'name', 'Lady Varn')))
      .toEqual({ ok: false, reason: 'unknown_target' });

    // A saveId that is NOT the active save refuses no_save with the writer NOT called.
    const otherSave = makeStore();
    const notCalled = vi.fn(async () => true);
    otherSave.setState((state) => { state.renameNPC = notCalled; });
    expect(await write(otherSave, { ...requestFor('npc', NPC_ID, 'name', 'Lady Varn'), saveId: 'save-9' }))
      .toEqual({ ok: false, reason: 'no_save' });
    expect(notCalled).toHaveBeenCalledTimes(0);

    // A writer that RAN and left the record unmoved is convicted by the read-back.
    const inert = makeStore();
    const ranButRefused = vi.fn(async () => false);
    inert.setState((state) => { state.renameNPC = ranButRefused; });
    expect(await write(inert, requestFor('npc', NPC_ID, 'name', 'Lady Varn')))
      .toEqual({ ok: false, reason: 'rename_not_applied' });
    expect(ranButRefused).toHaveBeenCalledTimes(1);

    // A command with no owner context cannot reach the writer at all: the executor
    // refuses it before validation, which is this packet's third line of defence.
    const anonymous = makeStore();
    clearSessionCommandJournal(anonymous);
    const verb = vi.fn(async () => ({ ok: true }));
    const refused = await runPlainEditCommand(
      { ownerKey: OWNER, saveId: SAVE_ID, rootKey: rootKeyFor('npc', NPC_ID, 'role').key, op: goodOp, value: 'x' },
      {
        journalScope: anonymous,
        readContext: () => ({ ownerKey: null, saveId: null }),
        applyPlainEdit: verb,
        now: '2026-01-01T00:00:00.000Z',
      },
    );
    expect(refused.commandReceipt.reason).toBe('owner_context_missing');
    expect(verb).toHaveBeenCalledTimes(0);
  });

  it('A8 — purity, idempotency, key-order independence, the transient mode and the rederive seam as a scoped plug', async () => {
    const store = makeStore();
    await write(store, requestFor('npc', NPC_ID, 'role', 'Warden'));
    const onceSettlement = JSON.stringify(store.getState().settlement);
    const onceLayer = JSON.stringify(store.getState().settlement.dmLayer);
    await write(store, requestFor('npc', NPC_ID, 'role', 'Warden'));
    expect(JSON.stringify(store.getState().settlement)).toBe(onceSettlement);
    expect(JSON.stringify(store.getState().settlement.dmLayer)).toBe(onceLayer);

    // Three keys in all six orders give a byte-identical layer under sorted-key stringify.
    const triple = [['role', 'Warden'], ['status', 'retired'], ['note', 'owes the miller']];
    const orders = [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]];
    const layers = [];
    await Promise.all(orders.map(async (order) => {
      const ordered = makeStore();
      await order.reduce(async (chain, index) => {
        await chain;
        return write(ordered, requestFor('npc', NPC_ID, triple[index][0], triple[index][1]));
      }, Promise.resolve());
      const roots = ordered.getState().settlement.dmLayer.roots;
      layers.push(JSON.stringify(Object.keys(roots).sort(compareCodepoint).map((key) => [key, roots[key]])));
      return null;
    }));
    expect(new Set(layers).size).toBe(1);

    // THE SEAM, PLUGGED (EM-B2a4). It was a declared no-op until this landing; it is now
    // SCOPED, and consulting it still changes nothing observable in the store, because the
    // lane it reaches is dormant until its one caller is wired. The frozen-ness below is
    // BYTE-UNMOVED from EM-C4a's landing: only the two value pins moved.
    expect(REDERIVE_SEAM).toEqual({ kind: 'scoped', owner: 'EM-B2a4', calls: 1 });
    expect(Object.isFrozen(REDERIVE_SEAM)).toBe(true);
    const seamStore = makeStore();
    const beforeSeam = JSON.stringify(seamStore.getState().settlement);
    expect(REDERIVE_SEAM.kind).toBe('scoped');
    expect(JSON.stringify(seamStore.getState().settlement)).toBe(beforeSeam);

    // The transient mode reads through uiSlice's shipped bag and never a boolean.
    // ⭐ EM-C4b WIDENS THESE ROWS IN PLACE, BY ADDITION AND NEVER BY DELETION: `decree`
    // JOINS the vocabulary in compareCodepoint order, so it is no longer an unknown word,
    // and the default an unknown word falls back to is now the NAMED EDITOR_MODE_OFF rather
    // than EDITOR_MODES[0]. The unknown-word row keeps its meaning with a word that is still
    // outside the set, so the negative it proves is unmoved.
    expect([...EDITOR_MODES]).toEqual(['decree', 'off', 'plain']);
    expect(EDITOR_MODE_PREF_KEY).toBe('editorMode');
    expect(EDITOR_MODE_OFF).toBe('off');
    expect(selectEditorMode({ userPrefs: {} })).toBe('off');
    expect(selectEditorMode({ userPrefs: { [EDITOR_MODE_PREF_KEY]: 'plain' } })).toBe('plain');
    expect(selectEditorMode({ userPrefs: { [EDITOR_MODE_PREF_KEY]: 'decree' } })).toBe('decree');
    expect(selectEditorMode({ userPrefs: { [EDITOR_MODE_PREF_KEY]: 'pencil' } })).toBe('off');
    expect(selectEditorMode(undefined)).toBe('off');
    // The one declared cascade row, and the declarations it is keyed against.
    expect(CASCADE_WRITERS).toEqual({ 'npc:name': 'renameNPC' });
    expect(declarationsFor('npc').map((row) => row.field)).toEqual(['name', 'role', 'status', 'note']);
  });
});

/* ── EM-C4b ─ the registry half's fixtures, each READ from its producer ─────── */

/** Design §20.3's withdrawal reason, built from EM-C1's own frozen vocabularies at the two
 *  indexes that leaf itself reads them at (`WITHDRAWN_REASON_KINDS[0]`,
 *  `RESOLUTION_MISSING_KINDS[4]`), never re-typed as words here. */
const WITHDRAWN_REASON = Object.freeze({
  kind: registry.WITHDRAWN_REASON_KINDS[0],
  missing: registry.RESOLUTION_MISSING_KINDS[4],
  was: 'sawyer',
});
const ORDERED_AT = '2026-01-01T00:00:00.000Z';

const stageRequest = (id, field = 'role', value = 'Warden') => ({
  saveId: SAVE_ID, op: opFor(field, value), meta: { id, orderedAt: ORDERED_AT },
});
const reorderRequest = (id, toIndex) => ({ saveId: SAVE_ID, entryId: id, toIndex });
const withdrawRequest = (id) => ({ saveId: SAVE_ID, entryId: id, reason: WITHDRAWN_REASON });
const reopenRequest = (id) => ({ saveId: SAVE_ID, entryId: id, op: opFor('note', 'owes the miller') });
const applyRequest = (id) => ({
  saveId: SAVE_ID, entryId: id, meta: { appliedAt: '2026-01-02T00:00:00.000Z', tickRef: 'tick-7' },
});
const revertRequest = (restored) => ({ saveId: SAVE_ID, restored });
/** ⭐ EM-C4c's seventh row. The guard id is stored VERBATIM by the verb, so this arm needs
 *  no engine here: the suites that judge what an override MEANS drive the real engine. */
const GUARD_ID = 'contention:dec-1:dec-0:-';
const overrideRequest = (id) => ({ saveId: SAVE_ID, entryId: id, guardId: GUARD_ID });

/** A draft store carrying ONE staged entry, so every arm below starts from the same rows. */
function seededStore() {
  const store = makeStore();
  stageDecree(store.getState, store.setState, stageRequest('dec-1'));
  return store;
}

/** EM-C1's SEVEN amendment verbs (EM-C4c's `recordOverride` is the seventh), DERIVED from
 *  the module rather than listed: an exported
 *  function that takes a registry AND at least one further argument and answers with a NEW
 *  FROZEN registry. `compareDecrees` answers a number, `resolveDecree` a verdict, and the
 *  reading `orderedDecrees` takes the registry alone — so none of the three is a verb. */
const liveVerbs = () => Object.keys(registry)
  .filter((name) => typeof registry[name] === 'function' && registry[name].length >= 2)
  .filter((name) => {
    const answer = registry[name]([]);
    return Array.isArray(answer) && Object.isFrozen(answer);
  })
  .sort(compareCodepoint);

/** The declaration's own side of the same fact. */
const declaredVerbs = () => Object.keys(DECREE_ACTIONS).sort(compareCodepoint);

/** One rule that speaks for every entry, and one whose injected dependency the caller does
 *  NOT supply so `unevaluated` NAMES it instead of reading as clean coverage. A NEW object
 *  every call, because the memo's third handle is identity. Both vocabularies are read from
 *  EM-C2's frozen exports. */
const fixtureRuleSet = () => ({
  rules: [
    {
      id: 'fixture.speaks',
      appliesTo: null,
      needs: [],
      evaluate: (ctx) => ({
        kind: GUARD_KINDS[0],
        message: `the fixture rule judged ${ctx.entry.id}`,
        offers: [GUARD_OFFERS[0]],
      }),
    },
    {
      id: 'fixture.underSupplied',
      appliesTo: null,
      needs: ['renormalizeFactionPower'],
      evaluate: () => null,
    },
  ],
  project: null,
  deps: {},
});

describe('EM-C4b — the store registry half', () => {
  it('A1 — MAIN: each of the seven actions dispatches its OWN pure verb onto the record through one write site, the stored registry IS the returned array, and DECREE_ACTIONS is SET-EQUAL in both directions to the registry module\'s own seven verbs', () => {
    const first = makeStore();
    const staged = stageDecree(first.getState, first.setState, stageRequest('dec-1'));
    expect(staged).toEqual({ ok: true, saveId: SAVE_ID, decrees: staged.decrees });
    expect(first.getState().settlement.decrees).toBe(staged.decrees);
    expect(staged.decrees.map((entry) => entry.id)).toEqual(['dec-1']);
    expect(staged.decrees[0].status).toBe('pending');

    // Each action is run on its OWN store seeded with the same rows, and its answer is
    // compared with the PURE verb run over those same rows: a wrongly bound verb reds here
    // rather than passing because the two happened to agree on one shape.
    const actions = [
      {
        verb: 'stage',
        act: (store) => stageDecree(store.getState, store.setState, stageRequest('dec-2')),
        pure: (rows) => registry.stage(rows, stageRequest('dec-2').op, stageRequest('dec-2').meta),
      },
      {
        verb: 'reorder',
        act: (store) => reorderDecree(store.getState, store.setState, reorderRequest('dec-1', 0)),
        pure: (rows) => registry.reorder(rows, 'dec-1', 0),
      },
      {
        verb: 'withdraw',
        act: (store) => withdrawDecree(store.getState, store.setState, withdrawRequest('dec-1')),
        pure: (rows) => registry.withdraw(rows, 'dec-1', WITHDRAWN_REASON),
      },
      {
        verb: 'reopen',
        act: (store) => reopenDecree(store.getState, store.setState, reopenRequest('dec-1')),
        pure: (rows) => registry.reopen(rows, 'dec-1', reopenRequest('dec-1').op),
      },
      {
        verb: 'markApplied',
        act: (store) => markDecreeApplied(store.getState, store.setState, applyRequest('dec-1')),
        pure: (rows) => registry.markApplied(rows, 'dec-1', applyRequest('dec-1').meta),
      },
      {
        verb: 'recordOverride',
        act: (store) => recordDecreeOverride(store.getState, store.setState, overrideRequest('dec-1')),
        pure: (rows) => registry.recordOverride(rows, 'dec-1', GUARD_ID),
      },
      {
        verb: 'revertTick',
        act: (store) => revertDecreesOfTick(store.getState, store.setState, revertRequest([])),
        pure: (rows) => registry.revertTick([], rows),
      },
    ];
    const outcomes = actions.map(({ verb, act, pure }) => {
      const store = seededStore();
      const before = store.getState().settlement.decrees;
      const result = act(store);
      return [
        verb,
        result.ok,
        store.getState().settlement.decrees === result.decrees,
        JSON.stringify(result.decrees) === JSON.stringify(pure(before)),
      ];
    });
    expect(outcomes).toEqual(actions.map(({ verb }) => [verb, true, true, true]));

    // THE DECLARATION ↔ PRODUCER PIN, both directions, both sides DERIVED: a verb added to
    // the registry and not to DECREE_ACTIONS (or the reverse) cannot ship.
    expect(liveVerbs().length).toBe(7);
    expect(actions.map(({ verb }) => verb).sort(compareCodepoint)).toEqual(liveVerbs());
    expect(declaredVerbs()).toEqual(liveVerbs());
    // anchored: the same two rosters are non-empty above, so neither absence below is the
    // emptiness of a scan that stopped working.
    expect(declaredVerbs().filter((verb) => !liveVerbs().includes(verb))).toEqual([]);
    expect(liveVerbs().filter((verb) => !declaredVerbs().includes(verb))).toEqual([]);
  });

  it('A2 — DORMANT: a world that was never edited materializes NO key on a read, the empty registry is the shared frozen one, `decree` is a member of the closed mode vocabulary, and the empty rule set answers with no guard and nothing unevaluated', () => {
    const store = makeStore();
    // anchored: the same record carries `npcs`, so the absence below is a real own-property
    // reading and not a lookup on nothing.
    expect(Object.hasOwn(store.getState().settlement, 'npcs')).toBe(true);
    expect(Object.hasOwn(store.getState().settlement, 'decrees')).toBe(false);
    const read = selectDecrees(store.getState());
    expect(read).toEqual([]);
    expect(Object.isFrozen(read)).toBe(true);
    expect(selectDecrees({ settlement: { decrees: 'not-an-array' } })).toBe(read);
    expect(selectDecrees(undefined)).toBe(read);
    // A READ never writes: the key is still absent after both readings.
    expect(Object.hasOwn(store.getState().settlement, 'decrees')).toBe(false);
    expect(EDITOR_MODES.includes('decree')).toBe(true);
    expect(selectGuards(store.getState(), EMPTY_RULE_SET)).toEqual({ guards: [], unevaluated: [] });
    expect(Object.hasOwn(store.getState().settlement, 'decrees')).toBe(false);
  });

  it('A3 — COUNTERFORCE: a saveId that is not the active save refuses no_save with the settlement byte-identical and no verb run, and a CANONIZED save is the paired positive control because a decree is what canon stages', () => {
    const foreign = makeStore();
    const before = JSON.stringify(foreign.getState().settlement);
    const refused = stageDecree(foreign.getState, foreign.setState, {
      ...stageRequest('dec-1'), saveId: 'save-9',
    });
    expect(refused).toEqual({ ok: false, reason: 'no_save' });
    expect(PLAIN_EDIT_REFUSALS.includes(refused.reason)).toBe(true);
    // anchored: the same stringify of the same store is compared, and the positive control
    // below moves it - so this equality measures a store that did not move.
    expect(JSON.stringify(foreign.getState().settlement)).toBe(before);
    expect(Object.hasOwn(foreign.getState().settlement, 'decrees')).toBe(false);
    expect(stageDecree(foreign.getState, foreign.setState, { ...stageRequest('dec-1'), saveId: '' }))
      .toEqual({ ok: false, reason: 'no_save' });

    // THE PAIRED POSITIVE CONTROL, and design §2.6's law: on canon an edit becomes an event
    // applied at the next advance, and the registry is where it waits — so canon is NOT a
    // refusal here, unlike the plain-edit writer above.
    const canon = makeStore('canon');
    const staged = stageDecree(canon.getState, canon.setState, stageRequest('dec-1'));
    expect(staged.ok).toBe(true);
    expect(canon.getState().settlement.decrees.map((entry) => entry.id)).toEqual(['dec-1']);
    expect(JSON.stringify(foreign.getState().settlement)).toBe(before);
  });

  it('A4 — BOUNDARY: a withdrawn entry keeps design §20.3\'s reason, its own op and its order index, the registry that comes back is a NEW array, and the rows handed in are not mutated', () => {
    const store = seededStore();
    const staged = store.getState().settlement.decrees;
    const copy = structuredClone(staged);
    const after = withdrawDecree(store.getState, store.setState, withdrawRequest('dec-1')).decrees;

    expect(after).not.toBe(staged);
    expect(staged).toEqual(copy);
    const row = after.find((entry) => entry.id === 'dec-1');
    expect(row.status).toBe('withdrawn');
    expect(row.withdrawnReason).toEqual(WITHDRAWN_REASON);
    expect(row.orderIndex).toBe(copy[0].orderIndex);
    expect(row.op).toEqual(copy[0].op);
    expect(row.orderedAt).toBe(ORDERED_AT);
    // A hand withdrawal carries NO reason at all, which is what design §20.3 makes the
    // absence mean; the malformed reason is refused by EM-C1 and written by nobody.
    const byHand = seededStore();
    const handled = withdrawDecree(byHand.getState, byHand.setState, {
      saveId: SAVE_ID, entryId: 'dec-1', reason: { kind: 'not-a-kind' },
    }).decrees;
    // anchored: the same field IS written on the row above, so this absence is the reason
    // shape being refused rather than a field this suite never reaches.
    expect(Object.hasOwn(handled[0], 'withdrawnReason')).toBe(false);
    expect(handled[0].status).toBe('withdrawn');
  });

  it('A5 — IDEMPOTENCY: selectGuards is memoized on the registry, the record and the rule set, the same three handles answer with the SAME object, each change re-evaluates, every finding is in the closed guard vocabularies and an under-supplied rule is NAMED unevaluated', () => {
    const store = seededStore();
    const ruleSet = fixtureRuleSet();
    const first = selectGuards(store.getState(), ruleSet);
    expect(selectGuards(store.getState(), ruleSet)).toBe(first);
    expect(first.guards.length).toBe(1);
    expect(first.guards.every((guard) => GUARD_KINDS.includes(guard.kind))).toBe(true);
    expect(first.guards.flatMap((guard) => [...guard.offers])
      .every((offer) => GUARD_OFFERS.includes(offer))).toBe(true);
    // The caller supplied no `renormalizeFactionPower`, so the rule that needs it is NAMED
    // rather than counted as clean coverage: the deps are the caller's (judgment 263 Q3).
    expect([...first.unevaluated]).toEqual(['fixture.underSupplied']);

    // A CHANGED REGISTRY re-evaluates.
    stageDecree(store.getState, store.setState, stageRequest('dec-2'));
    const second = selectGuards(store.getState(), ruleSet);
    expect(second).not.toBe(first);
    expect(second.guards.length).toBe(2);
    // A CHANGED RULE SET re-evaluates: a different question about the same world.
    const third = selectGuards(store.getState(), fixtureRuleSet());
    expect(third).not.toBe(second);
    expect(third.guards.map((guard) => guard.entryId)).toEqual(second.guards.map((guard) => guard.entryId));
    // And the same three handles are still one answer after all of it.
    expect(selectGuards(store.getState(), ruleSet)).not.toBe(second);
  });

  it('A6 — LIFECYCLE: the rewind\'s registry half takes the RESTORED entry on a shared id, re-appends every decree staged after the tick, and moves no entry\'s order index', () => {
    const store = seededStore();
    markDecreeApplied(store.getState, store.setState, applyRequest('dec-1'));
    expect(store.getState().settlement.decrees[0].status).toBe('applied');
    // The snapshot `undoLastPulse` restores: that tick's decrees, back to pending, in order.
    const restored = structuredClone([...store.getState().settlement.decrees])
      .map((entry) => ({ ...entry, status: 'pending' }));
    stageDecree(store.getState, store.setState, stageRequest('dec-2', 'note', 'owes the miller'));

    const after = revertDecreesOfTick(store.getState, store.setState, revertRequest(restored)).decrees;
    expect(after.map((entry) => entry.id)).toEqual(['dec-1', 'dec-2']);
    expect(after.map((entry) => entry.status)).toEqual(['pending', 'pending']);
    expect(after.map((entry) => entry.orderIndex))
      .toEqual([restored[0].orderIndex, restored[0].orderIndex + 1]);
    // anchored: the pre-undo row for that id IS applied above, so taking the restored entry
    // is a choice between two real rows rather than the only row there was.
    expect(after.filter((entry) => entry.status === 'applied')).toEqual([]);
    expect(store.getState().settlement.decrees).toBe(after);

    // The later-staged entry keeps its own words, and the order the DM reads is the
    // registry's own — every id present exactly once, nothing reordered by the rewind.
    expect(after[1].op).toEqual(stageRequest('dec-2', 'note', 'owes the miller').op);
    expect([...new Set(after.map((entry) => entry.id))].length).toBe(after.length);
  });
});

describe('EM-C4b — the plain-edit intent binder (judgment 264)', () => {
  it('A7 — the dialog\'s four-coordinate intent reaches the writer THROUGH the one generic adapter, the draft carries the edit at the minted root key, a refused intent surfaces a member of the closed refusal set, and a store with no edit scope is refused without throwing', async () => {
    const store = makeStore();
    clearSessionCommandJournal(store.getState);
    const applied = await applyPlainEditIntent(store.getState, store.setState, {
      cardType: 'npc', entityId: NPC_ID, field: 'role', value: 'Warden',
    });

    // (i) THE BOUNDARY REALLY RAN: the receipt is the executor's own, and the live registry
    //     carries EXACTLY ONE plain-edit capability — a second adapter would be a second row.
    expect(applied.ok).toBe(true);
    expect(applied.commandReceipt.status).toBe(COMMAND_STATUS.APPLIED);
    expect(standardCommandRegistry.list().map((spec) => spec.kind)
      .filter((kind) => kind.startsWith('settlement.plain-edit'))).toEqual([PLAIN_EDIT_APPLY]);

    // (ii) THE DRAFT CARRIES THE EDIT, and the layer records the ONE root key the binder
    //      minted from the intent's four coordinates.
    expect(store.getState().settlement.npcs[0].role).toBe('Warden');
    expect(applied.keys).toEqual([rootKeyFor('npc', NPC_ID, 'role').key]);
    expect(store.getState().settlement.dmLayer.roots)
      .toEqual({ [rootKeyFor('npc', NPC_ID, 'role').key]: 'Warden' });

    // (iii) A REFUSED INTENT: the canon rule refuses, and the word that reaches the dialog is
    //       a member of the writer's own closed set rather than one minted at this seam.
    const canon = makeStore('canon');
    clearSessionCommandJournal(canon.getState);
    const before = JSON.stringify(canon.getState().settlement);
    const refused = await applyPlainEditIntent(canon.getState, canon.setState, {
      cardType: 'npc', entityId: NPC_ID, field: 'role', value: 'Warden',
    });
    expect(refused.ok).not.toBe(true);
    expect(refused.reason).toBe('canon_locked');
    expect(PLAIN_EDIT_REFUSALS.includes(refused.reason)).toBe(true);
    // anchored: the identical intent DID move the draft store above, so this equality
    // measures a refusal that wrote nothing rather than a seam that never ran.
    expect(JSON.stringify(canon.getState().settlement)).toBe(before);

    // (iv) TOTAL: a store that owns no edit scope at all can name no owner on an envelope,
    //      and is refused with this module's own word instead of throwing.
    const scopeless = create(immer(() => ({ activeSaveId: null })));
    expect(await applyPlainEditIntent(scopeless.getState, scopeless.setState, {
      cardType: 'npc', entityId: NPC_ID, field: 'role', value: 'Warden',
    })).toEqual({ ok: false, reason: 'no_save' });
  });
});
