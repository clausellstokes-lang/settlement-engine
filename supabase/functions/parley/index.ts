/**
 * Supabase Edge Function: parley — THE PARLEY (Surveyor S3, DESIGN_AI_CONTROL_SURFACE §2d +
 * THE TOTAL-GROUNDING LAW). In-character consultation, MUSINGS-REGISTER ONLY: the entity
 * speaks so the DM can hear how it would respond — NOTHING commits, no ops, no world writes.
 * DM-only in v1 (the persona knows its own secrets).
 *
 * THE DIFFERENTIATOR IS EPISTEMIC FIDELITY, STRUCTURAL: the CLIENT builds the persona's
 * BELIEF SLICE (personaSlicer.js — belief-scoped read-models, the fogged hegemony read, the
 * reframe stance) and POSTs { question, personaSlice, personaLabel }; this function grounds
 * the persona on it and — via parleyCore, the citation law — enforces that the persona speaks
 * ONLY from its slice (a line reaching outside is scored as a LEAK, never trusted to the
 * prompt). The persona slice is a SUPERSET of the entity's engine-consumer census.
 *
 * The pipeline mirrors interpret-session (and the S1 analyst): bot guard → JWT → active →
 * entitlement → THE KILL-SWITCH (surveyor_stage_enabled('parley'), fail-closed) → the usage
 * governor → the credit round-trip → BYOK-or-server key → provider → compile → the
 * aiOperationLog (feature 'parley') → the §3f rider + the epistemic-fidelity eval. All shared
 * machinery is imported from the S1 analyst core; the constitution binds parley identically.
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
import {
  registerProviderAdapter, routeWorldDataAdapter,
  accountCanary, detectMetaProbe, extractRider, fnv1a32,
  ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS,
} from '../ai-analyst/analystCore.ts';
import type { EnrichmentRider } from '../ai-analyst/analystCore.ts';
import { classifyProviderError, classifyProviderThrow, healthFromClass, refusalForClass } from '../ai-analyst/providerErrors.ts';
import type { RefusalClass, ProviderErrorClass } from '../ai-analyst/providerErrors.ts';
import { isStageEnabled, killSwitchRefusal } from '../_shared/surveyorStage.ts';
import { buildPersonaSlice, buildParleyPrompt, compileParley, parleyLogRecord, groundingParity } from './parleyCore.ts';
import type { PersonaSlice } from './parleyCore.ts';
import { EVENTS as ANALYTICS_EVENTS, EVENTS_REV as ANALYTICS_EVENTS_REV } from '../_shared/analyticsEventsBundle.js';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
const ANTHROPIC_VERSION = '2023-06-01';
const PARLEY_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_OPUS_4_8_MODEL') || 'claude-opus-4-8';
const PARLEY_PROVIDER = 'anthropic';
const PARLEY_FEATURE = 'parley';
const PARLEY_STAGE = 'parley';
const PARLEY_TIMEOUT_MS = 60_000;
const PARLEY_SPEND_ESTIMATE_USD = 0.05;
const MAX_BODY_BYTES = 192 * 1024;                   // the persona slice can be sizeable
const MAX_OUTPUT_TOKENS = 1600;

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}
function band(x: number): 'none' | 'low' | 'mid' | 'high' | 'full' {
  if (!(x > 0)) return 'none'; if (x >= 1) return 'full'; if (x >= 0.75) return 'high'; if (x >= 0.4) return 'mid'; return 'low';
}

function defaultUserClient(authHeader: string) {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, { global: { headers: { Authorization: authHeader } } });
}
function defaultAdminClient() { return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!); }

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

export async function handleParley(
  req: Request,
  deps: { userClient?: (authHeader: string) => ReturnType<typeof createClient>; adminClient?: () => ReturnType<typeof createClient>; anthropicFetch?: typeof fetch } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const providerFetch = deps.anthropicFetch ?? fetch;
  const cors = getCorsHeaders(req);
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405, cors);

  const guard = botGuard(req, 'parley');
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
    if (activeErr) logError('parley', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('parley', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'The parley is part of the Surveyor plan. You can still read a character\'s standings, ties, and beliefs in the dossier.' }, 403, cors);

    // THE KILL-SWITCH (§2b) — fail-closed, before any spend.
    const { data: stageData, error: stageErr } = await supabaseAdmin.rpc('surveyor_stage_enabled', { p_stage: PARLEY_STAGE });
    if (stageErr) logError('parley', user.id, `surveyor_stage_enabled errored: ${stageErr.message}`, { stage: 'kill-switch' });
    if (!isStageEnabled(stageData)) {
      const refusal = killSwitchRefusal(PARLEY_STAGE);
      return json({ error: refusal.message, refused: true, refusalClass: refusal.refusalClass, doors: refusal.doors, stage: refusal.stage }, 503, cors);
    }

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const question = typeof body?.question === 'string' ? body.question : '';
    if (!question.trim()) return json({ error: 'Missing question' }, 400, cors);
    const personaLabel = typeof body?.personaLabel === 'string' ? body.personaLabel : '';
    const slice: PersonaSlice = buildPersonaSlice(body?.personaSlice);

    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(question);
    const providerKey = await resolveProviderKey(supabaseAdmin, user.id, PARLEY_PROVIDER, ANTHROPIC_API_KEY, (note) => logError('parley', user.id, note, { stage: 'byok' }));

    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedAnswerText = '';
    let capturedSpeech: ReturnType<typeof compileParley>['speech'] = [];
    let capturedMusings: Array<{ text: string }> = [];
    let capturedGrounding = 1;
    let capturedLeaked = false;
    let capturedRider: EnrichmentRider | null = null;
    let capturedRefused = false;
    let capturedUsage: { input: number | null; output: number | null } = { input: null, output: null };
    let capturedRefusalClass: RefusalClass | null = null;
    let capturedRefusalMessage: string | null = null;
    let capturedRefusalDoors: string[] = [];
    let capturedModelPref: string | null = null;
    let capturedModel = PARLEY_MODEL;
    let capturedWarn = false;
    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class; capturedRefusalMessage = refusal.message; capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) { try { await supabaseAdmin.rpc('surveyor_byok_set_health', { p_user: user.id, p_provider: PARLEY_PROVIDER, p_health: health, p_error_class: cls, p_verified: false }); } catch (e) { logError('parley', user.id, e, { stage: 'health' }); } }
    };

    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', { p_user: user.id, p_provider: PARLEY_PROVIDER, p_feature: PARLEY_FEATURE });
      if (preErr) logError('parley', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string; model_prefs?: Record<string, unknown> } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: PARLEY_FEATURE, p_audience: 'dm', p_prompt_hash: fnv1a32(question), p_answer_hash: null,
            p_retrieval_slice_ids: [...slice.ids], p_retrieval_sources: [...slice.manifestKeys],
            p_model: PARLEY_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: PARLEY_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null, p_refused: true, p_spend_id: null,
            p_meta_probe: metaProbe, p_canary: canary, p_refusal_class: refusal.class,
          });
        } catch (e) { logError('parley', user.id, e, { stage: 'governor-audit' }); }
        return json({ error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors, governor: { paused: !!pr.paused, breached: pr.breached ?? null } }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = pr?.model_prefs;
      capturedModelPref = mp && typeof mp[PARLEY_FEATURE] === 'string' ? String(mp[PARLEY_FEATURE]) : null;
    } catch (e) { logError('parley', user.id, e, { stage: 'governor' }); }

    capturedModel = (providerKey.byok && capturedModelPref && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref)) ? capturedModelPref : PARLEY_MODEL;

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: PARLEY_SPEND_ESTIMATE_USD });
        if (error) logError('parley', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return { allowed: (data as { allowed?: boolean } | null)?.allowed === true, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('parley', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: PARLEY_FEATURE });
        if (error) { logError('parley', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any; capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildParleyPrompt(question, slice, personaLabel, canary);
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), PARLEY_TIMEOUT_MS);
        let resp: Response;
        try {
          const adapter = routeWorldDataAdapter(anthropicAdapter);
          resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt: capturedPrompt, signal: ac.signal, fetchImpl: providerFetch });
        } catch (fetchErr) {
          await applyProviderError(classifyProviderThrow(fetchErr));
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${PARLEY_TIMEOUT_MS}ms`);
          throw fetchErr;
        } finally { clearTimeout(timer); }
        if (!resp.ok) {
          const bodyText = await resp.text().catch(() => '');
          await applyProviderError(classifyProviderError(resp.status, bodyText.slice(0, 2000)));
          throw new Error(`Anthropic ${resp.status}`);
        }
        const data = await resp.json();
        capturedUsage = { input: typeof data?.usage?.input_tokens === 'number' ? data.usage.input_tokens : null, output: typeof data?.usage?.output_tokens === 'number' ? data.usage.output_tokens : null };
        if (data?.stop_reason === 'refusal') {
          capturedRefused = true;
          return { ok: false, answerText: '' };
        }
        capturedAnswerText = (data?.content?.[0]?.text || '').trim();
        const out = compileParley(capturedAnswerText, slice);
        capturedSpeech = out.speech; capturedMusings = out.musings; capturedRider = out.rider;
        capturedGrounding = out.grounding; capturedLeaked = out.leaked;
        const nonEmpty = capturedSpeech.length > 0 || capturedMusings.length > 0;
        return { ok: nonEmpty, answerText: capturedAnswerText };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return;
        try { const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason }); if (error) logError('parley', user.id, error.message, { stage: 'refund', spend_id: spendId }); }
        catch (e) { logError('parley', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) { if (!id) return; try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); } catch (e) { logError('parley', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); } },
      async meter(ok) {
        try {
          const inTok = capturedUsage.input ?? estTokens(capturedPrompt);
          const outTok = capturedUsage.output ?? estTokens(capturedAnswerText);
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: PARLEY_FEATURE, phase: null, provider: PARLEY_PROVIDER, model: capturedModel, model_preference: capturedModelPref,
            input_tokens: inTok, output_tokens: outTok, tokens_estimated: capturedUsage.input == null || capturedUsage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('parley', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('parley', user.id, e, { stage: 'metering' }); }
      },
    }, 'parley failed');

    // ── the aiOperationLog audit row (feature 'parley') ─────────────────────────────
    try {
      const rec = parleyLogRecord({ prompt: capturedPrompt, slice, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`, answerText: capturedAnswerText, speech: capturedSpeech, metaProbe, canary });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: PARLEY_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: PARLEY_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: outcome.outcome === 'ok' ? rec.citation_coverage : null,
        p_claim_count: rec.claim_count,
        p_refused: capturedRefused,
        p_spend_id: capturedSpendId,
        p_meta_probe: rec.meta_probe, p_canary: rec.canary, p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('parley', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('parley', user.id, e, { stage: 'audit' }); }

    // ── §3f rider + §5 epistemic-fidelity eval — ID-FREE, category-grade ────────────
    if (outcome.outcome === 'ok') {
      try {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_PARLEY_ANSWER, actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            entityClass: slice.entityClass,
            voice: slice.voice,
            groundingCoverageBand: band(capturedGrounding),
            leaked: capturedLeaked,
            byok: providerKey.byok,
            refused: capturedRefused,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('parley', user.id, `parley answer event failed: ${error.message}`, { stage: 'eval' });
      } catch (e) { logError('parley', user.id, e, { stage: 'eval' }); }
    }
    try {
      const rider = capturedRider as EnrichmentRider | null;
      if (rider) {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_PARLEY_RIDER, actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          // the rider tags entity-class + topic (themes) so the atlas learns what tables rehearse
          props: {
            intent: rider.intent,
            themes: rider.themes,
            refusal_reason: rider.refusalReason,
            oov: rider.oov,
            entity_class: slice.entityClass,
            byok: providerKey.byok,
            refused: capturedRefused,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('parley', user.id, `parley rider event failed: ${error.message}`, { stage: 'rider' });
      }
    } catch (e) { logError('parley', user.id, e, { stage: 'rider' }); }

    switch (outcome.outcome) {
      case 'cap': return json({ error: 'The parley is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited': return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient': return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({
          error: capturedRefused
            ? 'The character declined to speak on this.'
            : (capturedRefusalMessage || 'The parley failed. Your credits were refunded.'),
          refused: capturedRefused,
          refunded: outcome.refunded,
          refusalClass: capturedRefusalClass,
          doors: capturedRefusalDoors,
        }, 502, cors);
      case 'ok':
        scheduleAutoReload(supabaseAdmin, user.id);
        return json({
          speech: capturedSpeech,        // the persona's in-character lines, each grounding-cited
          musings: capturedMusings,      // asides FOR THE DM (op-free — nothing commits)
          grounding: capturedGrounding,  // epistemic-fidelity coverage
          leaked: capturedLeaked,        // true iff the persona reached beyond its knowledge
          entityClass: slice.entityClass, voice: slice.voice,
          parity: groundingParity(slice),   // did the persona slice cover the total-grounding manifest?
          audience: 'dm', byok: providerKey.byok, creditsRemaining: outcome.balance, usageWarning: capturedWarn,
        }, 200, cors);
    }
  } catch (e) {
    logError('parley', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The parley request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleParley(req));
