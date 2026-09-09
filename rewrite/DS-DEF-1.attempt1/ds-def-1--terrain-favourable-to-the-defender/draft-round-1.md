1. `[visitor]` The ground at {settlement} favours whoever holds the town.
   - `[face]` Whatever comes at {settlement} must first cross ground that is hard going for an attacker.
   - `[face]` Rough country about {settlement} is unbuilt defence.
   - `[face]` From any side, the way in to {settlement} is the defender's ground.
2. `[ledger]` Part of the defence at {settlement} stands to the account of the site.
   - `[face]` The site enters the reckoning at {settlement} on the defender's side.
   - `[face]` In its siting, {settlement} has the better of the country.
   - `[face]` Counted into what holds {settlement} is the ground under the town.
3. `[counterforce]` Any attempt on {settlement} contends with the country before it contends with anybody.
   - `[face]` To come at {settlement} is harder than to hold the place.
   - `[face]` The country about {settlement} stands in the way of any force that comes.
   - `[face]` Nothing comes at {settlement} on level terms.

--- NOTES

**Packet.** DS-DEF-1 · pool `terrain FAVOURABLE to the defender` · DRAFT round 1 · seat Opus 5 (Fable-unvalidated). 3 variants (the three that ship), 12 faces, none added, none removed, none merged, none reordered; each variant keeps its own number and its own bracketed tag (§22 a/b/e). Card printed by `node scripts/prose-licence-card.mjs DS-DEF-1 'terrain FAVOURABLE to the defender'` in the read-only dock `laneRW-DEF1`; the block's annex section read at `docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:2500-2570` (the readiness spines, the `terrain EXPOSED` sibling and the two strategic-value siblings, for arms A1 and A11); the producing leaf read at `src/domain/display/stateProse/defenseStateProse.js:610-692`.

**Word counts, in row order.** 9 · 15 · 7 · 12 / 13 · 11 · 10 · 11 / 13 · 11 · 13 · 7. Mean 11.0, min 7, max 15. Three faces sit at or under ten words so the short line exists in every variant (REGISTER-CARD: *rhythm follows what is being said*).

---

## 1. THE ROW FORM, AND THE ONE PLACE THIS PACKET READS THE BRIEF

The brief asks for "its bracketed tag exactly as it stands, a `[plain]` line, and three `[face]` sub-rows". ARCH §2.5's grammar gives a variant row exactly ONE bracketed tag slot, and in the two taste packets that slot held `[plain]` because those pools' card said `angle: plain`. This pool's card says `angle: counterforce ledger visitor`, so the tag slot is already occupied by the angle, and the angle is not mine to touch. **The parent row therefore carries its own tag and IS the plain line**; the three `[face]` sub-rows hang under it. If the chair wants a literal `[plain]` token in addition to the angle, that is a one-token edit per row and no wording moves. Flagged rather than decided.

---

## 2. THE CARD, AND THE PREDICATE GROUNDED (the reason every face is abstract)

The card prints `predicate: text(terrain) … === Mountain`. **That is the card printing the first key of a map of five.** Read at the dock, `TERRAIN_DEFENCE_OF` (`defenseStateProse.js:629-637`) is:

- `Mountain` → `terrain FAVOURABLE to the defender`
- `Hills` → `terrain FAVOURABLE to the defender`
- `Forest` → `terrain FAVOURABLE to the defender`
- `Plains`, `Desert/Arid` → `terrain EXPOSED`
- `Coastal`, `Riverside` → **absent on purpose**; the lens is silent, and the file's own docblock says so.

So this pool fires on **three terrains, not one**, and every face must be true of a mountain town, a hill town and a forest town alike. That single fact governs the whole set: no face names a narrows, a height, a slope, a ridge, cover, a defile or a long open approach, because each of those is true of one or two of the three and false of the rest. The set asserts only what the classification itself holds — that the ground is on the defender's side of the account — and leaves the landform to the terrain word the page already prints.

**This is the sharpest finding in the packet, and it convicts the shipped rows** (see §5).

---

## 3. PER FACE — THE CARD CLAUSE THAT LICENSES EACH CLAIM

