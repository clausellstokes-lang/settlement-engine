**strategic value HIGH**
1. `[ledger]` {settlement} holds something worth taking.
   - `[face]` In worth, {settlement} stands high.
   - `[face]` What {settlement} has is worth an attempt on it.
   - `[face]` The gain in taking {settlement} would not be small.
2. `[street]` What the town sits on is worth having.
   - `[face]` Seizing the town would repay the effort.
   - `[face]` The town is worth the taking.
   - `[face]` Reckoned for the taking, the town comes out worth it.
3. `[visitor]` A place worth wanting is what {settlement} is.
   - `[face]` The taking of {settlement} would be worth the doing.
   - `[face]` High worth attaches to {settlement}.
   - `[face]` On the scale of what a place is worth taking, {settlement} sits high.

--- NOTES

**THE CARD, AS READ.** Block DS-DEF-1 · role `spine` · key `strategic value HIGH`.
`reads: text(terrain) (via TERRAIN_PRIZE_OF in defenseStateProse.js)` · `predicate: === Coastal` ·
`bag: {band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED at this
block's call sites `{settlement}` · `relation: (a spine takes no relation)` · `seat/form: (not a
seat-taker) / sentence` · `move: (none declared)` · `angle: ledger street visitor` ·
`attach: (empty)` · `covert: no` · `source: (none) · standing SOURCE-UNRESOLVED` ·
`may claim: that (=== Coastal) holds, as a STANDING fact of the record` ·
`may NOT: a count, a cause, a season, a future, a standpoint, a second fact` ·
`audience: player (no mark)` · `REFUSED COLUMNS, always: a totality over persons; an exemption
from a duty; a named character and that character's fate; a theological claim`.

The card licenses exactly ONE standing fact: that this settlement's strategic-value reading
stands at HIGH — the site is worth taking. Every one of the twelve wordings below asserts that
one fact and nothing else. The rating word *high* is licensed by CL-7 (a rating word only where
a typed rating field holds it; `resourceAnalysis.strategicValue` is that field) and is written
as a word, never a digit (R-DA-16, A4).

**PER FACE — the clause that licenses each claim.** Each face makes exactly one claim; the
licensing clause is the card's `may claim` line (the pool's predicate as a STANDING fact of the
record), and the slot is the card's `bag`, FILLED `{settlement}`.

*Variant 1 `[ledger]` — the record's valuation. Slot set: `{settlement}` in all four (unchanged
from the shipped row).*
- `1` — "{settlement} holds something worth taking." · claim: the strategic-value reading stands
  HIGH → `may claim`. Slot `{settlement}` → `bag` (FILLED). Angle `[ledger]` → `angle`. Form
  sentence → `seat/form`. No source named → `source: (none)`, no citation licensed (arm A13).
- `[face]` "In worth, {settlement} stands high." · same single claim → `may claim`; the band word
  as a word → CL-7 + R-DA-16. Slot → `bag`.
- `[face]` "What {settlement} has is worth an attempt on it." · same single claim → `may claim`;
  "an attempt" names no actor and no event, so no HISTORY move is asserted (the block's
  PROVENANCE + FENCE: terrain and strategic value are standing facts with no recorded history).
- `[face]` "The gain in taking {settlement} would not be small." · same single claim → `may
  claim`; the subjunctive "would" is the licensed edge (A2 / R-DA-07), never a future indicative.

*Variant 2 `[street]` — the plain civic statement. Slot set: EMPTY in all four (unchanged from
the shipped row; T-F8 — a face's slot set must equal its parent's).*
- `2` — "What the town sits on is worth having." · claim: the strategic-value reading stands HIGH
  → `may claim`. No slot, matching the shipped row's own slot set.
- `[face]` "Seizing the town would repay the effort." · same single claim → `may claim`;
  subjunctive edge → A2.
- `[face]` "The town is worth the taking." · same single claim → `may claim`; the short line is
  R-DA-05's licensed rhythm (rhythm follows load, and the load here is one fact).
- `[face]` "Reckoned for the taking, the town comes out worth it." · same single claim → `may
  claim`; the implied reckoner is the compiling office itself (R-DA-01), not a cited holder, so
  no PROVENANCE move fires against `source: (none)`.

*Variant 3 `[visitor]` — the site as it stands to an arriver, with no perception asserted. Slot
set: `{settlement}` in all four (unchanged from the shipped row).*
- `3` — "A place worth wanting is what {settlement} is." · claim: the strategic-value reading
  stands HIGH → `may claim`. Slot → `bag`. The token does not open this variant, so R-DA-17's
  rule 10 (the settlement token opens at most one variant per pool) still holds with variant 1
  as the one opener, exactly as the shipped pool had it.
- `[face]` "The taking of {settlement} would be worth the doing." · same single claim → `may
  claim`; subjunctive edge → A2.
- `[face]` "High worth attaches to {settlement}." · same single claim → `may claim`; rating word
  → CL-7.
- `[face]` "On the scale of what a place is worth taking, {settlement} sits high." · same single
  claim → `may claim`; naming the rating SCALE is naming the typed field, not a second fact.

