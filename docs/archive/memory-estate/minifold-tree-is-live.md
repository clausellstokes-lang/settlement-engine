---
name: minifold-tree-is-live
description: ⚠️ The minifold worktree is written by concurrent sessions mid-task — verification binds to a snapshot that expires
metadata: 
  node_type: memory
  type: project
  originSessionId: c0eb8c59-b585-45a4-afa4-24af69125d15
  modified: 2026-08-06T12:15:00.000Z
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

## 2026-08-06 — TWO MORE, FROM THE CYCLE-4 DEBT SLICE (executed, not inferred)

**A HASH TAKEN A TURN AGO DESCRIBES A FILE THAT NO LONGER EXISTS.** This slice read
`git diff` on `src/domain/worldPulse/brokeragePlantHandoff.js`, saw mutation-sweep plant
#73 (`rows[rows.length - 1]` → `rows[0]`), and four tool calls later ran the pins suite.
The failing pin was `EACH DOOR of the consume-once double guard`, not the newest-last pin
the diff predicted — because the file had moved to plant #74 in between. That would have
been filed as "a pin that cannot fail" had the md5 not been stamped **inside the same
command** as the test run. **On this tree, stamp the artefact's hash in the command that
measures it, and treat any measurement whose input hash you did not capture as unattributed.**

**A PLANTED-LOOKING MUTATION IS A SIBLING LANE'S WORKING STATE UNTIL PROVEN OTHERWISE.**
The same dirty file carried a byte-exact copy of a `mutation-sweep.sh` plant, `ps aux`
showed no sweep running, and the tree had been clean minutes earlier — a near-perfect
imitation of an abandoned sweep leftover whose obvious cure is to revert it. It was in fact
another lane proving its two plants red before claiming them in the manifest. Reverting on
sight would have destroyed an in-flight mutant. Never revert a file you did not author, no
matter how much its content looks like debris.

**THE SAME CURE CAN BE IN FLIGHT IN BOTH LANES AT ONCE.** This slice was dispatched to add
two `meta:` entries to `scripts/mutation-coverage-manifest.json` and found the sibling lane's
byte-equivalent entries appear on disk mid-composition; they landed as `e6410bc6`. Duplicating
would have reddened the join's own *one label proves exactly one entry* arm. **Before authoring
a cure into a shared file, `git diff` that file first — the work may already be there.**
