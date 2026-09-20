# FIX-K1 — LANE RESUME NOTE (paused at the gate, 2026-09-20 ~04:5x EDT)

Worktree `$SP/lane-fix-k1` · branch `fix-hasown-2026-09-20` · base `5a3380e8d`
`SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`

**Every ungated thing is done.** All 16 convicted `src/` sites are cured, 9 pins are written
into 8 EXISTING suites (no new test file), and **every pin has already been executed red
against the uncured tree and green against the cured tree in plain node** — see
`pinProbe.RED.txt` / `pinProbe.out.txt` / `refugePinProbe.RED.txt` / `leakProbe*.txt`.
The gated batches below are the vitest confirmation of a result I already have in hand.

**Nothing is staged.** Staging would break the red-first cycle (`git checkout --` restores
from the index). I stage by explicit pathspec in batch 6, immediately before the commit.

---

## ⛔ TWO THINGS FOR THE CHAIR TO RULE BEFORE / WITH "the gate is yours"

### (1) I widened the cure by FOUR lines beyond TOOL-7's convictions. Vetoable.

TOOL-7's arm A convicts `x in LIT` only. In three of the files I was already editing, the
**same class wears a different primitive** — a truthiness guard over a plain-object
accumulator — and all four are one line each:

| site | the guard | executed symptom, pre-cure |
|---|---|---|
| `src/lib/pulseFingerprint.js` `tallyByType` | `out[t] \|\| 0` | `npc_corruption_by_kind` = `{"valueOf":"function valueOf() { [native code] }1"}` |
| `src/lib/constructionUsage.js` `tierMix` | `out[t] \|\| 0` | same text inside the `tier_mix` telemetry row |
| `src/domain/spatial/commodityFlow.js` `setStock` | `!stocks[s]` | **`Object.grain = 5` — a write onto the global `Object`** |

**Why I took them rather than only slotting them.** The brief's own required pin for site 3
is *"a pin that a token `'toString'` mints no key and **the payload carries no function
text**"*. `extractPulseSummary` returns `tallyByType`'s output as `npc_corruption_by_kind` in
that same payload, so the required pin **cannot pass** unless `tallyByType` closes too. Once
`tallyByType` goes, leaving the byte-identical `tierMix` two files over is arbitrary. And
`setStock` sits four lines from commodityFlow's two convicted lines, is the only site in the
sweep that mutates a global, and curing the `in` above it does not touch that path.

**Each is exactly equivalent for every own key** — `setStock` keeps the old truthiness as a
conjunct (`!(Object.hasOwn(stocks, s) && stocks[s])`) rather than replacing it.

**To veto:** drop the three hunks named above plus the `tallyByType` hunk, and re-scope the
pulseFingerprint pin's last two assertions (`npc_corruption_by_kind` and `/native code/`) to
`effect_family_counts` alone. I will do it in one pass. The four slot rows are pre-written in
the receipt's noticed list if you would rather they became their own item.

### (2) The tier-band pair COLLAPSED to one resolver (the brief's acyclic arm).

Measured acyclic (`FIX-K1.evidence.md` §4): genesis's 27-module closure does not contain
politics, and politics's only `import(` of genesis is a JSDoc typedef in a comment.
So `resolveTierBand` is now **exported** from `genesis.js`, politics imports it, and
politics's own `TIER_INDEX` + copied resolver body are **deleted** (its `popToTier` /
`TIER_ORDER` import goes with them). `tierIndexOf` survives as a one-line delegate, so every
call site and its typing are unchanged. The copied family is gone; the "mirrors
genesis.resolveTierBand exactly" comment no longer has to be believed.

Bundle-neutral by measurement: politics has exactly one importer (`traditionsKernel.js:72`)
and it already imports genesis (`:59`).

---

## THE BATCHES, IN ORDER — one test directory per invocation, both exports inline

Shorthand used below (spelled out in full on every real command line, never via a variable —
zsh does not word-split an unquoted expansion, and that hazard already cost me one silent
no-op this lane):

    MUTEX = GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 \
            sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2

⛔ A gate line with no printed test count DID NOT RUN. All commands run from `$SP/lane-fix-k1`.

### BATCH 1 — RED-FIRST (its own batch; plant/restore via the saved patch)

