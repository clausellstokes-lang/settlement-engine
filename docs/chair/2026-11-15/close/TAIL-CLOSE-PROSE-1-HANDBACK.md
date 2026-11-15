# TAIL-CLOSE-PROSE-1 · hand-back (four re-keys in four test files)

Branch `lane/tail-close-prose-2026-11-15`, made from **8c11f73ea** (the doors' tip, as the brief named it). Nothing merged.
Scratch tree `/home/user/prose1`: a plain clone with its own `.git` and its own `npm ci`. Every run went to a file under
`/home/user/prose1-logs/`. No page line cured; no file under `src/`, `scripts/` or `docs/content/` touched; no test file but the four.

## THE FOUR ITEMS

| item | file | old | new | cause | commit | the test's count |
|---|---|---|---|---|---|---|
| UV1 | `tests/generators/upkeepVocation.test.jsx` (the page arm) | `r.house.includes(institutionDisplayName(house))` (41 missing) | `r.house.includes(institutionHouseLabel(house))` (imported beside `institutionDisplayName`) | R2-CODE-B round 3, ruling (a) (d425c31c1): the provider line is printed through `institutionHouseLabel` ("Taverns", "Inns", "Houses of worship", "Housing") | 31ce5e8e7 | 2 / 2 GREEN |
| A0B1 | `tests/lint/proseComposed.walker.test.js` (A0b) | `OVER_CLAIM_OWED = 0` (46 > 45) | `OVER_CLAIM_OWED = 1` (BASE stays 45); the printed label adds "; 2026-11-15: DS-ECO-1 C1's fourth line, the {access} slot" | DS-ECO-1 :: COMBINATION C1 v4, the indebted twin (4467cd7d6, TAIL-CORPUS-ECO-4 batch 7, ruling C19), fills the `{access}` slot as its three siblings do. Measured at 8c11f73ea: 46 over-claims, 2,959 variants (the chair's figure) | 591a2dac2 | 86 / 87: **the arm still reds on its next clause** (below) |
| EC1 (a) | `tests/lint/proseEntryContradiction.walker.test.js` ("reds on all four shipped breaches") | `row.line === 6165`, message `:6165` | `6167` (measured by grep at 8c11f73ea) | two lines now above it: DS-ECO-1 COMBINATION C1 v4 (4467cd7d6) and DS-ECO-6 TIER: significant off-book activity v8 (84a41a687, TAIL-CORPUS-ECO-3 batch 5) | ad4167a48 | 29 / 29 GREEN |
| EC1 (b) | same file (ANCHOR 5) | `r.line === 2418`, message `:2418` | `2420` (measured) | the same two lines | ad4167a48 | (as above) |
| 4 | `tests/lint/proseWiringCensus.walker.test.js` ("variants per pool, exactly") | `{2: 85, 3: 523, 4: 147, 5: 45, 6: 24, 7: 20, 8: 3, 9: 4, 10: 2, 11: 2, 13: 1}` | `{2: 85, 3: 520, 4: 147, 5: 47, 6: 25, 7: 20, 8: 2, 9: 5, 10: 2, 11: 2, 13: 1}` | the close's corpus lines, one line in each of eight pools: 3 -> 4 DS-ECO-1 C1 (4467cd7d6), DS-DEF-3 Safe (d4a4bd590), DS-DEF-12 CAPACITY: ample (a7fa530a3); 4 -> 5 DS-GEN-13 COMMERCE: a market, no guild (4467cd7d6), DS-DEF-3 Very Safe (d4a4bd590), DS-POW-5 autocrat (a7fa530a3); 5 -> 6 DS-DEF-2 Beasts & Monsters settled (b284cbe44); 8 -> 9 DS-ECO-6 significant off-book (84a41a687). The buckets sum to **856 pools (the file's own pin)** and 2,959 variants | 4ae11b977 | 79 / 79 GREEN |

Under the owner's word of 2026-11-15 06:00 UTC: item 4. Under the chair's rulings: UV1, A0B1, EC1. For EC1, `grep -rn -E "=== 6165|=== 2418|:6165|:2418" tests/`
found no other pin of either address.

## THE RECEIPT (each file run alone, to a file)

| run | result |
|---|---|
| `tests/generators/upkeepVocation.test.jsx` | 2 / 2 GREEN |
| `tests/lint/proseComposed.walker.test.js` | **86 / 87: RED**, `expected 305 to be less than or equal to 304` (line 626) |
| `tests/lint/proseEntryContradiction.walker.test.js` | 29 / 29 GREEN |
| `tests/lint/proseWiringCensus.walker.test.js` | 79 / 79 GREEN |
| `tests/lint/proseMoveGrammar.walker.test.js` | 54 / 54 GREEN |
| `tests/domain/composeStateProse.test.js` | 51 / 51 GREEN |
| `npx eslint` on the four files | exit 0 |

## WHAT IS LEFT RED, AND WHY (a STOP, named to the chair)

`proseComposed.walker` A0b "THE SHIPPED CORPUS READING": after the A0B1 re-key the over-claim ceiling holds (46 ≤ 46), but the
arm's later clause `expect(pools.size).toBeLessThanOrEqual(304)` reads **305**. The over-claim expect, which failed first,
had hidden it. The ruling does not explain it: the new over-claim falls in DS-ECO-1 C1, a pool whose three other lines already
carried the same finding, so it cannot add a pool. A pool gained a finding somewhere else. The pin was not touched; that is the chair's
call. Not measured further: which pool is the 305th (a set difference of `pools` between 9d3d177a0 and 8c11f73ea would name it).

## FOR THE OWNER, IN PLAIN WORDS

Four out-of-date checks were brought up to date: they had been reading the page, the text file and the counts as those stood before this round's own changes.
No town changed: only test files moved, and no generated town, saved town or page line is different.
Each change is on your veto list. One check in the town-description texts still reads one over its limit and is left for the chair.
