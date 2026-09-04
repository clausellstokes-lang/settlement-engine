import json
calls = []
OVER=[]
def add(row, call, claim, method, evidence, verdict, confidence, note):
    if len(evidence) > 700: OVER.append((row, len(evidence)))
    calls.append(dict(row=row, call=call, claim=claim, method=method, evidence=evidence, verdict=verdict, confidence=confidence, note=note))

# ---- §883.1 T13-BUILD, §RV (first sitting)
add("§883.1 §RV(1)", "Car 0 ADOPTS (c): relocate travelersGeometry.js rather than build detTrig",
 "Repo-wide census at 8b07ce45f shows two importers only; progress01 in four worldPulse files is a name collision, not an edge",
 "git grep travelersGeometry at 8b07ce45f over src+tests; read namedPersonTransit.js imports; count progress01 hits; read landing pick e5179599b stat",
 "git grep at 8b07ce45f: `src/components/map/TravelersLayer.jsx:25:import { progress01, pointAlongPath, chevronPoints } from '../../domain/roads/travelersGeometry.js'` (sole code importer), `tests/domain/roadsTravelersGeometry.test.js:5` (its test), `routeNetworkLedger.js:14` header comment only. namedPersonTransit.js at base: `16:import { clamp01 } from '../../kernel/math.js'` (only import). progress01 per-file counts 1/10/2/4 = 17 = receipt C0.2. Landing e5179599b: `.../roads => components/map}/travelersGeometry.js | 19 +` (relocation), TravelersLayer.jsx 2 +-.",
 "RATIFY", "CONFIRMED", "The decision rule's condition (render-side sole consumer) holds at the base by my own census; the relocation landed as code motion.")

add("§883.1 §RV(2)", "detPow NOT folded onto the shared core; core born beside it, duplication machine-policed",
 "detPow.test.js's liveness anchor is the literal `export function detPow(x, y)` in detPow.js, so a re-export would delete the anchor",
 "git show 7f974e855:tests/kernel/detPow.test.js | grep",
 "tests/kernel/detPow.test.js at 7f974e855: `114:  const KERNEL_SIGNATURE = 'export function detPow(x, y)';`. Receipt §C1.4 (laneT13-receipt.md:330-350): `Turning detPow into a re-export deletes the anchor ... the core is born beside it, detPow.js is UNTOUCHED`; `detMathIdentity.test.js pins: the two log2Det bodies BIT-IDENTICAL`.",
 "RATIFY", "CONFIRMED", "The structural reason is real at the landed tip; the charter's own fallback applies.")

add("§883.1 §RV(3)", "THREE kernel algorithm changes away from the charter's literal shapes (round-to-nearest reduction, Cody-Waite ln2 split, expm1-based tanh), forced by measurement",
 "The charter's shapes were followed literally first and failed 11 of 41 arms; each change cured a measured miss without relaxing a budget",
 "Read charter T13-BUILD-CHARTER.md §3.1/§3.3/§3.5; receipt §C1.3 table; grep the kernel at 7f974e855 for the three techniques",
 "Charter §3.1: `call exp2Det(−x) directly`; §3.3: `Built on exp2Det (eˣ = 2^(x·LOG2E) with the constant folded exactly, or a direct series — implementation's choice`; §3.5: `Via exp2Det, overflow-safe`. Receipt §C1.3: `exp2Det flooring its reduction | 2.72e-14 ... round to NEAREST`; `detExp = exp2Det(x * LOG2E) | 4.14e-14 ... Cody-Waite split`; `detTanh via (1-u)/(1+u) | 1.78e-10 ... numerator from detExpm1`; `After the fixes: 41/41`. Kernel at tip: `43: * rounds to nearest where detPow's floors, and its series is factored through 44: * expm1Small. Both changes were forced by MEASUREMENT`; `99: * ln(2) SPLIT IN TWO ... (the Cody-Waite idiom)`; `107:const LN2_HI`.",
 "AMEND", "CONFIRMED", "Substance holds and all three techniques are in the shipped kernel. Label overstates: the charter prescribes BUDGETS not spellings, and §3.3 explicitly leaves detExp's construction to the implementation; only the flooring reduction (detPow's inherited idiom) and the tanh quotient were 'literal shapes' the naive draft copied. Reword to 'three changes from the naive/precedent spellings, each forced by a measured budget miss'.")

add("§883.1 §RV(4)", "detIntPow's budget reported as TWO figures (9.80e-15 consumer-visible vs 1.99e-14 unrestricted) rather than one relaxed number",
 "Both figures are asserted by their own literally-titled test arms; §3.2's 1e-14 and its cited 1.95e-14 DENS analogue cannot both bind",
 "git show 7f974e855:tests/kernel/detMath.test.js sed 316-335",
 "detMath.test.js at tip: `// the relative error grows LINEARLY in the exponent: measured 3.6e-16 at n <= 8, 1.0e-14 at n <= 256, 1.99e-14 at n <= 500, 3.98e-14 at n <= 1000. The charter's §3.2 budget is <= 1e-14 ... and §3.2 simultaneously cites the DENS dyadic ladder's 1.95e-14 as \"the ceiling analogue\"`; `test('every real decay base holds the 1e-14 budget wherever the result is consumer-visible'` with `if (!Number.isFinite(ref) || ref < 1e-6) continue;`. Charter §3.2: `Budget: ≤ 1e-14 per site over the observed exponent domain (... the ladder's 1.95e-14 is the ceiling analogue)`.",
 "RATIFY", "CONFIRMED", "Honest framing of a genuine charter inconsistency; whether §3.2 gets formally amended to 2e-14 is the chair's item, not this lane's.")

add("§883.1 §RV(5)", "STOP before wiring on the closure-budget worksheet (detMath minifies to 2,086 B vs 995 B margin)",
 "Wiring the kernel eager would red the first-paint RAW closure",
 "Re-minified 3b56c8e32:src/kernel/detMath.js with the repo's esbuild (read-only, output to my scratch dir); read §C1.5",
 "My re-measure: `git show 3b56c8e32:src/kernel/detMath.js` = 18,048 B raw (matches §C1.5 `18,048`); `esbuild --minify | wc -c` = **2,116** with esbuild 0.28.2 (node_modules/esbuild/package.json `\"version\": \"0.28.2\"`); receipt measured 2,086 with 0.28.1. Either figure exceeds the 995 B margin (§C1.5: `first-paint closure RAW | 1,046,005 | 1,047,000 | 995 B`). §C1.5: `VERDICT: detMath.js minifies to 2,086 B against a 995 B first-paint closure margin ... I STOPPED before wiring, per the brief.`",
 "RATIFY", "CONFIRMED", "The STOP trigger is robust to the 30 B minifier-version drift. The exact 995 B margin and the +1,263 B probe attribution remain PLAUSIBLE (settling command: `npm run build` at 8b07ce45f and at bfcc128fe with VERIFY_DIST=1 vendorPdfLazy — a build, not run here).")

add("§883.1 §RV(6)", "det-math gets its OWN lazy chunk rather than engine or kernel",
 "The det-math manualChunks rule exists and precedes the general /src/kernel/ rule; the pin guards ordering",
 "git show 7f974e855:vite.config.js sed 555-625; grep vendorPdfLazy.test.js source arm",
 "vite.config.js at tip: `596: if (id.includes('/src/kernel/detMathDecay.js')) 597: return 'det-math-decay'; 598: if (id.includes('/src/kernel/detMath.js')) 599: return 'det-math';` ... `620: if (id.includes('/src/kernel/')) 621: return 'kernel';`. vendorPdfLazy.test.js: `785: it('the det-math manualChunks rule is present in vite.config.js'`, `812: 'the det-math rule now sits AFTER the general /src/kernel/ rule, so it can never'`. §C1b.2: `eager kernel chunk | 10,683 | 10,683 | 0 ... det-math-DfuVWfHh.js | 932 | new`.",
 "RATIFY", "CONFIRMED", "Chair-adopted; the ordering pin makes the placement non-silent.")

