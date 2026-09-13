# ENTAILMENT SURVEY — THE STRESSOR + CONDITION DESK (`stressors`)

Dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW` at `f2da5a3ee5743e56b9073570bdd487e1ef1a460f`. READ-ONLY; nothing written, staged, committed; no vitest, no npm test, no build. Only `scripts/prose-licence-card.mjs` was executed (it prints).

Every `file:line` below is a path in that dock.

---

## 0. SCOPE — how the desk's blocks were found (not guessed)

| fact | value | source |
|---|---|---|
| the desk's block prefixes | `DS-STR-` and `DS-CND-` | `scripts/generate-dossier-state-prose.mjs:113` (`DESKS` row `{ file: 'stressors', prefixes: ['DS-STR-','DS-CND-'] }`) |
| the gate's `--section` roster | `SECTION_LEAVES.stressors = DOSSIER_STATE_PROSE_STRESSORS`, i.e. the generated leaf itself, not a prefix list | `scripts/prose-wave-gate.mjs:294`, `:299`; the leaf is `src/data/dossierStateProse/stressors.generated.js` (imported at `scripts/prose-wave-gate.mjs:115`) |
| why the leaf and not a prefix list | a hand-written prefix list drifted and put 29 of 708 pools on no desk; "a leaf IS a section" | `scripts/prose-wave-gate.mjs:277-292` |
| the desk's blocks | **three**: `DS-STR-1`, `DS-STR-2`, `DS-CND-1` | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:4049`, `:4207`, `:4390` |
| the desk's implementation | `src/domain/display/stateProse/stressorsStateProse.js` (535 lines) | — |
| the desk's only call site | `src/components/new/tabs/OverviewTab.jsx:174-190` (page-wide) and `:298` (per banner) | — |

### Census totals for the desk (`docs/content/wiring-census.json`)

| block | pools | RESOLVED | WIRING-UNRESOLVED | rungs | sites |
|---|---|---|---|---|---|
| DS-STR-1 | 17 | 15 | 2 | `table` | `overview.crisisBanners` |
| DS-STR-2 | 32 | 22 | 10 | `template` | `overview.stressorLifecycle` |
| DS-CND-1 | 18 | 12 | 6 | `template`, `literal` | `overview.activeConditions` |
| **desk** | **67** | **49** | **18** | — | 3 sites |

Desk-wide, measured off the census rows: **246 authored variants**; **0 rows carry a holder**; **every row's `source.standing` is `SOURCE-UNRESOLVED`**; **0 covert rows**; **0 narrowed rows**; **0 attach sets** (every pool is a bare spine). Consequence, printed on every card: *"NO citation is licensed: a face naming a record holder here is refused by arm A13."*

⚠ None of the three blocks carries a `RECEIPT:` line. They carry `STATE-KEY`, `ENTAILMENT`, `SLOTS`, and (DS-STR-1 only) `PROVENANCE`. The absence is a fact about the blocks, not an omission in this survey: `awk` over `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:4049-4500` finds `STATE-KEY` at 4051 / 4209 / 4392, `ENTAILMENT` at 4054 / 4215 / 4397, `SLOTS` at 4068 / 4226 / 4407, `PROVENANCE` at 4066 (and two pool-name uses at 4459, 4464) and no `RECEIPT` at all.

### Licence cards run (8, spread over all three blocks)

`node scripts/prose-licence-card.mjs <block> "<pool>"`:

`DS-STR-1 :: UNDER SIEGE` · `DS-STR-1 :: FAMINE` · `DS-STR-1 :: MASS MIGRATION` · `DS-STR-2 :: LIFECYCLE: residual` · `DS-STR-2 :: ORIGIN: declared_war` · `DS-CND-1 :: SEVERITY: critical` · `DS-CND-1 :: DIRECTION: worsening` · `DS-CND-1 :: PROVENANCE: causes[] or triggeredAt.sourceEventType populated` — plus two dark pools (`DS-CND-1 :: FAMILY: acute crisis`, `DS-STR-2 :: COUNTERFORCE: a named leading source`) to record the refusal grammar.

The card's grammar, verbatim and identical on all eight:

- **may claim** (table rung, DS-STR-1): *"that the key `token` selects the row `under_siege` of `CRISIS_POOL_OF` in `stressorsStateProse.js`, as a STANDING fact of the record"*
- **may claim** (template/literal rung): *"that `lifecycleStage` (=== residual) holds, as a STANDING fact of the record"* / *"that `severity` (=== critical) holds…"* / *"that `status` (=== worsening) holds…"*
- **may NOT**, on every card: *"a count, a cause, a season, a future, a standpoint, a second fact"*
- **REFUSED COLUMNS, always**: *"a totality over persons; an exemption from a duty …; a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)"*
- a dark pool prints: *"may claim: nothing: the census recovered no reading, so no claim is licensed"*

⭐ The card's own **may NOT** list already refuses **a cause**. Several rows below are cases where a variant supplies a cause anyway; they are flagged as ENGINE-CONTRADICTS rather than re-litigated as grammar.

---

## 1. THE DESK'S READS, EXHAUSTIVE

Every distinct `reads` string across the 67 census rows, with the engine home of each.

| read (census string) | pools | engine home | notes |
|---|---|---|---|
| `token (via CRISIS_POOL_OF in stressorsStateProse.js)` | 15 (DS-STR-1) | `src/domain/display/stateProse/stressorsStateProse.js:98-118`; the producer table is `src/data/stressTypes.js:10-170` | 15 closed generator stress types |
| *(none)* | 2 (DS-STR-1: ARITY, section framing) | key fns `stressorsStateProse.js:160`, `:170` read `banners.length` only | census recovers no field |
| `worldStressor.lifecycleStage` | 5 (DS-STR-2 LIFECYCLE) | `src/domain/worldPulse/stressorsCore.js:34-42` (`STRESSOR_LIFECYCLE_STAGES`), derived at `:314-322` | 7 stages, 5 written |
| `worldStressor.originContext.variant` | 17 (DS-STR-2 ORIGIN) | `src/domain/worldPulse/stressorDynamics.js:657-729` (`VARIANT_HOOKS`), stamped at `:741-908` | 17 variants, 17 pools |
| *(none)* | 10 (DS-STR-2 COUNTERFORCE ×4, SYNERGY ×6) | `stressorDynamics.js:404` / `:547` — behind a 602 KB transitive drag, unreached | dark by declaration, `stressorsStateProse.js:388-397` |
| `condition.severity` | 4 (DS-CND-1 SEVERITY) | `src/domain/activeConditions.js:541-547` (`severityBand`) | cuts 0.75 / 0.5 / 0.25 |
| `condition`, `condition.status` | 2 (DIRECTION worsening / easing) | `activeConditions.js:493` (`VALID_STATUSES`) | third direction pool is dark |
| `condition.archetype` | 3 (ARCHETYPE reconstruction / boom / flourishing) | `activeConditions.js:58-540` (46 archetypes) | 3 of 46 written |
| `condition` | 2 (PROVENANCE) | `activeConditions.js:670` (`causes`), `:636-640` (`triggeredAt`) | |
| `condition`, `condition.duration` | 1 (DURATION) | `activeConditions.js:637-643` | desk's own 25 % cut, `stressorsStateProse.js:259` |
| *(none)* | 6 (DS-CND-1 FAMILY ×5, DIRECTION flat) | no `family` field exists on any template | dark by declaration, `stressorsStateProse.js:338-352` |

---

## 2. SLOT NOUNS, EXHAUSTIVE (all six, all three blocks)

Union of `slotsNamed` across the desk: `band`, `counterpart`, `reason`, `season`, `settlement`, `timeband_age`. **Five of the six are named and never filled.**

