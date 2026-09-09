Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2 · pool `Beasts & Monsters`: `plagued`, perimeter but NO force to hold it · REWRITE draft, round 1, for the Fable chair.

Card printed before a word was written: `node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, perimeter but NO force to hold it'` in `laneRW-DEF2`. The block's annex section read whole at `laneRW-DEF2/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2568-2726` for arms A1 and A11. The reading itself read at `src/domain/display/stateProse/defenseStateProse.js:400-451` (`BEASTS_ROW_POOL`, `beastsRowSituation`, `beastsRowPoolKey`) with its call site `:655`.

Three variants in, three variants out: the same vids, the same order, each numbered row opening on the variant's OWN single bracketed angle tag. None added, removed, merged or reordered; no row carries a second bracketed tag and none carries `[plain]`. The pool's typed lines and its bold heading are untouched and are not repeated here. Four wordings per semantic variant (the numbered row plus three `[face]` sub-rows), twelve in all.

## THE ROWS (paste under the pool's bold heading)

1. `[ledger]` A wall runs about {settlement}, and beyond it the country is plagued with beasts. On that wall the town keeps neither garrison nor militia.
   - `[face]` The circuit of {settlement} stands, and outside it lies monster country. Nothing under arms is kept on the circuit.
   - `[face]` Beasts have the country outside {settlement}, and against them stand the town's works. The town has no force on those works.
   - `[face]` Plagued country lies about {settlement}, and the town's line stands between. That line is unheld.
2. `[visitor]` Beast country reaches the perimeter of {settlement}, and the perimeter is unmanned.
   - `[face]` Monster country lies against the line about {settlement}, and the line stands empty.
   - `[face]` Creatures hold the country to the very works of {settlement}, and nothing armed holds the works.
   - `[face]` A country of beasts runs up to the circuit of {settlement}, and the town keeps no force upon that circuit.
3. `[unfolding]` In plagued country the wall of {settlement} remains up, and remains without garrison or militia.
   - `[face]` Creatures keep the country about {settlement}, and against them the town's circuit goes unheld.
   - `[face]` Beasts go on in the country about {settlement}, and the town's works go on without a force.
   - `[face]` The country about {settlement} stays plagued, and the line the town keeps stays unmanned.

--- NOTES

## 1. THE CLAIM, AND THE CARD CLAUSE UNDER EVERY LIMB OF EVERY FACE

The card prints ONE read and ONE licensed value:

> `reads: beastsRowSituation(family, perimeter, force)` (via `BEASTS_ROW_POOL` in `defenseStateProse.js`)
> `predicate: … === plagued country, perimeter without force`
> `may claim:` that the reader selects the row `plagued country, perimeter without force`, **as a STANDING fact of the record**

Grounded in the code the card names, that one value is three limbs of one typed state, and nothing else is licensed:

- **L1 — the family is `plagued`.** `beastsRowSituation` (`:429-439`) enters its first branch only on `family === 'plagued'`, and `family` is `measuredMonsterFamily(config.monsterThreat)`. Realised as: *the country is plagued with beasts* · *monster country* · *Beasts have the country* · *Plagued country* · *Beast country* · *Creatures hold the country* · *a country of beasts* · *Creatures keep the country* · *Beasts go on in the country* · *stays plagued*.
- **L2 — `perimeter` is true.** At the call site (`:655`) `perimeter` is `walls`, the `defenseProfileHasWalls` predicate (`src/domain/causalState.js:300-315`), never a presence check on `institutions.walls`. Realised as ONE civic object per face, named: *wall* · *circuit* · *works* · *line* · *perimeter*.
- **L3 — `force` is false.** At the same call site `force` is `garrison || militia`, so the licensed absence is of BOTH and of nothing else. Realised as: *keeps neither garrison nor militia* · *Nothing under arms is kept* · *has no force* · *is unheld* · *is unmanned* · *stands empty* · *nothing armed holds* · *keeps no force* · *remains without garrison or militia* · *goes unheld* · *go on without a force* · *stays unmanned*.

