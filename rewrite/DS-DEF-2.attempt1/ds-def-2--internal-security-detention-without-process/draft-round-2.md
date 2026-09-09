# DS-DEF-2 · `Internal Security: detention without process` — REWRITE, draft round 2

Seat: Opus 5 (Fable-unvalidated) · block DS-DEF-2 · role spine · three variants in, three variants out, none added, none removed, none merged, none reordered.
The typed lines of the pool (ROLE · READS · RELATION · ATTACH · FORM · MOVE) are not repeated here and are not this packet's to touch.

---

## THE ROWS — paste under the pool's heading, replacing rows 1 to 3

1. `[ledger]` Confinement is within this town's power at {settlement} and process is not, so a person stays held as long as one judgment holds.
   - `[face]` The power to hold stands at {settlement} and the power to try does not, so a holding answers to the word that made it and to nothing else.
   - `[face]` A person is taken at {settlement} and kept. What follows is settled by whoever ordered the taking and by no court.
   - `[face]` A holding at {settlement} runs with nothing laid against the person, so what it comes to is decided by whoever applies the power.

2. `[visitor]` A stranger at {settlement} walks with a care that a town with courts would not ask, and the reason is not one the stranger can give.
   - `[face]` Visitors go carefully at {settlement}, and nobody tells them why. The same visitor in a town with courts would need less care.
   - `[face]` A traveller keeps a caution at {settlement} that a court would make needless, and nobody offers a reason for the caution.
   - `[face]` The stranger's care at {settlement} is never accounted for. A court would account for it, and the town keeps no court.

3. `[street]` A person can be put away at {settlement}, and the town will not say on what ground, nor ask on whose.
   - `[face]` This town confines and names no ground. On whose word a person is confined at {settlement} is a question nobody here puts.
   - `[face]` People are held at {settlement} on grounds the town never states, and whose authority stands behind a holding is never asked.
   - `[face]` The town puts a person away at {settlement} and states no ground. Whose order it was the town never asks.

---

## --- NOTES

### 0. THE GATE'S TWO ROWS, ANSWERED MEASURE BY MEASURE

**(a) REFUSAL — a second bracketed tag on the numbered row. CURED, and the cause named.**
Round 1 wrote `1. \`[ledger]\` \`[plain]\` …`. ARCH §2.5's worked example carries `[plain]` because the pool it shows is a MODIFIER pool whose angle IS `plain`; on a spine pool whose angle tag is already `[ledger]` / `[visitor]` / `[street]`, a second bracketed token on the numbered row is parsed as a second MARK, which is why the contract test red with `unclassified: [ 'plain' ]`. The shipped rows that already carry faces (the two `Beasts & Monsters` pools in this same block) settle the form: the numbered row is the number, the angle tag, then the plain wording, and the faces are `- \`[face]\` …` sub-rows beneath it. Every row above is written in that form. `FACE_ROW_RE` (`scripts/lib/dossier-annex-grammar.mjs:107`) matches all nine face rows; 1 parent + 3 faces = 4 against the per-variant pin.

**(b) band depth · `shapes.whichTailRate` (over) = 26.027 band-widths on 1 of 3 faces. THE FAILING FACE WAS NOT MINE — and it moves this round.**
The depth reproduces exactly: `(1.0000 − 0.0370) / 0.0370 = 26.027027…`. A rate of 1.0000 means EVERY sentence of the measured face carries `, which` (`proseFingerprint.js:142`, `rate(count(/, which\b/))`). No wording in round 1 contained `which` at all. The face the gate measured was the SHIPPED variant 1 — one sentence, `…whether it should, which makes enforcement here a matter of who is doing it.` — measured as a bare spine with one face, because the grammar refusal in (a) meant "the pool keeps its previous rows". So the measure could not move until (a) was cured; curing (a) is what moves it. With the rows above landed, `, which` occurs zero times in twelve wordings and the metric reads 0.0000 on every face, inside the band.

