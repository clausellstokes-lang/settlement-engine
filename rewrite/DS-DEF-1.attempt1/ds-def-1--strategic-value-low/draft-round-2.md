Seat: Opus 5 — WRITER, Fable-unvalidated. Block DS-DEF-1 · pool `strategic value LOW` · REWRITE draft round 2.
The rows below are the complete replacement for the pool's three shipped variant rows. The pool's typed lines (ROLE / READS / STATE-KEY / SLOTS / SECTION-TARGET / PROVENANCE + FENCE / COMPOSITION FENCE) are already in the annex and are NOT repeated here. Every variant keeps its number, its order and its bracketed angle tag exactly as it stands; none is added, removed, merged or reordered. Four faces each: the variant's own line, which IS the plain face, and three `[face]` sub-rows.

1. `[counterforce]` Nothing at {settlement} would repay an attempt on the town.
   - `[face]` The taking of {settlement} would be a bad bargain.
   - `[face]` More would be spent on an attempt at {settlement} than the place is worth.
   - `[face]` Whoever came for {settlement} would come for little.
2. `[ledger]` No prize stands at {settlement}.
   - `[face]` Among places worth having, {settlement} does not figure.
   - `[face]` The value of {settlement} to anybody outside it is small.
   - `[face]` For all that {settlement} holds, the gain in having it is poor.
3. `[street]` The town is not the kind of place anybody takes.
   - `[face]` What the town has, nobody else wants.
   - `[face]` Nothing here would pay for the coming.
   - `[face]` What would be got here would not answer for the work.

--- NOTES

**Packet.** DS-DEF-1 · pool `strategic value LOW` · DRAFT round 2 · seat Opus 5 (Fable-unvalidated). 3 variants, 12 faces, none added, none removed, none merged, none reordered (§22 a/b/e). Card printed by `node scripts/prose-licence-card.mjs DS-DEF-1 'strategic value LOW'` in the read-only dock `laneRW-DEF1`; the block's annex section read at `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2500-2566`; the projector's tag and face parsing read at `scripts/generate-dossier-state-prose.mjs:330-358, 443-448, 829`; the mark vocabulary at `src/domain/display/stateProse/stateProseKernel.js:207-211`; the gate's two grains at `scripts/prose-wave-gate.mjs:437-484` and its verdict at `:810-853`. No dock byte was written and no test was run.

**Word counts, in row order.** Variant 1: 10 · 9 · 14 · 8. Variant 2: 5 · 8 · 10 · 12. Variant 3: 10 · 7 · 7 · 11. Mean 9.25, min 5, max 14. The pool's `form` is `sentence`, so the gate's per-face word ceiling is `null` (`prose-wave-gate.mjs:1660`, `ceiling = form === 'fragment' ? 12 : null`) and no face is over.

---

## 1. THE GATE'S FEEDBACK, ANSWERED MEASURE BY MEASURE

### 1.1 REFUSAL — ROWS UNAPPLIED: the `[plain]` second-tag defect. **CURED, and the cure is a grammar correction, not a wording change.**

Round 1 wrote each variant as `` 1. `[counterforce]` `[plain]` … ``. That is unlawful, and the gate is right about why. `parseTag`/`foldTags` (`generate-dossier-state-prose.mjs:330-358`) fold a SECOND bracketed tag's leading part into the variant's `marks` array; `marks` is a CLOSED vocabulary — `STATE_MARK_DIMENSIONS` (`stateProseKernel.js:207-211`) holds exactly `minor`, `major`, `catastrophic`, `deficit`, `no deficit`, `anchored`, `not anchored` — so `plain` enters as an unclassified mark and `tests/data/dossierStateProseProjection.contract.test.js` reds on it. The projector's own docblock states the rule in the same words: *an unclassified word is a state dimension the kernel cannot see*.

**The lawful shape, with its receipt.** The variant's own text line IS the plain face; it carries ONE bracketed tag, its angle. `:829` computes `faceCounts = p.variants.map((v) => 1 + v.wordings.length)` — the parent text plus its `[face]` rows — so a variant line and three `- ``[face]`` ` sub-rows is four faces, which is `FACE_PIN` (`:705`). The shipped precedent is inside this very block: the `terrain FAVOURABLE to the defender` pool's three variants each carry one angle tag on the numbered line and three `[face]` sub-rows, and nothing tagged `[plain]` appears anywhere in the annex. ARCH §2.5's example row shows `` `[plain]` `` only because its illustrative variant carries no angle tag at all; on a tagged row it would be the second tag the projector refuses. The rows above are written in the shipped grammar and are paste-ready.