| slot | blocks | fill shape | shape defined at | fill class + members | FILLED? |
|---|---|---|---|---|---|
| `{settlement}` | all three | `proper` | `scripts/lib/dossier-slot-shapes.mjs:27` | the town's own name, guarded by `properFill` — refuses em/en dash, sentence punctuation, digits, `snake_case`, non-capitalised | **YES**, `stressorsStateProse.js:133-146`, `:458` |
| `{season}` | DS-STR-1 (FAMINE #3) | `bare-common` | `dossier-slot-shapes.mjs:29` | the four season ids `spring · summer · autumn · winter` (`src/domain/townMap/mapEdits.js:53`, `src/domain/townMap/mapDress.js:68`; the world clock's own derivation is `seasonForTick`, `src/domain/worldPulse/seasons.js:41`) | **NO** — no producer; `SLOT_FILL_TABLES` is empty (`stressorsStateProse.js:82`) |
| `{band}` | DS-STR-1 (MASS MIGRATION #5) | **RESERVED** | `dossier-slot-shapes.mjs:39` | *no declarable fill*: "`{band}` is one name for six incompatible roles … across 37 uses in 26 blocks" (`dossier-slot-shapes.mjs:33-38`); a RESERVED slot's fill table is refused, `:215` | **NO, and refused by construction** |
| `{counterpart}` | DS-STR-2 (ORIGIN: declared_war #1) | `proper` | `dossier-slot-shapes.mjs:27` | another settlement's name; the record field is `originContext.attackerSettlementId` (`stressorDynamics.js:777-783`) | **NO** |
| `{reason}` | DS-STR-2 (COUNTERFORCE: named leading source), DS-CND-1 (PROVENANCE: traced) | `bare-common` | `dossier-slot-shapes.mjs:29` | two candidate classes, **neither ruled**: (a) `SOURCE_LABELS` — `food resilience · stored food · production balance · healer redundancy · public legitimacy · allied military protection · trade partnerships · external arcane relief`, plus the derived `"<key> institutions"` and `key.replace(/_/g,' ')` (`stressorDynamics.js:375-390`); (b) `causes[].detail` free text (`src/domain/conditionPromotion.js:206-208`) | **NO** — the desk refuses to coin the vocabulary: "a desk inventing that vocabulary would be a lane ruling reader-facing prose" (`stressorsStateProse.js:277-291`) |
| `{timeband_age}` | DS-CND-1 (PROVENANCE: untraced #3) | `phrase` | `dossier-slot-shapes.mjs:31` | `TIME_BANDS` six rows × four positions — `this season · within the year · years on · a decade · a generation · older than its bearers` (`src/domain/display/heraldCausalGrammar.js:333-340`; positions `:343`; selectors `:354`, `:370`) | **NO, and must stay unfilled** — three independent refusals recorded at `stressorsStateProse.js:296-336` |

⭐ THE `{timeband_age}` REFUSAL IS THE DESK'S OWN WORKED EXAMPLE OF THE CHAIR'S LAW, and it is worth lifting whole because it is an entailment ruling in all but name: *"A CONDITION CAN NEVER BE OLD. All 46 `CONDITION_ARCHETYPE_TEMPLATES` carry a NUMERIC `defaultExpiresAtTicks` (5..18) — not one is null — and `withExpiredConditionsRemoved` drops a condition the tick it reaches its cap. So the oldest condition this estate can hold is EIGHTEEN ticks"* (`stressorsStateProse.js:312-320`; the caps are at `activeConditions.js:58-540`, the removal at `:927`). The sentence the slot sits in says *"Whatever caused it did so before anyone was writing things down"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4467`, pool header `:4464`). **A slot noun whose every possible fill contradicts its own sentence is refused, not filled.**

---

## 3. RECORDED NAME CLASSES A FACE OF THIS DESK CAN RENDER

The desk fills exactly one slot (`{settlement}`), so it renders no institution NAME. But its 246 variants render civic objects as **bare common nouns** — walls, gates, the granary, the market, the watch, the hall, the altars, the courthouse, the overseers, the healers, the clerks, the camps. Those nouns are the entailment surface, and each maps to a closed engine class.

### 3a. The projector's own closed class list — `CIVIC_OBJECT_CLASSES`

`src/domain/prose/wiringCensus.js:1301-1323`, read by `objectClassesOf` at `:1358`.

| class | members (verbatim) | line |
|---|---|---|
| `wall` | `wall, walled, unwalled, perimeter, rampart, palisade, gate` | 1302 |
| `force` | `garrison, militia, muster, watch, guard, soldier, patrol, armed` | 1303 |
| `store` | `stores, reserve, reserves, stock, larder, harvest` | 1309 |
| `market` | `market, trade, export, import, commerce, merchant, caravan` | 1310 |
| `law` | `court, prison, gaol, law, justice, magistrate, assize` | 1311 |
| `temple` | `temple, shrine, church, parish, clergy, faith, patron` | 1312 |
| `road` | `road, route, approach, port, harbour, bridge, pass, ford` | 1313 |
| `hall` | `hall, council, charter, seat, office, chamber, moot` | 1314 |
| `care` | `hospital, infirmary, healer, medical, physician, ward` | 1315 |
| `craft` | `forge, smith, workshop, guild, craft, mill, yard` | 1316 |
| `storehouse` | `granary, silo, storehouse, warehouse` | 1322 |

Only **four** of the desk's 67 pool KEYS name a civic object (census `objectClasses`): `DS-STR-2 :: SYNERGY: market_shock × indebtedness` → `market`; `ORIGIN: merchant_cabal` → `market`; `ORIGIN: temple_putsch` → `temple`; `ORIGIN: council_schism` → `hall`. Every other civic object on this desk arrives **inside a variant's prose, unkeyed and unguarded**.

### 3b. The roster rows behind those nouns — `src/data/institutionalCatalog.js`

Tier order: `thorp · hamlet · village · town · city · metropolis` (`src/data/constants.js:3`); populations `thorp 8-60`, `hamlet 61-400` (`src/data/constants.js:7-15`).

**The wall class (`defenseLevel` exclusive group + the thorp outlier):**

| row | tier | line | desc (verbatim) | material entailed? |
|---|---|---|---|---|
| `Palisade` | thorp | 97 | "Sharpened stakes encircling the settlement. Offers minimal protection but enough to deter casual raiders." | **YES — timber.** Sharpened stakes. Not in `defenseLevel`. |
| `Palisade or earthworks` | hamlet | 342 | "Basic wooden palisade or earthwork berm. Slows raids and creature incursions." | **NO — a disjunction.** timber *or* earth |
| `Palisade or earthworks` | village | 874 | "Perimeter palisade or earthwork berm. Controls approach, slows attackers." | **NO — a disjunction.** |
| `Town walls` | town | 1332 | "Stone fortifications with gates. Expensive to build and maintain." | **YES — stone, and gates.** |
| `City walls and gates` | city | 1910 | "Masonry walls with towers. Multiple gatehouses." | **YES — masonry, towers, multiple gatehouses.** `required: true` at city |
| `Massive walls and fortifications` | metropolis | 2347 | "Layered wall systems: outer wall, inner wall, citadel ring. Multiple garrison zones and gatehouses." | **YES — layered, a citadel ring, garrison zones.** |
| `Gates (if walled)` | town | 1356 | "Controlled entry points with gatekeepers." | separate row, `baseChance: 0.5`, **not** in `defenseLevel` — a town roster can hold gates without holding walls, and the row name says so |
| `Citadel` | city | 1931 | "Inner fortress. Last refuge in siege." | inner fortress, last refuge — **stone is NOT stated** |

**The force class:**

| row | tier | line | desc |
|---|---|---|---|
| `Household levy` | thorp | 104 | "One able-bodied adult from each household musters with hunting bows, spears, and farm tools when danger reaches the fields." |
| `Citizen militia` | hamlet / village / town | 335 / 867 / 1340 | "Able-bodied residents drill and muster against local threats. Part-time service." (hamlet) |
| `Town watch` | town | 1348 | — |
| `Barracks` | town | 1363 | "Housing for guards or small garrison." |
| `Professional city watch` | city | 1918 | — |
| `Garrison` | city | 1925 | "Professional soldiers. Noble or royal." `required: true` |
| `Mercenary quarter` | city | 2182 | — |
| `Multiple garrisons` | metropolis | 2355 | — |

`inst.hasWatch` resolves ONLY `['town watch','city watch','professional city watch']` (`src/generators/priorityHelpers.js:48`). **A thorp, hamlet or village can never have a watch.** `inst.hasWalls` resolves `['walls','citadel','gates (if walled)','inner citadel','massive walls','palisade','earthwork']` (`:52`), `inst.hasGates` a different list (`:53`).

The stressor generator uses a *third, looser* spelling of the same two classes: `hasWalls = n.includes('wall') || n.includes('citadel') || n.includes('palisade')` and `hasMilitary = n.includes('garrison') || n.includes('militia') || n.includes('watch')` (`src/generators/stressGenerator.js:107-108`). The world layer uses a **fourth**: `INSTITUTION_CLASSES.defense = /(wall|gate|garrison|watch|barracks|tower|fortress|militia|citadel)/i` and `security = /(watch|garrison|constab|guard|magistrate|court)/i` (`src/domain/worldPulse/stressorDynamics.js:47-55`) — note `watch` and `garrison` are in BOTH classes.

### 3c. Status / posture / tier words a face can render

| vocabulary | members | file:line |
|---|---|---|
| generator stress types (the DS-STR-1 key set) | `under_siege · famine · occupied · politically_fractured · indebted · recently_betrayed · infiltrated · plague_onset · succession_void · monster_pressure · insurgency · religious_conversion · slave_revolt · wartime · mass_migration` | `src/data/stressTypes.js:10-170` |
| world stressor catalog types (a DIFFERENT set) | `siege · famine · occupation · political_fracture · indebtedness · betrayal · infiltration · disease_outbreak · succession_void · monster_raider_pressure · insurgency · religious_conversion_fracture · slave_revolt(deprecated) · rebellion · wartime · mass_migration · market_shock · criminal_corridor · magical_instability · coup_detat · magic_deadzone` | `src/domain/worldPulse/stressorsCore.js:54-266` |
| lifecycle stages | `emerging · active · peaking · easing · resolved · residual · dormant` (7; corpus writes 5) | `stressorsCore.js:34-42` |
| duration policies | `transient · episodic · structural · dormant_residual` | `stressorsCore.js:27-32` |
| origin variants | 17: `foreign_sponsored · abandoned_agent · internal_conspiracy · declared_war · unattributed · resistance · palace_coup · barracks_coup · merchant_cabal · temple_putsch · arcane_ascendancy · council_schism · popular_revolt · servile_uprising · tax_revolt · arcane_burnout · leyline_silence` | `stressorDynamics.js:657-729` |
| condition severity bands | `low · medium · high · critical` (cuts ≥0.75, ≥0.5, ≥0.25) | `activeConditions.js:494`, `:541-547` |
| condition statuses | `worsening · stable · easing` | `activeConditions.js:493` |
| condition archetypes | 46 rows | `activeConditions.js:58-540` |
| military postures (sibling desk, same record) | 15 rows, e.g. `plague_onset → 'QUARANTINE ACTIVE'`, `famine → 'INTERNAL PRESSURE'`, `indebted → 'UNDER TRIBUTE'` | `src/domain/display/defenseDisplay.js:25-42`, folded into `DEFENSE_STRESS_STATUS` at `:61-68` |
| tier words | `thorp · hamlet · village · town · city · metropolis` | `src/data/constants.js:3` |
| time bands (`{timeband_age}`) | 6 rows × 4 positions | `heraldCausalGrammar.js:333-343` |
| `historyColour` | `military · economic · political · disaster · religious · demographic` | `src/data/stressTypes.js:20`, `:30`, `:40`, `:92`, `:135`, `:168` |

---

## 4. ENTAILMENT CANDIDATES — the desk's rows

Format per the chair's brief. **ENTAILS** = definitional attributes that ride with the word in the ENGINE'S OWN MODEL. **NOT ENTAILED** = typical association the word does not carry. **ENGINE CONTRADICTS** = a real-world entailment the engine's own rules refuse.

### R1 · `siege` / "under siege"

- **name class:** generator type `under_siege` (`src/data/stressTypes.js:11-21`); world type `siege` (`stressorsCore.js:55-63`)
- **ENTAILS:** *a besieger exists* — the annex already rules it (`RECEIPT_POOLS_DOSSIER_STATE.md:4066`: "`under_siege` entails a besieger and does not entail *who*"), and the engine agrees: the siege gate's no-enemy branch still allows the birth at ×0.4 with the reason *"only an unnamed host could press a siege"* (`stressorGates.js:443`); the catalog gives it `pressureKinds: ['conflict']` and `affectedSystems: ['defense_readiness','trade_connectivity','public_legitimacy']` (`stressorsCore.js:56-62`). *Land supply is cut or contested* — the record's own summary, `src/generators/stressNarrative.js:77-78`; the viabilityNote adds *"Port access (if present) provides a partial lifeline"* (`stressTypes.js:19`).
- **NOT ENTAILED:** the besieger's identity, banner, or nation; how long it has stood; the town's stores; the town's morale; **walls**; **gates**; a market inside; the state of the fields.
- **ENGINE CONTRADICTS:**
  - **walls.** Six DS-STR-1/2 variants make walls a fact of a besieged town — *"what is already inside the walls"*, *"The walls are held from outside"*, *"the walls have people on them"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4071`, `:4072`, `:4076`, under the pool header at `:4070`), *"knew precisely where the walls are weakest"* (`:4325`, pool header `:4323`). No pool on this desk reads any wall field: the licence card's whole reading is `token === 'under_siege'`. The engine treats walls as a **probability modifier, never a precondition**: `hasWalls → prob *= 0.6` (`stressGenerator.js:123`) and, in the world layer, `causalScore(entry,'defense_readiness') >= 70 && { mult: 0.8, reason: 'Strong walls give besiegers pause.' }` (`stressorGates.js:446-447`). A thorp whose only fortification row is `Palisade` (baseChance 0.3, `institutionalCatalog.js:97`) — or which has none at all — renders "the walls" today.
  - **the port.** `under_siege` variant 1 says *"Nothing moves through the gates"* and variant 3 *"Trade stops at the gate rather than the market now"*; the record's own viabilityNote says a port is a **partial lifeline** (`stressTypes.js:19`). "Nothing moves" is stronger than the record.

### R2 · `famine`

- **name class:** generator `famine` (`stressTypes.js:22-31`); world `famine` (`stressorsCore.js:64-72`)
- **ENTAILS:** *food scarcity is public rather than private* — the condition template's own wording, `activeConditions.js:68-69` ("Food scarcity has become a public crisis rather than a private hardship"); `pressureKinds: ['food']`, `affectedSystems: ['food_security','labor_capacity','public_legitimacy']` (`stressorsCore.js:67-70`).
- **NOT ENTAILED:** a granary (the town may have none); a market; a price; a season; a harvest count; **the number of failed harvests**; who is hoarding; rationing by rule.
- **ENGINE CONTRADICTS:**
  - **"second failed harvest".** The generator's own framed summary asserts *"is in its second failed harvest season"* (`stressNarrative.js:80-81`) — a **count** and a **history**, both on the card's may-NOT list, and nothing in the record carries a harvest counter. The corpus variants correctly avoid it; the generator string sits directly above them on the same card (`OverviewTab.jsx:292`).
  - **the granary.** FAMINE variants 1 and 5 make the granary a fact (*"The granary answers fewer hands each week"*, *"What {settlement}'s granary holds is being issued by rule"*, `RECEIPT_POOLS_DOSSIER_STATE.md:4079` and `:4083`, pool header `:4078`). The pool reads only the token. Even the engine's own famine gate reasons about *"the granaries"* off a class regex that includes a **fishery** and a **mill** — `INSTITUTION_CLASSES.food = /(granary|mill|farm|orchard|fishery|silo)/i` (`stressorDynamics.js:48`), used at `stressorGates.js:459-467`.
  - **{season}.** Variant 3 names `{season}` and the slot has no producer, so the variant is held silent — but note the card's may-NOT list refuses **a season** outright, and variant 6's *"the thinness is not seasonal"* is a negative season claim off a token that carries no clock.

### R3 · `occupied` / "under occupation"

- **name class:** generator `occupied` (`stressTypes.js:32-41`); world `occupation` (`stressorsCore.js:73-81`)
- **ENTAILS:** *another authority's writ runs here*; *revenue flows to the occupying authority*; *local institutions continue under oversight* — the record's own viabilityNote, `stressTypes.js:39`. World-side: `pressureKinds: ['conflict','legitimacy']`, `affectedSystems: ['defense_readiness','public_legitimacy','faction_stability']`, and `maxResolutionBonus: 0.12` with the comment *"occupations are sticky by design"* (`stressorDynamics.js:198`).
- **NOT ENTAILED:** a garrison; a quartering; **walls to be quartered inside**; the occupier's identity; a collaborator; a resistance; how long.
- **ENGINE CONTRADICTS:** variant 3 — *"The garrison is quartered inside the walls"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4089`, pool header `:4086`) — asserts BOTH a garrison and walls off a bare token. `Garrison` is a **city-tier row** (`institutionalCatalog.js:1925`, `required: true` at city only); `Multiple garrisons` is metropolis (`:2355`). A hamlet under occupation has neither. And the occupier's garrison is not the town's roster in any case.

### R4 · `politically_fractured`

- **ENTAILS:** *no stable governing authority*; *decision-making is paralysed*; *infrastructure maintenance is being neglected* — viabilityNote `stressTypes.js:50`; world `political_fracture` `pressureKinds: ['legitimacy']`, `affectedSystems: ['public_legitimacy','faction_stability','social_trust']` (`stressorsCore.js:82-90`).
- **NOT ENTAILED:** a count of factions (the generator's own framed summary says "Two or three", `stressNarrative.js:86-87` — a count, refused on the card); clerks; a chamber; two sets of written instructions; who holds what.
- **ENGINE CONTRADICTS:** variant 5 — *"Two sets of instructions circulate in {settlement} and the clerks have quietly decided which to obey"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4099`, pool header `:4094`) — supplies a **second fact** (clerks, and their choice) and a **standpoint**, both on the may-NOT list, from a token.

### R5 · `indebted`

- **ENTAILS:** *the creditor is OUTSIDE* — the label is "Indebted to Outside Power" (`stressTypes.js:54`); *a significant portion of revenue is being extracted*; *capital investment has stopped* (viabilityNote `:61`).
- **NOT ENTAILED:** the creditor's identity or kind — the record's own summary lists four possibilities and settles none: *"a merchant house, a noble, a guild confederation, or something older"* (`stressNarrative.js:89-90`); the size of the share; whether payment is current.
- **ENGINE CONTRADICTS:** variant 1's *"beyond the walls"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4103`, pool header `:4102`) — same wall problem as R1; the outside-ness is licensed by the label, the WALL is not.

### R6 · `recently_betrayed`

- **ENTAILS:** *the betrayal was from within* (`stressNarrative.js:92-93`); *trust in institutions is low*; *some key systems are not at full capacity* (viabilityNote `stressTypes.js:71`); world `betrayal` is `durationPolicy: 'transient'` (`stressorsCore.js:101`) — i.e. short-lived by policy.
- **NOT ENTAILED:** the betrayer's identity or presence; what was sold; how recently in seasons; the length of written agreements.
- **ENGINE CONTRADICTS:** the world layer's own origin interpreter gives `betrayal` a **`foreign_sponsored`** variant when a hostile neighbour exists (`stressorDynamics.js:742-753`). So "from within" is a generator-type entailment that the world record can flatly deny — the two records must not share the word.

### R7 · `infiltrated`

- **ENTAILS:** *an outside interest has penetrated the settlement*; *no economic impact yet — the infiltration is strategic, not extractive (so far)* (viabilityNote `stressTypes.js:81`); world `infiltration` `pressureKinds: ['crime','legitimacy']` (`stressorsCore.js:111`).
- **NOT ENTAILED:** who; a hall; a record; what has been discussed; that the town knows.
- **ENGINE CONTRADICTS:** variant 5 is marked `[ledger · dm-only]` and reads *"What {settlement}'s hall discusses and what {settlement}'s hall records have come apart"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4123`, pool header `:4118`) — a `hall` civic object off a token that reads no roster; and the record's own summary says *"The settlement does not know"* (`stressNarrative.js:95-96`) while variant 4 (`:4122`) says *"the town knows it without knowing who"* — a direct denial of the framed string sitting above it.

### R8 · `plague_onset` → "DISEASE OUTBREAK"

- **ENTAILS:** *an illness is spreading*; *market activity is reduced*; *travel is being discouraged*; *some supply chains are disrupted* (viabilityNote `stressTypes.js:91`); world `disease_outbreak` `pressureKinds: ['disease']`, `affectedSystems: ['healing_capacity','labor_capacity','social_trust']`, `durationPolicy: 'episodic'` (`stressorsCore.js:118-126`).
- **NOT ENTAILED:** **that it is a plague** — see below; a quarantine that is enforced; healers; marked doors; a count of the sick; the origin.
- **ENGINE CONTRADICTS:**
  - **"plague".** The token is `plague_onset` and the record's own summary says *"It is **not yet a plague**, but it will be if nothing changes"* (`stressNarrative.js:98-99`). The label is "Disease Outbreak" (`stressTypes.js:85`) — the corpus pool follows the label, correctly. Any face reaching for "the plague" is more knowledgeable than the record. (The condition archetype it promotes to IS called `plague`, `conditionPromotion.js:29` — see the label traps.)
  - **quarantine.** Variant 2 says *"the quarantine is observed unevenly"* and variant 6 *"Doors in {settlement} are marked"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4128` and `:4132`, pool header `:4126`) — a **second fact** off a token; the framed summary says only that quarantine measures are *"being resisted"*, and the engine's quarantine sentence elsewhere is gated on `inst.hasWatch` (`src/generators/safetyProfile.js:137`), which no tier below town can satisfy (`priorityHelpers.js:48`, `institutionalCatalog.js:1348`).

### R9 · `succession_void`

- **ENTAILS:** *the seat is empty and no claim has settled*; *major decisions are deferred*; *some institutions are operating autonomously* (viabilityNote `stressTypes.js:101`); world `succession_void` `affectedSystems: ['public_legitimacy','faction_stability','law_order','criminal_opportunity']` (`stressorsCore.js:132`).
- **NOT ENTAILED:** **a death** (the generator's framed summary asserts one — *"The last strong leader … died recently"*, `stressNarrative.js:101-102` — the world record carries no such field); a hall; unsigned instructions; a named heir.
- **ENGINE CONTRADICTS:** none found in the corpus's five variants; they stay on "the seat is empty", which is the licensed reading. ⭐ This pool is the desk's cleanest row and a useful exemplar for the chair.

### R10 · `monster_pressure` → "BEAST & RAIDER THREAT"

- **ENTAILS:** *something in the surrounding country has grown bolder*; *trade disruption is reducing income*; *defensive expenditure is increasing*; *population anxiety is rising* (viabilityNote `stressTypes.js:111-112`); world `monster_raider_pressure` `pressureKinds: ['conflict','crime']`, `spreadChannels: ['wilderness_frontier','trade_route','resource_competition']` (`stressorsCore.js:140-147`).
- **NOT ENTAILED:** **monsters** — see the label traps; a wall; a watch; which outlying holdings; that the fields are untended.
- **ENGINE CONTRADICTS:** variant 3 — *"{settlement} keeps more watch than it can afford"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4145`, pool header `:4142`) — reads as the institution when the town may have none (`priorityHelpers.js:48`); and the framed summary asserts *"The settlement's defences are adequate for normal times"* unconditionally (`stressNarrative.js:105-106`), which is a claim about the defense profile the stress record never consults.

### R11 · `insurgency`

- **ENTAILS:** *an armed or institutional movement contests the government's legitimacy*; *tax collection is contested*; *several institutions have stopped forwarding revenue*; *normal governance is functioning on momentum* (viabilityNote `stressTypes.js:122-123`); world `insurgency` `durationPolicy: 'structural'`, `affectedSystems: ['public_legitimacy','defense_readiness','social_trust']` (`stressorsCore.js:148-156`).
- **NOT ENTAILED:** street fighting — the record's summary says the opposite: *"The challenge is quiet, institutional, and dangerous, **not street fighting**"* (`stressNarrative.js:110-116`, the quoted clause at `:115`); **a watch**; patrol routes; a badge.
- **ENGINE CONTRADICTS:**
  - variant 5 — *"The watch's patrols at {settlement} have been rewritten, and the routes now avoid places rather than cover them"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4155`, pool header `:4150`). `insurgency` has `requiresTier: null` (`stressTypes.js:119`) so it fires at thorp; `inst.hasWatch` is town-and-up only. **This is the desk's textbook ALIAS TRAP instance** (§6, A2).
  - variant 4 — *"Part of {settlement} is fighting the rest of it and neither part wears a badge"* — open fighting, against the record's own "not street fighting".

### R12 · `religious_conversion` → "RELIGIOUS CRISIS"

- **ENTAILS:** *the town's religious settlement is in question*; *tithing income splits or redirects*; *religious market days and fairs are contested or duplicated*; *properties of the old institution are in legal ambiguity* (viabilityNote `stressTypes.js:133-134`); world `religious_conversion_fracture` `affectedSystems: ['public_legitimacy','social_trust','faction_stability']` (`stressorsCore.js:157-165`).
- **NOT ENTAILED:** **that the contest is internal**; a temple or church building; an altar; which rite holds what; a congregation count; **any theological content whatever** (the deity doctrine, and the card's own REFUSED COLUMNS).
- **ENGINE CONTRADICTS:** the renderer has **three** branches selected by `name.length % 3` (`stressNarrative.js:119-133`, branch texts at `:123`, `:129`, `:130`): (a) a new faith gaining ground, (b) the community **fractured**, both claiming succession, (c) **an outside authority REQUIRING conversion**. The corpus's five variants all assert (b): *"contested from within"*, *"A rival observance has taken root deep enough to divide households"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4159-4161`, pool header `:4158`). Under branch (c) the conversion is **imposed from outside** and "from within" is false. Also variant 6 — *"The altars in {settlement} are tended and the tending is new, which is visible in the stonework"* (`:4164`) — asserts altars, stonework, and a visible age.

### R13 · `slave_revolt`

- **name class:** generator `slave_revolt`, `requiresTier: "town"` (`stressTypes.js:137-147`); world `slave_revolt` **deprecated** (`stressorsCore.js:166-182`)
- **ENTAILS (generator record only):** *an enslaved population has organised*; *the slave market's commercial operations are suspended*; *labour-dependent production is disrupted*; *the security apparatus is focused on containment* (viabilityNote `stressTypes.js:144-145`, summary `stressNarrative.js:135-141`); *the settlement is town-tier or larger* (`stressTypes.js:141` + the gate at `stressGenerator.js:343`).
- **NOT ENTAILED:** *that the settlement was BUILT on bound labour* — the only economic coupling is a probability tilt off two priority sliders: `const extractive = economy > 55 && criminal > 50; if (extractive) prob *= 2.0; else prob *= 0.4;` (`stressGenerator.js:251-255` (comment `:243-250`)). A slave revolt fires at ×0.4 in a non-extractive economy. Also not entailed: overseers; rolls; a second population.
- **ENGINE CONTRADICTS:** variant 1 — *"the settlement was built on its reliability"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4167`, pool header `:4166`) — a structural-history claim the sliders do not carry. And the **world layer denies the substrate outright**: *"Folded out of ORGANIC births only (**the sim has no slavery substrate to make the claim honestly** — organic uprisings birth as `rebellion`, with a `servile_uprising` variant when the labor context fits)"* (`stressorsCore.js:176-182`).

### R14 · `wartime`

- **ENTAILS:** *the settlement is inside a kingdom at war*; *military expenditure dominates the economy* (viabilityNote `stressTypes.js:155-156`); world `wartime` `durationPolicy: 'structural'`, `affectedSystems: ['defense_readiness','tax_revenue','labor_capacity']` (`stressorsCore.js:191-198`).
- **NOT ENTAILED:** **hardship**; conscription; scarcity of men; requisition; that the town is losing.
- **ENGINE CONTRADICTS — the sharpest row on the desk.** `wartime` is the ONLY stress type that draws rng, and the coin is a **profit/loss** fork: `rollStressSummary` returns `{ profit: rng() < 0.45 }` (`stressNarrative.js:40-42`), and the profit branch reads *"currently positioned to profit. Military contracts are flowing. **The garrison is reinforced and well-supplied.** Prices are high and merchants with the right connections are getting richer"* (`stressNarrative.js:143-152` (the profit text at `:147`)). **45 % of wartime towns are profiting.** Corpus variants 4 and 6 assert the opposite as fact: *"the war has reached the town as absence: the men, the carts, and the ordinary expectation of next year"* and *"{settlement} is short of the kind of people a town this size should be full of"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4178` and `:4180`, pool header `:4174`). Conscription appears ONLY in the loss branch. A face on this pool reads a coin it cannot see.

### R15 · `mass_migration`

- **ENTAILS:** *a population movement of a scale the settlement's infrastructure was not built for* — the direction is **not** fixed by the type: the viabilityNote names both faces, *"Immigration: food balance stressed, labour market disrupted, criminal opportunity elevated. **Emigration: tax base shrinking, institutions hollowing, labour shortage emerging.**"* (`stressTypes.js:166-167`).
- **NOT ENTAILED:** **inflow**; camps; housing; a count; where they came from; that the newcomers came from somewhere worse.
- **ENGINE CONTRADICTS:** all six corpus variants assert **arrivals** — *"People are arriving faster than the town can house them. The camps outside the wall are becoming a second settlement"*, *"The newcomers came from somewhere worse"*, *"{settlement}'s rolls have grown by {band}"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4183`, `:4185`, `:4187`, pool header `:4182`). Only the renderer is inflow-shaped (`stressNarrative.js:158-164`, the text at `:162`); the record's own viabilityNote holds both directions. Variant 5's `{band}` is RESERVED and never fills, so that one is silent; the other five speak. (Variant 1 also asserts a wall.)

### R16 · `lifecycleStage` — the five written stages

- **name class:** `STRESSOR_LIFECYCLE_STAGES` (`stressorsCore.js:34-42`), derived by `lifecycleStageFor` (`:314-322`)
- **ENTAILS, per the derivation, exactly:** `resolved`/`residual`/`dormant` ⇐ `status` says so; `peaking` ⇐ **`severity >= 0.72`**; `easing` ⇐ **`severity <= 0.24 && age > 0`**; `emerging` ⇐ **`age <= 1`**; `active` ⇐ otherwise.
- **NOT ENTAILED:** a trajectory, a direction of travel, a peak having been reached, a reserve, a plan, what the town has noticed.
- **ENGINE CONTRADICTS:**
  - `peaking` variant 2 — *"The strain has **stopped compounding** and started simply holding at a level nothing here was built for"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4240`, pool header `:4238`). The model has no compounding-stopped state: `peaking` is a severity threshold and severity may still be climbing.
  - `emerging` variant 2 — *"the people worst placed for it have not worked that out"* — a standpoint over persons; `emerging` means `age <= 1`, nothing more.
  - `easing` variant 1 — *"the town … has begun to plan past the trouble"* — `easing` means low severity, not any town action.
  - `residual` is honest: it IS an echo, minted by `echoOf` with `memoryStrength` (`stressorsCore.js:468-500`), and the variants speak of memory. Good row.

