1. `[ledger]` Danger in the country is a standing entry on {settlement}'s books, and against that entry the town keeps its {defwork} in repair.
   - `[face]` On {settlement}'s account the country is dangerous ground, and the upkeep of the {defwork} is a line the town still bears.
   - `[face]` The {defwork} at {settlement} is kept up as a charge the town carries. That charge answers the country's danger.
   - `[face]` Set against dangerous country, the {defwork} at {settlement} is a cost the town enters and pays.
2. `[street]` Against dangerous country the {defwork} at {settlement} is kept up as working fabric.
   - `[face]` Dangerous country is the standing condition at {settlement}; the {defwork} is kept in service against it.
   - `[face]` Used and mended in the ordinary way, the {defwork} at {settlement} answers dangerous country.
   - `[face]` The {defwork} at {settlement} is in use. The country it stands against is dangerous ground, and the town keeps the work sound.
3. `[visitor]` A working enclosure stands at {settlement}, and the country it faces is dangerous ground.
   - `[face]` Dangerous country lies about {settlement}, and the enclosure is kept.
   - `[face]` Beyond {settlement} the country carries danger, and the town is closed against that danger. The enclosure is kept sound.
   - `[face]` Enclosed against dangerous country, {settlement} keeps the enclosure fit for use.

--- NOTES

**Pool.** DS-DEF-11 · `WALLED-THREATENED` · role SPINE · draft round 1 · Seat: Opus 5 — Fable-unvalidated.
Card printed by `node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-THREATENED'` in `laneRW-DEF11`; the block's annex section read at `laneRW-DEF11/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5963-5998` — the RECEIPT, STATE-KEY, SLOTS and PROVENANCE lines and all four sibling pools (`WALLED-QUIET`, `WALLED-STRAINED`, `UNWALLED-SMALL`, `UNWALLED-LARGE`), for arms A1 and A11.
**3 variants · 12 wordings (3 × one `[plain]` parent + three `[face]` sub-rows).** FORM `sentence` · seat not a seat-taker · MOVE none declared · angle `ledger` `street` `visitor`, each kept exactly as it stands · audience player, no mark · ATTACH empty (a spine takes no attach set) · provenance citations 0.

**THE ROW SHAPE, AND THE ONE PLACE I DID NOT TAKE THE BRIEF LITERALLY.** The brief asks for the variant's number, its bracketed tag as it stands, a `[plain]` line and three `[face]` sub-rows. I have written the tag ONCE, because the projector's `VARIANT_RE` (`scripts/generate-dossier-state-prose.mjs`) reads a SECOND bracketed tag as a further MARK and folds it into `marks` — its docblock names the audience case (`` `[counterforce · seat]` `[dm-only]` ``) as the reason the second bracket exists. A literal `` 1. `[ledger]` `[plain]` … `` would therefore publish a mark reading `plain` on every one of these three variants. ARCH §2.5's example row carries `` `[plain]` `` in the ANGLE slot because the pools it illustrates are angled `plain`; these three are angled `ledger`, `street` and `visitor`, and the parent row IS the plain line. If the chair reads it the other way the fix is mechanical and the gate may make it without touching a word of the wording: insert `` `[plain]` `` after each existing tag.

**WORD COUNTS** (whitespace tokens; a `{slot}` counts one; a two-sentence face is given as its parts).

| variant | `[plain]` | face 1 | face 2 | face 3 |
|---|---|---|---|---|
| 1 `[ledger]` | 22 | 21 | 19 (13 + 6) | 16 |
| 2 `[street]` | 13 | 16 | 14 | 22 (7 + 15) |
| 3 `[visitor]` | 14 | 10 | 19 (14 + 5) | 11 |

---

## 1. THE CLAIM SET, AND WHAT EACH FACE IS LICENSED BY

The pool's key is the COMPOUND `WALLED-THREATENED` (walls, live threat), and the card's `reads` block carries three measured fields. Three typed claims run through all twelve wordings, and no wording carries a fourth:

- **K1 — the enclosing work is present**, as a STANDING fact of the record. Card: `reads: forces.walls.present (measured)`; `may claim: that present holds, as a STANDING fact of the record`. MOVE-GRAMMAR §1.2 row 1 (PRESENT): a standing configuration field licenses a STRUCTURAL clause.
- **K2 — the country the town stands in is dangerous**, standing, not an occasion. Card: `reads: settlement.config.monsterThreat (measured)`, which is the half of the state key that separates this pool from `WALLED-QUIET`. Stated as a condition, never as an event (MOVE-GRAMMAR §1.2 row 2 refuses HISTORY absent an event-provenance field, and the block's own PROVENANCE line says the historical clause has no backing fact at this tip).
- **K3 — the work is kept, and the keeping is met.** Card: `reads: settlement.defenseProfile.economicGates.military (measured)`; the block's RECEIPT quotes the generator's own recorded upkeep law. K3 is the half that separates this pool from `WALLED-STRAINED`, where the upkeep is impaired.

The JOIN of K1 to K2 is written as PURPOSE and never as cause: *against · answers · a charge · a cost · in service against · closed against*. No face says *because*, names an occasion, a raising, a season or a year, or takes the future.

**Face by face.**

| wording | the claims it makes | the card clause that licenses each |
|---|---|---|
| all 12 | K1, K2, K3 and the structural join, and nothing else | `reads` (the three measured fields); `may claim … as a STANDING fact of the record`; MOVE-GRAMMAR §1.2 row 1; R-DST-B's structural half |
| all 12 | `{settlement}` | `bag: {settlement: proper}`, FILLED at this block's call sites; never sentence-initial (ARCH §2.5's face row / T-F8, and `dossier-annex-grammar.mjs`'s own refusal for a sentence face opening on a `proper`-typed slot); never sentence-final either, so no closer resolves to the token `settlement` |
| 1-plain, 1-f1, 1-f2, 1-f3, 2-plain, 2-f1, 2-f2, 2-f3 | `{defwork}` | `bag: {defwork: bare-common}` and the block's SLOTS line (it fills with the settlement's own wall-class institution by its RECORDED name); the sentence supplies the article every time, which is what `bare-common` requires. See refusal R10 on the card's "NAMED BUT NEVER FILLED" |
| 1-plain "a standing entry on {settlement}'s books" · 1-f1 "On {settlement}'s account" | K2 is a STANDING entry of the record, which is the `[ledger]` angle's own standpoint | the `of the record` half of `may claim`; §0b's angle palette (`[ledger]` — what the books, rolls and counts show). No holder is named and no record is made a grammatical subject: see refusals R7 and R11 |
| 1-plain "keeps its {defwork} in repair" · 1-f1 "the upkeep … is a line the town still bears" · 1-f2 "kept up as a charge the town carries" · 1-f3 "a cost the town enters and pays" | K3, as a standing charge met | `reads: defenseProfile.economicGates.military`; the RECEIPT's upkeep law. The charge is stated as a STANDING condition, never followed to an outcome, so no CONSEQUENCE move is made (MOVE-GRAMMAR §1.2 row 7 needs event provenance × a household row, and neither exists here) |
| 1-f2 s2 "That charge answers the country's danger." | K2 and the join, as a second FACT in its own sentence | R-DA-03 (a qualification takes its own sentence, never a tail); the second sentence resolves to `monsterThreat`, a SECOND typed field, not to a hedge |
| 2-plain "kept up as working fabric" · 2-f1 "kept in service" · 2-f2 "Used and mended in the ordinary way" · 2-f3 "is in use … keeps the work sound" | K3 and K1 together: the work exists and is in use and repair | the same two card reads. `[street]`'s standpoint (§0b: the town's own talk about its condition) is realised as the work's own condition — no mind, no belief, no reported opinion: see refusal R2 |
| 2-f3 s2 "The country it stands against is dangerous ground, and the town keeps the work sound." | K2 with K3 | `monsterThreat` and `economicGates.military`; a second sentence carrying a second field, R-DA-03 |
| 3-plain, 3-f1, 3-f2, 3-f3 "enclosure / closed against / Enclosed" | K1, under a generic the fills cannot falsify | `may claim: that present holds`. `{defwork}` fills with `wall`, `citadel`, `palisade`, `earthwork`, `inner citadel` or `massive walls` (RECEIPT), so the generic is the only true common noun; it names the SAME civic object the field names, not a second one — see refusals R8 and R9 |
| 3-plain "a working one" · 3-f1 "is kept" · 3-f2 "kept sound" · 3-f3 "fit for use" | K3 | `economicGates.military` |
| 3-plain "the country it faces" · 3-f2 "Beyond {settlement} the country" | K2's country, in the field's own plain sense | `monsterThreat`. No geometry claim is made: none of `PROVENANCE_LEXICONS.spatial`'s shapes is used, and no boundary, direction or distance is asserted |

**Claim-equality inside each variant (arm A6).** All four wordings of variant 1 assert K1, K2, K3 and the record-standing of K2; all four of variant 2 assert K1, K2, K3 with K3 in the foreground; all four of variant 3 assert K1, K2, K3 through the enclosure. The slot set is identical across each variant's four wordings — `{settlement}` and `{defwork}` on variants 1 and 2, `{settlement}` alone on variant 3, exactly as the shipped rows carry them.

