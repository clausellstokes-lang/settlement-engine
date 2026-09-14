Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-1`, pool key `readiness ADEQUATE`, REWRITE draft round 2.
Four existing variants rewritten in place, one for one: same vids, same order, same bracketed tags, none added, none removed, none merged (§22).
Each variant is one `[plain]` wording plus three `[face]` sub-rows — four wordings per semantic variant, each a different vocabulary and rhythm inside the voice, none a paraphrase of its sibling; an unweighted seeded roll picks one at render, so every wording stands alone.

ROUND 2 ANSWERS THE GATE, MEASURE BY MEASURE (the three items below are the whole of the change; nothing else in the set was made plainer, §21.4):
- **`punctuation.colonRate` (over) — CURED at zero.** The one colon in the set was round 1's variant 2 `[plain]` (*an ordinary defended town: enough in place…*). That wording is rebuilt as two flat sentences joined by nothing. **Colons across all sixteen wordings: 0.**
- **`shapes.whichTailRate` (over) — CURED at zero.** The one `which` in the set was round 1's variant 4 `[plain]` (*choosing which pressure to leave uncovered*, an interrogative determiner the arm reads as a tail). That wording is rebuilt without the token. **`which` across all sixteen wordings, relative or interrogative: 0.**
- **The projector's INDEPENDENT second ground — CURED at zero.** `DS-DEF-1 :: readiness ADEQUATE #4`'s first face opened on the `proper`-typed slot `{settlement}` (T-F8; wall 10 widened across the join). **No wording in this pool — no `[plain]` line and no `[face]` — now opens on `{settlement}` or on any slot.** Zero is lawful under both readings of the wall (T-F8's flat refusal of a sentence face on a proper slot, and wall 10's at-most-one-per-pool ceiling), so the pool no longer depends on which reading the projector applies.

---

## THE ROWS (paste under the pool's existing bold line, replacing rows 1–4)

**readiness `ADEQUATE`**
1. `[ledger]` `[plain]` What {settlement} holds against likely trouble covers it, and covers it to the line. The cover answers where it is set and would not stretch to a trouble arriving while another is being met.
   - `[face]` At {settlement} the reckoning comes out even and leaves nothing over. Each likely trouble has its answer in that reckoning, and each answer is already spoken for, so a trouble arriving beside another would find none.
   - `[face]` Against the trouble it expects, {settlement} keeps enough and keeps no more. What is kept stands where it is set, and a call arriving elsewhere at the same time would find nothing behind it.
   - `[face]` The margin at {settlement} is the part that is missing. What stands against each likely trouble is enough for it, and the margin that would meet one call while another is still open is not there.
2. `[visitor]` `[plain]` A stranger reaching {settlement} finds an ordinary defended town. What that town has in place is enough to be taken in earnest and short of anything that would set a traveller at ease.
   - `[face]` To anyone arriving, {settlement} is a defended town of the ordinary kind. The town is enough to be reckoned with and stops well short of anything a traveller could rest on.
   - `[face]` What a stranger notices at {settlement} is a defended state with nothing remarkable in it. That state is real enough to be counted and short of anything a stranger would call safety.
   - `[face]` Defended is what a stranger takes {settlement} for, and defended is the whole of it. What makes that reading true is in place, and what would make it comfortable is not.
3. `[street]` `[plain]` The town's own account is that it can hold against the usual trouble, and the account stops there. Nothing in the town's holding runs against that account.
   - `[face]` Asked, the town says it can hold against ordinary trouble and says nothing past that. What the town says and what the town has come out the same.
   - `[face]` What the town claims for itself is the ordinary run of trouble and nothing beyond it. The claim is not larger than the holding it rests on.
   - `[face]` Ordinary trouble the town expects to meet, and it puts the case no further; the case as put is the case as it stands.
4. `[threshold]` `[plain]` The arrangements at {settlement} are sufficient, and sufficient exactly. A further demand on those arrangements would be met by taking cover off a trouble already covered.
   - `[face]` Sufficiency at {settlement} is reached and not passed. The holding covers what presses the town now, and a pressure beyond that would be covered by uncovering something else.
   - `[face]` Nothing at {settlement} stands spare. Everything the town has set against a pressure is set against a pressure that exists, so a new pressure would leave an old one uncovered.
   - `[face]` What stands at {settlement} answers the pressures the town carries and answers no more than those. A pressure beyond them would be answered out of what is already answering something.

---

## --- NOTES

