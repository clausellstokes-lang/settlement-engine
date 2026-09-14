# REFERENT SURVEY — THE STRESSOR + CONDITION DESK (`stressors`: DS-STR-1 · DS-STR-2 · DS-CND-1)

Dock: `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneRW-DEFW` at `f2da5a3ee` (`git log --oneline -1` → `f2da5a3ee REWRITE car 8b-W-5-lighting: the lighting census re-freezes at the car's tip, by its own ritual`; `git status --porcelain` empty). READ-ONLY: nothing written, staged or committed in the dock; no vitest, no npm test, no build. The only thing executed there is `node scripts/prose-licence-card.mjs`, which prints (11 runs, §3).

Every `file:line` below was re-derived in this dock at this sha. ADDENDUM 11's own cites were checked line by line and are recorded as **confirmed** or **corrected** in §1.

This packet answers the REFERENT question only. The desk's ENTAILMENT rows (what a word MEANS), its label traps and its alias traps are the sister packet `rewrite/entailment/stressors.survey.md` and are **not** repeated; where a fact is shared, this packet cites the engine directly and says what the REFERENT consequence is.

---

## §0 THE DESK, DERIVED RATHER THAN GUESSED

| fact | value | source |
|---|---|---|
| the desk's block prefixes | `DS-STR-` and `DS-CND-` | `scripts/generate-dossier-state-prose.mjs:108` (`const DESKS = [`) row `:113` — `{ file: 'stressors', constant: 'DOSSIER_STATE_PROSE_STRESSORS', prefixes: ['DS-STR-','DS-CND-'], title: 'THE STRESSOR + CONDITION DESK' }` |
| the wave gate's `--section` | `--section` names one of six leaves (`scripts/prose-wave-gate.mjs:112`); the roster is `SECTION_LEAVES` `:294-301`, `stressors: DOSSIER_STATE_PROSE_STRESSORS` `:299`. **A leaf IS a section** — a hand-written prefix list drifted and left 29 of 708 pools on no desk (`:277-292`) | `scripts/prose-wave-gate.mjs:277-301` |
| the desk's blocks | **three**: `DS-STR-1`, `DS-STR-2`, `DS-CND-1` (`DS-GEN-4` is a pointer, folded in) | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:4049`, `:4207`, `:4390`; the fold `:5366` |
| the desk's implementation | `src/domain/display/stateProse/stressorsStateProse.js` | leaf map `scripts/prose-licence-card.mjs:60-61` |
| the desk's three sites | `overview.crisisBanners` · `overview.stressorLifecycle` · `overview.activeConditions` | census `sites` on all 67 rows |

### Census totals for the desk (`docs/content/wiring-census.json`, stamp `producerIndexFiles: 1156`)

| block | pools | RESOLVED | WIRING-UNRESOLVED | variants |
|---|---|---|---|---|
| DS-STR-1 | 17 | 15 | 2 | 99 |
| DS-STR-2 | 32 | 22 | 10 | 96 |
| DS-CND-1 | 18 | 12 | 6 | 51 |
| **desk** | **67** | **49** | **18** | **246** |

⭐⭐ **THE ONE NUMBER THIS WHOLE PACKET TURNS ON.** Measured over the 67 desk rows of `docs/content/wiring-census.json`:

| measure | desk value |
|---|---|
| rows carrying a HOLDER | **0** |
| `source.standing` | **`SOURCE-UNRESOLVED` on 67 of 67** |
| `source.kinds` non-empty | **0** |
| `covert: true` | **0** |
| `narrowed: true` | **0** |
| `attach` non-empty | **0** (every pool is a bare spine) |
| `objectClasses` non-empty | **4** — `market` ×2 (`SYNERGY: market_shock × indebtedness`, `ORIGIN: merchant_cabal`), `temple` ×1 (`ORIGIN: temple_putsch`), `hall` ×1 (`ORIGIN: council_schism`) |

So: **this desk has no ORGAN-UNDER-POWER read wired anywhere, and no licensed institution referent of any kind.** Every card prints *"NO citation is licensed: a face naming a record holder here is refused by arm A13."* The desk-wide standing figure is not a local accident — estate-wide the register reads `LICENSED 114 · OFFICE 3 · SOURCE-UNRESOLVED 591` rows (census `holders.summary.rows`), and all 67 of this desk's rows sit in the third bucket on the ground `no-mapping`.

---

## §1 THE FOUR LAYERS, AS THE ENGINE TYPES THEM (every cite re-derived at `f2da5a3ee`)

| layer | the engine's own row | file:line | verdict on ADDENDUM 11's cite |
|---|---|---|---|
| **BODY** — an institution row | `settlement.institutions[]` by recorded name; defence partition `DEFENSE_BUCKET_KEYWORDS` = walls · garrison · militia · watch · mercenary · charter · **magicDef** | `src/domain/institutions/defenseInstitutionBuckets.js:83` (open), rows `:84` walls, `:88` garrison, `:92` militia, `:95` watch, `:98` mercenary, `:101` charter, `:105` magicDef; keys exported `:116` | **CORRECTED**: the addendum's `:83-104` and its six-bucket list omit **`magicDef`** (`:105-108`), which is the seventh bucket and is in `DEFENSE_BUCKET_KEYS`. The alias overlap the addendum names is confirmed verbatim: `'professional city watch'` appears in BOTH `garrison` (`:90`) and `watch` (`:96`). |
| **BODY** — the roster flags | `hasWatch` resolves only `town watch · city watch · professional city watch`; `hasGarrison` includes `professional city watch`; `hasWalls`, `hasGates`, `hasMilitia`, `hasMercenary`, `hasCharterHall` are five further, differently-spelled lists | `src/generators/priorityHelpers.js:45-57` (`hasWatch` `:48`, `hasGarrison` `:46`, `hasWalls` `:53`, `hasGates` `:54`) | confirmed |
| **BODY** — the prose class words | `CIVIC_OBJECT_CLASSES` — eleven closed classes (`wall`, `force`, `store`, `market`, `law`, `temple`, `road`, `hall`, `care`, `craft`, `storehouse`) | `src/domain/prose/wiringCensus.js:1301` (open), `:1302` wall, `:1303` force, `:1309` store, `:1310` market, `:1311` law, `:1312` temple, `:1313` road, `:1314` hall, `:1315` care, `:1316` craft, `:1322` storehouse; read by `objectClassesOf` `:1358` | confirmed |
| **HOLDER-ORGAN** — the kinds | `HOLDER_KINDS` = treasury · muster · census · parish · toll-bar · market · watch · court · elders · tradition · road · office | `src/domain/prose/holderTable.js:78-81` | confirmed (`:78` is the open) |
| **HOLDER-ORGAN** — the state's organs | `STATE_ORGAN_KINDS` = office · court · treasury · watch — "a captured ruling structure IS the state" | `src/domain/prose/holderTable.js:115`, ground `:92-114` | confirmed |
| **HOLDER-ORGAN** — the muster | the paid-military tokens map to the MUSTER kind: `walls`, `garrison`, `militia`, `mercenary`, `charter`, plus `force`, `magicDependency`, `economicGates`, `besiegedBy`, `besiegingTargets`, `ticksToDeploy`, `stretchedThin` | `src/domain/prose/holderTable.js:188-199` | confirmed. ⚠ **`watch` is NOT in the muster block** — it is its own row at `:202-209` with an explicit note: *"the muster roll counts men under arms, and the watch keeps its own count."* |
| **HOLDER-ORGAN** — the watch | `watch` → kind `watch` (`:202-209`), and with it `blackMarketCapture` `:210`, `criminalCaptureState` `:211`, `safetyProfile` `:212`; the kind's record services are `Crime reporting · Crime response · Missing persons`, `dutyNamed: 0` | `src/domain/prose/holderTable.js:202-212`; `HOLDER_RECORDS` watch row `:317-323` | confirmed |
| **POWER** — settlement-wide capture | `capturedRulingStructure(settlement)` reads `powerStructure.criminalCaptureState` and any faction `captureState`; the ladder is `none · adversarial · equilibrium · corrupted · capture` | `src/domain/prose/holderTable.js:127-146`; the ladder `src/domain/worldPulse/factionCapture.js:136-137` (`settlementCaptureState`), again `:212` | **CORRECTED**: the addendum cites `holderTable.js:129-143` and `factionCapture.js:136`; the function opens at `:127` and the ladder array is `factionCapture.js:137`. |
| **POWER** — INTERESTED | `INTERESTED` is the fourth standing a TOWN adds; `standingOf` returns it only for `corrupt ‖ corruption-impaired ‖ captured ‖ controlled ‖ capturedAtBirth`, and the birth capture is read **for a STATE ORGAN only** — every other kind gets a printed refusal in `absent` | `src/domain/prose/holderTable.js:90`, `standingOf` `:642-710` (organ gate `:675-696`, `interested` `:705-707`) | confirmed |
| **POWER** — per-institution corruption | `SECURITY_INSTITUTION_RE = /(watch|garrison|constab|guard|magistrate|court|barracks)/i`; a `'corruption'`-typed impairment is a **public scandal** unless `covert === true`, which is the DM's hidden channel | `src/domain/corruption.js:630`; `compromisedSecurityInstitutions` `:663-691` (the split `:677-680`, the covert stooge `:684-689`) | confirmed |
| **POWER** — patronage | `BROKERAGE_PATRON_SOURCES = ['genesis','captured']` — *"a binding is either the one the world was born with or the one a power took by force, and there is no third way"* | `src/domain/worldPulse/brokeragePatronage.js:60` | confirmed |
| **POWER** — the typed name | a faction is a NAME the engine records: `nameOf(f) = f.faction ‖ f.name` | `src/domain/rulingPower.js:131-133`; the seat `governingFactionOf` `:224-229`, `powerStructure.governingName` `:88` | confirmed |
| **POWER** — the archetype axis | `FACTION_ARCHETYPES` (13 closed values), `CATEGORY_MAP` (category wins), `NAME_RULES` (ordered name regexes) | `src/domain/factionArchetypes.js:34-48`; `CATEGORY_MAP` `:53-61`; `NAME_RULES` `:67-88` | **NEW, and load-bearing for this desk** (§6, §9): the addendum does not carry it, and six of DS-STR-2's pools are keyed off it. |
| **ROLE / PERSON** — never a referent | `COLUMN_SOURCES.holderRole` is a hardcoded null: *"no typed NPC→institution edge exists; the value is null on every row"*, with the un-called name-regex inference named | `src/domain/institutions/institutionTable.js:129`, the reason `:215`, the emitted column `:457`, `:503-508` (*"a name-regex inference exists at npcProfile.js:341-353 and is not called here"*); the module's own statement `src/domain/prose/holderTable.js:31-36` | confirmed |
| **ROLE** — the only typed role vocabulary | `FACTION_ROLES` — **eight display titles**: High Priestess · Watch Captain · Guildmaster · Senior Trader · Kingpin · Lieutenant · Lord Mayor · Archmagister, each with an optional institution-name pattern | `src/generators/factionRoles.js:40-60` | **NEW.** Not one of this desk's nine role words appears in it (§4.4). |
| **ROLE** — the office set | `officesOf(settlement)` = every `npc.role`, every `npc.title`, plus the seat's name — free text, sorted | `src/domain/institutions/institutionTable.js:377-396` | confirmed |

