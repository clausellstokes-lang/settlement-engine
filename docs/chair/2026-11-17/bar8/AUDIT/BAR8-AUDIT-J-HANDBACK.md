# BAR8-AUDIT-J · HAND-BACK · LAW 11: THE SUPPLY STORY ON EVERY LINE

Seat J of BRIEF-BAR8-AUDIT (family F1 of the seventh read: 16 of the 46). Base `lane/point33-candidate-2026-11-17` at
e0242a12a (tree 4a9735d2f9). Branch `lane/bar8-audit-j-2026-11-17`. I CURED NOTHING: no line under `src/` changed.

- The detector: `tests/helpers/pageLaws/law11Supply.mjs` (new). It reads seat B's `readTown` (`pageB.mjs`) and the H
  reader's `cardMark`/`readPersons` (`law8H.mjs`) unchanged, plus the src leaves read-only (`supplyStory.js`, `houseKinds.js`,
  `houseInputAtHand.js :: warIronHookOutsideWar`, `goalFamilies.js`).
- The runner: `node docs/chair/2026-11-17/bar8/AUDIT/runJ.mjs <render-dir> <out.json> [--controls]`. Its output is
  `RUN-J.<pop>.txt`. The distinct lines with their writers are in `TABLES-J.<pop>.md` (`tablesJ.mjs`). The controls are in
  `controlsJ.json`.
