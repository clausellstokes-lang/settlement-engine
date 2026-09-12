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
