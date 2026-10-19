# D-PS-r2 — DISPOSITION LOG for THE PASSAGE (`docs/DESIGN_FP_ARCH_PS.md`), P3 round 2b (lane D-PS-r2, chair a73343ed; seat Opus 5.5; 2026-10-18 08:09–08:3x EDT by `date`)

Status: DONE. 46 of 46 disposed — CURED 45 · NOTED 1 · REFUTED 0 · STOP 0. Files written: the volume (in place), this log, `cure/D-PS-r2-probe/` (`PS-before-r2.md` byte copy 107,948 B / 560 lines → after 194,813 B / 714 lines; `sweep.mjs` → `sweep.out`; `tokens.out`; `check-r2.py` → `check-r2.out`). No git, no test suite, no other file touched.

Inputs: `skeptic/PS-r2.md` (25 ids, all); `skeptic/SEAMS-r2.md` routes to PS (1, 6, 7, 8, 10, 13, 18, 21); `skeptic/HOST-r2.md` routes to PS (2, 3, 14, 16, 17, 18); `briefs/RULINGS-ROUND2b.md` items naming PS (PS-r2-1, -2, -3/4, HOST-r2-3 — same ids as above — plus PR's questions 1, 2, 4, SEAMS-r2-2's envoy arm and HOST-r2-1's winter law); two `RULINGS-ROUND2.md` C rows the volume had to satisfy (Q1, Q4; Q2 and Q3 are PS-r2-8 and SEAMS-r2-10). Read whole: kit README, COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, RULINGS-AFTER-RESEARCH, RULINGS-AFTER-COMPILE, CHAIR-NOTES-FOR-THE-FOLD, RULINGS-ROUND1 (+ ADDENDUM), RULINGS-ROUND2, RULINGS-ROUND2b, BOARD, L-PS, OWNERSHIP, the three skeptic files, the volume. By section/grep: PL §2/§3.4/§4.5/§4.6/OD-PL-46, MN MN5/§3.3/OD-MN-29, RN §2.2/§3.1, CH §16b/§12.4, PR §6.5/§9.1/§10, ST §3.3/§4.3/§10, the fold's WHERE table and §3.1 EC row.

## 1. MEASURED FIRST (code of record `master-81f1cd963`, read-only)

| # | Question | Receipt | Verdict / bears on |
|---|---|---|---|
| M1 | Does a march path cross gateless hops? | `distanceRead.js :: routingAdjacency`: "the AUGMENTED graph when a materialized slot is lit AND the trip INVOLVES that modality's node — a PORT (sea lanes) or a circle-holder (teleport…)"; `gateAdjacency` "land only"; `seaRoads.js :: classifyLegModes`; `teleportAdjacency` | CONFIRMED. PS-r2-2 / HOST-r2-2: the hop's modality is read by the landed classifiers (`passageHopModes`) |
| M2 | Convoy / blockade shape | `armyTransit.js :: ARMY_ROLES` five roles ("CONVOY … BLOCKADE … ride the SIBLING `navalTransit` ledger"); `navalKernel.js` header: a convoy record's `cargoId` is the army; "SEA BATTLES … resolveFieldBattle VERBATIM"; "BLOCKADE … MINTS A SIEGE" | CONFIRMED. The army's own `armyTransit` path carries the sea hops; the convoy is its carriage (PS1) |
| M3 | What is the unit's stable identity? | `warArmyRecord.js`: `return { targetId, sinceTick: tick, role, …`; "Preserve the original sinceTick so deploymentAge reflects the true campaign length"; `armyTransitKernel.js` seeds via `planMarch(…, num(dep.sinceTick, nowTick), season)`; `createArmyCommandPicture` id `army_picture:<armyId, targetId, sinceTick>` | CONFIRMED. PS-r2-3: `unitKey = 'army:' + armyId + ':' + sinceTick` |
| M4 | Is `armyRouteId` compared across ticks? | `envoyDiplomacy.js`: `text(venue.routeId) === text(latest.routeId)` (both frozen in one encounter); `envoyErrandEncounterWriter.js` compares the candidate with the same tick's preview | PLAUSIBLE: no cross-tick comparison found; declared drift + pin |
| M5 | The position law; does the next-node rule skip nodes? | `stepArmyPosition`: "linear in weeks"; `currentRegion` rounds; EXECUTED `sweep.mjs` (the cured sweep `reachedIdx < j ≤ c`) | CONFIRMED by execution: judged 154/154 (grid), 69/69 and 82/82 (ports, null and winter), 62/62 (coast); 0 unjudged (the skeptic's next-node rule left 2, 11, 20 unread) |
| M6 | Can a whole-week clock stand a held unit just before the border? | `sweep.out` clamp counts: 2/154 land holds, 11/69 and 20/62 sea-lit holds clamp below `path[j−1]` (often index 0: a 3-hop march in 2 weeks has positions 0, ½, 1) | CONFIRMED by execution. PS-r2-5: the crossing record carries the place; the `marches` high-water index keeps passed nodes passed |
| M7 | Sea landings vs waypoints | `sweep.out`: ports fixture 37 of 69 nodes entered by sea → 30 landings (sea in, land out), 7 waypoints at sea; coast fixture 62 of 62 waypoints | CONFIRMED by execution. OD-PS-28 (the waypoint reading is vetoable and decides whether coast voyages ask at all) |
| M8 | How does `planMarch` price a march? | `const base = hopWeeks(digest, originId, destId, season);` (the cheapest route); `supplyShipments.js :: routeWeeks(digest, cost)`: `const { weeksPerCost } = calibration(digest); … return Math.min(52, Math.max(1, weeks));`; `MAX_HOP_WEEKS = 52`; `seasonalPathCost` "the caravan arrival clock (supplyShipments.routeWeeks) minimize / schedule on THIS" | CONFIRMED. PS-r2-6: reuse the landed caravan clock over `seasonalPathCost` (a `distanceRead.js :: routeWeeks` would have COLLIDED with the landed name — caught by this lane's census) |
| M9 | Slow, never sever | `spatialCost.js :: SLOW_NOT_SEVER_MAX = 6`; `distanceRead.js :: stormSeasonFactor` "Always ≥ 1 (slow, not sever)" | CONFIRMED. RULINGS-ROUND2b HOST-r2-1 |
| M10 | The belief read for absence | `beliefMap.js :: readBeliefRelationship`: "truth / self / unknown ⇒ the known declared relationship" | CONFIRMED. PS-r2-13 |
| M11 | Occupation | `rulingPowerSeat.js :: foreignSeatOf`: "1. the occupations ledger at rung < vassalized ⇒ regime `occupation`, PRIMACY"; `occupation.js`: `const fromType = String(found.edge?.relationshipType \|\| found.edge?.type \|\| 'hostile');` | CONFIRMED. PS-r2-12 |
| M12 | `client` edges | `relationshipState.js :: normalizeRelationshipEdge`: `legacyRelationshipType: "client"`, `normalizedDirection: "client_to_patron"` | CONFIRMED. PS-r2-21 |
| M13 | Breach vocabulary | `treatyBreachTypes.js :: BREACH_TYPES = Object.freeze(['repudiation', 'succession_repudiation'])` | CONFIRMED. PS-r2-9 |
| M14 | Home defence | `warCapacityReads.js :: buildCapacityLookup` (`homeDefense` = `offensive` minus army-away); field losses written back to deployments only (the kernel's `mauled` pass) | CONFIRMED. PS-r2-11 |
| M15 | Foraging | `rg -i 'forag\|requisition' src`: resource/generator data only (`'foraging_areas'`), WC's `foraging` free-unit state unbuilt | CONFIRMED. PS-r2-10 |
| M16 | Band words | `beliefAxisSubjects.js :: SCARCITY_BANDS = ['scant', …]`; `grudging` 1 quoted (`npcGenerator.js` respect words); `fair` in `warCoalitionEvidence.js` `QUALITATIVE_BANDS` and the tradition act; the intensity walker: "CONSUMERS may grow freely … MINTS may not"; `conquestFeasibility.js :: CONQUEST_PRESSURE_BANDS` = `['unknown','quiet','present','pressing','decisive']` | CONFIRMED. PS-r2-20 |
| M17 | `siegeFallOddsWordFor`, `SIEGE_MAX_AGE` | `warSiegeVerdict.js`: `export function siegeFallOddsWordFor(pFall)`; `SIEGE_MAX_AGE = 60` | CONFIRMED. PS-r2-22 |
| M18 | The ledger-key walker | `lib/spatialUsage.js`: "EVERY spatialLedgers key … must be classified here — either TRACKED … or EXEMPT"; the `routeNetwork`/`demographicPlans` TRACKED reasoning for virtual-flag lanes | CONFIRMED (the TRACKED choice is this lane's, by that reasoning). PS-r2-23 |
| M19 | Alignment in march planning | `armyTransitKernel.js`: `planMarch(digest, worldState, armyId, targetId, readiness, null, …)`; `embattlement.js :: riskToleranceFromAlignment`: "lawful/seasoned (lawfulness01 → 1) reads danger true" | CONFIRMED. HOST-r2-14 |
| M20 | Errand states (envoy arm) | `envoyErrandVocabulary.js :: ENVOY_ERRAND_STATES` = `travelling · parlaying · intercepted · held · returning · home · lost` | CONFIRMED. The envoy arm uses `returning` for `turned_back` and never `held`/`intercepted` |
| M21 | Retreat records | `armyTransitKernel.js`: the retreat is written in COLLISIONS (after the leaf stage) and "flag every RETREATING loser's deployment for withdrawal … next tick"; records derive from live deployments | PLAUSIBLE that the leaf rarely meets a retreat; REFINED note |

## 2. THE RECORD (id · sev · disposition · where · receipt)

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| PS-r2-1 | B | CURED (as RULED by RULINGS-ROUND2b) | PS5 · §3 · §4.4 · P13 · OD-PS-13 | the owner, BOARD 00:47: "to a limit of tolerance (which is increased during wartime)"; the ruling: "B's war RAISES an ally's tolerance … war at home never lowers it" |
| PS-r2-2 | B | CURED (as RULED) | header bracket · §0.1 · §0.3 · PS1 · PS2 · §2.7 · §2.8 · §4.1 · §5.1 · §6.2 · §9 · §14 SEA · §15 · P17 · P21 · P22 · OD-PS-28 | M1, M2, M7; the ruling's harbour/teleport/gate-set text |
| PS-r2-3 | B | CURED (as RULED) | §2.1 · PS9 · §4.1 · P6 · OD-PS-31 | M3, M4 |
| PS-r2-4 | B | CURED (as RULED); EXECUTED | §4.1 sweep · §2.7 · §2.8 `marches` · P23 · pin (8) | M5 |
| PS-r2-5 | M | CURED; EXECUTED | PS9 clamp · §0.3 · §4.1 · P6 | M6 |
| PS-r2-6 | M | CURED | §5.1 · §5.2 · §5.3 · §4.1 step 6 · P7 · OD-PS-29 | M8, M9 |
| PS-r2-7 | M | CURED | §4.2 step 1 · §6.1 · P5 | `ARMY_SPEED_FACTOR: 1.5`; honest statement written |
| PS-r2-8 | M | CURED (as RULED C Q2) | PS16 · §8 · §10 · §11 · §14 EC · OD-PS-9 | RULINGS-ROUND2 C Q2 |
| PS-r2-9 | M | CURED | §7.2 · PS-2 | M13 |
| PS-r2-10 | M | CURED | §2.6 · §2.8 permits · §7.2 · DM paragraph · §15 | M15; the held region is a seat id; `homeDefense` derived (M14) |
| PS-r2-11 | M | CURED | §2.3 · §7.5 · §9 · P26 · OD-PS-32 | M14; PR §10.4 (the escort is PR's detachment) |
| PS-r2-12 | M | CURED | PS1 · PS4 · §0.1 · §2.2 · §3 · §4.3 · P24 · OD-PS-33 | M11 |
| PS-r2-13 | M | CURED | PS3 · PS4 · §0.1 · §2.2 · §3 | M10 |
| PS-r2-14 | M | CURED | §9 · §4.1 · §6.4 · PS16 · P3 · P20 · OD-PS-21 | requirement 24 (owner verbatim); CHAIR-NOTES 2 "every card still exists" — cards with no hold |
| PS-r2-15 | M | CURED | PS2 · PS9 · PS11 · §4.1 · §5.1 · §14 ST · SITES CONSIDERED · OD-PS-15 | RULINGS-ROUND2b HOST-r2-3 (J385 wins); ST §4.3's fort hold |
| PS-r2-16 | M | CURED | PS1 · §2.1 · §5.5 · §14 PR · P27 | PR §10.1 (c) |
| PS-r2-17 | M | CURED | PS13 · §7.3 · §5.2 · §14 RN/PL | RN's doer row (town↔town feeling = the pair state) |
| PS-r2-18 | M | CURED | PS8 · §2.8 · §3 · §8 · L3 · P25 · OD-PS-24 · pin (6) | the archive key `holderId<moverId`; `witnessed` added to the closed row |
| PS-r2-19 | m | CURED | PS6 · §2.3 · §4.3 · §9 · §15 · §17 | `unopposed` 0 quoted src literals |
| PS-r2-20 | m | CURED | PS5 · §2.5 · §15 | M16 |
| PS-r2-21 | m | CURED | PS4 · §2.2 | M12 |
| PS-r2-22 | m | CURED | §0.1 · §5.2 · PS9 · P15 | M17 |
| PS-r2-23 | m | CURED | §0.1 · §2.8 · §2.3 · §15 · wording sweep ("gate" never bare) | M18; the host register HR:514 |
| PS-r2-24 | m | CURED | §5.2 · PS-3 · §17 #7 | the Evidence Law (deeds, never a forecast) |
| PS-r2-25 | m | CURED (PS's side) + ROUTED (PL, fold §5) | §15 · §14 PL | PL §3.4's exemption row |
| SEAMS-r2-1 | B | CURED (PS's side); CHAIR-NOTES 14 rewrite is the chair's | header bracket · PS2 · §14 SEA | `DESIGN_NAVY.md`, `navalKernel.js`, `navalEnabled: true` (the skeptic's receipts, re-read via M2) |
| SEAMS-r2-6 | M | CURED | PS1 · §2.1 · PS13 · §5.5 · §14 CH · P29 · OD-PS-34 | RULINGS-ROUND2b ("a corps keys in RN as `u:<unitKey>`"); CH §16b |
| SEAMS-r2-7 | M | CURED (feeder part named; the column's suppressibility is the chair's to confirm) | PS12 · §7.5 · §14 MN · P14 · OD-PS-19 | MN §3.3 `presenceTerms` (suppressor on the raid and road part only) |
| SEAMS-r2-8 | M | CURED | PS8 · §2.7 · §9 · §14 PR | `gateKey` defined: `road{P,B}` unordered (B's half) or `settlement(B)` |
| SEAMS-r2-10 | M | CURED | PS14 · §7.7 · §14 PL · OD-PS-18 | PL §4.6 / OD-PL-46 `requestFealtyRow`, `FEALTY_EPISODE_PREFIXES` (`army:` / `column:`) |
| SEAMS-r2-13 | M | CURED + ROUTED (RN's slot row) | PS13 · §7.1–§7.3 · §14 RN · §15 | RN §3.1 has no `passage` row; A.3's ruled-against `kept`/`broken` |
| SEAMS-r2-18 | m | CURED | doctrine bracket · SITES/PATROLS CONSIDERED | BOARD 06:32 words; RULINGS-ROUND2 §E |
| SEAMS-r2-21 | m | CURED | §2.1 · PS9 | the hold-stable key (PR's R18 pin is PR's) |
| HOST-r2-2 | B | CURED (with PS-r2-2) | as PS-r2-2 | HR:331 (`isPort`), law 16, J382 |
| HOST-r2-3 | B | CURED (PS2 confirmed and strengthened) | PS2 · OD-PS-6 · §14 ST | J385 inside H16; RULINGS-ROUND2b |
| HOST-r2-14 | M | CURED (line struck) | §11 PS-4 | M19; alignment-17a/28 cited as known substrate defects |
| HOST-r2-16 | m | CURED + ROUTED (fold OD-FC-28 ↳ (a)) | §4.4 · OD-PS-13 | H2, law 3 |
| HOST-r2-17 | m | CURED | PS8 · §9 · P17 | H5; HOST-r1-11's cure |
| HOST-r2-18 | m | CURED | PS2 · OD-PS-6 | HR:556–557 |
| R2b PR Q1 | — | CURED | §7.5 · §14 PR · §4.1 | "PR hosts the SCREEN card (PS1); PS keeps the home-defence battle" |
| R2b PR Q2 | — | CURED | PS12 · §7.5 · P14 · OD-PS-19 | "PS's enemy-column presence feeder WIDENED to the destination's own land" |
| R2b PR Q4 | — | CURED | PS9 · §2.8 · P15 | "PS9's cumulative hold cap COVERS screens" |
| R2b SEAMS-r2-2 | — | CURED | PS1 · §6.5 · §9 · §15 · P28 · OD-PS-30 | "PS's `passage_at_the_border` for envoys (stopped · escorted · turned back)"; M20 |
| R2b HOST-r2-1 | — | CURED | PS2 · §5.1 · §5.3 · P7 | M9 |
| R2 C Q1 | — | NOTED (already PS8 since round 1) | PS8 · §14 PR | — |
| R2 C Q4 | — | CURED (made explicit) | §2.8 · §7.5 · §9 | "one `armed_incursion` card PER TERRITORY" |

## 3. STOPS
None. Two BUILD-TIME STOP conditions were added in the volume (not disposition STOPs): (S-e) the envoy arm's `stopped` drops its one-week delay if the errand spine cannot shift a leg without the `held`/`intercepted` states; (S-f) the border battle's home-front write on B STOPs if `warHomeCosts.js`'s condition writer needs a new persisted field.

## 4. REFINED / design calls made by this lane (vetoable; each marked in the volume)
1. `marches` — a FOURTH persisted map (`spatialLedgers.passages.marches`): the sweep's high-water index and the clock-drift hold count (`heldBefore + (arrivalTick − plannedArrival)`), so ONE cap counts every registrant's hold without the others writing PS's ledger (§2.8, L4, OD-PS-31). A new persisted shape — declared with its lifecycle.
2. THE ONE HOLD HELPER `holdBeforeNode` owned by the transit leaf stage; two bounds (Bound 1 the termination law for all; Bound 2 the 7-week waiting cap for passage, fort and screen; `armies_meet` under Bound 1 only).
3. The welcome and the treaty road as CARDS WITH NO HOLD (the PS-r2-14 cure chosen over an owner row).
4. The waypoint-at-sea reading (OD-PS-28).
5. The enemy-column feeder on the UNSUPPRESSED side (OD-PS-19).
6. ONE border battle per crossing with the loser yielding (OD-PS-32); the `passage_barred` recall cause.
7. A RETAINED corps as a passage unit, a FREE corps through CH's gate (OD-PS-34).
8. Reuse of the landed caravan clock `supplyShipments.js :: routeWeeks` (no new weeks conversion); `routeAvoiding` returns `{ path, cost }` only so `distanceRead.js` imports no consumer.
9. Crossing kinds `land_gate · harbour · circle · open_water`; tolerance band `none · grudging · fair · wide`; RN deed kinds `passage_kept · passage_breached · passage_trespassed`.
10. `PASSAGE_BROKEN_TRUST` (DRAFT 0.04) between allies (the pair-state half of a broken reservation).

## 5. OPEN QUESTIONS FOR THE CHAIR
1. SEAMS-r2-7 (the seams skeptic named it the chair's): is a hostile column's presence SUPPRESSIBLE by forts and riders? PS ruled NO (OD-PS-19) so an army in the land always latches (P14). RULINGS-ROUND2b's menace ruling (suppression may take a raiding menace below the latch) was not applied by analogy; say if it should be.
2. OD-PS-28: sailing past a harbour is not landing (coast voyages ask nowhere; measured 62/62 waypoints on the coast fixture). Confirm or rule that every port node touched counts.
3. OD-PS-29: should every march price its chosen path (a same-seed shift)? PS prices it on its own lit arm only.
4. PS-r2-14: welcome cards with no hold satisfy requirement 24 as read here; if the chair prefers the owner-row route (no card for a contract's answer), OD-PS-21's withdrawal reverses.

## 6. ROUTED ROWS (other owners; none edited here)
- **RN:** a DEED_SOURCES slot row `passage` (owner PS, C14; doer the mover court; kinds `passage_kept · passage_breached · passage_trespassed`; witnesses the territories crossed) — SEAMS-r2-13.
- **PL:** read "transit, not a decision" in its §3.4 `armyTransitKernel.js` row (PS-r2-25); register `patrol:` / `corps:` in `FEALTY_EPISODE_PREFIXES` if harbouring is to price those units.
- **MN:** name PS's `enemyColumnPresence` row in MN §3.3's one composition sentence, on the unsuppressed side (SEAMS-r2-7).
- **ST:** strike the `crossing` gate-holder clause (toll share + effect only; HOST-r2-3); its approach-fort leaf is a TRANSIT_LEAVES registrant and holds only through `holdBeforeNode` (bypassed at Bound 2).
- **PR:** the screen holds through `holdBeforeNode` (not "departTick + 1" arithmetic); its stage asks PS's reads for a patrol on a foreign stretch and calls PS's mint for the envoy arm; R18 asserts one unit key across a screened week.
- **EC:** `SET_TRADE_STANCE` widened with `of: goods · arms` (already the fold's EC inbox row).
- **WC:** TRANSIT_LEAVES order and the one hold helper for `armies_meet` (Bound 1 only).
- **FOLD (P4):** §5 rows (`passage` vs PL's "transit"; the tolerance band; `unopposed`; crossing kinds; envoy-arm verdicts; deed kinds; unit-key prefixes); OD-FC-28 ↳ (a) gains PS's widths (HOST-r2-16); the WHERE companion's one stretch key `road{a,b}` (SEAMS-r2-8); CHAIR-NOTES 13 ("a closed pass" struck) and 14 ("THE SEA IS IN THE BOOKS") rewrites (SEAMS-r2-1, HOST-r2-1/-13); the `armies_meet` bound note.

## 7. CONFIRMED vs PLAUSIBLE
CONFIRMED: every code receipt in §1 except M4 and M21 (read at the cited symbol at `81f1cd963`), and the sweep/clamp/landing counts (EXECUTED, `sweep.out`). PLAUSIBLE: M4 (no cross-tick `armyRouteId` comparison), M21 (the leaf rarely meets a retreat), the court stage's same-tick envoy (stage order measured at PS-1's car-0), B's home-front write seam (S-f), the envoy arm's delay seam (S-e), and the PS-r2-7 week counts.
