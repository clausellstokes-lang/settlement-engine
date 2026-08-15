/**
 * index.test.ts — EXECUTION test of the pricing-resync-cron trust boundary.
 *
 * Deno test (runs under the `deno-tests` CI job / `deno task test:edge`, NOT vitest).
 * pricing-resync-cron mutates live pricing config, so it is triple-gated. This RUNS
 * the real handler with injected deps and asserts the boundary:
 *   - GET (or any non-POST) → 405
 *   - env secret unset → 503 (fail closed; refuses to run wide open)
 *   - wrong / missing x-cron-secret → 403 (constant-time compare)
 *   - config enabled:false → 200 { skipped: 'disabled' } (the second kill switch)
 *   - happy path → runPricingResync invoked, pricing_resync_last_run upserted,
 *     write_audit rpc'd with actor null
 *   - applyCreditCosts:false in config → the credit-cost row is NOT written (the
 *     upsert the pipeline issues omits ai_credit_costs)
 *
 * `handlePricingResyncCron` is the exported handler; we inject recording stubs via
 * its `deps` seam (fetchText / adminClient / now / envSecret). Production passes
 * nothing. Env is set for the module load (createClient at import is never reached
 * because we always inject adminClient, but the module reads no env at load time).
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

Deno.env.set("SUPABASE_URL", "https://stub.supabase.co");
Deno.env.set("SUPABASE_SERVICE_ROLE_KEY", "service_role_dummy");

const { handlePricingResyncCron } = await import("./index.ts");

const SECRET = "correct-horse-battery-staple";

/**
 * Recording admin-client stub. `cronCfg` is the value returned for the
 * pricing_resync_cron single() read; the three pricing config rows the pipeline
 * reads return an empty set (the pipeline then falls back to its seed builders).
 * Records every from(table).upsert row set and every rpc call.
 */
function makeAdminClient(cronCfg: Record<string, unknown>, opts: { cronReadError?: boolean } = {}) {
  const upserts: Array<{ table: string; rows: Array<Record<string, unknown>> }> = [];
  const rpc: Array<{ fn: string; args: unknown }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    from: (table: string) => ({
      // .select(...).eq(...).single()  → the cron config read
      // .select(...).in(...)           → the pipeline's 3-row config read
      select: (_cols: string) => ({
        eq: (_c: string, _v: string) => ({
          single: () =>
            opts.cronReadError
              ? Promise.resolve({ data: null, error: { message: "boom" } })
              : Promise.resolve({ data: { value: cronCfg }, error: null }),
        }),
        in: (_c: string, _vals: string[]) => Promise.resolve({ data: [], error: null }),
      }),
      upsert: (rows: Array<Record<string, unknown>>, _opts: unknown) => {
        upserts.push({ table, rows });
        return Promise.resolve({ error: null });
      },
    }),
    rpc: (fn: string, args: unknown) => {
      rpc.push({ fn, args });
      // aggregate_ai_usage_stats returns an empty group set; write_audit returns ok.
      if (fn === "aggregate_ai_usage_stats") {
        return Promise.resolve({ data: { windowDays: 60, groups: [] }, error: null });
      }
      return Promise.resolve({ data: null, error: null });
    },
  };
  return { client, upserts, rpc };
}

/** A fetchText that always succeeds with trivial (parses-to-zero-prices) text. */
const okFetch = (_url: string) => Promise.resolve("no prices here");

const req = (method: string, headers: Record<string, string> = {}) =>
  new Request("https://edge/pricing-resync-cron", { method, headers });

Deno.test("GET is rejected 405", async () => {
  const res = await handlePricingResyncCron(req("GET", { "x-cron-secret": SECRET }), {
    envSecret: () => SECRET,
    adminClient: () => makeAdminClient({ enabled: true }).client,
    fetchText: okFetch,
  });
  assertEquals(res.status, 405);
});

Deno.test("503 when the env secret is unset (fail closed)", async () => {
  const res = await handlePricingResyncCron(req("POST", { "x-cron-secret": "anything" }), {
    envSecret: () => undefined,
    adminClient: () => makeAdminClient({ enabled: true }).client,
    fetchText: okFetch,
  });
  assertEquals(res.status, 503);
  const body = await res.json();
  assertEquals(body.error, "cron secret not configured");
});

Deno.test("403 on a wrong x-cron-secret", async () => {
  const res = await handlePricingResyncCron(req("POST", { "x-cron-secret": "wrong" }), {
    envSecret: () => SECRET,
    adminClient: () => makeAdminClient({ enabled: true }).client,
    fetchText: okFetch,
  });
  assertEquals(res.status, 403);
});

