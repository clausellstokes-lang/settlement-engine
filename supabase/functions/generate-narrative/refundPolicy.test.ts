/**
 * refundPolicy.test.ts — A+ tests-tooling.4 (money-path execution test).
 *
 * Pins the refund decision table so a change to who gets charged on a failed
 * generation fails the Deno gate. Runs under `deno task test:edge`.
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { FAILURE_STAGES, FailureStage, shouldRefundOnFailure } from "./refundPolicy.ts";

Deno.test("thesis failure refunds the up-front credit spend", () => {
  assertEquals(shouldRefundOnFailure("thesis"), true);
});

Deno.test("dailyLife field failure refunds (no thesis; all-or-nothing)", () => {
  assertEquals(shouldRefundOnFailure("dailyLifeField"), true);
});

Deno.test("refinement/polish failure does NOT refund (partial success kept)", () => {
  assertEquals(shouldRefundOnFailure("refinement"), false);
});

Deno.test("the policy is total over the FailureStage union (no silent default)", () => {
  // Derive the stage set from FAILURE_STAGES — the SINGLE runtime source — NOT a
  // hardcoded literal (the H8 fix). The old test pinned `['thesis','dailyLifeField',
  // 'refinement']` inline, so a new stage added to the union went unverdicted and
  // still passed. Here the expected-verdict table is reconciled against FAILURE_STAGES
  // BOTH WAYS, so a stage added without a decision (or a stale verdict for a removed
  // stage) fails this test loudly under `deno task test:edge`.
  const EXPECTED: Record<FailureStage, boolean> = {
    thesis: true,        // atomic core — full refund
    dailyLifeField: true, // all-or-nothing paragraphs — full refund
    refinement: false,   // post-thesis polish — partial success kept, no refund
  };
  assertEquals(
    [...FAILURE_STAGES].sort(),
    Object.keys(EXPECTED).sort(),
    "FAILURE_STAGES and the verdict table must match exactly — a new stage needs a verdict",
  );
  for (const stage of FAILURE_STAGES) {
    assertEquals(
      shouldRefundOnFailure(stage),
      EXPECTED[stage],
      `refund verdict for stage "${stage}"`,
    );
  }
});
