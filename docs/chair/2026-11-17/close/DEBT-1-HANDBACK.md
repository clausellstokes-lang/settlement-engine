# DEBT-1 hand-back: what the whole check named that needed no owner's yes

DEBT-1, 2026-11-17. Base: `lane/join-2026-11-14` at 7cf3cb9f0 (the tip given; unchanged when I fetched). Branch:
`lane/debt-1-2026-11-17`. Brief: `docs/chair/2026-11-14/briefs/BRIEF-DEBT-1.md` (chair's lane). Every row of the
classifier was run at my base before I acted on it (`npx vitest run <the 32 files>`: 30 files red, 35 tests, as read).

## The table: one row per red file of my list

| # | file | what it was (my reading, the evidence) | what I did | at my tip |
|---|---|---|---|---|
| A1 | `tests/domain/corpusSlotAgreement.test.js` (3) | v4 "The {calamity} is behind {settlement} now, ... came through it": a singular verb after a plural slot and an "it" back to it (REAL). v1 "what it built", v5 "what it had built": the "it" is the settlement's (the subject of "built": a calamity builds nothing) | v4 reworded (below). The test's reading refined by its own rule: a table `SETTLEMENT_IT` declares each settlement's phrase by its exact words (it must stand in the line), and every other "it"/"its" of the line is still read (dated). | green |
| A2 | `tests/domain/corpusClipGuard.test.js` (1) | ENTREPOT v5 (`crisis: hunger`) clipped at its semicolon to a calm line (REAL): at base the clipped "...could ever use." printed in 3 famine towns of the 720 (r2s-famine-town-0, -town-1, -city-3) and 1 of the 150 (bar0-village-famine-rand-37) | v5 reworded so no clip point cuts it; the guard's table gains its `hunger` row | green |
| A3 | `tests/domain/foodEnduranceLine.test.js` (1) | One run printed the offender: DS-DEF-2 `CHAIN: food trades failing` v2 "...its stores would still carry it through a year cut off." in food-endurance-metropolis-5, -23, -53 (REAL: a second months figure about food) | the figure dropped, nothing added (below). `tests/domain/bar6SeamDesks.test.js` pinned the line by its end: re-keyed by identity to the new words (R8, dated) | green |
| B1 | `tests/domain/defenseStateProseDesk.test.js` (3) | No pool dead in born towns. Three fixtures lacked answers BAR6-DEFDESK (be35850406, 0218a4df8) declared: (a) the generic `COMPOUND override` pool's tier band (the probe: a village answers v1, a hamlet v2); (b) the full legal chain's `court` + `prison`, read off the roster, while the fixture set only the producer's flags (in born towns the flags ARE the roster's reading: `getInstFlags` = `defenseFactsOf`); (c) the failing food clause's `stores` | the fixtures answer: the generic row carries `tier: 'village'`; `fort()` puts a Courthouse and a Prison on the roster where its flags say so, and takes `storageMonths`; the clause test passes six months (each dated) | green (102/102) |
| B2 | `tests/domain/stressorsStateProseDesk.test.js` (1) | `ORIGIN: popular_revolt` silent: all three lines now declare `tier: >= village` / `market` / `court sits`+`court` (BAR6-CULTURE batch 2, 21a5f2de1); the bare fixture answered none | the played world's town answers its size band (`tier: 'village'`, dated) | green |
| B3 | `tests/components/economicsChainYieldLabel.test.jsx` (1) | No false label. The card reads the chain AS SHOWN (`chainCardUnderSiege(town, c, chainAsShown(c, town))`, then `chainOutputsOnCard`); BAR5-CHAINS's half-way gap withholds the leather and cloth outputs in yield-label-2, -9, -17, -20, so those cards print no outputs and no header. The test counted the record's outputs (an over-count) | re-keyed by identity: the count reads the card's own outputs (dated) | green |
| B4 | `tests/generators/tailDefeconBatch3Lines.test.js` (2) | r2r-hamlet-30 and r2r-city-36 now import "Iron ore" (printed import lists); the hook gate `importHeld(/iron|metal/)` is honest | LEFT: the birth's anchor, for BIRTH-3 | red (as base) |
| C1 | `tests/generators/economicStructure.test.js` (1) | `foodBalance.js` 909 >= 900 | THE BASE NUMBERS (FOOD-2: `HINTERLAND_SHARE_PCT`, `hinterlandShareOf`, `grownShareOf`) moved verbatim to `economy/foodBaseNumbers.js`, re-exported (every importer keeps its path); no prose moved (the presumption register keys prose by file). 892 | green |
| C2 | `tests/generators/servicesStructure.test.js` (1) | `servicesGenerator.js` 402 > 400 | `lawlessRow` says its one name once (both branches carried the same name since 275ce166f) and one doubled blank line goes. 400 | green |
| C3 | `tests/joins/labelJoins.test.js` (1) | one run: `src/generators/resourceGenerator.js: 1 label-join site (instNameIncludes)` | LEFT: a BIRTH-3 file in flight | red (as base) |
| D1 | `tests/components/bar3LabelWords3.test.jsx` (1) | r2s-under_siege-city-0's fish card takes "impaired": its every live Via house carries the siege's mark (Fish market "Stopped by the siege.", Salt works and Cooper curtailed), which BAR7-ECON item 3 (C20287) reads as no working card; the page prints "Fishing & Seafood · Impaired" (page consistent with the ruling) | re-keyed to r2s-under_siege-town-9 (a besieged port whose sea grounds keep a working card; searched r2s-under_siege-*-0..15) | green |
| D2 | `tests/components/displayEconCrisisMarks.test.jsx` (1) | KEEP "Iron & Metalwork Metal is smelted or worked here." at r2s-under_siege-city-0: the share now reads "Curtailed by the siege." Every one of 47 besieged towns of 96 (r2s-under_siege-<tier>-0..15) that print an Iron & Metalwork share prints it marked: the share reads the chain card's state (BAR6-ECON 8d.income) and the card is impaired where a mine beyond the walls is curtailed or a smith's service is marked | LEFT: no besieged town bears the claim, so there is no anchor to re-key to; the close (or the owner) retires or re-words the KEEP row | red (as base) |
| D3 | `tests/components/displayEconRelianceFoodWords.test.jsx` (1) | r2s-under_siege-metropolis-3 no longer prints "Contributes to Iron & Metalwork - 2% of income": its ore is depleted ("Short of iron ore") and the siege curtails the share (page right). Over the same 96 besieged towns no page prints a "Contributes to Iron & Metalwork" line | LEFT: as D2 | red (as base) |
| D4 | `tests/generators/arrivalIndebtedDistrictTwin.test.js` (1) | r2r-village-47's herb sacks declare `trade at work: spice` (BAR6-SCENES 6b); the town holds none, so the same slot draws the declared twin beside its Apothecary (page right) | REST re-keyed by identity to the twin's words | green |
| D5 | `tests/generators/bar2People2Trade.test.js` (1) | r2r-hamlet-20's pair is now drawn as allies: no rivalry line at all | re-keyed to r2r-hamlet-41 (a rival pair sharing no trade prints the twin) | green |
| D6 | `tests/data/w2FixData4Round.test.js` (1) | Plaviets keeps its smith; its sense beat now draws another true smith line ("A few finished spearheads lie on a workshop bench") | re-keyed to rw3-hamlet-calm-57 | green |
| D7 | `tests/generators/foodwaysCultureLineHolds.test.js` (1) | rv2-calm-town-11's food record counts no source; the Maize line needs its grain (BAR6-CULTURE 6d-fields) | re-keyed to rv2-calm-town-23 (grain, livestock) | green |
| D8 | `tests/generators/foundryExportsFishTrade.test.js` (1) | soak1k-1652 now imports "Salted fish", so its Fishmonger rightly keeps "from the net". No soak1k town of 1600-2399 has a Fishmonger without fish | LEFT: the birth's import, for BIRTH-3 | red (as base) |
| D9 | `tests/domain/tailCorpusDefGuards.test.js` (2) | be35850406 put a crime-wave twin at DS-DEF-3 Safe v3; the later members moved up one | the two rows re-keyed by identity to the same lines' new vids (v4, v5) | green |
| D10 | `tests/domain/display/economyDeskReadsTheCards.test.js` (1) | r2r-village-52's full livestock card stands but the town exports no leather goods, cheese or meat now: the desk is rightly silent | FULL_KEPT re-keyed to r2r-city-8 (Potter, roof tiles; no r2r town of 300 keeps the Tannery's line now) | green |
| D11 | `tests/generators/tailDefeconSafetyLines.test.js` (1) | SEAM-DESKS reworded the same war-profiteering line ("the grain and provisions") | re-keyed to the line's own words | green |
| D12 | `tests/domain/bar3Defecon2Lines.test.js` (1) | r2r-town-34, r2r-metropolis-2, r2s-insurgency-city-3 now all import Timber: the carts and rafts lines are true there. No r2r town, city or metropolis of 180 draws the no-timber twin | LEFT: the birth's import, for BIRTH-3 | red (as base) |
| D13 | `tests/data/w2FixData5Rows.test.js` (1) | rww-city-famine-1 now imports "Iron ore": its forge rightly makes blades. No rww-city-famine-0..119 draws the cold-forge twin | LEFT: the birth's import, for BIRTH-3 | red (as base) |
| D14 | `tests/data/w2FixDataArrival.test.js` (1) | SEAM-SCENES item 3 made the ironwork line declare `trade at work: ironwork` (a smith WITH its iron); the fixture's smith had none | the fixture brings iron in on both sides; the siege alone still decides (dated) | green |
| D15 | `tests/generators/arrivalSceneRoster.test.js` (1) | a positional pin: BAR6-CULTURE batch 3 (76487ede1) put a hamlet twin at `ordinary[4]` | the merchant's entry found by its words; the same declaration asserted | green |
| E1 | `tests/domain/stateProseKernel.test.js`, `tests/generators/tieDrawDeclared.test.js`, `tests/generators/tieDrawUnprinted.test.js` (3) | the calm double (last extended c74829e25) did not answer the presence atoms landed since (fail-closed) | extended (atoms below) | green |
| E2 | `tests/domain/crisisBlindDossierProse.test.js` (1) | the setter table lacked four presence atoms pools now declare | `crime wave`, `rival rings`, `monster frontier`, `food surplus` | green |
| F1 | `tests/lint/newsHeadlineContract.walker.test.js`, `tests/lint/newsVoiceContract.walker.test.js` | zero tests ran because `beforeAll` throws: `reconstructWizardNewsIntroductions` (scripts/lib/news-voice-contract.mjs:377) "Wizard News introductions drifted: expected 417, got 420" against the stored `CORPUS` constant of a protected shared tool | LEFT: a stored figure; its re-take is the close's | red (as base) |
| G1 | `tests/docs/enforcement-claims.test.js` (2) | two lines of `BAR7-ECON-HANDBACK.md` (139, 216) REPORT an eslint run in the words the detector reads as a completeness claim (`CLAIM_RE`'s zero-problems phrase) | reworded to what the run printed, "0 errors, 0 warnings" (no tag needed: a report, not a claim) | green |

## The old and new words of A (for the owner's veto list)

| line | old | new |
|---|---|---|
| DS-GEN-16 LEGACY-RECOVERED v4 | The {calamity} is behind {settlement} now, and the place that came through it is the one that stands; that legacy is {timeband_age}. | {settlement} is past the {calamity} now, and the place that came through is the one that stands; that legacy is {timeband_age}. |
| DS-GEN-13 ENTREPOT v5 | {settlement}'s market was built to handle far more than its people could ever use; with food short, it cannot now feed them. | {settlement}'s market was built to handle far more than its people could ever use, yet with food short it cannot now feed them. |
| DS-DEF-2 CHAIN: food trades failing v2 | {settlement}'s food trades are failing, though its stores would still carry it through a year cut off. | {settlement}'s food trades are failing, though its stores would still carry it if it were cut off. |

v1 and v5 of LEGACY-RECOVERED are unchanged (the settlement's "it"). A first wording of R3 ("a long while if it were cut
off", commit badd3c4bf) was a duration in a band-blind line, refused by
`dossierStateProseProjection.contract :: states no duration its pool key does not license`; d0b474d9f took it back to the
smallest change. Projection: `npm run gen:dossier-prose` over a wiring census re-taken in scratch only (AX1); the census
and `proseNorms.generated.js` are not committed; the projection diff is my three lines (and v4's slot order).

TOWNS THAT PRINT EACH LINE (PAGE-COPY render, the census's 720 and the wide read's 150), before -> after:

| line | the 720, base -> tip | the 150, base -> tip | three towns |
|---|---|---|---|
| LEGACY-RECOVERED v4 old / new | 15 / 0 -> 0 / 15 | 5 / 0 -> 0 / 5 | r2r-hamlet-59, r2r-village-11, r2r-village-45 |
| LEGACY-RECOVERED v1, v5 (unchanged) | 34, 19 -> 34, 19 | 4, 2 -> 4, 2 | r2r-thorp-39; r2r-hamlet-15, r2r-village-2 |
| ENTREPOT v5 clipped calm line / new whole line | 3 / 0 -> 0 / 3 | 1 / 0 -> 0 / 1 | r2s-famine-town-0, r2s-famine-town-1, r2s-famine-city-3 |
| food trades failing v2 old / new | 30 / 0 -> 0 / 30 | 4 / 0 -> 0 / 4 | r2r-metropolis-0, -1, -2 |

Each new line prints in exactly the towns the old one printed in; no old line prints at the tip.

## The pools of B, dead or alive

All alive in born towns; none dead. The generic `COMPOUND override` pool is a fallback for a condition the table does not
carry (COMPOUND_CONDITIONS equals every condition the producer writes), reached only by an unknown label, and speaks there
once its tier is answered. `Internal Security: full legal chain`, `CHAIN: food trades failing` and `ORIGIN: popular_revolt`
speak wherever their declared facts hold. On the base's pages of the 870: the legal chain's four lines in 75, 72, 97 and 6
towns; the failing food clause in 48. `ORIGIN: popular_revolt` is a lens of a PLAYED world's stressor (its origin variant);
no born town carries one, so its liveness is the played-world sweep's (green), and every fact it declares (tier, market,
court) is on every real record.

## Atoms named (no new vocabulary: every one is an existing atom, answered by a test double)

- `tests/helpers/calmFactsDouble.js`: `court sits`, `legacy ruin`, `sovereign`, `seat outranked`, `seat members`, `paid
  watch`, `monster frontier`, `crime wave`, `rival rings`, `exported` (keyed), `food surplus`, `legitimacy crisis`, `force`
  (keyed), `trade at work` (keyed): hold; `seat held`: false (only ever excluded, so the place that admits every line holds
  none); and the older `prison`, `imports`, `exports`, never answered here and now declared by swept pools (BAR5-THINGS
  answered `court` the same way).
- `tests/domain/crisisBlindDossierProse.test.js` setters: `crime wave`, `rival rings`, `monster frontier`, `food surplus`.

## Births and behaviour

Births of the 720 and the 150 byte-identical, base against my tip with A to C applied (870 records, the PAGE-COPY births:
`corpus.ndjson.gz` identical, md5 of the stream e18f9e6bb75c37a489786306f48455e5 both sides). A is a rewording at print; no
stored record moves; no field added; no stored figure re-taken; no ceiling raised.

## The net

Each alone, through `sh scripts/gate-tail.sh`, at my base (7cf3cb9f0) and my tip (3beadc335):

| gate | base | tip |
|---|---|---|
| `npm run typecheck:domain:strict` | 0 | 0 |
| `npm run typecheck:ratchet` | 0 | 0 |
| `npx eslint` on my 23 changed sources | - | 0 (nothing printed) |
| `npx vitest run tests/architecture` | 0 | 0 |
| `node scripts/presumption-classes-door.mjs --check` | hits 1787 · banked 1938 · fresh 0 · stale 151 · ceiling 1938 | the same, every row identical |
| `node scripts/presumed-things-door.mjs --check` | fresh 39 · stale 72 · first-register stale 7 · banked 4688 · strips fresh 0 stale 0 banked 107 | the same, every row identical (the 39 fresh rows are at the base, not mine) |
| `npx vitest run tests/lint` | 29 files, 66 tests red (69 failing names) | the same 69 names, none new, none gone |
| my list (31 files, plus bar6SeamDesks, bar6CultureLines, the projection contract) | 46 failing names | 17: the eight files left by name above, and the projection contract's nine (STORED, red at base by the same names) |
| ONE `npm run build`, then `tests/build/vendorPdfLazy` + `bootSmoke` | - | 0; 49 passed, 17 skipped |

THE SCRATCH MERGE: the line's tip as it stood at the end (fd93fb998: BAR7-ORDER landed since my base) with my tip,
`git merge --no-commit`, no conflict; my list there fails the same 17 tests by name as at my tip. Aborted, never pushed.

## Left, by name

- FOR BIRTH-3 (the supply rule): `tests/generators/tailDefeconBatch3Lines.test.js` (2: the iron hooks, the towns import
  Iron ore), `tests/generators/foundryExportsFishTrade.test.js` (salted fish imported), `tests/domain/bar3Defecon2Lines.test.js`
  (timber imported), `tests/data/w2FixData5Rows.test.js` (iron ore imported), `tests/joins/labelJoins.test.js` (the site is
  in `resourceGenerator.js`), and `tests/data/tailHouses1Gaps.test.js` (not mine by the brief). Each NOT claim's twin stands
  in no town I searched while the birth imports the good; when the rule is rebuilt, each re-keys to a town that cannot buy in.
- FOR THE CLOSE: `tests/lint/newsHeadlineContract.walker.test.js` and `tests/lint/newsVoiceContract.walker.test.js` (the
  stored Wizard News `CORPUS` count, 417 -> 420); `tests/components/displayEconCrisisMarks.test.jsx` and
  `tests/components/displayEconRelianceFoodWords.test.jsx` (the besieged Iron & Metalwork KEEP rows: no anchor bears the
  claim; a ruling retires or re-words them); `tests/domain/bar3CorpusGuards.test.js` (STORED: its REWORDED row pins v3,
  now v4, same message at base and tip); every STORED file of the classifier's section 5.
- NOT MINE AND NOT TOUCHED: `tests/docs/enforcedByExists.test.js` (R8: `birthKindsLaw.test.js`'s bare `resourceGenerator.js`
  pointer, a file the brief keeps from me).
