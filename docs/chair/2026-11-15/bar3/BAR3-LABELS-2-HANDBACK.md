# BAR3-LABELS-2 hand-back (2026-11-15)

HANDED BACK at 21:08 UTC by file (my count 301,102 at the push: over the 250,000 line). Tip: batch 1, commit
below; after this push I push nothing more.

Seat BAR3-LABELS-2, the DISPLAY half of BAR3-LABELS (BAR3-DEFECON holds the generators' half). Branch
`lane/bar3-labels-2026-11-15`, tip at start 8b45191a5 (read back: as the prompt says); the line's merge at 52f0a1684 was
already in (4decc3acc). Worked in a scratch worktree on my tip, with two detached trees beside it: 8b45191a5 (the census's
before run) and 52f0a1684 (the books' second tree). My predecessor's file `BAR3-LABELS-HANDBACK.md` stays as it is.

## The rulings I worked to
- BRIEF-BAR2 (the method) with BRIEF-BAR3's twelve amendments; the chair's prompt (items 1 to 6, in its order).
- RULING L1c (the chair's, 2026-11-15 20:25 UTC; vetoable by the owner): both facts stand; the label says what the
  hostility is toward; display only.

## Batch 1: L1b, L1c, L3 (display rows), item 4, item 5; all display, the record not touched

Measured on the census's 720 at 8b45191a5 by script over `corpus.ndjson.gz` and the dumps, with the tree's own leaves:

| item | row(s) | the state | measure at 8b45191a5 | cure |
|---|---|---|---|---|
| 1 L1b | (direction) | the reliance row ("Reliance on magic: Relied upon/Integral · supplied by …") named no dependent | 315 rows, all 315 now name theirs | `MagicTab.jsx` reliance row: " · for <names>", from `magicProvisionShown.js :: magicDependentChainsShown` (the one filter `magicDependentsShown` counts, now built on it) and `foodAmongMagicDependents`; each chain through `chainPrintName`; the food supply as the Economics food row names it, `food (<channel> provision)` (`foodBalanceBar.js :: magicFoodChannelWord` over `foodRowShown`'s note) |
| 2 L1c | C36552 C31315 | "Religious acceptance: hostile" (or wary) beside a RELIGIOUS house (live roster, category Religious) among the houses that supply the magic (`facts/magicSource.js :: magicSourceOf`) | hostile prints in 153 (the row's 153): 69 have a religious supplier (63 where the "supplied by" line prints it); wary 104 more | `magicProvisionShown.js :: religiousAcceptanceShown`: "Hostile outside the faith's own houses" / "Wary outside the faith's own houses"; every other word as the profile's |
| 3 L3 | C12020 | under a siege, a flow card printed a working word ("Running", "Entrepôt", "Operational") while the crisis leaf marks the card stopped or every live house of it stopped | 4 cards in 4 towns on the 720 (smuggling ×2, tavern_social ×2); the read town's harbour (bar0-city-under_siege+famine-rand-15, born alone) too | `economicsCrisisMarks.js :: chainCardUnderSiege` (the Economics tab's cards): "impaired" |
| 3 L3 | C7595 C7371 | "✓ Fully exploited Livestock": the card's ground absent | STRUCK as the prompt framed it: every Full or Partial card on the 720 has a held, available ground of its resource (`resourceWorkReading(...).keys`, 0 empty); the 7 cards whose `dependsOn` word names a ground absent or depleted hold the resource on another (the floodplain's livestock; managed forest's timber) that a chain works. THE READ TOWNS' STATE IS ANOTHER: a siege (rand-13) and a war (rand-6): see "What is left", item 1 | none this batch |
| 3 L3 | C3184 | "Needed, and not brought in: copper ore" | STRUCK: all 80 printing towns hold a live Smelter, whose need the record states ("Required by Smelter but not available in … terrain"); trade does not bring it, which is what the line says | none |
| 4 | C6511 | "Trade connectivity: Collapsed" where the Economics tab prints goods arriving | 2 on the 720 (r2r-city-35, r2s-indebted-city-1): NEITHER AT WAR (the premise "a war that is not a siege" is the read town's state, not the class's): the score sinks under many strained transit chains while imports arrive by river | `foundationBandShown.js :: tradeArrivesOnPage`: "Critical" (the scale's next rung; no new word); a siege keeps the siege's own word (its imports list is empty) |
| 5 | C20093 | DS-POW-6 RECOVERING v4 "Criminal money finds little purchase at X: … its officials have little reason to sell" beside an official the page prints "Flaw: corrupt" | 19 printing towns on the 720; 9 with a corrupt official by the exact measure (`corruptOfficialsOf`: "Flaw: corrupt" on a person of category government or military, or of the ruling power) | v4 declares the new fact 'an official who sells' (in pay, the hall held, or a corrupt official); `facts/officialsInPay.js :: corruptOfficialsOf`; the DM's audience only (the same veil) |

Verified in the read towns, born alone at my tip: bar0-city-wartime-rand-6 (trade: collapsed -> critical);
bar0-city-under_siege+famine-rand-15 (Harbour and Maritime: running -> impaired).

Guard: `tests/components/bar3LabelWords2.test.jsx`: 13 NOT pairs over the census's seeds (every one red at 8b45191a5,
run in that tree), KEEP pairs green. The chair's four laws of the test corpus: `negativeAssertionAnchor`,
`seedLoopTotality`, `proseDrawnAnchors` name no line of mine (each red at both trees with the same arms: the last round's
`bar2*` files); the guard finds the crime line by its vid, never by its sentence.

Files: `src/components/new/tabs/MagicTab.jsx`, `src/components/new/tabs/EconomicsTab.jsx`,
`src/domain/display/magicProvisionShown.js`, `src/domain/display/foundationBandShown.js`,
`src/domain/display/economicsCrisisMarks.js`, `src/domain/display/stateProse/crimeLineDisqualifiers.js`,
`src/domain/facts/officialsInPay.js`; tests: the guard, and `tests/lint/factLayers.shared.mjs` (its fact-to-leaf table
gains 'an official who sells' -> `officialsInPay`, the same leaf file: the layer check reads the new fact's leaf as it
reads the other two; no allow-list, no arm weakened).

A first form of the L3 cure lived in `chainStateShown.js` and closed an import cycle
(`chainStateShown -> crisisStoppedRow -> validationOnPage -> tradeListDisplay -> chainStateShown`, `layerBoundaries`
red): moved to `economicsCrisisMarks.js`, which already reads the crisis leaf; `layerBoundaries` green.

## Every new or changed line (the veto list)
- " · for <the dependents>" on the reliance row: r2r-thorp-34 ("for food (magical provision)", a thorp),
  r2r-metropolis-1 ("for Bowyer & fletcher, Timber & Lumber and Spellcasting Services"), r2s-under_siege-town-0
  ("for Hunting & Trapping and food (divine provision)", a siege).
- "Religious acceptance: Hostile outside the faith's own houses": r2r-village-13 (village: the smallest it reaches),
  r2r-metropolis-1 (metropolis), r2s-under_siege-village-0 (a siege). 69 towns.
- "Religious acceptance: Wary outside the faith's own houses": r2r-town-1 (town), r2r-metropolis-0 (metropolis),
  r2s-under_siege-city-0 (a siege). 104 towns.
- A flow card "Impaired" under a siege (for "Entrepôt"/"Operational"/"Running"): r2s-under_siege-hamlet-0 (hamlet),
  r2s-under_siege-metropolis-3 (metropolis), r2r-metropolis-14 (a siege), and the read town's harbour.
- "Trade connectivity: Critical" for "Collapsed": r2r-city-35, r2s-indebted-city-1 (debt), bar0-city-wartime-rand-6 (war).
- RECOVERING v4 struck beside a corrupt official (the slot draws its pool's next admitted line): r2r-town-25 (town),
  r2r-city-6 (city), r2r-metropolis-32 (metropolis).

## Rows named for other seats
- The siege's chain state on the PDF and the Foundry journal: both read `chainStateShown.js :: chainAsShown`, not the
  Economics tab's `chainCardUnderSiege`: `src/pdf/lib/chainStateOnPage.js` and `src/foundry/journalPages.js` (not mine)
  would call `economicsCrisisMarks.js :: chainCardUnderSiege(town, chain, chainAsShown(chain, town))` for one voice.
- `src/domain/magicProfile.js:508` (not mine) writes "Religious acceptance: <word>." into the profile's summary lines; the
  census's dumps print none of it, so no reader met it; if a surface prints it, it wants `religiousAcceptanceShown`.

## THE INVENTORY DIFF (batch 1)
Two census runs of the 720 (before at 8b45191a5; after at my tree), `inventory_diff.py` read whole: gone 1, new 131, in
fewer towns 7, in more towns 5, moved 0. Every loss is EXACTLY its measure:

| sentence | before -> after | measure |
|---|---|---|
| Trade connectivity Collapsed | 2 -> 0 (GONE) | 2 |
| Religious acceptance wary | 161 -> 57 | 104 |
| Religious acceptance hostile | 153 -> 84 | 69 |
| Criminal money finds little purchase (metropolis / town / city) | 7 -> 2 / 6 -> 4 / 4 -> 2 | 9 |
| Entrepôt (the smuggling card's pill) | 211 -> 209 | 2 |
| Taverns & Social Life ... Operational | 131 -> 129 | 2 |

No other sentence prints in fewer towns. NEW: the two qualified acceptance words (104, 69) and the reliance row's names
(" · for …", 129 distinct sentences over the 315 rows; the row's own word and source print as before). THE INHERITORS
READ: the acceptance words and the names, by the same measure; "Trade connectivity Critical" (+2); the tavern card's own
name and need, now beside "Impaired" (+2); and, in the 9 towns that lost RECOVERING v4, the pool's next admitted line,
v2 "The approach was made at X and did not take." with "Prosperity and a working watch did what no investigation did."
(+9): TRUE BY ITS DECLARATION (no official in criminal pay, the hall not held: v2's own disqualifier), and NAMED FOR THE
CHAIR: it stands beside an official the page prints corrupt (corrupt is not bought by the criminals; a reader may still
read it against the flaw: "What is left", item 3).
Worklist rows: C6511 2 -> 0 GONE; C20093 7 -> 2 (the metropolis fold; 17 -> 8 over the three folds); C36552 153 -> 84
(the bare word; the 69 now say what the hostility is toward). C12020, C31315, C7371, C7595, C3184 print in none of the
720 under their folds (verified on their read towns above, or struck).

## THE BOOKS
Run ALONE at my tip, each through `sh scripts/gate-tail.sh` (`runall.sh`): the 85 test files that pin a symbol I changed
(`grep -rlE` of `magicDependentsShown|religiousAcceptanceShown|foundationBandShown|chainCardUnderSiege|flowCrisisMarks|
CRIME_LINE_DISQUALIFIERS|CRIME_LINE_FACTS|crimeLineFactsOf|officialsInCriminalPayOf|corruptOfficialsOf|tradeArrivesOnPage|
magicDependentChainsShown` and the three tabs) and the twenty law suites (105 files). Re-keyed in their own form, beside a
dated note (lines I declared changed, never a law): `tests/components/magicRelianceSource.test.jsx` (the whole reliance
row now carries the names; the arm's subject, the source span, asserted alone too); `tests/domain/crimeLineDisqualifiers.test.js`
(the facts' shape gains `corruptOfficials`, veiled for a player as the other two). RED AT MY TIP, each run alone at
52f0a1684 with the same arm and message: THE BASE'S: `tests/components/smallPlaceTierNoun.test.jsx` ("no place drew the
header"), and the golden-derived `generationForkCensus`, `pipelinePinnedMode` (red at the base on purpose).
(The run's last files: see the next push's line if any differ.)
THE BOOKS MY CURES MOVE: none named yet (no stored figure moved by my declared cure among the files read).
Gates after the batch: eslint on the touched files 0; `typecheck:domain:strict` no regression (1113, ceiling 1113);
`typecheck:ratchet` OK (167, ceiling 167); `presumedThings` green; `chainPrintSites`, `layerBoundaries`, `engineCoreLazyEdge`,
`factLayers` green. Manifest entry owed: none (the guard is under `tests/components`). Goods roster: no new import of a
goods module (`foodBalanceBar.js`, `foodRowShown.js`, `facts/magicSource.js`, `institutionRoster.js`, `presence.js` are
none of the nine).

## THE 525
0 of the 525 move: no generator, data or record writer changed (display only, and the crime desk's draw-time
disqualifier); the census's 720 records are byte-identical at base and tip (sha256 of the decompressed corpus,
fdf0bb5d…, the same digest as my predecessor's).

## Instruments (scratchpad; each is a few lines)
- The census: `census3.sh <tree> <out> 4` from `lane/census-3-2026-11-14`'s probes, git-archived out; `inventory.py`,
  `inventory_diff.py` from the chair's READ-ALL probes.
- The measures (`m/`): `l1c.mjs` (acceptance by supplier), `l1cT.mjs` (the towns the word moves), `l1b.mjs` (the names
  the row prints), `l3b.mjs` `l3c.mjs` (the exploitation cards' grounds), `l3d.mjs` `l3e.mjs` `l3f.mjs` (chain states
  under a crisis, against the houses' marks), `l3g.mjs` (Full cards under a siege), `l4.mjs` (the trade band's
  contributors), `l5.mjs` (corrupt officials in the printing towns), `readers.mjs` `harb.mjs` (the read towns); each
  `TREE=<tree> CORPUS=<corpus.ndjson.gz> node <script>`.
- The books: `runall.sh <tree> <label> <list>`: each file alone through `scripts/gate-tail.sh`; `out/<label>/RESULTS`.

## What is left, IN ORDER
0. (BEFORE ALL, the chair's row of 21:00 UTC) "Grain export" and "Surplus food" (C7514 C18969 C7264): the floodplain
   chain's outputs print in 10 towns of the 720, 8 with no surplus on the food record (`foodSurplus.js ::
   offersFoodSurplus`), 0 under a famine; the grain chain's own surplus outputs are already filtered at birth by
   `foodSurplus.js :: FOOD_SURPLUS_GOODS`, which lacks the floodplain's two words. The display cure: one rule in
   `tradeListDisplay.js :: chainOutputsShown` (a food-surplus or food-export output is not printed where the food record
   holds no surplus or a famine stands); "Agricultural produce" stays, the card is not mute. NOT MADE: my count reached 301,102 at batch 1's push (the meter read late), so this push is my hand-back. Measure with `m/l6.mjs`.
1. L3, the siege's form of "✓ Fully exploited" (the read towns' own state, C7371 C7595): under a siege that stops field
   work (`chainStateShown.js :: tradeStoppedHere`), 14 Full cards in 10 towns of the 720 (fish 6, livestock 3, grain 2,
   iron ore, mountain timber, hot-spring minerals; e.g. r2s-under_siege-hamlet-0, r2s-under_siege-city-3) stand beside
   a chain card that reads Impaired. The cure is `validationOnPage.js :: exploitationCardShown` (the famine's V2 form) and
   a card in `ResourcesTab.jsx`: it needs a stage word ("stopped by the siege" is the Services tab's own): the chair's
   word on whether that is a new word. Fish under an open sea stays worked (`seaOpenTo`).
2. The siege's chain state on the PDF and the journal (named above): one line for their seats.
3. RECOVERING's siblings for the same state (a corrupt official on the page): v2 "The approach was made at X and did
   not take" (the inheritor of v4 in its 9 towns: true by criminal pay, read against the corrupt official by the chair's
   word), and the other pool's v1 "nothing is bought here" and v3 "business with the hall is straight" still read 'an
   official in pay' only: measure their printing towns that hold a corrupt official; re-point to 'an official who sells'
   where the chair rules corrupt is sold.
4. The predecessor's "Left" items 3 and 4 that are the DEFECON (generators') half are BAR3-DEFECON's; L5's first header
   flag (the hired forces) is unread.
