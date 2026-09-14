1. `[plain]` The country around {settlement} is dangerous ground.
   - `[face]` Pressed country is where {settlement} keeps house.
   - `[face]` Danger is a condition of the country {settlement} is set in.
   - `[face]` Hostile ground begins outside {settlement}, and the record enters the country under that head.
2. `[plain]` The ground about {settlement} is not quiet ground.
   - `[face]` Quiet is not the word the record has for {settlement}'s country.
   - `[face]` Trouble sits in the country about {settlement}, and sits there as a rule.
   - `[face]` Unquiet is the plain state of the country about {settlement}.
3. `[plain]` The threat about {settlement} stands.
   - `[face]` Danger of the continuing kind lies in the country about {settlement}.
   - `[face]` Live danger runs in the country about {settlement}, and runs there in the ordinary course.
   - `[face]` The pressure of the country on {settlement} holds, and holds at present.

--- NOTES

**THE ONE CLAIM, AND WHERE IT COMES FROM.** Every one of the twelve faces asserts exactly one
typed claim and no other: *that `settlement.config.monsterThreat` holds, as a STANDING fact of
the record* (card, `may claim`). The move is `PRESENT` on a standing configuration field
(MOVE-GRAMMAR §1.2 row 1); the form is `sentence`, opening on a capital that is not the
`proper`-typed slot and closing on its own stop (ARM A9, the seam contract, T-F8); the relation
is `addition`, so the composer supplies the empty opener and no face carries a connective of
its own (ARCH §6.1 CONNECTIVES). Nothing in the twelve names a second field, so ARM Q is never
reached and no face is a QUALIFY.

