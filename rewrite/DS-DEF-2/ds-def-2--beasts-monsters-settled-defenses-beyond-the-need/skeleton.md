# SKELETON; DS-DEF-2 · pool `Beasts & Monsters: settled, defenses beyond the need`

Marker: Fable 5.1 (a marker seat under the Fable chair; REWRITE car 8b, block DS-DEF-2). Written under the checkpoint law: sections land as they are finished; the PROGRESS line below says what is done.

PROGRESS: header written; licence card printed; sources read (register card; Part B §1, §16–16.2, §18, §20–24; MOVE-GRAMMAR §1–3, §4.4.1–4.4.3, §1.4.1; CLERK-LAWS §2.4.1, §2.6.1; ARCH v2 §2.5, §8.3; ADDENDUM 13 A and B; the census row; the reader in `defenseStateProse.js:393-451`). Variants: see the next line.
PROGRESS UPDATE: §0b written; VARIANTS 1, 2 and 3 marked; §4 (the pool whole) written. Variants: 3 of 3 marked. COMPLETE.

## 0. THE CARD AND THE READ (what every claim below is judged against)

Licence card (printed by `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: settled, defenses beyond the need'` in laneRW-DEF2, 2026-09-11):

- role: spine · form: sentence · move: none declared · angle set: counterforce ledger visitor
- reads: `beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)`; ONE read, branch grain; absent ⇒ no candidate
- predicate: that read `=== 'settled country, perimeter'`
- bag: {band: RESERVED, route: proper, settlement: proper}; FILLED at this block's call sites: {settlement} only
- relation / attach: none (a spine)
- echo: spine mounts 1 (tabs: defense); the echo key is shared by every row of `BEASTS_ROW_POOL`
- covert: no · audience: player (no mark)
- source: muster · standing LICENSED (the census `source.fields`: family '' · perimeter '' · force 'muster'; holder town-resolved by `holdersOf`)
- may claim: that the reader selects the row `settled country, perimeter`, as a STANDING fact of the record
- may NOT: a count, a cause, a season, a future, a standpoint, a second fact
- REFUSED COLUMNS always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim

What the row `settled country, perimeter` IS, from the reader (`defenseStateProse.js:429-440`, read only): `family === 'settled'` (the corpus family word produced by the config token `heartland`, ADDENDUM 13 A item 4: the LOW monster-and-raider tier of the country, never "no live threat", never "the centre of a realm") AND `perimeter === true`. The `force` argument is NOT consulted on this branch (the docblock at `:423-425` says so in words): a town with a wall and a force and a town with a wall and no force both select this row. The caller (`:655`) passes `walls` as `perimeter` and `garrison || militia` as `force`.

So the licensed claim set is exactly two facts, joined as one standing configuration:
- (R1) THE COUNTRY: the town's country is the low tier for beasts (the `settled` family); layer NONE (a terrain/threat token; it names no body).
- (R2) THE PERIMETER: the town has a perimeter, a wall-class work (the `walls` predicate, `defenseProfileHasWalls`); layer BODY (the wall-class row is reached by the read through the `perimeter` flag; its safe class words are "the works" / "what the town has built" / "the perimeter" / "the wall" as a class word; NO material, W11; NO manning, entailment law item 1).
- NOT licensed on this branch: any statement about a force, a watch, a garrison, a muster, "people on the wall" (the read does not consult `force`; manning is not entailed by a wall); any cause of the wall (DS-DEF-11 owns the wall's rationale and this pool may NOT restate it; a second fact and a cause); any count; any season; any future; any standpoint on whether the provision is right or wrong ("beyond the need" is the POOL KEY's discriminator, licensed as the STANDING relation of the two facts; a work is present where the tier is low; but never as a verdict word such as "over-provided", "wasteful", "comfortable").

The census `reads` line for this pool: `beastsRowSituation(family, perimeter, force) (via BEASTS_ROW_POOL in defenseStateProse.js)`; readsGrain `branch`, narrowed false, objectClasses [], k 2, covert false, sites `defense.threatAssessment`.

