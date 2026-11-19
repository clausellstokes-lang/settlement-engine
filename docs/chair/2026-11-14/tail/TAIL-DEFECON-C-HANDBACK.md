# TAIL-DEFECON-C · hand-back (kept current after every commit)

Seat: TAIL-DEFECON-C (builder), the third seat of the DEFECON group, split by file. Branch
`lane/tail-defecon-c-2026-11-14`, cut from `lane/tail-defecon-2026-11-14` at **345f13157** (the first seat's tip);
merges nothing. Files: `src/generators/computeActiveChains.js` whole, and the ONE call of
`deriveLocalProductionFromChains` in `src/generators/economy/economicState.js` (~739). Tests.

## The rulings worked to (the chair's, 2026-11-14; each vetoable by the owner)

- (D1) AN INCOME ROW IS BORNE OUT BY THE PAGE: … "Armed escort & mercenary hire" where no company stands (240).
- (D2–D5) as in `TAIL-DEFECON-HANDBACK.md` (one home for one fact; the siege twins; the defence rating's rebuild not
  touched; the defence lane's measured rows). None bore on this file's rows.
- (D6, 23:17 UTC) THE "MADE HERE" LIST IS NOT WHAT THE TOWN'S HOUSES MAKE. Two cures granted (RECORD-MEASURE-1 rows
  c1, c2): C1-A (step 1 asks the export's own RESOURCE_EXTRACTION_GATES; step 2 keeps a chain only where a house of
  THIS town processes it, read through `institutionalCatalog.js :: isFabricInstitution`, not the patch's regex) and
  C2-A (the seven category keys leave the made list). localProduction ONLY moves; another family moving is a STOP.
- (D15, 00:41) with C1-A, the made list against the exploitation record, before and after (below, THE PAGE).
- (D18, D19, 00:45) the export side (C1-E) and the airship docks: NOT BEGUN, first in WHAT IS LEFT.
- (D7, 23:41) C1-A's gate: THE SMITH'S IRON STAYS: a good is made where a house that WORKS it stands (smith, forge,
  smelter), not only where one digs it; widen the gate so `economicsProducedLocally.test.jsx`'s hamlet anchor stays
  green UNCHANGED. The thorp anchor: if it anchors a good whose maker stands on the roster, the gate is wrong; if a
  good no house makes, re-key it by identity and name what prints instead. The golden and coherenceAgreeCures' gate
  tally are NAMED, not re-taken.
- And BRIEF-TAIL's laws (silence is true; a mute state takes a twin; no draw moved; siege/famine; one home; no new
  vocabulary word; no `src/pdf/` or `src/foundry/`; every new line listed for the veto).

## Commits

| commit | what | record move (births-only field diff on the 720) |
|---|---|---|
| **10e1cf0ea** C2-A | the made list keeps none of `trade access`, `maritime access`, `Toll income`, `Market taxes`, `luxury`, `Strategic control`, `water` (a declared set of seven) | 302 towns, ONE family: `economicState.localProduction` (the measuring seat's count exactly) |
| **358d6afea** C1-A | a good is made where a house that digs it or works it stands (below) | 375 towns over C2-A (543 over the base), ONE family: `economicState.localProduction` |
| **e44627128** batch 3 | row 03905 (the hire service needs a company for hire); WORKLIST3 15738 / 11365 / 31448 (the external-mill note reworded) | 95 towns, 3 families: primaryExports 55, institutionalServices 55, activeChains 40 (externalMillNote) |

### C2-A (10e1cf0ea)

Lost: trade access 180, luxury 105, maritime access 70, Toll income 68, Market taxes 54, water 16, Strategic control 14.
Gained: "Cut gemstones" in r2r-town-14 and r2r-town-53, a Jeweller in both (no longer folded by the catalog into
"luxury"). classes.mjs: c2 302 -> 0; c3 94 -> 65; c1 522 -> 521.

### C1-A (358d6afea), with D7's widened gate

`deriveLocalProductionFromChains` takes the roster (economicState.js's one call passes `institutions`; the world
pulse's re-derivation, `resourceDynamicsKernel.js:575`, passes none and keeps the land's reading: NAMED, its file is
not this seat's).
- Step 1, the land: the export's RESOURCE_EXTRACTION_GATES, widened FOR THE MADE LIST ONLY by the houses that work the
  good (`MADE_HERE_WORKING_HOUSES`): iron + `smith`, `metalworker`; precious metals and gemstones + `jewel`. Every other
  gated row already names its working houses. The export gate itself is not widened.
- Step 2, the chains: only where a house of this town processes the chain (`isFabricInstitution` drops "Access to …",
  the dwellings, the water).
- Step 2, BEYOND THE PATCH (the inheritors read): with the patch's two steps alone, the catalog-collapsed chain outputs
  came through FALSE in 40 towns ("Quarried stone" 23 where a Brickmaker runs the stone chain; "Milled lumber" 7 where
  a grain Mill runs river milling; "Game meat" 6 by Butchers; "River fish" 4 with no fisher). A gated output is now made
  only where its maker stands: the export's own CHAIN_OUTPUT_INST_GATES, reading 'tannery' as any tanner and
  'blacksmith' as any smith, and two worked goods (boots by a cobbler; precious metals by a jeweller or metalworkers).
  After it, 0 false inheritors (one gain: "Boots and shoes", r2s-wartime-town-1, a Cobbler's guild there).

THE NUMBERS WITH THE WIDENED GATE (classes.mjs on the record; base -> C2-A -> C1-A): **c1 522 -> 521 -> 442** (the
patch as it stood: 469); **c2 302 -> 0 -> 0**; **c3 94 -> 65 -> 30**. iron/metal 69 -> 0 (lost only where no mine,
smelter, smith or metalworker stands; 95 towns keep iron), religious services 89 -> 0, education 119 -> 37, gems
102 -> 51, leather 55 -> under 15, flour/bread 49 -> 43, textiles 31 -> 17. Left, NOT this cure's: coal 116 and peat 94
(ungated by design), the export side (toll 73, hospitality 30, sea salt 21), houses the class's table does not know.
PRINTED: see THE PAGE below.

D7's anchors (`tests/components/economicsProducedLocally.test.jsx`): the hamlet ("… its smith's iron stays") GREEN
UNCHANGED. The thorp (rw3-thorp-calm-2) anchored "timber" (managed_forest; no sawmill, woodcutter, charcoal burner or
carpenter: a good NO house makes) and "luxury" (a category key): RE-KEYED BY IDENTITY: the record no longer lists
either; the anchor keeps "Religious services" and "Education (basic)", which the record still lists because the
thorp's OWN Wayside shrine is a processor of the parish chain (not an "Access to …" row); the pills print "Honey and
beeswax", "Foraged goods" as before. Also re-keyed by identity (C2-A): `tests/domain/resourceDynamicsApply.test.js`
"refreshes terrain production…" (gemstone_deposits' only commodity was "luxury"; the anchor now adds precious_metals,
"gems").

Read and judged true (lost where a house of a near name stands): animal hides/game meat beside a Shepherd or Butchers
(neither hunts); Flour and meal beside a Maltster; "Religious services" in 4 hamlets with a Wayside shrine (the parish
chain there lists the parish church alone as processor); "Hospitality for travellers" in r2s-monster_pressure-hamlet-1
(the pilgrimage chain's, run only by the neighbour's church). SEEN, NOT CURED (1 town): r2r-town-2 loses "salt" with a
Salt works standing (the salt came bundled with fishing_grounds' catch, gated by the fishers).

### Batch 3 (e44627128)

- **03905** "Armed escort & mercenary hire" / "Military contract services": the military service row now
  `requiresAny` a mercenary quarter, a free company hall, a hireling hall or hired blades. 240 towns held it; 55 stand
  no such house (cities 37, metropolises 18): exactly those lose it. INHERITOR, NAMED for `economicState.js`'s seat:
  its own military-export branch (~587) now exports in 8 of the 55 "Military services — garrison contracts and armed
  escort" (6) / "… standing army leasing, siege engineering, garrison contracts" (2).
- **15738 (HIGH), 11365, 31448** the external-mill note: "Grain is processed at the lord's mill under feudal monopoly
  (banalité). Local food security is maintained but surplus flour cannot be exported: the mill toll takes any surplus.
  Without the lord's mill, there would be no flour at all." Prints in 40 towns (15 thorps, 25 hamlets): no lord, manor,
  steward or reeve in 36; flour on the made list in 39; a siege or famine in some (the HIGH reader's r2r-hamlet-0 at a
  61% gap under siege). REWORDED in all 40 (no town silenced).

Guards: `tests/generators/tailDefeconMadeList.test.js` (24: 20 GONE red at 345f13157, 4 WORKED green before and
after); `tests/generators/tailDefeconServiceLines.test.js` (8: 6 GONE red at the base, 2 KEEP).

## The veto list (every new or changed line)

- (40) "Grain is carried out of the settlement to be ground, and the toll taken there leaves no surplus flour to sell
  on." — r2s-plague_onset-thorp-2 (thorp 9, plague_onset); r2r-hamlet-52 (hamlet 99); r2r-hamlet-0 (hamlet, under
  siege). Prints on the PDF's Services section (`src/pdf/sections/Services.jsx:228` reads `chain.externalMillNote`).
- No other new line. C2-A, C1-A and 03905 only remove items from lists.

## THE PAGE (one census before at 345f13157, one after at 358d6afea: C2-A + C1-A; batch 3 is measured on the record only)

`census3.sh` both exit 0; `inventory.py`: sentences 29,887 -> 29,872; `inventory_diff.py`: gone 31, new 16, fewer 13,
more 19, moved 1. The made list prints as pills, which the inventory folds into one token per town ("waterdates" ->
"dates"), so the class counts are the measure (`pageprint.mjs`, base -> after): **c1 printed 452 -> 389** (the patch as
it stood: 403); **c2 printed 302 -> 0**; **c3 printed 52 -> 12** (the patch: 12). Every GONE/NEW/FEWER/MORE row of the
diff but three is such a pill fold. The three:
- "Produced locally" 658 -> 657: r2r-village-5's row is silent. Its record keeps "medicinal herbs", "salt", "River
  craft", "Cargo barges", which the row's own filter does not print; it lost "fish" (fishing_grounds, no fisher: a
  River ferry only, which that gate does not count) and "timber" (shipbuilding timber, no sawmill, carpenter or
  shipyard). Silent and true.
- "Patron deity" and its two upsell lines 717 -> 716 (r2r-thorp-0): A RENDER FLAKE. Re-rendered alone at 358d6afea, that
  town's page is byte-identical to the base.
- THE INHERITORS (36 folds, each one town to four): all pill folds of goods the town's houses make (read by the record
  diff above: 0 false inheritors).

D15 (the chair's measure, from TAIL-DISPLAY-CIVIC: "No one here works the {raw} near {place}" against the made list):
towns whose made list holds a raw that `resourceAnalysis.exploitation.unexploited` names: **base 242 towns (273 raws) ->
C2-A 242 -> C1-A 123 (142)**; batch 3 leaves it at 123. LEFT, by raw: medicinal herbs 46, animal hides 33, wool 29,
timber 29, clay 5. Why: herbs (foraging), wool and hides (grazing land, camel herds), clay (river clay) are ungated by
the extraction table (gathered or herded, no house digs them), and where timber stays a gate house stands (a carpenter
or charcoal burner) while the exploitation record asks for a processor of its own (a sawmill's chain). The two
records ask different questions: the made list asks "is it gathered or worked here", exploitation asks "is it
processed here". Making them one is the next cure's: gate those goods by exploitation's processors, or reword the
"No one here works …" line to "no one here processes …". Not taken here.

## Rows named for other files · registers stale · guards owed

- **28528** "Waterborne freight services (cargo, pilotage)" exported under a siege: the services carry no stress, and
  the call that would pass it is `economicState.js`'s (not this seat's lines). On the record: 3 sieged towns export a
  waterborne service: r2s-under_siege-city-0 and -metropolis-1 (ports, "Maritime services"; the naval route the
  chain exports also keep under a siege), r2s-under_siege-metropolis-3 (river, FALSE). Cure: in economicState.js, the
  service exports take the chain exports' siege rule.
- WORKLIST3 09148, 09208, 09296, 09508, 09234, 09214, 09511 (1 town each): "Waterborne freight services" in a
  metropolis on a road with no water route: the service follows a Docks/port house the roster should not hold there
  (RECORD-MEASURE-1 class b1, 16 metropolises): NAMED for the roster's group. 09013 (fish exported under a fish
  famine) and 09282 (pilgrim trade under a plague): the export list's crisis rule (`deriveExportsFromChains` +
  economicState.js's tier goods): NOT TAKEN (budget), measured 1 town each by the readers.
- `economicState.js` ~587: the military-export inheritor above (8 towns).
- `resourceDynamicsKernel.js:575`: the world pulse re-derives the made list with no roster, so a resource event
  restores the land's reading (C1-A off) until the next birth. Pass `settlement.institutions` there.
- REGISTERS NAMED STALE (re-derived at the close): the presumed-things register, first-register stale 2 (the two
  retired banalité literals, 2aaeb82d8032d31f, 26f1ab483e468e4b; fresh stays 147); the page-census grid's 2 falls
  (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a, stale low, as at the base); the golden master (the owner's door).
- CARRIED reds (red at 345f13157, the same after): generatorGoldenMaster, worldFactRederive A7, coherenceAgreeCures x2
  (the gate tally), urbanBandInstitutions G3 (flaky; it passed in one of three runs)/G5, recordRegisterTotality A7 x2.

## TAIL-DEFECON-C-2 (the successor seat, 2026-11-15, from fb341090c): D18 and D19 DONE

Same branch, same files. Worked to D18 and D19 (the chair's, 2026-11-15; each vetoable by the owner) and to the chair's
02:03 notice (push each batch with WHAT IS LEFT current; hand back at the mark; one line at the hand-back).

| commit | what | record move (births-only field diff on the 720, over the commit before) |
|---|---|---|
| **a10a457e2** C1-E (D18) | a good is exported only where a house that digs, makes or works it stands | 166 primaryExports, 8 arrivalScene, 7 economicComplexity; NO income, prosperity, import, chain, made-list or trace field (the measuring seat's figures exactly) |
| **e6700483b** D19 | an air dock's docks: "Airship freight services (cargo, mooring)" | 11 primaryExports, 11 institutionalServices (output and exportLabel only) |
| **28f86423c** D25 | "Salt for preservation" (the same salt) exported only where a salt works stands | 21 primaryExports, 7 history.founding, 4 incomeSources (Salt Sales) |

### C1-E (a10a457e2)

- ONE TABLE, `GOOD_WORKING_HOUSES` (good to the houses that work it), read id-first through `institutionMatchesGate` on the
  town's own houses (`isFabricInstitution` rows left out), by all three export steps of `deriveExportsFromChains` AND
  by the made list: C1-A's `MADE_HERE_OUTPUT_HOUSES` (boots, precious metals) moved into it unchanged. The made list
  asks the table only for the outputs the export gates by a house, as before, so it does not move. Coal and peat are
  not named. The defended pass's goods are not asked (the pass is its toll's house). Step 3 asks the table only for a
  toll (a transit good passes untouched; a toll on it is earned).
- Against the patch's regexes, the keywords match the same catalog houses, with two exceptions: "sage" no longer
  matches "Message network (high magic)", and flour's "mill" is the export's own mill gate, which also admits a
  sawmill (no town on the 720 exports flour by a sawmill alone).
- classes.mjs / c1members.mjs: **export side 316 -> 193 (208 -> 57 w/o coal/peat)**; c1 442 -> 372; made side 343
  unmoved; b2 12 -> 11. Left (the measuring seat's reading: worked): jewelry 34, beams/planks 12, the pass's toll 11,
  books 2.
- Lost: Toll revenue 57, Barrels 28, Pilgrim hospitality 26, Sea salt 21, Bows 9 / Arrows 7, arms 7+7, Flour 7,
  Toll income (transit) 7, Glassware 6, Glass blanks 5, Dyed cloth 5, ships 4, Camel leather 1, Fine textiles 1.
- THE INHERITORS, every one read: 48 goods in 41 towns (the commit body's "45 in 39" is a miscount; this is the
  figure). They are true where read (the house stands), with two exceptions, NAMED:
  - **"Salt for preservation" in 21 towns** took Sea salt's place: the flats' second trade good, the same salt, and
    no salt works stands. That was a stop under D18 (gating it moves income and founding). The chair RULED D25
    (02:10): the gate covers it, as its own commit: **DONE, 28f86423c** (below).
  - **"Beer (barrel)" in r2r-town-53**: the brewing chain is processed there by a Cooper. Its sibling "Ale (barrel)"
    was already exported at the base. This is the chain-processor class, not the table's.
- Guard: `tests/generators/tailDefeconExportSide.test.js` (18 GONE rows red at fb341090c, each naming a good still
  exported; 11 KEEP rows and a coal row green before and after; a plant that removes the pass's exemption reds its
  KEEP row). Re-keyed BY IDENTITY: `economicsGoodsPillsBorneOut.test.jsx` "books by Glassmakers alone …": its anchor
  now anchors the glass and the spices, and that the record no longer exports the books.

### D19 (e6700483b)

- The 11 towns (all metropolises): r2r-metropolis-9, -12, -41, -43, -44, -51, -56; r2s-occupied-metropolis-0,
  r2s-politically_fractured-metropolis-1, r2s-succession_void-metropolis-2, r2s-monster_pressure-metropolis-2. Each
  holds "Airship docking (high magic)" and has no water (`factsOf(...).water.kind`). The airship override in
  `steps/cascadePass.js` seats "Docks/port facilities" there, which is how the air dock reaches the row's 'docks/port'
  pattern.
- The twin applies where an airship dock stands and no house works water but the docks and the harbour master (no
  ferry, barge, shipyard, boatyard, fisher's landing or fishing community). On the 720 that is EXACTLY the
  water-none set. The 8 airship metropolises on a river or a sea keep the water's word.
- "Port Revenue", the income row, is NOT renamed: an air dock is a port, and a rename would move the income family.
- WHAT ELSE READS THE SERVICE'S NAME: the export list (the Exports pills, the PDF's and the journal's trade lists);
  EconomicsTab's Economic Flows card (output and export label); generationCoherence.js's refusal check through
  `serviceGoodOfExportLabel` (the twin now maps to its output); recordRegister (keys by `label`, unchanged);
  institutionRename (by `institutions[]`, unchanged). No other source spells the literal.
- Guard: the D19 block of the same test file (3 AIR rows red at a10a457e2; 3 WATER rows green before and after).

### D25 (28f86423c)

- `'Salt for preservation': ['salt']` in the table. Over e6700483b: 21 primaryExports; 4 incomeSources ("Salt Sales"
  leaves r2r-thorp-24, r2r-village-5, r2s-indebted-village-3, r2r-town-4); 7 history.founding. In 5 of the 7,
  "grew around salt workings that made everything they touched last longer …" leaves a town with no salt works
  (r2r-hamlet-1, -11, r2r-town-4, r2s-monster_pressure-thorp-0, r2s-religious_conversion-village-1). In 2 the reason
  moves between harbour reasons (r2r-hamlet-47, r2s-infiltrated-thorp-1; a deep harbour stands in both).
- Inheritors (4, all true): River barges by a Shipyard, Barrels by a Cooper, jewelry by Specialized metalworkers,
  News by a Town crier.
- Guard: 3 GONE rows in `tailDefeconExportSide.test.js` (red at e6700483b). RE-KEYED BY IDENTITY:
  `incomeRowsBorneOut.test.js` "r2r-thorp-24 … titled Salt Sales". The thorp now sells no salt: its row asserts the
  rents and neither a Salt Sales nor a Fish row. The claim moves to r2s-succession_void-town-0 (a Salt works, no fisher),
  and the file's birth helper takes the census's r2s arm.
- THE SALT-WORKINGS FOUNDING, NAMED for the founding's file (not this seat's): the reason "grew around salt workings"
  is drawn from the exports, not from a salt works. With D25 it leaves the 5 towns above. Whether it still prints
  where no salt works stands is not measured here.

### The veto list (successor's)

- "Airship freight services (cargo, mooring)" (an export pill; the service card's output "Airship freight services"):
  11 metropolises, e.g. r2r-metropolis-9, r2s-occupied-metropolis-0 (an occupation), r2s-monster_pressure-metropolis-2.
  D19 reaches only metropolises; no siege or famine is among the 11. C1-E adds no line (it only removes goods).

### Gates (both commits)

Focused files (45 files, 712 tests, before and after C1-E; 14 files, 205 tests for D19): the one new red re-keyed.
Carried at the base: worldFactRederive A7, coherenceAgreeCures x2, urbanBandInstitutions G3/G5. domain-strict
1113/1113; type ratchet 167/167; eslint clean; presumed-things `--check` as at the base (fresh 148, first-register
stale 2, exit 1 at the base too); grid 2 falls as at the base. The golden master moves (the owner's door): not re-taken.

### THE PAGE (one census before at fb341090c, one after at e6700483b)

`census3.sh` both exit 0 (before at fb341090c, after at e6700483b: C1-E + D19; D25 at 28f86423c is measured on the
record only). The tabs (`inventory.py`): sentences 29,872 -> 29,873; gone 11, new 12, fewer 19, more 24, moved 1. The
exports (`SURFACES=PDF,Journal`): 35,779 -> 35,784; gone 86, new 91 (almost all "Exports: …" list lines).
- LOST, each a cured good or a pill fold: Pilgrim hospitality 77 -> 56 (PDF 79 -> 56), Sea salt 43 -> 26 (48 -> 28),
  "Waterborne freight services (cargo, pilotage)" 68 -> 57 (D19), "Top export: Sea salt" 15 -> 5, "Dyed cloth EXPORT"
  8 -> 3, the glass-sand card's "Partial" 5 -> 0 (the glass blanks export was its only working).
- SILENCED LINES READ: "Also earned, with no share recorded: Tolls, taken at the gate on the road traffic." 9 -> 7
  (r2r-town-20, r2s-plague_onset-town-1: "Town walls" and no gate house, the record's own no-gate reading, so the
  silence is true). The export-count lines ("Buyers from outside come to <N> for more than # thing" 89 -> 87; "There is
  always something going out" 92 -> 90) follow the shorter lists.
- THE INHERITORS (33 on the tabs, 121 on the PDF/journal), READ:
  - "Salt for preservation" (17 tabs / 20 PDF), "Top export: Salt for preservation" 10, and "Most of what it sells is
    salt for preservation" 9 are the salt twin that D25 (28f86423c) takes off the record after this census's tree.
  - "Airship freight services (cargo, mooring)" 11 (D19; the veto list).
  - "Subsistence — survival economy" 7 (the complexity label reads the exports: thorps and hamlets whose only export
    was unworked) and "gets by on a subsistence living" 2.
  - The glass-sand card "Unexploited / Needs: Glassblower / No # here works the glass sand near <N>." 5: true (no
    glassblower).
  - "Ask what this thorp sells and you get # answer" 3; "Rare spices and exotic dyes (transit)" 4 (merchant guilds'
    entrepôt).
  - The arrival lines: "Flour dust lies pale on the doorsteps" (r2r-city-57: Mills, Bakers), "Nets hang drying on
    poles" (r2r-hamlet-21: a Fisher's landing), "Curls of shavings … from a carpenter's bench" (r2r-thorp-41: a
    Woodcutter's camp, a near reading). Each house stands.
  - Pill folds of goods still exported ("Grain surplusHealing waters (bottled)", "Healing waters (bottled)Coal").
  - 0 false inheritors besides the salt twin, which D25 cures.

## What is left of this file's rows (HANDED BACK at the budget, 2026-11-15 ~01:25 UTC, by time: ~70 minutes)

(UPDATED by TAIL-DEFECON-C-3, 2026-11-15: items 1 and 2 of the list below are DONE under D30, ea788e17c and
6ce176aff: see the TAIL-DEFECON-C-3 section at the end, whose WHAT IS LEFT is the current one.)
(UPDATED by TAIL-DEFECON-C-2: items 1 and 2 are DONE, a10a457e2 and e6700483b, and D25 at 28f86423c, above. The chair,
02:10: no successor is seated for `computeActiveChains.js`. WHAT IS LEFT OF IT, widest first, each measured on the
census's 720 at 28f86423c's record:
1. THE MADE LIST READ BY THE WHOLE TABLE (localProduction, NOT GRANTED: a move of the made list's family). It lists
   goods the export now refuses: barrels 44, flour 37, bows/arrows 17, textiles 16, dyed cloth 15, hospitality 11,
   arms 8, glass 7, ships 6. Cure: `outputMadeHere` asks `GOOD_WORKING_HOUSES` for every good it names, not only
   the export-gated ones. The measuring seat called the table "the natural gate" for this.
2. THE GATHERED AND HERDED GOODS left ungated (D15's remainder: herbs 46, hides 33, wool 29, timber 29, clay 5). The
   made list and the exploitation record ask different questions. The next cure is the chair's call.
3. COAL 116 / PEAT 94 (made) and 102 / 42 (exported), ungated BY DESIGN. Re-deciding them is the chair's.
4. THE EXPORT SIDE'S 57 left, judged worked: jewelry 34, beams/planks 12, the pass's toll 11, books 2.
5. THE CHAIN-PROCESSOR CLASS: a chain kept by a processor that does not make its outputs (a Cooper's "Ale (barrel)" /
   "Beer (barrel)" in r2r-town-53; not counted wider).
6. The export list's crisis rule (09013 fish under a fish famine, 09282 pilgrims under a plague: 1 town each, in
   `deriveExportsFromChains` with economicState.js's tier goods). Under widest first it waits.
NOT THIS FILE: 28528 (the services' siege rule, economicState.js); WORKLIST3's b1 roster rows; resourceDynamicsKernel.js:575's
roster; the salt-workings founding (above); "Port Revenue" for an air dock (left, by design: an air dock is a port).)

FIRST, the chair's two rulings that arrived at 00:45:
1. **(D18) C1-E IS GRANTED: THE EXPORT SIDE** of a good with no house: ONE TABLE of good to the houses that work it,
   read by all three export steps of `deriveExportsFromChains`; coal and peat left ungated; the defended pass's toll
   revenue KEPT. Build from `lane/record-measure-2-2026-11-14 :: docs/chair/2026-11-14/probes/RECORD-MEASURE-2/c1e.patch`
   (its report's row and paragraph c1): measured 316 -> 193 towns (57 without coal and peat); `primaryExports` moves in
   166; no income, prosperity or chain move. Its own commit, a declared move; its one new red,
   `economicsGoodsPillsBorneOut.test.jsx` "the record exports both", re-keyed by identity. NOTE for its builder: this
   branch now has the made list's table (`MADE_HERE_WORKING_HOUSES`, `MADE_HERE_KEYWORD_WIDENING`,
   `MADE_HERE_OUTPUT_HOUSES`): the ONE TABLE should be those, read by both sides, and C1-E's patch was cut at a tree
   without them: re-measure on this tip.
2. **(D19)** "Waterborne freight services (cargo, pilotage)" where the docks are AIRSHIP docks (11 towns;
   INSTITUTIONAL_SERVICE_MAP's waterborne row; how an air dock reaches it is NOT read here: "Airship docking (high
   magic)" does not hold the row's 'docks/port' substring, so read the 11 towns' rosters first): a
   twin name true of an air dock, listed for the owner's veto.
Then: 28528 and the WORKLIST3 export rows (named above, other files); D15's remainder (above).
Done here: C2-A, C1-A, 03905, 15738, 11365, 31448.

## How the instruments are re-made

`git archive` into a directory outside every tree: `origin/lane/census-3-2026-11-14 docs/chair/2026-11-14/probes/CENSUS-3`,
`origin/lane/chair-2026-11-08 docs/chair/2026-11-14/probes/READ-ALL`, `origin/lane/record-measure-2026-11-14
docs/chair/2026-11-14/probes/RECORD-MEASURE-1`. A scratch worktree per tree (one `npm ci`, the others symlink its
`node_modules`). Record: `CENSUS3_PROBES=<CENSUS-3> sh births-only.sh <tree> <out>` (~1 min), `node fielddiff.mjs
<a>/corpus.ndjson.gz <b>/corpus.ndjson.gz 2`, `node classes.mjs <tree> <corpus> <out.json>`. Page: `sh census3.sh
<tree> <out> 4` (~25 min), `inventory.py <out> x.json`, `inventory_diff.py before.json after.json <rows.json>`.
The inheritor and verification scripts are ad hoc python over `corpus.ndjson.gz` (lost/gained goods by town against
the roster's names), not committed.

## TAIL-DEFECON-C-3 (the third seat on this file, 2026-11-15, from 906ff0352): D30, THE MADE LIST, FINISHED

Same branch, same files. Worked to **D30** (the chair, 2026-11-15 02:31 UTC; vetoable by the owner), copied here:
> THE MADE LIST, FINISHED. After C1-A the page still prints, in 389 of the 720 towns, a good "produced locally" that no
> house of the town makes or works (barrels 44, flour 37, …) or that is gathered or herded with no gate at all (herbs 46,
> hides 33, wool 29, timber 29, clay 5). THE LAW, in two parts, each ITS OWN COMMIT, A DECLARED MOVE, MEASURED BEFORE IT
> IS BUILT: (a) A MADE GOOD is on the made list only where a house that makes or works it stands: the list is read by THE
> WHOLE TABLE (GOOD_WORKING_HOUSES), not by C1-A's narrower gate. (b) A GATHERED OR HERDED GOOD (herbs, hides, wool,
> timber, clay and their kind) is on the made list only where THE LAND GIVES IT AND IT IS WORKED: the record's own
> exploitation of its resource (D15's two records made to agree), not a house. COAL AND PEAT stay as designed. The
> chain-processor class (a cooper's beer) and the crisis export rows of one town each are NAMED, not built. For each
> part, first the measure (births-only, field diff by family): if it moves only the made list and what prints it, build
> and push; if it moves income, exports beyond the list, a founding or an arrival in more than ten towns, one line to the
> chair with the table before the push. Every inheritor read. The page by one census before and one after both parts.

| commit | what | record move (births-only field diff on the 720, over the commit before) |
|---|---|---|
| **ea788e17c** (a) | `outputMadeHere` asks GOOD_WORKING_HOUSES for every good it names | 91 towns, ONE family: `economicState.localProduction`; no gain anywhere; no made list emptied |
| **6ce176aff** (b) | a land's commodity that a resource chain takes as its raw is made only where a house works that chain, asked as the record's exploitation asks | 123 towns, ONE family: `economicState.localProduction`; 1 gain (read, true); 2 lists emptied (silent by design) |

### D30 (a)

- Lost (and nothing gained): Barrels and containers 44, Bows and crossbows 17, Arrows (sheaf) 17, Dyed cloth 15,
  Hospitality for travellers 11, Quality tools and weapons 8, Advanced weapons and armor 8, River craft 4, Ship
  construction 2, Ocean-going vessels 2, River barges 1.
- READ, by the houses of a near name in each losing town (all true: none makes the good): barrels: no house 30, a
  Brewer or Brewery 9, a Vintner 4 (a brewer fills casks, a cooper makes them); bows/arrows: none 15, a Hunter's lodge
  2; dyed cloth: Weavers/Tailor's guild 9, a Tailor 3, Weavers 1, a Tailor's guild 2 (no dyer); hospitality: none 7, a
  divine Healer 2, a Hunter's lodge 1, a Wayside shrine 1; arms: no smith or metalworker in all 8; boats and ships: a
  River ferry 2, a Barge and river transport company with Docks 2 (no shipyard or boatyard).
- Not covered by the table (it names none of them, so (a) does not touch them; NAMED, a table row would gate the
  exports too): the raw "flour" and "Baked goods" (the classes' flour 37), "Processed textiles", "Finished clothing",
  "Fine wool cloth" (textiles 16), the raw "glass" (glass 7).
- Guard: `tests/generators/tailDefeconMadeListWhole.test.js` (13 GONE rows red at 906ff0352, each naming a good the town
  still makes; 3 KEEP rows, the good where its Cooper, Bowyer, Dyer stands, green before and after). RE-KEYED BY
  IDENTITY: `economicsGoodsPillsBorneOut.test.jsx` "no barrels by a thatcher …" (rww-village-famine-1): its anchor
  listed the barrels on the record; the record no longer lists them (no cooper), and the page claim is unchanged.
- Gates: the 48 focused files (803 tests): 7 red, 6 CARRIED at the base (generatorGoldenMaster, worldFactRederive A7,
  coherenceAgreeCures x2, urbanBandInstitutions G3/G5), the seventh re-keyed above. domain-strict, the type ratchet,
  eslint: exit 0. The golden master moves (the owner's door): not re-taken.

### D30 (b)

- Rule: in step 1 (the land), a commodity that a chain of `RESOURCE_CHAINS` takes as its `rawResource` is listed only
  where a house of the town works one such chain, asked EXACTLY as `resourceGenerator.js :: evaluateInstitutions` asks
  (`institutionSupportsChain`: a processing tag, or a processor by name; never custom content; the fabric rows count,
  as they do there), and only among the chains the record MODELS there (the terrain allows the raw:
  `terrainAllowsResource`). A commodity no chain takes (honey, dates, pottery, coal, peat, …) keeps the land's gate
  alone: COAL AND PEAT stay as designed. The one call in `economicState.js` passes `config.terrainType`; a caller with
  no roster (the world pulse) keeps the land's reading.
- MEASURED BEFORE IT WAS BUILT, two ways. A rule asking only "is a house at the chain" moved 398 towns (herbs 302): the
  record models the herb chain only on forest terrain, so in 256 towns elsewhere it never calls the herbs unexploited.
  NOT built. The rule as built: **123 towns, exactly D15's set** (the lost goods equal, town by town, the made raws the
  record names unexploited: 0 mismatches): medicinal herbs 46, animal hides 33, wool 29, timber 29, clay 5. ONE family.
- ONE HOME, HELD BY A TEST: importing `terrainAllowsResource` would close an import cycle (resourceGenerator ->
  economicGenerator -> economicState -> computeActiveChains; at the base these are acyclic, and `scripts/boot-smoke.mjs`
  holds the chunk graph acyclic). So the eight lines and the synonyms are restated (`madeListTerrainAllowsRaw`) and a
  test holds them equal to the original on every terrain and every chain raw (shown red by a plant that drops one
  synonym, not committed). OWED to `resourceGenerator.js`'s seat: move the predicate to a domain leaf both read.
- THE INHERITORS, read: "Structural timber" surfaces in r2s-insurgency-village-2 where "timber" left (the made list folds
  the raw over its product): the mountain-timber harvest runs there by a Charcoal burner, a Carpenter stands: TRUE.
  EMPTIED, silent by design: r2r-thorp-0 and r2r-thorp-41 (each listed only medicinal herbs; no apothecary, alchemist or
  healer there).
- SEEN, NOT CURED (the table names it not): "pottery", a land commodity of the river clay, in 5 towns with no potter or
  brickmaker (r2r-thorp-27, r2r-hamlet-18, …): after (b) it stays where its clay left. Same class as the raw "flour",
  "Baked goods", the textiles and the raw "glass" in (a)'s NAMED list.
- Guard: the (b) blocks of `tailDefeconMadeListWhole.test.js` (5 GONE + 2 EMPTIED red at ea788e17c; 5 KEEP green before
  and after; the terrain-check equality). RE-KEYED BY IDENTITY in `tailDefeconMadeList.test.js`: r2r-thorp-0's two C1-A
  rows kept "medicinal herbs" as the sibling; its list is now empty (the rows assert that); r2r-hamlet-18's two rows kept
  "clay" / "pottery": now "medicinal herbs" (its pottery has no potter, above). And `tradeListsThreeSurfaces.test.jsx`
  "the local production …": its anchor was r2r-thorp-0's record listing local goods; it now lists none (both surfaces
  print none, asserted), and the agreement claim moves to r2r-thorp-9.
- Gates: the 48 focused files + the guard (816 tests): 6 red, 5 CARRIED (generatorGoldenMaster, worldFactRederive A7,
  coherenceAgreeCures x2, urbanBandInstitutions G5; G3 passed this run), the sixth re-keyed above. domain-strict, the
  type ratchet, eslint: exit 0. The golden master moves again (the owner's door): not re-taken.

### THE PAGE (one census before at 906ff0352, one after at 6ce176aff: (a) + (b); tabs only, `CENSUS_RENDER=render.census2.jsx`)

Both `census3.sh` runs exit 0; the after corpus equals the births-only record of 6ce176aff (0 towns moved).
- **THE D30 CENSUS, "a good made with no house or land for it", printed** (the made list only; a good of the classes'
  MAKER table with no maker house, coal and peat left out by design, OR a raw the record's exploitation names
  unexploited; printed where the good's string is in the tabs, `pageprint.mjs`'s way): **232 towns -> 85** (record
  279 -> 113). The 389 of D30's text was the classes' c1 printed at 358d6afea (both sides, coal and peat in); that
  instrument at this base: **c1 printed 323 -> 298** (record 373 -> 327; the rest is the export side and coal/peat).
- LEFT on the made list (towns on the record / printed), each a good GOOD_WORKING_HOUSES does not name or a reading
  the classes' regex does not share: flour/bread 37/37 (the raw "flour" of the grain land and the mill site, "Baked
  goods"), gems 37/35 (jewelry by Specialized metalworkers: the table's row; and the bundled gems below), textiles
  17/16 ("Processed textiles", "Finished clothing", "Fine wool cloth"), glass 7/7 (the raw "glass"), education 37/3,
  books 2/2. Each needs a table row (which gates the export too) or the data's holder: NAMED.
- THE INVENTORY (`inventory_diff.py`): sentences 28,898 -> 28,903; gone 27, new 32, fewer 19, more 14, moved 2. Every
  row but one is a PILL FOLD (the made list's pills fold into one token a town: "timberBarrels and containers"), and
  every fold that is new or wider holds only goods the town's record still lists (the record lost goods and gained
  one, read above). The one prose row: **"Produced locally" 657 -> 655**: r2r-village-57 and
  r2s-mass_migration-hamlet-1 printed only "timber" and "Barrels and containers" (no cooper; timber where a Carpenter
  alone stands and the record names the timber unexploited); what their records still list (herbs, coal) the row's
  own filter does not print, so the row is silent: SILENT AND TRUE. The two emptied thorps (r2r-thorp-0, -41) did not
  print the row before.
- THE INHERITORS (48 folds, each one town to fourteen): all pill folds of goods still listed: 0 false inheritors.

### The chair's doubted catalogue pairs (D31, the chair's note of 02:31: NAMED, not built here)

Towns whose made list holds the good, the resource nearby, no other nearby resource giving the good, and no house that
works it (this seat's regexes: a salt works; a mine, jeweller, gem cutter or assayer; an apothecary, alchemist, herbalist
or healer; a weaver, textile house, fuller or tailor). The economy seat's own counts used other house tests, so the
figures differ from its; the movement is the measure. Base 906ff0352 (record = printed) -> (a) -> (a)+(b):
| pair | base | (a) | (a)+(b) |
|---|---|---|---|
| fishing grounds' salt | 21 | 21 | 21 |
| a river fishery's salt | 42 | 42 | 42 |
| precious metals' gems | 17 | 17 | 17 |
| hot springs' medicinal herbs | 31 | 31 | **26** |
| river mills' processed textiles | 14 | 14 | 14 |
WHY THE GATES DO NOT SILENCE THE SALTS AND THE GEMS: the land gate is per RESOURCE, not per commodity. One house that
works the resource admits its whole commodity list: a Fish market, Fisher's landing, Fishing community, River ferry or
Docks admits the river fishery's bundled salt (42); a Smelter admits precious metals' bundled gems (12 of 17 by a
Smelter). (b) asks a chain for a raw, and no chain takes "salt", "gems" or "processed textiles" as its raw, so it
leaves them. THE HOT SPRINGS' HERBS ARE THE CASE TO REPORT: they pass the land gate (the hot springs have no gate) on the
doubted pair alone, and (b) silences only the 5 on forest terrain, where the record models the herb chain; 26 still
print. No exclusion list is built here (D31): the data's holder cures the pairs.

### What is left (D30)

1. (b): DONE (this commit).
2. THE PAGE: DONE (above): 232 -> 85 towns printing a made good with no house or worked land.
3. NAMED, not built (D30): the chain-processor class (a Cooper's "Ale/Beer (barrel)"); the crisis export rows (09013,
   09282); the goods the table does not name (flour/bread 37, textiles 16, glass 7 printed: a table row gates the
   export too; pottery 5); coal and peat (by design).
4. NAMED for other seats: the doubted catalogue pairs (D31, above: river-fishery salt 42, fishing-grounds salt 21,
   hot springs' herbs 26, precious metals' gems 17, river mills' textiles 14: the data's holder); ONE LEAF for the
   exploitation's terrain check (`resourceGenerator.js`'s seat; held equal by a test meanwhile);
   `resourceDynamicsKernel.js:575` (the world pulse re-derives the made list with no roster and no terrain: (a)'s and
   (b)'s gates are off there until the next birth; pass `settlement.institutions` and the terrain).
5. REGISTERS NAMED STALE (re-derived at the close): the golden master (the owner's door); the presumed-things register
   as at the base (fresh 148, first-register stale 2: no rise; 6ce176aff); the twelve-birth grid's 2 falls as at the
   base (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a).

6. NAMED TO THIS FILE BY THE CHAIR at 03:17 (from the economy seat's hand-back, `lane/tail-defecon-2026-11-14`,
   TAIL-DEFECON-HANDBACK.md, "the fish chains' goods …" and item 2 of its WHAT IS LEFT). NOT D30's gate, so after it, by
   width; NOT BEGUN (they arrived at this seat's hand-back):
   - **B14842 "Pilgrim hospitality"** (written in `deriveExportsFromChains`, ~line 743 then): false in 27 of the 83 towns
     that print it, no house of pilgrimage (a shrine, relic site, temple, cathedral, abbey or monastery). C1-E gates it
     by an inn or its kin (GOOD_WORKING_HOUSES), not by the pilgrimage, so it wants a second key on the same row. It is
     an EXPORT move: measure the primaryExports and income families first. More than ten towns means one line to the
     chair before the push.
   - **(C) the fish chains' goods under a fish famine** (22820 11, 10282 10, 22836 9, 22837 8, 22847 3, 10284 3, 22821 2,
     22838 1, 09012 1) and **24992 the Brickmaker with no clay** (23): the chain display's rows (`activeChains`' outputs).
     Find each reader first. Under a famine no line offers the food that failed. Item 6 of the C-2 list (the export
     crisis rule, 09013) is the same famine law on the export side.

HANDED BACK by TAIL-DEFECON-C-3 at 2026-11-15 ~03:20 UTC, both parts of D30 built and the page measured. The
instruments as above; this seat's ad hoc scripts (the D30 census, the pair measure, the record-vs-exploitation check) are
node over `corpus.ndjson.gz` and the dumps, not committed.

## TAIL-DEFECON-C-4 (the fourth seat on this file, 2026-11-15, from 65a5ecfcf): D33 and D34

Same branch. Files: `computeActiveChains.js` whole; the one call in `economicState.js`; and, LENT BY RULING D32, the
`commodities` arrays of `src/data/resourceData.js` (nothing else of that file). Tests.

The rulings worked to (the chair, 2026-11-15 03:20 UTC; each vetoable by the owner), copied:
> (D33) THE TABLE'S MISSING ROWS: flour, textiles, glass and pottery have no row in GOOD_WORKING_HOUSES, so the made
> list still prints them where no mill, weaver or fuller, glassblower or potter stands (part of the 85 towns left). Add
> the rows (the houses that make or work each: read them from the catalogue, do not guess), and say what leaves the
> list, good by good.
> (D34) THE CATALOGUE'S FALSE COMMODITIES (D31 is lifted for these four): a RIVER FISHERY does not make SALT (42 towns
> print it); FISHING GROUNDS do not make salt without a salt works (21); PRECIOUS-METAL VEINS do not give GEMS (17); HOT
> SPRINGS do not give MEDICINAL HERBS (26). Take the good out of that resource's `commodities` (the salt flats, a gem
> deposit, a herb ground keep theirs). KEPT AS TRUE: an ancient grove's honey, an oasis's dates. RIVER MILLS' flour and
> processed textiles stay in the data and are gated by D33's rows. FOR EACH OF THE FOUR, FIRST THE MEASURE (nine
> readers of `commodities`), by family. IF A PAIR MOVES ONLY the trade lists, the made list, a chain that worked that
> good, and what prints them: build it and push. IF IT MOVES income, prosperity, a founding, an arrival scene or a
> stored hook in MORE THAN TEN TOWNS: ONE LINE TO THE CHAIR with the table BEFORE the push, and go on with the next
> pair meanwhile. EVERY INHERITOR READ. THE PAGE, by one census before and one after everything. NAMED, NOT BUILT: the
> terrain check's leaf; `resourceDynamicsKernel` line 575.

| commit | what | record move (births-only field diff on the 720, over the commit before) |
|---|---|---|
| **0e838bc65** D33 | the table's flour, bread, cloth, clothing, glass and pottery rows; the land's commodity asked too | 117 towns: `localProduction` 117, `primaryExports` 21, `economicComplexity` 1; nothing else |
| **680d16b54** D34 (a) | `resourceData.js` commodities: a river fishery's salt, a precious-metal vein's gems, both hot-springs keys' herbs leave | 235 towns: `resourceAnalysis.availableResources` 235, `localProduction` 167, `necessityImports` 29, `primaryImports` 25, `resourceAnalysis.gaps` 16, `resourceChains` 12, `exploitation` 12, `resourceAnalysis.imports` 10, `transit` 8, `resourceAnalysis.exports` 3, `priorityNotes` 1; NO income, prosperity, founding, arrival or hook |

### D33

- The rows, read from the catalogue's houses (`ALL_CATALOG_NAMES`): flour ("flour", "Flour and meal", "Milled flour")
  by a GRAIN mill (Mill, Mills (2-5): a new gate keyword `grain mill`; the export gates' `mill` keyword reads a
  Sawmill and a Maltster as mills and is NOT narrowed); "Baked goods" by Bakers; "processed textiles" / "Processed
  textiles" / "Fine wool cloth" by Weavers/Textile workers or a Fuller; "Finished clothing" by a Tailor or Tailor's
  guild; "glass" / "Window glass" by Glassblower or Glassmakers; "pottery" by a Potter. Step 1 of the made list (the
  land's commodities) now asks the table too, so the grain fields' and the mill site's raw "flour", the mill site's
  "processed textiles", the glass sand's "glass" and the river clay's "pottery" leave where no such house stands.
- CHANGED FROM THE PREDECESSORS' TABLE: "Flour and meal" was `['mill', 'baker']` (a Sawmill, a Maltster or Bakers
  passed it); now the grain mill alone, one reading for one good. "Milled flour" (the tradeGoods' name for the same
  flour) added, measured alone first: 2 towns' exports (r2r-hamlet-31, r2r-hamlet-44: a Maltster), 1 economicComplexity.
- WHAT LEAVES THE MADE LIST, good by good (and nothing gained): Baked goods 42, flour 39, processed textiles 16,
  Finished clothing 9, glass 7, pottery 5, Processed textiles 3, Fine wool cloth 1. EXPORTS lost: Baked goods 17,
  Finished clothing 2, Milled flour 2, Flour and meal 1, Processed textiles 1.
- THE INHERITORS, read: exports gained 2: "Dyed cloth" in r2s-wartime-town-0 (a Dyer stands: TRUE), "Preserved foods"
  in r2r-village-4 (the food-processing chain by a Dairy farmer: cheese and butter: TRUE); "Processed grain" in
  r2r-hamlet-44 (a Maltster malts grain: TRUE).
- Guard: `tests/generators/tailDefeconMadeListTableRows.test.js` (9 GONE + 3 GONE_EXPORT rows red at 65a5ecfcf, each
  naming what still prints; 9 KEEP + 1 KEEP_EXPORT where the house stands, green before and after). RE-KEYED BY
  IDENTITY: `tailDefeconExportSide.test.js` KEEP "r2r-hamlet-44 exports Flour and meal where Maltster stands" -> GONE
  rows (Flour and meal, Milled flour; it still exports Processed grain) and the KEEP claim moves to r2r-village-27's
  Mill; `economicsGoodsPillsBorneOut.test.jsx` (rww-village-famine-1): its anchor listed "Fine wool cloth" on the record
  (a Shepherd, no weaver or fuller); the record no longer lists it; the page claim is unchanged.
- Gates: the 66 test files that name computeActiveChains, localProduction or resourceData + the guard: 15 red over 9
  files, ALL CARRIED (red at 65a5ecfcf too: generatorGoldenMaster, worldFactRederive A7, coherenceAgreeCures x2,
  urbanBandInstitutions G3/G5, vocabularyPageFindings F1 planted, editWorldFactResources A2/A6, editCorpusRatchet
  A3/A4/A7/A8) but the two re-keyed above, green after. domain-strict, the type ratchet, eslint (the file held at 800
  lines): exit 0. The walker `--check`: fresh 148, first-register stale 2 (as at the base). The grid: 2 falls as at
  the base (r2r-city-0 P7a, r2s-insurgency-metropolis-0 P7a). The golden master moves (the owner's door): not re-taken.

| **D34 (b)** (this commit) | fishing grounds' salt on the made list only where a Salt works stands (`LAND_GOOD_HOUSES`, by resource) | 25 towns: `localProduction` ONLY (salt leaves 23; 2 reorder) |

### D34 (a): the three data pairs (each measured alone over D33, then together: the union)

| pair | towns | families (towns) |
|---|---|---|
| a river fishery's salt | 59 | availableResources 59 (the commodity set), localProduction 50, necessityImports 29 (+Salt 23), primaryImports 25 (+Salt 21; 5 towns' last import displaced by it), resourceAnalysis imports/gaps 9 (a Salt works with no salt land: "lacks access" / "runs on imported" salt), transit 8 (−Salt) |
| a precious-metal vein's gems | 91 | availableResources 91, localProduction 35 |
| the hot springs' herbs (`hot_springs`, `hot_springs_mineral`) | 111 | availableResources 111, localProduction 95 (herbs leave 71; the rest reorder), resourceChains 12 and exploitation 12 (the herb card of the springs), gaps 7, resourceAnalysis.exports 3 (the springs' "potions, tinctures"), priorityNotes 1, imports 1 |

No pair moves income, prosperity, a founding, an arrival scene or a stored hook: each built under the ruling, no line
owed before the push. Kept as true (asserted): the salt flats' and the desert's salt, the herb grounds' and the grove's
herbs, the grove's honey, the oasis's and the palms' dates.
- THE INHERITORS, read: SALT IMPORTED where the river gave it: true (no salt land stands in those towns). THE SALT WORKS
  GAP LINE ("Salt works exists but lacks access to …", "… runs on imported …", 9 towns, printed on the Resources tab):
  a Salt works by a river with no salt land: true. THE HERB CARDS (the page's grade, `validationOnPage.js ::
  exploitationGroupsShown`, run over all 720 before and after): 12 herb cards leave (the springs' herbs: true), and
  ONE MOVES Unexploited -> Partial: **r2r-village-8** (a divine Healer, no apothecary; the record files its grove's
  herbs Partial). FALSE, ONE TOWN, NAMED for the page reader's seat (`validationOnPage.js` / the record's
  `resourceGenerator.js` filing): before D34 the reader graded it Unexploited only because the springs' herb chain
  was modelled there; the grove's herbs are not modelled, so the filed grade now stands (R3: divine healing works no
  herbs). EMPTIED, silent by design: r2r-hamlet-18, r2r-thorp-27 (their last good was the springs' herbs).
- NAMED for the data's holder: no resource's `commodities` names "gems" now (the gem deposit's hold only "luxury"):
  "a gem deposit keeps theirs" has nothing to keep; adding one is a new draw, not this lane's. The edit pool's
  commodity vocabulary goes 34 -> 33.
- Guard: `tests/generators/tailDefeconCatalogueCommodities.test.js` (the data rows and 4 GONE + the import inheritor,
  9 red at 0e838bc65; the KEPT data rows and 3 KEEP births green before and after). RE-KEYED BY IDENTITY:
  `apothecaryWorksTheHerbs.test.js` (built on the springs' herbs: the unit's ground is a herb ground; r2r-village-47 is
  asked of its grove; r2r-town-17's card is gone; r2r-village-8 as named above), `editPools.test.js` (34 -> 33),
  `resourceDynamicsApply.test.js` (the anchor moves from the vein's gems to the salt flats' salt),
  `tailDefeconMadeList.test.js` (hamlet-18's rows EMPTY; the Jeweller's "gems" WORKED row becomes GONE),
  `tailDefeconMadeListWhole.test.js` (hamlet-18 to EMPTIED), `tailDefeconMadeListTableRows.test.js` (thorp-27's
  pottery row moves to r2s-occupied-thorp-0).
- Gates: the 66 focused files + both guards: 21 red over 15 files, the 13 CARRIED of D33's list and the 8 re-keyed above
  (green after). domain-strict, the type ratchet, eslint: exit 0.

### D34 (b): fishing grounds' salt (A DEVIATION FROM THE RULING'S LETTER, VETOABLE)

- Measured both ways over D33. THE LETTER (salt out of `fishing_grounds.commodities`): 61 towns (availableResources 61,
  localProduction 41, resourceAnalysis imports/gaps 14), and in those 14 it tells a COASTAL Salt works it "lacks access
  to" salt (6: r2r-hamlet-8, r2r-hamlet-53, r2r-village-51, r2s-insurgency-city-3, …) or "runs on imported" salt (8):
  FALSE beside the ruling's own words ("do not make salt WITHOUT A SALT WORKS"). NOT BUILT. BUILT: the data keeps the
  coast's salt and the made list asks a Salt works for it, by resource (the salt flats' and the desert's salt keep the
  land's gate): 25 towns, ONE family, salt leaves 23 (a Fishing community, a Fisher's landing, Docks, … and no salt
  works). No inheritor (nothing gained; 2 towns reorder). The predecessor's 21 was counted with other house tests.
- Guard: the D34 (b) block of `tailDefeconCatalogueCommodities.test.js` (2 GONE red at 680d16b54; the data row and 3
  KEEP towns, a Salt works on the fishing grounds, green before and after).
- Gates (AT THE HAND-BACK, NARROWED BY TIME): the record (births-only: 25 towns, one family); every tail-defecon guard,
  `economicsGoodsPillsBorneOut`, `resourceDynamicsApply`, `apothecaryWorksTheHerbs` (213 tests): green; eslint on the
  touched files: clean. NOT RUN for (b): the 66-file focused set, domain-strict, the type ratchet, the walker, the grid
  (run for D33 and D34 (a): as listed above). OWED to the next seat, first.

### What is left (TAIL-DEFECON-C-4)

1. D33: DONE (0e838bc65). D34 (a): DONE (680d16b54). D34 (b): DONE (this commit), its full gates OWED (above).
2. The record's four pairs after D34: river-fishery salt, precious-metal gems, hot-springs herbs leave the data (0 by
   construction); the coast's salt only by a Salt works.
3. THE PAGE: THE BEFORE CENSUS IS TAKEN, the after is NOT (the hand-back came at the time mark). Before, at 65a5ecfcf:
   `census3.sh` exit 0, `CENSUS_RENDER=render.census2.jsx`, out-dir in this seat's scratch (lost with the container):
   re-take it. OWED: one census at the tip, `inventory.py` both, `inventory_diff.py`, the D30 census "a good made with no
   house or worked land" (85 towns at 65a5ecfcf by the predecessor's count) and each of the four pairs to none; the
   inheritors read where they print (the salt-works gap line by a river, 9 towns; r2r-village-8's herb card, named).
4. NAMED, NOT BUILT (as the predecessor left them): ONE LEAF for the exploitation's terrain check
   (`resourceGenerator.js`'s seat; held equal by a test meanwhile); `resourceDynamicsKernel.js:575` (the world pulse
   re-derives the made list with no roster and no terrain: the gates are off there until the next birth).
5. NAMED, NOT BUILT (this seat): r2r-village-8's herb card Partial (`validationOnPage.js` / `resourceGenerator.js`'s
   filing, a divine Healer); no resource's commodities name "gems" (the gem deposit's data); "Milled flour" et al. are
   now one reading (done). Carried from the predecessor's note of 03:17, NOT BEGUN: B14842 "Pilgrim hospitality" (a
   second key on the inn row: an EXPORT move, measure first) and the fish-famine chain rows and 24992 (item 6 above).
6. REGISTERS NAMED STALE: the golden master (the owner's door, moved by all three commits); the walker and the grid as at
   the base (fresh 148, first-register stale 2; 2 falls, checked at D33).

HANDED BACK by TAIL-DEFECON-C-4 at 2026-11-15 ~04:25 UTC by time (~70 minutes; the meter read 0). Instruments as above;
this seat's ad hoc scripts (goods and list diffs by family over two corpora, the herb-card grade over the 720 by
`exploitationGroupsShown`) are node over `corpus.ndjson.gz`, not committed.
