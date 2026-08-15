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
  // isConfigured:false routes authSecurity's reauthenticateWithPassword to its
  // no-op MOCK (the two-key modal reauth resolves without a real backend).
  isConfigured: false,
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

/** Drive the TWO-KEY modal: (optional value), retype the account id, password,
 *  then Confirm. Returns after the confirm click. */
async function submitTwoKey(accountId, { value } = {}) {
  const dialog = await screen.findByRole('dialog');
  if (value !== undefined) {
    fireEvent.change(within(dialog).getByLabelText(/credits delta/i), { target: { value } });
  }
  fireEvent.change(within(dialog).getByLabelText(/retype the account id/i), { target: { value: accountId } });
  fireEvent.change(within(dialog).getByLabelText(/your account password/i), { target: { value: 'hunter2' } });
  fireEvent.click(within(dialog).getByRole('button', { name: /^confirm$/i }));
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

  test('Ban opens the TWO-KEY modal and invokes set_account_banned with the typed id confirm', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    // Clicking Ban opens the two-key confirm — it does NOT fire the action yet.
    fireEvent.click(screen.getByRole('button', { name: /^ban$/i }));
    expect(invoke.mock.calls.find(([, o]) => o?.body?.action === 'set_account_banned')).toBeUndefined();

    await submitTwoKey('user-123');
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, opts]) => opts?.body?.action === 'set_account_banned');
      expect(call).toBeTruthy();
      expect(call[1].body.enabled).toBe(false);          // currently unbanned ⇒ ban
      expect(call[1].body.metadata).toBeUndefined();
      expect(call[1].body.confirm).toEqual({ typedTargetId: 'user-123' });
    });
  });

  test('the two-key modal Confirm stays DISABLED until the id matches and password is present', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /^ban$/i }));
    const dialog = await screen.findByRole('dialog');
    const confirm = within(dialog).getByRole('button', { name: /^confirm$/i });
    expect(confirm.disabled).toBe(true);                 // no id typed yet
    fireEvent.change(within(dialog).getByLabelText(/retype the account id/i), { target: { value: 'the-wrong-id' } });
    expect(confirm.disabled).toBe(true);                 // wrong id
    fireEvent.change(within(dialog).getByLabelText(/retype the account id/i), { target: { value: 'user-123' } });
    expect(confirm.disabled).toBe(true);                 // id alone is only one key
    fireEvent.change(within(dialog).getByLabelText(/your account password/i), { target: { value: 'hunter2' } });
    expect(confirm.disabled).toBe(false);                // both deliberate-confirmation fields present
  });

  test('Grant / refund opens the two-key modal and sends the delta + typed id confirm', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /grant \/ refund/i }));
    await submitTwoKey('user-123', { value: '-10' });
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'grant_credits');
      expect(call).toBeTruthy();
      expect(call[1].body.credits).toBe(-10);
      expect(call[1].body.confirm).toEqual({ typedTargetId: 'user-123' });
    });
  });

  test('Issue warning invokes the atomic message action without a client suppression control', async () => {
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
      expect(call[1].body.metadata).toBeUndefined();
    });
  });

  test('Send notice uses the template-first Operator Message composer and renders hostile markup as text', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /^send notice$/i }));
    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/notice template/i), {
      target: { value: 'display_name_reset' },
    });
    fireEvent.change(within(dialog).getByLabelText(/notice message/i), {
      target: { value: '<img alt="tracking pixel" src=x> Plain notice' },
    });
    expect(within(dialog).queryByAltText('tracking pixel')).toBeNull();
    expect(within(dialog).getByLabelText(/account message preview/i).textContent)
      .toContain('<img alt="tracking pixel" src=x> Plain notice');

    fireEvent.click(within(dialog).getByRole('button', { name: /^send notice$/i }));
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, opts]) => opts?.body?.action === 'send_operator_message');
      expect(call).toBeTruthy();
      expect(call[1].body).toEqual({
        action: 'send_operator_message',
        userId: 'user-123',
        messageClass: 'service',
        subject: 'Your display name was reset',
        messageBody: '<img alt="tracking pixel" src=x> Plain notice',
        messageTemplate: 'display_name_reset',
      });
    });
    expect(invoke.mock.calls.some(([, opts]) => opts?.body?.action === 'send_user_email')).toBe(false);
  });

  test('Send notice binds custom announcement class to its template with no independent class control', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /^send notice$/i }));
    const dialog = await screen.findByRole('dialog');
    expect(within(dialog).queryByRole('combobox', { name: /delivery class/i })).toBeNull();
    const templates = within(dialog).getByLabelText(/notice template/i);
    expect(within(templates).getByRole('option', { name: /custom service notice/i })).toBeTruthy();
    expect(within(templates).getByRole('option', { name: /custom announcement/i })).toBeTruthy();
    expect(within(templates).queryByRole('option', { name: /^custom notice$/i })).toBeNull();
    fireEvent.change(templates, { target: { value: 'custom_announcement' } });
    fireEvent.change(within(dialog).getByLabelText(/notice message/i), {
      target: { value: 'Optional product news.' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /^send notice$/i }));

    await waitFor(() => {
      const call = invoke.mock.calls.find(([, opts]) =>
        opts?.body?.action === 'send_operator_message'
      );
      expect(call?.[1].body).toMatchObject({
        messageClass: 'announcement',
        messageTemplate: 'custom_announcement',
        subject: 'News from SettlementForge',
        messageBody: 'Optional product news.',
      });
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

  test('Ban settlement asks for the id then invokes set_content_banned (kind=settlement, ban=true)', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /^ban settlement$/i }));
    await fillDialog(/settlement id/i, 'settle-9', /^ban$/i);
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'set_content_banned');
      expect(call).toBeTruthy();
      expect(call[1].body.contentKind).toBe('settlement');
      expect(call[1].body.settlementId).toBe('settle-9');
      expect(call[1].body.banned).toBe(true);
    });
  });

  test('Soft-delete map asks for a map id then invokes soft_delete_map', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await openAlice();
    invoke.mockClear();

    fireEvent.click(screen.getByRole('button', { name: /soft-delete map/i }));
    await fillDialog(/map id/i, 'map-7', /soft-delete/i);
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'soft_delete_map');
      expect(call).toBeTruthy();
      expect(call[1].body.mapId).toBe('map-7');
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
    // The button now reads "Enable" and (through the two-key modal) passes
    // enabled:true to re-enable.
    fireEvent.click(screen.getByRole('button', { name: /^enable$/i }));
    await submitTwoKey('user-123');
    await waitFor(() => {
      const call = invoke.mock.calls.find(([, o]) => o?.body?.action === 'set_account_disabled');
      expect(call[1].body.enabled).toBe(true);
      expect(call[1].body.confirm).toEqual({ typedTargetId: 'user-123' });
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