### 1.2 FAILING MEASURE — `band depth · shapes.whichTailRate (over) = 26.027 band-widths on 1 of 3 face(s)`. **MOVED to 0 on 3 of 3 faces.**

The measure is the SHIPPED rows', as the gate says, and its site is exact: shipped variant 3's closing tail, *"…, which is not the same as being comfortable with it."* `shapes.whichTailRate` is `rate(count(/, which\b/))` (`proseFingerprint.js:143`); on a one-sentence face a single hit is a rate of 1.0, and 1.0 against a band width of ≈ 0.0384 is the 26.027 band-widths reported. **No face in the rows above contains `which` in any position**, so the metric reads 0 on all twelve, which sits inside the band whose floor is 0 for every leaf register that never writes the tail. The wall is independent of the band and is also met: MOVE-GRAMMAR §1.4 constraint 6, *QUALIFY never as a "which" tail*; R-DA-03; the register card's `no which-clause`.

### 1.3 THE OTHER SEVEN FACE-GRAIN METRICS, CHECKED BY HAND ON ALL TWELVE FACES

The gate scores only eight metrics at the FACE grain — `FACE_LEVEL_METRICS` = `RATE_METRICS` less `TEXT_LEVEL_METRICS` (`prose-wave-gate.mjs:459-484`) — and `inBandOf` reads the face grain alone (`:812`, `pool.band`), the corpus grain being reported beside it (`:1712`, `corpusBand`). The eight, each checked against its own regex in `proseFingerprint.js:131-146`:

| face metric | its detector | hits across the twelve faces |
|---|---|---|
| `punctuation.colonRate` | `/:\s/` | 0 |
| `punctuation.emDashRate` | `/—\|--/` | 0 |
| `punctuation.questionRate` | `/\?/` | 0 |
| `punctuation.exclamationRate` | `/!/` | 0 |
| `punctuation.parenthesisRate` | `/\(/` | 0 |
| `shapes.participialOpenerRate` | first word `/ing$/` outside `NOT_PARTICIPLES` | 0 — the twelve first words are *Nothing · The · More · Whoever · No · Among · The · For · The · What · Nothing · What* |
| `shapes.whichTailRate` | `/, which\b/` | 0 |
| `shapes.dialogueShare` | `/["“]/` | 0 |

So every face is expected inside every band it is scored on, `deepest` is absent, `depthOk` holds, and the BUDGET arm (`a face exceeds at most two thirds of the soft rules measurable on it`) is met with 0 of 8 exceeded rather than vacuously. **Declared, not hidden:** 0 of 8 exceeded trips §16.1's PERFECTION CEILING, which is *a finding, never a rewrite trigger* — and it is an artefact of the grain, since the eight face-level metrics are all shapes this register's walls forbid outright. The variance §16 asks for lives in the thirteen TEXT-level metrics, which are scored on the pool's rendered corpus and reported.

### 1.4 THE ROUND IS NOT DRY

Part B §21's test is *two consecutive rounds that move no failing measure*. Round 2 moves two: the REFUSAL (rows unapplied → paste-ready in the shipped grammar) and `shapes.whichTailRate` (26.027 band-widths over on 1 of 3 → 0 on 3 of 3).

### 1.5 THE CEILING REVIEW, AND WHY THE TWELVE WORDINGS ARE CARRIED UNCHANGED

The twelve wordings were never measured: the gate could not apply the rows, so its band figures describe the shipped sentences and not these. §21.1–§21.3's push toward the ceiling is the REFINEMENT round's charge, by a different author, after the draft phase is lawful; the draft phase's own charge (§21) is to get the set inside every band. The ceiling pass was made anyway and is recorded rather than left silent. Four sharpenings were drafted and all four were refused, each by a named law, so nothing was changed:

