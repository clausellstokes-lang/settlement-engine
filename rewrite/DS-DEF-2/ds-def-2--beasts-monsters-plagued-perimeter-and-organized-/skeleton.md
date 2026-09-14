# MARKER SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter AND organized force`

Seat: opus (marker). Test: **ADDENDUM 14** — a face is LAWFUL unless it CONTRADICTS the record; silence is permission; "the card does not license it" is not a finding and the tag `unlicensed` does not exist in this file.
Instrument: `rewrite/recut/CONTRADICTION-TABLE.md` (179 rows, four floors), the block's rulings (`rewrite/rulings-DEF2-v14.txt`), `rewrite/tables-14.txt`.
Status: sections 0–4 complete. Written section by section under the checkpoint law.

---

## 0. THE POOL, THE CARD, THE ROWS

### 0.1 The licence card, verbatim
(`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter AND organized force'`, run read-only in `laneRW-DEF2`)

```
LICENCE (block DS-DEF-2 · role spine · key `Beasts & Monsters: plagued, perimeter AND organized force`)
  reads:      beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  beastsRowSituation(family, perimeter, force) === plagued country, perimeter and force
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading, so every pool
              that selects a row of `BEASTS_ROW_POOL` shares ONE echo key
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  THE TEST (ADDENDUM 14): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. This card says what the read REACHES,
              never the bounds of what may be written.
  may claim:  that the reader selects the row `plagued country, perimeter and force` of
              `BEASTS_ROW_POOL`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a
              dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b),
              another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named
              character and that character's fate; a theological claim about a deity
```

⚠ **One card line is stale and the chair has said so** (CHAIR-NOTE §2.5 item 1): `may NOT` still carries `another civic object of the class 'wall'`, which is T-F12's restatement guard — **struck by name** in the re-cut's WHAT IS NO LONGER A FINDING ("Put the granary and the stores in one breath"). A gate beside a wall is not a finding on this pool; see §5 row 9 for what the gate actually turns on.

### 0.2 The block's header lines (annex `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, `### DS-DEF-2`, lines 2568–2596)

