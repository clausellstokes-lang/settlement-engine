# RECEIPT — LANE CAP-HORIZON-909 (the 600-year horizon + the 12-settlement timing probe)
**Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 (session b43943b4) · dock `$SC/laneB6` · MEASUREMENT lane, ZERO product bytes**

**STATUS: COMPLETE — THREE RUNS TAKEN, ALL `TRUE_EXIT=0`, NO KILL, NO RE-LAUNCH. ZERO PRODUCT
BYTES; DOCK PORCELAIN 0 AT THE END; DOCK HEAD UNMOVED AT `3b1c0eaa5…`.** M2 08:38:44 → 08:47:44
(9 m 00 s); **M1 08:51:02 → 10:05:54 (1 h 14 m 52 s)**; M2's dark twin 10:08:33 → 10:18:34
(10 m 01 s). Arrival check 08:35:00; orientation re-derived 08:36–08:38; receipt re-written at each
milestone; final write 10:21 EDT. Every timestamp from `date` in the same shell.

> ## ⭐⭐⭐ THE FOUR HEADLINES
> 1. **§910's DEFERRAL D1 IS DISCHARGED.** `capacity_plateau` **EXECUTED and FIRED** on a shipped
>    600-row series at its own horizon — four findings, `deterministicFirings 4`,
>    `fullInstrument true`, `notExecutable []`, `observability` empty. Not inconclusive, not
>    refused. The §907 M1-F1 cure is now CONFIRMED-on-a-shipped-series, not
>    PLAUSIBLE-by-reconstruction.
> 2. **THE FIXTURE SETTLES — INTO A BAND, NOT ONTO A POINT, AND FROM ABOUT YEAR 350.** Five of the
>    six 50-year marks from y350 sit INSIDE the 5 % plateau band; none of the five before it does.
>    The realm load's 50-year drift collapses from ±0.12–0.19 to ±0.01–0.02. At the horizon the
>    load is **0.7251 — inside [0.6, 1.05] — and `capacity_realm_load` is SILENT.**
> 3. ⛔ **§907's 0.4787 IS NEITHER A MODEL FACT NOR A WINDOW FACT — IT IS A *SEED* FACT.** At the
>    same year 300, same configuration, a different seed reads **0.6443** — across the window's own
>    floor. One seed moves the figure by 37 % of the band's width, and both research profiles ship
>    `seedIndices: [1]`.
> 4. **SOAK-1's ≈ 35 h OWNER ASK PRICES AT ≈ 4.0–5.1 h** — 7× to 9× less — from five measured runs
>    rather than one extrapolated constant.


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

## M2 (b) — THE 12-SETTLEMENT **DARK** TWIN, MEASURED RATHER THAN INHERITED
The brief asks the DARK twin to be *priced*. It could have been priced from §909's 30 y × 4 s
dark/lit ratio. A ~10-minute measurement **at the settlement count actually being priced** is cheap
against a figure that feeds an owner row, so it was run: same seed, same settlement count, same
horizon, **`--lighting` omitted** — a true A/B against the lit probe (argv verified by `ps`; no
`--lighting` token present).

**Quiet window** (samples 72, 73, all after M1 released the box at 10:05:54; `quiet-window-M2dark.log`):
`10:06:25 load-1 2.30 · 10:07:25 load-1 2.41`, vitest 0, gate-mutex 0 — plus, at the launch instant
(10:08:33), `gate-mutex.sh` inspect **FREE**, `pgrep -f vitest` **0**, HOLD-VITEST absent, porcelain
**0**, and the lock taken `after 0 atomic poll(s) + 0 legacy poll(s) + 0 shared-drain poll(s)`.
⚠ Sampler SAMPLE 74 (10:08:25) again read `vitest: 1 | gate-mutex 12` — **the same false positive as
before, in the same position: the minute in which this lane was itself reaching for the lock.** It
is now seen twice and characterised: `pgrep -f vitest` matched **0** processes both a minute before
and a minute after, and matches **0** right now with the dark run's mutex holder alive — so the
over-match belongs to the ACQUISITION, not to a held lock.

