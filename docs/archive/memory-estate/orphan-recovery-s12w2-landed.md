---
name: orphan-recovery-s12w2-landed
description: "⭐⭐ THE S12-W2 ORPHAN IS LANDED at fd947d59 — eight files from a credit-killed lane, all eight LAND after independent re-verification; the census went 35→30 and every removed row's debt is relocated to an in-file ledger PROVEN by six source-tree plants. ⚠⚠ THE RECOVERY LESSON: this was recoverable only because the lane was DONE-but-uncommitted; a census that REMOVES rows before the relocation lands is a disabled guard with no report — remove the row LAST."
metadata: 
  node_type: memory
  type: project
  date: 2026-08-08
  commit: fd947d59
  branch: claude/composite-r4
  lane: S12-W2 orphan recovery (Opus implement + verify)
  tags: 
    - orphan-recovery
    - walker-census-law
    - declared-overruns
    - ratchet
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-08T22:10:58.440Z
---

2026-08-08. Landed **`fd947d59`**, parent `abc5a78b`, committed by PLUMBING with a CAS on
`refs/heads/claude/composite-r4`. Supersedes the "architected, not committed" state of the
S12-W2 section in [[walker-census-law-machinery]] — **that section's landed figures are now
true of the tree.**

## What was recovered

A lane was killed mid-task by the weekly credit limit leaving **eight files uncommitted and
no report**. Disposition after independent re-verification: **all eight LAND** — the lane
had finished its work and died before committing, not during editing.

`CONTRIBUTING.md` · `docs/FABLE_VALIDATION_QUEUE.md` · `scripts/.test-ratchet-baseline.json`
(+0/−40) · `tests/domain/roadsParticipation.test.js` ·
`tests/lint/{domainAnyCastBaseline,transcendentalMathBaseline,testRatchet,sovereigntyLightingContract.walker}.test.js`

## ⚠⚠ THE RECOVERY LESSON, STATED AS A RULE

The frightening number was the census at **+0/−40 — five rows REMOVED**. A census that
removes rows *before* the walker-inventory relocation lands leaves **the guards off AND the
census silent about it**, which is strictly worse than the state it started from, and a dead
lane files no report saying which half happened. **Order the commits: relocate first, remove
the census row last.** Here both halves were present, but that was luck of timing.

## How the coherence was established (reusable)

1. Private `GIT_INDEX_FILE` → `git read-tree HEAD` → `git add --` **only the orphan paths** →
   `git write-tree`. The shared index is never written and the owner's dirty files cannot
   leak in. `git diff-tree -r --name-only HEAD $TREE` proves the delta **by name and count**.
2. `git archive $TREE` → integrity count (6,196 in / 6,196 out) → `git init` + commit →
   `node_modules` symlink + `.git/info/exclude`. Everything measured there, never live.
3. **Six plants, all in the SOURCE tree** (an in-file mutant is self-proving), each reverted
   `git status`-clean. New any-hole in an UNDECLARED file → 3 arms red. One more hole in the
   DECLARED `commercialReasons.js` → the exactness arm reds *"declared 31, MEASURED 32 … that
   is a REGRESSION"*. New `Math.pow` → 3 red. Eighth `.npcs` reader → census arm. A quarantine
   row that reads nothing → honesty arm (the un-banked shrink). A walker row put BACK into the
   census → the law pin, naming the plant. Plus: **deleting the A4 arm reds 2 of 58**, so the
   classifier cannot be quietly removed.
4. Full `npm run test:ratchet` in the archive: **exit 0**, *"no regressions, and 6 baselined
   test(s) no longer fail (24 < 30). RATCHET DOWN."* — reproducing the dead lane's claim from
   a tree this lane built itself. **The 6 are still NOT banked** (chair's call).

## Facts worth keeping

- **`introducedAt` is attested by SHAPE, not EXISTENCE.** Both new `DECLARED_OVERRUNS`
  ledgers accept any 40-hex string. All six shas were resolved BY HAND and every subject line
  matched its stated cause. A `git cat-file -e` arm would close this for one shell-out a row.
- The census header needs no update on a row removal: `totalTests` feeds only a **scope
  FLOOR**, not an equality, and `measuredAtSha` is checked for 40-hex shape only. Its being
  unchanged (`36e50c73`) is in fact the **proof that no `--update` ran** — the standing
  prohibition on re-freezing `domainAnyCastBaseline` held, and `commercialReasons.js`'s 31
  holes were not banked.
- ⛔ **STOP-S12W-1 still binds** — `spatialLedgerCoverage.walker`'s row waits on the owner
  committing `src/lib/spatialUsage.js`. The four owner files were verified byte-identical to
  the pre-lane backup after the commit.
- New hazard minted on the way: [[archive-census-node-modules-leg]].

## Open, owed to Fable

Queue row `S12-W2-R` at the live tail of `docs/FABLE_VALIDATION_QUEUE.md`, marked
**⏳ OPUS-ERA — FABLE SURVEY OWED**; the dead lane's own `S12-W2` account is preserved
verbatim above it. Its four re-examine items plus two of this lane's remain open: the
`git cat-file -e` attribution arm, and whether a lane removing census rows is owed a
commit-ordering rule.
