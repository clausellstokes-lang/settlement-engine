/**
 * pricingResync.test.ts — unit tests for the deterministic resync core.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`). Everything
 * under test here is PURE, so no supabase stub is needed except the runPricingResync
 * dry-run composition test at the bottom, which injects recording deps and asserts
 * NO config write happens on a dry run.
 *
 * Coverage:
 *   - parseAnthropicPricingMd: a realistic md table snippet + a garbled row rejected
 *   - parseOpenAiPricingHtml: an embedded-JSON snippet + a JS-soup failure case
 *   - mergePriceBook: >3x jump rejected + stale flag; manualOverride untouched; candidate
 *   - calibrateCreditCosts: lowData keep; clamp ±1 both directions; floor/cap; no-change; downward
 *   - runPricingResync: dry-run writes nothing
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  buildSeedPriceBook,
  calibrateCreditCosts,
  computeAvgCogs,
  DEFAULT_KNOBS,
  mergePriceBook,
  parseAnthropicPricingMd,
  parseOpenAiPricingHtml,
  runPricingResync,
  type CogsByProfileFeature,
  type PricingKnobs,
  type UsageGroup,
} from "./pricingResync.ts";

const NOW = "2026-07-07T00:00:00.000Z";

// ── Parsers: Anthropic markdown ──────────────────────────────────────────────

const ANTHROPIC_MD_FIXTURE = `
# Pricing

| Model             | Model ID            | Context | Input $/1M | Output $/1M |
|-------------------|---------------------|---------|------------|-------------|
| Claude Opus 4.8   | \`claude-opus-4-8\`   | 1M      | $5.00      | $25.00      |
| Claude Sonnet 4.6 | \`claude-sonnet-4-6\` | 1M      | $3.00      | $15.00      |
| Claude Haiku 4.5  | \`claude-haiku-4-5\`  | 200K    | $1.00      | $5.00       |

Some prose that mentions dollars like $12 but no model id — must be ignored.
| A garbled row with claude-opus-4-8 but only one price $5.00 | should reject |
`;

Deno.test("parseAnthropicPricingMd extracts a table's input/output pairs", () => {
  const rows = parseAnthropicPricingMd(ANTHROPIC_MD_FIXTURE);
  const byId = Object.fromEntries(rows.map((r) => [r.modelId, r]));
  assertEquals(byId["claude-opus-4-8"].inputPerMtok, 5);
  assertEquals(byId["claude-opus-4-8"].outputPerMtok, 25);
  assertEquals(byId["claude-sonnet-4-6"].inputPerMtok, 3);
  assertEquals(byId["claude-sonnet-4-6"].outputPerMtok, 15);
  assertEquals(byId["claude-haiku-4-5"].inputPerMtok, 1);
  assertEquals(byId["claude-haiku-4-5"].outputPerMtok, 5);
});

Deno.test("parseAnthropicPricingMd rejects a row with fewer than two prices", () => {
  // First occurrence of claude-opus-4-8 (5/25) wins; the later garbled single-price
  // row for the same id is deduped away, and no phantom row is emitted for it.
  const rows = parseAnthropicPricingMd(ANTHROPIC_MD_FIXTURE);
  const opus = rows.filter((r) => r.modelId === "claude-opus-4-8");
  assertEquals(opus.length, 1);
  assertEquals(opus[0].outputPerMtok, 25); // NOT the garbled single-price row
});

Deno.test("parseAnthropicPricingMd returns [] on garbage / empty", () => {
  assertEquals(parseAnthropicPricingMd(""), []);
  assertEquals(parseAnthropicPricingMd("no models here, just prose"), []);
  // @ts-expect-error — defensive: non-string input must not throw
  assertEquals(parseAnthropicPricingMd(null), []);
});

// ── Parsers: OpenAI embedded JSON ────────────────────────────────────────────

const OPENAI_JSON_FIXTURE = `
<script>window.__DATA__ = {"models":[
  {"id":"gpt-5.2","input":2,"output":8},
  {"id":"gpt-5-mini","input":0.4,"output":1.6},
  {"id":"gpt-4.1","input":2,"output":8}
]};</script>
`;

Deno.test("parseOpenAiPricingHtml extracts embedded-JSON model prices", () => {
  const rows = parseOpenAiPricingHtml(OPENAI_JSON_FIXTURE);
  const byId = Object.fromEntries(rows.map((r) => [r.modelId, r]));
  assertEquals(byId["gpt-5.2"].inputPerMtok, 2);
  assertEquals(byId["gpt-5.2"].outputPerMtok, 8);
  assertEquals(byId["gpt-5-mini"].inputPerMtok, 0.4);
  assertEquals(byId["gpt-5-mini"].outputPerMtok, 1.6);
});

Deno.test("parseOpenAiPricingHtml returns [] on JS soup with no prices", () => {
  const soup = `<script>function gpt(){return "gpt-5.2 is great"}</script> gpt-4.1 rocks`;
  // gpt ids are present but there are no numeric price pairs near them → nothing usable.
  assertEquals(parseOpenAiPricingHtml(soup), []);
  assertEquals(parseOpenAiPricingHtml(""), []);
});

// ── Merge guards ─────────────────────────────────────────────────────────────

Deno.test("mergePriceBook rejects a >3x jump and marks the model stale", () => {
  const book = buildSeedPriceBook(NOW); // opus seed = 5/25
  const res = mergePriceBook(
    book,
    {
      // A bogus 50/25 for opus: input 50 is >3x the 5 seed → rejected, output 25 kept.
      anthropic: { ok: true, prices: [{ modelId: "claude-opus-4-8", inputPerMtok: 50, outputPerMtok: 25 }] },
      openai: { ok: false, prices: [] },
    },
    NOW,
  );
  // input stayed at the seed; a warning + stale flag recorded.
  assertEquals(res.book.models["anthropic_claude_opus_4_8"].inputPerMtok, 5);
  assertEquals(res.book.models["anthropic_claude_opus_4_8"].stale, true);
  assertEquals(res.staleModels.includes("anthropic_claude_opus_4_8"), true);
  assertEquals(res.warnings.some((w) => w.includes("inputPerMtok")), true);
  // No price change was recorded for the rejected field.
  assertEquals(res.priceChanges.some((c) => c.profile === "anthropic_claude_opus_4_8" && c.field === "inputPerMtok"), false);
});

Deno.test("mergePriceBook applies an in-band change and records it", () => {
  const book = buildSeedPriceBook(NOW); // opus seed = 5/25
  const res = mergePriceBook(
    book,
    {
      anthropic: { ok: true, prices: [{ modelId: "claude-opus-4-8", inputPerMtok: 6, outputPerMtok: 25 }] },
      openai: { ok: false, prices: [] },
    },
    NOW,
  );
  assertEquals(res.book.models["anthropic_claude_opus_4_8"].inputPerMtok, 6);
  const change = res.priceChanges.find((c) => c.profile === "anthropic_claude_opus_4_8" && c.field === "inputPerMtok");
  assertEquals(change?.old, 5);
  assertEquals(change?.new, 6);
  assertEquals(res.book.models["anthropic_claude_opus_4_8"].stale, false);
});

Deno.test("mergePriceBook never auto-updates a manualOverride model", () => {
  const book = buildSeedPriceBook(NOW);
  book.models["anthropic_claude_opus_4_8"].manualOverride = true;
  book.models["anthropic_claude_opus_4_8"].inputPerMtok = 7; // an operator-pinned value
  const res = mergePriceBook(
    book,
    {
      // A perfectly in-band 6 would normally apply, but the pin blocks it.
      anthropic: { ok: true, prices: [{ modelId: "claude-opus-4-8", inputPerMtok: 6, outputPerMtok: 25 }] },
      openai: { ok: false, prices: [] },
    },
    NOW,
  );
  assertEquals(res.book.models["anthropic_claude_opus_4_8"].inputPerMtok, 7); // untouched
  assertEquals(res.priceChanges.length, 0);
});

Deno.test("mergePriceBook routes a non-profile id into candidates", () => {
  const book = buildSeedPriceBook(NOW);
  const res = mergePriceBook(
    book,
    {
      anthropic: { ok: true, prices: [{ modelId: "claude-opus-9-0", inputPerMtok: 8, outputPerMtok: 40 }] },
      openai: { ok: false, prices: [] },
    },
    NOW,
  );
  assertEquals(res.candidates.some((c) => c.modelId === "claude-opus-9-0"), true);
  // No profile model matched the fetched id, so opus-4-8 is missing from the (successful) anthropic fetch.
  assertEquals(res.missingFromProvider.includes("claude-opus-4-8"), true);
});

Deno.test("mergePriceBook does NOT flag stale when the provider fetch failed", () => {
  const book = buildSeedPriceBook(NOW);
  const res = mergePriceBook(
    book,
    { anthropic: { ok: false, prices: [] }, openai: { ok: false, prices: [] } },
    NOW,
  );
  // A failed fetch means "no data this cycle" — carry prices forward, don't mark stale.
  assertEquals(res.book.models["anthropic_claude_opus_4_8"].stale, false);
  assertEquals(res.staleModels.length, 0);
  assertEquals(res.missingFromProvider.length, 0);
});

// ── Calibration ──────────────────────────────────────────────────────────────

const KNOBS: PricingKnobs = { ...DEFAULT_KNOBS };

/** Build a COGS map with a single profile+feature entry. */
function cogsOne(profile: string, feature: string, avgCogsUsd: number, runs: number): CogsByProfileFeature {
  return { [`${profile}::${feature}`]: { avgCogsUsd, runs } };
}

