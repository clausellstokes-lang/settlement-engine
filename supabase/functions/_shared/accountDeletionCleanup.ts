// deno-lint-ignore-file no-import-prefix
/**
 * Durable external account-deletion cleanup shared by:
 *   - account-actions / process_deletions (manual privileged trigger)
 *   - account-deletion-worker (secret-gated pg_net cron)
 *
 * Migration 175 owns the queue, leases, checkpoints, and finalization RPCs.
 * This module owns the single implementation of the external effects:
 * irreversible GoTrue soft deletion (user-id anonymization with a hashed
 * identity shell) and a fully paginated Stripe customer sweep.
 *
 * Database linkage is never cleared directly here. The completion RPC clears it
 * transactionally with job/request completion only after both external stages
 * have succeeded.
 */
import Stripe from "https://esm.sh/stripe@14.14.0?target=deno";

export type StripeSubscriptionsApi = {
  customers: {
    del: (id: string) => Promise<unknown>;
  };
  subscriptions: {
    cancel: (id: string) => Promise<{
      id?: string;
      customer?: string | { id?: string } | null;
    }>;
    retrieve: (id: string) => Promise<{
      id?: string;
      customer?: string | { id?: string } | null;
    }>;
    list: (params: {
      customer: string;
      limit?: number;
      starting_after?: string;
    }) => Promise<{ data: Array<{ id: string }>; has_more?: boolean }>;
  };
};

export type DeletionCleanupJob = {
  job_id: string;
  deletion_request_id: string;
  user_id: string;
  lease_token: string;
  attempts: number;
  auth_revoked_at: string | null;
  stripe_subscription_id: string | null;
  stripe_customer_id: string | null;
  surveyor_subscription_id: string | null;
  surveyor_customer_id: string | null;
  late_stripe_subscription_ids: string[];
  late_stripe_customer_ids: string[];
  late_billing_revision: number;
};

export type DeletionCleanupSummary = {
  claimed: number;
  completed: number;
  failed: number;
  leaseLost: number;
  sessionsRevoked: number;
  subscriptionsCanceled: number;
  customersDeleted: number;
  pages: number;
  capped: boolean;
};

export type DeletionCleanupOptions = {
  claimBatchSize?: number;
  maxJobs?: number;
  staleAfterMinutes?: number;
  stripeClient?: StripeSubscriptionsApi | null;
  log?: (message: string, details?: Record<string, unknown>) => void;
};

type AdminOperationError = {
  message: string;
  code?: string;
  status?: number;
} | null;

/**
 * The exact Supabase surface this cleanup core consumes.
 *
 * Keeping this structural preserves the partial execution-test clients without
 * pretending the module needs the full fluent PostgREST client.
 */
export type AccountDeletionAdminClient = {
  rpc: (
    fn: string,
    args: Record<string, unknown>,
  ) => PromiseLike<{ data: unknown; error: AdminOperationError }>;
  auth: {
    admin: {
      updateUserById: (
        userId: string,
        attributes: Record<string, unknown>,
      ) => PromiseLike<{ error: AdminOperationError }>;
      deleteUser: (
        userId: string,
        shouldSoftDelete?: boolean,
      ) => PromiseLike<{ error: AdminOperationError }>;
    };
  };
};

type AdminClient = AccountDeletionAdminClient;

const AUTH_SOFT_DELETE_BAN_DURATION = "876000h";
const STRIPE_SUBSCRIPTION_SWEEP_POLICY = {
  pageSize: 100,
  maximumPages: 10_000,
} as const;
const CLEANUP_RETRY_POLICY = {
  baseSeconds: 30,
  maximumSeconds: 3600,
  maximumExponent: 7,
  maximumErrorCharacters: 1000,
} as const;
const CLEANUP_QUEUE_POLICY = {
  claimBatchSize: { fallback: 50, minimum: 1, maximum: 200 },
  maxJobs: { fallback: 100, minimum: 1, maximum: 2000 },
  staleAfterMinutes: { fallback: 30, minimum: 5, maximum: 1440 },
} as const;

let stripeSingleton: Stripe | null = null;

// ── Stripe adapter and identity helpers ─────────────────────────────────────

/**
 * Lazily create Stripe so an unconfigured deploy can still finish jobs with no
 * billing linkage. A linked job fails durably and remains retryable.
 */
