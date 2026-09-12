1. `[plain]` The country that lies around {settlement} is dangerous ground.
   - `[face]` Rough country runs up against {settlement} and holds hard ground.
   - `[face]` About {settlement} the ground is hard and the country dangerous.
   - `[face]` Trouble in the country around {settlement} is the ordinary state.
2. `[plain]` The ground about {settlement} is not quiet ground.
   - `[face]` Hard country lies about {settlement} where quiet would otherwise stand.
   - `[face]` Around {settlement} the country does not answer to quiet.
   - `[face]` Danger stands in the ground about {settlement}, and quiet does not.
3. `[plain]` The threat about {settlement} stands as a present condition of the country.
   - `[face]` Danger of the continuing kind is the plain condition of {settlement}'s country.
   - `[face]` Live danger sits in the country around {settlement} and does not lift.
   - `[face]` In the country about {settlement} the danger is present.

--- NOTES

## 1. THE GATE'S THREE ROWS, ANSWERED MEASURE BY MEASURE

The three failing measures are **re-verified from source this round, not inherited from round 3's
note**. The verification is two reads: the four shipped spine strings at
`docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:6017` ff., and the three shipped detectors
(`src/domain/prose/entryWalker.js` `armQualify` / `armCitation`, `entryLexicons.js`
`RECORD_CITATION`, `scripts/taste-measure.mjs` `unitsOfPool`). Both were read whole in this seat's
own pass. The conclusion is round 3's, and it is now independently grounded.

**The unit is `${spineFace} ${face}`** (`taste-measure.mjs:260`), spine first, and the entry
walker's channels are the UNION over that concatenation. `unitsOfPool` builds 4 spine faces
(`UNWALLED-LARGE` 1 and 2, `UNWALLED-SMALL` 1 and 2) × 12 modifier faces = **48 units**.

| row | value / band | where the finding is sited | what round 4 does |
|---|---|---|---|
| unit verdicts | FAIL 0 · WITHHELD 48 · PASS 0 (band 0 · 0) | the union of the two rows below | holds at 0 modifier-sited findings |
| Q · a trailing coordinate naming no second field | 28 of 48 listed (36 true; the list caps at 40) | three SPINE faces | contributes 0; the shape that *could* reach a modifier stays at 0 |
| F25 · a cited record's content | 12 of 48 | one SPINE face | contributes 0; the road citation stays refused, because authoring it would ADD 12 |

**Q, exactly.** `armQualify` has two loops. The FIRST (`for i = 1 …`) is the only one that can
ever reach a modifier: the composed text splits on `/(?<=[.?!])\s+(?=[A-Z"'(])/`, so `raw[1]` is
the modifier face, and `consider` returns licensed at the slot test for any face naming a slot.
**All twelve faces name `{settlement}`, so that loop returns nothing, in round 3 and in round 4.**
The SECOND loop splits every sentence on a SEMICOLON, and three of the four spine faces carry one
whose second segment names neither a slot nor a band word:

- `whether that is confidence or thrift, the openness is itself a statement.` (`UNWALLED-LARGE` 1)
- `the town's safety is its neighbours, its distance, and its unimportance.` (`UNWALLED-SMALL` 1)
- `at this size the country and the town simply agree to differ.` (`UNWALLED-SMALL` 2)

3 spine faces × 12 modifier faces = 36. No face in this packet carries a semicolon, so the second
loop never reaches a modifier byte either.

**F25, exactly.** `armCitation` walks `String(entry.text).matchAll(RECORD_CITATION)` and withholds
unconditionally on every match. `RECORD_CITATION` is thirteen record nouns followed by fourteen
verbs; `UNWALLED-LARGE` 2's `the books say` is one, on 12 units. No face here contains a record
noun at all.

**So the arithmetic closes with nothing left over: 36 + 12 = 48 = one finding per unit, every unit
WITHHELD, none of it sited on a byte this packet owns.** `composedVerdictOf` has no per-piece
verdict, so a lawful modifier composed onto a withholding spine inherits WITHHELD whatever it says.

