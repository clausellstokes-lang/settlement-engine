# FAULTS-NEED hand-back

Seat FAULTS-NEED of the round FAULTS (BRIEF-FAULTS, section FAULTS-NEED, with the chair's amendment to item 4 of 06:55 UTC).
Base 4288049bad6fba2382a8bddbb4d6de5d543580d9 (`lane/faults-base-2026-11-18`); branch `lane/faults-need-2026-11-18`.
Guard: `tests/generators/faultsNeed.test.js` (11 tests). Red at the base: item 0's arms fail there by name; the other items
cannot import the leaf there. Green at the tip.

## 1 · The commits

| item | commit | what |
|---|---|---|
| hand-back | 7a635d72b, de0696e1a, this one | the file |
| 0 | 48fbd836e | the need list keeps a need a live house is marked short of |
| 1 (THE ATOM) | d75011e68, bbe7b490c (reversed by FR13), 4b410e109, the FR13 commit | `need not brought in` (FR2): `src/domain/facts/needNotBroughtIn.js` |
| 2 | 926d31812 | 11e.wantBuy: a dependency goal presumes a supply only of a good that is had |
| 4 | 92c99b5ca, then 61a6c4f85 (as amended) | 12d: DS-ECO-8 POOR v1 `no need not brought in: any`; its twin v6 |
| 3 | none | measured; nothing built (section 2, item 3) |

4b410e109 and the FR13 commit change the leaf's form, not its reading. FR13 (the chair, 08:28 UTC) reversed bbe7b490c's luxury
keys: the leaf now IMPORTS `LUXURY_CLASS` and `NOT_A_GOOD` from their home, with no copy (section 6).
- The working chain statuses stay copied (4b410e109): the import was refused by `tests/build/vendorPdfLazy.test.js`, whose
  WEAVE ST-2 goods roster in `goods.schema.js` declares `chainWorking.js` lazy.
- It was not refused by EG1's `engineCoreLazyEdge`.

## 2 · Each item with its proof

**Item 0: the need list hides a need the page does not meet (MED 1).** `tradeListDisplay.js :: dealtInHere` no longer drops
a good that a live house of the town is marked short of. It reads the page's own mark (`markedShortNouns`): the short set of
`houseInputAtHand.js :: housesShortOf`, filtered to houses whose dependence holds INPUT, which is `rowShortOf`'s gate. The
guard holds that reading against `rowShortOf` on its towns.

The five towns of the 720, and the 150's one:
- r2r-village-47 (the 720): the need STAYS. Its Dairy farmer prints "Short of livestock." It now prints "Needed, and not
  brought in: salt, livestock." (before: "salt").
- bar0-village-calm-rand-29 (the 150): the need STAYS. Its Dairy farmer prints "Short of livestock." It now prints
  "Needed, and not brought in: livestock." (before: no need line).
- r2r-city-43, r2r-metropolis-12, r2r-metropolis-19, r2r-metropolis-25 (the 720): the need STAYS DROPPED. A fair's
  livestock auction stands there, and no house is marked short of livestock (their only mark is the Stone quarry's).

Over the 900, exactly these two need lists move (measured, base reader against tip reader on the same records).

**Item 1: THE ATOM (FR2).** `needNotBroughtIn.js` is an import-free leaf in the eager core. It imports only
`criticalImportBroughtIn.js` (whose family words and matcher are now exported: no third copy), `liveInstitutions`,
`supplyStory.js :: ventureOnPage` and `chainPrintName`. Its readers:
- `needListOf(record)`: the list, label by label.
- `needNotBroughtInOf(record)`: keyed `luxury`, `spice`, `silk`, `precious`, `salt`, `fuel`, `livestock`, `any`.
- `goodNeededNotBroughtIn(record, good)`.

The vocabulary entry sits beneath `critical import brought in`. Its layer is 4, and its row declares `resourceAnalysis`,
`economicState`, `institutions`, `availableServices`, `config` and `tier` (the walker found the last two). Its getter returns
the keyed object; the calm double's row reads all keys false (a want, like `uprising`); the `PRESENCE_SETTER` row is added.

HELD EQUAL to `importsAsPrinted(record).needed`:
- **900 of 900 towns** (the thirty, the 150, the 720), label by label: 0 differ; 720 of them hold a need. This was measured
  in scratch; the guard births 40 of these towns.
- At the step the goals are dealt (`goalContextOf`, through a capture hook in a scratch tree): 900 of 900 equal the printed
  list.
- On a constructed record for each branch of the page's reader:
  - a category error;
  - the luxury band;
  - an import that meets a need under another name;
  - a worked good;
  - an export;
  - a working chain against a broken one;
  - a gap row of kind `imported` against one of kind `missing`;
  - a live house's service row against a dead house's;
  - a house marked short;
  - the failed venture's material (r2r-hamlet-27's livestock stays).
- The two copied rows are held to their homes: `NEED_DEALT_ROWS` (now exported) and `WORKING_CHAIN_STATUSES`.
- `NOT_A_GOOD` and `LUXURY_CLASS` are imported from `tradeListDeclarations.js`, which imports nothing (FR13 (a)). The
  lazy-edge test, `vendorPdfLazy` and `bootSmoke` are green with that import, after one build. The vocabulary's keys are held to `NEED_KEYS`. On the guard's towns, the atom reads alike through
  `factsOf`, the public form and the share veil.

MUTATIONS, each turning the guard red (2 tests):
- strike the page's `importedByGapRow` clause;
- strike the leaf's `gapGoods` clause.

The lazy-edge test is green.

**Item 2: 11e.wantBuy.** `goals.js` asks the leaf (`ctx.needUnmet`). Where a dependency's good is on the need list, its
SUPPLY dependency lines are marked REFUSED. They stay in the draw, so no other card's draw moves (the POWERS-9 mechanism), and
a refused pick takes the family's next admitted candidate.

The matcher reads only the need's families against the good's words (`meets(need, good)`). A wide word of the good asks
nothing: "Metal ore + fuel" is not refused beside a copper need where iron comes in. My first matcher refused it both ways;
that was measured, narrowed, and the guard holds it.

R7: 183 draws over the 900 met a refused dependency. The fewest goals left that card could deal was 7; none fell under three.

runJ `11e.wantBuy`:

| population | base | tip |
|---|---|---|
| the thirty | 1·1 | 0 |
| the 150 | 0 | 0 |
| the 720 | 4·4 | 1·1 |

- C8867 is now clear (it was a "stands" control: the controls-off count goes from 14 to 15 by it).
- The one left in the 720 is r2s-recently_betrayed-city-2, "Learn who controls the supply of livestock and game": runJ flags
  it as "whose story is idle". That is the SUPPLY STORY's half, not the need list's: left by name.

**Item 3: the butchers and one good under two words. MEASURED, NOT BUILT.** The rule "a need leaves the list where an
arriving import names its catalogue good under its other word" (`goodsCatalog.js :: exactGoodId`) would drop 49 needs over
the 900 (1 of the thirty, 7 of the 150, 41 of the 720). EVERY ONE is "spices" beside "Luxury textiles and exotic goods" or
"Luxury goods": the catalogue files spices under `luxury_goods`. It drops NO livestock or hides need:
- "Livestock for meat and draft" (the butchers' need) has no exact catalogue id;
- "Raw hides and animal products" is livestock's alias, but no need "livestock" stands beside it in any town.

So the rule's own measure for the hides and the beasts is 0. Its 49 drops would hide a want the page does not meet:
"Luxury textiles and exotic goods" does not say spices, and the page's own matcher keeps the spice and luxury families apart.
The STOP TEST therefore stands for every instance, and nothing is built.

- r2r-city-43's need stays dropped by the fair's livestock auction (item 0), as J-INCOME-2 left it.
- bar0-town-calm-rand-46: likewise.
- The roots' `gapImportedNoImport` rows for livestock and hides read as at the base. Those gap rows of kind `imported`
  already answer their need in the need list (`importedByGapRow`). The detector's word list being narrower than the
  catalogue is the tools' seat's (named, not changed).

**Item 4: 12d's need-list half, as the chair amended it.**
- v1 declares `no need not brought in: any`.
- ONE TWIN at the pool's next number, **v6** (nothing renumbered), with v1's angle and bands
  (`[ledger · crisis: any · food: ≥ secure · need not brought in: any]`).
- `DS-ECO-8::POOR`'s pool-table row already stood at 5 (BAR8-DESKS-2), above the atom's 4; its note now names the atom.
- Regenerated by `npm run gen:dossier-prose`, the wiring census re-taken in scratch only (AX1). Only `economy.generated.js`
  is committed; `proseNorms.generated.js` did not move.
- DS-ECO-12 and every other pool of the economy desk are untouched.

runK:

| rule | the thirty | the 150 | the 720 |
|---|---|---|---|
| `12d.enough` | 0 → 0 | 0 → 0 | 1·2 → 0 |
| `12d.enough.wide` | 0 → 0 | 5·10 → 0 | 22·44 → 0 |

R7, the refused slot, in every town of the populations where v1 printed at the base (1 + 5 + 35 towns): v6 prints where it is
drawn; otherwise v3 ("the old buildings are patched … nothing new goes up") or v2 ("The town gets by. Nobody is going without
bread …") prints, each under its own declaration (v3 `no trade at work: building`; v2 `no hunger · food: ≥ secure`). v6 also
takes draws in 14 towns where v1 did not print. Every one of the 35 towns printing v6 holds a need list, so v6 is true there by
its premise; the full list is in section 3's scratch output, and its three towns are below.

## 3 · The rules before and after (runJ LAW 11 and runK LAWS 12 to 15; base → tip; towns·lines)

| population | rule | base → tip |
|---|---|---|
| the thirty | J `11e.wantBuy` | 1·1 → 0 |
| the thirty | every other J rule | unchanged: 11b.fish 3·4, 11b.ironOre 1·1, 11b.landOffers 1·1, 11c.noImport 3·3, 11e.offer 1·1, 11e.siegeBought 2·2, 11e.stalls 1·1 |
| the thirty | every K rule | unchanged |
| the 150 | J `11e.offer` | **2·2 → 3·3 (RISES)** |
| the 150 | every other J rule | unchanged |
| the 150 | K `12d.enough.wide` | 5·10 → 0 |
| the 150 | every other K rule | unchanged |
| the 720 | J `11e.wantBuy` | 4·4 → 1·1 |
| the 720 | J `11e.offer` | **15·15 → 16·16 (RISES)** |
| the 720 | every other J rule | unchanged |
| the 720 | K `12d.enough` | 1·2 → 0 |
| the 720 | K `12d.enough.wide` | 22·44 → 0 |
| the 720 | every other K rule | unchanged |

**THE ONE RULE THAT RISES, `11e.offer` (+1 in the 150, +1 in the 720), IS ITEM 0's OWN CONSEQUENCE, NAMED FOR THE CHAIR.**
- In bar0-village-calm-rand-29 and r2r-village-47, the restored "Needed, and not brought in: livestock." now stands beside
  the Shepherd's chip "Livestock management", which J-INCOME-2's drop had hidden.
- The fault under both is the record's: the Dairy farmer is marked "Short of livestock." beside a Shepherd who keeps flocks.
- The cure is the supply story's (FAULTS-BIRTH's files: `houseInputAtHand.js` / `supplyStory.js`, the reading of a source
  house beside its taker) or the row's (a mark on the shepherd's chip). Neither is my file.
- I did not re-hide the need: the brief's item 0 says it is never dropped there.

## 4 · New and changed lines (the veto list), each with three towns it prints in

- **NEW (the twin given by name), DS-ECO-8 POOR v6:** "{settlement} feeds itself and has nothing to spare. Some of what its
  work needs does not reach it, and there is no line for anything else." It prints in r2r-hamlet-21 (stone, salt),
  r2s-religious_conversion-town-3 (stone, copper ore, gold and silver ore) and bar0-town-occupied-rand-27 (copper ore, gold
  and silver ore). 35 towns over the 900 print it.
- **NEW VOCABULARY:** `need not brought in: <key>`. Its keys are listed in section 2 item 1; `any` is the chair's.
- **NO OTHER NEW WORDS.**
  - "Needed, and not brought in: livestock." newly prints in two towns (item 0, the page's own line).
  - Item 2 moves goals only among the pool's own lines.

## 5 · Declared moves (R5), the 525 and the stored figures

- **`npcs[].goal`** (item 2) is the only stored field family that moves. No other part of any record of the 900 moves.

  | population | towns | cards | where |
  |---|---|---|---|
  | the thirty | 1 | 7 | bar0-city-wartime-rand-45 |
  | the 150 | 3 | 8 | bar0-city-wartime-rand-31 (6), bar0-hamlet-under_siege-rand-39 (1), bar0-town-occupied-rand-40 (1) |
  | the 720 | 37 | 69 | the full list is the scratch probe's (`moves.mjs`); its first: r2r-hamlet-56, r2r-village-8, r2r-town-3, r2r-town-9, r2r-town-23 |

  A card's goal moves where the draw had picked a refused line: it takes the next admitted one.
- **THE 525: 13 of 525 move against the base** (the golden's own hash, `JSON.stringify` of the record). They are
  town·{germanic, norse, east_asian, south_asian}·desert·road, city·{latin, celtic, arabic, slavic, mesoamerican, steppe,
  greek, mediterranean}·mountain·road, and town·germanic·plains·road (gm-seed-c). The fixture is not written.
- Items 0 and 4 move no stored record; they are display.
- NO NEW FIELD ON THE SAVED RECORD. Nothing reaches `settlementMigrations.js` or `mutateEntities.js`.
- **STORED FIGURES MY WORK MOVES (the close's to re-take; none re-taken by me):**
  - The state corpus's variant count, **3042 → 3043** (v6), read by four tests:
    - `proseComposed.walker` ("the shipped state corpus", 3033 stored);
    - `proseWiringCensus.walker` ("the R1 corpus", 3033);
    - `composeStateProse.test` ("variants", 3033);
    - `dossierStateProseProjection.contract` (the SHIFT REGISTER MUTANT arm, 3033).
  - `proseEntryContradiction.walker`'s corpus counts: **3510 → 3511** and **2802 → 2803** (3501 and 2794 stored).
  - The economy desk's header: 469 → 470 variants.
  - `sovereigntyLightingContract.walker`'s estate file count: **3690 → 3691** (the new leaf; 3641 stored).
  - The wiring census (`docs/content/wiring-census.json`): stale at the base already; re-taken in scratch only, not
    committed.
  - The golden master: 13 of 525 rows, above.

## 6 · The net (each gate alone, through `gate-tail.sh` or to a JSON report; base = an archived tree of 4288049b, given a scratch git repo; tip = this checkout)

- **typecheck:domain:strict**: base 1113 (ceiling 1113), tip 1113. Exit 0 both.
- **typecheck:ratchet**: base 167 (ceiling 167), tip 167. Exit 0 both.
- **eslint** on every changed file: 0 errors.
- **tests/architecture**: base 347 pass, 0 fail; tip 347, 0 fail.
- **tests/joins**: base 425 pass, 0 fail; tip 425, 0 fail.
- **N3** (pipelineContract, isolatedTrade, pipelinePinnedMode, generationForkCensus, publicProseEquality): 6 reds at the
  base, the same 6 by name and message at the tip.
- **tests/lint**: base 42 reds, tip 43. Every red was compared by message:
  - **The same at both, a stored figure moved by one:** proseComposed, proseWiringCensus, proseEntryContradiction ×2 and
    sovereigntyLighting (section 5).
  - **Differs by checkout only:** ledgerCitationIntegrity (it needs the ledger branch).
  - **Red at the base only (the scratch repo has no history):** domainAnyCastBaseline.
  - **Mine, found and cured:**
    - `negativeAssertionAnchor.walker`: my guard's three bare negatives, now anchored.
    - `presumptionClasses.walker`: the leaf's copy of the luxury labels read as 5 new prose lines. bbe7b490c held them as
      `~` keys; FR13 reversed that: a seat does not reshape a literal so that a walker passes. FR13 (a) is now taken: the
      leaf imports the labels' home, so there is no copy. The walker reads 3 fresh and 153 stale, exactly as at the base,
      with nothing banked.
  - **`factLayers.walker`:** its two reds are the base's (`importsAsPrinted` undeclared `availableServices`: the income
    seat's; the POOLS register). My row is clean.
  - The rest: the base's own, by name and message.
- **Build:** ONE `npm run build`, exit 0.
  - `tests/build/vendorPdfLazy.test.js` caught `src/domain/facts/chainWorking.js` flipping from lazy to eager in the goods
    roster (`goods.schema.js`, not my file) through the leaf's import. Cured at 4b410e109: the leaf copies the one constant,
    held equal by the guard.
  - `vendorPdfLazy`, `bootSmoke` and `engineCoreLazyEdge`: green, and green again after the FR13 import (a second build).
  - The leaf still equals the page on 900 of 900 towns.
- **Older tests:** every test file that names a function, constant or line I changed (grep over `tests` for `importsAsPrinted`,
  `NEED_DEALT_ROWS`, `dealtInHere`, `criticalImportBroughtIn`, `FAMILY_WORDS`, `calmFactsDouble`, `needNotBroughtIn`,
  `dealGoals`, `goalContextOf`, `DS-ECO-8`, `tradeListsAsPrinted`, `GOAL_FAMILY_LINES`; 47 files outside `tests/lint`, plus
  the 13 named earlier) was run at the base and the tip in one report per side.
  - Base 13 reds, tip 13 reds: the same by name and message, save the variant count moved by one (3042 → 3043).
  - `tests/domain/bar8DesksEco.test.js` was RE-KEYED: its 12d readings hold the need atom met, because its anchor (a town on
    no road) holds a need.
  - `tests/domain/crisisBlindDossierProse.test.js` takes the `PRESENCE_SETTER` row.
  - `rosterFinalUnderHeldRoster`'s golden-row red reads 38 rows at both base and tip.

## 7 · Left by name

- **The shepherd beside the short dairy** (bar0-village-calm-rand-29, r2r-village-47): the `11e.offer` rise. The supply
  story's or the row's (section 3).
- **11e.wantBuy's story half** (r2s-recently_betrayed-city-2, "livestock and game", story idle): not the need list's.
- **The catalogue's spices under `luxury_goods`** (item 3's 49): the catalogue's coarseness, not built. Its detector word
  list is the tools' seat's.
- **The fair, the quarter and the fish market's card:** FAULTS-ROWS's, on the atom (keys `luxury`, `spice`, `silk`,
  `precious`).
- **By the brief:** the timber nine of 11a.atWork, the tailors' livery and the three bare income shares: not built.

## 8 · FR15 (the chair, 09:37 UTC, after READ-NEED): the luxury pool through its door

**(1) The cure at the cause.** The leaf no longer unwraps `LUXURY_CLASS`, and `luxuryBandHolds` with its hard-coded band is
gone. `keptOnImports` sends every item through the kernel's door as the page does (`tradeListDisplay.js :: displayTradeList`):
- a luxury goes as `{ text: raw, needs: row.needs }`, its row found by a lookup (`LUXURY_CLASS.find`, which keeps the row);
- every other item goes as a bare line;
- the call is `filterDeclared(declared, { facts: () => ({ tier }), poolId: 'trade-list:imports', surface: 'economics',
  drawKind: 'A' })`. The facts are the record's tier in the door's shape, so `factsOf` is not called.

The door may be imported: `drawDeclared.js` routes to engine-core, and `engineCoreLazyEdge` is green.

The guard's arm "every row needs exactly tier: ≥ village" is REMOVED. The leaf now reads each row's own declaration, and
its equality to the page on every town (and on the constructed hamlet against a town) is the claim.

The leaf still equals the page on 900 of 900 towns. The golden does not move against the previous tip (0 of 525; 13 of 525
against the base, as before).

**ARM 3 IS NOT GREEN: ONE FRESH SITE REMAINS, AND I STOPPED THERE.** The site is the read of the door's own output:
`needNotBroughtIn.js :: filterDeclared(declared, { facts: () => ({ tier }), poolId: 'trade-list:imports', …`. That is
`.map((line) => String(lineText(line)))` on what the door admitted. It is the page's own shape: the widened register banks
it there as `src/domain/display/tradeListDisplay.js :: filterDeclared(declared, { facts: () => factsOf(settlement), poolId:
`trade-list:${…`, reason `not-a-draw`. A seat banks nothing, and I did not reshape the read. One shape would avoid the read:
keep the raw items whose declared line the door admitted, by identity. It is the chair's to allow or refuse (FR13, FR15).
ARMS 1 and 2 read as at the base: 38 fresh, 79 stale.

**Budget arms, `VERIFY_DIST=1`** (one build per side; the figures are the last close's, red at both):

| figure | base 4288049b | tip d3cdb5207 (READ-NEED's read) | tip with FR15 |
|---|---|---|---|
| the engine chunk | 906,842 | 906,944 | 906,944 |
| first-paint raw | 1,168,138 | 1,172,712 | 1,172,766 |
| first-paint gzip | 371,842 | 373,167 | 373,215 |
| first-paint Brotli | 312,201 | 313,377 | 313,302 |

- The four ceilings stored at the base are 881,331, 1,139,072, 362,621 and 304,224. All four arms are red at the base and
  at the tip; the moves are the close's to re-take.
- `bootSmoke` is green at both. Every other `vendorPdfLazy` arm is green at both.

**(2) The other copies held to their homes.**
- `MARK_RES` is held equal to `tradeListDisplay.js :: MARKS` (now exported).
- `TIERS` has left the leaf with the band; nothing remains to hold.
- `NEED_DEALT_ROWS_COPY` and `WORKING_CHAIN_STATUSES_COPY` are held as before.

**(3) For the last close.**
- The mutation manifest takes one more name: `tests/generators/faultsNeed.test.js`.
- The four size figures are in the table above.
