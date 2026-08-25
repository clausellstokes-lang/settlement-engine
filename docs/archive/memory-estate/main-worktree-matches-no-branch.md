---
name: main-worktree-matches-no-branch
description: "⚠⚠ The main Desktop tree is on the ledger branch but its FILES match no branch — 4,537 differ from its own HEAD; only the private-index commit method is safe there"
metadata: 
  node_type: memory
  type: project
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T11:13:54.533Z
---

**MEASURED 2026-08-11.** `/Users/cstokes/Desktop/settlement-engine` is checked out on
`review-fixes-2026-07-08`, and its working files differ from **every** branch:
**4,537 from its own HEAD**, 4,538 from `claude/composite-r4`, 2,255 from `master` —
closest to master, identical to nothing. Cause and date unknown; it may have been true
for a long time, because a scoped `git status -- docs/RESUME_STATE.md` shows clean and
**nobody had run an unscoped `git status` in that tree.**

⚠⚠ **THE OPERATIONAL CONSEQUENCE: in the main tree, `git status` is NOT a safety check
and `git commit -a` would commit thousands of files.** The private-index method is what
makes ledger commits safe there and it is not optional:
`GIT_INDEX_FILE=$(mktemp) → git read-tree HEAD → git add -- <one explicit path> →
write-tree → commit-tree → update-ref` with a CAS old-value. Because it starts from
`read-tree HEAD`, it is **immune to whatever the default index holds** — verified: every
ledger commit this session lands exactly 1 file. ⚠ Always `git diff-tree --name-only -r
HEAD | wc -l` after committing there.

⚠ **THE DEFAULT INDEX WAS FULLY STAGED (~5,350 paths, matching the working tree exactly)
and the chair reset it to HEAD** — no content touched, reproducible with one `git add -A`,
but disclosed to the owner in OWNER_DECISION_QUEUE §13 rather than buried, since a
fully-staged index is one `git commit` away from a five-thousand-file commit.

⚠ A harmless EMPTY commit `333fbf49` sits on the ledger branch with the same message as
the real `1273d0e2` — a `git add` failed inside a `;`-chain that still ran `commit-tree`.
**Lesson: chain plumbing steps with `&&`, not `;`, or a failed `add` still commits.**
History was NOT rewritten to remove it — dropping a commit in a tree with possible
parallel sessions is not worth the tidiness.

⛔ **DO NOT "FIX" THE TREE.** Which of the 4,537 are real work versus stale checkout is an
owner call, recorded as OWNER_DECISION_QUEUE §13. The build worktree at
`.claude/worktrees/minifold` is clean and is where all real work happens.
Related: [[minifold-tree-is-live]], [[two-lane-commit-shared-index-race]],
[[git-checkout-discards-uncommitted-work]], [[shared-tree-git]].
