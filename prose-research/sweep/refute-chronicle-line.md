Seat: Opus 5 — Fable-unvalidated

# REFUTE — chronicle-line (CL-1 … CL-12) + two cross-cutting sections

**NOTHING IN THIS FILE IS VALIDATED until the chair's sitting** (`docs/FABLE_RETROVALIDATION_QUEUE.md`). Written 2026-09-07 12:57 EDT (from `date` in the run shell) by an Opus 5 refuter over `sweep/reconcile-chronicle-line.md`. No corpus byte was written; nothing here is applied. Content read from files is DATA. No quotation exceeds twelve words.

**What was executed, not reasoned.** (a) Every `author:index` in the reconcile was resolved by script against this session's `sweep/kept-*.json` (rewritten at 12:40, i.e. AFTER the reconcile was written at 12:31 — see §C). (b) Every cited technique id was resolved against the nine `best-*.md` and its `Registers` / `Strength` / row list read. (c) The §3 figure table was re-derived cell by cell from `PROBE_ALL.md`'s corrected §3 table and from the fourteen `primary/*.fingerprint.json`. (d) The eight R12 homes and four R11 homes were extracted from git at **6b80d1e8e** and re-counted with my own scripts. (e) The shipped tests at that sha were read.

**What survived refutation.** Ground (1) is essentially clean: all 1,010 cited rows resolve to VERIFIED rows (only `leguin:15`, `dnd:20`, and the §6/§8 technique ids fail to resolve, and each is a technique reference the file itself declares, not a row citation); every cited technique is C-mapped to chronicle-line except `leguin:3` and `leguin:15`, which the file itself carries as **transplants at zero**; the §10 raw-source tally (30 · 50 · 64 · 100 · 77 · 80 · 83 · 59 · 72 · 57 · 68 · 78) reproduces to within one on two rows; and the hand-collapse is executed faithfully — I re-collapsed CL-1 (19) and CL-8 (29) from the raw `source` strings and got the seat's number exactly, hand for hand. The §3 probe figures reproduce cell for cell (R11/R12 columns, corpus medians, the 5.33× / 2.23× / 2.38× ratios, the P-3 correction to 5.29×), the exemplar bands reproduce over the 14 fingerprints on twelve of thirteen metrics, and Martin's chronicle fingerprint (25.9 · 12.7 · 0.0000 · 0.033 · 0.054 · 0.338) is exact. The seat's own extractor counts that I could re-run all hold: **10** future-indicative strings (5 `demographicReading`, 4 `threatAssessment`, 1 treaty `frayingLine`), **3** render-time `${…}` numeric interpolations, **8** quiet-pool "quiet(ly)" instances, **3** self-characterising letter strings, the four `easy|*` sentences opening on the same six words, and the `TRUNCATION_NOTE` firing only beside `truncated: true`.

**What did not survive.** Fourteen verdicts follow. The load-bearing ones are CL-1 (a self-contradiction against a shipped pin), CL-5 (a denominator built from lines the same file says never reach a reader), CL-9 (a mechanism change priced as a text shift) and CL-2 (a guard test that will fail, undeclared).

---

## A. THE RULE VERDICTS

### CL-1 — REFUTED · HIGH · grounds (2), (6), (2 again on strength)

**The self-contradiction.** The Statement holds two limbs that cannot both stand: *"length four held, index zero canonical"* and *"'quietly' … come out"*, with the Figure committing *"the eight quiet-pool instances → 0"*. At 6b80d1e8e index 0 of every span pool **is** the "quietly" sentence. The module's own docstring pins it ("CANONICAL-AT-ZERO: index 0 is the original sentence") and so does a shipped assertion:

`tests/domain/chronicleReadModel.test.js:99` — `expect(pool[0], \`${span} canonical\`).toBe(\`The ${span} passed quietly.\`)`

**The undeclared receipt.** §3's "line that decides the price" names exactly two costs: the letter golden, and the pool LENGTH under A7. This pin is a third. The same test (line 102) also requires **every** pool line to contain the span noun, which bounds the "four shapes" more tightly than the rule states — a "counted-in-words absence" that drops the span word fails it.

