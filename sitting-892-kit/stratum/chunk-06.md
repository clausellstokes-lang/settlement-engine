2. **Attempt 2 red at `typecheck:domain:strict`** — a REAL find, and an instructive one: the FILL-LAYER car widened a slot's type **by design** (so the anchoring law can drop a sentence with no fill), and an existing consumer written months earlier consumed it as a plain string. **The defect was not in the line the car wrote; it was in a line the car's type change REACHED.** Cured with the module's own idiom, **verified behaviour-identical before applying** — `text(undefined)` returns `''`, and `legibilityRung` already discards a detail row whose value is `''` by exactly the rule it uses for `undefined`.
3. **Attempt 3 red on a register the chair never refroze.** ⛔ **Lanes build cars and HOLD; the LANDING takes the register acts.** §884's landing lane took two; the chair composed two lane cars and went straight to the gate with none. **A whole 18-minute cycle spent discovering something knowable in seconds.**
4. **Attempt 4 green.**

### ⭐ THE `writerReach` STORY, RESOLVED — and an instrument that misreports its own budget

It refused the ratchet `--update` once and passed once **with nothing changed**, and it **passed in-suite at load 47 while failing in-suite at load 3.8** — which **DISPROVES** the earlier lane's load-artifact diagnosis rather than inheriting it. Root cause, measured: it blew the suite-wide `testTimeout: 20000` at **21,758 ms**. ⛔ **AND THE RATCHET'S FAILURE MESSAGE MISREPORTED THE GOVERNING BUDGET** — *"against a 300000ms budget (vite.config.js testTimeout)"*, where 300,000 is that file's `beforeAll` budget and `vite.config.js` sets **20,000**. **A real expiry was presented as though it had fourteen times the headroom it had**, which is exactly what sent the first diagnosis hunting a mystery kill. Cured as the instrument itself prescribes: an **explicit per-test budget** (120,000, ~5.5× measured, against the file's own precedent of 300,000 for hooks measured at 26.5 s), **not banked in the census**, and **the suite-wide timeout untouched** because raising it hides the next one.

⚠ **Two honesty rows on that cure.** It is **FOREIGN** — it predates the consist and belongs to no car in it; foreign normally halts, and it rode because it blocked the landing, the cure is prescribed, and it touches no `src` byte and no output. And ⚠ **whether other rows in that file sit near the same line is NOT ESTABLISHED** — the verbose reporter emitted no per-test durations and the check came back **inconclusive rather than clean**.

### ⭐ THE STOPPING RULE THAT HELD

Before re-running the refused `--update`, the chair wrote the rule to disk so it would bind: one more run; **both runs recorded, never only the green one**; a second refusal means HOLD, not a third attempt; and **never hand-add to the census, because an entry without attribution is a defect being laundered into debt.** The rule was honoured — both runs are in §884.4 and in the register commit's own message.

### E4 HELD ON EVERY REGISTER

Lighting predicted `2503/370/2133/22676/(unpredicted)` and measured **`2503/370/2133/22676/6101`** — four exact, and the fifth **deliberately not guessed** came in at +2. Ratchet predicted files **+0 exact** and tests **"≥ 11, exact count deliberately unnamed"** because a title and a test are different units; measured **+0 and +11**. ⭐ **Refusing to name a figure is a better outcome than guessing one and being right.**

*What Fable re-derives:* the misreported budget first — an instrument that reports the wrong governing figure will mis-diagnose every future expiry the same way. Then the foreign cure riding a landing. Then the chair's skipped register act, which is a process defect rather than a code one and has no gate.

*Priority:* ⛔ **HIGH for the misreported budget.** MEDIUM for the rest.

---

## §885.1 · THE EFFICIENCY LANE RETURNS — and finds a defect in the landing it was built to make cheaper (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**What was built.** Lane PREGATE holds at **`41a565e8b`** on branch `lane-PREGATE-2026-09-02` off `f5a6c3bbf`, three files / 821 lines, nothing else touched. **(a)** `scripts/pre-gate.sh` + `.mjs` — the cheap half of `npm run check` with **`;` semantics rather than `&&`**, so one run reports **every** cheap failure instead of the first. **(b)** `scripts/register-preflight.mjs` — which registers a consist disturbs, **from git alone**, in under a second.

