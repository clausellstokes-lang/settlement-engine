Seat: Opus 5 — WRITER, Fable-unvalidated. Block DS-DEF-11 · pool `watch: bought (revealed)` · draft round 3.
The rows below are the complete replacement for the pool's `⟦TO-AUTHOR⟧` line. The pool's typed lines (ROLE / FORM / MOVE / READS / RELATION / ATTACH) are already in the annex and are NOT repeated here.

1. `[plain]` The purchase of the watch {settlement} keeps is a public fact.
   - `[face]` Public standing holds the purchase of {settlement}'s watch.
   - `[face]` In {settlement} the buying of the watch stands on the plain public record.
   - `[face]` Of the watch {settlement} keeps, the purchase sits on the public side of the town's common affairs.
2. `[plain]` Obedience in {settlement}'s watch is bought in sight of the town.
   - `[face]` The watch of {settlement} holds a bought allegiance out in the open.
   - `[face]` Where the obedience of the bought watch runs is a matter that lies open to {settlement}'s ordinary hearing.
   - `[face]` In open standing {settlement}'s watch answers a purchase.
3. `[plain]` A watch that has been bought is kept by {settlement} in open public view.
   - `[face]` The bought watch of {settlement} stands under open notice.
   - `[face]` The keeping of a watch that has been bought counts in the public affairs of {settlement} as open dealing.
   - `[face]` What {settlement} has for a watch is sold in the town's plain sight.

--- NOTES

**THE CARD THIS SET IS WRITTEN AGAINST** (`node scripts/prose-licence-card.mjs DS-DEF-11 'watch: bought (revealed)'`, run read-only in `laneTASTE`): role modifier · reads `compromised.revealed` (measured) · bag `{defwork: bare-common, settlement: proper}`, FILLED at this block's call sites `{settlement}` · relation `addition` · seat/form `sentence`/`sentence` · move `INSTITUTION` · angle `plain` · attach `WALLED-QUIET` `WALLED-STRAINED` `WALLED-THREATENED` · covert `no`, audience player (no mark) · source `(none)`, standing SOURCE-UNRESOLVED, no citation licensed (arm A13) · may claim: that `revealed` holds, as a STANDING fact of the record · may NOT: a count, a cause, a season, a future, a standpoint, a second fact, another civic object of class `force`, any field the attached spine tests.

---

## §1 THE ROUND'S METHOD, STATED FIRST

Round 2's twelve faces were accepted verbatim by the projector and produced **zero FAIL rows on either walker**. Two of the four gate measures were therefore not a wording problem in general but a defect at three named places, and this round is deliberately **surgical: nine faces are byte-identical to round 2 and three are replaced.** Rewriting a passing face to look busy would risk a new finding for no measured gain, and §21.2's keep-or-revert rule is written against exactly that.

The three replacements were chosen after reading the detectors themselves rather than guessing at them — `src/domain/prose/entryWalker.js` (arms Q and X), `src/domain/prose/entryLexicons.js:332` (`SPECIFICATIONAL_COPULA`), `src/domain/prose/proseFingerprint.js:147` (`closers.abstractNounRate`) and `src/domain/prose/composedWalker.js:931` (`walkComposed`), all read-only in `laneTASTE` — and then checked against those exact regexes over the twelve lines. **Every measure below is the writer's own recomputation, not a walker run: the walker is the gate's to run, and this packet is authored under the fence that executes nothing in the dock but the licence-card script.**

## §2 THE FOUR FAILING MEASURES, ANSWERED ONE BY ONE

### (1) band depth · `closers.abstractNounRate` — over on 2 of 12 faces, worst 8.6 band-widths → **0 of 12, MOVED TO GREEN**

The metric is `last.filter((w) => /(ness|tion|sion|ity|ment|ance|ence|ship|hood|dom)$/.test(w))` on the sentence's final word, lower-cased and stripped of punctuation (`proseFingerprint.js:147`). The two offenders are named exactly by `measure-draft.json` (`band[]` rows `vid 2 · face 0` and `vid 3 · face 2`, both `deepest: closers.abstractNounRate, depth 8.6, side over, depthOk false`):

