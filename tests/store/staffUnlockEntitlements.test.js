/**
 * staffUnlockEntitlements.test.js — THE §934.28 STAFF UNLOCK, PER GATE, PER ROLE.
 *
 * THE ORDER (the owner, verbatim): "enable all paid for features (for right now)
 * to all developers and admin for testing purposes."
 *
 * Two things had to be proved, and they pull in opposite directions:
 *   A. staff (developer/admin) reach EVERY paid gate;
 *   B. nobody else's answer moved — anon, free and premium read exactly what
 *      they read before, so a testing unlock cannot quietly become a giveaway.
 *
 * So the matrix below is TABLE-DRIVEN over the nine permission queries the
 * recon enumerated in src/store/authSlice.js, and every row asserts BOTH
 * directions. The free/anon rows are the load-bearing ones: an implementation
 * that returned true unconditionally would satisfy (A) and fail here.
 *
 * ⛔ AND THE SWITCH IS PROVED TO BE A SWITCH. STAFF_UNLOCK_ALL_PAID is the
 * owner's "for right now" made revocable in one line. A constant nothing
 * consults is a comment, so the revoked behaviour is measured directly against
 * the predicate rather than asserted in prose — see the final block.
 */
import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  STAFF_UNLOCK_ALL_PAID,
  STAFF_ROLES,
  isStaffRole,
  staffUnlocksPaidFeatures,
  resolveStaffEntitlements,
} from '../../src/lib/staffEntitlements.js';
import { createAuthSlice, TIER_GATE } from '../../src/store/authSlice.js';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

/**
 * A minimal store standing in for the real one: the auth slice's permission
 * queries only ever read `get().auth`, so this exercises the SHIPPED functions
 * rather than a re-implementation of them.
 *
 * @param {{ tier?: string, role?: string }} auth
 */
function sliceFor({ tier = 'anon', role = 'user' } = {}) {
  /** @type {any} */
  let state = {};
  const get = () => state;
  const set = (fn) => { fn(state); };
  state = createAuthSlice(set, get);
  // Seat the account exactly as the auth writers do — through the slice's own
  // setter, so resolveTier runs and the elevated tier override is real rather
  // than hand-planted.
  state.setAuth({ id: 'u1' }, { access_token: 't' }, tier, role, null);
  // canAffordAI defers to the credits slice for non-staff; a zero-balance stub
  // keeps the non-staff arm honest (it must NOT be admitted by this module).
  state.canAfford = () => false;
  return state;
}

/** The nine paid gates, each read from the slice and reduced to a comparable. */
const GATES = Object.freeze({
  canSave:             (s) => s.canSave(),
  canUseNeighbour:     (s) => s.canUseNeighbour(),
  canExport:           (s) => s.canExport(),
  canUseMapChains:     (s) => s.canUseMapChains(),
  canUseCustomContent: (s) => s.canUseCustomContent(),
  maxAllowedTier:      (s) => s.maxAllowedTier(),
  maxSaves:            (s) => s.maxSaves(),
  isTierAllowed:       (s) => s.isTierAllowed('metropolis'),
  canAffordAI:         (s) => s.canAffordAI('narrative'),
});

/** What a STAFF account must read at every gate: the unlocked answer. */
const STAFF_EXPECTED = Object.freeze({
  canSave: true, canUseNeighbour: true, canExport: true, canUseMapChains: true,
  canUseCustomContent: true, maxAllowedTier: 'metropolis', maxSaves: Infinity,
  isTierAllowed: true, canAffordAI: true,
});

/**
 * What the UNCHANGED populations must read — transcribed from the recon's gate
 * table, not from TIER_GATE, so a TIER_GATE edit that quietly widened a tier
 * would red here instead of being mirrored into the expectation.
 */
const BASELINE = Object.freeze({
  anon: {
    canSave: false, canUseNeighbour: false, canExport: false, canUseMapChains: false,
    canUseCustomContent: false, maxAllowedTier: 'town', maxSaves: 0,
    isTierAllowed: false, canAffordAI: false,
  },
  free: {
    canSave: true, canUseNeighbour: false, canExport: false, canUseMapChains: false,
    canUseCustomContent: false, maxAllowedTier: 'capital', maxSaves: 3,
    isTierAllowed: true, canAffordAI: false,
  },
  premium: {
    canSave: true, canUseNeighbour: true, canExport: true, canUseMapChains: true,
    canUseCustomContent: true, maxAllowedTier: 'capital', maxSaves: Infinity,
    isTierAllowed: true, canAffordAI: false,
  },
});