**⭐ THE MEASURED SAVING, AND ITS HONEST LIMITS.** Tonight's four attempts cost **31 + 1,001 + 1,136 + 1,214 = 3,382 s**. With both instruments: **2,439 s. A saving of 943 s (15.7 min, 27.9%), four attempts down to three.** ⚠ **And the lane states plainly what it does NOT catch:** run 3's `writerReach` red was a test-runtime timeout inside the expensive stage and **neither instrument sees it**; and for a run-1-shaped failure *alone* the pre-gate is **57 s SLOWER** than the `&&` chain — it pays only because it reports everything else in the same pass. **A tool that names its own non-coverage is worth more than one that does not.**

**⛔ IT CORRECTED THE CHAIR'S BRIEF.** The brief named tip `2d5112851` as the reproduction target for tonight's miss. **That tree was already refrozen and therefore cannot reproduce it** — the miss lives at `37e285498`. The lane ran both, plus three negative controls, rather than reporting a pass against the wrong target. ⚠ It also **corrected the chair's headline figure**: the cheap stages measured **88.0 s** on its dock, not the ~4.5 min the chair briefed — while noting the chair's figure may be the honest one *under gate load* (its runs were at load 3–12; the gates ran at 20–30). **That care is the difference between a correction and a contradiction.**

**⭐⭐ IT FOUND TWO FALSE-OUTPUT DEFECTS IN ITS OWN INSTRUMENT, and both are this program's named classes.** *(1)* A first version declared only the test corpus as the ratchet's input, so it called a **src-only consist CLEAR — a FALSE GREEN.** Cured with per-register input groups; CLEAR now requires every group byte-identical. *(2)* A first version **exited 1 on a tree that gates green — a FALSE RED**, and *"an instrument that reds a green tree gets ignored."* Cured by splitting **BLOCKER** (exit 1, never refrozen) from **CAUTION** (exit 4, refrozen but not on this tree), printing the trailing diff as measurement. ⭐ A third: a base mismatch has two causes, and re-deriving at the register's own `measuredAtSha` **discriminates "my model is wrong" from "the base's register is already stale"** — at one tip it correctly reported the latter.

### ⭐ THE LIVE FINDING, CHAIR-VERIFIED, AND THE LAW IT BANKS

The lane reported that at the §885 gated tip **both registers were refrozen BEFORE the final cure car**. **The chair verified it by own reads:** lighting `measuredAtSha` = **`37e285498`** (car 3), ratchet = **`d4b91b26a`** (car 4), landed tip = **`2d5112851`** (car 6). ⇒ **Neither tuple was measured on the tree that gated.**

**RULED: NOTHING IS OWED, and the ground is measured rather than assumed.** Car 6 changed **exactly one line** — `});` → `}, 120_000);` — which adds **no test title and no describe block**, so neither figure could move; and **the gate ran the plain ratchet and the lighting walker AT the landed tip and both passed**, which proves currency by execution rather than by argument.

⛔⛔ **BUT THE LAW IS REAL AND IT IS NEW: REGISTER ACTS ARE THE LAST CARS OF A CONSIST, AFTER EVERY CURE.** The chair took registers at cars 4–5 and then added a cure at car 6. It was harmless *this time* only because the cure happened to be title-neutral — **a fact nobody checked before landing, and which the chair only checked afterwards because a lane raised it.** A cure that added one `test(...)` would have landed two stale registers behind a green gate. ⇒ **Order every consist: cures first, registers last, and never a car after a register act.**

### THE CHAIR'S RULINGS

⭐ **THE SCRIPTS DO NOT NEED TO LAND TO BE USED.** They live on a dock and read git; the pre-flight can be pointed at any base/tip **today**. ⇒ **Ruled: use them from now on immediately, and land them with TRAIN 1 rather than spending a dedicated ~20-minute gate** — landing is for permanence and CI, not for benefit. **RATIFIED** without amendment: the two-file split (an inline `node -e` in sh is the quoting hazard that killed a wrapper tonight) · stages invoked as `npm run <name>` verbatim for PATH and hook fidelity · ⭐ **an unrecognised new stage defaults to CHEAP and IS RUN** — *"a slower pre-gate is recoverable; a false green is not"*, which is exactly the right asymmetry · the BLOCKER/CAUTION split · the register roster discovered from the tree, with **27 of 29 printing "INPUTS UNDECLARED" so a new register is loudly unanalysed rather than silently invisible** · branch not detached head (the §882.14 survival law) · `node_modules` by APFS clone rather than a symlink that would share write paths across lanes.

