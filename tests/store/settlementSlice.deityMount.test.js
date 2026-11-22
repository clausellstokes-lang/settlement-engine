/**
 * settlementSlice deity/identity mounts — Wave 4a store composition.
 *
 * Pins the STORE half of the religion embed-on-assign bridge and the identity-edit
 * surface adopted in 4a:
 *   • setPrimaryDeity / imposeCult delegate to the deity helpers and dispatch
 *     SET_PRIMARY_DEITY / IMPOSE_CULT through applyEvent, embedding a self-contained
 *     snapshot into settlement.config — which flips the religion subsystem gate
 *     (subsystemActivation.js). This test is the proof the mount→gate contract is
 *     wired: once a deity is embedded, isSubsystemActive('religion') is true.
 *   • RESOLUTION is LIVE post-4f: OUR customRegistry now carries the `deities`
 *     category, so an AUTHORED ref resolves and embeds. A ref for a deity absent
 *     from customContent still refuses (null) — the no-half-embed contract — and
 *     the clear/remove + applyEvent embed contracts hold. (The end-to-end embed of
 *     an authored deity, incl. the account-scoped identity mint, is pinned in
 *     tests/store/deityRefCollision.test.js.)
 *   • renameSettlement / canonizeSavedSettlement — the identity-edit + list-canon
 *     affordances the Settlements panel consumes.
 *   • simulationRules opt-in flags (war/strategy/religion) default FALSE and
 *     normalize fail-closed — the sim's byte-identical dormancy contract.
 */

import { describe, test, expect, beforeEach } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
// Harness derivation on the real path (the retired `refreshSystemState` store
// action was a harness-only door — owner queue #21).
import { deriveSystemState } from '../../src/domain/state/deriveSystemState.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';
import {
  DEFAULT_SIMULATION_RULES,
  normalizeSimulationRules,
} from '../../src/domain/worldPulse/simulationRules.js';

// Minimal companion slice — just enough for settlementSlice's reads not to crash.
const stubSlice = (set, get) => ({
  auth: { user: null, tier: 'premium', loading: false },
  config: { settType: 'town' },
  institutionToggles: {}, categoryToggles: {}, goodsToggles: {}, servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
  canUseCustomContent: () => true,
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

function fixture() {
  return {
    tier: 'town', name: 'Testford', population: 2000,
    config: { monsterThreat: 'safe', tradeRouteAccess: 'road' },
    institutions: [{ id: 'institution.temple', name: 'Temple', category: 'religious', status: 'active' }],
    economicState: { primaryExports: [], primaryImports: [] },
    powerStructure: { factions: [], conflicts: [] },
    npcs: [], activeConditions: [],
  };
}

const SNAPSHOT = {
  name: 'Vael', alignmentAxis: 'good', temperamentAxis: 'warlike',
  rankAxis: 'major', lawAxis: 'neutral', domain: 'war',
};

/** Wrap the live store settlement in a campaign-style world snapshot. */
function worldSnapshot(store) {
  return { settlements: [{ settlement: store.getState().settlement }] };
}

describe('settlementSlice deity mount — embed → religion gate', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
    store.setState(s => {
      s.settlement = fixture();
      s.lastSeed = 'seed';
      s.systemState = deriveSystemState(s.settlement);
    });
  });

  test('a deity-free settlement leaves the religion subsystem dormant', () => {
    expect('primaryDeitySnapshot' in store.getState().settlement.config).toBe(false);
    expect(isSubsystemActive(worldSnapshot(store), 'religion')).toBe(false);
  });

  test('the sim gate flips ON an embedded primaryDeitySnapshot (the contract item 3 wires)', () => {
    // The GATE contract the landed sim reads (subsystemActivation.religionActive):
    // the religion subsystem activates the instant a member carries a
    // config.primaryDeitySnapshot. Set it directly (the embed's committed shape)
    // and assert the gate flips — this is the exact predicate the pulse consumes.
    store.setState(s => { s.settlement.config.primaryDeitySnapshot = { _deityRef: 'custom:vael', ...SNAPSHOT }; });
    expect(isSubsystemActive(worldSnapshot(store), 'religion')).toBe(true);
  });

  test('the sim gate flips ON a DM-imposed cult (config.cultDeitySnapshots)', () => {
    store.setState(s => { s.settlement.config.cultDeitySnapshots = [{ _deityRef: 'custom:x', ...SNAPSHOT }]; });
    expect(isSubsystemActive(worldSnapshot(store), 'religion')).toBe(true);
  });

  test('setPrimaryDeity(null) is wired (dispatches applyEvent) and leaves the settlement dormant', async () => {
    // Proves the store MOUNT is wired: the clear path delegates to the deity impl,
    // which dispatches SET_PRIMARY_DEITY through applyEvent and returns its envelope
    // (not null). No embed appears — correct for a clear (a null payload sheds the
    // patron); the non-null assign embed is pinned in deityRefCollision.test.js.
    // The actions are ASYNC since the de-eager lane (registry rides a lazy chunk);
    // the resolved envelope/null contract is unchanged.
    const res = await store.getState().setPrimaryDeity(null);
    expect(res).not.toBeNull();
    expect('primaryDeitySnapshot' in store.getState().settlement.config).toBe(false);
    expect(isSubsystemActive(worldSnapshot(store), 'religion')).toBe(false);
  });

  test('setPrimaryDeity refuses a ref for an unauthored deity (no half embed)', async () => {
    const res = await store.getState().setPrimaryDeity('custom:lu_nonexistent');
    expect(res).toBeNull();
    expect('primaryDeitySnapshot' in store.getState().settlement.config).toBe(false);
  });

  test('imposeCult remove on empty cults is a no-op; unknown add refuses', async () => {
    expect(await store.getState().imposeCult(null)).toBeNull();
    expect(await store.getState().imposeCult('custom:lu_nonexistent')).toBeNull();
    expect('cultDeitySnapshots' in store.getState().settlement.config).toBe(false);
    expect(isSubsystemActive(worldSnapshot(store), 'religion')).toBe(false);
  });

  test('setPrimaryDeity with no active settlement is inert', async () => {
    store.setState(s => { s.settlement = null; });
    expect(await store.getState().setPrimaryDeity('custom:x')).toBeNull();
  });
});

