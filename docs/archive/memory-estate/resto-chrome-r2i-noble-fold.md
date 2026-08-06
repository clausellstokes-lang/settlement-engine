---
name: resto-chrome-r2i-noble-fold
description: "R2-i shipped — dead 'noble' POWER_ROLES bucket folded into 'government'; completes census #22; parked-golden extension declared; resto2 full-suite flakiness hazard."
metadata: 
  node_type: memory
  type: project
  originSessionId: a79cbfe2-9131-403f-a75c-e8f49bf104af
  modified: 2026-07-19T11:21:08.229Z
---

**R2-i #22 follow-up shipped @ 27eae9e9** on `claude/restoration-chrome` (worktree resto2, base HEAD aaeec163, NOT folded to master). Ports master's (d024286e) noble→government merge into current's `src/data/historyData.js`: the 9 feudal roles moved verbatim from the top-level `POWER_ROLES_BY_CATEGORY.noble` bucket to the end of `government` (goalCategories + Duke/Duchess & Royal Chamberlain requiresInstKeyword gates preserved), and the `noble` key removed. Completes census #22 — R2-f (c832e151) shipped the lastingEffects half and explicitly spawned "the +dead noble bucket" as this task.

**Why 'noble' was dead:** `getUpgradeOpportunities` (economy/upgradeOpportunities.js) is the ONLY consumer; it iterates buckets generically (Object.entries) and matches a bucket only when an institution carries priorityCategory/category === the key. No catalog entry uses 'noble' on either axis; categoryVocabulary.js never admits it; npcProfile.js already aliases noble→government (:51, :383). So the bucket never matched. See [[owner-fix-philosophy]] (Fable=checker: this was a verify-heavy port).

**PARKED-GOLDEN EXTENSION (declared, NOT re-recorded):** the fold makes the 9 roles reachable for any government-institution settlement at hamlet+ tier, shifting same-seed NPC draws. Measured clean-vs-edited over the generatorGoldenMaster corpus: **155 of 187 configs shift; all 28 thorps byte-identical** (thorps sit below 'hamlet', the lowest new role's minTier). generatorGoldenMaster stays a PARKED RED (confirmed red on clean HEAD in isolation). The branch declares golden shifts IN THE COMMIT MESSAGE (not GOLDEN_SHIFT_LEDGER.md), per R2-f precedent.

**⚠️ HAZARD — resto2 full-suite is parallelism-flaky; do NOT diff raw failing-FILE sets.** Two full `npx vitest run` passes gave 21 vs 41 failed files. The delta is almost all pglite/*.test.js infra churn (fails in BOTH directions run-to-run) plus a few statistical/generator tests. `pipeline.property.test.js` (a determinism check), `neighbourFactionRenorm`, `servicesSeverityPlaceholder` all FAIL under full parallelism but PASS in isolation on both clean and edited trees. To prove a change is red-neutral here, run suspect files in ISOLATION on a clean-HEAD temp worktree vs the edited tree — the raw file-set diff is noise. See [[piped-gate-exit-masking]], [[worktree-npmci-eusage-node-modules-walkup]].
