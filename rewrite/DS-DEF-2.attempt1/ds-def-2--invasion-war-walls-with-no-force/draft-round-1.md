Block DS-DEF-2 · pool `Invasion & War: walls with NO force` · REWRITE draft round 1 · Seat: Opus 5 (Fable-unvalidated)
Complete replacement for the pool's three variant rows. The pool's typed lines and the bold pool heading are untouched and are not repeated here. Three variants in, three variants out; same vids, same order, same bracketed tags; four wordings each (one `[plain]`, three `[face]`).

1. `[ledger]` `[plain]` Walls stand at {settlement}, and no garrison or militia stands behind them. An attacker in earnest would need ladders and patience, and the wall itself would stop nobody.
   - `[face]` The line at {settlement} is finished work with nobody assigned to it. Ladders and patience would carry the line.
   - `[face]` A wall is standing at {settlement}; no armed company is kept behind it. Going over the wall would be the whole labour of taking the place.
   - `[face]` At {settlement} the wall is the whole of the defense, and no one is kept to stand on it. An attempt here would come down to ladders and patience, and to nothing else.

2. `[visitor]` `[plain]` A stranger at {settlement} sees the wall before anything else, and sees nobody on the wall.
   - `[face]` The wall at {settlement} is the first fact a stranger has of the town, and the want of anybody on it is the second.
   - `[face]` Whoever comes to {settlement} finds a wall standing and finds it unoccupied.
   - `[face]` Anyone arriving at {settlement} meets the wall at once and meets nobody set to hold the wall.

3. `[street]` `[plain]` The town has the wall that would save it and not the people to work it, and it says as much when asked.
   - `[face]` Everyone here can say what the town has and what it has not: a wall that would serve, and nobody to put on the wall.
   - `[face]` Walls are the town's whole defense and would hold with people on them, the people are not here, and the town keeps neither fact quiet.
   - `[face]` Defense here amounts to a wall that would answer if anybody stood on it, and nobody does, and the town says so.

--- NOTES

**The card, as printed** (`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: walls with NO force'`), with the clause labels used below:
- (C1) `predicate:` `invasionRowSituation(walls, garrison, militia) === walls, no force`.
- (C2) `may claim:` that the predicate holds, **as a STANDING fact of the record**.
- (C3) `bag: {band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites: `{settlement}`.
- (C4) `angle: ledger street visitor` (the pool's three authored angles; the bracketed tags).
- (C5) `reads:` `invasionRowSituation(walls, garrison, militia)` — the three named institution reads.
- (C6) `source: muster · standing LICENSED` — a citation of this holder licensed where the provenance budget allows. **NOT SPENT: no face cites.**
- (C7) NOT A CARD CLAUSE. The block's own PROVENANCE + FENCE paragraph in `RECEIPT_POOLS_DOSSIER_STATE.md` under `### DS-DEF-2`: "the causal clauses here are *capability* clauses (walls without people cannot be held) and never *historical* ones". Cited below where a face carries the capability edge; see refusal R2.
- `may NOT:` a count, a cause, a season, a future, a standpoint, a second fact.

