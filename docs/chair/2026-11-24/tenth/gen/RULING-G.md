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

**G30, G31 (17:01 UTC).** G30: E8b makes `worldPulse/successorNpc.js` copy the HELD form of a tell and of goal.long (one
edit, under the border's exception: this release must not itself break advance time), so a successor's output is
byte-equal to the base's. G31: WORDS-2's sixteen hand-ins received (`HAND-INS.md`). SAFETY-BLANK IS A FAULT OF THE
MEASURE, NOT OF THE PAGE: a label with no value is only ever Overview "Safety" (C 54, V 63 pages), in every case its
word equals the Prosperity word above it, and the page census walk keeps each line once per panel
(`tests/components/pageCensusWalk.shared.mjs:111-112`); the page prints the word. Nothing built; the walk's set is not
changed. TWO MEASURES ORDERED FROM WORDS-2 (333,999 used, cost 96.69): "TWICE-IN-PANEL" (what the set hides: a line of
six words or more printed twice in one panel, on C and V) and "E13, STEP ONE" (for each of the 14 slots above their
ceilings: the top sentence, its pool, why the share is high, since when, a cure in one line).

**G32 (17:24 UTC): E13 STEP ONE: THE 14 SLOTS ABOVE THEIR CEILINGS, EACH BY ITS CAUSE.** WORDS-2's measure on the base with
the door's own `measureSlots`. (1) OUTLOOK VIABILITY, web and PDF callout, hamlet (3 slots; .48 against .29): top "#
feeds itself and pays its own way."; `dossierViewModel.js:311-316`, the self-sufficient verdict holds 3 lines and a
twin; A GATE THAT FALLS FORWARD: lines 2 and 3 refuse wherever `needsImports` holds and `pickTrue` hands line 1 on
(hamlets: line 1 72, line 2 7, line 3 6; thorp 98/4/1; village 54/0/1). RULED BUILT (`-e13a-wip`): each state of the
verdict holds at least three true lines and the line is drawn among the admitted by the slot's keyed draw; new
sentences named for the owner's veto. (2) THE NPCs HELP PILL, hamlet (1 slot; 1.00 against .70): a fixed caption, one
line by construction. (3) PDF NPCRow and NotableNPCs FullCard, town, city, metropolis (10 slots; .95 to 1.00 against
.08 to .60): a ROLE TITLE ("the senior craft-guild master", "the senior charter master") the door counts as a
sentence because it is 25 characters long. (2) and (3): NOTHING BUILT; raising a ceiling or teaching the door to skip
a title loosens a door: THE OWNER'S, named with the chair's recommendation (the door should not count a role title or
a fixed caption as a drawn sentence). SINCE WHEN: the register was taken once, at 7e93c087b on 2026-11-20, and never
re-taken; nothing says which of the 1,489 commits since crossed each ceiling.

**G33 (17:57 UTC): TWICE-IN-PANEL RECEIVED.** Written whole in `PRERELEASE-LIST.md` (E13's parts). One real fault of
wording: "How they deal" is one line per (register, temperament), up to five identical on a page: E13b, its own unit
after point 118 (it moves a stored string on nearly every birth). The rest are labels and lists printed where they
belong. E13a is built at 608f70826; its proofs run.

**G34, G35 (18:23 UTC): THE OWNER'S TWO DEFERRALS DECIDED.** His words: "I defer this to you:" over "One register row for
'the lord's reeve', or leave it parked." and "Whether the repeated-wording check should skip job titles and fixed
captions. I recommend yes." G34: THE ROW IS ADDED: D8 is unparked; BIRTH-1 adds the ONE row ("family") in the widened
register by that register's own door, its own commit quoting the leave, then D8's proofs and hand-in; more than one
row is a stop. G35: YES: the sameness door does not count a role title or a fixed caption as a drawn sentence; unit
E13d (WORDS-2): the skip list is DERIVED by import from the titles' own homes and `sectionHelp.js`, never typed, never
by length, never a slot skipped whole; a test that no drawn pool's line is in it; the door's reading before and after
(only the eleven slots change; one still over its ceiling is a finding); the register re-taken only by `--write` and
only if it passes.

**G36 (18:24 UTC): E8b RECEIVED (e75f090b7, on `e8-wip` 94b7a13d9); E13b A MEASURE AND A DESIGN FIRST.** E8b: card strings
moved C 1,157 in 501 places, V 1,126 in 500 (the measure); round trip `heldCardLine(after)` against before 0 / 0;
nothing moved beyond the reflexive; owner-page places 43 / 51; `successorNpc.js` copies the held form and six
successors on made records are equal on both trees; a walker with a planted control (4 readers through the helper, 3
before the pass with reasons). WORDS-1 is given E13b ("How they deal": one sentence per disposition and trait
family, up to five identical on a page): where it is drawn and read, how many cards of one pair a town holds, a design
in which no other draw moves and each pair's present sentence stays its first line, what a birth moves, how many new
sentences: one message; nothing written before the chair rules on the number.

**G37 (18:24 UTC): P9 RECEIVED (`lane/birth-2-2026-11-25-p9-wip` 34212dfd2); ITS WRITER-REACH ROWS; P9b.** The every-birth
check (raw threat tier against the printed grade: web Defense, web Overview, PDF): C 0 to 0, V 175 to 0; records moved
0 / 0; pages C 2 (dp-thorp-2, -3: called render noise by the seat: CLOSE-8 says what it is) and V 175, every one
heartland with a stored band CRITICAL (151) or WEAK (24); readers through the one leaf: DefenseTab, threatAssessment,
defenseDisplay, OverviewTab, generalDeskRead, the pdf viewModel's defenseScores. ASKED: `writerReach`'s round trip reds
because the frozen reach of "monster on economicGates" and "monster on scores" loses web-display (no display file reads
`.monster` now, only the leaf). RULED: the register must stay TRUE: the page does display it. At the join the leaf is
declared to the door as a reader on display's behalf if the door has such a form; if it has none the register is
re-taken by its own script and the diff comes to the chair with those rows named and the gap written down. NAMED BY THE
SEAT, RULED A MEASURE (P9b): the PDF's four defence averages still average the stored score. BIRTH-2's section 0 is
final; the seat has stopped (733,556 used at 18:00).

**G38 (18:30 UTC): D8 IS PARKED AGAIN; G34's ROW IS NOT ADDED.** BIRTH-1 stopped, rightly: `node
scripts/presumed-things-door.mjs --check` names TWO fresh hits on the one literal "the lord's reeve" (`house: lord's
reeve`, `house: reeve`), not the one row its hand-back had said; and the door's `--bank` takes only a literal that
stood at its base revision ("SHRINK-ONLY: no line is ever banked to absorb a NEW line"), so only a hand edit could add
either. The owner's leave was for ONE row added properly: two by hand is outside it; nothing was written. The door's
lawful route for a new line (a declaration, as D7 used) is closed too: arm 1 credits `needs`/`excludes` only on an
object a draw door is handed (`tests/lint/presumedThings.shared.mjs:100-115`) and a catalogue row's face is handed to
none; and `house: lord's reeve` has no atom (`src/domain/facts/registeredWords.js:510-520`: it waits for a factsOf
getter). THE FACE STAYS "the reeve" (the base's). The proper cure is its own unit, not in point 118: a factsOf getter
for the house and the door handed the catalogue's faces. D8 at cf5d033e5; BIRTH-1's section 0 at 849e31687.

**G39 (18:37 UTC): E13b RULED BUILT: 70 NEW "HOW THEY DEAL" SENTENCES.** WORDS-1's measure at 0ec96f13d8: the line is drawn
once and draw-free (`npcGenerator.js:542`, `npcData.js :: dealingLineFor`: the disposition and the first of
flaw/dominant/modifier that names a family, else the disposition's own line), stored at `presentation.behaviour`, a
title row may replace it; NO reader matches it by text. Cards holding one: C 5,148 of 27,360, V 4,861 of 26,238; 52
pairs (4 dispositions by 12 families, and 4 own lines), all met; town-pairs holding 2 / 3 / 4 / 5 cards: C 590 / 96 /
12 / 2, V 532 / 72 / 9 / 0; towns with any pair doubled C 333, V 336. THE DESIGN (accepted): one town pass beside
E8b's; within a town the cards of a pair ranked by fnv1a32(seed, "dealing", card id); rank 0 keeps today's line; no
stream pull; new lines in a new table (generationForkCensus pins `npcData.js:1686` by line). THE NUMBER, by a rule not
fitted to the proof sets: every pair holds at least two lines (52 new); the 18 pairs seen at three or more cards in a
town hold three (18 more): 70; the pairs at four and five repeat once (about C 14, V 9 town-pairs). The sentences are
the owner's to veto, in `e13b/SENTENCES.md`. Cut on top of E8b e75f090b7; moves about C 826 and V 703 strings in 333
and 336 places and nothing else; a title row's line never re-ranked.

**G40 (19:05 UTC): E13a RECEIVED (`lane/words-2-2026-11-25-e13a-wip` e0fd74c58); WORDS-2 HANDS OVER.** Records moved 0 / 0;
pages C 240 (thorp 87, hamlet 77, village 54, town 22), V 116; on the door's own births the three Viability slots:
hamlet .48 to .20 (ceiling .29), thorp .653 to .253, village .36 to .18, the larger sizes unchanged; no line saying
nothing is bought in beside a marked need. THE TWO NEW SENTENCES, FOR THE OWNER'S VETO: "<town> feeds itself and pays
its way, and buys in what it cannot make for itself." and "What <town> eats it grows, and what it spends it earns; some
of what it needs is bought in." The sameness register is not re-taken: `--write` still refuses on the eleven slots
until E13d. WORDS-2's hand-back section 0 (docs 37734ade0) carries every unit and E13d written whole for the next seat.

**G41 (20:45 UTC): E13b RECEIVED (`lane/words-1-2026-11-25-e13b-wip` 7afbb043b, on E8b e75f090b7).** Behaviour strings moved
C 812 in 333 places, V 694 in 336 (the measure said 826 and 703: the difference is the residual cards that wrap to the
first line); the record's hash with `presentation.behaviour` set aside equal on 900 of 900 in both sets; no town
without a doubled pair moved (0 of 567, 0 of 564); no two cards of a pair share a line while the pool allows; residual
16 cards on C (12 pairs at four, 2 at five) and 9 on V. Five drafts were re-worded for the style and presumption
walkers. THE 70 SENTENCES WENT TO THE OWNER FOR HIS VETO (the chair read the first two dispositions' tables: each says
what its first line says, in the table's voice). WORDS-1 hands over after this.

**G42 (20:48 UTC): CLOSE-8's JOIN PLAN RULED; POINT 118's CONTENTS FIXED; POINT 119 NAMED.** CLOSE-8 stands on 09c29806b
(point 117). 29 units (the table less D8 and A5), every unit's merge-base with the line 0ec96f13d; conflicts predicted
by `git merge-tree`: in src ONLY E1 with E8 (`goals.js`, `personMention.js`, `goalSentencesOnceInTown`: WORDS-1's note
covers them); registers: the lighting census on 19 units, observed-shape on E4, E9, G1, G6, the mutation manifest D4
with P9. THE ORDER: D5, D4, D3; D2, D2b, D7, P9; E1, D6, E8, E8b, E13b; E10, E11, E12, E7, E9, E4, G6, G1, G8, G9, G10,
G11, G34, E5, E6, E13a; E3 LAST (the only WORDS-2 unit that moves records). RULED: (a) a census conflict takes the
join's side and each door re-takes once per group and once after E3; (b) the mutation manifest is the union of D4's and
P9's rows; (c) POINT 118 = the 29 units, the four cures (goals I-13, NEED-ATOM, D7's bytes, the writer-reach row for
D6) and P9's writer-reach rows (G37 (i)). POINT 119, built by CLOSE-8 after its landing line, each with its own second
read: B1(ii) REDESIGNED (R24r 1), B1(i)b (R24r 6), E13d (G35), P9b's measure (G37 (ii)). WORDS-1 HANDED OVER at
93247bdb3 (E1, D6, E8, E8b, E13b in that order).

**G43 (00:28 UTC on 2026-11-26): D3 WITH E3: A MERGE THAT WAS CLEAN IN TEXT AND WRONG IN MEANING; ONE HOME.** CLOSE-8 stopped
after 29 of 29 (E3 merged at b0815cab58, not pushed): `typecheck:ratchet` +1, TS2353 in
`src/generators/power/governanceLabelRoster.js`. D3's new leaf (`governanceLabelRosterOf`, read by `rulingStructure.js`
at about line 695, the sentence re-written over the repaired roster) COPIES rulingStructure's inline flag in the OLD
shape (`institutionNames`, `pastoral`, raw `config.nearbyResources`); E3 changed `data/powerSiblings.js ::
noGrazingQuarrelOf` to `({ leadingFood, grounds, terrain, route })` and its one call. Git merged it; at run time D3's
re-write path would have called E3's rule with no leading food, raw custom-leaking grounds and no terrain or route:
G13 and G19 (1) silently undone wherever D3's path writes. THE TYPECHECK CAUGHT IT (the seats' JSDoc). RULED: not the
copy brought up to date but ONE function computing the flag from the birth's inputs, called by both sites; a test that
`noGrazingQuarrelOf(` is called from exactly one place in src; D3's every-birth check 0 and E3's four columns equal on
the joined tree or each differing cell named. The commit is no seat's unit: the second reader reads it by name.

**G44 (01:17 UTC on 2026-11-26): GOALS-I13 TAKEN AS BUILT, SHORT OF ZERO; THE RESIDUAL IS THE DEAL'S DESIGN.**
`lane/close-8-2026-11-25-goals-i13-wip` b136ae0b2d (`goals.js` and `goals.test.js` only): the receipt now records the
held lines' holders (cell, reserve, crisis, siege), the RANK floor's ids, namesakes, the handler's agents, the uncanny
cap, every slot a candidate-builder reads, and pass two's rung over every holding. I-13 faults: C 136 (122 towns) to
6 (6), V 172 (148) to 6 (6); records moved 0 / 0 by hash and fields; draws, order, keys and candidate lists unchanged;
red first on a named case (Portaminus). THE TWELVE LEFT ARE TRANSITIVE ABSENCE READS: card B read nothing of X; with X
gone an earlier card A takes another wording, which B then repeats, so pass two rotates B (11), and one siege line is
freed the same way. RULED: taken into 118; the vacuity floor is not lowered and the receipt is not made to say "read
every earlier holding"; the residual is written where the property is claimed (the test's header, the receipt's
comment) with its counts; the measure kept runnable. ITS CURE IS AN ORDER-FREE DEAL, WHICH MOVES BIRTHS: its own
decision, named for the owner on the pre-release list; not point 118 nor 119. The only reader of `refs`:
`goals.js :: refuseWantsBesideSecrets` (copies them to a moved card's receipt).

**G45 (05:29 UTC on 2026-11-26): THE SECOND READER ON POINT 118 FOUND EIGHT; EACH RULED.** Its report: `landing/118/SECOND-READER-118.txt`
(the join at 3836a832e3; every finding run). THE CHAIR HAD ACCEPTED EVERY ONE OF THESE UNITS ON ITS SEAT'S PROOF.
(1) E4 WITH G6: G6 marked one line of pool C4 `no exports`; E4's rewording of the same claim (the chair's own G3 wording)
carries no mark and prints beside printed exports (18 of 300 births). RULED, AND A RULE FOR EVERY SUCH CURE: THE GATE BELONGS
TO THE CLAIM, NOT TO ONE LINE: every line of a pool that makes the refused claim carries the mark, and the check counts by
claim with the page's own printed fact as oracle. CURED IN 118.
(2) E1's `ofForms` garbles a place whose NAME holds a possessive ("the gambling of Dragon's Reach tables"); view-time, so
saved towns so named too. (4) E1's `qualifiedPossessives` puts the verb before its subject (1 of 420 births; stored;
served publicly). RULED: ONE PRINCIPLE: where a rewrite cannot be sure where the possessed phrase ends, the ORIGINAL
stands (an awkward double possessive is a blemish, a garbled sentence a fault); `ofForms` acts only on the template
shapes E1 measured, never on a place's own name. THE PROOF IS BY READING: every pair E1 changes on C, V and soak 0 to
419 written out and read; twelve hostile place names. THE THRESHOLD (the lesson of C1): a THIRD kind of garble and E1
COMES OUT OF 118 whole, re-built at the template level (authored twins) for a later point.
(3) and (6) E13a says "bought in" where nothing arrives (4 of 300 small births); its test counts an unmet need as bought.
THE CHAIR's G32 SAID "only what `needsImports` and the verdict already say": that wording made the fault: a line that
says something is bought asserts an arrival. RULED: the lines admit on what arrives; the test's oracle is the printed
arriving list. CURED IN 118.
(5) A SAVED TOWN's DAILY LIFE IS RE-DEALT BEYOND THE RULED LINES: G8, E5 and E6 change the admitted lists and
`dailyLife.js:426` picks `eligible[hash % length]`: of 360 base-born records 62 lines move, 53 of them lines no unit
ruled on, each to another true line of its pool. THIS IS THE CLASS THAT TOOK B1(ii) OUT (R24r). RULED, WITH THE LINE DRAWN:
a NAMED THING of a saved town (a rite, a person, a house, a power) never changes by a view-time re-deal; a flavour
sentence drawn from a pool may, once, at this release. ACCEPTED FOR 118, MEASURED AND TOLD TO THE OWNER (about one saved
town in six sees one Daily Life line replaced by another true one). ITS CURE IS A UNIT OF ITS OWN, "STABLE-PICKS": a
view-time pick that a line's admission can move only for the towns that drew that line (the highest hash of seed, slot
and line id in place of an index into a list), taken by a record this engine bore, so that no later pool change re-deals
a saved town; on the pre-release list.
(7) D7's ruled pressure twin ("the creditor's letters began last month") cannot print: a refused row takes the next
admitted row and the twin only when none is admitted. NOT A FAULT OF TRUTH (the line printed is true and names no absent
body); the chair's report of that sentence to the owner as one a page would show is CORRECTED. Left as built.
(8) G8 moves its claim to sibling lines: a measure first by the cures' builder; if the siblings make the refused claim,
rule (1)'s rule applies.
ALSO READ, FOR THE SHARE PAGE's LANE, OLDER THAN THIS CHANGE: a veiled face's TITLE in public tie prose ("…which would
put the gang boss two favours ahead"): 207 strings in 360 births at the base, 199 at the join. THE CURES: one builder
(`prompts/START-CURE-118.txt`, its tree /home/user/wt/cure118 cut at the landing tree's 55bbd338a3), then a short second
read of its diff, then the helper merges it. THE LINE DOES NOT MOVE BEFORE.

**G46 (06:17 UTC on 2026-11-26): "CLOSE-8 3836a832e3" RECEIVED; POINT 119 GOES TO A FRESH SEAT.** The join's own proof (its
`close-8/LANDING-118.md` at f060302d86): typechecks 167 and 1113; packets 257; `tests/lint` the line's three; `tests/copy`
175 of 175; C moved 746 records and 887 pages, V 650 and 857, unexplained 0 / 0; battery rows 0 and -129 (P9's); every
unit's every-birth check 0 or explained (E8b's round trip 824 / 700 = E13b's and E1's strings; E3 22 of 24 cells equal
to WORDS-2's column, the two by D2b and D7; D3's 25 / 17 = D7's twin births; GOALS-I13 6 / 6, G44). SIZES ON THE JOIN
(named for the owner, raised by nobody): first paint 1,192,243 raw (+9,349 on the line), 380,313 gzip (+3,581), 319,289
Brotli (+2,685); the worker 2,740,114 (+17,820); the engine chunk 937,530 (+3,317). I-13's cost: 100 cities and
metropolises 37,604 to 37,435 ms; refs a town 63 to 2,822, held in a WeakMap, not on the record, not served. THE
WRITER-REACH REGISTER re-taken by its door: D6's row N to R; P9's two web-display rows REMOVED (the door has no form to
declare a reader on display's behalf: THE REGISTER NOW UNDER-STATES, written down under G37). Rows of the known list
green on the join: `defenceParts` R13, `faultsNeed` 1, goals I-13, the five of ANCHORS-5. CLOSE-8 (485,514 used at
05:45, cost 116.87) HANDS OVER; point 119 (B1(i)b, E13d, P9b, D13 STABLE-PICKS as a design, B1(ii) redesigned last) is
CLOSE-9's (`prompts/START-CLOSE-9.txt`), on the join's tree, outside the cures' files.

**G47 (06:35 UTC on 2026-11-26): E1 COMES OUT OF POINT 118; THE OTHER THREE CURES ACCEPTED.** The cures' builder (branch
`lane/stack-118-cures-wip-2026-11-26`, tree /home/user/wt/cure118, tip 53db42b4cb): (1) 8413326b00: C4 v6 carries
`no exports` (the siege lines say trade has stopped, another claim); pages printing the claim beside printed exports
C 0, V 0, soak 0. (2) 7b90b362c8: the two viability lines admit on `buysIn`; the test's oracle is the printed arriving
list; top share C thorp .36, hamlet .37, village .33; V .38, .26, .37. FOUND AND LEFT: the pre-existing twin line
"…buying in what its own land and trades do not provide." prints on 8 pages whose arriving list is empty while food is
bought (`buysIn` counts the food's import share): at the base too: written down for a later unit. (3) d41f839642: G8
refuses A7 and A16 under a printed Pressured band; A4 and A14 make the same claim and now carry the mark; A3 ("Most
households…") does not. (4), (5) and THE READING OF EVERY PAIR E1 CHANGES: 444 pairs (355 distinct) on C, V and soak
0 to 419: 443 sound, ONE GARBLED AND OF A THIRD KIND: soak1k-166 "the midwife needs master)'s silence about certain
others" (E1's `mentionOf` skips the possessive role and takes "master)" off a bracketed name as a surname). THE
THRESHOLD OF G45 HOLDS: three kinds from one unit is its design. E1 IS REVERTED ON THE CURES' BRANCH (RULING-CURE-118-2:
its merge 512428a78b reverted; E8, E8b, E13b, D6 and cures (1) to (3) kept; proven EQUAL to the run with E1's rewriters
stubbed to the identity). THE DOUBLE POSSESSIVE STAYS ON PAGES FOR NOW (owner pages 125 and 145 of 900; the public
projection 52 and 34): a blemish, known. ITS REBUILD ("E1R") IS AT THE TEMPLATE'S LEVEL: each template that puts a
possessive after a slot gets an authored twin, chosen where the slot's value is itself a possessive phrase; no finished
sentence is ever rewritten by pattern. On the pre-release list.

**G48 (07:13 UTC on 2026-11-26): P9b RULED: THE MEAN READS THROUGH THE LEAF, A UNIT OF POINT 119, BUILT AFTER POINT 118 LANDS.** CLOSE-9's
measure on the join 3836a832e3 (C and V re-born): the 175 V births where P9's leaf lifts the beasts grade (C 0); the mean of the
stored scores differs from the mean of the scores as shown in 172 of 175 (+1 to +7 points; its band in 68). WHAT PRINTS FROM THE
MEAN: NOTHING, 0 of 175 (no PDF section prints "Score avg" since W4; `headlines.js :: defenseHeadline` reads the mean only where no
readiness label exists, and all 175 carry one; the parity contract's `defense.scoreAvg` row; the web's `deriveDefensePosture`,
printed by no component). So P9b is not a page fault today: it is a door left open (a later printer of the mean would bring the low
band back). RULED: `avgScore(scoresAsShown(s, dp.scores))` at the five sites (pdf viewModel three, `viewModelBodySlices` one,
`dossierViewModel :: deriveDefensePosture`), web and PDF in ONE commit (the parity row), with its proof: 0 printed lines move, 0
records move, the parity row equal. NOT the retirement of the dead fields (more churn; the parity pin and the headline gate read
them). ORDER: after point 118 lands (`dossierViewModel.js` is the cures' file), cut on the new line. Confirmed by the seat by source
read and measure, not by a rendered-text diff: the unit's proof is that diff.

**G49 (07:19 UTC on 2026-11-26): THE SECOND READER ON THE CURES OF POINT 118 (seven findings; `landing/118/SECOND-READER-CURES-118.txt`), RULED.**
THE REMOVAL OF E1 IS SOUND by its read and the chair's (src clean by E1's names; nine files byte-equal to before E1;
`personMention.js` byte-equal to E8b's; nothing of a later unit lost). ITS FINDINGS:
(1) the lighting census baseline stale and the observed-shape baseline holding E1's hashes: re-taken by their doors (RULING-CURE-118-3 (G)).
(2) FIX (3) RE-DRAWS SAVED TOWNS OUTSIDE ITS CLAIM (the fare is a modulo over the eligible lines: 111 of 150 moved fare lines on
the soak came from a line that was not false). ACCEPTED FOR POINT 118 on G45 (5)'s footing: a landing is not a release, no saved
town sees a point, and WORDS-2's A7 and A16 on the same pool already re-draw the same places in this point. WHAT CHANGES IS D13:
ITS BAR IS NOW MASTER. D13 STABLE-PICKS is proven against towns BORN ON MASTER (db832c8926, what a saved town was shown) and
viewed on the release: a flavour line a saved town printed on master prints again unless that line is refused now or gone; and
its FIRST STEP IS A MEASURE of which fact atoms a master-born record lacks on the line (the reader: with the food record absent,
`excludes` refuses the unknown atom and 79 places printing "Secure" lose true lines). The slots it must cover are named: the
fare, the viability summary, the state-prose pools.
(3) CURE (2) AMENDED: "what it needs is bought in" needs BOTH a marked need AND something arriving (`needsImports && buysIn`);
as built it admitted five lines on a place with an arriving luxury and no need, two contradicting each other (dp-hamlet-82).
The state "a marked need, nothing arriving" has line 1 alone: accepted. THE CHAIR ACCEPTED (2) AS BUILT BEFORE THIS READ AND
SAID SO TO THE OWNER: corrected to him.
(4) E2b, written down (the fallback beside "No recorded imports.": 4 of 1,000; at the base too).
(5) FIX (1)'s COST: a calm C4 place with exports and no market (129 of 1,000) admits v1 alone; v1 rises 148 to 215 pages. ACCEPTED
for 118 (the fix is right; the pool is thin). ITS CURE IS A UNIT OF POINT 119, "C4-SECOND-LINE": one line true of EVERY calm C4
place, so no gate can make it false: `[street · no crisis: under_siege · no crisis: plague_onset]` "{settlement} is poor, and
its {access} has not changed that." (the chair's wording; the owner's to veto), written in the content document and projected by
the generator, never by hand in the generated file. The mark `no exports` reads the stored list (soak1k-888 prints none and
lost v6 all the same): a refusal the place did not need, in the safe direction: accepted, named.
(6) A1 ("There is enough to eat, if nobody asks for much more than the day needs.") STAYS UNMARKED: a conditional line that
reads as scarcity, as A3 ("Most households...") and A6 ("usually enough") are quantified; a printed Pressured (a share of the
need unmet) does not make it false. A judgment, the chair's, vetoable.
(7) E1's known cost (102 of 1,000 soak births print a double possessive again): G47, E1R.

**G50 (08:04 UTC on 2026-11-26): CURE (2) A THIRD TIME: THE SENTENCE CHANGES, NOT THE GATE. E1'S REMOVAL PROVEN.** The cures' builder
(tip cc80d9c215): E1 out by revert 6a1ec0e036 (its own cures (4), (5) reverted first); nothing of E1's names left; against the
run with E1's rewriters stubbed (C 900, V 900, soak 420; about 9.15 million strings) 30 strings differ, all one authored literal
("laid at the carriers' master's door"), byte-equal to the line's 09c29806b85a; all other strings 0; typechecks 167/167 and
1113/1113; the kept units' tests green each alone; tests/copy 175 of 175; both baselines by their doors; tests/lint at its three
base reds. THE AMENDMENT OF G49 (3) WAS THE CHAIR'S OWN FAULT OF DESIGN: `needsImports && buysIn` says a need is MARKED and
something arrives, not that the NEEDED thing arrives: 15 of C's 103 self-sufficient hamlets (dp-hamlet-13: timber needed and not
arriving, incense arriving) still printed "some of what it needs is bought in". Three gates on one sentence is the unit's
design, by the chair's own rule. RULED (RULING-CURE-118-4): line 5 says "some of what it USES is bought in" (the chair's
wording, the owner's to veto), and lines 4 and 5 admit on `buysIn` with no food bought: the gate is the claim, and the claim
is one the page already checks (its own arriving list). Four states, written in the comment. The proof: against the join, three
counted classes and no fourth. The viability slot is re-dealt against master by E13a's own design (G32, G40): D13 names it as
an intended exception.

**G51 (08:12 UTC on 2026-11-26): THE FOUR NEW REDS OF POINT 118'S WIDE GATE, EACH RULED BY ITS CAUSE.** The landing's helper traced
each to the join's unit that turned it red (halving in a detached scratch worktree; all four green at 09c29806b85a, all four
red at 3836a832e3). (1) `publicProseEquality` (defense, soak1k-7): A PRODUCT FAULT OF G11 (merge e1bf9d2a13):
`safetyLineSaidOnce` trims the Defense line's opening clause only off the shared page, believing a shared page prints no
identity line; it does (its Overview prints "no stable governing authority"), so the owner's player view and the shared page
differ. CURE (6): the exemption leaves; proof: the two pages equal on every such place, and no shared page loses the fact.
THE CHAIR ACCEPTED G11 (G6 #11) WITHOUT THIS; the equality test caught it, which is what the wide gate is for. (2)
`smallPlaceTierNoun`: A STALE SAMPLE (G6 put `no exports` on C4 v2, and none of the arm's 60 places draws the header now;
the helper found three that do, and screen and PDF agree on all three): cure (9), named places added by key. (3)
`bar8DesksDef` 14c: A STALE ANCHOR (G1's mark `ruling body`: r2r-hamlet-33 is a headman with a second, one holder, and
prints no council line, as G1 means): cure (7), the anchor re-chosen by the test's own criterion. (4)
`crisisBlindDossierProse`: A TABLE LACKING A DIMENSION (`ruling body`, first declared by a state-prose pool in G1): cure
(8), the setter added as its sibling's. All four on the cures' branch (RULING-CURE-118-5); none goes on the known-reds list.

**G52 (08:57 UTC on 2026-11-26): THE SECOND READER ON POINT 119's FIRST TWO UNITS (`landing/119/SECOND-READER-119-A.txt`), RULED. BOTH GO BACK.**
B1(i)b (32704b806) IS RIGHT IN ITS DIRECTION AND WRONG IN ITS RULE. The flag `livesOn: 'game'` reads "the land lists hunting
grounds", not "furs reach this place": two desert metropolises keep the district on DEPLETED grounds (they print the import
"Game and hides (local hunting grounds exhausted)": right, but by accident), and three (dp-metropolis-19, -98, -143: a
crossroads with a northern-furs entrepot, importing raw hides) LOSE it. A furrier works hides; a hunter's lodge hunts. R24r 6's
own words were "no hunting grounds AND no fur import". RULED, "B1(i)c": the Furrier's district stands where hides reach the
place: game on its own land, OR hides or furs that arrive (the entrepot's goods, a route's, as far as the house draw can know
them: MEASURE FIRST what is known at the draw; if the imports are decided after the houses, say so and propose, do not guess).
The Hunter's lodge keeps its own rule. Its instrument (`pageCensusFindings.js` B1land) does not report a house the user
FORCED. Its checks: every desert birth of C and V (the district beside no game and no arriving hides: 0; the district withheld
where hides arrive: 0); a forced district stands; base-born records byte-equal. `siteCoherenceRatchet` C1 (one place,
bookkeeping: the cascade's re-deal changed which export decides its row) is re-read after the rework: if it still moves, it is
NAMED for the owner and raised by nobody.
E13d (3b4fe205f): THE SKIP IS SOUND TODAY (no counter-example in 304,427 source literals; 19 strings, only in their homes) AND
ITS GUARD IS HOLLOW: the walker's arm that says "no line of a drawn pool is in the skipped set" reads only plain-string arrays
under src/data, not the 1,482 object pools (5,655 lines) nor anything outside src/data: a planted caption in a Daily Life pool
passes it. RULED, "E13d-2": the guard reads every drawn pool whatever its shape and home (the register's own drawn rows are
the list of pools; a pool it cannot read is a failure, not a pass), red first on the reader's plant. AND THE REGISTER'S RE-TAKE
(81c2efc8e) IS DROPPED FROM THE UNIT: (i) it was taken without B1(i)b, which moves 19 births of the door's corpus; (ii) THE
DOOR HAS A HOLE THE READER FOUND: a slot keyed by its position index that drifts is retired and re-registered at today's
reading, so a rise is written as a retirement and an addition: 599 of 788 additions are a retired slot one index on, 29 of
them HIGHER (the largest: village, both PDFs, "No granary: under siege...", 0.58 to 0.77). RULED, "SAMENESS-KEYS": on a
re-take, an added slot that matches a retired one by surface, size and sentence INHERITS the retired ceiling, so a rise is a
rise and the door itself says so; the register is re-taken ONCE, at point 119's join, by that door; what it then refuses is
named for E13c and raised by nobody. This makes the door stricter, which is the chair's to order.

**G53 (09:31 UTC on 2026-11-26): THE CURES OF RULINGS 4 AND 5 ACCEPTED; THE SHORT SECOND READ (`landing/118/SECOND-READER-CURES-118-B.txt`) RULED.**
The builder at d0dc0eddb0: (H) against the join on C, V and soak 0 to 999: 184 summaries by the one word, 25 from line 4 or 5
to line 1 (a marked need, nothing arriving), 9 re-drawn (no marked need, something arriving), other 0; cure (6): 82 places, the
two pages' Defense lines differing 0, shared pages losing the fact 0, `publicProseEquality` 428 of 428; cures (7) (r2r-hamlet-33
to r2r-hamlet-42), (8), (9) (three named thorps); the four once-red files green; lint at its three base reds. THE READER'S SIX:
(1) NEW, AND THE CHAIR'S RULING MADE IT: cure (6) trims an owner's OWN line on a shared page, because the edit marks are not
served (`publicSafe.js`; they stay unserved: the projection is not widened to cure a page). RULED (6b): the function trims only
THE ENGINE'S OWN SENTENCE, recognised whole by its text (two forms, one home shared with the generator), with no `isEdited`
and no knowledge of the page: owner and visitor run the same text through the same test. Its failures are benign in both
directions: a form it misses prints whole on both pages; an owner who typed the engine's exact sentence is trimmed on both.
(2) LINE 4 ("buys in what it cannot make for itself", new in this point) prints beside "Needed, and not brought in: timber,
metals.": RULED (K): "buys in SOME OF what it cannot make for itself" (the sentence, not the gate; the chair's wording, the
owner's to veto). (3) and (6), OLDER THAN THIS POINT: the food gate reads a rounded share while the food row prints pounds
("Nothing X needs has to come from outside" beside "+ 1 imported"; "feeds itself" beside the import "Bulk grain"); "pays its way"
on an indebted place beside "owes an outside power more than it can ever repay"; and E2b. ALL OF THEM ARE ONE UNIT OF POINT 119,
"VIABILITY-TRUE": every line of the viability slot and both fallbacks held to its claim against what the same page prints (the
food row's pounds, the arriving list with its foodstuffs, the "needed, and not brought in" list, the debt line), measure first,
the reader's cases red first; where a gate cannot equal the claim, the sentence changes. (4) THE VEIL LANE's (A17, written
down, the lane paused): `defenseDisplay.js` about line 968 re-reads facts the default veil removes, so the owner's line and
the shared line differ on 10 of 600 places (r4b-hamlet-91). (5) the comment's claim about the Overview corrected in (6b).

**G54 (10:21 UTC on 2026-11-26): THE MERGED TREE OF POINT 118 GATED; ONE NEW RED, OF CURE (3), RULED; A FAULT THE CHAIR FOUND BY READING A TOWN COLD.**
The helper merged the cures (d0dc0eddb0) into the landing tree at 75f1f4742c without conflict; typechecks 167/167 and 1113/1113,
packets 257; NO DOOR MOVED (the home page's town byte-identical to 55bbd338a3; the page census grid 0 falls, nothing rose; the
wiring census, the observed-shape baseline and the lighting census unchanged); the four once-red files green (442 tests);
tests/lint 3 failed, all on the list; tests/copy 175 of 175; tests/build 13 failed, all on the list; the named set (244 files,
3,557 tests) 10 failed, 9 on the list, ONE NEW: `tests/domain/dailyLifeFoodResentments.test.js` pins an earlier chair's line A4
with no exclusion, and cure (3) gave it one. RULED (L): the pin for A4 alone expects `['food: = pressured']` (G45 (8)); the form
of the test is not weakened. THE FIVE SIZES with E1 out: first paint 1,190,929 raw (+8,035 on point 117), 379,787 gzip
(+3,055), 318,825 Brotli (+2,221); the worker 2,739,058 (+16,764); the engine chunk 937,249 (+3,036): all over budget as at
point 117, re-recorded by nobody, the owner's to sign.
WRITTEN DOWN, FOUND BY THE CHAIR READING ONE FRESH TOWN COLD FOR THE OWNER (seed owner-fresh-1, a town, Xinling, under a
disease outbreak; `$S/owner/fresh/town.txt`): "QUARANTINE-ONE-WAY": the Defense tab says "Nobody comes into Xinling and nobody
leaves." while the Overview says "Fewer buyers come to Xinling each week for fear of the sickness, and fewer sellers.", the
crisis text says the quarantine "is not being enforced consistently", the viability line says "the food comes in by sea" and a
hook has a boat come in. One page, two readings of the same quarantine. A unit after point 119's seven: measure first (how
many outbreak places print both), then the sentence that claims a sealed town changes or is gated on a fact that says sealed.
ALSO SEEN AND NOT RULED (the owner's taste, said to him): labels where a reader expects names ("Feudal Appointee",
"Religious Authorities", "The Siege", "The Arcane Incident"); thirty hooks in one shape in a row; an exports list with
near-twins ("River craft", "Cargo barges", "River barges").

**G55 (10:25 UTC on 2026-11-26): QUARANTINE-ONE-WAY WITHDRAWN; THE EXPORT LIST IS NOT A FAULT.** The owner, of the chair's cold read of
Xinling: "I don't necessarily see too much of a discrepancy here, it's semantics in nature in my view" and "aren't these the
different kinds of barges". RE-DERIVED, AND HE IS RIGHT ON BOTH. (1) "Nobody comes into Xinling and nobody leaves." is the
quarantine's rule, printed under "Military status: Quarantine active"; the sentence beside it says "some families shut
themselves in and some carry on as before", and the page says three more times that the rule leaks ("not everyone obeys",
"resisted", "not being enforced consistently"). One story: a quarantine declared and leaking. NOT a contradiction; no unit.
(2) The exports are two yards' goods: the boatyard's ('River craft', 'Cargo barges': `supplyChainData.js:365`) and the
shipyard's ('Ocean-going vessels', 'River barges': `:437`). Different kinds, truly listed. The one pair that says one thing
twice is 'Ship construction' (the shipyard's service: "Build ocean-going vessels from keel up") beside 'Ocean-going vessels':
said to the owner once, his call, no unit.

**G56 (10:33 UTC on 2026-11-26): (6b) AND (K) ACCEPTED FOR POINT 118 ON THE SAME READER'S FOLLOW-UP; ITS FOUR RULED.** The claims
hold: one Defense line on the owner's page, a default share, a party link and DM-full, for the edited cases too; births
byte-equal (600, 352 carrying a sentence); every sentence today's engine writes is recognised (270, 0 missed); line 4 says
"some of". ITS FOUR: (1) a save from before 2026-11-09 carries the sentence's OLDER wording ("which faction controls a
district") and prints it whole on every page: the benign direction G53 named (the same on both pages; what live prints today);
THE OLDER FORM JOINS THE LEAF in point 119, with D13's measure of master-born records, not here. (2) THE VEIL LANE's, A17
WIDENED: `defenseDisplay.js` about line 968 re-derives the public-order line on a share and so does not show an owner's own
edited line there (the edit marks are unserved): older than this point; the lane is paused; written down. (3) an owner's line
that KEEPS the engine's sentence and adds to it is trimmed on the owner's own page too: accepted (the same on every page; the
fact stands in the identity line), named. (4) the universal "buys in what it cannot make" survives in two older homes (the
fallback twin, `dossierViewModel.js:326`: 36 of 39 prints beside "Needed, and not brought in"; `general.generated.js:12021`):
VIABILITY-TRUE's, added to its brief.

**G57 (10:38 UTC on 2026-11-26): (6b)'S LEAF BROKE TWO SHRINK-ONLY DOORS; RESHAPED AS (6c); NOTHING RE-BANKED.** The builder stopped,
rightly: `presumedThings` and `presumptionClasses` bank the two "No stable governing authority" sentences BY THEIR FILE;
moving them to a new leaf leaves one banked row stale and two hits fresh, and their doors never bank a literal that was not in
its file at the base. THE FAULT IS THE CHAIR'S RULING ("one home shared with the generator", ordered without asking what banks
those sentences). RULED (RULING-CURE-118-7): the generator keeps its own literals (`safetyProfile.js` byte-equal to
d0dc0eddb0; the leaf deleted); the display function recognises the two sentences WHOLE by two patterns where the base held one
loose pattern; a test ties the two spellings together by bearing places that carry each sentence; proof of sameness with (6b)
(which the chair and the second reader read): the printed Defense line differing 0 over C, V, the soak and the edited cases.
NO SECOND READ OF (6c): its behaviour is (6b)'s by that proof, a mechanical equality stronger than a re-read; the chair reads
its diff. (K) 211 summaries, all by the two words, elsewhere 0; (L) A4 alone pinned to its one exclusion, 16 of 16: ACCEPTED.

