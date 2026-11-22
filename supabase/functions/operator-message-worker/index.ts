// deno-lint-ignore-file no-import-prefix
/**
 * Disabled-by-default durable courier for queued Operator Message broadcasts.
 *
 * Migration 194 owns the one-job-per-message queue, tokenized leases, stable
 * recipient cursor, and receipt writes. This function owns only external mail.
 * Its private dispatcher is seeded disabled with no URL/secret and must remain
 * inert until an owner deliberately activates it outside this change.
 */
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";
import {
  boundedInteger,
  readCronDispatcherConfig,
  timingSafeEqualText,
} from "../_shared/cronWorkerPolicy.ts";
import { logError } from "../_shared/logError.ts";
import { selectMailAdapter, type MailAdapter } from "../_shared/mailAdapter.ts";
import {
  renderOperatorMessageEmail,
  type OperatorMessageClass,
} from "../_shared/operatorMessageEmail.ts";

const WORKER_NAME = "operator-message-worker";
const SECRET_HEADER = "x-cron-secret";
const SECRET_ENV = "OPERATOR_MESSAGE_CRON_SECRET";
const CONFIG_KEY = "operator_message_delivery_cron";
const LAST_RUN_KEY = "operator_message_delivery_last_run";

const LIMITS = {
  maxJobs: { fallback: 4, minimum: 1, maximum: 25 },
  recipientBatchSize: { fallback: 100, minimum: 1, maximum: 500 },
  leaseSeconds: { fallback: 240, minimum: 30, maximum: 900 },
} as const;

function defaultAdminClient() {
  return createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
}

type AdminClient = ReturnType<typeof defaultAdminClient>;

type DeliveryJob = {
  job_id: string;
  message_id: string;
  lease_token: string;
  message_class: OperatorMessageClass;
  subject: string;
  body: string;
  cursor_created_at?: string | null;
  cursor_user_id?: string | null;
};

type Recipient = {
  user_id: string;
  created_at: string;
  email_eligible: boolean;
};

