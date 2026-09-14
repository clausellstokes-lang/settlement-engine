1. `[ledger]` {settlement} is an unwalled town. It keeps no garrison and no militia.
   - `[face]` {settlement} carries no works of defence. No company under arms answers for the town.
   - `[face]` {settlement} keeps nothing under arms. No wall closes the town.
   - `[face]` No wall stands at {settlement}. No soldiers are kept, and no levy is called.
2. `[counterforce]` Neither a wall nor a garrison stands at {settlement}. No militia is raised in the town.
   - `[face]` No garrison is quartered at {settlement}. The town has no walls and raises no militia.
   - `[face]` No works ring {settlement}. Nothing in the town stands under arms.
   - `[face]` Nothing at {settlement} is fortified. Neither a garrison nor a levy is kept.
3. `[street]` The town has no wall and keeps no armed force.
   - `[face]` Nothing here is walled and nothing here is under arms.
   - `[face]` The town holds no fortification and musters no soldiers.
   - `[face]` The town is neither walled nor armed.

--- NOTES

**THE CARD, AS THIS PACKET READS IT** (printed 2026-09-09 from `node scripts/prose-licence-card.mjs DS-DEF-2 'Invasion & War: neither walls nor force'` in laneRW-DEF2).
- `reads` — `invasionRowSituation(walls, garrison, militia)` via `INVASION_ROW_POOL` in `defenseStateProse.js`.
- `predicate` — that reading `=== no walls, no force`.
- `may claim` — that the predicate holds, **as a STANDING fact of the record**. That is the whole licence, and it has two limbs, because the predicate has two: (i) no walls; (ii) no force, where the read's own arguments make "force" the union of `garrison` and `militia`.
- `bag` — `{band: RESERVED, route: proper, settlement: proper}`, FILLED at this block's call sites `{settlement}`.
- `may NOT` — a count, a cause, a season, a future, a standpoint, a second fact.
- REFUSED COLUMNS, always — a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.
- `source: muster · standing LICENSED`, a citation licensed where the provenance budget allows. **No face cites.** §24 caps the budget at one citation per unit and only for one of S3's three reasons; none of the three holds here (no two accounts, no count, and the muster is the town's own record — §4.4.3: "the office does not cite its own books" is a finding). The exemplar registers with raw text cite at 0 per 786 sentences, so zero is the register's own rate.

**THE CLAIM LEDGER — every face makes exactly the same two claims, and no others.** Face-by-face, the claim and the clause that licenses it:

| variant | face | claim (i) NO WALLS — licensed by `predicate` limb 1 under `may claim` (a STANDING fact) | claim (ii) NO FORCE — licensed by `predicate` limb 2 (the `garrison`/`militia` arguments of the read) under `may claim` | slot, licensed by `bag` FILLED `{settlement}` |
|---|---|---|---|---|
| 1 `[ledger]` | line | "is an unwalled town" | "keeps no garrison and no militia" (both arguments named) | `{settlement}` ×1 |
| 1 | face 2 | "carries no works of defence" | "No company under arms answers for the town" | `{settlement}` ×1 |
| 1 | face 3 | "No wall closes the town" | "keeps nothing under arms" | `{settlement}` ×1 |
| 1 | face 4 | "No wall stands at {settlement}" | "No soldiers are kept, and no levy is called" (garrison, then militia) | `{settlement}` ×1 |
| 2 `[counterforce]` | line | "Neither a wall … stands" | "nor a garrison stands"; "No militia is raised in the town" | `{settlement}` ×1 |
| 2 | face 2 | "The town has no walls" | "No garrison is quartered"; "raises no militia" | `{settlement}` ×1 |
| 2 | face 3 | "No works ring {settlement}" | "Nothing in the town stands under arms" | `{settlement}` ×1 |
| 2 | face 4 | "Nothing at {settlement} is fortified" | "Neither a garrison nor a levy is kept" | `{settlement}` ×1 |
| 3 `[street]` | line | "has no wall" | "keeps no armed force" | none (the shipped variant carries no slot; the set is held) |
| 3 | face 2 | "Nothing here is walled" | "nothing here is under arms" | none |
| 3 | face 3 | "holds no fortification" | "musters no soldiers" | none |
| 3 | face 4 | "neither walled" | "nor armed" | none |

No face asserts anything else. No face carries a count, a cause, a season, a future, a standpoint or a second fact; none names a person, a duty, an exemption or a deity.

**WHAT WAS DROPPED, AND WHY (the rewrite's purpose; the shipped breach is the corpus's known state).**
- Variant 1 `[ledger]`, "Organized aggression cannot be resisted here" — a SECOND FACT and an outcome the card does not hold (`may NOT`: a second fact; MOVE-GRAMMAR §1.3 has no MEANING move). Dropped.
- Variant 1, "what preserves the town is distance, diplomacy, or being beneath notice" — a CAUSE (`may NOT`: a cause) carrying three further facts (a distance, a diplomacy, an obscurity) that no field of this card holds (R-DA-20 / walker C2). Dropped.
- Variant 2 `[counterforce]`, "Nothing has come for {settlement}" — a HISTORY move with no event-provenance field (MOVE-GRAMMAR §1.2 row 2; R-DA-19: no HISTORY in a STATE pool). Dropped.
- Variant 2, "nothing about the town would stop it" — a second fact stated as an outcome edge; the card licenses the configuration, not what it would do. Dropped.
- Variant 2, "The safety here is entirely a matter of nobody having wanted to" — a CAUSE, a totality ("entirely"), and an intent frame over unnamed others (`may NOT`: a cause, a standpoint; MOVE-GRAMMAR §1.3 FEELING). Dropped.
- Variant 3 `[street]`, "The town's plan for an army is to not be interesting to one" — a plan, that is an intent no field holds, and a standpoint. Dropped.
- Variant 3, "everybody here can state the plan" — a TOTALITY OVER PERSONS, the card's standing REFUSED COLUMN and the Brackwater shape (CLERK-LAWS §1.3, guard roster §2.4.1). Dropped.
- Nothing was added. Every face's claim set is a subset-equal of the old sentence's LICENSED set, and the four faces of each variant are claim-equal to each other (arm A6 read across the faces).

