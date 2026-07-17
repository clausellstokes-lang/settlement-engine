/**
 * Supabase Edge Function: ai-analyst — the first AI ship (Surveyor S1,
 * DESIGN_AI_CONTROL_SURFACE §2 stage 1). READ-ONLY: it writes NO world state.
 *
 * The CLIENT builds the audience-appropriate retrieval bundle (src/domain/ai +
 * src/domain/briefs → selectSlices) and POSTs { question, audience, slices }. This
 * function:
 *   bot guard → JWT auth → account_is_active → has_surveyor_entitlement (the INTERFACE
 *   gate) → the credit round-trip (creditFlow.ts, generalized from generate-chronicle)
 *   → BYOK-or-server key (byok.ts, never logged) → provider adapter (Anthropic first,
 *   claude-opus-4-8; provider-neutral interface) → CITATION enforcement (analystCore.ts:
 *   the model may cite only bundle slice ids; unsourceable claims become "the engine
 *   does not record this") → the aiOperationLog audit row.
 *
 * Same trust boundary as generate-narrative/-chronicle: the browser never holds the
 * Anthropic key (tests/security/clientAiBoundary.contract.test.js). Handler is exported
 * with a DI seam so the money/auth path is Deno-testable (index.test.ts).
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { botGuard } from '../_shared/requestMeta.ts';
import { logError } from '../_shared/logError.ts';
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
import { runCreditedCall } from './creditFlow.ts';
import { resolveProviderKey } from './byok.ts';
import {
  buildRetrievalBundle, validateClaims, citationCoverage, renderCitedAnswer,
  buildAnalystPrompt, aiOperationLogRecord, bundleIsPlayerSafe,
} from './analystCore.ts';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const ANTHROPIC_VERSION = '2023-06-01';
// Provider-neutral by design; Anthropic first, latest model. Overridable per deploy.
const ANALYST_MODEL = Deno.env.get('ANTHROPIC_CLAUDE_OPUS_4_8_MODEL') || 'claude-opus-4-8';
const ANALYST_PROVIDER = 'anthropic';
const ANALYST_FEATURE = 'analysis';
const ANALYST_TIMEOUT_MS = 60_000;
// Conservative Opus worst-case for the global-cap reservation ($5/$25 per Mtok).
const ANALYST_SPEND_ESTIMATE_USD = 0.05;
const MAX_BODY_BYTES = 128 * 1024; // the retrieval bundle can be larger than a chronicle grounding
const MAX_OUTPUT_TOKENS = 1400;

function getCorsHeaders(req?: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { ...headers, 'Content-Type': 'application/json' } });
}

/** Parse the model's JSON claims contract. Robust to code fences / preamble; a
 *  non-JSON reply degrades to a single UNSOURCED claim (honesty boundary), never a throw. */
function parseClaims(raw: string): Array<{ text: string; source: string | null }> {
  const text = String(raw ?? '').trim();
  if (!text) return [];
  const fenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const start = fenced.indexOf('{');
  const end = fenced.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      const obj = JSON.parse(fenced.slice(start, end + 1));
      if (obj && Array.isArray(obj.claims)) {
        return obj.claims.map((c: any) => ({
          text: typeof c?.text === 'string' ? c.text : String(c?.text ?? ''),
          source: typeof c?.source === 'string' ? c.source : null,
        }));
      }
    } catch { /* fall through */ }
  }
  return [{ text, source: null }]; // unparseable ⇒ one unsourced claim
}

function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
}
function defaultAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

/** The Anthropic provider adapter (the provider-neutral interface's first backend). */
async function callAnthropic(
  apiKey: string, model: string, prompt: string, providerFetch: typeof fetch, signal: AbortSignal,
): Promise<Response> {
  return providerFetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    signal,
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_OUTPUT_TOKENS,
      messages: [{ role: 'user', content: prompt }],
    }),
  });
}