- **BLOCK:** `Defense › Threat assessment (the five readiness rows)` · `defenseProfile.scores{monster,military,internal,economic,disaster} + institutions{walls,garrison,militia,charter} + config.monsterThreat + compound.inst`
- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}`. The card: only `{settlement}` is FILLED at this block's call sites; `{band}` RESERVED; `{route}` unfilled here. **Every face carries exactly `{settlement}` and no other slot.**
- **SECTION-TARGET:** `defense`.
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315`.
- **PROVENANCE + FENCE (the block's own, verbatim in substance):** `buildThreatAssessment` is dossier-native and this shape EXTENDS it; each branch holds exactly ONE string today, so every settlement in a branch says the same words. Two standing defects must not be reintroduced: the `plagued`+nothing branch leaks a lowercase sentence lead, and the walls read must ride the predicate, never a presence check on `institutions.walls` (an empty `walls: []` still contains the key). **Institution presence is a STANDING fact with no recorded history; the causal clauses here are *capability* clauses and never *historical* ones unless the history surface supplies the ancestry.**
- **COMPOSITION FENCES:** role `spine`; a spine takes no relation and no attach set; `form: sentence`; the composer puts the spine FIRST and orders modifiers after it by salience, so **a face is written to read well immediately after nothing and immediately before any sibling modifier**, and must end on a standing civic noun rather than on a gloss. Each face stands alone: an unweighted seeded roll over the index-stable draw picks it.

### 0.3 The pool's shipped rows, verbatim
(the annex bold line ``**`Beasts & Monsters`: `plagued`, perimeter AND organized force**``)

1. `[ledger]` The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly.
2. `[street]` Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual.
3. `[unfolding]` What {settlement} has built is holding against the pressure and is being spent doing it; the posture is survivable, and survivable is the most that can be said of it here.

**VARIANT COUNT: 3** (ledger · street · unfolding), matching the card's `angle:` line. Four wording FACES are owed per variant; never trim; the three variants keep their vids and their order.

### 0.4 What the read actually reads (verified in the lane, read-only)

- `defenseStateProse.js:655` — `beasts: rung(beastsRowPoolKey(settlement?.config?.monsterThreat, walls, garrison || militia))`, where `:623-626` sets `const forces = standingDefenseForces(settlement); const walls = forces.walls.present; const garrison = forces.garrison.present; const militia = forces.militia.present;`
- **R1 · the country's tier.** `measuredMonsterFamily(config.monsterThreat)` (`:331-335`) maps through `MONSTER_FAMILY_OF` (`:279-284`, `heartland → settled`) and returns `null` on an absent value rather than defaulting. Here it is `plagued`.
- **R2 · a wall-class body stands.** `forces.walls.present` — the LIVE roster partitioned by `DEFENSE_BUCKET_KEYWORDS.walls = ['wall','citadel','palisade','earthwork','inner citadel','massive walls']` (`defenseInstitutionBuckets.js:88-95`). Presence only. No condition, no size, no material.
- **R3 · a force stands.** `forces.garrison.present || forces.militia.present` — the garrison bucket (`'garrison','barracks','professional guard','professional city watch','multiple garrison'`) OR the militia bucket (`'citizen militia','militia'`). **NOT the watch, NOT mercenaries, NOT the charter hall**: this key never consults those three buckets.
- `beastsRowSituation` (`:429-441`): `plagued` + perimeter + force → `'plagued country, perimeter and force'`. The predicate is an exact `===`.
- **The engine's own string on this branch** (`threatAssessment.js:52-56`, product code, read here only as register): *"Embattled region: constant creature pressure. Walls and garrison have established a survivable posture. Defense is an ongoing operational necessity."* plus a charter clause. ⚠ that branch tests `hasWalls && hasGarrison` while the pool key fires on `garrison || militia` — the engine string and the pool key do not have the same domain (W-09, a WIRING row; under §R-1 the face stands).
- **What prints beside the face.** The prose box sits directly ABOVE the five bars in one `<div>` (`DefenseTab.jsx:317-321`); the `Beasts & Monsters` bar carries `scoreBand(scores.monster)` as its badge (`:322-341`) and, where the gate is below 1, the line **"Upkeep underfunded: patrol provisioning at NN%"** (`defenseDisplay.js:279`, `:319-321`).

---

## A. THE POOL-WIDE INSTRUMENT — (4) the reads, (5) what would be false, (6) the preimage
*Stated once here in full; each variant below restates the cut that bites its own claims.*

### A-(4) THE READS THIS POOL REACHES — material a writer MAY use, never a bound on what may be written

| | the read | what it hands the writer | what it does NOT hand |
|---|---|---|---|
| **R1** | `family === 'plagued'` | the COUNTRY around the town carries monster activity, at the TOP rung of a closed three-rung band (`plagued` / `frontier` / `settled`). The engine renders that rung "Embattled region: constant creature pressure" (`threatAssessment.js:52`) and "plagued by MONSTER activity" (`SummaryTab.jsx:28`, `:37`) | a count of creatures, a kind of creature, a frequency of attack, a season, a direction, a history of incursions, any claim about the TOWN's safety (that is the `Invasion & War` and safety surfaces) |
| **R2** | `forces.walls.present` | a wall-class body STANDS on the live roster: one of palisade · earthworks · town walls · city walls and gates · massive walls · citadel | which row it is, its material, its height, its condition, its age, whether it was ever tested |
| **R3** | `forces.garrison.present \|\| forces.militia.present` | an organized force STANDS: a garrison-bucket row OR a militia-bucket row | which of the two, how many, whether they are paid, whether they are professional, whether they have ever mustered, whether they hold the wall |

The card names ONE read; it is a conjunction of three measured facts. Under ADDENDUM 14 a face is not *required* to state all three — **stating them is a CRAFT floor, not a floor-1 finding**: the row is keyed on this situation and prints under a badge computed from it, so a face that touches none of the three reads as a non-sequitur beside the bar. (The shipped rows state 3, 0 and 2 of them respectively.)

**The provenance move is OPEN on this pool.** The card prints `source: muster · standing LICENSED`, and the holder always resolves here because the key's own force read guarantees a `Citizen militia` or a garrison-bucket row (`holderTable.js:279-288`). So a muster roll, the returns, the duties, the accounts may be cited by the `[ledger]` stance — W24's record-word bar is struck entire. **Never a number on the roll** (F2-01; R-8).

### A-(5) ⭐ WHAT WOULD BE FALSE HERE — the contradiction rows this pool's key can actually walk into

**THE MEASURED HEADLINE — the badge spread over this key's domain (the §S-1 artifact, derived from `defenseGenerator.js:194-228`; arithmetic read off the source, not executed).**
`monster` = 8 (the `plagued` baseline) + 20 (`hasWalls`) + 20 (`hasGarrison`) or 12 (`hasMilitia`) + 35 (`hasCharterHall`) + 5 (`hasHospital`) + up to 35 tradition bonus, then the gate `min(1, 0.7 + econOutput/50 × 0.3)` applied to the portion above the baseline, then `if (threat === 'plagued') monster −= 15`.
- **floor:** hamlet, palisade + citizen militia, `econOutput` 0 → 8 + (40−8)×0.7 = 30 → 30 − 15 = **15 → CRITICAL**
- garrison instead, same purse → 8 + 40×0.7 = 36 → 21 → **WEAK**
- **ceiling:** charter hall + hospital + traditions, `econOutput` ≥ 50 → capped 100 − 15 = 85 → **STRONG**

⇒ **The badge printed on the same row, immediately under this prose box, spans CRITICAL to STRONG over this pool's own domain.** Every adequacy, sufficiency, security or "it holds" word on any face is F1-40 (*outrunning the readiness BADGE*) on some town in the preimage. Field: `defenseProfile.scores.monster` → `scoreBand()` (`defenseScoreBands.js:33-39`), rendered `DefenseTab.jsx:322-341`. **The badge is a BAND, so the badge is the record** (§R-1). This is the single sharpest row on the pool and it convicts two of the three shipped variants.

| # | the claim that would be false here | the field / file:line that denies it | which is the record |
|---|---|---|---|
| 1 | **any adequacy / sufficiency / survivability word** — "properly", "survivable", "enough", "equal to it", "holds" | `scores.monster` → `scoreBand` (above). **F1-40** | the BADGE |
| 2 | **a WATCH** as a standing body | `inst.hasWatch` false (`priorityHelpers.js:48`) ⇒ `safetyProfile.js:300`, `:309` print the denial beside the prose. This key never reads the watch bucket; and on a militia town a watch is IMPOSSIBLE — `Citizen militia` carries `exclusiveGroup:'civilianDefense'`, "Present only when no professional watch exists" (`institutionalCatalog.js:1340-1354`). **F1-01, F1-26** | the FLAG |
| 3 | **"the garrison"** as the town's own body | `inst.hasGarrison` / the garrison bucket (`defenseInstitutionBuckets.js:88-91`). The key fires on `garrison \|\| militia`, so on half the domain there is none. **F1-02** | the FLAG |
| 4 | **"the militia"** | `forces.militia.present`. At city tier `Garrison` is `required: true` (`institutionalCatalog.js:1925-1930`) and no militia need exist. **F1-03** | the FLAG |
| 5 | **a professionalism word, either direction** — "soldiers", "professionals", "full-time"; and equally "townspeople", "part-time", "they have other work" | at hamlet/village the ONLY force row is `Citizen militia` (`:335`, `:867`); at city `Garrison` = "Professional soldiers. Noble or royal." (`:1925-1930`) and at metropolis `Multiple garrisons` (`:2355`). Both readings are false on half the domain. **F1-27, F1-28** | the ROSTER ROW |
| 6 | **specialists, monster-hunters, a charter hall — asserted OR denied** | `forces.charter.present`, `priorityHelpers.js:51`. The key does not read it. Asserting is **F1-06**; "no specialist recourse", "nobody hunts them", "the town's own people and nobody else" is the NEGATION direction, **F1-25**. The engine's own assess string writes both, by branch (`threatAssessment.js:54-56`) | the FLAG |
| 7 | **a mercenary company** | `forces.mercenary.present` (`:98-100`); ⚠ the flag and the bucket disagree on three rows (W-01) — no face may be charged there, and none should go near it. **F1-05** | the FLAG |
| 8 | **the WALL's geometry** — "a line around the town", "the circuit", "the perimeter", "the ring", "around {settlement}" | `Citadel` = "Inner fortress. Last refuge in siege." (`institutionalCatalog.js:1931-1937`) is in the walls bucket and is not a circuit. **F1-07** | the ROSTER ROW |
| 9 | **the WALL's material, height, thickness, towers** — stone, masonry, timber, stakes, earth | the row's own printed description fixes it, and the domain holds five different ones: `Palisade` "Sharpened stakes encircling the settlement" (`:97-102`) · `Palisade or earthworks` "Basic wooden palisade or earthwork berm" (`:342-348`, `:874-880`) · `Town walls` "Stone fortifications with gates" (`:1332-1339`) · `City walls and gates` "Masonry walls with towers. Multiple gatehouses." (`:1910-1917`) · `Massive walls and fortifications` "Layered wall systems: outer wall, inner wall, citadel ring" (`:2347-2354`). **F1-32**; the material SOURCE is separately barred where a fortification chain runs, **F1-33** (`supplyChainData.js:873-884`) | the ROSTER ROW's description |
| 10 | **a GATE — this one is SAFE and was almost unused** | `hasGates` (`priorityHelpers.js:53`) matches `'gates','town walls','city walls','massive walls','palisade'`, and **every walls-class row the catalogue seats matches it**, so a gate is true across the stock domain. It turns false only on a live roster whose sole walls row is `Citadel`, or on a custom rampart — where `safetyProfile.js:463-464` prints "no gates to bribe and no checkpoints to avoid". **F1-08**, and **F1-30**: write around an absence rather than asserting one | the FLAG |
| 11 | **a TOTALITY of safety** — "nothing gets through", "nothing threatens {settlement}" | `threatAssessment.js:113-130` builds an `Invasion & War` row for EVERY town and prints it one line below this one; `settled`/`heartland` only multiplies threat DOWN. **F1-34** | the printed ROW |
| 12 | **splitting the purse or the four gates** — the wall kept and the muster not; patrols provisioned and the gaol starved | ONE multiplier over "garrison wages, wall maintenance" together (`defenseGenerator.js:182`, `:189-192`); FOUR gates, all `min(1, floor + econOutput/50 × (1−floor))` on ONE input — military 0.6, monster 0.7, internal 0.65, disaster 0.55 — differing in degree, never in direction. **F4-02, F4-03** | the MODEL |
| 13 | **a total collapse of pay** — "nothing has been paid", "there is nobody left to pay" | every gate has a floor and the community baseline is exempt (`defenseGenerator.js:186-192`); on THIS row the floor is **0.70**, so the licensed extreme is *patrol provisioning at 70%* — short, late or thin, **never none**. **F4-04**. Men drifting off slowly IS model-true (`:186-187` "unpaid soldiers desert slowly"; §R-9) | the MODEL |
| 14 | **a HEADCOUNT** or any magnitude of the force or the creatures | **F2-01**; and DS-DEF-5 owns the force's size on the same desk, so a number here collides with that surface as well | the PROMISE |
| 15 | **a rotting, weathering, eroding or spent wall; and equally a permanent one** | no material decay clock exists anywhere; the one clock over built fabric is the calamity-scar half-life (`urbanFabricKernel.js:644-647`), and `calamityKernel.js:96-151`, `:251`, `:259-275` DEMOTES and ruins walls along `UPGRADE_CHAIN_PAIRS`. **F4-01** — both halves | the MODEL |
| 16 | **`plagued` read as DISEASE** | `monsterThreat.js:28`; `SummaryTab.jsx:28`, `:37` print "plagued by MONSTER activity"; disease is the separate `plague_onset` stress (`stressTypes.js:84-92`) and can be on the same page. **F4-05** | the LABEL |
| 17 | **an unnamed person acting IN THE TIER'S SINGULAR OFFICE** | `TIER_MANDATORY_ROLES` emits exactly ONE Guard Captain per village-plus, one Mayor, one High Priest, each with a generated personality, disposition and secret printed on the NPC tab (`npcGenerator.js:1511-1537`, `:117-149`). **F3-06.** An unnamed person may otherwise act freely (W22 struck): use a plural, a trade, a bystander | the ROSTER |
| 18 | **furniture the town's own culture profile denies** — thatch, hearth-smoke, the churchyard, the market green, snow on the road | `cultureProfiles.js:50-600` carries twelve profiles (`arabic`, `east_asian`, `mesoamerican`, `south_asian`, `steppe` among them), rendered on the town's own Daily Life surface; **no defense pool reads the profile**. **F3-05** — the finding most likely to recur | the PROFILE |
| 19 | **terrain or approach** — a pass, a cliff, a harbour, a forest, fields | `config.terrainType` / `tradeRouteAccess` print on the overview and this key reads neither. **F1-102** | the CONFIG |
| 20 | **a minted proper name** — a person, a tavern, a lane, a family | the face is authored once and printed identically by every town in the preimage. **F1-126** | — |
| 21 | **a record cited to a keeper that does not resolve** | **F1-24** — but note the inverse: on THIS key the muster's holder ALWAYS resolves, so the roll, the returns, the accounts and the duties are citable | the HOLDER TABLE |

**THE CLOSED ROSTERS THIS POOL TOUCHES** (floor 1: a body, building, record-keeper, force or faith-house they do not carry may not be asserted):
1. **the institution roster** over the LIVE roster (`priorityHelpers.js:45-77`) — every building and body word on a face answers to it;
2. **the force buckets** (`defenseInstitutionBuckets.js:88-105`): `walls · garrison · militia · watch · mercenary · charter · magicDef`. This key reads three of the seven; the other four are the trap;
3. **the NPC office roster** — reached only if a face names an office (see row 17);
4. **the faction list** — reached only if a face names a faction. It should not.
**This is not a faith pool:** no deity axes, no derived temper, no pantheon rank, no settlement standing, no `suppressed` flag apply. The faith rows of the table (§D) are declared not to bind any defense block.

**TWO SURFACES THAT WILL DISAGREE AND DO NOT CONVICT THE FACE** (§R-1 — where the denying surface is engine PROSE or a stale snapshot, the face stands and a WIRING row is filed):
- `buildThreatAssessment`'s own branch string on this row hardcodes a GARRISON and "Palisade and citizen militia" / "Watch rotations" on branches firing for any walls row (`threatAssessment.js:52-66`, W-09);
- `safetyProfile.js`'s `safetyDesc` says, at the top band on a plagued town, "The constant monster threat keeps the guard exceptionally well-drilled and alert" (`:276`) and, at the bottom, "The militia musters for emergencies only" (`:307`). Engine prose both ways.
- W-11: the pool KEY is live (`standingDefenseForces`) while the `assess` string and `compound.inst` are generation-time snapshots; W-10: the key is boolean and the badge continuous; §R-2: a first-survey band and a live band are two measurements, not a contradiction.
The face is not the defendant in any of these. **Craft still argues against writing a line the box above flatly opposes.**

### A-(6) THE PREIMAGE — the range of towns this key selects

`family === 'plagued'` AND a live walls-bucket row AND a live garrison-or-militia row. **A three-boolean key: one face prints across the whole of it.**

- **Tiers: hamlet · village · town · city · metropolis.** Thorp is OUT — it seats `Palisade` (`institutionalCatalog.js:97-102`) but its only force row is `Household levy` (`:104`), which sits in no bucket, so a walled thorp falls to the sibling key `perimeter but NO force to hold it`.
- **Bottom of the range:** a hamlet behind a wooden palisade or an earth berm, its force a citizen militia of townspeople with other jobs, `econOutput` low enough that the badge beside the face reads **CRITICAL** and the page prints *"Upkeep underfunded: patrol provisioning at 70%"*.
- **Top of the range:** a metropolis behind layered masonry with multiple gatehouses, its force multiple garrisons of professional soldiers, badge **STRONG**, no funding note at all.
- **Every stress state.** None of this block's five key functions reads `config.stressTypes`, so the face prints under an ACTIVE SIEGE banner, an occupation, a famine, a plague-onset quarantine, and under a `Dangerous` safety label as readily as under `Very Safe`. **Write nothing a siege, an occupation or a famine on the same page would make absurd.**
- **Every culture profile** (twelve), **every terrain**, **every route access**, **every printed age**.
- **Both halves of the force read** and **all six walls rows**, which is why every body noun on a face must be a class word and every works noun must be true of a stake fence and of masonry alike.

A face is lawful iff it contradicts no state in THAT range — not merely no field of one town.

---

## 1. VARIANT 1

**(1) Number and angle tag:** variant 1 · `[ledger]`

**(2) The shipped sentence, verbatim:**
> The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly.

**(3) EVERY CLAIM IT MAKES, one per line, tagged on the new test**

1. *The country around {settlement} carries creatures* — **SAFE.** It is R1 itself. `plagued` is monster activity and the engine's own noun on this branch is "creature" (`threatAssessment.js:52`).
2. *The threat is in the COUNTRY, outside the town* — **SAFE**, and it is the clause that keeps the line off F1-34: the town's own safety is the business of the `Invasion & War` row and the safety label beside it, not of this read.
3. *The creatures are numerous — "thick with"* — **SAFE, and this is the file's one contested call, named so the chair can reverse it.** Floor 2a licenses a magnitude "in the band word the read itself hands it". The read hands a CLOSED three-rung band whose top rung is `plagued`, and the engine renders that rung "Embattled region: constant creature pressure". An intensity at the top rung is the band restated in English, not a new magnitude. What WOULD be FLOOR-2 here is a count of creatures, a rate of attack, a comparison against another season, or a density claim about the TOWN.
4. *The town has ANSWERED the threat* — **FLOOR-2.** An elapsed course: the perfect asserting a past act (F2-05), and an event the record never ran (F2-04) — `previousGovernments`-style emptiness is the general case, and this block's own fence says institution presence is a STANDING fact with no recorded history.
5. *The works and the force exist BECAUSE of the creatures* — **FLOOR-2**, by the same clause: a dated cause narrated (F2-02/F2-03 in the causal direction; the card's `may NOT: a dated cause`). Nothing in floor 1 denies a link between the country and the bodies — the record simply never ran the answering. Setting the country and the bodies side by side and letting the reader draw the line is free.
6. *The answer is PROPER* — **CONTRADICTED.** Field `defenseProfile.scores.monster` → `scoreBand()` (`src/domain/display/defenseScoreBands.js:33-39`), printed as this row's own badge at `DefenseTab.jsx:322-341`, directly under the prose box at `:317-321`. **The badge is the record** (a BAND, §R-1), and over this key's domain it reaches **CRITICAL** (§A-(5) headline). F1-40, *outrunning the readiness badge*.
7. *A wall-class body stands — "there is a wall"* — **SAFE.** R2. The noun "wall" survives every row in the bucket including `Citadel`. What would not survive is the GEOMETRY (a line around the town) — see §A-(5) row 8 — or a material.
8. *The wall's use is to be held — "a wall to hold"* — **SAFE.** Manning is not entailed by a walls row, but nothing denies it, and the engine positively puts people on the pay gate for this arm (`defenseGenerator.js:213-215`: "patrol provisioning, bounty purses"). Under ADDENDUM 14 the old strike on "the men on the wall" is gone.
9. *A force of people stands — "there are people"* — **SAFE.** R3, spoken as a plural class word with no count and no body name: the safest form the sentence has.
10. *The force holds the wall — "people to hold it"* — **SAFE.** A relation the record does not compute is not a relation the record denies.
11. *Both the works and the force are IN USE* — **SAFE.** Use is not a modelled field and is not denied.
12. *The use is CONSTANT — "constantly"* — **FLOOR-2.** A rate welded to a habitual (F2-06) and a durative over time (F2-05). The plain habitual survives; the adverb of frequency does not. Note the phrase descends from the engine's "constant creature pressure" / "ongoing operational necessity" — engine prose is not a licence.
13. *The colon gloss: the second half explains what "answered properly" means* — **SAFE on the four floors** (the construction bars are struck). CRAFT: it is the summarising beat, the machine signature, and it buys the reader nothing the first half did not already say.

**Summary for variant 1: one CONTRADICTED (the verdict "properly", against the badge), three FLOOR-2 (the perfect "has answered", the narrated cause, "constantly"), and nine SAFE claims — including four the old licence test struck and the rewrite may now use freely (the manning, the holding, the use, the pairing).**

**(4) THE READS THIS POOL REACHES** — §A-(4) in full. For this variant: the ledger has all three and the shipped row already states all three; it is the only one of the three shipped rows that does.

**(5) ⭐ WHAT WOULD BE FALSE HERE** — §A-(5) entire. The rows this variant's own vocabulary walks into: **row 1** (the adequacy word — it is already convicted on "properly"), **row 8** (its "a wall" is one adjective away from a circuit), **row 9** (any material it might reach for to replace "a wall"), **row 5** (any professionalism word it might reach for to replace "people"), **row 15** (any condition word on the works), **row 13** (any "and they are paid for" or "and nobody pays them" it might add). Closed rosters: the institution roster and the force buckets, as §A-(5) states them. Not a faith pool.

**(6) THE PREIMAGE** — §A-(6). For this variant specifically: "there is a wall and there are people to hold it" must read true of a hamlet's earth berm with a part-time militia under a CRITICAL badge AND of a metropolis's layered masonry with multiple garrisons under a STRONG one, and must not read absurd printed under an ACTIVE SIEGE banner.

**(7) THE ANGLE'S STANCE, in one sentence:** the `[ledger]` records the three standing facts as the office holds them — the country's rung, the works, the force — in the clerk's third person, and it is the ONE angle on this pool licensed to cite its own record, because the muster's holder always resolves here: the roll, the returns, the duties and the accounts are all available to it (never a number on them), and what it may not do is rate the arrangement, date it, or narrate its making.

**(8) THE TURNS WORTH KEEPING** (clauses a face may carry verbatim):
- `The country around {settlement}` — a lawful sentence opener (a capital, not a `proper` slot) and exactly the country-scoped frame the read wants. Carry it.
- `creatures` — the engine's own noun on this branch, sharper than "monsters", "beasts" or "the threat". Carry it.
- `thick with creatures` — survives on the reading at claim 3; the sharpest three words in the pool. **Carry it, and let the refuters rule.** If it falls, the cure is the rung itself, not a plainer word.
- `there is a wall … and there are people` — the paired presence, works first, joined on "and". The pairing is the line's true compression and it is lawful. ⚠ `there is` is the expletive opener the voice rations; carry the pairing, not necessarily the expletive.
- `to hold it` — now lawful and worth keeping: it is the only clause in the shipped row that says what the force is FOR.
- **Not carryable:** `has answered it properly` (a verdict plus a narrated act), `both are in use constantly` (the rate), and the colon-gloss shape.

**(9) ⭐ WHERE THE FLAVOUR IS** — what this pool's states make available that the shipped row never touched:
- **The money has a name on this exact row, and it is "patrol provisioning."** `READINESS_GATE_FOR['Beasts & Monsters'] = ['monster','patrol provisioning']` (`defenseDisplay.js:279`), and where the gate is under 1 the page prints *"Upkeep underfunded: patrol provisioning at 70%"* under the assess text. The generator's own comment for this gate names "patrol provisioning, bounty purses, charter-hall retainers" (`defenseGenerator.js:213-215`), floors it at 0.7, and exempts the unpaid communal baseline. So: the purse, the bounty, the lamp oil, what a party is given to take out with them, what the town argues about at the hall — all on the ground, all bounded (short, never none), and the shipped row says nothing whatever about cost.
- **The ledger's own furniture is back.** The returns, the duties, the roll, a licence, the accounts — W24 is struck and the holder resolves. A `[ledger]` face may enter the works and the muster as items carried standing, and may cite the roll as the record it reads, which no shipped row in this pool does.
- **An unnamed person may act.** Not the Guard Captain (F3-06), but a plural, a trade, a bystander: whoever is paid to walk the ditch, whoever counts the outlying holdings in at dusk, whoever will not take the last stage of the road alone. The record is silent about all of them and silence is permission.

---

## 2. VARIANT 2

**(1) Number and angle tag:** variant 2 · `[street]`

**(2) The shipped sentence, verbatim:**
> Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual.

**(3) EVERY CLAIM IT MAKES, one per line, tagged on the new test**

1. *{settlement} has a defence* — **SAFE**, but note what it is: "Defense at {settlement}" is the tab's own label used as a frame. It asserts no read. The line states R1 nowhere, R2 nowhere and R3 nowhere.
2. *The defence is NOT an emergency arrangement* — **SAFE.** A negated characterisation denies nothing in the record, and the contrast bars are struck. CRAFT: the rejected alternative names no sibling key — the siblings are *perimeter but NO force* and *NO perimeter and NO force* — so the contrast buys nothing a reader can place.
3. *The defence is routine — "it is the week's work"* — **FLOOR-2.** "The week's" welds a frequency to a standing condition (F2-06, the RATE) and the routineness is an elapsed course (F2-05: long enough to have become ordinary). The plain habitual survives; the cadence unit does not.
4. *Rotations exist and are run* — **SAFE as an activity.** Nothing bands or denies a rota. ⚠ TWO traps sit one word away: (a) "rotations" is the engine's WATCH word on this branch (`threatAssessment.js:58`, "Watch rotations are thin", a W-09 wiring row), and naming **the watch** is CONTRADICTED wherever `inst.hasWatch` is false — always, on a militia town (`institutionalCatalog.js:1340-1354`, F1-26, F1-01); (b) a rota with a COUNT or a PERIOD in it ("a rotation every third night") is F2-01/F2-06.
5. *There are GATES at {settlement}* — **SAFE across the stock domain.** `hasGates` (`priorityHelpers.js:53`) matches `'palisade','town walls','city walls','massive walls','gates'`, and every walls-class row the catalogue seats matches one of those; the row descriptions name gates (`Town walls` "Stone fortifications with gates"; `City walls and gates` "Multiple gatehouses") or an encircling line (`Palisade` "Sharpened stakes encircling the settlement"). **CONTRADICTED only** on a live roster whose sole walls row is `Citadel` (`:1931-1937`) or on a custom rampart, where `safetyProfile.js:463-464` prints "no gates to bribe and no checkpoints to avoid" (F1-08; F1-30 says write around an absence, never assert one).
6. *The gates CLOSE* — **SAFE.** An act on a standing object, in the simple habitual, which floor 2b explicitly preserves.
7. *…ON TIME* — **FLOOR-2.** A schedule kept is a rate (F2-06) and nothing in the engine bands one. This is the exact shape the chair's own withdrawn example names: "the gate stands open" is lawful, "the gate stands open more often than not" is not.
8. *NOBODY treats any of it as unusual* — **SAFE on the four floors**, and it should still not be carried, on two named grounds that are not "unlicensed": (a) the licence card's **REFUSED COLUMNS, always** line bars a totality over persons, and no person column in the institution table is ever `closed`; (b) the key reads no `config.stressTypes`, so this face prints under an ACTIVE SIEGE, a quarantine or a famine banner, where a universal calm about the defence reads absurd — the preimage row, §A-(6). It also asserts a mental state of every person in a town whose NPC roster gives at least one of them a generated disposition and a secret (`npcGenerator.js:117-149`).
9. *The comma splice and the five-clause unit* — **SAFE on the four floors** (construction is no longer a finding). CRAFT: a triad of three list items by habit, and a colon-gloss, in a pool whose other two rows also end on a summarising tail — see §4, the DULL verdict.
10. *The line states none of the three reads* — **not a finding; a CRAFT floor.** The row is keyed on a plagued country with works and a force and printed under a badge computed from all three, and this face touches none of them. It is the pool's thinnest row in truth and its richest in invention.

**Summary for variant 2: zero CONTRADICTED, three FLOOR-2 ("the week's", "on time", and the routineness), and seven SAFE — of which the gates, the rotations and the closing are all now available to the rewrite and were struck under the old test. The single item to drop on a named instrument is "nobody".**

**(4) THE READS THIS POOL REACHES** — §A-(4) in full. For this variant: the street has the same three and uses none; the rewrite's whole gain here is that the three become sayable in the town's own words (the country outside, what the town has up, the people it can call on) without losing the shipped line's cadence.

**(5) ⭐ WHAT WOULD BE FALSE HERE** — §A-(5) entire. The rows this variant's own vocabulary walks into: **row 2** (one step from "rotations" to "the watch"), **row 10** (its gates, safe on stock content and false on a citadel-only or custom roster), **row 3/4/5** (any body noun it reaches for to say who runs the rotations), **row 11** (a street voice drifts naturally toward "nothing gets in"), **row 18** (a street face reaches for furniture faster than any other angle: no thatch, no churchyard, no market green, no snow — twelve culture profiles and this key reads none of them), **row 17** (the street's natural instinct is a single named-feeling officer). Closed rosters as §A-(5). Not a faith pool.

**(6) THE PREIMAGE** — §A-(6). For this variant specifically: whatever the street says is ordinary must be ordinary in a hamlet of a few hundred behind a stake fence AND in a metropolis behind layered masonry, in any of twelve cultures, and must not be contradicted by the siege, occupation, famine or plague banner that can print above it.

**(7) THE ANGLE'S STANCE, in one sentence:** the `[street]` sets down how the condition stands as the town itself speaks of it — the country's creatures as a thing lived beside, the works and the muster as things the town has and names — still in the clerk's third person, with no "you", no persona and no assigned reaction, and with the street's licence being its NOUNS and its RHYTHM (W27 is struck: a stance may reach for its own vocabulary), never a mood it attributes to everybody.

**(8) THE TURNS WORTH KEEPING:**
- `Defense at {settlement}` — a lawful opener that is not a `proper` slot and is the street's natural subject. Carry it as a frame the reads then fill.
- `is not an emergency arrangement, it is …` — the structure survives the floors; the antithesis is the line's one real move and a face may keep it if the second half carries a read.
- `the rotations run, the gates close` — two short clauses of licensed content, and the best rhythm in the pool. Carry both; stop at two rather than three; drop `on time`.
- **Not carryable:** `the week's work` (the rate), `on time` (the rate), `nobody treats any of it as unusual` (the totality over persons, §A row and claim 8).

**(9) ⭐ WHERE THE FLAVOUR IS:**
- **The gate is a place, and the pool has never used it as one.** Every stock walls row on this key carries gates or an encircling line; the shipped row used them only to hang a schedule on. What a gate IS on the ground is free and unclaimed: what is brought in through it and what is left outside, who stands at it and who is waved past, what is stacked against it, what the bar is made of, what the last traffic of the day looks like.
- **The country is the street's subject, not the town.** The read is country-scoped, so the town's talk is about OUT THERE: which stage of the road nobody takes alone, what the carters charge for the last leg, which outlying holding still has people on it, what is driven in at dusk and what is written off. A stranger notices the country before the town — and that is the one thing the three shipped rows all leave out.
- **The complaint is licensed and it is about money.** The funding note printed under this very row names *patrol provisioning* and can read as low as 70% (`defenseDisplay.js:279`, `:319-321`; `defenseGenerator.js:213-224`). The town grumbling about what the patrols cost, or about who pays for the bounty, is on the page beside the prose — and the shortfall is bounded, so the grumble is about short and late, never about nothing.

---

## 3. VARIANT 3

**(1) Number and angle tag:** variant 3 · `[unfolding]`

**(2) The shipped sentence, verbatim:**
> What {settlement} has built is holding against the pressure and is being spent doing it; the posture is survivable, and survivable is the most that can be said of it here.

**(3) EVERY CLAIM IT MAKES, one per line, tagged on the new test**

1. *A wall-class body stands at {settlement} — "what {settlement} has built"* — **SAFE on its content.** R2, in a form true of every row in the bucket: it names no material, no size and no row.
2. *…and it was BUILT — the perfect "has built"* — **FLOOR-2 on the tense, and this is the file's second named judgment call.** F2-05 lists the perfect by name ("has stood") as an elapsed course, and F2-03 bars a raising narrated. The phrase carries no date, no builder and no agent beyond the town, so it is the mildest instance of the class the floor names; the chair may read it as a bare relative clause rather than a narration. The cure is one word: the plain present — *what stands*, *what the town keeps up*, *the works*.
3. *There is a pressure on the town* — **SAFE.** R1, in the engine's own noun ("constant creature pressure", `threatAssessment.js:52`). ⚠ the shipped line leaves the pressure's SOURCE unnamed, which is what puts it one reading away from the `Invasion & War` row printed beside it (F1-34's neighbourhood); naming the country closes that.
4. *The works are HOLDING against the pressure* — **FLOOR-2.** A durative asserting a course still running (F2-05), and an outcome the pulse adjudicates: the siege and calamity rolls decide whether anything holds (`stressGenerator.js`, `calamityKernel.js`), and this key reads none of them. Nothing in floor 1 denies that the works work; what the floor denies is the *course*.
5. *The works are BEING SPENT — worn, consumed, used up by the holding* — **CONTRADICTED.** `F4-01`: **no material decay clock exists anywhere in the engine** — no rot, no weathering, no erosion; the one clock over built fabric is the calamity-scar half-life (`urbanFabricKernel.js:644-647`), and the only other movement is the calamity demotion/ruin stamp (`calamityKernel.js:96-151`, `:251`, `:259-275`). **The MODEL is the record.** (The durative is separately FLOOR-2.) ⚠ if "spent" is read as the town's expenditure rather than the wall's wear, the contradiction lifts and F4-02/F4-04 take over: one purse, a floor of 0.70 on this row, never none.
6. *The posture is SURVIVABLE* — **CONTRADICTED, twice.** (a) F1-40: a rating word beside `defenseProfile.scores.monster` → `scoreBand()` (`defenseScoreBands.js:33-39`, `DefenseTab.jsx:322-341`), which over this key's domain reaches **CRITICAL** (§A-(5) headline); the BADGE is the record. (b) FLOOR-2 as well: "survivable" is a prediction the pulse adjudicates (F2-05). "Posture" itself is not a finding — it is the engine's own word on this branch (`threatAssessment.js:53`).
7. *…and survivable is the MOST that can be said of it* — **SAFE on the four floors** (the standpoint and second-fact bars are struck). CRAFT: it is the summarising, self-limiting gloss — the machine signature Part B §16 names — and it spends the line's last beat restating the verdict already charged at claim 6.
8. *R3 is never stated* — **not a finding; a CRAFT floor.** No force appears anywhere in this row: "what {settlement} has built" is the works and "the posture" is an abstraction. The shipped `[unfolding]` row drops one of the three reads outright.
9. *The four-clause semicolon unit* — **SAFE on the four floors.** CRAFT: the third and fourth clauses are a verdict and a gloss on a verdict.

**Summary for variant 3: two CONTRADICTED (the works being spent, against the no-decay-clock model; and "survivable", against the badge), three FLOOR-2 (the perfect "has built", "is holding", and "survivable" again on the tense), and four SAFE. This is the most-charged of the three rows, and its two sharpest clauses are the two that fall.**

**(4) THE READS THIS POOL REACHES** — §A-(4) in full. For this variant: it has all three and uses one and a half; restoring the force is the largest single gain available to the rewrite on this pool.

**(5) ⭐ WHAT WOULD BE FALSE HERE** — §A-(5) entire. The rows this variant's own vocabulary walks into: **row 1** (already convicted on "survivable"), **row 15** (already convicted on "being spent", and equally convicted by the opposite move — "the works will stand as long as the town does" asserts a permanence F4-01's second half refuses), **row 12/13** (this angle drifts naturally toward a trajectory of pay: "thinner each season" is a TREND, F2-08, though a muster thinning as a STANDING condition is model-true, §R-9), **row 14** (a thinning stated as a number collides with DS-DEF-5), **row 11**, **row 8**. Closed rosters as §A-(5). Not a faith pool.

**(6) THE PREIMAGE** — §A-(6). For this variant specifically: an unfolding face is the one most likely to imply a direction of travel, and the key is three booleans that hold still while `scores.monster`, the stressors and the badge all move (E-10, P-1/P-2 — the honest residue). Whatever this face says is in motion must be in motion for a hamlet behind a stake fence under CRITICAL and for a metropolis behind masonry under STRONG, and must survive an ACTIVE SIEGE banner printing above it.

**(7) THE ANGLE'S STANCE, in one sentence:** the `[unfolding]` states the matter that is still running and not yet settled — here the country's pressure, which the record leaves live and closes nowhere — as a STANDING open condition beside the two bodies that stand against it, declarative and never interrogative, never a forecast, never a trend, and never an outcome; what it may not borrow is the ledger's measure or the badge's verdict.

**(8) THE TURNS WORTH KEEPING:**
- `What {settlement} has built` — a lawful sentence opener (a capital, not a `proper` slot) and the truest wall-word the pool has: it holds over a stake fence and over masonry alike. Carry it, or carry its present-tense twin if the chair takes claim 2's reading.
- `the pressure` — the engine's own noun for the creature threat, and better than "the threat" or "the danger". Carry it, and attach the country to it so the read stays country-scoped.
- The two-beat opening shape — the works named, then the pressure they face — survives if the verb between them is not an outcome. The lawful form sets them side by side rather than asserting a result.
- **Not carryable:** `is holding against` (the course), `is being spent doing it` (the decay contradiction), `the posture is survivable` (the badge contradiction and the prediction), `survivable is the most that can be said of it here` (the gloss on a verdict).

**(9) ⭐ WHERE THE FLAVOUR IS:**
- **The open matter is the country, and it never closes.** Nothing in the record ever clears a plagued country — the tier is frozen config, with two reads and zero writers under `worldPulse/` — so the honest unfolding fact is that the arrangement is permanent and the pressure is not going anywhere. That is a standing condition, not a trend, and it is far sharper than "survivable": what the town has is what it will have, and the country outside is the same country tomorrow.
- **The muster may thin, and this is model-true.** §R-9 reversed the old bar: `defenseGenerator.js:186-187`'s own comment reads "unpaid soldiers desert slowly" and the multiplier genuinely reduces the funded force. A muster quietly short of what the purse would pay for is the engine's own consequence — **as a standing condition, never as a trajectory and never as a headcount** (F2-08, F2-01, and DS-DEF-5 owns the number).
- **Age-flavour is free where it does not deny the printed age.** `OverviewTab.jsx:251` prints the town's age beside its name, so nothing may be dated — but a relative age is unclaimed and unused here: the works older than the road, the works older than the arrangement that pays for them, a gate that is older work than what it hangs in. F2-07 now licenses this direction explicitly, and no shipped row in the pool uses it.
- **Tension is a feature the dossier is built to print** (`contradictions.js:136-153`, F1-112): a wall, a force, a country full of creatures, and a purse that stops at 70% is exactly the shape the engine classes as an interesting tension and hangs hooks on. The unfolding angle is the one that can hold all four in one breath without rating any of them.

---

## 4. WHAT HOLDS ACROSS ALL THREE VARIANTS (for the drafter and the refuters)

- **THE POOL-GRAIN CRAFT VERDICT ON THE SHIPPED SET: DULL, and name the collapse.** All three rows are one construction — a compound opening clause, a colon or semicolon, and a summarising tail that rates or glosses what came before. All three end on an abstraction (`constantly` · `unusual` · `the most that can be said of it here`). Not one of the three names a concrete object of the town: not a gate used as a gate, not the road, not what is brought in, not a coin, not a person. The rewrite's first job is three different constructions and three different landings.
- **Four faces per variant, each a different vocabulary or rhythm inside the voice, never a paraphrase of its sibling.** Twelve faces for the pool. Never trim: the three variants keep their vids; a face that fails the gate banks as a refusal row with its measurement.
- **Every face stands alone** (an unweighted seeded roll picks it) and **every face is a SPINE**: it comes first, modifiers follow by salience, and the writer does not choose their order. So each face must read well with nothing after it and with any sibling modifier after it, and must END on a standing civic noun rather than on a gloss — a gloss in the last position is what a following modifier collides with.
- **The thread** (owner, 2026-09-08): where a face runs to two sentences, the second carries a noun forward from the first — the works, the muster, the country, the road, the gate. A face may make one turn outward, and it goes last.
- **The class-word rule, restated as the pool's one hard vocabulary law:** the force is *the muster* · *the town's force* · *the people it can call on* (and, since `hasMilitaryInst` is necessarily true on this key, **"the guard" is also the engine's own word here** — `safetyProfile.js:271`, `:336`, F1-04). It is NEVER *the garrison*, *the militia* or *the watch* by name. The works are *the works* · *what the town has up* · *the wall* — never a material, a height, a circuit or a ring.
- **Three distinct level-1 grammars and three distinct openers.** No two of the three numbered lines share their first two words after slot normalisation; none opens on `{settlement}` (a `proper`-typed slot). Today: variant 1 owns "The country", variant 2 "Defense at", variant 3 "What {settlement}".
- **Slots:** exactly `{settlement}` on every face. `{band}` is RESERVED and `{route}` is unfilled at these call sites — never name the badge word, never name the road's access class.
- **The hard voice walls that survive ADDENDUM 14 untouched:** no em dash; no exclamation mark; no digit or percent anywhere, and none in a connective; no which-clause; no question; no second person; no named character and no character's fate; no theological claim. A comparison is a measurement in words.
- **What ADDENDUM 14 gives this pool back, listed so no seat re-derives the struck law:** the manning of the wall; the force holding it; the use of both; a gate; a rota; an unnamed person (outside the tier's singular office); record words and a citation of the muster roll; the town's own scene nouns; a stance's own vocabulary and rhythm; a vivid material-free particular. **"The card does not license it" is not a finding.**
- **The two judgment calls this file makes, named for the chair to take or reverse:** (i) `thick with creatures` stands as the top rung of a closed band restated in English, not as a floor-2 magnitude (§1 claim 3); (ii) `has built` falls to floor 2b on the perfect, as the mildest instance of the class F2-05 names (§3 claim 2).

---

Status: **COMPLETE** (2026-09-12). Three variants marked; sections 0, A, 1, 2, 3, 4 on disk. Written section by section under the checkpoint law. Nothing outside this file was written anywhere; the only command run in `laneRW-DEF2` was the read-only licence-card script, and every other lane read was a file read.
