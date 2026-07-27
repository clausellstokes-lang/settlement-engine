/**
 * Supabase Edge Function: style-overhaul — THE AI STYLE-OVERHAUL compiler (Surveyor task #28
 * phase 2 / DESIGN_CONTENT_PLANE §7). The trust-ladder rung between S2 and S3 — the AI's FIRST
 * compile target, where failure is PURELY COSMETIC (the wall guarantees ugly-never-unsafe).
 * Compile context = the settlement DOSSIER + the user's PROMPT + THE DESIGN CORPUS; output =
 * a bounded bespoke STYLE DEFINITION the client validates against THE WALL → preview → accept.
 *
 * Same spine as custom-content, at the FAST routing class (a cosmetic compile): bot guard →
 * auth → account_is_active → has_surveyor_entitlement → kill-switch('styleOverhaul') →
 * governor → credit (feature 'styleOverhaul') → BYOK-or-server key → provider adapter →
 * compile → aiOperationLog → §3f rider (carrying the style-domain LENS ROADMAP RADAR tags).
 * §2b launch-whole: own kill-switch, instrumented, honest early-access register.
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
import { resolveProviderKey } from '../ai-analyst/byok.ts';
import { resolveCapturedModel } from '../ai-analyst/modelResolver.ts';
import {
  buildRetrievalBundle, registerProviderAdapter, routeWorldDataAdapter,
  accountCanary, detectMetaProbe, fnv1a32,
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
import { overTokenBudget } from '../_shared/promptEfficiency.ts';
import {
  buildStylePrompt, compileStyleOverhaul, styleLogRecord,
  styleRepairViolations, mergeStyleCompiled,
} from './styleOverhaulCore.ts';
import type { StyleVocabulary, StyleRiderTags } from './styleOverhaulCore.ts';
import { EVENTS as ANALYTICS_EVENTS, EVENTS_REV as ANALYTICS_EVENTS_REV } from '../_shared/analyticsEventsBundle.js';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
const ANTHROPIC_VERSION = '2023-06-01';
// TOKEN EFFICIENCY (aiTaskConfig styleOverhaul): routing 'fast' → haiku (a cosmetic,
// schema-walled, ugly-never-unsafe compile). Vetoable operator config.
const STYLE_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_HAIKU_4_5_MODEL') || 'claude-haiku-4-5';
const STYLE_PROVIDER = 'anthropic';
const STYLE_FEATURE = 'styleOverhaul';
const STYLE_STAGE = 'styleOverhaul';
const STYLE_TIMEOUT_MS = 60_000;
const STYLE_SPEND_ESTIMATE_USD = 0.02;               // a small cosmetic compile
const MAX_BODY_BYTES = 128 * 1024;
const MAX_OUTPUT_TOKENS = 1500;                      // aiTaskConfig styleOverhaul.maxTokens
const SLICE_BUDGET = { maxSlices: 4, maxChars: 2000 }; // aiTaskConfig styleOverhaul.sliceBudget
const TOKEN_BUDGET = 8000;                           // aiTaskConfig styleOverhaul.tokenBudget

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

/** Coerce a client-posted style vocabulary (the design corpus) to the safe shape. */
function coerceVocabulary(raw: unknown): StyleVocabulary {
  const r = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {};
  const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x) : []);
  const roles = (r.roles && typeof r.roles === 'object') ? r.roles as Record<string, unknown> : {};
  return {
    furniture: strArr(r.furniture), hazardGlyphs: strArr(r.hazardGlyphs), anchorGlyphs: strArr(r.anchorGlyphs),
    contrast: strArr(r.contrast), baseLenses: strArr(r.baseLenses),
    roles: { palette: strArr(roles.palette), district: strArr(roles.district), stroke: strArr(roles.stroke), opacity: strArr(roles.opacity) },
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
const STYLE_TOOL = buildOutputTool(
  'styleOverhaul',
  'Submit one bespoke map style composed only from registered visual roles and values. A style skins the display, never the substance.',
);
const STYLE_TOOL_CHOICE = forceOutputTool(STYLE_TOOL);

async function callAnthropic(apiKey: string, model: string, prompt: string, providerFetch: typeof fetch, signal: AbortSignal, thinkingBudget = 0): Promise<Response> {
  return providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', signal,
    headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: MAX_OUTPUT_TOKENS, tools: [STYLE_TOOL], tool_choice: STYLE_TOOL_CHOICE, ...thinkingClause(thinkingBudget), messages: [{ role: 'user', content: splitForAnthropic(prompt) }] }),
  });
}

