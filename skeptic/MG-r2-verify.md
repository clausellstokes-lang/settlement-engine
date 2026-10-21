# MG-r2-verify — the refuting verifier for THE MOVEMENT GRAMMAR, P6b round r2 (V-MG-r2, Opus 5.5; chair 6eb7b5b6; 2026-10-20)

**COUNTS: 2 holds · 1 fails · 0 stop · 1 new (0 BLOCKING · 1 MAJOR).** I judged the three MAJOR ids of `cure/D-MG-r2.md`: MG-r1-9, MG-V1 and MG-V2. The lane recorded no REFUTED and no STOP rows. `skeptic/MG-r2.md` and `skeptic/SEAMS-P6.md` do not exist (RULINGS-P6 §D.13), so there were no ids from them to judge.

**What I read.** README (RESUME BLOCK 3 and the laws), `briefs/VERIFY.md`, `RULINGS-P6.md` §D, `skeptic/MG-r1-verify.md`, `cure/D-MG-r2.md`, and the volume whole: 562 lines, snapshot `MG-r2-verify-probe/MG.at-verify.md`. I checked the sibling text at PS §4.1 (l.264/266), PR §9.1, HB l.2562–2570, WS l.177/193, OP §3.2, FS l.222/704 and fold §3.3.14. Master `81f1cd963` (HEAD verified) was read-only.

**Probes** (`skeptic/MG-r2-verify-probe/`):
- `naval-and-pace.rerun.out` is the lane's probe re-run on master, and its output is IDENTICAL.
- `mgv2-arith.mjs` / `.out` works the arithmetic for MG-V2.
- `receipts.out` holds every quoted receipt.

| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| MG-r1-9 | CURED (D.4) | HOLDS | MG now registers FOURTH and steps every wing at step (0) with the landed pure `stepArmyPosition` (code line quoted). The writer EXPORTS `holdWingAtContact`, and Arc A calls it. `deployment.sinceTick` exists on master (`armyTransitKernel.js` :61/:304), so Bound 1 off the parent's tick is buildable. No stale "fifth/last" remains. The PS and WC halves are PLAUSIBLE. |
| MG-V1 | CURED (fleet re-plans DARK) | HOLDS | `seaBattleInputs` (navalLayer :447–448), `convoyCapacityAvailable` and `CONVOY_SPEED_FACTOR` are quoted correctly. The probe re-run is identical (0.3/0.7 → 1/0). The fold §3.3.14 quote is present. All 13 `forced_sail` and fleet re-plan cells are dark. |
| **MG-V2** | CURED | **FAILS** | Row 2's text says the row "stays dark while that term reads ×1", which is a gate evaluated per dyad. OD-MG-23 instead says "until it can be read", which is a gate on the flag. **If the gate is per dyad**, the doctrine belief still admits row 2's ×[1,4] motive, so its effect on split reaches ×4.80 against HB's own bound of ×1.20 (`mgv2-arith.out`). That is the original harm entering through a second door. **If the gate is on the flag**, row 2 fires on any pursuer even when the court holds no `doctrineBands`, and its receipt ("hoping Tolle's host would do the same") has no read behind it, which breaks the Evidence Law. S20 tests neither case. Row 15 has the same problem. |

## NEW FINDINGS
| Id | Sev | Site | Receipt | Cure |
|---|---|---|---|---|
| MG-V3 | MAJOR | §3.2 step (0) and its new claim "The three imposed holds (border, fort, screen) still precede the commander's choice"; §11 `wingsEnabled` | Wings are stepped only inside registrant (4). PS's stage carries army `records` (`runTransitLeaves({ records, … })`), and registrants (2) and (3) hold "an army" (PS l.266; PR §9.1 (b)). PS, ST and PR name MG's wing 0 times. A `with_train` wing above `modest` therefore passes the approach fort and the screen unheld, so a split slips both imposed holds. | Step the wings before registrant (1), as a stage pre-step. `wingsEnabled` should also require that ST's fort and PR's screen take wings as candidates. Routes: PS · ST · PR. |

**Minors (not counted).**
- Drift after the lane: WS (16:02) now reads `wayOfWarForWar(…, foeId, …)` and adds `campaign_plan`. MG's `warId` and its nine-cause quote are stale. This is parallel-cure drift.
- §10's row "a wing … arriving on a site → ST" contradicts §6.3's "no arrival reader". This predates r2.
- MG's chosen holds feed PS's Bound 2 drift, so they eat the fort and screen cap. This is pre-existing and goes to SEAMS-P6.

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by code read or execution: MG-V1's hold, the code half of MG-r1-9 (`stepArmyPosition`, `sinceTick`) and MG-V2's arithmetic. CONFIRMED by quoted text: MG-V2's contradiction and MG-V3. PLAUSIBLE: every sibling half (PS's stage threading and its held set, WC Arc A's call, HB's cells).