add("§883.1 §RV(7)", "Car 3 re-scoped to call-site consolidation first, numeric change deferred to Car 4 family (i)",
 "Bit identity holds only at whole half-lives, so the chartered Car 3 would reclassify most of itself into Car 4 at measurement time",
 "Read §C3-FOLD; grep bandedStock.js at pick 9 (bd1fef1b8) and pick 15 (854d80fea) for Math.pow/halfLifeKeep",
 "§C3-FOLD (chair ruling recorded by the lane): `halfLifeKeep is exp2Det(-age/h) and differs from Math.pow(0.5, age/h) by ~2.17e-16 over every real half-life ... Bit identity holds ONLY where the exponent is a whole number of half-lives.` bd1fef1b8:bandedStock.js `119:  return Math.pow(0.5, age / halfLife);` (consolidation only); 854d80fea:bandedStock.js `49:import { halfLifeKeep } from '../../kernel/detMathDecay.js'` `135:  return halfLifeKeep(age, halfLife);`. Car 3 pick bd1fef1b8: 11 src files, `tests/lint/.transcendental-math-baseline.json | 13 ++-----------`.",
 "RATIFY", "CONFIRMED", "The lane recommended, the chair ruled; the landed picks carry exactly the split.")

add("§883.1 §RV(8)", "The lighting-census red NOT cured in-lane (deliberate deferral on the brief's register rule)",
 "sovereigntyLightingContract 2482 vs 2480 is Car 1's two new test files; the refreeze is the landing's act",
 "Read §L; git show --stat e06ea94d1",
 "§L: `sovereigntyLightingContract.walker.test.js | 1 | GREEN at base | MINE — from Car 1 ... expected 2482 to be 2480 ... Disposition: NOT cured in-lane, deliberately.` Landing `e06ea94d1 Register 1/3: the lighting census refrozen at the composed tip, 2497/370/2127/22491/6078` touching `tests/lint/.lighting-census-baseline.json | 14 +++++++-------`.",
 "RATIFY", "CONFIRMED", "The deferral was written down and discharged at the landing.")

add("§883.1 §RV(9)", "roadsTravelersGeometry.test.js NOT renamed with the module it tests",
 "Minimise register churn",
 "git ls-tree 7f974e855 | grep travelersGeometry",
 "At 7f974e855: `src/components/map/travelersGeometry.js` and `tests/domain/roadsTravelersGeometry.test.js` both present; e5179599b changed the test by `2 +-` (import path only).",
 "RATIFY", "CONFIRMED", "Trivial; the lane itself invites a reversal if naming matters more than churn.")

# ---- §RV3 second sitting
add("§883.1 §RV3(1)", "The golden battery's green NOT banked on the suite's word; golden-drift.probe.mjs is a faithful HAND COPY of corpus()/keyOf()/hashFor() plus a non-vacuity arm and a poisoned-key negative control",
 "The transcription is faithful; DRIFT_COUNT=0 is real work; the control convicts exactly one row",
 "Line-by-line diff of $SP2/T13-tools/golden-drift.probe.mjs against tests/property/generatorGoldenMaster.test.js at 7f974e855 (:765-856); diff probe vs negctl; read car5-drift logs",
 "Constants identical: TIERS/CULTURES(`[...CULTURE_PROFILE_KEYS, 'mediterranean']`)/TERRAINS/TERRAIN_ROUTE/TRADE(7)/THREAT. corpus(): same grid loop, TRADE sweep, mountain_pass+mountain row, THREAT sweep, 4 seeds × {auto, mountain} random_trade rows, 3 extra seeds, same keyOf dedupe. keyOf byte-identical. hashFor: both `generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })` → sha256(JSON.stringify). MANIFEST path identical (suite :856 / probe :48). Probe adds key-set equality exit 3 (:52-57). negctl diff = 4 lines poisoning `Object.keys(manifest).sort()[0]`. car5-drift.log `DRIFT_COUNT=0`; negctl `DRIFTED ROWS: 1 / 525 ... DRIFT_COUNT=1`.",
 "RATIFY", "CONFIRMED", "The hand copy is faithful in every row-generating statement; the only additions are the non-vacuity arm and the breakdown. The R5-class hazard did not bite here.")

add("§883.1 §RV3(2)", "FOUR MORE goldens run beyond the chair's named battery (three lit worldPulse masters + beliefMapGolden)",
 "A dormancy golden's green is not evidence about a lit path",
 "Read §E5.1(d)",
 "§E5.1(d): `… npx vitest run worldpulseDeityGolden worldpulseSeasonsGolden worldpulseSpatialGolden beliefMapGolden --maxWorkers=2 / Test Files 4 passed (4) Tests 20 passed (20) ... GREEN. Eight golden instruments across two engines`. The four named in §E5 were `generatorGoldenMaster spatialDigestGolden rumorLedgerGolden corruptionWebDormancyGolden` (4 files / 15 tests).",
 "RATIFY", "CONFIRMED", "Scope widening in the conservative direction; whether the battery should stay literal is the chair's call and does not change the finding.")

add("§883.1 §RV3(3)", "The reachability probe, and the conclusion that charter §7 row 1's premise is REFUTED (the generator corpus cannot see the cured sites)",
 "Static reachability from generateSettlementPipeline.js reaches corruption.js and canonicalRelationship.js only; worldPulse sites NOT REACHED; probe follows static and dynamic imports with a non-vacuity control",
 "Read $SP2/T13-tools/genreach.probe.mjs in full; cross-check with the landing's attribution (the one moved golden is a worldPulse golden, not the generator golden)",
 "genreach.probe.mjs: `:17 import ... from` regex, `:18 export ... from`, `:20 // DYNAMIC imports counted too ... /\\bimport\\s*\\(\\s*['\"]([^'\"]+)['\"]\\s*\\)/`, `:8 if (!spec.startsWith('.')) return null;` (relative specifiers only), `:28 control = ... cultureProfiles.js`, `:34 if (!control) process.exit(3)`. §E5.1(c): `213 modules reachable ... corruption.js REACHED · canonicalRelationship.js REACHED ... bandedStock · momentum ... NOT REACHED`. Landing §4.3a: the only moved golden is `momentumDormancyGolden` (worldPulse tick), and DRIFT_COUNT=0 held to pick 15 (854d80fea body).",
 "RATIFY", "CONFIRMED", "CONFIRMED for families (ii)+(iii) and, post hoc, for the whole train's effect on generatorGoldenMaster (0 drift through Car 5). The lane's own caveats (no barrel-rename laundering, no runtime injection; bare specifiers dropped) stand and were never contradicted by a measurement.")

add("§883.1 §RV3(4)", "Car 3's helper is halfLifeFactor in bandedStock.js, bare-factor, units documented as a same-unit RATIO; the header's 'Consumed by nothing at land time' sentence NOT edited",
 "bandedStock.js is the right home; the sentence is a dated statement, not a live invariant",
 "git show 7f974e855:src/domain/worldPulse/bandedStock.js sed 40-50 and grep halfLifeFactor",
 "Tip bandedStock.js: `125: * ⚠ UNITS — THE ONE INVARIANT. age and halfLife are consumed ONLY through their RATIO`, `134:export function halfLifeFactor(age, halfLife) {`. Header at tip: `42: * PURE. No world state, no store, no PRNG. Two imports and no more: the one time base, 43: * and the deterministic half-life kernel that halfLifeFactor delegates to (T13 Car 5 44: * family (i) — the sentence above used to read \"no imports beyond the time base\", and 45: * routing the decay made it false, so it is corrected here rather than left to rot). 46: * Consumed by nothing at land time — dark by construction (the lane-P precedent).`",
 "AMEND", "CONFIRMED", "The home and the units doc hold. But pick 15 rewrote the ADJACENT sentence (:42-45) precisely because a cure had falsified it, and left :46 standing beside a function with twelve consumers; by the lane's own rule ('a prose claim that a cure falsifies is retired BY the cure') :46 should be dated ('at land time, 2026-08-04') or retired. One line; hygiene, not a defect.")

add("§883.1 §RV3(5)", "couplingInclusion.walker.test.js promoted from an argument to a Car 3 PROOF",
 "The twelve new import edges mint no cross-layer pair; the walker run settles it",
 "git show -s --format=%b bd1fef1b8 | grep coupling; read §C3.0c and §C3.4",
 "bd1fef1b8 body `:43 couplingInclusion.walker GREEN — the twelve new import edges mint no cross-layer pair, because`; §C3.0c: `bandedStock.js — the import TARGET — is on ARGUED_UNLAYERED ... reads: Object.freeze([]) ... ⇒ PREDICTED: couplingInclusion.walker.test.js GREEN ... It is promoted to a Car 3 PROOF`. §C3.4 mutation control: `8 of 12 files red ... NOT CONVICTED BY ANY SUITE: dispositionLedger:468 · npcGrowthKernel:260 · npcLadderKernel:1038 · npcLadderState:241 · urbanFabricKernel:635`.",
 "RATIFY", "CONFIRMED", "The walker proves the graph claim; the separate 8/13 mutation result is a reach gap the commit names rather than hides — the two instruments are correctly kept apart.")

