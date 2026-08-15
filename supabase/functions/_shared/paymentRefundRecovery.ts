// deno-lint-ignore-file no-import-prefix
/**
 * Durable Stripe refund recovery shared by the secret-gated scheduled worker.
 *
 * Migration 180 owns claim/release leases. Migration 177's
 * record_payment_refund_obligation remains the single lifecycle status writer:
 * this module observes Stripe, calls that ordered RPC, and only then releases
 * the recovery lease.
 *
 * Replaying refunds.create is safe because each claim returns the exact
 * deterministic idempotency key and immutable obligation identity used by the
 * original webhook producer. Mutable user, attempt, and Checkout links never
 * enter Stripe request parameters.
 */
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";
import { buildPaymentRefundRequestMetadata } from "./paymentRefundRequest.ts";

export type PaymentRefundStatus =
  | "pending"
  | "requires_action"
  | "succeeded"
  | "failed"
  | "canceled";

export type PaymentRefundRecoveryJob = {
  payment_intent_id: string;
  stripe_refund_id: string | null;
  checkout_session_id: string | null;
  user_id: string | null;
  attempt_id: string | null;
  purpose: string;
  amount_cents: number;
  currency: string;
  reason: string;
  status: PaymentRefundStatus;
  stripe_event_created_at: string | null;
  stripe_idempotency_key: string;
  lease_token: string;
  recovery_attempts: number;
};

export type StripeRefundRecord = {
  id?: string | null;
  status?: string | null;
  failure_reason?: string | null;
  amount?: number;
  currency?: string | null;
  payment_intent?: string | { id?: string | null } | null;
};

export type StripeRefundsApi = {
  refunds: {
    create: (
      params: {
        payment_intent: string;
        metadata: Record<string, string>;
      },
      options: { idempotencyKey: string },
    ) => Promise<StripeRefundRecord>;
    retrieve: (id: string) => Promise<StripeRefundRecord>;
    list: (params: {
      payment_intent: string;
      limit: number;
    }) => Promise<{ data: StripeRefundRecord[] }>;
  };
};

export type PaymentRefundRecoverySummary = {
  claimed: number;
  reconciled: number;
  succeeded: number;
  nonterminal: number;
  manualAction: number;
  failed: number;
  retryScheduled: number;
  leaseLost: number;
  moneyEventsMirrored: number;
  pages: number;
  capped: boolean;
};

export type PaymentRefundRecoveryOptions = {
  claimBatchSize?: number;
  maxJobs?: number;
  leaseSeconds?: number;
  retryBaseSeconds?: number;
  stripeClient?: StripeRefundsApi | null;
  now?: () => string;
  log?: (message: string, details?: Record<string, unknown>) => void;
};

type AdminOperationError = {
  message: string;
  code?: string;
} | null;

type AdminMutationResult = PromiseLike<{
  error: AdminOperationError;
}>;

type MoneyEventsMutationTable = {
  upsert: (
    values: Record<string, unknown>,
    options?: Record<string, unknown>,
  ) => AdminMutationResult;
  update: (values: Record<string, unknown>) => {
    eq: (column: string, value: unknown) => AdminMutationResult;
  };
};

/**
 * The exact Supabase surface the recovery core consumes.
 *
 * Queue state changes stay behind RPCs; the only direct table writes are the
 * money-event mirror and reversal, which makes this boundary intentionally
 * much smaller than a full Supabase client.
 */
export type PaymentRefundAdminClient = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: AdminOperationError }>;
  from: (table: "money_events") => MoneyEventsMutationTable;
};

type AdminClient = PaymentRefundAdminClient;

const PAYMENT_REFUND_STATUSES = new Set<PaymentRefundStatus>([
  "pending",
  "requires_action",
  "succeeded",
  "failed",
  "canceled",
]);

