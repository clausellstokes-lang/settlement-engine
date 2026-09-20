# TOOL-12 — the engine chunk's headroom hunt: where the 678 kB is, which of it the chunk never reads, and what a move costs

**Lane:** TOOL-12 (Opus RECON, read-only). **Chair:** Fable 5.1, session a9df403c.
**Stamp (read from `date` in the same call as the last measurement):** `Sun Sep 20 08:18:48 EDT 2026`.
**Read tip:** `/private/tmp/.../scratchpad/read-tip-ec0a30da2` at `ec0a30da290bc1e65dcf118425637eb5142fe36c` ("EM-P2: generation's held and chosen facts registered…"). `git status --short` EMPTY at start and at end.
**Dist read (no build run by this lane):** `$SP/lane-tool-12-scratch/dist-ec0a30da2/` — 545 emitted `.js` assets.
**Instruments written by this lane (all plain `node`, no gate, no build):** `$SP/lane-tool-12-scratch/tools/{budgets,attrib,graph,consumers,price,literals,span,excisions}.mjs`.
**EDITED NOTHING** under `src/`, `tests/` or `vite.config.js`.

---

## 0. Headline

The 181 B is not a problem. **CONFIRMED:** at this tip the engine chunk's headroom is **365 B** (1,064 B of raw slack under the strict `< 679_000`, less the kept ~700 B cross-environment margin), which becomes the brief's **181 B** once EM-R0f's +184 B bound is carried. Against that, placement alone reaches **~99 kB** — and the single lowest-risk move, measured by the module's own authored text inside the emitted chunk, is worth **35,858 B**, i.e. **198× the shortfall**, for one line of `vite.config.js` and no source file touched.

**The move I would make first:** pin `src/data/narrativeData.js` to its own lazy chunk. Its force-route into `engine` (`vite.config.js:878-879`) rests on a rationale the file's own header refutes in terms.

---

## 1. The three budgets side by side, by the tests' own arithmetic

Reproduced with the test files' own functions transcribed verbatim (`staticImportSpecifiers`, `findEntryChunk`, `entryStaticClosure`, `entryTransferMeasurement`, the `readdirSync`/`statSync` discovery rules). **All CONFIRMED by execution** (`tools/budgets.mjs`).

### Budget 1 — the first-paint entry static closure (`vendorPdfLazy.test.js:565,595,596`)

Entry `index-BjuVoCsv.js`; BFS over static `from`/bare specifiers; **8 files**.

| raw | gzip(level 9) | Brotli(q11) | file |
|---|---|---|---|
| 5,349 | 2,605 | 2,237 | content-identity-CFIG6Vg0.js |
| 114,915 | 33,975 | 28,092 | data-CDNPcuw5.js |
| 125,886 | 40,231 | 34,405 | engine-core-DEo3MRBd.js |
| 568,871 | 180,404 | 149,123 | index-BjuVoCsv.js |
| 10,465 | 4,266 | 3,783 | kernel-CCDqucz0.js |
| 3,579 | 1,472 | 1,319 | vendor-icons-QPeTlGyd.js |
| 193,156 | 60,435 | 52,071 | vendor-react-1ny_Qquz.js |
| 17,046 | 7,106 | 6,426 | vendor-state-DNkFjvLy.js |

- raw **1,039,267** / 1,048,000 → **margin 8,733**
- gzip **330,494** / 337,000 → **margin 6,506**
- Brotli **277,456** / 283,000 → **margin 5,544**

### Budget 2 — the lazy engine chunk (`vendorPdfLazy.test.js:746-788`)

Discovery rule, the test's own: `files.find(f => /^engine-[A-Za-z0-9_-]+\.js$/.test(f) && !/^engine-core-/.test(f))` → **`engine-v9Z9eGQ1.js`**. (`engineChunkLazy.test.js:43`'s `ENGINE_CHUNK_RE` selects the same single file; `matches = 1`, so neither rule is ambiguous at this tip.)

- `statSync(...).size` = **677,935 B**
- `expect(size).toBeGreaterThan(300_000)` → true; `expect(size).toBeLessThan(679_000)` → true, **strict**, so the largest legal value is **678,999** ⇒ **raw slack 1,064 B**
- the four raise notes keep a declared **~700 B cross-environment Rollup margin** ⇒ **effective headroom 365 B**
- with EM-R0f's bound of **+184 B**: **181 B** — the brief's figure, reproduced (679,000 − 677,935 − 184 − 700 = 181)
- `engineChunkLazy.test.js:62-68`'s band (`>200_000`, `<1_400_000`) is ~2× looser and never binds.
- Not budgeted, recorded for the chair: engine gzip(9) = **222,180 B**. There is no compressed ceiling on this chunk.

