# BAR3-LABELS-3 hand-back (2026-11-15)

HANDED BACK at about 22:20 UTC by file (the meter read 0; by time: about 65 minutes in). After this push I push nothing more.

Seat BAR3-LABELS-3, the DISPLAY half of BAR3-LABELS, successor of BAR3-LABELS-2. Branch `lane/bar3-labels-2026-11-15`,
tip at start d38c247af (read back from origin: as the prompt says; the main checkout's local ref was stale at 8b45191a5,
and I left it alone); the line's merge at 52f0a1684 was already in (4decc3acc). Worked in a scratch worktree on my
branch, a detached tree at d38c247af beside it for development (`dev`), and the books' second tree at 52f0a1684.
The earlier hand-backs stay as they are.

## The rulings I worked to
- BRIEF-BAR2 (the method) with BRIEF-BAR3's twelve amendments; the chair's prompt (items 1 to 5, in its order).
- RULING L3b (the chair's, 2026-11-15 21:20 UTC; vetoable by the owner): no new word; a Full exploitation card under a
  siege that stops the field work takes the chain card's own state word for the same ground.
- RULING CL2 (the chair's; vetoable): a line that says the hall's people are not for sale reads 'an official who sells';
  a line that says only that the criminals' approach did not take stands beside a corrupt official.
- THE CHAIR'S GRANT CL1 (after the fact; on the veto list): my predecessor's crime-line fact 'an official who sells' and
  its row in `tests/lint/factLayers.shared.mjs`'s table are accepted.

## Item 1: the law red at the tip, and the pins not run
- `tests/lint/nameListColumns.walker.test.js` red at d38c247af alone ("no stale rulings": the scan's lazy `.slice` swallowed
  the new `relyFor` template, so "MagicTab.jsx :: FACET_ORDER" read stale). THE CURE, one line, as verified:
  `MagicTab.jsx` hoists `const relyHead = relyNames.slice(0, -1).join(', ');` and `relyFor` reads `${relyHead}`. Green
  alone after, with `tests/components/nameColumns.test.jsx`; the page text does not move (the batch-1 guard
  `tests/components/bar3LabelWords2.test.jsx` and `magicRelianceSource.test.jsx` green).
- THE PINS NOT RUN (tests/pdf, tests/ui, by `grep -rlE` of the predecessor's symbols and its three tabs: 14 files), each
  alone at d38c247af + the cure: ALL GREEN: `tests/pdf/{chainStateThreeSurfaces,foodFiguresEverySurface,labelLadderParity,
  statePrintParity,tradeListsThreeSurfaces,tradePillWordEverySurface}.test.jsx`, `tests/pdf/{screenParitySource,
  sections.smoke}.test.js`, `tests/ui/{defenseTabFlow,economicsTabFlow,generalDeskTabFlow,tabs.smoke}.test.js`,
  `tests/ui/{mountFirstPaint,prosperityInCrisisSurfaces}.test.jsx`.
- AMENDMENT 11's three walkers alone: `negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors` red, naming
  only the last round's files (`tests/generators/bar2Places2Rows.test.js`, `tests/generators/power/bar2People3Funding.test.js`,
  `tests/generators/settlementOriginProse.test.js`, `tests/property/secrecyTradeDormancyFence.test.js`,
  `tests/property/treatyLifecycleVoiceDormancyFence.test.js`); the same named files after my guard was added: no line of mine.

## Batch 2 (items 0, L3b, CL2), display only, the record not touched

Measured on the census's 720 at d38c247af (+ the law cure: no page change) by script over `corpus.ndjson.gz` and the
dumps, with the tree's own leaves:

| item | row(s) | the state | measure before | cure |
|---|---|---|---|---|
| 0 | C7514 C18969 C7264 | the floodplain chain card prints "Grain export" and "Surplus food" where the food record offers no surplus (`foodSurplus.js :: offersFoodSurplus`) or a famine is in force | the floodplain card prints them in 10 towns; 8 with no surplus, 0 under a famine (r2r-town-29, r2r-city-35, r2r-city-42, r2r-metropolis-15, r2r-metropolis-50, r2s-occupied-town-1, r2s-religious_conversion-metropolis-1, r2s-slave_revolt-metropolis-2). The grain chain's own surplus words (51 cards) print only where the record offers a surplus (filtered at birth). "Date export" prints on no card of the 720 | `tradeListDisplay.js :: chainOutputsShown`: a food-surplus output (`isFoodSurplusGood`) or a food-export output (`FOOD_EXPORT_OUTPUTS`: 'grain export', 'surplus food') is not printed where `foodToSpareHere` is false (no surplus on the record, or `crisisOf` holds a famine). "Agricultural produce" stands: the card is never mute. The data file is not touched. One reader for the tab's card, the PDF's flow card and Services section (they read `chainOutputsShown`) |
| L3b | C7371 C7595 | "✓ Fully exploited" under a siege that stops the field work (`chainStateShown.js :: tradeStoppedHere`) on a ground whose chain cards print a word that is not working | 14 Full cards under such a siege in 10 towns (as my predecessor measured); in 7 cards (7 towns) EVERY chain card working the ground prints "Impaired" (by `chainCardUnderSiege(town, c, chainAsShown(c, town))`); the other 7: 3 with no chain card on the ground (fish in r2r-thorp-58 and r2s-under_siege-thorp-0, hot-spring minerals in r2s-under_siege-metropolis-0), 3 fish beside a sea chain that works (r2s-under_siege-city-0 Running; r2s-under_siege-hamlet-0 and -town-0 Vulnerable), 1 iron ore beside Vulnerable smelting and arms (r2s-under_siege-city-3) | `economicsCrisisMarks.js :: fullCardWordUnderSiege` (the chains that work the ground, `facts/chainWorking.js :: chainsWorking` over `resourceWorkReading`'s keys, each as its card prints it): where every one prints a word outside `WORKING_CHAIN_STATUSES`, that word; `ResourcesTab.jsx :: ResourceChainCard` prints it ("Impaired", the Economics card's own word) in place of "✓ Fully exploited". The dossier search mounts the same card with the settlement: one voice. No new word |
| CL2 | (ruling; item 3 of "Left") | DS-DEF-4 equilibrium v1 "… nothing is bought here" and none v3 "… business with the hall is straight" beside an official the page prints corrupt | the DS-DEF-4 capture lens prints in NONE of the census's 720 dumps (no line of its capture pools); RECOVERING v2 "The approach was made at X and did not take" prints in 29, 15 beside a corrupt official and none beside one in criminal pay (r2r-town-25, r2r-city-6, r2r-metropolis-32, …): it STANDS by the ruling | `stateProse/crimeLineDisqualifiers.js`: the two declarations read 'an official who sells' (in criminal pay, the hall held, or a corrupt official); RECOVERING v2 and DS-DEF-4 none v2 ("has the means to reach into the hall and it has not") and v1 ("No criminal's money appears …") speak of the criminals' pay and keep 'an official in pay'. Never mute: each pool keeps two lines admitted beside a corrupt official |

Guard: `tests/components/bar3LabelWords3.test.jsx`: births of the census's seeds; NOT pairs 3 + 3 + 3, each red at
d38c247af (run in that tree before the cure: "3 of 3 case(s) failed" in each arm; L3b's arm on the rendered Resources
tab: "Fully exploitedGrain" printed, "ImpairedGrain" absent), KEEP pairs green (r2r-village-27 and
r2s-recently_betrayed-town-1 keep "Grain export"; fish in r2s-under_siege-city-0 and -town-0 stays Full; RECOVERING v2
and DS-DEF-4 none v2 stand beside a corrupt official; no corrupt official in r2r-hamlet-11, r2r-village-49: the two
lines stand). The declarations are found by key and vid, never by their sentences (`proseDrawnAnchors`).

Files: `src/components/new/tabs/MagicTab.jsx` (item 1), `src/components/new/tabs/ResourcesTab.jsx`,
`src/domain/display/economicsCrisisMarks.js`, `src/domain/display/tradeListDisplay.js`,
`src/domain/display/stateProse/crimeLineDisqualifiers.js`; the guard.

## Every new or changed line (the veto list)
- The floodplain card's outputs without "Grain export" and "Surplus food" (it prints "Agricultural produce"):
  r2r-town-29 (town: the smallest it reaches), r2r-metropolis-50 (metropolis), r2s-occupied-town-1 (an occupation).
- "Impaired" on a Full exploitation card (for "✓ Fully exploited"), under a siege that stops the field work:
  r2r-hamlet-0 (grain, hamlet: the smallest), r2s-under_siege-metropolis-0 (mountain timber, metropolis), r2s-under_siege-city-3
  (livestock, a siege city); also r2r-village-21 (fish), r2r-village-55 and r2s-under_siege-hamlet-0 (livestock),
  r2s-under_siege-hamlet-2 (grain).
- DS-DEF-4 equilibrium v1 and none v3 struck beside a corrupt official (the slot draws its pool's next admitted line):
  prints in none of the 720; by the record the struck towns would be those with a corrupt official and none in pay
  (r2r-town-25, r2r-city-6, r2r-metropolis-32 among them).

## Rows named for other seats
- The siege's Full card on the PDF (and the journal, which the validationOnPage docblock says reads the same groups):
  `src/pdf/lib/viewModelBodySlices.js` reads `validationOnPage.js :: exploitationGroupsShown` and prints "Full"; for one
  voice it would call
  `economicsCrisisMarks.js :: fullCardWordUnderSiege(town, card)` (not mine). Likewise my predecessor's: the siege's
  chain state on the PDF (`src/pdf/lib/chainStateOnPage.js`) and the journal (`src/foundry/journalPages.js`) want
  `chainCardUnderSiege`.

## THE INVENTORY DIFF (batch 2)
Two census runs of the 720 (before at d38c247af + the law cure; after at my tree), `inventory_diff.py` read whole:
sentences 30147 -> 30151; gone 0, new 4, in fewer towns 6, in more towns 0, moved 0. Every loss is EXACTLY its measure:

| sentence | before -> after | measure |
|---|---|---|
| Surplus food | 10 -> 2 | 8 (the card; the two left have a surplus) |
| Grain export | 10 -> 3 | 8 (the card); the third town is r2r-town-29, whose TRADE EXPORTS list prints "Grain export" from the record's export row (the tab, the PDF and the journal): "What is left", item 1 |
| ✓ Fully exploited Livestock / Grain / Fish / Mountain timber (medium value) | 92->89 / 97->95 / 120->119 / 7->6 | 7 cards in 7 towns |

NEW and THE INHERITORS (the same four, read where they print): "Impaired" + Livestock (3: r2r-village-55,
r2s-under_siege-hamlet-0, r2s-under_siege-city-3), Grain (2: r2r-hamlet-0, r2s-under_siege-hamlet-2), Fish (1:
r2r-village-21), Mountain timber (1: r2s-under_siege-metropolis-0): the chain cards' own word for the same ground under
the same siege. The floodplain card's other output, "Agricultural produce", prints where it printed. CL2 moves no
sentence on the 720 (its two lines print in none).

## THE BOOKS
Run ALONE at my tip's code (the `dev` tree, then the ResourcesTab-pinning files again at the branch tree after the card's
last form), each through `sh scripts/gate-tail.sh` (`runall.sh`): the test files that pin a symbol I changed
(`grep -rlE` of `chainOutputsShown|fullCardWordUnderSiege|CRIME_LINE_DISQUALIFIERS|CRIME_LINE_FACTS|crimeLineFactsOf|
crimeLineDisqualifiers|ResourceChainCard|ResourcesTab|economicsCrisisMarks|chainCardUnderSiege|relyFor|MagicTab`: 49) and the
twenty law suites with amendment 11's three walkers and `nameListColumns` (71 files in all). GREEN but these, each run
alone at d38c247af (`pre`) and at 52f0a1684 (`base`):
- `tests/components/smallPlaceTierNoun.test.jsx`: red at both with the same arm (my predecessor's "the base's").
- `negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors`: red at both with the same named files (the last
  round's; none of mine).
- `generationForkCensus`, `pipelinePinnedMode`: golden-derived, red at the base on purpose (amendment 10).
- `tests/lint/proseWiringCensus.walker.test.js`, arm "the committed census is byte-identical to a fresh build":
  "stale-bytes": GREEN at 52f0a1684, RED at d38c247af (my start tip, before any change of mine) and at mine: A STORED
  FIGURE (the committed census JSON) moved by my predecessor's batch 1 (d38c247af); NAMED, not re-taken (its door
  re-takes it once). Whether my batch moves its bytes further I did not separate (it is stale at both).
- Cured in my own form before the push (laws my first card form turned): `styleShorthandLonghand` (a `border` that
  changed across renders beside `borderLeft`: the card keeps its border and changes only the longhand) and
  `phoneChromeFloor.census` (`ROUTE_BASELINE` floored +2 on three routes from a second copy of the card: the siege word
  is now the same card's span, no new floored line): both green at my tip.

THE BOOKS MY CURES MOVE: none (no stored figure moved by my declared cure among the files read).
Gates: eslint on the touched files 0; `typecheck:domain:strict` and `typecheck:ratchet` exit 0; `layerBoundaries`,
`engineCoreLazyEdge`, `factLayers`, `chainPrintSites`, `presumedThings` green. Manifest entry owed: none (the guard is
under `tests/components`). Goods roster: no new import of a goods module (`foodSurplus.js`, `crisisKind.js`,
`chainWorking.js`, `validationOnPage.js`, `chainStateShown.js` are none of the nine).

## THE 525
0 of the 525 move: no generator, data or record writer changed (display only, and the crime desk's draw-time
disqualifier); the census's 720 records are byte-identical before and after (sha256 of the decompressed corpus,
fdf0bb5d…, the digest my predecessors read).

## Instruments (scratchpad; each is a few lines)
- The census: `census3.sh <tree> <out> 4` from `lane/census-3-2026-11-14`'s probes, git-archived out; `inventory.py`,
  `inventory_diff.py` from the chair's READ-ALL probes.
- The measures (`m/`, each `TREE=<tree> CORPUS=<corpus.ndjson.gz> [DUMPS=<dumps>] node <script>`; `load.mjs` reads the
  corpus): `l6.mjs` (the food-surplus outputs each chain card prints, with the record's surplus and famine), `l3b.mjs`
  (the Full cards under a field-stopping siege and their chain cards' words), `l3after.mjs` (the cards the leaf moves),
  `cl2.mjs` (the crime lines' printing towns against the facts).
- The books: `runall.sh <tree> <label> <list>`: each file alone through `scripts/gate-tail.sh`; `out/<label>/RESULTS`.

## What is left, IN ORDER
1. The TRADE EXPORTS list's "Grain export" where the food record holds no surplus (r2r-town-29: 1 of the 720; the tab,
   the PDF and the journal): the record's export row is written by `computeActiveChains.js :: deriveExportsFromChains`
   through `foodSurplus.js :: goodsHeldByFoodRecord`, whose `FOOD_SURPLUS_GOODS` lacks 'grain export' (a generator's
   file, not mine: the cure at birth is the economy writers'); the display cure is the same rule in
   `tradeListDisplay.js :: exportsAsPrinted` (mine), measured with `m/l6.mjs`'s words over the exports lists.
2. L3b's remainder, by the chair's word if wanted: iron ore in r2s-under_siege-city-3 stays "Fully exploited" beside an
   Impaired mine chain because the smelting and arms chains that take the ore print Vulnerable (a working word); the 3
   Full cards with no chain card on the ground (fish in two thorps, hot-spring minerals) keep their grade.
3. The PDF's Full card under the siege (`viewModelBodySlices.js`) and the siege's chain state on the PDF and the journal
   (named above): one line for their seats.
4. The predecessor's L5 first header flag (the hired forces) is unread; the DEFECON (generators') half is BAR3-DEFECON's.
