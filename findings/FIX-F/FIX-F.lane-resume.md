# FIX-F — lane resume note (the gate batch, in order) · rev 2, after the chair's rulings

Lane `FIX-F` · worktree `$SP/lane-fix-f` · branch `fix-followups-2026-09-19` · base `76be138a1`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`
Evidence: `$SP/lane-fix-f-scratch/FIX-F.evidence.md` — read §ADDENDUM B before judging the
prose-numerics red, and §FIX-F2b for the next car's measured blast radius.

**State: FIX-F1 complete and STAGED, NOT committed** (the commit body needs this batch's count
lines). FIX-F2b is MEASURED, nothing edited. FIX-F3 needed no work.

## Files staged — fourteen, all `M `, nothing else in `git status --short`

```
FIX-F1, the eleven bags (ten files)
  src/components/new/tabs/{DailyLife,Economics,History,Overview,PlotHooks}Tab.jsx
  src/components/new/tabs/{Relationships,Resources,Services,Viability}Tab.jsx
  src/components/new/tabs/SteadingsSection.jsx
FIX-F1, the guards and the registers
  tests/lint/dossierMountRegistry.walker.test.js   ARM 4, the tier-noun guard (+1 describe, +2 titles)
  tests/ui/tabs.smoke.test.js                      THE PAIR, village + metropolis (+1 describe, +2 titles)
  tests/lint/.prose-numerics-baseline.json         23 rows re-addressed +1; addresses only
the chair's rulings 3 and 4 (this commit)
  tests/pdf/statePrintParity.test.jsx              a note on `screenParagraph`: it weaves where three tabs do not
  src/components/new/tabs/EconomicsTab.jsx         the stale "thirteen prose-numerics rows" comment now reads twenty-two
```

Both goldens byte-identical to base after the last edit: `7177cd6e…` / `921c51cf…`.

## THE BATCH — run straight through, in this order, quoting every count line

```sh
cd "$SP/lane-fix-f"

# 1. eslint on every touched source file. SHARPEST RISK: EconomicsTab.jsx sits at exactly 600 of
#    its 600 max-lines ceiling (the comment edit added no line). See "if eslint reds" below.
npx eslint src/components/new/tabs/DailyLifeTab.jsx src/components/new/tabs/EconomicsTab.jsx \
  src/components/new/tabs/HistoryTab.jsx src/components/new/tabs/OverviewTab.jsx \
  src/components/new/tabs/PlotHooksTab.jsx src/components/new/tabs/RelationshipsTab.jsx \
  src/components/new/tabs/ResourcesTab.jsx src/components/new/tabs/ServicesTab.jsx \
  src/components/new/tabs/SteadingsSection.jsx src/components/new/tabs/ViabilityTab.jsx \
  tests/lint/dossierMountRegistry.walker.test.js tests/ui/tabs.smoke.test.js \
  tests/pdf/statePrintParity.test.jsx

# 2. tests/lint/ WHOLE — the new guard lives there, so every walker runs. Two expected reds below.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint

# 3. tests/ui — the suites that render these tabs, INCLUDING the new pair arm in tabs.smoke.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/ui/tabs.smoke.test.js tests/ui/generalDeskTabFlow.test.js tests/ui/economicsTabFlow.test.js \
  tests/ui/defenseTabFlow.test.js tests/ui/SteadingsSection.test.jsx

# 4. tests/components — the component suites over the same tabs.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/components/historyTab.test.jsx tests/components/viabilityTabAdjudication.test.jsx \
  tests/components/servicesImpairedHouseLine.test.jsx tests/components/servicesTabHeader.test.jsx \
  tests/components/economicsPlotHookSeam.test.jsx tests/components/dossierLabelCase.test.jsx \
  tests/components/dossierRawKeys.census.test.jsx

# 5. tests/pdf — screen-vs-print parity (the suite whose screen model this commit annotates).
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/pdf/statePrintParity.test.jsx tests/pdf/labelLadderParity.test.jsx

# 6. tests/property — the composed-prose manifest golden, the 4,214-cell trap's own instrument.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/dossierProseManifest.test.js

# 7. tests/copy — the standing voice instrument.
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/copy/voiceMechanics.test.js

