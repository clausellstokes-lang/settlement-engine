---
name: master-merge-already-executed
description: MEASURED 2026-07-26 — the master merge ALREADY HAPPENED 2026-07-15; master is an ancestor of composite-r4; remaining = W7 gate evidence + W8 fast-forward PR
metadata: 
  node_type: memory
  type: project
  originSessionId: 89567b52-be97-4ef9-bcce-a0f1c8956737
  modified: 2026-07-27T03:21:33.194Z
---

Re-survey 2026-07-26 (read-only, measured; full addendum appended to BOTH copies of docs/MASTER_MERGE_PLAN.md):

- **The merge EXECUTED 2026-07-15**: W1 merge commit `0168e287` resolved 568 conflicts (plan predicted 554) per the plan's own §4/§5 dispositions; W2–W6 verified in history (fence matrix held file-by-file; both paid-surface rulings survived — free.export:false, capital vocabulary; controlBytes pin landed W4; entity-link wiring W5; security batch W6).
- `git merge-base --is-ancestor d024286e claude/composite-r4` → **YES**. master→composite is a **zero-conflict fast-forward of ~1,573 commits**. There is NO future conflict-resolution operation.
- **Remaining**: W7 = full-gate evidence on the composite tip (the banking-fold gate run + golden re-capture at remediation-lane close IS this); W8 = owner PR + merge button (fast-forward).
- **RF (review-fixes) is NOT a code branch**: 0/308 master commits; 507 post-fold commits = docs/marketing; its 2 unique source files were deliberately deleted on the composite; its closure-budget constant is a stale fork (1,066,400 vs composite's 1,040,000). Never merge RF toward master (would regress). Disposition = queue M39.
- **Migration collisions: ZERO** by number/filename. NEW class instead: migs 024/057 were edited IN PLACE (spend_credits fallback repricing, deliberate per mig 174 header) — repo replay diverges from prod's applied bytes = queue M38.
- Schema: composite is a STRICT SUPERSET of master (master-only fields = 0) — MM§8.3b closed empty.
- Un-landed cherry-picks: ab1c30ba, ccd0d670 (nowhere); 92973282 (perf) = the M35 reclaim candidate.

**Why:** every older plan/memory that treats the master merge as a future 554-conflict operation is WRONG in the safe direction; acting on the old picture would waste a re-execution or, worse, merge RF into master.

**How to apply:** supersedes [[master-merge-plan-committed]]-era beliefs (third-lineage collision did NOT materialize; W5 re-merge/cherry-pick notes are historical). The addendum in MASTER_MERGE_PLAN.md is the live state. See [[holistic-survey-2026-07-26]], [[backup-exposure-2026-07-26]].
