---
name: persist-gap-editactions-fix
description: "§10.4 edit-action persist-gap fix — BUILT + fully verified, UNSTAGED on review-fixes, BLOCKED on the owner-gated first-paint budget (+596 B over)."
metadata: 
  node_type: memory
  type: project
  originSessionId: f459f888-bfb7-4a21-92e5-9280e58b1b5f
---

The DESIGN_SETTLEMENT_MAP §10.4 persist gap (the owner's most-bitten "survives one
path, ghosts another" class): edit actions mutated the live settlement blob but
never wrote it back, so an edit on a hydrated library save ghosted on reload until
some later persisting action happened to write the blob.

**Fix (BUILT + verified, 2026-07-14, on `review-fixes-2026-07-08` @ 1ccf84a9):**
Added one shared store method `persistActiveSaveEdit()` in src/store/settlementSlice.js
(mirrors the proven applyEvent/section-reroll triple: stamp editedAt → updateSavedSettlement
→ persistSaveUpdate{settlement,campaignState}; no-ops without a hydrated save; defers on
flushSuppressPersist). Wired into the gap actions, guarded on whether the mutation
actually happened: `applyUserEditAction`, `revertUserEditAction`, `renameNPC`,
`renameFaction`, **and** the `rename-settlement` case in `commitPendingEdits`.
New test: tests/store/editActionPersist.test.js (17 tests: reload round-trips + guards
+ 5th-gap + parity; negative control proven — 5 fail without the fix).

**Scope beyond the 3 named actions (vetoable decisions I made):**
- `revertUserEditAction` — standalone sibling with the identical gap.
- `rename-settlement`-via-`commitPendingEdits` (settlementSlice.js:502) — the **5TH GAP
  an adversarial census caught that the recon brief missed**: the inline `s.settlement.name=`
  mutation persisted only versionHistory (via the terminal recordSnapshot), never the
  settlement blob; renameSettlement (the persisting helper) has ZERO direct callers, so
  this queue path (DossierHeaderRow → PendingChangesBar → commitPendingEdits) is the only
  town-rename surface. My renameNPC fix would otherwise have left the SAME commit persisting
  NPC renames while ghosting town renames.

**⚠️ THE BLOCKER — owner-gated first-paint budget.** settlementSlice is an EAGER store
slice, so the fix adds **+673 B** to the first-paint closure (baseline 1,216,273 →
1,216,946), **+596 B OVER the 1,216,350 budget** (`tests/build/vendorPdfLazy.test.js`
CLOSURE_BUDGET_BYTES). Budget raises are owner-signed, never incidental (constitutional
monotone-down ratchet). So landing needs an owner ruling: (a) sign a ~+600 B raise with
the §10.4 reason, OR (b) reclaim ~600 B first via the pending first-paint reduction
program (dossier/war read-model lazy split; eager-store-slice review), OR (c) defer. The
fix cannot be byte-golfed under the 77 B margin while staying correct. Gate otherwise
GREEN: tsc 0, eslint clean, 677 store+joins pass (2-3 slow siege/advance flakes pass in
isolation), goldens byte-unchanged (verified). See [[golden-branch-firstpaint-budget-overage]].

**§10.4 itself is ALSO an open owner decision** (DESIGN_SETTLEMENT_MAP §10 item 4),
design-recommended "fix as its own small wave — yes, most-bitten class in production."

**COMMITTED** (owner said "commit") as **151a8ee3** on branch `claude/persist-gap-edit-actions`
(off 1ccf84a9). NOT pushed, NOT merged to review-fixes. The commit message documents the
budget-red as the explicit merge prerequisite. ⚠️ During this work a PARALLEL SESSION advanced
`review-fixes-2026-07-08` 1ccf84a9 → **5a78af5a** (A-wave telemetry ledger); verified 5a78af5a
does NOT touch settlementSlice.js, keeps CLOSURE_BUDGET_BYTES = 1,216,350, and `git merge-tree`
shows 151a8ee3 merges CLEAN onto it — so the +596 B overage + budget prerequisite still hold.
Patch backup + test copy in this session's scratchpad. Launched on the wrong (master) lineage
and relocated — see [[wrong-lineage-worktree-trap-2026-07-14]].
Related: [[comprehensive-review-fix-program]], [[owner-fix-philosophy]] (the survives-one-path
bug class).
