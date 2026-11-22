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

