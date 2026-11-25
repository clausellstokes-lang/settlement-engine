# TYPES (LANDING-117, BUILDER T)

Worktree `/home/user/wt/types`, branch `lane/close-7-2026-11-24-types-wip`, cut at 97c6bfc7a. Never pushed.
The chair's lists (`docs/chair/2026-11-24/tenth/landing/117/*`) were not on origin after `git fetch origin
lane/chair-2026-11-08` (head af39c65ac; 601264de05 not an object here): the brief's own file and line list was used.

## (1) TYPES: commit 8e2441054

Before (at 97c6bfc7a, through `scripts/gate-mutex.sh --run`, logs with `exit=`): CONFIRMED (run)

    [typecheck-ratchet] TYPE REGRESSIONS against tsconfig.full.json (fix them; do not widen the baseline):
      src/generators/steps/assembleInstitutions.js: 1 error(s) (baseline 0) — +1
    exit=1
    [domain-strict] strict-type regressions in the domain kernel (fix or annotate; do not widen the baseline):
      src/domain/coherence/pageCensusFindings.js: 2 strict errors (baseline 0) — +2
      src/domain/display/dossierViewModel.js: 1 strict errors (baseline 0) — +1
      src/domain/factionArchetypes.js: 1 strict errors (baseline 0) — +1
      src/domain/seat/seatTable.js: 2 strict errors (baseline 0) — +2
      src/domain/traditions/genesis.js: 2 strict errors (baseline 0) — +2
    exit=1

Causes, each CONFIRMED by the tsc message and by the fix turning it green:

| Site | Code | Cause | JSDoc fix |
|---|---|---|---|
| assembleInstitutions.js:451 | TS2322 | `RowEnvironment.tradeRoute` is typed `unknown`; B1(i)'s `withheld` hands it to `landWithholdsHouse`'s `LandHere.tradeRoute?: string\|null` | inline cast `/** @type {string \| null} */ (rowEnv.tradeRoute)` on 451 |
| pageCensusFindings.js:442 x2, genesis.js:198 x2 | TS2345 | `factsOf`'s frozen reading is not `FactsLike`: `hasOtherNpc(npc: number\|object)` vs `(npc: unknown)` | the reading cast to `Parameters<typeof atomHolds>[1]` on the line above (441, 197), as `settlementQuickGuide.js:294` already does; one cast clears both calls |
| dossierViewModel.js:767 | TS2345 | `stoppedSupplyOf`'s `@param {object}` refuses its caller's `DossierSettlementView \| null \| undefined` | the `@param` (line 922) widened to that type, the one `stoppedOnPage` carries; `rowMarkText` already takes it |
| factionArchetypes.js:107, seatTable.js:240 x2 | TS7006 | R24-C1's constants (`CRIMINAL_BIRTH_NAMES`, `BIRTH_NAMED_FORMS`) were inserted between each function and its JSDoc, orphaning the `@param` | the orphaned types restated inline on the parameters |

Six lines changed, none added or removed (no cited line moves). The pre-commit hook (lint-staged, eslint --fix) ran
and changed nothing further.

After, in this worktree, through the mutex: CONFIRMED (run)

    [typecheck-ratchet] OK — no type regressions (167 error(s), ceiling 167).
    exit=0
    [domain-strict] ✓ no strict-type regressions (1113 errors, ceiling 1113).
    exit=0

## (5a) FIRST PAINT

Method: two `ANALYZE=1 npm run build`s through the mutex (both `exit=0`): point 117 in `/home/user/wt/types` (8e2441054,
JSDoc only over 97c6bfc7a) and point 116 in a detached worktree `/home/user/wt/types-base` at ddca5c789. The first-paint
closure taken exactly as `tests/build/vendorPdfLazy.test.js` takes it (the entry chunk from `dist/index.html`, a BFS over
static `./x.js` edges; gzip level 9, Brotli q11), module attribution from the visualizer's `dist/stats.html`, and vite's
own `EAGER_FIRST_PAINT_MODULES` imported from each tree's `vite.config.js`.

Totals, CONFIRMED (run): 116 = 1,180,874 raw / 376,104 gzip / 315,862 Brotli; 117 = 1,192,039 / 379,126 / 318,345:
**+11,165 raw** (the chair's figure to the byte), +3,022 gzip, +2,483 Brotli (the chair's +3,040 / +2,370: same raw
bytes, a different compressor build; this machine's node zlib).

Per chunk (8 files both sides; every other chunk byte-identical, same hash):

| Chunk | 116 | 117 | raw | gzip | Brotli |
|---|---|---|---|---|---|
| data | 156,695 | 166,841 | +10,146 | +2,692 | +2,241 |
| engine-core | 314,955 | 315,968 | +1,013 | +353 | +214 |
| index | 485,101 | 485,107 | +6 | -23 | +28 |

Per module (visualizer renderedLength, pre-minify; NEW = not in an eager chunk at 116):

| Module | chunk 116 -> 117 | rendered +/- | Unit |
|---|---|---|---|
| `src/data/geographyData.js` | data-lazy -> **data (eager), NEW** | +17,717 (16,522 at 116) | B1(i) c6c244964 |
| `src/domain/landWithholding.js` | (new file) -> **engine-core, NEW** | +2,592 | B1(i) c6c244964 |
| `src/domain/facts/foodProduction.js` | (new file) -> **engine-core, NEW** | +1,926 | THE MIRROR fe948997a |
| `src/domain/facts/factVocabulary.js` | engine-core | +1,988 | THE MIRROR + R24-A1 |
| `src/data/institutionalCatalog.js` | data | +1,479 | B1(i) (`livesOn`) |
| `src/domain/seat/seatTable.js` | engine-core | +621 | C1 de19885d7 |
| `src/domain/factionArchetypes.js` | engine-core | +469 | C1 de19885d7 |

WHO BROUGHT WHAT, CONFIRMED (run: the build's stats plus vite's own eager set at each tree):
- **B1(i) brought ~10 KB of the 11,165.** `landWithholding.js` is imported by `assembleInstitutions.js` (a generator), so
  `computeEngineSharedDomain()` makes it an ENGINE_SHARED_DOMAIN member: a SEED of the eager graph (eager at 117, absent at
  116). It imports `TERRAIN_DATA, LAND_GIVERS` from `data/geographyData.js`, and that whole table follows it eager:
  geographyData's ONLY eager importer at 117 is `landWithholding.js` (none at 116), and the build moved it from
  `data-lazy` (2,019,035 -> 2,010,766, -8,269) into the eager `data` chunk (+10,146). esbuild's standalone minify of
  geographyData is 10,356 B (PLAUSIBLE as a split; the chunk deltas are the measure).
- **THE MIRROR brought `foodProduction.js` eager**, by the premise A1's own pin comment names: its only importer is
  `facts/factsOf.js`, which is pinned lazy (FIRSTPAINT2_LAZY_DOMAIN), but the derivation walks factsOf's imports before the
  pin deletes factsOf, so the new leaf stays an ENGINE_SHARED_DOMAIN seed. A1 pinned `sickCare.js` (it rides
  `coherence-lazy` at 117: not eager); THE MIRROR did not pin `foodProduction.js`. Small (esbuild ~125 B minified).
- The rest of engine-core's +1,013 is growth of modules already eager: factVocabulary (MIRROR, A1), seatTable and
  factionArchetypes (C1), landWithholding itself.
- **A census reader is NOT in first paint.** `pageCensusFindings.js` is in no chunk of the build at all (not shipped);
  no `src/domain/coherence/` module is in an eager chunk; `genesis.js`, `dailyLife.js` and `dmLayer.js` ride their own
  lazy chunks.

THE BUY-BACK (not built; PLAUSIBLE until a build measures it):
1. Pin `'/src/domain/landWithholding.js'` in `FIRSTPAINT2_LAZY_DOMAIN` (vite.config.js), the sickCare precedent. Its
   importers are the generator and the census reader, neither eager; it would ride the lazy engine/coherence side, and
   `geographyData.js` would lose its only eager importer and return to `data-lazy`: about -10.5 KB raw / -2.8 KB gzip
   (geographyData plus landWithholding). Its guard would be a `@guarded-by` arm like `factHomesLazy` (a).
2. Pin `'/src/domain/facts/foodProduction.js'` beside it (it imports nothing; factsOf, its one importer, is already
   lazy): about -0.1 KB.
Together they return first paint to within ~0.6 KB of point 116 (what remains is C1's and the vocabulary's growth).

## (5b) WRITER-REACH closureSizes

Method: each tree's OWN `scripts/lib/writer-reach-scan.mjs` (`sourceFiles` -> `buildIndex` -> `edgeMapOf` ->
`surfaceClosures`, the walker's own closure derivation) run over `git archive` extracts of ddca5c789 and 97c6bfc7a, the
closures dumped as file lists and diffed. The sizes reproduce the register's on both sides exactly (ddca5c789:
web-transitive 1099, dossier-pdf 650, campaign-pdf 222, world-book 237, foundry 523; 97c6bfc7a: 1101, 652, 224, 239,
525). CONFIRMED (run).

The closures' members are files; the +2 on each of the five is the SAME two files:

| Entered | Unit | Commit | Edge |
|---|---|---|---|
| `src/domain/facts/sickCare.js` | R24-A1 | d1e78ea7a | `factsOf.js:301` `import { sickCareOf } from './sickCare.js'` |
| `src/domain/facts/foodProduction.js` | THE MIRROR (R24d) | fe948997a | `factsOf.js:302` `import { foodProductionOf } from './foodProduction.js'` |

Every closure that already held `facts/factsOf.js` gained both: web-transitive, dossier-pdf, campaign-pdf, world-book,
foundry. web-display does not move (neither file is under `src/components/`, `src/domain/display/` or `src/pdf/`), nor
json-export or news. Nothing left any closure. B1(i)'s new `src/domain/landWithholding.js` is a source file (corpus
2628 -> 2631 is the three new files) but in NO surface closure: its importers are `assembleInstitutions.js` (under the
`src/generators/` STOP) and `pageCensusFindings.js` (in no surface closure either). The scan's `files` 1903 -> 1905 is the
same two in-closure files.

The register's diff since ddca5c789, verbatim (`git diff ddca5c789 97c6bfc7a -- scripts/.writer-reach-baseline.json`;
one commit, 97c6bfc7a, the `--write` door at the BATCH merge e9b726cdf):

```diff
diff --git a/scripts/.writer-reach-baseline.json b/scripts/.writer-reach-baseline.json
index 3d48a772d..b9754ef70 100644
--- a/scripts/.writer-reach-baseline.json
+++ b/scripts/.writer-reach-baseline.json
@@ -8,7 +8,7 @@
   "The reviewable slice is computed by RULE (reviewableDark), never hand-listed."
  ],
  "schema": 1,
