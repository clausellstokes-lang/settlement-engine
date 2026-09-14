# SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter but NO force to hold it`

Marker seat: Opus, for the Fable chair (REWRITE, block DS-DEF-2). Dock read at `laneRW-DEF2`; every `src/` and `docs/` citation below is that dock. Written under THE NEW TEST (ADDENDUM 14 + `rewrite/recut/CONTRADICTION-TABLE.md`): **a face is LAWFUL unless it CONTRADICTS the record; silence is permission; "the card does not license it" is not a finding.** The verdict `unlicensed` does not appear anywhere in this packet.

**Provenance of every citation.** Files I opened in the dock and read directly: `src/domain/display/stateProse/defenseStateProse.js`, `src/domain/institutions/defenseInstitutionBuckets.js`, `src/generators/priorityHelpers.js`, `src/domain/display/threatAssessment.js`, `src/generators/safetyProfile.js`, `src/data/institutionalCatalog.js`, `src/components/new/tabs/DefenseTab.jsx`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. Line numbers from those are measured. Citations marked **[CT]** are carried from the contradiction table's own row and were not re-opened by this marker; a refuter charging on one should re-open it.

---

## 0. THE CARD, THE HEADERS, THE SHIPPED ROWS

### 0.1 The licence card, verbatim
```
LICENCE (block DS-DEF-2 · role spine · key `Beasts & Monsters: plagued, perimeter but NO force to hold it`)
  reads:      beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js) === plagued country, perimeter without force
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger unfolding visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading and NOT on a
              producer-token root, so every pool that selects a row of `BEASTS_ROW_POOL`
              shares ONE echo key: a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
  THE TEST (ADDENDUM 14): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION.
  may claim:  that the reader `beastsRowSituation(family, perimeter, force)` selects the row
              `plagued country, perimeter without force` of `BEASTS_ROW_POOL`, as a STANDING fact
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated
              cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b),
              another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
              and that character's fate; a theological claim about a deity
```

