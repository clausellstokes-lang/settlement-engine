1. `[visitor]` `[plain]` At {settlement} the {defwork} meets no present need, and keeping it costs the town little.
   - `[face]` A {defwork} the present peace does not require is kept at {settlement}, and kept for little.
   - `[face]` Quiet as the present is, {settlement} pays little for its {defwork}, and the work stands.
   - `[face]` The present peace holds no demand on the {defwork}, and the town keeps it all the same. What {settlement} spends on the work is small.
2. `[elder]` `[plain]` The {defwork} at {settlement} stands ahead of any present need, and nothing bought keeps it standing.
   - `[face]` For no present need and at small cost, {settlement} keeps its {defwork}.
   - `[face]` Ahead of what the town now needs, {settlement} holds its {defwork}. A built {defwork} needs no buying to stand.
   - `[face]` Present need falls short of the {defwork} {settlement} keeps, and the work stands on no spending.
3. `[ledger]` `[plain]` The town spends little on its {defwork} and asks little of it, and the work stands whatever is entered.
   - `[face]` Cost and use both run small against the town's {defwork}, and the work would stand without either.
   - `[face]` Little goes out for the {defwork} and little is asked of it, and the standing is not bought.
   - `[face]` Small cost, small use, and the {defwork} stands unbought.

--- NOTES

**Pool.** DS-DEF-11 · `WALLED-QUIET` · role `spine` · draft round 1 · seat Opus 5 (Fable-unvalidated).
Card printed by `node scripts/prose-licence-card.mjs DS-DEF-11 'WALLED-QUIET'` in `$SC/laneRW-DEF11`; the block's own annex section re-read at `laneRW-DEF11/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md:5963-5996` — the RECEIPT, STATE-KEY, SLOTS and PROVENANCE lines, the four sibling spine pools (`WALLED-THREATENED`, `WALLED-STRAINED`, `UNWALLED-SMALL`, `UNWALLED-LARGE`) and the four modifier pools ARCH §6.3 attaches to this block (arms A1 and A11).
3 variants · 12 faces (3 `[plain]` + 9 `[face]`) · variant order, vids and bracketed tags untouched · no variant added, removed or merged.

**The claim set, fixed once per variant, and identical across that variant's four faces (arm A6).**

| variant | C1 | C2 | C3 |
|---|---|---|---|
| 1 `[visitor]` | a {defwork} stands at {settlement} and the town keeps it | the present peace does not require it | keeping it costs the town little |
| 2 `[elder]` | the {defwork} stands and {settlement} keeps it | it stands ahead of any present need | its standing is not bought |
| 3 `[ledger]` | the town spends little on its {defwork} | the town asks little of the {defwork} | the standing does not follow the spending |

**Which card clause licenses each claim.** Every claim below resolves to one of the card's three measured `reads` and to nothing else.

| claim | card clause |
|---|---|
| C1 (every variant) | `reads: forces.walls.present (measured)`; the card's `may claim` line verbatim — "that `present` holds, as a STANDING fact of the record" |
| C2 (every variant) | `reads: settlement.config.monsterThreat (measured)` — the pool's own STATE-KEY is `WALLED-QUIET` (walls, no live threat), so the quiet is the field, not an inference |
| C3 (every variant) | `reads: settlement.defenseProfile.economicGates.military (measured)` — through the gate's own recorded law, quoted on the block's RECEIPT line: paid defenses degrade when unpaid, BUILT WALLS KEEP STANDING, unpaid soldiers desert slowly |
| the two slots and their forms | `bag: {defwork: bare-common, settlement: proper}` |

Per face:

