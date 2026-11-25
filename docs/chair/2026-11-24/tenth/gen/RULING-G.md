# THE RULINGS FOR THE FOUR SEATS OF 2026-11-25 (BIRTH-1, BIRTH-2, WORDS-1, WORDS-2): the tenth chair

**G1 (09:11 UTC on 2026-11-25): A5, THE STANDING SENTENCE AS ITS OWN FIELD: "BESIDE", ON SEVEN TERMS.** BIRTH-2's measure
(09:10; nothing built): the sentence is written once (`factionStanding.js :: annotateFactionStanding`) and re-written
by four settlers at birth (`applyDensityLaw.js :: resizeSeats`, `rosterText.js :: settleStandingToRoster` and
`settleStandingToLegitimacy`, `factionStanding.js :: settleSeatHolderToRecord`); three editors change a description
after birth (the user's edit, the rename, the AI refine); seven readers print a description and two decide on its
words. ITS PROPOSAL, TAKEN: a new field on each power holding the tail; the description stays exactly as today; the
hiding cuts the description's end where it equals the field; an old record has no field and is cut by the frozen
table. (The other shape, the description losing its tail, would re-write seven readers, four settlers, three editors
and a play path, and a missed reader would silently drop a sentence.) Bytes: about 440 a birth, 0.2 to 0.3 per cent.
THE TERMS:
1. THE FIELD IS PRIVATE BY ITS NAME: a new key on a power is served until a veil lists it, and that must not depend on
   a paused lane. Its name matches `publicSafe.js :: PRIVATE_KEY_RE` and the SQL sanitiser's same token as they stand;
   proven on C and V (no such key in `toPublicSafe` of any birth, at any depth), the SQL token cited.
2. '' where a new place's power has no tail; ABSENT on an old record; a load never adds it (an old record round-trips
   byte-equal). The veil can then tell "new, no tail" from "old, unknown".
3. Every statement that writes a tail sets the field in the same statement: the writer, the four settlers, and the
   play path of a transfer if it writes one (that one statement only: it is advance time; more than that is named,
   not built).
4. The rename applies to the field as to the description; the user's edit and the AI refine leave it (a description
   that no longer ends with its field is the veil's fail-closed case, by design).
5. No reader changes: byte-equal on C and V for every page, the PDF and Foundry view model, the AI grounding payload
   (the field reaches no prompt) and the search index; an export that would carry the raw key is named.
6. The record equal but for the new key; the field equals the writer's own output for every power of every birth; the
   description ends with the field wherever it is not ''.
7. FOR THE VEIL's LANE AT ITS RESUMPTION (written in BIRTH-2's hand-in; it touches none of it): the field joins what no
   non-owner read sends (a Reveal-DM read keeps private keys); the cut is "the description's end where it equals the
   field"; the old-record path stays the frozen table (V14, V15, V25, V27 stand for it).

