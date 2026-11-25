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