add("§883.1 §RV3(6)", "The 'dispositionLedger header sentence' retired in the same act, line-count neutral",
 "A prose claim falsified by the cure was retired by the cure",
 "git grep 'not yet been routed' at 9a0584f0f and 7f974e855; git show bd1fef1b8 | grep",
 "At C′: `tests/lint/transcendentalMathBaseline.test.js:84:// dispositionLedger.js:468 is one of the sites that has not yet been routed through it.` bd1fef1b8 diff `:378:-// dispositionLedger.js:468 is one of the sites that has not yet been routed through it.`; at 7f974e855 the phrase is absent from src and tests. No such sentence exists in any version of bandedStock.js or dispositionLedger.js (grep of 8b07ce45f/9a0584f0f/bd1fef1b8/bef11b0bd/7f974e855).",
 "AMEND", "CONFIRMED", "The retirement is real; the row's wording mis-homes it. The sentence was in the LEDGER TEST's header (tests/lint/transcendentalMathBaseline.test.js:84), not in a src header of dispositionLedger.js or bandedStock.js; the stratum should say so, since a future reader grepping src for it will find nothing.")

add("§883.1 §RV3(7)", "Car 3 EDITED but NOT COMMITTED during the chair's gate, rather than committed unproven or deferred whole",
 "'Never commit on red' is the tiebreak; the dock stayed dirty by design with a written resume path",
 "Read §C3.1 and RESUME POINT 17; §C3.4",
 "§C3.1: `⛔ NOT COMMITTED. The charter's law is gated on green — never commit on red, and the proofs this act owes are all vitest ... The chair's bare gate is running, so none of them may run. The edit waits in the dock, fully described here and reproducible from apply-car3.py`. RESUME POINT 17: `THE DOCK IS DIRTY BY DESIGN. READ THIS FIRST.` §C3.4: `CAR 3 LANDED: bef11b0bd. NINE COMMITS. PORCELAIN 0.`",
 "RATIFY", "CONFIRMED", "The alternative (a WIP commit) would have banked an unproven tree; the chosen posture was recorded where a successor would find it.")

add("§883.1 §RV3(8)", "The 5-second run that overlapped the gate's start was reported AGAINST ITSELF, with the rule it broke",
 "Honesty row; nothing to re-derive beyond the gate's first minutes",
 "Read §E5.1 honesty note",
 "§E5.1: `I put the board check and the run in ONE command, so the check could not gate the run: $CH/gate-coupled.log had just appeared (... started ~00:03 with a 180 s quiet window) and the command launched anyway at 00:02:44, finishing in 5.24 s ... The rule is that a board check must be its own command`.",
 "RATIFY", "CONFIRMED", "Self-report is accurate to the timestamps quoted; the landing's gate ran green first run (§883), so no consequence surfaced.")

add("§883.1 §RV3(9)", "Build #6 flagged to the chair as a live choice rather than assuming the import edges are free",
 "A NOT REACHED from a probe that excludes the ESD contribution is evidence, not proof",
 "Read §C3.0b",
 "§C3.0b: `The probe's seed set deliberately EXCLUDES the ENGINE_SHARED_DOMAIN contribution, so a NOT REACHED is evidence, not proof ... Build #6 is the reserve that can re-measure at the final tip ... Flagged to the chair as a live choice, not silently assumed away.` §C4: `Build #6, at 5eb02872d, measured closure RAW 1,048,196 / 1,048,000 — 196 B OVER.`",
 "RATIFY", "CONFIRMED", "The flag was vindicated: build #6 caught the breach the probe could not see.")

# ---- §RV3b addendum
add("§883.1 §RV3b(10)", "Family (i) RESEQUENCED to last and handed to Car 5",
 "It forces a ledger + describe deletion that moves four test titles, bankable only with the landing's --update",
 "Read §C4i.1; git show --stat 854d80fea",
 "§C4i.1: `halfLifeKeep takes bandedStock.js to ZERO census sites, which forces its DECLARED_OVERRUNS row to be deleted ... the emptied ledger reds its own non-emptiness floor ... Deleting that describe removes four test( titles`. Pick 15 `854d80fea`: `src/domain/worldPulse/bandedStock.js | 20 +-`, `tests/lint/transcendentalMathBaseline.test.js | 291 +++++++-------------------` (91+/220-); body: `The DECLARED-OVERRUN LEDGER ... is deleted whole`.",
 "RATIFY", "CONFIRMED", "The coupling is real and the landing banked it (ratchet 30731/2443 → 30788/2445, §883).")

add("§883.1 §RV3b(11)", "Build #6 SPENT on confirming a claim that could have been left PLAUSIBLE — and it caught the breach",
 "kernel 10,683→11,427 (+744) pushed closure to 1,048,196 vs 1,048,000",
 "Searched SP2 for a raw build #6/#6b log; read §C4; read commit message file",
 "§C4: `kernel 10,683 -> 11,427 (+744) <-- the cause`, `closure RAW 1,048,196 / 1,048,000 — 196 B OVER`. The figures also appear in `$SP2/T13-tools/car4vi-cure-msg.txt` and vite.config.js:604-606. No raw build #6 or #6b log exists under SP2 (grep for `1,048,196|1,047,496|11,427` hits only receipts/commit text/vite.config copies). The BUILD sequence's outcome is confirmed by the dock dist (see RV3b(13)).",
 "RATIFY", "PLAUSIBLE", "The decision is ratified on the receipt; the exact 1,048,196 / 11,427 figures survive only in prose, so they are PLAUSIBLE. Settling command: `npm run build` at 5eb02872d then VERIFY_DIST=1 vendorPdfLazy (a build — not run here).")

add("§883.1 §RV3b(12)", "The 196 B breach cured at the PLACEMENT, with NO ceiling ask",
 "One manualChunks rule; no ceiling constant touched; §880.8's raise stays banked unspent",
 "git show --stat 5b16cf468; diff of its vendorPdfLazy hunk; ledger §883 closure figure",
 "5b16cf468: `tests/build/vendorPdfLazy.test.js | 6 +++---`, `vite.config.js | 19 +++++++++++++++++++` — the test hunk is three comment lines (`- // detPow.js ... legitimately rides THIS chunk` → `+ // ... it DID ride this chunk ... at a MEASURED 744 B, so it is lazy now`), no budget constant. Ledger §883: `closure RAW 1,046,732 B against the UNRAISED CLOSURE_BUDGET_BYTES = 1_047_000 — 268 B of margin, so §880.8's owner-signed raise to 1,048,000 remains BANKED AND UNSPENT`.",
 "RATIFY", "CONFIRMED", "The cure is the placement and only the placement.")

add("§883.1 §RV3b(13)", "det-pow is its OWN chunk, not folded into det-math, because det-math is itself a first-paint closure member",
 "Build #6b returned the kernel chunk to 10,683 B exactly, which only happens if detPow left it entirely",
 "vite.config.js at tip; ls the dock's dist (build #7 at 822c4f93a, 03:50) and the landing dock's dist; grep the landing build log",
 "vite.config.js@7f974e855 `617: if (id.includes('/src/kernel/detPow.js')) 618: return 'det-pow';`. Dock dist `$SP2/laneT13-tree/dist/assets/`: `kernel-BtwewuzB.js 10683` (Sep 2 03:50), `det-pow-COyTktyy.js 741`, `det-math-BvTfuDJc.js 1003`. The content-hash `BtwewuzB` is the SAME as the step-6 base build's `kernel-BtwewuzB.js, 10,683 B` in §C1.5 — byte-identical chunk. Landing build log t13land-build.log `:390 dist/assets/kernel-BtwewuzB.js 10.68 kB`, `:81 det-pow-COyTktyy.js 0.74 kB`.",
 "RATIFY", "CONFIRMED", "The chunk figure is corroborated by two dists and a build log, not just the receipt. Note (beyond-row): the rationale's premise — det-math a closure member — was true at build #6 and went stale one pick later at P′; see beyond findings.")

