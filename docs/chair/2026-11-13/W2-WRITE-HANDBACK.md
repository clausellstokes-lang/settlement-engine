# W2-WRITE — the hand-back (the writing lane's first seat)

**Lane:** `lane/w2-write-2026-11-13`, cut from `lane/w2-a-leaves-2026-11-12` at `2c6435650` in a scratch worktree; the main checkout untouched.
**Status:** IN PROGRESS — this file is brought current after every stage; a second seat continues from it.

## Merges
| sha | what |
|---|---|
| 202e58953 | W2-B-DECLARE at 9d5d6e091 (the first act). Both lanes touched `docs/content/wiring-census.json` (generated: took A's side, re-ran its door; producerIndexFiles 1333 -> 1335) and `scripts/mutation-coverage-manifest.json` (hand-kept, row-keyed: git kept all four new rows). |
| e5cefd7cf | W2-A-LEAVES at 96d698de7 (the chair's word, 2026-11-13). It touched neither the corpus nor its leaves; only the wiring census overlapped (door re-run). |

## Measure first: the gap list re-taken at the base (202e58953)
The mapping seat's own `depth.mjs` (lane/layer-map-2026-11-12), over the census's 720 (births by `census.sh` at the base):
592 cases; **33 with no line on a player's page (slot 1, audience 13, gates 19), 19 on the owner's**; 237 under three (owner 238).
(The brief's 32 / 18 were the map's figures at 5f1dd0397; the merged base adds one each.)

## Stage 1 — no case empty
| sha | family | lines | measured (depth.mjs, the census's 720) |
|---|---|---|---|
| d7ca1936e | DS-GEN-9 event types (8 pools) | 24 | anchored cases 1-3 -> 4-6; the ten anchor-unanswered cases STAY 0 (kernel law 5, below) |
| 2f156207f | DS-GEN-5 / DS-GEN-6 `river` on a coast | 9 (+ the pool's `river` moved onto each of 8 lines) | coast cases 0 -> 3 (21, 11, 10 towns) |
| 63791bdb4 | DS-GEN-3 Undefended, military CRITICAL | 6 | {walls, militia, no garrison} 0 -> 3; {walls, threat, no gate} 0 -> 3 |
| c85805ea0 | DS-FTH-4 heresy hunted / preached | 6 | {no temple} 0 -> 3 each; {temple} 2 -> 5 |
| 6fa03f9f1 | DS-POW-6 commander advisory | 3 (dm-only) | owner {no commander} 0 -> 3 |
| b18ef2a3f | DS-ECO-6 significant off-book | 3 | player {no guild} 0 -> 3 |

After stage 1: **player 33 -> 24, owner 19 -> 11.** What is left:
- **10 cases, DS-GEN-9 with the marker event's `anchored` absent** (owner and player). NOT CURABLE IN THE CORPUS: `stateProseKernel.js :: eligibleVariants` (law 5) silences a WHOLE pool that partitions by a dimension the desk did not answer, and `generalStateProse.js :: eventAnchorDimension` answers `null` for an absent flag. The 24 lines written carry no anchor word and would speak there. REQUEST (W2-B-DECLARE, the kernel or the desk): for an unanswered dimension, admit the variants that carry no word of it (they are true in every value) instead of silencing the pool; or answer the event's anchor from its leaf.
- **1 case, DS-CND-1 PROVENANCE (causes populated; 478 towns, owner and player): PARKED.** Every line names `{reason}`, which has no producer. Three `{reason}`-free lines were written and withdrawn: `tests/domain/stressorsStateProseDesk.test.js` pins "the TRACED-provenance pool is ROUTED but silent" ("a {reason}-free variant exists" reds), a desk ruling and not a count, outside this lane's allowance. The lines, ready for the owner's veto and the chair's word: `[local]` People in {settlement} can say what started this, and they say it plainly, without guessing. · `[ledger]` {settlement}'s accounts set down what began this, so the trouble has a cause on paper as well as in talk. · `[visitor]` Nobody in {settlement} wonders how this began; what they wonder is how long it will go on. RECOMMEND: the chair rules the pin re-keyed (the silence was "the honest state" only while no `{reason}`-free line existed); then they land as one commit.
- **13 cases empty only to the player**: covert pools, silent by §0e (the call below).

## Calls taken without the chair
1. **The thirteen cases empty only to the player are covert pools, and stay silent.** DS-POW-6 capture ADVANCING / RECOVERING, DS-ECO-12 criminal income (present, leads), DS-ECO-6 underground house, large share off the books, arcane black market, theocratic economy, DS-POW-5 criminal, DS-POW-6 commander advisory: every line is `dm-only` by §0e ("a page over a state with a covert seam must be byte-identical to a page over a state that genuinely lacks one"). A player line there would leak the covert state; the owner's view has 2-5 lines in each. The mapping seat's own table counts the owner view as the cases a writer must fill. The one player-visible pool among them with a covert gap (DS-ECO-6 significant off-book, whose canonical line is player-audible) WAS filled.
