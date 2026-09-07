// deno-lint-ignore-file no-import-prefix
/**
 * account-deletion-worker — unattended durable account-erasure completion.
 *
 * Migration 175 replaces the unsafe SQL-only deletion cron with:
 *   pg_cron -> run_account_deletion_cleanup() -> pg_net POST -> this worker.
 *
 * Four ordered, fail-closed gates protect the service-role sweep:
 *   1. ACCOUNT_DELETION_CRON_SECRET must be configured (otherwise 503).
 *   2. x-cron-secret must match it in constant time (otherwise 403).
 *   3. private system_config.account_deletion_cron.enabled must be exactly true.
 *   4. its URL and stored secret activate the otherwise-inert dispatcher, and
 *      that secret matches the environment secret.
 *
 * The worker calls the same processAccountDeletionCleanupQueue implementation as
 * account-actions/process_deletions. Migration 175's leased queue makes retries,
 * overlap, stale-job recovery, partial auth progress, and finalization durable.
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
  defaultDeletionStripeClient,
  processAccountDeletionCleanupQueue,
  type DeletionCleanupOptions,
  type DeletionCleanupSummary,
  type StripeSubscriptionsApi,
} from "../_shared/accountDeletionCleanup.ts";

const WORKER_NAME = "account-deletion-worker";
const CRON_SECRET_HEADER = "x-cron-secret";
const CRON_SECRET_ENV = "ACCOUNT_DELETION_CRON_SECRET";
const CRON_CONFIG_KEY = "account_deletion_cron";
const LAST_RUN_CONFIG_KEY = "account_deletion_last_run";

const WORKER_LIMITS = {
  graceDays: { fallback: 7, minimum: 0, maximum: 365 },
  enqueueLimit: { fallback: 500, minimum: 1, maximum: 1000 },
  claimBatchSize: { fallback: 25, minimum: 1, maximum: 200 },
  maxJobsPerRun: { fallback: 50, minimum: 1, maximum: 2000 },
  staleAfterMinutes: { fallback: 30, minimum: 5, maximum: 1440 },
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

export interface AccountDeletionWorkerDeps {
  /** Injectable seams for execution tests; production uses every default. */
  adminClient?: () => AdminClient;
  stripeClient?: () => StripeSubscriptionsApi | null;
  envSecret?: () => string | undefined;
  now?: () => string;
  processQueue?: (
    adminClient: AdminClient,
    options: DeletionCleanupOptions,
  ) => Promise<DeletionCleanupSummary>;
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

export async function handleAccountDeletionWorker(
  req: Request,
  deps: AccountDeletionWorkerDeps = {},
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
  const makeStripeClient = deps.stripeClient ?? defaultDeletionStripeClient;
  const processQueue = deps.processQueue ?? processAccountDeletionCleanupQueue;
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

  const graceDays = boundedInteger(
    config.graceDays,
    WORKER_LIMITS.graceDays.fallback,
    WORKER_LIMITS.graceDays.minimum,
    WORKER_LIMITS.graceDays.maximum,
  );
  const enqueueLimit = boundedInteger(
    config.enqueueLimit,
    WORKER_LIMITS.enqueueLimit.fallback,
    WORKER_LIMITS.enqueueLimit.minimum,
    WORKER_LIMITS.enqueueLimit.maximum,
  );
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
  const staleAfterMinutes = boundedInteger(
    config.staleAfterMinutes,
    WORKER_LIMITS.staleAfterMinutes.fallback,
    WORKER_LIMITS.staleAfterMinutes.minimum,
    WORKER_LIMITS.staleAfterMinutes.maximum,
  );
  const startedAt = now();

  let enqueueResult: Record<string, unknown> | null = null;
  let enqueueError: string | null = null;
  try {
    const { data, error } = await adminClient.rpc(
      "process_account_deletions",
      {
        p_actor: null,
        p_grace_days: graceDays,
        p_limit: enqueueLimit,
      },
    );
    if (error) enqueueError = error.message;
    else if (data && typeof data === "object") {
      enqueueResult = data as Record<string, unknown>;
    }
  } catch (error) {
    enqueueError = error instanceof Error ? error.message : String(error);
  }

  // Even when new-enqueue failed, drain already-durable work: an unrelated
  // processor error must not leave an existing Stripe subscription charging.
  try {
    const cleanup = await processQueue(adminClient, {
      stripeClient: makeStripeClient(),
      claimBatchSize,
      maxJobs,
      staleAfterMinutes,
      log: (message, details) =>
        logError(WORKER_NAME, null, message, details),
    });
    const ok = enqueueError === null &&
      cleanup.failed === 0 &&
      cleanup.leaseLost === 0;
    const finishedAt = now();
    await recordLastRun(adminClient, {
      at: finishedAt,
      startedAt,
      ok,
      enqueue: enqueueResult,
      enqueueError,
      cleanup,
    });

    if (!ok) {
      if (enqueueError) {
        logError(
          WORKER_NAME,
          null,
          `deletion enqueue failed: ${enqueueError}`,
        );
      }
      return jsonResponse({
        ok: false,
        queued: enqueueError === null,
        retryScheduled: cleanup.failed > 0 || cleanup.leaseLost > 0,
        enqueue: enqueueResult,
        enqueueError,
        cleanup,
      }, 502);
    }
    return jsonResponse({
      ok: true,
      enqueue: enqueueResult,
      cleanup,
      processedAt: finishedAt,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    logError(WORKER_NAME, null, error);
    await recordLastRun(adminClient, {
      at: now(),
      startedAt,
      ok: false,
      enqueue: enqueueResult,
      enqueueError,
      error: message,
    });
    return jsonResponse({ ok: false, error: "cleanup queue failed" }, 500);
  }
}

serve((req) => handleAccountDeletionWorker(req));
