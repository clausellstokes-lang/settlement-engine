/**
 * Build the complete metadata portion of a durable Stripe refund request.
 *
 * Stripe requires every request replayed under one idempotency key to have the
 * same parameters. Only fields that are immutable on
 * payment_refund_obligations belong here. Nullable contextual links
 * (user/attempt/Checkout Session) are deliberately database-only: they can be
 * filled by a later webhook or nulled by account deletion.
 */
export type PaymentRefundRequestIdentity = {
  payment_intent_id: string;
  purpose: string;
  amount_cents: number;
  reason: string;
};

export function buildPaymentRefundRequestMetadata(
  identity: PaymentRefundRequestIdentity,
): Record<string, string> {
  if (
    typeof identity.payment_intent_id !== "string" ||
    identity.payment_intent_id.length === 0 ||
    typeof identity.purpose !== "string" ||
    identity.purpose.length === 0 ||
    !Number.isSafeInteger(identity.amount_cents) ||
    identity.amount_cents <= 0 ||
    typeof identity.reason !== "string" ||
    identity.reason.length === 0
  ) {
    throw new Error("refund obligation has invalid immutable request identity");
  }

  return {
    purpose: "settlementforge_unfulfilled_payment",
    refund_purpose: identity.purpose,
    payment_intent_id: identity.payment_intent_id,
    obligation_amount_cents: String(identity.amount_cents),
    reason: identity.reason,
  };
}
