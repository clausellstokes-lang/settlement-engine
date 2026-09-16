// deno-lint-ignore-file no-import-prefix
/**
 * payment-refund-worker — unattended recovery for durable Stripe refunds.
 *
 * Migration 180 dispatches:
 *   pg_cron -> run_payment_refund_recovery() -> pg_net POST -> this worker.
 *
 * Four ordered, fail-closed gates protect the service-role sweep:
 *   1. PAYMENT_REFUND_CRON_SECRET must be configured (otherwise 503).
 *   2. x-cron-secret must match it in constant time (otherwise 403).
 *   3. private system_config.payment_refund_recovery_cron.enabled is exactly true.
 *   4. its URL and stored secret activate the otherwise-inert dispatcher, and
 *      that secret matches the environment secret.
 *
 * The shared reconciler claims expiring leases, replays the original Stripe
 * idempotency key, and records every lifecycle observation through migration
 * 177's ordering RPC. It never updates payment_refund_obligations directly.
 *
 * The exported handler retains dependency seams for execution tests. Production
 * passes no dependencies and reaches serve() at the bottom of this file.
 */
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import {
  boundedInteger,
  readCronDispatcherConfig,
  timingSafeEqualText,
} from "../_shared/cronWorkerPolicy.ts";
import { logError } from "../_shared/logError.ts";
import {
  defaultPaymentRefundStripeClient,
  processPaymentRefundRecoveryQueue,
  type PaymentRefundRecoveryOptions,
  type PaymentRefundRecoverySummary,
  type StripeRefundsApi,
} from "../_shared/paymentRefundRecovery.ts";

const WORKER_NAME = "payment-refund-worker";
const CRON_SECRET_HEADER = "x-cron-secret";
const CRON_SECRET_ENV = "PAYMENT_REFUND_CRON_SECRET";
const CRON_CONFIG_KEY = "payment_refund_recovery_cron";
const LAST_RUN_CONFIG_KEY = "payment_refund_recovery_last_run";

const WORKER_LIMITS = {
  claimBatchSize: { fallback: 10, minimum: 1, maximum: 100 },
  maxJobsPerRun: { fallback: 25, minimum: 1, maximum: 500 },
  leaseSeconds: { fallback: 120, minimum: 30, maximum: 900 },
  retryBaseSeconds: { fallback: 60, minimum: 30, maximum: 3600 },
} as const;

function defaultAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

type AdminClient = ReturnType<typeof defaultAdminClient>;

function jsonResponse(
  body: Record<string, unknown>,
  status = 200,
): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export interface PaymentRefundWorkerDeps {
  /** Injectable seams for execution tests; production uses every default. */
  adminClient?: () => AdminClient;
  stripeClient?: () => StripeRefundsApi | null;
  envSecret?: () => string | undefined;
  now?: () => string;
  processQueue?: (
    adminClient: AdminClient,
    options: PaymentRefundRecoveryOptions,
  ) => Promise<PaymentRefundRecoverySummary>;
}

/**
 * Read the private kill-switch row. Missing, malformed, and failed reads all
 * return null so the handler can reject them with the same fail-closed result.
 */
async function readPrivateCronConfig(
  adminClient: AdminClient,
): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await adminClient
      .from("system_config")
      .select("value")
      .eq("key", CRON_CONFIG_KEY)
      .single();
    if (error) {
      logError(
        WORKER_NAME,
        null,
        `config read failed: ${error.message}`,
      );
      return null;
    }
    if (data?.value && typeof data.value === "object") {
      return data.value as Record<string, unknown>;
    }
    logError(WORKER_NAME, null, "cron config row missing or malformed");
  } catch (error) {
    logError(WORKER_NAME, null, error);
  }
  return null;
}

async function recordLastRun(
  adminClient: AdminClient,
  value: Record<string, unknown>,
): Promise<void> {
  try {
    const { error } = await adminClient.from("system_config").upsert(
      [{ key: LAST_RUN_CONFIG_KEY, value }],
      { onConflict: "key" },
    );
    if (error) {
      logError(
        WORKER_NAME,
        null,
        `last-run write failed: ${error.message}`,
      );
    }
  } catch (error) {
    logError(WORKER_NAME, null, error);
  }
}

