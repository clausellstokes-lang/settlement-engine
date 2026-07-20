/**
 * Supabase Edge Function: interview — THE INTERVIEW (V-1, VISION WAVE). READ-ONLY:
 * it writes NO world state.
 *
 * The DM's mid-session question answered from STATE WITH RECEIPTS. The CLIENT builds the
 * audience-appropriate retrieval bundle (selectSlices — the same entity-resolved brief
 * slices the analyst grounds on) and POSTs { question, audience, slices }. This function
 * rides the EXACT guard stack of the 8 existing AI surfaces:
 *
 *   bot guard → JWT auth → single-session gate (instant 401 eviction) → per-IP AI burst
 *   gate → account_is_active → has_surveyor_entitlement (the Surveyor door) → usage
 *   governor precheck → the credit round-trip (reserve → rateLimit → spend → callModel →
 *   refund/release → meter, ai-analyst/creditFlow.ts) → BYOK-or-server key (never logged)
 *   → provider adapter (Anthropic first, non-training retention class) → SERVER-SIDE
 *   CITATION RESOLUTION (interviewCore: a ref not in the bundle is dropped; the kind is
 *   derived from the resolved slice) → the aiOperationLog audit row.
 *
 * The Interview is metered under the EXISTING 'analysis' billable feature — it is an
 * analysis-class read, and minting a distinct billable feature would require an
 * owner-gated migration to spend_credits' feature CASE. (A dedicated 'interview' feature
 * is a documented follow-on.) The census pins count this as the 9th request-gated,
 * spend_credits-belted AI surface.
 *
 * Same trust boundary as ai-analyst / generate-narrative: the browser never holds the
 * provider key. Handler exported with a DI seam so the money/auth path is Deno-testable.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { isSessionSuperseded, deviceLabelFromRequest } from '../_shared/sessionGate.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { maybeAutoReload } from '../_shared/autoReload.ts';
import { aiIpRateGuard } from '../_shared/rateLimit.ts';
import { runCreditedCall } from '../ai-analyst/creditFlow.ts';
import { resolveProviderKey } from '../ai-analyst/byok.ts';
import {
  registerProviderAdapter, routeWorldDataAdapter,
  ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS,
} from '../ai-analyst/analystCore.ts';
import {
  classifyProviderError, classifyProviderThrow, healthFromClass, refusalForClass,
} from '../ai-analyst/providerErrors.ts';
import type { RefusalClass, ProviderErrorClass } from '../ai-analyst/providerErrors.ts';
import {
  buildRetrievalBundle, bundleIsPlayerSafe, buildInterviewPrompt,
  parseInterviewAnswer, resolveInterview, interviewLogRecord,
  accountCanary, detectMetaProbe, fnv1a32,
} from './interviewCore.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
const ANTHROPIC_VERSION = '2023-06-01';
const INTERVIEW_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_OPUS_4_8_MODEL') || 'claude-opus-4-8';
const INTERVIEW_PROVIDER = 'anthropic';
// Metered under the analyst feature (see header): an analysis-class read answer.
const INTERVIEW_FEATURE = 'analysis';
const INTERVIEW_TIMEOUT_MS = 60_000;
const INTERVIEW_SPEND_ESTIMATE_USD = 0.05;
const MAX_BODY_BYTES = 128 * 1024;
const MAX_OUTPUT_TOKENS = 1400;

function getCorsHeaders(req?: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}
function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
}
function defaultAdminClient() {
  return createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
}

/** The Anthropic provider adapter (§3e non-training retention class). */
async function callAnthropic(
  apiKey: string, model: string, prompt: string, providerFetch: typeof fetch, signal: AbortSignal,
): Promise<Response> {
  return providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: { 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION, 'content-type': 'application/json' },
    body: JSON.stringify({ model, max_tokens: MAX_OUTPUT_TOKENS, messages: [{ role: 'user', content: prompt }] }),
  });
}

const anthropicAdapter = registerProviderAdapter({
  id: 'anthropic',
  retentionClass: ANTHROPIC_RETENTION_CLASS,
  models: ANTHROPIC_SUPPORTED_MODELS,
  call: ({ model, apiKey, prompt, signal, fetchImpl }) => callAnthropic(apiKey, model, prompt, fetchImpl ?? fetch, signal),
});