add("§883.1 §RV3b(14)", "Two stale prose claims retired by the cures that falsified them (moralDrift ZERO-imports header; vendorPdfLazy detPow comment), line-count neutral",
 "Both sentences made claims the cures falsified",
 "git log -p 9a0584f0f..7f974e855 -- src/domain/spatial/moralDrift.js; 5b16cf468 test hunk",
 "moralDrift.js (path is src/domain/spatial/, touched by b43e4264a family (vi)): `-* drift cannot perturb any other layer's PRNG stream. ZERO imports (the nested-ledger` → `+* ... ONE import since T13 Car 4 (vi) — the` plus `+import { detIntPow } from '../../kernel/detMathDecay.js';`. vendorPdfLazy hunk at 5b16cf468: 3 lines −/3 lines + (quoted under RV3b(12)).",
 "RATIFY", "CONFIRMED", "Right, not merely tidy — each sentence would have handed a future lane a false invariant.")

add("§883.1 §RV3b(15)", "Family (v)'s commit NAMES its two suite-less sites rather than reporting a green that means less than it looks",
 "Coverage gap belongs on the landing bill",
 "git show -s --format=%b db81d01c8 | grep suite",
 "db81d01c8 body `:17 ⚠ TWO OF THESE FOUR SITES HAVE NO SUITE OF THEIR OWN, and this commit says so rather than`, `:32 Suites: 14 files, 223 tests, TRUE_EXIT=0.` Commit subject: `... and the two sites with no suite of their own are named, not covered over`.",
 "RATIFY", "CONFIRMED", "Honesty row; nothing to reverse.")

# ---- §883.2 T13-PRELAND
add("§883.2 R-T13P-1", "Car 5 lands as TWO commits split at the byte boundary",
 "Family (i) + ratchet retirement must be one commit; the ban moves no byte and is separable",
 "git show --stat 854d80fea and 94dbe1355",
 "854d80fea: `src/domain/worldPulse/bandedStock.js | 20 +-`, `tests/lint/transcendentalMathBaseline.test.js | 291`. 94dbe1355: `eslint.config.js | 75 +++`, `tests/lint/determinismBanCoverage.test.js | 104 +++` — zero src bytes. 854d80fea body: `the declared-overrun ledger's exactness arm reds the instant the site is cured while its row still stands, so the cure and the retirement are one commit or neither is green`.",
 "RATIFY", "CONFIRMED", "The split is exactly where the receipt says.")

add("§883.2 R-T13P-2", "The ban lands in EIGHT blocks and src/domain/clock.js gets a NEW block",
 "clock.js sat in a census tree with no no-restricted-syntax block at all; last-wins makes a narrow block a hole",
 "grep eslint.config.js at 7f974e855 and 9a0584f0f",
 "eslint.config.js@7f974e855 `...TRANSCENDENTAL_BAN` spread at lines 245, 307, 346, 374, 453, 498, 538, 594 (eight blocks); `343: files: ['src/domain/clock.js']` with `345: 'no-restricted-syntax': ['error'`; the domain block `370: files: ['src/domain/**/*.js'] 371: ignores: ['src/domain/clock.js']`. At C′ (9a0584f0f) the only clock.js mention is `301: ignores: ['src/domain/clock.js']` — no block of its own.",
 "RATIFY", "CONFIRMED", "The hole was real at C′ and is closed at the tip.")

add("§883.2 R-T13P-3", "The roster floor: TRANSCENDENTAL_FNS.length >= 22, sqrt absent, 14 named members",
 "Config and pin both derive from TRANSCENDENTAL_FNS, so deleting a member weakens ban and pin in lockstep",
 "git show 7f974e855:scripts/count-transcendental-math.mjs; 94dbe1355 test diff",
 "count-transcendental-math.mjs@tip `:46 export const TRANSCENDENTAL_FNS = [ 'acos','acosh','asin','asinh','atan','atan2','atanh','cbrt','cos','cosh','exp','expm1','hypot','log','log10','log1p','log2','pow','sin','sinh','tan','tanh' ]` = 22, no sqrt. Test: `expect(TRANSCENDENTAL_FNS.length, ...).toBeGreaterThanOrEqual(22)`; `expectAbsentWithAnchor(TRANSCENDENTAL_FNS, 'sqrt', 'pow', ...)`; `for (const fn of ['pow','exp','log','log2','log10','sin','cos','tan','tanh','atan2','hypot','cbrt','expm1','log1p'])` = 14; `expect(TRANSCENDENTAL_SELECTORS.length).toBe(TRANSCENDENTAL_FNS.length + 2)`. eslint.config.js `:32 import { TRANSCENDENTAL_FNS } from './scripts/count-transcendental-math.mjs'`.",
 "RATIFY", "CONFIRMED", "The floor is tight at 22 (monotone-up) and the 14 named members make it more than a threshold constant; the `+2` selector arm ties the ban's `**`/`**=` operators to the roster. Refutation attempt (a shrink that keeps the 14) fails the length arm.")

add("§883.2 R-T13P-4", "Own un-anchored negative cured with expectAbsentWithAnchor; the follow-up comment REPHRASED rather than `// anchored:`-annotated",
 "The escape hatch is for structurally anchored lines; annotating would bank a permanent exemption",
 "grep the 94dbe1355 diff",
 "94dbe1355 diff: `254:+import { expectAbsentWithAnchor } from '../helpers/anchoredNegatives.js';`, `394:+    expectAbsentWithAnchor(` with the in-test comment `⛔ ANCHORED, and the estate's own walker is why. This was first written as a bare exclusion matcher, and tests/lint/negativeAssertionAnchor.walker.test.js convicted it on the spot`. No `// anchored:` annotation appears in the diff.",
 "RATIFY", "CONFIRMED", "Correct use of the anchor helper over the annotation escape hatch.")

add("§883.2 R-T13P-5", "No golden re-recorded and none proposed (DRIFT_COUNT=0 over 525, control convicting at 1); the declared window left open and unspent — and the stratum's note that this reading was TRUE at the dock and FALSE at the composed tip",
 "Family (i)'s 1-ULP shift reaches no persisted byte; the momentum golden's later re-record belongs to another cause",
 "Read car5-drift logs; fixture blobs across C′/dock/tip; receipt :3493; ledger §882.9 amendment A5",
 "car5-drift.log `DRIFT_COUNT=0`, negctl `DRIFT_COUNT=1`. Fixture `tests/fixtures/momentum-dormancy-golden.json`: 32f9bf326 at 9a0584f0f, 9f0df13a1 and bef11b0bd; 7a92f25c4 at 7f974e855. BUT receipt :3493: `momentumDormancyGolden | [\"mo-b|8|one_month\"] | identical | PRE-EXISTING` (already RED at the dock before Car 5, proven by archive control at 822c4f93a); §882.9 A5: `momentumDormancyGolden.test.js, key mo-b|8|one_month, RED at 822c4f93a and 9f0df13a1, GREEN at C′`. §C5.10 RESUME table lists it among `banked reds at this tip, ALL proven pre-existing`.",
 "AMEND", "CONFIRMED", "The lane's call is right and scoped ('unspent by this family'). The STRATUM's gloss is wrong-shaped: 'no golden moved' was not true at the dock — the momentum row was a KNOWN banked red there, attributed to pick 8 (attrition.js) at the landing. R-T13L-3 is the ATTRIBUTION of a known red, not the discovery that the dock-true reading became tip-false. Reword the re-derive note accordingly.")

add("§883.2 R-T13P-6", "The kernel's docblock over-claim corrected in the commit body, not by editing detMathDecay.js",
 "Editing a Car 1 kernel file from Car 5 would move a line-count in an un-re-proven file",
 "git diff --stat 754856b12 9f0df13a1 -- src/kernel/detMathDecay.js; grep tip and ca651d54b for the sentence; commit body",
 "`git diff --stat 754856b12 9f0df13a1 -- src/kernel/detMathDecay.js` is EMPTY (file untouched across Car 5). detMathDecay.js@7f974e855 `88: * detPow(0.5, k) route AND makes whole-period decay EXACT — at k = 1, 2, 3 …` still present, and still present at ca651d54b (§890): `88:` identical; `git log 7f974e855..ca651d54b -- src/kernel/detMathDecay.js` is empty. 854d80fea body: `One correction to the kernel's own docblock while we are here: it implies rounding-to-nearest makes whole-period decay exact where the platform's is not; measured, BOTH are 41/41 exact`.",
 "RATIFY", "CONFIRMED", "The call was right for Car 5. The deferred edit ('edit the kernel docblock in a later car') has not happened by §890 and is recorded only in a commit body and this retro row's veto shape — see beyond findings.")

