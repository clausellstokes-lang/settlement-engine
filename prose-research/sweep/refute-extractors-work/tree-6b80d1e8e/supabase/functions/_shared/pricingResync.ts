/**
 * pricingResync — the deterministic core of the `ai_pricing_resync` admin action.
 *
 * Everything in this module is PURE and unit-tested (pricingResync.test.ts): the
 * two provider-page parsers, the price-book merge with its guards, the COGS
 * aggregation, and the credit-cost calibration. `index.ts` stays thin — it does
 * the auth gate, the two provider fetches (Promise.allSettled + 10s abort), the
 * config reads/writes, and the audit, then delegates the math here.
 *
 * The one composed entry point that does touch the world — runPricingResync —
 * takes its side effects INJECTED ({fetchText, adminClient, now}) so it too is
 * testable without Deno.env / real fetch / a live database. It never fetches or
 * reads env directly.
 *
 * Shapes are fixed by the shared contract (see the ai_price_book / ai_credit_costs
 * / ai_pricing_knobs jsonb schemas in migration 114 + the client creditsSlice).
 * When you change a key here, change it there — the SQL RPC + client both read it.
 */

// ── Contract constants ───────────────────────────────────────────────────────

/**
 * The 8 model profile keys — EXACTLY the MODEL_PROFILES keys in
 * generate-narrative/index.ts. Order is the seed/display order; the resync only
 * ever reads/writes these keys in the price book + credit-cost profiles.
 */
export const PROFILE_KEYS = [
  "anthropic_claude_opus_4_8",
  "anthropic_claude_sonnet_4_6",
  "anthropic_claude_haiku_4_5",
  "openai_gpt_5_2",
  "openai_gpt_5_mini",
  "openai_gpt_5_nano",
  "openai_gpt_4_1",
  "openai_gpt_4_1_mini",
] as const;

export type ProfileKey = (typeof PROFILE_KEYS)[number];

/** The three calibrated features. Chronicle is EXCLUDED from this system entirely. */
export const CALIBRATED_FEATURES = ["narrative", "dailyLife", "progression"] as const;
export type CalibratedFeature = (typeof CALIBRATED_FEATURES)[number];

/**
 * Static profile → provider/model metadata, mirroring MODEL_PROFILES. Kept here
 * (not imported from generate-narrative) so this module is self-contained and the
 * admin bundle doesn't drag in the whole narrative handler. modelId is the DEFAULT
 * model string; env overrides in generate-narrative don't change pricing identity.
 */
export const PROFILE_MODELS: Record<ProfileKey, { provider: "anthropic" | "openai"; modelId: string }> = {
  anthropic_claude_opus_4_8: { provider: "anthropic", modelId: "claude-opus-4-8" },
  anthropic_claude_sonnet_4_6: { provider: "anthropic", modelId: "claude-sonnet-4-6" },
  anthropic_claude_haiku_4_5: { provider: "anthropic", modelId: "claude-haiku-4-5-20251001" },
  openai_gpt_5_2: { provider: "openai", modelId: "gpt-5.2" },
  openai_gpt_5_mini: { provider: "openai", modelId: "gpt-5-mini" },
  openai_gpt_5_nano: { provider: "openai", modelId: "gpt-5-nano" },
  openai_gpt_4_1: { provider: "openai", modelId: "gpt-4.1" },
  openai_gpt_4_1_mini: { provider: "openai", modelId: "gpt-4.1-mini" },
};

/**
 * costTier per profile, mirroring MODEL_PROFILES. Drives the credit-cost SEED
 * (standard = 3/4/5, fast = 2/3/4). Only used to synthesize a fallback when the
 * ai_credit_costs row is missing; the resync itself calibrates from usage.
 */
export const PROFILE_COST_TIER: Record<ProfileKey, "standard" | "fast"> = {
  anthropic_claude_opus_4_8: "standard",
  anthropic_claude_sonnet_4_6: "standard",
  anthropic_claude_haiku_4_5: "fast",
  openai_gpt_5_2: "standard",
  openai_gpt_5_mini: "fast",
  openai_gpt_5_nano: "fast",
  openai_gpt_4_1: "standard",
  openai_gpt_4_1_mini: "fast",
};

/** SEED credit costs by tier — the ai_credit_costs fallback (see the contract). */
export const CREDIT_COST_SEED: Record<"standard" | "fast", { narrative: number; dailyLife: number; progression: number }> = {
  standard: { narrative: 3, dailyLife: 4, progression: 5 },
  fast: { narrative: 2, dailyLife: 3, progression: 4 },
};

/** Default knobs — the ai_pricing_knobs fallback when the row is missing/malformed. */
export const DEFAULT_KNOBS: PricingKnobs = {
  creditValueUsd: 0.157,
  targetMultiplier: 1.2,
  maxStepPerResync: 1,
  floorCredits: 1,
  capCredits: 12,
  minRunsForCalibration: 20,
  usageWindowDays: 60,
};

// ── Types ────────────────────────────────────────────────────────────────────

export type Provider = "anthropic" | "openai";

/** A single parsed price row from a provider page. */
export interface ParsedPrice {
  modelId: string;
  inputPerMtok: number;
  outputPerMtok: number;
}

export interface PricingKnobs {
  creditValueUsd: number;
  targetMultiplier: number;
  maxStepPerResync: number;
  floorCredits: number;
  capCredits: number;
  minRunsForCalibration: number;
  usageWindowDays: number;
}

