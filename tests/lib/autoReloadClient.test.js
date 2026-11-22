/**
 * autoReloadClient.test.js — the account auto-reload data layer (M-3e, §4.6).
 * Fail-closed reads + the settings write, over a mocked supabase.
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';

const h = vi.hoisted(() => ({
  settings: { data: null, error: null },
  attempts: { data: [], error: null },
  rpc: { error: null },
  rpcArgs: null,
}));

vi.mock('../../src/lib/supabase.js', () => {
  const settingsBuilder = { select: () => settingsBuilder, maybeSingle: () => Promise.resolve(h.settings) };
  const attemptsBuilder = { select: () => attemptsBuilder, order: () => attemptsBuilder, then: (res) => res(h.attempts) };
  return {
    isConfigured: true,
    supabase: {
      from: (t) => (t === 'credit_auto_reload_settings' ? settingsBuilder : attemptsBuilder),
      rpc: (fn, args) => { h.rpcArgs = { fn, args }; return Promise.resolve(h.rpc); },
    },
  };
});

const {
  fetchAutoReloadSettings, fetchAutoReloadStatus, saveAutoReloadSettings,
  currentMonthBucket, AUTO_RELOAD_DEFAULTS,
} = await import('../../src/lib/autoReloadClient.js');

beforeEach(() => {
  h.settings = { data: null, error: null };
  h.attempts = { data: [], error: null };
  h.rpc = { error: null };
  h.rpcArgs = null;
});

describe('fetchAutoReloadSettings', () => {
  test('maps an existing row', async () => {
    h.settings = { data: { enabled: true, threshold_credits: 8, target_credits: 40, monthly_cap_cents: 5000 }, error: null };
    const s = await fetchAutoReloadSettings();
    expect(s).toEqual({ enabled: true, thresholdCredits: 8, targetCredits: 40, monthlyCapCents: 5000, exists: true });
  });
  test('returns OFF defaults (exists:false) when absent', async () => {
    const s = await fetchAutoReloadSettings();
    expect(s).toEqual({ ...AUTO_RELOAD_DEFAULTS, exists: false });
  });
  test('fails closed to defaults on error', async () => {
    h.settings = { data: null, error: { message: 'relation does not exist' } };
    expect((await fetchAutoReloadSettings()).exists).toBe(false);
  });
});

describe('fetchAutoReloadStatus', () => {
  test('sums this-month succeeded/open spend and surfaces the open attempt', async () => {
    const bucket = currentMonthBucket();
    h.attempts = { data: [
      { state: 'pending', amount_cents: 459, credits_delta: 23, month_bucket: bucket },
      { state: 'succeeded', amount_cents: 500, credits_delta: 25, month_bucket: bucket },
      { state: 'failed', amount_cents: 300, credits_delta: 10, month_bucket: bucket },       // not counted
      { state: 'succeeded', amount_cents: 999, credits_delta: 50, month_bucket: '2000-01' }, // other month
    ], error: null };
    const st = await fetchAutoReloadStatus();
    expect(st.thisMonthSpentCents).toBe(959);              // 459 + 500
    expect(st.openAttempt).toEqual({ state: 'pending', creditsDelta: 23, amountCents: 459 });
  });
  test('fails closed to empty on error', async () => {
    h.attempts = { data: null, error: { message: 'nope' } };
    expect(await fetchAutoReloadStatus()).toEqual({ thisMonthSpentCents: 0, openAttempt: null });
  });
});

describe('saveAutoReloadSettings', () => {
  test('calls set_auto_reload_settings with mapped params', async () => {
    await saveAutoReloadSettings({ enabled: true, thresholdCredits: 5, targetCredits: 25, monthlyCapCents: 4000 });
    expect(h.rpcArgs).toEqual({ fn: 'set_auto_reload_settings', args: { p_enabled: true, p_threshold: 5, p_target: 25, p_cap: 4000 } });
  });
  test('throws the server message on error', async () => {
    h.rpc = { error: { message: 'target_credits must exceed threshold_credits' } };
    await expect(saveAutoReloadSettings({ enabled: true, thresholdCredits: 25, targetCredits: 25, monthlyCapCents: 4000 }))
      .rejects.toThrow(/exceed threshold/);
  });
});