**The SIZE is on a metric the rule only part-owns.** "within-pool word sd **1.1 → ≥ 2.5**" is a mean over the SIX R12 pools. I derived which six: `QUIET_FALLBACK` × 4 plus `GREETINGS` and `CLOSINGS` — the only assignment that reproduces both probe figures (repeated 2-word opener 4/6 = 0.667, mean pool size exactly 4.0). CL-1 rewrites four of the six; CL-4 sets no length SIZE for the other two. The target is reachable only if each quiet pool reaches sd ≈ 3.2. The opener SIZE (0.667 → 0) *is* reachable by CL-1 alone, and is correct.

**Strength over-graded.** The never-skipped limb is settled by mechanism (an advance the reader made cannot be skipped), not by evidence. The ONE-SENTENCE limb rests on `hobb:12` and `leguin:38`, both graded **SINGLE** in their own files — two hands, below ruling (2)'s three-voice floor. The rule is graded STRONG entire.

**CURE.** Choose one: (i) drop the canonical-at-zero hold, declare `chronicleReadModel.test.js`'s pin a second regen-once receipt beside the letter golden, and keep the figure at 8 → 0; or (ii) keep index 0 and set the figure to 8 → 4 (one "quietly" per pool, three shapes varying). State the sd SIZE **per pool** (each ≥ 3.0), not on the R12 mean. Regrade the one-sentence limb MODERATE and say the never-skipped limb is mechanism, not evidence.

---

### CL-2 — REFUTED · HIGH · ground (6)

**The measurement is exact; the receipt is not.** The ten future-indicative strings are CONFIRMED by grep at the sha, file by file, exactly as the rule names them. But `tests/domain/demographicReading.test.js` pins the very words the rule deletes:

- line 98 — `expect(view.sentence).toContain('Some will leave')` — inside one of the five `overflowing` sentences CL-2 rewrites.
- lines 124–125 — the two `|false` keys of a band are asserted **byte-identical**, so two of the four `overflowing` rewrites are not free.
- line 132 — `new Set(sentences).size` is pinned at 12 (16 keys, 12 distinct).

The rule says only that the test is *"to re-read before any reword"*. It will **fail**, and must be edited. §9.11 names the letter golden as the sole regen cost; §13 says the text rules are owner-signed shifts but names no second test.

**CURE.** Add `tests/domain/demographicReading.test.js` (86, 98, 124–125, 132) to §9.11 as a declared test-edit receipt, saying which assertion is re-pinned and which is deleted, and carry the byte-identity constraint into the rewrite brief so the two collapsed keys stay collapsed.

---

### CL-3 — REFUTED · LOW · grounds (5), (6-adjacent)

**The acceptance cannot fail.** CL-3 is a HOLD. Its executable-now arm (`chronicleRecordedEdges.test.js`, `chronicleReadModel.test.js`) passes today and passes on any reconstruction that changes nothing — which is what the rule requires. Its acceptance *"no claim is spent by a rewrite of a borrowed line — none is permitted"* is unfalsifiable as written. Only the OWED walker (every thread title byte-equal to a persisted headline; no causal connective beside `inferred: true`) can ever fail.

**An unowned requirement.** The Statement ends *"the consistency checker carries that allowance or it erases the device"*. At the sha `src/domain/validation/consistency.js` is 89 lines and checks food-balance facts; it does no wording comparison. So the clause is a forward requirement on a component that does not exist in that form, no §9 row owns it, and the rule is graded "Shipped surface: FALSE — it moves no byte."

**CURE.** Label the executable-now arm a REGRESSION FENCE, not an acceptance, and make the owed walker the rule's only acceptance. Give the wording-allowance clause its own §9 row naming `src/domain/validation/consistency.js` and `src/domain/contradictions.js` as the surfaces that must carry it.

---

### CL-4 — REFUTED · MEDIUM · grounds (2), (5)