**THE STANDING OF THIS ROUND, STATED PLAINLY.** This is the SECOND consecutive round in which the
three measures cannot be moved from the writer's seat. Under Part B §21 that is the DRY/refusal
path by count; the measurement says it is the other path — **an unsatisfiable set, which §21 sends
to the sitting as a row**. The difference matters: a dry set has a cure nobody found; this set has
a cure with an owner who is not the writer.

**THE CURE, AND WHOSE IT IS.** Either (a) the three semicolon-bearing spines are reworded so the
second segment names a slot or a band word, and `UNWALLED-LARGE` 2's `the books say what` loses
the record-noun-plus-verb pair — a SPINE act, and this packet may not touch a spine key or its
text (A7/A17); or (b) a composed unit's findings are keyed to the PIECE that carries them, which
CLERK-LAWS §2.6.1 already builds the machinery for (`claimKey` carries the site) — a walker act.
Under (b) this pool reads PASS 48 with these twelve rows unchanged. Both are the chair's.

## 2. WHAT ROUND 4 DOES MOVE (§21.2/§21.3 — one effort, toward the ceiling, no new failing state)

Seven faces are substituted one for one; three `[plain]` lines and two faces are carried unchanged
because no law stands behind changing them (§21.4: a lawful line made plainer for no law is the
regression). Variants stay 3, faces stay 12, nothing is removed (§22 a/d/e).

| # | what was cured | the law behind it |
|---|---|---|
| 1 | `in the common case` leaves the pool | a frequency claim; the field holds a standing family value, not a rate (card `may NOT`: a count) |
| 2 | `Danger holds close`, `runs up against` as an abstraction's act, `runs through` all go | R-DA-11: no sense verb on an abstraction, nothing inanimate with intent |
| 3 | the shared frame `X of the standing/continuing kind` across two variants is broken (one instance survives) | R-DA-05 / NL-8: a phrase pattern recurring across a pool's variants is the template |
| 4 | `unquiet` (×2) and `in the plain way of that country` leave | R-DA-18 (the antique air in the noun, never a coinage) and the empty-tail test |
| 5 | the 15-word motion figure and the limp `is present` close are replaced | R-DA-11; R-DA-04's close-kind spread |
| 6 | the referent phrase is spread over `about` ×6, `around` ×4, `against` ×1, possessive ×1 | R-DA-05's within-pool spread |
| 7 | close kinds: OBJECT 5 · CONDITION 3 · ABSENCE 3 · STANDING FACT 1 — object share **0.417** against round 3's 0.500 | R-DA-04 |

**Held flat, so nothing green regresses:** twelve faces, one sentence each; first-two-word pairs
distinct 12 of 12 (A11); zero pronouns anywhere (so `closers.pronounRate` is 0, not merely low);
zero faces closing on the slot or opening on it (T-F8); zero abstract-noun-suffix closers; zero
semicolons, colons, em dashes, digits, percents, questions, `which`, `-ly` adverbs, participial or
existential openers, doubled adjectives, quantifiers, magnitude words, count nouns, past-tense or
present-perfect finite verbs, `SUPPLY_CLAIM_LEXICONS` members (`pressed` included), record nouns,
`CONTRAST_SHAPES` matches, `SPECIFICATIONAL_COPULA` matches, `BARE_RELATIVE` matches, gendered
pronouns. Slot sets are byte-equal across each variant's four faces (arm A6); marks are empty on
all twelve (`audience: player (no mark)`, `covert: no`).

