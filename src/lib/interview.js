/**
 * lib/interview.js — THE INTERVIEW client transport (Surveyor, V-1 VISION WAVE).
 *
 * The analyst's sibling: builds the audience-appropriate RETRIEVAL BUNDLE on the client
 * (selectSlices — the same entity-resolved brief slices) and POSTs { question, audience,
 * slices } to the `interview` edge function, which grounds the model, enforces the
 * citation law server-side, and charges the metered credit. The browser NEVER calls a
 * provider directly — this only ever reaches our own endpoint.
 *
 * The response is the V-1 schema { answer, citations[{ref,kind}], confidence } plus the
 * per-segment breakdown the conjecture register needs. Each citation's public receipt
 * LABEL is resolved here from the slice titles the client already holds (naming hygiene:
 * the world, not the software). Dynamic-imported by the lazy InterviewPanel, so this
 * module + its brief-composer graph contribute ZERO first-paint bytes.
 */

import { supabase, isConfigured } from './supabase.js';
import { selectSlices } from '../domain/ai/index.js';
import { track, EVENTS } from './analytics.js';

/** Coarse band for a 0..1 quality metric (never the raw float in telemetry). */
function qualityBand(value) {
  if (typeof value !== 'number') return 'unknown';
  if (value >= 0.99) return 'full';
  if (value >= 0.75) return 'high';
  if (value >= 0.5) return 'partial';
  return 'low';
}

/**
 * Project the multi-hop THREAD to a target audience for the wire (secrets-seam). Under a
 * player-safe question, a prior turn answered under the DM audience may name a secret, so
 * it is DROPPED here — a player prompt is only ever seeded with player-audience prior
 * exchange. A turn whose audience tag is missing or not exactly 'player' is treated as DM
 * (FAIL CLOSED). Mirrors the server backstop (interviewCore.buildPriorExchange); the
 * server re-enforces authoritatively, so this is defense in depth, not the only guard.
 * Trims to the last few turns (the server caps + fences them too). Pure.
 *
 * @param {Array<{question?: string, answer?: string, audience?: string}>} history
 * @param {'dm'|'player'} audience — the effective audience of THIS (follow-up) question.
 * @returns {Array<{question: string, answer: string, audience: 'dm'|'player'}>}
 */
export function projectHistoryForAudience(history, audience) {
  return (Array.isArray(history) ? history : [])
    .filter((t) => t && (typeof t.question === 'string' || typeof t.answer === 'string'))
    .filter((t) => audience !== 'player' || t.audience === 'player')
    .slice(-6)
    .map((t) => ({
      question: String(t.question ?? ''),
      answer: String(t.answer ?? ''),
      audience: t.audience === 'player' ? 'player' : 'dm',
    }));
}

/** Classify a refusal by HTTP status (mirrors the analyst refusal vocabulary). */
function classifyRefusal(status) {
  switch (status) {
    case 403: return 'tier';
    case 400: return 'input';
    case 402: return 'insufficient';
    case 429: return 'rate';
    case 503: return 'capacity';
    case 502: return 'declined';
    default: return 'error';
  }
}

/**
 * Ask the Interview a question. Builds the retrieval bundle over the campaign read-model,
 * POSTs it, resolves each citation to a public receipt label, and returns the segmented,
 * cited answer. Emits the id-free adoption signal { surface:'interview', verdict } so the
 * S4+ knobs decision has acceptance metrics to read.
 *
 * V-26a follow-ons: `history` (prior {question, answer} turns) carries multi-hop context
 * — each hop is a SEPARATE metered call, re-grounded on a fresh bundle (the citation law
 * holds per hop). `scope: 'campaign'` grounds across the campaign's settlements at once
 * (`campaignSettlements`), instead of the single anchored one.
 *
 * @param {{ question?: string, worldState?: object, settlements?: Array<object>,
 *           settlement?: object|null, tick?: number, audience?: 'dm'|'player',
 *           history?: Array<{question?: string, answer?: string, audience?: 'dm'|'player'}>,
 *           scope?: 'settlement'|'campaign', campaignSettlements?: Array<object> }} ctx
 * @returns {Promise<{ answer?: string, segments?: Array<object>, citations?: Array<object>,
 *   confidence?: number|null, citationCoverage?: number|null, audience?: 'dm'|'player', byok?: boolean,
 *   creditsRemaining?: number|null, refused?: boolean, error?: string, refusalKind?: string|null,
 *   refusalClass?: string|null, doors?: string[]|null }>}
 */
