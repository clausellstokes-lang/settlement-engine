/**
 * Supabase Edge Function: interpret-session — THE INTENT COMPILER (Surveyor S3,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 3). The first WRITE-path AI ship, "narrow by
 * design": session text → PROPOSED canon events + party impacts ONLY. It writes NO world
 * state itself — it returns a labelled, protection-flagged INTERPRETATION the DM reviews
 * per item and mints as proposals through the EXISTING proposal/approval machinery.
 *
 * The CLIENT builds the op VOCABULARY (the tool schema, from the 40-type canon-event
 * registry + the 12 party-impact kinds), the protected CONTEXT (authored/locked ids +
 * canon phase), and the retrieval SLICES (current world), then POSTs
 * { sessionText, anchorLabel, vocabulary, protectedContext, slices }. This function:
 *   bot guard → JWT auth → account_is_active → has_surveyor_entitlement → THE KILL-SWITCH
 *   (surveyor_stage_enabled('interpret'), fail-closed) → the usage governor → the credit
 *   round-trip (creditFlow.ts, shared with the analyst) → BYOK-or-server key (byok.ts,
 *   never logged) → provider adapter → THE SCHEMA WALL (interpretCore: the model may emit
 *   ONLY registered op types; an unregistered request is surfaced honestly as unsupported)
 *   → the aiOperationLog audit row (feature 'interpret') → the §3f enrichment rider.
 *
 * SHARED CONSTITUTION (§3): the two-voices split, §3c extraction defense (canary +
 * meta-probe), §3e provider-adapter retention contract, §3f rider, and fnv1a audit hashing
 * are IMPORTED from the S1 analyst core — the constitution binds interpret identically to
 * S1. Handler exported with a DI seam so the money/auth/kill-switch path is testable.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { scheduleAutoReload } from '../_shared/autoReload.ts';
import { aiIpRateGuard } from '../_shared/rateLimit.ts';
import { runCreditedCall } from '../ai-analyst/creditFlow.ts';
import { resolveProviderKey, isVaultUnavailable } from '../ai-analyst/byok.ts';
import { resolveCapturedModel } from '../ai-analyst/modelResolver.ts';
import {
  buildRetrievalBundle, registerProviderAdapter, routeWorldDataAdapter,
  accountCanary, detectMetaProbe, extractRider, fnv1a32,
  ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS,
} from '../ai-analyst/analystCore.ts';
import type { EnrichmentRider } from '../ai-analyst/analystCore.ts';
import {
  classifyProviderError, classifyProviderThrow, healthFromClass, refusalForClass,
} from '../ai-analyst/providerErrors.ts';
import type { RefusalClass, ProviderErrorClass } from '../ai-analyst/providerErrors.ts';
import { isStageEnabled, killSwitchRefusal } from '../_shared/surveyorStage.ts';
import { splitForAnthropic } from '../_shared/anthropicCache.ts';
// THE CONSTRAINED-OUTPUT SEAM (wave L-WIRE): the surface's output schema rides the request
// as a forced tool, so an unregistered value stops being something the model emits and the
// wall rejects. The free-text parse stays as the fallback.
import {
  answerTextFromResponse, buildOutputTool, forceOutputTool, thinkingClause,
} from '../_shared/aiOutputTool.ts';
import { newRepairUsage, repairRoundsForTierClass, runWithRepair } from '../_shared/repairLoop.ts';
import { thinkingBudgetForTierClass } from '../ai-analyst/modelResolver.ts';
// THE COACHING BLOCK (wave L-WIRE): the exam's own verdicts, rendered as frozen house
// sentences and shown to the model that sat the exam. Empty for a managed key, an unprobed
// key, or a clean sweep, and the profile arrives on the SAME RPC that decrypted the key.
import { renderCoachingFor } from '../_shared/modelCoaching.ts';
import {
  buildInterpretPrompt, compileInterpretation, interpretationLogRecord, interpretationSummary,
  interpretRepairViolations, mergeInterpretCompiled,
} from './interpretCore.ts';
import type { OpVocabulary, ProtectedContext, Interpretation } from './interpretCore.ts';
import { EVENTS as ANALYTICS_EVENTS, EVENTS_REV as ANALYTICS_EVENTS_REV } from '../_shared/analyticsEventsBundle.js';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
const ANTHROPIC_VERSION = '2023-06-01';
const INTERPRET_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_OPUS_4_8_MODEL') || 'claude-opus-4-8';
const INTERPRET_PROVIDER = 'anthropic';
const INTERPRET_FEATURE = 'interpret';
const INTERPRET_STAGE = 'interpret';
const INTERPRET_TIMEOUT_MS = 90_000;                 // a compile reads a long session account
const INTERPRET_SPEND_ESTIMATE_USD = 0.08;           // conservative Opus worst-case reservation
const MAX_BODY_BYTES = 256 * 1024;                   // session text + vocabulary + grounding
const MAX_OUTPUT_TOKENS = 2400;                      // a structured multi-op interpretation

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

/** Coerce a client-posted op vocabulary to the safe OpVocabulary shape (arrays of strings). */
function coerceVocabulary(raw: unknown): OpVocabulary {
  const r = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {};
  const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x) : []);
  return {
    canonEventTypes: strArr(r.canonEventTypes),
    partyImpactKinds: strArr(r.partyImpactKinds),
    identityEventTypes: strArr(r.identityEventTypes),
    identityPartyKinds: strArr(r.identityPartyKinds),
  };
}
function coerceProtectedContext(raw: unknown): ProtectedContext {
  const r = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {};
  return {
    protectedTargets: Array.isArray(r.protectedTargets) ? r.protectedTargets.filter((x): x is string => typeof x === 'string') : [],
    identityLockedPhase: r.identityLockedPhase === true,
  };
}

