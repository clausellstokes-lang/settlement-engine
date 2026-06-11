/**
 * Join harness — undoLastEvent scrubs the undone event's durable artifacts.
 *
 * The gap this pins: undoLastEvent popped the log entry and stripped
 * causeEventId-tagged impairments, but left the activeCondition the event
 * promoted AND the authored records the event dual-wrote into
 * settlement.config + settlement._config (eventConditions / resourceEdits /
 * customTradeGoods / _cutRoutes). Before config.eventConditions existed
 * that was a transient gap — the next regeneration dropped the ghost; now
 * the records are deliberately RE-APPLIED by every regeneration
 * (reapplyEventConditions, resolveResources' overlay, generateEconomy's
 * customTradeGoods pass), so an undone PLAGUE re-promoted its condition on
 * every what-if, permanently.
 *
 * The fix (domain/events/undoEvent.js, wired into the slice):
 *   - conditions scrub by CAUSE provenance — drop conditions whose onset
 *     (causes[0]) names the popped event, strip its appended receipts from
 *     survivors (un-easing an undone RESOLVE_STRESSOR), then re-run
 *     withEventConditionsSynced so the record follows;
 *   - provenance-stamped writes (stress entries' addedByEventId, the
 *     annotation ledgers' atEventId, destruction stamps) scrub the same way;
 *   - the provenance-FREE records (resourceEdits / customTradeGoods + their
 *     live outputs) restore from the pre-event snapshot applyEvent now
 *     stamps onto the log entry; a legacy entry without one degrades to the
 *     old leave-it behavior.
 *
 * Boots the real zustand store (the joins are store → domain → pipeline):
 * the Timeline Undo button calls exactly this action.
 */

import { describe, test, expect } from 'vitest';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

import { createSettlementSlice, stripDerivedConfigKeys } from '../../src/store/settlementSlice.js';
import { generateSettlementPipeline } from '../../src/generators/generateSettlementPipeline.js';

const gen = (config, seed) =>
  generateSettlementPipeline(config, null, { seed, customContent: {} });

const BASE_CFG = {
  settType: 'town',
  culture: 'germanic',
  tradeRouteAccess: 'road',
  monsterThreat: 'frontier',
};

// Probed shapes, shared with the sibling harnesses: ec-rt-1 rolls NO
// stressors and NO activeConditions (eventConditions.test.js); re-rt-1
// rolls river_fish open and defended_pass depleted (resourceEdits.test.js).
const SEED = 'ec-rt-1';
const RESOURCE_SEED = 're-rt-1';

/** Exactly how settlementSlice.applyChange rebuilds the next run's input. */
const buildNextConfig = (settlement) => ({
  ...(settlement?._config
    || stripDerivedConfigKeys(settlement?.config)
    || {}),
});

// Minimal companion slices so settlementSlice's reads don't crash —
// mirrors tests/store/settlementSlice.test.js.
const stubSlice = (set, get) => ({
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
  isTierAllowed: () => true,
  canSave: () => true,
  maxSaves: () => 50,
  setPurchaseModalOpen: () => {},
});

function makeStore() {
  return create(immer((...a) => ({ ...stubSlice(...a), ...createSettlementSlice(...a) })));
}

/** Seed the slice with a pipeline-generated settlement and enter canon. */
function bootCanonStore(settlement) {
  const store = makeStore();
  store.setState(s => { s.settlement = settlement; s.lastSeed = 'undo-test'; });
  store.getState().refreshSystemState();
  store.getState().canonize();
  return store;
}

const ev = (type, overrides = {}) => ({
  id: `ev_${type.toLowerCase()}`,
  type,
  targetId: '',
  payload: {},
  cause: 'player_action',
  ...overrides,
});

const condOf = (s, archetype) =>
  (s.activeConditions || []).filter(c => c.archetype === archetype);

