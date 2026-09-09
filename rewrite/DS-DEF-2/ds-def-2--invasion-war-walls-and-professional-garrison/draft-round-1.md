Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2 · pool key `Invasion & War`: walls AND professional garrison · role spine · draft round 1.
The three variant rows below are the COMPLETE replacement for the pool's variant rows: same vids, same order, same angle tags, none added, none removed, none merged. Four wordings per variant (the numbered line is the first wording; the three `[face]` sub-rows are the other three), claim-equal to each other, no paraphrase of a sibling. The pool's typed lines are untouched and not repeated here.

1. `[ledger]` {settlement} is a walled town, and the garrison behind the wall soldiers by trade.
   - `[face]` A wall stands at {settlement}, and professionals hold it.
   - `[face]` Walls at {settlement} are in place, and the garrison on them is a professional force.
   - `[face]` The perimeter at {settlement} is held, and held by professionals.

2. `[visitor]` A stranger reaching {settlement} finds the wall standing and professionals posted along it.
   - `[face]` A traveller sees a wall at {settlement}, and sees the regulars who keep it.
   - `[face]` Newcomers to {settlement} meet a wall, and a standing garrison keeping it.
   - `[face]` Whoever comes to {settlement} comes to a wall, and to the professional garrison that holds it.

3. `[street]` The town keeps a wall and keeps professionals on it.
   - `[face]` Walls stand at the town, and a professional garrison holds them.
   - `[face]` Behind the wall stand soldiers who keep no other trade.
   - `[face]` A garrison of regulars holds the wall the town keeps.

--- NOTES

**The card this pool is written under (printed, `node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: walls AND professional garrison'`).**
`reads` `invasionRowSituation(walls, garrison, militia)` · `predicate` === walls, professional garrison · `bag` {band: RESERVED, route: proper, settlement: proper}, FILLED at this block's call sites: {settlement} · relation: none (a spine takes no relation) · form: sentence · move: none declared · angle: `ledger street visitor` · source: muster, standing LICENSED · **may claim:** that the situation (=== walls, professional garrison) holds, as a STANDING fact of the record · **may NOT:** a count, a cause, a season, a future, a standpoint, a second fact, another civic object of the class `force` · audience: player · refused always: a totality over persons, an exemption from a duty, a named character and that character's fate, a theological claim.

**The claim every one of the twelve wordings carries, and the only one.**
CLAIM-1 (the wall half): a wall stands at this settlement. CLAIM-2 (the force half): the force behind it is a professional garrison. Both are the two halves of the single licensed predicate value and are licensed by the card's `may claim` line and by nothing else. No wording asserts anything beyond CLAIM-1 + CLAIM-2. The `{settlement}` token in variants 1 and 2 is licensed by the card's bag line (`settlement: proper`, FILLED at this block's call sites); variant 3 carries no slot, exactly as its shipped row does, so its four wordings carry none either (a face's slot set must equal its parent's — ARCH §2.5, the face row's refusal column).

**Face-by-face licence.**

*Variant 1 `[ledger]` — the angle is licensed by the card's `angle: ledger` term.*
- line 1 — "is a walled town" = CLAIM-1 (`may claim`); "the garrison behind the wall soldiers by trade" = CLAIM-2, the predicate word *professional* rendered as the trade the garrison follows (`may claim`); the position of the garrison behind the wall is the situation key's own sense, not a second fact (see THE JOIN below).
- face a — "A wall stands at {settlement}" = CLAIM-1; "professionals hold it" = CLAIM-2. Slot by the bag line.
- face b — "Walls at {settlement} are in place" = CLAIM-1; "the garrison on them is a professional force" = CLAIM-2.
- face c — "The perimeter at {settlement} is held" = CLAIM-1 with the holding of CLAIM-2; "held by professionals" = CLAIM-2.

