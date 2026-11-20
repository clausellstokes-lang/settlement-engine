# TAIL-CLOSE-SWEEP-C — hand-back (kept current in every push)

Branch `lane/tail-close-sweep-c-2026-11-15`, cut from `lane/join-2026-11-14` at 22b3cc82e.
Every run went to a file in the seat's scratch tree; the search is one script over the census's 720 births
(`censusPlan('r2')`, the census's own `configOf`).

| file | red alone at 22b3cc82e | turning commit | class | after, alone |
| --- | --- | --- | --- | --- |
| `tests/domain/corpusEcoTailGuards.test.js` | 3 of 136 | **9cc8c6826** (TAIL-DEFECON-5 R2, "one shadow figure", a DECLARED MOVE; landed at 26c3dc456, JOIN-9 · 14) | (ii) re-keyed by identity | 136 of 136 |
| `tests/domain/defenseInvasionWithinACriticalBand.test.js` | 2 of 3 | **07ebe8bdc** (COHERENCE-UPKEEP, "the five upkeep gates read the one home", a DECLARED move of the readiness labels; landed at 33b12cbef, JOIN-1 · 9) | (ii) re-keyed by identity | 3 of 3 |
| item 3: `captureBirthScale`, `tierInertiaEnvelope` | — | — | waiting on the chair's word "THE ENVELOPES AT <tip>" | — |

**After the record cures landed** (lane/tail-record at 7ac689418, JOIN-11 point 8): the joined line at ffdd541a0 merged
into this branch (d5c5b922f, a merge, no rebase); both files re-run alone there: 139 of 139 green. The economic
rating's cap and the rounded magic share move none of the five re-keyed towns out of their case.

## How each turning commit was found

- **corpusEcoTailGuards** — bisect of the three rows over the line's first-parent points from the file's landing
  (c66793f6f, green) to 22b3cc82e: first red 26c3dc456 (merge of lane/tail-defecon at ad5720386). Inside that
  lane: e1577f2cd green, 9cc8c6826 red.
- **defenseInvasionWithinACriticalBand** — red already at its own landing (4ebe3d6cb) and green at its lane's tips
  (6b74eb2aa, 68e9e97b5): the line beneath it turned it. Line bisect 64fe60ead (green) .. 282ccd34f: first red
  33b12cbef (merge of lane/coherence-upkeep at c56fd565e). Inside that lane, from its base 976db5b19 (green):
  07ebe8bdc.

## The re-keys (the claim of each row unchanged)

| row | was | now | why the old town left the case |
| --- | --- | --- | --- |
| GONE · DS-ECO-12 INCOME MIX: a broad spread, no leader (v1; "none brings in a real portion" beside a leader ≥ 15%) | r2r-city-19 | r2r-city-18 (a city, leader 19%, v1) | its smuggling row is now 23%: the leader passes 20 and the town reads "two or three sources" |
| KEEP · one source carries the town v2 ("the largest town v2 reaches") | r2s-mass_migration-town-2 | r2s-mass_migration-village-0 | smuggling 33%: "two or three sources"; no town or larger draws v2 on the 720 now, the largest is a village |
| KEEP · a criminal line is present v2 | r2s-wartime-metropolis-3 | r2r-metropolis-27 (a syndicate at 20%) | its syndicate row is now 21%: "the criminal line leads" |
| the Invasion row's two REAL towns beside a Critical band | rr3-thorp-occupied-rand-1, rr3-town-occupied-rand-4 | r2s-occupied-thorp-0, r2r-thorp-8 | they read WEAK and ADEQUATE; of the 720, 221 read Critical and the towns of the case (Critical, drawing a claiming pool once above it) are twelve thorps with walls and townspeople |

The two re-keyed KEEP anchors are computed through `tests/helpers/drawnProse.js` (`memberRe`), not literal sentences.

## Proof at the push

The red alone before and after (above); eslint on both files: clean; the two walkers
(`negativeAssertionAnchor.walker`, `seedLoopTotality.walker`) alone: 18 of 18 green. The type check:
`tsconfig.full.json` excludes `tests/`, so neither touched file is in its compilation (its 167 errors are the
ratcheted debt elsewhere; none names either file).

## THE OWNER'S PART, in plain words

1. **Three economy guard rows now point at different towns.** Last night's "one shadow figure" fix (9cc8c6826)
   raised the criminal share of three census towns, so they no longer showed the income mix each row was
   written about. Each row now reads a town that does (r2r-city-18, r2s-mass_migration-village-0,
   r2r-metropolis-27). One thing you may want to know: since that fix, the line "almost everyone's living
   depends on one trade" no longer appears in any census town larger than a village.
2. **The "no hold claimed beside a Critical band" guard now reads two different thorps.** The upkeep lane's
   rebuild of the readiness labels (07ebe8bdc) lifted the two towns it read out of Critical (to Weak and
   Adequate). It now reads two census thorps that are Critical and would otherwise say "credible against
   raiders" / "would see off a raid": r2s-occupied-thorp-0 and r2r-thorp-8. On the census, only thorps with
   walls and townspeople are in that position now.