### R17 · `originContext.variant` — the 17 origin words

The interpreter binds each variant to a **specific stressor type**; the pool key does not carry that binding, so the entailment must.

| variant | fires only on type | gate | file:line |
|---|---|---|---|
| `foreign_sponsored` | `betrayal` | a hostile neighbour exists | `stressorDynamics.js:742-753` |
| `abandoned_agent` | `betrayal` | a hostility ended within `MEMORY_LOOKBACK_TICKS` (12, `:601`) | `:754-765` |
| `internal_conspiracy` | `betrayal` | else-branch | `:766-773` |
| `declared_war` | `siege`, `wartime`, `occupation` | strongest neighbour is `hostile` | `:775-787` |
| `unattributed` | `siege`, `wartime`, `occupation` | else-branch; *"The attacker is unnamed until the DM says otherwise"* | `:788-799` |
| `resistance` | `insurgency` | an ACTIVE `occupation` stressor lists this settlement | `:802-816` |
| `servile_uprising` | `rebellion` | `labor_capacity < 35 && public_legitimacy < 40` | `:826-833` |
| `tax_revolt` | `rebellion` | an active `indebtedness` or `market_shock` here | `:834-840` |
| `popular_revolt` | `rebellion` | else-branch | `:841-846` |
| `arcane_burnout` | `magic_deadzone` | a RESIDUAL `magical_instability` here with `memoryStrength > 0.15` | `:850-873` |
| `leyline_silence` | `magic_deadzone` | else-branch | `:850-873` |
| `palace_coup` / `barracks_coup` / `merchant_cabal` / `temple_putsch` / `arcane_ascendancy` / `council_schism` | `coup_detat` | the leading challenger's archetype, via `COUP_VARIANT_BY_ARCHETYPE` (`noble→palace`, `military→barracks`, `merchant→merchant_cabal`, `religious→temple_putsch`, `arcane→arcane_ascendancy`, `government`/`civic→council_schism`) | `:875-908`, table `:911-919` |

