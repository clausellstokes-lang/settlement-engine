# TAIL-CLOSE-PROSE-1 · hand-back (four re-keys in four test files)

Branch `lane/tail-close-prose-2026-11-15`, made from **8c11f73ea** (the doors' tip, as the brief named it). Nothing merged.
Scratch trees: `/home/user/prose1` (a plain clone with its own `.git` and its own `npm ci`; items UV1, A0B1, EC1 pushed from it), then, on the chair's word, `/home/user/prose1b` (a second plain clone of the branch, its own `npm ci`; the four later commits re-applied there by `git format-patch` / `git am`, which gave them new hashes, and every file re-run alone there). Every run went to a file under
`/home/user/prose1-logs/`. No page line cured; no file under `src/`, `scripts/` or `docs/content/` touched; no test file but the four.

## THE FOUR ITEMS

| item | file | old | new | cause | commit | the test's count |
|---|---|---|---|---|---|---|
| UV1 | `tests/generators/upkeepVocation.test.jsx` (the page arm) | `r.house.includes(institutionDisplayName(house))` (41 missing) | `r.house.includes(institutionHouseLabel(house))` (imported beside `institutionDisplayName`) | R2-CODE-B round 3, ruling (a) (d425c31c1): the provider line is printed through `institutionHouseLabel` ("Taverns", "Inns", "Houses of worship", "Housing") | 31ce5e8e7 | 2 / 2 GREEN |
| A0B1 | `tests/lint/proseComposed.walker.test.js` (A0b) | `OVER_CLAIM_OWED = 0` (46 > 45) | `OVER_CLAIM_OWED = 1` (BASE stays 45); the printed label adds "; 2026-11-15: DS-ECO-1 C1's fourth line, the {access} slot" | DS-ECO-1 :: COMBINATION C1 v4, the indebted twin (4467cd7d6, TAIL-CORPUS-ECO-4 batch 7, ruling C19), fills the `{access}` slot as its three siblings do. Measured at 8c11f73ea: 46 over-claims, 2,959 variants (the chair's figure) | 591a2dac2 | 86 / 87 after this row alone: the arm's next clause redded (A0B2, next row) |
| A0B2 | `tests/lint/proseComposed.walker.test.js` (A0b, "pools carrying a finding") | `toBeLessThanOrEqual(304)` (305 > 304) | `toBeLessThanOrEqual(305)` | the chair's ruling A0B2 (measured by the chair at 9d3d177a0 (304) and 8c11f73ea (305)): DS-GEN-16 :: LEGACY-SHIFTED, re-worded by TAIL-CORPUS-ECO-4 · C23 (7ab28d3ef7), owes one under-claim of `hist.legacyAnnotations`. The under-claim ceiling (2,005 of 2,012) not touched | 7cd8ee981 | 87 / 87 GREEN |
| EC1 (a) | `tests/lint/proseEntryContradiction.walker.test.js` ("reds on all four shipped breaches") | `row.line === 6165`, message `:6165` | `6167` (measured by grep at 8c11f73ea) | two lines now above it: DS-ECO-1 COMBINATION C1 v4 (4467cd7d6) and DS-ECO-6 TIER: significant off-book activity v8 (84a41a687, TAIL-CORPUS-ECO-3 batch 5) | ad4167a48 | 29 / 29 GREEN |
| EC1 (b) | same file (ANCHOR 5) | `r.line === 2418`, message `:2418` | `2420` (measured) | the same two lines | ad4167a48 | (as above) |
| 4 | `tests/lint/proseWiringCensus.walker.test.js` ("variants per pool, exactly") | `{2: 85, 3: 523, 4: 147, 5: 45, 6: 24, 7: 20, 8: 3, 9: 4, 10: 2, 11: 2, 13: 1}` | `{2: 85, 3: 520, 4: 147, 5: 47, 6: 25, 7: 20, 8: 2, 9: 5, 10: 2, 11: 2, 13: 1}` | the close's corpus lines, one line in each of eight pools: 3 -> 4 DS-ECO-1 C1 (4467cd7d6), DS-DEF-3 Safe (d4a4bd590), DS-DEF-12 CAPACITY: ample (a7fa530a3); 4 -> 5 DS-GEN-13 COMMERCE: a market, no guild (4467cd7d6), DS-DEF-3 Very Safe (d4a4bd590), DS-POW-5 autocrat (a7fa530a3); 5 -> 6 DS-DEF-2 Beasts & Monsters settled (b284cbe44); 8 -> 9 DS-ECO-6 significant off-book (84a41a687). The buckets sum to **856 pools (the file's own pin)** and 2,959 variants | 826ba80c4 | 79 / 79 GREEN |

Under the owner's word of 2026-11-15 06:00 UTC: item 4. Under the chair's rulings: UV1, A0B1, EC1. For EC1, `grep -rn -E "=== 6165|=== 2418|:6165|:2418" tests/`
found no other pin of either address.

## THE RECEIPT (each file run alone, to a file)

| run | result |
|---|---|
| `tests/generators/upkeepVocation.test.jsx` | 2 / 2 GREEN |
| `tests/lint/proseComposed.walker.test.js` | 87 / 87 GREEN (after A0B2; before it, 86 / 87: `expected 305 to be less than or equal to 304`) |
| `tests/lint/proseEntryContradiction.walker.test.js` | 29 / 29 GREEN |
| `tests/lint/proseWiringCensus.walker.test.js` | 79 / 79 GREEN |
| `tests/lint/proseMoveGrammar.walker.test.js` | 54 / 54 GREEN |
| `tests/domain/composeStateProse.test.js` | 51 / 51 GREEN |
| `npx eslint` on the four files | exit 0 |

## WHAT IS LEFT RED, AND WHY

Nothing in the six files. The one stop of the seat (proseComposed A0b "pools carrying a finding" 305 > 304, hidden behind the
over-claim clause until A0B1) was ruled by the chair as A0B2 and re-keyed in its own commit.

WHAT HAPPENED AT THE PUSH (named to the chair): push 1 carried the tip as it stood when its three-minute hook ended
(ad4167a48, not 31ce5e8e7: I had committed A0B1 and EC1 while the hook ran); push 2 then had nothing to send, so its hook started the
whole `npm run check` in `/home/user/prose1`. The permission check refused stopping it. That clone is left to that run and
nothing more was pushed from it. No false identity was written to anything pushed:
`git log --format='%an <%ae>' origin/lane/tail-close-doors-2026-11-15..origin/lane/tail-close-prose-2026-11-15` read
`Claude <noreply@anthropic.com>` on all three commits (31ce5e8e7, 591a2dac2, ad4167a48) before the last push, and the push from
`/home/user/prose1b` was made only after `git log -1 --format='%an <%ae>'` read `Claude <noreply@anthropic.com>`, `core.bare` read false
and `git status -sb` showed `[ahead 4]`.

## FOR THE OWNER, IN PLAIN WORDS

Five out-of-date checks were brought up to date (the brief named four; a fifth came to light behind one of them); they had been reading the page, the text file and the counts as those stood before this round's own changes.
No town changed: only test files moved, and no generated town, saved town or page line is different.
Each change is on your veto list.
