/**
 * religionPipelineActivation.test.js — the end-to-end religion-activation smoke
 * test (W2b-r).
 *
 * The gap this closes: the store mount (settlementDeityHelpers) dispatches
 * SET_PRIMARY_DEITY / IMPOSE_CULT, and the pure mutate.js handlers + the
 * subsystemActivation gate were both unit-tested — but the two ends were never
 * wired through the ACTUAL event pipeline. `runEventPipeline` validates the event
 * against EVENT_REGISTRY FIRST and, for an UNREGISTERED type, early-returns the
 * settlement UNMUTATED (no handler ever runs). So while the registry lacked these
 * entries the whole religion subsystem could never activate end-to-end, however
 * green the handler unit tests were.
 *
 * This pins the real path: dispatch through runEventPipeline → the pipeline
 * validates against the registry, runs the handler, and the mutated settlement
 * gains its config embed → the subsystemActivation gate flips religion ON. An
 * unregistered control type stays inert (early-return, no mutation, dormant),
 * which is exactly the failure mode a missing registry entry reproduces.
 */

import { describe, expect, test } from 'vitest';

import { runEventPipeline } from '../../src/domain/events/eventPipeline.js';
import { EVENT_REGISTRY, EVENT_TYPES } from '../../src/domain/events/registry.js';
// RERUN_KEYS_FOR_EVENT moved to the LAZY registryFull (W-COMPOSER-1 byte reclaim).
import { RERUN_KEYS_FOR_EVENT } from '../../src/domain/events/registryFull.js';
import { isSubsystemActive } from '../../src/domain/worldPulse/subsystemActivation.js';

function baseSettlement(patch = {}) {
  return {
    name: 'Test Hold',
    tier: 'town',
    population: 1800,
    config: { tradeRouteAccess: 'road' },
    institutions: [],
    powerStructure: {},
    ...patch,
  };
}

const DEITY_SNAPSHOT = {
  name: 'Vael',
  alignmentAxis: 'good',
  temperamentAxis: 'warlike',
  rankAxis: 'major',
  lawAxis: 'lawful',
  domain: 'war',
};

const CULT_SNAPSHOT = {
  name: 'Thandros',
  alignmentAxis: 'evil',
  temperamentAxis: 'scheming',
  rankAxis: 'cult',
  lawAxis: 'chaotic',
  domain: 'shadow',
};

/** Wrap a single settlement into the world-snapshot shape the gate reads. */
function snapshotOf(settlement) {
  return { settlements: [{ id: 's0', name: settlement.name, settlement }] };
}

describe('religion activation — the registry entries are present', () => {
  test('SET_PRIMARY_DEITY, IMPOSE_CULT, and SHIFT_TIER are registered in EVENT_REGISTRY', () => {
    for (const type of ['SET_PRIMARY_DEITY', 'IMPOSE_CULT', 'SHIFT_TIER']) {
      expect(EVENT_REGISTRY[type], `${type} missing from EVENT_REGISTRY`).toBeDefined();
      expect(typeof EVENT_REGISTRY[type].stateDeltas).toBe('function');
      expect(typeof EVENT_REGISTRY[type].narrate).toBe('function');
      expect(EVENT_TYPES).toContain(type);
      expect(RERUN_KEYS_FOR_EVENT[type], `${type} missing from RERUN_KEYS_FOR_EVENT`).toBeDefined();
    }
  });
});

describe('religion activation — through the real event pipeline', () => {
  test('SET_PRIMARY_DEITY flows through the pipeline → config.primaryDeitySnapshot → religion flips ON', () => {
    const before = baseSettlement();
    // Baseline: a deity-free settlement leaves religion dormant.
    expect(isSubsystemActive(snapshotOf(before), 'religion')).toBe(false);

    const result = runEventPipeline(before, {
      type: 'SET_PRIMARY_DEITY',
      targetId: 'custom:lu_vael',
      payload: { deityRef: 'custom:lu_vael', snapshot: DEITY_SNAPSHOT },
    });

    // The pipeline did NOT early-return: no mismatch warning, and it ran the handler.
    expect(result.warnings.some(w => w.severity === 'mismatch')).toBe(false);
    expect(result.nextSettlement).not.toBe(before);
    expect(result.nextSettlement.config.primaryDeitySnapshot).toMatchObject({
      _deityRef: 'custom:lu_vael',
      name: 'Vael',
    });
    // The narrative + an authored delta landed (the registry entry is live).
    expect(result.narrativeSummary).toContain('Vael');
    expect(result.systemStateDeltas.length).toBeGreaterThan(0);

    // The activation gate flips ON for the mutated settlement.
    expect(isSubsystemActive(snapshotOf(result.nextSettlement), 'religion')).toBe(true);
  });

  test('IMPOSE_CULT flows through the pipeline → config.cultDeitySnapshots[] → religion flips ON', () => {
    const before = baseSettlement();
    expect(isSubsystemActive(snapshotOf(before), 'religion')).toBe(false);

    const result = runEventPipeline(before, {
      type: 'IMPOSE_CULT',
      targetId: 'custom:lu_thandros',
      payload: { deityRef: 'custom:lu_thandros', snapshot: CULT_SNAPSHOT },
    });

    expect(result.warnings.some(w => w.severity === 'mismatch')).toBe(false);
    const cults = result.nextSettlement.config.cultDeitySnapshots;
    expect(Array.isArray(cults)).toBe(true);
    expect(cults.length).toBeGreaterThan(0);
    expect(cults[0]).toMatchObject({ name: 'Thandros' });
    expect(result.narrativeSummary).toContain('Thandros');

    expect(isSubsystemActive(snapshotOf(result.nextSettlement), 'religion')).toBe(true);
  });

  test('control: an UNREGISTERED event type early-returns UNMUTATED and religion stays dormant', () => {
    const before = baseSettlement();
    const result = runEventPipeline(before, {
      type: 'NOT_A_REAL_EVENT',
      targetId: 'custom:lu_vael',
      payload: { deityRef: 'custom:lu_vael', snapshot: DEITY_SNAPSHOT },
    });

    // The registry rejects the unknown type: mismatch warning, no mutation.
    expect(result.warnings.some(w => w.severity === 'mismatch')).toBe(true);
    expect(result.nextSettlement).toBe(before);
    expect(result.nextSettlement.config.primaryDeitySnapshot).toBeUndefined();
    expect(result.systemStateDeltas).toEqual([]);

    // Religion never activates — this is exactly the pre-fix failure mode a
    // missing registry entry would have produced for SET_PRIMARY_DEITY itself.
    expect(isSubsystemActive(snapshotOf(result.nextSettlement), 'religion')).toBe(false);
  });
});
