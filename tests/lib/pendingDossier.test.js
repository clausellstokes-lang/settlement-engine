/** @vitest-environment jsdom */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  attachPendingDossierCheckout,
  clearPendingDossier,
  createDossierCheckoutToken,
  readPendingDossier,
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

describe('stashPendingDossier()', () => {
  it('persists a tokenized settlement', () => {
    expect(stashPendingDossier(SAMPLE, TOKEN)).toBe(true);
    const raw = JSON.parse(window.localStorage.getItem('sf.pendingDossier'));
    expect(raw.settlement.name).toBe('Greycairn');
    expect(raw.checkoutToken).toBe(TOKEN);
    expect(typeof raw.stashedAt).toBe('number');
  });

  it('rejects missing settlement or checkout token without wiping the stash', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    expect(stashPendingDossier(null, TOKEN)).toBe(false);
    expect(stashPendingDossier(SAMPLE, '')).toBe(false);
    expect(readPendingDossier()?.settlement.name).toBe('Greycairn');
  });

  it('returns false when storage throws', () => {
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota');
    });
    expect(stashPendingDossier(SAMPLE, TOKEN)).toBe(false);
    spy.mockRestore();
  });
});

describe('readPendingDossier()', () => {
  it('returns null when nothing is stored', () => {
    expect(readPendingDossier()).toBeNull();
  });

  it('round-trips a stash with a Stripe session', () => {
    stashPendingDossier(SAMPLE, TOKEN, 'cs_test_123');
    const got = readPendingDossier();
    expect(got.settlement.name).toBe('Greycairn');
    expect(got.checkoutToken).toBe(TOKEN);
    expect(got.sessionId).toBe('cs_test_123');
  });

  it('clears stale entries after the 24h TTL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE, TOKEN);
    vi.setSystemTime(new Date('2026-05-18T12:01:00')); // > 24h later
    expect(readPendingDossier()).toBeNull();
    expect(window.localStorage.getItem('sf.pendingDossier')).toBeNull();
  });

  it('keeps entries within the TTL (Stripe can take hours)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE, TOKEN);
    vi.setSystemTime(new Date('2026-05-17T15:00:00')); // 3h later — still valid
    expect(readPendingDossier()?.settlement.name).toBe('Greycairn');
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
});

describe('checkout binding', () => {
  it('creates a suitably long one-time token', () => {
    expect(createDossierCheckoutToken().length).toBeGreaterThanOrEqual(24);
  });

  it('attaches Stripe session ID to an existing stash', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    expect(attachPendingDossierCheckout('cs_test_123')).toBe(true);
    expect(readPendingDossier()?.sessionId).toBe('cs_test_123');
  });

  it('rejects invalid Stripe session IDs', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    expect(attachPendingDossierCheckout('not-stripe')).toBe(false);
    expect(readPendingDossier()?.sessionId).toBeNull();
  });
});

describe('clearPendingDossier()', () => {
  it('removes the stash and is safe when empty', () => {
    stashPendingDossier(SAMPLE, TOKEN);
    clearPendingDossier();
    expect(window.localStorage.getItem('sf.pendingDossier')).toBeNull();
    expect(() => clearPendingDossier()).not.toThrow();
  });
});
