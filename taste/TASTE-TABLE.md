# THE TASTE TABLE (Fable folder, 2026-09-09, successor session)

Every figure below is read from a named file or from the dispatch prompt; nothing is invented. A figure marked CONFIRMED names the file it was read from. A row marked UNTESTED names the experiment that would settle it. No side is taken.

## 0. The frame

| item | value | source (CONFIRMED) |
|---|---|---|
| draft commit | `4935b86c3b5fa55a063531a057ca78138a029543`, subject "TASTE draft round 4: 6/7" | `git -C laneTASTE log -1` |
| arm A gate commit | `f07b98529848d4bfa95c0248bca977df0de4d59f`, "TASTE refine arm A: 7/7 kept, 0 reverted" | `git -C laneTASTE log -1 --format=%B` |
| arm B gate commit | `66d5b6e084cab89bb3281fc56846ed940182acdf`, "TASTE refine arm B: 6/7 kept, 1 reverted" | `git -C laneTASTEB log -1 --format=%B` |
| arm A staffing | Opus refiners (7), Opus gate (1) | `tokens-old-run.json` (`model` per agent) |
| arm B staffing | Fable refiners (7), Opus gate (1) | `tokens-old-run.json` |
| draft staffing | Opus writers (28), Opus gates (6) | `tokens-old-run.json` |
| refuters | Fable (7), blind to the arm; X/Y mapping below | dispatch prompt |
| blind mapping | walled X=A Y=B; unwalled X=B Y=A; revealed X=A Y=B; covert X=B Y=A; stores-short X=A Y=B; importfed X=B Y=A; purse X=A Y=B | dispatch prompt |
| harness runs on file | `measure-draft-base.json` (arm draft, round 4, 2026-09-09T05:58:55, 30 s); `measure-A.json` (arm A, 07:09:33, 11 s); `measure-B-baseline-draft.json` (arm B dock at the draft, 07:13:07, 10 s); `measure-B.json` (arm B, 07:15:49, 12 s) | the four files' `arm`, `at`, `seconds` |
| arm B's own re-measure of the draft | byte-equal in every pool figure to `measure-draft-base.json` (lengths, band, walk, owned, inherited, provenance all identical; only `at`/`seconds`/`rounds.files` differ) | `measure-B-baseline-draft.json` against `measure-draft-base.json` |

Two facts about the instrument that shape how every table below reads, both on file:

1. THE BAND POSITION AT THE FACE GRAIN IS A CONSTANT. In all four JSONs every executable face reads exactly the same band row: `exceeded 13 of 21`, `exceededShare 0.619`, `meanDistanceFromMedian 0.486`, deepest `wordsPerSentence.neighbourVariation 1.597 (under)`. The one exception on file is the draft's covert variant 2 face 0 (`meanDistanceFromMedian 0.903`, deepest `closers.abstractNounRate 8.6 (over)`, `depthOk false`). CONFIRMED in `measure-draft-base.json`, `measure-A.json`, `measure-B.json`, `measure-B-baseline-draft.json` (`pools[].band[]`). `RESUME-NOTE.md` line 93 records the chair's re-derivation: 13 of 21 exemplar metrics read zero on any one sentence, so only an over-side lexicon trigger moves a face. The band section therefore carries no direction between the arms except where a face trips a lexicon.
2. THE HARNESS CARRIES NO SIBLING-DISTANCE FIGURE, NO LICENSED-DETAIL COUNT, NO TIC COUNT, NO FIXTURE SECTION AND NO `--shapes` REPORT. The per-pool `siblings[]` holds `synonymSwaps` and `notExecutable` only; `provenance` holds `citations` and `a13`. The full key set of the JSON (`measure-draft-base.json`, walked) contains none of `siblingDistance`, `specificity`, `tic`, `fixture`, `shapes`. The script `laneTASTE/scripts/taste-measure.mjs` (md5 `9c614db18ff640d9528b89bbf29d8235`, identical in `laneTASTEB`) accepts `--arm --variety --taste --base --round --check --exemplars --check-arrangement`; its only "fixture" mention is the import at line 58 of `tasteTowns.js`, used at line 854 as the ground for holder resolution, never to emit composed strings. The mech brief chartered more: `briefs/brief-TASTE-mech.md` line 31 lists "the directional measures (sibling distance, licensed-detail count, tic count), the sibling-distance figures, the provenance count and A13's verdict; plus a `fixture` section with the interested fact composed both ways". Those chartered parts are UNTESTED (section 5).

Shared across the four JSONs and unmoved by either arm (CONFIRMED in each file's top level): projection GREEN with 6 waiver lines (the five standing T-F12 ATTACH collisions plus the header line); WALK 408 units, N 408 EXHAUSTIVE, sha `c0927bbd38b1b7e0`, verdicts FAIL 0 / WITHHELD 192 / PASS 216; MANIFEST against `taste/m3/cells-base.json` 73,284 cells: REPLACED 0 / RE-INDEXED 0 / ADDITIVE 182 / WORDING-ONLY 0 / UNCHANGED 73,102, added 0, removed 0; TIES rungs 8, multi-candidate rungs 4, pairs 30, ties 0, tie bp 0; VARIETY not executable (`--variety 0`); synonym table fields 0; exemplar metrics banded 21 over 10 labels.

Legend for the per-pool tables. "failing" is the harness's `failing[]` length (the owner's rule: an unlawful set is refined toward the law and kept if its failures fell). "owned" is the writers' grain (`owned.verdicts`), "walk" the whole-unit grain. Refuter counts are per variant (3 variants per arm per pool). Refiner tokens are that pool's refiner agent's own output / input (input includes cache reads and creation, per the token file's note). Faces are quoted at most twelve words; a quote cut at twelve words ends with `[...]`.

---

## 1. Per pool

### 1.1 DS-DEF-11 :: country: pressed (walled) (`def11-country-walled`) · X = A, Y = B

Identity (CONFIRMED `measure-draft-base.json`): attach `WALLED-STRAINED`; 3 variants, faces 4/4/4; units 24; rate 6,693 bp, departure 0; inherited findings 12 (Q, the spine clause "stone keeps itself, and wages do not."), on all three commits.

Draft phase (CONFIRMED `gate-verdicts-r1-r3.txt`, `gate-draft-r4.json`, `measure-draft-base.json`): draft rounds 4 (`rounds.draftRounds 4`). Round 1: NOT-EXECUTABLE, the packet refused because variant 3 face 1 carried no `{settlement}` where its plain line did. Round 2: C3 "a processing claim on a goods sentence" x8 on the writers' faces, walk W16/P8. Round 3: every finding on the spine, W12/P12. Round 4: lawful, `inBand true`, `failing []`, waiver T-F12 on `WALLED-STRAINED` (standing). Dry rounds: none named on file for this pool.