Deno.test("calibrateCreditCosts keeps current + reports lowData below minRuns", () => {
  const current = { anthropic_claude_opus_4_8: { narrative: 3, dailyLife: 4, progression: 5 } };
  const cogs = cogsOne("anthropic_claude_opus_4_8", "narrative", 1.0, 5); // only 5 runs < 20
  const res = calibrateCreditCosts(current, cogs, KNOBS);
  assertEquals(res.costs["anthropic_claude_opus_4_8"].narrative, 3); // unchanged
  assertEquals(res.lowData.some((l) => l.profile === "anthropic_claude_opus_4_8" && l.feature === "narrative"), true);
  assertEquals(res.creditChanges.length, 0);
});

Deno.test("calibrateCreditCosts clamps an UPWARD move to +1 step", () => {
  const current = { anthropic_claude_opus_4_8: { narrative: 3, dailyLife: 4, progression: 5 } };
  // recommended = ceil(2.0 * 1.2 / 0.157) = ceil(15.28) = 16, but capped to 12 AND clamped to current+1=4.
  const cogs = cogsOne("anthropic_claude_opus_4_8", "narrative", 2.0, 50);
  const res = calibrateCreditCosts(current, cogs, KNOBS);
  assertEquals(res.costs["anthropic_claude_opus_4_8"].narrative, 4); // 3 → +1 step
  const change = res.creditChanges.find((c) => c.feature === "narrative");
  assertEquals(change?.old, 3);
  assertEquals(change?.new, 4);
  assertEquals(change?.recommended, 16); // the raw recommendation before clamps
});