export interface PriceBookModelEntry {
  provider: Provider;
  modelId: string;
  inputPerMtok: number;
  outputPerMtok: number;
  stale: boolean;
  manualOverride: boolean;
  lastFetchedAt: string | null;
  estRun: { inputTokens: number; outputTokens: number; runs: number } | null;
}

export interface PriceBook {
  updatedAt: string;
  sources: Record<string, { fetchedAt: string; ok: boolean; url: string; error?: string }>;
  models: Record<string, PriceBookModelEntry>;
  candidates: ParsedPrice[];
  missingFromProvider: string[];
}

export interface CreditCosts {
  updatedAt: string;
  updatedBy: "seed" | "resync" | "manual";
  profiles: Record<string, { narrative: number; dailyLife: number; progression: number }>;
}

/** One usage aggregate group as returned by aggregate_ai_usage_stats. */
export interface UsageGroup {
  profile: string;
  feature: string;
  runs: number;
  avgInputTokens: number;
  avgOutputTokens: number;
  avgCostUsd: number;
}

// ── Parsers ──────────────────────────────────────────────────────────────────

/**
 * Extract the first two plausible $/MTok prices from a fragment of text, tolerant
 * of thousands separators and stray words between them. Returns null if it can't
 * find two positive finite numbers. The FIRST is treated as input, the SECOND as
 * output — the near-universal column order on both provider pages.
 *
 * PREFER `$`-prefixed numbers: a pricing line also contains the model's version
 * number (e.g. "Claude Opus 4.8", "claude-opus-4-8") which the dollar amounts are
 * NOT prefixed by, so keying on `$` avoids grabbing "4.8" as a price. Only when a
 * line/fragment has NO `$`-prefixed number at all do we fall back to bare numbers.
 */
