# TOOL-9 — LANE RESUME NOTE (paused at the gate, 2026-09-20 ~05:2x EDT)

Worktree `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-9`
Branch `tooling-9-2026-09-20`, base `5a3380e8d`. Scratch `…/scratchpad/lane-tool-9-scratch/`.

## STATE AT THE PAUSE — every edit is done and STAGED

`git status --short` reads exactly `M  tests/lint/sovereigntyLightingContract.walker.test.js` (staged, working
tree clean against the index; `git diff --stat` empty). ONE file, 252 insertions / 1 deletion.

- ⛔ RESTORE TARGET — the cured file's sha256 is
  `1584761de144290ead2b12d1e9d9af97c0a46482bd7136c68c9fab073c99601d`. Every mutant in batch 2 is
  planted and reverted by an exact string edit; after each revert this sha MUST match and
  `git diff --stat` MUST be empty. A revert that does not restore the sha is a STOP.
- ⛔ THE REGISTER IS UNTOUCHED: `tests/lint/.lighting-census-baseline.json` is still
  `3fb7a7e8c406046ee6fb960f45e07ae362b3ead221d68c0e34ff4cb077a6013b` and is NOT in the pathspec.
- ⛔ GOLDENS UNTOUCHED: `7177cd6e…8f1e` (generator-golden-master) and `921c51cf…4b41`
  (dossier-prose-manifest-golden), re-checked after the last edit.

## THE EXPECTED CENSUS DELTA (the prediction batch 1 confirms or refutes)

The change adds 3 literal TEST titles to an already-CREDITED file and NO suite title and NO file.
Predicted: `files 2652 (=) · parked 383 (=) · credited 2269 (=) · titles 25046 (+3) · suiteTitles 6679 (=)`.
The plain walker run and `tests/lint` whole are therefore EXPECTED RED on `titles` alone
("expected 25046 to be 25043") — the lawful red the brief names. Nothing else may be red.

## BATCH 1 — THE PRINT MODE'S OWN RECEIPT (run first; this is the lane's deliverable)

Run from the worktree. Every line spells its paths inline; the two mutex exports are INLINE on
every command; ONE test directory (here, one file) per invocation.

```
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-9

# 1a. the register's sha BEFORE the print run (ungated)
shasum -a 256 tests/lint/.lighting-census-baseline.json

# 1b. THE PRINT over the live tree. EXPECTED RED on `titles` — the print is the receipt, not the exit code.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 LIGHTING_CENSUS_PRINT=1 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js 2>&1 | tee /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-9-scratch/tool-9-print.log

# 1c. the register's sha AFTER the print run — MUST equal 1a. (A change here is a STOP.)
shasum -a 256 tests/lint/.lighting-census-baseline.json

# 1d. THE PLAIN run — the normal mode, unchanged, to show the short-circuit still reds at `titles`
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js 2>&1 | tee /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-9-scratch/tool-9-plain.log
```

⛔ A gate line with no printed test count DID NOT RUN. Quote the count line from each.
Record the print's `measured tuple` line verbatim — that is the lane's tuple and its delta per figure.

## BATCH 2 — THE NEGATIVE CONTROLS (three mutants in MY OWN new code; none writes the register)

Each: plant by exact string edit → run the ONE walker file through the mutex → quote the red →
revert by exact string edit → `shasum -a 256 tests/lint/sovereigntyLightingContract.walker.test.js`
must read `1584761de144290ead2b12d1e9d9af97c0a46482bd7136c68c9fab073c99601d` and `git diff --stat`
must be empty. ⛔ NEVER `git checkout --` this file: the index holds the CURE and a checkout of the
working tree from the index is fine, but a checkout from HEAD would delete the whole lane's work.

- **M1 — a blind digest.** In `censusRegisterDigest`, replace the body with `'0'.repeat(64)`.
  EXPECTED RED: self-test 1, guard (2) — "the register digest is not a digest of the register's own bytes".
  This is the write-guard's read side proven by execution; the write side cannot be planted by a
  lane, because a print that really wrote would change the register's bytes.