Referent layer of the READ (ADDENDUM 13 B, A.1): the pool's read is a BRANCH over two flags and a token. The `settled` token is NONE (a threat-tier token computed over the world, not a body). The `perimeter` flag reaches the wall-class rows of the roster through `defenseProfileHasWalls`, so a wall-class noun is at layer BODY and is licensed; nothing else on this read reaches a body. A watch, a garrison, a muster, a soldier, a person on a wall: a body or role word on a read that does not reach that row; UNLICENSED under W20 (and W13/W12 where the word is "watch"/"garrison"). A stranger: the visitor's eye (W27), may see, never act, decide, or be told.

The block header (annex `### DS-DEF-2`, lines 2568-2591 of `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` in laneRW-DEF2): STATE-KEY five fixed rows with a `scoreBand` badge read against `config.monsterThreat` (`plagued`/`frontier`/`settled`), the institution presence flags and `compound.inst`; SLOTS `{settlement}` `{band}` `{route}`; SECTION-TARGET `defense`; PROVENANCE + FENCE: institution presence is a STANDING fact with no recorded history; the causal clauses here are CAPABILITY clauses (walls without people cannot be held) and never HISTORICAL ones; the walls read rides `defenseProfileHasWalls`, never a presence check.

The register card's six one-line registers: the dossier (the record itself; the clerk's third person; the six shapes of its closed set; the town's name is not the default opener) is the one this pool writes in; the other five (NPC ladder · Herald · chronicle · DM page · chrome/docent) do not reach this pool. Amendment S2 (a computed consequence may ride as one clause) and S3 (a citation is two licensed claims, only where a clerk would cite: two accounts, an interested count, a keeper who is a power) bind.


## 0b. THE POOL AS SHIPPED, AND THE ONE READING THE WRITER DRAFTS FROM

