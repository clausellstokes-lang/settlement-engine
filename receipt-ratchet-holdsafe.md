# RECEIPT — lane RATCHET-HOLDSAFE — **COMPLETE for this dispatch — 4 CARS LANDED · 0 STOPPED · 1 owed register act, which is the chair's**
⟦Seat: Opus 5 — Fable-unvalidated · Lane: RATCHET-HOLDSAFE · dock `$SC/laneHOLDSAFE`, detached, base `5e28d5c83`⟧

## ARRIVAL — verified in-shell
```
HEAD          5e28d5c8376b2c7333ffc8b911b378f04629da8f   (matches the brief's 5e28d5c83)
symbolic-ref  (detached)
porcelain     0
node_modules  453 symlinks, 0 real package dirs (never materialised)
```

## THE HOLD, AND THE RESUME THAT ARRIVED MID-LANE
The lane opened under the vitest hold and the instrument was measured entirely by READING.
The chair sent RESUME while I was still in step 1. Two constraints survived it and were kept:
**`check-test-ratchet.mjs`'s default mode was NEVER invoked live** (it spawns the whole
suite — that is the defect under cure), and **no vitest ran alongside a sibling's gate** —
when the exclusive mutex was held by another lane's full `npx vitest run`, I queued through
the mutex rather than racing it. Every read-only mode is proved with node only, as briefed.
Every exit below was captured in-shell; see the RESUMED PROOFS section for the commands.

| step | outcome | sha |
|---|---|---|
| 1 — measure the instrument whole | ✅ **DONE** — and the docket's finding is now EXECUTED, not read | — |
| 2 — `--dry` + `--from-log` read-only modes | ✅ **LANDED** | `8e9b1f058` |
| 3 — proofs (node-only + one vitest run before the mutex closed) | ✅ **EXECUTED**, 1 vitest run OWED | `97e7a6603` |
| 4 — walker marker-rule doc cure | ✅ **LANDED** | `8ebde93b8` |
| ⭐ 5 — an unasked cure found by checking my own car | ✅ **LANDED** | `94411f07a` |

**DOCK TIP `94411f07a`** (repeated in the final block).

---

# ⭐ REGISTER PREDICTIONS — written BEFORE any instrument ran, no register act taken
| register | predicted delta | how derived |
|---|---|---|
| test ratchet `totalTests` | **+4** | 4 new `test(` blocks in `tests/lint/testRatchet.test.js` (90 → 94), all inside EXISTING describes |
| test ratchet `totalFiles` | **+0** | no file added, renamed or deleted |
| lighting census `titles` | **+4** · `suiteTitles` **+0** | `describe(` stays 11 in testRatchet, 1 in the walker; one EXISTING title's text is unchanged |
| `negativeAssertionAnchor` frozen rows | **+0 / UNCHANGED** | `tests/lint/testRatchet.test.js` row is **1** and must MEASURE 1 after; the walker file itself has NO row and must measure **0**. ⚠ Both directions red (`>` ceiling, and `<` ceiling in the honesty arm) |
| size baseline | **+0 rows** | none of the three files is in `scripts/.size-baseline.json` (19 rows, 0 of them under `scripts/`); no `max-lines` rule reaches `scripts/**` (the file is already 1,451 lines with no override) |
| golden freeze | **+0** | no golden register file exists for any of the three paths |
| observed-shape readers | **+0** | no returned-object field added or removed |
| tuning inventory | **+0** | no new numeric constant |
| first-paint built bytes | **+0 — DERIVED, not predicted** | nothing under `src/` is touched; `scripts/` and `tests/` are not bundled |

---

# STEP 1 — THE MEASUREMENT. The docket's finding is TRUE, and BIGGER than it was written.

The docket said `scripts/check-test-ratchet.mjs:163` shells out to an unfiltered
`npx vitest run` "even without `--update`". Confirmed by reading (the spawn is one
`execSync` at what was line 705, taking `runnerCommandOf()` unless `TEST_RATCHET_RUN_CMD`
overrides it) — and then EXECUTED, with a tripwire `npx` first on PATH that records its
argv and exits 1 without writing a report, so vitest never runs:

