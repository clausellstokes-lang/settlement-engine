/**
 * tests/store/advanceFullAutoResolve.test.js — FULL AUTO-RESOLVE at the STORE seam
 * (realm directive 7, binding design ruling J-D7).
 *
 * The domain half (the fold, the equivalence invariant, the mark's two polarities) is
 * pinned headlessly in tests/domain/autoAdjudication.test.js. THIS file pins the seam
 * that decides WHEN the fold runs, because that decision is the whole safety story:
 *
 *   • TOGGLE ON  — a real Advance through the real store empties the proposal docket
 *     and every ruling is stamped `adjudicatedBy: 'engine_auto'`, committed in the
 *     SAME atomic Phase-2 write as the advance (one persist, one undo step).
 *   • TOGGLE OFF — the docket still waits for the DM and no row carries a mark. This
 *     is the byte-identity control for every world whose DM never opted in.
 *   • EXPLICIT-OPTION CALLERS ARE UNAFFECTED — the living/autonomous catch-up derives
 *     its own autoResolve and passes it as an option; full-auto deliberately does NOT
 *     ride that. Pinned by running the SAME catch-up-shaped advance with the toggle ON
 *     and with it OFF and byte-comparing the two committed worlds. An unversioned
 *     semantics change to existing autonomous seeds is exactly what THE PROMISE
 *     forbids, so it is proven absent rather than argued absent.
 *   • UNDO — one advance plus its verdicts is ONE undo step back to the pre-advance
 *     world, with the docket restored to pending.
 *
 * The fixture is the rival/hostile two-edge realm from advancePauseResume.test.js: its
 * one_month advance mints six proposal-gated majors through the real candidate
 * pipeline, so nothing here is a hand-built proposal row.
 */

import { beforeEach, describe, expect, test, vi } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

vi.mock('../../src/lib/saves.js', () => ({
  saves: { update: vi.fn(() => Promise.resolve()), isConfigured: false },
}));

vi.mock('../../src/lib/campaigns.js', () => {
  const cached = new Map();
  const clone = value => JSON.parse(JSON.stringify(value));
  return {
    isCampaignActive: campaign => (campaign?.accessState || 'active') === 'active',
    campaigns: {
      loadCached: vi.fn((ownerId = 'anon') => clone(cached.get(ownerId) || [])),
      cache: vi.fn((campaigns = [], ownerId = 'anon') => { cached.set(ownerId, clone(campaigns)); }),
      list: vi.fn(() => Promise.resolve([])),
      upsert: vi.fn(campaign => Promise.resolve(campaign?.id)),
      delete: vi.fn(() => Promise.resolve()),
      isConfigured: false,
    },
  };
});

let multiTickValue = true;
vi.mock('../../src/lib/flags.js', () => ({
  flag: vi.fn(name => (name === 'advanceMultiTick' ? multiTickValue : false)),
}));

vi.mock('../../src/lib/analytics.js', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, track: vi.fn() };
});

import { createCampaignSlice } from '../../src/store/campaignSlice.js';
import { createCampaignWorldPulseSlice } from '../../src/store/campaignWorldPulseSlice.js';
import { ensureRegionalGraph } from '../../src/domain/region/index.js';
import { ENGINE_AUTO_ADJUDICATOR, isEngineAdjudicated } from '../../src/domain/worldPulse/autoAdjudication.js';

function installLocalStorage() {
  const data = new Map();
  globalThis.localStorage = {
    getItem: key => data.get(String(key)) ?? null,
    setItem: (key, value) => { data.set(String(key), String(value)); },
    removeItem: key => { data.delete(String(key)); },
    clear: () => { data.clear(); },
  };
}

const stubSlice = () => ({
  savedSettlements: [], settlement: null, activeSaveId: null, phase: 'draft',
  eventLog: [], locks: {}, generatedAt: null, editedAt: null, canonizedAt: null, lastExportAt: null,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createCampaignSlice(...a), ...createCampaignWorldPulseSlice(...a) })));
}

