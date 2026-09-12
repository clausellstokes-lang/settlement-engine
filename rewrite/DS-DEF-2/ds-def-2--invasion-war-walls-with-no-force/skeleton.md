# SKELETON — DS-DEF-2 · pool `Invasion & War: walls with NO force`

Marker seat: **Opus, for the Fable chair** (REWRITE, block DS-DEF-2). Dock read at `laneRW-DEF2`; every `src/` and `docs/` citation below was opened in that dock and its line numbers measured there. Written under **THE NEW TEST (ADDENDUM 14 + `rewrite/recut/CONTRADICTION-TABLE.md`): a face is LAWFUL unless it CONTRADICTS the record; silence is permission; "the card does not license it" is NOT a finding.** The verdict `unlicensed` appears nowhere in this packet.

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

*(packet in progress — sections are written to disk as they are finished)*
