# PRICING — #32 (the engine families) and #33's first train (LG-0 · LG-1), in CARS

Lane zero of the simulation build. Folded 2026-09-15 from twelve family pricings and ten skeptic passes (TR · WF · POP · WY · IN · WC · HB · INT · GR-CW · LG0 skepticked; **ES and EP had no skeptic** and stay at the reader's figures). Code was read at the build slot `claude/composite-r4` @ `a5876c0ea`; the record at the ledger `a803dee7a`. A **car** is one gated commit with its proofs. Every figure is **CONFIRMED** (a skeptic re-opened the file or re-counted the commits) or **PLAUSIBLE** (a reader's claim no skeptic tested, or a derivation of this fold). Read-only; nothing was built, staged or run.

The owner's ruling today: the simulation is the whole paid programme — recon first, then fix and build it, then everything else. This document is the "recon first" for the build.

---

## A. THE ANSWER FIRST

### A.1 The total

**#32 is 400–610 cars, centre ≈ 500** (PLAUSIBLE as a sum; the family rows below are CONFIRMED where marked). The first pass's "100–200 cars, PLAUSIBLE at best" (PROGRAMME-32-34.md §D row 3) was short by a factor of about three, and the skeptics found the error in one direction only: **every skepticked family moved UP**, by ×1.3 to ×1.6, and not one wave moved down. The reasons repeat across all ten passes and are worth stating once, because they are the calibration every later brief must use:

1. **The landing record, not the volume, is the calibration.** WF-1 (the simplest faith state wave) shipped as SIX cars; IN-1c-a (the smallest IN slice, no flag, no state) took FOUR gated commits; GR-5A (a one-line monotone fold) took THREE; TR-1, GR-2, SP-B and GR-3a each needed a repair commit; ENC-3 in #34 took 18. A wave priced "one commit each" in its volume is one third of its car count. (CONFIRMED — commit shas in the family rows.)
2. **A flag mint is a car on its own in this estate**: manifest key (35 today → 36, never the record's 22 or 28), an AUTHORED certification row (the declared-pending door is STRUCK — `VIRTUAL_PENDING_RULE_KEYS = Object.freeze([])` at `subsystemRowsVirtual.js:595`), the `VIRTUAL_RULES` twin, the `LANE_LEAVES` entry, both `contributionLedgerShape.test.js` literals, the engineGatedRuleKeys walker, the seven edge-shared MODIFY rows + `npm run build:edge-shared`, the acceptance literal drive, and a four-fence dormancy set with a lit-mutant control. Readers folded it into the leaf car in nearly every row. (CONFIRMED, INT/WY/POP/LG skeptics independently.)
3. **An L6 news kind gets its OWN walker file** and the five joins; landed walker files run 1,188–1,618 lines. Readers priced kinds as "authored strings". (CONFIRMED, INT/WY/GR-CW skeptics.)
4. **Enumerated cars cannot be priced away**: six WY rows and several TR/WC rows carried a `carsLow` below the number of cars their own `reason` field listed. (CONFIRMED.)
5. **Per-packet shape caps bind before line counts** (PACKET_STANDARD: ≤1 behaviour family, ≤1 new persisted record family, ≤1 user-facing surface, ≤2 leaves ≤250 eff, ≤12 handwritten files) — WC-1 breaks four at once; WC-6 breaks every one. (CONFIRMED, WC skeptic.)

| Family | Reader | **After the skeptics** | Label | Note |
|---|---|---|---|---|
| TR | 24–33 | **32–45** | CONFIRMED per wave | + TR-1's unmounted writer (1 car); TR-2 has an unpriced SPINE blocker (SP-4a actor-class gate) |
| WF | 30–49 | **47–74** | CONFIRMED per wave | WF-6's formation trigger is LANDED (GR-3b), WF-2's believed-devotion is LANDED (SP-B) — both cut work, neither cuts cars |
| POP | 22–34 | **32–45** | CONFIRMED per wave (POP-7 derived) | the column-class surface is now three structures deep (WC-0B); POP-6's phrase estate is two pinned corpora (63 + 107) |
| WY | 34–55 | **44–67** | CONFIRMED (WY-0..8a); WY-8b/9/10/11 PLAUSIBLE 13–20 | roadsKernel.js 838/838 zero slack blocks WY-3 |
| IN | 19–28 | **27–38** | CONFIRMED per wave | IN-5 has NO ES-6b dependency — it can start now |
| ES | 7–13 | **7–13** | PLAUSIBLE — no skeptic | apply the ×1.3–1.6 pattern mentally: ~9–19 |
| WC | 85–124 | **97–148** | WC-0..10 CONFIRMED 67–100; WC-11..16 PLAUSIBLE 30–48 | WC-10..16 (seven waves) are HARD-BLOCKED on WY-8a's `armySupply.js` (ABSENT) and WC-10 also on WC-9 (a third missing 7.F edge) |
| HB | 21–39 | **35–61** | CONFIRMED (HB-9 derived 8–14) | Q1 is THREE stamped fields, not two (close 6 stamps `TraditionRec`, a closed 17-property typedef) |
| EP | 11–17 | **11–17** | PLAUSIBLE — no skeptic | only family with an unflagged live product break (EP-4 s1, H1) |
| INT | 25–38 | **34–47** | CONFIRMED per wave | the reader's "engine-chunk ceiling" owner gate is a PHANTOM — no INT code lands in the `engine` chunk |
| GR-CW | 23–40 | **35–55** | CONFIRMED per wave | GR-4 is mount-blocked like GR-6 (pulseKernel 1581/1581) |
| **#32 total** | ~301–470 (sum of readers) | **401–610** | | excluding the seven WY-8a-blocked WC waves (36–57): **365–553** |
| **#33 first train** LG-0 · LG-1 | 7–11 | **11–17** (LG-0 6–9 · LG-1 5–8) | CONFIRMED | front-loaded by once-per-family costs (the LG-0V fold, the lost substrate annex re-graded, the flag mint, the TTS tool that does not exist at the slot) |

### A.2 The critical path

The record's path is SP-D → ES-6b → IN-5 → ES-7 → CW-3. **SP-D is LANDED** (`errandMint.js`, 87 eff, gate read exactly once at :76 — CONFIRMED by four families). Two corrections from the skeptics change its shape:

- **ES-6b does not precede IN-5.** `DESIGN_FP_ARCH_ES.md:1641` states the ES spine verbatim: `… → ES-6 → ES-7 (IN-5)`, and :1612 heads ES-7 "after IN-5 for the knowledge desk". ES-6b and IN-5 are PARALLEL predecessors of ES-7. The first pass's "ES-6b → IN-5 → ES-7" is one worktree's sequencing read as a dependency. (CONFIRMED, IN skeptic.)
- **CW-3 has a second spine under it**: the SC-6 causedBy-adoption walker (1 car, the GR-CW first car) → CW-1 (4–6) → CW-2x (3–5, blocked on the chair's Q1 word) → CW-3. `causedBy` adoption is still exactly six files with two engine-side writers, so CW-1's depth≥3 detection and CW-3's `chainDepthDegenerate` envelope are instruments over an empty sky until the FP writer waves adopt it. (CONFIRMED.)

| Serial leg | Cars | Label |
|---|---|---|
| ES-6b (chair authors the threshold) ∥ IN-5 cars 1–3 (dark-safe; car 4 the `belief_misjudgment` refile is the §764.3 door) | max(1–2, 4–6) = **4–6** | CONFIRMED |
| ES-7 as refused-and-split: (a) the three reachable kinds + the NARROWED DM verb · (b) exposure road + the measure — needs W-OPS wiring car A (#34, free) and a chair ruling reconciling `operationsVoice.js`'s overlapping roster | **6–11** | PLAUSIBLE (no ES skeptic) |
| CW-3 — after CW-1 (4–6) + CW-2x (3–5) + the SC-6 walker (1), which run beside the ES leg | **5–8** | CONFIRMED |
| **Serial cost of the critical path** | **15–25 cars** (as chartered, with ES-6b in series: 16–27) | PLAUSIBLE sum |

The path is short because it is instruments and voice; the programme is long because the eleven families beside it are ~380–580 cars that the path's envelopes measure. CW-3 "closes FP" only when the families it measures have written what it measures.

### A.3 The worker bundle

**0 KB to the ceilinged generation worker, for all twelve families — CONFIRMED by nine independent BFS runs over `src/workers/generation.worker.js`** (153 / 219 / 227 modules by resolver strictness; the load-bearing figure is identical in every run: ZERO `src/domain/worldPulse/**`, ZERO `src/domain/spatial/**`, zero realm/display/certification/components). `WORKER_BUNDLE_CEILING_BYTES = 1,404,493` (`tests/build/generationWorkerLazy.test.js:78`, monotone-down) is untouched by every wave. One dist snapshot measured 1,323,512 B (80,981 B spare) — but the last re-mint was for 251 B and needed a chair ruling, so treat the ceiling as zero-slack. The single exception in the whole programme: EP §7a row 3 (H5) touches a file on the worker graph — tens of bytes, PLAUSIBLE, unpriced.

**Tripwires** (files IN the worker graph that a natural-looking edit would touch): `src/data/foodImportRates.js`, `src/domain/region/goodsCatalog.js`, `src/data/tradeGoodsData.js` (TR-4/TR-6 — the grain constant lives in `grainArrivalCredit.js`, never beside the bypass rates), `src/domain/factionArchetypes.js` (TR-2 — READ, never edit).

**Where the bytes actually go**: `advanceInterval.worker.js` (559-module closure, 2.66 MB, **no byte ceiling anywhere in tests/build**) and the lazy pulse/engine chunks. Summing the readers' per-family estimates: ≈ **250–400 KB minified** (WC alone ≈150 KB bundled of ~690 KB source; HB ~20–25 KB; INT ~25–35 KB; POP ~25–40 KB; WY ~25–40 KB; ES ~22–36 KB source; TR/WF/IN/GR-CW unestimated) — PLAUSIBLE. **How many can live in lazy chunks: none, and none need to.** Every flag is a runtime `=== true` read inside the pulse tick, so dead-code elimination cannot shed a dark wave's bytes; the advance worker is one bundle. That is harmless because it has no ceiling.

**The two byte budgets that DO bind, and that no reader priced correctly**:
- **The eager first-paint closure**: `CLOSURE_BUDGET_BYTES = 1,048,000` (`vendorPdfLazy.test.js:565`) against a last-MEASURED 1,047,205 (`:539`, "795 B under") — **795 B of margin** (the reader's 1,222 B used a superseded ceiling). Touched by: WY-0 (~20 B, declaring `travelersFilter`), WY-9, INT-3's `decision` pressureKind row in `stressorsCore.js` (EAGER by `vite.config.js`'s own derivation; ~0.6–1.2 KB minified, plausibly the whole margin), INT-7's detector placement (`rulingPower.js` is eager), POP-6 (`settlementRumors.js` reaches first paint through React imports), and — **derived, PLAUSIBLE** — the manifest string of every new flag rides the eager store slice through `normalizeSimulationRules` (the nine WAVES flags cost +252 B measured; ~40 more flags ≈ 1–1.5 KB). The flag strings alone exhaust the margin before wave thirty. A ceiling act is owed mid-programme regardless of which wave crosses; plan it, do not discover it.
- **The lazy `engine` chunk**: `< 676_000` (`vendorPdfLazy.test.js:768`) against 675,323 measured — 677 B. No INT code lands there (CONFIRMED by string census of the dist); whether other families' leaves are pulled into it is UNMEASURED.
- ⛔ Both suites are **dist-gated and skip silently** (`vendorPdfLazy.test.js:957 it.skipIf(!requireDistRead)`, `generationWorkerLazy.test.js:267 describe.runIf(DIST_EXISTS)`) — on a box without dist both ceilings report green without running. Every byte claim in a ledger row quotes a measured build.

### A.4 The four things this fold rules (vetoable, under the 14:4x grant), because a brief cannot start without them

1. **TR-4's CR-2 contradiction**: the queue rows (`FABLE_VALIDATION_QUEUE.md:303`, `SOL_QUEUE.md:342`) order the two `storageMonths` folds CONSOLIDATED FIRST behind a byte-identical pin with a STOP clause; `DESIGN_FP_ARCHITECTURE.md` §5 #26 carries Q9's REPORTED-NOT-DEFECT. **Ruling: the queue rows win** — consolidation is the more conservative act, its pin catches a live two-writer defect that the fence would merely contain, and it banks a LOWER `applyWorldPulse.js` baseline (907 → less) that every later wave inherits. §5 #26 is amended to point at CR-2, not deleted.
2. **TR-4 vs WY-3 ordering**: §5 slots WY-3 immediately before TR-4 "so grain inherits the caravan body". WAYFARE is 12/12 unbuilt. **Ruling: TR-4 lands first**; the round-trip pin is TR-4's and WY-3 later VERIFIES; grain arrivals light without a mover body and that consequence is DECLARED in TR-4's row.
3. **TR-5 vs WF-6 on `peaceTerms.js` (797/800)**: both first-four candidates need the head's three lines. **Ruling: TR-5 boards first (its §3j position); WF-6 boards lane 5 when TR-5's catalog car has landed**; the T9 STOP applies to any second lane in flight on `peaceTerms*.js`.
4. **The flag-mint collision**: three of the first four lanes mint a flag on the same shared files. **Rule: the flag-mint car is the LAST car of each lane, rebased at landing, count taken from HEAD (35 → 36 → 37 → 38), never inherited from a brief.**

---

## B. THE FULL PER-WAVE TABLE

Columns: family · wave · status · cars low–high (skeptic-corrected) · depends on · owner gate · output-moving · worker KB (to the ceilinged generation worker; advance-worker bytes in parentheses where estimated) · reuse. **C** = CONFIRMED, **P** = PLAUSIBLE.

### TR — TRADE (32–45)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| TR-1 mount (`advanceCommercialReasons` has zero callers, `subsystemRowsCompact.js:293` says so) | PART-BUILT | 1 C | nothing | none | NO (dormancy golden) | 0 C | the landed writer; one mount line in `settlementLifecycleKernel.js` (733/800) |
| TR-2 the house (+TR-2b dark) | UNBUILT | 4–6 C | TR-1; ⛔ **SP-4a**: `strategicPosture.js:97 POSTURE_ACTOR_KINDS = ['settlement']`, refused at :159, pinned at `strategicPosture.test.js:137` — a SPINE amendment or Req-13 struck | TR-2b's boarding is a chair ruling recorded vetoably (item 18a: rides TR-2 dark) | NO | 0 C (`factionArchetypes.js` IS in the graph — read only) | `commercialReceiptPools.js` 386/800 (~19 eff per kind), `corruptionWeb.js` 510 |
| TR-3 believed markets | UNBUILT | 2–3 C | TR-1; SP-2 LANDED and consumed (`beliefAxisSubjects.js:130 scarcityBands`, `pactFormation.js:216/:228`) | none | NO | 0 C | the whole SP-B scarcity family — `beliefScarcity.js` is a 100–150-eff facade; `beliefMap.js` 781/800 net-zero |
| TR-4 the grain road | UNBUILT | 5–7 C | nothing unbuilt; CR-2 ruled (A.4.1); WY-3 inversion declared (A.4.2) | none (CR-2 is a pre-ruled chair act with a STOP) | NO at landing; the LIT path is a DECLARED bounded shift (calm-equivalence) | 0 C — tripwires `foodImportRates.js`, `goodsCatalog.js`, `tradeGoodsData.js` | `commodityFlow.js` conservation (grain free), `generosityUpdates.applyFoodDeltasToUpdates` the one applicator, `supplyKernel.js` 489/800 mount |
| TR-5 the pact lane | UNBUILT | 4–6 C | TR-1, GR-2, GR-3 (all landed); TR-4 wanted only for the physical arm (declared degraded) | none; ⚠ `route_wardenship` is a LIVE colliding token (TR-1's reason kind at `commercialReasonTaxonomy.js:66/:85`) — chair spelling ruling at charter | NO; two pins go red BY DESIGN (`peaceTermsGrantTerms.test.js:275`, `sovereigntyBundleWr10.test.js:480` — set-equality) | 0 C | GR-3's three rows (`peaceTermsCatalog.js:285-287`); TR-5 mints TWO rows, not one; `peaceTerms.js` 797/800 |
| TR-6 the corner | UNBUILT | 5–7 C | TR-3 (unbuilt) | none | NO; lighting also lights TR-1's `famine_profiteering` scorer (`commercialReasons.js:349`) — declare both | 0 C | authors the commodityFlow writer-family census from nothing; receipt-pool SPLIT likely |
| TR-7 ventures | UNBUILT | 3–4 C | TR-3 | none | NO | 0 C | regen-PRESERVES exception (J-TR-3); `warSeatBooks.js` EXISTS — scope the books pin by module, not by the `seatBooksEnabled` grep |
| TR-8 the factor | UNBUILT | 4–5 C | TR-5, TR-7 | ransom persistence is an owner row (item 8) — arm declared degraded | NO | 0 C | ERRAND_CONSUMERS row pre-reserved at `envoyErrandVocabulary.js:315-321` spelled `factorErrand.js` (the volume says `commercialErrands.js`) |
| TR-9 convergence | UNBUILT | 4–6 C | TR-2..TR-8 | none; DONE-WHEN is the owner's soak | NO | 0 C | `tradeConvergenceContract.js` 398 eff landed; WR-9 took five commits after its contract |

### WF — FAITH (47–74)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| WF-0 observation floor | UNBUILT | 2–3 C | nothing | none (`deityBearers` is a receipt field, NOT an OSR matter — `whole-world-soak.mjs:1105-1121`) | NO to worlds; the certification surface moves (declare) | 0 C | `deityBearers` private helper at `religiousContest.js:265` |
| WF-2 pilgrims + legates | UNBUILT | 7–10 C | WF-0; SP-1 landed; ⚠ believed-devotion is LANDED (`DEVOTION_BANDS` `beliefAxisSubjects.js:115`, consumed `pactFormation.js:261`) — build the read, not the seam | none | NO; lit delta measured by the disclosure pin | 0 C | two ERRAND_CONSUMERS rows reserved at :322-335; `envoyErrands` normalizer |
| WF-3 stance consequences | UNBUILT | 3–5 C | GR-2 landed | none | NO (G1c fence first) | 0 C | `aggression`/`treatyDurability` unconsumed at `deityStance.js:160-174` |
| WF-4 omen reads | UNBUILT | 5–8 C | WF-0 | new sub-ledger rides #20 | NO | 0 C | `divination` desk live at `heraldRouting.js:64`; spatialLedgers coverage manifest bill |
| WF-5 schism + underground | UNBUILT | 8–12 C | WF-1, GR-3 landed | two persisted shapes ride #20; clocks are owner-signed tuning at soak | NO | 0 C | no exported founding writer — `moralInstitutionPressure.js:481-530` candidate lane |
| WF-6 faith terms | UNBUILT | 4–7 C | GR-2, GR-3a/b landed — the PEACETIME PRODUCER IS LANDED (`PACT_DRAFT_LENS.faith_communion` `pactFormation.js:174-179`); serializes after TR-5 on `peaceTerms.js` | none | NO | 0 C | four idle grant readers `treatyEnforcement.js:270-293`; `temple_restitution` streams generically |
| WF-7 the tithe | UNBUILT | 5–8 C | WF-1 landed; `warDeployment.js` 684/800 (STOP is green) | tuning at soak; `templeWealth` rides #20 | NO | 0 C | sack arithmetic `:803-812`; DS-FTH-4 needs `tenure` too |
| WF-8 narration ×3 | PART-BUILT (8a) | 8–12 C | every earlier WF wave's fire sites | none | NO | 0 C | registry family landed; `PATRON_FALL_CAUSES` frozen at four (no `abandoned` producer) |
| WF-9 convergence | UNBUILT | 5–9 C | WF-0..8 | built under grant; CLOSED by the owner's soak only | NO | 0 C | `warConvergenceContract.js` 515 eff as template |

### POP — POPULATIONS (32–45)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| POP-1 the believed road | UNBUILT | 5–7 C | nothing (three lit-preconditions satisfied) | none | NO | 0 C (5–7 KB min. advance) | reception machinery, the 300-tick identity + :234 negative to EXTEND; ⛔ the column-class surface is `DEMOGRAPHIC_/MILITARY_/COLUMN_CLASSES` (`migration.js:474/:504/:509`) pinned by `tests/domain/militaryColumnRelease.test.js:64-76/:106` |
| POP-2 the commons arc | UNBUILT | 4–6 C | `commonsVoiceEnabled` is in the 17/17 BACKLOG — POP-7 clears it | none | NO | 0 C | ledger row REBUILT every tick (`commonsVoiceKernel.js:305`) + no-op guard `:352-358` — fixed-point pin owed |
| POP-3 departure memory | UNBUILT | 3–4 C | POP-1 by ORDER on the P2 landing function | none | NO (byte-absent) | 0 C | generic spatialLedgers accessor; free census |
| POP-4 the plague arc | UNBUILT | 3–4 C | nothing; ⭐ substrate gate DISCHARGED (`populationDynamics.js:407-425`) | none; 193-year zero-fire fact to the owner's tuning table | NO | 0 C | `pestilenceKernel.js` evidence |
| POP-5a road drama | UNBUILT | 4–5 C | POP-1 FIRST (columnOf composes by order) | none | NO (re-route pin byte-identical) | 0 C | the one new rng fork family |
| POP-5b permits live | UNBUILT | 4–5 C | POP-1; three of four read sites are FOREIGN families (WAR bank `warHomeCosts.js:445-452`, institutionLifecycle*, routeNetwork*) | none | NO | 0 C | `moverPermitted` 5×6 at `demographicsLadder.js:79/:209` |
| POP-6 population lines | UNBUILT | 6–9 C | POP-1..5 | ⚠ J-POP-12 live-kind prose rows are a DECLARED shift — rides the second lighting | **YES at landing** | 0 C but `settlementRumors.js` reaches FIRST PAINT | two pinned corpora: WHAT_PHRASES 63 + FALLBACK 107 (`rumorFallbackPhrasePools.test.js:220-221`) |
| POP-7 convergence | UNBUILT | 3–5 P (derived) | POP-1..6; Q2 clears the backlog rows | J-POP-14 arrival coupling: NO in this programme (item 18b) | NO | 0 C | SC-9 self-sampling |

### WY — WAYFARE (44–67)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| WY-0 the lawful canvas | UNBUILT | 2–3 C | nothing | Q3 arrow deletion — chair ruling, veto window open UNTIL IT LANDS | **YES** (car 2's deletions; car 1 none) | 0 C; ~20 B EAGER | `DEFAULT_LAYERS` 22 keys (17 boolean) at `mapSlice.js:88`; `setLayerFilter` at :382-384 |
| WY-1 the scale charter | UNBUILT | 3–4 C | SP-E landed | tuning at soak; §5b item 9 war-volume fold same commit | NO (dark by DATA) | 0 C (3–5 KB advance) | `hopWeeks` `distanceRead.js` 468 eff; 37-file consumer census |
| WY-2 the durable truth | UNBUILT | 2–3 C | ES-1 landed | none | NO | 0 C | `rumorNetwork.js` 364 eff |
| WY-3 the mover bodies | UNBUILT | 5–7 C | TR-4 first (ruling A.4.2); ⛔ `roadsKernel.js` 838/838 — extraction car FIRST | §2a F1–F3 signed (item 9d) | NO | 0 C | nine F3 writes exact; `commodityFlow.js:558` smuggle carry-through precedent |
| WY-4 population cargo | UNBUILT | 4–6 C | POP-1 (hard), WY-3 | §2a F4/F5 signed; Q1 BLEND chair-ruled | NO | 0 C | all amendment work, no module |
| WY-5 the carried word | UNBUILT | 3–5 C | WY-2 (mechanism), WY-3 | none | NO | 0 C | `no_word_from` is a full Herald kind |
| WY-6 the prize arm | UNBUILT | 3–5 C | WY-3 | §2a F8 signed | NO | 0 C | `seizureTake` `smuggle.js:316`; fifteen-row pairs walker |
| WY-7 the projection spine | UNBUILT | 5–8 C | WY-0 | quiet window on the dirtiest files | **YES** (declared unifications; 12+ `nameFor` spellings collapse) | 0 C | `KIND_PREFIX` module-local at `entityLinks.js:13` |
| WY-8a the supply train | UNBUILT | 4–6 C | WY-3 | §2a F9 SIGNED (slot doc stale) | NO | 0 C | unblocks WC-10..16 |
| WY-8b · 9 · 10 · 11 | UNBUILT | 13–20 P | WY-0/3/7 | §2a rows signed | WY-8b moves by record presence | 0 C; WY-9 EAGER | — |

### IN — INFORMATION (27–38)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| IN-1c-b interim desk + three certification movements | PART-BUILT | 2–3 C | chair sitting §55 Q3+Q5; MOOT-shrinks if IN-5 lands first | none | NO | 0 C | J-INA-5's seventh input family is owed and UNRECORDED (its own car) |
| IN-2 the lure | UNBUILT | 6–8 C | IN-1a/b landed; ⚠ `axisFamiliesGrewSinceIn2()` is BORN FIRED (SP-B landed three families) — chair closes or widens | persisted-shape widening rides #20 (row-4 precedent) | NO | 0 C | five frozen key-lists 4/7/6/9/10; `faithLabel` already an override key |
| IN-3 the counter-game | UNBUILT | 7–9 C | IN-1 soft; serializes with IN-2 on `brokerageServicesPlant.js` | none | NO | 0 C | `sendTwoDivergence.js`, `envoyTestimony.js` consumed; `PLANT_REFUSALS` six → seven |
| IN-4 the road | UNBUILT | 4–6 C | nothing intra-IN | none; J-INA-4 is row 9 of a 17-key governed BACKLOG (`engineGatedRuleKeys.walker.test.js:193-210`) — delete + ceiling 17→16 | NO; the cure moves the receipt partition (declare) | 0 C | `routeNetworkConsumersRace.js` 7 exports idle; `covertErrand.js` pre-declared at `envoyErrandVocabulary.js:350-355` |
| IN-5 the voice (seventh section) | UNBUILT | 4–6 C | **nothing** (IN-1c-b soft); NOT ES-6b | car 4's refile is the family's one §764.3 door | cars 1–3 NO; car 4 **YES** | 0 C | `EXACT_SECTION` 383 tokens, zero knowledge; ten consumer sites |
| IN-6 the measure | UNBUILT | 4–6 C | IN-2..5 | none; owner soak closes | NO | 0 C | `behavioral-observation.mjs` 1,233 lines; three UNOBSERVED rows in `subsystemRowsRegen.js` |

### ES — ESPIONAGE (7–13, PLAUSIBLE — no skeptic)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| ES-6b vetting quality | PART-BUILT | 1–2 P | nothing; DEAD-HEADED until a caller of `castCovertOperative` (ES-7's verb) | none; the threshold is CHAIR-AUTHORED (0.05 grid) | NO, doubly dark | 0 C | `readCorruptionClimate` already imported at `espionageMath.js:261`; `VETTING_QUALITIES` two members |
| ES-7 the voice + measure (ES-6c folded) | UNBUILT | 6–11 P | ES-Da landed; IN-5 (desk); W-OPS wiring car A | (1) the chartered arbitrary-target DM verb = errand DTO widening (`envoyErrandRecords.js:555/:590`) OWNER; the NARROWED verb is free · (2) custody on a caught spy OWNER — not needed | NO; registry numerals move (re-derive) | 0 C (+12–20 KB pools advance) | `operationsVoice.js` 308 eff dark (W-OPS O7); refuse-and-split like ES-5/ES-6 |

### WC — WAR CIRCULATION (97–148)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| WC-0 registration | PART-BUILT (complete) | 0–1 C | — | none | NO | 0 C | residue rides WC-1; one docs car (R28: WC-5's text says `errandMint.js` absent — it is BUILT) |
| WC-1 the arrival ledger | UNBUILT | 7–11 C | WC-0 | CR-WC-9 signed (item 9a) | NO | 0 C (~12 KB advance) | TWO persisted families, three surfaces — splits by shape cap; `war_levy` MEASURED SILENT (`subsystemRowsWar.js:55`) — construct levy fixtures |
| WC-2 derived stance | UNBUILT | 5–7 C | WC-1 | none; coalitionShares shift LIT-ONLY, declared (CR-WC-7) | NO | 0 C | three existing multiplier sites |
| WC-3 the relay | UNBUILT | 5–8 C | WC-1; E-rows pre-pinned toward WY-6 | none | NO | 0 C | `relayNetwork.js` ON the 250 cap |
| WC-4 strategy + coercion | UNBUILT | 6–9 C | WC-2; ⚠ `muster`/`dispatch` tag arms read `residentCohorts` whose writer is WC-13 — pre-pinned seam + recorded deferral | none | NO | 0 C | HB-1's `strategyMoves.js` amended |
| WC-5 call-ins + exits | UNBUILT | 7–10 C | WC-1, WC-2; ON the critical path to WC-9 | none | NO | 0 C | four news kinds + DM verb |
| WC-6 block rosters + walker | UNBUILT | 11–16 C | WC-1, WC-4 | CR-WC-9 signed (still a chair ruling on persisted shape — item 9) | NO; BANK-MOVES lit-only declared | 0 C | `armyTransitKernel.js` 798/800 — extraction car first |
| WC-7 realized stance | UNBUILT | 5–7 C | WC-6 | none | NO | 0 C | ES tap as new PRODUCT row |
| WC-8 block forks | UNBUILT | 6–9 C | WC-6; before WC-11 | none | NO | 0 C | `blockForks.js` over cap |
| WC-9 service integrals | UNBUILT | 9–13 C | WC-3, WC-5, WC-6 | `serviceBonds` in CR-WC-9's four-ledger list | NO | 0 C | four back-edits into WC-2/3/5 |
| WC-10 endurance | UNBUILT | 6–9 C | WC-3, WC-6, **WC-9** (third missing edge — wick-apart selectors read serviceBonds + drift) and **WY-8a** (`armySupply.js` ABSENT) | none | NO | 0 C | — |
| WC-11..16 | UNBUILT | 30–48 P | WC-9/10 chain; all HARD-BLOCKED on WY-8a | CR-WC-9 | NO | 0 C | — |

### HB — HABIT (35–61)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| HB-1 promotion shape | PART-BUILT | 2–3 C | nothing; CHECK-GIT-FIRST on the shared registry (42 rows) | none | NO | 0 C | FIVE residuals: `circumstanceClasses` pass-through, `dyadicActions`, the coalitionRatification row, the LEARN-set-empty pin rewritten, the DEAD_CODE row |
| HB-2 the coupling leaf | PART-BUILT | 1–2 C | — | none | NO | 0 C | seven sibling leaves |
| HB-3 the credit fold | UNBUILT | 6–11 C | HB-2; the unhomed classifier | ⛔ **Q1 is THREE fields**: close 6 stamps `TraditionRec` (`traditions/genesis.js:92-109`, closed typedef) — the owner line names it or close 6 is re-roaded | NO | 0 C | eight hooks in eight foreign hosts |
| HB-4 chooser wave one | UNBUILT | 4–7 C | HB-3, HB-1; HBF-03's close is OWED (charter contradicts instrument) | none | NO | 0 C | — |
| HB-5 the war chooser | UNBUILT | 5–8 C | HB-3, Q1; JOINT with CR-ES-4's spy read | none (CR-ES-4 signed) | NO | 0 C | `settlementStrategy.js` 760/800 (not 775) — extraction car |
| HB-6 believed doctrine | UNBUILT | 2–4 C | SP-B landed; ∥ everything | none | NO | 0 C | ⚠ `beliefMap.js` 781/800 shared with HB-7 |
| HB-7 anticipation | UNBUILT | 2–4 C | HB-5, HB-6 | none | NO | 0 C | — |
| HB-8 doctrine sheet | UNBUILT | 5–8 C | HB-6; SP-D landed (erratum) | none | NO | 0 C | `ENVOY_COVERT_LEG_REFS` is FIVE members with a live validator — doctrine is the sixth, a DTO amendment |
| HB-9 closes + envelopes | UNBUILT | 8–14 P (derived) | HB-3..8 | owner soak closes | NO | 0 C | — |

### EP — EPOCHS (11–17, PLAUSIBLE — no skeptic)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| EP-4 s1 the H1 repair | UNBUILT | 1 P | nothing | signed (P5, values-only) | **YES, unflagged — a live product break stops throwing** | 0 C | `configPatchAllowlistWalker` docblock amended |
| EP-4 s2 A3 + H7 | UNBUILT | 1–2 P | EP-1 landed | signed | NO | 0 C | `WorldMap.jsx` ~605/600 — measure first |
| EP-4 s3 the two doors + instrument | UNBUILT | 2–3 P | EP-0; MUST precede §7a row 1 | signed | NO | 0 C | `codeOnly` strip inside both detectors |
| EP-5 the promise amendment | UNBUILT | 2–3 P | terminal phase | 43 of 45 signed; two landing.js strings red BY DESIGN | NO code | 0 C | first-match retargeting trap (LT36) |
| §7a row 4 FORCE_RESETTLE tick | UNBUILT | 1 P | EP-3a | **declared same-seed shift, both flag states** — rides the second lighting (item 9c) | **YES** | 0 C | :681/:751 spelling |
| §7a row 1 sample-fork living door | UNBUILT | 1–2 P | EP-4 s3 first | PAID surface — signed, re-confirm in the row | NO if flagged | 0 C | — |
| §7a rows 2–3 | UNBUILT | ~2 P | — | signed | row 3 touches the WORKER GRAPH (H5) | tens of B P | — |

### INT — INTERIOR (34–47)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| INT-1 the books | UNBUILT | 4–6 C | nothing | none; `couplingRegistryInterior.js` mint is CERTAIN (cross-layer read) | NO | 0 C; **NOT in the engine chunk** | `warSeatBooks.js` four kinds, nine importers (27 mentions) |
| INT-2 positions wired | UNBUILT | 4–5 C | INT-1; ⚠ mint-site INVERSION (consumes INT-3's sibling type) | none | NO | 0 C | flag already minted with row |
| INT-3 interior veto (3a) | PART-BUILT (3b) | 5–7 C | INT-2 | none | NO | 0 C; ⛔ `stressorsCore.js` row is EAGER (795 B margin) | `emigreErrand.js` registry row reads `built: true` |
| INT-4 narrated middle | UNBUILT | 4–5 C | INT-3a | none | NO | 0 C (no eager slice — `rulingPowerCoup.js` is lazy) | — |
| INT-5 memory seam | UNBUILT | 3–4 C | ∥ INT-4; before INT-6 | none | NO | 0 C | seam pre-threaded `relationshipMemory.js:118-119` |
| INT-6 deliberate forgiveness | UNBUILT | 6–8 C | INT-5, INT-1, INT-3 | **`spatialLedgers.burials`** — the family's one new persisted key; rides #20 | NO | 0 C | WOUND_TYPE_RE has ELEVEN alternatives |
| INT-7 legitimacy's row | UNBUILT | 4–6 C | INT-3 | none | NO | 0 C; `rulingPower.js` EAGER — detector its own leaf | envelope manifest holds 25 |
| INT-8 interior voice | PART-BUILT (cures paid) | 4–6 C | INT-5 | new-kind pools chair-signed | NO | 0 C | six kinds × five joins × own walker |

### GR-CW — GRAMMAR + COUPLINGS (35–55)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| GR-4 remainder | PART-BUILT | 3–5 C | ⛔ MOUNT RULING: the expiry road's only site is `expireStaleActorMajors` called bare from `pulseKernel.js:347` (1581/1581, R-BLD-10) | none (chair) | NO | 0 C | one shared lifecycle walker |
| GR-5 remainder | PART-BUILT (5A) | 9–13 C | chair bands FIRST (compile pass, not a car) | none | NO | 0 C | `peaceTerms.js` 797/800 — every symbol a writer-family leaf |
| GR-6 mediation | UNBUILT, PARKED | 7–11 C | ODQ §35.2 re-charter compile pass | none (chair) | NO (mount inside the live war opener) | 0 C | `HOSTILE_CONFIDENCE` gate `warDeployment.js:1031` |
| GR-7 measurement | UNBUILT | 4–7 C | GR-0..6 | owner soak closes | NO | 0 C | NO pendings to convert; `hollowed_quiet` prose owed BY NAME; `PACT_ENDINGS` exported twice with different contents |
| CW-1 cascade governor | UNBUILT | 4–6 C | SP-6a landed; SC-6 adoption (starved) | bands at soak; view-item ruling chair | NO | 0 C | the seam is `buildHeraldFeed` (`heraldFeed.js`, 115 eff), NOT `realmItemReadModel.js` |
| CW-2x cause-walk | UNBUILT | 3–5 C | Q1 chair word | none | YES on a lit preset — a DM PANEL LINE only (`graceLine` → `CauseWalkPanel.jsx:122-124`) | 0 C | — |
| CW-3 the coupling measure | UNBUILT | 5–8 C | CW-1, CW-2x, the registry (58 rows) | owner soak closes | NO | 0 C | paired lit/dark harness is 1–2 cars alone |

### LG — #33's first train (11–17)

| Wave | Status | Cars | Depends on | Owner gate | Output-moving | Worker KB | Reuse |
|---|---|---|---|---|---|---|---|
| LG-0 the willingness gate (+ LG-0V fold + substrate re-grade) | PART-BUILT | 6–9 C | nothing in code; ⚠ item 19's ruled order puts the Q10 prefix FIRST; TTS tool absent at the slot | lighting boards the SECOND DECLARED LIGHTING (§764.3 amended at §931 item 1) — a contested window | NO; YES at lighting (graph already lit) | 0 C | ~45 consumer modules of the distanceRead API; `TravelersLayer.jsx:101` display seam |
| LG-1 graph formalization + toll | PART-BUILT | 5–8 C | LG-0; item 21(a) asked at this car | §125.1 signed; toll income path is NOT `TAX_FORMS` — a new edge-scoped relationship-conditional toll kind | NO | 0 C | relay derived free; capacity needs a load derivation (no records to count) |

---

## C. THE BOARDING ORDER — four build lanes at a time

A lane = one family's consecutive waves an implementer lands in one sitting, ≤ 8 cars. The record's §3j order is kept (TR-4 with its CR-2 pin, TR-5, WF-6, POP-1, WY-0, WY-1, IN-4, TR-6, the critical path, then by family) and adjusted only where a dependency forces it — each adjustment is named. The first four board together.

| # | Lane | Cars | Prerequisites (all in place unless marked ⏳) | Adjustment |
|---|---|---|---|---|
| **1** | **TR-4** the grain road — car 0 CR-2, car 1 the round-trip pin, car 2 leaves + offset + flag, car 3 T7 walker + storageMonths census + sixth-writer plant, car 4 calm-equivalence + three bypass arms + T-6, car 5 slice 2 | 5–7 C | ruling A.4.1 (CR-2) and A.4.2 (WY-3 inversion) recorded in the brief | none |
| **2** | **TR-5** the pact lane — (a) two rows + five executors + the two red-flip re-pointings, (b) `tradeDemandTrigger` + realmPressure01 landing + flag, (c) T-5 tellable + dark twin + K3 twin + lean-year, (d) the CR-WR10-B eleven-file sweep | 4–6 C | chair spelling ruling on `route_wardenship` (recorded in the brief); no WR lane in flight on `peaceTermsCatalog.js` | none |
| **3** | **POP-1** the believed road — (1) class extension + both columnOf carry-throughs + the war-family pin re-cut, (2) `believedMigrationRead.js` + seam swap, (3) `arrivalClearing.js` + return column + conservation re-derivation, (4) disappointment + letters home, (5) coupling desk leaf + three CW-0 rows + SP-2 tripwire + SC-6 causedBy, (6) flag mint + mutants + gate | 5–7 C | none | boards in the WF-6 slot (see lane 5) |
| **4** | **WY-0 → WY-1** — WY-0 car 1 the layer-manifest walker + `travelersFilter` declared + merge pin; car 2 the deletions (Q3 arrows, chevrons/flips) + moved tests + `chevronPoints` dead-export disposition; WY-1 car 1 `modeSpeeds.js` + kmScale arm + carry-forward; car 2 the instrument family (round-trip, absolute-arm, three mutants); car 3 the 37-file spectrum census + the war-volume fold | 5–7 C | Q3's veto window named in car 2's row | none |
| 5 | **WF-6** faith terms — consumers over the four idle grant readers, the tolerance_guarantee breach seam (leaf-first against 797/800), thirteen producers, bundle fixture, herald sentence, flag | 4–7 C | ⏳ lane 2's catalog car landed (`peaceTerms*.js` T9 serialization) | **forced**: moved from slot 3 to 5 by the `peaceTerms.js` 797/800 collision with TR-5 (A.4.3) |
| 6 | **IN-4** the road — car 1 the J-INA-4 cure ALONE (manifest join + backlog row delete + ceiling 17→16 + cert row + fences re-run), car 2 flag + race-consumer leaf + ONE_REGEN fences, car 3 `covertErrand.js` on the spine + D-3 retirement + alias trap, car 4 the WAR-file dock under Q2 if needed | 4–6 C | none | none |
| 7 | **TR-1 mount → TR-3** believed markets — the mount line, then TR-3 cars A/B/C | 3–4 C | none | **forced**: TR-6 depends on TR-3 (unbuilt); TR-3 boards before TR-6 |
| 8 | **TR-6** the corner + famine speculator | 5–7 C | ⏳ lane 7 | none |
| 9 | **ES-6b** vetting quality | 1–2 P | chair authors the threshold on the 0.05 grid | none |
| 10 | **IN-5** the voice — cars 1–3 dark-safe (seventh section + correspondence + walker + ten-site census; arc composer + hums + SCANDAL join; `court_sat_still` + significance raise); car 4 the `belief_misjudgment` refile HELD at the §764.3 door → the second lighting | 4–6 C | none (IN-1c-b becomes moot if this lands first) | **corrected**: not behind ES-6b; runs beside lane 9 |
| 11 | **ES-7 (a)+(b)** the three reachable kinds + own walker + pool annex; the NARROWED DM verb (watcher on an embassy already going out) | 3–5 P | ⏳ IN-5 cars 1–3; W-OPS wiring car A (#34, free); chair ruling reconciling `operationsVoice.js`'s roster | none |
| 12 | **ES-7 (c)+(d)** the exposure road (ES-6c) + `espionageRider.js:140` widening + the seven envelopes on a purpose-built LIT corpus | 3–6 P | ⏳ lane 11 | none |
| 13 | **SC-6 causedBy walker → CW-1** — the adoption walker with a DELIBERATE scope (not `couplingInclusion`'s `worldPulse|spatial` census), then CW-1's leaf + `buildHeraldFeed` seam + fences; the fixture/pin set + three mutants + SC-1 rows | 5–7 C | Q4 view-item ruling (chair) | none |
| 14 | **CW-2x** the cause-walk extension | 3–5 C | ⏳ chair Q1 ratification | none |
| 15 | **CW-3** the coupling measure — the terminus | 5–8 C | ⏳ lanes 13, 14; the registry at 58 rows; GR-7/IN-6/TR-9/WF-9/HB-9/POP-7 for a non-degenerate sky | none |
| 16 | **WF-0 → WF-3** | 5–8 C | none | by family from here |
| 17 | **WF-2** (2a 3–4, then 2b 4–6 as two sittings if > 8) | 7–10 C | ⏳ WF-0 | — |
| 18 | **WF-4** omen reads | 5–8 C | ⏳ WF-0; the sub-ledger on #20's list | — |
| 19 | **WF-5a → WF-5b** (two sittings) | 8–12 C | WF-1, GR-3 landed | — |
| 20 | **WF-7** the tithe | 5–8 C | none | — |
| 21 | **WF-8** narration (two sittings) | 8–12 C | ⏳ WF-2..7's fire sites | — |
| 22 | **WF-9** convergence — built, closed by the owner's soak | 5–9 C | ⏳ WF-0..8 | — |
| 23 | **POP-3 → POP-4** | 6–8 C | ⏳ lane 3 (P2 site order) | — |
| 24 | **POP-5a** | 4–5 C | ⏳ lane 3 | — |
| 25 | **POP-5b** (three foreign-family read sites, each under its own gate) | 4–5 C | ⏳ lane 3; GR-3 reads required-from-birth | — |
| 26 | **POP-7 → POP-2** — POP-7 clears `commonsVoiceEnabled` from the backlog (Q2) then POP-2 extends the lit ladder | 7–11 C (two sittings) | ⏳ POP-1..6 for POP-7's instrument; POP-2 only needs the backlog cleared | **forced**: POP-2 waits on POP-7's Q2 |
| 27 | **POP-6** population lines | 6–9 C | ⏳ POP-1..5; J-POP-12 rides the second lighting | output-moving at landing |
| 28 | **WY-2** the durable truth | 2–3 C | none | — |
| 29 | **WY-3** mover bodies — extraction car FIRST (`roadsKernel.js` 838/838), then 3a, 3b, walkers, pins | 5–7 C | ⏳ lane 1 (commodityFlow serialization) | — |
| 30 | **WY-4** population cargo | 4–6 C | ⏳ lanes 3 and 29 | — |
| 31 | **WY-5** the carried word | 3–5 C | ⏳ lanes 28, 29 | — |
| 32 | **WY-6** the prize arm | 3–5 C | ⏳ lane 29 | — |
| 33 | **WY-8a** the supply train — unblocks WC-10..16 | 4–6 C | ⏳ lane 29 | pulled ahead of WY-7 because seven WC waves wait on it |
| 34 | **WY-7** the projection spine (quiet window) | 5–8 C | ⏳ lane 4 | output-moving (declared) |
| 35 | **WY-8b · WY-9 · WY-10 · WY-11** | 13–20 P | ⏳ lanes 29, 34 | — |
| 36 | **IN-1c-b** (shrinks to Q5's three movements if IN-5 landed) | 2–3 C | ⏳ chair sitting §55 Q3+Q5 | — |
| 37 | **IN-2** the lure | 6–8 C | chair rules the axis closure against the fired tripwire; serialize with IN-3 | — |
| 38 | **IN-3** the counter-game | 7–9 C | ⏳ lane 37 (file serialization) | — |
| 39 | **IN-6** the measure | 4–6 C | ⏳ IN-2..5 | — |
| 40 | **INT-1** the books (+ the `couplingRegistryInterior.js` mint) | 4–6 C | none | — |
| 41 | **INT-2** (mint-site inversion ruled: ship the handoff dormant with a tripwire) | 4–5 C | ⏳ lane 40 | — |
| 42 | **INT-3a** (the EAGER `stressorsCore.js` row measured against a built dist) | 5–7 C | ⏳ lane 41 | — |
| 43 | **INT-4 ∥ INT-5** (two implementers, the only sanctioned INT parallelism) | 4–5 C + 3–4 C | ⏳ lane 42 (INT-4); none (INT-5) | — |
| 44 | **INT-6** deliberate forgiveness (`burials` on #20's list) | 6–8 C | ⏳ INT-5, INT-1, INT-3 | — |
| 45 | **INT-7 → INT-8** | 8–12 C (two sittings) | ⏳ INT-3, INT-5 | — |
| 46 | **HB-1 → HB-2** | 3–5 C | CHECK-GIT-FIRST on the registry | — |
| 47 | **HB-6** (the parallel lane; `beliefMap.js` 781/800 watched) | 2–4 C | SP-B landed | — |
| 48 | **HB-3** the credit fold | 6–11 C | ⏳ Q1's THIRD field named to the owner or close 6 re-roaded (chair) | — |
| 49 | **HB-4 → HB-5 → HB-7 → HB-8 → HB-9** in order (five sittings) | 24–41 C | ⏳ lane 48 | — |
| 50 | **GR-4** (mount ruling first) · **GR-5** (chair bands first, then 9–13 in two sittings) · **GR-6** (§35.2 re-charter compile first, 7–11 in two sittings) · **GR-7** last | 23–36 C | chair acts precede each | — |
| 51 | **EP-4 s1 → s2 → s3** | 4–6 P | none | s1 is a live break repair — could board earlier at the chair's discretion |
| 52 | **EP §7a row 1** (after s3) · rows 2–3 · **row 4** in the second lighting · **EP-5** terminal | 6–8 P | ⏳ lane 51 | — |
| 53 | **WC-1** (two sittings) → **WC-2** → **WC-3** → **WC-5** → **WC-4** → **WC-6** (two sittings) → **WC-7** → **WC-8** → **WC-9** (two sittings) | 67–91 C | CR-WC-9 signed (item 9a); WC-5 before WC-9 | WC-4's residentCohorts tag arm pre-pinned |
| 54 | **WC-10 → WC-16** | 36–57 P | ⏳ lane 33 (WY-8a) AND WC-9 | **forced**: WC-10 ← WC-9 added |
| 55 | **TR-2** (+2b dark) | 4–6 C | ⏳ SP-4a constitution amendment (SPINE, not TR) or Req-13 struck by chair | — |
| 56 | **TR-7 → TR-8 → TR-9** | 11–15 C (two sittings) | ⏳ lanes 7, 2 | TR-9 is the family terminus |

Lanes 1–4 board today. Lanes 5–8 board as 1–4 land (5 needs 2's catalog car; 7 needs nothing; 6 needs nothing; 8 needs 7). Lanes 9 and 10 can board the moment a seat frees — nothing gates them and the critical path starts there.

---

## D. WHAT IS NOT THE SIMULATION AND WAITS

Named so nothing on this list is re-found as a gap. Nothing below boards a build lane until the owner's "then everything else":

- **#34** (three-quarters built): the W-OPS wiring cars (**exception: wiring car A is a prerequisite of ES-7 — lane 11 — and boards as a research-exempt 1-car act when lane 11 is next**), ENC-5's grudge fold, W-COIN-4, the WEAVE stragglers (SEAM-4 now BUILT per RECHECK; NAME-2, POLIS-5, VAR-1b/2, ST-1), the drift-door car, SEAT-8 (civilContests, item 4), SEAT-6, W-ARMS Cars 1–3 (items 10–12).
- **The Scribe lineage**: W5/W5b, `FLAGS.scribe`, the key and the price, migrations 201+202+203 (never applied) — the owner's word only.
- **#18** the six display trains (banked rewrite; the read-only classification pass is allowed).
- **#20** the ONE trailing OSR mint — waits for the last shape-bearing car of this programme; it must swallow the #32 batch (WF-4 omenReadings, WF-5's two shapes, WF-7 templeWealth, IN-2's axis fields, INT-6 burials, WC's four ledgers + edge archive, HB-3's fields, WY's §2a rows, POP-3/4's keys), LG-2's commitment ledger and civilContests in one act.
- **The second declared lighting → the golden freeze** (§764.3 amended at §931 item 1) — an owner keystroke; a single contested window carrying `treasuryEnabled`, the three W-SEAT keys, LG-0's gate, IN-5 car 4, POP-6's J-POP-12 rows, EP §7a row 4 and every #32 flag. Nothing lights before it; nothing freezes before it.
- **The walk + ONE regen** (owner-held, TAIL RULED 08-06), **#21** the exhaustive review + fix cars, **#22** (re-slotted after #21, item 20), the terminal soak, **tuning ratification** at soak under THE PROMISE (every band this programme authors lands raw in a frozen table with an executed derivation and is ratified only there), the legal sitting, the marketing pass and EP-5.
- **#33 beyond the first train** (LG-2..12, §125.4/§125.5): waits on the Q10 band-walker prefix (item 19 orders it first — 1 infra car that could board any time a seat frees), item 7's commitment ledger, and the §46 widening. LG-0/LG-1 themselves are priced here (11–17) and board after lane 8 at the chair's discretion.
- **The standing carve-outs**: no push, no deploy, no migration applied, no data deletion, no spend, no flag flipped on a preset. Every lane above lands dark or declares.

---

*Every line number above is a point-in-time reading at `a5876c0ea` and rots; a brief re-measures by symbol at charter. The ten skeptic passes and twelve pricings are the receipts; this fold is the arithmetic.*
