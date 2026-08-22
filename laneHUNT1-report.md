# laneHUNT1-report.md — the varying-cast intermittent contamination, diagnosed (ODQ §355 → HUNT-1)

Lane **HUNT-1**, chair-tier forensic seat (§343.1(d)). **Zero repository writes; zero refs moved;
zero full-suite runs spent.** Every conclusion below is labeled CONFIRMED (executed/quoted
evidence) or PLAUSIBLE (reasoning only). Evidence lives in the session scratchpad's self-named
logs and in git objects at `5d18b4a0`; paths are absolute in the receipt.

## §0 · Verdict

**The "varying-cast contamination" is not test-to-test state contamination at all. It is
per-test TIME-BUDGET EXHAUSTION under machine oversubscription, reported through an instrument
that destroys the only discriminator.** Two independent defects compose:

1. **The load mechanism (CONFIRMED):** under ~9–18× CPU oversubscription (two concurrent vitest
   fork pools plus builds/soaks on an 8-core box), individual tests cross their time budgets —
   the global `testTimeout: 20000`, Testing Library's per-query 1s/5s budgets, or a 120s
   per-test override — and fail with `Error: Test timed out in 20000ms`. The victims are
   precisely the suite's three budget-edge classes: full-pipeline generation batteries,
   full-tree sync-fs walker tests, and cold-lazy jsdom component tests. Which victim draws the
   worst scheduling window varies per run — hence the varying cast, the small count (1–2), and
   the zero repeats.
2. **The instrument defect (CONFIRMED — the load-bearing discovery, with one retraction):**
   `scripts/check-test-ratchet.mjs` prints ONLY the failing row's identity
   (`<file> :: <name>`). The `failureMessages` and per-test `duration` — where the timeout is
   written — are parsed and dropped, and the vitest JSON lands under a RANDOM `mkdtempSync`
   name whose path is never printed. ⚠ **RETRACTION:** this lane's mid-flight brief said the
   script "deletes" the JSON — that was wrong (a zsh no-match glob read as an empty listing).
   The reports are not destroyed; they are **orphaned** — hundreds survive in TMPDIR,
   findable only by mtime forensics. The effect at the gate surface is the same: **a timeout
   and a logic red are indistinguishable where anyone actually looks**, so every stray was
   read as a possible real regression — but it also means past strays are RECOVERABLE, and
   this lane recovered all four runs' reports (§1e).

## §1 · Per-victim evidence

### 1a. `tests/lint/lawBandTable.walker.test.js` (Run C's "structural walker giving two answers at one commit")

- **The exact failing arm has failed by TIMEOUT twice before, on the record** (CONFIRMED):
  - `laneTENOTICES-baseproof-lint-docs.log` [3/15]: `FAIL tests/lint/lawBandTable.walker.test.js
    > … > reds on a SECOND exporting module and stays green on one, counting by module` /
    `Error: Test timed out in 20000ms.` (and arm 1, "holds the guard pool to the ONE canonical
    table", timed out in the same battery [2/15]).
  - `laneTEOSR9-S2-lintsweep.log` [2/9]: the SAME arm, the SAME
    `Error: Test timed out in 20000ms.` — a different lane, a different sitting.
- **The arm's cost explains the budget crossing** (CONFIRMED by reading the test at
  `5d18b4a0`): `corpus()` re-walks the LIVE `src/` tree per call — `readdirSync` + `statSync` +
  `readFileSync` over **1,600 .js files** (measured: `git ls-tree -r 5d18b4a0 src | grep -c
  '\.js$'` → 1600) — and the failing arm calls it ~9 times (guardPool×3 = 6 walks,
  identifiers×1, plus registryModules) ≈ **14,000+ sync file reads inside one 20s budget**,
  all preemptible under 10× load.
- **Its "plants" are in-memory overlays, never disk** (CONFIRMED from source: the `overlay`
  parameter appends objects to the corpus array; no fs write exists in the file). A
  wrong-count failure would need a real second module in `src/` — see §2's closed channel.
- **Conclusion: "two answers at one commit" = finished vs. did-not-finish-in-20s.** The walker
  is deterministic whenever it completes. **PROMOTED TO CONFIRMED for the Run C instance
  itself:** its orphaned report was recovered (`laneHUNT1-runC-results.json`, from
  `$TMPDIR/test-ratchet-uIr1GG/`, mtime 00:13) — the failing row reads
  **`duration: 20528ms`** against the 20,000ms budget, with the timeout-kill stack pointing at
  the `it(` on line 213, and NO AssertionError / NO wrong list anywhere. The count was never
  wrong; the walk was killed at its budget.

