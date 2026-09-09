# DS-DEF-2 · `Economic Survival: STRONG` — REWRITE, draft round 2

Seat: Opus 5 — Fable-unvalidated. Block DS-DEF-2, role `spine`, pool key `Economic Survival: STRONG`.
Three variants in, three variants out; same vids, same order, same bracketed tags; none added, none removed, none merged.
Twelve wordings (3 plain + 9 faces). The typed lines of the pool are not repeated here and are not touched.

**THE GATE'S TWO ITEMS, ANSWERED FIRST (see §H for the measurement):**
1. `punctuation.colonRate` (over) 6.987 band-widths on 1 of 3 — **CURED. Zero colons in twelve of twelve wordings.**
   The shipped variant 1 carried the pool's only colon (`…out of its own revenue: emergency measures…`); it is gone,
   and no wording replaces it with a semicolon (the pool's semicolon rate is likewise 0.000).
2. REFUSAL — a second bracketed tag on the numbered row — **CURED. Every numbered row carries ONE bracketed tag,
   its own, exactly as it stands.** `[plain]` is not written: the numbered row's own text IS the plain wording.
   Evidence in the lane's own projector (read-only): `VARIANT_RE` (`generate-dossier-state-prose.mjs:228`) admits an
   optional second bracketed tag and `foldTags` (`:345-358`) pushes that tag's angle into `marks`, which is the
   `unclassified: [ 'plain' ]` red. The landed rewritten pools in this same block are written the same way
   (`Beasts & Monsters: plagued, perimeter AND organized force`; `frontier, force without a perimeter`).

---

## THE ROWS (complete replacement for the pool's variant rows; paste under the pool's bold heading)

1. `[ledger]` The revenue of {settlement} stands above the charge that a sustained crisis would lay on the town.
   - `[face]` Emergencies at {settlement} are paid from income.
   - `[face]` A long emergency at {settlement} draws on what the town earns.
   - `[face]` Crisis spending at {settlement} sits inside ordinary means.
2. `[street]` The town can pay its own way through a hard turn.
   - `[face]` What a crisis costs, the town has.
   - `[face]` When a bad stretch has to be paid for, the money is already in the town's keeping.
   - `[face]` Hard going here is a charge the town can carry.
3. `[counterforce]` Money is not what would give way at {settlement}.
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
  `reads:` `scoreBand(economicScore)` via `ECONOMIC_ROW_POOL` in `defenseStateProse.js`; card `predicate:`
  `=== STRONG`. Move: PRESENT (MOVE-GRAMMAR §1.2 row 1, a standing configuration field). Grammar: V1.
- **THE SLOT.** `{settlement}` only, from card `bag: {band: RESERVED, route: proper, settlement: proper}`,
  `FILLED at this block's call sites: {settlement}`. `{band}` is RESERVED and `{route}` is unfilled here, so
  neither appears in any wording. Variants 1 and 3 carry `{settlement}` in all four of their wordings; variant 2
  carries none in all four, as its shipped row carried none — each face's slot set equals its parent's
  (ARCH §2.5, the face refusal row).

Per wording, the claim and its licence:

| vid | wording | the claim asserted | licensed by |
|---|---|---|---|
| 1 plain | *The revenue of {settlement} stands above the charge that a sustained crisis would lay on the town.* | the band fact, as a measurement in words | `may claim` + R-DA-11 (a comparison is a measurement in words, never a figure) |
| 1 face a | *Emergencies at {settlement} are paid from income.* | the band fact | `may claim` |
| 1 face b | *A long emergency at {settlement} draws on what the town earns.* | the band fact | `may claim` |
| 1 face c | *Crisis spending at {settlement} sits inside ordinary means.* | the band fact | `may claim` |
| 2 plain | *The town can pay its own way through a hard turn.* | the band fact | `may claim` |
| 2 face a | *What a crisis costs, the town has.* | the band fact | `may claim` |
| 2 face b | *When a bad stretch has to be paid for, the money is already in the town's keeping.* | the band fact | `may claim` |
| 2 face c | *Hard going here is a charge the town can carry.* | the band fact | `may claim` |
| 3 plain | *Money is not what would give way at {settlement}.* | the band fact, in negative form (the restraint that does not bind) | `may claim` + the `[counterforce]` angle (the cap, the prop, the restraint, plainly stated); the modal is subjunctive, so R-DA-07 / A2 (state never fate) holds |
| 3 face a | *Cost is not the constraint on what {settlement} could bring to a sustained crisis.* | the band fact, negative form | as 3 plain |
| 3 face b | *Under sustained pressure {settlement} is carried by its own money.* | the band fact, positive form (the prop) | as 3 plain; `pressure` is the block's own STATE-KEY noun (*the five pressures*) |
| 3 face c | *Should a sustained crisis come to {settlement}, the town would not have to choose what to leave undone.* | the band fact, negative form, in a subjunctive conditional | as 3 plain |

**No wording names a record holder.** The card prints `source: (none) · standing SOURCE-UNRESOLVED` and
*NO citation is licensed: a face naming a record holder here is refused by arm A13*. No face says the books,
the roll, the register, the treasury or the watch. The provenance move (MOVE-GRAMMAR §4.4.3) is not spent, and
Part B §24's ceiling of one citation per unit is unspent at zero, which is the exemplar norm (0 per 786).

**No wording carries a REFUSED COLUMN**: no totality over persons, no exemption from a duty, no named character,
no theological claim. Quantifier words (`every`, `all`, `none`, `only`, `any`) are absent from all twelve, so
R-DA-15's `closed`-gated quantifier arm is not engaged at all.

### B. Walls, checked wording by wording

- **no colon and no semicolon — twelve of twelve** (the round-1 gate item);
- no em dash, no exclamation, no question mark, no digit, no percent — twelve of twelve;
- no `, which` and no which-clause at all (R-DA-03, MOVE-GRAMMAR wall 6) — twelve of twelve; no relative clause
  of any kind (3 face a's *what {settlement} could bring* is a free relative, not a tail on a noun);
- no first or second person, no persona, no reader address (R-DA-01, A5) — twelve of twelve;
- no future indicative; the modals used are `would` (subjunctive edge), `could` and `can` (capability), all of
  which A2 and R-DA-07 allow — twelve of twelve;
- no existential `There is` / `It is` opener, and no extraposed dummy subject (R-DA-07) — twelve of twelve;
- no sentence face opens on a `proper`-typed slot of the bag (ARCH §2.5, T-F8): **no wording opens on
  `{settlement}`.** The shipped variant 1 did, and does not now. This also discharges MOVE-GRAMMAR wall 10 and
  R-DA-17 (the town's name is not the default opener) for the whole pool;
- twelve distinct terminal words, no pronoun among them (R-DA-04): *town · income · earns · means · turn · has ·
  keeping · carry · {settlement} · crisis · money · undone*;
- no figure, no sense verb on an abstraction, no inanimate intent (R-DA-11). The one comparison (1 plain) is a
  measurement in words, which is the rule's own licensed form;
- no antithesis and no `X, not Y` pair (R-DA-02): the two negations (3 plain, 3 face a) name no rejected
  alternative and take no `but` / `rather` completion, so the pool's per-variant antithesis rate is 0.000;
- no second sentence anywhere, so R-DA-03's summarising-second-sentence figure is 0.000 and the MEANING move
  (which does not exist in the estate) is not reachable;
- no gnomic or life-general closer (R-DA-12) — the shipped variant 3 carried one and it is gone (refusal 3);
- A11 spread: **no two of the twelve wordings share their first two words** — *The revenue · Emergencies at ·
  A long · Crisis spending · The town · What a · When a · Hard going · Money is · Cost is · Under sustained ·
  Should a*.

### C. THE THREAD (owner, 2026-09-08 ~21:4x; MOVE-GRAMMAR §1.4.1)

This pool is a **spine**, so it is written first and the modifiers thread off it, never the other way round.
Each wording is one sentence, so there is no internal adjacency to fail. Each closes on a noun a modifier can
pick up — the money (*revenue · income · earnings · means · money*), the charge (*the charge · what a crisis
costs · crisis spending*), or the town itself — so a following modifier carries the spine's noun forward rather
than turning the subject in the middle of the passage. No wording closes on a set-up that only introduces
another sentence (MOVE-GRAMMAR wall 7): every one closes on a standing fact the table could act on.

### D. REFUSALS — claims removed, and the laws behind each removal

Removal of an unlicensed claim is required by ruling 5 and by R-DA-15: an unlicensed office, count or exemption
**is not a claim the pool was entitled to hold**, so B-CLAIM is not engaged by its removal. None of these is a
trim under Part B §22 — every variant keeps its vid, its tag, its order and its slot set; only the words changed.

1. **REMOVED — the garrison (variant 1, `[ledger]`).** The shipped row read *…and the garrison can be kept paid
   while they last.* Naming a garrison is an INSTITUTION move (MOVE-GRAMMAR §1.2 row 5) licensed by an
   institution-table row; this pool's card reads `scoreBand(economicScore)` and nothing else, and
   `institutions.garrison` is not among its reads. It is also a **same-entry sibling contradiction** waiting to
   fire (CLERK-LAWS §2, C-sibling): the sibling row `Invasion & War: neither walls nor force` renders
   *{settlement} has no line and no force* on the very same entry, and a town can hold a STRONG economic band
   with an empty `institutions.garrison`.

2. **REMOVED — the season, the standpoint and the second fact (variant 2, `[street]`).** The shipped row read
   *The town could go through a bad season with its arrangements intact, and the people who would have to be
   paid through one know it.* **a bad season** is on the card's `may NOT` list explicitly and is a TIME move
   (R-DA-16) with no time field behind it; **the people … know it** is a `may NOT` **standpoint**, a claim about
   what persons hold in mind, which is the FEELING non-move (MOVE-GRAMMAR §1.3) and R-DA-14's bar; the
   coordinate clause was a **second fact**, which the card's `may NOT` forbids outright on this spine.
   *arrangements intact* is a structural CONSEQUENCE (V2) needing a structural-consequence field the card does
   not read, and goes with them.

3. **REMOVED — the history, the cause and the maxim (variant 3, `[counterforce]`).** The shipped row read
   *Trouble at {settlement} has not turned into a collapse, and the reason is money. A town that can pay through
   a crisis mostly does.* **has not turned into a collapse** is a HISTORY move (MOVE-GRAMMAR §1.2 row 2), which
   exists only on an event-provenance field; R-DA-19 bars it in a STATE pool outright. **the reason is money**
   is a `may NOT` **cause**. **A town that can pay through a crisis mostly does** is both the summarising second
   sentence R-DA-03 sends to 0.000 and the life-general closer R-DA-12 sends to 0.000. The `[counterforce]`
   angle is kept — the restraint that does not bind, plainly stated — realised as the standing fact in negative
   form rather than as an event that did not occur, because no event field is held here.

4. **REMOVED — the colon (variant 1).** Not a claim; the gate's own item, recorded here so the removal is not
   read later as a stylistic accident.

### E. REFUSALS — laws this pool cannot meet, stated with their measurement

5. **MOVE-GRAMMAR §3.2's distinct-grammar rule is NOT-EXECUTABLE on this pool.** *A pool of k variants carries
   min(k, 8) DISTINCT level-1 grammars.* Under the licensing filter of §1.1 and §3.2 the card holds exactly one
   non-null field, so **V1 (PRESENT) is the only drawable member**: V2 needs a structural-consequence field,
   V3 a `none-exists` field, V4 a named object, V5 an institution row, V6 an unresolved state value, V7 is R2
   only, V8 a `not-held` field with provenance — the card reads none of them, and §3.2 forbids writing a member
   the block cannot license. All three variants are therefore V1, admissible n = 1. **The pool's spread is
   carried instead by the angle palette (ledger / street / counterforce), by twelve distinct first-two-word
   openings, by twelve distinct terminal words, and by a word-count sd of 3.80.** This is a property of a
   one-field spine card, not of this pool alone; it recurs on every spine whose card reads a single band.

6. **A11's sentence-count spread cannot be kept.** The shipped pool spread 1 / 1 / 2 sentences (variant 3
   carried two). A second sentence requires a second fact, which the card's `may NOT` forbids on this spine, and
   the shipped second sentence was the maxim refusal 3 removes. All twelve wordings are one sentence. Not a trim
   (§22: shortening inside the band is editing; the variant keeps its slot). The lost spread is repaid in word
   count (range 7 to 18) and in close kind.

7. **Reported, not cured — the engine's own STRONG string.** `threatAssessment.js:181` reads *Strong economic
   base can absorb a sustained crisis. Tax revenue funds emergency measures and sustains garrison pay during
   prolonged engagement.* It carries the garrison claim of refusal 1, a `tax` duty claim with no institution row
   behind it, and the band word printed raw. It is a live engine string outside this pool's rows and outside a
   writer's fence; named here for the chair, not touched.

8. **One construction flagged for the refuter, judged lawful.** Variant 3 face c (*…would not have to choose
   what to leave undone*) carries the mild implicature that a crisis has measures to be paid for. It asserts
   nothing beyond the band fact and names no measure, no office and no count; it is the negative of the WEAK and
   CRITICAL sibling bands' condition without taking the `X, not Y` shape R-DA-02 rations. Flagged, not removed.

### F. Sibling distance (arms A1 and A11 — neither restate nor contradict)

Checked against the four sibling BANDS of this pool key and against the four sibling ROWS of DS-DEF-2:

- **ADEQUATE / WEAK / CRITICAL** own *reserves · fund a short crisis · a few months · chronic shortfall ·
  irregular pay · nothing to spend · each season of it*. None of those appears in any of the twelve. STRONG's
  twelve own *revenue · income · earnings · means · charge · keeping · pay its own way · give way · constraint ·
  carried*. No wording says *reserves*, *months*, *shortfall* or *season*.
- **`Beasts & Monsters` / `Invasion & War`** own the wall, the line, the force, the garrison, the militia, the
  perimeter. None appears here — see refusal 1.
- **`Internal Security`** owns the court, the prison, the watch, the process, the purse. None appears here; in
  particular no wording reaches for *purse*, which that row owns.
- **`Disasters & Famine`** owns the granary, the store, the hospital, the harvest, the plague. None appears
  here; no wording says *stores* or *a bad year*, which is why refusal 2's *bad season* was not replaced with a
  near neighbour.

### G. The four faces are not paraphrases of one another (the owner's rule)

Each variant's four wordings take four vocabularies and four rhythms inside one voice, and each stands alone at
the draw:

- **variant 1** — the balanced measurement (*stands above the charge*), the flat short declarative (*are paid
  from income*), the plain present with the earning verb (*draws on what the town earns*), the compressed
  containment (*sits inside ordinary means*);
- **variant 2** — the idiom of paying one's way, the fronted-object inversion (*What a crisis costs, the town
  has*), the long conditional with the sentence's weight at its end (*already in the town's keeping*), the
  charge-and-carry figure of speech that is literally true;
