# DS-DEF-2 · `Economic Survival: STRONG` — REWRITE, draft round 1

Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2, role `spine`, pool key `Economic Survival: STRONG`.
Three variants in, three variants out; same vids, same order, same bracketed tags; none added, none removed, none merged.
Twelve wordings (3 plain + 9 faces). The typed lines of the pool are not repeated here and are not touched.

---

## THE ROWS (complete replacement for the pool's variant rows; paste under the pool's bold heading)

1. `[ledger]` `[plain]` The revenue at {settlement} is greater than the cost of a sustained crisis the town would have to meet.
   - `[face]` Emergencies at {settlement} are paid from income.
   - `[face]` A long emergency at {settlement} draws on what the town earns.
   - `[face]` Crisis spending at {settlement} sits inside ordinary means.
2. `[street]` `[plain]` The town can pay its own way through a hard turn.
   - `[face]` What a crisis costs, the town has.
   - `[face]` When things go badly here, the town is able to meet the cost out of its own earnings.
   - `[face]` Hard going here is a charge the town can carry.
3. `[counterforce]` `[plain]` Money is not what would give way at {settlement}.
   - `[face]` Cost is not the constraint on what {settlement} could bring to a sustained crisis.
   - `[face]` Under sustained pressure {settlement} is carried by its own money.
   - `[face]` Should a sustained crisis come to {settlement}, the town would not have to choose what to leave undone.

---

## --- NOTES

### A. What every wording claims, and the card clause that licenses it

The card holds ONE licensable fact. Every one of the twelve wordings asserts that fact and nothing else, so
arm A6 (the faces claim-equal) holds inside each variant AND across the three variants.

- **THE FACT.** `scoreBand(economicScore) === STRONG` on the Economic Survival readiness row.
- **THE CLAUSE.** Card `may claim:` — *that (=== STRONG) holds, as a STANDING fact of the record*; card
  `reads:` `scoreBand(economicScore)` via `ECONOMIC_ROW_POOL` in `defenseStateProse.js`; card
  `predicate:` `=== STRONG`. Move: PRESENT (MOVE-GRAMMAR §1.2 row 1, a standing configuration field).
- **THE SLOT.** `{settlement}` only, from card `bag: {band: RESERVED, route: proper, settlement: proper}`,
  `FILLED at this block's call sites: {settlement}`. `{band}` is RESERVED and `{route}` is unfilled here, so
  neither appears in any wording. Variant 1 and variant 3 carry `{settlement}` in all four of their wordings;
  variant 2 carries none in all four — each face's slot set equals its parent's (ARCH §2.5, the face refusal row).

Per wording, the claim and its licence:

| vid | wording | the claim asserted | licensed by |
|---|---|---|---|
| 1 plain | *The revenue at {settlement} is greater than the cost of a sustained crisis the town would have to meet.* | the band fact, as a measurement in words | `may claim` + R-DA-11 (a comparison is a measurement in words, never a figure) |
| 1 face a | *Emergencies at {settlement} are paid from income.* | the band fact | `may claim` |
| 1 face b | *A long emergency at {settlement} draws on what the town earns.* | the band fact | `may claim` |
| 1 face c | *Crisis spending at {settlement} sits inside ordinary means.* | the band fact | `may claim` |
| 2 plain | *The town can pay its own way through a hard turn.* | the band fact | `may claim` |
| 2 face a | *What a crisis costs, the town has.* | the band fact | `may claim` |
| 2 face b | *When things go badly here, the town is able to meet the cost out of its own earnings.* | the band fact | `may claim` |
| 2 face c | *Hard going here is a charge the town can carry.* | the band fact | `may claim` |
| 3 plain | *Money is not what would give way at {settlement}.* | the band fact, in negative form (the restraint that does not bind) | `may claim` + the `[counterforce]` angle (§0b: the cap, the prop, the restraint, plainly stated); the modal is subjunctive, so R-DA-07 / A2 (state never fate) holds |
| 3 face a | *Cost is not the constraint on what {settlement} could bring to a sustained crisis.* | the band fact, negative form | as 3 plain |
| 3 face b | *Under sustained pressure {settlement} is carried by its own money.* | the band fact, positive form (the prop) | as 3 plain; `pressure` is the block's own STATE-KEY noun (*the five pressures*) |
| 3 face c | *Should a sustained crisis come to {settlement}, the town would not have to choose what to leave undone.* | the band fact, negative form, in a subjunctive conditional | as 3 plain |

**No wording names a record holder.** The card prints `source: (none) · standing SOURCE-UNRESOLVED` and
*NO citation is licensed: a face naming a record holder here is refused by arm A13*. No face says the books,
the roll, the register, the treasury or the watch. The provenance move (MOVE-GRAMMAR §4.4.3) is not spent, and
§24's ceiling of one citation per unit is unspent at zero, which is the exemplar norm.

