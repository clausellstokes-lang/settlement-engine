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
 *
 * ⭐ FIX-P1b — THE ACCOUNT BRANCH IS A DIGEST, AND THE ADDRESS IS PINNED. The
 * first cut used the account id WHOLE, which cured the collision and made a
 * signed-in seed ~48 characters; §7a row 1 calls a fork seed "the address …
 * typeable in the `SeedField`". The suffix is now a short fixed-width digest of
 * the whole id, so BOTH properties hold at once, and the last describe block
 * pins the seed's length against the module's own declared width.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  anonForkSalt,
  forkIdentity,
  ANON_FORK_SALT_KEY,
  ACCOUNT_DIGEST_HEX,
  FORK_SUFFIX_MAX,
  FORK_SEED_MAX,
  __resetAnonForkSaltMemory,
} from '../../src/lib/anonForkSalt.js';
import { SAMPLE_SETTLEMENTS, forkSeedFor } from '../../src/data/sampleSettlements.js';
// The estate's declared short-hash idiom, imported so the entropy arm below can
// PROVE its pinned pair collides under one round instead of asserting that it does.
import { fnv1a32 } from '../../src/kernel/proseHash.js';

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
  it('is a short fixed-width digest of the account id, never the id itself', () => {
    const id = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const suffix = forkIdentity(id);
    expect(suffix).not.toBe(id);
    expect(suffix).toHaveLength(ACCOUNT_DIGEST_HEX);
    expect(suffix).toMatch(/^[0-9a-f]+$/);
  });

  it('reads the WHOLE id, so a shared eight-character prefix still diverges', () => {
    // The digest is what lets the suffix be short AND still distinguish two
    // accounts — truncation could do only the first (REVIEW-P noticed 8).
    expect(forkIdentity('aaaaaaaa-1111-4000-8000-000000000001'))
      .not.toBe(forkIdentity('aaaaaaaa-1111-4000-8000-000000000002'));
  });

  it('is stable for one account, which is what THE PROMISE requires', () => {
    const id = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    expect(forkIdentity(id)).toBe(forkIdentity(id));
  });

  // ⛔⛔ THE ARM THAT CATCHES A COSMETIC WIDENING, and it proves its own premise
  // rather than trusting a comment. The suffix is twelve characters because at
  // eight (32 bits) two accounts collide at even odds somewhere around 77,000 of
  // them. TWO ways of reaching twelve characters are worthless, both measured
  // before the real one was written, and both look correct in a diff:
  //   · padStart a single 32-bit round out to twelve — the extra characters are
  //     leading zeros, carrying no information;
  //   · append a domain for the second round — FNV-1a is iterative, so two ids
  //     already in the same state stay in it, and every appended byte is applied
  //     to that one state.
  // This pair is the receipt: it COLLIDES under one round (asserted below, not
  // assumed) and must diverge under the digest. Either wrong turn reds here.
  it('carries real entropy past the eighth character, not filler', () => {
    const a = 'acct-d36f';
    const b = 'acct-bb799';
    // The premise, EXECUTED: one round cannot tell these two apart.
    expect(fnv1a32(a), 'the pinned pair no longer collides under one round')
      .toBe(fnv1a32(b));
    // …and the appended-domain variant cannot either, which is why it is not used.
    expect(fnv1a32(`${a}sf.fork`)).toBe(fnv1a32(`${b}sf.fork`));
    // The digest must separate them anyway.
    expect(forkIdentity(a)).not.toBe(forkIdentity(b));
    // And the separation has to live in the characters a single round could not
    // have produced, so a revert to `padStart` cannot pass this by accident.
    expect(forkIdentity(a).slice(0, 8)).toBe(forkIdentity(b).slice(0, 8));
    expect(forkIdentity(a).slice(8)).not.toBe(forkIdentity(b).slice(8));
  });

  it('spends every character of the suffix (no leading-zero filler)', () => {
    // A 32-bit round padded to twelve would start `0000` for EVERY account.
    const digests = Array.from({ length: 64 }, (_, i) => forkIdentity(`acct-${i}-${'z'.repeat(i)}`));
    expect(digests.every((d) => d.length === ACCOUNT_DIGEST_HEX)).toBe(true);
    expect(digests.every((d) => d.startsWith('0000'))).toBe(false);
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
    const signedIn = forkIdentity('account-1');
    expect(signedIn).not.toBe(salt);
    expect(signedIn).toHaveLength(ACCOUNT_DIGEST_HEX);
    // And signing out returns the SAME device to the SAME salt.
    expect(forkIdentity(null)).toBe(salt);
  });
});

