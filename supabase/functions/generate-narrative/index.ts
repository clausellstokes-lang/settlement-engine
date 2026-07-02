/**
 * Supabase Edge Function: generate-narrative
 *
 * AI NARRATIVE LAYER — REFINEMENT-IN-PLACE ARCHITECTURE
 *
 * Phase 1 (selected preference model): write a 2-3 sentence identity statement for the settlement.
 *   Acts as authorial voice for phase 2.
 *
 * Phase 2 (selected preference model, parallel): 8 refinement passes that rewrite specific
 *   prose fields in place. The server starts from a deep clone of the
 *   source settlement, applies refinements on top, and returns the merged
 *   object. Fields the AI never touched fall back to raw data.
 *
 * Field targets are chosen to match what the UI ACTUALLY RENDERS, not a
 * hypothetical schema. Sources:
 *   - src/components/new/tabs/*Tab.jsx  (render paths)
 *   - src/generators/generateSettlementPipeline.js  (generated fields)
 *
 * Daily life is a separate type: 5 parallel Opus calls (dawn → night).
 *
 * Streaming NDJSON:
 *   { field: 'thesis', value: string }
 *   { field: '<pass-path>', value: <snapshot> }   per pass
 *   { field: '<pass-key>', error: string }        on pass failure
 *   { done: true, result, creditsRemaining, type, partialFailure?, failedFields? }
 *
 * Partial-failure policy: if the thesis succeeds and some passes fail, we
 * keep what succeeded and do NOT refund — the user got the Opus thesis
 * plus whatever polish completed. If the thesis itself fails, full refund.
 */

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.108.2';
import { shouldRefundOnFailure } from './refundPolicy.ts';
// Deterministic entity-link post-processor: wraps known entity names found in
// refined free-form prose with id-bearing tokens the client tokenizer parses.
// Ids are byte-identical to the client dossier index (parity-tested).
import { wrapEntityRefsInProse } from './entityRefWrapper.ts';
import { scanProseForInvention, collectFullCanon, proseFieldsOf } from './inventionSignal.ts';
// Tier 6.8 — bundled aiGrounding contract. Pre-built by
// `scripts/build-edge-shared.mjs`. Freshness enforced by
// tests/edgeFunctions/aiGroundingBundle.freshness.test.js.
import {
  sanitizeRelationshipMemoryContext,
  summarizeGroundingPayload,
} from '../_shared/aiGroundingBundle.js';
// Tier 0.10 — abuse defense baseline (shared with every edge function).
import { botGuard } from '../_shared/requestMeta.ts';
// One CORS allowlist for every edge function (incl. Cloudflare Pages preview).
import { getCorsHeaders as sharedCorsHeaders } from '../_shared/cors.ts';
// Structured error logging for the money/AI path (review B16 observability).
import { logError } from '../_shared/logError.ts';

import { safeJsonParse, deepClone, getByPath, applyMutated, isEmptyPayload } from './jsonUtils.ts';
import { CACHE_BREAKPOINT, buildAnthropicUserContent, stripCacheBreakpoint } from './promptCache.ts';
import {
  stripGuidanceFences, buildThesisPrompt, buildRefinementPrompt, buildProgressionThesisPrompt,
  buildDailyLifePrompt, summarizeSettlement, augmentSummaryWithGrounding, overlayPriorRefinedProse, sanitizeWarMoraleContext,
  sanitizeChronicleContext, preservationBlockFor,
  DAILY_LIFE_FIELDS, PRESERVATION_RULES, PROGRESSION_AFFECTED_FIELDS, REFINEMENT_PASSES,
} from './prompts.ts';
import type { PassContext } from './prompts.ts';
// Re-exported so promptCache.test.ts can keep importing them from ./index.ts.
export { CACHE_BREAKPOINT, buildAnthropicUserContent, stripCacheBreakpoint };

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY') || '';
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || '';

const DEFAULT_MODEL_PREFERENCE = 'anthropic_claude_opus_4_8';
const MODEL_ALIASES: Record<string, string> = {
  claude_best: 'anthropic_claude_opus_4_8',
  claude_fast: 'anthropic_claude_haiku_4_5',
  chatgpt_best: 'openai_gpt_5_2',
  chatgpt_fast: 'openai_gpt_5_mini',
};

type ModelPreference = string;
type ModelPhase = 'thesis' | 'refinement' | 'dailyLife';
type Provider = 'anthropic' | 'openai';

type ModelProfile = {
  provider: Provider;
  thesis: string;
  refinement: string;
  dailyLife: string;
  costTier: 'standard' | 'fast';
};

type AiUsageRecord = {
  featureType: string;
  phase: ModelPhase;
  provider: Provider;
  model: string;
  modelPreference: ModelPreference;
  maxTokens: number;
  inputChars: number;
  outputChars: number;
  /** Real provider-reported tokens when available, else the len/4 floor. */
  inputTokens: number;
  outputTokens: number;
  /** true when inputTokens/outputTokens are the len/4 estimate, not provider-reported. */
  tokensEstimated: boolean;
  estimatedCostUsd: number;
  durationMs: number;
  ok: boolean;
  /** true when a same-tier peer provider served this call after a provider-down fallback. */
  fellBack: boolean;
};

const MODEL_PROFILES: Record<string, ModelProfile> = {
  anthropic_claude_opus_4_8: {
    provider: 'anthropic',
    thesis: Deno.env.get('ANTHROPIC_CLAUDE_OPUS_4_8_MODEL') || 'claude-opus-4-8',
    refinement: Deno.env.get('ANTHROPIC_CLAUDE_OPUS_4_8_MODEL') || 'claude-opus-4-8',
    dailyLife: Deno.env.get('ANTHROPIC_CLAUDE_OPUS_4_8_MODEL') || 'claude-opus-4-8',
    costTier: 'standard',
  },
  anthropic_claude_sonnet_4_6: {
    provider: 'anthropic',
    thesis: Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_6_MODEL') || 'claude-sonnet-4-6',
    refinement: Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_6_MODEL') || 'claude-sonnet-4-6',
    dailyLife: Deno.env.get('ANTHROPIC_CLAUDE_SONNET_4_6_MODEL') || 'claude-sonnet-4-6',
    costTier: 'standard',
  },
  anthropic_claude_haiku_4_5: {
    provider: 'anthropic',
    thesis: Deno.env.get('ANTHROPIC_CLAUDE_HAIKU_4_5_MODEL') || 'claude-haiku-4-5-20251001',
    refinement: Deno.env.get('ANTHROPIC_CLAUDE_HAIKU_4_5_MODEL') || 'claude-haiku-4-5-20251001',
    dailyLife: Deno.env.get('ANTHROPIC_CLAUDE_HAIKU_4_5_MODEL') || 'claude-haiku-4-5-20251001',
    costTier: 'fast',
  },
  openai_gpt_5_2: {
    provider: 'openai',
    thesis: Deno.env.get('OPENAI_GPT_5_2_MODEL') || 'gpt-5.2',
    refinement: Deno.env.get('OPENAI_GPT_5_2_MODEL') || 'gpt-5.2',
    dailyLife: Deno.env.get('OPENAI_GPT_5_2_MODEL') || 'gpt-5.2',
    costTier: 'standard',
  },
  openai_gpt_5_mini: {
    provider: 'openai',
    thesis: Deno.env.get('OPENAI_GPT_5_MINI_MODEL') || 'gpt-5-mini',
    refinement: Deno.env.get('OPENAI_GPT_5_MINI_MODEL') || 'gpt-5-mini',
    dailyLife: Deno.env.get('OPENAI_GPT_5_MINI_MODEL') || 'gpt-5-mini',
    costTier: 'fast',
  },
  openai_gpt_5_nano: {
    provider: 'openai',
    thesis: Deno.env.get('OPENAI_GPT_5_NANO_MODEL') || 'gpt-5-nano',
    refinement: Deno.env.get('OPENAI_GPT_5_NANO_MODEL') || 'gpt-5-nano',
    dailyLife: Deno.env.get('OPENAI_GPT_5_NANO_MODEL') || 'gpt-5-nano',
    costTier: 'fast',
  },
  openai_gpt_4_1: {
    provider: 'openai',
    thesis: Deno.env.get('OPENAI_GPT_4_1_MODEL') || 'gpt-4.1',
    refinement: Deno.env.get('OPENAI_GPT_4_1_MODEL') || 'gpt-4.1',
    dailyLife: Deno.env.get('OPENAI_GPT_4_1_MODEL') || 'gpt-4.1',
    costTier: 'standard',
  },
  openai_gpt_4_1_mini: {
    provider: 'openai',
    thesis: Deno.env.get('OPENAI_GPT_4_1_MINI_MODEL') || 'gpt-4.1-mini',
    refinement: Deno.env.get('OPENAI_GPT_4_1_MINI_MODEL') || 'gpt-4.1-mini',
    dailyLife: Deno.env.get('OPENAI_GPT_4_1_MINI_MODEL') || 'gpt-4.1-mini',
    costTier: 'fast',
  },
};

