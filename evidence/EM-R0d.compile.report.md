# EM-R0d — COMPILE REPORT, VERSION 2 (the chair's rulings applied; tip `e5bdfd031`)

## Verdict

**DRAFT — READY-able. No open question remains that blocks dispatch.** Version 1's two STOPs are closed by
the chair's rulings; the packet lost a file, gained a table, and every register the brief's newest steps
name is now **executed rather than predicted**.

`git -C $SP/read-tip-e5bdfd031 rev-parse --short HEAD` → `e5bdfd031`; `git status --short` EMPTY at start
and end. `git diff --stat ad7ddf2c9 e5bdfd031 -- src/generators src/data` **EMPTY**, so every version 1
measurement holds. Preamble SHA-256 re-verified unchanged. Nothing edited, staged or committed anywhere;
no vitest, eslint, npm script or build; plain `node` on scratch scripts, one process at a time, absolute
paths throughout.

## Files
```
$SP/lane-em-compile-EM-R0d-scratch/
  EM-R0d.md · EM-R0d.manifest.json · EM-R0d.evidence.md · EM-R0d.compile.report.md      version 2
  EM-R0d.v1.md · EM-R0d.v1.manifest.json · EM-R0d.v1.evidence.md · EM-R0d.v1.compile.report.md
  r0d-placement.v2.mjs · r0d-bytes.v2.mjs · probe2/lighting.probe.mjs · bytes2/          the v2 probes
```
Version 2's evidence keeps every version 1 D-row verbatim under a revalidation preface and adds E-0…E-9.

## What changed from version 1

| | v1 | v2 |
|---|---|---|
| addresses | `src/data/bandLadders.js` **+** a `src/domain/bandLadders.js` re-export | ⭐ **ONE file.** Ruling 2 — the re-export is gone |
| handwritten files | 10 | **9** |
| the leaf's tables | 3 ladders | ⭐ **4** — the food FLAG ladder joins as its own named table with `foodSecurityFlagsOf` |
| worker estimate | +1,657 B | **+1,801 B** (flag table +182 B; producers shed 38 B more) — inside the chair's named 3,314 B bound, 1,513 B of room |
| lazy engine | −678 B | **−716 B** |
| STOP-1 (tuples vs named table) | open question | ✅ **CLOSED** by ruling 1 — named frozen table; tuples pinned as a forbidden alternative |
| STOP-2 (the rounding trap) | open question | ✅ **CLOSED** — the charter gives EM-R0b v2 the rule; the leaf's header states the unrounded comparison |
| lighting delta | predicted | ⭐ **MEASURED** by the walker's own `classify` (E-4) |
| wiring census | not checked | ⭐ **MEASURED** — no producer is stamped (E-5) |
| `prosperityMod` | noticed | ⭐ **MEASURED and answered** (E-3) |
| Q5 (what could move the ceiling file) | flagged | ⭐ **ANSWERED — nothing queued** (E-7) |

## Re-measured placement, WITHOUT the re-export (E-1)

| placement | `ENGINE_SHARED_DOMAIN` | `EAGER_FIRST_PAINT_MODULES` | worker static closure |
|---|---:|---:|---:|
| BASE | 68 | 283 | 220 |
| ⭐ **v2 — ONE leaf in `src/data/`, no re-export** | **68 (+0)** | **283 (+0)** | 221 (+1) |
| ⭐ **v2 + EM-R0b v2's `src/domain/edit/` reader in the graph** | **68 (+0)** | **283 (+0)** | **221 (+1)** |
| ⛔ a generator importing a `src/domain` band address | 69 (+1) | 285 (+2) | 222 (+2) |

**The chair's ruling 2 costs exactly nothing, and the measurement proves the second address was never
load-bearing:** a `src/domain/edit/**` reader of the `src/data` leaf moves neither budgeted graph by a
single module, because `computeEngineSharedDomain()` seeds only from `src/generators` imports of
`src/domain` — and this packet now puts no file under `src/domain` at all.

## Re-measured bytes (E-2)

```
  src/generators/factionDynamics.js        12368 ->   12249  (-119)
  src/generators/defenseGenerator.js        8324 ->    7964  (-360)
  src/generators/foodGenerator.js           7858 ->    7621  (-237)
  src/data/bandLadders.js (NEW)              new ->    2517  (+2517)
  GENERATION-WORKER estimated delta = -716 + 2517 = +1801 B
```

