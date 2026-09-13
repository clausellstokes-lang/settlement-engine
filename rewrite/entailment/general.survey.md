# ENTAILMENT SURVEY — THE GENERAL DESK (overview / relations / population / hooks)

Lane `laneRW-DEFW`, dock `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW`, detached at `f2da5a3ee`. READ-ONLY: nothing modified, staged or committed; no vitest, no build; the only node run was `scripts/prose-licence-card.mjs`, which prints and writes nothing.

This packet is EVIDENCE, not law. Every row is a candidate for the chair. Nothing here is ruled.

---

## 0. SCOPE — HOW THE DESK'S BLOCK SET WAS DERIVED (not guessed)

The wave gate does not carry a prefix list. `scripts/prose-wave-gate.mjs:292-300` records that a hand-written prefix list DRIFTED and was replaced: "a leaf IS a section". `SECTION_LEAVES` at `scripts/prose-wave-gate.mjs:292-299` maps `general` → `DOSSIER_STATE_PROSE_GENERAL`, imported at `scripts/prose-wave-gate.mjs:109` from `src/data/dossierStateProse/general.generated.js`. The projector's own `DESKS` table gives that leaf its prefixes.

| item | value | file:line |
|---|---|---|
| desk key | `general` | `scripts/prose-wave-gate.mjs:295` |
| desk title | THE OVERVIEW / RELATIONS / POPULATION / HOOKS DESK | `scripts/generate-dossier-state-prose.mjs:114` |
| block prefixes | `DS-GEN-` · `DS-REL-` · `DS-POP-` · `DS-HK-` | `scripts/generate-dossier-state-prose.mjs:114` |
| candidate leaf | `src/domain/display/stateProse/generalStateProseCandidates.js` | `scripts/prose-licence-card.mjs:62-65` |
| desk leaf (key functions) | `src/domain/display/stateProse/generalStateProse.js` (2048 lines) | — |
| blocks | 23 (DS-GEN-1,2,3,5,6,7,8,9,10,11,12,13,14,15,16,17,18 · DS-REL-1,2 · DS-POP-1,2,3 · DS-HK-1). DS-GEN-4 is folded into DS-STR-1 (stressors desk) | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5366` |
| census rows | 193 of 708 | `docs/content/wiring-census.json` |
| RESOLVED | 119 | " |
| WIRING-UNRESOLVED | 74 | " |
| covert pools | 0 | " |
| rungs | literal 50 · table 39 · template 30 · none 74 | " |
| holder kinds resolved | none 162 · treasury 7 · elders 5 · road 5 · market+toll-bar 4 · market 4 · toll-bar 3 · office 3 | " |

### 0.1 LICENCE CARDS RUN (11, spread across 10 blocks; the brief asked for five)

`node scripts/prose-licence-card.mjs <block> <pool>` — all `role spine`, all `sentence` form, all `(a spine takes no relation)`, all `attach (empty)`.

| block :: pool | reads (as printed) | source / standing | may claim | may NOT |
|---|---|---|---|---|
| DS-GEN-3 :: `prosperity: Moderate / Modest` | `text(label) (via PROSPERITY_POOL_OF in generalStateProse.js)` | (none) · SOURCE-UNRESOLVED | that the reader selects the row `Moderate` of `PROSPERITY_POOL_OF`, as a STANDING fact of the record | a count, a cause, a season, a future, a standpoint, a second fact |
| DS-GEN-6 :: `crossroads` | `text(tradeRouteAccess) (via ORIGIN_POOL_OF_ROUTE …)` | **toll-bar · LICENSED** | selects the row `crossroads` … STANDING | " (+ marks in this pool: deficit / no deficit) |
| DS-GEN-12 :: `WATER-EDGE` | `text(terrainType) (via TERRAIN_FAMILY_OF …)` | **road · LICENSED** | selects the row `coastal` … STANDING | " |
| DS-GEN-13 :: `ENTREPOT` | `readings` · `readings.isEntrepot` · `readings.tradeRouteAccess` | **market + toll-bar · LICENSED · two-source row** | that `readings` holds, as a STANDING fact | " |
| DS-GEN-17 :: `GARRISONED` | `readings.inst` | (none) · SOURCE-UNRESOLVED | that `inst` holds … STANDING | " |
| DS-GEN-18 :: `STALLED` | `readings` + `.activeChains` `.exploitation` `.isEntrepot` `.primaryImports` | **market · LICENSED** | that `readings` holds … STANDING | " |
| DS-POP-3 :: `FALLING-NARROW` | `readings.populationTrend.band` · `.window` | (none) · SOURCE-UNRESOLVED | that `band` holds … STANDING | " |
| DS-GEN-16 :: `ANCHORED-OLD` | `events` | (none) · SOURCE-UNRESOLVED | that `events` holds … STANDING | " |
| DS-REL-1 :: `patron` | `link` | (none) · SOURCE-UNRESOLVED | that `link` holds … STANDING | " **+ "another civic object of the class `temple`"** ← see ALIAS TRAP A-13 |
| DS-GEN-8 :: `history.ancientRuin present` | `ruin` · `ruin.name` | (none) · SOURCE-UNRESOLVED | that `ruin` holds … STANDING | " |
| DS-GEN-14 :: `FOUNDED-OLD` | `hist` **(not-produced)** | (none) · SOURCE-UNRESOLVED | that `hist` holds … STANDING | " |

Every card also prints the standing refusal: *"a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)."*

**What the printed grammar already gives the owner's question.** The `may NOT` line is a fixed six-term refusal (`a count, a cause, a season, a future, a standpoint, a second fact`) plus a civic-object term. It refuses the CATEGORIES the owner calls "typically has" — a count, a cause, a history (`a cause` + `a season`) — but it says nothing at all about what the noun MEANS. The definitional half of the owner's rule has no column on the card today. That is the gap this packet inventories.

---

## 1. SLOT NOUNS OF THE DESK — every one, with its shape, its fill and what the word carries

Declared shapes: `src/domain/display/stateProse/generalStateProse.js:102-137` (`SLOT_FILL_SHAPES`), mirrored against §0c/§0c-2 (`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:169-183`, `:194-210`). Fill guards: `properFill` at `generalStateProse.js:157-165`, `bareCommonFill` at `:1210-1220`.

| slot | shape | filled from (file:line) | the word ITSELF entails | the word does NOT carry |
|---|---|---|---|---|
| `{settlement}` | proper | the page's own town | that this is the town whose page this is (§0c R-DOS-A, `RECEIPT_POOLS_DOSSIER_STATE.md:169`) | size, age, tier, walls, prosperity |
| `{counterpart}` | proper | `neighbourNetwork[].neighbourName` via the link (`generalStateProse.js:1483-1495`) | that a DIRECTED relation exists to a second settlement | that the counterpart is a town rather than a hold; its size, its distance, its own standing |
| `{faction}` / `{faction2}` | proper | `currentTensions[].factions[]`, `conflicts[].parties[0..1]` (`RECEIPT_POOLS_DOSSIER_STATE.md:5178,5260`) | that a NAMED political actor is a party to this record | its power, its size, its legitimacy, whether it governs |
| `{govFaction}` | proper | the governing faction on the temple-economy coherence note (`:201`) | that this faction holds the seat on THIS note | how it came to hold it |
| `{governing}` | proper | the legitimacy clock's framing (`:202`, `src/domain/hookEscalation.js:412-421`) | the governing power as the clock names it | its tenure, its popularity |
| `{controller}` | proper | a hook's controlling interest where the record names one (`:203`, `hookEscalation.js:391-409`) | that the hook record names a holder | that the holder is hostile, or that it is a faction rather than a house |
| `{npc}` | proper | `npcConnections[].primaryNPCName`, **this town's end only** (`generalStateProse.js:1524-1539`) | that a cast person is named on a member receipt | any fate; product scope forbids it (printed on every card) |
| `{issue}` | phrase | `conflicts[].issue` verbatim (`:199`) | that the record states a matter in dispute | that either side is right; that it is old |
| `{stakes}` | phrase | `conflicts[].stakes`, **only where non-empty** (`:200`) | that something FORWARD stands to change hands | that it will change hands; never synthesise from `issue` (`RECEIPT_POOLS_DOSSIER_STATE.md:5260` STAKES ARM) |
| `{steading}` | proper | a satellite steading by its own name (`:204`) | that a satellite is on this town's ledger | its head count (`{band}` is RESERVED and refused — `generalStateProse.js:125-131`) |
| `{ruin}` | proper | `history.ancientRuin.name` (`generalStateProse.js:1417-1423`) | that a fallen settlement stands nearby and is named | who fell, why, or when in years (the band, never the figure) |
| `{event}` | proper | a historical event by its recorded name (`:206`) | that the record names this event | that it is still felt (that is `anchored`, a separate field) |
| `{founder}` | phrase | `founding.foundedBy` (`:207`, re-declared §0c-4 at `:212`) | a lowercase descriptive PHRASE carrying its own determiner | a NAME — 26 of 26 producer values fail `proper` (`RECEIPT_POOLS_DOSSIER_STATE.md:236-241`); the slot is UNFILLED at this tip for a sentence-initial grammar reason (`:246-259`) |
| `{challenge}` | phrase | `founding.initialChallenge` (`:208`) | that the record names a first trial | that it was overcome (`overcoming` is a separate field) |
| `{reason}` | bare-common | the RECORDED reason from the field's own reason slot (`:182`) | that the record TYPED a reason | that the reason is the whole cause |
| `{calamity}` | bare-common | **DS-GEN-16**: `EVENT_TYPE_NAMES[type]` lowercased by `calamityFill` (`generalStateProse.js:509-517`); **DS-GEN-15**: a fabric scar's `kind` (wiring debt, unbuilt — `:139` of the annex) | that a typed blow is ON THE RECORD | its cause, its scale, its author; and see LABEL TRAPS L-6/L-7 — three of the thirty words mean something other than their English |
| `{timeband_since}` | phrase | `timebandSinceFill` (`generalStateProse.js:466-469`) over `TIME_BANDS` | an elapsed span as a BAND | a year, a date; **null beyond a generation** — 89 of 108 measured events return `undefined` (`:454-465`) |
| `{timeband_age}` | phrase | `timebandAgeFill` (`generalStateProse.js:476-479`) | an age as a BAND, total over the ladder | a year, a founding date — the engine holds NO construction date (`RECEIPT_POOLS_DOSSIER_STATE.md:127`) |
| `{institution}` | proper | `activeChains[].processingInstitutions[]` first `proper`-conforming SINGULAR row (`generalStateProse.js:1259-1268`) | that the chain row names a processing house | **not "a named building on the roster"** — the values are CATEGORY labels (`Merchant guilds`, `Glassmakers`, `City walls and gates`); see ALIAS TRAP A-11 |
| `{resource}` | bare-common | an exploitation row's `rawResource` / a chain row's `resource` (`generalStateProse.js:1348-1354`) | that a raw input is named on the record | that it is worked, plentiful, or local |
| `{good}` | bare-common | `primaryImports[]` first conforming row (`generalStateProse.js:1372-1379`); DS-GEN-13's ENTREPOT variant names it and it is **deliberately unfilled** (`:141-148`) | that a trade good is named | its price, its volume |
| `{season}` | bare-common | the stockpile record's own season word (`RECEIPT_POOLS_DOSSIER_STATE.md:180`); vocabulary `spring · summer · autumn · winter` (`src/domain/autonomy/signalRegistry.js:82`) | which quarter of the year the record is stamped in | weather, harvest state |
| `{band}` | **RESERVED** | NOTHING. `fillShapeViolation` refuses a fill outright (`RESERVED-SLOT-HAS-NO-DECLARABLE-FILL`) — `generalStateProse.js:125-131` | — | four DS-GEN-8 variants name it and are DROPPED by anchored liveness; the steading head count therefore never reaches a reader through this desk |
| `{access}` | bare-common | **not used by this desk's leaf** (economy's); declared `road · river · port · crossroads · pass`, `isolated` has NO fill (`RECEIPT_POOLS_DOSSIER_STATE.md:178`) | — | — |

---

## 2. RECORDED NAME CLASSES A FACE OF THIS DESK CAN RENDER

Every closed vocabulary reachable from a general-desk pool, with its members and the engine file that defines it.

### 2.1 Configuration enums

| class | members | file:line |
|---|---|---|
| `config.terrainType` (`TERRAIN_OPTIONS`) | `plains` · `hills` · `forest` · `riverside` · `coastal` · `mountain` · `desert` (7) | `src/components/gallery/galleryUtils.js:8` |
| terrain FAMILY (DS-GEN-12) | `WATER-EDGE` {coastal, riverside} · `HIGH-GROUND` {mountain, hills} · `WOODLAND` {forest} · `OPEN-GROUND` {plains} · `DRY-GROUND` {desert} — total over the seven | `src/domain/display/stateProse/generalStateProse.js:1073-1081` |
| water-bearing pair (engine's own) | `coastal` · `riverside` | `src/domain/resourceTerrainCompatibility.js:36` |
| `config.tradeRouteAccess` | `port` · `river` · `crossroads` · `road` · `isolated` · `mountain_pass` · `mountain_road` · `desert_road` (8) | `src/generators/terrainHelpers.js:23-33` |
| route → terrain default | port→coastal · river→riverside · crossroads→plains · **road→plains** · **isolated→forest** · mountain_pass/mountain_road→mountain · desert_road→desert | `src/generators/terrainHelpers.js:24-32` |
| `config.monsterThreat` | `heartland` · `frontier` (default) · `plagued` (3) | `src/generators/priorityHelpers.js:282`; `src/generators/defenseGenerator.js:197-199` |
| tier | `thorp` · `hamlet` · `village` · `town` · `city` · `metropolis` (6) | `src/data/historyData.js:1111-1118`; PDF labels `src/pdf/lib/viewModel.js:53-56` |
| NARROW approach (DS-GEN-13, DS-POP-3) | `isolated` · `mountain_pass` · `mountain_road`; every other value OPEN | `src/domain/display/stateProse/generalStateProse.js:1102` |
| season | `spring` · `summer` · `autumn` · `winter` | `src/domain/autonomy/signalRegistry.js:82`; `src/domain/townMap/mapEdits.js:53` |

### 2.2 Ladders and band words

| class | members | file:line |
|---|---|---|
| defence score band | `STRONG` ≥65 · `ADEQUATE` ≥40 · `WEAK` ≥20 · `CRITICAL` | `src/domain/display/defenseScoreBands.js:37-38` |
| the five score axes, as the page labels them | Military Might · **Monster Defense** · Internal Security · **Economic Resilience** · Magical Capability | `src/components/new/tabs/OverviewTab.jsx:372-376`; roster `generalStateProse.js:178` |
| readiness label | `Fortress` ≥76 · `Well-Defended` ≥55 · `Defensible` ≥38 · `Lightly Defended` ≥24 · `Vulnerable` ≥12 · `Undefended` | `src/generators/defenseGenerator.js:515-521` |
| prosperity — **emitted six** | `Struggling` · `Poor` · `Moderate` · `Comfortable` · `Prosperous` · `Wealthy` | `src/domain/prosperityRank.js:62-64` |
| prosperity — aliases (never emitted; reachable from stored records) | `Subsistence` · `Impoverished` · `Destitute` · `Meager` · `Modest` · `Stable` · `Thriving` · `Affluent` · `Opulent` | `src/domain/prosperityRank.js:70-92` |
| prosperity POOL fold (5 pools over 15 spellings) | Poverty/Impoverished · Struggling/Poor · Moderate/Modest · Comfortable/Prosperous · Wealthy/Thriving | `generalStateProse.js:199-217` |
| food-security label (6) | `Secure` · `Surplus` · `Pressured` · `Import-Dependent` · `Deficit` · `Deficit — Active Famine` | `src/generators/foodGenerator.js:340-358`; pool map `generalStateProse.js:260-267` |
| safety head words the corpus routes (9) | Secure · Controlled · Quarantined ‖ Tense · Strained · Restricted · Unsafe ‖ Dangerous · Desperate | `generalStateProse.js:240-249` |
| safety head words the producer can emit (15) | Controlled · Tense · Strained · Desperate · Unsafe · Dangerous · Quarantined · Restricted · Critical · Volatile · Suspicious ‖ base: Very Safe · Safe · Moderate | `src/generators/safetyProfile.js:103,112,122,133-134,147,158,168,176,185,193,201,208,217,226,240,247,262,280,287,294,304` |
| `QUANTITY_BANDS` (7 rungs + the zero word) | `nobody` ‖ a few souls ≤3 · a dozen or so ≤12 · dozens ≤40 · a hundred or so ≤120 · several hundred ≤400 · many hundreds ≤1200 · thousands | `src/domain/worldPulse/demographicsHerald.js:72-80`; zero word `:124-134` |
| `POP_READING` verbs (5) | −2 has been emptying · −1 has been thinning · 0 has held level · +1 has been growing · +2 has been swelling | `src/domain/display/trendLens.js:24-30` |
| recency ladder (5) | `Recent` ≤10 · `Living memory` ≤30 · `Last century` ≤80 · `Ancient` ≤200 · `Deep history` | `generalStateProse.js:599-610` (mirror of `HistoryTab.jsx:59-60`) |
| `TIME_BANDS` (§0d, 6) | this_season ≤13w · within_the_year ≤52w · years_on ≤10y · a_decade ≤25y · a_generation ≤60y · **older_than_bearers (PREDICATE-ONLY: attributive/span/since all null)** | `src/domain/display/heraldCausalGrammar.js:333-340` |
| PDF tier labels | Thorp · Hamlet · Village · Town · City · Metropolis | `src/pdf/lib/viewModel.js:53-56` |
| PDF tone vocabularies | `PROSPERITY_TONE` / `SAFETY_TONE` / `VIABILITY_TONE` → good · gold · muted · warn · bad | `src/pdf/lib/viewModel.js:85-101` |
| PDF hook priority band | `high` ≥8 · `medium` ≥6 · `low` | `src/pdf/lib/viewModel.js:757-761` |
| PDF legitimacy factor labels | Prosperity · Safety · Defense · Food security | `src/pdf/lib/viewModel.js:46-51` |

### 2.3 Typed record vocabularies

| class | members | file:line |
|---|---|---|
| tension `type` (10, closed) | crime_wave · economic_disparity · guild_conflict · infiltration_fear · leadership_vacuum · magical_controversy · occupation_legacy · outside_debt · resource_scarcity · succession_crisis | `src/domain/dossier/plotHooks.js:7-18` (`TENSION_LABELS`) |
| tension / event `severity` | `minor` · `major` · `catastrophic` | `src/components/new/tabConstants.js:20` (`SEV_COLORS`) |
| conflict `intensity` | `low` · `moderate` · `high` | `generalStateProse.js:804-816` |
| historicalEvents COARSE `type` (the timeline CATEGORY, 8) | disaster · political · economic · religious · magical · demographic · exile_return · occupation_infiltration | `src/generators/history/historyPolicyData.js:27-65`; stamped `src/generators/historyGenerator.js:588` |
| historicalEvents FINE template types → names (30) | see `EVENT_TYPE_NAMES` | `src/data/historyData.js:1547-1582` |
| `historicalCharacter` (6, closed) | newly founded and still becoming itself · **stable and prosperous (the ELSE-ARM)** · marked by repeated calamities · politically turbulent · economically dynamic · defined by a single great catastrophe | `src/generators/historyGenerator.js:848-853` |
| `lifecycleStatus` | `relic_ruin` · `abandoned_site` (else absent) | `src/components/new/tabs/SteadingsSection.jsx:18-21` (`GRADE_LABEL`) |
| steading `provenance` (closed 4) | `growth` · `resource_strike` · `resettlement` · `forced` — the corpus writes a pool for ONE | `generalStateProse.js:1436-1440` |
| `relationshipType` (DS-REL-1's 8) | trade_partner · allied · patron · client · rival · cold_war · hostile · neutral | `src/generators/neighbourGenerator.js:48-95` (`REL_DYNAMICS`) |
| `localRelationshipRole` residue | `overlord` · `vassal` — real values, **no corpus pool**, render nothing | `generalStateProse.js:1477-1481`; `src/domain/relationships/canonicalRelationship.js:309-313` |
| relationship label aliases | ally/alliance/allies→allied · overlord/suzerain/liege→vassal · trade/trade_partners→trade_partner · coldwar/cold-war→cold_war · smuggling→smuggling_partner | `src/domain/relationships/canonicalRelationship.js:46-63` |
| hook `category` (7, closed) | npc · faction · tension · economics · safety · history · relationship | `src/domain/dossier/plotHooks.js:31-39` (`PLOT_HOOK_CATEGORIES`) |
| escalation clock id (4, closed) | `bread_riot` · `smuggling_rise` · `legitimacy_crisis` · `faction_split`, each with a **triggerDescription** that is the entailment source | `src/domain/hookEscalation.js:387-436` |
| coherence note `type`\|`tab` (6 pools) | power_economic\|economics · power_economic\|power · power_economic\|overview · stress_economic\|economics · power_stress\|power · historical_economic\|history | `generalStateProse.js:991-998` |
| coherence note `severity` | `notable` · `contradiction` · `context` | `src/generators/narrativeGenerator.js:586,599,614,631,645,663` |
| structuralViolations `severity` | `error` · `warning` · `by_design` | `src/generators/structuralValidator.js:421,435-440,516,535,559` |
| institution-composition booleans | hasMilitaryInst · hasGarrison · hasMilitia · hasWatch · hasMercenary · hasFreeCompany · hasCharterHall · hasWalls · hasGates · hasPrison · hasCourtSystem · hasMarket · hasGuild · hasMerchantGuild · hasBank · hasWarehouse · hasPort · hasNavy · hasGranary · hasHospital · hasChurch · hasCathedral · hasMonastery · hasMagicInst · hasMagesGuild · hasWizardTower · hasAlchemist · hasCriminalInst · hasThievesGuild · hasBlackMarket · hasSmuggling · hasGangInfra | `src/generators/priorityHelpers.js:45-79` |
| market NAME class (DS-GEN-13) | `/\b(market\|bazaar\|exchange\|shambles\|stalls)\b/i` | `generalStateProse.js:1109`; source `src/domain/townMap/glyphAssign.js:100` |
| glyph name classes (the engine's own building name families) | spire · small-spire · wheelhouse · kiln-yard · forge · signpost-house · towered-keep · barracks · watchtower · stall-rows · gambrel-store · quay-shed · guildhall · archive-hall · farmstead · graveyard-chapel · encampment · ruin-shell | `src/domain/townMap/glyphAssign.js:91-108` |
| fabric scar `kind` (8, DS-GEN-15) | burn_lots · plague_quarter · flood_line · rubble_field · calamity_scar · siege_repairs · occupation_marks · lean_years | `src/domain/worldPulse/urbanFabricKernel.js:305-314`; minting `:318-323`, `:665-676` |
| holder KINDS (the record-holder table) | treasury · muster · census · parish · toll-bar · market · watch · court · elders · tradition · road · office (12) | `src/domain/prose/holderTable.js:271-364` |
| CIVIC_OBJECT_CLASSES (the census's own refusal list) | wall · force · store · market · law · temple · road · hall · care · craft · storehouse (11) | `src/domain/prose/wiringCensus.js:1301-1324` |
| institution liveness statuses (the ruin filter) | inactive: `ruined` · `removed` · `destroyed` · `remnant`; **`impaired` stays LIVE** | `src/domain/institutions/institutionRoster.js:29-41` |

---

## 3. ENTAILMENT CANDIDATES — the desk's rows

Format: **noun** → its name class and members (file:line) → ENTAILS (definitional; rides with the word) → NOT ENTAILED (typical association the word does not carry) → ENGINE CONTRADICTS (a real-world entailment this engine's own rules deny).

### 3.1 The ground and the approach

**terrain family word** — `WATER-EDGE` {coastal, riverside} · `HIGH-GROUND` {mountain, hills} · `WOODLAND` {forest} · `OPEN-GROUND` {plains} · `DRY-GROUND` {desert} (`generalStateProse.js:1073-1081`).
- ENTAILS: `coastal`/`riverside` → **standing water at the edge of the site** (the engine's own `WATER_TERRAIN` pair, `src/domain/resourceTerrainCompatibility.js:36`, which gates fishing_grounds / deep_harbour / river_mills / fertile_floodplain at `:32-35,72`). `mountain`/`hills` → **relief; an approach that climbs**. `forest` → **standing timber**. `plains` → **open ground, no natural chokepoint**. `desert` → **aridity**.
- NOT ENTAILED: a compass direction, a named river, a distance, a harbour (a `coastal` town need not have port infrastructure — `hasPort` is a separate roster read at `priorityHelpers.js:61`), a defensible height (`mountain` gives no walls), soil quality, climate, a season.
- ENGINE CONTRADICTS: **terrain is not independent of route.** `getTerrainType` DERIVES terrain from `tradeRouteAccess` whenever no override is set (`src/generators/terrainHelpers.js:23-33`), so `WOODLAND` on most towns is the DEFAULT for the `isolated` route, not an observed forest, and `OPEN-GROUND` is the default for `road` and `crossroads`. A face that treats the family as an independent observation about the land is more knowledgeable than the simulation. The annex already forbids compass words and named geography ("the map engine owns geometry and the dossier owns disposition", `RECEIPT_POOLS_DOSSIER_STATE.md:113`).

**approach word (`tradeRouteAccess`)** — 8 members (`terrainHelpers.js:23-33`).
- ENTAILS: `port` → **a water approach that carries cargo**; `river` → **a river**; `crossroads` → **more than one road meeting**; `road` → **a road**; `isolated` → **no maintained through-route**; `mountain_pass` / `mountain_road` → **a route over relief**; `desert_road` → **a route across dry ground**.
- NOT ENTAILED: traffic volume, toll income, road condition, a named road, how old the route is, who maintains it.
- ENGINE CONTRADICTS: **`road` is the ELSE-ARM in three of this desk's blocks and a NAMED value in the fourth.** DS-GEN-6's `ORIGIN_POOL_OF_ROUTE` folds `road`, `mountain_pass`, `mountain_road`, `desert_road` and any absent value onto the `road` pool (`generalStateProse.js:887-892` + `:964-967` trailing `|| 'road'`); DS-GEN-5's `SITUATION_POOL_OF_SCENE` folds `mountain_pass` onto `smoke` (the ISOLATED scene) but `mountain_road`/`desert_road` onto `ordinary` (`:820-842`); DS-GEN-13 and DS-POP-3 call `mountain_road` NARROW (`:1102`). So a DS-GEN-6 `road` face that says "a road" is speaking over desert roads and mountain passes, and the same town is simultaneously "ordinary" on DS-GEN-5 and "narrow" on DS-GEN-13. See ALIAS TRAP A-2.
- ENGINE CONTRADICTS (second): `port` + `terrainType === 'riverside'` resolves to the **river** scene, not the port one (`generalStateProse.js:864-866`, mirroring `generateArrivalScene`'s `riverPort` branch at `narrativeGenerator.js:912`) — an inland river port is not a seaport.

### 3.2 The market

**market-class work** — the engine's own NAME class `market · bazaar · exchange · shambles · stalls` (`generalStateProse.js:1109`; `glyphAssign.js:100`).
- ENTAILS: **a place where goods are bought and sold**, and (per the class) that the row is one of those five spellings. `shambles` additionally is a **meat market** in the class's own English. `entrepôt` (`isEntrepot`) entails **goods that pass through rather than originate here**.
- NOT ENTAILED: a market DAY, a charter, a square, a frontage, a gate, prices, volume, prosperity, how many stalls. The annex is explicit: "which gate, which square and which frontage are the map engine's facts, not the dossier's, and none of them exists here" (`RECEIPT_POOLS_DOSSIER_STATE.md:120`).
- ENGINE CONTRADICTS: nothing found. **This is the desk's one block that applies the ruin filter**: `marketPoolKey` runs `liveInstitutions(state)` before the name test (`generalStateProse.js:1139-1141`), so a calamity-flattened bazaar does NOT credit a market — the leaf's own comment names that as the difference "this whole desk exists to hold" (`:1130-1136`). Compare DS-GEN-17, which does not (§3.6).

### 3.3 The company the town keeps (institution composition)

**the four roster words of DS-GEN-17** — `ADMINISTERED` · `GARRISONED` · `LETTERED` · `PROVISIONED` · `BARE`, resolved in written order, first antecedent wins (`generalStateProse.js:1178-1187`).

| key | antecedent (code) | ENTAILS | NOT ENTAILED | ENGINE CONTRADICTS |
|---|---|---|---|---|
| `ADMINISTERED` | `hasCourtSystem && hasPrison` | that the roster carries **a civic seat AND a place of confinement** | that justice is done; that either is staffed, honest, or busy; a count | `hasCourtSystem` matches `city hall` and `town hall` and `democratic assembly` as well as `courthouse` (`priorityHelpers.js:55`) — a town HALL is not a court. `hasPrison` matches **`stocks`** (`:54`) — a set of stocks is not a prison. |
| `GARRISONED` | `hasMilitaryInst \|\| hasNavy \|\| hasWatch` | that the roster carries **a military-class row** | — | **The annex's own gloss is contradicted by the code.** `RECEIPT_POOLS_DOSSIER_STATE.md:152` says GARRISONED means "a standing paid force: … a force the town PAYS for rather than merely a wall it built". But `hasMilitaryInst` matches the name list `['garrison','barracks','guard','watch','citadel','walls','militia','mercenary','navy','charter hall']` (`priorityHelpers.js:45`) — **`walls` and `citadel` are in it**. A town whose only military-class row is its walls resolves GARRISONED. A face that says "the town keeps men under arms" or "the town pays for its defence" is more knowledgeable than the simulation. See LABEL TRAP L-1. |
| `LETTERED` | `hasMagicInst` | that the roster carries **a practitioner-class row** | a school, an academy, a library, a licence, a tier | matches `hedge wizard`, `scroll scribe`, `alchemist` as well as `academy of magic` (`priorityHelpers.js:68`) — one hedge wizard makes a town LETTERED. |
| `PROVISIONED` | `hasGranary \|\| hasHospital` | that the roster carries **a store of grain OR a house of care** | that either is full, staffed, or open; which of the two it is (the key cannot tell) | `hasGranary` is the substring `'granar'` (`:63`). `hasHospital` matches `monastery`, `healer`, `friary` (`:64`) — a monastery is not a hospital, and it ALSO sets `hasChurch` (`:65`). |
| `BARE` | the pure else-arm | that **none of the four antecedents holds** | low tier — the leaf records the correction explicitly: a tier-gated else-arm is not total (`generalStateProse.js:1168-1172`) | — |

**ENGINE CONTRADICTS, whole-block:** the booleans DS-GEN-17 reads are `economicState.compound.inst`, minted at generation by `getInstFlags(config, institutions)` over the **RAW roster** (`src/generators/economy/economicState.js:51,872` → `src/generators/priorityHelpers.js:277-279` → `:41-79`). The ruin filter is never applied on that path (`src/domain/institutions/institutionRoster.js:29-53`, whose own header names this the "ruin-filter defect class"). So DS-GEN-17's readings are **frozen at generation and blind to a later calamity, abandonment or economic close**, while its sibling DS-GEN-13 filters. A face on GARRISONED / PROVISIONED that says a house "still stands" is unsupported after a played calamity.

**`hasAny` is a SUBSTRING test, not a word test** (`priorityHelpers.js:24-25`: `keywords.some(k => nameList.some(n => n.includes(k)))`). The one word-bounded exception is `PORT_INFRA_RE` (`:32`), added precisely because `Teleportation circle` read as a harbour — the comment records it.

### 3.4 The record (history)

**`{calamity}` / the event word** — 30 fine names (`src/data/historyData.js:1547-1582`), lowercased by `calamityFill` (`generalStateProse.js:509-517`), which refuses any name that is not `The` + Title Case (so "The Fall of <Ruin>" yields `undefined`).
- ENTAILS: that a **typed blow of that name is on the record**. `the great fire` → fire. `the flood` → water. `the plague years` → disease. `the siege` → a besieging force. `the crash` / `the trade collapse` → a market failure. `the occupation` → an occupier who came and went.
- NOT ENTAILED: how many died, who did it, which quarter, whether it is still felt (that is `anchored`, and see L-4), a year, a season, a count.
- ENGINE CONTRADICTS / LABEL TRAP: three names do not mean their English — `The Purge` is `infiltration_fear`, a paranoia and denunciation arc, NOT an execution ( `historyData.js:1554-1558` carries the engine's own comment); `The Migration` is `population_friction`, friction between populations, not a movement of people (`:1561`); `The Mandate` is `legitimacy_crisis` (`:1580`). See LABEL TRAP L-6.

**event COARSE `type`** — the 8 timeline categories (`historyPolicyData.js:27-65`), stamped at `historyGenerator.js:588`.
- ENTAILS: that the record classified the event into that category.
- NOT ENTAILED: the fine event; the coarse word is one-to-many and in three cases one-to-ONE with a differently-named fine event.
- ENGINE CONTRADICTS: `exile_return` contains ONLY `occupation_legacy` (`historyPolicyData.js:63`), so `event type: exile_return` fires on an event NAMED "The Occupation"; `occupation_infiltration` contains ONLY `infiltration_fear` (`:62`) → "The Purge"; `demographic` contains ONLY `population_friction` (`:64`) → "The Migration"; `disaster` includes `external_threat` (`:49`) → "The Siege", which is not a natural disaster. See LABEL TRAP L-7.

**`anchored`** — strictly boolean, absent ≠ false (`generalStateProse.js:572-579`).
- ENTAILS (per DS-GEN-9's ruling, `RECEIPT_POOLS_DOSSIER_STATE.md:85`, `:148`): that the event **still bears on the present** and is therefore the licence for an "and it still" clause.
- ENGINE CONTRADICTS: the flag's engine meaning is narrower. `anchored = true` is set ONLY where the anchor pass **replaced** the event with a settlement-appropriate template on a 0.6 coin (`historyGenerator.js:600-604` "Anchor events to settlement-appropriate narratives"; `:608-616` `ANCHOR_TYPE_MAP`; `:630-640` `replacement.anchored = true`). It is a NARRATIVE-FIT stamp, not a still-bears-on-the-present stamp. Resource events set `anchored: false` explicitly (`:672,691,710,741`); other rows carry the field absent. **Raised for the chair**: DS-GEN-16 keys its whole block on `anchored` AND on `lastingEffects[].length > 0` (`generalStateProse.js:642-656`), and it is the `lastingEffects` half — not the flag — that carries the "what remains" claim.

**recency label** — Recent ≤10 · Living memory ≤30 · Last century ≤80 · Ancient ≤200 · Deep history (`generalStateProse.js:599-610`).
- ENTAILS: an elapsed span in years, banded.
- NOT ENTAILED: a date, a generation count (that is `TIME_BANDS`, a DIFFERENT ladder with DIFFERENT cuts — `heraldCausalGrammar.js:333-340`), whether anyone alive remembers it (`Living memory` is a label, not a demographic reading).
- ENGINE CONTRADICTS: nothing; but note the two ladders coexist on one desk and `older_than_bearers` (>60y) starts where `Last century` (≤80y) has not yet ended. A face may not pair a word from one ladder with a cut from the other.

**`historicalCharacter`** — 6 values (`historyGenerator.js:848-853`).
- ENTAILS: for the five branch values, a COUNT over the timeline: ≥2 disasters → "marked by repeated calamities"; ≥2 political → "politically turbulent"; ≥2 economic → "economically dynamic"; any catastrophic → "defined by a single great catastrophe"; age ≤0 → "newly founded".
- NOT ENTAILED: **`stable and prosperous` is the ELSE-ARM** (`:848`). It fires on any town whose timeline has fewer than two of each category and no catastrophic event, **regardless of its actual prosperity label**. See LABEL TRAP L-5.

**founding record** — `founding{reason, foundedBy, initialChallenge, overcoming, stressNote}` + `history.age` (`RECEIPT_POOLS_DOSSIER_STATE.md:123`).
- ENTAILS: that a founding row is on the record, and (via `age`) an elapsed span as a band.
- NOT ENTAILED: **a construction date.** The annex states it outright: "It names no year and no date, because the engine holds a founding REASON and an AGE and no construction date of any kind" (`:127`). Also not entailed: a founder's NAME — `foundedBy` is a lowercase descriptive phrase in 26 of 26 producer values (`:236-241`).
- ENGINE CONTRADICTS: `FOUNDED-YOUNG` is reachable but effectively unreached — "the youngest town measured was 81 years old" (`generalStateProse.js:620-621`); `GROWN-UNRECORDED` needs a record with no `founding` and the generator wrote one 48 of 48 (`:617-620`). `age` itself is drawn from `AGE_BY_TIER` (`historyData.js:1111-1118`), so a thorp may be 300 years old and a hamlet capped at 120 — age does not track tier upward.

**ancient ruin** — `history.ancientRuin{name, yearsAgo}` (`generalStateProse.js:1417-1423`).
- ENTAILS: that a **named fallen settlement** stands near this town, and a duration.
- NOT ENTAILED: what fell it, who lived there, its size, a treasure.
- ENGINE CONTRADICTS: strictly opt-in — written only under `config.ancientRuinsEnabled`, measured 2 of 48 with the flag on, 0 of 48 without (`generalStateProse.js:1414-1416`). A face may not read absence as "no ruin in this region"; absence is "the flag is off". The shipped surface prints a raw numeral (`SteadingsSection.jsx:73-76`), which the prose must not echo (§0d).

**fabric scar kind (DS-GEN-15, WIRING-UNRESOLVED)** — 8 kinds (`urbanFabricKernel.js:305-314`).
- ENTAILS: `burn_lots` → fire; `plague_quarter` → disease; `flood_line` → water; `rubble_field` → collapse; `siege_repairs` → a siege that was lifted (`:673`); `occupation_marks` → an occupation that was lifted (`:674`); `lean_years` → famine (`:676`); `calamity_scar` → an unclassified calamity (`:325-328`). Every scar carries its own `week`, so **how long ago is read off the record** (`fabricRead.js:80-98`).
- NOT ENTAILED: where the scar sits, what shape it took, a district, a direction — the annex draws that line explicitly (`RECEIPT_POOLS_DOSSIER_STATE.md:141`).
- **ENGINE PERMITS what the defence desk's walls do not**: scars DECAY, on a kind-specific half-life (104w burn, 156w plague, 208w rubble, 260w siege, 208w occupation, 78w famine — `urbanFabricKernel.js:305-314`; decay applied at `:644-647`). So `SCARRED-FADING` is licensed by a REAL clock. The asymmetry is worth stating beside the chair's walls-never-decay finding: this engine has exactly one decay clock over built fabric, and it is the fabric mirror's, not the roster's.
- ENGINE CONTRADICTS: `hasFabric` is false for every aspatial world and every untouched settlement, and each reader returns empty or null (`RECEIPT_POOLS_DOSSIER_STATE.md:141`) — **absent mirror ⇒ no sentence**, never a fallback.

### 3.5 Population

**`QUANTITY_BANDS` word** — 7 rungs + `nobody` (`demographicsHerald.js:72-80`).
- ENTAILS: a head count inside the rung's ceiling, spoken as a word. `nobody` entails a NONPOSITIVE count and is total by construction (`:124-134`: "a caller can never produce '0 souls left'").
- NOT ENTAILED: a digit, a ratio, a percentage (§0d); who they were; where they went; why. The annex: "the demographic receipt and the migration ledger ARE provenance and license a cause clause; **the head count alone is not**" (`RECEIPT_POOLS_DOSSIER_STATE.md` DS-POP-1 ENTAILMENT).
- ENGINE CONTRADICTS: the bands are OWNER-RETUNABLE prose (`demographicsHerald.js:70-72`), so no face may treat a rung boundary as a fact about the world.

**`POP_READING` verb** — 5 (`trendLens.js:24-30`).
- ENTAILS: a RETROSPECTIVE reading of the ring over the window.
- NOT ENTAILED: a forecast, a projection, "expected", "on track" — the annex's E-2 is hard, "TREND, NEVER PROPHECY". Also not entailed: a CAUSE — "the band … carries no provenance … a variant explaining *why* the town is thinning would be inventing history" (DS-POP-2 ENTAILMENT).
- ENGINE CONTRADICTS: `populationTrendBand` returns `{band: 0, net: 0, window: pops.length}` for a ring with fewer than two readings (`trendLens.js:47-49`) — **band 0 is also the NO-DATA answer.** DS-POP-3 gates on `window < 2 ⇒ null` (`generalStateProse.js:1578-1586`) precisely for this, and its docblock records that without the gate `LEVEL` would fire on every town in every world (`:1547-1554`). A face reading `LEVEL` as "the town held level" is only true because of the window gate; it is not entailed by the band.
- ENGINE CONTRADICTS (second): the believed `populationTrendBand` on a belief record is a DIFFERENT thing sharing the name and is never engine truth (`generalStateProse.js:1568-1570`; `RECEIPT_POOLS_DOSSIER_STATE.md:130`).

### 3.6 Standing, verdicts and scores

**the five score axes** — `scoreBand` 4 words (`defenseScoreBands.js:37-38`), axes `generalStateProse.js:178`, page labels `OverviewTab.jsx:372-376`.
- ENTAILS: that the axis's 0-100 number falls in that band. Nothing more; a score is "a *judgment*, not an event: there is no thing that happened to point at" (`RECEIPT_POOLS_DOSSIER_STATE.md:34`).
- NOT ENTAILED: a cause, a history, a count of men, a count of walls, a trajectory, a comparison to another town.
- ENGINE CONTRADICTS: **`scores.monster` is Monster DEFENCE, not monster pressure.** A `plagued` region SUBTRACTS 15 from the axis (`defenseGenerator.js:227`), so a monster-ridden frontier scores LOWER, not higher. **`scores.economic` is Economic RESILIENCE, driven primarily by FOOD STORAGE MONTHS** (`defenseGenerator.js:257-290`) — it is not prosperity and moves independently of `economicState.prosperity`. **`scores.magical` is 0 in a world where magic is off, and 0 at thorp/hamlet/village with no magic row** (`defenseGenerator.js:304-307`), so `scores.magical: CRITICAL` fires on every town in a no-magic world. See LABEL TRAP L-2.
- ENGINE CONTRADICTS (second): an ABSENT score is not a zero — the pool refuses a non-numeric score rather than banding 0 (`generalStateProse.js:291-296`).

**readiness label** — 6 (`defenseGenerator.js:515-521`).
- ENTAILS: that the composite readiness number falls in that band. `Fortress` ≥76; `Undefended` <12.
- NOT ENTAILED: walls (a `Fortress` label does not entail a wall row; `defenseProfileHasWalls` is a separate read), a garrison, a wall material, a count.

**prosperity label** — the emitted six + nine aliases (`prosperityRank.js:62-92`).
- ENTAILS: the town's measured prosperity rung.
- NOT ENTAILED: income sources, a treasury, a trade profile, hunger (food security is a SEPARATE ladder), safety.
- ENGINE CONTRADICTS: `Poverty` is **not a `PROSPERITY_RANK` key at all** and `Impoverished` is never emitted — the pool `prosperity: Poverty / Impoverished` is unreachable from a freshly generated settlement and lights only on a stored or hand-authored record (`generalStateProse.js:187-197`). A face may not treat the five pools as a partition of live towns.

**food-security label** — 6 (`foodGenerator.js:340-358`).
- ENTAILS: `Deficit` → deficitPct > 40; `Import-Dependent` → > 15; `Pressured` → > 5; `Surplus` → surplusPct > 40; `Secure` → the else-arm; `Deficit — Active Famine` → the famine stress is live.
- NOT ENTAILED: what is eaten, a granary, a harvest, a season, a count of mouths.
- Note: DS-GEN-3 declares food security **the one LIVE exception** in an otherwise frozen block and the ONE place a STRUCTURAL cause is licensed — "need against production is in the record" — never a historical one (`RECEIPT_POOLS_DOSSIER_STATE.md:34`). `Secure` here is the ELSE-ARM.

**safety head word** — 9 routed of 15 emitted (`generalStateProse.js:240-249`; producer `safetyProfile.js`).
- ENTAILS: the strain/base rung the label's head word names.
- NOT ENTAILED: a crime rate, a watch, a court, a count.
- ENGINE CONTRADICTS: **the corpus names `Secure`, which no branch of `safetyProfile.js` writes at all**, and six emitted head words are routed nowhere (`Very Safe`, `Safe`, `Moderate`, `Critical`, `Volatile`, `Suspicious`) — "this lens speaks on troubled towns and is silent on calm ones" (`generalStateProse.js:230-238`). And `Controlled` means OCCUPATION CURFEW or AUTHORITARIAN STATE CRIME, not good order — see LABEL TRAP L-3.

**`economicViability.viable`** — boolean (`src/generators/economy/viability.js:557-558,565`).
- ENTAILS: `viable: true` ⇔ **`criticalIssues.length === 0`** — no CRITICAL coherence issue was found at the first survey. The pool key's own gloss, "the arithmetic closes", is the honest reading.
- NOT ENTAILED: economic self-sufficiency, survival, food, prosperity, a future. The page itself says the check is not re-run: "as judged at the first survey; later events and edits do not re-run this check" (`src/components/new/tabs/ViabilityTab.jsx:142-143`).
- ENGINE CONTRADICTS: R-DST-W4-c bans the temporal token list in every DS-GEN-3 and DS-GEN-11 variant — *now, still, since, has become, no longer, any more, these days, lately, increasingly, has begun* (`RECEIPT_POOLS_DOSSIER_STATE.md:34`, `:106`). These are timeless capability sentences "or they are wrong on the first campaign tick".
- The MARGINAL arm fires on an ABSENT verdict, not on a third producer value (`generalStateProse.js:681-687`).

**`criticalIssueCount`** — lives at `economicViability.metrics.criticalIssueCount`, NOT at `economicViability.criticalIssueCount` (`generalStateProse.js:690-698`, which records that believing the abbreviation measured the field 0/24 when it is 48/48).

### 3.7 Ties

**relationship type word** — 8 pools; `patron`/`client` resolved through `localRelationshipRole` (`generalStateProse.js:1483-1495`).
- ENTAILS: `trade_partner` → goods move between the two; `allied` → a standing alliance; `patron` → **THIS town is the senior end**; `client` → **THIS town is the junior end**; `rival` → competition; `cold_war` → hostility short of war; `hostile` → open hostility; `neutral` → a recorded tie with no charge.
- NOT ENTAILED: when the tie began, a treaty, a founding event, a distance, a road between them. The annex: "**STATELESS.** A relationship type carries no origin — no treaty id, no founding event, no since-when. No variant may say a tie *became* anything" (`RECEIPT_POOLS_DOSSIER_STATE.md:71`).
- ENGINE CONTRADICTS: a legacy row carrying only `relationshipType: 'patron'` **does not say which end this town is**, and both asymmetric pools go silent rather than guess (`generalStateProse.js:1471-1476`). And `overlord`/`vassal` are real `localRelationshipRole` values with NO corpus pool — they render nothing rather than folding into patron/client (`:1477-1481`). See ALIAS TRAP A-12.

**`prominentRelationship` / `flagDriven`** (`generalStateProse.js:757-798`).
- ENTAILS: `prominentRelationship present` → the town names one tie first. `flagDriven count > 0` → at least one relationship arises from the settlement's COMPOUND CONDITIONS.
- NOT ENTAILED: an event. "`flagDriven` records *that* a relationship arises from the settlement's compound conditions, not from any event" (`RECEIPT_POOLS_DOSSIER_STATE.md:78`).
- ENGINE CONTRADICTS: `flagDriven` was `false` on all 48 measured settlements; `count > 0` is reached ONLY in a stressed world (`generalStateProse.js:772-783`). The leaf records the distinction that saved the lens: "a count of zero over a field a producer WRITES is a MEASUREMENT; a count of zero over a field nothing writes is a DEFAULT WEARING A READING'S CLOTHES" (`:785-787`).

### 3.8 Tensions, conflicts and warnings

**tension type word** — 10 (`plotHooks.js:7-18`).
- ENTAILS: **STATELESS for eight of ten.** Two type WORDS carry their own past and license exactly that much: `occupation_legacy` → an occupation happened and ended; `outside_debt` → an obligation was taken on, outward (`RECEIPT_POOLS_DOSSIER_STATE.md:20`).
- NOT ENTAILED: for the other eight, that anything HAPPENED — the record carries no event id, no `yearsAgo`, no cause field. `[elder]` is available only in those two blocks. For `occupation_legacy`: no occupier is named, no duration asserted, no year given (`:5238`). For `outside_debt`: the creditor is a slot only where the record names one; **the sum is never spoken** (`:5245`).

**conflict `intensity`** — low/moderate/high (`generalStateProse.js:804-816`).
- ENTAILS: how close the two named parties are to violence, as the record grades it.
- NOT ENTAILED: an origin, a start, a prior event. "A conflict record has no origin field" (`RECEIPT_POOLS_DOSSIER_STATE.md:27`). `stakes` is forward-facing and licenses `[unfolding]` without any past claim.

**coherence notes / structural violations** (`generalStateProse.js:991-998, 1051-1063`).
- ENTAILS: a note asserts a STANDING relation between two live fields — structural cause, lawful. `structuralViolations[]` entails that the record disagrees with itself; `structuralSuggestions[]` entails that the record says something is MISSING.
- NOT ENTAILED: history — except `historical_economic`, the one note reading `historicalEvents[]`, and the one place a TIME BAND is owed rather than a year (`RECEIPT_POOLS_DOSSIER_STATE.md:57`).
- ENGINE CONTRADICTS: **five of the six coherence pools are routed and unreached, and the cause is upstream** (`generalStateProse.js:1002-1030`, all figures measured): the two criminal notes need faction `power > 20` / `> 35` and the generator's crime factions took exactly the values 5, 6 and 7 across 291 factions on 48 settlements; the recovery narrative needs an event name containing `Boom` or `Trade Route Opened` and ZERO of 708 generated events carry either; the occupation note never fired on 96 settlements carrying the `occupied` stress. Only `stress_economic` fires in the wild — 79 instances in a 1,440-settlement sweep.

### 3.9 Steadings and lifecycle

**steading `provenance` / `charterPending`** (`generalStateProse.js:1442-1450`).
- ENTAILS: `forced` → **a decree happened** (real provenance, `RECEIPT_POOLS_DOSSIER_STATE.md:64`); `charterPending` → the charter has not yet been granted; the organic arm → a place close enough to be counted and far enough to be its own.
- NOT ENTAILED: a head count (`{band}` is RESERVED and refused), a distance, a road, a name for the decree.
- Ruling recorded in code: `forced` outranks `charterPending` because a permanent fact outranks a transient one (`generalStateProse.js:1428-1435`).

**`lifecycleStatus`** — `relic_ruin` · `abandoned_site` (`SteadingsSection.jsx:18-21`).
- ENTAILS: the town has DIED. The shipped sentences are the authority and are already Law-One compliant — "The last residents left with the wagons, **their fates unresolved**" (`SteadingsSection.jsx:64-66`), and the annex requires that clause to survive every variant (`RECEIPT_POOLS_DOSSIER_STATE.md:64`).
- NOT ENTAILED: any named person's fate (product scope; printed on every licence card).
- ENGINE CONTRADICTS: `lifecycleStatus` is 0 of 48 on a freshly generated settlement — a LAWFUL DARK MOUNT whose writer runs off the generation path (`generalStateProse.js:1388-1394`).

### 3.10 Hooks

**hook `category` / clock id** (`generalStateProse.js:723-745`).
- ENTAILS: for a clock, **the trigger predicate and only that**: `bread_riot` → "Food supply chain is strained or worse"; `smuggling_rise` → "Trade chain is strained or worse"; `legitimacy_crisis` → "Governing faction has Contested or worse public legitimacy"; `faction_split` → "Two factions with overlapping power and conflicting wants" (`src/domain/hookEscalation.js:389,401,413,425`). Each is a STANDING condition — structural cause, lawful.
- NOT ENTAILED: that any stage has happened. The stages are a TEMPLATE, not a record (`hookEscalation.js:387-436`), and nothing here licenses a historical clause (`RECEIPT_POOLS_DOSSIER_STATE.md:99`).
- ENGINE CONTRADICTS: the clock's `label` is a display string and the pool joins on the **id segment** — `id: 'clock.bread_riot.<trigger>'` against `label: 'Bread Riot Clock'` — and the leaf names this its "standing label trap" (`generalStateProse.js:729-735`).

---

## 4. LABEL TRAPS — an engine value or label whose English is not its engine meaning

Every row: the label, the field it sits on, the engine meaning quoted from code, and the file:line.

| # | label | field | ENGINE MEANING (quoted) | file:line |
|---|---|---|---|---|
| **L-1** | `GARRISONED` | DS-GEN-17 key over `compound.inst` | NOT "a standing paid force". The antecedent is `hasMilitaryInst \|\| hasNavy \|\| hasWatch`, and `hasMilitaryInst: hasAny(names, ['garrison','barracks','guard','watch','citadel','walls','militia','mercenary','navy','charter hall'])` — **`walls` and `citadel` are members**. A town whose only military-class row is its walls resolves GARRISONED. The annex's gloss ("a force the town PAYS for rather than merely a wall it built") is contradicted by the code it describes. | key `src/domain/display/stateProse/generalStateProse.js:1179-1184`; booleans `src/generators/priorityHelpers.js:45`; annex gloss `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:152` |
| **L-2** | `scores.monster` | DS-GEN-3 axis | The page labels it **"Monster Defense"** — a CAPABILITY score, higher is better. `if (threat === 'plagued') monster = Math.max(0, monster - 15)`: a monster-plagued region ends LOWER on this axis. A face reading a high monster score as "monsters press hard here" inverts the engine. | `src/components/new/tabs/OverviewTab.jsx:373`; `src/generators/defenseGenerator.js:196-227`, penalty at `:227` |
| **L-2b** | `scores.economic` | DS-GEN-3 axis | Labelled **"Economic Resilience"**; primary driver is FOOD STORAGE MONTHS, not wealth: `const storageMonths = foodSec?.storageMonths ?? (inst.hasGranary ? 4 : 1); let economic = storageScore;`. It is gated by `econHealthMult` but is not `economicState.prosperity` and may disagree with it. | `OverviewTab.jsx:375`; `src/generators/defenseGenerator.js:257-290` |
| **L-2c** | `scores.magical` | DS-GEN-3 axis | `if (!magicOn \|\| (_isSmallTier && !_hasMagicInstitution)) { magical = 0; }` — **CRITICAL fires on every town in a world where magic is off**, and on every thorp/hamlet/village with no magic row. Not a statement about this town's practitioners. | `src/generators/defenseGenerator.js:304-307` |
| **L-3** | `Controlled` (safety head word) | `safetyProfile.safetyLabel` | NOT "well-policed". Two writers only: `safetyStrains.push({ strain: 'Controlled', condition: 'Occupation Curfew' })` and `safetyLabel = 'Controlled — Authoritarian'` under `stress.stateCrime` — "Residents face little risk from thieves and considerably more from informers and occupation officials" / "…considerably more from the authorities themselves. Unofficial disappearances are not discussed openly." The corpus pools it with `Secure`. | `src/generators/safetyProfile.js:103-108`, `:240-246`; pool `generalStateProse.js:241-242` |
| **L-3b** | `Quarantined` / `Restricted` (safety head words) | `safetyProfile.safetyLabel` | Both are PLAGUE strains: `const strainLabel = safetyRatio >= 2 ? 'Quarantined' : safetyRatio >= 1 ? 'Restricted' : 'Dangerous — Plague Unrest'` under `hasStress('plague_onset')`. `Quarantined` is pooled with `Secure` and `Controlled`; `Restricted` with `Tense`/`Strained`/`Unsafe`. Neither means orderliness. | `src/generators/safetyProfile.js:133-142`; pools `generalStateProse.js:243,246` |
| **L-3c** | `Secure` (safety head word) | `safetyProfile.safetyLabel` | **No branch of `safetyProfile.js` writes it.** "the corpus names `Secure`, which no branch of `safetyProfile.js` writes at all." A face on that pool speaks only over `Controlled` and `Quarantined` towns in practice. | `generalStateProse.js:230-238` |
| **L-4** | `anchored: true` | `historicalEvents[]` | NOT "still bears on the present" as a measured fact. It is stamped only where the anchor pass REPLACED the event with a settlement-appropriate template on a `_rng() < 0.6` coin: `// Anchor events to settlement-appropriate narratives.` … `replacement.anchored = true`. An absent flag is neither true nor false and the desk reads it strictly. | `src/generators/historyGenerator.js:600-604`, `:621-640`; strict read `generalStateProse.js:572-579`, `:646-656`; the ruling it is read under `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:148` |
| **L-5** | `stable and prosperous` | `history.historicalCharacter` | The ELSE-ARM of a timeline COUNT, not a prosperity reading: `let historicalCharacter = age <= 0 ? 'newly founded…' : 'stable and prosperous';` then four `if`s over disaster/political/economic counts and a catastrophic check. A `Struggling` town with a quiet timeline reads "stable and prosperous". | `src/generators/historyGenerator.js:848-853` |
| **L-6** | `The Purge` / `The Migration` / `The Mandate` (the `{calamity}` word) | `EVENT_TYPE_NAMES[type]` → `calamityFill` | `infiltration_fear: 'The Purge'` carries the engine's own comment: *"a paranoia/denunciation arc (enemy agents, suspicion, denunciations) — NOT an occupation"*. `population_friction: 'The Migration'` is friction, not a movement. `legitimacy_crisis: 'The Mandate'` is a crisis, not a grant. | `src/data/historyData.js:1554-1561`, `:1580`; fill `generalStateProse.js:509-517` |
| **L-7** | `event type: exile_return` / `occupation_infiltration` / `demographic` / `disaster` | `historicalEvents[].type` (the COARSE category) | The category is stamped as `event.type = cat`, and three categories are one-to-one with a differently-named fine event: `exile_return: ['occupation_legacy']` ("The Occupation"), `occupation_infiltration: ['infiltration_fear']` ("The Purge"), `demographic: ['population_friction']` ("The Migration"). `disaster` includes `external_threat` ("The Siege"), which is not a natural disaster. | stamp `src/generators/historyGenerator.js:588`; table `src/generators/history/historyPolicyData.js:48-65`; names `src/data/historyData.js:1547-1582` |
| **L-8** | `viable` | `economicViability.viable` | `const isViable = criticalIssues.length === 0;` — "no CRITICAL coherence issue at the first survey". Not self-sufficiency, not survival. The page's own headline word is COHERENT, and the page says the check is not re-run. | `src/generators/economy/viability.js:557-558,565`; caveat `src/components/new/tabs/ViabilityTab.jsx:142-143` |
| **L-9** | `plagued` / "Embattled region" | `config.monsterThreat` | The chair's example, confirmed on this desk's reads. `threatNote = threat === 'plagued' ? ' The surrounding region is plagued by **monster activity**.'`; the structural validator spells the same value "**Embattled** region with no fortification" — a SECOND English word attached to the same non-disease value. The disease facts on this desk are the `plague_onset` stress, the `plague_quarter` scar and the `Quarantined` head word, and `monsterThreat` is none of them. | `src/components/new/SummaryTab.jsx:28,37`; `src/generators/defenseGenerator.js:197-199,227`; `src/generators/structuralValidator.js:551-572` |
| **L-10** | `road` (DS-GEN-6 pool key) | `config.tradeRouteAccess` | The ELSE-ARM: `ORIGIN_POOL_OF_ROUTE[text(tradeRouteAccess)] \|\| 'road'` over a four-key table, so `road`, `mountain_pass`, `mountain_road`, `desert_road` and an absent value all resolve here. `originArmKey`'s comment: *"Every other route (road, mountain_pass, none, unset…) founds on the road arm."* | `generalStateProse.js:887-892`, `:964-967`; `src/generators/narrative/settlementOriginProse.js:160-172` |
| **L-11** | `forest` / `plains` (terrain) | `config.terrainType` | Derived from the route when no override is set: `isolated: "forest"`, `road: "plains"`, `crossroads: "plains"`. WOODLAND and OPEN-GROUND are therefore route DEFAULTS on most towns, not observations. | `src/generators/terrainHelpers.js:23-33` |
| **L-12** | `hasPrison` / `hasCourtSystem` / `hasHospital` / `hasChurch` / `hasNavy` / `hasPort` | `compound.inst` | Substring name matches, not category reads. `hasPrison` includes **`stocks`**; `hasCourtSystem` includes **`city hall`, `town hall`, `democratic assembly`**; `hasHospital` includes **`monastery`, `healer`, `friary`**; `hasChurch` includes **`temple`, `shrine`, `priest`, `abbey`, `monastery`**; `hasNavy` includes **`major port`**; `hasPort` is the word-bounded `/\b(?:port\|docks?\|harbou?r\|shipyard\|navy)\b/`, so a **shipyard** sets it. | `src/generators/priorityHelpers.js:54-65`, regex `:32`, matcher `:24-25` |
| **L-13** | `label` on an escalation clock | `deriveEscalationClocks` output | `id: 'clock.bread_riot.<trigger>'` vs `label: 'Bread Riot Clock'` — "The id carries the producer's token and the label carries a display string, and only one of those is a join key." | `generalStateProse.js:729-745`; `src/domain/hookEscalation.js:388` |
| **L-14** | `LEVEL` (DS-POP-3) | `populationTrendBand().band === 0` | Band 0 is ALSO the no-data answer: `if (pops.length < 2) return { band: 0, net: 0, window: pops.length };`. Only DS-POP-3's `window < 2 ⇒ null` gate makes LEVEL a reading rather than a default; the band word alone does not carry it. | `src/domain/display/trendLens.js:47-49`; gate `generalStateProse.js:1578-1586`, reasoning `:1547-1554` |
| **L-15** | `Secure` (food) vs `Secure` (safety) | `foodSecurity.label` and `safetyProfile.safetyLabel` | Two unrelated ladders share the word. Food `Secure` is the ELSE-ARM of the deficit/surplus cascade (`deficitPct ≤ 5` and `surplusPct ≤ 40`); safety `Secure` is a corpus word the safety producer never writes at all. | `src/generators/foodGenerator.js:355-357`; `generalStateProse.js:230-238,260-267` |
| **L-16** | `severity` | four different records on ONE desk | `currentTensions[].severity` and `historicalEvents[].severity` = `minor\|major\|catastrophic`; `coherenceNotes[].severity` = `notable\|contradiction\|context`; `structuralViolations[].severity` = `error\|warning\|by_design`. The word alone identifies no ladder. | `src/components/new/tabConstants.js:20`; `src/generators/narrativeGenerator.js:586,599,614,631,645,663`; `src/generators/structuralValidator.js:421,435-440,535,559` |
| **L-17** | `PROSPERITY_TONE` / `SAFETY_TONE` keys (DS-GEN-10, PDF) | print-only tone vocabularies | Keyed on words the producers do not emit. `SAFETY_TONE` has `safe, orderly, ordinary, average, tense, uneasy, dangerous, lawless, perilous` — the producer writes `Very Safe`, `Moderate`, `Unsafe`, `Controlled — Authoritarian`, none of which key, so they fall to `'muted'`. `PROSPERITY_TONE` has no row for `Comfortable` or `Prosperous`, two of the emitted six. | `src/pdf/lib/viewModel.js:85-101`, fallbacks `:359-361` |

