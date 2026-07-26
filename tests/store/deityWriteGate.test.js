/**
 * tests/store/deityWriteGate.test.js — Wave R-0 Lane D (owner-queue #27): the
 * deity premium gate is SINGLE-SOURCED and FAIL-CLOSED at the store seam.
 *
 * The closed defect: the premium gate was hand-mirrored in three UI places
 * (manifest predicate, composer canStageDeityEvent, DeityAssignmentPanel
 * branches) and enforced in none — settlementDeityHelpers.js documented the
 * fail-open in its own words ("Premium gating is enforced at the UI ... the
 * assignment is inert"). These pins prove the cure:
 *
 *   1. deityWriteGate wraps the authoritative canUseCustomContent selector and
 *      FAILS CLOSED (a state without the selector refuses).
 *   2. BOTH impls (setPrimaryDeityImpl / imposeCultImpl) refuse an unentitled
 *      dispatch — every path (assign, clear, remove) — with the typed refusal,
 *      and applyEvent is NEVER reached.
 *   3. LAPSED (owns a live embed, entitlement gone) is read-only at the seam.
 *   4. PREMIUM behavior is byte-identical to the pre-gate contract (envelope
 *      through applyEvent; the reconcileCultImposition probe still refuses a
 *      bad imposition with null, exactly as before).
 *   5. The refusal's translated sentences are the SAME sentences the affordance
 *      manifest's Faith predicates speak (the manifest is a lazy leaf the store
 *      must not import, so the equality is pinned HERE instead of by import).
 */

import { describe, test, expect, vi } from 'vitest';

import {
  setPrimaryDeityImpl,
  imposeCultImpl,
  deityWriteGate,
  DEITY_WRITE_REFUSAL,
} from '../../src/store/settlementDeityHelpers.js';
import { mintDeityRef } from '../../src/lib/customRegistry.js';
import { AFFORDANCE_MANIFEST } from '../../src/domain/events/affordanceManifest.js';

/** An authored homebrew deity, as the customContent `deities` bucket stores it. */
const DEITY = {
  localUid: 'lu_aur',
  id: 'd_lu_aur',
  name: 'Aurelion',
  alignmentAxis: 'good',
  temperamentAxis: 'peacelike',
  rankAxis: 'major',
  lawAxis: 'lawful',
};
const DEITY_REF = 'custom:lu_aur';
const MINTED = mintDeityRef(DEITY); // deity:lu_aur:aurelion

/**
 * A minimal store state for the impls: standalone context (no campaign), the
 * authored deity in the account library, and a spy applyEvent. `entitled`
 * undefined ⇒ NO canUseCustomContent selector at all (the fail-closed corner).
 */
function makeState({ entitled, settlement = { tier: 'town', config: {} } } = {}) {
  const applyEvent = vi.fn(event => event);
  const state = {
    customContent: { deities: [DEITY] },
    settlement,
    applyEvent,
    ...(entitled === undefined ? {} : { canUseCustomContent: () => entitled }),
  };
  return { state, get: () => state, applyEvent };
}

describe('deityWriteGate — single source, fail-closed', () => {
  test('entitled passes (null); unentitled and selector-less states refuse', () => {
    expect(deityWriteGate({ canUseCustomContent: () => true })).toBeNull();
    expect(deityWriteGate({ canUseCustomContent: () => false })).toBe(DEITY_WRITE_REFUSAL);
    // FAIL-CLOSED: no selector at all (malformed / partial state) ⇒ refuse.
    expect(deityWriteGate({})).toBe(DEITY_WRITE_REFUSAL);
    expect(deityWriteGate(null)).toBe(DEITY_WRITE_REFUSAL);
  });

  test('the refusal is typed, frozen, and distinguishable from a log entry', () => {
    expect(DEITY_WRITE_REFUSAL).toMatchObject({ refused: true, code: 'custom_content_required' });
    expect(Object.isFrozen(DEITY_WRITE_REFUSAL)).toBe(true);
    expect(Object.isFrozen(DEITY_WRITE_REFUSAL.reasons)).toBe(true);
    expect(DEITY_WRITE_REFUSAL.type).toBeUndefined(); // never mistaken for an event envelope
  });

  test('speaks the SAME translated sentences as the manifest Faith predicates', () => {
    const patron = AFFORDANCE_MANIFEST.SET_PRIMARY_DEITY.predicate({}, { canUseCustom: false });
    const cult = AFFORDANCE_MANIFEST.IMPOSE_CULT.predicate({ config: {} }, { canUseCustom: false });
    expect(patron.available).toBe(false);
    expect(cult.available).toBe(false);
    expect([...DEITY_WRITE_REFUSAL.reasons]).toEqual(patron.reasons);
    expect([...DEITY_WRITE_REFUSAL.unlocks]).toEqual(patron.unlocks);
    expect([...DEITY_WRITE_REFUSAL.reasons]).toEqual(cult.reasons);
    expect([...DEITY_WRITE_REFUSAL.unlocks]).toEqual(cult.unlocks);
  });
});