---

## §2 THE DECISIVE FACT OF THIS DESK: ITS THREE RECORDS NAME NO INSTITUTION, NO HOLDER, NO POWER AND NO PERSON

The referent law fixes a word's referent by the LAYER OF THE READ. This desk's three records were read field by field:

| record | the whole shape, as written | file:line | institution ref? | holder? | power? | person? |
|---|---|---|---|---|---|---|
| `settlement.stress[]` (DS-STR-1) | `type · label · icon · colour · summaryRoll · summary · crisisHook · viabilityNote · historyColour` — nine fields, and `icon` is `undefined` on every row | `src/generators/stressGenerator.js:46-58` | **none** | **none** | **none** | **none** |
| `worldState.stressors[]` (DS-STR-2) | `id · type · label · originSettlementId · originRegion · severity · severityBySettlement · age · durationPolicy · decayRate · spreadChannels · affectedSettlementIds · residualEffects · counterforce · synergy · originContext · …` | `src/domain/worldPulse/stressorsCore.js:325-360` | **none** | **none** | **only inside `originContext`** (§7) | **none** |
| `settlement.activeConditions[]` (DS-CND-1) | `id · archetype · label · description · severity · severityBand · status · triggeredAt{tick, sourceEventType, sourceEventTargetId} · duration{elapsedTicks, expiresAtTicks} · affectedSystems[] · causes[]` | `src/domain/activeConditions.js:657-670`; the promotion's `causes` and `triggeredAt` `src/domain/conditionPromotion.js:202-208` | **none** — `affectedSystems` names CAUSAL SYSTEM tokens (`public_legitimacy`, `social_trust`, `labor_capacity`, …), never an institution (`stressorsCore.js:404-412`, `activeConditions.js:290-296` as one worked template) | **none** | **none** | **none** |

⛔ **Consequence, stated plainly for the chair.** On this desk, EVERY institution-class noun and EVERY role word that appears in the 246 shipped variants is rendered on a read whose record holds no institution, no holder, no power and no person. The referent law's rule 1 does not, on this desk, sort correct nouns from incorrect ones layer by layer: it asks, on every one of them, *by what read is this noun on the page at all?* The layer inventory in §4 is therefore built to answer a second question the chair will need — **if the desk names a body / an organ / a power / a role, which word is the always-safe one and what wiring would license the rest** — and §9 lists the places where today's prose puts a word on a layer its read cannot reach.

---

## §3 THE LICENCE CARDS AS PRINTED (11 RESOLVED pools, all three blocks, chosen where a read touches an institution, an organ, a power or a role)

`node scripts/prose-licence-card.mjs <block> "<pool>"`, run in the dock. All eleven are `RESOLVED` in the census.

| # | block · pool | reads (card) | rung | may claim (card, verbatim) | extra refusal |
|---|---|---|---|---|---|
| 1 | `DS-STR-1 :: UNDER OCCUPATION` | `token (via CRISIS_POOL_OF in stressorsStateProse.js)` | table | *"that the key `token` selects the row `occupied` of `CRISIS_POOL_OF` in `stressorsStateProse.js`, as a STANDING fact of the record"* | — |
| 2 | `DS-STR-1 :: INSURGENCY` | same | table | *"…selects the row `insurgency`…"* | — |
| 3 | `DS-STR-1 :: SUCCESSION VOID` | same | table | *"…selects the row `succession_void`…"* | — |
| 4 | `DS-STR-1 :: SLAVE REVOLT` | same | table | *"…selects the row `slave_revolt`…"* | — |
| 5 | `DS-STR-2 :: ORIGIN: barracks_coup` | `worldStressor.originContext.variant` (measured) | template | *"that `variant` (=== barracks_coup) holds, as a STANDING fact of the record"* | — |
| 6 | `DS-STR-2 :: ORIGIN: council_schism` | same | template | *"…(=== council_schism)…"* | **"another civic object of the class `hall`"** |
| 7 | `DS-STR-2 :: ORIGIN: temple_putsch` | same | template | *"…(=== temple_putsch)…"* | **"another civic object of the class `temple`"** |
| 8 | `DS-STR-2 :: ORIGIN: merchant_cabal` | same | template | *"…(=== merchant_cabal)…"* | **"another civic object of the class `market`"** |
| 9 | `DS-STR-2 :: ORIGIN: declared_war` | same | template | *"…(=== declared_war)…"* | bag line reads **`NAMED BUT NEVER FILLED: {counterpart}`** |
| 10 | `DS-CND-1 :: ARCHETYPE: reconstruction` | `condition.archetype` (measured) | template | *"that `archetype` (=== reconstruction) holds, as a STANDING fact of the record"* | — |
| 11 | `DS-CND-1 :: PROVENANCE: causes[] or triggeredAt.sourceEventType populated` | `condition` (measured) | literal | *"that `condition` holds, as a STANDING fact of the record"* | bag line reads **`NAMED BUT NEVER FILLED: {reason}`**; predicate line reads *"(none recovered: the pool has no key-function branch)"* |

**Identical on all eleven**, and this is the grammar the referent law has to work inside:

- `source:` — **`(none) · standing SOURCE-UNRESOLVED`**, with *"NO citation is licensed: a face naming a record holder here is refused by arm A13"*
- `covert:` — **`no`**
- `audience:` — **`player (no mark)`**
- `may NOT:` — *"a count, a cause, a season, a future, a standpoint, a second fact"*
- `REFUSED COLUMNS, always:` — *"a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); **a named character and that character's fate** (product scope); a theological claim about a deity (the deity doctrine)"*
- `attach:` — *"(empty: a spine takes no attach set)"*

⭐ Three cards (6, 7, 8) already print a **civic-object refusal**, and it is the only layer-shaped refusal the card carries today: a pool whose KEY names a civic object may not name **another** object of that class. It is blind in the other direction — `objectClassesOf` reads the POOL KEY only (`wiringCensus.js:1358`), so the 63 desk pools whose key names no object (e.g. `INSURGENCY`, whose variant 5 names the watch) carry no object refusal at all.

---

## §4 EVERY INSTITUTION-CLASS NOUN AND ROLE WORD OF THE DESK, WITH ITS LAYERS

Inventory method, so the chair can check it is exhaustive rather than sampled: the 246 shipped variants were extracted mechanically from `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:4049-4500` (the angle tag stripped), tokenised, and every token matched against the closed engine vocabularies of §1 plus a role-word sweep. Every noun below carries the annex line it is rendered at. No institution-class noun or role word found by that sweep is omitted.

### 4.1 BODY WORDS — the institution-as-a-body layer

