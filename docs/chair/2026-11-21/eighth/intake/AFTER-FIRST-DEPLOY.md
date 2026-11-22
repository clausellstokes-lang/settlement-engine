# INTAKE FOR AFTER THE FIRST DEPLOY (kept by the eighth chair; each item names who found it and what it would take; none holds the first deploy; started 2026-11-22 15:50 UTC)

Per the standard's intake rule: a find outside a lane's packet is LISTED here, not chased. A successor reads this file when the first
deploy is out and cuts units from it; the owner's word orders them.

## 1. ORDER-TAIL: the stored powers are not always strongest-first, and nine readers print as if they were (E96)

MEASURED (CLOSE-1, `close/census/order-ex.mjs` and `bar-count.mjs` on `lane/close-1-2026-11-22`; 900 births a tree): DARK 61 of 150 metropolises
and 50 of 150 cities store `powerStructure.factions` out of power order (lit 69 and 55); the four small sizes 0. Only the LAST row is out of
place: an alliance or coalition power appended after the sort ("The Mages' Compact", "The Holy Compact", "The Tower Alliance", "The
Underground"); every row above it stays in order; the first row is the strongest. NOT the new laws' doing.
READ IN THE CODE (a read-only helper of the chair's on the line at c110dd85b; CONFIRMED by its reading unless marked): the power step's last sort
is `factionDynamics.js` (`applyLegitimacyMultipliers`, about line 822); AFTER it, with no re-sort: `applyDensityLaw.js :: resizeSeats` (about 325:
each minted rival appended, power = host × 0.55; city and metropolis only), `rulerKin.js :: foldKin` (about 108); in play:
`rulingPower.js :: transferRulingPower` (the winner +6, the deposed house appended), `applyWorldPulseFactionRoster.js`,
`applyWorldPulseOccupationAuthority.js` (the occupier appended at 90). No test's title says the array is stored in power order.
THE READERS THAT ASSUME STRONGEST-FIRST AND PRINT (nine): `SummaryTab.jsx` four (`characterSentence` "Power rests with X", about line 37; the copy
text "Power: A (x%), B, C", 156; the Power tile's subtitle, 235; `FactionBar`'s `slice(0,5)`, 255: a sixth row is dropped even if stronger);
`narrativeGenerator.js :: genPressureDetail` `topFaction` (489: the stored pressure sentence); `genSettSummary` `topFaction` (147: the faction
named in NPC secrets); `historyGenerator.js` `dominantFaction` (99) and `secFaction`/`altFaction` (391); `aiLayer.js :: extractFullContext` (171,
427). THAT DECIDE (two): `conflicts.js :: crossFactionRivalPairs` (124, 142: which quarrels are drawn), `factionCompetition.js` (336: the rivals).
UNCLEAR: `personaSlicer.js` 162, `powerStrata.js` 156 (the Power tab's list, stored order, no strength words), `DefenseTab.jsx` 309,
`membership.js :: powerOrderOf` 92 (a tie-break). SORT THEMSELVES: the PDF and Foundry view model, `leaderLead`, `rulingPowerCoup`, the display
prose, the share veil, the tonight sheet.
WHAT IT WOULD TAKE, two ways: (a) THE PAGE SORTS (no birth moves): the Summary's four readers sort by power before they slice or name; the
bar also MARKS THE HOLDER beside the governing row (CLOSE-1: the bar marks the governing row only; lit, the holder is a different row in
109 of 150 towns, 124 cities, 122 metropolises); (b) THE WRITER RE-SORTS after the density law's appends (it moves stored order: births,
goldens: the owner's signing). A top-five reader today can drop a tail alliance that outweighs the fifth by a point or two.

## 2. The power step's sentence is written before the coherence repair (E93)

FOUND by the veil lane's measure (VEIL-33, 480 births): on r5c2-m3-hamlet-8 a coherence repair adds a Citizen militia AFTER the power step wrote
the famine sentence into `powerStructure.recentConflict`; the stored sentence ("The last harvest failed badly…") is the branch of a state the
settled record no longer has ("Food is short…" is what the writer says over the settled record). 1 of 287 nothing-hidden pages. WHAT IT
WOULD TAKE: the sentence re-settled after the repair (it moves births), the generation lane's.

## 3. Daily Life: "the elder" beside a headman (E83)

`dawnWork` W11 and B19 and `gatheringPlaces` P13 need `ruler: elder`, which by `rulerKindLabel.js`'s design also holds at a Headman's Authority place.
With the `office:` atoms on the line they can be re-keyed to `office: elders`. DAILY-3's measure: an `office: headman` line and one of the three on
the same page: 0 of 900. No false line today; a tidy-up.

## 4. The veil: a transfer's own sentence on a shared page (E93, E94), and the pressure line (E97)

"R5-RECENT-T": where the served page carries a transfer's parts and the winner's row is served, compose the transfer's sentence (in play only:
0 of 900 lit births store one). "R5-PRESSURE": `pressureSentence` withheld always and re-derived on the page by the engine's own writer over the
served document (until then the pressure line is absent from about a third of shared pages: 154 of 480). Both are the veil lane's, after R3; either
may still ship with the first deploy if it lands in time.

## 5. The players' page: an owner's stored switch for the empty-section cut (E84)

One typed line in the veil's served allowlist (`211 :: _gallery_veil_served`): a migration of the owner's hand. Not built unless he asks.

## 6. A Feudal Stewardship whose seat is held by "the reeve" (E107)

FOUND by the Daily Life lane's builder (DAILY-3, 2026-11-22 17:46 UTC): on four steward thorps (hxd-thorp-52, -59, -93, -140) the governance line reads "Saba
al-Din, the reeve, holds the seat of the Feudal Stewardship": the only such house on the roster is "Lord's reeve"; no steward's house and no
steward stand there. The Daily Life line L12 ("The lord's steward…") was therefore given the house's own atom as a need (it prints only where a
steward's house stands). WHAT IS LEFT, the seat lane's: whether a stewardship's holder should be titled by his house's role ("the reeve") or by the
office he holds ("the lord's steward"), and whether the two words on one page read as two officers. No false line today.

## 7. Daily Life: the line L12 ("The lord's steward…") (E107)

Built by DAILY-3, CUT from the landing by its count. Its ruled shape: needs `house: lord's steward` beside `office: lord's steward` and
`sovereign` (it prints only where a steward's house stands); the steward's answering row in `registeredWords.js :: HOUSE_FAMILIES` goes with it.

## 8. Daily Life's three leftovers (DAILY-3's hand-over, 2026-11-22)

(a) The PDF chapter imports `dailyLife.js :: deriveDailyLifeSlot` whole, so the PDF's import set grew from 629 to 644 files and one writer-reach
row widened (`yearsAgo on legacyAnnotations`, dossier-pdf N to R: E108): a leaf that derives only the chapter's slots would undo it. (b) The
sameness census's stale "Narrative refinement" row: its door refused on a rise outside the Daily Life lane. (c) `en.js` holds `ai.dailyLife.*`
keys with no reader since the button went. Also the owner's: the server's AI daily-life function and its price row are his to retire.

## 9. The Daily Life page as printed: three things read on six places (E110)

**MOVED BEFORE THE FIRST DEPLOY BY THE OWNER'S ORDER ("Fix all:", 2026-11-22; recorded 20:22 UTC): all three are DAILY-4's unit "(0c) THE OWNER'S THREE" (E125). This entry stays as the record of what was read; it is no longer waiting.**

(a) ONE FACT TWICE ON ONE PAGE: the city hxd-city-0 opens "The country around is overrun with beasts…" (outsider impressions) and closes "Beasts
now roam the country around…" (recent changes): a later slot should not repeat a fact an earlier slot printed (it draws its next line). (b) THE
SAME SENTENCE ON TWO OF SIX PLACES ("People do as the Headman's Authority says, but few of them think well of it."; "Ask who decides things here,
and a visitor hears more than one name."): their shares by size are asked in DAILY-B's landing line. (c) A FORM's NAME IN THE POSSESSIVE reads
badly ("the Headman's Authority's mark is on every door that matters"): the office atoms let such lines say "the headman's".

## 10. The stored pressure line "grazing rights" on 21% of thorps' pages (E111)

CLOSE-2's reading of the joint measure's stop 1 (450 births; dark equals lit): one trouble line over the sameness bar. The sameness program's.

## 11. What the page means by a contender (E113): THE OWNER's QUESTION

The first power the page prints as the seat's contender is tied to the ruler (the web's dependent, symbiotic or subordinate bargain) on 280 to 408
of 640 dark pages and 378 to 438 of 622 lit; "Contests the seat" is on master since PR #72. Three ways: a softer word where the two are tied (the
chair's leaning: the same list); the contender chosen among powers not tied (104 to 154 places then print none; `coupContenders` moves births); or
leave it. The measure: `contender/CONTENDER-MEASURE.md` on `lane/close-2-2026-11-22`.

## 12. "The crisis has a body": A PROPOSAL FOR THE OWNER (E112)

Built whole on `lane/fortune-7-2026-11-22-u8-wip` at 0b7037727: under the fortune law a crisis that names a power of its own always has it seated
with its leader. Today 509 of 900 places state such a crisis with no power of it on the roster (lit 508; 0 after). It lifts a mass ceiling of one to
two and changes the density design he signed. Open points: the lifted ceiling; two-crisis places (17 left: the stated crisis gets the one body);
the packed lines (unpacked if it lands). Also listed: `defenceParts` R13's bound re-cut score by score (the defence lane's).


BESIDE IT (E118): the one printed sentence that names a crisis's power where none is on the roster: the governance paragraph's "The creditor's
agent has blocked the money for repairs." in an indebted place with no creditor power (35 of 900 places, dark and lit alike). Master prints the
same claim today in older words; a debt has a creditor; not a contradiction: a person named in prose who has no card. The owner's to decide with
the proposal: seat the creditor (the proposal does), give the agent a card, or leave the sentence.

## 13. THE STANDING SENTENCE STORED AS ITS OWN FIELD AT BIRTH (E121; the veil lane's, with the powers' generator)

The share veil cuts a power's standing sentence off its stored description by a TABLE of the engine's sentence forms held in migration 212
(today's 44 forms and master's older ones), kept equal to the engine by a walker: a changed sentence form needs a migration. THE BETTER SHAPE:
`rosterText.js` writes the standing beside the description as its own field at birth (empty where the engine wrote none), the server cuts by
the document's own field, and the table freezes at the forms already stored. It moves every birth (a new field on every power): the golden
records, the observed-shape baseline, the veil's registry row. Not before the first deploy.

## 14. THE DEFENCE BOUND R13 (E118 (4))

`tests/generators/defenceParts.test.js` R13 stays listed red under the lit laws (v3build-village-3: the will 6.86 over the bound 6.8, one
rounding unit): the bound is points-only and the will a score-by-score sum. The defence lane re-cuts the bound score by score.

## 15. SECTIONS OF ONE PAGE THAT DISAGREE (the chair's own read of one town, E131; the state-sentence lane's)

Read on one town (seed owner-read-1, Grímtun; the line at point 105, laws dark): (a) the overview's "The town pays wages for its defense as well
as keeping its walls." beside the defence tab's "The people who would have to hold Grímtun through something know there is no money to pay them
for it."; (b) the defence tab's "Grímtun's food trades are failing, and what they fail to put by is food the town would miss if it were cut off."
beside the economy tab's "Nothing on Grímtun's tables suggests to a visitor that food is a worry here." Each desk speaks from its own fact; no
test reads two desks together. PROPOSED: a census of sentence families that assert opposite things on one page (pairs by the facts they stand
on, counted over 900 places), then a rule of precedence or a shared fact for each pair found common. Also read there: the stiff "Set Grímtun's
trades against the help they draw on, and magic is not a thing any of them needs."; a number slip in "Nobody in Grímtun thinks of the town walls
as ornament; the town knows what it is for and checks it."; "The steward governs in name" on a page whose office is "the lord's appointee".
(The third pair read on that town, the empty seat beside its holder, is new with the flip and is cured before it: E131.)
