/**
 * Supabase Edge Function: surveyor-autonomy — THE AUTONOMY COMPOSER (Surveyor S7,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 7, the MACHINERY-NOW / VOCABULARY-GROWS
 * compromise). Natural language → a PROPOSED typed StopCondition + acceleration nudges,
 * drawn ONLY from the client-posted SIGNAL REGISTRY + stressor vocabularies. It writes
 * NO state and advances NO world — the client re-validates the condition against the
 * real registry (the domain schema wall), the DETERMINISTIC engine runs the bounded
 * advance locally, and every nudge is DM-approved before the registered op dispatches.
 *
 * STANDING CAMPAIGN INSTRUCTIONS ride the request body into the per-request prompt
 * TAIL (fenced as data) — never the byte-stable static prefix, never engine state.
 *
 * Runs the SAME spine as custom-content/interpret-session:
 *   bot guard → JWT auth → account_is_active → has_surveyor_entitlement → THE KILL-SWITCH
 *   (surveyor_stage_enabled('autonomy'), fail-closed) → the usage governor → the credit
 *   round-trip (feature 'autonomy') → BYOK-or-server key → provider adapter → THE SCHEMA
 *   WALL (autonomyCore) → the aiOperationLog audit row → the §3f rider.
 *
 * §2b LAUNCH-WHOLE: ships behind its own kill-switch, instrumented, with an "early
 * access" register until its live metrics mature. Handler exported with a DI seam.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { runCreditedCall } from '../ai-analyst/creditFlow.ts';
import { resolveProviderKey } from '../ai-analyst/byok.ts';
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
import { overTokenBudget } from '../_shared/promptEfficiency.ts';
import {
  coerceAutonomyVocabulary, buildAutonomyPrompt, compileAutonomy,
  autonomyLogRecord, autonomyCompositionSummary,
} from './autonomyCore.ts';
import type { AutonomyComposition } from './autonomyCore.ts';
import { EVENTS as ANALYTICS_EVENTS, EVENTS_REV as ANALYTICS_EVENTS_REV } from '../_shared/analyticsEventsBundle.js';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
const ANTHROPIC_VERSION = '2023-06-01';
// TOKEN EFFICIENCY (aiTaskConfig autonomy): routing 'balanced' → sonnet (a schema-walled
// structured compile; the deterministic client wall + engine do the judging). Vetoable
// operator config — mirrors src/config/aiTaskConfig.js (pinned by its contract test).
const AUTONOMY_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_5_MODEL') || 'claude-sonnet-4-5';
const AUTONOMY_PROVIDER = 'anthropic';
const AUTONOMY_FEATURE = 'autonomy';
const AUTONOMY_STAGE = 'autonomy';
const AUTONOMY_TIMEOUT_MS = 60_000;
const AUTONOMY_SPEND_ESTIMATE_USD = 0.06;              // one bounded structured compose
const MAX_BODY_BYTES = 256 * 1024;
const MAX_OUTPUT_TOKENS = 1500;                        // aiTaskConfig autonomy.maxTokens
const SLICE_BUDGET = { maxSlices: 6, maxChars: 2500 }; // aiTaskConfig autonomy.sliceBudget
const TOKEN_BUDGET = 10000;                            // aiTaskConfig autonomy.tokenBudget

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

function defaultUserClient(authHeader: string) {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
}
function defaultAdminClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

async function callAnthropic(apiKey: string, model: string, prompt: string, providerFetch: typeof fetch, signal: AbortSignal): Promise<Response> {
  return providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST', signal,
    headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: MAX_OUTPUT_TOKENS, messages: [{ role: 'user', content: prompt }] }),
  });
}

// §3e THE FORGETTING LAW (STRUCTURE): world data routes only to a non-training adapter.
const anthropicAdapter = registerProviderAdapter({
  id: 'anthropic', retentionClass: ANTHROPIC_RETENTION_CLASS, models: ANTHROPIC_SUPPORTED_MODELS,
  call: ({ model, apiKey, prompt, signal, fetchImpl }) => callAnthropic(apiKey, model, prompt, fetchImpl ?? fetch, signal),
});

export async function handleSurveyorAutonomy(
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

  const guard = botGuard(req, 'surveyor-autonomy');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);

    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);

    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('surveyor-autonomy', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('surveyor-autonomy', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'Autonomous advances are part of the Surveyor plan. You can still advance the world week by week from the campaign controls.' }, 403, cors);

    // THE KILL-SWITCH (§2b): fail-closed — a disabled OR unreachable stage refuses
    // gracefully, naming the switch, and spends nothing.
    const { data: stageData, error: stageErr } = await supabaseAdmin.rpc('surveyor_stage_enabled', { p_stage: AUTONOMY_STAGE });
    if (stageErr) logError('surveyor-autonomy', user.id, `surveyor_stage_enabled errored: ${stageErr.message}`, { stage: 'kill-switch' });
    if (!isStageEnabled(stageData)) {
      const refusal = killSwitchRefusal(AUTONOMY_STAGE);
      return json({ error: refusal.message, refused: true, refusalClass: refusal.refusalClass, doors: refusal.doors, stage: refusal.stage }, 503, cors);
    }

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const intent = typeof body?.intent === 'string' ? body.intent : '';
    if (!intent.trim()) return json({ error: 'Missing autonomy request' }, 400, cors);
    const anchorLabel = typeof body?.anchorLabel === 'string' ? body.anchorLabel : '';
    const standingInstructions = typeof body?.standingInstructions === 'string' ? body.standingInstructions : '';
    const vocab = coerceAutonomyVocabulary(body?.vocabulary);
    const bundle = buildRetrievalBundle(body?.slices);

    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(intent);

    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, AUTONOMY_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('surveyor-autonomy', user.id, note, { stage: 'byok' }),
    );

    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedAnswerText = '';
    let capturedComposition: AutonomyComposition = { stopCondition: null, maxWeeks: 1, nudges: [], unsupported: [] };
    let capturedMusings: Array<{ text: string }> = [];
    let capturedRider: EnrichmentRider | null = null;
    let capturedRefused = false;
    let capturedUsage: { input: number | null; output: number | null } = { input: null, output: null };
    let capturedRefusalClass: RefusalClass | null = null;
    let capturedRefusalMessage: string | null = null;
    let capturedRefusalDoors: string[] = [];
    let capturedModelPref: string | null = null;
    let capturedModel = AUTONOMY_MODEL;
    let capturedWarn = false;
    let capturedOverBudget = false;                    // §7 token-budget anomaly flag

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class; capturedRefusalMessage = refusal.message; capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) {
        try {
          await supabaseAdmin.rpc('surveyor_byok_set_health', { p_user: user.id, p_provider: AUTONOMY_PROVIDER, p_health: health, p_error_class: cls, p_verified: false });
        } catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'health' }); }
      }
    };

    // USER GOVERNORS: the single edge door (fails open on RPC error; the global cap bounds).
    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', { p_user: user.id, p_provider: AUTONOMY_PROVIDER, p_feature: AUTONOMY_FEATURE });
      if (preErr) logError('surveyor-autonomy', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string; model_prefs?: Record<string, unknown> } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: AUTONOMY_FEATURE, p_audience: 'dm',
            p_prompt_hash: fnv1a32(intent), p_answer_hash: null,
            p_retrieval_slice_ids: [...bundle.ids], p_retrieval_sources: bundle.sources,
            p_model: AUTONOMY_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: AUTONOMY_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null,
            p_refused: true, p_spend_id: null, p_meta_probe: metaProbe, p_canary: canary, p_refusal_class: refusal.class,
          });
        } catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'governor-audit' }); }
        return json({ error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors, governor: { paused: !!pr.paused, breached: pr.breached ?? null } }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = pr?.model_prefs;
      capturedModelPref = mp && typeof mp[AUTONOMY_FEATURE] === 'string' ? String(mp[AUTONOMY_FEATURE]) : null;
    } catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'governor' }); }

    capturedModel = (providerKey.byok && capturedModelPref && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref)) ? capturedModelPref : AUTONOMY_MODEL;

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: AUTONOMY_SPEND_ESTIMATE_USD });
        if (error) logError('surveyor-autonomy', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return { allowed: (data as { allowed?: boolean } | null)?.allowed === true, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('surveyor-autonomy', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: AUTONOMY_FEATURE });
        if (error) { logError('surveyor-autonomy', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildAutonomyPrompt(intent, vocab, bundle, anchorLabel, canary, standingInstructions, SLICE_BUDGET);
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), AUTONOMY_TIMEOUT_MS);
        let resp: Response;
        try {
          const adapter = routeWorldDataAdapter(anthropicAdapter);
          resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt: capturedPrompt, signal: ac.signal, fetchImpl: providerFetch });
        } catch (fetchErr) {
          await applyProviderError(classifyProviderThrow(fetchErr));
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${AUTONOMY_TIMEOUT_MS}ms`);
          throw fetchErr;
        } finally { clearTimeout(timer); }
        if (!resp.ok) {
          const bodyText = await resp.text().catch(() => '');
          await applyProviderError(classifyProviderError(resp.status, bodyText.slice(0, 2000)));
          throw new Error(`Anthropic ${resp.status}`);
        }
        const data = await resp.json();
        capturedUsage = {
          input: typeof data?.usage?.input_tokens === 'number' ? data.usage.input_tokens : null,
          output: typeof data?.usage?.output_tokens === 'number' ? data.usage.output_tokens : null,
        };
        if (data?.stop_reason === 'refusal') { capturedRefused = true; return { ok: false, answerText: '' }; }
        capturedAnswerText = (data?.content?.[0]?.text || '').trim();
        const compiled = compileAutonomy(capturedAnswerText, vocab);
        capturedComposition = compiled.composition;
        capturedMusings = compiled.musings;
        capturedRider = compiled.rider;
        const nonEmpty = !!capturedComposition.stopCondition || capturedComposition.nudges.length > 0
          || capturedComposition.unsupported.length > 0 || capturedMusings.length > 0;
        return { ok: nonEmpty, answerText: capturedAnswerText };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return;
        try { const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason }); if (error) logError('surveyor-autonomy', user.id, error.message, { stage: 'refund', spend_id: spendId }); }
        catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) { if (!id) return; try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); } catch (e) { logError('surveyor-autonomy', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); } },
      async meter(ok) {
        try {
          const inTok = capturedUsage.input ?? estTokens(capturedPrompt);
          const outTok = capturedUsage.output ?? estTokens(capturedAnswerText);
          capturedOverBudget = overTokenBudget(inTok + outTok, TOKEN_BUDGET);
          if (capturedOverBudget) logError('surveyor-autonomy', user.id, `token budget exceeded: ${inTok + outTok} > ${TOKEN_BUDGET}`, { stage: 'budget' });
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: AUTONOMY_FEATURE, phase: null, provider: AUTONOMY_PROVIDER,
            model: capturedModel, model_preference: capturedModelPref, input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: capturedUsage.input == null || capturedUsage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('surveyor-autonomy', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'metering' }); }
      },
    }, 'autonomy compose failed');

    // ── the aiOperationLog audit row (feature 'autonomy') ───────────────────────────
    try {
      const rec = autonomyLogRecord({
        prompt: capturedPrompt, bundle, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        answerText: capturedAnswerText, composition: capturedComposition, metaProbe, canary,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: AUTONOMY_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: AUTONOMY_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: null,
        p_claim_count: rec.op_count, p_refused: capturedRefused, p_spend_id: capturedSpendId,
        p_meta_probe: rec.meta_probe, p_canary: rec.canary, p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('surveyor-autonomy', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'audit' }); }

    // ── §5 answer eval + §3f rider — ID-FREE, category-grade (feature-discriminated) ─
    if (outcome.outcome === 'ok') {
      const s = autonomyCompositionSummary(capturedComposition);
      try {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_ANSWER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            feature: AUTONOMY_FEATURE, stage: AUTONOMY_STAGE, total: s.testCount + s.nudgeCount,
            mechanicalCount: s.testCount, flavorCount: s.nudgeCount, unsupportedCount: s.unsupportedCount,
            coverageBand: s.hasCondition ? 'full' : 'none', byok: providerKey.byok, refused: capturedRefused,
            earlyAccess: true, overBudget: capturedOverBudget,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('surveyor-autonomy', user.id, `autonomy answer event failed: ${error.message}`, { stage: 'eval' });
      } catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'eval' }); }
    }
    try {
      if (capturedRider) {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_RIDER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: { feature: AUTONOMY_FEATURE, intent: capturedRider.intent, themes: capturedRider.themes, refusal_reason: capturedRider.refusalReason, action_drafted: capturedRider.actionDrafted, oov: capturedRider.oov, byok: providerKey.byok, refused: capturedRefused },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('surveyor-autonomy', user.id, `autonomy rider event failed: ${error.message}`, { stage: 'rider' });
      }
    } catch (e) { logError('surveyor-autonomy', user.id, e, { stage: 'rider' }); }

    switch (outcome.outcome) {
      case 'cap': return json({ error: 'The autonomy composer is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited': return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient': return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({ error: capturedRefused ? 'The autonomy composer declined this request.' : (capturedRefusalMessage || 'Composition failed. Your credits were refunded.'), refused: capturedRefused, refunded: outcome.refunded, refusalClass: capturedRefusalClass, doors: capturedRefusalDoors }, 502, cors);
      case 'ok':
        return json({
          composition: capturedComposition,    // { stopCondition (walled) | null, maxWeeks, nudges[], unsupported[] }
          musings: capturedMusings,             // §3b the conversation register
          summary: autonomyCompositionSummary(capturedComposition),
          audience: 'dm', byok: providerKey.byok, creditsRemaining: outcome.balance, usageWarning: capturedWarn,
          earlyAccess: true,                    // §2b: honest "early access" until live metrics mature
        }, 200, cors);
    }
  } catch (e) {
    logError('surveyor-autonomy', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The autonomy request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleSurveyorAutonomy(req));
