# TAIL-CLOSE-TESTS-A — hand-back (kept current at each push)

Seat: CLOSE, the test corpus's own laws (negativeAssertionAnchor.walker, seedLoopTotality.walker), my half =
paths sorting at or before `tests/generators/conflictRelationsTwin.test.js`. Branch `lane/tail-close-tests-a-2026-11-15`,
cut from the joined line `lane/join-2026-11-14` at **7efc7686**.

## Counts (my half: the walkers' excess over each file's ceiling, measured by the walkers' own scan logic)

| | at 7efc7686 (before) | at this push |
|---|---|---|
| un-anchored negatives | 58 files / 100 sites | see batch table |
| bare seed loops | 13 files / 23 loops | see batch table |

Batch 1 (this push): tests/domain + tests/foundry + tests/generators, 25 files. After it the half stands at
the figures in the batch table below; the other half (paths after the limit) is TAIL-CLOSE-TESTS-B's and untouched.

| batch | files | my half after (neg / seed) |
|---|---|---|
| 1 | 25 (domain, foundry, generators) | 3 files / 3 sites · 1 file / 2 loops (left: components + data in batch 2, the 3 held-back files) |

No walker file, allow-list, quarantine, ceiling or baseline was touched: every file in my half carried ceiling 0,
so the cure is in the test files alone. Nothing under src/ changed.

## How (the same assertion, stronger)
- A negative beside a positive on the same text became one `expectAbsentWithAnchor(text, wrong, instead)`: the same two claims.
- A `not.toMatch` / `not.toHaveProperty` keeps its matcher, with a positive on the SAME subject on the line(s) above and a one-line
  `// anchored:` marker naming it (several positives were added: `{calamity}` in corpusSlotAgreement, `PROSE_FORMS[label]` in
  powerProseNameInSentences, the town's name in arrivalCrisisRoster, the famine's exploiter in crisisCastReaderRows, the eligible set's
  size in corpusCureGuards, a kept-row count in conflictRelationsTwin).
- Every bare seed loop goes through `collectSeedFailures` + `expectNoSeedFailures` (every case runs; the true count). No loop hid a red.

