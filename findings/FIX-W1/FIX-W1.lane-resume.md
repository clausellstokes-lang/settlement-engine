# FIX-W1 — LANE RESUME NOTE (PAUSED AT THE GATE, 2026-09-20)

Worktree `$SP/lane-fix-w1`, branch `fix-w1-doubled-article-2026-09-20`, cut at `e45c4738b`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

⛔ **COMMIT 3 ADDITIONALLY WAITS FOR THE OWNER'S IN-SESSION SIGNATURE — AND THE LANE'S
MEASUREMENT SAYS IT SHOULD NEVER RUN.** The chair relayed the owner's 15:3x deferment and
asked for a drafted shift record before the door. The draft is
`$SP/lane-fix-w1-scratch/2026-09-20-fix-w1-doubled-article.DRAFT.json`, and its answer is
`predictedRows: 0` on every one of the 50 registered surfaces: the cure moves no golden and
no dormancy pin (receipts in §3 below). Nothing here sets `GOLDEN_SHIFT_SIGNED` or any
`UPDATE_*` variable, and no fixture is touched. **The chair must say either "the record is
signed as drafted" (in which case the door is still NOT run, because there is nothing to
re-record, and the finding goes to the ledger) or give corrections, BEFORE any door verb.**

## 1. WHAT IS STAGED (four files, by explicit pathspec, `git status --short` clean)

```
M  scripts/mutation-coverage-manifest.json            +5
M  scripts/mutation-sweep.sh                          +21
M  src/domain/worldPulse/factionDensityKernel.js      +68 -8
A  tests/domain/wizardNewsDoubledArticle.contract.test.js  +294
```

- **The cure**: one new export `withDefiniteArticle(name, { start })` in the composers' own
  home, and all four beats (`dissolvedBeat`, `interregnumBeat`, `emergenceBeat`, `foldBeat`)
  routed through it. Nine blind interpolation sites removed; zero remain.
