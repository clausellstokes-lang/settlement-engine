# RECEIPT — LANE HORIZON-B6 (the three CAPACITY evidence measurements)

STATUS: PARTIAL (in flight — M1's 300-year soak is running; M2 and M3 are COMPLETE)

Seat: Opus 5 — Fable-unvalidated · Chair: Fable 5.1 (session 405b5e7e) · Lane: HORIZON-B6
Dock: `$SC/laneB6` (detached, never the shared tree). Product bytes changed: **ZERO**.

---

## ARRIVAL CHECK — 2026-09-06 23:54:36 EDT (`date`)
1. `git -C $SC/laneB6 rev-parse HEAD` = `4243bdc610fe5b380f1d0029973cf9088bae1631` — MATCHES. **PASS**
2. `git -C $SC/laneB6 status --porcelain | wc -l` = `0` — clean. **PASS**
3. `ls -A $SC/laneB6/node_modules | wc -l` = `453` — **PASS**

No discrepancy; the lane proceeded.

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

## M1 — THE ~2.3 h PLATEAU RECEIPT (the 300-year lit curve)  ⏳ IN FLIGHT

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

**Nothing is claimed for M1 yet.** Figures, shapes, tripwires and the register verdict are written
below only once `TRUE_EXIT` is in the log.

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

**JUDGMENT (HORIZON-B6), recorded vetoably — the lane does NOT run `--write`.** Three reasons, in
order of weight: (1) the register's own `_doc` names the minting seat — "CI NEVER WRITES THIS FILE …
**the chair mints it on a clean tree**" — and this lane is not the chair; (2) this is the **genesis
freeze act**, not a re-freeze: `cellIsFrozen` is false for both cells, and the design says the cell's
`frozenAtSha` + `identity.lighting` becomes "the citation the future tuning signature carries", which
puts it adjacent to the owner-gated signature rather than inside a measurement lane's grant; (3) the
brief's fence reads "No register `--write` unless the register's door admits a measurement cell by
design" — the door admits the *shape*, but the `_doc` withholds the *seat*, and the brief's own
fallback ("otherwise write the receipt and hand the cell to the chair as a register act") is the
narrower, reversible choice. **Veto shape:** if the chair rules the lane may mint, the exact command
is below and needs only a seat string and a note.

**REGISTER ACT OWED TO THE CHAIR** (to be filled with the measured cell once M1 lands; the proposal
JSON will be written to `$SC/capacity/artifacts/soak-register.proposed.json` by the read-only
`--compare --propose` path, which this lane WILL run):

```
cell key : research-lit-4s/research-lit-4s-300y-4s-seed1
frozenAtSha : 4243bdc610fe5b380f1d0029973cf9088bae1631
identity : { seed: "realm-scale-research-lit-4s-300y-4s-seed1", years: 300, settlements: 4,
             lighting: { demographicsEnabled: true } }
figures : DERIVED by scripts/soak/register.mjs from the receipt — never typed
command : SOAK_REGISTER_REFREEZE='<chair seat>' SOAK_REGISTER_NOTE='<why, ≥60 chars>' \
          node scripts/soak/soak-register.mjs --write --receipt <case receipt> --solo
note    : `--write` EXITS NON-ZERO BY DESIGN; the evidence is the next plain `--compare`.
```

---

## FILES WRITTEN (all outside the repo; the dock is untouched)
- `$SC/receipt-horizon-b6.md` (this file)
- `$SC/capacity/quiet-window.log`
- `$SC/capacity/M2-reading-suite.md`
- `$SC/capacity/M3-envelope-suite.md`
- `$SC/capacity/M3-arrival-figures.txt`
- `$SC/capacity/arrival-probe.mjs`
- `$SC/capacity/DESIGN_HORIZON.snapshot.md`
- `$SC/capacity/soak-300y.log`, `$SC/capacity/soak.pid`
- `$SC/capacity/artifacts/research-plan.json` (+ `research.json` and the `.cases/` dir when M1 lands)

## RETROVALIDATION ROW
(written at STATUS: COMPLETE)
