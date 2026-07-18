/**
 * lib/surveyorWrite.js — the CLIENT transports for the Surveyor WRITE stages
 * (S4 custom content · style overhaul · S5/S6 construction · S3 interpret).
 *
 * The write-stage twin of lib/aiAnalyst.js. Each function builds the stage's TOOL
 * VOCABULARY on the client (the SAME source of truth the schema wall enforces against)
 * plus the audience-appropriate RETRIEVAL BUNDLE (selectSlices — the anchor is the
 * default scope), then POSTs to the stage's own edge function. The browser NEVER calls a
 * provider directly — this only ever reaches OUR endpoint, which grounds the model,
 * enforces the schema wall, and charges the task-priced credit (S1 money path).
 *
 * The response is passed back RAW (draft / candidate style / config+constraints /
 * interpretation) — the PURE HALVES (contentReview / townMapStyleWall / configVocabulary /
 * interpretReview) do the client-side validation + review in the panels, so a hallucinated
 * field can never survive even a compromised edge. The §2b `earlyAccess` flag, `byok`, and
 * `creditsRemaining` ride through untouched for the panel to surface.
 *
 * DYNAMIC-IMPORTED by the lazy Surveyor panels (never statically) so this module and its
 * transitive graph (the vocabulary builders, the slicers) contribute ZERO first-paint bytes
 * — the lazy-chunk membership contract (tests/build/surveyorPanelsLazy.test.js) enforces it
 * via SURVEYOR_WRITE_FINGERPRINT.
 */

import { supabase, isConfigured } from './supabase.js';
import { selectSlices } from '../domain/ai/index.js';
import { deriveAnchor, anchorSettlement } from '../domain/ai/contextAnchor.js';

/** A unique, minifier-stable string literal proving this graph stays off first paint
 *  (the interiorLazy/townMapLazy fingerprint idiom). Asserted ABSENT from the entry
 *  static closure and PRESENT in some lazy chunk by the build membership test. */
export const SURVEYOR_WRITE_FINGERPRINT = '::surveyor-write:v1';

/** Classify a refusal by HTTP status for the §3d refusal-quality signal — mirrors
 *  aiAnalyst.classifyRefusal so every Surveyor surface speaks one refusal vocabulary.
 *  Note: a paused-stage kill-switch surfaces as 503 (refusalClass 'stage_disabled' in
 *  the body); the cordial message is server-composed, so panels render it verbatim. */
export function classifyRefusal(status) {
  switch (status) {
    case 403: return 'tier';         // Surveyor entitlement gate
    case 400: return 'input';        // bad request / empty prompt
    case 402: return 'insufficient'; // out of credits (nothing charged)
    case 429: return 'rate';
    case 503: return 'capacity';     // capacity OR a paused stage (kill-switch)
    case 502: return 'declined';     // model declined / failed (refunded)
    default: return 'error';
  }
}

/**
 * Build the anchor label + retrieval bundle the write edges ground on, from the same
 * campaign read-model the panels already hold. Pure client retrieval — no provider call.
 * @param {{ prompt?: string, view?: string, params?: object, selectedSettlementId?: string|null,
 *           settlement?: object|null, savedSettlements?: Array<object>, activeCampaign?: object|null,
 *           worldState?: object|null }} [ctx]
 * @returns {{ anchorLabel: string, slices: Array<{ id: string, title: string }> }}
 */
export function buildWriteContext({
  prompt = '', view = 'home', params = {}, selectedSettlementId = null, settlement = null,
  savedSettlements = [], activeCampaign = null, worldState = null,
} = {}) {
  const tick = worldState?.tick ?? null;
  const anchor = deriveAnchor({ view, params, selectedSettlementId, settlement, savedSettlements, activeCampaign, tick });
  const anchored = anchorSettlement(anchor, { settlement, savedSettlements }) || settlement;
  const settlements = Array.isArray(savedSettlements)
    ? savedSettlements.map((s) => ({ id: s?.id, name: s?.name })) : [];
  const { slices } = selectSlices({
    question: prompt, worldState, settlements, settlement: anchored, tick: tick || 0, audience: 'dm',
  });
  return { anchorLabel: anchor.label, slices: Array.isArray(slices) ? slices : [] };
}

/**
 * The shared POST + graceful-error idiom (aiAnalyst's pattern, per-stage). Returns the raw
 * edge data on success, or a normalized refusal on failure — never throws.
 * @param {string} slug edge function slug
 * @param {Record<string, unknown>} body
 * @returns {Promise<{ ok: boolean, data?: any, error?: string, refusalKind?: string,
 *                     refusalClass?: string|null, doors?: string[]|null }>}
 */