| noun (as rendered) | BODY row(s) the engine holds | HOLDER-ORGAN? | POWER? | ROLE? | desk reads that resolve to a BODY | rendered at (annex line) | always-safe class word |
|---|---|---|---|---|---|---|---|
| **walls · wall** (13 uses) | bucket `walls` (`defenseInstitutionBuckets.js:84-87`: wall · citadel · palisade · earthwork · inner citadel · massive walls); roster flag `hasWalls` (`priorityHelpers.js:53`); class `wall` (`wiringCensus.js:1302`) | token `walls` → kind **muster** (`holderTable.js:189`) | — | — | **NONE.** No desk pool reads `walls`, `institutions`, `defenseProfile` or any wall field (census `reads` on all 67 rows) | 4071 · 4072 · 4074 · 4076 · 4089 · 4103 · 4145 · 4183 · 4279 · 4325 · 4340 · 4341 · 4486 | "the wall", "the perimeter" — and on this desk, nothing, because no read reaches it |
| **gates · gate** (3) | same `wall` class (`wiringCensus.js:1302`); separate roster rows `hasGates` (`priorityHelpers.js:54`) | via `walls` → muster | — | — | NONE | 4071 · 4073 · 4074 | "the gate" (class word) |
| **garrison · garrisons** (7) | bucket `garrison` (`defenseInstitutionBuckets.js:88-91`: garrison · barracks · professional guard · professional city watch · multiple garrison); flag `hasGarrison` (`priorityHelpers.js:46`); class `force` (`wiringCensus.js:1303`); world class `defense` **and** `security` (`stressorDynamics.js:50-51`) | token `garrison` → kind **muster** (`holderTable.js:190`) | **YES** — `SECURITY_INSTITUTION_RE` (`corruption.js:630`) makes a garrison corruptible; and `garrison\s+rule` in a faction NAME reads as archetype **OCCUPATION**, not military (`factionArchetypes.js:68`) | — | NONE | 4089 · 4284 · 4330 · 4339 · 4356 · 4486 · 4490 | **"the guard"** is the body word of this bucket (`professional guard`, `:90`); **"the muster"** is the class word for the paid military as a whole |
| **soldiers · officers** (1 face) | `force` class members `soldier` (`wiringCensus.js:1303`); no roster row is spelled "soldier" — the catalogue's word is `Garrison` ("Professional soldiers") | → muster | — | `officers` is a ROLE word with **no engine row** (not in `FACTION_ROLES`, `factionRoles.js:40-60`) | NONE | 4340 | "the muster", "the men on the wall" |
| **watch · the watch's patrols** (2) | bucket `watch` (`defenseInstitutionBuckets.js:95-97`: town watch · city watch · professional city watch); flag `hasWatch` — **town tier and up only** (`priorityHelpers.js:48`) | **YES, and this is the split** — kind `watch` (`holderTable.js:202-209`), and a **STATE ORGAN** (`:115`) | **YES** — `SECURITY_INSTITUTION_RE` (`corruption.js:630`); `CATEGORY_MAP.watch → MILITARY` (`factionArchetypes.js:55`); `NAME_RULES` MILITARY includes `watch` (`:79`); world class `security` **and** `defense` (`stressorDynamics.js:50-51`) | "Watch Captain" is the one typed role bound to it (`factionRoles.js:44-45`) | NONE | 4145 (verb sense, "keeps more watch") · 4155 (body/organ sense, "the watch's patrols") | as a BODY: the watch bucket's own name; as an ORGAN: "the watch" of the order records; **never** for a pay read (law item 5) |
| **army** (2) | no institution row; `NAME_RULES` MILITARY includes `army` (`factionArchetypes.js:79`) | — | — | — | NONE | 4177 · 4487 | — (a campaign is the war layer's, DS-WAR-1) |
| **granary** (2) | class `storehouse` (`wiringCensus.js:1322`), split OUT of `store` at 8a-8 (`:1304-1308`); world food class `/(granary\|mill\|farm\|orchard\|fishery\|silo)/i` (`stressorDynamics.js:48`) | **no row** — a `granary` row was **drafted and withdrawn** from the holder table on its own evidence (`holderTable.js:157-162`) | — | — | NONE | 4079 · 4083 | "the stores" for the stock; the building needs the row |
| **stores** (2) | class `store` (`wiringCensus.js:1309`) | — | — | — | NONE | 4075 · 4081 | "the stores" |
| **market** (6) | class `market` (`wiringCensus.js:1310`); roster `hasMarket` (`priorityHelpers.js:57`) | **YES** — kind `market` (`holderTable.js:78`), nine fields, services `Weekly market · Public auctions`, `dutyNamed: 0` (`:310-316`) | **YES** — `CATEGORY_MAP.merchant/economy/trade → MERCHANT` (`factionArchetypes.js:56`); `NAME_RULES` MERCHANT includes `market` (`:81`) | "Guildmaster", "Senior Trader" (`factionRoles.js:47-49`) | **KEY-LEVEL ONLY**, twice: `SYNERGY: market_shock × indebtedness` and `ORIGIN: merchant_cabal` carry `objectClasses: ['market']` — and neither reads a market FIELD; the read is the variant token | 4073 · 4081 · 4084 · 4127 · 4300 · 4365 | "the market" as the class word only |
| **warehouse · warehouses** (2) | class `storehouse` (`wiringCensus.js:1322`) | — | — | — | NONE | 4345 · 4452 | — |
| **hall** (4) · **council** (2) · **chamber** (1) · **seat** (12) · **office/offices** (5) | ONE class, `hall` = hall · council · charter · seat · office · chamber · moot (`wiringCensus.js:1314`); world class `admin = /(court\|hall\|council\|government\|chancery\|registry\|moot\|forum)/i` (`stressorDynamics.js:49`) | **`office` is a HOLDER KIND and a STATE ORGAN** (`holderTable.js:78`, `:115`; services `Public records · Public record access · Record filing`, `:356-364`), whose own note says a citation on it *"is a finding… the record would be citing the speaker"* | **`seat` is the POWER layer's own object** — `governingFactionOf` / `powerStructure.governingName` (`rulingPower.js:224-229`, `:88`); `NAME_RULES` GOVERNMENT includes `council` (`factionArchetypes.js:87`) | "Lord Mayor" (`factionRoles.js:56`) | **KEY-LEVEL ONCE**: `ORIGIN: council_schism` → `objectClasses: ['hall']` | hall 4090 · 4123 · 4139 · 4354; council 4314 · 4354; chamber 4359; seat 4135 · 4138 · 4294 · 4315 · 4329 · 4336 · 4340 · 4344 · 4350 · 4354 · 4355 · 4361; office(s) 4087 · 4112 · 4136 · 4153 · 4360 | **"the ruling structure"** for the power; **"the office"** for the compiling record; "the hall" for the building — three different layers wearing one class |
| **courthouse** (1) | class `law` = court · prison · gaol · law · justice · magistrate · assize (`wiringCensus.js:1311`) | **YES** — kind `court`, a STATE ORGAN (`holderTable.js:78`, `:115`; services `Criminal trials · Civil disputes · Notary services · …`, `:324-330`) | **YES** — `SECURITY_INSTITUTION_RE` includes `court` (`corruption.js:630`); `CATEGORY_MAP.law → MILITARY` (`factionArchetypes.js:55`) | — | NONE | 4366 | "the court" (organ) |
| **treasury** (2) | no civic class member; the roster rows are the hall/administration rows | **YES** — kind `treasury`, a STATE ORGAN (`holderTable.js:78`, `:115`); its four fields are `incomeSources · viable · criticalIssueCount · economicViability` (`:166-169`) | reached by a settlement-wide capture, as a state organ (`holderTable.js:675-696`) | — | NONE | 4374 · 4486 | "the treasury" (organ) — never as an agent |
| **altars · pulpit · sanctuary · observances · rite · creed · congregations** (8 uses) | class `temple` = temple · shrine · church · parish · clergy · faith · **patron** (`wiringCensus.js:1312`); world class `religious` (`stressorDynamics.js:52`) | `parish` is a HOLDER KIND (`holderTable.js:78`; services `Register of the dead · Central register · Records`, `:296-302`) — **not a state organ** | `CATEGORY_MAP.religious/temple/faith → RELIGIOUS` (`factionArchetypes.js:57`); `NAME_RULES` RELIGIOUS `:70` | "High Priestess" (`factionRoles.js:42`) | **KEY-LEVEL ONCE**: `ORIGIN: temple_putsch` → `objectClasses: ['temple']` | altars 4164; pulpit 4349; sanctuary 4350; observances 4163 · 4350; rite 4160; creed 4159; congregations 4159 | "the temple" as class word; ⛔ the deity doctrine sits on top (every card's REFUSED COLUMNS) |
| **roads · road** (2) | class `road` = road · route · approach · port · harbour · bridge · pass · ford (`wiringCensus.js:1313`) | **YES** — kind `road` (`holderTable.js:78`; fields `terrainType`, `monsterThreat`, `:234-235`; services `Road register · Way-bill registration`, `:349-355`) | — | — | NONE | 4143 · 4280 | "the road" |
| **workshops** (1) | class `craft` = forge · smith · workshop · guild · craft · mill · yard (`wiringCensus.js:1316`) | — | `NAME_RULES` CRAFT (`factionArchetypes.js:80`) | — | NONE | 4457 | "the workshops" |
| **schools** (1) | **no engine class and no roster row** — `school` is in none of the eleven `CIVIC_OBJECT_CLASSES`, none of the seven defence buckets, and none of the seven world `INSTITUTION_CLASSES` | — | — | — | NONE | 4457 | none exists |
| **taverns** (1) | **no engine class** (as above) | — | — | — | NONE | 4375 | none exists |
| **camps** (2) | **no engine class** — the migration record is `spatialLedgers.migration` (DS-POP-1's field), unread here | — | — | — | NONE | 4183 · 4289 | none exists |
| **houses** (merchant sense, 2) | `NAME_RULES` MERCHANT includes `bank`, `broker`, `guild` (`factionArchetypes.js:81`); `NAME_RULES` NOBLE includes `\bhouse\s+[a-z]` (`:84`) | — | **YES, and it is a different object** — a brokerage HOUSE has a typed PATRON, `genesis` or `captured` (`brokeragePatronage.js:60`) | — | NONE | 4344 · 4346 | "the houses" is ambiguous across three engine objects; safest is the archetype class word, "the merchant power" |
| **institutions · institution** (4) | the generic for `settlement.institutions[]` | — | — | — | NONE | 4111 · 4135 · 4361 · 4496 | "the institutions" (safe as a plural class word; it asserts no row) |
| **healers** (1) | class `care` = hospital · infirmary · healer · medical · physician · ward (`wiringCensus.js:1315`) | — | — | a role word with no engine row | NONE | 4129 | "the infirmary" names the body; "the healers" is a role |
| **barracks** (0 uses) | bucket `garrison` (`defenseInstitutionBuckets.js:89`); `SECURITY_INSTITUTION_RE` (`corruption.js:630`); world `defense` class (`stressorDynamics.js:50`) | → muster | yes (security) | — | NONE | **never rendered** — recorded so the chair can see the desk's ORIGIN pool named `barracks_coup` and never uses the word | — |
| **militia · mercenary · charter · citadel · palisade · prison · gaol** (0 uses) | buckets `militia` `:92`, `mercenary` `:98`, `charter` `:101`, `walls` `:84`; class `law` `:1311` | militia/mercenary/charter → **muster** (`holderTable.js:191-193`) | — | — | NONE | **never rendered** | — |

### 4.2 HOLDER-ORGAN WORDS — the record-keeper layer

The twelve kinds (`holderTable.js:78-81`) against what this desk actually renders:

| kind | state organ? | the kind's own record services | file:line | rendered by this desk? | at |
|---|---|---|---|---|---|
| `treasury` | **YES** (`:115`) | Tax collection · Tax payment · Taxation and tolls · Tithe and dues | `holderTable.js:272-278` | **yes**, twice — and once as an agent ("a drowning treasury") | 4374 · 4486 |
| `muster` | no | **Muster training**, and that is all — *"ONE institution in the whole shipped roster keeps a muster: the Citizen militia… the sharpest wiring debt this table found"* | `holderTable.js:279-288` | **NEVER** — the desk does not contain the word "muster" in any of its 246 variants | — |
| `census` | no | Citizen registration · Noble registration | `holderTable.js:289-295` | the **record words** are rendered ("rolls" ×3, "registers" ×1) but never the kind | 4147 · 4171 · 4187 · 4412 |
| `parish` | no | Register of the dead · Central register · Records | `holderTable.js:296-302` | **never** (the faith words at 4159-4164 are temple-class, not the parish kind) | — |
| `toll-bar` | no | Toll collection · Customs brokerage · Market charter and tolls | `holderTable.js:303-309` | **never** (though "levy", "tax", "licence", "permission" are rendered — §4.2b) | — |
| `market` | no | Weekly market · Public auctions | `holderTable.js:310-316` | **yes**, 6 times, always as a place rather than a record-keeper | 4073 · 4081 · 4084 · 4127 · 4300 · 4365 |
| `watch` | **YES** (`:115`) | Crime reporting · Crime response · Missing persons | `holderTable.js:317-323` | **yes**, twice — once as the verb, once as a body with a patrol book | 4145 · 4155 |
| `court` | **YES** (`:115`) | Criminal trials · Civil disputes · Notary services · Criminal proceedings · Civil litigation · Appeals | `holderTable.js:324-330` | **yes**, once, as a building ("the courthouse door") | 4366 |
| `elders` | no | Record of custom | `holderTable.js:331-337` | **as an ANGLE TAG only** — `[elder]` is a face voice on six variants; the kind word "elders" is never rendered. See §6 (overlap O-8) | 4239 · 4269 · 4371 · 4382 · 4463 · 4468 · 4496 |
| `tradition` | no | **NONE — the one kind with no institution anywhere in the shipped roster** | `holderTable.js:338-348` | never | — |
| `road` | no | Road register · Way-bill registration | `holderTable.js:349-355` | **yes**, twice, as ground rather than a register | 4143 · 4280 |
| `office` | **YES** (`:115`) | Public records · Public record access · Record filing | `holderTable.js:356-364` | **yes**, five times, and always as an actor or a location | 4087 · 4112 · 4136 · 4153 · 4360 |

#### 4.2b The RECORD WORDS the desk renders (the organ layer's objects, not its names)

| word | uses | annex lines | the organ whose record it would be | licensed here? |
|---|---|---|---|---|
| `rolls` | 3 | 4147 · 4171 · 4187 | **census** (Citizen registration, `holderTable.js:289-295`) — and `DUTY_SERVICE_KINDS` names `rolls?` explicitly (`institutionTable.js:106`) | no read; standing SOURCE-UNRESOLVED |
| `registers` | 1 | 4412 (verb sense: "The strain registers") | census / parish | verb, not the noun — no finding |
| `books` | 2 | 4104 · 4203 | treasury / office | no read |
| `accounts` | 2 | 4235 · 4455 | treasury | no read |
| `ledgers` | 1 | 4345 | treasury — ⚠ a `ledger` row was **drafted and withdrawn**: *"seven writers… so the token names no one holder"* (`holderTable.js:157-162`) | no read, and the token is explicitly unassignable |
| `seal · seals` | 2 | 4335 · 4360 | office / the seat | no read |
| `writ` | 1 | 4087 | the occupying power's authority | no read |
| `licence · permission` | 2 | 4091 | toll-bar / office | no read |
| `tax · levy · levies` | 6 | 4091 · 4176 · 4179 · 4360 · 4374 · 4375 | **treasury** (Tax collection, `:274`) and **toll-bar** (Toll collection, `:305`) — `DUTY_SERVICE_KINDS` names `tax(es)?`, `tolls?`, `levy\|levies`, `musters?`, `rolls?` (`institutionTable.js:106`) | no read |
| `quarantine` | 1 | 4128 | — no engine record; `'QUARANTINE ACTIVE'` is a Defense-tab **display posture** derived per stress type (`src/domain/display/defenseDisplay.js:25-42`), not a declared quarantine | no read |

### 4.3 POWER WORDS — the standing-over-an-organ layer

| word (as rendered) | uses | annex lines | the engine's typed row | is it a NAME slot? | always-safe class word |
|---|---|---|---|---|---|
| "another power" / "an outside power" | 2 | 4087 · (pool name, 4102) | the occupying / creditor power; no field on this desk's records | no — nothing is named | **"another power"** IS the safe class word (see §9, positive exemplar P1) |
| "authority" | 5 | 4087 · 4096 · 4137 · 4152 · 4351 | `powerStructure` generally; `publicLegitimacy`, `stability` → kind **court** (`holderTable.js:215-223`) | no | "the ruling structure" |
| "government" / "governments" | 7 | 4341 · 4346 · 4351 · 4356 · 4359 · 4361 · 4376 ×2 | `powerStructure.government` / `governingName` (`rulingPower.js:88`); `CATEGORY_MAP.government → GOVERNMENT`, `NAME_RULES` GOVERNMENT (`factionArchetypes.js:54`, `:87`) | the NAME slot is `governingName` — **unread by every desk pool** | "the ruling structure" |
| "the ruling power" | 1 | 4344 | as above | no | safe as a class word |
| "the seat" | 12 | see §4.1 | `governingFactionOf` (`rulingPower.js:224-229`) | `nameOf(governing)` (`:131-133`) — unread here | "the seat" (class word) |
| "ruler" / "rulers" | 2 | 4340 · 4349 | `coupContenders(...).incumbent.name` (`rulingPowerCoup.js:118-123`), stamped on the record at `stressorDynamics.js:894` | **YES — a typed name exists on the coup record and the desk does not use it** | ⚠ "the ruler" is a PERSON-shaped word for a FACTION-typed object |
| "occupier" | 2 | 4284 · 4329 | `occupationStatus.js:83`, `:91`, `:96` → `occupierName` | **YES — typed, by name, and unread by this desk** | "the occupier" (class word) is safe; the NAME is available and unwired |
| "creditor" / "creditors" | 2 | 4103 · 4299 | no typed field anywhere on the desk's records | no | "a creditor beyond the walls" asserts an outside party the record does not hold |
| "sponsor" | 2 | 4306 · 4315 | `originContext.sponsorSettlementId` (`stressorDynamics.js:747`, `:783`, `:884`) | **YES — a settlement id** | "the sponsor" (class word); the NAME is `{counterpart}`-shaped and unfilled |
| "faction" / "factions" | 2 | 4095 · 4364 | `powerStructure.factions[]`; `nameOf` (`rulingPower.js:131-133`) | **YES — a `proper`-typed name** | "the factions" (class word) is safe; the per-faction NAME is unread |
| "religious authority" | 1 | 4351 | archetype `religious` (`factionArchetypes.js:57`, `:70`) reaching the variant through `COUP_VARIANT_BY_ARCHETYPE` (`stressorDynamics.js:914`) | the NAME is `contenders[0].name` (`:891`) — unread | "a religious power" |
| "the houses that finance" | 1 | 4346 | archetype `merchant` (`:913`); a brokerage HOUSE's patron is a different typed object (`brokeragePatronage.js:60`) | NAME available (`contenders[0].name`), unread | "a merchant power" |

### 4.4 ROLE WORDS — the role layer (a standing condition, never a fate)

The engine's ONLY typed role vocabulary is `FACTION_ROLES` (`src/generators/factionRoles.js:40-60`): **High Priestess · Watch Captain · Guildmaster · Senior Trader · Kingpin · Lieutenant · Lord Mayor · Archmagister**. Beside it stands `officesOf` (`institutionTable.js:377-396`), which is free text off `npc.role` / `npc.title` plus the seat's name. And above both, `COLUMN_SOURCES.holderRole` is a **measured null** (`institutionTable.js:129`, `:215`, `:503-508`).

| role word rendered | uses | annex lines | engine row? | given AGENCY in the shipped face? |
|---|---|---|---|---|
| **clerks** | 3 | 4099 · 4163 · 4171 | **none** — not in `FACTION_ROLES`, not a service name in `HOLDER_RECORDS`, not in any `CIVIC_OBJECT_CLASSES` list | **yes** — "have quietly decided which to obey" · "record only one of them" · "cannot correct" |
| **overseers** | 2 | 4169 · 4369 | **none** | **yes** — "keep order in the daylight hours" · "did not understand the new words" |
| **collector · collectors** | 3 | 4105 · 4360 · 4374 | **none** (the duty regex names `tolls?`/`tax`, not a collector, `institutionTable.js:106`) | **yes** — "travel in pairs, then in fours" |
| **officials** | 1 | 4360 | **none** | **yes** — "claim the same seal, the same office and the same tax" |
| **officers** | 1 | 4340 | **none** | **yes** — "are posted to the walls one by one" |
| **administrators** | 1 | 4490 | **none** | in a list ("Garrisons, administrators and suppression") |
| **healers** | 1 | 4129 | class `care` names `healer` as a CIVIC OBJECT (`wiringCensus.js:1315`), not a role | **yes** — "are the busiest people here" |
| **scouts** | 1 | 4326 | **none** — and the engine's own hook string says the same thing (`stressorDynamics.js:679`: "Scouts could put a name to the besiegers") | **yes** — "could put a name to it" |
| **handler / asset** | 1 face | 4310 | **none**; the words are the engine's own `abandoned_agent` reason string (`stressorDynamics.js:763`) | **yes**, and the face says "now a **person** with dangerous knowledge" |
| **mages / casters / hedge wizards** | 4 | 4354 ×2 · 4381 · 4386 | class `arcane` in the world layer is `/(sanctum\|college\|conclave\|circle\|enclave\|atheneum\|spire)/i` — **buildings, not casters** (`stressorDynamics.js:53`); the defence bucket `magicDef` names `wizard · mages' guild · mage · academy of magic · golem workforce · alchemist` (`defenseInstitutionBuckets.js:105-108`) — also bodies | **yes** — "are moving on the seat" · "shrug" · "have not come back" · "are leaving {settlement} quietly" |
| **soldiers** | 1 | 4340 | `force` class member (`wiringCensus.js:1303`); no roster row is spelled "soldier" | **yes** — "have stopped being the seat's instrument and started being its rival" |
| **collaborators / patriots** | 1 | 4330 | **none** | descriptive ("eat at the same tables") |
| **commons / households / population / people** | many | 4374 · 4160 · 4162 · 4369 · 4151 · 23 uses of "people" | **none** — and *"a totality over persons"* is refused on every card | mixed |
| **captain · reeve · elder · priest · factor** (the chair's named examples) | **0 uses each** | — | `Watch Captain` (`factionRoles.js:45`); `reeve` is in `NAME_RULES` GOVERNMENT (`factionArchetypes.js:87`) and in the roster (`Village reeve`, cited at `holderTable.js:277`); `priest`/`clerg` in `NAME_RULES` RELIGIOUS (`:70`); "factor" appears nowhere in any engine vocabulary | **the desk renders none of the five** — recorded so the chair can see the desk's role vocabulary is entirely its own invention |

### 4.5 NOUNS THE DESK RENDERS THAT HAVE NO ENGINE ROW AT ANY LAYER

`schools` (4457) · `taverns` (4375) · `camps` (4183, 4289) · `courthouse door` as an object (4366 — `court` is a class, the door is not) · `clerks` · `overseers` · `collectors` · `officials` · `officers` · `administrators` · `scouts` · `handler` · `asset` · `quarantine` (4128) · `creditor` (4103) · `guest list` (4334) · `rump session` (4359) · `manumission papers` (4370) · `work songs` (4369). Fourteen of the nineteen are ROLE-shaped; the referent law's PERSON prohibition is the live question on all of them.

---

## §5 THE DESK'S READS, EACH ASSIGNED TO A LAYER

Every distinct `reads` string across the 67 census rows, with the layer the read actually carries.

| read (census string) | pools | engine home | **READ LAYER** | may a BODY word ride it? | may an ORGAN word? | may a POWER word? | may a ROLE word? |
|---|---|---|---|---|---|---|---|
| `token (via CRISIS_POOL_OF in stressorsStateProse.js)` | 15 (DS-STR-1) | `stressorsStateProse.js:98-117`; producer `src/data/stressTypes.js:10-170`; the entry `src/generators/stressGenerator.js:46-58` | **a CONDITION OF THE TOWN.** The record holds nine display fields and no institution | **no row is read** — a body word here is unbacked | no | no — no power is recorded | no |
| *(none)* | 2 (DS-STR-1 ARITY, section framing) | key fns `stressorsStateProse.js:160`, `:170` read `banners.length` | **an ARITY of the surface** | no | no | no | no |
| `worldStressor.lifecycleStage` | 5 (DS-STR-2) | `stressorsCore.js:34-42`, derived `:314-322` | **a STAGE of the record** (age/severity thresholds) | no | no | no | no |
| `worldStressor.originContext.variant` | 17 (DS-STR-2 ORIGIN) | `stressorDynamics.js:740-908`; hooks `:657-729` | **MIXED, and this is the desk's one real layer question.** 6 of the 17 (`palace_coup`, `barracks_coup`, `merchant_cabal`, `temple_putsch`, `arcane_ascendancy`, `council_schism`) are a **FACTION ARCHETYPE** read: `COUP_VARIANT_BY_ARCHETYPE[coupContenders(s).challengers[0].archetype]` (`:877`, `:911-919`; `rulingPowerCoup.js:81-124`). 3 (`foreign_sponsored`, `abandoned_agent`, `declared_war`) are a **NEIGHBOUR RELATIONSHIP** read. 3 (`servile_uprising`, `tax_revolt`, `popular_revolt`) are a **CAUSAL SCORE** read (`labor_capacity < 35 && public_legitimacy < 40`, `:832-850`). 2 (`arcane_burnout`, `leyline_silence`) read a residual stressor's `memoryStrength`. 1 (`resistance`) reads a co-located occupation. 1 (`internal_conspiracy`) and 1 (`unattributed`) are the **fail-closed** branches | only where a body is what the archetype names — and it never is: an archetype is a property of a FACTION | no | **yes — this is an ORGAN-UNDER-POWER-shaped read**, and the power has a typed name the desk does not use (§7) | no |
| *(none)* | 10 (COUNTERFORCE ×4, SYNERGY ×6) | `stressorDynamics.js:404`, `:547`; dark by declaration `stressorsStateProse.js:388-397` | **nothing is read** | no | no | no | no |
| `condition.severity` | 4 (DS-CND-1) | `activeConditions.js:541-547` | **a BAND of the record** | no | no | no | no |
| `condition`, `condition.status` | 2 (DIRECTION) | `activeConditions.js:493` | **a DIRECTION of the record** | no | no | no | no |
| `condition.archetype` | 3 (ARCHETYPE) | `activeConditions.js:58-540` (46 rows) | **a KIND of the record.** One of the 46, `corruption_exposed` (`:290-296`), IS an organ-under-power fact — and it is not one of the three written | no | no | only for `corruption_exposed`, unwritten | no |
| `condition` | 2 (PROVENANCE) | `activeConditions.js:670`, `:636-640`; `conditionPromotion.js:202-208` | **a PRESENCE of a trace** | no | no | no | no |
| `condition`, `condition.duration` | 1 (DURATION) | `activeConditions.js:637-643` | **a WINDOW** | no | no | no | no |
| *(none)* | 6 (FAMILY ×5, DIRECTION flat) | no `family` field exists; dark by declaration `stressorsStateProse.js:338-352` | **nothing is read** | no | no | no | no |

⭐ **The summary the chair needs in one line:** of the desk's 67 pools, **six** carry a read whose layer is ORGAN-UNDER-POWER (the coup half of ORIGIN), **one** archetype row would carry one if it were written (`corruption_exposed`), and the remaining **sixty** carry a read whose layer is a CONDITION, a BAND, a STAGE or a WINDOW **of a record**, with no institution, organ, power or role in it at all.

---

## §6 THE ENGINE'S OWN OVERLAPS (law item 5: a wiring fact for the register car, never a writer's choice)

| # | word | the engine rows it sits in at once | file:line | the trap for a writer |
|---|---|---|---|---|
| O-1 | **watch** | (a) defence BODY bucket `watch`; (b) defence BODY bucket `garrison` via `professional city watch`; (c) HOLDER KIND `watch`; (d) STATE ORGAN; (e) `SECURITY_INSTITUTION_RE`; (f) faction archetype **MILITARY** by category AND by name; (g) world classes `defense` AND `security` | `defenseInstitutionBuckets.js:96` + `:90`; `holderTable.js:78`, `:115`, `:202-209`; `corruption.js:630`; `factionArchetypes.js:55`, `:79`; `stressorDynamics.js:50-51` | **seven rows for one word.** A face saying "the watch" has not chosen a layer; the read must. And `hasWatch` is town-and-up (`priorityHelpers.js:48`), so at thorp/hamlet/village the word names nothing at all. |
| O-2 | **garrison** | (a) BODY bucket `garrison`; (b) HOLDER token → **muster**; (c) `SECURITY_INSTITUTION_RE`; (d) world `defense` AND `security`; (e) **`garrison\s+rule` in a faction name reads as archetype OCCUPATION, not MILITARY** | `defenseInstitutionBuckets.js:88`; `holderTable.js:190`; `corruption.js:630`; `stressorDynamics.js:50-51`; `factionArchetypes.js:68` | the same spelling names the town's own body, the occupier's force, and a governing archetype |
| O-3 | **court** | (a) civic class `law`; (b) HOLDER KIND `court`; (c) STATE ORGAN; (d) `SECURITY_INSTITUTION_RE`; (e) world `admin`; (f) `CATEGORY_MAP.law → MILITARY` | `wiringCensus.js:1311`; `holderTable.js:78`, `:115`; `corruption.js:630`; `stressorDynamics.js:49`; `factionArchetypes.js:55` | a court is a building, an organ, a corruptible security body and a military-archetype category |
| O-4 | **market** | (a) civic class `market`; (b) HOLDER KIND `market`; (c) faction archetype MERCHANT by category and name | `wiringCensus.js:1310`; `holderTable.js:78`; `factionArchetypes.js:56`, `:81` | — |
| O-5 | **hall · council · seat · office · charter · chamber · moot** | ONE civic class (`hall`) spanning: the **charter** DEFENCE BUCKET, the **office** HOLDER KIND and STATE ORGAN, the **seat** of the ruling structure, and the world `admin` class | `wiringCensus.js:1314`; `defenseInstitutionBuckets.js:101`; `holderTable.js:78`, `:115`; `rulingPower.js:224-229`; `stressorDynamics.js:49` | the sharpest overlap on this desk: `ORIGIN: council_schism`'s card refuses *"another civic object of the class `hall`"*, which means its own key word already blocks "seat", "office" and "chamber" — and the shipped face uses **chamber** and **office** anyway (§9 F8, F9) |
| O-6 | **patron** | (a) member of civic class **`temple`**; (b) the brokerage **PATRON** (`genesis`/`captured`) — a POWER-layer binding; (c) `NAME_RULES` **OUTSIDER** | `wiringCensus.js:1312`; `brokeragePatronage.js:60`; `factionArchetypes.js:86` | one word, three layers and three unrelated objects; the desk does not render it today and should be told not to start |
| O-7 | **guard** | (a) defence bucket `garrison` via `professional guard`; (b) `SECURITY_INSTITUTION_RE`; (c) `NAME_RULES` MILITARY; (d) civic class `force` | `defenseInstitutionBuckets.js:90`; `corruption.js:630`; `factionArchetypes.js:79`; `wiringCensus.js:1303` | "the guard" is the body word of the GARRISON bucket, not of the watch bucket |
| O-8 | **elder / elders** | (a) HOLDER KIND `elders`; (b) `NAME_RULES` GOVERNMENT includes `elder`; (c) the roster's thorp governing rows are `Informal elder consensus` / `Household elder`; (d) **`[elder]` is one of this desk's seven ANGLE TAGS** | `holderTable.js:78`, `:331-337`; `factionArchetypes.js:87`; `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:4239`, `:4269`, `:4371`, `:4382`, `:4463`, `:4468`, `:4496` | a face voice and a record-holder kind share a word. The annex already bars the tag on DS-STR-1 (*"`[elder]` unavailable per R-DST-W4-b"*, `:4066`) while DS-STR-2 and DS-CND-1 use it seven times |
| O-9 | **granary vs store** | `granary` LEFT class `store` for class `storehouse` at 8a-8, because *"The word named two different civic objects"*; the world's food class is wider still and a "granary" credit can be earned by a **fishery** | `wiringCensus.js:1304-1308`, `:1309`, `:1322`; `stressorDynamics.js:48` | — |
| O-10 | **house** | (a) `NAME_RULES` NOBLE `\bhouse\s+[a-z]`; (b) `NAME_RULES` MERCHANT via `bank`/`guild`; (c) the brokerage HOUSE object | `factionArchetypes.js:84`, `:81`; `brokeragePatronage.js:60` | three engine objects, one word |
| O-11 | **the four spellings of one force class** | `priorityHelpers.hasMilitaryInst/hasGarrison/hasWatch/hasMilitia` (`:45-49`) · the defence buckets (`defenseInstitutionBuckets.js:83-108`) · the stress generator's `hasMilitary = garrison\|militia\|watch` (`stressGenerator.js:108`) · the world layer's `defense` and `security` regexes (`stressorDynamics.js:50-51`) | as cited | four independent vocabularies for the same bodies; the census read a fifth (`CIVIC_OBJECT_CLASSES.force`, `wiringCensus.js:1303`) |
| O-12 | **`objectClassesOf` sees the KEY only** | a pool whose key names a civic object gets the class refusal; a pool that names one only in prose gets none | `wiringCensus.js:1358`; measured: 4 of 67 desk rows carry `objectClasses` | this is why 63 of this desk's pools can print "the watch", "the granary", "the hall" with no instrument objecting |

*(The desk's TWO-RECORD-CLASS overlap — `settlement.stress[]` vs `worldState.stressors[]`, nine differing tokens and a `.find()` selector — is the sister packet's A3 and is not restated here. Its REFERENT consequence is recorded in §9 F31.)*

---

## §7 THE TYPED SLOTS THAT NAME THE POWER, AND THEIR STATE ON THIS DESK

| slot / field | what it names | file:line | filled by the desk? |
|---|---|---|---|
| `{counterpart}` (`proper`) | another settlement's name | declared `scripts/lib/dossier-slot-shapes.mjs:27`; named by `ORIGIN: declared_war` only | **NO** — the card prints `NAMED BUT NEVER FILLED: {counterpart}`; `SLOT_FILL_TABLES` is the empty object (`stressorsStateProse.js:82`) |
| `originContext.attackerSettlementId` | the attacking power, as a settlement id | `stressorDynamics.js:781` (declared_war), null on every other branch (`:748`, `:760`, `:769`, `:792`, `:808`, `:832`, `:863`, `:885`) | **NOT READ** |
| `originContext.sponsorSettlementId` | the bankrolling power | `stressorDynamics.js:747`, `:783`, `:884` | **NOT READ** |
| `originContext.formerSponsorSettlementId` | the handler who stopped paying | `stressorDynamics.js:759` | **NOT READ** |
| `originContext.attackerLabel` | **THE DM'S PEN.** A force with no settlement base — *"a goblin warband, a mercenary company — which only the DM can name"* | set by `setStressorAttacker`, `src/domain/worldPulse/stressors.js:610-627`; the design note `stressorDynamics.js:594-598`, `:787-789` | **NOT READ** |
| `originContext.contenders[].name` + `.archetype` + `.power` + `.weight` | **the coup field, by faction NAME** — stamped on the record at birth | `stressorDynamics.js:891-893`, from `coupContenders` `src/domain/rulingPowerCoup.js:81-124` via `nameOf` `src/domain/rulingPower.js:131-133` | **NOT READ** — and six ORIGIN pools are keyed on the archetype of `contenders[0]` |
| `originContext.incumbent.name` | the seat's own faction name | `stressorDynamics.js:894`; `rulingPowerCoup.js:118-123` | **NOT READ** |
| `powerStructure.governingName` / `governingFactionOf` | the ruling structure's own name | `rulingPower.js:88`, `:224-229` | **NOT READ** |
| `occupierName` | **the occupying power, by name** | `src/domain/display/occupationStatus.js:83`, `:91`, `:96`; the holdings reader `:119-129` | **NOT READ** — DS-STR-1 `UNDER OCCUPATION` and DS-CND-1 `FAMILY: occupation layer` both render "the occupier" with the typed name one field away |
| `powerStructure.criminalCaptureState` | the settlement-wide capture ladder | written `src/generators/power/rulingStructure.js:797` (cited at `holderTable.js:211`); ladder `factionCapture.js:137` | **NOT READ** |
| `factionStates[].captureState` | the per-faction capture | `factionCapture.js:136-145`; read by `standingOf` via `world.captureState` (`holderTable.js:661-663`) | **NOT READ** |

**The always-safe class words on this desk, by layer** (nothing here is a ruling; it is what the engine's own vocabulary permits):

| layer | safe class word(s) | why |
|---|---|---|
| BODY, paid military | **"the muster"** | the holder table's own class for walls · garrison · militia · mercenary · charter (`holderTable.js:188-193`), and the word this desk never uses |
| BODY, the garrison bucket | **"the guard"** | the bucket's own spelling (`defenseInstitutionBuckets.js:90`) |
| BODY, the wall | **"the wall", "the perimeter"** | the class word, material-free (`wiringCensus.js:1302`) |
| HOLDER-ORGAN, order records | **"the watch"** — and only for an order read | `holderTable.js:202-212`; ⛔ never for a pay read (law item 5) |
| HOLDER-ORGAN, the compiling record | **"the office"** | `holderTable.js:356-364`, with its own citation-is-a-finding rule |
| POWER | **"the ruling structure"**, **"the seat"**, **"another power"**, **"the occupier"**, **"the factions"** | class words that assert no name; the NAMES all exist and are unread (above) |
| ROLE | *(none is safe on this desk)* | the engine's only typed roles are eight titles bound to NPCs (`factionRoles.js:40-60`), and `holderRole` is a measured null |

---

## §8 VISIBILITY — WHICH FACE MAY NAME EACH STANDING READ

| standing fact | reachable from this desk? | the engine's visibility flag | file:line | which face |
|---|---|---|---|---|
| a **covert** corruption impairment on a security body | **no** | `impairments[].covert === true` ⇒ the covert set; the covert stooge is added the same way | `corruption.js:669-691` (`:679-680` the split, `:684-689` the stooge) | **DM pen line only** — `compromisedSecurityInstitutions` and `impairment.covert` are both on the census's frozen `COVERT_SOURCES` (`wiringCensus.js:1252-1259`), and `isCovertPath` catches a `covert` segment anywhere in a chain (`:1263-1269`) |
| a **revealed** corruption impairment | **only as a CONDITION ARCHETYPE, and that pool is unwritten** | `corruption_exposed` — *"Public exposure of corruption at an institutional level"*, `defaultStatus: 'easing'`, `affectedSystems: ['public_legitimacy','social_trust','criminal_opportunity']` | `activeConditions.js:290-296`; the world-run cause vocabulary `institutionStatusModel.js:118-120`, cure `:166`, label `:178` | **BOTH faces** (it is a public scandal by the template's own words). ⚠ It is one of 46 archetypes; DS-CND-1 writes **three** (`reconstruction`, `boom`, `flourishing`), and the FAMILY pool that lists it is WIRING-UNRESOLVED |
| a birth **capture** of the ruling structure | **no** | `capturedRulingStructure`; reaches office · court · treasury · watch only | `holderTable.js:127-146`, `:115`, gate `:675-696` | DM pen line at birth (SITTING §T); unreachable here |
| a brokerage **patron** | **no** | `BROKERAGE_PATRON_SOURCES` | `brokeragePatronage.js:60`; read by `standingOf` via `world.patron` `holderTable.js:664-666` | n/a |
| the **attacker's identity** | **yes, as an ABSENCE** | `attackerSettlementId` / `attackerLabel` null until the DM names it; `ORIGIN: unattributed` is the fail-closed branch (*"The attacker is unnamed until the DM says otherwise"*) | `stressorDynamics.js:787-795`; the pen `stressors.js:610-627` | the **player face may say the town does not know**; the NAME, when it exists, is the DM's to set |
| every one of the desk's 67 reads | — | `covert: false`, measured on all 67 census rows | census `rows[].covert` | **player face**; every card prints `audience: player (no mark)` |

⚠ **ONE SHIPPED FACE CARRIES A DM MARK THAT ITS READ DOES NOT.** `DS-STR-1 :: INFILTRATED` variant 5 is tagged `[ledger · dm-only]` (`RECEIPT_POOLS_DOSSIER_STATE.md:4123`), but its pool's read is `token === infiltrated`, its census row is `covert: false`, and its card prints `audience: player (no mark)`. The mark is corpus-side only; nothing in the instrument knows about it. Recorded as a finding (§9 F32), not decided here.

---

## §9 FINDINGS — SHIPPED DESK ROWS WHOSE WORD IS AT THE WRONG LAYER FOR ITS READ

Each row quotes at most twelve words. "Read" is the census `reads` string for the pool; "layer" is §5's assignment. Ordered by the law's own rule numbers, then by block.

### 9a · A BODY WORD ON A POWER READ (rule 1)

| # | annex | pool | quote (≤12 words) | the read | why the layer is wrong |
|---|---|---|---|---|---|
| F1 | 4339 | `ORIGIN: barracks_coup` | *"The garrison is the danger. It drilled at midnight without orders"* | `originContext.variant === barracks_coup` | the variant is produced by `COUP_VARIANT_BY_ARCHETYPE.military` off `coupContenders(s).challengers[0].archetype` (`stressorDynamics.js:877`, `:912`; `rulingPowerCoup.js:88-104`). The referent is a **FACTION with a military archetype, whose NAME the record carries** (`:891`). The face names the defence BODY bucket instead (`defenseInstitutionBuckets.js:88`) — a body no field on this record touches |
| F2 | 4341 | `ORIGIN: barracks_coup` | *"armed, disciplined, and already inside the walls by right"* | same | the walls are a second body, also unread; `hasWalls` is not consulted anywhere on this desk |
| F3 | 4346 | `ORIGIN: merchant_cabal` | *"the houses that finance {settlement} have decided to finance something else"* | `variant === merchant_cabal` ⇐ archetype `merchant` (`:913`) | a BODY-class plural for a FACTION archetype, plus a fused agent asserting a decision no field computes; and "houses" collides with the brokerage HOUSE object (`brokeragePatronage.js:60`) |
| F4 | 4349 | `ORIGIN: temple_putsch` | *"it is being asked from a pulpit"* | `variant === temple_putsch` ⇐ archetype `religious` (`:914`) | a temple-class BODY object for an archetype read; the card already refuses *"another civic object of the class `temple`"* |
| F5 | 4354 | `ORIGIN: arcane_ascendancy` | *"Wards around the council hall have failed more than once"* | `variant === arcane_ascendancy` ⇐ archetype `arcane` (`:916`) | a per-institution failure on a named BODY (`hall`, `wiringCensus.js:1314`); no per-institution field exists at birth (ADDENDUM 12 amendment; `institutionStatusModel.js:118-120` is the world-run's only route and carries no "wards" cause) |
| F6 | 4359 | `ORIGIN: council_schism` | *"A rump session voted itself emergency powers while the chamber stood"* | `variant === council_schism` ⇐ archetype `government`/`civic` (`:917-918`) | a governing BODY with an internal procedure; and "chamber" is a second `hall`-class object, which this pool's own card refuses by name |
| F7 | 4089 | `UNDER OCCUPATION` | *"The garrison is quartered inside the walls"* | `token === occupied` | the occupier's force named with the town's own defence bucket word, on a nine-field display record that holds neither; the occupying power's typed name is one field away and unread (`occupationStatus.js:83`) |
| F8 | 4486 | `FAMILY: war layer, aggressor side` | *"the treasury and the thin garrison, not in the walls"* | **no read at all** (WIRING-UNRESOLVED) | a per-institution SPLIT (one body thin, another not) which ADDENDUM 12's amendment forbids at birth — one gate over a class is a fact about the class, never a member — and which the world-run licenses only through a typed per-institution impairment whose four causes are `supply_shortage · corruption_exposed · damage · siege_occupation` (`institutionStatusModel.js:118-120`), none of them "unpaid" |
| F9 | 4490 | `FAMILY: occupation layer` | *"Garrisons, administrators and suppression tie down strength"* | **no read at all** | a BODY plural plus a ROLE plural on a dark pool |

### 9b · AN ORGAN WORD ON A READ THAT IS NOT THE ORGAN'S (rule 1, and law item 5)

| # | annex | pool | quote | the read | why |
|---|---|---|---|---|---|
| F10 | 4155 | `INSURGENCY` | *"The watch's patrols at {settlement} have been rewritten"* | `token === insurgency` | three ways wrong: (a) the record names no institution; (b) `hasWatch` is **town-and-up only** (`priorityHelpers.js:48`) and `insurgency` carries no tier gate, so the sentence renders at village tier where no watch exists; (c) "patrols" is not among the watch kind's record services — those are `Crime reporting · Crime response · Missing persons` (`holderTable.js:317-323`) |
| F11 | 4145 | `BEAST & RAIDER THREAT` | *"{settlement} keeps more watch than it can afford"* | `token === monster_pressure` | **the law's own worked example, live on this desk.** "keeps watch" is the definitional entailment and is fine; *"than it can afford"* is a **pay/upkeep read**, which belongs to the MUSTER purse (`defenseGenerator.js:182-192`) and to the ORDER purse for the watch's own wages (`:244-252`) — neither is read here, and the muster kind does not contain the watch bucket |
| F12 | 4374 | `ORIGIN: tax_revolt` | *"The levies of a drowning treasury finally broke the commons"* | `variant === tax_revolt` ⇐ `activeHere('indebtedness') ‖ activeHere('market_shock')` (`stressorDynamics.js:842`) | the TREASURY organ (`holderTable.js:78`, a STATE ORGAN `:115`) given a PERSON-shaped predicate ("drowning"); its own four fields (`:166-169`) are unread, and the face's causal clause is a cause the card refuses outright |
| F13 | 4090 · 4123 · 4139 | `UNDER OCCUPATION` #4 · `INFILTRATED` #5 · `SUCCESSION VOID` #5 | *"the town's own hall now advises rather than decides"* · *"{settlement}'s hall discusses… and… records"* · *"Instructions from {settlement}'s hall have stopped being signed"* | `token === occupied / infiltrated / succession_void` | the HALL as a deciding and record-keeping agent on three token reads. At thorp the governing rows are `Informal elder consensus` / `Household elder` — there is no hall of any kind, and nothing in the read gates the word |
| F14 | 4083 | `FAMINE` | *"{settlement}'s granary holds… issued by rule rather than by price"* | `token === famine` | a `storehouse`-class BODY plus an issuing POLICY; `hasGranary` is a probability input only (`stressGenerator.js:109`) and a `granary` holder row was drafted and **withdrawn** (`holderTable.js:157-162`) |
| F15 | 4081 | `FAMINE` | *"The market has grain, and the price of it has become"* | `token === famine` | the MARKET kind's own fields are the export/import set (`holderTable.js:172-180`); none is read, and a price is a magnitude the prose is elsewhere forbidden |
| F16 | 4164 | `RELIGIOUS CRISIS` | *"The altars… are tended and the tending is new"* | `token === religious_conversion` | a temple-class BODY plus a recency claim plus a material claim ("visible in the stonework") on a token read |
| F17 | 4360 | `ORIGIN: council_schism` | *"claim the same seal, the same office and the same tax"* | archetype `government`/`civic` | three organ objects (`office` is the HOLDER KIND and a STATE ORGAN) named on an archetype read; and the same card refuses another `hall`-class object, of which `office` is one (`wiringCensus.js:1314`) |

### 9c · A PERSON OR A ROLE DOING SOMETHING (rule 1's role clause; the card's always-refused column)

| # | annex | pool | quote | why |
|---|---|---|---|---|
| F18 | 4310 | `ORIGIN: abandoned_agent` | *"now a person with dangerous knowledge and no protection"* | **an explicit PERSON referent.** The law forbids a person as a referent outright; the card's REFUSED COLUMNS name *"a named character and that character's fate"*, and this is the unnamed version of the same thing |
| F19 | 4099 · 4163 · 4171 | `POLITICALLY FRACTURED` · `RELIGIOUS CRISIS` · `SLAVE REVOLT` | *"the clerks have quietly decided which to obey"* · *"the clerks record only one of them"* · *"the clerks cannot correct"* | a role word with agency, an interior state and a refusal, three times, on three token reads. **"Clerk" appears in no engine vocabulary at any layer** (§4.4) |
| F20 | 4169 · 4369 | `SLAVE REVOLT` · `ORIGIN: servile_uprising` | *"The overseers keep order in the daylight hours"* · *"the overseers did not understand the new words"* | a role-agent, and in the first case the WATCH organ's own function ("keep order") attributed to an unrecorded role |
| F21 | 4374 | `ORIGIN: tax_revolt` | *"Collectors travel in pairs, then in fours, and lately not at all"* | role-agents given a three-stage motion narrative on a variant token |
| F22 | 4340 | `ORIGIN: barracks_coup` | *"officers loyal to the ruler are posted to the walls one by one"* | a role plural with a loyalty attribute, a PERSON-shaped "ruler" for a FACTION-typed incumbent (`rulingPowerCoup.js:118-123`), and a body (walls) nothing reads |
| F23 | 4129 | `DISEASE OUTBREAK` | *"the healers are the busiest people here"* | `healer` is a CIVIC OBJECT class member (`wiringCensus.js:1315`), not a role; the face makes it a role and then ranks it |
| F24 | 4326 | `ORIGIN: unattributed` | *"Scouts could put a name to it; nobody has yet"* | a role-agent with a counterfactual, restating the engine's own hook string almost verbatim (`stressorDynamics.js:679`) on a pool whose rule is name-nobody |
| F25 | 4354 · 4381 · 4386 | `arcane_ascendancy` · `arcane_burnout` · `leyline_silence` | *"the mages responsible shrug"* · *"The mages who fled… have not come back"* · *"Hedge wizards are leaving {settlement} quietly"* | role-agents with movement and gesture. The world's `arcane` class is **buildings** (`stressorDynamics.js:53`) and the defence bucket `magicDef` is also bodies (`defenseInstitutionBuckets.js:105-108`); there is no caster row anywhere |
| F26 | 4360 | `ORIGIN: council_schism` | *"Two officials claim the same seal… The town pays whichever collector"* | two role classes as agents, plus **a fused agent asserting a relation no field computes** (rule 3): that the town pays one of two claimants |
| F27 | 4340 | `ORIGIN: barracks_coup` | *"The soldiers here have stopped being the seat's instrument"* | a body word used as a collective person with an intention |

### 9d · SAME WORD, TWO REFERENTS INSIDE ONE UNIT, AND FUSED AGENTS (rules 3)

| # | annex | pool | quote | why |
|---|---|---|---|---|
| F28 | 4145 vs 4155 | `BEAST & RAIDER THREAT` #3 vs `INSURGENCY` #5 | *"keeps more watch than it can afford"* / *"The watch's patrols… have been rewritten"* | the desk uses "watch" as an **activity** in one pool and as a **body with its own book** in another. Both can compose onto the same Overview page (`sites: overview.crisisBanners` on both), so rule 3's same-word-same-referent test is live here without any block ever saying so |
| F29 | 4095 | `POLITICALLY FRACTURED` | *"The factions each hold enough to block and none hold enough to rule"* | the POWER layer named with the right class word, then given an arithmetic (`powerStructure.factions[].power`, `rulingPowerCoup.js:88-104`) that this pool does not read — a relation asserted, not a fact stated |
| F30 | 4284 | `SYNERGY: occupation × insurgency` | *"The resistance is bleeding the garrison… costs the occupier more each season"* | **no read at all** (WIRING-UNRESOLVED): a three-party relation (resistance → garrison → occupier) on a pool whose card would print *"may claim: nothing"* |
| F31 | 4222-4224 / 4403-4405 | DS-STR-2 · DS-CND-1 (whole blocks) | the annex's own rule: *"a page carrying both must not narrate one crisis twice"* | the REFERENT consequence of the two-record overlap: DS-STR-2's lines are anaphoric ("the trouble", "this", "the crisis") and its record is chosen by `.find()` over `worldState.stressors[]`, so a reader binds them to the DS-STR-1 banner above, which is a **different record class**. Rule 3's "same word, same referent" fails across blocks, not inside one |
| F32 | 4123 | `INFILTRATED` #5 | tagged `[ledger · dm-only]` | the only DM-marked face on the desk, on a pool whose card prints `audience: player (no mark)` and whose census row is `covert: false` (§8) |

### 9e · WHAT IS ALREADY AT THE RIGHT LAYER (positive exemplars for the chair)

| # | annex | pool | quote | why it is right |
|---|---|---|---|---|
| P1 | 4087 | `UNDER OCCUPATION` #1 | *"Another power's writ runs here. The offices are the same offices"* | the POWER is named **only by a class word**, the institution is the **object** of the sentence, and nothing is fused. This is rule 1's standing-read shape, written before the law existed |
| P2 | 4092 | `UNDER OCCUPATION` #6 | *"{settlement} functions and it functions under supervision"* | a standing condition over the town, no body, no role, no name |
| P3 | 4325 | `ORIGIN: unattributed` #2 | *"Whoever is doing this has not troubled to identify themselves"* | the absence of an identity stated as the fact, which is what the record holds (`stressorDynamics.js:791-795`) |
| P4 | 4066 | DS-STR-1 PROVENANCE | *"`under_siege` entails a besieger and does not entail *who*"* | the block's own ruling, and it is a referent ruling in all but name |
| P5 | `stressorsStateProse.js:421-424` | the desk module | *"a stressor's origin is a claim about who did this to the town, and the wrong one is the worst sentence this corpus could print"* | the desk already knows the referent question is the dangerous one; it fails closed on an unknown variant |

---

## §10 WIRING ROWS AND OPEN QUESTIONS FOR THE CHAIR (raised, never decided here)

1. **The desk has no organ layer at all.** 67 of 67 rows are `SOURCE-UNRESOLVED` with ground `no-mapping`. If the referent law's marker skeleton tags `BODY / ORGAN-UNDER-POWER / ROLE` per claim, then on this desk **every institution-class noun tags as unlicensed by construction** unless a wiring car maps a read. The chair may want a desk-level rule ("this desk states the town's condition; the bodies belong to the desks that read them") rather than 246 per-face refusals.
2. **The coup half of ORIGIN is a genuine organ-under-power read and is mis-rendered six times.** `COUP_VARIANT_BY_ARCHETYPE` (`stressorDynamics.js:911-919`) makes six pools a FACTION-ARCHETYPE read with a typed NAME on the same record (`contenders[0].name`, `:891`). A wiring car exposing `contenders[0].archetype` and `.name` as reads would let those six faces name the power lawfully — and would immediately convict the six body nouns in §9a.
3. **`occupierName` exists and is unread** (`occupationStatus.js:83`). DS-STR-1 `UNDER OCCUPATION` and DS-CND-1 `FAMILY: occupation layer` both speak about an occupier today with the name one field away.
4. **`{counterpart}` is NAMED BUT NEVER FILLED** and its record field exists (`originContext.attackerSettlementId`, `:781`). This is the desk's instance of the estate-wide `{defwork}`-shaped finding ADDENDUM 12 carries to the register car.
5. **`attackerLabel` is the desk's DM pen** (`stressors.js:610-627`) and nothing renders it. If the DM face is to say what the player face cannot, this is the one field on the desk that is built for it.
6. **`corruption_exposed` is the desk's only organ-under-power ARCHETYPE and it is unwritten** (`activeConditions.js:290-296`; 3 of 46 archetypes have pools). Lighting it would put a *public scandal on a named institution class* on the Overview — with no field naming which institution.
7. **The five FAMILY pools are dark and already name bodies and roles** (§9 F8, F9). They light the moment a `family` field lands on `CONDITION_ARCHETYPE_TEMPLATES`; the referent errors in their prose would ship with them.
8. **The `[elder]` angle tag versus the `elders` holder kind** (O-8): one word, a face voice and a record-keeper. DS-STR-1 bars the tag (`:4066`); DS-STR-2 and DS-CND-1 use it seven times. A tag/kind collision is a wiring fact for the register car.
9. **`objectClassesOf` reads the pool KEY only** (`wiringCensus.js:1358`): 63 of 67 desk pools carry no object refusal while naming civic objects in prose. If the referent law is to be instrument-enforced rather than refuter-enforced, this is the arm that would need to see prose.
10. **Nineteen rendered nouns have no engine row at any layer** (§4.5), fourteen of them role-shaped. The chair may want a closed list of the role words a face may use at all, on the model of the always-safe class words in §7.
