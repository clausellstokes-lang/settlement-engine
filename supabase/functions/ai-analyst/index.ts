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
  registerProviderAdapter, routeWorldDataAdapter,
  sanitizeMusings, registerPurity,
  accountCanary, detectMetaProbe, extractRider,
  fnv1a32, ANTHROPIC_SUPPORTED_MODELS, ANTHROPIC_RETENTION_CLASS,
} from './analystCore.ts';
import type { MusingItem, EnrichmentRider } from './analystCore.ts';
// §3d graceful refusals + #29 provider-error classification / BYOK key-health.
import {
  classifyProviderError, classifyProviderThrow, healthFromClass, refusalForClass,
} from './providerErrors.ts';
import type { RefusalClass, ProviderErrorClass } from './providerErrors.ts';
// §3f: the ONE frozen event contract, shared with the client (single source of truth —
// the freshness test pins bundle ≡ src/lib/analyticsEvents.js).
import { EVENTS as ANALYTICS_EVENTS, EVENTS_REV as ANALYTICS_EVENTS_REV } from '../_shared/analyticsEventsBundle.js';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
// §3c(4): the salt that makes the per-account canary unguessable. A tracer works even
// unset (the marker is still per-account-unique via user id) — the secret only raises
// the guessing cost. Set SURVEYOR_CANARY_SECRET in prod.
const CANARY_SECRET = Deno.env.get('SURVEYOR_CANARY_SECRET') || '';
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

/** Parse the model's TWO-VOICES JSON contract (§3b). Robust to code fences /
 *  preamble; a non-JSON reply degrades to a single UNSOURCED report claim (honesty
 *  boundary), never a throw. Returns the three structural blocks: `claims` (the cited
 *  REPORT register), `musings` (the uncited MUSING register), and `rider` (the raw
 *  §3f enrichment rider, validated downstream against the controlled vocabulary). */
function parseModelAnswer(raw: string): {
  claims: Array<{ text: string; source: string | null }>;
  musings: unknown;
  rider: unknown;
} {
  const text = String(raw ?? '').trim();
  if (!text) return { claims: [], musings: [], rider: null };
  const fenced = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '');
  const start = fenced.indexOf('{');
  const end = fenced.lastIndexOf('}');
  if (start >= 0 && end > start) {
    try {
      const obj = JSON.parse(fenced.slice(start, end + 1));
      if (obj && Array.isArray(obj.claims)) {
        return {
          claims: obj.claims.map((c: any) => ({
            text: typeof c?.text === 'string' ? c.text : String(c?.text ?? ''),
            source: typeof c?.source === 'string' ? c.source : null,
          })),
          musings: obj.musings,
          rider: obj.rider,
        };
      }
    } catch { /* fall through */ }
  }
  return { claims: [{ text, source: null }], musings: [], rider: null }; // unparseable ⇒ one unsourced claim
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

