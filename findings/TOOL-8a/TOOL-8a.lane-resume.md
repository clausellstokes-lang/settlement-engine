# TOOL-8a — LANE RESUME NOTE (paused at the gate, 2026-09-20)

Lane: Opus PARALLEL TOOLING, chair Fable 5.1 session a9df403c.
Worktree `$SP/lane-tool-8a`, branch `tooling-8a-2026-09-20`, base `5a3380e8d`.
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

## State at the pause

ALL UNGATED WORK IS DONE. Three files are STAGED by explicit path and nothing else is dirty:

```
M  scripts/mutation-coverage-manifest.json     (+5 lines, ONE new entry, zero deletions)
A  tests/lint/darkGuardCensus.walker.test.js   (594 lines)
A  tests/lint/darkGuardRegistry.js             (2,177 lines, 1,733 rows)
```

Goldens UNMOVED, measured before the first edit and again at the pause:
`7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json`
`921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json`

Registry census, born classified at this base (`DISPOSITION_CENSUS`, asserted exact both ways):
LIVE 632 · UNBOUND 460 · precedence-shadowed 344 · corpus-absent 259 · catalogue-candidate 24 ·
KNOWN_DARK_PENDING_CURE 10 · idempotent-normaliser 2 · negated-dedupe 1 · defensive-escape 1 · TOTAL 1,733.

⚠ NO PLANT SURVIVES IN THE TREE. Four mutants were run in a plain-node harness (ungated) and each
was restored by `cp` from a pre-plant backup and verified byte-identical by `cmp` + `shasum`, never
by the checkout family. `git diff -- src tests` is EMPTY and `src/generators/spatialGenerator.js` is
back at `713c152593b7b5103290e278e5a3629fcfa3febc66333a381cd2803a7cd43c64`.

## Ungated pre-proof already executed (plain node, no gate slot spent)

The walker was run end to end through a vitest shim (`$SP/lane-tool-8a-scratch/vitest-shim.mjs`),
which is why the batches below should not be a discovery exercise:

- GREEN: `Tests  0 failed | 11 passed (11)`.
- M1 one registry row DELETED → 4 arms red (TOTALITY names the unregistered guard).
- M2 the FIX-D4 anchor reclassified LIVE → THE LAW reds with the corpus near-miss quoted:
  `…"thieves guild" reads secrets (raw, 321 values) and reaches NONE of them. The nearest the
  corpus writes is "On the payroll of the thieves' guild as a silent informant"`.
