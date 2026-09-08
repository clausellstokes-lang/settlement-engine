# JUDGE 2 of 3 — the composed-prose design run
**Seat: Opus 5 — Fable-unvalidated · 2026-09-07 · read-only throughout; nothing written outside `$SC/arch-prose/`.**

Judge 2's weighting, as briefed: criteria **(2) boundedness** and **(3) migration safety** count **DOUBLE**. Maximum weighted total 100.

## What I executed myself (CONFIRMED)

| command | output I saw |
|---|---|
| `node arch-prose/draw-reroll.mjs` | `708 pools, 2266 variants, mean 3.20`; histogram `2->33 3->547 4->96 5->17 6->15`; 141,600 (seed,pool) pairs; **FLATTENED preserves the semantic variant on 64018/141600 = 45.21 %**; **TWO-LEVEL on 141600/141600 = 100.00 %**; **face-0 share 25.05 %** |
| `git log --oneline -1` in `$SC/laneB6` | `3b1c0eaa5` — the product tip the brief names |
| `sed -n '730,760p' src/domain/display/stateProse/defenseStateProse.js` | `wallRationalePoolKey(walls, monsterThreat, militaryGate, tier)`; `militaryGate < 1` returns `WALLED-STRAINED` **before** `measuredMonsterFamily` is consulted; an unmeasured family returns `null` (silence) on a walled town; the docblock records the ordering as a vetoable JUDGMENT and says *"Say 'veto' to reorder."* |
| a node walk of the six leaves | every variant carries an angle; `ledger 681 · street 609 · visitor 403 · unfolding 230 · counterforce 170 · threshold 96 · elder 70 · canonical 7` = 2,266 |
| `sed -n '247,270p;300,306p' stateProseKernel.js` | `eligibleVariants` filters by `variantIsAudible` **before** `drawVariant` takes `% eligible.length` — so the player face's eligible list is shorter wherever a pool carries a `dm-only` variant, and the drawn INDEX may move even for a public variant |
| `grep -n "angle" tests/data/dossierStateProseProjection.contract.test.js` | two incidental uses only — no contract arm pins the angle vocabulary |

Everything else below is cited to a design document I read whole, to a reader map, or to `file:line`.

---

## THE SCORE TABLE

| criterion | weight | A (data) | B (render) | C (authoring) |
|---|---|---|---|---|
| 1 · coherence with every law in the brief | ×1 | 8 | 7 | **9** |
| 2 · boundedness — linear in authoring | **×2** | 7 → 14 | 7 → 14 | **9 → 18** |
| 3 · migration safety — zero text change, byte-identical | **×2** | **9 → 18** | 6 → 12 | 8 → 16 |
| 4 · testability — every property has an arm that can fail | ×1 | 8 | **9** | **9** |
| 5 · authoring economics under the exemplar law | ×1 | 7 | 8 | **10** |
| 6 · THE PROMISE and determinism | ×1 | 9 | 9 | **10** |
| 7 · completeness across the fourteen sections | ×1 | 9 | 9 | 9 |
| 8 · the owner's want — specificity that grows, nothing stale | ×1 | 8 | **9** | **9** |
| **WEIGHTED TOTAL** | | **81** | **77** | **90** |

**Winner: DESIGN C.** It wins the two double-weighted criteria on the combination of a tighter authoring bound and an honest migration instrument, and it wins criterion 5 outright by the largest margin in the table. Design A is the strongest migration and holds the single best anti-explosion device in the run; Design B is the most legible and the most complete arm inventory. All three converge on the same core (sibling metadata map, nested wordings, two-level roll), so the graft is cheap.

---

## THE REASONING, CRITERION BY CRITERION

### (1) Coherence with every law — A 8 · B 7 · C 9

All three name THE PROMISE, finite semantics, the walls, the register card, B-CLAIM, the audience law, the wiring yardstick and the exemplar-not-the-practical ruling, and all three refuse a render-time model twice over.