| invocation | tripwire | argv recorded |
|---|---|---|
| `node scripts/check-test-ratchet.mjs` | **TRIPPED** | `npx vitest run --exclude=tests/build/** --reporter=json --outputFile=…` |
| `… --update` | **TRIPPED** | same source argv |
| `… --bootstrap` | **TRIPPED** | same source argv |
| `… --verify-dist` | **TRIPPED** | `npx vitest run tests/build/ --reporter=json --outputFile=…` |

⇒ **ALL FOUR modes spawn the suite, not just the default.** The docket named the
default; `--bootstrap` is a fourth door onto the same spawn and was not on its list.

## THE CALLER DENOMINATOR — every invocation in the tree, with its mode
| caller | invocation | mode | spawns vitest |
|---|---|---|---|
| `package.json` `test:ratchet` | `sh scripts/gate-mutex.sh --run -- node scripts/check-test-ratchet.mjs` | default source gate | **YES** |
| `package.json` `test:ratchet:update` | `… --update` | `--update` | **YES** |
| `package.json` `verify:dist` | `… --verify-dist` | `--verify-dist` | **YES** |
| `package.json` `check` | runs `test:ratchet` then `verify:dist` | both | **YES** (twice) |
| `.github/workflows/ci.yml:102` | `npm run test:ratchet` | via the npm script | **YES** |
| `.github/workflows/ci.yml:116` | `npm run verify:dist` | via the npm script | **YES** |
| `.husky/` | — | **NO HOOK REFERENCES IT** (and `core.hooksPath` is unset in this dock, so no hook runs here at all) | — |
| `--bootstrap` | **NO CALLER IN THE TREE** — documented only | — | (would) |

Three files IMPORT from it rather than invoking it, and none calls `run()`:
`scripts/base-state-capsule.mjs` (`SCOPE_FLOOR_RATIO`), `tests/build/sourcemapAbsence.test.js`
(`discoverBuildTestFiles`, `isBuildTestPath`), `tests/lint/testRatchet.test.js` (the meta-gate).
⇒ **Four invoking callers, all in `package.json`; every one of them passes an argv carrying
neither new flag, so every one of them is byte-identical after this consist.**

---

# STEP 2 — THE TWO READ-ONLY MODES (`8e9b1f058`)

`--dry` prints the runner argv that WOULD be spawned, the report path, the baseline path
and every ceiling, then exits 0. `--from-log <report.json>` computes the verdict from an
already-captured `--reporter=json` report. Both spawn nothing.

## HOW DEFAULT BEHAVIOUR IS KEPT BYTE-IDENTICAL — structurally, not by care
The read-only flags are lifted out of argv in a SEPARATE pass (`parseReadOnlyArgs`, exported)
rather than widened into `allowedModes`. An argv carrying neither flag comes back with `rest`
equal to the argv that went in — same members, same order — so the unknown-argument refusal,
the mode-exclusivity refusal and the mode selection all see exactly the bytes they saw before.
Widening the mode set instead would have made `--dry --verify-dist` read as *two mutually
exclusive modes*; these are modifiers of a phase, not phases.

Every new branch inside the verdict body is `if (FROM_LOG) … else <the landed bytes>`.

## THE PROOFS
```
--dry, all four modes            exit 0 · tripwire CLEAN · mkdtemp dirs created 0 (6235 -> 6235) · porcelain 0
--dry non-vacuity control        the SAME calls without --dry all TRIP the wire (table above)
--update --dry                   the injected census comes back BYTE-IDENTICAL (it returns before the write)
unknown-argument refusal text    diffed between the previous committed blob and this tree: ✅ IDENTICAL
runnerCommandOf bytes            unchanged — already pinned by the meta-test at tests/lint/testRatchet.test.js:389-396
tests/lint/testRatchet.test.js   90/90, exit 0, run AFTER this car (the last run before the mutex closed)
```

