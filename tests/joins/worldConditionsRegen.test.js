/**
 * Join harness — world/party-authored conditions survive the slice's
 * regeneration paths (applyChange + generateSettlement).
 *
 * The seam: domain/worldPulse/reconcile.js states the policy ("world/party-
 * authored conditions survive a local regeneration") and exposes
 * preserveWorldConditions for the regeneration path — but it was only wired
 * into applyEvent, which is not a regeneration. Both real regeneration paths
 * (applyChange's what-if rebuild, generateSettlement's reroll) wholesale-
 * replaced the settlement, so every WORLD_PULSE / WORLD_STRESSOR /
 * PARTY_ACTION / regional-channel condition on a canon-save-hydrated
 * settlement vanished on the first regen click — while EVENT-authored
 * conditions survived via config.eventConditions (reapplyEventConditions),
 * a DM-visible asymmetry.
 *
 * These tests boot the REAL zustand store (the settlementSlice.test.js
 * harness) so they pin the wiring, not just the domain composition:
 *   - applyChange must thread reconcileSettlementChange(result, prior);
 *   - generateSettlement must do the same on a reroll of the WORKING DRAFT,
 *     and stay silent on a first generation (no prior settlement → no
 *     reconciliationLog) — and on a brand-new generation while a SAVED
 *     settlement is on screen (activeSaveId set): the new town is a new
 *     identity, and the save keeps its own crises;
 *   - carried world conditions must NOT duplicate event conditions:
 *     isWorldAuthoredCondition disclaims event-sourced conditions, which
 *     survive through their own seam (config.eventConditions).
 */

import { describe, test, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice } from '../../src/store/settlementSlice.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';
import { withActiveCondition } from '../../src/domain/activeConditions.js';

const NOW = '2026-06-11T00:00:00.000Z';

// Forced-empty stressor pool: generateStress returns null deterministically
// (Mode 2 with an empty selection), so NO generation can mint a GENERATION-
// stamped twin of the carried archetypes regardless of seed or rng drift.
const NO_STRESS_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
  selectedStressesRandom: false,
  selectedStresses: [],
};

const SEED = 'wc-regen-1';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

// A pulse-applied condition (non-regional archetype — survival rides on the
// WORLD_PULSE source prefix) carrying evolved state (elapsed ticks, authored
// severity) that must come through verbatim, not restart at an onset.
const PULSE_COND = {
  id: 'condition.famine.pulse42',
  archetype: 'famine',
  severity: 0.7,
  status: 'worsening',
  triggeredAt: { tick: 4, sourceEventType: 'WORLD_PULSE_FAMINE', sourceEventTargetId: 'stressor.famine' },
  duration: { elapsedTicks: 3, expiresAtTicks: 9 },
  causes: [{ source: 'world_pulse', detail: 'The Great Hunger reaches the town.' }],
};

// A regional-channel condition: propagation stamps the change kind as the
// source and the channel id as the cause — survival rides on the regional_*
// archetype, the other recognition path.
const REGIONAL_COND = {
  id: 'condition.regional_route_disruption.chan7',
  archetype: 'regional_route_disruption',
  severity: 0.5,
  status: 'worsening',
  triggeredAt: { tick: 2, sourceEventType: 'route_cut', sourceEventTargetId: 'channel.trade_dependency.a.b' },
  duration: { elapsedTicks: 0, expiresAtTicks: 7 },
  causes: [{ source: 'channel.trade_dependency.a.b', detail: 'The river road is severed upstream.' }],
};

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

const condOf = (s, archetype) =>
  (s.activeConditions || []).filter(c => c.archetype === archetype);

/** A generated settlement carrying one EVENT condition + both world conditions. */
function hydratedSettlement() {
  const s1 = gen(NO_STRESS_CFG, SEED);
  expect(s1.activeConditions).toEqual([]);
  const cut = mutateSettlement({
    settlement: s1,
    event: { id: 'ev-cut', type: 'CUT_TRADE_ROUTE', targetId: 'River road south', payload: {}, cause: 'player_action' },
    now: NOW,
  });
  expect(condOf(cut, 'trade_route_cut')).toHaveLength(1);
  return withActiveCondition(withActiveCondition(cut, PULSE_COND), REGIONAL_COND);
}

