---
name: two-lane-commit-shared-index-race
description: "⚠️⚠️ COMMITTING UNDER A CONTENDED SHARED INDEX (measured at ES-1, 2026-08-06): the OTHER lane's `git add` OVERWRITES your staged blob and `git commit` would land their work. `git add`+`git commit` is UNSAFE in a two-lane worktree. The safe recipe is PLUMBING: hash blobs from content you control, build a PRIVATE index (GIT_INDEX_FILE) from HEAD, write-tree, commit-tree, update-ref with the old-value guard. Also: HEAD moved TWICE mid-wave, and exact-census walkers must be re-measured against the ACTUAL PARENT, not the start HEAD. ⚠⚠ ADDENDUM 2026-08-12 (IN-1a, 803ebd48): a CREATED path committed this way leaves NO shared-index entry, so `git diff HEAD` reports a PHANTOM DELETION of the file you just landed — cure it in the SAME turn with `git update-index --add -- <path>` after proving the blob identical, then require `git diff HEAD` empty."
metadata: 
  node_type: memory
  type: project
  created: 2026-08-06
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-12T18:52:19.080Z
---

# Committing under a contended shared index

## What happened (ES-1, measured, not theorised)

Two build lanes shared one worktree. This lane prepared a 23-path commit, three of whose
files also carried the other lane's uncommitted hunks, and staged those three as
CONSTRUCTED BLOBS (`git hash-object -w` + `git update-index --cacheinfo`) so the commit
would carry only its own work. Between staging and committing:

1. **The other lane committed twice** — HEAD moved `d615171a` → `6a497bab` → `db35bad6`.
2. **The other lane ran `git add`**, which put THEIR content over MY constructed blob in
   the shared index. The staged blob for `couplingRegistry.js` silently changed from
   `be3ed8f5` (mine) to `219c6b4a` (theirs).
3. **They also staged three files of their own** into the shared index — so a plain
   `git commit` would have landed their in-flight IN-0d work under this wave's message.

The tell was a test failure inside the candidate tree: `GR3_TERM_FAMILY_COUPLINGS is not
iterable` — a symbol this lane had deliberately stripped, back in the blob it was about to
commit.

## The rule

**`git add` + `git commit` is not safe in a worktree another lane is using.** The index is
shared mutable state with no lock. Even `git commit -- <pathspec>` does not help: it
commits WORKING-TREE content for those paths, which re-imports the other lane's hunks.

## The safe recipe — plumbing, never porcelain

```
# 1. Hash every blob from content YOU control. Never read shas back out of the shared index.
#    - files only you touched: hash the working tree
#    - dual-lane files: hash a reconstruction = working tree MINUS the other lane's hunks,
#      rebuilt from the CURRENT working tree at the moment of the commit
git hash-object -w --path <repo-relative-path> <source-file>

# 2. Build a PRIVATE index from HEAD. The shared index is never written.
GIT_INDEX_FILE=/tmp/mine.index git read-tree HEAD
GIT_INDEX_FILE=/tmp/mine.index git update-index --add --cacheinfo 100644,<sha>,<path>

# 3. Write the tree and PROVE it changes exactly your path set.
tree=$(GIT_INDEX_FILE=/tmp/mine.index git write-tree)
git diff-tree -r --name-only HEAD $tree   # must equal your expected list, by name AND count

# 4. Materialise that exact tree and run the gates ON IT, not on the working tree.
git archive $tree | tar -x -C /tmp/candidate

# 5. Commit and move the ref with a compare-and-swap on the old value.
commit=$(git commit-tree $tree -p $(git rev-parse HEAD) -F msg.txt)
git update-ref -m "<subject>" refs/heads/<branch> $commit <old-sha>

# 6. Afterwards, return the shared index to neutral for YOUR paths only:
git update-index --cacheinfo 100644,$(git rev-parse HEAD:<path>),<path>
```

`update-ref` with the old value is the compare-and-swap: if the other lane commits between
step 3 and step 5, it REFUSES instead of clobbering.

## Consequences that bite

- **The pre-commit hook does not run.** `commit-tree` bypasses husky. That is the POINT
  here, not a defect: `lint-staged` STASHES when a file is partially staged, and a stash
  cycle over another lane's uncommitted work is exactly the destruction the two-lane rules
  forbid. Run the hook's job yourself instead (`npx eslint` over the exact staged content)
  and quote the exit code.
- **Exact-census walkers must be re-measured against the ACTUAL PARENT.** Anything counting
  the tree (`sovereigntyLightingContract.walker.test.js`'s five figures) changes every time
  the other lane lands a file. ES-1 measured it three times — against `d615171a`, then
  `6a497bab`, then `db35bad6` — and only the last is the number a checkout of the commit
  reproduces. Re-measure LAST, immediately before `write-tree`.
- **Verify the dual-lane reconstructions against the CURRENT HEAD**, not the start HEAD:
  if the other lane committed one of them, your reconstruction would discard their commit.
  `diff <(git show <startHEAD>:path) <(git show HEAD:path)` before trusting a blob.
- **After the commit, prove the other lane's work survived**: their modified-file list, the
  count of their symbols in the shared files, and their untracked files.

## ⚠⚠ ADDENDUM, measured 2026-08-12 at the IN-1a promotion (`803ebd48`): A **NEW FILE**
## COMMITTED BY PLUMBING LEAVES A PHANTOM DELETION IN `git diff HEAD`

Step 6 above ("return the shared index to neutral for YOUR paths only") is written for
MODIFIED paths, and skipping it on those is benign — the index keeps an old blob, the
worktree matches the new HEAD, and `git diff HEAD` stays empty, which is the estate's real
safety check. **A CREATED path behaves differently and the difference is dangerous.**

The shared index has **no entry at all** for a file the private index created. After the
CAS the file is in HEAD, so git reads the missing index entry as a **staged deletion**:
porcelain shows `D ` plus a `??` for the same path, and — the part that bites —
**`git diff HEAD --stat` reports the whole file as deletions.** At IN-1a that read as
`IN-1A.md | 1248 --------` one command after committing it. The estate's own documented
diagnostic ("the porcelain lies, prove it with `git diff HEAD`") therefore FIRES FALSELY on
your own new packet, and the next lane's honest reading of it is that someone deleted the
file.

**The cure is one surgical command, and it must run in the same turn as the CAS:**

```sh
# prove the worktree file is byte-identical to what you just committed, THEN refresh
[ "$(git rev-parse HEAD:<path>)" = "$(git hash-object <path>)" ] \
  && git update-index --add -- <path>
```

⛔ **Refresh only the CREATED paths, by name.** Never `git add -A`/`-u`/`.`, and leave the
modified paths' residue alone — rewriting more of a contended index buys nothing and risks
the race this file exists to prevent. Verify by re-running `git diff HEAD --stat` and
requiring it EMPTY before ending the turn.

## How to apply

Before any commit in a worktree with a second lane: assume the index is hostile, build the
tree yourself, prove the path set by name and count, gate the materialised tree, and CAS
the ref. Porcelain is for trees you own alone. **If the commit CREATED a file, finish with
the addendum's `git update-index --add` and prove `git diff HEAD` empty** — otherwise you
hand the next lane a phantom deletion of the very thing you landed.