**(c) THE SEVEN OTHER FACE-GRAIN METRICS, held at zero deliberately — a second failure pre-empted.**
`FACE_LEVEL_METRICS` is the eight a single sentence genuinely answers: `punctuation.colonRate`, `emDashRate`, `questionRate`, `exclamationRate`, `parenthesisRate`, `shapes.participialOpenerRate`, `shapes.whichTailRate`, `shapes.dialogueShare`. On a one- or two-sentence face any single occurrence scores 0.5 or 1.0, which is past `ENTRY_NUMBERS.depth` (1.75) on every one of those bands. **Round 1 would have failed a second face-grain measure once it landed:** variant 1's third wording carried a colon, which reads `colonRate` 1.0000 on that face. Round 2 carries no colon, no em dash, no question mark, no exclamation, no parenthesis, no `-ing` opener, no which-tail and no quotation mark in any of the twelve wordings. `perfectionSuspect` will fire at the face grain; that is a finding, never a rewrite trigger (§16.1), and the corpus grain carries the variance.

**(d) What round 2 spent on the ceiling, beyond the two gate rows (§21.1–§21.4).**
Sibling distance widened on `siblingDistance`'s own three tests: within every variant no two of the four wordings share an opener, and the four differ in sentence count (variant 1: 1 / 1 / 2 / 1; variant 2: 1 / 2 / 1 / 2; variant 3: 1 / 2 / 1 / 2). The corpus's rhythm was given a floor and a spread it did not have: a seven-word sentence (`This town confines and names no ground.`), an eight-word sentence, and wordings to twenty-eight, so `wordsPerSentence.shareUnder8` and `neighbourVariation` have something to read at the corpus grain. Close KINDS are varied across the pool rather than repeated (`R-DA-04`'s closed set): an absence (`and to nothing else`), an object (`by no court`, `keeps no court`), a condition (`as long as one judgment holds`), a name not given (`nor ask on whose`), a prohibition-shaped standing fact (`is never asked`). No wording was made plainer with no law behind the change (§21.4).

### 1. The card this packet is written against (printed, `node scripts/prose-licence-card.mjs DS-DEF-2 'Internal Security: detention without process'`)

`reads: court (not-produced) · prison (not-produced)` — `absent ⇒ no candidate; a modifier is silent, never "false"` · `predicate: (none recovered: the pool has no key-function branch)` · `bag: {band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites: `{settlement}`** · `relation: (a spine takes no relation)` · `seat/form: (not a seat-taker) / sentence` · `move: (none declared)` · `angle: ledger street visitor` · `attach: (empty)` · `echo: spine mounts 1 (tabs: defense) · modifier mounts 0` · `covert: no` · `source: (none) · standing SOURCE-UNRESOLVED — NO citation is licensed; a face naming a record holder is refused by arm A13` · `may claim: that court holds, as a STANDING fact of the record` · `may NOT: a count, a cause, a season, a future, a standpoint, a second fact` · `audience: player (no mark)` · `REFUSED COLUMNS, always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.`

**Slot set.** Every one of the twelve wordings carries `{settlement}` exactly once and no other slot, matching each parent (ARCH §2.5's face-row refusal on a differing `{slot}` set; arm A6's byte-equality half). No wording opens on `{settlement}`: the bag types it `proper` and a sentence face opening on a `proper`-typed slot is refused (T-F8, `dossier-annex-grammar.mjs:692-695`); wall 10 and R-DA-17 want the same.

**No citation anywhere.** `source` is SOURCE-UNRESOLVED, so the provenance move (MOVE-GRAMMAR §4.4.3, Part B §24) is unlicensed on this pool. No wording names a holder of a record, and none says "according to".

**No office anywhere.** Not one wording names an office, a count or an exemption, so R-DA-15 and CLERK-LAWS C2 are not engaged. Every agent is written as a role-free indefinite (`whoever ordered the taking`, `the one`, `nobody`, `the town`) — deliberately, because `ROLE_CATEGORY_KEYWORDS`'s `sheriff` / `constable` / `sergeant` are held by no instantiated role list (CLERK-LAWS §1.2 NOTE 2), so naming a gaoler or a magistrate here would be an office the table does not return.

### 2. Per face, the clause that licenses each claim

**Variant 1 `[ledger]`.** The claim set the variant carries, unchanged: **(A)** the town can hold a person; **(B)** it has no settled process for deciding that it should; **(C)** enforcement therefore rests on whoever applies it. All four wordings carry A, B and C and nothing further (arm A6, claim-equal).

| wording | claim | licensed by |
|---|---|---|
| plain — `Confinement is within this town's power` | A | `reads: prison`, as a STANDING fact of the record (`may claim`, the standing form) |
| plain — `and process is not` | B | `reads: court` in its absent state; the branch's own key states the absence, so this is the spine's PRESENT, not a manufactured lack |
| plain — `so a person stays held as long as one judgment holds` | C | the two reads taken together: holding held and process absent IS "one judgment decides". A computed consequence of the sentence's own fact riding as one joint, with the joint's own comma and word — register card AMENDMENT S2, signed at Part B §19; MOVE-GRAMMAR §2.1 V2 (PRESENT → CONSEQUENCE structural). Present habitual, no future indicative (R-DA-07) |
| face 1 — `The power to hold stands … the power to try does not` | A, B | as above |
| face 1 — `so a holding answers to the word that made it and to nothing else` | C | as above; close kind ABSENCE (R-DA-04's closed set), placed last, not opening (wall 3) |
| face 2 — `A person is taken at {settlement} and kept.` | A | as above; the shortest sentence in the pool, deliberate (R-DA-05, rhythm follows load) |
| face 2 — `What follows is settled by whoever ordered the taking and by no court.` | C, B | as above; THE THREAD — `taken` hands `the taking` forward to the second sentence (MOVE-GRAMMAR §1.4.1); close kind OBJECT |
| face 3 — `runs with nothing laid against the person` | A, B | as above; "nothing laid against the person" is the absent process read as the branch states it, not a second field |
| face 3 — `so what it comes to is decided by whoever applies the power` | C | as above; one joint, one clause |

**Variant 2 `[visitor]`.** The claim set the variant carries, unchanged: **(A′)** a stranger here keeps a care a town with courts would not require; **(B)** the town keeps no court; **(C′)** the stranger is given no reason for the care. **The detention read is NOT claimed by this variant and has NOT been added to it.**

| wording | claim | licensed by |
|---|---|---|
| plain — `a care that a town with courts would not ask` | A′, B | `angle: visitor` licenses the standpoint (the card names it, §3 below); the rejected alternative names the SIBLING POOL KEYS `full legal chain (court AND prison)` and `court without detention`, which is the only licence a contrast carries (R-DA-02; MOVE-GRAMMAR wall 5). Not fronted as the subject, not the closing move |
| plain — `the reason is not one the stranger can give` | C′ | `reads: court` absent; the inability is the visitor angle's own reading of that absence, not a second fact about the world. Close kind A NAME NOT GIVEN |
| face 1 — `Visitors go carefully … nobody tells them why` | A′, C′ | as above |
| face 1 — `The same visitor in a town with courts would need less care.` | B | as above; subjunctive at the edge, never a fate (R-DA-07, A2). THE THREAD: `Visitors` → `The same visitor` |
| face 2 — `a caution … that a court would make needless` | A′, B | as above; the contrast embedded on the noun, not fronted |
| face 2 — `and nobody offers a reason for the caution` | C′ | as above |
| face 3 — `The stranger's care … is never accounted for.` | A′, C′ | as above |
| face 3 — `A court would account for it, and the town keeps no court.` | B | as above; THE THREAD: `accounted for` → `account for`; close kind OBJECT |

**Variant 3 `[street]`.** The claim set the variant carries: **(A)** the town can put a person away; **(B)** it will not state the ground; **(C)** it does not ask on whose authority. One claim of the shipped row was REMOVED — see §4 row R2.

| wording | claim | licensed by |
|---|---|---|
| plain — `A person can be put away at {settlement}` | A | `reads: prison`, standing |
| plain — `the town will not say on what ground` | B | `reads: court` absent; with no process there is no stated ground. `angle: street` licenses the town's own plain reading |
| plain — `nor ask on whose` | C | the same branch spelled out: with no process there is no recorded authority to name. Close kind A NAME NOT GIVEN |
| face 1 — `This town confines and names no ground.` | A, B | as above; seven words, the pool's short line |
| face 1 — `On whose word a person is confined … is a question nobody here puts.` | C | as above; the OPEN QUESTION move in its DECLARATIVE form (MOVE-GRAMMAR §1.2 row 10) — a civic matter left standing open and named, never an interrogative; question rate stays 0 (B0.8, R-DA-17). THE THREAD: `confines` → `confined` |
| face 2 — `held … on grounds the town never states` | A, B | as above |
| face 2 — `and whose authority stands behind a holding is never asked` | C | as above |
| face 3 — `The town puts a person away … and states no ground.` | A, B | as above |
| face 3 — `Whose order it was the town never asks.` | C | as above; THE THREAD: `The town` carried forward from the first sentence |

### 3. Refusals, removals and open rows (a refusal is a result)

**R1 — OPEN CARD ROW, carried unchanged from round 1; the chair's to rule, not this seat's.** The card's `may claim` line licenses only *that `court` holds*. The pool key is `detention without process`, whose branch is `prison` held and `court` absent, and variants 1 and 3 both claim the DETENTION. That claim rests on `reads: prison`, which the card lists under `reads` but not under `may claim`. **On a strict reading of `may claim`, every detention clause in variants 1 and 3 is unlicensed and both variants refuse.** This packet is written on the reading that `may claim` is templated on the first read and that a listed read licenses a standing claim of the same form — the reading the shipped rows already embody. If the chair reads it strictly, variants 1 and 3 are the refusal rows and their faces bank as written (§22 (b): a face that never passed the gate stays in the annex with its measurement).

**R2 — A CLAIM REMOVED from variant 3, deliberately, and recorded because it is a claim change and not an edit.** The shipped row reads `and **has learned** not to ask on whose`. "Has learned" asserts an acquisition over time — that the town once asked and now does not. That is a HISTORICAL clause on a standing configuration field, which R-DST-B (A6) refuses and which no event-provenance field in this pool's reads can license; the card's `may NOT: a cause` says the same thing from the other side. All four wordings state the fact as STANDING (`nor ask on whose`, `nobody here puts`, `is never asked`, `never asks`). Ruling 5 / R-DA-15 requires the removal of an unlicensed claim; §22 permits shortening inside the band because cutting words is editing. Arm C-pair will read one claim fewer in the AFTER: that is this row, not a drift.

**R3 — A REFUSAL THIS SEAT CANNOT CURE, standing: the visitor standpoint against the card's `may NOT: a standpoint`.** The card's refusal line and its `angle: ledger street visitor` line disagree on their face. This packet reads the `may NOT` line as §8.3's MODIFIER template (a modifier may not import a standpoint the spine does not hold) and the `angle` line as the spine's own licence, which is the only reading under which the shipped variant 2 was ever lawful. **If the chair reads `may NOT: a standpoint` literally, variant 2 cannot be made lawful in any wording and is a refusal row in full**, because the visitor standpoint is the variant, not its dress. Named here so the ruling is the chair's and not this seat's silence.

**R4 — A BAND EXCEEDANCE, declared, inside the budget.** Variant 2's licensed sibling contrast realises the antithesis SHAPE in all four wordings; R-DA-02's per-variant ceiling is 0.045, so this pool's rate is 1 of 3 variants. The contrast is the KEPT kind — it names two sibling pool keys — so it is the permitted member rather than the cut one, but the figure is above the band and is reported, not hidden. Measured separately: the fingerprint's own `shapes.antithesisRate` regex (`not … but` · `rather than` · `, not [a-z]` · `less … than`) fires on NONE of the twelve wordings, so the corpus-grain instrument reads unmoved; the exceedance is the shape as R-DA-02 counts it, and the two figures are not the same figure. §16.2's ENTRY grain (BUDGET two thirds, DEPTH 1.75) carries it; the POOL grain (BUDGET a third, DEPTH 0.5) is the chair's to measure at the gate.

**R5 — A BAND NOTE, reported and not cured.** Variant 2's core claim is a disposition (`is careful`). The FEELING non-move (MOVE-GRAMMAR §1.3) bars motive, belief and mood; every wording renders the claim as CONDUCT (`walks with a care`, `go carefully`, `keeps a caution`, `the stranger's care`) rather than as an interior state, and `wariness` was written and struck for leaning interior. The claim itself is the variant's and may not be dropped. Flagged for the refuter rather than cured.

**R6 — A WALL CHECKED AT THE EDGE, and the reading this seat took.** Wall 3 bars an ABSENCE opening a wording or sitting beside another. Variant 3 states two negatives in every wording (no ground stated; whose authority not asked). This seat reads neither as the typed ABSENCE move: the ABSENCE move is a `none-exists` world field or a `not-held` record field with provenance, and these two are the branch's own PRESENT state written negatively — what the town's practice is. On the other reading, variant 3's claim set is two adjacent absences by construction and no wording can separate them, which would make variant 3 a refusal row entire. Reported so the walker's verdict decides it and not this seat.

**R7 — CURES CARRIED, each naming the law the shipped row broke.**
- Variant 1's `, which makes enforcement here a matter of who is doing it` is a which-tail: MOVE-GRAMMAR wall 6, R-DA-03 (R1 `, which` → ≤ 0.010 per variant), the brief's absolute, and the gate's own `shapes.whichTailRate`. All four wordings carry the consequence as a joint or as its own sentence. Zero occurrences of `which` in the packet.
- Variant 2's `in a way **he** would not need to be` is a gendered pronoun on a person the engine holds no `gender` field for (R-DA-14; the shipped gendered R6 lines are a guard-roster anchor, CLERK-LAWS §2.4.1). No wording carries a gendered pronoun.
- Round 1's own colon in variant 1's third wording is struck (§0 (c) above).

**No wording refuses on:** slot set · proper-slot opener · citation (none licensed, none written) · a totality over persons · an exemption from a duty · a named character or a fate · theology · a count · a digit · a season · a future indicative · a question mark · an em dash · an exclamation · an office the institution table does not return.

### 4. Siblings — arms A1 and A11 (neither restate nor contradict)

The pool sits third of four in the `Internal Security` rung, beside `full legal chain (court AND prison)`, `court without detention` and `no legal infrastructure`. Their vocabulary is fenced off: no wording here reuses *a process rather than a threat*, *the watch's temper*, *a procedure rather than a favour*, *money and exile*, *reaches for the purse or the road*, *spending down a reputation*, *legal machinery*, *force alone*, or *nowhere to take it*. Nothing in the twelve contradicts a sibling: this branch asserts holding without process, and each sibling asserts a different branch of the same closed key. The wider block is also cleared — no wording reuses the `Invasion & War` or `Beasts & Monsters` rows' *line*, *perimeter*, *muster* or *works*.

### 5. Word counts (the slot counts as one word)

| variant | plain | face 1 | face 2 | face 3 |
|---|---|---|---|---|
| 1 `[ledger]` | 23 | 28 | 21 | 23 |
| 2 `[visitor]` | 26 | 22 | 21 | 21 |
| 3 `[street]` | 21 | 22 | 21 | 20 |

Range 20 to 28 over twelve wordings. Sentence lengths run 7 to 28, so the corpus grain has a short line, a long line and a spread to read (`wordsPerSentence.shareUnder8`, `neighbourVariation`, `runsOfThreeSameLengthBand`).

### 6. Form notes for the projector

- Every numbered row is `<n>. \`[angle]\` <plain wording>` with the angle tag exactly as it stands, and the three faces are `   - \`[face]\` …` sub-rows. No second bracketed tag on any numbered row.
- Every wording is sentence-form (`FORM: sentence`), one or two sentences, opening on a capital that is not a `proper`-typed slot.
- Every second sentence hands a noun forward from the first (THE THREAD): *taken → the taking*; *Visitors → The same visitor*; *accounted for → account for*; *confines → confined*; *the town → the town*. No wording spends the passage's one turn outward, so a modifier the composer seats after this spine keeps that allowance.
- Every wording closes on a standing fact of a civic thing, and the KIND is varied across the pool rather than repeated: *holds* (condition) · *nothing else* (absence) · *no court* (object) · *the power* (object) · *give* / *nor ask on whose* (a name not given) · *care* · *caution* · *court* · *puts* · *asked* · *asks*. No wording closes on a pronoun.
