1. `[plain]` The country that lies around {settlement} is dangerous ground.
   - `[face]` Hard country surrounds {settlement} as a standing fact.
   - `[face]` Danger holds about {settlement} as a fixed feature of that country.
   - `[face]` Hostile country lies about {settlement} in the ordinary way of that ground.
2. `[plain]` The ground about {settlement} is not quiet ground.
   - `[face]` Quiet is not what the country about {settlement} holds.
   - `[face]` In the country around {settlement}, unquiet is the plain state of the ground.
   - `[face]` Unquiet ground lies about {settlement} as the country's plain state.
3. `[plain]` The threat about {settlement} stands as a present condition of the country.
   - `[face]` Danger of the continuing kind is the plain condition of {settlement}'s country.
   - `[face]` Live danger runs through the country about {settlement} as a standing state of the ground.
   - `[face]` Trouble sits in the country about {settlement} as a settled habit.

--- NOTES

**WHAT ROUND 2 CHANGES, MEASURE BY MEASURE (the gate's four failing rows, each answered).**

1. **C3 `a processing claim on a goods sentence` ×3, on the writer's face `Pressed country is
   where {settlement} keeps house.`** — CURED at the root, not patched. `pressed` is a member of
   `SUPPLY_CLAIM_LEXICONS.processing` (`src/domain/prose/entryLexicons.js:189-192`, read at this
   tip: `salted · smoked · cured · dried · milled · tanned · brewed · forged · woven · fulled ·
   malted · pressed · refined · smelted`), and `armC3`'s supply half is ALWAYS WITHHELD on a hit
   (`entryWalker.js:554-562`), so no ground flag can clear it. The word is now absent from all
   twelve faces, and so is every other member of that list, of `PROVENANCE_LEXICONS.route`
   (`upriver`, `by road`, `inland`…), of `.actor` (`founded`, `razed`, `granted`…), of
   `.capacity` (`can hold`, `has room for`…), of `.spatial` (`ringed by`, `built along`…) and of
   `.dated` (`in the year`, `years ago`…). The pool key's own participle is therefore never
   carried into the surface — the key says `pressed`, the prose says `hard`, `hostile`,
   `dangerous`, `unquiet`, `live`.
2. **`wordsPerSentence.shareUnder8` (over) at 2.192 band-widths on 3 of 12 faces** — CURED. The
   metric is `rate(lens.filter((x) => x < 8).length)` and `bandPositionOf` fingerprints ONE FACE
   at a time (`taste-measure.mjs:190-192`), so a single-sentence face scores 1.000 or 0.000 and
   any face under eight words is the whole failure. Round 1 carried exactly three (7, 7, 5
   words). **No face in round 2 is under eight words**; the shortest are two at 8.
3. **`closers.abstractNounRate` (over) at 8.6 band-widths on 2 of 12 faces** — CURED, and the
   cause is named rather than guessed at. The closer is the sentence's last word with every
   non-letter stripped (`proseFingerprint.js:113`), so a face ending on the slot `{settlement}.`
   is measured as the word **settlement**, which ends in `-ment` and matches
   `/(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/`. Round 1's two failures were its two
   slot-final faces and nothing else. **No face in round 2 ends on the slot.** Closers are now:
   ground · fact · country · ground · ground · holds · ground · state · country · country ·
   ground · habit — not one of them matches the suffix set, and none is a member of
   `CLOSE_KINDS.pronoun` (`entryLexicons.js`). Two land in `CLOSE_KINDS.abstraction` (`fact`,
   `habit`), which is a KIND the arm wants represented, not concentrated: the pool's close kinds
   run object, abstraction, object, object, object, standing-fact, object, object, object,
   object, object, abstraction.
4. **The composed walk's `Q` ×22 and `F25` ×15** — these are the pre-existing spine's, and round
   2 makes certain the modifier adds none of either. `Q` fires on a SEMICOLON segment that names
   no slot and no band reading (`entryWalker.js:835-838`, `consider(parts[i])`), and on a second
   sentence of the same shape (`:827`). Every face here is ONE sentence, carries NO semicolon,
   and names `{settlement}`, so the `i ≥ 1` sentence of every composed unit returns licensed at
   `:819`. `F25`'s detector is `RECORD_CITATION`
   (`\b(the (rolls|register|ledger|records?|books?|charter|writ|roll)) (say|says|show|holds|…)\b`);
   round 1's two "the record …" faces are withdrawn and **no face in round 2 names a record, a
   roll, a register, a ledger or the books**. The three attached spines that carry a semicolon
   (`UNWALLED-SMALL` 1 and 2, `UNWALLED-LARGE` 1) and the one that cites the books
   (`UNWALLED-LARGE` 2) are not this pool's bytes and are not touched.

**ONE NEW HAZARD FOUND AND DESIGNED OUT (reported, because it would have cost a round).**
`SPECIFICATIONAL_COPULA` is `/\b(is|are|was|were)\s+(what|who|the only|the one)\b|^\s*the\s+[a-z{][^.]{0,60}\bis\s+the\s+[a-z{]/i` (`entryLexicons.js:332`), and `armExhaustivity`
answers a bare `is what` with a NOT-EXECUTABLE row when no office or institution column is
supplied — which is this pool's ground. Four faces of an intermediate draft used the pseudo-cleft
`X is what Y …` and were rewritten before this file was cut. `Quiet is not what the country about
{settlement} holds.` is clear of it, because the regex needs `is` immediately followed by `what`
and this line reads `is not what`; and no face opens `The … is the …`, the pattern's second arm.

**THE ONE CLAIM, AND WHERE IT COMES FROM.** Each of the twelve faces asserts exactly one typed
claim and no other: *that `settlement.config.monsterThreat` holds, as a STANDING fact of the
record* (card, `may claim`). MOVE `PRESENT` on a standing configuration field (MOVE-GRAMMAR §1.2
row 1); FORM `sentence`, opening on a capital that is not the `proper`-typed slot (arm A9, T-F8);
RELATION `addition`, so the composer supplies the opener and no face carries a connective of its
own. Nothing in the twelve names a second field, so arm Q is never reached and no face is a
QUALIFY.

**SLOTS.** `{settlement}` only, in every face, never first. Slot sets are byte-equal across each
variant's four faces (arm A6). Marks are empty on all twelve — the card reads `audience: player
(no mark)`, and this pool is `covert: no`, so nothing here carries `dm-only`.

**PER FACE — the clause that licenses each claim it makes.**

*Variant 1 — the country is dangerous ground (the flat civic fact).*
- `[plain]` **The country that lies around {settlement} is dangerous ground.** (9 words) One
  claim: the threat holds (card `reads` + `may claim`). "dangerous ground" is a comparison stated
  as a measurement in words, never a figure (R-DA-11). Close kind: object.
- `[face]` **Hard country surrounds {settlement} as a standing fact.** (8) Same single claim; the
  vocabulary is monosyllabic and the rhythm is the pool's shortest. "as a standing fact" is the
  card's own `may claim` clause carried into the surface, which is the STANDING half and not a
  second assertion. Close kind: abstraction (`fact`).
- `[face]` **Danger holds about {settlement} as a fixed feature of that country.** (11) One
  claim, with an abstract subject and a concrete close. "fixed feature" is the clerk classifying
  the standing fact, licensed by the same clause and by nothing else; "that country" points back
  to the ground the spine's town sits in and names no geography field. Close kind: object.
- `[face]` **Hostile country lies about {settlement} in the ordinary way of that ground.** (12)
  One claim; the longest of this variant, and the one that puts the standing half last as a
  manner phrase rather than a predicate. Close kind: object.

*Variant 2 — the country is not quiet (the sibling band rejected by name).*
- `[plain]` **The ground about {settlement} is not quiet ground.** (8) One claim, stated
  negatively. The rejected alternative is a SIBLING BAND named by the block's own word: `quiet`
  is the discriminating word of the sibling spine key `WALLED-QUIET` (walls, no live threat), so
  R-DA-02's contrast licence is met on its own terms. It is not a bare "X, not Y" and matches no
  member of `CONTRAST_SHAPES` (`entryLexicons.js:305` — no `rather than`, no `not … but`, no
  `, not [a-z]`, no `less … than`, no trailing `and not …`). Close kind: object.
- `[face]` **Quiet is not what the country about {settlement} holds.** (9) Same claim, same
  licensed contrast, in the copular negative; closes on the verb, which is `CLOSE_KINDS`'
  standing-fact shape and the pool's only close of that kind. Close kind: standing fact.
- `[face]` **In the country around {settlement}, unquiet is the plain state of the ground.** (13)
  One claim, stated positively out of the same contrast word; the fronted prepositional phrase is
  the pool's one inverted rhythm. Close kind: object.
- `[face]` **Unquiet ground lies about {settlement} as the country's plain state.** (10) One
  claim; the possessive on a common noun, not on the slot. Close kind: object.

*Variant 3 — the danger is present and continuing (the standing aspect of the same fact).*
- `[plain]` **The threat about {settlement} stands as a present condition of the country.** (12)
  One claim; "stands … as a present condition" is the STANDING half in the plainest words the
  register has, and the copula is kept with the expletive struck (R-DA-07). Close kind: object.
- `[face]` **Danger of the continuing kind is the plain condition of {settlement}'s country.**
  (12) One claim; the possessive on the proper slot follows the shipped spine `UNWALLED-LARGE`
  1's own "{settlement}'s weight" and asserts no tenure, only the surround. Close kind: object.
- `[face]` **Live danger runs through the country about {settlement} as a standing state of the
  ground.** (15) One claim; "live" is the estate's own word for this value (this block's
  STATE-KEY line reads "walls, live threat"), and the length is the pool's ceiling, set so the
  passage's second sentence is not the metronomic twin of a 15-to-26-word spine (R-DA-05).
  Close kind: object.
- `[face]` **Trouble sits in the country about {settlement} as a settled habit.** (11) One claim;
  "settled habit" is the standing half in a fourth vocabulary, and "settled" is an adjective, not
  the past-tense finite verb `armC3`'s semantic half withholds on (`had|were|was|used to|once|
  formerly|no longer` — none of the twelve carries any of them). Close kind: abstraction
  (`habit`).

**THE THREAD (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1).** The modifier is seated last and
its change of subject — from the town and its wall to the country the town sits in — IS the
passage's one turn outward, which is the licensed form. It hands something back twice: every face
names `{settlement}`, the spine's own subject, and every face carries `country` or `ground`, the
noun `UNWALLED-SMALL` 2 hands forward in "the country and the town simply agree to differ". Read
after each of the four attached spine variants in turn, no face changes subject mid-passage and
none hands nothing back. No other modifier pool in this block attaches to `UNWALLED-LARGE` or
`UNWALLED-SMALL` (the other three attach to the walled keys), so the after-a-sibling reading is
vacuous here and is reported as vacuous rather than claimed as passed.

**WHAT WAS KEPT OUT, CLAUSE BY CLAUSE (the card's `may NOT`).** No count and no band word; no
cause (nothing says why the country is hard); no season; no future (`FUTURE_INDICATIVE` is
`/\b(will|shall)\b/` and neither word appears); no standpoint; no second fact; no civic object of
the class `wall`; and no word touching either field the attached spines test —
`forces.walls.present` and `settlement.tier`. That last is why not one face says *town*, *village*
or *size*: the pool attaches to `UNWALLED-SMALL` (village and below) AND `UNWALLED-LARGE` (town
and above), so a tier noun would be false on half the cells and would claim a barred field. No
quantifier is used (`every`, `all`, `any`, `no`, `only`, `none` are absent by construction), so
arm C4's totality limb cannot fire; the refused columns are untouched — no totality over persons,
no exemption, no named character, no theological claim.

**THE NEGATIVE CHECKS RUN BY HAND OVER ALL TWELVE FACES.** Zero em dashes, digits, percent signs,
exclamation marks, question marks, semicolons, colons, parentheses, quotation marks and `, which`.
Zero `and` anywhere, so `shapes.triadRate` and `shapes.doubledAdjectiveRate` cannot fire and no
trailing coordinate exists to be read as a second fact. Zero words ending `-ly`, so
`shapes.adverbsPerSentence` is 0.000 on every face. No first word ends in `-ing`, so
`shapes.participialOpenerRate` is 0.000 (this cost one draft face that opened "Standing danger",
which the metric would have scored at 1.000). No face opens `There is` or `It is`. The twelve
first-two-word pairs are all distinct — The country · Hard country · Danger holds · Hostile
country · The ground · Quiet is · In the · Unquiet ground · The threat · Danger of · Live danger ·
Trouble sits — so A11's shared-opener finding cannot fire inside the pool, and the three `[plain]`
lines differ from one another in their first two words.
**Standing: PLAUSIBLE, not CONFIRMED.** Round 1's note recorded a classifier run in the dock; this
round's fence permits only `scripts/prose-licence-card.mjs` to execute there, so every statement
above is a hand-read of the shipped detectors' source (`entryLexicons.js`, `entryWalker.js`,
`proseFingerprint.js`, `taste-measure.mjs`, all read at this tip) and not an executed result. The
executable proof is the gate's own re-run.

**LENGTHS (words, a slot counted as one).** V1 9 · 8 · 11 · 12 — V2 8 · 9 · 13 · 10 — V3 12 · 12 ·
15 · 11. Mean 10.83, min 8, max 15, sample standard deviation 2.13 (measured). Every face is
inside the sentence form's interior: none under 8, none near the `> 30` ceiling, and the spread is
carried by the 8-to-15 range rather than by a short line, which is the one thing round 1 bought
its spread with and could not keep.

**NEVER TRIM — the round-1 faces this round substitutes, banked with their measurement.** Five
faces are replaced one for one inside their own variants (Part B §21.2's substitution, §22(e));
none is removed and no variant's slot moves. `Pressed country is where {settlement} keeps house.`
(C3 processing, ×3 units). `Hostile ground begins outside {settlement}, and the record enters the
country under that head.` and `Quiet is not the word the record has for {settlement}'s country.`
(record citation, F25 exposure; also the two "stance" faces). `Unquiet is the plain state of the
country about {settlement}.` and `Danger of the continuing kind lies in the country about
{settlement}.` (slot-final closers, `closers.abstractNounRate` 8.6 band-widths). Four more were
rewritten inside their own lines for length or for the trailing coordinate: `The country around
{settlement} is dangerous ground.` (7 words), `The threat about {settlement} stands.` (5),
`Trouble sits in the country about {settlement}, and sits there as a rule.`, `Live danger runs in
the country about {settlement}, and runs there in the ordinary course.`, `The pressure of the
country on {settlement} holds, and holds at present.` The count of semantic variants is unchanged
at three and the face count is unchanged at twelve; neither has fallen.

**REFUSALS — six, each a result.**

1. **THE ROAD CITATION IS REFUSED, AND THE REFUSAL IS RE-STATED WITH ITS MEASUREMENT.** The card
   licenses a source — `source: road · standing LICENSED`, "a citation of this holder is licensed
   where the provenance budget allows". The budget does not exist: arm A13 reports the COUNT and
   declares the licensing question NOT-EXECUTABLE until the sitting sets the rate from the bands
   (MOVE-GRAMMAR §4.4.3). With three semantic variants, one cited variant is one draw in three
   (0.333) against the shipped estate's measured rate for the shape; a citation authored before
   the budget is cut is the habit S3 forbids ("Never 'according to' by habit"). The face banked
   for the sitting, unchanged from round 1 and not trimmed: *"What comes from the road puts
   {settlement}'s country down as dangerous ground."*
2. **`{defwork}` IS REFUSED ON EVERY FACE.** The bag offers `{defwork: bare-common}`, but the
   block's own SLOTS note says a settlement with no wall-class row is not offered a variant that
   needs one, and this pool attaches ONLY to `UNWALLED-LARGE` and `UNWALLED-SMALL`, where by
   construction no wall-class institution exists to fill it. The card independently bars "another
   civic object of the class `wall`". A `{defwork}` face would be unreachable at every draw
   (arm D) and unlicensed if it were reached.
3. **NAMING WHAT PRESSES THE COUNTRY IS REFUSED.** The field is a family, not a roster: no
   creature, patrol, raid or night-watch particular is held by anything this pool reads. Writing
   one is hollow specificity (fault 24) and breaks the setting-agnostic scope. This is why the
   three variants differ by ANGLE — the ground · the absent quiet · the standing aspect — rather
   than by fact.
4. **A BAND WORD IS REFUSED.** ARCH §8.3 would license a face naming a band word instead of a
   slot, but the predicate fires on TWO families (`measuredMonsterFamily ∈ {plagued, frontier}`),
   so "frontier" or "plagued" in the surface would over-claim on half the cells the pool serves.
   Every face names the slot instead, which also keeps arm Q's licence at `:819`.
5. **A TIER NOUN IS REFUSED** — see the `may NOT` paragraph. It costs the set the block's easiest
   thread word ("the town", which every attached spine uses); the substitute is `{settlement}`
   plus "country"/"ground". Recorded rather than worked around.
6. **THE TWO PRE-EXISTING `T-F12` ATTACH REFUSALS ARE NOT CURABLE FROM THIS PACKET.**
   `ATTACH UNWALLED-LARGE` and `ATTACH UNWALLED-SMALL` both refuse because the spine's key and
   this modifier's key name the same civic object class `wall`, which the field guard cannot see.
   The refusal is on the KEYS, not on any wording, and both are waived only under `--taste`. No
   face can move it: a writer may not re-key a pool (A7/A17), and the two keys are the ones the
   card's ATTACH line names. Carried, not worked around.

**ONE THING A REFUTER SHOULD LOOK AT FIRST.** Round 1's flag — four faces carrying an internal
", and" clause — is gone: there is no coordinate, trailing or otherwise, in any of the twelve. The
next-sharpest question is the contrast in variant 2. Three of its four faces open on the rejected
band word (`Quiet`, `unquiet` fronted after an adverbial, `Unquiet`), and R-DA-02 bars a contrast
"fronted as the subject". The reading taken here is that the licence bars fronting the REJECTED
ALTERNATIVE as the sentence's subject-of-predication in a bare "X, not Y" shape, which none of
these is: the plain line predicates negatively of the ground, and the two `unquiet` faces predicate
positively of the state, naming no alternative at all. If the chair reads `Quiet is not what the
country about {settlement} holds.` as fronted, the cure is a one-for-one substitution inside
variant 2 and not a removal.