**WHAT THE REWRITE DROPPED, AND UNDER WHICH REFUSAL.** Dropping is the rewrite's purpose; the
shipped breach is the corpus's known state.
- v1 shipped "…and that is the whole of the defensive problem" — DROPPED: a MEANING move (no
  field holds what a fact means; MOVE-GRAMMAR §1.3, R-DA-03) and a totality ("the whole of").
- v1 shipped "the town must be worth more to keep than it is to seize" — DROPPED: a second fact
  and a cost comparison the card does not hold (`may NOT: a second fact`), in a deontic frame no
  field licenses.
- v2 shipped "The town is aware of what it sits on and aware that others are aware" — DROPPED:
  a belief frame and an assigned reaction (register card: no persona, no assigned reaction;
  R-DA-13's belief-frame floor), plus a second fact about persons elsewhere.
- v2 shipped "the awareness runs underneath a great deal of what it decides" — DROPPED: a CAUSE
  (`may NOT: a cause`) over a FEELING the engine holds no field for (MOVE-GRAMMAR §1.3).
- v3 shipped "A stranger understands within a day… and understands shortly afterwards" —
  DROPPED: a standpoint with an assigned reaction (`may NOT: a standpoint`) and two durations no
  field holds (`may NOT: a season`).
- v3 shipped "why anybody would want {settlement}" — DROPPED: a totality over persons (REFUSED
  COLUMNS, always).
- v3 shipped "why the town is so careful about who it offends" — DROPPED: a second fact about
  the town's policy, licensed by no field on this card.
- Nothing was added to any variant. No variant was removed, merged, reordered or renumbered; the
  three vids, their order and their angle tags stand as shipped (§22, never trim).

**REFUSALS.** None. All three variants were made lawful under the card; no variant is banked.

**FOUR CONSTRAINTS RECORDED FOR THE CHAIR (not refusals — limits the card imposes).**
1. **The pool can realise only level-1 grammar V1 (PRESENT).** V2–V8 each need a second licensing
   field (a structural-consequence field, a `none-exists` field, a named object, an institution
   row, an unresolved state field, event provenance, a `not-held` field); this card holds one
   read and declares no move, so MOVE-GRAMMAR §3.2's licensing filter removes every other member.
   The "min(k, |set|) distinct grammars, at least two per pool" direction is therefore
   unreachable here, and writing a second grammar would mean writing a member the block cannot
   license — which §3.2 forbids outright. Recorded, not cured.
2. **No face carries two sentences.** `may NOT: a second fact` and the absence of any declared
   MOVE leave the pool one fact to state, so the length band's upper reach is unavailable to it
   by construction. The variety here is vocabulary and rhythm across a 5-to-13-word spread, not
   sentence count.
3. **The card's `predicate` line prints only `=== Coastal`, but the map routes TWO terrains to
   this key.** `TERRAIN_PRIZE_OF` (`src/domain/display/stateProse/defenseStateProse.js:655-659`)
   maps `Coastal` AND `Mountain` to `strategic value HIGH`. No face names a terrain, a coast, a
   route or a height of ground: a face saying "the coast" would be false on every Mountain town
   and would breach C-sibling coherence in structural fact. The card's narrower print is flagged
   so the chair can decide whether the card generator should emit the full predicate set.
4. **The card's `may claim` line renders as "that `js)` (=== Coastal) holds"** — a truncated path
   fragment from the read string, not a claimable object. It was read here as the pool's own
   predicate (the strategic-value reading stands HIGH). If the chair reads it otherwise, this
   packet's twelve wordings all move together, because they all assert that one fact.

**SIBLING DISTANCE (arms A1 and A11).** The block's sibling spines are `readiness
STRONG/ADEQUATE/WEAK/CRITICAL`, `terrain FAVOURABLE to the defender`, `terrain EXPOSED` and
`strategic value LOW`. No wording here restates or contradicts one: nothing is said about the
walls, the watch, the works, the approach, the ground's shape or the town's capacity to hold.
Three phrases in the shipped siblings were deliberately avoided so a reader who reads many towns
does not hear a formula — "worth an army's season" and "not a prize" (`strategic value LOW`),
"worth the price of trying" (`readiness STRONG`) and the weighing idiom of `terrain FAVOURABLE`.
The word *prize* is not used at all, because the LOW sibling's canonical line is its negation.

**THE THREAD (§1.4.1).** This pool is a SPINE and sits first in every composed unit, so it hands
the thread forward rather than picking one up. Each wording leaves a modifier two nouns to carry:
the settlement itself, and what it is worth. No wording ends on a construction that closes the
passage off, and the closes vary in kind (R-DA-04): an object close ("an attempt on it", "the
effort", "the taking"), a condition close ("stands high", "would not be small", "sits high",
"worth it"), and a name close ("what {settlement} is", "attaches to {settlement}").

**WALLS CHECKED ON ALL TWELVE.** No em dash · no exclamation · no question · no digit or percent ·
no which-clause · no "I" or "you" · no citation and no named record holder (`source: (none)`,
arm A13) · no future indicative (every edge subjunctive) · no figure, no sense verb on an
abstraction, no inanimate acting with intent (R-DA-11) · no totality over persons · no named
character, no fate, no deity · one bracketed angle tag per numbered row and no `[plain]` marker
anywhere · every face's slot set equal to its parent's · no face sub-row opening on the
`proper`-typed `{settlement}` slot (T-F8) · the twelve openings all distinct.
