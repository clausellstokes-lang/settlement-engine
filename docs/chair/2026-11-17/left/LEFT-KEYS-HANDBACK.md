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
tanners): base finds 1, tip 2. THE COUNT OVER THE 720 (the render of the base, `runJ.mjs`): 11g reads 0 before and 0 after,
because BAR8-J-ROWS (point 43, on the line) cured the general gap line: r2r-town-13 prints "The tanners are failing: …"
and no longer "No hides reach the tanners." beside it. The audit's base 0cdedd206 was not rendered (the planted page is
the proof the brief allows). Every other rule of runJ is equal, base and tip.

## K6 · three detectors read the old record (commits 9bbc4c19d, f5397562b)

All counts over ONE render of the 720 at the base (PAGE-COPY `census3.sh --count-only`, 4 workers, 1694 s; no file under
`src/` changes, so the page at the tip is the page at the base), each runner from the base worktree and from the tip.

**(a) `run-a.mjs`, the register's reader of a ground (`4r-thing:resource:*`).** The src reader (`registeredWords.js`) is
not this seat's, so the cure is a READING IN THE RUNNER, counted apart (`clearedK6a` in its output): a row stands only
where the town holds the ground in no form (not listed live, not proven there by its own house, `supplyStory.js ::
impliedGroundsShown`; and where listed or proven used up, not told as spent in the cell or sentence that names it, by the
register's own word for it).
- BEFORE 3348 instances in 506 towns; AFTER 1715 in 474. Cleared 1633: 361 held (listed live or proven there), 1272 told
  spent. The brief's managed_forest: 128 towns · 256 instances before, 71 · 71 after (below MEASURE-1's pre-rise 54/170
  in instances). All instances: 13777 -> 12144 (the 4r resource rows alone move).
- FIVE THAT LEFT, read on the page, each TRUE as printed: r2r-metropolis-40 Resources "Managed Woodland" (no forest on
  its land lists; its own house proves the woodland, there); r2r-metropolis-33 Economics chain From "Stone quarry
  (depleted)" (listed depleted); r2r-town-20 "Iron ore deposits (depleted)" (listed depleted); r2r-metropolis-58
  "Fishing grounds (depleted)"; r2r-metropolis-25 "Managed woodland (depleted)".
- EVERY ONE THAT STAYS: `docs/chair/2026-11-17/left/K6a-STAYS.txt` (1715 rows, by ground in its head). Read by
  sample: mostly the register's own withdrawn noise (`PAGE_WITHDRAWN.resource`): the house "Stone quarry" named on its
  card, its Services rows, its person and its Power row (58 towns); the fur caravans' chain line "Furs travel from the
  hunting grounds through trading posts" (130); grove and peat labels the woodland word catches.