**C leads on two counts.** First, the brief's line 32 requires that *"amendments are ratified in a sitting before the kernel car."* C is the **only** design that schedules a sitting — car 4, enumerating the unit-law re-anchor, the R-DA-03 / wall 6 reading, R-DA-20's two SIZE figures, arm J's spec, the connective set with bands, the relation table's sources and the §16.2 composed-unit grain row — with the acceptance criterion *"every strain S1–S20 of `read-specs §9` has a written disposition,"* discharged by an APPENDIX that maps all twenty. A and B both leave the sitting unnamed and discharge the strains inline and incompletely. (C's own sitting sits at car 4, after its kernel car 2; car 2 moves no reader-facing byte, so the mismatch is nominal, but it is a mismatch and I have not scored it as clean.)

Second, C is the only design to notice that **a fragment cannot carry a standpoint angle**. Every one of the 2,266 variants carries an angle (confirmed above), and A's and B's schemas both leave `angle` on a modifier variant, so a fragment would arrive at a joint wearing `[street]` or `[elder]` — a standpoint inside a clause that belongs to the spine's standpoint. C adds `plain` to the §0b palette for `role: modifier` rows only, declares fragments standpoint-neutral by law, and puts the palette amendment to the owner (row 15). C then draws the honest consequence out loud: the composed unit's angle is the spine's, so *this wave buys wording variety and no angle variety* — and names the measured imbalance from its own 200-town run (`visitor 1033 / street 1028 / ledger 946` against `unfolding 34`).

C also discharges W-O3 more cleanly than either sibling: rather than excluding an ABSENCE-move modifier at candidate construction (A's attach-table fact, B's `move[0] === 'ABSENCE'` filter), C **removes `ABSENCE` from the modifier move vocabulary entirely**, on the ground that R-DA-08 makes an absence a replacement never an addition and that V3's LACK class is not demonstrable at all. A class that cannot exist cannot be adjacent to itself.

**A** loses a point for the missing sitting and a point for pushing on the mount law: its §2.7 reservoir act lets a pool of an unmounted block attach as a modifier at another block's mount, licensed by the attach site's bag. A argues this stays lawful because the reservoir block still has no sentence rung of its own, which is a defensible reading of C3 — but B and C both refuse cross-block modifiers outright on the same law, and A is the outlier by argument rather than by measurement.

**B** loses two points. Its DEPTH row is *"spine + ≤ 2 modifiers by seat"* with no cap on FACTS, so a three-fact conjunctive spine (`invasionRowPoolKey(walls, garrison, militia)`) plus two modifiers is five facts in one composed unit — against the brief's DEPTH bound of *"pairs by default; triples only where a frequent pair changes meaning with a third fact; never four."* B never addresses this. And B's C4 carries the DS-DEF-11 re-cut inside a car whose stated acceptance is byte-identical output (see criterion 3).

### (2) Boundedness — the arithmetic really stays linear in authoring — A 7 · B 7 · C 9 (DOUBLE)

This criterion asks whether the design's own numbers survive contact with its own worked examples. Two of the three have a hole.

**A holds the single best anti-explosion device in the run and then contradicts it.** The device is the FACT BUDGET at §4.3: `k ≤ 3 − |meta(spine).reads|`, *"so `invasionRowPoolKey`'s three-fact spines take no modifier at all, which is the right reading of a cell that was hand-authored as a combination."* That is exactly right and neither sibling has it. Beside it A sets `attach.length ≤ 3` as a projector error, echo ≤ 1 per tab, a position budget of two modifier-bearing rungs at multi-rung mounts, and — sharpest of all — a standing refusal that *a `ROLE: spine` pool whose `reads` is a superset of a sibling spine's `reads` in the same block is a finding, WITHHELD to the chair.* That last rule is the only device in the run that structurally forbids a future writer from ever minting another DS-DEF-2-shaped combination cell.

But A's own walls example breaks its own budget. §6.2 gives `WALLED-STRAINED` the reads `{walls, economicGates.military}` (A says so implicitly: `MOD: the country presses` "on THREATENED it would restate (`reads ⊆`)"), so `k ≤ 3 − 2 = 1`. §6.2's arithmetic then attaches **two** modifiers — *"spine 2 variants × 4 faces = 8; clause modifier 3 × 4 = 12; sentence modifier 12; connectives 3 × 3 = 9 ⇒ 8 × 12 × 12 × 9 = 10,368 readings."* The headline figure of A's flagship worked block is computed from a modifier count A's own bound forbids. Read against the code I ran, `wallRationalePoolKey` takes four arguments, so on the key-function reading the budget is `k ≤ −1` and the block takes no modifier at all. A's §6.5 corpus estimate is likewise sized from an assumption ("≈ 4 modifiers per wired block × 53") rather than from the attach bound it just set. The idea is the best in the run; the arithmetic does not yet obey it.

**B states the general law most clearly and enforces the least.** §6.2 is the cleanest statement of the owner's own question anywhere in the three documents: authored pieces `k·(|S| + Σ|V_i|)` — linear in the facts and their values — against hand-authored cells `k·|S|·Π(|V_i|+1)`, the product the owner named. B's capacity rule (2 segments; spine consumes `segmentCount`, clause seat 0, sentence seat 1) is clean and costs no wall amendment, and its `reads`-INTERSECTION rule is stricter than A's subset rule. Its gate rule R1 is a real bar: *"a `**ROLE:**`-less new pool under an existing block that reads ≥ 2 facts FAILS the gate unless it is a TURN with `**EXPLAINS:**`."* But there is no fact cap, no attach-count bound, and no position budget — B's §6.4 reaches the eleven-rung dashboard and waves at it (*"these are ten assertions in a row, and the brief's own point stands"*) rather than bounding it.

**C bounds the thing that actually explodes: the authoring list.** Its §8.4 is a mechanical table in which **each tier row becomes AT MOST ONE list row**, by a fixed rule, with a stated `NO-LIST-ROW` reason for every refusal (wiring first; declared dark; below the floor). A MISSING held fact becomes *one pool per notable VALUE class* — *"2–3 values → 1–2 pools; a band of ≥ 4 values → the two edge bands, never the middle."* A MISSING co-firing PAIR becomes **the two modifiers first**, and a turn *only* where the pair has a registry id. That is the owner's bound enforced at the door rather than at the writer's discretion, and it is the only place in the run where the linearity claim is a procedure rather than an assertion.

Beside it C sets the tightest sentence-level bound of the three: at most two sentences with **at most ONE joint**, and the joint is available only if `!spineHasJoint` — C is the only design that checks whether the drawn spine **already carries** a semicolon or colon before adding one, grounded in the measured 386 semicolon-carrying variants. It adds "the generator refuses `**READS:**` with two paths on a modifier" and "the census prints pieces per field so the chair sees a second modifier on one field."

C's occurrence floor is the only one set against a distribution the author executed: 5 % (10 of 200; ≥ 27 of 525), against its own 200-town run of 56 cells with 9 below ten towns and 4 on every town — and C then discloses the sample's limit itself (*"varies tier only… its 56 cells are a LOWER bound… the number the wave uses comes from car 0 on the golden grid"*). A's 3 % and B's 2 % are both marked ESTIMATE against a 25-town probe run by a reader.

C's worked comparison on the owner's own block is the cleanest linear-vs-exponential demonstration in the run because it is stated in both directions on real pool counts: 24 semantic pieces reaching ~55 state cells, against *"5 spines × 2⁴ modifier states = 80 pools × 3 variants = 240 variants, and every new fact doubles it."*

C's remaining gap, shared with B: no cap on FACTS in a unit, so a conjunctive spine plus two modifiers exceeds the brief's "never four." That is the first graft below.

### (3) Migration safety — zero text change first, byte-identical — A 9 · B 6 · C 8 (DOUBLE)

**A has the best-staged migration in the run, and the sharpest safety argument.**

It splits the migration into two provable halves. **M1** lands the composer path with `poolMeta` absent everywhere and `wordings` absent everywhere, so `drawFace` never hashes and the composer finds no candidates — *the six leaves are byte-identical* and the corpus does not move a byte. **M2** then lands the schema, and the proof is *"the manifest, plus a leaf diff showing only `poolMeta` keys added."* Each half is provable alone. C bundles kernel + composer + generator + `poolMeta` emission + the `DeskLines` key cure into a single car 2; B bundles differently again.

A also states the one argument that makes the sibling-map choice a SHAPE property rather than a property to prove: *"`drawVariant` reads `blockId` and `poolKey` and never a pool's fields, so a `poolMeta` edit cannot move a draw by construction. A nested object would make that a property to prove rather than a shape."* I confirmed the mechanism at `stateProseKernel.js:301-305`. Neither sibling makes this argument, and it is the load-bearing reason the sibling map beats the pool object.

And A alone delivers the owner's example **without a re-key**. Its Phase 1 attaches `MOD: the country presses` to `WALLED-STRAINED` and strikes it on `WALLED-THREATENED` by the restatement bar, so the fact the short-circuit silences is restored with **zero REPLACED cells and no block-level declared shift** — A's Phase 2 re-key is offered as owner-optional (O-10) with the honest note that *"the model does not need it to deliver the owner's sentence — Phase 1 already says both halves of the true pair the docblock at `:737` chose between."* B and C both require the re-key and both create a REPLACED cell class for it. Against the code I read, A is right: the short-circuit does not remove the country fact from the town, only from the pool key, so a modifier restores it without touching the key function.

A's ratchets land at **C1b — before any composer byte**.

**C is close behind and holds the best single instrument in the run.** Its manifest is car 1, before the kernel car, and it reuses the golden master's own 525-row corpus builder so terrain, culture, route and threat all vary — C explicitly criticises its own tier-only probe for not doing this, which is the kind of self-refutation this estate rewards. And C is the **only** design to identify the two-audience control: *"the two audiences differ ONLY on cells whose pool carries a `dm-only` variant — on the player face the eligible list is shorter, so the modulus and therefore the index may move even for a public variant; the count of such cells is printed and pinned, and a difference on any other cell is a leak."* I confirmed the mechanism directly: `eligibleVariants` applies `variantIsAudible` before `drawVariant` takes `% eligible.length`, and 83 `dm-only` variants across 21 wholly-covert pools make this a live class, not a theoretical one. A manifest recorded on one audience would have silently blessed a leak on the other.

C's car 2 acceptance is correspondingly strong: manifest byte-identical on 525 × 2 audiences, plus *"the seven leaves byte-identical after regeneration except the emitted `poolMeta` (printed key-by-key: 0 ADDED / 0 REMOVED / 0 CHANGED pools)."* It loses to A only on the single-car bundling and on needing the re-key.

**B is the weakest here, on two counts.**

Its C4 is *"the migration car,"* acceptance *"BYTE-IDENTICAL dossier output for every seed in the golden sample before any text changes"* — and the same row's build column reads *"DS-DEF-11's key function re-cut per §0 step 2 ONLY IF the manifest proves the re-cut moves zero rows — otherwise the re-cut waits for C6 and is declared."* The re-cut cannot move zero rows: it changes which spine a walled, strained, measured-family town reads, which is the entire point of making the muster a modifier (B's own §0 step 2 says so). B hedges correctly in the second clause, but a car whose acceptance criterion is byte-identity should not name a re-cut in its build column at all; the reader has to disarm the car themselves.

Second, B's ratchets are car **C10** — after the rewrite wave at C7. The size guard therefore arrives after the corpus has grown roughly fourfold, which is precisely the ordering the estate's own hazard list warns about, and it is the one place B is structurally later than both siblings (A: C1b, before anything; C: car 8, explicitly *"rides beside 5–7"*).

### (4) Testability — A 8 · B 9 · C 9

B's §8 table and C's §8.6 table are both complete property→instrument→channel inventories with FAIL / WITHHELD / NOT-EXECUTABLE channels named per row; A's §8.3 is the same shape one notch thinner.

B's inventory is the longest (A1–A12, including the fragment-form arm, the face ratchet, joints-per-unit and the echo budget) and B alone cures the `key={line}` React collision by keying on provenance while also flagging *"the instruments land in the product tree"* as an owner row.

C matches it and adds the finding that decides the schedule: *"none of the above exists in the product tree — there is no `src/domain/prose/` at the product tip… the gate described here can run in CI only after the INSTR-912 instruments LAND, so the sequence puts the landing before the first authoring car. Until they land, the wave's gate is a lane tool run by hand and its verdicts are receipts, not green."* That is the false-green class named and scheduled rather than assumed away, and C's car 3 does the landing before car 5's wave. C also requires every arm to declare NOT-EXECUTABLE where its input is absent, *"never `[]`"* — the §908 law applied to the new arms rather than only inherited.

Both B and C carry the composed anti-vacuity control (a planted composition that manufactures a C2 duty+exemption pair from two innocent pieces); A carries it too.

### (5) Authoring economics under the exemplar law — A 7 · B 8 · C 10

This is C's lead and it wins decisively.

The **LICENCE CARD** (§8.5) is the best single artifact produced anywhere in this run. It is the machine-readable form of the annex's prose licence — the 68 STATE-KEY, 22 ENTAILMENT and 23 PROVENANCE lines the projector drops today — handed to the writer per list row with `reads` (and its absence semantics: *"absent when there is no paid stack — absence is NOT 'fully funded'"*), `predicate`, `bag` with shapes and conditionals, `relation` **with its edge cited to `defenseGenerator.js:189-191`**, `move`, `grammar`, and two plain-English lines: *may claim* and *may NOT*. It ends with the two licences no writer ever receives — a totality over persons and an exemption from a duty — *"printed as refused columns so a fluent writer does not reach for 'every household' or 'exempt from the toll'."* The estate's three questions are asked ON the card rather than in the writer's head. A and B both describe per-piece licensing as a set of annex lines the writer types; only C hands the writer something before they write.

Around it: the mechanical tier→list table (criterion 2); *"what a writer produces is annex rows, never leaf bytes"*; and a refusal protocol — *"a writer who cannot produce a lawful row for a list entry writes a REFUSAL row with the measurement,"* which the chair reads at the sitting.

C is also the only design that notices the corpus contains rows that **cannot be re-voiced at all**: the 7 `canonical` variants (byte-copies of engine strings) and the 2 live-string-bound rows at `economy.generated.js:1007` and `:1035`, because re-voicing a bound engine string forks the string. They are printed in the wave's list as `NO-FACES: bound`. A and B both size the wave at 2,266 × 4 with no exception; C's arithmetic says *"2,266 × 4 = 9,064 wordings less the 9 bound rows."*

On the exemplar law specifically, C is the most careful: the composed unit is walked as an ENTRY grain (2/3, 1.75) *"because it is what a reader meets"*, the numbers are labelled PROVISIONAL on one author with the re-measurement named as the owner's on cost and IP, and the **sibling-distance floor is measured before it gates**, with the owner shown *"the number and the four faces it would refuse"* (row 7). A carries the same provisional caveat; B carries it in one line.

### (6) THE PROMISE and determinism — A 9 · B 9 · C 10

All three take the two-level roll on measurement, key the face on a `::w` **suffix** of the parent key (so the parent hash is a different string and cannot move), enumerate every new key as a seed input from birth, and pair "never trim" with "never append after the freeze."

C edges ahead on three things. It states plainly **what Shift 1 reverses**: *"the FIRST change in this corpus's history that deliberately changes what an existing pool draws for an existing world"* — the three content-train cars each landed as wholly new blocks to avoid exactly this. It makes the face count a **ratchet arm** (a face-count PIN per pool that reds outside a declared shift) rather than a convention. And its §7.3 REPEAT CENSUS is the most operational answer to the owner's *"repeated only because the instance repeated"*: distinct texts ÷ towns per state cell against a **computed chance floor** given the piece counts (1/12 for a bare 3×4 spine; 1/432 with one modifier and a joint), where *"a mount whose collision rate sits ABOVE the floor is a finding — an authoring row, never a draw change,"* and a mount at the floor is the owner's sentence made exact.

C also answers a question A and B leave open (read-facts Q6): a candidate modifier whose pool partitions itself by a demoted dimension the caller has not answered goes silent **by itself**, the spine untouched, because `poolDimensions` is per pool.

B's distinctive contribution is naming the `NORM_TABLE` a seed input the day it ships (§13 row 4) — a re-measured norm re-orders modifiers on installed worlds. A freezes occurrence per wave and C freezes `rateBp` at the freeze; the substance is the same but B says the hazard out loud.

A's honesty about its salience limit is worth recording: *"ties are common… and the seeded tie-break is what makes two towns with the same facts foreground differently — and ONLY ties do, which is stated as a limit rather than hidden."* C's band scheme (NOTABLE vs ORDINARY, seeded permutation within a band) makes the seed matter over a wider class than A's tie-break does, which is a better answer to the brief's SALIENCE row; B states the same concern and defers the tie rate to a printed measurement.

### (7) Completeness across the fourteen sections — A 9 · B 9 · C 9

All three carry all fourteen sections with no blanks. A and B follow the brief's numbering; C re-orders (§8, §12, §13 lead, then the rest in the brief's numbering) and says so up front, with two limbs declared as refusals with reasons and an appendix mapping S1–S20. B adds a §0 walked render before §1. None is short-changed; I decline to separate them here.

