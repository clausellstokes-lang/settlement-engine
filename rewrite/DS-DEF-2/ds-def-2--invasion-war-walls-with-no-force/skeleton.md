# SKELETON — DS-DEF-2 · pool `Invasion & War: walls with NO force`

Marker seat: **Opus, for the Fable chair** (REWRITE, block DS-DEF-2). Dock read at `laneRW-DEF2`; every `src/` and `docs/` citation below was opened in that dock and its line numbers measured there. Written under **THE NEW TEST (ADDENDUM 14 + `rewrite/recut/CONTRADICTION-TABLE.md`): a face is LAWFUL unless it CONTRADICTS the record; silence is permission; "the card does not license it" is NOT a finding.** That verdict is never used as a verdict anywhere below; every finding names a FIELD.

**Provenance of every citation.** Files opened and read directly in the dock: `src/domain/display/stateProse/defenseStateProse.js`, `src/domain/institutions/defenseInstitutionBuckets.js`, `src/domain/display/threatAssessment.js`, `src/generators/priorityHelpers.js`, `src/generators/defenseGenerator.js`, `src/generators/steps/assembleInstitutions.js`, `src/data/institutionalCatalog.js`, `src/domain/display/defenseScoreBands.js`, `src/domain/causalState.js`, `src/components/new/tabs/DefenseTab.jsx`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`. Citations marked **[CT]** are carried from `rewrite/recut/CONTRADICTION-TABLE.md`'s own row and were not re-opened here; a refuter charging on one should re-open it.

---

## 0. THE CARD, THE HEADERS, THE SHIPPED ROWS

### 0.1 The licence card, verbatim (`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: walls with NO force'`)

```
LICENCE (block DS-DEF-2 · role spine · key `Invasion & War: walls with NO force`)
  reads:      invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  invasionRowSituation(walls, garrison, militia) (via INVASION_ROW_POOL in defenseStateProse.js) === walls, no force
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation; the relation is the MODIFIER's property, fixed at its freeze (ARCH §4.5)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the file's first dot) and NOT on a producer-token root, so every pool that selects a row of `INVASION_ROW_POOL` shares ONE echo key: a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  THE TEST (ADDENDUM 14, the owner 2026-09-12): a face is LAWFUL unless it CONTRADICTS the record.
              SILENCE IN THE RECORD IS PERMISSION. "The card does not license it" is NOT a finding.
              This card says what the read REACHES, never the bounds of what may be written.
  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)` selects the row `walls, no force` of `INVASION_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a magnitude outside the read's own band word (floor 2a), an elapsed course, a dated cause or a season (floor 2b), a prediction the pulse adjudicates (floor 2b)
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```

⚠ **Two card lines a drafter will misread.**
- `angle: ledger street visitor` is the shipped pool's *current* angle set, not a bound. §0b's palette is seven (`RECEIPT_POOLS_DOSSIER_STATE.md:116-133`) and the rewrite keeps a row's ONE angle tag.
- `source: muster · standing LICENSED` licenses a CITATION of the muster as a holder — but see §5, row **F1-03/R-8**: on THIS key `forces.militia.present` is FALSE, and the muster kind's only holder is `Citizen militia` (`holderTable.js:279-288` [CT]). So the muster ROLL may not be cited as a record here. **"The muster" as a class word stays free everywhere** (F1-03's own second sentence).

### 0.2 The block's header lines (annex `### DS-DEF-2`, `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2590`)

- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `src/components/new/tabs/DefenseTab.jsx:150-183` · the walls predicate `src/domain/causalState.js:300-315` (`defenseProfileHasWalls`).
- **STATE-KEY:** five fixed rows, each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat`, the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` — **but the call site fills `{settlement}` alone** (`defenseStateProse.js:621`, `const slots = { settlement: properFill(text(settlement?.name)) }`). A face using `{band}` or `{route}` renders a literal brace. **Write with `{settlement}` and nothing else.**
- **SECTION-TARGET:** `defense`. **PDF PARITY:** parity (`viewModel.js` defense slice).
- **PROVENANCE + FENCE (the block's own, quoted short):** the shape EXTENDS the `buildThreatAssessment` lattice rather than replacing it; the corpus's job is that each legacy branch holds exactly ONE string, so every settlement in a branch says the same words. Two standing defects must not be reintroduced: the `plagued`+nothing branch's lowercase lead, and the walls read must ride the predicate and never a presence check on `institutions.walls` (an empty `walls: []` still contains the key). **And the fence that binds this pool hardest:** *"Institution presence is a STANDING fact with no recorded history; the causal clauses here are capability clauses (walls without people cannot be held) and never historical ones (walls built after a siege) unless the history surface supplies the ancestry."*

### 0.3 The shipped rows, verbatim (`RECEIPT_POOLS_DOSSIER_STATE.md:2640-2643`)

```
**`Invasion & War`: walls with NO force**
1. `[ledger]` {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else.
2. `[visitor]` A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it.
3. `[street]` The town has the thing that would save it and not the people who would use it, and says so when pressed.
```

Three variants. Three angles: `[ledger]` · `[visitor]` · `[street]`. Four faces are owed per variant ⇒ **twelve faces**.

---

## 0.4 (4) THE READS THIS POOL REACHES — material a writer may use, NOT a bound on what may be written

The key is **one function of three booleans** (`defenseStateProse.js:476-484`):

```js
function invasionRowSituation(walls, garrison, militia) {
  if (walls) {
    if (garrison) return 'walls, professional garrison';
    return militia ? 'walls, citizen militia' : 'walls, no force';
  }
  ...
}
```

and the three booleans are read LIVE at `defenseStateProse.js:623-626`:

```js
const forces = standingDefenseForces(settlement);
const walls = forces.walls.present;
const garrison = forces.garrison.present;
const militia = forces.militia.present;
```

| # | the read | where | what it hands the writer on THIS key |
|---|---|---|---|
| R1 | `forces.walls.present === true` | `defenseInstitutionBuckets.js:169-180` (`standingDefenseForces`), keywords `:84-87` — `wall` · `citadel` · `palisade` · `earthwork` · `inner citadel` · `massive walls` | the town has at least one STANDING wall-class row on the LIVE, ruin-filtered roster (`liveInstitutions(settlement)` first, partition second — `:170`). `count` and `names` are on the same projection and are not read by this key |
| R2 | `forces.garrison.present === false` | bucket keywords `:88-91` — `garrison` · `barracks` · `professional guard` · `professional city watch` · `multiple garrison` | **no** standing professional body of those names |
| R3 | `forces.militia.present === false` | bucket keywords `:92-94` — `citizen militia` · `militia` | **no** standing militia row |
| R4 | the ORDER of the read | the docblock at `:470`: *"A GARRISON OUTRANKS A MILITIA… so `garrison` is read before `militia` on both sides of the wall"* | the eight boolean combinations collapse to six situations. This key is the ONE of the six that is a wall with neither force class |
| R5 | the projection's shape | `defenseInstitutionBuckets.js:146-152` — `present` / `count` / `names` per bucket, TOTAL over `DEFENSE_BUCKET_KEYS` | the same call already resolved `watch`, `mercenary`, `charter`, `magicDef` — **this key does not consult them, and that is the whole of §0.6** |
| R6 | the wall's own ROW | the roster; the catalogue's printed descriptions (`institutionalCatalog.js:97-103` `Palisade`; `:342-348` / `:874-880` `Palisade or earthworks`; `:1332-1339` `Town walls`; `:1910-1917` `City walls and gates`; `:2347-2354` `Massive walls and fortifications`) | the wall is a NAMED thing with a printed description beside the prose. **`{defwork}` is DS-DEF-11's slot, not this block's** — here the wall must be named by a class word true of every row in the preimage |
| R7 | the badge on the same row | `DefenseTab.jsx:322-341` renders `scoreBand(scores.military)`; `defenseScoreBands.js:37-39` — `>=65 STRONG · >=40 ADEQUATE · >=20 WEAK · else CRITICAL` | the prose sits ABOVE five bars (`DefenseTab.jsx:315-320`) and the `Invasion & War` bar carries its own band word. See §0.6 row **F1-40 / W-10** |
| R8 | the legacy sibling string | `threatAssessment.js:117-119`: *"Walls present but no organized military force to man them. A determined attacker takes the walls if they have ladders and time."* | the row a reader expands on the SAME box. It reads the FROZEN snapshot (`d.institutions`, `:34-42`) where the corpus reads LIVE — §0.6.2 W-11 |
| R9 | the eyebrow above the bars | `DefenseTab.jsx:313` — *"…as judged at the first survey; Disasters & Famine is re-judged as the campaign advances."* | the product's own tie-break language. §R-2 [CT]: a first-survey band and a live band are two measurements, not a contradiction |
| R10 | the block's own fence | annex `:2583-2590` | **capability clauses only.** "Walls without people cannot be held" is the fence's own example of the licensed shape |

**The purse, which no shipped row used** (`defenseGenerator.js:186-192`, read in the dock):

```js
// Floor 0.6: built walls keep standing and unpaid soldiers desert slowly, never
// instantly. The community baseline (armed households, terrain alarm) is
// unpaid and exempt — only the funded portion above it is gated.
const milUpkeepMult = Math.min(1, 0.6 + (econOutput / 50) * 0.4);
```

ONE multiplier over *"garrison wages, wall maintenance"* together (`:184-185`). The wall and the wages are **one purse, not two** — this is FOLD's standing hazard row and floor-4 row **F4-02**, and it is the single richest unused fact on this key.

**The arithmetic, also unused** (`defenseGenerator.js:160-165`): `hasWalls +30` · `hasGarrison +28` · `hasMilitia +10` · `hasWatch +7` · `hasMercenary +14` · `hasCharterHall +10`. The record scores the wall a shade ABOVE a garrison. A `[ledger]` face may lean on that ordering; **it may never speak the numbers** (F2-01).

---

## 0.5 (6) THE PREIMAGE — the RANGE of towns this key selects

**A boolean key fires across every tier, country and stress state.** Measured in the dock, from `institutionalCatalog.js` and `assembleInstitutions.js:243-245` (**there is NO tier inheritance** — `catalogForTier` is `institutionalCatalog[tier]`, with metropolis alone merging city ⊕ metropolis):

| tier | the wall row that fires the key | what else the Defense list carries | the reading |
|---|---|---|---|
| **thorp** | `Palisade`, `baseChance: 0.3` (`:97-103`), desc *"Sharpened stakes encircling the settlement. Offers minimal protection…"* | `Household levy` only (`:104-110`), which sits in NO bucket | a palisaded thorp of 4–16 dwellings. **The only tier where "nobody" is close to true** — and even here the levy is on the roster (§0.6.2 W-02) |
| **hamlet** | `Palisade or earthworks` 0.12 (`:342-348`) | `Citizen militia` 0.15 | fires when the palisade lands and the militia does not |
| **village** | `Palisade or earthworks` 0.18 (`:874-880`) | `Citizen militia` 0.22 | same shape, both odds higher |
| **town** | `Town walls` 0.5 (`:1332-1339`), desc *"Stone fortifications with gates."* | **`Town watch`, `required: true`, `baseChance: 1`** (`:1348-1354`), desc *"Part-time guards. Night patrol and gate duty."* · `Citizen militia` shares `exclusiveGroup: 'civilianDefense'` and is crowded out · `Gates (if walled)` 0.5 · `Barracks` 0.3 (`:1363-1369`) · `Free company hall` 0.3 | ⭐⭐ **THE MODAL TOWN OF THIS PREIMAGE IS A WALLED TOWN WITH A REQUIRED NIGHT WATCH.** `required: true` forces the row in (`assembleInstitutions.js:282`), and `Town watch` is in the WATCH bucket, not the garrison one (`defenseInstitutionBuckets.js:90-97`). So this key fires with people standing on the gate |
| **city** | `City walls and gates`, `required: true` | `Professional city watch` `required: true` — in BOTH the watch and the **garrison** buckets (`:92`) — and `Garrison` `required: true` | **the key cannot fire at birth.** It fires only after a lifecycle or calamity path removes the garrison rows while a wall row survives |
| **metropolis** | `Massive walls and fortifications` 0.5 (`:2347-2354`) | merged with the CITY list, so `Garrison` and `Professional city watch` are `required` here too | as city: normally excluded, reachable by ruin |

**And the key is blind to everything else.** Nothing in `invasionRowSituation` reads: `config.monsterThreat` (so `plagued`, `frontier` and `settled` all select this row); the tier; the population; `scores.military`; the stress array; the occupation record; the war record; the culture profile; any history field. A face here is read by:

- a **plagued** thorp behind stakes and a **settled** town behind stone, in the same words;
- a town **under siege** (`stressGenerator.js:107`, `:123` [CT] — walls are a probability MODIFIER on the siege, never a precondition) and a town nothing has ever approached;
- an **occupied** town, where the men at the gate are the occupier's and the town's own roster is untouched (`stressTypes.js:38-39` [CT], *"Local institutions continue under oversight"*; F1-121 — never "the garrison" bare for the occupier's force);
- a town of **any culture profile** — `cultureProfiles.js` carries twelve, and **no defense pool reads the profile** (F3-05 [CT]). No thatch, no churchyard, no market green, no snow on the road.

**The consequence for the drafter, in one line:** every face must be true of a stake-ringed thorp and of a stone-walled town, in peace and under siege, in any country and any culture. Nothing about scale, material, quiet or danger may be assumed.

---

## 0.6 (5) ⭐ WHAT WOULD BE FALSE HERE

### 0.6.0 The one rule that governs this pool

**The key consults THREE buckets. It licenses the denial of TWO bodies and of nothing else.**

This is F4-18's pattern read onto this key: *"naming any of the six force buckets on the `NO organized force at all` key… the key consults SIX buckets, so the pool's own key licenses the denial and denies the body."* Here the key consults `walls`, `garrison`, `militia` (`defenseStateProse.js:623-626`, `:476-484`). Therefore:

- ✅ **You may say there is no garrison.** The key read it and it is false.
- ✅ **You may say there is no militia.** The key read it and it is false.
- ⛔ **You may deny nothing else** — not a watch, not mercenaries, not a charter hall, not arcane provision, not armed households, and above all **not "nobody".**

Every one of the three shipped variants breaks the second half of that rule.

### 0.6.1 The contradiction-table rows this key can actually walk into

| row | the claim that would be false | the field that denies it | how this pool walks into it |
|---|---|---|---|
| **F1-25** ⭐⭐ | **the NEGATION direction — denying a body the roster DOES print** | the same flags read the other way; `priorityHelpers.js:45-77`; `defenseInstitutionBuckets.js:169-180` | THE row for this pool. "nobody to put on them", "a serious absence of anyone standing in it", "not the people who would use it" each deny `forces.watch`, `forces.mercenary`, `forces.charter`, `forces.magicDef` — four buckets the key never read, resolved in the very same `standingDefenseForces` call |
| **F1-01** | a WATCH as a standing body — **and, by F1-25, its denial** | `inst.hasWatch`, `priorityHelpers.js:48`; `Town watch` `required: true` at town (`institutionalCatalog.js:1348-1354`) | at town tier the watch is on the roster by construction. A face denying people on the wall contradicts the modal member of its own preimage |
| **F1-05** | a mercenary COMPANY — **and its denial** | `forces.mercenary.present`, bucket `:98-100`; `Free company hall` 0.3 at town (`institutionalCatalog.js:1370-1376`) sets `hasMercenary` at `priorityHelpers.js:49` | ⚠ and the flag and the bucket DISAGREE on three rows — §0.6.2 W-01. On a Free-company-hall town neither a presence nor an absence face is chargeable |
| **F1-06** | a charter hall / specialist recourse — and its denial | `forces.charter.present`, `priorityHelpers.js:51` | the key never read it |
| **F1-17** | WARDS, counterspells, a standing arcane capability — and its denial | the arcane bucket; `defenseGenerator.js:292-331`; `hasMagicInst` fires on an alchemist | `Wizard's tower` 0.2 and `Alchemist shop` 0.4 sit in the town `Magic` list (`institutionalCatalog.js:1378-1410`) |
| **F1-07 (inverse)** | a CITADEL or a GATE read as a line around the town | `defenseInstitutionBuckets.js:169-182` [CT] — *a CITADEL is inner and a GATE is a point; neither is a line around the town* | `inner citadel` and `citadel` are IN the walls bucket (`:86-89`). So this key fires on a town whose only wall-class row is a **citadel** — and "the circuit", "the ring", "all the way round" is then false |
| **F1-32** | a wall MATERIAL the row's own printed description fixes otherwise | `Town walls` = stone (`:1336`); `Palisade` = sharpened stakes (`:100`); `Palisade or earthworks` = wooden/earthen (`:345`, `:877`); `City walls and gates` = masonry (`:1914`) | "stone", "masonry", "the stonework" is FALSE on every thorp, hamlet and village member of the preimage; "timber", "stakes", "the berm" is false on every town and city member |
| **F1-33** | a material SOURCE — "cut from its own woods", "the stone of the country" | `supplyChainData.js:873-884` [CT] feeds every wall row `rawInputs: ['Quarried stone','Building materials']` | tempting flavour; refused wherever a fortification chain is instantiated |
| **F1-31** | naming a TIER word the identity strip does not print | `{r.tier}` prints verbatim beside the name (`OverviewTab.jsx:247` [CT]) | this key spans thorp→metropolis. **Never spell the band or the tier** |
| **F1-34** | a TOTALITY of safety — "nothing threatens {settlement}" | `threatAssessment.js:113-130` builds an `Invasion & War` row for EVERY town; `monsterThreat.js:20-28` calls `settled` *"the calm baseline"*, a multiplier DOWN and never a zero | the inverse temptation on a `settled` member. **Ease at the town's own grain is free**; a totality is not |
| **F1-40 / W-10** ⭐ | outrunning the readiness BADGE, or attributing a band to works the roster denies | `scoreBand(scores.military)` prints beside the row (`DefenseTab.jsx:322-341`, `defenseScoreBands.js:37-39`); the pool key is three booleans, the badge is a continuous score | walls alone give +30 (`defenseGenerator.js:160`); a watch +7, mercenaries +14, a charter hall +10, arcane +10…+25 (+5, +8), a divine blessing +6, plus `milEffective × 0.35` and a terrain multiplier (`:169-172`). **A member of this preimage can print `ADEQUATE` or `STRONG`.** A face asserting the town falls to anyone is beside a badge that says otherwise. §S-1's instrument note applies: the band spread over the key's domain is owed before an intensity word is fully refutable — **but the direction is not in doubt, and a face that does not reach for an intensity word cannot be charged** |
| **F1-79** | "nothing moves through the gates" on a besieged port | `computeActiveChains.js:756-761` [CT]; walls are a probability modifier on the siege (`stressGenerator.js:107`, `:123`) | the preimage includes besieged and port towns |
| **F1-121** | "the garrison" bare, for the OCCUPIER's force | the occupation record is `{occupierId, state, resistance}` with no garrison field (`occupationStatus.js:74-103` [CT]) | an occupied member of this preimage has men at the gate who are not the town's. Costs one possessive |
| **F1-126** | a minted PROPER NAME borne by the face — a person, a gate, a lane, a tower | a pooled face is authored once and drawn by every matching town, so the name prints identically across a region | the temptation is a named gate. **The wall has no name slot in this block** |
| **F1-117 / F1-118** | a clause arguing against what a `proper` fill's own words assert | `{settlement}` is the only fill here | low risk on this pool; listed for completeness |
| **F2-01** | **ANY magnitude the read does not hand you**, in a digit or in a word — a headcount, a length of wall, a number of gates, "a handful", "not one man" | the engine's band vocabularies are closed; `forces.walls.count` exists on the projection and **this key does not read it** | "nobody", "not one", "a dozen paces" — all of them |
| **F2-02 / F2-03** | a date, a season, a duration; a founding, a raising, a building narrated | `institutionFounding.js` [CT] — *absence is the typed value; no arm ever invents a year*; the block's own fence bars a historical clause | "the wall was raised when…", "since the last trouble" |
| **F2-05** ⭐ | **AN ELAPSED COURSE** — the perfect, the durative, "still", "no longer", "as ever", "thinner than it was"; **and the modal future / the prediction** | `ageBands.js`'s `HISTORICIZE_BAND = 'years-past'` [CT]; the pulse ADJUDICATES every prediction | "A determined attacker **takes** this town" is a prediction in the present indicative; "the thing that **would save** it" is an outcome claim. The subjunctive FORM is lawful (A2's edge); the promised OUTCOME is not |
| **F2-06** | a RATE — "most nights", "seldom manned", "more often than not" | nothing bands a rate anywhere in the engine | the obvious cure for "nobody" is a rate. **It is not a cure.** Write the standing condition instead |
| **F2-09** | a dependency on a field the pool key cannot see | `historyPreservation.js:1-30` [CT] — reroll history replaces `settlement.history` wholesale | this key reads three booleans; a historical allusion desyncs on a button press |
| **F3-05** ⭐ | **CULTURAL FURNITURE the town's own culture profile denies** | `cultureProfiles.js:50-600` [CT], twelve profiles; **no defense pool reads the profile** | the likeliest recurring finding in the whole block. No thatch, no churchyard, no village green, no north-European gatehouse-and-tavern furniture |
| **F3-06** | an UNNAMED person's act in the singular office the tier NAMES | `TIER_MANDATORY_ROLES` — one Guard Captain per village-plus (`npcGenerator.js:1511-1537` [CT]) | "the one who keeps the gate key" reads as a statement about Guard Captain ⟨Name⟩ on the NPC tab. **Use a plural, a trade, or a bystander** |
| **F4-01** | a ROTTING, WEATHERING or ERODING wall — **and equally, the PERMANENCE of any institution row** | no material decay clock exists; and `calamityKernel.js:96-151`, `:259-275` [CT] DEMOTES built fabric along the upgrade chain and stamps `status: 'ruined'` | both halves bite here. Not "the wall is crumbling"; and not "the wall will always be there" |
| **F4-02** ⭐ | **TWO PURSES SPLIT AT BIRTH** — the wall kept and the muster not; the wall paid for itself | ONE multiplier `milUpkeepMult` over *"garrison wages, wall maintenance"* together (`defenseGenerator.js:184-192`) | the most seductive false line available on this key. The asymmetry the generator records is in the **consequence** (a built wall keeps standing), never in the **pay** |
| **F4-03** | splitting the DIRECTION of the four gates — the wall provisioned while the gaol starves | all four gates are `min(1, floor + econOutput/50 × (1−floor))` on ONE input (`:189`, `:223`, `:251`, `:614`) | they differ in degree only, never in direction |
| **F4-04** | a TOTAL COLLAPSE of pay, or an emptied town — "there is nobody left to pay" | every gate has a floor and `communityMilBase` is exempt entirely (`:186-192`) | the licensed extreme is short, late, thin — never none. **Men drifting off slowly IS the model's own word** (§R-9's live amendment) |
| **F4-07** | the river or the coast doing nothing for the town's defence | `defenseGenerator.js:129-135` — riverside and coastal carry a small POSITIVE multiplier | "there is nothing here but the wall" |
| **F4-08** | magic written into a world where it does not work; or a magical CRITICAL read as the town's own failing | `magicWorksAt.js:49-53`; `defenseGenerator.js:295-307`, `:502-505` (`scores.magical` reads a WORLD) | and its inverse: denying arcane provision the roster may hold (F1-17) |
| **F4-13** | a PLAYER face naming a fact the engine flags COVERT | the covert flags are the engine's positive model of audience | `audience: player (no mark)` on this card. **The positive move nobody used: the player face may say the town does not know** |
| **card: REFUSED COLUMNS** | **a totality over persons** | the card's own line, always | "nobody", "everyone", "the town says so", "anybody can see" |