*Deferred, documented, not bugs to re-find:* the other **27 registers have undeclared inputs** — named by the lane as the highest-value follow-on, and the chair agrees · no `--measure` mode (it would turn four UNKNOWN figures into numbers for one file-run instead of 13 minutes; deferred as cheap-and-honest without it) · four census figures stay UNKNOWN by design rather than by forking a 7,789-line grammar that would drift.

*What Fable re-derives:* the register-ordering law first — it is the one finding that would have silently landed a wrong figure, and it has no gate. Then the two self-found false-output defects, because a lane auditing its own instrument is the behaviour this program most wants to reward.

*Priority:* **HIGH for the ordering law.** MEDIUM for the rest.

---

## §885.2 · THE DARK-READER DESIGN'S ELEVEN CHAIR ROWS, RULED (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**Why this act exists.** The chair had said its next act was to rule these rows and then ended a turn without doing it. **A build lane dispatched onto unruled design builds on sand.** Ruled here, before TRAIN 1 is dispatched.

**ALL ELEVEN RATIFIED. Two carry ground the lane did not have, and one is ratified with a flag.**

**J1 — ONE FACT, ONE SENTENCE, refusing the annex's own R-DST-W4-d. RATIFIED, and on a SECOND ground the lane could not know.** The lane's ground is measurement: once severity is honoured, DS-GEN-1 has **one** eligible variant at `catastrophic`, so "three surfaces say three different things" is **unachievable**, not merely unwise. ⭐ **The chair adds the ground that settles it: the OWNER already ruled this territory AFTER that annex note was written** — the angles are **anti-staleness variation, not a lens taxonomy**, and the site must not infer what a reader wants. **R-DST-W4-d is precisely an attempt to use angles as a per-surface taxonomy.** So the note is not only impossible, it is contrary to a later owner ruling. **Refusing an authored annex note is the loudest call in the document and it is correct twice over.** *Veto shape:* the parked seeded rotation, re-costed.

**J2 RATIFIED** — and ⭐ **parking the rotation rather than rejecting it is the better craft**: it preserves the option with its price attached rather than deleting it and re-deriving later.

**J3 RATIFIED with the veto named.** Vocabulary in the kernel as a frozen constant plus a walker costs no generator change, no regeneration and no annex edit, and the walker makes drift impossible. The alternative is *more correct by layer* and buys nothing for a regeneration that would disturb seven leaves whose byte-identity is a **proven** property. ⚠ *If a generator change happens anyway for another reason, move it then* — that is the moment the trade flips.

**J4 RATIFIED — and it is not a judgment at all, it is a measurement.** Per-pool derivation is **forced by the data** (`DS-GEN-9 founding` unmarked; `DS-GEN-6 tier overlay: city` mixed). A per-block rule would be wrong on the tree as it stands.

**J5 RATIFIED.** Fail-closed means `[] → null → silence`, never "render everything" and never "throw". It matches R-DST-K, which already means silence, and ⭐ **a throw on a display path is worse than a blank surface** — the blank degrades, the throw takes the page.

**J6 RATIFIED.** ⭐ **Repairing the parser is hygiene regardless of whether anything routes on it** — a field that is 50% unroutable prose is a defect whether or not it is load-bearing, and separating the repair from the routing decision is what makes both cheap.

**J7 RATIFIED — ⚠ BUT FLAGGED, and the flag is the point.** Shrink-only rather than assert-to-zero is chosen because **an assert-to-zero needs an eleventh census slot and there is none.** ⛔ **That is a self-imposed constant bounding a design choice, which this program's own law says must be re-asked rather than silently obeyed.** The ruling stands because shrink-only is the only *available* shape today — but it is recorded that **the shape was chosen by census scarcity, not by design preference**, and ⭐ **if the census ever gains headroom (by curing a banked failure rather than by raising the ceiling), assert-to-zero becomes available and should be re-asked.**

**J8 RATIFIED.** No second reading, no stacked ladder; `legibilityRung` is the depth ladder. Consistent with the owner's ruling that the reader chooses depth by where they look and the software guesses nothing.

**J9 RATIFIED** — per-desk `manualChunks` names, following the file's own in-tree precedent rather than inventing a scheme.

**J10 RATIFIED, and it corrects both skeptics.** The parser car is **not** first; the draw key never contained `sectionTarget`, so the "must land first" reasoning both skeptics endorsed was wrong. ⭐ **A correction that survives two skeptics is worth more than an agreement that survives none.**

**J11 RATIFIED.** The import stays and the docblock is corrected to stop claiming the leaves are import-free — fixing the import instead would inline a live engine string the generator deliberately refuses. ⭐ **This is the citation law applied to a docblock: a comment that makes a false claim about the tree is a mint wearing a citation's clothes.**

