# REGISTERS AT THE LINE: every register the lane's two merges of the line conflicted on, three ways (FORTUNE-6)

Asked by the chair at 04:23 UTC on 2026-11-22: for each register that is shrink-only or a ceiling, row by row against
the line at f5295e425, no row on the lane's tip may stand above the line's, except ruled movements. This is
COMMON-RULES 9's three-way form.

- **Base:** 062504aa8, the line as the lane last held it.
- **Line:** f5295e425, point 93.
- **Tip:** the lane at 834b5a780.

Read EXECUTED from the three committed JSON files with a row-by-row script, 2026-11-22 04:3x UTC.

| register | kind | conflicted at | base / line / tip | rows on the tip ABOVE the line's | ruling |
|---|---|---|---|---|---|
| `scripts/.observed-shape-readers-baseline.json` | shrink-only (per file, per identity ceilings) | 0cf38c992 (5fca4362d) | schema 45 / 45 / 46; identities 1552 / 1552 / 1553; total 2214 / 2214 / 2215 | ONE: `src/domain/fortune/fortuneMerits.js :: merits on breakdown`, 1 (absent on the line). No row is lower; no other row differs | the seventh chair, 2026-11-20 22:18 UTC (FORTUNE U5a-CURE item 2, route B): rung 45 -> 46 for ONE explained-writer row, this lane's alone; the bank 78/52 -> 79/53 with it |
| `scripts/.writer-reach-baseline.json` | shrink-only (the banked dark cohort; `pendingSurfaceCeiling`) | 0cf38c992 (5fca4362d) | banked cohort 1385 / 1368 / 1366; reviewable dark 399 / 398 / 396; pendingSurfaceCeiling 0 / 0 / 0 | NONE. The tip's cohort is the line's minus `isApproved on publicLegitimacy` and `isTolerated on publicLegitimacy`; no identity on the tip is absent from the line; no row count is higher | the eighth chair, 2026-11-22 02:21 UTC, its three movements: (1) those two identities leave the dark cohort; (2) `yearsAgo on legacyAnnotations` becomes a true read (LIT 703 -> 704 against the line); (3) the closures web-transitive 1079 -> 1083, dossier-pdf 621 -> 625, campaign-pdf 208 -> 212, world-book 223 -> 227, foundry 509 -> 513 (figures, not ceilings) |
| `tests/lint/.tuning-inventory.json` | MEASURED inventory, exact (machine-written, not a ceiling) | eee2fe0ce (f5295e425) | tables 280 / 280 / 281; keys 2293 / 2293 / 2297; bareDecimals 6877 / 6877 / 6877; unregisteredNamed 541 / 541 / 541 | The tables: one more, `fortuneLaw.js#FORTUNE_LAW_TUNING`, the lane's DRAFT table, for the owner's signing. bareDecimals and unregisteredNamed: 0 files differ from the line | the lane's own table (FORTUNE U1, registered DRAFT) |
| `tests/lint/.lighting-census-baseline.json` | MEASURED census, exact (not a ceiling) | 0cf38c992 and eee2fe0ce | files 3714 / 3741 / 3752; parked 475 / 478 / 482; credited 3239 / 3263 / 3270; titles 31266 / 31570 / 31634; suiteTitles 8664 / 8751 / 8770 | n/a: actuals of the tree, re-taken by the door (the lane's own test files) | — |
| `docs/content/wiring-census.json` | MEASURED census (`--check`, re-derived) | 0cf38c992 (5fca4362d) | producerIndexFiles at the line 1441; the tip's `--check` exit 0 | n/a: against the line only the lane's stamps (`powerStateProse.js`, `economyStateProse.js`) and producerIndexFiles 1441 -> 1443 | — |

## Ceilings the lane moved without a merge conflict

These are named here for the same reader.

- `tests/lint/samenessHideable.walker.test.js :: HAND_CEILING` 73 -> 74: one row, `FORTUNE_MERIT_LINES`, by the chair's
  ruling of 03:23 UTC 2026-11-22.
- No other `*_CEILING` and no budget was raised by the lane. `git diff f5295e425 834b5a780` shows CEILING, BUDGET or
  MAX moving only at `HAND_CEILING`.
- Every other JSON register the tip differs on:
  - `tests/lint/.tuning-register.json`, +65 lines: the lane's DRAFT rows (`FORTUNE_LAW_TUNING`, status draft,
    signedAt null), for the owner's signing.
  - `scripts/mutation-coverage-manifest.json`, +20 lines: the lane's test rows, additive.
  - Neither conflicted, and neither is a ceiling.

FINDING: no row on the tip stands above the line's without a ruling, so none was put back.