describe('join: applyChange (what-if regeneration) preserves world conditions', () => {
  test('pulse + regional conditions survive; event conditions are not duplicated', async () => {
    const store = makeStore();
    store.setState(s => {
      s.settlement = hydratedSettlement();
      s.lastSeed = SEED;
    });

    store.getState().proposeChange('addInstitution', { category: 'civic', name: 'Granary' });
    expect(store.getState().pendingChange?.type).toBe('addInstitution');
    await store.getState().applyChange();

    const after = store.getState().settlement;
    // The world conditions survived the rebuild — evolved state intact, not
    // an onset restart.
    const famine = condOf(after, 'famine');
    expect(famine).toHaveLength(1);
    expect(famine[0].id).toBe(PULSE_COND.id);
    expect(famine[0].severity).toBe(0.7);
    expect(famine[0].duration.elapsedTicks).toBe(3);
    const regional = condOf(after, 'regional_route_disruption');
    expect(regional).toHaveLength(1);
    expect(regional[0].id).toBe(REGIONAL_COND.id);

    // The event condition came through its OWN seam exactly once — the
    // reconcile must not carry a second copy.
    const cut = condOf(after, 'trade_route_cut');
    expect(cut).toHaveLength(1);
    expect(cut[0].causes.some(c => c.source === 'event' && c.eventId === 'ev-cut')).toBe(true);

    // World conditions stay OUT of the event record (no double ownership).
    expect(after.config.eventConditions).toHaveLength(1);
    expect(after.config.eventConditions[0].archetype).toBe('trade_route_cut');

    // The reconcile is receipted.
    expect(after.reconciliationLog.at(-1)).toMatchObject({
      source: 'what_if_change',
      changeType: 'addInstitution',
    });
    expect(after.reconciliationLog.at(-1).preservedWorldConditionIds)
      .toEqual(expect.arrayContaining(['famine', 'regional_route_disruption']));
    expect(after.reconciliationLog.at(-1).preservedWorldConditionIds)
      .not.toContain('trade_route_cut');

    // SystemState was derived from the RECONCILED settlement.
    expect(store.getState().systemState).toBeTruthy();
    expect(store.getState().pendingChange).toBeNull();
  });

  test('chained what-ifs are a fixpoint — no condition growth on the second apply', async () => {
    const store = makeStore();
    store.setState(s => {
      s.settlement = hydratedSettlement();
      s.lastSeed = SEED;
    });

    store.getState().proposeChange('addInstitution', { category: 'civic', name: 'Granary' });
    await store.getState().applyChange();
    store.getState().proposeChange('removeInstitution', { category: 'civic', name: 'Granary' });
    await store.getState().applyChange();

    const after = store.getState().settlement;
    expect(condOf(after, 'famine')).toHaveLength(1);
    expect(condOf(after, 'regional_route_disruption')).toHaveLength(1);
    expect(condOf(after, 'trade_route_cut')).toHaveLength(1);
    expect(after.reconciliationLog).toHaveLength(2);
  });
});

describe('join: generateSettlement (reroll) preserves world conditions', () => {
  test('a regenerate with a settlement on screen carries the campaign layer', async () => {
    const store = makeStore();
    store.setState(s => {
      s.settlement = hydratedSettlement();
      s.lastSeed = SEED;
    });

    const returned = await store.getState().generateSettlement('wc-reroll-2');
    const after = store.getState().settlement;
    expect(returned).toBeTruthy();

    const famine = condOf(after, 'famine');
    expect(famine).toHaveLength(1);
    expect(famine[0].id).toBe(PULSE_COND.id);
    expect(condOf(after, 'regional_route_disruption')).toHaveLength(1);

    // The reroll generated from the wizard config (no eventConditions
    // record), so nothing event-authored resurrects — and the carried world
    // conditions must not be recruited into the record either.
    expect('eventConditions' in after.config).toBe(false);

    expect(after.reconciliationLog.at(-1)).toMatchObject({
      source: 'regenerate',
      changeType: 'GENERATE_SETTLEMENT',
    });
    // Regeneration still returns to draft — preserving world conditions is
    // not a phase decision.
    expect(store.getState().phase).toBe('draft');
  });

  test('a FIRST generation (no prior settlement) reconciles nothing and logs nothing', async () => {
    const store = makeStore();
    const result = await store.getState().generateSettlement('wc-fresh-1');
    expect(result).toBeTruthy();
    expect('reconciliationLog' in store.getState().settlement).toBe(false);
  });

  test('a brand-new generation while a SAVED settlement is loaded carries NOTHING (identity guard)', async () => {
    const store = makeStore();
    store.setState(s => {
      s.settlement = hydratedSettlement();
      // The on-screen settlement belongs to a save — generating now mints a
      // NEW town (activeSaveId resets), not a reroll of that save.
      s.activeSaveId = 'old-canon-save';
      s.lastSeed = SEED;
    });

    const returned = await store.getState().generateSettlement('wc-new-town-1');
    expect(returned).toBeTruthy();
    expect(store.getState().activeSaveId).toBeNull();

    const after = store.getState().settlement;
    // The old save's campaign-layer crises stay with the save — none of them
    // were cloned onto the unrelated new town.
    expect(condOf(after, 'famine')).toEqual([]);
    expect(condOf(after, 'regional_route_disruption')).toEqual([]);
    expect(condOf(after, 'trade_route_cut')).toEqual([]);
    // A fresh identity starts with no reconciliation trail at all.
    expect('reconciliationLog' in after).toBe(false);
  });
});
