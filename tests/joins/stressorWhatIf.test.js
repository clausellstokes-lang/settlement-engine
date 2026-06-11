/**
 * Join harness — stressor what-ifs (proposeChange → applyChange) actually
 * apply.
 *
 * The seam: proposeChange('addStressor'/'removeStressor') wrote its proposal
 * under pendingChange.overrides.config — a key applyChange never read (it
 * only consumed overrides.institutionToggles). The what-if regenerated the
 * settlement from the unmodified raw _config and the proposed stressor
 * change silently did not apply. Worse, the dead override spread the
 * RESOLVED settlement.config snapshot wholesale, so fixing applyChange to
 * consume it as-was would have re-fed derived keys (stressTypes,
 * _magicTradeOnly, …) as generation input — the exact echo
 * stripDerivedConfigKeys exists to stop.
 *
 * The fix these tests pin:
 *   - proposeChange builds a config DELTA (selectedStresses /
 *     selectedStressesRandom, occasionally stressorEdits) — never a whole
 *     config — based on the EFFECTIVE stressor set (config.stressTypes,
 *     what the engine actually did), so under random mode an add keeps the
 *     emergent stressors and a remove drops exactly the named one instead
 *     of all of them;
 *   - applyChange layers pendingChange.overrides.config over the raw
 *     _config base it rebuilds, so the proposed keys win;
 *   - an explicit re-add supersedes a RESOLVE_STRESSOR suppression
 *     (config.stressorEdits.resolved) — without that, the pinned pool
 *     entry would be filtered right back out post-roll, a silent no-op.
 *
 * These tests boot the REAL zustand store (the worldConditionsRegen.test.js
 * harness) so they pin the wiring, not just the domain composition.
 */

import { describe, test, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

// Forced-empty stressor pool: generateStress returns null deterministically
// (Mode 2 with an empty selection), so the baseline carries no stressors.
const NO_STRESS_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
  selectedStressesRandom: false,
  selectedStresses: [],
};

// Random stress mode (the wizard default): Mode 3 probabilistic roll.
// Seed 'whatif-stress-132' deterministically rolls TWO emergent stressors
// (indebted + mass_migration) under this config — the multi-stressor
// baseline the continuity tests need.
const RANDOM_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};
const RANDOM_SEED = 'whatif-stress-132';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

// Minimal companion slices so settlementSlice's reads don't crash — mirrors
// the settlementSlice.test.js harness.
const stubSlice = () => ({
  auth: { user: null, tier: 'free', loading: false },
  config: { ...NO_STRESS_CFG },
  institutionToggles: {},
  categoryToggles: {},
  goodsToggles: {},
  servicesToggles: {},
  customContent: {},
  importedNeighbour: null,
  campaigns: [],
  campaignsLoaded: true,
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(), ...createSettlementSlice(...a) })));
}

function bootWith(config, seed) {
  const store = makeStore();
  const settlement = gen(config, seed);
  store.setState(s => {
    s.settlement = settlement;
    s.lastSeed = seed;
  });
  return store;
}

/** Stressor types as the container (the dual-written stress/stressors) carries them. */
const containerTypes = (s) => {
  const c = s.stressors ?? s.stress;
  const entries = Array.isArray(c) ? c : c ? [c] : [];
  return entries.map(e => e?.type).filter(Boolean);
};

