/**
 * founderTransferClient.test.js — the account Seat-transfer data layer (M-6f, §6.4).
 * Fail-closed status read (never throws) + throwing coded action calls, over a mocked
 * supabase.functions.invoke.
 */
import { describe, expect, test, beforeEach, vi } from 'vitest';

const h = vi.hoisted(() => ({ result: { data: null, error: null }, calls: [] }));

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    functions: {
      invoke: (fn, opts) => { h.calls.push({ fn, body: opts?.body }); return Promise.resolve(h.result); },
    },
  },
}));

const {
  fetchTransferStatus, initiateTransfer, confirmInitiate, nomineeConfirm,
  abortTransfer, reelectPayout, payoutOnboarding,
  fetchBuybackStatus, buybackStart, buybackConfirm,
} = await import('../../src/lib/founderTransferClient.js');

/** An invoke error carrying a JSON body on .context (the supabase-js shape). */
function invokeError(body, status) {
  return { context: { status, json: () => Promise.resolve(body) } };
}

beforeEach(() => { h.result = { data: null, error: null }; h.calls = []; });

describe('fetchTransferStatus (fail-closed, never throws)', () => {
  test('maps the projection rows + available:true on success', async () => {
    h.result = { data: { cases: [{ case_id: 'c1', viewer_role: 'outgoing', state: 'cooling' }] }, error: null };
    const out = await fetchTransferStatus();
    expect(out.available).toBe(true);
    expect(out.cases).toHaveLength(1);
    expect(out.cases[0].case_id).toBe('c1');
    expect(h.calls[0].body).toEqual({ action: 'status' });
  });

  test('KEY-INERT / outage → dark {cases:[], available:false}, no throw', async () => {
    h.result = { data: null, error: invokeError({ error: 'feature_unavailable' }, 503) };
    const out = await fetchTransferStatus();
    expect(out).toEqual({ cases: [], available: false });
  });

  test('a malformed body still yields an empty case list', async () => {
    h.result = { data: { cases: 'not-an-array' }, error: null };
    expect((await fetchTransferStatus()).cases).toEqual([]);
  });
});

describe('the standing buyback (§6.8, independent switch)', () => {
  test('fetchBuybackStatus maps available + open buybacks on success', async () => {
    h.result = { data: { ok: true, available: true, buybacks: [{ id: 'bb1', state: 'pending_payout' }] }, error: null };
    const out = await fetchBuybackStatus();
    expect(out.available).toBe(true);
    expect(out.buybacks).toHaveLength(1);
    expect(h.calls[0].body).toEqual({ action: 'buyback_status' });
  });

  test('a dark buyback switch (503) → {available:false, buybacks:[]}, no throw', async () => {
    h.result = { data: null, error: invokeError({ error: 'feature_unavailable' }, 503) };
    expect(await fetchBuybackStatus()).toEqual({ available: false, buybacks: [] });
  });

  test('buybackStart sends the action and buybackConfirm maps the payout form', async () => {
    h.result = { data: { ok: true, challenge_issued: true }, error: null };
    await buybackStart();
    expect(h.calls[0].body).toEqual({ action: 'buyback_start' });
    h.result = { data: { ok: true, buyback_id: 'bb1', amount_cents: 2500 }, error: null };
    const out = await buybackConfirm({ code: '424242', payoutForm: 'account_credits' });
    expect(out.buyback_id).toBe('bb1');
    expect(h.calls[1].body).toEqual({ action: 'buyback_confirm', code: '424242', payout_form: 'account_credits' });
  });
});

describe('action calls', () => {
  test('initiate sends the mapped body and returns the ok data', async () => {
    h.result = { data: { ok: true, case_id: 'c1' }, error: null };
    const out = await initiateTransfer({ toEmail: 'nom@x.com', payoutForm: 'account_credits' });
    expect(out.case_id).toBe('c1');
    expect(h.calls[0].body).toEqual({ action: 'initiate', to_email: 'nom@x.com', payout_form: 'account_credits' });
  });

  test('a write throws a coded Error carrying the server error + reason', async () => {
    h.result = { data: null, error: invokeError({ error: 'security_hold', reason: 'recent_credential_change' }, 403) };
    let caught;
    try { await initiateTransfer({ toEmail: 'nom@x.com', payoutForm: 'connect_cash' }); }
    catch (e) { caught = e; }
    expect(caught).toBeInstanceOf(Error);
    expect(caught.code).toBe('security_hold');
    expect(caught.reason).toBe('recent_credential_change');
    expect(caught.message).toMatch(/recent_credential_change/);
  });

  test('confirm_initiate / nominee_confirm / reelect / abort(token) / payout_onboarding map their bodies', async () => {
    h.result = { data: { ok: true }, error: null };
    await confirmInitiate({ caseId: 'c1', code: '123456' });
    expect(h.calls.at(-1).body).toEqual({ action: 'confirm_initiate', case_id: 'c1', code: '123456' });

    h.result = { data: { ok: true, url: 'https://checkout' }, error: null };
    const paid = await nomineeConfirm({ caseId: 'c1', code: '654321' });
    expect(paid.url).toBe('https://checkout');
    expect(h.calls.at(-1).body).toEqual({ action: 'nominee_confirm', case_id: 'c1', code: '654321' });

    h.result = { data: { ok: true }, error: null };
    await reelectPayout({ caseId: 'c1' });
    expect(h.calls.at(-1).body).toEqual({ action: 'reelect_payout', case_id: 'c1' });

    await abortTransfer({ caseId: 'c1', token: 'tok' });
    expect(h.calls.at(-1).body).toEqual({ action: 'abort', case_id: 'c1', token: 'tok' });

    await payoutOnboarding();
    expect(h.calls.at(-1).body).toEqual({ action: 'payout_onboarding' });
  });
});
