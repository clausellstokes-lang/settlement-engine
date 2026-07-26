/**
 * Supabase Edge Function: custom-content — THE CUSTOM-CONTENT COMPILER (Surveyor S4,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 4 / DESIGN_CONTENT_PLANE). Natural language →
 * PROPOSED homebrew content entries (institutions / services / resources / stressors /
 * trade goods / factions / deities / traditions), drafted against the account's OWN registry only. It
 * writes NO state — it returns a labelled DRAFT the DM reviews per item and mints through
 * addCustomItem (the existing custom-content verb; no content type = no landing).
 *
 * The CLIENT sends only its manifest version plus retrieval slices. The SERVER owns the
 * generated category/field manifest; posted buckets, fields, or enum values are never
 * trusted. This function runs the SAME spine as interpret-session:
 *   bot guard → JWT auth → account_is_active → has_surveyor_entitlement → THE KILL-SWITCH
 *   (surveyor_stage_enabled('customContent'), fail-closed) → the usage governor → the
 *   credit round-trip (feature 'customContent') → BYOK-or-server key → provider adapter →
 *   THE SCHEMA WALL (customContentCore) → the aiOperationLog audit row → the §3f rider.
 *
 * §2b LAUNCH-WHOLE: ships behind its own kill-switch, instrumented, with an "early access"
 * register until its live metrics mature. SHARED CONSTITUTION (§3) is IMPORTED from the S1
 * analyst core — the constitution binds S4 identically. Handler exported with a DI seam.
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
  buildContentPrompt, compileCustomContent, contentLogRecord, contentDraftSummary,
} from './customContentCore.ts';
import type { ContentDraft } from './customContentCore.ts';
import { CUSTOM_CONTENT_MANIFEST_VERSION } from '../_shared/customContentManifest.generated.ts';
import { EVENTS as ANALYTICS_EVENTS, EVENTS_REV as ANALYTICS_EVENTS_REV } from '../_shared/analyticsEventsBundle.js';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
const ANTHROPIC_VERSION = '2023-06-01';
// TOKEN EFFICIENCY (aiTaskConfig customContent): routing 'balanced' → sonnet (a schema-walled
// structured compile; the deterministic validator/wall does the judging, so opus is reserved
// for a comparator-demanded deep revise, not the default). Vetoable operator config.
const CONTENT_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_5_MODEL') || 'claude-sonnet-4-5';
const CONTENT_PROVIDER = 'anthropic';
const CONTENT_FEATURE = 'customContent';
const CONTENT_STAGE = 'customContent';
const CONTENT_TIMEOUT_MS = 90_000;
const CONTENT_SPEND_ESTIMATE_USD = 0.10;             // a multi-entry content compile
const MAX_BODY_BYTES = 256 * 1024;
const MAX_OUTPUT_TOKENS = 3000;                      // aiTaskConfig customContent.maxTokens (ops, not essays)
const SLICE_BUDGET = { maxSlices: 8, maxChars: 3000 }; // aiTaskConfig customContent.sliceBudget
const TOKEN_BUDGET = 14000;                          // aiTaskConfig customContent.tokenBudget (anomaly flag)

function getCorsHeaders(req?: Request) { return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' }); }
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

/** Read only the compatibility handshake; all vocabulary authority remains server-side. */
function requestedManifestVersion(body: unknown): string | null {
  if (!body || typeof body !== 'object') return null;
  const record = body as Record<string, unknown>;
  const direct = record.manifestVersion;
  const legacyEnvelope = record.vocabulary && typeof record.vocabulary === 'object'
    ? (record.vocabulary as Record<string, unknown>).manifestVersion
    : null;
  const value = direct ?? legacyEnvelope;
  return typeof value === 'string' && value.trim() ? value.trim() : null;
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

/** A coverage band (id-free eval): the sourced-entry rate bucketed so no exact ratio leaks. */
function band(x: number): 'none' | 'low' | 'mid' | 'high' | 'full' {
  if (!(x > 0)) return 'none';
  if (x >= 1) return 'full';
  if (x >= 0.75) return 'high';
  if (x >= 0.4) return 'mid';
  return 'low';
}

export async function handleCustomContent(
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

  const guard = botGuard(req, 'custom-content');
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
    if (activeErr) logError('custom-content', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('custom-content', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'Custom content authoring is part of the Surveyor plan. You can still add homebrew content by hand in the Compendium.' }, 403, cors);

    // THE KILL-SWITCH (§2b): fail-closed — a disabled OR unreachable stage refuses
    // gracefully, naming the switch, and spends nothing.
    const { data: stageData, error: stageErr } = await supabaseAdmin.rpc('surveyor_stage_enabled', { p_stage: CONTENT_STAGE });
    if (stageErr) logError('custom-content', user.id, `surveyor_stage_enabled errored: ${stageErr.message}`, { stage: 'kill-switch' });
    if (!isStageEnabled(stageData)) {
      const refusal = killSwitchRefusal(CONTENT_STAGE);
      return json({ error: refusal.message, refused: true, refusalClass: refusal.refusalClass, doors: refusal.doors, stage: refusal.stage }, 503, cors);
    }

    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const intent = typeof body?.intent === 'string' ? body.intent : '';
    if (!intent.trim()) return json({ error: 'Missing content request' }, 400, cors);
    const anchorLabel = typeof body?.anchorLabel === 'string' ? body.anchorLabel : '';
    const manifestVersion = requestedManifestVersion(body);
    if (manifestVersion && manifestVersion !== CUSTOM_CONTENT_MANIFEST_VERSION) {
      return json({
        error: 'custom_content_manifest_stale',
        expectedManifestVersion: CUSTOM_CONTENT_MANIFEST_VERSION,
      }, 409, cors);
    }
    const clientDescriptor = {
      manifestVersion: manifestVersion || CUSTOM_CONTENT_MANIFEST_VERSION,
    };
    const bundle = buildRetrievalBundle(body?.slices);

    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(intent);

    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, CONTENT_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('custom-content', user.id, note, { stage: 'byok' }),
    );

    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedAnswerText = '';
    let capturedDraft: ContentDraft = { entries: [], unsupported: [] };
    let capturedMusings: Array<{ text: string }> = [];
    let capturedRider: EnrichmentRider | null = null;
    let capturedRefused = false;
    let capturedUsage: { input: number | null; output: number | null } = { input: null, output: null };
    let capturedRefusalClass: RefusalClass | null = null;
    let capturedRefusalMessage: string | null = null;
    let capturedRefusalDoors: string[] = [];
    let capturedModelPref: string | null = null;
    let capturedModel = CONTENT_MODEL;
    let capturedWarn = false;
    let capturedOverBudget = false;                  // §7 token-budget anomaly flag

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class; capturedRefusalMessage = refusal.message; capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) {
        try {
          await supabaseAdmin.rpc('surveyor_byok_set_health', { p_user: user.id, p_provider: CONTENT_PROVIDER, p_health: health, p_error_class: cls, p_verified: false });
        } catch (e) { logError('custom-content', user.id, e, { stage: 'health' }); }
      }
    };

    // USER GOVERNORS: the single edge door (fails open on RPC error; the global cap bounds).
    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', { p_user: user.id, p_provider: CONTENT_PROVIDER, p_feature: CONTENT_FEATURE });
      if (preErr) logError('custom-content', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string; model_prefs?: Record<string, unknown> } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: CONTENT_FEATURE, p_audience: 'dm',
            p_prompt_hash: fnv1a32(intent), p_answer_hash: null,
            p_retrieval_slice_ids: [...bundle.ids], p_retrieval_sources: bundle.sources,
            p_model: CONTENT_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: CONTENT_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null,
            p_refused: true, p_spend_id: null, p_meta_probe: metaProbe, p_canary: canary, p_refusal_class: refusal.class,
          });
        } catch (e) { logError('custom-content', user.id, e, { stage: 'governor-audit' }); }
        return json({ error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors, governor: { paused: !!pr.paused, breached: pr.breached ?? null } }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = pr?.model_prefs;
      capturedModelPref = mp && typeof mp[CONTENT_FEATURE] === 'string' ? String(mp[CONTENT_FEATURE]) : null;
    } catch (e) { logError('custom-content', user.id, e, { stage: 'governor' }); }

    capturedModel = (providerKey.byok && capturedModelPref && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref)) ? capturedModelPref : CONTENT_MODEL;

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: CONTENT_SPEND_ESTIMATE_USD });
        if (error) logError('custom-content', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        return { allowed: (data as { allowed?: boolean } | null)?.allowed === true, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('custom-content', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: CONTENT_FEATURE });
        if (error) { logError('custom-content', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildContentPrompt(intent, clientDescriptor, bundle, anchorLabel, canary, SLICE_BUDGET);
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), CONTENT_TIMEOUT_MS);
        let resp: Response;
        try {
          const adapter = routeWorldDataAdapter(anthropicAdapter);
          resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt: capturedPrompt, signal: ac.signal, fetchImpl: providerFetch });
        } catch (fetchErr) {
          await applyProviderError(classifyProviderThrow(fetchErr));
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${CONTENT_TIMEOUT_MS}ms`);
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
        if (data?.stop_reason === 'refusal') {
          capturedRefused = true;
          return { ok: false, answerText: '' };
        }
        capturedAnswerText = (data?.content?.[0]?.text || '').trim();
        const compiled = compileCustomContent(capturedAnswerText, clientDescriptor);
        capturedDraft = compiled.draft;
        capturedMusings = compiled.musings;
        capturedRider = compiled.rider;
        const nonEmpty = capturedDraft.entries.length > 0 || capturedDraft.unsupported.length > 0 || capturedMusings.length > 0;
        return { ok: nonEmpty, answerText: capturedAnswerText };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return;
        try { const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason }); if (error) logError('custom-content', user.id, error.message, { stage: 'refund', spend_id: spendId }); }
        catch (e) { logError('custom-content', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) { if (!id) return; try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); } catch (e) { logError('custom-content', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); } },
      async meter(ok) {
        try {
          const inTok = capturedUsage.input ?? estTokens(capturedPrompt);
          const outTok = capturedUsage.output ?? estTokens(capturedAnswerText);
          // §7 ANOMALY FLAG: a call past its class token budget is flagged (operator-visible on
          // the answer event); estimates stay labelled estimates (tokens_estimated below).
          capturedOverBudget = overTokenBudget(inTok + outTok, TOKEN_BUDGET);
          if (capturedOverBudget) logError('custom-content', user.id, `token budget exceeded: ${inTok + outTok} > ${TOKEN_BUDGET}`, { stage: 'budget' });
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: CONTENT_FEATURE, phase: null, provider: CONTENT_PROVIDER,
            model: capturedModel, model_preference: capturedModelPref, input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: capturedUsage.input == null || capturedUsage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('custom-content', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('custom-content', user.id, e, { stage: 'metering' }); }
      },
    }, 'custom content compile failed');

    // ── the aiOperationLog audit row (feature 'customContent') ──────────────────────
    try {
      const rec = contentLogRecord({
        prompt: capturedPrompt, bundle, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        answerText: capturedAnswerText, draft: capturedDraft, metaProbe, canary,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: CONTENT_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: CONTENT_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: outcome.outcome === 'ok' ? rec.citation_coverage : null,
        p_claim_count: rec.entry_count,
        p_refused: capturedRefused,
        p_spend_id: capturedSpendId,
        p_meta_probe: rec.meta_probe, p_canary: rec.canary, p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('custom-content', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('custom-content', user.id, e, { stage: 'audit' }); }

    // ── §5 answer eval + §3f rider — ID-FREE, category-grade (feature-discriminated) ─
    if (outcome.outcome === 'ok') {
      const s = contentDraftSummary(capturedDraft);
      const sourced = capturedDraft.entries.filter((e) => e.sourced).length;
      try {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_ANSWER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            feature: CONTENT_FEATURE, stage: CONTENT_STAGE, total: s.total,
            mechanicalCount: s.mechanicalFields, flavorCount: s.flavorFields, unsupportedCount: s.unsupportedCount,
            coverageBand: band(s.total === 0 ? 1 : sourced / s.total),
            byok: providerKey.byok,
            refused: capturedRefused,
            earlyAccess: true,
            overBudget: capturedOverBudget,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('custom-content', user.id, `custom-content answer event failed: ${error.message}`, { stage: 'eval' });
      } catch (e) { logError('custom-content', user.id, e, { stage: 'eval' }); }
    }
    try {
      const rider = capturedRider as EnrichmentRider | null;
      if (rider) {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_STAGE_RIDER,
          actor_id: null, session_id: null, subject_id: null, consent_tier: 'product', events_rev: ANALYTICS_EVENTS_REV,
          props: {
            feature: CONTENT_FEATURE,
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
        if (error) logError('custom-content', user.id, `custom-content rider event failed: ${error.message}`, { stage: 'rider' });
      }
    } catch (e) { logError('custom-content', user.id, e, { stage: 'rider' }); }

    switch (outcome.outcome) {
      case 'cap': return json({ error: 'The content compiler is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited': return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient': return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({
          error: capturedRefused
            ? 'The content compiler declined this request.'
            : (capturedRefusalMessage || 'Compilation failed. Your credits were refunded.'),
          refused: capturedRefused,
          refunded: outcome.refunded,
          refusalClass: capturedRefusalClass,
          doors: capturedRefusalDoors,
        }, 502, cors);
      case 'ok':
        scheduleAutoReload(supabaseAdmin, user.id);
        return json({
          draft: capturedDraft,               // { entries:[labelled, wall-cleaned], unsupported:[] }
          musings: capturedMusings,            // §3b the conversation register (uncited, entry-free)
          summary: contentDraftSummary(capturedDraft),
          manifestVersion: CUSTOM_CONTENT_MANIFEST_VERSION,
          audience: 'dm', byok: providerKey.byok, creditsRemaining: outcome.balance, usageWarning: capturedWarn,
          earlyAccess: true,                   // §2b: honest "early access" until live metrics mature
        }, 200, cors);
    }
  } catch (e) {
    logError('custom-content', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The custom-content request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleCustomContent(req));
