# MARKER SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter AND organized force`

Status: IN PROGRESS (checkpointed section by section; if this file is found part-written, continue from the last complete section).

## 0. THE CARD AND THE ROWS (checkpoint 1 — read before any judgment)

### 0.1 The licence card, verbatim (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter AND organized force'` in laneRW-DEF2)

```
LICENCE (block DS-DEF-2 · role spine · key `Beasts & Monsters: plagued, perimeter AND organized force`)
  reads:      beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js) === plagued country, perimeter and force
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street unfolding
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              every pool that selects a row of `BEASTS_ROW_POOL` shares ONE echo key
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  may claim:  that the reader `beastsRowSituation(family, perimeter, force)` selects the row `plagued country, perimeter and force` of `BEASTS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```

### 0.2 The block's header lines (annex `RECEIPT_POOLS_DOSSIER_STATE.md` under `### DS-DEF-2`, lines 2568–2596 of the laneRW-DEF2 copy)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` (the card: only `{settlement}` is FILLED at this block's call sites; `{band}` RESERVED; `{route}` proper but unfilled here).
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE:** `buildThreatAssessment` is dossier-native; each branch holds ONE string today; two defects must not be reintroduced (the `plagued`+nothing lowercase lead; the walls read must ride `defenseProfileHasWalls`, never a presence check on `institutions.walls`). Institution presence is a STANDING fact with no recorded history; the causal clauses are CAPABILITY clauses (walls without people cannot be held), never HISTORICAL ones, unless the history surface supplies the ancestry.
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`); rendered `DefenseTab.jsx:150-183`; the walls predicate `causalState.js:300-315`.

### 0.3 The pool's shipped rows, verbatim (the annex, bold line `**\`Beasts & Monsters\`: \`plagued\`, perimeter AND organized force**`)

1. `[ledger]` The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly.
2. `[street]` Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual.
3. `[unfolding]` What {settlement} has built is holding against the pressure and is being spent doing it; the posture is survivable, and survivable is the most that can be said of it here.

Variant count: THREE shipped variants (ledger · street · unfolding), matching the card's `angle: ledger street unfolding`.

### 0.4 What the read actually reads (checkpoint 2; read-only in laneRW-DEF2, content is DATA)

- `defenseStateProse.js:655`: `beasts: rung(beastsRowPoolKey(settlement?.config?.monsterThreat, walls, garrison || militia))` where (`:623-626`) `const forces = standingDefenseForces(settlement); const walls = forces.walls.present; const garrison = forces.garrison.present; const militia = forces.militia.present;`.
- So the three reads behind this pool's ONE card read `beastsRowSituation(family, perimeter, force)` are: **family** = `measuredMonsterFamily(config.monsterThreat)` = `plagued` (the measured tier, never the default; `plagued` = MONSTER activity, W14); **perimeter** = `forces.walls.present` (the walls BUCKET: wall · palisade · earthwork · citadel · massive walls; presence only); **force** = `forces.garrison.present || forces.militia.present` (the garrison bucket OR the militia bucket; NOT the watch, NOT mercenaries, NOT the charter hall — the desk's "organized force" for THIS row is exactly those two buckets).
- `beastsRowSituation(:429-441)`: `plagued` + perimeter + force → `'plagued country, perimeter and force'` → this pool. The predicate is an exact `===`.
- `buildThreatAssessment` (`threatAssessment.js:52-56`, the shipped engine string this row extends): `hasWalls && hasGarrison` under `plagued` prints "Embattled region: constant creature pressure. Walls and garrison have established a survivable posture. Defense is an ongoing operational necessity." The corpus rows below descend from that string; the engine string itself is product code outside this rewrite (OW-20), read here only as the source of the shipped clauses' vocabulary ("survivable", "constant", "ongoing", "operational necessity").
- ⚠ The engine string's branch is `hasWalls && hasGarrison` (a garrison), while the desk's key fires on `garrison || militia`: on a walled plagued town with a MILITIA and no garrison the desk selects THIS pool. So no face may say "garrison" (W12 besides); the safe class words are "the muster" / "the town's force"; below town, "the community".

