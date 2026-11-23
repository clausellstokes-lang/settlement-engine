READS WHOLE: `FLIP-COMMON.md`, this file, `close-5/BUDGETS.md`, and each of the 15 test files below. WINDOW: 1,000,000 tokens.

# F0 — THE BUDGETS (the flip branch's FIRST commit, before the dials; test only; written 2026-11-23 05:15 UTC)
THE ROWS: `close-5/BUDGETS.md` section A (14 tests in 13 files, each on the default 20 s) and section C (two raised:
`tests/generators/metropolisTailedRoll.test.js` "400 metropolis seeds …" 300_000 -> 600_000; `tests/property/espionageDormancyFence.test.js`
FENCE 1 "THE DRIVEN GOLDEN …" 120_000 -> 240_000). 16 budgets in 15 files. Find each `it`/`test` by its title, not by the line
the table gives. Each takes the budget in the table, with a comment in CI-FIT point 75's form, as point 105 wrote it (commit
89041ef67, `tests/domain/distribution.test.js`): "its own budget, carrying the measured figure (CI-FIT-3, CLOSE-5, <date>):
<x> s lit in <where measured>; about <x * 1.84> s on a CI runner (the measured factor), <over three quarters of the default 20 s |
past nine tenths of its own budget of N s>". `factionPowerSum`'s one `it` in a loop covers six tiers: one budget.
NOTHING ELSE MOVES: no assertion, sample, seed or title. The tree is still DARK at this commit (the dials come after you).
PROOF: the 15 files through the mutex, DARK: every red is on `ci/RED-AT-LINE.tsv` (FENCE 1's hash row is listed and stays red);
`tests/lint` whole; eslint on the 15. Report: `close-5/reports/F0.md`.
