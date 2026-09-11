Seat: Opus 5 — WRITER, Fable-unvalidated. Block DS-DEF-1 · pool `strategic value LOW` · REWRITE draft round 1.
The rows below are the complete replacement for the pool's three shipped variant rows. The pool's typed lines (ROLE / READS / STATE-KEY / SLOTS / SECTION-TARGET / PROVENANCE + FENCE / COMPOSITION FENCE) are already in the annex and are NOT repeated here. Every variant keeps its number, its order and its bracketed angle tag exactly as it stands; none is added, removed, merged or reordered. Four wordings each (one `[plain]`, three `[face]`).

1. `[counterforce]` `[plain]` Nothing at {settlement} would repay an attempt on the town.
   - `[face]` The taking of {settlement} would be a bad bargain.
   - `[face]` More would be spent on an attempt at {settlement} than the place is worth.
   - `[face]` Whoever came for {settlement} would come for little.
2. `[ledger]` `[plain]` No prize stands at {settlement}.
   - `[face]` Among places worth having, {settlement} does not figure.
   - `[face]` The value of {settlement} to anybody outside it is small.
   - `[face]` For all that {settlement} holds, the gain in having it is poor.
3. `[street]` `[plain]` The town is not the kind of place anybody takes.
   - `[face]` What the town has, nobody else wants.
   - `[face]` Nothing here would pay for the coming.
   - `[face]` What would be got here would not answer for the work.

--- NOTES

**Packet.** DS-DEF-1 · pool `strategic value LOW` · DRAFT round 1 · seat Opus 5 (Fable-unvalidated). 3 variants, 12 wordings, none added, none removed, none merged, none reordered (§22 a/b/e). Card printed by `node scripts/prose-licence-card.mjs DS-DEF-1 'strategic value LOW'` in the read-only dock `laneRW-DEF1`; the block's annex section read at `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2500-2566` (the four readiness spines, the two terrain spines and the `strategic value HIGH` sibling, for arms A1 and A11); the producing leaf read at `src/domain/display/stateProse/defenseStateProse.js:639-697`; the census row read at `docs/content/wiring-census.json`. The block's four sibling packets in this lane were read for house form and for sibling distance. No dock byte was written and no test was run.

**Word counts, in row order.** 10 · 9 · 14 · 8 / 5 · 8 · 10 · 12 / 10 · 7 · 7 · 11. Mean 9.25, min 5, max 14. Four wordings sit at eight words or under, so the short line exists in every variant (REGISTER-CARD: *rhythm follows what is being said*).

---

## 1. THE FACT THIS POOL IS ALLOWED TO STATE, AND THE ONE THAT GOVERNS THE SET

The card's `may claim` line prints `that js) (=== Forest) holds, as a STANDING fact of the record` — a mangled tail of the read path, not a claim (finding F1). Read at the dock, the pool's own reading is unambiguous: `TERRAIN_PRIZE_OF` (`defenseStateProse.js:655-659`) is `Coastal → strategic value HIGH`, `Mountain → strategic value HIGH`, `Forest → strategic value LOW`, and `strategicPrizePoolKey` returns nothing for every other terrain. **The one licensed claim of this pool is therefore: this town is not worth taking, as a standing fact of the record.** All twelve wordings make that claim and no other; arm C (MOVE-GRAMMAR §3.4) forbids a claim difference inside a pool, so the wordings differ in construction, vocabulary and rhythm, never in assertion.

**The fact that governs the whole set (F2).** `Forest` is also a key of `TERRAIN_DEFENCE_OF` (`:629-637`), where it maps to `terrain FAVOURABLE to the defender`. So **every town that draws this pool also draws the terrain spine**, from the same field, at the same header. That is why no wording here names the ground, the woods, cover, an approach or a landform: the neighbouring spine owns the site and this one owns the worth. The sibling packet in this lane wrote its own half of the fence in the same words — *"Nothing here touches worth, prize, price or an army's season"* — and this packet holds the other side of it.