---

## 5. ALIAS TRAPS — a generic English word naming a class the engine splits into rows

The chair's rule for the defence desk was: *the word the fact is allowed to use must follow the holder-table row this town resolves, and the generic class word is the always-safe spelling.* These are this desk's instances.

| # | word | the rows the engine splits it into (file:line) | the always-safe spelling here |
|---|---|---|---|
| **A-1** | **the watch** | FOUR distinct engine senses reachable from this desk. (1) `inst.hasWatch = hasAny(names, ['town watch','city watch','professional city watch'])` — `priorityHelpers.js:48`. (2) `inst.hasMilitaryInst` also matches the substring `'watch'`, so the watch feeds DS-GEN-17's GARRISONED — `:45`. (3) the HOLDER kind `watch` = Crime reporting / Crime response / Missing persons, roster-backed by `Professional city watch, Town watch` — `src/domain/prose/holderTable.js:318-324`. (4) the display spelling is TIER-SCALED: `tier === 'town' ? 'town watch' : tierAtLeast(tier,'city') ? 'city watch' : 'local watch'` — `src/generators/safetyProfile.js:30-35`. The word also appears in clock stage prose ("The council sends the watch to guard warehouses") which is a TEMPLATE, not a record — `src/domain/hookEscalation.js:396`. | the generic class word — **the guard**, or the muster — unless the town's own roster row is read and its tier-scaled spelling used |
| **A-2** | **the road / the approach** | `tradeRouteAccess` is folded THREE different ways inside this one desk. DS-GEN-6: `road` absorbs `mountain_pass`, `mountain_road`, `desert_road` (`generalStateProse.js:887-892,964-967`). DS-GEN-5: `mountain_pass` → the `smoke` (isolated) scene, `mountain_road`/`desert_road` → `ordinary` (`:820-842`). DS-GEN-13 / DS-POP-3: `isolated`, `mountain_pass`, `mountain_road` are NARROW, everything else OPEN (`:1102`). §0c's `{access}` bare noun list is `road · river · port · crossroads · pass` with **no fill for `isolated`** (`RECEIPT_POOLS_DOSSIER_STATE.md:178`). | **the approach** (the annex's own generic) — never "the road" on a DS-GEN-6 `road` face |
| **A-3** | **the church / the temple** | `hasChurch = hasAny(names, ['church','cathedral','temple','monastery','friary','shrine','priest','abbey'])` — one boolean over eight distinct house kinds; `hasCathedral` and `hasMonastery` are separate, narrower rows (`priorityHelpers.js:65-67`). The glyph class splits again: `spire` {cathedral, minster, temple, church, abbey, priory, basilica} vs `small-spire` {shrine, chapel, reliquary} (`src/domain/townMap/glyphAssign.js:91-92`). | **a house of the faith** / the parish — never "the cathedral" or "the church" from `hasChurch` alone |
| **A-4** | **the hospital / the healer** | `hasHospital = hasAny(names, ['hospital','monastery','healer','friary'])` (`priorityHelpers.js:64`) — a monastery sets BOTH `hasHospital` and `hasChurch`. The civic class `care` = {hospital, infirmary, healer, medical, physician, ward} (`src/domain/prose/wiringCensus.js:1315`). | **a house that takes in the sick** — never "the hospital" from the boolean |
| **A-5** | **the court** | `hasCourtSystem = hasAny(names, ['courthouse','court buildings','democratic assembly','city hall','town hall'])` (`priorityHelpers.js:55`); the HOLDER kind `court` is roster-backed only by `Courthouse, Multiple court buildings` (`holderTable.js:325-331`); the HOLDER kind `office` is backed by `City administration, City hall, Town hall` and carries its own warning that a citation on a fact sourced there "would be citing the speaker" (`:355-364`). The civic class `law` = {court, prison, gaol, law, justice, magistrate, assize} vs `hall` = {hall, council, charter, seat, office, chamber, moot} (`wiringCensus.js:1311,1314`). | **the seat** / the hall — "the court" only where the town's row is a courthouse |
| **A-6** | **the prison** | `hasPrison = hasAny(names, ['prison','stocks','large prison','massive prison'])` (`priorityHelpers.js:54`). **Stocks are not a prison.** | **a place of confinement** |
| **A-7** | **the port / the harbour** | `hasPort` = `/\b(?:port\|docks?\|harbou?r\|shipyard\|navy)\b/` (`priorityHelpers.js:32,61`) — a **shipyard** sets it; `hasNavy = hasAny(names, ['navy','major port'])` (`:62`) — a **major port** sets hasNavy. The comment records the cure that produced the regex: *"'Barge and river transport company' and 'Teleportation circle' never read as harbours, and 'Airship docking' never reads as docks."* The glyph class splits `quay-shed` = {docks, dock, wharf, quay, harbour, harbor, pier} (`glyphAssign.js:102`). The civic class `road` swallows both `port` and `harbour` (`wiringCensus.js:1313`). | **the water approach** — never "the navy" from `hasNavy`, never "the harbour" from `hasPort` |
| **A-8** | **the granary / the stores** | `hasGranary` is the bare substring `'granar'` (`priorityHelpers.js:63`). The census SPLIT the word into two civic classes at REWRITE car 8a-8 because it named two different objects: `store` = {stores, reserve, reserves, stock, larder, harvest} (the STOCK) and `storehouse` = {granary, silo, storehouse, warehouse} (the BUILDING), with a lone storehouse read back as its stock (`wiringCensus.js:1309,1322`, split reasoning `:1304-1308,1317-1321`, read-back `:1372-1378`). Separately `hasWarehouse` is its own boolean (`priorityHelpers.js:60`). | say **the building** or **what is in it**, never both in one word |
| **A-9** | **the market** | THREE rows. (1) DS-GEN-13's name class `/\b(market\|bazaar\|exchange\|shambles\|stalls)\b/i` (`generalStateProse.js:1109`, from `glyphAssign.js:100`). (2) `inst.hasMarket = hasAny(names, ['market','bazaar','fair','trade center','exchange'])` — a different member list, adding `fair` and `trade center` and dropping `shambles`/`stalls` (`priorityHelpers.js:56`). (3) the HOLDER kind `market`, roster-backed by `Market square` alone, services `Weekly market · Public auctions` (`holderTable.js:311-317`) — while `Weekly market` is ALSO a `treasury` row (`:273-279`). | **the exchange** / the stalls — and a source citation must follow the holder row, since one institution (`Weekly market`) sits in two holder kinds |
| **A-10** | **the guild** | `hasGuild` matches the bare substring `'guild'`; `hasMerchantGuild`, `hasMagesGuild`, `hasThievesGuild` and `hasCharterHall` are separate rows and `hasCharterHall` matches `hireling hall` too (`priorityHelpers.js:50,57-58,70,75`). The civic class `craft` = {forge, smith, workshop, **guild**, craft, mill, yard} (`wiringCensus.js:1316`), which is why DS-GEN-1's pool `guild_conflict` is classed `craft` in the census. | **the trade** / the company — never "the guild hall" from `hasGuild` |
| **A-11** | **the institution / the house** | §0c declares `{institution}` "a named building or house on the settlement's roster" (`RECEIPT_POOLS_DOSSIER_STATE.md:172`), but DS-GEN-18 fills it from `activeChains[].processingInstitutions[]`, whose values are CATEGORY labels — the leaf measures `Merchant guilds (3-8)`, `Glassmakers`, `City walls and gates` — and refuses plurals and digits rather than repairing them; over 48 towns, 5 of 25 stalled towns are WITHHELD for that reason (`generalStateProse.js:1223-1268`). | **the workshop** / the craft — never "the house of X" from this fill |
| **A-12** | **patron / client / overlord / vassal / ally** | `patron` and `client` are the two ends of one asymmetric tie and are DIFFERENT SENTENCES; the direction is read from `localRelationshipRole`, and a link with no role is WITHHELD rather than guessed (`generalStateProse.js:1457-1495`). `overlord` and `vassal` are real role values with NO corpus pool and render nothing (`:1477-1481`). Upstream, the label tables fold `overlord/suzerain/liege → vassal` and `ally/alliance/allies → allied` (`src/domain/relationships/canonicalRelationship.js:54-63`), and the two planes deliberately disagree on 17 of a 40-input corpus (`:31-35`). | name the ROLE this town holds, from the role field; where the role is absent, say nothing |
| **A-13** | **patron (the word), read by the instrument as a temple** | `CIVIC_OBJECT_CLASSES.temple = ['temple','shrine','church','parish','clergy','faith','**patron**']` (`wiringCensus.js:1312`), and `objectClassesOf` splits the pool key on non-letters and matches the token set (`:1358-1378`). So DS-REL-1's `patron` pool — about a neighbouring town's seniority — is classed `temple`, and its licence card prints *"may NOT … another civic object of the class `temple`"*. Census confirms: `DS-REL-1 :: patron -> temple`. Same shape: `DS-GEN-5 :: port -> road` (`road` class contains `port`, `:1313`), `DS-GEN-1 :: guild_conflict -> craft`. | raised for the chair — the collision is in the INSTRUMENT's word list, not in a writer's sentence |
| **A-14** | **the militia / the muster** | `hasMilitia = hasAny(names, ['citizen militia','militia'])` (`priorityHelpers.js:47`), and the HOLDER kind `muster` carries the estate's sharpest wiring note: *"ONE institution in the whole shipped roster keeps a muster: the Citizen militia. A town with a Garrison and no militia has men under arms and no roll of them"* (`holderTable.js:280-289`). The civic class `force` = {garrison, militia, muster, watch, guard, soldier, patrol, armed} (`wiringCensus.js:1303`). | **the muster** as the generic; a named militia only where the roster row is the Citizen militia |
| **A-15** | **the elders / the council / the hall** | The HOLDER kind `elders` is roster-backed by `Household elder, Village elder, Village headman, Town council` (`holderTable.js:332-338`) — a **Town council** is an elders row, not a hall row. The HOLDER kind `treasury` is backed by `Village headman, City administration, Weekly market, City-state government, Lord's appointee, Village reeve, Town hall` (`:273-279`) — a **Village headman** is BOTH an elders row and a treasury row. §0c-2's `{seat}` warns that "prose that hard-codes *the council* is wrong on most settlements in the realm" (`RECEIPT_POOLS_DOSSIER_STATE.md:1816`). | **the seat**, filled from `{seat}`'s own generated name; never "the council" as a baked noun |
| **A-16** | **`Record keeping`** | Deliberately in NO holder list, "carried by the Church/Temple, by the Lord's steward and by the Parish churches alike, so it names the parish and the office in one breath; a kind claiming it would claim a holder it cannot tell apart." | no citation is licensed for it |
| **A-17** | **the tradition** | The one holder kind with NO institution anywhere in the shipped roster: "a fact whose only holder would be the tradition is SOURCE-UNRESOLVED in every town the product can generate." | a face sourced there may cite nothing |