### N.0 THE BLOCKING REFUSAL, CARRIED UNCHANGED FROM ROUND 1 — the licence card licenses nothing, so every wording above is written against the ANNEX, not against the card

`node scripts/prose-licence-card.mjs DS-DEF-1 'readiness ADEQUATE'` prints, verbatim, at this round as at the last:

- `reads:` "(the census recovered no reading for this pool)"
- `predicate:` "(none recovered: no pool-key function returns this key as a literal, no template of one binds it, and no module-level key table names it)"
- `may claim:` "nothing: the census recovered no reading, so no claim is licensed"
- `source:` "(none) · standing SOURCE-UNRESOLVED"

Under the rewrite law as briefed — *every claim in every face is licensed by the LICENCE CARD and by nothing else* — a card whose `may claim` line reads "nothing" refuses **all sixteen wordings, and equally refuses the four sentences standing in the product today.** The set is banked as a REFUSAL SET (§21.2) with its faces, never trimmed. This is a chair row, not a writer's call, and round 2 could not move it: no wording change can supply a census reading.

The refusal is a CENSUS-RECOVERY gap, not a proof that no state exists. The block's own annex ships the receipt the card could not recover:

- **RECEIPT:** `src/components/new/tabs/DefenseTab.jsx:120-136` · bands `src/domain/display/defenseScoreBands.js:30-39`
- **STATE-KEY:** `defenseProfile.readiness.label` (band word) read against `scoreBand` (`ADEQUATE` ≥40, above `WEAK`, below `STRONG`)

Every claim below cites that STATE-KEY as its licensing field, marked **[annex]**, because no card clause exists to cite. Each **[annex]** citation is a NOT-EXECUTABLE licence under the §908 law and must be re-run against a re-recovered card before any of these rows ship. Two dispositions are the chair's: (i) re-run the census recovery for this (block, pool) and re-issue the card, at which point the licence lines below become card clauses; (ii) rule the pool WIRING-UNRESOLVED and hold the whole set. **This packet is written for (i) and is unlawful under the card as printed.**

The card's other lines ARE executable, and every one was obeyed at this round:

