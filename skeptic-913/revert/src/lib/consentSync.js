/**
 * consentSync.js — the SERVER MIRROR of the local telemetry-consent record.
 *
 * Consent has always been decided client-side (consent.js, localStorage `sf_consent_v1`)
 * and clamped server-side to min(client, profiles.telemetry_consent). What was missing is
 * the bridge: nothing ever WROTE the profiles column, so a user who opted out on their
 * laptop was still opted in on their phone, and the column carried nothing but its own
 * default. This module is that bridge, and only that.
 *
 * ── The two directions, and why they are not symmetric ───────────────────────
 * PUSH (a toggle) mirrors the whole record through the consent RPC. It is FIRE AND
 * FORGET: localStorage is
 * already written by the time we get here and stays the offline source of truth, so a
 * failed mirror is reported to the user and changes nothing else. It must never revert a
 * toggle, because the user's stated choice is not contingent on our network.
 *
 * PULL (sign-in) may only NARROW. An opt-out wins, so a server `false` overrides a local
 * `true`; a server `true` never re-grants something the local record has off. Consent
 * moves one way without a fresh user action.
 *
 * ── PROVENANCE, or: a default is not a choice ────────────────────────────────
 * The pull is gated on a `v` stamp that only a mirror write puts on the row. Migration 036
 * mints the column with research:false and 124 flipped that default to true WITHOUT
 * rewriting existing rows, so today every row in the table is a default that no user ever
 * touched. Reconciling from an unstamped row would read those defaults as opt-outs and
 * silently switch off a population that never asked for it. This is the same discipline
 * consent.js applies locally with `updatedAt`: honor recorded choices, never invent one.
 */
import { supabase, isConfigured } from './supabase.js';
import { getConsent, setConsent, CONSENT_TIERS, CONSENT_MODEL_VERSION } from './consent.js';

/** The jsonb the profiles column carries. Explicit booleans (never undefined), plus the
 *  `v` provenance stamp that separates a mirrored choice from the column default. */
export function consentRow(consent = getConsent()) {
  const row = { v: CONSENT_MODEL_VERSION };
  for (const tier of CONSENT_TIERS) row[tier] = consent[tier] === true;
  return row;
}

/** True when this row was written BY a mirror (so its flags are a user's choice) rather
 *  than minted by the column default (whose flags are nobody's choice). */
function isMirroredRow(row) {
  if (!row || typeof row !== 'object' || Array.isArray(row)) return false;
  const v = Number(row.v);
  return Number.isFinite(v) && v > 0;
}

/**
 * Narrow the LOCAL record to a mirrored server row: every flag the server has off and the
 * client has on is switched off. Pure apart from the consent write, and exported so the
 * opt-out-wins rule is pinned without a network. Returns the applied patch, or null when
 * the row is unusable or nothing needed narrowing.
 */
export function applyServerOptOut(row, local = getConsent()) {
  if (!isMirroredRow(row)) return null;
  const patch = {};
  for (const tier of CONSENT_TIERS) {
    if (row[tier] === false && local[tier] === true) patch[tier] = false;
  }
  if (Object.keys(patch).length === 0) return null;
  setConsent(patch);
  return patch;
}

/** Resolve auth without conflating a real signed-out state with a failed lookup. */
async function currentUserLookup() {
  if (!isConfigured || !supabase) return { userId: null, failure: 'unconfigured' };
  try {
    const { data, error } = await supabase.auth.getUser();
    if (error) return { userId: null, failure: 'auth_lookup_failed' };
    return { userId: data?.user?.id || null, failure: data?.user ? null : 'not_authenticated' };
  } catch {
    return { userId: null, failure: 'auth_lookup_failed' };
  }
}

/** The signed-in user, or null. Read paths remain best-effort and never throw. */
async function currentUserId() {
  return (await currentUserLookup()).userId;
}

/**
 * Mirror the current (or given) consent through the authenticated service-record RPC.
 * Migration 194 updates profiles.telemetry_consent and records each changed toggle's
 * prior/new value in the same transaction. Consent history is therefore a compliance
 * record, never an analytics event. Resolves to `{ ok }` — it never throws and never
 * rejects, so a caller can leave it unawaited. A signed-out or unconfigured caller is
 * `ok` with a `skipped` reason: there is no row to write and nothing went wrong.
 */
export async function pushTelemetryConsent(consent = getConsent(), expectedOwnerId = null) {
  const lookup = await currentUserLookup();
  const userId = lookup.userId;
  if (!userId) {
    return expectedOwnerId == null
      ? { ok: true, skipped: true }
      : { ok: false, skipped: true, reason: lookup.failure || 'auth_lookup_failed' };
  }
  if (expectedOwnerId != null && String(userId) !== String(expectedOwnerId)) {
    return { ok: false, skipped: true, reason: 'auth_session_changed' };
  }
  try {
    const { error } = await supabase.rpc('set_my_telemetry_consent', {
      p_expected_user: expectedOwnerId == null ? userId : String(expectedOwnerId),
      p_consent: consentRow(consent),
      p_source: 'account',
    });
    if (error) return { ok: false, reason: error.message || 'update failed' };
    return { ok: true };
  } catch (e) {
    return { ok: false, reason: (e && e.message) || 'network error' };
  }
}

/**
 * Sign-in reconcile: read the mirrored row and let a recorded opt-out win over the local
 * record. Resolves to `{ applied }` (the narrowing patch, or null). Never throws — a
 * failed read leaves the local record exactly as it was.
 */
export async function reconcileTelemetryConsent() {
  const userId = await currentUserId();
  if (!userId) return { applied: null };
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('telemetry_consent')
      .eq('id', userId)
      .maybeSingle();
    if (error || !data) return { applied: null };
    return { applied: applyServerOptOut(data.telemetry_consent) };
  } catch {
    return { applied: null };
  }
}