**Slot.** `bag: {band: RESERVED, route: proper, settlement: proper}`, `FILLED at this block's call sites: {settlement}`. Every face carries `{settlement}` exactly once and no other slot; `{band}` and `{route}` are unfilled at this block's call sites, so a face naming one would carry a slot the parent does not (ARCH §2.5, the face row's refusal: *a face whose `{slot}` set differs from the parent's*). No face opens on the slot (T-F8).

**Claim equality (arm A6, read across the faces).** All twelve faces assert L1, L2 and L3 and nothing else, so the four faces of each variant are claim-equal to each other and the three variants are claim-equal to one another — which is what MOVE-GRAMMAR §3.4 requires of a pool's grammars (*the typed claim set is identical across a pool's grammars — arm C*).

| variant · face | L1 (plagued country) | L2 (a perimeter) | L3 (no garrison, no militia) |
|---|---|---|---|
| 1 row `[ledger]` | *the country is plagued with beasts* | *A wall runs about {settlement}* | *the town keeps neither garrison nor militia* |
| 1 f1 | *outside it lies monster country* | *The circuit of {settlement} stands* | *Nothing under arms is kept on the circuit* |
| 1 f2 | *Beasts have the country outside {settlement}* | *the town's works* | *The town has no force on those works* |
| 1 f3 | *Plagued country lies about {settlement}* | *the town's line stands between* | *That line is unheld* |
| 2 row `[visitor]` | *Beast country reaches* | *the perimeter of {settlement}* | *the perimeter is unmanned* |
| 2 f1 | *Monster country lies against* | *the line about {settlement}* | *the line stands empty* |
| 2 f2 | *Creatures hold the country to* | *the very works of {settlement}* | *nothing armed holds the works* |
| 2 f3 | *A country of beasts runs up to* | *the circuit of {settlement}* | *the town keeps no force upon that circuit* |
| 3 row `[unfolding]` | *In plagued country* | *the wall of {settlement} remains up* | *remains without garrison or militia* |
| 3 f1 | *Creatures keep the country about {settlement}* | *the town's circuit* | *goes unheld* |
| 3 f2 | *Beasts go on in the country about {settlement}* | *the town's works* | *go on without a force* |
| 3 f3 | *The country about {settlement} stays plagued* | *the line the town keeps* | *stays unmanned* |

**No citation appears in any face, and that is a decision.** The card's `source:` line reads `muster · standing LICENSED` and permits a citation *where the provenance budget allows*. Part B §24 sets that budget at a CEILING of one citation per unit, admissible only for one of amendment S3's three reasons — two accounts that disagree, a count from an interested party, a record whose keeper is a power. None obtains: the reading is a single classifier over standing flags, there is no second account, no count is stated, and the muster is not a power over the fact of a wall. §24 records that the exemplar registers with surviving raw text cite at zero per 786 sentences, so a citation here would be the habit a refuter is instructed to find. MOVE-GRAMMAR §4.4.3 adds that a citation on a fact whose holder is the office itself is a finding.

## 2. WHAT THE OLD SENTENCES CLAIMED THAT THE CARD DOES NOT LICENSE, AND WHERE IT WENT

The drop is the rewrite's purpose; the shipped breach is the corpus's known state. Nothing below is replaced by a substitute claim, and nothing is added.

**Variant 1, shipped:** *"{settlement} has a wall and nobody to man it. The line is a chokepoint on paper and a chokepoint requires people standing in it, which this town cannot supply for more than a night."*