Deno.test("403 when the x-cron-secret header is absent", async () => {
  const res = await handlePricingResyncCron(req("POST"), {
    envSecret: () => SECRET,
    adminClient: () => makeAdminClient({ enabled: true }).client,
    fetchText: okFetch,
  });
  assertEquals(res.status, 403);
});

Deno.test("200 { skipped: disabled } when the config kill switch is off", async () => {
  const stub = makeAdminClient({ enabled: false });
  const res = await handlePricingResyncCron(req("POST", { "x-cron-secret": SECRET }), {
    envSecret: () => SECRET,
    adminClient: () => stub.client,
    fetchText: okFetch,
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.skipped, "disabled");
  // Nothing was run: no last_run upsert, no rpc.
  assertEquals(stub.upserts.length, 0);
  assertEquals(stub.rpc.length, 0);
});

Deno.test("503 { config_unavailable } when the cron config read fails (fail closed)", async () => {
  const stub = makeAdminClient({ enabled: true, applyCreditCosts: false }, { cronReadError: true });
  const res = await handlePricingResyncCron(req("POST", { "x-cron-secret": SECRET }), {
    envSecret: () => SECRET,
    adminClient: () => stub.client,
    fetchText: okFetch,
  });
  assertEquals(res.status, 503);
  const body = await res.json();
  assertEquals(body.skipped, "config_unavailable");
  // Critical: the money pipeline never ran — no upserts, no audit/stats rpc. A read
  // failure must NOT default to enabled+applyCreditCosts and move the charge.
  assertEquals(stub.upserts.length, 0);
  assertEquals(stub.rpc.length, 0);
});

Deno.test("happy path: runs the pipeline, upserts last_run, audits with actor null", async () => {
  const stub = makeAdminClient({ enabled: true, applyCreditCosts: true });
  const res = await handlePricingResyncCron(req("POST", { "x-cron-secret": SECRET }), {
    envSecret: () => SECRET,
    adminClient: () => stub.client,
    fetchText: okFetch,
    now: () => "2026-07-07T00:00:00.000Z",
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.ok, true);
  assertEquals(body.trigger, "cron");

  // The pipeline wrote the config (price book + credit costs) AND the handler wrote
  // the last_run row. Find the last_run upsert.
  const lastRun = stub.upserts.find((u) => u.rows.some((r) => r.key === "pricing_resync_last_run"));
  assertEquals(lastRun !== undefined, true);
  const lastRunRow = lastRun!.rows.find((r) => r.key === "pricing_resync_last_run")!;
  const lastRunVal = lastRunRow.value as Record<string, unknown>;
  assertEquals(lastRunVal.ok, true);
  assertEquals(lastRunVal.trigger, "cron");

  // The audit ran with actor null.
  const audit = stub.rpc.find((c) => c.fn === "write_audit");
  assertEquals(audit !== undefined, true);
  const auditArgs = audit!.args as { p_action: string; p_actor_id: string | null };
  assertEquals(auditArgs.p_action, "ai_pricing_resync_cron");
  assertEquals(auditArgs.p_actor_id, null);

  // applyCreditCosts:true → the pipeline's config upsert includes ai_credit_costs.
  const cfgUpsert = stub.upserts.find((u) => u.rows.some((r) => r.key === "ai_price_book"));
  assertEquals(cfgUpsert !== undefined, true);
  const keys = cfgUpsert!.rows.map((r) => r.key);
  assertEquals(keys.includes("ai_credit_costs"), true);
});

Deno.test("applyCreditCosts:false leaves ai_credit_costs UNWRITTEN (price book only)", async () => {
  const stub = makeAdminClient({ enabled: true, applyCreditCosts: false });
  const res = await handlePricingResyncCron(req("POST", { "x-cron-secret": SECRET }), {
    envSecret: () => SECRET,
    adminClient: () => stub.client,
    fetchText: okFetch,
    now: () => "2026-07-07T00:00:00.000Z",
  });
  assertEquals(res.status, 200);
  const body = await res.json();
  assertEquals(body.applyCreditCosts, false);
  assertEquals(body.creditChangesApplied, false);

  // The pipeline's config upsert wrote the price book but NOT ai_credit_costs.
  const cfgUpsert = stub.upserts.find((u) => u.rows.some((r) => r.key === "ai_price_book"));
  assertEquals(cfgUpsert !== undefined, true);
  const keys = cfgUpsert!.rows.map((r) => r.key);
  assertEquals(keys.includes("ai_price_book"), true);
  assertEquals(keys.includes("ai_credit_costs"), false);
});