**Word counts** (whitespace tokens; a slot is one token): 9 · 10 · 10 · 10 · 8 · 10 · 9 · 11 · 12
· 12 · 12 · 9. Min 8, max 12, mean 10.167, sample sd 1.337. **Reported against round 3's sd 2.094,
with its cause:** round 3's spread came from a 15-word face that carried the motion figure cured
at row 5 above. Trading a figure for 0.76 of a word of spread is the trade this round takes; the
figure is banded (R-DA-11 is a floor) and the per-face length is not (`lengths.ceiling` is `null`
for a `sentence`-form pool in the gate's own JSON). Faces under 8 words: 0 — the figure that blew
`wordsPerSentence.shareUnder8` at 2.192 band-widths in round 1.

## 3. PER FACE — THE CLAUSE THAT LICENSES IT

Every one of the twelve asserts exactly ONE typed claim: **that `settlement.config.monsterThreat`
holds, as a STANDING fact of the record** (card `reads` + `may claim`). MOVE `PRESENT` on a
standing configuration field (MOVE-GRAMMAR §1.2 row 1; level-1 grammar V1 at §2.1); FORM
`sentence`; RELATION `addition`, so the composer supplies the opener and no face carries a
connective of its own. Slots: `{settlement}` only, from the card's bag as FILLED at this block's
call sites. No face carries a second field, so R-DA-03's QUALIFY is never engaged.

**Variant 1 — the country is dangerous ground** (the flat civic fact; close kinds OBJECT ·
OBJECT · CONDITION · CONDITION).
- `[plain]` (9) Carried unchanged from rounds 2 and 3, byte-identical: the variant's
  canonical-at-zero line, and it carries no defect. `dangerous ground` is a comparison stated as a
  measurement in words, never a figure (R-DA-11).
- `[face]` (10) `runs up against` is literal adjacency of terrain, and the subject is `Rough
  country`, a thing, not an abstraction — which is the cure of round 3's `Danger holds close`.
- `[face]` (10) The pool's one gapped coordination (`the ground is hard and the country
  dangerous`): both nouns name the same licensed referent, so it is one fact in two words, not
  two facts. The density law (§21.4) is what this face is for.
- `[face]` (10) `the ordinary state` states the standing character the family value carries; it is
  not the frequency hedge cured at row 1, which said the claim held only usually.

**Variant 2 — the country is not the quiet kind** (the CONTRAST; close kinds OBJECT · STANDING
FACT · ABSENCE · ABSENCE).
- The rejected alternative is `quiet`, the discriminating word of the sibling spine key
  `WALLED-QUIET` in this same block. MOVE-GRAMMAR §1.4 wall 5 licenses a contrast exactly where a
  **sibling pool key** or sibling band names the rejected alternative, and bars it as the subject
  and as the closing move of more than one variant per pool: in all four faces `quiet` sits in the
  predicate or a subordinate, never the subject, and this is the pool's only contrast variant.
- **The data-side band word `settled` was considered as the rejected alternative and REFUSED**
  (refusal 5 below): it is the field's own third family value, but in this estate "settled
  country" reads as inhabited country, and the walled sibling pool disambiguates it with the
  ledger anchor (`the settled grade`) that this pool's register does not use.
- `[plain]` (8) The flat negative; the lack is the first half only, with no completing "but"
  (R-DA-02). Matches no member of `CONTRAST_SHAPES`.
- `[face]` (10) `would` is R-DA-07's licensed subjunctive edge, not a forecast; `FUTURE_INDICATIVE`
  (`will|shall`) is absent from all twelve.
- `[face]` (9) `answer to` is the classification verb, so the face says the grade does not fit
  without borrowing the walled pool's ledger nouns.
- `[face]` (11) The ellipsis `and quiet does not` is the same contrast, not a second fact; it is a
  comma coordinate, which `armQualify` does not scan (it splits on `;`), and it matches no
  `CONTRAST_SHAPES` member. **This is the face a refuter should look at first** — see §5.

**Variant 3 — the danger is present and continuing** (the standing aspect; close kinds OBJECT ·
OBJECT · PROHIBITION · CONDITION).
- `[plain]` (12) Carried unchanged: the copula kept, the expletive struck (R-DA-07).
- `[face]` (12) Carried unchanged. The possessive on the proper slot follows `UNWALLED-LARGE` 1's
  own `{settlement}'s weight` and asserts no tenure, only the surround. Its `of the continuing
  kind` is now the pool's ONLY instance of that frame (row 3 above).
- `[face]` (12) `does not lift` is a present indicative statement of the standing aspect — the
  card's `may claim` clause word for word — and not a forecast; it replaces round 3's `runs
  through … as a standing state of the ground`.
- `[face]` (9) The pool's short line, at the 8-word floor's shoulder; `the danger is present` lands
  on a condition rather than round 3's bare predicate tail.

**THE THREAD** (owner ~21:4x; MOVE-GRAMMAR §1.4.1), read at all four seams. The modifier is
seated last, and its move from the town to the country the town sits in IS the passage's one turn
outward, which §1.4.1 licenses when it sits last. It also hands something back at every seam:
every face names `{settlement}`, the spine's own subject, and three faces (`About {settlement} the
ground…`, `Around {settlement} the country…`, `In the country about {settlement}…`) open on the
town and travel outward inside the sentence, which is the smoothest of the four seams. After
`UNWALLED-SMALL` 2 the noun `country` is handed forward by the spine itself and picked up
directly. **The after-a-sibling reading is VACUOUS and is reported as vacuous rather than claimed
as passed:** the block's other three modifier pools attach only to the walled keys, so no sibling
modifier can precede this one.

**WHAT THE CARD'S `may NOT` KEPT OUT.** No count, no band word, no cause, no season, no future, no
standpoint, no second fact, no civic object of the class `wall`, and no word touching either field
the attached spines test (`forces.walls.present`, `settlement.tier`). That last is why not one
face says *town*, *village* or *size*: the pool attaches to `UNWALLED-SMALL` (village and below)
AND `UNWALLED-LARGE` (town and above), so a tier noun would be false on half the cells. It is also
why `open` and `openness` are absent — they are `UNWALLED-LARGE` 1's words for the wall's absence.
The refused columns are untouched: no totality over persons, no exemption, no named character, no
theological claim.

## 4. REFUSALS — SEVEN, EACH A RESULT

1. **THE SET IS UNSATISFIABLE FROM THIS SEAT ON THE GATE'S THREE MEASURES.** §1 above, verified
   from the shipped spines and the shipped detectors this round: 48 of 48 findings sited on the
   spine, 0 on the modifier, in rounds 2, 3 and 4 alike. Recorded as a SITTING row with its cure
   and its owner, not as a dry round with an undiscovered fix.
2. **THE ROAD CITATION IS REFUSED, and the ground is now stronger than the budget argument.** The
   card licenses `source: road · standing LICENSED`. Beyond MOVE-GRAMMAR §4.4.3's unset budget
   (arm A13 reads `provenance: {citations: 0, a13: 0}` for this pool), `armCitation` withholds on
   EVERY `RECORD_CITATION` match in the composed text: a cited face would ADD 12 or more F25
   findings to a pool already withheld on that arm. The face is banked, carried from rounds 1–3
   and never trimmed: *"What comes from the road puts {settlement}'s country down as dangerous
   ground."*
3. **TWO DETECTOR EXPLOITS, RE-TESTED AND REFUSED.** `armQualify`'s segmenter requires
   `[A-Z"'(]` after the sentence break. A face opening on `{settlement}` or on a lower-case word
   collapses the composed unit to ONE segment, which folds the spine's unlicensed post-semicolon
   text into a segment carrying the modifier's slot, and the walker licenses it — 48 findings to
   12 without changing one fact. Refused twice over: the slot opener breaks T-F8 and is a FALSE
   green besides (at render the slot is a capitalised name and the split reoccurs, so the finding
   is hidden from the walker and not from the reader); the lower-case opener breaks ARCH §2.5's
   seam contract for a `sentence`-form row. The hazard is the walker's to close.
4. **`{defwork}` IS REFUSED ON EVERY FACE.** The bag offers it, but the card's own line says it is
   FILLED at this block's call sites only as `{settlement}`, and this pool attaches only to the two
   UNWALLED keys, where by construction no wall-class institution exists to fill it. A `{defwork}`
   face would be unreachable at every draw (arm D) and barred if reached (`another civic object of
   the class wall`).
5. **THE BAND WORDS ARE REFUSED, BOTH DIRECTIONS.** The positive: the predicate fires on TWO
   families (`measuredMonsterFamily ∈ {plagued, frontier}` —
   `defenseStateProseCandidates.js:63`), so either word in the surface over-claims on half the
   cells. The negative: `settled`, the third value of the same ladder
   (`defenseStateProse.js:217-222`, produced by the config value `heartland`), is true to reject on
   every firing cell, but in this estate it reads as *inhabited*, and the disambiguating anchor is
   the walled sibling pool's ledger idiom, which this pool's register refuses. `quiet` carries the
   contrast instead, licensed on wall 5's sibling-pool-key limb.
6. **NEW THIS ROUND — THE DISTINCT-GRAMMAR FLOOR IS NOT-EXECUTABLE FOR THIS POOL.**
   MOVE-GRAMMAR §2.1 level 1 requires a pool of k variants to carry min(k, 8) DISTINCT level-1
   grammars, at least two in any pool of two or more. Every member but V1 needs a licensing field
   this pool does not read: V2 a structural-consequence field, V3 a `none-exists` field, V4 a named
   object, V5 an institution row, V6 an unresolved-value state field, V7 event provenance, V8 a
   `not-held` field. §3.2's own rule then binds — "never write a member the block cannot license"
   — so all three variants are V1 and the floor is unsatisfiable by licensing, not by authoring.
   The variation the rule wants is carried by the four faces' rhythm and vocabulary instead. This
   is a general property of every single-field modifier pool and is put to the sitting.
7. **THE TWO PRE-EXISTING `T-F12` ATTACH REFUSALS ARE NOT CURABLE FROM THIS PACKET.** `ATTACH
   UNWALLED-LARGE` and `UNWALLED-SMALL` both refuse because the spine's key and this modifier's key
   name the same civic object class `wall` — the modifier key contains `unwalled`, and the guard
   reads the KEY, not the text. Waived only under `--taste`. A writer may not re-key a pool
   (A7/A17), and both keys are the ones the card's ATTACH line names.

## 5. WHAT A REFUTER SHOULD LOOK AT FIRST

`Danger stands in the ground about {settlement}, and quiet does not.` — the second limb is an
ellipsis of the first, which is the variant's own contrast and not a second fact. The reading
taken here: `armQualify` scans second SENTENCES and post-SEMICOLON segments, and a comma
coordinate is neither; `CONTRAST_SHAPES` requires `and not <word>` and this is `and quiet does
not`; wall 5 is satisfied because `quiet` is not the subject. If the chair reads the coordinate as
the bare antithesis the register card forbids, the one-for-one revert is
`Around {settlement} the ground does not answer to quiet either.` — and never a removal.

Second: after `UNWALLED-SMALL` 1 ("the town's safety is its neighbours, its distance, and its
unimportance") a face saying the surrounding country is dangerous reads as a tension. It is not a
contradiction in structural fact — the spine grounds the town's safety in obscurity, not in a
quiet country, and this pool's field says nothing about the town's own safety — but it is the
seam a reader will feel, and it is named here rather than left to be found.

## 6. STANDING

CONFIRMED for every count, clause and tally in §1: the four spine strings are read from
`RECEIPT_POOLS_DOSSIER_STATE.md` at this tip, and the three arms from `entryWalker.js`,
`entryLexicons.js` and `taste-measure.mjs`, all read whole in this seat's own pass this round; the
arithmetic (3 × 12 = 36, 1 × 12 = 12, 48 units) follows from `unitsOfPool`'s own loops. CONFIRMED
for the twelve rows' word counts, opener pairs and detector negatives, which are properties of the
bytes above. PLAUSIBLE for the band arms (`budgetOk`, `depthOk`, `perfectionSuspect`), which this
seat cannot execute; the executable proof of those is the gate's re-run.