- *has a wall* — **KEPT** (L2).
- *nobody to man it* — **KEPT as L3, its totality over persons DROPPED.** `nobody` is a totality over persons, which the card's REFUSED COLUMNS line refuses always, and which the DEF-1 judgment records a refuter failing in this exact shape (*"without being stopped, challenged or counted by anybody at all"*). The licensed fact is the absence of the garrison-or-militia read, so every face states the absence institutionally and no face says *nobody* or *no one*.
- *The line is a chokepoint on paper* — **DROPPED.** A MEANING move: it names what the wall's presence signifies. MOVE-GRAMMAR §1.3 records that MEANING exists nowhere in the estate; R-DA-03's second-sentence-summary figure is 0.000.
- *a chokepoint requires people standing in it* — **DROPPED.** A life-general proposition no field holds: R-DA-12's generalisation test, and the register card's *never closes on a moral, a maxim*.
- *which this town cannot supply for more than a night* — **DROPPED, on four counts.** (a) `, which` is R-DA-03's wall and MOVE-GRAMMAR §1.4 order constraint 6; this is the pool's only `whichTailRate` hit. (b) *more than a night* is a count and a time band; the card's `may NOT:` refuses *a count*, and R-DA-16 keeps counts to typed count fields. (c) A capacity the town would show under an attempt that has not happened is a forecast; `may NOT:` refuses *a future*, MOVE-GRAMMAR §1.3 refuses FORECAST outright, and STATE never FATE is THE PROMISE. (d) It is a second fact riding as a tail (R-DA-03), and it is not a consequence the engine computed of the sentence's own fact, so amendment S2 does not admit it either.

**Variant 2, shipped:** *"A stranger walks the perimeter at {settlement} and finds long stretches of good work with nobody on them, in a country where that matters a great deal."*

- *A stranger walks … and finds* — **DROPPED.** See refusal R1. A PERSON carrying a recorded act is licensed only by a ROLE field (MOVE-GRAMMAR §1.2 row 3) and this block holds none; the register card's hard section bars a persona and an assigned reaction; the card's `may NOT:` refuses *a standpoint* by name.
- *long stretches* — **DROPPED.** A quantity of wall: `may NOT: a count`.
- *good work* — **DROPPED.** An evaluative adjective on a civic object; R-DA-10 puts evaluative adjectives at zero and MOVE-GRAMMAR §1.3 refuses VERDICT.
- *with nobody on them* — **KEPT as L3, its totality DROPPED**, as in variant 1.
- *in a country where that matters a great deal* — **the country KEPT (L1), the evaluation DROPPED.** *matters a great deal* rates the fact just stated; the record rates nothing without a typed rating field.
- **KEPT:** the perimeter (L2), the absence upon it (L3), the plagued country (L1).

**Variant 3, shipped:** *"The works at {settlement} are doing less each season as the watch thins, and the thinning is not being reversed."*

- *the works* — **KEPT** (L2).
- *each season* — **DROPPED.** The card's `may NOT:` names *a season*.
- *are doing less* — **DROPPED.** A change in the works' effect over time; a HISTORY move takes an event-provenance field only (MOVE-GRAMMAR §1.2 row 2), R-DA-19 bars the event move from R1 STATE, and A6 lets a standing configuration field license a structural clause and never a historical one.
- *as the watch thins* — **DROPPED twice over.** It is a CAUSE (`may NOT: a cause`), and *the watch* is a fourth institution this pool's predicate does not read: `force` at the call site is `garrison || militia`, and the watch is a separate institution row belonging to another desk. No face in this packet uses the word.
- *the thinning is not being reversed* — **DROPPED.** A trend carried forward is a forecast; `may NOT: a future`; MOVE-GRAMMAR §1.3 FORECAST; NL-6's census arm runs over every AFTER regardless of the BEFORE.
- **KEPT:** the works (L2), the absence of a force on them (L3), the plagued country (L1).

**Nothing was added.** No face names a second civic object of the class `wall` — no gate, tower, ditch, parapet or postern anywhere in the twelve (`may NOT: another civic object of the class wall`). No face names an office, a count, an exemption, a duty or a totality over persons; none carries a belief frame, a hedge, a vague authority, a named character or a theological claim.

## 3. HOW THE THREE ANGLES ARE REALISED WITHOUT A SECOND CLAIM

