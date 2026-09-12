# MARKER SKELETON — DS-DEF-2 · pool `Beasts & Monsters: plagued, NO perimeter and NO force`

Status: COMPLETE (written section by section under the checkpoint law; §5 is the closing record).

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

### 0.5 The licence, as this marker reads it (the claim set every face must carry)

- **THE ONE KEYED CONDITION (R-v), three limbs, all STANDING, all licensed by the card's single read:**
  - **C1** — the country around `{settlement}` is at the `plagued` monster tier: MONSTER ACTIVITY in the surrounding country (W14, L-1: "plagued by MONSTER activity"; the structural validator spells the same value "Embattled region"; never disease). A PRESENT move on a country token. **Layer of the read: NONE** (a terrain/country token; it names no body). Stated over the COUNTRY, never as a totality over the town (W2, C7: the Invasion row of this same block prints war pressures on the same page).
  - **C2** — no wall-class work resolves on the town's record (`perimeter` = `forces.walls.present` false through `defenseProfileHasWalls`'s live-roster equivalent, `:623-626`, `:655`). A LACK (MOVE-GRAMMAR §1.2 row 11 class (a), a `none-exists` world fact). **Layer of the read: BODY, negated** (the walls bucket, empty). Safe spellings: "no wall", "no works", "nothing built", "unwalled", "open"; "no perimeter" is true here (no member of the class at all); "the line" is the referent table's CONDITIONAL alias (row 81: a wall word only where the pool reads `forces.walls.present`, and "never where the pool reads a force" — this pool reads BOTH), so it is refuter-exposed and the ratified spellings are preferred.
  - **C3** — no garrison and no militia resolves (`force` = `garrison || militia`, `:655`; `:429-432`). A LACK. **Layer of the read: BODY, negated** (the garrison and militia buckets, empty; the muster CLASS word is the always-safe spelling: "no force", "no muster", "no town's force"). ⚠ The read consults ONLY those two buckets: the WATCH, the MERCENARY and the CHARTER buckets are not read (referent table row 56), so a face may say neither "no watch" nor "the town watches", neither "no specialists" nor "no hired men"; a town with a `Town watch` row fires this key (DS-DEF-5 may print `watch PRESENT` on the same page).
