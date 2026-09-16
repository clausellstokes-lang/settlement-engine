---
name: osr-reader-deletion-forces-two-commits
description: ⚠️⚠️ Deleting a reader-without-a-writer reds the OSR walker with `stale: N` and needs a SECOND commit — and the `--write` re-freeze is blocked by ANY lane's dirty src/
metadata:
  node_type: memory
  type: project
  originSessionId: c42c8924-7331-45ab-a096-c5f1bc35f7d3
  modified: 2026-08-11T23:23:51.258Z
---

Measured on 2026-08-11 by the census micro-act batch (Lane T), while curing H9
(`recentEvents on settlement`, deleted at both reader sites).

## The mechanic

`tests/lint/observedShapeReaders.walker.test.js` compares the LIVE scan against
`scripts/.observed-shape-readers-baseline.json` with **exact equality in both
directions**: `expect({violations, stale}).toEqual({violations: 0, stale: 0})`.

So **curing a reader-without-a-writer REDS the walker.** Deleting the read makes
its frozen row `stale`, and a shrink is only banked by a `--write` re-freeze.

There are **two independent pins**, and a deletion moves different ones:

1. **The frozen inventory** (`stale: N`) — cured ONLY by
   `node scripts/check-observed-shape-readers.mjs --write`.
2. **The UNREVIEWED-UI cohort pins**, hard-coded in the walker and measured
   against the LIVE scan, so they must be edited **in the same commit as the
   source deletion** or the walker reds for a second, unrelated reason. Both
   readings are pinned side by side and both move:
   `cohortOf(inventoryOf(live.findings))` and `cohortOf(inventoryOf(live.raw.findings))`.
   The cohort is exactly `src/components/` (`EXACT_SCAN_EXCLUDED_SCOPE`), so a
   deletion OUTSIDE `src/components/` moves the frozen inventory but NOT the
   cohort pins. Measured this pass: one identity deleted in
   `components/OutputContainer.jsx` moved filtered 51/128/193 → 51/127/192 and
   raw 53/150/246 → 53/149/245, while the identical deletion in
   `store/aiChronicleContext.js` moved neither.

## ⚠⚠ Why it is TWO commits, and what blocks the second

`--write` binds to clean HEAD, so it cannot run from the dirty tree that holds
the fix. The sequence is forced: commit the source deletion, then re-freeze from
the now-clean tree, then commit the baseline. This is the same "the frozen
inventory's matching rows are deleted by the `--write` re-freeze, which only runs
from a committed tree" note the walker's own comment chain already records three
times over.

**⛔ THE BLOCKER THAT IS EASY TO MISS: `dirtyInputsFor()` checks `git status
--short --untracked-files=all -- src <baseline> <scanner files>` — ALL of `src`,
not just your files.** So *any* concurrent lane's uncommitted work under `src/`
blocks your re-freeze. It blocked this one (a sibling's
`src/generators/factionRoles.js`). A second worktree is NOT the escape: the
program's concurrency law refuses one.

**⚠ The stale rows red any FULL GATE run for every lane** until the re-freeze
lands, so a lane that owns the gate deliverable that beat will see your red.
Say so in the handoff.

## How to apply

- Before deleting a guarded read, grep
  `scripts/.observed-shape-readers-baseline.json` for the file. If it has a row,
  budget a second commit and check whether the path is under `src/components/`
  (cohort pins move) or not.
- **ADDING reads is the cheap direction and can be free**: spell a new receiver
  the way an already-clean sibling spells it (a call-result local like
  `const c = s.getCampaignForSettlement(id); c?.worldState`) — the name prior
  does not ground it, so it yields no finding. Confirmed this pass: the CR-S6-6
  repair added reads and measured `violations: 0`.
- Verify with `sh scripts/gate-mutex.sh --run -- npx vitest run
  tests/lint/observedShapeReaders.walker.test.js` (~70–77 s, corpus executes fresh).
