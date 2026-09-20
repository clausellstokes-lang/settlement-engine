/** @vitest-environment jsdom */
/**
 * anonForkSalt.test.js — THE PER-VISITOR FORK SALT, and every lifecycle path it
 * has to survive (REVIEW-P F1, ODQ §934.63).
 *
 * THE DEFECT, as walked on 2026-09-20: two independent anonymous browser
 * contexts forked the sample Cnocby and were handed the SAME world — settlement
 * id `s_01773858621d9a94`, seed `cnocby-033a-anon`, the same population and the
 * same four NPCs — because a signed-out reader's fork suffix was the constant
 * string 'anon'. Meanwhile /create promised "no two the same, all deterministic
 * from their seed" and the Library's sample dashboard promised "Each forks with
 * a unique character. Same setting, different settlement."
 *
 * THE TWO HALVES OF THE LAW, which pull against each other and must BOTH hold:
 *   · two distinct visitors forking one sample get DIFFERENT worlds;
 *   · one visitor forking one sample twice gets the SAME world, because THE
 *     PROMISE is that a seed is a starting world forever.
 * A per-click mint would buy the first and lose the second; the constant it
 * replaces bought the second and lost the first.
 *
 * The lifecycle arms below are the ones the cure was ruled against by name: the
 * salt survives a reload, survives a cleared editor, and stands aside the moment
 * an account id exists.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  anonForkSalt,
  forkIdentity,
  ANON_FORK_SALT_KEY,
  __resetAnonForkSaltMemory,
} from '../../src/lib/anonForkSalt.js';
import { SAMPLE_SETTLEMENTS, forkSeedFor } from '../../src/data/sampleSettlements.js';

const CNOCBY = SAMPLE_SETTLEMENTS.find((s) => s.id === 'sample-cnocby') ?? SAMPLE_SETTLEMENTS[0];

/** A fresh visitor: no stored salt, no in-memory fallback carried over. */
function freshVisitor() {
  window.localStorage.clear();
  __resetAnonForkSaltMemory();
}

beforeEach(freshVisitor);
afterEach(() => { vi.restoreAllMocks(); freshVisitor(); });

describe('anonForkSalt — minted once, then held', () => {
  it('mints a salt on first use and stores it under its own key', () => {
    expect(window.localStorage.getItem(ANON_FORK_SALT_KEY)).toBeNull();
    const salt = anonForkSalt();
    expect(typeof salt).toBe('string');
    expect(salt.length).toBeGreaterThanOrEqual(8);
    expect(window.localStorage.getItem(ANON_FORK_SALT_KEY)).toBe(salt);
  });

  it('returns the SAME salt on every later call (a visitor is one visitor)', () => {
    const first = anonForkSalt();
    expect(anonForkSalt()).toBe(first);
    expect(anonForkSalt()).toBe(first);
  });

  it('survives a reload: a new module instance reads the stored salt back', () => {
    const before = anonForkSalt();
    // A reload keeps localStorage and throws the module's memory away. This is
    // the arm that makes a returning visitor the same visitor.
    __resetAnonForkSaltMemory();
    expect(anonForkSalt()).toBe(before);
  });

  it('is NOT the store envelope, so a cleared editor leaves it standing', () => {
    // The anonymous DRAFT lives in zustand's persisted projection under
    // 'settlementforge' (store/persistProjection.js). The salt deliberately does
    // not, so clearing or retiring a draft — which rewrites that key — cannot
    // take the visitor's identity with it.
    const salt = anonForkSalt();
    expect(ANON_FORK_SALT_KEY).not.toBe('settlementforge');
    window.localStorage.setItem('settlementforge', JSON.stringify({ state: { anonDraft: null }, version: 2 }));
    window.localStorage.removeItem('settlementforge');
    __resetAnonForkSaltMemory();
    expect(anonForkSalt()).toBe(salt);
  });

  it('re-mints rather than handing out a corrupted or emptied value', () => {
    window.localStorage.setItem(ANON_FORK_SALT_KEY, '');
    __resetAnonForkSaltMemory();
    const salt = anonForkSalt();
    expect(salt.length).toBeGreaterThanOrEqual(8);
    expect(window.localStorage.getItem(ANON_FORK_SALT_KEY)).toBe(salt);
  });

  it('degrades to a stable in-memory salt when storage refuses', () => {
    // Private mode / quota: nothing can be remembered across a reload, but the
    // visitor must still differ from everyone else AND repeat within the page.
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    const salt = anonForkSalt();
    expect(typeof salt).toBe('string');
    expect(salt.length).toBeGreaterThanOrEqual(8);
    expect(anonForkSalt()).toBe(salt);
  });
});

