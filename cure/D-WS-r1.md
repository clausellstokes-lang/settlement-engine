# D-WS-r1 — DISPOSITION LANE over THE WAY OF WAR `docs/DESIGN_FP_ARCH_WS.md` (P6b round r1)
Seat: Opus 5.5, 2026-10-20 (started 15:02 CDT), under chair 6eb7b5b6 (Fable 5.1). Read whole: kit README (RESUME BLOCK 3 + laws), BOARD lines 114–129 (the 2026-10-20 owner words), `briefs/{RESEARCH-COMMON,COMPILE-COMMON,DISPOSE,RULINGS-P6}.md`, the volume (524 lines), `skeptic/WS-r1.md` (+ probe `adjacency.out`), `cure/L-WS.md`. Code of record: `master-81f1cd963` (READ-ONLY; HEAD confirmed `81f1cd963`). Never git; never the suite.

## INPUTS (every id this lane disposes)
- `skeptic/WS-r1.md`: WS-r1-1 … WS-r1-20 (4 B · 10 M · 6 m).
- `skeptic/SEAMS-P6.md`: ABSENT at 15:02 CDT (`ls skeptic/` — no such file; RESUME BLOCK 3 and the BOARD 13:17 line: SEAMS-P6 runs as a SECOND P6a call AFTER P5c) — no ids routed; nothing to dispose. Recorded, not invented.
- Other skeptics' ROUTES to WS: `OP-r1.md` "WS · … : —" (none) · `MG-r1.md` "WS: MG-r1-19, MG-r1-24" · `FS-r1.md` "WS: FS-r1-10 · 12".
- Compile logs' ROUTES to WS (ids minted here): RT-OP-1 (`L-OP.md` §5 "a court's way of war may bias its operatives' boldness — WS's to decide") · RT-MG-1 (`L-MG.md` §5 "`wayOfWarOf(court)` as the motive prior, the archetype bundle over MG's verbs") · RT-FS-a/b/c (`L-FS.md` §5 WS row: (a) ONE personality derivation · (b) the way as a need term (`attrition`, `coalition`) · (c) `fiscalStrainOf` as a weakness input) · `L-WS.md` §2 STOPs WS-S1/S2/S3 (ruled by RULINGS-P6 B.3 — applied, never re-raised).
- TOTAL: 20 + 2 + 2 + 5 = 29 ids.