1. **1a** *a bad bargain* → *would cost more than the having*. Refused: *having* would then stand three times across the pool (2a *worth having*, 2c *the gain in having it*), over R-DA-10's rationed-word ceiling of 0.200.
2. **2b** *is small* → *counts for little*. Refused: *little* already closes 1c; the gain in rhythm buys a second rationed word, and *small* is the band word rendered plain, which is the flattest thing the ledger face can say.
3. **3c** *What would be got here* → *What is got here*. Refused under §21.3 — the present indicative asserts that something IS extracted here, a claim the card does not carry; the subjunctive is the licensed modality for an edge (A2, R-DA-07), and the licensed wording wins over the sharper one.
4. **3c** → *What would be taken here would not answer for the taking*. Refused: the *take* family would stand four times of twelve (0.333), over R-DA-10.

**One tension named for the refuter rather than smoothed.** *bad bargain* (1a) uses a rating word, and MOVE-GRAMMAR §1.3 refuses the VERDICT move where no typed rating field holds it. The answer is that a typed rating field does hold it — `strategicValue` is a valuation and its value here is LOW — and *bad* names the direction of an exchange, not a judgement of the town. If the sitting reads it the other way, the lawful substitute is 1a rewritten as a measurement in words, and it is a one-face change.

---

## 2. THE FACT THIS POOL IS ALLOWED TO STATE, AND THE ONE THAT GOVERNS THE SET

The card's `may claim` line prints `that js) (=== Forest) holds, as a STANDING fact of the record` — a mangled tail of the read path, not a claim (finding F1, carried from round 1). Read at the dock, the pool's own reading is unambiguous: `TERRAIN_PRIZE_OF` (`defenseStateProse.js:655-659`) is `Coastal → strategic value HIGH`, `Mountain → strategic value HIGH`, `Forest → strategic value LOW`, and `strategicPrizePoolKey` returns nothing for every other terrain. **The one licensed claim of this pool is therefore: this town is not worth taking, as a standing fact of the record.** All twelve faces make that claim and no other; arm A6 and MOVE-GRAMMAR §3.4 forbid a claim difference inside a pool, so the faces differ in construction, vocabulary and rhythm, never in assertion.

**The fact that governs the whole set (F2).** `Forest` is also a key of `TERRAIN_DEFENCE_OF` (`:629-637`), where it maps to `terrain FAVOURABLE to the defender`. So **every town that draws this pool also draws the terrain spine**, from the same field, at the same header. That is why no face names the ground, the woods, cover, an approach or a landform: the neighbouring spine owns the site and this one owns the worth.

---

## 3. PER FACE — THE CARD CLAUSE THAT LICENSES EACH CLAIM

