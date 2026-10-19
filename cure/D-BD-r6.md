# D-BD-r6 — THE BODIES, round-6a disposition lane (Opus 5.5; chair 0a2e8bd9 continuing a73343ed; 2026-10-19 08:39–09:2x EDT by `date`)

Lane: `docs/DESIGN_FP_ARCH_BD.md` (read WHOLE first: 1,256 lines, sha256 `f85e0b46…`, the verifier's copy; kept at `D-BD-r6-probe/BD.pre-r6.md`) + this file + `cure/D-BD-r6-probe/`. Never git; never the suite; master `81f1cd963` read-only (the detached worktree of `briefs/RESEARCH-COMMON.md`). After the round: 1,358 lines, sha256 `c99311ab…` (`BD.after-r6.sha`), the diff `volume-r6.diff`, 122 `[CURED/REFINED 2026-10-19 (fp-final r6)]` brackets, 21 tables + 1 indented table, 0 cell mismatches (`tablecheck.out`).

Inputs read WHOLE: README (RESUME BLOCK 2), COMPILE-COMMON, DISPOSE, RESEARCH-COMMON, RULINGS-PL-MN, -AFTER-RESEARCH, -AFTER-COMPILE, CHAIR-NOTES (1–19), RULINGS-ROUND1 (+addendum), -ROUND2, -ROUND2b (+addendum), -ROUND3 (§A–§G), -ROUND4 (§A–§E), -ROUND5 (§A–§D), -ROUND6 (§A–§C); `cure/D-BD-r5.md`; `skeptic/BD-r5.md` (24 ids); `skeptic/BD-r5-verify.md` (6 disposition fails · 32 ROUTED-UNAPPLIED · 4 new · the residue list); `skeptic/SEAMS-r5.md` (its table, notes and ROUTES — 22 ids routed to BD); the ROUTES sections of all ten `cure/D-*-r5.md` (incl. CH's and RN's resumed passes); the BOARD's owner lines 18:33 · 18:54 · 18:55 · 19:3x · 19:4x · 22:14 · 22:20 · 22:51 · 22:52 and its 10-19 lines (verbatim).

## 1. MEASURED FIRST (the measurements that could refute the round's rulings; CONFIRMED by read or execution at `81f1cd963`)
- **m1 (A.2) the way's identity — EXECUTED `waymode.mjs` → `waymode.out`.** `routeNetworkLedger.js :: routeEdgeId` "`return \`route.${low}.${high}.${mode}\`;`"; `ROUTE_MODES` "`['land', 'water']`" pinned ("`expect(ROUTE_MODES).toEqual(['land', 'water']);`", `tests/domain/routeNetworkLedger.test.js`); no mode validation in the ledger beyond that word list. Executed: a second LAND edge on Kell–Ashford is refused (`withRouteEdges` returns the same object — the skeptic's convicting receipt, reproduced); a WAY-mode edge beside it is ADMITTED (`route.ashford.kell.land`, `route.ashford.kell.way`); `livedAdjacency` reads the way hop `["hidden","way",true]` at grade `hidden`; `travellerMayWalk('army', hop)` false, `('smuggler', hop)` true; `gradeLegMultiplier('trail' | 'way' | 'wild')` 1, `('hidden')` 2 — so the rung must never be the grade. Readers that would mis-read a way: `routeNetworkCharterBypass.js` ("`if (edge.mode === 'water') continue;`" ×2 — a way reads as land) and `routeNetworkDecay.js`'s promotion ("`if (fresh && gradeRank(from) < gradeRank('highway'))`" — a fresh hidden edge would climb to `track`): WY's skip, routed. `TRAVELLER_KINDS` pin "`expect([...TRAVELLER_KINDS]).toEqual(['army', 'caravan', 'covert_envoy', 'smuggler', 'wanderer'])`" and the ⊆ walker "`for (const kind of HIDDEN_PATH_KINDS) expect(TRAVELLER_KINDS).toContain(kind);`" (`tests/domain/routeNetworkConsumers.test.js`).
- **m2 (A.4) the guild war's channel — EXECUTED `guildwar-r6.mjs` → `guildwar-r6.out`** (16 generated towns and cities, master's pipeline, seeded; master's `pressureModel.js` and a byte-copy `pressureModel.patched.mjs` whose ONLY change is `'guild_war'` appended to `DEFENSE_ARCHETYPES` — the diff is the `.out` header). The r6 condition (`affectedSystems: ['defense_readiness', 'social_trust']`, `status: 'stable'`): security fall median 0.189 · 0.203 · 0.217 at severity 0.5 · 0.8 · 1.0 (14/16 at 0.189; 2/16 already under a DEFENSE archetype, deduped, 0.029 — `war_pressure` itself 0.086 there); without the Set entry only 0.029 · 0.043 · 0.057 (the skeptic's number, reproduced); crime 0; conflict +0.086 · +0.143 · +0.171; legitimacy, trade, economy 0; `war_pressure` 0.5: security 0.231, conflict 0.266, trade 0.129, legitimacy 0.114. Worst base + delta on every conflict-reading birth: 0.537, below `monster_raider_pressure` 0.60 · `mass_migration` 0.62 · `wartime` 0.64 · `insurgency` 0.68 · `rebellion` 0.70 · `siege` / `magical_instability` 0.72 · `occupation` 0.76 · `slave_revolt` 0.78. The defence step "`defense += 0.16;`" fires only for `DEFENSE_ARCHETYPES` ("`new Set(['war_pressure', 'regional_conflict_pressure', 'regional_protection_gap', 'rebellion'])`"); conflict = "`pressureFromScore(scores.defense_readiness)`" (+0.18 only for `CONFLICT_ARCHETYPES`); crime reads `criminal_opportunity` only (`deriveCriminalOpportunity`: faction power, black-market capture, conditions). `tests/domain/archetypeRegistryConsistency.test.js` requires every `pressureModel.js` Set member in the condition catalog (BD-8's template row).
- **m3 (BD-r5-5 · BD-Y1) the condition's life.** `reconcile.js :: isWorldAuthoredCondition` "`WORLD_CONDITION_SOURCE_PREFIXES = Object.freeze(['WORLD_PULSE', 'WORLD_STRESSOR', 'PARTY_ACTION', 'REGIONAL'])`"; `activeConditions.js :: withActiveCondition` replaces by id with the canonical form (`duration.elapsedTicks` from the partial, 0 if absent); "`one_week:   0.25,`"; "Conditions with `expiresAtTicks: null` persist indefinitely"; `SEVERITY_DRIFT_PER_TICK` moves only `worsening` (+0.04) / `easing` (−0.06); `EXPIRY_EASING_WINDOW_TICKS = 2`; ageing callers `timeProgression.js`, `activeConditions.js`.
- **m4 (BD-r5-10) HB.** `habitLedger.js :: pruneRows` drops only `NEUTRAL_I` stocks (read whole); the one writer `writeHabits(worldState, changes = {})` with `credits · opens · closes`; 134 eff (`efflines-r6.out`).
- **m5 (BD-r5-20) the seat.** `habitCurve.js :: seatAdjusted(stock, entrySeat, currentSeat)` — "An unresolvable seat identity applies NO shock"; returns `s` when `!from || !to || from === to`.
- **m6 (BD-r5-19)** the skeptic's `lapse.out` re-read: NEUTRAL_I 5000; one credit lawful +110/+315/+441/+252, balanced +172/+490/+686/+392, lawless +270/+770/+1078/+616 (glancing/telling/grave/ruinous).
- **m7 (BD-r5-9)** `generosityKernel.js :: faithProximity` — "from the settlements' primaryDeitySnapshot"; its caller "`const dG = giverS?.config?.primaryDeitySnapshot || null;`".
- **m8 (BD-r5-17 · BD-r5-24)** `institutionalCatalog.js`: "`city: { name: 'City walls and gates', required: true, …`", metropolis "`Massive walls and fortifications', required: true`"; `spatial/calamity.js :: selectStrikeTargets` "HARD BOUND (asserted): no required institution ever enters the pool"; `defenseGenerator.js` "`if (inst.hasWalls)       military += 30;`" then "`military = Math.min(100, Math.round(military * terrainMilMult));`" and an upkeep gate; `defenseLedger.js` "neutral defaults (with `present: false`)", 50 on every dimension.
- **m9 (A26)** `stressorGates.js` "`const legitimacy = governanceLedger(entry.settlement).legitimacyScore;`" (×4 gates); `governanceLedger` reads `powerStructure.publicLegitimacy`.
- **m10 (CH-3 · FOLD-1 · MN-2 · Y3)** `mercenaryMarket.js :: mercPresenceOf(settlement)` ("how much hireable force a settlement's standing institutions represent"), `mercSupplementOf` (called by `warDeployment.js`); `settlementLifecycleFirstClass.js` "`{ ...npc, dispersed: true, dispersedAtTick: tick, dispersalNote }`"; `peopleLedger.js` "`SINKS: Object.freeze(['dm_removed', 'fell', 'mortality'])`"; `calamityKernel.js :: advanceCalamity({ settlementUpdates, … })` "`@param {CalUpdate[]} args.settlementUpdates  this tick's post-apply settlement updates`".
- **m11 effective lines `efflines-r6.out`:** `routeNetworkLedger.js` 238 · `routeNetworkConsumers.js` 184 · `pressureModel.js` 258 · `habitLedger.js` 134 · `routeNetworkDecay.js` 335 · `routeNetworkCharterBypass.js` 201 · `activeConditions.js` 597 · `reconcile.js` 25 — all far from 800.
- **m12 census `census-r6.out`:** `wayRung` · `useCount` · `GUILD_WAR_LEASE` · `BODY_KEEP_POINTS` · `WORLD_PULSE_GUILD_WAR` · `recordSighting` 0 src · 0 tests · 0 master docs; `'way'` 0 quoted in src; `faceless` prose in 4 src files, never quoted.
- **m13 the siblings, read 08:5x–09:1x while the RESIDUE lane writes:** MN §3.1 already carries the generalized store (`sightings[courtId][subjectKey] = { subject: { kind, id }, name?, mightBand, tick, whereId, siteId? }`, `recordSighting(worldState, { courtId, subject: { kind: 'menace' | 'body', id }, … })`); PR r6 strikes its `patrol` token; CH r6 carries A.1 at §12.4; RN l.129 "never a `ledBy` rider"; RN's leak key `leak:body:<bodyId>:<courtId>:<sinceTick>`; ST l.464 "a NAMELESS body's too (BD23's one exception)"; PL §4.8 (4)–(5) (PL r6 already bracketed B.5); CH's `heldOffice` · `securityOfficeOf` · the attempt arm `withstood · bribed` · `warden_attempted` · `tieKind` (`retainer · employed · sponsorship`); the fold §3.1.16 ↳ r5 "ONE TERM PER GANG" and its WC inbox row (10).

## 2. THE RECORD (id · sev · disposition · where · receipt) — every input id, 96 of 96; the volume's §20.4 carries the same rows grouped
| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| R6 A.1 | BLOCKING | CURED | answer · BD27 · §9.10 · §12 · §15.1 · S29 · OD-BD-40 · §18 #23 | BOARD 18:54 verbatim |
| R6 A.2 | BLOCKING | CURED (EXECUTED) | §0.1 · BD19 · BD20 · §2.5 · §2.6 · §5.2 · §13 · BD-5 · §15.2 · S47 · S55 · ⭐ OD-BD-56 | m1 |
| R6 A.3 | MAJOR | CURED | BD22 · §8.5 · §13 · B2 · OD-BD-2 | RULINGS-ROUND6 A.3 |
| R6 A.4 | MAJOR | CURED (EXECUTED) | §6.8 (d) · §22 A7 · BD-8 · S45 · OD-BD-52/57 | m2 |
| R6 B.1 | MAJOR | CURED | §8.2 · §22 A2 · S53 | `skeptic/SEAMS-r5-probe/flock-presence.out` |
| R6 B.2 | MAJOR | CURED | BD12 · §2.4 · §9.3 · §15.2 · S56 · OD-BD-58 | m13 (MN's store) |
| BD-r5-1 | BLOCKING | CURED (= A.1) | as A.1 | the owner's word |
| BD-r5-2 | BLOCKING | CURED (= A.2; the skeptic's option (b) as ruled) | as A.2 | m1 |
| BD-r5-3 | MAJOR | CURED (= A.4: `DEFENSE_ARCHETYPES`, no crime archetype) | §6.8 (d) | m2 |
| BD-r5-4 | MAJOR | CURED (A7 · A2 re-written with the measured channels; BD-2 pins five kinds) | §22 A2 · A7 · BD-2 | m2; `warpressure.out` |
| BD-r5-5 | MAJOR | CURED (world provenance, lease, weekly re-assert, §15.2 row) | §6.8 (d) · §15.2 · S45 | m3 |
| BD-r5-6 | MAJOR | CURED (both arrays, pin re-recorded) | §5.2 (a) · BD19 · BD-5 · S47 · OD-BD-49 | m1 |
| BD-r5-7 | MAJOR | CURED (by A.2: the holder's knowledge read; `patrol` struck) | §5.2 (a) · §9.11 | RULINGS-ROUND6 A.2 |
| BD-r5-8 | MAJOR | CURED (hostile per court; one definition; S54) | BD14 · §4.2 · §6.1 · §6.6 · §9.2 | RULINGS-ROUND5 B.2's words |
| BD-r5-9 | MAJOR | CURED (the two towns' patrons; zero for a persecutor) | §10.2 (a) | m7 |
| BD-r5-10 | MAJOR | CURED — HB: BD-10's own `ends` host edit; ST: the RESIDUE lane (B.7); WC half REFUTED (carrier exists) | BD24 · §4.4 · BD-10 · §9.9 · §0.2 · S61 | m4; fold l.314 · l.374 |
| BD-r5-11 | m | CURED | §2.5 `bodyRadius` | §5.4 |
| BD-r5-12 | m | CURED | §15 death · §4.2 `flee` | ST §6.1 step 1; A.2 |
| BD-r5-13 | m | CURED | S32 | B.18 |
| BD-r5-14 | m | CURED | §10.4 | RU-5 |
| BD-r5-15 | m | CURED | §19.0 INT (4) | A.4 |
| BD-r5-16 | m | CURED | §8.3 · §22 A1 | B.2 |
| BD-r5-17 | m | CURED (town-and-below by strike; the generator's arithmetic) | BD14 | m8 |
| BD-r5-18 | m | CURED (= SEAMS-r5-7) | BD14 · §2.5 | ST §7's walker |
| BD-r5-19 | m | CURED (lapse relative to one credit) | §2.3 · §15 · OD-BD-18 · S57 | m6 |
| BD-r5-20 | m | CURED (the derived entry seat) | §4.4 · BD24 · S58 | m5 |
| BD-r5-21 | m | CURED | §2.3 · §9.11 | CH l.223 |
| BD-r5-22 | m | CURED | §9.11 | RN l.129 |
| BD-r5-23 | m | CURED (narrowed to the owner's word) | §2.3 | BOARD 22:20 |
| BD-r5-24 | m | CURED (the neutral 50 stated) | BD14 | m8 |
| V B.4 · BD-r4-3 | MAJOR | CURED (= A.2) | as A.2 | m1 |
| V B.16 · BD-X2 | MAJOR | CURED (= A.3) | as A.3 | — |
| V B.18 · BD-r4-6 | MAJOR | CURED (= A.4) | as A.4 | m2 |
| V A.5 (BD half) | MAJOR | CURED (= B.2) | §2.4 | m13 |
| V B.2 · BD-r4-1 partial | m | CURED (= BD-r5-8) | BD14 · §4.2 · §6.6 | B.2's words |
| V BD-r4-9 partial | m | CURED (a row's `confront` = refusal and warning) | §4.2 · S13 | BD3 |
| CH-1 | routed | CURED | §2.3 · §9.11 | CH l.223 |
| CH-2 | routed | CURED | §9.5 · §12 | CH l.561 · l.702 |
| CH-3 | routed | CURED | §6.8 (b) | m10 |
| CH-4 | routed | CURED | §10.4 | CH l.297 |
| CH-5 | routed | CURED | §2.2 · §6.10 | CH §7 |
| FOLD-1 | routed | CURED | §2.6 | m10 |
| FOLD-2 | routed | CURED | BD13 · §9.10 · §12 | §12's own rule |
| MN-1 | routed | CURED (staging); its `a␟b` half REFUTED by RULINGS-ROUND3 A.14, routed back to MN | §11 | MN l.146; A.14 |
| MN-2 | routed | CURED | §9.8 (d) · §2.7 | m10; MN §6 |
| PL-1 | routed | CURED | §7.1 · §10.2 (b′) · §10.5 · §13 · §19.0 PL | PL l.268–269 |
| PR-1 | routed | CURED | §2.3 | — |
| PR-2 | routed | CURED | §0.1 · §8.5 · §9.11 · §13 | PR l.78 |
| PR-3 | routed | CURED | §9.3 · §19 PR | — |
| PR-4 | routed | CURED to the chair's contrary ruling (A.2: `patrol` struck) | §5.2 (a) | A.2 |
| PR-5 | routed | CURED | §2.3 | PR l.296 |
| PR-6 | routed | CURED (= BD-r5-6) | §5.2 (a) | m1 |
| PS-1 | routed | CURED (PS the widening's one owner) | §5.2 (a) | PS-4 |
| PS-2 | routed | CURED (= A.2) | BD20 · §5.2 | m1 |
| PS-3 | routed | CURED (bypass hops, land crossed, gate never) | §5.2 (ii) | — |
| PS-4 | routed | CURED (a `trail` rung keeps ×2 and the franchise: grade `hidden`) | BD20 · S47 | m1 |
| PT-1 | routed | CURED | §9.9 | PT §3.1 |
| RN-1a | routed (MAJOR-weight) | CURED (REFINED: the act receipt) | §7.6 · §7.2 · S59 | RN l.248 path (b) |
| RN-1b | routed | CURED (ruled by delegation: `fought`) | §7.2 · §9.11 · S60 · OD-BD-60 | B.5 |
| RN-1c | routed | CURED (DRAFT value rows) | §7.2 table | CH l.230's columns |
| RN (d) | routed | CURED | §7.1 · §10.4 · §19 | RN l.208 |
| ST-1 | routed | CURED (= B.2) | §2.4 | m13 |
| ST-2 | routed | CURED (BD23's one exception) | BD23 · §2.4 · S56 | ST l.464 |
| ST-3 | routed | CURED | §2.1 · §2.4 | A.5 |
| ST-4 | routed | CURED (= BD-r5-12) | §15 | ST §6.1 step 1 |
| ST-5 | routed | CURED | §7.1 · §9.4 | RULINGS-ROUND5 A.1 |
| ST-6 | routed (MAJOR-weight) | CURED (= B.1) | §8.2 | flock-presence.out |
| ST-7 | routed | CURED | §9.4 | RULINGS-ROUND5 A.3 |
| ST-8 | routed | CURED (= SEAMS-r5-7) | BD14 · §2.5 · §9.2 | ST §7 walker |
| BD-Y1 | MAJOR (PL) | CURED (= BD-r5-5) | §6.8 (d) · §15.2 | m3 |
| BD-Y2 | m | CURED (`trail:<a\|c>~<b>`; junction to junction) | §5.2 (ii) · S48 | — |
| BD-Y3 | m (PL) | CURED | §2.7 | m10 |
| BD-Y4 | m (PL) | CURED (beasts exempt) | BD11 · §5.2 | §6.7 |
| V residues | m | CURED (by stance ×3 · `exposed?` · OD-BD-44 · §19 RN (1) · §19 ST (4) · `ledBy` · A26) | §2.5 · §5 · §6.8 (e) · §10.4 · §17 · §19 · §9.11 · §10.3 | m9 for A26 |
| SEAMS-r5-1 | MAJOR | CURED (= A.2) | BD20 · §5.2 | m1 |
| SEAMS-r5-2 | MAJOR | CURED (= A.2 + BD-r5-6/7; PS one owner) | §5.2 (a) | m1 |
| SEAMS-r5-3 | MAJOR | CURED (= B.2) | §2.4 | m13 |
| SEAMS-r5-4 | MAJOR | CURED (= B.1) | §8.2 | flock-presence.out |
| SEAMS-r5-5 | MAJOR | CURED | §0.1 · §8.5 · §9.11 · §13 · §22 A24 | PR l.78; `treasury.js` |
| SEAMS-r5-7 | MAJOR | CURED | BD14 · §2.5 · §9.2 | ST §7 walker |
| SEAMS-r5-8 | MAJOR | CURED | §7.1 · §9.4 | RULINGS-ROUND5 A.1 |
| SEAMS-r5-9 | MAJOR | CURED | §10.2 (b′) · §13 · §19.0 PL | PL l.268 |
| SEAMS-r5-10 | MAJOR | CURED (= BD-r5-10) | BD-10 | m4 |
| SEAMS-r5-11 | m | CURED (= CH-1) | §2.3 · §9.11 | CH l.223 |
| SEAMS-r5-12 | m | CURED (= CH-2) | §9.5 | CH l.561 |
| SEAMS-r5-13 | m | CURED (= CH-5) | §2.2 · §6.10 | CH §7 |
| SEAMS-r5-14 | m | CURED | §7.1 · §10.4 · §19 | RN l.208 |
| SEAMS-r5-15 | m | CURED (= MN-1) | §11 | MN l.146 |
| SEAMS-r5-16 | m | CURED (= MN-2) | §9.8 (d) | m10 |
| SEAMS-r5-17 | m | CURED (= FOLD-2) | BD13 · §9.10 · §12 | — |
| SEAMS-r5-18 | m | CURED (= FOLD-1) | §2.6 | m10 |
| SEAMS-r5-19 | m | CURED (= PT-1) | §9.9 | PT §3.1 |
| SEAMS-r5-20 | m | CURED (= RN-1a/b/c) | §7.2 · §7.6 | — |
| SEAMS-r5-21 | m | CURED (= ST-4) | §15 | — |
| SEAMS-r5-22 | m | CURED (= ST-7) | §9.4 | — |
| SEAMS-r5-24 | m | CURED (= PS-3 · BD-Y2) | §5.2 (ii) | — |
Notes (not ids): SEAMS-r5 note (1) `warden_attempted` matching `war` in two landed regexes — FOLD's §5 (routed); note (2) `weeksMult` vs PS's `legMult` — NOTED, PS l.198 cites `weeksMult`, a rename would move a sibling; note (3) — cured with PR-3 and SEAMS-r5-14.

## 3. STOPs
NONE. ⚠ For the chair's eye, not a STOP (OD-BD-57, visible in the volume): A.4 removes the condition's crime term. The owner's 18:43 words are "a thieves guilds war which drastically increases crime and lowers internal security". The volume carries "increases crime" through the war itself: two criminal powers in the quarter (`criminalPowerOf` composes the gang above the guild's floor) and the bodies that the lowered watch lets loose. It never carries it as a raised crime PRESSURE: measured, crime moves 0. The alternative is the crime archetype's +0.12 step, which crosses `criminal_corridor` (0.56) and `infiltration` (0.58) from a city's ordinary 0.47 base and so births the two records B.18 struck. That is the chair's reading of the owner's word, applied as ruled, and it is the owner's to correct.

## 4. REFINED (beyond the inputs; each bracketed in the volume, vetoable)
1. THE QUARTER'S DUE: the producer of `paid_quarter · fed_poor · robbed_quarter` is a weekly ACT RECEIPT, not a hearing or a new choice (§7.6; OD-BD-59).
2. BD's DRAFT value rows for its nine `body_act` kinds, using CH §2.2b's columns; RN owns the values (§7.2).
3. The entry seat is DERIVED from `leads.sinceTick` against the row's stamp, with a `faceless:<bodyId>` seat token, so a FIRST leader halves the lessons. A leader lost with no successor halves nothing (§4.4).
4. The knowledge lapse is relative to one `glancing` credit under the town's law word. Each source credits at its own magnitude (§2.3).
5. The bypass is keyed by the node it skirts and runs junction to junction (`junction:<a|b>@<b>`). For a unit's hops it reads as two primary hops plus b's land (§5.2 (ii)).
6. Beast packs are exempt from the ways' capacity (§5.2).
7. A nameless body's SIGHTINGS are BD23's one exception (ST's word, made BD's).
8. The guild war's condition has a `stable` status, a twelve-week lease, world provenance and a weekly re-assertion. The way-mode edge has grade `hidden` (so the price and franchise are master's at every rung), and a candidate's first crossing mints it at `wild`.
9. A creed ROW's `confront` is a refusal and a warning (an informer sighting); only a moving flock seeks the fight.
10. A led hunt's `beaten` close is the body's `fought` deed (OD-BD-60).
11. An un-generated settlement reads the read-point's neutral 50 (BD14). `BODY_KEEP_POINTS` 30 puts the keep on the site scale.
12. Under A.1, `refuse` and `abandon` only delay: the clock's end still pays, and `abandon` still marks the landed grievance.

## 5. ROUTED (the other lanes' halves; the volume's §19.0c carries them verbatim)
- **PS:** `hiddenWayFor` keys mode `way`. A bypass reads as hops `a|b` + `b|c`, crossing b's land and never b's gate. The unit widening `travellerMayWalk(kind, hop, { might })` is PS's one declared change. §5.5 l.328 becomes "never CROSSES a border by a hidden way; on its holder's known way it passes by the holder's knowledge read".
- **MN:** add the informer and the at-hand witness to `recordSighting`'s caller list. Re-point the verb-dial key `a␟b` to the landed `a|b` (A.14), or have the chair rule an exception.
- **RN:** BD's DRAFT value rows; `fought` widened to a led hunt's `beaten` close (target the court); the quarter acts' receipt `quarter:<bodyId>:<tick>` (path (b)).
- **WY / route lifecycle (A.2):** own `ROUTE_MODES` + `way` (pin re-recorded), `wayRung`, `useCount`, and the minting of an edge at a candidate's first crossing. `routeNetworkDecay.js` and `routeNetworkCharterBypass.js` must SKIP mode `way`.
- **ST · PR · CH:** nothing new beyond what their r6 texts already carry (ST's bounty input row is the RESIDUE lane's, B.7).
- **INT:** (4) the guild war's grievance reads the town's order, never the corridor or infiltration stressors.
- **FOLD (P4):** register mode `way` · `wayRung` · `useCount` (⭐ OD-BD-56 in §7), MN's `sightings`/`recordSighting`, `guild_war` ∈ `DEFENSE_ARCHETYPES`, `GUILD_WAR_LEASE`, `BODY_KEEP_POINTS`, `junction:<a|b>@<b>`, and `body` in BOTH arrays with `patrol` struck (l.855). Also the `ransom` row per A.1, note (1)'s regex hazard, and HB's `ends` bracket slot.
- **HOST-asks:** ENC-HL-12's franchise row (`body` + the landed three); a junction is a point on ONE primary hop, and the map's junction ids replace `junction:<a|b>@<b>`.

## 6. OPEN QUESTIONS FOR THE CHAIR
1. ⭐ OD-BD-56: the route MODE `way` and its two fields are a persisted-shape change on the landed route ledger, so the decision is the owner's (A.2 says so). Recommended yes.
2. OD-BD-57: the crime reading under A.4 (§3 above).
3. OD-BD-60: is `beaten` the body's `fought` deed (ruled here by delegation), or no deed?
4. MN's `a␟b` against A.14: does the verb dial get an exception?

## 7. CONFIRMED vs PLAUSIBLE
**CONFIRMED by execution:**
- the way-mode edge's admission and its hidden reading on master (`waymode.out`);
- the guild war's measured channel, crime, conflict and birth margins (`guildwar-r6.out`);
- the table integrity (`tablecheck.out`), the census (`census-r6.out`) and the effective lines (`efflines-r6.out`).

**CONFIRMED by reading at `81f1cd963`:** m1–m10.

**CONFIRMED by reading the siblings' current text:** m13.

**PLAUSIBLE, never upgraded:**
- that `timeProgression.js` ages a pulse-written condition every week (its caller list is read; its loop is not traced);
- every DRAFT number (`GUILD_WAR_LEASE`, `BODY_KEEP_POINTS`, the value rows, the quarter steps, the lapse fraction);
- the cure-shape choices recorded above as REFINED.

**Also PLAUSIBLE:** that WY's lifecycle can skip mode `way` in the decay and the charter bypass with no kernel line. BD-5's car-0 carries this as a STOP condition.