The src cures live in `$SP/lane-fix-k1-scratch/FIX-K1.src-cures.patch` (18,540 bytes, 12
files). The reverse/forward cycle is **already verified** to apply cleanly both ways.

```
# 1a. ungated — revert src only; the pins stay in tests/
git apply -R "$SP/lane-fix-k1-scratch/FIX-K1.src-cures.patch"
git status --short        # must name tests/ ONLY (8 files)

# 1b. GATED — tests/domain (expect RED on 5 of the new titles)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain/traditionGenesis.test.js tests/domain/traditionsPolitics.test.js tests/domain/commercialReasons.test.js tests/domain/espionageDoctrine.test.js tests/domain/generosityKernel.refuge.test.js

# 1c. GATED — tests/lib (expect RED on 3 of the new titles)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lib/pulseFingerprint.test.js tests/lib/flags.test.js tests/lib/constructionUsage.test.js

# 1d. ungated — restore, and prove it
git apply "$SP/lane-fix-k1-scratch/FIX-K1.src-cures.patch"
git status --short        # must name all 20 files again
```

**The red I expect, already executed in plain node against the same uncured tree:**

| pin | pre-cure |
|---|---|
| genesis tier band | prototype tiers do **not** match the untiered control |
| politics scale-up | prototype tiers do **not** match the untiered control |
| commercialReasonMirrorOf | returns a **function** for four prototype names |
| pulseFingerprint payload | own keys gain `toString`/`constructor`; payload contains `native code` |
| flags | `flag('constructor')` returns a truthy function; warn count 0, not 8 |
| espionageDoctrine | **THROWS** `TypeError: targeting.replace is not a function` |
| generosity refuge (the family) | posture keys `["a:b","c:d"]` — **three persisted latches erased** |
| constructionUsage | the strayed hub reads `scattered`, not `hub-and-spoke` |

⚠ If 1b/1c come back GREEN, that is a STOP: it means the revert did not take (the failure
mode that already bit me once this lane). Check `git status --short` names tests/ only.

### BATCH 2 — the pin suites GREEN (cured tree)

Same two command lines as 1b and 1c, after the restore. All green.

### BATCH 3 — every consumer suite of the twelve touched files, by directory

```
# 3a. tests/domain  (51 files)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/domain/customFoundingTraditions.test.js tests/domain/traditionGenesis.test.js tests/domain/npcLadderFactionKey.test.js tests/domain/traditionsPolitics.test.js tests/domain/commercialReasons.test.js tests/domain/realmMagicDefaultConsumers.test.js tests/domain/gameGradePromotionContract.test.js tests/domain/espionageDoctrine.test.js tests/domain/espionageDoctrineStage.test.js tests/domain/espionageGauntlet.test.js tests/domain/missionDispatcher.test.js tests/domain/commodityFlow.test.js tests/domain/dispatchEV.integration.test.js tests/domain/marketPrices.test.js tests/domain/smuggle.integration.test.js tests/domain/events/generosityVerbs.test.js tests/domain/generosityKernel.belief.test.js tests/domain/generosityKernel.credit.test.js tests/domain/generosityKernel.purchase.test.js tests/domain/generosityKernel.refuge.test.js tests/domain/generosityKernel.tradeOverture.test.js tests/domain/generosityKernel.twoClaimants.test.js tests/domain/generosityKernel.zeroGrainGift.test.js tests/domain/gratitudeBonds.test.js tests/domain/intelActs.test.js tests/domain/demographicsMigration.test.js tests/domain/demographicsPlans.test.js tests/domain/envoyDiplomacy.test.js tests/domain/envoyPulseWiring.test.js tests/domain/envoyRansomWiring.test.js tests/domain/envoyRatificationWiring.test.js tests/domain/magicSubstitutionReagents.test.js tests/domain/npcDmVerbs.test.js tests/domain/routeNetworkCharter.test.js tests/domain/routeNetworkConsumers.test.js tests/domain/routeNetworkConsumersInterdiction.test.js tests/domain/routeNetworkConsumersRace.test.js tests/domain/routeNetworkConsumersStrategic.test.js tests/domain/routeNetworkDanger.test.js tests/domain/routeNetworkDecay.test.js tests/domain/routeNetworkDormancy.test.js tests/domain/routeNetworkFlows.test.js tests/domain/routeNetworkFlowsMetrics.test.js tests/domain/routeNetworkGenesis.test.js tests/domain/routeNetworkLedger.test.js tests/domain/sovereigntyMarketReadsWr10.test.js tests/domain/memoryWeaveGhostEvents.test.js tests/domain/traditionsKernel.test.js tests/domain/traditionsPilgrimage.test.js tests/domain/traditionsRelations.test.js tests/domain/advanceEpochStampSurvival.test.js

# 3b. tests/lib
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lib/pulseFingerprint.test.js tests/lib/flags.test.js tests/lib/constructionUsage.test.js tests/lib/crashForensicsBootTiming.test.js

# 3c. tests/property — THE GOLDEN PROOF (the byte-identity receipt the brief asks for)
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/property/generatorGoldenMaster.test.js tests/property/dossierProseManifest.test.js tests/property/traditionsDormancyGolden.test.js tests/property/generosityDormancyGolden.test.js tests/property/intelTradeDormancyGolden.test.js tests/property/espionageDoctrineDormancyFence.test.js tests/property/espionageRiderDormancyFence.test.js tests/property/casusCommerciiDormancyFence.test.js tests/property/roadsDormancyGolden.test.js tests/property/settlementPoliticsDormancyGolden.test.js

# 3d. tests/components
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/components/traditionsTab.test.jsx tests/components/economyFreshnessNote.test.jsx tests/components/handbookVoice.test.jsx

# 3e. tests/pdf
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/pdf/traditionsSection.test.jsx

# 3f. tests/store
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/store/npcVerbs.test.js

# 3g. tests/ui
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/ui/founderTileRestore.test.jsx
```