## `--from-log` EQUIVALENCE — 10 verdict shapes, exit AND stdout
Same report bytes down both paths; the only permitted difference is the three lines that
name report provenance and the reading machine.
```
| case                                                   | exit | exits = | stdout = | live TRIPPED | log tripped |
| GREEN — no regressions                                 |  0   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — a regression outside the census                  |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| GREEN — banked failure, magnitude within ceiling       |  0   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — banked row MAGNITUDE breached                    |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — SCOPE SENTINEL: total test count collapsed       |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — SCOPE SENTINEL: a banked test VANISHED           |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — a banked test turned SKIPPED                     |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — the report contains ZERO tests                   |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — a tests/build path leaked into the SOURCE phase  |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
| RED — two files, a regression in each                  |  1   |   ✅    |    ✅    |   ✅ yes     |  ✅ none    |
cases 10 · PASS 10 · FAIL 0
```
⚠ **THE CONTROL WAS WRONG THE FIRST TIME AND I SAY SO.** The first spelling armed only the
`npx` PATH shim, which the INJECTED fake runner never touches — so "live TRIPPED" read
false on all ten cases and the control proved nothing while every equivalence column
already read ✅. The tripwire now lives in the fake runner itself. A control that cannot
fire is the failure this lane is supposed to catch, and it caught its own.

## TWO BEHAVIOURS DELIBERATELY NOT SHARED WITH THE DEFAULT PATH
1. **No stable last-red copy under `--from-log`.** That copy exists to rescue a report from
   a nameless `mkdtemp`; a `--from-log` report already has a name. Worse, copying would be
   actively destructive in the obvious case — pass the stable path itself and
   `copyFileSync(src, src)` truncates it.
2. **The machine line is relabelled** under `--from-log` (`machine READING this report … NOT
   the machine that ran the suite`), because this machine did not run the suite. The default
   spelling is untouched.

---

# STEP 4 — THE WALKER'S MARKER RULE (`8ebde93b8`). DOC ONLY, AND MEASURED AS SUCH.

`scanUnanchoredNegatives` reads exactly two lines for a marker: the assertion's own line and
the single line above it. So a `// anchored:` reason that WRAPS onto a second comment line is
UN-ANCHORED — the line abutting the assertion is the continuation, and the line that carries
`anchored:` is now two lines up, exactly the distance the walker's own "an annotation two
lines above does NOT exempt" arm refuses. **The edge is executed, not described:**
```
control  bare site seen                  1   (must be 1)
control  single-line marker exempts      0   (must be 0)
control  WRAPPED marker does NOT exempt  1   (must be 1 — the edge itself)
```
The rule now has its own docblock section, a KNOWN EDGES bullet, a note on the burn-down
instruction, and a sentence in the failure message where the person who tripped it will read it.
The lookback is deliberately NOT widened — a longer reach would let one comment mute a whole
block below it.

## ⭐ THE FILE'S OWN TRAP, AVOIDED ON PURPOSE
The scan is a plain line match, so `not.toContain` **followed by an open paren** counts as a
site *even inside a comment* — and this walker holds NO frozen row, so a single stray `(` in
my own prose would have reddened it. Every matcher name I wrote is spelled without its paren,
exactly as the file's existing prose already does. Measured after the edit: **0 sites.**

## NOTHING ELSE MOVED — verified, not asserted
```
both frozen literals            md5 BYTE-IDENTICAL to HEAD (FROZEN_UNANCHORED_NEGATIVES, READMITTED_GENERATION_FACING)
every test/describe title       diff IDENTICAL — 0 moved
the diff                        every changed line is a docblock line, a // comment, or a
                                continuation of the failure-message template
the five corpus arms, replayed  ALL GREEN — 2,521 files visited · 505 offending files ·
                                1,532 sites vs 1,532 frozen (exactly consistent) · quarantine EXACT
```

---

# ⭐ STEP 5 — AN UNASKED CURE, FOUND BY CHECKING MY OWN CAR (`94411f07a`)

