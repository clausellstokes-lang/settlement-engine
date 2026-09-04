Not four defects but **one lying annotation**: `neutralNeighbourEdges.js:289` constrained its generic as `updatedAt?: string`, so a `string|null` return failed the constraint, TS fell back to the constraint type, and the resulting union reddened all four sites (worldSnapshot 159/168/169, pulseKernel 2421). Widening it to `string|null|undefined` collapsed all four at once. It went red a second time mid-car when removing `= null` defaults left five stale `@param {string|null}` annotations. **1121/1121 exit 0, ceiling never touched, no `@ts-ignore`, no baseline edited.**

### THE SPELLING BAN: NARROWED, NOT RETIRED — and the reasoning is the model

The ban was **forced rather than chosen**: it scans `tests/` and skips only three files, so it **convicted the cure's own proof arms.** Its `null` half is **retired** because its stated ground — *"reads as a pin and is not one"* — is now false. Its `undefined` half is **kept and is permanent**: undefined must keep meaning *absent* for ~120 omitting callers and for object spreads, so that half of the trap **cannot be removed, only fenced.** A new arm bans the flattening, scoped to `src/domain/region/**` (elsewhere `now = null` is the correct 126-site news-author idiom) and placed in the **existing** walker file, because a new test file would red three censuses at landing.

**Its negative control is the standard to hold others to:** replanting `now = null` reds **the walker AND the behaviour arm**, proving the guard convicts a real bug rather than a spelling; restored by `cp` with `cmp` identical and the sha shown on both sides; re-run 27/27. Whole-product byte identity with the **real** clock moved 1.2 s between runs: composer **564,663 B**, two-year advance **257,250 B**, both identical. Lifecycle exercised per path — create, read, persist+reload, regenerate, re-entry, clone, migrate, legacy-data — with **undo dispositioned rather than exercised**, and the reason given: regional undo is a wholesale snapshot restore that mints nothing.

⭐ **And it refused to accept a quiet base run as exoneration:** of seven domain reds, five reproduced at base and the two that did not **passed in its own dock in isolation, 56/56 exit 0** — contention flakes of the parallel run, checked rather than assumed.

### ⛔ THE OWNER-GATED LINE IT DECLINED TO CROSS — AND THE CHAIR'S RULING