---

## 6. ENGINE CONTRADICTS — the desk's collected list

Real-world entailments this engine's own rules deny. (The chair's walls-never-decay case is the defence desk's; these are the general desk's counterparts.)

| # | the real-world entailment | what the engine actually does | file:line |
|---|---|---|---|
| C-1 | *a wooded town stands in woods; an open town stands on plains* | terrain is DERIVED from the route where no override is set — `isolated → forest`, `road → plains`, `crossroads → plains` | `src/generators/terrainHelpers.js:23-33` |
| C-2 | *a garrisoned town keeps soldiers* | `walls` and `citadel` are members of the military-institution name list, so a walled town with no force resolves GARRISONED | `src/generators/priorityHelpers.js:45`; `generalStateProse.js:1179-1184` |
| C-3 | *a burnt-out house no longer serves* | true for DS-GEN-13 (`liveInstitutions` filter, `generalStateProse.js:1139`), FALSE for DS-GEN-17, whose booleans are minted at generation over the raw roster and never re-read | `src/generators/economy/economicState.js:51,872` → `src/generators/priorityHelpers.js:277-279,41-79`; the filter it skips `src/domain/institutions/institutionRoster.js:29-53` |
| C-4 | *an impaired institution is a diminished one* | `'impaired' (corruption) is NOT inactive — an impaired institution still stands and still functions (corruptly), so it stays LIVE here` | `src/domain/institutions/institutionRoster.js:18-20` |
| C-5 | *a town that has held level has been counted twice* | band 0 is also the empty-ring answer; only DS-POP-3's window gate separates them, and `populationHistory` is 0 of 48 on a freshly generated settlement | `src/domain/display/trendLens.js:47-49`; `generalStateProse.js:1547-1586` |
| C-6 | *stone endures and timber rots* | on this desk the only decay clock over built fabric is the SCAR half-life, which is keyed on the CALAMITY kind and not on any material: burn 104w · plague 156w · flood 104w · rubble 208w · siege 260w · occupation 208w · famine 78w. The engine has no material anywhere in that table. | `src/domain/worldPulse/urbanFabricKernel.js:305-314` |
| C-7 | *a first-survey verdict ages* | it does not: "as judged at the first survey; later events and edits do not re-run this check", and R-DST-W4-c bans ten temporal tokens from every variant of DS-GEN-3 and DS-GEN-11 | `src/components/new/tabs/ViabilityTab.jsx:142-143`; `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:34,106` |
| C-8 | *a town's history explains its present tensions* | eight of ten tension types are STATELESS — no event id, no `yearsAgo`, no cause field; only `occupation_legacy` and `outside_debt` license a past clause, and only as much as the word itself carries | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:20` |
| C-9 | *a criminal faction strong enough to be noted is strong* | the two criminal coherence notes need `power > 20` / `> 35`; across 291 factions on 48 settlements the crime-faction power values were exactly 5, 6 and 7 — "the ceiling is a third of the lower threshold" | `generalStateProse.js:1004-1010` |
| C-10 | *an occupied town's stability note mentions occupation* | the occupation note "never fired on 96 settlements carrying the `occupied` stress, because it additionally requires the stability text NOT to mention occupation" | `generalStateProse.js:1016-1018` |
| C-11 | *a town has a founding year* | the engine holds a founding REASON and an AGE and no construction date of any kind | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:127` |
| C-12 | *an older town is a larger one* | `AGE_BY_TIER` gives thorp 15-300y and hamlet 30-120y — a thorp may outlive a hamlet by 180 years | `src/data/historyData.js:1111-1118` |
| C-13 | *"a generation ago" can follow a preposition* | `older_than_bearers` is PREDICATE-ONLY (attributive, span and since are all `null`), and 89 of 108 measured events are older than sixty years, so `{timeband_since}` returns `undefined` on most of the record | `src/domain/display/heraldCausalGrammar.js:339`; `generalStateProse.js:454-469` |
| C-14 | *a town with no magic is a town whose wizards are few* | `magical = 0` when magic is off world-wide, so `scores.magical: CRITICAL` is the reading of a WORLD, not of a town | `src/generators/defenseGenerator.js:304-307` |
| C-15 | *a monster-plagued frontier scores high on the monster axis* | it scores 15 LOWER | `src/generators/defenseGenerator.js:227` |
| C-16 | *the population trend explains itself* | the band carries NO provenance; DS-POP-1's migration ledger and demographic receipt are the only fields in the estate that license a clause about why the roll moved | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` DS-POP-2 ENTAILMENT; DS-POP-1 ENTAILMENT |
| C-17 | *a town with an empty relationship roll has level ties* | true only where the array EXISTS; "a settlement carrying no `relationships` array has not been asked the question" and renders nothing | `generalStateProse.js:789-798` |