**G2 (09:20 UTC): D4, THE PAGE SORTS THE POWERS: THE CHIP's WORDS, AND TWO STORED LINES CURED.** BIRTH-2's measure at
0ec96f13d8: stored out of order on C 69 of 900 (cities 29, metropolises 40) and V 121 of 900 (town 1, cities 51,
metropolises 69), by two causes read in the code: the density law appends rivals after the last sort (`resizeSeats`),
and the fold adds a folded power's share to the ruler in place with no re-sort (`rulerKin.js :: foldKin`). Readers
printing wrongly: the first row (sentence, tile) C 0, V 2; the copy text's three C 5, V 14; the bar's five and the
template narrative's five C 14, V 74. RULED: (1) the holder's row on the bar carries the Power tab's own words, "holds
power", from the Power tab's own reader and audience; it prints only where the Power tab itself names that holder for
that reader (proven on the public projection of C and V); (2) the two birth-time readers that are wrong where the first
row is (the pressure sentence, the NPC secrets: V's dp-town-93 and dp-city-134) take the strongest power through the
one sorting reader: expected move C 0, V 2 exactly; more is a stop. The stored order itself is not changed.

**G3 (09:23 UTC): E4, "NO MARKET" SAID MORE THAN ONCE: THE MEASURE REFUTED THE SIZE.** WORDS-2 on C (all 900 pages): 397 pages
say the place has no market; 389 say it twice or more: the Overview's GEN-13 NO-MARKET line beside the Economics yield
line ("... held back by having no market": 389); 13 pages say it three times (ECO-1 C4 v6, "There is no market at X to
hold whatever its road brings", with the two above); the briefed 16 of 900 was the pair C4 v6 with GEN-13 v11 or v12 (7
on C). RULED: (b) THE YIELD CLAUSE STAYS: another section, and it gives the cause of a number; the Overview states the
fact. (a) C4 v6 IS RE-WORDED IN PLACE: "Whatever its {access} brings goes on past {settlement}." (its second clause, if
any, unchanged); NOT the seat's "which stays poor": a line may not assert what its own condition does not guarantee.
Expected move: 13 pages on C. THE OWNER MAY VETO (b): its alternative, the clause in other words, moves 389 pages.

**G4 (09:27 UTC): D4's SURPRISE: THE SUMMARY TAB IS MOUNTED NOWHERE; THE CHIP IS NOT BUILT.** BIRTH-2 (09:25):
`src/components/new/SummaryTab.jsx` (the "Power rests with" sentence, the copy text, the Power tile, the bar and its
slice of five) is imported by no module under src; only tests render it; the dossier's lazy tabs hold OverviewTab. So
four of intake item 1's nine readers, and "the bar", print on no page a user sees. RULED: (1) G2 (1), the chip, is
WITHDRAWN: not built. (2) The sort inside SummaryTab is dropped from the unit; the file and the tests that render it
are NAMED in the hand-in as a removal for a later tidy, not built. (3) D4 is: the one sorting reader; the LIVE readers
through it (the template narrative's five powers, `aiLayer.js :: extractFullContext`; the PDF and exports checked);
G2 (2)'s two stored lines (C 0, V 2). THE CHAIR TOLD THE OWNER AT 09:23 that up to 74 of 900 pages printed the power
bar wrongly and that the Summary named the wrong power on 2: THOSE COUNTS WERE OF A COMPONENT NO USER SEES; corrected
to him.

**G5 (09:35 UTC): E1, THE DOUBLE POSSESSIVE, BY SOURCE; E8's SCOPE.** WORDS-1's measure at 0ec96f13d (owner pages): 125 hits in
122 places on C, 145 in 126 on V, four sources. RULED: (1) a later mention's ROLE rung before 's, where the role holds
a possessive (`personMention.js :: oneSentence`; "the network's head's reputation"; C 56, V 55): that rung is skipped
and the next taken ("Lee's reputation"); with no rung left, the "of" form. (2) a POWER NAME holding a possessive in
five joiners (`power.generated.js` twice, factionDynamics' ordained, governanceAccount's possessive, dmPowerLines'
theOwn; "the Headman's Authority's place"; C 47, V 70): the "of" form at each joiner, only where the name holds one.
(3) the want's HOUSE FILL (`goals.js :: PERSON_HOUSE_PLACE`; "the lord's steward's office"; C 20, V 19): the short
title ("the steward's office"), derived from the long one's own source by dropping the possessor: no new table, no
title hard-coded (D8 may re-word the title); else "the office of the lord's steward". (4) "{settlement}'s
{institution}" where the institution's name holds a possessive (C 2, V 1): "the {institution} at {settlement}". THE
CHECK: the measure's own detector over every composed sentence of every birth, on the owner's pages and the public
projection's: 0. A re-worded joiner that writes a power's description or its standing tail is named for the veil's
lane. E8's SCOPE: a reflexive bound to one person takes that person's own stored pronoun (card lines binding the
card's own person, and the tie; "make themselves useful" printed 419 times on C); no stated gender, or "they", keeps
"themselves".
**G2 (2), AS BUILT (BIRTH-2, 09:35):** its "V 2" was an upper bound, not a count: read on the two births, neither stored
line names the wrong power. Both `topFaction` reads go through the sorting reader anyway (`-d4-wip` 2cf611af9): records
moved C 0, V 0; no golden row. The chair's sentence to the owner ("two stored sentences named the wrong power") was
wrong and is corrected to him.

**G6 (09:43 UTC): E2, SECTIONS OF ONE PAGE THAT DISAGREE: THE CENSUS's FIFTEEN.** WORDS-2's census
(`gen/words-2/E2-CENSUS.md` on `lane/words-2-2026-11-25`, 5d959508d): every sentence about the place on C and V, all
tabs, a lexicon of fifteen claim topics; pairs are opposite claims or one absence said twice; persons, hooks and
history not read. CURED IN THIS RELEASE, each its own unit: #10 "People no longer trust those in charge..." verbatim on
Crisis and Defense (C 27, V 25): one home; #1 a single-holder office beside lines that presuppose a body deciding
together ("the whole Headman's Authority must agree"; C 86, V 46): those lines are not drawn for a single-holder
office: the words, not the seat; #6+7 "Buyers from outside come" beside "Little that comes past X stops there" (C 1,
V 20); #8 "Nobody here goes hungry" beside Food Pressured (C 2, V 5): the fare line reads the printed band; #9 two
no-wall lines on one tab (C 5, V 30); #11 "no stable governing authority" three times (C 28, V 25): Defense drops it.
HELD FOR ONE LINE: #3+4 "Law and order: Adequate" beside "Safety: Unsafe" (C 49, V 18): only where the unsafety is
disorder inside the place; an outside threat beside adequate law is two truths; no new bound on a Foundations row.
RULED OUT, LISTED FOR THE OWNER's EYE: #2 "Stable" beside "Public legitimacy: Contested" (C 7, V 75); #5 "keeps people
under arms" beside "Defense: Vulnerable" (C 12, V 31); #12 no healer on Defense and in Daily Life (C 22, V 9). NOT
DISAGREEMENTS: #14, #15. #13 is G3. THE PROOF: the whole census re-run after, all pairs before and after.

**G7 (09:52 UTC): D6, THE CONTENDER's WORD: "COULD CONTEND", EVERY TIED CARD, SUBORDINATE INCLUDED.** WORDS-1's measure at
0ec96f13d (`reports/D6.md` on `lane/words-1-2026-11-25`): the word lives on the card's label "Contender" and the
roster's "Contests the seat"; nothing else moves. The first contender is tied to the printed ruler (dependent or
symbiotic) on C 442 of the 632 pages that print one and on V 265 of 611; with subordinate, C 469 and V 400. THREE
WORDINGS BROUGHT: (1) "Could contend" / "Could contest the seat"; (2) "Tied to the ruler" / "Tied to the ruler; could
take the seat"; (3) "In reach of the seat". PICKED: (1). SCOPE: every tied card, tied meaning dependent, symbiotic OR
subordinate (pages changed: C 502, V 452): a power the page shows as bound to the ruler does not "contest" in the
present tense. A component's word; no record, standing, tie or order moves. OWED AS A COUNT: of the cards that keep
"Contests the seat", how many hold a recorded conflict with the holder. THE OWNER's VETO LIST AT THE END GAINS the two
phrases.

**G8 (10:05 UTC): UNIT D2 HANDED IN (BIRTH-1, `lane/birth-1-2026-11-25-d2-wip` 4ea69f420): THE PROMINENT TIE IS NEVER A COVERT
ONE.** Its numbers: a covert prominent tie C 8 to 0, V 7 to 0; a pressure sentence naming both ends of a covert tie C 5
to 0, V 3 to 0; births moved C 13 of 900, V 9 of 900, in those two fields alone (every other field's hash equal; the
page battery 0 rows). Goldens moved, named, not re-recorded: dark 15 of 525, lit 32 of 525. "ONE BIRTH IN EIGHTEEN"
(the list's row D2, and the chair's word to the owner) WAS THE LIT GOLDEN CORPUS (32 of 525); on C and V it is under
one in a hundred. RULED: (1) the seat's own call stands: the pick also skips an OPEN tie between the two people a
covert tie joins (the veil's rule from the source's side); (2) "D2b" is added: a pressure sentence equal word for word
to the prominent tie's line (C 11, V 10 at the base) is cured at the draw; about 22 births expected.

**G9 (10:10 UTC): WORDS-2's FIVE, AND A SLIP.** (1) G6's #3+4: all of it is disorder inside the place (C 36 pages, V 14; no
outside threat): CURED, last, its own unit: where the place's own crime makes it Unsafe, "Law and order" takes the next
band below Adequate in the row's existing vocabulary; the DERIVATION is changed, not the reader component (the paused
veil's branch edits that); the file is named for the veil's lane. (2) E3: the grazing quarrel is not a weighted draw:
it is the LAST FALL-THROUGH of `governanceNarrative.js :: deriveBaselineConflict` (a calm place with no flag): it is
stored on 68, 67 and 45 per cent of C's thorps, hamlets and villages (31, 25, 30 on V). RULED BY THE OWNER's RULE
("Don't invent drama capitalize on what's already there if it's there"): the fall-through keeps the grazing quarrel only
where the place's own record holds grazing; a calm place without it stores no quarrel; no new pool; one line of counts
and three pages read whole before the build. (3) E6 (L12): leave granted for its three vocabulary rows; it waits for
D8's title. (4) E9: silence: no new line for an occupied, garrisoned place (three places; the proposed line claimed
what the record does not hold). (5) G6's #6+7: the existing `exports` atom refuses the ECO-1 line, on two proofs.
THE SLIP: WORDS-2 made two LOCAL scratch merges with `--no-verify`, discarded them unpushed and redid them with the
hooks; said by itself; owed: the hashes and `git branch -r --contains` empty.
**G9 (2), THE LINE THAT CAME BACK (10:24 UTC):** WORDS-2 read "grazing in the record" as a grazing house on the live roster, the
running pastoral chain, or a pasture, grazing or herds ground nearby. Fall-through births that KEEP the line: C 102,
100 and 68 of 102, 100 and 68 (thorps, hamlets, villages: ALL: almost every small C roster holds a grazing house); V 19
of 55, 37 of 37, 45 of 45 (36 thorps store none). A place that stores none: the Power paragraph ends a sentence
sooner; the Overview's tension line takes another existing line; no empty heading, no broken sentence. SO THE RULE CURES
WHAT IS INVENTED, NOT THE REPETITION (C's thorps still store it on 68 per cent): THE CHAIR's WORD TO THE OWNER ("many
small calm towns will show no quarrel line") WAS WRONG FOR C and is corrected to him. RULED: built as ruled; a grounded
variant (the water quarrel, the shore quarrel) is NOT retired; ONE MEASURE OWED: the top line's share and the count of
distinct lines in the two slots, by size, on C and V, today, under the grounded rule, and with no fall-through quarrel
at all; then the chair rules whether a calm place with grazing keeps a grazing quarrel.

**G10 (10:58 UTC): D8, THE REEVE: "THE LORD's REEVE".** BIRTH-1's count at 0ec96f13d: every Feudal Stewardship THORP (C 12,
V 18) holds the house "Lord's reeve" (face "the reeve"; its own description: "A steward appointed by a distant lord")
and prints "Isamu Liu, the reeve, holds its seat." beside "the Feudal Stewardship"; hamlets and villages hold "Lord's
steward" and read right. RULED: candidate A: the face becomes "the lord's reeve"; the seat's name is not changed (a
rename would re-deal every name-keyed draw: R24m); the card's role moves on those thorps only, no draw. Told to
WORDS-1 (E1's short title gives "the reeve's office") and to WORDS-2 (E6's L12 no longer waits; the steward's title is
unchanged). The catalogue word is named for the owner's veto. ALSO: UNIT D3 received (BIRTH-1, `-d3-wip` 5262fbee4);
E8's line in the shrink-only bank keeps "themselves" (WORDS-1's (b)).