**G58 (11:05 UTC on 2026-11-26): THE CHAIR'S "WHO IS IN CHARGE: PARTLY" WAS ITS OWN PRINT'S FAULT; CORRECTED TO THE OWNER.** The owner:
"shouldn't there be a person in the office unless specifically called against?" MEASURED on five fresh births (a thorp, a
hamlet, a village, a town, a city; `$S/owner/fresh/who.txt`): EVERY ONE HAS A NAMED HOLDER OF THE SEAT, printed on the Power
tab ("The seat: Shufen Zhang, the lord's appointee"; "Komnenou Gabalas, the head shepherd and Elder"; "Bashir al-Malik, the
senior guild master and Lord Mayor") and, for the DM, the ruling two or three in "Who really runs this town". The chair's cold
read had printed the Power tab without its record (a fault of the chair's script), saw only the Overview's "Governed by Feudal
Appointee" and said "the office, not the person". WRITTEN DOWN, SMALL, MEASURE FIRST ("OVERVIEW-NAMES-THE-SEAT"): the
Overview's "Governed by" line names the power and its stability and not the holder, who is one tab away; whether the first
screen should carry the name (not where the seat is empty, and never a veiled face on a player view or a share).

**G59 (11:22 UTC on 2026-11-26): (6c) ACCEPTED; THE CURES' BRANCH IS WHOLE AT bd5ad2da0c.** `safetyProfile.js` byte-equal to
d0dc0eddb0, the leaf deleted; two whole-sentence patterns in `guardLineUnderTheLaw.js`, no `isEdited`, no page; the tying test
bears three places of each sentence; against (6b)'s function 4,444 printed Defense lines compared (C, V, soak 0 to 419, the two
edited cases; owner's page and shared page): differing 0; no walker objected; tests/lint at its three base reds; typechecks at
their ceilings; tests/copy 175 of 175; `publicProseEquality` 428 of 428. Read by the chair. `landing/RULING-118-3.txt` (amended
to name it) SENT to the helper: the last merge, the gate, the push of `lane/stack-118-wip-2026-11-26`.

**G60 (12:21 UTC on 2026-11-26): B1(i)c RULED ON CLOSE-10's MEASURE: THE FURRIER'S DISTRICT LIVES ON FURS, AND FURS REACH A DESERT PLACE BY ITS OWN GROUNDS OR BY AN ENTREPOT.**
The measure (the line 9d22f040e4; V re-born; C has no desert): imports are decided AFTER the houses (assembleInstitutions, the
cascade, then generateEconomy), so the draw cannot read them; and the "northern furs entrepot" the second reader saw on three
places IS THE DISTRICT'S OWN CHAIN (withhold the district and the chain vanishes: circular), while their "raw hides" import is
the tanner's livestock chain. What the draw holds: the route, the terrain, the native resources with their depletion, the
neighbour. V's desert districts, 15: own grounds (spent) 2; a crossroads, where the desert's entrepot flag is the route alone
(`tradeGoods.js :: deriveIsEntrepot`) 3; a road with no grounds 10. RULED (the seat's P1, with one change): `livesOn: 'furs'`
on the Furrier's district; the desert withholds furs; furs are given by `hunting_grounds` (spent or not: a spent ground's
import "Game and hides" follows from the key) or by A ROUTE THAT MAKES THE PLACE AN ENTREPOT: THE GIVER'S ROUTES ARE READ FROM
`deriveIsEntrepot`'s OWN HOME, NOT TYPED AGAIN AS 'crossroads', so the rule and the chain that prints "entrepot" cannot part
(if a port is an entrepot there, a port gives furs). Data and one read, no runtime rule beside it. The Hunter's lodge keeps
'game'. RESIDUAL, ACCEPTED AND NAMED: three road cities that buy the tanner's raw hides lose the district (livestock hides
are not furs, and they are bought after the draw). NOT TAKEN: reading imports at the draw. The instrument B1land skips a
user-forced row. Proofs as G52 gives them; `siteCoherenceRatchet` C1 re-read and named if it moves.

**G61 (13:22 UTC on 2026-11-26): VIABILITY-TRUE RULED ON CLOSE-10's MEASURE.** The measure (the line 9d22f040e4; C and V thorp,
hamlet, village, 450 each; the oracle the page's own leaves: the food row's pounds, the printed arriving list, "Needed, and
not brought in", the debt line): prints false by the page: L1 ("feeds itself and pays its own way") C 5 of 128, V 4 of 81
(a debt line 4, food arriving 5); L4 C 6 of 114 (debt 4, food 2); L5 C 5 of 104, V 2 of 45 (debt 3, food 4); THE FALLBACK
TWIN A ("...buying in what its own land and trades do not provide.") C 17 OF 17, V 52 OF 67 (beside "Needed, and not brought
in" 69; nothing arriving 3); the general pool's "buys in what it cannot make" C 6 of 6, V 9 of 10; L2, L3, twin B and the
strained line 0. Self-sufficient places whose food row prints imported pounds while the rounded share reads 0: C 2, V 16.
RULED, the seat's proposals with two additions: (1) THE GATES READ WHAT THE PAGE PRINTS: `buysFood` is the food row's printed
imported pounds above 0, or a foodstuff on the printed arriving list (BY AN EXISTING HOME that says a trade good is food; if
there is none, the gate is the food row alone and the seat says what that leaves); `buysIn` is printed pounds above 0 or a
non-empty printed arriving list; `paysItsWay` is false where the page prints its debt line. ADDITION (a): L2 SAYS "OWES NO
ONE": it too refuses where the debt line prints (its count was 0 by luck, not by its gate). (2) THE SENTENCES, where no gate
can carry a universal: twin A reads "...buying in SOME OF what its own land and trades do not provide."; the general pool's
line reads "{settlement} buys in some of what it cannot make, and the trading keeps as many people busy as the making
would." (written in the content document and projected). (3) G56's older safety sentence as a third whole-sentence pattern.
ADDITION (b), THE PROOF: after the build, PER LINE, prints false by the page's own leaves: 0, on C and V small places AND on
soak 0 to 999 at every tier; and the count of places whose printed line was TRUE before and moves anyway (their admitted set
shrank): named, for D13 (this slot is E13a's intended exception). All view time; no record moves.

**G62 (13:41 UTC on 2026-11-26): D13's MEASURE AGAINST MASTER, AND ITS BAR CHANGED: FORWARD STABILITY, NOT "WHAT MASTER PRINTED".**
CLOSE-10's measure: 360 V keys (60 a tier) born on an archive of master db832c8926, round-tripped as a save, read by the
line's `normalizeSettlement` and viewed by the line; beside master's own view of the same records. (a) FACT ATOMS A
MASTER-BORN RECORD LACKS: 0 (all 67 atoms the Daily Life pools and the state-prose marks use are answered as on a line-born
record; master already carries the food record; the second reader's 79 "Secure" refusals are a record with NO food record at
all: an older save than master's shape, whose existence in production nobody here can know). (b) PRINTED FLAVOUR LINES THAT
DIFFER, MASTER TO LINE: Daily Life 2,852 of 2,880 (re-deals 211; refused by the line's own declared needs 635; GONE, nothing
on the line to print again, 1,506); the viability summary 360 of 360 (master printed one fixed sentence a verdict; E13a);
state prose, another variant of the same pool 987 (re-deals 439; 548 unmatched, unproven), AND 5,595 slots printing the SAME
variant in new wording. SO: A SAVED TOWN READ ON THIS RELEASE IS RE-WORDED NEARLY EVERYWHERE, BY THE REBUILT WORDING ITSELF
(the declared pools, months of units), NOT BY A RE-DEAL; WHAT IS STORED AT BIRTH (the people, the houses, the powers, the
history, the numbers) DOES NOT MOVE (the guard, point 117). THE CHAIR TOLD THE OWNER "a one-time reshuffle of saved towns'
Daily Life lines": THAT UNDERSTATED IT, corrected to him. D13's BAR OF G49 ("prints what it printed on master") IS WITHDRAWN:
it can hold for about 650 lines of 360 towns. THE NEW BAR: FORWARD STABILITY: from the released tip, a later change to a pool
moves the printed line only for the towns that drew the changed line. The seat designs to that (five points put to it: the
pick; the sites it covers; whether the switch can be taken in the same release so saved towns change once; storing picks at
save, proposed only, a persisted shape being the owner's; the save with no food record).

**G63 (13:43 UTC on 2026-11-26): D13's DESIGN (A) ACCEPTED IN PRINCIPLE AS POINT 120's ONE UNIT; NOT BUILT IN POINT 119.** The seat's
design (its message crossed the chair's change of bar and reached the same crux): STABLE-PICKS BY RENDEZVOUS: at the view-time
slots a town page prints from (`dailyLife.js :: pickNameable`, eleven sites; `dossierViewModel.js :: pickAdmitted` and
`pickTrue`; `stateProseKernel.js :: resolveDeclaredPosition`'s drawn index) the pick is the ADMITTED line with the highest
hash of the slot's key and THE LINE'S OWN ID. A pool edit then moves only a town whose drawn line was refused or removed, or
one for which an added line hashes highest (about 1 in n+1); no law stamp (a production save is re-worded by this release
anyway, G62, so the switch costs it nothing more: SAVED TOWNS CHANGE ONCE). Option (B) (a `since` stamp on lines added later,
so an addition never steals) NOT TAKEN now. RULED: ACCEPTED, WITH FOUR CONDITIONS, AND AS ITS OWN POINT: (1) AN ID THAT NEVER
MOVES: the design stands on line ids, and the measure itself found 548 state-prose lines it could not match by `vid` (a pool
renumbered?): a line's id is APPEND-ONLY in its pool (never renumbered, never reused; a removed line's id is retired), held by
a walker with its own baseline; where a pool has no ids today, they are written once. (2) ITS COST IS MEASURED BEFORE IT IS
BUILT: the switch re-deals every line-born page, so every test that pins "this seed prints this line" goes stale: a scratch
build, never committed, and the count of reds by file across `tests/domain`, `tests/components`, `tests/generators`,
`tests/lint`, `tests/copy`: the chair rules on that count. (3) ITS PROOF as the seat states it (the 360 master-born records;
a planted removal of an undrawn line moves 0; a planted removal of a drawn line moves exactly its drawers; a planted addition
moves exactly the towns it out-hashes), AND records moved 0 on C and V, AND the page lines that move are in the three slot
families and nowhere else. (4) THE OTHER VIEW-TIME `% length` SITES (77 by its census): each named as on a town page or
outside the line (advance time, the simulator, the map, admin), with the town-page ones counted, not left as one number.
ORDER: point 119 is finished first (units 1 to 4b, B1(ii)'s design); D13 is POINT 120, alone, so its churn is read alone.

**G64 (13:52 UTC on 2026-11-26): B1(ii)'s REDESIGN RULED: THE DRAW AS BEFORE, THE RULE AFTER; FARMLAND ADMITS; NO NEW STORED FIELD.**
CLOSE-10's design (`traditions/genesis.js :: deriveFoundingTraditions`; the `field` element is met only in the addition loop):
each addition row draws its element and act exactly as today on its own forks; if the drawn element is `field` and the rule
refuses it, the row takes the next attempt's draw (the forks the motif reroll already uses), up to ten; no weight changes, so
no other row's DRAW moves; one side path to be measured (the replaced row's name and motif enter the used sets and can shift a
later row's reroll in the same town). THE PREDICATE: the place's own food record names its sources and grain is not among
them (fixed keys off native resources, never a user's good by name); an empty list is unanswered and the rite stands. RULED:
(1) THE DESIGN IS ACCEPTED. (2) FARMLAND ON THE ROSTER ADMITS THE RITE (fields exist): about C 29 and V 35 places are then
refused. (3) IF TEN ATTEMPTS ALL DRAW A REFUSED RITE, THE ROW KEEPS ITS FIRST DRAW (a row is never dropped): the count of
such rows reported, expected 0. (4) THE STAMP: NEITHER OF THE SEAT'S TWO IS TAKEN: no sixth law row and no engine bump: A
STORED FIELD IS NOT ADDED FOR THIS. The rule is asked only of a record THIS ENGINE BORE, by the stamp the guard of point 117
already reads (`GENERATOR_VERSION` against `LEGACY_GENERATOR_VERSION`): every production save is master-born (legacy or
stampless) and keeps its whole set; a record born on the working line before this rule carries the same stamp as a new
birth and gets the rule, and that is accepted BECAUSE SUCH A RECORD BELONGS TO NO USER (the line has never been released).
What this leaves for later, named: a rule added AFTER the release will need a way to tell release-born from later-born (D13's
option (B), or a law row): the owner's, when it comes. (5) THE PROOF as the seat states it, with: master-born records (the
360 of its D13 measure) shown sets byte-equal, 0 moved; the name and motif shifts counted and each a later row of the SAME
town; every birth of C and V: no field rite shown where the predicate holds and no farmland stands.

**G65 (14:04 UTC on 2026-11-26): D13's THREE OWED ANSWERS RULED.** (1) A STATE-PROSE `vid` IS A POSITION: the line's number in the
content document's numbered list; an insertion mid-list renumbers every later line. So point 120's first work is IDS MADE
APPEND-ONLY AT THE DOCUMENT (G63 (1)), before any pick stands on them. (iv) STORING A TOWN'S PICKS AT SAVE (the seat's
proposal, as asked: about 32 picks a town, 0.3 to 0.5 KB): beyond stable picks it would fix ONLY the steal by an added line
(about 1 in n+1); it would NOT help any production save (master-born, no stored picks), a refused or removed line (it must
fall back), or a reworded line; and it costs a persisted shape (a migration; the share and party projections must carry or
veil it; export and import). THE CHAIR'S RECOMMENDATION TO THE OWNER, WHOSE DECISION IT IS: NO. Nothing is built for it.
(v) A SAVE WITH NO FOOD RECORD AT ALL (360 line-born towns with the record stripped): the page prints NO food word (360 of
360); the food atoms are unanswered; the fare moves on 294. The seat proposed that an `excludes` atom of the food dimension
admit where the record has no food record. NOT TAKEN: the door stays fail-closed without exception. Why: no one can show such
a save exists in production; every production save is re-worded by this release anyway (G62), so this is not a re-deal to
prevent; such a town still draws among the lines that carry no mark; and an exception inside `declarationAdmits` is a cost
carried by every later reader of that door for a case that may be empty. Written down; reopened if such a save is shown.

**G66 (14:05 UTC on 2026-11-26): G65 (1) CORRECTED BY THE SEAT, AND A NOTE ON G61.** A STATE-PROSE `vid` IS NOT RENUMBERED BY AN
INSERTION: the generator's own numbering guard (FR7, `scripts/generate-dossier-state-prose.mjs`) already holds it
append-only (a new line takes the next number; nothing is renumbered or reused; words change in place only through a
`WORD_CORRECTIONS` row with a ruling). The 548 lines the D13 measure could not match by `vid` were its walker's miss. SO
G63's condition (1) IS ALREADY MET FOR STATE PROSE; the Daily Life ids and the viability lines need the same hold. THE CHAIR
REPEATED THE SEAT'S FIRST ANSWER TO THE OWNER ("numbers shift on insertion"): corrected to him. ON G61: the existing home that
says a trade good is food is `domain/region/goodsCatalog.js :: normalizeGood` (category 'food'); it counts Salt and "Raw hides
and animal products" as food, so those arrivals also refuse "feeds itself": accepted (the refusal drops a claim and the place
prints the buying-in line, which is true of it); counted separately in the proof.

**G67 (15:50 UTC on 2026-11-26): THE SECOND READER ON B1(i)c AND E13d-2 WITH SAMENESS-KEYS (`landing/119/SECOND-READER-119-B.txt`), RULED.**
B1(i)c (19a5855f3) IS SOUND BUT FOR ONE GIVER, AND THE CHAIR'S OWN G60 SAID IT: "if a port is an entrepot there, a port gives
furs". The seat ruled a port out (a port is an entrepot only by houses the draw does not yet know); the reader measured that
ALL 94 desert port cities and metropolises print as entrepots, and 65 of 80 that held the district at the line lose it.
RULED, "B1(i)c-2": the PORT route gives furs (furs come by sea: `LAND_GIVERS.furs.routes: ['port']` beside the entrepot
route). The residual, named: a desert port city without the two houses that make a port an entrepot would keep the district
(0 of 94 measured). Everything else of A holds: `deriveIsEntrepot` unchanged over 928 cases; none standing with no giver
(0 of 343); none wrongly withheld (0 of 217); a forced one stands; nothing on a page presumes it; no hook is lost (a card
fewer where the master furrier is not minted); non-desert births unmoved. ADVANCE TIME (outside the line, written down): the
time-advance gap list can name the district once its tannery stands, and asks no land.
SAMENESS-KEYS (354d27d85) COMES OUT OF POINT 119: ITS DESIGN CANNOT BE MADE RIGHT ON A REGISTER KEYED BY POSITION. Three
confirmed ways `inheritances` hides a rise (an heir needs the row's one stored sentence to be today's commonest at that
size, and 620 of 642 rows span sizes; like siblings re-use keys so nothing retires; an earlier retirement is consumed again)
and one false refusal no door can clear (key order crossing at 9 to 10). By the chair's own rule a unit whose fault is its
design is not patched three times. WHAT STANDS INSTEAD: (i) THE REGISTER IS NOT RE-TAKEN AT POINT 119 (a re-take is where a
drifted rise is laundered: none is made, so none is laundered); (ii) the hole is written on the pre-release list as "E13e:
the sameness door keyed by what it measures" (surface, size and sentence, not a position), built with E13c's rest; (iii)
until then any re-take is preceded by the reader's own report: additions matched to retirements by surface, size and
sentence, the higher ones named. E13d (the skip, G35) STAYS, with one cure: a title printed behind a bullet ("· the senior
charter master", PDF OtherNameRow.1, 10 of 60 towns) is still counted: the door's cut drops a leading bullet before it
matches. E13d-2's GUARD IS ACCEPTED AS WHAT IT IS, AND SAYS SO: it catches a skipped string written as a verbatim literal,
any shape of pool; it does NOT see a string built by concatenation, an interpolated template, a spread array, a key, wrapped
JSX text (ten planted cases passed it): its header names those limits, so nobody reads it as a proof. Today's truth is
measured, not guarded: every skipped print in 60 rendered towns sits at a caption position or a PDF role cell, and no skipped
string occurs outside its homes in 210,926 literals.

**G68 (16:59 UTC on 2026-11-26): THE SECOND READER ON VIABILITY-TRUE AND P9b (`landing/119/SECOND-READER-119-C.txt`), RULED; CLOSE-11's MARK RAISED.**
VIABILITY-TRUE (7279e571c): 1,707 of 1,720 rendered pages true; PDF and Foundry print the same sentence on all 1,720; the
correction row sound; the older safety sentence exact. ITS HOLES: (1) THE DEBT GATE AND ITS ORACLE READ THE SAME FIELD AND
BOTH MISSED A SECOND PRINTER: the Overview prints a debt sentence from the tension `outside_debt` with no `indebted`
stress (13 of 1,720 pages; the seat's "0 false" was true of its oracle, not of the page): cure V1: the gate reads every home
that prints a debt sentence, and THE ORACLE READS THE RENDERED PAGE. (3) A record with no food record (THE SHAPE WRITTEN
BEFORE 2026-11-03: so such saves may well exist in production, which G65 (v) said nobody could show): the Economics tab
falls back and still prints imported pounds while the gate reads 0: cure V2: the gate reads the tab's own value by the tab's
own path. G65 (v) IS REOPENED AS A MEASURE in point 120: a record of the pre-2026-11-03 shape, every line its page prints
false by its own page. (2) THE SHARE LANE's, A18, written down (paused): the shared page prints the viability summary STORED
at the owner's last save, and `PUBLIC_PROSE_VERSION` ('pp-1'; the stored prose is new in this pull request and is not on
master, so no production page is stale today) is bumped by no wording unit: the rule "a release that changes a stored
desk's wording bumps the version" is the lane's to set. NAMED: `isFoodSourceGood` misses "Preserved provisions" and "Game
and hides" (no false print in 4,970 births).
P9b (12c77ae3f): 0 of 9,680 surface texts differ over 440 places; the five values agree. ITS HOLES: (4) a SIXTH mean in the
unmounted `SummaryTab.jsx` still averages stored scores and bands Critical where the others band Weak: cure P1; (5) a
non-numeric stored score is turned into a number, so a null mean becomes 40 and a silent headline prints: cure P2.
`landing/RULING-119-CURES-1.txt` SENT to CLOSE-11.
THE SEATS' MARK: CLOSE-11 stood at 384,390 used tokens 43 minutes after seating, most of it the seating; a mark of 400,000
ends a seat before its work, and each new seat pays that seating again (about 10 to 12 in cost). THE MARK IS 650,000 (the
automatic summary comes at 784,000), a turn ended every hour so the chair can read it; the next start file is trimmed by
what CLOSE-11 reports its dearest reading to have been.

**G69 (17:05 UTC on 2026-11-26): C4-SECOND-LINE's GATE: THIRTEEN NEW REDS FROM ONE ADDED VARIANT, RULED BY KIND.** CLOSE-11 gated
CLOSE-10's 3647bae53 (the generator's check 0; typechecks at their ceilings): 20 failing rows, 7 on the line's list, 13 new.
(a) COUNT PINS IN TESTS that state the corpus's own figure (3,182 variants and the like, now one more): re-pointed in one
commit, each named with its old and new figure. (b) COMMITTED DATA with its own door (the wiring census; the observed-shape
baseline): re-taken by those doors, each its own commit. (c) THE SHIFT REGISTER (`dossierStateProseProjection` SEAM car 4:
five pins: the variant count's sum, a per-pool hash, the face counts' sum and hash, the vids' hash) IS OWNER-GATED BY ITS OWN
WORDS ("owner-gated per batch landing"; "one owner re-record"): ITS ROWS ARE EDITED BY NOBODY: the five pins stay red, each
named with its recorded and its present value, and the rows as they would read are PREPARED in a note for his signing. They
join `ci/RED-AT-LINE.tsv` at point 119's landing as the owner's. (d) `proseComposed` A0b gains a second failing assertion
(an over-claim of 20 against a shrink-only ceiling of 19): expected to clear with the wiring census's re-take; if it does
not, the seat stops: the ceiling is raised by nobody.

**G70 (18:35 UTC on 2026-11-26): C4-SECOND-LINE's SENTENCE CHANGES AGAIN, BEFORE IT HAS LANDED: NO CEILING IS RAISED FOR IT.** After
the wiring census's re-take `proseComposed` A0b still read over-claims 20 against its shrink-only ceiling 19: the walker
reads an `{access}` slot as a claim on a reading the pool does not declare (the same artifact that already holds four of
the nineteen: C3 v3, C4 v1, v3, v6), and the chair's line 8 carried the slot. The seat stopped and put three ways. RULED:
NOT an owed count raised (a ceiling raised is nobody's here); NOT the breach left inside a row that is already red; THE
SENTENCE WITHOUT THE SLOT: "{settlement} is poor, and being easy to reach has not changed that." (C4 is "a low rung on a
working approach": every C4 place is easy to reach, as C5's are not; the chair's wording, the owner's to veto; G49's wording
withdrawn). Changed on the unit's branch (the line has printed on no page). The walker's own cure of the slot artifact (so
the four standing over-claims can leave) is written down for E13c's rest.

**G71 (18:39 UTC on 2026-11-26): B1(ii) BUILT BY THE LOCAL BUILDER IN 32 MINUTES; ACCEPTED BUT FOR ONE CURE.** B1II-119 (tree
/home/user/wt/b1ii, local branch `lane/stack-119-b1ii-wip-2026-11-26`, tip dd583bbf7e on 9d22f040e4; read whole by the
chair): `genesis.js :: fieldRiteRefused` (the food record names its sources, none grain; the atom `institution: farmland`
answers false; an unanswered list or atom lets the rite stand) asked only of a record `settlement.schema.js ::
bornByThisEngine` (a reader of the existing stamp in the stamp's own home; no stored field, no version moved; `editSlice.js`
keeps its own line because its guard test mocks the constant); a refused row takes the next attempt's draw on the motif
reroll's own forks, ten further attempts, else its first draw; the census row B1furrow. ITS PROOF: field rites shown where
refused C 29 to 0, V 35 to 0; places differing C 29, V 35 (33 and 39 rows), unexplained 0; RECORDS MOVED 0 of 1,800; the 360
master-born records 0 moved (17 keep a false field rite, as ruled); fallback rows 0; shifts: name 0, motif C 1 row, V 3 rows,
each a later row of the same town. RULED ON ITS TWO FINDINGS: (1) THE REPLACEMENT DRAW CAN REPEAT A MOTIF THE TOWN ALREADY
HOLDS (C 2 towns, V 2; the base 0): A FAULT, CURED: the walk takes the first attempt both admitted and of an unused motif
(the base reroll's own test), else the first admitted, else the first draw. (2) A MILL IS NOT A FIELD: grain among the named
sources or farmland admits, nothing else (three V places change, rightly). The lighting census is re-taken by its door at the
join (the builder's own check refused its way of making its tree clean: the refusal stands). THE METHOD: this unit cost one
local builder 245,000 tokens from a two-page brief; a seat pays more than that to be seated.

**G72 (21:41 UTC on 2026-11-26): THE SECOND READER ON POINT 119'S SIX UNITS (report: `landing/119/SECOND-READER-119-D.txt`;
evidence in its scratch `reader7/run`): SIX FINDINGS, ALL CONFIRMED BY RENDERED PAGES; FIVE CURED BEFORE THE LINE MOVES, ONE
WRITTEN DOWN FOR A MEASURE.** Its table of the viability lines over 2,800 places (printed/false): L1 224/1, L2 14/0, L3
21/0, L4 170/0, L5 179/1, twin A 344/0, twin B 37/0, strained 42/5, general 67/0; with the food record removed, 300
places, 0 false. The furs cure, the sameness guard's skip and the Defense tile's mean all read as cured.

(1) **B1(ii)'s RULE HOLDS ONLY WHILE THE STAMP EQUALS THIS BUILD'S CONSTANT: A FAULT OF THE CHAIR'S OWN RULING (G64 (3)),
CURED.** `bornByThisEngine` compares the stamp with `GENERATOR_VERSION` for equality; the release test forces a new constant
the next time births move; on that day every place born at 0.10.0 without fields is read without the rule and its replaced
rite comes back ("The Great Stars Fair" is "The Great Furrow Fair" again): exactly the re-deal of a saved town the stamp was
read to prevent, one release later. THE CURE: the rule is asked of a record whose stamp is AT OR AFTER THE ENGINE THAT FIRST
CARRIED THE RULE, a literal in the rule's own file (`FIELD_RITE_SINCE = '0.10.0'`), never the build's constant: a reader in
`settlement.schema.js` that compares two three-number stamps and answers false for anything else (no stamp, the legacy
stamp, a malformed one). Master's births are stamped 0.9.0 (read on db832c8926), so no live-site record meets the floor.
`bornByThisEngine` goes if nothing else reads it. No stored field, no version moved.

(2) **A THIRD HOME PRINTS DEBT: THE SENTENCE CHANGES, NOT THE GATE (G50).** The Power tab's merchant-league line "The people
who run {settlement} are also the people it owes money to, and they do not keep the two apart." carries NO mark: it is
dealt to any merchant-league place, and it states a debt no fact of the record holds (beside "keeps order and pays its
way": soak1k-87, soak1k-124, C dp-town-93; and beside any prosperity). The viability gate cannot be made to read a claim
no fact stands behind. THE SENTENCE BECOMES: "The people who run {settlement} are also the people who trade in it, and
they do not keep the two apart." Same id (vid 2), same slots, no mark added, so no pick moves. Vetoable by the owner. The
builder lists every other unmarked state-prose sentence that says the PLACE owes, and cures none of them without a ruling.

(3) **A STORED MONSTER SCORE THAT IS NOT A NUMBER PRINTS "CRITICAL" ON THE OVERVIEW BESIDE "ADEQUATE" ON THE DEFENSE TAB
(settled country only): NOT CURED AT 119; P9c, MEASURED AT POINT 120.** The case is hand-made: no birth of this engine or of
master's writes a monster score that is not a number. Whether any SAVED shape does is the OLD-SAVE measure's own question
(G68). If one does, the cure is at the leaf (a score that is not a number prints no bar and no grade anywhere); if none
does, the item closes with that count. P9b is not opened a third time on a case nobody has shown to exist.

(4) **THE FIELD RULE READ ONLY THE FOOD RECORD, AND THE PAGE PRINTS GRAIN THE RECORD DOES NOT NAME: CURED BY READING THE
PAGE (G61's rule).** r7d-city-24 (desert, date palms, sources ["fish"]) prints Exports "Desert grain" and Produced locally
"grain", and lost "The Procession of the Fields"; 4 of 330. THE CURE: the rite stands wherever the page's own Produced
locally or Exports list prints a grain good (the whole word; flour does not count: a mill is not a field, G71), read
through the leaf that prints those lists; if the layering lint refuses that import from `traditions/`, the builder STOPS.

(5) **"BEING EASY TO REACH" BESIDE "THE ROADS ARE DANGEROUS" (8 of the 119 pages printing C4's line): THE SENTENCE
CHANGES.** The gate knows a working trade route, not a safe road. The line becomes: "{settlement} is poor, and being well
placed for trade has not changed that." Same id, no slot added (the walker's count of over-claims stays 19), no pick moves.
Vetoable by the owner; it replaces G70's wording in his list.

(6) **"FEEDS ITSELF" BESIDE AN ARRIVING "PRESERVED PROVISIONS" (two towns): CURED IN THE WORD LIST.** VIABILITY-TRUE-2's
measured "none neither" was taken on the small tiers and fails in towns. `isFoodSourceGood` also answers yes to the whole
words `provisions` and `game` (a list of its own beside `FAILED_GOODS`, which stays as it is: the famine's marks read it).
Proof: the reader's table again, L1 and L5 false 0.

BY WHOM: one local builder (CURE-119, `/home/user/wt/cure119`, branch `lane/stack-119-cures-wip-2026-11-26` cut at the
helper's tip ef10a71f3a, never pushed by the builder), one commit a cure; then the same reader on the cures.

**G73 (21:49 UTC on 2026-11-26): THE READER'S THREE ANSWERS (appended to `landing/119/SECOND-READER-119-D.txt`).** (A) THE
FIVE FALSE PRINTS OF THE STRAINED LINE ARE FINDING 2's, COUNTED ONCE: each "keeps order and pays its way, but it has to buy
food…" beside the merchant-league debt sentence, nothing else on the page denying it: G72 (2)'s sentence change cures all
five; no seventh fault. (B) THE TAB ALREADY DROPS DRAWN TRADITIONS, ON THE LINE AS ON THE UNIT: of 2,700 births the line's
tab drops 726 drawn rows in 653 places (`shownTraditions.js :: shownOver`, the declared needs: a failing market 541, no
smith 146, no river 37, no coast 32; 36 are tide rites, 32 of them on river places, because the draw's weight zeroes a
water rite only where there is no water at all and the tab asks a tide rite for a coast). The unit makes it 730 in 657:
B1(ii)'s replacement walk admits anything that is not a field rite, so 4 of its 93 replacements are then dropped.
RULED: NOT A FAULT OF B1(ii) AND NOT CURED AT 119: it is the base's own shape (the draw does not know the tab's needs), no
page states anything false by it, and a draw that knew the needs would re-deal every saved town's set unless it sat behind
the stamp floor. WRITTEN DOWN as TRADITIONS-DRAW-KNOWS-NEEDS in the pre-release list, for a ruling after point 120 with the
measure above (a quarter of places show fewer traditions than their size's band says). (C) THE BIRTH RULE NEVER TOUCHES A
TRADITION A DM WROTE OR ADOPTED (custom rows are appended after the draw and exempt from the needs filter; a lit mirror
shows what is stored; both stayed shown in the reader's run); only the test-side census row `B1furrow` counts them, and no
page reads that row: one line in the list, not a cure.

**G74 (23:14 UTC on 2026-11-26): THE READER ON THE FIVE CURES (`landing/119/SECOND-READER-119-E.txt`): FOUR CLEAN, CURE (4)
COMES OUT.** CLEAN, BY RENDERED PAGES: (1) the floor: 2,700 places born 0.10.0, saved and loaded, show identical sets under
constants 0.11.0 and 1.0.0; every stamp below the floor or malformed answers false; no reader of the removed function
remains. (2) the power line: 133 pages, nothing beside it denies the new words. (5) C4's line: 223 pages, none denies the
placing (13 still say the roads are dangerous: being well placed does not deny that). No pick moved on 2,800 of 2,800. (6)
the table over 2,800 places: FALSE PRINTS 0 ON EVERY VIABILITY LINE (L1 223, L2 14, L3 21, L4 170, L5 178, twin A 346,
twin B 37, strained 42, general 67); food record removed, 300: 0.
**CURE (4) OPENS A FAULT AND IS TAKEN OUT WHOLE: THE CHAIR'S RULING G72 (4) WAS WRONG IN ITS DESIGN.** It made the field
rule read the page's printed trade lists, and those lists CHANGE: the world pulse's first tick rewrites them (date palms
marked depleted; "Desert grain" leaves the lists) before the tick mints the traditions from the same record, so the unlit
tab shows the field rite and the first mint shows its replacement (5 of the 5 places the cure changes). A rule about what
a place's traditions ARE must read only what does not move after birth; the food record's sources and the farmland atom do
not (the reader's first read: mint equals tab, 40 of 40). The import also put 28 KB into the tradition code's and the pulse
kernel's closure. So: commit 927e3747bf is reverted on the cures branch and its tests removed; FINDING 4 STANDS UNCURED AT
119 AND IS WRITTEN DOWN (R11): 4 of 2,700 births (date-palm desert places whose page prints "Desert grain") are refused a
field rite, 1 of them shows a different set. Its root is at birth, not at the rule: date palms print a GRAIN good while the
food record names no grain source; cured there if at all, after a measure. ALSO, one line: the floor reader takes no
padded number ('0.010.0' read as 0.10.0; hand-made).

**G75 (00:00 UTC on 2026-11-26): THE FIVE NEW REDS OF POINT 119's WIDE GATE, BY THEIR CAUSE: STORED FIGURES THAT FOLLOW THE
FURS BIRTHS; NAMED FOR THE OWNER, RAISED BY NOBODY.** `tests/domain/mergeLadderHeldKeys.test.js` EM-R8 A2, A3, A5, A6 and
`tests/property/editCorpusRatchet.test.js` A4. THE HELPER'S BISECT: green at the line 9d22f040e4 and at merge 1; all five
first red at merge 2 (7d8b79401b, B1(i)c-2: the Furrier's district lives on furs). The unit holds no file of the merge
(`src/domain/edit/`): THE MERGE DOES WHAT IT DID; THREE OF THE CORPUS'S 498 TRIALS MOVED BECAUSE TWO OF ITS 63 TOWNS ARE
BORN DIFFERENTLY (the desert city loses its Furrier's district and what the same dice then deal changes; the desert
metropolis likewise): E6 on the desert city rebuilds its conflict citations (62 to 63) and still equals the post-pass
pipeline; E8 on the desert metropolis is declared-only on the power structure (9 to 10); E7 (terrain to desert) on the
hills city, whose own birth is unchanged, now escalates on the defence profile and EXHAUSTS (quiet 471 to 470): its
re-derived desert self is the one that moved; exhaustion on the config channel is the file's own asserted shape (A2's
title), now one row more. RULED: figures measured over births, moved by a ruled change of births, in tests that assert
both ways: they join `siteCoherenceRatchet` C1, `hookThemeDraws` and `pipelinePinnedChoosers` A6 as rows of RED-AT-LINE
named for the owner's one signing at the end; no test is edited at 119. THE CURES BRANCH IS CLEARED at 2fd2c81ff2 (cures
1, 2, 5, 6, the revert of 4, the padded-number line; lint's reds the known ones and the lighting title count, re-taken by
its door at the join). THE HELPER MERGES AND PUSHES THE STACK BRANCH (`landing/RULING-119-2.txt`).

**G76 (04:27 UTC on 2026-11-27): D13's PHASE 1 MEASURES, RULED (G63 (2), (4); G68; G72 (3)): PHASE 2 IS BUILT; THE COST IS SMALL; TWO MEASURES CLOSE.** D13-120's report (its scratch `landing/120/`; the scratch build's diff kept at `landing/120/scratch-build.diff`).
(A) THE SLOTS AS THEY ARE: Daily Life `pickNameable` 10 sites and 2 outsider second picks, a modulus over the admitted lines, an `id` already on all 615 lines but unique only within a branch and held by no walker; the viability lines `pickAdmitted`, `pickTrue` and FIVE MORE plain picks in `deriveViability`, inline strings with NO id; STATE PROSE's MAIN DRAW (`drawVariant`) IS ALREADY A RENDEZVOUS OVER `vid` (the chair's G63 named it as a modulus site: wrong; only the connectives, `drawConnective`, 4 lists of 3, draw by modulus).
(B) THE COST OF THE SWITCH, BY A SCRATCH BUILD OVER EIGHT TEST DIRECTORIES AGAINST THE BASE: 29 NEW REDS IN 11 FILES: 23 tests that pin a seed's line (stale by design), 0 stored figures, registers or goldens, 2 of one test that reads the pool through the old pick, 4 the scratch's own typing artifact. RULED: THE COST IS ACCEPTED; phase 2 is built.
(C) WHAT MOVES: every one of 1,800 towns: Daily Life about 6.6 lines a town (C 5,854; V 6,098), viability 233 and 246 lines; state prose 0; RECORDS MOVED 0; lines outside the families 0. As G62 said: once, at this release.
(D) THE OTHER `% length` SITES: 137, of which 70 are no view-time pick, 48 outside this release's line, and 19 ON A TOWN PAGE (17 beyond the families: hooks, rumours, the crier's line, tradition lines, the fed line, the PDF's headlines, cause words and others), with SEVEN more callers of the old pick on a town page (tradition description 2, tension cause 2, governance account 2, the quick guide 1). RULED: THE TAIL IS NOT IN POINT 120. It is POINT 121's candidate (TAIL-PICKS), measured first as this was, BEFORE THE RELEASE (a pick converted after the release re-deals saved towns a second time). Its design, put for that measure: where a pool's lines carry no id, the rendezvous is keyed by THE LINE'S OWN TEXT (no ids to write, no walker: adding a line moves about 1 town in n+1, removing one moves its drawers, re-wording one counts as both).
(E1) THE OLD-SAVE SHAPE (no food record), 300 master-born records: lines false by their own page BECAUSE of the missing record: 0; no food word printed; G65 (v) and G68's reopening ARE CLOSED. FOUND BESIDE IT, the same with the record kept: 30 rows print a pays-its-way line beside a debt word, 4 of which may deny their page ("owes no one" beside a hook about a debt owed to the partner settlement; a history of a foreign debt called in): R12, measured with the whole-town items (which homes print a PRESENT debt of the place).
(E2) P9c: NO SAVED SHAPE HOLDS A MONSTER SCORE THAT IS NOT A NUMBER (360 master-born records and 1,800 births, all finite; the two writers and the loader read). CLOSED with that count. Named, not worked: a config priority that is not a number would make the score NaN and a save writes NaN as null; no screen writes such a priority.
PHASE 2, AS RULED (`landing/RULING-120-1.txt`): one rendezvous helper in the pick kernel's home; Daily Life on (the slot's key, the branch, the line's id); every viability pool's lines given ids, unique across the pools, and all seven picks of `deriveViability` on the helper; the connectives keyed by their own text, the refused-line fallback no longer by position; THE WALKER with its baseline (an id is append-only: never renumbered, never reused, a removed id retired; its door only adds); the 25 stale tests re-pointed to what the page now prints, none loosened; the proof by planted edits. NOT IN PHASE 2: the town's key (Daily Life is keyed by the town's NAME, so a rename may re-deal its lines; the viability key reads a seed or an id first): RENAME-REDEALS, a measure (which key survives the save and the public projection), because the owner's page and the shared page must print the same lines.

**G77 (05:01 UTC on 2026-11-27): THE SIX LIST ROWS "OWED BY THE LANDING LANE" SINCE POINTS 83 AND 84, TRACED (OWED-6) AND RULED: ONE CAUSE, NO FAULT A USER SEES; FOUR CURED NOW, TWO ARE STORED FIGURES.** All six first red at the point 84 merge 31a0534450 (the goals lane: the tie RESERVE: five relationship archetypes now hold more than eight lines, 26 reserve lines marked `colour: true`, drawn only past a frozen head of eight); its parent green on all six; the lane's own tip already red on four (its "tests whole green" was not true). (1) `colourMarks4h`: the phase-A ledger stops at index 7 and the 26 reserve rows have no row: A LEDGER TRAILING A RULED CHANGE: its rows are written, each with a reader's verdict in the ledger's own form, by its own door. (2), (3) `narrativeQualityCorpus` twice: THE TESTS COUNT THE POOL'S WHOLE SIZE where the draw cycles over the head: stale: they read `pool.head ?? pool.size` (three lines; the cycle check still runs). (4) `powerStructure` F31: one new helper packs several statements on a line (`relationshipArchetypes.js:216`): the shrink-only ceiling is met by SPLITTING THE LINE, never by raising it. (5), (6) `editCorpusRatchet` A3 (327 to 328) and A7 (its first figure 275 to 278 at point 84; at the tip 697, 282, 2,791 against 695, 275, 2,179, the later ones hidden behind the first): MEASURED FIGURES THAT FOLLOW THE GOALS ROTATION AND LATER POINTS: the class of G75: they stay on the list, RE-CLASSED from "owed by the landing lane" to the owner's one signing, with this cause. CURES (1) TO (4) BY A LOCAL BUILDER (OWED-CURE, `prompts/START-OWED-CURE.txt`), no birth and no printed line changed, landed with point 120. NOTED, TO MEASURE WITH THE WHOLE-TOWN ITEMS (R13): the tie lines can print a role title where a name belongs ("Miller needs Innkeeper's silence").