// CONTRACT_AI_COSTS — mirrored on the client in src/config/pricing.js
// (NEW_AI_COSTS). When you change a number here, change it there too —
// tests/config/pricing.test.js fails loudly on drift.
//
// The reprice from 8/10/12 → 3/4/5 came from the funnel strategy: at
// the old rate even the smallest pack (5 credits / $4.99) wasn't enough
// to try every AI feature once. Buyers couldn't form a habit. The new
// rate is calibrated so the entry-level pack (25 credits / $4.99) lets
// a DM run a full week of campaign prep on a single purchase.
//
// Progression keeps the relative weighting (most expensive) because the
// Opus thesis still sees prior thesis + new state + diff — the input
// context is the actual cost driver, not the output length.
const CREDIT_COSTS: Record<string, number> = {
  narrative:   3,
  dailyLife:   4,
  progression: 5,
  narrative_fast:   2,
  dailyLife_fast:   3,
  progression_fast: 4,
};

const ESTIMATED_AI_PRICES_PER_MTOK: Record<Provider, Record<string, { input: number; output: number }>> = {
  anthropic: {
    opus: { input: 5, output: 25 },
    haiku: { input: 1, output: 5 },
    default: { input: 3, output: 15 },
  },
  openai: {
    mini: { input: 0.4, output: 1.6 },
    default: { input: 2, output: 8 },
  },
};

function estimateTokens(text: string): number {
  return Math.max(1, Math.ceil(String(text || '').length / 4));
}

function priceBucket(provider: Provider, model: string): { input: number; output: number } {
  const normalized = model.toLowerCase();
  if (provider === 'anthropic') {
    if (normalized.includes('opus')) return ESTIMATED_AI_PRICES_PER_MTOK.anthropic.opus;
    if (normalized.includes('haiku')) return ESTIMATED_AI_PRICES_PER_MTOK.anthropic.haiku;
    return ESTIMATED_AI_PRICES_PER_MTOK.anthropic.default;
  }
  if (normalized.includes('mini')) return ESTIMATED_AI_PRICES_PER_MTOK.openai.mini;
  return ESTIMATED_AI_PRICES_PER_MTOK.openai.default;
}

function estimateUsd(provider: Provider, model: string, inputTokens: number, outputTokens: number): number {
  const prices = priceBucket(provider, model);
  return Number((((inputTokens / 1_000_000) * prices.input) + ((outputTokens / 1_000_000) * prices.output)).toFixed(6));
}

// Conservative UP-FRONT token budgets per generation type, used ONLY to size the
// pre-run spend RESERVATION (migration 086). A run is multi-call (thesis +
// refinement, plus several dailyLife beats), so we over-estimate on purpose: the
// reservation is reconciled to the REAL COGS once persistAiUsageEvents writes the
// ai_usage_events rows and the reservation is released. Over-estimating only
// makes the cap admit FEWER concurrent runs (fail toward protection); the real
// committed spend is always the source of truth for the actual ceiling.
const RESERVATION_TOKEN_BUDGET: Record<string, { input: number; output: number }> = {
  // A 'narrative' run fires the thesis + refinement passes AND folds in the 5
  // daily-life beats (each re-sending the grounding) — so its reservation must
  // cover the daily-life work too, else the up-front cap admission structurally
  // under-reserves the real ~15-call run. = the old narrative budget + dailyLife.
  narrative:   { input: 72_000, output: 28_000 },
  dailyLife:   { input: 32_000, output: 12_000 },
  progression: { input: 60_000, output: 16_000 },
};

/**
 * Estimate the worst-case provider COGS (USD) for a whole generation run, to
 * RESERVE against the global spend cap before any model call. Prices the
 * type's conservative token budget at the resolved profile's standard-tier
 * rate. Never throws — an unknown type falls back to the narrative budget.
 * @param preference The authoritative resolved model preference.
 * @param type The generation type ('narrative' | 'dailyLife' | 'progression').
 */
function estimateRunCostUsd(preference: ModelPreference, type: string): number {
  const profile = MODEL_PROFILES[preference] || MODEL_PROFILES[DEFAULT_MODEL_PREFERENCE];
  const budget = RESERVATION_TOKEN_BUDGET[type] || RESERVATION_TOKEN_BUDGET.narrative;
  return estimateUsd(profile.provider, profile.thesis, budget.input, budget.output);
}

function aggregateAiUsage(records: AiUsageRecord[]) {
  const byPhase: Record<string, { calls: number; estimatedCostUsd: number; durationMs: number; inputTokens: number; outputTokens: number }> = {};
  for (const record of records) {
    if (!byPhase[record.phase]) {
      byPhase[record.phase] = {
        calls: 0,
        estimatedCostUsd: 0,
        durationMs: 0,
        inputTokens: 0,
        outputTokens: 0,
      };
    }
    const bucket = byPhase[record.phase];
    bucket.calls += 1;
    bucket.estimatedCostUsd += record.estimatedCostUsd;
    bucket.durationMs += record.durationMs;
    bucket.inputTokens += record.inputTokens;
    bucket.outputTokens += record.outputTokens;
  }
  return {
    calls: records.length,
    failedCalls: records.filter(record => !record.ok).length,
    fallbackCalls: records.filter(record => record.fellBack).length,
    estimatedProviderCostUsd: Number(records.reduce((sum, record) => sum + record.estimatedCostUsd, 0).toFixed(6)),
    inputTokens: records.reduce((sum, record) => sum + record.inputTokens, 0),
    outputTokens: records.reduce((sum, record) => sum + record.outputTokens, 0),
    durationMs: records.reduce((sum, record) => sum + record.durationMs, 0),
    byPhase: Object.fromEntries(Object.entries(byPhase).map(([phase, value]) => [phase, {
      ...value,
      estimatedCostUsd: Number(value.estimatedCostUsd.toFixed(6)),
    }])),
  };
}

/**
 * Persist the per-call COGS rows into ai_usage_events via the SERVICE-ROLE
 * admin client. Best-effort: a metering write failure must NEVER fail the
 * user's generation (log-and-continue). This replaces the old console-only
 * `ai_usage` log line. Writes one row per provider call so margin can be joined
 * back to the spend row.
 * @param admin Service-role Supabase client (writes bypass RLS).
 * @param userId Owning user.
 * @param spendId The credit_ledger spend row that paid for this run (or null).
 * @param records The per-call telemetry accumulated during the stream.
 */
async function persistAiUsageEvents(
  admin: any,
  userId: string,
  spendId: string | null,
  records: AiUsageRecord[],
): Promise<void> {
  if (!records.length) return;
  try {
    const rows = records.map((r) => ({
      user_id: userId,
      feature: r.featureType,
      phase: r.phase,
      provider: r.provider,
      model: r.model,
      model_preference: r.modelPreference,
      input_tokens: r.inputTokens,
      output_tokens: r.outputTokens,
      tokens_estimated: r.tokensEstimated,
      estimated_cost_usd: r.estimatedCostUsd,
      ok: r.ok,
      fellback: r.fellBack,
      duration_ms: r.durationMs,
      spend_id: spendId,
    }));
    const { error } = await admin.from('ai_usage_events').insert(rows);
    if (error) {
      logError('generate-narrative', userId, `ai_usage_events insert failed: ${error.message}`, { stage: 'metering' });
    }
  } catch (e) {
    logError('generate-narrative', userId, e, { stage: 'metering' });
  }
}

function normalizeModelPreference(value: unknown): ModelPreference {
  const raw = typeof value === 'string' ? value : '';
  const key = MODEL_ALIASES[raw] || raw;
  return key in MODEL_PROFILES ? key : DEFAULT_MODEL_PREFERENCE;
}

function spendFeatureFor(type: string, modelPreference: ModelPreference): string {
  const profile = MODEL_PROFILES[normalizeModelPreference(modelPreference)] || MODEL_PROFILES[DEFAULT_MODEL_PREFERENCE];
  return profile.costTier === 'fast' ? `${type}_fast` : type;
}

/**
 * Resolve the AUTHORITATIVE model preference server-side. The client request
 * body is NOT trusted for selection — a crafted request could otherwise pick
 * any model regardless of the saved preference. Resolution order:
 *   1. forced_override (system_config ai_model_preference) — operator kill-switch
 *   2. profiles.model_preference (read from the DB, not the body)
 *   3. global_default (system_config)
 *   4. DEFAULT_MODEL_PREFERENCE
 * Every step is run through normalizeModelPreference so an invalid/dropped key
 * degrades safely to the default rather than throwing.
 * @param admin Service-role client (reads bypass RLS for the config + profile).
 * @param userId The authenticated user's id.
 */