**Variant 1 `[ledger]` — claims carried, one for one from the BEFORE**
| claim | licence |
|---|---|
| a. the walls stand | C1 + C2 (standing fact); the naming of the two absent arms by name is C5 |
| b. no garrison and no militia is kept behind them | C1 + C2 + C5 |
| c. an unheld wall would be passed for the labour of climbing and nothing further | C7 (the block's capability-clause fence) + R-DA-07/A2 (written subjunctive, never indicative) |
| d. the `{settlement}` slot | C3 |

- `[plain]`: (a) "Walls stand at {settlement}"; (b) "no garrison or militia stands behind them"; (c) "would need ladders and patience, and the wall itself would stop nobody"; (d) one `{settlement}`.
- `[face]` 1: (a) "is finished work"; (b) "with nobody assigned to it"; (c) "Ladders and patience would carry the line"; (d) one `{settlement}`.
- `[face]` 2: (a) "A wall is standing"; (b) "no armed company is kept behind it"; (c) "Going over the wall would be the whole labour of taking the place"; (d) one `{settlement}`.
- `[face]` 3: (a) "the wall is the whole of the defense"; (b) "no one is kept to stand on it"; (c) "would come down to ladders and patience, and to nothing else"; (d) one `{settlement}`.

**Variant 2 `[visitor]` — claims carried**
| claim | licence |
|---|---|
| a. the wall stands and is what an arriving outsider takes in first | C1 + C2; the outsider's standing is C4 (`visitor`) |
| b. nobody is standing on it | C1 + C2 |
| c. the `{settlement}` slot | C3 |
No face carries the capability edge, because the BEFORE did not: variant 2 is claim-equal to itself across the four wordings and claim-narrower than variant 1 by the BEFORE's own division.

- `[plain]`: (a) "sees the wall before anything else"; (b) "sees nobody on the wall".
- `[face]` 1: (a) "the first fact a stranger has of the town"; (b) "the want of anybody on it is the second".
- `[face]` 2: (a) "finds a wall standing"; (b) "finds it unoccupied".
- `[face]` 3: (a) "meets the wall at once"; (b) "meets nobody set to hold the wall".

**Variant 3 `[street]` — claims carried**
| claim | licence |
|---|---|
| a. the town has a wall, which would answer for it if it were held | C1 + C2 for the wall; the counterfactual half by C7 read as the same capability clause, in the subjunctive (A2) |
| b. it has not the people to hold the wall | C1 + C2 |
| c. the town states both openly | **NO CARD CLAUSE.** See refusal R1. |
| d. slot set: empty, exactly as the parent row | C3 (the bag is not obliged to be spent; the BEFORE spends none) |

- `[plain]`: (a) "the wall that would save it"; (b) "not the people to work it"; (c) "it says as much when asked".
- `[face]` 1: (a) "a wall that would serve"; (b) "nobody to put on the wall"; (c) "Everyone here can say what the town has and what it has not".
- `[face]` 2: (a) "Walls are the town's whole defense and would hold with people on them"; (b) "the people are not here"; (c) "the town keeps neither fact quiet".
- `[face]` 3: (a) "a wall that would answer if anybody stood on it"; (b) "nobody does"; (c) "the town says so".

**REFUSALS (a refusal is a result; the row is still written, in place, under its own number and tag)**

- **R1 — variant 3, the candour clause, cannot be made lawful by the card.** The claim "the town states both openly" is carried by the BEFORE ("and says so when pressed") and by every sibling `[street]` row of this block. No clause of the licence card licenses it: it is not the predicate, and the card's `may NOT` bars **a second fact**. The rewrite law forbids dropping a claim the variant carries (arm C-pair: the AFTER carries the BEFORE's typed claim set; U9), and R-DA-15's ruling-5 removal would delete the whole point of the `[street]` angle. **Kept, in all four wordings, claim-equal, and flagged.** The law it cannot meet: ARCH §8.3 (every claim licensed by the card) and the card's `may NOT: a second fact`. The chair's two available cures, neither of them a writer's to take: project a `local-knowledge` licence onto the `street` angle in the card, or rule the clause out of the block and let the three `[street]` rows here lose it together with their siblings.
- **R2 — variant 1's capability edge is licensed by the block, not by the card.** "An unheld wall would be passed for the labour of climbing" is the BEFORE's second sentence and is expressly licensed by the block's PROVENANCE + FENCE paragraph (C7), which reserves *capability* clauses to this block and bars *historical* ones. The card carries no capability line and its `may NOT` bars a second fact. **Kept, in all four wordings.** The cure is a card line, not a rewrite: the card printer should project the block's fence sentence into `may claim`.
- **R3 — the `visitor` and `street` standpoints stand against the card's `may NOT: a standpoint`.** The bracketed tags are not the writer's to touch and the card's own `angle:` line names all three. Read here as barring a standpoint-relative **judgment** (what the arrangement is worth, to whom), never the authored angle. No face asserts a judgment. Flagged, not cured.