---

## 2. THE THREAD, THE SPREAD, AND THE MEASURES I WROTE AGAINST

**THE THREAD (owner, 2026-09-08 ~21:4x).** This pool is the SPINE, so every one of these wordings is the passage's FIRST sentence and hands the thread FORWARD rather than picking one up. Each closes on a noun a modifier can carry: *repair · bears · carries · danger · pays · fabric · it · country · use · sound · ground · kept · danger · sound · use* — fifteen closes over eleven different words, with no close repeated more than twice and none of them an abstraction (R-DA-04 asks the KIND of close to vary, and a fourfold `country` in the first draft of this packet was a tic I cut before writing this line). Three wordings are two sentences, and each of the three is read for the thread on its own: **1-f2** carries `charge` forward from its first sentence to its second (the arm's `carried` verdict); **2-f3** and **3-f2** turn outward once, in the LAST position, which is the shape the rule licenses. None of the three shifts subject mid-passage, because none of them has a middle.

**SPREAD (A11 and R-DA-05).** No two variants share their first two words: *Danger in* · *Against dangerous* · *A working*. All twelve wordings open on twelve openers, and across the pool's rendered corpus exactly one adjacent pair shares a first word (2-f3's two sentences), which puts `openers.sameOpenerAsPreviousRate` at 0.067 inside the band 0.0334–0.1667 rather than at a suspicious zero. The four wordings of each variant differ in RHYTHM as well as vocabulary: a coordinate; a fronted prepositional phrase; a two-sentence pair with a five-word second line; a fronted participial phrase. Variant 1's four lead nouns are *entry · line · charge · cost*; variant 2's four verbs of upkeep are *kept up · kept in service · used and mended · keeps sound*; variant 3's four realisations of the enclosure are a noun, a verb, a predicate and a participle.

**THE BANDS, computed over the ten leaf exemplar fingerprints** (`$SC/prose-research/primary/`, `EXEMPLAR_LEAVES`), at the two grains `prose-wave-gate.mjs` scores.

*FACE grain (the eight metrics one sentence genuinely answers).* Every wording carries zero colons, zero em dashes, zero question marks, zero exclamations, zero parentheses, zero `, which` tails, zero quoted dialogue and no participial (`-ing`) opener. Every one of those eight bands has `lo = 0.0000`, so all twelve faces sit INSIDE all eight: exceeded 0 of 8, depth 0, budget met. The PERFECTION CEILING is a live finding at this grain and is stated here rather than hidden — but the eight are hard walls of the register card (no em dash, no question, no which-clause), not soft rules a human record would break, so I did not manufacture a breach to satisfy the ceiling.

*CORPUS grain (the thirteen text-level metrics, over the fifteen sentences these twelve wordings compose (lengths 22 · 21 · 13 · 6 · 16 · 13 · 16 · 14 · 7 · 15 · 14 · 10 · 14 · 5 · 11, mean 13.13)).* Written against, and reported here so a refuter can check the arithmetic:

| metric | band (ten leaves) | this pool | verdict |
|---|---|---|---|
| `wordsPerSentence.shareUnder8` | 0.0292 – 0.3333 | 3 of 15 = 0.200 | in band |
| `wordsPerSentence.shareOver30` | 0.0489 – 0.3382 | 0 | under, depth 0.17 |
| `wordsPerSentence.neighbourVariation` | 0.4950 – 0.8050 | 0.397 | under, depth 0.32 |
| `punctuation.semicolonRate` | 0.0085 – 0.1220 | 1 of 15 = 0.067 | in band |
| `shapes.antithesisRate` | 0.0082 – 0.0401 | 0 | under, depth 0.26 |
| `shapes.triadRate` | 0.0427 – 0.2129 | 0 | under, depth 0.25 |
| `shapes.doubledAdjectiveRate` | 0.0057 – 0.0556 | 1 of 15 = 0.067 | in band |
| `shapes.adverbsPerSentence` | 0.0590 – 0.3920 | 0 | under, depth 0.18 |
| `shapes.thereIsOpenerRate` | 0.0016 – 0.0556 | 0 | under, depth 0.03 |
| `closers.abstractNounRate` | 0.0122 – 0.1151 | 0 | under, depth 0.12 |
| `closers.pronounRate` | 0.0213 – 0.1083 | 1 of 15 = 0.067 | in band |
| `openers.sameOpenerAsPreviousRate` | 0.0334 – 0.1667 | 1 of 15 = 0.067 | in band |
| `runsOfThreeSameLengthBand` | 0.1538 – 0.4082 | 5 of 15 = 0.333 | in band |

