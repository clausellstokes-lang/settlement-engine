Seat: Opus 5 — Fable-unvalidated. Block `DS-DEF-1`, pool key `readiness ADEQUATE`, REWRITE draft round 1.
Four existing variants rewritten in place, one for one: same vids, same order, same bracketed tags, none added, none removed, none merged (§22).
Each variant is one `[plain]` wording plus three `[face]` sub-rows — four wordings per semantic variant, each a different vocabulary and rhythm inside the voice, none a paraphrase of its sibling; an unweighted seeded roll picks one at render, so every wording stands alone.

---

## THE ROWS (paste under the pool's existing bold line, replacing rows 1–4)

**readiness `ADEQUATE`**
1. `[ledger]` `[plain]` {settlement} is covered against what it is likely to meet, and covered to the line. The cover holds where it is set and would not stretch to a pressure arriving while another is being met.
   - `[face]` The reckoning at {settlement} comes out even and leaves nothing over. What stands against the likely pressures answers them, and answers them singly; a pressure arriving alongside another would go unanswered.
   - `[face]` What {settlement} keeps against trouble is enough for the trouble it expects and no more. It holds where it is set, and a call arriving elsewhere at the same time finds nothing behind it.
   - `[face]` The margin at {settlement} is the part that is missing. Everything the town is likely to meet has something set against it, and nothing at all is set aside for one pressure arriving on top of another.
2. `[visitor]` `[plain]` A stranger reaching {settlement} finds an ordinary defended town: enough in place to be taken seriously, and not enough to set anybody at ease.
   - `[face]` To anyone arriving, {settlement} is a defended town of the ordinary kind. What is in place is enough to be reckoned with and stops short of anything a traveller could rest on.
   - `[face]` A stranger notices the defenses at {settlement} and finds nothing remarkable in them. They are enough to be counted as defenses and short of anything a stranger would call safety.
   - `[face]` Defended is what a stranger takes {settlement} for, and defended is the whole of it. What is in place is real, and what would make it comfortable is not there.
3. `[street]` `[plain]` The town's own account is that it can hold against the usual trouble, and it makes no larger claim than that. The account matches what the town has.
   - `[face]` Asked, the town says it can hold against ordinary trouble and says nothing past that. What it says and what it has agree.
   - `[face]` What the town claims for itself is the ordinary run of trouble and nothing beyond it, and the claim is not larger than what stands behind it.
   - `[face]` The town does not overstate what it can hold. Ordinary trouble it expects to meet, and it puts the case no higher than that; the case as put is the case as it stands.
4. `[threshold]` `[plain]` The arrangements at {settlement} are sufficient, and sufficient exactly. A further demand on them and the town would be choosing which pressure it left uncovered.
   - `[face]` {settlement} is at the edge of sufficiency and not past it. What the town holds covers what presses it now, and a further pressure would have to be met by uncovering something else.
   - `[face]` Nothing at {settlement} is spare. Everything set against a pressure is set against a pressure that exists, so a new one would be met by taking cover away from an old one.
   - `[face]` What {settlement} has standing answers every pressure the town carries, and answers no more than those. A pressure beyond them would be answered out of what is already answering something else.

---

## --- NOTES

### N.0 THE BLOCKING REFUSAL — the licence card licenses nothing, so every wording above is written against the ANNEX, not against the card

`node scripts/prose-licence-card.mjs DS-DEF-1 'readiness ADEQUATE'` prints, verbatim:

- `reads:` "(the census recovered no reading for this pool)"
- `predicate:` "(none recovered: no pool-key function returns this key as a literal, no template of one binds it, and no module-level key table names it)"
- `may claim:` "nothing: the census recovered no reading, so no claim is licensed"
- `source:` "(none) · standing SOURCE-UNRESOLVED"

Under the rewrite law as briefed — *every claim in every face is licensed by the LICENCE CARD and by nothing else* — a card whose `may claim` line reads "nothing" refuses **all sixteen wordings, and equally refuses the four sentences standing in the product today.** The set is therefore banked as a REFUSAL SET (§21.2), never trimmed, with its faces, and the refusal is a chair row, not a writer's call.

The refusal is a CENSUS-RECOVERY gap, not a proof that no state exists. The block's own annex ships the receipt the card could not recover:

- **RECEIPT:** `src/components/new/tabs/DefenseTab.jsx:120-136` · bands `src/domain/display/defenseScoreBands.js:30-39`
- **STATE-KEY:** `defenseProfile.readiness.label` (band word) read against `scoreBand` (`ADEQUATE` ≥40)

Every claim below cites that STATE-KEY as its licensing field, marked **[annex]**, because no card clause exists to cite. Each **[annex]** citation is a NOT-EXECUTABLE licence under the §908 law and must be re-run against a re-recovered card before any of these rows ship. Two dispositions are available to the chair and neither is mine: (i) re-run the census recovery for this (block, pool) and re-issue the card, at which point the licence lines below become card clauses; (ii) rule the pool WIRING-UNRESOLVED and hold the whole set. **This packet is written for (i) and is unlawful under the card as printed.**

The card's other lines ARE executable and were obeyed:
- **bag** `{band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED `{settlement}`. Every wording uses `{settlement}` and no other slot; the slot SET of each face equals its parent `[plain]` line's (variant 3 carries no slot in the product and carries none in any of its four wordings), so no face is refused by ARCH §2.5's face row.
- **source** `(none) · SOURCE-UNRESOLVED`. **No wording names a record holder** — no roll, no books, no watch, no keeper — so arm A13 has nothing to refuse and the provenance move (MOVE-GRAMMAR §4.4.3, §24's one-citation ceiling) is spent nowhere in this pool.
- **relation / attach / seat** — a spine takes none; no wording opens on a connective, a comma or a lower-case clause-list word, so each reads as the passage's first sentence, which is where the composer seats a spine.
- **REFUSED COLUMNS** — no wording asserts a totality over persons, an exemption from a duty, a named character or a theological claim.

### N.1 Per-face licence, claim by claim

Every claim is stamped with the field that licenses it. **[annex]** = `defenseProfile.readiness.label = ADEQUATE`, read against `defenseScoreBands.js:30-39` (`ADEQUATE` ≥40, i.e. above `WEAK`, below `STRONG`) — the field the card failed to recover. No claim in any face rests on anything else; nothing in this pool touches the five arms, the walls predicate, terrain, strategic value or `guardEffectivenessDesc`.

**Variant 1 `[ledger]` — four wordings, claim-equal (arm A6).** The claim set: (a) the town is covered against the pressure it is likely to meet; (b) the cover carries no margin; (c) the arrangements function as they stand; (d) a concurrent second pressure would go uncovered (subjunctive edge).
- (a) **[annex]** — the band word `ADEQUATE` is the state key's own value: covered against the expected case. Carried by *covered against what it is likely to meet* / *what stands against the likely pressures answers them* / *enough for the trouble it expects* / *everything the town is likely to meet has something set against it*.
- (b) **[annex]** — `ADEQUATE` is the band bounded above by `STRONG`; the absence of margin is the band's own upper bound, not an added fact. Carried by *covered to the line* / *comes out even and leaves nothing over* / *and no more* / *the margin is the part that is missing*.
- (c) **[annex]** — the same value; a band at or above 40 asserts working arrangements. Carried by *the cover holds where it is set* / *answers them* / *it holds where it is set* / *has something set against it*.
- (d) **[annex]**, subjunctive only (A2; the card's `may NOT: a future` obeyed by mood). Every realisation is "would": *would not stretch* / *would go unanswered* / *finds nothing behind it* / *nothing at all is set aside for*.
- **Claims deliberately NOT made:** no count (the product's *tested twice at once* is a count and is dropped for the card's `may NOT: a count`; the simultaneity claim is kept and the number is not), no cause, no season, no standpoint, no arm, no holder.

**Variant 2 `[visitor]` — four wordings, claim-equal.** The claim set: (a) what a stranger reads at the town is an ordinary defended place; (b) what is in place is enough to be taken in earnest; (c) it is short of what would reassure.
- (a) **[annex]** — `ADEQUATE` as the middle band: the ordinary defended case. Carried by *an ordinary defended town* / *a defended town of the ordinary kind* / *finds nothing remarkable in them* / *defended is the whole of it*.
- (b) **[annex]** — the band's floor (above `WEAK`). Carried by *enough in place to be taken seriously* / *enough to be reckoned with* / *enough to be counted as defenses* / *what is in place is real*.
- (c) **[annex]** — the band's ceiling (below `STRONG`). This is the CONTRAST move and it is licensed: the rejected alternative is a **sibling band of this same state key**, which is exactly the condition R-DA-02 sets for keeping a contrast. It is the closing move of **one** variant in this pool and no other, as R-DA-02 requires.
- **Claim DROPPED as unlicensed:** the product's *enough on the walls* asserts an OBJECT (a wall) that this block holds no field for; the annex's own PROVENANCE + FENCE says the readiness word "asserts nothing about any one of them", and the walls read belongs to `defenseProfileHasWalls` in `DS-DEF-2`. Under §22 this is not trimming — the variant's slot survives, its claim set loses a claim no field ever licensed, and the old text stands in the annex history. Flagged for the chair because it is a claim change, which is the refuters' column and not a writer's.
- **REFUSAL — the standpoint.** The card's `may NOT` list refuses **a standpoint**, and the `[visitor]` angle IS a standpoint; the register card additionally refuses **an assigned reaction**, and claim (c) assigns one (*not enough to set anybody at ease*). Both are pre-existing, both are carried by the tag, which is not mine to touch, and both survive every wording above. Every wording routes the reaction through a subjunctive a stranger *would* call rather than asserting a reader's state, which is as far as the voice reaches without dropping the claim. **This variant cannot be made lawful against the card's standpoint clause without trimming a claim; it is banked, not cured.**

**Variant 3 `[street]` — four wordings, claim-equal.** The claim set: (a) the town's own account is that it holds against ordinary trouble; (b) it claims no more than that; (c) the account and the holding agree.
- (a) **[annex]**, as an ACT not an interior — the product's *the town believes* is a FEELING move, which MOVE-GRAMMAR §1.3 refuses estate-wide ("no field carries motive, belief or mood"); every wording above restates it as what the town **says, claims or puts**, which is a stated account and a deed. Carried by *the town's own account is* / *the town says* / *what the town claims for itself* / *it puts the case*.
- (b) **[annex]** — the band's ceiling again, here as the size of the town's own claim: *no larger claim than that* / *says nothing past that* / *nothing beyond it* / *no higher than that*.
- (c) **[annex]** — the band word is the record's own reading of the same holding, so account-matches-holding is the state key restated, not a verdict added. Carried by *the account matches what the town has* / *what it says and what it has agree* / *not larger than what stands behind it* / *the case as put is the case as it stands*.
- **Wall CURED:** the product's closing *, which is a fair reading of what it has* is a `, which` tail — a hard wall (R-DA-03, wall 6) and a VERDICT word. Every wording above states the agreement as a flat second fact in its own clause; no wording contains a relative `which`.
- **Slot:** the parent carries no `{settlement}`; none of the four wordings does, so the face slot-set test passes.

**Variant 4 `[threshold]` — four wordings, claim-equal.** The claim set: (a) the arrangements are sufficient; (b) nothing is spare; (c) a further demand would be met by uncovering something already covered (subjunctive edge).
- (a) **[annex]** — the band word. Carried by *are sufficient* / *at the edge of sufficiency* / *everything set against a pressure* / *answers every pressure the town carries*.
- (b) **[annex]** — the band's upper bound. Carried by *and sufficient exactly* / *and not past it* / *nothing at {settlement} is spare* / *and answers no more than those*.
- (c) **[annex]**, subjunctive throughout, as MOVE-GRAMMAR wall 2 requires of a THRESHOLD: *would be choosing* / *would have to be met by* / *would be met by* / *would be answered out of*. No wording asserts that a further pressure arrives; each states only what the arrangements hold if one does.

### N.2 THE THREAD (owner, 2026-09-08 ~21:4x) — how each wording connects, and how each seats after a sibling modifier

Every two-sentence wording hands a noun forward from its own first sentence: *covered → the cover*; *reckoning → what stands against*; *keeps against trouble → it holds*; *margin → set against → set aside*; *stranger → an ordinary defended town → enough in place*; *the defenses → them → They*; *account → The account*; *the town says → what it says*; *the arrangements → them*; *the edge of sufficiency → what the town holds*; *spare → set against a pressure*; *what {settlement} has standing → them*. No wording changes subject in the middle and hands nothing back.

This pool is the **spine**, so it is read first and every wording is written to open a passage: none begins on a connective, a comma, a lower-case clause word or a bare pronoun, and each states its civic fact before any modifier can attach. Each wording ends on a standing fact a modifier can pick up — the cover, the margin, the defenses, the account, the arrangements, the pressure — so an added modifier has a noun of the spine's to carry forward whichever sibling precedes it.

### N.3 Walls checked across all sixteen wordings
No em dash. No exclamation mark. No question mark. No digit and no numeral word standing as a count. No `, which` and no relative `which` (the one occurrence, *choosing which pressure it left uncovered*, is an interrogative determiner heading a complement, not a relative clause; flagged so an arm regexing the bare token does not read it as a tail). No second person and no first person. No expletive opener. No figure, simile or inanimate intent. No future indicative; every edge is subjunctive. No citation of a holder. No named character. No totality over persons. No exemption. No theological claim. At most two sentences per wording (A1). The `{settlement}` token opens two of sixteen wordings (variant 1's `[plain]`, variant 4's first `[face]`), in non-adjacent variants — reported against R-DA-17 / wall 10, which is a band, not a wall.

### N.4 THE LIST OF REFUSALS
1. **THE POOL, WHOLE — REFUSED against the licence card as printed.** The card's `may claim` line reads "nothing"; no wording, mine or the product's, can be licensed by a card that licenses nothing. Every claim above cites the block's annex STATE-KEY instead, which is a NOT-EXECUTABLE licence under the §908 law. Cure is not a writer's: re-run the census recovery for (`DS-DEF-1`, `readiness ADEQUATE`) and re-issue the card, or rule the pool WIRING-UNRESOLVED. Banked with its sixteen wordings; nothing trimmed.
2. **Variant 2 `[visitor]` — REFUSED against the card's `may NOT: a standpoint`, and against the register card's "no assigned reaction".** The standpoint is the variant's own bracketed tag, which the rewrite may not touch, and the reaction is one of its three claims, which claim-equality may not drop. Unsatisfiable as briefed; a sitting row under §21.
3. **Every variant — REPORTED against the card's `may NOT: a second fact`.** All four product variants carry two facts, and claim-equality forbids reducing them; S2's clause seat licenses only a computed consequence riding on its own fact, which is not what these carry. If the card's clause is meant as written, the pool's whole shape is refused and the four variants become one-fact sentences, which trims claims and is forbidden by §22. Read here as a card clause inherited from a modifier-shaped template and inapplicable to a spine; the chair's to settle.
4. **Variant 2 — one claim DROPPED, declared:** *enough on the walls* (an OBJECT no field of this block holds; fenced to `DS-DEF-2`'s `defenseProfileHasWalls`). A claim change, so a refuter's column: named here rather than made quietly.
5. **No refusal on variants 1, 3 and 4 beyond items 1 and 3.** Both cure in place: variant 1's count is dropped and its simultaneity kept; variant 3's `, which` tail and its belief move are cured to a flat second fact and a stated account.

### N.5 The measurements, printed (executed on this file, `{settlement}` counted as one word)

| variant | tag | wording | words |
|---|---|---|---|
| 1 | `[ledger]` | `[plain]` | 35 |
| 1 | `[ledger]` | `[face]` a | 31 |
| 1 | `[ledger]` | `[face]` b | 34 |
| 1 | `[ledger]` | `[face]` c | 37 |
| 2 | `[visitor]` | `[plain]` | 24 |
| 2 | `[visitor]` | `[face]` a | 32 |
| 2 | `[visitor]` | `[face]` b | 30 |
| 2 | `[visitor]` | `[face]` c | 30 |
| 3 | `[street]` | `[plain]` | 28 |
| 3 | `[street]` | `[face]` a | 23 |
| 3 | `[street]` | `[face]` b | 27 |
| 3 | `[street]` | `[face]` c | 34 |
| 4 | `[threshold]` | `[plain]` | 25 |
| 4 | `[threshold]` | `[face]` a | 33 |
| 4 | `[threshold]` | `[face]` b | 32 |
| 4 | `[threshold]` | `[face]` c | 31 |

Sixteen wordings, 23 to 37 words, mean 29.1. The short line exists (23) and the long one earns its length (37); the spread is the load's, not a metronome's.

Executed checks over the sixteen rows: em dash 0 · exclamation 0 · question mark 0 · digit in prose 0 (the four digits in the block are the variant numbers) · `, which` 0 · relative `which` 0 · first or second person 0 · expletive opener 0 · `will` / `shall` 0 · semicolon 2 of 16 (a rationed joint, R-DA-06) · `{settlement}` slot-set identical within every variant (variant 3 slotless throughout) · `{settlement}` opens 2 of 16 wordings, in variants 1 and 4, which are not adjacent.
