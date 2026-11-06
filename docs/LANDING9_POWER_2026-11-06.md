# LANDING-9-POWER — `powerEconomyFreshness` A3/A6 read, bisected and cured through its door (2026-11-06)

Seat: Opus 5.5, child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), on
`lane/landing9-power-2026-11-06` from `3c62e8ef5`. Brief: LANDING-9-POWER (the chair's, 2026-11-06).

## Method

Plain scratch worktrees of every first-parent step since `3d8a74e4b` that touches `src/` (the arms read only `src/`
and the test helpers; no door path is involved), the tip's test file copied in, `-t 'A3|A6'`. Inside the moving step,
each commit's `src/` diff reverse-applied in its own worktree. The moved rows named by a scratch probe that logs each
arm's row identities (the corpus rows share one `_seed`, so identity is the row config). Scratch only; nothing staged
was committed.

| step | A3 stale-at-closeout | A6 refreshed-away |
|---|---|---|
| `3d8a74e4b` (base), `103b1db81`, `8e60cb2a5`, `b37bbf395`, `3da1104da`, `64ad4fe47`, `5fbb339be`, `f93c69938`, `2fa94ba8e`, `471780f4a` (and lane E's own `3e5c6c198`) | 31 | 28 |
| `18fd6b442` (lane H) | 32 | 29 |
| `18fd6b442` − `66b1407bd` (R-H5) | 31 | 28 |
| `18fd6b442` − `8e92c0440` (R-H2) / − `5f6d243b2` (R-H3) | 32 / 32 | 29 / 29 |
| tip `3c62e8ef5` | 32 (same row set as `18fd6b442`) | 29 (same row set) |

## The table

| arm | what it pins | cause (step, commit) | door | what moved (before → after) | state |
|---|---|---|---|---|---|
| A3 | the counterforce: rows (non-desert census corpus, world changed to desert, DM-halved share held) whose held `economyInputFingerprint` is stale against the final economy at `economyReconcilePass` — proves the freshness assert must be pin-aware | `18fd6b442`, R-H5 `66b1407bd` alone | hand re-key by identity, cause in the test's comment form | 31 → 32; +1 row `thorp\|germanic\|coastal\|port`: desert deficit 2 lb of 32 now 6% from the rounded pounds (was 5%), `foodLabel` Secure → Pressured, prosperity Moderate → Poor (coastal baseline unchanged: Secure/Moderate) | GREEN (`6b7117363`) |
| A6 | anti-vacuity: rows where the UNPINNED replay recomputes the held receipt away | same | same | 28 → 29; the same row, same fact | GREEN (`6b7117363`) |
| A4 | golden unmoved by the pin-aware guards | red only at the `18fd6b442` stage (before record 34 re-recorded the golden) | record 34 (LANDING-8) | — | GREEN at the tip, unchanged |

Not a product defect: the fingerprint reads `tier, prosperity, safetyLabel, foodLabel`; R-H5 (a ruled fix) moved one
row's food label across a threshold, the counterforce grows by one honest row, and every other expectation in both arms
(three assert reaches per run, no refusal under the held pin, the receipt kept, the refresher a no-op under the pin) holds.

## The suite's own run

`npx vitest run tests/generators/powerEconomyFreshness.test.js > pef-cured.log 2>&1`, exit 0: 1 file, 10 of 10 passed.