### 1b. `tests/components/npcAuthoringScope.test.jsx` (Run C's second stray; the estate's "known flake")

- **Always the SAME test: the FIRST in the file** — `a public dossier denies writers even when
  editMode and the caller capability are stale` — across every recorded strike: CG1's gate
  run 1 (`laneCG1-receipt.md` §0b), WF1B's gate (`laneTEWF1B-gate-test-ratchet.log`), and
  T2E's Run C (`laneTET2E-baseratchet.log`). CONFIRMED by quoting all three logs.
- **The file documents its own mechanism** (CONFIRMED from source at `5d18b4a0`): the first
  test is the COLD import of the `NPCsTab` lazy chunk; the in-file comment says it "can sit
  just beyond Testing Library's 1s default under the full corpus" and bumps `findByRole` to
  5000ms. Isolated, the file takes 6.26s with transform 2.26s + import 1.42s
  (`laneCG1-isolate-npcAuthoringScope.log`) — the cold-import cost is real even unloaded.
  The file was already stabilized once for exactly this (`b19d69de "Stabilize cold lazy NPC
  authoring scope test"`).
- **CG1 already classified it MACHINE/FLAKE under contention on three legs** (its receipt §0b:
  docs-only tip commit, isolation 16/16 pass, load 72.52 with 14 live vitest workers), and its
  runs 2–3 passed under WORSE load (87.28, 142.53) — a biased coin, not a determinism.
  CONFIRMED (quoted).
- **PROMOTED TO CONFIRMED for the Run C instance itself:** the recovered report shows
  **`duration: 5470ms`** with **`Error: Unable to find role="button" and name /Mara/i`** — the
  5000ms `findByRole` budget expiring on the cold lazy-chunk import, exactly the mechanism the
  file's own comment documents. Run D reproduced it: **5377ms, same message** (§3).

### 1c. `tests/domain/distribution.test.js` (Run B's stray)

- **The estate's own config documents this file's timeout history** (CONFIRMED —
  `vite.config.js` test block at the tip, verbatim): *"The generation-heavy suites (e.g.
  tests/domain/distribution.test.js) push 40–80 settlements through the FULL pipeline per
  test; in isolation that runs in ~2s, but under 127-file parallel CPU contention it crosses
  5s and fails as a **timeout** (not a logic failure — population output is deterministic).
  20s gives ample headroom on loaded/CI machines…"* — i.e. the 20s ceiling was sized for ONE
  suite's internal contention. Run B ran while WF-8's separate fork pool built and swept, at
  measured load 46.59/75.90/82.28 on 8 cores.
