/**
 * tableEventCommit.test.js — R-1 THE SESSION LEDGER: the commit half.
 *
 * A table event enters the EXISTING pendingEdits queue as a 'table-event' with a
 * schema-walled directive; commitPendingEdits routes it (applyEditOp →
 * applyTableEvent) to an EXISTING engine effect. These pins assert:
 *   • the committed effect carries source:'table' on its receipt (provenance),
 *   • the free-text flavor rides a non-mechanical field and survives verbatim,
 *   • the effect + receipt PERSIST (survive a fresh reload — state-lifecycle),
 *   • a directive missing the source stamp or naming a non-table event type is a
 *     safe no-op (the lazy authoring dispatcher fails closed).
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { saves } from '../../src/lib/saves.js';
import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import {
  validateTableEvent, buildTableEffect, TABLE_EVENT_SOURCE,
  TABLE_EVENT_KINDS, KIND_SPEC,
} from '../../src/domain/tableLedger.js';

const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {}, importedNeighbour: null, campaigns: [], campaignsLoaded: true,
  isTierAllowed: () => true, canSave: () => true, maxSaves: () => 50, setPurchaseModalOpen: () => {},
});

const makeStore = () => create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));

function canonFixture() {
  return {
    id: 'town.bridgeford', tier: 'town', name: 'Bridgeford', population: 1500,
    // The economy verbs need something to act on: a whole institution and a
    // wounded one, a resource still worked and one already gone.
    config: {
      monsterThreat: 'safe',
      nearbyResources: ['timber', 'iron'],
      nearbyResourcesDepleted: ['iron'],
    },
    institutions: [
      { id: 'inst.market', name: 'Market' },
      {
        id: 'inst.granary', name: 'Granary',
        impairments: [{ type: 'capacity', severity: 0.3, causeEventId: 'seed.wound' }],
      },
    ],
    powerStructure: { factions: [], conflicts: [] },
    stressors: [{ type: 'famine', name: 'famine', label: 'A failing harvest', severity: 0.6, status: 'active' }],
    // Corrupt, so EXPOSE_CORRUPTION has something to act on (the exposure kind
    // vetoes target_not_found on a clean NPC — pre-existing engine behavior).
    npcs: [{ id: 'npc.aldis', name: 'Aldis', role: 'Guildmaster', corrupt: true }],
    history: { historicalEvents: [], currentTensions: [] },
  };
}

/** A valid target on canonFixture for every kind in the closed vocabulary. */
const REF_FOR_KIND = {
  incident: null,
  'stressor-relief': 'famine',
  obligation: 'debt',
  exposure: 'npc.aldis',
  'structure-harm': 'inst.market',
  'structure-restored': 'inst.granary',
  'supply-loss': 'timber',
  'supply-restored': 'iron',
};

const SAVE_ID = 'save-canon-1';

/** Hydrate a CANONIZED library save (so events log into the timeline). */
function withCanonSave(store) {
  const entry = {
    id: SAVE_ID, name: 'Bridgeford', tier: 'town',
    settlement: structuredClone(canonFixture()),
    campaignState: { phase: 'canon', eventLog: [], systemState: {}, canonizedAt: '2020-01-01T00:00:00.000Z', editedAt: null },
    timestamp: '2020-01-01T00:00:00.000Z',
  };
  store.setState(s => {
    s.settlement = structuredClone(canonFixture());
    s.savedSettlements = [entry];
    s.activeSaveId = SAVE_ID;
    s.phase = 'canon';
    s.eventLog = [];
    s.systemState = {};
    s.canonizedAt = '2020-01-01T00:00:00.000Z';
    s.editedAt = null;
  });
}

const persistedEntry = (store) => store.getState().savedSettlements.find(s => s.id === SAVE_ID);
function reloadInto(entry) {
  const fresh = makeStore();
  fresh.getState().hydrateFromSave(entry);
  return fresh.getState();
}

