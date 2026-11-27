# (C) THE CANDIDATE, TRIED IN A SCRATCH COPY (CONFIRMED: `scripts/analyze-C.mjs` over the base and candidate births; the copy was a tar of cccda7569 at /tmp/trad/cand with its own throwaway git, never committed upstream, never pushed)

THE CHANGE (`C-candidate.patch`, 3 files, +25 -5; for reading, not a build): (1) `data/traditionCorpus.js`: the act `fair` declares `needs: ['market']` in the corpus, beside the elements' needs, so (2) `shownTraditions.js` builds `ACT_NEEDS` from the corpus as it builds `ELEMENT_NEEDS` (one source for the draw and the drop; the drop's behaviour is unchanged); (3) `genesis.js`: behind a new literal floor `NEEDS_SINCE = '0.10.0'` read by `bornAtOrAfter` (FIELD_RITE_SINCE's form), a motif is HELD when every need of its element and its act answers `true` through `atomHolds` over `factsOf(settlement)` (the drop's own rule: unanswered refuses). THE DRAW AS BEFORE, THE RULE AFTER: an addition whose drawn motif is not held takes the field rule's own ten further attempts (`drawAt(k)`, forks `el:k`/`act:k`), now asked "field refused OR needs not held"; the founding core, if not held, takes the first held of ten further draws on forks `el:1..10`/`act:1..10` of its own `t:0` fork (unused labels; the PRNG's `fork` is label-derived, so no other stream moves). No weight changes; a row that is held is never redrawn; if all ten attempts fail the first draw stands (it is then dropped at view, as today).

THE COUNT (1,800 births, 0 errors):
- **Towns short of the band: 277 -> 0** (every size). **Towns showing no tradition: 104 -> 0.** Shared page short: 0. On every one of the 1,800 towns the drawn, the owner's and the shared count are equal.
- **Residue (drawn, not shown) after: 0 rows.** No need is unknowable at the draw (A: the draw runs over the finished record), so there is no birth residue; a residue can arise only LATER, on a lit mirror whose place loses its market or smith after the mint (not measurable on births).
- **Towns whose drawn set moves: 444** = exactly the 444 towns with a drop today; 488 rows move = the 487 dropped rows + ONE kept row: V dp-metropolis-65, whose row 6 keeps its motif (first-landing|offering) but loses its NAME "The Lantern Offering" to row 3's replacement (name uniqueness, `composeName`'s `usedNames`) and becomes "The Offering of the First Landing". No town's drawn count changes (0 of 1,800).
- **Kept rows whose owner description moves: 17** in 16 towns (thorps 2, towns 3, cities 9, metropolises 3): the description rotation (`describeTraditions`' `taken` set) runs over the set, so a new neighbour can take a sentence a kept row used to print. The row itself (name, motif, window) does not move.
- **Outside traditions: NOTHING moves.** The born record: 0 of 1,800 move (recordHash; genesis is not a generator step, so it cannot). The stamped public prose (`composePublicProse`, all 25 sites): only site `traditions` moves, in exactly the 444 towns. No shared random stream: there is none to share (genesis forks off `${seed}::tradition:genesis`).
- By need, the rows that now print in place of a dropped one: market 339, smith 91 (+17 with market), coast 21 (+2), river 17 (B's table).

WHAT THE BIRTH COUNT CANNOT SEE (PLAUSIBLE, read): the tick-time mint (`traditionsKernel.js`) calls the same function, so a 0.10.0-born town lit in a campaign mints the candidate's set; the occurrences, prosperity/legitimacy deltas and faith beats of those 488 rows move with it in any world-pulse run over 0.10.0-born towns (D).

## THE TABLE

towns compared: 1800; missing or errored: 0

| corpus | size | towns | short of band BEFORE | AFTER | showing none BEFORE | AFTER | share short AFTER | towns whose drawn set moves | rows moved | KEPT rows moved | kept rows whose owner description moves | records moved | residue rows (drawn, not shown) | residue towns |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| C | thorp | 150 | 32 | 0 | 32 | 0 | 0 | 62 | 73 | 0 | 1 | 0 | 0 | 0 |
| C | hamlet | 150 | 17 | 0 | 17 | 0 | 0 | 54 | 59 | 0 | 0 | 0 | 0 | 0 |
| C | village | 150 | 69 | 0 | 8 | 0 | 0 | 69 | 77 | 0 | 0 | 0 | 0 | 0 |
| C | town | 150 | 28 | 0 | 0 | 0 | 0 | 28 | 28 | 0 | 3 | 0 | 0 | 0 |
| C | city | 150 | 4 | 0 | 0 | 0 | 0 | 14 | 15 | 0 | 4 | 0 | 0 | 0 |
| C | metropolis | 150 | 4 | 0 | 0 | 0 | 0 | 7 | 9 | 0 | 0 | 0 | 0 | 0 |
| C | ALL | 900 | 154 | 0 | 57 | 0 | 0 | 234 | 261 | 0 | 8 | 0 | 0 | 0 |
| V | thorp | 150 | 29 | 0 | 29 | 0 | 0 | 59 | 68 | 0 | 1 | 0 | 0 | 0 |
| V | hamlet | 150 | 14 | 0 | 14 | 0 | 0 | 50 | 51 | 0 | 0 | 0 | 0 | 0 |
| V | village | 150 | 61 | 0 | 4 | 0 | 0 | 61 | 65 | 0 | 0 | 0 | 0 | 0 |
| V | town | 150 | 6 | 0 | 0 | 0 | 0 | 6 | 6 | 0 | 0 | 0 | 0 | 0 |
| V | city | 150 | 9 | 0 | 0 | 0 | 0 | 19 | 21 | 0 | 5 | 0 | 0 | 0 |
| V | metropolis | 150 | 4 | 0 | 0 | 0 | 0 | 15 | 16 | 1 | 3 | 0 | 0 | 0 |
| V | ALL | 900 | 123 | 0 | 47 | 0 | 0 | 210 | 227 | 1 | 9 | 0 | 0 | 0 |
| ALL | thorp | 300 | 61 | 0 | 61 | 0 | 0 | 121 | 141 | 0 | 2 | 0 | 0 | 0 |
| ALL | hamlet | 300 | 31 | 0 | 31 | 0 | 0 | 104 | 110 | 0 | 0 | 0 | 0 | 0 |
| ALL | village | 300 | 130 | 0 | 12 | 0 | 0 | 130 | 142 | 0 | 0 | 0 | 0 | 0 |
| ALL | town | 300 | 34 | 0 | 0 | 0 | 0 | 34 | 34 | 0 | 3 | 0 | 0 | 0 |
| ALL | city | 300 | 13 | 0 | 0 | 0 | 0 | 33 | 36 | 0 | 9 | 0 | 0 | 0 |
| ALL | metropolis | 300 | 8 | 0 | 0 | 0 | 0 | 22 | 25 | 1 | 3 | 0 | 0 | 0 |
| ALL | ALL | 1800 | 277 | 0 | 104 | 0 | 0 | 444 | 488 | 1 | 17 | 0 | 0 | 0 |

Public-prose sites (the stamped shared page, composePublicProse) whose text moves, towns per site:

- `traditions`: 444

Residue by size and motif:

- none

Residue examples:

- none

Kept rows that move (examples):

- V dp-metropolis-65: The Lantern Offering -> The Offering of the First Landing
