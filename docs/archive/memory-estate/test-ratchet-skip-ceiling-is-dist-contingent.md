---
name: test-ratchet-skip-ceiling-is-dist-contingent
description: "⚠⚠ `test:ratchet:update` LOCKS IN a skip ceiling measured in WHATEVER environment you ran it in, and a stale `dist/` silently lowers it by exactly 50 — 24 `describe.runIf(distExists)` build suites. Measured 111 (dist-free, canonical) vs 61 (dist present). Step 12 runs BEFORE `build`, so the canonical measurement is DIST-FREE; park `dist` before any re-freeze."
metadata:
  node_type: memory
  type: project
  created: 2026-08-11
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-11T04:25:40.107Z
---

# The skip ceiling is an ENVIRONMENT reading, and `--update` freezes it silently

Measured 2026-08-11 at `46357c94` while closing the census re-freeze.

## What happened

`npm run test:ratchet:update` writes
`skippedCeiling: Math.min(baseline.skippedCeiling ?? skipped.length, skipped.length)`.
Run in a worktree that happened to hold a **stale built `dist/`**, it wrote **61**,
ratcheting down from the Fable-approved **111** and reporting nothing unusual — the
run was green and the figure looked like an honest win.

**It was not a win. It was a measurement artifact, and it would have RED the gate.**

## The mechanism, measured exactly

**24 files in `tests/build/` gate on `describe.runIf(distExists)`** (e.g.
`engineChunkLazy.test.js:46,55`, `distExists = existsSync(distDir) &&
existsSync(assetsDir)`). With `dist/` present those suites RUN; without it they SKIP.

Same subtree, same commit, two runs — `dist` parked with `mv` and restored immediately
(it is untracked and gitignored, so this is safe):

| environment | tests/build total | skipped |
|---|---|---|
| WITH `dist/` | 396 | 60 |
| WITHOUT `dist/` | 396 | 110 |

**Delta exactly +50**, and 61 + 50 = **111** — the previously approved figure, to the
unit. The arithmetic closing on the nose is what promoted this from suspicion to cause.

## ⚠⚠ Why 111 is the canonical figure, not 61

The ceiling is an UPPER bound, so it must be measured in the environment that produces
the MOST skips. In `npm run check` the ratchet step runs **BEFORE `build`**, so a clean
checkout has no `dist/` — the dist-free reading is canonical. A ceiling of 111 passes in
both environments; **61 passes only where a stale `dist/` happens to exist**, and would
red every CI run and every fresh clone.

## How to apply

**Before any `test:ratchet:update`, park `dist/`** (`mv dist <scratch>/`, restore
straight after) so the freeze is taken dist-free. If the ceiling comes back materially
LOWER than the approved figure, do not bank it — check `dist/` first.
⭐ And note `min()` means the fix is not a re-run: the lowered figure is now the
baseline, so a corrected re-run must START from the pre-update baseline file. Restore
it, park `dist`, then re-run — the whole header is then written mechanically with no
hand-edited figure.

⚠ The same class applies to any ratchet whose ceiling is a COUNT taken from a live run:
the number encodes the machine as much as the code.

Related: [[step12-test-ratchet-landed]] · [[test-ratchet-scope-collapse-sentinel]] ·
[[dirty-tree-build-artifact-class]] · [[receipt-vacuity-and-shared-ratchet-rules]].
