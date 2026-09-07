# RECEIPT — LANE CAP-HORIZON-909 (the 600-year horizon + the 12-settlement timing probe)
**Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 (session b43943b4) · dock `$SC/laneB6` · MEASUREMENT lane, ZERO product bytes**

**STATUS: PARTIAL — M2 COMPLETE (TRUE_EXIT=0, 9 min 00 s, 08:38:44 → 08:47:44 EDT); M1 RUNNING
(launched 08:51:02 EDT, predicted ≈ 61 min).** Arrival check 08:35:00; orientation re-derived
08:36–08:38; receipt re-written at each milestone. Timestamps from `date` in the same shell.

## ARRIVAL CHECK (Mon Sep  7 08:35:00 EDT 2026, `date`)
| line | expected | measured | verdict |
|---|---|---|---|
| dock HEAD | product tip `3b1c0eaa5…` | `3b1c0eaa51f77561a036ae7ec54682c39856192c` | **CONFIRMED** |
| `git -C <main> rev-parse claude/composite-r4` | same | `3b1c0eaa51f77561a036ae7ec54682c39856192c` | **CONFIRMED — dock IS the tip** |
| dock porcelain | 0 | `0` | **CONFIRMED** |
| `node_modules` in dock | ~455 entries | **452** | **CONFIRMED (brief's "~455" is approximate; symlink live)** |
| `$SC/HOLD-VITEST` | absent | `No such file or directory` | **CONFIRMED — no chair gate held** |

## ORIENTATION — every brief figure re-derived from the tree BEFORE any launch
| brief cites | measured at `3b1c0eaa5` | verdict |
|---|---|---|
| the series ships additively on v5 | `yearlyPopulations: runA.yearlyPopulations` at `whole-world-soak.mjs:1122`, `yearlyDiedFlags` at `:1123`, inside `receiptBody`; `schemaVersion: SOAK_RECEIPT_SCHEMA_VERSION` at `:1021` | **CONFIRMED — top-level, additive** |
| `capacity_plateau` horizon | `PLATEAU_HORIZON_YEARS = 150` (`tripwires.mjs:162`); `requires: ['yearlyPopulations[last]','yearlyDiedFlags[last]']` (`:426`); `horizon.required = 150` (`:427`); detector returns `[]` below 150 (`:433`) | **CONFIRMED** |
| `capacity_floor_thaw` horizon | `FLOOR_THAW_HORIZON_YEARS = 100` (`:163`), same `requires`, `horizon.required = 100` (`:471`) | **CONFIRMED** |
| `capacity_envelope_30y` armed | row at `tripwires.mjs:543`, `requires: ['behavioral.yearly[last].motion{}']`, `horizon.required = CAMPAIGN_HORIZON_YEARS = 30` (`soakInvariants.mjs:172`), floor `MOVING_SHARE_FLOOR = 0.05` (`:165`), motion floor `MOTION_FLOOR_01 = 0.0025` (`:158`) | **CONFIRMED — armed and gated on `demographicsEnabled`** |
| `capacity_realm_load` band | `[0.6, 1.05]` on `behavioral.yearly[last].realmDemography.loadRatio01`, plus `granary + walls === settlements` (`tripwires.mjs:494-541`) | **CONFIRMED** |
| `settlementShapeOf` | `scripts/soak/register.mjs:80`. `CENTURY = 100`, `HALF_CENTURY = 50`, `RUNAWAY_MULTIPLE = 50`, `FLOORED_START_FRACTION = 0.2`, `FLOORED_FLATNESS = 0.02`, `PLATEAU_FLATNESS = 0.05`; **windows are ABSOLUTE (100 entries back), not fractional** | **CONFIRMED** |
| the soak CLI | `--years` `--settlements` `--seed` `--lighting k=v` `--receipt` all real (`whole-world-soak.mjs:153-190`); `--settlements` clamped to `[1,30]` at `:169`; `DIVERGENCE_YEARS = min(YEARS,5)` at `:158` | **CONFIRMED** |
| §907's rate | 0.635 s/settlement-year (run A 762.3 s over 300 y × 4 s) — the estimate this lane re-measures | inherited, to be re-measured |

## THE PLAN — why M2 runs FIRST
The brief lists M1 first. This lane runs **M2 first**, and the ground is de-risking rather than
preference: M1 is a ~52-minute investment on an invocation nobody has executed before (this lane
calls `whole-world-soak.mjs` DIRECTLY, where §907 reached the world through
`realm-scale-certification.mjs --profile research-lit-4s`). M2 is the same invocation at a small
horizon, so it is simultaneously the M2 measurement AND the pilot that proves the argv, the
`--lighting` overlay, the shipped series and the evaluator path before the long run starts. Total
wall clock is unchanged — the two runs serialise on the exclusive mutex either way.

⛔ **NO `--case-id` IS PASSED, DELIBERATELY.** `--case-id` is what composes a register cell
identity (`cellKeyOf({profile, caseId})`, `register.mjs:65`). This lane may not mint, so it names
no case and the receipts carry no `caseId`. The seeds follow the register's own spelling so a
later minting lane can recognise the shape, and nothing else.

## M2 — THE 12-SETTLEMENT TIMING PROBE (§907 owner row (d))
**QUIET WINDOW — the law, met before the launch** (`$SC/capacity-horizon/quiet-window-M1.log`):
```
SAMPLE  1 | Mon Sep  7 08:36:01 EDT 2026 | load: { 2.73 9.76 13.63 } | vitest: 0 | gate-mutex procs: 0
SAMPLE  2 | Mon Sep  7 08:37:01 EDT 2026 | load: { 2.07 8.29 12.82 } | vitest: 0 | gate-mutex procs: 0
SAMPLE  3 | Mon Sep  7 08:38:01 EDT 2026 | load: { 2.22 7.18 12.09 } | vitest: 0 | gate-mutex procs: 0
```
**THE WINDOW: samples 1, 2, 3** — load-1 `2.73`, `2.07`, `2.22`, all < 4.0, **zero** vitest workers,
three consecutive minutes. At the launch instant (08:38:44): `gate-mutex.sh` inspect =
`FREE — no held lock or Vitest runner outside this process's ancestry` (exit 0), `pgrep -f vitest`
= **0**, `$SC/HOLD-VITEST` absent.

**LAUNCH — 2026-09-07 08:38:44 EDT**, detached, TRUE_EXIT captured in-shell before any pipe
(`$SC/capacity-horizon/launch-soak.sh`; pid file `probe-30y-12s-lit.pid` = 23543):
```
sh scripts/gate-mutex.sh --run -- node --max-old-space-size=6144 \
  scripts/audit/whole-world-soak.mjs --years 30 --settlements 12 \
  --seed realm-scale-research-lit-4s-30y-12s-seed1 \
  --lighting demographicsEnabled=true --receipt $SC/capacity-horizon/artifacts/probe-30y-12s-lit.json
```
**The child was verified by process, not by intention** (08:38:52) — argv on pid 25110 carries
`--years 30 --settlements 12 … --lighting demographicsEnabled=true`; mutex holder 23547; lock
acquired `after 0 atomic poll(s) + 0 legacy poll(s) + 0 shared-drain poll(s)`.

⚠ **THE MUTEX HAZARD, RAISED AS IT WAS CREATED (inherited from §907 and still true).**
`gate-mutex.sh --run` at the EXCLUSIVE tier holds `/tmp/settlementforge-vitest-gate.502.lock` for
the whole run. The bounded wait is `GATE_MUTEX_MAX_POLLS=40 × GATE_MUTEX_POLL_SECONDS=30` = **20
minutes**, so any chair gate launched during M1's ~50-minute run will exhaust its wait and refuse.
That is the serialisation the brief requires, working as designed; the pid files are
`$SC/capacity-horizon/*.pid` if the chair needs the slot back.

### M2 RESULT — ran to completion, **TRUE_EXIT=0**, 08:38:44 → 08:47:44 EDT (**9 min 00 s**)
Full figures `$SC/capacity-horizon/M2-figures.md`; extract `$SC/capacity-horizon/M2-lit-extract.txt`;
log `$SC/capacity-horizon/soak-probe-30y-12s-lit.log`; receipt
`$SC/capacity-horizon/artifacts/probe-30y-12s-lit.json` (1,043,214 B, schemaVersion 5, `passed: true`).

**THE HEADLINE — the wall clock per settlement-year, and the SUPERLINEARITY the §907 datum could not measure.**

| figure | value | label |
|---|---|---|
| run A, 30 y × 12 s LIT | **244,623 ms = 244.6 s** over 360 settlement-years = **0.6795 s/settlement-year** | **CONFIRMED** — `runDurationsMs.primary` off the receipt |
| run B (byte-identical replay) | 241,917 ms | **CONFIRMED** |
| run C (5-year divergence) | 37,195 ms | **CONFIRMED** |
| whole job wall clock | **9 min 00 s** (A+B+C = 523.7 s; the balance is the 11.3 s worker isolate + start-up + receipt write) | **CONFIRMED** — `date` either side |
| the 4-settlement figure AT THE SAME HORIZON | 30 y × 4 s LIT run A **55,243** and **54,790 ms** → **0.4585 s/settlement-year** | **CONFIRMED** — two §909 receipts on disk |
| the 300-year 4-settlement figure | 762,290 ms → **0.6352 s/settlement-year** | **CONFIRMED** — §907's receipt, re-read here |
| **the superlinearity exponent in SETTLEMENT COUNT** | ×4.446 cost for ×3 settlements ⇒ **k = ln(4.446)/ln(3) = 1.358**; the rate rises ×1.482 | **PLAUSIBLE — TWO POINTS** (4 and 12 settlements, one horizon, one seed). Two points fix a power law only if the law is a power law. |
| the WORLD-AGE term, separately measured | 30 y → 300 y at 4 s: 0.4585 → 0.6352 = **×1.386** | **CONFIRMED** (and corroborated from inside the run: `Q1 2139.2ms → Q4 2890.2ms/year`) |
| the DARK/LIT cost ratio at 30 y × 4 s | dark 66,679 ms vs lit 55,243 ms = **×1.207 — DARK IS DEARER** | **CONFIRMED** — §909 car 1's own two receipts |

⛔ **THE §907 FIGURE IS NOT A CONSTANT OF THE ENGINE, AND READING IT AS ONE IS THE ERROR THIS
MEASUREMENT REMOVES.** "0.635 s/settlement-year" is one point on a surface that moves in BOTH the
settlement count and the horizon. §907 said so itself and named the missing datum. It is now taken.

**THE PRICED TERMINAL CELL — 300 y × 12 s LIT, and its DARK twin.**
Separable model `rate(S,Y) = rate(4,30) × f_S(S) × f_Y(Y)`, `f_S(12) = 1.4820`, `f_Y(300) = 1.3856`:
```
rate(12,300) = 0.4585 × 1.4820 × 1.3856 = 0.9414 s/settlement-year
3,600 settlement-years ⇒ run A 3,389 s;  run A + run B 6,778 s
⇒ THE LIT TERMINAL CELL  ≈ 6,838 s ≈ 1.9 h   (design: ≈ 17.6 h — 9.3× high)
⇒ THE DARK TWIN          ≈ 1.9 h × 1.207 ≈ 2.3 h
⇒ SOAK-1's TOTAL ASK     ≈ 4.2 h            (design asks the owner for ≈ 35 h)
```
**PLAUSIBLE, and the caveat is the MODEL and not the arithmetic.** `f_S` and `f_Y` were each
measured at ONE point and multiplied; **no measurement in this lane touches the CROSS term** —
whether a 12-settlement world ages more expensively than a 4-settlement one. The 12-settlement
30-year run cannot answer it (`Q1 8033.9 → Q4 8115.0 ms/year`, +1.0 % — thirty years is too short
to see the age term at all). If the axes interact super-multiplicatively the true figure is higher.
The one measurement that settles it is the terminal cell itself.

⛔ **AND THE DARK TWIN'S PRICE CARRIES ONE MORE RISK, NAMED.** The ×1.207 dark/lit ratio is measured
at 30 years, where the dark world has not yet run away. The `population-runaway-300y` hazard is the
dark world's documented 300-year behaviour, and a runaway world costs more per year, not less. **The
dark twin's ≈ 2.3 h is a FLOOR, not an estimate.**

## M1 — THE 600-YEAR HORIZON (§907 owner row (c); §909's "a 600-year run precedes any re-cut")
⭐ **THE PREDICTION IS RECORDED BEFORE THE RUN, so the run can grade the model rather than the
model being fitted to the run.** From the 300-year run's own instrument
(`Q1 2139.2 ms → Q4 2890.2 ms/year`, quartile mid-years ≈ 38 and ≈ 263) the per-year cost is
`c(y) = 2012.4 + 3.338·y` ms. Self-check: that model integrates over 1..300 to **754 s** against the
**762.3 s** actually measured — **1.1 % error**, so it is worth predicting with.
```
PREDICTED  run A (600 y × 4 s) = 1,809 s = 30.2 min
PREDICTED  whole job (A + B + C + isolate) ≈ 3,638 s ≈ 60.6 min
```
⚠ **A 600-YEAR RUN IS NOT TWICE A 300-YEAR RUN** — it is ≈ 2.37× it, because the world ages into a
dearer per-year cost. The brief's "~52 min at the measured 0.635 s/settlement-year" is the
constant-rate reading and is the same error M2 removes; it is expected to run ~17 % long.

### M1 QUIET WINDOW — the law met, and ⛔ A FALSE POSITIVE FOUND IN THIS LANE'S OWN INSTRUMENT
Two INDEPENDENT samplers ran a minute out of phase (`quiet-window-M1.log`, `quiet-window-M1b.log`).
The window is three consecutive clean minutes AFTER the M2 probe released the box at 08:47:44, and
both instruments certify it:

```
sampler B  SAMPLE 3 | 08:47:54 | load-1 3.25 | vitest 0 | gate-mutex 0
           SAMPLE 4 | 08:48:54 | load-1 2.51 | vitest 0 | gate-mutex 0
           SAMPLE 5 | 08:49:54 | load-1 1.87 | vitest 0 | gate-mutex 0
sampler A  SAMPLE 13| 08:48:02 | load-1 3.15 | vitest 0 | gate-mutex 0
           SAMPLE 14| 08:49:02 | load-1 2.47 | vitest 0 | gate-mutex 0
           SAMPLE 15| 08:50:02 | load-1 1.88 | vitest 0 | gate-mutex 0
```
At the launch instant (08:51:02): `gate-mutex.sh` inspect = **FREE — no held lock or Vitest runner
outside this process's ancestry** (exit 0), `pgrep -f vitest` = **0**, `$SC/HOLD-VITEST` absent,
**dock porcelain 0**. The lock was then taken `after 0 atomic poll(s) + 0 legacy poll(s) + 0
shared-drain poll(s)` — **the mutex itself found nothing to wait for**, which is the strongest
available evidence that no chair gate was running.

⛔⛔ **AND ONE SAMPLE READ `vitest: 1` — IT IS A DEFECT IN THE DETECTOR, PROVEN BY NEGATIVE CONTROL,
NOT EXPLAINED AWAY.** Sampler B's SAMPLE 6 (08:50:54) reported `vitest: 1 | gate-mutex procs: 12`.
Sampler A read `vitest: 0` at 08:50:02 and again at 08:51:02, and the product's own detector read
FREE at 08:51:02. Rather than argue the outlier away, the mechanism was **executed**:

```
$ tail -f /tmp/settlementforge-vitest-gate.502.lock/pid &        # NOT vitest — a `tail`
$ pgrep -f vitest
31084                                                            # ← it matches
$ kill 31084 ; pgrep -f vitest | wc -l
0
```
**The machine-wide lock path is `/tmp/settlementforge-vitest-gate.$(id -u).lock`
(`gate-mutex.sh:61`, `:85`) and the string "vitest" is a SUBSTRING of it.** So `pgrep -f vitest`
convicts any process whose argv merely NAMES the lock — including `gate-mutex.sh`'s own
acquisition machinery. SAMPLE 6 was taken while this lane's own launch pipeline was reaching for
the lock.

**The consequence, stated for the estate and not only for this lane.** `pgrep -f vitest` is the
idiom every quiet-window log in this program uses, §907's included. The direction of the error
matters and is the saving grace: a detector that over-matches can produce a FALSE POSITIVE but can
never manufacture a FALSE ZERO — so every `vitest: 0` on every quiet-window log in the estate
remains sound, and it is only a NON-ZERO reading that must not be believed without
`gate-mutex.sh`'s own inspect beside it. This lane's launches all carry that inspect.

### M1 LAUNCH — 2026-09-07 08:51:02 EDT, detached, TRUE_EXIT captured in-shell
```
sh scripts/gate-mutex.sh --run -- node --max-old-space-size=6144 \
  scripts/audit/whole-world-soak.mjs --years 600 --settlements 4 \
  --seed realm-scale-research-lit-4s-600y-4s-seed1 \
  --lighting demographicsEnabled=true --receipt $SC/capacity-horizon/artifacts/horizon-600y-4s-lit.json
```
Wrapper pid **29037** (`horizon-600y-4s-lit.pid`); mutex holder **29041**; node child **30649** —
argv verified by `ps`, carrying `--years 600 --settlements 4 … --lighting demographicsEnabled=true`.
Log `$SC/capacity-horizon/soak-horizon-600y-4s-lit.log`.

⛔⛔ **A METHODOLOGICAL CORRECTION THE CHAIR MUST HAVE BEFORE READING M1'S ANSWER, RAISED BEFORE THE
RUN FINISHED RATHER THAN AFTER.** The brief prescribes the seed
`realm-scale-research-lit-4s-600y-4s-seed1`. §907's 300-year run used
`realm-scale-research-lit-4s-300y-4s-seed1`. **These are DIFFERENT SEEDS, so they are different
worlds** — the seed drives generation, and the soak's own instrument proves seeds diverge
(`PASS different seeds produce a divergent event-type mix — TV 0.273`). The 600-year run is
therefore **not a continuation of the 300-year curve**, and the question "is 0.4787 at year 300 a
point on a curve still moving at 600?" cannot be answered by extending that curve.

What the 600-year run CAN answer, and what this lane will answer with it:
1. **WITHIN ITS OWN RUN** — does *this* world's realm load, read at years 300, 350, … 600, still
   move at the horizon, or does it flatten? That is the settling question, asked of one curve.
2. **ACROSS THE TWO WORLDS** — does the 600-year world's reading AT YEAR 300 agree in shape with
   the 300-year world's 0.4787? Two seeds agreeing is evidence about the FIXTURE FAMILY; two seeds
   disagreeing would mean the §907 figure is seed-specific and the tuning desk is reading noise.
Both readings are reported. Neither is presented as the other.