async function postWrite(slug, body) {
  if (!isConfigured) return { ok: false, error: 'Sign in to use the Surveyor.', refusalKind: 'tier' };
  const { data, error } = await supabase.functions.invoke(slug, { body });
  if (error) {
    let message = error.message || 'The Surveyor is unavailable right now.';
    const status = error.context?.status ?? 0;
    /** @type {string|null} */ let refusalClass = null;
    /** @type {string[]|null} */ let doors = null;
    try {
      const ctx = await error.context?.json?.();
      if (ctx?.error) message = ctx.error;
      if (typeof ctx?.refusalClass === 'string') refusalClass = ctx.refusalClass;
      if (Array.isArray(ctx?.doors)) doors = ctx.doors;
    } catch { /* keep the generic message */ }
    return { ok: false, error: message, refusalKind: classifyRefusal(status), refusalClass, doors };
  }
  // Some edges compose a cordial refusal at 200 with { refused:true } — honor it.
  if (data && typeof data === 'object' && data.refused === true) {
    return {
      ok: false, error: typeof data.error === 'string' ? data.error : 'The Surveyor declined this request.',
      refusalKind: 'declined',
      refusalClass: typeof data.refusalClass === 'string' ? data.refusalClass : null,
      doors: Array.isArray(data.doors) ? data.doors : null,
    };
  }
  return { ok: true, data };
}

/** Common pass-through fields every write stage surfaces (S1 money path + §2b). */
function commonFields(data) {
  return {
    byok: !!data?.byok,
    creditsRemaining: data?.creditsRemaining ?? null,
    earlyAccess: data?.earlyAccess !== false, // §2b: honest until live metrics mature
    usageWarning: typeof data?.usageWarning === 'string' ? data.usageWarning : null,
  };
}

/** The §3b musing register — bare {text}, rendered visibly distinct by the panel. */
function passMusings(data) {
  return (Array.isArray(data?.musings) ? data.musings : [])
    .map((m) => ({ text: typeof m?.text === 'string' ? m.text : '' }))
    .filter((m) => m.text);
}

/**
 * S4 CUSTOM CONTENT — compile a homebrew request into a validated, field-labelled draft.
 * @param {{ intent?: string } & Parameters<typeof buildWriteContext>[0]} [ctx]
 * @returns {Promise<{ ok: boolean, draft?: object, musings?: Array<{text:string}>,
 *   summary?: object, error?: string, refusalKind?: string, refusalClass?: string|null,
 *   doors?: string[]|null, byok?: boolean, creditsRemaining?: number|null, earlyAccess?: boolean }>}
 */
export async function compileCustomContent(ctx = {}) {
  const intent = typeof ctx.intent === 'string' ? ctx.intent.trim() : '';
  if (!intent) return { ok: false, error: 'Describe the content you want first.', refusalKind: 'input' };
  const { buildContentVocabulary } = await import('../domain/content/contentVocabulary.js');
  const { anchorLabel, slices } = buildWriteContext({ ...ctx, prompt: intent });
  const res = await postWrite('custom-content', { intent, anchorLabel, vocabulary: buildContentVocabulary(), slices });
  if (!res.ok) return res;
  const d = res.data;
  return {
    ok: true,
    draft: (d && typeof d.draft === 'object') ? d.draft : { entries: [], unsupported: [] },
    summary: (d && typeof d.summary === 'object') ? d.summary : null,
    musings: passMusings(d),
    ...commonFields(d),
  };
}

/**
 * STYLE OVERHAUL — compile a prompt into a CANDIDATE bespoke map style (raw; the panel
 * re-validates it through validateBespokeStyle, so only known-role fields survive).
 * @param {{ prompt?: string } & Parameters<typeof buildWriteContext>[0]} [ctx]
 * @returns {Promise<{ ok: boolean, candidate?: object|null, musings?: Array<{text:string}>,
 *   error?: string, refusalKind?: string, refusalClass?: string|null, doors?: string[]|null,
 *   byok?: boolean, creditsRemaining?: number|null, earlyAccess?: boolean }>}
 */
export async function compileStyleOverhaul(ctx = {}) {
  const prompt = typeof ctx.prompt === 'string' ? ctx.prompt.trim() : '';
  if (!prompt) return { ok: false, error: 'Describe the map look you want first.', refusalKind: 'input' };
  const { buildStyleVocabulary } = await import('../design/townMapStyleWall.js');
  const { anchorLabel, slices } = buildWriteContext({ ...ctx, prompt });
  const res = await postWrite('style-overhaul', { prompt, anchorLabel, vocabulary: buildStyleVocabulary(), slices });
  if (!res.ok) return res;
  const d = res.data;
  // The edge may name the proposal `style`, `candidate`, or `draft` — accept any (the wall
  // re-validates regardless). Never trust it as final: validateBespokeStyle projects it.
  const candidate = (d && typeof d === 'object')
    ? (d.candidate ?? d.style ?? d.draft ?? null) : null;
  return { ok: true, candidate, musings: passMusings(d), ...commonFields(d) };
}

