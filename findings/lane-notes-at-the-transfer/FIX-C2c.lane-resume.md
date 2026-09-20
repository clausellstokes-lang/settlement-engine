# FIX-C2c — LANE RESUME NOTE (PAUSED AT THE GATE)

**Lane** Opus FIX-C2c · **Chair** Fable 5.1, session a9df403c · stamped **2026-09-20 13:13 EDT**
**Worktree** `$SP/lane-fix-c2c` · **Branch** `fix-citations-2c-2026-09-20` cut at `578272a99`
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

Every edit is written. NOTHING is staged and nothing is committed: the commits below are cut by
EXPLICIT PATHSPEC (`git commit -- <paths>`), which needs no index, and `git status --short` names
exactly the 18 files listed under "the tree" below. Resume with "the gate is yours" and run the
batch straight through, in this order.

---

## 1. eslint — BARE, never through the mutex (FIX-L1's law)

```sh
cd "$SP/lane-fix-c2c" && npx eslint tests/lint/sourceCitationIntegrity.shared.mjs tests/lint/sourceCitationIntegrity.walker.test.js
```
Expect exit 0, no output. (The pre-commit hook runs `lint-staged` over staged JS, so a red here
reds every commit below.)

## 2. `tests/lint` WHOLE — the directory my change lives under

```sh
cd "$SP/lane-fix-c2c" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
```
⛔ A line with no printed test count DID NOT RUN — re-run it.
**The ONLY permitted red is `sovereigntyLightingContract.walker.test.js`.** Record the tuple it
prints and MY DELTA (below); never refreeze. Every other walker must be green, including this
lane's own five arms; ARM 3 and ARM 5 print their reports through `process.stdout.write`.

## 3. `tests/docs` WHOLE — two of its files read documents this lane edited

`riskRegisterFreshness.test.js` reads `docs/RISK_REGISTER.md`; `enforcement-claims.test.js` reads
`docs/FABLE_VALIDATION_QUEUE.md`.
```sh
cd "$SP/lane-fix-c2c" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/docs
```

## 4. the two `tests/domain` filesystem readers of my edited docs

```sh
cd "$SP/lane-fix-c2c" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/domain/treatyLifecycleVoice.test.js tests/domain/brokeragePlantHandoffPins.test.js
```

## 5. the two `tests/property` filesystem readers — EXPLICIT FILES ONLY

⛔ NEVER `tests/property` whole: `tests/property/dossierProseManifest.test.js` is the inherited
recorder red (§934.71) and is not this lane's to run or cure.
```sh
cd "$SP/lane-fix-c2c" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 \
  tests/property/beliefMapGolden.test.js tests/property/momentumDormancyGolden.test.js
```

## 6. the standing voice instrument

```sh
cd "$SP/lane-fix-c2c" && GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
  sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js
```

## 7. the three commits, in order, by explicit pathspec

⚠ **THREE, NOT FOUR — a declared deviation, FIX-C2b's precedent.** The brief's units 1 and 2 both
edit the SAME two instrument files and unit 3's taxonomy is a header in one of them, so no hunk-free
cut separates them (`git add -p` is forbidden). Unit 3's only LIVE document instance and unit 4's
cure in that same document are one reading pass over one file, so they ship together.
*Reverse by* re-splitting at the hunk level, which needs an interactive stage.

```sh
cd "$SP/lane-fix-c2c" && git commit -- tests/lint/sourceCitationIntegrity.shared.mjs tests/lint/sourceCitationIntegrity.walker.test.js
```
Subject: `FIX-C2c: the symbol arm reaches the docs scope behind the manifest's LANDED rule, and the ambiguous basename stops being a silence`

```sh
cd "$SP/lane-fix-c2c" && git commit -- docs/DESIGN_REALM_MAGIC_TOGGLE.md
```
Subject: `FIX-C2c: the fourth UNRESOLVED sub-class's only live instance struck, and the abbreviated schema address re-addressed by symbol`

```sh
cd "$SP/lane-fix-c2c" && git commit -- docs/COHESION_REMEDIATION_PLAN.md docs/DESIGN_FP_ARCH_GR.md docs/DESIGN_FP_ARCH_POP.md docs/DESIGN_FP_ARCH_TR.md docs/DESIGN_FP_ARCH_WF.md docs/DESIGN_FP_COUPLINGS.md docs/DESIGN_FP_INTERIOR.md docs/FABLE_VALIDATION_QUEUE.md docs/GEOPOLITICAL_WAR_LAYER.md docs/PHASE4_FAITH_DELTA.md docs/RISK_REGISTER.md docs/SUBSYSTEM_INTEGRATION_PLAN.md docs/briefs/W4c_GALLERY_IMPORT_BRIEF.md docs/implementation/preverification/EP-SUBSTRATE.md docs/implementation/preverification/WF-SUBSTRATE.md
```
Subject: `FIX-C2c: nineteen live-document citations re-addressed by symbol, each read against live source`