### ⛔ THE OWNER ROWS — ROUTED, NOT ABSORBED, AND ONE OF THEM BLOCKS

**O1 — the 338 em dashes. ⛔ THIS GENUINELY BLOCKS THE FIRST DESK CAR and the chair will not absorb it.** They are already banked ratchet debt, so nothing is owed today; **the day a desk lights they become customer-visible prose against VOICE_AND_TONE §3**, and they are an owner-signed ONE-REGEN constituent. Per-leaf counts exist so the ruling can be per desk. **The lane's conservative default is "none", meaning it stops rather than guessing — correct.** ⇒ **TRAIN 1 (dark) proceeds; DESK WIRING does not, until this is ruled.**

**O2 — paid-surface exposure.** State prose derives at display time from fields that already survive `publicSafe.js`, so **it renders on gallery and anonymous dossiers automatically unless the mount gates it.** Conservative default until ruled: `publicDossier ⇒ no state prose`. ⭐ **The chair OPERATES under that default** — it is the restrictive read, and the restrictive read is the safe one when the caller is wrong.

**O3 — the 13-state authoring bill.** Corpus authoring, not code. Default: record and light anyway, since the ratchet only falls. **Acceptable to operate under.**

**O4 — DS-GEN-3 thin on the highest-cadence surface.** A **watch item, not a blocker** — and ⭐ it stops being a blocker *precisely because the angle axis was refused*, since under this design it reads ~2.95 distinct of 3 across ten settlements, the corpus's normal figure.

*What Fable re-derives:* J1 first, because refusing an authored annex note is the largest single call and the chair added a ground the lane did not have. Then J7's flag, which is the one place a scarcity constraint is shaping a design.

*Priority:* MEDIUM for the rulings. ⛔ **HIGH for O1**, which is a live block on the wave the owner most wants.

---

## §885.3 · THE OWNER RE-GRANTS EVERYTHING TO THE SOAK LINE (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The owner, in chat, verbatim:** *"i give all permissions and leave everything to your best judgmeent. get to right before the soak"*

**What this MOVES — the four rows that were blocking, now ruled by the chair.**
- **O1, the 338 em dashes: RULED — they leave before any desk lights.** They are prose against `VOICE_AND_TONE` §3 and the grant covers taste. Ground: this is the corpus's one reader-facing defect that is **cheap now and permanent later**, and the ratchet already counts them, so removing them can only make banked debt fall. ⇒ **DESK WIRING IS UNBLOCKED.** *Veto shape:* rule them kept and the desk cars carry a declared voice exception per leaf.
- **The 12 phrases and 6 frame wordings: RULED — the build lane authors them against the SPEC'S OWN TESTABLE REGISTER LAW** (`R1_FORBIDDEN`: no terminal stop, no digit, no underscore, no interpolation slot, no leading connective; plus the two-way frame-fit law extended to all six frames), and **the chair reviews before the car commits.** ⇒ **TRAIN 2 IS UNBLOCKED.** Ground: the register law makes the wording *testable*, so this is no longer taste-without-a-rule.
- **O3, the 13-state authoring bill: RULED — record and light anyway.** The ratchet only falls; a thin state is visible and shrinkable, and holding a wave for corpus authoring inverts the cost.
- **O4, DS-GEN-3: RULED a watch item, not a blocker**, at ~2.95 distinct of 3 across ten settlements.

**⛔ WHAT THIS DOES **NOT** MOVE — the carve-outs survive every delegation by their nature, and the chair says so unprompted.**
- **PAID-SURFACE BEHAVIOUR (O2) STAYS GATED.** It is on the canonical carve-out list. **The chair continues to operate under the conservative default `publicDossier ⇒ no state prose`** — the restrictive read, which needs no ruling to be safe.
- **THE TUNING SIGNATURE AND EVERY TUNING VALUE STAY GATED.** They are after the soak, and the instruction is to stop *before* it.
- **EVERY `git push` AND THE DEPLOY STAY GATED.** No delegation has ever covered these and this one does not either.
- **THE OWNER'S WALK + ONE REGEN IS AN OWNER ACT** and sits *inside* the remaining arc, before the review. The chair cannot perform it. **It is flagged as OWED rather than absorbed.**
- **THE 12 MUTILATED ANCHORS STAY UNREPAIRED.** ⚠ The grant is broad enough to re-open them, and the chair declines: they are pinned by a **prior owner ruling** (LEG-7) whose ground the chair would be guessing at, repairing them is **not on the launch path**, and *"all permissions"* is authority to decide, not a reason to churn a settled decision. **Recorded as a deliberate non-exercise of granted authority.**