| # | face | claim(s) it makes | the card clause that licenses it |
|---|---|---|---|
| all 12 | — | this town is not worth taking | `may claim: that … holds, as a STANDING fact of the record`, read as §2 grounds it; MOVE `PRESENT` by MOVE-GRAMMAR §1.2 row 1 (a standing configuration field licenses a STRUCTURAL clause and never a historical one). No face carries a second claim: `may NOT: … a second fact` |
| 1 plain–2c | `{settlement}` | the town is named | `bag: {band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, **FILLED at this block's call sites: {settlement}** — so `settlement` is the only lawful slot. Carried exactly once in each of variant 1's and variant 2's four faces; **no face opens on it** (ARCH §2.5, T-F8) |
| 3 plain–3c | (no slot) | — | variant 3 ships with no slot, so its four faces carry none: a face's `{slot}` set must equal its parent's (T-F8). The precedent is this lane's `readiness CRITICAL` variant 2, kept slotless across its faces |
| all 12 | "an attempt", "whoever came", "anybody", "nobody else" | the generic counterparty a worth-claim runs against | the pool KEY's own predicate: a *strategic value* is a value **to somebody outside the town**, and the key states it as LOW. These are generic role terms, not a PERSON move (no office, no holding, no act — R-DA-14), not an interest and not a named party. `counterpart` stays an unfilled slot and no counterparty is ever named |
| 1 plain | *would repay an attempt on the town* | the worth stated as a return that does not come | `may claim`; the subjunctive is the licensed modality for an edge (A2; R-DA-07). Closes on **the town** — a civic object, R-DA-04's object kind, and the noun a following modifier picks up |
| 1a | *would be a bad bargain* | the same worth as a plain transaction | `may claim`; the `[counterforce]` angle's flattest form. A mercantile idiom, not a figure: nothing is compared to a thing it is not (R-DA-11). Closes on **an object**. The rating-word tension is named at §1.5 |
| 1b | *More would be spent … than the place is worth* | the worth stated as an inequality | `may claim`. **A comparison written as a measurement in words** — the form R-DA-11 licenses in place of a figure; no quantity is named, so `may NOT: a count` is not engaged (A4: no digit anywhere) |
| 1c | *would come for little* | the same, at eight words | `may claim`. The set's shortest counterforce line; closes on **a condition** |
| 2 plain | *No prize stands at {settlement}* | the key's own word, bare | `may claim`; five words, the plainest statement in the set and the `[ledger]`'s flat entry. *stands* is stative, not an intent verb on an inanimate (R-DA-11's third class) |
| 2a | *Among places worth having, {settlement} does not figure* | the worth as a place in a class | `may claim`. **No holder and no record is named** — *does not figure* is an idiom of reckoning, not a citation: `source: (none) · standing SOURCE-UNRESOLVED`, so naming a keeper is refused by arm A13 |
| 2b | *The value of {settlement} to anybody outside it is small* | the key's own noun, with the relation made explicit | `may claim`; `strategicValue` is the field's own word and *small* is the band it holds. The `{band}` slot is RESERVED and unfilled, so the band word is written as plain English and never as a slot |
| 2c | *the gain in having it is poor* | the worth as what possession returns | `may claim`; present tense, a standing fact. The concessive *For all that {settlement} holds* is word order, which B-CLAIM lets a grammar spend (MOVE-GRAMMAR §3.4), and it presupposes nothing about WHAT the town holds |
| 3 plain | *not the kind of place anybody takes* | the worth in the street's plain terms | `may claim`. **Nobody perceives, knows, believes or feels anything anywhere in this variant** — that is the whole of what changed from the shipped row (§4, C4–C6) |
| 3a | *What the town has, nobody else wants* | the same, as the absence of a want | `may claim`, the value relation stated from the other end: a worth is a wanting, and LOW is its absence. **The set's one universal negative over persons, declared here for the refuter**: it quantifies over a valuation, not over a table column, so the Brackwater arm (CLERK-LAWS C4, `closed` per column) is not engaged — no office, count, duty or exemption is asserted |
| 3b | *Nothing here would pay for the coming* | the worth as a journey that does not repay | `may claim`; seven words. *the coming* closes on **a name not given** — one of R-DA-04's five licensed close kinds |
| 3c | *would not answer for the work* | the same, in the plainest labour terms the register allows | `may claim`. Closes on **an object of work**, the last of the varied close kinds |

**Close kinds, varied across the pool** (R-DA-04): an object (the town · a bargain · the work) · the civic thing named (`{settlement}` itself, closing 2 plain) · a condition (worth · little · small · poor) · a name not given (the coming · figure) · a thing done (takes · wants). **No face closes on a pronoun** (`proseFingerprint.js:148`'s list is `it them him her us me you this that there here`, and none of the twelve ends on a member), **no face opens on a participle**, and **no face opens on the slot**. The twelve first words carry no adjacent repeat, so `openers.sameOpenerAsPreviousRate` is 0 over the set in row order.

**A11 / sibling distance.** All twelve first-two-word pairs are distinct: *Nothing at · The taking · More would · Whoever came · No prize · Among places · The value · For all · The town · What the · Nothing here · What would.* Rationed repetition inside the pool: the *take* family twice (1a, 3 plain) and *worth* twice (1b, 2a) of twelve, both at 0.167 and under R-DA-10's ≤ 0.200 ceiling.

---

## 4. THE SIX CLAIMS REMOVED FROM THE SHIPPED WORDINGS

The rule that settles it is not mine: **R-DA-15's Obeys (6) — an unlicensed claim is not a claim the pool was entitled to hold** — with §22's confirmed edge: *today's exact wording leaves the product when it fails the voice (its slot survives; its text stays in the annex history)*, and *cutting words is editing; cutting sentences is trimming*. Every slot, tag, number and order survives. Six claims do not, and **nothing was added in their place**.

| # | the shipped claim | why the card refuses it |
|---|---|---|
| C1 | v1 *"worth an army's season"* | `may NOT: … a season`. It is also a magnitude of force and of time that no field holds — a count-shaped claim in words (R-DA-16). It is the producing file's own docblock question, and the engine's internal framing question is not a licensed claim of the prose (F4) |
| C2 | v1 *"the town's best defense is that plain fact rather than anything on its walls"* | three refusals at once: it asserts **walls** (a second field, and DS-DEF-5 / DS-DEF-11's, not this pool's); the block's own **PROVENANCE + FENCE** forbids this header asserting anything about any one arm; and it would print a falsehood on every unwalled forest town. The *rather than* is additionally an R-DA-02 contrast whose rejected alternative names no sibling pool key or band — and it is a `shapes.antithesisRate` hit at the corpus grain |
| C3 | v2 *"What it can field matters less here than what it does not have that anyone would come for"* | it reads what the town **can field** — the force fields of DS-DEF-2 / DS-DEF-5 — and weighs two facts against each other. `may NOT: a second fact` |
| C4 | v3 *"The town knows it is not worth taking"* | `may NOT: … a standpoint`. No field carries knowledge; R-DA-14 and NL-5 refuse the interior, and the register card refuses an assigned reaction |
| C5 | v3 *"has made a kind of peace with the knowledge"* | the FEELING move does not exist anywhere in the estate (MOVE-GRAMMAR §1.3): no field carries motive, belief or mood |
| C6 | v3 *", which is not the same as being comfortable with it"* | the `, which` tail — **this is the gate's failing measure at §1.2**, a wall under MOVE-GRAMMAR §1.4 constraint 6 and R-DA-03 — **and** a MEANING move, the gloss that says what the fact means, which no field holds |

Variant 3's shipped row was three claims of which none was licensed and one was the fact; the rewrite keeps the fact and writes it four ways. That is the largest change in the packet and it is stated plainly rather than smoothed.

---

## 5. SEVEN WORDINGS REFUSED BEFORE THEY WERE WRITTEN

1. **Any wording naming the ground** — the woods, the trees, cover, a road in, an approach. The pool fires on Forest and only Forest, so the terrain is knowable; but the `terrain FAVOURABLE to the defender` spine draws on the same town from the same field, and a worth-line about the ground would restate it (arm A1) while asserting a landform claim this key does not carry.
2. **Any wording naming walls, a watch, a muster or a garrison** — a second field, and the block's own fence. This is what convicts the shipped v1 (C2).
3. **Any wording naming a holder, a record or an assessor** ("by the toll roll", "the assessors put it low"). `source: (none) · standing SOURCE-UNRESOLVED` — **NO citation is licensed**, and a face naming a holder here is refused by arm A13. S3 is unreachable from this pool until the holder census resolves it, and §24's ceiling of one citation per unit is never approached; the pool's `provenance.citations` is expected 0.
4. **Any wording carrying a perceiver or a knower** — *the town knows*, *a stranger sees*, *anyone can tell*. `may NOT: a standpoint`. The `[street]` angle survives as the town's plain idiom (*the kind of place anybody takes*, *nobody else wants*, *pay for the coming*) with nobody standing in it. **This is the one place a refuter may say the angle was thinned**; the answer is that the tag is a shaping property, not a licence to assert a perceiver.
5. **Any wording carrying a season, an army or a number** — *not worth an army's season*, *not worth a month's march*, *not worth two hundred spears*. `may NOT: a count, a season`; A4 forbids the digit and R-DA-16 the counted claim in words.
6. **Any wording in the future indicative** — *nobody will come for it*, *it will never be taken*. A2 and R-DA-07: state never fate. Every conditional in the set is subjunctive (*would*), and the present-tense faces state a standing condition, never a forecast.
7. **A contrast wording** — *not a prize but a place to live in*, *poor as a prize, sound as a town*. R-DA-02 licenses a contrast only where the rejected alternative names a sibling pool key or band; the only sibling key here is `strategic value HIGH`, and naming it would restate the sibling pool. The contrast budget stays unspent, `shapes.antithesisRate` reads 0 at the corpus grain, and the shipped v1's *rather than* leaves the register with it.

---

## 6. THE THREAD, AND WHAT THIS SPINE SITS BESIDE

This pool is a **spine** (`role: spine`; `attach:` empty; `relation:` none, because a spine carries none), so the composer places it first and a modifier reads after it. Every face therefore ends leaving a noun a follower can pick up — *the town*, *the place*, *the taking*, *the value*, *the gain*, *the work* — and none closes the passage off; a spine is never the passage's one turn outward, because it is never last (MOVE-GRAMMAR §1.4.1). Each face also stands alone, since the roll that picks it is unweighted and the reader meets exactly one.

**Arms A1 and A11 — neither restate nor contradict.** Three of DS-DEF-1's lenses can print at one header:

- **the `terrain FAVOURABLE to the defender` spine** fires on **every** town this pool fires on (§2, F2). It says the ground is on the defender's side; this set says the town is not worth coming for. Different fields, different claims, and true together — a defensible place that nobody has a reason to want. No word of ground, site, country or approach appears here, so there is no restatement to find.
- **the readiness spines** (`STRONG` … `CRITICAL`) say what the town amounts to as a defended place. Nothing here asserts that the town is defended, well or badly. This is deliberate and it is what convicted C2: the shipped *anything on its walls* both borrows a readiness claim and contradicts the `CRITICAL` spine, which says the town is effectively undefended.
- **the `strategic value HIGH` sibling** is this lens's other pool and can never co-render with it. It is the only rejected alternative R-DA-02 would license, and the set uses no contrast at all (§5, item 7).

**One tension, stated rather than smoothed.** Where readiness is `STRONG`, the readiness spine says an attempt on the town would take real effort, and 1b says more would be spent on an attempt than the place is worth. Both are licensed, from different fields, and they compound rather than collide — the effort is high and the return is low. Named for the refuter, not softened.

---

## 7. REFUSALS AND FINDINGS

**Variant refusals: none.** All three variants were made lawful and all three are written, with four faces each. The price is the six claims of §4.

**Wording refusals: four, all inside the ceiling review**, listed with their laws at §1.5 (1a *the having*; 2b *little*; 3c present indicative; 3c *the taking*). None removes a face; each is a sharpening that was drafted and not taken.

**Findings carried up (F1, F2, F3 and F4 stand from round 1; F6 is new).**

- **F1 — the card's `may claim` line is unusable as printed.** It reads `that js) (=== Forest) holds` — the tail of the read path `text(terrain) (via TERRAIN_PRIZE_OF in defenseStateProse.js)` split on a dot. A writer with no dock access could not tell what this pool may claim. **The printer should name the pool key's own classification** (here: the town's strategic value is LOW) and quote the predicate beneath it. Chair row.
- **F2 — the two DS-DEF-1 terrain lenses overlap on Forest, and the card says nothing about it.** Every town drawing `strategic value LOW` also draws `terrain FAVOURABLE to the defender`. The card's `echo` line reports mounts on a coarser producer-token root and cannot see this; the composed page can print both spines. **A card should print its co-resident pools where two lenses read one field.**
- **F3 — `move: (none declared)` on a spine that plainly takes PRESENT.** Every face here is a PRESENT move by MOVE-GRAMMAR §1.2 row 1, the only move a standing configuration field licenses. The packet asserts that reading rather than leaving the column blank; if the projector expects a `MOVE:` line on spine pools, this pool has none today and one is owed.
- **F4 — the shipped v1 quotes the engine's own docblock question as prose.** `defenseStateProse.js:640` frames the block as a question about an army's season and the shipped variant answers it in those words. An internal framing question is not a typed field, and the card refuses its two particulars. Worth a walker arm.
- **F5 — the `[street]` angle has no home in the card's vocabulary.** The card's `may NOT` names a standpoint, and `angle: counterforce ledger street` names a standpoint-shaped tag on the same pool. This packet treats the angle as the register of the sentence rather than as a perceiver's licence, but the tension recurs on every `[street]`, `[visitor]` and `[unfolding]` row in the block. **A sitting row: what a standpoint TAG licenses, if not a standpoint.**
- **F6 — NEW, and it cost this lane a whole round on every pool of the block. ARCH §2.5's example row teaches a `[plain]` tag that the projector refuses on any variant that already carries an angle tag.** The example is lawful only for its own tagless illustration; read as a template it produces the unclassified mark `plain` and reds the projection contract test, which is exactly what happened to all four of this lane's round-1 packets. **The fix is one sentence in ARCH §2.5:** state that the variant's own line IS the plain face, that `[plain]` is written only where the variant carries no angle tag, and that a second bracketed tag folds into `marks`, whose vocabulary is closed at `stateProseKernel.js:207-211`. Until that sentence exists, every writer briefed from ARCH §2.5 will write the same defect.
