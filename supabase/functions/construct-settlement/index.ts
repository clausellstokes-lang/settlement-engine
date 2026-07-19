/**
 * Supabase Edge Function: construct-settlement — S5 SETTLEMENT CONSTRUCTION
 * (DESIGN_AI_CONTROL_SURFACE §2 stage 5). intent → generator CONFIG + declared CONSTRAINTS
 * ("the config vocabulary IS the op"). It writes NO state — it returns a validated config +
 * constraints; the CLIENT generates deterministically (generateSettlementPipeline), the
 * deterministic comparator (intentComparator.js) judges against the constraints, and the DM
 * revises (bounded, delta-only) then commits via the existing generateSettlement verb.
 *
 * Same spine as custom-content at the BALANCED routing class: bot guard → auth →
 * account_is_active → entitlement → kill-switch('constructSettlement') → governor → credit
 * (feature 'constructSettlement') → BYOK-or-server key → adapter → THE SCHEMA WALL
 * (constructCore) → aiOperationLog → §3f rider. §2b: own kill-switch, early-access register.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { aiIpRateGuard } from '../_shared/rateLimit.ts';
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
  buildConstructPrompt, compileConstruct, constructLogRecord,
} from '../_shared/constructCore.ts';
import type { ConstructVocabulary, ConstructResult, FieldSpec } from '../_shared/constructCore.ts';
import { EVENTS as ANALYTICS_EVENTS, EVENTS_REV as ANALYTICS_EVENTS_REV } from '../_shared/analyticsEventsBundle.js';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
const ANTHROPIC_VERSION = '2023-06-01';
// TOKEN EFFICIENCY (aiTaskConfig constructSettlement): routing 'balanced' → sonnet (a bounded
// config emit; the deterministic pipeline + comparator do the work). Vetoable operator config.
const CONSTRUCT_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_5_MODEL') || 'claude-sonnet-4-5';
const CONSTRUCT_PROVIDER = 'anthropic';
const CONSTRUCT_FEATURE = 'constructSettlement';
const CONSTRUCT_STAGE = 'constructSettlement';
const CONSTRUCT_KIND: 'settlement' = 'settlement';
const CONSTRUCT_TIMEOUT_MS = 75_000;
const CONSTRUCT_SPEND_ESTIMATE_USD = 0.06;
const MAX_BODY_BYTES = 192 * 1024;
const MAX_OUTPUT_TOKENS = 1800;                      // aiTaskConfig constructSettlement.maxTokens
const SLICE_BUDGET = { maxSlices: 6, maxChars: 2500 }; // aiTaskConfig constructSettlement.sliceBudget
const TOKEN_BUDGET = 12000;                          // aiTaskConfig constructSettlement.tokenBudget

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

/** Coerce a client-posted construct vocabulary to the safe shape. */
function coerceVocabulary(raw: unknown): ConstructVocabulary {
  const r = (raw && typeof raw === 'object') ? raw as Record<string, unknown> : {};
  const strArr = (v: unknown) => (Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string' && !!x) : []);
  const fields: Record<string, FieldSpec> = {};
  const rawFields = (r.configFields && typeof r.configFields === 'object') ? r.configFields as Record<string, unknown> : {};
  for (const [k, v] of Object.entries(rawFields)) {
    const s = (v && typeof v === 'object') ? v as Record<string, unknown> : {};
    const type = s.type === 'number' || s.type === 'bool' || s.type === 'string' || s.type === 'enum' ? s.type : 'string';
    fields[k] = {
      type, values: Array.isArray(s.values) ? s.values.filter((x): x is string => typeof x === 'string') : undefined,
      min: typeof s.min === 'number' ? s.min : undefined, max: typeof s.max === 'number' ? s.max : undefined,
      max_len: typeof s.max_len === 'number' ? s.max_len : undefined,
    };
  }
  return { kind: CONSTRUCT_KIND, configFields: fields, constraintDimensions: strArr(r.constraintDimensions), constraintBands: strArr(r.constraintBands) };
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

const anthropicAdapter = registerProviderAdapter({
  id: 'anthropic', retentionClass: ANTHROPIC_RETENTION_CLASS, models: ANTHROPIC_SUPPORTED_MODELS,
  call: ({ model, apiKey, prompt, signal, fetchImpl }) => callAnthropic(apiKey, model, prompt, fetchImpl ?? fetch, signal),
});

export async function handleConstructSettlement(
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

  const guard = botGuard(req, 'construct-settlement');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);

    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);

    // Wave-D per-IP AI burst gate (item 2): FAIL-CLOSED on the cross-instance token
    // bucket (migration 156) — 429 over-limit, 503 on a limiter-infra error, never a
    // silent open. Inert in tests / local (no cf-connecting-ip → sentinel IP → no RPC).
    const ipGate = await aiIpRateGuard(supabaseAdmin, guard.meta.ip, cors);
    if (ipGate) return ipGate;

    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('construct-settlement', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('construct-settlement', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'AI construction is part of the Surveyor plan. You can still generate settlements by hand in the wizard.' }, 403, cors);

    const { data: stageData, error: stageErr } = await supabaseAdmin.rpc('surveyor_stage_enabled', { p_stage: CONSTRUCT_STAGE });
    if (stageErr) logError('construct-settlement', user.id, `surveyor_stage_enabled errored: ${stageErr.message}`, { stage: 'kill-switch' });
    if (!isStageEnabled(stageData)) {
      const refusal = killSwitchRefusal(CONSTRUCT_STAGE);
      return json({ error: refusal.message, refused: true, refusalClass: refusal.refusalClass, doors: refusal.doors, stage: refusal.stage }, 503, cors);
    }

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const intent = typeof body?.intent === 'string' ? body.intent : '';
    if (!intent.trim()) return json({ error: 'Missing construction request' }, 400, cors);
    const anchorLabel = typeof body?.anchorLabel === 'string' ? body.anchorLabel : '';
    const vocab = coerceVocabulary(body?.vocabulary);
    const bundle = buildRetrievalBundle(body?.slices);

    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(intent);

    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, CONSTRUCT_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('construct-settlement', user.id, note, { stage: 'byok' }),
    );

    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedAnswerText = '';
    let capturedResult: ConstructResult = { config: {}, constraints: {}, unsupported: [] };
    let capturedMusings: Array<{ text: string }> = [];
    let capturedRider: EnrichmentRider | null = null;
    let capturedRefused = false;
    let capturedUsage: { input: number | null; output: number | null } = { input: null, output: null };
    let capturedRefusalClass: RefusalClass | null = null;
    let capturedRefusalMessage: string | null = null;
    let capturedRefusalDoors: string[] = [];
    let capturedModelPref: string | null = null;
    let capturedModel = CONSTRUCT_MODEL;
    let capturedWarn = false;
    let capturedOverBudget = false;

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class; capturedRefusalMessage = refusal.message; capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) {
        try {
          await supabaseAdmin.rpc('surveyor_byok_set_health', { p_user: user.id, p_provider: CONSTRUCT_PROVIDER, p_health: health, p_error_class: cls, p_verified: false });
        } catch (e) { logError('construct-settlement', user.id, e, { stage: 'health' }); }
      }
    };

    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', { p_user: user.id, p_provider: CONSTRUCT_PROVIDER, p_feature: CONSTRUCT_FEATURE });
      if (preErr) logError('construct-settlement', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string; model_prefs?: Record<string, unknown> } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: CONSTRUCT_FEATURE, p_audience: 'dm',
            p_prompt_hash: fnv1a32(intent), p_answer_hash: null,
            p_retrieval_slice_ids: [...bundle.ids], p_retrieval_sources: bundle.sources,
            p_model: CONSTRUCT_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: CONSTRUCT_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null,
            p_refused: true, p_spend_id: null, p_meta_probe: metaProbe, p_canary: canary, p_refusal_class: refusal.class,
          });
        } catch (e) { logError('construct-settlement', user.id, e, { stage: 'governor-audit' }); }
        return json({ error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors, governor: { paused: !!pr.paused, breached: pr.breached ?? null } }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = pr?.model_prefs;
      capturedModelPref = mp && typeof mp[CONSTRUCT_FEATURE] === 'string' ? String(mp[CONSTRUCT_FEATURE]) : null;
    } catch (e) { logError('construct-settlement', user.id, e, { stage: 'governor' }); }

    capturedModel = (providerKey.byok && capturedModelPref && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref)) ? capturedModelPref : CONSTRUCT_MODEL;

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: CONSTRUCT_SPEND_ESTIMATE_USD });
        if (error) logError('construct-settlement', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return { allowed: (data as { allowed?: boolean } | null)?.allowed === true, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('construct-settlement', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: CONSTRUCT_FEATURE });
        if (error) { logError('construct-settlement', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildConstructPrompt(intent, vocab, bundle, anchorLabel, canary, SLICE_BUDGET);
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), CONSTRUCT_TIMEOUT_MS);
        let resp: Response;
        try {
          const adapter = routeWorldDataAdapter(anthropicAdapter);
          resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt: capturedPrompt, signal: ac.signal, fetchImpl: providerFetch });
        } catch (fetchErr) {
          await applyProviderError(classifyProviderThrow(fetchErr));
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${CONSTRUCT_TIMEOUT_MS}ms`);
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
        const compiled = compileConstruct(capturedAnswerText, vocab);
        capturedResult = compiled.result;
        capturedMusings = compiled.musings;
        capturedRider = compiled.rider;
        const nonEmpty = Object.keys(capturedResult.config).length > 0 || Object.keys(capturedResult.constraints).length > 0 || capturedMusings.length > 0;
        return { ok: nonEmpty, answerText: capturedAnswerText };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return;
        try { const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason }); if (error) logError('construct-settlement', user.id, error.message, { stage: 'refund', spend_id: spendId }); }
        catch (e) { logError('construct-settlement', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) { if (!id) return; try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); } catch (e) { logError('construct-settlement', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); } },
      async meter(ok) {
        try {
          const inTok = capturedUsage.input ?? estTokens(capturedPrompt);
          const outTok = capturedUsage.output ?? estTokens(capturedAnswerText);
          capturedOverBudget = overTokenBudget(inTok + outTok, TOKEN_BUDGET);
          if (capturedOverBudget) logError('construct-settlement', user.id, `token budget exceeded: ${inTok + outTok} > ${TOKEN_BUDGET}`, { stage: 'budget' });
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 3) + ((outTok / 1_000_000) * 15)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: CONSTRUCT_FEATURE, phase: null, provider: CONSTRUCT_PROVIDER,
            model: capturedModel, model_preference: capturedModelPref, input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: capturedUsage.input == null || capturedUsage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('construct-settlement', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('construct-settlement', user.id, e, { stage: 'metering' }); }
      },
    }, 'construct settlement compile failed');

    try {
      const rec = constructLogRecord({
        prompt: capturedPrompt, bundle, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        answerText: capturedAnswerText, result: capturedResult, metaProbe, canary,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: CONSTRUCT_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: CONSTRUCT_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: rec.config_key_count,
        p_refused: capturedRefused, p_spend_id: capturedSpendId,
        p_meta_probe: rec.meta_probe, p_canary: rec.canary, p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('construct-settlement', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('construct-settlement', user.id, e, { stage: 'audit' }); }

    if (outcome.outcome === 'ok') {
      try {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_ANSWER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            feature: CONSTRUCT_FEATURE, stage: CONSTRUCT_STAGE,
            configKeyCount: Object.keys(capturedResult.config).length, constraintCount: Object.keys(capturedResult.constraints).length,
            unsupportedCount: capturedResult.unsupported.length,
            byok: providerKey.byok, refused: capturedRefused, earlyAccess: true, overBudget: capturedOverBudget,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('construct-settlement', user.id, `construct answer event failed: ${error.message}`, { stage: 'eval' });
      } catch (e) { logError('construct-settlement', user.id, e, { stage: 'eval' }); }
    }
    try {
      if (capturedRider) {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_RIDER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: { feature: CONSTRUCT_FEATURE, intent: capturedRider.intent, themes: capturedRider.themes, refusal_reason: capturedRider.refusalReason, action_drafted: capturedRider.actionDrafted, oov: capturedRider.oov, byok: providerKey.byok, refused: capturedRefused },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('construct-settlement', user.id, `construct rider event failed: ${error.message}`, { stage: 'rider' });
      }
    } catch (e) { logError('construct-settlement', user.id, e, { stage: 'rider' }); }

    switch (outcome.outcome) {
      case 'cap': return json({ error: 'The constructor is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited': return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient': return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({ error: capturedRefused ? 'The constructor declined this request.' : (capturedRefusalMessage || 'Construction failed. Your credits were refunded.'), refused: capturedRefused, refunded: outcome.refunded, refusalClass: capturedRefusalClass, doors: capturedRefusalDoors }, 502, cors);
      case 'ok':
        return json({
          config: capturedResult.config,          // validated generator config (schema-walled)
          constraints: capturedResult.constraints, // the declared intent the comparator judges
          unsupported: capturedResult.unsupported, // honest: config the compiler tried that the wall dropped
          musings: capturedMusings,
          audience: 'dm', byok: providerKey.byok, creditsRemaining: outcome.balance, usageWarning: capturedWarn,
          earlyAccess: true,
        }, 200, cors);
    }
  } catch (e) {
    logError('construct-settlement', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The construct-settlement request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleConstructSettlement(req));
