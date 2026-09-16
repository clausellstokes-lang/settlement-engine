---
name: concurrent-lane-silent-edit-revert
description: "⚠️⚠️ A concurrent lane's file rewrite can SILENTLY REVERT part of your in-flight edit — perl/sed in-place edits vanish while Edit-tool edits survive; cure = re-grep the old identifier after every rename + own a behavioural census that reds"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 1c189f3d-9fc3-4fc9-9cb7-b767525d28d5
  modified: 2026-08-03T15:39:24.706Z
---

2026-08-03, minifold worktree, HK-3 lane. Mid-edit, a concurrent lane (THE
DECOMPOSITION WAVE, lane D) began decomposing `src/generators/npcGenerator.js`,
wrote a decomposed version, then reverted it when it noticed the file was
claimed. The revert restored the file to its HEAD content **plus my Edit-tool
hunks**, but **silently discarded a `perl -0pi` rename** I had applied to three
call sites in the same file. Result: `hookRegistry` was threaded through the
function signatures but the three `generateNPCs` call sites still passed the
dead name, so the registry arrived `undefined` at every draw and the whole
wave's machinery degraded to naive picks — with every existing focused test
still green.

**The tells, in the order they appeared:**
1. Edit-tool responses started saying *"the file had been modified on disk since
   you last read it"*.
2. A `git diff` showed a foreign `-326`-line hunk (a function I never touched)
   that had **vanished** by the next command — a transient read of a file being
   rewritten by another process.
3. Line numbers moved by ~750 between two greps minutes apart.
4. The real proof was behavioural, not textual: a before/after corpus census
   showed exact-duplicate hooks jumping 28 → 118 (4×) — the signature of the
   registry not arriving.

**Why:** in a shared worktree two agents hold the same file open. Whole-file
in-place rewrites (`perl -0pi`, `sed -i`, `Write`) are last-writer-wins against
another process's rewrite; the harness's Edit tool re-reads and so tends to
survive. Neither is safe, but the silent-revert failure mode belongs to the
former.

**How to apply:**
1. After ANY rename inside a contended file, immediately `grep -n '<old-name>'`
   the file again. Zero hits is the only acceptable answer, and it must be
   re-checked right before staging.
2. Prefer the Edit tool over `perl -0pi`/`sed -i` for renames in a live tree;
   when a bulk rewrite is unavoidable, verify with a grep in the SAME bash call.
3. Own a **behavioural** census (a corpus measurement with a before number from
   a detached base worktree), not only tests. The green focused tests never saw
   this; the 28 → 118 census did.
4. Design the wiring so a lost thread throws rather than degrades: HK-3 threads
   one `{ titles, themes }` OBJECT so a missed site hits
   `used.has is not a function`; two loose Sets would have degraded silently to
   naive picks forever.
5. The shared task list is a live cross-lane channel — lane D's queue row flipped
   to "STOPPED — npcGenerator.js is live under the HK-3 hook lane" once it saw
   the collision. Read it when a file starts moving under you.

Related: [[shared-index-commit-race]], [[minifold-tree-is-live]],
[[capability-remediation-program-state]] (529-killed agents leave PARTIAL EDITS).
