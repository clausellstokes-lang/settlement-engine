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
 * PUSH (a toggle) mirrors the whole record up. It is FIRE AND FORGET: localStorage is
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

/** The signed-in user, or null. Never throws; an unconfigured build has no user. */
async function currentUserId() {
  if (!isConfigured || !supabase) return null;
  try {
    const { data } = await supabase.auth.getUser();
    return data?.user?.id || null;
  } catch { return null; }
}

/**
 * Mirror the current (or given) consent up to profiles.telemetry_consent. Resolves to
 * `{ ok }` — it never throws and never rejects, so a caller can leave it unawaited. A
 * signed-out or unconfigured caller is `ok` with a `skipped` reason: there is no row to
 * write and nothing went wrong.
 */
export async function pushTelemetryConsent(consent = getConsent()) {
  const userId = await currentUserId();
  if (!userId) return { ok: true, skipped: true };
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ telemetry_consent: consentRow(consent) })
      .eq('id', userId);
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