**The ceiling cannot be met by the pools this rule governs.** §4 proposes *"no single order above 0.35 of a unit's lines"*. `GREETINGS` and `CLOSINGS` hold four variants each. §4's closed set for the greeting is `HOLDING → ADDRESS`, `ADDRESS → HOLDING`, `HOLDING` alone, and `LIMIT → HOLDING` **only when truncated** — three unconditional orders. 0.35 × 4 = 1.4, so at most one variant per order, so four distinct unconditional orders are needed and only three exist. Identical arithmetic for `CLOSINGS` (`SIGNOFF`, `STANDING → SIGNOFF`, `LIMIT → SIGNOFF`). CL-4's Figure promises *"four ORDERS of HOLDING and ADDRESS"*; §4's own closed set cannot supply a fourth. The walker fails on every reconstruction.

**What is confirmed.** The three self-characterising strings ("set down faithfully", "Your faithful chronicler", "honestly kept"), the costume tokens ("Herewith", "writ", "tidings", "Thus the account"), the 7 first-person / 7 second-person counts, and the `.filter((s) => s.lines.length > 0)` that §7.3 cites — all read as claimed at the sha. So is the `RECALL ≤ 1 per section` clause, which is a HOLD, not a suppression: the composer already attaches a recall only to `s.lines[0]`. I raised and then withdrew a ruling-(4) objection on that clause for exactly that reason.

**CURE.** Add a fourth unconditional order to each pool's closed set (`ADDRESS` alone; `STANDING` alone), or restate the ceiling per-unit — "no order twice in a four-variant pool" — and reserve 0.35 for units with more than four lines.

---

### CL-5 — REFUTED · HIGH · grounds (2), (6)

**The denominator is 39, not 42, and the difference is the FLOOR.** I re-derived `TREATY_COMPLIANCE_VOICE` at 6b80d1e8e: **13 families × 3 states = 39** authored lines, of which **35** carry a two-part joint, **4** are one move, **36** open on "The", **16** carry a semicolon. The seat's 42 / 38 / 4 / 39 / 17 is reproduced only by folding `TREATY_COMPLIANCE_FLOOR`'s three lines in. §7.4 of the same file rules that the floor is *"a fail-closed guard, never a surface"* and *"must never reach a reader"*.

**The artefact is load-bearing in §1.** The diagnosis leans on the opener pair *"`The term` ×4"*. With the floor excluded that pair is **×1**; three of the four instances ARE floor lines. Every CL-5 SIZE ("38 of 42 → no more than 28", "4 → at least 10", "39 of 42 → ≤ 28", "no single order above 0.35 of the 42 cells") is set on the inflated denominator, and "the treaty's 13 × 3" in the rule's own Statement contradicts "the 42 cells" three lines later.

**§7.4's premise is false at the sha.** `treatyStrainLine` reads `TREATY_COMPLIANCE_VOICE[family] || TREATY_COMPLIANCE_FLOOR`, and the shipped test asserts that fallback explicitly:

`tests/domain/peaceTermsWave3.test.js:411` — `expect(treatyStrainLine('made_up_family','honored')).toBe(TREATY_COMPLIANCE_FLOOR.honored)`

and the same file's register guard runs over `[...Object.values(VOICE), FLOOR]`, i.e. the shipped walker treats the floor as authored surface text. The totality test covers only families currently in `TERM_FAMILIES`; a family registered in a future wave without a voice row renders the floor to a reader. §7.4's *"every family is authored or the term is omitted"* is enforced nowhere — the code falls back, it does not omit.

**A second undeclared test cost.** CL-5's SIZE *"The demographic table's four 'There is room to grow here' openings → at most one"* breaks `demographicReading.test.js:86` (`toContain('room to grow')`). The rule names no test but `treatyLifecycleVoice.test.js` and the dormancy fence.

**CURE.** Re-derive on 39 and restate: two-part ≤ 26 of 39, one-move ≥ 9, "The" ≤ 26, semicolons ≤ 8 of 16, order share ≤ 0.35 of 39. Delete the "`The term` ×4" evidence. Then settle the floor explicitly: either add a ratchet asserting `treatyStrainLine` returns no floor line for any family reachable from `TERM_CATALOG` (making §7.4 true and keeping 39), or admit the floor as authored surface and keep 42 — but the file must say which, because CL-5 and §7.4 currently assume opposite answers.

