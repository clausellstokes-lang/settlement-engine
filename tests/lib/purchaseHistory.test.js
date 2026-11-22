/**
 * purchaseHistory.test.js — the account "Past purchases" read (M-2, §3).
 * Tests the pure formatters/normalizer and the fail-closed fetch (owner-SELECT
 * money_events, cursor pager). The supabase client is mocked with a thenable
 * query builder whose resolved value the test controls.
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';

const h = vi.hoisted(() => ({ result: { data: [], error: null }, ltCalls: [] }));

vi.mock('../../src/lib/supabase.js', () => {
  const builder = {
    select: () => builder,
    order: () => builder,
    limit: () => builder,
    lt: (col, val) => { h.ltCalls.push({ col, val }); return builder; },
    then: (resolve) => resolve(h.result),
  };
  return { isConfigured: true, supabase: { from: () => builder } };
});

const {
  fetchPurchaseHistory, normalizePurchaseRow, kindLabel, formatMoney,
  formatPurchaseDate, PURCHASE_PAGE_SIZE,
} = await import('../../src/lib/purchaseHistory.js');

beforeEach(() => { h.result = { data: [], error: null }; h.ltCalls = []; });

const rawRow = (over = {}) => ({
  id: 'me_1', occurred_at: '2026-06-01T12:00:00.000Z', kind: 'credit_pack',
  amount_cents: 500, currency: 'usd', description: 'Credit pack', receipt_url: 'https://r/1',
  status: 'paid', ...over,
});

describe('pure helpers', () => {
  test('kindLabel maps known kinds and falls back for unknown', () => {
    expect(kindLabel('founder_seat')).toBe('Founder Lifetime seat');
    expect(kindLabel('auto_reload')).toBe('AI credit auto-reload');
    expect(kindLabel('nonsense')).toBe('Purchase');
  });

  test('formatMoney renders integer cents as currency and never throws', () => {
    expect(formatMoney(500, 'usd')).toBe('$5.00');
    expect(formatMoney(9900, 'usd')).toBe('$99.00');
    expect(formatMoney('not-a-number')).toBe('$0.00');
  });

  test('formatPurchaseDate handles ISO and bad input', () => {
    expect(formatPurchaseDate('2026-06-01T12:00:00Z')).toMatch(/2026/);
    expect(formatPurchaseDate('')).toBe('');
    expect(formatPurchaseDate('garbage')).toBe('');
  });

  test('normalizePurchaseRow maps fields, defaults status paid, drops unusable rows', () => {
    const n = normalizePurchaseRow(rawRow());
    expect(n.label).toBe('AI credits');
    expect(n.amountLabel).toBe('$5.00');
    expect(n.receiptUrl).toBe('https://r/1');
    expect(n.status).toBe('paid');
    expect(normalizePurchaseRow(rawRow({ status: undefined })).status).toBe('paid');
    expect(normalizePurchaseRow({ id: 'x' })).toBeNull();       // no occurred_at
    expect(normalizePurchaseRow(null)).toBeNull();
    // A missing receipt collapses to null (UI shows no link).
    expect(normalizePurchaseRow(rawRow({ receipt_url: null })).receiptUrl).toBeNull();
  });
});

describe('fetchPurchaseHistory', () => {
  test('returns a page of normalized rows, newest first, with hasMore + cursor', async () => {
    // Seed PAGE_SIZE+1 rows so the extra row trips hasMore.
    const data = [];
    for (let i = 0; i < PURCHASE_PAGE_SIZE + 1; i += 1) {
      const day = String(28 - (i % 28) + 1).padStart(2, '0');
      data.push(rawRow({ id: `me_${i}`, occurred_at: `2026-06-${day}T00:00:00.000Z` }));
    }
    h.result = { data, error: null };
    const res = await fetchPurchaseHistory({});
    expect(res.rows.length).toBe(PURCHASE_PAGE_SIZE);   // the +1 is trimmed
    expect(res.hasMore).toBe(true);
    expect(res.nextBefore).toBe(res.rows[res.rows.length - 1].occurredAt);
    expect(res.rows[0].label).toBe('AI credits');
  });

  test('surfaces refunded status plainly', async () => {
    h.result = { data: [rawRow({ status: 'refunded' })], error: null };
    const res = await fetchPurchaseHistory({});
    expect(res.rows[0].status).toBe('refunded');
    expect(res.hasMore).toBe(false);
  });

  test('passes the before cursor as an occurred_at lt() filter', async () => {
    h.result = { data: [rawRow()], error: null };
    await fetchPurchaseHistory({ before: '2026-05-01T00:00:00.000Z' });
    expect(h.ltCalls).toEqual([{ col: 'occurred_at', val: '2026-05-01T00:00:00.000Z' }]);
  });

  test('fails closed (empty) when the query errors — no throw', async () => {
    h.result = { data: null, error: { message: 'relation "money_events" does not exist' } };
    const res = await fetchPurchaseHistory({});
    expect(res).toEqual({ rows: [], hasMore: false, nextBefore: null });
  });
});
