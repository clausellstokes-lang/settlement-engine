# TOOL-7a — PAUSED AT THE GATE (the gated batches, in order)

Lane: Opus TOOLING · branch `tooling-7a-2026-09-20` · worktree `$SP/lane-tool-7a` · base `5a3380e8d`.
Written 2026-09-20 after every ungated step was finished. `SCR=$SP/lane-tool-7a-scratch`.

**Every command below runs from `$SP/lane-tool-7a`.** Every vitest line carries the two exports
INLINE and names ONE test directory. ⛔ A line with no printed test count DID NOT RUN.

**Tree state right now:** 24 files STAGED (`git status --short` shows only ` M`-then-staged rows,
nothing unstaged). `tests/lint/contractTestAntiVacuity.walker.test.js` is in its **COMMIT-A
state** (`$SCR/walker.A.js` — the `codeSkeleton` move only). Its **COMMIT-B state**
(`$SCR/walker.B.js` — + Rule 5 + R4) is applied by batch 3. Both parse; both were dry-run
ungated. The split exists because the brief rules two commits and both touch that one file.

---

## BATCH 1 — the re-routed sites' own suites (one directory per invocation)

```sh
export GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/helpers/sourceContract.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/edgeFunctions/surveyorByok.test.js tests/edgeFunctions/aiProviderAbstraction.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/security/byokNeverLogged.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/aiAnalyst.test.js tests/domain/interview.test.js \
  tests/domain/peaceTermsGrantTerms.test.js tests/domain/razingWitnessWr8.test.js \
  tests/domain/simulationRulesPreset.stability.test.js tests/domain/humanizeEngineTokens.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/components/arrowHeader.test.jsx tests/components/faithPanelModel.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/store/autoplacementStore.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lib/saves.metaProjection.test.js tests/lib/saves.galleryOptIns.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/ui/uiA11yWave5.test.jsx

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/pdf/supplyChainFlowStatusParity.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/vocabularyTotality.walker.test.js \
  tests/lint/engineTelemetryWall.walker.test.js tests/lint/postureNameCollision.walker.test.js
```

⚠ **A THROW HERE IS A FINDING, NOT A BREAKAGE.** Every re-routed site now THROWS where it used
to hand back `''`. If a suite errors with `sourceContract.spanBetween: … no longer precedes …`
or `… no longer contains …`, that test was passing vacuously: quote the throw, fix the ANCHOR
(never the assertion), and name it in the receipt. Predicted here: **none** — all twenty spans
were probed ordered at this base ungated, and the one that was NOT (`byokNeverLogged.test.js`,
inverted at HEAD) is already cured in batch 1's tree.

## BATCH 2 — COMMIT A (ungated; run it the moment batch 1 is green)

