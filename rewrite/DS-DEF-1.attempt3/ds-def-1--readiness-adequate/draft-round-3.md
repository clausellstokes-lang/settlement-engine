Block DS-DEF-1 · pool key `readiness ADEQUATE` · role spine · draft round 3 · Opus writer (Seat: Opus 5, Fable-unvalidated)

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
   - `[face]` All that {settlement} keeps in defense answers the ordinary case, and nothing answers past it.

--- NOTES

**ROUND 3, THE GATE'S ONE MEASURE, ANSWERED WITH ITS MECHANICAL CAUSE.**

*The failing measure, quoted from the gate:* `shapes.participialOpenerRate` (over) = 28.24 band-widths on 1 of 16 faces — v4 face 3, "Everything {settlement} keeps in defense answers the ordinary case, and nothing answers past it." (band DEPTH at most 1.75 band-widths on every face).

*The cause, read out of the instrument, not guessed.* `src/domain/prose/proseFingerprint.js:141` computes the measure as `first.filter((w) => /ing$/.test(w) && !NOT_PARTICIPLES.test(w))`, where `first` is each sentence's opening word lowercased and stripped of non-letters (`:113`), and `NOT_PARTICIPLES` (`:71`) carries the exemption list verbatim: `thing|nothing|something|king|spring|during|ring|string|morning|evening|bring|sing`. **`everything` is not on that list and ends in `ing`.** The face has no participle in it; the detector reads its opening word as one, and on a one-sentence face the rate is therefore 1.0 — the whole of the 28.24 band-widths. Executed check in the dock (read-only, node one-liner over the two regexes as they stand in the file): `everything` → PARTICIPIAL-OPENER; `all`, `whatever`, `nothing`, `cover`, `provision` → clean. **CONFIRMED.**

*The cure, one word wide.* Variant 4's face 3 now opens `All that` instead of `Everything`. The face's claim set, its slot, its angle, its two halves and its close are unchanged; only the opening determiner moves, so the measure falls from 1.0 to 0 on that face and nothing else in the packet is disturbed. `all` is the opener chosen over `whatever` for sibling distance: `readiness WEAK` variant 2 face 3 and `readiness STRONG` variant 4 already open on `Whatever`, and no row of any band in this block opens on `All`.

*The other fifteen rows are byte-identical to round 2, deliberately.* The gate named one failing measure across sixteen faces; §21.3's rule that one effort never adds a new failing state makes a wider edit a wager against a passing gate. The openers of the whole packet re-checked against the same detector: `the`, `at`, `against`, `sufficiency`, `{settlement}` → `settlement`, `ordinary`, `common`, `enough`, `nothing` (on the exemption list in its own right), `what`, `so`, `cover`, `provision`, `all`. **Zero rows now end in `ing` at the opener; zero rows open `There is` / `It is` (`shapes.thereIsOpenerRate`, `:145`).**

*Rounds 1 and 2, for the record, so this round is not read as the first cure.* Round 1's refusal was the projector's T-F8 (a `sentence`-form face may not open on a `proper` slot token; `scripts/lib/dossier-annex-grammar.mjs`, `assertFaces`), plus two further refusals found by reading the same function — a face whose slot set differs from its parent's. Round 2 cured all three, and cured the shipped rows' `punctuation.colonRate` and `shapes.whichTailRate` by dropping the clauses that carried them. Round 3 cures the one measure round 2 left over. No round has been dry.

**The card, cited short.** The clauses referred to below are the printed licence card for (DS-DEF-1, `readiness ADEQUATE`):
- **MAY** — "that the reader `scoreBand(readinessScore)` selects the row `ADEQUATE` of `READINESS_ROW_POOL` in `defenseStateProse.js`, as a STANDING fact of the record".
- **PRED** — `scoreBand(readinessScore) === ADEQUATE`.
- **BAG** — `{band: RESERVED, counterpart: proper, route: proper, settlement: proper}`, FILLED at this block's call sites: `{settlement}`.
- **ROLE/FORM** — role `spine`, form `sentence`, relation none, attach none, move none declared, angle set `ledger street threshold visitor`.
- **NOT** — a count, a cause, a season, a future, a standpoint, a second fact.
- **SOURCE** — none, standing SOURCE-UNRESOLVED; no citation is licensed (arm A13 refuses a named holder).
- **REFUSED COLUMNS** — a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.

