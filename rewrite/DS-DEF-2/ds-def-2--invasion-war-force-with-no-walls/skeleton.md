# SKELETON — DS-DEF-2 · pool `Invasion & War: force with NO walls`

Marker: **Opus 5**, for the Fable chair (REWRITE car 8b, block DS-DEF-2), 2026-09-12. Dock READ ONLY at `laneRW-DEF2`. Written under **ADDENDUM 14**: a face is LAWFUL unless it CONTRADICTS the record; silence in the record is permission; the verdict `unlicensed` does not exist and appears nowhere below. The refuters' instrument is `rewrite/recut/CONTRADICTION-TABLE.md` (four floors, 179 rows); every `F1-nn` / `F2-nn` / `F3-nn` / `F4-nn` / `W-nn` / `R-n` id below is that table's.

**HOW THE NINE PARTS ARE LAID OUT.** Parts (4) the reads, (5) what would be false, (6) the preimage and (9) where the flavour is are properties of the POOL, not of one row, so they are written once in **§A** and bind all three variants. Parts (1) number and angle, (2) the shipped sentence, (3) every claim tagged, (7) the angle's stance and (8) the turns worth keeping are written per variant in **§1–§3**. **§4** carries the composition fences the drafter cannot see from the annex.

---

## §0. THE CARD, THE BLOCK'S HEADERS, THE SHIPPED ROWS

### 0.1 The licence card, verbatim
`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: force with NO walls'`

```
LICENCE (block DS-DEF-2 · role spine · key `Invasion & War: force with NO walls`)
  reads:      invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js) === no walls, professional garrison
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation; the relation is the MODIFIER's property, fixed at its freeze (ARCH §4.5)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
              n/a
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the file's first dot) and NOT on a producer-token root, so every pool that selects a row of `INVASION_ROW_POOL` shares ONE echo key: a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)` selects the row `no walls, professional garrison` of `INVASION_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```