- "frozenAtSha": "f18b17e90e52fb91633ff5dbe1a7b0a075daafc6",
+ "frozenAtSha": "e9b726cdfcb457d84b64cb46d69fdb3f6ae3bbb9",
  "charter": "§18.1 WRWALKER Car 1 (HORIZON) — chair-signed vetoably at the INSTR-WRW pre-stage",
  "minRows": 40,
  "corpusMeta": {
@@ -22,7 +22,7 @@
   "originCount": 15106,
   "transitionCount": 23097
  },
- "shapesDigest": "08f7da56b2160301febc02295cbbbfe5d550cc5531df11bfbd41a373d77bf584",
+ "shapesDigest": "e4f9bde44f3710c9ab234ac6c7a1af56bb725fce20b343bed17e56c3ac95e6c6",
  "detectorDigest": "ef804a6642b3a2a2045c233036156113bf391d135a8edd59ff81c061bde34893",
  "verdictDigest": "fa0d46fdb65847e3542b3af9e475d69d26eba91e8eec09f956789aecf627be39",
  "surfaceRoots": {
@@ -73,11 +73,11 @@
  ],
  "closureSizes": {
   "web-display": 803,
-  "web-transitive": 1099,
-  "dossier-pdf": 650,
-  "campaign-pdf": 222,
-  "world-book": 237,
-  "foundry": 523,
+  "web-transitive": 1101,
+  "dossier-pdf": 652,
+  "campaign-pdf": 224,
+  "world-book": 239,
+  "foundry": 525,
   "json-export": 12,
   "news": 29
  },
