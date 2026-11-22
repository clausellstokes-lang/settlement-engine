/** @vitest-environment jsdom */
/**
 * dossierClaimStash.test.jsx — the same-device retro-claim voucher store (108).
 *
 * Covers the properties the silent auto-upgrade depends on:
 *   · stash → read round-trips the proof material + settlement identity;
 *   · the session id is bound separately (arming) on the success page;
 *   · claimMatchesSettlement matches on the generation SEED, and a name-only
 *     fallback applies ONLY when neither side has a seed (so a seed mismatch can
 *     never be papered over by a coincidental name);
 *   · a stash with no identifiable settlement is refused (nothing to match on).
 */
import { afterEach, describe, expect, test } from 'vitest';
import {
  stashDossierClaim, readDossierClaim, attachDossierClaimSession,
  claimMatchesSettlement, clearDossierClaim,
} from '../../src/lib/dossierClaimStash.js';

const TOKEN = 'tok_abcdefghijklmnopqrstuvwx';

afterEach(() => clearDossierClaim());

describe('dossierClaimStash', () => {
  test('stash → read round-trips the token + settlement identity', () => {
    expect(stashDossierClaim({ settlement: { name: 'Stoneford', _seed: 'seed-1' }, checkoutToken: TOKEN })).toBe(true);
    const v = readDossierClaim();
    expect(v).toMatchObject({ checkoutToken: TOKEN, sessionId: null, settlementId: 'seed-1', settlementName: 'Stoneford' });
  });

  test('refuses to stash a settlement with no identifiable seed or name', () => {
    expect(stashDossierClaim({ settlement: {}, checkoutToken: TOKEN })).toBe(false);
    expect(readDossierClaim()).toBe(null);
  });

  test('attachDossierClaimSession arms the voucher with the paid session id', () => {
    stashDossierClaim({ settlement: { _seed: 'seed-1' }, checkoutToken: TOKEN });
    expect(attachDossierClaimSession('cs_test_1')).toBe(true);
    expect(readDossierClaim().sessionId).toBe('cs_test_1');
  });

  test('matches on the generation seed', () => {
    const v = { settlementId: 'seed-1', settlementName: 'Stoneford' };
    expect(claimMatchesSettlement({ _seed: 'seed-1', name: 'Renamed' }, v)).toBe(true);
    expect(claimMatchesSettlement({ _seed: 'seed-2', name: 'Stoneford' }, v)).toBe(false);
  });

  test('falls back to name ONLY when neither side carries a seed', () => {
    const seedlessVoucher = { settlementId: null, settlementName: 'Stoneford' };
    expect(claimMatchesSettlement({ name: 'Stoneford' }, seedlessVoucher)).toBe(true);
    expect(claimMatchesSettlement({ name: 'Elsewhere' }, seedlessVoucher)).toBe(false);
    // A seeded save must NOT name-match a seedless voucher (seed mismatch wins).
    expect(claimMatchesSettlement({ _seed: 'seed-9', name: 'Stoneford' }, seedlessVoucher)).toBe(false);
  });
});