Deno.test("calibrateCreditCosts clamps a DOWNWARD move to -1 step (downward allowed)", () => {
  const current = { anthropic_claude_opus_4_8: { narrative: 6, dailyLife: 4, progression: 5 } };
  // recommended = ceil(0.05 * 1.2 / 0.157) = ceil(0.38) = 1, clamped to current-1 = 5.
  const cogs = cogsOne("anthropic_claude_opus_4_8", "narrative", 0.05, 50);
  const res = calibrateCreditCosts(current, cogs, KNOBS);
  assertEquals(res.costs["anthropic_claude_opus_4_8"].narrative, 5); // 6 → -1 step
  const change = res.creditChanges.find((c) => c.feature === "narrative");
  assertEquals(change?.old, 6);
  assertEquals(change?.new, 5);
});

Deno.test("calibrateCreditCosts respects the floor (never below 1)", () => {
  const current = { anthropic_claude_opus_4_8: { narrative: 1, dailyLife: 4, progression: 5 } };
  const cogs = cogsOne("anthropic_claude_opus_4_8", "narrative", 0.01, 50); // recommends 1
  const res = calibrateCreditCosts(current, cogs, KNOBS);
  assertEquals(res.costs["anthropic_claude_opus_4_8"].narrative, 1); // floor holds, no change
  assertEquals(res.creditChanges.some((c) => c.feature === "narrative"), false);
});

