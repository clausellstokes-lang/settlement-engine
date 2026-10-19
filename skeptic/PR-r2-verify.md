# PR-r2-verify — the refuting verifier on THE PATROLS' round-2b cures

Seat V-PR-r2 (Opus 5.5), chair a73343ed, 2026-10-18. Read whole: the README, VERIFY, the seven rulings files, the BOARD, the volume (802 lines), `skeptic/PR-r2.md`, the SEAMS-r2 and HOST-r2 rows routed to PR, and `cure/D-PR-r2.md`. Siblings were read at the cited rows; the code is master `81f1cd963`. Probes: `PR-r2-verify-probe/` (`pool-rerun.out`, byte-identical to D-PR's; `shares.out`). No other file edited; no git; no tests.

## Counts
**holds 28 · fails 2 · stop 0 · new 3 MAJOR (0 BLOCKING) + 8 minor.** Verified: the 30 BLOCKING/MAJOR ids (PR-r2-1…19; SEAMS-r2-1/2/4/7/8/9/10/11/12; HOST-r2-5/6). No REFUTED rows. The eleven RULINGS-ROUND2b PR items are applied, and the siblings carry the matching rows (PS9/PS12/§6.5, PT l.287/325, MN l.201, OD-PL-50).

## Verdict
**Holds:** the deploy draw (only `warArmyRecord.js` mints `maxStartStrength`, and reinforcement caps at it); the pool (re-executed: 7 of 24 rows bind); the per-hop fast half; `watchOf`; the stamp road (ST's slot is inside `counterforceAssessment`, stamped at `stressors.js` l.359/380); the stored placement (kernel order confirmed, `advanceCalamity` called unconditionally); PS's envoy arm; PL's summons; the window. PR-r2-18's `slowShare` is PLAUSIBLE (banditry runs at l.843, MN composes at l.2391). SEAMS-r2-9 holds on PR's side, pending OD-PR-41.

**Fails:** PR-r2-3, because the new peace fork can exceed `CAMPAIGN_SHARE`; and PR-r2-8, because only the fort's 0.20 suppression yields while its watch gate rows and +0.15 outlive the levy, against R34.

**New:** the feasibility gate is blind to the draw; MN's M53 still sums fort and riders; harassment fires by rounding.

**Carry (pre-existing, not counted):** §2.3 gives `count` riders the `count` weekly halves plus the phase-hit 4- and 13-week halves, against PR1's "exactly one PLACE".

**CONFIRMED vs PLAUSIBLE:** the fails and V1–V3 are CONFIRMED by the cited code lines or by quoting both volumes, and PR-r2-3 and V3 also by execution; the magnitudes of V1 and V3 are PLAUSIBLE.

## Fails
| id | disposition | verdict | why / receipt |
|---|---|---|---|
| PR-r2-3 | CURED | **FAILS** | §3.2 PEACE: `peaceShare = clamp(0.6 + 0.4×(0.5−appetite01) + 0.2×harsh01, 0.4, 1.0)`. CAMPAIGN: "`CAMPAIGN_SHARE` 0.75 … above the peace share". R8: "MORE than its peace share". EXECUTED (`shares.out`): wary and lawful-cruel courts (share 0.80) give campaign < peace in 12/60 rows (max 4: 4→3; max 12: 10→9). The owner's "more during wartime … less during peacetime" still inverts by default. Cure: kept ≥ peace fielded (e.g. `max(ceil(max×CAMPAIGN_SHARE), ceil(max×peaceShare))`, +1 where max allows). |
| PR-r2-8 | CURED | **FAILS** | ST §3.3, fortification row, PATROLS lit: "raider counterforce +0.15 … `monsterRaiderGate` row ×0.8 'A garrisoned keep watches the approaches.' · `criminalCorridorGate` row ×0.85 and the infiltration gate row ×0.9 'The keep's garrison keeps order on the roads.'". ST §4.1: the standing watch "neither marches nor is drawn". PR §10.5 says "The fort's birth-gate rows stand", but R34 says "ST's fort road terms are absent … the keep's road effect goes with them". Beside a held fort, felt sentence 9 is still muted (net raider counterforce +0.15 − 0.10 > 0 with the riders gone). The skeptic's cure was half applied. Route: ST + PR. |

## New findings
| id | sev | site | receipt and cure |
|---|---|---|---|
| PR-V1 | MAJOR | §6.6 "the chooser's weighing of its own army read the seed"; RULINGS-ROUND2b PR-r2-1 "the chooser's trade-off when the army is raised" | `warDeployment.js :: evaluateWarLayer`: both gates, `classifyFeasibility({ attackerCurrent: fromCap.offensive … })` at l.1052 and l.1106, and the `CONQUEST_MARGIN` prefilter run BEFORE `seedDeploymentState` at l.1127, where the draw is taken. A metropolis keeping 9 `capable` riders marches 27 latent points below what its gate judged feasible, which is more than one band (floors 78/60/42/26). Cure: draw before the target loop and feed both gates the drawn offensive. |
| PR-V2 | MAJOR | MN M53 (MN l.563) vs ST §3.3/§3.4, PR §10.5, §6.3 and R34 | MN, PATROLS lit: "Tolle's held fort suppresses 0.20 and its riders 0.15 … raid part reads 0.35". ST: "while THE PATROLS are lit … this 0.20 reads 0 and PR's subtraction alone counts", which gives 0.45. A pinned scenario encodes the double count the cures struck. Route: MN. |
| PR-V3 | MAJOR | §7.5; §3.2 (PR-r2-27's restatement) | The trigger is "`fielded` stands at `max` for more than one season in PEACE". With `fielded = ceil(max × peaceShare)` and share ≥ 0.4, max 1 is always at max, and so is max 2 for a median court. EXECUTED: 15/60 rows, including the boldest court. Every hamlet feeds `W_HARASS` into `commonsGrievance01` forever, and "a good seat … keeps the commons quiet" is false. The rounding predates r2b; the false claims are the cure's. Cure: trigger on the fork (`peaceShare > PEACE_SHARE`, held a season) or on the DM's order. |
| PR-V4 | m | R15 vs §8.2 spy row | R15 says "merchant-covered spy … (cover +0.3)", but the spy roll has no cover-identity term. ES's `covertCompetence01` is the home's criminal power (ES §3.2). |
| PR-V5 | m | §2.3 dwell vs §2.7 shape | "The newly derived word has held `CADENCE_DWELL` weeks" needs a pending candidate, which the closed `{ cadence, since, on }` lacks. |
| PR-V6 | m | §3.1, §15.2 | PR cites `fundingBandOfSettlement`, but ST §2.4 mints `settlementFundingBand`. |
| PR-V7 | m | §16.1 stamp import row | "The normalizer keeps a finite non-negative pair, else drops it" is false: `worldState.js :: normalizeDeployments` "retain[s] every deployment field", and no host edit is listed. |
| PR-V8 | m | §2.2, §8.1 | The half is chosen by the LEG's `progress01` (`namedPersonTransit.js` l.189) against a HOP's `cut01`, and then MET tests the whole road. |
| PR-V9 | m | §2.3, §6.3 | `hashInt` is not a landed helper (`hash01` and `fnv1a32` are). The sea-hop test is unnamed: `candidateRoutes` returns only `{ path, cost }`. |
| PR-V10 | m | §3.2 | AT WAR AT HOME's "enemy army believed in its land ⇒ `max`" conflicts with "while that army is out `fielded` never exceeds" the kept riders. |
| PR-V11 | m | §4.1 step 6 | The report triggers omit `riders_seen`, which is §8.3's producer. |
