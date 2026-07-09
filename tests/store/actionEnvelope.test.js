/**
 * actionEnvelope.test.js — Track K §C1 adoption ratchet.
 *
 * The North Star (docs/TRACK_K_DESIGN.md §C1): every converted canon-path action
 * returns a uniform ActionResult envelope, and the set of converted actions is
 * GROW-ONLY. A converted action can never quietly return a bespoke shape again.
 *
 * This pin enforces both halves:
 *   1. Every action in CONVERTED_ACTIONS, driven to success through a minimal
 *      zustand+immer store harness, returns a schema-conformant envelope
 *      (the schema walk below). Regress one to its old bespoke shape → fail.
 *   2. GROW-ONLY: C1_BASELINE (the five canon-path actions converted in C1) must
 *      remain a subset of CONVERTED_ACTIONS forever. Remove one → fail. Adding a
 *      new action is allowed — and REQUIRES adding both a CONVERTED_ACTIONS entry
 *      and an INVOKERS driver, which the "list and harness stay in sync" test
 *      enforces. That is the ratchet: the list only ever grows, and everything on
 *      it is proven to speak the envelope.
 *
 * Adoption order (design doc): the five canon-path actions first, then
 * EventComposer's command path, then world-pulse mutators. Never speculative —
 * an action joins this list when a consumer needs its envelope.
 */