/**
 * S5/S6 CONSTRUCTION — compile an intent into a raw generator CONFIG + declared CONSTRAINTS
 * (the panel validates both through the config wall before rendering / generating).
 * @param {{ intent?: string, scope?: 'settlement'|'realm' } & Parameters<typeof buildWriteContext>[0]} [ctx]
 * @returns {Promise<{ ok: boolean, rawConfig?: object, rawConstraints?: object,
 *   musings?: Array<{text:string}>, error?: string, refusalKind?: string,
 *   refusalClass?: string|null, doors?: string[]|null, byok?: boolean,
 *   creditsRemaining?: number|null, earlyAccess?: boolean }>}
 */
export async function compileConstruction(ctx = {}) {
  const intent = typeof ctx.intent === 'string' ? ctx.intent.trim() : '';
  if (!intent) return { ok: false, error: 'Describe what to build first.', refusalKind: 'input' };
  const scope = ctx.scope === 'realm' ? 'realm' : 'settlement';
  const { buildConstructVocabulary } = await import('../domain/construct/configVocabulary.js');
  const { anchorLabel, slices } = buildWriteContext({ ...ctx, prompt: intent });
  const slug = scope === 'realm' ? 'construct-realm' : 'construct-settlement';
  const res = await postWrite(slug, { intent, scope, anchorLabel, vocabulary: buildConstructVocabulary(), slices });
  if (!res.ok) return res;
  const d = res.data;
  return {
    ok: true,
    rawConfig: (d && typeof d.config === 'object' && d.config) ? d.config : {},
    rawConstraints: (d && typeof d.constraints === 'object' && d.constraints) ? d.constraints : {},
    musings: passMusings(d),
    ...commonFields(d),
  };
}

/**
 * A DELTA-ONLY construction revise pass (directive 5): sends ONLY the deviations + the
 * current config — never the original grounding. The panel builds the payload with
 * buildRevisePayload; this posts it and returns the corrected raw config.
 * @param {{ scope?: 'settlement'|'realm', payload?: { deviations: Array<object>, config: object, _noSlices: true } }} [ctx]
 */
export async function reviseConstruction(ctx = {}) {
  const scope = ctx.scope === 'realm' ? 'realm' : 'settlement';
  const payload = ctx.payload;
  if (!payload || payload._noSlices !== true) {
    return { ok: false, error: 'A revise pass must carry a delta-only payload.', refusalKind: 'input' };
  }
  const slug = scope === 'realm' ? 'construct-realm' : 'construct-settlement';
  // NO vocabulary, NO slices — a revise corrects, it does not re-ground.
  const res = await postWrite(slug, { revise: true, scope, ...payload });
  if (!res.ok) return res;
  const d = res.data;
  return {
    ok: true,
    rawConfig: (d && typeof d.config === 'object' && d.config) ? d.config : {},
    rawConstraints: (d && typeof d.constraints === 'object' && d.constraints) ? d.constraints : {},
    musings: passMusings(d),
    ...commonFields(d),
  };
}

/**
 * S3 INTERPRET — compile session text into proposed ops (the interpretation the accept→mint
 * panel reviews per-item and applies). Returns the raw interpretation ({ ops:[...] }).
 * @param {{ sessionText?: string, protectedContext?: object } & Parameters<typeof buildWriteContext>[0]} [ctx]
 * @returns {Promise<{ ok: boolean, interpretation?: object, seed?: string|null,
 *   interpretRef?: string|null, musings?: Array<{text:string}>, error?: string,
 *   refusalKind?: string, refusalClass?: string|null, doors?: string[]|null,
 *   byok?: boolean, creditsRemaining?: number|null, earlyAccess?: boolean }>}
 */