# ---- §883.3 T13-land
add("§883.3 R-T13L-1", "CR-17(a) executed as (b) for row 11 as well as row 12: the dock-bound probe printed 686 mismatches (pick 15's ULP shift, not a Car 3 refutation); the re-pointed copy gives 8988/0",
 "The dock advanced to Car 5 so the dock-bound instrument silently changed meaning",
 "rev-parse bandedStock.js blobs at bef11b0bd/bd1fef1b8/f95305812/854d80fea/9f0df13a1/7f974e855; diff the two probes; car5-shift.log",
 "bandedStock.js blobs: bef11b0bd=db2bbf920, bd1fef1b8=db2bbf920 (landing pick 9 = dock Car 3 exactly); f95305812=b87fb631d, 854d80fea=b87fb631d, 9f0df13a1=b87fb631d, 7f974e855=b87fb631d. `diff halflife-bit.probe.mjs halflife-bit-composed.probe.mjs` → only line 4: `../laneT13-tree/src/...` vs `/…/laneINSTRLAND-tree/src/domain/worldPulse/bandedStock.js`. car5-shift.log: `DOMAIN: 8988 (age, halfLife) pairs ... BIT-DIFFERENT: 686 (7.632 %)` — the same 686.",
 "RATIFY", "CONFIRMED", "Every blob fact the row rests on reproduces; the 686 is pick 15's own declared figure, so the re-point was the only honest move.")

add("§883.3 R-T13L-2", "Reworded its own explanatory comment because the first draft QUOTED the parking construct verbatim (THE CITATION LAW, self-caught)",
 "The lighting walker's parkedFor reads source text; a parked implementationPackets.test.js would cost titles −17 and move a ceiling",
 "grep -c '\\.each(\\|\\.for(' on the test at tip; grep parkedFor in the walker",
 "`git show 7f974e855:tests/scripts/implementationPackets.test.js | grep -c '\\.each(\\|\\.for('` → **0**. sovereigntyLightingContract.walker.test.js@tip `1813:  const parkedFor = (src) => parkReasonsFor(withVitest(src));` (source-text based). Landing §2.4a: `The grep that caught it was the ⟦A12⟧ check itself (grep -c '\\.each(\\|\\.for(' → 1); the comment was reworded ... and the count is now 0.`",
 "RATIFY", "CONFIRMED", "The tip state matches the receipt's post-rewording count; the hazard class is the one the memory index names as THE CITATION LAW.")

add("§883.3 R-T13L-3", "The moved golden attributed by BLOB revert and directory→pick→file bisection, not by the order's nine-rung ladder in sequence; the answer (attrition.js at pick 8, family (iii)) contradicted the chair's named cause (momentum.js / Car 3 / pick 9)",
 "git apply -R of Car 3's patch fails because pick 15 rewrote bandedStock.js; each rung's tree state is named",
 "Read t13land-ladder-*.log; rev-parse momentum.js and attrition.js blobs across picks; show pick 8's attrition diff; read §882.9 A5",
 "Ladder logs: control `FAIL ... expected [ 'mo-b|8|one_month' ] to deeply equal []`; 1a (momentum.js→C′ blob) still FAIL; 2 (all T13 src→C′) `6 passed`; 3 (worldPulse only) FAIL; at-c17345595 (pick 7) `6 passed`; at-da8cd72fb (pick 8) FAIL. Blobs: momentum.js 9ae295deb at 8b07ce45f/9a0584f0f, c8a4d5e99 at bef11b0bd/bd1fef1b8/7f974e855 (one pick, as the chair read); attrition.js 4646eded at 26db9e545 (pick 7) → c36995747 at c8dbdfd83 (pick 8) with `-  const logRatio = Math.log(a / d); +  const logRatio = detLn(a / d);`. §882.9 A5 had named `momentum.js c8a4d5e99 at the tip, Car 3 / pick 9`.",
 "RATIFY", "CONFIRMED", "Rungs 1a, 2, 3, 4, 5 reproduce from the logs on disk; the per-file rung 6 has a single green run in t13land-ladder-one.log, so the five-file split (attrition RED, four GREEN) rests on the receipt table rather than five separate logs — the pick-8 diff (only attrition.js gains a detLn call among the five) makes it the only candidate anyway. The chair's cause is refuted.")

add("§883.3 R-T13L-4", "HK-5 shaped as a ROSTER of five explicit §479.2 paths rather than a docs/ prefix, and five anchored shapes",
 "ARCHITECTURE.md is at the repository root, unreachable through DOCS_PATH_PREFIX",
 "git show 7f974e855:scripts/implementation-packets.mjs",
 "implementation-packets.mjs@tip `127:const MIGRATION_HEAD_FIGURE_PATHS = Object.freeze([ 'docs/DEPLOY.md', 'ARCHITECTURE.md', 'docs/CURRENT_STATE.md', 'scripts/ops/migrationRehearsalCore.mjs', 'docs/ops/MIGRATION_REHEARSAL_RUNBOOK.md' ]);` (five), `138:const MIGRATION_HEAD_FIGURE_SHAPES` with five `{ what, pattern }` rows; `74: const DOCS_PATH_PREFIX = 'docs/'` and `125-126: ARCHITECTURE.md is at the repository ROOT, so it is deliberately NOT reachable through DOCS_PATH_PREFIX`. Landing §2.4: `implementationPackets 18/18 ... validate:packets → valid: 182 packets`.",
 "RATIFY", "CONFIRMED", "The concrete reason for a roster over a prefix holds at the tip.")

add("§883.3 R-T13L-5", "§2.2 re-worded to say cross-engine identity is 'not OBSERVED here' rather than claiming it is now guaranteed",
 "The kernels make it true by construction; the first cross-engine observation is the owner's walk",
 "git show dbe469084 diff",
 "dbe469084: `- * cross-engine identity is NOT — scripts/count-transcendental-math.mjs grandfathers a non-zero transcendental baseline` → `+ * cross-engine identity is not OBSERVED here — scripts/count-transcendental-math.mjs ONCE grandfathered a non-zero transcendental baseline; T13 TRANS (ODQ §883) drove it to ZERO with an eslint ban behind it, so Math no longer forks same-seed worlds by engine.` 4 lines −/4 lines + (line-count neutral).",
 "RATIFY", "CONFIRMED", "Does not overclaim in the headline. The trailing clause 'so Math no longer forks same-seed worlds by engine' is implicitly scoped to the six census trees plus the banned globs; it reads a little stronger than the census strictly proves, but the Node-major refusal reason (same-engine identity) is preserved.")

add("§883.3 R-T13L-6", "R5a names resolveResources.js:131's terrainSpecific filter as the live gate and demotes getCompatibleResources to a pre-screen",
 "The filter is the gate the tests' claims rest on",
 "git show 7f974e855:src/generators/steps/resolveResources.js sed 128-134; df98850a3 diff",
 "resolveResources.js@tip: `const compatible = getCompatibleResources(tradeRoute, terrainOverride).filter(r => r.compatible).map(r => r.key); ... 131: const terrainSpecific = compatible.filter(k => RESOURCE_DATA[k]?.terrain === terrainOverride);`. df98850a3: `-  // resource, and never a mountain one (getCompatibleResources gates each` → `+  // filter on RESOURCE_DATA[k].terrain; getCompatibleResources only pre-screens).`",
 "RATIFY", "CONFIRMED", "Line 131 is where the terrain gate actually lives.")

add("§883.3 R-T13L-7", "The close act and the fence re-arm landed as ONE commit",
 "The order permits either and asks the choice be recorded",
 "git show --stat 2eeba172d",
 "2eeba172d `THE CLOSE ACT: T13 TRANS's SHIFT RECORD, and the espionage fence re-armed to {LIGHTING WAVE}`: `tests/property/espionageDormancyFence.test.js | 37 ++++++++-`, `tests/property/generatorGoldenMaster.test.js | 108 +++`.",
 "RATIFY", "CONFIRMED", "Choice recorded; nothing else to weigh.")

