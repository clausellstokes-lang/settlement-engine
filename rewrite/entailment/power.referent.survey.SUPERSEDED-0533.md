# REFERENT SURVEY — THE POWER DESK (DS-POW-1 … DS-POW-7)

**Question:** ADDENDUM 11, THE REFERENT LAW — for every institution-class noun this desk can
render, which LAYER the engine gives it (BODY / HOLDER-ORGAN / POWER / ROLE), which reads
resolve to each layer, the engine's own overlaps, the typed slot that names the power, and the
always-safe class word. **This is a research packet. It decides nothing; the chair does.**

**Dock:** `laneRW-DEFW` at `f2da5a3ee` (read-only; nothing staged, nothing run but the printing
card script). Every cite below was re-derived in this tree, not copied from the addendum.

**Sister packet:** `rewrite/entailment/power.survey.md` (the ENTAILMENT question — what a word
MEANS). Its noun inventory is used here and its entailment rows are **not** repeated.

---

## §0 THE DESK, DERIVED RATHER THAN GUESSED

The brief forbids guessing the block prefix set. `scripts/prose-wave-gate.mjs:294-300`
(`SECTION_LEAVES`) makes a **leaf IS a section**, and its own header records why: the first cut
was a hand-written prefix list and it put two prefixes on the wrong desk and left DS-POP on none
(`prose-wave-gate.mjs:278-292`). So the desk is read off its own leaf.

```
node -e "import {DOSSIER_STATE_PROSE_POWER} from './src/data/dossierStateProse/power.generated.js'"
```

| Block | Title (annex) | Pools | RESOLVED | WIRING-UNRESOLVED | Variants | dm-only | Annex |
|---|---|---|---|---|---|---|---|
| DS-POW-1 | Public legitimacy banner | 11 | 1 | 10 | 43 | 1 | `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:1915` |
| DS-POW-2 | Stability + governing authority header | 9 | 8 | 1 | 31 | 0 | `:1998` |
| DS-POW-3 | The Ladder | 5 | 5 | 0 | 16 | 0 | `:2069` |
| DS-POW-4 | Rule and succession | 9 | 7 | 2 | 29 | 0 | `:2116` |
| DS-POW-5 | Ruling structure + the ruling-power lens | 12 | 1 | 11 | 40 | 3 | `:2186` |
| DS-POW-6 | Legitimacy / capture / safety ladder cells | 13 | 7 | 6 | 39 | 12 | `:2276` |
| DS-POW-7 | Blocs, coalitions, the divided court | 20 | 2 | 18 | 58 | 13 | `:2366` |
| **desk** | | **79** | **31** | **48** | **256** | **29** | |

Source-holder standing over the 79 rows (`docs/content/wiring-census.json`): **LICENSED 14 ·
SOURCE-UNRESOLVED 65**; every LICENSED row resolves to a **state organ** — `court` 10, `watch` 2,
`court + watch` 2. **No row on this desk resolves to `muster`, `elders`, `office`, `market`,
`treasury`, `parish`, `toll-bar`, `census`, `road` or `tradition`.** No row is `INTERESTED`.

⛔ **THE STRUCTURAL FACT THAT GOVERNS EVERY ROW BELOW.** *No pool of this desk reads
`settlement.institutions[]`.* The 79 rows' reads are `legitimacy.*`, `power.*`, `factions`,
`reading.rungs*`, `ledger*`, `breakdown*`, `politics.blocs`, `label`, `first`, `name` — and not
one institution field. So the desk has **no BODY read of its own at all**: every body word its
prose uses today (the hall, the watch, the walls, the customs, the granary, the market, the
clerks) is a **baked noun with no row behind it**. The BODY layer reaches this desk only by
borrowing another desk's read, which under law 1 is the layer error the law exists to name.

---

## §1 THE FOUR LAYERS, AS THE ENGINE TYPES THEM (every cite re-derived at `f2da5a3ee`)

