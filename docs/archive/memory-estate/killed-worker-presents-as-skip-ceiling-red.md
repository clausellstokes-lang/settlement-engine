---
name: killed-worker-presents-as-skip-ceiling-red
description: "⚠⚠ A VITEST WORKER KILLED MID-CENSUS PRESENTS AS A SKIP-CEILING RED, NOT AS A SCOPE COLLAPSE: the json reporter serialises a test with NO RESULT as `pending`, and check-test-ratchet.mjs's NON_RUN_STATUSES counts `pending` as a SKIP — so 71 tests that never executed read as 71 new holes. The discriminator is in the same report: vitest's own `numPendingTests` counts only TRUE skips, and a never-ran suite has startTime === endTime === the run's startTime. Cause here was a sibling lane's `pkill -f minifold/node_modules/vitest/...` reaching an archive whose node_modules was a SYMLINK to the main worktree; cure is `cp -Rc` (APFS clone) so the archive's worker argv names its own path."
metadata: 
  node_type: memory
  type: hazard + apparatus
  created: 2026-08-11
  lane: TRFZ (test-census re-freeze)
  measured_at: 2a7fb033 (contaminated) vs c74048e4 (quiet)
  branch: claude/composite-r4
  tags: 
    - archive-census
    - apparatus-that-lies
    - fake-red
    - shared-tree
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T02:51:24.397Z
---

# A killed worker is invisible: it arrives as a SKIP, and the sentinel says the wrong thing

Measured 2026-08-11 during the CR-TRFZ-1/2/3 census re-freeze.

## What happened

A full `npm run test:ratchet:update` in an integrity-counted archive of `2a7fb033`
reported:

    skipped tests grew: 182 > ceiling 105

The honest skip population was **111**. The extra **71** were four files —
`tests/domain/historyBeats.test.js` (51), `tests/lib/accountData.test.js` (12),
`tests/simulation/seasonsMiniSoak.test.js` (5),
`tests/ui/settlementMapAnnotations.test.jsx` (3) — that **never executed**. All four
PASS in isolation (71/71, true exit 0) and passed in the previous full run.

A sibling lane had run `pkill -f "minifold/node_modules/vitest/dist/workers/forks.js"`
to clean up its own orphaned probe. The archive's `node_modules` was a **symlink** to
`/Users/.../worktrees/minifold/node_modules`, so this lane's workers advertised the
MAIN worktree's absolute path in argv and were killed by that pattern. The parent
respawned and the run completed looking normal.

## Why the signature is wrong, and why that is dangerous

Vitest's json reporter maps a task with **no result at all** to `status: 'pending'` —
the same string a deliberate `.skip` gets. `check-test-ratchet.mjs`'s
`NON_RUN_STATUSES = ['pending','skipped','todo']` therefore counts a test that NEVER
RAN as a skip. So a scope collapse (71 tests silently not executed) is reported by the
scope sentinel as *"a skipped test is not debt, it is a HOLE"* — pointing the reader at
a burn-down that does not exist, and inviting the exact wrong cure: raise the ceiling,
banking 71 non-executing tests.

⚠ `uncollectedOf()` does NOT catch it either: the suite reports `status: 'passed'` with
an empty message, because the file-level verdict is computed as "no failing row ⇒
passed". This is a THIRD member of the CR-TRFZ-4 family, and the one with no failed
suite anywhere to key on.

## The discriminators, both present in the same report

- **`report.numPendingTests`** counts only tasks whose MODE is skip/todo. In the
  contaminated run it read **111** while the row-derived count read **182**; in a clean
  run at `c74048e4` both read **111**. A mismatch between vitest's own tally and the
  row-derived skip count IS the tell.
- A never-ran suite carries `startTime === endTime === report.startTime` and every row
  `pending`. Zero such suites in the clean run; exactly four in the contaminated one.

## How to apply

- **Never build a census archive with a symlinked `node_modules` on a shared machine.**
  Use `cp -Rc <worktree>/node_modules <archive>/node_modules` — an APFS clone-file copy,
  ~14 s and near-zero disk for 426 MB — so every worker's argv names the ARCHIVE's own
  path. Verified: `ps -ax -o command= | grep -c 'minifold/node_modules/vitest'` → 0 for
  this lane's 7 workers. The [[archive-census-node-modules-leg]] recipe's symlink step is
  superseded by this whenever another lane may be running.
- **Before believing any skip-ceiling red, compare `numPendingTests` against the
  row-derived skip count.** They agree on a clean run. If they disagree, the difference
  is tests that did not execute, and the census is NOT census-grade — re-run, do not
  re-freeze.
- A sibling lane's cleanup command is a shared-tree hazard like any other. When
  `pkill -f` is used at all, the pattern must name something only the killer owns.

## Related

- [[archive-census-node-modules-leg]] — the symlink leg this amends, plus CR-TRFZ-3's
  `git clone --local` history leg.
- [[test-timeout-flake-and-phantom-census-class]] — the other "no assertion diff"
  signature class.
- [[gate-mutex-run-mode-absent-at-old-shas]] — the other way an archive run reports a
  verdict for work it never did.
