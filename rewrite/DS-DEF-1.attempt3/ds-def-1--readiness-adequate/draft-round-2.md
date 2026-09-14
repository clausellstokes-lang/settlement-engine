Block DS-DEF-1 · pool key `readiness ADEQUATE` · role spine · draft round 2 · Opus writer (Seat: Opus 5, Fable-unvalidated)

The rows below are the COMPLETE replacement for the pool's four variant rows, in order, under the pool's own bold heading. The typed lines of the pool are untouched and are not repeated here.

**readiness `ADEQUATE`**
1. `[ledger]` The defense of {settlement} answers the ordinary demand on it and leaves nothing over.
   - `[face]` At {settlement} the cover stands level with the call upon the town.
   - `[face]` Against the common run of trouble, {settlement} is provided for in full and no further.
   - `[face]` Sufficiency without reserve is the defensive standing at {settlement}.
2. `[visitor]` {settlement} stands as a defended town of the plain sort, sufficient against the usual and no better.
   - `[face]` Ordinary among defended towns, {settlement} lacks nothing and keeps nothing spare.
   - `[face]` Common cover is what {settlement} shows, and nothing stands behind the cover.
   - `[face]` Enough stands at {settlement}, and no more.
3. `[street]` The town is set up for the usual trouble, and that is where the arrangement ends.
   - `[face]` Nothing in the town's defense is short, and nothing is spare.
   - `[face]` What the town keeps does for the common demand and does no more.
   - `[face]` So far as the usual goes, the town is covered, and the cover stops there.
4. `[threshold]` The defense at {settlement} stands at its own limit, and the limit is where the cover ends.
   - `[face]` Cover at {settlement} runs to its edge, and no part of it runs past.
   - `[face]` Provision at {settlement} reaches the common trouble and stops there.
   - `[face]` Everything {settlement} keeps in defense answers the ordinary case, and nothing answers past it.

--- NOTES

**WHAT ROUND 2 CHANGED, measure by measure, and the refusal it answers.**

*The REFUSAL (`--check` at `scripts/lib/dossier-annex-grammar.mjs:694`, `assertFaces`).* Round 1's three faces of variant 2 each began with the literal token `{settlement}`. The refusal is exact and mechanical: for a `sentence`-form pool, a face matching `/^\{slot\}/` where `shapeOf(slot) === 'proper'` is refused (T-F8). All three are rewritten to open on a word — `Ordinary`, `Common`, `Enough`. **No face in this packet opens on a slot token.** Round 1's variant 1 face 1 ("At {settlement} the cover stands level…") is kept unchanged and is NOT a breach: the regex is anchored at the start of the string, so a prepositional opener carrying the token is outside it, and the shipped `readiness WEAK` face "At {settlement} the defense is weak now…" is the live proof that it passes `--check` today.

*Two FURTHER refusals found by reading the projector, which round 1 would have hit on the next line.* `assertFaces` also refuses a face whose `{slot}` set differs from its parent's (arm A6; ARCH §2.5's face row). Round 1's variant 3 had a slotless parent with three `{settlement}`-bearing faces, and variant 4's face 2 ("The town's provision ends where its holding ends") was slotless under a `{settlement}` parent. Both would have been refused after the first was cured. **In this packet variant 3 is slotless in the parent AND in all three faces** (the shape the shipped `strategic value HIGH` variant 2 and `readiness CRITICAL` variant 2 already carry), **and every face of variants 1, 2 and 4 names `{settlement}` exactly as its parent does.**

*`punctuation.colonRate` (over) on 1 of 4.* The measured face is the SHIPPED variant 2, whose colon sits at "at {settlement}: enough on the walls". The colon goes with the clause it punctuated (a standpoint the card refuses). **Zero colons in all sixteen rows of this packet.**

*`shapes.whichTailRate` (over) on 1 of 4.* The measured face is the SHIPPED variant 3's tail ", which is a fair reading of what it has" — a which-tail carrying a verdict, refused twice over (wall 6 / R-DA-03; MOVE-GRAMMAR §1.3's VERDICT non-move). **Zero occurrences of `which` in all sixteen rows.** Both measures are the old rows' and both move the moment the packet applies, which is why curing the refusal is the round's whole work.

