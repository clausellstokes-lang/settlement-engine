/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountTicketsUnconfigured.test.jsx — the null-supabase (unconfigured
 * / mock env) guard for AccountTickets.
 *
 * loadTickets already short-circuits on !supabase, but the write paths
 * (create / open / reply) funnel through callAccount, which used to deref
 * supabase.functions unconditionally — so in mock mode "Create ticket" surfaced
 * a raw "Cannot read properties of null" in the error banner. callAccount now
 * throws a friendly message at the single choke point. This pins that.
 */
import { describe, test, expect, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';

afterEach(cleanup);

vi.mock('../../src/lib/supabase.js', () => ({ supabase: null }));

describe('AccountTickets — unconfigured (null supabase)', () => {
  test('"Create ticket" surfaces a friendly message, not a raw TypeError', async () => {
    const Tickets = (await import('../../src/components/account/AccountTickets.jsx')).default;
    render(<Tickets />);

    fireEvent.click(screen.getByRole('button', { name: /new ticket/i }));
    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Hi' } });
    fireEvent.change(screen.getByLabelText(/describe your issue/i), { target: { value: 'There' } });
    fireEvent.click(screen.getByRole('button', { name: /create ticket/i }));

    await screen.findByText(/unavailable in this environment/i);
    // The raw null-deref message must NOT reach the banner.
    expect(screen.queryByText(/Cannot read properties of null/i)).toBeNull();
  });
});