- The renders were made at the base in the scratch worktree with its own `npm ci`. They are PAGE-COPY's `census3.sh
  --count-only`, each run seen to its end: the 720 (EXIT 0, 1793 s), then the 150. The thirty are the published render on
  `lane/read7-prep-2026-11-17` (`review-bar-7/render/`), which is the same tree.

THE STORY THE DETECTOR READS (`law11Supply.mjs :: materialStory`) is taken from the stored record alone, as ruling BR8 has
every view read it. For each material of `houseKinds.js :: MATERIAL_OF` it gives one of these stories:
- `local`: a live ground, or a ground a house implies.
- `bought-used`: the material's grounds are used up, and the imports or a gap row "runs on imported X" bring it.
- `idle`: the grounds are used up and nothing brings the material.
- `bought-never`: there is no ground and the imports bring it.
- `venture`: the material is the failed venture's.
- `none`: there is no ground and no import. This is never read as a fault, because a river or a coast gives fish that no
  land row names (the controls C43392 and C43737).

On a coast, salt is local (the sea's brine; the controls C41716 and C42154). Grain and livestock count only where a ground
of them is spent: the town's own fields are on no land row.

## 1. THE RULES AS COUNTED

**CONTROLS (the thirty, `--controls`): all 16 STANDS rows of the seat are FOUND by their own sub-rule, and all 8 EXPLAINED
rows are clear of every rule of the seat. Controls off: 0.**
- 11a: C0893, C42813 (11a.imported); C34109 (11a.atWork).
- 11b: C19722, C20700, C20963, C36591, C36970, C42801 (11b.fish).
- 11c: C34102 (11c.venture).
- 11d: C38200, C38039 (11d.warIron).
- 11e: C2853 (11e.siegeBought), C8867 (11e.wantBuy), C5157 (11e.stalls), C32296 (11e.offer).
- Clear: C41716, C42154, C43392, C43737, C0423, C0453, C2821, C5541.

COUNTS. Each cell is towns / instances. The distinct lines are in TABLES-J.

| rule | the thirty | the 150 | the 720 | precision (read by the second check's rules) |
|---|---|---|---|---|
| 11a.imported: need list vs a gap row "runs on imported X" | 2 / 2 | 5 / 5 | 5 / 5 | 5 of 5 stand (4 are the smelter's "iron ore" under a siege; 1 is the fishmonger's fish) |
| 11a.atWork: need list vs a bare house that works X | 1 / 1 | 0 | 11 / 13 | 8 of 13: butchers 3 (C34109's pair) and herbs 1 stand; the timber 9 (bowyer, boatyard, sawmill, carpenter beside "timber" or "mountain timber" with no timber ground at all) are PLAUSIBLE, 4 of them read as WEAK where the need is a grade |
| 11b.fish: the catch taken or landed here under a bought-in or idle fish story | 4 / 13 | 2 / 3 | 36 / 69 | 63 of 69: "Fish sold daily from the morning catch." 29 (C20700 class), the rites income line 21 (C20963 class), scenes 6 (C19722 class), "Catch of the day" / "day's catch" / "Catch landed here" 7. The fishmonger's "Talks about the boats, the catch" 6 is LOW (PAIR) |
| 11b.fishTitle: the row's NAME "Fresh fish retail" / "Fresh fish" (title and chip) | 4 / 7 | 2 / 3 | 31 / 51 | WEAK: the row's description is the line that tells the story; counted apart |
| 11b.ironOre: "the mine yields" / "ore the workings still give" with every ore ground spent | 1 / 1 | 2 / 2 | 7 / 7 | 1 of 7 (the secret); the smelter's generic card line (6) is WEAK |
| 11b.wool: a shepherd's "Wool shearing", bare, on spent pasture | 0 | 1 / 2 | 1 / 2 | 2 of 2 PLAUSIBLE (also LAW 8's `8b.extract` surface: LEFT-MARKS L17) |
| 11b.landOffers: "✓ Agriculture" where the floodplain is spent | 1 / 1 | 2 / 2 | 9 / 9 | WEAK: the tick is the terrain's offer, a static row |
| 11b, the other materials (timber, stone, clay, salt, peat, herbs, hides, grain) | 0 | 0 | 0 | Read by hand: the candidates (the sawmill's "Saws logs into planks", the sawyer's "turns back to the logs", the quarry's secrets, the flocks' service rows) are story 2 at work (a buyer working bought material) or carry their own mark. NO local-source line of them stands at this tree |
| 11c.venture: "must come from elsewhere" for the failed venture's material | 1 / 1 | 0 | 0 / 0 | 1 of 1 (the 720's 11 ventures print no such line) |
| 11c.needed: "must come from elsewhere" for a good the need list names and no import names | 1 / 1 | 3 / 3 | 8 / 8 | 8 of 8 (X and not-X on one tab: copper ore 4, clay 3, herbs 1) |
| 11c.idle: the same line under an idle story | 0 | 1 / 1 | 1 / 1 | 1 of 1 PLAUSIBLE |
| 11c.noImport: the fish market's inland card "fish come in by cart", no import of fish | 3 / 3 | 10 / 10 | 56 / 56 | WEAK (a LOW family: no printed line denies it, only the import list's silence); counted apart |
| 11d.warIron: the war's iron (mark, hook, scene) in a town no war is in force in, beside an iron import | 1 / 7 | 3 / 21 | 2 / 19 | 19 of 19: the brief's own fault case (an import printed in a town no siege shuts, and the houses that use it marked short) |
| 11e.siegeBought: under a siege, a bare house whose material is bought in | 3 / 4 | 7 / 14 | 8 / 18 | 10 of 18: the mint (thirty), dyer 7, furriers 3 and boatyard 1 stand (C2853, C2704 and C2830 class); the tailors' livery 8 is WEAK (tailors sew cloth) |
| 11e.wantBuy: a Wants line that presumes a supply of a good needed and not brought in | 2 / 2 | 0 | 6 / 6 | 6 of 6 (C8867 class) |
| 11e.stalls: stalls sell reagents under a siege with every reagent chain Impaired | 1 / 1 | 0 | 0 / 0 | 1 of 1 (narrow: the control's line alone) |
| 11e.offer: a card or chip offering a good the need list names | 2 / 2 | 5 / 5 | 22 / 23 | 19 of 23: luxury 5 and livestock auctions or management 6 stand (C32296 and C34109 class); the quarter's "trade in silk, spice" 7 is PLAUSIBLE (C24702 LOW); the smelter's charcoal 1 is WEAK (and on the 150 the assay office's "Metal purity testing" beside "metals" is WEAK) |
| 11g.gapLine (the chair's note of 18:05): the general "No X reaches the <house>." beside the story's own line for one house | 7 / 8 | 17 / 17 | 118 / 129 | 129 of 129 are two lines for one house and one material. For the 124 source houses the general line also misstates the work: the quarry 58, the mine 32, the landing 12, the dairy 7, the peat cutter 4, the charcoal burner 3, the shepherd 3, the hunter's lodge 2, the salt works 1, the wildfowler 1, the fishing community 1. For the 5 buyers that are the failed venture (the carpenter, the cobbler's guild, the fuller, the potter, the tanner) it is only doubled |
| **LAW 11, all** | **17 / 54** | **47 / 88** | **217 / 416** | on the 720, 142 of the 287 instances of 11a to 11e stand by my reading, and the 129 of 11g are a doubled line (the fishmonger's 6 are LOW); the WEAK families (fishTitle 51, noImport 56, landOffers 9, the smelter card 6, tailors 8) are named apart |

THE ROOTS (the record alone, `rootsOf`, 720):
- gapImportedNoImport: 8 towns. A gap row "runs on imported X" whose X no import names: fish 3, livestock 3, hides 2.
- warIronOutsideWar: 5 towns. 2 are occupied (both are 11d) and 3 are under a siege (left to the siege's own reading).
- ventureImported: 0.

PRECISION, SAID PLAINLY. I read every distinct line of every rule, 80 lines on the 720, against the page and the record by
the second check's rules. Each line is read in at least one town; the big classes (the morning catch, the rites line, the
fish scenes, the dyer) in two to three towns each against `config.nearbyResourcesDepleted`, `economicState.primaryImports`
and the house's card. That is more than twenty instances for every rule that has twenty, and all instances of each smaller
rule. A line class is ruled once and the ruling carried to its instances. I did NOT run a second check of my own.

## 2. FOR EACH RULE: THE ONE FACT, AND THE SURFACES THAT DO NOT READ IT

**11a · THE NEED LIST.**
- THE ONE FACT is the one reader of an input, `houseInputAtHand.js :: houseInputAtHand`, which writes the gap row
  "<house> runs on imported X" (`resourceGenerator.js :: gapRowOf` via `supplyOfInput`). It reads "Iron (weapons)" as the
  smelter's ore and "Raw hides and animal products" as the tannery's livestock.
- The need list is `tradeListDisplay.js :: importsAsPrinted().needed`, printed by `EconomicsTab.jsx:829`. It reads its own
  matcher (`needMetBy` over `arriving`), never that reader. So one record says X is bought in (the gap row; the house works
  or is "Curtailed by the siege") and not brought in (the need line).
- 11a.atWork: the need list names X while a house whose trade is X prints bare. The marks leaf does not know the butchers
  (`crisisDependence.js :: HOUSE_TRADE_INPUT` has no `butchers_3_8`) or the bowyer and the boatyard (timber). So
  `houseInputAtHand.js :: housesWantingTradeInput` never marks them.
- THE CURE AT ONE FACT: the need list drops a need that a gap row of kind `imported` answers. It reads
  `crisisStoppedRow.js :: housesOnImportedInput`'s source, the gap rows, never a second matcher. HOUSE_TRADE_INPUT gains the
  butchers (livestock) and the bowyer and boatyard (timber), so the one reader marks them short where the need says not
  brought in.
- HELD: `tradeListDisplay.js` is LEFT-CHAIN's file. `crisisDependence.js` and `houseInputAtHand.js` are LEFT-MARKS's
  (its L25 touches `importsBring`, the same reader, for herbs). Neither seat holds an 11a row.

**11b · THE LOCAL-SOURCE LINE.** The one fact is the fish story, `supplyStory.js :: sourceStoryOf` together with the stored
import "Salted fish (local … fishery exhausted)". None of these surfaces reads it:
- The income line: `incomeLineSiblings.js :: trueIncomeDesc` (its `case FISH_EXPORT_LINE`) returns `FISH_RITES_LINE` where
  `ritesHoldAChain` (the record's `magicRecovery`) says so. It does this BEFORE it asks whether the salted fish is bought in,
  and the Magic tab prints no fishing. 21 instances. The twin `FISH_BOUGHT_LINE` exists already.
- The service row: `generators/services/institutionServices.js`, at the inland alternative, swaps "Fresh fish retail" for
  "Preserved fish" only where `_waterAccess === 'none'`. Where the fishery is fished out and salted fish is bought in it
  keeps "Fresh fish retail" / "Fish sold daily from the morning catch." (`data/institutionServices.js:952`). 29 descriptions
  and 51 titles and chips. The row "Preserved fish" exists already.
- The scenes: `data/arrivalProse.js:179` (drying racks) and `:181` (gutting) declare `trade at work: fish`.
  `facts/tradeAtWork.js :: tradeAtWorkOf` holds that atom for ANY fish house not short, and the fish market (a buyer of
  bought fish, unmarked by design) answers it. 6 instances. The twins exist (`:180`, `:182`).
- The card: `data/institutionDescVariants.js:271` ("Where the day's catch is sold") picks no variant by the story.
- The fishmonger: `data/people/titleSecretsPresentations.js:140` ("Talks about the boats, the catch …"). 6, LOW. It has no
  twin.
- The smelter card, `institutionDescVariants.js:697` ("what the mine yields"), is WEAK.
- The tick, the Resources tab's "What the land offers" (`ResourcesTab.jsx`), is WEAK.
- HELD: `incomeLineSiblings.js` is LEFT-CHAIN's (L7's iron twin only, in the same function; the fish arm is not held).
  `titleSecretsPresentations.js` is LEFT-LINES's. The scenes, `tradeAtWork.js`, the services generator and the desc
  variants are held by no seat.

**11c · THE "COMES FROM ELSEWHERE" LINE.**
- THE ONE FACT: is the good brought in? That is the import word on `economicState.primaryImports`, read through the need
  list `tradeListDisplay.js :: importsAsPrinted().needed` and the failed venture `supplyStory.js :: ventureOnPage`.
- The line `dossierStateProse/economy.generated.js:6672` ("A good part of the {good} {settlement}'s work uses must come from
  elsewhere; when none comes, that work stands idle.", its declaration in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`)
  declares `no crisis: under_siege` and nothing about the good. It prints for copper ore, clay and herbs that the same tab
  says are not brought in, and for the failed venture's clay (C34102).
