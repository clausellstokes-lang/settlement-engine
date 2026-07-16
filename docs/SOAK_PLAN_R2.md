# THE SOAK PLAN — the owner's charter, operationalized (runs INSIDE this program per the 2026-07-16 re-sequencing ruling)
## Launches the moment W-R2-DEPTH merges (the engine's final state). Background compute, gate-on harnesses, concurrent with the SM-4/GUIDE-2b/Surveyor builds. Longest probes first.

## 0. What the soak adjudicates (the charter, made falsifiable)
The engine's behavioral promises are proofs-of-construction until these runs convert them to
observations. Every claim below has a PASS criterion a script can evaluate; anything failing
becomes either a TUNING item (weights — batched into the one regen) or a MISSING-MOVER report
(owner decision, per the charter).

## 1. The run matrix (in launch order — longest first)
| Run | Config | Horizon | Seeds | What it proves |
|---|---|---|---|---|
| CENTURY-300 | full_simulation, all nine gates + spatial, 12 settlements | 300 yr | 3 | Attractor-lock hunt at maximum span; sub-century → certified-horizon conversion evidence |
| CENTURY-100 | same | 100 yr | 5 | The mid-horizon certification the charter names |
| CERT-30 | full_simulation | 30 yr | 8 | The headline certification: the advertised horizon, full stack |
| CAP-CURVE | full_simulation | 10 yr | 3 × N ∈ {10, 20, 50, 100} | The settlement-cap study: tick-cost knee + drama-per-settlement distribution (the D2 panel) |
| NEIGHBOR-DIV | paired seeds differing in one settlement | 200 yr | 3 pairs | Divergence still GROWING at year 200 (chaos health — no convergence to shared attractor) |
| DARK-CONTROL | default preset (engine dark) | 30 yr | 2 | The negative control: dormancy byte-identity at horizon (nothing drifts when off) |

## 2. PASS criteria (per the charter + the round-2 additions)
1. **No stasis onset:** every mover family's activity rate in the final decade ≥ 30% of its
   peak-decade rate (no family falls silent).
2. **No cacophony:** realm-wide major-event rate stays within the tempo governor's design band;
   drama-class distribution spread (no single class > 45% of majors in any decade).
3. **Both signs live:** ≥ 1 boom/golden-age arc AND ≥ 1 major conflict arc per decade per
   ~10 settlements (the owner's quotable promise, measured).
4. **No attractor lock:** population, prosperity-band distribution, and power-topology entropy
   all show continued motion in the final third (variance floor, not trend requirement).
5. **Divergence health:** NEIGHBOR-DIV pairs' world-state distance monotonically grows through
   year 200 (sampled per decade).
6. **Succession at volume:** turnover events resolve cleanly at century scale (no orphaned
   courts, no leaderless-forever states).
7. **Bounded growth:** serialized world-state bytes sub-linear in ticks (the existing envelope
   gate's law, held at horizon); tick cost trend within the cost envelope.
8. **Chronicle legibility at 300:** the year-300 chronicle/news sample reads as history, not
   noise (manual sample + the register guards run over it).
9. **Drama-per-settlement fairness (D2):** at N=50/100, per-settlement beat share ≥ the
   starvation-weight design floor (no permanently silent member).
10. **DARK-CONTROL:** byte-identical, full stop.

## 3. Mechanics
- Harness: `scripts/audit/whole-world-soak.mjs` (already assert-and-exit-1 shaped) extended
  with: the gate-matrix param (all-nine-on), horizon/seed params, per-decade metric emission
  (JSONL), and the PASS evaluators above. The century runs checkpoint every 25 game-years
  (resumable; the machine will be shared).
- Launch: background processes, niced, one at a time per core budget — CENTURY-300 first.
  Progress lands in docs/review-r2/soak/ as committed JSONL snapshots (window-cut-proof).
- Analysis: Fable reads the metric JSONL per completed run; verdicts + tuning proposals recorded
  in this doc's Progress section; weight changes batched to THE ONE REGEN.
- The engine is FROZEN for the soak's duration (post-DEPTH): any engine change invalidates
  running certs — display/AI lanes only while soaking (the re-sequenced order guarantees this).

## 4. Outcomes routing
- ALL PASS → certification recorded; sub-century converts to conservative promise (owner
  ruling per charter); deploy becomes soaked-by-default.
- Tuning-class failures → weight adjustments, re-run the affected cert, shifts join the regen.
- Missing-mover verdicts → the owner decision (charter: "missing movers = owner decision") with
  the specific flattened loop named + the weights-vs-mover analysis.

> **Progress** (append per run)
> - (pending DEPTH merge)