describe('the register itself', () => {
  test('the unlock is ON, and the two staff roles are exactly developer + admin', () => {
    // ⛔ ANTI-VACUITY. Every "staff reaches it" arm below would pass on an
    // unconditional `true`, and every "nobody else moved" arm would pass on an
    // empty role set. Both are pinned here first.
    expect(STAFF_UNLOCK_ALL_PAID, 'the owner has not revoked §934.28').toBe(true);
    expect([...STAFF_ROLES].sort()).toEqual(['admin', 'developer']);
  });

  test('isStaffRole fails closed on everything that is not one of the two strings', () => {
    for (const role of STAFF_ROLES) expect(isStaffRole(role)).toBe(true);
    for (const bad of [
      'user', 'Admin', 'DEVELOPER', 'admin ', '', null, undefined, 0, 1, true,
      ['admin'], { role: 'admin' }, Object('admin'),
    ]) {
      expect(isStaffRole(bad), `${String(bad)} must not read as staff`).toBe(false);
    }
  });

  test('resolveStaffEntitlements: the effective tier is the gate-facing answer', () => {
    expect(resolveStaffEntitlements({ role: 'developer', tier: 'free' }))
      .toEqual({ isStaff: true, unlocksPaid: true, effectiveTier: 'premium' });
    expect(resolveStaffEntitlements({ role: 'admin', tier: null }))
      .toEqual({ isStaff: true, unlocksPaid: true, effectiveTier: 'premium' });
    // A member is untouched, and a missing tier reads 'free' — never 'premium'.
    expect(resolveStaffEntitlements({ role: 'user', tier: 'free' }))
      .toEqual({ isStaff: false, unlocksPaid: false, effectiveTier: 'free' });
    expect(resolveStaffEntitlements({ role: 'user' }))
      .toEqual({ isStaff: false, unlocksPaid: false, effectiveTier: 'free' });
    expect(resolveStaffEntitlements(null))
      .toEqual({ isStaff: false, unlocksPaid: false, effectiveTier: 'free' });
  });

  test('the role is read from the profile, never from a client-writable surface', () => {
    // The module is import-free by design (the same posture as viewerAuthority),
    // so it cannot reach localStorage, a query string or the store. Proved by
    // behaviour: only the `role` FIELD moves the answer — a tier claiming to be
    // 'admin', or a query-shaped string, does nothing.
    expect(staffUnlocksPaidFeatures('admin')).toBe(true);
    expect(resolveStaffEntitlements({ tier: 'admin', role: 'user' }).unlocksPaid).toBe(false);
    expect(resolveStaffEntitlements({ role: '?role=admin' }).unlocksPaid).toBe(false);
  });
});

describe('A. every paid gate opens for staff', () => {
  for (const role of ['developer', 'admin']) {
    test(`${role} reaches all nine gates — even seated on the FREE tier`, () => {
      // Seated on 'free' deliberately: if the unlock rode on the billing tier
      // rather than the role, this is where it would show.
      const s = sliceFor({ tier: 'free', role });
      const actual = Object.fromEntries(
        Object.entries(GATES).map(([name, read]) => [name, read(s)]),
      );
      expect(actual).toEqual(STAFF_EXPECTED);
    });

    test(`${role} reads as premium everywhere auth.tier is consulted`, () => {
      expect(sliceFor({ tier: 'free', role }).auth.tier).toBe('premium');
      // …and identity is separate from entitlement.
      expect(sliceFor({ tier: 'free', role }).isElevated()).toBe(true);
    });
  }

  test('isDeveloper names the developer alone; isAdmin/isElevated take both', () => {
    expect(sliceFor({ role: 'developer' }).isDeveloper()).toBe(true);
    expect(sliceFor({ role: 'admin' }).isDeveloper()).toBe(false);
    for (const role of STAFF_ROLES) {
      expect(sliceFor({ role }).isAdmin()).toBe(true);
      expect(sliceFor({ role }).isElevated()).toBe(true);
    }
  });
});

describe('B. no other population moved', () => {
  for (const [tier, expected] of Object.entries(BASELINE)) {
    test(`${tier} reads exactly what it read before the unlock`, () => {
      const s = sliceFor({ tier, role: 'user' });
      const actual = Object.fromEntries(
        Object.entries(GATES).map(([name, read]) => [name, read(s)]),
      );
      expect(actual).toEqual(expected);
    });
  }

  test('an ANONYMOUS visitor can never be staff, whatever the role field says', () => {
    // clearAuth is the anonymous state's one writer; it resets the role too, so
    // a departing staff session cannot leave its role behind on the device.
    const s = sliceFor({ tier: 'premium', role: 'admin' });
    expect(s.isElevated(), 'presence control: staff before sign-out').toBe(true);
    s.clearAuth();
    expect(s.auth.role).toBe('user');
    expect(s.auth.tier).toBe('anon');
    expect(s.isElevated()).toBe(false);
    expect(s.canExport()).toBe(false);
  });

  test("the roles that unlock are ONLY the two — 'user' travels the same path and does not", () => {
    const unlocked = ['user', 'developer', 'admin'].filter(staffUnlocksPaidFeatures);
    expectAbsentWithAnchor(unlocked, 'user', 'developer', 'the staff-unlock role set');
    expect(unlocked.sort()).toEqual(['admin', 'developer']);
  });

  test('TIER_GATE itself is untouched — the unlock is a bypass, never a rewrite', () => {
    // The order was "enable the features for staff", not "make the free tier
    // premium". If a future edit moved the gate table instead of the role check,
    // arm B above would still pass for `free` only if the table matched; this
    // pins the table directly so the two can never be confused.
    expect(TIER_GATE.free.export).toBe(false);
    expect(TIER_GATE.free.neighbour).toBe(false);
    expect(TIER_GATE.free.customContent).toBe(false);
    expect(TIER_GATE.free.maxSaves).toBe(3);
    expect(TIER_GATE.anon.maxTier).toBe('town');
  });
});