**RESULT — TRUE_EXIT=0, 10:08:33 → 10:18:34 (10 min 01 s)**, every assertion green.
```
runDurationsMs = {"primary":271395, "replay":267012, "divergent":44912}
run A 271.4 s over 360 settlement-years ⇒ 0.7539 s/settlement-year        CONFIRMED
dark / lit AT 12 SETTLEMENTS = 271.4 / 244.6 = ×1.1094                    CONFIRMED
   (against ×1.2120 at 4 settlements — the dark penalty SHRINKS with scale)
deterministicFirings 0 · fullInstrument TRUE · all four capacity rows NOT APPLICABLE (gate false)
```
⭐ **AND THE DARK WORLD GOES THE OTHER WAY, WHICH IS THE POINT OF THE TWIN.**
`PASS realm population bounded — 75790 → 93543 (×1.23)` **dark**, against `75790 → 30641 (×0.40)`
**lit** — identical seed, identical fixture, one flag apart. The lit demographic term is not
cosmetic: it turns a growing realm into a contracting one over thirty years. This also gives the
`population-runaway-300y` hazard its shape at 12 settlements in miniature.

⭐ It also re-measures §910's **D2** at a new settlement count: a dark run certifies
`fullInstrument: true` with `deterministicFirings 0` and all four capacity rows NOT APPLICABLE **by
gate** — read BEFORE `requires`, exactly as designed. D2 stands as the open DESIGN question §910
recorded; nothing here reopens it as a defect.

## ⭐⭐ THE PRICED TERMINAL CELL — FINAL, from five measured runs
| input | value | how measured |
|---|---|---|
| `f_S(12)` — the settlement term at a fixed 30-year horizon | **×1.4821** | 4 s vs 12 s, both LIT, both 30 y |
| `rate(4,300)` — seed A | **0.6352 s/sy** | §907's run A / 1,200 |
| `rate(4,300)` — seed B | **0.8051 s/sy** | the 600-year world's OWN first 300 years, from `yearlyMs` |
| dark / lit at 12 settlements | **×1.1094** | this lane's A/B |

```
rate(12,300) = 0.9415 … 1.1933 s/settlement-year   (the band IS the seed spread, +26.7 %)
run A        = 3,389 … 4,296 s        run A + run B = 6,779 … 8,592 s
⇒ THE LIT 300 y × 12 s CELL   ≈ 1.9 – 2.4 h
⇒ ITS DARK TWIN               ≈ 2.1 – 2.7 h
⇒ SOAK-1's TOTAL OWNER ASK    ≈ 4.0 – 5.1 h        against the design's ≈ 35 h
                                                    — the design's ask is 7× to 9× the measurement
```
**This figure replaces the design's ≈ 35 h in the chair's §909 row. PLAUSIBLE, and the caveats are
named rather than buried:**
1. **The separability assumption is untested.** `f_S` was measured at 30 years and `f_Y` on the
   4-settlement axis; **nothing here measures the cross term** — whether a 12-settlement world ages
   more expensively than a 4-settlement one. The 12-settlement 30-year runs cannot see it
   (`Q1 8033.9 → Q4 8115.0 ms/y` lit, `9305.9 → 8993.0` dark — thirty years shows no age term at
   all). If the axes interact super-multiplicatively the true figure is higher.
2. **`f_S` rests on TWO settlement counts at ONE horizon on ONE seed** (`k = 1.358`). Two points fix
   a power law only if the law is a power law.
3. ⛔ **The DARK twin's figure is a FLOOR, not an estimate, and this lane now has direct evidence
   for that.** ×1.1094 is measured at 30 years, where the dark world has not yet run away — and the
   dark 12-settlement world is already **growing at ×1.23 per thirty years** while the lit one
   contracts. A runaway world costs more per year, not less, and 300 years is ten times the window
   in which that ratio was taken.
4. **The seed band is real and is the largest single term.** rate(4,300) moves +26.7 % between two
   seeds of the same fixture. A one-seed price is a one-seed price.

## THE FIVE RUNS THIS LANE TOOK (all detached, all through the EXCLUSIVE mutex, all TRUE_EXIT=0)
| # | run | launched | wall clock | run A | s/settlement-year | TRUE_EXIT |
|---|---|---|---|---|---|---|
| 1 | 30 y × 12 s **LIT** (M2 + pilot) | 08:38:44 | 9 m 00 s | 244,623 ms | 0.6795 | **0** |
| 2 | **600 y × 4 s LIT (M1)** | 08:51:02 | **1 h 14 m 52 s** | **2,239,561 ms** | **0.9332** | **0** |
| 3 | 30 y × 12 s **DARK** (M2b) | 10:08:33 | 10 m 01 s | 271,395 ms | 0.7539 | **0** |

