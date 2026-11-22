/**
 * tests/store/deityClearCults.test.js — Wave R-2 Lane C (atlas Gap 2b: the
 * clear-ALL-cults path `imposeCult(null)` existed with no UI door). These pins
 * hold the STORE-SEAM + pure-handler contract the new panel control rides
 * (docs/CAPABILITY_REMEDIATION_PLAN.md, Wave R-2).
 *
 *   1. ENTITLED clear-all dispatches the IMPOSE_CULT null envelope, and the
 *      pure handler really empties the cult list — the emptied list DELETES
 *      the `cultDeitySnapshots` key (the dormancy oracle), patron untouched.
 *   2. LAPSED (unentitled, owns cult embeds — even with NO patron) MAY
 *      clear-all: the shed-direction allowance of the recorded deityWriteGate
 *      JUDGMENT (Wave R-0; veto = flip the gate branch back).
 *   3. FREE (unentitled, no embeds) is refused typed BEFORE the no-cults
 *      check; nothing dispatches.
 *   4. NO-CULTS clear-all for an entitled user stays the honest null no-op
 *      (nothing to clear ⇒ no event, no log entry) — the UI hides the control
 *      in that state (tests/components/deityClearCultsControl.test.jsx).
 *
 * Sibling coverage: tests/store/deityWriteGate.test.js pins the gate itself
 * plus the clear-PATRON and remove-ONE-cult paths; this file owns clear-ALL.
 */

import { describe, test, expect, vi } from 'vitest';

import {
  imposeCultImpl,
  DEITY_WRITE_REFUSAL,
} from '../../src/store/settlementDeityHelpers.js';
import { mutateSettlement } from '../../src/domain/events/mutate.js';

const CULT_A = { _deityRef: 'deity:lu_a:ash_choir', name: 'Ash Choir', alignmentAxis: 'evil', lawAxis: 'chaotic', rankAxis: 'cult' };
const CULT_B = { _deityRef: 'deity:lu_b:tide_kin', name: 'Tide Kin', alignmentAxis: 'neutral', lawAxis: 'neutral', rankAxis: 'cult' };
const PATRON = { _deityRef: 'deity:lu_p:aurelion', name: 'Aurelion', alignmentAxis: 'good', rankAxis: 'major' };

/** The deityWriteGate harness idiom (tests/store/deityWriteGate.test.js). */
function makeState({ entitled, settlement } = {}) {
  const applyEvent = vi.fn(event => event);
  const state = {
    customContent: { deities: [] },
    settlement,
    applyEvent,
    ...(entitled === undefined ? {} : { canUseCustomContent: () => entitled }),
  };
  return { state, get: () => state, applyEvent };
}

const CLEAR_ALL_ENVELOPE = {
  type: 'IMPOSE_CULT',
  targetId: null,
  payload: { deityRef: null, snapshot: null },
};

describe('clear-ALL cults — the store seam (imposeCultImpl with no ref, no removeRef)', () => {
  test('ENTITLED: dispatches the null envelope once', () => {
    const { get, applyEvent } = makeState({
      entitled: true,
      settlement: { tier: 'town', config: { primaryDeitySnapshot: PATRON, cultDeitySnapshots: [CULT_A, CULT_B] } },
    });
    expect(imposeCultImpl(get, null)).toMatchObject(CLEAR_ALL_ENVELOPE);
    expect(applyEvent).toHaveBeenCalledTimes(1);
  });

  test('LAPSED owning ONLY cults (no patron) MAY clear-all — the shed JUDGMENT covers the orphan-cult corner', () => {
    const { get, applyEvent } = makeState({
      entitled: false,
      settlement: { tier: 'town', config: { cultDeitySnapshots: [CULT_A, CULT_B] } },
    });
    expect(imposeCultImpl(get, null)).toMatchObject(CLEAR_ALL_ENVELOPE);
    expect(applyEvent).toHaveBeenCalledTimes(1);
  });

  test('FREE (no embeds): refused typed before the no-cults check; nothing dispatched', () => {
    const { get, applyEvent } = makeState({
      entitled: false,
      settlement: { tier: 'town', config: {} },
    });
    expect(imposeCultImpl(get, null)).toBe(DEITY_WRITE_REFUSAL);
    expect(applyEvent).not.toHaveBeenCalled();
  });

  test('ENTITLED with no cults: the honest null no-op — no event logged for an empty clear', () => {
    const { get, applyEvent } = makeState({
      entitled: true,
      settlement: { tier: 'town', config: { primaryDeitySnapshot: PATRON } },
    });
    expect(imposeCultImpl(get, null)).toBeNull();
    expect(applyEvent).not.toHaveBeenCalled();
  });
});

describe('clear-ALL cults — the pure handler (the door opens onto a working capability)', () => {
  test('the null envelope empties the list, DELETES the key (dormancy oracle), and leaves the patron', () => {
    const settlement = {
      tier: 'town',
      config: { primaryDeitySnapshot: PATRON, cultDeitySnapshots: [CULT_A, CULT_B] },
    };
    const next = mutateSettlement({ settlement, event: CLEAR_ALL_ENVELOPE });
    // A cult-free settlement is structurally identical to one that never had a
    // cult: the key is gone, not an empty array.
    expect('cultDeitySnapshots' in next.config).toBe(false);
    expect(next.config.primaryDeitySnapshot).toEqual(PATRON);
  });

  test('the remove-ONE envelope (removeRef) still removes only the named cult', () => {
    const settlement = {
      tier: 'town',
      config: { cultDeitySnapshots: [CULT_A, CULT_B] },
    };
    const next = mutateSettlement({
      settlement,
      event: { type: 'IMPOSE_CULT', targetId: CULT_A._deityRef, payload: { deityRef: CULT_A._deityRef, snapshot: null } },
    });
    expect((next.config.cultDeitySnapshots || []).map(c => c.name)).toEqual(['Tide Kin']);
  });
});
