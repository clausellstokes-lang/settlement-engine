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

### M1 — RUN A LANDED: **2,239.6 s for 600 y × 4 s = 0.9332 s/settlement-year** (09:28:34)
⛔ **THE PRE-REGISTERED PREDICTION WAS WRONG BY +23.8 %, AND THAT IS A FINDING, NOT AN
EMBARRASSMENT.** The linear-age model predicted run A = 1,809 s; it measured **2,239.6 s**. The same
model reproduced the 300-year run to 1.1 %, so the miss is not arithmetic — **the per-year cost
accelerates beyond linear once a world passes ~300 years**, and no model fitted inside 300 years
predicts 600.

| horizon (4 settlements, LIT) | run A | s/settlement-year |
|---|---|---|
| 30 y | 55.0 s | 0.4585 |
| 300 y | 762.3 s | 0.6352 |
| **600 y** | **2,239.6 s** | **0.9332** |

`run A(600) / run A(300) = 2.938` for a doubled horizon ⇒ an exponent in YEARS of
`ln(2.938)/ln(2) = 1.555`. Read across the whole range the acceleration is plain: ×10 years
(30→300) buys ×1.386 on the rate, while the next ×2 years (300→600) buys ×1.469.

⚠⚠ **AND THAT CROSS-RUN READING IS CONFOUNDED BY THE SEED, SO IT IS NOT THE FIGURE THIS LANE
STANDS ON.** The 300-year and 600-year runs are different worlds (R6). A world with more souls
costs more per year for reasons that have nothing to do with age. The clean measurement is the
run's own `yearlyMs` series, which prices any prefix of THIS world — reported when the receipt
lands. On the 300-year world that instrument reads: century 1 mean **2,147.6 ms/year**, century 2
**2,504.9** (×1.166), century 3 **2,851.8** (×1.328).

## ⭐⭐ M1 RESULT — ran to completion, **TRUE_EXIT=0**, 08:51:02 → 10:05:54 EDT (**1 h 14 min 52 s**)
Receipt `$SC/capacity-horizon/artifacts/horizon-600y-4s-lit.json` (**10,496,438 B**, schemaVersion 5,
`passed: true`, `finalHash e6837b3810a4…`); extract `$SC/capacity-horizon/M1-600y-extract.txt`; log
`$SC/capacity-horizon/soak-horizon-600y-4s-lit.log`. **Every assertion green**, including
`byte-identical re-run — all 600 yearly composite hashes equal`, `realm population bounded —
21124 → 17537 (×0.83; envelope 0.05–20)` and `serialized state under the house envelope — max
2.93MB < 3.60MB`. `subsystems.rules.demographicsEnabled = true`, read off the receipt.

### ⭐⭐⭐ THE DEFERRAL D1 IS DISCHARGED — `capacity_plateau` GRADED A SHIPPED SERIES AT ITS OWN HORIZON
§910's D1: *"`capacity_plateau` has never graded a SHIPPED 300-row series… the cure of §907 M1-F1 at
the row's own horizon is PLAUSIBLE-by-reconstruction, not CONFIRMED-on-a-shipped-series."* It is now
CONFIRMED on a shipped series:
```
yearlyPopulations   rows=600  width=4        yearlyDiedFlags  rows=600  width=4
capacity_plateau    horizon required=150  observed=600   ⇒ EXECUTED, FIRED  (4 findings)
  settlement 0 never plateaued: 12186 at year 299 against 14080 at year 599
  settlement 1 never plateaued:  2968 at year 299 against  3117 at year 599
  settlement 2 never plateaued:   231 at year 299 against   305 at year 599
  settlement 3 never plateaued:    65 at year 299 against    35 at year 599
deterministicFirings 4 · fullInstrument TRUE · notExecutable []  · observability (none)
```
It did **not** report through `observability` and it was **not** `notExecutable` — the two channels
§910 built for a short or a blind run. At 600 observed years the horizon guard is satisfied
(600 ≥ 150) and the `requires` channel is satisfied (both series present), so the row reached its
detector and answered with figures. **CONFIRMED.**