add("§883.3 R-T13L-8", "ENGINE-HYGIENE block's live scope sentence marked 'SPENT AND SUPERSEDED' rather than deleted; the new fence block NAMES the momentum flip though it is outside the fence's corpus",
 "A seal that hides a mover is worth nothing",
 "git show 2eeba172d -- tests/property/espionageDormancyFence.test.js | grep",
 "espionageDormancyFence.test.js hunk: `88:+ * here because a seal that hides a mover is worth nothing: momentumDormancyGolden's`, `114:+ * window was exactly **{T13 TRANS}** — SPENT AND SUPERSEDED by the T13 TRANS block`, `126:+ ... (§883); exactly ONE remains: the LIGHTING WAVE (§881.4).'`. Landing §2.7: `fence 21/21 with its ✓ title`.",
 "RATIFY", "CONFIRMED", "Both halves of the call are in the landed diff.")

add("§883.3 R-T13L-9", "DEVIATION 2: §5.4 batches 1/3/4, §5.5's 761-file consumer census and §5.6.1 taken as SUBSUMED by the plain ratchet gate, with tests/build run separately (52/440)",
 "The plain gate ran every test file except tests/build/** at the exact committed tip and found exactly the ten banked failures",
 "Read scripts/check-test-ratchet.mjs at tip; count test files at tip; read ratchet-plain-t13.log and t13land-build-batch.log; wc the four lists",
 "check-test-ratchet.mjs@tip `103:export const SOURCE_TEST_EXCLUDE = 'tests/build/**';` `163: return \\`npx vitest run --exclude=${JSON.stringify(SOURCE_TEST_EXCLUDE)} ...\\``. Test files at 7f974e855: 2497 total, 52 under tests/build ⇒ 2445 = the ratchet's `totalFiles 2445`. ratchet-plain-t13.log: `=== PLAIN RATCHET GATE START 11:39:10 pid=98323 HEAD=7f974e855 TIER=exclusive === PORCELAIN_PRE=0 [test-ratchet] OK — no test regressions (10 known failure(s) of 30788 tests, ceiling 10). GATE_EXIT=0 PORCELAIN_POST=0`. t13land-build-batch.log: `Test Files 52 passed (52) Tests 383 passed | 57 skipped (440)`. Lists on disk: scanners 394, consumers 761, treescan 83, family70 70 lines.",
 "RATIFY", "CONFIRMED", "The argument is sound: the gate's corpus (every test file outside tests/build, 2445 files) is a strict superset of each curated batch, it ran at the committed tip, its per-test census would fire on any new red, and the one excluded directory was run by name. The only thing lost is per-batch timing, which §5.4 never asked for.")

add("§883.3 R-T13L-10", "DEVIATION 1: artefacts to $SP/t13land-* instead of $ME — the chair's brief overrode the order (the chair's error)",
 "No file was written under $ME by this lane",
 "grep the order for $ME routes; read brief line 1; list $ME files modified in the lane's window",
 "T13-LANDING-ORDER.md `:350 | 3.5.1 | cd $D && npm run build > $ME/build-t13.log 2>&1`. brief-T13LAND.md `:1 ... ME=/private/tmp/.../58f0a8e2-.../scratchpad (this chair's; write nothing there ...)`. Files under $ME with mtime in 10:20–12:10 on 09-02: `queue-882.{9..14}.md`, `msg-882.{9..14}.txt`, `retro-audit`, `g0-fold` — all the chair's own; `gate-t13.log` is 12:10–12:28 (the chair's bare gate, after the lane's HOLD). 60+ `t13land-*` artefacts sit under $SP2.",
 "RATIFY", "CONFIRMED", "The brief and the order conflicted; the lane obeyed the brief and declared it before acting. The conflict is the chair's, as the stratum says.")

add("§883.3 R-T13L-11", "The OSR --write's 1283-line diff accepted as provenance reconciliation on a deep object comparison, not on reading the diff",
 "total/identities/inventory/rowTags/schema byte-identical; only stamps and provenance moved",
 "Own node deep-compare of b0c3e2bb4 vs 7f974e855 scripts/.observed-shape-readers-baseline.json (read-only; outputs to my scratch dir)",
 "My compare: `total IDENTICAL 1993 · identities IDENTICAL 1409 · inventory IDENTICAL objkeys=388 · rowTags IDENTICAL objkeys=38 · schema IDENTICAL 15 · minRows IDENTICAL 40 · migrationReview IDENTICAL · corpusMeta IDENTICAL · _doc IDENTICAL`; MOVED = `digests, frozen (2026-09-01→), frozenAtSha (c28c7b43c→), manifests, scanStats, scannerProvenance, sentinel` — exactly the receipt's seven. Commit `7f974e855 ... scripts/.observed-shape-readers-baseline.json | 1283 ++++----` (820+/463−).",
 "RATIFY", "CONFIRMED", "Reproduced independently; the diff's size is manifest provenance, not movement.")

add("§883.3 R-T13L-12", "ITS OWN PROCESS FAULT, self-reported: ended a turn with the detached EXCLUSIVE --update still running; the run was polled to exit in-lane and collected from its own log; the later plain gate was outlasted",
 "No figure was banked from an uncollected run",
 "Read the runner scripts and their redirect targets ratchet-update-t13.log / ratchet-plain-t13.log",
 "t13land-run-ratchet-update.sh redirects to `$SCR/ratchet-update-t13.log`; that log: `=== RATCHET UPDATE START 11:13:38 pid=68921 HEAD=e06ea94d1 TIER=exclusive === [test-ratchet] baseline updated: 10 failing test(s) remain, 0 removed. UPDATE_TRUE_EXIT=0 === DONE 11:34:12 ===`. Plain gate log: START 11:39:10 HEAD=7f974e855 … GATE_EXIT=0 … DONE 11:59:22. Receipt §3.4.2: `The chair caught it at 11:16 ET ... it was polled in-lane to exit and collected from its own log.` Commit b0c3e2bb4 at 11:35 (t13land-commit-ratchet.log mtime 11:35) is AFTER the 11:34:12 DONE.",
 "RATIFY", "CONFIRMED", "The fault is real and the recovery is on disk: the exit was read from the log before the commit was cut, and the plain gate was run start-to-finish afterwards. The two `.nohup` files are 0 bytes because the scripts redirect internally — not a missing receipt.")

add("§883.3 R-T13L-13", "R1 executed as the chair-call it is: a hidden fork feature retired — opening map/index.html bare loses the 3D scene/globe preview and OBJ export; the shipped realm map never reaches them",
 "sf-bridge.js:193 hides #optionsContainer in embedded mode and 3d.js is the only loader",
 "git show --stat 9757a5e1c; git grep the five lib filenames across public/map at tip and C′; read sf-bridge.js:185-200, 3d.js loaders and callers, hotkeys.js, mapRuntimeConfig.js",
 "9757a5e1c deletes `public/map/libs/{three,orbitControls,mapControls,objexporter,loopsubdivison}.min.js` + 40 manifest lines (205 deletions). Sole loader at tip and C′: `public/map/modules/ui/3d.js:723/735/824/836/848 script.src = \"libs/…\"`; no `<script>` tag in index.html for any of them. Embedded: `sf-bridge.js:193 body.sf-embedded #optionsContainer { display: none !important; }`; hotkey `hotkeys.js:32 else if (code === \"KeyO\" && byId(\"canvas3d\")) toggle3dOptions();` fires only once a 3D canvas exists. Graceful failure: `3d.js:257 const loaded = await loadTHREE(); 258 if (!loaded) return tip(\"Cannot load 3d library\", ...)`. `validate:map` → `135 vendored libs`.",
 "RATIFY", "CONFIRMED", "Unreachable from the embedded surface, and degraded gracefully (a toast, not a hang) if reached bare. One caveat the row already carries: `/map/` is publicly served (`src/lib/mapRuntimeConfig.js:85 frameUrl.pathname.endsWith('/map/')`), so a person CAN open it bare — the lane correctly marked the row owner-visible with a one-word restore.")

# ---- chair's own faults
add("§883 chair fault (a)", "The brief that overrode the order's artefact path (R-T13L-10)",
 "The chair wrote 'write nothing there' into the brief while the order routed logs to $ME",
 "brief-T13LAND.md line 1 vs T13-LANDING-ORDER.md:350",
 "brief-T13LAND.md:1 `ME=... (this chair's; write nothing there; this brief is at $ME/briefs/brief-T13LAND.md)`; order :350 `npm run build > $ME/build-t13.log`; also `$ME/census-<sha>`, `$ME/tipcopy-<n>` per the receipt's DEVIATION 1.",
 "RATIFY", "CONFIRMED", "Self-report is accurate; the lane's deviation was the correct resolution.")

