/**
 * @vitest-environment jsdom
 *
 * tests/lib/consentSync.test.js — the consent MIRROR, both directions.
 *
 * UP (a toggle): the whole record reaches profiles.telemetry_consent, stamped with the
 *   provenance marker, scoped to the signed-in row. A failure is reported, never thrown,
 *   and never touches the local record — localStorage is the offline source of truth.
 * DOWN (sign-in): a recorded server opt-out narrows the local record and a server grant
 *   never widens it. An UNSTAMPED row is ignored, because every row in the table today is
 *   the column default (036/124) and a default is not a choice.
 */
import { describe, test, expect, beforeEach, vi } from 'vitest';

const authGetUser = vi.fn();
const updateEq = vi.fn();
const selectMaybeSingle = vi.fn();
const captured = { update: null };

vi.mock('../../src/lib/supabase.js', () => ({
  isConfigured: true,
  supabase: {
    auth: { getUser: (...a) => authGetUser(...a) },
    from: (table) => {
      expect(table).toBe('profiles');
      return {
        update: (patch) => { captured.update = patch; return { eq: (col, val) => updateEq(col, val) }; },
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
  captured.update = null;
  authGetUser.mockReset().mockResolvedValue(SIGNED_IN);
  updateEq.mockReset().mockResolvedValue({ error: null });
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
  test('writes the stamped row scoped to the signed-in profile', async () => {
    setConsent({ research: false });
    const res = await pushTelemetryConsent(getConsent());
    expect(res.ok).toBe(true);
    expect(captured.update.telemetry_consent.research).toBe(false);
    expect(captured.update.telemetry_consent.v).toBe(CONSENT_MODEL_VERSION);
    expect(updateEq).toHaveBeenCalledWith('id', 'user-1');
  });

  test('a signed-out user is a skip, not a failure, and writes nothing', async () => {
    authGetUser.mockResolvedValue(SIGNED_OUT);
    const res = await pushTelemetryConsent(getConsent());
    expect(res).toEqual({ ok: true, skipped: true });
    expect(captured.update).toBe(null);
  });

  test('a rejected write reports ok:false and leaves the local record alone', async () => {
    updateEq.mockResolvedValue({ error: { message: 'rls denied' } });
    setConsent({ research: false });
    const res = await pushTelemetryConsent(getConsent());
    expect(res.ok).toBe(false);
    expect(res.reason).toBe('rls denied');
    expect(getConsent().research).toBe(false); // the user's choice still stands locally
  });

  test('a thrown transport error resolves ok:false rather than rejecting', async () => {
    updateEq.mockRejectedValue(new Error('offline'));
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