**G11 (12:00 UTC): D8 IS PARKED: "THE LORD's REEVE" NEEDS A ROW IN A SHRINK-ONLY REGISTER, WHICH IS THE OWNER's LEAVE.** BIRTH-1
built D8 as G10 ruled (`-d8-wip` d391b1fbd: C 12 and V 18 thorps move, every differing leaf the title alone; red 7 of
7 to green) and STOPPED: `tests/lint/presumedThings.walker.test.js` arm 1 reads catalogue literals of three words or
more and reds "the lord's reeve" (it names a house); the widened register is shrink-only ("never add a row"); the
precedent "the lord's appointee" stands banked from before that rule; "the reeve" (two words) was never read. The
seat would not re-word the literal past the walker: right. RULED: no seat and not the chair adds that row; D8 is not
handed to CLOSE-7; the branch stays as it is with what it still needs written in BIRTH-1's hand-back; THE OWNER IS
ASKED ONCE for the leave (one row, reason "family", by the register's own door); without it the thorp's officer stays
"the reeve", which the intake itself called no false line. G10's knock-ons: WORDS-1 keeps the title as a detector case
only; WORDS-2's E6 is unaffected (the steward's title never changed). ALSO (WORDS-1, 10:49): E8's line in the
shrink-only bank keeps "themselves"; (BIRTH-1) D2b by the shared-sentence test, about 38 births; UNIT D5 received
(`-d5-wip` 289a70b3a: births moved 0; the R13 arm over every birth 0 of 1,800 breaks).