**No wording carries a REFUSED COLUMN**: no totality over persons, no exemption from a duty, no named character,
no theological claim. Quantifier words (`every`, `all`, `none`, `only`, `any`) are absent from all twelve, so
R-DA-15's `closed`-gated quantifier arm is not engaged at all.

### B. Walls, checked wording by wording

- no em dash, no exclamation, no question mark, no digit, no percent — twelve of twelve;
- no `, which` and no which-clause at all (R-DA-03, wall 6) — twelve of twelve;
- no first or second person, no persona, no reader address (R-DA-01, A5) — twelve of twelve;
- no future indicative; the two modals used are `would` (subjunctive edge) and `can` / `could` (capability),
  which A2 and R-DA-07 both allow — twelve of twelve;
- no existential `There is` / `It is` opener (R-DA-07) — twelve of twelve;
- no sentence face opens on a `proper`-typed slot of the bag (ARCH §2.5, T-F8): **no wording opens on
  `{settlement}`**. The shipped variant 1 did, and does not now. This also discharges MOVE-GRAMMAR wall 10 and
  R-DA-17 (the town's name is not the default opener) for the whole pool;
- no pronoun closer (R-DA-04): the twelve terminal words are *meet · income · earns · means · turn · has ·
  earnings · carry · {settlement} · crisis · money · undone* — twelve distinct terminals, no pronoun among them;
- no figure, no sense verb on an abstraction, no inanimate intent (R-DA-11). The one comparison (1 plain) is a
  measurement in words, which is the rule's own licensed form;
- no antithesis / `X, not Y` shape anywhere (R-DA-02). The pool's per-variant antithesis rate is 0.000. A
  contrast against the sibling bands ADEQUATE / WEAK / CRITICAL would have been sibling-licensed, and was still
  not taken, because one instance in a three-variant pool measures 0.333 per variant against a ceiling of 0.045;
- no second sentence, so R-DA-03's summarising-second-sentence figure is 0.000 and the MEANING move (which does
  not exist) is not reachable;
- no gnomic or life-general closer (R-DA-12) — the shipped variant 3 carried one and it is gone (refusal 3);
- A11 spread: **no two of the twelve wordings share their first two words** —
  *The revenue · Emergencies at · A long · Crisis spending · The town · What a · When things · Hard going ·
  Money is · Cost is · Under sustained · Should a*;
- word counts 19 · 7 · 11 · 8 | 11 · 7 · 18 · 10 | 9 · 14 · 10 · 18. Within-pool sd **4.18** over the twelve
  wordings (mean 11.83), against R-DA-05's floor of ≥ 4.0 and today's measured 2.9. Per variant: 4.71 / 4.03 / 3.56.

### C. THE THREAD (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1)

This pool is a **spine**, so it is written first and the modifiers thread off it, not the other way round.
Each wording is one sentence, so there is no internal adjacency to fail. Each ends on a noun a modifier can
carry forward — the money (*revenue · income · earnings · means · money*), the charge (*cost · crisis
spending*), or the town itself — so a following modifier can pick up the spine's noun rather than turning the
subject in the middle of the passage. No wording ends on a set-up that only introduces another sentence
(wall 7): every one closes on a standing fact.

### D. REFUSALS — claims removed, and the laws behind each removal

Removal of an unlicensed claim is required by ruling 5 and by R-DA-15's *obeys (6)*: an unlicensed office,
count or exemption **is not a claim the pool was entitled to hold**, so B-CLAIM is not engaged by its removal.
None of these is a trim under §22 — every variant keeps its vid, its tag, its order and its slot; only the
words changed.

1. **REMOVED — the garrison (variant 1, `[ledger]`).** The shipped row read *…and the garrison can be kept paid
   while they last.* Naming a garrison is an INSTITUTION move (MOVE-GRAMMAR §1.2 row 5) licensed by an
   institution-table row; this pool's card reads `scoreBand(economicScore)` and nothing else, and
   `institutions.garrison` is not among its reads. It is also a **same-entry sibling contradiction** waiting to
   fire (CLERK-LAWS §2.2, C-sibling): the sibling row `Invasion & War: neither walls nor force` renders
   *{settlement} has no line and no force* on the very same entry, and a town can hold `economicScore >= 65`
   with an empty `institutions.garrison`. The engine string this pool glosses
   (`threatAssessment.js:181`, *…sustains garrison pay during prolonged engagement*) carries the same defect
   upstream; that is the engine's row, not this pool's, and is named here rather than inherited.

2. **REMOVED — the season and the standpoint (variant 2, `[street]`).** The shipped row read *The town could go
   through a bad season with its arrangements intact, and the people who would have to be paid through one know
   it.* Three removals: **a bad season** is on the card's `may NOT` list explicitly and is a TIME move
   (R-DA-16) with no time field behind it; **the people … know it** is a `may NOT` **standpoint**, a claim about
   what persons hold in mind, which is the FEELING non-move (MOVE-GRAMMAR §1.3) and R-DA-14's bar; and the
   coordinate clause was a **second fact**, which the card's `may NOT` forbids outright on a spine.
   *arrangements intact* is a structural CONSEQUENCE (V2) needing a structural-consequence field the card does
   not read, and is removed with them.

