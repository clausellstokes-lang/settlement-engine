# MARKER SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, NO perimeter and NO force`

Status: IN PROGRESS (checkpointed section by section under the checkpoint law; if this file is found part-written, continue from the last complete section and keep what is sound).

Seat: Fable 5.1 (marker) · written 2026-09-11 · reads only; no dock entered.

## 0. THE CARD AND THE ROWS (checkpoint 1 — read before any judgment)

### 0.1 The licence card, verbatim (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, NO perimeter and NO force'` in laneRW-DEF2)

```
LICENCE (block DS-DEF-2 · role spine · key `Beasts & Monsters: plagued, NO perimeter and NO force`)
  reads:      beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js) === plagued country, neither
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)   ← a spine IS the seat and carries no relation; the relation is the MODIFIER's property, fixed at its freeze (ARCH §4.5)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger street visitor
  attach:     (empty: a spine takes no attach set)
              n/a
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the file's first dot) and NOT on a producer-token root, so every pool that selects a row of `BEASTS_ROW_POOL` shares ONE echo key: a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  may claim:  that the reader `beastsRowSituation(family, perimeter, force)` selects the row `plagued country, neither` of `BEASTS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```

### 0.2 The block's header lines (annex `RECEIPT_POOLS_DOSSIER_STATE.md` under `### DS-DEF-2`, lines 2568–2593 of the laneRW-DEF2 copy)

- **STATE-KEY:** five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge (`STRONG` / `ADEQUATE` / `WEAK` / `CRITICAL`), read against `config.monsterThreat` (`plagued` / `frontier` / `settled`), the institution presence flags, and `compound.inst`.
- **SLOTS:** `{settlement}` `{band}` `{route}` — the card: only `{settlement}` is FILLED at this block's call sites; `{band}` RESERVED; `{route}` proper but unfilled here. A face names `{settlement}` or no slot; a face naming `{band}` or `{route}` drops (ARCH §2.5: a face whose slot set differs from the parent's is refused).
- **SECTION-TARGET:** `defense`.
- **PROVENANCE + FENCE:** `buildThreatAssessment` is dossier-native and this shape EXTENDS it into a pool; each branch holds ONE string today, so every settlement in a branch says the same words. Two defects must not be reintroduced: the `plagued`+nothing branch (THIS POOL) leaks a lowercase sentence lead; the walls read must ride `defenseProfileHasWalls`, never a presence check on `institutions.walls`. Institution presence is a STANDING fact with no recorded history; the causal clauses are CAPABILITY clauses (walls without people cannot be held), never HISTORICAL ones, unless the history surface supplies the ancestry.
- **RECEIPT:** `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`); rendered `DefenseTab.jsx:150-183`; the walls predicate `causalState.js:300-315` (`defenseProfileHasWalls`).

### 0.3 The pool's shipped rows, verbatim (the annex, bold line `**\`Beasts & Monsters\`: \`plagued\`, NO perimeter and NO force**`, lines 2605–2608)

1. `[ledger]` An embattled country and nothing organized standing in it: {settlement} has no line, no force and no specialist recourse, and survival here rests on terrain, distance and the ability to leave.
2. `[street]` The town does not defend itself. What it does is watch, and move, and hope the pressure goes around it, and that is understood by everyone in it.
3. `[visitor]` A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place is arranged as though danger were expected to be met.

Variant count: THREE shipped variants (ledger · street · visitor), matching the card's `angle: ledger street visitor`.

### 0.4 What the read actually is (the code, read-only, `laneRW-DEF2/src/domain/display/stateProse/defenseStateProse.js:400-450, :655`)

- `beastsRowSituation(family, perimeter, force)` returns `'plagued country, neither'` only when `family === 'plagued'` AND `perimeter` is false AND `force` is false. `family` is `measuredMonsterFamily(config.monsterThreat)` — the CORPUS family word from the MEASURED raw value (an unmeasured town returns null and this row never fires; `frontier` as a default is never read as a fact).
- At the call site (`:655`) `perimeter` = the walls read (`defenseProfileHasWalls`, per the block's fence) and `force` = `garrison || militia` (the force BUCKETS, per the rulings: never "the guard").
- So the ONE keyed condition this pool carries (R-v: the reads of a key are one keyed condition, never a second fact) has three limbs, all STANDING: (a) the country's monster tier is `plagued` (= monster activity, W14; never disease); (b) no wall-class work resolves on this town's record (a LACK, `none-exists`); (c) no garrison and no militia resolves (a LACK, `none-exists`).
- The `source: muster · standing LICENSED` line resolves the muster HOLDER for the read — but on THIS row the force limb is a NEGATION (no garrison, no militia), so a citation of "the muster" as a record ("the roll shows nobody") would cite a roll the town does not resolve (W24: on a read that resolves no holder, no record word; rule 5 of PART B: "the roll" only where a Citizen militia with Muster training resolves — which this key excludes). The marker's reading: the holder line licenses the CLASS WORD ("the muster", "the town's force") as the thing that is absent, and licenses NO citation on this pool.

(sections 1–3 follow; one per shipped variant)
