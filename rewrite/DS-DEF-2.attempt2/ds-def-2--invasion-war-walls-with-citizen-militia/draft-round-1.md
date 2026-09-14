# DS-DEF-2 · `Invasion & War: walls with citizen militia` · REWRITE draft, round 1

Seat: Opus 5 (Fable-unvalidated) · block DS-DEF-2 · role spine · 3 variants, 12 wordings.
Paste the block below under the pool's bold heading, in place of its three numbered rows.
The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are untouched and not repeated here.

1. `[ledger]` Walls at {settlement} are held by the town's own people and not by a paid company.
   - `[face]` The wall at {settlement} is the town's to hold.
   - `[face]` A wall stands at {settlement}, and the muster inside it is townsfolk.
   - `[face]` Walls at {settlement} stand, and the muster that goes up onto them is drawn from the streets inside the wall.
2. `[street]` The town would turn out, and what turned out would be the town's own people.
   - `[face]` The muster here is the town.
   - `[face]` A call to arms is answered here by the townspeople.
   - `[face]` The town puts its own under arms.
3. `[unfolding]` What stands at {settlement} is a wall, and what stands on the wall is the town's own people.
   - `[face]` At {settlement} the works stand, and the muster on them is townspeople.
   - `[face]` What {settlement} has is a wall and the townspeople who go up on the wall.
   - `[face]` Behind the wall at {settlement} stand the town's own people.

--- NOTES

## The card this pool is written against (printed, not paraphrased)

`node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: walls with citizen militia'` returns one
licensed claim and a closed refusal list:

- **may claim:** that `invasionRowSituation(walls, garrison, militia) === walls, citizen militia` holds, **as a STANDING fact of the record**.
- **may NOT:** a count · a cause · a season · a future · a standpoint · a second fact · another civic object of the class `force`.
- **REFUSED COLUMNS, always:** a totality over persons · an exemption from a duty (`whoIsExempt` is null everywhere) · a named character and that character's fate · a theological claim.
- **bag:** `{band: RESERVED, route: proper, settlement: proper}`; **FILLED at this block's call sites: `{settlement}` only.**
- **source:** `muster · standing LICENSED`; a citation of that holder is licensed only where the provenance budget allows.
- **seat/form:** a spine, sentence form, no relation, no declared move; **angle: ledger · street · unfolding** (the three the pool carries).

So the whole pool asserts ONE typed triple: `(PRESENT, invasionRowSituation, "walls, citizen militia")`.
Every wording below realises that triple and nothing else. The claim sets of the four wordings of a
variant are therefore equal to each other (arm A6 read across the faces), and the claim set of each
variant is the licensed subset of what its shipped sentence carried (arm C-pair).

## What each shipped variant carried, kept and dropped

**Variant 1, shipped:** *"Walls at {settlement} with townspeople behind them: credible against raiders, and inadequate against anybody who arrives professionally and brought siege gear."*