function settlement(name) {
  return {
    name, tier: 'town', population: 1800,
    config: { tradeRouteAccess: 'road', priorityEconomy: 25, priorityMilitary: 30 },
    institutions: [],
    economicState: { primaryImports: ['Bulk grain and foodstuffs'], primaryExports: [] },
    powerStructure: {
      publicLegitimacy: { score: 40, label: 'Contested' },
      factions: [
        { faction: 'Merchant League', category: 'economy', power: 60 },
        { faction: 'Temple Wardens', category: 'religious', power: 48 },
      ],
      conflicts: [],
    },
    npcs: [{ id: `${name}-reeve`, name: `Reeve of ${name}`, importance: 'key' }],
    activeConditions: [{ archetype: 'regional_import_shortage', severity: 0.5 }],
  };
}

function seedStore(store) {
  store.setState(state => {
    state.savedSettlements = ['a', 'b', 'c'].map(id => ({
      id, name: id, phase: 'canon',
      settlement: settlement(id),
      campaignState: { phase: 'canon', eventLog: [], locks: {} },
    }));
    state.campaigns = [{
      id: 'camp-1', name: 'Realm', settlementIds: ['a', 'b', 'c'],
      regionalGraph: ensureRegionalGraph({
        edges: [
          { id: 'edge.a.b', from: 'a', to: 'b', relationshipType: 'rival' },
          { id: 'edge.b.c', from: 'b', to: 'c', relationshipType: 'hostile' },
        ],
      }),
      wizardNews: { currentTick: 0, entries: [] },
      worldState: { rngSeed: 'pause-store-seed', tick: 0, canonizedAt: '2026-01-01T00:00:00.000Z' },
    }];
  });
}

const NOW = '2026-01-01T00:00:00.000Z';
const worldOf = store => store.getState().campaigns[0].worldState;
const proposalsOf = store => worldOf(store).proposals || [];
const pendingOf = store => proposalsOf(store).filter(p => p.status === 'pending');

/** Drop the wall-clock save stamp (policy 'stamp' — see the undo test's comment). */
const withoutStamp = ({ timestamp: _stamp, ...save }) => save;

/** Seed a store with the toggle already in the given mode. */
function storeInMode(autoResolve) {
  const store = makeStore();
  seedStore(store);
  store.getState().setAdvanceAutoResolve(autoResolve);
  return store;
}