- **2.plain** closed on **conceal·MENT**.
- **3.b** closed on the slot itself, **`{settlement}`** — the fill is stripped to the token `settlement`, which **ends in `-ment`**. This is the round's sharpest finding and it is not obvious from the page: *any* sentence-form face that closes on `{settlement}` reds this band by construction, in this pool and in every other. It is written here so the chair can carry it to the wave rather than let each writer rediscover it.

Both are replaced. The twelve closing words are now `fact · watch · record · affairs · town · open · hearing · purchase · view · notice · dealing · sight` — **twelve distinct closers, none matching the abstract-noun suffix set, none a pronoun** (`closers.pronounRate` stays at the round-2 zero). Recomputed on the exact regex: 0 of 12.

### (2) composed walk · X · exhaustivity over an open column — ≥ 6 findings → **0 findings, MOVED TO GREEN**

`measure-draft.json` attributes **every X finding in this pool to one clause**: *"A watch that has been bought is what {settlement} keeps in open public view."* — round 2's `3.plain`. The trigger is `SPECIFICATIONAL_COPULA`'s first alternation, `\b(is|are|was|were)\s+(what|who|the only|the one)\b`: the pseudo-cleft **"is what"** entails that the subject is its column's only value, and `office|institution` is `closed: false` (CLERK-LAWS §1.2 NOTE), so the arm withholds. The finding fires once per composed unit, so one face carried **8 findings** — one for each of the pool's eight spine faces.

