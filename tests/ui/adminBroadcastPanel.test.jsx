/** @vitest-environment jsdom */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';

afterEach(cleanup);

const invoke = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  supabase: { functions: { invoke: (...args) => invoke(...args) } },
  isConfigured: false,
}));

async function importPanel() {
  return (await import('../../src/components/admin/AdminBroadcastPanel.jsx')).default;
}

describe('AdminBroadcastPanel', () => {
  beforeEach(() => {
    invoke.mockReset();
    invoke.mockImplementation(async (_fn, { body }) => {
      if (body.action === 'list_operator_broadcasts') {
        return { data: { success: true, broadcasts: [] }, error: null };
      }
      if (body.action === 'queue_operator_broadcast') {
        return { data: { success: true, messageId: 'message-1', audienceCount: 42 }, error: null };
      }
      return { data: { success: true }, error: null };
    });
  });

  test('queues only after exact SEND TO ALL plus password and sends the fixed all audience', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await waitFor(() => expect(invoke).toHaveBeenCalledWith('admin-actions', {
      body: { action: 'list_operator_broadcasts' },
    }));

    fireEvent.change(screen.getByLabelText(/^broadcast message$/i), {
      target: { value: '<img alt="pixel" src=x> Product letter' },
    });
    expect(screen.queryByAltText('pixel')).toBeNull();
    expect(screen.getByLabelText(/broadcast account preview/i).textContent)
      .toContain('<img alt="pixel" src=x> Product letter');
    fireEvent.click(screen.getByRole('button', { name: /^queue broadcast$/i }));

    const dialog = await screen.findByRole('dialog');
    const confirm = within(dialog).getByRole('button', { name: /^queue broadcast$/i });
    fireEvent.change(within(dialog).getByLabelText(/retype send to all/i), {
      target: { value: 'send to all' },
    });
    fireEvent.change(within(dialog).getByLabelText(/your account password/i), {
      target: { value: 'operator-password' },
    });
    expect(confirm.disabled).toBe(true);
    fireEvent.change(within(dialog).getByLabelText(/retype send to all/i), {
      target: { value: 'SEND TO ALL' },
    });
    expect(confirm.disabled).toBe(false);
    fireEvent.click(confirm);

    await waitFor(() => {
      const call = invoke.mock.calls.find(([, options]) =>
        options?.body?.action === 'queue_operator_broadcast'
      );
      expect(call).toBeTruthy();
      expect(call[1].body).toEqual({
        action: 'queue_operator_broadcast',
        audience: 'all',
        messageClass: 'announcement',
        subject: 'News from SettlementForge',
        messageBody: '<img alt="pixel" src=x> Product letter',
        messageTemplate: 'product_update',
        confirm: { typedBroadcastPhrase: 'SEND TO ALL' },
      });
    });
    expect((await screen.findByRole('status')).textContent).toContain('42 accounts');
  });

  test('custom service broadcast has no independent class control and cannot produce a mismatched payload', async () => {
    const Panel = await importPanel();
    render(<Panel />);
    await waitFor(() => expect(invoke).toHaveBeenCalledWith('admin-actions', {
      body: { action: 'list_operator_broadcasts' },
    }));

    expect(screen.queryByRole('combobox', { name: /broadcast delivery class/i })).toBeNull();
    const templates = screen.getByLabelText(/broadcast template/i);
    expect(within(templates).getByRole('option', { name: /custom service notice/i })).toBeTruthy();
    expect(within(templates).getByRole('option', { name: /custom announcement/i })).toBeTruthy();
    fireEvent.change(templates, { target: { value: 'custom_service' } });
    fireEvent.change(screen.getByLabelText(/^broadcast message$/i), {
      target: { value: 'Planned maintenance begins shortly.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /^queue broadcast$/i }));

    const dialog = await screen.findByRole('dialog');
    fireEvent.change(within(dialog).getByLabelText(/retype send to all/i), {
      target: { value: 'SEND TO ALL' },
    });
    fireEvent.change(within(dialog).getByLabelText(/your account password/i), {
      target: { value: 'operator-password' },
    });
    fireEvent.click(within(dialog).getByRole('button', { name: /^queue broadcast$/i }));

    await waitFor(() => {
      const call = invoke.mock.calls.find(([, options]) =>
        options?.body?.action === 'queue_operator_broadcast'
      );
      expect(call?.[1].body).toMatchObject({
        messageClass: 'service',
        messageTemplate: 'custom_service',
        subject: 'A service notice from SettlementForge',
        messageBody: 'Planned maintenance begins shortly.',
      });
    });
  });

  test('shows and dispatches cancellation only inside the server-provided window', async () => {
    const future = new Date(Date.now() + 4 * 60_000).toISOString();
    invoke.mockImplementation(async (_fn, { body }) => {
      if (body.action === 'list_operator_broadcasts') {
        return {
          data: {
            success: true,
            broadcasts: [{ id: 'message-2', subject: 'Queued letter', send_after: future }],
          },
          error: null,
        };
      }
      return { data: { success: true }, error: null };
    });
    const Panel = await importPanel();
    render(<Panel />);
    fireEvent.click(await screen.findByRole('button', { name: /^cancel$/i }));
    await waitFor(() => {
      expect(invoke).toHaveBeenCalledWith('admin-actions', {
        body: { action: 'cancel_operator_broadcast', messageId: 'message-2' },
      });
    });
  });
});
