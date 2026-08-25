---
name: foreign-file-vanish-is-not-destruction
description: "⚠️⚠️ A foreign file sitting at HEAD content mid-session is a VANISH, not a destruction — and the pre-commit hook is the wrong default suspect: lint-staged's `git stash create` backup path does not touch the worktree. Observed + wrongly attributed 2026-08-04 at 76ea345c; recovery recipe + the guard that saved it are the durable parts"
metadata: 
  node_type: memory
  type: project
  originSessionId: 8a9d5a1d-ff42-4f0a-9ac7-da0836233067
  modified: 2026-08-04T13:42:12.859Z
---

2026-08-04, minifold worktree (`claude/composite-r4`). Supersedes an earlier memory of mine
that asserted the pre-commit hook reverts foreign unstaged tracked files. **That attribution
was wrong, or at least unproven, and it contradicted two observations this repo's own ledger
already carried** (`docs/FABLE_VALIDATION_QUEUE.md` lines 173 and 177). Retracted in full in
the queue's LANE V4D R-3b section.

WHAT ACTUALLY HAPPENED. A one-file pathspec commit (`76ea345c`, 09:06:16) ran husky/lint-staged.
At 09:06:21 two tracked files holding a parallel lane's live WR-9d work —
`src/domain/certification/behavioralContract.js` and `warConvergenceContract.js` — were
byte-identical to HEAD (`git hash-object` == `git rev-parse HEAD:<path>`) and had dropped out of
`git status`. At 09:07:42 both were modified again, matching the pre-commit backup stash's blobs
exactly. The work landed intact in `a70c9284`. Nothing was ever lost.

WHY THE HOOK WAS THE WRONG SUSPECT, on four checks:

1. **MECHANISM.** lint-staged took its backup via `git stash create` — proved by the stash's
   default `WIP on <branch>:` subject; the worktree-reverting path stamps `lint-staged automatic
   backup` instead. Its only worktree-mutating call, `git restore --worktree` inside
   `hidePartiallyStagedChanges`, requires PARTIALLY staged files (index AND worktree both
   modified). The stash's index commit showed only my own staged file had index changes, and it
   had no worktree-vs-index delta, so zero files qualified and that path never ran.
2. **THE EVIDENCE I USED WAS NON-PROBATIVE.** `git diff <my-commit> <stash> -- <foreign paths>`
   showing modifications proves nothing: a pathspec commit necessarily lacks unstaged work
   whether a revert happened or not. A dangling backup stash is likewise the NORMAL lint-staged
   lifecycle, not a failure signature.
3. **ASYMMETRY.** The lane had five dirty files; exactly its two `src/domain/` SOURCE modules
   went clean while its script and two test files did not. A stash cycle is all-or-nothing. Two
   source modules dropping to HEAD and returning is the signature of a **mutant or
   negative-control cycle** — which that lane's own ledger row records running ("MUTANTS — FIVE
   EXECUTED, cp-backed, restored `cmp`-exact"). INFERRED, not proven.
4. **NEGATIVE CONTROL.** A second pathspec commit through the same hook minutes later
   (`ca46705b`), with foreign dirty files present, reverted nothing.

**How to apply:**

1. **A foreign file at HEAD content mid-session is a VANISH. Do not name a cause.** Ledger line
   177 already said it: "not a loss, which is worth recording because the vanish is
   indistinguishable from destruction at a glance." Report the observation, preserve recovery
   material, look again in a minute. Concurrent lanes routinely revert their own files for
   mutants, negative controls and pre-existing-red attribution.
2. **The post-commit survival check still earns its keep** — read a `<  M` line that no commit
   explains with the same alarm as `< ??`. Confirm with `git log -1 --format=%h -- <path>`
   (unchanged) plus `stat -f '%Sm' -t '%H:%M:%S' <path>`. What that buys you is a fast recovery,
   not a culprit.
3. **The recovery recipe works and is worth keeping.** lint-staged leaves its backup as an
   unreachable commit subject `WIP on <branch>: <prior-HEAD> <subject>`, dated with your commit's
   exact timestamp. Find it via `git fsck --unreachable --no-reflogs | awk '$2=="commit"{print $3}'`
   then `git log -1 --format="%ad %s" --date=format:"%H:%M:%S" <sha>`. Extract with
   `git cat-file blob <stash>:<path>`. Pin it first (`git tag -f`) so gc cannot prune it, and copy
   blobs to the scratchpad; verify each with `git hash-object`.
   ⚠️ macOS has no `timeout` binary — `timeout git fsck` dies with "command not found" and yields
   an empty list, which reads as "no dangling objects" and would have hidden the stash entirely.
4. **GUARD THE RESTORE — this is the load-bearing habit.** Immediately before writing, assert
   `git hash-object <path>` still equals `git rev-parse HEAD:<path>`. In this incident the guard
   FIRED: the lane had already re-flushed its own buffers and the tree held the content
   byte-for-byte. An unconditional restore would have clobbered a live session's own work while
   "recovering" it.
5. **The wider lesson, which cost two commits to learn:** I stated an inferred mechanism as
   observed fact, in a memory file and in a report, about an incident whose real evidence only
   ever supported "something briefly reverted these two files." Say what was observed; label the
   cause INFERRED; check whether the repo already recorded the opposite before asserting a new
   hazard class.

Related: [[shared-index-commit-race]], [[concurrent-lane-silent-edit-revert]],
[[minifold-tree-is-live]], [[agent-stash-incident-2026-07-14]],
[[git-checkout-discards-uncommitted-work]].