| face | claims carried | licensing clause per claim |
|---|---|---|
| 1 `[plain]` | C1 "the {defwork}" at {settlement} · C2 "meets no present need" · C3 "keeping it costs the town little" | walls.present · monsterThreat · economicGates.military |
| 1 f1 | C1 "is kept at {settlement}" · C2 "the present peace does not require" · C3 "kept for little" | the same three |
| 1 f2 | C1 "the work stands" · C2 "quiet as the present is" · C3 "pays little for its {defwork}" | the same three |
| 1 f3 | C1 "the town keeps it" · C2 "holds no demand on the {defwork}" · C3 "what {settlement} spends on the work is small" | the same three |
| 2 `[plain]` | C1 "the {defwork} at {settlement} stands" · C2 "ahead of any present need" · C3 "nothing bought keeps it standing" | the same three |
| 2 f1 | C1 "{settlement} keeps its {defwork}" · C2 "for no present need" · C3 "at small cost" | the same three |
| 2 f2 | C1 "{settlement} holds its {defwork}" · C2 "ahead of what the town now needs" · C3 "a built {defwork} needs no buying to stand" | the same three; the third is the gate's recorded asymmetry stated of the built work |
| 2 f3 | C1 "the {defwork} {settlement} keeps" · C2 "present need falls short of" · C3 "the work stands on no spending" | the same three |
| 3 `[plain]` | C1 "the town spends little on its {defwork}" · C2 "asks little of it" · C3 "the work stands whatever is entered" | economicGates.military · monsterThreat · economicGates.military |
| 3 f1 | C1 "cost … runs small against the town's {defwork}" · C2 "use … runs small" · C3 "would stand without either" | the same three; the subjunctive is A2's edge, never a fate |
| 3 f2 | C1 "little goes out for the {defwork}" · C2 "little is asked of it" · C3 "the standing is not bought" | the same three |
| 3 f3 | C1 "small cost" · C2 "small use" · C3 "the {defwork} stands unbought" | the same three |

**Words per face** (whitespace tokens; a `{slot}` counts one):

| variant | `[plain]` | f1 | f2 | f3 |
|---|---|---|---|---|
| 1 · the visitor's | **15** | **16** | **15** | **25** |
| 2 · the elder's | **16** | **12** | **19** | **16** |
| 3 · the ledger's | **19** | **17** | **18** | **9** |

mean **16.4** · min **9** · max **25** · sd **3.92** · none over thirty.

---

## 1. THE REFUSALS — three claims of the shipped rows are banked, not carried

A refusal is a result. Each drop below is a claim the shipped sentence carried that **no field of this card holds**; ruling 5 (Part B §9: "a sentence is licensed by a typed field or it is not written") requires its removal, and R-DA-15's obey-row 6 states in terms that the B-CLAIM bar is not engaged by removing a claim the pool was never entitled to hold. Each is named here so the chair can veto the removal rather than discover it. Nothing is trimmed: every variant keeps its number, its slot and its tag, and the shipped wording stays in the annex history (§22).

**R1 — variant 1, "and keeping it is cheaper than ever needing it again."**
The comparison's second term is the cost of needing the work again. No field holds it: the card's `reads` are the wall's presence, the monster family and the military upkeep gate, and `defenseProfile.scores` is not among them. The card refuses **a future** outright, and R-DA-11 requires that a comparison be a measurement in words — this one measures an outlay against a contingency. The licensed residue (keeping costs the town little, from the upkeep gate's recorded asymmetry) is carried by all four faces. **Dropped: the cost of a future need.**

**R2 — variant 2, "walls are easier to keep than to raise".**
Two grounds. The raising term has no backing fact at this tip — the block's own PROVENANCE line says so in terms ("the one historical clause this block might want — WHEN the wall was raised — has NO backing fact at this tip and is deliberately absent; it arrives with the fabric epochs, CT-1b") — so the comparison again measures against nothing. And as written it is a life-general proposition about walls as a class, which is R-DA-12's generalisation test and one of the machine signatures Part B §16(6) names. The licensed residue — that the standing of built work is not bought — is carried by all four faces, and in face 2 it is stated of a built `{defwork}` rather than of walls in general, placed last as THE THREAD's one turn outward. **Dropped: the cost of raising.**