- **`[ledger]`** — the record's flat order, and the pool's only two-sentence shape: the thing, the country it faces, then what stands on it. The shipped variant 1 is two sentences and all four of its faces are two sentences, so the pool keeps the sentence-count difference A11 and MOVE-GRAMMAR §3.4 require it to keep (variants 2 and 3 are one sentence, as shipped).
- **`[visitor]`** — realised as WORD ORDER ONLY, the outside-in order in which an approach meets the three limbs: country, then the perimeter it reaches, then the absence upon it. §3.4 lists word order among the three things a grammar MAY spend. No face asserts a person, an act of perception or a reaction. See refusal R1.
- **`[unfolding]`** — realised as DURATIVE ASPECT on the standing fact (*remains* · *goes* · *go on* · *stays*), never as a slope, a trend or a rate of change. The card licenses the predicate *as a STANDING fact of the record*; a slope needs the event-provenance field the block does not hold. See refusal R2.

**THE THREAD (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1).** This pool is the SPINE (`role: spine`; a spine takes no relation and no attach set), so its sentence stands first and the composer's modifiers follow it by salience. Two consequences were written for:

- *Inside* each two-sentence face the second sentence carries a noun forward from the first — *wall* → *that wall*, *circuit* → *the circuit*, *works* → *those works*, *line* → *That line*. A11's echo bound counts facts and not nouns, so a deliberate noun echo for the thread is lawful (§1.4.1's own line).
- *Outward*, every face ends on a civic noun or on a standing condition of one — *militia*, *circuit*, *works*, *unheld*, *unmanned*, *empty*, *circuit*, *militia*, *unheld*, *force*, *unmanned* — and no face ends on a bare pronoun, so whichever modifier the composer seats next has a noun or a condition to pick up. No face ends on a set-up move (order wall 7).

## 4. WORD COUNT PER FACE

Whitespace tokens, `{settlement}` counted as one; two-sentence faces show `(s1 + s2)`.

| variant | numbered row | `[face]` 1 | `[face]` 2 | `[face]` 3 |
|---|---|---|---|---|
| 1 · `[ledger]` (two sentences) | **24** (14 + 10) | **19** (11 + 8) | **21** (13 + 8) | **15** (11 + 4) |
| 2 · `[visitor]` (one sentence) | **12** | **13** | **16** | **20** |
| 3 · `[unfolding]` (one sentence) | **15** | **14** | **17** | **14** |

Min 12 · max 24 · mean 16.7. Shortest sentence 4 words (*That line is unheld*), longest 14. The short line exists in the pool and is not manufactured elsewhere.

## 5. THE HARD FLOORS, HELD AT ZERO ACROSS ALL TWELVE

**EXECUTED, not asserted.** The twelve rows were parsed back out of this file with the projector's own two regexes — `VARIANT_RE` (`scripts/generate-dossier-state-prose.mjs:224-226`) and `FACE_ROW_RE` (`scripts/lib/dossier-annex-grammar.mjs:107`) — and run against the floor detectors. Result: **3 numbered rows parsed, 9 face rows parsed, the optional second-tag capture group EMPTY on all three rows**; zero hits of `which` · em dash · digit · percent · question mark · exclamation mark · semicolon · colon · parenthesis · `there is` · `it is` · `according to` · `[plain]` across all twelve; `{settlement}` exactly once and no other slot in each of the twelve; no face opening on the slot; no face and no SENTENCE inside a face ending on a pronoun; twelve distinct first-two-word pairs out of twelve; word counts 12 to 24, mean 16.7; sentence counts 2 · 2 · 2 · 2 on variant 1 and 1 on every face of variants 2 and 3, matching the shipped rows' own spread.

