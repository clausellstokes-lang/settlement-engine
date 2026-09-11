# SKELETON — DS-DEF-2 · pool `Invasion & War: walls with NO force`

Marker: Fable 5.1, for the Fable chair (REWRITE car 8b, block DS-DEF-2). Dock read at `laneRW-DEF2` = f2da5a3ee. Packet written section by section under the checkpoint law; a section marked (pending) is not yet written. Read only; nothing in the dock was edited or run beyond the licence-card script.

## 0. THE CARD AND THE SHIPPED ROWS (checkpoint 1)

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
              n/a
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              the echo table is keyed on this pool's WHOLE table-rung reading (truncated at the file's first dot) and NOT on a producer-token root, so every pool that selects a row of `INVASION_ROW_POOL` shares ONE echo key: a mount counted there may be a sibling ROW of the same table
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  may claim:  that the reader `invasionRowSituation(walls, garrison, militia)` selects the row `walls, no force` of `INVASION_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```
The census row (`docs/content/wiring-census.json:1163-1222`): `status: RESOLVED` · `keyFunction: INVASION_ROW_POOL` · `rung: table` · `readsGrain: branch` · `variants: 3` · `grammars: 2` · `objectClasses: []` (no civic-object class is spent by this pool, so the card prints no "another civic object" bar) · `covert: false` · `sites: ["defense.threatAssessment"]` · `k: 2` · `source.kind: muster` with `fields {walls: muster, garrison: muster, militia: muster}`, `holder: null`, `holderReason: town-resolved`, `standing: LICENSED`, `twoSource: false`. `proseNorms.generated.js:64`: `departure: 0`.