**G12 (12:03): G6 #1's STOP:** the marks "no office: headman" and "no office: reeve" red `presumedThings` arm 1 (a mark
string read as a line naming the thing). RULED (a): the three DS-POW-5 lines are marked `ruling body` (what "the whole
{seat} must agree" presumes); the walker is not changed; it also reaches Town Mayor (C 47, V 9) and Priestly Guidance
(V 15), which is right. Built: `-g1-wip` c80742a91.

**G13 (12:24 UTC): E3, THE GRAZING QUARREL, FROM THE THREE-STATE TABLE.** WORDS-2's table (top line's share of the size's 150
births / distinct lines; towns and up identical in all states):
| corpus, slot, size | today | grounded as built | no fall-through quarrel |
|---|---|---|---|
| C power thorp | .68 / 14 | .68 / 14 | .25 / 33 |
| C power hamlet | .67 / 17 | .67 / 17 | .13 / 42 |
| C power village | .45 / 23 | .45 / 23 | .26 / 36 |
| C overview thorp | .61 / 44 | .61 / 44 | .13 / 50 |
| C overview hamlet | .39 / 76 | .39 / 76 | .09 / 82 |
| C overview village | .13 / 110 | .13 / 110 | .07 / 109 |
| V power thorp | .31 / 24 | .21 / 30 | .21 / 39 |
| V power hamlet | .25 / 29 | .25 / 29 | .17 / 51 |
| V power village | .30 / 38 | .30 / 38 | .08 / 61 |
| V overview thorp | .28 / 56 | .17 / 61 | .17 / 60 |
| V overview hamlet | .11 / 97 | .11 / 97 | .11 / 102 |
| V overview village | .11 / 113 | .11 / 113 | .04 / 112 |
"A grazing house on the roster" grounds nothing (all 270 fall-through births of C hold one). With no fall-through
quarrel the slots spread and no line is crowned; the Overview falls to the subsistence pool (7 lines) for thorps and
hamlets; 19 C and 17 V villages print no tension line. RULED: (1) a fall-through quarrel is kept only where the record
holds a fact that DISTINGUISHES the place: water, marsh, shore where the land holds them; grazing only where herding is
what the place lives by (its leading chain or primary economy), never for a grazing house alone; else no quarrel; no
new line; (2) the fourth state measured; the bar: no cell's top line above .30; (3) a subsistence-pool line agrees
with the food band the page prints (the count of thin-harvest or late-frost lines beside Secure: 0, or those lines
read the printed band); (4) a calm village may print no tension line. THE OWNER MAY VETO: it changes what most calm
small places are born saying.