describe('FULL AUTO-RESOLVE — the toggle governs the proposal docket', () => {
  beforeEach(() => {
    installLocalStorage();
    multiTickValue = true;
  });

  test('the toggle setter is the single shared switch and defaults OFF', () => {
    const store = makeStore();
    expect(store.getState().advanceAutoResolve).toBe(false);
    store.getState().setAdvanceAutoResolve(true);
    expect(store.getState().advanceAutoResolve).toBe(true);
    store.getState().setAdvanceAutoResolve(false);
    expect(store.getState().advanceAutoResolve).toBe(false);
  });

  test('toggle ON: the advance empties the docket and signs every ruling as engine_auto', async () => {
    const store = storeInMode(true);
    const result = await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });

    expect(result.status).toBe('complete');
    // The advance really did mint proposal-gated majors (guard the guard).
    expect((result.proposals || []).length).toBeGreaterThan(0);
    // …and NONE of them is still waiting for the DM.
    expect(proposalsOf(store).length).toBe((result.proposals || []).length);
    expect(pendingOf(store).length).toBe(0);
    expect(proposalsOf(store).every(isEngineAdjudicated)).toBe(true);
    expect([...new Set(proposalsOf(store).map(p => p.adjudicatedBy))]).toEqual([ENGINE_AUTO_ADJUDICATOR]);
    // The rulings landed in the SAME atomic advance: one undo snapshot, not one per row.
    expect(store.getState().pulseUndoStack.filter(s => s.campaignId === 'camp-1')).toHaveLength(1);
  });

  test('toggle OFF: the docket still waits for the DM and no row carries a mark', async () => {
    const store = storeInMode(false);
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });

    const rows = proposalsOf(store);
    // Anchor: the docket is live and populated, so the absence below is about the
    // MARK, not about an empty or never-built proposal list.
    expect(rows.length).toBeGreaterThan(0);
    expect(pendingOf(store).length).toBe(rows.length);
    for (const row of rows) {
      // anchored: the rows were just proven present and pending on the line above
      expect(row).not.toHaveProperty('adjudicatedBy');
    }
  });

  test('an EXPLICIT autoResolve option (the catch-up shape) never engages full auto', async () => {
    // The living/autonomous catch-up passes its own autoResolve. Full auto must not
    // ride it, or an autonomous world's semantics would shift with no DM decision.
    const store = storeInMode(false);
    await store.getState().advanceCampaignWorld('camp-1', 'one_week', {
      now: NOW, autoResolve: true, weeks: 4,
    });
    const rows = proposalsOf(store);
    expect(rows.length).toBeGreaterThan(0);
    expect(pendingOf(store).length).toBe(rows.length);
    expect(rows.some(isEngineAdjudicated)).toBe(false);
  });

  test('NEGATIVE CONTROL: an explicit-option advance is BYTE-IDENTICAL with the toggle ON or OFF', async () => {
    const off = storeInMode(false);
    const on = storeInMode(true);
    const args = /** @type {const} */ (['camp-1', 'one_week', { now: NOW, autoResolve: true, weeks: 4 }]);
    await off.getState().advanceCampaignWorld(...args);
    await on.getState().advanceCampaignWorld(...args);
    // Same world, same docket, same everything: the toggle cannot reach this path.
    expect(JSON.stringify(worldOf(on))).toBe(JSON.stringify(worldOf(off)));
    expect(JSON.stringify(on.getState().savedSettlements)).toBe(
      JSON.stringify(off.getState().savedSettlements));
  });

  test('the multi-tick KILLSWITCH does not disable the mode (the docket exists on both paths)', async () => {
    // advanceMultiTick OFF falls back to the single-tick advance. The PAUSE half of
    // the toggle is inert there (nothing pauses), but the DOCKET half must not be: a
    // killswitch flip is an engineering rollback of the advance PATH, and it must not
    // silently revoke the play mode the DM chose.
    multiTickValue = false;
    const store = storeInMode(true);
    // The single-tick path runs ONE kernel week per press, and this fixture's first
    // proposal-gated major surfaces a few weeks in — so press until the docket exists.
    let minted = 0;
    for (let week = 0; week < 8; week += 1) {
      const result = await store.getState().advanceCampaignWorld('camp-1', 'one_week', { now: NOW });
      minted += (result.proposals || []).length;
    }
    expect(minted).toBeGreaterThan(0);
    expect(proposalsOf(store).length).toBeGreaterThan(0);
    expect(pendingOf(store).length).toBe(0);
    expect(proposalsOf(store).every(isEngineAdjudicated)).toBe(true);
  });

  test('UNDO: one advance plus its verdicts is ONE step back, leaving no residue', async () => {
    const store = storeInMode(true);
    await store.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW });
    expect(proposalsOf(store).length).toBeGreaterThan(0);
    expect(pendingOf(store).length).toBe(0);
    expect(await store.getState().undoLastPulse('camp-1')).toBe(true);
    // The pre-advance world had no docket at all, so the rulings are gone WITH the
    // advance that made them — never stranded as applied rows on a rolled-back world.
    expect(worldOf(store).tick).toBe(0);
    expect(proposalsOf(store).length).toBe(0);
    expect(worldOf(store).pulseHistory).toEqual([]);

    // The CONTROL: the same advance run WITHOUT full auto (an explicit option, so the
    // toggle cannot reach it), then undone. If full auto left any residue behind — a
    // stranded ledger entry, a news tail, a graph edge — the two rolled-back worlds
    // would differ. They are compared byte-for-byte, world and settlements alike.
    const control = storeInMode(false);
    await control.getState().advanceCampaignWorld('camp-1', 'one_month', { now: NOW, autoResolve: true });
    expect(await control.getState().undoLastPulse('camp-1')).toBe(true);
    expect(JSON.stringify(worldOf(store))).toBe(JSON.stringify(worldOf(control)));
    // Save `.timestamp` is re-stamped with wall-clock now by undoLastPulse BY DESIGN
    // (registered policy 'stamp' in tests/store/lifecycleRoundTrip.test.js), so it is
    // the one documented byte-compare exclusion here — everything else must match.
    expect(JSON.stringify(store.getState().savedSettlements.map(withoutStamp))).toBe(
      JSON.stringify(control.getState().savedSettlements.map(withoutStamp)));
  });
});