**SLOTS.** `{settlement}` only, in every face, never as the first word. The bag also offers
`{defwork}` and no face uses it — see REFUSAL 2. Every face names a slot, so none is the
unlicensed summarising beat of ARCH §8.3 / arm Q (S14). Slot sets are byte-equal across each
variant's four faces (ARM A6); marks are empty on all twelve (card: `audience: player (no
mark)`), so nothing here carries `dm-only`.

**PER FACE — the licence for each claim it makes.**

*Variant 1 — the country is dangerous ground (the flat civic fact; closes on the ground, the
house, the seat, the head).*
- `[plain]` "The country around {settlement} is dangerous ground." — one claim: the threat
  holds (card `reads` + `may claim`). "dangerous ground" is a comparison stated as a
  measurement in words, not a figure (R-DA-11). `{settlement}` is the bag's filled slot. Close
  kind: object.
- `[face]` "Pressed country is where {settlement} keeps house." — same single claim; "pressed"
  is the pool key's own word for the value class, carried as an adjective so nothing inanimate
  acts with intent (R-DA-11). "keeps house" is idiom for dwelling, not a figure; the density
  law (Part B §21.4) admits idiom that rewards the reader. Close kind: object.
- `[face]` "Danger is a condition of the country {settlement} is set in." — one claim, stated
  as the country's condition; the trailing relative locates the settlement inside its own
  country, which is given by the block's own subject and adds no field (not a second fact under
  the card's `may NOT`). Close kind: standing fact.
- `[face]` "Hostile ground begins outside {settlement}, and the record enters the country under
  that head." — one claim; the coordinate clause is the COMPILER'S STANCE, not a second fact —
  the register card's "the compiler shows only through what the record holds". "the record" is
  a common noun and not one of the holder table's twelve KINDS, so `provenanceCount` is 0 and
  ARM A13 does not fire (`moveGrammar.js` CLAUSE_DETECTORS, PROVENANCE row: the narrowed
  vocabulary, generic reporting struck at SEAM car 5c). Used in 2 of 12 faces only, so the
  stance is not a habit. Close kind: object.

*Variant 2 — the country is not quiet (the sibling band rejected by name).*
- `[plain]` "The ground about {settlement} is not quiet ground." — one claim, stated
  negatively. The rejected alternative is a SIBLING BAND named by the block's own word: `quiet`
  is the discriminating word of the sibling spine key `WALLED-QUIET` ("walls, no live threat")
  and of the calm tier the predicate excludes, so R-DA-02's contrast licence is met on its own
  terms. It is not fronted as the subject, is not a bare "X, not Y", and matches none of
  `CONTRAST_SHAPES` (`entryLexicons.js:304` — no comma-and-terminator, no "but", no "rather
  than", no "less … than"). Close kind: object.
- `[face]` "Quiet is not the word the record has for {settlement}'s country." — same claim and
  same licensed contrast; the record's stance again (stance face 2 of 2). Possessive on the
  proper slot follows the shipped spine `UNWALLED-LARGE[1]`'s own "{settlement}'s weight".
  Close kind: a name given.
- `[face]` "Trouble sits in the country about {settlement}, and sits there as a rule." — one
  claim, stated positively; "as a rule" carries the STANDING half of the licence (card: *as a
  STANDING fact*) as a habitual, never a future — no bare future indicative anywhere in the set
  (A2, R-DA-07; NON_MOVES.FORECAST does not fire). Close kind: condition.
- `[face]` "Unquiet is the plain state of the country about {settlement}." — one claim, the
  copula kept and the expletive struck (R-DA-07); the inversion is word order, which B-CLAIM
  makes spendable. Close kind: a name given.

*Variant 3 — the danger is present and continuing (the standing aspect of the same fact).*
- `[plain]` "The threat about {settlement} stands." — one claim; five words, the short line the
  register card licenses ("The short line exists"), and the pool's rhythmic relief (R-DA-06's
  `< 8 words` floor). Close kind: standing fact.
- `[face]` "Danger of the continuing kind lies in the country about {settlement}." — one claim;
  "of the continuing kind" is the clerk classifying the standing fact, licensed by the same
  `may claim` clause and by nothing else. Close kind: a name given.
- `[face]` "Live danger runs in the country about {settlement}, and runs there in the ordinary
  course." — one claim; "live" is the estate's own word for this value ("walls, live threat" in
  this block's own STATE-KEY line); "in the ordinary course" is the standing half again, in a
  third vocabulary. Close kind: condition.
- `[face]` "The pressure of the country on {settlement} holds, and holds at present." —
  one claim; the repeated verb is rhythm, not a second assertion. "pressure … on" is the pool
  key's own noun and is a measurement in words, not intent. Close kind: standing fact.

**THE THREAD (owner, 2026-09-08 ~21:4x).** Each face is written to stand as the passage's ONE
TURN OUTWARD, placed last: the spine states the town's own arrangement and the modifier turns
to the country it sits in. The turn is anchored twice — every face names `{settlement}`, and
ten of the twelve carry the noun "country" or "ground", which `UNWALLED-SMALL[2]` hands forward
in "the country and the town simply agree to differ". Read after each of the four shipped
spines in turn, no face changes subject in the middle of the passage and none hands nothing
back. No other modifier pool in this block attaches to `UNWALLED-LARGE` or `UNWALLED-SMALL`
(the block's other three modifiers attach to the walled keys only), so the after-a-sibling
reading is vacuous here and is reported as such rather than claimed as passed.

**WHAT WAS KEPT OUT, CLAUSE BY CLAUSE (the card's `may NOT`).** No count and no band phrase
(no member of `BAND_PHRASES`, `COUNT_NOUNS`, `CARDINAL_WORDS` or `AUTHORED_MAGNITUDES` appears);
no cause (nothing says why the country is pressed); no season; no future (no "will", no
"shall"); no standpoint (no traveller, no reader, no observer); no second fact; no civic object
of the class `wall`; and no word touching either field the attached spines test —
`forces.walls.present` and `settlement.tier`. The last of these is why not one face says "town"
or "village": the pool attaches to `UNWALLED-SMALL` (village and below) AND `UNWALLED-LARGE`
(town and above), so any tier noun would be false on half the cells and would claim a field the
card bars. No quantifier from `QUANTIFIERS` is used ("no", "every", "all", "any", "only" are
absent by construction); the refused columns are untouched — no totality over persons, no
exemption, no named character, no theological claim.

**THE FOUR NEGATIVE CHECKS I RAN BY HAND OVER ALL TWELVE FACES.** Zero em dashes, zero digits,
zero percent signs, zero exclamation marks, zero question marks, zero semicolons, zero colons,
zero `, which`. Zero matches for `NON_MOVES.FORECAST`, `.MEANING`, `.VERDICT`; zero matches for
the ABSENCE, CONTRADICTION, PROVENANCE, OPEN and CONSEQUENCE clause detectors in
`moveGrammar.js`, so the classifier should read every face as `PRESENT` and agree with the
declared MOVE. No face closes on a pronoun (`CLOSE_KINDS.pronoun`) — this cost one draft line
that ended "a present one." and was rewritten. CONFIRMED, not reasoned: the shipped classifier
was run over all twelve faces in the dock (`node -e` over
`src/domain/prose/moveGrammar.js`, read-only) and returned `["PRESENT"]` for every one, with no
`NON_MOVES` detector firing on any — the tag and the text agree, which is what arm A asks. Openers: all twelve first-two-word pairs are
distinct (The country · Pressed country · Danger is · Hostile ground · The ground · Quiet is ·
Trouble sits · Unquiet is · The threat · Danger of · Live danger · The pressure), so A11's
shared-opener finding cannot fire within the pool, and the three `[plain]` lines differ from
one another in their first two words.

**LENGTHS (words, slot counted as one).** V1 7 · 7 · 11 · 14 — V2 8 · 11 · 13 · 10 —
V3 5 · 11 · 15 · 12. Mean 10.33, min 5, max 15, standard deviation 2.92 (measured). The `sentence` form
carries no word ceiling in the harness (`taste-measure.mjs:512`: the ceiling of 12 is the
FRAGMENT's), so the band aimed at is the interior of the register's own sentence distribution
with the modifier's seat taken into account: these ride SECOND in a composed unit behind spines
of 15 to 26 words, so a modifier at the spine's length would make a two-sentence passage of
even weight, which is the metronome R-DA-05 names. One face at 5 and one at 15 give the pool
its spread; nothing sits at the `> 30 words` or the `< 8 words` edge except the deliberate short
line, which R-DA-06 wants at a floor rather than a ceiling.

**REFUSALS — five, each a result.**

1. **THE ROAD CITATION IS REFUSED, AND THE REFUSAL IS MEASURED.** The card licenses a source:
   `source: road · standing LICENSED`, "a citation of this holder is licensed where the
   provenance budget allows". The budget does not exist: ARM A13 reports the COUNT and declares
   every licensing question NOT-EXECUTABLE until the sitting sets the rate from the bands
   (MOVE-GRAMMAR §4.4.3; ARCH §8.4). The rate a citation would carry here is not small — this
   pool holds three semantic variants, so one cited variant is one draw in three, 0.333, and
   four of twelve faces; the shipped estate's own measured rate for the shape is 7 of 2,266
   variants, 0.0031 (`moveGrammar.js` PROVENANCE docblock, MEASURED at this tip). A hundredfold
   departure authored before the budget exists is the habit S3 forbids ("Never 'according to'
   by habit"), so no face cites. The face I would have written, banked here and not trimmed:
   *"What comes from the road puts {settlement}'s country down as dangerous ground."* — it is
   lawful on the card's `source` line and on nothing else, and it is the row for the sitting to
   rule on when the provenance budget is cut.
2. **`{defwork}` IS REFUSED ON EVERY FACE.** The bag offers `{defwork: bare-common}` but the
   block's own SLOTS note says a settlement with no wall-class row is not offered a variant
   that needs one, and this pool attaches ONLY to `UNWALLED-LARGE` and `UNWALLED-SMALL`, where
   by construction there is no wall-class institution to fill it. The card independently bars
   "another civic object of the class `wall`". A face naming `{defwork}` would be unreachable
   at every draw (ARM D) and unlicensed if it were reached.
3. **NAMING WHAT PRESSES THE COUNTRY IS REFUSED.** The field is a tier, not a roster: no
   creature, patrol, raid, bar-the-doors-at-dusk or night-watch particular is held by anything
   this pool reads. Writing one would be hollow specificity (fault 24) and would break the
   setting-agnostic scope. This is the constraint that makes the pool thin, and it is the
   honest reason the three variants differ by ANGLE (the ground · the absent quiet · the
   standing aspect) rather than by fact.
4. **A BAND WORD IS REFUSED.** ARCH §8.3 would license a face that names a band word instead of
   a slot, but the predicate fires on TWO families — `countryIsPressed` returns true for
   `plagued` and for `frontier` (`src/domain/display/stateProse/defenseStateProseCandidates.js`,
   read at this tip) — so "frontier" or "plagued" in the surface would over-claim on half the
   cells the pool serves. Every face is licensed by naming the slot instead.
5. **A TIER NOUN IS REFUSED** — see the `may NOT` paragraph above. This costs the set the
   easiest thread word in the block ("the town", which every shipped spine uses), and the
   substitute is `{settlement}` plus "the country"; it is the one place where the licence made
   the wording harder rather than sharper, and it is recorded rather than worked around.

**ONE THING A REFUTER SHOULD LOOK AT FIRST.** Four of the twelve faces carry an internal
", and" clause (V1 face 3 is a relative, not a coordinate). In every case the clause restates
the ASPECT of the one licensed fact — where it sits, how the record files it, that it holds at
present — and names no second field. If the chair reads any of them as a second fact under the
card's `may NOT`, the cure is a one-for-one substitution inside the same variant, not a
removal, and the four candidates are V1 face 3, V2 face 3, V3 face 3 and V3 face 4.