- 11c.noImport: the fish market's inland card (`institutionDescVariants.js:2037`, "Salted, smoked and dried fish come in by
  cart") prints in 56 towns whose imports name no fish. The supply rule's story (3) asks the import by name (BR3 (b)). The
  birth writes the buyer's import word only for `VENTURE_BUYER_FAMILIES`-style families and leaves fish to the food record
  (`supplyStory.js` header; `resourceGenerator.js :: importsBroughtAtBirth`).
- HELD: the generated desks are LEFT-LINES's (ruling AX1). The birth's imports writer is touched by LEFT-MARKS's M2.

**11d · THE WAR'S IRON IN A TOWN NOT AT WAR** (2 towns of the 720, 1 of the thirty, 19 lines). Every one of these lines
reads `facts/warIronHook.js :: warHoldsIron(dependencies, imports, warState)` with the state "at war" for `occupied`
(`houseInputAtHand.js :: warIronHookOutsideWar` maps `occupied` to "at war"):
- The mark "Short of iron." on every iron house (`houseInputAtHand.js :: housesWantingTradeInput`'s warIron branch, printed
  through `crisisStoppedRow.js :: rowShortOf` on the card, its Services rows, its chips, the person's card).
- The income row "Iron & Metalwork Short of iron. …" (`incomeShortOf`).
- The hook "War has taken the iron …" (`generators/economy/foodBalance.js:827`, `outlookHookSiblings.js`).
- The scene "The forges of {name} are quiet more often than not, for want of iron." (`data/arrivalProse.js:74`, which prints
  because `trade at work: ironwork` is false under the mark).

Against them stand the import "Iron ore (local iron mines exhausted)", which the birth wrote as the story BOUGHT, and the
page's own crisis line: an occupation, and no war in CRISIS, QUARRELS, TENSIONS or PAST (the readers' C38183).

