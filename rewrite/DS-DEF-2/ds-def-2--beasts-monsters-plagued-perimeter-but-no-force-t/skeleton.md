# SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter but NO force to hold it`

Marker: Fable 5.1, for the Fable chair (REWRITE car 8b, block DS-DEF-2). Dock read at `laneRW-DEF2` = f2da5a3ee. Packet written section by section under the checkpoint law; a section marked (pending) is not yet written.

## 0. THE CARD AND THE SHIPPED ROWS (checkpoint 1)

### 0.1 The licence card, verbatim (`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter but NO force to hold it'`)
```
LICENCE (block DS-DEF-2 · role spine · key `Beasts & Monsters: plagued, perimeter but NO force to hold it`)
  reads:      beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)
              (absent ⇒ no candidate; a modifier is silent, never "false")
  predicate:  beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js) === plagued country, perimeter without force
  bag:        {band: RESERVED, route: proper, settlement: proper}
              FILLED at this block's call sites: {settlement}
  relation:   (a spine takes no relation)
  seat/form:  (not a seat-taker) / sentence      move: (none declared)     angle: ledger unfolding visitor
  attach:     (empty: a spine takes no attach set)
  echo:       spine mounts 1 (tabs: defense) · modifier mounts 0 (none)
              (one echo key shared by every pool that selects a row of BEASTS_ROW_POOL)
  covert:     no
  source:     muster · standing LICENSED
              a citation of this holder is licensed where the provenance budget allows
  may claim:  that the reader `beastsRowSituation(family, perimeter, force)` selects the row `plagued country, perimeter without force` of `BEASTS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record
  may NOT:    a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`
  audience:   player (no mark)
  REFUSED COLUMNS, always: a totality over persons; an exemption from a duty (whoIsExempt is null everywhere); a named character and that character's fate (product scope); a theological claim about a deity (the deity doctrine)
```