add("§883 chair fault (b)", "The CR-14 attribution that was wrong and survived only because the ruling said 'confirm, never assume' (§882.15)",
 "§882.9's A5 named momentum.js / Car 3 / pick 9; the measured cause is attrition.js / pick 8",
 "Ledger 32358 (§882.9) and 32365 (§883); ladder logs and blobs (see R-T13L-3)",
 "§882.9 (ledger:32358): `⟦A5 · COMP-1⟧ a NEW §4.2 row 5b — tests/property/momentumDormancyGolden.test.js, key mo-b|8|one_month, RED at 822c4f93a and 9f0df13a1, GREEN at C′ (... momentum.js c8a4d5e99 at the tip, Car 3 / pick 9)`. §883: `The chair's §882.9 ruling named a probable cause (Car 3 / pick 9, via momentum.js) and said \"CONFIRM it, never assume it\"; the lane confirmed and it was FALSE`. Ladder rung 1a: momentum.js reverted to C′ blob → still RED.",
 "RATIFY", "CONFIRMED", "The fault and its containment are both on the record; the stratum cites §882.15 for the 'confirm, never assume' phrase while the ledger's §883 row attributes the ruling to §882.9 — the phrase itself is in 32364/32365, not in 32358, a citation wobble worth one word.")

add("§883 chair fault (c)", "The first chair-verify pass whose three shell checks were all wrong from the zsh no-split hazard, now run in Python (§882.15)",
 "zsh does not word-split an unquoted parameter; `${s%%:*}` mangled the fixture check; an awk index error",
 "Ledger 32364 text; reproduced the sibling hazard in this run",
 "§882.15 (ledger:32364): `the chair's first chair-verify ran §6.3.5, §6.3.8 and ⟦A14⟧ as SHELL loops and all three were wrong — zsh does not word-split an unquoted parameter so the blob comparator iterated once over the whole path list (a meaningless moved=1), a ${s%%:*} parse mangled the fixture check, and an awk index error ... Re-run in Python`. Corroboration from THIS walk: my first `git rev-parse $s:src/domain/worldPulse/bandedStock.js` under zsh printed the COMMIT sha for every input (zsh parsed `:s` as a history modifier) — the same family the ledger records at :32132/:32167; `${s}:path` fixed it.",
 "RATIFY", "CONFIRMED", "The fault is self-reported accurately, and the hazard is live enough that it bit this verifier too.")

beyond = [
 "vite.config.js det-pow rationale carries a FALSE present-tense premise at the landed tip: lines 609-612 (still `ca651d54b:vite.config.js:610`) say `the det-math CORE chunk is itself a first-paint closure member (the two eager sites call detExp/detLog10)` — but P′ (754856b12, one pick later) retired both eager sites, and §883 records `no det-* chunk in the closure`. 5b16cf468..7f974e855 touched vite.config.js in no other commit. The det-pow chunk decision is harmless; the comment now misdescribes why it exists and should be re-dated to 'true at build #6, moot after P′'.",
 "R-T13P-6's deferred docblock correction is still outstanding at §890: `src/kernel/detMathDecay.js:88 * detPow(0.5, k) route AND makes whole-period decay EXACT` is unchanged at ca651d54b (no commit touched the file in 7f974e855..ca651d54b), while 854d80fea's body measured both platform and kernel 41/41 exact. The only records are the commit body and the retro row's veto shape — no landing bill or plan doc carries it; it should ride the LIGHTING WAVE's hygiene list so it is not re-found.",
 "The stratum's R-T13P-5 re-derive note ('TRUE at the dock and became FALSE at the composed tip') contradicts two primary records: receipt :3493 marks momentumDormancyGolden `PRE-EXISTING` at the dock before Car 5, and §882.9 A5 records it `RED at 822c4f93a and 9f0df13a1, GREEN at C′`. The momentum row was a KNOWN banked red at the dock; the landing attributed it (to pick 8) and re-recorded it. R-T13L-3 corrects the chair's CAUSE, not the lane's 'no golden moved' reading, which was scoped to family (i) and holds.",
 "§RV3(6) mis-homes the retired sentence: it lived at `tests/lint/transcendentalMathBaseline.test.js:84` (`// dispositionLedger.js:468 is one of the sites that has not yet been routed through it.`, deleted at bd1fef1b8 diff :378), not in dispositionLedger.js's or bandedStock.js's header — a grep of src for it finds nothing in any version.",
 "bandedStock.js:46 `Consumed by nothing at land time — dark by construction (the lane-P precedent).` survives at 7f974e855 beside twelve live consumers of halfLifeFactor, one line below a sentence pick 15 rewrote for exactly that reason (:42-45). Hygiene, one line.",
 "No raw build #6 / #6b log survives on disk: the figures 1,048,196 / 11,427 / 1,047,496 exist only in the receipt, `T13-tools/car4vi-cure-msg.txt` and the vite.config.js comment. The cure's OUTCOME is independently confirmed (dock dist 03:50: kernel-BtwewuzB.js 10,683 B with the base build's content hash; det-pow-COyTktyy.js 741 B; landing build log :390/:81), but the breach figure itself is prose-only.",
 "RV(3)'s label 'away from the charter's literal shapes' overstates: charter §3.3 says `implementation's choice` for detExp and §3.1/§3.5 prescribe budgets and an exp2Det basis, not a reduction rule or a tanh quotient. The three changes departed from the NAIVE/precedent spellings (detPow's flooring idiom, the textbook (1-u)/(1+u)), forced by 11 of 41 measured arm failures.",
 "RV(5)'s 2,086 B figure is minifier-version-bound: the repo now carries esbuild 0.28.2 (receipt used 0.28.1) and re-minifying 3b56c8e32's detMath.js gives 2,116 B. Immaterial to the STOP (both exceed 995 B) but a future re-derivation will not reproduce 2,086 exactly.",
 "Citation wobble in the chair-fault list: the stratum attributes 'confirm, never assume' to §882.15 while ledger §883 attributes the momentum cause-naming to §882.9; the phrase appears at ledger lines 32364/32365 (§882.15/§883), the cause-naming at 32358 (§882.9 A5). Both rows exist; the stratum should cite both.",
 "The zsh `$sha:path` → `:s` modifier hazard the chair recorded at §882.15 (and the ledger at :32132/:32167) is live: it bit this verifier's first blob census in this run. Any receipt figure derived from an unquoted `$var:path` under zsh should be treated as suspect until re-run with `${var}:path`."
]

chair_errors = [
 "CONFIRMED: the T13-land brief (`brief-T13LAND.md:1` 'write nothing there') contradicted the landing order's `$ME/build-t13.log` / `$ME/census-*` / `$ME/tipcopy-*` routes (order :350) — R-T13L-10.",
 "CONFIRMED: §882.9 ⟦A5⟧ named momentum.js / Car 3 / pick 9 as the momentum golden's cause; the blob-revert ladder shows momentum.js reverted alone still RED and the flip at pick 8 (attrition.js `Math.log → detLn`) — the chair's attribution was false.",
 "CONFIRMED: §882.15's self-reported first chair-verify pass (three zsh shell loops, all wrong) — recorded verbatim at ledger :32364; the same zsh modifier hazard reproduced in this walk.",
 "NOT self-reported (found here): the stratum's re-derive gloss on R-T13P-5 ('TRUE at the dock, FALSE at the composed tip') is wrong-shaped — the momentum row was already a banked PRE-EXISTING red at the dock (receipt :3493; §882.9 A5 'RED at 822c4f93a and 9f0df13a1').",
 "NOT self-reported (found here): the stratum's §RV3(6) wording homes the retired sentence in a src header; it was in tests/lint/transcendentalMathBaseline.test.js:84."
]