async function resolveModelPreference(admin: any, userId: string): Promise<ModelPreference> {
  let globalDefault: string | null = null;
  let forcedOverride: string | null = null;
  let userPref: string | null = null;

  try {
    const { data: cfg } = await admin
      .from('system_config')
      .select('value')
      .eq('key', 'ai_model_preference')
      .maybeSingle();
    const v = cfg?.value;
    if (v && typeof v === 'object') {
      globalDefault = typeof v.global_default === 'string' ? v.global_default : null;
      forcedOverride = typeof v.forced_override === 'string' ? v.forced_override : null;
    }
  } catch (_) { /* config read failure → fall through to defaults */ }

  // A forced override short-circuits everything (kill-switch / deprecation).
  if (forcedOverride && normalizeModelPreference(forcedOverride) === forcedOverride) {
    return forcedOverride;
  }

  try {
    const { data: profile } = await admin
      .from('profiles')
      .select('model_preference')
      .eq('id', userId)
      .maybeSingle();
    userPref = typeof profile?.model_preference === 'string' ? profile.model_preference : null;
  } catch (_) { /* profile read failure → fall through */ }

  if (userPref && userPref in MODEL_PROFILES) return userPref;
  if (globalDefault && globalDefault in MODEL_PROFILES) return globalDefault;
  return DEFAULT_MODEL_PREFERENCE;
}


// ── CORS ────────────────────────────────────────────────────────────────────
// Origin decision is sourced from the shared allowlist (_shared/cors.ts) so
// the Cloudflare Pages preview origin is accepted and the list never drifts
// per-function. This endpoint advertises POST/OPTIONS.

function getCorsHeaders(req?: Request) {
  return sharedCorsHeaders(req, { methods: 'POST, OPTIONS' });
}

// ── AI fetch with retry + bounded concurrency ────────────────────────────────
// The narrative fires many model calls close together (refinement passes,
// daily-life beats). A burst can exceed the provider's rate / concurrency
// limit and return 429 (or 529 "overloaded"). Without a retry the pass throws,
// that section silently falls back to raw, and the dossier shows only the
// thesis — the "Generate Narrative only writes the identity" bug. Retry
// transient throttle/overload responses with backoff (honoring Retry-After).
// A hung provider socket would otherwise block the whole edge invocation until the
// Supabase runtime wall-clock-kills it — AFTER the user was already debited (the
// credit deduction precedes generation). So every provider fetch carries an
// AbortController with a wall-clock budget: a per-attempt cap (a fresh budget per
// retry) bounded by an overall deadline kept below the edge platform limit. On
// timeout the fetch rejects (AbortError/TimeoutError); the per-pass caller already
// falls back to raw section text, so one slow pass can't hang or 500 the batch.
const PER_ATTEMPT_TIMEOUT_MS = 30_000; // single provider fetch
const TOTAL_BUDGET_MS = 55_000;        // whole call across retries (< edge wall-clock)

// Reject an oversized body up front (mirrors generate-chronicle / ingest-events).
// The settlement payload is client-supplied and the credit charged is fixed
// regardless of input size, so an unbounded body would only inflate the provider
// token bill. Read req.text() with this cap before JSON.parse.
const MAX_BODY_BYTES = 64 * 1024;

/**
 * Refinement passes affected by a progression changeType — OWN-property lookup
 * only. changeType is client-supplied: a prototype-chain name ('constructor',
 * 'toString', …) used to resolve an inherited function via bare indexing —
 * truthy, so `|| []` never applied and `.map` threw inside the progression
 * stream (post-spend, pre-model: refunded, but it burned a rate-limit unit and
 * surfaced a raw internal error in a 200 stream). Unknown change types degrade
 * to the designed thesis-only fallback. Exported for the regression test.
 */
export function progressionAffectedKeys(
  changeType: string,
): Array<keyof typeof REFINEMENT_PASSES> {
  return Object.hasOwn(PROGRESSION_AFFECTED_FIELDS, changeType)
    ? PROGRESSION_AFFECTED_FIELDS[changeType]
    : [];
}

function withTimeout(ms: number): { signal: AbortSignal; cancel: () => void } {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(new DOMException(`provider fetch timed out after ${ms}ms`, 'TimeoutError')), ms);
  return { signal: ctrl.signal, cancel: () => clearTimeout(id) };
}

async function fetchAiWithRetry(url: string, init: RequestInit, maxRetries = 4): Promise<Response> {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  // Each attempt gets its OWN controller+timer (a retry must not inherit a spent
  // budget), capped by whatever remains of the overall deadline. The timer is
  // always cleared so a completed fetch never leaks a pending abort.
  const fetchOnce = async (): Promise<Response> => {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new DOMException('generation budget exceeded', 'TimeoutError');
    const t = withTimeout(Math.min(PER_ATTEMPT_TIMEOUT_MS, remaining));
    try {
      return await fetch(url, { ...init, signal: t.signal });
    } finally {
      t.cancel();
    }
  };

  let res = await fetchOnce();
  for (
    let attempt = 0;
    !res.ok && attempt < maxRetries && [429, 500, 503, 529].includes(res.status);
    attempt++
  ) {
    const retryAfter = Number(res.headers.get('retry-after'));
    const backoffMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? Math.min(15000, retryAfter * 1000)
      : Math.min(8000, 400 * (2 ** attempt)) + Math.floor(Math.random() * 250);
    try { await res.text(); } catch { /* drain the body so the socket frees */ }
    // Don't start a retry we can't finish within the overall budget.
    if (Date.now() + backoffMs >= deadline) break;
    await new Promise(resolve => setTimeout(resolve, backoffMs));
    res = await fetchOnce();
  }
  return res;
}

// Run async workers over items with bounded concurrency, so we don't fire
// every refinement pass at the provider simultaneously and trip its limit.
async function runWithConcurrency<T>(items: T[], limit: number, worker: (item: T) => Promise<void>): Promise<void> {
  const queue = items.slice();
  const size = Math.max(1, Math.min(limit, queue.length));
  const runners = Array.from({ length: size }, async () => {
    for (;;) {
      const next = queue.shift();
      if (next === undefined) return;
      await worker(next);
    }
  });
  await Promise.all(runners);
}

// ── Provider abstraction ──────────────────────────────────────────────────
//
// The complete()-style boundary: each provider impl returns a NORMALIZED
// { text, usage } where usage carries REAL provider-reported token counts when
// present (estimated:false) and falls back to a len/4 floor only when the
// provider omits them (estimated:true). Anthropic and OpenAI are EQUAL
// first-class peers here — neither is "primary"; selection happens in callModel.

type NormalizedUsage = {
  inputTokens: number;
  outputTokens: number;
  /** true when the counts are our len/4 floor, false when provider-reported. */
  estimated: boolean;
};

type CompletionResult = {
  text: string;
  usage: NormalizedUsage;
};

// ── Prompt caching ───────────────────────────────────────────────────────────
// A single narrative run fires 15 calls (1 thesis + 14 refinement passes) and a
// dailyLife run fires 5, EACH re-sending the same multi-thousand-token grounding
// summary + thesis as fresh input. Builders place a CACHE_BREAKPOINT between that
// per-run STABLE prefix (byte-identical across a run's passes) and the per-pass
// VARYING tail. callAnthropic turns the prefix into a cache_control:ephemeral
// content block so passes 2..N read it at ~0.1x input price; callOpenAI strips the
// marker (the Responses API caches identical prefixes automatically). The marker
// is ALWAYS removed before send, so the model receives the exact same text it
// would without caching — the blocks concatenate to the original prompt.
/**
 * Anthropic Messages API impl. Captures real `usage.input_tokens` /
 * `usage.output_tokens` when present; otherwise estimates from char length.
 * @param prompt The full prompt to send as a single user message.
 * @param maxTokens Provider max_tokens budget.
 * @param model Resolved Anthropic model id.
 * @returns Normalized { text, usage }.
 */
async function callAnthropic(prompt: string, maxTokens: number, model: string): Promise<CompletionResult> {
  if (!ANTHROPIC_API_KEY) throw new Error('Anthropic API key is not configured');
  const res = await fetchAiWithRetry('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages: [{ role: 'user', content: buildAnthropicUserContent(prompt) }],
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`AI API error: ${res.status} ${errBody.slice(0, 200)}`);
  }

  const json = await res.json();
  const text = (json.content?.[0]?.text || '').trim();
  return { text, usage: normalizeProviderUsage(json?.usage, prompt, text) };
}

/**
 * OpenAI Responses API impl. The Responses API reports usage as
 * `usage.input_tokens` / `usage.output_tokens` (same field names as Anthropic,
 * different envelope), so normalizeProviderUsage handles both. Falls back to
 * estimate when usage is absent.
 * @param prompt The full prompt to send as the `input`.
 * @param maxTokens Provider max_output_tokens budget.
 * @param model Resolved OpenAI model id.
 * @returns Normalized { text, usage }.
 */