| Layer | The engine's typed home | file:line | What the layer answers |
|---|---|---|---|
| **BODY** | `settlement.institutions[]` rows by recorded name; defense bucketing by substring | `src/domain/institutions/defenseInstitutionBuckets.js:83-107` (`DEFENSE_BUCKET_KEYWORDS`), keys exported `:116` | does this thing exist here, and what is it |
| **BODY (roster)** | 238 authored institution rows keyed by name | `src/data/institutionServices.js:8` onward (e.g. `"Town council"` `:32`, `"Courthouse"` `:89`, `"Citizen militia"` `:835`, `"Mayor and council"` `:1069`, `"Professional city watch"` `:1206`, `"Town watch"` `:1322`, `"Village reeve"` `:1346`, `"Town hall"` `:1623`, `"City hall"` `:1629`) | the recorded member |
| **HOLDER-ORGAN** | `HOLDER_KINDS`, twelve, closed | `src/domain/prose/holderTable.js:78-81` | which record keeps this fact |
| **HOLDER-ORGAN (state's four)** | `STATE_ORGAN_KINDS = office · court · treasury · watch` | `holderTable.js:115` | which organs a captured ruling structure reaches |
| **HOLDER-ORGAN (kind→roster)** | `HOLDER_RECORDS`, one row per kind with its services and its citation | `holderTable.js:271-366` — `watch` kind `:318`, services `:319` (Crime reporting · Crime response · Missing persons); `court` kind `:325`, services `:326`; `office` kind `:357`, services `:358`, note `:362-363`; `muster` kind `:280`, note `:285-288`; `elders` kind `:332` | the organ's own books |
| **POWER (settlement-wide)** | `powerStructure.criminalCaptureState` on the five-rung ladder | ladder `src/domain/corruption.js:474`; produced `src/generators/power/rulingStructure.js:755`, returned `:797`; mapped to the WATCH holder `holderTable.js:211` | who has taken the state |
| **POWER (per-faction)** | `factions[].captureState`; the world-run stepper and its settlement rollup | `holderTable.js:129-144` (`capturedRulingStructure`); `src/domain/worldPulse/factionCapture.js:136-144` (`settlementCaptureState`); capture-crossing rungs `:157` | which house has been bought |
| **POWER (per-institution impairment)** | a `corruption`-typed impairment on a SECURITY body, `covert` or revealed | `src/domain/corruption.js:630` (`SECURITY_INSTITUTION_RE = /(watch\|garrison\|constab\|guard\|magistrate\|court\|barracks)/i`), `:662-691` (`compromisedSecurityInstitutions`), the covert/revealed split `:677-680` | which body is bought, and whether the town knows |
| **POWER (patron)** | a brokerage house's patron, closed vocabulary `genesis · captured` | `src/domain/worldPulse/brokeragePatronage.js:59` (`BROKERAGE_PATRON_SOURCES`), eligibility `:74-88` | who owns this house |
| **POWER (bloc)** | `blocs[]{members, glue, end, strain, covert}`; a ruling bloc is a consolidation read | typedef `src/domain/worldPulse/settlementPolitics.js:64-67`; `rulingBlocOf` `:549`, floor `:149`; `coalitionConsolidation01` `:604` | who stands with whom |
| **ROLE (typed, faction-side)** | a member faction's `leaderNpcId` / `leaderName` | `settlementPolitics.js:222`, `:252` | who heads this house |
| **ROLE (typed, rung-side)** | `rungs[]{npcId, name, standing}`, top rung first | `src/domain/townMap/ladderRead.js:95-107` (`ladderRungsOf`); mirror shape `:22-28` | who is where inside a house |
| **ROLE (typed, seat rank)** | `roleSeatFor(dotRank)` → `leader_champion · lieutenant_operator · agent_protege` | `src/domain/worldPulse/npcAgency.js:411-415`; demotion twin `corruption.js:462-464` | how high the buying reached |
| **ROLE (vocabulary)** | `ROLE_CATEGORY_KEYWORDS` (8 categories), `POWER_ROLES_BY_CATEGORY` (143 rows over 8 domains), `FACTION_ROLES` (6 keys) | `src/generators/roleCategory.js:32-68`; `src/data/historyData.js:18-1103`; `src/generators/factionRoles.js:44-61` | the words an office may be called |
| **PERSON** | **never a referent** — `COLUMN_SOURCES.holderRole` is a hardcoded null on every row | `src/domain/institutions/institutionTable.js:215` (`OPEN_BY_LAW.holderRole = 'no typed NPC→institution edge exists; the value is null on every row'`), `:503-509` (basis `absent:…`, the name-regex at `npcProfile.js:341-353` deliberately not called); the register's own statement `src/domain/prose/holderTable.js:32-36` | — |

⭐ **The move grammar already carries the law's shape.** `MOVES.PERSON` asserts *"an office-holder
as office, at most one recorded act"* and licenses *"a role: an office roll, `role`,
`holderRole`"* (`src/domain/prose/moveGrammar.js:41`). The REFERENT LAW's role clause is that
move, restated; `holderRole` being null everywhere is why the licence is empty on this desk.

---

## §2 WHAT THIS DESK CAN ACTUALLY PUT ON A PAGE

Four slots fill; eight do not (`src/domain/display/stateProse/powerStateProse.js:858-876`, `:909`,
`:994`, `:639`).

| Slot | Fill | file:line | Layer of the fill |
|---|---|---|---|
| `{settlement}` | `settlement.name` | `powerStateProse.js:858` | the town (not an institution) |
| `{seat}` | `powerStructure.governingName` | `powerStateProse.js:860`, `:875`; produced `src/generators/power/rulingStructure.js:787` | **POWER** — a governance LABEL, not an institution row |
| `{faction}` | the **same** `governingName` string | `powerStateProse.js:876`, `:909`, `:953` | **POWER** |
| `{counterpart}` | `readings.contenders.challengers[0].name` | `powerStateProse.js:994`; produced `src/domain/rulingPowerCoup.js:87-105` | **POWER** (a rival faction's name) |
| `{npc}` | `reading.rungs[0].name` | `powerStateProse.js:639`; produced `ladderRead.js:95-107` | **ROLE** (the top rung's holder) |
| `{institution}` | **deliberately unfilled** | `powerStateProse.js:914-916` | would be **BODY** — absent |
| `{band}` `{reason}` `{good}` `{route}` `{timeband_since}` `{timeband_age}` | unfilled | `powerStateProse.js:914-916`, `:928-940` | — |

⚠ **THE TWO-BAG NOTE IS A REFERENT COLLISION THE ENGINE ALREADY RECORDS.**
`powerStateProse.js:862-873`, verbatim in part: *"{seat} CARRIES TWO INCOMPATIBLE ROLES ACROSS
THESE BLOCKS… In DS-POW-1 every {seat} seam is the governing BODY… In DS-POW-2 it is the HALL, a
PLACE the body occupies… No hall-name producer exists"*, so DS-POW-2 leaves `{seat}` unfilled and
keeps 21 of 31 variants. This is law 3 (same word, same referent) failing **at the slot**, not at
the sentence — and the fix the engine took was to drop the variants, not to change the word.

---

## §3 THE LICENCE CARDS AS PRINTED (eight RESOLVED pools, one per block plus two)

`node scripts/prose-licence-card.mjs <block> "<pool>"`, run in the dock.

| Block :: pool | reads | source line the card prints | may claim |
|---|---|---|---|
| DS-POW-1 :: `governanceFractured true` | `legitimacy`, `legitimacy.governanceFractured` | `court · standing LICENSED · a STATE ORGAN (interested where the town is captured)` | that `governanceFractured (=== true)` holds, as a STANDING fact of the record |
| DS-POW-2 :: `recentConflict present` | `power.recentConflict` | `court · standing LICENSED · a STATE ORGAN` | that `recentConflict` holds |
| DS-POW-3 :: `clear top rung, low instability` | `reading.instability`, `reading.rungs`, `.length`, `.map` | `(none) · standing SOURCE-UNRESOLVED` — *"NO citation is licensed: a face naming a record holder here is refused by arm A13"* | that `instability` holds |
| DS-POW-4 :: `legitimacyHold: public backing hardens the hold` | `legitimacy.govMultiplier` (predicate `> 1`) | `court · standing LICENSED · a STATE ORGAN` | that `govMultiplier (> 1)` holds |
| DS-POW-5 :: `autocrat` | **`politics.blocs`** | `court · standing LICENSED · a STATE ORGAN` | **that `blocs` holds** — see §6 F-2 |
| DS-POW-6 :: `capture pressure ADVANCING` | `breakdown`, `.prosperity`, `.safety`, `power.criminalCaptureState` | `court + watch · standing LICENSED · two-source row · a STATE ORGAN` | that `safety (< 0 AND < 0)` holds |
| DS-POW-6 :: `capture reached a LEADER` | `power.criminalCaptureState` | `watch · standing LICENSED · a STATE ORGAN` | that `criminalCaptureState` holds |
| DS-POW-7 :: `an opposition bloc forms COVERT under an autarchy` | `politics.blocs` | `court · standing LICENSED · a STATE ORGAN` | that `blocs` holds |

Every card prints `covert: no` (§8) and the same closing refusals, including *"a named character
and that character's fate (product scope)"*. **The card already prints the ORGAN half of the
referent layer** (`a STATE ORGAN`) and prints **nothing** for the BODY or ROLE half — the law's
item 2 (a layer tag per read) would be a new column, not a new table.

---

## §4 EVERY INSTITUTION-CLASS NOUN AND ROLE WORD OF THE DESK

Key: **B** = BODY · **H** = HOLDER-ORGAN · **P** = POWER · **R** = ROLE. "Reads on this desk"
names the census reads of DS-POW-1…7 that resolve to that layer; **∅** means *this desk holds no
read at that layer for this noun* — the word is available to the prose and unlicensed by the card.

### 4.1 THE TWELVE HOLDER KINDS (`holderTable.js:78-81`) — the organ words

| Noun | Layers the engine gives it | Engine row (file:line) | Reads on this desk | Safe class word | Overlap |
|---|---|---|---|---|---|
| **the treasury** | H | `holderTable.js:79`; record row `:273` | ∅ | the treasury | a state organ (`:115`) |
| **the muster** | H; B via 5 buckets | `holderTable.js:79`; kind→fields `:188-192` (walls · garrison · militia · mercenary · charter); record row `:280`, note `:285-288` | ∅ — **the desk holds no muster read** | **the muster** (the paid military's class word, ADDENDUM 11) | one institution keeps a muster: the Citizen militia (`:285-288`) |
| **the census** | H | `:79`; row `:290` | ∅ | the census | — |
| **the parish** | H | `:79`; row `:297` | ∅ | the parish | — |
| **the toll-bar** | H | `:79`; row `:304` | ∅ | the toll bar | Town council keeps it (`:311`) |
| **the market** | H; B (roster row `Market square`) | `:79`; row `:311` | ∅ | the market | civic-object class `market` (`wiringCensus.js:1309`) |
| **the watch** | **H (state organ)**; **B (defense bucket)**; **B (two roster rows)**; **P-object (security RE)** | H `:80`, state organ `:115`, row `:318`, services `:319`; bucket `defenseInstitutionBuckets.js:95-97`; rows `institutionServices.js:1206`, `:1322`; security RE `corruption.js:630` | **P** only, indirectly: `power.criminalCaptureState` is watch-HELD (`holderTable.js:211`) in DS-POW-6 ×4. **∅ at BODY.** | **the watch** for the order organ or the watch bucket — **never** for the paid military | §6 O-1, O-2 |
| **the court** | **H (state organ)**; B (`Courthouse`, `Multiple court buildings`); **P-object (security RE)**; and a **fourth, untyped political sense** the desk actually uses | H `:80`, state organ `:115`, row `:325`, services `:326`; rows `institutionServices.js:89`; security RE `corruption.js:630`; the political sense has **no engine row** | **H**: 10 of 14 LICENSED rows resolve `court`. **∅ at BODY.** | the court (the organ); **for the assembly use "the hall"/"the combination"** | §6 O-3 |
| **the elders** | H; B (`Household elder` `:15`, `Village elder` `:26`); R (`elder` a government role keyword) | H `:80`, row `:332`; roles `roleCategory.js:34`, `historyData.js` other/`Elder` | ∅ | the elders (the record); "an elder" is a ROLE word | §6 O-4 |
| **the tradition** | H, with **no institution anywhere in the shipped roster** | `:80`; row `:339` and its note `:343-348` | ∅ | — (SOURCE-UNRESOLVED in every generable town) | — |
| **the road** | H; B | `:80`; row `:350`, services `:351`; field rows `:233-234` (terrainType · monsterThreat) | ∅ | the road register | — |
| **the office** | H — **the compiling record itself**; B (`Town hall`, `City hall`, `City administration`) | `:80`, `OFFICE_KIND` `:84`, row `:357`, services `:358`, and its note `:362-363` (*"a CITATION on a fact sourced here is a finding"*) | ∅ as a holder; the WORD "the office" is used by DS-POW-4/7 as *the seat's authority* | **the office** | §6 O-5 |

### 4.2 THE SEVEN DEFENSE BUCKETS (`defenseInstitutionBuckets.js:83-107`) — body words this desk borrows

| Noun | Bucket keywords | file:line | Layers | Reads on this desk | Safe class word |
|---|---|---|---|---|---|
| **the walls** | wall · citadel · palisade · earthwork · inner citadel · massive walls | `:84-87` | B; muster-held (`holderTable.js:188`) | **∅** — used at `RECEIPT_POOLS…:2305` with no read | the {defwork} (defense desk's) |
| **the garrison** | garrison · barracks · professional guard · professional city watch · multiple garrison | `:88-91` | B; muster (`:189`); security RE | ∅ | the garrison |
| **the militia** | citizen militia · militia | `:92-94` | B; muster (`:190`); the only roster row keeping a muster | ∅ | the militia |
| **the watch (bucket)** | town watch · city watch · professional city watch | `:95-97` | B **and** H — see §6 O-1 | ∅ at BODY | the watch (bucket) |
| **the mercenary company** | mercenary company · mercenary quarter · hired muscle | `:98-100` | B; muster (`:191`) | ∅ | the mercenary company |
| **the charter hall** | adventurers' charter hall / guild hall / multiple adventurers' | `:101-104` | B; muster (`:192`) | ∅ | the charter hall |
| **magic defenses** | wizard · mages' guild · mage · academy of magic · golem workforce · alchemist | `:105-107` | B; **not a muster row** | ∅ | — |

### 4.3 THE SIX DEFENSE GROUP LABELS MINTED **IN THE POWER GENERATOR**

`src/generators/power/governanceNarrative.js:499-506` (`deriveDefenseGroupLabel`), precedence
order: garrison → militia → watch → mercenary company → (small tier) community → **guard**.

| Label | file:line | Layer | Note for the chair |
|---|---|---|---|
| `The garrison` | `:500` | B | the first-match winner |
| `The militia` | `:501` | B | |
| `The watch` | `:502` | B | **the power generator itself uses "the watch" as a body label** — the engine's own precedent for the body sense |
| `The mercenary company` | `:503` | B | |
| `The community` | `:506` (small tiers) | B | the unpaid baseline |
| **`The guard`** | `:506` (fallback) | B | ADDENDUM 11's "the guard is a body word (garrison bucket)" is confirmed here as the **residual** label, not the garrison's own |

⚠ This function is in `src/generators/power/` and **is not read by any DS-POW pool** — it feeds
the governance narrative string, not the prose corpus. A power face using "the guard" is using a
label the power generator mints and the power desk does not read.

### 4.4 THE RULING STRUCTURE — the POWER layer's own nouns

| Noun | Name class / members | file:line | Layers | Reads on this desk | Safe class word |
|---|---|---|---|---|---|
| **`{seat}` (the governing body's name)** | 22 institution-keyed labels + 14 council modifiers + 4 small-tier + 7 town + 11 city/metropolis fallbacks | map `rulingStructure.js:161-175`; modifiers `:196-233`; small `:244-256`; town `:266-287`; city `:288-320`; produced `:787` | **P** (a typed proper slot) — *derived from* a B row name by lowercase substring (`:178-182`) | `factions`, `power.stability`, `label`, `legitimacy.*` | **the ruling structure** / **the seat** | 
| **the hall** | **no producer at all** | `powerStateProse.js:866-870` (*"No hall-name producer exists"*) | would be B (a place) | **∅** — 50 uses in the shipped desk rows | "the hall" is the safest available **place** word precisely because nothing types it |
| **the ruling power** | 6 closed: autocrat · council · theocracy · merchant_league · criminal · mixed | `src/domain/spatial/cohesionWeave.js:134`; archetype→power `:180-186` | **P** (a class of power, not a body) | `politics.blocs` on `autocrat` **only**, and by the wrong route (§6 F-2) | the ruling structure |
| **the government** | `government` = the same string as `governingName` | `rulingStructure.js:792` | P | ∅ (both `previousGovernments` pools are WIRING-UNRESOLVED) | the government |
| **a previous government** | `previousGovernments[]{government, cause, tick, by}`; transfer causes coup · election · succession · conquest · appointment | annex `:2124-2127`; causes `src/domain/rulingPower.js:356`, lawful passage `:376` | P + HISTORY | **∅** — WIRING-UNRESOLVED, 7 variants | the government before this one |
| **`{faction}` / `{counterpart}`** | the faction-name class (guilds, noble houses, Military/Guard, Religious Authorities, Thieves' Guild, Arcane Orders, 25 stress-minted rows, neighbour-injected rows) | `rulingStructure.js:497-682`; `src/generators/power/stressFactions.js:21-385`; `src/generators/steps/neighbourFactions.js:77-130` | **P** (a proper-typed slot) | `factions`, `factions.length`, `label` | **the house** / **the faction** |
| **the archetype** | 13 canonical: government · noble · military · merchant · religious · criminal · arcane · craft · labor · outsider · occupation · civic · other | `src/domain/factionArchetypes.js:34-48` | P (a classification, never a name) | ∅ | — |

### 4.5 THE BLOC LAYER (DS-POW-7)

| Noun | Members / typed shape | file:line | Layers | Reads on this desk | Safe class word |
|---|---|---|---|---|---|
| **the combination / a bloc** | `{id, members[], glue[], end, strain, sinceTick, covert?}` | typedef `settlementPolitics.js:64-67` | **P** | `politics.blocs` (2 RESOLVED rows); 18 rows WIRING-UNRESOLVED | **the combination** (the desk's own word, 32 uses) |
| **a ruling bloc / the majority** | needs ≥ `RULING_CONSOLIDATION_FLOOR` 0.4 **and** the governing faction inside | `rulingBlocOf` `:549`, `:587`; floor `:149` | P | ∅ | the majority |
| **the court (political)** | `coalitionConsolidation01`, 0 = a fully divided court | `:604`, `:633` | P — **and the engine has no row for "court" in this sense** | ∅ (WIRING-UNRESOLVED) | **the hall** — see §6 O-3 |
| **the glue** | 5 closed: compromise · threat · doctrine · patronage · concession, each with an authored `detail` | `classifyGlue` `:423-456`; compromise `:429-437`, threat `:440-441`, doctrine `:444-446`, patronage `:450-451`, concession `:454-455` | P; **patronage is `peopleHeld: true`** (`:451`) ⇒ carries an **R** component the engine types | ∅ | the binding |
| **the end** | 5 closed: seats · doctrine · commerce · survival · patron | `ARCHETYPE_END` `:461-466`; `GOAL_END_HINT` `:469-472` | P | ∅ | what it is for |
| **the receipt** | 5 kinds: formed · realigned · fractured · exposed · deferred | typedef `:66-67`; emitted `:786-986`; conspiracy discovery `:823-828` | P + HISTORY | ∅ | — |
| **a leader tie** | warm 6 (`family · mentor_student · ally · respect · lover · patron_client`), hostile 2 (`rival · enemy`), hard-block strengths 4 (`bitter · mortal · personal · serious`) | `:316`, `:318`, `:320`; read `:357-365` | **R** — the one typed person-edge this desk touches | ∅ (WIRING-UNRESOLVED) | the people at the head of the houses |
| **a member's leader** | `leaderNpcId` / `leaderName` per member faction | `:222`, `:252`; consumed `:427-428`, `:488-489`, `:812-815` | **R**, typed **faction→NPC** (not institution→NPC) | ∅ | the leader |

### 4.6 THE CAPTURE / CRIMINAL LAYER (DS-POW-6)

| Noun | Members | file:line | Layers | Reads on this desk | Safe class word |
|---|---|---|---|---|---|
| **the capture ladder** | none · adversarial · equilibrium · corrupted · capture | `corruption.js:474`; stepper `:479-482`; birth producer `rulingStructure.js:755`, `:764-766` | **P** | `power.criminalCaptureState` — DS-POW-6 ×4 (watch-held) | the capture |
| **an agent / a leader (the rung reached)** | `leader_champion (3) · lieutenant_operator (2) · agent_protege (1)` | `npcAgency.js:411-415`; demotion `corruption.js:462-464` | **R** | **∅ — the pools that split on it read only `criminalCaptureState`** (§6 F-3) | the rung the approach reached |
| **the criminal interest** | — (the desk's own coinage) | — | P | `power.criminalCaptureState` | **the criminal interest** (the desk's safest word: it names no body) |
| **an operation's economic role** | 7 closed: parallel marketplace · duty evasion · unlicensed revenue · money laundering · stolen goods market · protection + extraction · criminal revenue stream | `src/domain/criminalOpRole.js:38-46`, roster `:56-64` | B (what the operation IS) | `name` on the unclassified pool only; 6 of 7 WIRING-UNRESOLVED | the operation |
| **the criminal structure** | organized (Organized Syndicate) · semi-organized · diffuse | `src/domain/display/defenseDisplay.js:160-177` | B | ∅ | — |
| **a corruption impairment** | `impairments[].type === 'corruption'`, `covert` true/false, on a SECURITY body | `corruption.js:662-691`; split `:677-680`; drag `:702-709` | **P over a B** — the law's ORGAN-UNDER-POWER, exactly | **∅ on this desk** (§8) | "the {body} is bought" |
| **a brokerage patron** | genesis · captured | `brokeragePatronage.js:59`; eligibility `:74-88` | **P over a B** | ∅ | the house's patron |

### 4.7 THE LEGITIMACY / LADDER READS

| Noun | Shape | file:line | Layers | Reads on this desk | Safe class word |
|---|---|---|---|---|---|
| **the legitimacy band** | Endorsed ≥75 · Approved ≥60 · Tolerated ≥45 · Contested ≥30 · Legitimacy Crisis <30 | `src/generators/factionDynamics.js:106-112`; ladder text `src/domain/compendium/bandLadders.js:175-181` | a standing of the **seat** held by the **court** | **∅** — all five band pools WIRING-UNRESOLVED | the town's regard |
| **the breakdown** | `{prosperity, safety, defense, food}`, signed, off a neutral base | `factionDynamics.js:179`; inputs `:147-164` | court-held **scores**, not bodies | `legitimacy.breakdown` (DS-POW-6 neutral), `breakdown.prosperity/.safety` (DS-POW-6 capture ×2) | **the factors**: prosperity · safety · defense · food |
| **`governanceFractured`** | boolean; the recorded body is not the deciding one | annex `:1922`; read `powerStateProse.js:250` (`legitimacyLensPoolKey`) | B-configuration whose implied **P is UNNAMED** | `legitimacy.governanceFractured` | "a governing body and a government" (the desk's own, `:1993`) |
| **`govMultiplier`** | 1.30 · 1.15 · 1.00 · 0.80 · 0.60 | `factionDynamics.js:113-118` | a standing over the seat held by **the town**, not by a faction | `legitimacy.govMultiplier` ×3 | the hold |
| **the ladder / a rung / standing** | `rungs[]{npcId, name, standing 0..1}` top-first; caps thorp 1 … metropolis 5 | `ladderRead.js:95-107`; caps `src/domain/worldPulse/npcLadderState.js:107-110` | **R** | `reading.rungs`, `.length`, `.map`, `reading.instability` (5 pools) | the rung / the top of the house |
| **the stability string** | a FREE STRING matched by substring; ~30 generator labels | classifier `powerStateProse.js:305-330`; labels `governanceNarrative.js:249-338`, `src/domain/rulingPower.js:414-420` | B (the body's steadiness) | `first`, `power.stability` | the hall's steadiness |
| **the coup risk label** | Stable · Holding · Contested · Critical. The seat could fall | `src/domain/rulingPowerCoup.js:255-260` | P (the contest) | `label` ×4 | the seat |
| **a challenger / a contender** | `challengers[]{name, archetype, power, weight}`; criminal archetypes excluded by rule | `rulingPowerCoup.js:87-105`, exclusion `:104` | **P** (a faction, not a person) | `label` | **the challenger** = `{counterpart}`, a house |

### 4.8 ROLE WORDS THE DESK RENDERS OR COULD RENDER

⛔ Every row in this table sits on `holderRole === null` (`institutionTable.js:215`). A role word
on this desk names a **vocabulary entry**, never an engine edge to an institution.

| Role word | Typed where | file:line | Layer | Read on this desk | Verdict for the chair |
|---|---|---|---|---|---|
| **the clerk / clerks** | `City Clerk`, `Herald/Town Crier`, `Notary/Scrivener`, `Monastery Archivist`, `Arcane Archivist`, `Cartographer` → title `clerk` | `historyData.js` government + religious + magic + other rows | R | **∅** | used 3× in DS-POW-1 rows that read NOTHING (§9 F-6) |
| **the captain** | `Guard Captain`, `Mercenary Captain`, `Ship Captain`, `Cavalry Commander`, `Naval Commander` → `captain`; `Watch Captain` | `historyData.js` military/economy rows; `factionRoles.js:47-48` (`watch` → Watch Captain, `linkToInst: /watch\|garrison\|barracks\|militia/`) | R | ∅ | the addendum's example role word; typed, unread |
| **the reeve** | `Reeve` → title `overseer`; `reeve` a government role keyword; **`Village reeve` is also an institution row**; **`Elected Reeve` is also a governance label** | `historyData.js` government; `roleCategory.js:34`; `institutionServices.js:1346`; `rulingStructure.js:164` | R **+ B + P** | ∅ | §6 O-6 — the three-layer word |
| **the elder** | `Elder` → `elder`; `elder` a government keyword; `Household elder` / `Village elder` rows; **`elders` is a holder kind** | `historyData.js` other; `roleCategory.js:34`; `institutionServices.js:15`, `:26`; `holderTable.js:80` | R **+ B + H** | ∅ | §6 O-4 |
| **the mayor** | `Mayor`, `Governor`, `Duke/Viceroy` → title `mayor`; `mayor` a government keyword; **`Town Mayor` is a governance label**; **`Mayor and council` is an institution row** | `historyData.js:21-39`; `roleCategory.js:34`; `rulingStructure.js:284`; `institutionServices.js:1069` | R + P + B | ∅ | the same three-layer shape as the reeve |
| **the magistrate** | `Chief Magistrate` → `magistrate`; `magistrate` a government keyword; **`magistrate` is in `SECURITY_INSTITUTION_RE`** | `historyData.js` government; `roleCategory.js:35`; `corruption.js:630` | R + P-object | ∅ | a role word the corruption path treats as a body |
| **the priest** | 15 religious rows → `priest`/`inquisitor`/`templar`/`healer`; `priest`/`priestess` keywords; `FACTION_ROLES.temple` → High Priestess | `historyData.js` religious; `roleCategory.js:42-43`; `factionRoles.js:44-46` | R | ∅ (the theocracy pool is WIRING-UNRESOLVED and `{institution}` unfilled) | — |
| **the factor** | `Trade Factor`, `Grain Factor` → `merchant`; `factor` an economy keyword | `historyData.js` economy; `roleCategory.js:50` | R | ∅ | — |
| **the constable** | `constable` a military keyword; **`constab` is in `SECURITY_INSTITUTION_RE`** | `roleCategory.js:38`; `corruption.js:630` | R + P-object | ∅ | — |
| **the guildmaster / guild master** | `Guild Master`, `Thieves' Guild Master`, `Assassin Guildmaster`; `FACTION_ROLES.merchant` → Guildmaster | `historyData.js` economy/criminal; `factionRoles.js:49-52` | R | ∅ | — |
| **the steward / chancellor / chamberlain / alderman / warden / sheriff / judge / governor / official** | 9 more government keywords | `roleCategory.js:34-36` | R | ∅ | — |
| **the kingpin / crime lord / fence / smuggler / racketeer / corrupt official** | 16 criminal rows; `kingpin` a criminal keyword; `FACTION_ROLES.thieves` → Kingpin, Lieutenant | `historyData.js` criminal; `roleCategory.js:53-56`; `factionRoles.js:53-56` | R | ∅ | DS-POW-6's "an operator" is unspelt from this set |
| **the lord / lady / baron / knight / noble heir** | 9 noble keywords + 9 noble rows; `FACTION_ROLES.noble` → Lord Mayor (`linkToInst` narrowed 2026-08-11, `factionRoles.js:63-100`) | `roleCategory.js:57-60`; `historyData.js` government/noble | R | ∅ | the one role whose institution link the estate has already audited |
| **the archmagister / wizard / magister** | 15 magic rows; `FACTION_ROLES.arcane` → Archmagister | `historyData.js` magic; `factionRoles.js:57-59` | R | ∅ | — |
| **a ruler / rulers** | **NOWHERE** — not in `ROLE_CATEGORY_KEYWORDS`, not in `POWER_ROLES_BY_CATEGORY`, not a `FACTION_ROLES` role | searched `roleCategory.js:32-68`, `historyData.js:18-1103`, `factionRoles.js:44-61` | **none** | ∅ | **used 4× in the shipped desk rows** (§9 F-3, F-7) |
| **an operator** | `lieutenant_operator` is a **seat rank**, not a role title | `npcAgency.js:412` | R (a rank word) | ∅ | — |
| **a creditor / a trader / a partnership** | not a role, not a body, not a holder | — | **none** | ∅ | §9 F-8 |
| **the head (of a house)** | `leaderNpcId` types the thing; "head" is not a vocabulary word | `settlementPolitics.js:252` | R (typed), word untyped | ∅ | acceptable as a position word, not as a person |

---

## §5 THE DESK'S READS, ASSIGNED TO A LAYER

Item 2 of the draft law asks for a layer tag per read. Here is what the tag would say for all
17 distinct reads of the desk (`docs/content/wiring-census.json`, rows `DS-POW-*`).

| Read | Holder kind (census) | Layer the read carries | Pools | Body words it would license |
|---|---|---|---|---|
| `legitimacy` | court | ORGAN-UNDER-POWER (the seat's standing with the town) | DS-POW-1 ×1, DS-POW-6 ×2 | none — the seat is the OBJECT |
| `legitimacy.governanceFractured` | court | BODY-configuration; the implied power is **unnamed** | DS-POW-1 ×1 | the governing body · the government |
| `legitimacy.breakdown` | court | four **scores**, not bodies | DS-POW-6 ×1 | **none** |
| `legitimacy.govMultiplier` | court | a standing over the seat held by **the town** | DS-POW-4 ×3 | none |
| `power.stability` | court | BODY (the hall's steadiness) | DS-POW-2 ×1 | the hall |
| `power.recentConflict` | court | BODY + recorded cause | DS-POW-2 ×1 | the hall |
| `power.criminalCaptureState` | **watch** | **POWER** | DS-POW-6 ×4 | none — the organ is the OBJECT |
| `breakdown` / `.prosperity` / `.safety` | court | scores | DS-POW-6 ×2 | none |
| `factions` / `factions.length` | (unresolved) | POWER (the roster) | DS-POW-2 ×2 | the houses |
| `first` (STABILITY_LADDER) | (unresolved) | BODY (a classifier token) | DS-POW-2 ×4 | the hall |
| `label` (RISK_POOL_OF) | (unresolved) | POWER (the contest) | DS-POW-4 ×4 | the seat · the challenger |
| `reading.rungs` / `.length` / `.map` | (unresolved) | **ROLE** | DS-POW-3 ×5 | the rung · the top of the house |
| `reading.instability` | (unresolved) | **ROLE** (churn) | DS-POW-3 ×4 | the head |
| `ledger` / `ledger.present` | (unresolved) | the record's own presence (OFFICE-shaped) | DS-POW-6 ×2 | none |
| `politics.blocs` | court | POWER | DS-POW-5 ×1, DS-POW-7 ×2 | the combination |
| `name` (operationRolePoolKey) | (unresolved) | BODY (what the operation is) | DS-POW-6 ×1 | the operation |

**Reads that carry a BODY layer: 7 of 17, and every one of them is about the HALL or an
OPERATION — never about a defense body, an order body, or any institution row.**

### 5.1 THE HOLDER TABLE'S OWN MAPPING ROWS FOR THIS DESK'S FIELDS

The census's `source.kind` is derived from these rows, so this is the primary evidence and the
census the reading of it. Each row is `field → {kind, cite, read}` (`holderTable.js:146-240`).

| Field token | Kind | Row (file:line) | Producer the row cites | Layer |
|---|---|---|---|---|
| `govMultiplier` | court | `holderTable.js:215` | `src/generators/factionDynamics.js:127` | a standing over the seat |
| `governanceFractured` | court | `:216` | `factionDynamics.js:133` | BODY-configuration |
| `breakdown` | court | `:217` | `factionDynamics.js:179` | four scores |
| `blocs` | court | `:218` | `src/domain/worldPulse/settlementPolitics.js:992` | POWER |
| `stability` | court | `:219` | `src/generators/power/rulingStructure.js:702` | BODY |
| `recentConflict` | court | `:220` | `rulingStructure.js:702` | BODY + cause |
| **`criminalCaptureState`** | **watch** | **`:211`** | **`rulingStructure.js:797`** | **POWER** |
| `blackMarketCapture` | watch | `:210` | `src/generators/safetyProfile.js:684` | POWER — **unread by this desk** |
| `safetyProfile` | watch | `:212` | `src/generators/economy/economicState.js:873` | BODY-ish — **unread by this desk** |
| `yearsAgo` | elders | `:230` | `src/generators/historyGenerator.js:289` | — unread by this desk |

⭐ **The referent law's split is confirmed at the field grain, not argued.** The four organs a
captured ruling structure reaches are `office · court · treasury · watch` (`holderTable.js:115`);
this desk's fourteen LICENSED rows resolve to **two of them only** — `court` (the seat's own
books: legitimacy, stability, conflict, blocs) and `watch` (the order books: the capture state).
The `muster` kind — the paid military's class word — holds twelve field tokens
(`holderTable.js:188-199`) and **not one of them is read by any power pool.** ADDENDUM 11's
correction ("the class word for the paid military is THE MUSTER … the watch names the watch
bucket or the order organ and never the muster as a whole") is therefore not merely safe on this
desk: **the muster is unreachable from it**, and a power face using the word would be reaching
into DS-DEF's cells.

---

## §6 THE ENGINE'S OWN OVERLAPS (law item 5: a wiring fact, never a writer's choice)

### Alias overlaps — one word, two or more engine rows

| # | Word | The rows it sits in | file:line | Wiring note |
|---|---|---|---|---|
| **O-1** | `professional city watch` | the **garrison** bucket AND the **watch** bucket | `defenseInstitutionBuckets.js:90` and `:96` | the record already flagged in ADDENDUM 11; confirmed verbatim. The module's own header says the redundant-looking entries were left rather than minimised because *"a 'tidy' that changed one match is a defence changing hands in silence"* (`:75-80`) |
| **O-2** | `watch` | (a) HOLDER kind `:80` and STATE ORGAN `:115`; (b) defense BUCKET `:95`; (c) two roster rows `institutionServices.js:1206`, `:1322`; (d) `SECURITY_INSTITUTION_RE` `corruption.js:630`; (e) civic-object class **`force`** `wiringCensus.js:1303`; (f) military role keywords `roleCategory.js:39`; (g) `FACTION_ROLES.watch` `factionRoles.js:47`; (h) the power generator's body label `governanceNarrative.js:502` | — | **EIGHT rows.** The holder kind's own services are *Crime reporting · Crime response · Missing persons* (`holderTable.js:319`) — order records, not defense; but the census's label-half classifier files the word under `force`. The muster kind does **not** contain the watch bucket (`holderTable.js:188-192`), so ADDENDUM 11's rule 5 ("a face never uses 'the watch' for a pay-gate read") is confirmed by construction |
| **O-3** | `court` | (a) HOLDER kind `:80` + STATE ORGAN `:115` (trials, disputes, notary, appeals `:327`); (b) roster rows `institutionServices.js:89`; (c) `SECURITY_INSTITUTION_RE` `corruption.js:630`; (d) civic-object class **`law`** `wiringCensus.js:1310`; (e) **the political assembly — DS-POW-7's own pool names** (`RECEIPT_POOLS…:2366`, `:2404`) with **no engine row at all** | — | **The desk's most-used sense is the one the engine does not hold.** Measured consequence: the census assigned `objectClass: "law"` to `DS-POW-7 :: consolidation 0: a fully divided court` — a pool about bloc consolidation now classified as a law-court object, so the projector's same-class attach refusal (`wiringCensus.js:1294-1298`) would fire between that pool and a real gaol/assize modifier |
| **O-4** | `elder` | (a) HOLDER kind `elders` `:80`; (b) roster rows `Household elder` `:15`, `Village elder` `:26`; (c) government role keyword `roleCategory.js:34`; (d) role row `Elder` `historyData.js` other; (e) governance labels `Elder Consensus` / `Free Elder Council` / `Elder Council` `rulingStructure.js:162-163` | — | four layers on one word; the governance label is the only one this desk can render |
| **O-5** | `office` / `seat` / `council` / `hall` | civic-object class **`hall`** = `['hall','council','charter','seat','office','chamber','moot']` `wiringCensus.js:1312` — while `office` is also a HOLDER kind `:80` / `OFFICE_KIND` `:84`, `council` is a governance label `rulingStructure.js:167` and an institution row `institutionServices.js:32`, and `seat` is the desk's `{seat}` slot | — | the classifier collapses the holder-organ, the power label and the place into one class. `DS-POW-4 :: riskLabel: Critical. The seat could fall` carries `objectClass: "hall"` for this reason |
| **O-6** | `reeve` | (a) institution row `Village reeve` `institutionServices.js:1346`; (b) governance label `Elected Reeve` `rulingStructure.js:164`; (c) government role keyword `roleCategory.js:34`; (d) role row `Reeve` → title `overseer` `historyData.js` government | — | ADDENDUM 11 offers "the reeve" as a specimen ROLE word; in this engine it is **three** things before it is a role, and the mapping at `rulingStructure.js:178-182` is exactly the B→P bridge (an institution row NAME lowercased becomes the governance LABEL) |
| **O-7** | `patron` | (a) a bloc **end** `settlementPolitics.js:463`; (b) a brokerage-house **patron source** `brokeragePatronage.js:59`; (c) a warm leader-tie type `patron_client` `:316`; (d) civic-object class **`temple`** `wiringCensus.js:1311` | — | measured consequence: `DS-POW-7 :: end patron` carries `objectClass: "temple"` — a bloc serving an outside interest is classified as a temple object |
| **O-8** | `guard` | (a) the residual body label `The guard` `governanceNarrative.js:506`; (b) the garrison bucket's `professional guard` `:89`; (c) `SECURITY_INSTITUTION_RE` `corruption.js:630`; (d) civic-object class `force` `wiringCensus.js:1303`; (e) military role keyword `roleCategory.js:39`; (f) the faction name `Military/Guard` `rulingStructure.js:596` | — | "the guard" is safe as a body word and is **also a faction name**, so on a town whose governing faction is `Military/Guard` the same word is the `{faction}` fill |
| **O-9** | `market` | HOLDER kind `:79`; civic-object class `market` `wiringCensus.js:1309`; `DS-POW-6 :: operation role stolen goods market` carries `objectClass: "market"` | — | a criminal-operation pool classified as the lawful market object |
| **O-10** | `council` | governance LABEL (`Town Council` etc., `rulingStructure.js:167`, `:219`, `:247`) **and** institution row `"Town council"` `institutionServices.js:32` **and** a ruling-power word `cohesionWeave.js:134` | — | the same string is a P label, a B row and a P class; `{seat}` renders the first only |

### Key-function overlaps — a pool resolved against another pool's field

| # | Finding | file:line | Consequence |
|---|---|---|---|
| **F-1** | `'autocrat'` appears **exactly once** in the whole `src/domain/display/stateProse/` tree | `powerStateProse.js:801`, inside `politicsPresencePoolKey` (DS-POW-**7**'s presence lens) | — |
| **F-2** | The census bound `DS-POW-5 :: autocrat` to `keyFunction: politicsPresencePoolKey`, `rung: literal`, `reads: ["politics.blocs"]` — so **the one RESOLVED ruling-power pool on the desk reads the bloc layer, not the ruling power.** Its real key is `rulingPowerPoolKey` (`powerStateProse.js:709-712`), which returns the lens word by dynamic lookup and therefore names no literal, which is why its five siblings (council · theocracy · merchant_league · criminal · mixed) stayed WIRING-UNRESOLVED | census row `DS-POW-5 :: autocrat`; `powerStateProse.js:709-712` vs `:797-804` | the printed card licenses *"that `blocs` holds"* on a face about one person deciding. A face written to that card would state the bloc layer under a ruling-structure pool |
| **F-3** | `DS-POW-6 :: capture reached an AGENT of a faction` and `:: capture reached a LEADER` both read **`power.criminalCaptureState` only** — the settlement-wide ladder, whose rungs are `none · adversarial · equilibrium · corrupted · capture` (`corruption.js:474`). **Neither "agent" nor "leader" is a rung.** The seat rank that would license the split is `roleSeatFor` (`npcAgency.js:411-415`) and no census row reads it | census rows; `corruption.js:474`; `npcAgency.js:411-415` | the ROLE-layer distinction the two pool names carry is unlicensed by both cards, which print the identical `may claim: that criminalCaptureState holds` |

---

## §7 THE TYPED SLOTS THAT NAME THE POWER

| Slot / class word | What it names | Typed where | file:line | Rendered on this desk? |
|---|---|---|---|---|
| `{seat}` | the ruling structure by its own generated name | `powerStructure.governingName` | produced `rulingStructure.js:787`; filled `powerStateProse.js:860`, `:875` | **YES** — DS-POW-1/4/5/6/7 |
| `{faction}` | the acting house — **the same string as `{seat}`** on this desk | `governingName` again | `powerStateProse.js:876`, `:909`, `:953` | **YES**, and it is not a second name |
| `{counterpart}` | the top challenger | `challengers[0].name` | `rulingPowerCoup.js:87-105`; filled `powerStateProse.js:994` | **YES** — DS-POW-4, DS-POW-7 |
| `{npc}` | the top rung's holder | `rungs[0].name` | `ladderRead.js:95-107`; filled `powerStateProse.js:639` | **YES** — DS-POW-3 only |
| `{institution}` | a named building or house on the roster | the roster | declared absent `powerStateProse.js:914-916` | **NO** |
| **"the ruling structure"** | the class word for the power | `RULING_POWERS` | `cohesionWeave.js:134` | class word — always safe |
| **"the office"** | the compiling record | `OFFICE_KIND` | `holderTable.js:84` | class word — always safe |
| **"the muster"** | the paid military | `HOLDER_KINDS` | `holderTable.js:79`, fields `:188-192` | class word — **safe, and this desk has no read that would use it** |
| **"the guard"** | a body of the garrison class | residual label | `governanceNarrative.js:506` | class word — safe as a **body** word only |
| a corruption patron | the power over a security body | `impairments[].type === 'corruption'` | `corruption.js:677-680` | **not read by this desk** |
| a brokerage patron | the power over a house | `BROKERAGE_PATRON_SOURCES` | `brokeragePatronage.js:59` | **not read by this desk** |

⛔ **The desk has exactly one power-naming slot, rendered under two spellings.** `{seat}` and
`{faction}` are the same string (`powerStateProse.js:860`, `:876`). Law 3's "same word, same
referent" is therefore **already violated at the fill**, in the opposite direction: two different
words carry one referent. A unit that says "the {seat}" in one sentence and "{faction}" in the
next has said the same name twice and reads as two actors.

---

## §8 VISIBILITY — WHICH FACE MAY NAME EACH STANDING READ

The draft law's item 4 makes visibility follow the power layer. On this desk the engine flag and
the annex tag **do not meet**.

| Standing read | Engine visibility flag | file:line | Census `covert` | Annex tag today | Licensed face, by the engine flag |
|---|---|---|---|---|---|
| `power.criminalCaptureState` — ADVANCING / RECOVERING | **none** (the ladder carries no covert field) | `corruption.js:474` | **false** | every variant `dm-only` (3+3) | the flag says nothing; the tag is the only gate |
| `power.criminalCaptureState` — AGENT / LEADER | **none**; the seat rank that would be covert is unread (§6 F-3) | `npcAgency.js:411-415` | **false** | every variant `dm-only`; annex marks them `PRINT-DEFERRED` (`RECEIPT_POOLS…:2297`) | the flag says nothing |
| a bloc's `covert` | **`Bloc.covert?: boolean`** — a real typed flag | typedef `settlementPolitics.js:67`; written `:904`; conspiracy discovery `:823-828` | **false** | `an opposition bloc forms COVERT` every variant `dm-only` | **DM pen line** |
| glue `compromise` | **`covert: true`** returned by the classifier | `settlementPolitics.js:435` | **false** | every variant `dm-only` | **DM pen line** |
| a corruption impairment | **`covert` true = hidden channel, else a public scandal** | `corruption.js:677-680` | n/a — **not read by this desk** | — | covert ⇒ DM; revealed ⇒ **both faces** |
| `legitimacy.governanceFractured` | none | — | false | 1 of 4 variants `dm-only` | player face |
| `legitimacy.govMultiplier` | none | — | false | none | player face |
| `politics.blocs` (dormant / ruling / glue / end / receipt) | none at the root | — | false | overt except `end patron`, `receipt exposed` | player face |

⛔ **THE MEASURED GAP.** `wiringCensus.js` publishes a frozen COVERT-SOURCE list whose three
entries are `impairment.covert`, `mobilization.covert` and **`blocs.covert`** (`:1256-1258`), and a
row whose reads name one *"may hold no unmarked variant and can never be a candidate on the
player face"* (`:1230-1232`). Across the whole 708-row census **exactly four rows read covert=true,
and all four are DS-WAR-1** (`mobilization.*`). **Zero power rows.** Yet
`politicsPresencePoolKey` **does** read the flag — `const covert = blocs.some((b) => b?.covert === true)`
(`powerStateProse.js:800-802`) — and the pool it returns is `an opposition bloc forms COVERT under
an autarchy`. The census recorded that pool's reads as the root `politics.blocs`, so the
COVERT-SOURCE gate never fires on the one power pool it was written for, and the desk's whole
visibility rule rests on the hand-written annex `dm-only` tag (29 of 256 variants). **Wiring row
for the register car**, not a writer's problem.

---

## §9 FINDINGS — SHIPPED DESK ROWS AT THE WRONG LAYER FOR THEIR READ

Quotes ≤ 12 words. "Read" = the census read the pool actually carries.

| # | Class | Row (file:line) | Quote (≤12 words) | Read | Why it is a layer error |
|---|---|---|---|---|---|
| **F-1** | body word on a score read | `RECEIPT_POOLS…:2305` (DS-POW-6 `neutral baseline`) | *"not the harvest, not the watch, not the walls"* | `legitimacy.breakdown` (**court**) | the breakdown's four members are `prosperity · safety · defense · food` (`factionDynamics.js:179`). "the watch" substitutes a **BODY** (and an order **ORGAN**) for the *safety* score, "the walls" a muster-held **BODY** (`holderTable.js:188`) for the *defense* score. Three layers in one clause, on a read that holds none of them |
| **F-2** | body word on a POWER read | `:2316` (DS-POW-6 `capture RECOVERING`) | *"Prosperity and a working watch did what no investigation did"* | `breakdown.prosperity`, `breakdown.safety` (court), `power.criminalCaptureState` (watch) | the watch appears as a **body that works**; the read whose holder *is* the watch is the capture state, and the read this clause states is a court-held score. Also asserts an absent act ("no investigation") that no field records |
| **F-3** | a person doing something | `:2159` (DS-POW-4 `backing hardens the hold`) | *"a ruler with the town behind them can do things"* | `legitimacy.govMultiplier` (court) | "a ruler" is in **no** role vocabulary of the estate (`roleCategory.js:32-68`, `historyData.js:18-1103`, `factionRoles.js:44-61`); and the clause is a **maxim about rulers generally**, not this town's standing |
| **F-4** | a person doing something | `:2161` (same pool) | *"There are people at {settlement} who would move on the {seat}"* | `legitimacy.govMultiplier` | unnamed persons with intentions and a counterfactual; the read is one coefficient's band |
| **F-5** | a person doing something | `:2169` (DS-POW-4 `rejection is breaking the hold`) | *"The town has turned on whoever sits at {settlement}"* | `legitimacy.govMultiplier` | "whoever sits" is a **person** by circumlocution; the engine's referent is the seat |
| **F-6** | role word with no read | `:1935`, `:1941`, `:1961` (DS-POW-1 `Endorsed` / `Approved` / `Legitimacy Crisis`) | *"the clerks who keep them have stopped chasing what is missing"* | **`reads: []`** — all three pools WIRING-UNRESOLVED | `clerk` is a typed role **title** (`historyData.js` government) with `holderRole === null` (`institutionTable.js:215`); here it is a group of persons performing an act, on a pool that licenses nothing |
| **F-7** | body word + person on an unresolved read | `:1937` (DS-POW-1 `Endorsed`) | *"the watch is not the reason … leaves an operator very few doors"* | **`reads: []`** | the watch as a **body** and an **operator** as a person, both on a pool with no read; the sentence also asserts a causal negative |
| **F-8** | untyped role nouns | `:2230` (DS-POW-5 `merchant_league`) | *"run by people who are also its creditors, and the two roles"* | **`reads: []`** | "creditors" is neither a role vocabulary entry nor a body; "roles" invokes the ROLE layer the desk cannot reach |
| **F-9** | fused agent | `:2175` (DS-POW-4 `previousGovernments present`) | *"The lineage at {settlement} records what took each prior government"* | **`reads: []`** | the lineage as an **agent-source** — the class ADDENDUM 12 R-vi refused on the defense desk ("The roll shows…"); the same shape on this desk, unruled |
| **F-10** | organ word at the political layer | `:2405` (DS-POW-7 `consolidation 0`) | *"The court at {settlement} is divided finely enough that it is cheap"* | **`reads: []`** | "the court" is the HOLDER kind and STATE ORGAN (`holderTable.js:80`, `:115`) and a SECURITY body (`corruption.js:630`); here it means the assembly of houses, a sense the engine holds nowhere. The census's own classifier read it as `objectClass: "law"` (§6 O-3) |
| **F-11** | persons at the head | `:2419` (DS-POW-7 glue `patronage`), `:2489` (`hostile leader tie`) | *"a personal loyalty between the people at the head of it"* | **`reads: []`** | the engine **does** type this (`leaderNpcId` `settlementPolitics.js:252`; `peopleHeld: true` `:451`; tie types `:316-320`) — so the referent is lawful **and the read is absent**. A cure is a WIRING row, not a rewrite |
| **F-12** | a leader acting | `:2476` (DS-POW-7 receipt `fractured`) | *"A leader who bound the combination at {settlement} left the seat"* | **`reads: []`** | a succession event **is** typed (`leaderNpcId` drift, `settlementPolitics.js:795-801`) and unread; as written it is a person performing a closed act on an unresolved pool |
| **F-13** | body word on a body read the desk does not hold | `:2038` (DS-POW-2 `siege matched`) | *"it governs rationing, the gates and the watch rota"* | `first` (STABILITY_LADDER) | "the gates" (walls bucket `:84`) and "the watch rota" (watch bucket `:95` / order organ `:115`) are two BODY referents on a read that carries only the stability classifier token |
| **F-14** | organ verb on a score read | `:1978` (DS-POW-1 `breakdown SAFETY adverse`) | *"Every season {settlement} goes badly policed costs the {seat}"* | **`reads: []`** | "policed" is the order organ as a verb; and "every season … costs" is a rate the read does not carry |
| **F-15** | body word on an unresolved operation read | `:2351` (DS-POW-6 `stolen goods market`) | *"the somewhere is the part the watch has never reached"* | **`reads: []`** | the watch as a body performing (not performing) an act; the pool reads nothing |
| **F-16** | two words, one referent | desk-wide | `{seat}` and `{faction}` fill from the same `governingName` | `powerStateProse.js:860`, `:876` | law 3 inverted: one referent under two spellings, so a unit naming both reads as two actors. Measured cost already paid once: DS-POW-2 drops 10 of 31 variants rather than render the collision (`:866-873`) |
| **F-18** | an UNNAMED power asserted on a band predicate | `:1993` (DS-POW-1 `governanceFractured true`, the `dm-only` variant) | *"{settlement} has a governing body and it has a government"* | `legitimacy.governanceFractured` (court, `holderTable.js:216`) | **the annex's own fence is refuted by the engine.** `RECEIPT_POOLS…:1928-1930` says *"`governanceFractured` is a SEPARATE assertion and is never inferred from a low band — a crisis-band town with an intact hall is a real and common state."* The producer sets `governanceFractured: score < 30` (`factionDynamics.js:133`) on the **identical predicate** as `isLegitimacyCrisis: score < 30` (`:132`), and the display layer records it verbatim: *"the two are COEXTENSIVE at the producer"* (`powerStateProse.js:54-56`, restated `:234-237`). So the four variants assert a **second, unnamed power** ("a government" that is not the governing body) on a read that is the legitimacy score being under 30 — a POWER-layer claim with no typed faction slot behind it, on a BODY-configuration read that is really the crisis band under another name |
| **F-17** | the desk's only PERSON-NAMED slot | DS-POW-3, all 5 pools | `{npc}` = `rungs[0].name` | `ladderRead.js:95-107`; filled `powerStateProse.js:639` | not a defect — **a question the chair must answer.** The draft law says PERSON is never a referent and an individual appears "only as a ROLE word"; DS-POW-3 puts a **recorded name** in subject position. The engine types the edge (NPC→rung inside a faction) even though it types no NPC→institution edge, and the annex fence already bars a fate (*"a name leaving the top rung is a departure from the rung, never from life"*, `RECEIPT_POOLS…:2083-2085`) |

---

## §10 WIRING ROWS AND OPEN QUESTIONS (raised, not decided)

| # | Row | Evidence |
|---|---|---|
| W-1 | `blocs.covert` is on the frozen COVERT-SOURCE list and **no power row reads it**, although `politicsPresencePoolKey` does | `wiringCensus.js:1256-1258`, `:1230-1232`; `powerStateProse.js:800-802`; census `covert=false` on 79/79 |
| W-2 | `DS-POW-5 :: autocrat` is RESOLVED against DS-POW-7's key function by a literal match | §6 F-2 |
| W-3 | The AGENT/LEADER split reads no seat rank | §6 F-3; `npcAgency.js:411-415` |
| W-4 | The desk reads **no institution row**, so every body word in its prose is unlicensed by construction | §0, §5 |
| W-5 | `{seat}` and `{faction}` are one string; DS-POW-2 has no hall-name producer | `powerStateProse.js:860-876` |
| W-6 | The bloc ROLE layer (`leaderNpcId`, tie types, `peopleHeld`, succession drift) is fully typed and **entirely unread** — 18 of DS-POW-7's 20 pools are WIRING-UNRESOLVED | `settlementPolitics.js:222`, `:252`, `:316-320`, `:451`, `:795-801`; census |
| W-7 | The corruption impairment (the law's cleanest ORGAN-UNDER-POWER fact, with a real covert flag) is read by **no desk at all** on the power side | `corruption.js:662-691`; census |
| W-9 | `governanceFractured` and the `Legitimacy Crisis` band are coextensive at the producer, and the annex's PROVENANCE fence asserts the opposite. The display layer already orders LENS C ahead of LENS B *because* of the collapse (`powerStateProse.js:44-60`), so the crisis band prints **both** the ladder line and the fracture line on the same town | `factionDynamics.js:132-133`; `powerStateProse.js:54-56`, `:234-237`; annex `RECEIPT_POOLS…:1928-1930` |
| W-8 | The civic-object classifier files `watch` under `force`, `court` under `law`, `patron` under `temple`, `seat`/`office`/`council` under `hall` — cutting across the holder table's kinds, with three measured mis-classifications on this desk | `wiringCensus.js:1300-1325`; census `objectClass` on DS-POW-4/5/6/7 |
| Q-1 | Is `{npc}` (a recorded name at the top rung) a ROLE read or a PERSON referent? §9 F-17 |
| Q-2 | `governanceFractured` asserts a power the engine does not name. Which layer tag does a read with an **unnamed** power carry? | `:1993` vs `holderTable.js:129-144` |
| Q-3 | `govMultiplier` is a standing over the seat held by **the town**, not by a faction or the ruling structure. Does law 1's "standing read" cover a standing whose holder is the populace? | `factionDynamics.js:113-118` |
| Q-5 | Where a read's implied power has **no typed slot** (F-18, Q-2), does the law refuse the power clause outright, or admit an unnamed-power form ("the decisions are made elsewhere") as a licensed standing read? The desk's shipped rows take the second option four times over and the engine names nobody | `:1990-1994`; `holderTable.js:129-144` |
| Q-4 | ADDENDUM 11 offers "the reeve" and "the captain" as specimen ROLE words. On this desk "the reeve" is an institution row, a governance label and a role keyword before it is a role (§6 O-6). Does the law want a **safe role list** per desk, the way it wants safe class words? |

---

*Packet written by the power-desk referent surveyor, seat Opus 5, from `laneRW-DEFW` at
`f2da5a3ee`. Nothing in the dock was modified, staged or committed; the only executable run was
`scripts/prose-licence-card.mjs`, which prints.*
