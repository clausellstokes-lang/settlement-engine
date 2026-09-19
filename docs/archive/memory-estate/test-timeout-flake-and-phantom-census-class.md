---
name: ""
metadata: 
  node_type: memory
  title: A heavy test on the bare testTimeout is a FLAKE FACTORY — and a timeout frozen into the census is a PHANTOM
  date: 2026-08-07
  sha: 1f4d2f37
  branch: claude/composite-r4
  status: landed
  tags: 
    - determinism
    - flake
    - timeout
    - test-ratchet
    - observedShapeReaders
    - vitest
  originSessionId: 0be2ac61-89a4-425a-9361-67c3f5ab1681
  modified: 2026-08-11T19:08:32.956Z
---

# The class

**⭐ 2026-08-11 ADDENDUM — THE FIVE-SUITE PGLITE "COLLAPSE" WAS A PHANTOM (measured,
landed `aa585167`):** the five `tests/security/*.pglite.test.js` suites pass 51/51 inside
a real parallel gate run at load average ~200 with 13–57× beforeAll headroom; **the
measured pglite contention multiplier is ~4×, not the 60× the budget hypothesis needed.**
Both candidate cures (bigger budgets / serialization) were REFUTED and the chartered cure
refused. PLAUSIBLE root cause of the original sentinel firing: a KILLED WORKER serializes
as suite-failed-with-every-test-a-skip — the same shape `uncollectedOf` flags — and a
sibling's `pkill -f` on a node_modules path is the recorded killer. Settling experiment
(unrun): kill a worker deliberately and confirm the sentinel names the victims the same
way. ⚠ Never re-charter a "contention cure" for these suites without first reproducing
the collapse in a real parallel run with `$?` captured in-shell.

A test that does **genuinely heavy work inside its test body** while running on the
**global `testTimeout: 20000`** (`vite.config.js:801`) is a flake factory. Under
full-suite contention its duration inflates 3–5x, it crosses the ceiling
non-deterministically, and it reports `Error: STACK_TRACE_ERROR` **with no assertion
diff** — which reads like a mystery defect, not a cost problem.

**Why it matters more than a red:** a flaky gate teaches everyone to re-run until
green, and it **silently invalidates every census taken through it**. Measured: three
full-suite runs at ONE sha produced **0, 2 and 5** out-of-census failures.

# What was measured (2026-08-07, integrity-counted `git archive` of bd5e49f6, 8 cores)

`tests/lint/observedShapeReaders.walker.test.js` called `scanReaders()` — a full
`ts.createSourceFile` parse of every `src/**` file plus three whole-tree AST walks —
**once per mutant test, five times, inside test bodies**. Six full-tree scans per file
run. The five cost 13,447 / 14,622 / 15,347 / 15,803 / 15,904 ms.
**Worst-case margin 20,000 / 15,904 = 1.26x.**

⭐⭐ **THE DECISIVE FACT: it was the ONLY file in the estate doing that.** Every other
test running longer than 8 s carries its own explicit **30 s–240 s** test-level
timeout. The house precedent is stated at `tests/joins/ordering.test.js:289`.
So "is there an explicit timeout on this test?" is the fast triage question.

⚠ **A trailing `}, N);` in a file does NOT mean the slow test is covered.** In
`townSceneLocalMatrixAudit.test.js` the `15_000` belongs to a *different* test; in
`customContentArchiveTransfer.pglite.test.js` the `60_000` likewise. Resolve the
timeout to the *specific* test before concluding it has one.

# How to apply

1. **Cut the cost first, don't buy headroom.** Share the expensive fixture across the
   file's cases in a `beforeAll` with an **explicit hook timeout** (hooks use
   `hookTimeout`, not `testTimeout` — pass the figure as the 2nd arg to `beforeAll`).
   Six scans became two; worst per-test duration fell 15,904 ms → 104 ms, margin
   1.26x → **191.6x**.
2. **Multiple probe files can share ONE scan** when nothing imports them and they
   import nothing: `resolveSpec` only follows relative specifiers landing inside the
   scanned set, and `declaredFns`/`imports`/`bindings` are per-file. Partition the
   findings by file. Pin the partition, or a basename typo hands every case an empty
   array and the negative controls pass on nothing.
