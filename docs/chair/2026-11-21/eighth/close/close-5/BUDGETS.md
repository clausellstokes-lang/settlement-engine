# THE BUDGET COMMIT'S LIST, ON PAPER (CLOSE-5; the chair's Q2: the first commit on the flip branch, before the dials, test only; written 2026-11-23 04:12 UTC, read from `date -u`)

THE SOURCE: the final census's four slow tables (`close-2/census/final/{gen,domain,ui,rest}-slow.tsv` on `lane/close-2-2026-11-22`,
section "OVER 8000 MS"): 244 rows over 8,000 ms lit (parts 1, 2, 5, 6; the census report counted parts 1 and 2 only).
Its heuristic marked 161 "own", 35 "none", 48 "NEEDS-READ". EVERY ROW WAS RE-READ, not by the heuristic: `close-5/budgets.mjs`
parses each file at the stack tip cb598376f (`@babel/parser`), finds the `it`/`test` by its whole describe chain (template
parts as wildcards, the most literal match taken), and reads the budget in force (its own number or `{ timeout }`, else
its describe's, else a file-level `vi.setConfig`, else the default 20,000 of `vite.config.js :: test.testTimeout`). The
20 rows it found on the default were then READ BY HAND at their `it`: two carry a budget the parser missed (an `.each`
title with `$id` / `%s`: `generationDialMetamorphic` 30_000, `fullDocByteRender` 60_000). The named budgets (`SLOW`
300_000 in three files, `ENGINE_TIMEOUT` 180_000, `ARM_TIMEOUT` 1_800_000) were read at their declarations.

THE RULE (CI-FIT point 75, as point 105 applied it): a runner's figure is the measured figure x 1.84; a test qualifies
when that passes three quarters of the budget in force. CAVEAT: the census's figures come from a run at `--maxWorkers=3`,
not from a serial run of the file as point 105's did: they are high, so the list is wide, never narrow.

## A. THE COMMIT: 14 tests on the default 20 s, in 13 files (each passes 15 s on a runner)
Each takes the budget in the last column, with its measured figure in a comment in point 105's form ("its own budget,
carrying the measured figure (CI-FIT-3, CLOSE-5, <date>): <x> s lit in the final census at c1128c8f6; about <y> s on a
CI runner (the measured factor), over three quarters of the default 20 s"). Nothing else moves: no assertion, no sample,
no seed. `factionPowerSum` is one `it` in a loop over the tiers: its budget covers all six. Re-read at the flip's base
before the commit (the files may move by then); `tests/lint` whole after.

| test (at cb598376f) | title (cut) | lit | on a runner | budget proposed |
|---|---|---|---|---|
| `tests/domain/factionPowerSum.test.js :: line 20` | faction power sums to exactly 100 across all tiers metropolis: every non-empty faction roster sums to 100 | 10.2 s | 18.8 s | 120_000 (point 105's figure) |
| `tests/domain/recordInvariants.test.js :: line 203` | EM-R0b — recordInvariants: the town's own invariants as a module EM-R0b A1 — the control over the declared | 10.4 s | 19.1 s | 120_000 (point 105's figure) |
| `tests/generators/urbanBandInstitutions.test.js :: line 107` | G2 — the row guards hold at generation no town has gates without walls, and gated towns exist | 10.5 s | 19.3 s | 120_000 (the file's own) |
| `tests/domain/generalStateProseDesk.test.js :: line 1829` | DS-GEN-8 — the remnant, the fallen city and the steadings (a lawful DARK mount) ⛔ DORMANT AT BIRTH, AND DO | 11.6 s | 21.3 s | 120_000 (the file's own) |
| `tests/domain/defenseStateProseDesk.test.js :: line 1910` | DS-DEF-9 — magic dependency, and the slot filled from the right ROLE REACHABILITY, MEASURED OVER GENERATED W | 12.9 s | 23.7 s | 120_000 (point 105's figure) |
| `tests/generators/powerEconomyFreshness.test.js :: line 293` | bounded final economy -> power reconciliation the final fingerprint and legitimacy match final dossier inputs  | 8.2 s | 15.1 s | 180_000 (the file's own) |
| `tests/generators/legitimacyDefenseReconcile.test.js :: line 42` | [generators-pipeline-6] faction powers agree with the patched legitimacy multipliers every settlement is self- | 8.3 s | 15.2 s | 120_000 (point 105's figure) |
| `tests/generators/categoryToggleRandomCustom.test.js :: line 32` | [generators-pipeline-4] category disables reach generation for random and custom settTypes random settType: al | 8.4 s | 15.4 s | 120_000 (point 105's figure) |
| `tests/generators/generationWorldLaw.test.js :: line 327` | full-pipeline world-law enforcement holds across every tier and a deterministic seed corpus | 8.7 s | 16.0 s | 120_000 (point 105's figure) |
| `tests/generators/settlementOriginProse.test.js :: line 386` | RR — the REAL pipeline, not only the pool module pin:corpus-diversity — 60 seeds on the DEFAULT config no  | 8.7 s | 16.1 s | 120_000 (the file's own) |
| `tests/generators/generationWorldLaw.test.js :: line 369` | full-pipeline world-law enforcement never gives a riverside port maritime-only institutions | 8.9 s | 16.4 s | 120_000 (point 105's figure) |
| `tests/domain/fortuneLastingVeil.test.js :: line 131` | U7 step 1: history.age is served unchanged on every shared read, the widest veil included on all eleven shared | 9.1 s | 16.7 s | 240_000 (the file's `TIMEOUT`) |
| `tests/generators/projectionAgreement.test.js :: line 304` | the reviewer's seeds agree every reviewer seed: resource_truth and food_verdict hold no finding | 9.2 s | 17.0 s | 120_000 (the file's own) |
| `tests/domain/recordMerge.test.js :: line 102` | EM-R0c — the merge: the consequence of an edit is the difference of two re-derivations A1 · identity and th | 9.4 s | 17.2 s | 120_000 (point 105's figure) |

## B. FOR THE CHAIR, OUTSIDE E123's LETTER (they carry a budget of their own): 12 tests past three quarters of it by the same rule
Two pass the budget itself on a runner by this arithmetic: `tests/generators/metropolisTailedRoll.test.js` (171.5 s lit,
about 315.5 s on a runner, budget 300_000) and `tests/property/espionageDormancyFence.test.js` "FENCE 1 (REPLACED) …"
(65.4 s, about 120.3 s, budget 120_000). The other ten sit between 75% and 100% (`defenceMonotoneMade` 379 s / 900_000;
`mergeLadderHeldKeys` EM-R8 232 s / 540_000; `livingContentPromiseBytes` twice, 222 s / 480_000 and 130 s / 300_000;
`generationForkCensus` 177 s / 360_000; `timelineVariety` 59 s / 120_000; `pipeline.property` 53 s / 120_000;
`magicBufferIntegration` 52 s / 120_000; `historyNoUndefinedProse` 27 s / 60_000; `joins/ordering` 25 s / 60_000).
None timed out in the census (0 TIMEOUTS in every part) and CI's whole runs on the line read no timeout of them. The
seat's lean: not in the commit unless CI's run on the pushed flip branch shows one; the two over the line named to the
chair now. The whole table: `close-5/BUDGETS.tsv` (part, file, lit ms, the heuristic's mark, the budget's source, the
budget, the line, the title).

## C. THE CHAIR'S RULING ON SECTION B (its message of 2026-11-23 04:17 UTC; recorded 2026-11-23 04:18 UTC, read from `date -u`)
"NOT BY A GUESS IN EITHER DIRECTION." In the Q8 trial the two near their budgets are measured ALONE, one at a time, lit:
`metropolisTailedRoll` and `espionageDormancyFence` FENCE 1 (`close-5/trial.sh`, its last two parts, `--maxWorkers=1`). If a
lone lit time x 1.84 passes NINE TENTHS of its budget (270 s of 300_000; 108 s of 120_000), its budget is raised in commit 0
with that measure in a comment; if not, it is left and the measure is written here. The other ten of section B are left
unless the trial shows one over three quarters when run alone. (Measures: owed by the trial.)