- **ENTAILS:** the type binding above, and nothing more. `unattributed` entails **that the record holds no attacker** — not that one is being concealed.
- **NOT ENTAILED:** the sponsor's name; the current state of the gating condition; anything about walls, halls, warehouses, courthouses, pulpits or workrooms.
- **ENGINE CONTRADICTS:**
  - **every origin variant is a BIRTH-TIME stamp and is never re-interpreted.** The coup branch says so in the engine's own words: *"Birth-time field snapshot — NARRATIVE only. The verdict recomputes contenders from live state"* (`stressorDynamics.js:896-898`). So `ORIGIN: resistance` variant 3 — *"{settlement} **is** occupied and it is fighting back"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4331`, pool header `:4328`) — reads a birth-time occupation in the present tense; the occupation may have ended.
  - **`unattributed` #2** — *"knew precisely where the walls are weakest"* (`:4325`) — asserts walls; `unattributed` fires on siege/wartime/occupation at any tier.
  - **`servile_uprising`** — *"The bound labour of {settlement} has risen against the households that held it"*, *"Manumission papers, real and forged, change hands at night"* (`:4369-4370`, pool header `:4368`). The gate is **two causal scores** (`labor_capacity < 35 && public_legitimacy < 40`, `stressorDynamics.js:826-833`) and the engine states there is **no slavery substrate** (`stressorsCore.js:176-178`). See §6, A4.
  - **`declared_war` #1** names `{counterpart}`, which the census records as NAMED BUT NEVER FILLED — the variant is held silent, correctly.
  - **`merchant_cabal` / `temple_putsch` / `council_schism`** assert a warehouse, a pulpit + sanctuary, and a chamber + a seal (pool headers `:4343`, `:4348`, `:4358`). Those are `market`, `temple` and `hall` civic objects — and they are the four pool keys the census DOES classify (§3a), so the projector already knows the class is in play.

