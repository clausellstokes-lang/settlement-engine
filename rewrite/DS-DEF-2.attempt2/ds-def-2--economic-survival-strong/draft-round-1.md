Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2 · pool key `Economic Survival`: `STRONG` · role spine · draft round 1.
Three variants in, three variants out: the same vids, the same order, the same single angle tag on each numbered line, none added, none removed, none merged. Four wordings per variant (the numbered line is the first wording; the three `[face]` sub-rows are the other three), claim-equal to each other and no paraphrase of a sibling. No `[plain]` marker anywhere: it belongs to modifier rows and the projector refuses it on a spine. The pool's typed lines (ROLE, READS, RELATION, ATTACH, FORM, MOVE) are untouched and are not repeated here.
The rows below are the complete replacement for the pool's variant rows, ready to paste under the pool's heading.

1. `[ledger]` A sustained crisis at {settlement} is met out of the town's own income.
   - `[face]` Emergencies at {settlement} are paid from revenue.
   - `[face]` The charge a long trouble would lay on {settlement} is one the town's ordinary receipts can carry through to the end.
   - `[face]` The town purse at {settlement} covers what a prolonged emergency costs.
2. `[street]` Hard going at {settlement} is paid for out of the town's own takings while it lasts.
   - `[face]` A rough stretch at {settlement} is money the town can find.
   - `[face]` When things go badly here, what is spent is money {settlement} already holds.
   - `[face]` What a bad turn costs, {settlement} has to hand.
3. `[counterforce]` The pressure a long emergency puts on {settlement} is a pressure the town's own money meets.
   - `[face]` Cost is not what would give way at {settlement}.
   - `[face]` Under an emergency that does not let up, the money {settlement} spends is money of the town's own raising.
   - `[face]` Sustained trouble at {settlement} finds a town able to pay.

--- NOTES

**The card, as printed** (`node scripts/prose-licence-card.mjs DS-DEF-2 'Economic Survival: STRONG'`, run in `laneRW-DEF2`), with the clause labels used below:

- **C-READ** — `reads: scoreBand(economicScore) (via ECONOMIC_ROW_POOL in defenseStateProse.js)`; absent means no candidate.
- **C-PRED** — `predicate: scoreBand(economicScore) === STRONG`. In the code this is `economicScore >= 65` (`defenseScoreBands.js:38-39`, read only to know what the value means; nothing about the number reaches any wording).
- **C-CLAIM** — `may claim: that (=== STRONG) holds, as a STANDING fact of the record`.
- **C-BAG** — `bag: {band: RESERVED, route: proper, settlement: proper}`, **FILLED at this block's call sites: {settlement}**. So every wording carries `{settlement}` and nothing else: no `{band}`, no `{route}`, no band word (`strong`, `adequate`, `weak`, `critical`) as text, no road.
- **C-ROLE** — `role spine` · `form sentence` · `move (none declared)` · `angle: counterforce ledger street` · `relation: a spine takes no relation` · `attach: empty (a spine takes no attach set)`.
- **C-NOT** — `may NOT: a count, a cause, a season, a future, a standpoint, a second fact`.
- **C-SRC** — `source: (none) · standing SOURCE-UNRESOLVED`; **NO citation is licensed at all**, and a face naming a record holder is refused by arm A13. Zero is mandatory here, not a budget choice: no wording says the books, the roll, the register, the treasury, the watch or the elders. §24's ceiling of one citation per unit is unspent, which is also the exemplar norm (0 per 786 sentences).
- **C-REFUSED** — always: a totality over persons; an exemption from a duty; a named character and that character's fate; a theological claim.
- **C-AUD** — `audience: player (no mark)`; `covert: no`. No wording carries a `dm-only` mark; no covert twin.

**The one licensed claim.** The predicate has a single value and no halves, so the card licenses exactly one fact:

- **K1** — the cost of a sustained crisis stands inside what the settlement's own economy yields; the band is a STANDING configuration fact of the record (C-READ + C-PRED + C-CLAIM; MOVE-GRAMMAR §1.2 row 1, PRESENT, a standing configuration field licensing a STRUCTURAL clause and never a historical one).