### 0.2 The block's header lines (annex `### DS-DEF-2`, `RECEIPT_POOLS_DOSSIER_STATE.md:2568-2590`)
- STATE-KEY: five fixed rows, each with a `scoreBand` badge (STRONG / ADEQUATE / WEAK / CRITICAL), read against `config.monsterThreat` (plagued / frontier / settled), the institution presence flags, and `compound.inst`.
- SLOTS: `{settlement}` `{band}` `{route}` (the card: only `{settlement}` is FILLED at this block's call sites; `{band}` RESERVED; `{route}` proper but unfilled here).
- SECTION-TARGET: `defense`.
- PROVENANCE + FENCE: institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses (walls without people cannot be held) and never HISTORICAL ones; the walls read must ride `defenseProfileHasWalls`, never a presence check; the `plagued`+nothing branch's lowercase lead is a corrected defect.
- Register card, the six one-line registers: the dossier (the record itself; the clerk's third person); the NPC ladder; the Herald; the chronicle; the DM page; chrome and the docent. This pool is DOSSIER (R1 STATE, spine, player face).

### 0.3 The shipped rows, verbatim (annex lines under the bold pool line)
1. `[ledger]` {settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night.
2. `[visitor]` A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal.
3. `[unfolding]` The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed.

Three shipped variants; the card's angle set (ledger · unfolding · visitor) matches the three tags one for one.

## 0.4 WHAT THE KEY READS, IN THE ENGINE'S OWN TERMS (the ground every tag below stands on; all cites in `laneRW-DEF2` at f2da5a3ee)
- The read is ONE keyed condition (ADDENDUM 8 ruling 1 · ADDENDUM 12 R-v): `beastsRowSituation(family, perimeter, force) === 'plagued country, perimeter without force'`, called at `defenseStateProse.js:655` as `beastsRowPoolKey(settlement.config.monsterThreat, walls, garrison || militia)`. Its three legs:
  - (a) `family === 'plagued'`: `measuredMonsterFamily(config.monsterThreat)` with the RAW value present (`:331-335`; `MONSTER_FAMILY_OF.plagued`). Engine meaning (ENTAILMENT L-1, W14): the surrounding REGION is plagued by MONSTER activity; never disease; COUNTRY-scoped (W2), never a totality over the town. Referent layer: NONE (a tier token of the country; no institution noun).
  - (b) `perimeter === true`: `standingDefenseForces(settlement).walls.present` (`defenseInstitutionBuckets.js:169-182`, the live ruin-filtered roster): at least one `walls`-bucket member stands (Palisade · Palisade or earthworks · Town walls · City walls and gates · Citadel · Gates (if walled) · Massive walls). Referent layer: BODY (the walls bucket). The block has NO `{defwork}` slot (SLOTS: settlement · band · route), so the wall is named by the CLASS, and W15's always-safe spelling for any wall-class member is "the works" / "what the town has built" (ENTAILMENT A-7, D-6: "perimeter" is false of Citadel and Gates; the class has no safe geometric generic). The REFERENT table row 7 reads "the wall · the perimeter" as HOLDS at the BODY layer where the pool reads `forces.walls.present`, and row 81 refuses "the line" on any pool that also reads a force (this pool does). Both instruments bind the refuters; the stricter governs: the wall-class noun in a face is "the works" (or "what the town has built"); "the line" is refused outright; "a wall" / "the perimeter" carry the W15 alias hazard and are tagged CONDITIONAL below.
  - (c) `force === false`: `garrison.present || militia.present` is false: NO `garrison`-bucket member AND NO `militia`-bucket member on the live roster. The read EXCLUDES the watch, the mercenary, the charter hall and the arcane bodies (REFERENT row 18: "the `force` token ... EXCLUDES the watch, the mercenary, the charter"). Referent layer: NONE (an absence: the two bodies are not present; the class word for the paid military is "the muster" / "the town's force", ADDENDUM 13 A item 5 and rule 5). ⚠ THE TOWN-TIER TRAP, which the shipped rows all fall into: `Town watch` is REQUIRED at town tier (ENTAILMENT D-9, R-A), `Citizen militia` never generates natively at town (A-4), and `Garrison` is city-required (D-7); so a walled TOWN with its required watch and no garrison lands on THIS key with a watch standing and on Gate duty (`institutionServices.js:1324`). "Nobody to man it", "nobody on them" and "the watch thins" are therefore CONTRADICTED by the engine on the town-tier share of this key, and unread on every other tier. The licensed absence is exactly: no garrison and no militia; the key's own word "no force" (the muster class absent) is the safe compression.
- The card's `may NOT`: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall` (so no gate, citadel or second wall-class noun beside the works; T-F12). REFUSED COLUMNS: a totality over persons (this kills "nobody"); an exemption; a named character; a deity claim.
- SOURCE: the card prints `muster · standing LICENSED` for the `force` field, holder null (`holderReason: town-resolved`). Under REFERENT rule 5 / OV-5 and W24 the muster's RECORD nouns ("the roll", "the muster roll") are citable only where a live `Citizen militia` with the `Muster training` service resolves; on this key the militia is ABSENT by construction, so no muster record exists to cite. Ruling for the drafter: cite NOTHING on this pool (the `[ledger]` tag is a standpoint and licenses no record noun, W24; "entered as standing" is the office's formula and stays lawful, R-vi/W7).
- Slots a face may name: `{settlement}` only (the face's slot set must equal the parent's; `{band}` is RESERVED and `{route}` unfilled here). A sentence-form FACE may not OPEN on `{settlement}` (ARCH §2.5 T-F8: a sentence face opening on a `proper`-typed slot of the block's bag is refused) and the settlement token opens at most one VARIANT per pool (R-DA-17, MOVE-GRAMMAR wall 10).

---

## 1. VARIANT 1 `[ledger]` (checkpoint 2)

### 1.1 Number and angle
Variant 1 · `[ledger]` (vid 1; annex `:2601`).

### 1.2 The shipped sentence, verbatim
> {settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night.

### 1.3 Every claim, tagged (licence · referent layer beside the read's layer)
| # | claim | licence | layer of the noun | layer of the read | note |
|---|---|---|---|---|---|
| 1 | {settlement} has a wall | LICENSED, read (b) `walls.present` | BODY ("a wall") | BODY | CONDITIONAL on the word: the read resolves the BUCKET, not a row; W15 / ENTAILMENT A-7 make "the works" the safe spelling; "a wall" is false of a Citadel or a Gates row and is the W15 alias hazard. The FACT stands; the NOUN is re-spelt. Also T-F8: a face may not open on `{settlement}`. |
| 2 | nobody to man it | UNLICENSED: a totality over persons (REFUSED COLUMN); manning NOT ENTAILED by a wall (ENTAILMENT law item 1, D-3/D-6 "manning"); contradicted on town tier where the required `Town watch` stands and holds Gate duty (§0.4 c) | PERSON-plural ("nobody") | NONE (an absence of two bodies) | W22: no person as load-bearing referent. The licensed kernel underneath: no garrison and no militia stands (read c). |
| 3 | The line [is] | UNLICENSED under W20 / REFERENT row 81: "the line" is the MANNED FRONT (a force word) wherever the pool reads a force, and this pool reads `force` | BODY-as-force-word | BODY (walls) | the wrong layer for the wall noun; "the works" is the safe class word |
| 4 | is a chokepoint on paper | UNLICENSED: a tactical CAPABILITY of the wall the presence flag does not hold (D-3 NOT ENTAILED: "a controlled entry point" only CONDITIONAL, and never "chokepoint"); "on paper" is a STANDPOINT (card `may NOT`) and a figure | NONE | BODY | the engine string `threatAssessment.js:66` is the source of the word and licenses nothing (OW-20: product code, not a field) |
| 5 | a chokepoint requires people standing in it | UNLICENSED: a MAXIM (the generalisation test, R-DA-12; the register card's "closes on a maxim"); a totality over persons; manning asserted | PERSON-plural ("people") | (none) | no field holds what a chokepoint requires |
| 6 | which this town cannot supply | UNLICENSED: a `which`-tail (R-DA-03, the owner's rule verbatim); a CAPABILITY forecast about the town (a modality the card does not hold); "supply" persons = a count over persons | NONE (the town) | (none) | |
| 7 | for more than a night | UNLICENSED: a COUNT / duration (card `may NOT: a count`; R-DA-16: no time quantity without a band field); a forecast | NONE | (none) | |
| 8 | (implicit) the country is plagued | NOT STATED: the shipped ledger line omits read (a) entirely | — | NONE | a lost licensed read; the rewrite must state it (skeleton rule) |

### 1.4 The reads the rewrite must state (all of them, in every face)
- (a) the country around {settlement} is plagued by monsters (monster activity high in the region; country-scoped; never disease; never "nothing threatens the town").
- (b) the works stand (a wall-class member is on the roster) — spelt "the works" / "what the town has built".
- (c) no garrison and no militia stands to them (the force of the muster's class is absent; the watch, a hired company or a charter hall are NOT read and may not be asserted absent or present).
- Plus the LICENSED claim of the shipped sentence: claim 1 (the works stand), re-spelt.

### 1.5 The angle's stance in one sentence
The ledger enters the three legs of the key as standing facts in the office's own formula ("entered as standing", "carried on the record", "set down"), measures nothing it cannot read, cites no record (no muster record resolves on this key and the `[ledger]` tag is a standpoint, not a citation, W24/W8), and may NOT invent a tactical reading of the works (a chokepoint, a line, a night's holding), a duty ("should man it"), a manning count, a maxim or a forecast of what the town can supply.

### 1.6 The turns worth keeping (lawful verbatim clauses; the density floor)
- None survives whole. The shape "{settlement} has a wall and nobody to man it" is the pool's one memorable compression, but its second half is a refused totality over persons and its first half opens a face on a proper slot (T-F8) and uses the alias-barred noun. The LAWFUL form of that compression exists and the drafter should carry its weight: the works stand and no force stands to them (two standing facts joined by "and", one keyed condition, no person noun). The clause "and nobody to man it" is the exact unlicensed claim; a licensed form of the compression is "and no force to hold them" (the key's own word, as a standing fact).

### 1.7 What would make the rewrite a regression here
- An inventory line: "The works stand at {settlement}. There is no force." states the key with no angle and drops read (a) (the country's threat), which the shipped line ALSO dropped; a rewrite that restates the omission is not richer in truth.
- A face that keeps "nobody", "no one", "unmanned" or "the watch" (W22 · the refused totality · D-F3's class).
- A face that keeps "the line" or "chokepoint" (W20 · row 81 · D-3).
- A face that cites "the roll" or "the muster roll" (no militia resolves on this key; W24, OV-5).
- A face that opens on `{settlement}` (T-F8) or that names a second wall-class object (a gate, a citadel).
- A face that states the threat over the TOWN ("{settlement} is beset") instead of the country (W2, C7 on the same page as the war rows).

---

## 2. VARIANT 2 `[visitor]` (checkpoint 2)

### 2.1 Number and angle
Variant 2 · `[visitor]` (vid 2; annex `:2602`).

### 2.2 The shipped sentence, verbatim
> A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal.

### 2.3 Every claim, tagged
| # | claim | licence | layer of the noun | layer of the read | note |
|---|---|---|---|---|---|
| 1 | A stranger [is the eye] | LICENSED as the `[visitor]` angle's standpoint (W27; REFERENT OW-11: "a stranger" is the angle's standpoint, not a role) | NONE (a stance noun; not a person referent) | — | it may see and find; never act, decide, be told or be named |
| 2 | walks the perimeter | UNLICENSED in part: "walks" is an ACT of the stance (W27: the stranger "may see, never act"); "the perimeter" is the wall-class BODY word with the ENTAILMENT A-7/D-6 hazard (false of a Citadel or a Gates row; W15's safe spelling "the works") | BODY ("the perimeter") | BODY (walls) | the licensed kernel: the works stand, seen by a stranger; place the eye ("a stranger at the works", "seen from the road") rather than march it |
| 3 | finds long stretches | UNLICENSED: an EXTENT / measure of the works (a count in words; D-3/D-6 NOT ENTAILED: continuity, a complete circuit, height) | NONE | BODY | |
| 4 | of good work | UNLICENSED: a CONDITION of the works (sound, well made): NOT ENTAILED (ENTAILMENT law item 1: condition needs its own read; D-3 "condition"); the walls' condition is no field on this branch | NONE (a quality) | BODY | |
| 5 | with nobody on them | UNLICENSED: a totality over persons (REFUSED COLUMN); manning NOT ENTAILED; contradicted at town tier (the required Town watch, Gate duty) | PERSON-plural | NONE (absence of two bodies) | licensed kernel: no garrison and no militia stands to the works |
| 6 | in a country where [the threat stands] | LICENSED, read (a): the country-scoped monster tier (W2) — the FRAME "in a country where" is lawful; its completion is not (row 7) | NONE (the country; a tier token) | NONE | the one clause of the shipped sentence that carries a licensed read in the licensed scope |
| 7 | that matters a great deal | UNLICENSED: a MEANING move (the gloss on what a fact means; MOVE-GRAMMAR §1.3 "MEANING does not exist"); a verdict ("a great deal"); a standpoint | (none) | NONE | the licensed completion is the tier's own meaning: the country is plagued by monsters / creatures press the country |

### 2.4 The reads the rewrite must state
- (a) the country is plagued by monsters (country-scoped) — carried by the shipped frame "in a country where ..." with a licensed completion, or stated first as what the country is.
- (b) the works stand — seen.
- (c) no garrison and no militia stands to them — found wanting, as an absence the eye meets, never "nobody".
- Plus the LICENSED claims of the shipped sentence: claim 1 (the stranger as the eye), claim 6 (the country frame).

### 2.5 The angle's stance in one sentence
The visitor is a stranger's EYE placed at {settlement}: it may see the works standing and find no force at them, and may set that beside what the country is (plagued by beasts), in a sentence that lands on a civic thing; it may not walk, act, judge, be told, be named, measure the works' length or condition, count anyone, or say what any of it "matters" (W27 · W8: the visitor carries a read only as a standing state seen, never as the town's act, a verdict or an accounts fact).

### 2.6 The turns worth keeping (lawful verbatim clauses)
- "A stranger" (the stance noun, as the shipped opener; lawful and not a proper slot, so it may open a face).
- "at {settlement}" (the placement of the eye; lawful).
- "in a country where" (the country-scoped frame for read (a); lawful as a frame; its completion must be the tier's licensed meaning, e.g. "in a country where beasts press" — the drafter's words).
- The construction "finds ... with ..." (perception verb + an absence found) is a lawful SHAPE for read (c) once the persons are cured: "finds the works standing and no force at them" is the licensed form of the compression; "with nobody on them" is the exact unlicensed clause.

### 2.7 What would make the rewrite a regression here
- Dropping the stranger's eye (a visitor face written as the ledger's flat entry is a dropped angle; W27/R-iv's counterpart).
- Dropping the "in a country where" frame for read (a), or completing it with a gloss ("where that matters", "where it counts") instead of the tier's meaning.
- Keeping "long stretches", "good work", "nobody on them" (measure · condition · totality).
- Marching the stranger ("walks", "goes round", "climbs") instead of placing the eye.
- Naming the wall by "the perimeter" or "the line" (W15 · row 81), or a second wall-class object.
- An inventory line with the stance dropped: "A stranger sees the works. No force stands." (no country read, no thread between the two).

---

## 3. VARIANT 3 `[unfolding]` (checkpoint 2)

### 3.1 Number and angle
Variant 3 · `[unfolding]` (vid 3; annex `:2603`).

### 3.2 The shipped sentence, verbatim
> The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed.

### 3.3 Every claim, tagged
| # | claim | licence | layer of the noun | layer of the read | note |
|---|---|---|---|---|---|
| 1 | The works at {settlement} [stand] | LICENSED, read (b) `walls.present`; "the works" is W15's always-safe spelling (ENTAILMENT D-6 HOLDS of every member) | BODY ("the works") | BODY | the pool's one lawful noun for the wall class; the density floor |
| 2 | are doing less | UNLICENSED: a CAPABILITY decline of the works; walls never decay and no field reads their effectiveness on this branch (ENTAILMENT law item 3; D-3 ENGINE CONTRADICTS: no roster removal, no decay clock but the calamity scar) | NONE | BODY | |
| 3 | each season | UNLICENSED: a SEASON (card `may NOT: a season`) and a TREND across time (HISTORY needs an event-provenance field; R1 STATE carries none, R-DA-19) | NONE | (none) | |
| 4 | as the watch thins | UNLICENSED twice: "the watch" is a BODY the read never consulted, on a branch that asserts `force` (garrison ‖ militia) is FALSE — REFERENT finding D-F3 HOLDS at `:2603`, W13/W20; and "thins" is a HEADCOUNT consequence, which is the military SCORE's cell (DS-DEF-5), barred by R-viii′ ("may NOT say the muster thins, deserts or is undermanned") | BODY ("the watch") | NONE (absence of garrison and militia) | at hamlet/village no watch exists (town-plus only); at town the required watch stands and is not read; either way the noun is at the wrong layer for the read |
| 5 | as [cause: the works do less BECAUSE the watch thins] | UNLICENSED: a CAUSE (card `may NOT: a cause`; no relation row joins a force to the works' output) | — | — | the "as" joint asserts a computed relation the engine does not hold |
| 6 | the thinning is not being reversed | UNLICENSED: a FORECAST / continuing trend in the progressive (STATE never FATE, R-DA-07; a standpoint on the town's inaction; a second fact) | NONE | (none) | |
| 7 | (implicit) the country is plagued | NOT STATED: the shipped unfolding line omits read (a) | — | NONE | a lost licensed read; must be stated |

### 3.4 The reads the rewrite must state
- (a) the country is plagued by monsters (country-scoped).
- (b) the works at {settlement} stand — verbatim from the shipped line.
- (c) no garrison and no militia stands to them — realised in the OPEN move as the matter standing open now.
- Plus the LICENSED claim of the shipped sentence: claim 1 ("The works at {settlement}").

### 3.5 The angle's stance in one sentence
The unfolding variant realises PRESENT then OPEN (V6; ADDENDUM 12 R-iv, W8): the works stand, and the holding of them stands OPEN NOW as an unmet standing matter (no force stands to them; "stands unheld", "stands open", "is owed a force" in the writer's own words), declarative and in the present, in a country plagued by beasts; it may NOT narrate a trend ("each season", "thins", "not being reversed"), name a cause, name the watch, or count anyone.

### 3.6 The turns worth keeping (lawful verbatim clauses)
- "The works at {settlement}" — lawful, the safe class noun with the placement; carry it as the opener of at least one face (it is not a proper-slot opener; `{settlement}` sits inside the phrase). This is the density floor of the pool.
- Nothing else of the sentence is lawful; the shape "X, and the Y is not Z" (a standing matter left standing) is the unfolding SHAPE and may be rebuilt on licensed content: the works stand, and the force to hold them stands wanting.

### 3.7 What would make the rewrite a regression here
- Writing the unfolding variant as the ledger's measure (order alone does not carry the angle; R-iv): a face without an OPEN move is a dropped angle.
- Losing "The works at {settlement}" from every face of this variant (the one lawful turn).
- Keeping any trend, season, cause or the watch (D-F3, R-viii′, the card's four bars).
- Stating read (c) as a headcount or a thinning ("few", "short of men", "thin on the works") — DS-DEF-5's cell.
- Dropping read (a) again.

---

## 4. POOL-LEVEL: THE READS, THE STANCES, THE COMPOSITION FENCES, THE REGRESSION LINE (checkpoint 2)

### 4.1 The reads the rewrite must state in EVERY face of EVERY variant (the skeleton rule)
1. THE COUNTRY: plagued by monsters (read a). Spellings the tables license: "the country is plagued by beasts / monsters / creatures", "monster activity in the country round {settlement}", "creatures press on the country", "an embattled country" (the validator's own spelling of the value, ENTAILMENT L-1). Never disease; never a count or a kind of creature; never an attack that happened (HISTORY); never over the town (W2).
2. THE WORKS: a wall-class member stands (read b). Spelling: "the works", "what the town has built", "the town's works". Not "the wall", "the perimeter" (W15 alias hazard; false of Citadel/Gates), never "the line" (row 81), never a material (W11), never a condition, extent, age or manning (item 1), never a gate or a second wall-class object (card, T-F12).
3. THE FORCE ABSENT: no garrison and no militia (read c). Spellings: "no force to hold them" (the key's word; the muster class absent), "no garrison and no militia", "no force of the muster's kind", "nothing of the muster stands to them". Never "nobody", "no one", "unmanned", "no watch" (the watch is not read and may stand), never "the muster thins / is short" (a headcount is DS-DEF-5's cell), never a pay word (no gate read on this key).
The three are ONE keyed condition (R-v); stating all three is not "a second fact".

### 4.2 The stances, one line each (from the register card and the block's PROVENANCE line)
- `[ledger]`: the office enters the three legs as standing facts in its own formula; cites nothing (no muster record resolves; W24); invents no duty, tactic, maxim or forecast.
- `[visitor]`: a stranger's eye placed at {settlement} sees the works and finds no force at them, beside what the country is; it never acts, judges, is told, or measures.
- `[unfolding]`: PRESENT then OPEN — the works stand; the holding of them stands open now; no trend, no season, no cause.
- What NO stance may invent here (the block's PROVENANCE line): a historical clause (walls built after a siege), a capability beyond presence, a manning fact; "the causal clauses here are CAPABILITY clauses (walls without people cannot be held)" is the block's own description of the SHIPPED text and licenses nothing: the card prints no cause and the engine joins no force to the works.

### 4.3 Composition fences the drafter cannot see but must write for (THE THREAD; the seam contract)
- This is a SPINE (role spine; spine mounts 1 on the defense tab; modifier mounts 0). The composer puts it FIRST; modifiers follow by salience. Every face must therefore END on a noun a modifier can pick up (the works · the country · the force) and must read as the passage's opening, never as a turn outward.
- A face is one or two sentences (A1). Where two: the second carries a noun forward from the first (R-i: the thread binds at k = 0).
- A sentence face may not open on `{settlement}` (T-F8); the settlement token opens at most one variant of the pool (wall 10); no face opens on a comma or a clause-list word.
- No em dash, no exclamation, no digit, no percent, no `which`; the copula kept, the expletive struck ("There is no force" is the R-DA-07 expletive: prefer "No force stands").
- The four faces of a variant are claim-equal to EACH OTHER (A6 across faces) and differ in CONSTRUCTION, not vocabulary alone (ADDENDUM 7 rule 4; W4: the variant's declared grammar is kept across its faces).
- At most ONE negated-surface opener per variant (W10 / R-ii): "No force stands to the works" is a PRESENT read negated, not an ABSENCE opener, but only once per variant.
- Sibling distance: the three variants keep three constructions (V1-shaped ledger entry · the visitor's perception frame · V6 PRESENT→OPEN); no two variants of the pool share their first two words (A11).

### 4.4 The provenance ruling for this pool
The card licenses a citation of the muster holder "where the provenance budget allows"; the referent law (rule 5, OV-5, W24) licenses the muster's RECORD nouns only where a live `Citizen militia` with `Muster training` resolves, and on this key the militia is absent by construction (holder null on the census row). RULING for the drafter, vetoable by the chair: zero citations on this pool; the ledger's formula ("entered as standing") is lawful; "the roll shows" is not.

### 4.5 What would make the rewrite of this POOL a regression (the inventory line and its kin)
- Any face that states fewer than the three reads (the shipped ledger and unfolding lines each state two; the rewrite must be richer in truth: three).
- Any face that is an inventory line: the key's facts with no angle and no thread ("The works stand. No force holds them. The country is plagued.").
- A lost lawful turn: "The works at {settlement}" (v3) absent from the pool; "A stranger ... at {settlement}" and "in a country where" (v2) absent from the visitor variant.
- A dropped angle: the visitor written as a ledger entry; the unfolding written without an OPEN move; the ledger written with a citation.
- A kept unlicensed clause: "nobody" (×2), "the line", "chokepoint", "for more than a night", "long stretches", "good work", "matters a great deal", "each season", "the watch thins", "not being reversed".
- A face plainer than the shipped where a licensed form of the compression exists (Part B §21.4, ADDENDUM 6): the shipped "has a wall and nobody to man it" and "finds ... with nobody on them" both have licensed forms at the same compression ("and no force to hold them"; "and no force at them"); a rewrite that spends two flat sentences where one licensed compression stood is the regression the density law names.
- A face that opens on `{settlement}` (T-F8 refusal) or names `{band}` / `{route}`.

### 4.6 Count
Three shipped variants (vid 1 `[ledger]` · vid 2 `[visitor]` · vid 3 `[unfolding]`); three sections above, one per variant; no variant added or removed (never trim).

Seat: Fable 5.1 — marker packet; checkpoint 2 complete.
