# FIX-T1 — lane resume note (Opus test-side lane, 2026-09-20)

Branch `fix-ruin-replicas-2026-09-20`, worktree `$SP/lane-fix-t1`, cut at `fad5af302`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

Every ungated step is DONE: the census with its denominator, the eleven re-points, A4's
second pin, the walker with its three adversarial self-tests (proved under a scratch shim,
including a red-first over the untouched base and a restored writer mutant), and the
mutation-coverage row. Nothing below is exploratory — each batch is a receipt to execute.

---

## ⛔ READ FIRST — the state of the worktree at the pause, and why

`git status --short` shows **ten staged modified files and NOTHING untracked.** That is
deliberate, and it is the whole reason BATCH 1 exists:

* The lane's ONE census-moving artefact — the CREATE
  `tests/lint/ruinShapeReplica.walker.test.js` — is parked at
  `$SP/lane-fix-t1-scratch/staged/tests/lint/ruinShapeReplica.walker.test.js`
  and is **not in the tree**, so BATCH 1's lighting run measures a tree whose five census
  figures are the BASE's.
* The staged re-points cannot move any census figure, and that is EXECUTED rather than
  assumed: `git diff --cached` adds **0** and removes **0** `it(` / `test(` / `describe(`
  openers, and every staged path under `tests/` is status `M` — no file added, renamed or
  deleted. So BATCH 1's printed tuple **is** the pre-edit base.
* Belt and braces: the whole re-point diff is also at
  `$SP/lane-fix-t1-scratch/fix-t1.repoints.patch`.

⚠ JUDGMENT CALL, recorded for veto. The dispatch says "measure the walker ONCE at your base
BEFORE your first edit" and also "the base measurement is itself gated — put it first in
the note". Those two can only both hold if the tree carries no census-moving edit when the
gate opens. Holding back the single CREATE satisfies both and keeps the lane's work visible
and staged in the worktree; restoring the whole lane to a clean tree would have satisfied
them too but would have left an empty-looking lane across the pause with the work only in
scratch. Reverse by simply running BATCH 1 after step 1b instead of before it.

---

## BATCH 1 — the BASE lighting tuple (FIRST, before anything is added to the tree)

```sh
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-fix-t1
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js
```

EXPECTED: interior RED. The register at `tests/lint/.lighting-census-baseline.json` holds
`files 2652 · parked 383 · credited 2269 · titles 25043 · suiteTitles 6679`
(measured at `902580c712…` by `chair-fable-a9df403c`), and the chair's dispatch says the
branch has moved `+1/+0/+1/+5/+1` since (EM-B1k2 landed, refreeze pending), so the live
figures should read about `2653/383/2270/25048/6680`.
**RECORD THE PRINTED FIGURES VERBATIM — that tuple is MY BASE.** ⛔ Never refreeze.

### 1b — place the CREATE (ungated, two commands)

```sh
cp /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-fix-t1-scratch/staged/tests/lint/ruinShapeReplica.walker.test.js \
   tests/lint/ruinShapeReplica.walker.test.js
git add tests/lint/ruinShapeReplica.walker.test.js
```

---

## BATCH 2 — the new walker and its self-tests

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/ruinShapeReplica.walker.test.js
```

EXPECTED: `Tests 7 passed (7)`, exit 0. Under the scratch shim all seven arms are green and
the census arm reports zero convictions over 2,709 scanned sources.

---

## BATCH 3 — every re-pointed suite, ONE DIRECTORY PER INVOCATION

### 3a `tests/domain`

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/ruinFilter.probe.test.js tests/domain/institutionStatusModel.test.js \
  tests/domain/institutionStatusLifecycle.test.js tests/domain/magicForms.test.js \
  tests/domain/magicSubstitution.test.js tests/domain/brokerageFidelity.test.js \
  tests/domain/defenseStateProseDesk.test.js tests/domain/ruinInstitution.test.js \
  tests/domain/calamity.test.js tests/domain/calamity.kernel.integration.test.js
```

The last two are not re-pointed; they are EM-B1e's own calamity family and are run because
nine fixtures now call into `calamityKernel.js` that did not before.

### 3b `tests/generators`

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/generators/customSupplyChainActivation.test.js
```

### 3c `tests/simulation` — A4's subject

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/simulation/presetLightingWitness.test.js
```

⛔ A line with no printed test count DID NOT RUN.

---

## BATCH 4 — THE RED-FIRST, under the real runner (its own batch)

The red-first is already executed under the scratch shim against a `git archive` of
`fad5af302` (it convicted all eleven sites by file:line). This repeats it under vitest, by
reverting ONE of my own files to its base form and restoring it byte-exact.