**R3a — variant 3, the causal joint "now that".**
"The town pays little for its {defwork} **now that** it asks little of it" asserts that the low outlay follows from the low demand. The engine holds the opposite edge: the gate's recorded law is that BUILT WALLS KEEP STANDING irrespective of pay, so the outlay is low because the work is built, not because the town asks little of it. R-DST-B licenses a structural clause only where a field holds the structure, and the card refuses **a cause**. The two facts are kept, as two standing facts of the record, and the edge between them is dropped. **Dropped: the causal link from demand to outlay.**

**R3b — variant 3, "built work stands on its own patience."**
A figure: an inanimate thing given a disposition (R-DA-11; MOVE-GRAMMAR §1.3, FIGURE does not exist), closing on a maxim (R-DA-12). It is also **this pool's one measured failing state**: `$SC/taste/measure-A.json` and `measure-B.json` both carry, under `pools[*].walk.findings`, `id "DS-DEF-11 :: WALLED-QUIET"` · `channel WITHHELD` · `klass Q` · `arm "a trailing coordinate naming no second field"` · `clause "built work stands on its own patience."` — the post-semicolon segment carries neither a `{slot}` nor a band reading, so `armQualify` never returns early on it. Its literal content is the gate's recorded law and **is carried in every face**; the figure and the trailing segment go. No face of this pool now carries a semicolon, and the two faces that run to two sentences (1 f3, 2 f2) carry a `{slot}` in the second sentence, so the arm returns early on every segment of all twelve. **Dropped: the figure only, not the claim.**

**A fifth removal that is not a claim.** The shipped variant 1 hedges — "the present peace does not **obviously** require". `monsterThreat` is a measured field and the card marks it so; R-DA-13 puts vague-authority softening at zero and licenses a hedge only from a distance or reliability field, which CLERK-LAWS finds nowhere in the estate. Removing "obviously" states the field exactly and is a sharpening under §21.1, not a claim added.

**No variant is refused outright.** All three are lawful as written above.

---

## 2. TWO FINDINGS FOR THE CHAIR THAT ARE NOT MINE TO CURE

**(a) The card's `may NOT` list is a MODIFIER's list, printed on a SPINE.**
`scripts/lib/prose-licence-card.mjs:52-59` declares `REFUSED_CLAIMS` as "THE CLAIM CLASSES **A MODIFIER** MAY NOT REACH FOR, whatever its field", and the script's own docblock says the card's reader is "a writer of a modifier pool". Read literally against a spine, its **"a second fact"** limb forbids this pool's own STATE-KEY — `WALLED-QUIET` is *(walls, no live threat)*, two fields by construction, three with the upkeep gate — and it would equally forbid the shipped `WALLED-STRAINED` spine, which ARCH §6.3 calls lawful in terms ("the owner's own sentence is already lawful as the shipped STRAINED spine (walls + pay)"). The same passage reads a spine's licence off its branch: "the text claims the family and the wall". **So I have read this spine's licence as its three measured `reads`, and obeyed every other limb of the list on its own terms** — no count, no season, no future indicative, no standpoint word, no second civic object of the class `wall`, no cause the engine does not hold. The limb needs a spine form, or a printed line saying it is a modifier's; a writer told "no second fact" on a three-field spine either disobeys the card or refuses the pool.