Trailer on all three: `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (the 2026-09-20
TRAILER RULING — an Opus lane signs as Opus). Keep any second attribution line the harness adds;
never amend.

After each: `git show --stat HEAD` must name ONLY that commit's paths. After the last:
`git status --short` must be EMPTY. If the pre-commit hook rewrote a file, re-run step 1 and 2.

## 8. after the batch

Refresh `$SP/lane-fix-c2c-scratch/FIX-C2c.receipt.md` with the executed count lines, the lighting
tuple the walker printed, and the three shas. Then report.

---

## The tree as it stands (18 files, all ` M`, none untracked)

```
 M docs/COHESION_REMEDIATION_PLAN.md          M docs/PHASE4_FAITH_DELTA.md
 M docs/DESIGN_FP_ARCH_GR.md                  M docs/RISK_REGISTER.md
 M docs/DESIGN_FP_ARCH_POP.md                 M docs/SUBSYSTEM_INTEGRATION_PLAN.md
 M docs/DESIGN_FP_ARCH_TR.md                  M docs/briefs/W4c_GALLERY_IMPORT_BRIEF.md
 M docs/DESIGN_FP_ARCH_WF.md                  M docs/implementation/preverification/EP-SUBSTRATE.md
 M docs/DESIGN_FP_COUPLINGS.md                M docs/implementation/preverification/WF-SUBSTRATE.md
 M docs/DESIGN_FP_INTERIOR.md                 M tests/lint/sourceCitationIntegrity.shared.mjs
 M docs/DESIGN_REALM_MAGIC_TOGGLE.md          M tests/lint/sourceCitationIntegrity.walker.test.js
 M docs/FABLE_VALIDATION_QUEUE.md
 M docs/GEOPOLITICAL_WAR_LAYER.md
```

⛔ The three prose-manifest recorder files are UNTOUCHED (`git status --porcelain` on them is empty).

## What is already proved, UNGATED, and what the batch is therefore confirming

Every arm was simulated with the SHIPPED detector under plain `node`
(`$SP/lane-fix-c2c-scratch/simulate-walker.mjs`, dump `sim-final.txt`):

```
guard-the-guard: codeFiles 5278 (>=5000) docs.all 513 (>=480) docs.live 483 (>=450) seen 955 (>=700) resolvable 897 (>=600)
landedPackets 192 (>=150)  symbolCorpus 5569 (>=5000)  docs reach 291 (>=200)
ARM 1 (code past-EOF, GATING): 0
ARM 2 (docs past-EOF): novel 0  cleared 0
ARM 3: 213  (code 4, docs 209)
ARM 4: seen 677 (>=400)  past-EOF 9
ARM 5: seen 169 (>=100)  resolved 98  open 71
archival byRule measured {"banner":8,"dated":5,"sha-pin":1,"tree":16}  baseline {…same…}  MATCH=true
```
Both new CONTROLS were executed as plain-node assertions and PASS
(`run-controls2.mjs`: the LANDED rule and the ambiguity reader, including its two refusals).
`node scripts/implementation-packets.mjs validate` → `valid: 194 packets (0 READY)`.
`node scripts/wiring-census.mjs --check` → `verified 708 pools / 2266 variants / 165 relation rows
against 7 stamped files`.

Goldens, before the first edit and after the last:
```
7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e  tests/fixtures/generator-golden-master.json
921c51cf6799ffdfdbffa3715fb496f7d15ce44fff508864653d8ebf3bb4db41  tests/fixtures/dossier-prose-manifest-golden.json
```

## The lighting delta — MEASURED FROM THE DIFF, and the expected red

Baseline in my tree (read from the file, not quoted from a brief):
`files 2664 · parked 359 · credited 2305 · titles 25501 · suiteTitles 6812`, `measuredAtSha d279d13eb`.

```
test FILES created or renamed under tests/ : 0
describe added: 0   removed: 0
titles added (4):
  + test('CONTROL: the LANDED rule excludes a landed packet and KEEPS a ready one'
  + test('CONTROL: the ambiguity reader resolves on evidence and REFUSES without it'
  + test('ARM 3 — REPORT-ONLY: citations whose named symbol has moved, over live code AND live docs'
  + test('ARM 5 — REPORT-ONLY: citations whose basename matches more than one file'
titles removed (1):
  - test('ARM 3 — REPORT-ONLY: citations whose named symbol has moved'
```
**MY DELTA: 0 files, 0 suites, NET +3 test titles** (one of the four added is ARM 3's rename).
Expected: the lighting walker asserts `files` first and PASSES at 2664, then reds on
`titles 25501 → 25504`. ⛔ NOT refrozen — the refreeze is the train's terminal act and the chair's.