### R18 · `severityBand` on a condition

- **name class:** `low · medium · high · critical`, cuts at 0.75 / 0.5 / 0.25 (`activeConditions.js:494`, `:541-547`)
- **ENTAILS:** *the record's `severity` float sits in that band.* Nothing else. The annex is explicit: *"Severity is a float the prose never speaks"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4402-4403`, and again at `:4222`).
- **NOT ENTAILED:** capacity; a limit; a bend; what the town has given up; a direction.
- **ENGINE CONTRADICTS:**
  - **polarity.** Three archetypes are **positive-polarity LIFTS** — `reconstruction`, `boom`, `flourishing` (`archetypeCatalog.js:31`, *"they RAISE the systems they declare"*), templates at `activeConditions.js:467`, `:475`, `:483`. Their severity is a MAGNITUDE, not a strain. `SEVERITY: critical` renders *"The town is at its limit. There is no capacity left to absorb this"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4425`, pool header `:4424`) — false of a boom. The desk fires **all five condition lenses on the SAME condition** (`stressorsStateProse.js:479-486`), so the severity line and the archetype line compose on one record.
  - **the default.** An UNKNOWN archetype has no template, so `deriveActiveCondition` gives it `severity = 0.25` (`activeConditions.js:626-628`) → band `medium` → the desk prints *"The pressure is genuine now. Choices are being made because of it that would not have been made otherwise."* off a fallback constant.
  - **which condition.** The desk describes `conditions[0]` (`stressorsStateProse.js:462`, docblock `:445-448`), and `deriveAllActiveConditions` does **no sorting** (`activeConditions.js:680-684`). "This is one of the defining facts about the town" (`SEVERITY: high` #1) may describe whichever condition happens to be first in the array.

### R19 · `status` on a condition — the direction words

- **name class:** `VALID_STATUSES = worsening · stable · easing` (`activeConditions.js:493`); drift `worsening +0.04/tick`, `easing -0.06/tick`, everything else 0 (`:846-849`)
- **ENTAILS:** *the record carries that direction word, and the aging pass will drift severity accordingly.*
- **NOT ENTAILED:** an elapsed trend; a rate; a season; a response; repair spending; that the town has noticed.
- **ENGINE CONTRADICTS — the desk's hardest row:**
  - **the E-3 protection is defeated at the call site.** The annex's rule is *"a condition whose input status is missing, legacy or `'active'` holds FLAT"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4397-4401`) and the desk's key function honours it (`stressorsStateProse.js:201-214`). But the OverviewTab hands the desk `deriveAllActiveConditions(r)` (`OverviewTab.jsx:186`), and `deriveActiveCondition` **substitutes the archetype's `defaultStatus`** before the desk ever sees the record: `const status = VALID_STATUSES.has(condition.status) ? condition.status : (tmpl ? tmpl.defaultStatus : 'stable')` (`activeConditions.js:644-646`). A statusless `plague` therefore routes to `DIRECTION: worsening` and prints *"It is getting worse, steadily rather than suddenly; each season costs a little more than the one before"* (`:4430`, pool header `:4429`).
  - **the engine names this exact hazard and refuses it on its own path.** `withTickedConditionDurations` writes back the RAW status precisely so a default never becomes motion: *"[domain-top-state-1] Preserve the RAW status when the input had no valid directional status. Writing back canonical.status would canonicalize a missing/legacy/'active' status to the template default (e.g. plague's 'worsening'), and the next tick would read that written-back direction and **invent motion (+0.04/tick) — defeating the drift's own no-invented-motion invariant**"* (`activeConditions.js:894-901`; the drift comment at `:835-840` says the same). The display path is the one that walks into it.
  - **birth.** Every condition measured on this desk sat at `elapsedTicks: 0` (`stressorsStateProse.js:329-331`). At tick 0 nothing has worsened yet, and "each season costs a little more than the one before" asserts a history.
  - **wind-down override.** Within 2 ticks of expiry the status is **forced to `easing` and persisted** regardless of the real direction: `EXPIRY_EASING_WINDOW_TICKS = 2` (`activeConditions.js:859`), applied at `:879-882` and written at `:902`. `DIRECTION: easing` variant 3 — *"{settlement} has begun spending on repair rather than on holding"* (`:4442`, pool header `:4439`) — attributes an action to a clock.
  - **polarity again.** `reconstruction` defaults to `easing` (`activeConditions.js:472`) → *"It is lifting"* about a rebuild; `boom` and `flourishing` default to `stable` (`:480`, `:488`) → the FLAT pool's *"Nothing here is moving. That is not relief, only the absence of change"* (`:4437`, pool header `:4434`) about a golden age.

