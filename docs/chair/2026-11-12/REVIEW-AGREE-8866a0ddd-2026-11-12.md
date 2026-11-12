NOT CLEAR

# REVIEW-AGREE-2 — `lane/coherence-agree-2026-11-11` at 8866a0ddd

**The reviewer.** An independent seat (REVIEW-AGREE-2), 2026-11-12. I did none of the lane's work. I read it, ran it, and fixed nothing.

**What I reviewed.**
- HEAD is `8866a0ddde20e672e2f53238fbe1ce1f95666cba`, the commit named in the brief. The branch has not moved.
- The line is `origin/lane/integration-2026-11-07` at b68e2f432. The merge base is 5b31cdfcc, the guard's lane.
- The lane's own change is 5b31cdfcc..8866a0ddd: 96 commits and 79 files.
- The line's 30 later commits touch no file under `src/generators`. So for the generator, a field diff of the line against the tip is a diff of the lane alone.

**Where things ran.** Everything ran in detached scratch worktrees:
- `wt-line` at b68e2f432
- `wt-plant`, `wt-read`, `wt-tipsuite` and `wt-cf` at 8866a0ddd
- four bisection trees, at f88d87af2, 570f2c21d, 7fcc50374 and c20042d2c

Nothing was committed except this file. Every plant was reverted (`git status` clean apart from the `node_modules` link).

**A trial merge.** I merged the tip onto b68e2f432 with `--no-commit` in a scratch tree, then aborted it. It conflicts only in generated files, each of which is re-taken by its own writer:
- `docs/content/wiring-census.json`
- the seven edge-bundle files
- `tests/lint/.lighting-census-baseline.json`

## The verdict in short

**NOT CLEAR.** The lane does most of what it claims:
- The cures re-taken on fresh seeds hold. Fifteen of the first review's seventeen findings are cured or declared. F9 is partly cured, and F12a's class moved to F1.
- The refill is confined exactly as claimed.
- Every red title is named in the hand-back.
- The gates are green.
- The six golden statements hold.

But the class the lane owns still prints, on facts the lane says it homed:
- **F1.** A river or port town runs the "Strategic Crossroads Toll" chain: 146 of 1,245 births.
- **F2.** A refused chain says "Normally yields" a good that the export list sells: 14 births.
- **F3.** Two guard members catch their fault and nothing goes red. A regression in the safety writer's company, or in the foodways market filter, would ship green.

The owner's standard is a performing product, not one with known contradictions, so these hold the release.

**Counts:** 9 findings.
- **8 CONFIRMED by execution:** F1–F6, F8, F9. F9 is not the lane's.
- **1 CONFIRMED by reading:** F7.
- **0 PLAUSIBLE.** One part of step 3d was read, not executed: that no AI path or export prints a finding's words.

## The corpus (my own; the lane never saw these seeds)

Every birth goes through the browser's own configuration: `birthConfig({ ...DEFAULT_CONFIG, ...dials, settType })`. The dials are `random_trade`, `random_culture` and `random_threat`, with every random flag on, `_randomizePriorities`, `magicExists`, and `contentProfile: 'grounded'`.

- **`r2r-<tier>-<i>`**: all six sizes × 60 = **360**, every dial random.
- **`r2s-<stress>-<tier>-<i>`**: every one of the 15 crises, forced (`selectedStresses: [s], selectedStressesRandom: false`), × 6 sizes × 4 = **360**.
- **The golden's 525**, born exactly as `generatorGoldenMaster.test.js` births them.
- **In all: 1,245 births per tree**, generated at the line (`c-line`), at the tip (`c-tip`), and at the tip with A′'s access refusal switched off (`c-cf`, the counterfactual that finds the crossroads holders).
- **For reading, `r2read-<tier>-0..4`: 30 towns**, five of each size. Ten are in a forced crisis:
  - thorp-3 famine, thorp-4 monster_pressure
  - hamlet-3 under_siege, hamlet-4 mass_migration
  - village-3 wartime, village-4 indebted
  - town-3 famine, town-4 insurgency
  - city-3 plague_onset
  - metropolis-3 occupied

  Each was rendered through the real dossier, `OutputContainer` in jsdom, as the owner's view. Every group tab and every sub-tab was clicked, and every disclosure was opened. The walk is the one in `dossierPhoneFloorAllViews`, and I dumped its text.

## Findings, most serious first

Findings 1–3 are members of the lane's own class (ONE FACT, TWO ANSWERS) in facts the lane claims to have homed. Each is a line or a card a game master reads on today's tip.

### F1 — The crossroads fact still has a third reader: a river or port town runs the "Strategic Crossroads Toll" chain. CONFIRMED.

**What a game master sees.** Open the Economics tab of a river village. It shows the flow card **"Strategic Crossroads Toll — Strategic Crossroads"**, which yields "Toll income, Market taxes, Transit trade profit". Meanwhile:
- the Resources tab lists no crossroads;
- the access line says "river".

A′'s whole point was that a crossroads position requires crossroads access.

**Seeds** (all executed):
- `r2read-village-1`: access river; resources river_mills, grazing_land, hot_springs, coal_deposits, river_clay; the chain is `{chainId: crossroads_trade, label: "Strategic Crossroads Toll", resource: "Strategic Crossroads", status: "entrepot"}`.
- `r2read-city-3`: river.
- `r2read-metropolis-2`: port.

All three readers of those towns reported it independently.

**Count:** the `crossroads_trade` chain on an access that is not a crossroads.

| | count | by access |
|---|---|---|
| Line | 201 / 1,245 | — |
| Tip | **146 / 1,245** | port 58, river 88 (crossroads 54 legitimately) |

The road towns left with the cure. The port and river towns did not.

**Where the second answer comes from.** `src/generators/computeActiveChains.js`, inside the chain loop:
- `isEntrepotRoute = ['crossroads','port','river'].includes(tradeRoute)`;
- a chain with `entrepot: true` runs on such a route whenever one processor is on the roster;
- `crossroads_trade` (`src/data/supplyChainData.js`) carries `entrepot: true` and `resource: 'Strategic Crossroads'`.

So the datum `RESOURCE_DATA.crossroads_position.requires: ['crossroads']` reaches the roll, the wizard and the validator, but not the chain.

**Why the guard is silent.** Its A′ member (`generationCoherence.js`, "A rolled resource stands off the access it requires") reads `resourceAnalysis.availableResources` only. It returns 0 findings on all 146.

### F2 — Item 3′'s "one predicate" has a second writer: a refused chain says "Normally yields" a good that the export list says the town sells. CONFIRMED.

**What a game master sees** (`r2read-city-4`; also `r2r-city-42`, `-53`, `r2r-metropolis-43`, `r2r-town-8`, `-12`, `r2s-indebted-city-3`):
- The Weapons & Armor card and the Iron & Metalwork card are both impaired, because their iron ore deposits are depleted. Each prints **"Normally yields: Quality tools and weapons"**.
- The Trade Profile's exports list **"Quality tools and weapons"**.
- So the card says the chain does not yield it now, and the export list says the town sells it.

**Count at the tip:** 27 refused chains in **14 of 1,245 births** (1 golden) have an output in `primaryExports` that no running chain makes:
- Quality tools and weapons: 26
- Charcoal: 1

**Where.** The export does not come from `deriveExportsFromChains`, which does read `chainYieldRefused`. It enters through the finished-goods category bonus (`src/data/finishedGoodsCategory.js`, `exportBonus: 'Quality tools and weapons'`, earned by a metalworking institution on the roster). That writer does not ask the leaf.

**The fifth reader, searched.** I grepped every `.outputs` read under `src/components`, `src/pdf`, `src/domain/display|prose|dossier`, `src/foundry` and `src/lib`. The four readers named are the only ones that print a chain's outputs as what it yields:
- `EconomicsTab.jsx`
- `EconomicsTrade.jsx`
- `SupplyChainFlow.jsx`
- `Services.jsx`

The other hits do not:
- the custom-chains block prints user chains;
- `SupplyChainsPanel :: ChainRow` is used only by the Compendium;
- `defenseStateProse :: namedMagicChainGood` reads only magically sustained chains;
- `prebuiltResourceChains` is the Compendium.

So there is no fifth *reader*. The disagreement is a second *writer* of the export.

**"Produced locally".** After excluding outputs that a running chain also makes, a refused chain's output also stands in "Produced locally" in 6 births, all "Processed textiles" from an impaired Textiles & Cloth chain (e.g. `r2r-city-6`).

### F3 — Two of the guard's members catch their fault, and nothing goes red. CONFIRMED.

**The plants.** I planted each fault in the generator, at the tip, in a scratch tree. "Red" means the result of `tests/generators/projectionAgreement.test.js` plus `tests/generators/coherenceAgreeCures.test.js` (44 tests).