| budget | v2 | headroom |
|---|---|---|
| ⭐ generation worker (`= 1401208`) | **+1,801 B estimated**, bound **3,314 B** — the figure the chair named before the price was spent, kept rather than re-raised | ZERO slack; a re-mint under the standing conditional ruling + ruling 1 |
| lazy `engine` (`< 679_000`) | predicted **−716 B, a SHRINK** (`vite.config.js:862` routes `src/generators/**` to `engine`; `:885` routes `src/data/**` elsewhere) | READ and quoted, never edited |
| `data-lazy` (`3_098_110`) | +~2,517 B over EM-P3's measured ~939,520 | ~2.16 MB |
| eager first paint | **byte-identical**, 283 modules, ESD 68 | untouched |
| edge-shared | no bundle moves | n/a |

EM-P3's precedent (estimate +206 B → real +80 B, 0.39×) puts the likely real figure near +700 B. The
build lane re-mints inside the bound with per-module attribution showing only this packet's four modules;
the chair records the measured figure as a named, vetoable rise in the ODQ §934.19 family.

## The leaf's final shape — FOUR named tables, four total functions, one file

`LEGITIMACY_CUTS` + `LEGITIMACY_BANDS` + `legitimacyBandOf` · `READINESS_CUTS` + `READINESS_BANDS` +
`readinessBandOf` · `FOOD_SECURITY_CUTS` + `FOOD_SECURITY_BANDS` + `foodSecurityBandOf` ·
⭐ `FOOD_FLAG_CUTS` + `foodSecurityFlagsOf`.

Four header sentences the coding instruction requires: **(1)** this is the only address and why (the
measured 283 → 285); **(2)** the numbers are the ones the generator compares, UNROUNDED, because the
record publishes `deficitPct`/`surplusPct` rounded and the label was cut from the raw values; **(3)** the
label ladder and the flag ladder are **two ladders on purpose today** — the flag cuts deficit at 20 where
the label cuts at 15, so `deficitPct ∈ (15, 20]` carries `Import-Dependent` beside `isPressured`, and the
owner has been asked whether to unify them (ODQ §934.57's family) — **this packet reconciles nothing**;
**(4)** `Vulnerable` and `Contested` are homonyms of other ladders' bands, not duplicates.

`FOOD_FLAG_CUTS.pressured` and `.surplus` **reference** `FOOD_SECURITY_CUTS` rather than re-spelling `5`
and `40` (the two ladders genuinely share those cuts); only `deficit: 20` is the flags' own.

**`prosperityMod` — measured, and it does NOT belong in the leaf (E-3).** Its outer chain cuts the same
three inputs (40 / 20 / 8 on `deficitPct`, 40 on `surplusPct`, famine first), but each rung's OUTCOME is
chosen by four further conditions (`_terrainStructural`, `_magicFoodMitigated`, `activeChainsCount >= 3`,
three granary flags) and what it returns is a prosperity modifier, not a band. **Same inputs, different
quantity — so it does not move**, and A7 asserts it is still present and untouched so a later lane cannot
quietly harvest its numbers.

## The brief's newest steps, executed

* **Step 14(a) — a generator among `checks` goes LAST.** ⭐ **There is no generator**: all five `checks`
  rows are `npx vitest run`, so the rule has nothing to order. The goldens are placed last anyway.
* **Step 14(b) — a title counts only in a CREDITED file.** Run with the walker's OWN
  `parkReasonsFor`/`classify` (a verbatim copy of `sovereigntyLightingContract.walker.test.js` with the
  vitest import replaced by no-ops, specifiers absolutised and `ROOT` pinned):
  `generalStateProseDesk.test.js` **CREDITED**, 70 titles · `compendiumFoodSecurity.test.jsx`
  **CREDITED**, 3 · `compendiumPower.test.jsx` **CREDITED**, 3. And this packet's own new file, classified
  **before it is written**: `reasons: [] → CREDITED`, `titles 8`, `suiteTitles 1`. So
  `files +1 · credited +1 · parked +0 · titles +8 · suiteTitles +1` is a measurement, and the cures'
  `titles +0` is a measurement too. The coding instruction and STOP-8 carry the EM-B1e cause forward:
  **never bind `it`, `test` or `describe` a second time, not even as a parameter.**
* **Step 15 — stamped files.** `docs/content/wiring-census.json`'s `stamp.files` holds SEVEN entries, all
  `src/domain/display/stateProse/**`; **none of the three producers is stamped**, and neither
  `candidateLeaves` nor `producerIndexFiles` names one. **Not a change-manifest row; no re-take owed** —
  EM-P3's `stale-bytes` red cannot repeat here.
* **`acceptanceCases` shape.** Read from the validator (`:856-865`): each row must be an OBJECT with a
  non-empty unique `id` and a non-empty `case`, at most 8. This packet's eight rows are and always were
  objects — it is not one of the two siblings that failed on bare strings. Re-verified after the rewrite.
* **Step 13 — line-addressed baselines.** None of the three modified producers carries a prose-numerics
  row among the register's 218 `{path, line, category, snippet}` entries: a clean negative.

## requiredSymbols (9) and the post-edit simulation

All nine resolve VERBATIM `1x` at `e5bdfd031` and **every one survives this packet's own edits**:
`legitimacyBandFor` · `DEFENSE_CONTRIB` · the `computeDefenseReadiness` declaration line ·
`generateFoodSecurity` · `readinessLabels()` and `foodLabels()` (names kept, bodies cured) · `mustExtract`
(helper untouched; two call sites move) · `WORKER_BUNDLE_CEILING_BYTES` (the re-mint changes the value,
not the declaration) · `BASELINE_EDGES` (read, never edited).

**`retiredSymbols`: EMPTY** — no exported symbol moves. ⛔ The simulation's real finding stands from
version 1: **`requiredSymbols` cannot see this packet's true retirements** — four SOURCE-TEXT anchors in
three test files — which is why each is a declared TEST row with an exact cure (ruling 3). Discharges:
**GV-1** on `mustExtract` (file untouched), **EM-P3** on `WORKER_BUNDLE_CEILING_BYTES` (the declaration
text survives the re-mint). No `retiredSymbols` row anywhere touches this packet's paths.

## Q5, answered by measurement (E-7)

The manifest has 190 entries and **one non-LANDED: EM-B3c (READY)**, whose eight rows are a security
test, a migration, an ops script, a test, a register row and three docs — **none of this packet's paths
and nothing in the generation worker's closure**. **No waiting packet in the chair's kit carries a
`tests/build/generationWorkerLazy.test.js` row except EM-R0d itself.** So the only thing that could move
the ceiling file before promotion is **another packet's own ceiling re-mint, and none is queued** — which
matches the chair's named exclusions (EM-P2 version 4 and the tooling work). If one appears, the substrate
check refuses rather than landing on a moved ceiling.

## Noticed-not-touched, each with the chair's fate recorded in the packet

1. The legitimacy ladder's two play-time copies → **EM-R0e** (after this packet, ~484 B back, measured
   against the pulse goldens).
