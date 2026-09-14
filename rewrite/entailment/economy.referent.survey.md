# REFERENT SURVEY — THE ECONOMY DESK (`DS-ECO-*` + `DS-SUP-*`)

Read-only dock: `scratchpad/laneRW-DEFW` @ `f2da5a3ee`. **Every `file:line` below was re-derived
in that tree**; ADDENDUM 11's own cites were re-checked one by one and the three that moved are
recorded in §1.5. Nothing was modified, staged or committed; no vitest, npm or build was run.
Node was used only to print: `scripts/prose-licence-card.mjs` (nine cards, §0c) and pure
`import` + `console.log` probes of frozen tables, the committed census JSON and the committed
generated leaf.

**THE QUESTION.** Not what a word MEANS (that is the sister packet,
`rewrite/entailment/economy.survey.md`) but WHAT IT POINTS AT: for every institution-class noun
this desk can render, which of BODY / HOLDER-ORGAN / POWER / ROLE the engine gives it, which
reads resolve to each layer, where the engine's own rows overlap, which typed slot names the
power, and which face may say it. **The law is not decided here.** Rows are evidence for the
chair's ADDENDUM 11.

**ONE-LINE VERDICT FOR THE CHAIR.** On this desk the referent law has a sharper bite than
ADDENDUM 11 anticipated, for three measured reasons: (1) **the POWER layer is authored and
dark** — `{faction}` is the only typed power slot the desk names and it is deliberately never
filled, so every face that tries to name a power is dropped by anchored liveness; (2) **the
HOLDER-ORGAN layer already has a ratified noun table in the engine** (`fieldSynonyms.js:77-90`),
and 16 of the desk's 31 distinct reads carry one while 15 carry none — the law can be stated in
the engine's own vocabulary instead of invented; (3) **the desk's one proper institution slot can
render a defense body**: `{institution}` on `DS-SUP-3` fills from a roster that contains
`Town watch`, `Professional city watch`, `Garrison`, `Barracks`, `Citizen militia`, `Town walls`
and `Citadel`, so the writer never chooses the noun and rule 5's "a face never uses *the watch*
for a pay-gate read" cannot be kept by a writer at all here.

---

## §0 DESK SCOPE — derived, not guessed

### §0a The block set, from the gate's own handling

`scripts/prose-wave-gate.mjs:346-375` (`poolRosterOf`) takes `--section <desk>` and reads
`SECTION_LEAVES[options.section]` (`:294-301`), refusing an unknown name with
"the six are …" (`:363`). The economy leaf is `DOSSIER_STATE_PROSE_ECONOMY` (`:296`), whose
prefixes are the projector's own (`scripts/generate-dossier-state-prose.mjs:108-109`:
`prefixes: ['DS-ECO-', 'DS-SUP-']`). `sectionsCoverEveryPool` (`prose-wave-gate.mjs:309`)
asserts the partition rather than trusting it.

⚠ `scripts/prose-wave-gate.mjs` is detected as a **binary** file by `grep` (`file` reports
"a /usr/bin/env node script executable (binary data)"); a plain `grep -n` over it returns
nothing at all. `grep -an` is required. Recorded because a lane that greps that file and
believes the silence will conclude the `--section` handling does not exist.

### §0b The fifteen blocks, by referent-bearing column

Census: `docs/content/wiring-census.json`, 105 of 708 rows. `stateOrgan` is emitted only where
true (`src/domain/prose/holderTable.js:557-560`); `covert` only where a read is on the frozen
covert list (`src/domain/prose/wiringCensus.js:1252-1259`, set at `:1681`).

| Block | RESOLVED / UNRESOLVED | holder kind(s) | state-organ rows | covert rows | slots NAMED | mount sites |
|---|---|---|---|---|---|---|
| DS-ECO-1 | 5 / 0 | — | 0 | 0 | access · complexity · settlement | `economics.prosperityHeader` |
| DS-ECO-2 | 7 / 0 | — | 0 | 0 | season · settlement | `economics.foodTile` · `economics.seasonTile` |
| DS-ECO-3 | 1 / 4 | — | 0 | 0 | settlement | `economics.tradeFlow` |
| DS-ECO-4 | 0 / 4 | — | 0 | 0 | good · settlement | **(none)** |
| DS-ECO-5 | 0 / 7 | — | 0 | 0 | chain · good · institution · resource · settlement | **(none)** |
| DS-SUP-1 | 0 / 6 | — | 0 | 0 | chain · good · institution · resource · settlement · timeband_since | **(none)** |
| DS-ECO-6 | 3 / 0 | **watch** | **3** | 0 | **faction** · settlement | `economics.shadowEconomy` |
| DS-ECO-7 | 0 / 2 | — | 0 | 0 | settlement | **(none)** |
| DS-ECO-8 | 0 / 7 | — | 0 | 0 | settlement | `daily_life.standingOfLiving` · `economics.economyTile` |
| DS-ECO-9 | 2 / 6 | **toll-bar** | 0 | 0 | settlement | `economics.foodSecurity` |
| DS-SUP-2 | 0 / 7 | — | 0 | 0 | chain · **faction** · institution · settlement | **(none)** |
| DS-ECO-10 | 6 / 4 | **market** | 0 | 0 | access · good · settlement | `economics.exportPosture` |
| DS-ECO-11 | 14 / 3 | **market** | 0 | 0 | chain · good · **institution** · resource · settlement | `resources.groundAndWorkings` |
| DS-ECO-12 | 10 / 0 | **treasury + market** | **5** | 0 | **faction** · good · settlement | `economics.commercialProfile` |
| DS-SUP-3 | 7 / 0 | — | 0 | 0 | **institution** · settlement | `services.catalogStanding` |

Totals: **55 RESOLVED · 50 WIRING-UNRESOLVED · 8 state-organ rows · 0 covert rows**.
Five blocks (`DS-ECO-4`, `-5`, `-7`, `DS-SUP-1`, `DS-SUP-2`) have **no mount site at all** —
authored, unmounted; their referent rows below are marked *authored-only*.

### §0c Licence cards printed — nine pools, seven blocks, four holder kinds

