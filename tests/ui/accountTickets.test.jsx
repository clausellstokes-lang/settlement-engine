/**
 * @vitest-environment jsdom
 *
 * tests/ui/accountTickets.test.jsx — Phase A5 user-facing Support contract.
 *
 * Proves (the A5 user UI TEST GATE):
 *   • The Support section shows the FAQ FIRST (self-resolve), then "My tickets".
 *   • It lists the caller's tickets (number + status) via list_my_tickets.
 *   • "New ticket" → create form → create_ticket is called with the form values.
 *   • Opening a ticket loads the thread (list_ticket_thread) and the thread
 *     contains ONLY user-visible events — an internal note never appears (the
 *     server never returns it; the client renders what it gets).
 *
 * supabase.functions.invoke('account-actions', …) is mocked; we assert on the
 * action names/payloads.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

afterEach(cleanup);

const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke: (...a) => invoke(...a) } },
}));

const MY_TICKETS = [
  { id: 't-1', ticket_number: 'SF-000001', subject: 'My town vanished', status: 'assigned', category: 'bug', priority: 'high', linked_faq: null },
];
// The thread payload the SERVER returns to an owner: user-visible events only.
// (An internal note is never in this list — the RPC strips it server-side.)
const OWNER_THREAD = [
  { id: 'e-1', author_role: 'user', kind: 'user_reply', visibility: 'user', body: 'please help' },
  { id: 'e-2', author_role: 'support', kind: 'user_reply', visibility: 'user', body: 'looking into it' },
];

function routeInvoke() {
  return vi.fn(async (_fn, { body }) => {
    switch (body.action) {
      case 'list_my_tickets':
        return { data: { tickets: MY_TICKETS }, error: null };
      case 'list_ticket_thread':
        return { data: { events: OWNER_THREAD }, error: null };
      case 'create_ticket':
        return { data: { ticket: { id: 't-2', ticket_number: 'SF-000002', status: 'new' } }, error: null };
      case 'reply_ticket':
        return { data: { event: { id: 'e-3' } }, error: null };
      default:
        return { data: { success: true }, error: null };
    }
  });
}

async function importSection() {
  return (await import('../../src/components/account/AccountSupportSection.jsx')).default;
}

beforeEach(() => {
  invoke.mockReset();
  invoke.mockImplementation(routeInvoke());
});

describe('A5 — Account Support section (FAQ-first + tickets)', () => {
  test('renders the FAQ FIRST, above the ticket workflow', async () => {
    const Section = await importSection();
    render(<Section auth={{ user: { email: 'alice@example.com' } }} />);
    // The FAQ heading + at least one FAQ question are present.
    expect(screen.getByText(/frequently asked questions/i)).toBeTruthy();
    // "My tickets" comes after the FAQ in document order.
    const faqHeading = screen.getByText(/frequently asked questions/i);
    const myTickets = screen.getByText(/my tickets/i);
    // compareDocumentPosition: FOLLOWING (4) means myTickets is after faqHeading.
    expect(faqHeading.compareDocumentPosition(myTickets) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test('lists my tickets (number + status) via list_my_tickets', async () => {
    const Section = await importSection();
    render(<Section auth={{ user: { email: 'alice@example.com' } }} />);
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    expect(await screen.findByText('SF-000001')).toBeTruthy();
    expect(screen.getByText('My town vanished')).toBeTruthy();
    expect(invoke).toHaveBeenCalledWith('account-actions', { body: { action: 'list_my_tickets' } });
  });

  test('"New ticket" creates a ticket via create_ticket with the form values', async () => {
    const Section = await importSection();
    render(<Section auth={{ user: { email: 'alice@example.com' } }} />);
    fireEvent.click(screen.getByRole('button', { name: /new ticket/i }));

    fireEvent.change(screen.getByLabelText(/subject/i), { target: { value: 'Refund please' } });
    fireEvent.change(screen.getByLabelText(/describe your issue/i), { target: { value: 'I was double charged' } });
    fireEvent.change(screen.getByLabelText(/^category$/i), { target: { value: 'billing' } });

    fireEvent.click(screen.getByRole('button', { name: /create ticket/i }));

    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('account-actions', expect.objectContaining({
        body: expect.objectContaining({
          action: 'create_ticket',
          subject: 'Refund please',
          message: 'I was double charged',
          category: 'billing',
        }),
      }));
    });
  });

  test('opening a ticket shows the thread with ONLY user-visible events (no internal note)', async () => {
    const Section = await importSection();
    render(<Section auth={{ user: { email: 'alice@example.com' } }} />);
    fireEvent.click(screen.getByRole('button', { name: /refresh/i }));
    const row = await screen.findByText('My town vanished');
    fireEvent.click(row);

    // Both user-visible events render.
    expect(await screen.findByText('please help')).toBeTruthy();
    expect(screen.getByText('looking into it')).toBeTruthy();
    // No internal note text is present (the server never returned one).
    expect(screen.queryByText(/internal/i)).toBeNull();
    expect(invoke).toHaveBeenCalledWith('account-actions', { body: { action: 'list_ticket_thread', ticketId: 't-1' } });
  });
});
