# MG-r1-verify — the refuting verifier for THE MOVEMENT GRAMMAR, P6b round r1 (V-MG-r1, Opus 5.5; chair 6eb7b5b6; 2026-10-20 15:3x CDT by `date`)

**COUNTS: 24 holds · 1 fails · 0 stop · 2 new (0 BLOCKING · 2 MAJOR).** Judged: the 8 BLOCKING and 15 MAJOR of `skeptic/MG-r1.md`, plus OP-r1-16 and WS-r1-12 (the MAJORs routed to MG). No REFUTED and no STOP rows exist in `cure/D-MG-r1.md` (37 CURED · 2 NOTED). `skeptic/SEAMS-P6.md` does not exist yet (it runs after P5c), so no SEAMS ids were judged.

**What I read.** I read the kit README (RESUME BLOCK 3 and the laws), the BOARD's 2026-10-20 lines, `briefs/VERIFY.md`, `SKEPTIC.md`, `RESEARCH-COMMON.md` and `RULINGS-P6.md`. I read `skeptic/MG-r1.md`, the MG rows of `OP-r1.md` and `WS-r1.md`, and `cure/D-MG-r1.md` with its probe directory. I read the volume `docs/DESIGN_FP_ARCH_MG.md` whole: 536 lines, last changed 15:28 (snapshot `MG.at-verify.md`). For the seams, I checked the sibling text: WS l.174/177/294/535, OP l.117/536/562, HB l.2561–2590, PS l.283/339 and PR l.202.

The code of record is master `81f1cd963` (HEAD verified), read-only. There I re-read `planMarch`, `armyMarchWeeks`, `hopWeeks`/`legWeeks`, `convoyTransitWeeks`, `planConvoy`, `seaBattleInputs`, the sea-battle loop in `navalKernel.js`, `readBeliefStrength` and `livedLegTicks`/`advanceLivedTraveller`.

**Probes** (`skeptic/MG-r1-verify-probe/`):
- `replan-realbase.mjs` / `.out` is an INDEPENDENT test of the A.6 + due-clamp re-plan on master's REAL plan base. On master, `planMarch` takes ONE rounding of the origin-to-destination cost (`hopWeeks(o,d)`); the lane's probe used the sum of per-hop weeks instead. Over 2,000 random-cost lines it found 0 faster and 0 frozen. The ratio of arrival to the single plan was median 1.17, p90 1.25 and max 1.43.
- `receipts.out` holds the quoted receipts for the fail and the new findings.
- `ws-c5-tokens.txt` against `mg-motives.txt` shows that every token in WS's C5 row is one of MG's 35 motives.

