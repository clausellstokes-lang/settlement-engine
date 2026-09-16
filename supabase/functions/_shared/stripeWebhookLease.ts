// deno-lint-ignore-file no-import-prefix
/**
 * Event-level processing lease for the Stripe webhook.
 *
 * Stripe delivers events at least once. Migration 181 turns the historical
 * insert-means-complete claim into a crash-recoverable lease: concurrent work is
 * rejected while a lease is live, a failed handler releases into durable retry
 * state, and a runtime death leaves a stale lease that a later delivery can
 * reclaim. Both paths preserve first-claim age and cumulative attempts.
 *
 * This module owns only the outer event lifecycle. Individual money grants keep
 * their authoritative idempotency keys and database claims. The legacy table
 * fallback exists solely for a rolling deploy in which function code reaches an
 * environment before migration 181; canonical deployment probes the lease RPC
 * before traffic is cut over.
 */

import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.108.2";

const DEFAULT_STALE_AFTER_SECONDS = 300;

export type StripeWebhookClaim =
  | {
    status: "claimed";
    mode: "lease";
    leaseToken: string;
  }
  | {
    status: "claimed";
    mode: "legacy";
    leaseToken: null;
  }
  | {
    status: "duplicate";
  }
  | {
    status: "in_progress";
    retryAfterSeconds: number | null;
  };

type LeaseRpcResult = {
  claimed?: boolean;
  reason?: string;
  lease_token?: string;
  retry_after_seconds?: number;
};

function leaseRpcIsUnavailable(
  data: unknown,
  error: { code?: string } | null,
): boolean {
  return error?.code === "PGRST202" ||
    error?.code === "42883" ||
    (!error && data == null);
}

/**
 * Claim one verified Stripe event for processing.
 *
 * The caller MUST verify the Stripe signature before invoking this function;
 * unsigned traffic must never be able to reserve an event id.
 */
export async function claimStripeWebhookEvent(
  supabase: SupabaseClient,
  eventId: string,
  eventType: string,
): Promise<StripeWebhookClaim> {
  const { data, error } = await supabase.rpc(
    "claim_stripe_webhook_event",
    {
      p_event_id: eventId,
      p_event_type: eventType,
      p_stale_after_seconds: DEFAULT_STALE_AFTER_SECONDS,
    },
  );
  const result = data as LeaseRpcResult | null;

  if (!error && typeof result?.claimed === "boolean") {
    if (!result.claimed) {
      if (result.reason === "in_progress") {
        return {
          status: "in_progress",
          retryAfterSeconds: Number.isFinite(result.retry_after_seconds)
            ? Number(result.retry_after_seconds)
            : null,
        };
      }
      return { status: "duplicate" };
    }
    if (!result.lease_token) {
      throw new Error(`Stripe event ${eventId} claim returned no lease`);
    }
    return {
      status: "claimed",
      mode: "lease",
      leaseToken: result.lease_token,
    };
  }

  if (!leaseRpcIsUnavailable(data, error)) {
    throw new Error(
      `Stripe event lease claim failed: ${error?.message ?? "invalid response"}`,
    );
  }

  const { data: claimRow, error: legacyError } = await supabase
    .from("processed_webhook_events")
    .insert({ event_id: eventId, event_type: eventType })
    .select("event_id")
    .maybeSingle();
  if (legacyError) {
    if (legacyError.code === "23505") return { status: "duplicate" };
    throw new Error(`Stripe event claim failed: ${legacyError.message}`);
  }
  if (!claimRow) return { status: "duplicate" };

  return {
    status: "claimed",
    mode: "legacy",
    leaseToken: null,
  };
}

/**
 * Mark a successfully handled lease complete.
 *
 * Legacy claims were complete at insert time and therefore need no second
 * transition. Losing a migration-181 lease is a hard failure so Stripe retries.
 */
export async function completeStripeWebhookEvent(
  supabase: SupabaseClient,
  eventId: string,
  claim: Extract<StripeWebhookClaim, { status: "claimed" }>,
): Promise<void> {
  if (claim.mode === "legacy") return;

  const { data, error } = await supabase.rpc(
    "complete_stripe_webhook_event",
    {
      p_event_id: eventId,
      p_lease_token: claim.leaseToken,
    },
  );
  if (error || data !== true) {
    throw new Error(
      `Stripe event completion failed: ${error?.message ?? "lease lost"}`,
    );
  }
}

/**
 * Release a failed event claim so Stripe redelivery can retry the handler.
 *
 * The lease RPC retains an immediately claimable retry row rather than erasing
 * the event's age and attempt history. A release failure is returned to the
 * caller for warning-level observability; it does not replace the original
 * handler error. Migration-181 leases remain recoverable through expiry even
 * when release itself fails.
 */
export async function releaseStripeWebhookEvent(
  supabase: SupabaseClient,
  eventId: string,
  claim: Extract<StripeWebhookClaim, { status: "claimed" }>,
): Promise<string | null> {
  const { error } = claim.mode === "lease"
    ? await supabase.rpc("release_stripe_webhook_event", {
      p_event_id: eventId,
      p_lease_token: claim.leaseToken,
    })
    : await supabase
      .from("processed_webhook_events")
      .delete()
      .eq("event_id", eventId);
  return error?.message ?? null;
}