export async function askInterview({ question, worldState = null, settlements = [], settlement = null, tick = 0, audience, history = [], scope = 'settlement', campaignSettlements = [] } = {}) {
  const q = typeof question === 'string' ? question.trim() : '';
  if (!q) return { error: 'Ask a question first.' };
  if (!isConfigured) return { error: 'Sign in to use the Interview.' };

  // Build the retrieval bundle CLIENT-SIDE under the structural audience rule. The
  // effective audience (a player-framed question is forced to 'player') comes back from
  // selectSlices — we POST that, so the server sees the audience the slices honour.
  const { audience: effectiveAudience, slices } = selectSlices({
    question: q, worldState, settlements, settlement, tick, audience, scope, campaignSettlements,
  });

  // Multi-hop: the last few prior turns as CONTEXT (the server caps + fences them; we
  // trim client-side so the wire body stays small). THE AUDIENCE GATE ACROSS HOPS: under a
  // player-safe question, a prior DM-audience answer may name a secret, so it is dropped
  // here against the EFFECTIVE audience (defense in depth — the server re-enforces).
  const priorTurns = projectHistoryForAudience(history, effectiveAudience);

  const { data, error } = await supabase.functions.invoke('interview', {
    body: { question: q, audience: effectiveAudience, slices, history: priorTurns },
  });

  if (error) {
    let message = error.message || 'The Interview request failed.';
    const status = error.context?.status ?? 0;
    let refused = false;
    let refusalClass = null;
    let doors = null;
    try {
      const ctx = await error.context?.json?.();
      if (ctx?.error) message = ctx.error;
      if (ctx?.refused === true) refused = true;
      if (typeof ctx?.refusalClass === 'string') refusalClass = ctx.refusalClass;
      if (Array.isArray(ctx?.doors)) doors = ctx.doors;
    } catch { /* keep the generic message */ }
    track(EVENTS.SURVEYOR_ADOPTION, { surface: 'interview', verdict: 'refused' });
    return { error: message, audience: effectiveAudience, refused, refusalKind: classifyRefusal(status), refusalClass, doors };
  }

  // The public receipt label per resolved citation — the slice's human title, never its
  // id (naming hygiene). Slice ids the client posted carry the same titles server-side.
  const titleById = new Map((Array.isArray(slices) ? slices : []).map((s) => [s.id, s.title]));
  const label = (ref) => titleById.get(ref) || 'the campaign record';
  const citations = (Array.isArray(data?.citations) ? data.citations : []).map((c) => ({ ...c, label: label(c.ref) }));
  const segments = (Array.isArray(data?.segments) ? data.segments : []).map((s) => ({
    text: typeof s?.text === 'string' ? s.text : '',
    register: s?.register === 'cited' ? 'cited' : 'conjecture',
    citations: (Array.isArray(s?.citations) ? s.citations : []).map((c) => ({ ...c, label: label(c.ref) })),
  }));

  // The §5 eval + adoption signal — coarse, id-free.
  track(EVENTS.AI_ANALYST_ANSWER, {
    surface: 'interview', audience: effectiveAudience,
    coverageBand: qualityBand(data?.citationCoverage), refused: false,
    sliceCount: Array.isArray(slices) ? slices.length : 0, byok: !!data?.byok,
  });
  track(EVENTS.SURVEYOR_ADOPTION, { surface: 'interview', verdict: 'answered' });

  return {
    answer: typeof data?.answer === 'string' ? data.answer : '',
    segments,
    citations,
    confidence: typeof data?.confidence === 'number' ? data.confidence : null,
    citationCoverage: typeof data?.citationCoverage === 'number' ? data.citationCoverage : null,
    audience: data?.audience || effectiveAudience,
    byok: !!data?.byok,
    creditsRemaining: data?.creditsRemaining ?? null,
  };
}

/** Answer-acceptance signal (thumbs). Best-effort, id-free. */
export function recordInterviewFeedback(accepted) {
  track(EVENTS.SURVEYOR_ADOPTION, { surface: 'interview', verdict: accepted ? 'accepted' : 'declined' });
}