**(b) `{defwork}` is NAMED BUT NEVER FILLED.** The card's `bag` line says so: `FILLED at this block's call sites: {settlement} · NAMED BUT NEVER FILLED: {defwork}`. All twelve faces of this pool need it, as all three shipped rows do; the slot set is the parent's and is not mine to move. This is a wiring row, reported here and not touched.

---

## 3. WHAT ELSE THE CARD REFUSED, AND WHERE IT SHOWS

- **Citation: none, in any of the twelve.** The card's `source` line reads `muster + road · standing LICENSED · two-source row`, so a citation *would* be admissible — and it is refused on the budget. §24 sets a ceiling of one citation per unit and only for one of S3's three reasons (two accounts that disagree; a count from an interested party; a record whose keeper is a power); none holds here, the exemplar registers with raw text cite at zero per 786 sentences, and MOVE-GRAMMAR §4.4.3 makes a citation on a fact whose holder is the office itself a finding. Variant 3's ledger angle is carried in the accounting **vocabulary** (spends, cost, use, entered, unbought), never by naming a record or attributing a statement to one — deliberately, since the sibling `UNWALLED-LARGE` spine's "the books say" is already a shipped F25 finding in the same measure files.
- **No count, no season, no digit, no em dash, no exclamation, no question, no `which`, no colon, no semicolon.** Quantity is in words throughout (little, small, nothing, no, neither) per R-DA-16.
- **No second civic object of the class `wall`.** The work is named by `{defwork}` and referred back to only as "the work" or "it"; no circuit, gate, ditch or rampart appears. "A built {defwork}" in 2 f2 re-uses the slot rather than reaching for a class noun.
- **No history, no standpoint, no forecast.** Every face is present-tense; the one modal is 3 f1's "would stand", which is A2's subjunctive edge and not a fate. Nothing says when the work was raised (the block's PROVENANCE forbids it) and nothing grades the town.

## 4. HOW THE TWELVE ARE HELD APART, AND WHAT THEY DO NEXT TO THEIR NEIGHBOURS

- **THE THREAD.** The two two-sentence faces hand a noun forward and put the turn last: 1 f3's second sentence carries "the work" forward from `{defwork}`; 2 f2's second sentence turns outward from this town's work to built work of that kind and sits last, which is the one turn the wall allows. Every face closes on the work, the town, or the standing, so a modifier seated after this spine has a noun to pick up.
- **Sibling distance inside the pool.** First two words: `At {settlement}` · `A {defwork}` · `Quiet as` · `The present` | `The {defwork}` · `For no` · `Ahead of` · `Present need` | `The town` · `Cost and` · `Little goes` · `Small cost` — twelve distinct openers, and the three `[plain]` rows differ from one another in their first two words (A11). Shapes differ inside every variant: a coordinate sentence, a heavy-subject single clause, a fronted concessive, a two-sentence pair (variant 1); a coordinate, a double fronted phrase with no joint, a two-sentence pair, a subject-is-the-need coordinate (variant 2); a compound predicate with one joint, a fronted nominal pair, a passive opener, a short asyndetic line (variant 3). Closes vary in kind: a condition, an object, a quantity, a record verb.
- **Neither restating nor contradicting the siblings (arms A1, C-sibling).** `WALLED-THREATENED` owns the live threat and the checking of the work; `WALLED-STRAINED` owns the wage contrast ("stone keeps itself, and wages do not"); `UNWALLED-*` own the absence of a circuit. No face here names a wage, a muster, a watch, a garrison or the country, so nothing restates a sibling's discriminating fact and nothing collides with the `watch: bought (*)` or `country: pressed (*)` modifiers that seat beside this block. The states are mutually exclusive by key, so no same-entry contradiction is reachable.
- **One joint per face at most (S2).** Where a face carries a coordinate it is a single comma joint on a consequence of the sentence's own fact; the compound predicates in 3 `[plain]` and 3 f2 share their subject and are not second joints.

## 5. THE BANDS, MEASURED AND REPORTED (§16's channel: the distance, not a claim of perfection)

- **Within-pool word sd 3.92** against R-DA-05's direction of ≥ 4.0 — 0.08 short, well inside a band-width, and reported rather than manufactured. Three claims per variant put a floor under every face; the pool buys its spread with a 9-word line and a 25-word one instead.
- **The short-line floor is not reached.** R-DA-05 wants a non-zero share under eight words; the shortest lawful face carrying all three claims is nine. Stated, not faked.
- **One triad, deliberate.** 3 f3 ("Small cost, small use, and the {defwork} stands unbought") is the pool's only three-part line; R-DA-10 refuses the triad as a habit, not as an instance, and it is what buys the pool its short line.
- **Uneven on purpose.** Per the register card's last line and §16(3)'s perfection ceiling, this set does not sit inside every band: the sd above, the one triad, and 1 f3's concessive "all the same" — a contrast licensed by R-DA-02 because the rejected alternative is a **sibling pool key** (`WALLED-THREATENED`), never fronted, and the closing move of no variant.
