from edit_lib import apply, F
pairs = [
(r"""| `settlementFundingBand` · `garrisonBandOf` · `believedDenOf` · `mapSiteRef` · `wantSince` · `keptSecret` · `kept_secret` · `made_known` · `rekinded` · `SITE_KIND` · `KEEP_CLOCK_WEEKS_MAX` |""",
r"""| `settlementFundingBand` · `garrisonBandOf` · `believedDenOf` · `mapSiteRef` · `wantSince` · `keptSecret` · `kept_secret` · `made_known` · `rekinded` · `SITE_KIND` · `KEEP_CLOCK_WEEKS_MAX` · `siteTakenContest` · `reclaimScore` |"""),
]
apply(pairs, 'b11a')
s = open(F, encoding='utf-8').read()
assert '## §15 THE CURE RECORD' not in s
rec = r"""

---

## §15 THE CURE RECORD

### Round r2 (2026-10-18, lane D-ST-r2; inputs `skeptic/ST-r2.md` · the ST routes of `skeptic/SEAMS-r2.md` and `skeptic/HOST-r2.md` · `briefs/RULINGS-ROUND2b.md`'s items for THE SITES; log `settlement-engine-kits/fp-final-a73343ed-2026-10-17/cure/D-ST-r2.md`, probes `cure/D-ST-r2-probe/`)

| Id | Sev | Disposition | Where | Receipt |
|---|---|---|---|---|
| ST-r2-1 | B | CURED (RULINGS-ROUND2b) | ST6 · §0 treasury row · §2.4 · §6.1 step 3 · OD-ST-5 · STOP-ST-1 RULED · S3, S23 | the DM's band a CEILING (`min`); the owner's "abandonded due to lower prosperity" fires everywhere; coin = W-COIN rows on ONE leaf-first car (the kernel's call passes no worldState — quoted) |
| ST-r2-2 | B | CURED (RULINGS-ROUND2b HOST-r2-3) | §2.2 · §3.3 crossing · §7.4 PS row | J385: the territory's holder keeps the gate (PS2 `gateKeeperOf`); a crossing's holder a toll share (EC-6 slot) and the crossing's effect only |
| ST-r2-3 | M | CURED | §0 sea row · §2.2 · §3.3 · §3.5 · §5 · ST-3 · §7.4 LG | landed carriers read: `isPort`, `STORM_SEASON_COST`, `seaRoads.js` S1–S3 (`EMBATTLED_THRESHOLD` 0.35 on the LEVEL; `seaRoadsEnabled` absent from every preset), `navalLayer.js` (`activeBlockadeTargets`; one navy per port); "naval station" struck; no port eligibility; no drastic term; not C7 |
| ST-r2-4 | M | CURED (RULINGS-ROUND2b) — executed | ST10 · §0 · §4.1 · S1, S19 | `siegeMonotone.out` (1): the landed spatial core RAISES pFall with a keep (0.0759 → 0.0937); the cure (a longer clock; the keep out of `relief01`) — 2,000 grid cells, 0 rises; the aspatial core monotone |
| ST-r2-5 | M | CURED — executed | ST11 · §4.2 · OD-ST-13 · S2, S20 | only `falls && roll > 0` (the landed no-roll sentinel; pin, ceiling and capitulation each `roll: 0`, executed (3)); band rewritten `narrow_fail` before attrition reads it |
| ST-r2-6 | M | CURED | §4.1 holder rule · §2.4 · S23 | `buildCapacityLookup(snapshot, deployments)` — the rule reads the landed support types, PL's suspension and the holder's own deployment; car-0 pin with a named fallback |
| ST-r2-7 | M | CURED (RULINGS-ROUND2b) | §3.2 · OD-ST-8 · S4, S6 | `gateResult` multiplies rows; `scaleAndLatch.out`: ×0.8 → ×0.97 unfunded (was ×0.12); ×1.3 → ×1.18 capable (was ×0.78) |
| ST-r2-8 | M | CURED (the pin half refuted by RULINGS-ROUND2b: MN's M50 wins) | ST8 · §0 · §3.4 · OD-ST-10 · S22 | MN owns `presenceTerms` (MN §3.3, §4.2); ST registers a feeder and a suppressor; parts defined; PS12's feeder registered |
| ST-r2-9 | M | CURED (stated as tippers and sustainers) | ST8 · §3.3 harbour · S4 | `stepEmbattlement` latches calm only `if (rawT > T.ENTER_THRESHOLD)`; only the untied fort latches alone (`scaleAndLatch.out`); felt lines say what the gate arms did |
| ST-r2-10 | M | CURED | §4.3 · §8 `site_siege` · OD-ST-14 · S21 | PS9's `PASSAGE_HOLD_CAP_WEEKS` spent by the approach fort; ceiling by attacker named |
| ST-r2-11 | M | CURED | ST17 · §2.4 · §3.3 · §3.5 · §7.1 | `siteWitnesses` is an INPUT of PR's `witnessedCrossing` (PR §6.5 already reads it); no `partyIds` write; IN's plane a slot |
| ST-r2-12 | M | CURED | §0 · §3.3 hospice and shrine · §3.4 · §3.5 · §7.1 | `careCapacity`'s product stays `< CARE_MAX_RELIEF` 0.6; the front DORMANT off the marker; the stressor arm on `disease_outbreak`'s counterforce |
| ST-r2-13 | M | CURED | ST9 · §0 · §3.3 · §7.1 · OD-ST-11 | `buildThreatByCid`: "all reads are membership tests" — `raidHot` membership |
| ST-r2-14 | M | ⛔ STOP (the chair's L-ST item 20(b)) | ST18 · §2.1 · §7.3 · §7.4 SP · §8 · OD-ST-27 | `POSTURE_ACTOR_KINDS` is the closed set of posture-bearing deciders; proposed: `site` a WHERE kind and a subject, never an actor |
| ST-r2-15 | M | CURED | §2.4 `believedDenOf` · §6.1 step 6 · §6.6 · OD-ST-35 | Law One; RULINGS-ROUND1 RN-r1-2; the forks and `den_unanswered` read belief (truth only omniscient) |
| ST-r2-16 | M | CURED | §2.1 `wantSince` · ST13 · §6.1 step 3 · §11 · OD-ST-34 | the dwell declared; "acted" = a dated act |
| ST-r2-17 | M | CURED | §6.1 steps 4, 6 · §6.4 · §8 · S12 · OD-ST-25 | one hearing per arrival; a reclaim's clearing at the next week (requirement 24(b): the next advance resolves the docket first) |
| ST-r2-18 | M | CURED | §6.4 `reclaimScore` · §8 · OD-ST-25 | requirement 24(b)'s tilt on a randomness-free decider's score |
| ST-r2-19 | M | CURED | §7.2 · §6.1 · §6.3 callers · ST2 · S8 · OD-ST-38 | ONE PT door calls ST's writer; CHAIR-NOTES 3; PT's §4 bracket ROUTED |
| ST-r2-20 | M | CURED | §14 lines 1, 3 | deeds only; SMN-22's precedent |
| ST-r2-21 | m | CURED | §0 · §4.4 | `STRESSOR_COUNTERFORCES.criminal_corridor` read |
| ST-r2-22 | m | CURED | §0 · S1 | `PROSPERITY_RANK` `Prosperous: 0.8` → `lavish`; six labels |
| ST-r2-23 | m | CURED | §2.3 · §6.2 | `made_known · kept_secret · rekinded` in `SITE_EVENTS`; a quality set's events named |
| ST-r2-24 | m | CURED | §4.1 · §7.1 | the deploy-time `classifyFeasibility` reads; the chooser's blindness stated |
| ST-r2-25 | m | CURED | §7.1 | `danger-consumers.out` (24 files) |
| ST-r2-26 | m | CURED | ST7 | empty vs held |
| ST-r2-27 | m | CURED | §9 · §11 B · OD-ST-33 | one dark path (withdraw); the fold §7 shape row ROUTED |
| ST-r2-28 | m | CURED | §3.3 · §3.4 · §7.4 PR · OD-ST-39 | with PR lit the fort's suppression IS its riders |
| ST-r2-29 | m | CURED | §8 `site_siege` | A.7's `relief_answer`; why a menace may take a keep and never a town by default |
| ST-r2-30 | m | CURED | §6.2 `PLACE_SITE` · §2.2 | persons and bands by `SITE_HOLDER`; "camp" to Q1 |
| ST-r2-31 | m | CURED | §8 · ST-2 EDITOR | one key per kind |
| ST-r2-32 | m | CURED | §3.3 tower · §2.1 | the landed gate RAISES surge births for arcane practice; the graph proxy stated (PLAUSIBLE) |
| SEAMS-r2-7 | M | CURED (ST's side; the column's class is MN's sentence and the chair's) | §3.4 · OD-ST-10 | ST cites MN's composer; three feeders registered; ST recommends a column is never suppressed (P14 holds) |
| SEAMS-r2-9 | M | CURED (ST's side; an open question to the chair) | ST10 · §4.1 · §3.3 · §7.4 PR · OD-ST-39 | one body of men: the keep is defensibility; the envelope's one composition; PR §2.2's quoted line now ST's own |
| SEAMS-r2-12 | M | CURED (RULINGS-ROUND2b ST-r2-1) | ST6 · §2.4 · §0 · §7.4 PR · OD-ST-5 | `settlementFundingBand` exported; coin separated from band |
| SEAMS-r2-18 | m | CURED | the doctrines bracket under the owner's words · §7.4's patrols-considered paragraph | the five 10-18 doctrines stated for ST |
| HOST-r2-3 | B | CURED (RULINGS-ROUND2b) | as ST-r2-2 | J385 inside accepted H16 (HR:898, HR:82); the canon's crossings are H5/H22's slot |
| HOST-r2-7 | M | CURED | ST2 · ST20 · §2.1 · §6.2 · §7.2 · §10 ST-4 · §11 veil · OD-ST-37 | DR-V14-1 (HR:644), H13 `PolitySite` (HR:534), H9 (HR:68); ENC-MS-01 (HR:689); the placement (HR:646); `WORLD_SNAPSHOT_HARD_DENY` holds `'spatialLedgers'` |
| HOST-r2-8 | M | CURED | §2.1 `mapSiteRef` · §6.2 `SITE_KIND` · §6.5 · §11 join | ENC-MS-06 (HR:694); one join key; re-kinding keeps the id; the re-emission ask ROUTED to the fold's map INBOX |
| HOST-r2-9 | M | CURED (ST's side) | §2.4 `garrisonBandOf` · ST1 · §7.2 | HR:529, HR:534; the seat's force band a slot — the fold §3.1.29 narrowing ROUTED |
| HOST-r2-10 | M | CURED (ST's side) | §6.2 · ST-4 · OD-ST-37 | H28 (HR:107): its adoption command IS ST's adopt arm; the fold §6 split ROUTED |
| HOST-r2-11 | M | ⛔ STOP (the chair's L-ST item 11(b)) | §6.3 TRADED | HR:491, HR:499, HR:900 — no host act moves land by conveyance |
| HOST-r2-19 | m | CURED | §2.1 · §2.3 · §2.5 · §6.2 · §11 | the court veil `keptSecret` / `made_known`; `concealed` refused (landed audience word) |
| HOST-r2-20 | m | CURED | §2.2 · §3.3 | `distanceRead.js :: isPort` |
| ROUND2b — MN's routed note | — | CURED | ST8 · §3.4 | L-ST item 4's "never below the latch's floor" struck |
| ROUND2b — HOST-r2-1 | — | NOTED (ST had no "closed pass") | §3.3 crossing | the crossing's discount after `seasonalPathCost`; `SLOW_NOT_SEVER_MAX` cited |
| ROUND2b — PR fills ST's slot | — | CURED | §3.3 caps · §0 | one slot per type, one clamp, a closed registration list |
| ROUND2 D Q1–Q4 · E | — | CURED / NOTED | §2.2 · ST-4 · §13 STOP rows · §7.4 · the doctrines bracket | Q1 and Q2 applied; Q3 (the keep's 18 points) unchanged, DRAFT; Q4 the fold's; E: sites considered is ST's own §7, patrols considered added, plague-R7 cited at the hospice |
"""
open(F, 'a', encoding='utf-8').write(rec)
print('§15 appended')