**G14 (12:50) AND ITS WITHDRAWAL, G15 (12:50 UTC): A5 IS PARKED UNTIL ITS READER LANDS WITH IT.** A5's field (`dmStanding` on
each power) is written at birth and read by nothing under src (G1: every reader prints the description; the one
reader to come is the paused veil's cut), so `tests/lint/writerReach.walker.test.js` reds it as a new dark identity
(nine tests with its digest, mutant and lit arms). G14 ruled a hand-authored row in `scripts/lib/writer-dark-register.mjs`;
BIRTH-2 stopped: that register takes a row only under three CLOSED reasons, each convicted by an executed clause
(a door; a consumer under src; a surface it should reach), and none fits; the only growth door of its banked cohort is
`--rebank --charter`; "a fourth reason is a charter act". RULED: G14 withdrawn. No re-bank, no fourth reason: both are
acts on a shrink-only register. A5 lands WITH the share veil's cut of the description, at the head of the veil's
resumption, in one landing with its reader. The branch `lane/birth-2-2026-11-25-a5-wip` keeps its proofs; the
writer-reach reds are left red and named; it is not handed to CLOSE-7. THE CHAIR's WORD TO THE OWNER AT 09:10 AND 11:44
(that A5 is in this batch) IS CORRECTED TO HIM.

**G13 AS BUILT, AND G16 (12:53):** the fact for "herding is what the place lives by" is
`economicState.foodSecurity.foodRecord.foodSources[0] === 'livestock'`: the grazing quarrel stays on C 42 of 270 and V
20 of 101 fall-through births (`-e3-wip` 4cf491891). G13 (3) was NOT 0 (C 41, V 16 pages would print the thin harvest
or the late frost beside "Secure"): the two lines now exclude a Secure band (01b616134). G16: the small-place pool's
own grazing line is drawn only where herding leads, by the same fact: one fact, both homes.

**UNIT D2b RECEIVED (BIRTH-1, `-d2b-wip` 4822a2175; 12:51):** shares-a-sentence C 18 to 0, V 19 to 0; births moved
C 18, V 19, the pressure line alone; one sentence test for the draw and the Overview (`sharedSentence.js`); THE RISE
TAKEN BY THE CHAIR, named for the owner's size signing: first paint +210 raw, +70 gzip, -28 Brotli; the worker +256.
CLOSE-7 re-runs its check on the joined tree (E3 changes the candidates).

**G17 (12:57 UTC): D7, THE CRISIS NAMES ONLY WHAT THE PLACE HOLDS.** BIRTH-1's measure on C and V: almost every crisis line
tells an event, the seat or an outsider said to be outside; the list's "509 of 900" was the forced-crisis corpus. The
lines naming a local body the place may lack (printed, and with no body): the indebted power sentence "The creditor's
agent has blocked the money for repairs..." (C 24 (19), V 27 (13)); the indebted pressure line "...the creditor's
representative arrived last month..." (C 1 (1)); the religious-conversion power sentence "...two priests, two
congregations, two registers..." (C 7 (6), V 5 (4)); the succession void's "every claimant is buying support" (C 6
(2), V 6 (2)). RULED: where the body stands today's line stays (a declared twin; no draw, no power added); where it
does not: (1) "Word from the creditor has blocked the money for repairs. In public those in charge talk of prudence;
in private they point to a clause in the loan."; (2) letters in place of the representative, the whole sentence read
so that "since" answers to something in it; (3) "the converts keep their own register of births, deaths and
marriages", everything after it the original's own remainder; (4) "claimant" does not count (the void's own premise).
The check: no crisis line names a local body the place does not hold: 0 on C and V. The new sentences are named for
the owner's veto.