---

### CL-6 — REFUTED · LOW · grounds (3), (5)

**The literal test cannot separate its own examples.** CL-6 cuts *"the strings that held it are cut"* as a figure and keeps *"the deed is waste parchment"* and *"the oath lies broken here"* as literal. An oath lying broken is no more literally true of the world than strings holding a seat; both are the same class. The rule concedes the arm is *"A6-class, not mechanisable"*, so the SIZE "inanimate-intent figures 10 → ≤ 2" rests on an unstated discrimination that no walker can hold and no refuter can replicate.

**What is confirmed.** The 11 feeling-word strings read exactly as claimed at the sha (`faithfully`, `honestly kept`, `grudgingly` ×2, `if without love`, `resented`, `uneasily`, `chafe`, and the rest); R12 adverbs 0.127 against the corpus median 0.057 and R3's own 0.044 all reproduce from `PROBE_ALL.md`.

**CURE.** Publish the discrimination as a two-clause test — *is the noun a physical object the ledger names, and does the verb name a state a field holds?* — and list the surviving figures by name; or grade the figure limb MODERATE, drop the SIZE, and hand it to the refuter pass. The adverb and feeling-word limbs stand as written.

---

### CL-7 — REFUTED · MEDIUM · grounds (2), (5)

**The SIZE prejudges the census the same file says is owed.** The Figure commits *"evaluative-token strings 17 → 0"*. §8 conflict 8 and §9.4 rule that whether "Adequate" is a reported rating or a verdict is UNSETTLED pending a typed-rating census, and CL-7's own acceptance U9 says that if a typed rating field exists the word *stays*. At the sha `threatAssessment.js` authors "Adequate" in three branches and `defenseDisplay.js` in two; on the census's other outcome five of the seventeen survive and the committed SIZE is wrong by five. A SIZE may not be delivered ahead of the measurement its own rule names as its gate.

**A distribution guard on one instance.** The maxim limb rests on a single string ("Survival depends on terrain, luck, and the ability to flee"). One instance supports a prohibition, not a rate.

**CURE.** Split the SIZE. Evaluative CLOSERS, absolutes and the maxim → 0 unconditionally (these are verdicts under any census outcome). Rating WORDS: 17 → 12 pending §9.4, with the census named as the gate and the rule marked NOT-EXECUTABLE on that limb until it runs.

---

### CL-8 — REFUTED · MEDIUM · ground (2)