### R20 · `causes[]` / `triggeredAt.sourceEventType` — the provenance split

- **ENTAILS:** *the record carries at least one cause entry, or a `sourceEventType` string.*
- **NOT ENTAILED:** **that the cause is an in-world event**; that it is undisputed; that the town knows it.
- **ENGINE CONTRADICTS:** at generation **every** promoted condition is stamped `triggeredAt.sourceEventType: 'GENERATION'` and `causes: [{ source: 'generation', detail: 'Settlement generated under stressor "<label>".' }]` (`conditionPromotion.js:203-208`). So `conditionProvenancePoolKey` (`stressorsStateProse.js:243-257`) routes **100 % of birth conditions to the TRACED pool** — the desk measured 14 of 14 (`stressorsStateProse.js:326-329`). The traced pool says *"The condition traces back to {reason}, and the trace is not disputed. **The town knows exactly what did this.**"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4460`, pool header `:4459`). The trace is a bookkeeping sentinel meaning "this world was born this way". ⚠ Mitigated today only because all three variants name `{reason}` and `{reason}` never fills, so the pool is held silent by anchored liveness — the desk records this deliberately (`stressorsStateProse.js:277-291`). **Ruling a `{reason}` fill vocabulary lights a false sentence.**

### R21 · `duration` — the wind-down

- **ENTAILS:** *`expiresAtTicks - elapsedTicks <= 0.25 * expiresAtTicks`* — the desk's own cut, declared vetoable: *"the wind-down window is the last quarter of a condition's life … there was no canonical cut to reuse … Say 'veto' to move it"* (`stressorsStateProse.js:259-266`).
- **NOT ENTAILED:** that the pressure is releasing; that nothing was fixed; a schedule anyone can see.
- **ENGINE CONTRADICTS:** the engine's OWN wind-down is a **fixed 2 ticks**, not a fraction (`activeConditions.js:859`). The two disagree in both directions: for `war_exhaustion` (`defaultExpiresAtTicks: 18`, `activeConditions.js:358`) the desk fires at 4.5 ticks out while the engine has not begun easing; for `war_spoils` (`5`, `:459`) the desk fires at 1.25 ticks, inside the engine's window. *"It is nearly over"* is a desk constant, not a record fact.

### R22 · `archetype` — the three written of 46

- **ENTAILS:** the archetype key holds. `reconstruction`: *"rebuilding after a calamity or the lifting of a siege"* (`activeConditions.js:469`). `boom`: *"Sustained trade and surplus … Prosperous, and quietly dependent on the arteries feeding it"* (`:477`). `flourishing`: *"A long peace and steady legitimacy … a golden age, modest and bounded"* (`:485`).
- **NOT ENTAILED:** scaffolding; ruins; warehouses; wages; workshops; schools; that the arcs are enabled in this world at all.
- **ENGINE CONTRADICTS:** *"Minted by the lazy upswingKernel mover, gated behind virtual `upswingArcsEnabled`; **a dark world never carries them**"* (`activeConditions.js:463-466`). The three pools are unreachable in a world with the arcs off — which is not a contradiction of the prose, but a reachability fact the chair should hold beside the "three of 46" note at `stressorsStateProse.js:216-222`.

### R23 · the ARITY pool — "several banners standing at once"

- **ENTAILS:** `banners.length > 1` (`stressorsStateProse.js:160-164`).
- **NOT ENTAILED:** **a number**; that the crises interact; that either makes the other harder to end.
- **ENGINE CONTRADICTS:** at generation the cap is **exactly two**: *"Second stress: only fires ~10% of the time when a primary exists"*, `sorted.slice(0, 2)` (`stressGenerator.js:353-356`). So "several" is always two at birth. And the two variants assert interaction — *"they are not independent. Each makes the others harder to end"*, *"the troubles here compound, and the compounding is the real condition"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4191-4192`, pool header `:4190`). The generator's two stresses are drawn by **independent rolls** (`stressGenerator.js:340-346`) with no interaction model at all; the compounding model (`STRESSOR_SYNERGIES`, `stressorDynamics.js:466-523`) lives on the **world** record, which is a different array. Compounding asserted from an arity count is a cause, and a cause the record does not hold.

---

## 5. LABEL TRAPS — an engine value or label whose English meaning is not its engine meaning

| label / value | field | ENGINE MEANING (quoted) | file:line |
|---|---|---|---|
| `plagued` | `config.monsterThreat` | *"The surrounding region is plagued by **monster** activity."* Not disease. On this desk it multiplies `under_siege` and `monster_pressure` by 2.5 and `wartime` by 1.3; it does **not** touch `plague_onset` at all. | `src/components/new/SummaryTab.jsx:37`; `src/generators/stressGenerator.js:119` (`under_siege` / `monster_pressure`) and `:230` (`wartime`); the `plague_onset` block that never reads it, `:172-180` |
| `plague_onset` | `stress[].type` | the **onset** of a disease outbreak: *"It is **not yet a plague**, but it will be if nothing changes."* Label is "Disease Outbreak". | `src/generators/stressNarrative.js:98-99`; label `src/data/stressTypes.js:85` |
| `plague` | `condition.archetype` | the archetype a `/plague|disease|pox|fever|outbreak|pestilence/i` match promotes to — the same word as the type above, but a **different record class with its own 12-tick clock**. | `src/domain/conditionPromotion.js:29`; template `src/domain/activeConditions.js:59-66` |
| `monster_pressure` / "Beast & Raider Threat" | `stress[].type` | **not monsters**: *"Whether wolves, raiders, or worse."* The world twin is `monster_raider_pressure`. | `stressNarrative.js:105-106`; `stressorsCore.js:140` |
| `religious_conversion` / "Religious Conversion" | `stress[].type` | three unequal branches picked by `name.length % 3`: a faith gaining ground, a **fracture**, or **an outside authority requiring conversion**. The corpus pool is named "RELIGIOUS CRISIS" and the desk records the label/pool mismatch. | `stressNarrative.js:119-133` (branch texts at `:123`, `:129`, `:130`); desk note `stressorsStateProse.js:111-112` |
| `indebted` / "Indebted to Outside Power" | `stress[].type` | pool is "INDEBTED TO AN OUTSIDE POWER"; keyed on the token so the wording gap costs nothing. | desk note `stressorsStateProse.js:103-105` |
| `emerging` | `lifecycleStage` | **`age <= 1` tick**, nothing about visibility or naming. | `stressorsCore.js:314-322` |
| `peaking` | `lifecycleStage` | **`severity >= 0.72`** — a threshold, not a turning point; the strain may still be climbing. | `stressorsCore.js:318` |
| `easing` | `lifecycleStage` | **`severity <= 0.24 && age > 0`** — a low level, not a downward trend. | `stressorsCore.js:319` |
| `easing` | `condition.status` | (a) a **declared drift direction**, −0.06 severity/tick; (b) **forced** within 2 ticks of expiry regardless of the real direction. | `activeConditions.js:846-849`, `:859`, `:879-882` |
| `worsening` | `condition.status` | +0.04 severity/tick, and — on the display path — the **archetype's default** when the record carries no status at all. | `activeConditions.js:846-849`; substitution `:644-646`; the engine's own warning `:894-901` |
| `GENERATION` | `condition.triggeredAt.sourceEventType` | **"this settlement was born carrying this"** — not an in-world event. It is nonetheless the value that routes the condition into the TRACED-provenance pool. | `conditionPromotion.js:203`, `:206-208`; routing `stressorsStateProse.js:243-257` |
| `source: 'generation'` | `condition.causes[].source` | same; `detail` is literally `Settlement generated under stressor "<label>"`. | `conditionPromotion.js:208` |
| `critical` | `condition.severityBand` | `severity >= 0.75`. ⚠ A **different** `SEVERITY.CRITICAL` exists for structural validation, with members `CRITICAL · IMPLAUSIBLE · INEFFICIENCY · DEPENDENCY`. Same word, unrelated ladder. | `activeConditions.js:541-547` vs `src/data/constants.js:16-21` |
| `regional_*` (13 archetypes) | `condition.archetype` | **not necessarily regional in origin**: the promotion table sends purely LOCAL stressors there — `mass_migration → regional_migration_pressure`, `infiltrated → regional_criminal_pressure`, `indebted → regional_tax_revenue_disruption`, `politically_fractured → regional_authority_instability`, `religious_conversion → regional_religious_pressure`. | `conditionPromotion.js:47`, `:55`, `:54`, `:61`, `:60` |
| `war_pressure` | `condition.archetype` | the archetype a **siege**, a **blockade**, a **war**, OR **`/monster|raider/`** promotes to. A `war_pressure` condition may carry no war. | `conditionPromotion.js:31`, `:34`, `:63` |
| `vassal_extraction` | `condition.archetype` | what an **occupation** promotes to; the code explains that re-pointing it at `war_pressure` *"would instead LOSE the extraction face"*. | `conditionPromotion.js:35-45` |
| `dominant_npc_removed` | `condition.archetype` | what a **succession void** promotes to — the archetype name asserts a removed NPC the void record does not carry. | `conditionPromotion.js:62` |
| `faction_challenge` | `condition.archetype` | what a **betrayal** *and* a **coup** both promote to. | `conditionPromotion.js:53`, `:76` |
| `war_spoils` | `condition.archetype` | *"Tribute, levies, and materiel from stabilized occupations **sustain** the war effort"* — a **benefit**, `affectedSystems: []`, `defaultStatus: 'easing'`. The annex files it under "FAMILY: occupation layer", whose prose reads *"Holding this place costs more than it returns."* | `activeConditions.js:454-461` vs `RECEIPT_POOLS_DOSSIER_STATE.md:4489-4490` |
| `severity` (world stressor) | `stressor.severity` | the **origin's** severity. A spread target's felt severity is a separate stamped map, `severityBySettlement`, *"stamped at spread time and never re-aged"*. | `stressorsCore.js:285-291`, `:336-339` |
| `memoryStrength` | `stressor.memoryStrength` | exists **only on echoes** (`status: 'residual'`), decaying with a ~6-tick half-life. Null on live stressors. | `stressorsCore.js:362-368` |
| `probability` | `STRESS_TYPE_MAP[t].probability` | a **generator draw weight**, capped at 0.35 after modifiers — never a likelihood the town would recognise. | `stressTypes.js:14` etc.; cap `stressGenerator.js:257` |
| `STRESS_SEVERITY_WEIGHT` | — | *"Higher weight = stress is more **narratively** severe and gets priority in multi-stress resolution"* — a sort key for which crisis is primary, not a severity of anything. | `stressGenerator.js:263-279` |
| `colour` / `historyColour` | `stress[].colour`, `.historyColour` | a hex swatch and a six-member timeline tint (`military · economic · political · disaster · religious · demographic`); `famine`'s historyColour is `economic`, `plague_onset`'s is `disaster`. | `stressTypes.js:13`, `:20`, `:30`, `:92` |
| `icon` | `stress[].icon` | **always `undefined`.** `buildStressEntry` reads `stressData.icon` and no row of `STRESS_TYPE_MAP` defines `icon`. The annex's STATE-KEY line names it as a field of the record. | `stressGenerator.js:51` vs `stressTypes.js:10-170`; annex `RECEIPT_POOLS_DOSSIER_STATE.md:4049` |
| `'QUARANTINE ACTIVE'` | `DEFENSE_STRESS_STATUS[plague_onset].posture` | a **display posture word** derived per stress type for the Defense tab and the PDF — not a record that a quarantine was declared. | `defenseDisplay.js:25-42`, `:61-68` |
| `'Strong walls give besiegers pause.'` | a `stressorGates` reason string | the field is **`causalScore(entry,'defense_readiness') >= 70`** — no wall is read. These reason strings land on the candidate *"so the dossier can explain why THIS crisis emerged HERE."* | `stressorGates.js:446-447`; the intent, `stressorsCore.js:44-46` |
| `'The granaries hold a real reserve.'` | a `stressorGates` reason string | the field is `foodLedger(...).storageMonths >= 2`; the sibling institution reason reads a class regex that includes a **fishery** and a **mill**. | `stressorGates.js:462-467`; class `stressorDynamics.js:48` |
| `deprecated: true` | `STRESSOR_CATALOG.slave_revolt` | **organic births are folded out** — *"the sim has no slavery substrate to make the claim honestly"* — while the entry stays for legacy saves and DM authoring. | `stressorsCore.js:166-182` |
| `blocksResolution` | `synergyAssessment` | reserved for **hard causal dependencies** only, and suppressed when the companion is an echo. | `stressorDynamics.js:462-465`, `:583` |
| `floorsMet: false` | `counterforceAssessment` | the score is **capped at neutral (0.5)**, never penalised: *"partial strength never punishes, it just doesn't accelerate."* | `stressorDynamics.js:367-371`, `:429` |