No seed in the estate carries a prototype-named tier or engine token, so every same-seed
output is byte-identical by construction and 3c is the proof.

### BATCH 4 — the standing instruments

```
# 4a. GATED — tests/copy
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/copy/voiceMechanics.test.js

# 4b. GATED — eslint on every touched file (12 src + 8 tests)
npx eslint src/domain/traditions/genesis.js src/domain/traditions/politics.js src/domain/worldPulse/commercialReasonTaxonomy.js src/lib/pulseFingerprint.js src/lib/flagRegistry.js src/domain/worldPulse/espionage/espionageDoctrine.js src/components/admin/AdminTrendsCharts.jsx src/lib/constructionUsage.js src/domain/spatial/commodityFlow.js src/domain/worldPulse/generosityKernel.js src/domain/worldPulse/routeNetworkLedger.js src/domain/worldPulse/traditionsKernel.js tests/domain/traditionGenesis.test.js tests/domain/traditionsPolitics.test.js tests/domain/commercialReasons.test.js tests/domain/espionageDoctrine.test.js tests/domain/generosityKernel.refuge.test.js tests/lib/pulseFingerprint.test.js tests/lib/flags.test.js tests/lib/constructionUsage.test.js

# 4c. GATED — SITE 10, the no-prototype-builtins population at my base
npx eslint --rule '{"no-prototype-builtins":"error"}' --no-eslintrc --parser-options=ecmaVersion:latest,sourceType:module --format unix src/ tests/ scripts/ 2>&1 | tail -3
#   ⚠ if --no-eslintrc is rejected by flat config, use instead:
npx eslint src/ tests/ scripts/ --format unix 2>&1 | grep -c "no-prototype-builtins"
```

**Site 10's rule, already decided conditionally:** if the count is **ZERO** I flip
`eslint.config.js:192` `'no-prototype-builtins': 'warn'` → `'error'`, in its **own second
commit**, quoting the zero. If it is not zero I leave the level, list every site in the
receipt as FIX-K2's population, and say so. Note the measurement is **independent of my
edits** — my cures remove `in` operators and add `Object.hasOwn` calls; neither is a
`no-prototype-builtins` subject (that rule flags `obj.hasOwnProperty(x)` and friends).

### BATCH 5 — `tests/lint` WHOLE, once

```
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint
```