- **The arm**: six arms, including a positive anchor and a source-derived exhaustiveness arm.
- **The counterforce**: a real plant in `scripts/mutation-sweep.sh` (#112b) plus its
  `kind: "mutation"` manifest row. The manifest row is NOT optional — the file's basename
  carries `contract`, so `mutationCoverageManifest.test.js` enumerates it and REDS without one.

## 2. THE GATED BATCH — the exact commands, in order

Every vitest line: SHARED tier, the two exports INLINE, ONE directory per invocation,
default reporter, a printed count on every line. **A line with no count DID NOT RUN.**

```sh
SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad
cd "$SP/lane-fix-w1"

# 0. PRE-FLIGHT (ungated; the tree is shared, so re-measure at the top of the window)
git status --short                       # must name only the four staged paths
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
md5 -q src/domain/worldPulse/factionDensityKernel.js    # must be 035876a19af3152e8daa8d70471f6414

# 1. THE RED-FIRST COUNTERFORCE IN THE HARNESS (its own batch).
#    cp backup/restore, NEVER the checkout family: this tree is shared and `git checkout --`
#    would discard a lane's uncommitted work.
cp src/domain/worldPulse/factionDensityKernel.js "$SP/lane-fix-w1-scratch/kernel.gate-backup.js"
perl -0pi -e 's/\$\{townName\}: \$\{house\} is no more/\${townName}: the \${houseName} is no more/' src/domain/worldPulse/factionDensityKernel.js
md5 -q src/domain/worldPulse/factionDensityKernel.js    # must NOT be 035876a1… (the plant applied)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain/wizardNewsDoubledArticle.contract.test.js
#    EXPECTED RED: 2 failed | 4 passed, the named title
#    "ARM 1 — no rendered beat carries a doubled article, over the whole key corpus"
#    and "ARM 5 — DERIVED: no beat composer in the kernel keeps an article of its own".
cp "$SP/lane-fix-w1-scratch/kernel.gate-backup.js" src/domain/worldPulse/factionDensityKernel.js
md5 -q src/domain/worldPulse/factionDensityKernel.js    # must be 035876a19af3152e8daa8d70471f6414 again
git status --short                                      # still exactly the four staged paths
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain/wizardNewsDoubledArticle.contract.test.js
#    EXPECTED GREEN: 6 passed.

# 2. tests/domain WHOLE — the CREATE's own directory (the walkers that govern it) AND a
#    consumer-census hit (irreversibleRawRoster.contract, roadsParticipation).
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain

# 3. tests/generators WHOLE — consumer-census hit (tests/generators/densityLaw.test.js).
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/generators

# 4. tests/lint WHOLE — mandatory on every commit touching src/ or tests/, and the home of
#    BOTH real readers of the manifest I edited (newsHeadlineContract, proseFamilyContract)
#    and of mutationCoverageManifest itself.
#    ⚠ EXPECTED RED, AND ONLY THIS ONE: sovereigntyLightingContract.walker — see §4.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint

# 5. The standing instrument outside tests/lint.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js

# 6. THE LIGHTING CENSUS, ONCE, SEPARATELY — record the tuple and the delta, NEVER refreeze.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js

# 7. eslint BARE (never through the mutex; the shared tier refuses a command with no worker cap)
npx eslint src/domain/worldPulse/factionDensityKernel.js tests/domain/wizardNewsDoubledArticle.contract.test.js

# 8. THE §6 CONTROL — the two goldens re-hashed, identical to step 0.
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json

# 9. COMMIT by explicit pathspec, after reading `git diff --cached` whole. NEVER amend.
git commit -- src/domain/worldPulse/factionDensityKernel.js tests/domain/wizardNewsDoubledArticle.contract.test.js scripts/mutation-sweep.sh scripts/mutation-coverage-manifest.json
git show --stat HEAD      # must name exactly those four paths
git status --short        # must be empty
```

**Trailer** (both lines; never amend to change one):
```
Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
```
⛔ **NO `Owner-Signed:` trailer.** That trailer belongs to a door commit, and no door is run.

## 3. THE CONSUMER CENSUS, MEASURED (addendum 114)

`git grep -l -F 'factionDensityKernel' -- tests` → `tests/domain/irreversibleRawRoster.contract.test.js`,
`tests/domain/roadsParticipation.test.js`, `tests/generators/densityLaw.test.js`,
`tests/lint/.tuning-inventory.json` ⇒ **tests/domain · tests/generators · tests/lint**, each WHOLE.
The new export `withDefiniteArticle` has no pre-existing call site; no exported call shape changed.

For the two `scripts/` files the grep is wider, and the wider half is all DOCBLOCK MENTIONS:
of the 12 test files naming `mutation-coverage-manifest`, exactly **two actually read it**
(`tests/lint/newsHeadlineContract.walker.test.js`, `tests/lint/proseFamilyContract.walker.test.js`,
both `readFileSync` — measured `reads=1`; the other ten measured `reads=0`). Both live in
`tests/lint`, which runs whole at step 4. `tests/config`, `tests/edgeFunctions` and
`tests/security` hit on prose only. **If the chair wants addendum 114 read literally rather
than by measured readership, add those three directories whole; the lane's judgment is that
they buy nothing and cost the pglite wall-clock.**

Checked and clear: `newsHeadlineContract`'s baseline carries 50 homes, all `applied|…` /
`queued|…` outcome-lane addresses; none of the four mover-authored density beat kinds appears,
so the cure cannot move a row there. No edge-shared bundle meta lists any file I touched, so
no `build:edge-shared` is owed (addendum 98).

## 4. THE LIGHTING DELTA — EXPECTED RED, RECORD IT, NEVER REFREEZE

Frozen tuple at my base `e45c4738b` (the eighth refreeze): **2665 · 359 · 2306 · 25529 · 6815**
(files · parked · credited · titles · suiteTitles).

My delta: **files +1** (one new test file), **suiteTitles +1** (one `describe`),
**titles +6** (six `it`). Predicted tuple **2666 · 359 · 2306+? · 25535 · 6816** — the
`credited` term is the walker's own arithmetic and is recorded as MEASURED at step 6, never
predicted. The refreeze is the train's terminal act and the chair's.

## 5. WHAT REMAINS AFTER THE BATCH

1. Quote every count line into `$SP/lane-fix-w1-scratch/FIX-W1.receipt.md` and report.
2. Report the whole-directory wall-clock for `tests/domain`, `tests/generators`, `tests/lint`.
3. **Nothing else.** There is no commit 3: the door is not run, the shift record is not
   committed, and the recommendation to the chair is to close §934.65's third item (FIX-W1)
   as **signed but unneeded** — the measurement, not the signature, is what makes the door
   unnecessary.

## 6. IF A STEP REDS ON ANYTHING BUT THE LIGHTING WALKER

STOP, do not improvise: write `$SP/lane-fix-w1-scratch/FIX-W1.STOP.md` with the smallest
measured contradiction and hand it to the chair. A red-first that comes back GREEN at step 1
is also a STOP (`git status --short` and `md5` are the two checks that catch a plant that
never applied).