- **May claim:** C1 + C2 + C3 as one standing condition, and nothing past them. **May NOT (the card, verbatim):** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`. **Refused columns, always:** a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.
- **The two LACKs and MOVE-GRAMMAR wall 3.** ABSENCE never opens and never sits beside another ABSENCE; R-ii/W10 allows ONE negated surface per variant on a PRESENT read. On this key the two absences ARE the read (one keyed condition, R-v), so the marker's reading, recorded for the chair: the two LACKs are stated as ONE condition in one negated surface ("no wall and no muster stands", "goes without a wall or a force") or in a positive frame ("stands open and unmanned"; "{settlement} is neither walled nor mustered"), never as two ABSENCE moves side by side, and never as the opener of a face (C1, the country's tier, is the natural PRESENT opener; the LACK second). The rewrite keeps the LACK after the tier in every numbered row unless the chair rules otherwise (the DS-DEF-11 UNWALLED practice under the open ruling (i) of its JUDGMENT §6 item 8).
- **Bag and slots:** `{settlement}` only. `{band}` is RESERVED and `{route}` is unfilled at this block's call sites: a face naming either is refused (ARCH §2.5, a face whose slot set differs from its parent's). A sentence face may NOT open on `{settlement}` (T-F8); a numbered row may, and wall 10 allows at most one settlement-opener variant per pool (today none of the three opens on it).
- **The lowercase-lead defect (the block's PROVENANCE, THIS branch):** the shipped `buildThreatAssessment` string for `plagued`+nothing leaks a lowercase sentence lead. Every numbered row and every face of the rewrite opens on a capital that is not a proper slot; a face that opens lowercase or on a comma is the sentence-form refusal of ARCH §2.5.
- **Source and citation:** the card resolves the muster kind as standing LICENSED at the pool grain, but on THIS key the muster's only roster holder (a `Citizen militia`, OV-5) is excluded by the read itself (militia false), so no roll resolves on any town this key fires on: NO record word ("the roll", "the rolls", "the muster roll") on any face (W24, rule 5). §24's ceiling (one citation per unit, only for S3's three reasons) finds no reason on a flat LACK read from standing flags. **Recommended provenance budget for the pool: zero.** The `[ledger]` tag is a standpoint and licenses no record noun (W24).
- **Tier:** this key reads no tier. The head record names the tier on the same page, and the key fires on thorp through town (at city the required `Professional city watch` is a garrison keyword and `force` reads true, O-1), so "the town" as the settlement's noun is a VALUE claim on thorp, hamlet and village (the DS-DEF-11 UNWALLED-SMALL precedent, CLERK-LAWS C2); the safe generic is "the place", "`{settlement}`", or below town the engine's own "the community" (which a face cannot pick without a tier read). **"The town" is refused on this pool as an identity noun.**
- **The grammars available (MOVE-GRAMMAR §2.1, filtered by this key's fields):** V1 (PRESENT alone: the compound condition in one predicate) and V3 (PRESENT → LACK: the country's tier, then the two absences as one LACK). V2 has no consequence field (the card names none; a spine takes no relation); V4 has no named object (`{defwork}` is not in the bag and no wall resolves); V5 has no institution row (both buckets are empty); V6 has no unresolved field; V7 is R2-only; V8 has no `not-held` record field. A pool of three over a licensable set of two: two numbered rows realise V1 and V3, and the third necessarily shares a grammar with a sibling and is told apart by its angle and its construction (W4); recorded for the chair, not ruled here.
- **Close kinds available:** absence (the wall, the muster), condition (the country's tier; "open", "unmanned"), object (the place, the country). Vary across the twelve wordings (R-DA-04; Kay 30's guard).
- **Open matter:** no field on this key carries an unresolved value, so the OPEN QUESTION move is not drawable; the pool is written without it.

## 1. Variant 1 — `[ledger]` (index 0, canonical-at-zero)

### 1.1 The shipped sentence, verbatim

`An embattled country and nothing organized standing in it: {settlement} has no line, no force and no specialist recourse, and survival here rests on terrain, distance and the ability to leave.`

### 1.2 Every claim it makes, one per line (licence · law broken · REFERENT LAYER beside the read's layer)

- The country around the settlement is embattled, i.e. at the `plagued` monster tier — **LICENSED** C1 (`config.monsterThreat` measured = `plagued`; "Embattled region" is the structural validator's own spelling of this value, L-1). **Layer NONE** (a country token) = the read's layer NONE. ⚠ Engine meaning only: monster activity. The Invasion row of this block prints war pressures on the same page (C7), so a face keeping "embattled" must bind it to the creatures in the same clause or a refuter reads it as war (W14: the label at its engine meaning, never the dictionary sense).
- Nothing organized stands in the country — **UNLICENSED: a totality** over defense bodies the read does not consult (the watch, mercenary and charter buckets are outside `force = garrison || militia`, referent row 56; a `Town watch` may stand on this very town and DS-DEF-5 may print it PRESENT on the same page — CLERK-LAWS C2/C4). **Layer BODY (every force body)** against the read's **BODY (two buckets, negated)** — a wider referent than the read reaches (W20).
- `{settlement}` has no line — **LICENSED as the claim** C2 (no wall-class work resolves; a LACK). **Layer BODY, negated** = the read's layer. ⚠ The WORD "the line" is the referent table's CONDITIONAL alias for this desk (row 81 / refute row 241: a wall word only where the pool reads `forces.walls.present`, and never where the pool reads a force; this pool reads both), so the claim survives and the spelling is refuter-exposed; the ratified spellings are "no wall", "no works", "nothing built".
- `{settlement}` has no force — **LICENSED** C3 (`garrison || militia` false; "force" is the engine's own token at `:655`). **Layer BODY, negated** = the read's layer. The class word "the muster" / "the town's force" is the always-safe spelling (item 5 of ADDENDUM 13 part A).
- `{settlement}` has no specialist recourse — **UNLICENSED: a second fact and W20** — "specialist recourse" is the charter-hall BODY at the person grain asserted on the Beasts key, which does not read `charter` (the referent table's own wrong-layer finding on annex `:2606`, HOLDS; `forces.charter.present` is DS-DEF-5's read only). **Layer BODY (charter hall)** against the read's **BODY (garrison/militia)** — a body the read does not reach.
- Survival here rests on terrain — **UNLICENSED: a cause** (the card's may NOT) **and a second fact** (no terrain field is read on this key; terrain is a route DEFAULT on most towns, L-3, so even where read it is not an observation).
- Survival here rests on distance — **UNLICENSED: a second fact** (a geography or neighbour read the card does not list; MOVE-GRAMMAR row 8 needs a geography field, none read here).
- Survival here rests on the ability to leave — **UNLICENSED: a second fact and a capacity fact** the fields do not hold (MOVE-GRAMMAR row 1's may-NOT column), and **a totality over persons** (everyone able to leave; a REFUSED COLUMN).
- The settlement survives ("survival here") — **UNLICENSED: a forecast in a noun** (that harm does not end the place; the future taken as a fate, A2, THE PROMISE) **and a verdict** on the town's condition (the record rates nothing).
- (Form, not a claim, recorded for the refuter:) the colon joins a country fact to a town fact and then a third fact rides on "and" (the register card: a second fact takes its own sentence; S2 excepts only a computed consequence, and no consequence field exists on a spine); two habitual triads ("no line, no force and no specialist recourse"; "terrain, distance and the ability to leave") (R-DA-10: two items or four, never three by habit); the opener is a nominal absolute with no verb, which is the desk gesture the WOVEN TEST refuses at a seam.

### 1.3 The reads the rewrite must state (every face of this variant)

1. **C1** — the country's monster tier is `plagued`: monster activity in the country around `{settlement}`, stated over the COUNTRY as a standing condition (the PRESENT move), at its engine meaning (creatures, beasts, monsters; never disease; never war), never as a totality over the town.
2. **C2** — no wall-class work stands (the LACK), flat, present, in the clerk's third person; never as history ("never walled", "was not built"), never with a completing "but", never as a second civic object of the wall class ("no palisade either", "no ditch", "no gate").
3. **C3** — no garrison and no militia stands: "no force", "no muster", "no town's force" (the LACK); never "no watch", never "no soldiers" (a spelling the watch's men can fall under), never "no hired men", never "no specialists".
4. The shipped sentence's licensed claims are exactly C1 ("An embattled country"), C2 ("no line") and C3 ("no force"); there is no fourth licensed claim in the row. Each face carries all three; a face carrying two is a lost read (§1.7).
5. The two LACKs are stated as ONE keyed condition (§0.5): one negated surface covering both, or a positive frame, never two ABSENCE moves side by side, and never as a face's opener.

### 1.4 The angle's stance, in one sentence

`[ledger]` is "the clerk's view — what the books, rolls and counts show" (§0b) and by W24 a STANDPOINT that licenses NO record noun and no citation: a face may set the three reads down in the office's own formula (the country's tier as the record carries it; the wall and the muster "entered as absent", "carried as standing open and unmanned", "set down as neither walled nor mustered"), landing on the civic thing the fact names, and it may NOT cite a roll or a book (no muster roll resolves on this key; R-vi/W7: the roll as an agent-source is a citation the budget does not license), may not count, may not name terrain, distance, flight, survival, specialists, the watch or the charter hall, may not join the country's tier to the absences by a cause, and may not grade the arrangement.

### 1.5 The turns worth keeping (lawful clauses, verbatim — the density floor)

- `An embattled country` — lawful as a noun phrase for C1, the engine's own spelling of the value, ON CONDITION the same clause binds it to the creatures (otherwise C7 reads it as war); a face may carry it whole or use the plainer engine spelling "plagued with monsters" / "thick with creatures" (the sibling pool's licensed C1 phrasing at `:2596`).
- `no force` — lawful as it stands: the engine's own token for the negated read; a face may carry it whole.
- `has no line` — the CLAIM is lawful (C2); the WORD is conditional and refuter-exposed (§1.2); a face that keeps it keeps it at its own risk, and "has no wall" is the same claim at zero risk.
- Nothing else in the row survives: "nothing organized standing in it" (a totality), "no specialist recourse" (a wrong-layer body), the whole "survival here rests on …" clause (a cause, three second facts, a fate noun).
- The density floor for this variant is C1 + C2 + C3 in one sentence or two short ones, in the office's formula; the ceiling (§21.1) is reached by the sharpest licensed statement of the country's tier and the flattest single statement of the double absence, not by any word of the dropped clauses.

### 1.6 The claim-set the rewrite drops (each a breach, never kept as a floor)

"nothing organized standing in it" · "no specialist recourse" · "survival here rests on terrain, distance and the ability to leave".

### 1.7 What would make the rewrite a regression here

- **Inventory:** variant 1 stays numbered 1, tagged `[ledger]`, at index 0 (canonical-at-zero: the line a falsy seed draws); slot set `{settlement}` on the numbered row and on every `[face]` sub-row; four wordings per semantic variant (the numbered row plus its `[face]` sub-rows to the pinned count), no more, no fewer; no face names `{band}` or `{route}`; no sub-row opens on `{settlement}` (T-F8); every wording opens on a capital (the lowercase-lead defect of this branch must not return).
- **A lost licensed read:** a face that states the two absences and not the country's tier (the commonest cut: the LACK alone reads as an inventory line and is REFUSED by the gate against this skeleton, ADDENDUM 7 rule 3), or the tier and one absence, or the tier alone.
- **A lost lawful turn:** "no force" and the engine's spelling of C1 vanishing from the whole variant; neither must sit in every face, but the ledger's variant is where the engine's own words for the reads belong.
- **A dropped angle:** the tag changing; a face whose shape is the street's (the place talking about itself) or the visitor's (what is met on arrival), which collapses the pool's angle distinctness (§0b: two variants differing only in slot fills are one for the repetition envelope).
- **A cause re-entering by shape:** "because", "so", "which is why", "with nothing to hold it", "with the country as it is", any joint that makes the tier the reason for the absences or the absences the reason for anything.
- **A totality re-entering:** "nothing organized", "nothing standing", "no defense at all", "nothing between the place and the country", "undefended" (the watch, the mercenary and the charter buckets are unread; "undefended" also matches the readiness label `Undefended`, L-54, which this key does not read — W20, an AGGREGATE word on a body read).
- **A wrong-layer body re-entering:** "specialists", "the charter hall", "hired men", "the watch" (present or absent), "the guard", "soldiers" as the absent thing, "the men on the wall".
- **A second fact re-entering:** terrain, distance, the road, neighbours, flight, the ability to leave, the country's size, what the creatures are, how often they come, a season, a count.
- **A fate noun re-entering:** "survival", "safety", "danger", "at risk", "exposed" (as a verdict), "at the mercy of".
- **A history re-entering:** "never walled", "has never raised", "was never mustered", "has not yet" (R-DST-B; institution presence is a STANDING fact with no recorded history — the block's PROVENANCE line).
- **A second civic object of the class wall:** "no palisade either", "no ditch", "no gate", "no earthwork".
- **A citation re-entering:** "the roll shows", "the books carry", "according to the muster" (W24; §24; zero budget).
- **A war reading of C1:** "embattled" left unbound, "raiders", "the enemy", "an attack", "a siege" (C7 against the Invasion row on the same page; W17).
- **A disease reading of C1:** "plague", "sickness", "the plagued country" read as pestilence (W14, L-1).
- **Form walls:** an em dash, an exclamation, a digit or percent, a `which` tail, a question, "I" or "you", an expletive opener ("There is no wall"), a habitual triad, a summarising second sentence, a nominal absolute standing for a sentence at a seam (the WOVEN TEST).
- **The thread (§1.4.1, R-i):** a second sentence in the numbered row or in any face carries a noun forward from its first (the country, the wall, the muster, the place); the variant's last noun should be a civic thing a modifier can pick up (the muster, the wall's absence, the place), never an abstraction ("its condition", "its situation").

## 2. Variant 2 — `[street]` (index 1)

### 2.1 The shipped sentence, verbatim

`The town does not defend itself. What it does is watch, and move, and hope the pressure goes around it, and that is understood by everyone in it.`

### 2.2 Every claim it makes, one per line (licence · law broken · REFERENT LAYER beside the read's layer)

- The settlement is a town ("The town") — **UNLICENSED: a value no field on this key holds** (the key reads no tier and fires on thorp, hamlet and village, where the head record on the same page names another tier; CLERK-LAWS C2; R-DA-22 one term for one thing; the DS-DEF-11 UNWALLED-SMALL precedent). **Layer NONE (a tier value)** against a read that carries no tier.
- The town does not defend itself — **UNLICENSED: a totality** over every defense body (the watch, mercenary and charter buckets are unread and may stand; DS-DEF-5 may print a watch PRESENT beside it) **and an act (a non-act) of the town as one agent** (a totality over persons, a REFUSED COLUMN; W23: the town as a fused agent). The licensed residue under it is C2 + C3 (no wall, no muster). **Layer BODY (every force body) + AGGREGATE (the town as one will)** against the read's **BODY, two buckets negated**.
- The town watches (keeps watch) — **UNLICENSED: an act no field holds on this key**; the watch bucket is not consulted, so neither the activity nor its absence is licensed here ("keeps watch" HOLDS as an activity only on a resolved watch row, item 5; this key resolves none). **Layer BODY (the watch, by activity)** against a read that does not reach it.
- The town moves (shifts, relocates, goes out of the way) — **UNLICENSED: an act and an observable the fields do not hold**; on the record institution presence is standing and no movement field exists.
- The town hopes the pressure goes around it — **UNLICENSED: a FEELING** (hope; MOVE-GRAMMAR §1.3, no FEELING move exists) **and a belief frame** (R-DA-13's floor), with **a figure** inside it (a pressure that goes around a place: an inanimate thing with a path).
- There is a pressure on the place from the country — **LICENSED in its substance** as C1 (the country's monster activity) — **the WORD is conditional:** "pressure" is the engine's word for the STRESS record `monster_pressure` (S-10, a generation stress), not for the `config.monsterThreat` tier this key reads; a face that says "the pressure" on this key may be read as asserting a stress row the town may not carry. **Layer NONE** = the read's layer, but on the wrong record. The safe spellings are the tier's own: the creatures, the monsters, monster activity in the country.
- That is understood by everyone in it — **UNLICENSED: a totality over persons** (a REFUSED COLUMN, always) **and a belief frame** (what the townspeople understand; no field carries it).
- (Form, not a claim:) the opener "The town does not defend itself" is a negated surface that is not the read's LACK but a negation of an act (R-ii speaks to the read's negation; this one is an invented act negated); the second sentence is a habitual triad of acts ("watch, and move, and hope"); the two sentences are one fact glossed, the summarising second sentence in the machine's signature (§16 (6)).

### 2.3 The reads the rewrite must state (every face of this variant)

1. **C1** — the country's monster tier is `plagued`: creatures in the country around the place, stated over the country in the plain shape a resident states a standing condition; at the engine meaning; never "the pressure" as a bare noun for it.
2. **C2** — no wall stands (the LACK), flat, present.
3. **C3** — no garrison and no militia stands: "no muster", "no force", "no town's force"; never "no watch", never "does not defend itself".
4. The shipped sentence's ONLY licensed claim is C1 in its substance (the pressure from the country); C2 and C3 are present by implicature under "does not defend itself" and are not stated. Each face states all three outright.
5. The two LACKs as one keyed condition, never side by side as two ABSENCE moves, never the opener.

### 2.4 The angle's stance, in one sentence

`[street]` is "the town's own talk about its condition" (§0b): a face may put C1, C2 and C3 in the plain shape a resident would state them, with the place as the subject and the record's formula allowed ("no wall closes the place and no muster stands in it"), the country's creatures as the standing fact the talk is about, and it may NOT give the place a knowing, a hope, a plan, an act (watching, moving, leaving), a reassurance or a fear, may not say what everyone understands or what the place does or does not do about the country, may not say "the town" as identity on a key that reads no tier, may not name the watch, the charter hall, terrain or the road, and may not join the country's tier to the absences by a cause; the standpoint is a SHAPE of the sentence, never a claim (NL-1's law carried to the dossier: the stage licenses the claim, never the shape).

### 2.5 The turns worth keeping (lawful clauses, verbatim — the density floor)

- **None survives whole.** Every clause of the shipped row joins a licensed substance to an unlicensed claim or stands wholly unlicensed: "The town does not defend itself" (a value, a totality, an act), "watch, and move, and hope" (three acts and a feeling), "the pressure goes around it" (a figure on a conditional word), "understood by everyone in it" (a totality and a belief frame).
- The licensed residue is C1's substance (a threat from the country) and, by implicature only, the double absence. The density floor for this variant is therefore C1 + C2 + C3 stated outright in the resident's plain shape, nothing added; the ceiling is reached by the sharpest resident's statement of the country's creatures beside the flattest statement of the place standing open and unmanned.
- A turn the old row *gestures at* and a face may lawfully carry in its own words: the country's threat as the thing that comes AT the place from outside (the direction of the fact — the creatures are in the country, the place is open to them), stated as a standing condition and never as what the creatures will do or what the place hopes.

### 2.6 The claim-set the rewrite drops (each a breach, never kept as a floor)

"The town" (as identity) · "does not defend itself" · "watch, and move, and hope" · "the pressure goes around it" (the figure and the stress-record word) · "understood by everyone in it".

### 2.7 What would make the rewrite a regression here

- **Inventory:** variant 2 stays numbered 2, tagged `[street]`, at index 1; slot set `{settlement}` throughout; four wordings; no `{band}`, no `{route}`; no sub-row opens on `{settlement}`; every wording opens on a capital.
- **A lost licensed read:** a face that carries the double absence and not the country's tier (an inventory line, REFUSED), or the tier and not both absences.
- **A lost lawful turn:** there is no verbatim turn to lose; the loss to watch is the DIRECTION of the fact (creatures in the country, the place open to them) flattening into a bare list.
- **A dropped angle:** the tag changing; a face whose shape is the ledger's (the office's formula, "entered", "set down") or the visitor's ("a stranger", what is met on the road in); the three angles must stay distinct in shape.
- **A totality re-entering:** "does not defend itself", "no defense", "nothing between", "undefended", "everyone", "nobody", "all of it", "the whole place".
- **An act or a plan re-entering:** "watches", "keeps watch", "moves", "shifts", "leaves", "gets out of the way", "makes do", "manages", "lives with it", "puts up with it".
- **A feeling or a belief re-entering:** "hopes", "fears", "knows", "understands", "expects", "trusts", "does not mind", "takes it as it comes".
- **A value re-entering:** "the town", "the village", "the hamlet" as identity (no tier read); the safe noun is "the place" or `{settlement}`.
- **A wrong-record word for C1:** "the pressure" bare (the stress record's word); "raiders" (the heartland/stress vocabulary, not the tier's); the safe words are the creatures, the monsters, monster activity.
- **A wrong-layer body re-entering:** "the watch" (present, absent or at work), "the guard", "soldiers", "specialists", "hired men".
- **A cause re-entering:** "because", "so", "and so", "which is why", "with nothing to stop them".
- **A forecast or a fate re-entering:** "goes around it", "will come", "survives", "safe", "in danger", "at risk", "what comes will".
- **A history re-entering:** "has never", "was never", "no longer", "not yet".
- **A citation re-entering:** any record word (zero budget; W24).
- **A war or disease reading of C1** (C7; W14).
- **Form walls** as in §1.7; the summarising second sentence (a second sentence here may only carry one of the three reads that the first did not, never gloss the first); the habitual triad.
- **The thread (§1.4.1, R-i):** a second sentence carries a noun forward from the first (the country, the creatures, the wall, the muster, the place); the variant's last noun should be a civic thing a modifier can pick up, never "it".

## 3. Variant 3 — `[visitor]` (index 2)

### 3.1 The shipped sentence, verbatim

`A stranger arriving at {settlement} understands the danger before anybody explains it, because nothing about the place is arranged as though danger were expected to be met.`

### 3.2 Every claim it makes, one per line (licence · law broken · REFERENT LAYER beside the read's layer)

- A stranger arrives at `{settlement}` — **LICENSED as the angle's FRAME, not a claim** (W27: "a stranger" is the visitor's eye; it may see, never act, decide, be told or be given a name; the arriving is the syntax of noticing). **Layer NONE** (a stance, no referent).
- The stranger understands the danger — **UNLICENSED: a belief frame on a person** (W22: no person as a load-bearing referent; W27: the stranger may see, never understand; R-DA-13's belief-frame floor). **Layer PERSON** — never a referent.
- There is a danger to the place from the country — **LICENSED in its substance** as C1 (monster activity in the country) — **the WORD "danger" is UNLICENSED: a forecast in a noun and a verdict** (it asserts that harm is expected, the future taken as a fate, A2/THE PROMISE; the record states the tier, never what it portends; the UNWALLED-SMALL precedent refused "safety" on the same ground). **Layer NONE** = the read's layer, in a word the read does not license.
- Somebody explains it, or could ("before anybody explains it") — **UNLICENSED: persons as agents** (W22), **an observable scene the fields do not hold**, and **a totality over persons** ("anybody"; a REFUSED COLUMN).
- The understanding comes BECAUSE of the place's arrangement ("because") — **UNLICENSED: a cause** (the card's may NOT), joining a person's interior to an observable.
- Nothing about the place is arranged — **UNLICENSED: a totality** over every observable of the place (the wall, the muster, the watch, the charter hall, the gates, the houses, the road) — the licensed residue under it is C2 + C3 only (no wall, no muster). **Layer BODY (every arrangement)** against the read's **BODY, two buckets negated** (W20).
- The place is arranged as though danger were expected to be met (a counterfactual expectation attributed to the place) — **UNLICENSED: a belief frame** (expectation) attributed to the town as one mind (a totality over persons), **a figure** (a place arranged as-if), and **a forecast shape** ("were expected to be met").
- "the place" — **LICENSED** as the settlement's generic noun (no tier read; the safe term). **Layer NONE.**
- (Form, not a claim:) one sentence carrying a person's interior, a cause and a counterfactual; the "because" joint is the cause the card refuses; the sentence lands on a verb phrase ("to be met"), not on a civic noun (R-DA-04).

### 3.3 The reads the rewrite must state (every face of this variant)

1. **C1** — the country's monster tier is `plagued`: the creatures in the country around the place, stated as the thing met on the road in or seen from the place, as a standing condition of the COUNTRY at its engine meaning; never "the danger", never "the threat" as a verdict noun, never a totality over the town.
2. **C2** — no wall stands: the absent wall as a thing seen (nothing built around the place; the place open), flat, present.
3. **C3** — no garrison and no militia stands: the absent muster as a thing seen (no force on the place; nobody mustered — ⚠ "nobody" only as the muster's absence, never as "nobody at all", which is a totality reaching the watch); never "no watch", never "no soldiers", never "no specialists".
4. The shipped sentence states NONE of the three reads outright: C1 is present only inside the verdict word "danger", and C2 and C3 only by implicature under "nothing about the place is arranged". Each face states all three outright; the density floor here is the whole keyed condition stated afresh.
5. The two LACKs as one keyed condition, never side by side, never the opener (a visitor's face may open on the stranger, on the country, or on the place).

### 3.4 The angle's stance, in one sentence

`[visitor]` is "what a stranger notices first, without being told" (§0b): a face may state C1, C2 and C3 as the three things met on arrival — the creatures in the country the road comes through, the absent wall, the absent muster — in the shape of a thing seen rather than a thing recorded (no roll, no count, no citation), and it may NOT let the stranger understand, judge, fear, be told, ask or explain, may not invent what else is seen (a road, a gate, houses, fields, an edge, a ditch, a watch on a corner), may not say why the place is open, may not grade the arrangement ("as though", "expected", "nothing arranged"), may not name danger, safety or survival, and may not hedge the reads as a stranger's impression ("seems", "looks", "appears") — the visitor's standpoint is a syntax of noticing, never a claim about the noticer or about the noticed beyond the three reads (W27; R-DA-13).

### 3.5 The turns worth keeping (lawful clauses, verbatim — the density floor)

- `A stranger arriving at {settlement}` — lawful as the angle's FRAME (the numbered row may open on it; the shipped visitor rows across this block use it; the DS-DEF-11 packets keep "A stranger" as the visitor's eye). It is a frame, not a claim, and carries no read; a face keeping it must land the three reads after it in the shape of things seen.
- `the place` — lawful as the settlement's generic noun; a face may carry it.
- Nothing else in the row survives: "understands the danger" (a person's interior on a fate noun), "before anybody explains it" (persons, a scene, a totality), "because" (a cause), "nothing about the place is arranged as though danger were expected to be met" (a totality, a belief frame, a figure, a forecast shape).
- The density floor is the three reads stated as things seen; the ceiling is reached by the sharpest ORDER of noticing (the country's creatures met on the way in, then the open place, then the absent muster — or the reverse, the open place first and the country last as the passage's turn outward) with no interior and no verdict.

### 3.6 The claim-set the rewrite drops (each a breach, never kept as a floor)

"understands the danger" · "before anybody explains it" · "because" · "nothing about the place is arranged" · "as though danger were expected to be met".

### 3.7 What would make the rewrite a regression here

- **Inventory:** variant 3 stays numbered 3, tagged `[visitor]`, at index 2; slot set `{settlement}` throughout; four wordings; no `{band}`, no `{route}`; no sub-row opens on `{settlement}` (a sub-row may open on "A stranger", on the country or on the place); every wording opens on a capital.
- **A lost licensed read:** a face that has the stranger see the open place and the absent muster and says nothing of the country's creatures (the commonest visitor cut), or sees the country and not both absences.
- **A lost lawful turn:** the visitor's frame vanishing from every wording of the variant (it need not sit in each face, but a variant with no thing-seen shape is the ledger by another name).
- **A dropped angle:** the tag changing; a face in the office's formula ("entered", "carried standing") or in the resident's talk; the stranger's eye becoming a stranger's MIND ("understands", "reads", "sizes up", "can tell", "revises") — the DS-DEF-11 refuters failed exactly this class.
- **A person re-entering:** "anybody", "somebody", "nobody" (beyond the muster's absence), "the people", "a local", "whoever", the stranger told or answered (W22, W27).
- **A fate or verdict noun re-entering:** "danger", "the danger", "safety", "survival", "risk", "exposed", "at the mercy of", "helpless".
- **A cause re-entering:** "because", "so", "which is why", "with nothing to meet it", "and so the creatures".
- **A totality re-entering:** "nothing about the place", "nothing arranged", "no defense", "nothing between", "undefended", "open on every side", "everyone", "nobody at all".
- **A belief frame or a figure re-entering:** "as though", "as if", "expected", "seems", "looks", "appears", "the place does not expect", "the place is not braced for".
- **A scene the fields do not hold re-entering:** a road in, a gate, houses, fields, an edge, a ditch, a watch on a corner, what the creatures look like, tracks, a season, the hour.
- **A wrong-layer body re-entering:** "the watch" (present or absent), "the guard", "soldiers", "specialists", "hired men", "the men on the wall".
- **A history re-entering:** "has never", "was never", "no longer".
- **A citation re-entering:** any record word (zero budget; W24; the visitor cites nothing).
- **A war or disease reading of C1** (C7; W14): "embattled" unbound, "raiders", "the enemy", "plague", "sickness".
- **Form walls** as in §1.7; a sentence landing on a verb phrase rather than a civic noun; a hedge; a triad.
- **The thread (§1.4.1, R-i):** a second sentence carries a noun forward (the stranger's first-seen thing, the country, the wall, the muster, the place); the variant's last noun should be a civic thing a modifier can pick up (the muster, the place, the country) — the shift of subject from the place to the country, if a face makes it, is the passage's one turn outward and sits last.

## 4. Pool-level notes for the writer, the gate and the refuter

- **Variant count 3, wordings 12** (three numbered rows, each with `[face]` sub-rows to the pinned count: four wordings per semantic variant, never a paraphrase of a sibling, each standing alone under the unweighted seeded roll). The order of vids never moves; index 0 is `[ledger]`, index 1 `[street]`, index 2 `[visitor]`. The annex is append-only (§22): the old wording leaves the product when it fails the voice, its slot survives, its text stays in the annex history.
- **Claim set of the pool, whole:** {C1: `config.monsterThreat` measured = `plagued`, PRESENT over the country, layer NONE; C2: walls bucket empty, LACK, layer BODY negated; C3: garrison and militia buckets empty, LACK, layer BODY negated} — ONE keyed condition (R-v). Every one of the twelve wordings asserts exactly these three and no fourth; the four faces of a variant differ in CONSTRUCTION, vocabulary and rhythm inside the voice, never in a claim (A6, arm C, ADDENDUM 7 rule 4). W9: the density floor counts the card's reads (three), never the entailment table's attributes.
- **The three reads' safe spellings, gathered:** C1 — "the country around {settlement} is plagued with monsters / creatures", "monster activity in the country", "an embattled country" bound to the creatures in the same clause, "the creatures in the country"; never "the pressure", "raiders", "the danger", "the threat" as a verdict, "the enemy", "plague". C2 — "no wall", "no works", "nothing built", "unwalled", "open"; "no line" at the writer's risk; never a member ("no palisade", "no ditch", "no gate"). C3 — "no force", "no muster", "no town's force", "nobody mustered"; never "no watch", "no guard", "no soldiers", "no specialists", "no hired men", "undefended", "nothing organized".
- **The settlement's noun:** `{settlement}` or "the place"; never "the town" as identity (no tier read; the key fires thorp through town); "the community" is the engine's small-tier generic but needs a tier read the key lacks, so it is refused too.
- **The level-1 grammars for this key:** V1 and V3 only (§0.5). Three variants over two members: the numbered rows realise V1, V3 and one of the two again in a different construction; the pool's distinctness is then carried by angle and construction (W4, the construction contract: the draft's declared grammar per variant is the refiner's to keep). Recorded for the chair as a note, not a ruling.
- **Sibling distance (A11):** no two of the twelve wordings share their first two words; today none of the three numbered rows opens on `{settlement}` (wall 10 allows at most one); the WORD "wall", "muster", "country" may recur (the office's word may recur, the FACT must not), but the twelve should not all close on the same civic noun; the close KIND varies across absence, condition and object (R-DA-04).
- **The two-LACK shape hazard, stated once for the refuter:** the key's two absences are ONE condition and may share one negated surface; two ABSENCE moves side by side ("No wall. No force.") is wall 3; an ABSENCE opener is wall 3; the country's tier (C1) is the natural PRESENT opener and the double absence follows it (V3), or the whole condition sits in one predicate (V1).
- **The thread (§1.4.1):** this pool is the SPINE of the Beasts rung on the defense tab (spine mounts 1; modifier mounts 0 today — the candidates leaf for DS-DEF-2 is empty until car 9 authors it, so the spine composes alone at present). Faces are still written to hand a noun forward (the country, the wall's absence, the muster, the place) for a future modifier to pick up, and never to end on an abstraction or a pronoun. Where a face has two sentences, the second carries a noun forward from the first (R-i, at k = 0).
- **Provenance budget for the pool:** zero citations (§0.5): no roll resolves on this key; the ledger is a standpoint and cites nothing (W24, W8); a face citing the muster for a LACK is a §24 finding.
- **The same-page contradictions the refuter walks (C7, CLERK-LAWS C2):** the Invasion row of this block prints beside this one (a war reading of "embattled" or "the enemy" collides with it); DS-DEF-5 may print `watch PRESENT` or `charter hall PRESENT` on the same tab (a totality over defense bodies collides with it); the head record names the tier ("the town" collides with it on thorp, hamlet, village); DS-DEF-1's readiness badge is an AGGREGATE on the same page ("undefended" as a face word collides with `Undefended` as a label the key does not read, W20).
- **Label traps this pool walks (W14):** `plagued` = monster activity (never disease; on the monster arm the tier LOWERS the monster score, L-1, so no face may say the score or the badge); the readiness label moves with tier and country while no works move (L-54) — never named here.
- **What the old rows leave standing open:** nothing lawful. The register card asks every town to leave one civic matter standing open, stated never asked; on this key no field carries an unresolved state, so the OPEN QUESTION move is not drawable and the pool is written without it.
- **The four known breaches of this BLOCK (rulings-DEF2.txt) do not sit in this pool** (they are in `settled, defenses beyond the need`, `walls with NO force`, `granary AND parish care only`); this pool's own breaches are the ones listed in §1.6, §2.6 and §3.6, and the referent table's :2606 finding ("specialist recourse") is the one the tables name by line.

## 5. Status

COMPLETE — sections 0 (the card, the header lines, the rows, the read's code, the licence as read), 1, 2, 3 (one per shipped variant: the sentence verbatim; every claim tagged LICENSED/UNLICENSED with its law and its REFERENT LAYER beside the read's; the reads the rewrite must state; the angle's stance; the turns worth keeping; the claim-set dropped; the regression list) and 4 (pool-level notes). Variant count 3. Nothing outside this file was written; no dock was entered; the only execution was the read-only licence-card script.