export async function handleInterview(
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

  const guard = botGuard(req, 'interview');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);

    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);

    // SINGLE-SESSION GATE (§7.2): instant 401 eviction before any spend.
    if (await isSessionSuperseded(supabaseAdmin, user.id, authHeader, deviceLabelFromRequest(req))) {
      return json({ error: 'session_superseded' }, 401, cors);
    }

    // Per-IP AI burst gate (fail-closed; inert in tests / local).
    const ipGate = await aiIpRateGuard(supabaseAdmin, guard.meta.ip, cors);
    if (ipGate) return ipGate;

    // Trust-boundary gate: banned/disabled/soft-deleted accounts (fail closed on !== true).
    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('interview', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    // THE SURVEYOR DOOR: the AI control surface requires an active Surveyor entitlement.
    // The sim never reads tier; this gates the interface only. Fail closed on !== true.
    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('interview', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'The Interview is part of the Surveyor plan. You can still open the World Pulse and map panels — they read the same standings, factions, and rumors.' }, 403, cors);

    // Body: the client-built retrieval bundle. Cap + parse BEFORE consuming any quota.
    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const question = typeof body?.question === 'string' ? body.question : '';
    const audience: 'dm' | 'player' = body?.audience === 'dm' ? 'dm' : 'player';
    if (!question.trim()) return json({ error: 'Missing question' }, 400, cors);
    const bundle = buildRetrievalBundle(body?.slices);
    // V-26a MULTI-HOP: prior Q&A carried by a follow-up. Context only — fenced as data
    // in the prompt and NEVER a source; the new answer is still grounded in `bundle` and
    // its citations resolved against it (buildPriorExchange caps turns + lengths).
    const history: Array<{ question?: unknown; answer?: unknown }> = Array.isArray(body?.history)
      ? body.history
          .filter((t: unknown) => t && typeof t === 'object')
          .map((t: any) => ({ question: t.question, answer: t.answer }))
      : [];

    // SERVER-SIDE AUDIENCE BACKSTOP: a player-audience request may ground on ONLY
    // player-safe sources — a tampered payload smuggling a DM source is rejected.
    if (audience === 'player' && !bundleIsPlayerSafe(bundle)) {
      return json({ error: 'player request carried a non-player-safe slice' }, 400, cors);
    }

    // Extraction defense: the inert per-account canary + the meta-probe flag.
    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(question);

    // BYOK: the user's key if present, else the server key. Resolved once, never logged.
    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, INTERVIEW_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('interview', user.id, note, { stage: 'byok' }),
    );

    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedResolved: ReturnType<typeof resolveInterview> | null = null;
    let capturedRefused = false;
    let capturedUsage: { input: number | null; output: number | null } = { input: null, output: null };
    let capturedRefusalClass: RefusalClass | null = null;
    let capturedRefusalMessage: string | null = null;
    let capturedRefusalDoors: string[] = [];
    let capturedModel = INTERVIEW_MODEL;

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class;
      capturedRefusalMessage = refusal.message;
      capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) {
        try {
          await supabaseAdmin.rpc('surveyor_byok_set_health', {
            p_user: user.id, p_provider: INTERVIEW_PROVIDER, p_health: health, p_error_class: cls, p_verified: false,
          });
        } catch (e) { logError('interview', user.id, e, { stage: 'health' }); }
      }
    };

    // ── USER GOVERNORS: enforce the user's own caps / pause BEFORE spending. Over-cap
    // or paused ⇒ a graceful refusal, spend NOTHING. Fails OPEN on RPC error (the global
    // operator cap still bounds total spend independently). ─────────────────────────
    let capturedWarn = false;
    let capturedModelPref: string | null = null;
    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', {
        p_user: user.id, p_provider: INTERVIEW_PROVIDER, p_feature: INTERVIEW_FEATURE,
      });
      if (preErr) logError('interview', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: INTERVIEW_FEATURE, p_audience: audience,
            p_prompt_hash: fnv1a32(question), p_answer_hash: null,
            p_retrieval_slice_ids: [...bundle.ids], p_retrieval_sources: bundle.sources,
            p_model: INTERVIEW_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: INTERVIEW_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null,
            p_refused: true, p_spend_id: null, p_meta_probe: metaProbe, p_canary: canary,
            p_refusal_class: refusal.class,
          });
        } catch (e) { logError('interview', user.id, e, { stage: 'governor-audit' }); }
        return json({
          error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors,
          governor: { paused: !!pr.paused, breached: pr.breached ?? null },
        }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = (pre as { model_prefs?: Record<string, unknown> } | null)?.model_prefs;
      capturedModelPref = mp && typeof mp[INTERVIEW_FEATURE] === 'string' ? String(mp[INTERVIEW_FEATURE]) : null;
    } catch (e) { logError('interview', user.id, e, { stage: 'governor' }); }

    capturedModel = (providerKey.byok && capturedModelPref && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref))
      ? capturedModelPref : INTERVIEW_MODEL;

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: INTERVIEW_SPEND_ESTIMATE_USD });
        if (error) logError('interview', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        const allowed = (data as { allowed?: boolean } | null)?.allowed === true;
        return { allowed, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('interview', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; }
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        // THE SPEND BELT: spend_credits → assert_current_session (defense-in-depth).
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: INTERVIEW_FEATURE });
        if (error) { logError('interview', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildInterviewPrompt(question, bundle, audience, canary, history);
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), INTERVIEW_TIMEOUT_MS);
        let resp: Response;
        try {
          const adapter = routeWorldDataAdapter(anthropicAdapter);
          resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt: capturedPrompt, signal: ac.signal, fetchImpl: providerFetch });
        } catch (fetchErr) {
          await applyProviderError(classifyProviderThrow(fetchErr));
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${INTERVIEW_TIMEOUT_MS}ms`);
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
        const rawText = (data?.content?.[0]?.text || '').trim();
        // SERVER-SIDE CITATION RESOLUTION: phantom refs dropped; kinds derived from the bundle.
        capturedResolved = resolveInterview(parseInterviewAnswer(rawText), bundle);
        return { ok: !!capturedResolved.answer, answerText: capturedResolved.answer };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return;
        try {
          const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason });
          if (error) logError('interview', user.id, error.message, { stage: 'refund', spend_id: spendId });
        } catch (e) { logError('interview', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) {
        if (!id) return;
        try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); }
        catch (e) { logError('interview', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); }
      },
      async meter(ok) {
        try {
          const inTok = capturedUsage.input ?? estTokens(capturedPrompt);
          const outTok = capturedUsage.output ?? estTokens(capturedResolved?.answer || '');
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: INTERVIEW_FEATURE, phase: null, provider: INTERVIEW_PROVIDER,
            model: capturedModel, model_preference: capturedModelPref,
            input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: capturedUsage.input == null || capturedUsage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('interview', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('interview', user.id, e, { stage: 'metering' }); }
      },
    }, 'interview generation failed');

    // ── the aiOperationLog audit row (best-effort; never fails the response) ────────
    try {
      const resolved = capturedResolved ?? resolveInterview({ segments: [], confidence: 0.5 }, bundle);
      const rec = interviewLogRecord({
        prompt: capturedPrompt, bundle, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        resolved, audience, metaProbe, canary,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: INTERVIEW_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: INTERVIEW_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: outcome.outcome === 'ok' ? rec.citation_coverage : null,
        p_claim_count: rec.claim_count, p_refused: capturedRefused, p_spend_id: capturedSpendId,
        p_meta_probe: rec.meta_probe, p_canary: rec.canary,
        p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('interview', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('interview', user.id, e, { stage: 'audit' }); }

    switch (outcome.outcome) {
      case 'cap':
        return json({ error: 'The Interview is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited':
        return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient':
        return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({
          error: capturedRefused
            ? 'The chronicler declined this request.'
            : (capturedRefusalMessage || 'The Interview failed. Your credits were refunded.'),
          refused: capturedRefused, refunded: outcome.refunded,
          refusalClass: capturedRefusalClass, doors: capturedRefusalDoors,
        }, 502, cors);
      case 'ok': {
        void maybeAutoReload(supabaseAdmin, user.id).catch(() => {});
        const r = capturedResolved!;
        return json({
          answer: r.answer,
          // The V-1 schema: the flat resolved citations (receipt chips → V-4) …
          citations: r.citations,
          confidence: r.confidence,
          // … plus the per-segment breakdown so the client renders the conjecture register.
          segments: r.segments,
          citationCoverage: r.citationCoverage,
          audience,
          byok: providerKey.byok,
          creditsRemaining: outcome.balance,
          usageWarning: capturedWarn,
        }, 200, cors);
      }
    }
  } catch (e) {
    logError('interview', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The Interview request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleInterview(req));