### 0.2 The block's header lines (annex `### DS-DEF-2`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2590`)
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:380-389` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat`, the institution presence flags and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` — but the CARD governs: only `{settlement}` is FILLED at this block's call sites (`defenseStateProse.js:621`). `{band}` is RESERVED and `{route}` is unfilled here. A face uses `{settlement}` or no slot at all.
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE:** institution presence is a STANDING fact with no recorded history; the causal clauses here are **capability** clauses ("walls without people cannot be held") and never **historical** ones ("walls built after a siege") unless the history surface supplies the ancestry. Each branch currently holds exactly ONE string, so every settlement in a branch says the same words — that is the defect the pool exists to cure. Two corrected defects must not be reintroduced: the `plagued`+nothing lowercase lead, and reading `institutions.walls` for presence instead of the predicate.
- **PDF PARITY:** parity (`viewModel.js` defense slice).

### 0.3 The register card's six registers, one line each (`prose-research/REGISTER-CARD.md`)
- **the dossier** — the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener.
- **the NPC ladder** — read aloud to the players; role-bound; never a named interior.
- **the Herald** — the estate's one quoted in-world voice; report mode; flattest where hottest.
- **the chronicle** — a borrowed body of headlines; the quiet year is one sentence of varied shape.
- **the DM page** — candid; the why only from a typed field; it grades, never hedges.
- **chrome and the docent** — the product speaking to the person who runs it; mechanics first.

**This pool is the DOSSIER** (R1 STATE, role spine, player audience, no mark).

### 0.4 The shipped rows, verbatim (`RECEIPT_POOLS_DOSSIER_STATE.md:2645-2648`)

**`Invasion & War`: force with NO walls**
1. `[ledger]` {settlement} keeps a professional force and no perimeter. It answers raiders well and cannot hold a siege, because there is nothing here to hold.
2. `[street]` The town's defense is people rather than works, and people can be gone around.
3. `[visitor]` A stranger sees soldiers at {settlement} and no line for them to stand behind, and can see how that decides where any fight would happen.

**Three shipped variants.** The card's angle set (`ledger street visitor`) matches the three tags one for one. Never trim: three variants in, three variants out, in order, each keeping its vid and its angle tag.

---

# §A. THE POOL — parts (4), (5), (6) and (9)

## A.1 — part (4) THE READS THIS POOL REACHES
*Material a writer may use, NOT a bound on what may be written. Silence is permission; this section says what the record positively hands you.*

The key is ONE keyed condition: `invasionRowSituation(walls, garrison, militia) === 'no walls, professional garrison'` (`src/domain/display/stateProse/defenseStateProse.js:476-484`), selecting `INVASION_ROW_POOL['no walls, professional garrison']` (`:458-473`) through `invasionRowPoolKey` (`:488-492`), called at `:656` from `defenseThreatProse`. Its legs, in the engine's own terms:

**(a) `walls === false`.** `standingDefenseForces(settlement).walls.present` is FALSE (`src/domain/institutions/defenseInstitutionBuckets.js:169-182`). The read is over the **LIVE, ruin-filtered roster** (`liveInstitutions(settlement)`), never `defenseProfile.institutions` — the module's header says why in its own words: the snapshot holds pre-ruin objects by reference and the ruin stamp can never reach them. The `walls` bucket is a substring match over the institution's native semantic name against `['wall', 'citadel', 'palisade', 'earthwork', 'inner citadel', 'massive walls']` (`:84-87`). **So the licensed content of this leg is precise and concrete: no wall, no palisade, no earthwork, no citadel stands on this town's live roster.** Those four nouns are the record's own vocabulary for what is missing.

**(b) `garrison === true`.** `standingDefenseForces(settlement).garrison.present` is TRUE: at least one live institution whose name matches `['garrison', 'barracks', 'professional guard', 'professional city watch', 'multiple garrison']` (`:88-91`). The rows that natively fill it, with their own printed descriptions (`src/data/institutionalCatalog.js`):
- `Barracks` — town tier, `baseChance: 0.3`, **"Housing for guards or small garrison."** (`:1363-1369`)
- `Professional city watch` — city, `required: true`, **"Full-time law enforcement. ~1% of population."** (`:1918-1924`) — ⚠ this ONE row sits in BOTH the `garrison` and the `watch` bucket (`defenseInstitutionBuckets.js:90`, `:96`)
- `Garrison` — city, `required: true`, **"Professional soldiers. Noble or royal."** (`:1925-1930`)
- `Multiple garrisons` — metropolis, `baseChance: 0.75`, **"Garrison forces distributed across quarters. No single barracks can secure a metropolis."** (`:2355-2360`)
- plus any CUSTOM roster row whose semantic name carries one of the five keywords, at any tier (`customContentSemanticAuthority.js`; F1-30).

**(c) `militia` — READ BUT NEVER CONSULTED ON THIS BRANCH.** `invasionRowSituation` returns at the `garrison` test (`:482`) before militia is examined: "a garrison OUTRANKS a militia" (the function's own docblock, `:471-475`). The militia leg is therefore **unobserved** on this key. In fact, natively it is always false — `Citizen militia` exists only at hamlet (`:335`), village (`:867`) and town (`:1340`), carries `exclusiveGroup: 'civilianDefense'` and "Present only when no professional watch exists", and `Town watch` is `required: true` at town — but the KEY does not know that, so a face must not turn on it either way.

**The bag.** `{settlement}` only, a `proper` fill of `settlement.name` (`defenseStateProse.js:623`). `{band}` RESERVED, `{route}` unfilled.

**The source.** `muster · standing LICENSED` — a citation of the muster holder is licensed where the provenance budget allows. Under §R-8 a roll may be **mentioned** freely; a roll **cited as a record** needs its holder to resolve (`Citizen militia` / `Muster training`), which on this key it does not. F1-24 is the live hazard: a record cited to a keeper the card prints SOURCE-UNRESOLVED. **The record WORDS are free** (W24 struck): accounts, returns, duties, ledgers, the wage roll, the writ, a licence — all available as nouns. A garrison's pay IS modelled (A.4 below), so the pay record is the one the record actually keeps here.

**What ELSE the reader sees, printed from the same town, in the same box** (material, not bounds):
- the **badge word** `scoreBand(scores.military)` and a bar at `sc%` immediately beside this prose (`DefenseTab.jsx:322-341`; `defenseScoreBands.js:33-39` — STRONG ≥ 65 · ADEQUATE ≥ 40 · WEAK ≥ 20 · CRITICAL below);
- the **funding note**, italic, directly under the row: `Upkeep underfunded: garrison pay at N%` whenever the military gate is below ×1.0 (`defenseDisplay.js:280`, `:319-321`);
- the **old engine string** in the expandable row: *"Professional garrison without perimeter walls. Effective against raiders; cannot hold against a siege."* (`threatAssessment.js:121`) — this is the sentence the rewrite is measured against and the reader still sees;
- the **force cards** below, listing the roster rows by name from the FROZEN snapshot (`DefenseTab.jsx:194-200`, and the tab's own docblock at `:32`);
- **DS-DEF-11's UNWALLED pool**, on this same tab, which speaks about the missing wall in its own right (`defense.generated.js:5323-5357`).

## A.2 — part (6) THE PREIMAGE: the RANGE of towns this key selects
*A boolean key fires across every tier, country and stress state. A face must contradict no state in that range, not merely the town on this skeleton.*

- **TIER.** Natively this key is a **town-tier** key first: `Town walls` is `required: false, baseChance: 0.5` (`institutionalCatalog.js:1332-1338`) and `Barracks` is `baseChance: 0.3`, so a town that failed the wall roll and passed the barracks roll lands here. **Metropolis** reaches it natively too (`Massive walls and fortifications` is `baseChance: 0.5`; `Multiple garrisons` 0.75). **City cannot reach it at birth** — `City walls and gates` is `required: true` (`institutionalCatalog.js:1910-1913`) and `Garrison` is `required: true` — so a city on this key is a city **whose wall row has been ruined or razed since birth**, the live roster filter doing exactly the job it was built for (`calamityKernel.js`, `razingExecution.js`, `settlementLifecycleFirstClass.js`; the buckets' header). **Thorp, hamlet and village carry no garrison-bucket row at all** (F1-06) and reach this key only through CUSTOM content.
- **COUNTRY.** All three `config.monsterThreat` families. This matters for composition, not for truth: on `frontier` the Beasts row above prints *its own* `force without a perimeter` pool; on `plagued` and `settled` the Beasts row is **SILENT** (`beastsRowSituation` returns `''` for force-without-perimeter in both, `defenseStateProse.js:429-439`) and **the Invasion line becomes the lead sentence of the block, in the larger type** (`DefenseTab.jsx:317-319`, `i===0`).
- **BADGE.** All four bands are reachable. Floor: a large-tier town with the garrison alone, a low `milEffective` and `econOutput` at zero gives `round(28 × 0.6) ≈ 17` → **CRITICAL**. Ceiling: garrison 28 + watch 7 + mercenary 14 + charter 10 + arcane 10–25 + divine 6 + up to 35 from `milEffective`, × terrain up to 1.28 → capped 100 → **STRONG** (`defenseGenerator.js:157-190`). **Every intensity word in a face will print beside all four badges across this key's domain.** W-10 holds this *flagged, not chargeable* until the card prints the spread; the writer should still assume the badge can disagree.
- **STRESS.** Unbounded: war, siege, occupation, plague, famine and insurgency all run over towns on this key. A siege is not excluded by the absence of walls — walls are a **probability modifier** on the siege roll, never a precondition (`stressGenerator.js:107`, `:123`).
- **TERRAIN.** All seven. The engine gives mountain ×1.28, hills ×1.18, forest ×1.12, riverside ×1.06, coastal ×1.02 to the military score (`defenseGenerator.js:129-135`) — the ground is positively modelled as helping the defender on five of seven.
- **CULTURE.** All twelve profiles (`cultureProfiles.js:50-600`). The product is setting-agnostic and no defense pool reads the profile (F3-05).

## A.3 — part (5) ⭐ WHAT WOULD BE FALSE HERE
*The rows of the contradiction table this key can actually walk into, each with its field. A finding carries three things: the face, the denying surface, and WHICH OF THE TWO IS THE RECORD (§R-1).*

### The closed rosters this pool touches
A body the roster does not carry may not be asserted. Five rosters bind here:
1. **The seven defence buckets** — `walls · garrison · militia · watch · mercenary · charter · magicDef` (`defenseInstitutionBuckets.js:83-107`). This key reads TWO of them. The other five are unobserved: assert none of them present, and — because F1-25 runs the other way too — deny none of them either.
2. **The institution flag roster** — `priorityHelpers.js:45-77` (`hasWatch :48`, `hasGarrison :46`, `hasWalls :52`, `hasGates :53`, `hasMercenary :49-51`, `hasCharterHall :51`, `hasMilitaryInst :45`).
3. **The tier catalogue** — which rows can exist at this tier at all (`institutionalCatalog.js`).
4. **The frozen four band words** — `STRONG · ADEQUATE · WEAK · CRITICAL` (`defenseScoreBands.js:37-39`, "the frozen four; never extend").
5. **The NPC mandatory-role roster** — `TIER_MANDATORY_ROLES` / `STRESS_MANDATORY_ROLES` (`npcGenerator.js:1511-1537`): exactly one Guard Captain per village-plus, each with a generated personality, disposition and secret.

**Faith:** this is not a faith pool. No deity axis, no `deityTemper()`, no pantheon rank, no settlement standing, no `suppressed` flag is read anywhere on this block, and no defense block reads any of it (`CONTRADICTION-TABLE.md` §D preamble). F3-02 still binds as a wall: nothing is predicated of a deity.

### The rows this key can walk into

| row | the claim that would be false HERE | the field / file:line | which is the record |
|---|---|---|---|
| **F1-07** ⚠ | walls, a circuit, a perimeter, a line **around** the town — asserted, not denied. The trap is the reverse-facing one: a face that lets a reader infer *some* enclosure ("inside the town", "within the bounds", "what the town has raised against it") | `forces.walls.present` false, `defenseInstitutionBuckets.js:84-87`, `:169-182`; DS-DEF-11's UNWALLED pool prints the absence on the same tab | the roster |
| **F1-08** ⭐ | **a GATE, a checkpoint, a toll-bar — OR THE DENIAL OF ONE.** `hasGates` is a SEPARATE flag this key never reads (`priorityHelpers.js:53`), matching `['gates','town walls','city walls','massive walls','palisade']`. On the native population it is false, but a custom `Gates` row can stand with no walls-bucket row. **"No gate to shut", "nothing to close at night" is a NEGATION claim and is chargeable** where the flag fires | `inst.hasGates`, `priorityHelpers.js:53`; `safetyProfile.js:463-464` prints "no gates to bribe and no checkpoints to avoid" where it is false | the flag |
| **F1-25** ⭐⭐ | **the NEGATION direction — denying a body the roster DOES print.** This is the sharpest row on this key, because the key's own shape invites it: "the town has nothing but its people", "no watch worth the name", "nobody keeps a line", "there is no order here". At town the `Town watch` is `required: true`; at city `Professional city watch` and `Garrison` are both required; a mercenary, charter or arcane row may stand unread | `priorityHelpers.js:45-77`; the force cards print the rows by name beside the prose (`DefenseTab.jsx:194-200`) | the roster |
| **F1-27** ⚠ | **a town watch described as professional, full-time, or soldiers.** On the town-tier share — the key's native majority — the garrison bucket is a **`Barracks`** and the required `Town watch` is *"Part-time guards. Night patrol and gate duty."* A face that makes the town's WHOLE armed strength professional soldiers sweeps the watch in with them | `institutionalCatalog.js:1348-1354` | the catalogue row |
| **F1-29** ⚠ | at CITY tier, the watch and the garrison narrated as **two distinct bodies** ("the garrison relieves the watch", "soldiers and watchmen both") | `Professional city watch` is ONE row in BOTH buckets and required at city (`defenseInstitutionBuckets.js:90`, `:96`); `deriveArmedForces` dedupes by name (`defenseDisplay.js:334-335`) | the roster. *Either word alone is fine; the CONTRAST is the finding* |
| **F1-30** ⚠ | denying a body a CUSTOM row supplies — a DM's rampart reads `walls ABSENT` to the flag and still prints on the page. **Write around an absence rather than asserting a total one** | `customContentSemanticAuthority.js:22-32`, `:46-60` | the printed roster |
| **F1-31** | naming a TIER the identity strip does not print, or spelling the band ("a town this small", "no more than a village") | `{r.tier}` prints verbatim at `OverviewTab.jsx:247` | the strip |
| **F1-34** | a totality of safety — "nothing threatens {settlement}". An `Invasion & War` row is built for EVERY town | `threatAssessment.js:113-130`; `monsterThreat.js:20-28` | the engine's model |
| **F1-40 / W-10** ⚠ | **outrunning the BADGE** — an intensity word ("hopeless", "indefensible", "well enough held", "as good as anything nearby") beside a `scoreBand(scores.military)` badge computed from **different inputs than the key**. All four bands print over this key's domain (A.2) | `DefenseTab.jsx:322-341`; `defenseScoreBands.js:33-39` | the badge — **flagged, not chargeable** under W-10 until the card prints the spread |
| **F1-79** | "nothing gets in or out", "the town can be sealed", "a siege cannot reach here" — and on a besieged port, "nothing moves through the gates" | `computeActiveChains.js:756-761` (the port lifeline); `stressGenerator.js:107`, `:123` (walls are a probability modifier, not a precondition) | the model |
| **F1-102** | the country's approach or terrain named against `config.terrainType` / `tradeRouteAccess` — an open plain on a mountain town, a road on an isolated one | `terrainHelpers.js:24`; `generalStateProse.js:887-892` | the config |
| **F1-121** | "the garrison" bare for an OCCUPIER's force under an occupation — the occupation record carries no garrison field | `occupationStatus.js:74-103` | the town's own roster |
| **F1-126** | a minted PROPER NAME in the face — a captain, a lane, a barracks' name. The face is authored once and drawn by every matching town | the `{npc}` slots and the town's own NPC roster are the name authority | constitutional |
| **F2-01** ⭐ | **ANY magnitude the read does not hand you, in a digit or in a word** — a headcount, "a handful", "a few score on the books", "more men than the town can house", a share of the population. The garrison projection carries `count` and `names`, but **this key reads only `present`** | the closed band vocabularies; `demographicsHerald.js:70-80` | the engine |
| **F2-02 / F2-03** | a date, a season, a duration, a founding, a raising — "since the walls came down", "the barracks went up in the old lord's time", "three winters without a wall" | `history.age` is frozen at birth, user-settable and rerollable (`ConfigurationPanel.jsx:419-431`); `institutionFounding.js` | THE PROMISE, constitutional |
| **F2-04 / F2-05** ⭐⭐ | **AN EVENT THE RECORD DID NOT RUN, and AN ELAPSED COURSE.** This is the likeliest floor-2 breach on this key, because the absence of a wall reads to a writer as a story: "the wall never went up", "the walls came down", "what stone there was went into houses", "has stood open", "still", "no longer", "would not last a winter". The perfect, the durative, the comparative-against-a-past and the modal future are all decidable from the face's grammar alone | `ageBands.js` `HISTORICIZE_BAND = 'years-past'`; the pulse adjudicates every prediction | THE PROMISE |
| **F2-06** | a RATE — "most nights", "more often than not", "seldom", "every spring" | nothing bands a rate anywhere in the engine | THE PROMISE |
| **F2-09** | a dependency on a field the key cannot see — a historical allusion on a key that reads no history field. It desyncs on a button press, not only on a tick | `historyPreservation.js:1-30`; `operationRegistry.js:311` | THE PROMISE |
| **F3-05** ⚠ | cultural furniture the town's own profile denies — thatch, hearth-smoke, the churchyard, the market green, snow on the road — on an `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` town. **The most likely recurring finding in every block**, because the exemplar pack's furniture is north-European by construction | `cultureProfiles.js:50-600`, rendered at `dailyLifeLogic.js:14` | the profile |
| **F3-06** ⚠ | an unnamed person's act in the SINGULAR office the tier names. An unnamed person may act freely here — that relaxation is real — but **not as "the captain", "the one who commands the garrison", "the officer who keeps the muster"**: the tier emits exactly one Guard Captain with a generated disposition and secret, and the reader will read the sentence as being about them | `npcGenerator.js:1511-1537`, `:117-149` | the NPC roster |
| **F4-01** | a rotting, weathering or eroding fabric; **and equally, the PERMANENCE of any institution row** — "the barracks will stand whatever comes", "this arrangement is not going to change" | no material decay clock; `calamityKernel.js:96-151`, `:251`, `:259-275` demotes and ruins built fabric | the model |
| **F4-02 / F4-03** ⭐ | **TWO PURSES SPLIT.** One multiplier `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` covers "garrison wages, wall maintenance" TOGETHER (`defenseGenerator.js:182`, `:189-192`). So: no face may say the men are paid while the works are not, or that the money saved on stone goes to the men **as a split of two purses**. What IS licensed: there is no wall to keep up, the purse is one, and DS-DEF-11's own shipped `UNWALLED-LARGE` ledger row already says the town is "spending its defense money on something else, and the books say what" | `defenseGenerator.js:182`, `:189-192` | the model |
| **F4-04** ⭐ | **A TOTAL COLLAPSE OF PAY** — "nothing has been paid in a year", "there is no one left to pay", an emptied barracks. Every gate has a floor (0.6 for military) and the community baseline is exempt. **The licensed extreme is short, late, thin — never none**, and *men drifting off slowly IS the model's own word* (`:186-187`, "unpaid soldiers desert slowly"). A headcount of the drifting is still F2-01 | `defenseGenerator.js:186-192` | the model |
| **F4-06** | the readiness band explained by the works — the band moves while every roster row is unchanged | `defenseGenerator.js:510`, `:491` | the model |
| **F4-07** ⭐ | **the river, the coast or the high ground doing NOTHING for the town's defence.** The sharp form of this key's temptation — "there is nothing here to make a stand behind", "the attacker picks the ground and nothing argues" — is false on five of seven terrains, where the engine positively multiplies the military score for the ground | `defenseGenerator.js:129-135` (mountain 1.28 · hills 1.18 · forest 1.12 · riverside 1.06 · coastal 1.02) | the model |
| **F4-08** | magic written into a world where magic does not work | `magicWorksAt.js:49-53`; `defenseGenerator.js:295-307` | the model |
| **F4-13** | a PLAYER face naming a fact the engine flags covert. This card prints `covert: no` and `audience: player` | `corruption.js:670-681` and the covert families | the flag |

### The frozen/live collisions this key sits on top of (§R-1: the face stands, a WIRING row is filed)
- **W-11 — this block's box is two clocks inside one `<div>`.** Rows 1–2 (Beasts, Invasion) are LIVE; rows 3–5 are the snapshot (`DefenseTab.jsx:317-321`). **The live rows are the record.**
- **W-13 — the block titles lie.** DS-DEF-5's and DS-DEF-11's titles name `defenseProfile.institutions` / `defenseProfileHasWalls`; both actually read `standingDefenseForces`. Do not take a title as a read.
- **The force cards under this prose read the FROZEN snapshot** (`DefenseTab.jsx:194-200`, docblock `:32`). On a ruined-wall city — a real member of this preimage (A.2) — the fortification card can still list `City walls and gates` while our line says there is no wall. **Our line is the record; the card is a WIRING row.** A refuter charging the face here is charging the truthful party (§R-1).
- **W-09 — the engine strings hardcode "Palisade and citizen militia" and "watch rotations" on branches that fire for any walls row.** Not this branch, but the same file, and the reader sees it.

## A.4 — part (9) ⭐ WHERE THE FLAVOUR IS
*What the pool's states make available that the shipped rows never used. The record is silent about far more than it denies, and that silence is the writer's.*

**What a stranger would notice.** The town has no edge. There is no moment of arrival — no point where you are asked your business, nothing to pass through, no place where the country stops and the town starts except where the buildings do. The armed men are somewhere **inside**: at town the roster row is a **`Barracks`** — literally "housing for guards or small garrison" — a building among houses, so the strength is at the centre of a place with no rim, and the way to it is any of them. At city the row is `Garrison`, **"Professional soldiers. Noble or royal."** — the men in a town with no wall are *somebody else's* men, kept there by a noble or a crown, and that is a licensed standing fact of the record rather than an invention. At metropolis the row's own description supplies the picture: **"Garrison forces distributed across quarters. No single barracks can secure a metropolis."**

**What someone would avoid, or complain about.** The soldiers are billeted where people live, because there is no fortification to put them in. Anyone with business at the edge of town has it at the edge of nothing in particular. Where a smuggling operation exists the engine prints the complaint from the other side: *"The lack of controlled entry points makes movement relatively easy; no gates to bribe and no checkpoints to avoid"* (`safetyProfile.js:463-464`) — the absence is a convenience to somebody, and that is the record's own sentence, not the writer's. And the purse: when the economy is thin, the page itself prints **`Upkeep underfunded: garrison pay at N%`** in italics under this very paragraph (`defenseDisplay.js:319-321`) — late wages for men who are the town's whole defence is the record's own reading, and the model's word for the consequence is that they **drift off slowly** (F4-04), never that they are gone.

**What the absence looks like on the ground.** Fields, yards and roads run up to doors. A cart arrives from any direction at any hour and meets nobody whose job is to meet it. Shutting up at night is a house-by-house matter, not a civic act. The defence can go out to meet a thing, and can go the wrong way — the whole difference between a wall and a force is that one is where you put it and the other has to be right. DS-DEF-11's own shipped `UNWALLED-LARGE` line, printed on this same tab, hands the writer the thread: a place this size **"has reached a size that usually buys stone, and has not bought it"** — and this key says what it bought instead. The two lines are the same town's two halves; the Invasion line is where the money went.

**The one open matter this key always carries.** Whether the arrangement is a choice or a shortfall is genuinely unsettled by the record — the badge spans all four bands over this key's domain (A.2), the purse is one and underfunded on a large share of towns, and no field holds an intention. That is a standing open matter (the OPEN QUESTION move: declarative, never an interrogative), and it is the passage's best available turn outward.

**Three concrete things the shipped rows never touched:** the barracks as a *building among houses*; the garrison as *somebody else's men* (the city row's "Noble or royal"); and the fact that a force, unlike a wall, can be **in the wrong place** — which is the licensed core of "people can be gone around" told as a civic fact rather than as a maxim.

---

# §1. VARIANT 1 — parts (1), (2), (3), (7), (8)

### 1.1 — (1) Number and angle
Variant **1** · `[ledger]` (vid 1; annex `RECEIPT_POOLS_DOSSIER_STATE.md:2646`).

### 1.2 — (2) The shipped sentence, verbatim
> {settlement} keeps a professional force and no perimeter. It answers raiders well and cannot hold a siege, because there is nothing here to hold.

### 1.3 — (3) Every claim it makes, tagged

| # | the claim | tag | ground |
|---|---|---|---|
| 1 | {settlement} keeps a force | **SAFE** | read (b): `forces.garrison.present` is true by construction |
| 2 | the force is **professional** | **SAFE** | the bucket's own rows carry the word: `Garrison` "Professional soldiers" (`institutionalCatalog.js:1927`), `Professional city watch` "Full-time law enforcement" (`:1921`), `Barracks` "small garrison" (`:1366`). ⚠ hazard F1-27: the word must point at the garrison bucket's people, never at the required part-time `Town watch` standing beside them |
| 3 | the town **keeps** it — i.e. maintains and pays for it | **SAFE** | positively modelled: `milUpkeepMult` gates "garrison wages, wall maintenance" (`defenseGenerator.js:182`, `:189-192`). ⚠ hazard F4-04: "keeps" may not become "keeps in full" on a gated town, nor "keeps nobody" |
| 4 | and **no perimeter** | **SAFE** | read (a): the `walls` bucket is empty on the live roster. The flat LACK, no completing "but" (R-DA-02). ⚠ hazard F1-30 (a custom rampart the flag cannot see) and F1-08 (the gates flag is a separate read) |
| 5 | it answers **raiders** well | **SAFE** | a standing capability clause, which the block's own FENCE licenses; the engine's own branch says "Effective against raiders" (`threatAssessment.js:121`). Becomes **FLOOR-2** the moment it takes a rate ("most raids"), a count, or an event ("the last band that came") |
| 6 | and **cannot hold a siege** | **SAFE** as a standing capability | the same fence; the engine's own words. ⚠ hazard F1-79 and `stressGenerator.js:107`, `:123`: the town IS besiegeable — walls are a probability modifier, not a precondition — so "no siege can reach here" would be false. Becomes **FLOOR-2** as a prediction the pulse adjudicates ("it will fall when they come", "would not last a winter") |
| 7 | **because there is nothing here to hold** — the cause | **SAFE** | a capability clause joining the two legs of the key, which is the one causal form this block licenses. Craft, not law: it restates claim 4 in other words, which is the summarising second beat (arm Q) and the DULL risk at the pool grain |
| 8 | (carried implicitly) the whole armed strength is the force named | **FLOOR-2** | a dependence on unobserved fields: the `watch`, `mercenary`, `charter` and `magicDef` buckets are never read on this key, and at town the `Town watch` is required. The sentence does not assert it, and a rewrite must not tighten it into an assertion (F1-25) |

### 1.4 — (7) The angle's stance, one sentence
The **ledger** is the office entering the two legs of the key as standing facts in its own formula and drawing the one consequence the block licenses — a capability, never a history — and, because the record-word bar is struck, it may reach for the records it actually keeps here (the wage roll, the returns, the duty, what the books show went on men rather than on stone), while it may not put a number on any of them, date anything, or cite a keeper the card leaves unresolved.

### 1.5 — (8) The turns worth keeping
- **"keeps a professional force and no perimeter"** — carry this compression whole if it can be carried. It is two licensed facts in seven words with the LACK stated flat and no completing "but", and it is the densest lawful thing in the pool (ADDENDUM 6 / Part B §21.4: a rewrite that spends two flat sentences where one licensed compression stood is the regression).
- **"answers raiders well and cannot hold a siege"** — the paired capability. Lawful as it stands; the pairing is the block's own fence made into a sentence.
- **"because there is nothing here to hold"** — lawful, and the one clause worth *replacing* rather than keeping: it spends a whole clause restating the absence. The same joint is available carrying something new (what the men are billeted in, what the money bought instead, where the fight would therefore be).
- ⚠ a sentence face may not OPEN on `{settlement}` (ARCH §2.5 T-F8), so the shipped opener cannot be kept as an opener on more than the variants where the token sits inside the phrase; the settlement token opens at most one variant per pool (MOVE-GRAMMAR wall 10).

---

# §2. VARIANT 2 — parts (1), (2), (3), (7), (8)

### 2.1 — (1) Number and angle
Variant **2** · `[street]` (vid 2; annex `:2647`).

### 2.2 — (2) The shipped sentence, verbatim
> The town's defense is people rather than works, and people can be gone around.

### 2.3 — (3) Every claim it makes, tagged

| # | the claim | tag | ground |
|---|---|---|---|
| 1 | the town's defense is **people** | **SAFE** | read (b). ⚠ hazard: the `magicDef` bucket (a mages' guild, a golem workforce, an alchemist) is unread and is not people — but nothing in the record denies the sentence, and F4-08's bar runs the other way |
| 2 | **rather than works** — the contrast | **SAFE** | read (a), and the rejected alternative names sibling pool keys of this very table (`walls, professional garrison` · `walls with citizen militia` · `walls with NO force`), which is exactly the licence R-DA-02 / wall 5 asks for |
| 3 | **people can be gone around** | **SAFE** on the record | a standing capability of a force without a perimeter; the block's fence licenses capability clauses. ⚠ two hazards: the generalisation test (R-DA-12 — as written it is one step from a maxim about people in general), and **F4-07** the moment it sharpens into "and nothing here argues about the ground", which is false on mountain, hills, forest, riverside and coastal towns |
| 4 | (carried) the town HAS a defense | **SAFE** | read (b) |
| 5 | (carried) there are no works | **SAFE** | read (a). ⚠ F1-30 / F1-08 as in §1.3 |
| 6 | (carried implicitly) the townspeople themselves are the defence | **FLOOR-2** | a dependence on the unobserved `militia` leg. Natively the militia is false everywhere on this key (A.1(c)), so "the town turns out" would be the neighbouring pool's fact, not this one's — "people" here means the garrison's people, and the rewrite must not let it drift into the citizenry |

### 2.4 — (7) The angle's stance, one sentence
The **street** is the town's own reckoning of its arrangement said plainly — what everybody here knows about how the place is defended and what that costs in daily terms — landing on a civic thing and stopping there; it may be blunt and idiomatic (compression is part of the ceiling, never traded for plainness), and it may leave the matter standing open, but it may not turn into a maxim about people, a verdict on the town's judgment, or a forecast.

### 2.5 — (8) The turns worth keeping
- **"people rather than works"** — the pool's sharpest two-word contrast, licensed by sibling keys. Keep the opposition; it is the key's whole content in four words.
- **"and people can be gone around"** — keep the *observation*, watch the *register*: as a fact about this town's defence it is lawful and excellent; as a sentence about people it is a maxim. The licensed sharpening is civic and concrete — a force has to be in the right place and a wall does not.
- This is the pool's **shortest** shipped row and the only one with no `{settlement}` fill; the short line exists and R-DA-05 wants the load to decide the length. Whatever else changes, one variant of this pool should stay short.

---

# §3. VARIANT 3 — parts (1), (2), (3), (7), (8)

### 3.1 — (1) Number and angle
Variant **3** · `[visitor]` (vid 3; annex `:2648`).

### 3.2 — (2) The shipped sentence, verbatim
> A stranger sees soldiers at {settlement} and no line for them to stand behind, and can see how that decides where any fight would happen.

### 3.3 — (3) Every claim it makes, tagged

| # | the claim | tag | ground |
|---|---|---|---|
| 1 | a **stranger** sees | **SAFE** | the visitor stance; W27's stance rules are struck — a stranger may act, be turned away, be told the wrong thing |
| 2 | **soldiers** | **SAFE** | the `Garrison` row's own description is "Professional soldiers" and `Barracks` is "housing for guards or small garrison". ⚠ hazard F1-27: on the town-tier share the bucket is a Barracks and the required `Town watch` is part-time guards, so "soldiers" must not be made to cover the town's whole armed strength; ⚠ hazard F1-29: at city, soldiers and watchmen may not be contrasted as two bodies |
| 3 | **no line for them to stand behind** | **SAFE** | read (a); "the line" is free now (W20 struck). The formulation is good: it names the absence through the men rather than as a bare negation |
| 4 | that **decides where any fight would happen** | **SAFE** as written (subjunctive, no event asserted) | ⚠ the sharpened form is where this walks into **F4-07**: the engine positively models the ground as helping the defender on five of seven terrains (`defenseGenerator.js:129-135`), so "the attacker picks the ground and nothing here says otherwise" is false on a mountain, hills, forest, riverside or coastal town. Becomes **FLOOR-2** if it takes the indicative future |
| 5 | (carried) the men are visible to a stranger | **SAFE** | nothing in the record denies it; the force cards print the rows on the same page |
| 6 | (carried implicitly) there is nothing else a stranger would meet | **FLOOR-2** | dependence on the unread buckets (F1-25 is the chargeable form) |

### 3.4 — (7) The angle's stance, one sentence
The **visitor** is a stranger's arrival and eye placed at {settlement}: it may notice what is there and what is not, may be met or not met, may act and be acted on, and may set what it finds beside what it expected of a place this size — but it may not measure anything, name the tier, carry a verdict on the town, or be told a thing the record does not hold; and its best material here is the one thing this key gives a stranger that no other Invasion key does, which is that **there is no moment of arrival at all**.

### 3.5 — (8) The turns worth keeping
- **"A stranger sees … and no line for them to stand behind"** — the perception frame with the absence named *through the men*. Keep this shape; it is the reason the visitor row is the strongest of the three.
- **"no line for them to stand behind"** — keep verbatim if it survives the sibling check in §4.3 below; it is compact, licensed, and the only place in the pool where the two legs of the key are welded into one image.
- ⛔ **"A stranger sees soldiers at {settlement} and no wall for them to stand on, and can see how that would go"** is the SHIPPED text of the sibling pool `Beasts & Monsters: frontier, force without a perimeter` (`RECEIPT_POOLS_DOSSIER_STATE.md:2616`), which renders **immediately above this line on every frontier town**. The two shipped visitor rows are the same sentence. Whichever way this variant is rewritten, it must not be that sentence again — see §4.3.

---

# §4. THE COMPOSITION FENCES THE DRAFTER CANNOT SEE FROM THE ANNEX

### 4.1 The passage this line lives in
This is a **SPINE** (role `spine`; spine mounts 1 on the defense tab; modifier mounts 0 — the candidates leaf is empty until car 9, so an empty candidate list composes to the kernel's own draw). The composer puts the spine FIRST and orders modifiers after it by salience, with a kinship tiebreak keeping the modifier that shares the spine's subject nearest. **Consequences for every face:**
- it must read as the passage's OPENING, never as a turn outward;
- it must END on a noun a later modifier can pick up — the force, the works, the town, the road, the purse — because THE THREAD (MOVE-GRAMMAR §1.4.1) binds the next sentence to this one's nouns;
- it must read well immediately after nothing, and also be a sentence a sibling modifier can follow: the drafter does not choose its place.

### 4.2 Where it actually prints
The five composed lines render as one stacked block of paragraphs ABOVE the five expandable rows (`DefenseTab.jsx:316-320`). The first line takes the larger type (`i===0`). Therefore:
- on a **frontier** town the Beasts line precedes this one and this line is the second paragraph;
- on a **plagued** or **settled** town the Beasts row is SILENT for force-without-perimeter (`defenseStateProse.js:429-439`) and **this line is the lead sentence of the whole block, in the larger type**. It has to be able to open the passage cold.
- Below it, in the expandable row, the reader still sees the old engine string and, when the gate bites, the italic `Upkeep underfunded: garrison pay at N%`.

### 4.3 ⛔ The echo the card cannot show you
The card's echo line counts ONE spine mount and warns that the echo key is shared by every pool selecting a row of `INVASION_ROW_POOL`. It does **not** reach across tables — and the collision that matters is across tables. On every `frontier` town on this key, `beastsRowPoolKey` selects `Beasts & Monsters: frontier, force without a perimeter`, whose three shipped rows are:
1. `[ledger]` *"…keeps armed people on an open frontier, which means the defense is reactive: whatever comes chooses where the fighting happens, and the town arrives afterwards."*
2. `[visitor]` *"A stranger finds soldiers at {settlement} and no wall for them to stand on, and can see how that would go…"*
3. `[street]` *"The town can answer trouble and cannot prevent it…"*

**All three are this pool's three facts in this pool's three angles, one paragraph higher on the page.** The visitor rows are near-identical sentences. This is the single largest craft risk in the pool and it is invisible from the annex: a rewrite that only satisfies the four floors will still print two paragraphs of the same observation. **The two pools must diverge in what they take as their subject** — the beasts row owns *reactive defence against what comes out of the country*; this row owns *a town with no edge, and what that decides about war*. The measured cure is that this pool's faces should not lead on "a stranger finds soldiers and no wall", which is now the other pool's sentence.

### 4.4 The hard walls, restated for the drafter
No em dash. No exclamation mark. No question mark. No digit or percent anywhere, and none in a connective. No `which`-clause. The copula stays, the expletive goes ("There is no wall" is R-DA-07's expletive opener; prefer a form that predicates). One or two sentences per face (A1); where two, the second carries a noun forward from the first. A face's `{slot}` set equals its parent variant's. A sentence-form face may not open on `{settlement}`. No face opens on a comma or on a clause-list word.

### 4.5 The four faces
Four wording FACES per semantic variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling; an unweighted seeded roll picks one at render, so **every face must stand alone** and all four must be claim-equal to one another. Never trim: no variant is deleted or merged, no shipped face is withdrawn, the counts only rise. Position inside a band is information, not a target — the refinement aims at the ceiling (Part B §21.1–§21.4), and compression that rewards the reader is part of the ceiling, never traded for plainness.

### 4.6 Count
**Three shipped variants** — vid 1 `[ledger]` · vid 2 `[street]` · vid 3 `[visitor]` — three sections above, one per variant, in order. No variant added, removed or reordered.

**The claim tally, stated because a zero is a finding.** Twenty-three claims across the three shipped rows: **17 SAFE · 6 FLOOR-2 · 0 CONTRADICTED.** The zero is deliberate and is the honest reading under ADDENDUM 14 — the three shipped rows assert only the two legs of the key and the capability pair the block's own fence licenses, and the record denies none of it. Every contradiction risk on this pool lives in the **sharpenings** a rewrite will reach for, which is why §A.3 is written as the rows this key *can walk into* rather than as charges against the shipped text. The six FLOOR-2 tags are all one shape: a dependence on the unread buckets (`watch`, `mercenary`, `charter`, `magicDef`) or on the unconsulted `militia` leg, carried implicitly by the shipped rows and not to be tightened into an assertion.

Seat: **Opus 5** — marker packet, complete.
