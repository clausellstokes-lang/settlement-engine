Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-2`, pool key `Beasts & Monsters: plagued, NO perimeter and NO force`, REWRITE draft round 1.
Three existing variants rewritten in place, one for one: same vids, same order, same single bracketed angle tag, none added, none removed, none merged (§22). No `[plain]` marker anywhere — this pool is a SPINE and the projector refuses that marker on a spine row.
Each variant is its numbered wording plus three `[face]` sub-rows: four wordings per semantic variant, each a different vocabulary or rhythm inside the voice, none a paraphrase of its sibling. An unweighted seeded roll picks one at render, so every wording stands alone.

---

## THE ROWS (paste under the pool's existing bold line, replacing rows 1–3)

**`Beasts & Monsters`: `plagued`, NO perimeter and NO force**
1. `[ledger]` The country around {settlement} is beast country, and the town keeps neither a line against it nor anyone under arms.
   - `[face]` Beasts range the country {settlement} stands in. The town has no works and musters nobody.
   - `[face]` Beast-ridden country lies around {settlement}, and the town in it is unwalled and without a watch.
   - `[face]` Creatures hold the country around {settlement}. The town keeps no perimeter and no force against them.
2. `[street]` The country outside carries creatures, and the town makes no answer to them: no wall, no watch.
   - `[face]` Creatures are loose in the country around the town. The town does not defend itself.
   - `[face]` Monsters have the country, and the town has neither a wall nor a force of its own.
   - `[face]` Pressure from the country lies on the town. The town stands unwalled and calls no muster.
3. `[visitor]` A stranger coming to {settlement} finds beast country and a town with nothing arranged against it.
   - `[face]` A stranger crosses monster country to reach {settlement}, and finds the town without a perimeter and without a watch.
   - `[face]` Beasts work the country a stranger comes through to reach {settlement}, and the town shows no line and no guard.
   - `[face]` Coming to {settlement}, a stranger finds a country the monsters hold and a place that raises no wall and sets no watch.

---

## --- NOTES

### N.0 THE CARD, AS PRINTED

`node scripts/prose-licence-card.mjs DS-DEF-2 'Beasts & Monsters: plagued, NO perimeter and NO force'`, run read-only in `laneRW-DEF2`, prints: role `spine`; `reads` `beastsRowSituation(family, perimeter, force)` via `BEASTS_ROW_POOL` in `defenseStateProse.js`; `predicate` `=== plagued country, neither`; `bag` `{band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites `{settlement}`**; relation none (a spine takes none); form `sentence`; `angle: ledger street visitor`; `attach` empty; `source` `muster · standing LICENSED`; `covert: no`; `audience: player (no mark)`; **may claim** that the predicate holds, as a STANDING fact of the record; **may NOT** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `wall`; **REFUSED COLUMNS** a totality over persons, an exemption from a duty, a named character and that character's fate, a theological claim.

**THE THREE LICENSED CLAIMS**, named once and cited by number below. All three are limbs of the one `predicate`, so the set is ONE state and not a second fact (see N.4 item 3).

- **C1 — the country is beast country.** Card clause: `predicate` limb `plagued country` (the `family` argument of the read).
- **C2 — the town holds no perimeter.** Card clause: `predicate` limb `neither`, first conjunct (the `perimeter` argument; the block's PROVENANCE + FENCE note pins this to `defenseProfileHasWalls`, never to a presence check on `institutions.walls`).
- **C3 — the town keeps no organized force.** Card clause: `predicate` limb `neither`, second conjunct (the `force` argument).

The umbrella clause under all twelve wordings is `may claim`: *that the predicate holds, as a STANDING fact of the record*. Nothing below rests on anything else: no arm, no band word, no terrain, no institution row, no history.

**Slot.** Every wording of variants 1 and 3 carries `{settlement}` and no other token; every wording of variant 2 carries no token, which is what the shipped variant 2 carries. The slot SET of each face equals its parent row's, so ARCH §2.5's face-row refusal does not fire; `{band}` and `{route}` are RESERVED and unfilled at this block's call sites and appear nowhere.

**Provenance, spent nowhere.** The card licenses a citation of the `muster` holder. None of the twelve wordings names a record holder: the §24 ceiling is one citation per unit and only for one of S3's three reasons, none of which is present here (there is no count, no two disagreeing accounts, and the fact is not a keeper's own count). The exemplar registers with surviving raw text cite at zero per 786 sentences, so withholding is the norm and a citation here would be a refuter's finding. Arm A13 has nothing to read.

### N.1 Per-face licence, claim by claim

Every wording carries exactly {C1, C2, C3} and nothing else, so the four wordings of each variant are claim-equal to one another (arm A6 reads across the faces). C2 and C3 are realised in some wordings as their two named limbs and in others as the single compound lack they conjoin (*nothing arranged against it*, *does not defend itself*); the compound is one ABSENCE move over both limbs, not a weaker claim and not a third one (see N.4 item 4).

**Variant 1 `[ledger]` — the record's flat compilation. Angle licensed by the card's `angle:` line (`ledger`).**

| wording | C1 (`predicate`: plagued country) | C2 (`predicate`: no perimeter) | C3 (`predicate`: no force) |
|---|---|---|---|
| row | *is beast country* | *keeps neither a line* | *nor anyone under arms* |
| face a | *Beasts range the country* | *has no works* | *musters nobody* |
| face b | *Beast-ridden country lies around* | *is unwalled* | *without a watch* |
| face c | *Creatures hold the country* | *keeps no perimeter* | *and no force* |

**Variant 2 `[street]` — the town's own terms. Angle licensed by the card's `angle:` line (`street`).**

| wording | C1 | C2 | C3 |
|---|---|---|---|
| row | *The country outside carries creatures* | *no wall* | *no watch* |
| face a | *Creatures are loose in the country* | *does not defend itself* (compound C2+C3) | as C2 |
| face b | *Monsters have the country* | *neither a wall* | *nor a force of its own* |
| face c | *Pressure from the country lies on the town* | *stands unwalled* | *calls no muster* |

**Variant 3 `[visitor]` — the stranger's finding. Angle licensed by the card's `angle:` line (`visitor`); the stranger bears an ACT in every wording and never an interior (see N.4 item 1).**

| wording | C1 | C2 | C3 |
|---|---|---|---|
| row | *finds beast country* | *nothing arranged against it* (compound C2+C3) | as C2 |
| face a | *crosses monster country* | *without a perimeter* | *without a watch* |
| face b | *Beasts work the country* | *shows no line* | *and no guard* |
| face c | *a country the monsters hold* | *raises no wall* | *sets no watch* |

**Claims DROPPED, with the clause that refuses each.** Dropping them is the rewrite's purpose; the shipped breach is the corpus's known state, the slot survives, and the old text stays in the annex history (§22).

| dropped from | the claim | refused by |
|---|---|---|
| variant 1 | *no specialist recourse* | `predicate` holds three limbs; a third lack is a fact no field carries. Also `may NOT: a second fact` |
| variant 1 | *survival here rests on terrain, distance and the ability to leave* | `may NOT: a cause`; three particulars (terrain, distance, departure) no field of this block holds |
| variant 2 | *What it does is watch, and move* | asserts an organized watch and a movement the branch's `force === false` denies; a self-contradiction against C3 |
| variant 2 | *and hope the pressure goes around it* | a belief; MOVE-GRAMMAR §1.3 FEELING ("no field carries motive, belief or mood") |
| variant 2 | *that is understood by everyone in it* | REFUSED COLUMN: **a totality over persons**; and a belief |
| variant 3 | *understands the danger before anybody explains it* | an interior (FEELING) plus a totality over persons (*anybody*) |
| variant 3 | *because … as though danger were expected to be met* | `may NOT: a cause`; and a belief frame |

**Claims ADDED: none.** Every wording is a subset-preserving restatement of its own variant's licensed claims.

### N.2 THE THREAD (owner, 2026-09-08 ~21:4x)

Every two-sentence wording hands a noun forward from its own first sentence: *the country … stands in → The town*; *Creatures hold the country → against them*; *Creatures are loose in the country around the town → The town*; *lies on the town → The town*. No wording changes subject in the middle and hands nothing back; no wording needs the one turn outward, because none takes one.

This pool is the **spine**, so it is read first and every wording is written to open a passage: none begins on a connective, a comma, a lower-case clause-list word or a bare pronoun, and each states its civic fact before any modifier can attach. Each closes on a standing civic noun a modifier can pick up — arms, works, a watch, a force, a wall, a muster, a guard, a perimeter — so whichever sibling modifier the composer seats next has a noun of the spine's to carry forward. Because the seeded roll picks one wording and the composer chooses the modifier's place, each wording is written to read the same whether a modifier follows it directly or after a sibling.

### N.3 Walls checked across all twelve wordings

No em dash. No exclamation mark. No question mark. No digit, and no numeral word standing as a count. No `which` of any kind, relative or otherwise. No first or second person. No expletive opener (*there is / there are*). No figure, simile or inanimate intent. No future indicative and no subjunctive edge — the pool holds no threshold field, so no wording reaches for one. No citation of a holder. No named character, no fate. No theological claim. No exemption. No totality over persons: every force clause is what the TOWN keeps, has, musters or calls, which is the institution's act, and no wording says that no person bears arms. At most two sentences per wording (A1). Each wording names **one** civic object of the class `wall` at most (line · works · unwalled · perimeter · wall · muster's absence), so the card's `another civic object of the class wall` clause is not touched. One colon in twelve wordings, no semicolon: the rationed joint stays rationed (R-DA-06, NL-3). The `{settlement}` token opens no wording (R-DA-17 / wall 10 clear at zero of twelve).

