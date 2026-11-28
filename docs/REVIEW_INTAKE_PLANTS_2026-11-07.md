# REVIEW-INTAKE PLANTS — the five cure pins gain their sweep plants (2026-11-07)

Branch `lane/review-intake-plants-2026-11-07`, cut from `origin/lane/integration-2026-11-07` at
`1031233a4`. The chair's REVIEW-INTAKE-LAND phase 2, first half. Seat: Opus 5.5. No full check;
pushed with the bypass. The npcGenerator.js size ratchet (1,297 > 1,287) is left to the people
car's lane 1, by the chair's word.

## The plants — `scripts/mutation-sweep.sh` #119–#123, each the inverse of its cure

| # | test | plant (target) | label |
|---|---|---|---|
| 119 | `tests/generators/gapSaysWhichKind.test.js` | `supplyOfInput` classes an imported input `missing` again (`resourceGenerator.js`) | `review-intake/a gap says which kind` |
| 120 | `tests/generators/receiptReadsPersistedTrace.test.js` | the trace copy moves back AFTER the receipt (`steps/assembleSettlement.js`) | `review-intake/the receipt reads the trace it persisted` |
| 121 | `tests/generators/rosterDuplicateDraws.test.js` | `drawRefusingHeldThrough` stops refusing what the roster holds (`hookVariety.js`) | `review-intake/no roster carries one secret or one goal twice` |
| 122 | `tests/generators/waterDependencyFromRecord.test.js` | the record's water rows stop counting as a supply (`economy/viability.js`) | `review-intake/water is read from the record` |
| 123 | `tests/lint/holderCitesBySymbol.test.js` | the producer index stops emitting `path :: symbol` (`scripts/wiring-census.mjs`) | `review-intake/a holder citation resolves by symbol` |

Each runs through the sweep's own `check_caught`: planted by a `perl` substitution, the gate run,
the target restored by `git checkout --` and verified byte-identical against the index
(`git diff --quiet`), the gate re-run clean (a CAUGHT needs mutated red AND clean green).
`MUTATED_FILES` gains `resourceGenerator.js`, `steps/assembleSettlement.js` and `hookVariety.js`
(`viability.js` and `wiring-census.mjs` were already rows).

`scripts/mutation-coverage-manifest.json`: the five entries flip from the chair's ref
`review-intake-five-cure-pins-entered-at-integration-merge-2026-11-07` to `kind: 'mutation'` with
the labels above; the rationale stays as history with one sentence saying the plants landed.
`npx vitest run tests/lint/mutationCoverageManifest.test.js`: 10 of 10.

## The sweep's own output (banked)

Run on the committed tree `6940fd24e` with the sweep's header and helpers verbatim and only the
five new areas (a scratch extract of `scripts/mutation-sweep.sh`: lines 1 through `Running mutation
sweep…`, the #119–#123 block, the results footer; the `cd` line pointed at the worktree):

```
── Mutation sweep results ──────────────────────────────
  CAUGHT  ok   review-intake/a gap says which kind
  CAUGHT  ok   review-intake/the receipt reads the trace it persisted
  CAUGHT  ok   review-intake/no roster carries one secret or one goal twice
  CAUGHT  ok   review-intake/water is read from the record
  CAUGHT  ok   review-intake/a holder citation resolves by symbol
────────────────────────────────────────────────────────
  CAUGHT: 5    CLEAR: 0    MISSED/BROKEN: 0
  spine holds: every injected regression was caught and every negative control stayed clear.
exit=0
```

After the run every sweep target was clean (the footer's leftover check printed nothing; tracked
porcelain showed only this record's two roster files, edited during the run and outside the sweep).

## Registers

The source-citation archival roster: `dated` 99 → 100, this record, born dated, measured with the
walker's own arm. A growth, not a re-classification.

Disclosed: `scripts/mutation-sweep.sh` (1,704 lines) was read at its header, its four helpers, its
last ten areas and its footer, not whole.
