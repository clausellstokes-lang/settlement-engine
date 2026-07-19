/**
 * retention-warning-cron — the NIGHTLY retention-expiry warning sweep.
 *
 * Invoked once per local midnight by the pg_cron job scheduled in migration 163
 * (run_retention_warning_nightly → net.http_post here). It sweeps the two asset
 * tables (settlements, saved_maps) for plan-inactive rows whose retention_expires_at
 * falls within the warning window, groups them by (owner, expiry date), and emails
 * each owner ONCE — the heads-up before the 024 purge job clears their retained
 * worlds, while there is still time to export or resubscribe.
 *
 * TRUST BOUNDARY (identical to pricing-resync-cron). Three fail-closed gates:
 *   1. env RETENTION_WARNING_CRON_SECRET must be set (else 503 — refuse to run
 *      unconfigured rather than run wide open).
 *   2. the x-cron-secret header must match, compared CONSTANT-TIME → mismatch 403.
 *   3. the server-side 'retention_warning_cron' config `enabled` flag must be true
 *      (a second kill switch) → else 200 { skipped }.
 *
 * AT-MOST-ONCE. Before sending, the sweep CLAIMS a row in retention_warning_dispatch
 * (insert on conflict do nothing) keyed (account_id, warn_for_date); it only sends
 * when the claim is new, and RELEASES the claim if the send fails, so an account is
 * warned at most once per expiry date and a transient failure retries next night.
 *
 * THE MAIL SEAM (fold coordination). The send goes through send-email with template
 * 'retention_warning', registered by the Wave E adapter on a PARALLEL branch — NOT
 * folded here. Until Wave E lands (and admits 'retention_warning' to send-email's
 * ANON_OK_TEMPLATES so a JWT-less cron may supply the recipient), every send returns
 * unknown_template and the sweep records it as a failure (claim released), inert by
 * construction. Code against the template NAME; the transport is Wave E's to finish.
 *
 * The handler is exported with an injectable `deps` seam (adminClient / now /
 * envSecret / resolveEmail / sendWarning) so index.test.ts can drive it without real
 * db / fetch / env. Production passes nothing.
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import { botGuard } from "../_shared/requestMeta.ts";
import { logError } from "../_shared/logError.ts";

/** Service-role client — config + asset reads, the dedup ledger, auth email lookup, audit. */
function defaultAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

/**
 * Constant-time compare of two secrets (SHA-256 → XOR-accumulate). Mirrors
 * pricing-resync-cron / verify-single-dossier so neither length nor an early
 * differing byte leaks a timing side channel.
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

/** Resolve an account's email via the service-role auth admin API. */
// deno-lint-ignore no-explicit-any
async function defaultResolveEmail(adminClient: any, userId: string): Promise<string | null> {
  try {
    const { data, error } = await adminClient.auth.admin.getUserById(userId);
    if (error) return null;
    return data?.user?.email ?? null;
  } catch {
    return null;
  }
}

/**
 * Default send seam — POST send-email with template 'retention_warning'. INERT
 * until the Wave E adapter registers that template (returns unknown_template today).
 */
async function defaultSendWarning(
  recipient: string,
  payload: Record<string, unknown>,
): Promise<{ ok: boolean; reason?: string }> {
  const base = Deno.env.get("SUPABASE_URL") ?? "";
  const key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  try {
    const res = await fetch(`${base}/functions/v1/send-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${key}`,
        "apikey": key,
      },
      body: JSON.stringify({ template: "retention_warning", recipient, payload }),
      signal: AbortSignal.timeout(10_000),
    });
    const body = await res.json().catch(() => ({}));
    return { ok: res.ok && body?.ok !== false, reason: body?.reason };
  } catch (e) {
    return { ok: false, reason: e instanceof Error ? e.message : String(e) };
  }
}

export interface RetentionCronDeps {
  // deno-lint-ignore no-explicit-any
  adminClient?: () => any;
  now?: () => string;
  /** The expected cron secret. Defaults to the env var; injectable for tests. */
  envSecret?: () => string | undefined;
  // deno-lint-ignore no-explicit-any
  resolveEmail?: (adminClient: any, userId: string) => Promise<string | null>;
  sendWarning?: (recipient: string, payload: Record<string, unknown>) => Promise<{ ok: boolean; reason?: string }>;
}