(Runs 4 and 5 in the analysis — the 300 y × 4 s lit receipt and the three §909 30-year receipts —
were **read from disk**, not re-executed; every figure taken from them is `runDurationsMs` off the
receipt, cited by file.)

No run was killed; **no 143/137 exit occurred**; nothing was re-launched.

## FENCES — HELD
- **ZERO product bytes.** No edit, no commit, no `register --write`, no `--propose`, no signature,
  no golden, no push, no stash, no `git add` of any form. Dock porcelain verified **0** at arrival
  (08:35), mid-M1 (08:55), at the dark-twin launch instant (10:08:33) and at the end.
- **Dock HEAD unmoved at `3b1c0eaa51f77561a036ae7ec54682c39856192c`** throughout — re-verified, not
  assumed.
- **⛔ NO VITEST OF ANY KIND was run by this lane.** `$SC/HOLD-VITEST` checked before every launch
  and at every quiet-window sample; absent throughout.
- **Every run detached** (`nohup`), never a foreground tool call; `TRUE_EXIT` captured **in-shell
  before any pipe** (the §907 `tee`-exit trap is not repeated); a pid file per run.
- **Every output outside the repo**, under `$SC/capacity-horizon/`.
- **Every timestamp from `date`** in the same shell — none estimated.
## RETROVALIDATION ROW (draft — M1 rows appended when it lands)
| # | call | ground | who owns it |
|---|---|---|---|
| R1 | **M2 was run FIRST, against the brief's order, as a pilot.** The brief lists M1 first. This lane inverted them because M1 is a ~60-minute run on an invocation nobody had executed (`whole-world-soak.mjs` called DIRECTLY, where §907 reached the world through `realm-scale-certification.mjs --profile`), and M2 is the same invocation at a small horizon. Total wall clock is identical — the two serialise on the exclusive mutex either way — so the inversion cost nothing and bought a proof that the argv, the overlay, the shipped series and the evaluator all work before the long run started. | judgment, this lane, 08:38. | lane |
| R2 | **NO `--case-id` IS PASSED ON EITHER RUN.** `--case-id` composes a register cell identity (`cellKeyOf`, `register.mjs:65`). A measurement lane may not mint, so neither receipt claims a case. The seeds follow the register's spelling so a later minting lane recognises the shape; nothing else about the register is touched. | the lane's own fence. | lane |
| R3 | **⛔ A FALSE POSITIVE WAS FOUND IN THIS LANE'S OWN QUIET-WINDOW DETECTOR AND PROVEN BY NEGATIVE CONTROL.** One sample read `vitest: 1`. `pgrep -f vitest` matches the machine-wide lock path `/tmp/settlementforge-vitest-gate.$(id -u).lock` (`gate-mutex.sh:61`, `:85`) because "vitest" is a SUBSTRING of it — executed: a `tail -f` on that path is convicted by `pgrep -f vitest`, and the count returns to 0 when it is killed. The estate-wide consequence is stated with its DIRECTION: the detector over-matches, so it can produce a false positive but never a false zero — every `vitest: 0` in every quiet-window log (§907's included) stands, and only a NON-ZERO reading needs `gate-mutex.sh`'s own inspect beside it. | measured, this lane, 08:52:51. | lane |
| R4 | **⛔ REFUSAL WITH A MEASUREMENT — the §907 rate 0.635 s/settlement-year is NOT a constant and no single-number extrapolation from it is sound.** It is one point on a surface with two measured axes: settlements (×1.482 from 4 to 12, at a fixed 30-year horizon) and world age (×1.386 from 30 to 300 years, at a fixed 4 settlements). §907 said so itself and named the missing datum; the datum is now taken. Every hour-figure in this receipt carries both terms. | measured, this lane + two §909 receipts on disk. | lane |
| R5 | **THE SUPERLINEARITY EXPONENT IS LABELLED PLAUSIBLE AND THE REASON IS THE SHAPE OF THE EVIDENCE, NOT MODESTY.** `k = 1.358` comes from exactly TWO settlement counts at ONE horizon on ONE seed. Two points fix a power law only if the law is a power law; nothing here excludes a linear-plus-quadratic or a cache-cliff. The terminal cell's price inherits that label. | measured, this lane. | lane |
| R6 | **⛔ THE SEEDS DIFFER BETWEEN THE 300-YEAR AND 600-YEAR RUNS, AND THE BRIEF'S QUESTION IS RE-CUT RATHER THAN ANSWERED WRONG.** The brief prescribes `…-600y-4s-seed1`; §907 ran `…-300y-4s-seed1`. Different seed, different world — the soak's own divergence arm proves seeds diverge. So "is 0.4787 a point on a curve still moving at 600?" is answered WITHIN the 600-year run's own curve, and the cross-world comparison at year 300 is reported separately and labelled as what it is. Answering it as a single continued curve would have been a false report. | measured, this lane, before M1 landed. | lane |
| R7 | **No product byte moved.** No edit, no commit, no `register --write`, no signature, no golden, no push, no stash, no `git add`. Dock porcelain verified 0 at arrival, at the M1 launch instant, and at the end. Every output is under `$SC/capacity-horizon/`, outside the repo. | STATE NEVER FATE. | lane |
| R8 | **The DARK twin of the 12-settlement probe is RUN, not inherited.** The brief asks the DARK twin to be *priced*. It could have been priced from the §909 30 y × 4 s dark/lit ratio alone. A ~9-minute measurement at the settlement count actually being priced is cheap against a figure that feeds an owner row, so it is measured. | judgment, this lane. | lane |
| R9 | **⛔ MY OWN PRE-REGISTERED PREDICTION WAS PUBLISHED BEFORE THE RUN AND WAS WRONG BY +23.8 %, AND IT IS KEPT IN THE RECEIPT RATHER THAN QUIETLY DROPPED.** The linear-age model (fitted to the 300-year run's own quartiles, reproducing it to 1.1 %) predicted run A = 1,809 s; the measurement is 2,239.6 s. The cause is named by measurement, not guessed: the per-year cost is concave and saturates near ×1.6 of a young world's year around century 5, so no model fitted inside 300 years can predict 600. Publishing the prediction first is what made the miss legible at all. | measured, this lane, 08:49 (prediction) and 09:28:34 (result). | lane |
| R10 | **⭐ THE HORIZON AXIS WAS RE-MEASURED WITHOUT THE SEED CONFOUND, USING A FIELD NOBODY HAD USED FOR IT.** The cross-run reading (300 y vs 600 y, two seeds) says the rate rises ×1.469 per doubling. The receipt's own `yearlyMs` prices ANY PREFIX of ONE world, and inside the 600-year world the same doubling reads **×1.179**. The cross-run figure over-states the horizon term by ×1.25 because it carries a population-level difference between two seeds. Every horizon claim in this receipt is stated on the seed-controlled figure and the confounded one is labelled. | measured, this lane. | lane |
| R11 | **⛔ REFUSAL — THE BRIEF'S MODEL-VS-WINDOW DICHOTOMY IS REPORTED AS INSUFFICIENT, WITH THE FIGURE THAT BREAKS IT.** The brief says "do not rule model-vs-window; report which the figures support". The figures support NEITHER cleanly: at the same year 300, the same configuration and a different seed, `loadRatio01` reads **0.6443** where §907 read **0.4787** — across the window's own floor. The honest report is a third category (a SEED fact) plus partial support for the instrument reading's weaker half. Forcing the answer into the two offered options would have been a false report. | measured, this lane. | lane |
| R12 | **⚠ AN INSTRUMENT DISAGREEMENT IS REPORTED WITHOUT BEING CALLED A DEFECT.** On one receipt `settlementShapeOf` grades two settlements `plateau` while `capacity_plateau` convicts all four. The windows differ (one century vs `pops[mid]`, which is three centuries on a 600-year run) and BOTH are correct on their own terms. It is reported because the register pins `population.<id>.shape` `exact` beside a tripwire grading a different window on the same bytes, and nothing in the estate says so — a reader taking one as corroborating the other would be wrong. Calling it a defect would have been the over-claim. | measured, this lane. | lane |
| R13 | **THE `capacity_plateau` CONVICTION OF `soak-b` IS A HAIRLINE AND IS FLAGGED AS ONE.** Drift **0.0502** against a **0.05** band — it fails by 0.0002. Reporting "all four settlements convicted" without that would let a 0.004 % margin read as a strong signal to the tuning desk. | measured, this lane. | lane |

## WHAT THE CHAIR IS OWED — findings this lane MAY NOT act on
| # | the finding | why it is the chair's |
|---|---|---|
| C1 | **§910's D1 IS DISCHARGED** — `capacity_plateau` has now graded a shipped 600-row series at its own horizon, EXECUTED and FIRED with four figures. The ledger row can be closed. | closing a deferral is a ledger act, not a measurement. |
| C2 | **SOAK-1's ≈ 35 h ask is measured at ≈ 4.0–5.1 h.** The owner row asks the owner to accept ≈ 35 h of terminal-soak wall clock or take the interim 4 s cell instead. At 7×–9× less, the question changes shape. | an OWNER row. The chair re-prices; the owner decides. |
| C3 | ⛔ **ONE SEED MOVES `loadRatio01` AT YEAR 300 BY 0.166 — 37 % OF THE [0.6, 1.05] WINDOW'S WIDTH.** Both research profiles carry `seedIndices: [1]`. The design signs tuning bands against a one-seed cell. | the SEED GRID is a design decision with a cost in owner-hours; §2.5/CAP-7 and the tuning sitting own it. Nothing was changed. |
| C4 | **The register's `population.<id>.shape` and the `capacity_plateau` row grade DIFFERENT WINDOWS on the same receipt** (one century vs `pops[mid]`) and will disagree; on this receipt they disagree on two of four settlements. | whether the estate wants them reconciled, or wants the difference documented, is a design call. |
| C5 | **A DARK 300 y × 12 s twin cannot be priced from a 30-year ratio with confidence** — the dark world grows ×1.23 per thirty years where the lit one contracts ×0.40. ≈ 2.1–2.7 h is a floor. | if the twin's price matters to the owner's answer on SOAK-1, the measurement that settles it is a longer dark run. |
| C6 | ⚠ **`pgrep -f vitest` over-matches** — proven by control. Every quiet-window log in the programme uses it. The direction saves every zero; only NON-ZERO readings are unsafe. | an estate-wide idiom; changing it is a code act outside a measurement lane. |

## DEFERRED — documented, not a bug to re-find
| # | the item | what would discharge it |
|---|---|---|
| E1 | **The CROSS TERM in the cost model is unmeasured** — no run in the estate varies settlements at a long horizon, so `rate(S,Y) = rate(4,30)·f_S(S)·f_Y(Y)` is assumed separable and the terminal cell's price inherits that. | the terminal cell itself, or a cheaper 150 y × 12 s probe (≈ 25 min at the measured rate) which would give the cross term directly and shrink the price band. **Recommended to the chair as the cheapest next measurement, if the price matters.** |
| E2 | **The settling verdict rests on ONE seed at 600 years.** This world settles into the window from ~y350. Whether the FIXTURE FAMILY does is not established — and C3 shows seeds differ materially at 300 years. | a second 600-year seed (≈ 1 h 15 m). Not run here: the brief named one seed, and a second is a chair-sized decision about owner-hours, not a lane's. |
| E3 | **`capacity_plateau`'s window is horizon-relative (`pops[mid]`) while every other plateau definition in the estate is absolute (one century).** On a 600-year run it grades a 300-year drift; on a 300-year run it would grade 150. So the SAME row asks a different question of a longer receipt. | a design ruling (C4). Recorded because a longer run being convicted *more* readily is counter-intuitive and will be misread. |

## FILES WRITTEN (all outside the repo; the dock is untouched)
```
$SC/receipt-cap-horizon-909.md              this receipt
$SC/capacity-horizon/
  M1-600y-extract.txt                       the 600-year receipt, graded by the PRODUCT's instruments
  M2-lit-extract.txt  M2-dark-extract.txt   the two 12-settlement probes
  BASELINE-300y-4s-extract.txt              §907's receipt re-graded at THIS tip (the control)
  M2-figures.md                             the cost-surface working
  RETRO-draft.md                            the retrovalidation working
  horizon-extract.mjs                       the read-only instrument (imports evaluate.mjs,
                                            register.mjs, tripwires.mjs from the dock; re-implements nothing)
  launch-soak.sh  quiet-sample.sh           the detached launcher and the sampler
  soak-horizon-600y-4s-lit.log              M1's raw log
  soak-probe-30y-12s-lit.log  …-dark.log    M2's raw logs
  quiet-window-M1.log  -M1b.log  -M2dark.log  three quiet-window logs, two of them overlapping
                                            by design so each window has an independent second reading
  artifacts/horizon-600y-4s-lit.json        10,496,438 B — THE 600-YEAR RECEIPT
  artifacts/probe-30y-12s-lit.json          1,043,214 B
  artifacts/probe-30y-12s-dark.json         the dark twin
  *.pid                                     one pid file per run
```