describe('forkIdentity — who is forking', () => {
  it('is the account id, WHOLE, when one exists', () => {
    const id = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    expect(forkIdentity(id)).toBe(id);
  });

  it('never consults, and never mints, a salt for a signed-in account', () => {
    forkIdentity('7c9e6679-7425-40de-944b-e07fc1f90ae7');
    expect(window.localStorage.getItem(ANON_FORK_SALT_KEY)).toBeNull();
  });

  it('falls to this visitor\'s salt for every shape of absent id', () => {
    const salt = anonForkSalt();
    expect(forkIdentity(undefined)).toBe(salt);
    expect(forkIdentity(null)).toBe(salt);
    expect(forkIdentity('')).toBe(salt);
  });

  it('adopts the account id the moment sign-in provides one', () => {
    // Sign-in is not an event this module listens for: the doors pass the id
    // once auth has it, so the switch is automatic and needs no migration.
    const salt = anonForkSalt();
    expect(forkIdentity(null)).toBe(salt);
    expect(forkIdentity('account-1')).toBe('account-1');
    // And signing out returns the SAME device to the SAME salt.
    expect(forkIdentity(null)).toBe(salt);
  });
});

describe('the cure, end to end: the two halves of the promise', () => {
  it('TWO VISITORS forking one sample get different seeds', () => {
    const visitorA = forkSeedFor(CNOCBY, forkIdentity(null));
    const saltA = window.localStorage.getItem(ANON_FORK_SALT_KEY);

    freshVisitor(); // a second browser, which is what the review actually drove
    const visitorB = forkSeedFor(CNOCBY, forkIdentity(null));
    const saltB = window.localStorage.getItem(ANON_FORK_SALT_KEY);

    expect(saltB).not.toBe(saltA);
    expect(visitorB).not.toBe(visitorA);
    // The exact seed the walk measured on BOTH contexts must now be reachable
    // by neither of them.
    expect(visitorA).not.toBe('cnocby-033a-anon');
    expect(visitorB).not.toBe('cnocby-033a-anon');
  });

  it('ONE VISITOR re-forking the same sample gets the same seed, across a reload', () => {
    const first = forkSeedFor(CNOCBY, forkIdentity(null));
    expect(forkSeedFor(CNOCBY, forkIdentity(null))).toBe(first);
    __resetAnonForkSaltMemory(); // the reload
    expect(forkSeedFor(CNOCBY, forkIdentity(null))).toBe(first);
  });

  it('one visitor still gets a different world from each DIFFERENT sample', () => {
    const seeds = SAMPLE_SETTLEMENTS.map((s) => forkSeedFor(s, forkIdentity(null)));
    expect(new Set(seeds).size).toBe(seeds.length);
  });

  it('two accounts sharing eight id characters no longer collide', () => {
    const a = forkSeedFor(CNOCBY, forkIdentity('aaaaaaaa-1111-4000-8000-000000000001'));
    const b = forkSeedFor(CNOCBY, forkIdentity('aaaaaaaa-1111-4000-8000-000000000002'));
    expect(a).not.toBe(b);
  });
});