async function callOpenAI(prompt: string, maxTokens: number, model: string): Promise<CompletionResult> {
  if (!OPENAI_API_KEY) throw new Error('OpenAI API key is not configured');
  const res = await fetchAiWithRetry('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model,
      input: stripCacheBreakpoint(prompt),
      max_output_tokens: maxTokens,
    }),
  });

  if (!res.ok) {
    const errBody = await res.text();
    throw new Error(`AI API error: ${res.status} ${errBody.slice(0, 200)}`);
  }

  const json = await res.json();
  const outputText = typeof json.output_text === 'string' ? json.output_text : '';
  let text = outputText.trim();
  if (!text) {
    const content = Array.isArray(json.output)
      ? json.output.flatMap((item: any) => Array.isArray(item?.content) ? item.content : [])
      : [];
    text = content
      .map((item: any) => item?.text || '')
      .filter(Boolean)
      .join('\n')
      .trim();
  }
  return { text, usage: normalizeProviderUsage(json?.usage, prompt, text) };
}

/**
 * Normalize a provider `usage` object into { inputTokens, outputTokens,
 * estimated }. Anthropic and OpenAI Responses both use input_tokens /
 * output_tokens; OpenAI Chat-style sometimes uses prompt_tokens /
 * completion_tokens, so accept both spellings. When no usable counts are
 * present, fall back to the len/4 estimate and flag estimated:true.
 * @param usage Raw provider usage object (may be undefined).
 * @param prompt Prompt text, for the estimate floor.
 * @param output Output text, for the estimate floor.
 */
function normalizeProviderUsage(usage: any, prompt: string, output: string): NormalizedUsage {
  // Count cache reads/writes as input VOLUME so prompt caching can't undercount
  // the spend cap (a cached read still costs ~0.1x, a write ~1.25x; we fold both
  // at full input price — conservative, so the cap trips no later than reality).
  const cacheRead = typeof usage?.cache_read_input_tokens === 'number' ? usage.cache_read_input_tokens : 0;
  const cacheWrite = typeof usage?.cache_creation_input_tokens === 'number' ? usage.cache_creation_input_tokens : 0;
  const inRaw = usage?.input_tokens ?? usage?.prompt_tokens;
  const outRaw = usage?.output_tokens ?? usage?.completion_tokens;
  const inNum = typeof inRaw === 'number' && Number.isFinite(inRaw) ? inRaw + cacheRead + cacheWrite : null;
  const outNum = typeof outRaw === 'number' && Number.isFinite(outRaw) ? outRaw : null;
  if (inNum != null && outNum != null) {
    return { inputTokens: inNum, outputTokens: outNum, estimated: false };
  }
  return {
    inputTokens: inNum ?? estimateTokens(prompt),
    outputTokens: outNum ?? estimateTokens(output),
    estimated: true,
  };
}

/** Same-tier peer for provider-down fallback (deliberately a PEER swap, not a
 *  Claude-primary fallback). Maps a preference to its cross-provider sibling at
 *  the matching cost tier. Returns null when there's no sensible peer. */
const PEER_FALLBACK_PREFERENCE: Record<string, string> = {
  anthropic_claude_opus_4_8: 'openai_gpt_5_2',
  anthropic_claude_sonnet_4_6: 'openai_gpt_5_2',
  anthropic_claude_haiku_4_5: 'openai_gpt_5_mini',
  openai_gpt_5_2: 'anthropic_claude_opus_4_8',
  openai_gpt_5_mini: 'anthropic_claude_haiku_4_5',
  openai_gpt_5_nano: 'anthropic_claude_haiku_4_5',
  openai_gpt_4_1: 'anthropic_claude_opus_4_8',
  openai_gpt_4_1_mini: 'anthropic_claude_haiku_4_5',
};

/** Classify an error as "provider down" (network/timeout/5xx/unconfigured) vs.
 *  a content/usage error. Only provider-down errors justify a peer fallback —
 *  we don't want to silently double-bill a bad-prompt error onto the peer. */
function isProviderDownError(e: unknown): boolean {
  const name = (e as any)?.name || '';
  const msg = (e as Error)?.message || '';
  if (name === 'AbortError' || name === 'TimeoutError') return true;
  if (/not configured/i.test(msg)) return true;
  // fetchAiWithRetry surfaces non-ok statuses as "AI API error: <status> …".
  const m = msg.match(/AI API error:\s*(\d{3})/);
  if (m) {
    const status = Number(m[1]);
    return status >= 500 || status === 429;
  }
  // Bare network failures (DNS, connection reset) throw TypeError from fetch.
  if (name === 'TypeError') return true;
  return false;
}

/** Dispatch a single completion to the provider for `preference`+`phase`. */
function dispatch(preference: ModelPreference, phase: ModelPhase, prompt: string, maxTokens: number): Promise<CompletionResult> {
  const profile = MODEL_PROFILES[preference] || MODEL_PROFILES[DEFAULT_MODEL_PREFERENCE];
  const model = profile[phase];
  return profile.provider === 'openai'
    ? callOpenAI(prompt, maxTokens, model)
    : callAnthropic(prompt, maxTokens, model);
}

/**
 * The normalizing routing wrapper. SELECTS the provider from the resolved
 * preference (a deliberate peer choice), dispatches, and records a usage row.
 * On a PROVIDER-DOWN error (not a content error) it retries ONCE on the
 * same-tier peer provider so a single provider outage doesn't fail the user;
 * the fallback is flagged in the usage record. Returns the prose text.
 * @param usageTelemetry Optional sink the caller drains into ai_usage_events.
 */
async function callModel(
  prompt: string,
  maxTokens: number,
  phase: ModelPhase,
  modelPreference: ModelPreference,
  featureType: string,
  usageTelemetry?: AiUsageRecord[],
): Promise<string> {
  const record = (preference: ModelPreference, started: number, result: CompletionResult | null, ok: boolean, fellBack: boolean) => {
    if (!usageTelemetry) return;
    const profile = MODEL_PROFILES[preference] || MODEL_PROFILES[DEFAULT_MODEL_PREFERENCE];
    const model = profile[phase];
    const usage = result?.usage ?? { inputTokens: estimateTokens(prompt), outputTokens: 0, estimated: true };
    usageTelemetry.push({
      featureType,
      phase,
      provider: profile.provider,
      model,
      modelPreference: preference,
      maxTokens,
      inputChars: prompt.length,
      outputChars: result?.text.length ?? 0,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      tokensEstimated: usage.estimated,
      estimatedCostUsd: estimateUsd(profile.provider, model, usage.inputTokens, usage.outputTokens),
      durationMs: Date.now() - started,
      ok,
      fellBack,
    });
  };

  // ── Primary: the SELECTED preference (peer, not a default) ──
  const startedPrimary = Date.now();
  try {
    const result = await dispatch(modelPreference, phase, prompt, maxTokens);
    record(modelPreference, startedPrimary, result, true, false);
    return result.text;
  } catch (primaryErr) {
    record(modelPreference, startedPrimary, null, false, false);

    // ── Safety-net peer fallback: ONLY on a provider-down class error ──
    const peer = PEER_FALLBACK_PREFERENCE[modelPreference];
    if (!peer || !isProviderDownError(primaryErr)) throw primaryErr;

    const startedPeer = Date.now();
    try {
      const result = await dispatch(peer, phase, prompt, maxTokens);
      record(peer, startedPeer, result, true, true);
      return result.text;
    } catch (peerErr) {
      record(peer, startedPeer, null, false, true);
      // Surface the ORIGINAL error: the user's selected provider is what
      // failed; the peer was a best-effort rescue.
      throw primaryErr;
    }
  }
}


// ── Main handler ────────────────────────────────────────────────────────────

/** Default user-scoped client (anon key + the caller's JWT) — verifies identity
 *  and runs the user-context spend_credits RPC. */
function defaultUserClient(authHeader: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } },
  );
}

/** Default service-role client (the account_is_active gate + the service-role-only
 *  refund_credits RPC). */
function defaultAdminClient() {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
}