Sibling-pool distance (arms A1 and A11): nothing here restates or contradicts the two neighbouring `plagued` pools. Their signature phrasings — *thick with creatures*, *a wall to hold and … people to hold it*, *has a wall and nobody to man it*, *the watch thins* — appear nowhere above, and the classic *no wall and nobody to hold it* shape was deliberately refused for its closeness to the `perimeter but NO force` sibling. The `settled` siblings' *walks out … in any direction* and *Between a stranger and {settlement}* shapes were likewise refused.

### N.4 THE LIST OF REFUSALS

Four rows. None of them stops a wording from being written, and all four are reported rather than cured, because curing them is not a writer's act.

1. **REPORTED — the `[visitor]` angle against the card's `may NOT: a standpoint`.** The card's own `angle:` line names `visitor` as one of this pool's three angles, so the stance is card-declared; the same card refuses a standpoint. The two clauses cannot both be read strictly. Every wording of variant 3 confines the stranger to an ACT the record can hold (*coming*, *crosses*, *comes through*, *finds*, *shows*) and gives no interior, no expectation and no assessment, which is as far as the voice reaches without dropping a card-declared angle; dropping the angle would be trimming (§22) and is not mine. The chair's row: either the `angle:` line licenses the stance and the `standpoint` clause means an asserted view, or the pool's third angle is unlawful and all three of its shipped wordings were too.
2. **REPORTED — A11's distinct-grammar rule cannot be met at three variants.** Filtering MOVE-GRAMMAR §2.1's level-1 set by this pool's licensing fields leaves exactly two members drawable: V1 (PRESENT alone) and V3 (PRESENT → LACK). V2, V4, V5, V6, V7 and V8 each need a field this pool does not read (a structural-consequence field, a named object, an institution row, an unresolved state value, event provenance, a not-held record field with provenance). V1 alone cannot carry C2 and C3, so all three variants take V3. `min(k, 8) = 3` distinct grammars is therefore unreachable, by the licence and not by the writing. This is a band, not a wall (§16), and the distance is reported with its cause, as §2.1 provides for ("a block with no `none-exists` field has no V3 and the pool is written without it").
3. **REPORTED — the card's `may NOT: a second fact` against a three-limbed predicate.** The predicate `plagued country, neither` is a conjunction of the family word and two flags; every wording states that one predicate and nothing beside it. Read as forbidding a fact BESIDE the predicate, the clause is obeyed by all twelve. Read as forbidding a second proposition inside the sentence, it refuses the pool's own state key, and equally refuses the three sentences standing in the product today. Taken here in the first sense; the chair's to settle, as it is a card clause inherited from a modifier-shaped template.
4. **DECLARED — the reading taken on wall 3 (ABSENCE never opens, never sits beside another ABSENCE).** This branch's state is two lacks. They are written throughout as ONE compound ABSENCE over both limbs (*neither a line … nor anyone under arms*; *no wall, no watch*; *nothing arranged against it*), never as two adjacent ABSENCE moves, and the ABSENCE opens no wording — C1 opens every one of the twelve. Declared rather than assumed, because a reader who counts the limbs as two moves would find them adjacent in ten of twelve wordings and the pool unwritable at all.