### (8) The owner's want — A 8 · B 9 · C 9

**B's §0** is the most legible demonstration of the want in the run: a real town with real field values walked through eight steps, including the covert/player split, and closing on the sentence that answers "nothing will ever be stale" better than any argument in the three documents — *"when the covert watch is exposed (a `revealed` impairment lands), the modifier's key changes from covert to revealed — a different pool, a different draw, a sentence that changed because the world did."* If the owner walks one page of this run, it should be that one.

**C's §6.2** is the most precisely grounded: an executed dump of the block's pools, angles, sentence counts and word counts; the annex line range; and — checked against the code I ran — the correct reading of the branch A and B both gloss, that an unmeasured monster family returns `null` on a walled town, which is why C's re-key *"keeps the STRAINED pool as the spine only where no family is measured"* rather than retiring it. C also reads the owner's "granaries are lacking" correctly where the others reach for the building: `stores: short` reads `foodSecurity.label ∈ {Deficit, Deficit × Active Famine}` — *"PRESENT of a short stock, never the ABSENCE of a granary"* — which is both the owner's actual fact and a dodge of the ABSENCE-move refusal.

**A** delivers the want with the least disturbance (Phase 1, no re-key) and includes an instructive worked REFUSAL — the DS-GEN-3 narrow-approach modifier struck by A's own echo rule because `tradeRouteAccess` is already a spine at `overview.origin` on the same tab, *"kept here as the worked refusal."* That is the right instinct. It loses a point because its headline arithmetic rests on the modifier count its own bound forbids.