const anthropicAdapter = registerProviderAdapter({
  id: 'anthropic', retentionClass: ANTHROPIC_RETENTION_CLASS, models: ANTHROPIC_SUPPORTED_MODELS,
  call: ({ model, apiKey, prompt, signal, fetchImpl, thinkingBudget }) => callAnthropic(apiKey, model, prompt, fetchImpl ?? fetch, signal, thinkingBudget ?? 0),
});

export async function handleStyleOverhaul(
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

  const guard = botGuard(req, 'style-overhaul');
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
    if (activeErr) logError('style-overhaul', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('style-overhaul', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'Bespoke map styles are part of the Surveyor plan. The four base lenses are always free.' }, 403, cors);

    const { data: stageData, error: stageErr } = await supabaseAdmin.rpc('surveyor_stage_enabled', { p_stage: STYLE_STAGE });
    if (stageErr) logError('style-overhaul', user.id, `surveyor_stage_enabled errored: ${stageErr.message}`, { stage: 'kill-switch' });
    if (!isStageEnabled(stageData)) {
      const refusal = killSwitchRefusal(STYLE_STAGE);
      return json({ error: refusal.message, refused: true, refusalClass: refusal.refusalClass, doors: refusal.doors, stage: refusal.stage }, 503, cors);
    }

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const prompt = typeof body?.prompt === 'string' ? body.prompt : '';
    if (!prompt.trim()) return json({ error: 'Missing style request' }, 400, cors);
    const anchorLabel = typeof body?.anchorLabel === 'string' ? body.anchorLabel : '';
    const vocab = coerceVocabulary(body?.vocabulary);
    const bundle = buildRetrievalBundle(body?.slices);

    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(prompt);

    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, STYLE_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('style-overhaul', user.id, note, { stage: 'byok' }),
    );

    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedAnswerText = '';
    let capturedCandidate: Record<string, unknown> = {};
    let capturedTags: StyleRiderTags = { baseLens: 'none', paletteFamily: 'unknown', motifClass: 'unknown' };
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
    let capturedModel = STYLE_MODEL;
    let capturedWarn = false;
    let capturedOverBudget = false;

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class; capturedRefusalMessage = refusal.message; capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) {
        try {
          await supabaseAdmin.rpc('surveyor_byok_set_health', { p_user: user.id, p_provider: STYLE_PROVIDER, p_health: health, p_error_class: cls, p_verified: false });
        } catch (e) { logError('style-overhaul', user.id, e, { stage: 'health' }); }
      }
    };

    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', { p_user: user.id, p_provider: STYLE_PROVIDER, p_feature: STYLE_FEATURE });
      if (preErr) logError('style-overhaul', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string; model_prefs?: Record<string, unknown> } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: STYLE_FEATURE, p_audience: 'dm',
            p_prompt_hash: fnv1a32(prompt), p_answer_hash: null,
            p_retrieval_slice_ids: [...bundle.ids], p_retrieval_sources: bundle.sources,
            p_model: STYLE_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: STYLE_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null,
            p_refused: true, p_spend_id: null, p_meta_probe: metaProbe, p_canary: canary, p_refusal_class: refusal.class,
          });
        } catch (e) { logError('style-overhaul', user.id, e, { stage: 'governor-audit' }); }
        return json({ error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors, governor: { paused: !!pr.paused, breached: pr.breached ?? null } }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = pr?.model_prefs;
      capturedModelPref = mp && typeof mp[STYLE_FEATURE] === 'string' ? String(mp[STYLE_FEATURE]) : null;
    } catch (e) { logError('style-overhaul', user.id, e, { stage: 'governor' }); }

    const resolvedModel = resolveCapturedModel({
      byok: providerKey.byok, modelPref: capturedModelPref, surfaceDefault: STYLE_MODEL,
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
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: STYLE_SPEND_ESTIMATE_USD });
        if (error) logError('style-overhaul', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return { allowed: (data as { allowed?: boolean } | null)?.allowed === true, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('style-overhaul', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: STYLE_FEATURE });
        if (error) { logError('style-overhaul', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildStylePrompt(prompt, vocab, bundle, anchorLabel, canary, SLICE_BUDGET, renderCoachingFor({
          profile: providerKey.probeProfile, probeModel: providerKey.probeModel,
          capturedModel, surface: 'styleOverhaul',
        }));
        /** ONE provider round-trip, exactly as this surface has always made it. The outer
         *  signal is the repair loop's round budget; the inner controller is this
         *  surface's own per-call timeout. Both abort the same fetch, so a round can never
         *  outlive either bound, and with zero repair rounds the outer one is armed at the
         *  same instant as the inner one and changes nothing. */
        const draftOnce = async (roundPrompt: string, outer: AbortSignal) => {
          const ac = new AbortController();
          const timer = setTimeout(() => ac.abort(), STYLE_TIMEOUT_MS);
          const relay = () => ac.abort();
          if (outer.aborted) relay(); else outer.addEventListener('abort', relay, { once: true });
          let resp: Response;
          try {
            const adapter = routeWorldDataAdapter(anthropicAdapter);
            resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt: roundPrompt, signal: ac.signal, fetchImpl: providerFetch, thinkingBudget });
          } catch (fetchErr) {
            await applyProviderError(classifyProviderThrow(fetchErr));
            if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${STYLE_TIMEOUT_MS}ms`);
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
        // prefix, so only the repair tail is new input. This surface's EDGE verdict is
        // structural only (see styleOverhaulCore's L-6 note); the authoritative value
        // wall stays client-side, exactly as before.
        const loop = await runWithRepair({
          basePrompt: capturedPrompt,
          maxRounds: repairRounds,
          roundTimeoutMs: STYLE_TIMEOUT_MS,
          deadline: Date.now() + STYLE_TIMEOUT_MS * (repairRounds + 1),
          usage: repairUsage,
          callModel: (args) => draftOnce(args.prompt, args.signal),
          parse: (text) => compileStyleOverhaul(text, vocab),
          validate: (compiled) => styleRepairViolations(compiled.unsupportedFields),
          merge: ({ accepted, repaired }) => mergeStyleCompiled(accepted, repaired, vocab),
        });
        const compiled = loop.parsed;
        if (!compiled) return { ok: false, answerText: '' };
        capturedAnswerText = loop.answerText;
        capturedCandidate = compiled.candidate;
        capturedTags = compiled.riderTags;
        capturedMusings = compiled.musings;
        capturedRider = compiled.rider;
        const nonEmpty = Object.keys(capturedCandidate).length > 0 || capturedMusings.length > 0;
        return { ok: nonEmpty, answerText: capturedAnswerText };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return;
        try { const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason }); if (error) logError('style-overhaul', user.id, error.message, { stage: 'refund', spend_id: spendId }); }
        catch (e) { logError('style-overhaul', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) { if (!id) return; try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); } catch (e) { logError('style-overhaul', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); } },
      async meter(ok) {
        try {
          // TOKENS ARE SUMMED ACROSS REPAIR ROUNDS (wave L-6); with one round the sum IS
          // the round, so these are the pre-wave numbers exactly.
          const inTok = repairUsage.inputTokens ?? Math.max(repairUsage.promptEstTokens, estTokens(capturedPrompt));
          const outTok = repairUsage.outputTokens ?? Math.max(repairUsage.answerEstTokens, estTokens(capturedAnswerText));
          capturedOverBudget = overTokenBudget(inTok + outTok, TOKEN_BUDGET);
          if (capturedOverBudget) logError('style-overhaul', user.id, `token budget exceeded: ${inTok + outTok} > ${TOKEN_BUDGET}`, { stage: 'budget' });
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 1) + ((outTok / 1_000_000) * 5)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: STYLE_FEATURE, phase: null, provider: STYLE_PROVIDER,
            model: capturedModel, model_preference: capturedModelPref, input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: repairUsage.inputTokens == null || repairUsage.outputTokens == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('style-overhaul', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('style-overhaul', user.id, e, { stage: 'metering' }); }
      },
    }, 'style overhaul compile failed');

    // ── the aiOperationLog audit row (feature 'styleOverhaul') ──────────────────────
    try {
      const rec = styleLogRecord({
        prompt: capturedPrompt, bundle, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        answerText: capturedAnswerText, candidate: capturedCandidate, metaProbe, canary,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: STYLE_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: STYLE_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: rec.field_count,
        p_refused: capturedRefused, p_spend_id: capturedSpendId,
        p_meta_probe: rec.meta_probe, p_canary: rec.canary, p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('style-overhaul', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('style-overhaul', user.id, e, { stage: 'audit' }); }

    // ── §5 answer eval + §3f rider (the LENS ROADMAP RADAR style-domain tags) ────────
    if (outcome.outcome === 'ok') {
      try {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_ANSWER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            feature: STYLE_FEATURE, stage: STYLE_STAGE, fieldCount: Object.keys(capturedCandidate).length,
            baseLens: capturedTags.baseLens, paletteFamily: capturedTags.paletteFamily, motifClass: capturedTags.motifClass,
            byok: providerKey.byok, refused: capturedRefused, earlyAccess: true, overBudget: capturedOverBudget,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('style-overhaul', user.id, `style answer event failed: ${error.message}`, { stage: 'eval' });
      } catch (e) { logError('style-overhaul', user.id, e, { stage: 'eval' }); }
    }
    try {
      const rider = capturedRider as EnrichmentRider | null;
      if (rider) {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_RIDER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            feature: STYLE_FEATURE, intent: rider.intent, themes: rider.themes,
            refusal_reason: rider.refusalReason, action_drafted: rider.actionDrafted, oov: rider.oov,
            baseLens: capturedTags.baseLens, paletteFamily: capturedTags.paletteFamily, motifClass: capturedTags.motifClass,
            byok: providerKey.byok, refused: capturedRefused,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('style-overhaul', user.id, `style rider event failed: ${error.message}`, { stage: 'rider' });
      }
    } catch (e) { logError('style-overhaul', user.id, e, { stage: 'rider' }); }

    switch (outcome.outcome) {
      case 'cap': return json({ error: 'The style composer is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited': return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient': return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({ error: capturedRefused ? 'The style composer declined this request.' : (capturedRefusalMessage || 'Style composition failed. Your credits were refunded.'), refused: capturedRefused, refunded: outcome.refunded, refusalClass: capturedRefusalClass, doors: capturedRefusalDoors }, 502, cors);
      case 'ok':
        scheduleAutoReload(supabaseAdmin, user.id);
        return json({
          style: capturedCandidate,           // the bounded candidate — the CLIENT wall validates before it lands
          styleTags: capturedTags,             // { baseLens, paletteFamily, motifClass } (the lens radar)
          musings: capturedMusings,
          audience: 'dm', byok: providerKey.byok, creditsRemaining: outcome.balance, usageWarning: capturedWarn,
          earlyAccess: true,
        }, 200, cors);
    }
  } catch (e) {
    logError('style-overhaul', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The style-overhaul request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleStyleOverhaul(req));