*Variant 2 `[visitor]` — the angle is licensed by the card's `angle: visitor` term.*
- line 2 — "finds the wall standing" = CLAIM-1; "professionals posted along it" = CLAIM-2. The arriving figure is carried by the ANGLE, not by a PERSON move: no role field is read, no name, no interior, no reaction and no fate is asserted (product scope; MOVE-GRAMMAR §1.2 row 3 and §1.3 FEELING).
- face a — "sees a wall at {settlement}" = CLAIM-1; "the regulars who keep it" = CLAIM-2 (*regulars* = the predicate's professional force).
- face b — "meet a wall" = CLAIM-1; "a standing garrison keeping it" = CLAIM-2 (*standing* = kept permanently, the predicate's professional half).
- face c — "comes to a wall" = CLAIM-1; "the professional garrison that holds it" = CLAIM-2.

*Variant 3 `[street]` — the angle is licensed by the card's `angle: street` term.*
- line 3 — "keeps a wall" = CLAIM-1; "keeps professionals on it" = CLAIM-2.
- face a — "Walls stand at the town" = CLAIM-1; "a professional garrison holds them" = CLAIM-2.
- face b — "Behind the wall" = CLAIM-1; "soldiers who keep no other trade" = CLAIM-2 (the trade clause is the predicate word, not a second fact about employment or pay).
- face c — "the wall the town keeps" = CLAIM-1; "A garrison of regulars holds" = CLAIM-2.

**THE JOIN, declared.** Several wordings say that the garrison holds, keeps or stands on the wall. That join is read as the situation key's own sense (`invasionRowSituation` returns ONE value naming both institutions in one defensive situation), not as a second typed fact and not as a capability claim about what the arrangement can withstand. Every shipped wording of this pool made the same join. If the chair reads the join as a second fact, the lawful cure is to state the two halves in parataxis (face 1b and face 3a already do: "Walls … are in place, and the garrison on them is a professional force"), and the packet needs no new wording.

**Claims DROPPED, per variant (the rewrite's purpose; the shipped breach is the corpus's known state).**
- Variant 1 dropped: (a) "which is real deterrence against raiding and against a conventional assault" — a which-tail (wall 6 of MOVE-GRAMMAR §1.4; R-DA-03) carrying a second fact and a capability verdict the card refuses (`may NOT: a second fact`, `a cause`); (b) "it is not a posture rated for a long siege without stores behind it" — a second fact, an edge about an event that has not happened (`may NOT: a future`), and a claim about stores, a civic object this card does not read.
- Variant 2 dropped: (a) "the two things that matter" — an evaluation, a MEANING move that no field holds (§1.3); (b) "(the wall and the men who belong to it)" — the gendered assertion about the garrison's persons (C3 arm a, the shipped gendered-line class), no `gender` field being read here; (c) "revises what an attempt would cost" — an interior act assigned to a person plus a forecast of an event (`may NOT: a standpoint`, `a future`; NL-6 state never fate).
- Variant 3 dropped: (a) "The town believes" — a belief frame and a totality over persons (the card's always-refused column); (b) "it could be held" — an edge about an event the record does not hold (`may NOT: a future`); (c) "founded on something rather than on hope" — a contrast whose rejected alternative names no sibling pool key and no sibling band (R-DA-02; wall 5 of §1.4), and an evaluation of the town's grounds.

**DECLARED CLAIM-SET JUDGMENT on variant 3 (for the refuters and the chair; not a refusal).** The shipped variant 3 asserted the pool's licensed fact only by implication — its surface carried a belief, a modal edge and an unlicensed contrast, and named neither the wall nor the garrison. Stripped of the unlicensed claims, nothing would have remained, and a spine row that asserts nothing fails the wall that every sentence is licensed by a typed field (§9, ruling 5). The rewritten variant 3 therefore states the pool's own predicate — CLAIM-1 + CLAIM-2, the same claim set as its two siblings — rather than being banked empty. This is recorded as an addition ONLY against the old surface, never against the card: the claim is the row's own licensing predicate, and the four faces of variant 3 are claim-equal to each other (arm A6 reads across the faces). If the chair rules that the licensed claim set of the old sentence was empty, variant 3 is a refusal row and the four wordings above stand in the annex as its refusal text; nothing is trimmed either way (§22).

**The PROVENANCE move, licensed and deliberately not spent.** The card licenses a citation of the muster ("`source: muster · standing LICENSED` … where the provenance budget allows"). No wording cites it. Three grounds: the budget is a ceiling of ONE citation per unit and only for one of S3's three reasons, none of which holds here (there are no two disagreeing accounts, no count is licensed at all, and the office does not cite its own books — MOVE-GRAMMAR §4.4.3); the exemplar registers with raw text cite at zero per 786 sentences, so a citation here would be the habit a refuter names (Part B §24); and a citation is TWO licensed claims, so spending it would ADD a claim to every old sentence, which the rewrite forbids.

**Walls checked on every wording.** No em dash. No exclamation. No digit and no numeral of any kind, and no percent. No `which`-clause (only restrictive `that`, `who` and `whose`-free relatives carrying the same claim). No question, no second person, no address to the reader, no "I". No figure, no simile, no sense verb on an abstraction, no intent given to an inanimate thing. No forecast and no future indicative; nothing subjunctive is needed because no edge is claimed. No count, no season, no cause, no named character. No second civic object of the class `force` (no militia, no watch, no citizen levy is named anywhere — naming one would both breach the card and restate a sibling pool key: `walls with citizen militia`, `militia only`).

**Spread and sibling distance (arms A1 and A11).** First two words across the twelve wordings, all distinct within a variant: v1 `{settlement} is` / `A wall` / `Walls at` / `The perimeter`; v2 `A stranger` / `A traveller` / `Newcomers to` / `Whoever comes`; v3 `The town` / `Walls stand` / `Behind the` / `A garrison`. The `{settlement}` token opens exactly one variant of the pool (variant 1) and none of the sibling `Invasion & War` pools is restated or contradicted: no wording names an absence of walls, an absence of force, a militia, or a limit of the arrangement — the six `Invasion & War` keys stay mutually exclusive on their surfaces as they are in their predicates.

**THE THREAD.** Every wording is a spine and opens its passage, so none depends on a preceding sentence: no wording begins on a pronoun, a connective or an anaphor. Each hands two nouns forward for whatever modifier the composer seats next — the wall (line, perimeter, walls) and the garrison (professionals, regulars, soldiers) — so a modifier about the muster, the wage roll or the watch picks up a noun already on the page. No wording turns outward at its end; the turn outward belongs to the modifiers, which are seated after the spine by salience.

**Adjacency observation for the block (a note, not a change).** DS-DEF-2 mounts five threat rows on one tab, so the `Beasts & Monsters` row is read beside this one and shares this pool's civic nouns (wall, perimeter, force). The shipped Beasts rows use "perimeter" and "A stranger walks the perimeter at {settlement}"; wording 1c ("The perimeter at {settlement} is held, and held by professionals.") and variant 2's arriving figure are the nearest neighbours. Neither is a shared opening and neither restates a Beasts claim, but the pair-distance measure across the five rows is the block's, not this pool's, and is flagged here for whoever holds the block.

**REFUSALS:** none. All three variants were made lawful under the card. One declared claim-set judgment is recorded above (variant 3); one licensed move (PROVENANCE) is deliberately not spent, with its ground.

**WORD COUNTS** (a `{slot}` counts as one word).
| variant | wording | words |
|---|---|---|
| 1 `[ledger]` | numbered line | 14 |
| 1 | face a | 9 |
| 1 | face b | 15 |
| 1 | face c | 10 |
| 2 `[visitor]` | numbered line | 13 |
| 2 | face a | 14 |
| 2 | face b | 12 |
| 2 | face c | 16 |
| 3 `[street]` | numbered line | 10 |
| 3 | face a | 11 |
| 3 | face b | 10 |
| 3 | face c | 10 |
