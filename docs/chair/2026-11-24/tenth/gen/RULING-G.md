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