| Plant (a second answer that disagrees with the home) | Red? |
|---|---|
| G1 `safetyProfile.js`: `hasGates: defence.walls` | **red** (arm 2, both seed sets) |
| G2 `safetyProfile.js`: `hasMercenary: defence.mercenary \|\| defence.garrison` | **green 44/44** |
| G3 `safetyProfile.js`: `hasWatch: defence.watch \|\| defence.militia` | **red** |
| G4 `economicState.js`: the grain-surplus swap disabled (`if (false && …)`) | **red** |
| G5 `domain/foodways.js`: `marketFits = () => true` (F6's cure removed) | **green 44/44** |
| G6 `resolveResources.js`: the access refusal off | **red** (3 tests) |

**The receipt does convict G2 and G5.** Over 240 fresh births (`r2r-*-0..39`):
- G2 raised "The safety text names a mercenary company the defence record does not list." in 3 births.
- G5 raised "The foodways line names a market the town does not have." in 2.

**But no test goes red.** With G2, and again with G5, these also stayed green (30/30 tests):
- `generationCertificationSoak`
- `generationCertificationCorpus`
- `resourceConditionCoherence`
- `defenceClaimWriters` (with G2) / `foodwaysOneLine` (with G5)

**What a game master would see if the fault came back.** "A mercenary company provides enforcement" in a garrison town with no hired company, or "Markets, shared waterworks…" in a town the page says has no market. The guard would know, and no gate would stop it.

**Why.** The receipt is not a gate. Arm 2 holds fixed seed lists, and those lists do not contain a birth that these two faults reach.

### F4 — The income lines (cure 7 and F3) read the town's resources, but name a working the roster does not have. CONFIRMED.

**What a game master sees:**
- `r2read-village-1`: "Iron & Metalwork — Local coal fires the forges, but the iron is bought in…". The village has no smith and no forge.
- `r2read-hamlet-3`: "Local quarry provides dressed stone to regional builders…". Beside it, Resources says "No one here works the stone" and "Needs imported stone: no local source", and stone is imported.
- `r2read-city-0`: "Local ore feeds the smithy directly. Metalwork income is not trade-route dependent." There is no smithy, and the primary imports list "Iron ore".

**Counts**, over 1,245 births, line → tip:

| Line | Line | Tip |
|---|---|---|
| "Local ore feeds the smithy" with no smith, forge or metal house on the roster | 270 | 129 |
| "Local coal fires the forges" with none | 0 | **104** (the lane's own new line, `LOCAL_COAL_LINE`) |
| "Local quarry provides dressed stone" with no quarry, mason or stone house | 355 | 355 |
| "managed felling and sawmilling" with no sawmill, lumber, timber or carpenter house | 112 | **154** |
| "Local ore feeds the smithy directly … not trade-route dependent" beside the primary import "Iron ore" (live iron deposits, no mine on the roster) | 22 | 22 (e.g. `r2r-town-53`, `r2s-famine-city-0`, `r2s-infiltrated-town-1`) |

The sawmilling rise has a cause: cure 7 (7dd488928) widened the Timber Trade gate. Its line now reads `hasNearbyResource('managed_forest','timber')` both as the gate and as the description's own test, so the "sourced from more distant forests" branch is dead.

**Where.** `src/generators/economy/economicState.js :: generateEconomicState`, the Iron & Metalwork, Stone Quarrying and Timber Trade blocks.

The cure answered "does the town hold the resource?". The line also says that the resource is worked here, which the roster and the Resources tab ("No one here works …; Needs: …") answer otherwise. Most of this predates the lane. The coal line and the sawmilling rise are the lane's own.

### F5 — The refill is as confined as claimed, but it fills the slot with a "Mountain Pass" off the mountains. CONFIRMED (record).

On my corpus the refill does everything it claims (step 3a). However, the refused member's own category ('special') resolves to `defended_pass` in **54 of the 123 holders** (44%). That resource is labelled **"Mountain Pass — The only viable route through surrounding terrain"** and its trade goods are "Toll revenue, Pass transit trade". Of those 54, 46 are off mountain terrain:
- hills 18
- plains 15
- forest 5
- riverside 4
- desert 4

**Example.** The golden row `town|germanic|auto|random_trade|civilized|gm-seed-a` is riverside terrain on road access. At the tip it holds "Mountain Pass" and exports "Toll revenue; Pass transit trade". Under the counterfactual (the line's roll) it exported "River fish; Freshwater catch; Transit trade…".

**Not created by the lane.** It is compatible by the roll's own rule: `defended_pass` has no `terrain`. The base roll already gives a Mountain Pass on plains to 99 non-holders, so this is a pre-existing class member that the refill concentrates.

**A second effect of the refill.** 24 of the 123 replacements arrive depleted, because the slot keeps its depletion draw and the crossroads was never depletable:
- ancient grove 15
- grazing 2
- managed forest 2
- hunting 2
- iron 1
- stone 1
- grain 1

No holder is left without a live resource.

### F6 — A′ moves a food band toward danger, which the draft record says it does not. CONFIRMED.

**What a game master sees.** `r2s-under_siege-city-3` is a besieged city whose food band reads **importDependent at the line and deficit at the tip**.

**Attribution.** The counterfactual (`c-cf`, the tip with the refusal off) reads importDependent, so the move is A′'s re-deal of a holder. It is not moved by cures 6 or 9: every bisection tree (f88d87af2, 570f2c21d, 7fcc50374, c20042d2c) reads importDependent.

**Against the draft.** The record's A′ declaration says the food band moves twice, "both toward safety". The mechanism is declared ("each family moves both ways"), but the direction is stated as if it were universal, and on fresh seeds it is not.

### F7 — A pin whose expectation is computed by the code under test. CONFIRMED (read).

`tests/generators/w0WriterAgreement.test.js` ("ONE FOOD-SOURCE COUNT", e6e50b7a1) now expects the zero-source note to be `foodLandOf(...).worksOwnLand ? OWN_PLOTS_LINE : NO_FOOD_CHAINS_LINE`. That is the very predicate `foodGenerator.js` uses to choose the note. A wrong `worksOwnLand` cannot redden it.

It is partly mitigated by two new counts, each holding that both lines occur in the slice. The hand-back names the re-key openly ("re-keyed by identity: the exact line foodGenerator chooses").

### F8 — The defence-reader walker (F9's re-take) still misses two shapes. CONFIRMED.

I planted each reader as `src/generators/zzReviewPlant.js` and ran `tests/lint/defenceFactReaders.walker.test.js`.

**Caught** (red): `includes('mercenary')`, `'hireling hall'`, `'courthouse'`, a `gates?` regex, `'sellsword' || 'free company'`, `['garrison','militia'].some(...)`, `/court/.test(n)`.

**Missed** (6/6 green):
- `const MERC = 'mercenary'; … n.includes(MERC)`: a word held in a constant.
- `n.includes('prison')`: the lane homed the prison fact (f6000464f, the vocabulary's `prison` atom), and the walker has no prison word.

### F9 — Not the lane's: the presumed-things walker cannot read a template head at all. CONFIRMED.

The lane's new rule is as narrow as claimed (step 3d). Separately, the literal `` `The militia drills on the green ${n} times, plant D2.` `` went unseen in `safetyProfile.js`, a file with no exemption, while its tail-literal twin was caught. This predates the lane (the lane changed only `isNotPrintedSite`), and it is reported here, not attributed to the lane.

## Step 1 — Thirty towns read as a game master would (EXECUTED: rendered and dumped; read by five readers, six towns each, one of every size; every resource, access and institution claim checked against the town's record before it was reported)

**The totals.** The readers recorded, per town, 10–17 places where two parts of one dossier give two answers (class A), and 3–9 lines that read false or broken (class B):
- 400 A items in all, many of them shared patterns
- 165 B items

Name chips dropped by the text capture were excluded by every reader.

### In the lane's class, in facts the lane homed or cured

These are verified against the record in the corpus counts above:
- **The crossroads chain** off a crossroads (F1): village-1, city-3, metropolis-2.
- **"Normally yields" beside the same export** (F2): city-4.
- **Income lines naming a working the roster lacks** (F4): thorp-0, hamlet-0, village-1, village-2, town-2, town-3 and town-4 (local coal); hamlet-2 and city-0 (local ore); hamlet-3, hamlet-4 and city-3 (local quarry); thorp-1, thorp-4 and city-1 (sawmilling).
- **The food verdict twice** (one fact, two answers, not in the lane's files):
  - The Economics food card prints "{town} is fed, but only just. A poor harvest is felt at every table" beside the food record's "{town} grows more than it eats / grows a little more than it eats". This appears in 7 of 30 towns: thorp-0, thorp-1, thorp-4, hamlet-0, hamlet-4, village-0 and village-1.
  - The same card prints "{town} feeds itself with a small margin. The counts come out ahead" beside imports of 25–45% of need: city-0, metropolis-0, metropolis-1 and metropolis-2.
  - Cause: both sentences are variants of the **SECURE** pool of DS-ECO-9 (`src/data/dossierStateProse/economy.generated.js`). That pool is keyed by `economicState.foodSecurity.label` (`economyStateProse.js :: foodSecurityPoolKey`), not by the food record's grown share. So a surplus town labelled Secure can draw "only just", and an import-fed Secure city can draw "small margin".
- **The stores, twice.**
  - The Economics stores line and the Defense "Food endurance" line give two durations: "two months in household stores" against "household stores carry the thorp for about three months at full rations"; "a granary, six months" against "about eight/nine months".
  - This appeared in at least 19 of 30 towns, counted on the dumps (every city, town and village; hamlet-0 and -4; thorp-1 and -4).
  - The second figure is a siege calculation (`defenseFacts.js :: foodEnduranceOf`: stores ÷ (1 − the share still grown)). It reads on the page as a second answer to "how long do the stores last". This is not the lane's.
- **The court, gate, watch, market and mercenary lines the lane cured:** no reader found one printing where its thing is absent. "Paid hands keep Naglkvam safe" (town-1) is cure 8's GARRISONED rung beside a part-time town watch with no company. The home counts the watch as paid hands, so it agrees with itself.

### In the class but outside the lane's facts (reported, not the lane's; the counts are the readers', approximate)

- **Magic.** The Magic tab says "Availability broad / Reliance relied upon", while Defense says "Arcane Support None — No arcane practitioners on the rolls" (more than 15 towns).
- **Power balance.** "Three powers stand almost level here, and no one leads" sits beside a Dominant ruler at 41–52 against 13–26 (more than 12 towns).
- **Crime.** "The hall: Free of the criminals" sits beside "Criminal money is reaching the officials" in the same tab (more than 8). "Diffuse / no gang" sits beside a Thieves' Guild power or rival gangs (more than 8).
- **Gaps against imports.** A gaps line says "No clay / grapes / glass sand reaches the potter / vintner / glassblower" while the imports list that very good (more than 8).
- **Founding stories.** The Origin and "Founded by" lines give two or three different foundings (all six K=2 towns, plus others).
- **No church, yet worship.** "The religious houses … are among its biggest buyers and employers" and the flow "Faith & Worship ✓ Running · House of worship" stand beside "The thorp/hamlet has no church of its own" (more than 8 small places).
- **Defence ratings against their text.** Defense rates "Beasts & Monsters: Critical" over "the arrangement is a reasonable one" or "meets nothing that would justify a watch" (more than 6).
- **Watch and gates.** "Town watch … hold the gates" appears where the page says "Unfortified. No perimeter walls" (town-2, town-3, town-4). The third seat named this as not the lane's.
- **The wrong source of food.** A flow card's resource names something the town lacks: "From Iron ore deposits" with no iron, and "From Precious metal veins" not in the record (hamlet-0, city-0, metropolis-2, metropolis-3, town-1).

### Lines that read false or broken (B), the commonest

- **A repeated phrase.** "would go on if the arcane went away, more slowly and less comfortably and go on." (in every reader's set)
- **Size words.** "intensive garden production structure urban food supply" / "dense populations" appears in thorps, hamlets and villages. The third seat named this as not the lane's.
- **Services in the wrong group.** Services files burials and rites under **Healing**.
- **Wrong counts.**
  - "The ruling three" lists two members.
  - "The Powers (4)" is followed by "(5–9)" on the same tab.
- **Non-goods in "Produced locally".** It lists "trade access", "maritime access", "Defence services" and "Religious services".
- **Roster names.** Flow cards name houses not on the roster ("Merchant guilds (3-8)", "Theater", "Arena", "Courthouse").
- **Leaked strings.**
  - NPC roles carry count ranges ("Bakers (5-15)").
  - Every Daily Life tab prints the CSS text "@keyframes spin { … }".
- **Debug text.** village-0 prints "1 institution operating on stockpiles only (isolated trade): Citizen militia" as a current tension.
- **Siege text outside a siege.** "Under siege the outlying fields are lost" prints in every town's Defense, besieged or not.

## Step 2 — The first review's seventeen findings, re-taken on my corpus

**Method.** I EXECUTED this unless marked otherwise. Counts are over 1,245 births, line → tip. The home answers were read through the tip's `factsOf` and `defenceOf`.

| F | Re-taken | Verdict |
|---|---|---|
| F1 domain-strict | `check-domain-strict` 1113/1113, exit 0 | cured |
| F1b typecheck:ratchet | 167/167, exit 0 | cured |
| F2 cure 6's moves | declared in the draft (`DECLARED MOVES OF CURE 6`); my label moves from cure 6 are 2, both toward safety (`r2r-thorp-50`, `r2s-wartime-town-0`, readiness up; bisected f88d87af2 → 570f2c21d) | cured by declaration |
| F3 "Local ore" with no iron deposit | 0 at the tip (every one of the 42 "Local ore"+iron-import births holds live iron). Moved: 22 "Local ore … not trade-route dependent" beside the import "Iron ore", and the no-smithy claim (F4) | cured as written; moved to F4 |
| F4 the war line | peace iron hook in a war 0; war line printed 13; war line in peace 0 (line: 248) | cured |
| F5 gates named with no gate | 22 → 0 | cured |
| F6 foodways market with no market | 6 → 0 | cured (but see F3: the guard does not redden if it returns) |
| F7 grain surplus where no surplus | 121 → 0 | cured |
| F8 bracketed grain at ≥90% grown | 53 → 53, every one now "Grain (a little, beside its own harvest)" | cured |
| F9 walker blind spots | 7 of 9 plants caught; constant-held word and prison missed | partly cured (F8 above) |
| F10 cure 9's undeclared moves | declared in the draft (`DECLARED MOVES OF CURE 9`); mine: readiness down 2 (`r2s-politically_fractured-town-1`, `r2s-wartime-village-3`, bisected 7fcc50374 → c20042d2c) | cured by declaration |
| F11 "sluggish" beside Prosperous/Comfortable | 38 → 0 | cured |
| F12 "the watch" with no watch | 4 → 0 | cured |
| F12a "Central trade hub" off a crossroads | 279 → 0; the resource off a crossroads 123 → 0 | cured; **the chain moved elsewhere (F1)** |
| F12b a shortage label beside a live resource of that land | 0 in its sense; 1 golden row (`gm-seed-b`) imports "Wool, dairy, and livestock (local alpine pasture depleted)" beside live grazing land (the label names its own land, as ruled) | cured |
| F13 undeclared lines | READ: `LOCAL_COAL_LINE` in `incomeLineSiblings.js`; the three court-without-prison lines carry `needs: ['court'], excludes: ['prison']` (4d12a1447) | cured |
| F14 (a)–(d) | READ: (a) corrected in PART THREE; (b) the cites are symbols (one `:828` survives inside a comment); (c) one edge commit, last and alone; (d) the chair's to say | cured / noted |
| F15 the lighting census | the census was re-taken at ca1ed8ddd (b4670a365). Test files changed after it (18f5e5c30, e6e50b7a1, 3dec3ae21); see step 7 for whether its walker is red at the tip | see step 7 |

## Step 3 — The lane's later cures

**(a) The crossroads cure and its refill.** EXECUTED: the tip against the tip with the refusal off, over 1,245 births.
- Holders: 123. Non-holders: 1,122, and **0 of them move in any leaf**.
- Every holder moves. Every holder keeps its roll's size (0 size differences).
- No duplicate. No crossroads left. No replacement whose `requires` or `forbidden` refuses the access. No magical node where magic is off. No terrain-bound resource off its terrain.
- **No holder is left with nothing live where the roll had something** (0).
- Replacements:
  - defended_pass 54
  - ancient_grove 51 (15 depleted)
  - hunting_grounds 3
  - coal, gemstones, managed forest, grazing, iron, stone 2 each
  - grain, foraging, precious metals 1 each
- Does the replacement contradict its own page? Yes, in the Mountain Pass case (F5).
- Separately, the crossroads *chain* still runs off a crossroads on river and port access (F1).

**(b) The impaired chain.** EXECUTED, plus a grep:
- One predicate, `domain/chainYield.js :: chainYieldRefused`, is read by `EconomicsTab.jsx`, `EconomicsTrade.jsx` (index-aligned with the view-model's chains, which map 1:1 in order), `SupplyChainFlow.jsx` and `Services.jsx`.
- No fifth reader prints chain outputs (searched; see F2).
- Twelve refused cards were read from the record:
  - city-2: Luxury Goods; Mining & Coinage
  - city-3: Reed & Marsh Harvest
  - city-4: Hunting & Trapping; Herbalism; Leather & Hides; Weapons & Armor; Beekeeping; Iron & Metalwork; Fuel & Heating; Smelting; Furs & Pelts
- Every one has its primary input depleted, and "Normally yields" is true of each.
- It is not true of the export list beside two of them (F2).

**(c) Court and prison, the theocratic line, walls and no gate.** EXECUTED with the tip's `defenceOf` and `factsOf`:

| Line | Prints in | Violations |
|---|---|---|
| "nowhere to hold the guilty" | 107 births | 0 without a court, 0 with a prison |
| "The walls leave few ways in" | 22 | 0 without walls, 0 with a gate |
| "The church controls most economic activity" | 15 | 0 without a sacred house, 0 market variant without a market |

The "court and prison" lines print nowhere without both.

**(d) The presumed-things walker's new rule.** EXECUTED by planting in `generationCoherence.js`:

| Plant | Result |
|---|---|
| A: `finding(p, '<militia line>')` (argument 1) | exempt, as designed |
| B: the same words as argument 2 | **caught** |
| C: argument 1 inside a ternary | **caught** |
| D: a template with a substitution as argument 1 | not caught; but the same template is not caught in an unexempt file either (F9, pre-existing) |
| E: a bare literal in the same file | **caught** |

So it is one file, one callee and one argument, as claimed.

Does any page, export or PDF print a finding's words? No:
- `VersionsTab.jsx` prints each check's label and its finding *count* only.
- `generalDeskRead.js` reads judgments.
- The gallery veil deletes the receipt.
- The PDF view-model's `coherenceFindingView` is read by no section (the lane's own pin).
- No JSON or Foundry export or AI path names the receipt (grep: `src/lib`, `foundry-module`, `mcp-server`, `supabase/functions` outside the bundles).

The AI-path check is READ, not executed.

**(e) The narrow door `--bank-new`.** EXECUTED in a scratch copy:
- I removed row `ledger:ARRIVAL_MEMORIES.trade_collapse`.
- I loosened row `ledger:ARRIVAL_PEOPLE.norse`: top1 0.3132 → 0.5132.
- I ran `node scripts/census/pool-dominance.mjs --bank-new`: "banked: … 1 new rows banked, no other row touched", exit 0.

The result, compared byte for byte:
- 907 → 908 rows.
- **0 existing rows changed.** The loose row is untouched, and the census header is identical.
- The only textual difference is the re-added row, appended last.

One property to know: the re-banked row comes back at the higher of the two corpora, **0.7693, where it had been 0.5715**. A row deleted by hand and re-banked through the door returns looser. The door is honest about what it does; the guard against a hand deletion is the register's review, not the door.

At the tip, `pool-dominance.mjs` exits 0: "908 pools: 0 over, 0 unregistered, 0 stale, 0 loose".

## Step 4 — The guards' strength (EXECUTED; plants in a scratch tree, none committed)

**The projection-agreement arm.** See F3. Four of six generator plants go red: gate, watch, grain surplus and the access refusal. Two are convicted by the receipt but go red nowhere: mercenary and foodways market. Arm 1, the planted records, is real for every member.

**The defence-fact reader walker.** See F8. It catches 7 of 9 plants.

**The presumed-things walker's exemption.** See step 3d.

**`--bank-new`.** See step 3e. It is also pinned both ways in `poolDominance.walker.test.js`.

**A′'s pin.** "road holders at the bottom of their range keep a full roll" goes red when the refusal is off (G6).

## Step 5 — What moved that was not meant to (EXECUTED: field diff, line → tip, 1,245 births)

**Totals.** 1,215 births move.

**Families by births:**

| Family | Births |
|---|---|
| economicStrengths | 1,149 |
| foodSecurity | 544 |
| incomeSources | 436 |
| plotHooks | 378 |
| primaryImports | 374 |
| defenseProfile.scores | 342 |
| safetyProfile | 336 |
| strategicValue | 303 |
| foodways | 299 |
| the flag bag (`economicState.compound.inst.hasGates` 112, `.hasMercenary` 71) | 254 |
| viability metrics, dependencies, summary | 225 / 213 / 205 |
| resourceAnalysis.imports | 200 |
| situationDesc | 193 |
| simulationTrace | 127 |
| resources and config roster | 123 |
| exports | 118 |
| activeChains | 97 |
| readiness | 75 |
| npcs, institutions, relationships | 73 / 57 / 56 |
| receipt judgments' evidence text | 72 |
| history | 23 |

**The non-holders, separately (1,122).** Every family that moves is one the draft declares:
- the text families;
- cure 6's food chains, resilience, `scores.disaster`, `scores.economic`, storage months and note, and the famine shares; in 4 famine non-holders the history's current tension moves with the failed source (`r2s-famine-city-3`, `-metropolis-2`, `-metropolis-3`, `-thorp-1`), the declared "failed source changes";
- cure 9's flag bag, `scores.military`, `economicGates.military` and readiness.

Rosters, NPCs, relationships, history beyond those 4 famine towns, spatial layout and arrival move only in the 123 holders. That matches A′'s declared re-deal.

**The labels, town by town**, each attributed by bisection or by the counterfactual:

| Town | Label | Move | Cause |
|---|---|---|---|
| r2r-thorp-50 | readiness | Lightly → Defensible (safety) | cure 6 |
| r2s-wartime-town-0 | readiness | Lightly → Defensible (safety) | cure 6 |
| r2s-politically_fractured-town-1 | readiness | Well-Defended → Defensible (**danger**) | cure 9 (declared) |
| r2s-wartime-village-3 | readiness | Vulnerable → Undefended (**danger**) | cure 9 (declared) |
| r2r-town-42 | readiness | Defensible → Lightly (**danger**) | A′ holder (declared family) |
| r2r-village-22 | readiness Vulnerable → Undefended, legitimacy Tolerated → Contested | **danger** | A′ holder |
| r2r-town-57 | safety | Tense → Strained (**danger**) | A′ holder |
| r2s-under_siege-city-3 | food band | importDependent → deficit (**danger**) | A′ holder; **contradicts the record's direction (F6)** |
| gm-seed-a golden row | prosperity | Comfortable → Moderate (danger) | A′, declared by key |
| r2r-city-29, r2r-town-41, r2r-town-47, r2s-succession_void-town-1, r2s-wartime-village-0 | readiness, prosperity, legitimacy, safety and food band, all up; one condition high → medium | safety | A′ holders |

**Rates against the hand-back.**

| Cause | Draft | Mine | Direction |
|---|---|---|---|
| Cure 9 | 30 of 2,866 down (1.0%) | 2 of 1,245 down (0.16%) | holds |
| Cure 6 | 9 up (0.3%) | 2 up (0.16%) | holds |
| A′ readiness, among holders | 17 down / 21 up of 540 | 2 down / 3 up of 123 | holds |
| A′ prosperity | 14 down / 4 up | 3 up, 1 golden down | — |

No label moves toward danger without a cause the lane declares. The one exception in direction is F6.

## Step 6 — The six golden surfaces

I EXECUTED these runs:
- `tests/simulation` and `tests/pdf` at the line (`wt-line`) and at the tip (`wt-plant`), one worker each.
- The four property goldens at the line, file by file.
- The same four at the tip, inside the whole-suite run.

**`tests/simulation` + `tests/pdf`:**

| Tree | Result |
|---|---|
| Line b68e2f432 | **75 files, 717 tests, all pass** |
| Tip 8866a0ddd | **1 failed of 717**: `tests/pdf/goldenViewModel.test.js` "canon values for the fixed seed are golden". Its diff is one field, `"defense.scoreAvg": 43 → 40`; nothing else in the snapshot moved |

**The six surfaces:**

| Surface | Line | Tip | The draft's statement |
|---|---|---|---|
| (1) generator golden master | green | red; my field diff of the golden's 525 moves **501 of 525** | MOVED 501/525: **holds** |
| (2) espionage dormancy fence | green | red ("THE DRIVEN GOLDEN: 360 settlements…", received …803f9e60 against committed 38a52b05…) | MOVED: **holds** (I did not reproduce the draft's short hash 37bd444b from the failure text) |
| (3) dossier prose manifest | DRIFT arm red (the line's own known class) | DRIFT arm red **and** "THE DRIFT CORPUS CARRIES FOUR SEEDS" red | MOVED, four-seed arm the lane's: **holds** |
| (4) PDF golden | green | one field, `defense.scoreAvg` 43 → 40 | MOVED by cure 9 alone: **holds** (and 3′ (ii) does not move it) |
| (5) herald desk golden | green | red (committed a89eda1e…) | MOVED: **holds** |
| (6) preset-lighting witness | green (inside the 717) | `presetLightingWitness.test.js` **7/7 green**, also run alone | UNMOVED: **holds** |


## Step 7 — The gates and the claims

I EXECUTED all of these at 8866a0ddd, in the real git tree. Each gate was read through `scripts/gate-tail.sh`, which reports the gate's own exit code.

**The gates:**
- `sh scripts/gate-tail.sh node scripts/check-domain-strict.mjs`: "✓ no strict-type regressions (1113 errors, ceiling 1113)", **exit 0**.
- `sh scripts/gate-tail.sh npm run typecheck:ratchet`: "OK — no type regressions (167 error(s), ceiling 167)", **exit 0**.
- eslint over the lane's 57 added or modified `.js`/`.jsx`/`.mjs` files under `src/`, `scripts/` and `tests/` (5b31cdfcc..8866a0ddd): **exit 0**.
- `node scripts/census/pool-dominance.mjs`: **exit 0**, with 0 over, 0 unregistered, 0 stale and 0 loose.

**The whole suite, once.** `npx vitest run tests --maxWorkers=2` at the tip, with the ledger ref fetched first (`review-fixes-2026-07-08` at 235efce1a):
- **Files:** 34 failed, 3,168 passed, 8 skipped (3,210).
- **Tests:** 42 failed, 38,652 passed, 254 skipped.

**The failing titles against the hand-back, title by title.** Every failing title is named in PART FOUR:

| Where the hand-back places it | Failing titles at the tip |
|---|---|
| The line's known set | landingFixtureFreshness ×2; newsHeadlineContract and newsVoiceContract (fail at load); the prose manifest's DRIFT arm |
| The merge seat's | generatorGoldenMaster; espionageDormancyFence; heraldKnowledgeDeskGolden; dossierProseManifest's four-seed arm; goldenViewModel (cure 9); generationForkCensus A1; dmLayerGoldenIsolation A7; nameHeldThroughAssembly A1; pipelinePinnedChoosers A1; pipelinePinnedMode A1, A2, A5; powerEconomyFreshness A4; rosterFinalUnderHeldRoster A1; worldFactRederive A7; x46NpcBand; institutionBudgetPromise; editWorldFactResources A2, A6; editCorpusRatchet A4, A7, A8; mergeLadderHeldKeys A2, A5, A6; intentAtlasSoakDistiller; townCartographyCalibration; undercitySewerDerivation |
| Corpus figures, exactly at the figures the hand-back gives | hookThemeDraws ("expected 2149 to be 2157"); institutionTable ("expected 1847 to be 1849"); siteCoherenceRatchet C1 |
| statecraftExposureBand | one title (the hand-back says ×2; one fewer, none new) |
| The instrument seeds | observedShapeReaders, writerReach and proseFamilyContract (fail at load on `osr-tier-14`); proseTasteInterested ×3; proseWaveGate ×3; proseComposed A13 |

**Every failing title at the tip is in the hand-back. No failing title is new.**

Rows the hand-back cures are green at the tip:
- the bundle rows
- vendorPdfLazy
- negativeAssertionAnchor
- tuningRegister
- the wiring census
- w0WriterAgreement
- narrativeQualityCorpus
- generationForkCensus A4
- `sovereigntyLightingContract` (the lighting census, F15)

**Every change under `tests/` and to a baseline or register, 5b31cdfcc..tip.** Each is classed below.

*New guards and pins, which only add:*
- `coherenceAgreeCures.test.js`
- `projectionAgreement.test.js`
- `defenceFactReaders.walker.test.js` with `.shared.mjs` and its two shrink-only registers
- `crossroadsRequiredAccess.test.jsx`
- `economicsChainYieldLabel.test.jsx`
- `poolDominance.walker.test.js` (the `--bank-new` pin)
- `presumedThings.walker.test.js` (the exemption's two pins)

*Shrinks:*
- `presumedThings.register.json`: the lane's own cured rows leave (−7 corpus rows, −3 source rows). No row is added.

*A door's own re-take, with its cause on the line:*
- `pool-dominance.register.json`: one row added through `--bank-new` (`ledger:prosperity:PROSPERITY_LINE_SIBLINGS`), plus the census header. No other row moved; I checked this against the diff.
- `.lighting-census-baseline.json`: taken at ca1ed8ddd through its ritual. It is green at the tip, though test files changed after it; the walker counts them and agrees.
- `.prose-numerics-baseline.json`: a cited line 586 → 613.
- `proseWiringCensus.walker.test.js`: measured 582 → 590, not-produced 70 → 62, docblock reports 36 → 37. Each has a reason on its line, from the census's writer.
- `mutation-coverage-manifest.json`: three rationale rows for the new guards.
- `docs/content/wiring-census.json`.

*Re-keyed by identity, with a cause:*
- `foundingWorldBones` (the iron label re-spelled)
- `famineStoresOneRounding` (two seeds swapped for members of the same condition after cure 6)
- `narrativeQualityCorpus` (the plains city is replaced by the coastal port city that carries the planted condition; the city's catalogue market)
- `outlookHooksResolved` and `hookTablesDeclared`: re-spelled to the declared sets. hookTablesDeclared's twin rule is *stricter* (`excludes` = needs + the original's refusals).
- `foodwaysOneLine`: an HTML-entity unescape in the test's reader.
- `worldFactRederive`: one file added to the set it reads.
- `foodDiversity`: the test's own expected-source rule re-stated to the chair's ruled variant. It is written independently, not called from the code.

*Findings:*
- **F7.** `w0WriterAgreement`'s zero-source expectation is computed by `foodLandOf(...).worksOwnLand`, the predicate the writer itself uses.
- No test is skipped. No pin is loosened, beyond F7's re-key.


## Five towns as they read after the lane

These are the Overview, Economics and Resources tabs, verbatim from the rendered dossier at 8866a0ddd. Entity name chips do not survive the text capture, so a gap before a comma or a line break is a dropped name. Repeated identical lines were printed once.
- thorp-3 is the thorp, under famine.
- town-3 is under famine.
- village-1 shows F1.
- city-4 shows F2.
- metropolis-2 shows F1 on a port.

```
#### r2read-thorp-3 (thorp, forced famine)
== Summary/Overview ==
Weifengthorp· 6 pop.· port· 251 years old
East-Asian-inspired: built in wards and courtyards, ordered by bureau and lineage. Governed by Household Council · Desperate — hunger is eroding order; monsters on the roads
"The Arcane Incident is still discussed (carefully) by the practitioners who work here. The details are not shared with outsiders, which outsiders find either sinister or sensible depending on their own experience with magic"
Coastal
Open Tonight
The place
The smoke from Weifeng's chimneys is thin. People here look at your pack before they look at your face, and then look away, ashamed of having looked. Half of Weifeng seems to be gutting, salting or selling fish. An elder settles a quarrel in a quiet voice before it can grow loud enough to need anyone else.
Active crisisFamine
Open the Crisis tab
In Weifeng you see thin faces at every door, and more of them each time you pass through.
The bakers of Weifeng have started cutting the bread with things that are not flour; everyone can taste it, and the fact that nobody complains is the most alarming part.
Systems Health▲
?
Safety, viability and defense, read side by side. As judged at the first survey · Food Security is re-judged as the campaign advances.
Prosperity
Struggling
Safety
Dangerous
Viability
Not viable
Defense
Undefended
Reliance on magic
None
Monster DefenseCritical
Economic ResilienceCritical
Magical CapabilityCritical
Food SecurityDeficit — active famine
No market or fair stands in Weifeng: what trade the thorp does is done house to house and on the road. Few in Weifeng hold an office.
Tensions & Conflicts▲
Who is at odds with whom, and how badly.
▸
The fishing failed this year and took most of the food produced here with it. The winter ahead will be hungry.
HoardersDesperate poorPrice regulators
Settlement Origin▲
It was built on the shore and has never had a wharf.
What little the place grows or makes is mostly used at home; there is not much left to sell.
Notable connection
Isako Zhang and Naoki Zhou share a past neither has put behind them. Isako Zhang has learned that Naoki Zhou is in debt and could be ruined by one call on a loan.
Full relationship web →

== Systems/Economics ==
Struggling
Subsistence — survival economy
Trade
port
Output
31/100
Plenty passes through Weifeng, and little of it stops. The thorp is poor, and its people say so to anyone who asks.
Income Sources▲
76%
Agricultural Rents Payments in kind or coin from tenant farmers; the primary revenue at this scale.
15%
CriminalBlack Market Revenue Untaxed trade, fencing and theft bring money in here, but it goes to the criminals who run them and the treasury sees none of it.
9%
Fish & Maritime Produce Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.
Almost everyone's living at Weifeng depends on one trade, whether or not they work in it. Some of Weifeng's money is made by people who keep it off the tax lists, so the thorp collects nothing on it and honest traders carry the tax alone.
Trade Profile▲
Exports
No significant exports.
Imports
GrainSaltTimber (for large vessels)
Terrain cannot produce · Settlement necessity
Nothing leaves Weifeng for trade. A merchant who came to buy in quantity has come to the wrong place.
Produced locally
maritime accesssaltmedicinal herbs
Food Security▲
Production: 4 lbs/day+ 6 importedNeed: 12 lbs/dayShort: 2 lbs/day
Agriculture modifier: 89%Stress penalty: ×0.35Trade covers 75% of gap
Weifeng grows about a third of what it eats, and ships bring in most of the rest. Many households go short, and a bad season would bring real hunger.
No granary; about a month in household stores.
Most meals start from the day's catch. Shared waterworks, fermentation, and intensive garden production structure urban food supply.
With the fishing gone, Weifeng faces the season ahead on its stores and whatever it can buy, and neither will last long. Bread at Weifeng is as likely to come from somebody else's fields as from the thorp's own, and everyone knows which days the carts arrive. With only its fishing to fall back on, Weifeng would feel a single failure there at every table within the season.
Economic Flows (1 active)▲
?
What is made here and what it depends on.
All (1)
Faith & WorshipReligion & civic○ Operational
Via
House of worship
Outputs
Religious servicesEducation (basic)Poor relief
Weifeng works grain it cannot produce; it buys the raw stuff in, and always has.
Shadow Economy: 13% capture▲
13%
Off-book
Some goods change hands here without a licence or a duty paid. It is noticed, and so far it does little harm.
There is some thieving and some selling without a licence. Every thorp this size has both.

== Systems/Resources ==
Terrain
Coastal
What the land offers
✓ Maritime trade✓ Salt production
The people of Weifeng know what their ground is worth to others, and know they could not keep it against anyone who came for it.
Nearby Resources▲
Abundant
Deep HarbourMagical NodeSalt Flats
Commodities available
deep harbourmaritime accesssalt flatssaltmagical nodemedicinal herbs


#### r2read-town-3 (town, forced famine)
== Summary/Overview ==
Portacoloniatown· 302 pop.· crossroads· 80 years old
Latin-inspired, built in masonry around a civic square, and run by patronage and law. Governed by Merchant Council · Desperate — hunger is eroding order
"More complicated than it looks from the road. Outsiders see a busy market; the people who live here know the stories behind it."
Plains
Open Tonight
The place
The smoke from Portacolonia's chimneys is thin. People here look at your pack before they look at your face, and then look away, ashamed of having looked. A child weaves between the stalls with a basket bigger than she is. People argue politics in the open, loudly, and seem to enjoy it.
Active crisisFamine
Open the Crisis tab
The famine in Portacolonia is getting worse: the rations shrink each week, and the queues for them grow longer.
Hunger has made Portacolonia quiet. The market still opens, the queues still form, but the haggling has gone out of people. They take what they are given and calculate, silently, how long it will last.
Systems Health▲
?
Safety, viability and defense, read side by side. As judged at the first survey · Food Security is re-judged as the campaign advances.
Prosperity
Struggling
Safety
Strained
Viability
Not viable
Defense
Lightly defended
Reliance on magic
None
Monster DefenseCritical
Economic ResilienceAdequate
Magical CapabilityAdequate
Food SecurityDeficit — active famine
Half the goods traded in Portacolonia are only passing through. An outside trader at Portacolonia either accepts its merchant guild's terms or sells to the guild's members at their price. Paid hands keep Portacolonia safe.
Tensions & Conflicts▲
Who is at odds with whom, and how badly.
▸
The crops failed, and only about a third of the usual harvest will come in. The winter ahead will be hungry.
HoardersDesperate poorPrice regulators
The last strong leader died or left, and no one has yet consolidated their position
Multiple weak claimantsPragmatists who want stabilityThose who prefer the vacuum
Settlement Origin▲
Built where two busy roads cross, and laid out around the crossing.

== Systems/Economics ==
Struggling
Diversified market economy
Trade
crossroads
Output
50/100
Plenty passes through Portacolonia, and little of it stops. The town is poor, and its people say so to anyone who asks.
Income Sources▲
18%
Market Taxes Market day stall fees and toll collection on goods entering the market.
16%
Toll Revenue Tolls taken on the roads that meet here at the crossroads.
14%
Entrepôt Trade Transit duties, warehouse fees, and re-export premiums from goods passing through the crossroads.
Guild Fees Annual licensing fees and fines levied by guild oversight.
10%
Church Tithes Tithes, offerings, and fees for burial and sacramental services collected by resident clergy.
9%
CriminalBlack Market Revenue Untaxed trade, fencing and theft bring money in here, but it goes to the criminals who run them and the treasury sees none of it.
8%
Property Rents Ground rents on civic-owned buildings, stalls, and residential plots in the town.
6%
Iron & Metalwork Local coal fires the forges, but the iron is bought in; this income stream leans on the trade route.
5%
Grain Sales Grain purchased from farming regions and resold or processed locally; margin depends on stable supply routes.
Portacolonia is not known for any one trade; it lives on many small ones. Some of the money in Portacolonia is made outside the law, and honest traders compete against it without knowing whom they are up against. Faith carries real weight in Portacolonia's money. What the religious houses take in and spend is a large part of the town's business. It has to buy its timber from outside: the country around the town produces none.
Trade Profile▲
Exports
CoalRare spices and exotic dyes
Imports
Bulk grain (local grain fields depleted)Gemstones (local gem deposits exhausted)Incense and ritual oilIncense, ritual oil, and vestment materialsIronParchment and wax tabletsReplacement arms and basic equipmentSaltLuxury goodsMetalsTimber
Terrain cannot produce · Settlement necessity
The trade here is in the moving of things. Very little of what leaves began here.
Produced locally
game meatanimal hidesfurstrade accesscoalBoots and shoesRare spices and exotic dyesToll incomeMarket taxes
Food Security▲
Production: 222 lbs/day+ 249 imported+ 54 by divine provisionNeed: 604 lbs/dayShort: 79 lbs/day
Agriculture modifier: 150%Stress penalty: ×0.35Trade covers 65% of gap
Portacolonia grows about a third of what it eats, and carts bring in most of the rest. Divine provision makes up a little more. Some households still go short, and a bad season would leave more of them hungry.
Stores: a granary, five months of grain.
Public ovens, neighborhood vendors, and shared dining customs make food distribution visibly civic.
Part of Portacolonia's food comes from spellwork, and the people who do that work matter to the town's table as much as its farmers.
Economic Flows (8 active · 1 impaired)▲
?
What is made here and what it depends on.
All (8)
Issues (4)
✓ Productive (2)
Entrepôt (2)
Grain & BreadFood securityImpaired
From
Grain fields (depleted)
Via
Mills · Mill
Normally yields
Baked goods
Needs Grain + water power - Dependent on trade routes. Siege, road closure, or blockade would impair operations. · affects: flour milling, grain processing, flour purchase
Contributes to Grain Sales - 5% of income
Leatherworking & CordwainingManufacturing & craftsVulnerable
Grazing land
Tanners
Outputs
Boots and shoesSaddles and harnessLeather armour
Standing WatchDefense & securityVulnerable
Town watch
Defence servicesWeapons training
Needs Iron · affects: law enforcement, patrol, gate control
Taverns & Social LifeEntertainment & cultureVulnerable
Taverns (5-20)
LodgingMeals and drinkStabling
Needs Grain · affects: meals, ale, lodging
Spices & DyesTrade & entrepôt✓ Running
Merchant guilds (3-8) · Merchant guilds (15-40)
Rare spices and exotic dyes
Produced in distant lands. Crossroads and port settlements control distribution and take the markup.
Contributes to Entrepôt Trade - 14% of income
Strategic Crossroads TollTrade & entrepôt✓ Running
Strategic Crossroads
Toll bridge · Coaching inn
Toll incomeMarket taxesTransit trade profit
Faith & WorshipReligion & civic○ Operational
House of worship
Religious servicesEducation (basic)Poor relief
Law & GovernanceReligion & civic○ Operational
Town hall
Civil disputesCriminal trialsNotary services
Portacolonia buys in what it cannot make, and the trading keeps as many people busy as the making would.
Shadow Economy: 11% capture▲
11%
Off-book
Some goods change hands here without a licence or a duty paid. It is noticed, and so far it does little harm.
What passes for a shadow economy here has never grown into one. There is unlicensed trade and nothing organised behind it.

== Systems/Resources ==
Terrain
Plains
What the land offers
✓ Central trade hub
Resource Exploitation▲
PartialAnimal hideshigh value
Animal hides→leather
Draws on: livestock, game
Others want Portacolonia for what it controls. The people who live there see little of that value. The town takes the easy half of this trade and sells the rest of it to whoever will do the hard half. Nothing more can be taken from the gemstone deposits at Portacolonia. Until somebody pays to open new workings, the hands that worked there are idle or gone elsewhere.
Nearby Resources▲
Depleted
Gemstone DepositsGrain Fields
Abundant
Coal DepositsCrossroads PositionHunting Grounds
Commodities available
hunting groundsgame meatanimal hidesfurscrossroads positiontrade accesscoal depositscoal
Gaps & Opportunities▲
Work on the animal hides here stops half-way: no tannery or leatherworkers' guild finishes it.
Export Potential▲
leather
Partial processing - exports semi-finished goods


#### r2read-village-1 (village)
== Summary/Overview ==
Yunbavillage· 325 pop.· river· 168 years old
East-Asian-inspired: built in wards and courtyards, ordered by bureau and lineage. Governed by Elected Reeve · Vulnerable (prosperous but underdefended)
"The tensions here are the domestic kind (inheritances, boundaries, precedence at the festival), and they are managed rather than resolved, passed down like the disputes they are, each generation adding a footnote and settling nothing"
Riverside
Open Tonight
The place
Yunba has its back to the land and its face to the river; the approach by road brings you in the rear way, past the yards and the drying nets, into a settlement that plainly considers the water its front door. Tiled rooflines and enclosed courts create a measured rhythm along the main axis. The lowing of penned cattle carries across Yunba at every hour. Each lane seems to keep to its own trade, and each trade to its own lane. Older folk still flinch at the sound of marching feet.
Systems Health▲
?
Safety, viability and defense, read side by side. As judged at the first survey · Food Security is re-judged as the campaign advances.
Prosperity
Prosperous
Safety
Moderate
Viability
Viable
Defense
Lightly defended
Reliance on magic
Relied upon
Monster DefenseCritical
Economic ResilienceAdequate
Magical CapabilityCritical
Food SecuritySecure
The market stands where carts always stopped. No guild runs Yunba's market: the village's only hold on trade is the stall fee. The village keeps few institutions and needs few.
Tensions & Conflicts▲
Who is at odds with whom, and how badly.
▸
Different faiths or interpretations competed for influence and converts
Religious AuthoritiesReformistsSecular camp
Akemi Lin has asked Qian Chen for a vote against Qian Chen's own interests. It is the first payment Akemi Lin has asked for.
Settlement Origin▲
A river settlement. The channel sets the calendar: what floods, what freezes, and what can be moved between the two.

== Systems/Economics ==
Prosperous
Mixed subsistence and market
Trade
river
Output
93/100
Nobody here talks about the price of bread. The village is well off, the river keeps it that way, and the talk is about what to build next.
Income Sources▲
53%
Agricultural Rents Payments in kind or coin from tenant farmers; the primary revenue at this scale.
18%
Market Taxes Market day stall fees and toll collection on goods entering the market.
11%
Church Tithes Tithes, offerings, and fees for burial and sacramental services collected by resident clergy.
Iron & Metalwork Local coal fires the forges, but the iron is bought in; this income stream leans on the trade route.
7%
Stone Quarrying Stone masons work imported material; the quarrying income notation reflects processing margin only.
Almost everyone's living at Yunba depends on one trade, whether or not they work in it. The religious houses at Yunba are among its biggest buyers and employers, and a bad year for them is a bad year for the village. Every load of metals used at Yunba comes from elsewhere, because the country here produces none.
Trade Profile▲
Exports
Milled flourRaw woolLivestockHealing waters (bottled)Pilgrim hospitalityCoalRoof tilesPreserved foodsBarrels and containers
Imports
Cordage, canvas, and vessel-maintenance suppliesIncense and votive candlesQuality paper and inkLuxury goodsMetalsMountain timberStone (for major construction)
Terrain cannot produce
A merchant who comes to Yunba for one thing usually leaves with two or three.
Produced locally
flourprocessed textileslivestockwooldairyanimal hidesmedicinal herbscoalclaypotteryPreserved foodsLeather goodsMedical care (basic)Spellcasting (minor)Barrels and containersFlour and mealMilled lumberReligious servicesHospitality for travellers
Food Security▲
Production: 749 lbs/dayNeed: 650 lbs/day
Agriculture modifier: 157%
Yunba grows more than it eats, with some to put by against a bad year.
No granary; two months in household stores.
The herds' milk and mutton and fish from the local waters anchor the table; flour from the mill fills the winter. Shared waterworks, fermentation, and intensive garden production structure urban food supply.
Yunba is fed, but only just. A poor harvest is felt at every table; a good one means a little put by.
Yunba's food comes from more than one source, the herds most of all, so a poor year in one does not empty the village's tables.
Economic Flows (10 active)▲
?
What is made here and what it depends on.
All (10)
Issues (1)
✓ Productive (6)
Entrepôt (1)
Livestock & DairyFood security✓ Running
From
Grazing land
Via
Common grazing land
Outputs
Preserved foodsLeather goods
Divine & Magical HealingHealing & medicine✓ Running
Hot springs
House of worship
Medical care (basic)Spellcasting (minor)
Pottery & BrickmakingManufacturing & crafts✓ Running
Clay deposits
Brickmaker
Pottery and ceramicsFired brickRoof tiles
Clay & CeramicsRaw materials & fuel✓ Running
Pottery and ceramicsBarrels and containers
River Mill IndustryRaw materials & fuel✓ Running
Mill Sites
Mill · Sawmill
Flour and mealMilled lumberFulled cloth
Pilgrimage & Holy SitesReligion & civic✓ Running
Religious servicesHospitality for travellersPoor relief
Strategic Crossroads TollTrade & entrepôtEntrepôt
Strategic Crossroads
Toll bridge
Toll incomeMarket taxesTransit trade profit
Taverns & Social LifeEntertainment & culture○ Operational
Travelers' inn
LodgingMeals and drinkStabling
News & Public InformationKnowledge & informationVulnerable
Import: Maps & Cartography
Cartographer's guild
News and informationBroadsheetsPublic proclamations
Needs imported cartography: no local source
Faith & WorshipReligion & civic○ Operational
Religious servicesEducation (basic)Poor relief
Yunba's Cartographer's guild stands idle: its supply has failed upstream, though the building and the skilled hands are still there.
Shadow Economy: 4% capture▲
4%
Off-book
There is some thieving and some selling without a licence. Every village this size has both.

== Systems/Resources ==
Terrain
Riverside
What the land offers
✓ Agriculture✓ Milling✓ River trade
Resource Exploitation▲
PartialClaymedium value
Clay→fired clay→ceramic blanks
Draws on: clay deposits, fuel
✓ Fully exploitedLivestockmedium value
Draws on: grazing land
For as long as others value Yunba's position, the village will have to reckon with who wants it and what they will offer for it. clay leaves Yunba half-finished, and nobody in the village is troubled by it.
Nearby Resources▲
Abundant
Coal DepositsGrazing LandHot SpringsRiver ClayRiver Mills
Commodities available
river millsflourprocessed textilesgrazing landlivestockwooldairyanimal hideshot springsmedicinal herbscoal depositscoalriver clayclaypottery
Gaps & Opportunities▲
Work on the clay here stops half-way: no potter finishes it.
Export Potential▲
leather goods, cheese, preserved meat
Complete production chain in place
fired clay, ceramic blanks
Partial processing - exports semi-finished goods


#### r2read-city-4 (city)
== Summary/Overview ==
Karakkalacity· 14,779 pop.· road· 370 years old
Arabic-inspired; people here live in a place built around courtyards and waterworks, on endowed institutions and the caravan road. Governed by Democratic assembly · Fragile (private security above the public law)
"This place is older than the Flood, but people here date everything from it: before it, and after"
Hills
Open Tonight
The place
Karakkala is ordinary in the best sense: a place where people live and work and argue and sleep, which is most of what places are for. The citadel on the high ground makes clear that this settlement has been defended before and expects to be again. Racks of new ironwork stand outside the workshops, waiting for the carts. A merchant swears an oath on his scales, and the buyer watches the scales anyway.
Systems Health▲
?
Safety, viability and defense, read side by side. As judged at the first survey · Food Security is re-judged as the campaign advances.
Prosperity
Comfortable
Safety
Moderate
Viability
Viable
Defense
Well-defended
Reliance on magic
Integral
Monster DefenseStrong
Economic ResilienceStrong
Magical CapabilityWeak
Food SecuritySecure
The market stands where carts always stopped. A traveller passing through Karakkala can change coin, borrow or settle a debt at the city's bank without carrying the silver home. Its warehouses fill after the harvest and empty through the year as the city trades out of them. The city keeps its own court and its own gaol.
Tensions & Conflicts▲
Who is at odds with whom, and how badly.
▸
Word of a miracle brought pilgrims in numbers the settlement had never been meant to hold, and the coin and strangers that came with them left it permanently altered
Temple beneficiariesOverwhelmed old residentsSceptics who doubt the miracle
Rival guilds fought over who may sell what, and over a say in how the place is run
Established guildsUpstart guildsNon-guild workers
Democratic assembly vs Merchant GuildsHigh
Access to the criminal network's intelligence
Merchant Guilds vs Thieves' GuildModerate
Control of the market licensing process
A guild's private soldiers arrested a rival's factor. The watch is refusing to intervene in what they call a 'merchant matter'.
Settlement Origin▲
The road was here first. The settlement grew along its verge, and most of what it owns arrived on somebody else's cart.
Large enough that its appetites outrun its fields. What the city consumes, it cannot fully produce.

== Systems/Economics ==
Comfortable
Highly diversified — multiple major revenue streams
Trade
road
Output
51/100
With a little left over each year, Karakkala gets by on a spread of trades, and every year people argue over how to spend it.
Income Sources▲
26%
Market Taxes District-level duties on specialized goods; a major civic revenue stream across the urban districts.
14%
CriminalCriminal Syndicate Revenue Guild-run fencing, extortion and black-market trade bring money in here, but it goes to the criminals who run them and the treasury sees none of it.
10%
Guild Fees Annual licensing fees and fines levied by guild oversight.
8%
Banking Fees Interest income, currency exchange commissions, and safe deposit charges.
Property Rents Ground rents on civic-owned buildings, stalls, and residential plots within the walls.
7%
Security Contracts Guild-funded private security surcharges: effectively a privatised protection tax on trade.
6%
Court Fees & Fines Filing fees, fines levied on offenders, and fees for notarial and legal certification services.
Gate Tolls Entry and exit tolls collected at the city gates from merchants and travellers.
5%
Iron & Metalwork Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption.
Wool & Textile Trade Wool bought from pastoral regions and processed locally: value-add trade dependent on consistent supply.
3%
Spellcasting Services Fees for identification, minor enchanting, and divination. Adventurers and merchants both pay well for reliable magical services.
2%
Apothecary & Alchemy A thriving alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.
Ask what Karakkala lives on and you will hear two or three trades named, not one. Some of the money in Karakkala is made outside the law, and honest traders compete against it without knowing whom they are up against. Every load of gold/silver ore that Karakkala's
Smelter
uses comes in from elsewhere; a closed road would stop its work within the season.
Trade Profile▲
Exports
Reeds and thatchWaterfowlSpellcasting (minor)Magical identificationGlasswareBooks and manuscriptsNews and informationMaps and chartsQuality tools and weaponsFinancial services (letters of credit)Legal services (contracts, notarial)Military contract servicesScholarly services (research access, rare texts)Alchemical trade (potions, reagents)
Imports
CapitalCoal and fuel (local seams exhausted)Game and hides (local hunting grounds exhausted)GrainIron ore (local iron mines exhausted)Luxury textiles and exotic goodsMedicinal herbsPaper materialsSaltTimberClayFine textilesGold/silver oreLuxury goodsMountain timberSpices
Terrain cannot produce · Settlement necessity
The carts that leave Karakkala carry several kinds of goods, not one.
Produced locally
trade accesspeathoneymedicinal herbsDefence servicesWeapons trainingOverland cargo transportEscorted caravanToll incomeStrategic controlReeds and thatch
Food Security▲
Production: 20,078 lbs/day+ 9,480 importedNeed: 29,558 lbs/day
Agriculture modifier: 90%Trade covers 100% of gap
What is grown here and brought in covers each day's food, with nothing to spare against a bad year.
Stores: a granary, nine months of grain.
Water access and preservation skill determine the balance between local produce and caravan-borne staples.
The city eats. It is not a subject anyone raises unprompted.
Bread at Karakkala is as likely to come from somebody else's fields as from the city's own, and everyone knows which days the carts arrive.
Economic Flows (34 active · 8 impaired)▲
?
What is made here and what it depends on.
All (34)
Issues (17)
✓ Productive (1)
Entrepôt (1)
Services (7)
Hunting & TrappingFood securityImpaired
From
Hunting grounds (depleted)
Via
Tanner (established)
Normally yields
Game meatFurs and peltsHunting trophies
Herbalism & RemediesHealing & medicineVulnerable
Wild foraging areas (depleted)
Apothecary · Midwife
Herbal remediesPotions and elixirs
Alchemical remedies supplement treatment
Leather & HidesManufacturing & craftsImpaired
Tanner (established) · Cobbler's guild · Furrier's district
Leather goodsGuild-manufactured goods
Weapons & ArmorManufacturing & craftsImpaired
Iron ore deposits (depleted)
Specialized metalworkers · Blacksmiths
Quality tools and weaponsAdvanced weapons and armorMaster-crafted weapons
Needs Iron + fuel - Dependent on trade routes. Siege, road closure, or blockade would impair operations. · affects: weapon repair, tool sharpening, armour fitting
Beekeeping & WaxManufacturing & craftsImpaired
Chandler
Wild honeyCandles and waxMead
Iron & MetalworkRaw materials & fuelImpaired
Mine · Blacksmith · Blacksmiths
Needs Iron + fuel · affects: weapon repair, tool sharpening, armour fitting
Contributes to Iron & Metalwork - 5% of income
Fuel & HeatingRaw materials & fuelImpaired
Coal or peat deposits (depleted)
Charcoal burner
CoalPeat fuel
Smelting & RefiningRaw materials & fuelImpaired
Smelter · Specialized metalworkers
Refined iron ingotsPig ironCast iron goods
Needs Metal ore + fuel · affects: fine metalwork, armour crafting, weapon commission
Furs & PeltsTrade & entrepôtImpaired
Furrier's district
Furs and peltsLeather goods
Furs originate in frontier/northern settlements and travel south through trading posts. Mid-route settlements profit from the trade.
Standing GarrisonDefense & securityVulnerable
Garrison · Professional city watch
Outputs
Defence servicesWeapons training
Needs Iron + fuel · affects: law enforcement, patrol, investigation
Caravan & Overland TradeTrade & entrepôtVulnerable
Caravan masters' exchange
Overland cargo transportEscorted caravanPack animal hire
Needs Capital + trade access · affects: caravan finance, commodity contracts, freight brokerage
Mountain Pass ControlTrade & entrepôtVulnerable
Mountain Pass
Toll bridge · Garrison · Customs house
Toll incomeStrategic controlTrade access fees
Needs Iron + grain + fuel · affects: military garrison, armed response, siege defence
Spellcasting ServicesArcane & magicalVulnerable
Wizard's tower
Spellcasting (minor)Magical identificationEnchanting services
Needs Magical ley lines · affects: spellcasting, magical research, arcane consultation
Contributes to Spellcasting Services - 3% of income
Taverns & Social LifeEntertainment & cultureVulnerable
Inns and taverns (district)
LodgingMeals and drinkStabling
Needs Grain · affects: meals, ale, lodging
Hospital & SurgeryHealing & medicineVulnerable
Major hospital · Foundling home
Medical treatmentSurgeryQuarantine
Needs Medicinal herbs + supplies · affects: healing, surgical care, long-term recovery
Intelligence & CommunicationsKnowledge & informationVulnerable
Post relay station · Sage's quarter
Information brokerageLong-distance messagesIntelligence services
Needs Paper materials · affects: research, document copying, sage consultation
Glass & PrintManufacturing & craftsVulnerable
Glassmakers · Printing house
GlasswareBooks and manuscriptsPrinting services
Needs Timber/rags (paper) · affects: printed documents, books, pamphlets
Reed & Marsh HarvestRaw materials & fuel✓ Running
Marshlands
Chandler · Ropemaker · Merchant guilds (3-8)
Reeds and thatchPeat fuelWaterfowl
Black marketCriminal economy○ Operational
Front businesses · Black market · Thieves' guild (powerful)
Contraband goodsForged documentsFencing stolen goods
Organised CrimeCriminal economy○ Operational
Thieves' guild (powerful)
Information brokerageGuild protectionContract killing
Adventuring & EscortDefense & security○ Operational
Adventurers' charter hall · Adventurers' guild · Multiple adventurers' guilds
Armed escortMonster hunting servicesDungeon clearance
Performance & TheaterEntertainment & culture○ Operational
Theater · Bardic college
PerformancesMusic and songMusical education
Gambling & ArenaEntertainment & culture○ Operational
Gambling halls
Games of chance
Maps & CartographyKnowledge & information○ Operational
Cartographer's guild
News and informationMaps and charts
News & Public InformationKnowledge & information○ Operational
News and informationBroadsheetsPublic proclamations
Faith & WorshipReligion & civic○ Operational
House of worship · Multiple monasteries · Foundling home
Religious servicesEducation (basic)Poor relief
Law & GovernanceReligion & civic○ Operational
Courthouse · City hall · Multiple court buildings
Civil disputesCriminal trialsNotary services
Service economy
Banking & FinanceServiceExport○ Operational
Via:banking houses
Financial services
Legal ServicesServiceExport○ Operational
Via:multiple courthouses
Legal services
Military ContractsServiceExport○ Operational
Via:professional city watch
Armed escort & mercenary hire
Medical ServicesService○ Operational
Via:major hospital
Medical & surgical services
Entertainment & CultureServiceExport○ Operational
Via:bardic college
Entertainment & cultural tourism
Scholarly RevenueServiceExport○ Operational
Via:sage's quarter
Research & scholarly services
Alchemical TradeServiceExport○ Operational
Via:alchemist quarter
Alchemical products & services
Karakkala works capital it cannot produce; it buys the raw stuff in, and always has.
Shadow Economy: 25% capture▲
25%
Off-book
Goods change hands here in back rooms and after dark, the duty on them goes unpaid, and the stalls that pay their fees lose custom to the ones that do not.
Criminal supply chains
Black market · OperationalGuild crime · Operational
There is a cheaper way to do most things here, and most people know somebody who knows it.
The way into Karakkala's
Underground network
is through a cellar, and the people who use it come and go by passages under the city.

== Systems/Resources ==
Terrain
Hills
The people of Karakkala know what their ground is worth to others, and know they could not keep it against anyone who came for it. Nobody at Karakkala bothers with the hunting grounds this year: there is nothing left worth taking, and the people who lived off the hunting grounds have turned to other work until the ground recovers.
Nearby Resources▲
Depleted
Coal DepositsForaging AreasHunting GroundsIron Deposits
Abundant
Defended PassMarshlands
Commodities available
defended passtrade accessmarshlandspeathoneymedicinal herbs
Gaps & Opportunities▲
No clay reaches the potter.
No clay reaches the brickmaker.


#### r2read-metropolis-2 (metropolis)
== Summary/Overview ==
Tulumtzinmetropolis· 181,621 pop.· port· 558 years old
Mesoamerican-inspired. Ask about the place and you are told it is built around a civic-ritual plaza, tribute, and market-and-waterworks. Governed by Democratic assembly · Rigid (militant theocracy)
"An ordinary place that has outlasted grander neighbours by getting the small things right, year after year"
Coastal
Open Tonight
The place
You hear Tulumtzin's harbour before you see it: rigging knocking against masts, dock crews calling cargo tallies, and surf working against the outer wall. A cathedral dominates the skyline. Larger than anything else in the settlement, which may say something about what matters here. The clatter of looms follows you through Tulumtzin, from one shutter to the next. Festival banners hang above the doors, faded from one year and waiting for the next. Even the outbuildings have new roofs, and nobody looks hungry.
Systems Health▲
?
Safety, viability and defense, read side by side. As judged at the first survey · Food Security is re-judged as the campaign advances.
Prosperity
Wealthy
Safety
Very safe
Viability
Viable
Defense
Fortress
Reliance on magic
Integral
Monster DefenseStrong
Economic ResilienceStrong
Magical CapabilityStrong
Food SecuritySecure
Half the goods traded in Tulumtzin are only passing through. A traveller passing through Tulumtzin can change coin, borrow or settle a debt at the metropolis's bank without carrying the silver home. A trader at Tulumtzin can rent warehouse space and leave goods there between journeys. The metropolis keeps its own court and its own gaol. Ask the way anywhere in Tulumtzin and you will be given it from the cathedral. The monastery keeps its own hours.
Tensions & Conflicts▲
Who is at odds with whom, and how badly.
▸
A surge in criminal activity overwhelmed the authorities; vigilantes began to form
Military/GuardVigilantesthe criminal network
A recently arrived group and the established population fell into sustained, low-level conflict
Old familiesNewcomersMerchants who benefit from cheap newcomer labour
News of approaching danger divided the community on how to respond
Prepare for warSeek diplomacyFlee/hide
Democratic assembly vs The Commercial CircleHigh
An unpaid debt between the two powers
The commander-prelate has declared a heresy investigation into a rival settlement. The garrison is mobilizing.
Settlement Origin▲
A seaport. The tide sets the working day, and the harbour is the only asset that finally matters.
Everything in the region is bought, sold or decided here.
Notable connection
Balam Kanil and Xaman Oc are bound by work done for the faith. Balam Kanil's men have started praying at a different shrine. Xaman Oc counts the empty places at every service.
Full relationship web →

== Systems/Economics ==
Wealthy
Highly diversified — multiple major revenue streams
Trade
port
Output
86/100
Tulumtzin lives on a spread of trades and ends each year with money to spare, and the traffic on its port keeps it that way.
Income Sources▲
19%
Market Taxes District-level duties on specialized goods; a major civic revenue stream across the urban districts.
13%
Port Duties Import and export taxes, anchorage fees, and customs inspection on all cargo.
10%
Guild Licensing Charter fees, quality inspection levies, and licensing of all trades and crafts.
9%
International Commerce Revenue from international trade: licensing fees, currency exchange, and commodity brokerage.
8%
Financial Services Civic taxes on banking operations, letters of credit, and financial transaction fees.
7%
Property Rents Ground rents on civic-owned buildings, stalls, and residential plots within the walls.
5%
Church Tithes Tithes, offerings, and fees for burial and sacramental services collected by resident clergy.
4%
Arcane Industry Enchanting contracts, magical research commissions, and the licensing of spellcasting practitioners. The mages' guild contributes meaningfully to civic revenue.
Court Fees & Fines Filing fees, fines levied on offenders, and fees for notarial and legal certification services.
Fish & Maritime Produce Catch landed and sold fresh or preserved; salt fish are a major regional export commodity.
Iron & Metalwork Iron imported from mining regions and worked locally; this income stream is vulnerable to supply disruption.
Military Levy Emergency and standing levies on the population to fund garrison upkeep.
Wool & Textile Trade Wool bought from pastoral regions and processed locally: value-add trade dependent on consistent supply.
3%
Spellcasting Services A busy market for spell services. Identification, augury, message sending, and contract-grade enchanting brings steady coin.
2%
Apothecary & Alchemy A thriving alchemical trade in reagents, preparations, and curative potions draws customers from surrounding settlements.
Tulumtzin lives on many small trades, and none of them brings in a real portion of its income. The religious houses at Tulumtzin are among its biggest buyers and employers, and a bad year for them is a bad year for the metropolis. Every load of grain that Tulumtzin's Mill uses comes in from elsewhere; a closed road would stop its work within the season.
Trade Profile▲
Exports
Ship passageMaritime trade accessSea saltSpellcasting (minor)Magical identificationMaritime trade revenueShip constructionMagical item marketWeapon enchantmentNews and informationMaps and chartsFinancial services (letters of credit)Legal services (contracts, notarial)Pilgrimage & religious tourismEducational services (degrees, training)Military contract servicesArcane services (identification, enchanting)Maritime services (cargo, pilotage)Scholarly services (research access, rare texts)
Imports
GrainIronLuxury materialsMedicinal herbsPaperPaper materialsPrecious metal veinsRecovered artefacts (local ruins exhausted)Shipbuilding timber (local shipbuilding stands cleared)StoneClayCopper oreGold/silver oreGrapesIron oreMountain timberTimber (for large vessels)
Terrain cannot produce
The trade here is in the moving of things. Very little of what leaves began here.
Produced locally
maritime accesssaltSpellcasting (minor)Magical identificationInformation brokerageLong-distance messagesMaritime trade revenueShip constructionFinancial servicesInternational banking servicesPreserved foods
Food Security▲
Production: 200,695 lbs/day+ 162,547 importedNeed: 363,242 lbs/day
Agriculture modifier: 89%Trade covers 100% of gap
What is grown here and brought in covers each day's food, with nothing to spare against a bad year.
Stores: a granary, 15 months of grain.
Most meals start from salted fish. Intensive plots, terraces, raised fields, and tribute redistribution support dense populations.
Tulumtzin feeds itself with a small margin. The counts come out ahead by a little, every season, without much drama.
Bread at Tulumtzin is as likely to come from somebody else's fields as from the metropolis's own, and everyone knows which days the carts arrive. It lives off its fishing and little else. One bad year for the fishing would be a hungry year for the whole metropolis.
Economic Flows (37 active · 1 impaired)▲
?
What is made here and what it depends on.
All (37)
Issues (18)
✓ Productive (1)
Entrepôt (9)
Services (10)
Fishing & SeafoodFood securityVulnerable
From
Fishing grounds (depleted)
Via
Cooper · Salt works · Merchant guilds (3-8) · Fish market
Normally yields
Salted fishSmoked seafoodFish oil
Druids call fish and bless the waters50% recovery
Scholarship & PublishingKnowledge & informationImpaired
Ancient ruins (depleted)
Sage's quarter
Books and manuscriptsHigher educationResearch
Needs Paper materials - Dependent on trade routes. Siege, road closure, or blockade would impair operations. · affects: research, document copying, sage consultation
Shipbuilding and TimberRaw materials & fuel✦ Magically Sustained
Coastal Timber (depleted)
Shipyard · Sawmill
Ocean-going vesselsRiver bargesCoastal craft
Needs Timber + iron · affects: ship construction, ship repair, vessel fitting
Druidic forest management accelerates regrowth and sustainable yield55% recovery
Spellcasting ServicesArcane & magicalVulnerable
Mages' district
Outputs
Spellcasting (minor)Magical identificationEnchanting services
Needs Magical ley lines · affects: high-level spellcasting, arcane research, enchanting
Contributes to Spellcasting Services - 3% of income
Intelligence & CommunicationsKnowledge & informationVulnerable
Information brokerageLong-distance messagesIntelligence services
Needs Paper materials · affects: research, document copying, sage consultation
Harbour and MaritimeRaw materials & fuelVulnerable
Deep Natural Harbour
Harbour master's office · Docks/port facilities · Shipyard
Maritime trade revenueShip constructionVessel maintenance
Letters of Credit & FinanceTrade & entrepôtVulnerable
Banking district
Financial servicesInternational banking services
Needs Precious metals · affects: currency exchange, loans, investment
Magical Items & EnchantingArcane & magicalVulnerable
Magical ley line node
Enchanter's shop · Scroll scribe · Academy of magic · Mages' district
Magical item marketWeapon enchantmentArmour warding
Standing GarrisonDefense & securityVulnerable
Garrison · Professional city watch
Defence servicesWeapons training
Needs Iron + fuel · affects: law enforcement, patrol, investigation
Mercenary ForcesDefense & securityVulnerable
Mercenary quarter
Armed escortMercenary hireTraining services
Needs Iron + grain · affects: mercenary hire, armed escort, contract soldiers
Taverns & Social LifeEntertainment & cultureVulnerable
Inns and taverns (district) · Public bathhouse
LodgingMeals and drinkStabling
Needs Grain · affects: meals, ale, lodging
Hospital & SurgeryHealing & medicineVulnerable
Hospital network
Medical treatmentSurgeryQuarantine
Needs Medicinal herbs + supplies · affects: healing, surgical care, quarantine
Maps & CartographyKnowledge & informationVulnerable
Great library · Cartographer's guild
News and informationMaps and charts
Needs Paper + knowledge sources · affects: research, document copying, archival access
Luxury GoodsManufacturing & craftsVulnerable
Precious metal veins
Specialized metalworkers · Luxury goods quarter
Luxury manufactured goodsFine metalwork and jewelryExtreme luxury goods
Needs Metal ore + fuel · affects: fine metalwork, armour crafting, weapon commission
Faith & WorshipReligion & civicVulnerable
House of worship · Cathedral · Major monasteries
Religious servicesEducation (basic)Poor relief
Needs Stone · affects: religious services, pilgrimage centre, diocesan administration
Spices & DyesTrade & entrepôtVulnerable
Merchant guilds (3-8) · Merchant guilds (15-40) · Luxury goods quarter · Annual fair
Rare spices and exotic dyes
Needs Luxury materials · affects: luxury clothing, fine jewellery, decorative goods
Silk & Luxury TextilesTrade & entrepôtVulnerable
Luxury goods quarter · Merchant guilds (15-40) · International trade center
Fine textilesLuxury manufactured goods
Salt & PreservationFood security✓ Running
Salt flats
Salt works
Preserved foods
Salt is among the most-traded commodities. Port and crossroads settlements profit from redistribution.
Furs & PeltsTrade & entrepôtEntrepôt
Hunting grounds
Furrier's district
Furs and peltsLeather goods
Furs originate in frontier/northern settlements and travel south through trading posts. Mid-route settlements profit from the trade.
Wine & SpiritsTrade & entrepôtEntrepôt
Vintner · Brewer · Brewery
Meals and drinkPreserved foods
Wine is produced in specific vineyard regions and consumed everywhere. Port and river settlements profit from redistribution.
Strategic Crossroads TollTrade & entrepôtEntrepôt
Strategic Crossroads
Toll bridge · Customs house
Toll incomeMarket taxesTransit trade profit
Adventuring & EscortDefense & security○ Operational
Adventurers' charter hall · Adventurers' guild · Multiple adventurers' guilds · Veteran's lodge
Armed escortMonster hunting servicesDungeon clearance
Performance & TheaterEntertainment & culture○ Operational
Theater · Bardic college
PerformancesMusic and songMusical education
Gambling & ArenaEntertainment & culture○ Operational
Arena · Gambling district
Games of chanceGladiatorial combatMonster exhibitions
News & Public InformationKnowledge & informationVulnerable
Cartographer's guild
News and informationBroadsheetsPublic proclamations
Upstream cartography chain is impaired
Glass & PrintManufacturing & craftsVulnerable
Import: Clay & Ceramics
Glassmakers
GlasswareBooks and manuscriptsPrinting services
Needs imported clay: no local source
Law & GovernanceReligion & civic○ Operational
City hall · Multiple court buildings
Civil disputesCriminal trialsNotary services
Service economy
Banking & FinanceServiceExport○ Operational
Via:banking district
Financial services
Legal ServicesServiceExport○ Operational
Via:multiple court buildings
Legal services
Religious RevenueServiceExport○ Operational
Via:major monasteries (5-10) · great cathedral
Religious services
Education & ScholarshipServiceExport○ Operational
Via:academy of magic
Higher education
Military ContractsServiceExport○ Operational
Via:professional city watch · multiple garrisons
Armed escort & mercenary hire
Arcane ServicesServiceExport○ Operational
Arcane & spellcasting services
Medical ServicesService○ Operational
Via:hospital network
Medical & surgical services
Entertainment & CultureServiceExport○ Operational
Via:multiple theaters · opera house
Entertainment & cultural tourism
Port RevenueServiceExport○ Operational
Via:shipyard · docks/port facilities
Port & maritime services
Scholarly RevenueServiceExport○ Operational
Via:great library · sage's quarter
Research & scholarly services
Some of Tulumtzin's work depends on cartography done elsewhere, and that supply is failing: what should come down the line arrives short.

== Systems/Resources ==
Terrain
Coastal
What the land offers
✓ Maritime trade✓ Salt production
Others want Tulumtzin for what it controls. The people who live there see little of that value. The metropolis has worked out its ancient ruins, and it will not come back on its own: someone has to put labour and money into it before it yields again.
Nearby Resources▲
Depleted
Ancient RuinsFishing GroundsShipbuilding Timber
Abundant
Deep HarbourSalt Flats
Commodities available
deep harbourmaritime accesssalt flatssalt
Gaps & Opportunities▲
No grapes reach the vintner.
No clay reaches the potter.
No clay reaches the brickmaker.

```