- Passes 32/32 in isolation ×3 in BOTH trees (`laneTET2E-classify.log`, quoted); byte-unchanged
  for 182 commits; passed in the pristine full run (Run C). CONFIRMED (T2E's receipts).
- **PROMOTED TO CONFIRMED:** the Run B report was recovered (`laneHUNT1-runB-results.json`,
  from `$TMPDIR/test-ratchet-x9HgLK/`, mtime 23:54) — the failing row reads
  **`duration: 56955ms`** against the 20,000ms budget, timeout-kill stack at the `it(` on
  line 139, no AssertionError. A ~2s-isolated test ran **~57 seconds** under load 82. (The
  overshoot past 20s is itself diagnostic: the test body is fully SYNCHRONOUS, so vitest's
  timer can only fire when the event loop regains control — sync-heavy tests are precisely the
  ones load dilates AND the ones the timeout kills the moment they yield. The lawBandTable
  arm, also sync, shows the same shape at 20.5s.)

### 1d. The wider cast (same class, sibling receipts — CONFIRMED, quoted from logs)

- `sovereigntyLightingContract.walker.test.js` DOOR 3: timed out at 20s with **32.5s/32.8s
  actual** in two consecutive runs (`laneTEWF1C-census-red.log` / `-green.log`).
- `siteCoherenceRatchet.test.js` C5: timed out at its own **120000ms** override
  (`laneTENOTICES-baseproof-lint-docs.log` [9/15]).
- `postureNameCollision.walker.test.js` ×3 arms, `readerShapeResolver.test.js`,
  `observedShapeSentinel.test.js` M8/M9: all `Test timed out in 20000ms` in the same batteries.
- WF1B's gate drew a second stray alongside npcAuthoringScope:
  `tests/docs/enforcement-claims.test.js :: … meta-pin …` — a docs-tree scanner that also
  spawns child processes; same budget-edge family (mechanism for that instance: PLAUSIBLE).

### 1e. The forensic recovery — every run's full report survives and was captured

The ratchet's mkdtemp dirs are never cleaned; the reports were on disk all along, findable by
mtime. Recovered to the scratchpad (CONFIRMED, files in hand):

| run | source dir (mtime) | copy | failed | the stray rows, with recovered evidence |
|---|---|---|---|---|
| A (WF-1F terminal, green) | `test-ratchet-Vcd2cf` (23:10) | `laneHUNT1-runA-results.json` | 11 | none — the census 11 exactly |
| B (T2E check:tail) | `test-ratchet-x9HgLK` (23:54) | `laneHUNT1-runB-results.json` | 12 | `distribution` trade-route: **56,955ms** vs 20s budget, timeout kill |
| C (pristine base-proof) | `test-ratchet-uIr1GG` (00:13) | `laneHUNT1-runC-results.json` | 13 | `npcAuthoringScope`: **5,470ms**, `Unable to find role="button" /Mara/i` · `lawBandTable` arm 4/5: **20,528ms** vs 20s budget, timeout kill |
| D (T2E confirming) | `test-ratchet-lo7qjp` (00:29) | `laneHUNT1-runD-results.json` | 12 | `npcAuthoringScope`: **5,377ms**, same message |

In all four reports the frozen census's 11 rows fail with intact, deterministic
AssertionErrors (value mismatches) — real debt behaving identically run to run. **Not one
stray in any run carries a value mismatch. Every stray is a time-budget expiry.**

## §2 · Hypothesis disposition

- **H2 (load-correlated timeouts misread as assertion failures): CONFIRMED as the class.**
  With the refinement that nothing is "misread" by a human — the instrument erases the
  discriminator before anyone can read it.
- **H1 (worker-level in-memory module-state leakage): FORECLOSED structurally.** The config
  sets no pool options; vitest 4.1.8's installed defaults chunk
  (`node_modules/vitest/dist/chunks/defaults.*.js`: `isolate: true`) + observed
  `dist/workers/forks.js` processes mean every test file runs in a fresh isolated module
  registry. No in-memory registry survives between files. CONFIRMED (config absence + installed
  defaults + ps output).
- **H1-fs (disk-plant race — the one channel that could make a walker count WRONG rather than
  slow): CLOSED by census.** Every source-phase test using fs writes was enumerated at
  `5d18b4a0`; all write to `mkdtempSync(tmpdir())` paths, to `tests/**` self-recording
  baselines, or to goldens under explicit RECORD mode — `git grep` for write calls targeting
  `src/` returns one hit which is a string inside testRatchet's fake-runner seam (a variable
  named `src`, temp path target). **No test writes a `.js` file into `src/`.** `tests/build/**`
  writers are excluded from the source ratchet phase by construction. CONFIRMED.
- **H3 (module-cache/resolution double-registration): REFUTED for the walker victim** — it
  counts files read from DISK, not modules in any graph; a resolution duplication cannot change
  its count. No other victim's failure shape needs it. CONFIRMED (source read).

## §3 · The confirmatory arm — LANDED, and it confirms beyond appeal

T2E's confirming ratchet (Run D, its own tree `a09138d7`) completed at 00:29 under load
50–99, `REPEAT_MINE_TRUE_EXIT=1`: **RED with exactly one non-census stray —
`npcAuthoringScope`'s first test again** (`laneTET2E-repeat-mine.log`). `distribution` did NOT
recur; the cast varied exactly as the model predicts. The HUNT-1 watcher captured the report
before anyone could lose it (`laneHUNT1-runD-results.json`): the stray's recovered row reads
**`duration: 5377ms`** with **`Error: Unable to find role="button" and name /Mara/i`** — the
5000ms cold-lazy `findByRole` budget expiring. A time-budget expiry, not a logic miss. The
value-mismatch escape hatch (the one outcome that would have reopened the hunt) did not occur
in ANY of the four recovered reports.

**Input to the chair's landing decision on MF-T2E (the chair's call, not this lane's):** all
three strays that ever appeared around T2E's landing are now CONFIRMED machine-load artifacts;
its member battery is green, its census closes, and Run D's 12 = the census 11 + one CONFIRMED
timeout artifact. Nothing implicates the member's content.

## §4 · Chartered cure shapes (NOT applied — each is a separate lane), priority-ordered per chair

### Cure 1 — RATCHET EVIDENCE PRESERVATION (first; §332.1-class instrument defect)

`scripts/check-test-ratchet.mjs`, two edits, no change to any verdict logic:

- When non-census failing rows exist, print for each row its **`duration`** and the FIRST LINE
  of each of its `assertionResults[].failureMessages` (the data is already in the parsed
  `report`; `rowsOf()` currently drops both — carry them through the row shape and emit
  `      duration: 20528ms · msg: Error: STACK_TRACE_ERROR (timeout kill)` under each identity
  line). ⚠ Spec note from the recovered evidence: vitest 4's JSON reporter serializes a
  testTimeout kill as `Error: STACK_TRACE_ERROR` with the stack at the `it(` — the prose
  `Test timed out in 20000ms` belongs to the CLI reporter. **`duration > testTimeout` is the
  reliable self-classifying signal in the JSON; print it always.** (Testing Library query
  expiries DO carry their prose: `Unable to find role=…`.)
- Print the report's OWN path in the failure block (one line — the file already survives; it
  is merely unnamed today). Optionally also copy to a STABLE path **outside the repo** (the
  header's own law — never a repo path, never a bare `--json`), e.g.
  `path.join(os.tmpdir(), 'test-ratchet-last-red.json')`, so "the last red" needs no mtime
  forensics.
- Stamp machine context in the same block: `os.loadavg()` + `os.cpus().length`, so every future
  red carries its own load classification for free.
- Guard note for the cure lane: the fail-closed meta-test (`tests/lint/testRatchet.test.js`)
  pins the gate's output paths and drives failure paths with an injected fake runner — the new
  lines must be added to its pinned expectations, not around them. The census walkers cap new
  test files/titles (the census sits AT its ceiling), so extend the EXISTING meta-test's
  arms rather than adding a file.

### Cure 2 — corpus() memoization in the walker family

`tests/lint/lawBandTable.walker.test.js`: hoist one `const LIVE = corpus()` module-level lazy
memo (the overlay path composes as `[...LIVE, ...overlay.map(…)]`). Behavior-identical at a
fixed tree — the file runs in its own isolated registry, so the memo cannot leak across files —
and it removes ~8 of the ~9 full-tree walks (~12,000 of ~14,000 sync reads) from the hot arm.
Then audit the family for the same shape: `postureNameCollision.walker`,
`sovereigntyLightingContract.walker` (DOOR 3 measured at 32s — likely needs its own look),
`siteCoherenceRatchet` (its C5 arm deliberately runs two scans; keep that, memoize the rest),
`readerShapeResolver`, `observedShapeSentinel`. ⚠ `siteCoherenceRatchet` C5's *point* is
scan-vs-scan agreement — exempt its two deliberate scans from memoization or the arm goes
vacuous (pin-vacuity family).

### Cure 3 — load-stamped receipts at the gate

`scripts/gate-tail.sh` (and/or the mutex wrapper): echo `uptime` + core count at step start and
end into the self-named log. Cheap, retroactively makes every future stray classifiable from
its own log. (CG1's R0 already argued the stronger form — serializing whole-tree gates against
heavy non-vitest lanes; that is an owner-process question, not smuggled into this cure.)

### Optional, chair judgment (CG1's R2 stands)

`npcAuthoringScope.test.jsx` second stabilization: pre-warm the lazy `NPCsTab` import in a
`beforeAll`, or give the FIRST test its own per-test timeout override. Not required if Cures
1+3 land — a stamped timeout stray under load 80 self-classifies.

## §5 · Classification protocol for stray reds (until the cures land)

1. Baseline lookup first (existing law), isolation ×3 (existing law).
2. **Read the failure text — it exists.** Until Cure 1 lands the gate does not print it, but
   the full report SURVIVES at `$TMPDIR/test-ratchet-*/results.json` — find the run's file by
   mtime (full-suite reports are ~11.5MB; meta-test fakes are KB-sized), and read the stray
   row's `duration` + `failureMessages`. `duration ≥ testTimeout` (or a Testing Library
   `Unable to find …` at its query budget) = timeout class, settled on the spot.
