# RECEIPT — LANE CAP-HORIZON-909 (the 600-year horizon + the 12-settlement timing probe)
**Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 (session b43943b4) · dock `$SC/laneB6` · MEASUREMENT lane, ZERO product bytes**

**STATUS: PARTIAL — arrival check taken Mon Sep  7 08:35:00 EDT 2026; orientation re-derived 08:36–08:38; no run launched yet.**

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
