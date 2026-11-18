# LEFT-KEYS hand-back (seat LEFT-KEYS, leftovers round; base 70e557d5b, branch lane/left-keys-2026-11-17)

Seat LEFT-KEYS of the leftovers round, also a seat of the close (BRIEF-LEFT's section "LEFT-KEYS", K1 to K6, and the
prompt's additions K5 names, K6 (c), K7, K8, K9; K10 is CLOSE-WALKERS's). NO FILE UNDER `src/` IS TOUCHED. Class of red:
(b), the stale anchor. Every re-key below is BY IDENTITY (R8): the same claim, another anchor, a dated note in the file.
Anchors were searched in the census's 720 (PAGE-COPY `seeds.txt`), then the 150 (`birth3/seeds.w150.txt`), then a
constructed record (said so where used). Each re-keyed assertion was shown RED once in a scratch copy of the tree with
the src hunk it guards reversed (or the old anchor), then GREEN at the tip. No stored figure is re-taken.

## K1 = L11 · four NOT anchors the birth now buys in (commit 0abfd1bf7)

| file · row | old anchor | new anchor and why it bears the same claim | proof it can fail |
|---|---|---|---|
| `tailDefeconBatch3Lines` #20893 (the iron hooks only where the import list holds iron) | r2r-hamlet-30 ("The iron carts are three weeks late"), r2r-city-36 ("A new toll on the iron road"): both import iron ore now | the only two towns of the 720 that print "Imports metals" with no iron on the import list (none of the 150): **r2s-succession_void-hamlet-0** (the iron carts, the same wording) and **r2s-occupied-village-1** (a war the record holds: "War has taken the iron"). The toll's wording is borne by no town that buys no iron. LIVE anchor "Imports metals" kept | `warIronHook.js :: ironHookStands` held open: both rows red (each town then prints that very hook) |
| `bar3Defecon2Lines` C48585 (no carts or rafts that stopped where no timber is imported; the twin prints) | r2r-town-34 (imports Timber now) | **r2r-metropolis-40** (road, no timber import, prints the short twin). r2r-metropolis-2 and r2s-insurgency-city-3 still bear theirs (measured) | `foodBalance.js` guard `!importHeld(facts, TIMBER_IMPORT)` held open: red (the carts line prints there) |
| `w2FixData5Rows` ww-1157 (no war's forge in a famine city with no war) | the liveness sibling "stand cold: there is no iron left to make blades from" at rww-city-famine-1 (it imports iron ore now, so the slot draws the line the cold forge twinned) | **the same town** (it still bears the claim), its liveness sibling re-keyed to the slot's line true there now: "and most of it is the sound of blades being made". The cold forge is borne by NO town to key it to: none of the 720, the 150 or 180 famine towns of this family (`rww-<town\|city\|metropolis>-famine-0..59`) prints it | the war line's gate opened to any crisis (`arrivalProse.js`): red (the town prints "Every forge you pass is making something meant for a war") |
| `foundryExportsFishTrade` F11 (no fish source, none bought in: the Fishmonger carries fish from the cart) | soak1k-1652 (imports "Salted fish" now) | **A CONSTRUCTED RECORD**: no Fishmonger stands without fish in the 720, the 150 or soak1k-0..2999 (a fish buyer on a road buys it in). soak1k-1652 with its one fish import struck (its own food is game), read through the very leaf the assembler applies after the draw (`fishTradeTwinned`); the born town's net line kept beside it as the positive | `fishTradeTwinned` an identity: red |

## K2 = L12 · `tests/data/tailHouses1Gaps.test.js` (commit 8c6cb4271)

The supply rule buys in (or finds) the input of 23 of the 31 RED pairs: their house's gap is `imported` or gone. A pair
re-keys only where a town holds THE SAME HOUSE with its gap still `missing` AND DRAWS THE SAME TEXT'S REWORDING, word for
word (checked on the whole description, not the opening alone). THE COUNT, in the file's head: 19 pairs (8 kept as they
were, 11 re-keyed), 12 retired, of the 31.

