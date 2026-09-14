**strategic value LOW**
1. `[counterforce]` Nothing at {settlement} is worth the taking.
   - `[face]` No prize is to be had at {settlement}.
   - `[face]` As plunder {settlement} comes to nothing.
   - `[face]` What could be seized at {settlement} is not worth the seizing.
2. `[ledger]` What {settlement} holds does not make it a prize.
   - `[face]` The worth of taking {settlement} is nothing.
   - `[face]` Little at {settlement} would repay the taking.
   - `[face]` Taking {settlement} would gain nothing.
3. `[street]` The town has nothing in it worth taking.
   - `[face]` The pickings in the town would be slim.
   - `[face]` Anything carried out of the town would not be worth the carrying.
   - `[face]` Nothing worth taking away is kept in the town.

--- NOTES

**THE CARD, AS READ.** Block DS-DEF-1 · role `spine` · key `strategic value LOW`.
`reads: text(terrain) (via TERRAIN_PRIZE_OF in defenseStateProse.js)` · `predicate: === Forest` ·
`bag: {band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED at this
block's call sites `{settlement}` · `relation: (a spine takes no relation)` · `seat/form: (not a
seat-taker) / sentence` · `move: (none declared)` · `angle: counterforce ledger street` ·
`attach: (empty: a spine takes no attach set)` · `covert: no` · `source: (none) · standing
SOURCE-UNRESOLVED` (no citation is licensed; a face naming a record holder is refused by arm
A13) · `may claim: that (=== Forest) holds, as a STANDING fact of the record` · `may NOT: a
count, a cause, a season, a future, a standpoint, a second fact` · `audience: player (no mark)` ·
`REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character
and that character's fate; a theological claim`.

The card licenses exactly ONE standing fact: that this settlement's strategic-value reading
stands at LOW — the site is not worth taking. Every one of the twelve wordings below asserts
that one fact and nothing else. Each is bounded to the PRIZE sense in its own words (*the
taking*, *a prize*, *plunder*, *the seizing*, *the pickings*, *carrying away*) rather than left
as a bare statement of worth, because an unbounded "worth nothing" would read as a claim about
the town's wealth and would collide with the economy slice's own fields (C-sibling coherence in
structural fact).

**PER FACE — the clause that licenses each claim.** Each face makes exactly one claim; the
licensing clause is the card's `may claim` line (the pool's predicate as a STANDING fact of the
record), and the slot is the card's `bag`, FILLED `{settlement}`.

*Variant 1 `[counterforce]` — the cap stated plainly, as a negation. Slot set: `{settlement}` in
all four (unchanged from the shipped row).*
- `1` — "Nothing at {settlement} is worth the taking." · claim: the strategic-value reading
  stands LOW → `may claim`. Slot `{settlement}` → `bag` (FILLED). Angle `[counterforce]` →
  `angle`. Form sentence → `seat/form`. No source named → `source: (none)`, arm A13.
- `[face]` "No prize is to be had at {settlement}." · same single claim → `may claim`; *prize*
  is the pool key's own predicate word, not a named object in the town.
- `[face]` "As plunder {settlement} comes to nothing." · same single claim → `may claim`; the
  fronted *as plunder* is the frame that bounds the worth to the prize sense, not a second fact.
- `[face]` "What could be seized at {settlement} is not worth the seizing." · same single claim
  → `may claim`; *could be seized* is the subjunctive edge (A2 / R-DA-07), never a future
  indicative and never an event that happened.

*Variant 2 `[ledger]` — the flat valuation, in the clerk's diction. Slot set: `{settlement}` in
all four (unchanged from the shipped row).*
- `2` — "What {settlement} holds does not make it a prize." · claim: the strategic-value reading
  stands LOW → `may claim`. Slot → `bag`. The verb is predicative, not causal: it states what
  the holding is not, and asserts no cause (`may NOT: a cause`).
- `[face]` "The worth of taking {settlement} is nothing." · same single claim → `may claim`; a
  magnitude stated as a word, never a digit (R-DA-16, A4).
- `[face]` "Little at {settlement} would repay the taking." · same single claim → `may claim`;
  subjunctive edge → A2.