function defaultUserClient(authHeader: string) {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
}
function defaultAdminClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

/** The forced output tool (wave L-WIRE). Built ONCE at module scope, because the schema is
 *  byte-stable and the tools array is the first thing in the provider's cacheable prefix:
 *  rebuilding it per request would cost nothing in tokens and everything in cache hits. */
const INTERPRET_TOOL = buildOutputTool(
  'interpret',
  'Submit the operations compiled from the session account, drawn only from the registered op vocabulary, plus anything the engine has no primitive for.',
);
const INTERPRET_TOOL_CHOICE = forceOutputTool(INTERPRET_TOOL);

async function callAnthropic(apiKey: string, model: string, prompt: string, providerFetch: typeof fetch, signal: AbortSignal, thinkingBudget = 0): Promise<Response> {
  return providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', signal,
    headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: MAX_OUTPUT_TOKENS, tools: [INTERPRET_TOOL], tool_choice: INTERPRET_TOOL_CHOICE, ...thinkingClause(thinkingBudget), messages: [{ role: 'user', content: splitForAnthropic(prompt) }] }),
  });
}

// §3e THE FORGETTING LAW (STRUCTURE): world data routes only to a non-training adapter.
const anthropicAdapter = registerProviderAdapter({
  id: 'anthropic', retentionClass: ANTHROPIC_RETENTION_CLASS, models: ANTHROPIC_SUPPORTED_MODELS,
  call: ({ model, apiKey, prompt, signal, fetchImpl, thinkingBudget }) => callAnthropic(apiKey, model, prompt, fetchImpl ?? fetch, signal, thinkingBudget ?? 0),
});

/** A coverage band (id-free eval): the sourced-op rate bucketed so no exact ratio leaks. */
function band(x: number): 'none' | 'low' | 'mid' | 'high' | 'full' {
  if (!(x > 0)) return 'none';
  if (x >= 1) return 'full';
  if (x >= 0.75) return 'high';
  if (x >= 0.4) return 'mid';
  return 'low';
}

