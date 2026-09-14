1. `[plain]` The country {settlement} sits in is dangerous ground.
   - `[face]` Bad country runs up against {settlement}, and the land it covers is dangerous to cross.
   - `[face]` Outside {settlement} the country is dangerous and the going hard.
   - `[face]` Trouble in the country around {settlement} is the ordinary state of the ground.
2. `[plain]` The ground about {settlement} is not quiet ground.
   - `[face]` About {settlement} the country runs well short of quiet.
   - `[face]` Danger stands in the country around {settlement}, and quiet does not.
   - `[face]` Hard country lies about {settlement}, where quiet would otherwise stand.
3. `[plain]` The threat about {settlement} stands as a present condition of the country.
   - `[face]` Danger of the continuing kind holds in {settlement}'s country.
   - `[face]` Live danger sits in the country around {settlement} and stays where it sits.
   - `[face]` In the country about {settlement} the danger is present.

--- NOTES

## PER FACE — WHAT CHANGED AND WHY, ONE LINE EACH

**1 `[plain]`** — `that lies around` becomes `{settlement} sits in`: the empty relative goes and a working
one replaces it, the line holds the 8-word floor, and cutting words inside a band is editing, never
trimming (§22's own carve-out; R-DA-18 plain is not flat).

**1 face a** — round 4's `Rough country … holds hard ground` is replaced by `Bad country runs up
against {settlement}, and the land it covers is dangerous to cross`: `rough`/`hard ground` assert a
TERRAIN texture, which is `terrainType`'s fact and not this pool's read, and `dangerous to cross`
states the danger itself with no actor and no standpoint; it is also the pool's long line at 15
words, which is where the rhythm spread comes from.

**1 face b** — `About {settlement} the ground is hard and the country dangerous` becomes `Outside
{settlement} the country is dangerous and the going hard`: the gapped coordination (the pool's one
density move, §21.4) is kept, but the elided limb now lands on `the going`, the road-holder's own
kind of fact, instead of on a terrain claim the card does not license.

**1 face c** — `is the ordinary state` gains `of the ground`: the close was a bare abstract predicate
tail; it now lands on the civic noun the field names, which is R-DA-04's whole demand.

**2 `[plain]`** — CARRIED BYTE-IDENTICAL, deliberately: it is the canonical-at-zero line a falsy seed
draws, it is R-DA-02's lack stated flat with no completing `but`, and the `ground … ground` echo is
the frame that makes it ring; §21.4 makes a change with no law behind it the regression.

**2 face a** — `Around {settlement} the country does not answer to quiet` becomes `About {settlement}
the country runs well short of quiet`: `answer to` sits one letter from `answers to` in
`RELATION_LEMMAS` and leaned on that letter for its pass, and `runs well short of` is the comparison
stated as a measurement in words that R-DA-11 licenses; it also drops the `does not` this face shared
with its sibling, cutting the variant's worst sibling overlap from 5,000 bp to 2,222 bp.

**2 face b** — `in the ground about` becomes `in the country around`: the ellipsis (`and quiet does
not`) is the variant's contrast and stays, because landing it on a noun would give it a second
predicate and a second beat; the referent phrase moves off `about`, which round 4 used six times.

**2 face c** — a comma is set before `where`: the subjunctive edge (R-DA-07's licensed `would`) reads
as an edge rather than as a restrictive relative, which is the only change the line needed.

**3 `[plain]`** — CARRIED BYTE-IDENTICAL: `stands as a present condition of the country` is the card's
`may claim` clause word for word, with the copula struck for a verb of standing and the close on the
field's own noun; nothing in the register sits above it.

**3 face a** — `is the plain condition of {settlement}'s country` becomes `holds in {settlement}'s
country`: `plain` was an evaluative filler and `condition` was the plain line's word one row above;
`holds` is the licence card's own predicate verb (`that monsterThreat HOLDS, as a STANDING fact`)
rendered in world, and the face drops from 12 words to 9.

**3 face b** — `and does not lift` becomes `and stays where it sits`: `lift` is a weather verb on an
abstraction, which R-DA-11 refuses outright, and the `sits … sits` frame is the rhythm the line was
reaching for; it also takes `holds` out of this face so face a owns it.

**3 face c** — CARRIED BYTE-IDENTICAL: the pool's short flat close, already landing on the condition;
every longer form tried either added a second fact, a clock word or a gloss.

## WHAT THE ROUND MOVED, MEASURED (whitespace tokens, a slot is one token)

| measure | round 4 | refine-A | why it is the ceiling and not the middle |
|---|---|---|---|
| face lengths | 8–12, sd **1.337** | 8–15, sd **2.234** | R-DA-05: the pool is the unit of spread, and twelve faces inside a five-word band is a metronome; the spread is bought from a longer face that carries ONE fact, never from padding |
| worst sibling overlap, per variant | 5,000 / 4,000 / 3,333 bp | **2,857 / 2,222 / 3,333** bp | arm A5's own ruler (content-token overlap); the four faces stand further apart in vocabulary |
| distinct content words (≥ 4 ch) | 33 | **36** | +8 (`land`, `covers`, `cross`, `going`, `outside`, `short`, `well`, `stays`), −5 (`rough`, `lift`, `plain`, `answer`, `that`) |
| referent phrase | about ×6 · around ×4 · against ×1 · poss ×1 | about ×5 · around ×3 · outside ×1 · against ×1 · poss ×1 | R-DA-05's within-pool spread; `about` no longer carries half the pool |
| first-two-word openers | 12 of 12 distinct | 12 of 12 distinct | A11, held |
| faces under 8 words | 0 | 0 | `wordsPerSentence.shareUnder8` was round 1's 2.192-band-width blowout; the floor is held at 8 |

**HELD FLAT, so nothing green regresses.** Twelve faces, three variants, one sentence each, one
claim each, `{settlement}` on every face and no other slot (A6/armD), no face opening on the slot
(T-F8), no face closing on a pronoun or an abstract noun, zero semicolons, colons, em dashes,
digits, percents, questions, parentheses, quotes, `which`, and zero `-ly` adverbs. Every face was
run by hand against the SHIPPED detectors — `CONTRAST_SHAPES`, `BARE_RELATIVE`,
`SPECIFICATIONAL_COPULA`, `RECORD_CITATION`, `FUTURE_INDICATIVE`, C3's semantic
(`had|were|was|used to|once|formerly|no longer`), `SUPPLY_CLAIM_LEXICONS`, `PROVENANCE_LEXICONS`,
`QUANTIFIERS`, `EXEMPTION_LEMMAS`, `DUTY_PREDICATES`, `OFFICE_NOUN_CANDIDATES`, `RELATION_LEMMAS`,
`BAND_PHRASES`, `AUTHORED_MAGNITUDES`, `COUNT_NOUNS`, `CARDINAL_WORDS`, and `moveGrammar`'s
ABSENCE / OPEN / HISTORY / CONSEQUENCE / INSTITUTION / GEOGRAPHY / OBJECT / PROVENANCE clause
detectors — plus the four fingerprint shape metrics a one-sentence face can move
(`antithesisRate`, `triadRate`, `doubledAdjectiveRate`, `adverbsPerSentence`). **Twelve of twelve
clean on all of it.** The measure's own arithmetic is unchanged: 4 spine faces × 12 modifier faces
= 48 units, `owned` PASS 48 / findings 0, and all 48 WITHHELD rows still sit on spine bytes this
packet may not touch (A7/A17).

**BAND POSITION IS NOT A LEVER HERE, and saying so is honest rather than modest.**
`bandPositionOf` fingerprints ONE face at a time, so `neighbourVariation` has no neighbour and
thirteen of the twenty-one rate metrics are structurally zero: every face in round 4 scored the
identical `exceeded 13 / 0.619 / deepest 1.597 under`, and every face here will too. The only ways a
face can move that row are the ones this round refuses on other grounds (drop under 8 words, add an
adverb, add an antithesis, close on a pronoun) — each of which would DEEPEN the row toward the 1.75
entry ceiling. Position inside the band is reported as information (§21.1) and was not chased.

## THE CLAIM, AND WHERE EVERY FACE'S LICENCE COMES FROM

Re-read at this tip: `node scripts/prose-licence-card.mjs DS-DEF-11 'country: pressed (unwalled)'`.
All twelve assert exactly one claim — **that `monsterThreat` holds, as a STANDING fact of the
record** — with MOVE `PRESENT`, FORM `sentence`, RELATION `addition` (so no face carries a
connective of its own), and `{settlement}` as the only slot, which the card's `FILLED at this
block's call sites` line supplies. The predicate is read from source, not inherited:
`defenseStateProseCandidates.js:56-64` fires on `measuredMonsterFamily ∈ {plagued, frontier}`, and
`defenseStateProse.js:217-222` maps the third tier `heartland` to the corpus word `settled`. So the
pool's licensed surface is *the country is one of the two pressed grades* and nothing narrower.

**THE LICENSED NOUN STOCK IS NINE WORDS, and that is the pool's real constraint.** `country`,
`ground`, `land`, `danger`, `threat`, `trouble`, `going`, `quiet` and `{settlement}`. Every other
civic noun in the estate — market, mill, granary, gate, roll — is an unlicensed particular under
R-DA-10, every terrain adjective is a second field's fact, `town`/`village`/`size` name
`settlement.tier` and `wall`/`stone`/`circuit`/`open` name `forces.walls.present`, both of which
the card's `may NOT` bars by name. Four faces per variant are therefore built from nine nouns, and
the distance between them is bought with rhythm and word order, which is what the register card says
is spendable.

**THE THREAD** (owner ~21:4x; MOVE-GRAMMAR §1.4.1), read at all four seams. The modifier is seated
last and its move from the town to the country the town sits in IS the passage's one turn outward,
which §1.4.1 licenses in the last position; and it hands something back at every seam, because every
face names `{settlement}`, the spine's own subject. Four faces (`Outside {settlement} …`, `About
{settlement} …`, `In the country about {settlement} …`, and the plain's `The country {settlement}
sits in …`) open on the town and travel outward inside the sentence, which is the smoothest seam.
After `UNWALLED-SMALL` 2 the noun `country` is handed forward by the spine itself and picked up
directly. The after-a-sibling reading is VACUOUS and is reported as vacuous, not as passed: the
block's other three modifier pools attach only to the walled keys, so no sibling modifier can
precede this one.

**CROSS-POOL DISTANCE FROM `country: pressed (walled)`, held deliberately.** The walled sibling is
written in the ledger idiom (`on the books`, `entered at the beset grade`, `in the town's standing
record`); this pool states the country's own condition and names no record at all. Two of the twelve
openers (`the country`, `about {}`) coincide with a walled face's opener, which is not an A11 breach
— A11 is within-pool and the two pools can never compose into one unit, since their attach sets are
disjoint (`WALLED-STRAINED` against `UNWALLED-LARGE` `UNWALLED-SMALL`).

## REFUSALS — SIX, EACH A RESULT, TWO OF THEM CORRECTIONS TO ROUND 4's GROUND

1. **THE SET REMAINS UNSATISFIABLE FROM THE WRITER'S SEAT ON THE GATE'S UNIT VERDICTS.** All 48
   WITHHELD rows are inherited: three spine faces carry a post-semicolon segment naming no slot
   (arm Q, 36 rows) and `UNWALLED-LARGE` 2 carries `the books say` (F25, 12 rows). `armQualify`'s
   first loop cannot reach a modifier face that names a slot, and all twelve do; no face carries a
   semicolon or a record noun. The cure is a SPINE act or a walker act (CLERK-LAWS §2.6.1's
   site-keyed `claimKey`), and both are the chair's. Unchanged by this round, and correctly so.

2. **THE ROAD CITATION STAYS REFUSED — AND ROUND 4's STATED GROUND FOR REFUSING IT IS WRONG.**
   Round 4 refused it because a cited face "would ADD 12 or more F25 findings". It would not:
   `RECORD_CITATION`'s thirteen nouns are rolls/registers/ledgers/records/books/charters/writs, and
   `road` is not among them, so `armCitation` never fires on this holder. The real hazard is arm
   A13. The card's `source: road · standing LICENSED` is the CENSUS row's register-level standing;
   `armA13` resolves the holder PER TOWN through `sourceOfForTown`, and the `road` kind is held only
   by an institution whose instantiated services carry `Road register` or `Way-bill registration`
   (`holderTable.js`, from a Listening post or a Waystation). On a taste town with neither, the arm
   emits WITHHELD `a holder with no institution` — a finding sited on the MODIFIER, which would flip
   `owned` from PASS 48 to WITHHELD 48 and revert the whole set under §21.2. Under §21.3 the
   licensed wording wins over the sharper one, so the face is banked, never trimmed, and carried
   verbatim from rounds 1–4: *"What comes from the road puts {settlement}'s country down as
   dangerous ground."* **What would settle it in one command:** print `sourceOfForTown` for
   `INTERESTED_TOWNS[0]` on this pool and read the `holder` field. If it resolves, the citation is
   lawful, adds one A13 REPORT (a REPORT is not a finding — `scopedWalkOf` collects fails and
   withheld only) and gives the sitting the provenance RATE that MOVE-GRAMMAR §4.4.3 says the taste
   exists to measure. That single read is the chair's, not this seat's.

3. **THE BARE ANTITHESIS IS REFUSED THOUGH THE MACHINERY WOULD LICENSE IT.** `Around {settlement}
   the country carries danger and not quiet` is licensed by arm A3 — `quiet` is a content word of
   the sibling pool key `WALLED-QUIET`, so the arm emits REPORT, not WITHHELD — and it is invisible
   to `shapes.antithesisRate`, whose `, not [a-z]` limb needs a comma the phrase does not have. It
   is refused anyway: R-DA-02 bars the bare `X, not Y` outright, and a shape that passes two
   instruments and fails the register card is exactly the false green fault 32 is written against.

4. **THE BAND WORDS ARE REFUSED, BOTH DIRECTIONS, AND THE GROUND IS NOW MECHANICAL.** The positive
   (`plagued`, `frontier`) over-claims on half the firing cells, since the predicate is a
   disjunction. The negative (`settled`) is true to reject on every firing cell, but it is licensed
   only by a sibling BAND, and arm A3 sends a band-licensed alternative to WITHHELD while a
   KEY-licensed one takes REPORT. `quiet` is named by the sibling pool key `WALLED-QUIET`. That is a
   stronger ground than round 4's reading of the estate's idiom, and it points the same way.

5. **THREE LONG FORMS WERE WRITTEN AND REFUSED, EACH BY A NAMED LAW.** *"…and not a turn in it"* and
   *"…rather than its news"* — `CONTRAST_SHAPES` with an alternative no sibling key names, which is
   an A3 WITHHELD on the modifier. *"…has never been quiet country"* — a claim across time on a
   block with no event-provenance field (R-DST-B; the C3 semantic arm reds on `never had`'s family).
   *"Danger about {settlement} keeps no season and no calendar"* — the card bars a season even in
   the negative. The length spread was taken from face 1a instead, which carries one fact.

6. **THE DISTINCT-GRAMMAR FLOOR IS NOT-EXECUTABLE FOR THIS POOL, carried from round 4 unchanged.**
   MOVE-GRAMMAR §2.1 wants min(k, 8) distinct level-1 grammars; every member but V1 needs a
   licensing field this single-field modifier pool does not read, and §3.2 forbids writing a member
   the block cannot license. All three variants are V1 and the variation lives in the faces. A
   general property of every single-field modifier pool, and a sitting row.

## AN INSTRUMENT FINDING THE CHAIR SHOULD HAVE (free, from this round's hand-checks)

**`closeKindOf` IS HALF-BLIND ON EVERY `sentence`-FORM ROW.** `CLOSE_KINDS.standingFact` is
`/\b(stands|remains|holds|keeps|is|are|was|were|has|have)\b[^.]*$/i`, and `[^.]*$` cannot cross the
terminal stop a sentence-form face carries — so a face closing on a standing fact answers `other`,
not `standingFact`. Measured on all twelve rows here and on round 4's twelve: `other` twelve times
out of twelve, both rounds. `pronoun` and `abstraction` use `\s*[.]?$` and still fire, and
`civicNoun` uses `[^a-z]*$` and still fires, so the arm can refuse a bad close and can never
recognise a good one — which makes any per-pool close-kind distribution read as one kind everywhere,
the exact shape R-DA-04 calls the finding. The close kinds below are therefore this seat's own
classification, not the instrument's: **CONDITION 5** (1a, 1b, 2c, 3-plain, 3c) · **ABSENCE 3**
(2-plain, 2a, 2b) · **OBJECT 2** (1-plain, 1c) · **STANDING FACT 2** (3a, 3b). No kind takes more
than 5 of 12, and the OBJECT share falls from round 4's 0.417 to **0.167**, continuing R-DA-04's own
direction (round 3 read 0.500).

## STANDING

CONFIRMED for every count in the measured table and for the twelve rows' detector negatives: they
are properties of the bytes above, checked by hand against the shipped regexes and word lists read
whole this round from `entryLexicons.js`, `entryWalker.js`, `moveGrammar.js`, `composedWalker.js`,
`proseFingerprint.js` and `taste-measure.mjs`. CONFIRMED for the predicate and the tier map, read
from `defenseStateProseCandidates.js:56-64` and `defenseStateProse.js:217-222`. CONFIRMED for the
licence card, re-printed at this tip. PLAUSIBLE for the A13 holder resolution in refusal 2, which
needs a run this seat may not make, and which is stated as the risk it is rather than as a fact.
The executable proof of the whole set is the gate's re-run.
