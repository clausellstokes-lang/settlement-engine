# `lprobe/` — the L-PROBE dark-arm battery (`LGT-C0-PROBE`, PLAN §6 POSITION 1)

Built by lane **L-PROBE-KIT** (Opus 5) under a Fable 5.1 chair, 2026-09-05.
**Zero product bytes. Zero commits. Nothing here writes into any tree it measures.**

The chair executes this battery **after the PROSE consist lands** — the control must be
measured on the tree the wave will actually light from. 113 of prose's 200 paths are
`src/domain/` modules outside `display/` that emit text; if the dark arm is taken before
prose lands, prose's own text movement is later mis-attributed to lighting.

---

## Quick start

```sh
# The cheap pass — minutes, no vitest, no soak, no build.
# Settles (c) (d) (e) (f) (g) and half the STOP.
sh run.sh <tree> <outdir> --cheap

# The full battery. --base-ref is the sha the wave boarded from.
sh run.sh <tree> <outdir> --base-ref <PRE-WAVE-SHA> --base <PRE-WAVE-TREE> --soak-years 30

# Everything, touching nothing, printing every command it would issue:
sh run.sh <tree> <outdir> --dry
```

`--dry` runs every helper with the helper's own `--dry`, so the printed plan is the
**helpers' own statement** rather than a second account free to drift from them.

---

## The eight outputs

| # | output | helper | file it writes |
|---|---|---|---|
| **a** | `generatorGoldenMaster` 3/3 + 0/525, and the bit-level dark arm | `golden-control.sh` | `a-goldenMaster.log`, `a-dormancy.tip.tsv`, `a-dormancy.tip.summary.txt`, and with `--base`: `a-dormancy.base.tsv`, `a-dormancy.diff.txt` |
| **b** | a certification receipt per preset | `certify.sh` + `preset-seam.mjs` | `b-receipt.<id>.json`, `b-certification.<id>.json`, `seam/preset-seam-report.json`, `seam/seam-ok.<id>`, `b-seam.log` |
| **c** | the OSR per-parent presence dump, **before any regeneration** | `presence-dump.mjs` | `c-presence-dump.json` |
| **d** | the lighting-census tuple | `census-probe.mjs` | `d-lighting-census.json` |
| **e** | the stability rosters | `rosters.mjs` | `e-stability-rosters.json` |
| **f** | a REAL-birth new-campaign fixture per preset | `birth-fixtures.mjs` | `f-birth-fixtures.json` |
| **g** | the 52-tick pulse hashes per preset | `pulse-hashes.mjs` | `g-pulse-hashes.json` |
| **h** | the class-C hashed-chunk LISTING diff | `listing.sh` + `closure-measure.mjs` | `h-listing.base.json`, `h-listing.tip.json` |
| — | **STOP arm 1**: does the preset catalog measure EAGER? | `eager-probe.mjs` | `stop-eager.json` |

Every step's exact child status lands in `TRUE_EXITS.txt` (and `TRUE_EXITS.certify.txt`,
`TRUE_EXITS.golden.txt`, `TRUE_EXITS.listing.base.txt`, `TRUE_EXITS.listing.tip.txt` for the
sub-scripts, which own their own files so a child can never truncate the parent's receipts).

### Supporting files

| file | what it is |
|---|---|
| `_lib.sh` | the shared law: `step` (exit capture), `quiet_window`, `mutexed`, `farm_make`, `expect_file` |
| `env-shim.mjs` + `env-shim-hooks.mjs` | the `node --import` loader that lets a plain node process import the **store** layer |
| `closure-measure.mjs` | the measuring half of (h): the listing, the entry static closure, the margin, the diff |
| `preset-seam.mjs` | asks whether a `--preset P` soak is a **REAL BIRTH of P** — composed `fullRules` vs the fixture's resolved rules, both directions, keys + values + key order, plus the normalizer fixed point. Writes the marker files `certify.sh`'s roster is built from |
| `preset-overlay.mjs` | ⛔ **SUPERSEDED 2026-09-05, refuses to run (exit 2).** It measured the leak of the `--rules-json` overlay seam, which DOCKET item 7's `--preset` retired. Its historical figures are preserved in its header |

---

## The two STOP conditions

PLAN §6 POSITION 1: *"the preset catalog measures eager, **or** any listing diff exceeds
`(margin − 100 B)` ⇒ the wave halts and `LGT-O-CLOSURE`'s two-option re-ask goes to the desk
**with figures**."*