export async function handlePaymentRefundWorker(
  req: Request,
  deps: PaymentRefundWorkerDeps = {},
): Promise<Response> {
  // Gate 1: pg_net dispatches POST only.
  if (req.method !== "POST") {
    return jsonResponse({ error: "method not allowed" }, 405);
  }

  // Gate 2: an unset environment secret must never create an open endpoint.
  const readSecret = deps.envSecret ??
    (() => Deno.env.get(CRON_SECRET_ENV));
  const expectedSecret = (readSecret() || "").trim();
  if (!expectedSecret) {
    logError(WORKER_NAME, null, "cron secret not configured");
    return jsonResponse({ error: "cron secret not configured" }, 503);
  }
  const providedSecret = req.headers.get(CRON_SECRET_HEADER) || "";
  if (!(await timingSafeEqualText(providedSecret, expectedSecret))) {
    logError(WORKER_NAME, null, "cron secret mismatch");
    return jsonResponse({ error: "forbidden" }, 403);
  }

  const makeAdminClient = deps.adminClient ?? defaultAdminClient;
  const makeStripeClient = deps.stripeClient ??
    defaultPaymentRefundStripeClient;
  const processQueue = deps.processQueue ??
    processPaymentRefundRecoveryQueue;
  const now = deps.now ?? (() => new Date().toISOString());
  const adminClient = makeAdminClient();

  // Gate 3: re-read the private database kill switch. A missing, malformed, or
  // unreadable row is never interpreted as enabled.
  const config = await readPrivateCronConfig(adminClient);
  if (config === null) {
    return jsonResponse({ skipped: "config_unavailable" }, 503);
  }
  if (config.enabled !== true) {
    return jsonResponse({ skipped: "disabled" });
  }

  // Gate 4: migrations seed an inert dispatcher. Both activation fields must
  // be present, and the stored secret must agree with this deployment.
  const dispatcher = readCronDispatcherConfig(config);
  if (!dispatcher) {
    return jsonResponse({ skipped: "not_configured" }, 503);
  }
  if (!(await timingSafeEqualText(dispatcher.secret, expectedSecret))) {
    logError(
      WORKER_NAME,
      null,
      "database cron secret does not match worker secret",
    );
    return jsonResponse({ skipped: "config_secret_mismatch" }, 503);
  }

  const claimBatchSize = boundedInteger(
    config.claimBatchSize,
    WORKER_LIMITS.claimBatchSize.fallback,
    WORKER_LIMITS.claimBatchSize.minimum,
    WORKER_LIMITS.claimBatchSize.maximum,
  );
  const maxJobs = boundedInteger(
    config.maxJobsPerRun,
    WORKER_LIMITS.maxJobsPerRun.fallback,
    WORKER_LIMITS.maxJobsPerRun.minimum,
    WORKER_LIMITS.maxJobsPerRun.maximum,
  );
  const leaseSeconds = boundedInteger(
    config.leaseSeconds,
    WORKER_LIMITS.leaseSeconds.fallback,
    WORKER_LIMITS.leaseSeconds.minimum,
    WORKER_LIMITS.leaseSeconds.maximum,
  );
  const retryBaseSeconds = boundedInteger(
    config.retryBaseSeconds,
    WORKER_LIMITS.retryBaseSeconds.fallback,
    WORKER_LIMITS.retryBaseSeconds.minimum,
    WORKER_LIMITS.retryBaseSeconds.maximum,
  );
  const startedAt = now();

  try {
    const recovery = await processQueue(adminClient, {
      stripeClient: makeStripeClient(),
      claimBatchSize,
      maxJobs,
      leaseSeconds,
      retryBaseSeconds,
      now,
      log: (message, details) =>
        logError(WORKER_NAME, null, message, details),
    });
    const ok = recovery.failed === 0 &&
      recovery.leaseLost === 0 &&
      recovery.manualAction === 0;
    const finishedAt = now();
    await recordLastRun(adminClient, {
      at: finishedAt,
      startedAt,
      ok,
      recovery,
    });

    if (!ok) {
      return jsonResponse({
        ok: false,
        retryScheduled: recovery.retryScheduled > 0,
        manualActionRequired: recovery.manualAction > 0,
        recovery,
      }, 502);
    }
    return jsonResponse({
      ok: true,
      recovery,
      processedAt: finishedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logError(WORKER_NAME, null, error);
    await recordLastRun(adminClient, {
      at: now(),
      startedAt,
      ok: false,
      error: message,
    });
    return jsonResponse(
      { ok: false, error: "refund recovery queue failed" },
      500,
    );
  }
}

serve((req) => handlePaymentRefundWorker(req));
