# FIX-D7 — LANE RESUME NOTE (paused at the gate, 2026-09-20)

Lane: Opus PARALLEL BUILD, chair Fable 5.1 session a9df403c.
Worktree `$SP/lane-fix-d7`, branch `fix-generator-hygiene-2026-09-20`, cut from `5a3380e8d`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

**Everything ungated is DONE.** All eight items measured; three cured; pins written; nothing committed yet
(the brief stages before the gate and commits after it, so the commit carries real count lines).

## State
- **STAGED, by explicit pathspec, exactly six files** (`git status --short` shows nothing else, no untracked):
  - `src/generators/npcGenerator.js` — N2 cure
  - `src/generators/institutionProbability.js` — N9 cure
  - `src/generators/services/serviceClassifier.js` — N3 header correction
  - `tests/generators/tradeCommodity.test.js` — N2 pins (+1 describe, +3 tests)
  - `tests/generators/neighbourRelDynamics.test.js` — N9 pin (+1 test)
  - `tests/lint/serviceCategoryRegistration.walker.test.js` — N3 pin (+1 test)
- **NO new test FILE** was created, deliberately: `tests/generators` and `tests/lint` are both ENFORCER DIRS
  (`tests/lint/mutationCoverage.shared.mjs` `ENFORCER_DIRS`), so a new file would need a
  `scripts/mutation-coverage-manifest.json` row and a sweep label. Every pin went into a file that already
  carries its row. **No manifest edit is needed and none was made.**
- Goldens untouched and still `7177cd6e…8f1e` / `921c51cf…db41`.
- ⭐ **Behaviour-preservation is ALREADY PROVEN ungated**: the full 525-row corpus regenerated at the cured
  tree is **byte-identical** to the same corpus generated at the base — `399b32c0f647…111596` on both sides
  (`cmp -s` silent). The gated golden suites below re-prove it through the product's own door.

## THE GATED BATCHES, IN ORDER
Run straight through. Every line carries the two exports INLINE, SHARED tier, worker-capped, paths inline.
⛔ A line with no printed test count DID NOT RUN — re-run it; never accept a silent exit 0.

### Batch 1 — the pin suites (do the pins hold?)
```sh
cd "$SP/lane-fix-d7" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/generators/tradeCommodity.test.js tests/generators/neighbourRelDynamics.test.js tests/lint/serviceCategoryRegistration.walker.test.js
```

### Batch 2 — the golden suites (THE byte-identity proof)
```sh
cd "$SP/lane-fix-d7" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js
```
Then re-hash, and it must be unchanged:
```sh
cd "$SP/lane-fix-d7" && shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
```
⛔ `UPDATE_GOLDEN` / `GOLDEN_SHIFT_SIGNED` are FORBIDDEN. A moved golden is a STOP, not a re-record.

### Batch 3 — `tests/generators` WHOLE (consumer directory, one invocation)
```sh
cd "$SP/lane-fix-d7" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/generators
```

### Batch 4 — `tests/lint` WHOLE (consumer directory + the standing walkers)
```sh
cd "$SP/lane-fix-d7" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
```
This covers `negativeAssertionAnchor.walker`, `mutationCoverageManifest` and the edited
`serviceCategoryRegistration.walker` in one pass.

### Batch 5 — the standing instrument outside `tests/lint`
```sh
cd "$SP/lane-fix-d7" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js
```

### Batch 6 — eslint on every touched file
```sh
cd "$SP/lane-fix-d7" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx eslint src/generators/npcGenerator.js src/generators/institutionProbability.js src/generators/services/serviceClassifier.js tests/generators/tradeCommodity.test.js tests/generators/neighbourRelDynamics.test.js tests/lint/serviceCategoryRegistration.walker.test.js
```

### Batch 7 — the lighting walker, ONCE, SEPARATELY
```sh
cd "$SP/lane-fix-d7" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js
```
⛔ **EXPECTED RED.** The census is FROZEN at **`2652·383·2269·25043·6679`** (the chair's dispatch value).
This lane adds **0 test files** and **+5 titles** (1 describe + 4 tests: 3 in `tradeCommodity`, 1 in
`neighbourRelDynamics`, 1 in `serviceCategoryRegistration.walker`). RECORD the printed tuple and the delta
in the receipt. **NEVER refreeze** — the refreeze is the train's terminal act and the chair's alone.
TOOL-9's `LIGHTING_CENSUS_PRINT=1` has **not** landed at this base (grepped: absent), so the plain walker is
the only door.

### Batch 8 — commit (after every batch above is green)
Two commits, each by explicit pathspec, trailer `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>`:
```sh
cd "$SP/lane-fix-d7" && git commit -- src/generators/npcGenerator.js src/generators/institutionProbability.js tests/generators/tradeCommodity.test.js tests/generators/neighbourRelDynamics.test.js
cd "$SP/lane-fix-d7" && git commit -- src/generators/services/serviceClassifier.js tests/lint/serviceCategoryRegistration.walker.test.js
```
The pre-commit hook runs `npx lint-staged` → `eslint --fix` on staged JS. **A `--fix` RE-STAGES**: after each
commit run `git show --stat HEAD` (must name only those paths) and `git status --short` (must be empty); if
the hook rewrote a file, re-run batches 1 and 6 and say so in the receipt.

## What remains after the batches
Only the receipt: per-item dispositions (below), the count lines, the two hashes, the lighting tuple + delta,
the commit shas, and the noticed list. No further edits are planned.

## The eight items as they now stand (full evidence: `FIX-D7.evidence.md`)
| item | disposition |
|---|---|
| **N2** `npcGenerator.js:613-617` | **CURED** — both dead token rewrites retired (`{commodity}` AND `{faction}`: 0 of 108, 0 in `npcData.js`), `grain` bounded to `\bgrain\b` (1 string, 0 inside a longer word). 3 pins. |
| **N3** `serviceClassifier.js` | **CURED** — header corrected to 280 keys / 124 of 375 covered / 251 falling through, heuristic declared LOAD-BEARING; 1 totality pin (not a frozen count, so it never fights the quarantine burn-down). |
| **N4** `narrativeGenerator.js:500,516` | **`professional guard` → FIX-D6** (JUDGMENT, vetoable); **`healer` KEEP** — catalogue-reachable (`Healer (divine, 1st level)`), retiring it would move real prose. |
| **N5** `foodBalance.js:221` | ⛔ **PREMISE REFUTED — CLOSED, no edit.** The de-slug DOES fire: `importChannel "mountain pass trade"` on 1 of 525 rows. Already pinned at `tests/generators/foodImportChannels.test.js:99-112`. |
| **N7** `historyGenerator.js:471` | **KEEP, register `defensive`** — NOT a fossil: `:464` and `:465` both substitute to `govFaction`, so one template spelling `"Legitimate heir vs Corrupt officials"` fires the guard. |
| **N8** `economyReconciliation.js:62` | **CLOSED, `corpus-absent`, layer CORRECT** — producer is `rulingStructure.js:500`, gated on prosperity `Wealthy`/`Thriving`; corpus tops out at `Prosperous`. |
| **N9** `institutionProbability.js:82` | **CURED** — `armou?ry`; red-first captured (pre-cure `Armoury` 0.2 vs `Armory` 0.4). Brief's other literals were mislocated — see evidence table. |
| **N13** `Woodcutter's camp` | ⛔ **→ FIX-D6, a measured DEFECT** — selected at **100%** in all 12 thorp+forest rows, then stripped by `isolationGenerator.js:169-178`'s DEFAULT-DENY `isTradeInst` (tags `['economy','timber']` on neither list). |