type RecipientClaim = {
  attemptToken: string;
  email: string;
  unsubscribeToken: string | null;
  emailIdempotencyKey: string;
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function readConfig(admin: AdminClient): Promise<Record<string, unknown> | null> {
  try {
    const { data, error } = await admin.from("system_config")
      .select("value").eq("key", CONFIG_KEY).single();
    if (error || !data?.value || typeof data.value !== "object") return null;
    return data.value as Record<string, unknown>;
  } catch (error) {
    logError(WORKER_NAME, null, error);
    return null;
  }
}

async function recordLastRun(admin: AdminClient, value: Record<string, unknown>) {
  try {
    await admin.from("system_config").upsert(
      [{ key: LAST_RUN_KEY, value }],
      { onConflict: "key" },
    );
  } catch (error) {
    logError(WORKER_NAME, null, error);
  }
}

function unsubscribeUrl(token: string): string {
  const base = (Deno.env.get("SUPABASE_URL") || "").replace(/\/$/, "");
  return `${base}/functions/v1/unsubscribe?token=${encodeURIComponent(token)}&category=product_updates`;
}

function firstRecord(value: unknown): Record<string, unknown> | null {
  const candidate = Array.isArray(value) ? value[0] : value;
  return candidate && typeof candidate === "object"
    ? candidate as Record<string, unknown>
    : null;
}

async function renewJobLease(
  admin: AdminClient,
  job: DeliveryJob,
  leaseSeconds: number,
): Promise<void> {
  const { data, error } = await admin.rpc(
    "renew_operator_message_delivery_job_lease",
    {
      p_job_id: job.job_id,
      p_lease_token: job.lease_token,
      p_lease_seconds: leaseSeconds,
    },
  );
  if (error) throw new Error(`job lease renewal failed: ${error.message}`);
  const renewed = firstRecord(data);
  if (!renewed || renewed.lease_token !== job.lease_token) {
    throw new Error("job lease renewal failed: lease not retained");
  }
}

async function claimRecipient(
  admin: AdminClient,
  job: DeliveryJob,
  recipient: Recipient,
): Promise<RecipientClaim | null> {
  const { data, error } = await admin.rpc("claim_operator_message_recipient", {
    p_job_id: job.job_id,
    p_lease_token: job.lease_token,
    p_user_id: recipient.user_id,
  });
  if (error) throw new Error(`recipient claim failed: ${error.message}`);
  const claimed = firstRecord(data);
  if (claimed?.claimed !== true) return null;
  if (
    typeof claimed.attempt_token !== "string" || !claimed.attempt_token ||
    typeof claimed.email !== "string" || !claimed.email.includes("@") ||
    typeof claimed.email_idempotency_key !== "string" ||
    !claimed.email_idempotency_key
  ) {
    throw new Error("recipient claim returned an invalid delivery envelope");
  }
  return {
    attemptToken: claimed.attempt_token,
    email: claimed.email,
    unsubscribeToken: typeof claimed.unsubscribe_token === "string"
      ? claimed.unsubscribe_token
      : null,
    emailIdempotencyKey: claimed.email_idempotency_key,
  };
}

async function recordEmail(
  admin: AdminClient,
  job: DeliveryJob,
  recipient: Recipient,
  claim: RecipientClaim,
  input: {
    status: "sent" | "failed" | "skipped";
    provider: string;
    providerId?: string | null;
    reason?: string | null;
  },
) {
  const { error } = await admin.rpc("record_operator_message_delivery_result", {
    p_job_id: job.job_id,
    p_lease_token: job.lease_token,
    p_user_id: recipient.user_id,
    p_attempt_token: claim.attemptToken,
    p_status: input.status,
    p_provider: input.provider,
    p_provider_id: input.providerId ?? null,
    p_failure_reason: input.reason ?? null,
  });
  if (error) throw new Error(`receipt write failed: ${error.message}`);
}

async function processJob(
  admin: AdminClient,
  mailer: MailAdapter,
  job: DeliveryJob,
  recipientBatchSize: number,
  leaseSeconds: number,
): Promise<{ sent: number; failed: number; skipped: number; done: boolean }> {
  // A claimed job can sit behind earlier jobs in this invocation. Refresh its
  // authority before page discovery; the page RPC also validates the token.
  await renewJobLease(admin, job, leaseSeconds);
  const { data, error } = await admin.rpc("page_operator_message_recipients", {
    p_job_id: job.job_id,
    p_lease_token: job.lease_token,
    p_after_created_at: job.cursor_created_at ?? null,
    p_after_user_id: job.cursor_user_id ?? null,
    p_limit: recipientBatchSize,
  });
  if (error) throw new Error(`recipient page failed: ${error.message}`);
  const recipients = Array.isArray(data) ? data as Recipient[] : [];
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const recipient of recipients) {
    // The page RPC owns replay/consent eligibility under the active lease. A
    // false row may already have a terminal sent/failed/skipped receipt from a
    // crash-after-record-before-advance run, so never send OR rewrite it.
    if (recipient.email_eligible !== true) {
      skipped += 1;
      continue;
    }

    // Discovery is never send permission. Renew immediately before the CAS, then
    // use only the claim-returned address/consent token/idempotency key. A second
    // worker, stale consent, or an expired lease produces claimed=false/no send.
    await renewJobLease(admin, job, leaseSeconds);
    const claim = await claimRecipient(admin, job, recipient);
    if (!claim) {
      skipped += 1;
      continue;
    }
    if (job.message_class === "announcement" && !claim.unsubscribeToken) {
      await recordEmail(admin, job, recipient, claim, {
        status: "failed", provider: mailer.id, reason: "unsubscribe_token_unavailable",
      });
      failed += 1;
      continue;
    }

    const clientUrl = (Deno.env.get("CLIENT_URL") || "https://settlementforge.com").replace(/\/$/, "");
    const rendered = renderOperatorMessageEmail({
      messageClass: job.message_class,
      subject: job.subject,
      body: job.body,
      accountUrl: `${clientUrl}/?view=account&section=messages`,
      unsubscribeUrl: job.message_class === "announcement"
        ? unsubscribeUrl(claim.unsubscribeToken!)
        : null,
    });
    let providerResult: { id: string | null };
    try {
      providerResult = await mailer.send({
        to: claim.email,
        subject: rendered.subject,
        text: rendered.text,
        headers: rendered.headers,
        // Resend honors this as an API idempotency key. Postmark explicitly does
        // not; the database no-resend orphan policy is the provider-neutral guard.
        idempotencyKey: `operator-message/${claim.emailIdempotencyKey}`,
      });
    } catch (sendError) {
      logError(WORKER_NAME, recipient.user_id, sendError, {
        jobId: job.job_id,
        stage: "provider_send",
      });
      await recordEmail(admin, job, recipient, claim, {
        status: "failed",
        provider: mailer.id,
        reason: "provider_error",
      });
      failed += 1;
      continue;
    }
    // Keep receipt persistence outside the provider catch: a failed/lost
    // terminal CAS after provider acceptance is an ambiguous outcome, not a
    // provider failure, and must never be rewritten or retried as one.
    await recordEmail(admin, job, recipient, claim, {
      status: "sent", provider: mailer.id, providerId: providerResult.id,
    });
    sent += 1;
  }

  const last = recipients[recipients.length - 1];
  const done = recipients.length < recipientBatchSize;
  // Keep the job token current through cursor commit. Terminal receipt writes use
  // their own attempt token, so a legitimate provider response can still record
  // after wall-clock job expiry; cursor advance still requires active ownership.
  await renewJobLease(admin, job, leaseSeconds);
  const { error: advanceError } = await admin.rpc(
    "advance_operator_message_delivery_job",
    {
      p_job_id: job.job_id,
      p_lease_token: job.lease_token,
      p_cursor_created_at: last?.created_at ?? job.cursor_created_at ?? null,
      p_cursor_user_id: last?.user_id ?? job.cursor_user_id ?? null,
      p_done: done,
    },
  );
  if (advanceError) throw new Error(`job advance failed: ${advanceError.message}`);
  return { sent, failed, skipped, done };
}

