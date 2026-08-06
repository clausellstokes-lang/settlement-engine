---
name: minifold-tree-is-live
description: ⚠️ The minifold worktree is written by concurrent sessions mid-task — verification binds to a snapshot that expires
metadata: 
  node_type: memory
  type: project
  originSessionId: c0eb8c59-b585-45a4-afa4-24af69125d15
  modified: 2026-07-26T09:05:53.180Z
---

`.claude/worktrees/minifold` (branch `claude/composite-r4`) is edited by other
sessions **while you are working in it**. Confirmed on 2026-07-26, not inferred:

- An `Edit` to `src/domain/generationOwnership.js` was rejected with "the file
  had been modified on disk since you last read it".
- `isProtectedFromCustomSubsumption` and its `assembleInstitutions.js` wiring
  appeared between two reads minutes apart (mtimes 04:43:04 / 04:42:36) — another
  session shipped the exact fix that was mid-investigation here.
- ~32 files changed inside one 25-minute window, including
  `src/store/settlementSlice.js`, `src/generators/generateSettlementPipeline.js`,
  `src/domain/regenerationPreservation.js`, `src/domain/userEdits.js`.

**Why it matters:** a 636s full-suite result is bound to a snapshot that no
longer exists by the time it prints. Worse, seed-pinned probe tests
(`tests/joins/resourceEdits.test.js` and siblings) cannot be stabilized while the
tree moves — re-pinning them against a live tree is wasted work that will be
invalidated again, and it collides head-on with whoever is mid-fix.

**How to apply:** before editing, re-read the file (never edit from a stale
read). Before starting a cluster of work, check `find src tests -mmin -25` to see
whether another session is active in that subject area — if the recently-touched
files overlap your cluster, coordinate instead of starting. Re-probe seed pins as
the LAST step before a commit, from a quiet tree. Related:
[[generation-remediation-gate-state]], [[agent-stash-incident-2026-07-14]],
[[wrong-lineage-worktree-trap-2026-07-14]].
