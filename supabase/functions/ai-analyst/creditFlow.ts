/**
 * ai-analyst/creditFlow.ts — the PURE money-path orchestrator (S1 commercial).
 *
 * Generalizes the generate-chronicle reserve→spend→refund sequence into an
 * effect-injected, provider-neutral state machine so the money boundary is proven by
 * the same code the edge runs: the vitest pin (tests/edgeFunctions/creditFlow.test.js)
 * drives it with fake effects and asserts the invariants; index.ts wires the real
 * supabase RPCs into the SAME orchestrator. Deno-global-free, remote-import free.
 *
 * INVARIANTS (the reserve/refund round-trip):
 *   1. RESERVE the global cap BEFORE the spend (fail-closed on !allowed).
 *   2. Consume the per-user rate limit AFTER reserve; a reject RELEASES the reservation.
 *   3. SPEND is captured (spendId); insufficient/error RELEASES the reservation.
 *   4. On model FAILURE: meter(false) → refund(spendId) → release. No double-spend.
 *   5. On model SUCCESS: meter(true) → release. NEVER refund a successful paid call.
 *   6. ELEVATED (dev/admin) spends are never refunded (refund receives the flag).
 *   7. The reservation is RELEASED on EVERY post-reserve exit (no leaked headroom).
 */

export interface SpendResult {
  ok: boolean;
  spendId: string | null;
  elevated: boolean;
  balance: number | null;
  reason?: string | null;
}

export interface ModelResult {
  ok: boolean;
  answerText: string;
  usage?: { input?: number | null; output?: number | null } | null;
}

export interface CreditEffects {
  /** Race-safe global-USD-cap reservation (reserve_ai_spend). */
  reserve(): Promise<{ allowed: boolean; reservationId: string | null }>;
  /** Per-user/day rate limit (consume_ai_generate_rate_limit); fail-OPEN on error. */
  rateLimit(): Promise<{ allowed: boolean }>;
  /** Atomic credit spend (spend_credits). Throwing = RPC-level failure. */
  spend(): Promise<SpendResult>;
  /** The provider call; throwing OR ok:false is a model failure (refund path). */
  callModel(): Promise<ModelResult>;
  /** Refund a captured spend (refund_credits). No-ops when elevated. */
  refund(spendId: string, reason: string, elevated: boolean): Promise<void>;
  /** Release the cap reservation (release_ai_spend_reservation). Null-safe. */
  release(reservationId: string | null): Promise<void>;
  /** COGS metering (ai_usage_events insert). Best-effort; never throws through. */
  meter(ok: boolean, model: ModelResult | null): Promise<void>;
}

export type CreditOutcome =
  | { outcome: 'cap'; status: 503 }
  | { outcome: 'rate_limited'; status: 429 }
  | { outcome: 'insufficient'; status: 402; reason: string; balance: number }
  | { outcome: 'model_failed'; status: 502; refunded: boolean }
  | { outcome: 'ok'; status: 200; answerText: string; balance: number | null; model: ModelResult };

/**
 * Run the credited provider call. Returns a typed outcome the edge shell maps to a
 * Response. Every post-reserve exit releases the reservation.
 * @param {CreditEffects} fx
 * @param {string} refundReason
 */
export async function runCreditedCall(fx: CreditEffects, refundReason: string): Promise<CreditOutcome> {
  // 1. RESERVE the cap first (fail-closed).
  const cap = await fx.reserve();
  if (!cap.allowed) return { outcome: 'cap', status: 503 };
  const reservationId = cap.reservationId;

  // 2. Rate limit; a reject releases the reservation.
  const rl = await fx.rateLimit();
  if (!rl.allowed) {
    await fx.release(reservationId);
    return { outcome: 'rate_limited', status: 429 };
  }

  // 3. Spend; insufficient / error releases the reservation.
  let spendRes: SpendResult;
  try {
    spendRes = await fx.spend();
  } catch {
    await fx.release(reservationId);
    return { outcome: 'insufficient', status: 402, reason: 'spend_failed', balance: 0 };
  }
  if (!spendRes.ok) {
    await fx.release(reservationId);
    return { outcome: 'insufficient', status: 402, reason: spendRes.reason || 'insufficient_funds', balance: spendRes.balance ?? 0 };
  }
  const spendId = spendRes.spendId;
  const elevated = spendRes.elevated;

  // 4/5. Model call in a try; failure = meter(false) → refund → release.
  let model: ModelResult;
  try {
    model = await fx.callModel();
    if (!model.ok || !model.answerText) throw new Error('empty answer');
  } catch {
    await fx.meter(false, null);
    if (spendId) await fx.refund(spendId, refundReason, elevated);
    await fx.release(reservationId);
    return { outcome: 'model_failed', status: 502, refunded: !elevated && !!spendId };
  }

  await fx.meter(true, model);
  await fx.release(reservationId); // success: reservation no longer needed
  return { outcome: 'ok', status: 200, answerText: model.answerText, balance: elevated ? 999999 : spendRes.balance, model };
}