Every one of the twelve faces makes **exactly one claim**, and it is the same claim in all twelve: *the ground this town stands in favours the defender*, as a STANDING fact of the record. The card's `may claim` line is that clause and nothing else; arm C (MOVE-GRAMMAR §3.4) forbids a claim difference inside a pool, so the variants differ in construction, vocabulary and rhythm, never in assertion.

| # | face | claim(s) it makes | the card clause that licenses it |
|---|---|---|---|
| all 12 | — | the ground here favours the defender | `may claim: that … (=== Mountain) holds, as a STANDING fact of the record`; MOVE `PRESENT` by MOVE-GRAMMAR §1.2 row 1 (a standing configuration field licenses a STRUCTURAL clause and never a historical one) |
| all 12 | `{settlement}` | the town is named | `bag: {settlement: proper}`, the one slot **FILLED at this block's call sites**; `band` is RESERVED, `route` and `counterpart` are unfilled, so no other slot is lawful. Every face carries it exactly once, so the slot set is identical to its parent's (T-F8); **no face opens on it** (same row of the ARCH §2.5 table) |
| all 12 | "the defender" / "an attacker" | the roles the advantage runs between | the POOL KEY's own predicate — `terrain FAVOURABLE **to the defender**`. These are the key's generic role terms, not a PERSON move (no office, no holding, no act — R-DA-14) and not a standpoint (nobody sees, believes, knows or judges anything anywhere in the set) |
| 1a | *favours whoever holds the town* | the advantage attaches to possession, not to this town's works | `may claim` alone. "whoever holds" is the key's `defender` restated so the line stays true where the town's readiness is `CRITICAL` (§4) |
| 1b | *must first cross ground that is hard going for an attacker* | the same advantage stated as the attacker's difficulty | the key is relational: *favourable **to the defender*** is the same typed fact as *adverse to the attacker*. No second field is read; `must` is necessity, not a future indicative (R-DA-07; A2) |
| 1c | *is unbuilt defence* | the defence here was not put there by the town | the STANDING half of `may claim`: a terrain classification is a fact of the site and of no event, so MOVE-GRAMMAR §1.2 row 2 (HISTORY) is unreachable and the eventless reading is the only licensed one. Stated in the positive so it presupposes nothing about what the town HAS built |
| 1d | *the way in … is the defender's ground* | the approach itself carries the advantage | `may claim`; "from any side" is a property of the classification, not a count of sides (no digit, A4) |
| 2a | *stands to the account of the site* | the site is part of what defends the town | `may claim`; `[ledger]`'s own idiom. "Part of" is a partitive with no number (the card's `may NOT: a count` is not engaged) |
| 2b | *enters the reckoning … on the defender's side* | the same, as an act of counting | `may claim`. **No holder is named**: a reckoning is not a keeper, and `source: (none) · SOURCE-UNRESOLVED` forbids naming one (§5, R3) |
| 2c | *has the better of the country* | the relational advantage, compressed | `may claim`, the key's relation stated as an idiom. §21.4: a compressed idiom that rewards the reader is the ceiling, not a fault |
| 2d | *Counted into what holds {settlement} is the ground under the town* | the site is an item in what defends | `may claim`; the fronted predicate is word order, which B-CLAIM lets a grammar spend (MOVE-GRAMMAR §3.4) |
| 3a | *contends with the country before it contends with anybody* | the ground is met before the town is | `may claim`, converse form. Closes on **a name not given** — one of R-DA-04's five licensed close kinds |
| 3b | *harder than to hold the place* | the attacker/defender asymmetry, bare | `may claim`. A comparison written as a measurement in words, the form R-DA-11 licenses in place of a figure. This is the set's plainest statement of the licensed fact and the ceiling face (§21.1) |
| 3c | *stands in the way of any force that comes* | the ground obstructs an approach | `may claim`; `stands` is stative, not an intent verb on an inanimate (R-DA-11's third class) |
| 3d | *Nothing comes at {settlement} on level terms* | the same, at seven words | `may claim`. "on level terms" is a measurement in words, and it is the set's nearest figure risk — **named here for the refuter** |

**Close kinds, varied across the pool** (R-DA-04): an object (town · site · ground · country) · a role (attacker · defender) · a condition (side · terms · comes) · an absence-shaped statement (unbuilt defence) · a name not given (anybody). **No face closes on a pronoun**, and **no face opens on a participle** — the participial-opener detector (`proseFingerprint.js:141`) is the trap that scored 28 band-widths on a taste face, and it was run rather than eyeballed (§5.3). The twelve first words are *The · Whatever · Rough · From · Part · The · In · Counted · Any · To · The · Nothing*; the last is exempted by the detector's own `NOT_PARTICIPLES` list at `:71`.

**A11 / sibling distance.** All twelve first-two-word pairs are distinct: *The ground · Whatever comes · Rough country · From any · Part of · The site · In its · Counted into · Any attempt · To come · The country · Nothing comes.*

---

## 4. THE THREAD, AND THE SIBLINGS THIS SPINE SITS BESIDE

This pool is a **spine**, so the composer places it first and a modifier reads after it. Every face therefore ends leaving at least two nouns a follower can carry forward — *the town*, *the ground*, *the site*, *the country*, *the approach* — and none of them ends on a construction that closes the passage off. No face is a turn outward, because a spine cannot be the passage's last sentence.

**Arms A1 and A11 — neither restate nor contradict.** DS-DEF-1's other two lenses can fire on the same header:

- **the readiness spine** (`STRONG` … `CRITICAL`) says what the town amounts to as a defended place. Nothing in this set asserts that the town IS defended, well or badly; the faces assert only that the **ground** is on the defender's side. That is why 1a says *whoever holds the town* rather than *the town*, and why nothing here says "well set", "serious", "thin" or "undefended".
- **the strategic-value spines** (`HIGH` / `LOW`) say whether the town is worth taking. Nothing here touches worth, prize, price or an army's season.
- **the `terrain EXPOSED` sibling** is this lens's other pool. It is the only rejected alternative R-DA-02 would license as a contrast, and **the set uses no contrast at all**: no `rather than`, no `not X but Y`, no fronted antithesis. That keeps R-DA-02's shape probe at zero for this pool and leaves the contrast budget unspent for the pools that need it.

**One tension, stated rather than smoothed.** Where readiness is `CRITICAL` the readiness spine says the town is effectively undefended, and 2a says part of the defence stands to the account of the site. Both are licensed, from different fields, and they are true together — the reading is that the ground is carrying what little there is. It is a tension a reader should feel, not a contradiction the walker should red, and §21.4 forbids trading the licensed line for a plainer one to soften it. **Named for the refuter and the sitting.**

---

## 5. WHAT WAS REFUSED — no variant, four claims, and five wordings

**No variant is refused.** All three were made lawful and all three are written. What follows is the price.

### 5.1 The four claims removed from the shipped wordings (the packet's central judgment)

The three shipped variants each carry claims the card does not license. The rule that settles this is not mine: **R-DA-15's Obeys (6) — "an unlicensed … claim is not a claim the pool was entitled to hold (ruling 5 requires its removal — the B-CLAIM bar is not engaged)"**, with §22's own edge confirmed by the chair: *today's exact wording leaves the product when it fails the voice (its slot survives; its text stays in the annex history)*, and *cutting words is editing; cutting sentences is trimming*. Every slot, tag, number and order survives; four claims do not.

| # | the shipped claim | why the card refuses it |
|---|---|---|
| C1 | v1 *"The ground does more for {settlement} than the town does"* and v2 *"what the town has built is worth more here than the same works would be on flat ground"* | both weigh the site against **the town's own built works** — a second field this pool does not read (`may NOT: … a second fact`), and both **presuppose that works exist**, which contradicts the `walls with NO force`, `force with NO walls` and `neither walls nor force` rows of DS-DEF-2 and the `CRITICAL` readiness spine. A composed page can print the pair. |
| C2 | v1 *"The approach is narrow, and anything coming at it has to come the long way and in the open"* | true of a mountain town, **false of a forest town**, which draws the same pool (§2). An unlicensed particular of exactly fault 24's shape, and the source file's own docblock quotes this sentence as the reading it based the map on. |
| C3 | v3 *"the approach is the part that does not improve with numbers"* | a claim about force ratios in a siege. Nothing in `text(terrain)` holds it; it is a second fact, and a count-shaped one. |
| C4 | v3 *"The ground here does the arguing"* | R-DA-11's third class outright — an inanimate acting with intent. A wall, not a band. |

Nothing was ADDED in their place: the twelve faces carry the one claim the card licenses and stop there.

### 5.2 Five wordings refused before they were written

1. **Any face naming a landform** (a narrows, a defile, a height, a ridge, a slope, cover, a treeline). §2: three terrains draw this pool and no landform word is true of all three.
2. **The disjunction "uphill or through cover"**, which *is* true of the class. Refused as two claims wearing one coat: the reader cannot resolve which holds, and the card licenses the classification, not its members.
3. **Any face naming a keeper or a record holder** ("the surveyor's word", "by the town's own reckoning of the ground"). The card is explicit: `source: (none) · standing SOURCE-UNRESOLVED` — **NO citation is licensed**, and a face naming a holder here is refused by arm A13. REGISTER-CARD amendment S3 is unreachable from this pool until the holder census resolves it, and §24's ceiling (a citation is rare, on one of three reasons) is not even reached.
4. **Any face carrying a perceiver** — *a stranger sees*, *a traveller finds*, *the town knows*, *the town believes*. The card's `may NOT` names **a standpoint**; the register card refuses a persona and an assigned reaction. The `[visitor]` angle survives as the outside vantage (the way in, what must be crossed, the country met first) with nobody standing in it. **This is the one place a refuter may say the angle was thinned**; the answer is that the tag is a shaping property, not a licence to assert a perceiver.
5. **Any face taking the future or the season** — *would hold*, *will cost*, *in winter the passes*. `may NOT: a season, a future`; A2 and R-DA-07.

### 5.3 Mechanical check — run, against the shipped detectors, not by eye

The detector definitions were read verbatim from the dock (`src/domain/prose/proseFingerprint.js:113-149`) and the twelve faces were scored against them in a scratch script. **Zero hits** on: a digit · a percent · an em dash · an exclamation · a question mark · a semicolon · a colon · `which` (`whichTailRate` 0) · `will` / `shall` · `you` / `your` · `because` · `thereIsOpenerRate` 0 · `antithesisRate` 0 (the detector's `\bless … than\b` arm does not reach *harder than*) · `triadRate` 0 · `dialogueShare` 0 · a slot-initial face · **`closers.pronounRate` 0** (the detector's list is `it them him her us me you this that there here`; *anybody* is not a member) · **`participialOpenerRate` 0** (`Nothing` lowercases into `NOT_PARTICIPLES` at `:71`, so the seven-word face is safe — the one place a crude `/ing$/` check gives a false positive) · **`sameOpenerAsPreviousRate` 0** over the twelve in row order · a citation. Every face is one sentence and carries `{settlement}` exactly once (`may NOT: … a second fact`; FORM `sentence`; T-F8).

**One detector does fire, and it is declared.** `closers.abstractNounRate` matches the `ence` suffix, so face 1c's close on *defence* counts: **1 of 12**. The guard R-DA-04 sets is a register-grain ceiling of 0.060 on a 2,914-sentence base, which twelve faces cannot move; the figure is reported here so the walker's number is not a surprise, and 1c keeps its close because the alternatives all reintroduced either a built work or a pronoun.

No dock byte was written and no test suite was run.

---

## 6. FINDINGS CARRIED UP (not refusals)

- **F1 — the card's `predicate` line under-reports its own map.** It printed `=== Mountain` for a three-value class. A writer who trusted the card would have written a mountain set and shipped a lie on every hill and forest town. **The card's printer should emit the full key set for a pool whose map is many-to-one** (`TERRAIN_DEFENCE_OF` is frozen and total against `TERRAIN_DATA` in both directions, so the set is there to print). Chair row.
- **F2 — `move: (none declared)` on a spine that plainly takes PRESENT.** The card prints no move for this pool. Every face here is a PRESENT move by MOVE-GRAMMAR §1.2 row 1, which is the only move a standing configuration field licenses; the packet asserts that reading rather than leaving the column blank. If the projector expects a `MOVE:` line on spine pools, this pool has none today and one is owed.
- **F3 — the echo line's own warning applies here.** The card says the echo table is keyed on a coarser producer-token root than this pool's read, so "spine mounts 1" may be counting a sibling field of the same root. Not acted on; named because a second mount would change what a modifier may safely repeat after this spine.