export async function handleInterpretSession(
  req: Request,
  deps: {
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
    anthropicFetch?: typeof fetch;
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const providerFetch = deps.anthropicFetch ?? fetch;
  const cors = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  const guard = botGuard(req, 'interpret-session');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);

    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);
    // SINGLE-SESSION GATE (§7.2, M-9 census upgrade): instant 401 eviction where AI money
    // burns — a superseded device is rejected at the request layer, before any spend.
    if (await isSessionSuperseded(supabaseAdmin, user.id, authHeader, deviceLabelFromRequest(req))) {
      return json({ error: 'session_superseded' }, 401, cors);
    }

    // Wave-D per-IP AI burst gate (item 2): FAIL-CLOSED on the cross-instance token
    // bucket (migration 156) — 429 over-limit, 503 on a limiter-infra error, never a
    // silent open. Inert in tests / local (no cf-connecting-ip → sentinel IP → no RPC).
    const ipGate = await aiIpRateGuard(supabaseAdmin, guard.meta.ip, cors);
    if (ipGate) return ipGate;

    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('interpret-session', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('interpret-session', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'Session interpretation is part of the Surveyor plan. You can still record events and party impacts by hand in the dossier and World Pulse.' }, 403, cors);

    // THE KILL-SWITCH (§2b): fail-closed — a disabled OR unreachable stage refuses
    // gracefully, naming the switch, and spends nothing. Mirrors the entitlement gate's
    // fail-closed posture (an RPC error reads as not-enabled).
    const { data: stageData, error: stageErr } = await supabaseAdmin.rpc('surveyor_stage_enabled', { p_stage: INTERPRET_STAGE });
    if (stageErr) logError('interpret-session', user.id, `surveyor_stage_enabled errored: ${stageErr.message}`, { stage: 'kill-switch' });
    if (!isStageEnabled(stageData)) {
      const refusal = killSwitchRefusal(INTERPRET_STAGE);
      return json({ error: refusal.message, refused: true, refusalClass: refusal.refusalClass, doors: refusal.doors, stage: refusal.stage }, 503, cors);
    }

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const sessionText = typeof body?.sessionText === 'string' ? body.sessionText : '';
    if (!sessionText.trim()) return json({ error: 'Missing session text' }, 400, cors);
    const anchorLabel = typeof body?.anchorLabel === 'string' ? body.anchorLabel : '';
    const vocab = coerceVocabulary(body?.vocabulary);
    const protectedCtx = coerceProtectedContext(body?.protectedContext);
    const bundle = buildRetrievalBundle(body?.slices);   // DM grounding (interpret is DM-only)

    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(sessionText);

    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, INTERPRET_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('interpret-session', user.id, note, { stage: 'byok' }),
      supabaseUser,
    );
    // FAIL CLOSED (owner ruling 2026-07-30): a vault error for a user who HAS (or may
    // have) a key of their own is a typed, retryable refusal — never a silent hop onto the
    // house key. This returns BEFORE the credit flow is constructed, so no reservation is
    // taken, no spend happens, and there is nothing to release or refund.
    if (isVaultUnavailable(providerKey)) {
      return json({ error: providerKey.message, code: providerKey.code, retryable: providerKey.retryable }, providerKey.status, cors);
    }

    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedAnswerText = '';
    let capturedInterp: Interpretation = { ops: [], unsupported: [] };
    let capturedMusings: Array<{ text: string }> = [];
    let capturedRider: EnrichmentRider | null = null;
    let capturedRefused = false;
    // THE PER-CALL TOKEN LEDGER (wave L-6). Owned here, mutated by the repair loop, so a
    // provider error on a later round cannot erase an earlier round's tokens from the
    // COGS row below. With zero repair rounds it holds exactly one round's numbers.
    const repairUsage = newRepairUsage();
    let capturedRefusalClass: RefusalClass | null = null;
    let capturedRefusalMessage: string | null = null;
    let capturedRefusalDoors: string[] = [];
    let capturedModelPref: string | null = null;
    let capturedModel = INTERPRET_MODEL;
    let capturedWarn = false;

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class; capturedRefusalMessage = refusal.message; capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) {
        try {
          await supabaseAdmin.rpc('surveyor_byok_set_health', { p_user: user.id, p_provider: INTERPRET_PROVIDER, p_health: health, p_error_class: cls, p_verified: false });
        } catch (e) { logError('interpret-session', user.id, e, { stage: 'health' }); }
      }
    };

    // ── USER GOVERNORS: the single edge door (fails open on RPC error; the global cap
    //    still bounds total spend). Over-cap / paused ⇒ a §3d graceful refusal, no spend.
    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', { p_user: user.id, p_provider: INTERPRET_PROVIDER, p_feature: INTERPRET_FEATURE });
      if (preErr) logError('interpret-session', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string; model_prefs?: Record<string, unknown> } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: INTERPRET_FEATURE, p_audience: 'dm',
            p_prompt_hash: fnv1a32(sessionText), p_answer_hash: null,
            p_retrieval_slice_ids: [...bundle.ids], p_retrieval_sources: bundle.sources,
            p_model: INTERPRET_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: INTERPRET_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null,
            p_refused: true, p_spend_id: null, p_meta_probe: metaProbe, p_canary: canary, p_refusal_class: refusal.class,
          });
        } catch (e) { logError('interpret-session', user.id, e, { stage: 'governor-audit' }); }
        return json({ error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors, governor: { paused: !!pr.paused, breached: pr.breached ?? null } }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = pr?.model_prefs;
      capturedModelPref = mp && typeof mp[INTERPRET_FEATURE] === 'string' ? String(mp[INTERPRET_FEATURE]) : null;
    } catch (e) { logError('interpret-session', user.id, e, { stage: 'governor' }); }

    const resolvedModel = resolveCapturedModel({
      byok: providerKey.byok, modelPref: capturedModelPref, surfaceDefault: INTERPRET_MODEL,
    });
    capturedModel = resolvedModel.model;
    // THE TIER DIAL (wave L-6): how many validator-fed repair rounds this rung may spend
    // inside the single credited call. Every rung is 0 today, so this is exactly one call.
    const repairRounds = repairRoundsForTierClass(resolvedModel.tierClass);
    // THE SECOND TIER DIAL (wave L-WIRE): the rung's deliberation room. Every rung is 0
    // today, and at 0 thinkingClause contributes NO key, so the request body is
    // byte-identical to the pre-L-WIRE one.
    const thinkingBudget = thinkingBudgetForTierClass(resolvedModel.tierClass);

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: INTERPRET_SPEND_ESTIMATE_USD });
        if (error) logError('interpret-session', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return { allowed: (data as { allowed?: boolean } | null)?.allowed === true, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('interpret-session', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: INTERPRET_FEATURE });
        if (error) { logError('interpret-session', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildInterpretPrompt(sessionText, vocab, bundle, anchorLabel, canary, renderCoachingFor({
          profile: providerKey.probeProfile, probeModel: providerKey.probeModel,
          capturedModel, surface: 'interpret',
        }));
        /** ONE provider round-trip, exactly as this surface has always made it. The outer
         *  signal is the repair loop's round budget; the inner controller is this
         *  surface's own per-call timeout. Both abort the same fetch, so a round can never
         *  outlive either bound, and with zero repair rounds the outer one is armed at the
         *  same instant as the inner one and changes nothing. */
        const draftOnce = async (prompt: string, outer: AbortSignal) => {
          const ac = new AbortController();
          const timer = setTimeout(() => ac.abort(), INTERPRET_TIMEOUT_MS);
          const relay = () => ac.abort();
          if (outer.aborted) relay(); else outer.addEventListener('abort', relay, { once: true });
          let resp: Response;
          try {
            const adapter = routeWorldDataAdapter(anthropicAdapter);
            resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt, signal: ac.signal, fetchImpl: providerFetch, thinkingBudget });
          } catch (fetchErr) {
            await applyProviderError(classifyProviderThrow(fetchErr));
            if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${INTERPRET_TIMEOUT_MS}ms`);
            throw fetchErr;
          } finally { clearTimeout(timer); outer.removeEventListener('abort', relay); }
          if (!resp.ok) {
            const bodyText = await resp.text().catch(() => '');
            await applyProviderError(classifyProviderError(resp.status, bodyText.slice(0, 2000)));
            throw new Error(`Anthropic ${resp.status}`);
          }
          const data = await resp.json();
          const usage = {
            input: typeof data?.usage?.input_tokens === 'number' ? data.usage.input_tokens : null,
            output: typeof data?.usage?.output_tokens === 'number' ? data.usage.output_tokens : null,
          };
          // A provider REFUSAL is not a validation failure: the model declined, and
          // re-prompting it would be both rude and paid. Halt the loop, keep the shape.
          if (data?.stop_reason === 'refusal') { capturedRefused = true; return { answerText: '', halt: true, usage }; }
          // WAVE L-WIRE: the forced tool's input IS the answer, re-serialized so the core's
          // existing parse consumes it unchanged. With no tool_use block this reduces to
          // the pre-L-WIRE expression verbatim, so an unsupporting model degrades exactly
          // as it did before rather than to an empty answer.
          return { answerText: answerTextFromResponse(data).trim(), usage };
        };

        // THE FORMATIVE LOOP (wave L-6) — INSIDE this one credited call. Reserve, spend,
        // refund and release are untouched: the loop only decides how many provider
        // round-trips the single call is worth, and every round reuses the sealed cache
        // prefix, so only the repair tail is new input.
        const loop = await runWithRepair({
          basePrompt: capturedPrompt,
          maxRounds: repairRounds,
          roundTimeoutMs: INTERPRET_TIMEOUT_MS,
          deadline: Date.now() + INTERPRET_TIMEOUT_MS * (repairRounds + 1),
          usage: repairUsage,
          callModel: ({ prompt, signal }) => draftOnce(prompt, signal),
          parse: (text) => compileInterpretation(text, vocab, protectedCtx),
          validate: (compiled) => interpretRepairViolations(compiled.interpretation),
          merge: ({ accepted, repaired }) => mergeInterpretCompiled(accepted, repaired),
        });
        const compiled = loop.parsed;
        if (!compiled) return { ok: false, answerText: '' };
        capturedAnswerText = loop.answerText;
        capturedInterp = compiled.interpretation;
        capturedMusings = compiled.musings;
        capturedRider = compiled.rider;
        // A valid non-empty turn = any op, any honestly-unsupported note, or any musing
        // (a clarifying question back to the DM is a legitimate read-only reply).
        const nonEmpty = capturedInterp.ops.length > 0 || capturedInterp.unsupported.length > 0 || capturedMusings.length > 0;
        return { ok: nonEmpty, answerText: capturedAnswerText };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return;
        try { const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason }); if (error) logError('interpret-session', user.id, error.message, { stage: 'refund', spend_id: spendId }); }
        catch (e) { logError('interpret-session', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) { if (!id) return; try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); } catch (e) { logError('interpret-session', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); } },
      async meter(ok) {
        try {
          // TOKENS ARE SUMMED ACROSS REPAIR ROUNDS (wave L-6); with one round the sum IS
          // the round, so these are the pre-wave numbers exactly.
          const inTok = repairUsage.inputTokens ?? Math.max(repairUsage.promptEstTokens, estTokens(capturedPrompt));
          const outTok = repairUsage.outputTokens ?? Math.max(repairUsage.answerEstTokens, estTokens(capturedAnswerText));
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: INTERPRET_FEATURE, phase: null, provider: INTERPRET_PROVIDER,
            model: capturedModel, model_preference: capturedModelPref, input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: repairUsage.inputTokens == null || repairUsage.outputTokens == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('interpret-session', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('interpret-session', user.id, e, { stage: 'metering' }); }
      },
    }, 'interpret compile failed');

    // ── the aiOperationLog audit row (feature 'interpret') ──────────────────────────
    try {
      const rec = interpretationLogRecord({
        prompt: capturedPrompt, bundle, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        answerText: capturedAnswerText, interpretation: capturedInterp, metaProbe, canary,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: INTERPRET_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: INTERPRET_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: outcome.outcome === 'ok' ? rec.citation_coverage : null,
        p_claim_count: rec.op_count,
        p_refused: capturedRefused,
        p_spend_id: capturedSpendId,
        p_meta_probe: rec.meta_probe, p_canary: rec.canary, p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('interpret-session', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('interpret-session', user.id, e, { stage: 'audit' }); }

    // ── §3f THE ENRICHMENT RIDER + §5 answer eval — ID-FREE, category-grade ─────────
    if (outcome.outcome === 'ok') {
      const s = interpretationSummary(capturedInterp);
      const sourced = capturedInterp.ops.filter((o) => o.sourced).length;
      try {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_INTERPRET_ANSWER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            opCount: s.total, requiredCount: s.byLabel.required, inferredCount: s.byLabel.inferred,
            optionalCount: s.byLabel.optional, uncertainCount: s.byLabel.uncertain,
            protectedCount: s.protectedCount, unsupportedCount: s.unsupportedCount,
            coverageBand: band(s.total === 0 ? 1 : sourced / s.total),
            byok: providerKey.byok,
            refused: capturedRefused,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('interpret-session', user.id, `interpret answer event failed: ${error.message}`, { stage: 'eval' });
      } catch (e) { logError('interpret-session', user.id, e, { stage: 'eval' }); }
    }
    try {
      const rider = capturedRider as EnrichmentRider | null;
      if (rider) {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_INTERPRET_RIDER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            intent: rider.intent,
            themes: rider.themes,
            refusal_reason: rider.refusalReason,
            action_drafted: rider.actionDrafted,
            oov: rider.oov,
            byok: providerKey.byok,
            refused: capturedRefused,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('interpret-session', user.id, `interpret rider event failed: ${error.message}`, { stage: 'rider' });
      }
    } catch (e) { logError('interpret-session', user.id, e, { stage: 'rider' }); }

    switch (outcome.outcome) {
      case 'cap': return json({ error: 'The interpreter is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited': return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient': return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({
          error: capturedRefused
            ? 'The interpreter declined this request.'
            : (capturedRefusalMessage || 'Interpretation failed. Your credits were refunded.'),
          refused: capturedRefused,
          refunded: outcome.refunded,
          refusalClass: capturedRefusalClass,
          doors: capturedRefusalDoors,
        }, 502, cors);
      case 'ok':
        scheduleAutoReload(supabaseAdmin, user.id);
        return json({
          interpretation: capturedInterp,     // { ops:[labelled, protection-flagged], unsupported:[] }
          musings: capturedMusings,           // §3b the conversation register (uncited, op-free)
          summary: interpretationSummary(capturedInterp),
          audience: 'dm', byok: providerKey.byok, creditsRemaining: outcome.balance, usageWarning: capturedWarn,
        }, 200, cors);
    }
  } catch (e) {
    logError('interpret-session', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The interpret request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleInterpretSession(req));
