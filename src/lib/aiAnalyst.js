/**
 * lib/aiAnalyst.js — the analyst CLIENT transport (Surveyor S1).
 *
 * Builds the audience-appropriate RETRIEVAL BUNDLE on the client (selectSlices, which
 * routes a question to the S2 brief composers under the STRUCTURAL audience rule) and
 * POSTs { question, audience, slices } to the ai-analyst edge function. The browser
 * NEVER calls a provider directly (tests/security/clientAiBoundary.contract.test.js) —
 * this only ever reaches our own endpoint, which grounds the model + enforces citations.
 *
 * This module is dynamic-imported by the lazy AiAnalystPanel, so it (and its transitive
 * brief-composer graph) contributes ZERO first-paint bytes.
 */

import { supabase, isConfigured } from './supabase.js';
import { selectSlices } from '../domain/ai/index.js';
import { track, EVENTS } from './analytics.js';

/** Coarse band for the citation-coverage metric (never the raw float in telemetry). */
function coverageBand(coverage) {
  if (typeof coverage !== 'number') return 'unknown';
  if (coverage >= 0.99) return 'full';
  if (coverage >= 0.75) return 'high';
  if (coverage >= 0.5) return 'partial';
  return 'low';
}

/**
 * Ask the analyst. Builds the retrieval bundle for `question` over the campaign
 * read-model, POSTs it, and returns the cited answer. Fires the §5 eval metric
 * (AI_ANALYST_ANSWER) with coarse, id-free props.
 *
 * @param {{ question?: string,
 *           worldState?: object, settlements?: Array<object>, settlement?: object|null,
 *           tick?: number, audience?: 'dm'|'player' }} ctx
 * @returns {Promise<{ answer?: string, claims?: Array<object>, citationCoverage?: number,
 *                     audience?: 'dm'|'player', byok?: boolean, creditsRemaining?: number|null,
 *                     refused?: boolean, error?: string, refusalKind?: string|null }>}
 */
export async function askAnalyst({ question, worldState = null, settlements = [], settlement = null, tick = 0, audience } = {}) {
  const q = typeof question === 'string' ? question.trim() : '';
  if (!q) return { error: 'Ask a question first.' };
  if (!isConfigured) return { error: 'Sign in to use the analyst.' };

  // Build the retrieval bundle CLIENT-SIDE under the structural audience rule. The
  // effective audience (a player-framed question is forced to 'player') comes back from
  // selectSlices — we POST that, so the server sees the same audience the slices honour.
  const { audience: effectiveAudience, slices } = selectSlices({
    question: q, worldState, settlements, settlement, tick, audience,
  });

  const { data, error } = await supabase.functions.invoke('ai-analyst', {
    body: { question: q, audience: effectiveAudience, slices },
  });

  if (error) {
    // supabase-js wraps a non-2xx as an error; surface the server message (already made
    // graceful server-side) + classify the refusal KIND from the status for the §5 eval
    // (refusal QUALITY, §3d). A dead-end refusal is a scored failure.
    let message = error.message || 'The analyst request failed.';
    let status = error.context?.status ?? 0;
    try {
      const ctx = await error.context?.json?.();
      if (ctx?.error) message = ctx.error;
    } catch { /* keep the generic message */ }
    const refusalKind = classifyRefusal(status);
    track(EVENTS.AI_ANALYST_ANSWER, {
      audience: effectiveAudience, coverageBand: 'none', refused: true,
      sliceCount: slices.length, byok: false, refusalKind,
    });
    return { error: message, audience: effectiveAudience, refusalKind };
  }

  // NAMING HYGIENE (§3c(3)): resolve each cited claim to its PUBLIC receipt name (the
  // slice's human title), never the internal slice id / read:* tag. The panel shows this.
  const titleById = new Map(slices.map((s) => [s.id, s.title]));
  const claims = (Array.isArray(data?.claims) ? data.claims : []).map((c) => ({
    ...c,
    label: c.sourced ? (titleById.get(c.source) || 'the campaign record') : 'the engine does not record this',
  }));

  const result = {
    answer: data?.answer,
    claims,
    citationCoverage: typeof data?.citationCoverage === 'number' ? data.citationCoverage : undefined,
    audience: data?.audience || effectiveAudience,
    byok: !!data?.byok,
    creditsRemaining: data?.creditsRemaining ?? null,
    refused: !!data?.refused,
  };

  track(EVENTS.AI_ANALYST_ANSWER, {
    audience: result.audience,
    coverageBand: coverageBand(result.citationCoverage),
    refused: result.refused,
    sliceCount: slices.length,
    byok: result.byok,
    refusalKind: null,
  });

  return result;
}

/** Classify a refusal by HTTP status for the refusal-quality metric (§3d / §5). */
function classifyRefusal(status) {
  switch (status) {
    case 403: return 'tier';        // Surveyor entitlement gate
    case 400: return 'audience';    // player-audience boundary / bad request
    case 402: return 'insufficient';
    case 429: return 'rate';
    case 503: return 'capacity';
    case 502: return 'declined';    // model declined / failed (refunded)
    default: return 'error';
  }
}

/** Record answer acceptance (the §5 answer-acceptance metric). Coarse boolean only. */
export function recordAnalystFeedback(accepted) {
  track(EVENTS.AI_ANALYST_FEEDBACK, { accepted: !!accepted });
}