**Lawful reds, and nothing else:** the lighting census by my declared delta. Anything else
— in particular `observedShapeReaders.walker.test.js` or `writerReach.walker.test.js` — is a
**STOP**, and I write `$SP/lane-fix-k1-scratch/FIX-K1.STOP.md` rather than improvise.
(Measured expectation: four landed commits edited `src/` without an OSR re-mint, and my
edits add no observed-shape read — evidence §5.)
This batch covers the tests/lint consumers: `commercialReasonTaxonomy.walker`,
`entropyRootCensus.walker`, `ruinFilterRoster.walker`, `seatVocabularyUnification.walker`,
`settlementMapSurfaceAllowlist.walker`, `negativeAssertionAnchor.walker`,
`mutationCoverageManifest`.

### BATCH 6 — the lighting walker ALONE, then commit

```
GATE_MUTEX_TIER=shared GATE_MUTEX_MAX_POLLS=100000 GATE_MUTEX_POLL_SECONDS=20 sh scripts/gate-mutex.sh --run -- npx vitest run --pool=threads --maxWorkers=2 tests/lint/sovereigntyLightingContract.walker.test.js
```

⛔ **NEVER refreeze.** Frozen at `2652·383·2269·25043·6679`. My delta, counted from the diff:
**0 new test files, +9 `it`/`test` titles, +3 `describe` titles.** Reading the register
commit at my base (`5a3380e8d`: `2651·383·2268·25035·6678` → +1 file, +8 titles, +1 suite),
position 4 is the title count, so the expected measured tuple is
`2652·383·(2269+?)·25052·6679` — **PLAUSIBLE only**; I record the tuple the walker actually
prints and my exact delta, and touch nothing.

Then, and only after every batch above is green or lawfully-red:

```
git add -- src/domain/traditions/genesis.js src/domain/traditions/politics.js src/domain/worldPulse/commercialReasonTaxonomy.js src/lib/pulseFingerprint.js src/lib/flagRegistry.js src/domain/worldPulse/espionage/espionageDoctrine.js src/components/admin/AdminTrendsCharts.jsx src/lib/constructionUsage.js src/domain/spatial/commodityFlow.js src/domain/worldPulse/generosityKernel.js src/domain/worldPulse/routeNetworkLedger.js src/domain/worldPulse/traditionsKernel.js tests/domain/traditionGenesis.test.js tests/domain/traditionsPolitics.test.js tests/domain/commercialReasons.test.js tests/domain/espionageDoctrine.test.js tests/domain/generosityKernel.refuge.test.js tests/lib/pulseFingerprint.test.js tests/lib/flags.test.js tests/lib/constructionUsage.test.js
git diff --cached          # read WHOLE before committing
git commit -- <the same 20 paths>
git show --stat HEAD       # must name exactly those 20
shasum -a 256 tests/fixtures/generator-golden-master.json tests/fixtures/dossier-prose-manifest-golden.json
```

---

## THE FILES IN FLIGHT (20; `git status --short` agrees)

**src (12, all cured):**
`traditions/genesis.js` · `traditions/politics.js` · `worldPulse/commercialReasonTaxonomy.js`
· `lib/pulseFingerprint.js` · `lib/flagRegistry.js` ·
`worldPulse/espionage/espionageDoctrine.js` · `components/admin/AdminTrendsCharts.jsx` ·
`lib/constructionUsage.js` · `spatial/commodityFlow.js` · `worldPulse/generosityKernel.js` ·
`worldPulse/routeNetworkLedger.js` · `worldPulse/traditionsKernel.js`

**tests (8, pins only — no new file, so no mutation-manifest row):**
`domain/traditionGenesis` · `domain/traditionsPolitics` · `domain/commercialReasons` ·
`domain/espionageDoctrine` · `domain/generosityKernel.refuge` · `lib/pulseFingerprint` ·
`lib/flags` · `lib/constructionUsage`

Diffstat: `20 files changed, 308 insertions(+), 30 deletions(-)`.
Goldens re-read after the last edit: **identical** to the pre-edit pair.

## WHAT REMAINS AFTER THE BATCHES

1. Possibly the second commit (site 10's eslint level), conditional on batch 4c's count.
2. The receipt `$SP/lane-fix-k1-scratch/FIX-K1.receipt.md`, filled by execution.
3. Nothing else. No build (the chair measures the dist at composition), no refreeze.