/** Queue a validated table event exactly as the lazy panel would. */
async function queueTableEvent(store, input) {
  const { ok, record } = validateTableEvent(input);
  expect(ok).toBe(true);
  return store.getState().queueEdit('table-event', { directive: buildTableEffect(record), record });
}

beforeEach(() => { saves.update.mockClear(); });

describe('R-1 the session ledger commits typed, bounded, source:table effects', () => {
  let store;
  beforeEach(() => { store = makeStore(); withCanonSave(store); });

  test('TABLE_EVENT_SOURCE is the literal the lazy dispatcher stamps', () => {
    // The writer hard-codes 'table' rather than importing the richer Session
    // Ledger schema; this pin keeps those two closed vocabularies in lockstep.
    expect(TABLE_EVENT_SOURCE).toBe('table');
  });

  test('an obligation commits an APPLY_STRESSOR receipt tagged source:table, persists, survives reload', async () => {
    const FLAVOR = "the party pledged the baron's ransom, and the debt fell on the town";
    const edit = await queueTableEvent(store, {
      kind: 'obligation', magnitude: 'major', targets: { ref: 'debt', label: 'debt' }, flavor: FLAVOR,
    });
    expect(edit).not.toBeNull();
    await store.getState().commitPendingEdits();

    // The receipt (an eventLog entry) carries the table provenance + verbatim flavor.
    const log = store.getState().eventLog;
    const receipt = log.find(e => e.event?.type === 'APPLY_STRESSOR');
    expect(receipt).toBeTruthy();
    expect(receipt.event.source).toBe('table');
    expect(receipt.event.tableFlavor).toBe(FLAVOR);
    // Free text is NOWHERE in the mechanical surface.
    const mechanical = JSON.stringify({ targetId: receipt.event.targetId, payload: receipt.event.payload });
    expect(mechanical).not.toContain('ransom');
    expect(mechanical).not.toContain('baron');

    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    // Survives reload: the receipt is on the persisted timeline.
    const reloaded = reloadInto(persistedEntry(store));
    const reloadedReceipt = reloaded.eventLog.find(e => e.event?.type === 'APPLY_STRESSOR');
    expect(reloadedReceipt?.event?.source).toBe('table');
  });

  test('an incident commits a canon flavor line tagged source:table (no mechanical delta), survives reload', async () => {
    const FLAVOR = 'The party drank the Guildmaster under the table.';
    await queueTableEvent(store, { kind: 'incident', flavor: FLAVOR });
    const before = store.getState().systemState;
    await store.getState().commitPendingEdits();

    const line = store.getState().eventLog.find(e => e.type === 'TABLE_INCIDENT');
    expect(line).toBeTruthy();
    expect(line.source).toBe('table');
    expect(line.narrativeSummary).toBe(FLAVOR);
    expect(line.flavor).toBe(true);
    // Pure flavor: no systemState change (before === after for the flavor entry).
    expect(line.beforeState).toEqual(before);

    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    const reloaded = reloadInto(persistedEntry(store));
    expect(reloaded.eventLog.some(e => e.type === 'TABLE_INCIDENT' && e.source === 'table')).toBe(true);
  });

  test('the lazy dispatcher FAILS CLOSED on a directive missing the table source', async () => {
    // A hand-crafted directive without the source stamp must be a no-op — no
    // receipt, no mutation. (Fabricates the payload to bypass the schema wall.)
    await store.getState().queueEdit('table-event', {
      directive: { dispatch: 'applyEvent', event: { type: 'APPLY_STRESSOR', targetId: 'debt', payload: { severity: 0.8 } } },
    });
    await store.getState().commitPendingEdits();
    expect(store.getState().eventLog.some(e => e.event?.type === 'APPLY_STRESSOR')).toBe(false);
  });

  test('the lazy dispatcher FAILS CLOSED on a non-table event type', async () => {
    await store.getState().queueEdit('table-event', {
      directive: { dispatch: 'applyEvent', event: { type: 'DESTROY_SETTLEMENT', targetId: 'x', source: 'table' } },
    });
    await store.getState().commitPendingEdits();
    expect(store.getState().eventLog.some(e => e.event?.type === 'DESTROY_SETTLEMENT')).toBe(false);
  });
});

