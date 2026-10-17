# HB — HABIT CONDITIONING (coherence read, 2026-10-16, reader seat for chair 2fc13d59)

Sources and their abbreviations. **V** = `volumes-master/DESIGN_FP_ARCH_HB.md` (4480 lines, read whole, lines 1-4480). **F** = `volumes-master/DESIGN_FP_ARCHITECTURE.md` (the fold; HB rows plus §12). **SPN** = `volumes-master/DESIGN_FP_SPINE.md` §1 (read whole, :17-110). **AES** = `volumes-master/DESIGN_FP_ARCH_ES.md`. **AWC** = `volumes-master/DESIGN_FP_ARCH_WC.md`. **INFO** = `volumes-master/DESIGN_FP_INFORMATION.md`. **M:** = the code of record, `scratchpad/master-00b648c9d` (00b648c9d, 2026-10-02). **BOARD** = `fp-kit-87797a6a-2026-09-23/FP-PROGRESS-BOARD.md`. **ODQ** = `docs/OWNER_DECISION_QUEUE.md`. **GEN** = `fp-kit-87797a6a-2026-09-23/owner-words/2026-10-02-the-generals.md`. **CEN** = `fp-kit-87797a6a-2026-09-23/findings/FP-CENSUS-ES-HB-WC-EP.md`.

Evidence class. Everything here is a READ unless marked **PLAUSIBLE** (reasoned, not read). No test was run, no git command was run, and no file outside this one was edited.

---

## 1. THESIS

HB adds one new input to the frozen choosers: `habitStrength(actor, circumstanceClass, action)`. It is a persisted, decaying stock that each graded close writes (this is "learning-as-state", V:233-263). The design pairs it with a counterforce: observers form a *believed* doctrine sheet about a court and tilt their own choices against it (anticipation). A watched court follows its own habit less (the damper). The sheet can be stolen, forged and read in the dossier (V:612-638, V:2651-2770). The owner's directive is the law (V:190-217). Its scope is "any decision fork in the program per actor per circumstance per action" (V:206-207).

**The one sentence a DM reads when the flagship mechanism fires.** The volume names it as the payoff: *"believes they always march first; they have twice waited."* (V:2666-2667). It is a divergence line inside the premium/elevated Realm Inspector band. The sentence breaks the volume's own law 1 ("THE SHEET SPEAKS RUNGS, NEVER COUNTS", V:2845-2852, J-HB-8 V:3556), because "twice" is a tally. The sentence at the receipt level is *"as this court reliably does when its granaries run thin."* (V:2847). It is designed to sort LAST, so it is the first reason a 4-slice drops (V:2897-2904).

**Mechanisms with NO DM-felt sentence anywhere in the volume or the code:**
- the anticipation term (HB-7). The receipt shape allows `source: 'anticipated'` (V:2840), but no sentence is authored;
- the deviation damper (V:2772-2829);
- the seat shock (V:1925-1940);
- the believed-clock shelf life (V:1820-1916);
- the `doctrine_shifted` Herald kind. It is minted at V:2876-2893, but no example line is given;
- the pledge book, lapses and closes. The "learned nothing" receipt on import is named at V:991-994 but never worded.

**At the code of record, NO habit sentence of any kind exists.** `doctrine_shifted`, `doctrineBands`, `anticipationFactorFor` and the `kind:'habit'` receipt all return zero `src` hits (rg census at M:, §2 below).

---

## 2. STATUS, TRUTHFULLY

**What the volume says about itself.**
- The ledger-branch header: "LANDING IS NOT SEALING. ROUND FOUR HAS NO RECORDED CLOSE … §9 is machine output … Do NOT upgrade this volume to 'sealed'" (V:30-37). The 5 chair questions and the 43-row deferral book are open, and Q1 is the blocker (V:35-37).
- The master-only top block: "This volume is **ARCHITECTED, NOT BUILT** … **Zero files under `src/` carry `habit` in their name**" (V:3-13, measured 08-14 at `60083174`). **That block is refuted at the code of record.** HB-0, HB-1 and HB-2 landed the same day (08-14). See the table below.
- The fold: "HB's round four has NO RECORDED CLOSE (its §9 is machine census output, not a verdict)" (F:33-34).

**Sealed versus not, established.**
- **(a) The volume.** It is NOT sealed. I found no attestation, seal or close row for the volume in ODQ; a grep for HB/habit with seal/round-four found none. That makes this a PLAUSIBLE-complete absence. §9 (V:4314-4480) is countsweep output, with 52 PASS out of 52.
- **(b) HB Q1.** The fields are `deployment.habitEpisode` and `treaty.habitEpisode`. They are "signed" only by a **chair reading** of the owner's 09-23 words. The owner typed: *"no just build it all shipped lit"* · *"then do everything else"* (BOARD:9; F:3268). The chair's reading J-EM-15(2) says: "'Build it all' SIGNS HB Q1's two persisted fields … HB-3..HB-9 are released … (say one word to re-park them)" (F:3270). So Q1 is signed **by delegation-reading, vetoable by one word**. It is not an owner sentence about the fields. Before that, ODQ §34 narrowed the seal so that Q1 binds HB-3 onward only, not HB-0 and HB-1 (ODQ:1464-1466).
- **(c) The third field.** `occupationRecord.habitEpisode` is ruled "DEFERRED AND VISIBLE". Q1 re-opens if HB-9's occupation close is built (V:3974-3988).
- **(d) The tuning.** Every `HABIT_TUNING` value is raw-authored and unsoaked (V:1531). Three structural bounds were **chair-signed 08-15** (ODQ:1676-1686): `HABIT_ROWS_PER_ACTOR_CAP = 24`, `PLEDGE_MAX_AGE_WEEKS = 156` and `PLEDGE_BOOK_CAP = 256`. The ruling says "The volume's proposals (48/208, and the ~14-byte row cost) are REFUTED on R33/R34's measurements." **The volume still prints 48 and 208, unbracketed** (V:911, V:1271).