**The claim set every face carries, and nothing else.** All sixteen rows carry exactly one claim: MAY/PRED, the `ADEQUATE` row as a standing fact — the town's defensive readiness is sufficient for the ordinary and holds no surplus. The two halves (sufficient · no surplus) are ONE claim, not two: `ADEQUATE` is the band above `WEAK` and below `STRONG`, so "no surplus" is the band word's own boundary against `STRONG` and adds no field. The four faces of each variant are therefore claim-equal to each other (arm A6 reads across the faces, never back to the shipped sentence). `{settlement}` is the only slot written anywhere; `{band}`, `{route}` and `{counterpart}` are not written.

**Face-by-face licence.**

*Variant 1 `[ledger]` — the band in the accounting idiom.*
- Parent ("answers the ordinary demand on it and leaves nothing over"): the sufficiency half by MAY/PRED; "leaves nothing over" is the same band's upper boundary, MAY/PRED. `{settlement}` by BAG. No other claim.
- Face 1 ("the cover stands level with the call upon the town"): "level" is MAY/PRED stated as a measurement in words (R-DA-11: a comparison is a measurement, never a figure). "the call upon the town" names no threat, no count and no particular — see the DENOMINATOR note.
- Face 2 ("provided for in full and no further"): both halves MAY/PRED. The opener is a prepositional phrase, not a participle.
- Face 3 ("Sufficiency without reserve is the defensive standing at {settlement}"): MAY/PRED in its most compressed form; "without reserve" is the boundary half, an absence close (R-DA-04's close-kind set).

*Variant 2 `[visitor]` — the band as the town's outward, plainly encountered standing. The angle survives as vocabulary and stance; the observer does not (a standpoint is NOT).*
- Parent ("a defended town of the plain sort, sufficient against the usual and no better"): MAY/PRED. "no better" is a comparative on the typed rating field itself (`scoreBand`), which is what CL-7 requires of a rating word — it restates the band, it does not add a verdict.
- Face 1 ("Ordinary among defended towns, {settlement} lacks nothing and keeps nothing spare"): MAY/PRED, both halves. "Ordinary among defended towns" is the band's own position on its own scale, not a survey of other towns.
- Face 2 ("Common cover is what {settlement} shows, and nothing stands behind the cover"): MAY/PRED; "nothing stands behind the cover" is the no-surplus half, and asserts nothing about any one arm (the block's PROVENANCE FENCE held). "shows" carries the outward angle with no viewer in the sentence.
- Face 3 ("Enough stands at {settlement}, and no more"): MAY/PRED, both halves, in seven words. This is the pool's short line (the register card: the short line exists).

*Variant 3 `[street]` — the band in the town's plain idiom, with no mind in it and no slot in it.*
- Parent ("set up for the usual trouble, and that is where the arrangement ends"): MAY/PRED, both halves. "The town" is the corporate subject the block already renders, never a totality over persons (REFUSED COLUMNS held); no actor sets anything up in the sentence.
- Face 1 ("Nothing in the town's defense is short, and nothing is spare"): MAY/PRED stated from its two boundaries.
- Face 2 ("does for the common demand and does no more"): MAY/PRED. No future indicative anywhere in the packet.
- Face 3 ("So far as the usual goes, the town is covered, and the cover stops there"): MAY/PRED, both halves; the close is a boundary kind.

*Variant 4 `[threshold]` — the band read as a boundary position, in the present.*
- Parent ("stands at its own limit, and the limit is where the cover ends"): MAY/PRED; the limit is the band's own upper edge, asserted of the record's standing and of nothing beyond it.
- Face 1 ("runs to its edge, and no part of it runs past"): MAY/PRED, both halves.
- Face 2 ("Provision at {settlement} reaches the common trouble and stops there"): MAY/PRED, both halves, compressed to one positional predicate.
- Face 3, ROUND 3's ONE EDIT ("All that {settlement} keeps in defense answers the ordinary case, and nothing answers past it"): MAY/PRED, both halves; "All that {settlement} keeps in defense" totalises the town's own provision, never persons (REFUSED COLUMNS held), and names no arm (PROVENANCE FENCE held). The repeated verb is the office's formula recurring on one fact, not a second fact.

**Claims DROPPED from the shipped variants, each with the clause that refuses it.**
- V1's "would not survive being tested twice at once" — a second fact (NOT), a count ("twice", NOT), and a subjunctive outcome over the five arms the block's PROVENANCE FENCE forbids the header to imply.
- V2's "A stranger sees … at {settlement}" — a standpoint (NOT) and a person the block holds no field for (R-DA-14).
- V2's "enough on the walls" — walls are `DS-DEF-5`'s institution row, not this pool's READS; an unlicensed object (R-DA-15; hollow specificity, fault 24).
- V2's "not enough to be reassuring" — a standpoint (NOT): a reaction assigned to a reader (register card, "no assigned reaction").
- V3's "The town believes it could hold" — a belief frame (R-DA-13) and a totality over persons (REFUSED COLUMNS).
- V3's "does not claim more than that" — an act by unnamed persons, licensed by no field; the record's own hedging, not a fact.
- V3's ", which is a fair reading of what it has" — a which-tail (wall 6 / R-DA-03) carrying a standpoint and a verdict (NOT; MOVE-GRAMMAR §1.3's VERDICT non-move).
- V4's "One more demand on them and the town would be choosing which pressure to leave uncovered" — a second fact (NOT), a which-clause, and an assertion about the several pressures the block's PROVENANCE FENCE refuses to the header.
Nothing was added: no row makes a claim the shipped variant did not already make in some form, and every kept claim resolves to MAY/PRED.

**Refusals: NONE.** All four variants are lawful as written, and the one measure the gate reported is cured at its mechanical cause. Four judgments are declared here rather than refused, each the chair's to veto.

1. **§22's parenthetical versus the claim wall.** Every shipped variant of this pool was two sentences whose SECOND sentence carried an unlicensed claim, and the card licenses no second fact, so the rewritten variants are one sentence each. §22 reads "cutting words is editing; cutting sentences is trimming". I read the ratcheted unit as §22(a) defines it — the VARIANT and its slot — so the pool keeps four variants and gains twelve faces, and the counts only rise. The wall (§16(1): every sentence licensed by a typed field; B-CLAIM) is never muted, and dropping the unlicensed claim is the rewrite's stated purpose. The alternative — a second sentence restating the first's complement — is R-DA-03's summarising second sentence and best-ai's own signature: worse on the walls and on the voice.

2. **Variant 2's parent keeps the settlement token as its opener, and that is wall 10's licence, not a breach.** MOVE-GRAMMAR §1.4 wall 10 permits the token to open at most ONE variant per pool and never two adjacent; variant 2 is that one, and variants 1, 3 and 4 open on words. The projector's T-F8 arm is widened across the JOIN only — `assertFaces` reads `v.wordings`, never `v.text` — and the shipped `readiness STRONG` variant 1 of this same block opens on `{settlement}` and passes `--check` today. If the chair prefers zero token openers in the pool, the one-word cure is to front variant 2's parent with "As a defended place," and nothing else moves.

3. **The pool is V1-only, and that is the licence filter working, not a flattened pool.** MOVE-GRAMMAR §2.1 asks a pool of two or more for at least two distinct level-1 grammars, and its own filter clause removes every member whose licensing field is null. This card holds one field and no relation, no attach, no move: V2 (structural-consequence field), V3 (`none-exists`), V4 (named object), V5 (institution row), V6 (unresolved state value), V7 (event provenance) and V8 (`not-held`) are all filtered out, leaving V1. The four variants are one grammar in four angles; the variation the pool carries is angle, rhythm and length, never order. Two consequences: the walker's arm A will read this pool as uniform, and §4.4.2's caveat applies in reverse — these V1s are AUTHORED V1s, not the classifier's silent fallback, and must be excluded from any "nothing recognised" figure.

4. **The `[threshold]` angle is not the THRESHOLD move, so wall 2 does not put variant 4 into the subjunctive.** Wall 2 ("THRESHOLD / EDGE is always conditional or subjunctive") binds the MOVE; the card declares no move and `[threshold]` here is the angle tag the shipped row carries. Variant 4 asserts a standing position at a limit, which is PRESENT. A subjunctive would have to name what lies past the edge, and that is the second fact the card refuses — the shipped variant's own breach.

**The DENOMINATOR judgment (the one place a refuter should look first).** `ADEQUATE` is a comparative band, so the band word carries an implicit referent: adequate to something. Nine of the sixteen rows name that referent generically and unquantified ("the ordinary demand", "the call upon the town", "the common run of trouble", "the usual", "the usual trouble", "the common demand", "the ordinary case", "the common trouble"); the other seven omit it entirely. The mix is deliberate. My reading is that the generic denominator is the band word's own content and not a second fact: it names no threat, no arm, no count, no season and no event, so it collides with neither the block's PROVENANCE FENCE nor `DS-DEF-2`'s five rows. A refuter who reads it as a threat claim should say so; the denominator-free rows are the fallback and the pool stays four-faced either way.

**Sibling checks re-run this round (arms A1 and A11).**
- Against the co-rendering siblings in this block — `terrain FAVOURABLE`, `terrain EXPOSED`, `strategic value HIGH`, `strategic value LOW` — no row names ground, site, hill, narrows, approach, flat land, worth, prize or price.
- Against the non-co-rendering band siblings `STRONG`, `WEAK`, `CRITICAL` as they stand in the annex today — no row reuses their signature wordings ("what {settlement} keeps against attack", "the highest mark the scale carries", "the lowest mark the scale carries", "Set down under readiness", "the ordinary run of things", "amounts to"), and the new opener `All` is used by no row of any band in this block, where `Whatever` opens two (`STRONG` v4 and `WEAK` v2 face 3) and was rejected for that reason.
- Against `DS-DEF-3` (public order) and `DS-DEF-5` (armed forces and fortifications) — no watch, guard, wall, garrison, militia, muster or charter is named anywhere in the sixteen rows.
- The COMPOSITION FENCE (§0h V1-g) is a composer constraint, not a text one: nothing here narrows toward `DS-DEF-10`'s per-arm `ADEQUATE` badge, because no row names an arm.

**The thread (owner, 2026-09-08 ~21:4x).** This pool is a SPINE, so each row is the passage's first sentence and hands nouns forward rather than picking them up. Every row plants at least two catchable nouns for the modifiers that follow by salience — the town or `{settlement}`, and one of `defense` / `cover` / `provision` / `standing` / `arrangement`. No row is a fragment, none opens on a comma, and none is written to depend on what precedes it, because nothing precedes a spine. Variant 4 face 3's edit does not touch this: `defense` and `case` still stand as the catchable nouns, in the same places.

**Mechanical floors checked over all sixteen rows.** Zero digits · zero percent signs · zero em dashes · zero exclamation marks · zero question marks · zero colons · zero semicolons · zero parentheses · zero `which` (and no other relative tail) · zero citations and zero named holders (SOURCE) · zero second sentences · zero future indicatives · zero `There is` / `It is` openers · zero `-ing` openers outside the detector's own exemption list (the round's cure) · zero similes, sense verbs on abstractions and inanimate intent verbs (R-DA-11) · zero character adjectives and zero named persons (R-DA-14) · zero belief frames (R-DA-13) · zero triads (the `shapes.triadRate` comma pattern matches no row) · zero antithesis patterns (`not … but`, `rather than`, `, not x`, `less … than`) · zero doubled-adjective pairs on the `shapes.doubledAdjectiveRate` pattern · zero adverbs on the `\w+ly` count · zero quotation marks (`shapes.dialogueShare`) · slots exactly `{settlement}` on variants 1, 2 and 4 and none on variant 3, parent and faces agreeing row for row (A6). Sixteen rows carry fourteen distinct opening words and no two adjacent rows share an opener.

**Length spread as authored (words per row, parent first; counted on the rows themselves).** V1: 14 · 12 · 15 · 9. V2: 17 · 11 · 12 · 7. V3: 16 · 11 · 13 · 15. V4: 17 · 14 · 10 · 15. Range 7 to 17, mean 13.0 — the short line at seven and the long at seventeen keep the short-line floor and the within-pool spread reachable without a metronome. The only figure that moved this round is V4 face 3, from 14 words to 15.