All twelve wordings assert K1 and nothing besides K1. Arm A6 therefore holds inside each variant and across the three.

### A. Per wording: the claim, and the clause that licenses it

| vid · wording | words | the claim asserted | licensed by |
|---|---|---|---|
| 1 · line | 13 | K1 | C-CLAIM (`met out of the town's own income` is the band's own substance, not a second fact: the band IS the town's capacity to meet the cost from its own economy) |
| 1 · face a | 7 | K1 | C-CLAIM |
| 1 · face b | 21 | K1 | C-CLAIM; `through to the end` is the sustained half of the same value (the shipped line carried `while they last`), never a duration count — C-NOT's *count* is unspent, no digit and no number word appears |
| 1 · face c | 11 | K1 | C-CLAIM; `the town purse` is the town's money under its ordinary noun, not an office and not a table row (see D-2) |
| 2 · line | 16 | K1 | C-CLAIM; `takings` is the same money in the street's noun |
| 2 · face a | 11 | K1 | C-CLAIM |
| 2 · face b | 13 | K1 | C-CLAIM; `already holds` is the standing tense of the band, not a history (nothing is said to have happened) |
| 2 · face c | 9 | K1 | C-CLAIM |
| 3 · line | 16 | K1 | C-CLAIM; the `[counterforce]` angle realised as what the pressure meets, a standing fact, never as an event that did not occur |
| 3 · face a | 9 | K1, in negative form | C-CLAIM; the negation is scoped to cost alone and asserts nothing about any other row (see E-2) |
| 3 · face b | 19 | K1 | C-CLAIM; `of the town's own raising` is the own-means half; `that does not let up` is the sustained half |
| 3 · face c | 10 | K1 | C-CLAIM |

**Slot sets are equal within every variant** (ARCH §2.5's face refusal row): each of the twelve carries `{settlement}` once and no other slot. **No wording opens on `{settlement}`** — T-F8's proper-slot-initial refusal is clear on all twelve, and R-DA-17's *the town's name is not the default opener* holds for the whole pool (the shipped variant 1 opened on it and no longer does).

### B. What the shipped sentences claimed, and what became of each claim

Dropping an unlicensed claim is the rewrite's purpose (Part B §21–§23; ruling 5; R-DA-15's *obeys (6)* — an unlicensed office, count or exemption **is not a claim the pool was entitled to hold**, so B-CLAIM is not engaged by its removal). Nothing here is a trim under §22: every variant keeps its vid, its tag, its order and its slot; only the words changed. **No claim is added anywhere.**

| vid | the shipped claim | disposition |
|---|---|---|
| 1 | *can absorb a sustained crisis out of its own revenue* | **KEPT** — this is K1 |
| 1 | *emergency measures can be paid for* | **KEPT as K1** — it is the same fact under a second wording, not a second fact; it is not restated as its own clause, which would be the summarising second beat R-DA-03 sends to 0.000 |
| 1 | *the garrison can be kept paid while they last* | **DROPPED** — naming a garrison is an INSTITUTION move (MOVE-GRAMMAR §1.2 row 5) licensed by an institution-table row; this pool reads `scoreBand(economicScore)` and nothing else (C-READ), so `institutions.garrison` is not among its reads, and the clause is also a **second fact** under C-NOT. It is a same-entry sibling contradiction waiting to fire (CLERK-LAWS §2.2, C-sibling): the sibling row `Invasion & War`: neither walls nor force renders *no line and no force* on the same entry, and a town can hold `economicScore >= 65` with no garrison at all |
| 2 | *could go through a bad season with its arrangements intact* | **the band half KEPT**; **a bad season DROPPED** (C-NOT names *a season* outright; it is a TIME move under R-DA-16 with no time field behind it) and **arrangements intact DROPPED** (a structural CONSEQUENCE, V2, needing a structural-consequence field the card does not read) |
| 2 | *the people who would have to be paid through one know it* | **DROPPED** — a **standpoint** under C-NOT, a claim about what persons hold in mind: the FEELING non-move (MOVE-GRAMMAR §1.3) and R-DA-14's bar. It also asserts a paid force, which is the garrison claim of vid 1 by another road |
| 3 | *Trouble at {settlement} has not turned into a collapse* | **DROPPED** — a HISTORY move (MOVE-GRAMMAR §1.2 row 2), which exists only on an event-provenance field; R-DA-19 bars it in a STATE pool outright |
| 3 | *the reason is money* | **DROPPED** — a **cause** under C-NOT. The `[counterforce]` angle is kept without it: the money stands against the pressure as a standing fact, not as the reason a past event did not occur |
| 3 | *A town that can pay through a crisis mostly does.* | **DROPPED** — the summarising second sentence R-DA-03 sends to 0.000 and the life-general closer R-DA-12 sends to 0.000; it is the MEANING move, which exists nowhere in the estate; `mostly` is also a rate no field holds |

