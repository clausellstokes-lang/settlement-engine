/** @vitest-environment jsdom */
/**
 * accountPurchaseHistory.test.jsx — the "Past purchases" ledger panel (M-2 / §3).
 * Drives the panel's self-fetch (lazy purchaseHistory import, mocked here),
 * asserting rows render, refund status shows plainly, receipts link out safely,
 * the empty state reads calm, the pager appends an earlier page, and a signed-out
 * visitor sees nothing.
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';

const mocks = vi.hoisted(() => ({ fetchPurchaseHistory: vi.fn() }));

vi.mock('../../src/lib/supabase.js', () => ({ isConfigured: true, supabase: {} }));
vi.mock('../../src/lib/purchaseHistory.js', () => ({
  fetchPurchaseHistory: (...a) => mocks.fetchPurchaseHistory(...a),
}));

import AccountPurchaseHistoryPanel from '../../src/components/account/AccountPurchaseHistoryPanel.jsx';

const row = (over = {}) => ({
  id: 'me_1', occurredAt: '2026-06-01T00:00:00.000Z', dateLabel: 'Jun 1, 2026',
  kind: 'credit_pack', label: 'AI credits', status: 'paid',
  amountCents: 500, amountLabel: '$5.00', currency: 'usd', receiptUrl: 'https://r/1', ...over,
});

beforeEach(() => { mocks.fetchPurchaseHistory.mockReset(); });
afterEach(() => cleanup());

describe('AccountPurchaseHistoryPanel', () => {
  test('renders seeded rows; refunded shown plainly; receipt links out with rel=noopener', async () => {
    mocks.fetchPurchaseHistory.mockResolvedValueOnce({
      rows: [
        row(),
        row({ id: 'me_2', label: 'Cartographer subscription', status: 'refunded', amountLabel: '$9.00', receiptUrl: null }),
      ],
      hasMore: false, nextBefore: null,
    });
    render(<AccountPurchaseHistoryPanel auth={{ user: { id: 'u1' } }} />);
    expect(await screen.findByText('AI credits')).toBeTruthy();
    expect(screen.getByText('Cartographer subscription')).toBeTruthy();
    expect(screen.getByText('refunded')).toBeTruthy();
    expect(screen.getByRole('table', { name: /past purchases/i })).toBeTruthy();
    const receipt = screen.getByRole('link', { name: /receipt/i });
    expect(receipt.getAttribute('href')).toBe('https://r/1');
    expect(receipt.getAttribute('rel')).toContain('noopener');
    expect(receipt.getAttribute('target')).toBe('_blank');
  });

  test('calm empty state when there are no purchases', async () => {
    mocks.fetchPurchaseHistory.mockResolvedValueOnce({ rows: [], hasMore: false, nextBefore: null });
    render(<AccountPurchaseHistoryPanel auth={{ user: { id: 'u1' } }} />);
    expect(await screen.findByText(/no purchases yet/i)).toBeTruthy();
  });

  test('the pager loads an earlier page keyed on the occurred_at cursor and appends it', async () => {
    mocks.fetchPurchaseHistory
      .mockResolvedValueOnce({ rows: [row({ id: 'p1', label: 'AI credits' })], hasMore: true, nextBefore: '2026-06-01T00:00:00.000Z' })
      .mockResolvedValueOnce({ rows: [row({ id: 'p2', label: 'Dossier export' })], hasMore: false, nextBefore: null });
    render(<AccountPurchaseHistoryPanel auth={{ user: { id: 'u1' } }} />);
    const btn = await screen.findByRole('button', { name: /show earlier/i });
    fireEvent.click(btn);
    expect(await screen.findByText('Dossier export')).toBeTruthy();
    expect(screen.getByText('AI credits')).toBeTruthy();
    await waitFor(() => expect(mocks.fetchPurchaseHistory).toHaveBeenLastCalledWith({ before: '2026-06-01T00:00:00.000Z' }));
  });

  test('renders nothing for a signed-out visitor (never fetches)', () => {
    const { container } = render(<AccountPurchaseHistoryPanel auth={{}} />);
    expect(container.firstChild).toBeNull();
    expect(mocks.fetchPurchaseHistory).not.toHaveBeenCalled();
  });
});
