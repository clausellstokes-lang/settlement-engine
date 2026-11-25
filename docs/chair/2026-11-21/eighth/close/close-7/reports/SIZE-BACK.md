# SIZE-BACK (CLOSE-7): the buy-back from LANDING-117 (5a)

**SIZE-BACK a1f75a9ea** on `lane/close-7-2026-11-24-sizeback-wip` (`/home/user/wt/sizeback`), cut at 97c6bfc7a. Not
pushed. One file, `vite.config.js`, +15 lines: `'/src/domain/landWithholding.js'` and `'/src/domain/facts/foodProduction.js'`
appended to `FIRSTPAINT2_LAZY_DOMAIN` right after A1's `sickCare.js` pin, with the same kind of comment block. Both halves
are built; neither file has a reader on the eager path.

## (1) THE FIVE FIGURES, CONFIRMED (run)

Both builds were `ANALYZE=1 npm run build` through the mutex, `exit=0`. BEFORE is 97c6bfc7a's bytes: the TYPES tree
8e2441054, which differs only in JSDoc, and its first paint matched the chair's 1,192,039 to the byte. AFTER is a1f75a9ea.
The first paint is the closure as `tests/build/vendorPdfLazy.test.js` takes it (gzip level 9, Brotli quality 11).

| Figure | 97c6bfc7a | SIZE-BACK | Change | Point 116 (ddca5c789) |
|---|---|---|---|---|
| first paint raw | 1,192,039 | **1,181,885** | **-10,154** | 1,180,874 |
| first paint gzip | 379,126 | **376,341** | **-2,785** | 376,104 |
| first paint Brotli | 318,345 | **315,834** | **-2,511** | 315,862 |
| generation worker | 2,721,496 | 2,721,496 | 0 (same file hash) | |
| engine chunk | 934,264 | 934,263 | -1 | 932,998 |

Per chunk: `data` 166,841 -> 157,167 (-9,674 raw, -2,574 gzip, -2,144 Brotli); `engine-core` 315,968 -> 315,488 (-480, -222,
-192). The other six first-paint files are unchanged in size. I had estimated ~10.6 KB; the measured saving is 10,154 B.
What remains above point 116 is +1,011 raw: the growth of modules already eager (C1's seatTable and factionArchetypes, the
vocabulary). Brotli is now 28 B under point 116. The visualizer stats place the files as follows after the change:
`landWithholding.js` and `foodProduction.js` are in `coherence-lazy` (beside `factsOf.js` and `sickCare.js`), and
`geographyData.js` is back in `data-lazy`. vite's own `EAGER_FIRST_PAINT_MODULES` holds none of the three.

## (2) `VERIFY_DIST=1` tests/build WHOLE, CONFIRMED (run)

Command: `VERIFY_DIST=1 npx vitest run tests/build/` through the mutex, against each tree's own dist. Both runs: 69 files,
628 tests, **15 failed, 607 passed, 6 skipped**, `exit=1`. **The two red sets are identical** (`diff` of the failing test
names: no difference). No red is new and none is cured. The 15:
- engineBundleReplay x3, engineServiceCore x1, engineServiceStoreParity x4: the stale server bundle.
- landingFixtureFreshness x2.
- generationWorkerLazy: worker 2,721,496 against a 2,579,708 ceiling.
- vendorPdfLazy x4: the engine chunk under 909,928, plus first paint raw under 1,175,492, gzip under 373,999 and Brotli under
  313,994. These are the signed ceilings, which point 116 was already above. The four stay red after the buy-back, now at
  1,181,885 / 376,341 / 315,834. No ceiling was moved.

I did not have the chair's `classified.txt` to match these against its list. The proof here is that the before and after
red sets are equal. `VERIFY_ENGINE_REMOTE_DIST` was not set: the flagged build would write into `node_modules/.cache`,
which is the shared, symlinked node_modules.

## (3) BEHAVIOUR UNCHANGED

Rule: a static `import` between chunks makes the browser fetch and evaluate the imported chunk before the importing module's
body runs. A module inside the same chunk as its reader is evaluated first, in dependency order.

**`landWithholding.js`.** Its readers are `landWithholdsHouse`, called from three places:
`generators/steps/assembleInstitutions.js` (first by run order: the institution draw), `generators/cascadeGenerator.js` and
`generators/factionCorrelation.js`. All three are generation code. `coherence/pageCensusFindings.js` also imports it but
ships in no chunk. No page component reads it: a page reads the record the generator wrote, where the withheld house is
already absent. Where the generator runs:
- **In the generation worker** (`generation.worker-CVU8DJ4d.js`). This is a self-contained bundle. It is byte-identical
  before and after (same hash), and it carries the code inline (`withholds` appears in it). Nothing changed there.
- **On the main thread through the local engine** (`localPipeline` loads `engine-*.js` with `import()`). The `engine` chunk
  holds all three readers and imports `coherence-lazy` and `data-lazy` statically: `from"./coherence-lazy-fjkBsMdd.js"`,
  `from"./data-lazy-DyRKyozv.js"`. So `landWithholding` and `geographyData` are evaluated before any generator body runs.
  CONFIRMED (read from dist).

**`foodProduction.js`.** Its one importer is `facts/factsOf.js`, which exposes it as the getter `get foodProduction()`. Its
one reader is the vocabulary's `food production` atom (`factVocabulary.js:630`, `f.foodProduction(ctx.capacities)`). The
lines that declare that atom are Daily Life's fare (C7/K2) and Dawn Work's food branch (F6/K1), reached through
`domain/dailyLife.js`. So the first reader on a page is the Daily Life tab: `DailyLifeTab` -> `dailyLife-*.js`, which
statically imports `coherence-lazy`, and that chunk now holds both `factsOf.js` and `foodProduction.js`.
- `factVocabulary.js` is EAGER (in engine-core), but it does not import `foodProduction.js`. It reads it only off a facts
  object, and the only maker of that object is `factsOf()`, which lives in the same chunk as `foodProduction`. No facts
  object can exist before `foodProduction` has been evaluated. CONFIRMED (read; vite's eager set has no importer of it).

**No chunk edge moved**, CONFIRMED (read from both dists). The same 109 chunks import `coherence-lazy` before and after, and
`engine` and `dailyLife` imported `coherence-lazy` and `data-lazy` statically before the change too. `coherence-lazy`'s
own imports are identical before and after (content-identity, data, data-lazy, engine-core, fortune-law, fortune-merits,
kernel, narrative-mutations). So no page fetches a chunk it did not fetch before, and no cycle is added.

## Typechecks in this tree, CONFIRMED (run)

`npm run typecheck:ratchet`: `exit=1`, assembleInstitutions.js +1. `npm run typecheck:domain:strict`: `exit=1`, the eight
(pageCensusFindings +2, dossierViewModel +1, factionArchetypes +1, seatTable +2, genesis +2). These are exactly
**97c6bfc7a's own type reds**, the ones TYPES (8e2441054) cures. SIZE-BACK cannot move either check: `vite.config.js` is in
neither `tsconfig.full.json`'s include nor the domain include. **A push of this branch alone will be refused by the lane
hook** until it carries the TYPES commit. Whether to put 8e2441054 under it, or to land TYPES first, is CLOSE-7's call; I did
neither.

## Logs

`/tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad/logs/`: `build-sizeback.log`,
`build-117.log`, `tb-before.log` / `.json` / `-reds.txt`, `tb-after.log` / `.json` / `-reds.txt`,
`sb-typecheck-ratchet.log`, `sb-typecheck-domain-strict.log` (each ends `exit=`). Measurements: `../fp-117.json`,
`../fp-sb.json`.