// Exported (not just inlined into serve) so the money/AI trust boundary can be
// EXECUTION-tested: index.test.ts feeds requests with injected supabase stubs and
// asserts an inactive account is REJECTED (fail-closed, never spends), and that a
// generation FAILURE refunds via the captured spend_id (refund_credits called with
// that exact ledger row) and does NOT double-spend. `deps` is the optional
// injection seam (userClient verifies the JWT + spends, adminClient gates +
// refunds); production passes nothing so behavior is identical to the previous
// inline handler.
export async function handleGenerateNarrative(
  req: Request,
  deps: {
    userClient?: (authHeader: string) => ReturnType<typeof createClient>;
    adminClient?: () => ReturnType<typeof createClient>;
  } = {},
): Promise<Response> {
  const makeUserClient = deps.userClient ?? defaultUserClient;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Tier 0.10 — obvious-bot guard. Generation is credit-gated, but
  // bots still cost the function budget every time they reach the
  // auth check. Rejecting up front keeps Anthropic API budget and
  // postgres connections from churning on scraper traffic.
  const guard = botGuard(req, 'generate-narrative');
  if (guard.reject) return guard.reject;

  const streamHeaders = {
    ...corsHeaders,
    'Content-Type': 'application/x-ndjson',
    'Cache-Control': 'no-cache, no-transform',
    'X-Content-Type-Options': 'nosniff',
  };

  // Hoisted above the try so the outer catch can RELEASE a reservation taken
  // below (086) on a pre-stream throw. The in-stream `finally` release only runs
  // once the streaming Response is returned; a throw between reserve_ai_spend and
  // that return (rate-limit reject, insufficient credits, pre-stream setup error)
  // would otherwise leak the reservation's global-cap headroom for its full TTL —
  // a reachable DoS (a zero-credit account can flood reserve→insufficient_funds
  // and saturate the shared cap). Reaching the catch means the stream never
  // started, so releasing there cannot double-release.
  let reservationId: string | null = null;

  try {
    // Authenticate
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('Missing authorization header');

    const supabaseUser = makeUserClient(authHeader);
    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) throw new Error('Not authenticated');

    // Parse request — cap the body BEFORE parsing (mirrors generate-chronicle):
    // the credit charged is fixed regardless of input size, so an unbounded
    // settlement payload would only inflate the provider token bill.
    const rawBody = await req.text().catch(() => '');
    // Measure BYTES, not UTF-16 code units — a multi-byte payload (rawBody.length
    // counts code units) would otherwise slip past the intended byte ceiling.
    if (new TextEncoder().encode(rawBody).length > MAX_BODY_BYTES) {
      return new Response(
        JSON.stringify({ error: 'Request body too large' }),
        { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }
    let parsedBody: any;
    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : null;
    } catch {
      throw new Error('Invalid JSON in request body');
    }
    const {
      type,
      settlement,
      settlementId,
      pinnedNpcIds,
      aiGuidance,
      modelPreference,
      relationshipMemoryContext,
      chronicleContext,
      warMoraleContext,
      // Progression-only (AI-4b) — ignored for other types.
      changeType,
      changeLabel,
      priorNarrative,
      priorDailyLife,
    } = parsedBody ?? {};
    if (!type || !['narrative', 'dailyLife', 'progression'].includes(type)) {
      throw new Error('Invalid type. Must be "narrative", "dailyLife", or "progression"');
    }
    if (!settlement) throw new Error('Missing settlement data');
    if (type === 'progression') {
      if (typeof changeType !== 'string' || !changeType) {
        throw new Error('Progression requires changeType');
      }
      if (!priorNarrative || typeof priorNarrative !== 'object') {
        throw new Error('Progression requires priorNarrative (cannot evolve a never-narrated settlement)');
      }
    }
    // Avoid unused-var lint: priorDailyLife is reserved for a future daily-life
    // progression pass. We accept it now so the client contract doesn't have
    // to change when that ships.
    void priorDailyLife;

    // Normalize pinned NPC ids once, so every pass sees the same stable shape.
    const normalizedPinnedNpcIds: string[] = Array.isArray(pinnedNpcIds)
      ? pinnedNpcIds.filter((x: unknown) => x != null).map((x: unknown) => String(x))
      : [];

    // NOTE: `modelPreference` from the request body is NO LONGER trusted for
    // selection — it's resolved server-side below from the DB + system_config.
    // We touch it only to avoid an unused-binding lint and to keep the wire
    // contract back-compatible (the client may still send it; we ignore it).
    void modelPreference;
    const confirmedAiGuidance = typeof aiGuidance === 'string' ? stripGuidanceFences(aiGuidance).trim().slice(0, 4000) : '';
    const confirmedRelationshipMemoryContext = type === 'dailyLife'
      ? sanitizeRelationshipMemoryContext(relationshipMemoryContext)
      : null;
    // §8 M3c — Chronicle grounding for the narrative thesis + daily-life passes.
    const confirmedChronicleContext = (type === 'narrative' || type === 'dailyLife')
      ? sanitizeChronicleContext(chronicleContext)
      : null;

    const supabaseAdmin = makeAdminClient();

    // ── Server-authoritative model selection ──
    // Resolve the preference from forced-override → profiles.model_preference →
    // global default → built-in default. The client body is never trusted here.
    const selectedModelPreference = await resolveModelPreference(supabaseAdmin, user.id);
    const spendFeature = spendFeatureFor(type, selectedModelPreference);
    const cost = CREDIT_COSTS[spendFeature] ?? CREDIT_COSTS[type];

    // ── Trust-boundary gate: reject a banned / disabled / soft-deleted account ──
    // Defense-in-depth (review B16 finding #1): spend_credits (migration 057) ALSO
    // rejects a non-active account, so this is a redundant upfront check — but it
    // keeps a locked account from ever reaching the spend path or the model call.
    // FAIL CLOSED: gate on `!== true`. The RPC returns true only for a confirmed-
    // active account; null (RPC error / unexpected shape) or any non-true value is
    // treated as inactive, so a transient failure can never fail OPEN.
    const { data: isActive, error: activeErr } =
      await supabaseAdmin.rpc('account_is_active', { p_uid: user.id });
    if (activeErr) {
      logError('generate-narrative', user.id, `account_is_active errored: ${activeErr.message}`);
    }
    if (isActive !== true) throw new Error('Account is not active');

    // ── SAFETY 1: hard spend cap — FAIL CLOSED (kill-switch), RACE-SAFE ──
    // Checked BEFORE spend_credits so a capped-out window never debits the user
    // (nothing to refund). This is a GLOBAL cap (reserve_ai_spend sums spend
    // across all users and takes no per-user budget) and applies to EVERYONE,
    // including elevated operators — an unbounded provider bill is the
    // catastrophic failure mode, so even an admin cannot bypass it.
    //
    // We RESERVE (not just read) an estimated cost against the cap: the COGS row
    // is only written in the stream's `finally`, so N concurrent runs that all
    // read the same stale committed total would otherwise all see headroom and
    // collectively blow past the cap (migration 086). reserve_ai_spend instead
    // counts committed COGS + OUTSTANDING reservations atomically, so two
    // concurrent runs can't both pass when the second would cross the cap. The
    // reservation is RELEASED in the stream's `finally` once the real COGS row
    // lands. We BLOCK on the RPC erroring or returning a non-true `allowed` —
    // the opposite default from the per-user limiter, which fails OPEN.
    const spendEstimate = estimateRunCostUsd(selectedModelPreference, type);
    const { data: capResult, error: capErr } =
      await supabaseAdmin.rpc('reserve_ai_spend', { p_user: user.id, p_estimate: spendEstimate });
    if (capErr) {
      logError('generate-narrative', user.id, `reserve_ai_spend errored: ${capErr.message}`, { stage: 'spend-cap' });
    }
    const capAllowed = (capResult as { allowed?: boolean } | null)?.allowed === true;
    if (!capAllowed) {
      // Graceful degrade: a clean "temporarily unavailable", not a crash. No
      // credits were charged (this is before the spend), so nothing to refund.
      throw new Error('AI generation is temporarily unavailable (daily capacity reached). No credits were charged — please try again later.');
    }
    // The reservation id to settle in the `finally` once the real COGS lands, or
    // in the outer catch on a pre-stream throw. Null when the operator kill-switch
    // is off (no reservation held). Assigns the hoisted handler-scope binding.
    reservationId =
      (capResult as { reservation_id?: string | null } | null)?.reservation_id ?? null;

    // ── SUFFICIENCY PRECHECK: don't burn a rate-limit unit on a doomed spend ──
    // The per-user/day rate limit below INCREMENTS a counter (consume, not peek;
    // there is no decrement RPC). spend_credits runs AFTER it and is the atomic
    // authority on funds. If the user can't afford this run, spend_credits would
    // throw insufficient_funds — but only after the rate-limit unit was already
    // consumed, so a low-balance user retrying erodes their 60/day quota for free.
    //
    // To stop that, do a CHEAP read-only sufficiency check here and reject BEFORE
    // consuming the unit. This is a guard, NOT the authority: spend_credits below
    // still does the race-safe compare-and-decrement (a balance change between
    // this read and the spend is caught there). Elevated/privileged operators
    // never debit credits, so they SKIP this check (their balance is irrelevant).
    // FAIL OPEN on any RPC error: a precheck outage must never block a legitimate
    // user — spend_credits remains the real gate, and a missed precheck only costs
    // the pre-existing (unfixed) behaviour, never a wrongful block.
    {
      const { data: precheckPrivileged, error: privErr } =
        await supabaseUser.rpc('current_user_is_privileged');
      if (privErr) {
        logError('generate-narrative', user.id, `current_user_is_privileged errored: ${privErr.message}`, { stage: 'sufficiency-precheck' });
      } else if (precheckPrivileged !== true) {
        const { data: precheckBalance, error: balErr } =
          await supabaseAdmin.rpc('get_credit_balance', { target_user: user.id });
        if (balErr) {
          logError('generate-narrative', user.id, `get_credit_balance errored: ${balErr.message}`, { stage: 'sufficiency-precheck' });
        } else if (typeof precheckBalance === 'number' && precheckBalance < cost) {
          // Same message shape as the spend_credits insufficient-funds throw below,
          // so the client UI is unchanged — only the rate-limit unit is spared.
          throw new Error(`Insufficient credits. Need ${cost}, have ${precheckBalance}.`);
        }
      }
    }

    // ── SAFETY 2: per-user/day rate limit — FAIL OPEN ──
    // One abusive account can't drain the shared provider pool. A limiter
    // OUTAGE must never block a legitimate paying user (same rationale as
    // migration 035), so an RPC error is treated as allowed. The default limit
    // (60/day) is far above a heavy DM's real usage; elevation isn't known yet
    // (it comes from the spend result below) so the limit applies uniformly.
    {
      const { data: rlResult, error: rlErr } =
        await supabaseAdmin.rpc('consume_ai_generate_rate_limit', { p_user: user.id });
      if (rlErr) {
        // FAIL OPEN: log and proceed. Do not block on a limiter outage.
        logError('generate-narrative', user.id, `consume_ai_generate_rate_limit errored: ${rlErr.message}`, { stage: 'rate-limit' });
      } else if ((rlResult as { allowed?: boolean } | null)?.allowed === false) {
        throw new Error('You have reached today\'s AI generation limit. Please try again tomorrow. No credits were charged.');
      }
    }

    // ── Atomic credit spend via the spend_credits RPC (migration 009) ──
    // Tier 9.9 audit plan #3 — the spend uses the RPC as the only path.
    // The legacy read-then-write fallback was dropped after migration
    // 009 was confirmed in production: silent racy direct writes are
    // strictly worse than a loud RPC failure (which the client can
    // retry / the user can ticket support on).
    //
    // The RPC runs SECURITY DEFINER and performs a single compare-and-
    // decrement that is race-safe even under concurrent calls. It
    // returns { ok, balance, spend_id, elevated } on success or
    // { ok: false, reason, balance } on insufficient funds.
    //
    // We capture spend_id so the refund path targets the exact ledger
    // row this spend created — no "find the most recent spend"
    // guesswork and no balance-restoration race with intervening
    // transactions.
    let isElevated = false;
    let postSpendBalance = 0;          // canonical post-spend balance for streaming responses
    let spendId: string | null = null;

    const { data: spendResult, error: spendErr } = await supabaseUser.rpc('spend_credits', {
      feature: spendFeature,
    });

    if (spendErr) {
      // Log the raw RPC message server-side, but throw a GENERIC user-facing
      // error (the outer catch surfaces it to the client) — the raw spend_credits
      // message can carry Postgres function/constraint names (L8 info-disclosure).
      logError('generate-narrative', user.id, `spend_credits RPC errored: ${spendErr.message}`, { stage: 'spend' });
      throw new Error('Credit spend failed. Try again — no credits were charged.');
    }
    if (!spendResult) {
      throw new Error('Credit spend returned no result. Try again — no credits were charged.');
    }

    const result = spendResult as {
      ok: boolean; reason?: string; balance: number; spend_id?: string; elevated?: boolean;
    };
    if (!result.ok) {
      // Most common reason: insufficient_funds. Surface the balance so
      // the client UI can show "need N more credits" cleanly.
      throw new Error(`Insufficient credits. Need ${cost}, have ${result.balance}.`);
    }
    isElevated = Boolean(result.elevated);
    spendId = result.spend_id || null;
    // For elevated users the RPC returns balance=-2 as a sentinel — we
    // surface a friendlier "unlimited" value to the client (Infinity
    // isn't JSON-serializable, so use a high integer).
    postSpendBalance = result.elevated ? 999999 : result.balance;

    // Tier 6.8 — augment the bespoke summary with the structured
    // grounding envelope so the AI sees locked entities + user edits.
    // The credit spend already committed (line ~2006) but the refund closure
    // below is only reachable once the stream starts — so wrap the pre-stream
    // construction and refund (service-role) before re-throwing, otherwise a
    // throw here leaves the user charged with no refund.
    let summary: Record<string, unknown>;
    let dynamicPreservation: string;
    try {
      const baseSummary = augmentSummaryWithGrounding(
        settlement as Record<string, unknown>,
        summarizeSettlement(settlement as Record<string, unknown>),
      );
      summary = confirmedRelationshipMemoryContext
        ? { ...baseSummary, relationshipMemory: confirmedRelationshipMemoryContext }
        : baseSummary;
      // P5 war-morale grounding: a compact { resolve/hope/supply/faith/sentiment } digest the
      // client sends ONLY under its warEconomySurfacing flag. Sanitized + fence-stripped here
      // (untrusted input reaching the prompt); it rides the summary as an underscore grounding
      // key (like _lockedEntities), so it reaches BOTH the thesis and daily-life prompts, which
      // both embed the summary. Absent/empty ⇒ no `_warMorale` key ⇒ the prompt is byte-identical.
      const warMorale = sanitizeWarMoraleContext(warMoraleContext);
      if (warMorale) summary = { ...summary, _warMorale: warMorale };
      // Per-call preservation block — adds settlement-specific MUST
      // PRESERVE lines on top of the static PRESERVATION_RULES. Threaded
      // into refinement-pass prompt building below.
      dynamicPreservation = preservationBlockFor(settlement);
    } catch (e) {
      if (!isElevated && spendId) {
        // The supabase RPC builder is a thenable, not a real Promise (no `.catch`);
        // await it and inspect `error`. A failed pre-stream refund leaves the user
        // charged, so it's logged as a structured line for alerting.
        try {
          const { error: refundErr } = await supabaseAdmin.rpc('refund_credits', {
            spend_ledger_row: spendId,
            refund_reason: 'pre-stream setup failed',
          });
          if (refundErr) {
            logError('generate-narrative', user.id, refundErr.message, {
              stage: 'pre-stream-refund', spend_id: spendId,
            });
          }
        } catch (refundErr) {
          logError('generate-narrative', user.id, refundErr, {
            stage: 'pre-stream-refund', spend_id: spendId,
          });
        }
      }
      throw e;
    }
    // Optional debug spine. The summarizer is exposed for future
    // logging hooks (e.g. "what went into the prompt for save X?")
    // without changing the wire format.
    void summarizeGroundingPayload;
    const usageTelemetry: AiUsageRecord[] = [];

    // Streaming NDJSON response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const send = (obj: unknown) => {
          try {
            controller.enqueue(encoder.encode(JSON.stringify(obj) + '\n'));
          } catch (_) { /* controller already closed */ }
        };

        const refund = async () => {
          if (isElevated) return;
          // Tier 9.9 audit plan #4 — dropped the legacy fallback. The
          // refund_credits RPC writes a NEW grant row that references
          // the originating spend; it's idempotent and safe under
          // concurrent transactions. If the RPC errors, we surface
          // the failure in logs + the stream (rather than falling
          // back to a racy direct write that would either double-
          // credit or silently swallow the refund).
          if (!spendId) {
            console.error('[generate-narrative] refund requested but no spend_id captured — RPC spend path must have been bypassed');
            return;
          }
          try {
            // Refund via the SERVICE-ROLE client: refund_credits is granted only
            // to service_role (migration 033) so a user can't self-refund a
            // SUCCESSFUL spend for free generations. The server reaches this path
            // only on genuine generation failure.
            const { error: refundErr } = await supabaseAdmin.rpc('refund_credits', {
              spend_ledger_row: spendId,
              refund_reason: 'generation failed mid-stream',
            });
            if (refundErr) {
              // Loud failure. The user got partial value (the spend
              // happened) and the refund didn't land — a support
              // ticket is the right resolution, not a silent racy
              // direct write that could compound the inconsistency. The
              // structured line makes the stuck refund greppable + alertable.
              logError('generate-narrative', user.id, refundErr.message, {
                stage: 'refund', spend_id: spendId,
              });
              send({
                refund: 'failed',
                spend_id: spendId,
                reason: refundErr.message,
                supportNote: 'The credits were not refunded automatically. Contact support with this spend_id.',
              });
            }
          } catch (refundErr) {
            logError('generate-narrative', user.id, refundErr, {
              stage: 'refund', spend_id: spendId,
            });
          }
        };

        try {
          // ── DAILY LIFE: 5 parallel Opus paragraphs ────────────────────────
          if (type === 'dailyLife') {
            const entries = Object.entries(DAILY_LIFE_FIELDS);
            send({ status: 'started', type, totalFields: entries.length });
            const results: Record<string, string> = {};
            let firstError: Error | null = null;

            await Promise.all(entries.map(async ([fieldName, cfg]) => {
              try {
                const prompt = buildDailyLifePrompt(cfg.instruction, summary, confirmedAiGuidance, confirmedRelationshipMemoryContext, confirmedChronicleContext);
                const value = await callModel(prompt, cfg.max_tokens, 'dailyLife', selectedModelPreference, type, usageTelemetry);
                results[fieldName] = value;
                send({ field: fieldName, value });
              } catch (e) {
                if (!firstError) firstError = e as Error;
                logError('generate-narrative', user.id, `field '${fieldName}' failed: ${(e as Error).message}`, { stage: 'stream' });
                send({ field: fieldName, error: 'This section could not be generated.' });
              }
            }));

            if (firstError) {
              // dailyLife has no thesis — any of its atomic paragraphs failing is
              // fatal, so the policy refunds (shouldRefundOnFailure('dailyLifeField')).
              if (shouldRefundOnFailure('dailyLifeField')) await refund();
              const aiUsage = aggregateAiUsage(usageTelemetry);
              console.warn('[generate-narrative] ai_usage_failed', JSON.stringify(aiUsage));
              logError('generate-narrative', user.id, `narration failed: ${(firstError as Error).message}`, { stage: 'stream' });
              send({ error: 'Narration failed.', refunded: !isElevated, aiUsage });
            } else {
              const aiUsage = aggregateAiUsage(usageTelemetry);
              console.info('[generate-narrative] ai_usage', JSON.stringify(aiUsage));
              send({
                done: true,
                result: results,
                creditsRemaining: postSpendBalance,
                type,
                aiUsage,
              });
            }
            controller.close();
            return;
          }

          // ── PROGRESSION: thesis + subset of refinement passes ─────────────
          if (type === 'progression') {
            const affectedKeys = progressionAffectedKeys(changeType);
            // Filter to passes that actually exist (defensive against future
            // changes to either map).
            const affectedEntries = affectedKeys
              .map((k) => [k, REFINEMENT_PASSES[k]] as const)
              .filter(([, spec]) => !!spec);

            send({
              status: 'started',
              type,
              totalFields: 1 + affectedEntries.length,
              phase: 'thesis',
              changeType,
              changeLabel: typeof changeLabel === 'string' ? changeLabel : '',
            });

            // Phase 1: Opus thesis grounded in prior thesis + changeLabel
            let thesis: string;
            try {
              const priorThesis = typeof priorNarrative?.thesis === 'string' ? priorNarrative.thesis : '';
              thesis = await callModel(
                buildProgressionThesisPrompt(
                  priorThesis,
                  typeof changeLabel === 'string' ? changeLabel : '',
                  summary,
                  confirmedAiGuidance,
                ),
                600,
                'thesis',
                selectedModelPreference,
                type,
                usageTelemetry,
              );
            } catch (e) {
              if (shouldRefundOnFailure('thesis')) await refund();
              const aiUsage = aggregateAiUsage(usageTelemetry);
              console.warn('[generate-narrative] ai_usage_failed', JSON.stringify(aiUsage));
              logError('generate-narrative', user.id, `progression thesis failed: ${(e as Error).message}`, { stage: 'stream' });
              send({ error: 'Progression thesis failed. No new credits were charged.', refunded: !isElevated, aiUsage });
              controller.close();
              return;
            }

            // Start clone from new settlement, then overlay prior refined prose
            // so non-affected passes keep their text. Affected passes will
            // overwrite the relevant fields with evolved prose.
            const aiClone = deepClone(settlement);
            overlayPriorRefinedProse(aiClone, priorNarrative);
            aiClone.thesis = thesis;
            send({ field: 'thesis', value: thesis });

            // Phase 2: run affected passes with priorValue threading.
            const passCtx: PassContext = { pinnedNpcIds: normalizedPinnedNpcIds };
            send({ status: 'phase', phase: 'refinements', total: affectedEntries.length });
            const failedFields: string[] = [];
            const succeededFields: string[] = [];
            const skippedFields: string[] = [];

            await Promise.all(affectedEntries.map(async ([key, spec]) => {
              try {
                const payload = spec.extract(settlement, passCtx);
                if (isEmptyPayload(payload)) {
                  skippedFields.push(key);
                  return;
                }
                const priorValue = spec.extract(priorNarrative, passCtx);
                const prompt = buildRefinementPrompt(
                  spec.instruction,
                  thesis,
                  summary,
                  payload,
                  isEmptyPayload(priorValue) ? undefined : priorValue,
                  typeof changeLabel === 'string' ? changeLabel : undefined,
                  dynamicPreservation,
                  confirmedAiGuidance,
                );
                const raw = await callModel(prompt, spec.max_tokens, 'refinement', selectedModelPreference, type, usageTelemetry);
                const parsed = safeJsonParse(raw);

                // Silent-shape-mismatch detection (see narrative loop above).
                const beforeSnapshot = spec.snapshotPath.startsWith('__')
                  ? null
                  : JSON.stringify(getByPath(aiClone, spec.snapshotPath));

                spec.apply(aiClone, parsed);
                succeededFields.push(key);

                if (beforeSnapshot !== null) {
                  const after = getByPath(aiClone, spec.snapshotPath);
                  if (!applyMutated(beforeSnapshot, after)) {
                    console.warn(
                      `[generate-narrative] progression pass '${key}' produced no mutation despite valid response. ` +
                      `Likely JSON shape mismatch. Raw response (truncated): ${raw.slice(0, 500)}`,
                    );
                  }
                }

                const path = spec.snapshotPath.startsWith('__') ? key : spec.snapshotPath;
                const snapshot = spec.snapshotPath.startsWith('__')
                  ? { ok: true }
                  : getByPath(aiClone, spec.snapshotPath);
                send({ field: path, value: snapshot });
              } catch (e) {
                failedFields.push(key);
                console.error(`[generate-narrative] progression pass '${key}' failed:`, (e as Error).message);
                send({ field: key, error: 'This section could not be generated.' });
              }
            }));

            // Entity-link layer (same deterministic pass as the narrative
            // branch) over the evolved prose before it streams home.
            wrapEntityRefsInProse(aiClone);

            const aiUsage = aggregateAiUsage(usageTelemetry);
            console.info('[generate-narrative] ai_usage', JSON.stringify(aiUsage));
            send({
              done: true,
              result: aiClone,
              creditsRemaining: postSpendBalance,
              type,
              changeType,
              partialFailure: failedFields.length > 0,
              failedFields,
              succeededFields,
              skippedFields,
              aiUsage,
            });
            // Advisory AI-invention signal (logging-only) — same contract as the narrative
            // path: AFTER send({done}), wrapped so it can never throw into the refund catch-all.
            try {
              if ((globalThis as any).Deno?.env?.get?.('AI_INVENTION_SIGNAL') !== 'off') {
                const sig = scanProseForInvention(proseFieldsOf(aiClone), collectFullCanon(aiClone), confirmedAiGuidance);
                if (sig.count > 0) console.warn('[generate-narrative] ai_invention_signal', JSON.stringify({ where: 'progression', count: sig.count, samples: sig.samples }));
              }
            } catch { /* advisory only — must never affect generation or the money path */ }
            controller.close();
            return;
          }

          // ── NARRATIVE: thesis + refinement passes ─────────────────────────
          const passEntries = Object.entries(REFINEMENT_PASSES);
          const totalFields = 1 + passEntries.length; // thesis + 9 passes

          send({ status: 'started', type, totalFields, phase: 'thesis' });

          // Phase 1: Opus thesis
          let thesis: string;
          try {
            thesis = await callModel(
              buildThesisPrompt(summary, confirmedAiGuidance, confirmedChronicleContext),
              600,
              'thesis',
              selectedModelPreference,
              type,
              usageTelemetry,
            );
          } catch (e) {
            if (shouldRefundOnFailure('thesis')) await refund();
            const aiUsage = aggregateAiUsage(usageTelemetry);
            console.warn('[generate-narrative] ai_usage_failed', JSON.stringify(aiUsage));
            send({ error: 'Thesis generation failed.', refunded: !isElevated, aiUsage });
            controller.close();
            return;
          }

          const aiClone = deepClone(settlement);
          aiClone.thesis = thesis;
          send({ field: 'thesis', value: thesis });

          // Phase 2: run all refinement passes in parallel
          send({ status: 'phase', phase: 'refinements', total: passEntries.length });
          const failedFields: string[] = [];
          const succeededFields: string[] = [];
          const skippedFields: string[] = [];

          const passCtx: PassContext = { pinnedNpcIds: normalizedPinnedNpcIds };
          // Bounded concurrency so the refinement burst doesn't trip the
          // provider's rate limit and fail every section (leaving only the
          // thesis). Each call also retries transient 429/overload via
          // fetchAiWithRetry.
          await runWithConcurrency(passEntries, 3, async ([key, spec]) => {
            try {
              const payload = spec.extract(settlement, passCtx);
              if (isEmptyPayload(payload)) {
                skippedFields.push(key);
                return;
              }

              const prompt = buildRefinementPrompt(spec.instruction, thesis, summary, payload, undefined, undefined, dynamicPreservation, confirmedAiGuidance);
              const raw = await callModel(prompt, spec.max_tokens, 'refinement', selectedModelPreference, type, usageTelemetry);
              const parsed = safeJsonParse(raw);

              // Silent-shape-mismatch detection: snapshot the field before apply,
              // then check whether apply actually wrote anything. Synthetic paths
              // ('__opening' etc.) write to multiple keys and we don't track them
              // here — log only for concrete snapshotPath passes.
              const beforeSnapshot = spec.snapshotPath.startsWith('__')
                ? null
                : JSON.stringify(getByPath(aiClone, spec.snapshotPath));

              spec.apply(aiClone, parsed);
              succeededFields.push(key);

              if (beforeSnapshot !== null) {
                const after = getByPath(aiClone, spec.snapshotPath);
                if (!applyMutated(beforeSnapshot, after)) {
                  console.warn(
                    `[generate-narrative] pass '${key}' produced no mutation despite valid response. ` +
                    `Likely JSON shape mismatch. Raw response (truncated): ${raw.slice(0, 500)}`,
                  );
                }
              }

              // Stream the snapshot. For synthetic paths (starting with '__')
              // we use the pass key as the field name; the client only uses
              // this to drive progress, not to overwrite data (done event is
              // authoritative).
              const path = spec.snapshotPath.startsWith('__') ? key : spec.snapshotPath;
              const snapshot = spec.snapshotPath.startsWith('__')
                ? { ok: true }
                : getByPath(aiClone, spec.snapshotPath);
              send({ field: path, value: snapshot });
            } catch (e) {
              failedFields.push(key);
              console.error(`[generate-narrative] pass '${key}' failed:`, (e as Error).message);
              send({ field: key, error: 'This section could not be generated.' });
            }
          });

          // Phase 3: daily-life beats, folded into the SAME narrative run.
          // A narrative run now also produces dawn→night daily life under the
          // single narrative spend (no second spend_credits). The beats stream
          // as their own `dailyLife.<beat>` per-field messages so the client
          // routes them into aiDailyLife state, and the final `done` carries a
          // `dailyLife` object as the authoritative payload.
          //
          // Partial-failure policy mirrors the refinement passes above: a beat
          // that fails is recorded in failedFields (and surfaced as a per-field
          // error so the UI can note the fallback) but does NOT fail the run and
          // does NOT trigger a refund. The user already got the thesis + prose,
          // and re-running narrative would double-charge — so a stranded beat is
          // a partial result, not a refundable failure.
          send({ status: 'phase', phase: 'dailyLife', total: Object.keys(DAILY_LIFE_FIELDS).length });
          const dailyLife: Record<string, string> = {};
          await runWithConcurrency(Object.entries(DAILY_LIFE_FIELDS), 3, async ([beat, cfg]) => {
            try {
              const prompt = buildDailyLifePrompt(
                cfg.instruction,
                summary,
                confirmedAiGuidance,
                confirmedRelationshipMemoryContext,
                confirmedChronicleContext,
              );
              const value = await callModel(prompt, cfg.max_tokens, 'dailyLife', selectedModelPreference, type, usageTelemetry);
              dailyLife[beat] = value;
              succeededFields.push(`dailyLife.${beat}`);
              send({ field: `dailyLife.${beat}`, value });
            } catch (e) {
              failedFields.push(`dailyLife.${beat}`);
              console.error(`[generate-narrative] daily-life beat '${beat}' failed:`, (e as Error).message);
              send({ field: `dailyLife.${beat}`, error: 'This section could not be generated.' });
            }
          });

          // Deterministic entity-link layer: wrap known entity names in the
          // refined free-form prose (thesis, tab notes, NPC bios) with id-bearing
          // tokens. Pure post-processing over the merged clone — structured
          // mentions and non-prose fields are untouched, and a re-generation
          // overwrites rather than accumulates.
          wrapEntityRefsInProse(aiClone);

          const aiUsage = aggregateAiUsage(usageTelemetry);
          console.info('[generate-narrative] ai_usage', JSON.stringify(aiUsage));
          send({
            done: true,
            result: aiClone,
            // Daily life rides home in the narrative `done` so the client can
            // persist both halves of the single run. Object may be partial if a
            // beat failed (see policy above); empty only if every beat failed.
            dailyLife,
            creditsRemaining: postSpendBalance,
            type,
            partialFailure: failedFields.length > 0,
            failedFields,
            succeededFields,
            skippedFields,
            aiUsage,
          });
          // Advisory AI-invention signal (logging-only; disable with AI_INVENTION_SIGNAL=off).
          // AFTER send({done}) and wrapped so it can NEVER throw into the stream's catch-all
          // refund() below — a throw here would spuriously refund a successful paid run.
          try {
            if ((globalThis as any).Deno?.env?.get?.('AI_INVENTION_SIGNAL') !== 'off') {
              const sig = scanProseForInvention(proseFieldsOf(aiClone), collectFullCanon(aiClone), confirmedAiGuidance);
              if (sig.count > 0) console.warn('[generate-narrative] ai_invention_signal', JSON.stringify({ where: 'narrative', count: sig.count, samples: sig.samples }));
            }
          } catch { /* advisory only — must never affect generation or the money path */ }
          controller.close();
        } catch (err) {
          await refund();
          const msg = err instanceof Error ? err.message : 'Unknown error';
          console.error('[generate-narrative] stream error:', msg);
          const aiUsage = aggregateAiUsage(usageTelemetry);
          console.warn('[generate-narrative] ai_usage_failed', JSON.stringify(aiUsage));
          send({ error: msg, refunded: !isElevated, aiUsage });
          controller.close();
        } finally {
          // COGS metering: persist EVERY provider call (success or failure) into
          // ai_usage_events via the service-role admin client. This runs once
          // per generation regardless of which terminal branch fired, and is
          // best-effort (persistAiUsageEvents swallows + logs its own errors) so
          // a metering write can never fail the user's already-streamed result.
          // Elevated runs still record COGS (the spend was free, but the tokens
          // weren't) — spendId is null for those, which is correct.
          await persistAiUsageEvents(supabaseAdmin, user.id, spendId, usageTelemetry);

          // RECONCILE the pre-run reservation (migration 086): now that the real
          // COGS row(s) above are the committed source of truth, the estimated
          // reservation's headroom hold is redundant, so RELEASE it. Best-effort
          // and AFTER the persist — the release_ai_spend_reservation RPC is
          // idempotent + null-safe (a missing / already-expired / null id is a
          // no-op), so a failure here can never fail the user's streamed result.
          // A leaked reservation (release miss) self-heals via expires_at +
          // cleanup_ai_spend_reservations; it only briefly under-counts headroom.
          //
          // ORDER IS DELIBERATE — persist BEFORE release, never the reverse.
          // Between these two calls a concurrent reserve_ai_spend momentarily
          // counts this run TWICE: the committed COGS rows (just persisted) PLUS
          // the still-held reservation. That double-count over-counts headroom,
          // so the only risk is the cap admitting FEWER concurrent runs in that
          // sliver — it fails SAFE (over-block, never over-admit). Releasing
          // first would invert the window: the reservation would be gone before
          // the COGS landed, briefly UNDER-counting the cap and opening an
          // over-ADMIT window (an unbounded-bill hazard). So we eat the harmless
          // brief over-count and keep persist-before-release. Do not reorder.
          if (reservationId) {
            const { error: relErr } =
              await supabaseAdmin.rpc('release_ai_spend_reservation', { p_id: reservationId });
            if (relErr) {
              logError('generate-narrative', user.id, `release_ai_spend_reservation errored: ${relErr.message}`, { stage: 'spend-cap' });
            }
          }
        }
      },
    });

    return new Response(stream, { headers: streamHeaders });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : undefined;
    logError('generate-narrative', null, message, { stage: 'pre-stream', stack });
    // Release a reservation taken before this throw (086). Reaching this catch
    // means the streaming Response was never returned, so the in-stream `finally`
    // release will never fire and the headroom would leak for the full TTL.
    // Idempotent + null-safe + best-effort: a release failure must not change the
    // user-facing error. No double-release (the stream never started).
    if (reservationId) {
      try {
        await makeAdminClient().rpc('release_ai_spend_reservation', { p_id: reservationId });
      } catch (relErr) {
        logError('generate-narrative', null, `reservation release on pre-stream error failed: ${relErr instanceof Error ? relErr.message : String(relErr)}`, { stage: 'spend-cap' });
      }
    }
    // Pass the message through: the intentional pre-stream errors here are
    // user-facing and safe to show ('Account is not active', 'Insufficient
    // credits. Need N…'). The ONE path that embedded a raw RPC message
    // (spend_credits failure) is genericized at its THROW site below and logged
    // server-side, so raw Postgres internals never reach the client.
    return new Response(
      JSON.stringify({ error: message }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  }
}

// Wrap in a 1-arg lambda so the handler's optional `deps` param doesn't clash with
// std/http's Handler signature (req, connInfo) — `deno check` (check:edge) flags a
// direct `serve(handler)` as a Handler-shape mismatch. The deps default applies.
serve((req) => handleGenerateNarrative(req));
