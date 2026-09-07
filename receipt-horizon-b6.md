# RECEIPT — LANE HORIZON-B6 (the three CAPACITY evidence measurements)

STATUS: **COMPLETE** — all three measurements executed. 2026-09-07 00:38:24 EDT.

**HEADLINE, in one line each:**
- **M1** the 300-year LIT curve **CURES the runaway** (`runawayCount` 0, `bifurcated` 0) but **does
  NOT plateau** (`other` x4; the realm is still gaining 26 %/50 y at the horizon) and **fires one
  deterministic tripwire** (`capacity_realm_load` 0.4787). The register cell is **REFUSED by its own
  door**. Wall clock **25m43s, not ~2.3 h**.
- **M2** the reading suite is a **356 ms** item — the design's PLAUSIBLE placeholder is discharged.
- **M3** the envelope suite is **1.14 s** against a 60 s bar — **52.6x margin**, STOP S1 not tripped.
- **Two instrument findings and one stale-comment finding** are recorded below; the first
  (**M1-F1**) is load-bearing for the tuning signature and is the most important thing in this file.

Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 (session 405b5e7e) · Lane: HORIZON-B6
Dock: `$SC/laneB6` (detached, never the shared tree). Product bytes changed: **ZERO**.

---

## ARRIVAL CHECK — 2026-09-06 23:54:36 EDT (`date`)
1. `git -C $SC/laneB6 rev-parse HEAD` = `4243bdc610fe5b380f1d0029973cf9088bae1631` — MATCHES. **PASS**
2. `git -C $SC/laneB6 status --porcelain | wc -l` = `0` — clean. **PASS**
3. `ls -A $SC/laneB6/node_modules | wc -l` = `453` — **PASS**

No discrepancy at arrival; the lane proceeded. (At exit line 3 reads **455** — two Vitest cache
directories, not packages. See FENCES at the foot of this receipt.)

---

## WHAT IS OWED — the three measurements, re-derived from the design at HEAD

**The anchor line, re-derived (the brief said "re-derive the line"):**
`src/domain/worldPulse/demographicsRates.js:375` —
`export const DEMOGRAPHIC_TUNING_SIGNATURE = Object.freeze({ signed: false, lit: null });`
**CONFIRMED at line 375 exactly**, by `grep -n`. The surface (C1) is landed; both words are at rest
(`signed: false`, `lit: null`).

**Where the three come from.** `git show review-fixes-2026-07-08:docs/DESIGN_HORIZON.md`
(snapshot kept at `$SC/capacity/DESIGN_HORIZON.snapshot.md`, 1,469 lines):

- **M1** — §2.5 C4′ clause (4) and the `research-lit-4s` register cell: the interim
  `research-lit-4s` **300 y × 4 settlements** receipt under the LIT overlay, run manually
  (≈ 2.3 h), showing `plateau` shapes and `bifurcated` 0 — the pre-lighting plateau evidence.
  Also §14 E44 and the §11.4 "off-gate, one-time" row ("the interim `research-lit-4s` cell ≈ 2.3 h
  before the wave").
- **M2 + M3** — §11.4 (snapshot line **1029**), the CAPACITY row of "Wall-clock added to the gate
  and to CI", verbatim:

  > | CAPACITY `demographicsEnvelope.test.js` (+ the reading suite) | `test:ratchet` | ≤ 60 s (STOP S1 re-scopes the arms, never a conditional step); the reading suite ms | **PLAUSIBLE** |

  That single row names **two** items and sizes **neither**: C3's envelope suite (a ≤ 60 s bar that
  is a prediction, not a measurement) and C2's reading suite (named only as "the reading suite ms").
  Both carry the design's `PLAUSIBLE` label. These are the two unsized evidence items; they were
  not invented by this lane.