```sh
git checkout -- tests/domain/ruinFilter.probe.test.js            # my own edit, withdrawn
git diff --name-only                                              # must name exactly that file
grep -n "status: 'ruined', _worldPulseInactive" tests/domain/ruinFilter.probe.test.js
# ⛔ the grep MUST hit line 27. A red-first that comes back green is a STOP, not a pass.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/ruinShapeReplica.walker.test.js
# EXPECTED RED: 1 failed | 6 passed, the census arm naming
#   tests/domain/ruinFilter.probe.test.js:27 (_worldPulseInactive, _worldPulseEconomyClosed)
cp /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-fix-t1-scratch/staged/tests/domain/ruinFilter.probe.test.js \
   tests/domain/ruinFilter.probe.test.js
git add tests/domain/ruinFilter.probe.test.js
git diff --cached --stat -- tests/domain/ruinFilter.probe.test.js  # restored
```

---

## BATCH 5 — the standing instruments, and `tests/lint` WHOLE

`tests/lint` whole is MANDATORY: the CREATE lands under `tests/lint`, which opts it into
every walker governing that directory (the 2026-09-20 addendum; runs 17, 18 and 19 were one
family). It also covers `negativeAssertionAnchor`, `mutationCoverageManifest`,
`contractTestAntiVacuity`, `ruinFilterRoster`, `goldenFreeze` and `testRatchet` in one pass.

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint
```

⚠ `tests/lint/sovereigntyLightingContract.walker.test.js` is inside that directory and WILL
red on the interior census (expected — the CREATE is in the tree by now). That single
interior red is the predicted one and is NOT a lane failure; every other file must be green.

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/copy/voiceMechanics.test.js
```

---

## BATCH 6 — eslint on every touched file

```sh
npx eslint tests/domain/brokerageFidelity.test.js tests/domain/defenseStateProseDesk.test.js \
  tests/domain/institutionStatusLifecycle.test.js tests/domain/institutionStatusModel.test.js \
  tests/domain/magicForms.test.js tests/domain/magicSubstitution.test.js \
  tests/domain/ruinFilter.probe.test.js tests/domain/ruinInstitution.test.js \
  tests/generators/customSupplyChainActivation.test.js \
  tests/lint/ruinShapeReplica.walker.test.js
```

All ten parse clean under espree with eslint's own `languageOptions`; this is the lint pass.

---

## BATCH 7 — the AFTER lighting tuple (last, once every edit is final)

```sh
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/lint/sovereigntyLightingContract.walker.test.js
```

PREDICTED DELTA against BATCH 1's printed base:
**`+1 files / +0 parked / +1 credited / +7 titles / +1 suiteTitles`**
— derived from the CREATE itself: one file, ONE literal `describe`, SEVEN straight-line
`test` arms, no `.each`, no `runIf`/`skipIf`, and each opener bound EXACTLY ONCE by the
vitest import (verified by an espree binding count against two credited siblings,
`ruinFilterRoster.walker` and `provenanceStampSingleWriter.walker`, which read identically),
so the file is CREDITED rather than parked. ⛔ NEVER REFREEZE — the refreeze is the train's
terminal act and the chair's.

---

## AFTER THE BATCHES — the goldens, then TWO commits by pathspec

```sh
shasum -a 256 tests/fixtures/generator-golden-master.json \
  tests/fixtures/dossier-prose-manifest-golden.json \
  tests/fixtures/preset-lighting-witness-golden.json
```

Must be identical to the BEFORE measurement taken at the base:

```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  dossier-prose-manifest-golden.json
7f67ee8e6cda2b7e70a780090b16db20a4f8032a1746a51b2e044dd69bd98ae2  preset-lighting-witness-golden.json
```

**COMMIT A — the re-points + A4's second pin** (9 paths, every one spelled inline):

```sh
git commit -- tests/domain/brokerageFidelity.test.js tests/domain/defenseStateProseDesk.test.js \
  tests/domain/institutionStatusLifecycle.test.js tests/domain/institutionStatusModel.test.js \
  tests/domain/magicForms.test.js tests/domain/magicSubstitution.test.js \
  tests/domain/ruinFilter.probe.test.js tests/domain/ruinInstitution.test.js \
  tests/generators/customSupplyChainActivation.test.js
```

**COMMIT B — the walker + its mutation-coverage row** (2 paths):

```sh
git commit -- tests/lint/ruinShapeReplica.walker.test.js scripts/mutation-coverage-manifest.json
```

Subject `FIX-T1: …`; trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (the
chair's 2026-09-20 trailer ruling — an Opus lane signs as Opus). After each:
`git show --stat HEAD` must name exactly those paths and `git status --short` must end
empty. Never amend. Never `git add -A`/`-u`/`.`.

---

## What remains after the batches

Only the receipt. No edit is outstanding; every file is final in the worktree.