3. A stray that (a) passes isolated ×3, (b) is byte-unchanged since the frozen census, and
   (c) drew under load > ~2× cores → classify **MACHINE-LOAD ARTIFACT (timeout class)**; one
   lawful classified re-run per the banked varying-cast protocol; NEVER banked into the
   baseline (banking converts an intermittent into permanent debt and blinds the ratchet to a
   real regression later — the ratchet's own header says so).
4. A stray with a confirmed VALUE-mismatch message that passes isolated → NOT this class;
   STOP and escalate — that is the genuine-contamination signature this hunt did not find.

## §6 · Reclassification list for §357 (all one class: MACHINE-LOAD TIMEOUT ARTIFACT)

| # | Occurrence | Where recorded | Prior label | Reclassify as |
|---|---|---|---|---|
| 1 | Run B: `distribution.test.js` trade-route arm, tree `a09138d7`, load 46–82 | `laneTET2E-checktail.log` + recovered `laneHUNT1-runB-results.json` | non-census regression → suspected contamination | **CONFIRMED** load-timeout artifact: 56,955ms vs 20s budget |
| 2 | Run C: `npcAuthoringScope` first test, pristine `5d18b4a0` | `laneTET2E-baseratchet.log` + recovered `laneHUNT1-runC-results.json` | "known four-leg flake" | **CONFIRMED** cold-lazy query-budget expiry: 5,470ms, `Unable to find role /Mara/i` |
| 3 | Run C: `lawBandTable.walker` arm 4/5, pristine `5d18b4a0` | `laneTET2E-baseratchet.log` + recovered `laneHUNT1-runC-results.json` | "walker giving two answers at one commit" | **CONFIRMED** timeout kill: 20,528ms vs 20s budget — the count was never wrong |
| 3b | Run D: `npcAuthoringScope` first test, tree `a09138d7` | `laneTET2E-repeat-mine.log` + captured `laneHUNT1-runD-results.json` | (fresh) | **CONFIRMED** same class: 5,377ms, same message |
| 4 | CG1 gate run 1: `npcAuthoringScope`, load 72.52 | `laneCG1-receipt.md` §0b | MACHINE/FLAKE (correct) | same class, now with mechanism |
| 5 | WF1B gate: `npcAuthoringScope` + `enforcement-claims` meta-pin | `laneTEWF1B-gate-test-ratchet.log` | unclassified pair | same class (second member PLAUSIBLE) |
| 6 | TENOTICES lint-docs batteries: 8×20s + 1×120s timeouts incl. both lawBandTable arms | `laneTENOTICES-baseproof-lint-docs.log`, `-sweep-lint-docs.log` | lane-local noise | same class, the clearest receipts in the estate |
| 7 | OSR9 lint sweep: `lawBandTable` arm 4/5 + `postureNameCollision` timeouts | `laneTEOSR9-S2-lintsweep.log` | lane-local noise | same class |
| 8 | WF1C: `sovereigntyLightingContract` DOOR 3, 32s wall ×2 | `laneTEWF1C-census-red/green.log` | lane-local noise | same class (this arm may deserve its own budget or a Cure-2 pass) |
| 9 | The estate's standing phrase "a walker can pass in isolation and fail on a contended machine" | multiple receipts | folk law | now mechanized: budget exhaustion + evidence-destroying instrument |

**NOT reclassified:** the frozen census's 11 rows (real, attributed debt — untouched); WF1C's
census-title mismatch `20618 vs 20611` (a real census delta from its own work, message intact);
OSR9's observedShapeReaders value-mismatches (its own schema work, messages intact). Value
mismatches with intact messages were never part of the varying cast.

## §7 · Machine context (measured, not recalled)

8-core box (`hw.ncpu` 8, per CG1). Loads at the stray windows: 46.59/75.90/82.28 (T2E reds);
72.52 (CG1 run 1 red); 87.28 and 142.53 (CG1 runs 2–3, GREEN — the coin is biased, not
deterministic); 50.25→99.10 during this lane's watch on Run D. The clean Run A (WF-1F, 11 of
28,693) drew on a quiet box ~2h before T2E's reds.

## §8 · Open questions ledger

- ~~Runs B and C's messages unrecoverable~~ — RESOLVED: recovered from the orphaned TMPDIR
  reports; every per-instance label in §1/§6 is now CONFIRMED with duration + message in hand.
- Whether `enforcement-claims` meta-pin (WF1B's second stray, an earlier sitting) is
  timeout-class was not traced to a message; its report may also survive in TMPDIR by mtime if
  §357 wants it — it fits the family (docs scan + child processes). PLAUSIBLE only, and the
  only remaining unpromoted instance.
- The TENOTICES batteries' ASSERTION failures (e.g. clampPrimitiveBaseline's file-list diff)
  belong to that lane's own tree state, not this class — not investigated further here.
- TMPDIR hygiene: hundreds of orphaned `test-ratchet-*` dirs (several full reports at ~11.5MB
  each) accumulate untended; Cure 1's stable-path option plus an age-based sweep would cap it.
  Noted for TE-HOUSE, not urgent.