---

## 2. PER WORDING — THE CARD CLAUSE THAT LICENSES EACH CLAIM

| # | wording | claim(s) it makes | the card clause that licenses it |
|---|---|---|---|
| all 12 | — | this town is not worth taking | `may claim: that … holds, as a STANDING fact of the record`, read as §1 grounds it; MOVE `PRESENT` by MOVE-GRAMMAR §1.2 row 1 (a standing configuration field licenses a STRUCTURAL clause and never a historical one). No wording carries a second claim: `may NOT: … a second fact` |
| 1a–2d | `{settlement}` | the town is named | `bag: {band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, **FILLED at this block's call sites: {settlement}** — so `settlement` is the only lawful slot. Carried exactly once in each of variant 1's and variant 2's four wordings; **no wording opens on it** (ARCH §2.5, T-F8) |
| 3a–3d | (no slot) | — | variant 3 ships with no slot, so its four wordings carry none: a face's `{slot}` set must equal its parent's (T-F8). The precedent is this lane's `readiness CRITICAL` variant 2, kept slotless across its four wordings |
| all 12 | "an attempt", "whoever came", "anybody", "nobody else" | the generic counterparty a worth-claim runs against | the pool KEY's own predicate: a *strategic value* is a value **to somebody outside the town**, and the key states it as LOW. These are generic role terms, not a PERSON move (no office, no holding, no act — R-DA-14), not an interest and not a named party. `counterpart` stays an unfilled slot and no counterparty is ever named |
| 1a | *would repay an attempt on the town* | the worth stated as a return that does not come | `may claim`; the subjunctive is the licensed modality for an edge (A2; R-DA-07). Closes on **the town** — a civic object, R-DA-04's object kind |
| 1b | *would be a bad bargain* | the same worth as a plain transaction | `may claim`; the `[counterforce]` angle's flattest form. A mercantile idiom, not a figure: nothing is compared to a thing it is not (R-DA-11). Closes on **an object** |
| 1c | *More would be spent … than the place is worth* | the worth stated as an inequality | `may claim`. **A comparison written as a measurement in words** — the form R-DA-11 licenses in place of a figure; no quantity is named, so `may NOT: a count` is not engaged (A4: no digit anywhere) |
| 1d | *would come for little* | the same, at eight words | `may claim`. The set's shortest counterforce line; closes on **a condition** |
| 2a | *No prize stands at {settlement}* | the key's own word, bare | `may claim`; five words, the plainest statement in the set and the `[ledger]`'s flat entry. `stands` is stative, not an intent verb on an inanimate (R-DA-11's third class) |
| 2b | *Among places worth having, {settlement} does not figure* | the worth as a place in a class | `may claim`. **No holder and no record is named** — *does not figure* is an idiom of reckoning, not a citation: `source: (none) · standing SOURCE-UNRESOLVED`, so naming a keeper is refused by arm A13 |
| 2c | *The value of {settlement} to anybody outside it is small* | the key's own noun, with the relation made explicit | `may claim`; `strategicValue` is the field's own word and `small` is the band it holds. The `{band}` slot is RESERVED and unfilled, so the band word is written as plain English and never as a slot |
| 2d | *the gain in having it is poor* | the worth as what possession returns | `may claim`; present tense, a standing fact. The concessive *For all that {settlement} holds* is word order, which B-CLAIM lets a grammar spend (MOVE-GRAMMAR §3.4), and it presupposes nothing about WHAT the town holds |
| 3a | *not the kind of place anybody takes* | the worth in the street's plain terms | `may claim`. **Nobody perceives, knows, believes or feels anything anywhere in this variant** — that is the whole of what changed from the shipped row (§3, C4–C6) |
| 3b | *What the town has, nobody else wants* | the same, as the absence of a want | `may claim`, the value relation stated from the other end: a worth is a wanting, and LOW is its absence. **The set's one universal negative over persons, declared here for the refuter** (§4, R7): it quantifies over a valuation, not over a table column, so the Brackwater arm (C4, `closed` per column) is not engaged — no office, count, duty or exemption is asserted |
| 3c | *Nothing here would pay for the coming* | the worth as a journey that does not repay | `may claim`; seven words. *the coming* closes on **a name not given** — one of R-DA-04's five licensed close kinds |
| 3d | *would not answer for the work* | the same, in the plainest labour terms the register allows | `may claim`. Closes on **an object of work**, the last of the varied close kinds |

**Close kinds, varied across the pool** (R-DA-04): an object (the town · a bargain · the work) · the civic thing named (`{settlement}` itself, closing 2a) · a condition (worth · little · small · poor) · a name not given (the coming · figure) · a thing done (takes · wants). **No wording closes on a pronoun** (the detector's list at `proseFingerprint.js:148` is `it them him her us me you this that there here`, and none of the twelve ends on a member), **no wording opens on a participle** (`Nothing` lowercases into `NOT_PARTICIPLES` at `:71`, the one place a crude `/ing$/` check gives a false positive), and **no wording opens on the slot**. The twelve first words are *Nothing · The · More · Whoever · No · Among · The · For · The · What · Nothing · What*: no two adjacent rows share an opener, so `sameOpenerAsPreviousRate` is 0 over the set in row order.

**A11 / sibling distance.** All twelve first-two-word pairs are distinct: *Nothing at · The taking · More would · Whoever came · No prize · Among places · The value · For all · The town · What the · Nothing here · What would.* Rationed repetition inside the pool: the `take` family twice (1b, 3a) and `worth` twice (1c, 2b) of twelve, both at 0.167 and under R-DA-10's ≤ 0.200 ceiling.

---

## 3. THE SIX CLAIMS REMOVED FROM THE SHIPPED WORDINGS

The three shipped variants each carry claims the card does not license. The rule that settles it is not mine: **R-DA-15's Obeys (6) — "an unlicensed … claim is not a claim the pool was entitled to hold (ruling 5 requires its removal — the B-CLAIM bar is not engaged)"** — with §22's confirmed edge: *today's exact wording leaves the product when it fails the voice (its slot survives; its text stays in the annex history)*, and *cutting words is editing; cutting sentences is trimming*. Every slot, tag, number and order survives. Six claims do not, and **nothing was added in their place**.

| # | the shipped claim | why the card refuses it |
|---|---|---|
| C1 | v1 *"worth an army's season"* | `may NOT: … a season`. It is also a magnitude of force and of time that no field holds — a count-shaped claim in words (R-DA-16). It is the producing file's own docblock question (*"is this town worth an army's season?"*), and the engine's internal question is not a licensed claim of the prose (F4) |
| C2 | v1 *"the town's best defense is that plain fact rather than anything on its walls"* | three refusals at once: it asserts **walls** (a second field, and DS-DEF-5 / DS-DEF-11's, not this pool's); the block's own **PROVENANCE + FENCE** forbids this header asserting anything about any one arm; and it would print a falsehood on every unwalled forest town. The *"rather than"* is additionally an R-DA-02 contrast whose rejected alternative names no sibling pool key or band |
| C3 | v2 *"What it can field matters less here than what it does not have that anyone would come for"* | it reads what the town **can field** — the force fields of DS-DEF-2 / DS-DEF-5 — and weighs two facts against each other. `may NOT: a second fact` |
| C4 | v3 *"The town knows it is not worth taking"* | `may NOT: … a standpoint`. No field carries knowledge; R-DA-14 and NL-5 refuse the interior, and the register card refuses an assigned reaction |
| C5 | v3 *"has made a kind of peace with the knowledge"* | the FEELING move does not exist anywhere in the estate (MOVE-GRAMMAR §1.3): no field carries motive, belief or mood |
| C6 | v3 *"which is not the same as being comfortable with it"* | a `, which` tail (wall 6; R-DA-03, whose ceiling is ≤ 0.010 per variant) **and** a MEANING move — the gloss that says what the fact means, which no field holds (MOVE-GRAMMAR §1.3) |

Variant 3's shipped row was three claims of which none was licensed and one was the fact; the rewrite keeps the fact and writes it four ways. That is the largest change in the packet and it is stated plainly rather than smoothed.

---

## 4. SEVEN WORDINGS REFUSED BEFORE THEY WERE WRITTEN

1. **Any wording naming the ground** — the woods, the trees, cover, a road in, an approach. The pool fires on Forest and only Forest, so the terrain is knowable; but the `terrain FAVOURABLE to the defender` spine draws on the same town from the same field, and a worth-line about the ground would restate it (arm A1) while asserting a landform claim this key does not carry.
2. **Any wording naming walls, a watch, a muster or a garrison** — a second field, and the block's own fence. This is what convicts the shipped v1 (C2).
3. **Any wording naming a holder, a record or an assessor** ("by the toll roll", "the assessors put it low"). `source: (none) · standing SOURCE-UNRESOLVED` — **NO citation is licensed**, and a face naming a holder here is refused by arm A13. S3 is unreachable from this pool until the holder census resolves it, and §24's ceiling (one citation per unit, on one of three reasons) is never approached.
4. **Any wording carrying a perceiver or a knower** — *the town knows*, *a stranger sees*, *anyone can tell*. `may NOT: a standpoint`. The `[street]` angle survives as the town's plain idiom (*the kind of place anybody takes*, *nobody else wants*, *pay for the coming*) with nobody standing in it. **This is the one place a refuter may say the angle was thinned**; the answer is that the tag is a shaping property, not a licence to assert a perceiver.
5. **Any wording carrying a season, an army or a number** — *not worth an army's season*, *not worth a month's march*, *not worth two hundred spears*. `may NOT: a count, a season`; A4 forbids the digit and R-DA-16 the counted claim in words.
6. **Any wording in the future indicative** — *nobody will come for it*, *it will never be taken*. A2 and R-DA-07: state never fate. Every conditional in the set is subjunctive (`would`), and the four present-tense wordings state a standing condition, never a forecast.
7. **A contrast wording** — *not a prize but a place to live in*, *poor as a prize, sound as a town*. R-DA-02 licenses a contrast only where the rejected alternative names a sibling pool key or band; the only sibling key here is `strategic value HIGH`, and naming it would restate the sibling pool. The contrast budget stays unspent, and the shipped v1's *"rather than"* leaves the register with it.

---

## 5. THE THREAD, AND WHAT THIS SPINE SITS BESIDE

This pool is a **spine** (`role: spine`; `attach:` empty; `relation:` none, because a spine carries none), so the composer places it first and a modifier reads after it. Every wording therefore ends leaving nouns a follower can pick up — *the town*, *the place*, *the taking*, *the value*, *the gain*, *the work* — and none of them closes the passage off; a spine is never the passage's one turn outward, because it is never last. Each wording also stands alone, since the roll that picks it is unweighted and the reader meets exactly one.

**Arms A1 and A11 — neither restate nor contradict.** Three of DS-DEF-1's lenses can print at one header:

- **the `terrain FAVOURABLE to the defender` spine** fires on **every** town this pool fires on (§1, F2). It says the ground is on the defender's side; this set says the town is not worth coming for. Different fields, different claims, and true together — a defensible place that nobody has a reason to want. No word of ground, site, country or approach appears here, so there is no restatement to find.
- **the readiness spines** (`STRONG` … `CRITICAL`) say what the town amounts to as a defended place. Nothing here asserts that the town is defended, well or badly. This is deliberate and it is what convicted C2: the shipped *"anything on its walls"* both borrows a readiness claim and contradicts the `CRITICAL` spine, which says the town is effectively undefended.
- **the `strategic value HIGH` sibling** is this lens's other pool and can never co-render with it. It is the only rejected alternative R-DA-02 would license, and the set uses no contrast at all (§4, R7), which keeps the antithesis probe at zero for this pool.

**One tension, stated rather than smoothed.** Where readiness is `STRONG`, the readiness spine says an attempt on the town would take real effort, and 1c says more would be spent on an attempt than the place is worth. Both are licensed, from different fields, and they compound rather than collide — the effort is high and the return is low. Named for the refuter, not softened.

---

## 6. MECHANICAL CHECK

The detector definitions were read verbatim in the dock (`src/domain/prose/proseFingerprint.js:113-149`) and the twelve wordings were matched against them in memory, with no file written and no dock byte touched: **zero hits** across the twelve on a digit · a percent · an em dash · an exclamation · a question mark · a semicolon · a colon · `which` · `will` / `shall` / a bare future · `you` / `your` / `I` · `because` · a `There is` / `It is` opener · an antithesis shape (`not X but Y`, `rather than`) · a triad · a citation phrase (`according to`, `it is said`, `some say`) · a simile or an inanimate acting with intent · a slot-initial wording · a participial opener · a pronoun closer · a same-opener-as-previous pair. Every wording is one sentence; variant 1's and variant 2's each carry `{settlement}` exactly once and variant 3's carry none, so each face's slot set equals its parent's (T-F8).

**Two figures declared rather than discovered.** (i) `closers.abstractNounRate` (`:147`) keys on the suffixes `ness tion sion ity ment ance ence ship hood dom`; the twelve closers are *town · bargain · worth · little · settlement · figure · small · poor · takes · wants · coming · work*, so the set's abstract-closer count is **0 of 12**, and the register's ≤ 0.060 guard is unmoved. (ii) The `take` family stands at 2 of 12 and `worth` at 2 of 12, both under R-DA-10's ≤ 0.200 rationed-word ceiling; they are named because a one-fact pool has few other words and a refiner should know where the ceiling already sits.

---

## 7. REFUSALS AND FINDINGS

**Variant refusals: none.** All three variants were made lawful and all three are written, with four wordings each. The price is the six claims of §3.

**Findings carried up.**

- **F1 — the card's `may claim` line is unusable as printed.** It reads `that js) (=== Forest) holds` — the tail of the read path `text(terrain) (via TERRAIN_PRIZE_OF in defenseStateProse.js)` split on a dot. A writer with no dock access could not tell what this pool may claim. **The printer should name the pool key's own classification** (here: the town's strategic value is LOW) and quote the predicate beneath it. Chair row.
- **F2 — the two DS-DEF-1 terrain lenses overlap on Forest, and the card says nothing about it.** Every town drawing `strategic value LOW` also draws `terrain FAVOURABLE to the defender`. The card's `echo` line reports mounts on a coarser producer-token root and cannot see this; the composed page can print both spines. **A card should print its co-resident pools where two lenses read one field.** This is the fact the whole set was written around.
- **F3 — `move: (none declared)` on a spine that plainly takes PRESENT.** Every wording here is a PRESENT move by MOVE-GRAMMAR §1.2 row 1, the only move a standing configuration field licenses. The packet asserts that reading rather than leaving the column blank; if the projector expects a `MOVE:` line on spine pools, this pool has none today and one is owed. (The sibling packet raised the same row.)
- **F4 — the shipped v1 quotes the engine's own docblock question as prose.** `defenseStateProse.js:640` asks *"is this town worth an army's season?"* and the shipped variant answers it in those words. An internal framing question is not a typed field, and the card refuses its two particulars (a season, a magnitude of force). Worth a walker arm: prose that reuses a producing file's rhetorical question is licensed by nothing.
- **F5 — the `[street]` angle has no home in the card's vocabulary.** The card's `may NOT` names a standpoint, and `angle: counterforce ledger street` names a standpoint-shaped tag on the same pool. This packet resolves it by treating the angle as the register of the sentence rather than as a perceiver's licence, but the tension is real and recurs on every `[street]`, `[visitor]` and `[unfolding]` row in the block. **A sitting row: what a standpoint TAG licenses, if not a standpoint.**
