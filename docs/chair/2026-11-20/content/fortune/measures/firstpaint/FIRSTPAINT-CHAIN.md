# FIRSTPAINT-CHAIN: fortuneLaw.js and first paint, at a49838e67

Measuring helper for FORTUNE-4. Nothing was edited in /home/user/settlement-engine. All builds ran in scratch trees:
- base: `scratchpad/conf/tree-a49838e67` (git archive of a49838e67). The only file added is `vite.graphdump.config.mjs`, a wrapper config that spreads `vite.config.js` and adds one `generateBundle` plugin. The plugin dumps every chunk (its imports and modules) and every module's Rollup `getModuleInfo` (importedIds, importers, dynamicImporters).
- probe: `scratchpad/conf/probe-fortune-excise` (a fresh git archive of a49838e67 with the probe edits below).

Raw outputs are all in the scratchpad: `build-{a,b,c}.log`, `graph-{a,b,c}.json`, `analyze-{a,b,c}.out`, `sanity-a.out`, `measure-{a,b,c}.out`, `tests-a.log`, `tests-c.log`, `cmp-ab.out`, `cmp-c.out`, `q5.out`, `chain-ec.out`.
Scripts: `analyze.mjs`, `sanity.mjs`, `measure.mjs` (a verbatim copy of vendorPdfLazy's `staticImportSpecifiers`, `entryStaticClosure` and transfer helpers), `cmpchunks.mjs`.

## 1. Chunk and figures (EXECUTED)

- fortuneLaw.js is in `assets/engine-core-Dltfpy46.js`. That chunk is in the entry's static chunk closure: index, vendor-state, vendor-react, engine-core, data, kernel, content-identity, vendor-icons.
- First paint, measured the project's way (vendorPdfLazy's closure walk; gzip level 9; Brotli quality 11):
  - **raw 1,179,219 B**, budget 1,175,492.
  - **gzip 375,228 B**, budget 373,999.
  - **Brotli 314,955 B**, budget 313,994.
  - engine-core alone is 309,681 / 99,625 / 83,798.
- Worker, as generationWorkerLazy measures it: **generation.worker-DOhc5Ez8.js = 2,590,351 B**, ceiling 2,579,708.
- I ran the three tests with `VERIFY_DIST=1 npx vitest run tests/build/{engineChunkLazy,vendorPdfLazy,generationWorkerLazy}.test.js` in the base tree (`tests-a.log`). Exit was 1, with **5 failed and 80 passed**:
  - the worker ceiling;
  - "engine chunk … remains large" (914,394 against the bound 909,928);
  - the raw, gzip and Brotli budgets.
  - The figures in the failure messages are the same as the figures above, to the byte.
  - So a49838e67 is already red on these five, separately from fortuneLaw.

## 2. Eager chains to fortuneLaw.js (EXECUTED, from Rollup's own module graph)

**No module chain from the entry reaches fortuneLaw.js.** A BFS over `importedIds` (static edges only) from the entry `index.html` → `src/main.jsx` reaches 1,802 modules, and fortuneLaw.js is not one of them (`analyze-a.out`: "statically reachable … false").

Rollup's `importers` of fortuneLaw.js are exactly the 5 known modules. **Every one sits in a LAZY chunk:**

| importer | chunk | how that chunk loads |
|---|---|---|
| generators/economy/prosperity.js | `engine` (914 kB, lazy) | `loadEngine()` dynamic import |
| generators/factionDynamics.js | `engine` | same |
| generators/power/rulingStructure.js | `engine` | same |
| domain/density/densityCreateBoundary.js | `densityCreateBoundary` (lazy) | static from composeInstantWorld and settlementGenerateAction chunks; dynamic from campaignContentBindingSession and settlementRederiveAction (all lazy) |
| domain/display/stateProse/economyStateProse.js | `economyDeskRead` (lazy) | static from economyDeskRead.js, which the lazy tab chunks import (Economics, Resources, Services, DailyLife) and the PDF (printProse) |

fortuneLaw.js itself imports nothing.

**The only "chain" runs at chunk level and comes from config routing, not from an import:**

`index.html → main.jsx → App.jsx → store/campaignSliceShared.js → domain/clone.js [engine-core]`

- That is a representative path. Index-chunk modules statically import 40 distinct engine-core modules, so the **engine-core CHUNK** is eager in its own right.
- fortuneLaw.js only **rides in it**. `vite.config.js :: computeEngineSharedDomain()` (ESD) seeds engine-core with every domain module that any src/generators module imports. prosperity, factionDynamics and rulingStructure import fortuneLaw, so `manualChunks` routes it to `'engine-core'` through `isEngineSharedDomain(id)`.