describe('join: addStressor what-if applies through applyChange', () => {
  test('the proposed stressor is actually in the regenerated settlement', async () => {
    const store = bootWith(NO_STRESS_CFG, 'whatif-add-1');
    expect(containerTypes(store.getState().settlement)).toEqual([]);

    store.getState().proposeChange('addStressor', { stressType: 'famine' });

    // The override is a config DELTA — exactly the keys that change. A
    // whole-config spread here is the derived-echo regression (stressTypes
    // and friends re-entering as generation input).
    const override = store.getState().pendingChange?.overrides?.config;
    expect(Object.keys(override).sort())
      .toEqual(['selectedStresses', 'selectedStressesRandom']);
    expect(override.selectedStresses).toEqual(['famine']);
    expect(override.selectedStressesRandom).toBe(false);

    await store.getState().applyChange();

    const after = store.getState().settlement;
    // The famine is real: threaded channel, container, and the raw config
    // that every FUTURE regeneration rebuilds from.
    expect(after.config.stressTypes).toContain('famine');
    expect(containerTypes(after)).toContain('famine');
    expect(after._config.selectedStresses).toEqual(['famine']);
    expect(after._config.selectedStressesRandom).toBe(false);

    // Receipted as a what-if, and the proposal is consumed.
    expect(after.reconciliationLog.at(-1)).toMatchObject({
      source: 'what_if_change',
      changeType: 'addStressor',
      changeLabel: 'famine',
    });
    expect(store.getState().pendingChange).toBeNull();
  });

  test('random mode: an add KEEPS the emergent stressors (effective-set base)', async () => {
    const store = bootWith(RANDOM_CFG, RANDOM_SEED);
    expect(containerTypes(store.getState().settlement).sort())
      .toEqual(['indebted', 'mass_migration']);

    store.getState().proposeChange('addStressor', { stressType: 'famine' });
    await store.getState().applyChange();

    // A raw-pool base (selectedStresses is empty under random mode) would
    // have pinned [famine] alone and silently erased both emergent
    // stressors as a side effect of "adding" one.
    const after = store.getState().settlement;
    expect(containerTypes(after).sort())
      .toEqual(['famine', 'indebted', 'mass_migration']);
    expect(after._config.selectedStresses)
      .toEqual(expect.arrayContaining(['indebted', 'mass_migration', 'famine']));
    expect(after._config.selectedStressesRandom).toBe(false);
  });

  test('re-adding an event-resolved stressor supersedes the suppression', async () => {
    // A RESOLVE_STRESSOR event leaves config.stressorEdits.resolved, which
    // filters config-forced re-rolls of the type post-roll. Baseline:
    // famine is in the pool but suppressed.
    const cfg = {
      ...NO_STRESS_CFG,
      selectedStresses: ['famine'],
      stressorEdits: { resolved: ['famine'] },
    };
    const store = bootWith(cfg, 'whatif-readd-1');
    expect(containerTypes(store.getState().settlement)).toEqual([]);

    store.getState().proposeChange('addStressor', { stressType: 'famine' });
    await store.getState().applyChange();

    // Without clearing the suppression the pinned pool entry is filtered
    // right back out — the silent no-op this what-if existed to avoid.
    const after = store.getState().settlement;
    expect(containerTypes(after)).toEqual(['famine']);
    expect(after._config.stressorEdits.resolved).not.toContain('famine');
  });
});

describe('join: removeStressor what-if applies through applyChange', () => {
  test('exactly the named stressor goes; the rest of the pool survives', async () => {
    const cfg = { ...NO_STRESS_CFG, selectedStresses: ['famine', 'under_siege'] };
    const store = bootWith(cfg, 'whatif-remove-1');
    expect(containerTypes(store.getState().settlement).sort())
      .toEqual(['famine', 'under_siege']);

    store.getState().proposeChange('removeStressor', { stressType: 'under_siege' });
    await store.getState().applyChange();

    const after = store.getState().settlement;
    expect(containerTypes(after)).toEqual(['famine']);
    expect(after.config.stressTypes).toEqual(['famine']);
    expect(after._config.selectedStresses).toEqual(['famine']);
    expect(after.reconciliationLog.at(-1)).toMatchObject({
      source: 'what_if_change',
      changeType: 'removeStressor',
      changeLabel: 'under_siege',
    });
  });

  test('random mode: a remove drops ONLY the named stressor (effective-set base)', async () => {
    const store = bootWith(RANDOM_CFG, RANDOM_SEED);
    expect(containerTypes(store.getState().settlement).sort())
      .toEqual(['indebted', 'mass_migration']);

    store.getState().proposeChange('removeStressor', { stressType: 'indebted' });
    await store.getState().applyChange();

    // A raw-pool base would have produced an empty pinned pool — removing
    // EVERY stressor instead of the one the user pointed at.
    const after = store.getState().settlement;
    expect(containerTypes(after)).toEqual(['mass_migration']);
    expect(after._config.selectedStresses).toEqual(['mass_migration']);
    expect(after._config.selectedStressesRandom).toBe(false);
  });
});
