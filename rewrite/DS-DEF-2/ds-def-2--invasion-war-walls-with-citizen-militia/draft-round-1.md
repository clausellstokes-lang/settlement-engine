# DRAFT ROUND 1 — DS-DEF-2 · pool `Invasion & War: walls with citizen militia`

Seat: **Opus 5, the writer** (Fable-unvalidated), for the Fable chair, 2026-09-12, under **ADDENDUM 14** (a face is lawful unless it CONTRADICTS the record; silence is permission) and the **CONTRADICTION-TABLE** re-cut of 2026-09-12.

Three variants, in the annex's order, rewritten in place under their own numbers and their own angle tags. Four faces per variant (the numbered line is face one; three `[face]` sub-rows follow). Twelve renderings. Ready to paste under the pool's bold heading in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`.

---

## THE ROWS

1. `[ledger]` Entered against {settlement}: works, and the town's own people to stand in them. A raid is the sort of trouble that arrangement answers; a company arriving with engines is not.
   - `[face]` The roll at {settlement} is kept by the muster it names, and the names on it belong to people with other work. Trouble that arrives in a hurry is what that answers; a siege train asks a different question.
   - `[face]` Walls stand at {settlement}, and the duty of standing in them falls to people with a living to make besides. A raiding party would be met that way; an army would not.
   - `[face]` Against raiders, the works at {settlement} and the people on them are an answer. Against a company that does this for its living, they are the same works and the same people.
2. `[street]` The town would turn out, and what the turning out costs is somebody's living.
   - `[face]` Whose turn it is to stand is a settled question in the town's own telling and an unsettled one door to door.
   - `[face]` Whatever a household sends to the muster is work it is not getting done at home, and the arrangement runs on that.
   - `[face]` In the town the word for it is turning out, never defense, and the difference is meant.
3. `[unfolding]` What stands at {settlement} would meet a raid and hold. Past that the arrangement is a roll of names and whoever answers to it, and the town leaves open what that comes to.
   - `[face]` A raid at {settlement} is the thing the muster is for. Anything that comes slower and in better order is the thing the town has no settled answer to, and the matter sits there.
   - `[face]` The works at {settlement} are held by people with other work waiting on them. What the arrangement is good for past a raid is not a settled matter in the town.
   - `[face]` Trouble that does not stay is what {settlement} is arranged for. Trouble that means to stay is a matter the record does not carry to its end.

---
--- NOTES

**REFUSALS: none.** All three variants were made lawful under the four floors. No variant is banked. No face was trimmed; the pool's count rises from three renderings to twelve, and every shipped claim that survived the skeleton's marking is carried by every face of its own variant.

**THE CARD, ONCE, FOR EVERY FACE.** Card clauses cited below by their printed names:
- **C-reads** — `invasionRowSituation(walls, garrison, militia)` via `INVASION_ROW_POOL` in `defenseStateProse.js`; the branch asserts **walls present · garrison FALSE · militia present**.
- **C-may-claim** — "that the reader selects the row `walls, citizen militia`, as a STANDING fact of the record."
- **C-bag** — `{settlement}` as a `proper` fill; FILLED at this block's call sites.
- **C-source** — `muster`, standing **LICENSED**; a citation of this holder is licensed where the provenance budget allows (`holderTable.js:272-288`, sole institution `Citizen militia`).
- **C-angle** — `ledger` · `street` · `unfolding`, one per numbered row, unchanged.
- **A14** — ADDENDUM 14: the record is silent and silence is permission. Cited where a claim rests on no field at all, which is where the flavour lives.
- **BH-capability** — the block header's own licence (`RECEIPT_POOLS_DOSSIER_STATE.md:2586-2591`): the causal clauses this block licenses are **capability** clauses, never historical ones.
- **SVC** — `institutionServices.js:835-838`, `Emergency defense`, `on: true, p: 1.0`, "armed citizen response to external threats and raids".
- **ROW** — the `Citizen militia`'s own printed description at every tier it is seated: *able-bodied residents*, *part-time service*, *all able-bodied citizens obligated to defend the town* (`institutionalCatalog.js:335-341`, `:867-873`, `:1340-1347`).

---

### VARIANT 1 · `[ledger]` — the pairing entered as an office would enter it

Claims carried by all four faces: **the works stand** · **the people who stand in them are the town's own** · **the pairing answers a raid** · **it would not answer a professional force with engines**. Dropped from the shipped row: the near-verbatim lift of the engine's own assess string (`threatAssessment.js:117`), and the colon-and-tail verdict shape.

**Face 1 — "Entered against {settlement}: works, and the town's own people to stand in them. A raid is the sort of trouble that arrangement answers; a company arriving with engines is not."** (30 words)
- *works* — **C-reads** (`walls.present === true`); the generic, not a material, so **F1-32** cannot fire on either end of the preimage.
- *the town's own people to stand in them* — **C-reads** (`militia.present === true`, `garrison.present === false`) and **ROW**.
- *A raid is the sort of trouble that arrangement answers* — **BH-capability** + **SVC**. A capability, never an outcome over attacks (**F2-05/c4**): no raid is asserted to have come.
- *a company arriving with engines is not* — a hypothetical attacker, predicated of nobody the record carries; the negative capability in the register card's licensed frame. It denies no rostered body (**F1-25** clear), only the pairing's reach.
- *Entered against* — the ledger's own idiom; **C-angle** `ledger`. **A14**.

**Face 2 — "The roll at {settlement} is kept by the muster it names, and the names on it belong to people with other work. Trouble that arrives in a hurry is what that answers; a siege train asks a different question."** (39 words)
- *The roll … is kept by the muster it names* — **C-source**, the pool's ONE grounded citation. §R-8: a roll cited as a record needs the holder, and the holder is the `Citizen militia` itself. No number on it (**F2-01** clear). This is the pool's single provenance move; the budget (§24, one citation per unit, rarely) is spent here and nowhere else in the twelve.
- *the names on it belong to people with other work* — **ROW**, *part-time service* and the service gloss "without full-time soldiery" (`institutionServices.js:837`).
- *Trouble that arrives in a hurry is what that answers* — **BH-capability** + **SVC** ("external threats and raids").
- *a siege train asks a different question* — the negative capability, left open rather than cashed as a verdict; no band word, so **F1-40** cannot fire.

**Face 3 — "Walls stand at {settlement}, and the duty of standing in them falls to people with a living to make besides. A raiding party would be met that way; an army would not."** (32 words)
- *Walls stand at {settlement}* — **C-reads**; `walls` is the bucket's own name and the engine's own word on this exact branch. No circuit, ring or perimeter is asserted, so **F1-07 / a1** is clear; no material, so **F1-32** is clear; no size, so **F2-01** is clear.
- *the duty of standing in them falls to people* — **ROW**, the obligation in the engine's own word. No totality over persons and no exemption is written, so the card's REFUSED COLUMNS are clear: the duty is stated, never its edges.
- *a living to make besides* — **ROW** (*part-time service*). **A14** for the household's side of it.
- *would be met … would not* — the licensed subjunctive; **BH-capability**. No prediction the pulse adjudicates (**F2-05**).

**Face 4 — "Against raiders, the works at {settlement} and the people on them are an answer. Against a company that does this for its living, they are the same works and the same people."** (32 words)
- *the works … and the people on them* — **C-reads**, both halves.
- *are an answer* — **BH-capability** + **SVC**.
- *they are the same works and the same people* — the reversal earns the second clause without a new claim: it restates nothing and asserts nothing beyond **C-reads**. The shortfall is shown, never rated, so no confident or settled word prints beside a WEAK or CRITICAL bar (**F1-40 / c1** clear).
- *a company that does this for its living* — the hypothetical professional; the key's own `garrison === false` is what makes the contrast true, and no absence is asserted on the roster (**F1-25**, **F1-30** clear).

---

### VARIANT 2 · `[street]` — the town at its own grain

⛔ **SLOT NOTE, load-bearing and obeyed:** this variant carries **NO slot**, so not one of its four faces names the town. Every face uses "the town" as a class word and never `{settlement}`.

Claims carried by all four faces: **the town's own people are what would answer** · **the answering is a duty owed by the people who live there** · **the town's own reckoning of what the answering amounts to**. Dropped from the shipped row: `the same as being defended` as a settled judgement, which prints beside an ADEQUATE or STRONG bar wherever a hireling hall, a charter hall, arcane deterrence or favourable terrain lifts the score (**F1-40**). Each face reaches the same landing from a STANDING CONDITION instead.

**Face 1 — "The town would turn out, and what the turning out costs is somebody's living."** (14 words)
- *would turn out* — **SVC** (`Emergency defense`, always on) in the town's own idiom, in the register card's licensed subjunctive. The skeleton's "turns worth keeping" is carried whole.
- *what the turning out costs is somebody's living* — **ROW** (*part-time service*: the people who answer are the people whose work it is not) and **A14** for the household's side. No count, no duration, no share, so **F2-01** is clear; the cost is named and its bearer is left open, so it is a hook and not a magnitude.
- The shortfall is implied by the cost and never rated, so the badge is not outrun.

**Face 2 — "Whose turn it is to stand is a settled question in the town's own telling and an unsettled one door to door."** (22 words)
- *Whose turn it is to stand* — **C-reads** (the militia standing) + **ROW** (the obligation). **A14**: the record is silent about how the duty is apportioned, and silence is permission.
- *a settled question … and an unsettled one door to door* — the register card's own licence to carry two accounts and settle neither. No party is named, no person is seated, no office the tier emits acts (**F3-06** clear).
- No magnitude, no rate, no date. Nothing here is denied by any field.

**Face 3 — "Whatever a household sends to the muster is work it is not getting done at home, and the arrangement runs on that."** (22 words)
- *the muster* — **C-reads** and **C-source**; the muster is safe as the class word and safe here as the standing body.
- *a household sends … work it is not getting done at home* — **ROW** (*part-time service*, *able-bodied residents*) and **A14**. The civic fact lands on a household without a headcount: no "a hand", no "a son", no number (**F2-01** clear).
- *the arrangement runs on that* — a standing condition, not an event, not a cost the pulse computed; **BH-capability**'s class. No exemption is written and no one is said to be excused, so the card's REFUSED COLUMNS are clear.

**Face 4 — "In the town the word for it is turning out, never defense, and the difference is meant."** (17 words)
- *the word for it is turning out* — **SVC** and **ROW**, reported as the town's own naming. This is the honest-posture landing the shipped row found, reached through the town's idiom rather than through a verdict on the arrangement, so it asserts nothing about the printed band (**F1-40 / c1** clear).
- *never defense* — a statement about the town's word, not about the town's safety; it denies no rostered body (**F1-25**) and rates no score.
- *the difference is meant* — **A14**; a collective disposition, unnamed and unpersonned.

---

### VARIANT 3 · `[unfolding]` — the matter standing open

Claims carried by all four faces: **the town has both halves standing** · **the arrangement would hold against one kind of thing** · **what it comes to past that is not settled**. Dropped from the shipped row: `is unlikely to hold` (**F2-01** in its word form and **F2-05** read forward, and the register card's own *nothing takes the future*), `nothing in hand changes that` (⛔ **F1-05 / F1-06 / F1-25 / F1-40** — the key reads three buckets and the roster carries seven, so the totality is denied by the page's own roster on every town carrying a hireling hall, a charter hall, a veteran's lodge or an arcane row), and the unreferenced `the first thing` / `the second`.

**Face 1 — "What stands at {settlement} would meet a raid and hold. Past that the arrangement is a roll of names and whoever answers to it, and the town leaves open what that comes to."** (33 words)
- *What stands at {settlement}* — **C-reads**, both halves without fixing either; **C-bag**. The frame the skeleton asked to keep.
- *would meet a raid and hold* — the licensed subjunctive; **BH-capability** + **SVC**.
- *a roll of names and whoever answers to it* — **C-source** (mentioned, not cited, so no holder condition arises) and **ROW**. An unnamed plural acts, outside the singular office the tier emits (**F3-06** clear).
- *the town leaves open what that comes to* — the OPEN QUESTION move, declarative, no interrogative, no forecast. The conversion floor 2 asks for: a standing condition in place of a fate.

**Face 2 — "A raid at {settlement} is the thing the muster is for. Anything that comes slower and in better order is the thing the town has no settled answer to, and the matter sits there."** (34 words)
- *the thing the muster is for* — **SVC** verbatim in sense ("armed citizen response to external threats and raids"), **C-reads**, **C-source**.
- *Anything that comes slower and in better order* — a hypothetical attacker; no professional body is asserted or denied on this town's roster.
- *the town has no settled answer to* — present possession, not a perfect tense and not a prediction (**F2-05** clear); a matter standing open, which is the `[unfolding]` stance's own work.
- *the matter sits there* — the close is short and does not summarise; nothing is resolved in the face's own last clause.

**Face 3 — "The works at {settlement} are held by people with other work waiting on them. What the arrangement is good for past a raid is not a settled matter in the town."** (31 words)
- *The works … are held by people* — **C-reads**, both halves; the generic works, so no material and no circuit (**F1-32**, **F1-07** clear).
- *with other work waiting on them* — **ROW** (*part-time service*). The absence of the professional half is written as a SHAPE and never as a denial (**c11**, **F1-25**, **F1-30** all clear: no face in this pool says there are no soldiers, no watch, no hall, no barracks).
- *is not a settled matter in the town* — the standing-open landing; no band word, no rate, no outcome.

**Face 4 — "Trouble that does not stay is what {settlement} is arranged for. Trouble that means to stay is a matter the record does not carry to its end."** (27 words)
- *Trouble that does not stay / Trouble that means to stay* — the two-edged idea the skeleton named as the cell's own meaning, carried without a probability and without a totality.
- *what {settlement} is arranged for* — **C-reads** + **BH-capability**; a standing arrangement, never a raising, a builder or a founding (**F2-03**, **a7** clear).
- *a matter the record does not carry to its end* — the ABSENCE move in its GAP class: a gap in the RECORD, never in the world, flat, not the opener, not adjacent to another absence. It leaves the town's one matter standing open, which the register card asks of every town.

---

### THE POOL-GRAIN CHECKS (the DULL verdict's own questions)

- **Twelve distinct openers**, first two words after slot normalisation: `Entered against` · `The roll` · `Walls stand` · `Against raiders` · `The town` · `Whose turn` · `Whatever a` · `In the` · `What stands` · `A raid` · `The works` · `Trouble that`. No face opens on `{settlement}` (**T-F8**). The three NUMBERED rows are `Entered against` · `The town` · `What stands`, pairwise distinct (**A11**).
- **Twelve distinct constructions**, not permutations of one sentence: a ledger entry with a colon list; a cited record with a consequence; a fronted subject with a subjunctive pair; a paired prepositional reversal; a short declarative with a cost clause; a free-relative subject with two unsettled accounts; a free-relative subject landing on the arrangement; a prepositional fronting with an appositive correction; a subjunctive with a standing-open tail; a predicate-nominative with a turn outward; a passive with a standing-open tail; a matched pair of fronted subjects landing on a record gap. No two faces swap the halves of one `A, and B` join.
- **The nouns spread**: works, walls, roll, names, muster, duty, household, home, living, turn, door, word, difference, arrangement, matter, record, raid, raiding party, army, company, engines, siege train, trouble, order. The shipped three renderings spent eleven abstractions and named nothing; the rewrite names the roll, the duty, the household, the turn and the record.
- **Sentence counts**: every face is one or two sentences (**A1**). Lengths run from fourteen words to thirty-nine, so no two faces of a variant share a length and a grammar.
- **Mechanical ratchets**: no em dash, no exclamation mark, no digit, no percent, no `which`-clause, no question mark, no address to the reader, anywhere in the twelve.
- **Slot sets**: variant 1 and variant 3 — every face carries `{settlement}`. Variant 2 — no face carries any slot, matching its parent (ARCH §2.5).
- **Siblings, neither restated nor contradicted** (arm A1): the `walls AND professional garrison` pool's *the wall and the men who belong to it*, the `walls with NO force` pool's *ladders and patience* and *a serious perimeter*, the `militia only` pool's *their own ground* and *stood in a line with anybody*, and the `force with NO walls` pool's *people rather than works* are all avoided by construction and by vocabulary.
- **The preimage** (floor 1's quantifier): no face fixes the material of the works, asserts a gate or a gatehouse, names a tier, spells a band, names the creature country, states the funding either way, seats a watch, asserts an absence on the roster, or says anything a siege, an occupation, a famine or a plague quarantine banner on the same dossier would make absurd. Every face prints true on an earthwork hamlet, a palisaded village, a stone-walled town and a citadel town alike.
- **The thread**: each two-sentence face carries a noun or an anaphor forward — *that arrangement* · *that answers* · *that way* · *the same works and the same people* · *Past that the arrangement* · *the thing* · *the arrangement* · *Trouble*. The pool is a SPINE and composes with zero modifiers today; every face reads as the first sentence of the unit and as the sentence a later modifier attaches behind.

*End of packet. Writer: Opus 5. Nothing outside this file was written; only `scripts/prose-licence-card.mjs` was executed, read-only, in the dock.*