### 0.6.2 The frozen/live seam rows that reach this pool (§1.4 — read before charging anything)

| row | the collision | which side is the record | what it means here |
|---|---|---|---|
| **W-11** | DS-DEF-2's box is two clocks inside one `<div>`: rows 1–2 live, rows 3–5 snapshot (`DefenseTab.jsx:317-321`) | **the LIVE rows** | the corpus prose reads `standingDefenseForces` (`defenseStateProse.js:623`); the legacy `buildThreatAssessment` reads the FROZEN `d.institutions` (`threatAssessment.js:34-42`). On a ruined-wall town they disagree. **The face is the truthful party; file a WIRING row** (§R-1) |
| **W-10** | four of DS-DEF-2's five pools are keyed on booleans and judged beside a continuous badge | **both — different inputs** | INSTRUMENT. See F1-40 above |
| **W-09** | `threatAssessment.js:59`, `:66`, `:80` hardcode *"Palisade and citizen militia"* and *"watch rotations"* on branches firing for ANY walls row | **the ROSTER** | WIRING (owner, OW-20). ⚠ this undercuts F1-32: the rewrite may be correct about stone while the row beside it says palisade |
| **W-02** | a `Household levy` on the roster against a "no organized force" reading | **neither** | WIRING. The thorp member of this preimage carries a levy in no bucket. **Never assert the absence of armed households** |
| **W-01** | `hasMercenary: true` against `forces.mercenary.present: false` on a Hireling-hall / Free-company-hall / Veteran's-lodge town (`priorityHelpers.js:49` vs `defenseInstitutionBuckets.js:98-100`) | **neither — two engine surfaces** | WIRING (CAR 8b-W-2). No sentence satisfies both; **no face may be charged on that town** |
| **W-03** | a custom "Night Watch" invisible to the buckets, visible to `SECURITY_INSTITUTION_RE` | **the ROSTER** | WIRING + F1-30. **Never assert the absence** |
| **W-04** | DS-GEN-17 `GARRISONED`'s gloss (*"a force the town PAYS for"*) satisfied by `walls` alone | **the KEY** | a pay claim about a force is an F1-02/F1-04 finding; the gloss is a WIRING row |
| **W-13** | DS-DEF-5's and DS-DEF-11's block TITLES name `defenseProfile.institutions` / `defenseProfileHasWalls`; both read `standingDefenseForces` | **the CENSUS** | INSTRUMENT. The annex header of DS-DEF-11 quoted in §0.5 carries the same title defect; do not take a title as a read |
| **W-19** | `deriveDefenseGroupLabel` mints *"The watch"* on a `Watchtower` — a masonry tower | **the ROSTER** | WIRING |
| **§R-1** ⛔ | the tie-break | **a finding carries THREE fields: the face, the denying surface, and which side is the record** | where the denying surface is engine PROSE or a stale snapshot, **the face stands** |
| **§R-2** | frozen band vs live band | **not a contradiction** | a refuter may not fail a face for disagreeing with the band on the other clock. The product carries the tie-break language itself (`DefenseTab.jsx:313`) |