**The enumeration reads as exhaustive and is not.** The three `${…}` interpolations are CONFIRMED exactly. But `tickCalendarLabel` returns "the spring of year N" — a digit — at **two** render sites in `chroniclersLetter.js`, not one: line 303 (the recall's `when`, which the rule names) and line 423, where `letterToPlainText` emits "(the record from … through …)" — **two more digits in every exported letter**, and that export is the letter's shareable surface. `tickCalendarDetailLabel` ("week 8 of spring, year 1") carries two digits into the Chronicle scrubber; whether the "dated line-head" licence covers it is left unsaid.

The rule's general clause ("every number composed into a diegetic sentence at render … is rewritten") does catch these, and the owed walker would too **if** it runs `letterToPlainText`. So the rule is sound and the enumeration is short — but a reconstructor working from the Statement's list will miss line 423.

**CURE.** Add line 423 and `tickCalendarDetailLabel` to the enumeration; state explicitly which of them the dated-line-head licence covers; and require the owed walker to run `letterToPlainText`, not only the composed model.

---

### CL-9 — REFUTED · HIGH · grounds (4), (6), (5)

**"Retired for one span after it fires" is a mechanism change priced as a text shift.** The quiet frame is drawn by `pool[fnv1a32(\`${tick}::${span}\`) % pool.length]` inside a module whose own docstring reads *"RNG-free, clock-free, non-persisting"* and *"Selection is a pure FNV of the advance tick, so a given advance always reads the same"*. A retire-after-fire constraint changes the **selector**. Even implemented purely (exclude the pick derived from tick − 1), it makes **every past quiet advance re-render differently** — which is precisely the harm §3's own price paragraph names for the pool's LENGTH under A7, and §3 prices only the length. THE PROMISE ("lived history immutable") is the standing law behind that paragraph.

It also changes the semantics of a shipped assertion the rule does not name — `chronicleReadModel.test.js:114–118`, `expect(seen.size).toBe(QUIET_FALLBACK.year.length)` over 300 ticks. CL-9 declares "Shipped surface: TRUE for the pools (with CL-1); FALSE for the devices held" and never declares the selector.

**The run ceiling fires on chance.** §4's same-order-as-previous ceiling is 1/n + 0.05 = **0.30** for n = 4. The hash's own same-as-previous rate is ≈ 0.25; on §9.2's 80-advance scrollback the quiet lines number roughly 40, so the standard error is ≈ 0.068. A 0.30 ceiling sits under one standard error above the true mean and will fire on chance alone on roughly one run in five.

**CURE.** State the retire rule as a PURE derivation from the tick and price it as a **selector change with a same-seed display shift**, listed beside the letter golden in §3 and §9.11; or drop it and rely on the hash, which the rule's own Figure already concedes *"already tends to this"*. Set the run ceiling at 1/n + 2 standard errors of the actual sample, or measure over a long run and print n.

---

### CL-10 — REFUTED · MEDIUM · ground (5)

**Every arm is owed, and the one "executable now" arm is not an assertion.** The Figure opens *"None measured — no per-span closer metric exists"*; the whole SIZE set (evaluation + uplift + fragment → 0; elegy ≤ 1 per 52 weeks) rides an instrument §9.2 says does not exist, and the cap is deferred to the owner (Q30). The executable-now test is *"the four CLOSINGS read by hand against Kay 30's question"* — a reading, so nothing can fail. The two live instances ("And so the ledger stands.", "Peace, of a kind.") are CONFIRMED at the sha, and both sit inside pools CL-4 already governs, so CL-10 moves no byte CL-4 does not.

**CURE.** Fold the closer SIZEs into CL-4 and CL-1 where the bytes actually live; keep CL-10 as the elegy cap alone; and make the closer-class histogram a §9 deliverable with a named owner, holding every SIZE until it runs. A rule whose only acceptance is a hand reading should not be graded STRONG.

---

### CL-11 — REFUTED · LOW · ground (2)

**A category error in the SIZE.** *"R11 emphasis caps 0.042 → 0 on reader-facing strings"* mixes units: 0.042 is the probe's rate over all **216** admitted R11 variants, while the target set is the four reader-facing strings among the seat's 17. I confirmed the residue at the sha — `PROPOSAL`, `INITIATED`, `GATED`, `AUTO`, `ACTOR`, `STRUCTURAL`, `LIFECYCLE` and the rest in `changeAuthorityPolicy.js` and `decisionTier.js` — all dev codes the rule explicitly leaves alone. Driving the probe metric to 0 would require removing them. Same shape for *"abstract closer 0.122 → ≤ 0.06 where a plain noun exists"*: a conditional cut stated against an unconditional rate.

Otherwise the rule is sound, correctly held out of the wave, and its D&D allocation is the best-evidenced in the file.

**CURE.** Express each R11 SIZE over the reader-facing subset once §9.3's per-file classification lands, and mark the probe rates NOT-EXECUTABLE until then rather than printing a target against them.

---

### CL-12 — REFUTED · LOW · ground (5)

**A clause no reconstruction can violate.** CL-12 is a HOLD; its acceptance is *"none of U1–U12 directly"* and its executable-now arm is two tests that pass today unchanged. Its Grammar clause *"never adjacent to another LIMIT"* cannot be exercised: the letter carries exactly one apparatus line (`TRUNCATION_NOTE`, CONFIRMED to render only beside `truncated: true`), and the other limits (`inferred`, `looseWeave`) live in the read model, which composes no sentence beside them. So the constraint is true by construction, not by discipline.

**CURE.** State the adjacency clause as a forward constraint binding any *second* apparatus line the register ever gains, and make the owed walker (every limit sentence maps to a true flag; no flag renders twice) the rule's only acceptance.

---

## B. THE CROSS-CUTTING VERDICTS

### §4-SPAN — THE SPAN FRAME IS EXEMPTED FROM RULING (3) BY AN UNEVIDENCED CLASSIFICATION — REFUTED · MEDIUM · grounds (3), (4)

§4's typed-move table lists **SPAN** and **TITLE** as moves, each with a licensing field and each marked "may fire without it? no". Three paragraphs later the same section calls the pair *"a run-in label"* and fixes it: *"the `SPAN: TITLE` order is fixed as a label and is not a grammar"* (CL-1's Grammar block repeats it). At the sha every populated advance renders `${frame}: ${top.title}` — **one order at 1.000** of populated span lines, the most-read line in the register — against §4's own ceiling of *"no single order above 0.35 of a unit's lines"*, proposed as *"measured over the SIMULATED SCROLLBACK"*.

