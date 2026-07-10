/**
 * pricing-resync-cron — the NIGHTLY AI pricing resync edge function.
 *
 * Invoked once per local midnight by the pg_cron job scheduled in migration 115
 * (run_pricing_resync_nightly → net.http_post here). It runs the SAME deterministic
 * pipeline the manual admin button does — runPricingResync from _shared/pricingResync.ts
 * — so the automated and manual paths can never drift.
 *
 * TRUST BOUNDARY. This endpoint mutates live pricing config, so it is gated THREE
 * ways, all fail-closed:
 *   1. env PRICING_RESYNC_CRON_SECRET must be set (else 503 — the endpoint refuses
 *      to run unconfigured rather than run wide open).
 *   2. the x-cron-secret header must match that secret, compared CONSTANT-TIME
 *      (sha-256 digests XOR'd byte-wise, like verify-single-dossier's token check)
 *      — mismatch/absent → 403.
 *   3. the server-side 'pricing_resync_cron' config `enabled` flag must be true
 *      (a second kill switch the admin panel toggles) → else 200 { skipped }.
 *
 * applyCreditCosts (from the same config row) is threaded into runPricingResync: when
 * false the run still freshens the PRICE BOOK but leaves ai_credit_costs untouched and
 * reports creditChanges as recommendations only. After every run it upserts a compact
 * 'pricing_resync_last_run' summary and writes one write_audit row (actor null).
 *
 * The handler is exported with an injectable `deps` seam (fetchText / adminClient /
 * now / envSecret) so index.test.ts can drive it without real fetch/env/db — the same
 * pattern as handleAdminActions / handleVerifyDossier. Production passes nothing.
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import { botGuard } from "../_shared/requestMeta.ts";
import { logError } from "../_shared/logError.ts";
import { runPricingResync } from "../_shared/pricingResync.ts";

/** Service-role client — config reads/writes + the usage-stats RPC + audit. */
function defaultAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

/**
 * Constant-time compare of two secrets. Both are SHA-256'd to a fixed 32-byte
 * digest first (so neither the length nor an early-differing byte leaks a timing
 * side channel), then XOR-accumulated over the whole digest. Mirrors the checkout-
 * token comparison in verify-single-dossier.
 */
async function timingSafeEqualStr(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const [da, db] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const va = new Uint8Array(da);
  const vb = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < va.length; i++) diff |= va[i] ^ vb[i];
  return diff === 0;
}

/** Fetch a URL's text with a bounded (10s) timeout. Throws on !ok / timeout. */
async function defaultFetchText(url: string): Promise<string> {
  const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return await res.text();
}

export interface CronDeps {
  fetchText?: (url: string) => Promise<string>;
  // deno-lint-ignore no-explicit-any
  adminClient?: () => any;
  now?: () => string;
  /** The expected cron secret. Defaults to the env var; injectable for tests. */
  envSecret?: () => string | undefined;
}

/**
 * The cron handler. POST-only, secret-gated, kill-switch-gated. Exported for the
 * execution test's injected-deps seam.
 */
