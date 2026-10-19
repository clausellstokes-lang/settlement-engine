# PR-r3-verify — the refuting verifier on THE PATROLS' round-3a cures

Seat V-PR-r3 (Opus 5.5), chair 0a2e8bd9 continuing a73343ed, 2026-10-18 18:42 EDT. I read the following whole: the README (RESUME BLOCK 2), VERIFY, SKEPTIC, DISPOSE, RESEARCH-COMMON, every rulings file through RULINGS-ROUND3 §A–§F, the BOARD, `skeptic/PR-r2-verify.md`, `cure/D-PR-r3.md` and its probe, and the volume (860 lines, mtime 17:42). I also read the ROUTES of all nine `cure/D-*-r3.md` files (§E.4). Siblings were read at the cited rows (ST · MN · PS · PL · CH · PT; SEAMS-r3 for overlap). The code is master `81f1cd963`, read-only. My probe is `PR-r3-verify-probe/verify.mjs` → `verify.out`. No other file was edited, no git was run, and no tests were run.

## Counts
**holds 38 · fails 1 · stop 0 · new 1 MAJOR (0 BLOCKING) + 5 minor · routedUnapplied 4 rows (3 distinct edits).**

## Verdict
**Holds (38 of 39).** These dispositions stand:
- PR-r2-3: `kept ≥ peace` on a continuous grid, 0 of 793 below (`verify.out` (1)).
- PR-r2-8 and PR-V2 (A.1): ST l.232/§3.4 and MN M53 now say what PR says.
- PR-V1: `fromCap` l.1042 precedes the coalition gate l.1052, the prefilter l.1104, the hard gate l.1106 and the seed l.1127. `HOSTILE_CONFIDENCE` sits before `fromCap` at l.1041.
- PR-V3.
- The carry: 0 weeks over riders and 0 off-period halves over n 0..12 × H 1..12 (`verify.out` (3)).
- A.2: matches PS §4.1 and FREEZE at PS l.109/250.
- PR-V4 through PR-V11 and A.3–A.9, A.13–A.15 (form).
- Every NOTED row.

**§E.2 receipt:** this check passes, with 0 hits for "polity resolutions" or for "a sent … adds nothing".

**Fails.** A.10 fails on the §E.1 receipt. The four ROUTED-UNAPPLIED rows below also fail.

**New.** PR-W1 (MAJOR): the re-authored harassment trigger has no carrier for "held one season".

**Not raised.** I did not raise THE BANNER (§F), which is round 4's input.

**CONFIRMED vs PLAUSIBLE:**
- CONFIRMED by quoting both texts: the fail and every ROUTED-UNAPPLIED row.
- CONFIRMED by reading §2.7, `commonsVoiceKernel.js :: commonsGrievance01` (a memoryless blend) and `courtRiskAppetiteOf` (no since-tick): PR-W1's missing carrier.
- CONFIRMED by execution (`verify.out`): the holds' arithmetic and PR-W3.
- PLAUSIBLE: that no landed field could stand in for PR-W1's carrier.

## Fails
| id | disposition | verdict | receipt |
|---|---|---|---|
| A.10 (§E.1) | CURED | **FAILS** | PR l.578: "a keep on a PR card speaks ST's readiness words (`full · manned · sparse · skeleton · empty`, RULINGS-ROUND3 A.10)". §E.1 says the words are `at_strength · manned · sparse · skeleton · hollow` (ST l.169 `SITE_READINESS`), and "a text that still carries `full · … · empty` … is a FAIL". (= SEAMS-r3-2) |
| ROUTED-UNAPPLIED (PL→PR) | — | **FAILS** | D-PL-r3 §5: "`crownReachAt(…).share01 > 0` … is redundant … 'shuts out a sub-vassal under a frayed link' cannot fire". PL l.121 gives the sub-vassal share as `LIEGE_SHARE × PARAMOUNT_REACH[hold(root, observer=root)]`, which is ≥ 0.10×0.2 once the crown's own read is `staunch`+. PL itself struck it (PL l.781). PR still carries it at PR11 l.119, §10.3 l.409, R21 l.647 and OD-PR-26 l.696. |
| ROUTED-UNAPPLIED (CH→PR) | — | **FAILS** | D-CH-r3 §5: "the warden's call names the seam word, `paragonLean(worldState, settlementId, 'wildland', 'patrol_rider_quality')`, with d 0.10". PR l.420 has `paragonLean(worldState, settlementId, 'wildland', side)` with "±0.05 / ±0.10". CH l.207's 4th parameter is `seam ∈ PARAGON_LEAN_SEAMS`. (= SEAMS-r3-9) |
| ROUTED-UNAPPLIED (FOLD→PR) | — | **FAILS** | D-FOLD-r3 §5: "PR (§15.2, ~l.578) … → `at_strength · manned · sparse · skeleton · hollow`". The text is unchanged. This is the same edit as A.10. |
| ROUTED-UNAPPLIED (ST→PR) | — | **FAILS (in part)** | D-ST-r3 §5: "PR §15.2 (PR:578) … readiness words → `at_strength …`". This half is unapplied (the same edit). Its `settlementFundingBand` half and its A.1 half (R34 / §10.5 / sentence 9) are applied. |
| PS→PR route | — | holds | The volume carries it at l.121, 374, 559, 689 and 748. |

## New findings
| id | sev | site | receipt and cure |
|---|---|---|---|
| PR-W1 | MAJOR | §7.5 l.324, OD-PR-33, R35 | **The problem:** the trigger reads "the court's own PEACE-POSTURE fork has held `peaceShare > PEACE_SHARE` for one season". Nothing persists when it began. §2.7's closed rows have no such field (only `orders.setTick`, which serves the DM arm), `commonsGrievance01` is a pure per-tick blend, and `courtRiskAppetiteOf` returns `{kind,id,present,stock01,band,receipt}`. **Origin:** the gap was carried from r2b's "for more than one season". The PR-V3 cure re-authored the sentence and kept it. **Cure:** declare a `forkSince` on the placement row, with its lifecycle, or restate the trigger without a hold. |
| PR-W2 | m | §6.6, PR-1 host edits | The `patrolDraw` stamp's write line is uncounted. `seedDeploymentState` (`warArmyRecord.js`, 72 eff) cannot write it unedited, and `warDeployment.js` is listed at +1 for the `patrolDrawnCap` line only. |
| PR-W3 | m | §6.6 | `drawShare01 = drawnCap.offensive / fromCap.offensive` is `NaN` when `offensive` is 0 and riders are kept, so the prefilter never skips (`verify.out` (4)). Guard it with `offensive > 0 ? … : 1`. |
| PR-W4 | m | §6.6 l.302, A.6 row l.845 vs OD-PR-41 l.714 | The text says "allied relief reads `homeDefense`", but OD-PR-41 and §E.3 say relief and the field force are `homeDefense − siteDefense`. |
| PR-W5 | m | §6.1, PR-1 leaves and host edits | MN l.185 homes the shared composer at `spatial/presenceComposer.js`. PR places "PR's feeder row" in `embattlement.js` and omits the module when PR-1 builds the car. |
| PR-W6 | m | §0.2 l.73 | The volume quotes ST §7.4's superseded row ("a fort's garrison patrols its attached stretches"). (= SEAMS-r3-10) |