---

## 6. ALIAS TRAPS — a generic English word naming a class the engine splits into rows

### A1 · "the walls" / "the wall" / "the gate"

- **class:** `CIVIC_OBJECT_CLASSES.wall = wall, walled, unwalled, perimeter, rampart, palisade, gate` (`src/domain/prose/wiringCensus.js:1302`)
- **engine rows, mutually exclusive by `exclusiveGroup: 'defenseLevel'`:** `Palisade or earthworks` (hamlet `institutionalCatalog.js:342`, village `:874`) · `Town walls` (town `:1332`) · `City walls and gates` (city `:1910`, `required: true`) · `Massive walls and fortifications` (metropolis `:2347`). **Outside the group:** `Palisade` (thorp `:97`) and `Gates (if walled)` (town `:1356`).
- **the rule the engine forces:** the material follows the ROW, not the English word. `Palisade` (thorp) IS timber — *"Sharpened stakes"*. `Palisade or earthworks` is **a disjunction and pins no material**. `Town walls` is stone; `City walls and gates` is masonry with towers. A face wanting a material must resolve the row; the **always-safe spelling is the class word, "the wall" or "the perimeter"**, and the always-safe posture is to name none.
- **⚠ and none of this desk's pools reads any of it.** Every wall sentence on this desk is unguarded.

### A2 · "the watch" / "the guard" / "the militia" / "the garrison"

- **class:** `CIVIC_OBJECT_CLASSES.force = garrison, militia, muster, watch, guard, soldier, patrol, armed` (`wiringCensus.js:1303`)
- **engine rows:** `Household levy` (thorp `institutionalCatalog.js:104`) · `Citizen militia` (hamlet `:335`, village `:867`, town `:1340`) · `Town watch` (town `:1348`) · `Barracks` (town `:1363`) · `Professional city watch` (city `:1918`) · `Garrison` (city `:1925`, `required: true`) · `Mercenary quarter` (city `:2182`) · `Multiple garrisons` (metropolis `:2355`)
- **the flags that split them:** `inst.hasWatch = hasAny(names, ['town watch','city watch','professional city watch'])` (`src/generators/priorityHelpers.js:48`) — **town and up only**. The stressor generator uses a looser third spelling, `hasMilitary = garrison|militia|watch` (`stressGenerator.js:108`); the world layer a fourth, with `watch` and `garrison` in BOTH `defense` and `security` classes (`stressorDynamics.js:50-51`).
- **the rule:** the word a face uses must follow the row the town resolves; **the generic class word — "the muster", "the guard" — is the always-safe spelling**, exactly as the chair found on the defense desk (`src/generators/defenseGenerator.js:178` gates watch, militia, garrison, mercenary and charter hall behind one economic-upkeep multiplier).
- **live breach on this desk:** `DS-STR-1 :: INSURGENCY` variant 5 names "the watch" (`RECEIPT_POOLS_DOSSIER_STATE.md:4122`) off a token, at a type with `requiresTier: null`.

### A3 · "the crisis" / "the trouble" / "this" — TWO record classes with different vocabularies

- **engine rows:** `settlement.stress[]`, fifteen generator types (`src/data/stressTypes.js:10-170`), written only at generation (`stressGenerator.js:295-361`), read at `OverviewTab.jsx:145`. **AND** `worldState.stressors[]`, twenty-one catalog types (`stressorsCore.js:54-266`), never written by any generator (`stressorsStateProse.js:355-359`), read at `OverviewTab.jsx:126-134`.
- **the tokens differ for nine of the shared crises:** `under_siege`/`siege` · `occupied`/`occupation` · `politically_fractured`/`political_fracture` · `indebted`/`indebtedness` · `recently_betrayed`/`betrayal` · `infiltrated`/`infiltration` · `plague_onset`/`disease_outbreak` · `monster_pressure`/`monster_raider_pressure` · `religious_conversion`/`religious_conversion_fracture`. Six world types have **no banner at all**: `rebellion`, `market_shock`, `criminal_corridor`, `magical_instability`, `coup_detat`, `magic_deadzone`.
- **the rule:** DS-STR-1 speaks about the generation record; DS-STR-2 about the world record. **The selector is `.find()` — the FIRST world stressor listing this settlement, in array order** (`OverviewTab.jsx:129-132`), so the DS-STR-2 lines describe an arbitrary one of possibly several, and **nothing binds it to the banner printed above it**. Since DS-STR-2's prose is anaphoric ("the trouble", "this", "the crisis") and names no type, a reader binds it to the banner. The annex already forbids narrating one crisis twice (`RECEIPT_POOLS_DOSSIER_STATE.md:4222-4224`, `:4403-4405`); the sharper hazard is narrating **two** as one.

### A4 · "bound labour" / "the enslaved" / "servile"

- **engine rows:** generator `slave_revolt` (`stressTypes.js:137-147`, `requiresTier: "town"`) — its own summary DOES assert an enslaved population and a slave market (`stressNarrative.js:135-141`). World `slave_revolt` — **`deprecated: true`**, organic births folded out because *"the sim has no slavery substrate to make the claim honestly"* (`stressorsCore.js:166-182`). World `rebellion` + `originContext.variant = 'servile_uprising'` — gated purely on `labor_capacity < 35 && public_legitimacy < 40` (`stressorDynamics.js:826-833`).
- **the rule:** the same English words are licensed at `DS-STR-1 :: SLAVE REVOLT` (the generator record says it) and **refused** at `DS-STR-2 :: ORIGIN: servile_uprising` (two causal scores, and an explicit engine statement that the substrate is absent). The word must follow the record class, not the sound of the variant key.

### A5 · "the market" / "the merchants"