Checking car 2 against the scanner family, I found the arm I had just written was titled
"`--dry` is a PURE REPORTER: **every mode**…" and backed that claim with a literal
`[[], ['--verify-dist'], ['--bootstrap'], ['--update']]` typed into the test. That is
`contractTestAntiVacuity` **Rule 2's exact shape**. Executed against the walker's own regexes:
```
EXHAUSTIVE_RE matches my title                          true
DERIV_RE matches tests/lint/testRatchet.test.js         true   -> Rule 2 returns [] for the whole file
```
⇒ **It cannot fire. That is a reprieve, not a reason.** The claim was still narrower than it
read: a fifth mode would join `allowedModes` and silently escape a test that says "every mode".

Cured at cause rather than renamed around the detector: `MODE_FLAGS` is now the exported
closed set, `allowedModes` is built from it, the allowed-modes help line is DERIVED from it,
and the test iterates it with a non-vacuity guard plus a ROUND-TRIP (every member must be
ACCEPTED by the argv parser and named back by `--dry`). The derived help line is byte-compared
against the landed literal — **identical** — and the unknown-argument refusal is diffed between
the previous committed blob and this tree — **identical**.

---

# ⭐ MEASURED REGISTER DELTAS — against the predictions above, no register act taken
| register | predicted | MEASURED | agrees |
|---|---|---|---|
| test ratchet `totalTests` | +4 | **+4** (90 → 94 `test(` blocks) | ✅ |
| test ratchet `totalFiles` | +0 | **+0** (no file added/renamed/deleted) | ✅ |
| lighting `titles` | +4 | **+4** | ✅ |
| lighting `suiteTitles` | +0 | **+0** (`describe(` 11 → 11 in testRatchet, 1 → 1 in the walker) | ✅ ⚠ see below |
| `negativeAssertionAnchor` rows | unchanged | **unchanged** — `testRatchet.test.js` measures **1** against frozen **1**; the walker file measures **0** and holds no row; corpus total 1,532 = 1,532 frozen | ✅ |
| size baseline | +0 rows | **+0** — none of the three files is in `scripts/.size-baseline.json`, and no `max-lines` rule reaches `scripts/**` | ✅ |
| golden freeze | +0 | **+0** — no golden register enrols any of the three paths | ✅ |
| observed-shape readers · tuning inventory | +0 | **+0** — no returned-object field, no numeric constant | ✅ |
| first-paint built bytes | +0 | **+0, DERIVED** — 0 files under `src/` touched; `scripts/` and `tests/` are not bundled | ✅ |

⚠ **`suiteTitles` AGREES ONLY BECAUSE I CORRECTED MYSELF MID-CAR.** My first draft of car 2
wrapped the four arms in a new `describe('the READ-ONLY modes …')`, which minted a suite
title and contradicted the prediction I had already written down. I removed the wrapper and
placed the arms in the existing describe rather than quietly revising the prediction —
same call DOCKET-3's J4 made, same reason. Recorded because the alternative (editing the
prediction to match the outcome) is indistinguishable from having predicted correctly.

## OTHER SCANNERS — checked statically, and by execution where the rule was exported
| scanner | verdict |
|---|---|
| `contractTestAntiVacuity` Rule 1a | no `if (!x) continue;` / `return;` shape in any added line — cannot fire |
| `contractTestAntiVacuity` Rule 2 | file-gated out (DERIV_RE true, executed) — **and cured at cause anyway, car 4** |
| `contractTestAntiVacuity` Rule 3 | no same-line `/a/.test(l) && /b/.test(l)` conjunction in any added line |
| `controlBytes` | **0** forbidden C0/DEL bytes in all three files |
| `couplingInclusion` | **0** files under `src/` touched; no import added to any src module |
| `goldenFreeze` | no register file enrols any of the three paths |
| `sizeBaseline` | none of the three is in the map; `eslint` exit **0** on all three |
| `check-hazard-registry` `FULL_SUITE_MARKERS` | still names `check-test-ratchet.mjs`; the file is neither moved nor renamed, so `inChain` derivation is untouched |
| `tests/build/ciCheckParity` | pins `^node\s+scripts/check-test-ratchet\.mjs\b` and the `--verify-dist` spelling — both unchanged |