describe('join: undo removes the condition the event promoted (the reported bug)', () => {
  test('PLAGUE → undo → regenerate: no plague, live or regenerated', () => {
    const store = bootCanonStore(gen(BASE_CFG, SEED));
    const stateBefore = store.getState().systemState;

    store.getState().applyEvent(ev('PLAGUE', {
      id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 },
    }));
    const sick = store.getState().settlement;
    expect(condOf(sick, 'plague')).toHaveLength(1);
    expect(sick.config.eventConditions).toHaveLength(1);
    expect(sick._config.eventConditions).toHaveLength(1);
    expect(sick.config._activePlague.atEventId).toBe('ev-plague');

    store.getState().undoLastEvent();
    const cured = store.getState().settlement;
    expect(store.getState().eventLog).toEqual([]);
    expect(store.getState().systemState).toEqual(stateBefore);
    expect(condOf(cured, 'plague')).toEqual([]);
    // The record follows in BOTH config formats — the dual-written ghost is
    // what kept the undone plague alive across regenerations.
    expect(cured.config.eventConditions).toEqual([]);
    expect(cured._config.eventConditions).toEqual([]);
    expect('_activePlague' in cured.config).toBe(false);
    expect('_activePlague' in cured._config).toBe(false);
    // The healing-institution strain went with it (the pre-existing strip).
    for (const inst of cured.institutions) {
      expect((inst.impairments || []).some(i => i.causeEventId === 'ev-plague')).toBe(false);
    }

    // Full regeneration, exactly as applyChange rebuilds its input: the
    // undone plague must NOT be re-promoted.
    const s2 = gen(buildNextConfig(cured), SEED);
    expect(condOf(s2, 'plague')).toEqual([]);
  });

  test('undo scrubs ONLY the popped event — the earlier event survives intact', () => {
    const store = bootCanonStore(gen(BASE_CFG, SEED));
    store.getState().applyEvent(ev('PLAGUE', {
      id: 'ev-plague', targetId: 'Red sweat', payload: { severity: 0.8 },
    }));
    store.getState().applyEvent(ev('CUT_TRADE_ROUTE', { id: 'ev-cut', targetId: 'River road south' }));
    const both = store.getState().settlement;
    expect(both.config._cutRoutes).toHaveLength(1);
    expect(both._config._cutRoutes).toHaveLength(1);

    store.getState().undoLastEvent();
    const undone = store.getState().settlement;
    expect(store.getState().eventLog).toHaveLength(1);
    // The cut is gone — condition AND the annotation ledger in both formats.
    expect(condOf(undone, 'trade_route_cut')).toEqual([]);
    expect(undone.config._cutRoutes).toEqual([]);
    expect(undone._config._cutRoutes).toEqual([]);
    // The plague is untouched, and still regenerates.
    expect(condOf(undone, 'plague')).toHaveLength(1);
    expect(undone.config.eventConditions).toHaveLength(1);
    const s2 = gen(buildNextConfig(undone), SEED);
    expect(condOf(s2, 'plague')).toHaveLength(1);
    expect(condOf(s2, 'trade_route_cut')).toEqual([]);
  });

  test('undo of APPLY_STRESSOR removes the stress entry AND the promoted condition', () => {
    const store = bootCanonStore(gen(BASE_CFG, SEED));
    store.getState().applyEvent(ev('APPLY_STRESSOR', {
      id: 'ev-famine', targetId: 'famine',
      payload: { stressorType: 'famine', label: 'Famine', severity: 0.9 },
    }));
    const struck = store.getState().settlement;
    expect(condOf(struck, 'famine')).toHaveLength(1);
    const entryCount = ['stressors', 'stress', 'stresses']
      .flatMap(k => Array.isArray(struck[k]) ? struck[k] : [])
      .filter(st => st?.addedByEventId === 'ev-famine').length;
    expect(entryCount).toBeGreaterThan(0);

    store.getState().undoLastEvent();
    const undone = store.getState().settlement;
    expect(condOf(undone, 'famine')).toEqual([]);
    for (const key of ['stressors', 'stress', 'stresses']) {
      const arr = Array.isArray(undone[key]) ? undone[key] : [];
      expect(arr.some(st => st?.addedByEventId === 'ev-famine')).toBe(false);
    }
    expect(undone.config.eventConditions).toEqual([]);
    // The stressorEdits record (the overlay resolveStress re-applies) reverts
    // from the snapshot — without this the regeneration re-minted the entry
    // AND its GENERATION-promoted famine.
    expect('stressorEdits' in undone.config).toBe(false);
    expect('stressorEdits' in undone._config).toBe(false);
    const s2 = gen(buildNextConfig(undone), SEED);
    expect(condOf(s2, 'famine')).toEqual([]);
    expect(s2.stress ?? null).toBeNull();
  });
});

