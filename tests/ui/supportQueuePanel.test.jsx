/**
 * @vitest-environment jsdom
 *
 * tests/ui/supportQueuePanel.test.jsx — Phase A5 support-agent queue contract.
 *
 * Proves (the A5 agent UI TEST GATE):
 *   • Load the pool (list_ticket_pool, masked email) and open a ticket.
 *   • The agent thread shows ALL events including an internal note.
 *   • Claim → claim_ticket; status select → set_ticket_status; reply →
 *     post_ticket_reply (visibility user); internal note → post_ticket_reply
 *     (visibility internal); link FAQ → link_ticket_faq.
 *
 * supabase.functions.invoke('admin-actions', …) is mocked; we assert on the
 * action names/payloads.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';

afterEach(cleanup);

const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke: (...a) => invoke(...a) } },
}));

const POOL = [
  { id: 't-1', ticket_number: 'SF-000001', email_masked: 'a***@example.com', subject: 'My town vanished', status: 'new', category: 'bug', priority: 'high', assignee: null, linked_faq: null },
];
// Agent thread: BOTH a user-visible reply AND an internal note (agents see all).
const AGENT_THREAD = [
  { id: 'e-1', author_role: 'user', kind: 'user_reply', visibility: 'user', body: 'please help' },
  { id: 'e-2', author_role: 'support', kind: 'internal_note', visibility: 'internal', body: 'suspected duplicate of SF-42' },
];

function routeInvoke() {
  return vi.fn(async (_fn, { body }) => {
    switch (body.action) {
      case 'list_ticket_pool':
        return { data: { tickets: POOL }, error: null };
      case 'list_ticket_thread':
        return { data: { events: AGENT_THREAD }, error: null };
      default:
        return { data: { success: true }, error: null };
    }
  });
}

async function importPanel() {
  return (await import('../../src/components/admin/SupportQueuePanel.jsx')).default;
}

/** Load the queue and open the single ticket so the thread/actions render. */
async function openTicket() {
  fireEvent.click(screen.getByRole('button', { name: /load queue/i }));
  const row = await screen.findByText('My town vanished');
  fireEvent.click(row);
  await screen.findByText('please help');
}

/** Fill + submit the in-app TextInputDialog, scoped to the dialog. */
async function fillDialog(labelRe, value, submitRe) {
  const dialog = await screen.findByRole('dialog');
  const input = within(dialog).getByLabelText(labelRe);
  fireEvent.change(input, { target: { value } });
  fireEvent.click(within(dialog).getByRole('button', { name: submitRe }));
}

beforeEach(() => {
  invoke.mockReset();
  invoke.mockImplementation(routeInvoke());
});

describe('A5 — SupportQueuePanel (agent queue)', () => {
  test('loads the pool (masked email) and lists tickets', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    fireEvent.click(screen.getByRole('button', { name: /load queue/i }));
    expect(await screen.findByText('SF-000001')).toBeTruthy();
    expect(screen.getByText('a***@example.com')).toBeTruthy();
    expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'list_ticket_pool', status: undefined } });
  });

  test('the agent thread shows ALL events, including the internal note', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openTicket();
    expect(screen.getByText('please help')).toBeTruthy();
    // The internal note IS visible to the agent (unlike the owner).
    expect(screen.getByText('suspected duplicate of SF-42')).toBeTruthy();
    expect(screen.getByText(/owner can never read this/i)).toBeTruthy();
  });

  test('Claim calls claim_ticket', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openTicket();
    fireEvent.click(screen.getByRole('button', { name: /^claim$/i }));
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'claim_ticket', ticketId: 't-1' } });
    });
  });

  test('changing the status select calls set_ticket_status', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openTicket();
    fireEvent.change(screen.getByLabelText(/set status/i), { target: { value: 'resolved' } });
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', expect.objectContaining({
        body: expect.objectContaining({ action: 'set_ticket_status', ticketId: 't-1', status: 'resolved' }),
      }));
    });
  });

  test('Reply to user posts a user-visible reply', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openTicket();
    fireEvent.click(screen.getByRole('button', { name: /reply to user/i }));
    await fillDialog(/reply/i, 'We refunded you.', /send reply/i);
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'post_ticket_reply', ticketId: 't-1', body: 'We refunded you.', visibility: 'user' } });
    });
  });

  test('Internal note posts an internal-visibility event', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openTicket();
    fireEvent.click(screen.getByRole('button', { name: /internal note/i }));
    await fillDialog(/internal note/i, 'dup of SF-42', /add note/i);
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'post_ticket_reply', ticketId: 't-1', body: 'dup of SF-42', visibility: 'internal' } });
    });
  });

  test('Link FAQ calls link_ticket_faq with the chosen slug', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openTicket();
    fireEvent.change(screen.getByLabelText(/link faq/i), { target: { value: 'refundWindow' } });
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', { body: { action: 'link_ticket_faq', ticketId: 't-1', faq: 'refundWindow' } });
    });
  });
});