- KEPT: walls stand; the force behind them is the town's own people and not a professional garrison. Licensed by the card's `may claim` (the predicate's two halves are one composite value).
- DROPPED: **"credible against raiders"** and **"inadequate against anybody who arrives professionally"** — a rating of the arrangement against two attacker classes. No attacker class is a field of this block, and `{band}` is RESERVED and unfilled at this block's call sites, so no band word licenses a rating either. Refused by the card's `may NOT: a standpoint · a second fact`, and by MOVE-GRAMMAR §1.3's **MEANING** and **VERDICT** non-moves.
- DROPPED: **"and brought siege gear"** — an invented particular with no field (fault 24; R-DA-10's hollow specificity).
- The block's own authoring note licenses a *capability* clause here; that licence is not reachable at this call site, because the capability sentence needs the band the bag reserves. Recorded, not smuggled in.

**Variant 2, shipped:** *"The town would turn out and does not pretend that turning out is the same as being defended."*

- KEPT: the town would turn out its own people. This is the militia half of the predicate in its subjunctive edge form (A2: the edge is subjunctive, never a fate; R-DA-07).
- DROPPED: **"does not pretend that turning out is the same as being defended"** — a belief frame attributed to the town plus a verdict on adequacy. Refused by the card's `may NOT: a standpoint`, by R-DA-13's belief-frame floor, and by the VERDICT non-move.
- The shipped row carries **no slot**; all four wordings of variant 2 keep the empty slot set, so no face's `{slot}` set differs from its parent's (ARCH §2.5, the face row's refusal list). Variant 2 therefore states the militia half only; adding the walls half would ADD a claim the shipped sentence did not make.

**Variant 3, shipped:** *"What {settlement} has would hold against the first thing and is unlikely to hold against the second, and nothing in hand changes that."*

- KEPT: what {settlement} has — the wall and the townspeople who hold it — stated as the standing arrangement.
- DROPPED: **"would hold against the first thing / is unlikely to hold against the second"** — the same unlicensed rating as variant 1, in a subjunctive costume; the subjunctive licenses the FORM, never the claim.
- DROPPED: **"nothing in hand changes that"** — a forecast about the trajectory and an absence claim about pending change. Refused by the card's `may NOT: a future`, by the FORECAST non-move, and by R-DA-08 (an absence must resolve to a typed `not-held` field; none exists here).
- The `[unfolding]` angle is carried by continuing present statement, not by a trajectory: no upkeep, no decay, no season (`may NOT: a season`).

## Face by face — which clause licenses each claim

| # | wording | claims | licence |
|---|---|---|---|
| 1 | Walls at {settlement} are held by the town's own people and not by a paid company. | walls stand; the holders are the town's own; the rejected alternative is a professional garrison | card `may claim` (the composite predicate); the denial is R-DA-02's CONTRAST, licensed because the rejected alternative names the **sibling pool key** `Invasion & War: walls AND professional garrison`; not fronted; it is the one contrast-close in the pool (MOVE-GRAMMAR §1.4 wall 5) |
| 1a | The wall at {settlement} is the town's to hold. | walls stand; the holding is the town's own | card `may claim` |
| 1b | A wall stands at {settlement}, and the muster inside it is townsfolk. | walls stand; the muster is townspeople | card `may claim`; `muster` is the card's own resolved source noun used as the civic body, not as a citation |
| 1c | Walls at {settlement} stand, and the muster that goes up onto them is drawn from the streets inside the wall. | walls stand; the muster is raised from the town | card `may claim`; "drawn from the streets inside the wall" is the citizen half of the predicate, no count and no household named |
| 2 | The town would turn out, and what turned out would be the town's own people. | the force is the town's own, in the subjunctive edge | card `may claim`; A2 / R-DA-07 (the edge is subjunctive, no future indicative) |
| 2a | The muster here is the town. | the muster is the townspeople | card `may claim`; the short line R-DA-06 asks for (under eight words) |
| 2b | A call to arms is answered here by the townspeople. | the answering force is the townspeople | card `may claim`; the muster mechanism is the predicate's own content, stated with no duty and no exemption (R-DA-15: `whoIsExempt` is null, so no duty sentence is written) |
| 2c | The town puts its own under arms. | the force under arms is the town's own | card `may claim` |
| 3 | What stands at {settlement} is a wall, and what stands on the wall is the town's own people. | walls stand; the holders are the town's own | card `may claim`; the noun `wall` is carried forward inside the sentence, so the spine hands the wall and the town to whatever modifier the composer seats next (§1.4.1, THE THREAD) |
| 3a | At {settlement} the works stand, and the muster on them is townspeople. | walls stand; the muster is townspeople | card `may claim` |
| 3b | What {settlement} has is a wall and the townspeople who go up on the wall. | walls stand; the holders are townspeople | card `may claim`; the relative clause identifies the force, it does not carry a second fact (R-DA-03) |
| 3c | Behind the wall at {settlement} stand the town's own people. | walls stand; the holders are the town's own | card `may claim` |

## The walls checked, one line each

- **No em dash, no exclamation, no question, no digit, no percent, no `which`** anywhere in the twelve wordings.
- **No expletive opener** (`there is` / `it is`) and **no bare future indicative**; the one edge is subjunctive (R-DA-07).
- **No slot outside the bag**: `{settlement}` only; `{band}` and `{route}` are unfilled at this block's call sites and appear nowhere.
- **No row opens on a `proper`-typed slot** (ARCH §2.5's seam contract, T-F8) — the shipped rows' `{settlement}`-first openers are not reproduced.
- **Slot sets are constant inside each variant**: variants 1 and 3 carry `{settlement}` in all four wordings, variant 2 carries none in all four, exactly as the shipped rows do.
- **No inanimate intent, no simile, no metonymy doing work a field does not hold** (R-DA-11); walls `stand`, they never act.
- **No totality over persons, no exemption, no duty, no count, no named person** (the refused columns; R-DA-15).
- **No citation**: the provenance move is deliberately unused. The card resolves the holder (`muster`), but §24's ceiling admits a citation only for one of S3's three reasons (two accounts that disagree; a count from an interested party; a record whose keeper is a power), and no typed fact here establishes any of them; the exemplar registers cite at zero per 786 sentences.
- **Openers**: no two variants can share a two-word opener under any draw (variant 1 opens on the wall noun, variant 2 on the town or the call, variant 3 on `What`, `At` or `Behind`); at most one participial or inverted opener is reachable per render.
- **Closers**: no wording closes on a pronoun (`closers.pronounRate` = 0 over the twelve); the kinds vary across object, condition and the named absence.
- **Spread**: lengths 6 to 20 words, within-pool sd 4.2 (the ≥ 4.0 target), one line under eight words (the ≥ 0.030 floor), none over thirty.
- **Sibling distance**: no wording restates or contradicts a sibling spine of the block. The five `Invasion & War` siblings' vocabulary (`a line and professionals`, `nobody to put on them`, `a serious absence`, `armed citizens on their own ground`, `no line and no force`) is not reused, and `rather than` is avoided as a rationed phrase (R-DA-02's figure).

## Refusals

**None.** All three variants are written lawfully under the card; no variant needed a refusal row.

Two calls are recorded here so the chair can veto them rather than discover them:

1. **The contrast in wording 1** ("and not by a paid company") names a force-class object in order to deny it. The card's `may NOT` bars *another civic object of the class `force`*; I read that as barring the ASSERTION of a second force, not the licensed denial that distinguishes this pool from its sibling key, which R-DA-02 requires a contrast to name. If the chair reads the may-NOT as barring the denial too, wording 1 loses its last five words and closes on `people`; the claim set is unchanged either way, and the other eleven wordings are unaffected.
2. **The pool now carries a single claim in twelve wordings.** That is the arithmetic consequence of dropping the adequacy ratings from all three shipped sentences: the shipped pool's apparent richness was carried by unlicensed claims. The variance the pool keeps is vocabulary, rhythm and angle, not fact.