Three shipped variants, vids 1 to 3, angles `[counterforce]` `[ledger]` `[visitor]` in that order (annex lines 2620 to 2623 in laneRW-DEF2's `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`; the leaf `src/data/dossierStateProse/defense.generated.js` lines 504 to 529 carries the same three texts, slots `["settlement"]`, vids 1, 2, 3). The writer rewrites these three one for one and gives each its face sub-rows.

### 0b.1 The reads, resolved to what each licenses (the writer's one table)

| read | what it holds for this key | holder (source) | licensed in words | NOT licensed |
|---|---|---|---|---|
| `family` (from `measuredMonsterFamily(config.monsterThreat)`) `=== 'settled'` | the country's beast-and-raider tier is the LOW tier (`heartland`, aliased `low`); MEASURED, never defaulted (an absent raw value returns null and the desk says nothing); ADDENDUM 13 A item 4 | none resolved by the census (`source.fields.family: ''`); the referent table's road holder is not on this card | the country around the town is quiet in the beasts' respect; little in the country; the low band as a STANDING condition of the COUNTRY (W2: country-scoped, never a totality over the town); "beasts", "creatures", "the country" are the row's own words (the STATE-KEY row is `Beasts & Monsters`; `plagued` means monster activity, so the row's referent is creatures, never disease) | "nothing", "no threat", "no live threat" (the tier is LOW, not zero; item 4 corrected the sibling skeleton's gloss); "the centre of a realm", "a heartland" as a PLACE word (a tier label, not geography); a peace (a war-and-treaty record); a season; a forecast of the threat rising; a raider or war claim (the same token feeds the stress roll's raider term, but DS-DEF-2's war row is its own read on the same page: C7) |
| `perimeter === true` (the caller passes `forces.walls.present` from `standingDefenseForces`, the LIVE ruin-filtered roster) | at least one wall-class row stands on the town's roll: `Palisade` · `Palisade or earthworks` · `Town walls` · `Gates (if walled)` · `Citadel` · `City walls and gates` · `Massive walls and fortifications` (the `walls` bucket) | `walls` → the MUSTER kind in the holder table (`holderTable.js:188`), CONDITIONAL on a Citizen militia's roll; the census marks `perimeter: ''` and names the muster only through `force` | the works stand; the town has built, keeps, holds standing its works; "the works", "what the town has built" (always safe, D-6); "the wall" and "the perimeter" as CLASS words (the referent table HOLDS them; the entailment table D-6 warns "perimeter" is geometrically false of a Citadel or a lone Gates row, so "the works" is the safer spelling); a controlled entry only for the three stone rows (D-3, CONDITIONAL; not bakeable) | a material (W11; `{defmaterial}` unminted; this pool's bag has NO `{defwork}` slot, so no recorded wall name may be printed either); size, extent, substance, height, condition, "substantial", "serious", "good work" (entailment law item 1: condition is NOT entailed; the flag fires on a thorp palisade); manning, "people on it", "men on the wall" (manning is NOT entailed; ADDENDUM 13 A item 5 struck "the men on the wall"); orientation ("facing the country") on every member (D-6); a count of works; when or why it was built (the block's PROVENANCE: institution presence is a STANDING fact with no recorded history); a second wall-class object |
| `force`; NOT CONSULTED on this branch (`beastsRowSituation` returns `settled country, perimeter` whether force is true or false; the docblock at `:423-425` says so) | unknown to this pool: the town may hold a garrison or militia, or neither | the muster (the card's `source: muster` comes from the `force` field alone) | NOTHING about a force, a muster, a garrison, a militia, a watch, soldiers, "people", "nobody"; the branch does not read it (W20: a body word only where the read reaches the row; W13; W12); the licensed silence is silence | any presence, absence, number, pay or readiness of a force; any person on or near the works |

**How the two facts join.** ADDENDUM 8 ruling (1) binds: the reads of a key are ONE keyed condition, stated as one PRESENT move on the STATE-KEY, joined by co-ordination, apposition, a rationed semicolon or two short sentences, NEVER by a causal joint ("because", "so", "since", "for", "now that") and never by a purpose frame ("what the walls are for"). The pool key's gloss "defenses beyond the need" is the pool's NAME, not a licence (ADDENDUM 8 ruling (2): a block's or pool's title is its name): a face may set the low tier and the standing works side by side, and the reader draws the surplus; a face may NOT say the works exceed, outrun, are beyond, are more than, are wasted on the need (a standpoint and a verdict the card refuses; the only typed rating on this block is the `scoreBand` badge, which THIS pool does not read). The juxtaposition IS the claim; the verdict word is not.

**What the [counterforce] angle is here.** The annex's palette: "the thing that did NOT happen; the cap, the prop, the restraint, plainly stated". On this key the thing that did not happen is the pressure: the country's beasts have not come to much (the low tier), and the works stand as the prop. Counterforce may state the restraint (the low pressure) beside the standing works; it may NOT state the REASON (every shipped counterforce row in the annex closes on "and the reason is …", which is a cause the card refuses) and may not say what the works are FOR.

### 0b.2 The provenance move, priced for this pool

The card licenses a citation of the muster where the budget allows; the ceiling is ONE per unit (Part B §24) and only for S3's three reasons (two accounts that disagree; a count from an interested party; a keeper who is a power). None obtains: no count is stated; the muster is not marked interested; and the fact the muster holds on this card (`force`) is not even read on this branch. The exemplar rate is zero; a citation here is a habit (a refuter's finding under §4.4.3 and W24). "The muster roll" as a RECORD word is licensed only where a `Citizen militia` with the `Muster training` service resolves (rule 5), which the card cannot see. RECOMMENDATION: zero citations; no record noun at all ("entered as standing" and "on the roll" are the ledger's formula, R-vi/W7, and are the most the `[ledger]` variant may spend).

### 0b.3 What the two tables already found on THIS pool (so the writer does not re-import it)

- The entailment refuter lists this pool's v1 "substantial works" and v3 "how relaxed the people on it are" among the live faces "more knowledgeable than the simulation" (ENTAILMENT-TABLE §2.1, the closing paragraph; annex `:2621`, `:2623`).
- The referent table's `force` row: on this desk `force = garrison || militia` and it EXCLUDES the watch, the mercenary, the charter; on the Beasts key the refuter faulted "specialists" (charter-hall bodies) asserted where the key reads no `charter`; the same class of fault as a force word on this branch, which reads no force at all.
- The referent table's D-F3 (the sibling `plagued, perimeter but NO force` v3, "as the watch thins"): a BODY word the read never consulted, HOLDS as a fault. This pool's v3 "the people on it" is the same fault one row down.


---

## VARIANT 1 · vid 1 · `[counterforce]`

### 1.2 Shipped sentence, verbatim (annex `:2621`)

> There is very little in the country around {settlement} and there are substantial works facing it; whatever the walls here are for, it is not the creatures.

### 1.3 Every claim it makes (one per line; licence · law · REFERENT LAYER beside the read's layer)

- The country around {settlement} holds very little (of the beasts the row names). **LICENSED**; read R1, `family === 'settled'`, the LOW tier stated over the COUNTRY (W2 satisfied: "the country around {settlement}"). "very little" is the low band's own magnitude, not zero, and stays inside item 4. Layer: NONE (a threat-tier token) beside a NONE read; matches.
- Works stand at {settlement}. **LICENSED**; read R2, `perimeter === true`; "works" is the always-safe class word (D-6). Layer: BODY (the walls bucket, reached by the read through the `perimeter` flag) beside a BODY read; matches.
- The works are *substantial*. **UNLICENSED**; an observable the fields do not hold (extent, size, condition; entailment law item 1: condition is never entailed by presence; the flag fires on a thorp `Palisade` and on a lone `Gates (if walled)` row; the entailment refuter names this exact word on this row as more knowledgeable than the simulation). Layer: BODY, but the ATTRIBUTE has no read.
- The works *face* the country (an orientation). **UNLICENSED**; an observable the fields do not hold on every member: D-6 finds "perimeter"/"facing" false of a `Citadel` (inner) and of a lone gate (a point); the class has no always-safe geometric generic. A face may say the works stand; it may not place them against the country.
- There are *walls* here. **LICENSED as the class word only**; read R2; "the walls" is the referent table's HOLDS class word for the bucket, but plural "walls" on a `Palisade` or `Gates` town over-specifies (W15 prefers "the works"); no material, no recorded name (this bag has no `{defwork}`). Layer: BODY beside BODY; matches.
- The walls are FOR something (they have a purpose). **UNLICENSED**; a cause (the card's may-NOT; the block's PROVENANCE fence allows CAPABILITY clauses only, never a why; DS-DEF-11 is the wall's why-frame and even there "because the country requires it" is refused, ADDENDUM 8 ruling (2)). A purpose is a cause in the future tense of the builder.
- Whatever that purpose is, it is not the creatures. **UNLICENSED**; a cause stated in the negative (no engine rule joins the tier to the wall; the key is a conjunction of two reads, not a computed relation, ADDENDUM 9's fold ruling on THREATENED applies here with the sign flipped); also a SECOND FACT by implication (that some OTHER pressure the wall answers exists; the war row, an internal row; which is C7's same-page hazard); also a standpoint (the record rating what the wall is good for).
- "whatever … are for"; the purpose is left open. **UNLICENSED**; an OPEN QUESTION move needs a state field whose value is unresolved (MOVE-GRAMMAR §1.2 row 10); no such field is on the card. As written it is a rhetorical hook (fault 15), which the card also refuses as a standpoint.
- "the creatures" as the thing the works are not for. Layer: NONE (the row's own referent; `plagued` = monster activity); the WORD is lawful for R1; the CLAIM it rides on is the unlicensed cause above.
- Implicit: the works exceed the need ("defenses beyond the need"). **UNLICENSED as a verdict**; the pool key is a name, not a licence (ADDENDUM 8 (2)); the juxtaposition of R1 and R2 is licensed and carries the surplus without a rating word.

### 1.4 The reads the rewrite must state (all of them)

- R1 `family === 'settled'`: the country around the town is the low tier for beasts; LICENSED content carried from the shipped line ("very little in the country around {settlement}"), country-scoped (W2), never "nothing".
- R2 `perimeter === true`: works stand at the town; LICENSED content carried from the shipped line ("there are … works"), by the class word, no attribute.
- The two as ONE keyed condition (ADDENDUM 8 (1)): stated side by side with no causal joint and no purpose frame.
- Nothing about a force (the branch does not read it): the silence is the licensed state.

### 1.5 The angle's stance, in one sentence

The counterforce states the thing that did not happen; the country's beasts have not come to much; beside the prop that stands regardless, the works, plainly, as the office compiled them; it may set the restraint and the standing work together and let the reader draw the surplus, and it may NOT give the reason (every shipped `[counterforce]` closes on "and the reason is", which is a cause the card refuses), name what the works are for, grade them, man them, or rank the town's other pressures.

### 1.6 The turns worth keeping (lawful under the card, verbatim)

- *There is very little in the country around {settlement}*; the low tier stated over the country in the band's own magnitude; lawful (R-DA-07's existential-opener figure is a BAND, not a wall: the expletive is reported, not failed, and this is the pool's one such opener; a face may keep it, and its siblings should open otherwise).
- *there are … works*; the presence by the class word (lawful once "substantial" and "facing it" are cut). The semicolon joint between the two reads is a rationed device (R-DA-06) and is lawful as the ONE joint of the unit.
- The SHAPE of the first half; the low country and the standing works co-ordinated in one sentence with no joint of cause; is this variant's density floor. The second half (the purpose clause) is not keepable in any wording.

### 1.7 What would make the rewrite a regression here

- Inventory: vid 1 not the first row; its angle not `[counterforce]`; its slot set not exactly `{settlement}`; fewer than four wordings; it no longer the pool's canonical index-zero line.
- A lost licensed read: a face that states the works and drops the low country, or states the country and drops the works; a face that states the country as "nothing" or "no threat" (a lost band: the LOW tier is the read, item 4).
- A lost lawful turn: no face keeps the co-ordinated shape (the country stated, the works stated, one joint, no cause); no face keeps *very little in the country around {settlement}* or a same-claim spelling of the low band over the country.
- A dropped angle: a face that reads as a plain inventory ("{settlement} has works and a quiet country") with no restraint stated; the counterforce's thing-that-did-not-happen must be present (the beasts have not pressed; the country has come to little).
- A re-import of the unlicensed claims: *substantial*, *facing*, *for*, *whatever*, *not the creatures* as a purpose, any "reason" clause, any verdict word (beyond, over, more than needed, wasted).
- A force word of any kind (the branch reads none): watch · garrison · muster · soldiers · people · nobody · unmanned · "nobody on them".
- A face that ends on a set-up (the purpose left hanging) rather than a standing fact a modifier can pick up (the works; the country).
- Under THE THREAD: this is a SPINE and sits first; every face must hand a noun forward (the works, the country) and must read well before any DS-DEF-2 modifier that follows by salience.


---

## VARIANT 2 · vid 2 · `[ledger]`

### 2.2 Shipped sentence, verbatim (annex `:2622`)

> {settlement} is comfortably over-provided against beasts. The pressures that matter to this town are internal, and its defensive spending does not reflect that.

### 2.3 Every claim it makes

- {settlement} is provided against beasts (there is provision: works stand). **LICENSED**; read R2 (the works as the provision; "provided against beasts" names the row's referent). Layer: BODY (the walls bucket) beside a BODY read; matches; the noun is implicit, which is the ledger's licence to say "the works" or "what the town has built" outright.
- Beasts are a low pressure on this town (the "over" in over-provided presupposes little to provide against). **LICENSED as content**; read R1, but the shipped wording scopes it to the TOWN ("over-provided" is a property of {settlement}); W2 requires the tier stated over the COUNTRY. Layer: NONE beside NONE; matches.
- The provision EXCEEDS the need ("over-provided"). **UNLICENSED**; a standpoint and a verdict (the card's may-NOT; R-DA-12: a rating word only where a typed rating field holds it; the `scoreBand` badge is not on this card and this pool's key is a name, ADDENDUM 8 (2)). The two reads side by side are the licensed form of the surplus.
- *comfortably*; the degree of the surplus, and an ease. **UNLICENSED**; a standpoint (an evaluative adverb on a civic condition, R-DA-10's evaluative floor at zero; also a FEELING word grafted onto a town, MOVE-GRAMMAR §1.3).
- The pressures that MATTER to this town are internal. **UNLICENSED** on three grounds; a second fact (the Internal Security row is its own read, `court ; prison`, on the same page and a different pool); a totality and a ranking ("the pressures that matter" ranks every pressure on the page against each other: the war row, the economic row and the disaster row may be CRITICAL on this town; C7, the same-page contradiction W2 names); a standpoint (what "matters" is a judgment no field holds). Layer: the referent "internal pressures" is AGGREGATE at best (a score band) and this pool reads no band.
- The town has defensive spending. **UNLICENSED**; a second fact and an observable the fields do not hold: this card reads no `economicGates.military` (the gate is DS-DEF-11's and DS-DEF-10's read, not this row's); W16 keeps "upkeep"/"the keeping"/"wages" for a GATE read only. Layer: a treasury/muster RECORD word ("spending") on a read that resolves no such record; W24 (an ORGAN read may use its kind's ratified nouns; this read is a branch over two flags and licenses no record noun; the `[ledger]` tag is a STANDPOINT and licenses no record noun either).
- The spending does not REFLECT the ranking of pressures. **UNLICENSED**; a verdict on a relation between two unlicensed facts (a fused relation no field computes, W23); a standpoint.
- *its* (defensive spending); the town as possessor of a purse. Layer: NONE/treasury; the possessor is lawful in form ("the town's"), the possessed noun is not licensed.
- The second sentence as a whole. **UNLICENSED** as a MEANING move; it explains what the first sentence means (the summarising second beat, R-DA-03; MOVE-GRAMMAR §1.3 "no field holds what a fact means"). Under A1 a second sentence must be a second licensed FACT of a varied kind or nothing; the only second licensed fact this pool holds is the other read.

### 2.4 The reads the rewrite must state

- R1 `family === 'settled'`: the country's beast tier is low; LICENSED content carried from the shipped line (the presupposition of "over-"), RE-SCOPED to the country (W2).
- R2 `perimeter === true`: works stand; LICENSED content carried from the shipped line ("provided against beasts"), now by the class word.
- The two as ONE keyed condition; in the ledger's stance: entered, carried, set down as standing; the office's formula (R-vi/W7), with NO citation and NO record noun ("the books show", "the roll", "the rolls", "spending", "the accounts" are all refused here: W24, §24).
- Nothing about a force or a purse: the branch reads neither.

### 2.5 The angle's stance, in one sentence

The ledger is the clerk's view; what is carried as standing; so on this key it enters two standing facts, the country's low tier and the works, in the office's formula and stops; it may spend "entered", "on the roll", "carried standing", "set down" as its SURFACE (R-vi), and it may NOT cite a roll or a book as a source (§24 reads zero here; W24 gives the branch no record noun), price anything (no gate on this card), rank the town's pressures (C7; a totality), or rate the provision (a verdict).

### 2.6 The turns worth keeping (lawful under the card, verbatim)

- *provided against beasts*; the works stated as provision against the row's own referent: lawful once "over-" and "comfortably" are cut; the compression (provision = the works; against beasts = the row) is a licensed idiom and is this variant's density floor (Part B §21.4: not to be made plainer with no law behind it).
- *{settlement} is … provided*; the settlement-token opener; lawful ONCE in the pool (order constraint 10). Variant 1 opens on "There is" and variant 3 on "A stranger", so this is the pool's one settlement opener; a rewrite may keep it here OR move the one settlement opener to another variant, never two.
- The two-sentence shape (a short first sentence, a second sentence) is lawful as a SHAPE only if the second sentence carries the OTHER read (the country) rather than a meaning; e.g. the works entered in the first, the country's tier in the second. That is the model, not a keepable wording.

### 2.7 What would make the rewrite a regression here

- Inventory: vid 2 not the second row; its angle not `[ledger]`; its slot set not exactly `{settlement}`; fewer than four wordings.
- A lost licensed read: a face that carries the works and not the low country, or the reverse; a face that scopes the low tier to the town ("{settlement} is little troubled") instead of the country (W2).
- A lost lawful turn: no face keeps *provided against beasts* or a same-claim compression of provision-against-the-row's-referent.
- A dropped angle: a face with no ledger surface at all (nothing entered, carried, set down, standing on the record); the ledger must read as the office's compiled line, not as a visitor's or a street's; a face that CITES ("the roll shows", "by the books") is the opposite fault (R-vi, §24).
- A re-import of the unlicensed claims: *over-provided*, *comfortably*, *the pressures that matter*, *internal* (a second row's fact), *spending*, *reflect*, or any second sentence that explains the first.
- A gate word on a card with no gate read: upkeep · keeping · wages · pay · purse · cost (W16 licenses these on a GATE read; this is not one).
- A force word (the branch reads none); a record noun (W24); a rating word from the badge ladder (STRONG · ADEQUATE · WEAK · CRITICAL; this pool does not read `scoreBand`).
- Under THE THREAD: the spine sits first; a two-sentence face must carry a noun from its first sentence into its second (the works → the country the works stand in; or the country → the works), never a subject change that hands nothing back.

---

## VARIANT 3 · vid 3 · `[visitor]`

### 3.2 Shipped sentence, verbatim (annex `:2623`)

> A stranger notices the perimeter at {settlement} chiefly for how relaxed the people on it are.

### 3.3 Every claim it makes

- A stranger notices (sees) the perimeter at {settlement}. **LICENSED as the angle's frame**; W27: "a stranger" is the visitor's eye; it may see and never act, decide, be told or be given a name; noticing a standing work is seeing. The frame licenses no claim of its own beyond the seeing. Layer: the stranger is a STANCE, not a referent (never a PERSON referent, A.1).
- A perimeter stands at {settlement}. **LICENSED**; read R2. The NOUN is CONDITIONAL: the referent table HOLDS "the perimeter" as a class word for the walls bucket; the entailment table D-6 finds "perimeter" geometrically false of a `Citadel` (inner) and of a lone `Gates (if walled)` row (a point), and names "the works" as the safe generic. The writer keeps "the perimeter" only as a class word a refuter reads under the referent table's HOLDS, or spends "the works"/"what the town has built" (safe under both). Layer: BODY beside a BODY read; matches.
- There are PEOPLE on the perimeter (it is manned). **UNLICENSED**; an observable the fields do not hold: manning is NOT entailed by a wall's presence (entailment law item 1; ADDENDUM 13 A item 5 struck "the men on the wall" for asserting manning); and this branch does not read `force` at all, so a town with NO garrison and NO militia selects this row and the sentence is false there. Layer: a person-plural BODY word (the force at the person grain) on a read that reaches no force row; W20; the sibling finding D-F3 ("as the watch thins" on the no-force branch) is the same fault. Also W22: "the people on it" are the load-bearing referent of the observation, an unindividuated person class doing the work of a fact.
- Those people are RELAXED. **UNLICENSED**; a FEELING/disposition (MOVE-GRAMMAR §1.3: no field carries mood; R-DA-14 seen, not meant); the entailment refuter names this clause on this row as more knowledgeable than the simulation.
- The relaxation is what the stranger notices CHIEFLY (a ranking of what is seen). **UNLICENSED**; a standpoint (the visitor may see; what it sees FIRST or CHIEFLY is the palette's frame and lawful only when the thing seen is licensed; here it is not).
- Implicit: the country is quiet (the reason the people are relaxed). **NOT STATED**; read R1 is absent from this variant altogether (the visitor row carries only the wall and an unlicensed manning); the rewrite owes it.
- Implicit: the works exceed the need. **UNLICENSED as a verdict** (as in 1.3 and 2.3).

### 3.4 The reads the rewrite must state

- R2 `perimeter === true`: the works stand, as what a stranger sees; LICENSED content carried from the shipped line ("notices the perimeter at {settlement}").
- R1 `family === 'settled'`: the country around the town is the low tier for beasts; NOT in the shipped line; owed by the skeleton rule (every read stated); in the visitor's stance it is what is seen of the country on the way in (the road quiet; little in the country); stated as a seen condition, never as a peace, a season, a length of time, or a totality over the town.
- The two as ONE keyed condition; no cause between them ("so the works are easy", "for which the works are not needed" are causes).
- Nothing about who stands on the works: the branch does not read it.

### 3.5 The angle's stance, in one sentence

The visitor states what a stranger notices first, without being told: the works standing at the town and the quiet of the country around it, both as things SEEN on arrival, from the record as compiled; the stranger may see and may not be told, act, count, judge the works' size or condition, read anyone's mood, see anyone ON the works (manning is not read), name the reason for the quiet, or rate the provision against the need.

### 3.6 The turns worth keeping (lawful under the card, verbatim)

- *A stranger notices the perimeter at {settlement}*; the visitor's frame with the wall read inside it: lawful as it stands IF "the perimeter" is read as the bucket's class word (the referent table HOLDS it); the safer form substitutes "the works". This is the variant's density floor: the seeing and the seen work in one clause.
- The construction "notices X … for Y" is keepable only with a licensed Y; the licensed Y on this key is the quiet of the country (R1), never the manning or the mood.

### 3.7 What would make the rewrite a regression here

- Inventory: vid 3 not the third row; its angle not `[visitor]`; its slot set not exactly `{settlement}`; fewer than four wordings.
- A lost licensed read: a face that keeps the works and omits the low country (the shipped omission must be cured, not carried); a face that drops the works.
- A lost lawful turn: no face keeps *A stranger notices the perimeter at {settlement}* (or its "the works" spelling) as the seeing-and-the-seen in one clause.
- A dropped angle: a face in which nothing is SEEN (the visitor stated as an inventory or as the ledger's entry); a face in which the stranger is told something, is given a name, acts, or decides (W27).
- A re-import of the unlicensed claims: *the people on it*, *relaxed*, *chiefly* attached to an unlicensed object, any manning ("nobody on them" is the same fault by negation and is ALSO unlicensed: the branch reads no force either way), any mood, any purpose.
- A force word or a person on the works, in any wording (W20, W22; the branch reads no force).
- A geometric or material claim on the works: "long stretches", "the line", "the circuit", "stone", "timber", "good work", "serious", "high", "whole", "holds" (W11; entailment law item 1; D-6; "holds" imports resistance, a THREATENED claim).
- A face opening on `{settlement}` as a proper slot in a sub-row (T-F8); a second settlement-token opener in the pool.
- Under THE THREAD: the seen works and the seen country must be one passage (the stranger sees the works; the country around them is quiet), with a noun carried from clause to clause, and the face must close on a standing fact a modifier can pick up (the works; the country), never on the stranger.

---

## 4. THE POOL WHOLE; what binds across the three variants

- FOUR faces per variant, each a different construction (ADDENDUM 7 rule 4: construction, not vocabulary alone), never a paraphrase of a sibling; the faces of one variant claim-equal to each other (A6 reads across faces); the three VARIANTS distinct by angle (counterforce · ledger · visitor) and by opener (A11: no two variants share their first two words; exactly ONE settlement-token opener in the pool, order constraint 10; at most one existential "There is" opener, R-DA-07's band).
- The licensed claim set of EVERY face, without exception: (R1) the country around the town is the LOW beast tier, stated over the country; (R2) works stand at the town, by the class word; joined as one keyed condition with no cause, no purpose, no verdict. Nothing else. The silence on the force is the licensed state and must not be broken in either direction.
- The words that are always safe here: "the works", "what the town has built", "the wall" as a class word, "the perimeter" as a class word (with D-6's caveat), "beasts", "creatures", "the country", "the country around {settlement}", "little", "quiet" (of the country), "stands", "keeps", "entered", "carried as standing".
- The words that are barred here: substantial · serious · long · good · high · whole · stone · timber · palisade · walls (plural, on a lone-gate or palisade town, over-specifies) · line · circuit · facing · manned · unmanned · people · nobody · men · soldiers · watch · garrison · muster · militia · relaxed · comfortably · over-provided · beyond · wasted · for · because · so · since · whatever · matters · internal · spending · upkeep · keeping · wages · pay · purse · peace · season · years · reason.
- The provenance move: zero (0b.2).
- The density floor per variant is named in 1.6, 2.6 and 3.6; the shipped sentences are no benchmark where they cheat (ADDENDUM 9: the memorability of "whatever the walls here are for, it is not the creatures" was bought with a cause), and the plainer floor is not a regression; the refinement judge's question is the most memorable sentence WITHOUT increasing the claim set.
- THE THREAD: this pool is a spine and sits first in its composed unit on the defense tab (spine mounts 1); the DS-DEF-2 modifiers (the stock pools and whatever else attaches by salience) follow, so every face must hand forward a noun the modifiers can pick up (the works · the country) and close on a standing fact, never on a hook, a purpose, a stranger or a question.

PROGRESS FINAL: all three variants marked; §4 written. 3 of 3 marked. Packet complete.
