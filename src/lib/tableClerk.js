/**
 * lib/tableClerk.js — R-1 THE SESSION LEDGER: the AI CLERK transport (optional).
 *
 * The clerk is a BUCKETING CLERK, never a writer. It reads the DM's free text
 * and proposes {kind, targets, magnitude} buckets FROM THE CLOSED VOCABULARY;
 * the human confirms; only the confirmed, schema-validated record commits. This
 * module is the write-stage twin of lib/surveyorWrite.js — the browser NEVER
 * calls a provider; it POSTs the free text + the closed vocabulary to OUR edge
 * function ('table-clerk'), which grounds the model on the vocabulary and meters
 * the credit server-side, then returns RAW proposals. The pure client SCHEMA WALL
 * (domain/tableLedger.reviewClerkProposals) re-validates every returned bucket,
 * so a hallucinated off-vocabulary bucket can never survive even a compromised
 * edge — it lands in `rejected`, never `accepted`.
 *
 * FOLD / DEPLOY SEAM (owner-gated, like every AI surface's key + edge): the
 * 'table-clerk' edge function + its vocabulary allowlist are the server half. In
 * its absence this transport is INERT-HONEST — isConfigured false yields a
 * cordial refusal and the MANUAL bucket picker (which needs no AI) is unaffected.
 *
 * DYNAMIC-IMPORTED by the lazy TableLedgerPanel only, so this module + its graph
 * (tableLedger) contribute ZERO first-paint bytes. ENFORCED by
 * tests/build/tableClerkLazy.test.js: always-on source scans (no eager static edge
 * reaches here; exactly one dynamic parent) plus a dist-closure absence keyed on
 * TABLE_CLERK_FINGERPRINT below, which `npm run verify:dist` runs post-build.
 */

import { supabase, isConfigured } from './supabase.js';
import {
  TABLE_EVENT_KINDS, MAGNITUDE_BAND_IDS, OBLIGATION_TYPES, reviewClerkProposals,
} from '../domain/tableLedger.js';

/**
 * Minifier-stable literal proving this graph stays off first paint. Consumed by
 * tests/build/tableClerkLazy.test.js — it must survive into the lazy chunk (the
 * anti-vacuity check) and appear in no first-paint chunk (the absence check), so
 * do not inline, rename, or "clean up" this export without moving the pin.
 */
export const TABLE_CLERK_FINGERPRINT = '::table-clerk:v1';

/**
 * Ask the clerk to bucket the DM's free text. Returns the schema-walled review
 * ({ accepted, rejected }) — the CLIENT re-validates the edge's raw proposals, so
 * only vocabulary-valid buckets ever reach the human's confirm step. Never throws.
 *
 * @param {{ text?: string, targets?: { stressors?: string[], npcs?: Array<{id:string,name:string}> } }} [ctx]
 * @returns {Promise<{ ok: boolean, error?: string, refusalKind?: string,
 *   accepted?: Array<{ index: number, record: any, proposal: any }>,
 *   rejected?: Array<{ index: number, errors: string[], proposal: any }> }>}
 */
export async function compileTableClerk({ text = '', targets = {} } = {}) {
  const notes = String(text || '').trim();
  if (!notes) return { ok: false, error: 'Write a line of what happened first.', refusalKind: 'input' };
  if (!isConfigured) {
    return { ok: false, error: 'The clerk is resting — record it by hand below.', refusalKind: 'tier' };
  }
  // The CLOSED VOCABULARY posted to the edge (the schema wall the server grounds
  // on): the kinds, the named bands, the obligation types, and the campaign's
  // real targets (existing stressors + NPCs) so the clerk can only name what is
  // already there — never invent a target.
  const vocabulary = {
    kinds: [...TABLE_EVENT_KINDS],
    bands: [...MAGNITUDE_BAND_IDS],
    obligationTypes: [...OBLIGATION_TYPES],
    stressorTargets: Array.isArray(targets.stressors) ? targets.stressors : [],
    npcTargets: Array.isArray(targets.npcs) ? targets.npcs : [],
  };
  const { data, error } = await supabase.functions.invoke('table-clerk', { body: { text: notes, vocabulary } });
  if (error) {
    let message = 'The clerk is unavailable right now.';
    try { const c = await error.context?.json?.(); if (c?.error) message = c.error; } catch { /* generic */ }
    return { ok: false, error: message, refusalKind: 'error' };
  }
  if (data && data.refused === true) {
    return { ok: false, error: typeof data.error === 'string' ? data.error : 'The clerk declined this.', refusalKind: 'declined' };
  }
  // THE SCHEMA WALL — re-validate the raw proposals on the client (the suspenders).
  const raw = Array.isArray(data?.proposals) ? data.proposals : [];
  const { accepted, rejected } = reviewClerkProposals(raw);
  return { ok: true, accepted, rejected };
}