### Budget 3 — the generation worker bundle (`generationWorkerLazy.test.js:159,468-480`)

- `generation.worker-ChvrnTyn.js` = **1,401,208 B**; `WORKER_BUNDLE_CEILING_BYTES` = **1,401,208**
- `toBeLessThanOrEqual` ⇒ **slack exactly 0 B**. The ceiling was re-minted at the measurement by EM-P3, which is what monotone-down means.

**⛔ And there is no placement cure available on the worker side.** `vite.config.js` sets only `worker: { format: 'es' }` and never `worker.rollupOptions`, so `build.rollupOptions.output.manualChunks` does **not** govern worker builds. CONFIRMED two ways: the worker bundle inlines 230 modules and emits exactly one split chunk (`livingContentRoster`), and the same source modules appear inside it at full rendered length. Any generator byte that reaches the worker must be **bought back inside the worker's own files**; only the main graph can be cured by placement.

---

## 2. Attributing the engine chunk per module

### 2.1 What instrument, and why not `attrib.config.mjs`

`$KIT/tools/attrib.config.mjs` is a **build wrapper**: it records `chunk.modules[id].renderedLength` in `generateBundle`, so it needs a `vite build`. This lane runs no build. **The copied dist carries no metafile and no sourcemap** (`find … -name '*.map'` → 0; `sourcemap: false` is in the wrapper and `tests/build/sourcemapAbsence.test.js` pins it for the real build).

