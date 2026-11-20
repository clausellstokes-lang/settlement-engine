# PLACE-1 MEASURE 1: `economicState.situationDesc` (the trade line)

Measured by a PLACE-1 MEASURE builder, 2026-11-20, at 948acb88e (its `src/` equals 43ab0f5eb's: that commit adds docs only). Briefs: `BRIEF-MEASURE-COMMON.md`, `BRIEF-MEASURE-situationDesc.md`. No file under `src/` or `tests/` was changed.

Every figure below comes from a script under `tools/situationDesc/`, named beside it. To re-run, from the repository root (node_modules linked):

```
cd docs/chair/2026-11-20/content/place/tools/situationDesc
node measure.mjs <repo> 100 plain   > rows-plain.json     # the 600 births, census-exact
node measure.mjs <repo> 100 capture > rows-capture.json   # the same, with the lists at the writer
node explore.mjs rows-plain.json > explore.out.txt
node report.mjs <repo> rows-plain.json rows-capture.json census100-before.json > report.out.txt
```

The two `rows-*.json` files (1 MB and 2.7 MB) are not committed. They come back in about two minutes each. `report.out.txt` and `explore.out.txt` are committed as written.

`measure.mjs` copies the chair's birth lines and mask verbatim from `docs/chair/2026-11-20/seventh/measures/stored-census/census.mjs`. That file is not on this branch. It sits at bca8c6fe3 (`lane/chair-2026-11-08`), and PLACE-1's scratch copy is byte-identical. **Its before agrees with the chair's census100-before.json in every size**: the same top count and the same number of distinct lines (`report.out.txt`, "BEFORE"). The census file is copied here as `tools/situationDesc/census100-before.json`.

**The finding that frames this proposal: since SW-B7b, no page prints this line on a fresh birth.** The Economics tab dropped it as its "legacy fallback" (`EconomicsGlance.jsx` header comment). `tests/ui/economicsTabFlow.test.js` pins that absence on the DM and player views, and `tests/components/publicProseEquality.test.jsx` pins it on the shared page. Its only remaining print is `settlementQuickGuide.js :: composeMaterialTruth`, and only when the record has no prosperity, food or export to say. A fresh birth always has one, so that print is a fallback for legacy saves. The sameness is real in the stored record, in the PDF closure's reach (`scripts/.writer-reach-baseline.json`: "dossier-pdf=R web-transitive=R") and in the engine bundle. It is not on a page a DM reads today. See G1.

---

## A. THE BRANCHES

The writer is `src/generators/economy/prosperity.js :: situationDescOf`. It is wrapped by `:: deriveEconomicSituationDesc`, which runs `resolveSibling` over `:: PROSPERITY_LINE_SIBLINGS` (the market twins: a line naming the market needs `market`, and its twin excludes it). The band is read through `:: tradeBandFor`: the slider's band is re-keyed to the label's when `:: tradeBandContradictsLabel` says the two would disagree. `:: TRADE_LINE_BANDS` matches the band lines by their opening words. The `primaryStress` is the first of a fixed priority list present in the config's stresses. A stress with no branch of its own (recently_betrayed, succession_void, infiltrated, monster_pressure, insurgency, mass_migration, wartime, religious_conversion, slave_revolt) falls through to the band lines.

| # | branch (report id) | condition, in one sentence |
|---|---|---|
| 1 | siege (twin: no market) | The primary stress is `under_siege`. |
| 2 | famine (twin) | The primary stress is `famine`. |
| 3 | occupied | The primary stress is `occupied`. Its channel words follow the world law: maritime levies, river tolls or road tolls. |
| 4 | indebted | The primary stress is `indebted`. |
| 5 | plague (twin) | The primary stress is `plague_onset`. |
| 6 | fractured | The primary stress is `politically_fractured`. |
| 7 | foodGap | The food record's gap is above `FOOD_SECURITY_CUTS.importDependent`. It reads "much of" above the deficit cut. |
| 8 | isolatedTooBig | The route is disconnected, the tier has trade-route features (town and up), and there is no teleport infrastructure. |
| 9 | isolatedMagic | The same as 8, with teleport infrastructure. |
| 10 | isolatedStateCrime | Isolated and below town, under the state-crime stress flag. |
| 11 | isolatedHigh | Isolated and below town, with a high or very-high trade band. |
| 12 | isolatedLow | Isolated and below town, with a low or very-low trade band. |
| 13 | isolatedMedium | Isolated and below town, with any other band. |
| 14 | theocratic (twin; needs `sacredHouse`) | The stress flag `theocraticEconomy` is set. |
| 15 | merchantCrime | The stress flag `merchantCriminalBlur` is set. |
| 16 | stateCrime | The stress flag `stateCrime` is set (connected route). |
| 17 | veryHigh (twin) | The trade band is very_high. |
| 18 | high | The trade band is high. |
| 19 | low (twin) | The trade band is low. |
| 20 | veryLow | The trade band is very_low. |
| 21 | blackMarket | The criminal-effective band is high or very_high. |
| 22 | **medium** | Everything else: **"Trade proceeds at an ordinary pace for a settlement of this size."** |

Share by size, 100 places a size, seeds `hxd-<size>-0..99` (`report.mjs` → `report.out.txt` §A):

| branch | thorp | hamlet | village | town | city | metropolis |
|---|---|---|---|---|---|---|
| **medium** | **67** | **62** | **68** | **89** | **89** | **85** |
| isolatedMedium | 9 | 13 | 11 | 0 | 0 | 0 |
| plague | 3 | 5 | 6 | 3 | 2 | 2 |
| fractured | 2 | 3 | 4 | 5 | 5 | 2 |
| low | 5 | 7 | 6 | 0 | 0 | 0 |
| indebted | 5 | 1 | 1 | 1 | 2 | 7 |
| famine | 6 | 5 | 1 | 1 | 0 | 0 |
| occupied | 2 | 3 | 1 | 1 | 1 | 0 |
| siege | 1 | 1 | 0 | 0 | 1 | 4 |
| isolatedLow | 0 | 0 | 2 | 0 | 0 | 0 |
| the other 12 | 0 | 0 | 0 | 0 | 0 | 0 |

The market-less twins printed in thorp 15, hamlet 18 and village 11.

**Only the medium branch crosses the bar, and it crosses it in every size.** The next highest is isolatedMedium at 13 of 100 hamlets: under the bar, and not reworded here. The high and very-high branches never fire on these births: the economy output is at 70 or over in 0 of 600 (`report.out.txt` §A). That dial, not the wording, is why nearly every connected place lands on the medium line.

## B. THE READERS

**(i) Who prints it.**
- `src/domain/summary/settlementQuickGuide.js :: composeMaterialTruth`. It prints `sentence(situation)` only when prosperity, food and top export are all empty; otherwise it names the path `economicState.prosperity|foodSecurity|primaryExports`. A fresh birth never reaches the fallback. A change moves nothing there, except a legacy record with no label, which keeps its stored line anyway (rule 5).
- `src/components/new/tabs/EconomicsTab.jsx` and `EconomicsGlance.jsx` mention it in comments only. They print it nowhere (SW-B7b).
- `src/pdf/**` does not read it. The PDF's "situation" is a different view-model field (`pdf/lib/viewModel.js`).
- `supabase/functions/_shared/engineBundle.js` holds the writer's code, as an esbuild bundle of the engine. It is not a reader, but it must be rebuilt (F, G3).

**(ii) Who matches its words.**
- `src/generators/generationCoherence.js :: projectionAgreementFindings` runs two checks. `MARKET_NAMED` on the line against `facts.market` finds "names a market the town does not have". `TRADE_LINE_BANDS` with `tradeBandContradictsLabel` finds "the trade line says the opposite of the prosperity label". A new wording must name a market only under `needs: ['market']`, and must not open with a band pattern. The projection checks both (0 of 460 composed lines open with a band pattern).
- `src/generators/generationCoherence.js :: buildGenerationCoherenceReceipt`: its `foodVerdicts` look for `/self-sufficient/` in the line. No wording uses the word.
- `src/generators/economy/prosperity.js :: PROSPERITY_LINE_SIBLINGS` is keyed by text. The canonical medium line is not a key (it has no twin), so nothing there moves.
- `src/domain/coherence/foodWordsFindings.js :: foodWordsFindings` is read on this field by `tests/domain/foodWordsFindings.test.js` (24 births). A wording must not carry `SURPLUS_WORDS` beside a record that grows less than it eats, nor `TABLE_WORDS` ("table", "meals"). The projection finds 0 surplus-word lines.
- `tests/lint/presumedThings.walker.test.js`, through `presumedThings.shared.mjs` and `src/domain/facts/registeredWords.js`. ARM 1 reds on a source literal naming a registered thing (here, "market") without a declared atom that a draw door reads. ARM 2 reds on a corpus sentence naming a thing the town lacks. The wordings declare `market`. "By sea" names no registered word ("docks", "harbour" and "quays" are; none is used).
- `tests/lint/presumedThings.register.json` rows 732 and 737 hold the sluggish and church lines. They are untouched.
- `tests/generators/projectionAgreement.test.js`:
  - Its planted-record tests (`F11`, the market member) pass literals, the canonical line among them, and survive any change.
  - **Its `LIVE` table row `'the trade line beside the prosperity label'` (`/sluggish|brisk|ordinary pace/`) can move.** It needs at least one arm-2 birth to match. Several wordings keep "an ordinary pace", and the sluggish lines remain, so it is expected to hold, but it is unproven until the builder runs it.
- `tests/generators/foodModelSingleWriter.test.js` (the food-gap branch's words), `tests/simulation/semanticFixtures.test.js` (siege at its line 259, isolated at its line 370), `tests/generators/churchNoteReadsFlag.test.js` (an isolated-magic town) and `tests/generators/foodRecord.test.js` (direct `deriveEconomicSituationDesc` calls on the food-gap branch) pin other branches only. None of them moves.
- `tests/generators/coherenceAgreeCures.test.js` pins the church pair of `PROSPERITY_LINE_SIBLINGS`. It does not move.
- `src/generators/narrativeGenerator.js :: genCoherence` no longer reads the line: `churchControlsEcon` reads the flag (mutation manifest row, `scripts/mutation-coverage-manifest.json`).
- Comment or title mentions only, no read: `src/domain/display/stateProse/generalStateProse.js` (the `COHERENCE_POOL_OF` doc comment), `src/data/dossierStateProse/economy.generated.js` (the DS-ECO-1 title; its slots do not read the field) and `src/domain/settlement.schema.js` (the type).
- The registers: `scripts/lib/writer-dark-register.mjs` and `scripts/.writer-reach-baseline.json` (the field's reach row), and `tests/lint/writerReach.walker.test.js` (counts only). A text change moves none of them.

**(iii) Who composes from it.** Only `composeMaterialTruth` (its fallback, above). No other writer quotes the line into another string.

**Test files that pin a literal of the field:**
- `tests/generators/projectionAgreement.test.js`: the canonical line, planted; and the `ordinary pace` regex, live.
- `tests/generators/foodModelSingleWriter.test.js`, `tests/generators/foodRecord.test.js`, `tests/simulation/semanticFixtures.test.js`, `tests/generators/churchNoteReadsFlag.test.js` and `tests/ui/economicsTabFlow.test.js` (a planted line) pin other branches or planted text.

**Whole-record pins that move with any change to the line:**
- `tests/fixtures/generator-golden-master.json`, read by `tests/property/generatorGoldenMaster.test.js`: it is a hash manifest, so it needs a re-record that is written down.
- `tests/build/engineBundleReplay.test.js`: the bundle must be rebuilt.

## C. THE FACTS AT HAND (the medium branch)

Read off the FINAL record of the 460 medium places (`report.out.txt` "§C FACTS AT HAND"; the goods by size are in `explore.out.txt`):

| size (medium) | exports | imports | market | guild | routes | distinct lead export | distinct lead import |
|---|---|---|---|---|---|---|---|
| thorp (67) | 63 | 37 | 0 | 0 | road 32, river 20, port 8, crossroads 7 | 13 | 1 (salt) |
| hamlet (62) | 60 | 62 | 5 | 3 | road 27, crossroads 15, river 13, port 7 | 16 | 5 |
| village (68) | 68 | 68 | 19 | 18 | road 27, river 21, crossroads 12, port 8 | 20 | 9 |
| town (89) | 89 | 89 | 89 | 89 | road 52, river 15, crossroads 13, port 9 | 24 | 14 |
| city (89) | 89 | 89 | 89 | 89 | road 30, river 28, crossroads 17, port 14 | 25 | 17 |
| metropolis (85) | 85 | 85 | 85 | 85 | road 46, river 21, port 10, crossroads 8 | 26 | 13 |

**The commonest lead export holds 9 to 14 places in a size.** For example, Sacred wood in 14 metropolises and Milled flour in 14 cities. **The lead import is concentrated**: Salt leads in 37 thorps and 37 hamlets, Iron in 39 towns.

| fact | its home | reads the final record? | equal at the writer? |
|---|---|---|---|
| exports | `canonicalAccessors.js :: canonExports` (`factsOf(...).exports`) | yes | **yes: 0 of 600 births differ** |
| imports | `canonicalAccessors.js :: canonImports` (`factsOf(...).imports`) | yes | **no: 403 of 600 differ (347 of the 460 medium places)** |
| prosperity label | `prosperityRank.js :: prosperityLabelOf` | yes | yes: 0 of 600 differ |
| market | `facts/market.js :: marketOf` (live roster) | yes | the roster can change after the economy (the 101 re-derived births). The writer then re-runs on the final roster, so the market it reads is the one the stored line reads. |
| route | `facts/terrain.js :: tradeRouteOf` (the config) | yes | yes (the config) |
| guild | `facts/guild.js :: guildOf` | yes | not used: every town and up holds one, so it varies nothing |

**Where the import list changes after the writer.** `economyReconcilePass` appends demand imports and runs `finalizeTradeLists`. Then `generateNarratives` runs `resourceGenerator.js :: generateResourceAnalysis`, which writes imports again through `importsBroughtAtBirth` and `importWordsOfImportedGaps`. After economyReconcilePass, 330 of 600 still differ from the final record; after generateNarratives, 0 of 600 differ, for both lists.

**A good the page does not print.** The record's lead export is absent from the printed list (`tradeListDisplay.js :: tradeListsAsPrinted`) in 22 of the 454 medium places that hold an export, and 5 of them print no export at all. Every lead import is printed except 10 villages.

**How the instrument works.** `capture-hooks.mjs` wraps `generateEconomicState` in memory at module load, and `onStep` snapshots the lists after each step. It moves nothing: 600 of 600 births are identical (line, both lists, label) with and without it. `generateEconomicState` runs twice on 101 of 600 births, and the last call's line is the stored line in 600 of 600.

**The seed is not reachable at the writer.** `config._seed` is present at `generateEconomicState` in 0 of 600 births. The effective config carries no `_seed`, as `generateNarratives.js` says in its own comment, and stamps it there. `ctx._seed` is in scope in `economyReconcilePass` (it already hands it to `generateAvailableServices`) and in `generateNarratives` (it hands it to `generateResourceAnalysis`, `generateSettlementReason` and `generateHistory`).

**The key form `pickVariant` callers use:**
- `narrativeGenerator.js :: generateSettlementReason` uses `` `${seed}::settlement-tier-line::${tier}` `` over `SMALL_PLACE_TIER_LINES`.
- `settlementQuickGuide.js :: cultureScopeLine` uses `` `${seed}::culture-scope-line` `` over `SCOPE_LINE_FRAMES`.
- `steps/assembleInstitutions.js :: shipFreeDesc` uses `` `${seed}:${inst.name}` ``.

Both pools above are canonical at zero, and a falsy seed takes index 0. The proposal's key is **`` `${seed}::situationDesc` ``**.

## D. THE CANDIDATE WORDINGS (the medium branch only)

The house idioms followed:
- Declared rows `{ id, text, needs }`, where `text` may be a template function the caller applies (`drawDeclared.js :: lineText`).
- One draw door, `drawDeclared(pool, { facts, draw, key, poolId, surface, drawKind })`, with the site's selector `draw: (p) => pickVariant(p, key)`. It adds no roll. A refused draw resolves by the house's argmax over `hashKey(key::lineId)`, and the key carries the seed, so the resolution spreads too.
- Atoms only from `factVocabulary.js :: FACT_DIMENSIONS`: `exports`, `imports`, `market`, `route: <kind>`.
- A seedless caller gets the canonical line, as `SMALL_PLACE_TIER_LINES` does.

Every row keeps the weight and length class of the line it replaces: one plain sentence of about 60 to 100 characters, saying "ordinary", "steady" or "usual" and nothing brisk or slow, naming no trouble and no fact the record lacks. No row opens with a `TRADE_LINE_BANDS` pattern.

The goods are filled from the page's own lists (`tradeListsAsPrinted`: exports; imports less any export). The trade mark and any trailing parenthetical are taken off, and the lead is lower-cased (`composer.mjs :: goodWord`). A slot with no word reads as absent.

| id | needs | wording |
|---|---|---|
| sells-buys | exports, imports | It sells {export} and buys {import}, and its trade goes on at an ordinary pace. |
| steady-sends | exports | Its trade is steady rather than busy, and it sends out mostly {export}[ and {export2}]. |
| out-in | exports, imports | It sends out {export} and brings in {import}, at the pace usual for a place this size. |
| buys-in | imports | Trade here is ordinary; the main thing it has to buy in is {import}. |
| market-sends | market, exports | The market does ordinary business, and the main thing sold on beyond it is {export}. |
| route-{road, river, port, crossroads, mountain_pass} | exports, route: X | It sends its {export} out {by road / by river / by sea / along the roads that meet here / over the pass}, and trade keeps an ordinary pace for a place this size. |
| route-only-{X} | route: X; excludes exports | What little trade there is comes and goes {by road / …}, at an ordinary pace for a place this size. |

The rows are agreement-proof: no verb agrees with a good, so "healing waters" and "incense and votive candles" read right. A first scratch draft of the composer, with "{good} goes out", printed "Healing waters goes out" and was rewritten. The shares in E are the final draft's.

Considered and left out:
- A guild row: every town and up holds a guild, so it adds no variety, and "regulated by its guild" would be a claim.
- A tier-noun row ("for a village its size"): it lowers nothing within a size.

The known wart: services print as exports ("Ship passage", "Water rights", "Transit trade", "Warehousing…"). The lead printed export is one of them in 29 of 460 medium places ("It sends its ship passage out by road"). See G5.

## E. THE PROJECTION

`composer.mjs` (the pool above, through the house's own `drawDeclared` and `pickVariant`, imported read-only) runs on the same 600 births, masked as the census masks. Goods are not masked. Figures from `report.out.txt` §E:

| size | top share BEFORE | top share AFTER (any line) | the commonest COMPOSED line | distinct lines |
|---|---|---|---|---|
| thorp | 67 (the medium line) | 9 (isolatedMedium) | 5 | 10 → 50 |
| hamlet | 62 | **13** (isolatedMedium) | 8 ("… to buy in is salt.") | 10 → 54 |
| village | 68 | 11 (isolatedMedium) | 5 | 10 → 54 |
| town | 89 | 7 ("… to buy in is iron.") | 7 | 6 → 74 |
| city | 89 | 5 (fractured) | 3 | 6 → 79 |
| metropolis | 85 | 7 (indebted) | 4 | 5 → 69 |

The worst size after is hamlet. Its ten commonest lines:
- 13× the isolatedMedium line
- 8× "Trade here is ordinary; the main thing it has to buy in is salt."
- 7× the sluggish twin
- 5× the famine twin
- 5× the plague twin
- 3× fractured
- 3× "… is incense and votive candles."
- 2× "It sells raw wool and buys salt, …"
- 2× "It sells healing waters and buys incense and votive candles, …"
- 2× "It sends its salted fish out by sea, …"

Checks on the composed lines:
- 0 of 460 open with a band pattern.
- 0 carry a surplus word beside a record that grows less than it eats.
- 0 of 460 stay canonical.
- How they were reached: drawn 171, argmax 289. The route rows are refused off their own route, so most draws resolve by the argmax. That still spreads, because the key carries the seed. The argmax favours `steady-sends` (73), which needs only exports.

**No size stays above the bar.** The closest is the untouched isolatedMedium line at 13 of 100 hamlets. The one composed line that leans is `buys-in` beside Salt (8 hamlets) and Iron (7 towns): the import list is concentrated. Reading the second import instead, or dropping `buys-in` where a size's lead import is the commonest, would lower it. Neither is needed under the bar.

## F. WHERE THE CHANGE WOULD LIVE

1. **A new data file, `src/data/ordinaryTradeLines.js`.** It holds `ORDINARY_TRADE_LINES` (the declared rows of D) and `ordinaryTradeLineOf(line, record, seed)`. That composer returns `line` untouched unless it is the canonical medium line and the seed is truthy. Otherwise it draws through `drawDeclared` with `pickVariant(p, `${seed}::situationDesc`)` over `factsOf(record)`, and fills the goods.
   - It imports `domain/facts/drawDeclared.js`, `domain/facts/factsOf.js` and `kernel/proseHash.js`.
   - It imports either `domain/display/tradeListDisplay.js :: tradeListsAsPrinted` (the printed goods) or `domain/canonicalAccessors.js` (the record's lists). The first may meet the layer guard (`tests/architecture/layerBoundaries.test.js`): data reading a display module. See G2.
2. **The one call line: in `src/generators/steps/generateNarratives.js`, not in `prosperity.js`.** It goes immediately after `generateResourceAnalysis(…)`, the last writer of the imports:
   `economicState.situationDesc = ordinaryTradeLineOf(economicState.situationDesc, { config: effectiveConfig, economicState, institutions, tier }, ctx._seed);`
   - The step already declares `mutates: ['economicState']`, so no metadata changes.
   - Why not at the writer: there the seed is absent (0 of 600), and the imports differ from the final record in 403 of 600.
   - Why not `economyReconcilePass`: the imports still change after it (330 of 600).
   - `generateNarratives.js` is none of the files the common brief forbids. `narrativeGenerator.js`, which is forbidden, is a different file.
   - `prosperity.js` takes **zero** lines: the canonical line stays its writer's output and the composer keys on its text, as `resolveSibling` keys its twins.
   - An exports-only composer at the writer is possible (exports equal 0 of 600 differ), but it would need the seed threaded into `generateEconomy`'s config: more than one line, and in a file the fortune lane also touches.
3. **Registration.** Add a `TABLE_POOLS` row in `scripts/lib/table-pools.mjs`:
   `{ id: 'ordinaryTradeLines.ORDINARY_TRADE_LINES', module: 'src/data/ordinaryTradeLines.js', name: 'ORDINARY_TRADE_LINES', drawKind: 'H', drawSite: 'generateNarratives.js → ordinaryTradeLineOf (pickVariant over the declared rows)' }`.
   The walkers that count the table move: `tests/lint/census5dTablePools.test.js` and `tests/lint/wiringCensusDeclared.walker.test.js`. The presumption walkers go green by the rows' `needs` (`market` on `market-sends`), with no register row.
4. **The proofs owed:**
   - The red-first test, for example `tests/generators/ordinaryTradeLine.test.js`:
     - (a) On 100 towns `hxd-town-*`, the commonest masked `situationDesc` is at most 15. It reads 89 before.
     - (b) A seedless call returns the canonical line.
     - (c) Every composed line names only goods on the page's lists, opens with no `TRADE_LINE_BANDS` pattern, and `market-sends` never prints without a market.
     - (d) A saved record keeps its stored line: there is no render path to change.
   - The confinement run: `node docs/chair/2026-11-20/content/tools/confinement/trees.mjs <before> <after> <workdir>` must read 0 non-string differences, with the string differences confined to `economicState.situationDesc`. Nothing at birth quotes the line, and the coherence receipt's findings cannot move: no wording names a market under `market: false`, and none matches a band pattern or "self-sufficient".
   - The pins that move:
     - `tests/fixtures/generator-golden-master.json` needs a written re-record.
     - `supabase/functions/_shared/engineBundle.js` must be rebuilt by `npm run build:edge-shared`, under `tests/build/engineBundleReplay.test.js`. That path is under `supabase/`, which the common brief forbids. See G3.
     - The `LIVE` row of `projectionAgreement.test.js` must be re-run.
     - The two table-pool walkers' counts.

## G. OPEN QUESTIONS for the chair

1. The line is printed on no page of a fresh birth (SW-B7b). Is a stored-record sameness worth a composer, or should the line be retired or left, with the census reading it as dark?
2. Should the goods be read from the page's printed lists (`tradeListsAsPrinted`, a display module; 22 of 454 lead exports differ from the record), or from the record's lists (`canonExports` / `canonImports`, the facts home)?
3. A builder cannot rebuild `supabase/functions/_shared/engineBundle.js` under the common brief's `supabase/` ban. Who rebuilds it, and who signs the golden-master re-record?
4. The economy output reads below 70 in all 600 default births, so the high and very-high lines never print. Is that the birth dial's intent, or a second cause of this sameness that belongs to the fortune lane?
5. Should services the page prints as exports ("Ship passage", "Water rights", 29 of 460) be skipped when choosing the good a wording names?
