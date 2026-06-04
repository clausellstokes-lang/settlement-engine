/**
 * tests/lib/creditLedger.test.js - Pure-function tests for ledger formatters.
 *
 * Network-touching paths (fetchCreditBalanceFromLedger,
 * fetchRecentTransactions) are exercised through integration tests when
 * a Supabase instance is available. The unit tests here lock down the
 * pure formatters that the UI consumes.
 */

import { describe, it, expect } from 'vitest';
import { labelForSource, formatLedgerRow } from '../../src/lib/creditLedger.js';

describe('labelForSource()', () => {
  it('labels every documented grant source', () => {
    expect(labelForSource('purchase')).toBe('Credit purchase');
    expect(labelForSource('founder_grant')).toBe('Founder grant');
    expect(labelForSource('welcome')).toBe('Welcome bonus');
    expect(labelForSource('daily_refresh')).toBe('Daily refresh');
    expect(labelForSource('promo')).toBe('Promo code');
    expect(labelForSource('refund')).toBe('Refund');
    expect(labelForSource('admin_grant')).toBe('Granted by admin');
  });

  it('labels every documented spend source', () => {
    expect(labelForSource('narrative')).toBe('Narrative synthesis');
    expect(labelForSource('daily_life')).toBe('Daily life generation');
    expect(labelForSource('progression')).toBe('Progression evolution');
  });

  it('falls back to the raw source for unknown values', () => {
    expect(labelForSource('something_new')).toBe('something_new');
  });

  it('falls back to "Adjustment" for null / undefined', () => {
    expect(labelForSource(undefined)).toBe('Adjustment');
    expect(labelForSource(null)).toBe('Adjustment');
  });
});

describe('formatLedgerRow()', () => {
  it('formats a grant row with + sign', () => {
    const out = formatLedgerRow({
      id: 'r1',
      kind: 'grant',
      amount: 25,
      source: 'purchase',
      created_at: '2026-05-17T12:00:00Z',
      expires_at: null,
      metadata: { stripe_session_id: 'cs_test' },
    });
    expect(out.sign).toBe('+');
    expect(out.amount).toBe(25);
    expect(out.label).toBe('Credit purchase');
    expect(out.when).toBeInstanceOf(Date);
    expect(out.expiresAt).toBeNull();
    expect(out.metadata.stripe_session_id).toBe('cs_test');
  });

  it('formats a spend row with the en-dash minus', () => {
    const out = formatLedgerRow({
      id: 'r2',
      kind: 'spend',
      amount: 3,
      source: 'narrative',
      created_at: '2026-05-17T13:00:00Z',
      expires_at: null,
      metadata: {},
    });
    expect(out.sign).toBe('−');             // U+2212 minus, not ASCII '-'
    expect(out.amount).toBe(3);
    expect(out.label).toBe('Narrative synthesis');
  });

  it('parses expires_at into a Date when present', () => {
    const out = formatLedgerRow({
      id: 'r3',
      kind: 'grant',
      amount: 1,
      source: 'daily_refresh',
      created_at: '2026-05-17T00:00:00Z',
      expires_at: '2026-05-18T00:00:00Z',
      metadata: {},
    });
    expect(out.expiresAt).toBeInstanceOf(Date);
    expect(out.expiresAt.toISOString()).toBe('2026-05-18T00:00:00.000Z');
  });

  it('returns null for null/undefined input (safe in renderers)', () => {
    expect(formatLedgerRow(null)).toBeNull();
    expect(formatLedgerRow(undefined)).toBeNull();
  });

  it('defaults metadata to {} when missing', () => {
    const out = formatLedgerRow({
      id: 'r4', kind: 'grant', amount: 1, source: 'welcome',
      created_at: '2026-05-17T00:00:00Z',
    });
    expect(out.metadata).toEqual({});
  });
});
