# TOOL-13b — receipt: the erasure guard built and proved; commits 1–3 refuted by execution

**Lane:** TOOL-13b, Opus BUILD. **Chair:** Fable 5.1, session a9df403c.
**Stamps (from `date`, in the same call as every run):** 2026-09-20 08:28 → 08:42 EDT.
**Worktree:** `$SP/lane-tool-13b`, branch `tool-13b-2026-09-20`, base `c33446830`
(the fifth lighting refreeze). **`node_modules`** symlinked to `$SP/slot-2/node_modules`.
All apparatus in `$SP/lane-tool-13b-scratch/`. TOOL-13's scratch was read-only; the three
instruments reused (`dump-corpus.mjs`, `proto-detector.mjs`, `proto-run.mjs`) were COPIED in.

**Outcome, first:** one of the four commits survives measurement. Commits 1, 2 and 3 are
REFUTED by execution — see `TOOL-13b.STOP.md`, with both probes quoted — and the chair has
since ruled them **FOLDED into TOOL-13a's schema-23 rung** as bundle members (§1.1 below
carries the exact refusal lines for TOOL-13a's compile lane). Commit 4, the erasure guard,
is BUILT, its counterforce EXECUTED with all thirteen erased rows NAMED, staged by explicit
path, uncommitted, and green on the plain run; the chair has ruled it **RUNS ITS GATE**, in
the queue behind EM-B1f, FIX-L1 and FIX-P5. **Nothing is committed; no gated run has been
executed.**

> **CHAIR'S RULINGS — ODQ §934.47 addendum 84 (2026-09-20, vetoable).**
> 1. Commits 1, 2, 3 **FOLD INTO TOOL-13a's schema-23 rung.** A governed detector source is
>    changed only through the governed migration bundle; my two probes settled that by
>    execution. TOOL-13a is the chair's mint on a branch cut at the integration tip and will
>    carry the denominator field, the M12 docblock correction and the header correction as
>    bundle members.
> 2. ⛔ **The re-spelling outside the governed set is CLOSED, not deferred** — STOP-note
>    path 2 (a new `scripts/observed-shape-denominator.mjs`) is forbidden: *a second
>    mechanism beside a governed one is the shape the estate forbids.* I had recommended
>    against it; it is now closed with reason and must not be revived.
> 3. Commit 4 **runs its gate**; until "the gate is yours", the one staged file stays staged
>    and nothing else is written.

---