---

## 7. RAISED FOR THE CHAIR (observations only; nothing decided here)

1. **The card has no definitional column.** The printed `may claim` line asserts only *that the reader selects row R of table T, as a STANDING fact of the record*. The owner's "common sense" half — what R MEANS by definition — has no home on the card. Every row in §3 above is a candidate for such a column; every row in §4 and §5 is a candidate for its refusal half.
2. **The general desk's definitional entailments are thinner than the defence desk's, and the reason is structural.** The defence desk names WORKS (palisade, citadel, mill) whose nouns carry material and function. This desk names BANDS, VERDICTS, CATEGORIES and TYPES, whose words carry a position on a ladder and almost nothing else. The one genuinely definitional family here is the ROSTER family (market, church, granary, prison, court, port) and it is exactly the family the engine resolves by **substring name match** (`priorityHelpers.js:24-25`) rather than by type — which is why §5 has seventeen rows.
3. **Two of this desk's own annex glosses are contradicted by the code they describe** — DS-GEN-17's "a standing paid force" (L-1 / C-2) and DS-GEN-9's reading of `anchored` (L-4). Both are the annex being more knowledgeable than the simulation, in the annex rather than in a variant. Neither is a variant's fault and neither is a lane's to rule.
4. **The ruin filter is applied on one block of this desk and not on its sibling** (C-3). DS-GEN-13's leaf comment names this the difference "this whole desk exists to hold"; DS-GEN-17 reads a generation-frozen boolean set. Whether an entailment about a house STANDING is licensed therefore differs by block within one desk.
5. **A pool key's own words are read by the instrument as civic objects** (A-13), and three general-desk pools are mis-classed by that read (`patron`→temple, `port`→road, `guild_conflict`→craft). If the law makes definitional entailment turn on the noun, the same word-list problem will reach it.
6. **`{band}` is RESERVED and refused outright** (`generalStateProse.js:125-131`), so any law that licenses a definitional attribute must not license a COUNT through the back door: on this desk the count has no slot at all.
