Seat: Opus 5 (Fable-unvalidated) · REWRITE draft round 1 · block DS-DEF-11 · pool key `WALLED-STRAINED`
Written 2026-09-09. Nothing outside this file was written; no dock was entered, no test was run.
The only command executed was the read-only licence-card script in `laneRW-DEF11`.

# DS-DEF-11 · `WALLED-STRAINED` — the rewritten variant rows

Two existing variants, rewritten in place under their own numbers, in their own order, with their
bracketed tags untouched. No variant added, none removed, none merged. Each variant is one
`[plain]` line and three `[face]` sub-rows: four wording faces, each a different vocabulary or
rhythm inside the voice, none a paraphrase of a sibling, every one standing alone because the
render draws one face unweighted.

The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are not mine and are not
repeated here.

---

## THE PASTE BLOCK

The heading below is shown for placement only; it already stands in
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md` under `### DS-DEF-11`. What replaces the pool's
current variant rows is the two numbered rows and their six sub-rows.

**`WALLED-STRAINED`**
1. `[ledger]` `[plain]` The {defwork} at {settlement} stands, and the muster is short of its funding.
   - `[face]` The wage roll at {settlement} is not met, and the {defwork} holds.
   - `[face]` On {settlement}'s military account the muster runs short, and the {defwork} is in place.
   - `[face]` At {settlement} the muster is underfunded and the {defwork} is up.
2. `[unfolding]` `[plain]` The pay for {settlement}'s garrison stands open on the roll, and the {defwork} is in place.
   - `[face]` What {settlement} funds for its garrison falls short, and the {defwork} stands.
   - `[face]` The garrison at {settlement} is not brought up to its funded strength, and the {defwork} holds.
   - `[face]` Funding for the garrison at {settlement} is under its wage, and the {defwork} is up.

---

## THE ROWS BEFORE (for the chair's eye; not part of the paste)

1. `[ledger]` {settlement}'s {defwork} stands better than the watch that should man it; stone keeps itself, and wages do not.  (eighteen words)
2. `[unfolding]` The {defwork} around {settlement} is sound and the muster behind it is thinning, which is the kind of arithmetic a town notices late.  (twenty-three words)

---

# --- NOTES

## A. The licence card this draft was written against

Printed by `node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-STRAINED'` in the dock, verbatim
in its load-bearing lines:

- `reads:` `forces.walls.present` (measured) and `settlement.defenseProfile.economicGates.military`
  (measured); absent implies no candidate, and a modifier is silent, never "false".
- `predicate:` `settlement.defenseProfile.economicGates.military < 1`
- `bag:` `{defwork: bare-common, settlement: proper}`; FILLED at this block's call sites
  `{settlement}`; NAMED BUT NEVER FILLED `{defwork}`.
- `relation:` a spine takes no relation. `seat/form:` not a seat-taker, sentence. `move:` none
  declared. `angle:` ledger, unfolding.
- `source:` muster, standing LICENSED; a citation of this holder is licensed where the provenance
  budget allows.
- `may claim:` that `military` (< 1) holds, as a STANDING fact of the record.
- `may NOT:` a count, a cause, a season, a future, a standpoint, a second fact, another civic
  object of the class `wall`.
- `audience:` player, no mark. REFUSED COLUMNS always: a totality over persons; an exemption from a
  duty; a named character and that character's fate; a theological claim.

## B. The claim set every face carries, and the clause that licenses each claim

Two claims, and only two. All eight faces carry both and nothing else, so the faces are
claim-equal to each other (arm A6) and the two variants cohere in structural fact (C-sibling).

- **K1 — this settlement holds a defence work of the wall class, and it is present and standing.**
  Licensed by the card's `reads` line, first path, `forces.walls.present` (measured). A declared
  read is not optional: ARCH section 4.4's walker arm A0b convicts an UNDER-claim, "a declared
  field the text never claims", so K1 must be asserted and not merely presupposed. The predicate
  of presence, and nothing beyond presence, is what each face states: "stands", "holds", "is in
  place", "is up".
- **K2 — the paid military establishment is funded below what it requires.** Licensed by the card's
  `predicate` line, `economicGates.military < 1`, and stated under the card's `may claim` line as a
  STANDING fact of the record: "short of its funding", "the wage roll is not met", "runs short",
  "underfunded", "stands open on the roll", "falls short", "is not brought up to its funded
  strength", "is under its wage".
- **The slots** are exactly the card bag and exactly the set the BEFORE carried: `{settlement}`
  (proper) once and `{defwork}` (bare-common) once in every face. `check-pair.mjs`'s SLOTS arm
  compares sets, and no face adds or drops one.
- **No third claim anywhere.** No face states a relation between the wall and the paid force, no
  face states a cause, a count, a season, a future, a standpoint or a second civic object of the
  class `wall`. The two facts sit side by side under the relation the model gives a spine's
  neighbours by default, `addition`, which is the claim-free floor.

### Face by face

Variant 1 `[ledger]`, the books' idiom:

| face | K1 licensed by | K2 licensed by |
|---|---|---|
| `[plain]` The {defwork} at {settlement} stands... | `reads` `forces.walls.present` | `predicate` + `may claim` |
| `[face]` The wage roll at {settlement} is not met... | `reads` `forces.walls.present` | `predicate` + `may claim` |
| `[face]` On {settlement}'s military account... | `reads` `forces.walls.present` | `predicate` + `may claim` |
| `[face]` At {settlement} the muster is underfunded... | `reads` `forces.walls.present` | `predicate` + `may claim` |

Variant 2 `[unfolding]`, the term left standing open:

| face | K1 licensed by | K2 licensed by |
|---|---|---|
| `[plain]` The pay for {settlement}'s garrison stands open on the roll... | `reads` `forces.walls.present` | `predicate` + `may claim`, read as the STANDING-OPEN specialisation of PRESENT (MOVE-GRAMMAR section 1.2 row 10: a state field whose value is a term unmet), declarative, never an interrogative |
| `[face]` What {settlement} funds for its garrison falls short... | `reads` `forces.walls.present` | as above |
| `[face]` The garrison at {settlement} is not brought up to its funded strength... | `reads` `forces.walls.present` | as above |
| `[face]` Funding for the garrison at {settlement} is under its wage... | `reads` `forces.walls.present` | as above |

The `[unfolding]` angle is carried by the OPEN reading of the same predicate, not by a second
claim and not by a trajectory. The angle tag is not mine to touch and was not touched.

## C. The walls and bands each face was checked against

Checked by hand against `scripts/check-pair.mjs`'s arms as they stand in the dock, and against the
walls of Part B, MOVE-GRAMMAR section 1.4 and section 1.4.1, and the register card.

- No em dash, no exclamation, no digit, no percent, no question mark, no `which`, in any face.
- No future indicative; no `will`, no `shall`; no bare future anywhere. STATE never FATE.
- One sentence per face, so the THREE+ SENTENCES arm cannot fire and, more importantly, the
  composer's SENTENCE seat stays open on every face (ARCH section 4.4: the sentence seat is open
  only if the spine is one sentence; DS-DEF-11 is twelve of twelve today). No face carries a
  semicolon or a colon, so the S2 clause seat is open on every face as well.
- No DURATION or TIME word from the arm's list appears in any face, and none appeared in either
  BEFORE, so nothing is ADDED.
- No COUNT word from the arm's list appears in any face, and none appeared in either BEFORE, so
  none is ADDED and none is LOST.
- No RATIONED pattern rises: zero instances of `rather than`, `which is`, `which means`, `nobody`,
  `no one`, `nothing`, `its own`, `whatever`, `enough to`, `enough that`, `kind of`, `sort of`,
  `quiet`, `still`, `yet`, `already` in any face. The BEFORE of variant 2 carried `which is` and
  `kind of`; both fall to zero, which no arm penalises.
- ANTITHESIS SHAPE stays at zero, as in both BEFOREs. No `not X but`, no `, not X.`, no
  `less X than`. The comparative in variant 1's BEFORE, "stands better than the watch", is gone
  for the reason at REF-2 and not for a shape reason.
- No EXISTENTIAL opener, no PRONOUN closer. The eight closing words are funding, holds, place, up,
  place, stands, holds, up.
- No face opens on a `proper`-typed slot, which the annex grammar refuses for a sentence-form row
  (ARCH section 2.5, T-F8). Variant 1's BEFORE opened on `{settlement}` and no longer does. This
  also puts the settlement-token opener at zero across the pool, well under R-DA-17's ceiling.
- A11 spread: the eight faces have eight distinct first-two-word openers, and the two `[plain]`
  lines open "The {defwork}" and "The pay", so no shared opener is created inside the pool. The
  pool's sentence-count spread was uniform before the rewrite and is uniform after, so the
  FLATTENED arm cannot fire.
- LONGER, which the kit applies to the variant and not to a face: variant 1 falls from eighteen
  words to thirteen, variant 2 from twenty-three to sixteen. Neither `[plain]` is longer.
- R4, a word naming a sibling pool key: neither BEFORE carried one, so none is cut.
- THE THREAD (MOVE-GRAMMAR section 1.4.1): each face is one sentence whose two clauses share the
  town's civic matter and hand a civic noun forward, and each ends on a civic thing a following
  modifier can pick up. The spine sits first by construction, so the passage's one turn outward
  belongs to the modifier that follows it, which is where the model puts it.
- Neither restate nor contradict the siblings (arms A1 and A11). The block's other pools already
  own "the town's books", "the books say what", "stone", "the country requires it", "keeps",
  "a circuit", "cheaper", "easier" and "sound"; not one of those words appears in any face here.
  The vocabulary this pool takes is the wage roll, the military account, the funding, the pay, the
  muster and the garrison, which no sibling pool uses.

## D. Density and ceiling (Part B sections 21.1 to 21.4)