3. **⛔ NEVER raise the global `testTimeout`.** It hides the next one and makes a
   genuinely hung test take longer to report. Per-test or per-file, with the measured
   figure and the reason in a comment.
4. **ACCEPTANCE IS REPETITION, NOT A GREEN RUN.** N≥5 full-suite runs; report every
   run's result and duration and the worst-case margin **as a ratio**. An idle-machine
   run is the condition that HIDES the bug.

# ⚠⚠ The phantom-census corollary

A test frozen into `scripts/.test-ratchet-baseline.json` **because it timed out**
records a defect that does not exist: the burn-down lane finds it green in isolation,
cannot close the row, and the ratchet looks permanently indebted forever.

**AUDITED 2026-08-07 — the 49 frozen entries are CLEAN.** Zero are timeout-shaped, and
the slowest still-failing baselined test runs **487 ms** (median 7 ms) — 41x under the
ceiling. **No phantoms; no ratchet-down was owed on timeout grounds.**

Two guards now stand in `tests/lint/testRatchet.test.js`: the older one names
`observedShapeReaders` specifically; the new one is **general** — no row may be
attributed to a timeout in `cause`/`subsystem`. Driven with a planted mutant (reds),
baseline restored `cmp`-verified.

`tests/lint/observedShapeReaders.walker.test.js` also pins its own **scan budget at
exactly 2**, so a re-introduced per-test scan reds instead of flaking.

# ⏳ Deferred, documented, NOT a bug to re-find

The heaviest-contention run (1386 s wall, ~2x the others) exposed a **second tier**,
none of it this file. On the bare 20,000 ms default: `townSceneLocalMatrixAudit`
26,773 ms · `feedDistribution` 23,009 ms · `customContentArchiveTransfer` 21,420 ms ·
`foundersRoll.pglite` 21,934 ms. Blowing their OWN explicit ceilings:
`joins/ordering` 67,752 ms vs 60,000 · `pdf/fullDocByteRender` 30,013 ms vs 30,000.
That is a separate wave needing its own acceptance runs.

# Method notes worth keeping

- `scripts/check-test-ratchet.mjs:158` runs `npx vitest run --reporter=json
  --outputFile=<path>`. **Reproduce the census with that exact invocation** — then a
  timeout you observe is exactly the timeout that poisons the census.
- Per-test `duration` in the JSON report is the **test body only**; hook cost is not
  included. That is why a 45 s `beforeAll` never showed up as the problem.
- ⚠ `setsid` does not exist on macOS — `nohup setsid sh script &` silently fails to
  detach. Use the harness's own background mechanism.
- ⚠ Committing with a private `GIT_INDEX_FILE` leaves the **shared default index
  stale** for the committed paths (`MM` in status). Cure: path-scoped
  `git reset -- <your files>` — index only, working tree untouched, foreign WIP safe.

## ⚠⚠ A SCOPE COLLAPSE ARRIVES DRESSED AS A SKIP-CEILING RED (measured 2026-08-11)

**The census misattributes a dead suite as deferred tests.** Vitest's json reporter
serialises a result-less test as **`pending`**, and `NON_RUN_STATUSES` counts
`pending` as a SKIP — so four suites whose workers were killed
(historyBeats 51, accountData 12, seasonsMiniSoak 5, settlementMapAnnotations 3 = 71)
surfaced as `skipped tests grew: 182 > ceiling 105`. The reader is pointed at
VERIFY_DIST deferrals while the real event is that 71 tests NEVER RAN.

⭐ **THE DISCRIMINATOR IS ALREADY IN THE SAME REPORT — free, no new machinery:**
`numPendingTests` read **111** while the rows read **182** (they AGREE at 111/111 on
a clean run), and every never-run suite had
`startTime === endTime === report.startTime`. Ruled FOLLOW-ON WORK: build both arms
into the sentinel so a collapse reports as a collapse. Until then, **any skip-ceiling
red must be checked against `numPendingTests` before it is believed.**

⭐ KILL-SAFETY CURE PROVEN: build the archive's `node_modules` as an APFS `cp -Rc`
clone INSIDE the archive instead of a symlink — all 7 workers then advertise the
archive's own path and ZERO match the main worktree's, so a sibling lane's
`pkill -f` cannot reach them. Costs a copy; buys lane isolation.
Related: [[cross-lane-pkill-kills-the-other-lanes-workers]].
