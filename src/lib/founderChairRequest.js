/**
 * lib/founderChairRequest.js — THE REQUEST FOR A CHAIR (DESIGN_FOUNDERS_HALL §5b).
 *
 * "Claim a founder seat" became "REQUEST a founder seat" the moment the purchase
 * class was abolished: a chair is asked for by letter, never bought. This module
 * is the letter's only backend seam.
 *
 * IT ADDS NO SYSTEM. The letter files into the ONE support queue through the same
 * `support_messages` insert the Feedback panel already uses (RLS: a user may
 * insert and read their OWN rows — migration 002). The `founders_request` tag
 * rides the PRE-TYPED SUBJECT so the admin panel filters requests with an
 * ordinary subject match, and rides `metadata.tag` as well so a hand-edited
 * subject cannot orphan a letter from its filter.
 *
 * A REQUEST GRANTS NOTHING AND SHORTCUTS NOTHING (§5b). No chair, no queue
 * position, no status tracker, no implied timeline. An invitation, if one ever
 * follows, flows ONLY through the two-key admin issuance lane. The one promise
 * this surface makes — every letter is read — is the only one it can keep, so it
 * is the only one it states.
 *
 * ⚠️ THE ONE-OPEN-REQUEST RULE IS CLIENT-SIDE ONLY, DELIBERATELY AND RECORDED.
 * Server enforcement wants a constraint on the chair/invite schema, which is
 * owner-gated and undeployed (§8). Until it lands, a determined resubmitter can
 * file twice — the cost of which is a duplicate support ticket, not a granted
 * chair. The gate that matters (issuance) is elsewhere and is two-key. Stated
 * here rather than left for someone to discover.
 *
 * ZERO EAGER: imported only from inside the lazy Hall route.
 */

import { supabase, isConfigured } from './supabase.js';
import { HALL_REQUEST_SUBJECT, HALL_REQUEST_TAG, composeChairLetter } from './foundersHall.js';

/**
 * Ticket statuses that mean the letter is FINISHED. Everything else in the 055
 * lifecycle ('new' | 'triage' | 'assigned' | 'in_progress' | 'waiting_on_user' |
 * 'reopened' | the tolerated legacy 'read' | 'replied') means it is still open.
 * Spelled as the closed set, not the open one, so a status added to the lifecycle
 * later reads as OPEN — the fail-safe direction: a new status must not silently
 * reopen the letterbox for someone whose letter is still in hand.
 */
const CLOSED_STATUSES = Object.freeze(['resolved', 'closed']);

/**
 * THE RESUBMISSION BAND (§5b: "a long resubmission band after closure").
 * CHAIR RULING, vetoable: one hundred and eighty days. Long enough that a letter
 * is a considered act rather than a retry loop; short enough that a life which
 * changed in a year may say so.
 */
export const CHAIR_REQUEST_BAND_DAYS = 180;

/**
 * @typedef {Object} ChairRequestStanding
 * @property {boolean} canWrite       whether the letter may be written now
 * @property {'none'|'open'|'cooling'|'unknown'} state
 * @property {string|null} since      ISO timestamp of the most recent letter
 * @property {number|null} daysLeft   days remaining in the band when cooling
 */

/**
 * What standing this account has to write a letter.
 *
 * FAILS OPEN, on purpose. A read error (not configured, RLS surprise, transient)
 * returns `canWrite:true` with state 'unknown': the worst case is a duplicate
 * support ticket an operator closes in a second, whereas failing closed would
 * silently deny a would-be founder the only door they have. The asymmetry runs
 * the other way from an entitlement check, and this is not one — nothing is
 * granted here.
 *
 * @param {string|null|undefined} userId
 * @param {{ now?: number }} [opts]
 * @returns {Promise<ChairRequestStanding>}
 */
export async function fetchChairRequestStanding(userId, opts) {
  const now = opts?.now ?? Date.now();
  if (!userId || !isConfigured) return unknown();
  try {
    const { data, error } = await supabase
      .from('support_messages')
      .select('status, created_at')
      .eq('user_id', userId)
      .eq('subject', HALL_REQUEST_SUBJECT)
      .order('created_at', { ascending: false })
      .limit(1);
    if (error || !Array.isArray(data)) return unknown();
    return standingFromRow(data[0] || null, now);
  } catch {
    return unknown();
  }
}

/**
 * Pure standing rule, exported so the band can be pinned without a backend.
 *
 * @param {{ status?: string, created_at?: string }|null} row  the most recent letter
 * @param {number} now  epoch ms
 * @returns {ChairRequestStanding}
 */
export function standingFromRow(row, now) {
  if (!row) return { canWrite: true, state: 'none', since: null, daysLeft: null };
  const since = typeof row.created_at === 'string' ? row.created_at : null;
  if (!CLOSED_STATUSES.includes(row.status)) {
    return { canWrite: false, state: 'open', since, daysLeft: null };
  }
  const at = since ? new Date(since).getTime() : NaN;
  if (Number.isNaN(at)) return { canWrite: true, state: 'none', since, daysLeft: null };
  const elapsedDays = (now - at) / 86_400_000;
  if (elapsedDays >= CHAIR_REQUEST_BAND_DAYS) {
    return { canWrite: true, state: 'none', since, daysLeft: null };
  }
  return {
    canWrite: false,
    state: 'cooling',
    since,
    daysLeft: Math.max(1, Math.ceil(CHAIR_REQUEST_BAND_DAYS - elapsedDays)),
  };
}

function unknown() {
  return { canWrite: true, state: 'unknown', since: null, daysLeft: null };
}

/**
 * File the letter. Signed-in only — an honor needs a bearer (§5b).
 *
 * @param {{ userId: string, email: string, answers: Record<string, string> }} letter
 * @returns {Promise<{ ok: boolean, error: string|null }>}
 */
export async function submitChairRequest({ userId, email, answers }) {
  if (!userId) return { ok: false, error: 'Please sign in before writing.' };
  if (!isConfigured) return { ok: false, error: 'The letterbox is unavailable right now.' };
  try {
    const { error } = await supabase.from('support_messages').insert({
      user_id: userId,
      email: email || 'unknown',
      subject: HALL_REQUEST_SUBJECT,
      message: composeChairLetter(answers),
      category: 'other',
      metadata: { tag: HALL_REQUEST_TAG },
    });
    if (error) return { ok: false, error: error.message || 'Your letter could not be sent.' };
    return { ok: true, error: null };
  } catch (e) {
    return { ok: false, error: e?.message || 'Your letter could not be sent.' };
  }
}