# 8. Goldens unmoved — the last act before the commit.
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
```

⛔ A gate line with no printed test count DID NOT RUN. Never drop the two exports.

## The two expected reds in batch 2, and neither is a defect of this commit

1. **`tests/lint/proseNumerics.test.js` — RED for EM-B3a's foreign row ONLY.** Per the chair's
   ruling 1 this lane does NOT touch it; CURE-B cures it on the integration tip. The failure will
   name exactly one row, and this is the row to expect:
   ```
   committed: {"path":"src/domain/display/worldSnapshotPublic.js","line":615,"category":"floatInterpolation",
               "snippet":"Math.floor(finiteNum(options.maxHeadlinesPerTick, 12))"}
   live     : {... "line":628 ...}
   ```
   Established against the BASE BLOB (`76be138a1`), file clean in this worktree; `668d87512`
   (EM-B3a) added 13 lines above it and re-addressed nothing. **If the failure names ANY other row,
   that one IS this lane's and I fix it.** Composition note for the chair: my 23 rows and CURE-B's
   land in the same file, so re-run the walker and re-address against the then-tip at composition.
2. **`tests/lint/sovereigntyLightingContract.walker.test.js` — EXPECTED RED.** My delta:
   **+2 describes, +4 test titles, 0 new test files** — two titles in
   `tests/lint/dossierMountRegistry.walker.test.js`, two in `tests/ui/tabs.smoke.test.js`. Record the
   measured tuple and this delta. ⛔ NEVER refreeze it; that is the train's terminal act.

## If eslint reds on EconomicsTab.jsx (ruling 2's fallback)

Measured effective lines, espree comment ranges, exactly eslint's `{skipBlankLines, skipComments}`
arithmetic: **600 against a 600 ceiling**, and `max-lines` errors only ABOVE the max — so it passes.
My arithmetic is unverified against eslint itself, which is gated. If it reds: fold the `tierNounFor`
import onto the existing `generalDeskLines` import line (one physical line, same effective count),
re-run batch 1, and say so in the commit. No ceiling is raised either way.

## Sizes the chair asked for

- **The pair arm** (ruling 5): **44 effective code lines** (77 added lines: 44 code, 29 comment,
  4 blank), in `tests/ui/tabs.smoke.test.js`, reusing that suite's own generated `villageSettlement`
  and adding one metropolis at the SAME config and one more seed suffix — because
  `metropolisSettlement` draws no moving raw position at its seed and six other arms are calibrated
  on it. The arm asserts its own non-vacuity: if no raw position draws a line the corpus words
  differently, it FAILS rather than comparing two identical strings.
- **ARM 4's red-first proof** (ungated, `prove-arm4.mjs`): 13 sites judged, **11 convictions against
  the base tree, 0 against the working tree**, five plants behaving (bare convicted, carried noun
  clean, comment-only convicted, one-hop spread clean, one-hop spread missing convicted).

## What remains after the batch

1. **The commit.** Subject: `FIX-F: the settlement's own noun travels in every desk caller's bag,
   and two guards keep it there`. Body: every count line from this batch; both golden hashes; the
   lighting tuple and the +2/+4 delta; the EM-B3a red quoted as foreign and deliberately untouched;
   and four judgment calls — curing eleven sites rather than the ODQ's nine; re-addressing only this
   lane's 23 baseline rows; keeping the `weaveBlock` backstop; generating a third smoke fixture
   rather than re-seeding one six arms depend on. Trailer
   `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`, keeping any the harness adds.
   Then `git show --stat HEAD` must name exactly the fourteen files and `git status --short` empty.
2. **FIX-F2b, this lane's next car in this same worktree** — measured and written up in evidence
   §FIX-F2b. Headline: the rename is prose-neutral (40 sentences rendered both ways, 0 byte
   differences), NO golden or manifest cell key can see a slot name (both keys quoted), 16 src
   occurrences / 64 bytes, no ceiling raised. **Not a STOP.** The car is the rename across 3 src
   files + 3 test fixtures + 6 corpus-document rows under the corpus ritual, then `weight` joins
   `FLOAT_TOKENS` with zero arriving hits, then the stale `namesAScalar` citation is corrected.
3. **The backstop's fate** — reported, not acted on. After this commit no caller reaches it.
   Recommendation: KEEP (evidence §6).