### 0.2 The block's header lines (annex `### DS-DEF-2`, `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2590`)
- RECEIPT: `src/domain/display/threatAssessment.js:28-195` (`buildThreatAssessment`) · rendered `DefenseTab.jsx:150-183` · the walls predicate `causalState.js` (`defenseProfileHasWalls`).
- STATE-KEY: five fixed rows (`Beasts & Monsters` · `Invasion & War` · `Internal Security` · `Economic Survival` · `Disasters & Famine`), each with a `scoreBand` badge, read against `config.monsterThreat`, the institution presence flags, and `compound.inst`.
- SLOTS: `{settlement}` `{band}` `{route}` (the card: only `{settlement}` is FILLED at this block's call sites; `{band}` RESERVED; `{route}` proper but unfilled here).
- SECTION-TARGET: `defense`.
- PROVENANCE + FENCE: each branch currently holds exactly ONE string, so every settlement in a branch says the same words; the walls read must ride `defenseProfileHasWalls`, never a presence check on `institutions.walls`; "Institution presence is a STANDING fact with no recorded history; the causal clauses here are capability clauses (walls without people cannot be held) and never historical ones (walls built after a siege) unless the history surface supplies the ancestry." ⚠ That PROVENANCE sentence DESCRIBES the shipped text and licenses nothing (ADDENDUM 8 ruling 2: the card binds on cause; the block's own words are its name, not a licence).
- The register card's six one-line registers: the dossier (the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener) · the NPC ladder · the Herald · the chronicle · the DM page · chrome and the docent. This pool is DOSSIER (R1 STATE, a spine, the player face, no mark).

### 0.3 The shipped rows, verbatim (annex `:2640-2643`)
1. `[ledger]` {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else.
2. `[visitor]` A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it.
3. `[street]` The town has the thing that would save it and not the people who would use it, and says so when pressed.

Three shipped variants; the card's angle set (ledger · street · visitor) matches the three tags one for one.

### 0.4 WHAT THE KEY READS, IN THE ENGINE'S OWN TERMS (the ground every tag below stands on; all cites in `laneRW-DEF2` at f2da5a3ee)
- The read is ONE keyed condition (ADDENDUM 8 ruling 1 · ADDENDUM 12 R-v): `invasionRowSituation(walls, garrison, militia) === 'walls, no force'` (`defenseStateProse.js:476-483`), called at `:656` as `invasionRowPoolKey(walls, garrison, militia)` with `walls = forces.walls.present`, `garrison = forces.garrison.present`, `militia = forces.militia.present` from `standingDefenseForces(settlement)` (`:624-627`), the LIVE ruin-filtered roster (`defenseInstitutionBuckets.js` → `institutionRoster.js:53-56`). Unlike the Beasts row this key reads NO `config.monsterThreat`: there is no country read on this pool. Its three legs:
  - (a) `walls === true`: at least one `walls`-bucket member stands (keywords `wall · citadel · palisade · earthwork · inner citadel · massive walls`, `defenseInstitutionBuckets.js:84-87`). Referent layer: BODY (the walls bucket). The block has NO `{defwork}` slot, so the wall is named by its CLASS. The REFERENT table row "wall · walls" reads "the wall · the perimeter" as HOLDS at BODY where the pool reads the `walls` arg of `invasionRowSituation` (this pool), but ENTAILMENT D-6 finds "perimeter" FALSE of `Citadel` and `Gates (if walled)` and W15 makes "the works" / "what the town has built" the always-safe spelling of any wall-class member. On THIS key the reachable members are `Palisade` (thorp, `institutionalCatalog.js:97`), `Palisade or earthworks` (hamlet `:342`, village `:874`), `Town walls` (town, bc 0.5, `:1332`) and `Gates (if walled)` (town, bc 0.5, `:1356`, in the walls bucket through the substring `wall`; no `exclusiveGroup` ties it to `Town walls`, so a Gates-only town lands here with `walls === true`). So "walls", "the perimeter" and "the line" are each false or wrong-layer on some town of the key; the stricter instrument governs: the wall-class noun in a face is "the works" (or "what the town has built"); "the line" is REFUSED outright (REFERENT row "the line": never "the line" where the pool reads a force, and this pool reads two); "walls" / "the perimeter" carry the W15 alias hazard and are tagged CONDITIONAL below.
  - (b) `garrison === false`: NO `garrison`-bucket member stands (keywords `garrison · barracks · professional guard · professional city watch · multiple garrison`, `:88-91`). Referent layer: NONE (an absence of a body). `Garrison` is city-required (`:1925`) and `Professional city watch` is city-required AND a garrison keyword (`:1918`), so this key NEVER fires on a native city; `Barracks` (town, bc 0.3, `:1363`) is the only town-tier garrison row.
  - (c) `militia === false`: NO `militia`-bucket member stands (`citizen militia · militia`, `:92-94`). Referent layer: NONE. `Citizen militia` sits at hamlet, village and town (`:1340`), but at town it shares `exclusiveGroup: 'civilianDefense'` with the REQUIRED `Town watch` (`:1348`) and roster law R-A evicts it, so it never generates natively at town.
  - The read EXCLUDES the watch bucket (`town watch · city watch`), the mercenary, the charter and the arcane bodies, and the thorp `Household levy` (in no bucket, `:104`). ⚠ THE TOWN-TIER TRAP, which all three shipped rows fall into: every native TOWN on this key carries the REQUIRED `Town watch` standing, with `Gate duty` recorded on it (`institutionServices.js:1324`, on: true, p 0.8), and a thorp on this key may carry a `Household levy` ("one able-bodied adult from each household musters"). "Nobody to put on them", "anyone standing in it" and "not the people who would use it" are therefore CONTRADICTED by the engine on the town-tier share of this key and on a levied thorp, and unread on every other tier. The licensed absence is exactly: no garrison and no militia; the key's own word "no force" (the garrison-or-militia class absent) is the safe compression.
  - The card's `may NOT`: a count, a cause, a season, a future, a standpoint, a second fact. REFUSED COLUMNS: a totality over persons (this kills "nobody" and "anyone"); an exemption; a named character; a deity claim. No wall-class object bar is printed on this card (`objectClasses: []`), but W20 still refuses a body word for a row the read does not reach: no gate, tower, walkway or citadel as a separate object, and no watch.
- SOURCE: the card prints `muster · standing LICENSED`, holder null (`holderReason: town-resolved`). Under REFERENT rule 5 / OV-5 and W24 the muster's RECORD nouns ("the roll", "the muster roll") are citable only where a live `Citizen militia` with the `Muster training` service resolves; on this key the militia is ABSENT by construction, so no muster record exists to cite, and Part B §24 reads the exemplar citation rate as zero. Ruling for the drafter (vetoable by the chair): cite NOTHING on this pool; the `[ledger]` tag is a standpoint and licenses no record noun (W24); "entered as standing" / "carried on the record" is the office's formula and stays lawful (R-vi/W7); "the roll shows" is a citation and is not.
- Slots a face may name: `{settlement}` only (a face's slot set must equal the parent's; `{band}` RESERVED; `{route}` unfilled here). A sentence-form FACE may not OPEN on `{settlement}` (ARCH §2.5 T-F8: a sentence face opening on a `proper`-typed slot of the block's bag is refused) and the settlement token opens at most one VARIANT per pool (R-DA-17; MOVE-GRAMMAR wall 10). The shipped v1 opens on `{settlement}`; no face may.
- The engine's own string for this branch (`threatAssessment.js:119`: "Walls present but no organized military force to man them. A determined attacker takes the walls if they have ladders and time.") is the SOURCE of the shipped v1's "ladders" and licenses nothing: it is product code, not a field (OW-20), and the ENTAILMENT refuter lists this pool's v1 "takes this town with ladders" (`:2641`) among the live faces more knowledgeable than the simulation ("an earth berm needs none").

---

## 1. VARIANT 1 `[ledger]` (checkpoint 2)

### 1.1 Number and angle
Variant 1 · `[ledger]` (vid 1; annex `:2641`).

### 1.2 The shipped sentence, verbatim
> {settlement} has walls and nobody to put on them. A determined attacker takes this town with ladders and patience, and requires nothing else.

### 1.3 Every claim, tagged (licence · referent layer of the noun beside the layer of the read)
| # | claim | licence | layer of the noun | layer of the read | note |
|---|---|---|---|---|---|
| 1 | {settlement} has walls | LICENSED, read (a) `forces.walls.present` (the `walls` arg) | BODY ("walls") | BODY (the walls bucket) | CONDITIONAL on the WORD: the read resolves the BUCKET, not a row; "walls" is the alias-bar word (W15) and is false on a `Gates (if walled)`-only town and a stretch on a thorp `Palisade`; the always-safe spelling is "the works" / "what the town has built" (ENTAILMENT D-6). The FACT stands; the NOUN is re-spelt. Also T-F8: no face may open on `{settlement}`, so the shipped opener cannot be carried as it stands. |
| 2 | and nobody to put on them | UNLICENSED: a TOTALITY OVER PERSONS (REFUSED COLUMN); manning NOT ENTAILED by a wall (ENTAILMENT law item 1; D-1/D-3 list "manning" and "a walkway" as not entailed); CONTRADICTED on every native town of the key (the required `Town watch` stands with Gate duty, §0.4) and on a levied thorp; W22 (no person as load-bearing referent) | PERSON-plural ("nobody") | NONE (an absence of two bodies: garrison, militia) | "to put on them" also asserts the works are a thing one stands ON (a walkway; false of an earth berm or a gate). The licensed kernel underneath: no garrison and no militia stands to the works (reads b and c). |
| 3 | A determined attacker | UNLICENSED: an EXTERNAL BODY no field on this key holds (no `besiegedBy`, no war stress, no `{counterpart}` is read; REFERENT row "army (the enemy's)": EXTERNAL BODY or a hypothetical, `{counterpart}` unfilled); W25 (a foreign force is named with its possessor stated, and none exists here); "determined" a character adjective on an agent (R-DA-14) | EXTERNAL BODY (hypothetical) | (none: the read carries no foreign body) | the whole second sentence hangs on a body the record does not hold |
| 4 | takes this town | UNLICENSED: a FORECAST / outcome in the bare present-as-future (STATE never FATE, R-DA-07; MOVE-GRAMMAR §1.3 FORECAST does not exist); a CAPABILITY of the works (that they fall) the presence flag does not hold (D-3 NOT ENTAILED: "whether they have held"); "this town" a deictic standpoint (card `may NOT: a standpoint`) | NONE (the town as object) | (none) | |
| 5 | with ladders and patience | UNLICENSED: a tactical PARTICULAR the record does not hold ("ladders" is hollow specificity, fault 24, copied from the engine string `threatAssessment.js:119`, which is product code, not a field, OW-20); the ENTAILMENT refuter's own finding on this row ("an earth berm needs none"); "patience" is a DURATION in kind (card `may NOT: a count`; R-DA-16) | NONE (an object; a time) | (none) | |
| 6 | and requires nothing else | UNLICENSED: a TOTALITY ("nothing else"); a forecast; the DOUBLED BEAT (W6: it restates claims 4 and 5); a verdict close (MOVE-GRAMMAR §1.3 VERDICT does not exist) | (none) | (none) | a third clause on the second sentence: R-DA-03's "never a third" |
| 7 | (implicit) no garrison stands | NOT STATED as such: the shipped line folds read (b) into "nobody" | — | NONE | a licensed read carried only by an unlicensed word; the rewrite must state it |
| 8 | (implicit) no militia stands | NOT STATED as such: the shipped line folds read (c) into "nobody" | — | NONE | same |

### 1.4 The reads the rewrite must state (all of them, in every face)
- (a) the works stand at {settlement} (a wall-class member is on the live roster) — spelt "the works" / "what the town has built"; never "the line"; "walls" / "the perimeter" only at the W15 hazard.
- (b) no garrison stands (no professional soldiers of the garrison class: no `Garrison`, `Barracks`, `Professional city watch`).
- (c) no militia stands (no `Citizen militia`).
  (b) and (c) together are the key's own word: "no force" — the garrison-or-militia class absent. The watch, a hired company, a charter hall and a household levy are NOT read and may be asserted neither absent nor present.
- Plus the LICENSED claim of the shipped sentence: claim 1 (the works stand), re-spelt and not as a face opener.
- The three legs are ONE keyed condition (R-v); stating all three is not "a second fact". NO country read exists on this key: a face that says what the country is (quiet, plagued, a frontier) over-claims a field this pool does not read (arm A0b; the Beasts row on the same page carries that read, C7).

### 1.5 The angle's stance in one sentence
The ledger enters the three legs of the key as standing facts in the office's own formula ("entered as standing", "carried on the record", "set down"), measures nothing it cannot read, cites no record (no muster record resolves on this key; the `[ledger]` tag is a standpoint, not a citation, W24/W8), and may NOT invent an attacker, an outcome, a tactic (ladders, a night, a siege), a duty ("should man"), a manning count, a maxim or a forecast of what the town could hold.

### 1.6 The turns worth keeping (lawful verbatim clauses; the density floor)
- No clause of the shipped sentence survives whole: its first sentence opens on `{settlement}` (T-F8) and closes on a refused totality; its second sentence is an unlicensed body, a forecast, a particular and a verdict end to end.
- The shape "{settlement} has walls and nobody to put on them" is the pool's one memorable compression, and a LICENSED form of it exists at the same compression: the works stand, and no force stands to them (two standing facts joined by "and", one keyed condition, no person noun). The exact unlicensed claim is "nobody to put on them"; the licensed form of the compression is "and no force to hold them" (the key's own word "force" as a standing fact; "to hold" states the force class's definitional purpose, the rows' own `defense` tag, and asserts no manning). The stricter form, for a refuter who reads "to hold" as manning: "and no garrison and no militia".
- The clerk's verb "has" (the town as possessor of the works) is lawful and may be carried in a non-opening position ("At {settlement} the town has the works and no force to hold them").

### 1.7 What would make the rewrite a regression here
- An inventory line: "The works stand at {settlement}. No garrison and no militia stand." states the key with no angle, no formula and no thread between the two sentences; a rewrite that spends two flat sentences where one licensed compression stood is the regression the density law names (Part B §21.4; ADDENDUM 6).
- A face that keeps "nobody", "no one", "unmanned", "anyone", "the people", or that names "the watch" as absent or present (W22 · the refused totality · the town-tier trap of §0.4).
- A face that keeps an attacker, "ladders", "patience", "takes this town", "requires nothing else", or any outcome (a siege held or lost, a raid answered).
- A face that keeps "the line" (REFERENT row "the line" · W20), or "walls" / "the perimeter" without the W15 hazard accepted by the chair.
- A face that cites "the roll" or "the muster roll" (no militia resolves on this key; W24, OV-5), or that imports the pay gate, the readiness band, the country's threat or the route.
- A face that opens on `{settlement}` (T-F8) or names `{band}` / `{route}`.
- A face that turns the ledger into a maxim ("a wall without men is a wall for the taking") — the generalisation test (R-DA-12).

---