| house · old text | old anchor | new anchor |
|---|---|---|
| Potter "Wheel-thrown pottery…" | r2r-village-4 | r2r-town-54 |
| Potter "Throws pottery at the wheel…" | r2r-town-17 | r2r-city-48 |
| Potter "Domestic ware thrown…" | r2r-village-27 | r2r-village-34 |
| Brickmaker "Moulds and fires clay bricks…" | r2r-town-10 | r2r-city-48 |
| Brickmaker "Shapes and fires clay…" | r2r-town-45 | r2r-city-49 |
| Brickmaker "Clay is moulded and fired…" | r2r-town-28 | r2r-town-54 |
| Dairy farmer "Keeps cattle or goats…" | r2r-hamlet-12 | r2r-hamlet-56 |
| Salt works "Evaporation pans or brine processing…" | r2r-city-22 | r2r-metropolis-58 |
| Charcoal burner "What they make feeds the hottest fires…" | r2r-town-17 | r2s-occupied-metropolis-3 |
| Sawmill "It lifts what building…" | r2r-village-14 | bar0-village-calm-rand-40 (of the 150; the file's birth gains the census's `bar0-` arm, seedcfg.mjs's shape) |
| Tannery "Converts hides into leather… Foul" | r2r-village-9 | r2s-plague_onset-village-2 |

RETIRED (borne by no town of the 720 or the 150; listed in the file as they stood, with the note): Dairy farmer at
r2r-village-14; Salt works at r2r-village-36, r2r-town-29, r2r-hamlet-18; Charcoal burner at r2r-hamlet-9; Sawmill at
r2r-village-6, r2r-village-4; Tannery at r2r-village-14; Fishmonger at r2r-village-49, r2s-succession_void-village-0;
Smelter at r2r-city-5, r2r-city-36. NO FISHMONGER AND NO SMELTER LACKS ITS INPUT in either population, so those two houses
keep no RED pair (every other house keeps one at least). Proof: the 11 re-keyed pairs' old texts put back in the data
(`institutionDescVariants.js`, `institutionalCatalog.js`, `institutionDescColour.js`) in scratch: all 11 red, the 8
untouched pairs green.

## K3 = L14 under BR12 · the besieged KEEP rows (commit 51c5f4ed5)

- `displayEconCrisisMarks.test.jsx`: KEEP ['r2s-under_siege-city-0', 'Iron & Metalwork Metal is smelted or worked
  here.'] RETIRED (BR11, BR12, dated note). PINNED on the same anchor (a NOT row, whose instead feeds TWIN): the unmarked
  line absent, "Iron & Metalwork Curtailed by the siege. Metal is smelted or worked here." printed. The line keeps a KEEP
  row in a state that cuts no supply: **r2r-city-31** (no crisis, its iron its own, none bought in).
- `displayEconRelianceFoodWords.test.jsx`: KEEP ['r2s-under_siege-metropolis-3', 'economics', 'Contributes to Iron &
  Metalwork - 2% of income'] RETIRED (BR11, BR12). PINNED on the same anchor (a NOT row): the card's share absent (the
  record still holds 2%), its liveness sibling the share's own mark "Iron & Metalwork Curtailed by the siege. Short of iron
  ore.". KEEP row of the same line in a calm state: **r2r-city-6** ("Contributes to Iron & Metalwork - 5% of income").
- THE COUNT over the besieged towns (Economics tab rendered as the tests render it): **the 720 holds 31 besieged towns,
  not 96** (by `config.stressTypes`; the brief's 96 does not match what I measure): 15 print the Iron & Metalwork share
  marked "Curtailed by the siege.", 16 print no such share, **0 bare**. The 150: 30 besieged, 16 marked, 14 none, **0
  bare**. No besieged town prints "Contributes to Iron & Metalwork". NO FAULT TO NAME.
- Proof: `crisisStoppedRow.js :: houseDependenceIn`'s siege readings switched off in scratch: both pins red; the calm KEEP
  rows green there too.

## K4 · `needMetUnderAnotherName` (commit a817ad81a)

r2r-town-17's mountain timber is bought in now (met). Re-keyed to **r2r-village-3** (road, no crisis), one of the 720's
five towns that print `mountain_timber` needed with no import meeting it under any name. Proof: `needMetBy` answering
every timber need met: red.

## K5 · the anchors the whole check named (commits afdc373cb, b112c6ccc)

- `corpusEcoTailGuards` DS-ECO-12 "a house needs what the land lacks" at r2r-hamlet-12: the town no longer reads the pool
  (its critical imports are stone and salt now, the terrain's form). NO BORN TOWN BEARS THE CASE: no town of the 720 or the
  150 reads this pool for a good a live ground of its own land gives in part (measured over every town that reads it).
  **A CONSTRUCTED RECORD**: r2r-village-4 (a Dairy farmer beside live grazing land, the pool's v2 drawn there) with
  livestock "Required by Dairy farmer but not available in Plains terrain" put first among its critical imports (a
  `CONSTRUCTED` table in the file, applied after the birth). Its owner's read then prints "A good part of the livestock
  Huaji's work uses must come from elsewhere; …". Proof: v2's old "Whatever {good} …" restored in
  `economy.generated.js`: red.
- `bar2ServicesRows` SV1 MARKED, r2r-town-45's mine row: its Mine works a LIVE GEMSTONE SEAM beside its spent iron, and a
  mine is worked out only when every ground of its own is spent (BIRTH-3's AMENDMENT 2 (A), LEFT-MARKS M5): the bare row is
  TRUE, the anchor stale. Re-keyed to **r2r-town-12** (its one seam, iron, spent; "Iron ore (local iron mines exhausted)"
  bought in for its Blacksmiths and Smelter), whose row prints "Short of iron ore.". Proof: a taker on a spent ground read
  at work (`supplyStory.js`): red.
- `bar3ServicesRows` MARKED, bar0-city-under_siege+famine-rand-9's wine row: it is NOT bare: it prints "Table wine
  Curtailed by the siege. House wine by the jug or bottle." (the grapes are bought in now; under the siege a house on a
  bought input is curtailed, S1 (i)). Re-keyed on the same anchor to its true mark; r2r-city-48 keeps "Short of grapes.".
  Proof: S1 (i) off on the service row (`serviceRowDependence`): red.
- The other names of the comparison (r2r-village-11's fish row; r2r-town-29, bar0-metropolis-calm-rand-8) were already
  re-keyed on the line by BAR8-FISH-ROWS: green at the base, untouched.

## K8 · BR22 (commit 0a3b0781c)

`tests/property/editCorpusRatchet.test.js` `ARM_TIMEOUT` 600_000 -> 1_800_000 with a dated note of the measures (569 to
602 s quiet, 657 s slower, green in 602 s under a one-hour limit at 3b06c724b). No assertion changes. NOT MINE AND LEFT:
the close's list at the base names A7 red by a stored figure ("the edits that DO reach a reading: [695, 275, 2176]"
against the pinned `[695, 275, 2173]`, about line 586): a figure, the close's.

## K9 · rule 11g's plural (commit 557e426a4)

`tests/helpers/pageLaws/law11Supply.mjs` (the 11g arm, about line 342) reads the story line's verb in both numbers ("is/are
worked out:", "is/are failing:", "stands/stand abandoned"). Planted page of two story lines (a singular quarry, the plural
tanners): base finds 1, tip 2. The count over the 720 at the base: below.