**G18 (written into this file at 15:15 UTC; ruled about 13:15 UTC): D7's VOCABULARY ROW AND THE TWIN.** BIRTH-1 has leave
for ONE vocabulary row `crisis body: <kind>` (the kinds of local body a crisis line may name, each tied to the fact
that says the place holds it); the debt pressure line's twin sentence is approved as G17 (2) words it: "{place} owes
more than it can repay; the creditor's letters began last month, and every civic decision since has been made with
one eye on what the creditor might accept as partial satisfaction." Expected move about C 20, V 14; a stop at 30.

**G19 (written into this file at 15:15 UTC; ruled about 14:45 UTC): E3 BUILT; THE HEADINGS; SAFETY-BLANK.** WORDS-2's
E3: the custom-content leak (a quarrel keyed on a ground name a custom pack can supply) is cured by NATIVE ground
keys alone; THE FOURTH COLUMN HOLDS (highest share .24): E3 is ruled built. The seven "The shape of authority"
headings G12 left with one line each leave WITH that line (a heading over nothing is not printed). A blank "Safety"
section on the base (C dp-village-57) is its own unit, SAFETY-BLANK, WORDS-2's, a measure first.

**G20 (15:24 UTC): D6 STANDS; E8b's DESIGN.** WORDS-1's hand-ins: D6 `lane/words-1-2026-11-25-d6-wip` 81ac266a5 (pages
changed C 502, V 452, all page-only; cards to "Could contend" 933 / 669; the strata flag against the raw-record oracle
disagreeing 0 / 0) and E8 step one `-e8-wip` 94b7a13d9 (places moved C 390, V 381; 0 disagreeing; nothing moved
beyond the reflexive). ASKED: 285 (C) and 215 (V) bound cards say "Could contend" while in a recorded quarrel with the
holder. RULED: it stands: the label is true either way, the quarrel is printed in its own place, and a quarrel with
the holder is not a claim on the seat. One figure owed: the cards still reading "Contender" in all (backed by a
recorded quarrel: 115 on 109 pages C, 170 on 160 V). E8b (the card lines: tells, impressions, secrets, goal.long;
C 1,786 bound strings; their draws dedupe by text): WANTED BEFORE THE RELEASE; the draw and its dedupe run on the
text as today, the reflexive resolved AFTER the draw where the line is bound to its person; a site that stores the
text before its person is known is a stop. Built by WORDS-1 if its context is under 600,000, else by its successor.
NAMED FOR THE OWNER by the seat: the frozen writer-reach row "type on factionRelationships" (N to R), not re-recorded;
goldens `rosterFinalUnderHeldRoster` A1 and `generationForkCensus` A1 (both already on RED-AT-LINE).

**G21 (15:30 UTC): THE UNBOUND "CONTENDER" STAYS.** WORDS-1's figure: cards still reading "Contender" C 503, V 671; of them
with no recorded quarrel with the holder C 388, V 501. READ BY THE CHAIR in `src/domain/dossier/powerStrata.js` and
`PowerStrata.jsx` at 81ac266a5: a contender is a challenger of the coup derivation (`coupContenders`), the section's
heading is "The Seat and Its Contenders", and the ruler's card says "Contested" from the same count. RULED: nothing
more is built. D6's fault was a page contradicting itself (a contender beside a tie that binds it to the ruler); an
unbound challenger with no quarrel contradicts nothing printed. The other course (present tense only where a quarrel
with the holder is recorded) would also have to move the ruler's "Contested" and the heading: a redesign of the
section's words, not a cure. NAMED FOR THE OWNER'S VETO with the two figures.

