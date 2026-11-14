# UPKEEP-MONOTONE-BUILD: the defence rating made monotone, built as measured (UPKEEP-13's hand-back, kept current)

Seat UPKEEP-13, 2026-11-14, for the chair (session_01ACmDYZrFEVXyZEUg1NDxxC). Brief:
docs/chair/2026-11-14/briefs/BRIEF-UPKEEP-13.md on lane/chair-2026-11-08. Branch: **lane/upkeep-monotone-2026-11-14**,
cut from the defence lane's tip **26474cda9** as first read (the lane moved to ffe0750d4, then 9c32016c9, by
UPKEEP-12: not a stop). Worked in a scratch worktree on the local branch `upkeep13-own` (the checkout's own local
branch already bore the side branch's name), pushed by explicit refspec. Every figure here is EXECUTED unless it
says PLAUSIBLE.

## The rulings worked to (copied from the brief; the chair's of 2026-11-14 08:58 UTC, each vetoable by the owner)
1. P2: build the chair's candidate: the first limit held SCORE BY SCORE, and readiness's sustaining total held to
   the force on the limit's own line.
2. P3: build as measured: the thirteen houses placed as the measure's table places them. The cross-ladder order it
   names (a village's Weekly market above a town's Market square) is NOT built: named, for a later measure.
3. P4: build the form, at ONE point a person (`people.milPerHead: 1`, with its reason row); two points a person
   stays shown beside it for the owner.
4. X1 to X5 and X9: built with P2.
5. P5: the score stands and the line moves: NOT this seat's (the display seat's).
6. Scope: a house of crime lowers order by design (the monotone law does not reach it); the six renames across a
   function or a government are not "a larger house of its own kind": both LISTED here, not cured.
- 09:09 UTC: merge the defence lane's tip (UPKEEP-12's H1) early, before the buckets file is touched: done (b42be5de9).
- 10:40 UTC: the Scroll scribe and the Enchanter's shop join `magicDef` (UPKEEP-12's M3/M5), its own commit,
  measured and declared: done (a88b5b343). Merge the lane's tip when the next item is green.

## The instruments (outside every repository tree; re-made as below)
- The guard: `tests/generators/defenceMonotone.test.js` (the reader's set over the reader's 972 births).
- The measure's probes (lane/upkeep-measure-2-2026-11-14, probes/UPKEEP-MEASURE-2), copied out; `born.mjs` given a
  `NOREC` switch (summary rows only); `measure.sh <sha> <label> <prev>` births the 3,756 and the 972 at a detached
  tree, runs mono2 and the guard. **THE CENSUS'S 720 is the page census's plan** (`r2r-*`, `r2s-*`: the reader's
  972 less its 252 `rv5` births), NOT the corpus's `fresh6`: the measure's c2 census row (55 moved, min -3) is
  re-made exactly on it, and on `fresh6` the same tree moves 37.
- The probe reproduced at the base byte for byte (sorted mono2 ndjson equal to results/mono2.tip.ndjson.gz).

## The commits, each one cause (guard: changes with a fall in the reader's set, births; widened set)
| commit | cause | guard | widened | 3,756: readiness moved / bands; score bands; powers; threats (vs the previous commit) |
|---|---|---|---|---|
| 1ea3ef45a | the guard, RED at the base | 1,751 in 292 | 5,195 in 604 | (test only) |
| b42be5de9 | merge ffe0750d4 (H1, the label) | 1,751 in 292 | | 0 / 82 (Undefended -> Vulnerable); 0; 82; 0 |
| 7fd82a164 | P2 (c2.patch) | 61 in 35 | 2,463 in 496 | 279 (3 up, 276 down) / 22; 425; 22; 141 |
| b49b871fd | X1 the will's hold score by score | 23 in 23 | 2,588 in 498 | 433 / 51; 207; 40; 21 |
| fa643850b | X4 the will's floor | 23 in 23 | 2,047 in 493 | 238 (all up) / 30; 62; 26; 15 |
| 5c1e69750 | X2 the traditions' cap on counted points | 22 in 21 | 2,046 in 493 | 22 / 2; 3; 2; 0 |
| 3d463ce0b | X3 the siege's two reliefs | 22 in 21 | 2,044 in 491 | 52 / 1; 8; 1; 4 |
| 1f6cc23d0 | X5 "monasteries" | 3 in 2 | 2,025 in 481 | 99 / 11; 7; 11; 2 |
| 2212a735e | X9 hundredths | **0** | 2,022 in 480 | 14 / 0; 0; 0; 0 |
| bb0aaa3fe | P3 (c3.patch) | 0 | 2,022 in 480 | 271 / 24; 49; 24; 5 |
| a88b5b343 | magicDef: Scroll scribe, Enchanter's shop | 0 | | 0 / 0; 0; 0; 0 (only `defenseProfile.institutions.magicDef` moves: 898 of 3,756 records, 214 of 972; the chair's 7 go from empty to held) |
| 7509b3794 | P4 at 1 a person (`people.milPerHead`) | 0 | 2,020 in 480 | 385 (all down) / 66; 256; 14; 0 |

