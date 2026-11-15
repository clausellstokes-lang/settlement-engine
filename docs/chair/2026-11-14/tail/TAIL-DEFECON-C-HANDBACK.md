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
  - **"Salt for preservation" in 21 towns** takes Sea salt's place: the flats' second trade good, the same salt, and
    no salt works stands. Gating it too (tried, not committed) moves `incomeSources` in 4 towns (Salt Sales) and
    re-draws `history.founding`'s reason in 7 ("grew around salt workings …"), which is a stop under D18. TOLD TO THE
    CHAIR (01:5x), not answered at this writing. If granted: add `'Salt for preservation': ['salt']` to the table
    (a declared move into income and founding).
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

PENDING at this push (the after census was running): see the next push of this file.

## What is left of this file's rows (HANDED BACK at the budget, 2026-11-15 ~01:25 UTC, by time: ~70 minutes)

(UPDATED by TAIL-DEFECON-C-2: items 1 and 2 are DONE, a10a457e2 and e6700483b, above. WHAT IS LEFT NOW: the chair's
answer on "Salt for preservation" (above); 28528 and the WORKLIST3 export rows (other files); D15's remainder; the
made list read by the whole table (barrels 44, flour 37, bows 17, textiles 16, dyed cloth 15: the measuring seat's
"natural gate", a localProduction move the chair has not granted); the chain-processor class (a Cooper's beer); the
gathered and herded goods left ungated.)

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