**G22 (15:33 UTC): P9, THE BEASTS GRADE ON SETTLED LAND IS READ AGAINST THE NEED.** BIRTH-2's measure at 0ec96f13d8: C 0 of
900 (every C birth is frontier country), V 129 of 900 print a CRITICAL (118) or WEAK (7) beasts grade beside "settled,
nothing organized", and 4 print "defenses beyond the need" under CRITICAL or WEAK; every land; 102 score exactly 0.
THE CAUSE READ: the grade is `scoreBand(defenseProfile.scores.monster)`, a readiness; `data/defenceWeights.js ::
DEFENCE_TUNING.threat` gives settled country neither the folk ground nor the penalty, so a heartland place with no
force is 0; the line reads the threat and is true. THE WRONG READER IS THE GRADE (the owner's rule: a rating low because
a place is small is no danger). RULED: in settled country the grade is no lower than ADEQUATE, through the one leaf
(`facts/beastsReadiness.js :: beastsReadinessOf`), for every printer (the Defense tab's row, `threatAssessment.js`,
`defenseDisplay.js`, DS-GEN-3's band key). THE STORED SCORE DOES NOT MOVE. The 2026-11-12 ruling (CHARTERS-SECOND-WAVE
pattern 9: "settled country graded weak gets its own authored situation") IS WITHDRAWN BY THIS ONE, under the owner's
deferral of 2026-11-25: it needed new words and left CRITICAL printed over quiet land. The check over every birth with
an independent oracle (raw `config.monsterThreat`, the printed grade): 0 on C and V, page and PDF; a walker: no printer
reads the band except through the leaf. Expected move: C 0, V about 175 pages (129 + 46 settled towns graded low with
no line), record hashes 0; a stop at V over 200 or any birth moved. Unit `-p9-wip`; BIRTH-2's last unit, its 620,000
mark lifted for it. NAMED FOR THE OWNER'S VETO.