| Wave / unit | What the volume claims | Board / ledger | Code at 00b648c9d | Verdict |
|---|---|---|---|---|
| HB-0 pure substrate | "every one DARK" (V:2915); charter V:2928-2965 | CEN:24 LANDED `e188760b8` (08-14), plus HB-0B `c777a158d`; F:3094 LANDED | `habit/habitVocabulary.js` (153 lines), `habit/habitCurve.js` (303); `HABIT_TUNING` at habitCurve.js:116-169 | **LANDED**. ⚠ `SHEET_FLOOR` and the close-1/close-8 banding edges, which the volume says are "HB-0's" (V:3082, V:3309), are **absent** from `HABIT_TUNING` |
| HB-1 vocabularies and fork registry | mint `STRATEGY_MOVES`, retire `martialMoves`, delete the `'fortify'` disjunct (V:2967-3044) | CEN:25 LANDED `1013d58ba` | `strategyMoves.js` (11 moves + `ALL_MOVE_TOKENS` + `MARTIAL_HISTORY_MOVES`); `habitForkRegistry.js` has **104 rows: 84 DEFER, 20 STAY, 0 LEARN**; the chooserTotality roots include `src/domain/traditions` (tests/lint/chooserTotality.walker.test.js:95-97) | **LANDED, but two charter clauses were REVERSED by the build**: the fortify disjunct is "LIVE AND ITS DELETION IS REFUTED" (settlementPolitics.js:621-624); `martialMoves` became a derived subset, not retired (strategyMoves.js header) |
| HB-2 ledger and `habitConditioningEnabled` | shape `{v, stocks:{actor:{seat, byClass}}, open}` (V:720-747) | CEN:26 LANDED `de214782b` | simulationRules.js:326-337 (single conjunct, door one only); `habitLedger.js` shape is **`{rows:{actor:{class:{action:[s,w]}}}, open}`, with no `v` and no `seat`** (habitLedger.js:15-18); `writeHabits` has **zero src callers** ("nothing in `src/` calls it", habitLedger.js:7); TRACKED at spatialUsage.js:329 | **LANDED DARK, NO CALLER**. The persisted shape differs from the volume and from F:788-799 |
| HB-3 credit fold | 8 grade maps plus 2 foreign fields | F:3217 NOT STARTED (Q1); BOARD/FP-ORDER:8 pair 5, "HB Q1 signed by the word" | no `habitCredit.js`; `habitEpisode` has 0 hits | NOT STARTED |
| HB-4 chooser read, sites 1/3/6 | V:3161-3182 | F:3218 NOT STARTED; "the ballot, still ABSENT until a ballot record exists" | `habitFactorFor` 0 hits; `circumstanceClassOf` exists only in comments (habitVocabulary.js:23) | NOT STARTED; site 3 has no ballot record |
| HB-5 war-chooser joint, sites 7/8/13 | V:3184-3246 | F:3219 NOT STARTED | no habit symbol in settlementStrategy.js; the spy-before-decision wiring is also unbuilt (IN-ES T16/T18) | NOT STARTED |
| HB-6 `believedDoctrineEnabled` | V:3248-3272 | F:3220 NOT STARTED | flag absent from simulationRules.js; `doctrineBands` 0 hits | NOT STARTED |
| HB-7 `habitAnticipationEnabled` | V:3274-3306 | F:3221 NOT STARTED | flag absent; `anticipationFactorFor`/`awareness01` 0 hits | NOT STARTED |
| HB-8 `doctrineTapEnabled` | V:3308-3333; "UNREACHABLE until SP-D" (V:1093-1100) | F NOT STARTED; "the SP-D gate is discharged" | flag absent; `errandSpineEnabled` IS declared (simulationRules.js:301) | NOT STARTED; the volume's reachability premise is stale |
| HB-9 closes owed and envelopes | V:3335-3369 | F NOT STARTED | — | NOT STARTED |

Flags: 1 of 4 is minted (`habitConditioningEnabled`). It is lit in **no** preset. The rg for `habitConditioningEnabled: true` under src returns 0, and spatialUsage.js:310/:326 say "lit in no preset". The owner's word of 09-23, "shipped lit" (F:3270 item 3), has not reached HB, because nothing past HB-2 exists.

---

## 3. LAWS AND OWNER-SETTLED ITEMS (the fold may NOT re-narrate these)

**Owner words, verbatim.**
- 2026-08-05, the directive (V:192-201): "weighted rolls [should] operate a bit in memory. The things that were most successful for a circumstance or situation should likely be the thing that is most likely to be chosen more often. That is called habit, conditioning, and learning. The things that often failed in the situation should lose relative weight. They should go for anything that regard[s] decision-making for the actors. But countered to this these are things that also should be anticipated by enemies and allies in their own strategy as a counterforce. If settlement [A] knows that settlement B genuinely does action Z in a circumstance, this adds into the war of information and espionage on how settlement would react and whether settlement B knows settlement A's plans (which changes the situation and circumstance) and vice versa."
- 2026-08-06, scope (V:205-207): "Learning shouldn't be limited just to war it should be for any decision fork in the program per actor per circumstance per action and on and on." The volume adds that TOTAL SCOPE IS LAW (V:161).
- 2026-08-06, volatility (V:211-212): "chaotic to lawful should influence that learning and memory. Chaotic makes both more volatile."
- 2026-08-06, cohesion (V:216-217): "trade … faith, strategy, route creation, route choice, and dynamics between settlements, goals, and goal orientation, etc. … make it cohesive fully"
- 2026-08-05, the blanket grant (V:289): "I give permission for everything that requires my sign off in the full queue". It releases the war-chooser spy-before-decision wiring (V:290-291).
- 2026-09-23 (F:3268): "no just build it all shipped lit" · "then do everything else". The chair reading J-EM-15 signs Q1, vetoable (F:3270).
- 2026-10-02, the generals, fifth message (GEN:59): "with habits forming from success and failures and their reputation regarding as well." Seventh message (GEN:78): "and of course enemies remember how that general acts as well so everything stays dynamic". Eighth (GEN:85): "affected enemies". **These postdate the volume and are not in it.** The chair's rulings 14(a), 14d and 14d′ (GEN:65, :81, :88; vetoable) route a **per-general** habit through "the HB program's OWN conditioning … never a second habit model" and have enemies learn it through "HB's believedDoctrine / habitAnticipation".

**Laws the volume states (binding inside the family).**
- THE SELF-BALANCING LAW (V:618-620): "A habit that becomes KNOWN becomes EXPLOITABLE. The information war is the variance regulator, and it is the ONLY variance regulator this design is permitted to add." Exactly three regulators exist and no fourth (V:622-638).
- LEARNING-AS-STATE (V:233-263): the formulas stay frozen; habit is an input; replay survives through a four-link chain (V:241-257).
- TILT-NEVER-LOCK on PAIRWISE ODDS RATIOS (J-HB-18, V:1607-1616). The per-probability pin is DELETED AS FALSE (V:1602-1605).
- CONSERVATIVE REINFORCEMENT (J-HB-15, V:1780-1784).
- THE GRADED-CLOSE PRECONDITION (refinement 15, V:1454-1458): "A fork joins the learning system EXACTLY WHEN its circumstance has a GRADED CLOSE … TOTAL IN PRINCIPLE, GATED BY GRADEABILITY IN PRACTICE, AND THE GAP IS NEVER SILENT."
- THE ACTION-COVERAGE LAW (J-HB-20, V:1377-1391). Amended to LEARN-WHEN-KEYED (J-HB-24).
- THE GRADE-MAP TOTALITY LAW (V:1424-1431).
- THE CHOOSER-TOTALITY STOP LAW (V:2293-2295).
- THE APPLICATION LAW: post-softmax with renormalization (J-HB-14, V:2192-2198), plus the exponent prohibition (V:2209-2215).
- THE NARROWED BELIEF CLAIM (V:2439-2443): "the ANTICIPATION term is always belief-routed … the HABIT term is always OWN-state".
- LEVEL-ONE BOUND (V:2581-2597): level two is "NOT built, NOT approximated, and NOT reserved".
- RUNGS NEVER COUNTS (J-HB-8, V:2845-2852). NO FLOAT REACHES PROSE (V:2866-2869).
- WEEKS NEVER TICKS (J-HB-17, V:3646-3659), scoped to ages; episode-key ticks are opaque identifiers (V:4063).
- THE EPOCH JOINT LAW (V:4111-4114): "HABITS ARE DERIVED STATE OVER LIVED HISTORY …".
- PREVIEW: READ YES, CREDIT NEVER (V:4175-4181, V:4211).
- THE PROMISE argument (V:4213-4267).
- J-HB-1..J-HB-28 (V:3487-3892), all vetoable. J-HB-23..28 are document-hygiene rulings (§8 below).

**"Not vetoable" items.** The owner's verbatim intent and his SCOPE EMPHASIS are LAW (V:101-103). The refinements are "accepted-vetoable" (V:103). Everything in §6 and §7 is vetoable.

---

## 4. CROSS-PROGRAM CLAIMS