X1 and X4 are one hunk of the measure's cx.patch, split because the measure names them as two causes. X2 is kept
as measured although I would have removed `tradF` (left at 1). The only word changed in any hunk is the
comment attribution (the chair's ruling, not "the chair's candidate").

## Beside the measure's own figures
- **P2 alone** (vs the merged tip): readiness 279 (3/276), score bands 425, threats 141, guard 61 in 35, widened
  2,463 in 496: the measure's own. Bands 22 and powers 22 against its 23/23: the one Vulnerable -> Undefended birth
  H1 holds at Vulnerable. Census: 55; 82 score bands; 34 threats: the measure's; 7 bands and 7 powers against 8/8,
  the same hold.
- **P2 + X1..X5**: guard 3 in 2; widened 2,025 in 481; readiness 717 (217/500), mean -0.13; score bands 622;
  threats 171: the measure's own. Bands 73 and powers 58 against 80/65: exactly its 7 Vulnerable -> Undefended.
  Census: 125; 119; 39: the measure's; bands 16, powers 15 against 18/17 (its 2 V -> U).
- **ALL** (vs the merged tip): readiness 1,214 (249 up, 965 down), mean -0.61; score bands 889; threats 176;
  census 208; 166; 39: the measure's own. Bands 153 against 214, powers 94 against 157. CLASSED BIRTH BY BIRTH
  against the measure's ALL tree re-made (call.patch on 26474cda9): every score of every birth is equal; the 61
  bands only the measure moves are all Vulnerable -> Undefended that H1 holds at Vulnerable; the 63 powers only
  the measure re-draws are those 61 and two Lightly Defended -> Undefended (Vulnerable here): each a label
  difference. Source: my four files equal call.patch to the line, plus H1, the magicDef row and the attributions.
- Undefended on the 3,756: 464 at the base, 534 under the measure's ALL; with H1 382 at the merged tip, 389 here.

## Left (line by line), as of 7509b3794
- Step 3: the pins the build moves (defenceParts.test.js and kin; tests/lint/defenceDerived.walker.test.js), re-keyed by
  identity. NOT YET RUN on the build.
- Step 4: merge the defence lane's tip (9c32016c9: UPKEEP-12's H2, #115, #216, docs; none of the four files), then the
  guard and the final measure on the 3,756 and the 720.
- Step 5: the message to the chair. Step 6: the declaration (field diff by family on the 720), the tuning inventory by
  its ritual (one row added), section 2m's five doors, the golden surfaces as files for one draft shift record.
  Step 7: the eight towns for the owner. Step 8: this file finished.

## Named, not built
- P3's cross-ladder order (ruling 2). P4's precise word for "held to its people" (would be new: PARKED; P4 rides the
  fullness line's "more than enough, held in reserve"). P5's lines (the display seat's).
- Outside the law by ruling (6): the 13 criminal houses (order falls by design) and six renames (Citizen militia ->
  Town watch / Professional city watch; Lord's steward -> Lord's appointee; Village reeve -> Town council; Wizard's
  tower -> Mages' guild; Traveling hedge wizard -> Hedge wizard): the widened set's 2,020 falls in 480 births.

## Stops
None. The count field (get_session's context_usage.used_tokens) read 264,797 at both checks (09:46, 10:31): it
looks stale; the seat works on, and says so.
