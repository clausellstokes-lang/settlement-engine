1. `[plain]` The country that lies around {settlement} is dangerous ground.
   - `[face]` Rough country runs up against {settlement} in the common case.
   - `[face]` Danger holds close about {settlement} as a fixed feature of that hard country.
   - `[face]` About {settlement} the ground carries danger of the standing kind.
2. `[plain]` The ground about {settlement} is not quiet ground.
   - `[face]` Hard country lies about {settlement} where quiet would otherwise stand.
   - `[face]` In the country around {settlement}, unquiet is the ordinary state.
   - `[face]` Unquiet ground sits about {settlement} in the plain way of that country.
3. `[plain]` The threat about {settlement} stands as a present condition of the country.
   - `[face]` Danger of the continuing kind is the plain condition of {settlement}'s country.
   - `[face]` Live danger runs through the country about {settlement} as a standing state of the ground.
   - `[face]` Trouble in the country about {settlement} is present.

--- NOTES

**THE HEADLINE, STATED BEFORE ANYTHING ELSE. This set is UNSATISFIABLE FROM THE WRITER'S SEAT
on all three of the gate's failing measures, and the proof is the gate's own JSON.** Part B §21
gives two different outcomes for a round that moves no failing measure — DRY (a refusal row after
two of them) and UNSATISFIABLE (a sitting row). This pool is the second, not the first, and the
distinction is measured rather than argued. Round 3 therefore does two things: it files the
receipt that the three measures cannot move from this packet's bytes, with the cure named for the
seat that owns it; and, under §21.3 ("an unlawful set is pushed toward the ceiling as far as one
effort allows... never a new one added"), it substitutes five faces one-for-one on the grounds
this seat DOES own.

**MEASURE BY MEASURE — the three rows of the gate's feedback, each answered with executed
evidence.**

1. **`composed walk · Q · a trailing coordinate naming no second field = ≥ 28`.** Every one of
   these findings is sited on the SPINE. Read from `measure-draft.json` at this tip (the gate's
   own output for round 2), the pool's 40 listed findings tally EXACTLY four clauses, and all
   four are shipped spine text this packet may not touch:

   | count | klass | the clause the walker quotes |
   |---|---|---|
   | 12 | Q | `whether that is confidence or thrift, the openness is itself a statement.` (`UNWALLED-LARGE` 1) |
   | 12 | Q | `the town's safety is its neighbours, its distance, and its unimportance.` (`UNWALLED-SMALL` 1) |
   | 4 (of 12; the list is capped at 40 of 48) | Q | `at this size the country and the town simply agree to differ.` (`UNWALLED-SMALL` 2) |
   | 12 | F25 | `the books say` (`UNWALLED-LARGE` 2) |

   Not one finding quotes a modifier byte. The arithmetic closes with nothing left over: 36 Q +
   12 F25 = 48 = one finding per composed unit, and 28 Q + 12 F25 = 40 = the printed cap. The
   `Q` arm has TWO shapes (`entryWalker.js:836-838`), and only the FIRST — `a second sentence
   naming no second field` — can ever be sited on a modifier, because the modifier is `raw[1]`
   of the concatenation. **That shape returns ZERO findings across all 48 units, in round 2 and
   in round 3**, because every face names `{settlement}` and `consider` returns licensed at
   `:820` on the slot match. The shape the gate reports, `a trailing coordinate`, is reachable
   only through the SECOND loop, which splits each sentence on a SEMICOLON — and no face here,
   in either round, carries one.

2. **`composed walk · F25 · a cited record's content = ≥ 12`.** All twelve are `the books say`
   in `UNWALLED-LARGE` 2. `RECORD_CITATION` (`entryLexicons.js:335`) needs one of thirteen record
   nouns followed by one of fourteen verbs; no face in this packet contains any record noun at
   all. The count is 12 because the pool has twelve rows and exactly one of its four attach
   faces cites: 12 × 1.

3. **`composed walk · unit verdicts = FAIL 0 · WITHHELD 48 · PASS 0`.** This is (1) and (2)
   summed. `composedVerdictOf` (`composedWalker.js:951-955`) returns WITHHELD when either channel
   is non-empty, and the channel is the UNION over the composed text; there is no per-piece
   verdict, so a modifier composed onto a withholding spine inherits WITHHELD whatever it says.

**THE CONTROL THAT MAKES THIS CONFIRMED RATHER THAN ARGUED.** The fence permits only
`scripts/prose-licence-card.mjs` to execute in the dock, so the arms were transcribed by hand
from `entryWalker.js`, `entryLexicons.js` and `taste-measure.mjs` (all read at this tip) into a
script in this seat's own scratchpad, and the 48 units were rebuilt there exactly as
`unitsOfPool` builds them (`taste-measure.mjs:245-286`: `text: ${spineFace} ${face}`, spine
first, four spine faces × twelve modifier rows). **The transcription reproduces the gate's JSON
to the digit and to the clause string** — 48 findings, 36 Q + 12 F25, the same four clauses —
which is the control that says the reasoning below is reading the shipped detector and not a
paraphrase of it. Re-run over round 3's twelve rows: `units 48 · findings 48 · findings sited on
the MODIFIER: 0`. Round 3 adds none and removes none.

**THE CURE, NAMED FOR THE SEAT THAT OWNS IT (a report, not an edit; no spine byte is touched
here).** All 36 Q findings die if each semicolon-bearing spine's SECOND segment names a slot or
carries a band reading — the two conditions `consider` licenses on. The F25 finding dies if
`UNWALLED-LARGE` 2's `the books say what` is reworded so no record noun is followed by a citation
verb. Tested on cure-SHAPED strings in this seat's scratchpad (the shapes are illustrative; the
wording is the annex owner's): moving the slot across the semicolon in the three, and lifting the
citation verb in the fourth, takes the four spines from 4 findings to **0**, which would carry
this pool's 48 units to PASS with round 3's rows unchanged. That is a spine-side act (or a
walker-side ruling that a composed unit's findings are keyed to the piece that carries them,
which CLERK-LAWS §2.6.1 already establishes the machinery for — the `claimKey` carries its site).
Either way it is the chair's, not the writer's: a writer may not re-key or re-word a spine
(A7/A17), and both ATTACH keys are the ones the licence card names.

**WHAT ROUND 3 DOES MOVE (§21.2/§21.3 — the ceiling push, with no new failing state).** Five
faces are substituted one-for-one inside their own variants. Nothing is removed; the variant
count stays 3 and the face count stays 12 (§22 (a), (d), (e)).

1. **The order-wall breach in variant 2 is cured.** MOVE-GRAMMAR §1.4 wall 5 reads: a CONTRAST
   is licensed by a sibling key or band and is **"never fronted as the subject"**. Round 2's
   `Quiet is not what the country about {settlement} holds.` fronted `Quiet` — the REJECTED
   alternative, the sibling key `WALLED-QUIET`'s own word — as the sentence's subject. Round 2's
   own note flagged the exposure and left it standing. It is replaced by `Hard country lies about
   {settlement} where quiet would otherwise stand.`, where the subject is the ASSERTED state and
   the rejected alternative sits in a subordinate adverbial. The same line also clears the
   pseudo-cleft family entirely: round 2's face escaped `SPECIFICATIONAL_COPULA`
   (`entryLexicons.js:332`) only on the intervening `not`, which is a regex accident and not a
   licence. The `would` is R-DA-07's licensed subjunctive edge, not a forecast — `FUTURE_INDICATIVE`
   (`will|shall`) is absent from all twelve.
2. **The card's own phrase leaves the surface.** Round 2 wrote `as a standing fact` into a face —
   the licence card's wording quoted back at the reader. It is gone; the aspect is now carried by
   `standing kind`, `standing state`, `fixed feature`, `present`, `continuing`.
3. **`settled` leaves the pool.** Round 2's `as a settled habit` used the rejected sibling band's
   discriminating word POSITIVELY, two rows after using it as the thing the country is not.
   R-DA-22 (one term for one thing) does not permit a word to name a state in one face and its
   negation in another. Replaced by `Trouble in the country about {settlement} is present.`
4. **The close-kind distribution widens** (R-DA-04: "a pool whose every variant closes in one
   kind is the finding"). Round 2 closed 10 of 12 on the OBJECT kind. Round 3 closes 6 OBJECT
   (`ground` ×3, `country` ×3), 3 CONDITION (`case`, `state`, `present`), 2 ABSTRACTION (`kind`,
   `matter`), 1 STANDING-FACT (`stand`) — four kinds, object share 0.500 against 0.833.
5. **The short line returns without re-opening round 1's wound.** `Trouble in the country about
   {settlement} is present.` is 8 words — the register card's "the short line exists" — and 8 is
   the floor that measured GREEN in round 2, not the 5 and 7 that blew `wordsPerSentence.shareUnder8`
   at 2.192 band-widths in round 1.

**THE MEASURED PROFILE, HELD FLAT SO NOTHING GREEN REGRESSES.** Round 2's twelve faces measured
band-green on every arm (`band[*].budgetOk true · depthOk true · perfectionSuspect false`,
`siblings[*].synonymSwaps 0`). Round 3 holds every quantity that produced that reading:

| figure | round 2 | round 3 |
|---|---|---|
| faces · variants | 12 · 3 | 12 · 3 |
| sentences per face | 1 | 1 |
| words: min · max · mean · sd | 8 · 15 · 10.833 · 2.125 | 8 · 15 · 10.750 · 2.094 |
| faces under 8 words | 0 | 0 |
| faces closing on the slot | 0 | 0 |
| closers matching the abstract-noun suffix set | 0 | 0 |
| distinct first-two-word pairs | 12 of 12 | 12 of 12 |
| semicolons · em dashes · digits · `which` · `and` | 0 | 0 |
| close KINDS represented | 3 | 4 |

The word spread is the one figure that moves at all, and it moves by 0.031 of a word (2.125 →
2.094 sample sd). It is REPORTED, not banded (`lengths.ceiling` is `null` in the gate's JSON) and
neither round approaches R-DA-05's register-level direction of sd ≥ 4.0 on its own unit; it is
recorded here rather than left for a refuter to find.

**THE NEGATIVE CHECKS, RUN RATHER THAN ASSERTED.** All twelve rows were passed through the
detectors transcribed from the shipped source: `CONTRAST_SHAPES`, `SPECIFICATIONAL_COPULA`,
`RECORD_CITATION`, `FUTURE_INDICATIVE`, `BARE_RELATIVE`, the `closers.abstractNounRate` suffix set
`(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$`, `CLOSE_KINDS.pronoun`, `QUANTIFIERS`,
`SUPPLY_CLAIM_LEXICONS.processing` and `.route`, all four `PROVENANCE_LEXICONS` families,
`AUTHORED_MAGNITUDES`, `COUNT_NOUNS`, arm C3's pastness set (`had|were|was|used to|once|formerly|
no longer`), plus the hand rules (one sentence; no digit, em dash, colon, semicolon, question,
exclamation, percent; no `which`; no `and`; no adverb in `-ly`; no participial or existential
opener; no opener on the proper slot, T-F8; every row names `{settlement}`; 8 ≤ words ≤ 15).
**Findings: 0 of 12.** `condition` now appears twice rather than three times and `state` twice;
`pressed`, the pool key's own participle and a member of `SUPPLY_CLAIM_LEXICONS.processing`, stays
absent, as do all thirteen of its siblings.

**PER FACE — the clause that licenses each claim, and nothing else it carries.** Every one of the
twelve asserts exactly ONE typed claim: *that `settlement.config.monsterThreat` holds, as a
STANDING fact of the record* (card, `reads` + `may claim`). MOVE `PRESENT` on a standing
configuration field (MOVE-GRAMMAR §1.2 row 1, V1 at §2.1); FORM `sentence`; RELATION `addition`,
so the composer supplies the empty opener and no face carries a connective of its own.

*Variant 1 — the country is dangerous ground (the flat civic fact).*
- `[plain]` **The country that lies around {settlement} is dangerous ground.** (9) Unchanged from
  round 2 and byte-identical; it is the variant's canonical-at-zero line and carries no defect.
  `dangerous ground` is a comparison stated as a measurement in words, never a figure (R-DA-11).
  Close: OBJECT.
- `[face]` **Rough country runs up against {settlement} in the common case.** (10) The same claim
  in the pool's bluntest, most monosyllabic vocabulary; `runs up against` is literal adjacency,
  not a figure, and the density law (§21.4) admits idiom that rewards the reader. Close:
  CONDITION.
- `[face]` **Danger holds close about {settlement} as a fixed feature of that hard country.** (13)
  Abstract subject, longest line of the variant. `fixed feature` is the clerk classifying the
  standing half of the card's own `may claim` clause, which is not a second assertion. Close:
  OBJECT.
- `[face]` **About {settlement} the ground carries danger of the standing kind.** (10) The
  variant's one inverted rhythm — a fronted adverbial, the slot second, never first (T-F8).
  Close: ABSTRACTION.

*Variant 2 — the country is not quiet (the sibling band rejected by name).*
- `[plain]` **The ground about {settlement} is not quiet ground.** (8) Unchanged and
  byte-identical. The rejected alternative is `quiet`, the discriminating word of the sibling
  spine key `WALLED-QUIET` (walls, no live threat), so R-DA-02's contrast licence is met on its
  own terms; the contrast sits in the predicate, not the subject; it matches no member of
  `CONTRAST_SHAPES`. Close: OBJECT.
- `[face]` **Hard country lies about {settlement} where quiet would otherwise stand.** (10) The
  round-3 substitution described above. The subordinate clause names the sibling band as the
  alternative that does not obtain — one claim, on one field. Close: STANDING FACT.
- `[face]` **In the country around {settlement}, unquiet is the ordinary state.** (10) The
  asserted state fronted after an adverbial; `unquiet` is the state, not the rejected
  alternative, so wall 5 is not engaged. Close: CONDITION.
- `[face]` **Unquiet ground sits about {settlement} in the plain way of that country.** (12) The
  same claim with the state carried on the subject noun. Close: OBJECT.

*Variant 3 — the danger is present and continuing (the standing aspect of the same fact).*
- `[plain]` **The threat about {settlement} stands as a present condition of the country.** (12)
  Unchanged and byte-identical; the copula kept and the expletive struck (R-DA-07). Close: OBJECT.
- `[face]` **Danger of the continuing kind is the plain condition of {settlement}'s country.**
  (12) Unchanged. The possessive on the proper slot follows the shipped spine `UNWALLED-LARGE` 1's
  own `{settlement}'s weight` and asserts no tenure, only the surround. Close: OBJECT.
- `[face]` **Live danger runs through the country about {settlement} as a standing state of the
  ground.** (15) Unchanged. `live` is this block's own STATE-KEY word for the value ("walls, live
  threat"); the length is the pool's ceiling, set so the passage's added sentence is not the
  metronomic twin of a spine (R-DA-05). Close: OBJECT.
- `[face]` **Trouble in the country about {settlement} is present.** (8) The round-3 substitution.
  The pool's short line, the flattest statement the aspect admits. Close: CONDITION.

**THE THREAD (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1), READ AT ALL FOUR SEAMS.** The
modifier is seated last and its change of subject — from the town and its absent wall to the
country the town sits in — IS the passage's one turn outward, which §1.4.1 licenses when it sits
last. It also hands something back at every seam: every face names `{settlement}`, the spine's own
subject, and every face carries `country` or `ground`, the noun `UNWALLED-SMALL` 2 itself hands
forward in "the country and the town simply agree to differ". Read after each spine in turn, no
face changes subject mid-passage and none hands nothing back. **The after-a-sibling reading is
VACUOUS here and is reported as vacuous rather than claimed as passed:** the block's other three
modifier pools attach only to the walled keys, so no sibling modifier ever precedes this one.

**SLOTS AND MARKS.** `{settlement}` only, in all twelve, never first. Slot sets are byte-equal
across each variant's four faces (arm A6). Marks are EMPTY on all twelve: the card reads
`audience: player (no mark)` and `covert: no`, so the `dm-only` rule in the brief governs the
sibling pool `watch: bought (covert)` and never this one.

**WHAT THE CARD'S `may NOT` KEPT OUT, CLAUSE BY CLAUSE.** No count and no band word; no cause
(nothing says why the country is hard); no season; no future; no standpoint; no second fact; no
civic object of the class `wall`; and no word touching either field the attached spines test
(`forces.walls.present`, `settlement.tier`). That last is why not one face says *town*, *village*
or *size*: the pool attaches to `UNWALLED-SMALL` (village and below) AND `UNWALLED-LARGE` (town
and above), so a tier noun would be false on half the cells and would claim a barred field. It is
also why `open` and `openness` are absent — they are `UNWALLED-LARGE` 1's own words for the wall's
absence, and the wall is the class the card bars. No quantifier appears, so arm C4's totality limb
cannot fire; the refused columns are untouched — no totality over persons, no exemption, no named
character, no theological claim.

**REFUSALS — EIGHT, each a result.**

1. **THE SET IS UNSATISFIABLE FROM THIS SEAT ON THE GATE'S THREE MEASURES.** Measured above:
   48 of 48 findings sited on the spine, 0 on the modifier, in round 2 and round 3 alike. This is
   the §21 "unsatisfiable set is a sitting row" case, not the DRY case, and the difference is that
   the cure exists and has an owner — it is simply not this packet's. Recorded here so the row is
   put to the sitting rather than re-found in round 4.
2. **TWO DETECTOR EXPLOITS FOUND, TESTED, AND REFUSED — reported because a false green is worse
   than a red.** Arm Q's segmenter splits on `/(?<=[.?!])\s+(?=[A-Z"'(])/`. `{` is not in that
   character class. **CONFIRMED by execution:** a face opening on `{settlement}`, or on a
   lower-case word, collapses the composed unit from 2 raw segments to 1, which puts the spine's
   unlicensed post-semicolon segment into the same segment as the modifier's slot — and the
   walker licenses it. Either one takes this pool from 48 findings to 12 without changing one
   fact. **Both are refused.** The slot opener breaks T-F8 (a sentence face may not open on a
   `proper`-typed slot) and is a FALSE green besides: at render the slot becomes a capitalised
   name and the split reoccurs, so the finding is hidden from the walker and not from the reader.
   The lower-case opener breaks ARCH §2.5's seam contract (a sentence-form row begins on a
   capital). The hazard is the walker's to close, not a wording to be bought.
3. **THE ROAD CITATION IS REFUSED, and the refusal is re-stated with its measurement.** The card
   licenses a source — `source: road · standing LICENSED`, "a citation of this holder is licensed
   where the provenance budget allows". The budget does not exist: MOVE-GRAMMAR §4.4.3 sets the
   rate at the sitting from the measured taste, and arm A13 reads `provenance: {citations: 0,
   a13: 0}` for this pool in the gate's own JSON. With three semantic variants, one cited variant
   is one draw in three against a rate nobody has set, and a citation authored before the budget
   is cut is the habit amendment S3 forbids ("Never 'according to' by habit"). The face banked for
   the sitting, carried unchanged from rounds 1 and 2 and never trimmed:
   *"What comes from the road puts {settlement}'s country down as dangerous ground."*
4. **`{defwork}` IS REFUSED ON EVERY FACE.** The bag offers `{defwork: bare-common}`, but the
   block's own SLOTS line says a settlement with no wall-class row is not offered a variant that
   needs one, and this pool attaches ONLY to `UNWALLED-LARGE` and `UNWALLED-SMALL`, where by
   construction no wall-class institution exists to fill it. The card independently bars "another
   civic object of the class `wall`". A `{defwork}` face would be unreachable at every draw
   (arm D) and unlicensed if it were reached.
5. **NAMING WHAT PRESSES THE COUNTRY IS REFUSED.** The field is a family, not a roster: no
   creature, patrol, raid or night-watch particular is held by anything this pool reads. Writing
   one is hollow specificity (fault 24) and breaks the setting-agnostic scope. This is why the
   three variants differ by ANGLE — the ground · the absent quiet · the standing aspect — and
   never by fact.
6. **A BAND WORD IS REFUSED.** ARCH §8.3 would license a face naming a band word instead of a
   slot, but the predicate fires on TWO families (`measuredMonsterFamily ∈ {plagued, frontier}`),
   so either word in the surface would over-claim on half the cells the pool serves. Every face
   names the slot instead — which is also what keeps arm Q's first shape at zero.
7. **A TIER NOUN IS REFUSED** — see the `may NOT` paragraph above. It costs the set the block's
   easiest thread word ("the town", which every attached spine uses); the substitute is
   `{settlement}` plus `country`/`ground`. Recorded rather than worked around.
8. **THE TWO PRE-EXISTING `T-F12` ATTACH REFUSALS ARE NOT CURABLE FROM THIS PACKET.**
   `ATTACH UNWALLED-LARGE` and `ATTACH UNWALLED-SMALL` both refuse because the spine's key and
   this modifier's key name the same civic object class `wall` — the modifier's key string
   contains `unwalled`, which is the class name the census emits, and the guard reads the KEY, not
   the text. The refusal is on the keys, not on any wording, and both are waived only under
   `--taste`. No face can move it: a writer may not re-key a pool (A7/A17), and the two keys are
   the ones the card's ATTACH line names. Carried, not worked around.

**ONE THING A REFUTER SHOULD LOOK AT FIRST.** `Hard country lies about {settlement} where quiet
would otherwise stand.` is the round's substantive wording change, and the question it invites is
whether the subordinate `where` clause is a SECOND FACT (R-DA-03, arm Q) rather than the same fact
stated by its rejected alternative. The reading taken here is that it is one fact on one field:
the clause names the sibling band `WALLED-QUIET` as the state that does not obtain, which is
exactly what R-DA-02's contrast licence is for, and it names no second typed field — which is why
arm Q, whose test is precisely "does this segment name a second field", is not reached by it in
any of the 48 units. If the chair reads the clause as a qualification, the cure is a further
one-for-one substitution inside variant 2 and never a removal.

**STANDING.** CONFIRMED for every count and every tally in this note: the round-2 figures are read
out of the gate's own `measure-draft.json`, and the round-3 figures come from scripts run in this
seat's scratchpad whose transcription of the shipped arms is controlled by reproducing that JSON
to the digit and to the clause string. PLAUSIBLE for the band arms, which cannot be executed from
this seat; the executable proof of those is the gate's own re-run.