- `[face]` "Taking {settlement} would gain nothing." · same single claim → `may claim`; the
  short line is R-DA-05's licensed rhythm — rhythm follows load, and the load here is one fact.

*Variant 3 `[street]` — the town's own idiom for the same fact, with no talk and no knowledge
asserted. Slot set: EMPTY in all four (unchanged from the shipped row; T-F8 — a face's slot set
must equal its parent's).*
- `3` — "The town has nothing in it worth taking." · claim: the strategic-value reading stands
  LOW → `may claim`. No slot, matching the shipped row's own slot set.
- `[face]` "The pickings in the town would be slim." · same single claim → `may claim`; *slim*
  is a rating word on the pickings, licensed by CL-7 because `resourceAnalysis.strategicValue`
  is a typed rating field, and it attaches to what could be taken, never to the place (R-DA-10's
  evaluative-adjective floor holds).
- `[face]` "Anything carried out of the town would not be worth the carrying." · same single
  claim → `may claim`; subjunctive edge → A2. The long line carries the pool's rhythm spread
  (R-DA-05; the pool now runs five to twelve words).
- `[face]` "Nothing worth taking away is kept in the town." · same single claim → `may claim`;
  the passive names no keeper, so no PROVENANCE move fires against `source: (none)`.

**HOW THE `[street]` ANGLE IS REALISED, AND WHY IT CHANGED SHAPE.** The palette defines
`[street]` as *the town's own talk about its condition*. The card refuses a standpoint, and
R-DA-13's belief-frame floor is zero, so the angle is realised here as DICTION — the plain
ordinary nouns and verbs a town would use (*pickings*, *carried out*, *taking away*) — and never
as an attribution of talk, knowledge or feeling to the town. The tag is inherited unchanged, as
the rewrite rules require.

**WHAT THE REWRITE DROPPED, AND UNDER WHICH REFUSAL.** Dropping is the rewrite's purpose; the
shipped breach is the corpus's known state.
- v1 shipped "worth an army's season" — DROPPED: a duration no field holds (`may NOT: a season`)
  and an actor the block does not carry (MOVE-GRAMMAR §1.2 row 1: PRESENT may not carry an actor
  the field does not hold).
- v1 shipped "the town's best defense is that plain fact rather than anything on its walls" —
  DROPPED: a second fact (`may NOT: a second fact`), a superlative the field does not hold, and
  a claim about the walls, which is `readiness`'s and `DS-DEF-2`'s field, not this card's. It is
  also a MEANING move (no field holds what a fact means; MOVE-GRAMMAR §1.3).
- v2 shipped "What it can field matters less here than what it does not have" — DROPPED: a
  second fact about the town's fielded force (the readiness lens's field) and a comparison
  between two fields this card does not join (R-DA-11: a comparison is licensed only by the two
  fields it compares).
- v2 shipped "that anyone would come for" — DROPPED: a totality over persons (REFUSED COLUMNS,
  always; persons are never a closed column, CLERK-LAWS §3 corollary 3).
