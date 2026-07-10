import { describe, expect, test } from 'vitest';

import { isSubsystemActive, SUBSYSTEM_GATES } from '../../src/domain/worldPulse/subsystemActivation.js';

// F2 pin: the reusable dormant-until-enabled activation gate. A subsystem stays a
// pure no-op until its predicate holds, and the gate itself is DERIVED (read off
// the snapshot), READ-ONLY, and rng-FREE — so a dormant subsystem can never write
// worldState or perturb the deterministic stream. The religion gate flips the
// instant any settlement carries an embedded primary-deity snapshot.

function snapshotWith(settlements) {
  return {
    settlements: settlements.map((config, i) => ({
      id: `s${i}`,
      name: `S${i}`,
      settlement: { name: `S${i}`, config },
    })),
    // include sibling fields a real snapshot carries to prove the gate ignores them
    worldState: { tick: 3, stressors: [] },
    regionalGraph: { edges: [], channels: [] },
  };
}

const DEITY = { id: 'deity.custom.thandros', name: 'Thandros', alignmentAxis: 'evil', temperamentAxis: 'warlike', rankAxis: 'major' };

describe('subsystemActivation — dormant-until-enabled gate', () => {
  test('religion is DORMANT when no settlement carries a primary-deity snapshot', () => {
    const snap = snapshotWith([
      { tradeRouteAccess: 'road' },
      { tradeRouteAccess: 'river', primaryDeityRef: 'deity.custom.thandros' }, // a REF without a resolved snapshot is NOT active
    ]);
    expect(isSubsystemActive(snap, 'religion')).toBe(false);
  });

  test('religion ACTIVATES the instant one settlement carries an embedded snapshot', () => {
    const snap = snapshotWith([
      { tradeRouteAccess: 'road' },
      { tradeRouteAccess: 'river', primaryDeitySnapshot: DEITY },
    ]);
    expect(isSubsystemActive(snap, 'religion')).toBe(true);
  });

  test('accepts an ad-hoc predicate as well as a registered key', () => {
    const snap = snapshotWith([{ primaryDeitySnapshot: DEITY }]);
    expect(isSubsystemActive(snap, s => s.settlements.length > 0)).toBe(true);
    expect(isSubsystemActive(snap, s => s.settlements.length > 99)).toBe(false);
    // The registered gate and its raw predicate agree.
    expect(isSubsystemActive(snap, 'religion')).toBe(SUBSYSTEM_GATES.religion(snap));
  });

  test('total & defensive: unknown key / malformed snapshot / non-function gate ⇒ dormant (no throw)', () => {
    const snap = snapshotWith([{ primaryDeitySnapshot: DEITY }]);
    expect(isSubsystemActive(snap, 'no_such_subsystem')).toBe(false);
    expect(isSubsystemActive(null, 'religion')).toBe(false);
    expect(isSubsystemActive({}, 'religion')).toBe(false);
    expect(isSubsystemActive({ settlements: 'not-an-array' }, 'religion')).toBe(false);
    expect(isSubsystemActive(snap, 42)).toBe(false);
  });

  test('the gate is READ-ONLY: evaluating it does not mutate the snapshot', () => {
    const snap = snapshotWith([{ primaryDeitySnapshot: DEITY }, { tradeRouteAccess: 'road' }]);
    const before = structuredClone(snap);
    isSubsystemActive(snap, 'religion');
    isSubsystemActive(snap, 'religion');
    expect(snap).toEqual(before);
  });

  test('SUBSYSTEM_GATES is a frozen registry of predicates (anti-vacuity)', () => {
    expect(Object.isFrozen(SUBSYSTEM_GATES)).toBe(true);
    expect(typeof SUBSYSTEM_GATES.religion).toBe('function');
    // arity 1: the gate takes only a snapshot — no rng, no extra inputs.
    expect(SUBSYSTEM_GATES.religion.length).toBe(1);
  });
});