describe('join: undo of RESOLVE_STRESSOR un-eases — the resolution is taken back', () => {
  test('apply → resolve → undo: the crisis resumes its course, and survives regeneration', () => {
    const store = bootCanonStore(gen(BASE_CFG, SEED));
    store.getState().applyEvent(ev('APPLY_STRESSOR', {
      id: 'ev-onset', targetId: 'dragon_tax',
      payload: { stressorType: 'dragon_tax', label: 'Dragon Tax', severity: 0.6, isCustom: true },
    }));
    const afterOnset = store.getState().settlement;
    const onset = condOf(afterOnset, 'custom_crisis')[0];
    expect(onset.status).toBe('worsening');
    const recordAfterOnset = afterOnset.config.stressorEdits;
    expect(recordAfterOnset.added).toHaveLength(1);

    store.getState().applyEvent(ev('RESOLVE_STRESSOR', { id: 'ev-end', targetId: 'dragon_tax' }));
    const resolved = store.getState().settlement;
    const eased = condOf(resolved, 'custom_crisis')[0];
    expect(eased.status).toBe('easing');
    expect(eased.duration.expiresAtTicks)
      .toBeLessThanOrEqual(eased.duration.elapsedTicks + 2);
    expect(resolved.config.stressorEdits.added).toEqual([]);
    expect(resolved.config.stressorEdits.resolved).toEqual(['dragon_tax']);

    store.getState().undoLastEvent();
    const undone = store.getState().settlement;
    const resumed = condOf(undone, 'custom_crisis')[0];
    // The resolve receipt is stripped; status and expiry return to the
    // onset's values (the template defaults every onset takes).
    expect(resumed.status).toBe(onset.status);
    expect(resumed.duration.expiresAtTicks).toBe(onset.duration.expiresAtTicks);
    expect(resumed.causes).toEqual(onset.causes);
    // The stressorEdits record reverts from the snapshot: the struck authored
    // entry returns, the resolved suppression goes.
    expect(undone.config.stressorEdits).toEqual(recordAfterOnset);
    expect(undone._config.stressorEdits).toEqual(recordAfterOnset);
    // …and the un-eased state is what the record carries forward — the
    // regenerated settlement has the crisis back, stressor entry included.
    const s2 = gen(buildNextConfig(undone), SEED);
    const carried = condOf(s2, 'custom_crisis');
    expect(carried).toHaveLength(1);
    expect(carried[0].status).toBe(onset.status);
    expect(carried[0].causes.some(c => c?.eventId === 'ev-end')).toBe(false);
    const carriedEntries = ['stressors', 'stress', 'stresses']
      .flatMap(k => Array.isArray(s2[k]) ? s2[k] : s2[k] ? [s2[k]] : []);
    expect(carriedEntries.some(st => st?.addedByEventId === 'ev-onset')).toBe(true);
  });
});