**THE VOICE AND THE WALLS, checked face by face.** Zero em dashes, zero exclamations, zero digits or percents, zero which-clauses, zero questions, zero first or second person, zero citations, zero figures (a wall closing a town, works ringing a town and a body standing under arms are literal; "answers for" is institutional idiom, not a figure), zero future indicatives, zero expletive openers ("there is" / "it is"), zero pronoun closers (the twelve close on *militia · the town · the town · called · the town · militia · arms · kept · force · arms · soldiers · armed*), zero evaluative adjectives on a place or a person. The person-quantifiers ("nobody", "everybody", "anyone", "all") are absent by construction: every negation lands on an institution (wall, works, fortification, garrison, militia, levy, company, soldiers, arms), never on the town's people, so the REFUSED COLUMN cannot be touched.

**SIBLING DISTANCE (arms A1 and A11).** The five readiness rows render together on the Defense tab (`DefenseTab.jsx:150-183`), so this spine sits beside the `Beasts & Monsters` rows, which read the same institution flags against `config.monsterThreat`. Those rows own the words *line*, *perimeter*, *watch* and *force*; this packet therefore does not use *line* or *perimeter* at all, and uses *force* twice, so the two spines do not restate one another in vocabulary. **A standing note for the chair, not this packet's to fix:** the shipped `Beasts & Monsters: plagued, NO perimeter and NO force` row asserts the same institutional absence as this pool from a different key, so on a town where both fire the passage says the fact twice — a restatement across two pools, existing, and a composer/echo question rather than a wording one.

**A11 SPREAD, HELD.** Sentence counts are unchanged from the shipped rows: variant 1 two sentences in every face, variant 2 two, variant 3 one (today 2 / 2 / 1). First two words, every face: variant 1 opens `{settlement} is` · `{settlement} carries` · `{settlement} keeps` · `No wall`; variant 2 opens `Neither a` · `No garrison` · `No works` · `Nothing at`; variant 3 opens `The town` · `Nothing here` · `The town` · `The town`. Every cross-variant pairing differs in its first two words, whichever faces the seed draws. R-DA-17 holds: at most one variant of the pool opens on the settlement token (variant 1, and only on three of its four faces; variants 2 and 3 never open on it), and variant 3 keeps the shipped empty slot set.

**REFUSALS: none — all three variants were made lawful, and all twelve faces stand.** Three findings are recorded instead, because they are results and not breaches:

1. **The pool can show ONE level-1 grammar, not three.** With one licensing field and one licensed predicate, V2 (no structural-consequence field), V4 (no named object), V5 (no institution row on this card), V6 (no unresolved value), V7 (no event provenance) and V8 (no `not-held` field with provenance) are all filtered out per MOVE-GRAMMAR §3.2, and V3's LACK needs a `none-exists` field the card does not carry — the negative value is the STATE KEY's own value, so the move is PRESENT, not ABSENCE, and wall 3 ("ABSENCE never opens") is not engaged. All three variants are therefore V1 (PRESENT). This is the licensing filter working as §3.2 specifies ("a block with no `none-exists` field has no V3 and the pool is written without it"), not a spread failure, but it means B-GRAMMAR will read one grammar across this pool and should read it as NOT-EXECUTABLE for grammar variation rather than as a flattened pool.
2. **After the drop, the three variants are claim-equal to one another.** Every unlicensed claim that distinguished them was a cause, a history, an outcome or a standpoint. C-sibling asks siblings to differ lawfully in standpoint and grammar; the card refuses the standpoint and the filter leaves one grammar, so the three differ only in wording. "Never trim" (§22 a) forbids merging or dropping any of them, so three they remain, and the pool's real variety now lives in the twelve faces.
3. **The angle tags are labels, not standpoints, after this rewrite.** `[ledger]`, `[counterforce]` and `[street]` are each kept exactly as they stand, and each variant is written in the diction its tag names — the ledger enumerates the institutions, the counterforce names what does not stand, the street says it shortest — but no face carries the epistemic frame the shipped rows carried, because the card refuses a standpoint. If the sitting wants the tags to keep meaning what they meant, that is a card question (a licensed standpoint field), not a wording one.

**FACE WORD COUNTS** (`{settlement}` counted as one word): variant 1 — 12 · 14 · 10 · 14. Variant 2 — 16 · 15 · 11 · 13. Variant 3 — 10 · 10 · 9 · 7. Twelve faces, mean 11.75, range 7 to 16; the short line exists (R-DA-05's `< 8` floor is fed by variant 3's fourth face).
