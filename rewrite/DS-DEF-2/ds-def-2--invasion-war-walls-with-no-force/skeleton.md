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

## 2. VARIANT 2 `[visitor]` (checkpoint 3)

### 2.1 Number and angle
Variant 2 · `[visitor]` (vid 2; annex `:2642`).

### 2.2 The shipped sentence, verbatim
> A stranger at {settlement} sees a serious perimeter and a serious absence of anyone standing in it.

### 2.3 Every claim, tagged
| # | claim | licence | layer of the noun | layer of the read | note |
|---|---|---|---|---|---|
| 1 | A stranger at {settlement} [is the eye] | LICENSED as the `[visitor]` angle's standpoint (W27: "a stranger" is the visitor's eye; it may see, never act, decide, be told or be given a name) | NONE (a stance noun; not a person referent) | — | "sees" is perception and lawful; the placement "at {settlement}" is lawful and is not a proper-slot OPENER (the face opens on "A stranger") |
| 2 | sees a ... perimeter | LICENSED, read (a) `forces.walls.present` | BODY ("perimeter") | BODY (the walls bucket) | CONDITIONAL on the WORD: "perimeter" is FALSE of a `Gates (if walled)`-only town (ENTAILMENT D-6: a gate is a point) and the REFERENT row's HOLDS for "the perimeter" is overruled by W15's alias bar for a face written once for every town of the key; the safe spelling is "the works" |
| 3 | serious (perimeter) | UNLICENSED: a CONDITION / EXTENT / QUALITY of the works (NOT ENTAILED: condition, height, extent, D-3; a palisade of "sharpened stakes ... minimal protection" sits on this key); an evaluative adjective the record does not rate (R-DA-10: evaluative adjectives → 0; MOVE-GRAMMAR §1.3 VERDICT does not exist) | NONE (a quality) | BODY | |
| 4 | a serious absence | UNLICENSED: a VERDICT on the absence ("serious" = what the fact means: the MEANING move, §1.3); the anaphora "serious ... serious" is the rhetorical figure bought with the two verdicts, not a claim of its own | NONE | NONE | the absence itself is the licensed kernel (reads b, c); only the adjective goes |
| 5 | of anyone standing in it | UNLICENSED: a TOTALITY OVER PERSONS (REFUSED COLUMN; W22); manning NOT ENTAILED; CONTRADICTED on every native town of the key (the required `Town watch`, Gate duty) and on a levied thorp (§0.4); "standing in it" makes the works a LINE one stands in (D-6: continuity and a walkway not entailed; the "line" reading is the force word the REFERENT row refuses on a pool that reads a force) | PERSON-plural ("anyone") | NONE (an absence of two bodies) | licensed kernel: no garrison and no militia stands to the works, found by the eye |
| 6 | (implicit) no garrison stands | NOT STATED as such (folded into "anyone") | — | NONE | must be stated |
| 7 | (implicit) no militia stands | NOT STATED as such | — | NONE | must be stated |

### 2.4 The reads the rewrite must state
- (a) the works stand — SEEN by the stranger's eye at {settlement}.
- (b) no garrison and (c) no militia stands to them — FOUND by the eye, as an absence the eye meets, never "anyone" / "nobody"; the key's own compression "no force at them" / "no force to hold them".
- Plus the LICENSED claims of the shipped sentence: claim 1 (the stranger as the eye at {settlement}) and claim 2 (the works, seen).
- No country read, no gate read, no watch, no band: the eye sees only what the key reads.