- M3 one row's normalization flipped raw→lowercased → the BINDING arm reds by name.
- M4 ⭐ FIX-D6 SIMULATED IN SOURCE (`spatialGenerator`'s `has()` lowercased) → the BINDING arm reds
  on **44 rows** and tells the author to retire each pending-cure row by hand. The self-retiring
  exception is proved by execution, not claimed.

To regenerate the harness after a code edit (it must live in `tests/lint` to resolve its imports):

```
sed -e "s#from 'vitest'#from '../../../lane-tool-8a-scratch/vitest-shim.mjs'#" \
  "$SP/lane-tool-8a/tests/lint/darkGuardCensus.walker.test.js" > "$SP/lane-tool-8a/tests/lint/.dryrun.walker.mjs"
printf "%s\n%s\n" "const { run } = await import('../../../lane-tool-8a-scratch/vitest-shim.mjs');" "await run();" \
  >> "$SP/lane-tool-8a/tests/lint/.dryrun.walker.mjs"
```
⛔ DELETE `tests/lint/.dryrun.walker.mjs` before staging. It is scratch and must never land.

## THE GATED BATCHES, IN ORDER

⛔ Every line spells the two mutex exports INLINE and every path inline. ONE test directory per
invocation. A line with no printed test count DID NOT RUN.

### BATCH 1 — the walker's own file (fastest signal; expect GREEN, 11 tests)

```
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-8a && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/darkGuardCensus.walker.test.js
```

⚠ The corpus arm generates all 525 golden configurations in `beforeAll`. MEASURED at this base over
three plain-node runs: 9.7 s / 9.8 s / 9.7 s, vocabularies identical each time
(`instNames=231 svcNames=375 resKeys=51 facNames=31 secrets=321 incomeSrc=26 goods=98 npcRoles=112
histDesc=53`). The hook carries an explicit `120000` for that reason, so a slow shared gate cannot
flake it. If this batch takes noticeably longer than ~30 s wall-clock, that is the corpus pass and
not a hang.

### BATCH 2 — `tests/lint` WHOLE, once (the 2026-09-20 directory-whole rule)

```
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-8a && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
```

THE ONLY LAWFUL RED IS `tests/lint/sovereigntyLightingContract.walker.test.js`, by this lane's
delta. Everything else must be green, and two files in that directory are the ones this CREATE
opts into and must be watched by name:
- `tests/lint/negativeAssertionAnchor.walker.test.js` — the walker's ONE `.not.toContain` carries a
  single-line `// anchored:` marker on the line immediately above it (verified by hand at the pause).
- `tests/lint/mutationCoverageManifest.test.js` — the new `.test.js` is an enumerated invariant and
  its `self-proving-meta` rationale row is already in the manifest; `uncoveredBaseline` stays 186
  because a rationale row does not move the uncovered count. `MUTATED_FILES` is deliberately
  UNTOUCHED (R5: the sweep plants nothing in `src/`).
  ⚠ `darkGuardRegistry.js` is NOT a `.test.js`, so it is not enumerated and owes no row.

### BATCH 3 — voiceMechanics (the one standing instrument outside `tests/lint`)

```
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-8a && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js
```

Expected GREEN and expected to be a no-op: that walker scans `src/**` string literals, and this
lane creates nothing under `src/`. It is run because the brief names it a standing instrument.

### BATCH 4 — eslint on every touched JS file

```
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-8a && npx eslint tests/lint/darkGuardCensus.walker.test.js tests/lint/darkGuardRegistry.js
```

⚠ The registry is 2,177 lines. It is under `tests/`, where `ceilingFor()` in
`tests/lint/sizeBaseline.test.js` returns null and eslint's `max-lines` rules do not reach — that
is the measured reason the file is NOT in `src/generators` (see the registry header). If eslint
reds on something stylistic, fix it in the file and RE-RUN BATCH 1 before moving on.

### BATCH 5 — the lighting census, ONCE, separately (EXPECTED RED by this lane's delta)

```
cd /private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-8a && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js
```

FROZEN at dispatch: `2652·383·2269·25043·6679`. ⛔ NEVER REFREEZE — record the measured tuple and
the delta only. PREDICTED delta from this CREATE: **+1 test file, +3 suites, +11 titles**
(`darkGuardCensus.walker.test.js` holds 3 `describe` blocks and 11 `test` titles).
⚠ `darkGuardRegistry.js` is a non-test module under `tests/`; whether the walker counts it is NOT
predicted here and the measured tuple decides.

## After the batches

1. `git -C <worktree> diff --cached` read whole, then ONE commit by explicit pathspec:
   `git commit -- tests/lint/darkGuardCensus.walker.test.js tests/lint/darkGuardRegistry.js scripts/mutation-coverage-manifest.json`
   Subject: `TOOL-8a: the dark-guard lint lands as a 1,733-row registry and an exact-vocabulary walker, before the cures`
   Body carries every count line, the goldens' hashes, the lighting tuple and delta, and the four
   judgments below. Trailer `Co-Authored-By: Claude Fable 5.1 <noreply@anthropic.com>`, keeping any
   trailer the harness adds. Never amend.
2. `git show --stat HEAD` must name exactly those three paths; `git status --short` must be empty.
3. Write the receipt to `$SP/lane-tool-8a-scratch/TOOL-8a.receipt.md` and report.

## THE FOUR JUDGMENTS THE CHAIR MAY VETO

1. **THE REGISTRY'S HOME MOVED TO `tests/lint/darkGuardRegistry.js`.** R1 named
   `src/generators/darkGuardRegistry.js` "or the estate's home … say why". MEASURED refusal:
   `eslint.config.js` sets `max-lines: ['error', { max: 800 }]` over `src/generators/**/*.js`, and
   the only escape is a row in `scripts/.size-baseline.json`, which `sizeBaseline.test.js` holds as
   an EXACT SET that may only SHRINK and whose own doc calls a new entry a "last resort, burn-down".
   A 1,733-row table cannot be under 800 effective lines. Growing a burn-down ledger to seat an
   instrument's ledger is the wrong trade, and it is an edit outside this lane's declared src scope.
   Precedents matched instead: `tests/lint/observedShapeBank.literal.js` and
   `tests/lint/mutationCoverage.shared.mjs`. REVERSE: move the file and add the baseline row.
2. **THE EIGHT BECAME TEN ROWS.** D1 is one defect with three dark literals — the two `.replace`
   patterns at `npcGenerator.js:1362` and its eligibility predicate `hasInst('criminal')` at
   `:1360`, which TOOL-8 §4.1 puts in D1's own CURE column ("needs the vocabulary widened in the
   same act"). Filing `:1360` as `corpus-absent` would file a defect its own census calls real as
   honest dead code. REVERSE: move that one row to `corpus-absent` and lower the census by one.
3. **AN EIGHTH DISPOSITION, `UNBOUND`, WAS ADDED BESIDE `LIVE`.** R3's seven are the DECLARED_DARK
   classes; `UNBOUND` is neither dark nor live — it is the declared hole for the 460 sites whose
   receiver the resolver genuinely cannot bind to a corpus vocabulary. Without it every such row
   would have to claim `LIVE`, which would be a false clearance on a site nothing measured.
   `BOUND_FLOOR` is exact so the bound population cannot decay into that hole.
4. **`why` IS OWED PER JUDGMENT, NOT PER ROW.** R3 says every row's `why` is a sentence, and
   `whyOf(row)` returns one for every row: its own for the thirteen a human judged (the ten
   pending-cure sites and the three worked allowlist rows), its CLASS's for the rest, which the
   walker re-derives from the same evidence on every run. 628 copies of one paragraph would rot
   independently of the thing they describe. The walker asserts the sentence is present and ≥ 40
   characters for every non-LIVE, non-UNBOUND row, and refuses a LIVE or UNBOUND row that smuggles
   a hand-written reason.