THE ONE FACT, PROPOSED: THE IMPORT'S WORD. The supply rule's BR3 (b) says "no import feeds a house the page calls short", and
the birth's word is the story. So the war's iron is taken only where the page holds a war: `warIronHook.js ::
warIronState` reads an occupation as peace unless a war is in force (the `wartime` stress). The mark, the hook and the scene
then all fall together, and the import stands. The other two proposals are worse. The mark's word would need the import to
carry the war ("Iron ore (taken for the armies)": a new word). The scene's word follows the mark.

This is the chair's to rule, because BR9 holds the mark's predicate. LEFT-MARKS's M4 holds the same copy of the war's state
for the pulse words: it is the same hunk, and it belongs to a seat after LEFT-MARKS.

**11e · A GOOD ON OFFER THAT THE STORY DENIES.**
- (siegeBought) THE ONE FACT: `crisisStoppedRow.js :: housesOnImportedInput`, over `crisisDependence.js :: INPUT_IMPORTED_AS`
  and `HOUSE_TRADE_INPUT`. Those tables have no row for the dyer, the furrier's district, the tailor's guild, the river
  boatyard or the mint. So under a siege their bought-in wool, hides, timber and bullion is not "Curtailed by the siege.",
  while the smelter beside them is. 18 instances in 8 towns of the 720, plus the mint in the thirty.
