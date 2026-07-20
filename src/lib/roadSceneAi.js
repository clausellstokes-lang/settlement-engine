/**
 * lib/roadSceneAi.js — THE ROAD SCENE AI-DRESSING transport (R-7 / §14).
 *
 * The OPTIONAL prose dressing for a composed road-scene bundle: it flattens the bundle's
 * sourced sections into retrieval SLICES and POSTs them to the SAME metered ai-analyst edge
 * function the S1 grounding lane uses (aiAnalyst.js). The browser NEVER calls a provider —
 * only our endpoint, which grounds the model, enforces the citation law, and METERS CREDITS
 * SERVER-SIDE (reserve → spend → refund; the client adds no spend code). The un-dressed bundle
 * stands alone (the composers' law) — this is purely additive.
 *
 * ⚠ FOLD-COORDINATION (not this branch's to wire):
 *  • sessionGate (money-wave §7.2) composes AT FOLD; this branch routes through the plain
 *    invoke and asserts normal metering — no gate code here.
 *  • the ROADS_TRUTH source token must be registered in the server citation allowlist
 *    (analystCore.ts) at fold; until then the server may 400 a roadScene slice — the button
 *    surfaces that gracefully and the un-dressed bundle is unaffected.
 *
 * Dynamic-imported by the lazy RoadScenePanel ⇒ ZERO first-paint bytes.
 */

import { supabase, isConfigured } from './supabase.js';

/** Flatten a road-scene Brief bundle into ai-analyst retrieval slices (the stateSlicers shape:
 *  one slice per sourced section). Pure. @param {import('../domain/briefs/citations.js').Brief} brief */
export function roadSceneSlices(brief) {
  const sections = brief && Array.isArray(brief.sections) ? brief.sections : [];
  return sections.map((sec) => ({ id: `roadScene:${sec.id}`, source: sec.source, title: sec.title, data: sec.items }));
}

/**
 * Dress a composed road-scene bundle with grounded AI prose through the metered surface.
 * NORMAL credit spend (server-side). Returns the answer + the server's remaining balance.
 * @param {{ brief?: import('../domain/briefs/citations.js').Brief, question?: string }} [args]
 * @returns {Promise<{ answer?: string, creditsRemaining?: number|null, refused?: boolean, error?: string }>}
 */
export async function dressRoadScene({ brief, question } = {}) {
  if (!isConfigured) return { error: 'Sign in to dress the scene with AI.' };
  const slices = roadSceneSlices(brief);
  if (!slices.length) return { error: 'Compose a road scene first.' };
  const q = (typeof question === 'string' && question.trim())
    || 'Narrate this road and its travelers for the table, grounded strictly in the sources.';

  // audience:'dm' — the road scene is DM-SECRET (§15); the sources are DM-only (ROADS_TRUTH).
  const { data, error } = await supabase.functions.invoke('ai-analyst', {
    body: { question: q, audience: 'dm', slices },
  });
  if (error) {
    let message = error.message || 'The AI-dressing request failed.';
    try { const ctx = await error.context?.json?.(); if (ctx?.error) message = ctx.error; } catch { /* keep generic */ }
    return { error: message };
  }
  return {
    answer: data?.answer,
    creditsRemaining: data?.creditsRemaining ?? null,
    refused: !!data?.refused,
  };
}