Deno.test("calibrateCreditCosts respects the cap (never above 12)", () => {
  const current = { anthropic_claude_opus_4_8: { narrative: 12, dailyLife: 4, progression: 5 } };
  const cogs = cogsOne("anthropic_claude_opus_4_8", "narrative", 5.0, 50); // recommends way over 12
  const res = calibrateCreditCosts(current, cogs, KNOBS);
  assertEquals(res.costs["anthropic_claude_opus_4_8"].narrative, 12); // cap holds, no change
  assertEquals(res.creditChanges.some((c) => c.feature === "narrative"), false);
});

Deno.test("calibrateCreditCosts records no change when recommended equals current", () => {
  // recommended = ceil(0.4 * 1.2 / 0.157) = ceil(3.05) = 4; with current 4, next = 4 → no change.
  const current = { anthropic_claude_opus_4_8: { narrative: 4, dailyLife: 4, progression: 5 } };
  const cogs = cogsOne("anthropic_claude_opus_4_8", "narrative", 0.4, 50);
  const res = calibrateCreditCosts(current, cogs, KNOBS);
  assertEquals(res.costs["anthropic_claude_opus_4_8"].narrative, 4);
  assertEquals(res.creditChanges.some((c) => c.feature === "narrative"), false);
});

Deno.test("calibrateCreditCosts falls back to the per-tier seed when current is malformed", () => {
  // A fast model with a malformed current narrative (0, out of 1..12) → seed 2.
  const current = { anthropic_claude_haiku_4_5: { narrative: 0, dailyLife: 3, progression: 4 } };
  const res = calibrateCreditCosts(current, {}, KNOBS); // no COGS → all lowData, keep resolved seed
  assertEquals(res.costs["anthropic_claude_haiku_4_5"].narrative, 2); // fast seed narrative
});

// ── computeAvgCogs ───────────────────────────────────────────────────────────

Deno.test("computeAvgCogs prices tokens with the merged book, falling back to stored cost", () => {
  const book = buildSeedPriceBook(NOW); // opus 5/25
  const groups: UsageGroup[] = [
    // 100k in + 20k out at 5/25 = 0.5 + 0.5 = 1.0 USD/run.
    { profile: "anthropic_claude_opus_4_8", feature: "narrative", runs: 30, avgInputTokens: 100_000, avgOutputTokens: 20_000, avgCostUsd: 99 },
    // Zero token sums → fall back to the stored avgCostUsd.
    { profile: "anthropic_claude_opus_4_8", feature: "dailyLife", runs: 25, avgInputTokens: 0, avgOutputTokens: 0, avgCostUsd: 0.42 },
    // A non-profile / non-feature group is ignored.
    { profile: "not_a_profile", feature: "narrative", runs: 100, avgInputTokens: 1, avgOutputTokens: 1, avgCostUsd: 1 },
  ];
  const cogs = computeAvgCogs(groups, book);
  assertEquals(Math.abs(cogs["anthropic_claude_opus_4_8::narrative"].avgCogsUsd - 1.0) < 1e-9, true);
  assertEquals(cogs["anthropic_claude_opus_4_8::dailyLife"].avgCogsUsd, 0.42); // stored fallback
  assertEquals(cogs["not_a_profile::narrative"], undefined);
});