@@ -91,15 +91,15 @@
   "knownShapes": 545
  },
  "scanStats": {
-  "files": 1903,
-  "sites": 44740,
-  "propRead": 42458,
+  "files": 1905,
+  "sites": 44750,
+  "propRead": 42468,
   "elemRead": 2,
   "destructure": 2260,
   "inOp": 20,
-  "rGrades": 8012,
-  "nGrades": 1889563,
-  "resolvedReceivers": 8914
+  "rGrades": 8016,
+  "nGrades": 1892119,
+  "resolvedReceivers": 8918
  },
  "registerDigest": "66919206e4d932964430d33786b44f7d6de17566cc52e83fc5ee83647e2cfbf5",
  "pendingSurfaceCeiling": 0,
```

So the rise the landing's `raised.py` flagged is already IN the register at 97c6bfc7a (re-taken by its own door; cohort
1366 -> 1366, verdictDigest unchanged): a closure grew by two fact leaves, no identity changed verdict.

## Where things are

- Commit 8e2441054 on `lane/close-7-2026-11-24-types-wip` (`/home/user/wt/types`); not pushed. Six one-line JSDoc edits.
- `/home/user/wt/types-base`: a detached worktree at ddca5c789 made only for the point-116 build (its `dist/` holds the
  stats); removable.
- Run logs (each ends `exit=`): `/tmp/claude-0/-home-user-settlement-engine/264f2cd3-2300-5be6-af7e-6509ebfae300/scratchpad/logs/`
  (`ratchet-base.log`, `strict-base.log`, `ratchet-after.log`, `strict-after.log`, `build-117.log`, `build-master.log` =
  the ddca5c789 build, `closures-dd.log`, `closures-117.log`); measurements `fp-116.json`, `fp-117.json`,
  `closures-dd.json`, `closures-117.json` one level up.
- No golden, fingerprint or register re-recorded; the report file itself is left uncommitted in the main checkout.