**(b) `runC.mjs` `6b-denied`, the forge scene.** A forge scene is denied only where every forge house on the page (the
scene's own makers, `law6.mjs :: GOODS.ironwork.maker`) carries a mark (`law8H.mjs :: cardMark`); `law6.mjs` is not this
seat's, so it is a reading in the runner (`<out>.k6b-cleared.json`). BEFORE 1, AFTER 1: the four towns the chair
probed (r2r-metropolis-45, -53, -59, -6) carry NO `6b-denied` row at the base already (the denial it fed on no longer
prints there: the Resources tab tells the mine as worked out, not "No iron ore reaches the mine."). The one row that
stays, TRUE: r2s-occupied-village-1 "The anvil at Celoichi is quiet more days than it rings, for want of iron." beside its
smith marked "Short of iron.". PROOF, a planted denial: "No iron ore reaches the mine." planted in r2r-metropolis-45's
Resources tab: the base flags "The hammering of the forges echoes through all of Chandraganj."; the tip clears it (the
Blacksmiths, the Smelter and the Specialized metalworkers unmarked, at work on bought-in iron). No instance left on the
720 to read: the five-read is the planted one and the one that stays.

**(c) `law8H.mjs` `8f.chain` (runner `runH.mjs`), RULING BR18.** Not flagged: a chain card Impaired (not Stopped) whose
every "From" ground is printed depleted or exhausted, the trade's material on the record's import list, and a house of the
trade on the page unmarked. BEFORE 5 (5 towns), AFTER 0; no other rule of runH moves (9 -> 4 instances in all). THE FIVE
THAT LEFT, each read on the page and TRUE as printed: r2s-famine-metropolis-1, r2s-famine-metropolis-3,
r2s-famine-village-2, r2s-plague_onset-city-0, r2s-plague_onset-city-3: each prints "Iron & Metalwork Metal is smelted or
worked here." beside the card "Iron & Metalwork · Raw materials & fuel · Impaired" whose From is "Iron ore deposits
(depleted)", each buys "Iron ore (local iron mines exhausted)", its smiths' cards carry no mark, and the crisis (a famine,
an outbreak) cuts no road. NONE STAYS. (Whether the card should SAY it runs on bought iron is BR18's question on the
owner's list: not built.)

## K7 · 8b.extract's two blind spots, and leftMarks M3 (commit 34e2dd5d5)

- (1) `law8.mjs :: ownGroundsOnRecord` (both forms: the page form and the born form `law8Marks.mjs`) reads a proven
  ground's state OFF THE HOUSE'S OWN STORED GAP ROWS (kind `missing` or `imported` naming the ground's yield, from
  `houseKinds.js :: IMPLIED_GROUND` and `crisisDependence.js :: SPENT_GROUND_YIELD`; a venture's row proves nothing), no
  longer through `impliedGroundsOf`. EQUAL to the old reading on every source house of the 720 (785) and the 150 (137).
  PLANTED FAULT: the leaf mutated in scratch (`states.set(ground, 'there')`), the 43 towns whose house proves a used-up
  ground rendered in that tree: the born form at the base finds 0, at the tip 12, the 12 bare quarries (r2r-hamlet-23,
  r2r-town-33, r2r-city-21, r2r-city-59, r2r-metropolis-2, -32, -55, -56, r2s-infiltrated-metropolis-3,
  r2s-plague_onset-metropolis-2, r2s-monster_pressure-metropolis-2, r2s-religious_conversion-hamlet-0); without the fault,
  0. The page form reads 0 in the mutant at both, because the mutant page prints no spent sentence there (its gate).
- (2) the page form's spent sentence: "Nothing more can be taken from the …" OR the house's own "The <house> is/are worked
  out: its own ground is depleted (…)." (its own line preferred as the instance's `against`). PLANTED FAULT: the mine's
  marks taken off in r2r-hamlet-3 (card line, chip, Services row) and the quarry's in r2r-hamlet-23, both towns printing
  only the second sentence: base 0, tip 2 instances each; unplanted 0 and 0. Over the 720 the rule reads 0 before and
  after.
- `tests/domain/leftMarks.test.js` M3's positive reads the Services tab too (r2r-city-20, r2r-hamlet-27 print it there).
  Red in scratch with the sentence taken off the Services tab.

## THE NET (each gate alone through `sh scripts/gate-tail.sh`, at base 70e557d5b and at the tip)

- `npm run typecheck:ratchet`: 167 errors, ceiling 167, at base and at tip. `npm run typecheck:domain:strict`: 1113, ceiling
  1113, at both. `npx eslint` on the 18 changed script and test files: nothing reported (exit 0).
- ALL OF `tests/lint`, at base (a detached scratch worktree) and at the final tip: 218 files, 3226 tests, 69 names red at
  BOTH, THE SAME NAMES AND, after the checkout path is folded, THE SAME MESSAGES (0 lines differ; walkers, registers and
  rosters alike: `negativeAssertionAnchor`, `seedLoopTotality`, `proseDrawnAnchors` list no file of this seat). Every one
  of the 69 is red at the base: named, not chased (stored registers, censuses, rosters, ceilings: the close's).
- The guards (`tests/domain/leftMarks.test.js`, `tests/domain/bar5*`, `bar6*`, `tests/generators/bar5*`, `bar6*`,
  `bar8*`: 25 files, 219 tests): green at base and at tip.
- Every changed test alone: at the tip each is green, except `editCorpusRatchet` (7 of 8: A5 green under the new watchdog,
  the file 634.6 s; A7 red by its stored figure, the same message the close's list records at the base). At the base each
  re-keyed one is red with the message its item names.
- N6: the close's list `close-0-70e557d5b` (part 1, 33 names, as published while I worked) names
  `bar2ServicesRows`, `tailHouses1Gaps`, `needMetUnderAnotherName` and `editCorpusRatchet` A7 of my files: the first
  three are green at the tip; A7 is the stored figure above.
- N5, the scratch merge: the line `lane/join-2026-11-14` is still at 70e557d5b, my base: an ancestor of my tip (a
  fast-forward). CLEAN.

## LEFT BY NAME

- `tests/property/editCorpusRatchet.test.js` A7 (about line 586): "the edits that DO reach a reading: [695, 275, 2176]"
  against the pinned [695, 275, 2173]. A stored figure: the close's.
- The two Fishmonger and two Smelter pairs of `tailHouses1Gaps` (retired): their state (the house lacking its input) is
  borne by no town of the 720 or the 150; a new reachable anchor would need a town on no road, outside these populations.
- The cold forge ("The forges of <town> stand cold: there is no iron left to make blades from.") is printed by no town
  of the 720, the 150 or 180 rww famine towns: its twin is reachable in the data but unanchored by any born town.
- K3's "96 besieged towns": the 720 holds 31 by `config.stressTypes` (the 150, 30). Said so; counted on those.
- K6 (a) and (b) are readings in the runners because the readers they correct live in `src/domain/facts/registeredWords.js`
  (the `resource:` reader) and `tests/helpers/pageLaws/law6.mjs` (not on my list). If the chair wants the reading at the
  source, that is a src change (`registeredWords.js :: RESOURCE_FAMILIES[...].absent` taking the proven grounds) for a
  builder seat.
- K10: not mine (CLOSE-WALKERS).