- **M2 — a dropped figure.** In `censusPrintLines`, change the `measured tuple` line's
  `CENSUS_FIGURE_KEYS.map(` to `CENSUS_FIGURE_KEYS.slice(0, 4).map(`.
  EXPECTED RED: self-test 2 — the `suiteTitles` problem row, and the delta count 4 vs 5.
- **M3 — a shared delta.** In `censusMovement`, replace `delta: figures[key] - baseline[key]` with
  `delta: figures.titles - baseline.titles`.
  EXPECTED RED: self-test 3 — the exact-equality map reads `+7` on all five instead of on `titles` alone.

## BATCH 3 — THE STANDING INSTRUMENTS AND THE DIRECTORY WHOLE

```
# 3a. the three standing instruments (one invocation, explicit files, all GREEN expected)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/negativeAssertionAnchor.walker.test.js tests/copy/voiceMechanics.test.js tests/lint/mutationCoverageManifest.test.js

# 3b. tests/lint WHOLE, once — the directory-whole rule. EXPECTED: exactly ONE red, the lighting
#     census by my own +3 titles. Any other red is a STOP.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint 2>&1 | tee /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-9-scratch/tool-9-lint-whole.log

# 3c. eslint on the one touched file — 0 problems expected
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx eslint tests/lint/sovereigntyLightingContract.walker.test.js
```

Three instruments checked AHEAD of the gate and expected green, with the reason recorded in
`TOOL-9.evidence.md`: `goldenFreeze.walker.test.js` (its `envSpellingsIn` enrolls only
`/^UPDATE_[A-Z_]+$/` by AST, and `LIGHTING_CENSUS_PRINT` does not match), `testRatchet.test.js`
(`totalTests` is a scope FLOOR, not an exact pin; the file still classifies as an enforcement
walker), and `negativeAssertionAnchor.walker.test.js` (the walker is at EXACT ZERO un-anchored
negatives and my self-tests add none — they use exact structural equality instead).
`tests/lint` whole covers all three.

## BATCH 4 — THE GOLDENS AND THE COMMIT (ungated except nothing)

```
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
shasum -a 256 tests/lint/.lighting-census-baseline.json
git status --short
git diff --cached          # read WHOLE before committing
git commit -- tests/lint/sovereigntyLightingContract.walker.test.js
git show --stat HEAD       # must name exactly the one path
git status --short         # must be empty
```

Subject: `TOOL-9: the lighting walker reads its whole census without writing it`.
Body carries the print mode's own output over the live tree, both register shas, every count line,
the goldens' hashes, the tuple and my delta, and the two judgment calls below.
Trailer: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (the 2026-09-20 trailer ruling —
an Opus lane signs as Opus), keeping any second attribution line the harness adds. NEVER amend.

## WHAT REMAINS AFTER THE BATCHES

Nothing but the commit and the report. No second file, no doc edit, no register touch.

## TWO JUDGMENT CALLS THE CHAIR MAY VETO (both recorded in the commit body)

1. **The parked-roster clause is honoured as a LIVE ROSTER, not a stored delta.** Ruling 1 asks for
   "the parked-roster delta by file if `parked` moved". MEASURED: the register stores `parked` as an
   integer COUNT and carries no roster, so there is nothing to subtract from and a printed "delta"
   would be a composed figure — the exact class the register was extracted to prevent. The print
   therefore emits the LIVE roster, whole and sorted, with each file's park reasons, under a header
   saying so in as many words and naming the workflow that yields the true delta (print at the base,
   print on the branch, diff the two). Alternative rejected: widening the register to carry a roster
   digest — that changes its persisted shape and is not a lane's to take. To reverse: delete the
   roster block in `censusPrintLines` and its two self-test arms.
2. **The write-side mutant is NOT executed, and is labelled as such in the file.** Proving the sha
   guard by planting a print that really writes would change the register's bytes, which this lane
   is forbidden to do. The READ side is proven instead by two executed guards (content-sensitivity,
   and that the digest is of the register's own bytes), and M1 reds on the second. The comment in
   self-test 1 says this plainly rather than implying a mutation that was never run.
