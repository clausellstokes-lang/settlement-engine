1. `[plain]` The food eaten at {settlement} comes into the town from other parts.
   - `[face]` Into {settlement} comes the food the town lives on.
   - `[face]` Victuals at {settlement} are fetched in from elsewhere.
   - `[face]` At {settlement}, the food that comes in from outside feeds the town.
2. `[plain]` What the town at {settlement} eats is carried to it from outside.
   - `[face]` For what it eats, {settlement} looks to what comes in.
   - `[face]` Carried in from elsewhere, the food at {settlement} keeps the town fed.
   - `[face]` The town's eating at {settlement} rests on what is carried to it from other parts.
3. `[plain]` The stores at {settlement} fill with what arrives.
   - `[face]` Out of other places comes the food that {settlement} lays up in store.
   - `[face]` What fills the store that {settlement} keeps is drawn from other places.
   - `[face]` What {settlement} puts by in store is carried food.

--- NOTES

Seat: Opus 5 — Fable-unvalidated · block DS-DEF-2 · pool `stores: import-fed` · ARM A REFINEMENT
(§21 phase 2, §21.1 the ceiling, §21.3 one effort, §21.4 the density law) over `draft-round-4.md`.
A DIFFERENT AUTHOR from the drafter, by the taste's design (§23). 3 variants · 12 faces in, 12
faces out, one for one: no variant added or dropped, no face added or dropped, nothing trimmed.
The typed annex lines (ROLE `modifier` · FORM `sentence` · MOVE `PRESENT` · READS
`settlement.economicState.foodSecurity.label` · RELATION `addition` · ATTACH `Disasters & Famine:
granary AND hospital`) are unchanged and are not repeated here. The licence card was re-printed
first (`node scripts/prose-licence-card.mjs DS-DEF-2 'stores: import-fed'`), the three spines this
modifier seats behind were re-read at `RECEIPT_POOLS_DOSSIER_STATE.md:2700-2702`, and the shipped
detectors were read from source — `entryLexicons.js`, `moveGrammar.js` CLAUSE_DETECTORS,
`composedWalker.js` A3/A5/A6/A9/A13, `entryWalker.js` armQualify/armExhaustivity,
`proseFingerprint.js` RATE_METRICS — so every claim below is read off an instrument, not guessed.

## WHAT CHANGED, FACE BY FACE (one line each; the law behind each change is named)

1.`[plain]` `is brought into` → `comes into`: "brought" imports a carrier the card does not
  license (the outside is a SOURCE, never an agent — draft refusal 10), and the arrival now
  stands with no actor behind it, which is the only shape a standing label can carry.
1.1 `the food the town eats` → `the food the town lives on`: the inversion now closes on the
  standing DEPENDENCE the label holds rather than on the repeated act of eating, and it frees
  `eats` for the two faces whose subject is the town (R-DA-04's varied close; §21.1's sharper fact).
1.2 `Provision … is fetched` → `Victuals … are fetched`: the antique air moves into the NOUN,
  which is the one place the register card licenses it ("never in the syntax"), and `provision`
  — a `-sion` word one edit away from an abstract closer — leaves the pool altogether.