export function defaultDeletionStripeClient(): StripeSubscriptionsApi | null {
  const key = Deno.env.get("STRIPE_SECRET_KEY");
  if (!key) return null;
  stripeSingleton ??= new Stripe(key, { apiVersion: "2023-10-16" });
  return stripeSingleton;
}

function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

function stripeCustomerId(
  customer: string | { id?: string } | null | undefined,
): string | null {
  return typeof customer === "string"
    ? customer
    : customer?.id ?? null;
}

function isAlreadyAbsent(error: unknown): boolean {
  const candidate = error as {
    code?: string;
    status?: number;
    statusCode?: number;
    message?: string;
  } | null;
  const code = String(candidate?.code || "").toLowerCase();
  const message = String(candidate?.message || errorMessage(error))
    .toLowerCase();
  return candidate?.status === 404 ||
    candidate?.statusCode === 404 ||
    code === "user_not_found" ||
    code === "resource_missing" ||
    /user.{0,16}(not found|does not exist)|no such subscription|already.{0,10}cancell?ed|has been cancell?ed/
      .test(message);
}

/**
 * Enumerate every Stripe subscription for a customer.
 *
 * `has_more` must advance its cursor. A stuck or implausibly long listing fails
 * the job without clearing durable billing linkage.
 */
export async function listAllDeletionSubscriptionIds(
  stripeApi: Pick<StripeSubscriptionsApi, "subscriptions">,
  customerId: string,
): Promise<string[]> {
  const ids = new Set<string>();
  const seenCursors = new Set<string>();
  let startingAfter: string | undefined;
  let pages = 0;

  while (true) {
    pages += 1;
    if (pages > STRIPE_SUBSCRIPTION_SWEEP_POLICY.maximumPages) {
      throw new Error(
        "Stripe subscription pagination exceeded the safety limit",
      );
    }
    const page = await stripeApi.subscriptions.list({
      customer: customerId,
      limit: STRIPE_SUBSCRIPTION_SWEEP_POLICY.pageSize,
      ...(startingAfter ? { starting_after: startingAfter } : {}),
    });
    const rows = Array.isArray(page?.data) ? page.data : [];
    for (const row of rows) {
      if (typeof row?.id === "string" && row.id) ids.add(row.id);
    }
    if (page?.has_more !== true) return [...ids];

    const nextCursor = rows.at(-1)?.id;
    if (!nextCursor || seenCursors.has(nextCursor)) {
      throw new Error("Stripe subscription pagination did not advance");
    }
    seenCursors.add(nextCursor);
    startingAfter = nextCursor;
  }
}