commands = [
 "mkdir -p …/walk/S09; printf '{\"slice\": \"S09\", \"status\": \"PARTIAL\", \"calls\": []}' > …/walk/S09.json",
 "sed -n '147,174p' …/stratum/full.md",
 "grep -n '^## \\|^### ' $SP2/laneT13-receipt.md; sed -n '721,772p;2431,2471p;2761,2785p;3582,3611p;2132,2170p;2219,2284p;303,350p;2684,2726p;2649,2670p;2852,2935p;351,399p;538,614p;501,530p;941,965p;2293,2350p;1969,1994p;1995,2026p;2613,2631p;159,210p' $SP2/laneT13-receipt.md",
 "grep -n '^## \\|^### \\|DEVIATION\\|R-T13L-' $SP2/laneT13LAND-receipt.md; sed -n '449,470p;235,268p;121,130p;171,190p;417,433p;349,385p;394,404p;470,478p' $SP2/laneT13LAND-receipt.md",
 "sed -n '32365,32373p' $R/docs/OWNER_DECISION_QUEUE.md | cut -c1-3000; sed -n '32358p;32364p' … | grep -o (momentum / zsh excerpts); grep -n 'CONFIRM it, never assume it\\|no-split\\|zsh' $R/docs/OWNER_DECISION_QUEUE.md",
 "git -C $SP2/laneT13-tree rev-parse HEAD; git -C $SP2/laneT13-tree status --porcelain (before and after); same for $SP2/laneINSTRLAND-tree",
 "git -C $R log --oneline 9a0584f0f..7f974e855; git -C $R log --stat 9a0584f0f..7f974e855 -- map (empty); git -C $R show --stat 9757a5e1c 5b16cf468 754856b12 94dbe1355 854d80fea 66c9abaac 2eeba172d e62d57bf8 df98850a3 dbe469084 7f974e855 bd1fef1b8 e5179599b e06ea94d1",
 "git -C $R show 7f974e855:vite.config.js | sed -n '555,625p'; git -C $R show ca651d54b:vite.config.js | grep -n 'det-math CORE chunk is itself'",
 "cat -n $SP2/T13-tools/golden-drift.probe.mjs; diff golden-drift.probe.mjs golden-drift-negctl.probe.mjs; git -C $R show 7f974e855:tests/property/generatorGoldenMaster.test.js | sed -n '759,856p' (constants, corpus, keyOf, hashFor, MANIFEST)",
 "diff $SP2/T13-tools/halflife-bit.probe.mjs $SP2/T13-tools/halflife-bit-composed.probe.mjs; grep BIT-DIFFERENT $SP2/car5-shift.log; grep DRIFT $SP2/car5-drift*.log",
 "for s in …; do git -C $R rev-parse \"${s}:src/domain/worldPulse/bandedStock.js\"; done (bef11b0bd bd1fef1b8 f95305812 854d80fea 9f0df13a1 9a0584f0f 7f974e855 8b07ce45f); same for momentum.js, attrition.js, tests/fixtures/momentum-dormancy-golden.json; git show c8dbdfd83 -- src/domain/worldPulse/attrition.js",
 "grep -h 'Test Files\\|FAIL\\|mo-b' $SP2/t13land-ladder-{control,1a,2,3,at-c17345595,at-da8cd72fb,one}.log",
 "cat $SP2/t13land-run-ratchet-{update,plain}.sh; grep … $SP2/ratchet-update-t13.log $SP2/ratchet-plain-t13.log; wc -c the .nohup files; grep 'Test Files' $SP2/t13land-build-batch.log; wc -l $SP2/t13land-{scanners,consumers,treescan,family70}.txt",
 "git -C $R show 7f974e855:scripts/check-test-ratchet.mjs | grep -n exclude; git ls-tree -r --name-only 7f974e855 tests | grep -c test.js (2497) and tests/build (52)",
 "node deep-compare of `git show b0c3e2bb4:scripts/.observed-shape-readers-baseline.json` vs `7f974e855:` (written to …/walk/S09/osr-{before,after}.json)",
 "git -C $R show 3b56c8e32:src/kernel/detMath.js > …/walk/S09/detMath-car1.js; $R/node_modules/.bin/esbuild --minify … | wc -c (2116; esbuild 0.28.2)",
 "grep -n … $SP2/T13-BUILD-CHARTER.md (headings; sed -n '213,265p'); git show 7f974e855:src/kernel/detMath.js | grep -n 'Cody\\|LN2_HI\\|expm1\\|nearest'",
 "git -C $R show 7f974e855:eslint.config.js | grep -n no-restricted-syntax/files/clock.js; same at 9a0584f0f; git show 7f974e855:scripts/count-transcendental-math.mjs | grep -A4 TRANSCENDENTAL_FNS; git show 94dbe1355 | sed -n '383,420p'",
 "git -C $R grep -n 'three.min\\|orbitControls.min\\|…' 7f974e855 -- public/map (and 9a0584f0f); git show 7f974e855:public/map/sf-bridge.js | sed -n '185,200p'; …3d.js | sed -n '815,852p' + grep loadTHREE/tip; git grep toggle3d 7f974e855 -- public/map/modules; git grep sf-embedded/'/map/' -- src",
 "ls $SP/briefs; sed -n 1p $SP/briefs/brief-T13LAND.md; grep -n 'ME/build-t13\\|ME/census-\\|ME/tipcopy' $SP2/T13-LANDING-ORDER.md; find $SP -maxdepth 1 -newermt '2026-09-02 10:20' ! -newermt '2026-09-02 12:10'; ls -la $SP | grep gate-t13",
 "ls -la $SP2/laneT13-tree/dist/assets | grep kernel/det-; ls -la $SP2/laneINSTRLAND-tree/dist/assets | grep kernel/det-; grep -n 'kernel-\\|det-' $SP2/t13land-build.log; grep -rl '1,048,196\\|11,427' $SP2 (no raw build log)",
 "git -C $R grep -n 'not yet been routed' 9a0584f0f 7f974e855 -- src tests; git show bd1fef1b8 | grep 'not yet been routed'; git diff --stat 754856b12 9f0df13a1 -- src/kernel/detMathDecay.js; git show ca651d54b:src/kernel/detMathDecay.js | grep -n 'whole-period'; git log 7f974e855..ca651d54b -- src/kernel/detMathDecay.js",
 "git -C $R show 7f974e855:tests/scripts/implementationPackets.test.js | grep -c '\\.each(\\|\\.for('; …sovereigntyLightingContract.walker.test.js | grep -n parkedFor; …scripts/implementation-packets.mjs | grep -n -A8 MIGRATION_HEAD_FIGURE_PATHS; …src/generators/steps/resolveResources.js | sed -n '128,134p'; git log -p 9a0584f0f..7f974e855 -- src/domain/spatial/moralDrift.js | grep ZERO; git show -s --format=%b db81d01c8 bd1fef1b8 854d80fea"
]

out = dict(slice="S09", status="COMPLETE", calls=calls, beyond=beyond, chair_errors=chair_errors, commands=commands, porcelain_unchanged=True,
 summary="S09 (§883 T13 stratum: 24 BUILD + 6 PRELAND + 13 LAND calls + 3 chair faults = 46 entries) re-derived from primary receipts, the landing range 9a0584f0f..7f974e855, the T13 dock @9f0df13a1 and the landing dock @03da380ab (both porcelain 0 before and after; no tests run, no git mutation, no subagents). 42 RATIFY, 4 AMEND, 0 REVERSE, 0 EVIDENCE-THIN. All eight HIGH items hold on executed evidence: the golden-drift probe is a faithful hand copy (statement-level diff), the 196 B cure is placement-only with the kernel chunk back to 10,683 B under the base build's own content hash in two dists, the three kernel changes are in the shipped source and were forced by 11/41 measured misses (label softened: the charter left the spellings to the implementation), the momentum-golden attribution reproduces from the ladder logs and blob census and refutes the chair's §882.9 cause, R1's three.js retirement is unreachable from the embedded map and degrades to a toast if reached bare, the roster floor is tight at 22 with 14 named members, the plain-gate subsumption is a proven superset (2445 files = 2497 − 52), and the self-reported process fault has its exit on disk before the commit. AMENDs: RV(3) label, RV3(4) stale header line, RV3(6) mis-homed sentence, R-T13P-5's stratum gloss (the momentum row was a KNOWN dock red, not a dock-true/tip-false reading). Beyond the rows: vite.config.js's det-pow rationale states a premise P′ falsified one pick later (still at §890), the R-T13P-6 docblock over-claim is still shipped at §890 with no bill line, and no raw build #6 log survives (figures prose-only, outcome independently confirmed). The zsh `$var:path` hazard the chair recorded bit this walk too.")
print("OVERLONG:", OVER)
if OVER: raise SystemExit(2)
json.dump(out, open("/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/walk/S09.json","w"), indent=1, ensure_ascii=False)
print("calls", len(calls), "verdicts", {v: sum(1 for c in calls if c["verdict"]==v) for v in ["RATIFY","AMEND","REVERSE","EVIDENCE-THIN","OUT-OF-SCOPE"]}, "maxev", max(len(c["evidence"]) for c in calls))