**No variant is banked.** All three are written lawful under the readings declared above; there is no refusal set and no wording is withheld.

### N.5 The measurements, printed (executed on this file; `{settlement}` counted as one word)

| variant | tag | wording | words |
|---|---|---|---|
| 1 | `[ledger]` | row | 20 |
| 1 | `[ledger]` | face a | 15 |
| 1 | `[ledger]` | face b | 16 |
| 1 | `[ledger]` | face c | 16 |
| 2 | `[street]` | row | 17 |
| 2 | `[street]` | face a | 15 |
| 2 | `[street]` | face b | 17 |
| 2 | `[street]` | face c | 16 |
| 3 | `[visitor]` | row | 16 |
| 3 | `[visitor]` | face a | 19 |
| 3 | `[visitor]` | face b | 20 |
| 3 | `[visitor]` | face c | 22 |

Twelve wordings, 15 to 22 words, mean 17.4. Every wording is shorter than the product sentence it replaces (31, 28 and 27 words), which is editing inside the band and not trimming: the three slots survive, no sentence is removed, and the face count rises from one to four per variant (§22 (a), (b), (d)).

Executed checks over the twelve rows: em dash 0 · exclamation 0 · question mark 0 · digit in prose 0 (the three digits in the block are the variant numbers) · `which` 0 · first or second person 0 · expletive opener 0 · `will` / `shall` / `would` 0 · semicolon 0 · colon 1 · `{settlement}` present in all four wordings of variants 1 and 3 and in none of variant 2, matching each parent row's slot set · `{settlement}` opens 0 of 12 wordings.