3. **REMOVED — the history, the cause and the maxim (variant 3, `[counterforce]`).** The shipped row read
   *Trouble at {settlement} has not turned into a collapse, and the reason is money. A town that can pay through
   a crisis mostly does.* **has not turned into a collapse** is a HISTORY move (MOVE-GRAMMAR §1.2 row 2), which
   exists only on an event-provenance field; R-DA-19 bars it in a STATE pool outright. **the reason is money**
   is a `may NOT` **cause**. **A town that can pay through a crisis mostly does** is both the summarising second
   sentence R-DA-03 sends to 0.000 and the life-general closer R-DA-12 sends to 0.000; it is the MEANING move,
   which does not exist anywhere in the estate. The `[counterforce]` angle is kept — *the cap, the prop, the
   restraint, plainly stated* — realised as the standing fact in negative form rather than as an event that
   did not occur, because no event field is held here.

### E. REFUSALS — laws this pool cannot meet, stated with their measurement

4. **MOVE-GRAMMAR §3.2's distinct-grammar rule is NOT-EXECUTABLE on this pool.** *A pool of k variants carries
   min(k, 8) DISTINCT level-1 grammars.* Under the licensing filter of §1.1 and §3.2 the card holds exactly one
   non-null field, so **V1 (PRESENT) is the only drawable member**: V2 needs a structural-consequence field,
   V3 a `none-exists` field, V4 a named object, V5 an institution row, V6 an unresolved state value, V7 is R2
   only, V8 a `not-held` field with provenance — the card reads none of them, and §3.2 forbids writing a member
   the block cannot license. All three variants are therefore V1, admissible n = 1, and §2.1's rule
   (*a tab with n ≤ 2 reports NOT-EXECUTABLE*) applies at level 1. **The pool's spread is carried instead by the
   angle palette (ledger / street / counterforce), by twelve distinct first-two-word openings, by twelve
   distinct terminal words, and by a word-count sd of 4.18.** This is a property of a one-field spine card, not
   of this pool alone; it will recur on every spine whose card reads a single band.

5. **A11's sentence-count spread cannot be kept.** The shipped pool spread 1 / 1 / 2 sentences (variant 3
   carried two). A second sentence requires a second fact, which the card's `may NOT` forbids on a spine, and
   the shipped second sentence was the maxim refusal 3 removes. All twelve wordings are one sentence.
   Not a trim (§22: shortening inside the band is editing; the variant keeps its slot). The lost spread is
   repaid in word count (range 7 to 19) and in close kind.

6. **Reported, not cured — the engine's own STRONG string.** `threatAssessment.js:181` reads
   *Strong economic base can absorb a sustained crisis. Tax revenue funds emergency measures and sustains
   garrison pay during prolonged engagement.* It carries the garrison claim of refusal 1, a `tax` duty claim
   with no institution row behind it, and the band word printed raw. It is a live engine string outside this
   pool's rows and outside a writer's fence; named here for the chair.

7. **One construction flagged for the refuter, judged lawful.** Variant 3 face c (*…would not have to choose
   what to leave undone*) carries the mild implicature that there are things to be done in a crisis. It asserts
   nothing beyond the band fact and names no measure, no office and no count; it is the negative of the WEAK and
   CRITICAL sibling bands' condition without taking the `X, not Y` shape R-DA-02 rations. Flagged rather than
   removed.

### F. Sibling distance (arms A1 and A11 — neither restate nor contradict)

Checked against the four sibling BANDS of this pool key and against the four sibling ROWS of DS-DEF-2:

- **ADEQUATE / WEAK / CRITICAL** own *reserves · fund a short crisis · a few months · chronic shortfall ·
  irregular pay · nothing to spend*. None of those words appears in any of the twelve. STRONG's twelve own
  *revenue · income · earnings · means · charge · pay its own way · give way · constraint · carried*.
- **`Beasts & Monsters` / `Invasion & War`** own the wall, the line, the force, the garrison, the militia, the
  perimeter. None appears here — see refusal 1.
- **`Internal Security`** owns the court, the prison, the watch, the process. None appears here.
- **`Disasters & Famine`** owns the granary, the store, the hospital, the harvest, the plague. None appears
  here; in particular no wording says *stores*, *reserves* or *a bad year*, which is why refusal 2's *bad
  season* was not replaced with a near neighbour.

### G. Round position

Draft round 1, one effort, aimed at the ceiling and not the middle (§21.1). The set is submitted as LAWFUL on
every wall and on every soft rule measurable here except R-DA-05's sentence-count spread limb (refusal 5),
which is unsatisfiable on this card rather than unmet. Exceedance count 1 against the §16.1 ENTRY budget;
no measure was bought with padding (§21.4, the density law).
