import { afterEach, describe, expect, it, vi } from 'vitest';
import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

async function load({ configured = false, rpc } = {}) {
  vi.resetModules();
  vi.doMock('../../src/lib/supabase.js', () => ({
    isConfigured: configured,
    supabase: configured ? { rpc } : null,
  }));
  return import('../../src/lib/operatorMessageExport.js');
}

describe('operator message service-record export', () => {
  it('returns the honest empty export in an unconfigured local build', async () => {
    const { getMyOperatorServiceExport } = await load();
    await expect(getMyOperatorServiceExport()).resolves.toEqual({
      schemaVersion: 1,
      importable: false,
      operatorMessages: [],
      consentChanges: [],
    });
  });

  it('keeps only the caller-safe closed projection', async () => {
    const rpc = vi.fn().mockResolvedValue({
      error: null,
      data: {
        operator_messages: [{
          id: 'm1', kind: 'direct', message_class: 'service', sender_role: 'admin',
          sender_user_id: 'private-staff-id', subject: 'Account notice', body: '<b>plain text</b>',
          created_at: '2026-08-02T00:00:00Z', delivered_at: '2026-08-02T00:00:01Z',
          read_at: null, email_status: 'sending',
          email_failure_code: 'internal',
        }],
        consent_changes: [{
          consent_key: 'market', prior_value: false, new_value: true,
          consent_model_version: 2, source: 'account', created_at: '2026-08-02T00:00:01Z',
          user_id: 'private-user-id',
        }],
      },
    });
    const { getMyOperatorServiceExport } = await load({ configured: true, rpc });
    const out = await getMyOperatorServiceExport();
    expect(rpc).toHaveBeenCalledWith('get_my_operator_service_export');
    expect(out.operatorMessages[0]).toMatchObject({
      id: 'm1', kind: 'direct', class: 'service', subject: 'Account notice',
      body: '<b>plain text</b>', deliveredAt: '2026-08-02T00:00:01Z', emailStatus: 'sending',
    });
    expect(out.consentChanges[0]).toMatchObject({
      consentKey: 'market', priorValue: false, newValue: true,
    });
    const serialized = JSON.stringify(out);
    for (const privateValue of ['private-staff-id', 'private-user-id', 'email_failure_code']) {
      expectAbsentWithAnchor(
        serialized,
        privateValue,
        'Account notice',
        `service-record export excludes ${privateValue}`,
      );
    }
  });

  it('drops rows with unregistered message or consent vocabulary', async () => {
    const rpc = vi.fn().mockResolvedValue({
      error: null,
      data: {
        operator_messages: [{
          id: 'm-bad', kind: 'thread', message_class: 'marketing', sender_role: 'person',
          subject: 'Do not fabricate defaults', body: 'Invalid vocabulary.',
        }],
        consent_changes: [{
          consent_key: 'everything', prior_value: false, new_value: true,
          source: 'mystery', created_at: '2026-08-02T00:00:01Z',
        }],
      },
    });
    const { getMyOperatorServiceExport } = await load({ configured: true, rpc });
    await expect(getMyOperatorServiceExport()).resolves.toMatchObject({
      operatorMessages: [], consentChanges: [],
    });
  });

  it('fails closed when a configured export RPC is unavailable', async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: 'down' } });
    const { getMyOperatorServiceExport } = await load({ configured: true, rpc });
    await expect(getMyOperatorServiceExport()).rejects.toThrow(/could not be loaded/i);
  });
});