// §3e THE FORGETTING LAW (STRUCTURE): the Anthropic adapter declares its retention posture
// as a REQUIRED property. RE-VERIFY at deploy — Anthropic's commercial terms + DPA — never
// asserted from memory. Anthropic API today: inputs/outputs are NOT used to train models by
// default, and retention is a bounded abuse-monitoring window (zero-data-retention is
// available to eligible orgs). Declared 'bounded' = the conservative floor.
// TODO-verify: confirm the current retention window + ZDR eligibility before deploy; upgrade
// to 'zero' ONLY when the paper says so. (No prompt-side "delete after use" claim — §3e bans
// that as theater; the guarantee is stateless requests + this contract, not a prompt line.)
const anthropicAdapter = registerProviderAdapter({
  id: 'anthropic',
  retentionClass: ANTHROPIC_RETENTION_CLASS,
  models: ANTHROPIC_SUPPORTED_MODELS,   // #29: the model picker's adapter-supported set
  call: ({ model, apiKey, prompt, signal, fetchImpl }) => callAnthropic(apiKey, model, prompt, fetchImpl ?? fetch, signal),
});

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
    // §3d GRACEFUL REFUSAL: name the boundary + the nearest door the user CAN use now.
    if (entitled !== true) return json({ error: 'The analyst is part of the Surveyor plan. You can still open the World Pulse and map panels — they read the same standings, factions, and rumors.' }, 403, cors);

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

    // §3c EXTRACTION DEFENSE: the inert per-account packet canary (embedded in the
    // instruction packet, logged for leak attribution) + the meta-probe flag (an
    // extraction-signature question, logged for review). Neither ever reaches an answer.
    const canary = accountCanary(user.id, CANARY_SECRET);
    const metaProbe = detectMetaProbe(question);

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
    let capturedMusings: MusingItem[] = [];
    let capturedRegisterPurity = 1;
    let capturedRider: EnrichmentRider | null = null;
    let capturedRefused = false;
    let capturedUsage: { input: number | null; output: number | null } = { input: null, output: null };
    // #29: a provider failure's boundary class + the §3d graceful refusal it maps to,
    // captured for the model_failed response and the aiOperationLog refusal_class receipt.
    let capturedRefusalClass: RefusalClass | null = null;
    let capturedRefusalMessage: string | null = null;
    let capturedRefusalDoors: string[] = [];
    // #29: the user's per-task-class model preference (from the governor precheck) + the
    // model actually called. A BYOK user's valid override wins; everyone else (and any
    // invalid/unknown pref) falls back to the server default ANALYST_MODEL.
    let capturedModelPref: string | null = null;
    let capturedModel = ANALYST_MODEL;

    const estTokens = (s: string) => Math.max(1, Math.ceil(String(s || '').length / 4));

    // #29: on a provider failure, capture the §3d refusal AND — for a BYOK key — persist
    // the boundary class as the key's health (out_of_credit / invalid / rate_limited /
    // down) so the settings surface shows a live status. 'other' leaves health untouched.
    const applyProviderError = async (cls: ProviderErrorClass) => {
      const refusal = refusalForClass(cls);
      capturedRefusalClass = refusal.class;
      capturedRefusalMessage = refusal.message;
      capturedRefusalDoors = refusal.doors;
      const health = healthFromClass(cls);
      if (providerKey.byok && health) {
        try {
          await supabaseAdmin.rpc('surveyor_byok_set_health', {
            p_user: user.id, p_provider: ANALYST_PROVIDER, p_health: health, p_error_class: cls, p_verified: false,
          });
        } catch (e) { logError('ai-analyst', user.id, e, { stage: 'health' }); }
      }
    };

    // ── USER GOVERNORS (#29): the single edge door ─────────────────────────────────
    // Enforce the user's own caps / pause BEFORE spending anything. Over-cap or paused ⇒
    // a §3d graceful refusal, spend NOTHING, and receipt the refusal. Fails OPEN on RPC
    // error (the global operator cap (086) still bounds total spend independently).
    let capturedWarn = false;
    try {
      const { data: pre, error: preErr } = await supabaseAdmin.rpc('surveyor_usage_precheck', {
        p_user: user.id, p_provider: ANALYST_PROVIDER, p_feature: ANALYST_FEATURE,
      });
      if (preErr) logError('ai-analyst', user.id, `usage_precheck errored: ${preErr.message}`, { stage: 'governor' });
      const pr = pre as { allowed?: boolean; paused?: boolean; warn?: boolean; breached?: string } | null;
      if (pr && pr.allowed === false) {
        const cls: RefusalClass = pr.paused ? 'paused' : 'cap';
        const refusal = refusalForClass(cls, { window: typeof pr.breached === 'string' ? pr.breached : undefined });
        // Receipt the refused attempt (best-effort) — refused + WHY, no spend, no answer.
        try {
          await supabaseAdmin.rpc('write_ai_operation_log', {
            p_user: user.id, p_feature: ANALYST_FEATURE, p_audience: audience,
            p_prompt_hash: fnv1a32(question), p_answer_hash: null,
            p_retrieval_slice_ids: [...bundle.ids], p_retrieval_sources: bundle.sources,
            p_model: ANALYST_MODEL, p_model_version: `anthropic-${ANTHROPIC_VERSION}`, p_provider: ANALYST_PROVIDER,
            p_byok: providerKey.byok, p_citation_coverage: null, p_claim_count: null,
            p_refused: true, p_spend_id: null, p_meta_probe: metaProbe, p_canary: canary,
            p_refusal_class: refusal.class,
          });
        } catch (e) { logError('ai-analyst', user.id, e, { stage: 'governor-audit' }); }
        return json({
          error: refusal.message, refused: true, refusalClass: refusal.class, doors: refusal.doors,
          governor: { paused: !!pr.paused, breached: pr.breached ?? null },
        }, cls === 'paused' ? 403 : 402, cors);
      }
      capturedWarn = pr?.warn === true;
      const mp = (pre as { model_prefs?: Record<string, unknown> } | null)?.model_prefs;
      const pref = mp && typeof mp[ANALYST_FEATURE] === 'string' ? String(mp[ANALYST_FEATURE]) : null;
      capturedModelPref = pref;
    } catch (e) { logError('ai-analyst', user.id, e, { stage: 'governor' }); }

    // Resolve the model actually called: a BYOK user's valid per-task override wins;
    // an unknown/invalid pref or a managed (server-key) request uses the server default.
    capturedModel = (providerKey.byok && capturedModelPref && ANTHROPIC_SUPPORTED_MODELS.includes(capturedModelPref))
      ? capturedModelPref : ANALYST_MODEL;

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
        capturedPrompt = buildAnalystPrompt(question, bundle, audience, canary);
        const ac = new AbortController();
        const timer = setTimeout(() => ac.abort(), ANALYST_TIMEOUT_MS);
        let resp: Response;
        try {
          // §3e: world data routes only to a non-training-class adapter (throws otherwise).
          const adapter = routeWorldDataAdapter(anthropicAdapter);
          resp = await adapter.call({ model: capturedModel, apiKey: providerKey.key, prompt: capturedPrompt, signal: ac.signal, fetchImpl: providerFetch });
        } catch (fetchErr) {
          // Network / timeout ⇒ provider-down (not a key fault). Classify → refusal + health.
          await applyProviderError(classifyProviderThrow(fetchErr));
          if (fetchErr instanceof Error && fetchErr.name === 'AbortError') throw new Error(`Anthropic request timed out after ${ANALYST_TIMEOUT_MS}ms`);
          throw fetchErr;
        } finally { clearTimeout(timer); }
        if (!resp.ok) {
          // #29: classify the provider error (out_of_credit / invalid / rate_limited /
          // down) from status + a bounded body slice (NEVER logged), map it to a §3d
          // graceful refusal, and — for a BYOK key — persist it as key-health. Then throw
          // so the creditFlow refund path runs (a failed attempt spends nothing).
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
        const parsed = parseModelAnswer(rawText);
        capturedValidated = validateClaims(parsed.claims, bundle);
        // §3b: the MUSING register — uncited by construction (sanitizeMusings drops any
        // smuggled source/op). REGISTER PURITY is computed here, from the report claim
        // TEXT alone — never from the rider (the §3f conflicted-witness rule).
        capturedMusings = sanitizeMusings(parsed.musings);
        capturedRegisterPurity = registerPurity(capturedValidated);
        // §3f: the model's self-emitted rider, coerced to the controlled vocabulary
        // (interest data only — never the quality metrics above).
        capturedRider = extractRider(parsed.rider);
        capturedAnswerText = renderCitedAnswer(capturedValidated);
        // A pure clarifying-question turn (no grounded claims, only musings) is a valid,
        // non-empty answer: the analyst is allowed to ask back (§3b read-only conversation).
        return { ok: !!capturedAnswerText || capturedMusings.length > 0, answerText: capturedAnswerText };
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
            model: capturedModel, model_preference: capturedModelPref,
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
        prompt: capturedPrompt, bundle, model: capturedModel, modelVersion: `anthropic-${ANTHROPIC_VERSION}`,
        answerText: capturedAnswerText, audience, validated: capturedValidated,
        metaProbe, canary,
      });
      const { error } = await supabaseAdmin.rpc('write_ai_operation_log', {
        p_user: user.id, p_feature: ANALYST_FEATURE, p_audience: rec.audience,
        p_prompt_hash: rec.prompt_hash, p_answer_hash: outcome.outcome === 'ok' ? rec.answer_hash : null,
        p_retrieval_slice_ids: rec.retrieval_slice_ids, p_retrieval_sources: rec.retrieval_sources,
        p_model: rec.model, p_model_version: rec.model_version, p_provider: ANALYST_PROVIDER,
        p_byok: providerKey.byok, p_citation_coverage: outcome.outcome === 'ok' ? rec.citation_coverage : null,
        p_claim_count: rec.claim_count, p_refused: capturedRefused, p_spend_id: capturedSpendId,
        // §3c: the extraction-defense fields — inert canary + the meta-probe flag.
        p_meta_probe: rec.meta_probe, p_canary: rec.canary,
        // #29: the refusal class — WHY a failed/refused turn failed (never prose/PII/key).
        p_refusal_class: capturedRefusalClass,
      });
      if (error) logError('ai-analyst', user.id, `write_ai_operation_log failed: ${error.message}`, { stage: 'audit' });
    } catch (e) { logError('ai-analyst', user.id, e, { stage: 'audit' }); }

    // ── §3f THE ENRICHMENT RIDER — the ID-FREE, category-grade service-telemetry row ─
    // The model tags its own traffic; we extract those tags into an analytics event with
    // NO actor / session / subject id — the CONDITION-OF-SERVICE layer (managed AND BYOK,
    // non-togglable, ToS-disclosed). Every interaction flows through this ONE edge path,
    // so BYOK enforceability is STRUCTURAL — there is no bypass. Best-effort; never fails
    // the response. CONFLICTED-WITNESS RULE: this carries INTEREST data only — the quality
    // metrics (citation coverage, register purity) are computed independently above and
    // are NEVER sourced from this rider. Content-grade capture stays consent-gated (§3).
    try {
      if (capturedRider) {
        const { error } = await supabaseAdmin.from('analytics_events').insert({
          event: ANALYTICS_EVENTS.AI_ANALYST_RIDER,
          actor_id: null, session_id: null, subject_id: null,  // ID-FREE by construction
          consent_tier: 'product',                              // condition-of-service (never research)
          events_rev: ANALYTICS_EVENTS_REV,
          props: {
            // controlled vocabulary + booleans only — no content, names, numbers, or free text
            intent: capturedRider.intent,
            themes: capturedRider.themes,
            refusal_reason: capturedRider.refusalReason,
            action_drafted: capturedRider.actionDrafted,
            oov: capturedRider.oov,                             // dictionary-growth signal (A2 seam)
            audience, byok: providerKey.byok, refused: capturedRefused,
          },
          batch_id: crypto.randomUUID(), seq: 0,
        });
        if (error) logError('ai-analyst', user.id, `rider event insert failed: ${error.message}`, { stage: 'rider' });
      }
    } catch (e) { logError('ai-analyst', user.id, e, { stage: 'rider' }); }

    // ── map the outcome to a response ──────────────────────────────────────────────
    switch (outcome.outcome) {
      case 'cap':
        return json({ error: 'The analyst is temporarily unavailable (daily capacity reached). No credits were charged.' }, 503, cors);
      case 'rate_limited':
        return json({ error: "You have reached today's AI limit. Please try again tomorrow. No credits were charged." }, 429, cors);
      case 'insufficient':
        return json({ error: outcome.reason === 'spend_failed' ? 'Credit spend failed — no credits were charged.' : 'Insufficient credits', balance: outcome.balance }, 402, cors);
      case 'model_failed':
        // #29 §3d: a classified provider failure surfaces its graceful refusal + doors
        // (name the boundary + nearest door, incl. switch-to-managed). A failed attempt
        // spent nothing (refunded). refusalClass also names WHY for the client.
        return json({
          error: capturedRefused
            ? 'The analyst declined this request.'
            : (capturedRefusalMessage || 'Analysis failed. Your credits were refunded.'),
          refused: capturedRefused, refunded: outcome.refunded,
          refusalClass: capturedRefusalClass, doors: capturedRefusalDoors,
        }, 502, cors);
      case 'ok':
        return json({
          answer: outcome.answerText,
          claims: capturedValidated,
          // §3b TWO-VOICES: the uncited MUSING register, structurally separate from the
          // cited report `claims` so the client renders them as distinct registers.
          musings: capturedMusings,
          citationCoverage: citationCoverage(capturedValidated),
          // §3b/§5 register-purity eval metric (independent of the §3f rider).
          registerPurity: capturedRegisterPurity,
          audience,
          byok: providerKey.byok,
          creditsRemaining: outcome.balance,
          // #29: the usage governor warned this turn is near a cap (still served).
          usageWarning: capturedWarn,
        }, 200, cors);
    }
  } catch (e) {
    logError('ai-analyst', null, `outer handler error: ${(e as Error).message}`, { stage: 'outer' });
    return json({ error: 'The analyst request failed. Please try again.' }, 500, cors);
  }
}

serve((req) => handleAiAnalyst(req));
