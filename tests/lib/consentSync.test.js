/**
 * @vitest-environment jsdom
 *
 * tests/lib/consentSync.test.js — the consent MIRROR, both directions.
 *
 * UP (a toggle): the whole record reaches the authenticated consent service RPC,
 *   stamped with the provenance marker. That RPC owns both the profile mirror and
 *   durable prior/new compliance records. A failure is reported, never thrown, and
 *   never touches the local record — localStorage is the offline source of truth.
 * DOWN (sign-in): a recorded server opt-out narrows the local record and a server grant
 *   never widens it. An UNSTAMPED row is ignored, because every row in the table today is
 *   the column default (036/124) and a default is not a choice.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';

const authGetUser = vi.fn();
const rpc = vi.fn();
const selectMaybeSingle = vi.fn();

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: { getUser: (...a) => authGetUser(...a) },
    rpc: (...a) => rpc(...a),
    from: (table) => {
      expect(table).toBe('profiles');
      return {
        select: (cols) => ({ eq: (col, val) => ({ maybeSingle: () => selectMaybeSingle(cols, col, val) }) }),
      };
    },
  },
}));

const { consentRow, applyServerOptOut, pushTelemetryConsent, reconcileTelemetryConsent } =
  await import('../../src/lib/consentSync.js');
const { getConsent, setConsent, CONSENT_MODEL_VERSION } = await import('../../src/lib/consent.js');

const SIGNED_IN = { data: { user: { id: 'user-1' } }, error: null };
const SIGNED_OUT = { data: { user: null }, error: null };

beforeEach(() => {
  localStorage.clear();
  authGetUser.mockReset().mockResolvedValue(SIGNED_IN);
  rpc.mockReset().mockResolvedValue({ data: null, error: null });
  selectMaybeSingle.mockReset().mockResolvedValue({ data: null, error: null });
});

describe('consentRow — the mirrored shape', () => {
  test('carries every tier as a real boolean plus the provenance stamp', () => {
    const row = consentRow({ essential: true, research: false, ai_prose: false, market: true });
    expect(row).toEqual({
      v: CONSENT_MODEL_VERSION, essential: true, research: false, ai_prose: false, market: true,
    });
  });
});

describe('UP — a toggle mirrors to the account', () => {
  test('writes the stamped row through the compliance-record RPC', async () => {
    setConsent({ research: false });
    const res = await pushTelemetryConsent(getConsent());
    expect(res.ok).toBe(true);
    expect(rpc).toHaveBeenCalledWith('set_my_telemetry_consent', {
      p_expected_user: 'user-1',
      p_consent: expect.objectContaining({
        research: false,
        v: CONSENT_MODEL_VERSION,
      }),
      p_source: 'account',
    });
  });

  test('refuses a delayed mirror after the captured owner changes', async () => {
    const res = await pushTelemetryConsent(getConsent(), 'user-2');
    expect(res).toEqual({ ok: false, skipped: true, reason: 'auth_session_changed' });
    expect(rpc).not.toHaveBeenCalled();
  });

  test('a signed-out user is a skip, not a failure, and writes nothing', async () => {
    authGetUser.mockResolvedValue(SIGNED_OUT);
    const res = await pushTelemetryConsent(getConsent());
    expect(res).toEqual({ ok: true, skipped: true });
    expect(rpc).not.toHaveBeenCalled();
  });

  test('a signed-in mirror surfaces auth lookup failures instead of silently skipping', async () => {
    authGetUser.mockRejectedValueOnce(new Error('offline'));
    await expect(pushTelemetryConsent(getConsent(), 'user-1')).resolves.toEqual({
      ok: false, skipped: true, reason: 'auth_lookup_failed',
    });
    authGetUser.mockResolvedValueOnce({ data: { user: null }, error: new Error('token check failed') });
    await expect(pushTelemetryConsent(getConsent(), 'user-1')).resolves.toEqual({
      ok: false, skipped: true, reason: 'auth_lookup_failed',
    });
    expect(rpc).not.toHaveBeenCalled();
  });

  test('a rejected write reports ok:false and leaves the local record alone', async () => {
    rpc.mockResolvedValue({ error: { message: 'rls denied' } });
    setConsent({ research: false });
    const res = await pushTelemetryConsent(getConsent());
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('rls denied');
    expect(getConsent().research).toBe(false); // the user's choice still stands locally
  });

  test('a thrown transport error resolves ok:false rather than rejecting', async () => {
    rpc.mockRejectedValue(new Error('offline'));
    await expect(pushTelemetryConsent(getConsent())).resolves.toEqual({ ok: false, reason: 'offline' });
  });
});

describe('DOWN — a recorded opt-out wins, and only narrows', () => {
  test('server false over local true switches the local flag off', () => {
    setConsent({ research: true, market: true });
    const patch = applyServerOptOut({ v: CONSENT_MODEL_VERSION, essential: true, research: false, ai_prose: false, market: true });
    expect(patch).toEqual({ research: false });
    expect(getConsent().research).toBe(false);
    expect(getConsent().market).toBe(true); // untouched: the server agreed
  });

  test('server true over local false NEVER re-grants', () => {
    setConsent({ research: false, market: false });
    const patch = applyServerOptOut({ v: CONSENT_MODEL_VERSION, essential: true, research: true, ai_prose: true, market: true });
    expect(patch).toBe(null);
    expect(getConsent().research).toBe(false);
    expect(getConsent().market).toBe(false);
  });

  test('an UNSTAMPED row is the column default, not a choice, and is ignored', () => {
    setConsent({ research: true });
    // 036's default shape, verbatim: no `v`, research false.
    expect(applyServerOptOut({ essential: true, research: false, ai_prose: false })).toBe(null);
    expect(getConsent().research).toBe(true);
  });

  test('a garbage row narrows nothing', () => {
    setConsent({ research: true });
    for (const row of [null, undefined, 'nope', 42, [], { v: 0, research: false }]) {
      expect(applyServerOptOut(row)).toBe(null);
    }
    expect(getConsent().research).toBe(true);
  });

  test('reconcile reads the profile row and applies the narrowing', async () => {
    setConsent({ research: true });
    selectMaybeSingle.mockResolvedValue({
      data: { telemetry_consent: { v: CONSENT_MODEL_VERSION, essential: true, research: false, ai_prose: false, market: false } },
      error: null,
    });
    const res = await reconcileTelemetryConsent();
    expect(res.applied).toEqual({ research: false });
    expect(getConsent().research).toBe(false);
    expect(selectMaybeSingle).toHaveBeenCalledWith('telemetry_consent', 'id', 'user-1');
  });

  test('an unreadable profile leaves the local record exactly as it was', async () => {
    setConsent({ research: true });
    selectMaybeSingle.mockResolvedValue({ data: null, error: { message: 'down' } });
    await expect(reconcileTelemetryConsent()).resolves.toEqual({ applied: null });
    expect(getConsent().research).toBe(true);
  });

  test('a signed-out reconcile is a no-op', async () => {
    authGetUser.mockResolvedValue(SIGNED_OUT);
    await expect(reconcileTelemetryConsent()).resolves.toEqual({ applied: null });
    expect(selectMaybeSingle).not.toHaveBeenCalled();
  });
});