**The card, cited short.** The clauses referred to below are the printed licence card for (DS-DEF-1, `readiness ADEQUATE`):
- **MAY** — "that the reader `scoreBand(readinessScore)` selects the row `ADEQUATE` of `READINESS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record".
- **PRED** — `scoreBand(readinessScore) === ADEQUATE`.
- **BAG** — `{band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED at this block's call sites: `{settlement}`.
- **ROLE/FORM** — role `spine`, form `sentence`, relation none, attach none, move none declared, angle set `ledger street threshold visitor`.
- **NOT** — a count, a cause, a season, a future, a standpoint, a second fact.
- **SOURCE** — none, standing SOURCE-UNRESOLVED; no citation licensed (arm A13 refuses a named holder).
- **REFUSED COLUMNS** — a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.

**The claim set every face carries, and nothing else.** All sixteen rows carry exactly one claim: MAY/PRED, the `ADEQUATE` row as a standing fact — the town's defensive readiness is sufficient for the ordinary and holds no surplus. The two halves (sufficient · no surplus) are ONE claim, not two: `ADEQUATE` is the band above `WEAK` and below `STRONG`, so "no surplus" is the band word's own boundary against `STRONG` and adds no field. The four faces of each variant are therefore claim-equal to each other (arm A6 reads across the faces). `{settlement}` is the only slot written anywhere; `{band}`, `{route}` and `{counterpart}` are not written.

**Face-by-face licence.**

*Variant 1 `[ledger]` — the band in the accounting idiom.*
- Parent ("answers the ordinary demand on it and leaves nothing over"): the sufficiency half by MAY/PRED; "leaves nothing over" is the same band's upper boundary, MAY/PRED. `{settlement}` by BAG. No other claim.
- Face 1 ("the cover stands level with the call upon the town"): "level" is MAY/PRED stated as a measurement in words (R-DA-11: a comparison is a measurement, never a figure). "the call upon the town" names no threat, no count and no particular — see the DENOMINATOR note.
- Face 2 ("provided for in full and no further"): both halves MAY/PRED. The opener is a prepositional phrase, not a participle (R-DA-18's participial floor: zero participial openers in sixteen rows).
- Face 3 ("Sufficiency without reserve is the defensive standing at {settlement}"): MAY/PRED in its most compressed form; "without reserve" is the boundary half, an absence close (R-DA-04's close-kind set).

*Variant 2 `[visitor]` — the band as the town's outward, plainly encountered standing. The angle survives as vocabulary and stance; the observer does not (a standpoint is NOT).*
- Parent ("a defended town of the plain sort, sufficient against the usual and no better"): MAY/PRED. "no better" is a comparative on the typed rating field itself (`scoreBand`), which is what CL-7 requires of a rating word — it restates the band, it does not add a verdict.
- Face 1 ("Ordinary among defended towns, {settlement} lacks nothing and keeps nothing spare"): MAY/PRED, both halves. "Ordinary among defended towns" is the band's own position on its own scale, not a survey of other towns; the referent is the scale the card names.
- Face 2 ("Common cover is what {settlement} shows, and nothing stands behind the cover"): MAY/PRED; "nothing stands behind the cover" is the no-surplus half, and asserts nothing about any one arm (the block's PROVENANCE FENCE held). "shows" carries the outward angle with no viewer in the sentence.
- Face 3 ("Enough stands at {settlement}, and no more"): MAY/PRED, both halves, in seven words. This is the pool's short line (the register card: the short line exists).

*Variant 3 `[street]` — the band in the town's plain idiom, with no mind in it and no slot in it.*
- Parent ("set up for the usual trouble, and that is where the arrangement ends"): MAY/PRED, both halves. "The town" is the corporate subject the block already renders, never a totality over persons (REFUSED COLUMNS held); no actor sets anything up in the sentence.
- Face 1 ("Nothing in the town's defense is short, and nothing is spare"): MAY/PRED stated from its two boundaries.
- Face 2 ("does for the common demand and does no more"): MAY/PRED. No future indicative anywhere in the packet; A2 and R-DA-07 held.
- Face 3 ("So far as the usual goes, the town is covered, and the cover stops there"): MAY/PRED, both halves; the close is a boundary kind.

*Variant 4 `[threshold]` — the band read as a boundary position, in the present.*
- Parent ("stands at its own limit, and the limit is where the cover ends"): MAY/PRED; the limit is the band's own upper edge, asserted of the record's standing and of nothing beyond it.
- Face 1 ("runs to its edge, and no part of it runs past"): MAY/PRED, both halves.
- Face 2 ("Provision at {settlement} reaches the common trouble and stops there"): MAY/PRED, both halves, compressed to one positional predicate.
- Face 3 ("Everything {settlement} keeps in defense answers the ordinary case, and nothing answers past it"): MAY/PRED, both halves; "Everything" totalises the town's own provision, never persons (REFUSED COLUMNS held).

**Claims DROPPED from the shipped variants, each with the clause that refuses it.**
- V1's "would not survive being tested twice at once" — a second fact (NOT), a count ("twice", NOT), and a subjunctive outcome over the five arms the block's PROVENANCE FENCE forbids the header to imply.
- V2's "A stranger sees … at {settlement}" — a standpoint (NOT) and a person the block holds no field for (R-DA-14).
- V2's "enough on the walls" — walls are `DS-DEF-5`'s institution row, not this pool's READS; an unlicensed object (R-DA-15; hollow specificity, fault 24).
- V2's "not enough to be reassuring" — a standpoint (NOT): a reaction assigned to a reader (register card, "no assigned reaction").
- V3's "The town believes it could hold" — a belief frame (R-DA-13's belief floor, executable now) and a totality over persons (REFUSED COLUMNS).
- V3's "does not claim more than that" — an act by unnamed persons, licensed by no field; the record's own hedging, not a fact.
- V3's ", which is a fair reading of what it has" — a which-tail (wall 6 / R-DA-03) carrying a standpoint and a verdict (NOT; MOVE-GRAMMAR §1.3's VERDICT non-move).
- V4's "One more demand on them and the town would be choosing which pressure to leave uncovered" — a second fact (NOT), a which-clause, and an assertion about the several pressures, which the block's PROVENANCE FENCE ("the readiness word … asserts nothing about any one of them") refuses to the header.
Nothing was added: no row makes a claim the shipped variant did not already make in some form, and every kept claim resolves to MAY/PRED.

**Refusals: NONE.** All four variants are lawful as written. Four judgments are declared here rather than refused, each the chair's to veto.

1. **§22's parenthetical versus the claim wall.** Every shipped variant of this pool was two sentences whose SECOND sentence carried an unlicensed claim, and the card licenses no second fact, so the rewritten variants are one sentence each. §22 reads "cutting words is editing; cutting sentences is trimming". I read the ratcheted unit as §22(a) defines it — the VARIANT and its slot — so the pool keeps four variants and gains twelve faces, and the counts only rise. The wall (§16(1): every sentence licensed by a typed field; B-CLAIM) is never muted, and dropping the unlicensed claim is the rewrite's stated purpose. The alternative — a second sentence restating the first's complement — is R-DA-03's summarising second sentence (0.035 → 0.000) and best-ai's own signature: worse on the walls and on the voice.

2. **Variant 2's parent keeps the settlement token as its opener, and that is wall 10's licence, not a breach.** MOVE-GRAMMAR §1.4 wall 10 permits the token to open at most ONE variant per pool and never two adjacent; variant 2 is that one, and variants 1, 3 and 4 open on words. The projector's T-F8 arm is widened across the JOIN only — `assertFaces` reads `v.wordings`, never `v.text` (`dossier-annex-grammar.mjs:663-699`, called at `generate-dossier-state-prose.mjs:774`) — and the shipped `readiness STRONG` variant 1 of this same block opens on `{settlement}` and passes `--check` today. If the chair prefers zero token openers in the pool, the one-word cure is to front variant 2's parent with "As a defended place," and nothing else moves.

3. **The pool is V1-only, and that is the licence filter working, not a flattened pool.** MOVE-GRAMMAR §2.1 asks a pool of two or more for at least two distinct level-1 grammars, and its own filter clause removes every member whose licensing field is null. This card holds one field and no relation, no attach, no move: V2 (structural-consequence field), V3 (`none-exists`), V4 (named object), V5 (institution row), V6 (unresolved state value), V7 (event provenance) and V8 (`not-held`) are all filtered out, leaving V1. The four variants are one grammar in four angles; the variation the pool carries is angle, rhythm and length, never order. Two consequences: the walker's arm A will read this pool as uniform, and §4.4.2's caveat applies in reverse — these V1s are AUTHORED V1s, not the classifier's silent fallback, and must be excluded from any "nothing recognised" figure.

4. **The `[threshold]` angle is not the THRESHOLD move, so wall 2 does not put variant 4 into the subjunctive.** Wall 2 ("THRESHOLD / EDGE is always conditional or subjunctive") binds the MOVE; the card declares no move and `[threshold]` here is the angle tag the shipped row carries. Variant 4 asserts a standing position at a limit, which is PRESENT. A subjunctive would have to name what lies past the edge, and that is the second fact the card refuses — the shipped variant's own breach.

**The DENOMINATOR judgment (the one place a refuter should look first).** `ADEQUATE` is a comparative band, so the band word carries an implicit referent: adequate to something. Nine of the sixteen rows name that referent generically and unquantified ("the ordinary demand", "the call upon the town", "the common run of trouble", "the usual", "the usual trouble", "the common demand", "the ordinary case", "the common trouble"); the other seven omit it entirely. The mix is deliberate. My reading is that the generic denominator is the band word's own content and not a second fact: it names no threat, no arm, no count, no season and no event, so it collides with neither the block's PROVENANCE FENCE nor `DS-DEF-2`'s five rows. A refuter who reads it as a threat claim should say so; the denominator-free rows are the fallback and the pool stays four-faced either way.

**Sibling checks run (arms A1 and A11).**
- Against the co-rendering siblings in this block — `terrain FAVOURABLE`, `terrain EXPOSED`, `strategic value HIGH`, `strategic value LOW` — no row names ground, site, hill, narrows, approach, flat land, worth, prize or price. Those are the siblings' claims and are neither restated nor contradicted. "holding" was drafted for variant 4 face 2 and struck for reading toward `strategic value`'s object.
- Against the non-co-rendering band siblings `STRONG`, `WEAK`, `CRITICAL` — no row reuses their signature wordings: "what {settlement} keeps against attack", "the highest/lowest mark the scale carries", "set down under readiness", "the ordinary run of things", "getting by" and "amounts to" were all drafted and struck because a band sibling owns them.
- Against `DS-DEF-3` (public order) and `DS-DEF-5` (armed forces and fortifications) — no watch, guard, wall, garrison, militia, muster or charter is named anywhere in the sixteen rows.
- The COMPOSITION FENCE (§0h V1-g) is a composer constraint, not a text one: nothing here narrows toward `DS-DEF-10`'s per-arm `ADEQUATE` badge, because no row names an arm.

**The thread (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1).** This pool is a SPINE, so each row is the passage's first sentence and hands nouns forward rather than picking them up. Every row plants at least two catchable nouns for the modifiers that follow by salience — the town or `{settlement}`, and one of `defense` / `cover` / `provision` / `standing` / `arrangement`. No row is a fragment, none opens on a comma, and none is written to depend on what precedes it, because nothing precedes a spine.

**Mechanical floors checked over all sixteen rows.** Zero digits · zero percent signs · zero em dashes · zero exclamation marks · zero question marks · zero colons · zero semicolons · zero `which` (and no other relative tail) · zero citations and zero named holders (SOURCE) · zero second sentences · zero future indicatives · zero existential or `it is` openers (R-DA-07) · zero pronoun closers (R-DA-04) · zero similes, sense verbs on abstractions and inanimate intent verbs (R-DA-11) · zero character adjectives and zero named persons (R-DA-14) · zero belief frames (R-DA-13) · zero triads (R-DA-10) · zero participial openers (R-DA-18) · slots exactly `{settlement}` on variants 1, 2 and 4 and none on variant 3, parent and faces agreeing row for row (A6). Sixteen rows carry fourteen distinct opening words and no two adjacent rows share an opener (R-DA-05's `sameOpenerAsPreviousRate`, 0 of 15 joins). Close kinds vary: absence (over, spare, nothing, no more), condition (no further, no better, no more), object (the town, the cover), boundary (where the cover ends, runs past, stops there).

**Length spread as authored (words per row, parent first; counted on the rows themselves).** V1: 14 · 12 · 15 · 9. V2: 17 · 11 · 12 · 7. V3: 16 · 11 · 13 · 15. V4: 17 · 14 · 10 · 14. Range 7 to 17, mean 12.9 — the short line at seven and the long at seventeen keep R-DA-06's short-line floor and R-DA-05's within-pool spread reachable without a metronome.