### 0.2 The block's header lines (annex `### DS-DEF-2`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2590`)
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG`/`ADEQUATE`/`WEAK`/`CRITICAL`), read against `config.monsterThreat` (`plagued`/`frontier`/`settled`), the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}`. Only `{settlement}` is filled at this block's call sites (`defenseStateProse.js:621`, `slots = { settlement: properFill(text(settlement?.name)) }`).
- **SECTION-TARGET:** `defense`. **PDF PARITY:** parity.
- **PROVENANCE + FENCE:** each branch currently holds exactly ONE string, so every settlement in a branch says the same words — the pool exists to end that. Institution presence is a STANDING fact with no recorded history; the causal clauses here are *capability* clauses and never *historical* ones. The walls read must ride the live predicate, never a presence check on `institutions.walls`.
- **Composition fences:** role **spine**; spine mounts 1 (defense tab); **modifier mounts 0** — no modifier attaches to this spine today, so at render the passage IS the face alone. A face is one or two sentences; where two, THE THREAD binds (carry a noun forward, or make the shift of subject the passage's one turn outward, placed last).
- **The register card's six one-line registers:** the dossier (the record itself; the clerk's third person; the town's name is not the default opener) · the NPC ladder · the Herald · the chronicle · the DM page · chrome and the docent. **This pool is DOSSIER** — R1 STATE, spine, player face, no mark.

### 0.3 The shipped rows, verbatim (`RECEIPT_POOLS_DOSSIER_STATE.md:2600-2603`)
1. `[ledger]` {settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night.
2. `[visitor]` A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal.
3. `[unfolding]` The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed.

**Three shipped variants.** The card's angle set (`ledger unfolding visitor`) matches the three tags one for one.

---

## 0.4 (4) THE READS THIS POOL REACHES — material a writer may use, NOT a bound on what may be written

The key is ONE compound condition, called at `defenseStateProse.js:655`:
`beastsRowPoolKey(settlement?.config?.monsterThreat, walls, garrison || militia)`, which resolves `beastsRowSituation(family, perimeter, force)` (`:429-443`) through `BEASTS_ROW_POOL` (`:400-415`).

| leg | the read, in the engine's own terms | where |
|---|---|---|
| **(a) the country** | `measuredMonsterFamily(config.monsterThreat) === 'plagued'`. The RAW value must be present before it is normalised (an absent tier would silently become `frontier`), and `MONSTER_FAMILY_OF` is total over exactly three: `plagued` → `plagued`, `frontier` → `frontier`, **`heartland` → `settled`** (the producer's word and the corpus's word differ). Its meaning is **MONSTER activity in the surrounding region** — never disease. | `defenseStateProse.js:279-284`, `:331-335`; `data/monsterThreat.js:20-28` **[CT]**; printed to the reader on `SummaryTab.jsx:28`, `:37` as "plagued by monster activity" **[CT]** |
| **(b) the perimeter** | `standingDefenseForces(settlement).walls.present === true` — at least one member of the `walls` bucket survives the **live, ruin-filtered** roster. Keywords: `wall` · `citadel` · `palisade` · `earthwork` · `inner citadel` · `massive walls`, matched as **substrings of the institution's native semantic name**. | `defenseInstitutionBuckets.js:83-107`, `:126-145`, `:169-182` |
| **(c) the force** | `garrison.present \|\| militia.present === false` — **no** member of the `garrison` bucket (`garrison` · `barracks` · `professional guard` · `professional city watch` · `multiple garrison`) **and no** member of the `militia` bucket (`citizen militia` · `militia`). | `defenseInstitutionBuckets.js:88-95`; the `\|\|` is composed at `defenseStateProse.js:655` |
| **the slot** | `{settlement}` — the town's own name, `proper`-filled. `{band}` is RESERVED and `{route}` is unfilled at this block's call sites. | `defenseStateProse.js:621` |

**What the same projection holds but this key does not consume** (material, not licence): `walls.count` and `walls.names` — the projection answers `present`/`count`/`names` and the key takes only `present` (`defenseInstitutionBuckets.js:169-182`). And **four whole buckets the key never consults**: `watch`, `mercenary`, `charter`, `magicDef` (`:83-107`). A body in any of the four may be standing on this town.

**The card says what the read REACHES. Everything the record is silent about is the writer's.** The record is silent about: what the perimeter is made of on any given town, which side of it things happen on, what it is used for besides defence, what the gate is like, what people carry, what they avoid, what the night is like, what the ground outside is, what anyone says about any of it.

---

## 0.5 (6) THE PREIMAGE — the RANGE of towns this key selects

A boolean-keyed pool fires across every tier, country, wealth, stress state and culture that satisfies three conditions. **A face must contradict no state in this range, not merely the town on this skeleton.**

**The three conditions:** the region's monster tier is `plagued`; at least one live `walls`-bucket row stands; no live `garrison`-bucket row and no live `militia`-bucket row.

**By tier** (`institutionalCatalog.js`, anchor lines measured):

| tier | how the key is reached | what ELSE is standing there |
|---|---|---|
| **thorp** | `Palisade` (`:97`, optional) — *"Sharpened stakes encircling the settlement. Offers minimal protection but enough to deter casual raiders."* | possibly **`Household levy`** (`:104`, baseChance 0.18) — *"One able-bodied adult from each household musters with hunting bows, spears, and farm tools when danger reaches the fields."* ⭐ **This row matches NO defence bucket keyword**, so it stands while `force` reads false. No watch row exists at this tier. |
| **hamlet · village** | `Palisade or earthworks` (`:342`, `:874`) — *"Basic wooden palisade or earthwork berm"* / *"Perimeter palisade or earthwork berm. Controls approach, slows attackers."* — with `Citizen militia` (`:335`, `:867`) NOT seated | at village, possibly `Veteran's lodge` (`:881`) — *"A drinking hall where retired soldiers and mercenaries gather. Informal security…"*. No watch row at these tiers. |
| **town** ⭐ the modal case | `Town walls` (`:1332`) — *"Stone fortifications with gates"* — or `Gates (if walled)` (`:1356`, which matches the `wall` keyword through "walled"), with no `Barracks` | **`Town watch` is `required: true` at town** (`:1348`) — *"Part-time guards. Night patrol and gate duty."* It sits in the `watch` bucket ONLY, so `force` still reads false. And `Citizen militia` (`:1340`) carries `exclusiveGroup: 'civilianDefense'` with it and the note *"Present only when no professional watch exists"* — so at town the militia is displaced by the watch, which is exactly why this key is the town's default. |
| **city · metropolis** | normally UNREACHABLE: `City walls and gates` (`:1910`), `Professional city watch` and `Garrison` are all `required: true` at city, and `Professional city watch` sits in the **garrison** bucket. Reachable only where a ruin path stamps those rows and `liveInstitutions` drops them, leaving `City walls and gates` (*"Masonry walls with towers. Multiple gatehouses"*), `Citadel` (`:1931`, *"Inner fortress. Last refuge in siege."*) or `Massive walls and fortifications` (`:2347`) standing. | a stripped city inside masonry walls. Rare — and a face that is false of it is still false. |

**Free across the whole range, because nothing here reads them:** population and wealth; terrain and route; the safety label (`Very Safe` through `Dangerous`, `safetyProfile.js:265-312`); the government, the faith, the criminal capture rung; every stress state; **and the culture profile** — the product is setting-agnostic and no defence pool reads `cultureProfiles.js`, so the town may be `arabic`, `east_asian`, `mesoamerican`, `south_asian` or `steppe` **[CT]**.

**The preimage's one sentence:** *a plagued country, something standing that counts as a perimeter — stakes at a thorp, stone at a town, masonry at a stripped city — and neither a garrison nor a militia; while a required part-time watch, a household levy, a mercenary hall, a charter hall or a wizard may all be standing and unread.*

---

## 0.6 (5) ⭐ WHAT WOULD BE FALSE HERE

### 0.6.1 The contradiction-table rows this key can actually walk into

| row | the claim that would be false, **as this key reaches it** | the field / file:line that denies it | which is the record |
|---|---|---|---|
| **F1-25** ⭐ *the sharpest row on this pool* | **the negation direction** — "nobody", "no one", "not a soul", "nobody to man it", "nobody on them", "nothing organised", "no guard". The key reads three buckets and is blind to four. | `forces.watch.present` — `Town watch` is `required: true` at town (`institutionalCatalog.js:1348`) with *"Night patrol and gate duty"*; `Household levy` (`:104`) at thorp; `forces.mercenary` / `forces.charter` / `forces.magicDef` (`defenseInstitutionBuckets.js:83-107`); `priorityHelpers.js:48` `hasWatch` | **the roster row** |
| **F1-01** | a **WATCH** asserted as a standing body — false on the thorp/hamlet/village share, where no watch row exists at all | `inst.hasWatch` false, `priorityHelpers.js:48`; `safetyProfile.js:300`, `:309` print the denial beside the prose | the roster row |
| **F1-01 ∧ F1-25** ⭐ | **the watch is unusable either way in a pooled face.** Assert it and the sub-town share denies it; deny it and the town share denies it. The shipped `[unfolding]` row does the first. | both of the above | — |
| **F1-02** | a **GARRISON** | `forces.garrison.present` false **by the key itself**; `inst.hasGarrison`, `priorityHelpers.js:46` | the key |
| **F1-03** | a **MILITIA** standing, or the **muster ROLL cited as a record** | `forces.militia.present` false by the key; the muster kind's only holder is `Citizen militia`, `holderTable.js:279-288` **[CT]**. ⚠ the card prints `source: muster · standing LICENSED` — that is the FIELD's holder kind, not a keeper resolved on a town with no militia. **"The muster" as a class word is free everywhere; "the muster roll" cited as a record is F1-24.** | the roster row |
| **F1-04** ⚠ *reads the other way* | "**the guard**" — **SAFE on every town on this key.** `hasMilitaryInst` lists `walls` and `citadel` among its keywords, so the perimeter row alone sets it true. | `priorityHelpers.js:45` | the flag. *(A writer who assumes "the guard" is barred here is wrong; only a PAY claim about it is a finding — §1.4 W-04.)* |
| **F1-05 / F1-06** | a **mercenary company** or a **charter hall** asserted **or denied**. A charter hall can stand on this key: `beastsRowSituation` never consults it. ⭐ "no specialist recourse" is a live finding here. | `forces.charter.present`, `priorityHelpers.js:51`; `forces.mercenary.present`, `defenseInstitutionBuckets.js:98-100` | the roster row |
| **F1-07** ⭐ | **"a wall", "the perimeter", "the line around the town"** — true of a palisade, an earthwork, town walls, city walls; **false where the only live row is `Citadel`** (*"Inner fortress. Last refuge in siege."*, `:1931`) **or `Gates (if walled)`** (*"Controlled entry points with gatekeepers"*, `:1356`). The table's own words: "A CITADEL is inner and a GATE is a point — neither is a line around the town." | `defenseInstitutionBuckets.js:169-182`; the catalogue rows above | the roster row |
| **F1-08** | a **GATE** — safe on every catalogue wall row except a **Citadel-only** town, where `hasGates` is false and `safetyProfile.js:463-464` prints *"no gates to bribe and no checkpoints to avoid"*. (`hasGates` fires on `gates`, `town walls`, `city walls`, `massive walls`, `palisade` — `priorityHelpers.js:53`.) | `priorityHelpers.js:53`; `safetyProfile.js:463-464` | the flag |
| **F1-30 / W-03** | denying a body a **CUSTOM row** supplies. A DM's rampart reads `walls ABSENT` to the flag; a custom "Night Watch" is invisible to the buckets and visible to the safety surface. **Write around an absence rather than asserting it.** | `customContentSemanticAuthority.js:22-32` **[CT]** | the roster |
| **F1-31** | naming a **TIER** — "a village this size", "too small for stone", "a city". The preimage spans thorp to (stripped) city. | `{r.tier}` prints verbatim beside the name and population, `OverviewTab.jsx:247` **[CT]** | the strip |
| **F1-32** ⭐ | a **wall MATERIAL**. `Palisade` = *"sharpened stakes"*; `Palisade or earthworks` = wooden/earthen; `Town walls` = *"Stone fortifications"*; `City walls and gates` = *"Masonry walls with towers"*. `Citadel`, `Gates (if walled)`, `Massive walls and fortifications` fix nothing and are free. **The read is a boolean, so no material word survives the whole preimage.** | the rows' own printed descriptions, `institutionalCatalog.js:97`, `:342`, `:874`, `:1332`, `:1910`; `institutionVocabulary.js:155`, `:157`, `:162`, `:278` **[CT]** | the row's description |
| **F1-33** | a material **SOURCE** — "cut from its own woods", "the stone of the country" — where a fortification chain runs | `supplyChainData.js:873-884` **[CT]** | the chain |
| **F1-40 / W-10** ⚠ | **outrunning the BADGE.** The `Beasts & Monsters` row prints a `scoreBand(scores.monster)` badge immediately beside this prose, computed from **different inputs than the key**. An intensity word ("hopeless", "desperate", "adequate", "holding well") can sit beside a `STRONG` or `CRITICAL` badge that says otherwise. | `DefenseTab.jsx:150-183`; `defenseScoreBands.js:33-39` **[CT]** | the badge — but §S-1 holds this **flagged, not chargeable**, until the card prints the band spread over the key's domain |
| **F1-102** | the country's approach or terrain against the config — a pass, a harbour, a cliff, cultivated fields, a forest edge — where `terrainType`/`tradeRouteAccess` print otherwise | `config.terrainType` on the overview **[CT]** | the config |
| **F1-126** | a **minted PROPER NAME** borne by the face — a person, a lane, a tavern, a family. The face is authored once and prints identically on every town on this key. | no per-town field denies it, which is why no licence test catches it; the `{npc}` slots and the NPC roster are the name authority **[CT]** | — |
| **F2-01** | **any magnitude** the read does not hand you, in a digit or a word: a headcount on the works, a length of circuit, "a handful", "no more than a dozen", "half the town" | the band vocabularies are closed | — |
| **F2-02 / F2-03** | a **date, season, month or duration**; a **founding or raising** of the works — "built in the old lord's time", "raised when the creatures first came" | `history.age` is frozen at birth and rerollable; `institutionFounding.js`'s closed kinds **[CT]** | — |
| **F2-05** ⭐ | an **ELAPSED COURSE** — "has stood", "still", "no longer", "since", "thinner than it was", "again", "would not last a winter", "for more than a night" | `ageBands.js`'s `HISTORICIZE_BAND = 'years-past'`; a birth-time STATE carries no origin stamp, so it bears no temporal register whatever **[CT]** | — |
| **F2-06** | a **RATE** — "most nights", "seldom", "every spring", "more often than not" | nothing bands a rate anywhere in the engine **[CT]** | — |
| **F2-07** | an **AGE OF FABRIC** stated as an age, against the printed `{hist.age} years old`. *(Age-FLAVOUR that does not contradict the printed age is free: "older work than the arrangement that pays for it".)* | `OverviewTab.jsx:251`, `:259` **[CT]** | the printed age |
| **F2-08** | a **TREND** — "doing less each season", "the thinning is not being reversed", "worse than it was" | a trend asserts a past STATE the engine does not hold | — |
| **F2-09** | a dependency on a **history field**: this key reads none, so a historical allusion desyncs on a reroll button, not only on a tick | `historyPreservation.js:1-30` **[CT]** | — |
| **F3-05** ⚠ *most likely to recur* | **cultural furniture the profile denies** — thatch, hearth-smoke, the churchyard, the market green, snow on the road, a north-European village | `cultureProfiles.js:50-600`, twelve profiles; no defence pool reads it **[CT]** | the profile |
| **F3-06** ⚠ | an unnamed person's act **in the tier's SINGULAR office**. `TIER_MANDATORY_ROLES` emits exactly one **Guard Captain** per village-plus, with a generated personality, disposition and secret. "The one who keeps the gate key is slow to answer at night" reads, to every reader, as a statement about Guard Captain ⟨Name⟩ on the NPC tab. **The rider: an unnamed person may act freely — use a plural, a trade, a bystander, or an office the roster does not seat.** | `npcGenerator.js:1511-1537` **[CT]** | the NPC roster |
| **F4-01** | a **rotting, weathering or eroding** perimeter — and equally, any face asserting the **permanence** of an institution row. No material decay clock exists; the calamity path demotes and ruins built fabric. | `calamityKernel.js:96-151`, `:251`, `:259-275` **[CT]** | the model |
| **F4-02 / F4-03** ⭐ | **two purses split at birth** — "the wall is kept up and the men are not", "the wall paid for itself", the watch flush while the muster starves. ONE multiplier `milUpkeepMult = min(1, 0.6 + econOutput/50 × 0.4)` runs over garrison wages **and** wall maintenance together; the four gates differ in degree, never in direction. | `defenseGenerator.js:182`, `:189-192`, `:223`, `:251`, `:614` **[CT]** | the model |
| **F4-04** | a **total collapse** — "nothing has been paid in a year", "there is nobody left". The licensed extreme is short, late, thin — never none. ⭐ **Men drifting off slowly IS the model's own word** (`defenseGenerator.js:186-187`, *"unpaid soldiers desert slowly"*) — R-9 struck the old no-headcount bar; a headcount remains F2-01. | `defenseGenerator.js:186-192` **[CT]** | the model |
| **F4-05** ⭐ | **`plagued` read as DISEASE.** And its second half: on a `Very Safe` town the same page prints *"The constant monster threat keeps the guard exceptionally well-drilled and alert"* (`safetyProfile.js:276`, measured) — so a **cowed, terrified, sickened** town contradicts the panel beside it. | `monsterThreat.js:28` **[CT]**; `safetyProfile.js:276` (measured) | the label / the panel |
| **F4-06** | the **readiness band explained by the works** — `readiness = avgScore + tierBonus − threatPenalty`, and the band moves while every wall row is unchanged | `defenseGenerator.js:510` **[CT]** | the model |
| **F4-07** | the river or the coast doing **nothing** for the town's defence — riverside and coastal carry a small positive multiplier | `defenseGenerator.js:129-135` **[CT]** | the model |

### 0.6.2 The frozen/live seam rows that reach this pool (§1.4 — read before charging anything)

- **W-09** ⭐ **the engine's own prose sits directly beside this pool and is wrong.** `threatAssessment.js` branches on the *snapshot* flags and, for exactly this state (`hasWalls`, no garrison, no militia, no charter), prints verbatim: *"Walls exist but no organized force to sustain a watch rotation. The palisade creates a chokepoint but holding it requires people, and there are not enough for sustained watch."* — **on a town whose row is `Town walls` (stone) or `City walls and gates` (masonry).** Under **R-1** the record is the FIELD, so the face stands and a WIRING row is filed; the rewrite may be correct about stone while the line beside it says palisade. ⚠ Note also the branch ORDER: `hasCharter` is tested **before** `hasWalls`, so a walled, charter-holding town on this key gets the engine's *"No perimeter, but the charter hall…"* line. All measured: the string is `threatAssessment.js:66`, the sibling strings `:59` and `:52-58`, the branch order `:52-71`.
- **W-11** — DS-DEF-2's box is two clocks inside one `<div>`: rows 1–2 (beasts, invasion) live, rows 3–5 snapshot. The live rows are the record.
- **W-02** — a `Household levy` on the roster against a "no organised force" reading is a WIRING row for the *neighbouring* pool; **for this key it is simply a body the roster prints and the key does not read.** Do not deny it.
- **W-01** — `hasMercenary` fires on a `Veteran's lodge` / `Hireling hall` while `forces.mercenary.present` does not. Two engine surfaces disagree; **no face may be charged on such a town.**
- **W-04** — the GARRISONED gloss ("a force the town PAYS for") is satisfied by walls or a citadel alone. The KEY is the record; a **pay** claim is the finding, the gloss is wiring.
- **R-2** — a first-survey band and a live band are two measurements, not a contradiction. A face may not be failed for disagreeing with the band on the other clock.

### 0.6.3 The CLOSED ROSTERS this pool touches — a body the roster does not carry may not be asserted

1. **`DEFENSE_BUCKET_KEYWORDS`** — seven buckets and no eighth (`defenseInstitutionBuckets.js:83-107`): `walls` · `garrison` · `militia` · `watch` · `mercenary` · `charter` · `magicDef`. The key reads three; four stand unread.
2. **The `walls` bucket's reachable rows** — `Palisade` · `Palisade or earthworks` · `Town walls` · `Gates (if walled)` · `City walls and gates` · `Citadel` · `Massive walls and fortifications`, plus any custom row whose name carries `wall`/`citadel`/`palisade`/`earthwork`. **There is no other wall-class object in the estate** — no moat, no ditch, no barbican, no rampart as a row. The card's own `may NOT` bars *another civic object of the class `wall`* for the same reason.
3. **`MONSTER_FAMILY_OF`** — a closed three (`plagued` · `frontier` · `heartland`→`settled`), asserted total in both directions by the desk suite and the vocabulary walker (`defenseStateProse.js:279-284`). No fourth country-state may be named.
4. **`TIER_MANDATORY_ROLES`** — the tier's singular offices (one Guard Captain at village-plus, one Mayor, one High Priest) **[CT]**. See F3-06.
5. **The band vocabularies** — `scoreBand`, `QUANTITY_BANDS`, `AGE_BANDS` — closed; no magnitude outside them.

### 0.6.4 The faith axes
**Not applicable — this is not a faith pool.** DS-DEF-2 reads no deity entry, no `rankAxis`, no `standing`, no `suppressed` flag. `deityTemper()`, the pantheon rank, the settlement standing and the suppressed flag have no bearing on any face here, and no face may reach for them: floor 3 bars any predicate on a deity from any desk.

---

## 1. VARIANT 1 · `[ledger]`

**(1) Number and angle.** Variant 1 · `[ledger]` (`RECEIPT_POOLS_DOSSIER_STATE.md:2601`).

**(2) The shipped sentence, verbatim**
> {settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night.

**(3) Every claim it makes, one per line**

| # | the claim | verdict |
|---|---|---|
| 1 | something that counts as a perimeter stands at {settlement} | **SAFE** — read (b), `forces.walls.present` true by the key |
| 2 | that thing is **a wall** | **CONTRADICTED** on the share of the preimage whose only live row is `Citadel` (*"Inner fortress. Last refuge in siege."*, `institutionalCatalog.js:1931`) or `Gates (if walled)` (*"Controlled entry points with gatekeepers"*, `:1356`) — a citadel is inner and a gate is a point, neither is a wall round the town (F1-07; `defenseInstitutionBuckets.js:169-182`). **The roster row is the record.** On palisade, earthwork, town-walls and city-walls towns the claim is safe. |
| 3 | **nobody** to man it | **CONTRADICTED** (F1-25, the negation direction). At town, `Town watch` is `required: true` with *"Night patrol and gate duty"* (`institutionalCatalog.js:1348`; `priorityHelpers.js:48`); at thorp a `Household levy` may stand (`:104`); and the key never consults the `watch`, `mercenary`, `charter` or `magicDef` buckets (`defenseInstitutionBuckets.js:83-107`). **The roster row is the record.** The licensed kernel underneath is exact and undamaged: *no garrison and no militia.* |
| 4 | the perimeter is **the line** | **SAFE** as a word (W20's layer bar is struck). It inherits claim 2's object-class risk and nothing more. |
| 5 | the line **is a chokepoint on paper** | **SAFE.** No field denies a chokepoint; `Gates (if walled)` is *"Controlled entry points"* in its own description, and the engine's own beside-prose says as much at `threatAssessment.js:66`. ⚠ *craft only:* that engine string is where the shipped word came from, so the phrase is a borrowing, not an invention. |
| 6 | **a chokepoint requires people standing in it** | **SAFE.** A general statement about a chokepoint; nothing in the record denies it. The old generalisation bar is struck; it survives only as a craft question (does a maxim earn its place here?). |
| 7 | this town **cannot supply** those people | **CONTRADICTED** by claim 3's grounds on the town share (the required watch is precisely people the town supplies for the gate), **and FLOOR-2** as a modal prediction the pulse adjudicates. |
| 8 | …**for more than a night** | **FLOOR-2** — a duration the read does not hand you (F2-02), and an elapsed-course register on a birth-time state (F2-05). |
| 9 | *(not stated)* the country is plagued | **not a claim — a gap.** The shipped `[ledger]` row states read (b) and read (c) and **drops read (a) entirely**: nothing in it says why an unheld perimeter matters here rather than anywhere. This is the single largest loss in the pool. |

*Two walls of my own brief that this sentence breaks and a face may not: the `, which` tail, and (craft) the summarising second clause.*

**(4) The reads this variant reaches.** All three, as §0.4. It presently uses (b) and (c) and abandons (a).

**(5) What would be false here.** Claim 3 is F1-25 verbatim and is the pool's defining trap. Claim 2 is F1-32/F1-07's object question. Claims 7 and 8 are floor 2. See §0.6 whole.

**(6) The preimage.** §0.5. Note especially that this face must be true of a thorp behind sharpened stakes with a household levy **and** of a town inside stone walls with a required part-time watch on gate duty.

**(7) The angle's stance.** The ledger is the compiled record's own entry: the office sets the standing facts down in the order a clerk would, lands on the civic thing, and stops. Under the new law it **may** name a duty, use a record word, cite its own record, and name an unnamed officer's act — what it may not do is speak a magnitude or a tense the record does not carry, or deny a body the roster prints.

**(8) The turns worth keeping.**
- **"a chokepoint on paper"** — survives the new test whole and is the best three words in the pool. Carry it verbatim into a face (it is unsafe only where `Citadel` alone stands, and it does not require the word *wall*).
- **"has a wall and nobody to man it"** — the pool's one real compression, and its second half is now the finding. **The lawful form at the same compression exists and must be reached for:** the object stands, and neither of the two bodies the key reads stands to it. Do not spend two flat sentences where one licensed compression stood.
- **The two-sentence shape itself** (a flat entry, then the qualification in its own sentence) is the ledger's shape and is worth keeping.

**(9) ⭐ Where the flavour is, for this variant.** See §4 for the pool-wide seam. For the ledger specifically: the record's own idiom for a thing that is *entered* but not *worked* — a perimeter that exists as an arrangement and not as a practice — is available without any person noun at all, and the gate is the one part of it the record positively says is worked (`Town watch`'s service row is literally `Gate duty: {on: true}`, `institutionServices.js:1324` **[CT]**). The ledger can state the whole of read (c) as a fact about what the town's arrangement *does not include* — no muster, no drill, no call — rather than as a fact about who is absent.

---

## 2. VARIANT 2 · `[visitor]`

**(1) Number and angle.** Variant 2 · `[visitor]` (`RECEIPT_POOLS_DOSSIER_STATE.md:2602`).

**(2) The shipped sentence, verbatim**
> A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal.

**(3) Every claim it makes, one per line**

| # | the claim | verdict |
|---|---|---|
| 1 | a stranger is at {settlement} and **walks** | **SAFE.** W27's stance rules are struck: a stranger may act, be turned away, be told the wrong thing, pay twice. The stranger is unnamed and holds no office, so F3-01 and F3-06 are clear. |
| 2 | what is walked is **the perimeter** | **CONTRADICTED** on the `Citadel`-only / `Gates (if walled)`-only share, exactly as variant 1 claim 2 (F1-07; `institutionalCatalog.js:1931`, `:1356`). **The roster row is the record.** |
| 3 | **long stretches** of it | **FLOOR-2** — an extent, which is a magnitude the read does not hand you (F2-01 names distance and volume). ⚠ *the softest of this packet's floor-2 calls:* "long" is nearer atmosphere than arithmetic, and a refuter charging it should say so. It is also doubtful on a thorp palisade. |
| 4 | it is **good work** | ⭐ **SAFE.** The engine models **no** condition, quality or soundness on any wall row anywhere this desk reads — and silence is permission. Only an AGE or a DECAY reading would trip F2-07 / F4-01. *This is a claim the old law killed and the new law hands back; the rewrite should notice.* |
| 5 | **nobody on them** | **CONTRADICTED** — identical to variant 1 claim 3 (F1-25). `Town watch` required at town with night patrol and **gate duty** (`institutionalCatalog.js:1348`); `Household levy` at thorp (`:104`); four unread buckets. **The roster row is the record.** |
| 6 | the country around is one where an unheld perimeter **matters** | **SAFE** as to the fact — read (a), the region is plagued by monster activity. ⚠ it must never slide to disease (F4-05), and the threat is **country-scoped**, never a totality over the town. |
| 7 | it matters **a great deal** | **SAFE** as a claim (nothing denies it); a gloss, so a **craft** question only. ⚠ *it is also where the sentence spends its ending on a judgement instead of a thing.* |

**(4) The reads this variant reaches.** All three. This is the only shipped row that carries read (a) at all, and it carries it as a frame rather than a fact.

**(5) What would be false here.** Claim 5 (F1-25); claim 2 (F1-07). Beyond the sentence, the visitor angle is where F3-05 (cultural furniture: thatch, hearth-smoke, snow, a churchyard, a market green) and F3-06 (the Guard Captain) will be reached for hardest, because a stranger's arrival invites scene-setting. Neither is available. F1-126 also bites here: a stranger who is given a name, or who drinks at a named inn, prints that name on every town on the key.

**(6) The preimage.** §0.5. A stranger arriving must be able to arrive at a thorp ringed with stakes, a town inside stone, and a stripped city inside masonry with towers — and at a town whose culture profile is not north-European.

**(7) The angle's stance.** The visitor is a stranger meeting the town from outside: an arrival, an approach, a transaction, a refusal, a thing noticed. Under the new law it may **do** things and **be done to** — the stance is no longer an eye only. What it may not do is carry a magnitude, a history, or a scene the culture profile denies.

**(8) The turns worth keeping.**
- **"A stranger"** — the stance noun and a lawful opener (it is not the proper slot, and the town's name is not the dossier's default opener).
- **"in a country where"** — the frame that carries read (a), and the one licensed bridge from the perimeter to the threat. Its completion should be the country's own fact rather than a verdict on it.
- **"good work"** ⭐ — **safe, concrete, and previously cut.** Keep it or something as physical.
- **the "finds … with …" construction** — perception plus an absence found is the right shape for read (c); only the *persons* in it are the finding.

**(9) ⭐ Where the flavour is, for this variant.** A stranger at a perimeter meets it from the **outside first**, and nothing in the record touches the outside: the ground the works are built on, the approach worn to the gate, what is stacked against the outer face, what is or is not penned out there at dusk. And the arrival itself is an event the record permits in full — being stopped or not stopped at a gate that is worked while the length between gates is not, being asked a question or not asked one. None of the three shipped rows lets anybody speak, arrive, or be turned away.

---

## 3. VARIANT 3 · `[unfolding]`

**(1) Number and angle.** Variant 3 · `[unfolding]` (`RECEIPT_POOLS_DOSSIER_STATE.md:2603`).

**(2) The shipped sentence, verbatim**
> The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed.

**(3) Every claim it makes, one per line**

| # | the claim | verdict |
|---|---|---|
| 1 | **the works at {settlement}** stand | ⭐ **SAFE** on every row in the bucket — the one noun in the pool that is true across the whole preimage. |
| 2 | they are **doing less** | **FLOOR-2** — a comparative against a past state on a birth-time world (F2-05, F2-08). Nothing denies a declining effectiveness; the record simply holds no earlier reading to decline from. |
| 3 | **each season** | **FLOOR-2** twice — a season (F2-02) and a rate (F2-06). |
| 4 | **the watch** is a standing body here | **CONTRADICTED** on the thorp/hamlet/village share: no watch row exists below town, `inst.hasWatch` false (`priorityHelpers.js:48`), and `safetyProfile.js:300`, `:309` print the denial beside the prose (F1-01). **The roster row is the record.** ⚠ On the **town** share the watch *is* standing and required, so the noun is true there — which is exactly what makes it unusable: a pooled face is drawn by both. |
| 5 | the watch **thins** | **FLOOR-2** as a trend (F2-08). ⭐ *But note what is NOT a finding any more:* thinning as such is the model's own word — `defenseGenerator.js:186-187` reads *"unpaid soldiers desert slowly"* and R-9 struck the old no-headcount bar. **A standing condition of thinness is licensed; a course of thinning over time is not.** A count is still F2-01, and an emptied town is still F4-04. |
| 6 | the works do less **because** the watch thins | **SAFE** as a causal claim (no field joins them, and no field denies the join) — but it stands on claims 2 and 4, so it inherits both. |
| 7 | the thinning **is not being reversed** | **FLOOR-2** — an elapsed course in the progressive, and a prediction the pulse adjudicates (F2-05). |
| 8 | *(not stated)* the country is plagued | **a gap.** Like the `[ledger]` row, this one never says what country the town is in. Two of three shipped faces drop the pool's whole first leg. |

**(4) The reads this variant reaches.** It uses (b) and a wrong-bodied substitute for (c), and drops (a).

**(5) What would be false here.** Claim 4 is the F1-01/F1-25 pincer in its purest form. Claims 2, 3, 5 and 7 are four floor-2 breaches in one sentence — **this is the most floor-2-loaded row in the pool**, and the cure is not a softer trend word but a standing condition. See the conversion in §4.2.

**(6) The preimage.** §0.5. The face must be true of a town whose watch is required and standing, and of a hamlet that has no watch row at all.

**(7) The angle's stance.** `[unfolding]` cannot mean *a course over time* — floor 2 forbids every tense that would carry one. What it can lawfully mean is **an arrangement read as a thing with parts in tension**: a present state whose pieces do not fit each other, or a civic matter stated as standing open now. The state, not the story of the state.

**(8) The turns worth keeping.**
- **"The works at {settlement}"** ⭐ — lawful across the entire preimage, concrete, and it does not open on the proper slot. **This is the pool's floor: it must survive into the rewrite.**
- The shape *"X, and Y is not Z"* — a standing matter left standing, with the second clause refusing to close it — is the right shape for this angle and can be rebuilt on present-tense content.
- Nothing else of the sentence survives; four of its eight claims are floor-2 and one is a contradiction.

**(9) ⭐ Where the flavour is, for this variant.** The lawful version of "unfolding" here is the **mismatch between the thing and the arrangement**: a perimeter sized for a turn-out that the town has no means of calling. The record hands that over directly — `Citizen militia`'s own description is *"Able-bodied residents drill and muster against local threats. Part-time service."* (hamlet, `institutionalCatalog.js:335`) and *"Organised community defense. Musters for raids and monster incursions."* (village, `:867`) and *that row is absent by construction on this key*. So the concrete gap is not a headcount but a **missing practice**: no drill, no call, no muster ground in use, no arrangement by which the town's own people are turned out. A thing that is bigger than its use is a standing condition, not a trend, and it is the sharpest image the key owns.

---

## 4. THE POOL, WHOLE

### 4.1 ⭐ WHERE THE FLAVOUR IS — the pool-wide reading

**(i) The gate is the one part of the perimeter the record says is *worked*, and no shipped row touches it.** `Town walls` is *"Stone fortifications **with gates**"*; `Gates (if walled)` is *"Controlled entry points **with gatekeepers**"*; `City walls and gates` is *"Masonry walls with towers. **Multiple gatehouses**"*; and `hasGates` fires on a palisade too (`priorityHelpers.js:53`). Meanwhile the body that is standing on the modal town does *gate duty* by its own service row. So the record's true shape here is not an empty wall — it is **a worked point and an unworked length**. That is a specific, visual, plot-bearing fact, it is available without naming the watch as a body (name the duty, not the roster row), and all three shipped rows missed it.

**(ii) The perimeter has two sides and a use, and the record is silent about both — which means both are the writer's.** No condition field, no age field, no wear field exists on any wall row this desk reads; only decay and age are barred. So: what leans against it, what is stacked on it, what is penned against it, what path is worn along its inner face, what grows on the earthwork, who sits on it. The contradiction table's own licensed example for a quiet town is *children on the earthwork*; the plagued town's version of that image is the same object put to an unmilitary use while the country outside is what it is.

**(iii) The threat is COUNTRY-scoped, so everything outside the perimeter is open ground for the writer, and no shipped row goes out there.** `plagued` means monster activity in the surrounding region. The road, the woodlot, the water, the fields, the herd, the distance to the next place, the hour at which an errand stops being ordinary — every one of those is untouched by the record and every one of them is where a plagued country actually shows. All three shipped rows stand on the wall and look at it. ⚠ And two of the three never mention the country at all, which is the pool's largest loss of truth.

**(iv) The absence has a SHAPE, and it is not "nobody".** The bodies the key actually reads absent are a garrison (*"Professional soldiers. Noble or royal."*) and a citizen militia (*"Able-bodied residents drill and muster against local threats"* (`:335`) / *"Organised community defense. Musters for raids and monster incursions"* (`:867`) / *"One able-bodied adult from each household musters… when danger reaches the fields"*). What is missing is therefore **a practice and an arrangement** — a drill, a call, a turn-out, a muster ground with a use — not a population. That is both the lawful form and the better one: it is concrete, it opens a question rather than closing one, and it survives every town on the key.

**(v) ⛔ THE CRAFT FACT THAT SHOULD DECIDE THE REWRITE: the empty wall is already said twice on the same page.** For every town on this key, `invasionRowPoolKey(walls=true, garrison=false, militia=false)` resolves `Invasion & War: walls with NO force`, which renders in the **same box, two lines below** (`DefenseTab.jsx:150-183`), and whose shipped faces read *"walls and nobody to put on them"* and *"a serious perimeter and a serious absence of anyone standing in it"* (`RECEIPT_POOLS_DOSSIER_STATE.md:2640-2643`). DS-DEF-11's wall-rationale mount prints on the same tab as well. **The unheld perimeter is therefore spoken three times in one box, and this pool is the only one of the three that can say why the country outside makes it matter.** A `Beasts & Monsters` face that spends itself on the empty wall is redundant at render even when it is lawful in isolation. *(This is a craft finding at the pool grain — the DULL verdict's own territory — not a floor-1 finding at any face.)*

### 4.2 The floor-2 conversion this pool needs, stated once
Every trend in the shipped rows converts to a standing condition, and the conversion is the improvement, not the tax:
- not *the works are doing less each season* → **the works are sized for a turn-out the town has no way of calling**;
- not *the watch thins* → **the arrangement that would fill the length does not exist** (and, where thinness itself is wanted, a present state of thinness, never a course of thinning);
- not *this town cannot supply them for more than a night* → **the gate is worked and the length between the gates is not**;
- not *the thinning is not being reversed* → **a standing matter named and left open.**
A date closes a question; a standing condition opens one.

### 4.3 The three reads, and the spellings that survive the whole preimage
1. **THE COUNTRY (read a)** — plagued by monsters/creatures, region-scoped. Never disease (F4-05). Never a count or a species. Never an attack that happened (no event provenance on this key). Never a totality over the town, and never a cowed town beside a `Very Safe` panel.
2. **THE PERIMETER (read b)** — "the works", "what the town has built", "what is round it" are safe on every row. "A wall", "the perimeter", "the line" are safe on the palisade/earthwork/town-walls/city-walls share and false on a `Citadel`-only or `Gates (if walled)`-only town. **No material word survives** (F1-32). No second wall-class object. No age, no decay, no permanence.
3. **THE FORCE ABSENT (read c)** — *no garrison and no militia*, and nothing wider. Never "nobody", "no one", "unmanned", "nothing organised", "no guard", "no specialist recourse" — each of those denies a body the roster can print (F1-25). Note that **"the guard" as a word is safe here** (F1-04: `hasMilitaryInst` fires off the walls row itself) and that **"the muster" as a class word is free** while *the muster roll cited as a record* is not (F1-03/F1-24).

### 4.4 The four walls on every face I was given, restated for the drafter
No em dash. No exclamation mark. No digit or percent in a connective. No `which`-clause. Four wording FACES per semantic variant, each a different vocabulary or rhythm inside the voice and never a paraphrase of its sibling; an unweighted seeded roll picks the face at render, so **every face must stand alone**; never trim — the three variants stay three, one for one.

### 4.5 Composition notes the drafter cannot see
- This is a **spine** with **zero modifier mounts**, so at render the face is the whole passage. It should read as a complete entry, not as an opener waiting for a modifier — but it must still end on a noun a future modifier could pick up (the works · the country · the gate · the muster).
- A sentence face may not open on the `{settlement}` proper slot, and the town's name is not the dossier's default opener; at most one variant of the pool opens on the settlement token.
- Where a face is two sentences, THE THREAD binds: carry a noun forward, or make the change of subject the passage's one turn outward and put it last.
- The echo key is shared by every pool selecting a row of `BEASTS_ROW_POOL`, so an echo counted against this pool may belong to a sibling row of the same table.

### 4.6 Count
**Three shipped variants** — vid 1 `[ledger]` · vid 2 `[visitor]` · vid 3 `[unfolding]` — and three sections above, one per variant. No variant added, merged or removed.

Marker seat: Opus · packet complete.
