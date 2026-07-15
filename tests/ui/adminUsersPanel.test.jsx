/**
 * @vitest-environment jsdom
 *
 * tests/ui/adminUsersPanel.test.jsx — Phase A4 user-management UI contract.
 *
 * Proves (the A4 UI TEST GATE):
 *   • The panel renders the REDACTED summary from admin_user_summary (masked
 *     email + counts + status), never a raw email.
 *   • "Reveal full details" PROMPTS for a reason and calls the full RPC
 *     (get_user_full) with that reason; the unmasked email then renders.
 *   • Each action button invokes the RIGHT edge action with the right shape
 *     (issue_warning, set_account_banned, diagnostic_bundle full, etc.).
 *   • The panel is HIDDEN for a non-elevated user (AdminPanel gate).
 *
 * supabase.functions.invoke is mocked; we assert on the action names/payloads.
 */

import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, cleanup, waitFor, within } from '@testing-library/react';

afterEach(cleanup);

const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke: (...a) => invoke(...a) } },
}));

const REDACTED_SUMMARY = {
  id: 'user-123',
  role: 'user', tier: 'free', is_founder: false,
  display_name: 'Alice', email_masked: 'a***@example.com',
  credits: 12, account_age_days: 30,
  settlements: 4, gallery_items: 1, campaigns: 2, tickets: 0, warnings: 1,
  disabled: false, banned: false, redacted: true,
};

/** Route an admin-actions call by its `action` to a canned response. */
function routeInvoke({ summary = REDACTED_SUMMARY } = {}) {
  return vi.fn(async (_fn, { body }) => {
    switch (body.action) {
      case 'list_users':
        return { data: { users: [{ id: 'user-123', display_name: 'Alice', email_masked: 'a***@example.com', role: 'user' }] }, error: null };
      case 'get_user_summary':
        return { data: { summary }, error: null };
      case 'get_user_full':
        return { data: { user: { email: 'alice@example.com' } }, error: null };
      default:
        return { data: { success: true }, error: null };
    }
  });
}

async function importPanel() {
  return (await import('../../src/components/admin/AdminUsersPanel.jsx')).default;
}

/** Search + open the single user so the redacted summary is on screen. */
async function openAlice() {
  fireEvent.click(screen.getByRole('button', { name: /search/i }));
  const row = await screen.findByText('a***@example.com');
  fireEvent.click(row);
  await screen.findByText(/account age/i);
}

/** Fill the in-app TextInputDialog (by its label) and submit it. The submit
 *  button is scoped to the dialog so it can't collide with the action button
 *  (e.g. "Issue" vs "Issue warning") that remains in the DOM behind the modal. */
async function fillDialog(labelRe, value, submitRe) {
  const dialog = await screen.findByRole('dialog');
  const input = within(dialog).getByLabelText(labelRe);
  fireEvent.change(input, { target: { value } });
  fireEvent.click(within(dialog).getByRole('button', { name: submitRe }));
}

describe('AdminUsersPanel — A4 user-management UI', () => {
  beforeEach(() => {
    invoke.mockReset();
    invoke.mockImplementation(routeInvoke());
  });

  test('renders the REDACTED summary (masked email + counts), never a raw email', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();

    // Masked email is shown; the raw email is NOT in the DOM.
    expect(screen.getAllByText('a***@example.com').length).toBeGreaterThan(0);
    expect(screen.queryByText('alice@example.com')).toBeNull();
    // A redacted counter renders.
    expect(screen.getByText(/settlements/i)).toBeTruthy();
  });

  test('reveal-full PROMPTS for a reason and calls get_user_full with it', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();

    fireEvent.click(screen.getByRole('button', { name: /reveal full details/i }));
    await fillDialog(/reason/i, 'GDPR request #9', /confirm/i);

    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', {
        body: { action: 'get_user_full', userId: 'user-123', reason: 'GDPR request #9' },
      });
    });
    // The unmasked email now renders (the text node is interleaved with the
    // role/tier separators, so assert on the body's textContent).
    await waitFor(() => expect(document.body.textContent).toContain('alice@example.com'));
  });

  test('reveal-full does NOTHING when the reason prompt is cancelled', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /reveal full details/i }));
    // Cancel the in-app dialog instead of submitting a reason.
    fireEvent.click(screen.getByRole('button', { name: /^cancel$/i }));
    // No get_user_full call without a reason.
    expect(invoke).not.toHaveBeenCalledWith('admin-actions', expect.objectContaining({
      body: expect.objectContaining({ action: 'get_user_full' }),
    }));
  });

  test('Ban invokes set_account_banned with enabled=false (soft-ban) + notify', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /^ban$/i }));
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, opts]) => opts?.body?.action === 'set_account_banned');
      expect(call).toBeTruthy();
      expect(call[1].body.enabled).toBe(false);          // currently unbanned ⇒ ban
      expect(call[1].body.metadata).toEqual({ notify: true });
    });
  });

  test('Issue warning prompts then invokes issue_warning with the reason + notify', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /issue warning/i }));
    await fillDialog(/warning reason/i, 'be civil', /issue/i);
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'issue_warning');
      expect(call).toBeTruthy();
      expect(call[1].body.reason).toBe('be civil');
      expect(call[1].body.metadata).toEqual({ notify: true });
    });
  });

  test('Full debug copy requires a justification and sends full:true + reason', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /full debug copy/i }));
    await fillDialog(/justification/i, 'incident #7', /create/i);
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'diagnostic_bundle' && o?.body?.full);
      expect(call).toBeTruthy();
      expect(call[1].body.reason).toBe('incident #7');
    });
  });

  test('Export bundle (default) invokes diagnostic_bundle WITHOUT full', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /export bundle/i }));
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'diagnostic_bundle');
      expect(call).toBeTruthy();
      expect(call[1].body.full).toBeUndefined();
    });
  });

  test('Disable shows BANNED/DISABLED status + flips action when already disabled', async () => {
    invoke.mockImplementation(routeInvoke({ summary: { ...REDACTED_SUMMARY, disabled: true } }));
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    // Status badge renders.
    expect(screen.getByText(/Disabled/)).toBeTruthy();
    invoke.mockClear();
    // The button now reads "Enable" and passes enabled:true to re-enable.
    fireEvent.click(screen.getByRole('button', { name: /^enable$/i }));
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'set_account_disabled');
      expect(call[1].body.enabled).toBe(true);
    });
  });
});

// ── The panel is hidden for a non-elevated user (AdminPanel gate) ───────────
describe('AdminPanel — hides user management for non-elevated users', () => {
  beforeEach(() => {
    invoke.mockReset();
    invoke.mockImplementation(routeInvoke());
  });

  test('a non-elevated user sees "Access denied", not the user panel', async () => {
    vi.resetModules();
    vi.doMock('../../src/store/index.js', () => {
      const state = { auth: { user: { id: 'u1' } }, isElevated: () => false };
      function useStore(sel) { return sel(state); }
      useStore.getState = () => state;
      useStore.subscribe = () => () => {};
      return { useStore };
    });
    const AdminPanel = (await import('../../src/components/AdminPanel.jsx')).default;
    render(<AdminPanel onBack={() => {}} />);
    expect(screen.getByText(/access denied/i)).toBeTruthy();
    expect(screen.queryByText(/user search & actions/i)).toBeNull();
    vi.doUnmock('../../src/store/index.js');
  });
});
