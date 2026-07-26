// deno-lint-ignore-file no-import-prefix
/**
 * Behavioral contract for the shared durable account-deletion state machine.
 *
 * Production surface: manual account actions and the scheduled worker both call
 * this module. Failure class: a crash or partial external response must retain
 * exact billing linkage and a retryable lease. Negative controls prove that
 * absent identities are idempotent, stale checkpoints never finalize, auth
 * failure does not suppress billing cleanup, and pagination cannot silently stop.
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  type DeletionCleanupJob,
  listAllDeletionSubscriptionIds,
  processAccountDeletionCleanupQueue,
} from "./accountDeletionCleanup.ts";

const makeJob = (
  overrides: Partial<DeletionCleanupJob> = {},
): DeletionCleanupJob => ({
  job_id: "job-1",
  deletion_request_id: "request-1",
  user_id: "user-1",
  lease_token: "lease-1",
  attempts: 1,
  auth_revoked_at: null,
  stripe_subscription_id: "sub-recorded",
  stripe_customer_id: "cus-1",
  surveyor_subscription_id: null,
  surveyor_customer_id: null,
  late_stripe_subscription_ids: [],
  late_stripe_customer_ids: [],
  late_billing_revision: 0,
  ...overrides,
});

function makeAdmin(
  pages: Array<DeletionCleanupJob[]>,
  options: {
    banError?: unknown;
    deleteError?: unknown;
    markResult?: boolean;
    completeResult?: boolean;
    checkpointThrow?: unknown;
  } = {},
) {
  const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
  const billingCheckpoints = new Map<
    string,
    {
      subscriptionIds: string[];
      customerIds: string[];
      revision: number;
    }
  >();
  for (const page of pages) {
    for (const queuedJob of page) {
      billingCheckpoints.set(queuedJob.job_id, {
        subscriptionIds: [...queuedJob.late_stripe_subscription_ids],
        customerIds: [...queuedJob.late_stripe_customer_ids],
        revision: queuedJob.late_billing_revision,
      });
    }
  }
  let bans = 0;
  const softDeletes: Array<{ userId: string; shouldSoftDelete: boolean }> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    auth: {
      admin: {
        updateUserById: () => {
          bans += 1;
          return Promise.resolve({
            error: options.banError ?? null,
          });
        },
        deleteUser: (userId: string, shouldSoftDelete: boolean) => {
          softDeletes.push({ userId, shouldSoftDelete });
          return Promise.resolve({
            error: options.deleteError ?? null,
          });
        },
      },
    },
    rpc: (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      if (fn === "claim_account_deletion_cleanup_jobs") {
        return Promise.resolve({ data: pages.shift() ?? [], error: null });
      }
      if (fn === "mark_account_deletion_auth_revoked") {
        return Promise.resolve({
          data: options.markResult ?? true,
          error: null,
        });
      }
      if (fn === "checkpoint_account_deletion_billing_identity") {
        if (options.checkpointThrow !== undefined) {
          return Promise.reject(options.checkpointThrow);
        }
        const jobId = String(args.p_job_id);
        const checkpoint = billingCheckpoints.get(jobId) ?? {
          subscriptionIds: [],
          customerIds: [],
          revision: 0,
        };
        let grew = false;
        const subscriptionId = typeof args.p_subscription_id === "string"
          ? args.p_subscription_id
          : null;
        const customerId = typeof args.p_customer_id === "string"
          ? args.p_customer_id
          : null;
        if (
          subscriptionId &&
          !checkpoint.subscriptionIds.includes(subscriptionId)
        ) {
          checkpoint.subscriptionIds.push(subscriptionId);
          grew = true;
        }
        if (customerId && !checkpoint.customerIds.includes(customerId)) {
          checkpoint.customerIds.push(customerId);
          grew = true;
        }
        if (grew) checkpoint.revision += 1;
        billingCheckpoints.set(jobId, checkpoint);
        return Promise.resolve({
          data: {
            ok: true,
            late_stripe_subscription_ids: [...checkpoint.subscriptionIds],
            late_stripe_customer_ids: [...checkpoint.customerIds],
            late_billing_revision: checkpoint.revision,
          },
          error: null,
        });
      }
      if (fn === "complete_account_deletion_cleanup_job") {
        return Promise.resolve({
          data: options.completeResult ?? true,
          error: null,
        });
      }
      if (fn === "fail_account_deletion_cleanup_job") {
        return Promise.resolve({ data: true, error: null });
      }
      throw new Error(`unexpected rpc ${fn}`);
    },
  };
  return { client, calls, bans: () => bans, softDeletes };
}

Deno.test("Stripe enumeration follows every page and rejects a stuck cursor", async () => {
  const calls: Array<Record<string, unknown>> = [];
  const stripe = {
    customers: { del: () => Promise.resolve({ deleted: true }) },
    subscriptions: {
      cancel: () => Promise.resolve({}),
      retrieve: (id: string) => Promise.resolve({ id }),
      list: (params: Record<string, unknown>) => {
        calls.push(params);
        if (!params.starting_after) {
          return Promise.resolve({
            data: [{ id: "sub-1" }],
            has_more: true,
          });
        }
        return Promise.resolve({
          data: [{ id: "sub-2" }],
          has_more: false,
        });
      },
    },
  };
  assertEquals(
    await listAllDeletionSubscriptionIds(stripe, "cus-many"),
    ["sub-1", "sub-2"],
  );
  assertEquals(calls.length, 2);
  assertEquals(calls[1].starting_after, "sub-1");

  const stuck = {
    customers: { del: () => Promise.resolve({ deleted: true }) },
    subscriptions: {
      cancel: () => Promise.resolve({}),
      retrieve: (id: string) => Promise.resolve({ id }),
      list: () => Promise.resolve({ data: [], has_more: true }),
    },
  };
  let message = "";
  try {
    await listAllDeletionSubscriptionIds(stuck, "cus-stuck");
  } catch (error) {
    message = error instanceof Error ? error.message : String(error);
  }
  assertEquals(message, "Stripe subscription pagination did not advance");
});

Deno.test("queue cleanup checkpoints auth, cancels recorded + paginated subscriptions, then finalizes with inspected linkage", async () => {
  const admin = makeAdmin([[
    makeJob({
      surveyor_subscription_id: "sub-surveyor",
      surveyor_customer_id: "cus-1",
    }),
  ], []]);
  const canceled: string[] = [];
  const deletedCustomers: string[] = [];
  const listCalls: Array<Record<string, unknown>> = [];
  const retrieved: string[] = [];
  const stripe = {
    customers: {
      del: (id: string) => {
        deletedCustomers.push(id);
        return Promise.resolve({ deleted: true });
      },
    },
    subscriptions: {
      retrieve: (id: string) => {
        retrieved.push(id);
        return Promise.resolve({ id, customer: "cus-1" });
      },
      cancel: (id: string) => {
        canceled.push(id);
        return Promise.resolve({});
      },
      list: (params: Record<string, unknown>) => {
        listCalls.push(params);
        if (!params.starting_after) {
          return Promise.resolve({
            data: [{ id: "sub-page-1" }],
            has_more: true,
          });
        }
        return Promise.resolve({
          data: [{ id: "sub-page-2" }],
          has_more: false,
        });
      },
    },
  };

  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });
  assertEquals(summary.completed, 1);
  assertEquals(summary.failed, 0);
  assertEquals(summary.pages, 2);
  assertEquals(summary.sessionsRevoked, 1);
  assertEquals(admin.softDeletes, [{
    userId: "user-1",
    shouldSoftDelete: true,
  }]);
  assertEquals(summary.subscriptionsCanceled, 4);
  assertEquals(summary.customersDeleted, 1);
  assertEquals(deletedCustomers, ["cus-1"]);
  assertEquals(canceled.sort(), [
    "sub-page-1",
    "sub-page-2",
    "sub-recorded",
    "sub-surveyor",
  ]);
  assertEquals(listCalls.length, 2);
  assertEquals(retrieved.sort(), ["sub-recorded", "sub-surveyor"]);

  const final = admin.calls.find((call) =>
    call.fn === "complete_account_deletion_cleanup_job"
  );
  assertEquals(final?.args, {
    p_job_id: "job-1",
    p_lease_token: "lease-1",
    p_expected_subscription_id: "sub-recorded",
    p_expected_customer_id: "cus-1",
    p_expected_surveyor_subscription_id: "sub-surveyor",
    p_expected_surveyor_customer_id: "cus-1",
    p_expected_late_subscription_ids: [
      "sub-recorded",
      "sub-surveyor",
      "sub-page-1",
      "sub-page-2",
    ],
    p_expected_late_customer_ids: ["cus-1"],
    p_expected_late_billing_revision: 4,
  });
  assertEquals(
    admin.calls.some((call) => call.fn === "fail_account_deletion_cleanup_job"),
    false,
  );
});

Deno.test("auth failure still stops billing, but durably retries and never finalizes/clears linkage", async () => {
  const admin = makeAdmin([[makeJob()], []], {
    banError: { message: "GoTrue unavailable", status: 503 },
  });
  const canceled: string[] = [];
  const stripe = {
    customers: { del: () => Promise.resolve({ deleted: true }) },
    subscriptions: {
      retrieve: (id: string) => Promise.resolve({ id, customer: "cus-1" }),
      cancel: (id: string) => {
        canceled.push(id);
        return Promise.resolve({});
      },
      list: () => Promise.resolve({ data: [], has_more: false }),
    },
  };
  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 1,
    log: () => {},
  });
  assertEquals(summary.failed, 1);
  assertEquals(canceled, ["sub-recorded"]);
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "complete_account_deletion_cleanup_job"
    ),
    false,
  );
  assertEquals(
    admin.calls.some((call) => call.fn === "fail_account_deletion_cleanup_job"),
    true,
  );
});

Deno.test("customer deletion closes a subscription created after pagination", async () => {
  const admin = makeAdmin([[makeJob()], []]);
  const canceled: string[] = [];
  const calls: string[] = [];
  let lateSubscription = false;
  const stripe = {
    customers: {
      del: (id: string) => {
        calls.push(`delete:${id}`);
        // Model Stripe's contract: deleting the customer also cancels a
        // subscription that appeared after the list response.
        if (lateSubscription) canceled.push("sub-created-after-list");
        return Promise.resolve({ id, deleted: true });
      },
    },
    subscriptions: {
      retrieve: (id: string) => {
        calls.push(`retrieve:${id}`);
        return Promise.resolve({ id, customer: "cus-1" });
      },
      list: () => {
        calls.push("list");
        lateSubscription = true;
        return Promise.resolve({ data: [], has_more: false });
      },
      cancel: (id: string) => {
        calls.push(`cancel:${id}`);
        canceled.push(id);
        return Promise.resolve({});
      },
    },
  };
  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    maxJobs: 10,
    log: () => {},
  });
  assertEquals(summary.completed, 1);
  assertEquals(summary.customersDeleted, 1);
  assertEquals(calls, [
    "retrieve:sub-recorded",
    "list",
    "cancel:sub-recorded",
    "delete:cus-1",
  ]);
  assertEquals(canceled.sort(), ["sub-created-after-list", "sub-recorded"]);
});

Deno.test("customer deletion failure keeps the deletion request retryable", async () => {
  const admin = makeAdmin([[makeJob()], []]);
  const stripe = {
    customers: {
      del: () =>
        Promise.reject(new Error("Stripe customer delete unavailable")),
    },
    subscriptions: {
      retrieve: (id: string) => Promise.resolve({ id, customer: "cus-1" }),
      list: () => Promise.resolve({ data: [], has_more: false }),
      cancel: () => Promise.resolve({}),
    },
  };
  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    maxJobs: 10,
    log: () => {},
  });
  assertEquals(summary.completed, 0);
  assertEquals(summary.failed, 1);
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "complete_account_deletion_cleanup_job"
    ),
    false,
  );
  assertEquals(
    admin.calls.some((call) => call.fn === "fail_account_deletion_cleanup_job"),
    true,
  );
});

Deno.test("a late-subscription-only job discovers and checkpoints its customer before exact completion", async () => {
  const admin = makeAdmin([[
    makeJob({
      auth_revoked_at: "2026-07-24T00:00:00Z",
      stripe_subscription_id: null,
      stripe_customer_id: null,
      late_stripe_subscription_ids: ["sub-late-only"],
      late_billing_revision: 7,
    }),
  ], []]);
  const canceled: string[] = [];
  const deletedCustomers: string[] = [];
  const stripe = {
    customers: {
      del: (id: string) => {
        deletedCustomers.push(id);
        return Promise.resolve({ id, deleted: true });
      },
    },
    subscriptions: {
      retrieve: (id: string) =>
        Promise.resolve({ id, customer: "cus-late-discovered" }),
      list: () => Promise.resolve({ data: [], has_more: false }),
      cancel: (id: string) => {
        canceled.push(id);
        return Promise.resolve({
          id,
          customer: "cus-late-discovered",
        });
      },
    },
  };

  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });

  assertEquals(summary.completed, 1);
  assertEquals(summary.failed, 0);
  assertEquals(summary.subscriptionsCanceled, 1);
  assertEquals(summary.customersDeleted, 1);
  assertEquals(canceled, ["sub-late-only"]);
  assertEquals(deletedCustomers, ["cus-late-discovered"]);

  const checkpoints = admin.calls.filter((call) =>
    call.fn === "checkpoint_account_deletion_billing_identity"
  );
  assertEquals(checkpoints.map((call) => call.args), [{
    p_job_id: "job-1",
    p_lease_token: "lease-1",
    p_subscription_id: "sub-late-only",
    p_customer_id: "cus-late-discovered",
  }]);
  const final = admin.calls.find((call) =>
    call.fn === "complete_account_deletion_cleanup_job"
  );
  assertEquals(final?.args, {
    p_job_id: "job-1",
    p_lease_token: "lease-1",
    p_expected_subscription_id: null,
    p_expected_customer_id: null,
    p_expected_surveyor_subscription_id: null,
    p_expected_surveyor_customer_id: null,
    p_expected_late_subscription_ids: ["sub-late-only"],
    p_expected_late_customer_ids: ["cus-late-discovered"],
    p_expected_late_billing_revision: 8,
  });
});

Deno.test("an absent late subscription with no discoverable customer is retried without completion", async () => {
  const admin = makeAdmin([[
    makeJob({
      auth_revoked_at: "2026-07-24T00:00:00Z",
      stripe_subscription_id: null,
      stripe_customer_id: null,
      late_stripe_subscription_ids: ["sub-late-absent"],
      late_billing_revision: 3,
    }),
  ], []]);
  const missing = () =>
    Promise.reject(
      Object.assign(new Error("No such subscription: sub-late-absent"), {
        code: "resource_missing",
      }),
    );
  const stripe = {
    customers: { del: () => Promise.resolve({ deleted: true }) },
    subscriptions: {
      retrieve: missing,
      list: () => Promise.resolve({ data: [], has_more: false }),
      cancel: missing,
    },
  };

  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });

  assertEquals(summary.completed, 0);
  assertEquals(summary.failed, 1);
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "checkpoint_account_deletion_billing_identity"
    ),
    false,
  );
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "complete_account_deletion_cleanup_job"
    ),
    false,
  );
  const retry = admin.calls.find((call) =>
    call.fn === "fail_account_deletion_cleanup_job"
  );
  assertEquals(
    retry?.args.p_error,
    "stripe_customer_identity:sub-late-absent: subscription has no retrievable customer",
  );
});

Deno.test("an absent recorded subscription completes after its paired customer is already absent", async () => {
  const admin = makeAdmin([[
    makeJob({
      auth_revoked_at: "2026-07-24T00:00:00Z",
      stripe_subscription_id: "sub-recorded-absent",
      stripe_customer_id: "cus-recorded-absent",
    }),
  ], []]);
  const absent = (kind: string) =>
    Promise.reject(
      Object.assign(new Error(`No such ${kind}`), {
        code: "resource_missing",
      }),
    );
  const stripe = {
    customers: {
      del: () => absent("customer"),
    },
    subscriptions: {
      retrieve: () => absent("subscription"),
      list: () => absent("customer"),
      cancel: () => absent("subscription"),
    },
  };

  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });

  assertEquals(summary.completed, 1);
  assertEquals(summary.failed, 0);
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "complete_account_deletion_cleanup_job"
    ),
    true,
  );
  assertEquals(
    admin.calls.some((call) => call.fn === "fail_account_deletion_cleanup_job"),
    false,
  );
});

Deno.test("a thrown billing-identity checkpoint remains a durable failure and blocks completion", async () => {
  const admin = makeAdmin([[
    makeJob({
      auth_revoked_at: "2026-07-24T00:00:00Z",
      stripe_subscription_id: null,
      stripe_customer_id: "cus-checkpoint",
    }),
  ], []], {
    checkpointThrow: new Error("checkpoint transport unavailable"),
  });
  const stripe = {
    customers: {
      del: () => Promise.resolve({ deleted: true }),
    },
    subscriptions: {
      retrieve: (id: string) => Promise.resolve({ id }),
      list: () =>
        Promise.resolve({
          data: [{ id: "sub-discovered" }],
          has_more: false,
        }),
      cancel: (id: string) =>
        Promise.resolve({ id, customer: "cus-checkpoint" }),
    },
  };

  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });

  assertEquals(summary.completed, 0);
  assertEquals(summary.failed, 1);
  assertEquals(
    admin.calls.filter((call) =>
      call.fn === "checkpoint_account_deletion_billing_identity"
    ).length,
    2,
  );
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "complete_account_deletion_cleanup_job"
    ),
    false,
  );
  const retry = admin.calls.find((call) =>
    call.fn === "fail_account_deletion_cleanup_job"
  );
  assertEquals(
    String(retry?.args.p_error).includes(
      "billing_identity_checkpoint:sub-discovered: checkpoint transport unavailable",
    ),
    true,
  );
});

Deno.test("a durable auth checkpoint is not repeated, and no-linkage cleanup needs no Stripe key", async () => {
  const admin = makeAdmin([[
    makeJob({
      auth_revoked_at: "2026-07-24T00:00:00Z",
      stripe_subscription_id: null,
      stripe_customer_id: null,
    }),
  ], []]);
  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: null,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });
  assertEquals(summary.completed, 1);
  assertEquals(admin.bans(), 0);
  assertEquals(admin.softDeletes, []);
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "mark_account_deletion_auth_revoked"
    ),
    false,
  );
});

Deno.test("completion refusal becomes a durable retry instead of a false done", async () => {
  const admin = makeAdmin([[
    makeJob({
      auth_revoked_at: "2026-07-24T00:00:00Z",
      stripe_subscription_id: null,
      stripe_customer_id: null,
    }),
  ]], { completeResult: false });
  const summary = await processAccountDeletionCleanupQueue(admin.client, {
    stripeClient: null,
    maxJobs: 1,
    log: () => {},
  });
  assertEquals(summary.completed, 0);
  assertEquals(summary.failed, 1);
  assertEquals(
    admin.calls.some((call) => call.fn === "fail_account_deletion_cleanup_job"),
    true,
  );
});