**⭐ THE READING OF "GET TO RIGHT BEFORE THE SOAK".** The chair executes: TRAIN 1 (dark prose) → TRAIN 2 (news) → desk wiring → HORIZON-DARK → ENCOUNTERS → the LIGHTING WAVE → the `createdAt` leak and its five siblings → the GOLDEN freeze → W-ARMS → the exhaustive review (§879.6) → **⛔ FULL STOP.** The owner's walk is owed somewhere before the review and only the owner can take it.

*What Fable re-derives:* the O1 ruling first — it is the only one of the four that changes reader-facing bytes, and the chair ruled a taste question on a grant rather than a specification. Then the deliberate non-exercise on the twelve anchors, which is the chair declining authority it was given.

*Priority:* MEDIUM. **The carve-out list is the row that matters if anything here is wrong.**

---

## §885.4 · TRAIN 1 CAR C1 IS BUILT — the kernel gains the channel it never implemented, and its control is better than the chair briefed (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The car.** `f60457296` on branch `lane-KERNELMARK-2026-09-02`, **parent exactly `2d5112851`**, one commit, porcelain 0, one trailer, reachable by its own ref. **3 files, +387/−7**: the kernel +116/−6, the projection contract test +173, the kernel test +98/−1. **No new test file, no manifest row, no census slot.**

**⭐ CHAIR-VERIFIED BY OWN READS, every binding constraint:** `drawVariant` is **byte-identical to base** (`diff` exit 0 over the extracted function) — the constraint the chair made binding · the kernel still has **zero imports** · and on the ratchet question, **the whole kernel contains ZERO string literals carrying an em dash or exclamation mark**; the three em dashes in the diff are **docblock prose, which the tokenizer explicitly skips**, and the four apparent bang hits collapse to a single line of ordinary operators (`typeof value !== 'string' || !…`). The lane's `em=0 bang=0` claim holds under the scanner's own logic.

**⭐⭐ THE CONTROL IS BETTER THAN THE BRIEF ASKED FOR, and the improvement is the point.** The chair asked for red-at-base. The lane found that the *literal* base kernel cannot even load the new arms (`TypeError: poolDimensions is not a function`, "no tests ran") — so **that red is real but IMPRECISE, and it said so rather than banking it.** It then built **two mutants**: **A**, the base reader's `eligibleVariants` body restored **verbatim and proven byte-identical by `diff`** with the new exports kept so the arms load — reds **exactly T2 and T3**; and **B**, the gate kept but the filter dropped — reds **T3 alone, T2 green**. ⇒ **The fail-closed gate and the per-variant filter are proven INDEPENDENTLY.** A single red proves an arm can fail; **a mutant pair reding different arms proves each mechanism separately**, and that is a materially stronger receipt than the one requested.

**What T2 found against the unfixed reader: 24 pools that SPOKE**, each printing a sentence with severity, deficit or anchor ignored — `DS-GEN-1 :: leadership_vacuum` and `magical_controversy` returning `major`-marked prose chosen by a seed that never saw the severity.

**⭐ IT REFUSED TO REFREEZE, AND THAT IS THE NEW LAW WORKING.** Base `tests/lint` = 5 failures, tip = 6; the extra is the lighting census. **The lane did not refreeze it** — two sibling lanes are still building and refreezing now is exactly *"a car after a register act"* (§885.1). It reports what the landing owes, last: lighting **titles 22676 → 22680, suiteTitles 6101 → 6102**, files/parked/credited **unchanged**; ratchet **totalTests 30973 → 30979**, files unchanged.

**⭐⭐ AND A REAL FINDING ABOUT THE CENSUS ITSELF: THE CENSUS DELTA IS NOT THE ARM DELTA.** The +4/+1 comes **entirely from the contract test**, because `tests/domain/stateProseKernel.test.js` is **PARKED by that walker**, so its two new arms cost the census nothing. **Budgeting a refreeze by counting arms would have predicted +6 and been wrong.** Proven by isolation runs. ⚠ And `suiteTitles` had to be obtained **by probe** (register bumped, run, restored byte-identically) **because the census asserts `titles` FIRST and would otherwise under-report its own drift** — an instrument that stops at its first mismatch cannot tell you the size of the second.