export async function compileInterpretation(ctx = {}) {
  const sessionText = typeof ctx.sessionText === 'string' ? ctx.sessionText.trim() : '';
  if (!sessionText) return { ok: false, error: 'Paste the session recap to interpret first.', refusalKind: 'input' };
  const { buildOpVocabulary } = await import('../domain/intent/opVocabulary.js');
  const { anchorLabel, slices } = buildWriteContext({ ...ctx, prompt: sessionText });
  const res = await postWrite('interpret-session', {
    sessionText, anchorLabel, vocabulary: buildOpVocabulary(),
    protectedContext: (ctx.protectedContext && typeof ctx.protectedContext === 'object') ? ctx.protectedContext : null,
    slices,
  });
  if (!res.ok) return res;
  const d = res.data;
  return {
    ok: true,
    interpretation: (d && typeof d.interpretation === 'object' && d.interpretation)
      ? d.interpretation : { ops: Array.isArray(d?.ops) ? d.ops : [] },
    seed: d?.seed ?? null,
    interpretRef: typeof d?.interpretRef === 'string' ? d.interpretRef : (typeof d?.promptHash === 'string' ? d.promptHash : null),
    musings: passMusings(d),
    ...commonFields(d),
  };
}

/**
 * S7 AUTONOMY — compose a natural-language run request into a PROPOSED typed
 * StopCondition + acceleration nudges. The edge walls against the client-posted
 * vocabularies; the REAL registry then re-validates here (the domain schema wall is
 * the suspenders), so a condition the local registry rejects arrives as null with the
 * failure surfaced — never silently repaired. Standing campaign instructions ride the
 * request from the campaign record into the compile's per-request suffix.
 * @param {{ intent?: string } & Parameters<typeof buildWriteContext>[0]} [ctx]
 * @returns {Promise<{ ok: boolean, composition?: { stopCondition: object|null, maxWeeks: number,
 *   nudges: Array<object>, unsupported: Array<{requested:string, reason:string}> },
 *   musings?: Array<{text:string}>, error?: string, refusalKind?: string,
 *   refusalClass?: string|null, doors?: string[]|null, byok?: boolean,
 *   creditsRemaining?: number|null, earlyAccess?: boolean }>}
 */
export async function composeAutonomy(ctx = {}) {
  const intent = typeof ctx.intent === 'string' ? ctx.intent.trim() : '';
  if (!intent) return { ok: false, error: 'Describe the run you want first.', refusalKind: 'input' };
  const {
    signalRegistryEntries, NUDGE_TYPES, validateStopCondition, validateNudge,
    clampAutonomousWeeks, instructionsForCompile,
  } = await import('../domain/autonomy/index.js');
  const { anchorLabel, slices } = buildWriteContext({ ...ctx, prompt: intent });
  const settlementIds = (Array.isArray(ctx.savedSettlements) ? ctx.savedSettlements : [])
    .map((s) => ({ id: String(s?.id ?? ''), name: typeof s?.name === 'string' ? s.name : String(s?.id ?? '') }))
    .filter((s) => s.id);
  const vocabulary = {
    signals: signalRegistryEntries().map((e) => ({
      id: e.id, type: e.type, scope: e.scope,
      values: e.values ? [...e.values] : undefined, min: e.min, max: e.max,
    })),
    nudgeTypes: [...NUDGE_TYPES],
    settlementIds,
  };
  const res = await postWrite('surveyor-autonomy', {
    intent, anchorLabel, vocabulary, slices,
    standingInstructions: instructionsForCompile(ctx.activeCampaign || null),
  });
  if (!res.ok) return res;
  const d = res.data;
  const raw = (d && typeof d.composition === 'object' && d.composition) ? d.composition : {};
  const unsupported = (Array.isArray(raw.unsupported) ? raw.unsupported : [])
    .filter((u) => u && typeof u.requested === 'string')
    .map((u) => ({ requested: u.requested, reason: typeof u.reason === 'string' ? u.reason : 'unregistered_signal' }));
  // THE SUSPENDERS: the REAL registry re-validates the composed condition + nudges.
  let stopCondition = (raw.stopCondition && typeof raw.stopCondition === 'object') ? raw.stopCondition : null;
  if (stopCondition) {
    const wall = validateStopCondition(stopCondition);
    if (!wall.ok) {
      stopCondition = null;
      unsupported.push({ requested: 'the composed stop condition', reason: 'failed_local_wall' });
    }
  }
  const settlementIdSet = settlementIds.map((s) => s.id);
  const nudges = [];
  for (const n of (Array.isArray(raw.nudges) ? raw.nudges : [])) {
    if (validateNudge(n, { settlementIds: settlementIdSet }).ok) nudges.push(n);
    else unsupported.push({ requested: String(n?.type ?? '(nudge)'), reason: 'failed_local_wall' });
  }
  return {
    ok: true,
    composition: {
      stopCondition,
      maxWeeks: clampAutonomousWeeks(raw.maxWeeks),
      nudges,
      unsupported,
    },
    musings: passMusings(d),
    ...commonFields(d),
  };
}