What I used instead: **the chair's own instrument's recorded output**, `$SP/attrib-head.json` (545 chunks; the file at `$SP/attrib.config.mjs` is **byte-identical** to the kit's — `diff` clean). Its engine entry is `assets/engine-DbLPMVNN.js`, **676,207 B, 114 modules**.

**Staleness, stated exactly.** That build's `generation.worker` measures 1,399,946 B, i.e. the tip of the 2026-09-19 sacred-house mint (ODQ §934.19 addendum), **before** trains EM-T2/EM-P0 and EM-P3. Engine then 676,207 → now 677,935 = **+1,728 B (0.26 %)**, of which the estate's own attributed notes account for +1,182 (EM-P0: `pipeline.js` 9,843→12,548, `steps/generatePopulation.js` 6,864→9,702) and −196 (EM-P3), leaving ~742 B between `attrib-head`'s tip and EM-T1's terminal `ed9d99295` (the raise note measures 676,949 there). **The per-module table below is therefore accurate to ~0.26 % and two named modules; label it PLAUSIBLE-at-this-tip, CONFIRMED-at-its-own.** Membership was separately re-derived AT the read tip (§2.3) and is unchanged.

- sum of `renderedLength` over the 114 = **1,572,485**; emitted 676,207 ⇒ **minification factor 0.4300** (chunk-wide average — per-module it varies hard, see §3b).

### 2.2 The table (top 40; the tail summed)

| # | rendered | share | module |
|---|---|---|---|
| 1 | 63,986 | 4.07 % | src/generators/npcGenerator.js |
| 2 | 46,021 | 2.93 % | src/generators/computeActiveChains.js |
| 3 | 43,968 | 2.80 % | src/generators/narrativeText.js |
| 4 | 43,895 | 2.79 % | src/generators/narrativeGenerator.js |
| 5 | 43,035 | 2.74 % | src/generators/power/rulingStructure.js |
| 6 | 41,420 | 2.63 % | src/generators/safetyProfile.js |
| 7 | 40,676 | 2.59 % | src/generators/historyGenerator.js |
| 8 | 40,115 | 2.55 % | src/generators/economy/economicState.js |
| 9 | 39,921 | 2.54 % | src/generators/npcStructure.js |
| 10 | 39,857 | 2.54 % | **src/data/narrativeData.js** |
| 11 | 37,436 | 2.38 % | src/generators/structuralValidator.js |
| 12 | 35,699 | 2.27 % | src/generators/generateSettlementPipeline.js |
| 13 | 35,015 | 2.23 % | src/generators/economy/foodBalance.js |
| 14 | 34,302 | 2.18 % | src/generators/power/governanceNarrative.js |
| 15 | 33,410 | 2.12 % | src/generators/defenseGenerator.js |
| 16 | 32,258 | 2.05 % | src/generators/priorityHelpers.js |
| 17 | 31,113 | 1.98 % | src/generators/steps/assembleInstitutions.js |
| 18 | 29,509 | 1.88 % | src/generators/factionDynamics.js |
| 19 | 28,403 | 1.81 % | src/generators/services/serviceClassifier.js |
| 20 | 27,730 | 1.76 % | src/generators/density/densityRoll.js |
| 21 | 26,261 | 1.67 % | src/generators/economy/viability.js |
| 22 | 26,082 | 1.66 % | src/generators/generationReceiptJudgments.js |
| 23 | 25,777 | 1.64 % | src/generators/foodGenerator.js |
| 24 | 24,195 | 1.54 % | src/generators/steps/resolveResources.js |
| 25 | 23,909 | 1.52 % | src/generators/services/serviceCategoryTables.js |
| 26 | 21,323 | 1.36 % | src/generators/power/stressFactions.js |
| 27 | 20,970 | 1.33 % | src/generators/factionRoles.js |
| 28 | 19,686 | 1.25 % | src/generators/density/applyDensityLaw.js |
| 29 | 19,105 | 1.21 % | src/generators/resourceGenerator.js |
| 30 | 18,787 | 1.19 % | src/generators/steps/generateEconomy.js |
| 31 | 18,549 | 1.18 % | src/generators/neighbourGenerator.js |
| 32 | 17,861 | 1.14 % | src/generators/generationCoherence.js |
| 33 | 17,359 | 1.10 % | src/generators/spatialGenerator.js |
| 34 | 17,134 | 1.09 % | src/generators/economy/prosperity.js |
| 35 | 17,082 | 1.09 % | src/generators/steps/coherenceRepairPass.js |
| 36 | 16,041 | 1.02 % | src/generators/power/factionStanding.js |
| 37 | 15,625 | 0.99 % | src/generators/stressGenerator.js |
| 38 | 14,514 | 0.92 % | src/generators/generationContext.js |
| 39 | 14,413 | 0.92 % | src/generators/steps/resolveConfig.js |
| 40 | 14,291 | 0.91 % | src/generators/institutionProbability.js |

**TOP 40 = 1,156,733 rendered (73.6 %). LONG TAIL (74 modules) = 415,752 (26.4 %).**

**The seven non-`src/generators/` members** — one force-routed by a rule, six orphans Rollup co-located here:

| rendered | module | why it is here |
|---|---|---|
| 39,857 | src/data/narrativeData.js | force-routed by an explicit rule, `vite.config.js:878-879` |
| 5,976 | src/domain/content/livingContentLawVersion.js | ESD excision, deliberately UNPINNED (SEAMCYCLE) |
| 5,014 | src/domain/customCategories.js | ESD excision, UNPINNED |
| 3,977 | src/lib/narrativeMutations.js | no rule matches; co-located |
| 3,158 | src/domain/content/livingContentSeam.js | ESD excision, deliberately UNPINNED (MAT-SEAM) |
| 3,151 | src/lib/prebuiltResourceChains.js | no rule matches; co-located |
| 2,234 | src/domain/magicFilter.js | ESD excision, UNPINNED |

### 2.3 Membership re-derived AT the read tip (no build)

`tools/graph.mjs` imports `vite.config.js` from the read tip and **executes the shipped `manualChunks`** over a static import graph read with the config's own regexes (2,247 `src/**` modules).

**The membership arithmetic closes exactly**, which is what makes the stale table safe to reason on:

- `manualChunks(id) === 'engine'` for **111** modules at this tip (every `/src/generators/**` leaf, plus `src/data/narrativeData.js` by its own rule).
- **3 of the 111 are ABSENT from the emitted chunk** — the dark density trio of §3a, tree-shaken.
- **6 modules are present but match NO rule** — the orphans Rollup co-located: `livingContentLawVersion`, `customCategories`, `narrativeMutations`, `livingContentSeam`, `prebuiltResourceChains`, `magicFilter`.
- **108 + 6 = 114**, the emitted count. No unexplained member, in either direction.
- `EAGER_FIRST_PAINT_MODULES.size` = **268** at this tip (matches EM-B1k2's re-derived figure; the older replica figure of 251 is retired).
- The 18 `ENGINE_SHARED_DOMAIN_EXCISIONS`, executed through `manualChunks`: **13 are pinned** (engine-core-lazy ×7, content-identity ×2, custom-schema ×2, settlement-normalize, format-number) and **5 are UNPINNED orphans** — `customCategories`, `magicFilter`, `region/foldTradeCategories`, `content/livingContentSeam`, `content/livingContentLawVersion`. Four of the five land in the engine chunk, carrying **16,382 rendered bytes**.

---

## 3. The bytes the engine never reads — three instruments, each with its receipt

### (a) The import graph — `tools/graph.mjs`

Static edges only (`[^'"()]` keeps `import(` out of the `from` clause — the config's own spelling); dynamic imports classed separately.

**The chunk's DOORS.** Only **7 of 111** engine-ruled members are reachable from outside the chunk at all:

| member | dynamic importers | static importers in other chunks |
|---|---|---|
| generateSettlementPipeline.js | settlementSlice.js, ConstructionPanel.jsx, campaignContentBindingSession.js | composeInstantWorld.js, generationRequest.js, customContentPreview.worker.js |
| computeActiveChains.js | — | worldPulse/institutionLifecycle.js, worldPulse/resourceDynamicsKernel.js |
| structuralValidator.js | — | coherence/checkDraftEdit.js |
| priorityHelpers.js | — | components/new/dailyLifeLogic.js |
| terrainHelpers.js | — | ConfigurationPanel.jsx, worldPulse/resourceDynamicsKernel.js |
| helpers.js | — | TradeDynamicsPanel.jsx |
| stressPriority.js | — | components/new/generalDeskRead.js |

**Reachability from the generation door.** Of the 111, exactly **3** are outside `generateSettlementPipeline.js`'s static closure:
`src/generators/density/densityAscension.js`, `density/successionGrammar.js`, `density/titularSuccession.js`.
**All three have ZERO importers anywhere in `src/` (static or dynamic), and all three are ABSENT from the emitted chunk** — Rollup tree-shook them. CONFIRMED: they are not among the 114. **They cost 0 B**, so instrument (a) yields **zero movable bytes at module granularity**: everything the chunk actually ships, the generation pipeline statically reaches.

The productive reading of instrument (a) is therefore the door analysis, inverted: **12 members have a consumer that lives outside the chunk**, and those consumers' chunks are forced to statically import the whole 677,935 B engine to reach them. That is the FP-G11 `formatNumber` incident, still live, and it is where the movable bytes are. Measured (`tools/consumers.mjs`, consumer chunks resolved through `attrib-head.json`'s module→chunk map):

| rendered | member | outside consumer → the chunk it landed in |
|---|---|---|
| 46,021 | generators/computeActiveChains.js | worldPulse/institutionLifecycle.js, worldPulse/resourceDynamicsKernel.js → **realmManifest** (104,632 B) |
| 37,436 | generators/structuralValidator.js | coherence/checkDraftEdit.js → **SettlementsPanel** (262,475 B) |
| 35,699 | generators/generateSettlementPipeline.js | composeInstantWorld, generationRequest (**legitimate** — this is the chunk's own door) |
| 32,258 | generators/priorityHelpers.js | components/new/dailyLifeLogic.js → **DailyLifeTab** (17,645 B) |
| 5,976 | domain/content/livingContentLawVersion.js | livingContentLaw.js → **livingContentLaw (173 B)**; livingContentRoster.js; densityCreateBoundary.js → **densityCreateBoundary (686 B)**; importReconciliationAdmission.js → **StructuredCampaignReconciliation**; importScrub.js → **importScrub (846 B)** |
| 5,014 | domain/customCategories.js | primitives/CategorySelect.jsx → **CompendiumPanel** (153,849 B) |
| 3,977 | lib/narrativeMutations.js | domain/factionRename.js → **factionRename** (14,422 B) |
| 3,158 | domain/content/livingContentSeam.js | densityCreateBoundary.js → **densityCreateBoundary** |
| 2,234 | domain/magicFilter.js | InstitutionalGrid.jsx, store/selectors.js → **GenerateWizard** |
| 1,958 | generators/helpers.js | TradeDynamicsPanel.jsx → **GenerateWizard** |
| 1,289 | generators/terrainHelpers.js | ConfigurationPanel.jsx → GenerateWizard; resourceDynamicsKernel.js → realmManifest |
| 1,185 | generators/stressPriority.js | components/new/generalDeskRead.js → **generalDeskRead** (21,497 B) |

**Anchored mass: 176,205 rendered bytes across 12 members; 38 emitted chunks statically import the engine chunk** (CONFIRMED by scanning the dist's own specifiers) — including a **173-byte** `livingContentLaw-DBcv22d5.js` that pulls 677,935 B to read a version constant.

### (b) Data literals inside the chunk — `tools/literals.mjs`, `tools/span.mjs`

String literals survive minification verbatim, so a source literal found in the chunk is that module's byte, measured rather than ratio'd. Matching each module's quote-safe literals (≥16 chars) and template segments split on `${…}`:

**179,470 B of the emitted 677,935 (26.5 %) is quoted authored text matched verbatim from source.** Top carriers (literal bytes / share of that module's rendered length): `npcStructure.js` 26,939 (67.5 %), `safetyProfile.js` 13,419, `power/rulingStructure.js` 12,817, `power/governanceNarrative.js` 11,155, `data/narrativeData.js` 9,958 plain-literal (its prose is mostly interpolated templates, see below), `npcGenerator.js` 8,214, `narrativeGenerator.js` 7,977.

**The decisive measurement — the emitted SPAN.** Rollup renders each module contiguously, so the first and last offsets of a module's own authored segments bracket its emitted bytes. Two modules have segment sets unique enough to bracket cleanly:

| module | rendered | segments found | span in the emitted chunk | span / rendered |
|---|---|---|---|---|
| **src/data/narrativeData.js** | 39,857 | **265 / 265** | **35,858 B** (offsets 296,470 → 332,328) | **0.900** |
| src/generators/npcStructure.js | 39,921 | 228 / 228 | 32,295 B (400,307 → 432,602) | 0.809 |

**This is the number that matters:** prose does not minify, so the chunk-wide 0.4300 factor understates these two by more than half. `narrativeData.js` occupies **35,858 B — 5.3 % — of the engine chunk, CONFIRMED by its own text's offsets.**

The EM-P3 shape (a table inside the chunk whose consumers are elsewhere) exists here in exactly one form: `narrativeData.js` is a **zero-import pure data module force-routed into the code chunk by a rule whose stated reason the file's own header refutes**. `vite.config.js:866-879` says *"narrativeData.js still calls into the engine's PRNG/helpers at runtime, so it's not pure data"*. `src/data/narrativeData.js:1-8` says the opposite, in terms: *"PURE DATA … The two executable template tables that drew randomness at render time … were moved to src/generators/narrativeText.js … This file now holds only pure string tables: no runtime imports, no RNG capture."* **CONFIRMED by execution:** the module has **0 static imports and 0 dynamic imports**, and exports five `const` tables.

### (c) Duplication — `tools/attrib.mjs`

Across all 545 chunks of the chair's build:

- engine modules also rendered into a **main-graph (non-worker) chunk: ZERO**. Instrument (c) yields **no candidate move**. The chunk graph is clean in this respect.
- Every duplicate is a **per-entry worker build**: 110 of the 114 members are rendered again inside `generation.worker` and `customContentPreview.worker` (and `computeActiveChains` a fourth time in `advanceInterval.worker`). **3,143,205 rendered bytes** of the same source, re-emitted. `generationWorkerLazy.test.js:30-38` already states the mechanism; §1 above adds the consequence — `manualChunks` does not reach those builds, so **no placement can remove a byte of it**.

---

## 4. The priced moves

Method (`tools/price.mjs`): for each seed, the **minimal self-contained pin closure** — the seed plus every engine member it transitively statically reaches — then (i) the rendered bytes that leave `engine`, (ii) whether the closure retains any edge back into `engine` (if none, the pin also **cuts the consumer's anchor**; if some, only the bytes move). Emitted figures are the chunk's own 0.4300 factor unless a span was measured. **Every closure below came back edge-free.**

| # | move (pin to its own lazy chunk) | closure | rendered leaving | emitted | anchors cut | risk |
|---|---|---|---|---|---|---|
| **1** | **`src/data/narrativeData.js`** | 1 | 39,857 | **35,858 CONFIRMED (span)** | none (engine-only consumers) | **LOWEST** — zero-import pure data; one config line; no source file touched |
| 2 | `computeActiveChains.js` + `chainMagicSubstitution.js` + `lib/prebuiltResourceChains.js` | 3 | 54,829 | ~23,578 | **realmManifest** (104,632 B) stops importing engine | MED — 3 modules, 1 chunk |
| 3 | `generators/helpers.js` + `generators/priorityHelpers.js` (the pair; they are a cycle) | 2 | 34,216 | ~14,714 | **DailyLifeTab**, and GenerateWizard's helpers edge | MED — 25 in-engine importers re-point at the new chunk |
| 4 | `content/livingContentLawVersion.js` + `content/livingContentSeam.js` | 2 | 9,134 | ~3,928 | **four**: livingContentLaw (173 B), densityCreateBoundary (686 B), importScrub (846 B), StructuredCampaignReconciliation | LOW — both are zero/one-import leaves; repairs a refuted comment |
| 5 | `domain/customCategories.js` (→ own chunk, or join `engine-core-lazy`) | 1 | 5,014 | ~2,156 | **CompendiumPanel** (153,849 B) | LOW |
| 6 | `lib/narrativeMutations.js` | 1 | 3,977 | ~1,710 | **factionRename** (14,422 B) | LOW — zero imports |
| 7 | `lib/prebuiltResourceChains.js` (if not taken with #2) | 1 | 3,151 | ~1,355 | none | LOW, **ledger-only** |
| 8 | `domain/magicFilter.js` → `engine-core-lazy` | 1 | 2,234 | ~961 | partial (GenerateWizard has other engine edges) | LOW |
| 9 | `generators/terrainHelpers.js` | 1 | 1,289 | ~554 | ConfigurationPanel; realmManifest's second edge | LOW — one edge, to engine-core |
| 10 | `generators/stressPriority.js` | 1 | 1,185 | ~510 | **generalDeskRead** (21,497 B) | LOW — zero imports |
| — | *(named, not ranked)* `structuralValidator.js` closure | 6 | 113,301 | ~48,722 | SettlementsPanel | **HIGH** — see refusals |

**Combined, moves 1–10 (union of closures, 17 modules): 230,820 rendered = 14.7 % of the chunk ⇒ ~99,258 B emitted (PLAUSIBLE at the chunk-wide factor; higher in truth, since #1 alone measures 35,858 against its 17,139 ratio estimate).**

### Costs elsewhere, measured

- **Nothing lands in a first-paint chunk.** The closure is the same 8 files; none of the proposed chunks is in it. First-paint budgets: unmoved.
- **Nothing lands in the worker.** Worker builds ignore `manualChunks` (§1), so `WORKER_BUNDLE_CEILING_BYTES`'s 0 B of slack is untouched by every move above. CONFIRMED.
- **New chunks cost the entry's preload map.** The FP-R note measures ~37 B leaked into `__vitePreload` per newly minted module home. Ten new chunks ≈ a few hundred bytes against the first paint's 8,733 B raw margin. The `engine-core-lazy` variant of #5/#8 mints no chunk at all.
- **The generation path gains one cold request per new chunk**, fetched in parallel with the engine it accompanies (static edge, not dynamic), so no added round-trip depth.

### Pins that would move

- `tests/build/vendorPdfLazy.test.js:786-787` — the engine band. Both arms **improve**; no edit needed, and the ceiling is **not** touched.
- `tests/build/engineChunkLazy.test.js` — its orphan guard **executes** `manualChunks`, so a new pin makes it *more* satisfied, never less. Its `ENGINE_CHUNK_RE` still matches exactly one file.
- **A new pin owes a new build test**, by this estate's own idiom (`contentIdentityLazy`, `cultureProfilesLazy`, `customContentCharsetLazy`, `livingContentSeamLazy`, `userRouteIdentityLeaf`): absent-from-entry-closure + present-in-a-lazy-chunk, with the non-vacuity pair.
- `scripts/.size-baseline.json` is a per-file **max-lines** ratchet, not a chunk-size baseline; none of these modules has a row. `scripts/.prose-byte-baseline.json` governs `src/data/dossierStateProse/**`, not `narrativeData.js`. **No golden, no ratchet, no register moves.** CONFIRMED by `git grep`.
- `tests/build/livingContentSeamLazy.test.js` pins **source shape** (no static edge to the payload, dynamic-only seam, eager-graph absence) — move #4 leaves all three true.

### The two I would refuse

1. **Deleting the `narrativeData` rule and letting it fall through to `/src/data/` → `data-lazy`.** It is not eager, so it *would* land in `data-lazy`, and the engine already statically imports `data-lazy` — so the arithmetic looks free. It is not: **106 emitted chunks statically import `data-lazy`** (CONFIRMED by scanning the dist), from `AuthModal` to `GalleryPage` to `SignInPage`. That move charges 106 lazy surfaces 35.8 kB of generator-only prose to buy the engine's ledger. **Take the own-chunk pin instead** — that is the whole difference between a cure and a ceiling dodge.
2. **The `structuralValidator` closure pin (−113,301 rendered, the biggest single number on the board).** It drags six modules — `helpers`, `isolationSupport`, `institutionProbability`, `priorityHelpers`, `neighbourGenerator` — i.e. re-shapes a seventh of the chunk to solve a 181 B problem, and Rollup's re-grouping of the remainder is unmeasurable without a build. Refused on proportion, not on principle; it is the move to price properly *after* a real build exists to price it against.

*(And the standing refusal: raising the 679,000 ceiling. It is not on this lane's table and the estate's law is in terms — THE CURE IS THE PLACEMENT BEFORE IT IS THE CEILING.)*

---

## 5. The verdict

1. **Honest headroom reachable by placement alone: ~99 kB emitted (14.7 % of the chunk), against 181 B needed.** Of that, **~75.8 kB is the anchored class** — bytes a chunk *other than* the engine is today forced to fetch the whole engine to reach (FP-G11's own defect class, twelve live instances, 38 anchoring chunks). Those moves are a product win as well as a ledger win.
2. **Be honest about which kind of win each move is.** Moves 2–6, 8–10 cut a real anchor: a UI chunk stops downloading 677,935 B. Moves 1 and 7 do not — their consumers are all in-engine, so the generation fetch is byte-identical afterwards and only the *measured chunk* shrinks. **Move 1's non-ledger benefit is cache granularity**, which this estate already prices: today every generator edit re-hashes 35.8 kB of unchanged authored prose for returning users, and every prose edit re-hashes the 678 kB engine. That is a real gain, and it is not the same claim as "the user downloads less". The chair should not let move 1 be reported as the latter.
3. **The first move: pin `src/data/narrativeData.js` to its own lazy chunk.** 35,858 B, measured by the module's own text; one line of `vite.config.js`; zero source files touched; zero imports so it can drag nothing; no golden, ratchet, register or first-paint budget moves; and it retires a rationale that is false on the tree. It clears the 181 B by 198×.
4. **The ceiling's own rationale still holds — with a caveat the chair should see.** The 679,000 line is `measured 678,131 at EM-T2's tip (023eda2ec) + the ~700 B cross-environment margin the three prior raises carried`, and the +1,182 B is attributed to exactly two named modules. The reasoning is sound and the attribution is real. **But two of the four raises are CHAIR RULINGS "OFFERED FOR RATIFICATION", not owner-signed** (676,000→677,000, ODQ §934.19; 677,000→679,000, addendum 2), where 660,000→673,000 and 673,000→676,000 were owner-ratified. Under this estate's monotone-down/owner-signed discipline that is a standing debt, and a placement wave large enough to sit the chunk back under **676,000** would discharge it rather than argue it. **Moves 1–4 alone (~78 kB) do that with ~76 kB to spare.**

---

## ⛔ Noticed and not touched

Each item is specific enough to slot.

1. **⛔ Three DARK generator modules ship in `src/` and are reachable from nothing.** `src/generators/density/densityAscension.js`, `density/successionGrammar.js`, `density/titularSuccession.js` have **zero static and zero dynamic importers** anywhere under `src/` (measured), and all three are **absent from the emitted engine chunk** (tree-shaken). The estate knows about `titularSuccession` (EM-B1k2 §13 Q1 names it "DARK — no `src/` importer"); **the other two are the same shape and are not named anywhere as such**. They carry live obligations: `scripts/mutation-coverage-manifest.json:263` names `successionGrammar.js` as the **named promotion path for an R25 mutation plant**, and all three sit in `scripts/.observed-shape-readers-baseline.json`. **Slot:** the "wire or retire" decision the estate already applies to the dark causal register (`vendorPdfLazy.test.js:1626-1639`) — one owner decision point covering all three.
2. **⛔ `vite.config.js:866-879`'s narrativeData rationale is refuted by the file it governs.** The comment asserts runtime PRNG/helper calls; `src/data/narrativeData.js:1-8` records that those two tables moved to `narrativeText.js` and that the file is now pure, and the module has zero imports. Whether or not the move in §4 is taken, **the comment is a false statement about the tree** sitting in the file that governs every chunk boundary. **Slot:** a comment correction in whichever packet next touches `vite.config.js`.
3. **⛔ `vite.config.js:214-218`'s SEAMCYCLE claim is refuted at this tip.** It justifies leaving `livingContentLawVersion.js` UNPINNED on the premise that "Rollup co-locates it into the lazy `engine` chunk where its **one emitted importer** already lives". Measured: it has **five** outside importers landing in **four** main-graph chunks (`livingContentLaw` 173 B, `densityCreateBoundary` 686 B, `importScrub` 846 B, `StructuredCampaignReconciliation`), each of which therefore statically imports 677,935 B of generators. This is precisely the FP-G11 `formatNumber` incident the same file warns about two notes earlier. **Slot:** move #4 above, or a corrected note if the chair declines the pin.
4. **⛔ A 173-byte chunk anchors the 678 kB engine.** `livingContentLaw-DBcv22d5.js` → `engine-v9Z9eGQ1.js`, a 3,918× ratio. Named separately from item 3 because it is the sharpest single instance and the cheapest possible demonstration for a packet's red-first proof.
5. **⛔ 38 emitted chunks statically import the engine chunk**, including `CompendiumPanel` (153,849 B), `SettlementsPanel` (262,475 B), `realmManifest` (104,632 B), `GenerateWizard` (103,998 B) and `RealmInspector` (41,090 B). Twelve engine members explain all of it (§3a). No instrument in `tests/build/` counts this set, so it can grow silently. **Slot:** an inventory-ratchet (shrink-only) on the engine chunk's static-importer count, the `structural-prevention` idiom, sized at 38.
6. **⛔ The generation worker's ceiling has ZERO slack and no placement cure exists.** `1,401,208 / 1,401,208`. Because `worker.rollupOptions` is unset, `manualChunks` never runs for worker builds, so **every cure on that budget must be a buy-back inside the worker's own source files** — the next generator byte that reaches `generationRequest.js`'s graph reds it with no placement option. This is not written down in `generationWorkerLazy.test.js`'s otherwise very full docblock. **Slot:** a sentence in that docblock, in the packet that next touches the worker.
7. **⛔ Three worker bundles are larger than the budgeted one and have no ceiling at all.** `advanceInterval.worker` **2,656,422 B / 545 modules**, `pdfRender.worker` **2,303,334 B / 418**, `customContentPreview.worker` **1,626,660 B / 271** — against `generation.worker`'s budgeted 1,401,208 / 230. **Slot:** the chair's call on whether the monotone-down ceiling idiom extends to the other three, or whether it deliberately does not.
8. **⛔ `src/domain/region/foldTradeCategories.js` is an UNPINNED ESD excision that landed in no chunk at all** — it is not among the engine's 114 and matches no `manualChunks` rule. Either it is tree-shaken (dead) or Rollup co-located it somewhere unexamined; both states deserve a line, because the FP-G17 orphan guard only proves an excision is *placed when first-paint reaches it*, not that it exists. **Slot:** one measurement in the packet that next reads the excision list.
9. **⛔ The engine chunk is 677,935 bytes but 677,828 characters** — 107 bytes of non-ASCII in emitted generator prose. Any instrument that measures this chunk with `readFileSync(...).length` or a string length instead of `statSync(...).size` is **107 B optimistic against a 365 B margin**. The shipped tests use `statSync` (`vendorPdfLazy.test.js:750`) and `readFileSync(...).length` on a **Buffer** (`generationWorkerLazy.test.js:472`) — both correct today. **Slot:** a warning line wherever the next byte instrument is written.
10. **⛔ `engineChunkLazy.test.js:62-68`'s "sane size band" (`>200_000`, `<1_400_000`) can never bind** while `vendorPdfLazy.test.js`'s `<679_000` stands; a reader who greps for "the engine's ceiling" finds the band first and gets a figure 2× wrong. **Slot:** a cross-reference comment in `engineChunkLazy.test.js`.
11. **⛔ The per-module attribution instrument requires a full `vite build` and there is no cheaper form.** `attrib.config.mjs` reads `chunk.modules[].renderedLength` in `generateBundle`; the shipped build emits no sourcemap (pinned by `tests/build/sourcemapAbsence.test.js`) and no metafile, so **no lane can attribute the chunk without competing for the gate**. This lane worked around it with a recorded run plus a span measurement (§2.1, §3b). **Slot:** if per-module attribution is going to be a recurring receipt (it has been, four times in the ceiling notes), the chair may want `ANALYZE=1`'s `dist/stats.html` or a metafile emitted on the chair's own builds and kept beside the log.
12. **⛔ `npcStructure.js` is 67.5 % authored text by its own literal mass** (26,939 of 39,921 rendered), and `safetyProfile.js`, `power/rulingStructure.js` and `power/governanceNarrative.js` are each ~30 %. 26.5 % of the whole emitted chunk is quoted prose. This is the composed-prose corpus's shape growing *inside code modules*, where `scripts/.prose-byte-baseline.json`'s row-by-row declaration does not reach it. **Slot:** whether the prose-byte baseline should extend to `src/generators/**` literal mass — an owner/chair question about the corpus's accounting, not a bug.

---

**Report path:** `/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/lane-tool-12-scratch/TOOL-12.report.md`