### THE FOUR CAPACITY ROWS AT 600 YEARS
| row | gate | requires | horizon | verdict |
|---|---|---|---|---|
| `capacity_plateau` | true | satisfied | 600 obs / 150 req | **EXECUTED, FIRED — 4 findings** |
| `capacity_floor_thaw` | true | satisfied | 600 obs / 100 req | **EXECUTED, SILENT** — nothing is frozen |
| `capacity_realm_load` | true | satisfied | n/a | ⭐ **EXECUTED, SILENT — the realm load is INSIDE the window** |
| `capacity_envelope_30y` | true | satisfied | 600 obs / 30 req | **EXECUTED, SILENT** |

`deterministicFirings` **4**; `fullInstrument` **true**; `notExecutable` **[]**. All four rows
executed; none was refused; none was inconclusive.

### ⭐⭐ THE ANSWER TO THE ONE QUESTION: DOES THE FIXTURE SETTLE?
**It settles into a BAND, not onto a POINT — and the band is the row's own window. From roughly
year 350 the realm stops going anywhere; before that it swings ±25 % per fifty years.**

The realm's 50-year change, at every 50-year mark (the 5 % plateau band is the comparison):
```
 y100  -8.8%   1.8x band     y350  -1.9%   INSIDE the band
 y150 +11.2%   2.2x band     y400  -1.1%   INSIDE the band
 y200 -25.2%   5.0x band     y450  +2.9%   INSIDE the band
 y250  -6.9%   1.4x band     y500  +3.2%   INSIDE the band
 y300 +23.6%   4.7x band     y550 +13.3%   2.7x  band
                             y600  -2.8%   INSIDE the band
```
**Five of the six marks from y350 on sit INSIDE the 5 % band; none of the five before y350 does.**
The realm total goes 15,450 (y300) → 14,986 (y400) → 15,925 (y500) → 17,537 (y600): it is no longer
crashing or recovering, it is **oscillating about a level** with one late excursion.

And the load ratio says the same thing in the row's own units:
```
 y300 0.6443   y350 0.6320   y400 0.6233   y450 0.6361   y500 0.6603   y550 0.7444   y600 0.7251
 Δ50y  +0.1229      -0.0123      -0.0087      +0.0128      +0.0242      +0.0841      -0.0193
```
After year 300 the 50-year drift collapses from ±0.12–0.19 to ±0.01–0.02 for three consecutive
half-centuries. **That is a settling curve. CONFIRMED, on this seed.**

### DOES THE REALM ENTER [0.6, 1.05] AND STAY? — **IT ENTERS AT YEAR 10 AND DOES NOT STAY; IT OSCILLATES ACROSS THE FLOOR**
```
first decade INSIDE the window : year 10 (0.7367)
last  decade OUTSIDE          : year 470 (0.5922)
ENTERS AND STAYS              : NO
at the horizon, year 600      : 0.7251 — INSIDE, and capacity_realm_load is SILENT
```
The excursions below the 0.6 floor are **y200–y280** (min 0.4843 at y230), **y360–y390** (min
0.5405) and **y470** (0.5922) — three dips, each shallower than the last, and from **y480 to y600
the reading is continuously in-window**. The window is not a state this world reaches once; it is a
band it re-enters, and the amplitude of its departures is decaying.

### ⭐⭐⭐ IS 0.4787 AT YEAR 300 A POINT ON A CURVE STILL MOVING? — **THE FIGURES SUPPORT NEITHER "MODEL" NOR "WINDOW". THEY SUPPORT A THIRD ANSWER §907 DID NOT HAVE: IT IS A *SEED* FACT.**
§907 framed the choice as MODEL (the lit term really settles near half its bound) versus INSTRUMENT
(the window grades a steady state and 0.4787 was read mid-recovery). This lane can weigh both,
because the 600-year world passes through year 300 too — and it reads something else there.

| reading at YEAR 300, 4 settlements, LIT, same preset | seed | `loadRatio01` | `capacity_realm_load` |
|---|---|---|---|
| §907's run | `…-300y-4s-seed1` | **0.4787** | **FIRES** — outside [0.6, 1.05] |
| **this lane's run, at its own year 300** | `…-600y-4s-seed1` | **0.6443** | would be **SILENT** — inside the window |