Grep-checkable over the twelve rows: no `which` (the string does not occur), no em dash, no digit, no percent, no question mark, no exclamation mark, no semicolon, no colon, no parenthesis, no `there is` / `it is` expletive opener, no dialogue, no bare future indicative, no `according to` or attribution of any kind, no second bracketed tag, no `[plain]`. No face opens on `{settlement}`, and the settlement token opens no variant at all, so R-DA-17's opener ceiling is met with room. All twelve first-two-word pairs are distinct (*A wall* · *The circuit* · *Beasts have* · *Plagued country* · *Beast country* · *Monster country* · *Creatures hold* · *A country* · *In plagued* · *Creatures keep* · *Beasts go* · *The country*), and the three numbered rows share no opening word.

## 6. FOUR FACES, NEVER A PARAPHRASE OF A SIBLING

Within each variant the four wordings take four different names for the perimeter, four different sayings of the country and four different sayings of the absence, and four different rhythms:

- **variant 1** — wall · circuit · works · line; *plagued with beasts* · *monster country* · *Beasts have the country* · *Plagued country lies about*; *neither garrison nor militia* · *Nothing under arms is kept* · *no force* · *unheld*. Rhythms: long + medium · medium + short · medium + short with the inversion *against them stand* · medium + a four-word close.
- **variant 2** — perimeter · line · works · circuit; *Beast country reaches* · *Monster country lies against* · *Creatures hold the country to* · *A country of beasts runs up to*; *unmanned* · *stands empty* · *nothing armed holds* · *keeps no force*. Lengths 12 · 13 · 16 · 20, and face 2 turns on one verb used twice (*hold* · *holds*).
- **variant 3** — wall · circuit · works · line; *In plagued country* · *Creatures keep the country* · *Beasts go on in the country* · *The country stays plagued*; *remains without garrison or militia* · *goes unheld* · *go on without a force* · *stays unmanned*. Four different durative verbs, one per face; face 0 opens on the land, faces 1 and 2 on the creatures, face 3 on the country as subject.

## 7. SIBLING DISTANCE (arms A1 and A11), against the block's own section

- **`plagued`, perimeter AND organized force** — shipped: *thick with creatures* · *a wall to hold and there are people to hold it*. No face here uses *thick with*, *people to hold it*, *rotations*, *gates* or *holding against the pressure*. Mutually exclusive branches of one classifier; no contradiction.
- **`plagued`, NO perimeter and NO force** — shipped: *An embattled country and nothing organized standing in it* · *no line, no force and no specialist recourse*. That pool asserts no perimeter; mine asserts one. Exclusive branches; and no face borrows *embattled*, *recourse*, *terrain, distance* or *the ability to leave*.
- **`Invasion & War`: walls with NO force** — a DIFFERENT row of the same block, rendered on the same page for the same town, shipped as *walls and nobody to put on them* and *a serious perimeter and a serious absence of anyone standing in it*. No face here uses either shape. The two rows genuinely share their L2 and L3 limbs — `perimeter` and `force` at `:655` are the same `walls` and `garrison || militia` the invasion row reads — so the plagued country is what tells this pool's sentence apart from that one on the page. That is the substance of judgment R3.
- **`frontier`, force without a perimeter** — shipped: *no wall for them to stand on*. Not used.

--- NOTES · REFUSALS

**No variant is refused as unwritable.** All three are written, in place, under their own numbers and their own single angle tags, with four wordings each. R1 and R2 name a law the ANGLE cannot meet from inside any wording; R3 and R4 are judgments recorded for veto.