- (wantBuy) The writer is `generators/people/goals.js:449`, which fills `SUPPLY.dependency` (`data/people/goalFamilies.js:431`)
  with every `tradeDependencies` resource (`resourceFill`), the ones the need list says are not brought in included. The
  fact is the need list's (`importsAsPrinted().needed`).
- (stalls) `data/arrivalProse.js:374` declares `trade at work: arcane`, which `tradeAtWork.js` holds for the Wizard's tower
  marked Impaired. The atom reads the short mark only, never the crisis's mark.
- (offer) The need list, `importsAsPrinted().needed`, against the houses that carry the good in:
  - the fair's cards (`institutionDescVariants.js:2088` "Luxury goods available.", "luxuries to be had");
  - the luxury quarter's "The trade in silk, spice, and precious things." (`institutionDescVariants.js:996`);
  - the "Livestock auction(s)" chip (`data/crisisDependence.js:580` row; the chip from `institutionServices`).

  The leaf already has a carrier table for the spices on the chain card (`CARRIED_GOOD_ROWS`), but the need list does not
  read it.
- One case is also a supply-story fault of its own: a shepherd's "Livestock management" beside "livestock" needed, in
  r2r-hamlet-27, whose dairy farmer is the town's failed venture of livestock (a whole trade is not abandoned: BR6).
- HELD: `crisisStoppedRow.js` and `crisisDependence.js` are LEFT-MARKS's. `tradeListDisplay.js` is LEFT-CHAIN's.
  `goals.js`, `goalFamilies.js`, `arrivalProse.js`, `tradeAtWork.js` and `institutionDescVariants.js` are held by no seat.

**11g · THE GENERAL GAP LINE BESIDE THE STORY'S OWN LINE** (the chair's note of 18:05 UTC).
- THE ONE FACT: the house's story, `supplyStory.js :: sourceStoryOf` (worked out; the failed venture).
- `validationOnPage.js :: resourceGapLines` (the pushes at about lines 532 and 548) prints "No <noun> reaches <the house>."
  FIRST, then the story's own line ("… is worked out: its own ground is depleted (…)", the venture's line). The comment there
  (BIRTH-1, R4) keeps the general line ON PURPOSE: `crisisStoppedRow.js :: housesShortOfInput` (about line 620) reads the
  mark's noun ("Short of stone.") off it.
- THE CURE AT ONE FACT: where the story's own line follows, the general line is not printed; the mark reads its noun from the
  story or the gap row, not from a printed line.
- THE CHAIR'S NOTE 2, CHECKED: no rule of LAW 11 flags a forge scene by a mine's gap line. 11d reads the forge houses' own
  marks, and only under the war's hook.
- HELD: neither file is on a LEFT seat's list.

## 3. A WORKLIST FOR BUILDERS (disjoint files; the runner is the guard)

Each seat runs, at its tip, `node docs/chair/2026-11-17/bar8/AUDIT/runJ.mjs <render of the 720 and of the 150> out.json`, and
on the thirty `runJ.mjs <the thirty> out.json --controls`, whose STANDS controls of its rules must then be CLEAR, the cure
done.