## FINDINGS (iv) — reds the stronger form exposed, left red and true
1. **tests/domain/corpusCureGuards.test.js, "a cured line is not eligible in the fixed town that made it false": 47 rows**, message
   `<seed> draws no line of <pool> at all: re-key the row: expected 0 to be greater than 0`. The town reads the pool's key, but its eligible
   set is EMPTY, so the bare `not.toContain(vid)` read an empty collection and passed whatever the cure did. (The file's `by: 'record'`
   arm already demands the record admit some other line of the pool; the read arm now demands the same.) Rows (seed, pool):
  - w5-hamlet-occupied-2  DS-DEF-2::Invasion & War: neither walls nor force v4
  - w5-hamlet-occupied-104  DS-DEF-2::Invasion & War: walls with NO force v1
  - w5-village-under_siege-3  DS-DEF-2::Beasts & Monsters: settled, nothing organized v6
  - w5-hamlet-occupied-2  DS-DEF-2::Beasts & Monsters: settled, nothing organized v6
  - w5-thorp-under_siege-3  DS-ECO-12::INCOME WEIGHT: the religious houses v4
  - w5-thorp-under_siege-3  DS-ECO-12::INCOME WEIGHT: the religious houses v3
  - w5-hamlet-occupied-104  DS-DEF-11::WALLED-STRAINED v6
  - w5-thorp-occupied-1  DS-DEF-11::WALLED-STRAINED v7
  - w5-thorp-famine-2  DS-DEF-12::CAPACITY: enough v1
  - w5-thorp-famine-2  DS-DEF-12::CAPACITY: enough v2
  - w5-village-under_siege-6  DS-DEF-12::CAPACITY: enough v1
  - w5-thorp-plague_onset-2  DS-DEF-12::CAPACITY: enough v2
  - rv2-hamlet-famine-2  DS-DEF-12::CAPACITY: enough v3
  - w5-metropolis-occupied-101  DS-GEN-17::GARRISONED v1
  - w5-city-occupied-101  DS-GEN-17::GARRISONED v2
  - w5-city-occupied-101  DS-POW-5::FLAG: merchantArmy v1
  - w5-city-occupied-101  DS-POW-5::FLAG: merchantArmy v2
  - w5-hamlet-under_siege-102  DS-GEN-13::ENTREPOT v1
  - rww-city-under_siege-1  DS-POW-6::operation role duty evasion v1
  - rww-metropolis-under_siege-1  DS-POW-6::operation role duty evasion v2
  - w5-metropolis-under_siege-1  DS-POW-6::operation role duty evasion v3
  - rww-metropolis-under_siege-1  DS-ECO-12::CRITICAL IMPORT: a house needs what the land lacks v3
  - w5-city-plague_onset-3  DS-ECO-1::COMBINATION C4: a low rung on a working approach v1
  - w5-city-plague_onset-3  DS-ECO-9::HOW THE NEED IS MET: much of it brought in v1
  - w5-city-plague_onset-3  DS-ECO-9::HOW THE NEED IS MET: much of it brought in v2
  - w5-city-plague_onset-3  DS-ECO-9::HOW THE NEED IS MET: much of it brought in v3
  - w5-city-plague_onset-3  DS-ECO-1::COMBINATION C4: a low rung on a working approach v2
  - w5-city-plague_onset-3  DS-ECO-1::COMBINATION C4: a low rung on a working approach v3
  - w5-thorp-plague_onset-1  DS-ECO-1::COMBINATION C4: a low rung on a working approach v6
  - rww-hamlet-famine-1  DS-ECO-6::TIER: minor shadow activity (≥3) v0
  - rww-village-under_siege-1  DS-ECO-6::TIER: minor shadow activity (≥3) v0
  - rww-town-under_siege-1  DS-ECO-10::POSTURE: vulnerable v3
  - w5-city-under_siege-3  DS-ECO-10::POSTURE: vulnerable v1
  - w5-hamlet-indebted-101  DS-ECO-12::INCOME WEIGHT: the religious houses v1
  - w5-hamlet-calm-10  DS-ECO-12::INCOME WEIGHT: the religious houses v2
  - w5-city-occupied-1  DS-DEF-2::Invasion & War: walls AND professional garrison v1
  - w5-city-occupied-101  DS-DEF-2::Invasion & War: walls AND professional garrison v2
  - w5-city-occupied-102  DS-DEF-2::Invasion & War: walls AND professional garrison v3
  - w5-hamlet-occupied-1  DS-DEF-5::NO organized force at all v1
  - w5-thorp-occupied-102  DS-DEF-5::NO organized force at all v2
  - w5-hamlet-occupied-104  DS-DEF-5::NO organized force at all v3
  - w5-town-occupied-3  DS-DEF-2::Beasts & Monsters: settled, defenses beyond the need v4
  - w5-city-occupied-104  DS-DEF-2::Beasts & Monsters: settled, defenses beyond the need v5
  - w5-city-occupied-1  DS-DEF-11::WALLED-STRAINED v2
  - w5-city-occupied-1  DS-DEF-11::WALLED-STRAINED v1
  - w5-hamlet-occupied-104  DS-DEF-11::WALLED-STRAINED v5
  - w5-city-occupied-1  DS-DEF-2::Beasts & Monsters: frontier, credible deterrence v4
   The file's 12 rows already red at the base ("no longer reads <pool>") are unchanged.

## Pre-existing reds in touched files (unchanged, the builders' breaks)
corpusCureGuards 12, journalMarksCrisisRows 2, journalPrintsTheTabsLeaf 1, tailDisplayCivic3V1 1, hallDecidesUnderOccupation 1.

## Held back as MOVING (the builder's own unmerged change, three-dot diff; the chair's ruling 05:10Z)
tests/domain/corpusEcoTailGuards.test.js (tail-corpus-eco), tests/domain/tailCorpusDefGuards.test.js (tail-corpus-def),
tests/domain/tailCrisisBatch4.test.js (tail-crisis): to do after "SWEPT <tip>".

## Left
Batch 2 (tests/components, tests/data, in progress); the three held-back files.