/** The asset tables that carry a retention window (023 settlements, 024 saved_maps). */
const ASSET_TABLES = ["settlements", "saved_maps"] as const;

/**
 * The cron handler. POST-only, secret-gated, kill-switch-gated. Exported for the
 * execution test's injected-deps seam.
 */
export async function handleRetentionWarningCron(
  req: Request,
  deps: RetentionCronDeps = {},
): Promise<Response> {
  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const now = deps.now ?? (() => new Date().toISOString());
  const readSecret = deps.envSecret ?? (() => Deno.env.get("RETENTION_WARNING_CRON_SECRET"));
  const resolveEmail = deps.resolveEmail ?? defaultResolveEmail;
  const sendWarning = deps.sendWarning ?? defaultSendWarning;

  const json = (body: Record<string, unknown>, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });

  // Obvious-bot guard at the door (pg_net's server UA passes).
  const guard = botGuard(req, "retention-warning-cron");
  if (guard.reject) return guard.reject;

  // POST only — a cron dispatch is always a POST.
  if (req.method !== "POST") {
    return json({ error: "method not allowed" }, 405);
  }

  // 1. Fail CLOSED when the secret isn't configured: never run wide open.
  const expectedSecret = (readSecret() || "").trim();
  if (!expectedSecret) {
    logError("retention-warning-cron", null, "cron secret not configured");
    return json({ error: "cron secret not configured" }, 503);
  }

  // 2. Constant-time header check. Absent/mismatch → 403.
  const provided = req.headers.get("x-cron-secret") || "";
  if (!(await timingSafeEqualStr(provided, expectedSecret))) {
    logError("retention-warning-cron", null, "cron secret mismatch");
    return json({ error: "forbidden" }, 403);
  }

  const adminClient = makeAdminClient();

  // 3. Re-read the config server-side (the kill switch + warnWindowDays). FAIL
  //    CLOSED: a read failure must NOT default to enabled (that would defeat the
  //    kill switch on a transient DB error and email accounts unbidden).
  let cfg: Record<string, unknown> | null = null;
  try {
    const { data, error } = await adminClient
      .from("system_config")
      .select("value")
      .eq("key", "retention_warning_cron")
      .single();
    if (error) {
      logError("retention-warning-cron", null, `config read failed: ${error.message}`);
    } else if (data?.value && typeof data.value === "object") {
      cfg = data.value as Record<string, unknown>;
    } else {
      logError("retention-warning-cron", null, "cron config row missing or malformed");
    }
  } catch (e) {
    logError("retention-warning-cron", null, e);
  }

  if (cfg === null) {
    return json({ skipped: "config_unavailable" }, 503);
  }
  if (cfg.enabled !== true) {
    return json({ skipped: "disabled" });
  }

  const windowDays = Number.isFinite(Number(cfg.warnWindowDays)) && Number(cfg.warnWindowDays) > 0
    ? Number(cfg.warnWindowDays)
    : 14;

  try {
    const summary = await sweepAndWarn(adminClient, {
      nowIso: now(),
      windowDays,
      resolveEmail,
      sendWarning,
    });

    await upsertLastRun(adminClient, { at: now(), ok: true, trigger: "cron", summary, error: null });
    try {
      await adminClient.rpc("write_audit", {
        p_action: "retention_warning_cron",
        p_target_type: "retention_warning_dispatch",
        p_target_id: "nightly-sweep",
        p_reason: "nightly cron",
        p_after: summary,
        p_actor_id: null,
      });
    } catch (auditErr) {
      logError("retention-warning-cron", null, auditErr);
    }

    return json({ ok: true, trigger: "cron", ...summary });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logError("retention-warning-cron", null, e);
    try {
      await upsertLastRun(adminClient, { at: now(), ok: false, trigger: "cron", summary: null, error: message });
    } catch (_) {
      // already logged
    }
    return json({ ok: false, error: "sweep failed" }, 500);
  }
}

interface SweepSummary extends Record<string, unknown> {
  candidates: number;
  claimed: number;
  sent: number;
  skipped: number;
  failed: number;
}

/**
 * Sweep the asset tables for rows entering the warning window, group by (owner,
 * expiry date), claim each group in the dedup ledger, and send the ones that are
 * newly claimed. Claim-before-send + release-on-failure = at-most-once with retry.
 */