function boundedPositiveInt(
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

async function failLease(
  adminClient: AdminClient,
  job: DeletionCleanupJob,
  failures: string[],
): Promise<boolean> {
  const retrySeconds = Math.min(
    CLEANUP_RETRY_POLICY.maximumSeconds,
    CLEANUP_RETRY_POLICY.baseSeconds *
      (2 ** Math.min(
        boundedPositiveInt(job.attempts, 1, 1, 20),
        CLEANUP_RETRY_POLICY.maximumExponent,
      )),
  );
  const { data, error } = await adminClient.rpc(
    "fail_account_deletion_cleanup_job",
    {
      p_job_id: job.job_id,
      p_lease_token: job.lease_token,
      p_error: failures.join("; ").slice(
        0,
        CLEANUP_RETRY_POLICY.maximumErrorCharacters,
      ),
      p_retry_seconds: retrySeconds,
    },
  );
  if (error) {
    throw new Error(`cleanup retry checkpoint failed: ${error.message}`);
  }
  return data === true;
}

type BillingCleanupState = {
  subscriptionIds: Set<string>;
  customerIds: Set<string>;
  knownSubscriptionCustomers: Map<string, string>;
  unresolvedSubscriptionCustomers: Set<string>;
  listFailures: Map<string, string>;
  checkpointedIdentities: Set<string>;
};

// ── Durable cleanup stages ───────────────────────────────────────────────────

/**
 * Build the billing work set from every identity generation stored on the job.
 *
 * Only the two live linkage pairs prove a subscription-to-customer association.
 * Late arrays are independent sets, so an absent late subscription cannot prove
 * which customer must be deleted.
 */
function initializeBillingCleanupState(
  job: DeletionCleanupJob,
): BillingCleanupState {
  const subscriptionIds = new Set<string>();
  const knownSubscriptionCustomers = new Map<string, string>();

  if (job.stripe_subscription_id) {
    subscriptionIds.add(job.stripe_subscription_id);
    if (job.stripe_customer_id) {
      knownSubscriptionCustomers.set(
        job.stripe_subscription_id,
        job.stripe_customer_id,
      );
    }
  }
  if (job.surveyor_subscription_id) {
    subscriptionIds.add(job.surveyor_subscription_id);
    if (job.surveyor_customer_id) {
      knownSubscriptionCustomers.set(
        job.surveyor_subscription_id,
        job.surveyor_customer_id,
      );
    }
  }
  for (const subscriptionId of job.late_stripe_subscription_ids ?? []) {
    if (typeof subscriptionId === "string" && subscriptionId) {
      subscriptionIds.add(subscriptionId);
    }
  }

  const customerIds = new Set(
    [
      job.stripe_customer_id,
      job.surveyor_customer_id,
      ...(job.late_stripe_customer_ids ?? []),
    ].filter(
      (customerId): customerId is string =>
        typeof customerId === "string" && customerId.length > 0,
    ),
  );

  return {
    subscriptionIds,
    customerIds,
    knownSubscriptionCustomers,
    unresolvedSubscriptionCustomers: new Set<string>(),
    listFailures: new Map<string, string>(),
    checkpointedIdentities: new Set<string>(),
  };
}

/**
 * Ban future authentication, request irreversible GoTrue soft deletion, and
 * checkpoint that progress before any later stage can be considered complete.
 */
async function ensureAuthIdentityRevoked(
  adminClient: AdminClient,
  job: DeletionCleanupJob,
  failures: string[],
  summary: DeletionCleanupSummary,
): Promise<boolean> {
  if (job.auth_revoked_at) return true;

  try {
    // Ban first so future auth use is blocked even while GoTrue anonymizes the
    // user and removes login identities, credentials, and sessions.
    const { error: banError } = await adminClient.auth.admin.updateUserById(
      job.user_id,
      { ban_duration: AUTH_SOFT_DELETE_BAN_DURATION },
    );
    if (banError && !isAlreadyAbsent(banError)) throw banError;

    const { error: deleteError } = await adminClient.auth.admin.deleteUser(
      job.user_id,
      true,
    );
    if (deleteError && !isAlreadyAbsent(deleteError)) throw deleteError;

    const { data, error: checkpointError } = await adminClient.rpc(
      "mark_account_deletion_auth_revoked",
      {
        p_job_id: job.job_id,
        p_lease_token: job.lease_token,
      },
    );
    if (checkpointError) {
      throw new Error(`auth checkpoint failed: ${checkpointError.message}`);
    }
    if (data !== true) {
      throw new Error("auth checkpoint rejected stale lease");
    }

    summary.sessionsRevoked += 1;
    return true;
  } catch (error) {
    failures.push(`auth_revoke: ${errorMessage(error)}`);
    return false;
  }
}

/**
 * Persist newly discovered Stripe identity before relying on it for completion.
 *
 * The in-memory dedup set is updated only after a successful durable checkpoint;
 * a transport or stale-lease failure must remain observable and retryable.
 */
async function checkpointBillingIdentity(
  adminClient: AdminClient,
  job: DeletionCleanupJob,
  state: BillingCleanupState,
  failures: string[],
  subscriptionId: string | null,
  customerId: string | null,
): Promise<void> {
  if (!subscriptionId && !customerId) return;

  const identityKey = `${subscriptionId ?? ""}\u0000${customerId ?? ""}`;
  if (state.checkpointedIdentities.has(identityKey)) return;
  const identityLabel = subscriptionId ?? customerId;

  try {
    const { data, error } = await adminClient.rpc(
      "checkpoint_account_deletion_billing_identity",
      {
        p_job_id: job.job_id,
        p_lease_token: job.lease_token,
        p_subscription_id: subscriptionId,
        p_customer_id: customerId,
      },
    );
    if (error) {
      failures.push(
        `billing_identity_checkpoint:${identityLabel}: ${error.message}`,
      );
      return;
    }
    if ((data as { ok?: boolean } | null)?.ok !== true) {
      failures.push(
        `billing_identity_checkpoint:${identityLabel}: stale lease`,
      );
      return;
    }

    const checkpoint = data as {
      late_stripe_subscription_ids?: string[];
      late_stripe_customer_ids?: string[];
      late_billing_revision?: number;
    };
    job.late_stripe_subscription_ids = Array.isArray(
        checkpoint.late_stripe_subscription_ids,
      )
      ? checkpoint.late_stripe_subscription_ids
      : job.late_stripe_subscription_ids;
    job.late_stripe_customer_ids = Array.isArray(
        checkpoint.late_stripe_customer_ids,
      )
      ? checkpoint.late_stripe_customer_ids
      : job.late_stripe_customer_ids;
    if (Number.isSafeInteger(checkpoint.late_billing_revision)) {
      job.late_billing_revision = checkpoint.late_billing_revision as number;
    }
    state.checkpointedIdentities.add(identityKey);
  } catch (error) {
    failures.push(
      `billing_identity_checkpoint:${identityLabel}: ${errorMessage(error)}`,
    );
  }
}

/**
 * Resolve customer identities from claimed subscriptions before sweeping
 * customers. Canceled subscriptions remain retrievable in Stripe.
 */
async function discoverSubscriptionCustomers(
  adminClient: AdminClient,
  stripeApi: StripeSubscriptionsApi | null,
  job: DeletionCleanupJob,
  state: BillingCleanupState,
  failures: string[],
): Promise<void> {
  if (state.subscriptionIds.size === 0 || !stripeApi) return;

  for (const subscriptionId of [...state.subscriptionIds]) {
    try {
      const subscription = await stripeApi.subscriptions.retrieve(
        subscriptionId,
      );
      const customerId = stripeCustomerId(subscription.customer);
      if (customerId) {
        state.customerIds.add(customerId);
        await checkpointBillingIdentity(
          adminClient,
          job,
          state,
          failures,
          subscriptionId,
          customerId,
        );
      } else {
        state.unresolvedSubscriptionCustomers.add(subscriptionId);
      }
    } catch (error) {
      if (isAlreadyAbsent(error)) {
        if (!state.knownSubscriptionCustomers.has(subscriptionId)) {
          state.unresolvedSubscriptionCustomers.add(subscriptionId);
        }
      } else {
        failures.push(
          `stripe_retrieve:${subscriptionId}: ${errorMessage(error)}`,
        );
      }
    }
  }
}

/**
 * Enumerate every known customer before cancellation. Any subscription found
 * here is checkpointed under the current lease before it is acted upon.
 */
async function enumerateCustomerSubscriptions(
  adminClient: AdminClient,
  stripeApi: StripeSubscriptionsApi | null,
  job: DeletionCleanupJob,
  state: BillingCleanupState,
  failures: string[],
): Promise<void> {
  for (const customerId of state.customerIds) {
    if (!stripeApi) {
      failures.push("stripe_unconfigured: STRIPE_SECRET_KEY is not set");
      continue;
    }

    try {
      const listedIds = await listAllDeletionSubscriptionIds(
        stripeApi,
        customerId,
      );
      for (const subscriptionId of listedIds) {
        state.subscriptionIds.add(subscriptionId);
        await checkpointBillingIdentity(
          adminClient,
          job,
          state,
          failures,
          subscriptionId,
          customerId,
        );
      }
    } catch (error) {
      if (!isAlreadyAbsent(error)) {
        state.listFailures.set(customerId, errorMessage(error));
      }
    }
  }
}

/**
 * Cancel every claimed or discovered subscription. Cancellation can be the
 * final chance to recover a late subscription's customer identity.
 */
async function cancelSubscriptions(
  adminClient: AdminClient,
  stripeApi: StripeSubscriptionsApi | null,
  job: DeletionCleanupJob,
  state: BillingCleanupState,
  failures: string[],
  summary: DeletionCleanupSummary,
): Promise<void> {
  if (state.subscriptionIds.size === 0) return;

  if (!stripeApi) {
    if (
      !failures.some((entry) => entry.startsWith("stripe_unconfigured:"))
    ) {
      failures.push("stripe_unconfigured: STRIPE_SECRET_KEY is not set");
    }
    return;
  }

  for (const subscriptionId of state.subscriptionIds) {
    try {
      const canceled = await stripeApi.subscriptions.cancel(subscriptionId);
      const discoveredCustomerId = stripeCustomerId(canceled?.customer);
      if (discoveredCustomerId) {
        state.customerIds.add(discoveredCustomerId);
        await checkpointBillingIdentity(
          adminClient,
          job,
          state,
          failures,
          subscriptionId,
          discoveredCustomerId,
        );
        state.unresolvedSubscriptionCustomers.delete(subscriptionId);
      }
      summary.subscriptionsCanceled += 1;
    } catch (error) {
      if (!isAlreadyAbsent(error)) {
        failures.push(
          `stripe_cancel:${subscriptionId}: ${errorMessage(error)}`,
        );
      }
    }
  }
}

/**
 * Delete customers after the explicit list/cancel sweep.
 *
 * Stripe customer deletion closes the enumeration race: it cancels any active
 * subscription created after listing, removes saved payment methods, and blocks
 * future subscription creation while preserving retrievable history.
 */
async function deleteStripeCustomers(
  stripeApi: StripeSubscriptionsApi | null,
  state: BillingCleanupState,
  failures: string[],
  summary: DeletionCleanupSummary,
): Promise<void> {
  if (state.customerIds.size > 0 && stripeApi) {
    for (const customerId of state.customerIds) {
      try {
        await stripeApi.customers.del(customerId);
        summary.customersDeleted += 1;
        // Deletion is stronger than a successful list and closes every active
        // subscription, including one created while the sweep was running.
        state.listFailures.delete(customerId);
      } catch (error) {
        if (isAlreadyAbsent(error)) {
          state.listFailures.delete(customerId);
        } else {
          failures.push(
            `stripe_customer_delete:${customerId}: ${errorMessage(error)}`,
          );
        }
      }
    }
  }

  for (const [customerId, message] of state.listFailures) {
    failures.push(`stripe_list:${customerId}: ${message}`);
  }
}

/** Finalize only when the lease still owns the exact billing generation. */
async function completeCleanupJob(
  adminClient: AdminClient,
  job: DeletionCleanupJob,
  failures: string[],
): Promise<void> {
  const { data, error } = await adminClient.rpc(
    "complete_account_deletion_cleanup_job",
    {
      p_job_id: job.job_id,
      p_lease_token: job.lease_token,
      p_expected_subscription_id: job.stripe_subscription_id,
      p_expected_customer_id: job.stripe_customer_id,
      p_expected_surveyor_subscription_id: job.surveyor_subscription_id,
      p_expected_surveyor_customer_id: job.surveyor_customer_id,
      p_expected_late_subscription_ids: job.late_stripe_subscription_ids ?? [],
      p_expected_late_customer_ids: job.late_stripe_customer_ids ?? [],
      p_expected_late_billing_revision: job.late_billing_revision,
    },
  );
  if (error) {
    failures.push(`completion: ${error.message}`);
  } else if (data !== true) {
    failures.push("completion: stale lease or billing linkage changed");
  }
}

/** Persist a failed attempt without allowing retry bookkeeping to hide lease loss. */
async function checkpointCleanupFailure(
  adminClient: AdminClient,
  job: DeletionCleanupJob,
  failures: string[],
  summary: DeletionCleanupSummary,
  log: NonNullable<DeletionCleanupOptions["log"]>,
): Promise<void> {
  summary.failed += 1;
  log("account deletion cleanup incomplete", {
    jobId: job.job_id,
    userId: job.user_id,
    failures,
  });

  try {
    if (!(await failLease(adminClient, job, failures))) {
      summary.leaseLost += 1;
    }
  } catch (error) {
    summary.leaseLost += 1;
    log("account deletion cleanup retry checkpoint failed", {
      jobId: job.job_id,
      error: errorMessage(error),
    });
  }
}

/**
 * Process one leased job in irreversible-effect order.
 *
 * Auth and billing are independent obligations, so billing continues after an
 * auth failure. Finalization remains conjunctive: both must be proved complete
 * under the same live lease and exact billing generation.
 */
async function processOneJob(
  adminClient: AdminClient,
  stripeApi: StripeSubscriptionsApi | null,
  job: DeletionCleanupJob,
  summary: DeletionCleanupSummary,
  log: NonNullable<DeletionCleanupOptions["log"]>,
): Promise<void> {
  const failures: string[] = [];
  const authReady = await ensureAuthIdentityRevoked(
    adminClient,
    job,
    failures,
    summary,
  );

  // Billing proceeds even when auth failed because stopping future charges is
  // independently urgent. Linkage remains until both obligations succeed.
  const billingState = initializeBillingCleanupState(job);
  await discoverSubscriptionCustomers(
    adminClient,
    stripeApi,
    job,
    billingState,
    failures,
  );
  await enumerateCustomerSubscriptions(
    adminClient,
    stripeApi,
    job,
    billingState,
    failures,
  );
  await cancelSubscriptions(
    adminClient,
    stripeApi,
    job,
    billingState,
    failures,
    summary,
  );

  for (const subscriptionId of billingState.unresolvedSubscriptionCustomers) {
    failures.push(
      `stripe_customer_identity:${subscriptionId}: subscription has no retrievable customer`,
    );
  }

  await deleteStripeCustomers(stripeApi, billingState, failures, summary);

  if (failures.length === 0 && authReady) {
    await completeCleanupJob(adminClient, job, failures);
  }

  if (failures.length === 0) {
    summary.completed += 1;
    return;
  }

  await checkpointCleanupFailure(adminClient, job, failures, summary, log);
}

// ── Queue orchestrator ───────────────────────────────────────────────────────

/**
 * Claim and process durable jobs in bounded pages.
 *
 * There is no profile-table `.limit(500)` sweep: every request has a durable
 * row, pages advance until empty or the per-invocation safety cap, and anything
 * left behind remains claimable on the next run.
 */
export async function processAccountDeletionCleanupQueue(
  adminClient: AdminClient,
  options: DeletionCleanupOptions = {},
): Promise<DeletionCleanupSummary> {
  const claimBatchSize = boundedPositiveInt(
    options.claimBatchSize,
    CLEANUP_QUEUE_POLICY.claimBatchSize.fallback,
    CLEANUP_QUEUE_POLICY.claimBatchSize.minimum,
    CLEANUP_QUEUE_POLICY.claimBatchSize.maximum,
  );
  const maxJobs = boundedPositiveInt(
    options.maxJobs,
    CLEANUP_QUEUE_POLICY.maxJobs.fallback,
    CLEANUP_QUEUE_POLICY.maxJobs.minimum,
    CLEANUP_QUEUE_POLICY.maxJobs.maximum,
  );
  const staleAfterMinutes = boundedPositiveInt(
    options.staleAfterMinutes,
    CLEANUP_QUEUE_POLICY.staleAfterMinutes.fallback,
    CLEANUP_QUEUE_POLICY.staleAfterMinutes.minimum,
    CLEANUP_QUEUE_POLICY.staleAfterMinutes.maximum,
  );
  const stripeApi = options.stripeClient === undefined
    ? defaultDeletionStripeClient()
    : options.stripeClient;
  const log = options.log ??
    ((message, details) =>
      console.warn(`[account-deletion] ${message}`, details ?? {}));
  const summary: DeletionCleanupSummary = {
    claimed: 0,
    completed: 0,
    failed: 0,
    leaseLost: 0,
    sessionsRevoked: 0,
    subscriptionsCanceled: 0,
    customersDeleted: 0,
    pages: 0,
    capped: false,
  };

  while (summary.claimed < maxJobs) {
    const pageLimit = Math.min(claimBatchSize, maxJobs - summary.claimed);
    const { data, error } = await adminClient.rpc(
      "claim_account_deletion_cleanup_jobs",
      {
        p_limit: pageLimit,
        p_stale_after_minutes: staleAfterMinutes,
      },
    );
    if (error) {
      throw new Error(`account deletion queue claim failed: ${error.message}`);
    }

    const jobs = Array.isArray(data) ? data as DeletionCleanupJob[] : [];
    summary.pages += 1;
    if (jobs.length === 0) return summary;
    summary.claimed += jobs.length;

    for (const job of jobs) {
      if (
        !job ||
        typeof job.job_id !== "string" ||
        typeof job.user_id !== "string" ||
        typeof job.lease_token !== "string"
      ) {
        summary.failed += 1;
        log("account deletion queue returned a malformed job", {
          job: job as unknown as Record<string, unknown>,
        });
        // The database contract makes missing identifiers impossible, but do not
        // leave a lease stranded if a partial/corrupt row still carries enough
        // identity to release it. Otherwise the stale-lease reclaim is the final
        // safety net and we surface leaseLost for operator visibility.
        if (
          job &&
          typeof job.job_id === "string" &&
          typeof job.lease_token === "string"
        ) {
          try {
            if (
              !(await failLease(
                adminClient,
                job as DeletionCleanupJob,
                ["queue_contract: malformed claimed job"],
              ))
            ) {
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
      await processOneJob(adminClient, stripeApi, job, summary, log);
    }

    if (jobs.length < pageLimit) return summary;
  }

  summary.capped = true;
  return summary;
}