2. The Compendium's hand-spelled cuts and its missing overall-readiness rungs → **FIX-C1** (a parallel
   lane after this lands; the threshold prose generated from the leaf).
3. `rulingStructure.js:733-744` assigning five readiness labels with no score → handed to **EM-R0b v2** as
   a measurement (which producer's label lands on `defenseProfile.readiness.label`).
4. The food flag/label/`prosperityMod` disagreement → **the owner's decision point** (ODQ §934.57), with
   **A4 as the pin** that makes a quiet fold red first.
5. `Vulnerable` / `Contested` as two ladders' words → **CLOSED**, named in the leaf's header.
6. ⭐ **New in version 2:** `prosperityMod` is a chooser, not a ladder (E-3) — measured, left in place,
   asserted untouched by A7.
7. The rounding trap → **RULED for EM-R0b v2** by the charter; the leaf exports the unrounded comparison
   and says so.

## Questions that remain

**None that block dispatch.** Three things are the chair's to note rather than answer:

1. **The bound.** The brief's rule (estimate ×2) would make it 3,602 B now that the flag table took the
   estimate to +1,801 B. **I kept the chair's already-named 3,314 B**, which still covers it with 1,513 B
   of room, rather than raising a bound the chair set before the price was spent. One line of §7 reverses
   that if the chair prefers the mechanical rule.
2. **The flag ladder's home.** I put it in the same leaf as a second named table rather than a second
   file — same inputs, same producer, and a second file would cost another module in a zero-slack worker.
   Vetoable in one row.
3. **A4 is a new kind of arm.** It PINS a known product disagreement so the owner's eventual ODQ §934.57
   ruling has to pass through a named red. If the chair would rather the pin live with the owner's
   decision than in this packet's acceptance matrix, it is one row and one `it`.
