Block DS-DEF-2 · pool key `Disasters & Famine: granary AND hospital` · REWRITE draft round 1 · Opus writer (Fable-unvalidated)
Paste target: under the bold pool line **`Disasters & Famine`: granary AND hospital** in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`, replacing rows 1 to 3 entire. The pool's typed lines are untouched and not repeated here. Three variants in, three variants out; same vids, same order, same angle tags; four faces each.

1. `[ledger]` The granary and the hospital both belong to {settlement}.
   - `[face]` A store for grain is held at {settlement}, and a hospital.
   - `[face]` The hospital at {settlement} is for the sick, and the store for grain.
   - `[face]` In the town's keeping at {settlement} are a grain store and a sick-house.
2. `[street]` What the town has for grain is a granary, and what it has for the sick is a hospital.
   - `[face]` A hospital is in the town. So is a granary.
   - `[face]` Neither a granary nor a hospital is missing from the town.
   - `[face]` A grain store is the town's, and the hospital is the town's.
3. `[counterforce]` Standing at {settlement} are a hospital and a granary.
   - `[face]` A granary is in hand at {settlement}, and a hospital is in hand.
   - `[face]` The town holds a hospital at {settlement} and holds a granary.
   - `[face]` A hospital stands at {settlement}, and a granary stands.

--- NOTES

REFUSALS: none. All three variants are written lawful; no variant is banked as a refusal row. One NARROWING is recorded below (judgment 4, the counterforce angle) — it is not a refusal, because the variant is written and stands.

THE CARD, AS THIS PACKET READS IT.
- `reads`: `disasterRowSituation(granary, hospital, church)` via `DISASTER_ROW_POOL` in `defenseStateProse.js`. The key function short-circuits: `if (granary) { if (hospital) return 'granary, hospital'; ... }` (`src/domain/display/stateProse/defenseStateProse.js:580-586`). The `church` parameter is NEVER CONSULTED on this row. So the row asserts exactly two things and asserts nothing whatever about a church.
- `may claim`: that the reader selects the row `granary, hospital`, as a STANDING fact of the record. In prose that is ONE claim, called (A) throughout, and it names two civic objects because the row's own value does: a granary stands at this settlement and a hospital stands at this settlement. The pool key itself is `granary AND hospital`; the conjunction is the row's value, not a second fact riding on a first.
- `may NOT`: a count · a cause · a season · a future · a standpoint · a second fact · another civic object of the class `care`. REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim about a deity.
- `bag`: `{band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites at `{settlement}` alone. `{band}` is RESERVED and is used by no row or face; no face carries `{route}`.
- `role: spine` · `form: sentence` · `relation:` a spine takes none · `attach:` empty · `move:` none declared · `angle: counterforce ledger street` — the three angle tags stand exactly as the old rows carry them, one bracketed tag per row, no `[plain]`.
- `source: (none) · standing SOURCE-UNRESOLVED`. NO citation is licensed; a face naming a record holder is refused by arm A13. See PROVENANCE below.
- `echo`: the echo table is keyed on the whole table-rung reading truncated at the file's first dot, so all five pools selecting a row of `DISASTER_ROW_POOL` share one echo key; the five situations are mutually exclusive at render, so nothing in this packet can co-render with a sibling row.

PER FACE, THE CLAUSE THAT LICENSES EACH CLAIM. Every one of the twelve faces makes exactly ONE claim, (A), licensed by the card's `may claim` line and asserted in the present as a STANDING fact of the record per that same line. The `{settlement}` slot, where it appears, is licensed by the `bag` line's FILLED set. The angle framing of each row (the office's own reckoning; the town's plain idiom; what the town has standing) is licensed by the card's `angle:` line and carries no claim of its own. No face carries a second claim, a modality, a source or a quantifier.

| # | face | claim | licensing clause | words |
|---|---|---|---|---|
| 1 | The granary and the hospital both belong to {settlement}. | A | `may claim` · `bag` FILLED `{settlement}` | 9 |
| 1 | A store for grain is held at {settlement}, and a hospital. | A | as above | 11 |
| 1 | The hospital at {settlement} is for the sick, and the store for grain. | A | as above | 13 |
| 1 | In the town's keeping at {settlement} are a grain store and a sick-house. | A | as above | 13 |
| 2 | What the town has for grain is a granary, and what it has for the sick is a hospital. | A | `may claim` (no slot: see THE EMPTY SLOT SET below) | 19 |
| 2 | A hospital is in the town. So is a granary. | A | as above | 10 |
| 2 | Neither a granary nor a hospital is missing from the town. | A | as above | 11 |
| 2 | A grain store is the town's, and the hospital is the town's. | A | as above | 12 |
| 3 | Standing at {settlement} are a hospital and a granary. | A | `may claim` · `bag` · `angle:` (counterforce frame, no claim) | 9 |
| 3 | A granary is in hand at {settlement}, and a hospital is in hand. | A | as above | 13 |
| 3 | The town holds a hospital at {settlement} and holds a granary. | A | as above | 11 |
| 3 | A hospital stands at {settlement}, and a granary stands. | A | as above | 9 |

WHAT WAS DROPPED, AND UNDER WHICH LAW (the rewrite's purpose; the shipped breach is the corpus's known state).

Variant 1, old text: `{settlement} holds food against a bad year and has somewhere to put the sick; between them the town can take a failed harvest or an outbreak without either becoming a catastrophe.`
- `against a bad year` — a SEASON, refused verbatim by the card (`may NOT: a season`). The granary's own designation carries what it is for without a calendar particular; naming a bad year asserts a state of the weather this reader does not read.
- `between them the town can take a failed harvest or an outbreak` — a second fact and a CAPACITY claim. The reader returns a row of a table of situations; it computes no capacity, so S2's clause seat does not reach this — the amendment carries only a consequence the ENGINE computed of the sentence's own fact.
- `a failed harvest or an outbreak` — two hypothetical events. R-DST-B (A6): a standing configuration field licenses a structural clause and never a historical one, and the HISTORY move does not exist in R1 STATE at all (MOVE-GRAMMAR §1.2 row 2). Under the card these are also a season and a second fact.
- `without either becoming a catastrophe` — an OUTCOME over an event that has not happened: the FORECAST non-move (MOVE-GRAMMAR §1.3), refused anywhere in the estate under A2 and THE PROMISE, and refused here again by `may NOT: a future`.
- The semicolon and everything after it go with the second fact. What survives is the granary and the hospital, which every face of variant 1 now states outright.
- Variant 1 opened on `{settlement}`. The annex seam contract refuses a sentence-form row opening on a `proper`-typed slot of the block's bag (ARCH §2.5, T-F8), and R-DA-17 refuses the town's name as the default opener; no row and no face in this packet opens on the slot.

Variant 2, old text: `The town has a place for grain and a place for the ill, and knows exactly what having both is worth.`
- `a place for grain and a place for the ill` — LICENSED, and kept. The whole of it is claim (A). `the ill` becomes `the sick` throughout for one term to one thing (R-DA-22) and to hold the block's own vocabulary, which spells the object `sick-house` in the sibling NO-reserves row.
- `and knows exactly what having both is worth` — three separate breaches in one clause. A STANDPOINT (`may NOT`). A belief frame attributed to the town, which the register card refuses outright (`never on a belief`) and R-DA-13's executable floor gates. And a TOTALITY over persons, which the card's REFUSED COLUMNS line refuses always — `the town knows` is every person in it knowing. `exactly` is additionally an evaluative intensifier with no field behind it.
- Nothing of the clause survives. What it presupposed is (A), which the rewritten row states without the knower.

Variant 3, old text: `Neither a failed harvest nor an outbreak turns into a catastrophe at {settlement}, and the reason is in the two buildings rather than in the luck.`
- `Neither a failed harvest nor an outbreak turns into a catastrophe` — the same forecast over the same two unheld events as variant 1, in the negative. A season and a future, both refused on the card; a FORECAST, which does not exist as a move.
- `and the reason is in the two buildings` — a CAUSE, refused verbatim by the card, and the plainest form of it in the pool: the sentence says why an outcome did not occur.
- `rather than in the luck` — a CONTRAST whose rejected alternative is not a sibling pool key and not a sibling band, but a proposition about chance. Order wall 5 and R-DA-02 license a contrast only where a sibling key or band names the alternative; luck is neither, so the contrast goes with the cause it was attached to.
- `the two buildings` — the COUNT `two` is refused verbatim (`may NOT: a count`); the objects themselves are licensed and are named in every face of variant 3 instead. No face of this packet, and no line in it, carries a count word.

THE JUDGMENTS THIS PACKET MAKES, RECORDED FOR VETO.

1. THE CONJUNCTION IS ONE CLAIM, NOT TWO. The card refuses `a second fact` and licenses one row selection. This packet reads the row's value `granary, hospital` as a single conjunctive value — the pool key is written `granary AND hospital` and the key function returns the pair from one branch — so naming both objects in one face is stating (A), not stating (A) and then a second fact. The narrower reading would leave every face able to name only one of the two objects, which would make this pool indistinguishable from `granary, NO medical provision` on one draw and from `NO reserves, hospital present` on another, and arm A1 would convict it as a restatement of whichever sibling it happened to echo. The chair can rule the other way; if it does, this pool needs a sitting row, because no lawful face can then discriminate it from its own siblings.
2. THE OBJECT'S DESIGNATION IS NOT AN ADDED CLAIM. `a store for grain`, `a grain store`, `a sick-house`, `the hospital ... for the sick` are all designations of the two objects the row names, not new particulars. R-DA-10 requires the noun to vary across the pool and R-DA-22 requires one term for one thing; the two pull against each other here and the dossier rule wins, as it does everywhere in R1. `sick-house` is the corpus's own synonym for the hospital in this very block (the NO-reserves NO-provision row sends a reader looking for `the granary or the sick-house`), so it names the same object and not a lesser one. Deliberately absent throughout: `infirmary`, `clergy`, `parish`, `almshouse`, `church` — each is another civic object of the class `care`, refused on the card, and `infirmary` is additionally the sibling `granary AND parish care only` row's own word, which arm A11 would read as sibling collision.
3. THE CHURCH IS NEITHER CLAIMED NOR DENIED. The key function never reads `church` on this branch. So no face says a church stands and no face says one does not; the second would be an ABSENCE move, which needs a typed `not-held` field (R-DA-08) that this card does not carry. A reader of this pool learns nothing about the parish, which is exactly what the record holds.
4. THE COUNTERFORCE ANGLE, NARROWED AND CARRIED. The angle names what the town has standing. In the sibling `Economic Survival` pools the angle can name the pressure, because the band IS a rating against a crisis. Here the card licenses a table row and no pressure: hunger, sickness, a harvest and a season are all refused. So variant 3's four faces carry the angle in its STANDING register alone — `standing at`, `in hand`, `holds`, `stands` — and name no thing that is being countered. This is a narrowing of the angle, recorded so the chair can see it: the counterforce row of this pool cannot say what it counters until a pressure field is read here. It is not a refusal; the variant is lawful and written.
5. THE EMPTY SLOT SET ON VARIANT 2. The old variant 2 carries no slot at all, and the rewrite keeps it that way: its numbered row and all three of its faces name no slot, so every face's slot set equals its parent's (ARCH §2.5's face rule). Adding `{settlement}` there would have been lawful on the bag but would raise this pool's settlement-token share from two rows in three to three in three, against R-DA-17's ceiling and wall 10. The street angle is where the corpus already carries the token-free row; it stays there.
6. THE NEGATIVE FACE. `Neither a granary nor a hospital is missing from the town` asserts presence by denying absence. It is not an ABSENCE move — it writes no gap and needs no `not-held` field — and it is not the LACK shape R-DA-02 bounds, which is a lack stated flat with no completing clause. It is recorded here because a walker arm keyed on absence vocabulary may flag the word `missing`, and the answer is that the sentence's claim is (A) and its polarity is rhetorical, not typed.

PROVENANCE, NOT EXERCISED, AND NOT AVAILABLE. The card prints `source: (none) · standing SOURCE-UNRESOLVED` and states in terms that no citation is licensed here — a face naming a record holder is refused by arm A13. No face cites one, and none names the granary's keeper, the hospital's keeper, a roll, a register or a book. Independently of that standing, Part B §24 would cap the move at one citation per unit for one of S3's three reasons, and none of the three holds on this pool: it carries no count, no second account, and no keeper who is a power. The exemplar registers with raw text cite at zero per 786 sentences, so silence is also the norm.

THE THREAD (owner, 2026-09-08 ~21:4x). This pool is a SPINE, so each face is the passage's first sentence and hands a noun forward to whatever modifier the composer seats after it by salience; no face is ever read after a sibling modifier, and none is written to depend on one. Every face closes on a civic thing of the record or a present condition of one — the settlement, a hospital, the store, a sick-house, a granary, the town, the town's, in hand, stands — so a modifier can carry `the granary`, `the hospital`, `the store` or `the town` forward without a turn outward, and none of the twelve leaves a modifier nothing to pick up. Eleven of the twelve are one sentence; the one two-sentence face (`A hospital is in the town. So is a granary.`) keeps its thread by ellipsis on the same predicate, so its second sentence changes neither subject class nor claim.

BANDS AND SPREAD, REPORTED AS INFORMATION (§16.1/§16.2; position inside a band is never a target).
- Length: 9 to 19 words, mean 11.7 over twelve faces. The three numbered rows run 9 · 19 · 9, sd 4.71, above R-DA-05's within-pool floor of 4.0. Nothing approaches the over-30 ceiling; four faces sit at or below 10 words, holding R-DA-06's short-line floor.
- Sentence count: one per face except face 2a, which is two. The old pool ran every variant at one sentence (variant 1 joined by a semicolon); the multi-sentence count rises from zero to one.
- Openers, twelve faces: The · A · The · In · What · A · Neither · A · Standing · A · The · A. The three numbered rows open `The granary` · `What the` · `Standing at`, so no two variants share their first two words (A11); within each variant the four openers are distinct; no row and no face opens on the slot, and the settlement token opens nothing in this pool at all, against R-DA-17's 0.167 register ceiling.
- Close kinds vary across R-DA-04's set: an object (a hospital · a granary · a sick-house · for grain), a place (`{settlement}`), a holding (the town · the town's), a condition (is in hand · stands). Zero pronoun closers in twelve faces, against the 0.055 ceiling.
- Zero digits, zero count words (`two`, `both of them`, `each` all absent; the one `both` in row 1 is anaphoric over the two objects just named, not a quantity), zero em dashes, zero exclamations, zero questions, zero `which`-clauses, zero citations, zero expletive openers (`There is` / `It is`), zero future indicatives, zero modals of any kind, zero figures, zero evaluative adjectives on a place or a person.
- Rationed and repeated words: `hospital` in eleven faces, `granary` in nine, `store` in four, `sick` in three — the fact behind them is one fact naming two objects and recurs by construction (register card: the WORD may recur, the FACT must not). The standing family (`standing` · `stands`) appears in three faces, all three inside variant 3, where it is that angle's own formula. No two faces of one variant share a verb.
- PERFECTION CEILING (§16.1): this packet does not claim zero exceedances. The deliberate flat points are the near-uniform one-sentence shape, forced by `may NOT: a second fact`; the recurrence of `hospital` and `granary`, forced by a card that licenses two nouns and nothing else; and the low lexical range of the whole pool, which is the honest size of this licence rather than a choice.
