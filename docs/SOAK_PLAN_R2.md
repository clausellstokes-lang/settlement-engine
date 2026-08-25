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

## 5. ⬛ OWNER RULING 2026-07-19 — THE THREE-LEVEL LADDER · THE COMBINATORIAL MANDATE · THE RESEQUENCING
(Verbatim intent: "soak should have three levels: subcentury, century, and 300 century";
"we need to tune things in every conceivable toggle turned on and off in combination with
everything else… Everything on is very different compared with everything on vs one thing off
and any combination beneath"; "this doesn't cost usage but just CPU churn which I have the
hardware for… so the push and deploy comes before the soak because I will need to run that on
a different computer.")

### 5a. The three levels (ratifies §1's ladder, now the certification spine)
LEVEL 1 SUBCENTURY = CERT-30 · LEVEL 2 CENTURY = CENTURY-100 · LEVEL 3 THE 300 = CENTURY-300.
Every §2 PASS criterion evaluates at every level. NEIGHBOR-DIV / CAP-CURVE / DARK-CONTROL
remain cross-level probes unchanged.

### 5b. The combinatorial matrix (toggle-combination coverage, made tractable)
- THE FLAG SET: every tick-path toggle — the eight dark engine flags of the regen batch
  (distancePricedNewsEnabled · reframeEnabled · provenanceLedgerEnabled · urbanFabricEnabled ·
  npcGrowthEnabled · spatialConsequenceEnabled · npcLadderEnabled · traditionsEnabled) + the
  nine wave gates + the tempo-preset band. The definitive enumeration is produced AT HARNESS
  BUILD from DEFAULT_SIMULATION_RULES + the virtual-flag registry and committed with the
  harness (no hand-typed flag list may drift).
- PRUNE BY PROOF: a flag claimed display-only leaves the factorial ONLY via an executed
  same-seed pair (flag on vs off, all else on) showing metric-stream byte-identity — recorded
  per flag. Dormancy goldens prove the all-else-off direction; this proves the in-context one.
- TIERED DESIGN (the owner's "any combination beneath", structured):
  · L1 SUBCENTURY: FULL FACTORIAL over the pruned dynamics set when 2^k fits the measured L1
    cost budget (size after timing one CERT-30 run; target ≤ ~1,024 runs); otherwise a
    pairwise-covering array plus the L2 structured subsets. ≥ 2 seeds per combo.
  · L2 CENTURY: ALL-ON + LEAVE-ONE-OUT (k combos) + ONLY-ONE-ON (k combos) + ALL-OFF control
    + every combo L1 flagged anomalous.
  · L3 THE 300: ALL-ON (the shipping config) + the ≤ 3 combos L2 flags + DARK-CONTROL.
- INTERACTION READS: for combo pairs differing in exactly one flag, the same-seed per-decade
  metric delta = that flag's MARGINAL EFFECT in context; super-additive anomalies become named
  tuning items. Tuning re-certs run at minimum ALL-ON + LEAVE-ONE-OUT at L1.

### 5c. The resequencing: push (+ deploy) precede the soak; the soak runs on a SEPARATE machine
- Cross-machine protocol: clone origin at a recorded SOAK-BASE SHA · npm ci · runs niced +
  checkpointed · per-decade JSONL synced back via git (committed snapshots under
  docs/review-r2/soak/ on a soak branch pushed from the soak machine).
- The soak itself needs only THE PUSH (a clone suffices); production deploy is not a soak
  prerequisite. MANAGER RECOMMENDATION (vetoable, recorded): the pre-soak deploy ships DARK —
  the eight flags unlit, the exact configuration the dormancy goldens prove byte-identical —
  and THE ONE REGEN + the lit deploy remain batch 2 after soak + tuning. The §8 VERY-END
  carve-outs (⛔legal · ⛔support-email MX) still gate whichever deploy goes PUBLIC first.
- Engine freeze law unchanged in substance: certs BIND to the SOAK-BASE SHA; engine changes
  after it invalidate affected running certs (re-run or re-base). Practical order: L1 factorial
  may start early on the soak machine (cheap, informative); hold L3 until the engine is final
  post-ROUND-3 so 300-year certs never need re-runs.

> **Progress** (append per run)
> - (pending DEPTH merge)