describe('C. the sign-in path resolves the tier like its four siblings', () => {
  test('authSignIn seats a staff account as premium (it used to write the raw tier)', async () => {
    // THE HOLE THE RECON FOUND. setAuth, initAuth, authSignUp and the
    // onAuthChange handler all passed the profile tier through resolveTier;
    // authSignIn alone wrote `result.tier` straight through, so a developer
    // signing in with a password held tier 'free' until the auth-state listener
    // happened to land — a race deciding whether staff saw the paid surface.
    // Driven through the SHIPPED action with the service's one method stubbed.
    const { auth: authService } = await import('../../src/lib/auth.js');
    const original = authService.signIn;
    authService.signIn = async () => ({
      user: { id: 'u2' }, session: { access_token: 't' },
      // A staff profile whose BILLING tier is free — staff never pay.
      tier: 'free', role: 'developer', displayName: null, isFounder: false,
    });
    try {
      /** @type {any} */
      let state = {};
      const get = () => state;
      const set = (fn) => { fn(state); };
      state = createAuthSlice(set, get);
      await state.authSignIn('dev@example.com', 'pw');
      expect(state.auth.role).toBe('developer');
      expect(state.auth.tier, 'the staff override applies on the sign-in path too').toBe('premium');
      expect(state.canExport()).toBe(true);
    } finally {
      authService.signIn = original;
    }
  });
});

describe('D. the kill switch is a switch, MEASURED', () => {
  afterEach(() => {
    vi.doUnmock('../../src/lib/staffEntitlements.js');
    vi.resetModules();
  });

  test('with STAFF_UNLOCK_ALL_PAID false, staff fall back to their real tier', async () => {
    // ⛔ A CONSTANT NOTHING CONSULTS IS A COMMENT. The owner's "for right now"
    // is only revocable in one line if that line actually reaches the gates, so
    // the revoked world is EXECUTED here rather than asserted in prose: the
    // module is re-imported with the switch off and the same nine gates are read
    // off a freshly-imported slice.
    vi.resetModules();
    vi.doMock('../../src/lib/staffEntitlements.js', async (importOriginal) => {
      /** @type {any} */
      const actual = await importOriginal();
      return {
        ...actual,
        STAFF_UNLOCK_ALL_PAID: false,
        // The ENTITLEMENT question follows the switch…
        staffUnlocksPaidFeatures: () => false,
        // …while IDENTITY does not: isStaffRole is re-exported untouched.
      };
    });
    const { createAuthSlice: revokedSlice } = await import('../../src/store/authSlice.js');

    /** @type {any} */
    let state = {};
    const get = () => state;
    const set = (fn) => { fn(state); };
    state = revokedSlice(set, get);
    state.setAuth({ id: 'u3' }, { access_token: 't' }, 'free', 'developer', null);
    state.canAfford = () => false;

    // The tier override is gone: a developer reads their REAL billing tier…
    expect(state.auth.tier).toBe('free');
    // …and every paid gate answers from TIER_GATE, exactly as for a member.
    expect(state.canExport()).toBe(false);
    expect(state.canUseNeighbour()).toBe(false);
    expect(state.canUseMapChains()).toBe(false);
    expect(state.canUseCustomContent()).toBe(false);
    expect(state.maxSaves()).toBe(3);
    expect(state.maxAllowedTier()).toBe('capital');
    expect(state.canAffordAI('narrative')).toBe(false);

    // ⛔ AND THE ADMIN PANEL IS STILL THEIRS. Revoking a testing convenience
    // must never lock the owner out, so IDENTITY is deliberately outside the
    // switch's reach — this is the assertion that keeps the two questions apart.
    expect(state.isElevated()).toBe(true);
    expect(state.isAdmin()).toBe(true);
    expect(state.isDeveloper()).toBe(true);
  });
});