The cleft is gone. **3.plain** now reads *"A watch that has been bought is kept by {settlement} in open public view."* The claim is unchanged — the settlement keeps a bought watch, and the keeping is public — and the sentence no longer specifies a unique value of any column. Checked against the shipped regex, both alternations, over all twelve faces: **0 matches.** No other face used a cleft, an inverted copula, or the `the X … is the Y` shape the second alternation catches (3.c's *"What {settlement} has for a watch is sold…"* is a fronted free relative, not `is what`, and does not match — confirmed by its absence from the round-2 findings list).

### (3) composed walk · unit verdicts — FAIL 0 · WITHHELD 52 · PASS 44 of 96 → **FAIL 0 · WITHHELD 48 · PASS 48, MOVED, and the residue is REFUSED with its cause**

96 units = 12 faces × 8 spine faces (`WALLED-QUIET` 3 + `WALLED-STRAINED` 2 + `WALLED-THREATENED` 3; `unitsOfPool`, `taste-measure.mjs:245`). Removing the X clause frees the 4 units in which `3.plain` met a spine that carries no finding of its own — verdicts go to **48 PASS · 48 WITHHELD**. **That is the ceiling any modifier packet can reach on this attach set, and the reason is in §4 refusal 1.**

### (4) composed walk · Q · a trailing coordinate naming no second field — ≥ 34 findings → **UNMOVED, and REFUSED with its measurement (§4, refusal 1)**

This is the round's one refusal and it is a structural one, not a wording one. See below; the evidence is complete and the arithmetic closes to the printed 56.

## §3 THE FINDING COUNT, RECONSTRUCTED TO THE DIGIT

The gate printed 56 findings with the list capped at 40, so the arms' true shares had to be recovered rather than read. Tallying the capped list by clause and completing it from the detector gives an exact reconstruction:

| clause the finding names | whose text | arm | units it fires in | in the capped 40 |
|---|---|---|---|---|
| *"…is what {settlement} keeps in open public view."* | **the writer's** `3.plain` | X | 8 (1 face × 8 spines) | 6 |
| *"built work stands on its own patience."* | spine `WALLED-QUIET` 3 | Q | 12 (12 faces × 1 spine) | 12 |
| *"stone keeps itself, and wages do not."* | spine `WALLED-STRAINED` 1 | Q | 12 | 12 |
| *"the threat is on the town's books as plainly as the grain."* | spine `WALLED-THREATENED` 1 | Q | 12 | 10 |
| *"the town knows what it is for and checks it."* | spine `WALLED-THREATENED` 2 | Q | 12 | 0 (cap reached) |
| | | | **56** | **40** |

8 + 48 = 56, which is the printed `findingCount` exactly. **Of the 56, 8 are the writer's and 48 are the spines'.** This round removes all 8 of the writer's and can remove none of the 48.

## §4 REFUSALS (a refusal is a result)

**1. The Q arm cannot be greened from this packet — REFUSED, with the code and the four sentences that cause it.**
`walkComposed` walks the composed text as one entry (`composedWalker.js:938`). Arm Q splits each sentence on semicolons and, for every part after the first, withholds unless that part names a slot or a band word (`entryWalker.js:835-838`). **Four of the eight spine faces this pool attaches to carry a semicolon whose second half names neither**: `WALLED-QUIET` 3, `WALLED-STRAINED` 1, `WALLED-THREATENED` 1 and 2, in the clauses tabled above. Those clauses are shipped spine text in `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md`; they are outside this packet's fence and outside this pool's authority, and **no modifier wording can change a finding attributed to the sentence before it.** Round 2 already carried zero semicolons, zero coordinators and a slot on every face, which is everything the arm reads on the modifier's own half.
Two consequences the chair should have. **(a)** The band `WITHHELD 0` is **unreachable for this pool** — and for `watch: bought (covert)`, and for `country: pressed (walled)` on `WALLED-STRAINED` — until the four spine sentences are rewritten. A draft round that is scored against it will read as dry for a defect it cannot touch. **(b)** The arm is measuring the spine four times over on this pool's ledger: one spine clause bills **12 findings** because it meets 12 faces, so a single unfixed spine sentence outweighs every wording decision in the packet. Whether the composed walk should attribute a finding to the piece that carries it, and count it once, is the walker lane's question and this writer's recommendation.

**2. A citation / provenance face — REFUSED, and none is written.** The card prints `source: (none) · standing SOURCE-UNRESOLVED` and "NO citation is licensed: a face naming a record holder here is refused by arm A13". Register-card amendment S3 and MOVE-GRAMMAR §4.4.3 make a publicly-recorded corruption of the watch the textbook site for exactly one such face; it is refused for want of a resolved holder. No face names a roll, a register, the town's books, the watch's own count or any keeper — including the tempting *"the books say what"*, which the block's own `UNWALLED-LARGE` spine ships and this pool may not. If SEAM car 5b resolves a holder for `compromised.revealed`, this pool should be RE-OPENED with a fourth semantic variant rather than a face swapped inside these three (never trim, §22).

**3. A cognition face — REFUSED (standing from round 2).** `compromisedSecurityInstitutions` (`src/domain/corruption.js:663-692`) returns `revealed` as the security institutions carrying a `corruption`-typed impairment **not** flagged covert: a publicly-recorded impairment, not a state of anyone's mind. Round 1's *the town knows it*, *common knowledge*, *the town can say* are withdrawn and stay withdrawn; the publicity limb is carried by nouns and adjectives (`public`, `open`, `plain`, `record`, `notice`, `view`, `sight`, `dealing`, `in sight of the town`) and never by knowing.

**4. A count, a cause, a buyer and a season — REFUSED by the card.** No face says how many, how much, how long, who bought, why, or what followed. The buyer is grammatically absent throughout (`is bought`, `is sold`, `has been bought`, `a purchase`, `a bought allegiance`), which is also what keeps the PERSON move (MOVE-GRAMMAR §1.2 row 3) unlicensed and unused.

**5. The three spine-tested fields as vocabulary — REFUSED, scanned.** No wall word (`wall · stone · gate · circuit · palisade · citadel · earthwork`), no threat word (`threat · monster · danger`), no wage word (`wage · pay · paid · muster · upkeep · soldier`) appears in any face. No second civic object of class `force`: `garrison · guard · constable · magistrate · barracks` are absent, and *the watch* is this pool's one object throughout (R-DA-22).

**6. `{defwork}` — REFUSED**, on two independent grounds: the census reports the bag FILLED at this block's call sites as `{settlement}` alone, so a `{defwork}` face would render an unfilled slot; and `{defwork}` names the wall-class institution, which is `forces.walls.present`, a field every attached spine tests and the card's `may NOT` bars.

**7. Closing a sentence-form face on `{settlement}` — REFUSED for the whole pool, newly and permanently.** See §2(1): the token ends in `-ment`. This is a lexical accident of the metric rather than a judgment about the prose, and it is recorded here because it will bite every writer in the wave the same way.

**8. The `dm-only` mark — NOT APPLIED, deliberately.** The card reads `covert: no` and `audience: player (no mark)`. The mark belongs to the sibling pool `watch: bought (covert)`, a different packet; a mark here would leak that pool's audience rule onto a player face.

**9. Nothing trimmed.** Three variants, twelve faces, exactly as rounds 1 and 2. No variant, face or slot is removed. Round 2's three superseded wordings — *"Obedience in {settlement}'s watch is bought without concealment."*, *"A watch that has been bought is what {settlement} keeps in open public view."*, *"The keeping of a watch that has been bought counts as open dealing in the public business of {settlement}."* — are recorded here in full under §22's one-for-one substitution, never silently dropped; 3.b's replacement is a shortening inside its band, which §22 names as editing and not as trimming.

**10. The within-pool `wordsPerSentence` sd sits at 3.56 against R-DA-05's 4.0 floor — DECLARED, not hidden**, and it has fallen from round 2's 3.77 because 2.plain rose from 8 words to 11 to reach a lawful closer. Widening it further needs either a face under 8 words (the gate's own `shareUnder8` finding in round 1) or a face past 22 padded with syntax carrying no fact (the machine's signature, §16 item 6). The position is reported as information only (§21.1); it is not a scored per-face band, since a one-sentence face has no within-face sd. If a refiner can widen the range without either of those two costs, that is the sharpest single improvement still available to arm E on this pool.

## §5 THE SET, FACE BY FACE — LENGTH, LICENCE, AND WHAT CHANGED

Lengths in words, sorted: **8 · 8 · 9 · 11 · 11 · 12 · 13 · 13 · 14 · 17 · 18 · 19**; mean 12.75, min 8, max 19, none under 8 (`shareUnder8` 0.000 on all twelve) and none over 22. The form is `sentence` and the band's interior is where the mass sits, with two faces reaching toward each edge.

| # | words | face | changed | the clause that licenses each claim it makes |
|---|---|---|---|---|
| 1.plain | 11 | *The purchase of the watch {settlement} keeps is a public fact.* | — | `reads: compromised.revealed` + the card's `may claim` (both limbs of the one field's value); MOVE `INSTITUTION` (MOVE-GRAMMAR §1.2 row 5 — the condition of a security institution of this settlement); present indicative, the copula kept (R-DA-07); `{settlement}` from the bag's FILLED set |
| 1.a | 8 | *Public standing holds the purchase of {settlement}'s watch.* | — | the same field; the short line is R-DA-05's licence; `holds` is stative possession, not an intent on an inanimate thing (R-DA-11) |
| 1.b | 13 | *In {settlement} the buying of the watch stands on the plain public record.* | — | the same field; *the public record* names a standing, not a keeper, so arm A13 is not engaged; the fronted place adjunct is word order, spendable under B-CLAIM §3.4 |
| 1.c | 17 | *Of the watch {settlement} keeps, the purchase sits on the public side of the town's common affairs.* | — | the same field; the fronted `Of`-phrase is word order; *common affairs* is the settlement's civic business and carries no count, cause or season |
| 2.plain | 11 | *Obedience in {settlement}'s watch is bought in sight of the town.* | **REPLACED** — the `-ment` closer removed | the same field, fronted on the institution's obedience (the INSTITUTION move's "what the institution does" limb); *in sight of the town* states the `revealed` limb as a civic position, quantifies no column, and closes on the town rather than on an abstraction |
| 2.a | 12 | *The watch of {settlement} holds a bought allegiance out in the open.* | — | the same field; *allegiance* is the corrupted institution's answering, not a feeling or motive of any person (NL-5 / R-DA-14 unengaged: no person named, no interior claimed) |
| 2.b | 18 | *Where the obedience of the bought watch runs is a matter that lies open to {settlement}'s ordinary hearing.* | — | the same field; the wh-clause subject is rhythm, not a claim; the definite *the bought watch* ties the line to this town, so it is not a maxim (R-DA-12) |
| 2.c | 8 | *In open standing {settlement}'s watch answers a purchase.* | — | the same field, at the set's densest compression (§21.4); *answers* is the obedience limb 2.plain fronts |
| 3.plain | 14 | *A watch that has been bought is kept by {settlement} in open public view.* | **REPLACED** — the `is what` cleft removed | the same field, fronted on what the settlement keeps; the present perfect states a standing result, not an event with provenance (R-DST-B: no `sourceEventId`, no when, no who); the shipped covert twin uses the same perfect in its own `[plain]` row (*has been bought out of public view*) |
| 3.a | 9 | *The bought watch of {settlement} stands under open notice.* | — | the same field; *open notice* is the publicity limb as a civic condition; the short line again |
| 3.b | 19 | *The keeping of a watch that has been bought counts in the public affairs of {settlement} as open dealing.* | **REPLACED** — the `{settlement}` closer moved inboard | the same field; *counts as* reports the standing the record holds and adds no rating (CL-7 / NL-11); *the public affairs of {settlement}* is the site of the standing, not a second fact; the slot now sits mid-sentence, where it cannot red the closer band |
| 3.c | 13 | *What {settlement} has for a watch is sold in the town's plain sight.* | — | the same field; *sold* is the purchase limb from the other side of the transaction; *plain sight* is the publicity limb; the fronted free relative is rhythm, and is not the `is what` shape arm X reads |

**The one claim, carried identically by all twelve (arm C / A6).** Every face asserts the single triple `(INSTITUTION, compromised.revealed, true)` in both limbs — the settlement's watch is bought, and the buying carries public standing. No face asserts one limb alone, none asserts anything else, none names a second field. The three variants differ only in what is fronted: **1** the purchase as a fact of the record, **2** the obedience the purchase holds, **3** what the settlement keeps. That is the pool's spread (A11, arm E) and it is not a difference of claim.

**The thread (owner ~21:4x; MOVE-GRAMMAR §1.4.1).** Each face carries `{settlement}` forward from the spine, which names it in all eight attached spine faces, and each also carries it forward from the one sibling modifier that can share a cell (`country: pressed (walled)` on `WALLED-STRAINED`, keyed on `{settlement}` too). No face leans on a pronoun reaching back past an intervening sentence; the subject of every face is the watch, the purchase, the obedience, or what the settlement keeps, and the settlement is named inside the same clause-complex. So each reads as the passage's next sentence whether the composer seats it directly after the spine or after a sibling modifier. Checked against the shipped spines: no face shares its first two words with any DS-DEF-11 spine variant.

**Walls re-checked on all twelve against the shipped regexes (zero hits each).** No em dash · no exclamation · no question mark · no digit · no percent · no `, which` · no semicolon · no colon · no coordinator `and` / `but` / `or` / `yet` · no `-ly` adverb · no quantifier from `every · all · none · nothing · nobody · only · any · never · always · no one` · no modal, so no future indicative (`FUTURE_INDICATIVE`) and no modality spent · no `was` / `were` / `had` / `once` / `formerly` / `no longer`, so arm C3's semantic-history channel stays silent · no `RECORD_CITATION` shape · one sentence each · no second person, no persona, no reader address (R-DA-01, A5) · no figure, no sense verb on an abstraction, no inanimate intent (R-DA-11) · no ABSENCE-shaped face (ARCH §2.5 refuses `ABSENCE` in this pool's MOVE column) · no named person and no character's fate · no theological claim · no record holder (arm A13) · every face carries exactly the parent's slot set `{settlement}` and none opens on it (T-F8).
