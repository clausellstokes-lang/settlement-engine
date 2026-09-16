import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: { rpc: (...args) => rpc(...args) },
}));

import {
  getMyOperatorUnreadCount,
  listMyOperatorMessages,
  markOperatorMessageRead,
  normalizeOperatorMessage,
} from '../../src/lib/operatorMessages.js';

const row = (overrides = {}) => ({
  id: 'message-1',
  kind: 'direct',
  class: 'service',
  sender_role: 'admin',
  subject: 'A service notice',
  body: 'Please review this notice.',
  created_at: '2026-08-01T12:00:00.000Z',
  delivered_at: '2026-08-01T12:01:00.000Z',
  read_at: null,
  dismissed_at: null,
  ...overrides,
});

beforeEach(() => rpc.mockReset());

describe('operatorMessages client', () => {
  it('normalizes closed fields, drops invalid rows, and sorts newest first', async () => {
    rpc.mockResolvedValue({
      data: [
        row(),
        row({ id: 'message-2', kind: 'broadcast', class: 'announcement', sender_role: 'system', created_at: '2026-08-02T12:00:00.000Z' }),
        row({ id: 'bad-class', class: 'marketing' }),
      ],
      error: null,
    });

    await expect(listMyOperatorMessages()).resolves.toMatchObject([
      { id: 'message-2', kind: 'broadcast', messageClass: 'announcement', senderRole: 'system' },
      { id: 'message-1', kind: 'direct', messageClass: 'service', senderRole: 'admin' },
    ]);
    expect(rpc).toHaveBeenCalledWith('list_my_operator_messages', {
      p_limit: 100,
      p_before_created_at: null,
      p_before_id: null,
    });
  });

  it('passes one complete composite cursor and rejects half a cursor', async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    await listMyOperatorMessages({
      limit: 25,
      beforeCreatedAt: '2026-08-01T12:00:00.000Z',
      beforeId: 'message-1',
    });
    expect(rpc).toHaveBeenCalledWith('list_my_operator_messages', {
      p_limit: 25,
      p_before_created_at: '2026-08-01T12:00:00.000Z',
      p_before_id: 'message-1',
    });
    await expect(listMyOperatorMessages({ beforeCreatedAt: '2026-08-01T12:00:00.000Z' }))
      .rejects.toThrow(/complete pagination cursor/i);
  });

  it('fails closed when a required vocabulary or identity field is invalid', () => {
    expect(normalizeOperatorMessage(row({ id: '' }))).toBeNull();
    expect(normalizeOperatorMessage(row({ kind: 'thread' }))).toBeNull();
    expect(normalizeOperatorMessage(row({ sender_role: 'person' }))).toBeNull();
    expect(normalizeOperatorMessage(row({ body: '   ' }))).toBeNull();
  });

  it('marks one caller-visible message through the read RPC', async () => {
    rpc.mockResolvedValue({ data: { read_at: '2026-08-02T13:00:00.000Z' }, error: null });
    await expect(markOperatorMessageRead('message-1')).resolves.toBe('2026-08-02T13:00:00.000Z');
    expect(rpc).toHaveBeenCalledWith('mark_operator_message_read', { p_message_id: 'message-1' });
  });

  it('reads the authoritative unread count independently of the message page', async () => {
    rpc.mockResolvedValue({ data: 137, error: null });
    await expect(getMyOperatorUnreadCount()).resolves.toBe(137);
    expect(rpc).toHaveBeenCalledWith('get_my_operator_unread_count');
  });

  it('rejects malformed unread counts instead of under-reporting them', async () => {
    rpc.mockResolvedValue({ data: 'many', error: null });
    await expect(getMyOperatorUnreadCount()).rejects.toThrow(/invalid unread count/i);
  });
});