1.3 `food is a thing carried in` → `the food that comes in from outside feeds the town`: `a thing`
  is the abstraction the record does not name (CLOSE_KINDS.abstraction's own noun); the face now
  names what the food DOES for the town, lands on the civic noun, and threads all three spines.
2.`[plain]` `What is eaten at {settlement} is carried to the town from outside` → `What the town at
  {settlement} eats is carried to it from outside`: the doubled locative goes, the town becomes the
  eater rather than a second address, and the row keeps the pool's plainest statement of the claim.
2.1 `looks to other places` → `looks to what comes in`: the object of the dependence idiom becomes
  the licensed fact (the arrival) instead of a vague plural place, so the strongest idiom in the
  pool now carries content at both ends; the fronted phrase and its comma are kept.
2.2 `Carried in, the food at {settlement} feeds the town` → `Carried in from elsewhere, … keeps the
  town fed`: the participle gains the source the draft left implicit (the card's only licensed
  content), and `feeds` becomes `keeps fed`, a standing state rather than a repeated act.
2.3 `The town at {settlement} is kept fed from other parts` → `The town's eating at {settlement}
  rests on what is carried to it from other parts`: the pool's one long line, and the only face
  that states subject, relation, mechanism and source together; `rests on` is the shipped register's
  own verb (`survival here rests on terrain`), and the opener `The town's` breaks the frame the
  draft's `The town at {settlement}` had begun to set.
3.`[plain]` `are filled with what arrives` → `fill with what arrives`: a live intransitive replaces a
  stative passive in a pool that already carries four be-passives (1.2, 2.`[plain]`, 2.3, 3.2), and
  the row drops to eight words, which widens the length spread the refinement is measured on.
3.1 `Out of other places comes the food that {settlement} lays up in store` — the inversion and its
  archaic `lays up` are the draft's best line and are HELD verbatim under §21.4: every rewrite tried
  either traded its density for plainness or added a claim (a season, a carrier, a count), and a
  change with no law behind it is the regression that clause names.
3.2 `Food from other parts fills the store that {settlement} keeps` → `What fills the store that
  {settlement} keeps is drawn from other places`: `drawn` is a clerk's verb the pool did not hold,
  the sentence now opens on the contents rather than on a bare noun phrase, and the close moves off
  `keeps` so the variant stops ending twice on the holding.
3.3 `What {settlement} puts by in store is carried food` — HELD verbatim: `puts by` and the bare
  predicate `carried food` are the most compressed lawful line in the set, the density law's own
  case, and nothing in one effort improved it without lengthening it for its own sake.

## THE POOL'S MEASURES, BEFORE AND AFTER (round 4 → refine A)

| named target (§21.1) | round 4 | refine A | ground |
|---|---|---|---|
| within-pool length spread, sample sd | 8–13, sd 1.850 | **8–15, sd 2.174** (12·9·8·12 / 12·10·12·15 / 8·13·12·9, mean 11.0) | R-DA-05; gained by ONE full statement (2.3) and TWO genuinely spare lines (1.2, 3.p), never by padding |
| distinct two-word openers | 12 of 12 | **12 of 12** (`the food` · `into {}` · `victuals at` · `at {}` · `what the` · `for what` · `carried in` · `the town's` · `the stores` · `out of` · `what fills` · `what {}`) | A11 spread, `composedWalker.js:574` |
| faces opening on the same two words as their spine | 0 | **0** — no face opens `the town`, `{} holds` or `neither a` | `openers.sameOpenerAsPreviousRate` over the composed sequence |
| distinct closing words | 11 of 12 | **11 of 12** (`parts` twice, in two different variants; `on` · `elsewhere` · `town` · `outside` · `in` · `fed` · `arrives` · `store` · `places` · `food`) | R-DA-04 |
| close KINDS | four | **four** — a source phrase, a condition close on the verb (`feeds the town`, `keeps the town fed`), an object close on a civic thing (`in store`, `carried food`), a standing-fact close (`what arrives`, `what comes in`) | R-DA-04: the KIND varies, the position never |
| verbs over the pool | 9 | **11** — `comes` · `lives on` · `fetched` · `feeds` · `carried` · `looks to` · `keeps fed` · `rests on` · `fill` · `lays up` · `drawn` | the WORD may recur, the FACT must not |
| nouns for the one fact | food · provision · town · store · stores | food · **victuals** · **eating** · town · store · stores | R-DA-18 — the antique air in the noun |
| faces carrying a literal noun from ALL THREE spines | 5 of 12 | **8 of 12** (1.p, 1.1, 1.3, 2.p, 2.2, 2.3, 3.1, 3.2); the other four take §1.4.1's second limb, the turn outward, which is this modifier's seat in all 36 units | §1.4.1 THE THREAD |
| the `at {settlement}` locative frame | 7 of 12 | **7 of 12 — HELD, not improved** (recounted on the draft: 1.`[plain]`, 1.2, 1.3, 2.`[plain]`, 2.2, 2.3, 3.`[plain]`); five faces place the slot as a subject, an object or a relative's head, as before | fault 5, the template by the back door; a modifier may not open on the slot (A9), so the locative tag is the cheapest lawful placement and one effort did not lower it |
| PROVENANCE moves | 0 | **0** — the card reads `source: (none) · standing SOURCE-UNRESOLVED · NO citation is licensed` | arm A13, §4.4.3 |

## WHAT DID NOT MOVE, AND WHY THAT IS THE HONEST ANSWER

- **Band position is a CONSTANT of this grain and no wording touches it.** `bandPositionOf`
  fingerprints ONE face at a time (`taste-measure.mjs:195-227`), and a one-sentence unit has no
  neighbour, so `wordsPerSentence.neighbourVariation` is 0 by construction and reads 1.597
  band-widths UNDER for every face — the deepest exceedance in the base measurement, and identical
  across all twelve faces of all seven pools of the taste (verified in `measure-draft-base.json`:
  every face row is `scored 21 · exceeded 13 · exceededShare 0.619 · meanDistanceFromMedian 0.486`).
  BUDGET (0.619 ≤ 0.667) and DEPTH (1.597 ≤ 1.75) hold under §16.2's ENTRY numbers, as before.
  What a face CAN move here it moves the right way: no face is under eight words
  (`shareUnder8` 0), none over twenty-two, none closes on an abstract-suffix noun or a pronoun
  (the 8.6-band-width trap the covert pool took), and none carries a semicolon, colon, em dash,
  question, exclamation, parenthesis, quotation, digit, `-ly` adverb, `-ing` opener, `There is`
  opener, triad, `X-ed and Y-ed` pair or `, which` tail.
- **The 24 inherited WITHHELD are the spine's and are untouched.** 12 `Q` on the `[ledger]`
  spine's post-semicolon clause and 12 `A3` on the `[counterforce]` spine's `rather than in the
  luck`. Re-checked against the arms this round: `armQualify` (`entryWalker.js:836-847`) reaches a
  segment only as a second sentence or a post-semicolon part, and returns as soon as the segment
  names a slot — so every one of these twelve faces is licensed there by naming `{settlement}`, and
  no face can enter the spine's own segment; `armA3` cuts its alternative at the first `.`/`;`/`,`
  after the phrase, which ends inside the spine. The refusals stand exactly as the draft banked
  them (its refusals 1, 2, 3) and are a sitting row, not this packet's to cure.
- **The pool's OWNED verdicts were PASS 36 of 36 with zero findings before this round, and every
  arm was re-walked by hand after it**: slot set and mark set byte-equal to parent (A6); sentence
  form, capital opener, terminal stop (A9); no `CONTRAST_SHAPES` member (A3); no `BAND_PHRASES`
  reading (A1); no `SPECIFICATIONAL_COPULA` (`is what` / `is the one` / `^The … is the …`) (arm X);
  no `QUANTIFIERS`, no `AUTHORED_MAGNITUDES`, no `COUNT_NOUNS`, no `OFFICE_NOUN_CANDIDATES`, no
  `DUTY_PREDICATES`, no `SUPPLY_CLAIM_LEXICONS` route or processing word, no `PROVENANCE_LEXICONS`
  capacity, spatial, actor or dated phrase, no `FUTURE_INDICATIVE`, no `RECORD_CITATION` (arms C2,
  C3, C4, D, A13). `classifyMoves` returns `['PRESENT']` on all twelve — no ABSENCE, CONSEQUENCE
  (`comes out of` is absent by design), HISTORY, INSTITUTION, TRADITION (`is kept in` avoided),
  GEOGRAPHY or OBJECT detector fires — so the declared level-1 grammar V1 is honest.
- **Still one level-1 grammar, still by the licensing filter and not by flatness** (draft refusal
  18): of V1–V8 only V1 is licensable on a block with no `none-exists`, `not-held`, named-object,
  institution, unresolved-value, structural-consequence or event-provenance field. The variation
  lives in subject, verb, length and rhythm, which is where §3.1 puts it.
- **Every draft refusal is inherited unchanged** (a count, a cause, a season, a route or carrier, a
  named good, a second civic object of the class `store`, the granary or the sick-house the spine
  tests, an edge or a future, a second fact, a cleft, a citation, `the people` as a totality over
  persons, the negative half of the label, an act by the exporting place). Two are re-earned this
  round by wording that came close and was refused: `at second hand` for 1.2 (an evaluative idiom
  with no rating field behind it) and `whatever the town eats` for 2.p (an unmarked totality over
  the town's food, which the label does not carry) — §21.3, the licensed wording wins.