### 0.6.3 The CLOSED ROSTERS this pool touches — a body the roster does not carry may not be asserted

Two rosters bind this key, and they are **different lists that a drafter will conflate**:

1. **`DEFENSE_BUCKET_KEYWORDS`** (`defenseInstitutionBuckets.js:83-111`) — the seven buckets and their substring keywords, the single writer, moved verbatim from `defenseGenerator.js` so the generator's output is unchanged to the byte:
   `walls` · `garrison` · `militia` · `watch` · `mercenary` · `charter` · `magicDef`.
   **On this key: `walls` YES · `garrison` NO · `militia` NO · the other four UNREAD.**
2. **`priorityHelpers.js:45-77`** — the roster flags. They overlap the buckets but **do not agree with them** (W-01). `hasWalls` additionally matches `gates (if walled)`; `hasMercenary` additionally matches `hireling hall`, `free company hall`, `veteran's lodge`; `hasCharterHall` additionally matches `hireling hall` and `adventurers' guild`.

⛔ **A body outside both lists may not be seated at all**: no sheriff, no constable, no sergeant (`ROLE_CATEGORY_KEYWORDS` holds them, no instantiated role list does — Part B §1.2 NOTE 2), no standing army, no lord's men, no company of archers, no gate-wardens as an office.

And the two rosters that fix the WALL itself:
3. **the wall-class rows** the preimage can carry: `Palisade` · `Palisade or earthworks` · `Town walls` · `City walls and gates` · `Massive walls and fortifications` · `Inner citadel` · `Gates (if walled)` (flag only). Each has a printed description (F1-32). **A class word true of all of them** is: the line · the works · the perimeter · the enclosure · the defences. **Not** true of all of them: the stonework · the stakes · the ring · the circuit (a citadel is inner) · the rampart walk.
4. **`Town watch`'s own service row** carries `Gate duty: {on: true}` (`institutionServices.js:1324` [CT]) — against `safetyProfile.js:463-464`'s *"no gates to bribe"* where `hasGates` is false (W-08: **neither side is the record; a writer agreeing with either cannot be failed**).