async function sweepAndWarn(
  // deno-lint-ignore no-explicit-any
  adminClient: any,
  opts: {
    nowIso: string;
    windowDays: number;
    // deno-lint-ignore no-explicit-any
    resolveEmail: (adminClient: any, userId: string) => Promise<string | null>;
    sendWarning: (recipient: string, payload: Record<string, unknown>) => Promise<{ ok: boolean; reason?: string }>;
  },
): Promise<SweepSummary> {
  const { nowIso, windowDays, resolveEmail, sendWarning } = opts;
  const windowEndIso = new Date(Date.parse(nowIso) + windowDays * 86_400_000).toISOString();

  // Collect (user_id, retention_expires_at) from both asset tables, plan-inactive
  // rows whose retention lands in the (now, now+window] warning window.
  const groups = new Map<string, { userId: string; warnForDate: string; count: number }>();
  for (const table of ASSET_TABLES) {
    const { data, error } = await adminClient
      .from(table)
      .select("user_id, retention_expires_at")
      .eq("access_state", "inactive_plan")
      .not("retention_expires_at", "is", null)
      .gt("retention_expires_at", nowIso)
      .lte("retention_expires_at", windowEndIso);
    if (error) {
      logError("retention-warning-cron", null, `${table} sweep read failed: ${error.message}`);
      continue;
    }
    for (const row of (data ?? [])) {
      const userId = row?.user_id;
      const expiry = row?.retention_expires_at;
      if (!userId || !expiry) continue;
      const warnForDate = String(expiry).slice(0, 10); // YYYY-MM-DD
      const key = `${userId}|${warnForDate}`;
      const g = groups.get(key) ?? { userId, warnForDate, count: 0 };
      g.count += 1;
      groups.set(key, g);
    }
  }

  let claimed = 0;
  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const g of groups.values()) {
    // Claim the (account, expiry-date) slot — insert on conflict do nothing. An
    // empty return means it was already warned (a prior run claimed it).
    const { data: claim, error: claimErr } = await adminClient
      .from("retention_warning_dispatch")
      .upsert([{ account_id: g.userId, warn_for_date: g.warnForDate }], {
        onConflict: "account_id,warn_for_date",
        ignoreDuplicates: true,
      })
      .select();
    if (claimErr) {
      logError("retention-warning-cron", null, `claim failed: ${claimErr.message}`);
      failed += 1;
      continue;
    }
    if (!claim || claim.length === 0) {
      skipped += 1; // already warned for this expiry date
      continue;
    }
    claimed += 1;

    const email = await resolveEmail(adminClient, g.userId);
    if (!email) {
      await releaseClaim(adminClient, g.userId, g.warnForDate);
      failed += 1;
      continue;
    }
    const res = await sendWarning(email, { expiresOn: g.warnForDate, count: g.count });
    if (res.ok) {
      sent += 1;
    } else {
      // Release so a fixed mail seam (or a transient outage) retries next night.
      await releaseClaim(adminClient, g.userId, g.warnForDate);
      failed += 1;
      logError("retention-warning-cron", null, `send failed (${res.reason ?? "unknown"}) for ${g.userId}`);
    }
  }

  return { candidates: groups.size, claimed, sent, skipped, failed };
}

/** Release a dedup claim so the account can be re-warned on a later run. */
async function releaseClaim(
  // deno-lint-ignore no-explicit-any
  adminClient: any,
  accountId: string,
  warnForDate: string,
): Promise<void> {
  const { error } = await adminClient
    .from("retention_warning_dispatch")
    .delete()
    .eq("account_id", accountId)
    .eq("warn_for_date", warnForDate);
  if (error) logError("retention-warning-cron", null, `claim release failed: ${error.message}`);
}

/** Upsert the compact retention_warning_last_run config row. */
async function upsertLastRun(
  // deno-lint-ignore no-explicit-any
  adminClient: any,
  value: {
    at: string;
    ok: boolean;
    trigger: string;
    summary: SweepSummary | null;
    error: string | null;
  },
): Promise<void> {
  const { error } = await adminClient.from("system_config").upsert(
    [{ key: "retention_warning_last_run", value }],
    { onConflict: "key" },
  );
  if (error) logError("retention-warning-cron", null, `last_run upsert failed: ${error.message}`);
}

// 1-arg lambda so the handler's optional `deps` doesn't clash with std/http's
// Handler signature — check:edge flags a direct serve(handler).
serve((req) => handleRetentionWarningCron(req));