Word counts: variant 1, thirteen, twelve, fourteen, eleven. Variant 2, sixteen, twelve, sixteen,
fifteen. The block ships at fifteen to twenty-six words, so six of the eight faces sit below the
shipped floor. That is deliberate and it is a rhythm gain, not a plainness trade: the register card
holds that the short line exists and that rhythm follows load, and R-DA-06 wants the short-line
share to rise. Nothing was made plainer without a law behind the change; every word removed was
removed by a named law in section E.

The one honest weakness of this draft, named for the refinement round rather than hidden: all eight
faces are coordinate, "the fact, and the fact", because the two reads are two standing facts with
no licensed relation between them and because a two-sentence face would close the composer's
sentence seat. The faces differ in lead noun, in vocabulary and in length, but not yet in
construction. That is the sharpest target a refiner has here.

## E. REFUSALS AND DECLARED REMOVALS

**REF-1 — the provenance move is refused across this face set, though the card licenses it.**
The card says the muster is a LICENSED standing source and that a citation of this holder is
licensed where the provenance budget allows. It cannot be taken. A citation is two licensed claims
(Part B section 20), so a single citing face would not be claim-equal to its three siblings, which
arm A6 requires; and citing in all four faces is the citation habit that Part B section 24 makes a
refuter's finding, against exemplar registers that cite at zero per seven hundred and eighty-six
sentences. No face cites a holder. Naming "the wage roll", "the military account" or "the roll" as
the record that is short is a PRESENT move on a record object, not a provenance move, and is
recorded here as the reading this draft used.
*For the chair: whether a provenance face may be claim-unequal to its siblings, or whether
provenance belongs to a variant rather than to a face, is not a call this seat can make.*

**REF-2 — variant 1: three claims removed as unlicensed.** Ruling 5, as R-DA-15 states it, is the
authority: an unlicensed claim "is not a claim the pool was entitled to hold", its removal is
required, and the B-CLAIM bar is not engaged. So this rewrite does not preserve the BEFORE's whole
claim set, and the departure is declared rather than quiet.
- "stone keeps itself, and wages do not" is a general law about the world, which is the card's
  refused `a cause`, R-DA-12's generalisation test, and the MEANING non-move of MOVE-GRAMMAR
  section 1.3. "Stone keeps itself" is also inanimate intent, which R-DA-11 refuses.
- "the watch that should man it" asserts a link between the wall and the paid force. The engine
  denies that link: ARCH T-F2 records that the generator's own comment exempts built walls from the
  pay gate and that no engine edge has `walls` as an endpoint. Under the card that is `a second
  fact`. Separately, "the watch" is the civic object of this block's own sibling modifier pool
  `watch: bought` (ARCH section 6.3), so a spine naming it restates a sibling.
- "stands better than" is the same unlicensed link stated as a relative measurement.

**REF-3 — variant 2: four claims removed as unlicensed**, under the same authority.
- "is thinning" asserts a trajectory. No trend field is read here, and R-DST-B rules that a standing
  configuration field licenses a structural clause and never a historical one.
- "which is the kind of arithmetic a town notices late" is a `which` tail (wall 6, R-DA-03), a
  standpoint (the card's refused list), and a gnomic closer (R-DA-12). It also carried two rationed
  patterns.
- "around {settlement}" asserts geometry. The block's own wall class includes `inner citadel`, which
  does not surround a town, so the claim is false for part of the class; MOVE-GRAMMAR row one
  refuses a spatial fact the field does not hold.
- "is sound" asserts a maintenance condition. The read is presence, not condition; the recorded law
  the block cites is that built walls keep standing, which licenses "stands" and not "sound".

**REF-4 — a wiring row, not a text law: `{defwork}` is NAMED BUT NEVER FILLED at this block's call
sites**, on the card's own printing. A piece with an unfillable slot drops itself (ARCH section 0,
step six), so every variant of this pool may be silent at render today. The slot is kept in all
eight faces because the SLOTS arm fails any face whose slot set differs from the BEFORE's, and
because a slot is not a wording. This is raised for the chair, not cured here.

**REF-5 — a consequence of REF-2 and REF-3, stated so no one has to re-find it.** Once the
unlicensed decoration is gone, the two variants assert the same two claims and are told apart only
by their angle and their grammar. That is lawful, C-sibling asks exactly that, and A11's opener
spread holds. But the pool's semantic width is now visibly the width of its licence, which is one
key with two reads. Whether `WALLED-STRAINED` should carry two variants of one claim set, or
whether the second wants a licence of its own, is a sitting question and is not decided here.

**Format note, for the projector lane.** The annex grammar in ARCH section 2.5 shows the numbered
row carrying `[plain]`, while the shipped rows carry the angle tag. This draft writes both, angle
first, so neither is lost: `1. ` then the angle tag, then `[plain]`, then the text. If the
projector wants one tag on the numbered row, the angle is the one the corpus already holds and the
`[plain]` marker is the one to fold into the row's position.

**Not lawful, refused, or banked: none of the eight faces.** Both variants are written and both are
lawful as written. The refusals above are a licensed move this seat could not take (REF-1), two
declared claim removals the licence compels (REF-2, REF-3), a wiring finding (REF-4) and a sitting
question (REF-5).
