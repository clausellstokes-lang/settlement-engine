---
name: shared-index-staleness-blocks-osr-genesis
description: "⚠⚠ THE PRIVATE-INDEX PLUMBING PROTOCOL LEAVES THE SHARED INDEX STALE, AND A STALE ENTRY BLOCKS THE OSR GENESIS. `dirtyInputsFor()` in check-observed-shape-readers.mjs shells out to plain `git status --short` over src/ + the 11 governed detector paths, and `git status` reads the SHARED index — so an index entry left behind by a `commit-tree` landing reports `MM` on a file the WORKTREE and HEAD agree on, and `assertAuthoritativeSnapshot` throws 'observed-shape evidence requires clean committed inputs'. It bit twice in one session (2026-08-12): once inherited, once created by my own commit 1. CURE: surgical per-path `git update-index --cacheinfo 100644,$(git rev-parse HEAD:<path>),<path>` — never `git reset`, never `read-tree` over the whole shared index."
metadata:
  type: project
  date: 2026-08-12
  branch: claude/composite-r4
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-12T01:03:22.134Z
---

## Why it happens

The program's landing protocol is private-index plumbing (`GIT_INDEX_FILE=<scratch>`,
`read-tree HEAD` → `add` → `write-tree` → `commit-tree` → `update-ref` with CAS),
adopted because the SHARED index is hostile with two lanes. That protocol **never
updates the shared index**. So after any such landing, the shared index still holds the
blobs from before the commit, and `git status` in that worktree reports `MM` for every
landed path — index-vs-HEAD differs (stale), worktree-vs-index differs (worktree is
right).

Most gates do not care. **The OSR instrument does**, because `dirtyInputsFor()` is a
`git status --short --untracked-files=all -- src scripts/.observed-shape-readers-baseline.json <detector paths>`
and any non-empty output makes `assertAuthoritativeSnapshot` and
`assertStableSnapshot(..., {requireClean:true})` throw. `--scan-only` and `--write` both
refuse. The genesis is therefore unrunnable until the index is refreshed.

## How it presented (2026-08-12, the schema-6 mint)

1. **Inherited.** At session start the tree looked clean except `MM
   scripts/.observed-shape-readers-baseline.json`. `git diff HEAD -- <that path>` was
   EMPTY — the worktree matched HEAD exactly. Only the index was stale, holding the
   pre-`33487c77` baseline (frozen at `aed0fc0e`). Left alone it would have thrown at
   the genesis.
2. **Self-inflicted.** After landing commit 1 by plumbing, all EIGHT of my files went
   `MM` for the same reason, and three of them are governed detector paths — so
   `dirtyInputsFor()` returned three dirty lines and the genesis would have thrown
   again.

## The cure, and why this exact shape

```sh
git update-index --cacheinfo 100644,"$(git rev-parse HEAD:$p)","$p"    # one path at a time
```

- **Per path**, so no other lane's staged entry is touched. Audit first with
  `git diff --cached HEAD --name-status`; refresh only the paths you landed.
- **Not `git reset -- <path>`** — same effect, but `reset` is in the family CLAUDE.md
  forbids without explicit authority, and the wording invites a later lane to drop the
  pathspec.
- **Not `git read-tree HEAD`** on the shared index — that rewrites EVERY entry and would
  silently discard a sibling lane's staged work.
- **Preserve before you refresh.** `git cat-file -p <staged-blob> > <scratch>` and check
  whether the content is reachable in history (`git merge-base --is-ancestor`). In the
  inherited case it was the committed `aed0fc0e` baseline, so nothing unique was lost —
  but that must be VERIFIED, not assumed, because a stale index entry is
  indistinguishable from a sibling's deliberate staging until you look.

## The check to run before any OSR scan/write

Reproduce what the script sees, rather than trusting `git status` at a glance:

```js
execFileSync('git', ['status','--short','--untracked-files=all','--',
  'src','scripts/.observed-shape-readers-baseline.json', ...scannerToolFiles()])
```

Empty string = the genesis can run. Anything else = it will throw.