/**
 * ⭐ THE ADDRESS PIN (FIX-P1b). §7a row 1 calls a fork seed "the address …
 * typeable in the `SeedField`", and that is the whole reason the account branch
 * is a digest rather than the id itself: FIX-P1 cured the collision by using the
 * id WHOLE, which made a signed-in seed ~48 characters — a string a reader copies
 * rather than types.
 *
 * ⚠ PINNED AGAINST THE MODULE'S DECLARED WIDTH, BECAUSE THE FIELD DECLARES NONE.
 * The ruling asked for this to be pinned against the SeedField's own limit. There
 * is none to read: `generate/LayeredConfigurationPanel.jsx#SeedField` renders a
 * bare `<input type="text">` with no `maxLength` — only a layout width
 * (`flex: '1 1 200px', minWidth: 160`), which is pixels and not characters. So the
 * anchor is `FORK_SUFFIX_MAX`, the width the module itself declares, and the seed's
 * length is asserted as a FUNCTION of the card's own seed plus that constant —
 * never a number chosen in this file. If the field is ever given a real
 * `maxLength`, this is the arm that should read it instead.
 */
describe('a fork seed stays an address, not a pasted blob', () => {
  it('a signed-in fork seed is the card seed plus one declared-width suffix', () => {
    const id = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const seed = forkSeedFor(CNOCBY, forkIdentity(id));
    expect(seed).toBe(`${CNOCBY.config.seed}-${forkIdentity(id)}`);
    expect(seed).toHaveLength(CNOCBY.config.seed.length + 1 + ACCOUNT_DIGEST_HEX);
  });

  // ⭐ OWNER-SIGNED, ODQ §934.72: the field now declares this same number, so the
  // pin finally has the field limit it was always supposed to read. Asserted as an
  // identity between two derivations, never against a literal.
  it('FORK_SEED_MAX is exactly the ceiling this pin enforces', () => {
    const longestCard = Math.max(...SAMPLE_SETTLEMENTS.map((s) => s.config.seed.length));
    expect(FORK_SEED_MAX).toBe(longestCard + 1 + FORK_SUFFIX_MAX);
    // …and it is reached, not merely respected: one card sits exactly on it, so a
    // ceiling quietly lowered by one would red rather than pass with slack.
    const widest = SAMPLE_SETTLEMENTS
      .map((s) => forkSeedFor(s, forkIdentity('7c9e6679-7425-40de-944b-e07fc1f90ae7')).length);
    expect(Math.max(...widest)).toBe(FORK_SEED_MAX);
  });

  it('no forker, signed in or out, can push a seed past the declared ceiling', () => {
    const ceiling = (sample) => sample.config.seed.length + 1 + FORK_SUFFIX_MAX;
    const forkers = [
      null,
      'a',
      '7c9e6679-7425-40de-944b-e07fc1f90ae7',
      // A pathological id: whatever the account layer hands over, the address holds.
      'x'.repeat(4096),
    ];
    for (const sample of SAMPLE_SETTLEMENTS) {
      for (const who of forkers) {
        const seed = forkSeedFor(sample, forkIdentity(who));
        expect(seed.length, `${sample.id} / ${String(who).slice(0, 12)}`)
          .toBeLessThanOrEqual(ceiling(sample));
      }
    }
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

  // ⭐⭐ THE OWNER SIGNED DETERMINISM (ODQ §934.66): a repeat fork of one card by one
  // identity yields the SAME world, and §7a row 1's living door stays closed until
  // the owner opens it. This is the arm that makes that a fact rather than a
  // reading of the source — a timestamp or a counter anywhere in the derivation
  // would show up here as a second distinct seed.
  it('ONE ACCOUNT re-forking ONE card is byte-identical, a thousand times over', () => {
    const id = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const seeds = new Set();
    for (let i = 0; i < 1000; i += 1) seeds.add(forkSeedFor(CNOCBY, forkIdentity(id)));
    expect(seeds.size, 'a repeat fork drew a different world: something in the derivation varies')
      .toBe(1);
    expect([...seeds][0]).toBe(`${CNOCBY.config.seed}-${forkIdentity(id)}`);
  });

  it('a signed-in repeat fork survives a reload AND a cleared device salt', () => {
    // The account branch must not consult the device at all, so neither a reload
    // nor a visitor clearing their storage can move a signed-in reader's world.
    const id = '7c9e6679-7425-40de-944b-e07fc1f90ae7';
    const first = forkSeedFor(CNOCBY, forkIdentity(id));
    __resetAnonForkSaltMemory();               // the reload
    window.localStorage.clear();               // the cleared device
    expect(forkSeedFor(CNOCBY, forkIdentity(id))).toBe(first);
    anonForkSalt();                            // and a NEW device salt is minted
    expect(forkSeedFor(CNOCBY, forkIdentity(id))).toBe(first);
  });
});
