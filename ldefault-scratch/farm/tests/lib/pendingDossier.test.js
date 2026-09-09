/** @vitest-environment jsdom */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  attachPendingDossierCheckout,
  clearPendingDossier,
  createDossierCheckoutToken,
  readPendingDossier,
  readPendingDossierByToken,
  readRestorablePendingDossier,
  stashPendingDossier,
} from '../../src/lib/pendingDossier.js';

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

const SAMPLE = { name: 'Greycairn', tier: 'town', population: 1300 };
const TOKEN = 'checkout-token-12345678901234567890';
const TOKEN_B = 'checkout-token-bbbbbbbbbbbbbbbbbbbb';

describe('stashPendingDossier()', () => {
  it('persists a tokenized settlement under a keyed map', () => {
    expect(stashPendingDossier(SAMPLE, TOKEN)).toBe(true);
    const raw = JSON.parse(window.localStorage.getItem('sf.pendingDossier'));
    expect(raw.v).toBe(2);
    expect(raw.entries[TOKEN].settlement.name).toBe('Greycairn');
    expect(raw.entries[TOKEN].checkoutToken).toBe(TOKEN);
    expect(typeof raw.entries[TOKEN].stashedAt).toBe('number');
  });

  it('rejects missing settlement or checkout token without wiping the stash', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    expect(stashPendingDossier(null, TOKEN)).toBe(false);
    expect(stashPendingDossier(SAMPLE, '')).toBe(false);
    expect(readPendingDossierByToken(TOKEN)?.settlement.name).toBe('Greycairn');
  });

  it('returns false when storage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota');
    });
    expect(stashPendingDossier(SAMPLE, TOKEN)).toBe(false);
    spy.mockRestore();
  });
});

describe('overwrite safety (F21a)', () => {
  it('a second Buy click does NOT overwrite the first stash — both tokens coexist', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    stashPendingDossier({ ...SAMPLE, name: 'Second' }, TOKEN_B);
    expect(readPendingDossierByToken(TOKEN)?.settlement.name).toBe('Greycairn');
    expect(readPendingDossierByToken(TOKEN_B)?.settlement.name).toBe('Second');
  });

  it('binding a session to one token leaves the other stash intact', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    stashPendingDossier({ ...SAMPLE, name: 'Second' }, TOKEN_B);
    expect(attachPendingDossierCheckout('cs_test_first', TOKEN)).toBe(true);
    expect(readPendingDossierByToken(TOKEN)?.sessionId).toBe('cs_test_first');
    expect(readPendingDossierByToken(TOKEN_B)?.sessionId).toBeNull();
  });
});

describe('paid stashes are TTL-immune (F21b)', () => {
  it('never purges a PAID stash on read, even past 24h', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE, TOKEN, 'cs_test_paid'); // paid at stash time
    vi.setSystemTime(new Date('2026-05-19T12:01:00'));   // > 48h later
    expect(readPendingDossierByToken(TOKEN)?.settlement.name).toBe('Greycairn');
    expect(readPendingDossier()?.sessionId).toBe('cs_test_paid');
  });

  it('still purges an UNPAID stash past the 24h TTL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE, TOKEN);
    vi.setSystemTime(new Date('2026-05-18T12:01:00')); // > 24h later
    expect(readPendingDossierByToken(TOKEN)).toBeNull();
    expect(readPendingDossier()).toBeNull();
  });

  it('keeps unpaid entries within the TTL (Stripe can take hours)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE, TOKEN);
    vi.setSystemTime(new Date('2026-05-17T15:00:00')); // 3h later — still valid
    expect(readPendingDossierByToken(TOKEN)?.settlement.name).toBe('Greycairn');
  });
});

describe('LRU eviction protects paid stashes', () => {
  it('evicts the oldest UNPAID stash when the cap is reached, never a paid one', () => {
    vi.useFakeTimers();
    // 5 stashes: oldest is PAID, rest unpaid. Adding a 6th must evict an UNPAID.
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE, 'paid-token-000000000000000000000000', 'cs_test_paidlru');
    for (let i = 1; i <= 4; i++) {
      vi.setSystemTime(new Date(`2026-05-17T12:0${i}:00`));
      stashPendingDossier(SAMPLE, `unpaid-token-${i}-000000000000000000`);
    }
    vi.setSystemTime(new Date('2026-05-17T12:30:00'));
    stashPendingDossier(SAMPLE, 'new-token-000000000000000000000000'); // 6th

    // Paid stash survived; the oldest UNPAID (token 1) was evicted.
    expect(readPendingDossierByToken('paid-token-000000000000000000000000')?.sessionId).toBe('cs_test_paidlru');
    expect(readPendingDossierByToken('unpaid-token-1-000000000000000000')).toBeNull();
    expect(readPendingDossierByToken('new-token-000000000000000000000000')).not.toBeNull();
  });
});

describe('readPendingDossier() / readRestorablePendingDossier()', () => {
  it('returns null when nothing is stored', () => {
    expect(readPendingDossier()).toBeNull();
    expect(readRestorablePendingDossier()).toBeNull();
  });

  it('returns the most recently stashed restorable dossier', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE, TOKEN);
    vi.setSystemTime(new Date('2026-05-17T12:05:00'));
    stashPendingDossier({ ...SAMPLE, name: 'Newer' }, TOKEN_B);
    expect(readRestorablePendingDossier()?.settlement.name).toBe('Newer');
  });

  it('clears malformed or pre-token payloads', () => {
    window.localStorage.setItem('sf.pendingDossier', '{not json');
    expect(readPendingDossier()).toBeNull();
    window.localStorage.setItem('sf.pendingDossier', JSON.stringify({
      settlement: SAMPLE,
      stashedAt: Date.now(),
    }));
    expect(readPendingDossier()).toBeNull();
  });

  it('migrates a legacy single-object (v1) stash', () => {
    window.localStorage.setItem('sf.pendingDossier', JSON.stringify({
      settlement: SAMPLE,
      checkoutToken: TOKEN,
      sessionId: 'cs_test_legacy',
      stashedAt: Date.now(),
    }));
    expect(readPendingDossierByToken(TOKEN)?.sessionId).toBe('cs_test_legacy');
  });
});

describe('checkout binding', () => {
  it('creates a suitably long one-time token', () => {
    expect(createDossierCheckoutToken().length).toBeGreaterThanOrEqual(24);
  });

  it('attaches Stripe session ID to the most-recent unpaid stash (no token arg)', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    expect(attachPendingDossierCheckout('cs_test_123')).toBe(true);
    expect(readPendingDossierByToken(TOKEN)?.sessionId).toBe('cs_test_123');
  });

  it('rejects invalid Stripe session IDs', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    expect(attachPendingDossierCheckout('not-stripe')).toBe(false);
    expect(readPendingDossierByToken(TOKEN)?.sessionId).toBeNull();
  });
});

describe('clearPendingDossier()', () => {
  it('clears just one entry by token, leaving the others', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    stashPendingDossier({ ...SAMPLE, name: 'Second' }, TOKEN_B);
    clearPendingDossier(TOKEN);
    expect(readPendingDossierByToken(TOKEN)).toBeNull();
    expect(readPendingDossierByToken(TOKEN_B)?.settlement.name).toBe('Second');
  });

  it('clears everything when called with no token, and is safe when empty', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    stashPendingDossier({ ...SAMPLE, name: 'Second' }, TOKEN_B);
    clearPendingDossier();
    expect(window.localStorage.getItem('sf.pendingDossier')).toBeNull();
    expect(() => clearPendingDossier()).not.toThrow();
  });
});
