/** @vitest-environment jsdom */
/**
 * tests/lib/pendingDossier.test.js — Pre/post Stripe-redirect stash.
 *
 * The stash is the only thing standing between a paid receipt and an
 * empty dossier, so pin its contract: TTL works, malformed payloads
 * don't crash, storage failures degrade gracefully.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  stashPendingDossier, readPendingDossier, clearPendingDossier,
} from '../../src/lib/pendingDossier.js';

beforeEach(() => {
  window.localStorage.clear();
});

afterEach(() => {
  vi.useRealTimers();
});

const SAMPLE = { name: 'Greycairn', tier: 'town', population: 1300 };

describe('stashPendingDossier()', () => {
  it('persists a settlement and returns true', () => {
    expect(stashPendingDossier(SAMPLE)).toBe(true);
    const raw = JSON.parse(window.localStorage.getItem('sf.pendingDossier'));
    expect(raw.settlement.name).toBe('Greycairn');
    expect(typeof raw.stashedAt).toBe('number');
  });

  it('returns false for missing input (won\'t wipe an existing stash)', () => {
    stashPendingDossier(SAMPLE);
    expect(stashPendingDossier(null)).toBe(false);
    expect(readPendingDossier()?.settlement.name).toBe('Greycairn');
  });

  it('returns false when storage throws (private mode)', () => {
    // JSDOM's Storage methods sit on the prototype as non-writable, so
    // direct assignment is silently ignored. Spy on the prototype so
    // the override takes effect.
    const spy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Quota');
    });
    expect(stashPendingDossier(SAMPLE)).toBe(false);
    spy.mockRestore();
  });
});

describe('readPendingDossier()', () => {
  it('returns null when nothing stored', () => {
    expect(readPendingDossier()).toBeNull();
  });

  it('round-trips a stash', () => {
    stashPendingDossier(SAMPLE, 'cs_test_123');
    const got = readPendingDossier();
    expect(got.settlement.name).toBe('Greycairn');
    expect(got.sessionId).toBe('cs_test_123');
  });

  it('clears stale entries (>1 hour)', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE);

    vi.setSystemTime(new Date('2026-05-17T13:01:00'));
    expect(readPendingDossier()).toBeNull();
    expect(window.localStorage.getItem('sf.pendingDossier')).toBeNull();
  });

  it('keeps entries that are within TTL', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-17T12:00:00'));
    stashPendingDossier(SAMPLE);

    vi.setSystemTime(new Date('2026-05-17T12:55:00'));
    expect(readPendingDossier()?.settlement.name).toBe('Greycairn');
  });

  it('clears + returns null on malformed JSON', () => {
    window.localStorage.setItem('sf.pendingDossier', '{not json');
    expect(readPendingDossier()).toBeNull();
    expect(window.localStorage.getItem('sf.pendingDossier')).toBeNull();
  });

  it('clears + returns null on missing settlement field', () => {
    window.localStorage.setItem('sf.pendingDossier', JSON.stringify({ stashedAt: Date.now() }));
    expect(readPendingDossier()).toBeNull();
  });
});

describe('clearPendingDossier()', () => {
  it('removes the stash', () => {
    stashPendingDossier(SAMPLE);
    clearPendingDossier();
    expect(window.localStorage.getItem('sf.pendingDossier')).toBeNull();
  });

  it('is a no-op when nothing is stashed', () => {
    expect(() => clearPendingDossier()).not.toThrow();
  });
});
