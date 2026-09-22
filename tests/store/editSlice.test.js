/**
 * editSlice.test.js — EM-C4a cases A1, A2, A3 and A8.
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

import { COMMAND_STATUS } from '../../src/application/commands/commandReceipts.js';
import { runPlainEditCommand } from '../../src/application/commands/plainEditRuntime.js';
import { clearSessionCommandJournal } from '../../src/application/commands/sessionCommandRuntime.js';
import { compareCodepoint } from '../../src/domain/deterministicSort.js';
import { APPLY_EDIT_REASONS } from '../../src/domain/edit/dmLayer.js';
import { declarationsFor, FIELD_DECLARATIONS } from '../../src/domain/edit/fieldDeclarations.js';
import { makeOp } from '../../src/domain/edit/operations.js';
import { NPC_RENAME_SURFACES } from '../../src/domain/factionRename.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  applyPlainEditToDraft,
  CASCADE_DISPATCH,
  CASCADE_WRITERS,
  EDITOR_MODES,
  EDITOR_MODE_PREF_KEY,
  PLAIN_EDIT_REFUSALS,
  readRootKey,
  REDERIVE_SEAM,
  rootKeyFor,
  selectCanonState,
  selectEditorMode,
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
    expect(imported.length).toBe(4);
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
    expect(declared.length).toBe(17);
    expect(disagreements).toEqual([]);

    // (ii) THE SOURCE SCAN, with its own planted mutant: every `cardType:` and `field:`
    // the module writes into an op must read off the ONE coords record. Without this the
    // pin is a tautology, because one call produced both halves.
    const source = readFileSync(join(REPO_ROOT, SLICE_PATH), 'utf8');
    const coordinateSources = (text) => [...text.matchAll(/^\s*(cardType|field):\s*([^,\n]+),/gm)]
      .map((match) => `${match[1]}: ${match[2]}`);
    const mutant = source.replace('cardType: coords.cardType,', 'cardType: request.cardType,');
    const offenders = (text) => coordinateSources(text)
      .filter((row) => !row.endsWith(`coords.${row.split(':')[0]}`));
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

  it('A8 — purity, idempotency, key-order independence, the transient mode and the rederive seam as a typed no-op', async () => {
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

    // THE SEAM: a declared no-op whose consultation changes nothing observable. The day
    // EM-B2a4 plugs scoped re-derivation in, THIS is the arm that fails.
    expect(REDERIVE_SEAM).toEqual({ kind: 'noop', owner: 'EM-B2a4', calls: 0 });
    expect(Object.isFrozen(REDERIVE_SEAM)).toBe(true);
    const seamStore = makeStore();
    const beforeSeam = JSON.stringify(seamStore.getState().settlement);
    expect(REDERIVE_SEAM.kind).toBe('noop');
    expect(JSON.stringify(seamStore.getState().settlement)).toBe(beforeSeam);

    // The transient mode reads through uiSlice's shipped bag and never a boolean.
    expect([...EDITOR_MODES]).toEqual(['off', 'plain']);
    expect(EDITOR_MODE_PREF_KEY).toBe('editorMode');
    expect(selectEditorMode({ userPrefs: {} })).toBe('off');
    expect(selectEditorMode({ userPrefs: { [EDITOR_MODE_PREF_KEY]: 'plain' } })).toBe('plain');
    expect(selectEditorMode({ userPrefs: { [EDITOR_MODE_PREF_KEY]: 'decree' } })).toBe('off');
    expect(selectEditorMode(undefined)).toBe('off');
    // The one declared cascade row, and the declarations it is keyed against.
    expect(CASCADE_WRITERS).toEqual({ 'npc:name': 'renameNPC' });
    expect(declarationsFor('npc').map((row) => row.field)).toEqual(['name', 'role', 'status', 'note']);
  });
});