- v3 shipped "The town knows it is not worth taking" — the KNOWING is DROPPED and the fact kept:
  a belief frame over persons (`may NOT: a standpoint`; R-DA-13's belief-frame floor; the
  register card's no assigned reaction).
- v3 shipped "has made a kind of peace with the knowledge" — DROPPED: a FEELING, which is a move
  that does not exist anywhere in the estate (MOVE-GRAMMAR §1.3).
- v3 shipped "which is not the same as being comfortable with it" — DROPPED twice over: a
  `, which` tail (wall 6; R-DA-03) and a second evaluative claim about the town's temper.
- Nothing was added to any variant. No variant was removed, merged, reordered or renumbered; the
  three vids, their order and their angle tags stand as shipped (§22, never trim).

**REFUSALS.** None. All three variants were made lawful under the card; no variant is banked.

**FOUR CONSTRAINTS RECORDED FOR THE CHAIR (not refusals — limits the card imposes).**
1. **The pool can realise only level-1 grammar V1 (PRESENT).** V2–V8 each need a second
   licensing field (a structural-consequence field, a `none-exists` field, a named object, an
   institution row, an unresolved state field, event provenance, a `not-held` field). This card
   holds one read and declares no move, so MOVE-GRAMMAR §3.2's licensing filter removes every
   other member, and writing one would mean writing a member the block cannot license — which
   §3.2 forbids outright. The "min(k, |set|) distinct grammars, at least two per pool" direction
   is unreachable here. Recorded, not cured. (The same constraint was recorded on the sibling
   `strategic value HIGH` packet; it is the pool family's, not this pool's alone.)
2. **No face carries two sentences.** `may NOT: a second fact` and the absence of any declared
   MOVE leave the pool one fact to state, so A1's two-sentence reach is unavailable to it by
   construction. The variety here is vocabulary and rhythm across a five-to-twelve-word spread,
   not sentence count.
3. **No row of this pool now opens on the `{settlement}` token; the shipped variant 2 did.**
   T-F8 refuses a sentence face opening on a `proper`-typed slot, and the §2.5 seam contract
   makes the same detection rule for any sentence-form row, so the token was moved off the head
   of every row rather than only off the face sub-rows. R-DA-17's wall 10 (the token opens at
   most one variant per pool) is satisfied at zero, which is inside the wall but is a change to
   the pool's opener profile and is flagged rather than assumed.
4. **The card's `may claim` line renders as "that `js)` (=== Forest) holds"** — a truncated path
   fragment from the read string, not a claimable object. It was read here as the pool's own
   predicate (the strategic-value reading stands LOW; `TERRAIN_PRIZE_OF` at
   `src/domain/display/stateProse/defenseStateProse.js:655-659` maps `Forest` to this key and no
   other terrain does, so the card's printed predicate is complete for this pool, unlike the
   HIGH sibling's). If the chair reads the line otherwise, all twelve wordings move together,
   because they all assert that one fact.

**SIBLING DISTANCE (arms A1 and A11).** The block's sibling spines are `readiness
STRONG/ADEQUATE/WEAK/CRITICAL`, `terrain FAVOURABLE to the defender`, `terrain EXPOSED` and
`strategic value HIGH`. No wording here restates or contradicts one: nothing is said about the
walls, the watch, the works, the approach, the ground or the town's capacity to hold. **The one
live composition risk is named:** `Forest` routes to BOTH this key and `terrain FAVOURABLE to
the defender` (`TERRAIN_DEFENCE_OF`, same file), so a forest town can carry both readings on one
page — which is why not one of these twelve wordings says the place would be easy to take, hard
to take, or anything at all about the ground. The `readiness STRONG` sibling's "not worth the
price of trying" was deliberately avoided, as was the HIGH sibling's whole valuation vocabulary
except where a negation is the only honest form of it; *repay* recurs once against the HIGH
packet's "repay the effort", and the two keys are mutually exclusive by construction, so they
never meet on a page.

**THE THREAD (§1.4.1).** This pool is a SPINE and sits first in every composed unit, so it hands
the thread forward rather than picking one up. Each wording leaves a following modifier a noun
to carry: the settlement itself in the first eight, the town in the last four, and in every case
the thing it is worth. The closes vary in kind (R-DA-04): an object close (*the taking*, *the
seizing*, *the carrying*), an absence close (*comes to nothing*, *is nothing*, *would gain
nothing*), a condition close (*would be slim*, *does not make it a prize*), and a place close
(*at {settlement}*, *in the town*). No wording closes on a pronoun.

**WALLS CHECKED ON ALL TWELVE.** No em dash · no exclamation · no question · no digit or percent ·
no which-clause · no "I" or "you" · no citation and no named record holder (`source: (none)`,
arm A13) · no future indicative, every edge subjunctive · no expletive opener (R-DA-07) · no
figure, no sense verb on an abstraction, nothing inanimate acting with intent (R-DA-11) · no
totality over persons · no named character, no fate, no deity · one bracketed angle tag per
numbered row and no `[plain]` marker anywhere · every face's slot set equal to its parent's · no
row opening on the `proper`-typed `{settlement}` slot (T-F8) · the twelve openings all distinct
in their first two words (A11).