export async function handleAiAnalyst(
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

  const guard = botGuard(req, 'ai-analyst');
  if (guard.reject) return guard.reject;

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing authorization' }, 401, cors);

    const supabaseUser = makeUserClient(authHeader);
    const supabaseAdmin = makeAdminClient();
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) return json({ error: 'Unauthorized' }, 401, cors);

    // Trust-boundary gate: banned/disabled/soft-deleted accounts (fail closed on !== true).
    const { data: isActive, error: activeErr } = await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) logError('ai-analyst', user.id, `account_is_active errored: ${activeErr.message}`);
    if (isActive !== true) return json({ error: 'Account is not active' }, 403, cors);

    // THE INTERFACE GATE (§3/§4): the AI control surface requires an active Surveyor
    // entitlement. The sim never reads tier; this gates the interface only. Fail closed
    // on !== true. (Provisioning of entitlements is owner-gated / concierge-v1.)
    const { data: entitled, error: entErr } = await supabaseUser.rpc('has_surveyor_entitlement');
    if (entErr) logError('ai-analyst', user.id, `has_surveyor_entitlement errored: ${entErr.message}`, { stage: 'entitlement' });
    if (entitled !== true) return json({ error: 'The analyst requires a Surveyor plan.' }, 403, cors);

    // Body: the client-built retrieval bundle. Cap + parse BEFORE consuming any quota.
    const raw = await req.text().catch(() => '');
    if (new TextEncoder().encode(raw).length > MAX_BODY_BYTES) return json({ error: 'too_large' }, 413, cors);
    let body: any = null;
    try { body = raw ? JSON.parse(raw) : null; } catch { return json({ error: 'invalid_json' }, 400, cors); }
    const question = typeof body?.question === 'string' ? body.question : '';
    const audience: 'dm' | 'player' = body?.audience === 'dm' ? 'dm' : 'player';
    if (!question.trim()) return json({ error: 'Missing question' }, 400, cors);
    const bundle = buildRetrievalBundle(body?.slices);

    // SERVER-SIDE AUDIENCE BACKSTOP (§3): a player-audience request may ground on ONLY
    // player-safe sources. A tampered payload that smuggles a DM source into a player
    // request is rejected — the audience rule is enforced server-side too, not trusted.
    if (audience === 'player' && !bundleIsPlayerSafe(bundle)) {
      return json({ error: 'player request carried a non-player-safe slice' }, 400, cors);
    }

    // BYOK: the user's key if present, else the server key. Resolved once, never logged.
    const providerKey = await resolveProviderKey(
      supabaseAdmin, user.id, ANALYST_PROVIDER, ANTHROPIC_API_KEY,
      (note) => logError('ai-analyst', user.id, note, { stage: 'byok' }),
    );

    // ── captured by the effect closures for the aiOperationLog + response ──────────
    let capturedSpendId: string | null = null;
    let capturedPrompt = '';
    let capturedAnswerText = '';
    let capturedValidated: ReturnType<typeof validateClaims> = [];
    let capturedRefused = false;
    let capturedUsage: { input: number | null; output: number | null } = { input: null, output: null };

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    const outcome = await runCreditedCall({
      async reserve() {
        const { data, error } = await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: ANALYST_SPEND_ESTIMATE_USD });
        if (error) logError('ai-analyst', user.id, `reserve_ai_spend errored: ${error.message}`, { stage: 'spend-cap' });
        const allowed = (data as { allowed?: boolean } | null)?.allowed === true;
        return { allowed, reservationId: (data as { reservation_id?: string | null } | null)?.reservation_id ?? null };
      },
      async rateLimit() {
        const { data, error } = await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
        if (error) { logError('ai-analyst', user.id, `rate_limit errored: ${error.message}`, { stage: 'rate-limit' }); return { allowed: true }; } // fail-open
        return { allowed: (data as { allowed?: boolean } | null)?.allowed !== false };
      },
      async spend() {
        const { data, error } = await supabaseUser.rpc('spend_credits', { feature: ANALYST_FEATURE });
        if (error) { logError('ai-analyst', user.id, `spend_credits errored: ${error.message}`, { stage: 'spend' }); throw new Error('spend_failed'); }
        const res = data as any;
        capturedSpendId = res?.spend_id ?? res?.id ?? null;
        return { ok: !!res?.ok, spendId: capturedSpendId, elevated: !!res?.elevated, balance: res?.balance ?? null, reason: res?.reason ?? null };
      },
      async callModel() {
        capturedPrompt = buildAnalystPrompt(question, bundle, audience);
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), ANALYST_TIMEOUT_MS);
        let resp: Response;
        try {
          resp = await callAnthropic(providerKey.key, ANALYST_MODEL, capturedPrompt, providerFetch, ac.signal);
        } catch (fetchErr) {
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${ANALYST_TIMEOUT_MS}ms`);
          throw fetchErr;
        } finally { clearTimeout(timer); }
        if (!resp.ok) throw new Error(`Anthropic ${resp.status}`);
        const data = await resp.json();
        capturedUsage = {
          input: typeof data?.usage?.input_tokens === 'number' ? data.usage.input_tokens : null,
          output: typeof data?.usage?.output_tokens === 'number' ? data.usage.output_tokens : null,
        };
        if (data?.stop_reason === 'refusal') { capturedRefused = true; return { ok: false, answerText: '' }; }
        const rawText = (data?.content?.[0]?.text || '').trim();
        capturedValidated = validateClaims(parseClaims(rawText), bundle);
        capturedAnswerText = renderCitedAnswer(capturedValidated);
        return { ok: !!capturedAnswerText, answerText: capturedAnswerText };
      },
      async refund(spendId, reason, elevated) {
        if (!spendId || elevated) return; // elevated spends are never real debits
        try {
          const { error } = await supabaseAdmin.rpc('refund_credits', { spend_ledger_row: spendId, refund_reason: reason });
          if (error) logError('ai-analyst', user.id, error.message, { stage: 'refund', spend_id: spendId });
        } catch (e) { logError('ai-analyst', user.id, e, { stage: 'refund', spend_id: spendId }); }
      },
      async release(id) {
        if (!id) return;
        try { await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: id }); }
        catch (e) { logError('ai-analyst', user.id, `release failed: ${e instanceof Error ? e.message : String(e)}`, { stage: 'spend-cap' }); }
      },
      async meter(ok) {
        try {
          const inTok = capturedUsage.input ?? estTokens(capturedPrompt);
          const outTok = capturedUsage.output ?? estTokens(capturedAnswerText);
          // Opus price bucket: $5 / $25 per Mtok. (BYOK inference runs on the user's key,
          // so metered COGS there is zero to us; we still record token counts.)
          const costUsd = providerKey.byok ? 0 : Number((((inTok / 1_000_000) * 5) + ((outTok / 1_000_000) * 25)).toFixed(6));
          const { error } = await supabaseAdmin.from('ai_usage_events').insert({
            user_id: user.id, feature: ANALYST_FEATURE, phase: null, provider: ANALYST_PROVIDER,
            model: ANALYST_MODEL, model_preference: null,
            input_tokens: inTok, output_tokens: outTok,
            tokens_estimated: capturedUsage.input == null || capturedUsage.output == null,
            estimated_cost_usd: costUsd, ok, fellback: false, duration_ms: 0, spend_id: capturedSpendId,
          });
          if (error) logError('ai-analyst', user.id, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
        } catch (e) { logError('ai-analyst', user.id, e, { stage: 'metering' }); }
      },
    }, 'analyst generation failed');

    // ── the aiOperationLog audit row (best-effort; never fails the response) ────────
    // Carries hashes + slice ids + coverage + byok flag — NEVER prose, PII, or the key.
    try {
      const rec = aiOperationLogRecord({
        prompt: capturedPrompt, bundle, model: ANALYST_MODEL, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        answerText: capturedAnswerText, audience, validated: capturedValidated,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: ANALYST_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: ANALYST_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: outcome.outcome === 'ok' ? rec.citation_coverage : null,
        p_claim_count: rec.claim_count, p_refused: capturedRefused, p_spend_id: capturedSpendId,
      });
      if (error) logError('ai-analyst', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('ai-analyst', user.id, e, { stage: 'audit' }); }

    // ── map the outcome to a response ──────────────────────────────────────────────
    switch (outcome.outcome) {
      case 'cap':
        return json({ error: 'The analyst is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited':
        return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient':
        return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        return json({ error: capturedRefused ? 'The analyst declined this request.' : 'Analysis failed. Your credits were refunded.', refused: capturedRefused, refunded: outcome.refunded }, 502, cors);
      case 'ok':
        return json({
          answer: outcome.answerText,
          claims: capturedValidated,
          citationCoverage: citationCoverage(capturedValidated),
          audience,
          byok: providerKey.byok,
          creditsRemaining: outcome.balance,
        }, 200, cors);
    }
  } catch (e) {
    logError('ai-analyst', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The analyst request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleAiAnalyst(req));