export async function handlePricingResyncCron(
  req: Request,
  deps: CronDeps = {},
): Promise<Response> {
  const fetchText = deps.fetchText ?? defaultFetchText;
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const now = deps.now ?? (() => new Date().toISOString());
  const readSecret = deps.envSecret ?? (() => Deno.env.get("PRICING_RESYNC_CRON_SECRET"));

  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  // Obvious-bot guard at the door (pg_net's server UA passes; this only rejects
  // scraper/headless UAs probing the endpoint).
  const guard = botGuard(req, "pricing-resync-cron");
  if (guard.reject) return guard.reject;

  // POST only — a cron dispatch is always a POST; reject everything else.
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  // 1. Fail CLOSED when the secret isn't configured: never run wide open.
  const expectedSecret = (readSecret() || "").trim();
  if (!expectedSecret) {
    logError("pricing-resync-cron", null, "cron secret not configured");
    return json({ error: "cron secret not configured" }, 503);
  }

  // 2. Constant-time header check. Absent/mismatch → 403.
  const provided = req.headers.get("x-cron-secret") || "";
  if (!(await timingSafeEqualStr(provided, expectedSecret))) {
    logError("pricing-resync-cron", null, "cron secret mismatch");
    return json({ error: "forbidden" }, 403);
  }

  const adminClient = makeAdminClient();

  // 3. Re-read the config server-side (the kill switch + applyCreditCosts flag).
  //    FAIL CLOSED: if the config can't be read we must NOT run — defaulting to
  //    enabled+apply would (a) defeat the kill switch on a transient DB error and
  //    (b) auto-move the per-model charge even when the operator set
  //    applyCreditCosts=false. A read failure aborts the money mutation entirely.
  let cfg: Record<string, unknown> | null = null;
  try {
    const { data, error } = await adminClient
      .from("system_config")
      .select("value")
      .eq("key", "pricing_resync_cron")
      .single();
    if (error) {
      logError("pricing-resync-cron", null, `config read failed: ${error.message}`);
    } else if (data?.value && typeof data.value === "object") {
      cfg = data.value as Record<string, unknown>;
    } else {
      // Row missing/malformed → treat as unconfigured, do not run.
      logError("pricing-resync-cron", null, "cron config row missing or malformed");
    }
  } catch (e) {
    logError("pricing-resync-cron", null, e);
  }

  if (cfg === null) {
    // Could not read a valid config → fail closed, run nothing.
    return json({ skipped: "config_unavailable" }, 503);
  }

  const enabled = cfg.enabled === true;
  const applyCreditCosts = cfg.applyCreditCosts !== false; // default true only when the row IS readable

  if (!enabled) {
    return json({ skipped: "disabled" });
  }

  // ── Run the shared pipeline, then record the outcome + audit. ──
  try {
    const report = await runPricingResync({
      fetchText,
      adminClient,
      now,
      actorUserId: null as unknown as string, // cron has no acting user
      dryRun: false,
      applyCreditCosts,
    });

    const summary = {
      priceChanges: report.priceChanges.length,
      creditChanges: report.creditChanges.length,
      staleModels: report.staleModels.length,
      warnings: report.warnings.slice(0, 5),
    };

    // Compact last-run record (upsert so it's created on first run, overwritten after).
    await upsertLastRun(adminClient, {
      at: report.updatedAt,
      ok: true,
      trigger: "cron",
      summary,
      error: null,
    });

    // One audit row (actor null — cron). write_audit is granted to service_role (051).
    try {
      await adminClient.rpc("write_audit", {
        p_action: "ai_pricing_resync_cron",
        p_target_type: "system_config",
        p_target_id: "ai_price_book+ai_credit_costs",
        p_reason: "nightly cron",
        p_after: {
          priceChanges: summary.priceChanges,
          creditChanges: summary.creditChanges,
          creditChangesApplied: report.creditChangesApplied,
          staleModels: summary.staleModels,
        },
        p_actor_id: null,
      });
    } catch (auditErr) {
      // Auditing must never fail the run.
      logError("pricing-resync-cron", null, auditErr);
    }

    return json({
      ok: true,
      trigger: "cron",
      applyCreditCosts,
      creditChangesApplied: report.creditChangesApplied,
      summary,
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logError("pricing-resync-cron", null, e);
    // Best-effort failure record so the admin panel can surface it.
    try {
      await upsertLastRun(adminClient, {
        at: now(),
        ok: false,
        trigger: "cron",
        summary: null,
        error: message,
      });
    } catch (_) {
      // swallow — already logged the primary error
    }
    return json({ ok: false, error: "resync failed" }, 500);
  }
}

/** Upsert the compact pricing_resync_last_run config row. */
async function upsertLastRun(
  // deno-lint-ignore no-explicit-any
  adminClient: any,
  value: {
    at: string;
    ok: boolean;
    trigger: string;
    summary: Record<string, unknown> | null;
    error: string | null;
  },
): Promise<void> {
  const { error } = await adminClient.from("system_config").upsert(
    [{ key: "pricing_resync_last_run", value }],
    { onConflict: "key" },
  );
  if (error) logError("pricing-resync-cron", null, `last_run upsert failed: ${error.message}`);
}

// 1-arg lambda so the handler's optional `deps` doesn't clash with std/http's
// Handler signature (req, connInfo) — check:edge flags a direct serve(handler).
serve((req) => handlePricingResyncCron(req));