const STRIPE_REFUND_LIST_LIMIT = 100;
const RECOVERY_RETRY_POLICY = {
  maximumSeconds: 86_400,
  maximumExponent: 10,
  maximumErrorCharacters: 1000,
} as const;
const RECOVERY_QUEUE_POLICY = {
  claimBatchSize: { fallback: 10, minimum: 1, maximum: 100 },
  maxJobs: { fallback: 25, minimum: 1, maximum: 500 },
  leaseSeconds: { fallback: 120, minimum: 30, maximum: 900 },
  retryBaseSeconds: { fallback: 60, minimum: 30, maximum: 3600 },
} as const;

let stripeSingleton: Stripe | null = null;

// ── Stripe adapter and obligation identity ──────────────────────────────────

/**
 * Lazily create Stripe so tests and unconfigured deployments can inject or
 * reject the adapter without doing module-load work.
 */
export function defaultPaymentRefundStripeClient(): StripeRefundsApi | null {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) return null;
  stripeSingleton ??= new Stripe(key, { apiVersion: "2023-10-16" });
  return stripeSingleton as unknown as StripeRefundsApi;
}

function boundedInt(
  value: unknown,
  fallback: number,
  min: number,
  max: number,
): number {
  const n = Number(value);
  return Number.isFinite(n)
    ? Math.max(min, Math.min(max, Math.trunc(n)))
    : fallback;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function refundStatus(value: unknown): PaymentRefundStatus {
  return typeof value === "string" &&
      PAYMENT_REFUND_STATUSES.has(value as PaymentRefundStatus)
    ? value as PaymentRefundStatus
    : "pending";
}

function refundPaymentIntentId(refund: StripeRefundRecord): string | null {
  if (typeof refund.payment_intent === "string") return refund.payment_intent;
  if (
    refund.payment_intent &&
    typeof refund.payment_intent === "object" &&
    typeof refund.payment_intent.id === "string"
  ) {
    return refund.payment_intent.id;
  }
  return null;
}

function assertRefundMatchesObligation(
  refund: StripeRefundRecord,
  job: PaymentRefundRecoveryJob,
): void {
  if (refundPaymentIntentId(refund) !== job.payment_intent_id) {
    throw new Error(
      `Stripe Refund ${refund.id ?? "(missing id)"} has conflicting payment identity`,
    );
  }
  if (
    !Number.isSafeInteger(refund.amount) ||
    refund.amount !== job.amount_cents
  ) {
    throw new Error(
      `Stripe Refund ${refund.id ?? "(missing id)"} does not cover the exact obligation amount`,
    );
  }
  if (
    typeof refund.currency !== "string" ||
    refund.currency.toLowerCase() !== job.currency.toLowerCase()
  ) {
    throw new Error(
      `Stripe Refund ${refund.id ?? "(missing id)"} has conflicting currency`,
    );
  }
}

function refundEventKey(job: PaymentRefundRecoveryJob): string {
  return job.purpose === "auto_reload_unfulfilled"
    ? `refund:auto-reload:${job.payment_intent_id}`
    : `refund:unfulfilled:${job.payment_intent_id}`;
}

function stripeErrorCode(error: unknown): string {
  const candidate = error as {
    code?: string;
    raw?: { code?: string };
  } | null;
  return candidate?.code ?? candidate?.raw?.code ?? "";
}

// ── Ordered database checkpoints and read-model mirrors ─────────────────────

/**
 * Record an observed Stripe lifecycle state through migration 177's ordered
 * writer. The returned status is authoritative because a newer event may have
 * won while this worker held its recovery lease.
 */
async function recordObservedStatus(
  adminClient: AdminClient,
  job: PaymentRefundRecoveryJob,
  observedStatus: PaymentRefundStatus,
  refundId: string,
  failureReason: string | null,
  reconciliationEventFloor: string | null,
  now: () => string,
): Promise<PaymentRefundStatus> {
  const terminal = observedStatus === "succeeded" ||
    observedStatus === "failed" ||
    observedStatus === "canceled";
  const { data, error } = await adminClient.rpc(
    "record_payment_refund_obligation",
    {
      p_payment_intent_id: job.payment_intent_id,
      p_purpose: job.purpose,
      p_amount_cents: job.amount_cents,
      p_currency: job.currency.toLowerCase(),
      p_reason: job.reason,
      p_status: observedStatus,
      p_stripe_refund_id: refundId,
      p_checkout_session_id: job.checkout_session_id,
      p_user_id: job.user_id,
      p_attempt_id: job.attempt_id,
      p_failure_reason:
        observedStatus === "failed" || observedStatus === "canceled"
          ? failureReason
          : null,
      // A live retrieve may safely advance the event snapshot that THIS lease
      // claimed by replaying that exact timestamp. It never invents wall-clock
      // event time: a genuinely newer event wins, and equal-time safety rank
      // keeps failed/canceled above succeeded. Create responses keep this NULL
      // because an idempotent replay can return Stripe's original response.
      p_stripe_event_created_at: reconciliationEventFloor,
      p_resolved_at: terminal ? now() : null,
    },
  );
  if (error) {
    throw new Error(
      `refund obligation status checkpoint failed: ${error.message}`,
    );
  }
  return refundStatus(
    data && typeof data === "object"
      ? (data as { status?: unknown }).status
      : observedStatus,
  );
}

async function releaseLease(
  adminClient: AdminClient,
  job: PaymentRefundRecoveryJob,
  error: string | null,
  retrySeconds: number,
): Promise<boolean> {
  const { data, error: rpcError } = await adminClient.rpc(
    "release_payment_refund_obligation_lease",
    {
      p_payment_intent_id: job.payment_intent_id,
      p_lease_token: job.lease_token,
      p_error: error,
      p_retry_seconds: retrySeconds,
    },
  );
  if (rpcError) {
    throw new Error(`refund recovery lease release failed: ${rpcError.message}`);
  }
  return data === true;
}

async function mirrorSucceededRefund(
  adminClient: AdminClient,
  job: PaymentRefundRecoveryJob,
  now: () => string,
  log: NonNullable<PaymentRefundRecoveryOptions["log"]>,
): Promise<boolean> {
  try {
    const { error } = await adminClient.from("money_events").upsert(
      {
        event_key: refundEventKey(job),
        user_id: job.user_id,
        occurred_at: now(),
        kind: "refund_note",
        amount_cents: job.amount_cents,
        currency: job.currency,
        description: "Refund note",
        receipt_url: null,
        status: "refunded",
        stripe_session_id: job.checkout_session_id,
        stripe_payment_intent_id: job.payment_intent_id,
        metadata: {
          reason: job.reason,
          attempt_id: job.attempt_id,
          refund_purpose: job.purpose,
        },
      },
      { onConflict: "event_key", ignoreDuplicates: true },
    );
    if (error) throw error;
    return true;
  } catch (error) {
    // money_events is an idempotent read-model mirror, not the refund authority.
    // Match stripe-webhook's never-throw posture so a mirror outage cannot keep
    // an already-completed Stripe obligation leased/retried.
    log("refund money-event mirror failed", {
      paymentIntentId: job.payment_intent_id,
      error: errorMessage(error),
    });
    return false;
  }
}

async function reverseRefundMirror(
  adminClient: AdminClient,
  job: PaymentRefundRecoveryJob,
  log: NonNullable<PaymentRefundRecoveryOptions["log"]>,
): Promise<void> {
  try {
    const { error } = await adminClient.from("money_events")
      .update({ status: "reversed" })
      .eq("event_key", refundEventKey(job));
    if (error) throw error;
  } catch (error) {
    log("refund money-event reversal failed", {
      paymentIntentId: job.payment_intent_id,
      error: errorMessage(error),
    });
  }
}

// ── Stripe reconciliation ───────────────────────────────────────────────────

/**
 * Recover the canonical refund observation for one durable obligation.
 *
 * A linked refund is retrieved directly. An unlinked obligation replays the
 * producer's exact idempotent create request. The create response is not treated
 * as a fresh lifecycle read because Stripe may replay its cached response.
 */
async function createOrRetrieveRefund(
  stripeApi: StripeRefundsApi,
  job: PaymentRefundRecoveryJob,
): Promise<{
  refund: StripeRefundRecord;
  authoritativeReconciliation: boolean;
}> {
  if (job.stripe_refund_id) {
    const refund = await stripeApi.refunds.retrieve(job.stripe_refund_id);
    assertRefundMatchesObligation(refund, job);
    return { refund, authoritativeReconciliation: true };
  }

  try {
    return {
      refund: await stripeApi.refunds.create(
        {
          payment_intent: job.payment_intent_id,
          metadata: buildPaymentRefundRequestMetadata(job),
        },
        { idempotencyKey: job.stripe_idempotency_key },
      ),
      // Stripe's idempotency cache can replay the original create response.
      // Only refunds.retrieve/list is a fresh authoritative lifecycle read.
      authoritativeReconciliation: false,
    };
  } catch (error) {
    if (stripeErrorCode(error) !== "charge_already_refunded") throw error;

    // The Stripe error by itself is not proof that THIS full obligation was
    // returned. Match the webhook: enumerate succeeded refunds, prove the sum,
    // and retain a real Stripe refund id before recording succeeded.
    const existing = await stripeApi.refunds.list({
      payment_intent: job.payment_intent_id,
      limit: STRIPE_REFUND_LIST_LIMIT,
    });
    const succeeded = existing.data.filter((candidate) =>
      candidate.status === "succeeded" &&
      Number.isSafeInteger(candidate.amount) &&
      (candidate.amount ?? 0) > 0 &&
      typeof candidate.currency === "string" &&
      candidate.currency.toLowerCase() === job.currency.toLowerCase()
    );
    const refundedCents = succeeded.reduce(
      (sum, candidate) => sum + (candidate.amount ?? 0),
      0,
    );
    const proved = succeeded.at(-1);
    if (
      refundedCents < job.amount_cents ||
      !proved ||
      typeof proved.id !== "string" ||
      !proved.id
    ) {
      throw error;
    }
    return {
      refund: {
        ...proved,
        status: "succeeded",
        // This synthetic observation represents the proved aggregate. The
        // retained refund id is a real succeeded component, while amount and
        // currency express the full list proof checked above.
        amount: job.amount_cents,
        currency: job.currency,
        payment_intent: job.payment_intent_id,
      },
      authoritativeReconciliation: true,
    };
  }
}

/**
 * Apply the database's effective status to metrics and best-effort read models.
 *
 * money_events is never authoritative: mirror failure is logged but cannot keep
 * a completed Stripe obligation leased or cause another refund attempt.
 */
async function applyEffectiveRefundStatus(
  adminClient: AdminClient,
  job: PaymentRefundRecoveryJob,
  refund: StripeRefundRecord,
  effectiveStatus: PaymentRefundStatus,
  options: {
    now: () => string;
    log: NonNullable<PaymentRefundRecoveryOptions["log"]>;
  },
  summary: PaymentRefundRecoverySummary,
): Promise<void> {
  if (effectiveStatus === "succeeded") {
    summary.succeeded += 1;
    if (
      await mirrorSucceededRefund(
        adminClient,
        job,
        options.now,
        options.log,
      )
    ) {
      summary.moneyEventsMirrored += 1;
    }
    return;
  }

  if (effectiveStatus === "failed" || effectiveStatus === "canceled") {
    summary.manualAction += 1;
    await reverseRefundMirror(adminClient, job, options.log);
    options.log(
      "refund reached a terminal state requiring manual reimbursement",
      {
        paymentIntentId: job.payment_intent_id,
        refundId: refund.id,
        status: effectiveStatus,
        failureReason: refund.failure_reason ?? null,
      },
    );
    return;
  }

  summary.nonterminal += 1;
}

/** Calculate the bounded exponential delay for a failed recovery attempt. */
function recoveryRetrySeconds(
  job: PaymentRefundRecoveryJob,
  retryBaseSeconds: number,
): number {
  const attempt = boundedInt(job.recovery_attempts, 1, 1, 20);
  return Math.min(
    RECOVERY_RETRY_POLICY.maximumSeconds,
    retryBaseSeconds *
      (2 ** Math.min(
        attempt - 1,
        RECOVERY_RETRY_POLICY.maximumExponent,
      )),
  );
}

/**
 * Reconcile one claimed obligation, then release or reschedule its exact lease.
 *
 * The stage order is deliberate: observe Stripe, checkpoint lifecycle status,
 * update only best-effort mirrors, and finally release the lease.
 */
async function processClaimedRefundObligation(
  adminClient: AdminClient,
  stripeApi: StripeRefundsApi | null,
  job: PaymentRefundRecoveryJob,
  options: {
    retryBaseSeconds: number;
    now: () => string;
    log: NonNullable<PaymentRefundRecoveryOptions["log"]>;
  },
  summary: PaymentRefundRecoverySummary,
): Promise<void> {
  try {
    if (!stripeApi) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    if (!job.stripe_idempotency_key?.trim()) {
      throw new Error("refund recovery claim is missing its idempotency key");
    }

    const observation = await createOrRetrieveRefund(stripeApi, job);
    const refund = observation.refund;
    if (typeof refund.id !== "string" || !refund.id) {
      throw new Error("Stripe refund response is missing its id");
    }
    assertRefundMatchesObligation(refund, job);

    const observedStatus = refundStatus(refund.status);
    const effectiveStatus = await recordObservedStatus(
      adminClient,
      job,
      observedStatus,
      refund.id,
      refund.failure_reason ?? null,
      observation.authoritativeReconciliation
        ? job.stripe_event_created_at
        : null,
      options.now,
    );
    summary.reconciled += 1;

    await applyEffectiveRefundStatus(
      adminClient,
      job,
      refund,
      effectiveStatus,
      options,
      summary,
    );

    if (
      !(await releaseLease(
        adminClient,
        job,
        null,
        options.retryBaseSeconds,
      ))
    ) {
      summary.leaseLost += 1;
      options.log("refund recovery completion rejected a stale lease", {
        paymentIntentId: job.payment_intent_id,
      });
    }
  } catch (error) {
    summary.failed += 1;
    const message = errorMessage(error);
    options.log("refund recovery attempt failed", {
      paymentIntentId: job.payment_intent_id,
      error: message,
    });
    const retrySeconds = recoveryRetrySeconds(job, options.retryBaseSeconds);
    try {
      if (
        await releaseLease(
          adminClient,
          job,
          message.slice(0, RECOVERY_RETRY_POLICY.maximumErrorCharacters),
          retrySeconds,
        )
      ) {
        summary.retryScheduled += 1;
      } else {
        summary.leaseLost += 1;
      }
    } catch (releaseError) {
      summary.leaseLost += 1;
      options.log("refund recovery retry checkpoint failed", {
        paymentIntentId: job.payment_intent_id,
        error: errorMessage(releaseError),
      });
    }
  }
}

// ── Queue orchestrator ───────────────────────────────────────────────────────

/**
 * Claim and process durable obligations in bounded pages.
 *
 * Rows left behind by a cap, worker crash, or lost release remain durable and
 * become claimable on the next run—immediately when unclaimed, or after their
 * expiring lease.
 */
export async function processPaymentRefundRecoveryQueue(
  adminClient: AdminClient,
  options: PaymentRefundRecoveryOptions = {},
): Promise<PaymentRefundRecoverySummary> {
  const claimBatchSize = boundedInt(
    options.claimBatchSize,
    RECOVERY_QUEUE_POLICY.claimBatchSize.fallback,
    RECOVERY_QUEUE_POLICY.claimBatchSize.minimum,
    RECOVERY_QUEUE_POLICY.claimBatchSize.maximum,
  );
  const maxJobs = boundedInt(
    options.maxJobs,
    RECOVERY_QUEUE_POLICY.maxJobs.fallback,
    RECOVERY_QUEUE_POLICY.maxJobs.minimum,
    RECOVERY_QUEUE_POLICY.maxJobs.maximum,
  );
  const leaseSeconds = boundedInt(
    options.leaseSeconds,
    RECOVERY_QUEUE_POLICY.leaseSeconds.fallback,
    RECOVERY_QUEUE_POLICY.leaseSeconds.minimum,
    RECOVERY_QUEUE_POLICY.leaseSeconds.maximum,
  );
  const retryBaseSeconds = boundedInt(
    options.retryBaseSeconds,
    RECOVERY_QUEUE_POLICY.retryBaseSeconds.fallback,
    RECOVERY_QUEUE_POLICY.retryBaseSeconds.minimum,
    RECOVERY_QUEUE_POLICY.retryBaseSeconds.maximum,
  );
  const stripeApi = options.stripeClient === undefined
    ? defaultPaymentRefundStripeClient()
    : options.stripeClient;
  const now = options.now ?? (() => new Date().toISOString());
  const log = options.log ??
    ((message, details) =>
      console.warn(`[payment-refund-recovery] ${message}`, details ?? {}));
  const summary: PaymentRefundRecoverySummary = {
    claimed: 0,
    reconciled: 0,
    succeeded: 0,
    nonterminal: 0,
    manualAction: 0,
    failed: 0,
    retryScheduled: 0,
    leaseLost: 0,
    moneyEventsMirrored: 0,
    pages: 0,
    capped: false,
  };

  while (summary.claimed < maxJobs) {
    const pageLimit = Math.min(claimBatchSize, maxJobs - summary.claimed);
    const { data, error } = await adminClient.rpc(
      "claim_payment_refund_obligations",
      {
        p_limit: pageLimit,
        p_lease_seconds: leaseSeconds,
      },
    );
    if (error) {
      throw new Error(`refund recovery claim failed: ${error.message}`);
    }

    const jobs = Array.isArray(data)
      ? data as PaymentRefundRecoveryJob[]
      : [];
    summary.pages += 1;
    if (jobs.length === 0) return summary;
    summary.claimed += jobs.length;

    for (const candidate of jobs) {
      if (
        !candidate ||
        typeof candidate.payment_intent_id !== "string" ||
        typeof candidate.lease_token !== "string" ||
        typeof candidate.stripe_idempotency_key !== "string" ||
        !Number.isSafeInteger(candidate.amount_cents) ||
        candidate.amount_cents <= 0
      ) {
        summary.failed += 1;
        log("refund recovery claim returned a malformed row", {
          job: candidate as unknown as Record<string, unknown>,
        });
        if (
          candidate &&
          typeof candidate.payment_intent_id === "string" &&
          typeof candidate.lease_token === "string"
        ) {
          try {
            if (
              await releaseLease(
                adminClient,
                candidate as PaymentRefundRecoveryJob,
                "queue_contract: malformed claimed refund obligation",
                retryBaseSeconds,
              )
            ) {
              summary.retryScheduled += 1;
            } else {
              summary.leaseLost += 1;
            }
          } catch {
            summary.leaseLost += 1;
          }
        } else {
          summary.leaseLost += 1;
        }
        continue;
      }

      await processClaimedRefundObligation(
        adminClient,
        stripeApi,
        candidate,
        { retryBaseSeconds, now, log },
        summary,
      );
    }

    if (jobs.length < pageLimit) return summary;
  }

  summary.capped = true;
  return summary;
}