| arm | failing before > after | kept / reverted (gate's ground) | owned after | walk after | refuters FAIL / WITHHELD / PASS | refiner output / input tokens |
|---|---|---|---|---|---|---|
| A (X) | 0 > 0 | KEPT: "failures before 0 after 0 kept" (`gate-A.json`) | F0 W0 P24 (`measure-A.json`) | F0 W12 P12 | 1 / 0 / 2 | 10,684 / 5,466,563 (`tokens-old-run.json`) |
| B (Y) | 0 > 0 | KEPT: "failures before 0 after 0 kept" (`gate-B.json`) | F0 W0 P24 (`measure-B.json`) | F0 W12 P12 | 1 / 1 / 1 | 16,098 / 12,243,854 |

Band and lengths (information only; the band is a licence, the ceiling is the target). CONFIRMED `pools[].band` and `pools[].lengths` of the three files:

| state | words per face v1 / v2 / v3 | min · max · mean | budget ok · depth ok · perfection-suspect | deepest face |
|---|---|---|---|---|
| draft | 13,13,10,14 / 9,12,10,11 / 11,13,12,10 | 9 · 14 · 11.500 | 12/12 · 12/12 · 0 | constant row (1.597 under) |
| A | 10,11,8,14 / 9,10,10,11 / 11,11,13,10 | 8 · 14 · 10.667 | 12/12 · 12/12 · 0 | constant row |
| B | 13,8,10,11 / 9,10,10,11 / 11,13,8,10 | 8 · 13 · 10.333 | 12/12 · 12/12 · 0 | constant row |

Directional measures the harness carries: synonym swaps 0 on every variant (draft, A, B); citations 0; A13 0 (`pools[].siblings`, `pools[].provenance`, all three files). Sibling distance in bp, licensed specificity, tics: UNTESTED (section 5).

Refuters' findings (dispatch prompt; the refuter judged the packet as written):

- A (X) v1 FAIL: sibling-distance regression, "is marked beset." and "is set down beset." close on the same word with one rhythm where the draft's four closers were distinct; no unlicensed claim, citation, tense breach or lexicon hit; thread holds. v2 PASS: four rhythms, closers case/course/state/holds distinct; "beset is the plain state" leans on the draft's own sense of plain. v3 PASS: contrast stays on the sibling band, no quantifier, no absence-detector verb; "falls short of settled" a sharper landing than the draft.
- B (Y) v1 PASS: closers grade/country/entry/record distinct; "entered against" a ledger idiom licensed by the record clause; stative passives, no history. v2 WITHHELD: "is the rule that holds" can read as a regime holding the town after the watch sibling; no detector or registry hit, so unproven; otherwise lawful. v3 FAIL: "In the town's return" names a report rendered to an authority, a document form and implied superior no field holds; the other three faces lawful.

Read-aloud (dispatch prompt): A v1 three of four land, "set down beset" stacks two stresses; A v2 "in the common course" hangs a beat, "the plain state" lands flat; A v3 all four land. B v1 "entered against {settlement}'s country" the strongest close in either packet, "booked beset" a plosive pair; B v2 "the rule that holds" lands hard, "in the run of things" drifts; B v3 "does not make" and "does not take" both close bare on the same cadence.

Draft tokens for this pool (CONFIRMED `tokens-old-run.json`): rounds 1 to 4 output 23,335 / 53,668 / 24,872 / 89,995 = 191,870.

### 1.2 DS-DEF-11 :: country: pressed (unwalled) (`def11-country-unwalled`) · X = B, Y = A

Identity (CONFIRMED `measure-draft-base.json`): attach `UNWALLED-LARGE`, `UNWALLED-SMALL`; 3 variants, faces 4/4/4; units 48; rate 6,693 bp, departure 0; inherited 48 (Q x12 on each of three spine clauses, F25 "the books say" x12), whole-unit walk W48/P0 on every commit.

Draft phase (CONFIRMED `gate-verdicts-r1-r3.txt`, `gate-draft-r4.json`): draft rounds 4. Round 1: band depth `wordsPerSentence.shareUnder8` 2.192 band-widths on 3 of 12 faces, `closers.abstractNounRate` 8.6 on 2 of 12, depth ok 7/12; C3 x3 on the writers' face. Round 2: W48/P0, projector accepted all rows. Round 3: spine findings only, `moved=False`. Round 4: lawful, `inBand true`, two standing T-F12 waivers. Dry rounds: none named on file.

| arm | failing before > after | kept / reverted | owned after | walk after | refuters F / W / P | refiner output / input |
|---|---|---|---|---|---|---|
| A (Y) | 0 > 0 | KEPT (`gate-A.json`) | F0 W0 P48 | F0 W48 P0 | 2 / 1 / 0 | 16,898 / 19,757,632 |
| B (X) | 0 > 0 | KEPT (`gate-B.json`) | F0 W0 P48 | F0 W48 P0 | 3 / 0 / 0 | 46,891 / 10,677,267 |

| state | words per face v1 / v2 / v3 | min · max · mean | budget · depth · perf |
|---|---|---|---|
| draft | 9,10,10,10 / 8,10,9,11 / 12,12,12,9 | 8 · 12 · 10.167 | 12/12 · 12/12 · 0 |
| A | 8,15,10,13 / 8,9,11,10 / 12,9,13,9 | 8 · 15 · 10.583 | 12/12 · 12/12 · 0 |
| B | 13,17,10,11 / 12,11,11,14 / 16,14,14,12 | 10 · 17 · 12.917 | 12/12 · 12/12 · 0 |

Synonym swaps 0, citations 0, A13 0 on all three states (CONFIRMED). This pool is the one whose refuter also left a file: `def11-country-unwalled/refute-XY.md` (the same verdicts as the dispatch prompt, with the card printed at the seat: reads `settlement.config.monsterThreat`, standing fact only, bag `{settlement}` only, citation budget unset, A13 at 0).

Refuters' findings:

- B (X) v1 FAIL: plain "and dangerous ground near at hand" a proximity claim as a tail; face a "does not thin on the way in" a gradient along an approach; face b "the country harried" repeated attack by an actor, the walled sibling's grade word; face c "is a matter of course" a habitual idiom for a standing state. v2 FAIL: "nor near to quiet" a degree claim as a tail; "a long way from quiet ground" a spatial figure for degree; "with quiet nowhere near" an absolute-phrase tail and "Of the ground about" costume in the syntax; three faces paraphrase one another. v3 FAIL: all four faces run fact, comma, restatement, one rhythm four times; pseudo-cleft in face a; a pronoun subject in face b; the short line lengthened in face c. Pool-wide: seven of twelve rows carry a comma-appended tail (R-DA-05 / NL-8).
- A (Y) v1 FAIL: "Bad country" a rating word with no rating field; "dangerous to cross" a travel claim as a coordinate tail; "the going hard" travel difficulty; plain and face c lawful. v2 FAIL: the comma before "where" turns a restrictive clause into a non-restrictive tail; "runs well short of quiet" an intensifier of degree; face b carried from the draft, not charged anew; plain unchanged. v3 WITHHELD: "and stays where it sits" a pronoun and a verb echo as ornament, no claim moves; plain, a, c lawful.

Read-aloud: B(X) v1 the doubled "dangerous ground" lands twice, face a drops on "in"; v2 "nor near to quiet" fades; v3 the ear hears a refrain across four faces. A(Y) v1 "sits in is" stacks two verbs, face b lands on "hard"; v2 "and quiet does not" the strongest close in either packet; v3 "holds in {settlement}'s country" lands on the noun.

Draft tokens: 14,244 / 14,586 / 26,021 / 48,953 = 103,804.

### 1.3 DS-DEF-11 :: watch: bought (revealed) (`def11-watch-revealed`) · X = A, Y = B

Identity (CONFIRMED): attach `WALLED-QUIET`, `WALLED-STRAINED`, `WALLED-THREATENED`; units 96; rate bit `null` (the round-1 gate: "norm bit ABSENT, the pool carries no measured rate bit"); inherited 48; walk W48/P48 on every commit.

Draft phase (CONFIRMED `gate-verdicts-r1-r3.txt`, `gate-draft-r4.json`): draft rounds 4. Round 1: `shapes.participialOpenerRate` 28.24 on 1 face, `closers.pronounRate` 10.249 on 2, `shareUnder8` 2.192 on 1, `shapes.adverbsPerSentence` 1.826 on 2, depth ok 6/12 (the worst of the seven), W96/P0. Round 2: `closers.abstractNounRate` 8.6 on 2 of 12 faces, W52/P44. Round 3: spine only, W48/P48. Round 4: lawful, no waiver. Dry rounds: none named on file.

| arm | failing before > after | kept / reverted | owned after | walk after | refuters F / W / P | refiner output / input |
|---|---|---|---|---|---|---|
| A (X) | 0 > 0 | KEPT (`gate-A.json`) | F0 W0 P96 | F0 W48 P48 | 3 / 0 / 0 | 100,649 / 14,801,519 (the largest refiner spend in either arm) |
| B (Y) | 0 > 0 | KEPT (`gate-B.json`) | F0 W0 P96 | F0 W48 P48 | 3 / 0 / 0 | 51,614 / 6,939,439 |

| state | words per face v1 / v2 / v3 | min · max · mean | budget · depth · perf |
|---|---|---|---|
| draft | 11,8,18,19 / 12,8,19,11 / 13,9,19,13 | 8 · 19 · 13.333 | 12/12 · 12/12 · 0 |
| A | 11,8,18,19 / 8,8,18,18 / 10,10,16,9 | 8 · 19 · 12.750 | 12/12 · 12/12 · 0 |
| B | 15,8,12,21 / 12,8,17,8 / 17,10,18,11 | 8 · 21 · 13.083 | 12/12 · 12/12 · 0 |

Synonym swaps 0, citations 0, A13 0 on all three states (CONFIRMED).

Refuters' findings:

- A (X) v1 FAIL: 1.a "has public standing" a synonym swap of 1.plain "is a public item" (the four-faces rule); "item" a label-noun less sharp than the draft's "fact"; 1.b "without cover" after a defence spine carries a military sense; "does its business" shape shared across two variants. v2 FAIL: 2.b "that comes under the town's open notice" restores the relative clause round 4 removed by name and moves the limb onto the town's noticing (the standing cognition refusal); 2.a "Before" temporal as readily as locative, noted; 2.plain and 2.c licensed. v3 FAIL: 3.b "a purchase has bought" makes an inanimate purchase the agent (R-DA-11), a tautology; present perfect on a state-only field withheld in itself; 3.a moves openness onto the watch, noted.
- B (Y) v1 FAIL: 1.a "Under overt sale" reads as on offer, not the licensed standing fact; 1.c "set down where the town sets down" cites the office's own books (a finding under MOVE-GRAMMAR 4.4.3, A13 unlicensed) and adds a second fact; 1.plain "the town holds in public" the cognition shape, WITHHELD; 1.b licensed. v2 FAIL: 2.plain "bought, and bought unhidden" restates the fact inside one sentence, a rhetorical scheme; 2.c mirrors the twin's formula, noted; 2.a and 2.b licensed, 2.b denser than the draft with no claim moved. v3 FAIL: 3.c "answers its purchase" reinstates the predicate round 4 surrendered to the covert twin ("answers a buyer" ships there); 3.plain's coordinate makes the keeping public, not the buying, noted; 3.b "ordinary business" a standpoint the draft also carried, WITHHELD; 3.a repeats 1.b's locative-inversion rhythm, noted.

Read-aloud: A(X) 1.plain lands flat on "item", 1.c trails at nineteen words; 2.plain lands hard on "uncovered" in eight words; 3.c "Bought," the best-landing line in the packet, 3.b stumbles before "open". B(Y) 1.a ends on "sits" and hangs, 1.c doubles the beat audibly; 2.plain's re-strike is heard as rhetoric, 2.c the cleanest landing in the packet; 3.plain's second clause slack, 3.c lands on "purchase" with weight.

Draft tokens: 39,589 / 29,392 / 41,506 / 22,868 = 133,355.

### 1.4 DS-DEF-11 :: watch: bought (covert) (`def11-watch-covert`) · X = B, Y = A · every variant `[plain · dm-only]`

Identity (CONFIRMED): attach `WALLED-QUIET`, `WALLED-STRAINED`, `WALLED-THREATENED`; units 96; rate bit `null`; inherited 48; walk W48/P48 on every commit.

Draft phase (CONFIRMED `gate-verdicts-r1-r3.txt`, `gate-draft-r4.json`, `measure-draft-base.json`): draft rounds 4. Round 1: `closers.pronounRate` 10.249 on 1 face, `punctuation.semicolonRate` 7.736 on 1, `adverbsPerSentence` 1.826 on 3, depth ok 7/12, W80/P16. Round 2: W48/P48, `dm-only` carried on every variant. Round 3: spine only, `moved=False`. Round 4: REFUSED, `inBand false`, one failing measure: band depth `closers.abstractNounRate (over)` = 8.6 band-widths on 1 of 12 faces (band: at most 1.75 on every face), the face being variant 2 face 0, the `[plain · dm-only]` line "Under a covert arrangement a buyer has the watch of {settlement}." (`meanDistanceFromMedian 0.903`, `depthOk false`; the pool's depth ok 11/12, mean distance 0.521). Dry rounds: 2 (rounds 3 and 4; the refusal in the dispatch prompt: "refused after two dry rounds (rounds 3 and 4), then cured by BOTH refinement arms under the fell-or-held rule").

| arm | failing before > after | kept / reverted (gate's ground) | owned after | walk after | refuters F / W / P | refiner output / input |
|---|---|---|---|---|---|---|
| A (Y) | 1 > 0 | KEPT: "failures before 1 after 0 kept" (`gate-A.json`); the commit message: the 8.6 breach cured, no new failing measure, deepest face now 1.597 on `neighbourVariation (under)`, `inBand YES`, owned F0/W0 over 96 units | F0 W0 P96 (`measure-A.json`, depth ok 12/12) | F0 W48 P48 | 1 / 0 / 2 | 24,406 / 8,794,700 |
| B (X) | 1 > 0 | KEPT: "UNLAWFUL at the draft commit and CURED by arm B: the draft's one failing measure [...] is gone; depth ok reads 12/12 where the draft read 11/12; no new failing measure" (`gate-B.json`) | F0 W0 P96 (`measure-B.json`, depth ok 12/12) | F0 W48 P48 | 2 / 0 / 1 | 33,311 / 18,147,317 |

| state | words per face v1 / v2 / v3 | min · max · mean | budget · depth · perf | deepest |
|---|---|---|---|---|
| draft | 10,17,11,9 / 11,9,14,8 / 14,10,9,17 | 8 · 17 · 11.583 | 12/12 · 11/12 · 0 | v2f0 `closers.abstractNounRate` 8.6 over (DEPTH FAIL) |
| A | 11,18,9,12 / 11,10,12,8 / 14,10,13,17 | 8 · 18 · 12.083 | 12/12 · 12/12 · 0 | constant row |
| B | 10,14,18,8 / 11,13,10,10 / 16,14,8,15 | 8 · 18 · 12.250 | 12/12 · 12/12 · 0 | constant row |

Synonym swaps 0, citations 0, A13 0 on all three states (CONFIRMED).

Refuters' findings:

- B (X) v1 FAIL: 1b "unseen by the town whose watch it is" a relative hung as a tail qualification (R-DA-03); a buyer-holds against town-owns antithesis with no sibling key naming the alternative (R-DA-02 / wall 5); 1b closes on "it is"; 1c shares its whole shape with 2 plain and 3b (three faces of one template, sibling distance narrowed). v2 PASS: every face carries the two facts and `{settlement}` and nothing else; information only: the pool's second and third fronted "the town's" frames; "has the say over" the one colloquial phrase. v3 FAIL: 3a "Bought is the watch of {settlement}" a predicate-fronted inversion, the antique air in the syntax (R-DA-18); "has not heard as much" a perfect aspect asserting a history a covert flag does not hold, and "as much" an anaphor on nothing; 3b abandons the variant's coordinate shape and paraphrases 1c and 1 plain; "Unaware," a standpoint on the civic body, a note beside the FAIL.
- A (Y) v1 PASS: the card held on every face; information only: 1a keeps the draft's "well clear of" figure; 1b is the draft's row with the possessive re-cut. v2 FAIL: 2a "A bargain the town never hears": "never" spans the future on a state the engine can flip (STATE never FATE; FORECAST; A2), and a sense verb on an abstraction (R-DA-11); "hears keeps" stacked with no joint, named only because it sits on the two breaches. v3 PASS: all four faces keep the coordinate shape and differ in vocabulary and rhythm; information only: 3a "has" the softer verb for a sale; 3c closes on "matter", an abstraction close, lawful under R-DA-04.

Read-aloud: B(X) v1 1b runs eighteen words and trails on "whose watch it is"; v2 2b stops abruptly on "holds", 2c has no hinge; v3 3a "has not heard as much" the weakest close in either set. A(Y) v1 1a reads through the doubled "holds"; v2 2a trips the ear at "hears keeps", 2b lands flat on "word"; v3 3a lands strongly on "unannounced", 3c flat after seventeen words.

Draft tokens: 11,209 / 31,712 / 11,594 / 26,727 = 81,242.

### 1.5 DS-DEF-2 :: stores: short (`def2-stores-short`) · X = A, Y = B

Identity (CONFIRMED): attach `Disasters & Famine: granary AND hospital`; units 36; rate 1,563 bp, departure 0; inherited 24 (Q x12 on the spine clause about a failed harvest or an outbreak; A3 x12 on "rather than in the luck"); walk W24/P12 on every commit; arm Q's vocabulary report NOT-EXECUTABLE on this block (receipt M-9.4: the only read is the synthetic table label).

Draft phase (CONFIRMED): draft rounds 4. Round 1: `closers.abstractNounRate` 8.6 on 1 face, `shapes.participialOpenerRate` 28.24 on 1, depth ok 10/12, W24/P12. Round 2: C3 "is this clause historical?" x3 NEW, W25/P11. Round 3: spine only, W24/P12. Round 4: lawful, standing T-F12 waiver (`store`). Dry rounds: none named on file.

| arm | failing before > after | kept / reverted | owned after | walk after | refuters F / W / P | refiner output / input |
|---|---|---|---|---|---|---|
| A (X) | 0 > 0 | KEPT (`gate-A.json`) | F0 W0 P36 | F0 W24 P12 | 1 / 0 / 2 | 13,924 / 18,538,050 |
| B (Y) | 0 > 0 | KEPT (`gate-B.json`) | F0 W0 P36 | F0 W24 P12 | 1 / 1 / 1 | 17,129 / 10,241,832 |

| state | words per face v1 / v2 / v3 | min · max · mean | budget · depth · perf |
|---|---|---|---|
| draft | 10,19,9,8 / 17,12,20,10 / 8,10,16,17 | 8 · 20 · 13.000 | 12/12 · 12/12 · 0 |
| A | 12,21,9,8 / 17,12,19,10 / 8,10,17,14 | 8 · 21 · 13.083 | 12/12 · 12/12 · 0 |
| B | 12,19,10,8 / 16,13,18,10 / 8,9,18,17 | 8 · 19 · 13.167 | 12/12 · 12/12 · 0 |

Synonym swaps 0, citations 0, A13 0 on all three states (CONFIRMED).

Refuters' findings:

- A (X) v1 FAIL: 1c "what there is to eat" names the food in hand, the HOLDING the attached spine tests (the granary), the blur the draft cured in 3d; read after either spine as a denial of the spine's own holding; an embedded expletive where the draft had none (R-DA-07), a regression on a named target; 1a a real gain on claim precision; 1b lawful, three faces now close on "town"; 1d carried, at the floor. v2 PASS: 2a slot moved, claim unchanged; 2c "carried in" now in two faces of one variant with different rhythm; 2d lawful; no count, cause, season, future, holder or store noun on any face. v3 PASS: 3b the locative idiom kept; 3c one "beyond" over the pair is the sum claim, a law-backed sharpening; 3d the settlement as collective, lawful.
- B (Y) v1 WITHHELD: 1b "does not reach" replaces "fall short of" with a bare negation, a lateral swap unproven either way; 1c a pronoun whose antecedent is the slot, a craft loss only; 1d "goes" now carries two senses in the pool (R-DA-22), a pool-level note; 1a a real gain; three faces name both sources with the same two verbs. v2 PASS: 2a "stands unfed" equals the draft's claim; 2a/2b share a closing stem, reported not failed; 2c the cataphor gone; 2d "answers for less than" a comparison as measurement, sharper than the draft. v3 FAIL: 3b "is the condition {settlement} lives under" a definite identity, an exhaustivity over a column no field licenses, contradicted by the spine's two other standing conditions on the same passage; a life verb on the settlement, landing on the preposition; 3a the copula struck with no law named, lateral; 3d lawful; 3c lawful.

Read-aloud: A(X) 1c lands flat on "eat", the "there is" hollows the middle; 2a the best hinge in either set; 3b lands on "stands" with weight. B(Y) 1d the strongest landing in either set, eight words on "goes"; 2a lands hard on "unfed", 2a and 2b rhyme in sequence; 3b's weight falls off the end onto "under".

Draft tokens: 11,229 / 24,147 / 53,555 / 83,827 = 172,758.

### 1.6 DS-DEF-2 :: stores: import-fed (`def2-stores-importfed`) · X = B, Y = A · THE REVERTED POOL

Identity (CONFIRMED): attach `Disasters & Famine: granary AND hospital`; units 36; rate 4,010 bp, departure 0; inherited 24 (the same Q and A3 spine clauses as 1.5); walk W24/P12 on every commit.

Draft phase (CONFIRMED): draft rounds 4. Round 1: `shareUnder8` 2.192 on 2 faces, `closers.abstractNounRate` 8.6 on 1, depth ok 9/12, W24/P12. Round 2: W24/P12. Round 3: spine only, `moved=False`. Round 4: lawful, standing T-F12 waiver. Dry rounds: none named on file.

| arm | failing before > after | kept / reverted (gate's ground) | owned after | walk after | refuters F / W / P | refiner output / input |
|---|---|---|---|---|---|---|
| A (Y) | 0 > 0 | KEPT (`gate-A.json`) | F0 W0 P36 (`measure-A.json`) | F0 W24 P12 | 2 / 1 / 0 | 9,855 / 10,350,981 (the smallest refiner spend in either arm) |
| B (X) | 0 > 2, then reverted to 0 | REVERTED: "failures before 0 after 2 reverted" (`gate-B.json`); the two failing measures before the revert: `composed walk · C3 · is this clause historical?` = 3 owned findings, all on the new face "The victuals at {settlement} are had from other parts." at the joint with each of the three spine variants (band: every owned arm green); `composed walk · owned unit verdicts` = FAIL 0 · WITHHELD 3 · PASS 33 (band: FAIL 0 and WITHHELD 0). The twelve draft rows restored from `4935b86c3b:docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, verified byte-identical; re-run reads `inBand YES`, owned F0 W0 P36 | F0 W0 P36 in the committed state (`measure-B.json`, which carries the DRAFT rows: its lengths are byte-equal to the draft's) | F0 W24 P12 | 2 / 0 / 1 (the refuters judged the PACKET AS WRITTEN, `refine-B.md`, not the committed state; this row's blind verdict is on rows that were never kept) | 60,390 / 10,181,254 (the largest arm-B refiner spend) |

| state | words per face v1 / v2 / v3 | min · max · mean | budget · depth · perf |
|---|---|---|---|
| draft | 13,8,8,8 / 12,9,9,10 / 9,13,10,9 | 8 · 13 · 9.833 | 12/12 · 12/12 · 0 |
| A | 12,9,8,12 / 12,10,12,15 / 8,13,12,9 | 8 · 15 · 11.000 | 12/12 · 12/12 · 0 |
| B, committed (reverted = draft rows) | 13,8,8,8 / 12,9,9,10 / 9,13,10,9 | 8 · 13 · 9.833 | 12/12 · 12/12 · 0 |
| B, the packet as written | UNTESTED under the harness: the gate's pre-revert JSON was not preserved (`gate-B.json` keeps only the two failing measures) | | |

Synonym swaps 0, citations 0, A13 0 on the three committed states (CONFIRMED). Sibling distance in bp as quoted by the refuter from `composedWalker.siblingDistance` (dispatch prompt; not a harness figure): X (B) variant 1, 1.p/1.1 1,667 to 1,429 bp (the refuter: improved against the draft); Y (A) variant 1, 1.p/1.1 1,667 to 4,000 bp and 1.1/1.3 2,500 to 4,000 bp (the refuter reads this as a narrowing on a section 21.1 target because "comes" and "food" recur across three of four faces); Y variant 2 at or under 2,000 bp.

Refuters' findings:

- B (X) v1 FAIL: "are had from other parts" carries the form the shipped arm C3 (`entryWalker.js:546`) withholds as past tense on a PRESENT pool (the refuter cites gate-B's 3 owned WITHHELD and the fell-or-held revert); the antique air sits in the verb phrase as well as the noun (R-DA-18); "From beyond the town" names a boundary no field holds, information; sibling distance in this variant improved (1,667 to 1,429 bp) which does not cure the findings. v2 PASS: no unlicensed claim, tense, citation or slot fault; noted with no law: two faces share one rhythm, one participle restates its own clause, "eats off what arrives" colloquial. v3 FAIL: "what {settlement} lays by" drops both "food" and "store" so the face names less than the draft and claims more than the label (any reserve, coin as readily as grain); one face grows to thirteen words for the thread, lawful, the pool's one lengthening; two faces lawful.
- A (Y) v1 FAIL: sibling distance narrowed on a section 21.1 target (figures above); "the food the town lives on" a dependence the label's own value (Import-Dependent) licenses, information; the other two faces lawful. v2 FAIL: "The town's eating at {settlement} rests on what is carried [...]" paraphrases its sibling (a five-word run shared verbatim, the same content set); an abstraction in the subject (R-DA-10); the frame "the town at {settlement}" now in two of four faces of one variant; the other two faces lawful, sibling distance at or under 2,000 bp. v3 WITHHELD: "fill with what arrives" replaces the stative with an intransitive that can read as a level claim the label does not hold, unproven; "Food" dropped as subject with no loss of sharpness charged; two faces held verbatim from the draft.

Read-aloud: B(X) 1.2 stumbles at "are had", the ear hears a past tense and corrects itself; 2.3 the sharpest close in the set (eight words on "arrives"); 3.1 lands on "by" and the ear waits for an object. A(Y) 1.3 the hinge comes late but "feeds the town" lands; 2.2 the strongest close in Y on "fed", 2.3 "The town's eating" awkward with three prepositions run together; 3.2 clashes two verbs at "keeps is drawn".

Draft tokens: 5,303 / 23,342 / 29,542 / 15,925 = 74,112.

### 1.7 DS-GEN-3 :: purse: short (`gen3-purse-short`) · X = A, Y = B

Identity (CONFIRMED): attach `scores.military: CRITICAL`, `scores.military: WEAK`; units 72; rate 6,641 bp, departure 0; inherited 24 (Q x12 on "the gate is shut at night by whoever is nearest to it.", A3 x12 on "rather than in what the hall issues"); walk W24/P48 on every commit.

Draft phase (CONFIRMED): draft rounds 4. Round 1: A13 "a holder with no institution" x6, the writers' citing face resolving holder kind `muster` to no institution, W28/P44. Round 2: `shapes.participialOpenerRate` 28.24 on 1 face NEW (round 1 was 12/12 depth ok), W24/P48. Round 3: spine only, W24/P48. Round 4: lawful, no waiver. Dry rounds: none named on file.

| arm | failing before > after | kept / reverted | owned after | walk after | refuters F / W / P | refiner output / input |
|---|---|---|---|---|---|---|
| A (X) | 0 > 0 | KEPT (`gate-A.json`) | F0 W0 P72 | F0 W24 P48 | 2 / 0 / 1 | 32,781 / 12,927,497 |
| B (Y) | 0 > 0 | KEPT (`gate-B.json`) | F0 W0 P72 | F0 W24 P48 | 2 / 0 / 1 | 28,826 / 11,457,464 |

| state | words per face v1 / v2 / v3 | min · max · mean | budget · depth · perf |
|---|---|---|---|
| draft | 13,11,12,13 / 11,12,11,10 / 14,12,12,12 | 10 · 14 · 11.917 | 12/12 · 12/12 · 0 |
| A | 14,12,13,11 / 12,8,11,11 / 12,12,13,11 | 8 · 14 · 11.667 | 12/12 · 12/12 · 0 |
| B | 13,13,10,13 / 10,14,11,11 / 14,14,10,13 | 10 · 14 · 12.167 | 12/12 · 12/12 · 0 |

Synonym swaps 0, citations 0, A13 0 on all three states (CONFIRMED; the round-1 A13 x6 was cured at the draft).

Refuters' findings:

- A (X) v1 PASS: 1b "does not cover the defences it keeps" drops the upkeep noun but with coin as subject "cover" reads as pays, noted; "Coin set aside at {settlement}" (draft, X, Y alike) sits in weak tension with the `scores.economic: CRITICAL` ledger spine "holds no reserve at all", inherited and charged to neither packet. v2 FAIL: 2a "The charge on the defences [...] is not met" drops "of keeping", admits the duty reading and, after the CRITICAL visitor spine, a capability claim on `scores.military`, a field the card bars; less sharp than the draft. v3 FAIL: 3c "Short of its charge" is the idiom for a duty unmet, so after the CRITICAL spines the face reads as the defence failing its charge, the spine's own field; 3a drops "standing" and "stand on a purse" gives the defences a footing on money, WITHHELD-grade beside the FAIL.
- B (Y) v1 PASS: 1d "set aside at {settlement} for its defences" makes the earmark explicit inside the field's own scope; the same inherited "Coin set aside" tension noted. v2 FAIL: 2a "is met in part" asserts a positive share the field does not hold (the gate is a multiplier below one; at its floor the producer's own comment is inertia, not payment), the card's refused count in words; 2b "the coin laid by" names a reserve held, a same-page contradiction (arm C7) with "holds no reserve at all"; 2d "than its purse bears" the same family, held as a comparison. v3 FAIL: 3c de-clefts the draft's fronted predicate into the plain indicative with no law behind the change (section 21.4: a lawful line made plainer with no law is the regression); 3d "is found short" an agentless finder, a record act with no licensed source (A13 withholds `muster` on this pool), WITHHELD-grade beside the FAIL.

Read-aloud: A(X) v1 three of four land, 1b's close on "keeps" trails; v2 every line lands, 2b the best-landing line in either packet; v3 3c's doubled "is" sags in the tail. B(Y) v1 1d's close on "keeping" is soft; v2 2b closes on the particle "by" and trails, 2d "bears" takes the weight; v3 3c reads clean and flat without a hinge.

Draft tokens: 5,993 / 35,689 / 62,162 / 63,186 = 167,030. (The OLD run's refuter for this pool recorded 0 output and 1 message, the dead refute phase; this run's refuter delivered the verdicts above.)

---

## 2. Totals

### 2.1 Per arm (CONFIRMED in the files named per column)

| measure | arm A (Opus drafts + Opus refines) | arm B (Opus draft + Fable refines) | source |
|---|---|---|---|
| refiner agents · output tokens · input tokens | 7 · 209,197 · 90,636,942 | 7 · 254,259 · 79,888,427 | `tokens-old-run.json` summary.refineA / refineB |
| gate agent (one per arm, shared across the seven) · output · input | 1 · 14,290 · 7,307,014 | 1 · 14,013 · 6,902,501 | `tokens-old-run.json` summary.gateA / gateB |
| arm total output (refiners + gate) | 223,487 | 268,272 | sum of the two rows above |
| kept / reverted | 7 / 0 | 6 / 1 (`stores: import-fed`) | `gate-A.json`, `gate-B.json` |
| pools unlawful at the draft > after the arm | 1 (covert) > 0 | 1 (covert) > 0; importfed 0 > 2 before its revert, 0 after | `gate-A.json`, `gate-B.json` |
| harness `inBand` after the arm | 7 of 7 | 7 of 7 (importfed at its draft rows) | `measure-A.json`, `measure-B.json` |
| owned verdicts over 408 units | F0 W0 P408; owned findings 0 | F0 W0 P408; owned findings 0 | the two JSONs |
| inherited findings | 228 (all spine) | 228 | the two JSONs |
| whole-unit walk | F0 W192 P216, sha `c0927bbd38b1b7e0` | identical | the two JSONs |
| band, 84 faces: budget ok · depth ok · perfection-suspect · mean distance from median | 84/84 · 84/84 · 0 · 0.486 | 84/84 · 84/84 · 0 · 0.486 | the two JSONs, `pools[].band` |
| lengths, 84 faces: words · mean · min · max · faces at 8 words · faces at 17 or more | 982 · 11.690 · 8 · 21 · 12 · 10 | 1,005 · 11.964 · 8 · 21 · 12 · 10 | the two JSONs, `pools[].lengths` (B's importfed at draft rows) |
| synonym swaps · citations · A13 | 0 · 0 · 0 | 0 · 0 · 0 | the two JSONs |
| ties | 4 multi-candidate rungs · 0 of 30 pairs · 0 bp | identical | the two JSONs |
| refuters' verdicts over 21 variants: FAIL / WITHHELD / PASS | 12 / 2 / 7 | 14 / 2 / 5 (3 of the 21 on the reverted importfed packet: 2 FAIL, 1 PASS) | dispatch prompt, tallied per the blind mapping |
| refuter PASS by pool | walled 2, unwalled 0, revealed 0, covert 2, stores-short 2, importfed 0, purse 1 | walled 1, unwalled 0, revealed 0, covert 1, stores-short 1, importfed 1, purse 1 | same |

### 2.2 The draft phase (CONFIRMED `tokens-old-run.json`, `gate-verdicts-r1-r3.txt`, `gate-draft-r4.json`, `measure-draft-base.json`)

| measure | value |
|---|---|
| writer agents (Opus) · output · input | 28 · 924,171 · 288,568,769 |
| gate agents (Opus) · output · input | 6 · 87,904 · 38,852,146 (round 1: 14,794 and 23,639; round 2: 14,353; round 3: 12,786; round 4: 20,234 and 2,098, the second being the killed round-4 gate of receipt M-9.0) |
| one further agent `cutB` (Opus) | 627 output · 265,622 input |
| draft phase output, writers + gates | 1,012,075 |
| output per pool over rounds 1 to 4 | walled 191,870 · unwalled 103,804 · revealed 133,355 · covert 81,242 · stores-short 172,758 · importfed 74,112 · purse 167,030 |
| pools in band by the gate, per round | round 1: 0 of 7 (walled NOT-EXECUTABLE, packet refused); round 2: 0 of 7; round 3: 0 of 7 on the whole-unit grain, and 7 of 7 on the writers' grain once car M-9 separated owned from inherited (receipt M-9.2: 0 owned findings of 228); round 4 (M-9 grain): 6 of 7, covert refused on one measure |
| rounds and dry rounds | 4 draft rounds on every pool; dry rounds named on file only for covert (rounds 3 and 4) |
| band at the draft commit, 84 faces | budget ok 84/84 · depth ok 83/84 · perfection-suspect 0 · mean distance 0.491 |
| lengths at the draft commit | 976 words · mean 11.619 · min 8 · max 20 · 9 faces at 8 words · 10 faces at 17 or more |
| variety duplicate-unit rate | not run at any of the three commits (`--variety 0`); receipt M.12's last readings: 9,771 bp before the pools, 9,768 bp with the pools live and unwritten |

### 2.3 The refute phase

This run: 276,512 output tokens across 7 Fable refuters (dispatch prompt). The old run's refute rows in `tokens-old-run.json` (82,713 output, one refuter at 0) are the dead phase's partial figures and are NOT the refute cost.

---

## 3. The interested fact composed both ways

STATUS: UNTESTED. The harness JSON has no `fixture` section (the full key set of `measure-draft-base.json`, `measure-A.json`, `measure-B.json` contains no `fixture`, `standing`, `holder` or composed-string key) and the receipt's M.9 prints only the holder standings. The charter that owed it: `briefs/brief-TASTE-mech.md` line 31, "plus a `fixture` section with the interested fact composed both ways (the player face and the dm-only face as strings) on rate-9-2 and the clean control on rate-3-0"; and `briefs/brief-SEAM-car6-taste.md` line 22 (THE SECRET AS A PEN LINE, owner ~21:5x, agenda C‴): "the interested fact is composed BOTH WAYS IN BOTH RENDERINGS [...] the harness's fixture section prints all four strings." The script imports the fixture towns (`taste-measure.mjs:58`) and uses the captured town at line 854 only as the ground for holder resolution.

What IS on file, as the sitting's raw material for the pen-line rendering:

The two fixtures' holder standings (CONFIRMED `receipt-taste.md` M.9, `node scripts/taste-holders.mjs`):

| fixture | town | criminalCaptureState | licensed rows walked | holder named on | rows INTERESTED | by kind (named / interested) | the taste's row |
|---|---|---|---|---|---|---|---|
| CAPTURED `rate-9-2` | Schwarzplatz | corrupted | 114 | 69 | 30 | court 16/16 · treasury 14/14 · elders 0/0 · market 22/0 · muster 0/0 · parish 2/0 · road 7/0 · toll-bar 12/0 · watch 0/0 | DS-GEN-11 :: viable: true; kind treasury · holder Town hall · standing INTERESTED · mark "Town hall: captured-at-birth (criminalCaptureState corrupted + faction captureState corrupted)" |
| CLEAN `rate-3-0` | Al-istan | none | 114 | 62 | 0 | every kind 0 | kind treasury · holder Weekly market · standing LICENSED · marks none |

M.9's own reading: INTERESTED on the state's organs and on no other kind; none on the clean control; the treasury's holder is a different institution on the two towns (town-resolved, not a roster constant). One correction recorded there: a kind is counted interested only where the town names a holder for it (the first cut read `watch 0/2` through a partner's holder).

The covert pool's `[plain · dm-only]` lines, the dm-only replacement faces the sitting would set beside the passage (CONFIRMED in the packets; twelve words at most per quote):

| variant | draft (`draft-round-4.md`) | arm A (`refine-A.md`) | arm B (`refine-B.md`) |
|---|---|---|---|
| 1 | "The watch {settlement} keeps is bought out of public sight." | "The watch {settlement} keeps is bought out of the town's sight." | "The watch {settlement} keeps is bought without the town's knowledge." |
| 2 | "Under a covert arrangement a buyer has the watch of {settlement}." (the draft's one failing face, 8.6 band-widths) | "Under a covert arrangement the watch of {settlement} has a buyer." | "Unknown to the town, the watch of {settlement} has a buyer." |
| 3 | "In {settlement} the watch is bought, and the town hears nothing [...]" | "In {settlement} the watch is bought, and nothing of the buying [...]" | "A bought watch is kept in {settlement}, and the town is told [...]" |

The player-face twin the pen line would sit beside is the revealed pool (section 1.3); the revealed and covert pools attach to the same three spines and the same 96 units each. The compiled passage identical on both pages, the pen line beside it: UNTESTED (section 5, row 1).

## 3b. The distribution table

STATUS: UNTESTED. `taste/measure-shapes.json` does not exist (`ls`: No such file or directory), and the harness carries no `--shapes` report: `taste-measure.mjs` accepts `--arm --variety --taste --base --round --check --exemplars --check-arrangement` and the word "shapes" does not occur in it (grep count 0). The passage-shape distribution the owner asked for (the fourth seeded draw, PASSAGE SHAPES, per the 09-08 owner question) was never measured by this run.

The parts that ARE on file, identical across `measure-draft-base.json`, `measure-A.json`, `measure-B-baseline-draft.json` and `measure-B.json` (CONFIRMED):

| part | value |
|---|---|
| ties | rungs 8 · multi-candidate rungs 4 · pairs 30 · ties 0 · tie bp 0 · note empty |
| face counts | every pool 3 variants with faces 4/4/4 (84 faces over the seven pools); units per pool walled 24 · unwalled 48 · revealed 96 · covert 96 · stores-short 36 · importfed 36 · purse 72 = 408 |
| walk verdicts (whole unit) | FAIL 0 · WITHHELD 192 · PASS 216 over 408 units, exhaustive, sha `c0927bbd38b1b7e0`; per pool W12/P12 · W48/P0 · W48/P48 · W48/P48 · W24/P12 · W24/P12 · W24/P48; every finding inherited from a spine clause (228 of 228), 0 owned |
| manifest classes | 73,284 cells against `taste/m3/cells-base.json`: REPLACED 0 · RE-INDEXED 0 · ADDITIVE 182 (91 towns) · WORDING-ONLY 0 · UNCHANGED 73,102 (525 towns) · ADDED 0 · REMOVED 0 · index-only 0; no STOP |
| rate bits | walled 6,693 bp · unwalled 6,693 · stores-short 1,563 · importfed 4,010 · purse 6,641, departure 0 on each; revealed and covert `null` (no measured rate bit) |

---

## 4. For the owner, in plain words

Both arms started from the same draft (round 4 of 4, six pools lawful and the covert watch pool refused on one measure after two dry rounds). Arm A, Opus refining Opus, kept all seven refinements; arm B, Fable refining the same Opus draft, kept six and lost one: its import-fed stores packet put "are had from other parts" on one face and the shipped tense arm read that as history on a present-tense pool three times, so the whole pool went back to the draft rows (the owner's fell-or-held rule, applied per pool). Both arms cured the covert pool's one failing measure without opening a new one, so on the harness's own scale the two arms finish level: seven of seven in band, zero owned findings, zero synonym swaps, zero citations, zero A13 rows, and the band position reads the same constant row on every face in both (the instrument cannot tell them apart at the face grain, which is a fact about the instrument as much as about the prose). What differs is in three places. First, cost: arm A's seven refiners spent 209,197 output tokens against arm B's 254,259 (arm B 22 percent more output; arm A 13 percent more input), with one arm-A refiner (the revealed watch) alone spending 100,649 and one arm-B refiner (the reverted import-fed) 60,390. Second, length: arm A's 84 faces total 982 words (mean 11.69) against arm B's 1,005 (mean 11.96) with import-fed at draft rows, the draft being 976 (mean 11.62); arm B lengthened the unwalled country pool most (mean 10.17 to 12.92) and the refuter charged that pool with a comma-tail template on seven of twelve rows. Third, the blind refuters: over 21 variants arm A drew 12 FAIL, 2 WITHHELD, 7 PASS and arm B 14 FAIL, 2 WITHHELD, 5 PASS, three of arm B's rows being a packet that was never kept; both arms failed every variant of the revealed watch pool, and the refuters' grounds are the same families on both sides (tails, sibling paraphrase, a claim the field does not hold, a named target regressed), with arm A's failures somewhat more often a sibling-distance or named-target regression and arm B's somewhat more often a new claim or a syntax figure. The read-aloud notes hand the best single landing to one side or the other pool by pool and settle nothing between the arms.

---

## 5. UNTESTED rows

| # | row | why it is untested | the experiment that would settle it |
|---|---|---|---|
| 1 | The interested fact composed both ways (the inline dm-only replacement face and the DM's-pen line beside an identical passage) on rate-9-2 and rate-3-0 | No `fixture` section in any harness JSON; the script never emits it though the brief (`brief-TASTE-mech.md` line 31, `brief-SEAM-car6-taste.md` line 22) chartered all four strings | Add the `fixture` section to `taste-measure.mjs`: compose the DS-GEN-11 treasury row on the two fixture towns in both renderings (player face, dm-only face; inline and pen line), print the four strings, re-run on the draft, arm A and arm B commits, and diff the covert pool's plain lines against them |
| 2 | The passage-shape distribution table (the owner's fourth seeded draw) | No `measure-shapes.json`; the harness has no `--shapes` report | Add a `--shapes` report (the shape of each composed passage over the 768-town sample, counted per pool and per arm) or run the existing prose shape census on the two tips, and print the distribution beside the duplicate-unit rate |
| 3 | Sibling distance in basis points per arm, per sibling pair | `siblings[]` carries `synonymSwaps` and `notExecutable` only; the only bp figures on file are the importfed refuter's own `composedWalker.siblingDistance` readings | Emit `composedWalker.siblingDistance` per pair into `siblings[]` and re-run the harness on the three commits; report the mean and the worst pair per pool per arm |
| 4 | Licensed-detail (specificity) count and tic count per arm | Chartered in the same brief line; absent from the JSON key set | Same re-run as row 3 with the two counters added; a tic defined as a phrase-shape recurring across variants of one pool (the refuters' own usage) |
| 5 | Arm B's import-fed packet under the band and length measures | The gate re-measured it before the revert but kept only the two failing measures in `gate-B.json`; the committed `measure-B.json` carries the draft rows | Apply `refine-B.md` in a scratch dock at the draft commit, run the harness once, keep the JSON; no commit needed |
| 6 | Dry-round counts for the six pools lawful at the draft | No file names a dry round for them; the gate journal's `moved` flag is a row-movement flag, not a dry-round count | Diff the four draft-round packets' rows per pool and pair each round with its gate verdict; count a round dry where the rows moved and the failing set did not fall |
| 7 | Refuter cost per pool for this run | Only the total (276,512) is on file; the old run's per-pool refute rows are the dead phase's partials | Sum the per-agent usage from this run's workflow journal into `tokens-old-run.json`'s shape |
| 8 | Whether the band position can distinguish the arms at all | Every face reads the same constant band row unless it trips an over-side lexicon (the chair's finding, `RESUME-NOTE.md` line 93) | Run the chair's `band-probe.mjs` on a set with deliberately varied sentence lengths, or band the composed passage rather than the face; if the row still does not move, the band is a lexicon gate and should be named as one |
| 9 | Refuter agreement | One refuter per pool, so a FAIL is one reader's finding; the two arms' counts (12 and 14 FAIL of 21) sit two rows apart | A second blind Fable refuter per pool on the same packets; report the agreement rate per verdict and re-tally |
| 10 | The variety duplicate-unit rate after each arm | `--variety 0` on every run; the last readings are M.12's 9,771 and 9,768 bp on unwritten pools | Run the harness with `--variety` on the draft, arm A and arm B tips (4,200 towns, 8 seeds, as M.12) and print the three rates side by side |
| 11 | Arm Q's vocabulary defect and the DS-DEF-2 not-executable rows | Ruled at CAR M-9 (chair): the threat clause maps to `settlement.config.monsterThreat` and Q withheld it; DS-DEF-2's two pools have only a synthetic table label to read; neither was cured before the arms ran, so 228 inherited WITHHELD findings stand on every commit | The REWRITE's first car: the synonym table (`wages`/`pay` to the gate; `books`/`roll` to the holder kinds) and the DS-DEF-2 reading, then re-walk the 408 units and report the inherited count |
