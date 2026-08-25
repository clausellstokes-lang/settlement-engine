---
name: trfz4-load-throw-classification-measured
description: "⭐⭐ CR-TRFZ-4 CLOSED + MEASURED (Opus schema-4 lane, 2026-08-10, LANDED unstaged at b52223d7): a suite whose `beforeAll` THROWS reports suite.status='failed' while enumerating every test as 'skipped', so N tests drain into the SKIP CEILING and numFailedTests reads 0 — `uncollectedOf` only caught zero-length assertionResults; ⚠⚠ THE SUITE MESSAGE IS **EMPTY** ON EXACTLY THAT CASE, so a message-keyed guard fails OPEN on its own motivating instance — the only sound discriminator is status==='failed' AND no assertionResult is 'failed'"
metadata:
  type: project
  date: 2026-08-10
  branch: claude/composite-r4
  originSessionId: 0e891b2f-8f5a-4f56-bc66-d7add755cac2
  modified: 2026-08-10T23:53:42.835Z
---

## The measured truth table (vitest 4.1.8, isolated 6-case probe, executed)

Built four throwaway suites in a temp root with the worktree's own `node_modules`
symlinked, ran `npx vitest run --reporter=json`, and read the emitted report.

| case | `suite.status` | `suite.message` | assertionResults | any row `failed` |
|---|---|---|---|---|
| module-load throw | `failed` | NON-EMPTY | **0** | no |
| ⚠ **`beforeAll` throw** | `failed` | **`""` EMPTY** | **2, BOTH `skipped`** | no |
| `afterAll` throw | `failed` | non-empty | 1 `passed` | no |
| `describe.skip` | `passed` | `""` | 2 `skipped` | no |
| `test.todo` + `test.skip` | `passed` | `""` | 2 | no |
| one genuinely failing test | `failed` | `""` | 1 `failed` + 1 `skipped` | YES |

`numFailedTests` reads **0** for the `beforeAll` case. The top-level counters lie too.

## Why the obvious fix is wrong

The tempting discriminator is "the suite reported a message". It is **EMPTY on the
`beforeAll` row** — the exact case CR-TRFZ-4 exists for — while being non-empty on
the module-load case the old code already caught. So a message-keyed guard looks
correct against the case that was never broken and fails open on the one that was.

## The cure (landed, unstaged, `scripts/check-test-ratchet.mjs`)

`uncollectedOf` now returns a suite when `assertionResults.length === 0` **OR**
`status === 'failed' && !results.some(a => a.status === 'failed')`. The three
legitimate rows above report `status: 'passed'` or carry a failing row, so none is
caught. Message wording moved to `FAILED WITHOUT A MEASURABLE TEST`.

MUTANT EXECUTED: reverting the filter to `length === 0` kills exactly the 3 new pins
(61 → 58 passed, 3 failed) and leaves the negative control green; restored
byte-identical (sha256 `2968f4fa…`) and re-ran 61/61.

## ⚠⚠ It cannot land alone — it reds the gate through the OSR walker

`tests/lint/observedShapeReaders.walker.test.js` builds its corpus in a `beforeAll`
and scans the estate with the EXACT scanner **without** `excludedReadScopes`, so it
hits the CR-OSR-SCOPE-1 UI wall (`16385 > 16384`) and produces exactly this shape:
24 tests, all `skipped`. Under the cure it becomes an UNCOLLECTED suite, and
`scripts/.test-ratchet-baseline.json` has `uncollectedSuites: {}` with
`testRatchet.test.js` pinning the allowlist `toBeLessThanOrEqual(0)` **and** a
by-name test refusing to baseline that walker. So CR-TRFZ-4 must land in the SAME
commit as the walker's heuristic rewire, which needs the schema-4 genesis.

Related: [[osr-schema4-mint-sizing-and-blockers]] · [[test-census-ceiling-forecloses-new-rows]] ·
[[step12-test-ratchet-landed]] · [[test-timeout-flake-and-phantom-census-class]].
