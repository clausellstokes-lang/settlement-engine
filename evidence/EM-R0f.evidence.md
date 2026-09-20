# EM-R0f — EVIDENCE (the Opus COMPILE lane, session a9df403c, 2026-09-20)

Tree measured: `$SP/read-tip-141a1d775`, detached at **`141a1d775`**, `git status --short` EMPTY at start
(`Sun Sep 20 07:14:33 EDT 2026`). Every probe below is plain `node`, `git grep`, `grep` or `shasum` —
no vitest, no eslint CLI, no build. Every harness takes its TREE from `EM_R0F_TREE`, an explicit
environment variable with **no default** (the chair's 2026-09-20 rule).

---

## §1 · The tip and the preamble

```
$ git -C $SP/read-tip-141a1d775 rev-parse --short HEAD
141a1d775
$ git -C $SP/read-tip-141a1d775 status --short | wc -l
       0
$ shasum -a 256 docs/implementation/preambles/EM-PREAMBLE.md
16dfb96fa79320abc7dcfbdd8f5152b6aa66998c269287a951079df6c8223195  docs/implementation/preambles/EM-PREAMBLE.md
```
**MATCHES** the hash the launch brief names. §P2 row 12 present (the second amendment). CONFIRMED.

## §2 · The charter row and the ruling

```
$ git -C /Users/cstokes/Desktop/settlement-engine show review-fixes-2026-07-08:docs/OWNER_DECISION_QUEUE.md | grep -c 'EM-R0f'
1
```
ODQ **§934.47 addendum 35, ruling (1)**, read whole (line 32837):

> **EM-R0f (NEW, chartered): the economy fingerprint moves down a layer** — `fingerprintPowerEconomyInput`
> leaves `src/generators/` for `src/data/economyFingerprint.js` as its own golden-neutral member (a pure
> move: its pre-proof proves byte-identical fingerprints over all 525 rows; the domain→generators boundary
> ratchet's frozen set SHRINKS, never grows; `domainGeneratorsBoundary.test.js`'s stale header prose is
> corrected there; the worker's bytes measured), **because a `src/domain/edit/` import of `src/generators/`
> would be the ratchet's fifth file**, taking `R1`'s digest is refuted (31/315) and re-implementing spells
> one fact twice; EM-R0c depends on it.

Charter `EDIT-MODE-TRAIN.md` (ledger, `git show`), amendments of 2026-09-20 02:30, lines 407 and 409 — the
family's build order: **R0a · R0d · R0b v3 · R0f · R0c · R1–R5 · R6 · R7**. EM-R0f lands **before** EM-R0c.

## §3 · The function, at the tip, by symbol

```
$ git grep -n 'fingerprintPowerEconomyInput' HEAD -- src tests scripts
HEAD:src/generators/power/economyReconciliation.js:100:export function fingerprintPowerEconomyInput(economicState, tier) {
HEAD:src/generators/power/economyReconciliation.js:171:    powerStructure.economyInputFingerprint = fingerprintPowerEconomyInput(
HEAD:src/generators/power/economyReconciliation.js:358:  const expected = fingerprintPowerEconomyInput(economicState, tier);
HEAD:tests/generators/powerEconomyFreshness.test.js:18:  fingerprintPowerEconomyInput,
HEAD:tests/generators/powerEconomyFreshness.test.js:156:          fingerprintPowerEconomyInput(first.economicState, first.tier),
```
**THE CONSUMER CENSUS — DENOMINATOR 5 of 5 rows** (whole repo, no pathspec, also 5 — nothing outside
`src`/`tests`/`scripts` names it):

| # | Site | Disposition |
|---|---|---|
| 1 | `src/generators/power/economyReconciliation.js:100` — the declaration | **MOVES** (the CREATE row) |
| 2 | `src/generators/power/economyReconciliation.js:171` — `projectPowerGenerationIntent` stamps it | **RE-POINTED** by the file's new import; the call text is unchanged |
| 3 | `src/generators/power/economyReconciliation.js:358` — `assertPowerEconomyFreshness` | **RE-POINTED** by the same import; call text unchanged |
| 4 | `tests/generators/powerEconomyFreshness.test.js:18` — a multi-symbol import | **RE-POINTED** — split out of the generator's import block into its own from `src/data/` |
| 5 | `tests/generators/powerEconomyFreshness.test.js:156` — the call | unchanged (the binding is the same name) |

**No re-export is owed:** the only importer outside the moved file is row 4, which the packet re-points in
the same commit. (The launch brief's "prefer none" is satisfiable.)

### §3.1 · The cluster the move must carry is CLOSED
```
$ grep -n 'economyProjectionInput' src/generators/power/economyReconciliation.js
85:function economyProjectionInput(economicState, tier) {
101:  const input = economyProjectionInput(economicState, tier);
$ grep -n 'ECONOMY_FINGERPRINT_VERSION' src/generators/power/economyReconciliation.js
37:const ECONOMY_FINGERPRINT_VERSION = 'power-economy-v1';
103:    ECONOMY_FINGERPRINT_VERSION,
110:  return `${ECONOMY_FINGERPRINT_VERSION}:${digest}`;
$ git grep -n 'economyProjectionInput\|ECONOMY_FINGERPRINT_VERSION' HEAD -- src tests scripts | wc -l
       5
```
Both helpers are used **only inside `fingerprintPowerEconomyInput`** and nowhere else in the estate. The
move therefore carries exactly three declarations and the remainder loses nothing it still uses.

### §3.2 · The imports the moved body needs
```
$ grep -n 'fnv1a32' src/generators/power/economyReconciliation.js
24:import { fnv1a32 } from '../../kernel/proseHash.js';
109:  const digest = fnv1a32(serialized).toString(16).padStart(8, '0');
```
`fnv1a32` is used **only** at `:109`, inside the moved function ⇒ the remainder's `:24` import becomes
unused and **must be deleted with it** (else `no-unused-vars`). Every other import of the file has ≥2
occurrences and stays. ⭐ **The body imports NOTHING from `src/generators` or `src/domain`** — the launch
brief's split-ruling condition does not fire.

## §4 · The new home is lawful — measured, not assumed

```
$ git grep -n "from '../kernel/" HEAD -- src/data
HEAD:src/data/historyData.js:12:import { pickVariant } from '../kernel/proseHash.js';
HEAD:src/data/institutionalCatalog.js:3:import { slugify as kernelSlugify } from '../kernel/slugify.js';
HEAD:src/data/npcData.js:4:import { pickVariant } from '../kernel/proseHash.js';
```
**`src/data → src/kernel/proseHash.js` is an EXECUTED precedent, twice.**

`eslint.config.js:859-877` — the `src/data/**` purity override, read whole. Its `no-restricted-imports`
group is `['**/generators/**','**/store/**','**/lib/**','**/kernel/prng*','**/kernel/rngContext*']`, and its
own comment states *"The kernel layer is NOT banned wholesale — data legitimately imports the pure,
deterministic kernel/slugify.js"*. `kernel/proseHash.js` matches **no** banned pattern.

Its paired enforcer `tests/domain/dataPurity.test.js` has exactly **three** arms (`:57`, `:73`, `:101`):
no `generators|store|lib` import (`FORBIDDEN = /(^|\/)(generators|store|lib)(\/|$)/`, `:48`), no
`rngContext` capture, no `kernel/prng`. **There is no arm forbidding an exported function in `src/data`.**

```
FILES WITH EXPORTED FUNCTIONS: 16 of 57   (src/data)
  constants.js:6  foundingSeeds.js:1  institutionLadders.js:2  informationBrokerageTuning.js:8
  sampleSettlements.js:2  monsterThreat.js:1  entityTags.js:1  roadmapLedger.js:2  cultureProfiles.js:4
  npcTraitWeights.js:1  biomeTexture.js:2  finishedGoodsCategory.js:1  historyData.js:1
  institutionalCatalog.js:2  roadsProse.js:1  securityQuestions.js:2
```
A pure function in `src/data` is precedented in **28 %** of the layer. **The placement premise HOLDS.**

## §5 · THE BOUNDARY RATCHET — the measurement that qualifies the charter's shrink clause

The walker is **`tests/build/domainGeneratorsBoundary.test.js`** (found by symbol; it is NOT under
`tests/lint/`). Read whole. Its `BASELINE_EDGES` (`:60-65`):

```
'src/domain/coherence/checkDraftEdit.js':            ['../../generators/structuralValidator.js'],
'src/domain/relationships/neighbourBackLink.js':     ['../../generators/crossSettlementConflicts.js'],
'src/domain/worldPulse/institutionLifecycle.js':     ['../../generators/computeActiveChains.js'],
'src/domain/worldPulse/resourceDynamicsKernel.js':   ['../../generators/computeActiveChains.js', '../../generators/terrainHelpers.js'],
```
Re-running the walker's **own** `liveEdges()` logic in plain node at `141a1d775`:
```
live importing FILES     = 4
live SPECIFIER count     = 5   (cardinality arm asserts <= 6)
SLACK in the cardinality arm = 1
```
⛔ **NO ROW NAMES `economyReconciliation.js`, AND NO `src/domain/**` FILE IMPORTS THE FINGERPRINT TODAY**
(census §3: 5 hits, all in the generator and its own test). ⇒ **EM-R0f retires ZERO baseline rows. The
frozen set does not shrink; it is unchanged.** The move is **PREVENTIVE**: it removes the reason EM-R0c
would otherwise have had to become the baseline's FIFTH file — which is exactly the charter's own
`because` clause. The launch brief's instruction "declare the exact rows" is answered: **none**. (Q1.)

### §5.1 · The stale header prose, itemised against the tree
| # | The claim | Where | The measurement |
|---|---|---|---|
| a | "`src/domain/worldPulse`, ~22.7k LOC" | `:9` | **183,678 lines across 443 files** (`find src/domain/worldPulse -name '*.js' \| xargs wc -l`) |
| b | "Baseline captured at HEAD 8e10816" + **six** numbered rows | `:44-51` | Three of the six (`defenseDisplay`, `mutateEntities`, `pulseKernel`) the W6 comment at `:52-59` itself says are GONE; the live set is **4 files / 5 specifiers** |
| c | `it('baseline is exactly the 6 known edges (cardinality guard)')` | `:159` | the baseline is **4 files / 5 edges**; the live count is **5** |
| d | `expect(liveCount).toBeLessThanOrEqual(6)` | `:164` | **one unit of slack** in a set whose own header says it "can only SHRINK" |

## §6 · THE GOLDEN-NEUTRALITY PROOF — the packet's own acceptance case

`golden-neutrality-probe.mjs` (this scratch), plain node, 8 s, executed twice — once against a verbatim
candidate, once against the **actual generated leaf text** resolved through the tree's own kernel:

```
$ EM_R0F_TREE=$SP/read-tip-141a1d775 node golden-neutrality-probe.mjs
corpus rows = 525
rows measured                 = 525
distinct fingerprints          = 35
distinct fingerprint INPUTS    = 35
disagreements                  = 0

SHA-256 (PRE,  current home)   = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
SHA-256 (POST, moved leaf)     = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
SHA-256 (STAMP, as written)    = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
ALL THREE IDENTICAL            = true
```
and against the real leaf file (`sim/after/src/data/economyFingerprint.js`, its own
`import { fnv1a32 } from '../kernel/proseHash.js'` resolved):
```
rows           = 525
disagreements  = 0
PRE  sha256    = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
POST sha256 (THE REAL GENERATED LEAF) = 318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18
IDENTICAL      = true
```
⭐ **THE FIGURE THE BUILD LANE REPRODUCES: `318fb81a94ca724d664907bc3cdd1602a995df2b6c7c32f5dca4022887618e18`.**
The corpus is `tests/helpers/goldenMasterCorpus.js`'s `goldenCorpus()` (**525 rows**, matching
`tests/fixtures/generator-golden-master.json`'s **525** keys), the settlement built by the golden master's
own `generateSettlementPipeline(cfg, null, { seed: _seed, customContent: {} })`, and the digest is SHA-256
over `keyOf(c) \t fingerprint` joined by newline in corpus order. The third column proves the function's
output is what the pipeline actually **writes** to `powerStructure.economyInputFingerprint`, so the pin is
on the record and not only on the call.

## §7 · VERBATIM FIDELITY AND THE BUDGET

`build-sim.mjs` reconstructs the post-move pair **from the tip's own bytes** and refuses unless ten
text guards match (it exits 3 on any mismatch; it exited 0):
```
original lines   = 368
remainder lines  = 339 (delta -29)
new leaf lines   = 52
```
`budget-probe.mjs` (eslint's `Linter`, `max-lines` with `skipBlankLines`+`skipComments`, eslint resolved
from the TREE):
```
EFFECTIVE LINES
  economyReconciliation.js BEFORE = 280
  economyReconciliation.js AFTER  = 259 (delta -21)
  src/data/economyFingerprint.js  = 22     [leaf cap 250]
  NEW/CHANGED production effective lines = 44   [packet cap 400]

VERBATIM CHECK — each moved chunk present byte-identical in the new leaf:
  VERBATIM  ECONOMY_FINGERPRINT_VERSION (line 37)
  VERBATIM  economyProjectionInput (lines 85-92)
  VERBATIM  JSDoc + fingerprintPowerEconomyInput (lines 94-111)
  ALL THREE VERBATIM = true

ABSENCE CHECK — the remainder keeps none of them:
  absent / absent / absent
  remainder still exports fingerprintPowerEconomyInput = false
  remainder imports it instead = true
  remainder still imports fnv1a32 = false

LINTER POSTURE (no-unused-vars / no-undef, in-process API):
  remainder : 0 message(s)
  new leaf  : 0 message(s)
```

## §8 · THE BYTE BUDGETS (§P2 row 11), each measured

**Closures** (`closure-probe.mjs`; the eager set imported from `vite.config.js`'s own export, never a replica):
```
GENERATION WORKER closure (seed src/workers/generation.worker.js)
  static-only src modules  = 220        static+dynamic = 228
  economyReconciliation.js in worker static closure = true
  kernel/proseHash.js in worker static closure      = true

EAGER_FIRST_PAINT_MODULES size = 268
  eager has src/generators/power/economyReconciliation.js = false
  eager has src/kernel/proseHash.js                       = true
  eager src/data members (12): constants, entityTags, finishedGoodsCategory, goods/identity,
    institutionServiceKeys.generated, institutionalCatalog, npcTraitWeights, powerData,
    resourceData, stressTypes, stressorSpinePhrases, traditionProse

MAIN GRAPH
  static+dynamic modules = 1958   STATIC-only = 243
  economyReconciliation.js reachable from main (static+dyn) = true
  economyReconciliation.js in main STATIC-only closure      = false
  => it rides the LAZY engine chunk (reachable, not eager)  = true
```
⇒ the leaf lands in **the generation worker** and **the lazy engine**, and **NOT** in first paint.
(⚠ 220 is a *src-only static* walk; the emitted worker bundle's own module count is ~231 per
`generationWorkerLazy.test.js:78`. The membership verdict is the same under either denominator.)

**The minified delta** (esbuild 0.28.1 from the tree — the same per-module estimate EM-P3 used):
```
  BEFORE  economyReconciliation.js        = 4603
  AFTER   economyReconciliation.js        = 4246
  AFTER   src/data/economyFingerprint.js  =  449
  AFTER total                             = 4695
  DELTA (after - before)                  =  +92 B
```
The +92 B is pure module-boundary overhead — the same expression tree, one extra module wrapper and one
export binding. Rollup's cross-module scope hoisting normally renders **less** than esbuild's per-module
estimate, so +92 B is conservative. **Bound stated to the build lane: ≤184 B (the measured estimate ×2),
EM-P3's precedent form.**

**Headroom.** Worker: `WORKER_BUNDLE_CEILING_BYTES = 1401208` (`generationWorkerLazy.test.js:159`),
**monotone-down and 0 B slack by construction** ⇒ any rise needs the chair's re-mint. Lazy engine:
`expect(size).toBeLessThan(679_000)` (`vendorPdfLazy.test.js:787`); the last RECORDED measurement is
**677,935 B** (EM-P3's note at `generationWorkerLazy.test.js:~83`, where the engine SHRANK 678,131 →
677,935) ⇒ 677,935 + 184 = **678,119**, and with the ~700 B cross-environment margin the three prior
raises kept, **678,819 < 679,000** — it FITS with ~181 B to spare. ⚠ The 677,935 figure is a recorded
measurement at EM-P3's tip, **PLAUSIBLE** for `141a1d775`; only a real build re-measures it.

**Edge-shared (§P2 row 10 — INPUT membership, never entry-hood):**
```
metas (5): aiCharterBundle(114) aiGroundingBundle(74) aiOutputSchemaBundle(115)
           analyticsEventsBundle(2) intentAtlasBundle(2)
HITS for src/generators/power/economyReconciliation.js : 0
HITS for src/kernel/proseHash.js                       : 0
HITS for src/data/economyFingerprint.js                : 0
```
⇒ **NOT OWED.** No `build:edge-shared`, so §P2 row 12's seven-path hazard and the generator-last
ordering hazard do not arise.

## §9 · EVERY OTHER REGISTER, MEASURED

| Register | Verdict | Measurement |
|---|---|---|
| **sovereignty lighting** (`tests/lint/.lighting-census-baseline.json`) | **DELTA `0 / 0 / 0 / 0 / 0`** | Committed tuple reads `files 2653, parked 383, credited 2270, titles 25052, suiteTitles 6680` — matches the frozen `2653·383·2270·25052·6680` exactly. The baseline stores **five integers and metadata only** (`_doc, measuredAtSha, measuredBy, date, note`) — **no title text**. EM-R0f CREATEs and RENAMEs **no test file** and adds/removes **no `describe`/`it`**, so every figure is pinned by the contract. A title *rewording* (§5.1 c) moves no count. ⛔ No absolute is quoted in the packet. |
| **tuning register** (`tests/lint/.tuning-inventory.json`) | ⭐ **UNCHANGED — EXECUTED both ways** | `TREES_P1=["src"]`, `TREES_P2P3=["src/domain","src/generators"]` (printed from `scripts/lib/tuning-inventory.mjs`). Running the register's OWN `countUnregisteredNamed`/`countBareDecimals` over the before/after sim roots with trees `['src/generators','src/data']`: **before `{economyReconciliation.js: 2}` sites `[POWER_INTENT_VERSION, POWER_PROJECTION_VERSION]`; after IDENTICAL**; bareDecimals `{}` both. The committed row is **2** — matches. The moved `ECONOMY_FINGERPRINT_VERSION` is a **string**, so it was never in P2; `16`/`8` are **integers**, which P3 explicitly does not count. The new leaf produces **no row** even when `src/data` is forced into the trees, and `src/data` is not in `TREES_P2P3` at all. 0 `_TUNING` tables in the file ⇒ no P1 row. |
| **observed-shape readers** (`scripts/.observed-shape-readers-baseline.json`) | **NOT OWED** | The three tree manifests (`executionTree` 2256, `scanTree` 2228, `sourceTree` 2245) are **content-addressed and frozen at `31ab5d18bdd44ba0691c2e16f3ae8f3cfef36eb1`**, not re-taken at a landing. ⭐ **EXECUTED PRECEDENT: EM-P3 (LANDED) MODIFIED `src/generators/steps/resolveConfig.js` and CREATED `src/data/worldFactOptions.js`, and (a) its changeManifest names this baseline nowhere, (b) `worldFactOptions.js` is ABSENT from all three trees** (measured). The file's `inventory` row is `{"source on factions": 1}` — that read is `faction?.source` in `isNeighbourFaction` (`:74`), which **stays**. The moved body's reads (`economicState.prosperity`, `.safetyProfile.safetyLabel`, `.foodSecurity.label`) are in the scanner's **unresolved** population (118,410 of 128,176 reads). `src/data` has only 2 inventory members. |
| **writer-reach** (`scripts/.writer-reach-baseline.json`) | **NOT OWED** | `grep -c 'economyReconciliation' = 0` — the baseline addresses by identity, not path. Its row `"economyInputFingerprint on powerStructure"` (rows 420) names the **key and shape**; the WRITE (`:171`) stays in `economyReconciliation.js`. Nothing under `src/domain/edit/**` is added (§P2 row 4). |
| **prose-numerics** (`tests/lint/.prose-numerics-baseline.json`) | **NOT OWED** | 0 rows name either path; the packet renders no figure (§P2 row 7). No line-addressed row sits below an insertion point. |
| **prose wiring census** (`docs/content/wiring-census.json`) | **NOT OWED** | `grep -c 'economyReconciliation' = 0` ⇒ not a stamped producer (`stamp.files`); no `stale-bytes` red. |
| **`path:line` citations** (pre-proof step 16) | **NOT OWED** | `git grep -n 'economyReconciliation\.js:[0-9]' HEAD -- src docs tests scripts` ⇒ **0 hits**. The move deletes 29 lines from the middle of the file and shifts **nothing** that is addressed by line. |
| **mutation coverage** (`scripts/mutation-coverage-manifest.json`) | **NOT OWED** | Keyed by **invariant TEST FILE**. `tests/generators/powerEconomyFreshness.test.js` → already `kind=rationale`; `tests/build/domainGeneratorsBoundary.test.js` → **NOT ENUMERATED**. EM-R0f creates/renames no test file, so nothing enters or goes stale (§P2 row 2). |
| **entropy-root census** (`tests/lint/entropyRootCensus.walker.test.js`) | ⭐ **SURVIVES — measured** | NC-1, the walker's **MANDATORY LIVE negative control**, is this very file (`:185`, `:605`). It asserts by **TEXT, not line**: `toContain('rngSeed: stepRng.fork(POWER_STREAM).seed,')` and `toContain('createPRNG(intent.rngSeed)')`. Both sit in `createPowerGenerationIntent`/`projectPowerGenerationIntent`, which **stay**; `grep -c` on the simulated remainder returns **1** for each. `WRITE_KEY_SITES`' exact-set equality is by **path**, and the path is unchanged. |

### §9.1 · Cross-packet discharge (pre-proof step 10)
```
EP-0 [LANDED] requiredSymbols: src/generators/power/economyReconciliation.js
              | "rngSeed: stepRng.fork(POWER_STREAM).seed,"
grep -c on sim/after/.../economyReconciliation.js  ->  1
```
⇒ **EP-0's row is DISCHARGED by construction** — EM-R0f does not touch that text. It is the only
`requiredSymbols` row in the whole 193-entry manifest naming this path.

**Collision scan across all 193 manifest entries** for every path EM-R0f names: the single hit is
`EM-P3 [LANDED] TEST tests/build/generationWorkerLazy.test.js`. `TERMINAL_PACKET_STATUSES =
{LANDED, SUPERSEDED}` (`implementation-packets.mjs:43`) and change paths are reserved only when
`!TERMINAL_PACKET_STATUSES.has(status)` (`:676`) ⇒ **LANDED does not reserve. No P-23 collision.**
Only 3 of 193 entries are non-terminal (all `READY`) and none names a path of this packet.

## §10 · The sealed dispatch, read dry
`scripts/implementation-session.mjs`'s checks against `141a1d775` once the chair sets the base to the tip:
branch name — the chair's; ancestry — the tip is the integration branch's head; substrate unchanged since
the verified base — trivially true at the tip; **CREATE target absent** — `src/data/economyFingerprint.js`
does not exist (`existsSync` false, probe §8); git-clean — `git status --short` empty, confirmed at start
and again at the close of this lane. `PACKET_STATUSES` includes `DRAFT`; `PACKET_ACTIONS` =
`CREATE, DOC, MODIFY, REGISTER, TEST` (`implementation-packets.mjs:21-37`) — every action used is a member.

## §11 · Close-out
```
$ git -C $SP/read-tip-141a1d775 status --short | wc -l
       0
```
No tracked file was edited, staged or committed. Everything written by this lane lives under
`$SP/lane-em-compile-EM-R0f-scratch/`.