Seven of thirteen in band, six under at a deepest depth of 0.32 band-widths — inside the ENTRY depth of 1.75 and inside the POOL depth of 0.5 on every one. Four of the six under-side deviations are shapes a twelve-wording pool has no honest occasion for (an antithesis, a triad, an adverb, an existential opener), and I refused to manufacture any of them: see refusal R12. Five of the fifteen sentences are deliberately placed to hold `runsOfThreeSameLengthBand` and `shareUnder8` inside their bands rather than at the estate's habitual uniform, which is the measured weakness the rewrite exists to move.

**Detectors the wordings were written past** (`entryLexicons.js`, read in the dock): no `QUANTIFIERS` member (`every`, `all`, `each`, `only`, `none`, `any`, `no`, `whole`, `entire`); no `DUTY_PREDICATES` member (`counts`, `musters`, `levies`, `assesses`, `reckons` …), so no duty is asserted against a table whose columns are null; no `COUNT_NOUNS` member, so no count is claimed; no `OFFICE_NOUN_CANDIDATES` member, so no office is named; no `RECORD_CITATION` frame (`the books say`, `the rolls show`); no `SPECIFICATIONAL_COPULA` (`is what`, `is the only`, `is the one`, and no sentence opening `The <lower> … is the <lower>` inside the regex's sixty characters); no `FUTURE_INDICATIVE`; no `FORECAST_WORDS` (`never`, `always`, `forever`) and no `PERFECT_ASPECT`, so arm Aspect is silent; no `PROVENANCE_LEXICONS` member of the `spatial`, `capacity`, `actor` or `dated` families; no `AMBIGUOUS_AFTER_SPINE` phrase, so arm Ambiguity is silent; no `CLOSE_KINDS.abstraction` closer, and exactly one `CLOSE_KINDS.pronoun` closer, placed on purpose at 2-f1 to hold `closers.pronounRate` inside its band. No digit, no percent, no em dash, no exclamation.

---

## 3. REFUSALS — a refusal is a result

- **R1 — the shipped comparison "as plainly as the grain" is GONE, and the claim it hung on is kept.** R-DA-11: no figurative language, a comparison is a measurement in words. The grain is also a civic object of a class this card does not read, so the comparison spent a claim the pool was never entitled to. Variant 1 keeps the fact the comparison decorated — that the danger is a standing entry of the record — and states it flat.
- **R2 — the shipped belief clauses of variant 2 are GONE.** "Nobody in {settlement} thinks of the {defwork} as ornament" and "the town knows what it is for" assert what people believe. No field carries belief; MOVE-GRAMMAR §1.3 records that a FEELING move does not exist anywhere in the estate, and the card's `may NOT` bars a standpoint. What the clauses were FOR — that the work is in use and not decorative — is a fact about the work, and all four wordings of variant 2 state it as one. The `[street]` angle survives as §0b defines it (the town's own talk about its condition) and not as a mind reported.
- **R3 — the shipped simile of variant 3 is GONE.** "enclosed the way working things are enclosed" is R-DA-11's figure exactly, and its "against something" is the threat gestured at rather than stated. Variant 3 keeps both claims and names the second from the field.
- **R4 — the shipped "recently" of variant 3 is NARROWED to standing upkeep.** A recency claim needs a dated row; the card's `may NOT` bars a season, and the block's own PROVENANCE line says that WHEN has no backing fact at this tip and arrives with the fabric epochs. "kept · kept sound · fit for use" is the licensed standing form of the same fact. This is the one place where a shipped particular does not survive verbatim, and it is a cure under R-DA-20, not a trim: the sentence keeps its slot, its number, its tag and its claim.
- **R5 — THE CARD'S OWN TENSION, RECORDED FOR THE CHAIR (the one thing I could not settle).** The card's `reads` block carries three MEASURED fields and its `may claim` line names only `present`. Every shipped variant of this pool asserts the threat as well, and the pool KEY is the compound; a wording set that claimed the wall alone would drop a claim the shipped sentence carried, which "never trim" and arm A6 both refuse. I have therefore read the `reads` block as the licensing set and the `may claim` line as its primary-read summary, and written K2 and K3 as licensed. If the chair reads `may claim` strictly, all three variants are refusals and this pool cannot be written at all without a claim drop — which is a sitting row, not a wording round. The `predicate` line prints `(none recovered: the pool has no key-function branch)`, so no value word is available either: no wording names a monster family, a tier or a band word, and the danger is written union-true for every value that selects this pool.
- **R6 — no CAUSE, and the word "because" appears nowhere.** The card's `may NOT` bars a cause. Every join here is a structural purpose licensed by R-DST-B's structural half and MOVE-GRAMMAR V2 (`PRESENT → CONSEQUENCE(structural)`): the work stands AGAINST the country, ANSWERS it, is a CHARGE or a COST the standing danger puts on the town. No wording asserts an occasion, an actor, a decision or a date, so nothing here is the HISTORICAL cause the card and R-DST-B refuse. Flagged for the refuter as the packet's boldest reading.
- **R7 — the provenance count for this pool is 0, and that is a decision.** The card licenses a holder (`muster + road · standing LICENSED · two-source row`). REGISTER-CARD S3 licenses a citation on the player's page only where a clerk would cite: two accounts that disagree, a count from an interested party, or a record whose keeper is a power. None holds — no second account of the wall's presence exists, no count is stated, and neither the muster nor the road is a power over this fact. Part B §24 records that the exemplar registers with raw text cite at 0 per 786 sentences and that a citation habit is a refuter's finding. The `[ledger]` angle is carried by the town's own books as the PLACE the fact stands, never by an attribution.
- **R8 — no material word.** `{defwork}` fills with `wall`, `citadel`, `palisade`, `earthwork`, `inner citadel` or `massive walls`, so "stone", "masonry" and "timber" are false on some fills and would be a claim no field holds. The sibling `WALLED-STRAINED` says "stone keeps itself"; this packet does not follow it, and the divergence is deliberate and named here rather than left to be found.
- **R9 — no second civic object of the class `wall`.** No gate, rampart, wall-walk, tower or circuit appears, on the card's `may NOT` line. Variant 3's "enclosure" is the SAME object named generically because that variant carries no `{defwork}` slot, exactly as the shipped row does not.
- **R10 — `{defwork}` is KEPT although the card records it NAMED BUT NEVER FILLED at this block's call sites.** The three shipped rows carry it on variants 1 and 2 and not on variant 3, and the object the sentence names is part of the claim; dropping it to satisfy a wiring gap would drop a claim. The gap is the lane's (the block landed dark) and is a wiring row, not a wording one. If the gate would rather refuse the slot than the gap, variants 1 and 2 can be re-cut on variant 3's generic in one round — but that would flatten three angles onto one noun, so I have not pre-empted the ruling.
- **R11 — the record as a grammatical subject is refused.** "the books say", "the register holds" match `RECORD_CITATION` and naming the compiling office per entry is R-DA-01's once-declared frame. Variant 1 therefore says the danger STANDS ON the books and that the town ENTERS a cost, and never makes a record speak.
- **R12 — four under-side band deviations are accepted rather than manufactured.** An antithesis, a triad, an `-ly` adverb and an existential opener would each move a metric from a shallow under-side reading into its band, and each would be a shape invented for a measurement. R-DA-02 licenses a contrast only where a sibling pool key or band names the rejected alternative (`WALLED-QUIET` could carry one lawfully, and I judged the ceiling better served without it); R-DA-10 refuses the habitual three; fault 3 is exactly the shape of a contrast written for a number. The deepest of the four is 0.26 band-widths, seven times inside the entry depth.
- **R13 — one line I could not make both sharp and licensed, kept in its licensed form.** 2-f1 closes on "against it", which is a pronoun closer R-DA-04 moves away from. I kept it because it is the pool's ONE pronoun closer and holds `closers.pronounRate` inside its band at 0.067, where zero would sit under it; the alternative endings I tried either repeated "country" a third time in the same wording or reached for a wall-class noun R9 refuses. It is the first row a refiner should push at.

---

## 4. TWO THINGS FOR THE SITTING, STATED AND NOT DECIDED

1. **The `[plain]` tag question of the row-shape note above** is a projector-grammar ruling, not a wording one, and it is one insertion per variant either way.
2. **The echo the card names.** The card's `echo` line reports that the echo table is keyed on the producer-token ROOT `forces`, coarser than this pool's own read `forces.walls.present`, and prints two spine mounts on the defense tab. This spine also asserts `settlement.config.monsterThreat`, which the block's taste-era modifier pools `country: pressed (walled)` and `country: pressed (unwalled)` assert on the same field. Those modifiers attach to `WALLED-STRAINED`, and `WALLED-STRAINED` and `WALLED-THREATENED` are mutually exclusive branches of one state key, so the two can never compose into one unit and arm A11's one-mount bound is not engaged. That reading rests on the ATTACH set as it stands today; if a later car attaches a `country:` modifier to this pool, K2 becomes a doubled producer fact and one of the two must give it up. Recorded so the cross-block pass reads this pair first.