### C. Walls, checked wording by wording (twelve of twelve unless stated)

- no em dash, no exclamation, no question mark, no digit, no percent;
- no `, which` and no which-clause of any kind (R-DA-03; wall 6);
- no first or second person, no persona, no reader address, no assigned reaction (R-DA-01; A5);
- no future indicative anywhere; the modals are `would` (the subjunctive edge) and `can` / `able to` (capability), both allowed by A2 and R-DA-07 — STATE never FATE;
- no existential `There is` / `It is` opener (R-DA-07);
- no quantifier at all (`every`, `all`, `only`, `none`, `any`, `nothing`, `whatever`), so R-DA-15's `closed`-gated quantifier arm is never engaged and C-REFUSED's totality-over-persons cannot arise;
- no citation, no record holder named (C-SRC, arm A13);
- no pronoun closer (R-DA-04): the twelve terminals are *income · revenue · end · costs · lasts · find · holds · hand · meets · {settlement} · raising · pay*;
- no antithesis or `X, not Y` shape, no `rather than` (R-DA-02): the per-variant antithesis rate is 0.000. A contrast against the sibling bands would have been sibling-licensed and was still not taken, because one instance in a twelve-wording pool measures 0.083 against a ceiling of 0.045;
- one sentence per wording, so the 3+-segment share and the second-sentence-summary figure are both 0.000;
- no gnomic or life-general closer (R-DA-12) — the shipped variant 3 carried one and it is gone;
- **A11 spread: no two of the twelve share their first two words** — *A sustained · Emergencies at · The charge · The town · Hard going · A rough · When things · What a · The pressure · Cost is · Under an · Sustained trouble*;
- word counts 13 · 7 · 21 · 11 | 16 · 11 · 13 · 9 | 16 · 9 · 19 · 10. Mean 12.9; **within-pool sd 4.29** against R-DA-05's floor of ≥ 4.0 and today's measured 2.9. Two wordings under 8 words (0.167 against the ≥ 0.030 floor); none over 30 (0.000 against the ≤ 0.340 ceiling);
- four money nouns and no reuse of one across a variant's faces (*income · revenue · receipts · purse* | *takings · money · money · hand* | *money · cost · money · pay*), against R-DA-10's dispersion floor.

### D. THE THREAD (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1)

1. This pool is a **spine**, so it is written first and modifiers thread off it. Each wording is one sentence, so there is no internal adjacency to fail and no wording turns its subject mid-passage. Every one closes on a standing fact of a civic thing a following modifier can pick up — the money (*income · revenue · purse · takings · money*), the charge (*costs · what a bad turn costs*), or the town itself — so a modifier ordered after the spine by salience can carry a noun forward rather than opening a new subject. None closes on a set-up that only introduces another sentence (wall 7).
2. **Two constructions flagged for the refuter, judged lawful.** (i) *the town purse covers what a prolonged emergency costs* — metonymy of the ordinary civic kind, not a figure: no sense verb on an abstraction and no inanimate acting with intent, which are the two things R-DA-11 names. (ii) *Cost is not what would give way* — an idiom of failing, not a sense verb and not intent; the density law (§21.4) protects compression and idiom that reward the reader, and *unclear* is not a finding unless a law is broken. Both are flagged rather than removed, per §21.3 (where one effort must choose, the licensed wording wins — these are judged licensed).

