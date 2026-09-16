# THE FOLD-IN + W7 RUNBOOK (manager-executed; runs when W6's final ledger lands)
## The last two local steps of the master merge. NO PUSH — the push holds to the very end per the owner's 2026-07-16 ruling.

## FOLD-IN (RF → claude/master-merge-r1)
1. Fresh survey: `git log --oneline -3` both branches; confirm W6's final commit + RF tip;
   confirm the merge worktree is clean and the W6 agent has STOPPED (no live children).
2. In the merge worktree: `git merge review-fixes-2026-07-08 --no-edit`. Expected conflict
   classes (all have precedents this program set): size-baseline entries (reconcile to
   merged-truth per the ×3 precedent), vendorPdfLazy budget const (RF's RATCHET #10 value
   1,066,400 WINS — it arrives with FP-G8's vite.config which supplies the closure reduction),
   docs freshness targets (re-derive from the merged disk truth), migration-count references
   (chain is 136 on both sides — verify no new collisions), test files both sides touched
   (union of pins; RF's fix-wave versions win on substance).
3. POST-FOLD-IN VERIFICATION (the two predictions to confirm):
   a. The budget cure: `npm run build && VERIFY_DIST=1 npx vitest run tests/build/vendorPdfLazy.test.js`
      — the merge branch's recorded +4,723 overage should be GONE (closure well under
      1,066,400). If NOT cured: diagnose provenance before anything else (the FP-G1 lesson).
   b. Goldens byte-identical (the Stage-1 arbiter law still holds — the fold-in carries no
      golden-shifting work; G2 and LIGHT park separately).
4. Commit ledger row in the program doc.

## W7 — THE FULL CONSTITUTIONAL GATE (local)
1. Edge bundles: `node scripts/build-edge-shared.mjs` → verify sourceHash parity + EVENTS_REV
   correctness; commit regenerated bundles (this is W7 scope per the plan, NOT a golden regen).
2. `npm run check` on the quiet machine (no concurrent agents). Expected reds, ALL enumerated,
   nothing else: (a) EXEMPT_CEILING 66→69 (owner-gated — present the +3 list); (b) the
   G2/LIGHT preset-golden reds ONLY if those branches were merged (they should NOT be yet —
   they park until the regen moment; if any golden is red at W7, that is a FOLD-IN ERROR, fix
   it, never regen). (c) load-flakes per the isolate protocol.
3. Quote every number in the ledger row. any-cast at the honestly-typed baseline; closure ≤
   1,066,400; suite counts reconciled vs both parents.
4. NO PUSH. NO PR. Record: "W7 GREEN LOCAL — push held per owner ruling." The reconciled tree
   becomes the base for W-R2-LIGHT (cut the branch from this tip).

## THEN (the standing order)
LIGHT (brief ready) → DEPTH (brief ready) → SOAK launches (docs/SOAK_PLAN_R2.md) →
SM-4 ∥ GUIDE-2b → Surveyor S1–S7 → soak verdicts → tuning → THE ONE REGEN (owner-signed) →
re-grade → Phase E → THE VERY END: push + PR + deploy batch.