// ── THE FOUR ECONOMY VERBS (atlas Part VII #11) ─────────────────────────────
// Four table kinds riding four EXISTING engine event types. These pins are the
// lockstep guard across the lane's four vocabulary sites (tableLedger KIND_SPEC,
// pendingEditIntents TABLE_EFFECTS, the writer's TABLE_AUTHORABLE set, and the
// eager tableEvents mirror): a kind that half-landed commits nothing, and the
// totality loop below is what says so out loud.
describe('R-5 the table economy verbs reach the world through existing physics', () => {
  let store;
  beforeEach(() => { store = makeStore(); withCanonSave(store); });

  const institutionNamed = (state, id) =>
    state.settlement.institutions.find(i => i.id === id);

  test('structure-harm(major) writes a banded capacity impairment, persists, survives reload', async () => {
    const FLAVOR = 'raiders fired the market stalls and the roof came down';
    await queueTableEvent(store, {
      kind: 'structure-harm', magnitude: 'major',
      targets: { ref: 'inst.market', label: 'Market' }, flavor: FLAVOR,
    });
    await store.getState().commitPendingEdits();

    const receipt = store.getState().eventLog.find(e => e.event?.type === 'IMPAIR_INSTITUTION');
    expect(receipt).toBeTruthy();
    expect(receipt.event.source).toBe('table');
    expect(receipt.event.tableFlavor).toBe(FLAVOR);
    // The mechanical surface carries the band and the fixed dimension only.
    expect(receipt.event.payload).toEqual({ severity: 0.8, dimension: 'capacity' });
    const mechanical = JSON.stringify({ targetId: receipt.event.targetId, payload: receipt.event.payload });
    expect(mechanical).not.toContain('raiders');
    expect(mechanical).not.toContain('roof');

    // The world actually changed: the institution carries the wound.
    const wound = institutionNamed(store.getState(), 'inst.market').impairments.at(-1);
    expect(wound.type).toBe('capacity');
    expect(wound.severity).toBe(0.8);

    await vi.waitFor(() => expect(saves.update).toHaveBeenCalled());
    const reloaded = reloadInto(persistedEntry(store));
    expect(reloaded.eventLog.some(e => e.event?.type === 'IMPAIR_INSTITUTION' && e.event.source === 'table')).toBe(true);
    expect(institutionNamed(reloaded, 'inst.market').impairments.at(-1).severity).toBe(0.8);
  });

  test('harm then mend on the SAME institution removes the wound (the lifecycle pair)', async () => {
    await queueTableEvent(store, {
      kind: 'structure-harm', magnitude: 'moderate',
      targets: { ref: 'inst.market', label: 'Market' }, flavor: 'a fire',
    });
    await store.getState().commitPendingEdits();
    expect(institutionNamed(store.getState(), 'inst.market').impairments).toHaveLength(1);

    await queueTableEvent(store, {
      kind: 'structure-restored',
      targets: { ref: 'inst.market', label: 'Market' }, flavor: 'the guild rebuilt it',
    });
    await store.getState().commitPendingEdits();

    // RESTORE heals the LATEST impairment — here the only one, so the market is whole.
    expect(institutionNamed(store.getState(), 'inst.market').impairments || []).toHaveLength(0);
    const mend = store.getState().eventLog.find(e => e.event?.type === 'RESTORE_INSTITUTION');
    expect(mend.event.source).toBe('table');
    expect(mend.event.payload).toEqual({});
  });

  test('supply-loss depletes a worked resource; supply-restored clears BOTH formats', async () => {
    await queueTableEvent(store, {
      kind: 'supply-loss', targets: { ref: 'timber', label: 'timber' }, flavor: 'the mill flooded',
    });
    await store.getState().commitPendingEdits();
    let cfg = store.getState().settlement.config;
    expect(cfg.nearbyResourcesDepleted).toContain('timber');
    expect(cfg.nearbyResourcesState.timber).toBe('depleted');

    // 'iron' starts depleted in the fixture (array format only) — recovering it
    // must clear the array entry AND not leave a stale 'depleted' state key.
    await queueTableEvent(store, {
      kind: 'supply-restored', targets: { ref: 'iron', label: 'iron' }, flavor: 'the seam reopened',
    });
    await store.getState().commitPendingEdits();
    cfg = store.getState().settlement.config;
    expect(cfg.nearbyResourcesDepleted).not.toContain('iron');
    expect(cfg.nearbyResourcesState?.iron).not.toBe('depleted');

    const back = store.getState().eventLog.find(e => e.event?.type === 'RECOVERED_RESOURCE');
    expect(back.event.source).toBe('table');
    // A BARE payload: the engine's own 0.7 severity default stands. The dial is
    // withheld on legibility grounds, not because the engine ignores it.
    expect(back.event.payload).toEqual({});
  });

  test('an economy verb TRIPS the R-3 freshness note (the detector working as designed)', async () => {
    const { economyFreshnessNote } = await import('../../src/domain/display/economyFreshness.js');
    expect(economyFreshnessNote(store.getState().settlement)).toBeNull();

    await queueTableEvent(store, {
      kind: 'structure-harm', magnitude: 'major',
      targets: { ref: 'inst.market', label: 'Market' }, flavor: 'a fire',
    });
    await store.getState().commitPendingEdits();

    const trail = store.getState().settlement.reconciliationLog;
    expect(trail.at(-1).changeType).toBe('IMPAIR_INSTITUTION');
    // IMPAIR_INSTITUTION declares economy keys in RERUN_KEYS_FOR_EVENT, so the
    // tallies are now older than the world. Saying so is CORRECT, not a defect.
    expect(economyFreshnessNote(store.getState().settlement)).toBeTruthy();
  });

  test('a MAJOR harm on a food anchor starves the town; a moderate one does not', async () => {
    // The sharpest consequence of the new verb, DECLARED rather than discovered.
    // impairInstitution raises the settlement-level food crisis only at severity
    // >= 0.6 with a capacity dimension, so 'major' (0.8) crosses it and
    // 'moderate' (0.5) does not. The Granary is a food anchor; the Market is not.
    const anchorLost = (s) => (s.settlement.activeConditions || [])
      .some(c => c.archetype === 'food_anchor_lost');

    await queueTableEvent(store, {
      kind: 'structure-harm', magnitude: 'moderate',
      targets: { ref: 'inst.granary', label: 'Granary' }, flavor: 'a cracked wall',
    });
    await store.getState().commitPendingEdits();
    expect(anchorLost(store.getState())).toBe(false);

    const grave = makeStore();
    withCanonSave(grave);
    await queueTableEvent(grave, {
      kind: 'structure-harm', magnitude: 'major',
      targets: { ref: 'inst.granary', label: 'Granary' }, flavor: 'the granary burned',
    });
    await grave.getState().commitPendingEdits();
    expect(anchorLost(grave.getState())).toBe(true);

    // A non-anchor never raises it, however grave the harm.
    const market = makeStore();
    withCanonSave(market);
    await queueTableEvent(market, {
      kind: 'structure-harm', magnitude: 'major',
      targets: { ref: 'inst.market', label: 'Market' }, flavor: 'razed',
    });
    await market.getState().commitPendingEdits();
    expect(anchorLost(market.getState())).toBe(false);
  });

  test('a stray mechanical field on a bare kind is CANONICALIZED away, not refused', async () => {
    // The same admission contract the obligation kind has carried since R-1
    // (pendingEditTransaction.test.js), now pinned for the dial-free kinds: the
    // queue stores only the reconstructed payload, so an unrecognized field is
    // scrubbed rather than becoming a refusal the DM cannot act on. The wall
    // against a smuggled DIAL is separate and lives on the record.
    const { record } = validateTableEvent({
      kind: 'supply-loss', targets: { ref: 'timber', label: 'timber' }, flavor: 'gone',
    });
    const directive = buildTableEffect(record);
    directive.event.payload = { unrecognizedMechanicalField: 99 };
    const intent = await store.getState().queueEdit('table-event', { directive, record });

    expect(intent).not.toBeNull();
    expect(intent.payload.directive.event.payload).toEqual({});

    // But a smuggled DIAL on a dial-free kind is refused outright.
    const smuggled = await store.getState().queueEdit('table-event', {
      directive: buildTableEffect(record),
      record: { ...record, band: 'major', severity: 0.8 },
    });
    expect(smuggled).toBeNull();
  });

  test('the writer FAILS CLOSED on a sibling event type outside the closed set', async () => {
    // IMPAIR_FACTION is real physics the composer can author — but it is NOT
    // table-authorable, and a fabricated directive must not smuggle it in.
    await store.getState().queueEdit('table-event', {
      directive: {
        dispatch: 'applyEvent',
        event: { type: 'IMPAIR_FACTION', targetId: 'fac.x', payload: { severity: 0.8 }, source: 'table' },
      },
    });
    await store.getState().commitPendingEdits();
    expect(store.getState().eventLog.some(e => e.event?.type === 'IMPAIR_FACTION')).toBe(false);
  });

  test('EVERY kind in the closed vocabulary commits end-to-end (the lockstep totality loop)', async () => {
    for (const kind of TABLE_EVENT_KINDS) {
      const fresh = makeStore();
      withCanonSave(fresh);
      const spec = KIND_SPEC[kind];
      const ref = REF_FOR_KIND[kind];
      expect(ref === null, `${kind} has no fixture target`).toBe(!spec.needsTarget);

      const queued = await queueTableEvent(fresh, {
        kind,
        flavor: `a ${kind} happened`,
        ...(spec.needsMagnitude ? { magnitude: 'moderate' } : {}),
        ...(spec.needsTarget ? { targets: { ref, label: String(ref) } } : {}),
      });
      expect(queued, `${kind} was refused at admission`).not.toBeNull();
      await fresh.getState().commitPendingEdits();

      // Every kind leaves a source:'table' receipt — a flavor line for the one
      // flavor kind, an engine-event entry for the seven mechanical ones.
      const log = fresh.getState().eventLog;
      const receipt = spec.dispatch === 'flavor'
        ? log.find(e => e.type === 'TABLE_INCIDENT')
        : log.find(e => e.event?.type === spec.eventType);
      expect(receipt, `${kind} committed NOTHING`).toBeTruthy();
      const stamped = spec.dispatch === 'flavor' ? receipt.source : receipt.event.source;
      expect(stamped, kind).toBe('table');
      // And nothing is left behind in the queue pretending to still be pending.
      expect(fresh.getState().pendingEditsQueue.filter(e => !e.reverted && !e.revertedAt), kind).toHaveLength(0);
    }
  });

  test('an unresolvable INSTITUTION ref is REFUSED typed and stays queued for review', async () => {
    // The tri-state honesty leg: a ref the handler cannot resolve vetoes, and
    // the intent is kept for the DM to fix — never silently cleared as applied.
    await queueTableEvent(store, {
      kind: 'structure-harm', magnitude: 'moderate',
      targets: { ref: 'inst.nowhere', label: 'Nowhere' }, flavor: 'a ghost',
    });
    const result = await store.getState().commitPendingEdits();

    expect(store.getState().eventLog.some(e => e.event?.type === 'IMPAIR_INSTITUTION')).toBe(false);
    expect(result.status).not.toBe('applied');
    const still = store.getState().pendingEditsQueue
      .filter(e => e.kind === 'table-event' && !e.reverted && !e.revertedAt);
    expect(still).toHaveLength(1);
  });

  test('an off-roster RESOURCE ref is recorded, not vetoed (declared handler behavior)', async () => {
    // DECLARED, NOT A DEFECT, and pinned so it is never re-found as one: unlike
    // findInstitution, resolveRosterKey falls back to the SLUG of the raw ref
    // (`rosterMatch || slug`), so DEPLETE/RECOVERED_RESOURCE accept a key the
    // live roster does not hold. That is deliberate upstream — mutateWorld's own
    // comment notes a re-rolled roster may only gain the key later, and the
    // recovered record is what forces it out there. Only an EMPTY ref vetoes
    // empty_target. The picker cannot produce an off-roster ref (its rosters are
    // drawn from live state); a clerk proposal could, and lands here.
    await queueTableEvent(store, {
      kind: 'supply-loss', targets: { ref: 'unobtainium', label: 'unobtainium' }, flavor: 'a ghost',
    });
    await store.getState().commitPendingEdits();
    expect(store.getState().settlement.config.nearbyResourcesDepleted).toContain('unobtainium');
  });
});

