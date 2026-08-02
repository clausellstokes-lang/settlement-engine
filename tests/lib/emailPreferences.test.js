import { beforeEach, describe, expect, it, vi } from 'vitest';

const rpc = vi.fn();
const getUser = vi.fn();
vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: { getUser: (...args) => getUser(...args) },
    rpc: (...args) => rpc(...args),
  },
}));

import { getMyEmailPreferences, setMyEmailPreference } from '../../src/lib/emailPreferences.js';

beforeEach(() => {
  rpc.mockReset();
  getUser.mockReset().mockResolvedValue({ data: { user: { id: 'user-1' } }, error: null });
});

describe('email preference client', () => {
  it('accepts only a complete boolean preference row', async () => {
    rpc.mockResolvedValue({
      data: [{ product_updates: false, referral: true, lifecycle: false }],
      error: null,
    });
    await expect(getMyEmailPreferences()).resolves.toEqual({
      product_updates: false,
      referral: true,
      lifecycle: false,
    });
  });

  it('never turns a malformed Product Updates value into consent', async () => {
    rpc.mockResolvedValue({
      data: [{ product_updates: null, referral: true, lifecycle: true }],
      error: null,
    });
    await expect(getMyEmailPreferences()).rejects.toThrow(/invalid response/i);
  });

  it('surfaces read errors and validates writes before the RPC', async () => {
    rpc.mockResolvedValueOnce({ data: null, error: new Error('offline') });
    await expect(getMyEmailPreferences()).rejects.toThrow('offline');

    await expect(setMyEmailPreference('unknown', true)).rejects.toThrow(/valid email preference/i);
    expect(rpc).toHaveBeenCalledTimes(1);
  });

  it('writes one explicit category value', async () => {
    rpc.mockResolvedValue({ data: null, error: null });
    await setMyEmailPreference('product_updates', false);
    expect(rpc).toHaveBeenCalledWith('set_my_email_preference', {
      p_expected_user: 'user-1',
      p_category: 'product_updates',
      p_enabled: false,
    });
  });

  it('rejects a queued write after its captured owner changes', async () => {
    await expect(setMyEmailPreference('product_updates', false, 'user-2'))
      .rejects.toMatchObject({ code: 'auth_session_changed' });
    expect(rpc).not.toHaveBeenCalled();
  });
});