### E. Sibling distance (arms A1 and A11 — neither restate nor contradict)

1. **The three sibling BANDS of this row.** ADEQUATE / WEAK / CRITICAL own *reserves · fund a short crisis · a few months · chronic shortfall · irregular pay · nothing to spend · exhausts*. Not one of those words appears in any of the twelve. STRONG's twelve own *income · revenue · receipts · purse · takings · to hand · of the town's own raising · able to pay*. In particular no wording says **reserves**, which is the ADEQUATE and WEAK rows' word, and no wording says **a bad season** or **a bad year**, which is why the dropped season of vid 2 was not replaced by a near neighbour.
2. **The four sibling ROWS of DS-DEF-2.** `Beasts & Monsters` and `Invasion & War` own the wall, the line, the perimeter, the force, the garrison, the militia; `Internal Security` owns the court, the prison, the watch, the process; `Disasters & Famine` owns the granary, the store, the hospital, the harvest, the plague. **None of those nouns appears here** — the removal of the garrison (B, vid 1) is the whole of that question, and vid 3 face a's *cost is not what would give way* is scoped to cost so that it neither asserts nor denies anything about the other four rows, which render on the same entry and carry their own bands.

### F. REFUSALS — laws this pool cannot meet, with their measurement

1. **MOVE-GRAMMAR §3.2's distinct-grammar rule is NOT-EXECUTABLE on this card.** *A pool of k variants carries min(k, 8) DISTINCT level-1 grammars.* Under the licensing filter of §1.1 and §3.2 the card holds exactly one non-null read, so **V1 (PRESENT) is the only drawable member**: V2 needs a structural-consequence field, V3 a `none-exists` field, V4 a named object, V5 an institution row, V6 an unresolved state value, V7 is R2 only, V8 a `not-held` field with provenance. The card reads none of them, and §3.2 forbids writing a member the block cannot license. Admissible n = 1, so §2.1's *a tab with n ≤ 2 reports NOT-EXECUTABLE* applies at level 1. **The pool's spread is carried instead** by the angle palette (ledger / street / counterforce), by twelve distinct first-two-word openings, by twelve distinct terminals, by four money-noun families, and by a word-count sd of 4.29. This is a property of any spine card that reads a single band, not of this pool alone.
2. **R-DA-05's sentence-count spread limb cannot be kept.** The shipped pool spread 1 / 1 / 2 sentences; the second sentence was vid 3's maxim, which B removes. A new second sentence would require a second fact, which C-NOT forbids on this spine. All twelve wordings are one sentence. Not a trim under §22 (shortening inside the band is editing; every variant keeps its slot). The lost spread is repaid in word count (range 7 to 21) and in the kind of close.
3. **R-DA-04's vary-the-kind-of-close limb is only partly met.** The closed set is {condition · prohibition · absence · object · a name not given}. With one licensable fact and no `none-exists` or `not-held` field, the ABSENCE close and the PROHIBITION close are unlicensed here, so the twelve divide between the OBJECT close (*income · revenue · purse · takings · hand · money*) and the CONDITION close (*through to the end · while it lasts · already holds · can find · has to hand · able to pay*). Reported as a position inside the band, not cured: curing it would mean writing an absence the record does not hold, which is fault 24 in reverse.
4. **Reported, not cured — the engine's own STRONG string, outside this pool and outside a writer's fence.** `src/domain/display/threatAssessment.js:167` reads *Strong economic base can absorb a sustained crisis. Tax revenue funds emergency measures and sustains garrison pay during prolonged engagement.* It carries the garrison claim of B vid 1, a tax duty with no institution row behind it, and the band word printed raw. It is a live engine string, named here for the chair rather than inherited into the rows.

### G. Round position

Draft round 1, one effort, aimed at the ceiling and not the middle (§21.1, §21.3). The set is submitted as LAWFUL on every wall and on every soft rule measurable on it except refusals F-1, F-2 and F-3, which are unsatisfiable on this card rather than unmet. Exceedance count 3 of the rules measurable here, inside the §16.2 ENTRY budget of two thirds and well inside the POOL budget's third at depth 0 on every band with a figure. No measure was bought with padding (§21.4).