---

## THE BEST IDEAS THE WINNER LACKS (to be grafted onto C)

**From A:**

1. **The FACT BUDGET on a conjunctive spine** — `k ≤ 3 − |spine.reads|`, so `invasionRowPoolKey(walls, garrison, militia)` takes no modifier at all. C (and B) bound PIECES and SENTENCES but never FACTS, so a three-fact spine plus two modifiers is five facts in one unit, against the brief's "never four." Graft the rule — and fix A's own misapplication: A's §6.2 attaches two modifiers to a spine its rule allows one.
2. **The superset refusal as a permanent anti-explosion bar** — a `role: spine` pool whose `reads` is a superset of a sibling spine's `reads` in the same block is a WITHHELD finding at the gate. C's tier list is *the only door* for this wave; A's rule keeps the door shut after the wave ends, when the list is gone and a future writer reaches for another DS-DEF-2 cell.
3. **The two-car migration split** — M1 (composer path lands; SIX LEAVES BYTE-IDENTICAL; zero corpus bytes) separated from M2 (schema lands; ADDED KEYS ONLY, with a key-by-key leaf diff as its own proof). C's car 2 bundles kernel, composer, generator, `poolMeta` emission and the `DeskLines` key cure; A's split makes each half provable alone and is the more conservative landing.
4. **The multi-rung POSITION BUDGET** — at a mount drawing more than two rungs (`overview.systemsHealth` up to 11, `faith.patronSeat` 8, five mounts at 5), at most TWO rungs carry modifiers, the two highest-salience pairs, ties by the salience key. C's echo rule bounds a FACT across blocks but nothing bounds how many of eleven rungs at one position grow a clause.
5. **The walls delivered additively, with no re-key** — A's Phase 1 restores the fact the short-circuit silences by attaching `MOD: the country presses` to `WALLED-STRAINED` and striking it on `WALLED-THREATENED` by the restatement bar. Zero REPLACED cells, no block-level declared shift, and the owner's own sentence lands. Take this as the first landing and hold C's car-6 re-key as the owner's optional Phase 2 (A's O-10).
6. **"The draw cannot move by construction"** — `drawVariant` reads `blockId` and `poolKey` and never a pool's fields, so a `poolMeta` edit cannot move a draw. C should state this as the reason the sibling map beats the pool object; it converts the migration's central claim from a property to prove into a shape.
7. **The reservoir ATTACH act** — the 448 authored, licensed variants in the 15 unmounted blocks named as an explicit modifier reservoir (`**ATTACH:** DS-XXX-N:<key>`, licensed by the attach SITE's bag, `UNMOUNTED_BLOCKS` untouched because the block still has no sentence rung). C refuses cross-desk reservoirs in wave one; graft A's shape as the *named* wave-two form rather than an unnamed deferral, so the 448 are a scheduled asset instead of a standing debt.

**From B:**

8. **The `NORM_TABLE` as its own generated leaf, named a seed input the day it ships** — `src/data/proseNorms.generated.js`, `--check`-pinned, changed only in a declared car, *because a re-measured norm re-orders modifiers on installed worlds.* C freezes `rateBp` inside `poolMeta` but never says that re-measuring it is itself a declared text shift.
9. **The SEAT rule tied to the licensed level-1 order** — clause seat ← `consequence` ONLY, *because PRESENT → CONSEQUENCE is the register's own V2 order and a consequence is not a second fact but the standing cost of the first*; sentence seat ← tension / contrast / addition; and a modifier is AUTHORED for its seat (`form: fragment` vs `form: sentence`) so no piece is ever bent to fit. C derives capacity from `spineSentences` and `spineHasJoint` but leaves the seat/relation pairing implicit.
10. **A relation that flips with the spine's polarity** — a food deficit is `tension` on a high-rung prosperity spine and `addition` on a low-rung one; since `relation` must stay fixed per pool for the walker to check it, a flipping relation is TWO pools and the desk keys the one whose polarity matches the spine. Neither A nor C sees this case, and it is common (B found it in DS-ECO-1).
11. **The general law as a formula, stated once** — authored `k·(|S| + Σ|V_i|)` against hand-cut `k·|S|·Π(|V_i|+1)`. C proves linearity per block; B proves it in general, which is the form the owner's "which would need to be bounded" actually asks for.
12. **Echo on the PRODUCER TOKEN, never the corpus word** — B's answer to the two-vocabulary hazard (`prosperity` keyed seven ways on DS-ECO-8 and five on DS-GEN-3), citing the label trap at `dossierMounts.js:73-88` where three producer/corpus mismatches already darken two of fifteen crisis banners with no error anywhere. C's echo rule keys on `(field, value)` and would mis-join across the two vocabularies silently.
13. **The walked render as the document's own lead** (B's §0) — a real town, real field values, eight numbered steps, ending on the world changing the sentence. The owner's walk is a scheduled acceptance in every one of these designs; this is the page it should open on.

---

## Two corrections I owe the chair

1. **A's headline walls figure (10,368) is computed from a modifier count A's own fact budget forbids** (§4.3 against §6.2). The budget is the better idea and should survive; the figure should be recomputed after the graft.
2. **B's C4 names a key-function re-cut inside a car whose acceptance is byte-identical output.** Whatever design wins, no car may both re-cut a key function and claim byte-identity; the re-cut belongs in a declared-shift car with an ADDITIVE/REPLACED classification per cell, which is where C puts it (car 6) and where B's own hedge points.

Nothing in this document rules; the chair rules. Every figure above is either from a command whose output I saw and quoted, or cited to the file and line that carries it.