function extractTwoPrices(fragment: string): { input: number; output: number } | null {
  // 1. Prefer explicit $-prefixed prices ("$5.00", "$ 25", "$1,200.50").
  const dollarMatches = fragment.match(/\$\s*(\d+(?:,\d{3})*(?:\.\d+)?)/g);
  const dollarNums = (dollarMatches ?? [])
    .map((m) => Number(m.replace(/[$,\s]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (dollarNums.length >= 2) return { input: dollarNums[0], output: dollarNums[1] };

  // 2. Fall back to bare numbers (embedded-JSON price fields carry no `$`).
  const matches = fragment.match(/(\d+(?:,\d{3})*(?:\.\d+)?)/g);
  if (!matches || matches.length < 2) return null;
  const nums = matches
    .map((m) => Number(m.replace(/[,\s]/g, "")))
    .filter((n) => Number.isFinite(n) && n > 0);
  if (nums.length < 2) return null;
  return { input: nums[0], output: nums[1] };
}

/**
 * Parse the Anthropic pricing markdown (platform.claude.com/docs/en/pricing.md).
 * The page renders pricing as markdown tables / bullet lines like:
 *   | Claude Opus 4.8 | `claude-opus-4-8` | 1M | $5.00 | $25.00 |
 *   - claude-sonnet-4-6: $3 / $15 per MTok
 * Be tolerant: scan every line, look for a claude model id or a recognizable
 * display name, then pull the first two dollar prices on that line as input/output.
 * NEVER throws — returns [] on garbage.
 */
export function parseAnthropicPricingMd(text: string): ParsedPrice[] {
  if (typeof text !== "string" || !text.trim()) return [];
  const out: ParsedPrice[] = [];
  const seen = new Set<string>();
  // Map friendly display names to canonical ids so a table that only shows
  // "Claude Opus 4.8" (no code id column) still resolves to a model id.
  const DISPLAY_TO_ID: Array<[RegExp, string]> = [
    [/opus\s*4\.?8/i, "claude-opus-4-8"],
    [/sonnet\s*4\.?6/i, "claude-sonnet-4-6"],
    [/haiku\s*4\.?5/i, "claude-haiku-4-5"],
  ];
  try {
    for (const rawLine of text.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line) continue;
      // 1. Prefer an explicit claude-* code id anywhere on the line.
      const idMatch = line.match(/claude[-\w.]*\d[-\w.]*/i);
      let modelId: string | null = idMatch ? idMatch[0].toLowerCase().replace(/[`*]/g, "") : null;
      // 2. Fall back to a display-name match.
      if (!modelId) {
        for (const [re, id] of DISPLAY_TO_ID) {
          if (re.test(line)) { modelId = id; break; }
        }
      }
      if (!modelId) continue;
      const prices = extractTwoPrices(line);
      if (!prices) continue;
      // First occurrence wins — pricing tables list the model once, and a later
      // "batch" or "cache" row for the same id shouldn't overwrite the base rate.
      if (seen.has(modelId)) continue;
      seen.add(modelId);
      out.push({ modelId, inputPerMtok: prices.input, outputPerMtok: prices.output });
    }
  } catch (_) {
    return [];
  }
  return out;
}

/**
 * Parse the OpenAI pricing page (platform.openai.com/docs/pricing). The page is
 * app-rendered HTML, so the reliable signal is the embedded JSON the app hydrates
 * from. Scan for objects that pair a gpt-* model id with input/output per-1M
 * prices under whatever keys the payload uses (input/output, prompt/completion,
 * inputPerMillion/outputPerMillion, …). Best-effort; [] on JS-soup failure.
 * NEVER throws.
 */
export function parseOpenAiPricingHtml(text: string): ParsedPrice[] {
  if (typeof text !== "string" || !text.trim()) return [];
  const out: ParsedPrice[] = [];
  const seen = new Set<string>();
  try {
    // Find every gpt-* id and, in a small window AROUND it, the two prices. The
    // embedded JSON groups an id with its prices within a few dozen chars, so a
    // local window avoids stitching one model's id to another model's numbers.
    const idRe = /"?(gpt-[\w.-]+)"?/gi;
    let m: RegExpExecArray | null;
    while ((m = idRe.exec(text)) !== null) {
      const modelId = m[1].toLowerCase();
      if (seen.has(modelId)) continue;
      // Window: from just AFTER the id to ~200 chars beyond (the paired price
      // fields). Slicing past the id keeps its own version digits ("5.2" in
      // gpt-5.2) out of the bare-number fallback.
      const window = text.slice(m.index + m[0].length, m.index + m[0].length + 220);
      const prices = extractPricesFromJsonWindow(window);
      if (!prices) continue;
      seen.add(modelId);
      out.push({ modelId, inputPerMtok: prices.input, outputPerMtok: prices.output });
    }
  } catch (_) {
    return [];
  }
  return out;
}

/**
 * Pull an (input, output) per-1M price pair from a JSON-ish fragment. Prefers
 * explicitly-keyed fields (input/output, prompt/completion) so we don't grab a
 * context-window or id-suffix number by accident; falls back to the first two
 * bare numbers only when no keyed pair is present.
 */
function extractPricesFromJsonWindow(window: string): { input: number; output: number } | null {
  const keyed = (keys: string[]): number | null => {
    for (const k of keys) {
      const re = new RegExp(`"?${k}"?\\s*[:=]\\s*"?\\$?\\s*(\\d+(?:\\.\\d+)?)`, "i");
      const mm = window.match(re);
      if (mm) {
        const n = Number(mm[1]);
        if (Number.isFinite(n) && n > 0) return n;
      }
    }
    return null;
  };
  const input = keyed(["input", "inputPerMillion", "input_per_million", "prompt", "inputPrice", "input_cost"]);
  const output = keyed(["output", "outputPerMillion", "output_per_million", "completion", "outputPrice", "output_cost"]);
  if (input !== null && output !== null) return { input, output };
  // No keyed pair — fall back to two bare positive numbers in the window.
  return extractTwoPrices(window);
}

// ── Merge ────────────────────────────────────────────────────────────────────

export interface MergeResult {
  book: PriceBook;
  warnings: string[];
  priceChanges: Array<{ profile: string; field: "inputPerMtok" | "outputPerMtok"; old: number; new: number }>;
  staleModels: string[];
  candidates: ParsedPrice[];
  missingFromProvider: string[];
}

/** True when a fetched price may replace an existing one (contract merge guard). */
function priceWithinGuard(existing: number, fetched: number): boolean {
  if (!Number.isFinite(fetched) || fetched <= 0) return false;
  if (!Number.isFinite(existing) || existing <= 0) return true; // no baseline → accept any sane value
  return fetched >= existing / 3 && fetched <= existing * 3;
}

/**
 * Merge freshly-fetched provider prices into the current price book, applying the
 * contract guards:
 *   - a fetched price applies only if finite & > 0 AND (no existing price OR within
 *     [existing/3, existing*3]); otherwise keep existing + warn + stale:true
 *   - models with manualOverride:true are NEVER auto-updated
 *   - parsed-but-not-a-profile ids → candidates (max 20)
 *   - profile models NOT seen in a SUCCESSFUL provider fetch → missingFromProvider
 *     (and stale:true only if that provider fetch succeeded)
 *
 * @param currentBook The existing ai_price_book (or a seed).
 * @param fetchedByProvider Parsed rows + fetch-success flag per provider.
 * @param now ISO timestamp for lastFetchedAt / updatedAt.
 */
export function mergePriceBook(
  currentBook: PriceBook,
  fetchedByProvider: Record<Provider, { ok: boolean; prices: ParsedPrice[] }>,
  now: string,
): MergeResult {
  const warnings: string[] = [];
  const priceChanges: MergeResult["priceChanges"] = [];
  const staleModels: string[] = [];
  const missingFromProvider: string[] = [];

  // Index fetched prices by lowercased model id per provider for quick lookup.
  const fetchedIndex: Record<Provider, Map<string, ParsedPrice>> = {
    anthropic: new Map(),
    openai: new Map(),
  };
  for (const provider of ["anthropic", "openai"] as Provider[]) {
    for (const p of fetchedByProvider[provider]?.prices ?? []) {
      fetchedIndex[provider].set(p.modelId.toLowerCase(), p);
    }
  }

  // Clone the models map so we never mutate the caller's book in place.
  const models: Record<string, PriceBookModelEntry> = {};
  for (const key of PROFILE_KEYS) {
    const meta = PROFILE_MODELS[key];
    const existing = currentBook.models?.[key];
    // Base entry: keep everything from the current book, reset stale for re-eval.
    const entry: PriceBookModelEntry = {
      provider: meta.provider,
      modelId: existing?.modelId ?? meta.modelId,
      inputPerMtok: existing?.inputPerMtok ?? 0,
      outputPerMtok: existing?.outputPerMtok ?? 0,
      stale: false,
      manualOverride: existing?.manualOverride === true,
      lastFetchedAt: existing?.lastFetchedAt ?? null,
      estRun: existing?.estRun ?? null,
    };

    const providerFetch = fetchedByProvider[meta.provider];
    const fetched = fetchedIndex[meta.provider].get(entry.modelId.toLowerCase());

    if (entry.manualOverride) {
      // Never auto-update a pinned model — carry its prices forward untouched.
      models[key] = entry;
      continue;
    }

    if (fetched) {
      // Consider each field independently against the guard.
      for (const field of ["inputPerMtok", "outputPerMtok"] as const) {
        const fetchedVal = field === "inputPerMtok" ? fetched.inputPerMtok : fetched.outputPerMtok;
        const existingVal = entry[field];
        if (priceWithinGuard(existingVal, fetchedVal)) {
          if (fetchedVal !== existingVal) {
            priceChanges.push({ profile: key, field, old: existingVal, new: fetchedVal });
          }
          entry[field] = fetchedVal;
        } else {
          // Rejected as out-of-band (>3x jump or non-finite) — keep existing, warn, stale.
          warnings.push(
            `${key}.${field}: rejected fetched ${fetchedVal} (existing ${existingVal}) — outside [existing/3, existing*3]`,
          );
          entry.stale = true;
          if (!staleModels.includes(key)) staleModels.push(key);
        }
      }
      entry.lastFetchedAt = now;
    } else if (providerFetch?.ok) {
      // The provider fetch SUCCEEDED but this model wasn't in it → missing + stale.
      missingFromProvider.push(entry.modelId);
      entry.stale = true;
      if (!staleModels.includes(key)) staleModels.push(key);
    }
    // else: the provider fetch FAILED — don't flag stale (we simply have no data
    // this cycle), carry existing prices forward.

    models[key] = entry;
  }

  // Candidates: parsed rows whose id is NOT one of our profile models. Max 20.
  const profileModelIds = new Set(Object.values(PROFILE_MODELS).map((m) => m.modelId.toLowerCase()));
  const candidates: ParsedPrice[] = [];
  const candidateSeen = new Set<string>();
  for (const provider of ["anthropic", "openai"] as Provider[]) {
    for (const p of fetchedByProvider[provider]?.prices ?? []) {
      const id = p.modelId.toLowerCase();
      if (profileModelIds.has(id) || candidateSeen.has(id)) continue;
      candidateSeen.add(id);
      candidates.push(p);
      if (candidates.length >= 20) break;
    }
    if (candidates.length >= 20) break;
  }

  const sources: PriceBook["sources"] = { ...(currentBook.sources ?? {}) };

  const book: PriceBook = {
    updatedAt: now,
    sources,
    models,
    candidates,
    missingFromProvider,
  };

  return { book, warnings, priceChanges, staleModels, candidates, missingFromProvider };
}

// ── COGS ─────────────────────────────────────────────────────────────────────

/** Per-profile×feature average COGS (USD/run), keyed "profile::feature". */
export type CogsByProfileFeature = Record<string, { avgCogsUsd: number; runs: number }>;

/**
 * Compute per-profile×feature avgCogsUsd from usage aggregates and the JUST-MERGED
 * price book. Prefer recomputing cost from token aggregates × merged prices; fall
 * back to the group's stored avgCostUsd when the token sums are zero (an old row
 * with no token telemetry). Only groups for known profiles + calibrated features
 * are considered.
 */
export function computeAvgCogs(groups: UsageGroup[], book: PriceBook): CogsByProfileFeature {
  const out: CogsByProfileFeature = {};
  for (const g of groups ?? []) {
    if (!PROFILE_KEYS.includes(g.profile as ProfileKey)) continue;
    if (!CALIBRATED_FEATURES.includes(g.feature as CalibratedFeature)) continue;
    const runs = Number(g.runs) || 0;
    if (runs <= 0) continue;

    const model = book.models?.[g.profile];
    const inTok = Number(g.avgInputTokens) || 0;
    const outTok = Number(g.avgOutputTokens) || 0;

    let avgCogsUsd: number;
    if (model && (inTok > 0 || outTok > 0)) {
      // Recompute from tokens × merged per-MTok prices (input + output; cache folded).
      avgCogsUsd =
        (inTok / 1_000_000) * (Number(model.inputPerMtok) || 0) +
        (outTok / 1_000_000) * (Number(model.outputPerMtok) || 0);
    } else {
      // No token telemetry → trust the stored per-run cost aggregate.
      avgCogsUsd = Number(g.avgCostUsd) || 0;
    }

    out[`${g.profile}::${g.feature}`] = { avgCogsUsd, runs };
  }
  return out;
}

// ── Calibration ──────────────────────────────────────────────────────────────

export interface CalibrationResult {
  costs: CreditCosts["profiles"];
  creditChanges: Array<{
    profile: string;
    feature: string;
    old: number;
    new: number;
    recommended: number;
    avgCogsUsd: number;
    runs: number;
  }>;
  lowData: Array<{ profile: string; feature: string; runs: number }>;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/** Validate a config credit cost — accept only integers 1..12, else null. */
export function validCreditCost(v: unknown): number | null {
  if (typeof v !== "number" || !Number.isInteger(v)) return null;
  return v >= 1 && v <= 12 ? v : null;
}

/**
 * Calibrate credit costs per the contract formula. For each profile × feature:
 *   stats = cogsByProfileFeature[profile::feature]
 *   if runs < minRunsForCalibration → keep current, mark lowData
 *   recommended = ceil(avgCogsUsdPerRun * targetMultiplier / creditValueUsd)
 *   next = clamp(recommended, current - maxStep, current + maxStep)
 *   next = clamp(next, floorCredits, capCredits)
 *   if next !== current → change entry
 * Downward moves are allowed. Missing/malformed current costs fall back to the
 * per-tier seed so calibration always has a valid integer baseline.
 */
export function calibrateCreditCosts(
  currentCosts: CreditCosts["profiles"],
  cogsByProfileFeature: CogsByProfileFeature,
  knobs: PricingKnobs,
): CalibrationResult {
  const costs: CreditCosts["profiles"] = {};
  const creditChanges: CalibrationResult["creditChanges"] = [];
  const lowData: CalibrationResult["lowData"] = [];

  const minRuns = Number(knobs.minRunsForCalibration) || DEFAULT_KNOBS.minRunsForCalibration;
  const target = Number(knobs.targetMultiplier) || DEFAULT_KNOBS.targetMultiplier;
  const creditUsd = Number(knobs.creditValueUsd) || DEFAULT_KNOBS.creditValueUsd;
  const maxStep = Number(knobs.maxStepPerResync) || DEFAULT_KNOBS.maxStepPerResync;
  const floor = Number(knobs.floorCredits) || DEFAULT_KNOBS.floorCredits;
  const cap = Number(knobs.capCredits) || DEFAULT_KNOBS.capCredits;

  for (const profile of PROFILE_KEYS) {
    const seed = CREDIT_COST_SEED[PROFILE_COST_TIER[profile]];
    const currentProfile = currentCosts?.[profile] ?? {};
    const resolved: { narrative: number; dailyLife: number; progression: number } = {
      narrative: validCreditCost(currentProfile.narrative) ?? seed.narrative,
      dailyLife: validCreditCost(currentProfile.dailyLife) ?? seed.dailyLife,
      progression: validCreditCost(currentProfile.progression) ?? seed.progression,
    };

    for (const feature of CALIBRATED_FEATURES) {
      const current = resolved[feature];
      const stats = cogsByProfileFeature[`${profile}::${feature}`];
      const runs = stats?.runs ?? 0;

      if (runs < minRuns) {
        // Not enough signal — keep the current cost, report as low-data.
        lowData.push({ profile, feature, runs });
        resolved[feature] = current;
        continue;
      }

      const avgCogsUsd = stats.avgCogsUsd;
      const recommended = Math.ceil((avgCogsUsd * target) / creditUsd);
      // Clamp the move to ±maxStep of current, then to the [floor, cap] band.
      let next = clamp(recommended, current - maxStep, current + maxStep);
      next = clamp(next, floor, cap);
      // Guard against a fractional slipping through (recommended is already ceil'd,
      // but clamp bounds may be non-integer if knobs are misconfigured).
      next = Math.round(next);

      if (next !== current) {
        creditChanges.push({ profile, feature, old: current, new: next, recommended, avgCogsUsd, runs });
      }
      resolved[feature] = next;
    }

    costs[profile] = resolved;
  }

  return { costs, creditChanges, lowData };
}

// ── Seed builders (fallbacks for missing config rows) ────────────────────────

/**
 * Build the SEED price book that reproduces today's estimator behavior EXACTLY
 * (ESTIMATED_AI_PRICES_PER_MTOK buckets by substring). gpt_5_nano deliberately
 * seeds the "wrong" 2/8 default bucket (it doesn't match the 'mini' substring)
 * so behavior is unchanged until the first resync. estRun seeds null.
 */
export function buildSeedPriceBook(now: string): PriceBook {
  const seedPrices: Record<ProfileKey, { input: number; output: number }> = {
    anthropic_claude_opus_4_8: { input: 5, output: 25 },
    anthropic_claude_sonnet_4_6: { input: 3, output: 15 },
    anthropic_claude_haiku_4_5: { input: 1, output: 5 },
    openai_gpt_5_2: { input: 2, output: 8 },
    openai_gpt_5_mini: { input: 0.4, output: 1.6 },
    openai_gpt_5_nano: { input: 2, output: 8 }, // default bucket — see contract
    openai_gpt_4_1: { input: 2, output: 8 },
    openai_gpt_4_1_mini: { input: 0.4, output: 1.6 },
  };
  const models: Record<string, PriceBookModelEntry> = {};
  for (const key of PROFILE_KEYS) {
    const meta = PROFILE_MODELS[key];
    models[key] = {
      provider: meta.provider,
      modelId: meta.modelId,
      inputPerMtok: seedPrices[key].input,
      outputPerMtok: seedPrices[key].output,
      stale: false,
      manualOverride: false,
      lastFetchedAt: null,
      estRun: null,
    };
  }
  return { updatedAt: now, sources: {}, models, candidates: [], missingFromProvider: [] };
}

/** Build the SEED credit-cost row (per-tier standard/fast), updatedBy 'seed'. */
export function buildSeedCreditCosts(now: string): CreditCosts {
  const profiles: CreditCosts["profiles"] = {};
  for (const key of PROFILE_KEYS) {
    profiles[key] = { ...CREDIT_COST_SEED[PROFILE_COST_TIER[key]] };
  }
  return { updatedAt: now, updatedBy: "seed", profiles };
}

/** Coerce a raw estRun value into a valid {inputTokens, outputTokens, runs} or null. */
function coerceEstRun(raw: unknown): PriceBookModelEntry["estRun"] {
  if (!raw || typeof raw !== "object") return null;
  const e = raw as Record<string, unknown>;
  if (!Number.isFinite(e.inputTokens) || !Number.isFinite(e.outputTokens)) return null;
  return {
    inputTokens: e.inputTokens as number,
    outputTokens: e.outputTokens as number,
    runs: Number(e.runs) || 0,
  };
}

/** Coerce a raw config value into a valid PriceBook, or seed if missing/malformed. */
export function resolvePriceBook(raw: unknown, now: string): PriceBook {
  if (!raw || typeof raw !== "object") return buildSeedPriceBook(now);
  const book = raw as Partial<PriceBook>;
  if (!book.models || typeof book.models !== "object") return buildSeedPriceBook(now);
  // Merge onto a seed so any missing profile is backfilled with seed prices.
  const seed = buildSeedPriceBook(now);
  const models: Record<string, PriceBookModelEntry> = {};
  for (const key of PROFILE_KEYS) {
    const m = (book.models as Record<string, Partial<PriceBookModelEntry>>)[key];
    if (m && typeof m === "object" && Number.isFinite(m.inputPerMtok) && Number.isFinite(m.outputPerMtok)) {
      models[key] = {
        provider: PROFILE_MODELS[key].provider,
        modelId: typeof m.modelId === "string" ? m.modelId : PROFILE_MODELS[key].modelId,
        inputPerMtok: m.inputPerMtok as number,
        outputPerMtok: m.outputPerMtok as number,
        stale: m.stale === true,
        manualOverride: m.manualOverride === true,
        lastFetchedAt: typeof m.lastFetchedAt === "string" ? m.lastFetchedAt : null,
        estRun: coerceEstRun(m.estRun),
      };
    } else {
      models[key] = seed.models[key];
    }
  }
  return {
    updatedAt: typeof book.updatedAt === "string" ? book.updatedAt : now,
    sources: (book.sources && typeof book.sources === "object" ? book.sources : {}) as PriceBook["sources"],
    models,
    candidates: Array.isArray(book.candidates) ? book.candidates as ParsedPrice[] : [],
    missingFromProvider: Array.isArray(book.missingFromProvider) ? book.missingFromProvider as string[] : [],
  };
}

/** Coerce a raw config value into valid CreditCosts, or seed if missing/malformed. */
export function resolveCreditCosts(raw: unknown, now: string): CreditCosts {
  const seed = buildSeedCreditCosts(now);
  if (!raw || typeof raw !== "object") return seed;
  const cc = raw as Partial<CreditCosts>;
  if (!cc.profiles || typeof cc.profiles !== "object") return seed;
  const profiles: CreditCosts["profiles"] = {};
  for (const key of PROFILE_KEYS) {
    const p = ((cc.profiles as Record<string, Record<string, unknown>>)[key] ?? {});
    const tierSeed = CREDIT_COST_SEED[PROFILE_COST_TIER[key]];
    profiles[key] = {
      narrative: validCreditCost(p.narrative) ?? tierSeed.narrative,
      dailyLife: validCreditCost(p.dailyLife) ?? tierSeed.dailyLife,
      progression: validCreditCost(p.progression) ?? tierSeed.progression,
    };
  }
  return {
    updatedAt: typeof cc.updatedAt === "string" ? cc.updatedAt : now,
    updatedBy: cc.updatedBy === "resync" || cc.updatedBy === "manual" ? cc.updatedBy : "seed",
    profiles,
  };
}

/** Coerce a raw config value into valid knobs, filling any missing field from defaults. */
export function resolveKnobs(raw: unknown): PricingKnobs {
  if (!raw || typeof raw !== "object") return { ...DEFAULT_KNOBS };
  const k = raw as Partial<PricingKnobs>;
  const num = (v: unknown, d: number) => (typeof v === "number" && Number.isFinite(v) && v > 0 ? v : d);
  return {
    creditValueUsd: num(k.creditValueUsd, DEFAULT_KNOBS.creditValueUsd),
    targetMultiplier: num(k.targetMultiplier, DEFAULT_KNOBS.targetMultiplier),
    maxStepPerResync: num(k.maxStepPerResync, DEFAULT_KNOBS.maxStepPerResync),
    floorCredits: num(k.floorCredits, DEFAULT_KNOBS.floorCredits),
    capCredits: num(k.capCredits, DEFAULT_KNOBS.capCredits),
    minRunsForCalibration: num(k.minRunsForCalibration, DEFAULT_KNOBS.minRunsForCalibration),
    usageWindowDays: num(k.usageWindowDays, DEFAULT_KNOBS.usageWindowDays),
  };
}

// ── Composed pipeline ────────────────────────────────────────────────────────

export interface ResyncDeps {
  /** Fetch a URL's text with a bounded timeout — returns the body or throws. */
  fetchText: (url: string) => Promise<string>;
  // Service-role Supabase client (config reads/writes + the usage-stats RPC).
  // Typed `any` to match the rest of the edge boundary: the concrete
  // SupabaseClient<> generics are excessively deep (TS2589) when threaded through
  // helpers, and its query builders are thenables, not Promises — the same reason
  // generate-narrative types its `admin` client as `any`.
  // deno-lint-ignore no-explicit-any
  adminClient: any;
  /** ISO clock (injected for deterministic tests). */
  now: () => string;
  /** The calling user's id — stamped into updated_by on config upserts. */
  actorUserId: string;
  /** When true, compute the report but write NOTHING. */
  dryRun: boolean;
  /**
   * When false, still fetch/merge/write the PRICE BOOK (+ estRun) but leave the
   * ai_credit_costs row UNTOUCHED — the calibration still runs and its creditChanges
   * are reported as recommendations-only (see ResyncReport.creditChangesApplied). The
   * nightly cron passes this from its config `applyCreditCosts` flag so an operator
   * can keep the provider price book fresh without ever auto-moving the charge.
   * Defaults to true (the manual admin path's behaviour is unchanged). No-op under
   * dryRun (a dry run writes nothing regardless).
   */
  applyCreditCosts?: boolean;
}

export interface ResyncReport {
  success: true;
  dryRun: boolean;
  updatedAt: string;
  priceChanges: MergeResult["priceChanges"];
  staleModels: string[];
  candidates: ParsedPrice[];
  missingFromProvider: string[];
  creditChanges: CalibrationResult["creditChanges"];
  lowData: CalibrationResult["lowData"];
  usage: { windowDays: number; totalRuns: number; profilesCovered: number };
  warnings: string[];
  /**
   * Whether the calibrated credit costs were actually WRITTEN. True on the manual
   * apply path and on a cron run with applyCreditCosts=true; false when the caller
   * suppressed the credit-cost write (cron applyCreditCosts=false) — in that case
   * creditChanges above are recommendations only, nothing was charged differently.
   * Also false on a dryRun (nothing is written at all).
   */
  creditChangesApplied: boolean;
  /** Compact before/after summaries for the audit row (counts + changed entries). */
  auditBefore: Record<string, unknown>;
  auditAfter: Record<string, unknown>;
}

const ANTHROPIC_PRICING_URL = "https://platform.claude.com/docs/en/pricing.md";
const OPENAI_PRICING_URL = "https://platform.openai.com/docs/pricing";

/**
 * Run the full resync pipeline with side effects INJECTED. Reads the 3 config
 * rows, fetches both provider pages (allSettled — a failed fetch is a warning, not
 * a throw), merges + calibrates, and (unless dryRun) upserts both config rows with
 * updated_by = actorUserId. Returns the report the client renders + the compact
 * audit before/after. Does NOT write the audit row itself — index.ts owns that so
 * the audit rides the same writeAudit helper as every other admin action.
 */
export async function runPricingResync(deps: ResyncDeps): Promise<ResyncReport> {
  const now = deps.now();
  const warnings: string[] = [];

  // ── 1. Read the 3 config rows (one query). ──
  let priceBookRaw: unknown = null;
  let creditCostsRaw: unknown = null;
  let knobsRaw: unknown = null;
  try {
    const { data, error } = await deps.adminClient
      .from("system_config")
      .select("key, value")
      .in("key", ["ai_price_book", "ai_credit_costs", "ai_pricing_knobs"]);
    if (error) {
      warnings.push(`config read failed: ${error.message}`);
    } else if (Array.isArray(data)) {
      for (const row of data) {
        if (row.key === "ai_price_book") priceBookRaw = row.value;
        else if (row.key === "ai_credit_costs") creditCostsRaw = row.value;
        else if (row.key === "ai_pricing_knobs") knobsRaw = row.value;
      }
    }
  } catch (e) {
    warnings.push(`config read threw: ${e instanceof Error ? e.message : String(e)}`);
  }

  const currentBook = resolvePriceBook(priceBookRaw, now);
  const currentCosts = resolveCreditCosts(creditCostsRaw, now);
  const knobs = resolveKnobs(knobsRaw);

  // ── 2. Fetch both provider pages (allSettled + parse). ──
  const [anthropicRes, openaiRes] = await Promise.allSettled([
    deps.fetchText(ANTHROPIC_PRICING_URL),
    deps.fetchText(OPENAI_PRICING_URL),
  ]);

  const anthropicOk = anthropicRes.status === "fulfilled";
  const openaiOk = openaiRes.status === "fulfilled";
  if (!anthropicOk) warnings.push(`anthropic fetch failed: ${reasonOf(anthropicRes)}`);
  if (!openaiOk) warnings.push(`openai fetch failed: ${reasonOf(openaiRes)}`);

  const anthropicPrices = anthropicOk ? parseAnthropicPricingMd(anthropicRes.value) : [];
  const openaiPrices = openaiOk ? parseOpenAiPricingHtml(openaiRes.value) : [];
  if (anthropicOk && anthropicPrices.length === 0) warnings.push("anthropic page parsed to zero prices");
  if (openaiOk && openaiPrices.length === 0) warnings.push("openai page parsed to zero prices");

  // Record the source fetch outcomes on the book.
  currentBook.sources = {
    ...currentBook.sources,
    anthropic: {
      fetchedAt: now,
      ok: anthropicOk,
      url: ANTHROPIC_PRICING_URL,
      ...(anthropicOk ? {} : { error: reasonOf(anthropicRes) }),
    },
    openai: {
      fetchedAt: now,
      ok: openaiOk,
      url: OPENAI_PRICING_URL,
      ...(openaiOk ? {} : { error: reasonOf(openaiRes) }),
    },
  };

  // ── 3. Merge fetched prices into the book (guards). ──
  const merge = mergePriceBook(
    currentBook,
    {
      anthropic: { ok: anthropicOk, prices: anthropicPrices },
      openai: { ok: openaiOk, prices: openaiPrices },
    },
    now,
  );
  warnings.push(...merge.warnings);

  // ── 4. Aggregate usage stats via the SECURITY DEFINER RPC. ──
  let groups: UsageGroup[] = [];
  try {
    const { data: statsData, error: statsErr } = await deps.adminClient.rpc("aggregate_ai_usage_stats", {
      p_window_days: knobs.usageWindowDays,
    });
    if (statsErr) {
      warnings.push(`aggregate_ai_usage_stats failed: ${statsErr.message}`);
    } else if (statsData && typeof statsData === "object") {
      const maybeGroups = (statsData as { groups?: unknown }).groups;
      if (Array.isArray(maybeGroups)) groups = maybeGroups as UsageGroup[];
    }
  } catch (e) {
    warnings.push(`aggregate_ai_usage_stats threw: ${e instanceof Error ? e.message : String(e)}`);
  }

  // ── 5. Compute per-profile×feature COGS + write estRun into the book. ──
  const cogs = computeAvgCogs(groups, merge.book);
  applyEstRunToBook(merge.book, groups);

  // ── 6. Calibrate credit costs. ──
  const calibration = calibrateCreditCosts(currentCosts.profiles, cogs, knobs);

  const nextCosts: CreditCosts = {
    updatedAt: now,
    updatedBy: "resync",
    profiles: calibration.costs,
  };

  const totalRuns = groups.reduce((sum, g) => sum + (Number(g.runs) || 0), 0);
  const profilesCovered = new Set(
    groups.filter((g) => PROFILE_KEYS.includes(g.profile as ProfileKey)).map((g) => g.profile),
  ).size;

  // ── 7. Persist (unless dryRun). ──
  // applyCreditCosts defaults TRUE (manual path unchanged). When explicitly false
  // (a cron run configured price-book-only) we STILL write the freshened price book
  // + estRun but omit ai_credit_costs from the upsert, so the charge never moves on
  // its own — the calibration below is reported as a recommendation, not applied.
  const applyCreditCosts = deps.applyCreditCosts !== false;
  const creditChangesApplied = !deps.dryRun && applyCreditCosts;
  if (!deps.dryRun) {
    const rows: Array<Record<string, unknown>> = [
      { key: "ai_price_book", value: merge.book, updated_by: deps.actorUserId },
    ];
    if (applyCreditCosts) {
      rows.push({ key: "ai_credit_costs", value: nextCosts, updated_by: deps.actorUserId });
    }
    try {
      const { error: upsertErr } = await deps.adminClient.from("system_config").upsert(
        rows,
        { onConflict: "key" },
      );
      if (upsertErr) warnings.push(`config upsert failed: ${upsertErr.message}`);
    } catch (e) {
      warnings.push(`config upsert threw: ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  // ── 8. Assemble the report + the COMPACT audit before/after. ──
  const auditBefore = {
    priceBook: {
      updatedAt: currentBook.updatedAt,
      models: Object.fromEntries(
        merge.priceChanges.map((c) => [
          c.profile,
          { [c.field]: currentBook.models?.[c.profile]?.[c.field] },
        ]),
      ),
    },
    creditCosts: {
      updatedAt: currentCosts.updatedAt,
      updatedBy: currentCosts.updatedBy,
      changed: Object.fromEntries(
        calibration.creditChanges.map((c) => [`${c.profile}::${c.feature}`, c.old]),
      ),
    },
  };
  const auditAfter = {
    priceBook: {
      updatedAt: now,
      priceChangeCount: merge.priceChanges.length,
      changed: Object.fromEntries(
        merge.priceChanges.map((c) => [`${c.profile}.${c.field}`, c.new]),
      ),
      staleModels: merge.staleModels,
    },
    creditCosts: {
      updatedAt: now,
      updatedBy: "resync",
      // Honest audit: when credit-cost application is suppressed, the changes are
      // recommendations that were NOT written, so mark it so the trail can't be
      // misread as "the charge moved".
      applied: creditChangesApplied,
      creditChangeCount: calibration.creditChanges.length,
      changed: Object.fromEntries(
        calibration.creditChanges.map((c) => [`${c.profile}::${c.feature}`, c.new]),
      ),
    },
  };

  return {
    success: true,
    dryRun: deps.dryRun,
    updatedAt: now,
    priceChanges: merge.priceChanges,
    staleModels: merge.staleModels,
    candidates: merge.candidates,
    missingFromProvider: merge.missingFromProvider,
    creditChanges: calibration.creditChanges,
    lowData: calibration.lowData,
    usage: { windowDays: knobs.usageWindowDays, totalRuns, profilesCovered },
    warnings,
    creditChangesApplied,
    auditBefore,
    auditAfter,
  };
}

/**
 * Write per-profile estRun token estimates into the book from the usage groups.
 * estRun.inputTokens/outputTokens are the rounded average across a profile's
 * calibrated features weighted by run count; runs is the total. Profiles with no
 * usage keep their existing estRun (or null). Mutates the book in place.
 */
function applyEstRunToBook(book: PriceBook, groups: UsageGroup[]): void {
  const byProfile: Record<string, { inTok: number; outTok: number; runs: number }> = {};
  for (const g of groups ?? []) {
    if (!PROFILE_KEYS.includes(g.profile as ProfileKey)) continue;
    if (!CALIBRATED_FEATURES.includes(g.feature as CalibratedFeature)) continue;
    const runs = Number(g.runs) || 0;
    if (runs <= 0) continue;
    const acc = byProfile[g.profile] ?? { inTok: 0, outTok: 0, runs: 0 };
    // Weight the per-run token averages by run count so the profile-level estimate
    // reflects the busier features more heavily.
    acc.inTok += (Number(g.avgInputTokens) || 0) * runs;
    acc.outTok += (Number(g.avgOutputTokens) || 0) * runs;
    acc.runs += runs;
    byProfile[g.profile] = acc;
  }
  for (const [profile, acc] of Object.entries(byProfile)) {
    const entry = book.models?.[profile];
    if (!entry || acc.runs <= 0) continue;
    entry.estRun = {
      inputTokens: Math.round(acc.inTok / acc.runs),
      outputTokens: Math.round(acc.outTok / acc.runs),
      runs: acc.runs,
    };
  }
}

/** Human-readable reason from a settled promise rejection. */
function reasonOf(res: PromiseSettledResult<unknown>): string {
  if (res.status === "fulfilled") return "";
  const r = res.reason;
  return r instanceof Error ? r.message : String(r);
}
