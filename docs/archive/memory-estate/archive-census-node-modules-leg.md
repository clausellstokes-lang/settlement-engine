---
name: archive-census-node-modules-leg
description: "⚠⚠ AN ARCHIVE CENSUS MUST SYMLINK THE WORKTREE'S OWN node_modules, NOT THE MAIN TREE'S: the main settlement-engine node_modules is MISSING `three` (a declared dependency) and `pg`, so a full `npm run test:ratchet` in an archive linked to it exits 1 on the SCOPE SENTINEL with two zero-test suites — a red indistinguishable from a real collection regression. The standing note that worktrees test against MAIN node_modules is FALSE for .claude/worktrees/minifold."
metadata: 
  node_type: memory
  type: project
  date: 2026-08-08
  commit: fd947d59
  branch: claude/composite-r4
  lane: S12-W2 orphan recovery
  tags: 
    - archive-census
    - apparatus-that-lies
    - fake-red
    - hazard
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-08T22:10:28.400Z
---

2026-08-08, measured during the S12-W2 orphan recovery (landed `fd947d59`).

## Why (the fake red, verbatim)

An integrity-counted `git archive` of a committed tree (6,196 tracked paths in, 6,196 files
out, `git status` clean), with `node_modules` symlinked to
`/Users/cstokes/Desktop/settlement-engine/node_modules`, ran the full
`npm run test:ratchet` and **exited 1**:

    [test-ratchet] SCOPE SENTINEL: the gate is no longer running what it was frozen to run
      — a pass here would be VACUOUS:
      2 suite(s) produced ZERO tests — they failed to COLLECT …
          tests/ui/townSceneCanvas.contract.test.jsx
          tests/security/customContentLockOrder.postgres.test.js

Run in isolation the two give `Failed to resolve import "three"` and
`Cannot find package 'pg'`. **Neither package is installed in the MAIN tree's
`node_modules`; both are present in `.claude/worktrees/minifold/node_modules`.** `three` is
a declared `dependencies` entry (0.185.1), so this is an incomplete install in the main
tree, not an optional-dep story. Re-pointing the symlink at the worktree's own copy —
**same committed bytes, nothing else changed** — gives `RATCHET_EXIT=0`.

## ⛔ The correction to standing guidance

The recorded note *"worktrees test against MAIN node_modules"* (from the npm-ci EUSAGE
walk-up hazard) is **FALSE for `.claude/worktrees/minifold`**, which carries its own
complete `node_modules` (dated 2026-08-04). Following it silently narrows the suite.

## How to apply

- Archive-census recipe: `ln -s /Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold/node_modules <archive>/node_modules`,
  then `printf 'node_modules\n' >> .git/info/exclude` so `git status` stays clean for the
  tests that shell out to git (`committedSecretsScan`, `edgeSharedBundleReproducibility`,
  `sovereigntyLightingContract`). Verify with `[ -e node_modules/three ]` before running.
- **THE TELL IS THE SIGNATURE, NOT THE MESSAGE.** A missing package produces a
  *zero-test suite* / scope-sentinel red, never an assertion diff — the same signature class
  as a heavy-test timeout (`STACK_TRACE_ERROR` with no diff). Any ratchet red whose evidence
  is "N suites produced zero tests" should be triaged as APPARATUS before code.
- This joins the family of pins poisoned by the measurement environment rather than the
  tree: see [[absolute-path-substring-pin-fake-red]] (an archive unpacked under a directory
  named `arch` fakes an architecture red) and
  [[test-timeout-flake-and-phantom-census-class]].

## Appended 2026-08-09 (F-S1 survey, M6 — the ES-5a repair round's operational ruling)

**BUILD SUITE ARCHIVES ONE AT A TIME AND DELETE BETWEEN.** 36 orphaned archive trees
accumulated to an ENOSPC that truncated a suite log to zero bytes — a silent false
receipt. Standing practice: one archive tree at a time; remove its node_modules SYMLINK
first, then the tree; a truncated/zero-byte log is DISCARDED and re-run, never quoted.

## CR-TRFZ-3 (chair, 2026-08-10): a `git init` archive FABRICATES introducedAt phantoms

⚠⚠ A re-freeze archive built by `git archive` + `git init` has ONE commit, so every
declared-overrun ledger's `introducedAt` sha "resolves to NO commit" — the 2026-08-10
re-freeze lane measured TWO phantom reds this way (domainAnyCastBaseline,
transcendentalMathBaseline), masked BEHIND the scope sentinel (the sequenced-census
hazard again). **Cure: give the archive real history — `git clone --local` (or
`--reference`) at the committed sha — never bare `git init`.** The node_modules
symlink leg and integrity count are unchanged; this adds the HISTORY leg.

## ⭐ 2026-08-11 — THE SYMLINK LEG IS SUPERSEDED WHENEVER ANOTHER LANE MAY BE RUNNING

`ln -s` makes the archive's vitest workers advertise the MAIN worktree's absolute path in
argv, so a sibling lane's `pkill -f "minifold/node_modules/vitest/dist/workers/forks.js"`
kills them — silently, mid-census, with the parent respawning and the run looking normal.
**Cure: `cp -Rc <worktree>/node_modules <archive>/node_modules`** — an APFS clone-file copy,
~14 s and near-zero disk for 426 MB, giving the archive its own path. Verify with
`ps -ax -o command= | grep -c 'minifold/node_modules/vitest'` → 0 for your own workers.
The completeness requirement is unchanged (the MAIN tree's node_modules still lacks
`three`/`pg`, so clone the WORKTREE's). See [[killed-worker-presents-as-skip-ceiling-red]]
for why the damage is invisible: a killed worker's tests serialise as `pending` and are
counted as SKIPS.