- **class:** `CIVIC_OBJECT_CLASSES.market = market, trade, export, import, commerce, merchant, caravan` (`wiringCensus.js:1310`)
- **rows on this desk that the census already classes as `market`:** `DS-STR-2 :: SYNERGY: market_shock × indebtedness`, `DS-STR-2 :: ORIGIN: merchant_cabal` (census `objectClasses: ["market"]`).
- **the trap:** DS-STR-1 `FAMINE` #3 and #6 and `UNDER SIEGE` #3 all name "the market" **without** the key naming it, so `objectClassesOf` (`wiringCensus.js:1358`) never sees it and the restatement guard never fires. `hasMarket` in the generator is `n.includes('market') || n.includes('fair')` (`stressGenerator.js:110`) and is read only for the famine PROBABILITY, never for the prose.

### A6 · "the granary" / "the stores"

- **classes, deliberately split:** `store = stores, reserve, reserves, stock, larder, harvest` (`wiringCensus.js:1309`) and `storehouse = granary, silo, storehouse, warehouse` (`:1322`). The split is recent and reasoned: *"`granary` LEFT THIS CLASS … The word named two different civic objects"* (`:1304-1308`); a lone storehouse is read as its stock (`:1372`).
- **the engine's own food class is wider still:** `/(granary|mill|farm|orchard|fishery|silo)/i` (`stressorDynamics.js:48`), so a "granary" reason can be earned by a fishery.
- **the trap:** FAMINE #1/#5 name "the granary" off a token, and `hasGranary` (`stressGenerator.js:109`) is a probability input only.

### A7 · "the hall" / "the seat" / "the council" / "the chamber"

- **class:** `CIVIC_OBJECT_CLASSES.hall = hall, council, charter, seat, office, chamber, moot` (`wiringCensus.js:1314`); engine institution class `admin = /(court|hall|council|government|chancery|registry|moot|forum)/i` (`stressorDynamics.js:49`).
- **the trap:** DS-STR-1 `UNDER OCCUPATION` #4 ("the town's own hall"), `POLITICALLY FRACTURED` #5 (clerks), `SUCCESSION VOID` #5 ("{settlement}'s hall"), `INFILTRATED` #5 ("{settlement}'s hall") name it off tokens; only `DS-STR-2 :: ORIGIN: council_schism` is classed `hall` by the census. At thorp the governing rows are `Informal elder consensus` / `Head-of-household consensus` / `Household elder` (`institutionalCatalog.js:8`, `:16`, `:32`) — no hall of any kind.

### A8 · "the temple" / "the altar" / "the pulpit" / "the observances"

- **class:** `CIVIC_OBJECT_CLASSES.temple = temple, shrine, church, parish, clergy, faith, patron` (`wiringCensus.js:1312`); engine `religious = /(temple|church|chapel|shrine|monastery|abbey|cathedral)/i` (`stressorDynamics.js:52`). Thorp's rows are `Wayside shrine`, `Access to parish church`, `Burial ground` (`institutionalCatalog.js:42`, `:50`, `:57`).
- **the trap:** `RELIGIOUS CRISIS` #6 names altars and stonework; `ORIGIN: temple_putsch` names a pulpit and sanctuary. Only the latter is classed `temple` by the census. **And the deity doctrine sits on top of both**: the card's REFUSED COLUMNS forbid *"a theological claim about a deity"* on every pool of this desk.

### A9 · "the war layer" / "the aggressor side" / "recovery"

- **engine rows:** `WAR_HOME_CONDITIONS = war_drain, army_deployed, war_exhaustion, reinforcement_cost` (**four**, `archetypeCatalog.js:22`) · `WAR_RECOVERY_CONDITIONS = occupation_lifted, siege_lifted` (`:25`) · `WAR_VICTIM_CONDITIONS = war_pressure, vassal_extraction, rebellion` (`:34`) · `RELIEF_CONDITIONS = relief_burden, alliance_burden` (`:37`) · `WAR_LAYER_ARCHETYPES` = the union of all four (`:40-45`).
- **the trap:** the annex's five FAMILY pools **cross-cut** these groups. Its "war layer, aggressor side" adds `war_mobilization`, which `WAR_HOME_CONDITIONS` does not contain (`RECEIPT_POOLS_DOSSIER_STATE.md:4484` vs `archetypeCatalog.js:22`); its "recovery" family adds `corruption_exposed`, `coup_suppressed`, `government_overthrown`, `stressor_residual`, `trade_realignment` to a two-member engine set (`:4494` vs `archetypeCatalog.js:25`); its "occupation layer" includes `war_spoils`, which is a **benefit** (§5). The pools are dark today because `CONDITION_ARCHETYPE_TEMPLATES` carries no `family` field (`stressorsStateProse.js:338-352`) — but the door the desk describes ("add a `family` field … and this desk lights all five with no corpus work") would light **five prose families whose membership the engine's own groupings contradict**. This is wiring debt with a false-fact hazard attached.

### A10 · "counterforce" / "the strengths this crisis requires"

- **engine rows:** `STRESSOR_COUNTERFORCES` has a profile for **all 21** catalog types (`stressorDynamics.js:160-370`), but the `sources[]` differ per type and only **`siege` carries `requireAllFloors: true`** (`:171`). `floorsMet: false` therefore means something different for a siege (three conjunctive legs missed) than for every other type (the flag is false by default, `:157`).
- **the trap:** `COUNTERFORCE: floorsMet: false` prose says *"strong in most of what this demands and short in one part"* (`RECEIPT_POOLS_DOSSIER_STATE.md:4259`, pool header `:4258`) — a **conjunctive** reading that only `siege` earns. Dark today (`stressorsStateProse.js:391-395`); the hazard is at lighting.

---

## 7. WHAT IS ALREADY RIGHT (offered as the chair's positive exemplars)

| ruling | where | why it is the shape the owner asked for |
|---|---|---|
| *"`under_siege` entails a besieger and does not entail *who*, so no besieger is described"* | `RECEIPT_POOLS_DOSSIER_STATE.md:4066` | definitional entailment kept, agent identity refused — the exact split |
| *"Seven of the fifteen type words name a *transition* … The other eight name a *condition* and get plain description"* | `:4066` | a per-word entailment table, not a per-block rule |
| *"Severity is a float the prose never speaks"* | `:4222`, `:4402-4403` | a magnitude is not a word |
| the `{timeband_age}` refusal, with three independent measurements | `stressorsStateProse.js:296-336` | a slot whose every fill contradicts its sentence is refused |
| the `{reason}` refusal, "a desk inventing that vocabulary would be a lane ruling reader-facing prose" | `stressorsStateProse.js:277-291` | the fill vocabulary is a chair act |
| the five FAMILY pools left dark rather than served by a 46→5 guess | `stressorsStateProse.js:338-352` | classification is the producer's, never the display's |
| *"an unknown variant renders nothing rather than guessing an origin: a stressor's origin is a claim about who did this to the town, and the wrong one is the worst sentence this corpus could print"* | `stressorsStateProse.js:424-427` | fail-closed on identity |
| `crisisBannerPoolKey` keys on the token, never the label, *"because two of the fifteen labels differ from their pool key and a label route would darken them silently"* | `stressorsStateProse.js:148-155`; `OverviewTab.jsx:293-295` | the machine identity is the key; the English label is decoration |

---

## 8. OPEN QUESTIONS FOR THE CHAIR (not decided here)

1. **Does a siege entail walls?** The engine says no (walls are a probability/score modifier at `stressGenerator.js:123` and `stressorGates.js:446-447`); six variants across DS-STR-1 and DS-STR-2 say yes. If the answer is no, six variants need a rewrite and the desk needs a rule for the bare noun "walls".
2. **May a bare token license a civic object?** Today "the granary", "the market", "the watch", "the hall", "the altars", "the courthouse" all appear in variants whose whole reading is `token === X`. `objectClassesOf` only sees objects named in the **pool key** (`wiringCensus.js:1358`), so the restatement guard is blind to objects that live only in prose.
3. **`wartime`'s hidden coin.** 45 % of wartime towns are profiting (`stressNarrative.js:40-42`, `:145-152`). Do the WARTIME variants split, or drop the scarcity claims?
4. **DS-CND-1's direction lens on the display path.** The annex's E-3 protection is defeated by `deriveActiveCondition`'s status substitution (`activeConditions.js:644-646`) at the OverviewTab call site (`OverviewTab.jsx:186`). Cure options: read the RAW condition, or drop the motion claims from the direction variants. The engine's own comment already names the hazard (`activeConditions.js:894-901`).
5. **Polarity.** `reconstruction`, `boom` and `flourishing` are LIFTS (`archetypeCatalog.js:31`), and the SEVERITY and DIRECTION lenses compose on the same record (`stressorsStateProse.js:479-486`). A critical boom currently reads "the town is at its limit".
6. **`{reason}` is a landmine, not a gap.** Ruling a fill vocabulary lights the traced-provenance pool — whose only birth-time trace is `'GENERATION'` (`conditionPromotion.js:203-208`) — and prints *"The town knows exactly what did this."*
7. **DS-STR-2's anaphora.** The lifecycle and origin lines name no crisis, and the selector is `.find()` (`OverviewTab.jsx:129-132`). Does the desk owe a naming clause, or a same-crisis guard?
8. **The wind-down constant.** The desk's 25 % (`stressorsStateProse.js:259-266`, declared vetoable) versus the engine's fixed 2 ticks (`activeConditions.js:859`).
9. **The FAMILY door.** If a `family` field is added to `CONDITION_ARCHETYPE_TEMPLATES`, the five family pools light with membership the engine's own groupings contradict (§6, A9). The corpus text may need re-cutting before, not after.
