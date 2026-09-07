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

