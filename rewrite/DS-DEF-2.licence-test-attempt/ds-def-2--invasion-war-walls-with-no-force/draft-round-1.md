# DRAFT ROUND 1 — DS-DEF-2 · pool `Invasion & War: walls with NO force`

Writer: Opus 5 (Fable-unvalidated seat), for the Fable chair. REWRITE car 8b, block DS-DEF-2, draft round 1.
Written to `skeleton.md` (the Fable marker's packet) and to the licence card printed in `laneRW-DEF2` at f2da5a3ee.
Three shipped variants in, three out, in order, under their own vids and their own angle tags; none added, none removed, none merged.
The typed lines of the pool (ROLE · READS · RELATION · ATTACH · FORM · MOVE) are untouched and are not repeated here.

STATUS: COMPLETE (three variants, twelve faces, zero refusals).

---

## THE REWRITTEN ROWS (paste under the pool's heading, replacing the three variant rows)

1. `[ledger]` The works at {settlement} are entered as standing, and to hold them the town has neither garrison nor militia.
   - `[face]` No force stands at {settlement}, and what stands is the works.
   - `[face]` Set down at {settlement}: the works standing, and no force in the town.
   - `[face]` What the town has built at {settlement} stands entered. To hold the works the town has no force.
2. `[visitor]` A stranger at {settlement} sees the works standing and no force at them.
   - `[face]` What a stranger finds at {settlement} is the works, and neither garrison nor militia.
   - `[face]` A stranger finds no force at {settlement}, and finds the works.
   - `[face]` A stranger comes to {settlement} and sees the works. Neither garrison nor militia stands in the town.
3. `[street]` The town of {settlement} has the works and not the force to hold them.
   - `[face]` What the town has built at {settlement} stands, and no force is kept in the town.
   - `[face]` The town of {settlement} keeps no force and keeps the works.
   - `[face]` The works stand at {settlement}. The town keeps no garrison and no militia.


--- NOTES

### N.0 The card's clauses, named once (every licence below cites one of these)

| tag | the card's own line |
|---|---|
| **C-READ(a)** | `predicate: invasionRowSituation(walls, garrison, militia) === walls, no force` — the `walls` argument TRUE (a `walls`-bucket member stands on the live roster) |
| **C-READ(b)** | the same predicate — the `garrison` argument FALSE (no `Garrison`, `Multiple garrisons`, `Barracks` or `Professional city watch`) |
| **C-READ(c)** | the same predicate — the `militia` argument FALSE (no `Citizen militia`) |
| **C-STAND** | `may claim: that the reader ... selects the row walls, no force ... as a STANDING fact of the record` — licenses the present tense and the standing aspect ("stands", "entered as standing", "kept") |
| **C-BAG** | `bag: {band: RESERVED, route: proper, settlement: proper}` · `FILLED at this block's call sites: {settlement}` — licenses the one slot and no other |
| **C-ANGLE** | `angle: ledger street visitor` — licenses each variant's stance and no fourth |
| **C-SOURCE** | `source: muster · standing LICENSED` — SPENT BY NOBODY here (skeleton §0.4 / §4.4: no muster record resolves on a key whose militia is absent by construction; zero citations on this pool) |

(b) and (c) together are the key's own word **"no force"**; the three legs are ONE keyed condition (R-v), so stating all three is not "a second fact" (skeleton §1.4, §4.1).

### N.1 Variant 1 `[ledger]` — the licences, face by face

Construction contract (W4): THE OFFICE'S ENTRY — the fact set down in the office's own formula, no eye, no contrast close, no citation.

| face | claim | licence |
|---|---|---|
| 1 (the numbered line) | the works stand at {settlement} | C-READ(a) + C-STAND ("are entered as standing" is the office's formula, R-vi/W7; not a record noun, W24) |
| | {settlement} | C-BAG |
| | no garrison | C-READ(b) |
| | no militia | C-READ(c) |
| | the ledger's stance | C-ANGLE |
| 2 | no force (garrison and militia together) | C-READ(b) + C-READ(c), in the key's own word |
| | the works stand | C-READ(a) + C-STAND ("what stands is the works") |
| | {settlement} | C-BAG |
| 3 | the works stand | C-READ(a) + C-STAND ("the works standing") |
| | no force | C-READ(b) + C-READ(c) |
| | {settlement} | C-BAG; "Set down at {settlement}:" is the office's entry formula (W7), not a citation |
| 4 | the works stand | C-READ(a) + C-STAND ("what the town has built ... stands entered"; "what the town has built" is the alias table's always-safe spelling of any wall-class member, A-7) |
| | no force | C-READ(b) + C-READ(c) |
| | {settlement} | C-BAG |

Dropped from the shipped v1, each with the law that drops it: "nobody to put on them" (REFUSED COLUMN, a totality over persons; W22; manning NOT ENTAILED, ENTAILMENT item 1; CONTRADICTED by the required `Town watch` on every native town of this key) · "A determined attacker" (an EXTERNAL BODY no field holds; W25) · "takes this town" (a forecast, STATE never FATE; a deictic standpoint, the card's `may NOT`) · "with ladders and patience" (a tactical particular; a duration; hollow specificity, fault 24; the ENTAILMENT refuter's own finding on this row) · "and requires nothing else" (a totality, a verdict close, the doubled beat W6, a third clause). The weight is replaced with licensed specificity, never with nothing: the two force classes NAMED where the shipped folded them into one person word (the rewrite is richer in truth by two reads), and the office's own formula in place of the verdict.

Density floor: the pool's one memorable compression, "has walls and nobody to put on them", survives in its licensed form — face 1 carries the stricter "to hold them the town has neither garrison nor militia", faces 2 to 4 carry "no force" at the same weight; the exact unlicensed part, and only that, is gone (skeleton §1.6).

### N.2 Variant 2 `[visitor]` — the licences, face by face

Construction contract (W4): ONE PERCEPTION — a stranger's eye placed at {settlement}, which may see and find and may not walk, act, judge, measure, be told or be named (W27).

| face | claim | licence |
|---|---|---|
| 1 (the numbered line) | a stranger is the eye at {settlement} | C-ANGLE (the `[visitor]` stance; W27: the stranger may see) + C-BAG for the placement |
| | the works stand, seen | C-READ(a) + C-STAND |
| | no force at them | C-READ(b) + C-READ(c) |
| 2 | a stranger is the eye | C-ANGLE + W27 |
| | the works stand, found | C-READ(a) + C-STAND |
| | no garrison, no militia | C-READ(b), C-READ(c) — named apart, as the licensed specificity |
| | {settlement} | C-BAG |
| 3 | a stranger is the eye | C-ANGLE + W27 |
| | no force | C-READ(b) + C-READ(c) |
| | the works stand | C-READ(a) + C-STAND |
| | {settlement} | C-BAG |
| 4 | a stranger arrives and sees | C-ANGLE + W27 (arrival is the visitor's placement; walking a circuit is not) |
| | the works stand | C-READ(a) + C-STAND |
| | no garrison, no militia | C-READ(b), C-READ(c) |
| | {settlement} | C-BAG ("the town" in the second sentence is the thread's pick-up of {settlement}, R-i) |

Dropped from the shipped v2: "serious" twice (an evaluative on a condition and extent the record does not rate; VERDICT does not exist; NOT ENTAILED: condition, height, extent, D-3) · "anyone standing in it" (a totality over persons; W22; manning; and "in it" makes the works a line one stands in, which D-6 refuses) · "perimeter" (W15 / A-7: FALSE of a `Gates (if walled)`-only town and of a `Citadel`; the class has no always-safe geometric generic, so "the works" is the spelling). The lawful turn "A stranger at {settlement} sees" is kept verbatim as the opener of face 1 (skeleton §2.6), and the visitor's lawful SHAPE "sees X and Y" is kept in three of the four faces.

Density floor: the licensed form of the shipped compression, "sees the works and no force at them", stands verbatim as face 1 (skeleton §2.6 names it as the same weight); the two verdicts and the totality are the exact unlicensed set and are the only things removed.

### N.3 Variant 3 `[street]` — the licences, face by face

Construction contract (W4): THE TOWN'S PLAIN ACCOUNT — what the town has and has not, in the commonest civic words, with the sibling-licensed contrast; no office formula, no stranger, no voice, no belief, no interlocutor.

| face | claim | licence |
|---|---|---|
| 1 (the numbered line) | the town has the works | C-READ(a) + C-STAND (the shipped opener's own lawful fact, kept) |
| | and not the force to hold them | C-READ(b) + C-READ(c); the CONTRAST is licensed by the sibling keys `walls with citizen militia` and `walls AND professional garrison` (wall 5 / R-DA-02), is not fronted, and is the closing move of this ONE variant of the pool |
| | {settlement} | C-BAG (the naming form "the town of {settlement}", W5) |
| 2 | the works stand | C-READ(a) + C-STAND |
| | no force kept | C-READ(b) + C-READ(c) |
| | {settlement} | C-BAG |
| 3 | no force | C-READ(b) + C-READ(c) |
| | the works stand (kept by the town) | C-READ(a) + C-STAND |
| | {settlement} | C-BAG |
| 4 | the works stand | C-READ(a) + C-STAND |
| | no garrison, no militia | C-READ(b), C-READ(c) |
| | {settlement} | C-BAG ("the town" opens the second sentence as the thread's pick-up of {settlement}, R-i) |

Dropped from the shipped v3: "that would save it" (a capability of the works the presence flag does not hold, D-3 "whether they have held"; a subjunctive edge with no typed threshold; the maxim shape, R-DA-12) · "the people who would use it" (a totality over persons; W22; manning; CONTRADICTED by the required `Town watch`) · "and says so when pressed" (the town as a speaking agent with an admission — a belief frame and a fused collective agent, W23, the referent findings D-F16/D-F18; an implied presser, W22; a third clause, R-DA-03). The CONTRAST SHAPE itself is kept, because the rejected alternative names a sibling key; only its filling was refused.

Density floor: "has the thing that would save it and not the people who would use it" reaches its licensed form at the same compression as face 1, "has the works and not the force to hold them" (skeleton §3.6); the street's plain register is kept ("has", "keeps", "the works", "what the town has built") and no face is plainer than the shipped where a licensed form of the compression exists.

### N.4 The bars, checked across all twelve faces

- **W11 material bar** — no material and no material source anywhere; `{defmaterial}` is unminted, so no face names timber or stone. The shipped rows named none, so nothing is dropped under this bar.
- **W12 garrison bar / W13 watch bar / W15 alias bar** — "garrison" and "militia" appear only as the ABSENT class words the predicate's own arguments name (C-READ(b), C-READ(c)); no garrison is asserted present; the WATCH is never named, in either polarity, because this key excludes the watch bucket and the required `Town watch` stands on every native town of the key (skeleton §0.4, the town-tier trap). The wall-class noun is "the works" / "what the town has built" (A-7's always-safe spelling) in every face; "the line", "walls", "the perimeter", a gate, a tower, a walkway and a citadel appear nowhere.
- **W14 label bar** — no engine label is rendered at its dictionary sense; `{band}` is RESERVED and unnamed, `{route}` unfilled and unnamed, no readiness word, no country word, no pay word, no gate read.
- **W16 the gate's word** — not engaged: this key reads no `economicGates`; no face says upkeep, keeping, wages, pay, a sum, a rate or a share.
- **W17 crisis bar / W18 stress-record bar / W19 faith bar** — not engaged: no siege, occupation, besieger, war, famine, illness, insurgency, stressor, creed or deity is named.
- **W20 layer bar** — every noun sits at its read's layer: "the works" / "what the town has built" is BODY on a BODY read (the `walls` bucket, C-READ(a)); "no force" / "no garrison" / "no militia" is NONE on an absence of two bodies (C-READ(b), C-READ(c)); "the town" is NONE (a possessor, never a body); "a stranger" is the visitor's stance noun and is never a referent that acts.
- **W21 baked-power bar / W22 person bar / W23 fused-agent bar** — no seat, hall, council or chamber; no person as agent, decider, holder or counterfactual ("nobody", "anyone", "the people", "somebody", "whoever" are all gone); no relation between two referents that no field computes; no town that decides, says, knows, believes or pretends.
- **W24 record-word bar** — zero record nouns and zero citations on this pool (the skeleton's §4.4 ruling, taken): no roll, no books, no record, no accounts. The `[ledger]` tag is treated as a STANDPOINT throughout; "entered as standing", "set down", "stands entered" are the office's own formula (W7), not an agent-source.
- **W25 external-body bar** — no foreign force at all; the shipped attacker is gone.
- **W26 visibility bar** — `covert: no` on the card; `audience: player (no mark)`; no face carries a dm-only mark or names anything the player's page would not hold.
- **W27 angle-tag bar** — three stances, three constructions: the office's entry · the stranger's one perception · the town's plain account. No elders' body, no stranger who acts or is named, no stance noun used as a holder's record.
- **W1 possessor binding** — no possessive pronoun is used in any face; the possessor is the town, named ("the town of {settlement}", "what the town has built", "the town keeps").
- **W2 country-scoped threat** — not engaged: this key reads no `config.monsterThreat`, and no face says what the country is (the Beasts row on the same page carries that read; C7 refuses importing it here).
- **W3 band marker** — not engaged: `{band}` is RESERVED and is named nowhere.
- **W5 naming-form article** — "the town of {settlement}" is the naming form where the town is the possessor; no maxim frame anywhere.
- **W6 no doubled beat / W10 one negated opener** — no clause restates the read it follows; exactly one face per variant opens on a negated surface (v1 face 2 "No force stands ..."; v2 none at the face's head, one at a second sentence's head in face 4; v3 none at the face's head).
- **THE THREAD (R-i, §1.4.1)** — the three two-sentence faces each carry a noun forward: v1 face 4 "the works" ← "what the town has built"; v2 face 4 "the town" ← {settlement}; v3 face 4 "the town" ← {settlement}. No face changes subject in the middle and hands nothing back.
- **The composition fence** — every face reads as a passage OPENING (this is a spine, mounted first) and lands on a noun a modifier can pick up: the works · the force · the garrison · the militia · the town. No face opens on `{settlement}` (T-F8), and the settlement token opens no variant of the pool (wall 10, spent zero times).
- **The walls** — no em dash, no exclamation, no question, no digit, no percent, no `which`, no expletive opener ("There is no force" was refused for "No force stands"), no figure, no simile, no sense verb on an abstraction, no second person, no tricolon (no face carries three of anything), no evaluative adjective, no count, no cause, no season, no future, no standpoint.

### N.5 The measurements (reported, not gating)

| vid | angle | face | words | sentences | opener (first two words) | landing noun |
|---|---|---|---|---|---|---|
| 1 | ledger | 1 | 19 | 1 | The works | militia |
| 1 | ledger | 2 | 11 | 1 | No force | the works |
| 1 | ledger | 3 | 13 | 1 | Set down | the town |
| 1 | ledger | 4 | 18 | 2 | What the | force |
| 2 | visitor | 1 | 13 | 1 | A stranger | them (the works) |
| 2 | visitor | 2 | 14 | 1 | What a | militia |
| 2 | visitor | 3 | 11 | 1 | A stranger | the works |
| 2 | visitor | 4 | 17 | 2 | A stranger | the town |
| 3 | street | 1 | 14 | 1 | The town | them (the force) |
| 3 | street | 2 | 16 | 1 | What the | the town |
| 3 | street | 3 | 11 | 1 | The town | the works |
| 3 | street | 4 | 13 | 2 | The works | militia |

- Twelve faces; mean 14.2 words; range 11 to 19; sd ≈ 2.6; three of twelve are two-sentence faces.
- The three VARIANTS' first two words are distinct (`The works` · `A stranger` · `The town`), so A11 holds at the grain it is measured on; only one face of one variant ever renders, so face-level opener repetition inside a variant costs nothing at the draw.
- Pronoun closers: 2 of 12 (v2 face 1 "at them"; v3 face 1 "to hold them"). Both are the density floor's own licensed forms of the shipped compressions ("sees the works and no force at them"; "has the works and not the force to hold them"), which the skeleton names at §2.6 and §3.6 as the same weight as the shipped. R-DA-04's 0.055 is a REGISTER rate over 2,914 sentences, not a per-pool wall; the local rate is reported here rather than cured by making the two floor-lines plainer (§21.4).
- Within-pool word-count sd is 2.6 against R-DA-05's ≥ 4.0 direction. The floor on face length is structural: every face must carry `{settlement}` (a face's slot set must equal the parent's), and the shortest lawful wording that states all three legs plus the slot runs to eleven words. Reported, not padded — adding words without a claim is the tic the band exists to catch.
- Grammars: two distinct level-1 shapes across the three variants (a PRESENT stated as one keyed condition in the visitor's single perception; PRESENT-then-the-absence in the ledger's entry and the street's contrast), so the census's `grammars: 2` does not fall.
- Citations: 0 of 12, against Part B §24's exemplar rate of 0 per 786 sentences.
- Reads stated per face: 3 of 3 (the works · no garrison · no militia) in every one of the twelve, against the shipped rows' 1 stated and 2 folded into a person word.

### N.6 Refusals

**None.** All three variants are written lawfully; no variant of this pool needed a refusal row.

### N.7 Carried for the chair (vetoable, three items)

1. **"no garrison" and "no militia" as the class words of an ABSENCE.** W12 bars "the garrison" as a BODY word where no garrison row resolves. Here the row's non-resolution IS the read (C-READ(b)), and the skeleton licenses exactly these spellings at §4.1 ("no garrison and no militia", "neither garrison nor militia"). The draft takes the skeleton's licensing: the bar is read as barring an asserted PRESENCE, never the predicate's own negative argument. If the chair reads W12 the other way, every face collapses to the key's own word "no force", which four of the twelve faces already carry unaided.
2. **Zero citations.** The card prints `source: muster · standing LICENSED`, but no muster record exists on a key whose militia is absent by construction (holder null, `holderReason: town-resolved`). The skeleton's §4.4 ruling — cite nothing — is taken. The `[ledger]` tag is written as a standpoint with the office's formula and no record noun.
3. **Two pronoun closers.** Both sit on the two faces that carry the density floor's named licensed compressions verbatim. Curing them would make those two lines plainer with no law behind the change, which §21.4 calls the regression. Reported at N.5 rather than cured.

Seat: Opus 5 (Fable-unvalidated) — writer packet; three variants, twelve faces, zero refusals; the packet is whole.