`node scripts/prose-licence-card.mjs <block> '<pool>'` run in the dock. The `source:` line is
`scripts/lib/prose-licence-card.mjs:329-338` (`sourceText`); the state-organ clause is `:333`;
the refusal clause for an unlicensed standing is `:337` ("NO citation is licensed: a face naming
a record holder here is refused by arm A13").

| # | Block :: pool | card `source:` | card `audience:` | card `covert:` | slot line |
|---|---|---|---|---|---|
| 1 | DS-ECO-6 :: `TIER: a large share off the books (≥30)` | **watch** · LICENSED · **a STATE ORGAN (interested where the town is captured)** | player (no mark) · marks in this pool: **dm-only** | no | NAMED BUT NEVER FILLED: **{faction}** |
| 2 | DS-ECO-12 :: `INCOME MIX: a criminal line is present` | **treasury** · LICENSED · **a STATE ORGAN** | player (no mark) · marks: **dm-only** | no | NAMED BUT NEVER FILLED: **{faction}** |
| 3 | DS-ECO-12 :: `INCOME MIX: the criminal line leads` | **treasury** · LICENSED · **a STATE ORGAN** | player (no mark) · marks: **dm-only** | no | (no unfilled slot: no variant names `{faction}`) |
| 4 | DS-ECO-12 :: `TRADE PROFILE: isEntrepot…` | **market** · LICENSED | player (no mark) | no | may NOT … another civic object of the class `market` |
| 5 | DS-ECO-9 :: `BLOCKADED` | **toll-bar** · LICENSED | player (no mark) | no | — |
| 6 | DS-ECO-9 :: `BLOCKADE BYPASSED` | **toll-bar** · LICENSED | player (no mark) · marks: **dm-only** | no | — |
| 7 | DS-ECO-10 :: `POSTURE: vulnerable` | **market** · LICENSED | player (no mark) | no | — |
| 8 | DS-ECO-11 :: `ECONOMIC STRENGTHS: the roster is populated` | **market** · LICENSED | player (no mark) | no | — |
| 9 | DS-ECO-11 :: `EXPLOITATION: partiallyExploited` | **(none)** · SOURCE-UNRESOLVED | player (no mark) | no | NAMED BUT NEVER FILLED: **{chain}** |
| 9b | DS-SUP-3 :: `A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED` | **(none)** · SOURCE-UNRESOLVED | player (no mark) | no | bag `{institution: proper, settlement: proper}` |

**The card does not yet print a referent layer.** It prints the holder KIND and the standing;
the BODY/ORGAN/ROLE distinction ADDENDUM 11 rule 2 asks for is not a column anywhere. That is
the instrument debt the law creates (§8).

---

## §1 THE FOUR LAYERS AS THE ENGINE TYPES THEM — re-derived at `f2da5a3ee`

### §1.1 BODY — an institution row

| Row | Where | What it gives |
|---|---|---|
| the roster | `settlement.institutions[]`, live filter `src/domain/institutions/institutionRoster.js` via `liveInstitutions` (imported at `src/domain/prose/holderTable.js:51`) | the recorded NAME; a ruined institution is filtered out |
| the defense buckets | `src/domain/institutions/defenseInstitutionBuckets.js:83-107` — walls `:84-87` · garrison `:88-91` · militia `:92-94` · watch `:95-97` · mercenary `:98-100` · charter `:101-104` · **magicDef `:105-111`** | six buckets + a seventh ADDENDUM 11 does not list |
| the engine's own alias overlap | `'professional city watch'` appears at **`:90` (garrison)** and **`:96` (watch)** | one recorded name, two buckets |
| the catalog | `src/data/institutionServices.js` (285 houses) | the service rows a body offers |

⚠ **ADDENDUM 11 says six buckets; the table has seven.** `magicDef`
(`defenseInstitutionBuckets.js:105-111`: wizard · mages' guild · mage · academy of magic ·
golem workforce · **alchemist**) is a bucket too, and it matters to this desk because
`Alchemist shop` is `processingInstitutions[0]` of the `mineralHot` chain
(`src/data/resourceChains.js`) and therefore a `{institution}` fill on DS-ECO-11. So the desk's
own economy slot can render a DEFENSE-bucket body without any defense read.

### §1.2 HOLDER-ORGAN — the keeper of the record

| Row | Where |
|---|---|
| the twelve kinds | `src/domain/prose/holderTable.js:78-83` — treasury · muster · census · parish · toll-bar · market · watch · court · elders · tradition · road · office |
| the office kind | `:84` |
| the three register standings | `:87` `LICENSED` · `OFFICE` · `SOURCE-UNRESOLVED` |
| the fourth a town adds | `:90` `INTERESTED` |
| **the state's own organs** | `:115` `STATE_ORGAN_KINDS = ['office','court','treasury','watch']` |
| field → kind | `:164-240` (`HOLDER_SOURCES`) |
| kind → this town's institution | `:271-366` (`HOLDER_RECORDS`), resolved by `holdersOf` `:599` |
| the standing | `standingOf` `:642-713` |
| **the muster is the paid military** | `:188-199`: walls `:188` · garrison `:189` · militia `:190` · mercenary `:191` · charter `:192` (+ force `:193`, magicDependency `:194`, economicGates `:195`, besiegedBy/besiegingTargets `:196-197`, ticksToDeploy `:198`, stretchedThin `:199`) |
| **the watch is the order organ** | `:202-212`: the `watch` token row `:203-209`, blackMarketCapture `:210`, criminalCaptureState `:211`, safetyProfile `:212` |
| **the watch token's own note** | `:206-208`: the watch bucket "sits beside the garrison and the militia in the DEFENCE table", and the token is mapped to the WATCH "rather than to the muster on the ruling's own grain" |
| ⭐ **the record NOUNS per kind** | `src/domain/prose/fieldSynonyms.js:77-90` — treasury `books · purse · chest` `:78`; muster `roll · rolls · muster` `:79`; census `roll · rolls · count` `:80`; parish `register · book · books` `:81`; toll-bar `book · books · toll` `:82`; market `book · books · stall` `:83`; **watch `roll · rolls · watch` `:84`**; court `roll · rolls · record` `:85`; elders/tradition `word · memory` `:86-87`; road `book · books` `:88`; office `book · books · record` `:89` |
| the noun column is a REPORT | `fieldSynonyms.js:42-45`: "it widens what arm Q, F25 and A0b can SEE; **it licenses nothing on its own**" |

⭐ **THE SINGLE MOST USEFUL FACT THIS SURVEY FOUND.** The engine already answers "which word may
name the organ" — `HOLDER_KIND_NOUN_ROWS`. ADDENDUM 11's law can name it instead of minting a
vocabulary. §3.3 gives the economy desk's whole table from it.

⚠ **Three holder rows were drafted and WITHDRAWN**, and one of them is this desk's central noun:
`holderTable.js:157-161` — **`granary`** ("its only writers are a prose phrase map and a binding
counter, neither of which keeps a store's record"), `church`, `ledger` ("seven writers … the
token names no one holder"). So *the granary* and *the ledger* are on the record as words that
name NO holder in this engine.

⛔ **`holdersOf` / `standingOf` / `sourceOfForTown` have NO product caller.** Grepped over
`src/**/*.js,jsx`: the only hits outside `holderTable.js` itself are the census docblock
(`wiringCensus.js:518-519`). So on this desk the HOLDER-ORGAN layer exists **in the register
only**: no rendered face can resolve "the market's own books" to an institution at draw time.

### §1.3 POWER — a typed standing over an organ

| Row | Where | Reaches this desk? |
|---|---|---|
| the settlement-wide capture ladder | `powerStructure.criminalCaptureState`, written `src/generators/power/rulingStructure.js:797`; rolled up from factions by `src/domain/worldPulse/factionCapture.js:136` (`settlementCaptureState`, ladder `none · adversarial · equilibrium · corrupted · capture`) | **indirectly**: mapped to the WATCH kind (`holderTable.js:211`), but **no economy pool reads it** |
| the per-faction capture | `powerStructure.factions[].captureState`, read by `capturedRulingStructure` `holderTable.js:129-143` | same |
| INTERESTED, and the four organs it reaches | `standingOf` `:674-694`; `interested` computed `:709-710`; organ gate `:676` | **yes — 8 rows**: DS-ECO-6 ×3 (watch), DS-ECO-12 income-mix ×5 (treasury) |
| a per-institution corruption impairment | `src/domain/corruption.js:630` `SECURITY_INSTITUTION_RE = /(watch|garrison|constab|guard|magistrate|court|barracks)/i`; `compromisedSecurityInstitutions` `:662-692`; **covert vs revealed** `:675-681` | **no economy read**, but the economy `{institution}` slot can name a body inside that regex (§3.1) |
| a brokerage house's patron | `src/domain/worldPulse/brokeragePatronage.js:60` `['genesis','captured']`; visibility rule `:304-311` | **no economy read** |
| the power is a NAME, not a noun | `rulingStructure.js:787` `governingName`, `:792` `government`; the typed faction labels are pushed at `:457` (the governing faction), `:506` (`Merchant Guilds` / `Merchant Guilds (dominant)`), `:565` (the noble label), **`:596` `'Military/Guard'`**, `:638` `'Religious Authorities'`, **`:647` `'Craft Guilds'`**, **`:671` `"Thieves' Guild"`**, `:682` `'Arcane Orders'` | the `{faction}` slot is `proper` and **never filled** (§3.1) |

### §1.4 ROLE — never a person, and on this desk never read

| Row | Where |
|---|---|
| there is no typed NPC→institution edge | `holderTable.js:31-35`; `institutionTable.js:129-138` — `COLUMN_SOURCES.holderRole` is one row, `read: false`, note "none exists; `npcProfile.js:341-353` infers a link by name regex and this module does not call it" |
| what a role IS, typed | `officesOf` `institutionTable.js:377-397`: `npc.role`, `npc.title`, plus the governing seat's designation (`rulingPower.js:224-230` `governingFactionOf`) |
| the engine's own body/role/power split, in its own words | `rulingStructure.js:592-595`, the `Military/Guard` faction desc: "these are the soldiers and watchmen, **not the officers who govern**" |

⛔ **No economy read touches `npcs` at all** (31 distinct reads, §2). The ROLE layer is
reachable in the engine and **unreached by this desk**. Every role-shaped word in the desk's
shipped prose (§3.4) is therefore an authored device, not a read.

### §1.5 ADDENDUM 11's cites, re-derived — three corrections

| ADDENDUM 11 says | At `f2da5a3ee` | Verdict |
|---|---|---|
| `defenseInstitutionBuckets.js:83-104` — six buckets | `:83-107`; **seven** buckets, `magicDef` at `:105-111` | **amend**: the seventh bucket exists and reaches this desk through `Alchemist shop` |
| `holderTable.js:78` HOLDER_KINDS | `:78-83` (the list spans six lines) | exact |
| `holderTable.js:115` STATE_ORGAN_KINDS | `:115` | exact |
| `holderTable.js:188-192` the muster members | `:188-192` walls/garrison/militia/mercenary/charter | exact |
| `holderTable.js:210-212` the watch's order records | `:210-212` | exact |
| `holderTable.js:129-143` capturedRulingStructure | `:129-143` | exact |
| `factionCapture.js:136` | `:136` `settlementCaptureState` | exact |
| `corruption.js:630` SECURITY_INSTITUTION_RE | `src/domain/corruption.js:630` (**not** `worldPulse/`) | **path correction** |
| `corruption.js:655-680` covert/revealed | the loop is `:675-681` inside `compromisedSecurityInstitutions` `:662-692` | **line correction** |
| `brokeragePatronage.js:60` | `:60` | exact |
| `holderTable.js:32-36` holderRole null | the claim is `:31-35`; the DATA is `institutionTable.js:129-138` | **amend**: cite the data, not only the docblock |

---

## §2 THE DESK'S READS BY REFERENT LAYER — all 31 distinct reads

`reads` from the committed census; `kind` from `source.fields`; **nouns** from the census's own
`fieldSynonyms` column (generated by `fieldSynonymsFor`, `fieldSynonyms.js:115-128`).
**LAYER** is this surveyor's classification against ADDENDUM 11 rule 1, offered as evidence.

| Read (census spelling) | holder kind | organ? | ratified record nouns | LAYER of the read | pools |
|---|---|---|---|---|---|
| `rank` | — | — | **none** | BODY (a standing condition of the town) | DS-ECO-1 ×5 |
| `foodBalance` · `.available` · `.deficit` · `.surplus` | — | — | **none** | BODY | DS-ECO-2 ×3 |
| `granary` · `.available` · `.band` | — | — | **none** | BODY (a STOCK, not the house) | DS-ECO-2 ×4 |
| `readings.flowDrift.band` | — | — | **none** | BODY | DS-ECO-3 `ADEQUATE` |
| **`eco.safetyProfile.blackMarketCapture`** | **watch** | **yes** | **roll · rolls · watch** | **ORGAN-UNDER-POWER** | DS-ECO-6 ×3 |
| `eco.foodSecurity.stockpile` · `.blockaded` · `.blockadeBypass` | **toll-bar** | — | book · books · toll | BODY, cited to an organ | DS-ECO-9 ×2 |
| `readings.exportPosture.status` | **market** | — | book · books · stall | BODY, cited to an organ | DS-ECO-10 ×6 |
| `text(terrainKey) (via TERRAIN_POOL_BY_KEY …)` | — | — | **none** | BODY (the ground) | DS-ECO-11 ×7 |
| `analysis.economicStrengths` | **market** | — | book · books · stall | BODY | DS-ECO-11 ×2 |
| `analysis.strategicValue` | **market** | — | book · books · stall | BODY | DS-ECO-11 ×1 |
| `leading.bucket` · `leading.row` | — | — | **none** | BODY | DS-ECO-11 ×4 |
| **`eco.incomeSources`** · `.length` · `.reduce` · `.filter` | **treasury** | **yes** | **books · chest · purse** | **ORGAN-UNDER-POWER** | DS-ECO-12 ×5 |
| `eco` (not-produced) · `.isEntrepot` · `.localProduction` · `.primaryExports` · `.primaryImports` | **market** (`eco` itself unresolved) | — | book · books · stall | BODY | DS-ECO-12 ×5 |
| `readings.notableAbsences` · `.map` | — | — | **none** | BODY (an absence against a tier) | DS-SUP-3 ×6 |
| `readings.impairedInstitution` (**not-produced**) | — | — | **none** | BODY | DS-SUP-3 ×1 |
| **(no reads at all)** | — | — | — | — | **50 WIRING-UNRESOLVED rows** |

**16 of 31 reads carry a ratified organ noun; 15 carry none.**
**Exactly one read on this desk carries `watch` as a ratified noun**:
`eco.safetyProfile.blackMarketCapture`. Everywhere else on the economy desk, "the watch" names
nothing the read holds.

⚠ **A WIRING FINDING, NEW.** DS-ECO-11's seven terrain pools read the local alias **`terrainKey`**,
not `terrainType`. `holderKindOfField` (`holderTable.js:157`/`:446-455`) walks the read's own
segments right-to-left against `HOLDER_SOURCES`, and `terrainType` **is** a row (`:233`, kind
`road`) while `terrainKey` is not. One spelling loses the ROAD holder on seven RESOLVED pools
— the census prints `fields: {"terrainKey": ""}` and `SOURCE-UNRESOLVED`. If the chair wants the
terrain pools to be able to name a record at all, this is a one-token register-car repair.

---

## §3 EVERY INSTITUTION-CLASS NOUN THE DESK CAN RENDER

### §3.1 SLOT-BORNE nouns — what the engine puts in the sentence

| Slot | Shape · fill site | Members the engine can supply | LAYERS the member carries | Engine's own overlap | Typed slot that names a power | Always-safe class word |
|---|---|---|---|---|---|---|
| **`{institution}`** (DS-ECO-11 exploitation lens) | `proper` · `economyStateProse.js:991` ← `leading.row.processingInstitutions[0]`; `properFill` refuses digits (`:326-329`, measured 1 of 25 refused: `Bakers (5-15)`) | 16 distinct, probed from `src/data/resourceChains.js`: **Alchemist shop · Apothecary · Butcher · Caravanserai · Fishmonger · Glassblower · Market · Mill · Mine · Potter · Salt works · Sawmill · Stone quarry · Tannery · Vintner · Weavers' guild** | **BODY only** — a chain house. None is a HOLDER_RECORDS institution for any kind except **Market square**-adjacent `Market` | **`Alchemist shop`** matches the `magicDef` defense bucket (`defenseInstitutionBuckets.js:105-111`); **`Weavers' guild`** fires `hasGuild` (`priorityHelpers.js:57`) which also fires on `Thieves' guild`; **`Market`** collides with the `market` HOLDER KIND and the `market` civic class (`wiringCensus.js:1310`) | none (a chain house has no patron field read here) | *the workings* · *the house* |
| **`{institution}`** (DS-SUP-3 impaired lens) | `proper` · `economyStateProse.js:999` ← `readings.impairedInstitution`, passed in from `ServicesTab.jsx:95-99` off `computeChainSets` (`tabHelpers.js:4-57`) | **any key of `TRADE_DEPENDENCY_NEEDS`** (`src/data/economicData.js:9`, **65 keys**) that carries a rendered service row — including **`Citizen militia` · `Town watch` · `Professional city watch` · `Barracks` · `Garrison` · `Multiple garrisons` · `Free company hall` · `Mercenary quarter` · `Town walls` · `City walls and gates` · `Massive walls and fortifications` · `Citadel`** | ⛔ **BODY + HOLDER-ORGAN + POWER-ELIGIBLE at once** for the watch rows: a defense bucket body (`defenseInstitutionBuckets.js:88-97`), the two roster institutions that keep the **watch** kind's record (`holderTable.js:318-324`), and inside `SECURITY_INSTITUTION_RE` (`corruption.js:630`) so they can carry a covert or revealed corruption impairment | **the whole ADDENDUM 11 §5 overlap, arriving through a slot**: `professional city watch` in the garrison bucket `:90` AND the watch bucket `:96`; the WATCH holder kind that is not the watch bucket | none read | ⚠ **there is none** — the slot renders a proper name and the writer cannot substitute a class word |
| **`{faction}`** | `proper` · **DELIBERATELY UNFILLED**, `economyStateProse.js:910-921` | would be `powerStructure.factions[].faction`: the governing label (`rulingStructure.js:457`), `Merchant Guilds` `:506`, the noble label `:565`, **`Military/Guard` `:596`**, `Religious Authorities` `:638`, **`Craft Guilds` `:647`**, **`Thieves' Guild` `:671`**, `Arcane Orders` `:682` | **POWER** (a `proper`-typed name) | **`Military/Guard`** contains the garrison bucket's body word *guard*; **`Craft Guilds`** and **`Thieves' Guild`** both fire `hasGuild` (`priorityHelpers.js:57`) | **this IS the typed slot** — and it is dark | *the part of it nobody writes down* (what the corpus already uses) |
| `{access}` | `bare-common` · `economyStateProse.js:901` | road · river · port · crossroads · pass (`ACCESS_NOUN` `:173-179`) | not institution-class; **`road` is also a HOLDER KIND** (`holderTable.js:233-234`, resolving to `Listening post` / `Waystation` `:350-356`) | the word *road* is a route, a holder kind and a civic class (`wiringCensus.js:1313`) | none | *the approach* |
| `{settlement}` · `{complexity}` · `{season}` · `{good}` · `{resource}` · `{chain}` · `{timeband_since}` | — | — | **not institution-class**; see the sister packet §1 | — | — | — |

⭐ **THE SHARPEST ROW ON THE DESK.** `DS-SUP-3 :: A CATEGORY PRESENT BUT ITS CHAIN IMPAIRED` is
RESOLVED, mounted at `services.catalogStanding`, `SOURCE-UNRESOLVED`, player-audible, and its
`{institution}` can be **`Town watch`**. The chain runs:
`TRADE_DEPENDENCY_NEEDS['Town watch'] = {resources:['iron_deposits'], label:'Iron', svcs:['law enforcement','patrol','gate control']}`
(`economicData.js:9`ff) → `economicState.js:712-720` pushes the dependency with
`institution: 'Town watch'` → `tabHelpers.js:38-45` adds the name to `impaired` →
`serviceCategoryTables.js:40-44` files `Town watch`, `Professional city watch`,
`Citizen militia`, `Garrison`, `Barracks` under the **`employment`** category →
`ServicesTab.jsx:88` builds `catOrder` from **every rendered category** (not the expected list,
`servicesDisplay.js:15-22`) → `:95-99` picks the first impaired house by codepoint →
`economyDeskRead.js:109` hands it to the desk → `economyStateProse.js:999` fills the slot.
So the economy desk can print the WATCH as a BODY, on a supply read, on the player page, with no
citation licensed, and **no writer chose the noun**.

### §3.2 BAKED common nouns in the shipped rows — the desk's own institution words

Extracted exhaustively from the 355 authored lines of the desk's annex range
(`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:792-1760`), then classified. The governing fence
is `RECEIPT_POOLS_DOSSIER_STATE.md:136` — "Every proper noun is a slot; nothing is baked" — which
leaves every row below a COMMON noun and therefore lawful *as spelling*; the question here is
what it POINTS AT.

| Baked noun | Occurrences · where | Engine rows it can name (file:line) | LAYERS | Does any read of the pool carry it? | Safe class word for the layer |
|---|---|---|---|---|---|
| **the granary** | 13 (DS-ECO-2 ×12, DS-ECO-9 `BLOCKADED` ×1) | (a) the STOCK band `dossierViewModel.js:336`; (b) the BUILDING flag `hasGranary: hasAny(names,['granar'])` `priorityHelpers.js:63`; (c) three capacity rows keyed on the name + a no-granary fallback `foodStockpile.js:185-195`; (d) the chain house `Town granary` / `Granary` (`resourceChains.js`); (e) the `storehouse` civic class `wiringCensus.js:1322` | **BODY** (b,d) vs **a reading that is not a body at all** (a,c) | DS-ECO-2's reads are `granary.band` etc — the **stock**. The BUILDING is never read. **`granary` was withdrawn as a holder row** (`holderTable.js:157-159`) | *the stores* · *what the town holds back* (the `store` class, `wiringCensus.js:1309`) |
| **the market** | 22 + `markets` ×2 (DS-ECO-1, -3, -4, -9, -10, -12) | (a) the `market` HOLDER KIND, services `['Weekly market','Public auctions']`, one shipped institution: `Market square` (`holderTable.js:311-317`); (b) the institution `Weekly market`, which is a **treasury** holder by `Tax collection` (`:272-279`); (c) `hasMarket` substring incl. bazaar/fair/exchange (`priorityHelpers.js:56`); (d) the `market` civic class (`wiringCensus.js:1310`); (e) the chain house `Market` | **HOLDER-ORGAN** (a,b) and **BODY** (c,e) and a **civic class** (d) | DS-ECO-10 and DS-ECO-12 reads ARE market-kind (`holderTable.js:172-180`) — so *the market* is on-organ there. DS-ECO-3 and DS-ECO-4 are `SOURCE-UNRESOLVED`/unwired | *the trade* · *what the town trades*; the ratified organ nouns are **book · books · stall** (`fieldSynonyms.js:83`) |
| **its mill** | 1 (DS-ECO-11 `TERRAIN: River` v1) | grain `Mill` / `Mills (2-5)`; `Fulling mill` (cloth); `Sawmill` (timber); the terrain institution `Mill` (`geographyData.js:170`); the RESOURCE `river_mills`, typed **`infrastructure`** (`resourceSemantics.js`); the `craft` civic class token `mill` (`wiringCensus.js:1316`); ⚠ `storageCapacityMonths` does `has('mill')` as a **substring** and multiplies capacity by 1.25 (`foodStockpile.js:194`) | **BODY** (all rows) | **no** — the pool's read is `text(terrainKey)`, `SOURCE-UNRESOLVED` | *the workings* |
| **the guilds / a guild** | 3 (DS-ECO-6 ≥30 v4 ×2; the ≥15 canonical) | `hasGuild` on the bare token (`priorityHelpers.js:57`), firing on `Thieves' guild`, `Mages' guild`; `hasMerchantGuild` separate (`:58`); the `craft` civic class (`wiringCensus.js:1316`); the chain guilds (`resourceChains.js`); **and the typed FACTIONS `Craft Guilds` (`rulingStructure.js:647`) and `Merchant Guilds` (`:506`)** | **BODY** and **POWER** at once, split across unlike rows | **no** — DS-ECO-6 reads `blackMarketCapture` only | *the trades* · *the craft houses*; where a POWER is meant, **the `{faction}` slot** |
| **the hall / the halls** | 5 (DS-ECO-1 C2 v1; DS-ECO-8 ×2; DS-SUP-3 mentions; **DS-ECO-12 v3 "dictate to the hall"**) | the `hall` civic class: hall · council · charter · seat · office · chamber · moot (`wiringCensus.js:1314`); the **court** holder kind's institutions `Courthouse` / `Multiple court buildings` (`holderTable.js:325-331`); `Town hall` is a **treasury** and an **office** holder (`:272-279`, `:357-364`) | **BODY** (a building) and **HOLDER-ORGAN** (court/office/treasury) and, in "dictate to the hall", **POWER** (the seat) | DS-ECO-12's read is `eco.incomeSources` → **treasury**. "the hall" as the SEAT is the court/ruling layer — a different organ | *the town's own reckoning* for the treasury; **the ruling structure** for the seat |
| **the gates / the gate / the gate returns** | 5 (DS-ECO-3 v1; DS-SUP-1; DS-ECO-8; DS-ECO-11) | `Gates (if walled)` is a **toll-bar** holder (`holderTable.js:304-310`); `gate` is a token of the **wall** civic class (`wiringCensus.js:1302`); `gate control` is a `Town watch` service (`economicData.js`, `svcs`) | **BODY** (the wall) and **HOLDER-ORGAN** (toll-bar) | DS-ECO-3's `SHORTAGE × trade-dependent` has **no reads at all** (WIRING-UNRESOLVED) | the toll-bar's ratified nouns are **book · books · toll** (`fieldSynonyms.js:82`) — *returns* is not among them |
| **the walls / a wall** | 5 (DS-ECO-3 v1; DS-ECO-8 v2; DS-ECO-9 `BLOCKADED` v1; DS-ECO-11 `Tundra`; DS-ECO-12) | the `walls` defense bucket (`defenseInstitutionBuckets.js:84-87`); the **muster** holder kind's `walls` token (`holderTable.js:188`); the `wall` civic class (`wiringCensus.js:1302`) | **BODY**, and a **MUSTER** field token | **no economy read is a walls read** | *inside the town* (the corpus's own "inside the walls" is a place phrase, not a body claim) |
| **its watch** | **1** — DS-ECO-11 `TERRAIN: Forest` v2 | the watch defense bucket (`defenseInstitutionBuckets.js:95-97`); the **watch** HOLDER KIND (`holderTable.js:203-212`), a **STATE ORGAN** (`:115`); `hasWatch` (`priorityHelpers.js:48`); `hasMilitaryInst` on the bare token `watch` (`:45`); the `force` civic class (`wiringCensus.js:1303`) | ⛔ **BODY + HOLDER-ORGAN + STATE ORGAN**, the exact three-way word ADDENDUM 11 names | **no** — the pool reads `text(terrainKey)`, and `terrainKey` resolves to no kind; the ratified noun set for that read is **empty** | *whoever keeps the peace here*; the class word for the paid military is **the muster** |
| **the warehouses · the workshops · the workshop** | 4 (DS-ECO-5 ×2, DS-SUP-1, DS-SUP-2 `SCARCE`) | `storehouse` civic class (`wiringCensus.js:1322`); `craft` civic class token `workshop` (`:1316`); chain houses `Artisan workshop`, `Linen workshop` (`resourceChains.js`) | **BODY** | **no** — every one is in a WIRING-UNRESOLVED pool (authored-only) | *the workings* |
| **the yard / the yards** | 6 (DS-ECO-3, DS-ECO-5 ×2, DS-SUP-1, DS-ECO-10, DS-ECO-12) | `yard` is a token of the **`craft`** civic class (`wiringCensus.js:1316`); the chain house `Stable yard` | **BODY** | DS-ECO-10 `established` v2 and DS-ECO-12 v3 are market-kind reads; the rest are unwired | *the yard* is safe as a place; as a house it is the craft class |
| **the stalls / a stall** | 5 (DS-ECO-3, DS-ECO-4, DS-ECO-8, DS-ECO-12) | **`stall` is the market kind's own ratified record noun** (`fieldSynonyms.js:83`) | **HOLDER-ORGAN** (surprisingly) and BODY | DS-ECO-12 v3 (`market`) and DS-ECO-10 — yes. DS-ECO-3, DS-ECO-4, DS-ECO-8 — no | *the stall* IS the market's safe word where the read is market-kind |
| **the house / a house / house of healing** | 5 (DS-ECO-5, DS-ECO-7, DS-SUP-3 ×3) | the `care` civic class: hospital · infirmary · healer · medical · physician · ward (`wiringCensus.js:1315`); the catalog houses `Small hospital` / `Major hospital` / `Hospital network` / `Healer (divine, 1st level)` (`economicData.js`) | **BODY** | DS-SUP-3's reads are `readings.notableAbsences` — a CATEGORY absence, not a house. **`healing` is a category key**, `servicesDisplay.js:25-30` | *what a place this size is expected to offer* (the category word) |
| **the quarter** | 1 (DS-SUP-3 metropolis v2) | catalog houses `Sage's quarter`, `Luxury goods quarter`, `Alchemist quarter`, `Mercenary quarter`, `Mages' district` (`economicData.js`) | **BODY** | no | *which part of the town* |
| **the workings** | 4 (DS-SUP-1 ×2, DS-ECO-11, DS-SUP-2 clause) | no engine row at all — an authored class word | **none** (deliberately) | n/a | ⭐ already the desk's safe generic |
| **the stores** | 19 | the `store` civic class: stores · reserve · reserves · stock · larder · harvest (`wiringCensus.js:1309`) | **not institution-class** — a stock word | DS-ECO-2 and DS-ECO-9 read the stock | ⭐ already safe |

### §3.3 HOLDER-ORGAN RECORD WORDS — against the engine's own ratified table

The engine's answer is `HOLDER_KIND_NOUN_ROWS` (`fieldSynonyms.js:77-90`), applied per read by
`fieldSynonymsFor` (`:115-128`) and committed as the census's `fieldSynonyms` column. "ON-ORGAN"
below means the word is in the ratified set for that pool's own read.

| Record word | Occurrences on this desk | Ratified for which kind | Pools where it is ON-ORGAN | Pools where it names a record the census gives no holder for |
|---|---|---|---|---|
| **the books** | 8 (DS-ECO-1 ×3, DS-ECO-3 ×2, DS-ECO-5, DS-ECO-8, DS-ECO-12) | treasury `:78` · parish `:81` · toll-bar `:82` · market `:83` · road `:88` · office `:89` | DS-ECO-12 `INCOME MIX` (treasury); DS-ECO-12 `TRADE PROFILE` (market) | **DS-ECO-1** (`rank`, no nouns) · **DS-ECO-3** (`flowDrift.band` / unwired) · **DS-ECO-8** (no reads) · **DS-ECO-5** (unwired) |
| **the accounts** | 8 (DS-ECO-1, -2, -3, -8 ×3, -10, -11) | ⚠ **not a ratified noun for any kind** | — | all eight |
| **the ledgers / a ledger** | 2 (DS-ECO-3 v1; DS-ECO-6 ≥30 v1) | ⚠ **not ratified**; and `ledger` was explicitly **withdrawn as a holder token** (`holderTable.js:160-161`) | — | both |
| **the rolls** | 3 (DS-SUP-1 `RESOURCE DEPLETED` v1; DS-SUP-2 `BLOCKED` v1; **DS-ECO-6 ≥15 v1**) | muster `:79` · census `:80` · **watch `:84`** · court `:85` | ⭐ **DS-ECO-6 ≥15 v1 IS on-organ** — `blackMarketCapture` → watch, nouns `roll · rolls · watch` | DS-SUP-1 and DS-SUP-2 (both unwired; the natural kind there would be `market`, whose nouns are book · books · **stall**, not roll) |
| **the returns** | 2 (DS-ECO-3 v1 "the gate returns"; DS-ECO-9 `BLOCKADE BYPASSED` v2) | ⚠ **not ratified for any kind** | — | DS-ECO-3 (no reads at all). DS-ECO-9's **organ is right** (toll-bar) but the **noun is not ratified** — *toll* is (`:82`) |
| **the duties** | 3 (DS-ECO-6 ≥30 v1, ≥15 v1, the ≥15 canonical) | the duty vocabulary is `DUTY_SERVICE_KINDS` (`institutionTable.js:106`: tithes · dues · taxes · taxation · **tolls** · customs · records · registers · census · levies · musters · rolls); the toll-bar holder's services are `Toll collection` · `Customs brokerage` · `Market charter and tolls` (`holderTable.js:304-310`) | — | all three: DS-ECO-6's only licensed holder is **watch**, whose `dutyNamed` count is **0** (`holderTable.js:318-324`) |
| **fees / a licence** | 3 (DS-ECO-6 ≥15 canonical, ≥15 v3, ≥3 v2) | the market kind's charter services are the toll-bar's (`Market charter and tolls`, `:304-310`) | — | all three (watch-kind reads) |
| **the survey** | 8 (DS-ECO-7 ×6, DS-ECO-10 caveat ×2) | the **office** kind is the compiling record itself (`holderTable.js:84`, `:357-364`), and a citation on it is **a finding**, not a licence (`:362-364`; arm A13's OFFICE limb, `composedWalker.js:1066-1069`) | — | all eight — but this is the honesty device the annex intends, not a holder claim |
| **the counts / the count** | 11 | census kind `count` `:80` | — | no economy read is census-kind |
| **the purse / the chest** | 0 | treasury `:78` | — | ⚠ **unused**: the two words the engine ratifies for the treasury appear nowhere in the desk's 355 lines, while `books`/`accounts` (one ratified, one not) carry the whole load |

⚠ **The `[ledger]` ANGLE names the same words as a STANDPOINT.** The annex's angle palette
(`RECEIPT_POOLS_DOSSIER_STATE.md:120-128`) defines `[ledger]` at `:122` as
"the clerk's view — what the books, rolls and counts show". So the desk has **two** authorities
over the same three nouns: an angle that licenses them as a point of view, and a census column
that licenses them as a record citation. Arm A13 counts a PROVENANCE move on the text
(`composedWalker.js:1018-1020`, `:1045-1051`) without asking which authority the writer meant.
**This is the chair's to rule on** (§8, Q1).

### §3.4 ROLE WORDS — every one, and none of them read

No economy read touches `settlement.npcs`, so `officesOf` (`institutionTable.js:377-397`) is
unreached and `COLUMN_SOURCES.holderRole` is the measured null (`:129-138`).

| Role word | Occurrences · where | Engine row behind it | LAYER | Notes for the refuters |
|---|---|---|---|---|
| **a stranger** | **42** — every `[visitor]` variant of the desk | none | a **narrative standpoint**, not a role | ⛔ If rule 2's "a captain doing anything on any read" is read literally as *a person doing anything*, **the entire `[visitor]` angle of this desk fails**, on every block. The angle is authored law (`RECEIPT_POOLS_DOSSIER_STATE.md:124`: "what a stranger notices first, without being told"). §8 Q2 |
| **the crier** | 5 (DS-ECO-4 ×5) | `CRIER_FRAMES`, `src/domain/display/marketPrices.js:228-239` — an authored **copy table**, not an office | a role word with a **copy** behind it, not a record | DS-ECO-4 is WIRING-UNRESOLVED (no reads, no mount). The crier line is quoted in-world speech in a different register (annex `:951-953`) |
| **a clerk / the clerks** | 3 (DS-SUP-1 v2, DS-ECO-6 ≥30 v1 & ≥3 v1) | none typed; the `[ledger]` angle is defined as "the clerk's view" (`:122`) | the angle's own persona | the only role word the annex itself names |
| **the men** | 1 (DS-ECO-6 ≥15 v1: ratepayers) | ADDENDUM 11 names *the men on the wall* as a BODY spelling for the muster | borrowed from the **force** register | a force-register idiom used for ratepayers on a watch-organ read |
| **Merchants** | 1 (DS-ECO-6 ≥15 canonical — a **frozen engine string**) | `economicDragDesc` scaleNote | a class of persons | frozen; not a rewrite target |
| **a trader / sellers / buyers** | 5 (DS-ECO-4 ×2, DS-ECO-10 ×1, DS-SUP-2 clause ×1) | `regional_export_market_loss` clause names "the buyers" (annex `:1384`) | classes of persons | no typed row |
| **people / everybody / nobody / somebody / anyone** | ~60 | none | the `[street]` angle's own device (`:123`) | |
| **whoever is nearest / whoever will do the hard half** | 2 (DS-SUP-3 `THE HEALING GAP` v1; DS-ECO-11 `partiallyExploited` v4) | none | an indefinite | |
| ⚠ **`[elder]`** | 1 (DS-SUP-1 `RESOURCE DEPLETED` v2) | **an ANGLE, not a role word** — `RECEIPT_POOLS_DOSSIER_STATE.md:125` "the memory frame"; and `elders` is separately a HOLDER KIND (`holderTable.js:78`, nouns `word · memory` `fieldSynonyms.js:86`) | **neither** | recorded so a refuter does not fail the tag as a person |
| captain · reeve · priest · factor · steward · lord · magistrate · officer · healer · smith | **0** | — | — | **none of the ADDENDUM 11 example role words appears anywhere in this desk's 355 lines** |

---

## §4 THE ENGINE'S OWN OVERLAPS THAT REACH THIS DESK

Wiring facts for the register car, not writer choices (ADDENDUM 11 rule 5).

| # | The overlap | Rows (file:line) | How it reaches the ECONOMY desk |
|---|---|---|---|
| O1 | `professional city watch` is in **two defense buckets** | garrison `defenseInstitutionBuckets.js:90` · watch `:96` | via `{institution}` on DS-SUP-3 (§3.1) — the name can be the subject of an economy sentence |
| O2 | the **WATCH holder kind is not the watch bucket** | kind `holderTable.js:203-212` (blackMarketCapture · criminalCaptureState · safetyProfile · the `watch` token) vs bucket `defenseInstitutionBuckets.js:95-97` | DS-ECO-6's licensed holder is the KIND; the desk's only `watch`-noun licence is the kind's, and it is a **state organ** (`:115`) |
| O3 | **`watch` is also the watch kind's ratified RECORD NOUN** | `fieldSynonyms.js:84` `['roll','rolls','watch']` | on DS-ECO-6 the word *the watch* may name the RECORD; on every other economy pool it names nothing |
| O4 | the **`force` civic class** contains `watch`, `guard`, `muster`, `garrison` | `wiringCensus.js:1303` | any economy face using one spends a force-class object the desk has no read for |
| O5 | **`Military/Guard` is a FACTION NAME containing a body word** | `rulingStructure.js:596`; its own desc at `:592-595` distinguishes "the soldiers and watchmen, not the officers who govern" | if `{faction}` were ever filled, the POWER's printed name would contain *guard* |
| O6 | **`Craft Guilds` / `Merchant Guilds` / `Thieves' Guild` are FACTION names; `hasGuild` is a BODY flag on the bare token** | `rulingStructure.js:647`, `:506`, `:671`; `priorityHelpers.js:57` | DS-ECO-6's baked "the guilds" sits astride both |
| O7 | **`hasMilitaryInst` matches the bare token `watch`** alongside garrison/barracks/guard/citadel/walls/militia/mercenary/navy/charter hall | `priorityHelpers.js:45` | the same word feeds the military class; `hasWatch` is separate (`:48`) |
| O8 | **`Market` is a chain house, a holder kind, a civic class and a flag** | `resourceChains.js` (oasisDate) · `holderTable.js:311-317` · `wiringCensus.js:1310` · `priorityHelpers.js:56` (fires on `Black market`) | `{institution}` can render `Market` on DS-ECO-11 while the sentence's organ is the market KIND |
| O9 | **`granary` is a building flag, a capacity key, a chain house, a civic class — and a WITHDRAWN holder** | `priorityHelpers.js:63` · `foodStockpile.js:185-195` · `resourceChains.js` · `wiringCensus.js:1322` · `holderTable.js:157-159` | DS-ECO-2's 13 uses of *the granary* on a STOCK read |
| O10 | **`has('mill')` is a substring over institution names and raises food capacity** | `foodStockpile.js:194` | a `Fulling mill` or `Sawmill` deepens the stores DS-ECO-2 speaks about |
| O11 | **`Alchemist shop` is a chain house AND a `magicDef` defense-bucket keyword** | `resourceChains.js` (mineralHot) · `defenseInstitutionBuckets.js:105-111` | `{institution}` on DS-ECO-11 |
| O12 | **`terrainKey` vs `terrainType`** — one spelling loses the `road` holder | census `fields: {"terrainKey": ""}` vs `holderTable.js:233` | seven RESOLVED DS-ECO-11 pools are `SOURCE-UNRESOLVED` that need not be |
| O13 | the desk's **`impaired`** is a trade-dependency severity, **not** `institutions[].impairments[]` | `tabHelpers.js:36-45` vs `corruption.js:665-681` | DS-SUP-3's "impaired" and a corruption impairment are two unrelated facts with one word |

---

## §5 THE TYPED SLOTS THAT NAME A POWER — and why the desk cannot use them

| Power | Typed slot / field | Shape | Reachable from an economy read? | Rendered? |
|---|---|---|---|---|
| a faction | `powerStructure.factions[].faction` → the `{faction}` slot | `proper` | **no read** — the desk names the slot on 3 pools (DS-ECO-6 ≥30 v3; DS-ECO-12 criminal-present v3; DS-SUP-2 `CAPTURED`) | ⛔ **never**: `economyStateProse.js:910-921` leaves it unfilled and says why — the raw roster carries no `archetype`, and filling it from the income LABEL "would name a revenue LINE where the sentence names a HOUSE: the label trap, one layer up". Anchored liveness (`stateProseKernel.js:161-166`) drops the variant; the pool keeps 2 of 3 |
| the ruling structure | `powerStructure.governingName` `rulingStructure.js:787` · `government` `:792` | `proper` | **no economy read**; `governingFactionOf` `rulingPower.js:224-230` | never — no slot on this desk |
| the settlement-wide capture | `powerStructure.criminalCaptureState` `rulingStructure.js:797` → the **watch** kind `holderTable.js:211` | enum, 5 rungs | **not read by any economy pool**; it reaches the desk only as the INTERESTED standing on the 8 state-organ rows | never as a word |
| a corruption impairment | `institutions[].impairments[].type === 'corruption'`, `covert` flag `corruption.js:675-681` | typed | **no economy read** | never |
| a brokerage patron | `brokeragePatronage.js:60` `genesis` / `captured` | typed | **no economy read** | never |

⭐ **THE FINDING THIS SECTION EXISTS FOR.** ADDENDUM 11 rule 1 says a standing read "names the
power only through the typed slot the engine records". On the economy desk **that slot exists,
is named by three faces, and is permanently empty**. Under the drafted law the desk therefore
has **no lawful way to name a power at all** — and the two blocks whose reads ARE organ reads
(DS-ECO-6, DS-ECO-12) are exactly the two whose prose most wants to. The chair should decide
whether the law's answer is (a) the desk stays silent about the power and says only the organ's
own record, or (b) the `{faction}` fill becomes a register-car deliverable.

---

## §6 VISIBILITY — which face may name each standing read

### §6.1 The machinery, verified

| Layer | Row |
|---|---|
| the mark | `· dm-only` inline in the angle tag; annex law `RECEIPT_POOLS_DOSSIER_STATE.md:455-465` (§0e AUDIENCE): "the player-side projection **truncates to silence**, never to a hint" |
| the parser | `scripts/generate-dossier-state-prose.mjs:223-226` (both tag positions fold into `marks`), `:251`, `:318` |
| the filter | `src/domain/display/stateProse/stateProseKernel.js:174-178` `variantIsAudible` — `AUDIENCE_DM` `:133` sees everything; every other string is the player `:135`; `COVERT_MARK = 'dm-only'` `:138`. Also run on turns, `composeStateProse.js:370` |
| the desk's audience | `src/components/new/economyDeskRead.js:113` `audience: options.playerView ? 'player' : 'dm'`, and the whole desk is silenced for a public dossier at `:101` |
| the engine's own covert flags | `corruption.js:675-681` (`covert` true ⇒ hidden channel, else a public scandal); `brokeragePatronage.js:304-311` (a legal house's patron is public, a whisper market's is covert until exposed) |
| the census covert column | `wiringCensus.js:1252-1259` `COVERT_SOURCES` (`compromisedSecurityInstitutions`, `npc.corrupt`, `corruptNpc`, `impairment.covert`, `mobilization.covert`, `blocs.covert`), set at `:1681` |
| arm A13's FAIL limb | `composedWalker.js:1076-1080`: an INTERESTED holder on the player face fails unless the piece carries `dm-only` |

### §6.2 The desk's standing reads, and who may say them

| Standing read | Pools | Holder / organ | Engine visibility flag | Which face is licensed | Evidence |
|---|---|---|---|---|---|
| `eco.safetyProfile.blackMarketCapture` — the off-book share | DS-ECO-6 ×3 | **watch**, a STATE ORGAN | ⚠ **none**: `blackMarketCapture` is not on `COVERT_SOURCES`; the census `covert` flag is **false** on all three rows | **DM by the author's mark only.** 10 of 12 variants carry `dm-only`; **the two canonical-at-zero rows (`vid 0` on ≥15 and ≥3) carry NO mark** and are player-audible — probed in `src/data/dossierStateProse/economy.generated.js` | annex `:1095-1097` claims "The whole block is `dm-only`"; the leaf disagrees |
| `eco.incomeSources` with a criminal line | DS-ECO-12 `criminal line is present` ×3 + `criminal line leads` ×3 | **treasury**, a STATE ORGAN | none | **DM**: all six variants carry `dm-only`, matching the annex (`:1648`, `:1653`) | leaf probe |
| `eco.incomeSources` — the mix shape | DS-ECO-12 ×9 | **treasury**, a STATE ORGAN | none | **player** (no mark) — ⚠ but the holder is a state organ, so on a captured town arm A13's FAIL limb (`composedWalker.js:1076-1080`) applies the moment a face CITES the treasury | leaf probe + card #2 |
| `eco.foodSecurity.stockpile.blockadeBypass` | DS-ECO-9 `BLOCKADE BYPASSED` | toll-bar (not an organ) | none | **mixed**: v2 `dm-only`, v1 and v3 player — the annex's own "the covert variant is `dm-only`" (`:1276`) | leaf probe |
| the other 47 RESOLVED rows | — | market / toll-bar / none | none | **player** | — |

⛔ **THE VISIBILITY FINDING.** On the economy desk the DM face is **entirely an author's mark**.
Not one of the desk's 105 census rows carries `covert: true`, because no economy read is on
`COVERT_SOURCES`. The engine's real covert channels — `impairments[].covert` (`corruption.js:678`)
and the whisper-market patron (`brokeragePatronage.js:304-311`) — are unread here. So
ADDENDUM 11 rule 4's "visibility follows the power layer" **cannot be mechanised on this desk at
all**: there is no power-layer flag to follow. What the desk actually has is §0e's editorial
test — "anything the town itself does not admit" (`RECEIPT_POOLS_DOSSIER_STATE.md:459`) —
which is the same test worded as taste rather than as a field.

---

## §7 FINDINGS — shipped rows using a word at the wrong layer for its read

Quotes ≤12 words, from `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. **Severity** is this
surveyor's, for the chair's triage only.

| # | Block :: pool · variant | Quote (≤12 words) | The read, and its layer | The defect | Severity |
|---|---|---|---|---|---|
| **F1** | DS-ECO-11 `TERRAIN: Forest` v2 · `:1521` | "the town has arranged its light, its roads and its watch around them" | `text(terrainKey)`, `SOURCE-UNRESOLVED`, **ratified noun set empty** | ⛔ **the desk's one bare "the watch" and it is the worst-placed one.** A word that is simultaneously a defense BODY, the WATCH holder kind and a STATE ORGAN, on a terrain read that carries none of the three. Rule 5's named case, exactly | **HIGH** — RESOLVED, mounted, player-audible |
| **F2** | DS-SUP-3 `A CATEGORY PRESENT…` v1 · `:1739` | "{institution} at {settlement} is open and short of what it works with" | `readings.impairedInstitution`, **not-produced**, `SOURCE-UNRESOLVED` | ⛔ the slot can render `Town watch` / `Professional city watch` / `Garrison` / `Citizen militia` / `Town walls` / `Citadel` (§3.1 chain). A BODY of the defense buckets and the muster kind, as the subject of an economy service sentence, **with no word the writer can change** | **HIGH** — a wiring defect wearing a prose defect's clothes |
| **F3** | DS-ECO-6 `TIER: ≥30` v4 · `:1112` | "The guilds are losing their grip a little further each season" | `blackMarketCapture >= 30` → **watch**, a state organ | the noun is a BODY flag (`hasGuild`, `priorityHelpers.js:57`) and a POWER name (`Craft Guilds`, `rulingStructure.js:647`) at once, on an organ-standing read that names neither; and the card's `may NOT` refuses a season and a second fact | **HIGH** |
| **F4** | DS-ECO-6 `TIER: ≥30` v1 · `:1109` | "The duties collected fall well short of the trade actually done" | same watch-organ read | *duties* is the toll-bar/treasury duty vocabulary (`institutionTable.js:106`; `holderTable.js:304-310`); the **watch kind's `dutyNamed` is 0** (`:318-324`). A record word from a different organ | **HIGH** |
| **F5** | DS-ECO-12 `two or three sources` v3 · `:1641` | "No single trade at {settlement} is large enough to dictate to the hall" | `eco.incomeSources` → **treasury** | *the hall* names the court/office/ruling seat (`wiringCensus.js:1314`; `holderTable.js:325-331`, `:357-364`) — a different organ and a POWER object; and "dictate to" asserts a relation between a trade and the seat that no field computes (rule 3's fused agent) | **HIGH** |
| **F6** | DS-ECO-2 `FOOD: deficit` v3 · `:860` | "The granary doors open more often than they shut" | `foodBalance{,.available,.deficit}`, no holder, no nouns | *doors* makes the granary a BUILDING (`hasGranary`, `priorityHelpers.js:63`) on a food-BALANCE read that is not even the granary band; and `granary` is a **withdrawn** holder token (`holderTable.js:157-159`) | MEDIUM |
| **F7** | DS-ECO-2 `GRANARY: nearly empty` v2 · `:889` | "The granary door is watched now." | `granary.band`, no holder, no nouns | the building again, plus a watch-register verb on a stock band | MEDIUM |
| **F8** | DS-ECO-3 `SHORTAGE × trade-dependent` v1 · `:916` | "The gate returns are thin in both columns." | ⛔ **this pool has NO reads at all** (WIRING-UNRESOLVED) | *the gate returns* cites the toll-bar's record on a pool the census gives no source for — arm A13's WITHHELD limb (`composedWalker.js:1060-1065`); and *returns* is not a ratified toll-bar noun (*toll* is, `fieldSynonyms.js:82`) | MEDIUM (authored-only: no mount) |
| **F9** | DS-ECO-6 `TIER: ≥15` v1 · `:1116` | "A real portion of {settlement}'s trade sits outside the rolls" | `blackMarketCapture` → watch | ⭐ **NOT a defect at the record grain**: `rolls` IS the watch kind's ratified noun (`fieldSynonyms.js:84`). Recorded so the cure round does not "fix" a licensed word. The same row's second clause, "the men who do pay their duties", is F4's fault again | **NONE / recorded** |
| **F10** | DS-SUP-1 `RESOURCE DEPLETED` v1 · `:1074`; DS-SUP-1 `BLOCKED` v1 · `:1084` | "The {chain} is on the rolls and off the road." | both pools have **no reads** | *rolls* is the muster/census/watch/court noun; a chain's natural kind is `market`, whose nouns are book · books · **stall** | LOW (authored-only) |
| **F11** | DS-ECO-6 `TIER: ≥30` v3 · `:1111` | "{faction} is not paying what he is paying." | watch organ; `{faction}` **never filled** | the only face on the desk that names a POWER through the typed slot, and it can never render (`economyStateProse.js:910-921`). Also the clearest instance of the `[visitor]` person-agent question (Q2) | **HIGH** (as a wiring finding) |
| **F12** | DS-ECO-12 `criminal line is present` v3 · `:1651` | "{faction} takes its portion and has never reached for a second" | treasury organ; `{faction}` never filled | same dark slot; and "has never reached" is a history the annex's own fence forbids ("no provenance whatsoever", `:1619-1621`) | **HIGH** |
| **F13** | DS-SUP-2 `CAPTURED` v3 · `:1338` | "Inside it, one name sits on every stage." | **NO PRODUCER** (R-DST-H, `:1335`) | names a POWER obliquely ("one name") rather than through the typed slot, precisely to dodge the empty fill | LOW (unwired) |
| **F14** | DS-ECO-5 `MAGICALLY SUSTAINED: small prop` v3 · `:1027` | "The {chain} runs on {institution}'s craft" | no reads | a fused agent: the chain running on the house's craft asserts a `magicNote` ↔ `processingInstitutions[0]` relation no field computes (rule 3) | LOW (unwired) |
| **F15** | DS-ECO-5 `OPERATIONAL` v1 · `:1035` | "{institution} sells work rather than goods." | no reads | an institution as an economic AGENT on a pool with no read to make it a body read | LOW (unwired) |
| **F16** | DS-ECO-6 `TIER: ≥3` v2 · `:1123` | "There is some thieving and some selling without a licence." | watch organ | *a licence* is the market/toll-bar charter instrument (`Market charter and tolls`, `holderTable.js:304-310`), not the watch's | LOW |
| **F17** | DS-SUP-2 cause clause `regional_protection_gap` · `:1388` | "there is nobody guarding the region's roads" | the clause requires `regionalPressures[]` | a FORCE/body claim at region scope; the economy desk has **no force read anywhere** | LOW (a clause, not a variant) |
| **F18** | DS-ECO-6 `TIER: ≥15` v0 (canonical) · `:1115` | "Merchants operating in the shadow economy have a cost advantage" | watch organ | ⛔ **carries no `dm-only` mark in the generated leaf** (probed), so the player face can render a shadow-economy sentence in a block the annex declares wholly `dm-only` (`:1095-1097`). Same for `TIER: ≥3` v0 (`:1121`) | **MEDIUM** — an audience finding, on a frozen engine string |
| **F19** | DS-ECO-11 `TERRAIN: River` v1 · `:1535` | "The water is {settlement}'s road and its mill both" | `text(terrainKey)`, no holder | *its mill* binds a craft BODY to the town on a read that only selects a terrain row; and `river_mills` is a typed **`infrastructure` RESOURCE**, not a house | LOW |
| **F20** | DS-ECO-1 C1 v2 · `:811`; DS-ECO-8 `STRUGGLING` v2 · `:1187` | "{settlement}'s books close with a margin" / "The books never quite close." | `rank` (no holder, no nouns) / **no reads** | *the books* on pools the census gives no holder for. The same shape recurs on **8 `books` + 8 `accounts` + 2 `ledgers`** rows across DS-ECO-1, -2, -3, -5, -8, -10, -11 (§3.3). ⚠ Whether this is a defect at all depends on Q1 | **OPEN — Q1** |

---

## §8 WHAT THE CHAIR MUST DECIDE, AND THE WIRING DEBT

### Questions the evidence raises but does not settle

**Q1 — Does the `[ledger]` ANGLE license a record noun independently of the `source` column?**
The angle palette defines `[ledger]` as "the clerk's view — what the books, rolls and counts show"
(`RECEIPT_POOLS_DOSSIER_STATE.md:122`); the census's `fieldSynonyms` column licenses the same
nouns per read but "licenses nothing on its own" (`fieldSynonyms.js:42-45`); arm A13 counts a
PROVENANCE move on the text either way (`composedWalker.js:1045-1051`). **107 of the desk's 355
lines are `[ledger]`.** If the answer is "the source column wins", F20's ~18 rows are defects and
the desk loses its house voice on every `SOURCE-UNRESOLVED` block. If "the angle wins", the
referent law needs a sentence saying a STANDPOINT noun is not a CITATION.

**Q2 — Does rule 2's "a captain doing anything on any read" reach `a stranger`?**
The `[visitor]` angle is authored law (`:124`) and puts a person in the subject position of
**42** of this desk's lines. If rule 2 is read as *a person doing anything*, the angle is
abolished on this desk. The survey's reading is that rule 2 targets an INSTITUTION-ROLE word
(the captain, the reeve) standing in for an institution, not a narrative observer — but the rule
as drafted does not say so.

**Q3 — What does the desk say when the power is real and the slot is dark?**
§5. Two blocks read a state organ; three faces name `{faction}`; none can render. Either the
desk stays on the organ's own record, or the `{faction}` fill becomes a register-car deliverable.

**Q4 — Is a slot-borne wrong-layer noun a WRITER's fault or a WIRING fault?**
F2 is the test case: no rewrite of the sentence can stop `{institution}` being `Town watch`.
Rule 5 says the alias overlap is a wiring fact; this is the same fact arriving through a `proper`
slot, which rule 5 does not cover.

### Wiring debt this survey found (for the register car)

| # | Debt | Evidence |
|---|---|---|
| W1 | `{institution}` on DS-SUP-3 can render a defense-bucket / muster-kind / watch-organ body | `economicData.js:9`ff (65 keys) → `serviceCategoryTables.js:40-44` → `ServicesTab.jsx:88`, `:95-99` → `economyStateProse.js:999` |
| W2 | `terrainKey` vs `terrainType` loses the `road` holder on 7 RESOLVED pools | census `fields:{"terrainKey":""}` vs `holderTable.js:233` |
| W3 | `{faction}` is named by 3 faces and never filled | `economyStateProse.js:910-921` |
| W4 | DS-ECO-6's two canonical-at-zero rows are player-audible in a block the annex declares `dm-only` | generated leaf probe vs annex `:1095-1097` |
| W5 | the licence card prints a holder KIND but **no referent LAYER**; ADDENDUM 11 rule 2's skeleton tag has no column to read | `scripts/lib/prose-licence-card.mjs:329-338` |
| W6 | `holdersOf` / `standingOf` have **no product caller**, so the organ layer cannot be resolved at draw time | grep over `src/**` |
| W7 | the treasury's two ratified nouns (`purse`, `chest`) are unused on the desk while `accounts` — ratified for nothing — carries 8 rows | `fieldSynonyms.js:78` vs §3.3 |
| W8 | `impaired` means two unrelated things one word apart | `tabHelpers.js:36-45` vs `corruption.js:665-681` |

### Two rows the chair may want to adopt verbatim into the law

1. **The organ noun table already exists.** `HOLDER_KIND_NOUN_ROWS` (`fieldSynonyms.js:77-90`)
   is the engine's own answer to "which word may name the organ", generated from the frozen
   `HOLDER_KINDS` and throwing at load if a kind is added without nouns (`:96-102`). A referent
   law that says *an ORGAN read may use its kind's ratified nouns and no others* is a law stated
   in the engine's vocabulary, mechanisable today, and would resolve F4, F10, F16 and most of
   F20 without a judgment call per sentence.
2. **A BODY word is safe where a body READ exists, and the economy desk has almost none.**
   Of 31 distinct reads, **zero** are institution-presence reads: the desk reads bands, counts,
   statuses, lists and a terrain token. Every institution-class noun in §3.2 is therefore
   standing on a read that does not carry a body — which is why the desk's own safe generics
   (*the stores*, *the workings*, *the trade*) are the ones the corpus already reaches for.