**R1 — THE `[visitor]` STANDPOINT CANNOT BE ASSERTED. A card-internal contradiction, not a wording problem; no redraft resolves it.**
The card's `may NOT:` line refuses *a standpoint* outright, while the card's own `angle:` line records `visitor` among this pool's three authored angles, and the shipped variant 2 asserts an observer who walks, finds, and is told what matters. Both readings cannot be satisfied at once, so I kept the wall: the register card's hard section (no persona, no assigned reaction), MOVE-GRAMMAR §1.2 row 3 (a PERSON needs a ROLE field, which this block does not hold) and the card's own `may NOT` line outrank a permission read out of an angle label. Variant 2 is therefore written with the angle realised as order and selection and with no observer asserted. **If the chair rules that `angle: visitor` licenses an asserted observer, variant 2's four wordings are the ones to send back** — under that reading the shipped sentence is lawful and my rewrite drops a licensed claim; under mine, the shipped sentence is the defect. **Recommended sitting ruling:** the `angle` line records the authored angle and never licenses a claim; a standpoint is realised as order and selection, never as an asserted observer. This recurs on every `[visitor]` row in the estate and is a sitting row, not a pool row.

**R2 — THE `[unfolding]` SLOPE CANNOT BE WRITTEN AT ALL ON THIS POOL; the angle survives only as aspect.**
The shipped variant 3 is a slope: the works do less *each season*, the watch *thins*, the thinning *is not being reversed*. Each of the three is refused by name — a season and a future by the card's `may NOT:` line, the thinning by A6 and by MOVE-GRAMMAR §1.2 row 2 (a HISTORY move needs event provenance; this block holds none), and *the watch* by the read itself (`force` is `garrison || militia`). What survives is the standing fact said duratively. **This is a real loss of the angle's substance and I record it as such**: if the chair reads `[unfolding]` as requiring an asserted change over time, this pool cannot supply one lawfully today, and the cure is a schema act (an event-provenance or prior-state field on the defense profile), which is owner-gated and not a rewrite.

**R3 — THE PLAGUED-COUNTRY LIMB IS CARRIED BY ALL THREE VARIANTS, INCLUDING THE TWO WHOSE SHIPPED SENTENCES DID NOT SAY IT ALOUD. A judgment, vetoable.**
Shipped variant 1 names only the wall and the absence; shipped variant 3 names only the works, the thinning and the reversal. Under a SURFACE reading of *carry exactly the licensed claim set of the old sentence*, L1 would be an addition to those two, and B-CLAIM is a wall. I read the claim the other way, and the reading is the estate's own: MOVE-GRAMMAR §1.1 defines a variant's typed CLAIM as the set of (move, field, value) triples it asserts, and this pool's variants assert exactly one — `(PRESENT, beastsRowSituation(family, perimeter, force), 'plagued country, perimeter without force')`. §3.4 then requires that triple to be IDENTICAL across a pool's grammars (arm C), and the card prints ONE `may claim:` bullet, not three severable facts. Naming the family limb is therefore rendering the licensed triple more fully, not adding a second triple; and under the surface reading the three shipped variants are not claim-equal to each other, which arm C already forbids. Two further supports: dropping L1 from variants 1 and 3 would make them claim-identical to `Invasion & War: walls with NO force`, which renders on the same page for the same town (§7 above), and U9 protects a clause carrying the pool key's discriminating claim. **If the chair rules the surface way, variants 1 and 3 lose their L1 limb and each becomes a two-limb sentence**; the cut-back is mechanical on all eight wordings, and I would rather be told than guess.

**R4 — SIX BAND FLOORS ARE STRUCTURALLY UNREACHABLE ON A ONE-OR-TWO-SENTENCE UNIT, and are reported rather than chased.**
`semicolonRate`, `colonRate`, `triadRate`, `adverbsPerSentence`, `abstractNounRate` and `wordsPerSentence.shareUnder8` each carry a non-zero band floor, and a rate whose denominator is one or two sentences can only be zero, a half or one; `neighbourVariation` is zero by construction on a single-sentence face. I did not manufacture a semicolon, a triad or an adverb to lift a face off a floor: §21.4 names a lawful line made plainer or busier with no law behind the change as the regression, and a semicolon in particular manufactures an arm-Q finding. Position on these is reported as information (§21.1), and the pool's spread is carried ACROSS the twelve faces — twelve to twenty-four words, one to two sentences, twelve distinct openers, four perimeter nouns, ten sayings of the absence — rather than forced inside each one.