---

# ⏱ RESUMED PROOFS — the chair sent RESUME mid-lane; every vitest command and its exit
The hold was lifted while I was reading the instrument. I still never invoked
`check-test-ratchet.mjs`'s default mode live, exactly as the RESUME message required, and
I did not run vitest alongside a sibling's gate: when the exclusive mutex was HELD by
`sh scripts/gate-mutex.sh --run -- npx vitest run` (PID 74554), I queued through the mutex
rather than racing it. Every exit below was captured in-shell (`CMD; E=$?`), never read
from a task notification.

| command | exit | result |
|---|---|---|
| `GATE_MUTEX_TIER=shared sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js --maxWorkers=2` (after car 1, before car 2) | **0** | **90 passed (90)** — the pre-existing meta-gate is intact after the script change |
| the same, after car 2's first draft | **1** | **1 failed / 93 passed** — MY assertion was wrong, the script was right (see J2) |
| `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/testRatchet.test.js tests/lint/negativeAssertionAnchor.walker.test.js` (at the tip) | **0** | **Test Files 2 passed (2) · Tests 103 passed (103)**, duration 10.81s, 0 failure lines in the whole log |
| `sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/` (at the tip) | **1** | **2 failed / 2,133 passed (2,135)** across 138 files — one red is MINE (the lighting census's exact title count, +4, the predicted register act) and one is INHERITED (`clampPrimitiveBaseline`, a `src/domain/**` ratchet-down I did not touch). Full attribution in the DIRECTORY RUN block below. ⚠ the task notification for this run said "exit code 0". |

⚠ One attempt (`…testRatchet.test.js --maxWorkers=2`, shared tier) was killed at my own
10-minute wall clock having produced a **0-byte log** — it never started, because the
exclusive lock was held. It is recorded as a non-event, not as a red: a run that never
began measures nothing. `GATE_MUTEX_TIER=shared` also REFUSES a command that declares no
worker cap ("the SHARED tier REFUSED — the command declares no worker cap"), which is worth
knowing before a lane spends a wait on it.

## ⭐ `--from-log` OVER REAL CAPTURED VITEST REPORTS (not only synthetic fixtures)
The brief said `$SC/*.log` holds several captured reports. It does not — **zero** of the
`*.log` files is a vitest JSON report. Three of the `*.json` files are, written by earlier
lanes of this session, and all three were driven through the flag. Each is run twice, so the
proof cannot pass by being always-green or always-red, and the `npx` tripwire is armed
throughout:

| real report | rows / failing / files | census BANKS them | census EMPTY | every failing identity named | tripwire |
|---|---|---|---|---|---|
| `golden-plain.json` | 3 / 1 / 1 | **exit 0** — "no test regressions (1 known failure(s) of 3 tests, ceiling 1)" | **exit 1** | ✅ | clean |
| `voice-now.json` | 19 / 3 / 1 | **exit 0** — "…(3 known failure(s) of 19 tests, ceiling 3)" | **exit 1** | ✅ | clean |
| `fix3.json` | 24 / 2 / 2 | **exit 0** — "…(2 known failure(s) of 24 tests, ceiling 2)" | **exit 1** | ✅ | clean |

⚠ **MY FIRST FIXTURE WAS WRONG AND THE GATE CAUGHT IT.** I banked the rows with
`magnitude: []`, and all three reddened with `BANKED-ROW MAGNITUDE REFUSED`. That is
TE-RATCHET-MAG working exactly as designed — a banked row that declares no magnitude has an
unbounded population and fails closed. The fixture now DERIVES each row's measure from its
real failure message. Recorded because a lane that had simply deleted the magnitude to get
green would have reported a false pass over a guard it had disarmed.

---

# ⭐ RETROVALIDATION ROW (Opus 5 lane → Fable 5.1 chair)

## WHAT WAS JUDGED — each is a call, not a fact; veto any of them
| # | judgment | where |
|---|---|---|
| **J1** | **`--dry` ALWAYS exits 0, even where the real run would refuse.** It could have reused the refusals below it (a symlinked build-test root, a missing census) and exited non-zero; I made it a pure reporter and put every such condition on its own line instead. Reason: a "what would this do" printer that can itself red is one people stop reaching for, and reaching for it under a hold is the entire point. Cost: `--verify-dist --dry` will not tell you by EXIT CODE that discovery would refuse — only by its `strict corpus:` line. | car 1 |
| **J2** | **`--from-log` is REFUSED with `--update`/`--bootstrap`.** The brief did not ask for this fence. Those modes WRITE the census, and the file's own law is that a census is never frozen from a run this gate did not observe; a report the caller hands in is weaker still. The cost is real: nobody can re-freeze from an archived report, even a legitimate one taken in an integrity-counted archive — which is exactly how the ARCHIVE-CENSUS LAW says a freeze SHOULD be taken. **If the chair wants that workflow, this is the fence to lift.** | car 1 |
| **J3** | **Two behaviours deliberately diverge from the default path under `--from-log`** — no stable last-red copy, and the machine line relabelled — inside a block whose bytes the meta-test pins. Both are guarded by `if (FROM_LOG) … else <landed bytes>`, so the default is untouched, but they are divergences rather than pure additions. The copy one is not cosmetic: `copyFileSync(src, src)` truncates, so passing the stable path itself would have destroyed the report. | car 1 |
| **J4** | **I added FOUR meta-tests the brief did not ask for.** The brief scoped step 3 as "prove with node only". A new mode that nothing executes quietly regains a spawn, so the guard went into the tree. Cost: `totalTests +4`, `titles +4`. If the chair wants the consist word-for-word to brief, car 2 is the one to drop — car 1 stands without it. | car 2 |
| **J5** | **Car 4 is entirely unasked.** I found the Rule-2 shape in my OWN car and cured it at cause rather than renaming around the detector. It adds a NEW EXPORT (`MODE_FLAGS`) to a script three other files import, and makes a user-visible help line derived rather than literal (byte-compared: identical). Split it out if you would rather it were its own act. | car 4 |
| **J6** | **The arms went into an EXISTING describe, correcting my own first draft.** My first version wrapped them in a new `describe`, minting a suite title and contradicting the register prediction I had already written. I removed the wrapper rather than editing the prediction. Same call DOCKET-3's J4 made. | car 2 |
| **J7** | **`--from-log` resolves its path against the CALLER's cwd**, not ROOT, because the path is something a human types. Every other path in the file is ROOT-relative, so this is a deliberate inconsistency. | car 1 |

## WHAT THE FABLE CHAIR MUST RE-DERIVE
1. ⛔⛔ **ALL FOUR MODES SPAWN THE SUITE — `--bootstrap` was not on the docket's list.** The
   docket said "even without `--update`", which reads as "the default is the problem". It is
   four doors onto one spawn. Any receipt or brief that treats `--bootstrap` as cheap is wrong.
2. ⛔ **THE DOCKET'S ADDRESS IS WRONG, THOUGH ITS FINDING IS RIGHT.**
   `scripts/check-test-ratchet.mjs:163` is `runnerCommandOf` — the string BUILDER. The
   `execSync` that actually spawns was at **:705** at my base sha. Re-derived by reading the
   base blob, not this tree. Under the citation law that address should be corrected wherever
   it is carried (the docket receipt, and this brief, both repeat it).
3. ⛔ **THE BRIEF ASKED FOR A PIN THAT ALREADY EXISTS.** Step 3 wanted "the default mode's
   argv is unchanged (a snapshot pin, OWED under vitest)". `tests/lint/testRatchet.test.js`
   lines 389-396 already byte-pin BOTH runner commands, and that pin is present at my base
   sha `5e28d5c83`. I added nothing for it because nothing was needed; the pin ran green at
   the tip. If the chair believed the argv was unpinned, that belief should be corrected.
4. ⚠ **`$SC/*.log` HOLDS NO CAPTURED VITEST JSON.** The brief said it has several. Zero of the
   `*.log` files parse as a report; three `*.json` files do, and I drove all three.
5. ⚠ **THE WALKER ALREADY STATED HALF THE RULE.** Its docblock already said "on the assertion
   line or the line immediately above it". What was genuinely absent — and what actually bit —
   is the CONSEQUENCE for a WRAPPED marker. The cure is real but narrower than "the marker rule
   must be stated"; a reader of the old docblock was not misinformed, only under-informed.
6. ⚠ **J2 IS A POLICY FENCE, NOT A TECHNICAL ONE**, and it blocks the very workflow the
   ARCHIVE-CENSUS LAW recommends (freeze from an integrity-counted archive of a committed sha).
   Worth a decision rather than an inheritance.
7. ⚠ **`MODE_FLAGS` IS A NEW EXPORTED SURFACE** on a module imported by
   `scripts/base-state-capsule.mjs`, `tests/build/sourcemapAbsence.test.js` and the meta-test.
   No importer's behaviour changes; the surface still grew.
8. ⚠ **THE REGISTER ACTS ARE THE CHAIR'S.** `totalTests` 90 → 94 and lighting `titles` +4 are
   owed; `suiteTitles`, `totalFiles` and every other register are +0, measured not assumed.

---

# ⛔⛔ THE `tests/lint/` DIRECTORY RUN — RED, exit **1**, and ONE OF THE TWO REDS IS MINE

```
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/
TESTS/LINT DIR EXIT: 1
Test Files  2 failed | 136 passed (138)
     Tests  2 failed | 2133 passed (2135)
  Duration  98.72s
```

⚠⚠ **THE TASK NOTIFICATION FOR THIS RUN SAID "exit code 0". MY IN-SHELL CAPTURE SAID 1.**
The notification reports the exit of the whole backgrounded compound command (which ended in
a `cat`), not of vitest. This is the recorded false-green hazard firing in this very lane, and
it is the only reason the red was seen. **Never take an exit from a notification.**

| failing arm | attribution | evidence |
|---|---|---|
| `sovereigntyLightingContract.walker` — "THE CENSUS IS AN ASSERTION, NOT A SENTENCE" | ⭐ **MINE** | `expected 23188 to be 23184` — vitest prints ACTUAL first, so the tree measures **23,188** against a frozen **23,184**: a delta of **exactly +4**, which is exactly the four titles car 2 adds. Confirmed independently: diffing every `test(`/`describe(` line between my base and the tip yields **4 additions and 0 rewordings**. |
| `clampPrimitiveBaseline` — "baseline exactly matches the files that still define a local clamp/clamp01" | **INHERITED, not mine** | `expected [ …(62) ] to deeply equal [ …(72) ]` — the tree measures **62** local-clamp files against a frozen **72**, i.e. a RATCHET-DOWN owed on `src/domain/**`. My consist touches **0** files under `src/` and **0** clamp-related files. |

⇒ **The lighting red is the register act the chair takes at landing, not a defect** — the
exact-equality census refusing an unbanked title movement is the ratchet working. It is the
`titles +4` I predicted in writing before any instrument ran, arriving exactly as predicted.
**No arm of this consist is red on its own merits**: `tests/lint/testRatchet.test.js` and
`tests/lint/negativeAssertionAnchor.walker.test.js` are **103/103, exit 0** at the tip.

---

# ⏱ WHAT REMAINS OWED
```
# after the chair banks titles +4, the lighting census must return to green:
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/sovereigntyLightingContract.walker.test.js

# the pre-existing clamp ratchet-down, which is nobody's car in this consist:
sh scripts/gate-mutex.sh --run -- npx vitest run tests/lint/clampPrimitiveBaseline.test.js

# NOT RUN AND NOT OWED BY THIS CONSIST — it spawns the whole suite by design:
#   node scripts/check-test-ratchet.mjs          <- and now `--dry` is the hold-safe spelling
```
⚠ In zsh an unquoted variable holding several paths is ONE word — pass these literally.

## RECEIPTS BY PATH
| what | path |
|---|---|
| this receipt | `$SC/receipt-ratchet-holdsafe.md` |
| the `npx` tripwire shim (records argv, never runs vitest) | `$SC/holdsafework/shim/npx`, `shim/vitest` |
| the `--dry` output, default mode | `$SC/holdsafework/dry-default.out` |
| the non-vacuity control: the default mode TRIPPING the wire | `$SC/holdsafework/default-tripped.out`, `tripwire.txt` |
| per-mode `--dry` and per-mode wet runs | `$SC/holdsafework/dry--*.out`, `mode--*.out` |
| the 10-case `--from-log` equivalence harness | `$SC/holdsafework/fromlog-equiv.mjs` / `.out` |
| `--from-log` over three REAL captured vitest reports | `$SC/holdsafework/real-report-fromlog.mjs` / `.out` |
| the node replay of all four new meta-arms (38/38) | `$SC/holdsafework/car2-replay.mjs` / `car2-replay-2.out` |
| the negative-anchor counter replay, with the wrapped-marker control | `$SC/holdsafework/neg-anchor-replay.mjs` / `.out` |
| the walker's five corpus arms replayed | `$SC/holdsafework/walker-arms-replay.mjs` / `.out` |
| the meta-test vitest runs | `$SC/holdsafework/metatest-after-car1.log`, `metatest-car2.log`, `owed-vitest.log` + `.exit` |
| the `tests/lint/` directory run | `$SC/holdsafework/lintdir.log` + `lintdir.exit` |
| pre-edit backups (the `cmp`/md5 references) | `$SC/holdsafework/BACKUP-check-test-ratchet.mjs`, `BACKUP-testRatchet.test.js`, `BACKUP-negativeAssertionAnchor.walker.test.js` |
| commit messages | `$SC/holdsafework/msg-car1.txt` … `msg-car4.txt` |

## PRIORITY
**HIGH** — re-derivations 1 (all four modes spawn), 2 (the docket's `:163` address is the
string builder, not the spawn), 3 (the brief asked for a pin that already exists), and the
lighting register act, which is the only thing standing between this consist and a green
`tests/lint/`.
**MEDIUM** — 4 (`$SC/*.log` holds no reports), 5 (the walker already stated half the rule),
J2 (the `--from-log`/freeze fence blocks the archive-census workflow), J4 and J5 (the two
unasked cars).
**LOW** — 6, 7, 8, J1, J3, J6, J7.

---

## DOCK FINAL STATE (verified in-shell at the tip)
```
HEAD      94411f07a2e3dfa990cb07596ba2b7eb01a8061b     <- TIP SHA
consist   5e28d5c83 (base) -> 8e9b1f058 -> 97e7a6603 -> 8ebde93b8 -> 94411f07a
porcelain 0
node_modules  453 symlinks · 0 real PACKAGE dirs — never materialised.
              (`find -maxdepth 1 -type d` reports 2 entries, `.vite` 16K and `.vite-temp` 0B:
               vitest's OWN build caches, created by this lane's runs. NEITHER carries a
               package.json, so neither is a materialised package. Stated because the raw
               count reads as a violation and is not one.)
diff vs base   3 files changed, 421 insertions(+), 37 deletions(-)
eslint    exit 0, over all three touched files
committed blobs md5-equal the working tree on all three files:
  scripts/check-test-ratchet.mjs  EQUAL
  tests/lint/testRatchet.test.js  EQUAL
  tests/lint/negativeAssertionAnchor.walker.test.js  EQUAL
trailers on all four cars:
  94411f07a  Opus 5 — Fable-unvalidated | RATCHET-HOLDSAFE
  8ebde93b8  Opus 5 — Fable-unvalidated | RATCHET-HOLDSAFE
  97e7a6603  Opus 5 — Fable-unvalidated | RATCHET-HOLDSAFE
  8e9b1f058  Opus 5 — Fable-unvalidated | RATCHET-HOLDSAFE
```

⚠ **THE CARS EXIST ONLY AS THIS DOCK'S HEAD.** The preamble forbids a lane writing refs, so
`94411f07a` is one `git worktree prune` from gone. Sealing it is the chair's act.