export async function handleOperatorMessageWorker(
  req: Request,
  deps: {
    adminClient?: () => AdminClient;
    mailAdapter?: () => MailAdapter;
    envSecret?: () => string | undefined;
    now?: () => string;
  } = {},
): Promise<Response> {
  if (req.method !== "POST") return json({ error: "method not allowed" }, 405);

  const expected = ((deps.envSecret ?? (() => Deno.env.get(SECRET_ENV)))() || "").trim();
  if (!expected) return json({ error: "cron secret not configured" }, 503);
  if (!(await timingSafeEqualText(req.headers.get(SECRET_HEADER) || "", expected))) {
    return json({ error: "forbidden" }, 403);
  }

  const admin = (deps.adminClient ?? defaultAdminClient)();
  const config = await readConfig(admin);
  if (!config) return json({ skipped: "config_unavailable" }, 503);
  if (config.enabled !== true) return json({ skipped: "disabled" });
  const dispatcher = readCronDispatcherConfig(config);
  if (!dispatcher) return json({ skipped: "not_configured" }, 503);
  if (!(await timingSafeEqualText(dispatcher.secret, expected))) {
    return json({ skipped: "config_secret_mismatch" }, 503);
  }

  const mailer = (deps.mailAdapter ?? selectMailAdapter)();
  if (!mailer.configured) return json({ skipped: "mail_unconfigured" }, 503);

  const maxJobs = boundedInteger(config.maxJobsPerRun, LIMITS.maxJobs.fallback, LIMITS.maxJobs.minimum, LIMITS.maxJobs.maximum);
  const recipientBatchSize = boundedInteger(config.recipientBatchSize, LIMITS.recipientBatchSize.fallback, LIMITS.recipientBatchSize.minimum, LIMITS.recipientBatchSize.maximum);
  const leaseSeconds = boundedInteger(config.leaseSeconds, LIMITS.leaseSeconds.fallback, LIMITS.leaseSeconds.minimum, LIMITS.leaseSeconds.maximum);
  const startedAt = (deps.now ?? (() => new Date().toISOString()))();
  const { data, error } = await admin.rpc("claim_operator_message_delivery_jobs", {
    p_limit: maxJobs,
    p_lease_seconds: leaseSeconds,
  });
  if (error) return json({ error: "job claim failed" }, 502);
  const jobs = Array.isArray(data) ? data as DeliveryJob[] : [];
  const summary = { claimed: jobs.length, sent: 0, failed: 0, skipped: 0, completed: 0, jobErrors: 0 };

  for (const job of jobs) {
    try {
      const result = await processJob(
        admin,
        mailer,
        job,
        recipientBatchSize,
        leaseSeconds,
      );
      summary.sent += result.sent;
      summary.failed += result.failed;
      summary.skipped += result.skipped;
      if (result.done) summary.completed += 1;
    } catch (jobError) {
      summary.jobErrors += 1;
      logError(WORKER_NAME, null, jobError, { jobId: job.job_id });
      await admin.rpc("fail_operator_message_delivery_job", {
        p_job_id: job.job_id,
        p_lease_token: job.lease_token,
        p_reason: jobError instanceof Error ? jobError.message.slice(0, 500) : "worker_error",
      });
    }
  }

  const finishedAt = (deps.now ?? (() => new Date().toISOString()))();
  await recordLastRun(admin, { at: finishedAt, startedAt, ok: summary.jobErrors === 0, ...summary });
  return json({ ok: summary.jobErrors === 0, ...summary }, summary.jobErrors === 0 ? 200 : 502);
}

serve((req) => handleOperatorMessageWorker(req));
