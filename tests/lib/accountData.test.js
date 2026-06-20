/**
 * tests/lib/accountData.test.js — Phase A2 Data & Privacy service.
 *
 * Locks:
 *   • buildAccountExport assembles a portable snapshot of the user's OWN data
 *     (profile basics + settlements + campaigns), versioned, with no internal
 *     grants (role/credits) leaking in.
 *   • downloadAccountExport names the file and returns it.
 *   • requestAccountDeletion is a SOFT-DELETE *request* — it routes to the
 *     server (edge function preferred, table fallback) and NEVER hard-deletes
 *     client-side. In local/mock mode it resolves queued.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

afterEach(() => {
  vi.resetModules();
  vi.clearAllMocks();
});

async function load({ isConfigured = false, supabase = null } = {}) {
  vi.resetModules();
  vi.doMock('../../src/lib/supabase.js', () => ({ isConfigured, supabase }));
  return import('../../src/lib/accountData.js');
}

describe('buildAccountExport', () => {
  it('captures profile + settlements + campaigns, versioned, no internal grants', async () => {
    const { buildAccountExport, ACCOUNT_EXPORT_VERSION } = await load();
    const out = buildAccountExport({
      auth: { user: { id: 'u1', email: 'me@x.test' }, displayName: 'Me', tier: 'free', role: 'admin', credits: 999 },
      savedSettlements: [{ id: 's1' }, { id: 's2' }],
      campaigns: [{ id: 'c1' }],
    });

    expect(out.version).toBe(ACCOUNT_EXPORT_VERSION);
    expect(typeof out.exportedAt).toBe('string');
    expect(out.profile).toEqual({ email: 'me@x.test', displayName: 'Me', tier: 'free' });
    expect(out.settlements).toHaveLength(2);
    expect(out.campaigns).toHaveLength(1);
    // No privileged grants exported.
    expect(JSON.stringify(out)).not.toMatch(/credits|"role"/);
  });

  it('tolerates an empty/partial state', async () => {
    const { buildAccountExport } = await load();
    const out = buildAccountExport({});
    expect(out.profile.email).toBeNull();
    expect(out.settlements).toEqual([]);
    expect(out.campaigns).toEqual([]);
  });
});

describe('downloadAccountExport', () => {
  it('returns a dated, slugged filename', async () => {
    const { downloadAccountExport } = await load();
    const name = downloadAccountExport({ auth: { user: { email: 'A.B@Example.test' } } });
    expect(name).toMatch(/^settlementforge-a-b-example-test-\d{4}-\d{2}-\d{2}\.json$/);
  });
});

describe('requestAccountDeletion — soft-delete request, never hard delete', () => {
  it('resolves queued in local/mock mode without any client deletion', async () => {
    const { requestAccountDeletion } = await load({ isConfigured: false, supabase: null });
    const res = await requestAccountDeletion({ id: 'u1', email: 'me@x.test' });
    expect(res.status).toBe('queued');
    expect(typeof res.requestedAt).toBe('string');
  });

  it('prefers the account-actions edge function with request_deletion', async () => {
    const invoke = vi.fn().mockResolvedValue({ data: { ok: true }, error: null });
    const insert = vi.fn();
    const supabase = { functions: { invoke }, from: () => ({ insert }) };
    const { requestAccountDeletion } = await load({ isConfigured: true, supabase });

    const res = await requestAccountDeletion({ id: 'u1', email: 'me@x.test' });

    expect(invoke).toHaveBeenCalledWith('account-actions', { body: { action: 'request_deletion' } });
    expect(insert).not.toHaveBeenCalled(); // edge function succeeded; no table fallback
    expect(res.status).toBe('queued');
  });

  it('falls back to a deletion_requests row when the edge function is unavailable', async () => {
    const invoke = vi.fn().mockResolvedValue({ data: null, error: { message: 'not found' } });
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const supabase = { functions: { invoke }, from };
    const { requestAccountDeletion } = await load({ isConfigured: true, supabase });

    const res = await requestAccountDeletion({ id: 'u1', email: 'me@x.test' });

    expect(from).toHaveBeenCalledWith('deletion_requests');
    expect(insert).toHaveBeenCalledTimes(1);
    const row = insert.mock.calls[0][0];
    expect(row.user_id).toBe('u1');
    expect(row.email).toBe('me@x.test');
    expect(res.status).toBe('queued');
  });

  it('throws a safe message if the request cannot be filed', async () => {
    const invoke = vi.fn().mockResolvedValue({ data: null, error: { message: 'no fn' } });
    const insert = vi.fn().mockResolvedValue({ error: { message: 'rls denied' } });
    const supabase = { functions: { invoke }, from: () => ({ insert }) };
    const { requestAccountDeletion } = await load({ isConfigured: true, supabase });

    await expect(requestAccountDeletion({ id: 'u1' })).rejects.toThrow(/contact support/i);
  });
});
