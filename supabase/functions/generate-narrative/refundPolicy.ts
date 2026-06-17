/**
 * refundPolicy.ts — the money-critical rule for WHEN a failed generation refunds.
 *
 * Credits are spent up-front (the atomic `spend_credits` RPC) BEFORE streaming,
 * so a failure mid-generation must decide whether to give them back. The rule:
 *
 *   - thesis failure        → FULL REFUND. The thesis is the atomic core; if it
 *                             fails the user got nothing usable.
 *   - dailyLife field fail   → FULL REFUND. dailyLife has no thesis — its five
 *                             paragraphs are all-or-nothing, so any failure is fatal.
 *   - refinement/polish fail → NO REFUND. The thesis already succeeded; the user
 *                             keeps it plus whatever passes completed (partial
 *                             success, surfaced via `partialFailure`/`failedFields`).
 *
 * (Elevated/unlimited accounts are never charged, so the refund() closure itself
 * no-ops for them — that is an orthogonal concern from this stage policy.)
 *
 * This is the single source of truth for the rule; index.ts consults it at every
 * failure site, and refundPolicy.test.ts pins the table so a future edit that, say,
 * starts refunding partial failures (or stops refunding thesis failures) fails the
 * Deno gate instead of silently changing what users are charged.
 */

/** The point in the generation pipeline at which a failure occurred. */
export type FailureStage = "thesis" | "dailyLifeField" | "refinement";

/** True iff a failure at `stage` should refund the up-front credit spend. */
export function shouldRefundOnFailure(stage: FailureStage): boolean {
  // Atomic-core failures (thesis, or any all-or-nothing dailyLife paragraph) are
  // fatal → refund. Post-thesis refinement failures are partial success → keep.
  return stage === "thesis" || stage === "dailyLifeField";
}