| seat | files (every one) | rules | bring to |
|---|---|---|---|
| J-SCENES (now) | `src/domain/facts/tradeAtWork.js`, `src/data/arrivalProse.js` | 11b scenes (6), 11e.stalls (1 of the thirty) | 0 |
| J-ROWS (now) | `src/generators/services/institutionServices.js` (the inland alternative where the fish story is bought), `src/data/institutionDescVariants.js` (the fish market's catch variants, the fair's luxuries, the quarter's spice) | 11b.fish services and cards (29 + 3), 11b.fishTitle (51), 11e.offer's cards (12) | 0 of the services, titles and cards; 11e.offer to the livestock chips (6, J-INCOME's) |
| J-PEOPLE (now) | `src/generators/people/goals.js`, `src/data/people/goalFamilies.js` | 11e.wantBuy (6) | 0 |
| J-INCOME (after LEFT-CHAIN) | `src/generators/economy/incomeLineSiblings.js` (the fish arm of `trueIncomeDesc`), `src/domain/display/tradeListDisplay.js` (`importsAsPrinted().needed`: the gap rows of kind imported; the carriers) | 11b rites (21), 11a.imported (5), 11e.offer's livestock and the need list's half (11) | 0 |
| J-MARKS (after LEFT-MARKS) | `src/data/crisisDependence.js` (INPUT_IMPORTED_AS and HOUSE_TRADE_INPUT: dyer, furrier, boatyard, mint, butchers, bowyer), `src/domain/facts/houseInputAtHand.js` and `src/domain/facts/warIronHook.js` (11d, the chair's ruling first), `src/generators/resourceGenerator.js` (the fish buyer's import word; touched by M2) | 11e.siegeBought (10 that stand), 11a.atWork (13), 11d (19), the roots' gapImportedNoImport (8) | 0, with the tailors' 8 left (WEAK) |
| J-GAPS (now, or after LEFT-MARKS if it touches the mark's reader) | `src/domain/display/validationOnPage.js` (`resourceGapLines`), `src/domain/display/crisisStoppedRow.js` (the one hunk of `housesShortOfInput`) | 11g (129) | 0, the marks unmoved (`runJ`'s 11d and LAW 8's counts unchanged) |
| J-DESKS (after LEFT-LINES) | `src/data/dossierStateProse/economy.generated.js`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, `src/data/people/titleSecretsPresentations.js` | 11c.needed (8), 11c.venture (1), 11c.idle (1), the fishmonger (6) | 0 |

WHAT SHOULD NOT BE DONE:
- Do not rename the "Fresh fish retail" row in the catalogue (51 WEAK titles). The inland swap that J-ROWS makes cures the
  title and its description in one hunk.
- Do not cure 11c.noImport (56) by striking the fish market's inland card. Either the birth writes the buyer's word (BR3 (b),
  J-MARKS) or it is left LOW. Striking it would leave a fish market with no line.
- Leave the "What the land offers" ticks (9) alone: they are the terrain's static offer.
- Do not mark the tailors (8): they sew cloth, and wool is not their input.
- Do not cure 11d by deleting the hook alone: the mark and the scene read the same predicate, and two of three would print.
- Do not cure the eleven 11a and 11c lines sentence by sentence. Five of the need lists are the one leaf.

NEW DRAWN LINES OR ATOMS, NAMED APART (the owner's rule: only twins that say what is true):
- (1) J-SCENES: a key of the existing atom `trade at work` that reads the fish story ("fish taken here": a taker at work on a
  live ground). It is new vocabulary and goes on the veto list. The scene twins exist.
- (2) J-DESKS: the "comes from elsewhere" line needs a declaration on its `{good}`: the good is brought in. That is a
  per-good atom value, new.
- (3) J-DESKS: the fishmonger's "the boats, the catch" has no twin. A NEW DRAWN LINE.
- (4) J-ROWS: the fair's "Luxury goods available." has only a siege twin. Where luxuries are not brought in it needs a twin.
  A NEW DRAWN LINE.
- Everything else cures to a line that exists already: `FISH_BOUGHT_LINE`, "Preserved fish", the scene twins, and the marks.

## 4. STATE AND NET

THE RUNS, all at the base tree:
- the thirty: `RUN-J.30.txt` (controls 0 off);
- the 720: `RUN-J.720.txt`;
- the 150: `RUN-J.150.txt`;
- the tables: `TABLES-J.30.md`, `TABLES-J.720.md`, `TABLES-J.150.md`;
- the instances: `out-J/`.

NET (each gate run alone through `sh scripts/gate-tail.sh`, at the tip 27b5fad43 before the last push):
- `npm run typecheck:domain:strict`: exit 0 (1113 errors, ceiling 1113).
- `npm run typecheck:ratchet`: exit 0 (167, ceiling 167).
- `npx eslint` on `law11Supply.mjs`, `runJ.mjs` and `tablesJ.mjs`: exit 0.
- `npx vitest run tests/architecture`: exit 0.
- ALL of `tests/lint`, at the base (a worktree at e0242a12a) and at the tip, compared by test name: both exit 1, with 3142
  passed and 68 failed at each, and 0 tests differ by name. The 68 are red at the base itself (the any-cast baseline, the
  fact-layer walker, the pool-dominance walker and others; one needs the ledger ref `review-fixes-2026-07-08`, absent in a
  fresh worktree). So no walker owes my new helper file a registration.

LEFT FOR NEXT, BY NAME: nothing of the brief is undone.
- 11e.stalls is narrow: it finds only the control's reagents. A wider scene-goods reading belongs with J-SCENES' atom.
- My precision is my own reading by the second check's rules, not a second check.