**Arm 1 — EAGER.** `eager-probe.mjs`. Verdict from
`sourceStaticClosure('src/main.jsx') ∋ src/domain/worldPulse/simulationRules.js`.
Exits **1** when the catalog is eager. ⭐ **This needs no build** — see the correction below.

**Arm 2 — the listing diff.** `listing.sh --against`. Exits **1** when
`closureBytes(tip) − closureBytes(base) > marginBytes(base) − 100`.
`marginBytes = CLOSURE_BUDGET_BYTES − closureBytes`, and `CLOSURE_BUDGET_BYTES` is **read out
of `tests/build/vendorPdfLazy.test.js` at run time**, never carried as a copy: PLAN §8's
standing order is that every published closure figure is at least six landings stale and
none may be quoted.

---

## Four corrections to the brief and the plan — measured, not argued

1. **The sealed plan is at `refs/preserve/light-plan-2026-09-05:lightingwave/PLAN.md`**, not
   `:PLAN.md`. The ref's root tree holds exactly one entry, `lightingwave`.
2. **The OSR presence logic is in `scripts/lib/observed-shape-corpus.mjs`, not
   `scripts/check-observed-shape-readers.mjs`.** `presenceOf` `:434`, `SCHEMA_PRESENCE` `:115`,
   `schemaKeys` `:462`. The chair's line numbers were right; the file was wrong.
3. **`scripts/.size-baseline.json` is not the listing margin.** It is an eslint `max-lines`
   ratchet whose test measures effective LINE COUNTS of `src/**` with eslint's own `Linter`;
   `npm run build` cannot move a number in it. PLAN §8's "Size baseline … measuring act: the
   build" row is wrong on the mechanism. The real margin is `CLOSURE_BUDGET_BYTES = 1_048_000`
   at `tests/build/vendorPdfLazy.test.js:565`, over the entry's transitive **static import
   closure**, gated on `VERIFY_DIST=1`.
4. **⭐ Half of the STOP needs no build.** `tests/build/campaignRuntimeLazy.test.js:145`
   already pins the catalog as absent from the source closure, and every helper it needs sits
   in that file's pure region (first column-0 `describe(` at `:129`). The chair can take the
   eagerness reading before PROSE even lands, and re-take it free after every lighting car.

---

## Two things the tree cannot currently do — and what that costs

### ✅ (b) WAS a STOP for six of the seven presets — the cure landed, and the check changed shape

**The historical STOP.** `whole-world-soak.mjs` hardwired
`SIMULATION_RULE_PRESETS.full_simulation.rules`, so the only seam to another preset was
`--rules-json`, spread LAST by `composeSoakRules` and able to override `full_simulation`
**key for key — but only for keys the overlay names.** `preset-overlay.mjs` measured the leak:

```
full_simulation      0 leaked keys   -> a CLEAN receipt was producible
dramatic_campaign   14 · living_realm 15
quiet_local 33 · realistic_regional 33 · narrative_campaign 33 · static_campaign 34
```

**The cure landed as DOCKET item 7** (§899, car `2200db6f3`): the soak takes `--preset <id>`
as the **composition base**, which REPLACES full_simulation instead of overlaying it, and
`--preset` with `--rules-json` is REFUSED upstream. So all seven presets are certifiable.

**But the new seam has its own failure mode, and `preset-seam.mjs` is what guards it.**
`composeSoakRules` is `{ ...preset, ...seasonsOverride, ...overlay }` — it **does not
normalize**, while a real birth resolves through `prepareRulesUpdate` →
`normalizeSimulationRules`. Measured at `38474a59e`, the two agree for exactly one reason:

> ⭐ **the normalizer is a FIXED POINT on every shipped preset table.** `preset(id, label,
> overrides)` builds `rules` as `{ ...DEFAULT_SIMULATION_RULES, presetId, ...overrides }`
> (`simulationRules.js:501`), so each table is already **total** over the 36 default keys —
> it is **not** the "sparse override table" this kit's older headers called it (keys missing
> from DEFAULT: **0**, all seven) — and no shipped override needs a coercion or trips the
> faithSpread↔religionDynamics lockstep.