describe('join: undo restores the provenance-free records from the log-entry snapshot', () => {
  test('DEPLETE_RESOURCE → undo: the resourceEdits record and the live depletion both revert', () => {
    const before = gen(BASE_CFG, RESOURCE_SEED);
    expect(before.config.nearbyResources).toContain('river_fish');
    expect(before.config.nearbyResourcesDepleted).not.toContain('river_fish');
    const store = bootCanonStore(before);

    store.getState().applyEvent(ev('DEPLETE_RESOURCE', { id: 'ev-deplete', targetId: 'river_fish' }));
    const depleted = store.getState().settlement;
    expect(depleted.config.resourceEdits.depleted).toEqual(['river_fish']);
    expect(depleted.config.nearbyResourcesDepleted).toContain('river_fish');

    store.getState().undoLastEvent();
    const undone = store.getState().settlement;
    // Key-presence parity, not just value parity: a key the event GREW must
    // be deleted, so the undone settlement matches one that never saw it —
    // in the raw _config (the regeneration input) too.
    expect('resourceEdits' in undone.config).toBe('resourceEdits' in before.config);
    expect(undone.config.resourceEdits).toEqual(before.config.resourceEdits);
    expect('resourceEdits' in undone._config).toBe('resourceEdits' in before._config);
    expect(undone.config.nearbyResourcesDepleted).toEqual(before.config.nearbyResourcesDepleted);

    const s2 = gen(buildNextConfig(undone), RESOURCE_SEED);
    expect(s2.config.nearbyResourcesDepleted).not.toContain('river_fish');
  });

  test('RECOVERED_RESOURCE → undo: the generator’s own rolled depletion comes back', () => {
    const before = gen(BASE_CFG, RESOURCE_SEED);
    // defended_pass was rolled depleted by the generator itself.
    expect(before.config.nearbyResourcesDepleted).toContain('defended_pass');
    const store = bootCanonStore(before);

    store.getState().applyEvent(ev('RECOVERED_RESOURCE', { id: 'ev-recover', targetId: 'defended_pass' }));
    expect(store.getState().settlement.config.nearbyResourcesDepleted).not.toContain('defended_pass');

    store.getState().undoLastEvent();
    const undone = store.getState().settlement;
    expect(undone.config.nearbyResourcesDepleted).toContain('defended_pass');
    expect(undone.config.resourceEdits).toEqual(before.config.resourceEdits);
    // Without the recovered record, the same-seed regen re-rolls the
    // original depletion — exactly the pre-event world.
    const s2 = gen(buildNextConfig(undone), RESOURCE_SEED);
    expect(s2.config.nearbyResourcesDepleted).toContain('defended_pass');
  });

  test('REMOVE_TRADE_GOOD → undo: the suppression entry and the live strip both revert', () => {
    const before = gen(BASE_CFG, RESOURCE_SEED);
    const exportsBefore = before.economicState.primaryExports;
    expect(exportsBefore.length).toBeGreaterThan(0);
    const good = typeof exportsBefore[0] === 'string'
      ? exportsBefore[0]
      : String(exportsBefore[0]?.name || exportsBefore[0]?.good);
    const store = bootCanonStore(before);

    store.getState().applyEvent(ev('REMOVE_TRADE_GOOD', { id: 'ev-strike', targetId: good }));
    const struck = store.getState().settlement;
    expect(struck.economicState.primaryExports).not.toEqual(exportsBefore);
    expect(struck.config.customTradeGoods.removed).toHaveLength(1);

    store.getState().undoLastEvent();
    const undone = store.getState().settlement;
    expect('customTradeGoods' in undone.config).toBe('customTradeGoods' in before.config);
    expect(undone.config.customTradeGoods).toEqual(before.config.customTradeGoods);
    expect(undone.economicState.primaryExports).toEqual(exportsBefore);
    // Without the suppression entry, the regenerated economy exports it again.
    const s2 = gen(buildNextConfig(undone), RESOURCE_SEED);
    expect(s2.economicState.primaryExports).toEqual(exportsBefore);
  });

  test('ADD_TRADE_GOOD → undo: the authored good vanishes from record and lists', () => {
    const before = gen(BASE_CFG, RESOURCE_SEED);
    const importsBefore = before.economicState.primaryImports;
    const store = bootCanonStore(before);

    store.getState().applyEvent(ev('ADD_TRADE_GOOD', {
      id: 'ev-good', targetId: 'Saffron', payload: { direction: 'import' },
    }));
    expect(store.getState().settlement.economicState.primaryImports).toContain('Saffron');

    store.getState().undoLastEvent();
    const undone = store.getState().settlement;
    expect('customTradeGoods' in undone.config).toBe('customTradeGoods' in before.config);
    expect(undone.economicState.primaryImports).toEqual(importsBefore);
    const s2 = gen(buildNextConfig(undone), RESOURCE_SEED);
    expect(s2.economicState.primaryImports).not.toContain('Saffron');
  });

  test('a LEGACY log entry (no snapshot) degrades to the old leave-it behavior, no crash', () => {
    const store = bootCanonStore(gen(BASE_CFG, RESOURCE_SEED));
    store.getState().applyEvent(ev('DEPLETE_RESOURCE', { id: 'ev-legacy', targetId: 'river_fish' }));
    // Simulate an entry persisted before the snapshot existed.
    store.setState(s => { delete s.eventLog[0].undo; });

    store.getState().undoLastEvent();
    expect(store.getState().eventLog).toEqual([]);
    // The record cannot be reconstructed without the snapshot — the
    // documented residue every pre-snapshot save keeps.
    expect(store.getState().settlement.config.resourceEdits.depleted).toEqual(['river_fish']);
  });
});

describe('join: undo of DESTROY_SETTLEMENT revives the settlement', () => {
  test('status, stamps, and the config flag all clear', () => {
    const store = bootCanonStore(gen(BASE_CFG, SEED));
    store.getState().applyEvent(ev('DESTROY_SETTLEMENT', { id: 'ev-doom', targetId: 'dragonfire' }));
    const doomed = store.getState().settlement;
    expect(doomed.status).toBe('destroyed');
    expect(doomed.config._destroyed).toBe(true);

    store.getState().undoLastEvent();
    const revived = store.getState().settlement;
    expect(revived.status).toBe('active');
    expect(revived.destroyedByEventId).toBeUndefined();
    expect('_destroyed' in revived.config).toBe(false);
    expect('_destroyedByEventId' in revived.config).toBe(false);
  });
});