- **variant 3** — the negative standing fact, the negative with the abstract subject (*Cost is not the
  constraint*), the positive prop in the passive (*is carried by its own money*), the subjunctive conditional at
  full length.

### H. The measurement, this round against the last

| measure | shipped rows (what the gate measured) | round 2 | note |
|---|---|---|---|
| `punctuation.colonRate` | 1 of 3 over band, depth 6.987 band-widths | **0.000, twelve of twelve** | the gate's item, cured |
| semicolon rate | 2 of 3 rows | **0.000** | not asked; not reintroduced |
| second bracketed tag on a numbered row | (round 1's refusal) | **none** | the refusal, cured |
| wordings | 3 | **12** (3 plain + 9 faces) | never trim; the count only rises |
| word-count sd over the pool | ≈ 0.5 (24 / 24 / 25) | **3.80** (population; 3.96 sample) | R-DA-05, rhythm follows load |
| word-count range | 24 to 25 | **7 to 18** | |
| distinct first-two-word openings | 3 of 3 | **12 of 12** | A11 |
| distinct terminal words | 3 of 3 | **12 of 12** | R-DA-04 |
| sentences per wording | 1 / 1 / 2 | 1 everywhere | refusal 6 |
| unlicensed claims | 3 (garrison · season+standpoint · history+cause+maxim) | **0** | refusals 1 to 3 |
| citations | 0 | 0 | no source resolves; A13 |

### I. Round position

Draft round 2, one effort, aimed at the ceiling and not the middle (§21.1, §21.3). Both of the gate's owned
failing measures move. The set is submitted as LAWFUL on every wall and on every soft rule measurable here
except R-DA-05's sentence-count limb (refusal 6) and MOVE-GRAMMAR §3.2's distinct-grammar rule (refusal 5),
both of which are unsatisfiable on this card rather than unmet. Exceedance count 2 against the §16.2 ENTRY
budget of two thirds. No measure was bought with padding, and no lawful line was made plainer with no law
behind the change (§21.4, the density law).