**WHAT LEFT THE TEXT, AND UNDER WHICH LAW (ruling 5 removals; no claim lost)**
- Variant 2's two evaluative adjectives ("a *serious* perimeter and a *serious* absence") are gone: an evaluative adjective on a civic thing resolves to no field (R-DA-10; the fault-20 list). The parallel they carried is replaced by a licensed one in each face (sees/sees, first/second, finds/finds, meets/meets), so the rhythm is not paid for with a claim.
- Variant 1's present indicative for a hypothetical ("A determined attacker *takes* this town") is now subjunctive throughout. R-DA-07 and A2: the edge is subjunctive; the FATE-breach census runs over every AFTER. No modality is spent in the other direction — no future indicative is added anywhere, and no subjunctive of the BEFORE is removed.
- Nothing is trimmed. Three variants in, three out; no vid moves; no sentence's slot is removed; the pool's shipped sentence-count spread (two, one, one) is preserved in all four wordings of each variant.

**WALLS CHECKED ACROSS ALL TWELVE WORDINGS**
- Zero em dashes, zero exclamations, zero question marks, zero digits, zero percent signs, zero `, which` tails, zero second person, zero first person, zero named characters, zero deities, zero counts, zero seasons, zero dates, zero future indicatives, zero expletive openers ("There is" / "It is").
- No wording opens on the `{settlement}` slot (T-F8). One wording (variant 1, face 3) carries the token in second position behind "At".
- Slot sets match the parent row exactly: variant 1 and variant 2 carry one `{settlement}` in every wording; variant 3 carries none in every wording.
- Every wording opens on a PRESENT move; no ABSENCE opens a wording and no two ABSENCE clauses sit adjacent (R-DA-08).
- Sentence count is at most two everywhere (A1); no third sentence, no qualification as a tail (R-DA-03).
- All twelve wordings differ in their first two words (A11), so no draw of this pool can put two variants on a shared opener: Walls stand · The line · A wall · At {settlement} · A stranger · The wall · Whoever comes · Anyone arriving · The town · Everyone here · Walls are · Defense here.
- Closers, varied in kind and free of `it`/`them`: nobody · the line · the place · nothing else · the wall · the second · unoccupied · the wall · when asked · the wall · quiet · says so.
- Joints, rationed and varied: one semicolon (variant 1, face 2), one colon (variant 3, face 1), the rest commas and `and`; one three-clause line (variant 3, face 2) against eleven that are not, so no tricolon habit.
- THE THREAD: the four two-sentence wordings of variant 1 each hand a noun forward (the wall · the line · the wall) or place their one turn outward last (face 3's "An attempt here"). Every wording ends on a noun a modifier can pick up, so the spine reads whole before any modifier is seated and hands the passage a subject after it.
- Sibling distance (A1/A11), deliberately widened: the BEFORE's ledger line shared its whole frame with `Beasts & Monsters: plagued, perimeter but NO force to hold it` ("has a wall and nobody to man it" / "has walls and nobody to put on them"). No wording here uses that pool's vocabulary — no *chokepoint*, no *man it*, no *long stretches of good work*, no *walks the perimeter*, no *the works are doing less each season*. Nor does any wording borrow from the four `Invasion & War` siblings: no *deterrence*, no *conventional assault*, no *siege gear*, no *raiders*, no *sizing up*, no *beneath notice*.
- Vocabulary spread inside each variant, four for four and never a paraphrase: the fortification is *walls* / *the line* / *a wall* / *the wall is the whole of the defense*; the absence is *no garrison or militia* / *nobody assigned* / *no armed company* / *no one kept to stand on it*; the edge verb is *stop* / *carry* / *labour of taking* / *come down to*. In variant 2 the seeing verb is *sees* / *is the first fact* / *finds* / *meets*. In variant 3 the counterfactual verb is *save* / *serve* / *hold* / *answer* and the candour is *says as much when asked* / *everyone here can say* / *keeps neither fact quiet* / *says so*.
- One term for one thing (R-DA-22): each wording holds a single term for the fortification for its whole length; the terms vary between wordings, never inside one.
- House spelling followed as the corpus keeps it, mixed on purpose and not by me: *defense* (as in the block's own "Defense at {settlement} is not an emergency arrangement") beside *labour* (as in the block's own "a procedure rather than a favour").
- The provenance budget (§24) is unspent: the muster is a licensed holder on this card, but none of S3's three reasons (two accounts that disagree, a count from an interested party, a record whose keeper is a power) is met here, so no face names it. An earlier draft of variant 1, face 3 read "the muster roll names nobody" and was withdrawn for that reason.
