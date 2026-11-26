# PROOF-4 — the joined tip's proof (CLOSE-8 unit (4)); PARTIAL, written as each step lands

AFTER = /home/user/wt/join at 3836a832e3; BEFORE = /home/user/wt/before at 09c29806b8 (the line's tip). Raw data under
`proof/*-C`, `proof/*-V`, `*.jsonl`, `*.log` (kept out of git). Plans C and V re-made by `make-plan.mjs` /
`make-visitor-plan.mjs plan-lit.json`: byte-equal (cmp) to the plans the BEFORE battery used (CONFIRMED).

## Step 1 — AFTER battery: RUNNING (3 workers, --views)
Queued (each through `scripts/gate-mutex.sh --run`, one at a time; scripts `proof/tools-C/{battery,q1,q2}.sh`):
births on BEFORE and AFTER (C, V) with BIRTH-1's measure-d2/d2b/d3/d7/keys; measure-d5, measure-need, gi13 on AFTER;
WORDS-2 records dumps and WORDS-1 twin-strings on both trees; e8-check, d6-measure, d6-owed on AFTER; BIRTH-2 d4order on
both, p9beasts on AFTER; e8b-successor (before vs after, the seat's three seeds); sameness renders on AFTER (C, V for p9check;
the door's hxd births, 150 a size, for E13a's three slots); dp-thorp-2/-3 rendered twice on AFTER; `npm run build` + the two
VERIFY_DIST tests. Tool copies in `proof/tools/<seat>/` from each lane branch; the hard-coded `/home/user/wt/base` (gone) is
read as `/home/user/wt/before` (the base's role) or `/home/user/wt/join` where the tool reads the tree under measure.

### Step 1, C (CONFIRMED, 03:19 UTC): AFTER battery 900 of 900 rendered at 3 workers (no fill needed), exit 0; pattern table
identical row for row to BEFORE's (P5b 1, P8any 60, P14 1, P16three 348, P17 603, P18 419; all others 0).
`--diff=before-C,after-C`: record moved 746, page moved 887, battery rows moved 0 (gained 0, lost 0).
E2 census pairs (proof/tools-C/e2census.mjs, each pair by its own two printed sentences), BEFORE C: #1 34, #3 27, #4 4,
#6+7 1, #8 1, #9 0, #10 291, #11 28, #13 1; V: #1 21, #3 11, #4 2, #6+7 19, #8 10, #9 17, #10 285, #11 25, #13 9.
E1 owner pages, C (e1-measure over the battery's printed views; CONFIRMED): AFTER gap 0: 0 places, 0 hits; gap 1: 0, 0.

### Step 1, V (CONFIRMED, 03:36 UTC): AFTER battery 900 of 900 at 3 workers (no fill), exit 0. Pattern table equal to BEFORE's
except P9 129 -> 0 (thorp 44, hamlet 51, village 32, town 2). `--diff`: record moved 650, page moved 857, battery rows moved
129: every one "lost P9", none gained (BIRTH-2's P9 reported V 129 lost, 0 gained).
E2 census pairs AFTER: C #1 0, #3 4, #4..#13 0; V all 0 (#3 0).
E1 owner pages, V: BEFORE gap1 144 hits / 124 places -> AFTER 0/0 (gap 0: 143/123 -> 0/0). C BEFORE gap1 125/122 -> 0/0 (the seat's 125/122 exactly).
Render noise (CONFIRMED): dp-thorp-2 (C) rendered twice more on the SAME tree (the join): page hash d7e5f06eb598 both times,
against c7a7c4104ad7 in the AFTER battery: the only difference is the Power view's "Patron deity" premium block (2 lines),
present in the two re-renders and in BEFORE, absent in the battery's render; record hash equal throughout. dp-thorp-3 renders
the same page hash three times on the join (3fd62fe228d2): its move is G10's (a Defense line), not noise.
E13a, the three Viability slots (web Outlook, PDF canon_dossier, PDF draft_brief) on the C render of the join (sameness-census
--measure --plan=planC; e13a-door-slots read through the join's script; CONFIRMED): shareAll thorp .333, hamlet .327,
village .20, town .28, city .187, metropolis .22, the three slots equal at every size. The door's own births (hxd, 150 a size)
are queued last.
E13a on the V render: thorp .193, hamlet .167, village .153, town .287, city .18, metropolis .127 (three slots equal; CONFIRMED). V sameness render: 900 rows, 18.7 min (its driver was stopped after the render; the count printed whole).

## Step 3 (partial), C — births re-born on both trees (CONFIRMED)
- D2 check-d2: prominent covert 8 -> 0, joins a covert pair 8 -> 0, pressure names both ends 5 -> 0 (exit 0).
- D2b check-d2b: shares a sentence 18 -> 0 (exit 0).
- D7 check-d7: naming an absent body 25 -> 0; kept beside their body 11; twins printed 25; leaf vs oracle disagree 0.
- D3 measure-d3: stale BEFORE 0, AFTER 25 = exactly D7's 25 births (check-d7's BEFORE list, 25 of 25): the stored line is the
  writer's own line with D7's settled twin (settleCrisisBodyLines runs after D3's re-write; the measure's oracle re-runs the
  writer only). 19 are the creditor twins byte for byte; 6 the conversion twin ("the converts keep their own register").
  D3's own staleness: 0.
- D5 measure-d5 (AFTER): R13 breaks 0 of 900 births; X4 binds (on the floor) 76 (the seat's C 76).
- NEED-ATOM measure-need + summarize (AFTER): leaf != page 0; needs dropped as dealt 0; oracle refusals 0.
- GOALS-I13 gi13-run (AFTER): compared 2,585, faults 6 in 6 towns = GOALS-I13's own tip figure (G44's residual, written where
  I-13 is claimed), not 0.
- E8 e8-check (AFTER): covered lines 623 in 390 places; disagreeing 0.
- D4 d4order (BOTH trees) + d4sum (my copy takes D4_ONLY=C): out of power order 69 -> 69 (city 29, metropolis 40; the stored order is not D4's to change); stored order differs before/after in 0 births (CONFIRMED).
- D6 d6-owed (AFTER): strata flag vs record oracle disagreements 0; bound ("Could contend") 933 cards on 502 pages (the seat's C 502 pages); free ("Contender") 503 cards, 115 with a recorded conflict (109 pages). d6-measure: 632 places with a contender.

## Step 2, C — attribution (CONFIRMED; `proof/tools-C/attr.mjs`, output runs-C/attr.log)
Inputs: both batteries' rows; every string of the born record and of `composePublicProse` on BOTH trees (WORDS-1 twin-strings'
own `flat`, run as a births.mjs measure `tools-C/measure-strings.mjs` because plain node refused the trees' .jsx import);
BIRTH-1's measure-keys/d2/d2b/d3/d7 rows on both trees. Each changed string classed by its unit's own words or fields (E13b:
a card's behaviour; E8/E8b: equal once him/herself reads themselves, E8b on the five card fields; E8's tie; E1: fewer double
possessives (joined-proof's detector, gap 3); D6's two words; D7 naming -> twin; the power step's lines by the units' own
measure rows: D2 (a covert fault before, the tie or pressure moved), D2b (shares a sentence before, not after), D3 (stale
before), D7 (naming before, twin after), E3 (a grazing/water/marsh/shore/thin-harvest/late-frost line before or after);
public strings by the page's display rules of their block). Each moved printed line: pairs equal once E8/D6 words are
normalized; E8's tie; E1's doubles; WORDS-2 unit-attribute's rules (G34, G10, G11, G9, E4, G6, G1) and its Daily Life
admission trigger (E5, G8, E6; facts of the BEFORE record by the join's factsOf); E13a's pool; D6's words; P9 (the Overview's
Monster Defense row and the Defense grade chip with it); the Patron deity noise; the guard leaf's families words where the
record's quarrel named the families before and not after (the units that moved the quarrel); else a changed record string of
the place found in the line.
C: record moved 746 (strings: E8b 501, E8 390, E13b 333, E3 218(+17 with D2b), E1 140, D7 25(+2 with D2), D2 6, D2b 1);
unexplained record strings 0; moved places with no attributed string 0.
Pages moved 887: D6 502, E8/E8b 402(+E8 tie 76), E13b 333, G10 291, E13a 240, E3 218(+24 guard leaf, +17 with D2b), E1 122,
E5 50(DL), G1 40, G11 28, G34 25, D7 25, E4 14, D2 11, DL G8 6/E6 11, G6 8, noise 5 lines (dp-thorp-2 and others' Patron
block); unexplained lines 0; page-moved places with no moved line 0.
WORDS-1 joined-proof over the same rows (strings added): E1 detector gap 1 owner pages 125/122 -> 0/0, PUBLIC PROJECTION 52/41
-> 0/0 (the seat's exactly), record strings 120/116 -> 0.
E13b e13b-proof (before = the line's tip, not E8b's tree): behaviour moved 812 in 333 places (the seat's 812/333); "moved
wrongly" 5 = E8b's reflexive on a behaviour line ("Gives away little about themselves" -> himself), E8b's own move, read
against the line tip; two cards of a pair sharing a line while the pool allowed 0; residual 16 (the seat's C 16).
E8b e8b-roundtrip (same before): round trip differing 824 = E13b 812 + E1 12 (tools-C/e8b-split.mjs); none E8b's.
V (WORDS-1's proofs over the V rows with strings): E1 gap 1 owner pages 144/124 -> 0/0, PUBLIC 34/19 -> 0/0 (the seat's 34/19);
D6 printed on 453 pages; e13b-proof behaviour moved 693 in 338 places (the seat's 694/336 against E8b's tree), "wrongly" 6 =
E8b's reflexive on behaviour lines, shared-while-pool-allowed 0, residual 9 (the seat's V 9); e8b-roundtrip differing 700 =
E13b 693 + E1 7, none E8b's.
- E5 e5-elder: THE FAULT (W11/B19/P13 printed where the office is the headman's) C BEFORE 6 -> AFTER 0.
- E3 e3-slots on the records (C, AFTER) against WORDS-2's "G13 (built)" column (e3g13, slots-four-states.tsv): power thorp
  .187, hamlet .14, village .16, town .233, city .24, metropolis .20: all six EQUAL. Overview: thorp .193 (built .18), hamlet
  .093 (.087), village .087 (.073), town .10 (.093), city .06 (=), metropolis .067 (=). Each differing overview cell is D2b's
  redraw, not G43: the places whose pressure line moved by D2b (with E3) now print the cell's top line in exactly the
  difference (thorp +2 "A family moved away last spring", hamlet +1 the same, village +2 "A dispute over field rotation and
  grazing rights", town +1 "...debating market levies"; tools-C/e3cells.mjs). C has no D3 move (D3 stale BEFORE 0), so G43
  moves no C cell. No cell above .30 (G13 (2)'s bar).
- E6 (L12, 'The lord's steward is obeyed'): printed on C 0 -> 1, V 0 -> 2 pages = the seat's 3. e69-facts C AFTER: office holds 12/23/6 (thorp/hamlet/village), E107 shape 0/23/6. E9: e69-facts C occupied+GARRISONED 2 (dp-city-23, dp-metropolis-132); E9 moves no page (no line of the attribution is E9's: 0 pages).

## Step 2 — THE TABLE'S DATA (CONFIRMED; attr.mjs on both corpora; places per unit, a place may carry several units)
C: record moved 746 = E8b 501, E8 390, E13b 333, E3 218 (+17 with D2b), E1 116, D7 25 (+2 with D2), D2 11, D2b 1;
   page moved 887 = D6 502, E8/E8b 402 (+E8 tie 76), E13b 333, G10 291, E13a 240, E3 218 (+24 by the guard leaf, +17 with
   D2b), E1 122, E5 50, G1 40, G11 28, G34 25, D7 25, E4 14, D2 11, E6 11, G6 8, G8 6(+1), Patron-deity noise 5 places.
V: record moved 650 = E8b 500, E8 380, E13b 338, E3 100 (+9 with D2b), E1 89, D7 17, D2b 10, D2 9, D3 4;
   page moved 857 = D6 453, E8/E8b 402 (+E8 tie 81), E13b 338, G10 285, P9 175, E1 123, E13a 116, E3 98 (+13 guard leaf,
   +9 with D2b), G6 68, E4 56, G8 46(+4), G9 42, E5 30(+4), G11 25, G1 21, D7 17, G34 13, D2b 10, D2 9(+1 its tie's
   block), E6 6, D3 4, noise 4 places.
UNEXPLAINED: C 0 record strings, 0 page lines; V 0 and 0. No moved place without an attributed change. Battery rows: C 0
gained/lost; V 129 lost, every one P9. Units that move no record (display, measured 0): D6, E4, E5, E6, E7, E9, E10-12,
E13a, G1, G6, G8, G9, G10, G11, G34, P9, D4, D5; and NEED-ATOM, GOALS-I13, D7-BYTES, G43, ANCHORS-5: no string or field
of any place is theirs.
D3 V: stale BEFORE 4 (dp-hamlet-2, -100, -117, dp-town-15: the seat's 4) -> AFTER 17 = exactly D7's 17 V births (the
settled twin, as on C); D3's own staleness 0. D3's 4 V moves: stored = the BEFORE tree's writer over the settled roster.
- P9 p9check (AFTER, C render + p9beasts probe): heartland births 0; printed below Adequate 0 on every surface (the seat's C 0).
V (CONFIRMED): D2 7/8/3 -> 0/0/0; D2b 19 -> 0; D7 17 -> 0 (kept beside body 30, disagree 0); D5 R13 breaks 0 (X4 binds 74;
the seat's 75); NEED-ATOM leaf != page 0, oracle refusals 0 (4 needs dropped as dealt, each admitted by the oracle);
GOALS-I13 compared 2,426, faults 6 in 6 towns (= its tip figure, G44's residual); E8 covered 590 in 380 places, disagreeing 0;
E5 fault 2 -> 0. E3 e3-slots V AFTER vs "G13 (built)": eleven cells equal; ONE differs: power town .047 (built .073): the
built cell's top line was the creditor's agent line (11 towns); D7 turned 6 of them to its twin, the top is now another line
(7 towns) — D7's, not G43's. G43's own V reach: D3's 4 moves (stored = the writer over the settled roster), no cell moved.
- V D6 d6-owed: flag vs oracle disagreements 0 (C 0): 0/0. Bound 669 cards on 453 pages; free "Contender" 671 (the seat's 671).
- V D4: out of order 121 -> 121; stored order differs 0 births (C 0): D4 moves 0 records (and no string of any place is D4's).
- V P9 p9check (AFTER render + probe): heartland 273; printed below Adequate on web Defense 0, web Overview 0, PDF 0 (C 0): 0/0.
- E8b e8b-successor (BEFORE vs AFTER, the seat's seeds dp-city-1, -53, -0): 6 successors built, differing 0.
- Census pair #3 (Law & order Adequate beside Safety Unsafe/Dangerous): C 27 -> 4, V 11 -> 0; the 4 C pages (dp-city-46, dp-metropolis-32, -59, -65) each print Dangerous under a crisis (disease outbreak x3, insurgency): the crisis-set rungs G34 left (G9 (1)). #1 (G1's pair: a headman's card beside 'must agree') C 11 -> 0, V 10 -> 0; #4, #6+7, #8, #9, #10, #11, #13 -> 0 on both (BEFORE C 4/1/1/0/291/28/1, V 2/19/10/17/285/25/9; my counts by each pair's own two printed sentences, so #10 counts every Crisis note the Defense tab repeated).

## Step 4 — THE BUILD (CONFIRMED, 05:45 UTC; `npm run build` in the join exit 0; then VERIFY_DIST=1 vitest of the two files:
exit 1, 5 failed / 61 passed, the five size arms; figures from their assertion messages)
| | join | line | delta | budget |
|---|---|---|---|---|
| first paint raw | 1,192,243 | 1,182,894 | +9,349 | 1,175,492 |
| first paint gzip | 380,313 | 376,732 | +3,581 | 373,999 |
| first paint Brotli | 319,289 | 316,604 | +2,685 | 313,994 |
| generation worker | 2,740,114 | 2,722,294 | +17,820 | 2,579,708 |
| engine chunk | 937,530 | 934,213 | +3,317 | 909,928 |
All five over budget, as at the line; every other arm of the two files green.
