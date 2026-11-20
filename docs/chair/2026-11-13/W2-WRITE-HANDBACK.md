# W2-WRITE — the hand-back (the writing lane's first seat)

**Lane:** `lane/w2-write-2026-11-13`, cut from `lane/w2-a-leaves-2026-11-12` at `2c6435650` in a scratch worktree; the main checkout untouched.
**Status:** the first seat is DONE (the chair, 05:05 UTC). Stages 1 and 2 landed; stage 3 and the cold list went to the second seat, which writes its own hand-back. The chair RULED the two parked items: DS-CND-1 traced provenance STAYS SILENT until `{reason}` has a producer (retired from the gap list by name; the three withdrawn lines stay withdrawn); the ten DS-GEN-9 law-5 cases go to the instrument's seat as a code request.

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

## Stage 2 — the corpus's share of the false lines (CORPUS-SHARE.json, 49 rows)
| sha | family | rows | what |
|---|---|---|---|
| 901e4d441 | DS-DEF-3 districts (14c) | 4 printed false | `population: ≥ middling` on insurgency v1, v3 and political fracture v1, v3; 4 lines that name no district |
| 4efcd2b30 | DS-POW-5 crimeIsGovt (NEW-V9) | 1 printed false | v1 "no law but the gang bosses'" declares `no guardPresence`; 1 line for a guard the bosses run |
| e949ca9a5 | DS-ECO-12 religious houses (8, income half) | 1 printed false (+ v1, same words) | v1, v2 declare `sacredHouse`; 3 lines for a place with no house (the worked example of the procedure's §11) |
| 6e296ed51 | DS-DEF-9 (13) | the census's pattern 13 (172 towns) | the repeated clause cut: "...more slowly and less comfortably." |
| b9ae6d233 | the key-implied words | 21 unreached | granary, coast, occupation, garrison, war declared on 20 lines; 3 DS-ECO-8 full-stores lines with no granary (the key is the food bonus, not a granary: found by the economy desk's own test) |

**Rows left WAITING, each with the condition it needs (not invented here):**
| rows | pool | word | the condition it needs |
|---|---|---|---|
| 1 | DS-ECO-9 SECURE v3 "fed, but only just" (57 towns, 1a) | onlyJust | an atom over the food record's `growsMoreThanEats` (a `factsOf` reader; registeredWords names the leaf) |
| 1 | DS-ECO-9 SECURE v1 "with a small margin" (64 towns, 1b) | smallMargin | an atom over the food record's `normalImportPct` |
| 5 | DS-DEF-9 magicDependency false v2; true v1, v3, v4; NAMED chain v2 (pattern 3) | practitioner | the practitioner atom (`magicReliance.js :: magicPractitioners`) |
| 2 | DS-ECO-12 INCOME WEIGHT: the practice of magic v1, v2 (NEW-2) | practitioner | the same atom |
| 1 | DS-ECO-11 EXPLOITATION fullyExploited v1 "{institution} finishes it" (8 towns, NEW-V3) | mill | NOT the line's: the desk fills `{institution}` with a catalogue name ("Mill") the roster lacks. The fill must read the roster's own processing house (the desk is W2-B-DECLARE's / the chain card's leaf is W2-A's); a declaration on the line would gate the wrong thing |
| 2 | DS-DEF-6 Court + Prison v3 | court, prison | the registered words carry no atom yet (the vocabulary has `court` / `prison` dimensions on the defence home; registeredWords must point at them) |
| 1 | DS-HK-1 clock faction_split v2 "Two powers" | powersCount | a count atom (no `factsOf` reader) |
| 6 | DS-DEF-2 (5 rows) and DS-DEF-6 Medical None v1 | plague, famine | none: each names a plague or famine as a HYPOTHETICAL ("a plague here runs until it has finished"), not a state in force. Declaring the crisis would gate on something the line does not state. Recommend: banked as another sense, with this reason, by the walker's owner |
| 3 | DS-CND-1 FAMILY: occupation layer v1-v3 | garrison, occupation | none: the occupier's own garrisons and accounts (read in another sense); the condition family does not imply the town's garrison or the occupied crisis. Same recommendation |

## Done-means, measured (the procedure's §7)
- **The gap list, base against tip** (the mapping seat's `depth.mjs`, the census's 720): cases with none **33 -> 24 (player), 19 -> 11 (owner)**; under three **237 -> 221**. What is left of the empties: the 10 GEN-9 law-5 cases (a code request), DS-CND-1 provenance (parked), and the 13 covert player-only cases (§0e, call 1).
- **The page measure by vocabulary** (W2-B-DECLARE's `pagemeasure.mjs` + `classify.mjs` over the census's 720 rendered dossiers, six sizes, calm and fifteen forced crises; base `a98e459f0` against the tip): findings 1,367 -> 1,273; **corpus findings 181 -> 162, none from a line this lane wrote or changed**. The 162 left are the waiting rows above: DS-DEF-9's practitioner lines (122 + 16 + 11 + 4) and DS-ECO-12 magic (1), and DS-ECO-11's `{institution}` fill (8).
- **The census counter, base against tip** (`census.sh` + `compare.mjs`, the census lane's instrument): **no count rises, no new row**; pattern 13 **172 -> 0** (BETTER); every other row equal; median rows per town 6.84 -> 6.6; GLANCE towns excluding 17/18 623 -> 586.
- **The top line's share** (the mapping seat's measure) for every pool touched: none above three draws in four; DS-ECO-6 significant off-book 0.816 -> 0.265, DS-GEN-9 disaster 0.894 -> 0.223, occupation 0.625 -> 0.202; corpus pools at ≥ 0.75 over the 192 drawn 30+ times: 8 -> 7.
- **The six golden surfaces**: `W2-WRITE-SHIFT-RECORD-DRAFT.md` beside this file — the dossier prose manifest MOVES (+96 drift rows); the other five UNMOVED.
- **Gates at every commit**: check-domain-strict exit 0, typecheck:ratchet exit 0, eslint on touched tests exit 0; five pushes through the lane hook, each exit 0.
- **The new lines for the owner's veto**: `W2-WRITE-NEW-LINES.md` beside this file (62 new, 37 changed, by pool).

## Calls taken without the chair
1. **The thirteen cases empty only to the player are covert pools, and stay silent.** DS-POW-6 capture ADVANCING / RECOVERING, DS-ECO-12 criminal income (present, leads), DS-ECO-6 underground house, large share off the books, arcane black market, theocratic economy, DS-POW-5 criminal, DS-POW-6 commander advisory: every line is `dm-only` by §0e ("a page over a state with a covert seam must be byte-identical to a page over a state that genuinely lacks one"). A player line there would leak the covert state; the owner's view has 2-5 lines in each. The mapping seat's own table counts the owner view as the cases a writer must fill. The one player-visible pool among them with a covert gap (DS-ECO-6 significant off-book, whose canonical line is player-audible) WAS filled.
2. **Count pins re-keyed by identity with the cause, every commit** (the brief's allowance): the corpus totals (composeStateProse, proseComposed, proseWiringCensus: variants, mean, histogram, tiers), warFaith's variant total, proseEntryContradiction's row/join counts and its report-only trailing-coordinate count, the wave gate's units compared, the shift register's five pins (`docs/content/prose-shift-register.json`: variant and face counts, the vids digest — appended vids, nothing renumbered), and the two annex line anchors, now re-addressed by their BASE text (one had drifted silently at b18ef2a3f because the arm it anchors fires on no row; corrected in e949ca9a5).
3. **proseComposed's A0b under-claim ceiling (UNDER_CLAIM_OWED 515 -> 560) and its pools-carrying-a-finding (302 -> 303)** rise with the new lines' own per-line debt: a new line that names less than its pool's census reads owes what its siblings owe (the SW-B5 precedent). Over-claims stay 45 (no new line claims a field the census does not license).
4. **generalStateProseDesk's MEASURED RESIDUE arm re-keyed** from "the religious silence holds" to "it is cured": its own text names "a corpus or ladder act" as the cure (d7ca1936e).
5. **The prose byte baseline** (`scripts/.prose-byte-baseline.json`) grows through declared rows (the ratchet's own idiom; every leaf far under its ceiling). CORRECTION, said out loud: three commit messages say the growth sat "under the chain's end, no declared row owed" where the commit in fact banked ONE declared row — 2f156207f (general), 63791bdb4 (general), b18ef2a3f (economy). The rows are correct; the messages are wrong. (c85805ea0 and 6fa03f9f1 were amended or are right: no row.)
6. **Registers that shrink with a cured line**: the hand-kept presumed-things register loses the 16 rows its lines' declarations cured (matched by file, thing and text, b9ae6d233); the widened register through its door `--shrink` (5 + 3 + 6 rows) — its first run also removed one stale row that was not this lane's (`defenseDisplay.js` "under siege the outlying fields are lost", cured by W2-A-LEAVES's pattern 20: the base's merge-born "no stale row" red, now green); the undeclared-lines register through its door (`RETAKE_DECLARATION_REGISTERS=1`: two counts fell).
7. **New lines with no registered word carry `colour`** in non-colour pools (the undeclared-lines register is shrink-only: an undeclared line in a non-colour pool reds it).
8. **The lane's gap list was re-taken at the merged base**, not the map's commit (the brief's 32 / 18 are the map's).
9. **A scratch measurement base** (`a98e459f0`, local, never pushed: 202e58953 + W2-A-LEAVES 96d698de7, the wiring census through its door) so the census counter and the goldens compare the lane's writing alone.

## Merge-born reds at the base (not this lane's; both lanes' files)
At 202e58953 (and still at the tip), red and NOT red on either parent alone:
- `tests/lint/presumedThings.walker.test.js` › every source literal declares (six hits: W2-B's widened walker reading W2-A's new `pageCensusFindings.js` and `defenseDisplay.js` literals; three more at 96d698de7's `pageCensusFindings.js` / `factLayers.js`). The register is W2-B's door; the literals are W2-A's instruments (a page instrument names words by design: W2-A's reader arm already exempts `src/domain/coherence/`). RECOMMEND: the same exemption in the presumed-things walker, or banked by its door.
- `tests/lint/factLayers.walker.test.js` › READERS: `narrativeGenerator.js` faith 6 -> 5 (W2-B's church-note cure removed a private reader; W2-A's register banks 6). RECOMMEND: lowered through its door.
- (green now) presumedThings › no stale row: cured by the door's shrink (call 6).
The other base reds of the corpus set (proseComposed FAIL LIMB, proseWaveGate (d) x3, proseTasteInterested x3, sovereigntyLighting, dossierProseManifest x3) stand at the base unchanged.

## THE SECOND SEAT'S ORDER (the chair's messages of 2026-11-13 03:58 and 04:12 UTC, read after stage 2 had landed)
1. **FIRST: the reviewer's cold list** (`git fetch origin lane/review-w2b-2026-11-13`; `docs/chair/2026-11-13/REVIEW-W2B-COLD-LIST.json`, 361 false lines, 124 of them corpus variants; `REVIEW-W2B-COLD-CLASSES.md` §4 names the ten worst blocks: DS-GEN-18 BOUGHT-IN v1, v4, v5, v6 and STALLED v2; DS-ECO-1 COMBINATION C4 v1-v3; DS-POW-6 capture ADVANCING v1, v3; ...). Per false variant: read the towns it is false in; declare the disqualifier for each thing, state, size, count or figure that makes it false there (a line for normal times is disqualified under the crisis that breaks it); where a case is left with no line, write one true in it; never delete a line true somewhere. Hand back per variant: the fixture towns it printed false in, before and after, and what they print now. NOT STARTED by this seat.
2. **The chair's reading law, applied to THIS seat's lines too**: section 3 step 2 is done BY READING (house, role, force, resource, state, size, count, figure, registered or not); a line that presumes normal times is disqualified under each crisis that makes it false; and each new line read against one town of each case it can print in, the town named. This seat declared every REGISTERED word and every thing it saw on reading its own lines; it did NOT do the per-town read. The machine-picked town per case for each of its 62 new lines is below (from the case probe at the tip; "(n)" = towns in the case): the second seat reads each and records the verdict.
3. Then the cases with no line (above); then three for every case (below).

**The towns to read each new line against (one per case it prints in):**
| line | case → town (towns in case) |
|---|---|
| DS-ECO-6::TIER: significant off-book activity (≥15) v4 | {"guild":0,"market":0,"thing market":"absent"} → r2r-thorp-10 (20) · {"guild":0,"market":1,"thing market":"present"} → r2r-village-55 (3) · {"guild":1,"market":1,"thing market":"present"} → r2r-town-0 (102) |
| DS-ECO-6::TIER: significant off-book activity (≥15) v5 | {"guild":0,"market":0,"thing market":"absent"} → r2r-thorp-10 (20) · {"guild":0,"market":1,"thing market":"present"} → r2r-village-55 (3) · {"guild":1,"market":1,"thing market":"present"} → r2r-town-0 (102) |
| DS-ECO-6::TIER: significant off-book activity (≥15) v6 | {"guild":0,"market":0,"thing market":"absent"} → r2r-thorp-10 (20) · {"guild":0,"market":1,"thing market":"present"} → r2r-village-55 (3) · {"guild":1,"market":1,"thing market":"present"} → r2r-town-0 (102) |
| DS-ECO-8::FOOD AND PROSPERITY: full stores lift the town v4 | not reached on the 720 |
| DS-ECO-8::FOOD AND PROSPERITY: full stores lift the town v5 | not reached on the 720 |
| DS-ECO-8::FOOD AND PROSPERITY: full stores lift the town v6 | not reached on the 720 |
| DS-ECO-12::INCOME WEIGHT: the religious houses v3 | {"sacredHouse":0} → r2r-thorp-0 (74) |
| DS-ECO-12::INCOME WEIGHT: the religious houses v4 | {"sacredHouse":0} → r2r-thorp-0 (74) |
| DS-ECO-12::INCOME WEIGHT: the religious houses v5 | {"sacredHouse":0} → r2r-thorp-0 (74) |
| DS-DEF-3::COMPOUND: insurgency v4 | {"guardPresence":0,"population: ≥ middling":0} → r2r-thorp-22 (12) · {"guardPresence":1,"population: ≥ middling":0} → r2r-thorp-25 (4) · {"guardPresence":0,"population: ≥ middling":1} → r2r-village-34 (1) · {"guardPresence":1,"population: ≥ middling":1} → r2r-town-3 (18) |
| DS-DEF-3::COMPOUND: insurgency v5 | {"guardPresence":1,"population: ≥ middling":0} → r2r-thorp-25 (4) · {"guardPresence":1,"population: ≥ middling":1} → r2r-town-3 (18) |
| DS-DEF-3::COMPOUND: political fracture v4 | {"population: ≥ middling":0} → r2r-hamlet-4 (20) · {"population: ≥ middling":1} → r2r-city-7 (18) |
| DS-DEF-3::COMPOUND: political fracture v5 | {"population: ≥ middling":0} → r2r-hamlet-4 (20) · {"population: ≥ middling":1} → r2r-city-7 (18) |
| DS-GEN-3::scores.military: CRITICAL v4 | {"crisis: any":1,"crisis: threat":1,"crisis: wartime":0,"gate":0,"walls":1,"dim walls":"walls"} → r2r-thorp-1 (5) · {"crisis: any":1,"crisis: threat":0,"crisis: wartime":0,"gate":1,"walls":1,"dim walls":"walls"} → r2r-town-7 (2) · {"crisis: any":1,"crisis: threat":1,"crisis: wartime":0,"gate":1,"walls":1,"dim walls":"walls"} → r2s-occupied-town-0 (3) |
| DS-GEN-3::scores.military: CRITICAL v5 | {"crisis: any":1,"crisis: threat":1,"crisis: wartime":0,"gate":0,"walls":1,"dim walls":"walls"} → r2r-thorp-1 (5) · {"crisis: any":1,"crisis: threat":0,"crisis: wartime":0,"gate":1,"walls":1,"dim walls":"walls"} → r2r-town-7 (2) · {"crisis: any":1,"crisis: threat":1,"crisis: wartime":0,"gate":1,"walls":1,"dim walls":"walls"} → r2s-occupied-town-0 (3) |
| DS-GEN-3::scores.military: CRITICAL v6 | {"crisis: any":1,"crisis: threat":1,"crisis: wartime":0,"gate":0,"walls":1,"dim walls":"walls"} → r2r-thorp-1 (5) · {"crisis: any":1,"crisis: threat":1,"crisis: wartime":0,"gate":0,"walls":0,"dim walls":"no walls"} → r2r-thorp-5 (38) · {"crisis: any":1,"crisis: threat":1,"crisis: wartime":0,"gate":1,"walls":1,"dim walls":"walls"} → r2s-occupied-town-0 (3) |
| DS-GEN-3::defenseProfile.readiness.label: Undefended v3 | {"garrison":0,"militia":1,"walls":1,"dim walls":"walls","thing militia":"present","thing walls":"present"} → r2r-thorp-1 (15) |
| DS-GEN-3::defenseProfile.readiness.label: Undefended v4 | {"garrison":0,"militia":1,"walls":1,"dim walls":"walls","thing militia":"present","thing walls":"present"} → r2r-thorp-1 (15) · {"garrison":0,"militia":0,"walls":1,"dim walls":"walls","thing militia":"absent","thing walls":"present"} → r2r-town-7 (1) |
| DS-GEN-3::defenseProfile.readiness.label: Undefended v5 | {"garrison":0,"militia":1,"walls":1,"dim walls":"walls","thing militia":"present","thing walls":"present"} → r2r-thorp-1 (15) · {"garrison":0,"militia":1,"walls":0,"dim walls":"no walls","thing militia":"present","thing walls":"absent"} → r2r-village-50 (2) |
| DS-GEN-5::river v5 | {"coast":1,"river":0} → r2r-thorp-22 (21) |
| DS-GEN-5::river v6 | {"coast":1,"river":0} → r2r-thorp-22 (21) |
| DS-GEN-5::river v7 | {"coast":1,"river":0} → r2r-thorp-22 (21) |
| DS-GEN-6::river v5 | {"coast":1,"river":0,"dim deficit":"no deficit"} → r2r-thorp-22 (10) |
| DS-GEN-6::river v6 | {"coast":1,"river":0,"dim deficit":"no deficit"} → r2r-thorp-22 (10) |
| DS-GEN-6::river v7 | {"coast":1,"river":0,"dim deficit":"no deficit"} → r2r-thorp-22 (10) |
| DS-GEN-6::river v8 | {"coast":1,"river":0,"dim deficit":"deficit"} → r2r-village-21 (11) |
| DS-GEN-6::river v9 | {"coast":1,"river":0,"dim deficit":"deficit"} → r2r-village-21 (11) |
| DS-GEN-6::river v10 | {"coast":1,"river":0,"dim deficit":"deficit"} → r2r-village-21 (11) |
| DS-GEN-9::event type: disaster v5 | {"dim anchor":"anchored"} → r2r-thorp-13 (85) · {"dim anchor":"-"} → r2r-thorp-34 (9) |
| DS-GEN-9::event type: disaster v6 | {"dim anchor":"anchored"} → r2r-thorp-13 (85) · {"dim anchor":"-"} → r2r-thorp-34 (9) |
| DS-GEN-9::event type: disaster v7 | {"dim anchor":"anchored"} → r2r-thorp-13 (85) · {"dim anchor":"-"} → r2r-thorp-34 (9) |
| DS-GEN-9::event type: political v5 | {"dim anchor":"anchored"} → r2r-thorp-0 (131) · {"dim anchor":"-"} → r2r-thorp-3 (20) |
| DS-GEN-9::event type: political v6 | {"dim anchor":"anchored"} → r2r-thorp-0 (131) · {"dim anchor":"-"} → r2r-thorp-3 (20) |
| DS-GEN-9::event type: political v7 | {"dim anchor":"anchored"} → r2r-thorp-0 (131) · {"dim anchor":"-"} → r2r-thorp-3 (20) |
| DS-GEN-9::event type: economic v5 | {"market":0,"dim anchor":"anchored","thing market":"absent"} → r2r-thorp-1 (37) · {"market":1,"dim anchor":"anchored","thing market":"present"} → r2r-hamlet-15 (57) · {"market":0,"dim anchor":"not anchored","thing market":"absent"} → r2r-hamlet-21 (6) · {"market":0,"dim anchor":"-","thing market":"absent"} → r2r-hamlet-34 (9) · {"market":1,"dim anchor":"not anchored","thing market":"present"} → r2r-town-38 (2) · {"market":1,"dim anchor":"-","thing market":"present"} → r2s-recently_betrayed-village-3 (1) |
| DS-GEN-9::event type: economic v6 | {"market":0,"dim anchor":"anchored","thing market":"absent"} → r2r-thorp-1 (37) · {"market":1,"dim anchor":"anchored","thing market":"present"} → r2r-hamlet-15 (57) · {"market":0,"dim anchor":"not anchored","thing market":"absent"} → r2r-hamlet-21 (6) · {"market":0,"dim anchor":"-","thing market":"absent"} → r2r-hamlet-34 (9) · {"market":1,"dim anchor":"not anchored","thing market":"present"} → r2r-town-38 (2) · {"market":1,"dim anchor":"-","thing market":"present"} → r2s-recently_betrayed-village-3 (1) |
| DS-GEN-9::event type: economic v7 | {"market":0,"dim anchor":"anchored","thing market":"absent"} → r2r-thorp-1 (37) · {"market":1,"dim anchor":"anchored","thing market":"present"} → r2r-hamlet-15 (57) · {"market":0,"dim anchor":"not anchored","thing market":"absent"} → r2r-hamlet-21 (6) · {"market":0,"dim anchor":"-","thing market":"absent"} → r2r-hamlet-34 (9) · {"market":1,"dim anchor":"not anchored","thing market":"present"} → r2r-town-38 (2) · {"market":1,"dim anchor":"-","thing market":"present"} → r2s-recently_betrayed-village-3 (1) |
| DS-GEN-9::event type: religious v5 | {"institution: temple":0,"dim anchor":"anchored"} → r2r-thorp-2 (17) · {"institution: temple":1,"dim anchor":"anchored"} → r2r-thorp-11 (68) · {"institution: temple":0,"dim anchor":"-"} → r2r-thorp-49 (5) · {"institution: temple":1,"dim anchor":"-"} → r2r-village-10 (6) |
| DS-GEN-9::event type: religious v6 | {"institution: temple":0,"dim anchor":"anchored"} → r2r-thorp-2 (17) · {"institution: temple":1,"dim anchor":"anchored"} → r2r-thorp-11 (68) · {"institution: temple":0,"dim anchor":"-"} → r2r-thorp-49 (5) · {"institution: temple":1,"dim anchor":"-"} → r2r-village-10 (6) |
| DS-GEN-9::event type: religious v7 | {"institution: temple":0,"dim anchor":"anchored"} → r2r-thorp-2 (17) · {"institution: temple":1,"dim anchor":"anchored"} → r2r-thorp-11 (68) · {"institution: temple":0,"dim anchor":"-"} → r2r-thorp-49 (5) · {"institution: temple":1,"dim anchor":"-"} → r2r-village-10 (6) |
| DS-GEN-9::event type: magical v5 | {"dim anchor":"anchored"} → r2r-thorp-15 (40) · {"dim anchor":"-"} → r2r-thorp-59 (4) · {"dim anchor":"not anchored"} → r2r-hamlet-28 (1) |
| DS-GEN-9::event type: magical v6 | {"dim anchor":"anchored"} → r2r-thorp-15 (40) · {"dim anchor":"-"} → r2r-thorp-59 (4) · {"dim anchor":"not anchored"} → r2r-hamlet-28 (1) |
| DS-GEN-9::event type: magical v7 | {"dim anchor":"anchored"} → r2r-thorp-15 (40) · {"dim anchor":"-"} → r2r-thorp-59 (4) · {"dim anchor":"not anchored"} → r2r-hamlet-28 (1) |
| DS-GEN-9::event type: demographic v5 | {"dim anchor":"anchored"} → r2r-thorp-30 (59) · {"dim anchor":"-"} → r2r-hamlet-29 (6) |
| DS-GEN-9::event type: demographic v6 | {"dim anchor":"anchored"} → r2r-thorp-30 (59) · {"dim anchor":"-"} → r2r-hamlet-29 (6) |
| DS-GEN-9::event type: demographic v7 | {"dim anchor":"anchored"} → r2r-thorp-30 (59) · {"dim anchor":"-"} → r2r-hamlet-29 (6) |
| DS-GEN-9::event type: exile_return v5 | {"dim anchor":"anchored"} → r2r-thorp-14 (61) · {"dim anchor":"-"} → r2s-politically_fractured-thorp-0 (4) |
| DS-GEN-9::event type: exile_return v6 | {"dim anchor":"anchored"} → r2r-thorp-14 (61) · {"dim anchor":"-"} → r2s-politically_fractured-thorp-0 (4) |
| DS-GEN-9::event type: exile_return v7 | {"dim anchor":"anchored"} → r2r-thorp-14 (61) · {"dim anchor":"-"} → r2s-politically_fractured-thorp-0 (4) |
| DS-GEN-9::event type: occupation_infiltration v5 | {"dim anchor":"anchored"} → r2r-thorp-4 (82) · {"dim anchor":"-"} → r2r-thorp-7 (6) |
| DS-GEN-9::event type: occupation_infiltration v6 | {"dim anchor":"anchored"} → r2r-thorp-4 (82) · {"dim anchor":"-"} → r2r-thorp-7 (6) |
| DS-GEN-9::event type: occupation_infiltration v7 | {"dim anchor":"anchored"} → r2r-thorp-4 (82) · {"dim anchor":"-"} → r2r-thorp-7 (6) |
| DS-POW-5::FLAG: crimeIsGovt v4 | {"guardPresence":1} → r2s-slave_revolt-town-3 (3) |
| DS-POW-6::GM ADVISORY: the commander is a political actor v3 | {"commander":0} → r2r-hamlet-10 (21) · {"commander":1} → r2r-city-7 (17) |
| DS-POW-6::GM ADVISORY: the commander is a political actor v4 | {"commander":0} → r2r-hamlet-10 (21) · {"commander":1} → r2r-city-7 (17) |
| DS-POW-6::GM ADVISORY: the commander is a political actor v5 | {"commander":0} → r2r-hamlet-10 (21) · {"commander":1} → r2r-city-7 (17) |
| DS-FTH-4::FLAG: heresySuppression: hunted v3 | {"institution: temple":1,"thing temple":"present"} → r2r-hamlet-45 (25) · {"institution: temple":0,"thing temple":"absent"} → r2r-hamlet-55 (3) |
| DS-FTH-4::FLAG: heresySuppression: hunted v4 | {"institution: temple":1,"thing temple":"present"} → r2r-hamlet-45 (25) · {"institution: temple":0,"thing temple":"absent"} → r2r-hamlet-55 (3) |
| DS-FTH-4::FLAG: heresySuppression: hunted v5 | {"institution: temple":1,"thing temple":"present"} → r2r-hamlet-45 (25) · {"institution: temple":0,"thing temple":"absent"} → r2r-hamlet-55 (3) |
| DS-FTH-4::FLAG: heresySuppression: preached v3 | {"institution: temple":1,"thing temple":"present"} → r2r-town-24 (7) · {"institution: temple":0,"thing temple":"absent"} → r2s-wartime-hamlet-2 (1) |
| DS-FTH-4::FLAG: heresySuppression: preached v4 | {"institution: temple":1,"thing temple":"present"} → r2r-town-24 (7) · {"institution: temple":0,"thing temple":"absent"} → r2s-wartime-hamlet-2 (1) |
| DS-FTH-4::FLAG: heresySuppression: preached v5 | {"institution: temple":1,"thing temple":"present"} → r2r-town-24 (7) · {"institution: temple":0,"thing temple":"absent"} → r2s-wartime-hamlet-2 (1) |


## Stage 3 — three lines for every case (NOT STARTED; for the second seat, after items 1 and 2)
Owner view at the tip (depth.mjs, the census's 720; P = the pool table's layer 2, S = 3, T = 4 and above):
**P: 22 cases, 26 lines owed. S: 53 cases, 65. T: 158, 213.** The P list, by towns reached:
DS-DEF-11 UNWALLED-SMALL (157, 76 and 40 towns, 2 each) · DS-DEF-2 Beasts plagued/perimeter+force {no gate} (67, 2) · DS-DEF-11 UNWALLED-LARGE (43, 2) · DS-DEF-2 Invasion: neither walls nor force {threat} (43, 1) · DS-DEF-8 MIGRATION arrivals {guard} (21, 2) · DS-DEF-2 Beasts settled/nothing organized {threat} (20, 2) · DS-DEF-2 Beasts frontier deterrence {threat} (17, 2) · DS-DEF-8 BEAST PRESSURE {no guard} (17, 1) · DS-DEF-8 INTERNAL (famine), COMMAND SPLIT, INSURGENCY, UNDER TRIBUTE, SECURITY COMPROMISED, ACTIVE SIEGE, MIGRATION, QUARANTINE {no guard} (8-17 each, 2) · DS-DEF-2 Beasts settled/beyond the need (14 and 7, 2) · DS-DEF-5 garrison PRESENT {no gate} (8, 2).
The tooling (scratch, not committed; the second seat re-creates it from this list): the mapping seat's `depth.mjs` re-run on the lane; a per-case probe (each variant's eligibility alone, the slots the desk fills, the dimensions it answers); the doors in order (projection, wiring census, projection, both `--check`); a pin re-key pass reading the fast set's own failure lines.

## The whole suite, once, at this seat's final code tip (b9ae6d233; docs-only commits after it)
`npx vitest run --maxWorkers=2` (the ledger branch fetched first): **exit 1; 46 files, 61 tests red** (38,734 pass, 254 skipped). Every red file run again at the measurement base `a98e459f0` (every merge, none of the writing): 41 files, 54 tests red there, and the titles compared one by one.
- **53 red at the base, the same titles** (not this lane's: the goldens and the byte-identity pins that read them, the stale bundles and fixtures, the merge-born walkers named above, and the rest W2-A-LEAVES's hand-back classes at its base).
- **1 red at the base, green at the tip**: presumedThings › no stale row (the door's shrink, call 6).
- **8 red at the tip only: THIS LANE'S, found here, not cured (the chair: start nothing else) — for the second seat, each with its cause:**
  1-2. `tests/components/pageCensus.walker.test.jsx` › r2r-thorp-0, r2s-under_siege-thorp-0: the grid row drops `P13` (pattern 13, cured at 6e296ed51). The cure working; the banked grid row is lowered through W2-A-LEAVES's door `scripts/census/page-census.mjs --grid --shrink`.
  3. `tests/domain/facts/census2DeclaredPools.test.js` › every block of DS-GEN/DS-HK/DS-STR/DS-CND: EIGHT findings, two classes, both REAL: (a) "DS-GEN-5 river / DS-GEN-6 river: pool atom river" — the census law wants the pool's own atom on the pool brace, and 2f156207f moved it onto the lines; (b) "re-declares its key" — DS-GEN-7 power_stress v1, v3, DS-STR-1 UNDER OCCUPATION v2, v6, v7 and WARTIME v4 now declare the crisis their pool KEY already guarantees (b9ae6d233). RECOMMEND: (b) take those six crisis atoms off again (the key guarantees them; the walker's rows for them are re-banked by its owner as key-implied, as CORPUS-SHARE's own reading said); (a) restore `{river}` on both pools and route the coast case to pools of its own, which needs the desk to key them (a request to W2-B-DECLARE), the nine coast lines moving there unchanged.
  4. `tests/domain/wallsWordDossierProse.test.js` › F10: "mute: DS-GEN-3 readiness Undefended" — a read of the pool under the walls law falls silent with the 63791bdb4 lines (the no-walls read). RECOMMEND: read the arm's mute rule against the pool's five lines; a no-walls line that names neither walls nor militia restores it.
  5. `tests/lint/proseDrawnAnchors.walker.test.js`: a literal state-prose anchor counted in `tests/lint/proseMoveGrammar.walker.test.js` (1, frozen none) — a test literal that now equals a corpus line; and 6-8. `proseMoveGrammar.walker.test.js` (the PROVENANCE citations 2 -> 3; CONTROL 4 125 vs 120 and 117 vs 112): the move-grammar probe counts the corpus's R1 variants and its citations; corpus-count pins this seat's pin pass did not reach (its fast set did not hold the file). RECOMMEND: re-key by identity with the cause, after reading which new line carries the third citation.