The lane found an in-tree ledger row calling a nullable stamp *"a schema change, which is owner-gated"*. It judged the **type widening** to be inside a repair (no stored byte moves; the record's siblings `RegionImpact.createdAt` and `RegionChannel.confirmedAt` are already `string|null`) and **did not take the further step of making any production caller WRITE a null.** ⭐ **That split is exactly right.** ⇒ **CHAIR RULING: the owner DELEGATED the `now: null` schema change in chat on 2026-09-03, so the further step is now AUTHORISED — and it is NOT NEEDED**, because the lane measured **zero `src/**` call sites that thread a null**, so no production byte moves either way. It stays unbuilt as unnecessary rather than as forbidden.

*What Fable re-derives:* the short-circuit claim (`row.stamp ||` never reaching the resolver) and the walker-blindness finding.

*Priority:* **HIGH** — it removes the trap behind a ~0.45% random landing-gate red.

## §890.3 · O-17 LANDS, AND THE CHAIR RETRACTS A CLAIM IT MADE TO THE OWNER (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

### ⛔⛔ THE RETRACTION FIRST, BECAUSE IT WENT TO THE OWNER AS A FINDING

The chair told the owner that **`pg` is not in `package.json` at all, in any section**, and called it a fragility that would stop a fresh clone running the landing gate. **That is FALSE.** `pg` is declared at `package.json:119` in **devDependencies**, `^8.22.0`, on the product branch AND the ledger branch, and the O-17 lane said so in its report.

⭐⭐ **HOW THE FALSE CLAIM WAS MANUFACTURED, because the mechanism is the point:** the chair's probe was `node -e "…" 2>/dev/null || echo "  not in package.json at all"`. The `node` call **failed**, `2>/dev/null` **hid the error**, and the `||` fallback **printed a confident finding in its place.** ⇒ **THE THIRD FALSE STATEMENT TODAY PRODUCED BY A SWALLOWED ERROR**, after `echo "memory extended"` for a write that never happened and `"copied"` for twenty-six packages of which one silently failed. ⛔ **THE LAW, now stated at full strength: A FALLBACK BRANCH MUST NEVER PRINT A FINDING. `|| echo "<a claim>"` converts an unexplained failure into evidence.** A fallback may report *that the probe failed*; it may never report *what the probe would have found*.

**The corrected picture, measured across five docks:** `pg` is **declared in every one**; it is **installed in two and missing in three**, because those docks never re-ran install after it was added. ⇒ **a dock-hygiene gap, not an undeclared dependency, and a fresh clone is fine.** The alarming half of the chair's report to the owner was the invented half.

### O-17 — THE FAITH SURFACE IS CANDIDATE-LIT, AND THE LAW IS REPLACED RATHER THAN RELAXED

Landed `8ae07b5fc`, sealed `refs/preserve/lighting-rows-2026-09-03`; three cars with O-12 and O-16. `FAITH_TUNING_SIGNATURE.live` false → true plus `faithTuningState()` returning a closed three-word vocabulary reached only through the owner's literal boolean. ⭐ **The lane refused the cheap reading:** dropping the `&&` alone would let the surface light silently with nothing in the old law's place. So the law is **replaced** — was *"a surface may not be lit while unsigned"*, is *"a surface may be lit while unsigned, and it MUST THEN SAY SO"* — a lit-unsigned surface reports **DRAFT**, and reporting **SIGNED is unconstructible**. **No value moved, `signed` stays false, `signedBy` stays null.**

**Behaviour shift, plainly: nobody sees anything.** `faithTuningArmed()` has zero readers outside its own file and the faith door has no consumer at all. No output moves and **no golden was re-recorded**. What changes is the surface's self-report: the review reads it as lit-draft instead of dark.

⭐ **DEITY DOCTRINE checked in code rather than argued, and found NOT ENGAGED:** `religionState.js:136 renormShares` redistributes to a fixed target so adding a god *divides* the adherent pool, and the witness ladder only steps down with the authored level as a ceiling — every magnitude is a function of adherent share and piety, and **nothing asserts a god exists or acts.** No row refused; no STOP owed.

⭐⭐ **AND THE LANE CONVICTED ITS OWN FIRST DRAFT BY READING ITS OWN EARLIER COMMIT.** O-12's message records that its equivalent arm was first a bare `toContain` whose mutant **passed**, *"because the record quotes the same words"*. O-17 had exactly that hole — nothing pinned the original header bullet, so the silent overwrite this row forbids was still constructible. **The cure is the count: the §763 wording must appear TWICE.** 5 new arms (23 → 28) and **8 mutants all RED**, including one that deletes the original bullet and one that strips the attribution.

### THE TWO INDEPENDENT TITLE MEASUREMENTS RECONCILE EXACTLY

The chair's train (O-12 + O-16 + the Herald cure) measured **22823 → 22836 = +13** off the walker. The lane's train (O-12 + O-16 + O-17) predicted **+17** from per-file counting (O-12 +2, O-16 +10, O-17 +5). Overlap +12, plus the chair's one Herald arm = 13 ✓; plus O-17's five = 17 ✓. With O-17 composed the walker now demands **22841**, which is the chair's written prediction (22836 + 5) **exactly**. ⭐ The lane also explained *why* it counted per-file rather than reading `suiteTitles` off the walker: **that assertion sits after `titles` in the same test, so the first mismatch throws and it never evaluates** — the sequenced-arm blindness this program keeps rediscovering.

⚠ **DOOR 3 is a TIMEOUT, not a parse failure** — *"Test timed out in 20000ms"* at 22–23 s, with one sibling lane still running. Contention, held rather than chased.

*What Fable re-derives:* the deity-doctrine non-engagement read, and the claim that reporting SIGNED is unconstructible.

*Priority:* **HIGH for the retraction** — a false finding reached the owner; MEDIUM for O-17.

## §890.4 · THE `src/` PROSE SWEEP LANDS ON ITS DOCK — and the chair RULES IT INTO THE LIGHTING WAVE rather than minting a window (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

Sealed `refs/preserve/srcprose-2026-09-03` = **`8f4d5c648ce62fc51231110b9c4ace2127fbdd18`** — unreferenced when the lane reported; **the eighth payout of the §882.14 survival law today.** One commit, **200 paths, +1,084/−1,019.**

**The measured shape.** **1,481** em dashes in `src/**/*.js` string literals, re-derived with a real parser — **1,001 cured as reader prose, 480 exempt with a written reason each** (developer registers 348, parse-coupled separators 51, diagnostics 30, generated leaves 24, structural/brand 18, the empty-value glyph 7, and 2 literals that are *compared* rather than displayed). Disposition judged per site: **COLON 437 · PERIOD 402 · COMMA 84 · PAREN 39 pairs**, with the colon/period split moving by 108 rows during review **in both directions** — a reviewer changing its own mind is the evidence the judgment was real. A re-sweep at the committed tip reports in-scope **zero**, and the prose diff is **989 insertions / 989 deletions with every individual file symmetric.**

**The 28 byte-twins were bound by TEXT, not by the inherited line numbers** — 28/28 landing on exactly the lines the predecessor's ledger recorded, then **re-verified after the cure** by re-reading each annex row against its owning file's literals: 28/28, with the 17-file twin battery byte-identical to base.

### ⭐⭐ THE GUARD'S COUNTER WAS A FALSE INSTRUMENT IN BOTH DIRECTIONS

`structuralValidator.js` measured **39 exclamation points by its tokenizer and ZERO by a parser**, and **64 of 71 bangs over the unscanned directories were phantom.** Replaced with `espree`. ⭐ **That repair is what makes this car bankable at all:** under the old counter the documented refreeze would have thrown on `bang 10 → 15`, so this lane's own shrink could never have been banked. Under the parser both totals fall and the refreeze is legal — the E2 total arm went **green, 770 → 290.**

⚠ **AND AN INSTRUMENT THAT PUNISHES ITS OWN CURE, reported rather than widened:** the E2 per-file `files` magnitude counts **drifted** files, so *removing* debt from 88 files pushes it **69 → 126.** The landing's refreeze clears it; the lane refused to widen a ceiling to make its own work pass.

### FOUR PARSE-COUPLED PRODUCERS A `src/`-ONLY CENSUS CANNOT SEE

Beyond three classifier bugs, the review found a **comparator** class (`safetyLabel === 'Dangerous — Criminal Governance'` would have been half-changed, **silently killing a crime-type branch**), a backtick-boundary bug hiding 23 appended fragments, an aside that could not pair across a quasi, and a sentence splitter **reading code punctuation** — a ternary's `?` ending a "sentence". Then four real defects, each reverted at cause: `customContentSchema.js`, whose parser's **own docstring says the dash is the delimiter** (curing it leaked glosses into the UI); the `heraldCausalVoice` headline register (**56 of 56 cases red**); `economicState`'s services rows; and the `NPC — ` journal prefix. ⭐ **THE LAW: A CONSUMER CAN LIVE IN `tests/`, IN A `.jsx` COMPONENT, OR INSIDE A REGEX** — a producer census scoped to `src/` will not find the thing that parses the character you are removing.

⭐ **The lane also corrected its OWN earlier claim.** It first reported that no golden needed re-recording, on a **fragment search** — the wrong instrument, because **a golden storing a digest is invisible to a content search.** The full suite found two. And it refused to claim ~20 first-run "timeouts" as its own: 21 assertions failing at base pass at tip, so they were contention, and *"reporting those as mine would have been a false report."*

### ⛔ THE BLOCKER, AND THE CHAIR'S RULING

`espionageDormancyFence.test.js:332` states the constant is re-recorded **ONLY inside a NAMED CHARTERED WINDOW**, that ENGINE-HYGIENE spent one and T13 TRANS closed with zero movement, and that **"exactly ONE remains: the LIGHTING WAVE (§881.4)"** — anything else moving it being *"an unpriced same-seed shift in the world a player gets."* **The mover is this car, doing exactly what its declared shift says.** It re-recorded nothing; **8 files and 11 assertions stand owed.**

⇒ **CHAIR RULING: THE PROSE CAR RIDES THE LIGHTING WAVE. The chair does not mint a second window.** The surviving window is named by **§881.4, an OWNER directive**; both spent windows were named the same way. The owner approved this sweep today and the shift is priced, measured and declared — so the *purpose* of the fence is satisfied — but **the mechanism requires a NAMED window and naming one is the owner's act, not the chair's.** Sequencing around a recorded constraint costs nothing but order; ruling past one is what the chair already did wrong once today (§890.1). ⭐ **The owner may charter this sweep as its own window with a single word if they want it sooner; until then the car is sealed and rides.**

*What Fable re-derives:* the false-counter finding (39 by tokenizer, 0 by parser) and the four parse-coupled reverts.

*Priority:* **HIGH** — 1,001 reader-facing sentences moved, and the car is gated only on a window.

## §890.5 · A DOCK'S `node_modules` FORM CHANGES THE BUILT ARTIFACT — the chair breached the first-paint budget by 8,551 B and it was self-inflicted (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

The §890 gate ran 1,087 s over 20 stages, cleared typecheck 173/173, domain-strict 1121/1121, the test ratchet **10 known of 31,141**, and lint at 0 errors — then **failed at the BUILD stage** on a real verdict, not a flake: *"first-paint static closure = 1,056,551 bytes (budget 1,048,000)"*, **over by 8,551 B**, an ASSERTION that ran in 21 ms against a 20 s budget.

⭐⭐ **THE CAUSE WAS THE CHAIR'S OWN REPAIR, AND THE FINDING GENERALISES BEYOND IT.** Chasing an irreproducible edge bundle, the chair found that `node_modules/immer` and `node_modules/seedrandom` were **SYMLINKS** to the main repo, that esbuild follows a symlink to its REALPATH, and that the builder therefore recorded nine inputs as `../../../../../../../Users/…` paths **that no checkout can contain** — which is exactly what the reproducibility arm says: *"every input outside node_modules/ is git-TRACKED (nothing falls through to disk)."* Materialising those two took escaping inputs **9 → 0** and turned all four bundle arms green.

⛔ **But the chair did not stop at two.** It began materialising **all 438** symlinks in the dock and `set -e` halted it at **45**. Those 45 real copies **changed the Vite build's own output** and pushed first paint over its budget.

**Proved by execution in both directions, not by correlation:**
- A sibling dock carrying **the same three lighting cars and none of the chair's** — symlinked `node_modules` — built **GREEN** (`vendorPdfLazy` 31 passed / 11 skipped, exit 0).
- Restoring all 45 packages to symlinks in the landing dock and rebuilding returned it to **GREEN**, unchanged commits, porcelain 0.

⭐⭐ **THE LAW: A DOCK'S `node_modules` FORM — SYMLINK VERSUS REAL DIRECTORY — CHANGES THE BUILT ARTIFACT'S FIRST-PAINT SIZE.** The byte budget is a load-bearing product constraint, and it is only meaningful in a dock with the canonical layout. **A lane that materialises packages will read a FALSE RED against that budget, and one that measures in a differently-laid-out dock is measuring its own environment.** This sits beside the banked "link the worktree's OWN node_modules" hazard and sharpens it: the linkage is not merely a convenience, it is part of what makes the byte figures comparable.

### THE RESOLUTION, WHICH KEEPS BOTH CONSTRAINTS

The two requirements looked contradictory — symlinks make the bundle irreproducible, real copies breach first paint. They are not. **Build the bundle ONCE with the packages materialised so the recorded input paths are clean, commit it, then RESTORE the symlinks.** The reproducibility arm re-verifies afterwards because, for an input that `git ls-files` does not contain, it falls back to reading the path from disk — and that read follows the link to identical content. Measured after the restore, with the commits untouched: **reproducibility 25/25, aiCharter 19/19, aiOutputSchema 23/23, vendorPdfLazy 31/42 — all exit 0 simultaneously.**

⚠ **AND THE CHAIR'S OWN EARLIER MISREADING, RESTATED BECAUSE IT COST TWO CYCLES:** an attempt that ran the builder and left the result **uncommitted** watched reproducibility go 4 → 6 and concluded *"the fix made it worse"*. It had not — a regenerated-but-uncommitted bundle **is** the DIRTY-BUILD class the suite is named for, and the suite was describing the chair's own method back to it in its failure text.

*What Fable re-derives:* the two-direction proof (sibling dock green; restore returns green) — the correlation alone would not carry it.

*Priority:* **HIGH** — it makes a load-bearing byte budget environment-dependent, and any lane can trip it.

## §891 · THE ACCOUNT-SWITCH HANDOFF — a seventeen-car train one register from its gate (2026-09-03, chair session 58f0a8e2, SEAT: Opus 5 — Fable-unvalidated)

**The §891 train is composed, sealed and seventeen cars deep** at `refs/preserve/train891-registers-2026-09-03` = `4233031ba`, base `ca651d54b`, porcelain 0, 17 trailers. **All six register acts taken and green.** One bill stands: `writerReach`'s frozen surfaceReach still calls `situationDesc on economicState` dark, and DESK CAR 1 made it reach the web display. **A register, not a defect**, with a `--write` door.

⚠⚠ **THE SURVIVAL AUDIT CAUGHT THE LIVE TRAIN ITSELF.** At handoff time `laneKERNELMARK-tree` — the seventeen-car train, every register act in it — was reachable from **NO REF**. Sealed before anything else. ⭐ **That law has now paid out NINE separate times in one day**, and this was the most expensive instance it could have caught: an account switch discards run ids, and an unreferenced tip in a scratchpad is one `gc` from gone.

### WHAT THE TRAIN CARRIES

Five lanes batched into one gate rather than five: **CAPACITY C1/C2/C3** (a town says ONCE, as a crossing rather than a census, when it has grown as large as its fields will feed; and a reader can ask how much room is left at any year) · **the `now: null` root fix** (the wall clock leaves both regional seams) · **DESK CAR 1 + its correction** (the first four dossier blocks leave the dark half) · **CHARSET Car 1** (the product learns which letters it can actually draw, measured from its own renderers) · **READERREVIEW Car 2 + three cures** (the reader corpus can be READ at last).

### THE REGISTER LOOP AT ITS BEST, AND ITS ONE INSTRUCTIVE MISS

Six acts, every figure predicted in writing before its instrument ran: lighting **files 2515 EXACT**, tuning **225 tables and 2,099 keys BOTH EXACT** (predicted by the CAPACITY lane before it built and verified independently by the chair), prose numerics **225 → 225 with the debt SHAPE proven byte-identical**, OSR **1,993 / 1,409 / 388 unchanged**. ⭐ **The one miss taught the law:** four lanes' independently-measured title deltas summed to **+75**; the composed tree measured **+78**. **THE SUM OF INDEPENDENTLY-MEASURED DELTAS IS NOT THE COMPOSED DELTA** — the chair had written *"measured, not summed"* into the prediction beforehand, which is why the miss cost nothing.

### TWO REGISTER ACTS WERE JUDGMENT, AND BOTH WENT THE HARDER WAY

**The charset invariant could have taken a RATIONALE** — an entry asserting mutation testing is redundant, which the model earns by saying its catching power is *"EXECUTED IN THE TEST BODY"*. That file has five arms and **no executed plants**, so the sentence would have been **false**, and writing it would have laundered an unproven invariant into the very manifest built to prevent that. So the invariant was made to **earn a mutation entry**: plant 72 strikes ONE measured range from the dossier surface, the anchor proved unique first, and with it **2 of 5 arms red naming the exact codepoints that stop printing** — restored `cmp`-identical, 5/5 green. ⚠ **The sweep's own dirty-guard then convicted the chair** for adding a plant without listing the file it mutates: the sweep reverts with `git checkout --`, so an unlisted file means a manual run **destroys uncommitted work.** That is the checkout hazard turned into machinery.

**The OSR act is the one a LANE REFUSED, and its refusal still stands.** At the charset lane's tip the same `--write` moved **twelve** manifest entries, only five its own, and it ran the write, measured it, and **reverted** rather than launder seven foreign entries under its sha. At the composed tip the instrument names exactly **one** generated input and declares it absorbable in its own words. ⭐ **A LANE AND A LANDING ARE NOT THE SAME VANTAGE POINT; a register act is legitimate at exactly one of them.**

*What Fable re-derives:* the charset plant's catching power, and the claim that the twelve OSR entries collapse to one at the composed tip.

*Priority:* **HIGH** — it is the live train and the handoff rests on it.