| card line | what it says | how the sixteen wordings obey it |
|---|---|---|
| `bag` | `{band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED `{settlement}` | every wording uses `{settlement}` and no other slot; the slot SET of each face equals its parent `[plain]` line's (variants 1, 2 and 4 carry `{settlement}` in all four wordings; variant 3 is slotless in all four, as the product row is), so no face is refused by ARCH §2.5's face row |
| `settlement: proper` + T-F8 / wall 10 | a sentence face may not open on a `proper`-typed slot; the settlement token opens at most one variant per pool and never two adjacent | **zero of sixteen wordings open on `{settlement}`** (round 1 opened two). The sixteen opening tokens are: *What · At · Against · The · A · To · What · Defended · The · Asked · What · Ordinary · The · Sufficiency · Nothing · What* |
| `source` | `(none) · standing SOURCE-UNRESOLVED`; `NO citation is licensed` | **no wording names a record holder** — no roll, no books, no watch, no keeper, no elders, no road — so arm A13 has nothing to refuse and the provenance move (MOVE-GRAMMAR §4.4.3; §24's one-citation ceiling) is spent nowhere in this pool |
| `relation` / `attach` / `seat` | a spine takes none | no wording opens on a connective, a comma or a lower-case clause-list word; each is a sentence-form row beginning on a capital that is not a slot, which is where the composer seats a spine (§2.5's seam contract) |
| `may NOT: a count` | — | no digit and no counting word stands as a count; round 1's ordinals were already gone and none returned |
| `may NOT: a cause` / `a season` | — | no wording carries a causal or seasonal clause; the block's own fence bars a causal clause about how the town came to be as it is |
| `may NOT: a future` | — | every edge is subjunctive (*would*); no bare future indicative anywhere (A2; wall 2) |
| `REFUSED COLUMNS` | a totality over persons; an exemption; a named character; a theological claim | none asserted. The quantifiers that do appear (*each likely trouble*, *the pressures the town carries*, *nothing … spare*) range over pressures and arrangements, never over persons, so the Brackwater kicker's two clauses are not engaged |
| `audience: player (no mark)` | — | no `dm-only` mark, no `[truth]` move, no pen line; nothing here is covert |

### N.1 Per-face licence, claim by claim

**[annex]** = `defenseProfile.readiness.label = ADEQUATE`, read against `defenseScoreBands.js:30-39` — the field the card failed to recover. No claim in any face rests on anything else; nothing in this pool touches the five arms, the walls predicate, terrain, strategic value or `guardEffectivenessDesc`. The band word's three readable edges are cited below as `[annex-value]` (the band word is `ADEQUATE`), `[annex-floor]` (`ADEQUATE` sits above `WEAK`), `[annex-ceiling]` (`ADEQUATE` sits below `STRONG`) — three readings of one field, never three fields.

**Variant 1 `[ledger]` — four wordings, claim-equal (arm A6).** Claim set: (a) the town is covered against the trouble it is likely to meet; (b) the cover carries no margin; (c) the arrangements function as they stand; (d) a concurrent second call would go uncovered, subjunctive.

| claim | licence | `[plain]` | `[face]` a | `[face]` b | `[face]` c |
|---|---|---|---|---|---|
| (a) covered against the likely case | **[annex-value]** | *holds against likely trouble covers it* | *each likely trouble has its answer* | *keeps enough* | *what stands against each likely trouble is enough for it* |
| (b) no margin | **[annex-ceiling]** | *covers it to the line* | *comes out even and leaves nothing over* | *keeps no more* | *the margin … is the part that is missing* |
| (c) the arrangements function | **[annex-floor]** | *the cover answers where it is set* | *each answer is already spoken for* | *what is kept stands where it is set* | *is enough for it* |
| (d) the concurrent call, subjunctive | **[annex-ceiling]**, mood only (A2) | *would not stretch* | *would find none* | *would find nothing behind it* | *would meet one call while another is still open* |

**Claims deliberately NOT made:** no count (the product's *tested twice at once* is a count and is dropped for the card's `may NOT: a count`; the simultaneity claim is kept and the number is not), no cause, no season, no standpoint, no arm, no holder, no object.

**Variant 2 `[visitor]` — four wordings, claim-equal.** Claim set: (a) what a stranger reads at the town is an ordinary defended place; (b) what is in place is enough to be taken in earnest; (c) it is short of what would reassure.

| claim | licence | `[plain]` | `[face]` a | `[face]` b | `[face]` c |
|---|---|---|---|---|---|
| (a) an ordinary defended town | **[annex-value]** (the middle band) | *an ordinary defended town* | *a defended town of the ordinary kind* | *a defended state with nothing remarkable in it* | *defended is the whole of it* |
| (b) enough to be taken in earnest | **[annex-floor]** | *enough to be taken in earnest* | *enough to be reckoned with* | *real enough to be counted* | *what makes that reading true is in place* |
| (c) short of reassuring | **[annex-ceiling]** | *short of anything that would set a traveller at ease* | *stops well short of anything a traveller could rest on* | *short of anything a stranger would call safety* | *what would make it comfortable is not* |

Claim (c) is the CONTRAST move and it is licensed: the rejected alternative is a **sibling band of this same state key**, which is the condition R-DA-02 sets for keeping a contrast; it is the closing move of **one** variant in this pool and no other, as R-DA-02 requires.

- **Claim DROPPED as unlicensed, declared again:** the product's *enough on the walls* asserts an OBJECT (a wall) that this block holds no field for; the annex's own PROVENANCE + FENCE says the readiness word "asserts nothing about any one of them", and the walls read belongs to `defenseProfileHasWalls` in `DS-DEF-2`. Under §22 this is not trimming — the variant's slot survives, its claim set loses a claim no field ever licensed, and the old text stands in the annex history. A claim change is the refuters' column, so it is named, not made quietly.
- **REFUSAL, carried:** the card's `may NOT` list refuses **a standpoint**, and the `[visitor]` angle IS a standpoint; the register card additionally refuses **an assigned reaction**, and claim (c) assigns one. Both are pre-existing, both are carried by the bracketed tag, which is not mine to touch, and both survive every wording. Every wording routes the reaction through what a stranger *would* call rather than asserting a reader's state, which is as far as the voice reaches without dropping a claim. Unsatisfiable as briefed; banked, not cured.

**Variant 3 `[street]` — four wordings, claim-equal.** Claim set: (a) the town's own account is that it holds against ordinary trouble; (b) it claims no more than that; (c) the account and the holding agree.

| claim | licence | `[plain]` | `[face]` a | `[face]` b | `[face]` c |
|---|---|---|---|---|---|
| (a) the town's stated account | **[annex-value]**, as an ACT never an interior | *the town's own account is that it can hold* | *the town says it can hold* | *what the town claims for itself* | *ordinary trouble the town expects to meet* |
| (b) no larger claim | **[annex-ceiling]** | *the account stops there* | *says nothing past that* | *nothing beyond it* | *puts the case no further* |
| (c) account and holding agree | **[annex-value]** restated, never a verdict | *nothing in the town's holding runs against that account* | *what the town says and what the town has come out the same* | *the claim is not larger than the holding it rests on* | *the case as put is the case as it stands* |

- **Wall CURED (carried from round 1):** the product's closing *, which is a fair reading of what it has* is a `, which` tail — a hard wall (R-DA-03; wall 6) and a VERDICT word besides. Every wording states the agreement as a flat second fact in its own clause.
- **Move CURED (carried from round 1):** the product's *the town believes* is a FEELING move, refused estate-wide (MOVE-GRAMMAR §1.3: no field carries motive, belief or mood). Every wording restates it as what the town **says, claims, accounts or puts** — a deed, not an interior.
- **Slot:** the parent carries no `{settlement}`; none of the four wordings does.

**Variant 4 `[threshold]` — four wordings, claim-equal.** Claim set: (a) the arrangements are sufficient; (b) nothing is spare; (c) a further demand would be met by uncovering something already covered, subjunctive.

| claim | licence | `[plain]` | `[face]` a | `[face]` b | `[face]` c |
|---|---|---|---|---|---|
| (a) sufficient | **[annex-value]** | *are sufficient* | *sufficiency … is reached* | *everything the town has set against a pressure is set against a pressure that exists* | *answers the pressures the town carries* |
| (b) nothing spare | **[annex-ceiling]** | *and sufficient exactly* | *and not passed* | *nothing at {settlement} stands spare* | *answers no more than those* |
| (c) the further demand, subjunctive | **[annex-ceiling]**, mood only (wall 2) | *would be met by taking cover off a trouble already covered* | *would be covered by uncovering something else* | *would leave an old one uncovered* | *would be answered out of what is already answering something* |

The THRESHOLD angle's edge is conditional throughout (wall 2); no wording asserts that a further pressure arrives, only what the arrangements hold if one does. The product's *One more demand* (a count) and *which pressure* (the `which` the gate measured) are both gone; the claim they carried is kept whole.

### N.2 THE THREAD (owner, 2026-09-08 ~21:4x) — the noun each wording hands forward

Every wording's second sentence picks up a noun from its first, so each stands as one passage rather than two remarks. A deliberate noun echo for the thread is lawful under §1.4.1 (A11's echo bound counts facts, not nouns), and four of the sixteen use one.

| variant | wording | the noun handed forward |
|---|---|---|
| 1 | `[plain]` | *covers it* → **the cover** |
| 1 | `[face]` a | *the reckoning* → **that reckoning**, then *answer* → **each answer** |
| 1 | `[face]` b | *keeps* → **what is kept** |
| 1 | `[face]` c | *the margin* → **the margin** (echo), against *what stands* |
| 2 | `[plain]` | *an ordinary defended town* → **that town** |
| 2 | `[face]` a | *a defended town* → **the town** |
| 2 | `[face]` b | *a defended state* → **that state** |
| 2 | `[face]` c | *what a stranger takes it for* → **that reading** |
| 3 | `[plain]` | *the account* → **that account** (echo) |
| 3 | `[face]` a | *says* → **what the town says** |
| 3 | `[face]` b | *claims* → **the claim** |
| 3 | `[face]` c | *puts the case* → **the case as put** (echo), carried across the joint |
| 4 | `[plain]` | *the arrangements* → **those arrangements** |
| 4 | `[face]` a | *sufficiency … reached* → **the holding** that reaches it |
| 4 | `[face]` b | *a pressure* → **a new pressure** → **an old one** |
| 4 | `[face]` c | *the pressures* → **a pressure beyond them** |

No wording changes subject in the middle and hands nothing back; none needs the one-turn-outward licence, so none spends it.

**Seating.** This pool is the **spine**, read first, so every wording is written to open a passage and none is written to follow one: no connective opener, no comma opener, no lower-case clause-list word, no bare pronoun, no slot. Each closes on a standing fact a modifier can pick up — the cover, the margin, the town, the reading, the account, the case, the arrangements, the pressure — so whichever sibling modifier the composer seats next by salience has a noun of the spine's to carry forward.

### N.3 Walls and bands checked across all sixteen wordings (round 2 figures)

**Zero:** em dash · exclamation mark · question mark · **colon** · **`which`, relative or interrogative** · digit or numeral in prose · counting word standing as a count · first or second person · expletive opener (*there is* / *it is*) · future indicative (*will*, *shall*) · citation of a record holder · figure, simile or inanimate intent · sense verb on an abstraction · named character · totality over persons · exemption from a duty · theological claim · **wording opening on `{settlement}` or any slot** · third sentence (every wording is one or two sentences, A1).

**Rationed and reported:** semicolon 1 of 16 (variant 3 `[face]` c, the joint chosen for the claim — R-DA-06's rationed device, down from 2 of 16 at round 1) · comma-joined second clause 11 of 16 · `{settlement}` present in 12 of 16 wordings (all of variants 1, 2 and 4; none of variant 3, matching the product row) and opening none of them.

**Spread (R-DA-05, per variant):** no two wordings of a variant share their first two words; the four opening tokens differ within every variant; sentence counts and lengths vary by load, not by rota.

### N.4 THE LIST OF REFUSALS

1. **THE POOL, WHOLE — REFUSED against the licence card as printed** (unchanged from round 1; a writer cannot move it). The card's `may claim` line reads "nothing"; no wording, mine or the product's, is licensable by a card that licenses nothing. Every claim cites the block's annex STATE-KEY instead, a NOT-EXECUTABLE licence under the §908 law. Cure: re-run the census recovery for (`DS-DEF-1`, `readiness ADEQUATE`) and re-issue the card, or rule the pool WIRING-UNRESOLVED. Banked with its sixteen wordings; nothing trimmed.
2. **ROWS UNAPPLIED — the `[plain]` second-tag defect** (the gate's first refusal, unchanged, and not a writer's to cure). The brief requires each numbered row to carry *its bracketed tag exactly as it stands* **and** a `[plain]` line, which puts two tags on one row; ARCH §2.5's grammar shows a numbered row carrying one, and the projector classifies the angle marks (`ledger`, `visitor`, `street`, `threshold`) but not the token `plain`. Curing it means either dropping the angle mark (forbidden: the typed lines of the pool are not mine to touch) or dropping the `[plain]` line (forbidden: the brief's row shape). The defect is shared with the other six pools of this block and is a projector or brief-grammar row for the chair.
3. **Variant 2 `[visitor]` — REFUSED against the card's `may NOT: a standpoint`, and against the register card's "no assigned reaction".** The standpoint is the variant's own bracketed tag, which the rewrite may not touch; the reaction is one of its three claims, which claim-equality may not drop. Unsatisfiable as briefed; a sitting row under §21.
4. **Every variant — REPORTED against the card's `may NOT: a second fact`.** All four product variants carry two facts, and claim-equality forbids reducing them; S2's clause seat licenses only a computed consequence riding on its own fact, which is not what these carry. Read here as a card clause inherited from a modifier-shaped template and inapplicable to a spine; the chair's to settle. If the clause is meant as written, the pool's whole shape is refused and no wording can cure it.
5. **Variant 2 — one claim DROPPED, declared:** *enough on the walls* (an OBJECT no field of this block holds; fenced to `DS-DEF-2`'s `defenseProfileHasWalls`). A claim change, so a refuter's column, named rather than made quietly.
6. **No refusal on variants 1, 3 and 4 beyond items 1, 2 and 4.** Both gate measures and the projector's independent ground cure in place at this round and are reported at zero in N.3.

### N.5 The measurements, printed (`{settlement}` counted as one word)

| variant | tag | wording | words |
|---|---|---|---|
| 1 | `[ledger]` | `[plain]` | 34 |
| 1 | `[ledger]` | `[face]` a | 36 |
| 1 | `[ledger]` | `[face]` b | 34 |
| 1 | `[ledger]` | `[face]` c | 36 |
| 2 | `[visitor]` | `[plain]` | 33 |
| 2 | `[visitor]` | `[face]` a | 31 |
| 2 | `[visitor]` | `[face]` b | 32 |
| 2 | `[visitor]` | `[face]` c | 31 |
| 3 | `[street]` | `[plain]` | 27 |
| 3 | `[street]` | `[face]` a | 28 |
| 3 | `[street]` | `[face]` b | 27 |
| 3 | `[street]` | `[face]` c | 24 |
| 4 | `[threshold]` | `[plain]` | 26 |
| 4 | `[threshold]` | `[face]` a | 28 |
| 4 | `[threshold]` | `[face]` b | 30 |
| 4 | `[threshold]` | `[face]` c | 30 |

Sixteen wordings, 24 to 36 words. The short line exists and the long one earns its length; the spread is the load's, not a metronome's.
