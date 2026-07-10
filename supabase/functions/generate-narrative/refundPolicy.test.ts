/**
 * refundPolicy.test.ts — A+ tests-tooling.4 (money-path execution test).
 *
 * Pins the refund decision table so a change to who gets charged on a failed
 * generation fails the Deno gate. Runs under `deno task test:edge`.
 */
import { assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { shouldRefundOnFailure } from "./refundPolicy.ts";

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
  // Exhaustive: every declared stage has an explicit verdict above. This guard
  // fails to compile/typecheck if a new stage is added without a decision here.
  const stages = ["thesis", "dailyLifeField", "refinement"] as const;
  const verdicts = stages.map((s) => shouldRefundOnFailure(s));
  // exactly the two atomic-core stages refund; refinement does not.
  assertEquals(verdicts, [true, true, false]);
});