| # | HB claim (line) | Reads / writes / assumes | Other side (volume or code) | Verdict |
|---|---|---|---|---|
| X1 | `doctrine` joins ES `legRefs` "as a SEVENTH member … ES §1 enumerates SIX EXACTLY" (V:2690-2694; also V:3313-3314, V:4053) | an ES vocabulary amendment in HB-8's commit | Code: **FIVE** members, `readiness, routePositionBand, storesBand, strength, tierBand` (M: envoyErrandVocabulary.js:207-213). AES §1 still prints six including `exports` (AES:190-203), while AES ES-1 says "the five-member legRefs set (EP-r cut 'exports' 2026-08-10)" (AES:1497-1498). AES has **zero** habit/HB mentions | **STALE in HB** (doctrine would be the SIXTH). ES is **SILENT** on the seam (no pin on ES's side). ⚠ The EP-r erratum IS in HB, but it was **pasted into the wrong sentence**: V:2047 attaches it to the `SOAK_COUPLINGS` clause, where it does not apply (see C1) |
| X2 | "PLANTED DOCTRINE RIDES THE REPORT ROAD — a synthetic BeliefReport … one writer (the information-statecraft family head)" (V:2705-2711; seam row 4, V:4054) | a plant written through `reconcileBelief` | AES §8 row 9: "J-INA-2 EXTENDED: products ride the report road; plants ride the plant roads; the two never share a writer (scan-pinned)" (AES:1819); the fold says the same (F:1351-1353). INFO: "The fold is the ONLY entry for commissioned falsehoods; a parallel lure ledger or second disinfo writer is a design defect (J-INF-3)" (INFO:284-287, :1346-1348). Code pin: tests/domain/espionageProducts.test.js:213-260 scans only that **no espionage module names `applyBeliefOverrides`**. It is one-directional, so it cannot see a plant entering the report road | **DISAGREES**, CONFIRMED by read. HB's planted doctrine would be a commissioned falsehood entering through the products' writer, past the disinfo fold. The scan that exists cannot catch it, so the defect would ship green |
| X3 | `doctrineTapEnabled` "UNREACHABLE until SP-D lands" because `errandSpineEnabled` "is declared as a RULE KEY nowhere" (V:1088-1100; HB-8 V:3318-3320; §5 V:3397-3402, V:3418-3421) | an ES gate | `errandSpineEnabled` is declared (M: simulationRules.js:301); F:568-573 carries the erratum: SP-D "LANDED at `0aac6792`" and "HB's ordering RISK statement … is therefore DISCHARGED" | **STALE in HB** (F AGREES with the code) |
| X4 | `suspicionOf`, `counterIntelEnabled` "ZERO hits"; the damper "CANNOT close on `suspicionOf`" (V:2812-2825, seam row 6 V:4056) | IN-3 | `suspicion.js:152 suspicionOf` and simulationRules.js:290 `counterIntelEnabled` exist. ⛔ suspicion.js:13-19: "IT NEVER READS TRUTH … It never names the sight ledger". HB's `awareness01 = sightPressure01 × ownSecrecyLevel01` reads `sightPostures[watcher][target]`, which is a truth read over other courts' postures (V:2794-2801) | **STALE, and now DISAGREES**. IN-3 landed a K3 law that forbids the very read HB's damper is built on (§8, FOLD) |
| X5 | `secondOrderBeliefEnabled` "returns ZERO hits in `src` — IN-1's mirror has not landed" (V:2595-2597) | IN-1 | simulationRules.js:411; `secondOrderBelief.js :: secondOrderMirrorOf` (:240) | **STALE**. HB's "what do they believe MY habits are" (V:2589-2593) should now say whether it composes with IN-1's mirror (PLAUSIBLE overlap) |
| X6 | "THE EPOCH JOINT LAW — stated identically in both volumes" (V:4109) | EP | AES-style grep: the EP volume has **zero** `habit` mentions (volumes-master/DESIGN_FP_ARCH_EP.md, 4117 lines) | **SILENT (EP)**. The "identically" claim is false |
| X7 | the doctrineBands fourth SP-B family through "the SP-B five joins" (V:2447-2465; seam row 2 V:4052) | SP-B | DESIGN_FP_ARCH_SP.md has zero HB/habit/doctrineBands mentions. The code has a tripwire on the IN side (IN-ES:260, `IN2_AXIS_FAMILIES`) | **SILENT (SP)** |
| X8 | `HABIT_HOLD_BANDS` derived from `DISPOSITION_CHANNEL_TUNING.BANDS` (V:2521-2530) | dispositionLedger | dispositionLedger.js:103 `const CHANNEL_BANDS`, :801 `BANDS: CHANNEL_BANDS`; habitVocabulary.js:114-116 projects it | **AGREES** (built) |
| X9 | `bandedStock` "ZERO hits … the habit family becomes `decayTowardNeutral`'s FIRST RIDER" (R3 V:308-322; HB-0 V:2936-2938; seam row 1) | SP-A | 13 `src` importers of bandedStock.js, including dispositionLedger.js:52, momentum.js:42 and secondOrderBelief.js:53 | **STALE** (harmless; the ruling's intent holds) |
| X10 | the law word "is read once, from the one home … no second spelling" (V:1918-1923); HABIT_TUNING maps keyed on the volatility order | WC's C3 contract: "ONE frozen table, four consumer families: HABIT r16 learning rate/decay …" (AWC:4711-4716) | `lawBandModulation.js` (WC-0C) is the one table; tests/lint/lawBandTable.walker.test.js:60-73 records **`habitCurve.js` as a "C3 LEGACY" private table — "breached before WC existed … recorded rather than repaired"** | **DISAGREES (WC and the code)**. HB is silent on `lawBandModulation`; HB-3+ owes "HABIT's learning row" into the one table (lawBandModulation.js:15) |
| X11 | HB-1 mints `STRATEGY_MOVES` and "deletes the dead DISJUNCT alone" (V:2972-2987) | WAR / politics | The built leaf satisfies WC §4.1.1's mint-first contract (strategyMoves.js header). settlementPolitics.js:618-624: "THE `move === 'fortify' ||` DISJUNCT BELOW IS LIVE AND ITS DELETION IS REFUTED: tests/property/espionageAbsenceDormancy.test.js's LOAD_BEARING_MOVES passes the token directly and two RATIFIED same-seed goldens record its value" | **AGREES** with WC on the leaf. **STALE in HB** on the fortify ruling (R7's corrected ruling is itself refuted by the build) |
| X12 | `settlementStrategy.js` "BASELINED AT EXACTLY 812 … HB-1 BUYS THE HEADROOM" (V:2273-2282, V:3028-3032, V:4102-4104) | size ratchet | scripts/.size-baseline.json key `_te_ceil_settlement_strategy_2026_08_31`: "812 -> 760, ENTRY DELETED (it now falls under the 800 domain layer ceiling)" | **STALE**. The headroom logic is moot; HB-5 now spends against the 800 domain ceiling |
| X13 | `CHARTERED_VOLUME_PREFIXES` ELEVEN, HB the twelfth (R5 V:349-354; Q4 V:4015-4029) | CW | tests/domain/couplingRegistry.test.js:119 has 13: `…'WY', 'HB', 'ENC'` | **STALE** (Q4 is discharged in code) |
| X14 | `proseNumerics` live ceiling 413; "an HB wave … re-records its own delta against 413" (R8 V:384-399; V:2853-2864) | prose gate | tests/lint/proseNumerics.test.js:484 `REVIEWED_TOTAL_CEILING = 218` | **STALE** |
| X15 | Edit Mode / L10 (postdates the volume) | the fork registry is the pin-fork substrate (F:209); HB-3 "No pledge on a pinned or directed choice"; HB-7 "Anticipation is inert on pinned ticks"; HB-6 "Doctrine rows are editable at record level"; HB-8 "The doctrine family is plantable content" via `confirmRumour`/`castDoubt`/`twistRumour` (F:3217-3221) | HB §3g: "habit state is ENGINE-ONLY and carries no DM verb in v1" (V:2906-2911) | **SILENT (HB)** on L10. Partial **DISAGREE** on doctrine rows, which the editor makes DM-editable at record level |
| X16 | J-HB-2: per-NPC habits "ONLY where per-NPC decision machinery already exists … the errand/espionage person choices and `npcLadderGoals`" (V:3494-3498); J-HB-4 never key on identity (V:3507-3510) | the generals (GEN 14a/14d/14d′) | The generals put a per-general habit, with dial drift ("the dials of ruling 4 drift with outcome"), and a per-court belief "about how a given general acts" through HB's own machinery. 14d′ says the conduct memory is held "by the affected enemies only" | **DISAGREES / unreconciled**. The generals need (i) an NPC grain HB permits only where machinery exists (no general-dial fork is in the registry), (ii) a subject grain of court→NPC where `doctrineBands` is court→court (V:2482-2492), and (iii) affected-only accrual where HB accrues from any hop-worn news report (refinement 13, V:2760-2770). A one-line seam exists in neither volume |
| X17 | warPeaceDecision `{accept, refuse}` (site 8, V:2246) | GR | F:3219 asks "Whether to mint the {accept, refuse} spelling or reuse `BALLOT_DECISIONS`". DESIGN_FP_ARCH_GR.md has zero HB mentions | **SILENT (GR)**; an open vocabulary question |
| X18 | `TAP_LEVELS`/`TAP_DEPTH` (V:2678-2681) | ES tap | espionageTap.js exists (M: espionage/) | **AGREES** (not re-measured in depth; PLAUSIBLE) |
| X19 | public-payload deny inherited (V:1001-1010, seam row 11) | security | worldSnapshotPublic.js:68 `WORLD_SNAPSHOT_HARD_DENY` | **AGREES** |
| X20 | the anticipation seam 2 "`beliefMap`'s injected closures … `habitAnticipationOf`" (V:2604, V:2630-2637) | beliefMap.js:1252 `advanceBeliefMaps({…credibilityOf, sightOf, commitmentDiscountFor})` | the signature AGREES. ⚠ Those closures modulate belief **reconciliation**, not a chooser. An anticipation closure there would change what a court BELIEVES, not what it DOES (PLAUSIBLE; see C4) | **AGREES on shape, mis-aimed in purpose** (PLAUSIBLE) |

---

## 5. INTERNAL CONTRADICTIONS (quoted both sides)

- **C1. The misplaced EP-r erratum.**
  - V:2046-2048: "`SOAK_COUPLINGS` is a closed six-member vocabulary; a habit band would need a SEVENTH member and therefore a ⏱ (EP-r cut 'exports' 2026-08-10: doctrine now lands as the SIXTH member, and the mint's refusal test gains its row against a FIVE-member base …)".
  - Against V:4073-4074: "A habit band would require a SEVENTH `SOAK_COUPLINGS` member (the vocabulary is closed at six)".
  - Against V:2690: "`doctrine` joins the ES `legRefs` closed set as a SEVENTH member."
  - 'exports' was a legRef and never a soak coupling. The code has SOAK_COUPLINGS at six (M: proposedSoakBands.js:37-39). The erratum belongs to V:2690, V:3313 and V:4053, and it corrupts V:2047.
- **C2. Rungs, never counts, versus the payoff line.** V:2845-2852 ("A habit has a FIRMNESS, not a history of tallies") and J-HB-8 (V:3556-3563), against V:2667 "believes they always march first; they have twice waited." and V:2688 "they say they always march; they have twice waited."
- **C3. A rung word that is not a rung.** V:2873 "reads them as decisive; they have grown restrained". `HABIT_HOLD_BANDS` = restrained · measured · settled · marked · dominant (V:2511-2512; habitVocabulary.js:114). "decisive" is a SUSPICION/pressure ladder word (suspicion.js:30, "quiet, present, pressing, decisive").
- **C4. HB-7's wiring.** V:2611 "HB-7 TAKES SEAMS 2 AND 4′ — the `beliefMap` injected closure and the WAR CHOOSER". Against V:2614-2616: "at HB-7's charter exactly two rows are non-null — site 7 … and site 8 (the pact answers)". HB-7's charter (V:3285-3290) wires seams 2 and 4′ and never names site 8, yet it owes `counterWeight` "for … the pact answers" (V:3292). It is unclear which code path carries anticipation to `warPeaceDecision`.
- **C5. The hold-band borrow direction.** R9 (V:420-432) and §3d (V:2509-2545) say the borrow is ONE-DIRECTIONAL: "There is no second array to keep equal to a first". HB-0 pins (V:2955): "the `CHANNEL_BANDS` both-directions equality pin". Seam row 2 (V:4052) similarly asserts "equality in BOTH directions" for the axis vocabulary (a different object; mild).
- **C6. HB-4's stale pin.** HB-4's charter drops site 2 (V:3163-3165), but its pins keep "the `historyTerm` non-duplication differential at site 2" (V:3180).
- **C7. The MINT-REQUIRED list.** V:877-880 lists the war-chooser moves as the ONLY "MUST BE MINTED" vocabulary. §3c marks site 6's posture set "MINT REQUIRED" (V:2244, V:3168). Site 8's `{accept, refuse}` appears in neither the frozen list (V:871-875) nor the mint list.
- **C8. A stale count the census missed.** J-HB-1 says "SOURCES (13 outcome kinds vs seven graded closes)" (V:696), while the closes are EIGHT (V:1349-1358; J-HB-13 V:3599). countsweep's PASS on `closes` (V:4352) did not cover this home, so its "every counted quantity agrees with every prose home" (V:4410) is over-claimed.
- **C9. The counterWeight scope.** HB-7's pin says "every (believed move, candidate) pair in every joined vocabulary has an authored cell" (V:3300-3302), against §3d: "The census denominator is `dyadicActions × believedVocabulary` … ⛔ NOT 11 × 11 = 121" (V:2568-2578), and against HB-7's own V:3291-3294.
- **C10. Dark versus lit.** The header says "every one DARK" (V:2915) and §2.4 makes dark byte-identity the contract. The owner's 09-23 word supersedes the August dark-shipping law for FP: "SHIPPED LIT: every FP layer LIGHTS" (F:3270). This is an external overturn, recorded here because the volume's §4 title is now false as a shipping statement (the dark *commit* law survives per J-EM-16, F:3272).

---

## 6. STALE PREMISES (refuted at 00b648c9d, live lines quoted)

| # | Volume premise (line) | Live code at M: | Verdict |
|---|---|---|---|
| S1 | "ARCHITECTED, NOT BUILT … Zero files under `src/` carry `habit`" (V:3-13) | `src/domain/worldPulse/habit/{habitCurve,habitGate,habitLedger,habitVocabulary}.js`, `habitForkRegistry.js` (888 lines), `strategyMoves.js` | REFUTED: HB-0..2 LANDED |
| S2 | ledger `{ v: 1, stocks: { <actorId>: { seat, byClass: {…} } }, open }` (V:720-747; F:788-799 repeats it) | habitLedger.js:15-18 `rows: { <actorId>: { <class>: { <action>: [stockInt, weekStamp] } } }, open: {…}`; no `v`, no `seat`; spatialUsage.js:175 `recCount(L.habits?.rows)` | REFUTED: the persisted shape differs. Heal-to-ABSENT on an unknown `v` (V:996-1000) has no `v` to read; the seat shock has no stored seat |
| S3 | `HABIT_ROWS_PER_ACTOR_CAP` "proposed 48"; ~121KB (V:911, V:765-772) | habitCurve.js:149 `HABIT_ROWS_PER_ACTOR_CAP: 24` (chair-signed, ODQ:1679-1686) | REFUTED (ODQ says so; the volume does not) |
| S4 | `PLEDGE_MAX_AGE_WEEKS` "proposed 208 — four years" (V:1271-1272) | habitCurve.js:158 `halfLifeWeeksOf(HALF_LIFE_BANDS[1+1])` = `a_few_years` = 156 (bandedStock.js HALF_LIFE_WEEKS) | REFUTED |
| S5 | the R7/HB-1 ruling: "delete the `move === 'fortify' ||` DISJUNCT ALONE" (V:375-382, V:2972-2977) | settlementPolitics.js:621-624 "THE `move === 'fortify' ||` DISJUNCT BELOW IS LIVE AND ITS DELETION IS REFUTED"; :645 `} else if (move === 'fortify' || move === 'defend') {` | REFUTED by the build |
| S6 | "retire `settlementStrategy`'s local `martialMoves` Set … retire `scoringObjective`'s implicit lever set to a derived export" (V:2970-2972) | strategyMoves.js header: "it is not retired; it becomes a NAMED DERIVED SUBSET"; "the direction reverses: the leaf stays frozen and zero-import"; settlementStrategy.js:79 `import { MARTIAL_HISTORY_MOVES }` | REFUTED (both clauses reversed, recorded in source) |
| S7 | settlementStrategy.js "BASELINED AT EXACTLY 812" (V:2274, V:3029, V:4102) | .size-baseline.json `_te_ceil_settlement_strategy_2026_08_31`: "812 -> 760, ENTRY DELETED" | REFUTED |
| S8 | `errandSpineEnabled` declared nowhere; the tap is UNREACHABLE (V:1088-1100) | simulationRules.js:301 `'errandSpineEnabled',` | REFUTED (F:568-573 already says so) |
| S9 | `suspicionOf` / `counterIntelEnabled` zero hits (V:2814-2818) | suspicion.js:152; simulationRules.js:290 | REFUTED |
| S10 | `secondOrderBeliefEnabled` zero hits (V:2595) | simulationRules.js:411; secondOrderBelief.js:132/240 | REFUTED |
| S11 | ES legRefs six (V:2690-2691) | envoyErrandVocabulary.js:207-213, five | REFUTED |
| S12 | `CHARTERED_VOLUME_PREFIXES` eleven (V:349-354, V:4016) | couplingRegistry.test.js:119, thirteen including HB and ENC | REFUTED |
| S13 | proseNumerics ceiling 413 (V:384-399, V:2853-2864, V:3561) | proseNumerics.test.js:484 `REVIEWED_TOTAL_CEILING = 218` | REFUTED |
| S14 | bandedStock has zero `src` riders (V:308-311, V:2936-2938) | 13 importers (rg `from '.*bandedStock`) | REFUTED |
| S15 | `SHEET_FLOOR` and the close-8 banding edges "are `HABIT_TUNING` members authored at HB-0" (V:3082, V:3091-3092, V:3309) | habitCurve.js:116-169 has neither | REFUTED (HB-0 did not land them; HB-3 and HB-8 assume them) |
| S16 | "the law word is read once … no second spelling" (V:1918) | lawBandTable.walker.test.js:70-73 `C3_LEGACY` names habitCurve.js a private table | REFUTED as a cohesion claim (see X10) |
| HOLDS | `STRATEGY_K = 3.5` (settlementStrategy.js:128); softmax at the caller (:1249); `bestTargetId` deploy-only (:782, :791); `bilateralOffer` (:866); `warIntent` deploy stamp (warIntent.js:291); `SILENCE_DECAY: 0.92` (beliefMap.js:113); `adjustedDecayBase` (:686); `advanceBeliefMaps` three closures (:1252); `DeploymentRecord` loose bag (pulseShapes.js:51); `TreatyRecord` one declaration imported thrice; `PAID_PLANT_OVERRIDE_KEYS` six (disinformationPlant.js:186-189); `IMPOSE_CHANCE` (traditions/relations.js:49, :172); `deliberationRead` guard chain (espionageMath.js:454-458); `reactiveResponse` uncalled (relocated to convergenceReactive.js:60, re-export only at convergence.js:774); `SOAK_COUPLINGS` six (proposedSoakBands.js:37-39); `WORLD_SNAPSHOT_HARD_DENY` (worldSnapshotPublic.js:68); `habits` TRACKED (spatialUsage.js:329); `BeliefDivergenceBand` gate `tier === 'premium' \|\| elevated` (BeliefDivergenceBand.jsx:101); `outboundImpression.js` present | CONFIRMED |

**Overturned by later rulings rather than by code:**
- (a) Q1. The fields are signed by the J-EM-15 reading, vetoable (F:3270). The volume still poses Q1 as open (V:3899-3972).
- (b) "every one DARK" was superseded by "shipped lit" (F:3270).
- (c) Spine req 14's mechanics were superseded by L10 (F:205). HB's edit-verb story (V:2906-2911) predates the editor.
- (d) The generals rulings 14/14d/14d′ (10-02) widen HB to a per-NPC (general) grain the volume rules out by default (J-HB-2).
- (e) The refutation register is stale as a census. ODQ:1685 cites R33/R34 refutations, so the volume's "EIGHTEEN premises" (V:168, V:4283) is no longer the count.

---

## 7. THE CLOCK AND THE TIER

**The clock arithmetic (PLAUSIBLE, from V:1531-1556 and habitCurve.js constants; not executed).**
- A balanced court's step for one "telling" close is `0.14 × 1.00`. From neutral, that moves 14% of the way toward the cap, so `tilt01 ≈ 0.14` and the factor is ≈ 1.049.
- Five consecutive telling wins with no decay give a factor ≈ 1.19. Ten give ≈ 1.27.
- Decay works against this. The half-life is 156 weeks (balanced), 52 (lawless) or 520 (lawful). A balanced court that wins one telling war per year settles near `tilt ≈ 0.44`, a factor ≈ 1.15.
- At the anchor softmax that moves `deploy` from p ≈ 0.32 to ≈ 0.35. The hand-walk shows the fully conditioned extreme (cap against floors) at 0.32 → 0.49 (V:1642-1645). The design rarely reaches it, because floors on rivals need repeated LOSSES on those moves, and nine of the eleven moves have no close at all.

| Mechanism | Cadence / dwell | Clock class | Tier |
|---|---|---|---|
| Credit at close (HB-3) | per graded close; read N+1 (V:1966-1975) | **yearly to epoch** for felt conditioning (a war close is months; meaningful tilt needs several closes) | Aspatial-capable in principle. ⚠ Its closes need lit producers: the war layer (lit only in `dramatic_campaign`/`full_simulation`, F:3272), demographics, coalition, trade |
| Decay | half-life 52 / 156 / 520 weeks by law word | yearly to decade | aspatial |
| Seat shock | per ruling-seat change | epoch | aspatial; no stored seat (S2) |
| Chooser read (HB-4/5) | every tick a joined site decides | fast weekly read of a slow stock | per site's own tier |
| Believed doctrine accrual (HB-6) | per report, adopt only above `DOCTRINE_ADOPT` (V:2760-2770) | **seasonal to yearly** (hop-worn news "rarely clears it") | needs belief axes lit |
| Believed-clock shelf life | `SILENCE_DECAY` 0.92 per silent tick, modulated | fast | aspatial |
| Anticipation (HB-7) | per war-chooser tick, `deploy` only | fast read of a yearly belief | needs the full ladder lit |
| Damper | per tick | fast | needs `infoStatecraftEnabled` |
| Tap and plant (HB-8) | per mission | seasonal | needs the errand spine and espionage; missions "dark end to end" (F:3092 item 7) |
| `doctrine_shifted` | a band crossing per class | **yearly** (a five-rung ladder over a slow stock) | Herald |

⚠ **Every felt beat of this family lives at the yearly or epoch clock.** A DM who advances a few weeks per session will go many sessions with no visible habit. In a fresh campaign, habits are absent by construction (V:1194-1208, cold-start = neutral), so the first months of any campaign show nothing at all.

---

## 8. DEPTH VS FELT VALUE (the hard judgment)

**The family's honest shape.** About 4,480 lines architect a learning stock whose **only unconditionally covered move at the flagship site is `deploy`** (V:1405, V:4055). Its anticipation reaches **`deploy` alone**. The volume says plainly: *"'A knows B will hold, so A does X' IS NOT EXPRESSIBLE HERE TODAY"* (V:2607). The owner's directive sentence is "If settlement [A] knows that settlement B genuinely does action Z … how settlement would react". That case is exactly the inexpressible one. **The flagship of the owner's sentence is unbuildable at the anchor without an owner-gated emitter change** (V:580-584).

Roughly 1,100 of the volume's lines are document hygiene with no product content: the count census and J-HB-23..28, and §9's 167 lines. Its DM-facing prose is about six sentences, two of which break its own laws (C2, C3).

| Mechanism | What a DM sees: the exact sentence, or "none" | Judgment |
|---|---|---|
| Learning stock + credit fold + pledge book (HB-2/3) | none directly. The tilt is ~5-15% on `deploy` at the yearly clock (§7) | **KEEP the law, NARROW the build.** It is the owner's verbatim directive. Build closes 1 (deploy) and 8 (goals) first. Close 4 (demographics) is the "reference implementation" but a low-drama site; FOLD it behind them |
| Second foreign field `treaty.habitEpisode` (keyed sue join) | none. Fires only when `bilateralOffer` (war rulings lit + termination + own front at target) | **CUT-TO-SENTENCE / DEFER.** Close 2 survives on its recompute road with no field (V:3967-3971). The field buys one conditional arm of one move. Recommend Q1 be exercised for `deployment.habitEpisode` only |
| 12 circumstance classes + precedence | the class phrase inside a receipt ("when its granaries run thin") | **KEEP** (built). ⚠ The classifier `circumstanceClassOf` is unbuilt. Q2's `unpressed`-dominance risk (V:3994-4000) is a felt-value risk: peacetime learning collapses to one heading |
| Frozen curve: volatility by law word (HB-0, built) | none, but it is the owner's "Chaotic makes both more volatile" | **KEEP** (owner law). Register its row in `lawBandModulation` (X10) |
| Severity weights, ruinous < grave (J-HB-7) | none | **KEEP** (one line of tuning) |
| Seat shock | none. No sentence; no stored seat (S2) | **CUT-TO-SENTENCE until a stable seat id and a sentence exist** ("the new duke has yet to learn the old court's caution", PLAUSIBLE example). DEFER the arm |
| Rounding fence | none | **KEEP** (built; one door) |
| Odds-ratio law + its 200-line derivation | none (a test property) | **CUT-TO-SENTENCE** in the volume. Keep the invariant and the pin; move the derivation and the sweep tables to the test file's docstring |
| Fork registry + chooser-totality walker + named-domain checklist (HB-1, built) | none, but it is now the **Edit Mode pin-fork substrate** (F:209, F:3089) | **KEEP**. It is the family's highest real value and it is estate infrastructure. Rename it in prose to "the estate's fork registry" |
| Chooser read at site 7 `deploy` (HB-5) | the reason row "as this court reliably does when …", sorted LAST and the first dropped by a 4-slice (V:2897-2904) | **KEEP, and FIX the felt surface.** The DM-visible reason must not be the one engineered to vanish. Give the habit reason a guaranteed slot on the deploy receipt, or put it in the dossier |
| Site 8 peace accept/refuse | none authored | **KEEP** (a pact answer is a DM-visible beat). Author the sentence |
| Site 13 / checklist row 12, goal kinds ("the personality-forming loop the owner named", V:2425) | none authored. Goals are NPC-grain, the best fit for spine req 4 (named actor) | **KEEP**, and **promote** to co-flagship with deploy. This is where a DM can read character |
| Sites 1, 3, 6 (demographics, coalition ballot, trade contest) | none | **DEFER** sites 3 and 6. Site 3 has no ballot record (F:3218); site 6's close is VERIFY-AT-BUILD (V:1355). **FOLD** site 1 into the first build as the proof site only |
| Believed doctrine axis (HB-6) | the dossier row: *"believes they always march first; they have twice waited."* (V:2667). Premium/elevated DM Realm Inspector only (V:2656-2661) | **KEEP**. This is the payoff. Rewrite the sentence in rungs (C2) and under the evidence law ("Ostmark believes Hale marches first when besieged; Hale has grown restrained", PLAUSIBLE form) |
| Believed-clock shelf life + "shelf life itself deceivable" (P4) | none. Only `confidence01` moves on an existing row | **CUT-TO-SENTENCE.** Keep the law "intelligence decays on the observer's believed volatility"; DEFER the `decayKeep01` composition until a DM can see it |
| Anticipation term (HB-7) | none authored; reach = `deploy` only | **DEFER at the institution grain; FOLD into the generals' loop (GEN 14a/14d).** "A predictable general can be anticipated, and baited" is the felt form of the owner's counterforce, at a named-actor grain the DM can read. One mechanism, one seam row, owner-routed |
| Deviation damper (`awareness01`) | none | **FOLD into IN-3.** Replace the sight×secrecy truth product with `suspicionOf` (IN-3 law, suspicion.js:13-19). One term: "a court that suspects it is watched follows its habit less" |
| Doctrine tap (HB-8b) + sixth legRef | the delta-tap line "they say they always march; they have twice waited." | **DEFER.** Missions are dark end to end (F:3092 item 7); premium-only; the count is stale (X1) |
| Planted doctrine (HB-8c) | the same, via delta only | **DEFER and RE-ROAD** through the disinfo fold (X2) |
| `doctrine_shifted` Herald kind | **no sentence exists**; no pacing/significance registration (spine req 12, SPN:76-79). The only habit surface a non-premium DM could ever read | **KEEP, and author it first.** One evidence-law sentence naming who, which circumstance and which move ("Hale now marches first when besieged"), registered with the pacing governor |
| Receipts law (rungs, no float, additive, sorts last) | the reason row | **KEEP** laws 1-4. **AMEND** law 5's "sorts LAST" for the flagship site |
| Count census, struck-premise scan, J-HB-23..28, §9 | none | **CUT** from the volume to a sidecar (it is repo-absent tooling, V:38-41). Keep a one-paragraph pointer |
| Epoch joint law, preview credit-never, public deny | none (correctness) | **KEEP** (laws; preview negative is real) |
| Cross-class bleed (Q5) | none | parked; fine |

**Verdict in one line.** HB's correct, owner-mandated core is a slow stock on `deploy` and on NPC goals, plus a dossier divergence row and one Herald beat. Everything else should FOLD into IN-3, into the generals, or into a sidecar, or DEFER until a sentence exists. The volume today carries no Herald sentence and no anticipation sentence, and its dossier sentence breaks its own law.

---

## 9. VOCABULARY (closed ladders and enums the family mints or borrows)

| Name | Values | Line | Homonym risk |
|---|---|---|---|
| `CIRCUMSTANCE_CLASSES` (12, codepoint-sorted) | coalition_called, crowding_pressed, faith_contested, legitimacy_shaken, rival_ascendant, route_menaced, siege_pressed, stores_thin, terms_offered, trade_contested, unpressed, war_open | V:807-820; habitVocabulary.js:59-72 | `stores_thin` against SP-B's `storesBand`; `terms_offered` against GR terms |
| `CIRCUMSTANCE_PRECEDENCE` (semantic) | siege_pressed → … → unpressed | V:832-834; habitVocabulary.js:80-93 | — |
| `HABIT_CLASS_CEILING` | 12 (owner-signed) | V:849-858; habitVocabulary.js:105 | — |
| `HABIT_HOLD_BANDS` (borrowed) | restrained, measured, settled, marked, dominant | V:2509-2530; habitVocabulary.js:114 | **"measured"** is also in IN-3's `ZEAL_POSTURES` (measured/paranoid/trusting, suspicion.js:86) and is the estate's evidence-class word. **"hold"** is a triple homonym *inside HB*: the strategy move `hold`, the sheet field `hold`, and `HABIT_HOLD_BANDS`. So `doctrineBands.sheet[cls] = { move: 'hold', hold: 'restrained' }` is a legal value (V:2491) |
| `STRATEGY_MOVES` (11) / `ALL_MOVE_TOKENS` / `MARTIAL_HISTORY_MOVES` / `NON_MARTIAL_HISTORY_MOVES` | credit, defend, deploy, embargo, hold, legitimacy, missionize, opportunity, prestige, reroute, sue_for_peace; non-martial = embargo, legitimacy, reroute | strategyMoves.js | `'fortify'` (the mobilization vocabulary) is admitted as a registered foreign token (settlementPolitics.js:618-620); `embargo` is also a TR verb and an EM seal |
| `FORK_DISPOSITIONS` | LEARN, STAY, DEFER, DEAD_CODE | habitForkRegistry.js:53 (V spells `DEAD-CODE`, with a hyphen) | spelling drift: V `DEAD-CODE` against code `DEAD_CODE` |
| `FORK_ARITIES` | monadic, dyadic, per-action | habitForkRegistry.js:56; V:2090 | — |
| `NAMED_DOMAIN_LABELS` (8) | TRADE, FAITH, STRATEGY, ROUTE CREATION, ROUTE CHOICE, INTER-SETTLEMENT DYNAMICS, GOALS, GOAL ORIENTATION | V:2382-2383; habitForkRegistry.js:67 | — |
| `LAW_WORD_VOLATILITY` | lawless, balanced, lawful | habitCurve.js:84 | a private law-band table (X10) |
| Grade values | the `SEVERITY_LADDER` rungs (glancing, telling, grave, ruinous; borrowed) ∪ `LAPSE` | V:1806-1818 | "grave" and "telling" against WR severity uses; `LAPSE` against the pledge "lapse" |
| Carry-road partition | CARRIED, RECOMPUTED, BOTH ROADS, VERIFY-AT-BUILD | V:1360-1362 | — |
| Coverage states | COVERED, NEEDS-A-CLOSE | V:1377-1391 | — |
| `counterWeight` | +1, −1, 0 | V:2556-2558 | — |
| Receipt | `{ kind:'habit', circumstanceClass, action, hold, source: 'own'\|'anticipated' }` | V:2835-2841 | — |
| Herald kind | `doctrine_shifted` | V:2877 | **"doctrine"** is a four-way homonym: ES `espionageDoctrine` (`DOCTRINE_TARGETINGS/METHODS/EMPLOYMENTS`, the court's spying policy), WC's "doctrine page" (AWC:3389), `conquestDoctrineStage`, and HB's doctrine sheet (habit modal). Recommend that HB's be called "the habit sheet" or "the court's manner" in prose and tokens |
| `doctrineBands` | `{ law: LAW_WORDS member, sheet: { cls: { move, hold } } }` | V:2482-2492 | — |
| Tap levels (borrowed) | performance < beliefs < delta (codepoint array beliefs, delta, performance) | V:2678-2681 | — |
| Episode-key spellings | `war:<besieger>:<target>:<orderTick>`, `terms:<treatyId>`, `terms:<offerer>:<target>:<peaceFrontSinceTick>`, `coalition:<k>`, `trade:<prize>:<openTick>`, `faith:<recId>:<openTick>`, `mission:<errandId>`, `goal:<goalId>` | V:1351-1359 | — |

---

## 10. REFINEMENTS (in-place bracketed corrections)

1. `[V:3-13]` "volume is **ARCHITECTED, NOT BUILT** … Zero files under `src/` carry `habit`" → `[CORRECTED 2026-10-16 (coherence fold) — HB-0 (e188760b8), HB-1 (1013d58ba) and HB-2 (de214782b) LANDED 2026-08-14 (CEN:24-26; F:3094). At 00b648c9d: src/domain/worldPulse/habit/ holds four leaves; habitForkRegistry.js holds 104 rows (84 DEFER, 20 STAY, 0 LEARN); habitConditioningEnabled is minted and lit in no preset; writeHabits has no src caller. HB-3..HB-9 are NOT STARTED.]` — S1.
2. `[V:30-37]` "Q1 … is the blocker" → `[CORRECTED 2026-10-16 (coherence fold) — Q1's two fields are SIGNED by the chair's reading J-EM-15(2) of the owner's 2026-09-23 word "no just build it all shipped lit" (F:3270), vetoable by one word. The volume itself remains UNSEALED: round four has no recorded close.]` — §2.
3. `[V:720-747]` the `{ v, stocks: { seat, byClass } }` shape → `[CORRECTED 2026-10-16 (coherence fold) — BUILT as { rows: { actor: { class: { action: [s, w] } } }, open } with NO v and NO seat (habitLedger.js:15-18). §1.5's heal-to-ABSENT-on-unknown-v and §3b's stored seat stamp have no field to act on; either amend HB-2 or rule the seat shock DARK-DECLARED (V:1938-1940 already allows it).]` Mirror it at F:788-799 — S2.
4. `[V:911; V:1271; V:765-772]` 48 / 208 / ~121KB → `[CORRECTED 2026-10-16 (coherence fold) — chair-signed 2026-08-15 (ODQ §43): HABIT_ROWS_PER_ACTOR_CAP = 24, PLEDGE_MAX_AGE_WEEKS = 156 (a_few_years, indexed), PLEDGE_BOOK_CAP = 256; 48/208 and the ~14-byte cost REFUTED (R33/R34).]` — S3, S4.
5. `[V:375-382; V:2972-2987]` "delete the `move === 'fortify' ||` DISJUNCT ALONE" → `[CORRECTED 2026-10-16 (coherence fold) — REFUTED BY THE BUILD: the disjunct is LIVE (a ratified consumer passes 'fortify' directly; two signed goldens record it) and is registered as the one foreign token (settlementPolitics.js:618-624). martialMoves became MARTIAL_HISTORY_MOVES, a derived subset, not retired (strategyMoves.js).]` — S5, S6.
6. `[V:2274; V:3028-3032; V:4102-4104]` "BASELINED AT EXACTLY 812 … HB-1 BUYS THE HEADROOM" → `[CORRECTED 2026-10-16 (coherence fold) — the entry was DELETED 2026-08-31 (812→760, now under the 800 domain ceiling; .size-baseline.json _te_ceil_settlement_strategy_2026_08_31). HB-5 declares its delta against that ceiling.]` — S7.
7. `[V:2690; V:3313; V:4053]` "a SEVENTH member … ES §1 enumerates SIX EXACTLY" → `[CORRECTED 2026-10-16 (coherence fold) — ENVOY_COVERT_LEG_REFS has FIVE members (envoyErrandVocabulary.js:207-213; EP-r cut 'exports' 2026-08-10, AES:1498). doctrine would be the SIXTH, and ES carries no pin for it yet.]` **And** `[V:2047]` strike the misplaced "(EP-r cut 'exports' …)" parenthesis from the SOAK_COUPLINGS sentence: `[CORRECTED 2026-10-16 (coherence fold) — this erratum belongs to the legRefs sentence (§3e); SOAK_COUPLINGS is still SIX (proposedSoakBands.js:37-39) and a habit band is still its SEVENTH.]` — X1, C1.
8. `[V:2705-2711; V:4054]` "PLANTED DOCTRINE RIDES THE REPORT ROAD" → `[CORRECTED 2026-10-16 (coherence fold) — conflicts with J-INA-2 EXTENDED ("plants ride the plant roads; the two never share a writer", AES:1819; F:1351-1353) and J-INF-3 ("the fold is the ONLY entry for commissioned falsehoods", INFO:284-287). A planted sheet enters as an axis-typed disinfo record through processLies' commissionPlants fold and reaches belief by that lifecycle. The existing scan (espionageProducts.test.js:213) is one-directional and HB-8 owes the reverse scan: no plant symbol on the report road.]` — X2.
9. `[V:1088-1100; V:3318-3320; V:3397-3402; V:3418-3421]` "UNREACHABLE until SP-D" → `[CORRECTED 2026-10-16 (coherence fold) — SP-D LANDED; errandSpineEnabled is declared (simulationRules.js:301); the tap is reachable through espionageActive (F:568-573). The ordering risk is DISCHARGED.]` — X3.
10. `[V:2812-2825; V:4056]` the damper's three refuted premises → `[CORRECTED 2026-10-16 (coherence fold) — IN-3 LANDED: suspicionOf (suspicion.js:152) and counterIntelEnabled (simulationRules.js:290). IN-3's law "IT NEVER READS TRUTH … never names the sight ledger" (suspicion.js:13-19) forbids awareness01's sightPostures read. awareness01 := the banded suspicionOf of the actor, one derivation, no truth term.]` — X4.
11. `[V:2595-2597]` "secondOrderBeliefEnabled returns ZERO hits" → `[CORRECTED 2026-10-16 (coherence fold) — IN-1 LANDED (simulationRules.js:411; secondOrderBelief.js). The level-one "what do they believe my habits are" read states whether it composes with secondOrderMirrorOf or stays on outboundImpression.]` — X5.
12. `[V:4109]` "stated identically in both volumes" → `[CORRECTED 2026-10-16 (coherence fold) — the EP volume carries NO habit text (zero hits); the joint law is stated HERE only and is owed one cross-reference line in EP §8.4.]` — X6.
13. `[V:2667; V:2688]` "they have twice waited" → `[CORRECTED 2026-10-16 (coherence fold) — breaks J-HB-8 (rungs, never counts). Spell it in rungs: "believes they march first when besieged; they have grown restrained".]` `[V:2873]` "decisive" → `[CORRECTED … — not a HABIT_HOLD_BANDS rung; use "dominant" or "marked".]` — C2, C3.
14. `[V:2897-2904]` "The habit reason sorts LAST" → `[CORRECTED 2026-10-16 (coherence fold) — at the flagship (site 7 deploy) the habit reason is the family's only DM-visible sentence; it takes a reserved slot rather than the first-dropped one, or it is also projected to the dossier.]` — §8.
15. `[V:2876-2893]` `doctrine_shifted` → `[CORRECTED 2026-10-16 (coherence fold) — no sentence is authored and no pacing/significance registration is named (spine req 12, SPN:76-79). Author the slotless fallback under the evidence law (who · circumstance · move) and register its significance class at HB-8.]`
16. `[V:1918-1923]` "THE LAW WORD IS READ ONCE" → `[CORRECTED 2026-10-16 (coherence fold) — habitCurve.js is recorded as a C3 LEGACY private table (lawBandTable.walker.test.js:60-73). HB-3 registers HABIT's learning row into lawBandModulation.js (WC-0C) and shrinks C3_LEGACY.]` — X10.
17. `[V:2955]` "the `CHANNEL_BANDS` both-directions equality pin" → `[CORRECTED 2026-10-16 (coherence fold) — R9: the borrow is one-directional; the pin is projection-equals-literal plus threshold-ascending (V:2537-2545).]` — C5.
18. `[V:3180]` "the `historyTerm` non-duplication differential at site 2" → `[CORRECTED … — site 2 is DEFER (R18); the pin moves to HB-9 with site 2's close.]` — C6.
19. `[V:3082; V:3091-3092; V:3309]` "`HABIT_TUNING` members authored at HB-0" (SHEET_FLOOR, banding edges) → `[CORRECTED 2026-10-16 (coherence fold) — HB-0 did not land them (habitCurve.js:116-169); HB-3 and HB-8 author them as tuning-bearing members, and their Bands lines change from NONE BY DESIGN.]` — S15.
20. `[V:696]` "seven graded closes" → `[CORRECTED … — EIGHT (V:1349-1358).]` `[V:4410]` "every counted quantity agrees with every prose home" → `[CORRECTED … — V:696 escaped the sweep; the claim is over its declared homes only.]` — C8.
21. `[V:2611-2616; V:3285-3290]` → `[CORRECTED 2026-10-16 (coherence fold) — name the code path that carries anticipation to site 8 (warPeaceDecision's accept threshold); seam 2 (the beliefMap closure) modulates belief reconciliation, not a chooser, and wiring a chooser term there is a category error (PLAUSIBLE).]` — C4, X20.
22. `[V:2915]` "every one DARK" → `[CORRECTED 2026-10-16 (coherence fold) — each wave COMMITS dark under the flag law; FP SHIPS LIT by LIT-n units per the owner's 2026-09-23 word (F:3270-3272).]` — C10.
23. `[V:3494-3498 J-HB-2; V:2760-2770 refinement 13]` → `[CORRECTED 2026-10-16 (coherence fold) — the 2026-10-02 generals rulings 14a/14d/14d′ (GEN:65-88) route a per-general habit and a per-court belief about a general through this family, with accrual held by AFFECTED enemies only. The seam (NPC grain, court→NPC subject, affected-only accrual) is unreconciled; see Q-HB-B.]` — X16.
24. `[V:2906-2911]` "habit state is ENGINE-ONLY and carries no DM verb" → `[CORRECTED 2026-10-16 (coherence fold) — L10 (F:205-211): the fork registry is the pin-fork substrate; HB-3 opens no pledge on a pinned or directed choice; doctrine rows are editable at record level through the belief ops (F:3217-3221).]` — X15.
25. `[V:4314-4480 §9; §6 J-HB-23..28]` → move to a sidecar `HABIT_COUNT_CENSUS.md` beside the repo-absent scripts. Leave `[MOVED 2026-10-16 (coherence fold) — document-hygiene instruments, no product content; see sidecar]`. Never rewrite the rulings; relocate them.

---

## 11. OPEN QUESTIONS FOR THE OWNER

- **Q-HB-A (re-sequencing / scope of the flagship).** The owner's own sentence ("If settlement [A] knows that settlement B genuinely does action Z … how settlement would react") is NOT expressible at the war chooser, because only `deploy` carries a counterpart (V:2607). Making it expressible means emitting a counterpart on more moves, an owner-gated emitter change (V:580-584). The alternative is to let the generals' person-keyed loop (GEN 14a/14d) carry the felt anticipation. Which does he want? Neither is decided here.
- **Q-HB-B (persistence shape + new capability).** The generals rulings need a per-general habit, a court→general believed-doctrine subject, and affected-only accrual. HB rules institution-grain by default (J-HB-2) and accrues from public news (refinement 13). Is a person-grain extension to HB a NEW capability under his 10-02 words, or a repair? Either way it is a persisted-shape change.
- **Q-HB-C (Q1, re-confirm).** J-EM-15 reads "build it all" as signing BOTH foreign fields. The second (`treaty.habitEpisode`) buys one conditional arm of `sue_for_peace`, and close 2 survives without it (V:3967-3971). Keep both, or sign only `deployment.habitEpisode`? One word either way.
- **Q-HB-D (golden shift, at lighting).** Lighting `habitConditioningEnabled` is a disclosed same-seed shift (V:4251-4258). Under "shipped lit" it re-records witnesses with the cause (F:3272). That shift is the owner's to see when the LIT unit comes. Nothing has moved yet.
- **Q-HB-E (paid surface).** The doctrine sheet, its divergence row and the tap product are premium/elevated only (V:2656-2661). The only free-tier habit surface would be the `doctrine_shifted` Herald beat, which has no sentence. Is any habit voice meant for the free tier?