// ── runPricingResync dry-run composition ─────────────────────────────────────

/** Recording admin stub: serves config rows + a usage-stats RPC, records upserts. */
function makeResyncStub() {
  const upserts: unknown[] = [];
  const rpcCalls: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const adminClient: any = {
    from: (_table: string) => ({
      select: () => ({
        in: () =>
          Promise.resolve({
            data: [
              { key: "ai_price_book", value: buildSeedPriceBook(NOW) },
              // Minimal credit-costs row.
              {
                key: "ai_credit_costs",
                value: { updatedAt: NOW, updatedBy: "seed", profiles: { anthropic_claude_opus_4_8: { narrative: 3, dailyLife: 4, progression: 5 } } },
              },
              { key: "ai_pricing_knobs", value: DEFAULT_KNOBS },
            ],
            error: null,
          }),
      }),
      upsert: (rows: unknown) => {
        upserts.push(rows);
        return Promise.resolve({ error: null });
      },
    }),
    rpc: (fn: string, args: unknown) => {
      rpcCalls.push({ fn, args });
      // aggregate_ai_usage_stats returns a groups payload.
      return Promise.resolve({
        data: {
          windowDays: 60,
          groups: [
            { profile: "anthropic_claude_opus_4_8", feature: "narrative", runs: 40, avgInputTokens: 100_000, avgOutputTokens: 20_000, avgCostUsd: 1 },
          ],
        },
        error: null,
      });
    },
  };
  return { adminClient, upserts, rpcCalls };
}

Deno.test("runPricingResync dry-run computes a report but writes NO config", async () => {
  const stub = makeResyncStub();
  const report = await runPricingResync({
    fetchText: () => Promise.resolve(ANTHROPIC_MD_FIXTURE), // both fetches resolve to a parseable page
    adminClient: stub.adminClient,
    now: () => NOW,
    actorUserId: "admin-1",
    dryRun: true,
  });
  assertEquals(report.success, true);
  assertEquals(report.dryRun, true);
  // NO upsert happened on a dry run.
  assertEquals(stub.upserts.length, 0);
  // The usage RPC WAS consulted (dry run still computes the would-be report).
  assertEquals(stub.rpcCalls.some((c) => c.fn === "aggregate_ai_usage_stats"), true);
  // The single usage group (40 runs) is above minRuns, so it's covered, not lowData.
  assertEquals(report.usage.totalRuns, 40);
  assertEquals(report.usage.profilesCovered, 1);
});

Deno.test("runPricingResync apply-mode upserts exactly the two config rows", async () => {
  const stub = makeResyncStub();
  const report = await runPricingResync({
    fetchText: () => Promise.resolve(ANTHROPIC_MD_FIXTURE),
    adminClient: stub.adminClient,
    now: () => NOW,
    actorUserId: "admin-1",
    dryRun: false,
  });
  assertEquals(report.dryRun, false);
  assertEquals(stub.upserts.length, 1); // one upsert call carrying both rows
  const rows = stub.upserts[0] as Array<{ key: string; updated_by: string }>;
  assertEquals(rows.length, 2);
  assertEquals(rows.map((r) => r.key).sort(), ["ai_credit_costs", "ai_price_book"]);
  assertEquals(rows.every((r) => r.updated_by === "admin-1"), true);
});

Deno.test("runPricingResync records a fetch failure as a warning, not a throw", async () => {
  const stub = makeResyncStub();
  const report = await runPricingResync({
    fetchText: (url: string) =>
      url.includes("openai") ? Promise.reject(new Error("boom")) : Promise.resolve(ANTHROPIC_MD_FIXTURE),
    adminClient: stub.adminClient,
    now: () => NOW,
    actorUserId: "admin-1",
    dryRun: true,
  });
  assertEquals(report.success, true);
  assertEquals(report.warnings.some((w) => w.includes("openai fetch failed")), true);
});