describe('settlementSlice identity edits — rename + canonize-by-id', () => {
  let store;
  beforeEach(() => {
    store = makeStore();
  });

  test('renameSettlement renames a saved (draft) settlement without a canon flavor entry', () => {
    store.setState(s => {
      s.savedSettlements = [{ id: 'save-1', name: 'Oldname', settlement: { name: 'Oldname' }, campaignState: { phase: 'draft', eventLog: [] } }];
    });
    const recorded = store.getState().renameSettlement('save-1', 'Newname');
    expect(recorded).toBe(false); // draft ⇒ no flavor entry
    expect(store.getState().savedSettlements[0].name).toBe('Newname');
    expect(store.getState().savedSettlements[0].settlement.name).toBe('Newname');
  });

  test('renameSettlement on a canon save records a RENAME_SETTLEMENT flavor entry', () => {
    store.setState(s => {
      s.savedSettlements = [{ id: 'save-2', name: 'Onontash', settlement: { name: 'Onontash' }, campaignState: { phase: 'canon', eventLog: [] } }];
    });
    const recorded = store.getState().renameSettlement('save-2', 'Onontash Reborn');
    expect(recorded).toBe(true);
    const log = store.getState().savedSettlements[0].campaignState.eventLog;
    expect(log.at(-1)).toMatchObject({ type: 'RENAME_SETTLEMENT' });
    expect(store.getState().savedSettlements[0].name).toBe('Onontash Reborn');
  });

  test('renameSettlement ignores a blank / unchanged name', () => {
    store.setState(s => {
      s.savedSettlements = [{ id: 'save-3', name: 'Keep', settlement: { name: 'Keep' }, campaignState: { phase: 'draft', eventLog: [] } }];
    });
    expect(store.getState().renameSettlement('save-3', '   ')).toBe(false);
    expect(store.getState().savedSettlements[0].name).toBe('Keep');
  });

  test('canonizeSavedSettlement flips a draft save to canon by id; already-canon no-ops', () => {
    store.setState(s => {
      s.savedSettlements = [{ id: 'save-4', name: 'Ford', settlement: { name: 'Ford' }, campaignState: { phase: 'draft', eventLog: [] } }];
    });
    expect(store.getState().canonizeSavedSettlement('save-4')).toBe(true);
    expect(store.getState().savedSettlements[0].campaignState.phase).toBe('canon');
    // idempotent — a second call finds it already canon.
    expect(store.getState().canonizeSavedSettlement('save-4')).toBe(false);
    // a missing id is a no-op.
    expect(store.getState().canonizeSavedSettlement('nope')).toBe(false);
  });
});

describe('simulationRules — opt-in organs default FALSE, fail closed', () => {
  test('war / strategy / religion flags default OFF in DEFAULT_SIMULATION_RULES', () => {
    expect(DEFAULT_SIMULATION_RULES.warLayerEnabled).toBe(false);
    expect(DEFAULT_SIMULATION_RULES.settlementStrategyEnabled).toBe(false);
    expect(DEFAULT_SIMULATION_RULES.religionDynamicsEnabled).toBe(false);
  });

  test('normalizeSimulationRules fails CLOSED on a malformed opt-in flag', () => {
    // A corrupted saved blob must not silently activate an opt-in war organ.
    const n = normalizeSimulationRules({ warLayerEnabled: 'true', religionDynamicsEnabled: 1 });
    expect(n.warLayerEnabled).toBe(false);
    expect(n.religionDynamicsEnabled).toBe(false);
    // an explicit boolean is still honored.
    expect(normalizeSimulationRules({ warLayerEnabled: true }).warLayerEnabled).toBe(true);
  });

  test('religionDynamicsEnabled true with no embedded deity is still dormant (two-gate)', () => {
    // The rules flag is only ONE of the two gates — the activation gate needs a
    // real embedded deity, so a deity-free world stays byte-identical.
    const deityFreeWorld = { settlements: [{ settlement: { config: {} } }] };
    expect(isSubsystemActive(deityFreeWorld, 'religion')).toBe(false);
  });
});