**G23 (15:41 UTC): C6 (B), THE SAMENESS TABLE, RECEIVED; ITS OWN LANE.** Written whole in `PRERELEASE-LIST.md` as E13
"SAMENESS-LIT" (C 97 and V 103 distinct wording slots over the owner's bar). BIRTH-2 saves its lists on its branch,
runs the door once as the gate runs it (its own plan: its `--check` on plan C read the register against the wrong
plan: 516 unregistered, 16 rises, 76 watch, 773 stale, 53 loose is NOT the door's reading) and reports five counts;
it builds nothing for sameness. P9 is built (`lane/birth-2-2026-11-25-p9-wip` f1990cc84), proofs running; the "46
settled towns" of G22 are 46 settled PLACES (44 towns, 1 hamlet, 1 village).

**G24 (15:44 UTC): D7 RECEIVED (`lane/birth-1-2026-11-25-d7-wip` b0cca45be).** A crisis line naming a body the roster lacks:
C 25 to 0, V 17 to 0 (oracle: the crisis's own powers by name off the roster; the leaf agrees on all 1,800); births
moved C 25, V 17 (only `powerStructure.recentConflict`, and `pressureSentence` on C dp-city-93); goldens 0/0. Built: the
atom `crisis body: <kind>` (indebted, religious_conversion), `src/domain/facts/crisisBody.js`, `CRISIS_BODY_SIBLINGS` in
`data/powerSiblings.js` resolved at the END of `assembleSettlement.js` against the settled record. The seat's call,
accepted: the conversion sentence's copy declares `priest` on the line (0 births moved; no shrink-only register gained a
row). Listings by their own doors: factLayers.shared, table-pools, the PRESSURE_SENTENCES ledger 28 to 29, pool-dominance
(1 row by `--bank-new`: its nature owed in the hand-in). BYTES: first paint raw 1,181,337 to 1,187,083 (+5,746; gzip
+1,646; Brotli +1,409), worker +3,221: `factsOf -> crisisBody -> people/stressPowerFaces` brings the face table into the
eager chunk. RULED: no second home for the names; SIZE-BACK's method (the lazy-domain list, behaviour proven unchanged)
is tried on it by CLOSE-7 at the second hand-in; the rest is named for the owner's size signing. Every BIRTH-1 unit
(d2, d2b, d3, d5, d7, d8) is green on both typechecks in its own worktree. FOR THE OWNER'S VETO: the atom, the four
sentences of G17/G18, the `priest` declaration.

**G25 (15:59 UTC): D7's ONE WORD; BIRTH-1 FINAL.** The pool-dominance row (`ledger:powerSiblings:CRISIS_BODY_SIBLINGS`, top1
1 over 93 notes in 51 towns, a pool of kind T with no draw) is that door's own listing by `--bank-new`: accepted, named
for the owner. THE SEAT'S FINDING: seven conversion places of the quarrel corpus hold the body and a church but no senior
cleric (quarrel-village-59, -129, -147, -284, -327; quarrel-town-15, -288): the `priest` declaration refuses the
original there and the twin is refused too, so the line prints as at the base, noted "kept". RULED: declare `church`
in place of `priest` (a place with the body and a church may be told of its two priests); one commit on the d7 branch,
replacing b0cca45be at the hand-in; C, V and goldens moved 0. BIRTH-1's hand-back is final at bb9350cdc on
`lane/birth-1-2026-11-25`: D2 4ea69f420, D3 5262fbee4, D5 289a70b3a, D2b 4822a2175, D7 (to be replaced), D8 cf5d033e5
PARKED owing one widened-register row ("family") on the owner's leave.

**G26 (16:21 UTC): E1 RECEIVED; E7 (b) BLOCKED BY ITS OWN DOOR; HAND-INS TO THE CHAIR.** E1 `lane/words-1-2026-11-25-e1-wip`
902b7005d: the double possessive on owner pages C 125 in 122 places to 0, V 145 in 126 to 0; on the public projection
52 in 41 and 34 in 19 to 0; record strings 120 and 96 to 0; places moved by page 122 / 126; battery rows 0/0;
unexplained 0/0; five joiners the first joined run found cured by the same rules; named: the surname "He" reads "He's".
E7 (WORDS-2): `node scripts/sameness-census.mjs --write` on E7's tree rendered 900 places twice and wrote nothing, exit
1 ("a write never raises a ceiling"): 14 slots above their ceilings on both renders (PDF NPCQuickRef NPCRow and
NotableNPCs FullCard in town, city, metropolis, .93 to 1.00 against .08 to .60; web World/NPCs InfoPill in hamlets,
1.00 against .70; Viability in hamlets on the web tab and the PDF callout, .48 to .51 against .29). E7 changes only
unused text keys, so the breaches are inferred to stand on the base: BIRTH-2's run under G23 (2) answers it. RULED:
E7 handed in as (c) built, (a) measured not built, (b) blocked; the 14 slots go to PRERELEASE-LIST E13.
CLOSE-7 HANDED OVER at 28547978e: every hand-in now comes to the chair only; `gen/HAND-INS.md` is the one table.

**G27 (16:27 UTC): D7 AT 710a49473 (replaces b0cca45be).** The seven quarrel places are admitted; C and V moved 0 of 900
each; goldens 0/0; the false-presumption check green; `tests/lint` as at the base; both typechecks green in its tree.
ACCEPTED WITH ONE KNOWN NOTE: two other places of the quarrel corpus (quarrel-thorp-43, quarrel-hamlet-139: the body and
a High Priestess, no church) are now noted "kept" where `priest` admitted them; what prints there is unchanged and true
(a priest stands). The declarations cannot say "church or priest"; no twin is written for two notes. BIRTH-1's hand-back
at 84839716e; the seat has stopped.

**G28, G29 (16:36 UTC): E8b's PLAN NOT VETOED.** WORDS-1 (its context about 200,000 by its own estimate) cuts E8b on top of
`e8-wip` 94b7a13d9 (it re-uses `reflexiveOf`). Its measure at the base, bound card lines in 12 rows: C 1,157, V 1,126
(the tell "speaks of themselves..." 899 / 852; the impression "sure of themselves" 202 / 215; crisis secrets 25 / 28;
rare secrets 11 / 12; the siege goal.long 13 / 8; title secrets and a musician's behaviour 7 / 11). No stop site
(gender is set at `npcGenerator.js:132`, before every draw). PLAN: every draw and dedupe untouched; ONE resolve pass
after the last generation-time reader (`narrativeGenerator.js:1068`; skipped under a held `npcs` pin; on the regen
path `generateSettlementPipeline.js:617`, non-keepers only), a closed table of the 12 rows; six later readers of the
stored text read in the held form through one shared helper (`tonightSheet.js:574`, `:609`; `crisisFactFindings.js:233`;
`rareSecrets.js:413`; `goals.js:1002`; `successorNpc.js:49-50`, which copies the held form). THE CHAIR ADDED: the round
trip over every card of C and V (`heldText(after)` byte-equal to the base, 0 differing) and a walker that no reader
matches those rows except through the helper; the successor's output byte-unchanged (advance time is another work).