**Two seeds, one horizon, one configuration, and the reading moves from 0.4787 to 0.6443 — across
the floor of the very window that grades it.** One world is convicted at year 300 and the other is
not. So:
- **The MODEL reading is not supported.** "The lit term settles near half its bound at realm scale"
  cannot be right when a second seed of the same fixture sits at 0.64 at the same year and at 0.73
  at year 600, with a bound essentially unchanged (24,185 vs 25,674).
- **The INSTRUMENT reading is PARTLY supported, and only in its weaker half.** §907's tilt — "a
  realm still gaining 26 %/50 y has not reached the state the window describes" — is vindicated by
  this run: the mid-recovery years ARE the ones that read low here too (y200–y280 dips to 0.4843,
  the same neighbourhood as §907's 0.4787), and the settled years read 0.62–0.75, inside the
  window. **The window is not mis-drawn; it was being read at the wrong time.**
- **What the figures actually establish is SEED VARIANCE at a single horizon**, which neither
  option contemplated. A single-seed reading at year 300 is not evidence about the model at all.

⛔ **THE CONSEQUENCE FOR THE TUNING SITTING, AND IT IS THE LOAD-BEARING ONE.** The design's plan is
to sign bands against a ONE-SEED cell (`seedIndices: [1]` on both `research-lit` and
`research-lit-4s`, `realm-scale-certification.mjs:97-112`). **Measured here, one seed moves this
figure by 0.166 on a window whose whole width is 0.45 — 37 % of the band, from a fact about the
seed.** Signing a tuning value against a single seed at year 300 signs against noise of that size.
This is a MEASUREMENT handed to the chair, not a ruling: it is the tuning desk's and the owner's to
decide what the cell must carry. **No dial was touched. THE PROMISE is intact.**

### SETTLEMENT SHAPES AT 600 — and ⛔ THE TWO PLATEAU DEFINITIONS DISAGREE ON THE SAME DATA
`settlementShapeOf` on the shipped series and on the state vectors AGREE with each other on all
four (a control this lane ran because the two derivations could have drifted):

| settlement | start | y500 | y600 | `settlementShapeOf` | `capacity_plateau` |
|---|---|---|---|---|---|
| soak-a | 15,160 | 12,471 | 14,080 | `other` | **FIRES** — drift 0.1554 (3.1× band) |
| soak-b | 2,750 | 3,054 | 3,117 | **`plateau`** | **FIRES** — drift **0.0502** (1.0× band) |
| soak-c | 1,889 | 320 | 305 | **`plateau`** | **FIRES** — drift 0.3203 (6.4× band) |
| soak-d | 536 | 80 | 35 | `other` | **FIRES** — drift 0.4615 (9.2× band) |

⛔ **`settlementShapeOf` says two of the four PLATEAU; `capacity_plateau` convicts all four. Both are
right, and a reader who takes one as corroborating the other will be wrong.** The windows differ:
`settlementShapeOf` compares the final year to **one century earlier** (`CENTURY = 100`,
`register.mjs:53`), while `capacity_plateau` compares `pops[last]` to `pops[mid]` — on a 600-year
run that is **three centuries earlier** (`tripwires.mjs:437-438`). soak-c is flat over its last
century (320 → 305) and has trebled since year 300 (231 → 305); both statements are true of the
same series. **This is a REPORTED instrument observation, not a defect claim** — neither definition
is wrong, but the register pins `population.<id>.shape` `exact` while the tripwire grades a
different window on the same receipt, and nothing in the estate says so today.

⭐ And note **soak-b fails by 0.0002**: drift 0.0502 against a 0.05 band. A hairline conviction is
worth flagging to the tuning desk before it is read as a strong signal.

### RUNAWAY / FLOOR / BIFURCATION AT 600 YEARS
```
realm.runawayCount 0 · realm.flooredCount 0 · realm.unlawfulZeroCount 0 · realm.bifurcated 0
realm.ratio 0.8302   (21,124 → 17,537; envelope 0.05–20)
capacity_floor_thaw  EXECUTED, SILENT — no living settlement holds one head count across 100 years
```
**The `population-runaway-300y` hazard does not reproduce at DOUBLE the horizon**, and neither does
a floor. §907 confirmed this at 300 years on one seed; it now holds at 600 years on a second seed,
with the floor row for the first time **actually able to say so** (at §907 it was NOT-EXECUTABLE).
`realm.ratio` 0.83 at 600 years against 0.56 at 300 years (other seed) — the realm is nearer its
starting size after six centuries than after three.

### M1's COST — and ⭐⭐ THE SEED-CONTROLLED HORIZON MEASUREMENT THE `yearlyMs` SERIES MAKES POSSIBLE
```
runDurationsMs = {"primary":2239561, "replay":2230837, "divergent":13819}
peakHeapUsedBytes = 563,801,984 (register ceiling 838,860,800 — under)
run A 2,239.6 s over 2,400 settlement-years ⇒ 0.9332 s/settlement-year   CONFIRMED
run B 2,230.8 s ⇒ 0.9295 s/settlement-year (a 0.4 % replay agreement)     CONFIRMED
whole job 1 h 14 min 52 s (A+B+C = 4,484.2 s; the balance is the isolate, start-up and a
10.5 MB receipt write)                                                   CONFIRMED — `date` either side
```
⭐ **The receipt carries `yearlyMs`, so ANY PREFIX of this one world can be priced — which removes
the seed confound from the horizon axis entirely.** Reading the horizon inside a single run:
```
through y100  270.9 s  0.6772 s/sy      per-century mean cost, this world:
through y200  586.3 s  0.7329 s/sy        y1-100    2,708.8 ms/y   (baseline)
through y300  938.2 s  0.7818 s/sy        y101-200  3,154.6 ms/y   x1.165
through y400 1342.7 s  0.8392 s/sy        y201-300  3,518.2 ms/y   x1.299
through y500 1776.1 s  0.8880 s/sy        y301-400  4,045.1 ms/y   x1.493
through y600 2211.6 s  0.9215 s/sy        y401-500  4,333.9 ms/y   x1.600
                                          y501-600  4,355.0 ms/y   x1.608
```
⭐⭐ **THE AGE TERM ITSELF SETTLES, AND IT SETTLES BEFORE THE POPULATION DOES.** Century 5 → century 6
moves the per-year cost by **+0.5 %** (×1.600 → ×1.608) after four centuries of steep climb. The
cost of a year of world stops growing at roughly ×1.6 of a young world's year. **A 1,200-year run
would therefore cost about twice a 600-year run, not four times** — the acceleration that broke my
own prediction is a transient of the first four centuries, not a standing law.

⭐ **AND THE AGE MULTIPLIER IS SEED-STABLE WHILE THE LEVEL IS NOT** — the one comparison that
separates the two:
| | century 1 | century 2 | century 3 |
|---|---|---|---|
| the 300-year world (`…-300y-…seed1`) | 2,147.6 ms/y | 2,504.9 (**×1.166**) | 2,851.8 (**×1.328**) |
| the 600-year world (`…-600y-…seed1`) | 2,708.8 ms/y | 3,154.6 (**×1.165**) | 3,518.2 (**×1.299**) |

The century-over-century MULTIPLIERS agree to within 0.1 % and 2.2 %; the LEVELS differ by 26 %.
**Ageing costs the same proportion in both worlds; the 600-year world is simply dearer per year
because it holds ~17,500 souls where the other holds ~12,000–15,500.** So the cross-run horizon
reading in the previous section (×1.469 from 300 to 600) was indeed carrying a seed effect: the
seed-controlled figure from inside one world is **0.7818 → 0.9215 s/sy = ×1.179** for the same
doubling. **The cross-run figure over-states the horizon term by ×1.25.**

⛔ **REFUSAL WITH A MEASUREMENT — my own pre-registered prediction was wrong by +23.8 % and the model
is named as the cause.** A linear age term fitted inside 300 years (`c(y) = 2012.4 + 3.338·y`)
reproduced that run to 1.1 % and predicted 1,809 s for 600 years against **2,239.6 s** measured.
The cost curve is not linear in age; it is concave and saturating near ×1.6. **Any figure in this
programme extrapolated past its own measured horizon should be read as this prediction was.**