## §1 MEASUREMENTS (re-read at master before each BLOCKING/MAJOR cure)
(being written)
Every row re-read at master `81f1cd963` this session (CONFIRMED unless marked).
- M1 THE ONE DRIVE (WS-r1-1, A.8). `src/domain/worldPulse/disposition.js :: computeAggressiveness` — "const drive = W_GOV * gov + W_PERS * pers + W_HIST * hist + W_DEITY * deityTemper;" (W_GOV 0.3 · W_PERS 0.45 · W_HIST 0.25 · W_DEITY 0.35); the deity "ONE additive warlike-deity term into the SAME drive sum — never a parallel multiplier"; hist = the legacy score or, channels lit, "2 - thresholdFactorOf(historyEntry, 'martial').factor". Consumers: `settlementStrategy.js` "const aggressiveness = computeAggressiveness(item, worldState);" (the chooser); `mobilization.js :: rampReadiness` "const aggr = computeAggressiveness(item, worldState); // centered on 1.0"; `pulseKernel.js` "const dispositionFactor = simulationRules.warLayerEnabled ? computeDispositionFactorMap(postTimeSnapshot, worldState) : …" (the raid weight's `candidateBase` factor; `relationshipRulesAdversarial.js` "actorSaveId: aggressorId, // disposition scales by the raider"). The WR-2 block: "Martial history already entered this move through computeAggressiveness. … never multiply the bar by it again"; "Reapplying any of them here would double diplomatic pressure, contradict insularity, and silently consume martial history twice." ⇒ the skeptic's receipt holds.
- M2 THE POSTURE IS LIT WITHOUT SP's FLAG (A.1). `strategicPosture.js :: courtPostureOf` — channels dark ⇒ "const signed = standingSigned(actor.id, entry); present.standing = …" (the legacy score, every campaign); only `appetite` waits on `strategicPostureActive(rules)`; `books` "is supplied or it is ABSENT". ⇒ `courtTemperOf`'s posture half is LIVE wherever a `dispositionStats` entry exists — NOT `neutral` (FS's §0.3 line 91 says otherwise: ROUTE FS). And `standing` IS the drive's `hist` memory (`standingSigned` = `readDispositionMultiplier`): one memory, counted once.
- M3 W-DOCTRINE-1 (WS-r1-2, A.8). `supplyWebWarfare.js`: "THE STRATEGIC CHOICE (§3) is an explicit DIRECT-vs-INDIRECT EV comparison"; `scoreCampaignEV({believedSelf, believedTarget, web, atrocityBrake01})` receipt "A direct assault is a losing bet, and … strangle it first."; `instrumentFit(instrumentKey, { archetype, evilLean01, lawfulLean01 })`; `expectedBloodyShare(actor)` (exported); `actorProfileOf` (private) = `governingCoalition(item).governing` + `computeMalice` + `computeLawfulness`; `INSTRUMENTS` = raid · occupy · interdiction · embargo · toll_war · purchase_denial; `CampaignPlan` {targetId, stages[{mode,…}], …} in `spatialLedgers.campaignPlans`; HBF-16 `chooseInstrument` DEFER. Gate `supplyWebWarfareActive` = warLayerEnabled ∧ virtual `supplyWebWarfareEnabled`; `simulationRules.js` `WAVES` "supplyWebWarfareEnabled: true" — compendium presets realistic_regional · dramatic_campaign · living_realm · full_simulation; acts where the war layer is lit (dramatic_campaign, full_simulation).
- M4 W-DOCTRINE-3b (WS-r1-10). `corruptionWeb.js :: foreignGripOf(worldState, snapshot, patronId)` ("a DERIVED per-patron foreign-grip read"); gate `corruptionWebActive` = beliefsActive ∧ virtual `corruptionWebEnabled`, "NO entry in DEFAULT_SIMULATION_RULES" and in no preset (`rg corruptionWebEnabled simulationRules.js` empty). `corruptionLeash.js` (src/domain/, not worldPulse) is the resolver chokepoint.
- M5 WITHDRAWAL (WS-r1-3). `warDeployment.js` "if (verdict.forcedLift || !verdictPermitsSiege(/** @type {any} */ (verdict.verdict))) {" — no threshold input; `feasibilityGate.js :: verdictPermitsSiege` "return verdict === 'plausible' || verdict === 'require_betrayal' || verdict === 'require_magic';". C3 has nothing to lean.
- M6 THE HARASSMENT DEED (WS-r1-9 — measured further than the skeptic): a deployed weak attacker on a `harassment` verdict is WITHDRAWN and the loop `continue`s ("continue; // the siege is broken off — no harassment on top."); the `HARASSMENT_SEVERITY` outcome fires only when `withdrawn.length === 0` (a stale front). ⇒ the landed guerrilla war is NOT the deploy move; it is W-DOCTRINE-1's indirect campaign ("a smaller force that cannot win the direct fight … systematically strikes the satellite suppliers"). The raid rule's aggressor is "the stronger side by STATE" (`relationshipRulesAdversarial.js :: hostileRules`).
- M7 THE PIN (WS-r1-4, A.7). `directives.js :: forkPinsFor` "pins[pin.forkId] = pin.outcome;" — keyed by fork id alone, "THE PIN BAG for one tick"; `PIN_FORK_FIELDS = ['forkId', 'outcome']`.
- M8 PRESETS (WS-r1-6/7). `simulationRules.js`: dramatic_campaign "warLayerEnabled: true, settlementStrategyEnabled: true" and NO `warEconomyDrainEnabled`/`warLevyEnabled`; full_simulation adds "warEconomyDrainEnabled: true" · "warLevyEnabled: true" and "dispositionChannelsEnabled: false"; `warMemoryEnabled`, `habitConditioningEnabled`, `strategicPostureEnabled`, `treasuryEnabled`, `espionageEnabled` are in the virtual list, lit in no preset; `demographicsEnabled: false`.
- M9 THE UNSTABLE FACETS (WS-r1-8). `militaryStrength.js`: logistics = "food.resilienceScore * 0.6 + storageContribution" (storageMonths; `seasons.js` "TEMPORARILY DEPLETED in winter → REPLENISH in spring"); economy = `deriveSystemVariable('economic_capacity', s)` (`warDeployment.js` header: "the `war_drain` condition → `economic_capacity`, the homeostasis SOURCE"); will = government label ±14/−10 + "if (temper === 'warlike') { will += 8" (WS-r1-19). Stable: manpower ("tierFrac * 70 + popScore * 30"), institutions (`liveInstitutions`, walls+garrison), materiel (exports/imports/institutions by `MATERIEL_PATTERN`).
- M10 BELIEF HOLES (WS-r1-11). `beliefMap.js` "conditionsBands  SP-B: believed {pullBand, routePositionBand, storesBand, tierBand}" — no believed legitimacy or coup; `feasibilityGate.js :: defenderHasCollapseSignal` reads the defender's TRUE conditions. FIELD MEMORY: `armyTransitKernel.js` re-plans the beaten column "role: ARMY_ROLES.RETREAT" (`armyTransit.js` "RETREAT: 'retreat'") and flags its deployment for withdrawal; `deploymentReturn.js :: SPLINTER_RATIO = 0.3`. W-MEM `worldState.concludedWars` (`concludedWarRecord.js :: warIdFor({ lowId, highId, openedTick, seq })`) under `warMemoryEnabled` (lit nowhere).
- M11 THE ADJACENCY (WS-r1-14): the skeptic's probe `skeptic/WS-r1-probe/adjacency.out` "deviations whose landing way is NOT the cause's way: 33/49" — accepted as executed; the cure removes the ring, so the probe's question vanishes (re-run unnecessary: the cured rule lands every deviation ON the cause's way by construction; `cure/D-WS-r1-probe/deviation.mjs` executes the cured table — see §3).
- M12 TOKENS (WS-r1-15). `envoyTaskCatalog.js` "`fit: 'unread'`" (same sense: no reading formed); CH §4.8 reason word `purse_empty` (a PARAGON's purse — a different subject); EC's link kind `dm_pinned`; `momentum.js :: temperamentMomentumOf` / `entityThreshold` "temperament". Replacements FREE (`rg -w -i` src/tests/worktree docs/ledger docs = 0/0/0/0): `coffers_bare` · `seafaring` · `courtTemperOf`(ledger 1 = FS's citation) · `aggressionTermsOf` · `wayHostLeanOf` · `warWays` · `latchWarWay` · `campaign_plan` · `wayPriorOf`.
- M13 THE FOLD (WS-r1-16/17). Fold §3.1.24 "`pactFormation.js :: reserveFor`'s `reserve01` … ONE LEAF PER SEAM … any later lean on either term registers in the same leaf"; fold §3.4 `armies_meet` "STANDING-at-contact (S5)"; `war_declaration` CLIMAX · `siege` STANDING · `raid` CLIMAX · `supply_raid` CLIMAX (S5-B4) · `blockade` STANDING · `call_in_answer` CLIMAX · `coalition_join` CLIMAX (S5-B4).
- M14 THE CROSSING HOST (WS-r1-18). `dispositionLedger.js :: appetiteCrossingOf` has zero callers outside its file (`rg`); no "herald post-apply observation pass" symbol exists.
- M15 WR-8 (refinement; not raised by the skeptic). `conquestDoctrineStage.js :: conquestMarchOrder` (642 raw) — the conquest belief → the march ORDER of targets; dark (`conquestDoctrineEnabled` virtual + its chain). A second landed WHOM-ordering chooser beside C4's designed G13 order.

## §2 THE RECORD (29 input ids; 29 disposed: 26 CURED · 0 REFUTED · 0 STOP · 3 NOTED) — also appended to the volume as §17 THE CURE RECORD
| id | sev | disposition | where (volume) | receipt |
|---|---|---|---|---|
| WS-r1-1 | B | CURED (A.8; the lane's reading, OD-WS-25) | WS2 · §2.3 `courtTemperOf`/`wayHostLeanOf` · §3.1 · §4.1 · §4.2 HOST rows · S17 | M1; probe `deviation.out` (temper-only fit ⇒ ×1) |
| WS-r1-2 | B | CURED (A.8) | §0.1 · WS3 · WS19 · `wayMethodOf` · §3.3 METHOD · §5.1 campaign plan · OD-WS-26 | M3 |
| WS-r1-3 | B | CURED (B.3) | §4.2 C3 STRUCK · §10 · §13 | M5 |
| WS-r1-4 | B | CURED (A.7) | P2 · WS8 · §8 · §11 · S7 · OD-WS-2 (VISIBLE) | M7 |
| WS-r1-5 | M | CURED (B.3) | §3.3 floor ⇒ REPORTED ×1; war-memory read named · OD-WS-9 | M10 (W-MEM lit nowhere ⇒ degraded "at war now") |
| WS-r1-6 | M | CURED (A.1) | §0.1 · §3.1 · WS18 · OD-WS-24 | M2, M8 |
| WS-r1-7 | M | CURED (B.3, generalised R20) | WS4 · §3.3 GATE · §0.3 · S19 · OD-WS-27 | M8 |
| WS-r1-8 | M | CURED (B.3) | WS5 · §3.2 · P4 latch · S11 · S20 · OD-WS-23 ⭐ · OD-WS-29 | M9 |
| WS-r1-9 | M | CURED (skeptic's 2nd cure) | §2.1 · §3.3 · §4.2 · WS4 · WS19 · OD-WS-32 | M6 — measured further: the deployed weak attacker is withdrawn the tick its verdict reads `harassment` (no harassment outcome fires with a live deployment), so the skeptic's first cure ("lean INTO the deed") would buy a futile march; the doctrine is the landed guerrilla war |
| WS-r1-10 | M | CURED | §2.1 PARKED · C11 ST struck · C12 SLOT · coverage table · OD-WS-4 | M4; ST6 |
| WS-r1-11 | M | CURED | §5.1 `seat_rotting` DARK · `field_lost` named reads · §6.2 · OD-WS-31 | M10 |
| WS-r1-12 | M | CURED (A.2) | §4.2 C5 re-keyed on MG's 35 motive keys · §5.2 · §13 · OD-WS-28 | MG §5.1–5.2 as cured by D-MG-r1 (dial struck; `Π_m wayLeanOf(way, m)`) — re-checked, aligned |
| WS-r1-13 | M | CURED | answer · §3.4 · §5.2 · §7 · §16 | `stepPosture` no season; market endogenous; corps DM-born |
| WS-r1-14 | M | CURED (B.3) | §5.1–5.2 · `WAY_STEP` struck · S6 · OD-WS-10 | probe `deviation.out` "landed on the cause's way 56/56" |
| WS-r1-15 | m | CURED | §2.5 · §14 | M12 |
| WS-r1-16 | m | CURED | C10 · §13 GR | M13 |
| WS-r1-17 | m | CURED | §8 | M13 |
| WS-r1-18 | m | CURED | WS13 · §2.3 · §3.4 · §10 | M14 |
| WS-r1-19 | m | CURED | §3.1–3.2 (`will` struck) | M9 |
| WS-r1-20 | m | CURED (both sides named) | §5.1 · §13 · §10 WS-0 | FS §7.5 (D-FS-r1) |
| MG-r1-19 | M | CURED (WS half) | §4.2 C5 · §13 | A.2 |
| MG-r1-24 | m | CURED (WS half) | WS7 · §6.2 | MG §5.3 (cured by D-MG-r1 to read `believedWayOfWarOf`) |
| FS-r1-10 | M | CURED (WS half) | §2.3 · WS18 · OD-WS-24 | A.1; FS §3.1 (D-FS-r1) cites WS §2.3's exact shape |
| FS-r1-12 | M | CURED (one seam, both sides) | §13 FS row (war-purse row STRUCK) · §5.1 | FS §7.2 STRUCK by D-FS-r1 |
| RT-OP-1 | route | NOTED (decided: no) | §13 OP row | opportunity boldness is the traveller's roll |
| RT-MG-1 | route | CURED (= MG-r1-19) | §4.2 C5 | — |
| RT-FS-a | route | CURED (= FS-r1-10) | §2.3 | — |
| RT-FS-b | route | NOTED | §5.1 | FS struck its way-of-war need term |
| RT-FS-c | route | NOTED | §13 | FS struck `fiscalStrainOf` |
APPLIED, never re-raised: WS-S1 (OD-WS-12, owner row) · WS-S2 (B.2 S-MG-3) · WS-S3 (C4).

## §3 THE NEW-CONTRADICTION CHECK (grep of every citing volume)
- `grep -l 'DESIGN_FP_ARCH_WS\|wayOfWarOf\|wayLeanOf\|courtTemperOf\|THE WAY OF WAR' docs/*.md` → FS, MG only (and OP's coupling row).
- MG (cured in parallel by D-MG-r1): reads `wayOfWarForWar(…).way` and `Π_m wayLeanOf(way, m)`; struck its dial (iv). The compile-time WS draft handed MG the UNDEVIATED way on a `commander` turn — that would have made the general enter MG ZERO times; corrected this session (`wayPriorOf` is C4's alone). C5 re-keyed on MG's current 35 motive keys. ONE residue: MG §5.2 quotes `WAY_DEVIATION_CAUSES` "`commander · field_lost · purse_empty · …`" — `purse_empty` is now `coffers_bare` (ROUTED; a word, not a contradiction of design).
- FS (cured in parallel by D-FS-r1): FS §3.1 already cites WS §2.3's `courtTemperOf` shape verbatim and reads `posture.direction`, `malice01`, `lawfulness01` — consistent. FS STRUCK `fiscalStrainOf`, the war-purse band and its way-of-war need term — WS reads none of them (an earlier draft of this session used `fiscalStrainOf` as `seat_rotting`'s carrier; withdrawn the same session once FS's strike was read). ONE FS error ROUTED: FS §0.3 (line 91) and §3.1 "SP-4 dark ⇒ the posture reads `neutral`" — `courtPostureOf`'s `standing` term is live without `strategicPostureEnabled` (M2). FS §7.5 says "WS reads the VAULT … as a strength" — after WS-r1-8 WS's fit reads no purse; the coffers are deviation causes only (ROUTED, a wording fix; the loop's damping stands).
- OP: §15/§16 row "a court's way of war may bias its operatives' asides … a ROUTE to WS" — WS declined (RT-OP-1); OP's row stays a proposal WS answered "no"; no contradiction.

## §4 ROUTED (the halves this lane cannot write; one line each — for the P6c brackets lane / the sibling lanes)
- WC: register WS's `way` HOST-lean term on the shared-signal car and state that the car admits no claimant re-consuming an input the chooser already applied (WS-r1-1).
- WC: `disposition.js` gains ONE export `aggressionTermsOf(item, worldState)` (the four drive terms + the drive); `computeAggressiveness` calls it, byte-identical (WS-1's car).
- WC: name the owner volume of W-DOCTRINE-1 (`supplyWebWarfare.js`) and W-DOCTRINE-3/3b (`corruptionLeash.js`, `corruptionWeb.js`) (WS-r1-2, A.8).
- WC: note the silent levy — `warLevyEnabled`/`warEconomyDrainEnabled` are lit only in full_simulation (WS-r1-7, B.3).
- WC: the withdrawal closer has no threshold input — no volume may lean it (WS-r1-3); confirm the live war's opened tick for `warIdFor` (P4's key).
- C4 (GENERALS): G2's "three thresholds that already exist" — for (ii) HOLD/WITHDRAW the threshold is the gate's verdict band; G1/G2/G13 read WS's `wayPriorOf`; G13's target order registers against WR-8's `conquestMarchOrder` (WS-r1-3, A.2).
- MG: §5.2's quote of `WAY_DEVIATION_CAUSES` → `coffers_bare` for `purse_empty`; §15's WS coupling cites WS §4.2 C5 as keyed on MG's motive keys (WS-r1-12, WS-r1-15).
- FS: §0.3 line 91 and §3.1 — "SP-4 dark ⇒ the posture reads `neutral`" → "`courtPostureOf`'s `standing` term (the legacy score) is live in every preset; only its `appetite` term waits on `strategicPostureEnabled`" (M2).
- FS: §7.5 — "WS reads the VAULT (`treasuryBandOf`) as a strength" → "WS reads the coffers only as two deviation causes (`coffers_bare`, `levy_thin`), latched once a season; its fit reads no purse" (WS-r1-8, WS-r1-20).
- HB: HB-7's row on the shared-signal car admits no re-consumption of an applied input; the two fork rows `way_of_war_shift` (STAY) · `war_way_deviation` (DEFER, `closeOwed` HB) (WS-r1-1, WS16).
- EM: the pin catalogue row `war_way_deviation` carries the note "one week, every court's war"; a lasting per-war setting is an owner row (WS-r1-4, A.7).
- IN: offer a believed carrier of a foe's rot (a coup or rising heard as news on the report road) for WS's `seat_rotting`, or it stays dark (WS-r1-11).
- ES: name the errand-kind input WS's C12 leans (`way_subversion` → "toward the foe's seat"); confirm `foreignGripOf` as `way_subversion`'s carrier (WS-r1-10).
- ST: none — WS no longer leans a ready-keep "spend" (ST6) (WS-r1-10).
- GR / FOLD: the §3.1.24 joint leaf on `reserve01` admits WS as its third claimant (after RN, CH) under the one joint cap (WS-r1-16).
- CH: §4.8's `purse_empty` stays CH's; WS's court cause is `coffers_bare` (WS-r1-15).
- EC: register WS's `dm_pinned` as a same-sense reuse of EC's link kind (WS-r1-15).
- OP: §15 WS row → "WS declined: a way never biases an opportunity's boldness; it leans only the errand KIND (C12) once ES names it" (RT-OP-1).
- FOLD (P7): §5 rows per WS §14 (`courtTemperOf` the SHARED read · `campaign_plan` · `coffers_bare` · `seafaring` · `temper_moved` · `warWays`/`latchWarWay` · the reuses `unread`/`dm_pinned`); `armies_meet` STANDING-at-contact cited by WS; chain C20 after WC's car and C4; OD-FC rows for WS's VISIBLE rows OD-WS-2 · OD-WS-23 ⭐ · OD-WS-25 (the A.8 reading).

## §5 WHAT THE CHAIR MUST RULE OR CONFIRM (no STOP raised)
1. OD-WS-25 — THE A.8 READING: "the way's PERSONALITY half is ONE term inside computeAggressiveness's drive" was applied as "the drive IS that one term; on C1/C2/C6 the way leans by its strength share only" — NOT as a fifth term added into the drive (it would re-count the drive's own inputs inside the same sum and move every other reader of the drive). Veto ⇒ the fifth-term arm is a one-paragraph swap in §4.1.
2. OD-WS-23 ⭐ — P4, a NEW persisted shape (the season's latched deviation), introduced to build the chair's own B.3 "the deviation latches its cause with the season's roll" (a pure read cannot remember a season). `wayOfWarDeviationEnabled` now requires the owner's word. VISIBLE.
3. `way_subversion` PARKED (OD-WS-4) and `seat_rotting` DARK (OD-WS-31) — the eighth way is a candidate nowhere today.
4. `way_raiding`'s `deploy` lean ×1 (REFINED, OD-WS-32) — beyond the inputs.

## §6 CONFIRMED vs PLAUSIBLE
CONFIRMED by reads at master `81f1cd963` this session (M1–M15, lines quoted) and by the executed probe (`cure/D-WS-r1-probe/deviation.out`): the drive and its three consumers, the posture's live `standing` term, W-DOCTRINE-1/3b's symbols and gates, the withdrawal closer and the harassment outcome's stale-front-only firing, the pin bag, the presets, the unstable facets, the belief record's bands, the RETREAT role and the splinter ratio, the fold rows, the token census. PLAUSIBLE: every designed sibling's input name (C4, MG beyond its cured text, PS, CH, GR, PR, ES, IN), `allyDefenseEnabled` as coalition's second GATE ledger, the doctrine's receipts carrying the struck court's id (the believed method half), `warIdFor`'s opened tick for a live war, every DRAFT constant.

## §7 STATUS
COMPLETE — nothing left for this seat. Context ≈ 210k. Backup of the pre-round volume: `cure/D-WS-r1-probe/WS-before-r1.md`; the splice inputs `c01.md`–`c19.md` and `splice.py` are in the same folder.