## THE TABLE
| Id | Disposition | Verdict | Why / receipt |
|---|---|---|---|
| MG-r1-1 | CURED (A.6) | HOLDS | No live constant remains. All five are mentioned only in strike brackets (MG1 · §6.4 · §6.5 · §7.2 · §8.4 · OD-MG-17). §7.2 keeps the storm as a slowdown (`stormMultOf` "≥ 1 (slow, not sever)"), and the forced pace is WY's routed row. |
| MG-r1-2 | CURED (A.6) | HOLDS | MG9 and §8.2 apply the ratio on the `road`/`highway` GRADES only. `'barred'` appears only in the struck note at l.163. This matches `livedLegTicks`, which reads `gradeLegMultiplier(input.hop.grade)`. |
| MG-r1-3 | CURED (B.2) | HOLDS | §2.2 now stores the share as a word only, and strength and supply are derived. §6.1 puts the debit on the deployment by WC's writer, and wings stay DARK until then. This is consistent with the kernel's derive pass. |
| MG-r1-4 | CURED (B.2) | HOLDS for armies | §3.2 and §11 now require `passageEnabled`. The same defect for FLEETS is MG-V1, which this gate cannot reach. |
| MG-r1-5 | CURED (A.6 + clamp) | HOLDS | My own probe on master's real base: 0/2,000 faster and 0 frozen. The slowdown it costs is recorded as a minor below. |
| MG-r1-6 | CURED (A.5) | HOLDS | Rows 1, 2, 24 and 28 and N-4 read only the deciding court's own belief. `readBeliefStrength` is the landed belief read with the dormant-truth fallback (beliefMap.js). The WarTab idiom is now own-column only (l.52). |
| MG-r1-7 | CURED (B.2) | HOLDS | The invented count is struck (§5.1 (v), §5.3). The term is HB's `anticipationFactorFor` over `doctrineBands` (HB l.2561). Its double application is MG-V2. |
| MG-r1-8 | CURED (A.4) | HOLDS | §0.2 corrects the row shape. Every unit-sighting row is marked DARK-A.4, and row 22's "writes a sighting" is struck. |
| **MG-r1-9** | CURED | **FAILS** | §6.3: Arc A "holds both parties at contact", but a wing lives on MG's ledger, whose writer is ONE, `movementLedger.js` (MG15). The wing's hold therefore writes MG's ledger from WC's leaf, or it is never written back. Nothing names a stepper that moves a wing before Arc A (registrant 4) reads it, and MG's leaf runs fifth, so Arc A reads a stale or unstepped wing. Only the losses' seam is named. |
| MG-r1-10 | CURED | HOLDS | §6.3 refuses a split across a stranger's land until PS rules. |
| MG-r1-11 | CURED | HOLDS | The class is now `army`, §16 records it as a reuse, and the WC column is routed. |
| MG-r1-12 | CURED | HOLDS | Rows 3 and 6 are DARK-arrival, and §6.3 names WC as the owner of the arrival reader. |
| MG-r1-13 | CURED (B.2) | HOLDS | `hide` is "—" for army and wing in §3.1, and §9 and S7 follow. |
| MG-r1-14 | CURED (B.2) | HOLDS | §6.5 and row 24 apply the edge only at or below `modest`. PS l.339 defines the army's might against that band. |
| MG-r1-15 | CURED (A.3) | HOLDS | §3.3 names OP's `detourEnvoyErrand`. `advanceLivedTraveller` reaches `livedLegTicks` through `openLivedLeg` (l.172–173). |
| MG-r1-16 | CURED | HOLDS | No person is rolled, so no person draw exists (§2.4, §5.1). |
| MG-r1-17 | CURED | HOLDS | §6.4 admits a forced pace only where it gains, and S12 holds the rider to long hops. |
| MG-r1-18 | CURED | HOLDS | Rows 7 and 21 are ⛔ with their missing reads named, and rows 10, 19, 27 and 30 now cite named reads. The new siege arm in row 31 is a minor (below). |
| MG-r1-19 | CURED (A.2) | HOLDS | §5.2 reads `wayLeanOf` at WS's bound. WS l.294 C5 uses only MG's motive keys (probe). |
| MG-r1-20 | CURED | HOLDS | The `reroute` row is roads-only. N-7 names WC's chooser and cites RULINGS-P5 A.3. |
| MG-r1-21 | CURED (B.2) | HOLDS | §5.4 makes the exposure HB-6 evidence and adds no RN deed. |
| MG-r1-22 | CURED | HOLDS | The table has a class column (A · W · F · AF), and the named units move to §4.2. |
| MG-r1-23 | CURED (B.2) | HOLDS (PLAUSIBLE) | MG7 and §7.2 split along LG-2's commitments. LG is unbuilt. |
| OP-r1-16 | CURED (MG side) | HOLDS | OP l.536 says the same: one re-plan, `detourEnvoyErrand`. |
| WS-r1-12 | CURED (MG side) | HOLDS | WS l.535 agrees: one bundle, one bound, MG's dial struck. |

## NEW FINDINGS
| Id | Sev | Site | Receipt | Cure |
|---|---|---|---|---|
| MG-V1 | MAJOR | §7.2 the fleet's `double_back`/`reroute`/`shadow`/`forced_sail` "under §3.2's three conditions" | `navalLayer.js :: seaBattleInputs`: "`groundAdvantage01: clamp01(1 - rec.position01)`", "`fatigue01: rec.position01`". A re-plan restarts `position01` at 0, so a fleet comes back fresh and in home waters mid-sea; a forced sail makes it FRESHER. PS banks battle inputs only for its four mover kinds, which exclude fleets, so the `passageEnabled` gate gives fleets nothing. Two further gaps: the named helper prices by `armyMarchWeeks` (×1.5) where convoys use `convoyTransitWeeks` (`CONVOY_SPEED_FACTOR: 1.2`), and `planConvoy`'s lane-capacity law is bypassed. | Name the naval re-plan (pricer `convoyTransitWeeks`, capacity through `convoyCapacityAvailable`) with banked sea-battle inputs, owned by PS or the naval owner. Otherwise keep the fleet re-plan verbs DARK. |
| MG-V2 | MAJOR | §4.1 row 2 (and row 15) × §5.1 (v) | Row 2's read is "`anticipationFactorFor(…, 'split')`", and (v) multiplies "`anticipationFactorFor(worldState, courtId, foeCourtId, cls, v)`" for v = `split`. HB's ONE term is applied twice and can exceed HB's own bound (MG10). Row 15 raises `hold` with a counterWeight keyed to ownAction `split`. | HB's term enters once, in (v). Rows 2 and 15 read only the believed pursuer or foe. |

**Minors (not counted).**
- The clamp slows a repeated `shadow` by a median of +17% (max +43%), and S17 states no bound.
- Row 31's siege arm, "as the court's own news tells it", names no read.
- §3.3 quotes an OP sentence, "MG's `reroute` is the column's", that is gone from OP (0 hits).
- MG calls the argument `warKey` where WS's signature says `warId`.
- A `light` wing re-planned through `replanFromNode` is priced at column speed.
- Requiring `passageEnabled` also darkens the naming arm (MG-4).

**CONFIRMED vs PLAUSIBLE.** CONFIRMED by execution or by code read: MG-r1-5's hold and MG-V1. CONFIRMED by quoted text: the other holds, MG-V2 and MG-r1-9's fail. PLAUSIBLE: MG-r1-23 (LG unbuilt) and every routed sibling half.
