// deno-lint-ignore-file no-import-prefix
/**
 * Behavioral contract for the shared durable Stripe-refund reconciler.
 *
 * Production surface: the scheduled worker replays obligations created by the
 * webhook. Failure class: a lost create response must converge without issuing a
 * second refund or inventing lifecycle order. Negative controls prove that
 * linked pending refunds remain retryable, transient failures only reschedule,
 * and "already refunded" requires full succeeded-refund evidence.
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import {
  processPaymentRefundRecoveryQueue,
  type PaymentRefundRecoveryJob,
  type StripeRefundsApi,
} from "./paymentRefundRecovery.ts";

const makeJob = (
  overrides: Partial<PaymentRefundRecoveryJob> = {},
): PaymentRefundRecoveryJob => ({
  payment_intent_id: "pi_recovery",
  stripe_refund_id: null,
  checkout_session_id: "cs_recovery",
  user_id: "11111111-1111-1111-1111-111111111111",
  attempt_id: "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa",
  purpose: "auto_reload_unfulfilled",
  amount_cents: 459,
  currency: "usd",
  reason: "attempt_mismatch",
  status: "pending",
  stripe_event_created_at: null,
  stripe_idempotency_key:
    "auto-reload-unfulfilled-refund-pi_recovery",
  lease_token: "bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb",
  recovery_attempts: 1,
  ...overrides,
});

function makeAdmin(
  pages: PaymentRefundRecoveryJob[][],
  effectiveStatus = "succeeded",
) {
  const calls: Array<{ fn: string; args: Record<string, unknown> }> = [];
  const mirrors: Array<Record<string, unknown>> = [];
  const reversals: Array<Record<string, unknown>> = [];
  // deno-lint-ignore no-explicit-any
  const client: any = {
    rpc: (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      if (fn === "claim_payment_refund_obligations") {
        return Promise.resolve({ data: pages.shift() ?? [], error: null });
      }
      if (fn === "record_payment_refund_obligation") {
        return Promise.resolve({
          data: { status: effectiveStatus },
          error: null,
        });
      }
      if (fn === "release_payment_refund_obligation_lease") {
        return Promise.resolve({ data: true, error: null });
      }
      throw new Error(`unexpected rpc ${fn}`);
    },
    from: (table: string) => {
      if (table !== "money_events") {
        throw new Error(`unexpected table ${table}`);
      }
      return {
        upsert: (row: Record<string, unknown>) => {
          mirrors.push(row);
          return Promise.resolve({ error: null });
        },
        update: (row: Record<string, unknown>) => ({
          eq: (_column: string, value: string) => {
            reversals.push({ ...row, event_key: value });
            return Promise.resolve({ error: null });
          },
        }),
      };
    },
  };
  return { client, calls, mirrors, reversals };
}

Deno.test("lost create response is recovered with the stored key before the lease is released", async () => {
  const admin = makeAdmin([[makeJob()], []]);
  const creates: Array<{
    params: Record<string, unknown>;
    options: Record<string, unknown>;
  }> = [];
  const stripe: StripeRefundsApi = {
    refunds: {
      create: (params, options) => {
        creates.push({ params, options });
        return Promise.resolve({
          id: "re_recovered",
          status: "succeeded",
          amount: 459,
          currency: "usd",
          payment_intent: "pi_recovery",
        });
      },
      retrieve: () => {
        throw new Error("retrieve should not run");
      },
      list: () => {
        throw new Error("list should not run");
      },
    },
  };

  const summary = await processPaymentRefundRecoveryQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    now: () => "2026-07-24T12:00:00.000Z",
    log: () => {},
  });
  assertEquals(summary.succeeded, 1);
  assertEquals(summary.failed, 0);
  assertEquals(summary.moneyEventsMirrored, 1);
  assertEquals(creates.length, 1);
  assertEquals(
    creates[0].options.idempotencyKey,
    "auto-reload-unfulfilled-refund-pi_recovery",
  );
  assertEquals(creates[0].params, {
    payment_intent: "pi_recovery",
    metadata: {
      purpose: "settlementforge_unfulfilled_payment",
      refund_purpose: "auto_reload_unfulfilled",
      payment_intent_id: "pi_recovery",
      obligation_amount_cents: "459",
      reason: "attempt_mismatch",
    },
  });

  const recordIndex = admin.calls.findIndex((call) =>
    call.fn === "record_payment_refund_obligation"
  );
  const releaseIndex = admin.calls.findIndex((call) =>
    call.fn === "release_payment_refund_obligation_lease"
  );
  assertEquals(recordIndex > -1, true);
  assertEquals(releaseIndex > recordIndex, true);
  assertEquals(
    admin.calls[recordIndex].args.p_stripe_event_created_at,
    null,
  );
  assertEquals(admin.mirrors[0].event_key, "refund:auto-reload:pi_recovery");
});

Deno.test("a linked pending Refund is retrieved instead of recreated and remains retryable", async () => {
  const admin = makeAdmin([[
    makeJob({
      stripe_refund_id: "re_pending",
      stripe_event_created_at: "2026-07-24T11:59:00.000Z",
    }),
  ], []], "pending");
  const retrieved: string[] = [];
  const stripe: StripeRefundsApi = {
    refunds: {
      create: () => {
        throw new Error("create should not run");
      },
      retrieve: (id) => {
        retrieved.push(id);
        return Promise.resolve({
          id,
          status: "pending",
          amount: 459,
          currency: "usd",
          payment_intent: "pi_recovery",
        });
      },
      list: () => {
        throw new Error("list should not run");
      },
    },
  };

  const summary = await processPaymentRefundRecoveryQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });
  assertEquals(retrieved, ["re_pending"]);
  assertEquals(summary.reconciled, 1);
  assertEquals(summary.nonterminal, 1);
  assertEquals(summary.failed, 0);
  const release = admin.calls.find((call) =>
    call.fn === "release_payment_refund_obligation_lease"
  );
  assertEquals(release?.args.p_error, null);
  const record = admin.calls.find((call) =>
    call.fn === "record_payment_refund_obligation"
  );
  assertEquals(
    record?.args.p_stripe_event_created_at,
    "2026-07-24T11:59:00.000Z",
  );
});

Deno.test("a transient Stripe error releases the lease into exponential retry without inventing status", async () => {
  const admin = makeAdmin([[makeJob({ recovery_attempts: 3 })], []]);
  const stripe: StripeRefundsApi = {
    refunds: {
      create: () => Promise.reject(new Error("Stripe unavailable")),
      retrieve: () => Promise.reject(new Error("unexpected retrieve")),
      list: () => Promise.reject(new Error("unexpected list")),
    },
  };

  const summary = await processPaymentRefundRecoveryQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    retryBaseSeconds: 60,
    log: () => {},
  });
  assertEquals(summary.failed, 1);
  assertEquals(summary.retryScheduled, 1);
  assertEquals(
    admin.calls.some((call) =>
      call.fn === "record_payment_refund_obligation"
    ),
    false,
  );
  const release = admin.calls.find((call) =>
    call.fn === "release_payment_refund_obligation_lease"
  );
  assertEquals(release?.args.p_retry_seconds, 240);
  assertEquals(release?.args.p_error, "Stripe unavailable");
});

Deno.test("charge_already_refunded requires full succeeded-refund proof and retains a Stripe id", async () => {
  const admin = makeAdmin([[makeJob()], []]);
  const alreadyRefunded = Object.assign(
    new Error("already refunded"),
    { code: "charge_already_refunded" },
  );
  const stripe: StripeRefundsApi = {
    refunds: {
      create: () => Promise.reject(alreadyRefunded),
      retrieve: () => Promise.reject(new Error("unexpected retrieve")),
      list: () =>
        Promise.resolve({
          data: [
            {
              id: "re_partial_1",
              status: "succeeded",
              amount: 200,
              currency: "usd",
            },
            {
              id: "re_partial_2",
              status: "succeeded",
              amount: 259,
              currency: "usd",
            },
          ],
        }),
    },
  };

  const summary = await processPaymentRefundRecoveryQueue(admin.client, {
    stripeClient: stripe,
    claimBatchSize: 1,
    maxJobs: 10,
    log: () => {},
  });
  assertEquals(summary.succeeded, 1);
  const record = admin.calls.find((call) =>
    call.fn === "record_payment_refund_obligation"
  );
  assertEquals(record?.args.p_stripe_refund_id, "re_partial_2");
  assertEquals(record?.args.p_status, "succeeded");
});