### 2.5 The angle's stance in one sentence
The visitor is a stranger's EYE placed at {settlement}: it may see the works standing and find no force at them, in one perception that lands on a civic thing (the works · the force), and it may not walk, act, judge ("serious"), be told, be named, measure the works' size or condition, count anyone, name an attacker, or say what any of it means or would cost (W27 · W8: the visitor carries a read only as a standing state seen, never as the town's act, a verdict or an accounts fact).

### 2.6 The turns worth keeping (lawful verbatim clauses)
- "A stranger at {settlement} sees" — the opener, lawful (a stance noun opens; `{settlement}` sits inside the phrase, so T-F8 is not engaged); carry it as the opener of at least one face.
- The CONSTRUCTION "sees X and Y" — one perception holding the thing that stands and the absence beside it — is the visitor's lawful SHAPE for the whole key once the two adjectives and the persons are cured: "sees the works and no force at them" is the licensed form of the shipped compression, at the same weight; "a serious perimeter and a serious absence of anyone standing in it" is the exact unlicensed set (two verdicts and a totality).
- "at {settlement}" as the placement of the eye — lawful.

### 2.7 What would make the rewrite a regression here
- Dropping the stranger's eye (a visitor face written as the ledger's flat entry is a dropped angle; W27; R-iv's counterpart for this tag).
- Keeping "serious" (either), "anyone", "standing in it", or replacing them with a synonym of the same class ("a real wall", "a proper circuit", "no one on it", "not a soul").
- Marching or acting the stranger ("walks the circuit", "climbs", "asks", "is told") instead of placing the eye.
- Naming the wall by "the perimeter" or "the line", or naming a gate, a tower or a walkway the read does not reach.
- Letting the stranger see the country, the road, the watch or the band ("sees a quiet country", "sees the watch at the gate") — fields this pool does not read (A0b over-claim; the Town watch is unread even where it stands).
- An inventory line with the stance dropped: "A stranger sees the works. No force stands." (two sentences, no thread, no shape).
- A face plainer than the shipped where the licensed compression exists ("sees the works and no force at them"): the density law (Part B §21.4).

---

## 3. VARIANT 3 `[street]` (checkpoint 3)

### 3.1 Number and angle
Variant 3 · `[street]` (vid 3; annex `:2643`).

### 3.2 The shipped sentence, verbatim
> The town has the thing that would save it and not the people who would use it, and says so when pressed.

### 3.3 Every claim, tagged
| # | claim | licence | layer of the noun | layer of the read | note |
|---|---|---|---|---|---|
| 1 | The town has the thing | LICENSED, read (a) `forces.walls.present`, as the FACT (the town holds a wall-class work) | NONE ("the town" as possessor) · BODY ("the thing" = the works, by periphrasis) | BODY | "the thing" is the street's plain word and claims nothing of itself; W15's always-safe spelling "what the town has built" is the same plainness with the class named; either is lawful |
| 2 | that would save it | UNLICENSED: a CAPABILITY of the works (that they save the town) the presence flag does not hold (D-3 NOT ENTAILED: "whether they have held"); a subjunctive EDGE with no threshold field behind it (R-DA-07 licenses "would" only on a typed edge); an implied attacker (no read); the MAXIM shape "the thing that would save it" (R-DA-12's generalisation test: a life-general claim about walls) | NONE | BODY | the relative clause is the whole unlicensed load; "the works" carries the fact without it |
| 3 | and not the people who would use it | UNLICENSED: a TOTALITY OVER PERSONS (REFUSED COLUMN; W22 "the people"); manning NOT ENTAILED; CONTRADICTED on every native town of the key (the `Town watch`) and a levied thorp (§0.4); "who would use it" a second capability forecast on persons | PERSON-plural ("the people") | NONE (absence of garrison and militia) | the CONTRAST SHAPE "has X and not Y" is itself LAWFUL here (MOVE-GRAMMAR wall 5 / R-DA-02: the rejected alternative names a sibling key's fact — `walls with citizen militia`, `walls AND professional garrison` — so the contrast is licensed by a sibling key, never fronted, the closing move of at most one variant per pool); only its filling is refused |
| 4 | and says so when pressed | UNLICENSED: the town as a SPEAKING AGENT with an admission (a collective interior / belief frame: the register card's "no assigned reaction", R-DA-14 seen-not-meant, W23's fused collective agent — the REFERENT findings D-F16/D-F18 fail "the town has decided" and "the town has not yet had to think about"); "when pressed" an EVENT with an implied interlocutor who presses (W22: a person as agent; no event-provenance field on an R1 STATE pool, R-DA-19); a STANDPOINT (the card's bar); a THIRD clause (R-DA-03: never a third) | NONE (the town as agent) · PERSON (the presser, implied) | (none) | |
| 5 | (implicit) no garrison stands | NOT STATED as such (folded into "the people") | — | NONE | must be stated |
| 6 | (implicit) no militia stands | NOT STATED as such | — | NONE | must be stated |

### 3.4 The reads the rewrite must state
- (a) the town has the works (the shipped opener's fact, kept in the street's plain word).
- (b) no garrison and (c) no militia — the force absent, as the second limb of the street's contrast ("and not the force to hold them" / "and no force of its own to hold them"; the stricter "and neither garrison nor militia").
- Plus the LICENSED claim of the shipped sentence: claim 1 ("The town has ...").
- Nothing else: no attacker, no outcome, no speech, no belief, no watch, no country.

### 3.5 The angle's stance in one sentence
The street is the town's own PLAIN ACCOUNT of its standing condition, in the commonest civic words, stated as a thing the town lives with rather than entered by an office (no formula, no citation, no measure), and it may NOT give the town a voice, a belief, a plan, a decision, a mood or an admission ("says", "knows", "believes", "pretends", "does not pretend", "when pressed"), name a person who asks or answers, or reach for the maxim the plain word invites (W22 · W23 · W27 · R-DA-14 · the register card's "no assigned reaction" and "closes on a moral, an uplift, a maxim").

### 3.6 The turns worth keeping (lawful verbatim clauses)
- "The town has" — the opener, lawful (not a proper slot; the town as possessor of the works); carry it as the opener of at least one face.
- The CONTRAST SHAPE "has the thing ... and not the people ..." is the street's lawful construction for this key (a sibling-licensed contrast, wall 5) and its weight must be kept: "The town has the works and not the force to hold them" is the licensed form at the same compression; the two relative clauses ("that would save it", "who would use it") and the tail ("and says so when pressed") are the exact unlicensed set.
- "the thing" as the street's word for the works — lawful as a plain noun, but only without its relative clause; "what the town has built" is the same register with the class named.

### 3.7 What would make the rewrite a regression here
- Writing the street as the ledger's entry ("Entered as standing: the works, and no force") or as the visitor's eye — a dropped angle; the three variants must keep three constructions (W4).
- Keeping any speech, belief or admission frame ("says so", "knows it", "does not pretend", "when asked") or a person who presses.
- Keeping "would save it" / "would use it" or any capability, outcome or attacker ("the thing that would matter in a siege").
- Keeping "the people", "nobody", "no one", or naming the watch as the missing people (the town-tier trap: the watch STANDS on every native town of this key and is unread).
- Losing the contrast shape "has X and not Y" from every face of this variant (the one lawful turn), or fronting the contrast as the subject ("Not the force but the works is what the town has") — wall 5 refuses a fronted contrast.
- A face plainer than the shipped where the licensed compression exists (Part B §21.4).
- A face that opens on `{settlement}` (T-F8), or a maxim close ("and a wall without hands is a fence").

---

## 4. POOL-LEVEL: THE READS, THE STANCES, THE COMPOSITION FENCES, THE REGRESSION LINE (checkpoint 4)

### 4.1 The reads the rewrite must state in EVERY face of EVERY variant (the skeleton rule)
1. THE WORKS: a wall-class member stands at {settlement} (read a). Spelling: "the works", "what the town has built", "the town's works"; the street's plain "the thing" only without a relative clause. Not "the line" (REFERENT row "the line" · W20: a force word on a pool that reads two forces); "walls" / "the perimeter" only at the W15 alias hazard (false on a `Gates (if walled)`-only town; a stretch on a thorp `Palisade`); never a material (W11), never a condition, extent, height, age, walkway or manning (ENTAILMENT law item 1), never a gate, tower or citadel as a second object.
2. NO GARRISON (read b): no `Garrison`, `Barracks` or `Professional city watch` on the live roster.
3. NO MILITIA (read c): no `Citizen militia` on the live roster.
   Together (b) and (c) are the key's own word "no force". Spellings: "no force to hold them" (the key's compression; "to hold" is the force class's definitional purpose, not a manning claim), "no force at them", "no force of its own", "no garrison and no militia", "neither garrison nor militia". Never "nobody", "no one", "anyone", "the people", "unmanned", "no watch" (the watch is unread and REQUIRED on every native town of this key; a `Household levy` may stand on a thorp), never a hired company or charter hall asserted absent, never a headcount, a thinning or a pay word (no gate read on this key; a headcount is DS-DEF-5's cell).
The three are ONE keyed condition (R-v); stating all three is not "a second fact". There is NO fourth read: this key reads no `monsterThreat`, no `economicGates`, no band, no route. A face that states the country's threat, the town's quiet, the pay of anything, a readiness word or a route over-claims (arm A0b; C7 against the Beasts row and DS-DEF-11 on the same page).

### 4.2 The stances, one line each (from the register card and the block's PROVENANCE line)
- `[ledger]`: the office enters the three legs as standing facts in its own formula; cites nothing (no muster record resolves; W24); invents no attacker, tactic, outcome, duty, maxim or forecast.
- `[visitor]`: a stranger's eye at {settlement} sees the works and finds no force at them; it never acts, judges, is told, measures or names.
- `[street]`: the town's plain account of what it has and has not (the sibling-licensed contrast "has the works and not the force"), with no voice, belief, plan, admission or interlocutor given to the town.
- What NO stance may invent here (the block's PROVENANCE line read under ADDENDUM 8 ruling 2): a historical clause (walls built after a siege), a capability beyond presence ("cannot be held", "would save it", "takes this town"), a manning fact, an attacker, an outcome. "The causal clauses here are capability clauses (walls without people cannot be held)" describes the SHIPPED text and licenses nothing: the card prints no cause and no capability, and the engine joins no force to the works' holding.

### 4.3 Composition fences the drafter cannot see but must write for (THE THREAD; the seam contract)
- This is a SPINE (role spine; spine mounts 1 on the defense tab; modifier mounts 0). The composer puts it FIRST; modifiers follow by salience. Every face must therefore END on a noun a modifier can pick up (the works · the force · the town) and must read as the passage's opening, never as a turn outward.
- A face is one or two sentences (A1). Where two: the second carries a noun forward from the first (R-i: the thread binds at k = 0). The shipped v1's second sentence changes subject to an attacker; the rewrite's second sentence, if any, stays on the works, the force or the town.
- A sentence face may not open on `{settlement}` (T-F8); the settlement token opens at most one variant of the pool (wall 10); no face opens on a comma or a clause-list word.
- No em dash, no exclamation, no digit, no percent, no `which`; the copula kept, the expletive struck ("There is no force" is the R-DA-07 expletive: prefer "No force stands").
- The four faces of a variant are claim-equal to EACH OTHER (A6 across faces) and differ in CONSTRUCTION, not vocabulary alone (ADDENDUM 7 rule 4; W4: the variant's declared grammar is kept across its faces).
- At most ONE negated-surface opener per variant (W10 / R-ii): "No force stands to the works" is a PRESENT read negated, not an ABSENCE opener, and it is spent once per variant.
- The CONTRAST "has the works and not the force" is licensed by a sibling key (wall 5) but is never fronted and is the CLOSING move of at most ONE variant of the pool: the street owns it here; the ledger and the visitor close on another kind (a condition of the works; the force as an object; the town).
- Sibling distance: the three variants keep three constructions (the ledger's entry in the office's formula · the visitor's one-perception "sees X and Y" · the street's plain contrast); no two variants of the pool share their first two words (A11); the census counts `grammars: 2` on the shipped pool and the rewrite may not fall below it.
- The `[street]` register is neither the ledger nor the visitor: a street face that opens "Entered as standing" or "A stranger" has collapsed onto a sibling (W4).

### 4.4 The provenance ruling for this pool
The card licenses a citation of the muster holder "where the provenance budget allows"; the referent law (rule 5, OV-5, W24) licenses the muster's RECORD nouns only where a live `Citizen militia` with `Muster training` resolves, and on this key the militia is absent by construction (holder null on the census row); Part B §24 sets the exemplar rate at zero. RULING for the drafter, vetoable by the chair: zero citations on this pool; the ledger's formula ("entered as standing", "carried on the record") is lawful; "the roll shows" and "the books hold" are not; the street and the visitor cite nothing by their stance.

### 4.5 What would make the rewrite of this POOL a regression (the inventory line and its kin)
- Any face that states fewer than the three legs (the shipped rows each carry read (a) and fold (b) and (c) into a person word; the rewrite must be richer in truth: the works, no garrison, no militia, in every face).
- Any face that is an inventory line: the key's facts with no angle and no thread ("The works stand. No garrison stands. No militia stands.").
- A lost lawful turn: "A stranger at {settlement} sees" (v2) absent from the visitor variant; "The town has ... and not ..." (v3) absent from the street variant; the ledger's compression "has the works and no force to hold them" (the licensed form of v1's "has walls and nobody to put on them") absent from the pool.
- A dropped angle: the visitor written as a ledger entry; the street written with the office's formula or the stranger's eye, or written as a belief/speech frame; the ledger written with a citation.
- A kept unlicensed clause: "nobody to put on them", "A determined attacker", "takes this town", "with ladders and patience", "requires nothing else" (v1); "serious" ×2, "anyone standing in it" (v2); "that would save it", "the people who would use it", "and says so when pressed" (v3).
- A face plainer than the shipped where a licensed form of the compression exists (Part B §21.4, ADDENDUM 6): "has walls and nobody to put on them" → "has the works and no force to hold them"; "sees a serious perimeter and a serious absence of anyone standing in it" → "sees the works and no force at them"; "has the thing that would save it and not the people who would use it" → "has the works and not the force to hold them". A rewrite that spends two flat sentences where one licensed compression stood is the regression the density law names.
- A face that imports a read the key does not carry: the country's threat (the Beasts row's), the pay gate (DS-DEF-11's), the watch (unread; standing on every native town here), the readiness band (`{band}` RESERVED), the route (`{route}` unfilled), an attacker or a war stress (the war desk's).
- A face that opens on `{settlement}` (T-F8) or names `{band}` / `{route}`.
- A face at the wrong layer: a body word for the absence ("the muster is short", "the watch is gone"), a person as referent ("whoever would stand there"), an external body ("the enemy", "a raider") on a read that holds none (W20 · W22 · W25).

### 4.6 Count
Three shipped variants (vid 1 `[ledger]` · vid 2 `[visitor]` · vid 3 `[street]`); three sections above, one per variant; no variant added or removed (never trim).

Seat: Fable 5.1 — marker packet; checkpoint 4 complete; the packet is whole.