### 0.6.4 The faith axes

**Not applicable.** This is not a faith pool: `invasionRowSituation` reads no deity, no creed, no `religionState`. The deity doctrine still binds as a floor-3 wall (`F3-02`: nothing predicated of a deity, ever), and a divine martial blessing exists only as `+6` inside `scores.military` (`defenseGenerator.js:175`) — a number, never a claim a face may make. No `deityTemper()`, no `rankAxis`, no `standing`, no `suppressed` flag is in reach of this key, and none may be asserted.

---

## 1. VARIANT 1 · `[ledger]`

### 1.1 (1) Number and angle tag
**Variant 1**, angle **`[ledger]`** — kept. One angle tag per spine row; `[plain]` is a modifier marker and is refused here.

### 1.2 (2) The shipped sentence, verbatim
> `[ledger]` {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else.

Two sentences. `{settlement}` fills at `defenseStateProse.js:621`.

### 1.3 (3) EVERY claim it makes, tagged on the new test

| # | the claim | verdict |
|---|---|---|
| 1.a | the settlement has walls | **SAFE.** The key's own predicate: `forces.walls.present === true` (`defenseStateProse.js:624`, `:476-484`). The plural "walls" is a shade loose on an `Inner citadel`-only town but not denied |
| 1.b | **there is nobody to put on the walls** | **CONTRADICTED** — `forces.watch.present`, `forces.mercenary.present`, `forces.charter.present`, `forces.magicDef.present` are all resolved by the SAME `standingDefenseForces` call (`defenseInstitutionBuckets.js:169-180`) and none is read by this key. At town tier `Town watch` is `required: true` (`institutionalCatalog.js:1348-1354`) and forced in (`assembleInstitutions.js:282`), so the modal member of the preimage HAS people at the gate. **The roster is the record** (F1-25, F1-01). It is also a totality over persons, a REFUSED COLUMN on the card, and a magnitude the read does not hand you (F2-01) |
| 1.c | a determined attacker **takes** this town | **FLOOR-2** — a prediction the pulse adjudicates, named on the card's own `may NOT` line and at F2-05. Present indicative does not rescue it: the outcome is the claim. It is additionally at risk of **F1-40**, outrunning the `scoreBand(scores.military)` badge printed on the same row (`DefenseTab.jsx:322-341`), which a member of this preimage can carry at `ADEQUATE` or `STRONG` |
| 1.d | the attacker needs ladders | **SAFE** — nothing in the record denies siege ladders, and `Town walls`' own description names gates (`institutionalCatalog.js:1336`). ⚠ CRAFT, not law: it is near-verbatim the engine's own legacy string, *"A determined attacker takes the walls if they have ladders and time"* (`threatAssessment.js:118`), which renders in the expanded row of the same box. Lifting it is the seam |
| 1.e | the attacker needs patience | **SAFE** as a means; **FLOOR-2** if read as a duration ("time", "a season"). "Patience" is the safer word of the two |
| 1.f | **and requires nothing else** | **CONTRADICTED** — the record positively models other things standing between the town and an attacker: the terrain multiplier (`defenseGenerator.js:130-135`, mountain 1.28, riverside 1.06, coastal 1.02 — F4-07), the arcane arm (`:295-307`, `:502-505` — F4-08), and the four unread force buckets (1.b). **The record is the field.** It is also a totality |
| 1.g | (implied by 1.b + 1.f) that the wall is the town's whole defence | **CONTRADICTED** — as 1.f. `military` accumulates `hasWatch +7`, `hasMercenary +14`, `hasCharterHall +10`, arcane `+10…+25`, a divine blessing `+6` (`defenseGenerator.js:160-175`) on top of the wall's `+30` |

**Count: 7 claims — 3 SAFE, 3 CONTRADICTED, 1 FLOOR-2** (1.e is a second FLOOR-2 only on the duration reading).

### 1.4 (7) THE ANGLE'S STANCE — `[ledger]`
*The clerk's view: what the books, rolls and counts show* (`RECEIPT_POOLS_DOSSIER_STATE.md:120`). On this key the ledger has three things to work with and no fourth: **the wall is a standing row on the roster; the garrison row is absent; the militia row is absent.** The ledger's own richest unused material is the **purse** — `milUpkeepMult` is ONE multiplier over *"garrison wages, wall maintenance"* together (`defenseGenerator.js:184-192`) — so a ledger face may state that the town's defence money buys upkeep on a thing and wages for nobody, and stop there. It may NOT split the purse in two (F4-02), speak a figure (F2-01), or turn the entry into a forecast (F2-05). The `source: muster · standing LICENSED` line permits a holder citation; the muster's holder does not resolve on this key (F1-03/R-8), so the ledger cites **nothing** here.

### 1.5 (8) THE TURNS WORTH KEEPING
- **"has walls and nobody to put on them"** — the *rhythm* is the best thing in the pool: a possession and its missing complement in one breath, no connective. Keep the shape, replace "nobody" (1.b). The licensed complement is a body the key actually read: *walls and no soldiers of its own*; *a line, and no one whose work is standing in it*.
- **"and requires nothing else"** — the cadence of a flat terminal qualification. Keep the cadence; the claim goes (1.f).
- **"ladders and patience"** — a good pairing of a thing and a disposition. Usable, but it is the engine's own words at `threatAssessment.js:118`; prefer a different pair.

---

## 2. VARIANT 2 · `[visitor]`

### 2.1 (1) Number and angle tag
**Variant 2**, angle **`[visitor]`** — kept.

### 2.2 (2) The shipped sentence, verbatim
> `[visitor]` A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it.

One sentence.

### 2.3 (3) EVERY claim it makes, tagged on the new test

| # | the claim | verdict |
|---|---|---|
| 2.a | a stranger can be at the settlement and can see its edge | **SAFE.** Nothing denies it; `Gates (if walled)` is *"Controlled entry points with gatekeepers"* (`institutionalCatalog.js:1356-1362`) and `hasGates` fires on a palisade (`priorityHelpers.js:53`) |
| 2.b | there is a perimeter | **SAFE** on the wall rows; ⚠ **CONTRADICTED** on an `Inner citadel`-only town — the citadel is IN the walls bucket (`defenseInstitutionBuckets.js:84-87`) but *a CITADEL is inner and a GATE is a point; neither is a line around the town* (F1-07's own wording [CT]). "Perimeter" survives on most of the preimage and fails on that corner |
| 2.c | **the perimeter is "serious"** | **CONTRADICTED / FLOOR-2** — a magnitude outside the read's band word. The key is a boolean; the roster row may be thorp `Palisade`, whose printed description beside the prose reads *"Sharpened stakes… Offers minimal protection but enough to deter casual raiders"* (`institutionalCatalog.js:97-103`, desc `:100`). "Serious" contradicts the row's own description on every thorp, hamlet and village member (F1-32 by extension; F2-01 as an intensity). It is also exposed to **F1-40**: the badge beside it can read `CRITICAL` |
| 2.d | **there is an absence of anyone standing in it** | **CONTRADICTED** — identical to 1.b. And sharper here: the visitor angle claims the absence is VISIBLE, which the `Town watch`'s own `Gate duty: {on: true}` service row denies on the modal member (`institutionServices.js:1324` [CT]) |
| 2.e | the absence is "serious" | **FLOOR-2** — a second magnitude, and a magnitude over an absence the record does not hold at all |
| 2.f | (rhetorical) that "serious" carries two different senses in one sentence | **not a finding — a CRAFT verdict.** The doubled adjective is the shipped rate's own floor rule (R-DA-18 holds `doubled adjective 0.0144 ≤ 0.020`) and the device here is the sentence's whole architecture, which is fault 3 (reflexive antithesis) in a thin costume |

**Count: 6 claims — 2 SAFE, 3 CONTRADICTED (one of them partial, on the citadel corner), 1 FLOOR-2** plus one craft note.

### 2.4 (7) THE ANGLE'S STANCE — `[visitor]`
*What a stranger notices first, without being told* (`:122`). The visitor's licence is **what is visible from outside and at the gate**, and its bar is that a stranger notices THINGS and ARRANGEMENTS, never counts, never institutions by their roster names, never what is not there in the abstract. The productive visitor fact on this key is the **approach**: where you come in, whether you are stopped, who stops you and in what capacity. The visitor may not measure the wall (F2-01), may not name its material across the preimage (F1-32), may not say a place is safe or doomed (F1-34, F2-05), and may not seat a gate-warden as an office (§0.6.3). A stranger may, lawfully and well, notice **a mismatch** — the works and what is behind them — provided the mismatch is stated as a thing seen and not as an absence of persons.

### 2.5 (8) THE TURNS WORTH KEEPING
- **"A stranger at {settlement} sees…"** — the opener is the register's own and is reusable, though R-DA-05/R-DA-17 want the pool's four faces NOT to share their first two words, and the block's sibling pools lean on "A stranger" heavily — **twelve of the block's variants open on it**, measured in the dock across `:2590-2680` (`:2602`, `:2608`, `:2617`, `:2623`, `:2628`, `:2632`, `:2642`, `:2648`, `:2653`, `:2663`, `:2672`, `:2678`). **Vary it.**
- The **structure** — one thing seen, one thing not — is the visitor's right shape here. Only the second half's content is unlawful.

---

## 3. VARIANT 3 · `[street]`

### 3.1 (1) Number and angle tag
**Variant 3**, angle **`[street]`** — kept.

### 3.2 (2) The shipped sentence, verbatim
> `[street]` The town has the thing that would save it and not the people who would use it, and says so when pressed.

One sentence, three clauses.

### 3.3 (3) EVERY claim it makes, tagged on the new test

| # | the claim | verdict |
|---|---|---|
| 3.a | the town has a thing (the wall) | **SAFE** — the key's predicate |
| 3.b | **the wall "would save it"** | **FLOOR-2** — an outcome the pulse adjudicates. The subjunctive FORM is lawful (A2's edge; MOVE-GRAMMAR §1.4 wall 2), so the fault is the promised outcome, not the mood. And the record models the wall as a **probability modifier** on a siege, never a precondition and never a deliverance (`stressGenerator.js:107`, `:123` [CT]); `calamityKernel.js:259-275` [CT] demotes and razes built fabric. Cf. F4-01's second half: no face asserts the permanence of an institution row |
| 3.c | **the town lacks "the people who would use it"** | **CONTRADICTED** — identical to 1.b and 2.d. Third time in three variants |
| 3.d | **the town "says so when pressed"** | **CONTRADICTED** — a totality over persons, the card's REFUSED COLUMNS line, always. No field records a collective utterance, and the shape asserts that every inhabitant holds and will state one view. The cure is NOT a partitive with a rate ("most will say" is F2-06) — it is to attach the saying to an occasion or a trade, or to drop it |
| 3.e | (implied) the town understands its own position | **SAFE** — nothing denies a town's understanding of a standing arrangement, and `contradictions.js:136-153` [CT] shows the engine PRINTS tensions rather than explaining them away (F1-112). Keep this; it is the street angle's whole licence |
| 3.f | the wall and the people are two halves of one thing | **SAFE in the abstract, CONTRADICTED if it becomes a purse claim** — "the town bought the one and not the other" splits one multiplier in two (F4-02). The lawful version keeps them in ONE purse: the money that maintains the works is the money that would pay soldiers |

**Count: 6 claims — 3 SAFE, 2 CONTRADICTED, 1 FLOOR-2.**

### 3.4 (7) THE ANGLE'S STANCE — `[street]`
*The town's own talk about its condition* (`:121`). The street angle is the estate's licence for **what the arrangement feels like from inside it** — the friction, the ordinary complaint, the thing everyone works around — and it is the angle most exposed to the totality bar, because "the town" as a grammatical subject slides into "everyone" without the writer noticing. The safe street subject is **a practice, a duty, an inconvenience or a habit**, not a consensus and not a speech act. Nothing in the record denies that gate duty is resented, that the far side of the works is not walked, that the enclosure is larger than the built-up part; the record is silent on all of it and **silence is permission**. What the record denies is a count, a rate, a date, a body, and a verdict everyone holds.

### 3.5 (8) THE TURNS WORTH KEEPING
- **"the thing that would save it and not the people who would use it"** — the parallel is the sharpest writing in the pool and the claim under it is the pool's one unlawful fact. Keep the *parallel*, re-seat the second half on a body the key read: *the works and not the soldiers*; *what a town builds once and what it has to pay for every week*.
- **"and says so when pressed"** — the terminal turn is good cadence and an unlawful claim. The cadence survives if the subject narrows.

---

## 4. THE POOL, WHOLE

### 4.1 ⭐ (9) WHERE THE FLAVOUR IS — what these states make available that the shipped rows never used

The three shipped rows say **one fact three times**: there is a wall and there are no people. That is an inventory, and it is the wrong fact besides. The record is silent about far more than it denies, and the silence is the writer's.

**(a) THE WALL IS A THING WITH A SHAPE, AND THE SHAPE IS LARGER THAN WHAT IT ENCLOSES.** The preimage's commonest member is a thorp behind a `Palisade` with `Dwellings (4-16)` inside it (`institutionalCatalog.js:82-88`, `:97-103`) and its largest is a town behind `Town walls`. Nothing in the record fixes how much of the enclosure is built up — so **the ground between the works and the last house** is free, and it is the most concrete thing on this key: where the enclosure runs behind nothing; the part of the line that has no path worn along the inside of it; the works meeting the country with no house in between. *This is the true form of the shipped rows' "absence", and it is a thing rather than a negation of persons.*

**(b) THE GATE IS WHERE THE FACT LIVES, AND SOMEBODY IS AT IT.** `Gates (if walled)` is *"Controlled entry points with gatekeepers"* (`:1356-1362`); `hasGates` fires on a palisade (`priorityHelpers.js:53`); `Town watch` is *"Part-time guards. Night patrol and gate duty"* and carries `Gate duty: {on: true}` (`institutionalCatalog.js:1348-1354`; `institutionServices.js:1324` [CT]). So the sharp, true, unused fact on this key is **not that nobody is there — it is that the people who ARE there are doing a different job.** A night patrol is order, not war; it opens and shuts and looks at strangers. The town has a line built for a fight and a duty roster built for a quiet night. *That* is the state, and no shipped row reaches it.

**(c) ONE PURSE, AND IT BOUGHT THE THING THAT KEEPS WITHOUT WAGES.** `milUpkeepMult` is a single multiplier over *"garrison wages, wall maintenance"* (`defenseGenerator.js:184-192`), floor 0.6, with the unpaid community baseline exempt. The wall and the soldiers are the same line in the same book. What the town has is the half of that line that stops costing once it is finished. A `[ledger]` face can hold that whole idea without a figure, without a purse-split (F4-02), and without a history.

**(d) WHAT SOMEONE WOULD AVOID OR COMPLAIN ABOUT.** Gate duty landing on people whose trade is something else; whose turn it is; the far side of the works, which nobody walks; the stretch that is somebody's back wall; keeping stakes or a berm up when nothing has ever come at them; the hour the gate shuts and who is outside it. None of this is counted, dated or rated by any field. All of it is permitted.

**(e) WHAT A STRANGER WOULD NOTICE.** That he is looked at rather than stopped. That he is admitted by someone who is plainly also something else. That the line is kept up and the keeping is a chore. That the enclosure is out of proportion to what is inside it — in either direction, on either end of the preimage. That there is nothing for anyone to stand ON, on a berm or a stake line, which is a fact about the *fabric* and not about the *people*.

**(f) THE ONE ABSENCE THE KEY ACTUALLY LICENSES, WRITTEN AS A LACK.** ABSENCE class (a) LACK — a `none-exists` world field (MOVE-GRAMMAR §1.2 row 11) — is available here on exactly two bodies: **no garrison** and **no militia**. The lawful lack is *the town keeps no soldiers of its own and musters none*, and it is a positive civic fact about how the town is arranged, not a hole. R-DA-02's rule binds: the lack is the first half only, with no completing "but"; and R-DA-08's: never the opener, never adjacent to another absence.

**(g) THE TENSION IS A FEATURE.** `contradictions.js:136-153` [CT] classifies a mismatched institution as an `interesting_tension` and emits consequences and hooks from it — the engine's own model is that the dossier PRINTS the oddity. So the wall-without-soldiers reading does not need a verdict attached to be worth reading; it needs to be **shown as an arrangement somebody lives inside**, and the matter left standing open (fault 7's licence; the OPEN QUESTION move, declarative, never an interrogative).

**(h) WHAT IS NOT AVAILABLE, so the drafter does not waste a face reaching for it.** The wall's material across the preimage (F1-32) · its age or raising (F2-02/F2-03) · its length, height or number of gates (F2-01) · its state of repair as decay (F4-01) · who built it or why (the block's own fence: capability clauses, never historical ones) · any weather, crop, roof or churchyard (F3-05) · the Guard Captain the tier names (F3-06) · a rate for anything (F2-06).

### 4.2 The pool's own spread problem, stated for the drafter
All three shipped variants assert the SAME claim (1.b = 2.d = 3.c), and it is the one claim in the pool that the record denies. So this is not a pool of three readings with one fault — it is **one reading, repeated three times, and wrong.** A11's spread rule and R-DA-05's pool-as-unit rule both bite: the four faces of each variant must not share their first two words with each other or with a sibling variant, and the three variants must now differ in FACT as well as in angle. The material in §4.1 gives three genuinely different facts: **(a)/(e) the fabric and its proportion** for `[visitor]`; **(c) the one purse** for `[ledger]`; **(b)/(d) the duty that is the wrong duty** for `[street]`.

### 4.3 Composition notes the drafter cannot see
- **The spine is alone.** `echo: spine mounts 1 (tabs: defense) · modifier mounts 0 (none)`; `attach:` is empty. No modifier attaches to this pool today, so the composed unit is the spine sentence by itself — but write each face so it reads well immediately after the spine and after any sibling modifier, since the composer orders by salience and the writer does not choose the place (THE THREAD, MOVE-GRAMMAR §1.4.1).
- **⚠ The echo key is coarse.** The card says so in its own words: the echo table is keyed on the WHOLE table-rung reading, so **every pool that selects a row of `INVASION_ROW_POOL` shares ONE echo key** — a mount counted there may be a sibling ROW. Do not read "1 mount" as "this pool is the only speaker".
- **The page around it.** On the same `defense` tab the reader may also meet DS-DEF-5's `walls PRESENT`, `watch PRESENT`, `mercenary / contracted forces PRESENT`, `charter hall PRESENT` and `arcane defense PRESENT` (`RECEIPT_POOLS_DOSSIER_STATE.md:2881-2938`), and DS-DEF-11's walled pools (`:5975-5990`). **R-12: the unit of contradiction is the DOSSIER, not the tab** — which is precisely why "nobody" fails: the page beside it can print the people. The productive reading of the same fact is DS-DEF-5's own `watch PRESENT` line: *"a matter of order rather than of war… not built for what arrives outside"*. This pool must say something that line does not, or R-DST-A's cell-overlap bar applies.
- **Below the prose** sit the five bars with their band words; the eyebrow reads *"as judged at the first survey"* (`DefenseTab.jsx:313`). The expanded `Invasion & War` row prints the legacy string at `threatAssessment.js:117-119`. Do not echo it.

### 4.4 The four walls on every face, restated for the drafter
1. **No totality over persons.** "nobody", "everyone", "anyone", "the town says", "all of them" — refused by the card, always.
2. **Deny the garrison and the militia; deny nothing else.** The key read three buckets; four more were resolved in the same call and left unread.
3. **No magnitude, no date, no elapsed course, no rate, no prediction.** A standing condition, in the present, on a civic thing.
4. **No em dash, no exclamation mark, no digit or percent in a connective, no `which`-clause, no question mark.**

Plus the form rules: `{settlement}` is the only fill; four faces per variant, each a different vocabulary or rhythm inside the voice and never a paraphrase of its sibling; the face must stand alone because an unweighted seeded roll picks it; never trim.

### 4.5 (Count)
**3 shipped variants · 19 claims marked · 8 CONTRADICTED · 3 FLOOR-2 · 8 SAFE · 12 faces owed.**
The single repeated fault is claim 1.b/2.d/3.c: **the denial of persons the key never read.**