import { describe, test, expect, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// Keep the durable-persistence seam quiet: destroySavedSettlement drives
// persistSaveUpdate → saves.update. The envelope shape doesn't depend on the
// cloud result, so stub it (mirrors versionHistory.test.js).
vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

import { createSettlementSlice } from '../../src/store/settlementSlice.js';

// ── Checked-in adoption list (GROW-ONLY) ────────────────────────────────────
// The five canon-path actions share the persistSaveUpdate seam C3 needs; they
// were converted first. To convert another action: add its id here AND an
// INVOKERS entry that drives it to success. NEVER remove an entry.
const CONVERTED_ACTIONS = [
  'applyEvent',
  'undoLastEvent',
  'recordSnapshot',
  'revertToSnapshot',
  'destroySavedSettlement',
];

// The C1 floor. CONVERTED_ACTIONS may grow past this but must always contain it
// — this is the mechanical "grow-only" guard (removing a converted action, or
// renaming it out of the list, fails the subset assertion below).
const C1_BASELINE = Object.freeze([
  'applyEvent',
  'undoLastEvent',
  'recordSnapshot',
  'revertToSnapshot',
  'destroySavedSettlement',
]);

// ── Minimal store harness (mirrors settlementSlice.test.js) ─────────────────
const stubSlice = (set) => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { settType: 'town', culture: 'germanic', terrain: 'grassland', tradeRouteAccess: 'road' },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  setCampaignRegionalGraph: (campaignId, graph) => set(state => {
    const campaign = state.campaigns.find(c => c.id === campaignId);
    if (campaign) campaign.regionalGraph = graph;
  }),
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function fixture() {
  return {
    tier: 'town',
    name: 'Testford',
    population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [
      { id: 'institution.granary', name: 'Granary', category: 'civic', status: 'active' },
      { id: 'institution.temple', name: 'Temple', category: 'religious', status: 'active' },
    ],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: {
      factions: [
        { id: 'faction.council', name: 'Council' },
        { id: 'faction.merchants', name: 'Merchants' },
      ],
      conflicts: [],
    },
    npcs: [],
    activeConditions: [],
  };
}

const damageEvent = (id) => ({
  id, type: 'DAMAGE_INSTITUTION', targetId: 'institution.granary',
  payload: { severity: 0.8 }, cause: 'player_action',
});

// One driver per converted action: sets up the store, invokes the action on its
// SUCCESS path, and returns the raw result. If CONVERTED_ACTIONS grows, a driver
// MUST be added here (the sync test enforces it).
const INVOKERS = {
  applyEvent: () => {
    const store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
    store.getState().refreshSystemState();
    store.getState().canonize();
    return store.getState().applyEvent(damageEvent('env-apply'));
  },
  undoLastEvent: () => {
    const store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
    store.getState().refreshSystemState();
    store.getState().canonize();
    store.getState().applyEvent(damageEvent('env-undo'));
    return store.getState().undoLastEvent();
  },
  recordSnapshot: () => {
    const store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
    return store.getState().recordSnapshot({ kind: 'manual', label: 'ratchet' });
  },
  revertToSnapshot: () => {
    const store = makeStore();
    store.setState(s => { s.settlement = fixture(); });
    const snap = store.getState().recordSnapshot({ kind: 'manual', label: 'ratchet-base' });
    store.setState(s => { s.settlement.name = 'Mutated'; });
    return store.getState().revertToSnapshot({ snapshotId: snap.after.snapshotId });
  },
  destroySavedSettlement: () => {
    const store = makeStore();
    store.setState(s => {
      s.savedSettlements = [{ id: 'save-x', name: 'Doomed', settlement: fixture() }];
    });
    return store.getState().destroySavedSettlement('save-x', 'meteor');
  },
};

/**
 * The ActionResult schema walk. Every required field must be present with the
 * right type; extra keys are tolerated (the envelope is a SUPERSET). Kept
 * inline (not imported) so a mistaken loosening of makeActionResult can't also
 * loosen the check.
 * @param {*} v
 * @returns {boolean}
 */
function isActionResult(v) {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return false;
  const isPlainObjOrNull = (x) => x === null || (typeof x === 'object' && !Array.isArray(x));
  if (typeof v.ok !== 'boolean') return false;
  if (typeof v.action !== 'string' || v.action.length === 0) return false;
  if (!isPlainObjOrNull(v.before)) return false;
  if (!isPlainObjOrNull(v.after)) return false;
  if (!Array.isArray(v.receipts)) return false;
  if (!Array.isArray(v.persistenceOps)) return false;
  if (!isPlainObjOrNull(v.analyticsEvent)) return false;
  if (!(v.userMessage === null || typeof v.userMessage === 'string')) return false;
  return true;
}

describe('Track K §C1 — ActionResult adoption ratchet', () => {
  test('every converted action returns a schema-conformant envelope', () => {
    for (const action of CONVERTED_ACTIONS) {
      const invoke = INVOKERS[action];
      expect(invoke, `missing INVOKERS driver for converted action "${action}"`).toBeTypeOf('function');
      const result = invoke();
      expect(isActionResult(result), `${action} returned a non-envelope: ${JSON.stringify(result)}`).toBe(true);
      // The envelope must self-identify as the action that produced it.
      expect(result.action).toBe(action);
    }
  });

  test('GROW-ONLY: the C1 baseline five stay converted forever', () => {
    for (const action of C1_BASELINE) {
      expect(CONVERTED_ACTIONS, `converted action "${action}" was removed from the list`).toContain(action);
    }
  });

  test('the converted list has no duplicates', () => {
    expect(new Set(CONVERTED_ACTIONS).size).toBe(CONVERTED_ACTIONS.length);
  });

  test('list and harness stay in sync (every converted action has a driver)', () => {
    for (const action of CONVERTED_ACTIONS) {
      expect(INVOKERS[action], `add an INVOKERS driver for "${action}"`).toBeTypeOf('function');
    }
  });

  test('each envelope carries receipts/persistenceOps arrays', () => {
    // receipts is now the Track K §C2 Receipt[] (persistenceOps stays loose for
    // C3). Pin that they are arrays, that applyEvent's receipt is the derived
    // 'event' Receipt for this event (not the raw eventLog entry), and that the
    // persisting success paths carry at least one op so C3 has a real seam.
    const applied = INVOKERS.applyEvent();
    expect(Array.isArray(applied.receipts)).toBe(true);
    expect(applied.receipts[0]?.source).toBe('event');
    expect(applied.receipts[0]?.id).toBe('event:env-apply:0'); // `${source}:${event.id}:${n}`
    const destroyed = INVOKERS.destroySavedSettlement();
    expect(destroyed.persistenceOps.length).toBeGreaterThan(0);
    expect(destroyed.persistenceOps[0].saveId).toBe('save-x');
  });
});