describe('free tier — every write path refused at the seam, nothing dispatched', () => {
  test('setPrimaryDeityImpl: assign AND clear are refused typed', () => {
    const { get, applyEvent } = makeState({ entitled: false });
    expect(setPrimaryDeityImpl(get, DEITY_REF)).toBe(DEITY_WRITE_REFUSAL);
    expect(setPrimaryDeityImpl(get, null)).toBe(DEITY_WRITE_REFUSAL);
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('imposeCultImpl: assign AND remove are refused typed', () => {
    const { get, applyEvent } = makeState({ entitled: false });
    expect(imposeCultImpl(get, DEITY_REF)).toBe(DEITY_WRITE_REFUSAL);
    expect(imposeCultImpl(get, null, MINTED)).toBe(DEITY_WRITE_REFUSAL);
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('a state WITHOUT the selector fails closed on both impls', () => {
    const { get, applyEvent } = makeState({});
    expect(setPrimaryDeityImpl(get, DEITY_REF)).toBe(DEITY_WRITE_REFUSAL);
    expect(imposeCultImpl(get, DEITY_REF)).toBe(DEITY_WRITE_REFUSAL);
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('the no-settlement corner keeps its pre-gate null contract', () => {
    const { get, applyEvent } = makeState({ entitled: false, settlement: null });
    expect(setPrimaryDeityImpl(get, DEITY_REF)).toBeNull();
    expect(imposeCultImpl(get, DEITY_REF)).toBeNull();
    expect(applyEvent).not.toHaveBeenCalled();
  });
});

describe('lapsed premium — owns a live embed, read-only at the seam', () => {
  const owned = () => ({
    tier: 'town',
    config: {
      primaryDeityRef: MINTED,
      primaryDeitySnapshot: { _deityRef: MINTED, name: DEITY.name, alignmentAxis: 'good', rankAxis: 'major' },
      cultDeitySnapshots: [{ _deityRef: 'deity:lu_x:old_cult', name: 'Old Cult', rankAxis: 'cult' }],
    },
  });

  test('cannot reassign, clear, impose, or remove — all refused, nothing dispatched', () => {
    const { get, applyEvent } = makeState({ entitled: false, settlement: owned() });
    expect(setPrimaryDeityImpl(get, DEITY_REF)).toBe(DEITY_WRITE_REFUSAL);
    expect(setPrimaryDeityImpl(get, null)).toBe(DEITY_WRITE_REFUSAL);
    expect(imposeCultImpl(get, DEITY_REF)).toBe(DEITY_WRITE_REFUSAL);
    expect(imposeCultImpl(get, null, 'deity:lu_x:old_cult')).toBe(DEITY_WRITE_REFUSAL);
    expect(applyEvent).not.toHaveBeenCalled();
  });
});

describe('premium — behavior byte-identical to the pre-gate contract', () => {
  test('assign dispatches the SET_PRIMARY_DEITY envelope with the minted identity ref', () => {
    const { get, applyEvent } = makeState({ entitled: true });
    const res = setPrimaryDeityImpl(get, DEITY_REF);
    expect(res).toMatchObject({
      type: 'SET_PRIMARY_DEITY',
      targetId: MINTED,
      payload: { deityRef: MINTED, snapshot: { name: DEITY.name, alignmentAxis: 'good' } },
    });
    expect(applyEvent).toHaveBeenCalledTimes(1);
  });

  test('clear dispatches the null-payload envelope (returns to dormant)', () => {
    const { get, applyEvent } = makeState({ entitled: true });
    const res = setPrimaryDeityImpl(get, null);
    expect(res).toMatchObject({
      type: 'SET_PRIMARY_DEITY',
      targetId: null,
      payload: { deityRef: null, snapshot: null },
    });
    expect(applyEvent).toHaveBeenCalledTimes(1);
  });

  test('imposeCult dispatches the IMPOSE_CULT envelope on an open slot', () => {
    const { get, applyEvent } = makeState({ entitled: true });
    const res = imposeCultImpl(get, DEITY_REF);
    expect(res).toMatchObject({ type: 'IMPOSE_CULT', targetId: MINTED, payload: { deityRef: MINTED } });
    expect(applyEvent).toHaveBeenCalledTimes(1);
  });

  test('the reconcileCultImposition probe STILL refuses with null (not the typed refusal)', () => {
    // The deity already holds the patron seat ⇒ the pure placement probe refuses
    // (is_patron) and the impl returns null with no dispatch — the pre-existing
    // no-op contract, proving the gate did not replace or bypass the probe.
    const { get, applyEvent } = makeState({
      entitled: true,
      settlement: {
        tier: 'town',
        config: {
          primaryDeitySnapshot: { _deityRef: MINTED, name: DEITY.name, alignmentAxis: 'good', rankAxis: 'major' },
        },
      },
    });
    expect(imposeCultImpl(get, DEITY_REF)).toBeNull();
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('an unknown ref still refuses with null (no half embed)', () => {
    const { get, applyEvent } = makeState({ entitled: true });
    expect(setPrimaryDeityImpl(get, 'custom:lu_nonexistent')).toBeNull();
    expect(applyEvent).not.toHaveBeenCalled();
  });
});