```sh
git diff --cached --stat          # read it WHOLE first; 24 paths, no others
git commit -F $SCR/commit-A.msg -- \
  tests/helpers/codeOnlySource.js tests/helpers/sourceContract.js tests/helpers/sourceContract.test.js \
  tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/vocabularyTotality.walker.test.js \
  tests/lint/engineTelemetryWall.walker.test.js tests/lint/postureNameCollision.walker.test.js \
  tests/lib/saves.metaProjection.test.js tests/lib/saves.galleryOptIns.test.js \
  tests/security/byokNeverLogged.test.js \
  tests/edgeFunctions/surveyorByok.test.js tests/edgeFunctions/aiProviderAbstraction.test.js \
  tests/domain/aiAnalyst.test.js tests/domain/interview.test.js tests/domain/peaceTermsGrantTerms.test.js \
  tests/domain/razingWitnessWr8.test.js tests/domain/simulationRulesPreset.stability.test.js \
  tests/domain/humanizeEngineTokens.test.js \
  tests/components/arrowHeader.test.jsx tests/components/faithPanelModel.test.js \
  tests/store/autoplacementStore.test.js tests/ui/uiA11yWave5.test.jsx \
  tests/pdf/supplyChainFlowStatusParity.test.js scripts/check-observed-shape-readers.mjs
git show --stat HEAD              # must name EXACTLY those 24 paths
git status --short                # must be empty
```
(The message is written to `$SCR/commit-A.msg` before the gate opens. If the pre-commit hook
rewrites a file, re-run that file's suite and say so.)

## BATCH 3 — Rule 5's RED-FIRST (its own gated batch)

```sh
cp $SCR/walker.B.js tests/lint/contractTestAntiVacuity.walker.test.js   # Rule 5 + R4 in
python3 $SCR/rule5-plant.py plant                                       # one inline two-finder
                                                                        # slice in a REAL in-scope
                                                                        # file (tests/pdf/…)
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/contractTestAntiVacuity.walker.test.js
```
**EXPECTED RED**, and quote it: `Rule 5 — no slice is bounded by two inline finder calls`,
naming `tests/pdf/supplyChainFlowStatusParity.test.js:23 — slice bounded by two inline finders
('const STATUS = {' → 'const getStatus')`. The detector was rehearsed ungated and returns
exactly that one hit. Then:
```sh
python3 $SCR/rule5-plant.py restore
shasum -a 256 tests/pdf/supplyChainFlowStatusParity.test.js
#   must be 5b7697debd56e63a87f6b4332bdbd5685a1c9faaca8e609257ceb35bf3a50712
```
(The round-trip was rehearsed: plant→restore is byte-identical to that sha.)

## BATCH 4 — the GREEN, then COMMIT B

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/contractTestAntiVacuity.walker.test.js
git add -- tests/lint/contractTestAntiVacuity.walker.test.js
git diff --cached                 # read it whole
git commit -F $SCR/commit-B.msg -- tests/lint/contractTestAntiVacuity.walker.test.js
git show --stat HEAD              # exactly ONE path
git status --short                # empty
```

## BATCH 5 — the standing instruments

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/negativeAssertionAnchor.walker.test.js tests/lint/mutationCoverageManifest.test.js

sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/copy/voiceMechanics.test.js

sh scripts/gate-mutex.sh --run -- npx eslint \
  tests/helpers/codeOnlySource.js tests/helpers/sourceContract.js tests/helpers/sourceContract.test.js \
  tests/lint/contractTestAntiVacuity.walker.test.js tests/lint/vocabularyTotality.walker.test.js \
  tests/lint/engineTelemetryWall.walker.test.js tests/lint/postureNameCollision.walker.test.js \
  tests/lib/saves.metaProjection.test.js tests/lib/saves.galleryOptIns.test.js \
  tests/security/byokNeverLogged.test.js \
  tests/edgeFunctions/surveyorByok.test.js tests/edgeFunctions/aiProviderAbstraction.test.js \
  tests/domain/aiAnalyst.test.js tests/domain/interview.test.js tests/domain/peaceTermsGrantTerms.test.js \
  tests/domain/razingWitnessWr8.test.js tests/domain/simulationRulesPreset.stability.test.js \
  tests/domain/humanizeEngineTokens.test.js \
  tests/components/arrowHeader.test.jsx tests/components/faithPanelModel.test.js \
  tests/store/autoplacementStore.test.js tests/ui/uiA11yWave5.test.jsx \
  tests/pdf/supplyChainFlowStatusParity.test.js scripts/check-observed-shape-readers.mjs
```
Predicted green: the `.not.` register was measured BEFORE/AFTER per file and **zero rows moved**
(every `.not.` this lane adds carries `// anchored:` on the immediately preceding line, R5's
budget). All three touched walkers already hold `{"kind":"rationale","ref":"self-proving-meta"}`
manifest rows, so **no new mutant and no manifest row is owed**.

## BATCH 6 — `tests/lint` WHOLE (the change lives under it)

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
```
LAWFUL REDS to expect, and nothing else: the **lighting census** by this lane's delta (below),
and any prose-numerics row an edit shifted — quote those. Rules 1a/1b/2/3/4/5 were all dry-run
ungated at state B over their real scopes and every one returned **0 violations**
(328 / 328 / 328 / 588 / 588 / 2894 files).

## BATCH 7 — the lighting walker, ONCE, separately. ⛔ NEVER REFREEZE.

```sh
sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js
```
FROZEN (`tests/lint/.lighting-census-baseline.json`, measuredAtSha `902580c71`):
`files 2652 · parked 383 · credited 2269 · titles 25043 · suiteTitles 6679`.

**PREDICTED DELTA — titles +13, suiteTitles +2, files/parked/credited +0**, i.e. a measured
`2652 · 383 · 2269 · 25056 · 6681`. Source of the +13/+2: `sourceContract.test.js` +8 titles
and +2 describes (the marker-slice family's own fail-closed arms), and
`contractTestAntiVacuity.walker.test.js` +5 titles (Rule 5's scan, its scope-liveness arm, and
its three adversarial self-tests — of which the scan and liveness arm are 2 and the self-tests
are 3). No file added, renamed or deleted. **Record the measured tuple and the delta; do not
refreeze — that is the train's terminal act and the chair's.**

---

## What remains after batch 7
Nothing but the receipt. `$SCR/TOOL-7a.receipt.md` is written from the executed output —
every count line quoted, the two commit shas, the lighting tuple and delta, the vacuity
findings, and the noticed-and-not-touched list (each item specific enough to slot).
