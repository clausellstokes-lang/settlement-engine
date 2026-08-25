---
name: ""
metadata: 
  node_type: memory
  date: 2026-08-07
  commit: 90deb182
  branch: claude/composite-r4
  lane: ratchet repair (R-1/R-2/R-3)
  tags: 
    - ratchet
    - mutation-manifest
    - lighting-census
    - shared-index
    - enforcement-claims
    - hazard
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-07T11:02:00.388Z
---

# Ratchet repair 2026-08-07 — four hazards, each measured

Landed at **90deb182** (parent a223d368). Three assigned ratchets; one was already
cured by the concurrent lane, and two NEW defects surfaced during the repair.

## ⚠⚠ 1. A SEQUENCED MULTI-FIGURE CENSUS STOPS MEASURING WHEN ITS FIRST FIGURE REDS

`tests/lint/sovereigntyLightingContract.walker.test.js` asserts FIVE figures
(`files, parked, credited, titles, suiteTitles`) **in sequence, `files` first**. It has
been red on `files` (2350 vs frozen 2346) since 9ecec2a2, so vitest stops at assertion
one and **the other four are never evaluated at all**. While the file count is off, the
remaining four can drift by any amount and nothing reports it.

**How to apply:** this is the mechanism behind the recorded *a RED ratchet's contents
grow INVISIBLY* hazard — not just "red ratchets don't protect", but "a sequenced ratchet
stops taking measurements". Whoever re-records MUST re-derive all five and must NOT
assume the four unasserted ones still sit at their frozen values. When authoring a
multi-figure census, collect all deltas and assert once, or the first red blinds the rest.

## ⚠⚠ 2. A PLUMBING COMMIT LEAVES THE SHARED INDEX STALE — AND THAT STAGES A REVERSAL

The recorded two-lane recipe (private `GIT_INDEX_FILE` → `write-tree` → `commit-tree` →
`update-ref` CAS) correctly avoids the shared-index race, but it has a **missing final
step**. After the commit, `git status` showed `MM` on all three files: HEAD had advanced,
the SHARED index still held the OLD pre-change blobs. A later `git add`/commit in that
shared index would have staged and landed a **REVERSAL** of the just-committed change.

**Cure, verified:** after the plumbing commit, refresh only your own paths in the shared
index — `git reset -q HEAD -- <your explicit pathspecs>` (index-only; leaves the worktree
untouched). First check `git diff --cached --name-status HEAD` across ALL paths: if it
lists anything you did not author, do NOT reset broadly — the other lane has work staged.
In this instance it listed exactly the 3 authored files, so the targeted reset was safe
and `git status` went fully clean.

## ⚠ 3. THE MANIFEST'S `kind:'mutation'` REQUIRES A SWEEP-SCRIPT LABEL — IN-FILE MUTANTS ARE `rationale`

`scripts/mutation-coverage-manifest.json` entries of `kind:'mutation'` must carry a label
that JOINS to a `check_caught*` label in `scripts/mutation-sweep.sh`. A test whose mutants
live **inside its own body** (injected fixtures, tmpdir-written fakes) cannot use
`kind:'mutation'` — doing so reds the LABEL JOIN arm as *phantom coverage*, trading one
red for another. The correct entry is `kind:'rationale'`, and the estate already has the
exact shared reason: **`ref:'self-proving-meta'`**.

Applied to `tests/lint/fullTypecheckRatchet.test.js` (invariant file landed at a9691e73
with NO manifest row → TOTALITY red). Its sibling `domainStrictFailClosed.test.js` already
carried that ref. Also: because every fixture is written into an `mkdtempSync` dir, the
test mutates NO repo file, so **no `MUTATED_FILES` row is owed either**.

Measured correction: the brief said "8 script mutants"; the file actually executes **20**
guard cases across four families. Count from the file, never from the brief.

## ⚠ 4. `enforcement-claims` CLAIM_RE FALSE-POSITIVES ON ANY "<digit>0 problems"

`tests/docs/enforcement-claims.test.js` is **RED at HEAD** (pre-existing, proven in an
integrity-counted archive of 173e9d7b) with 5 "naked claims" — and **3 of the 5 are regex
false positives**. `CLAIM_RE` contains the bare alternative `0 problems`, which matches
inside `"30 problems"`. Executed: `/0 problems/.test('30 problems / 3 errors') === true`.
Cure: a non-digit guard, e.g. `(?<![0-9])0 problems`. The 2 remaining hits
("machine-enforced") look genuine. NOT fixed — outside the lane, shared docs, two lanes live.

**Related gap, same finding:** that meta-pin's corpus is root `*.md` + `docs/**/*.md` +
`eslint.config.js`. It does **NOT** scan `.github/workflows/**` — which is exactly why a
false `"The tree currently lints clean (0 problems)"` claim survived in `ci.yml`. Widening
the corpus needs YAML comment support (`#`) in its `isCommentLine`; proposed, not taken.

## The R-3 attribution correction (measured per sha, off committed objects)

1d3cdf73's receipt blamed its parent's +3 on "the concurrent lane's three TCD test pins".
Wrong. `git ls-tree -r <sha> | grep -cE '^tests/.*\.test\.(js|jsx)$'`:

    1977db07 2346 frozen · 9ecec2a2 2347 TCD-1 +1 · a9691e73 2348 GATE LANE +1
    b19038ec 2349 TCD-2 +1 · 3800bcb6 2349 TCD-3 +0 · 1d3cdf73 2350 SP-F +1

**TCD-3 added ZERO; the gate lane added ONE and never said so.** Correction written into
the walker's own census block (a commit message cannot be edited; that block is where the
next re-recorder looks).

**RULING: the re-record stays DEFERRED** — documented, not a bug to re-find. SP-F's reason
still holds and is now stronger: HEAD moved 173e9d7b → a223d368 *mid-round* and that commit
edited two files under `tests/`. The figures survived (measured: still 2350, no new
`it(`/`test(`/`describe(`), but a lane editing test files is one `it(…)` from moving
`titles` without moving `files` — the exact drift hazard #1 keeps invisible. Re-record only
when BOTH lanes have landed and the tree is clean, in ONE commit, all five figures
re-derived inside an integrity-counted archive of the sha being frozen.