That is a **measured property of today's tables, not a guarantee.** The day a preset override
needs the normalizer, the soak would certify a world no birth produces. `preset-seam.mjs`
compares composed `fullRules` against the real birth in **both directions**, on keys, values
and **key order**, and asserts `norm(table) === table` — and `certify.sh` iterates only the
marker files it writes, so a broken seam cannot be certified by accident. After each soak,
`certify.sh` additionally reads `subsystems.presetId` and
`subsystems.stateKeys.simulationRules.finalEntries` back out of the receipt, so the tie is to
the world that ran, not only to a pure function.

**The cure this kit still refuses to take:** padding either side to make them match. A preset
that does not carry a key does not describe a world in which that key has a value.

### ⚠ (c) reports `requiredKeys`, not `schemaKeys`, in its default mode

The corpus's presence test is
`presenceOf(key) = frequencies.get(key) / sets.length` and
`schemaKeys = keys.filter(k => presenceOf(k) >= 0.8)`. `frequencies` and `sets` are **closure
state** inside `planDynamicCollapse` and are not exported. What is exported per parent is
`keys` and `requiredKeys`, and `requiredKeys` is exactly the `presence == 1.0` subset — so it
is a **measured lower bound** on `schemaKeys`, and the dump says so rather than printing a
computed figure the instrument does not expose. `corpus.shapes.*.rows` — which is what the
`MIN_ROWS = 40` cause read actually needs — is exported exactly.

`--mode exact` measures the true fractions by splicing ONE line into a **farm copy** of the
corpus module and printing the splice. The anchor must match exactly once or the arm refuses;
**it never falls back to the exported arm**, because a silently substituted instrument is how
a stale copy gets reported as a fresh measurement.

---

## The laws this kit enforces rather than remembers

* **The measured tree receives no writes.** Anything needing a file beside product code runs
  in a **farm**: `tests/` copied (walkers Dirent-type-check and do not follow symlinks),
  every other top-level entry symlinked. Builds happen in a `git archive` extraction outside
  the tree entirely.
* **⛔ `node_modules` is symlinked whole, never materialised.** Measured both directions: a
  dock with real package copies grew first paint **8,551 B past budget** and failed a gate
  that had nothing wrong with it. Never `npm install` here.
* **Every exit is captured in-shell** to a `TRUE_EXIT_<step>=` line. A task notification is
  not a receipt — one reported "exit code 0" over a red suite three times in one day.
* **The quiet-window law** gates every vitest and every build: three consecutive 60-second
  probes, each showing load-1 < 4.0 and **zero** live `vitest`/`dist/workers` processes.
  Under load, DOOR 3 times out and reds code that is fine.
* **The gate mutex** wraps every vitest. A targeted run that skipped it has returned a
  sibling's workers as SKIPS and read green. ⛔ Mutex give-up **exit 3 is NOT-RUN**, never green.
* **No fallback branch prints a finding.** Every refusal in this kit says what it measured and
  exits non-zero; none of them says "clean" because something did not run.
* **No register door is ever opened** — no `--update`, `--write`, `--genesis`, `--rebank`, no
  `LIGHTING_CENSUS_REFREEZE`, no `UPDATE_VOICE_BASELINE`. Every register act at the landing is
  the chair's, and the census refreeze **exits non-zero by design**: the proof is a plain
  re-run afterwards.
* **Every JSON output is read back** and checked against the digest it was written with. Never
  let a success message be a separate statement from the thing that succeeded.
* **Anti-vacuity everywhere.** An empty preset roster, an empty asset listing, an empty source
  closure, a short dormancy corpus, a roster that parsed to nothing — each is a REFUSAL, because
  a measurement over nothing diffs clean against anything.

---

## Cost

| step | cost |
|---|---|
| eager STOP, (d), (e) | seconds |
| (f) | ~2 s for all seven presets |
| (g) | ~1.1 s per preset at `--settlements 2`; scales with settlements |
| (c) | the real corpus: 4 seeds × 4 configs generation + 12 pulse intervals |
| (a) | one vitest property suite + 600 full generations per tree |
| (b) | one soak per seam-holding preset = `--soak-years` × `--settlements`, three runs each (A, B, C). Measured at 5 y × 4 settlements: see `WALL_SECONDS_soak_<id>` in `TRUE_EXITS.certify.txt`, which `certify.sh` records per preset |
| (h) | two full `npm run build`s |

`--cheap` is the right first pass: it is minutes, it settles five of the eight outputs plus
half the STOP, and none of it needs the gate.