**The module that is eager for another reason** is the engine-core chunk itself, kept eager by those 40 entry edges (for example domain/clone.js).

fortuneLaw is not alone in this. Of the 126 modules in engine-core, 62 are not statically reached from the entry (`sanity-a.out`). They are ESD co-location passengers, like fortuneLaw.

## 3. Smallest cut (READ + EXECUTED)

**No source cut is needed, and no source cut short of a large one would work.**
- No synchronous contract and no persisted shape is involved: no eager module imports the law.
- Cutting the static imports in densityCreateBoundary or economyStateProse would change nothing, because ESD routes the law from the generator imports.
- Removing ESD membership through source would mean removing all three generator imports (prosperity: `FORTUNE_LAW_TUNING`, `isSizeRelativeFortune`; factionDynamics and rulingStructure similar). Those callers are already lazy (`engine` chunk), so the work buys nothing over the config cut.

**The smallest cut is two lines in `vite.config.js`, in the FP-G14 convention ("excised AND pinned"):**
1. Add `'/src/domain/fortune/fortuneLaw.js'` to `ENGINE_SHARED_DOMAIN_EXCISIONS`.
2. Pin it with a manualChunks rule just before `if (isEngineSharedDomain(id))`: `if (id.includes('/src/domain/fortune/fortuneLaw.js')) return 'fortune-law';`

**Excising without a pin is wrong (EXECUTED, probe B).** Rollup co-locates the law into the 914 kB `engine` chunk. The `densityCreateBoundary` chunk then gains a new static edge to `engine`, so the create/rederive boundary would fetch the whole generator (`cmp-ab.out`). That is exactly the hazard the ESD comment warns about.

**Pinning to an existing chunk is worse.**
- `coherence-lazy` (FIRSTPAINT2_LAZY_DOMAIN) is 279 kB, and densityCreateBoundary does not import it today.
- `engine-core-lazy` is 26 kB, and neither lazy consumer imports it today.
- Both of those are READ conclusions; I did not probe them.

**No store or events boundary refactor is needed.**

## 4. Probe (a PROBE, not a build of record), second scratch copy, EXECUTED

| | engine-core raw | index raw | FP raw | FP gzip | FP Brotli | worker | fortuneLaw chunk |
|---|---|---|---|---|---|---|---|
| base a49838e67 | 309,681 | 488,958 | 1,179,219 | 375,228 | 314,955 | 2,590,351 | engine-core (eager) |
| B: excised, unpinned | 308,130 | 488,994 | 1,177,704 (−1,515) | 374,716 (−512) | 314,471 (−484) | 2,590,351 | `engine` (lazy). Rejected: new densityCreateBoundary→engine edge |
| **C: excised + pinned `fortune-law`** | 308,130 | 489,016 | **1,177,726 (−1,493)** | **374,696 (−532)** | **314,727 (−228)** | 2,590,351 | **`fortune-law-*.js`, 1,512 B, lazy, imports nothing** |

How to read probe C:
- engine-core loses 1,551 B raw.
- The index chunk gains 58 B raw (Vite's preload-deps list now names the new chunk) and 141 B Brotli, so the Brotli saving is smaller.
- `engine` grows 914,394 → 914,427 B, because of Rollup's hoisted import of the tiny chunk.
- No eager chunk imports `fortune-law`. Its static importers are all lazy chunks (tabs, PDF, densityCreateBoundary, economyDeskRead, engine and so on), including Rollup's hoisted transitive imports.
- The worker does not change. The worker is a separate Rollup build, and the law's placement there is unaffected.

**Probe C on its own does not clear the budgets.** It would remain over by:
- raw 2,234 B;
- gzip 697 B;
- Brotli 733 B;
- worker 10,643 B.

**Tests on probe C** (`tests-c.log`): I ran the three build tests plus customContentCharsetLazy and tests/architecture/engineCoreLazyEdge. Result: **5 failed and 92 passed**. These are the same five failures as the base, and the cut introduced no new failure.

## 5. economyStateProse.js and first paint (EXECUTED)

- **It does not render on first paint.** It sits in the lazy `economyDeskRead` chunk, which only lazy tab chunks and the PDF path reach. No eager chunk imports it.
- **No first-paint surface needs the law.** No module in the entry's static closure imports fortuneLaw.js, and every reader of `isSizeRelativeFortune`, `FORTUNE_LAW_TUNING` and the other exports is in a lazy chunk. The law costs first paint only because the manualChunks rule routes it into engine-core.
