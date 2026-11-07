# LANDING-9 — the two sixty-seed dark-digest pins re-keyed by identity with their causes (2026-11-06)

Seat: Opus 5.5, child of the cloud chair (Fable 5.1, session `01FE9mEvGxnFx6WTBkEC6ie9`), on
`lane/landing9-digests-2026-11-06` from `3c62e8ef5`. Brief: the chair's LANDING-9-DIGESTS.

## Method

A scratch probe (each test's own recipe: `rawBitFormOf` of the default-config dark birth for `x46NpcBand`; the
sha256/16 of the `birthConfig(configForIndex(i))` birth with `densityFactor` mocked to 1 for
`institutionBudgetPromise`) was run in a plain worktree at every first-parent step since `3d8a74e4b` that touches
`src/`. The probe's harness files (`generation-certification-soak.mjs`, `dormancyOracle.js`, `configSlice.js`) and
`cartographyTuning.js` are unchanged across the range, so the door-path carry was not needed. Inside each moving step,
each source commit's `src/` diff was reverse-applied and the probe re-run against the previous step.

| step | lane | promise seeds moved (vs previous step) | dark seeds moved | the mover inside the step |
|---|---|---|---|---|
| `3d8a74e4b` (base) | — | 0 vs the pin | 0 vs the pin | — |
| `103b1db81` | B | 0 | 0 | — |
| `b37bbf395` | D | 24 | 0 | `bfd70d809` (minus it: 0); `8befe5a0d`, `b18e9b85e` move 0 |
| `3da1104da` | F1 | 8, 20, 44 | 0 | `59237b232` (minus it: 0); `ca2f0516e` moves 0 |
| `64ad4fe47` | G | 51, 53 | 0 | `5d3f7b5cb` (minus it: 0); `c9be4d1f0` moves 0 |
| `2fa94ba8e` | A | 0 | 0 | — |
| `471780f4a` | E | 0 | 0 | — |
| `18fd6b442` | H | 6, 8, 13, 14, 20, 24, 30, 31, 36, 44, 49 | thorp-005, thorp-009 | `66b1407bd`: 6, 13, 24, 30, 31, 36, 49 + both dark; `8e92c0440`: 8, 14, 20, 44; `5f6d243b2` 0 (the two partitions are disjoint and sum to the step) |
| `3c62e8ef5` (tip) | — | 0 vs `18fd6b442` | 0 | — |

## The table

| red | cause (step · commit · record) | what moved (before → after) | state |
|---|---|---|---|
| `x46NpcBand` (sixty dark digests) | `18fd6b442` · `66b1407bd` · record 34 (the food per cent from the pounds) | 2 of 60: `x46-dark-thorp-005` `b18f5fcf…` → `d926eacd…`; `x46-dark-thorp-009` `fa6b4b35…` → `64023a9b…` (fixture `tests/fixtures/x46-npc-band-dark-digests.json`, not a registered golden surface) | GREEN, `8ec0ff167` |
| `institutionBudgetPromise` (sixty hashes, d = 1) | `b37bbf395` · `bfd70d809` (superseded by) record 34; `3da1104da` · `59237b232` · record 32; `64ad4fe47` · `5d3f7b5cb` · record 33; `18fd6b442` · `66b1407bd` · record 34 and `8e92c0440` · record 35 | 13 of 60: 6 `55b6797f…`→`be18be00…`, 8 `f27de545…`→`0aa2f463…`, 13 `0a971fec…`→`2c03406c…`, 14 `4c66c8ab…`→`bb874628…`, 20 `ec9ca48c…`→`d8f721aa…`, 24 `88febb41…`→`ac1dd5fd…`, 30 `760e2ae7…`→`a5014b05…`, 31 `aa2e57f8…`→`a226c37d…`, 36 `00e54c54…`→`6c6d08a5…`, 44 `65dcdc84…`→`07748301…`, 49 `23b54fae…`→`fa74beb3…`, 51 `542c8543…`→`5b076a9a…`, 53 `4a2f15df…`→`9912674b…`; none moved by the budget | GREEN, `2b87c6ae3` |

New digests re-captured at `3c62e8ef5` twice and equal. No golden byte moved through the door; records 36 and 37
unused.

## The suites' own runs (at the lane tip, logs redirected, exit codes read)

- `npx vitest run tests/generators/x46NpcBand.test.js` — 1 file, 24 of 24, exit 0.
- `npx vitest run tests/generators/institutionBudgetPromise.test.js` — 1 file, 1 of 1, exit 0.

## For the chair at the merge

This record is one more dated document: `sourceCitationIntegrity.walker`'s archival roster reads dated 71 → 72 on this
lane (measured, 1 of 18 red, its own run). Not refrozen here, because each sibling lane's record moves the same count;
it is the roster LANDING-8 refroze last, so refreeze it once after the five lanes merge.
