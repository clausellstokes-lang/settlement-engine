/**
 * @vitest-environment jsdom
 *
 * tests/ui/supportQueueActiveReconcile.test.jsx — regression for the stale
 * active-ticket row in the support agent queue (SupportQueuePanel).
 *
 * The bug: runAction refreshed the thread + queue list but never updated the
 * captured `active` row. After a status transition the detail header and the
 * controlled <select value={active.status}> snapped back to the pre-mutation
 * value, inviting the agent to re-issue a transition that already landed.
 *
 * The fix reconciles `active` from the reloaded pool (server truth), folding in
 * the fields we just set so it stays correct even if the row dropped out of the
 * current status filter.
 *
 * supabase.functions.invoke('admin-actions', …) is mocked; the mocked pool
 * returns the POST-mutation row so we can assert the header/select follow it.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor } from '@testing-library/react';

afterEach(cleanup);

const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke: (...a) => invoke(...a) } },
}));

// Mutable ticket row the mocked backend serves — the pool reflects mutations,
// exactly like the real RPC would after set_ticket_status/link_ticket_faq.
let row;
function resetRow() {
  row = {
    id: 't-1',
    ticket_number: 'SF-000042',
    account_number: 'A-100',
    subject: 'Airship stranded mid-siege',
    email_masked: 'a•••@example.com',
    priority: 'high',
    status: 'new',
    linked_faq: null,
  };
}

function routeInvoke() {
  return vi.fn(async (_fn, { body }) => {
    switch (body.action) {
      case 'list_ticket_pool':
        // Honor the status filter the panel passes, like the real pool RPC.
        return {
          data: { tickets: (!body.status || body.status === row.status) ? [row] : [] },
          error: null,
        };
      case 'list_ticket_thread':
        return { data: { events: [] }, error: null };
      case 'set_ticket_status':
        row = { ...row, status: body.status };
        return { data: { success: true }, error: null };
      case 'link_ticket_faq':
        row = { ...row, linked_faq: body.faq };
        return { data: { success: true }, error: null };
      case 'claim_ticket':
        return { data: { success: true }, error: null };
      default:
        return { data: { success: true }, error: null };
    }
  });
}

async function importPanel() {
  return (await import('../../src/components/admin/SupportQueuePanel.jsx')).default;
}

beforeEach(() => {
  resetRow();
  invoke.mockReset();
  invoke.mockImplementation(routeInvoke());
});

async function loadAndOpen() {
  const Panel = await importPanel();
  render(<Panel />);
  fireEvent.click(screen.getByRole('button', { name: /load queue/i }));
  // The ticket appears in the queue; open it.
  const ticketRow = await screen.findByText('Airship stranded mid-siege');
  fireEvent.click(ticketRow);
  // Detail header rendered.
  await screen.findByRole('combobox', { name: /set status/i });
}

describe('SupportQueuePanel — active row reconciles after a mutation', () => {
  test('status select + header follow the server after set_ticket_status', async () => {
    await loadAndOpen();

    const select = screen.getByRole('combobox', { name: /set status/i });
    expect(select.value).toBe('new');

    // Transition to in_progress.
    fireEvent.change(select, { target: { value: 'in_progress' } });

    // The controlled select must NOT snap back to 'new' — it reflects the
    // reconciled active row (server truth). Pre-fix this stayed 'new'.
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /set status/i }).value).toBe('in_progress');
    });
  });

  test('reconciles from the reloaded pool even when the status filter drops the row', async () => {
    await loadAndOpen();

    // Constrain the queue to only show "New" tickets, then reload so the panel's
    // pool query carries status=new.
    fireEvent.change(screen.getByRole('combobox', { name: /^status$/i }), { target: { value: 'new' } });
    fireEvent.click(screen.getByRole('button', { name: /load queue/i }));
    await waitFor(() => {
      expect(screen.getAllByText('Airship stranded mid-siege').length).toBeGreaterThan(0);
    });

    const setStatus = screen.getByRole('combobox', { name: /set status/i });
    fireEvent.change(setStatus, { target: { value: 'resolved' } });

    // The row now falls outside the status=new filter (pool returns []), but the
    // detail select must still reflect the transition we just issued via the
    // local fallback fold — not revert to 'new'.
    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /set status/i }).value).toBe('resolved');
    });
  });

  test('link FAQ select follows the server after link_ticket_faq', async () => {
    await loadAndOpen();

    const faqSelect = screen.getByRole('combobox', { name: /link faq/i });
    expect(faqSelect.value).toBe('');

    fireEvent.change(faqSelect, { target: { value: 'refundWindow' } });

    await waitFor(() => {
      expect(screen.getByRole('combobox', { name: /link faq/i }).value).toBe('refundWindow');
    });
  });
});