So the same two items are moves for licensing and non-moves for variation, and the walker either fires forever on the register's most-read line or silently skips it. Tolkien H1 (formula reuse) is a real defence for the *frame word*; it is not a defence for the *order*, and the file never says which it is claiming. The owner's ruling (3) names this shape verbatim — the fixed order repeated entry after entry.

**CURE.** Pick one and write it down: (i) declare the span headline a LINE-HEAD in the typed-move table, exactly as CL-8 does for the chapter label, and exclude it from the order ceiling **in writing**, with Tolkien H1 cited for the frame word only; or (ii) give the populated frame a second order (e.g. `TITLE` alone under an already-rendered chapter label) so the closed set is real and the ceiling applies.

### §3-TABLE — THE "CORPUS MEDIAN" COLUMN CARRIES A MEAN, AND ONE EXEMPLAR BAND FLOOR IS WRONG — REFUTED · LOW · ground (2)

1. The rationed-pet-words row prints **0.185** in the column headed "corpus median", labelled "(field mean)". `PROBE_ALL.md`'s median for that metric is **0.106** — the figure every ratio row in §6 uses; 0.185 is the mean printed beside it at line 807. Against 0.106, R12's 0.176 is **1.66×** elevated and is a real fault; against 0.185 it reads as below average. The substitution understates the very fault CL-1 is cutting, in the one column a reader scans for elevation.

2. The antithesis exemplar band is printed **0.011–0.040**. Re-derived over the fourteen `primary/*.fingerprint.json`, the floor is **0.0082** (`dnd-rules-srd52`), not 0.011. The ceiling (0.0401, `tolkien-elevated`) is right, and every other band in the table — mean, sd, under-8, over-30, There/It-is, adverbs, doubled adjective, semicolon, colon, parenthesis, abstract closer, pronoun closer — reproduces exactly.

**CURE.** Print 0.106 as the median with the mean beside it in parentheses, and correct the antithesis band to 0.008–0.040. Neither correction moves a rule's direction; both move what a reader concludes from the table.

---

## C. TWO PROCESS HAZARDS THE SITTING SHOULD CARRY

1. **The kept files were rewritten after the reconcile was written.** All nine `kept-*.json` carry mtime **09-07 12:40**; the reconcile was written at **12:31**. Every citation still resolves against the 12:40 files (I checked all of them), and `kept-dnd.json` still holds **906** rows, so the reconcile's own hazard (i) is unchanged rather than cured — but the fold's D&D counts remain taken on a superseded file, and the reconcile's "recount tail reads `MISSING/NONVERIFIED: []`" was executed against a file that no longer exists byte-for-byte. Re-run the recount at the sitting.

2. **The receipt set for this register is incomplete as it stands.** §9.11 names one regen cost (the letter golden). This pass found three further shipped assertions that the text rules break or re-scope: `chronicleReadModel.test.js:99` and `:114–118` (CL-1, CL-9), and `demographicReading.test.js:86, 98, 124–125, 132` (CL-2, CL-5). Under the standing law that a behaviour shift is declared and never rides silently, these belong in §9.11 before any walk.
