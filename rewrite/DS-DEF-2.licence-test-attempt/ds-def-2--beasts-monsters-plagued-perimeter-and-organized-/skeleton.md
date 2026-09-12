# MARKER SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, perimeter AND organized force`

Status: COMPLETE — see the closing line. (Was checkpointed section by section under the checkpoint law.)

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

### 0.5 How the card binds this pool (the marker's reading, applied below to every claim)

- **The card names ONE read** (`beastsRowSituation(family, perimeter, force) === 'plagued country, perimeter and force'`) and that read is a conjunction of THREE measured facts. Under ADDENDUM 8 ruling (1) the reads of a key are ONE keyed condition, never "a second fact"; under the SKELETON RULE every face states all of them. So every face MUST state: (R1) the country is at the `plagued` tier (monster activity in the COUNTRY, W2 country-scoped, never a totality over the town, C7 the war arm sits on the same page); (R2) a wall-class body stands (`forces.walls.present`); (R3) a force stands (`forces.garrison.present || forces.militia.present`).
- **Referent layers of the reads:** R1 is layer NONE (a config token of the country; no institution noun of any layer; a face names the country and the creatures, never a body). R2 is BODY (the walls bucket; the noun is the bucket's class word). R3 is BODY (the garrison or militia bucket). The card's `source: muster` is a HOLDER (the muster kind holds `walls`, `garrison`, `militia`, `force`; `holderTable.js:188-193`) and is citable only under the provenance budget.
- **The provenance budget is EMPTY here** (Part B §24: one citation per unit and only for S3's three reasons — two accounts that disagree; a count from an interested party; a keeper that is a power). This pool holds one account, refuses a count, and the muster is not a state organ or a power. So no face cites the muster, the roll or the books; and W24 adds that the `[ledger]` ANGLE licenses no record noun and no citation ("entered as standing" is the office's formula and lawful, R-vi/W7; "the roll shows" is a citation and refused). "The muster roll" / "the roll" as a RECORD is CONDITIONAL on a live `Citizen militia` with `Muster training` (OV-5) and this key fires on garrison-only towns too, so no face names a roll.
- **The force noun.** The key fires on garrison OR militia, and this block's bag has no `{defwork}` and no force slot; so "the garrison" (W12: a Garrison row only) and "the militia" (only where `forces.militia.present`) are each false on half the towns that select this pool, "the watch" is not consulted (D-F3), and "the guard" is struck (ADDENDUM 13 A.5). The ONLY always-safe spellings are the class words **the muster** / **the town's force** (and, below town, **the community**; the person-plural **the armed** / **the soldiers** at the refuter's grain, where "soldiers" is wrong on a militia town, so prefer the class word). No face names specialists, hunters or a charter hall (the Beasts key does not read `charter`; referent table "specialists").
- **The wall noun.** "the works" / "what the town has built" are true of every bucket member (D-6, A-7, W15); "the wall" HOLDS as the bucket's class word at the BODY layer (referent table); "perimeter", "the line", "a circuit", "around {settlement}" assert a geometry false of `Citadel` (inner) and `Gates (if walled)` (a point) and are refused (D-6; rulings-DEF2); a gate is "another civic object of the class `wall`" (the card's may NOT; T-F12) and is refused; W11 bars any material.
- **What the card refuses on every face:** a count (including a magnitude in words: "thick with", "substantial"), a cause (nothing in the engine joins the threat to the works or to the force; ADDENDUM 8 ruling (2)), a season or any time word ("constantly", "the week's", "each season", "on time"), a future or a progressive on a standing fact ("is holding", "is being spent"), a standpoint or a verdict ("properly", "survivable", "the most that can be said"), a second fact (a rota, a schedule, a use, a condition of the works, a manning of the wall: manning is NOT ENTAILED, entailment item 1; "the men on the wall" struck for exactly this), another wall-class object (a gate), a totality over persons ("nobody", "everyone"), a belief or feeling frame ("treats as unusual"). `{band}` is RESERVED: no face names the arm's badge (an AGGREGATE word on a BODY read, W20).
- **The block's fence on capability clauses** ("walls without people cannot be held") licenses a CAPABILITY statement only on the sibling key where the force is absent; on THIS key both stand, and a face may set the two bodies side by side as one condition (the wall, and the force), joined on "and" or as two sentences, with NO relation asserted between them (no "to hold it", no "behind it" as a post, no "against the pressure" as an act). Institution presence has no recorded history (the fence): no "has answered", no "built after".
- **Form walls that bite the shipped rows:** T-F8 a sentence face never opens on `{settlement}` (none of the three shipped rows does; keep it so); A11 no two numbered lines share their first two words after slot normalisation; R-DA-07 the expletive opener ("there is") is a band at 0.020, spendable once at most and never as an opener; no em dash, no digit, no which-clause, no exclamation; no triad by habit (v2's list of three).

## 1. VARIANT 1 · `[ledger]`

**(2) Shipped, verbatim:**
`The country around {settlement} is thick with creatures and the town has answered it properly: there is a wall to hold and there are people to hold it, and both are in use constantly.`

**(3) Every claim, tagged (licence · referent layer beside the read's layer):**
- The country around {settlement} carries monster activity ("creatures"): **LICENSED** R1 `family === 'plagued'` (`plagued` = monster activity, L-1; "creatures" is the engine's own word, `threatAssessment.js:52` "creature pressure"); stated over the COUNTRY as W2 requires. Layer **NONE** (the country token) beside a NONE read — matches.
- The creatures are dense/many ("thick with"): **UNLICENSED** — a count in words (a magnitude the tier word does not hold; the tier is a rung, not a density) and a figure (R-DA-11: a comparison is a measurement in words; "thick with" is neither). Layer NONE.
- The town has ANSWERED the threat (an act by the town): **UNLICENSED** — a fused agent (W23: the town as a deciding actor; no field records a decision) and a HISTORY (an act in the past on a standing configuration field; the block fence: institution presence has no recorded history; R-DST-B). Layer: the town as AGENT — no layer; W22/W23.
- The works and the force exist BECAUSE of the threat ("answered it"): **UNLICENSED** — a cause (the card's may NOT; ADDENDUM 8 ruling (2): the key is a conjunction of reads, not a computed relation; nothing in the engine joins `monsterThreat` to a wall row).
- The answer is PROPER ("properly"): **UNLICENSED** — a verdict/standpoint (the register rates nothing; no typed rating field on this read; `{band}` RESERVED).
- The colon: "there is a wall … in use constantly" GLOSSES what "answered properly" means: **UNLICENSED** as a form — the MEANING move (the summarising second clause; R-DA-03; MOVE-GRAMMAR 1.3).
- A wall stands at {settlement} ("there is a wall"): **LICENSED** R2 `forces.walls.present`. Layer **BODY** (walls bucket; "a wall" is the bucket's class word, HOLDS) beside a BODY read — matches. The safest spelling is "the works"; "there is" is the expletive (R-DA-07 band, not a wall).
- The wall is a thing TO HOLD (its function in use is to be held/manned): **UNLICENSED** — manning is NOT ENTAILED by a wall row (entailment item 1; ADDENDUM 13 A.5 struck "the men on the wall"); a duty/use no field holds.
- A force stands ("there are people"): **LICENSED** R3 `garrison || militia`. Layer **BODY** at the person-plural grain (garrison/militia bucket) beside a BODY read — matches; "people" asserts no count and no roll and is lawful as a plural class word, though the ratified spellings are "the muster" / "the town's force" (W15).
- The people are there TO HOLD the wall ("people to hold it"): **UNLICENSED** — a relation between two referents no field computes (W23) and a manning/duty claim (not entailed); the two bodies are read as PRESENT, never as posted.
- Both are IN USE ("both are in use"): **UNLICENSED** — an observable the fields do not hold (presence is the whole read; use, activity, service are not recorded).
- The use is CONSTANT ("constantly"): **UNLICENSED** — a season/time claim (the card's may NOT) and a totality over time; also a movement in time on a standing field (STATE never FATE).
- The compound "X and Y: Z, and W, and V" — one sentence carrying five assertions: the three reads are ONE keyed condition and may share a sentence; the fourth and fifth (use, constancy) are second facts and go; the colon-gloss goes (above).

**(4) The reads the rewrite MUST state (every face):**
1. R1 — the country around {settlement} is at the plagued tier: monster activity in the country, stated as the country's standing condition (the country is plagued; creatures press the country; the country outside carries them), never "thick", never a count, never a totality over the town, never "safe from"/"nothing threatens" (C7: the war arm sits on the page).
2. R2 — a wall-class body stands: "the works" / "what the town has built" / "a wall" / "the wall", presence only (stands · is up · is in place · the town's own).
3. R3 — a force stands: "the muster" / "the town's force" (below town "the community"), presence only; never garrison, militia, watch, guard, hunters, specialists; never a headcount, a rota, a post.
4. The three as ONE condition of the record: the country first or the works first as the grammar wants (V1 PRESENT; or V4 OBJECT → PRESENT with the works named first); one joint on "and" or two plain sentences; no edge between the threat and the bodies; no edge between the wall and the force.
Plus the LICENSED claims of the shipped sentence: the country-scoped threat frame ("The country around {settlement}"), "creatures" as the threat's noun, the wall and the people set side by side as a pair.

**(5) The angle's stance:** the ledger ENTERS the three facts as the office's compiled record holds them — the country's tier on the books beside the works and the muster carried standing — in the clerk's third person, landing on the civic noun (the works, the muster, the country); it may use the office's own formula ("entered as standing", "carried on the books", "stands to the town's name") and may NOT cite the muster or a roll (the budget is zero; W24 the ledger tag licenses no record noun), rate the arrangement ("properly", "adequate", the band word), name a cause, a history ("answered", "built when"), a use, a rota, a manning, a season or a magnitude.

**(6) The turns worth keeping (the density floor):**
- `The country around {settlement}` — a lawful sentence opener (a capital not a proper slot, T-F8) and the exact country-scoped frame W2 requires; a face may carry it verbatim as the threat's frame.
- `creatures` — the engine's own noun for the monster class; sharper than "monsters" or "the threat"; keep.
- the PAIRED presence of the two bodies, wall first, joined on "and" (`a wall … and … people`), stripped of both `to hold` clauses: the pairing as one condition is the shipped line's true compression and is lawful; the duty is not.
- the three-beat landing shape (country · wall · force, then stop) is word order and punctuation, spendable and worth spending; the fourth beat (`both are in use constantly`) is a second fact and goes.
- Nothing else in the line is lawful: "thick with", "has answered it properly", the colon-gloss, "to hold", "in use constantly" all carry a claim the card refuses.

**(7) What would make the rewrite a regression here:**
- an inventory line: "{settlement} is plagued, walled and garrisoned" or "The country is plagued. There is a wall. There is a force." — the three reads with no ledger stance and no landing noun (ADDENDUM 7).
- a lost licensed read: a face stating the works and the force without the country's tier (the commonest drop in this pool's siblings), or the tier without one of the two bodies.
- a lost lawful turn: the country-scoped frame replaced by a town-scoped one ("{settlement} is beset"); "creatures" replaced by an abstraction ("the threat", "the danger") with no law behind the change (§21.4); the pair broken into two unrelated subjects.
- a dropped angle: a visitor's seeing or a street's mood where the row is `[ledger]`; or a bare book-keeping line that cites the roll ("the muster roll carries a wall and a force" is a citation, W24).
- an ADDED unlicensed claim the pool has already been caught on: a magnitude ("thick", "heavy", "constant" pressure); a cause ("kept because", "against the country", "answers"); a history ("has answered", "was raised"); a use or rota ("in use", "manned", "held", "stood to"); a season ("constantly", "each night"); a verdict ("properly", "well", "adequate", the badge word); a gate; "garrison" or "militia" or "the watch"; specialists or a charter hall; a totality ("nothing gets through", "nobody").
- a form fault the gate refuses: opening on `{settlement}`; a face whose slot set is not exactly `{settlement}`; a digit, an em dash, a which-clause; a triad by habit; the expletive as the opener; two numbered lines sharing an opener after normalisation.

## 2. VARIANT 2 · `[street]`

**(2) Shipped, verbatim:**
`Defense at {settlement} is not an emergency arrangement, it is the week's work: the rotations run, the gates close on time, and nobody treats any of it as unusual.`

**(3) Every claim, tagged (licence · referent layer beside the read's layer):**
- {settlement} has a defense (something stands against the country): **LICENSED** only as the key's condition in the aggregate — but "Defense" is an abstraction that NAMES NO READ: the face states neither the wall (R2) nor the force (R3) nor the country's tier (R1). Layer **AGGREGATE/NONE** (the tab's own label) beside two BODY reads and a NONE read — a frame, not a statement of the reads; lawful as a frame only if the reads follow.
- The defense is NOT an emergency arrangement: **UNLICENSED** — a contrast whose rejected alternative names no sibling key or band (R-DA-02: the siblings are "perimeter but NO force" and "NO perimeter and NO force", and "emergency" is neither) and a standpoint (the character of the arrangement). A negated surface on a PRESENT read is not by itself an absence opener (R-ii), but the contrast is unlicensed on its own ground.
- The defense is routine, regular, long-standing ("it is the week's work"): **UNLICENSED** — an observable the fields do not hold (routine, activity), a time claim ("the week"; the card's may NOT: a season), and a HISTORY by implication (long enough to be routine; the fence: presence has no recorded history). The idiom descends from the engine string's "ongoing operational necessity" (`threatAssessment.js:53`), which is product code and no licence (OW-20).
- The colon list GLOSSES "the week's work": **UNLICENSED** as a form — the MEANING move; and a TRIAD by habit (three items; the register card).
- Rotations exist and run ("the rotations run"): **UNLICENSED** — a rota is manning, NOT ENTAILED by a garrison or militia row (entailment item 1; D-7/D-8 NOT ENTAILED: numbers, ever mustered, competence); an activity no field records. Layer: a BODY activity of the force — the force read is PRESENCE; the noun "rotations" imports the WATCH-shaped activity of the engine's militia branch ("Watch rotations are thin", `threatAssessment.js:58`) on a read that never consults the watch (D-F3's sibling finding).
- There are gates ("the gates"): **UNLICENSED** — "another civic object of the class `wall`" (the card's may NOT; T-F12); a gate is entailed by no wall member (D-5: `hasGates` fires on a palisade with no gate row; the hamlet/village `Palisade or earthworks` may be a berm). Layer BODY (walls bucket via "walled") — the layer matches the wall read but the object is the class's second member and is refused.
- The gates CLOSE, and close ON TIME (an act on a schedule): **UNLICENSED** — an observable the fields do not hold (an act; a schedule), a time claim ("on time"), and the `Town watch`'s gate duty is recorded on gateless towns (L-61) so even the engine's own gate note is a label read.
- Nobody treats any of it as unusual: **UNLICENSED** — a TOTALITY OVER PERSONS ("nobody": a REFUSED COLUMN, always) and a BELIEF/FEELING frame (what people regard; a sense verb on an abstraction; NL-5/R-DA-14 seen, not meant; no field carries a mood). Layer **PERSON** ("nobody") — a person is never a referent (W22).
- The comma splice "X, it is Y" and the whole unit as one sentence of five clauses: a form fault (a second fact takes its own sentence; S2's clause seat is for a computed consequence, which none of these is).
- ABSENT from the shipped sentence altogether: R1 (the plagued country is never named), R2 (no wall, only a gate), R3 (no force, only "rotations"). The shipped `[street]` line states NONE of the three reads directly; it is the pool's thinnest row in truth and its richest in invention.

**(4) The reads the rewrite MUST state (every face):**
1. R1 — the country's tier: creatures press the country around {settlement}; the country is plagued (monster activity), as the town's own talk would put it and still country-scoped (W2), never "the town is besieged"/"nothing gets in" (C7).
2. R2 — the works stand: "the works", "what the town has built", "the wall"; presence only.
3. R3 — the force stands: "the muster", "the town's force", below town "the community"; presence only.
4. The three as one condition: the street may order them as the town would speak of them (the country first, then what stands against it; or the works and the muster first, then the country they face) — one joint or two sentences; no edge; no gate; no rota.
Plus the LICENSED claims of the shipped sentence: none beyond the frame "Defense at {settlement}", which a face may keep only as an opener that the three reads then fill; nothing in the shipped line's body is licensed.

**(5) The angle's stance:** the street is "the town's own talk about its condition" (annex angle table) — the record setting down, in the clerk's third person, how the condition stands as the town speaks of it: the country's creatures as a fact the town lives beside, the works and the muster as the things the town has and names; the talk is ABOUT the facts and may NOT invent a routine, a rota, a schedule, a gate, a mood, a belief ("nobody thinks", "everyone knows"), a totality over persons, a verdict on the arrangement, a history ("long enough"), or a contrast with an arrangement no sibling key names; the register card still binds (no "you", no persona, no assigned reaction; the WORD may recur, the FACT must not).

**(6) The turns worth keeping (the density floor):**
- `Defense at {settlement}` — a lawful opener (a capital not a proper slot; the arm's own label as the frame) and the street's natural subject; a face may keep it as the frame the three reads then fill. It carries no read by itself, so it is a frame, not a floor.
- the short-clause rhythm of the list (`the rotations run, the gates close`) is spendable word order; its CONTENT is not. A face that wants that cadence spends it on the licensed nouns (the works, the muster, the country) and stops at two, never three by habit.
- Nothing else in the line is lawful. "not an emergency arrangement", "the week's work", "the rotations run", "the gates close on time", "nobody treats any of it as unusual" each carry a claim the card refuses.

**(7) What would make the rewrite a regression here:**
- an inventory line: "The country is plagued and the town has works and a muster" with no street voice and no landing noun.
- a lost licensed read: a street face that keeps the shipped line's shape and again states no read (the shipped defect); a face that names the works and the muster but not the country; or the country and the works but not the muster (the commonest drop on this key).
- a lost lawful turn: the "Defense at {settlement}" frame dropped for a settlement-opener (T-F8 refuses it anyway); the street's plain register flattened into the ledger's formula ("entered as standing") — that is a dropped angle, not a turn.
- a dropped angle: a ledger line under the street tag; a visitor's "a stranger sees"; an unfolding progressive. The street sounds like the town speaking of itself, in the record's third person.
- an ADDED unlicensed claim, already caught on this pool and its siblings: a rota/rotation, a gate (any gate), a schedule or time word ("on time", "each night", "the week's"), "emergency", a routine or habit, a totality over persons ("nobody", "everyone", "the whole town"), a belief or feeling ("thinks", "treats as", "does not worry"), a verdict, "the watch", "the garrison", "the militia", a headcount, a contrast with a non-sibling ("not an emergency", "not a gap").
- a form fault: opening on `{settlement}`; a comma splice; a triad by habit; a which-clause; an em dash; a digit; a face whose slot set is not exactly `{settlement}`; sharing the first two words with variant 1 or 3 after normalisation (variant 1 owns "The country"; variant 3 owns "What {settlement}").

## 3. VARIANT 3 · `[unfolding]`

**(2) Shipped, verbatim:**
`What {settlement} has built is holding against the pressure and is being spent doing it; the posture is survivable, and survivable is the most that can be said of it here.`

**(3) Every claim, tagged (licence · referent layer beside the read's layer):**
- {settlement} has built works (the wall-class body stands): **LICENSED** R2 `forces.walls.present` — "what the town has built" is the ratified ALWAYS-SAFE spelling of the wall class (W15; A-7; D-6), true of every bucket member, and its perfect tense is the spelling's own and asserts no builder, date or history beyond the presence. Layer **BODY** (walls bucket) beside a BODY read — matches.
- There is a pressure on the town from creatures ("the pressure"): **LICENSED** R1 `family === 'plagued'` — "pressure" is the engine's own noun ("constant creature pressure", `threatAssessment.js:52`), but the shipped line leaves its SOURCE unnamed: a face must name the country (W2: the threat is country-scoped; "the pressure out of the country", "the country's creatures"), so that the war arm on the same page is not contradicted (C7). Layer **NONE** (the country token) beside a NONE read — matches once the country is named.
- The works are HOLDING against the pressure (withstanding; effective): **UNLICENSED** — an observable the fields do not hold (D-1/D-3 NOT ENTAILED: "whether attacked", "whether they have held", condition); an intent/act for an inanimate thing (R-DA-11); a relation between the wall and the threat no field computes (ADDENDUM 8 ruling (2): the key is a conjunction; nothing joins the tier to the wall); and a progressive on a standing field (STATE never FATE).
- The works are BEING SPENT by the holding (worn, consumed): **UNLICENSED** — ENGINE CONTRADICTS: built walls never decay (`defenseGenerator.js:186-187`; ADDENDUM 13 A.3: the one decay clock is the calamity scar; "timber rots"/"stone endures" refused even where common sense agrees); a cause ("doing it"); a movement in time on a standing field; a figure ("spent"). Layer BODY with a condition the read does not hold.
- The posture is SURVIVABLE: **UNLICENSED** — a verdict/rating with no typed rating field on this read (`{band}` is RESERVED; the arm's badge is not this pool's read, and a badge word on a body read is refused, W20); a forecast (survivable = the town will survive); "posture" is the desk's chrome word for the fifteen STRESS postures (L-57), not a wall word. Layer **AGGREGATE** (a rating) beside BODY/NONE reads — a mismatch.
- "survivable is the most that can be said of it here": **UNLICENSED** — the MEANING move (a summarising clause on the clause before), a standpoint (the compiler's own limit on the assessment), a maxim-shaped gnomic close (R-DA-12), and a totality over the assessment ("the most"). The register never explains what a fact means and never closes on a verdict.
- ABSENT from the shipped sentence altogether: R3 — no force stands anywhere in it ("what {settlement} has built" is the works; "the posture" is an abstraction). The shipped `[unfolding]` line drops one of the three reads.
- The semicolon-joined unit of four clauses: the third and fourth are second facts and a gloss; a form fault under the register card.

**(4) The reads the rewrite MUST state (every face):**
1. R2 — the works stand: "what {settlement} has built" verbatim (the floor), or "the works", "the wall"; presence only, no condition ("holds", "sound", "whole", "spent", "worn").
2. R3 — the force stands: "the muster", "the town's force", below town "the community"; presence only — the shipped line's missing read, restored on every face.
3. R1 — the country's pressure, named as the COUNTRY's and as the matter standing open: creatures press the country around {settlement}; the country stays plagued; the pressure out of the country stands — the OPEN move of R-iv (a standing condition whose value is unsettled: the threat is live and unmet), declarative, never a forecast ("will hold", "will break"), never a trend ("thinning", "rising"), never a progressive act of the wall.
4. The order R-iv fixes for this tag: PRESENT then OPEN — the works and the muster first, the country's pressure standing open LAST (V6: PRESENT → OPEN(standing-open)); the second sentence, if any, carries a noun forward from the first (R-i: the thread at k = 0).
Plus the LICENSED claims of the shipped sentence: "What {settlement} has built" verbatim; "the pressure" as the threat's noun with the country named.

**(5) The angle's stance:** the unfolding is "the movement still running, not yet settled" (annex angle table) and, ruled at R-iv, it realises the OPEN move after the presence — what stands, and the matter that stands open against it — never the ledger's measure and never a trend; here the open matter is the COUNTRY'S pressure, which is live and unsettled on the record (the tier is `plagued` and nothing in the record closes it), so a face states the works and the muster as standing and the country's creatures as still pressing (present, standing, unmet), and may NOT turn the openness into time ("each season", "being spent", "for now"), into an outcome ("survivable", "holding"), into a wear or decay of the works (the engine contradicts it), into a figure, or into a gloss on what the pair means; R-DST-W4-b bars any length-of-time claim (no duration field exists on the read).

**(6) The turns worth keeping (the density floor):**
- `What {settlement} has built` — verbatim: the lawful sentence opener (a capital, not a proper slot) and the ratified always-safe wall spelling; the sharpest licensed particular this pool has for the works. A face carries it as it stands.
- `the pressure` — the engine's own noun for the creature threat; keep it, and attach the country to it ("the pressure out of the country", "the country's pressure") so the read is country-scoped.
- the two-beat shape of the shipped first clause (the works named, then the pressure they face) survives if the verb between them asserts no act: "stands" / "stands before" / "faces" as a spatial fact is still a relation; the lawful form sets them side by side ("What {settlement} has built stands. The muster stands with it. The pressure out of the country stands unmet.") or joins on "and" with no edge.
- Nothing else in the line is lawful: "is holding against", "is being spent doing it", "the posture is survivable", "the most that can be said of it here" each carry a claim the card refuses; the owner's cadence in the last clause goes because it is a verdict and a gloss, and what replaces it must land the open pressure with the same compression (one licensed noun, one standing verb, no gloss).

**(7) What would make the rewrite a regression here:**
- an inventory line: "The works stand, the muster stands, the country is plagued" with no OPEN move and no unfolding order.
- a lost licensed read: the force left out again (the shipped defect); the country's pressure stated without the country; the works stated without "what {settlement} has built" or a lawful equal.
- a lost lawful turn: "What {settlement} has built" replaced by "the wall" with no law behind the change (§21.4: plainer with no reason is the regression); "the pressure" replaced by "the threat"/"the danger".
- a dropped angle: the ledger's measure under the unfolding tag (R-iv: a face built as book-keeping is a dropped angle); a visitor's seeing; an [elder] length-of-time claim ("has held for years") which R-DST-W4-b bars.
- an ADDED unlicensed claim, already caught on this pool and its siblings: "holding", "holds", "sound", "whole", "spent", "worn", "thinning", "doing less"; a forecast ("will hold", "survivable"); a trend or season ("each season", "for now", "still"); a cause ("against", "because", "doing it"); a verdict or band word; a gloss ("which is to say", "the most that can be said"); "posture"; a gate; "garrison"/"militia"/"the watch"; specialists; a totality over persons.
- a form fault: opening on `{settlement}`; a which-clause; an em dash; a digit; a semicolon chain of more than two beats; a face whose slot set is not exactly `{settlement}`; sharing the first two words with variant 1 ("The country") or variant 2 ("Defense at") after normalisation.

## 4. WHAT THE POOL'S REWRITE MUST HOLD ACROSS ALL THREE VARIANTS (for the drafter and the refuters)

- **Three variants, three grammars, three openers.** A pool of three carries three distinct level-1 grammars (MOVE-GRAMMAR 2.1): the natural set is V4 (OBJECT → PRESENT: the works or the country named, then the standing condition) for the ledger, V1 (PRESENT: the plain civic fact in the town's own talk) for the street, and V6 (PRESENT → OPEN: the works and the muster standing, the country's pressure standing open) for the unfolding, as R-iv rules. The three numbered lines open on different first-two-words after normalisation and none on `{settlement}`; variant 1 owns "The country", variant 3 owns "What {settlement}", variant 2 "Defense at" or another lawful frame.
- **Every face states all three reads** (R1 country tier · R2 works · R3 force) — the shipped rows state 3, 0 and 2 of them respectively, so the rewrite is RICHER in truth on every row by construction; the density floor is the shipped line's compression on its lawful turns, not its inventions.
- **The force is a class word only:** the muster · the town's force · below town the community. Never garrison (W12), militia (fires on garrison-only towns), the watch (D-F3; not consulted), the guard (struck), hunters/specialists/a charter hall (not read), "the men on the wall" (struck), a headcount, a rota, a post.
- **The wall is one object per unit:** the works · what the town has built · the wall. Never a gate (the card's second wall-class object), a perimeter/line/circuit/"around {settlement}" (false of Citadel and Gates, D-6), a material (W11), a condition (holds, sound, whole, spent).
- **The threat is the COUNTRY's and it is monsters:** `plagued` = monster activity (L-1), never disease, never a totality over the town (C7: Invasion & War sits beside this row on the same page), never a magnitude ("thick", "constant", "heavy"). The engine's own nouns "creatures" and "pressure" are lawful; "the wild country", "the country outside", "the approaches" are the safe spellings for where it lives.
- **No relation between any two of the three reads:** the key is a conjunction (ADDENDUM 8 ruling (2)); the two bodies and the tier are set side by side; no "to hold it", "behind it" as a post, "against the pressure" as an act, "answered", "because", "kept for". The block fence's capability clause belongs to the sibling keys where a body is absent, not here.
- **The provenance budget is zero:** no face cites the muster, a roll, or the books (Part B §24; W24 the ledger tag licenses no record noun); "entered as standing" / "carried standing" is the office's formula and lawful on the ledger row.
- **No time, no verdict, no gloss:** the card refuses a season and a future; the register refuses a rating, a maxim and a summarising clause; `{band}` is RESERVED so the badge word never appears; "posture" is chrome.
- **The thread (1.4.1; R-i at k = 0):** where a variant runs to two sentences, the second carries the works, the muster or the country forward from the first; no face turns outward, because this pool is the spine and the turn belongs to a modifier. The composer places modifiers after this spine by salience; each face must read well immediately followed by any sibling modifier, so each face ENDS on a standing civic noun (the works, the muster, the country) and not on a gloss.
- **Slots:** every face carries exactly `{settlement}` (the bag's FILLED set); `{band}` and `{route}` are never named on this block's faces at these call sites.
- **Tier note for the refuters:** this key fires at every tier from thorp (`Palisade` + `Household levy` does NOT fire it: the levy is in no bucket; `Palisade` + `Citizen militia` at hamlet/village does) to city (`City walls and gates` + `Garrison`/`Professional city watch` in the garrison bucket), so a face must read true on a hamlet's berm with a part-time militia and on a city's masonry with professional soldiers alike: which is exactly why only the class words survive.

---
Status: COMPLETE (2026-09-11). Three variants marked; sections 0 to 4 on disk. Nothing outside this file was written; nothing but the read-only licence-card script was executed.