## 0. THE STANDING HASHES — identical at start and at end

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
dbd67ac549c081eaff0e937c448a2f53a763b2cf5a4a329a1aa5f7d6fa21441e  scripts/.observed-shape-readers-baseline.json   ← THE FROZEN INVENTORY
```

Both goldens and the frozen inventory are **byte-identical** before the first edit and after
the last. `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` never set. (CONFIRMED)

The frozen inventory is also byte-identical between TOOL-13's read tip `141a1d775` and this
base (`git diff --name-only 141a1d775 c33446830 -- scripts/.observed-shape-readers-baseline.json`
→ empty), so TOOL-13's row figures are directly comparable with mine. **But `src/` is NOT**
— 17 files moved between the two shas — so the corpus was rebuilt here rather than inherited
(24,368 ms; 1,299 shapes, 117 arrayShapes, 1,031 singleHome, 6 rootShapes, 2,232 files).

**Base plain run, before any edit** (57 s, EXIT=0):
```
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
…M12 language-surface filter (toLocaleString): cleared 0 read(s) across 0 identit(ies)…
```

---

## 1. COMMITS 1 AND 3 — REFUTED. See `TOOL-13b.STOP.md` for the quoted probes.

One comment byte in `scripts/check-observed-shape-readers.mjs` → **EXIT=1**, `DETECTOR
SOURCE changed … Build and review the governed migration bundle instead.`
One comment byte in `scripts/lib/legacy-reader-shape-scan.mjs` → **EXIT=1**, `does not
reconstruct governed Git blob 0310fa9f…`; the clean file accepts (`sha256=79c08bb7…`).
Both probes withdrawn, tree clean (0 status lines) after each.

### 1.1 ⭐⭐ FOLDED INTO TOOL-13a's SCHEMA-23 RUNG — the handoff, for TOOL-13a's compile lane

The three refused commits are bundle members of the chair's schema-23 mint. **Start from
these two refusal lines; they are the whole reason each is a rung member and not a lane
act.** Both were produced at base `c33446830` in `$SP/lane-tool-13b` and both probes were
withdrawn immediately (`git status --short` → 0 lines after each).

**REFUSAL 1 — any byte of `scripts/check-observed-shape-readers.mjs`** (the gate's
provenance branch, `check-observed-shape-readers.mjs:3044–3071`; 7 s, the corpus is never
built):
```
observed-shape DETECTOR SOURCE changed since the schema-22 instrument was governed
(scripts/check-observed-shape-readers.mjs); an ordinary gate/write cannot migrate the
instrument. Build and review the governed migration bundle instead.
```
Mechanism: the file is **entry 1 of `scannerToolFiles()`** and `isDetectorSourcePath()`
returns **true** for it, so `provenanceDriftOf` puts it in `drift.detectorSources` and the
branch returns 1.

**REFUSAL 2 — any byte of `scripts/lib/legacy-reader-shape-scan.mjs`** (thrown from
`assertGovernedLegacyDetectorSource`, `observed-shape-governance.mjs:127`, which fires
*earlier* than the provenance branch — through `validateSchema22Baseline` → `run()`:3030):
```
Error: legacy observed-shape detector does not reconstruct governed Git blob
0310fa9fdda873c1b382cf18c3936707e8e4addf
```
Counter-control, so the refusal is not a refusal of everything:
`BYTE-FREEZE ACCEPTED, sha256=79c08bb74c31bcffd75407822536ec509cad746898bd5fbe067481b273547bed`

| bundle member | file | what it must contain | erases / mints |
|---|---|---|---|
| **M1 — the denominator field** | `check-observed-shape-readers.mjs`, the `--report` path at :3339 | an ADDITIONAL computed object, never written into the byte-frozen blob (`assertHealthyScanProvenance` pins `reads === resolved + unresolved`, so `stats.reads` may not be narrowed). Figures re-measured at THIS base, not TOOL-13's tip: reads **128,225**, resolved **9,780** (**7.627 %**), files **2,232**. Host-global-rooted, breakpoint-token (`.sm/.xs/.md/.xxs`) and uninitialised-`let` splits, and the corpus-vocabulary rate, must be RE-MEASURED at the rung's own tip — TOOL-13's 20,103 / 4,716 / 265 / 8,562-of-51,095 were taken at `141a1d775`, where `src/` differs by 17 files. The "reads that matter" figure is printed AS A CEILING with `Float32Array.from` and `CONTROL_CHARACTERS.test` named. | 0 / 0 |
| **M2 — the M12 docblock correction** | `check-observed-shape-readers.mjs:778–803` | ⛔ prose only. The block still asserts a LIVE population — *"MEASURED at HEAD … 2 reads, 1 identity, 1 file"* — that **DA-B2 cured**. Replace with §2's measurement: 0 raw findings of 2,105; 22 reads across 21 files, **all with unresolved receivers**; not in `BUILTIN_MEMBERS`; M11 clears 0; still capable on a seeded fixture (clears 1, `toType` clears 0); and a pointer to the walker's `CR-EST-CONTROLZERO` re-emergence watch. **The filter is KEPT** — neither retired nor re-scoped. | 0 / 0 |
| **M3 — the header correction** | `legacy-reader-shape-scan.mjs`, the comment at the `roots.has(n.text)` return (:309–316) | it claims the root prior binds `settlement`, `worldState`, `save`, `campaign`; measured, only `save` and `settlement` bind under `minRows = 40` (`campaign` 1 row, `worldState` 25, `pulseResult` 12, `wizardNews` 13). State the mechanism — a walk root is thin BY CONSTRUCTION, so filtering roots through a record threshold is a category error — and point at TOOL-13a's own widening. | 0 / 0 |

⚠ **M3 and TOOL-13a's widening are the same file in the same rung, and M1/M2's figures are
tip-sensitive.** If the rung admits the six roots, the resolution figures M1 prints change
in the same act (9,780 → 12,368 measured here) — so M1 must be composed AFTER the widening
and its numbers taken from the rung's own scan, never carried from this receipt.
⚠ **And the rung erases 13 banked rows** — §3.2 names them; §7.1 of TOOL-13's report
requires each triaged before the write, and that triage is discharged below.

⚠ **This refutes TOOL-13 §7.2's one PLAUSIBLE claim.** It read *"computing it in
`check-observed-shape-readers.mjs` as a post-scan derivation over the detector's
findings/corpus keeps it out of the frozen blob"* and marked it *"PLAUSIBLE that a
post-scan spelling suffices; I did not build it."* Measured: the BLOB is not the only
freeze. The FILE is entry 1 of `scannerToolFiles()`, `isDetectorSourcePath()` returns true
for it, and the provenance branch refuses before the corpus is even built.

---

## 2. COMMIT 2 — THE M12 MEASUREMENT (the question is ANSWERED; the edit is FOLDED as rung member M2)

Instrument `m12-measure.mjs` → `m12.json`. Five questions, all executed at this base:

| # | question | measured |
|---|---|---|
| 1 | raw findings under `toLocaleString`, **before any filter** | **0** of **2,105** |
| 2 | reads of `toLocaleString` the DETECTOR counts | **22** across **21 files** |
| 2b | …of those, receiver RESOLVES | **0** |
| 2c | …grounded to exactly one usable shape | **0** |
| 2d | …would mint a finding | **0** |
| 3 | is the key already in the byte-frozen `BUILTIN_MEMBERS`? | **NO** (`{"toLocaleString":false}`) |
| 4 | would M11 have cleared them (host-global receiver)? | **0** |
| – | observed shapes carrying the key | **0**; the corpus guard ACCEPTS |
| 5 | is the filter still CAPABLE, on a seeded finding? | **cleared=1**, `["toLocaleString on history"]`, survivors=0 |
| 5b | negative control (`toType`, a real domain key) | **cleared=0**, survivors=1 |

**THE VERDICT THE MEASUREMENT SUPPORTS IS NEITHER OF TOOL-13'S TWO OPTIONS.**

M12 is not dead machinery and its roster cannot meaningfully "grow":

* **Its population is upstream of it, not inside it.** All 22 reads have an UNRESOLVED
  receiver — `new Date(iso).toLocaleString` (a `NewExpression`, an unmodelled node kind),
  and plain numbers (`n`, `d`, `ts`, `population`, `p.population`, `(Number(n) || 0)`).
  The detector never grounds them, so it never mints a finding, so M12 has nothing to
  clear. `cleared 0` does not mean "not wired in" — it means **the habitat is gone**.
* **It guards a real permanent hole.** `toLocaleString` is NOT in `BUILTIN_MEMBERS`, so
  these 22 reads DO enter the 128,225-read denominator. The set is a hand-written
  enumeration inside a byte-frozen module; M12 is the only way to finish it.
* **It is still capable, proved on a fixture, with a working negative control.**
* **The roster is bounded by a fail-closed pair, not by will**:
  `assertLanguageSurfaceResidualKeys` (must live on a builtin prototype) AND
  `assertLanguageSurfaceKeysAreNotObserved` (must be absent from every observed shape).
* **Retiring it would delete a live re-emergence watch.** The walker pins
  `live.languageSurface.cleared === 0` EXACTLY, and its own comment refuses `>= 0` on the
  grounds that the exact zero is what reds on arrival if a refactor moves one of the 22
  reads onto an observed shape.

⛔ **THE REAL DEFECT HERE IS A STALE DOCBLOCK, AND IT IS WHY TOOL-13 REACHED THE WRONG TWO
OPTIONS.** The answer above lives entirely in
`tests/lint/observedShapeReaders.walker.test.js` (the `CR-EST-CONTROLZERO` conversion note,
the DA-B2 eradication, the 22-reads-across-21-files figure). The scanner's OWN M12 block
(`check-observed-shape-readers.mjs:778–803`) records none of it and still asserts a LIVE
population — *"MEASURED at HEAD: `popFirst.toLocaleString()` and `popLast.toLocaleString()`
… 2 reads, 1 identity, 1 file"* — which **DA-B2 cured**. A recon lane that reads the
instrument and its `--report` output, as TOOL-13 did, is told the filter has a live
population of 2 and observes it clearing 0, and "dead machinery" is the only reading
available. **The one-paragraph correction belongs in that docblock — and that is exactly
the edit the provenance gate refuses.** ⭐ It is now **rung member M2** (§1.1): the cure is
cheap, it is prose, it mints and erases nothing, and it stops the next recon lane
re-deriving the same wrong conclusion from the same stale sentence.

---

## 3. COMMIT 4 — THE ERASURE GUARD: BUILT AND PROVED BY ITS COUNTERFORCE

**Home:** `tests/lint/observedShapeReaders.walker.test.js`, +112 lines, one new `test(`
title, **zero** new `describe(`. ⭐ JUDGMENT CALL: the brief allowed a NEW file under
`tests/lint/` with a `scripts/mutation-coverage-manifest.json` row; I put the arm in the
EXISTING walker instead. **Decision** — reuse the shared `beforeAll`'s `live.raw.findings`.
**Alternative rejected** — a new file. **Why** — a new file owes a manifest row, a second
full corpus build + scan (the file's own `scansRun` budget note calls a cheap scan
multiplied out "not cheap"), and a larger lighting delta; the arm also belongs beside the
SHRINK-ONLY arm it sharpens. **How to reverse** — lift the `test(` block and its docblock
into a new file and add the manifest row; nothing else depends on the placement.

### 3.1 The faithfulness control, re-executed at THIS base (never inherited)

```
[shipped]      10483 ms  files=2232 reads=128225 resolved=9780 (7.627%)
[shipped]      RAW findings=2105; rows live=1459 frozen=1390; ERASED=0 SHRUNK=0; NEW rows=69
[control-copy]  8587 ms  files=2232 reads=128225 resolved=9780 (7.627%)
[control-copy] RAW findings=2105; rows live=1459 frozen=1390; ERASED=0 SHRUNK=0; NEW rows=69

FAITHFULNESS (the copy reproduces the shipped detector): CONFIRMED
```

### 3.2 ⭐ THE COUNTERFORCE — the same arm under the six-root configuration, RED, rows NAMED

```
[control-copy]  9726 ms  files=2232 reads=128225 resolved=12368 (9.646%)
[control-copy] RAW findings=2124; rows live=1491 frozen=1390; ERASED=13 SHRUNK=0; NEW rows=114

FAITHFULNESS: REFUTED      ← the arm is armed; this is the intended refutation

erased rows under the COPY (PROTO_ROOTS=1): 13
  src/components/map/WorldPulseData.js / institutionName on stressors  [READ STILL PRESENT — instrument erosion]
  src/components/map/WorldPulseData.js / outcome on stressors          [READ STILL PRESENT — instrument erosion]
  src/components/map/WorldPulseData.js / settlementIds on stressors    [READ STILL PRESENT — instrument erosion]
  src/components/map/heraldFeed.js / covert on stressors               [READ STILL PRESENT — instrument erosion]
  src/components/map/heraldFeed.js / impactKind on stressors           [READ STILL PRESENT — instrument erosion]
  src/components/map/heraldFeed.js / outcome on stressors              [READ STILL PRESENT — instrument erosion]
  src/components/map/heraldFeed.js / significance on stressors         [READ STILL PRESENT — instrument erosion]
  src/domain/display/chronicleGraph.js / applyMode on raw              [READ STILL PRESENT — instrument erosion]
  src/domain/display/chronicleGraph.js / proposalPayload on raw        [READ STILL PRESENT — instrument erosion]
  src/domain/realm/heraldRouting.js / impactKind on stressors          [READ STILL PRESENT — instrument erosion]
  src/domain/realm/heraldRouting.js / outcome on stressors             [READ STILL PRESENT — instrument erosion]
  src/domain/realm/heraldRouting.js / section on stressors             [READ STILL PRESENT — instrument erosion]
  src/domain/realm/heraldRouting.js / sectionAuthority on stressors    [READ STILL PRESENT — instrument erosion]
```

Then the shipped config green: **ERASED=0**. The arm reds under the widening and is silent
at the base, which is the §P6 written-contract proof. (CONFIRMED)

⭐ **THIS IS NEW INFORMATION FOR TOOL-13a, AND IT DISCHARGES §7.1's TRIAGE.** TOOL-13 §6.4
counted 13 and could not name them; §7.1 required the 13 be "individually triaged before
the write". They are now named, and **every one of the thirteen carries its read still
written in source** — so not one is a repair; all thirteen are pure instrument erosion.
⚠ And none of the thirteen is a `CLASS_A_PROTECTED_IDENTITIES` member — so extending
`assertClassADebtPreserved` to this path, the obvious cure, **would not have caught a
single one**. (CONFIRMED)

**THE TRIAGE, grouped by file — 13 rows, 4 files, 11 `on stressors` + 2 `on raw`**
(re-verified against `erasure-roots.json` at 2026-09-20 08:49 EDT; `ERASED=13 SHRUNK=0`):

| file | identities erased | n | disposition |
|---|---|---|---|
| `src/components/map/WorldPulseData.js` | `institutionName`, `outcome`, `settlementIds` **on stressors** | 3 | erosion — read still written |
| `src/components/map/heraldFeed.js` | `covert`, `impactKind`, `outcome`, `significance` **on stressors** | 4 | erosion — read still written |
| `src/domain/display/chronicleGraph.js` | `applyMode`, `proposalPayload` **on raw** | 2 | erosion — read still written |
| `src/domain/realm/heraldRouting.js` | `impactKind`, `outcome`, `section`, `sectionAuthority` **on stressors** | 4 | erosion — read still written |

⛔ **WHAT THIS MEANS FOR THE RUNG'S WRITE.** These are not shrinks to absorb. Under the
widened vocabulary each receiver resolves to TWO shapes and
`legacy-reader-shape-scan.mjs`'s `objects.length === 1` guard suppresses the finding, so
the ratchet would report thirteen **STALE ROWS** — the right red with the wrong diagnosis
— and a re-freeze would **bank the loss**. The rung must state these thirteen as a declared,
measured consequence of the widening, not discover them at its write. The concentration is
itself the signal: **11 of 13 are one shape, `stressors`**, and `stressors` is where four
`CLASS_A_PROTECTED_IDENTITIES` rows live (`__adjudicationPending`, `__forecast`,
`__resolution`, `decreed`) — none erased here, but the same receiver family is one
vocabulary step away from them.

### 3.3 The arm's own logic, driven OUTSIDE vitest before any gate is spent

```
raw findings=2105; rawRows=1459; frozen rows=1390
LIVE HALF   erasedRowsOf(baseline.inventory) => 0 row(s)
PLANTED     => 2 row(s)
  "…/heraldRouting.js / outcome on __synthetic__ — THE READ IS STILL WRITTEN: the detector stopped resolving it (INSTRUMENT EROSION)"
  "…/heraldRouting.js / __noSuchKeyIsWrittenAnywhere on __synthetic__ — the read is gone from the file (a lawful repair)"
```

Both classifier branches fire, byte-identical to the strings the test asserts, so the arm
is non-vacuous at a base where its live half is empty by construction. **Parse diagnostics
on the edited file: 0.** Cost: one `Set` over 2,105 findings plus one loop over 1,390 rows;
a file is read only for an already-vanished row — zero at this base. No new scan; the
`scansRun` budget is untouched. (CONFIRMED)

### 3.4 The plain gate with the guard in place

```
EXIT=0
observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.
(stderr: 0 lines)
```

`git status --short` → `M  tests/lint/observedShapeReaders.walker.test.js`, staged by
explicit path, nothing else. (CONFIRMED)

### 3.5 THE GATE — EXECUTED 2026-09-20 08:57–09:08 EDT. **COMMIT `42331a717`.**

| batch | command | result |
|---|---|---|
| 1 | `npx eslint tests/lint/observedShapeReaders.walker.test.js` (BARE — never through the mutex) | **EXIT=0**, no output |
| 2 | mutex shared, `tests/lint/observedShapeReaders.walker.test.js` | **`Test Files 1 passed (1)` · `Tests 47 passed (47)` · 82.64s** |
| 3 | mutex shared, **`tests/lint` WHOLE** (LANE-PARALLEL §5) | **`Test Files 1 failed \| 173 passed (174)` · `Tests 1 failed \| 2791 passed (2792)` · 378.29s · EXIT=1** — the ONE failure is the lighting census, the only permitted red in this directory |
| 4 | mutex shared, `tests/copy/voiceMechanics.test.js` | **`Test Files 1 passed (1)` · `Tests 30 passed (30)` · 4.85s** |
| — | `node scripts/check-observed-shape-readers.mjs` (plain, after the commit) | **EXIT=0** · `observed-shape readers: 1964 finding(s), exactly matching the frozen inventory.` · stderr 0 lines |

Every mutex line entered the SHARED tier and printed a count, so none is a false green.
**THE ARM DEMONSTRABLY ARRIVED:** the file held **46** tests at `HEAD` and **47** staged,
and batch 2 reported 47 passed — the new arm ran and passed rather than being absent.

**LIGHTING DELTA — measured, never quoted.** Frozen `2656·383·2273·25074·6684` (from the
register `tests/lint/.lighting-census-baseline.json`, measured at `f4c395e2d` by
`chair-fable-a9df403c`). The walker printed:

```
AssertionError: the live TEST-title count moved … expected 25075 to be 25074
- 25074
+ 25075
```

| figure | frozen | live | status |
|---|---|---|---|
| files | 2656 | 2656 | asserted, PASSED |
| parked | 383 | 383 | asserted, PASSED |
| credited | 2273 | 2273 | asserted, PASSED |
| titles | 25074 | **25075** | **+1** — the one new `test(` title |
| suiteTitles | 6684 | — | ⚠ **NOT EVALUATED** |

⚠ **`suiteTitles` IS NOT REPORTED AS UNCHANGED.** The census arm asserts the five in order
and THREW on `titles`, so the `suiteTitles` assertion two lines below never ran — the exact
hazard the walker's own comments record ("reddened on `titles` and therefore NEVER EVALUATED
`suiteTitles`"). PLAUSIBLE that it cannot have moved (this commit adds zero `describe(`);
**the next refreeze must MEASURE it, not inherit it.** The register was NOT touched
(`30966fa4…`) — no refreeze.

**POST-COMMIT.** `git show --stat HEAD` names exactly one path; `git status --short` is
EMPTY; the pre-commit hook did **not** rewrite the file (committed blob sha256
`ccc0414b…` identical to the working tree, so the gated bytes are the committed bytes);
trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`; never amended. Goldens,
the frozen inventory (`dbd67ac5…`) and the lighting register all byte-identical to base.

---

## 4. ⛔ EVERYTHING NOTICED AND NOT TOUCHED — each specific enough to slot

1. **The M12 docblock states a cured population as live** (§2). `check-observed-shape-readers.mjs:778–803`.
   → ⭐ **SLOTTED: rung member M2** (§1.1), by the chair's addendum 84. It is the reason a
   recon lane mis-read the filter.
2. **The 13 erased rows are named and pre-triaged for TOOL-13a** (§3.2): all thirteen are
   erosion, none is class-(a), eleven on `stressors`, two on `raw`, four files. → ⭐
   **SLOTTED: carried into TOOL-13a's rung**; it discharges TOOL-13 §7.1's "individually
   triaged before the write".
3. **`assertClassADebtPreserved` would not have caught any of the thirteen.** The obvious
   cure for TOOL-13 §8 item 2 is measured INSUFFICIENT. → **the chair's ruling on item 2
   needs re-cutting**: the guard must be the row-survival arm built here, not a widened
   class-(a) check.
4. **`scanReaders`' `minRows` default is 8 while the gate always passes `MIN_ROWS` = 40**
   (`legacy-reader-shape-scan.mjs:532`). A caller that forgets the argument silently gets a
   different instrument. → ⭐ **OFFERED to TOOL-13a's rung as a candidate member beside M3**
   (the same byte-frozen file, so it costs no extra rung). ⚠ Unlike M1–M3 this is
   BEHAVIOUR, not prose: it could move findings, so it is the chair's to admit or close,
   never a lane's to slip into the bundle.
5. **The frozen `scanStats` drift TOOL-13 recorded has grown** — frozen `2228/128176/9766`
   vs live at this base `2232/128225/9780`. Still not a gate failure (the sentinel is a
   90 % floor). → ⭐ **SLOTTED: one line in TOOL-13a's refreeze note** — that rung's write
   IS the next `--write`, so this is where TOOL-13 §8 item 6 lands and self-corrects.
6. **`FAITHFULNESS: REFUTED` is printed by my scratch harness on the counterforce leg by
   design** (the armed copy is *meant* to diverge). Anyone re-running
   `erasure-measure.mjs` with `PROTO_ROOTS=1` should read that line as the arm firing, not
   as a broken instrument. → **recorded here so the next reader of the scratch is not misled.**
7. **The launch message's lighting tuple disagrees with the brief's.** The message says
   `2656·383·2273·25052·6680`; `briefs/launch/TOOL-13b.md` says
   `2656·383·2273·25074·6684`, which matches base `c33446830`'s own commit subject. I used
   the brief's and will MEASURE rather than quote. → ⭐ **REPORTED TO THE CHAIR** in this
   lane's pause message; the launch template is the chair's to correct so the next lane is
   not seeded with a stale tuple. (The 09-20 law already holds that a quoted figure is
   stale the day the next act lands; this is that law biting a launch message.)