// SB1 store-registries — the no-silent-drop contract's PRECONDITION leg. An
// 'incident' (dispatch 'flavor') records ONLY in canon (recordCanonFlavorEntryImpl
// no-ops off-canon). On a DRAFT settlement, admitting one to the queue would clear
// it on commit with a success indication while writing NOTHING — the moment lost.
// queueEdit must refuse it at ADMISSION (immediate null), the way it already refuses
// an un-dispatched kind and a post-canon rename-npc.
describe('R-1 the session ledger — an incident on a DRAFT settlement is refused, not silently dropped', () => {
  function withDraftSave(store) {
    store.setState(s => {
      s.settlement = structuredClone(canonFixture());
      s.savedSettlements = [{
        id: SAVE_ID, name: 'Bridgeford', tier: 'town',
        settlement: structuredClone(canonFixture()),
        campaignState: { phase: 'draft', eventLog: [], systemState: {}, canonizedAt: null, editedAt: null },
      }];
      s.activeSaveId = SAVE_ID;
      s.phase = 'draft';
      s.eventLog = [];
      s.systemState = {};
    });
  }

  test('queueEdit refuses the incident (null) and NEVER queues it — no false success on commit', async () => {
    const store = makeStore();
    withDraftSave(store);
    const res = await queueTableEvent(store, { kind: 'incident', flavor: 'The tavern burned down.' });
    expect(res).toBeNull();
    // Nothing entered the queue, so commit is a no-op and no line is written.
    expect(store.getState().pendingEditsQueue.filter(e => !e.revertedAt)).toHaveLength(0);
    await store.getState().commitPendingEdits();
    expect(store.getState().eventLog.some(e => e.type === 'TABLE_INCIDENT')).toBe(false);
  });

  test('an OBLIGATION (dispatch applyEvent) is NOT over-refused on a draft — it still queues', async () => {
    const store = makeStore();
    withDraftSave(store);
    const res = await queueTableEvent(store, {
      kind: 'obligation', magnitude: 'major', targets: { ref: 'debt', label: 'debt' }, flavor: 'a debt fell due',
    });
    expect(res).not.toBeNull();
    expect(store.getState().pendingEditsQueue.filter(e => !e.revertedAt)).toHaveLength(1);
  });

  test('the same incident on a CANON settlement is admitted (the gate is the phase, not a wedge)', async () => {
    const store = makeStore();
    withCanonSave(store);
    const res = await queueTableEvent(store, { kind: 'incident', flavor: 'A festival was held.' });
    expect(res).not.toBeNull();
  });
});