**State of the C2/C3 surfaces at HEAD** (the brief's "the C2/C3 EVIDENCE items did not [land]"):
the *code* landed — `src/domain/display/demographicReading.js` (13,551 B),
`tests/domain/demographicReading.test.js` (12,447 B), `tests/domain/demographicsEnvelope.test.js`
(13,351 B), `tests/helpers/demographicsRealmFixture.js` (3,529 B) are all PRESENT. What is missing
is the **measurement**: no figure was ever recorded for either suite, and the 300-year lit curve has
never been executed (both register cells are UNFROZEN GENESIS, every field empty).

---

## QUIET-WINDOW LAW (before the soak launch)

Law: load-1 < 4.0 **and** zero vitest workers for three consecutive one-minute samples.
Full log: `$SC/capacity/quiet-window.log`. Fourteen samples were taken because the first eleven
did not produce a clean run of three.

```
SAMPLE  1 | Sun Sep  6 23:58:54 EDT 2026 | load: { 3.31 3.10 7.10 } | vitest: 0
SAMPLE  2 | Sun Sep  6 23:59:54 EDT 2026 | load: { 2.94 2.99 6.79 } | vitest: 0
SAMPLE  3 | Mon Sep  7 00:00:54 EDT 2026 | load: { 4.44 3.44 6.70 } | vitest: 0   <- BREACH (4.44)
SAMPLE  4 | Mon Sep  7 00:01:01 EDT 2026 | load: { 4.64 3.50 6.70 } | vitest: 0   <- BREACH (4.64)
SAMPLE  5 | Mon Sep  7 00:02:01 EDT 2026 | load: { 4.27 3.59 6.51 } | vitest: 0   <- BREACH (4.27)
SAMPLE  6 | Mon Sep  7 00:03:01 EDT 2026 | load: { 3.77 3.58 6.31 } | vitest: 0
SAMPLE  7 | Mon Sep  7 00:03:07 EDT 2026 | load: { 3.42 3.51 6.25 } | vitest: 0
SAMPLE  8 | Mon Sep  7 00:04:07 EDT 2026 | load: { 4.01 3.65 6.11 } | vitest: 0   <- BREACH (4.01)
SAMPLE  9 | Mon Sep  7 00:05:07 EDT 2026 | load: { 3.63 3.63 5.94 } | vitest: 0
SAMPLE 10 | Mon Sep  7 00:05:17 EDT 2026 | load: { 3.46 3.59 5.90 } | vitest: 0   <- the window
SAMPLE 11 | Mon Sep  7 00:06:18 EDT 2026 | load: { 2.83 3.40 5.67 } | vitest: 0   <- the window
SAMPLE 12 | Mon Sep  7 00:07:18 EDT 2026 | load: { 3.09 3.38 5.51 } | vitest: 0   <- the window
SAMPLE 13 | Mon Sep  7 00:08:18 EDT 2026 | load: { 3.12 3.35 5.35 } | vitest: 0
SAMPLE 14 | Mon Sep  7 00:09:18 EDT 2026 | load: { 3.73 3.47 5.25 } | vitest: 0
```

**THE WINDOW: samples 10, 11, 12** — load-1 `3.46`, `2.83`, `3.09`, all < 4.0, zero vitest workers,
three consecutive minutes. Samples 13 and 14 continued the streak up to the launch instant.

**Attribution of the breaches (a finding, not an excuse).** `ps -Ao pcpu,pid,comm -r` at 00:03:07
named the load, and it was **not** a lane and **not** a gate:

```
 61.0 59639 …/RemoteManagement/ARDAgent.app/Contents/Support/build_hd_index
 58.5 59655 …/RemoteManagement/ARDAgent.app/Contents/Support/build_hd_index
 42.4   406 …/SkyLight.framework/Resources/WindowServer
 34.7 90027 …/Claude.app/…/Claude Helper
 29.2 90047 …/Claude.app/…/Claude Helper (Renderer)
 23.3   600 …/com.jumpcloud.jcagent-tray.EndpointSecurity
```

Two macOS `build_hd_index` (Apple Remote Desktop agent) processes at ≈ 120 % combined were the whole
excursion. Zero vitest workers throughout; `pgrep -fl gate-mutex` empty at 23:57:37, so no chair gate
was running, as the chair stated.

---

## M1 — THE "~2.3 h" PLATEAU RECEIPT (the 300-year lit curve)  ✅ RAN — 25 m 43 s, and it is NOT a plateau

**Invocation (the workflow's own, not hand-spelled).** `.github/workflows/soak-research.yml` runs
`node --max-old-space-size=6144 scripts/audit/realm-scale-certification.mjs --profile "$SOAK_PROFILE"`,
default profile `research-lit-4s`. This lane runs the identical command, output redirected out of the
repo so the dock stays clean.

**The plan, dry-run first (5 s, executes no simulation) — CONFIRMED**
(`$SC/capacity/artifacts/research-plan.json`):

```json
"profile": "research-lit-4s",
"cases": [{ "id": "research-lit-4s-300y-4s-seed1", "years": 300, "settlements": 4,
            "seed": "realm-scale-research-lit-4s-300y-4s-seed1",
            "lighting": { "demographicsEnabled": true } }],
"source": { "commit": "4243bdc610fe5b380f1d0029973cf9088bae1631", "dirty": false,
            "sourceFingerprint": "fef4c11e043ecf4d639533fb5c96645f418862dc2aa16502c62d336a35bbcfb0" }
```

The case id `research-lit-4s-300y-4s-seed1` under profile `research-lit-4s` composes, through
`cellKeyOf({profile, caseId})` (`scripts/soak/register.mjs:65`), to the register cell key
**`research-lit-4s/research-lit-4s-300y-4s-seed1`** — byte-for-byte the genesis cell already
scaffolded in `tests/soak-harness/.soak-register.json`. The lane is filling the cell the design
scaffolded, not minting a new identity. **CONFIRMED.**

**Launch — 2026-09-07 00:09:37 EDT**, detached, through the mutex exactly as the brief requires:

```
nohup sh -c "cd $SC/laneB6 && echo \"SOAK START \$(date)\" && \
  sh scripts/gate-mutex.sh --run -- node --max-old-space-size=6144 \
  scripts/audit/realm-scale-certification.mjs --profile research-lit-4s \
  --output $SC/capacity/artifacts/research.json; \
  echo TRUE_EXIT=\$? >> $SC/capacity/soak-300y.log; \
  echo \"SOAK END \$(date)\" >> $SC/capacity/soak-300y.log" >> $SC/capacity/soak-300y.log 2>&1 &
```

pid `60908` (recorded at `$SC/capacity/soak.pid`); mutex holder `60913`; node child `62664`.
Log: `$SC/capacity/soak-300y.log`. First lines confirm the run is the right one:

```
gate-mutex: acquired atomic lock at /tmp/settlementforge-vitest-gate.502.lock as PID 60913
# realm-scale case research-lit-4s-300y-4s-seed1
# whole-world soak — 300 years × 4 settlements, seed "realm-scale-research-lit-4s-300y-4s-seed1",
  full_simulation preset (seasons preset), now pinned 2026-07-12T00:00:00.000Z
## run A (primary)
```

**⚠ HAZARD THE CHAIR MUST KNOW, RAISED THE MOMENT IT WAS CREATED.** `gate-mutex.sh --run` at the
EXCLUSIVE tier (the only tier available — SHARED refuses any caller without a vitest `--maxWorkers`
cap, and this is not a vitest run) holds `/tmp/settlementforge-vitest-gate.502.lock` for the whole
~2.3 h. The mutex's bounded wait is `GATE_MUTEX_MAX_POLLS=40 × GATE_MUTEX_POLL_SECONDS=30` = **20
minutes**, so **any chair gate launched during this soak will exhaust its wait and refuse.** This is
the serialisation the brief asked for, working as designed; it is recorded here so the chair does not
read a mutex refusal as a broken gate. `$SC/capacity/soak.pid` holds the pid if the chair needs the
slot back.

**The worker was verified to be the right run, by process** (00:14:49 EDT). `realm-scale-certification`
spawns the actual soak as a child, and that child's argv is the proof the overlay reached the world:

```
62695 62664 104.6% 872,016 KB  node …/scripts/audit/whole-world-soak.mjs \
  --years 300 --settlements 4 --seed realm-scale-research-lit-4s-300y-4s-seed1 \
  --case-id research-lit-4s-300y-4s-seed1 \
  --receipt …/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json \
  --lighting demographicsEnabled=true
```

300 years, 4 settlements, `--lighting demographicsEnabled=true`, burning a full core. (The parent at
0.0 % CPU is just the orchestrator; the work is in the child. Worth stating because a reader glancing
at the parent would think the soak had stalled.) The ~2.3 h estimate is consistent with the shape of
the run: run A and run B are each a full 300-year traversal (~1.17 h at the 3.5 s/settlement-year
estimate) and run C's divergence leg is only `min(YEARS, 5)` = 5 years.

### M1 RESULT — ran to completion, **TRUE_EXIT=0**, 00:09:37 → 00:35:20 EDT (**25 min 43 s**)

Full figures: `$SC/capacity/M1-figures.md`. Plateau chart as numbers: `$SC/capacity/M1-plateau-chart.txt`.
Raw log: `$SC/capacity/soak-300y.log`. Receipt: 5,205,682 B, `schemaVersion` 5, `passed: true`,
`notExecutable: []`. Aggregate digest `c8205d4e1147c2fb28be42e93a4e18a753850cfa050d5a9709204527f1e3ffe0`,
source `4243bdc61…`. `subsystems.rules.demographicsEnabled = true` — **the LIT overlay reached the
world**, verified on the receipt itself and not only on the argv.

**WALL CLOCK — CONFIRMED, and the design's estimate is ~4x too pessimistic.** run A was **762.3 s**
for 300 y x 4 s = **0.635 s/settlement-year**, against the 3.5 s/settlement-year estimate every
"~2.3 h" figure in the design rests on (§11.4 off-gate row, §14 E12, the register cell's own note).
The whole job — run A, byte-identical run B, the 5-year divergence run C, the worker isolate — took
**25 m 43 s**. *(Consequence, PLAUSIBLE not confirmed: the 12-settlement `research-lit` cell was
priced at ~7 h / ~17.6 h on the same estimate; the measured rate puts one traversal near ~1.3 h,
which would fit a hosted six-hour job and re-open owner row SOAK-1. Superlinearity in settlement
count is exactly what a 4-settlement datum cannot measure, and the register's own note warns that
two 30-year figures disagreed by 17.8x — so this is a question for the chair, not a finding.)*

**THE VERDICT — the runaway is CURED; the plateau is NOT DEMONSTRATED. CONFIRMED.**

`realm.runawayCount` **0**, `realm.flooredCount` **0**, `realm.unlawfulZeroCount` **0**,
`realm.bifurcated` **0** — the standing `population-runaway-300y` hazard does not reproduce under
the lit engine, and `PASS realm population bounded — 21844 → 12289 (×0.56; envelope 0.05–20)`.
**That half of §2.5 C4′ clause (4)'s prediction holds.**

But every settlement's shape is **`other`**, not `plateau`. The design predicted "`plateau` shapes,
`bifurcated` 0"; only the second half came true. The curve is a crash, a long trough, and a recovery
that has not finished at the horizon:

```
settlement      y1    y25    y50   y100   y150   y200   y250   y300
soak-a       15196   8065   6823   6840   8319   6576   8620  10869
soak-b        3457     58     58     91    202    562    606   1017
soak-c        1263    647    510    420    324    327    277    244
soak-d         585      0     24    189     38    187    270    159
REALM        20501   8770   7415   7540   8883   7652   9773  12289
last 50 y:  y250=9773 y260=10302 y270=10795 y280=11122 y290=11656 y300=12289   (+26 %)
```

`plateau` needs `|y300 − y200| ≤ 0.05 × y300`; the measured drift is **7.9x** that window for
soak-a, 8.9x soak-b, 6.8x soak-c, 3.5x soak-d. **300 years is not long enough for this fixture to
reach a steady state.**

**TRIPWIRE TRIPPED — 1 deterministic finding, with its tick and its figure:**

```
node scripts/soak/evaluate-receipt.mjs --aggregate …/research.json
TRUE_EXIT=1                       <- the run is NOT clean
  FINDING  research-lit-4s-300y-4s-seed1 · capacity_realm_load
           — realm load 0.4787 outside the plateau window [0.6, 1.05]
```

At the horizon year **300**: `realmDemography.loadRatio01 = 0.4787` (population **12,289** against
bound **25,674**, capacity 26,292, `realmPressure01` 0.4674). The row's second clause is SATISFIED
(`binding.granary 2 + walls 2 === settlements 4`), so it fired on the load window alone. The ladder
is healthy — `viable 4, failing 0, evacuating 0, remnant_occupied 0, remnant_empty 0`. This is an
**under-filled realm, not a dying one.**

Whether that is a MODEL fact (the lit term settles near half its bound at realm scale, against
§2.0's "fixed point at 76–83 % of the bound") or an INSTRUMENT fact (the window grades a steady
state and this reading was taken mid-recovery) is **not this lane's to rule** — it is CAP-7/the
tuning desk's. The measured tilt is toward the second: a realm still gaining 26 %/50 y has not
reached the state the window describes. **No dial was touched. THE PROMISE is intact.**

**⚠ A `TRUE_EXIT` correction, recorded because it nearly became a false green.** The first
evaluation was run as `… | tee file` and printed `TRUE_EXIT=0` — that was **`tee`'s** exit status,
not the tool's. Re-run with the exit captured in-shell before any pipe, the true status is
**`TRUE_EXIT=1`**, which is the documented "at least one deterministic row fired — the run is not
clean". Every exit in this receipt is captured before a pipe.

### ⛔⛔ M1-F1 — `capacity_plateau` AND `capacity_floor_thaw` CANNOT FIRE ON ANY REAL RECEIPT

**This is the most important finding in this receipt.** Both rows key on
`receipt.yearlyPopulations` / `receipt.yearlyDiedFlags` (`scripts/soak/tripwires.mjs:239, :243,
:276, :278`). **No written receipt carries either field.**

`whole-world-soak.mjs` builds both on the per-RUN object (`:389-390`, `:489-490`, `:548-560`) and
then writes a receipt (`:1068-1074`) carrying only `startPopulations`, `finalPopulations` and
`finalDiedFlags`. The per-year series survives only inside
`behavioral.yearly[].stateVectors[id].population` — a different name and a different shape.
Measured on the real receipt:

```
yearlyPopulations present? false      yearlyDiedFlags present? false
notExecutable: []                     <- and the receipt claims FULL instrumentation
```

Both detectors hit their `Array.isArray(…) ? … : []` guard, read a zero-length series, take the
`pops.length < 150` (resp. `< 100`) early return, and answer `[]` — **silently, and not as
NOT-EXECUTABLE**. Their zero is a WEAK ZERO of exactly the class `scripts/soak/evaluate.mjs`'s own
header names: *"A detector with no caller is not a guard — it is a guard-shaped file, and its zero
findings are a WEAK zero."*

**Proof the silence is false rather than a pass** — rebuild the two fields from `behavioral.yearly`
and feed the same receipt back to the same detectors:

```
capacity_plateau            -> [] (silent)          # as shipped
PATCHED capacity_plateau    -> FIRED:
  settlement 0 never plateaued: 8319 at year 149 against 10869 at year 299
  settlement 1 never plateaued:  202 at year 149 against  1017 at year 299
  settlement 2 never plateaued:  324 at year 149 against   244 at year 299
  settlement 3 never plateaued:   38 at year 149 against   159 at year 299
PATCHED capacity_floor_thaw -> [] (silent)          # correctly silent: nothing is frozen
```

**The plateau row would convict all four settlements if it could see the data.** The design's
"`plateau` shapes" prediction is therefore refuted **twice, independently** — by `settlementShapeOf`
(4x `other`) and by `capacity_plateau`'s own arithmetic.

**Why it was never caught.** `tests/soak-harness/tripwireRegistry.test.js:161` proves the row against
a hand-planted field on a synthetic receipt — `lit({ yearlyPopulations: years(201, …) })`. The
fixture is the only writer of that shape, so the row is green in the unit pin and blind in
production: the estate's own "a fixture can be the only writer of the SHAPE" hazard, live.

**And it is the same defect class C3 already caught once.** `capacity_envelope_30y` was REFUSED at
landing for keying on an absent field — commit `d02c5acde`, subject "…**and the row that would have
keyed on an absent field is refused**". Two sibling rows shipped with the identical defect and were
not checked the same way. **A structural cure is indicated, not three point fixes:** the check that
refused `capacity_envelope_30y` was a human reading, not an instrument, so nothing stops the next
row from keying on a field the receipt does not write.

**Consequence for the program — load-bearing.** §2.5 C5's signing proof reads *"the tier-2 LIT 300 y
receipt PASSES `realm population bounded` and **fires none of the four rows**."* Two of the three
built rows cannot fire on any receipt, so "fires none" is a weak zero — and the tuning signature
would cite it as evidence. **The 12 s terminal cell will carry the same hole** unless the receipt
writer ships the series or the rows are re-keyed onto `behavioral.yearly`. This lane changes no
product bytes and did not fix it.

---

## M2 — THE READING SUITE ms (CAPACITY C2's unsized item)  ✅ CONFIRMED

Raw file: `$SC/capacity/M2-reading-suite.md`.
Run solo under the exclusive mutex tier, 2026-09-06 23:58:05 → 23:58:11 EDT:

```
sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/demographicReading.test.js --reporter=verbose

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Duration  356ms (transform 152ms, setup 35ms, import 187ms, tests 12ms, environment 0ms)

real 5.80   user 1.42   sys 1.68
```

- **FIGURE: 356 ms** vitest file duration (12 ms of it assertion execution); **5.80 s** wall
  including node/vitest start and mutex acquisition.
- **LABEL: CONFIRMED** — executed, output quoted.
- **DIRECTION: report.** A cost reading with no bar in the design; it is now sized rather than named.
- **VERDICT:** the reading suite is a millisecond item on the gate. The design's `PLAUSIBLE`
  placeholder is discharged; there is no cost question here.

---

## M3 — THE ENVELOPE SUITE ≤ 60 s (CAPACITY C3's unsized item)  ✅ CONFIRMED

Raw files: `$SC/capacity/M3-envelope-suite.md`, `$SC/capacity/M3-arrival-figures.txt`.
Run solo under the exclusive mutex tier, 2026-09-06 23:58:16 → 23:58:22 EDT:

```
sh scripts/gate-mutex.sh --run -- npx vitest run tests/domain/demographicsEnvelope.test.js --reporter=verbose

 ✓ STATE MOTION …                                    1ms
 ✓ DIFFERENTIATION …                                 1ms
 ✓ NO FLOOR …                                        0ms
 ✓ THE ARRIVAL …                                     0ms
 ✓ THE THIRTY-YEAR WINDOW CANNOT SEE THE RUNAWAY …   192ms
 ✓ RESTORE: the real kernel is back …                195ms

 Test Files  1 passed (1)
      Tests  6 passed (6)
   Duration  1.14s (transform 269ms, setup 27ms, import 618ms, tests 391ms, environment 0ms)

real 5.71   user 2.52   sys 1.71
```

- **FIGURE: 1.14 s** vitest file duration (391 ms of it assertion execution); **5.71 s** wall.
- **LABEL: CONFIRMED** — executed, output quoted.
- **BAR: ≤ 60 s (§2.5 C3 STOP S1). MARGIN: 52.6× on the vitest duration, 10.5× on the wall figure.**
- **STOP S1: NOT TRIPPED.** The arms need no re-scoping; the design's PLAUSIBLE ≤ 60 s is confirmed
  with nearly two orders of magnitude of headroom.

### M3(b) — the ARRIVAL figures the green arms compute and discard

§2.5 C3 says the ARRIVAL arm "asserts sixty but **PRINTS** the measured arrival year as a FINDING
beside CAP-7". At HEAD it does not print: the figures live only in `expect(…)` **messages**, which
vitest renders only on failure, so on a green run they are computed and thrown away. This lane
re-derived them with a read-only probe (`$SC/capacity/arrival-probe.mjs`, outside the repo, zero
product bytes) that replicates `envelope()` verbatim — same fixture, same `envelope-seed-1`, same
52-tick year. **Deterministic: three runs, one md5 (`85f30e3c23569e42968d30988c8cc136`).** It agrees
with every quantity the suite *does* assert (`series.size` 6, `ratios.length` 6, `transitions` 180).

```
## THE ARRIVAL (the finding beside CAP-7)
  Cairnhold    year 1    (inside the 30-year campaign)
  Elderfen     year 12   (inside the 30-year campaign)
  Brackwater   year 27   (inside the 30-year campaign)
  Dunmarch     year 49   (AFTER the campaign a customer plays)
  Ashford      year 50   (AFTER the campaign a customer plays)
  Fallowmere   never reaches the filling band in 60 years
within30 = 3 of 6      within60 = 5 of 6      crowdingLines over 60 y = 8

## STATE MOTION (bar 0.05)      moved 170 of 180; share = 0.9444
## DIFFERENTIATION (bar 0.10)   spread = 0.4846
## NO FLOOR                     settlements unmoved over 30 years: none

## 60-YEAR OCCUPANCY (population / bound)
  Ashford      start   1200  y30   1770  y60   2508  bound   3240  y60/bound 0.7741
  Brackwater   start    320  y30    529  y60    586  bound    720  y60/bound 0.8139
  Cairnhold    start     40  y30     47  y60     42  bound     54  y60/bound 0.7778
  Dunmarch     start   7000  y30   9111  y60  11607  bound  15416  y60/bound 0.7529
  Elderfen     start    700  y30    950  y60    968  bound   1190  y60/bound 0.8134
  Fallowmere   start  30000  y30  35056  y60  40959  bound  62480  y60/bound 0.6556
```

**The design's CAP-7 finding is CONFIRMED and now has its number: only 3 of 6 settlements arrive
inside the 30-year campaign; 5 of 6 arrive inside 60.** Two of the realm's six (Dunmarch y49,
Ashford y50) arrive only after the campaign a customer plays, and one (Fallowmere) never does. That
is exactly the gap §2.5 C2 was built to cover with a STATE surface, and the measurement supports the
design's reasoning rather than refuting it. **CONFIRMED.**

Every settlement's 60-year occupancy sits in **0.6556 – 0.8139 of its own bound** — inside the
§2.0 "fixed point at 76–83 % of the bound" claim for five of six, with Fallowmere (metropolis,
0.6556) below it. That is a reading for the tuning desk, not a red: nothing here asserts the fixed
point, and this lane moves no dial.

### 🔴 FINDING M3-F1 — the envelope suite's "MEASURED AT THIS COMMIT" header is FALSE at HEAD

`tests/domain/demographicsEnvelope.test.js:19-23` states, verbatim, as a header comment written for a
future reader ("so a later reader knows what the bars are made of"):

> over thirty years on the shared realm the cured kernel moves **171 of 180** settlement-year
> transitions by at least a quarter percent (**0.95** against a bar of 0.05), spreads its growth
> ratios by **0.41** (against a bar of 0.10), leaves no settlement unmoved, and lands **Elderfen in
> the filling band in year 14**.

Measured at HEAD `4243bdc61`: **170** of 180 (share **0.9444**, i.e. 0.94), spread **0.4846**,
**Elderfen in year 12**. Three of the four figures are wrong; only "no settlement unmoved" holds.

**This is not drift — the code never changed.** Every file in the suite's reach is byte-identical
between the commit that wrote the header (`d02c5acde`, "CAPACITY C3: the cured model is MEASURED
inside the thirty years a customer plays…") and HEAD:

```
SAME  demographicsKernel.js   demographicsRates.js    demographicsResponses.js
SAME  demographicsHerald.js   demographicsMigration.js demographicsPlans.js
SAME  npcReplacement.js       advanceEpochLedger.js   formatNumber.js
SAME  src/kernel/prng.js      demographicsRealmFixture.js
SAME  tests/domain/demographicsEnvelope.test.js
```

(`git show <sha>:<path> | md5` both sides, twelve paths, all identical.) So the header's numbers
were **never true of the code they ship with** — they were measured against some draft state and not
re-measured before the commit landed. **CONFIRMED.**

**Severity: no red, real cost.** Every arm is green and the bars sit an order of magnitude below the
measurement, exactly as intended, so nothing gates on this. What it costs is the header's whole
purpose: a reader calibrating "what the bars are made of" gets three wrong numbers, and this is the
estate's own "a claim in a comment is a CLAIM until measured" class. **A one-comment correction is
owed and is NOT taken by this lane** (measurement lane; zero product bytes; and the file is a test,
so the chair may prefer to fold the fix into a car that is already touching it). The correct
replacement figures are the block quoted above.

---

## THE TRIPWIRE ROSTER (the pass/fail vocabulary), re-derived at HEAD — **CONFIRMED**

Enumerated by importing `scripts/soak/tripwires.mjs` at HEAD (not read off the design):

```
TRIPWIRE_IDS (11):
  throw_or_assert              class=deterministic
  non_finite_ledger_figure     class=deterministic
  population_collapse          class=deterministic
  negative_stock               class=deterministic
  unbounded_growth             class=deterministic
  liveness_floor               class=deterministic
  capacity_plateau             class=deterministic
  capacity_floor_thaw          class=deterministic
  capacity_realm_load          class=deterministic
  tick_duration_blowout        class=host-observability
  memory_watermark             class=host-observability
deterministic rows: 9        capacity_envelope_30y present? false
```

**The design's prediction is off by one, and the miss is DECLARED, not silent.** §2.5 C3 predicted
"`TRIPWIRE_IDS` 8 → 12, `deterministic.length` 6 → 10" from **four** capacity rows. HEAD carries
**11 / 9** and only **three** capacity rows: `capacity_envelope_30y` was never built. Its landing
commit says so in its own subject — `d02c5acde` "… **and the row that would have keyed on an absent
field is refused**" — which is §14 **E14** resolving against the design: the row needed
`behavioral.yearly[].motion.populationMoved/populationTransitions`, and SOAKCHAIN had confirmed only
`stateVectors[id].population`. **This is the correct outcome, correctly recorded; no act is owed.**
It is noted here because a later reader comparing the design's "8 → 12" to the live 11 would
otherwise re-find it as a defect.

The three capacity rows return `[]` unless `receipt.subsystems.rules.demographicsEnabled === true`
(§13 C8 rider), which this run's `--lighting demographicsEnabled=true` satisfies — so for M1 they are
executable rather than NOT-EXECUTABLE.

---

## THE REGISTER: THE DOOR, READ FIRST — and the act OWED to the chair

**The writer.** `scripts/soak/soak-register.mjs` is the only writer
(`tests/soak-harness/.soak-register.json` `_doc`: "Written ONLY by scripts/soak/soak-register.mjs
--write, on a CLEAN tree, from a receipt that passed with zero deterministic tripwire firings").

**The door, as code** — `mintRefusals` (`scripts/soak/register.mjs:340-353`) refuses unless
`passed === true`, `deterministicFirings === 0`, `rolling !== true`, `restored !== true`,
`fullInstrument === true`; plus `dirtyTreeRefusals` (clean tree, or `frozenAtSha` "would name a state
that never existed"), plus `SOAK_REGISTER_REFREEZE`/`SOAK_REGISTER_NOTE`. `deriveRegisterFigures`
**derives, it does not accept**: "Nothing here reads a figure a human typed."

**Consequence 1 — M2 and M3 CANNOT be register cells, by construction.** `deriveRegisterFigures`
reads only a soak receipt's own series (`behavioral.yearly[].stateVectors[id].population`,
`startPopulations`, `liveness`, `yearlyRealmBytes`, `runDurationsMs`). There is no cell shape for a
vitest wall-clock figure, and typing one in is precisely what the door forbids. **M2 and M3 are
receipt-only evidence. No register act is owed for them, and none should be invented.**

**Consequence 2 — M1's cell IS the shape the door admits**, and the identity matches the scaffolded
genesis cell exactly (verified above from the dry-run plan). The door would therefore admit the write
once the receipt lands clean.

**Consequence 3 — THE DOOR ITSELF REFUSES THIS RECEIPT. No judgment call remains.** The read-only
`--compare --propose` path was run (`TRUE_EXIT=0`, captured in-shell):

```
proposal: …/artifacts/soak-register.proposed.json
NOT-EXECUTABLE  research-lit-4s/research-lit-4s-300y-4s-seed1 — the cell is UNFROZEN genesis
  measured 24 figure(s); the FIRST clean run is the freeze act
```

and the proposal states the refusal in its own words:

```json
"mintRefusals": ["a deterministic-class tripwire fired — the run is not clean"]
```

`capacity_realm_load` fired, so `mintRefusals` (`scripts/soak/register.mjs:340-353`) forbids the
mint. **No `--write` is possible, and none was attempted.** The lane's earlier reservation about the
minting *seat* is now moot — the door refuses on the receipt's own merits, which is the stronger and
more honest answer.

**REGISTER ACT OWED TO THE CHAIR: NONE, and that is the finding.** The genesis cell stays UNFROZEN.
Freezing it needs a receipt with zero deterministic firings, and this one has one. The chair's real
choice is between three routes, none of which a measurement lane may take alone:

1. **Fix the model or accept the reading at the sitting** — `capacity_realm_load`'s window is the
   §2.0 fixed-point claim read at realm scale, and the measurement says the realm sits at 0.4787.
   That is a tuning-desk input (CAP-7), the owner's, signed last.
2. **Re-cut the row's window or its horizon** — if the fired row is grading a transient (the realm
   is still climbing 26 %/50 y at year 300), the row is measuring the wrong thing at this horizon.
   An instrument change, chair-gated.
3. **`SOAK-4`'s "accept the honest red"** — the register's `_doc` names this as *"the ONLY sanctioned
   use before the sitting"* of the governed growth door, requiring both `--charter=§NNN` and a
   `SOAK_REGISTER_NOTE` of ≥ 60 characters. That is a charter act and is explicitly not this lane's.

The full proposal, 24 derived figures, is preserved at
`$SC/capacity/artifacts/soak-register.proposed.json`. Whichever route the chair takes, **M1-F1 must
be resolved first**: two of the three capacity rows cannot fire, so a future clean run would be
clean partly because its detectors are blind.

---

## WHAT THE CHAIR IS OWED — the acts this lane found but may not take

| # | act | why it is not the lane's | severity |
|---|---|---|---|
| 1 | **M1-F1**: ship `yearlyPopulations`/`yearlyDiedFlags` on the receipt, or re-key `capacity_plateau` + `capacity_floor_thaw` onto `behavioral.yearly[].stateVectors` | product bytes in `scripts/audit/whole-world-soak.mjs` or `scripts/soak/tripwires.mjs`; and it changes what a signing proof means | **HIGH** — C5's "fires none of the four rows" is a weak zero until this lands |
| 2 | a **structural guard** so a tripwire row cannot key on a field no receipt writes (a walker over `TRIPWIRES[].detect` sources against the written receipt's key set) | new instrument; `structural-prevention` class, chair-scoped | **HIGH** — three rows, same defect, one caught by hand |
| 3 | **M3-F1**: correct the four figures in `demographicsEnvelope.test.js:19-23` to 170/180, 0.9444, 0.4846, Elderfen year 12 | product (test) bytes; better folded into a car already touching the file | LOW — no red, but the header misinforms by design |
| 4 | rule on `capacity_realm_load` 0.4787: model (CAP-7, owner) or window (instrument, chair) | tuning is the owner's, signed last; THE PROMISE | **decision** |
| 5 | re-open **SOAK-1** with the measured 0.635 s/settlement-year — the 12 s cell may now fit a hosted job | owner row; and the extrapolation is PLAUSIBLE only | **decision** |
| 6 | amend §2.5 C4′ clause (4): the interim receipt can be cited for `runawayCount 0` / `bifurcated 0`, **not** for "`plateau` shapes" | the design is the chair's | **MEDIUM** — a citation that would not survive reading |

## FILES WRITTEN (all outside the repo; the dock is untouched)
- `$SC/receipt-horizon-b6.md` (this file — the deliverable)
- `$SC/capacity/M1-figures.md` — M1's figures, verdict and both instrument findings
- `$SC/capacity/M1-plateau-chart.txt` — the plateau chart as numbers, term by term
- `$SC/capacity/M2-reading-suite.md` · `$SC/capacity/M3-envelope-suite.md`
- `$SC/capacity/M3-arrival-figures.txt` — the ARRIVAL/CAP-7 figures the green arms discard
- `$SC/capacity/arrival-probe.mjs` · `$SC/capacity/plateau-extract.mjs` — the two read-only probes
- `$SC/capacity/quiet-window.log` · `$SC/capacity/soak-300y.log` · `$SC/capacity/soak.pid`
- `$SC/capacity/tripwire-evaluation.txt` · `$SC/capacity/register-compare.txt`
- `$SC/capacity/DESIGN_HORIZON.snapshot.md`
- `$SC/capacity/artifacts/` — `research-plan.json`, `research.json`,
  `soak-register.proposed.json`, `research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json` (5.2 MB)

## FENCES — held
- **Zero product bytes.** Final check 2026-09-07 00:41:26 EDT: `git status --porcelain | wc -l` = **0**,
  `rev-parse HEAD` = `4243bdc610fe5b380f1d0029973cf9088bae1631` — the tracked tree is byte-identical to
  arrival. Nothing was committed; nothing was pushed; no `git stash` was used.
  `DEMOGRAPHIC_TUNING_SIGNATURE` still reads `{ signed: false, lit: null }` at `demographicsRates.js:375`,
  and `tests/soak-harness/.soak-register.json` is unmodified.
- **⚠ ONE ARRIVAL INVARIANT MOVED, and it is benign — stated rather than smoothed over.**
  `ls -A node_modules | wc -l` was **453** at arrival and is **455** at exit. The two new entries are
  `node_modules/.vite` and `node_modules/.vite-temp`, the Vite/Vitest transform caches created by the
  two focused vitest runs (M2, M3). Verified: `find node_modules -maxdepth 1 -type l | wc -l` = **453**
  — every originally symlinked package is still a symlink, none was materialised, `npm install` was
  never run, and `node_modules/` is gitignored (`.gitignore:1`), so git sees nothing. A successor
  re-running the arrival check on this dock will read 455 and should not treat it as a discrepancy.
- **No register `--write`.** Refused by the register's own door; only the read-only
  `--compare --propose` path ran.
- **No tuning value moved.** No dial, no band, no fixture number.
- **Nothing signed, nothing flipped.** `DEMOGRAPHIC_TUNING_SIGNATURE` is untouched at
  `{ signed: false, lit: null }`.
- Both probes live outside the repo and import the dock read-only.
- **The gate slot is handed back.** 00:42:07 EDT: `/tmp/settlementforge-vitest-gate.502.lock` is gone,
  `sh scripts/gate-mutex.sh` exits **0** with *"gate-mutex: FREE — no held lock or Vitest runner
  outside this process's ancestry"*, and `pgrep` finds no `realm-scale-certification`,
  `whole-world-soak` or `vitest` process. The chair may start a gate immediately. The ~2.3 h
  exclusive-hold hazard flagged at launch never materialised — the hold lasted 25 m 43 s.

## RETROVALIDATION ROW

**HORIZON-B6 · Opus 5 (Fable-unvalidated) · 2026-09-06 23:54:36 → 2026-09-07 00:38 EDT · dock
`$SC/laneB6` @ `4243bdc61`, clean at entry and exit · ZERO product bytes.** Three measurements owed,
**three delivered, all CONFIRMED by executed proof with output quoted**: M1 the 300-year lit receipt
(`TRUE_EXIT=0`, 25 m 43 s — **not ~2.3 h**; runaway CURED, `runawayCount`/`bifurcated` 0; **plateau
NOT demonstrated**, shapes `other` x4, drift 3.5–8.9x the window; **one deterministic tripwire fired**,
`capacity_realm_load` 0.4787 at year 300, `evaluate-receipt` `TRUE_EXIT=1`); M2 the reading suite
**356 ms**; M3 the envelope suite **1.14 s against a 60 s bar**, STOP S1 not tripped, plus the CAP-7
arrival figures (**3 of 6 settlements arrive inside a 30-year campaign, 5 of 6 inside 60**), which
confirm the design's reasoning for C2's state surface. **Register act: NONE — the door refuses**
(`mintRefusals: deterministic-class tripwire fired`); the 24-figure proposal is preserved for the
chair. **Three findings raised, none fixed by this lane:** M1-F1 (`capacity_plateau` and
`capacity_floor_thaw` key on `yearlyPopulations`/`yearlyDiedFlags`, which **no written receipt
carries** — proven false-green by patching the series in and watching the row convict all four
settlements; same class as the `capacity_envelope_30y` row C3 refused; **it makes C5's "fires none of
the four rows" a weak zero**), the roster delta (11/9 rows live against the design's predicted 12/10,
declared in `d02c5acde`'s own subject — no act owed), and M3-F1 (the envelope suite's "MEASURED AT
THIS COMMIT" header at `:19-23` is false at HEAD — 171/0.95/0.41/year-14 against a measured
170/0.9444/0.4846/year-12, with all twelve files in the reach proven byte-identical since the header
was written, so it was never true). One near-miss corrected in flight: a `TRUE_EXIT` read through a
`tee` pipe reported `0` for a tool that had exited `1`; every exit here is captured before a pipe.
The quiet-window law needed fourteen samples to yield three consecutive clean minutes, and the
excursions were macOS `build_hd_index`, not any lane. **STATUS: COMPLETE.**
