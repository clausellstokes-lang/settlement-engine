# EM-P3 — EXECUTED EVIDENCE

Every fact the packet calls VERIFIED has a command here with its real output. All commands ran with `cd $SP/consist`, `SP=/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad`.
**Nothing was written, staged or committed in the consist or the ledger. No vitest, no eslint, no `npm run check`, no writing script.**

Base: `d31af2ceebf643818201b2e2ab4a556765d2fc7c`. The clean-tree proof and the disclosed branch moves are in `EM-A1.evidence.md` E-0 and E-29; **J-T1 blob identity is in E-40 (27 of 27 SAME)** and is extended for this packet's own paths at **P-14**.

---

## P-1 · BOTH CREATE TARGETS ARE ABSENT

```
$ for f in src/data/worldFactOptions.js src/domain/worldFactOptions.js; do
    [ -e "$f" ] && echo "PRESENT $f" || echo "ABSENT  $f"; done
ABSENT  src/data/worldFactOptions.js
ABSENT  src/domain/worldFactOptions.js
```

## P-2 · ⭐ `resolveConfig` VALIDATES TWO OF THE SEVEN, AND ITS TWO EXPORTS ALREADY SAY WHY THEY EXIST

```
$ grep -n '^export' src/generators/steps/resolveConfig.js
24:export const TERRAIN_WEIGHTS = [
41:export const CULTURES = [
$ wc -l src/generators/steps/resolveConfig.js
     368

$ sed -n '23,27p' src/generators/steps/resolveConfig.js
// Exported for the gallery facet-alignment contract (terrain facet vocabulary).
export const TERRAIN_WEIGHTS = [
  ['plains', 22], ['hills', 18], ['forest', 13],
  ['riverside', 16], ['coastal', 16], ['mountain', 9], ['desert', 6],
];

$ sed -n '39,44p' src/generators/steps/resolveConfig.js
// Exported for the gallery facet-alignment contract (culture facet vocabulary
// must match the generator's own list).
export const CULTURES = [
  'germanic','latin','celtic','arabic','norse','slavic',
  'east_asian','mesoamerican','south_asian','steppe','greek',
];
```

The whole file exports **exactly these two**. Threat, stressors, resources, goods and services are read from `src/data/*` modules it imports or from `config._*Toggles` it passes through un-validated (`:83-86`). **Trade access is resolved from pools, never from a list** (P-4).

⛔ **ORDER IS LOAD-BEARING:**

```
$ sed -n '110,115p' src/generators/steps/resolveConfig.js
  if (doRandomTerrain) {
    const terrains = TERRAIN_WEIGHTS.map(([t]) => t);
    const weights  = TERRAIN_WEIGHTS.map(([, w]) => w);
    resolvedTerrain = rng.weightedPick(terrains, weights);
$ sed -n '159,161p' src/generators/steps/resolveConfig.js
  const rawCulture = (config.culture === 'random_culture' || !config.culture)
    ? rng.pick(CULTURES)
```

A reorder of either array moves every random-terrain and random-culture world. §6 and case A5 pin it.

## P-3 · ⭐⭐ THE SINGLE-SOURCE CONTRACT ALREADY EXISTS, AND IT PINS **THREE** CULTURE COPIES

```
$ git grep -n 'TERRAIN_WEIGHTS\|CULTURES' -- tests/ | head -8
tests/components/gallery/facetAlignment.test.js:12:import { TERRAIN_WEIGHTS, CULTURES } from '../../../src/generators/steps/resolveConfig.js';
tests/components/gallery/facetAlignment.test.js:57:    const canonicalTerrains = TERRAIN_WEIGHTS.map(([terrain]) => terrain);
tests/components/gallery/facetAlignment.test.js:75:    expectSuperset(CULTURE_OPTIONS, CULTURES, 'culture');
tests/components/gallery/facetAlignment.test.js:76:    expectNoExtras(CULTURE_OPTIONS, CULTURES, 'culture');
tests/components/gallery/facetAlignment.test.js:82:    // so a culture added to CULTURES but forgotten in NAMING_DATA would silently
tests/components/gallery/facetAlignment.test.js:84:    // CULTURE_OPTIONS↔CULTURES). Pin the third copy of the culture list too, so a new
tests/components/gallery/facetAlignment.test.js:86:    expect(Object.keys(NAMING_DATA).sort()).toEqual([...CULTURES].sort());

$ grep -c "  it(\|  test(" tests/components/gallery/facetAlignment.test.js
6
```

**The estate had already found this duplication and pinned it with a contract test rather than a source.** This packet finishes the move; it does not mint a second instrument. The file's own comment at `:84` names the third copy explicitly.

## P-4 · ⛔ TRADE ACCESS HAS NO CANONICAL LIST — the STOP-1 measurement

```
$ sed -n '29,37p' src/generators/steps/resolveConfig.js
const TERRAIN_ROUTE_POOLS = {              # MODULE-LOCAL — not exported
  plains:    ['crossroads','crossroads','road','road','river'],
  hills:     ['road','road','crossroads','road','isolated'],
  forest:    ['road','isolated','isolated','road','river'],
  riverside: ['river','river','river','road','crossroads'],
  coastal:   ['port','port','port','port','river'],
  mountain:  ['road','road','road','isolated','isolated'],
  desert:    ['crossroads','road','road','isolated','road'],
};

$ sed -n '131,134p' src/generators/steps/resolveConfig.js
      routePool = townPlus && !canUseMagicalIsolation
        ? ['road','road','road','river','crossroads','port']
        : ['road','road','road','river','crossroads','port','isolated'];

$ grep -n "mountain_pass" tests/helpers/goldenMasterCorpus.js
50:// 'mountain_pass' is the panel's seventh option. No route pool rolls it, so only an
51:// explicit config reaches it, and it was therefore the one selectable route with no
52:// golden row at all — the blind spot that let it score a neutral tier unnoticed.
53:const TRADE = ['road', 'river', 'port', 'crossroads', 'isolated', 'mountain_pass', 'none'];
```

Rollable members: `road, crossroads, river, port, isolated`. Config-only tokens: `random_trade`, `none`, `mountain_pass`. **No module exports a trade-access list**, so this row is a MINT, and `PACKET_STANDARD.md:297` prices a pool mint with a decision-fork row and a mechanism-coverage row. §11 STOP-1.

## P-5 · THE DOMAIN-BOUNDARY IDIOM THIS HOME COPIES

```
$ head -12 src/domain/cultureProfiles.js
/**
 * Domain-facing culture-profile boundary.
 *
 * The governed profile corpus lives in src/data; generators, dossier readers,
 * and AI context builders import through this stable domain address so the
 * meaning of the culture dial has one public contract.
 */
export {
  CULTURE_PROFILES,
  CULTURE_PROFILE_KEYS,
  …
$ grep -n 'export const CULTURE_PROFILE_KEYS' -- src/data/cultureProfiles.js
525:export const CULTURE_PROFILE_KEYS = Object.freeze(Object.keys(CULTURE_PROFILES));
```

`src/data` holds the corpus; `src/domain` is the stable address. `src/domain/worldFactOptions.js` copies this exactly, which is what makes the home "domain-reachable" without `src/domain/edit/**` importing `src/components`.

## P-6 · MONSTER THREAT — one canonical home

```
$ grep -n '^export' src/data/monsterThreat.js
28:export const MONSTER_THREAT_TIERS = Object.freeze(['heartland', 'frontier', 'plagued']);
37:export const MONSTER_THREAT_RANDOM_POOL = Object.freeze([
55:export function normalizeMonsterThreat(raw) {
```

`resolveConfig.js:12` imports both and delegates alias→canonical resolution to `normalizeMonsterThreat` — the file's own comment calls it *"the ONE normalizer (the data-contract chokepoint)"*. **Already single. A citation, not a move.**

## P-7 · STRESSORS, RESOURCES, GOODS, SERVICES — already single

```
$ git grep -n 'export const STRESS_TYPE_MAP\|export const STRESS_TYPE_META' -- src/data/
src/data/stressTypes.js:10:export const STRESS_TYPE_MAP = {
src/data/stressTypesMeta.js:24:export const STRESS_TYPE_META = {

$ git grep -n 'export const RESOURCE_DATA\|export const SPECIAL_RESOURCES\|export const GOODS_CATEGORIES\|export const INSTITUTION_SERVICES' -- src/data/
src/data/resourceData.js:14:export const RESOURCE_DATA = {
src/data/resourceData.js:371:export const SPECIAL_RESOURCES = {
src/data/tradeGoodsData.js:10:export const GOODS_CATEGORIES = {
src/data/institutionServices.js:8:export const INSTITUTION_SERVICES = {
```

The siblings (`STRESS_DESCS`, `STRESS_NOTES`, `STRESS_ECONOMIC_EFFECTS`, `STRESS_INSTITUTION_EFFECTS`, `STRESSOR_SPINE_PHRASES`, `RESOURCE_CHAINS`, `RESOURCE_TO_CHAINS`, `IMPORT_GOODS_BY_TIER`, `GOODS_MODIFIERS_BY_TIER`) are **keyed BY** these maps, not second spellings of them. ⭐ **Four of the seven world facts need no move at all** — §5.1 records that rather than manufacturing work.

## P-8 · THE SHRINK-ONLY / HONESTY-ARM PRECEDENT

```
$ grep -n "^describe(\|^  it(" tests/joins/labelJoins.test.js
186:describe('label-join habitat freeze (shrink-only inventory)', () => {
189:  it('no file gains a label-join site (new joins must use catalog ids)', () => {
206:  it('the inventory is honest: every frozen file still exists in the scan tree', () => {
214:  it('the converted load-bearing joints stay converted (their counts cannot quietly climb back)', () => {
```

Case A4's honesty arm copies `:206`.

## P-9 · ⛔ THE WIZARD SPELLS NO OPTION LIST — the dropped manifest row

```
$ git grep -n "'plains'\|'germanic'" -- src/components/generate/ src/components/GenerateWizard.jsx src/components/ConfigurationPanel.jsx
                                        (no output — zero lines)
```

The ruling's *"the wizard's lists"* are, at this base, the GALLERY's — already covered. **The wizard MODIFY row is dropped and the drop is measured, not assumed.** §7 records it struck.

## P-10 · NO EDGE-SHARED CLOSURE REACHES EITHER NEW FILE

```
$ grep -o "src/[A-Za-z0-9._/-]*" scripts/build-edge-shared.mjs | sort -u
src/domain/aiCharter.js
src/domain/aiGrounding.js
src/domain/aiOutputSchema.js
src/domain/intentAtlas.js
src/lib/analyticsEvents.js
```

Neither `src/data/worldFactOptions.js` nor `src/domain/worldFactOptions.js` is an entry module. `Generated artifacts: NONE` is measured.

## P-11 · NO MUTATION-COVERAGE ROW IS OWED

```
$ sed -n '36,46p' tests/lint/mutationCoverage.shared.mjs
export const ENFORCER_DIRS = [
  'tests/lint', 'tests/design', 'tests/docs', 'tests/data',
  'tests/copy', 'tests/security', 'tests/edgeFunctions', 'tests/generators',
];

$ node -e 'const m=JSON.parse(require("fs").readFileSync("scripts/mutation-coverage-manifest.json","utf8"));
           console.log("facetAlignment in invariants?", Object.keys(m.invariants).some(k=>k.includes("facetAlignment")));'
facetAlignment in invariants? false
```

`tests/components` is **not** an enforcer dir, and the file this packet extends already exists with no row. **Zero owed** — and the basename carries no `NAME_PATTERN` token either.

## P-12 · THE LIGHTING CENSUS MOVES ONLY ON `titles`

```
$ sed -n '515,518p' tests/lint/sovereigntyLightingContract.walker.test.js
const TEST_FILES = walk(join(ROOT, 'tests'))
  .filter((p) => /\.test\.(js|jsx)$/.test(p))
$ cat tests/lint/.lighting-census-baseline.json   (figures)
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
```

This packet adds **no test FILE** — it extends one that already exists — so `files`, `parked` and `credited` are unchanged and only `titles` moves by the arms added. That is the narrowest census move any EM member can make, and it is why the arms go in the existing contract.

## P-13 · EVERY `requiredSymbols` ROW EXISTS VERBATIM (`grep -cF`, each ≥ 1)

```
src/generators/steps/resolveConfig.js      export const TERRAIN_WEIGHTS         1
src/generators/steps/resolveConfig.js      export const CULTURES                1
src/components/gallery/galleryUtils.js     export const TERRAIN_OPTIONS         1
src/components/gallery/galleryUtils.js     export const CULTURE_OPTIONS         1
src/data/cultureProfiles.js                export const CULTURE_PROFILE_KEYS    1
src/data/monsterThreat.js                  export const MONSTER_THREAT_TIERS    1
src/data/stressTypes.js                    export const STRESS_TYPE_MAP         1
src/data/resourceData.js                   export const RESOURCE_DATA           1
src/data/tradeGoodsData.js                 export const GOODS_CATEGORIES        1
src/data/institutionServices.js            export const INSTITUTION_SERVICES    1
```

## P-14 · J-T1 BLOB IDENTITY FOR THIS PACKET'S OWN PATHS

The 27-path run is `EM-A1.evidence.md` E-40. Re-run for the paths only EM-P3 touches:

```
$ for p in src/generators/steps/resolveConfig.js src/components/gallery/galleryUtils.js \
           src/data/cultureProfiles.js src/domain/cultureProfiles.js src/data/monsterThreat.js \
           src/data/stressTypes.js src/data/resourceData.js src/data/tradeGoodsData.js \
           src/data/institutionServices.js tests/components/gallery/facetAlignment.test.js \
           tests/helpers/goldenMasterCorpus.js tests/joins/labelJoins.test.js; do
    a=$(git rev-parse d31af2cee:$p); b=$(git rev-parse HEAD:$p)
    [ "$a" = "$b" ] && echo "SAME $p" || echo "MOVED $p"; done
```

Executed at `7aa769830`:

```
SAME src/generators/steps/resolveConfig.js
SAME src/components/gallery/galleryUtils.js
SAME src/data/cultureProfiles.js
SAME src/domain/cultureProfiles.js
SAME src/data/monsterThreat.js
SAME src/data/stressTypes.js
SAME src/data/resourceData.js
SAME src/data/tradeGoodsData.js
SAME src/data/institutionServices.js
SAME tests/components/gallery/facetAlignment.test.js
SAME tests/helpers/goldenMasterCorpus.js
SAME tests/joins/labelJoins.test.js
```

**12 of 12 SAME**, consistent with E-40's 27 of 27. Every figure in this packet is valid at the base AND at the tip.

---

# PRE-PROOF RE-MEASUREMENT AT THE TIP `a41a0e109` (Opus PRE-PROOF lane, 2026-09-19)

Sections P-1 … P-14 above are the COMPILE lane's evidence at `d31af2cee` and are **not rewritten**.
Everything below is a fresh execution against the build branch's tip.
All commands ran with `cd $SP/read-tip-a41a0e109` unless a section says otherwise; the lane wrote
only under `$SP/lane-preproof-EM-P3-scratch/`. **No vitest, no eslint, no npm script, no build.**

## P-15 · THE TREE, AND THAT IT IS THE TIP

```
$ git rev-parse --short HEAD && git rev-parse HEAD
a41a0e109
a41a0e109bdee8fe3a0df082bf35b36d2399301e
$ git status --porcelain
                                        (no output — clean)
$ git branch --show-current
                                        (empty — detached, as the brief requires)
```

## P-16 · ⭐ THE J-T1 WINDOW `d31af2cee .. a41a0e109`, OVER EVERY DECLARED PATH

Every change-manifest path AND every `requiredSymbols` path, in one command:

```
$ git diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c a41a0e109 -- \
    src/data/worldFactOptions.js src/domain/worldFactOptions.js \
    src/generators/steps/resolveConfig.js src/components/gallery/galleryUtils.js \
    tests/components/gallery/facetAlignment.test.js src/data/cultureProfiles.js \
    src/data/monsterThreat.js src/data/stressTypes.js src/data/resourceData.js \
    src/data/tradeGoodsData.js src/data/institutionServices.js
                                        (NO OUTPUT — not one declared path moved)
EXIT=0
```

Blob identity over the same paths plus the instruments the packet cites:

```
SAME  src/generators/steps/resolveConfig.js        SAME  src/data/tradeGoodsData.js
SAME  src/components/gallery/galleryUtils.js       SAME  src/data/institutionServices.js
SAME  src/data/cultureProfiles.js                  SAME  tests/components/gallery/facetAlignment.test.js
SAME  src/domain/cultureProfiles.js                SAME  tests/helpers/goldenMasterCorpus.js
SAME  src/data/monsterThreat.js                    SAME  tests/joins/labelJoins.test.js
SAME  src/data/stressTypes.js                      SAME  tests/lint/sovereigntyLightingContract.walker.test.js
SAME  src/data/stressTypesMeta.js                  SAME  tests/lint/mutationCoverage.shared.mjs
SAME  src/data/resourceData.js                     SAME  scripts/build-edge-shared.mjs
MOVED tests/lint/.lighting-census-baseline.json    b620751da -> c5a30441e
MOVED scripts/mutation-coverage-manifest.json      ecd252862 -> 6925327bc
```

⭐ **Every SOURCE fact in this packet is valid at the tip unchanged. The two MOVED files are
REGISTERS, and they are why §5.2's census tuple and P-12's figures are restated in P-19.**

CREATE targets at the tip:

```
$ for f in src/data/worldFactOptions.js src/domain/worldFactOptions.js; do
    git cat-file -e a41a0e109:"$f" 2>/dev/null && echo "PRESENT $f" || echo "ABSENT  $f"; done
ABSENT  src/data/worldFactOptions.js
ABSENT  src/domain/worldFactOptions.js
```

## P-17 · EVERY `requiredSymbols` ROW RESOLVES VERBATIM AT THE TIP

`grep -cF` per row, with the line the symbol now sits on:

```
src/generators/steps/resolveConfig.js    export const TERRAIN_WEIGHTS        1  (line 24)
src/generators/steps/resolveConfig.js    export const CULTURES               1  (line 41)
src/components/gallery/galleryUtils.js   export const TERRAIN_OPTIONS        1  (line 8)
src/components/gallery/galleryUtils.js   export const CULTURE_OPTIONS        1  (line 12)
src/data/cultureProfiles.js              export const CULTURE_PROFILE_KEYS   1  (line 525)
src/data/monsterThreat.js                export const MONSTER_THREAT_TIERS   1  (line 28)
src/data/stressTypes.js                  export const STRESS_TYPE_MAP        1  (line 10)
src/data/resourceData.js                 export const RESOURCE_DATA          1  (line 14)
src/data/tradeGoodsData.js               export const GOODS_CATEGORIES       1  (line 10)
src/data/institutionServices.js          export const INSTITUTION_SERVICES   1  (line 8)
```

**10 of 10, every count 1.** Because the blobs are identical (P-16), **every line number the packet
quotes is still exact** — no refresh is owed. Re-found by symbol anyway:

```
$ grep -n "^export const TERRAIN_WEIGHTS\|^export const CULTURES\|^const TERRAIN_ROUTE_POOLS\|rng.weightedPick\|rng.pick(CULTURES)\|routePool = townPlus" src/generators/steps/resolveConfig.js
24:export const TERRAIN_WEIGHTS = [
29:const TERRAIN_ROUTE_POOLS = {
41:export const CULTURES = [
114:    resolvedTerrain = rng.weightedPick(terrains, weights);
131:      routePool = townPlus && !canUseMagicalIsolation
160:    ? rng.pick(CULTURES)
$ wc -l src/generators/steps/resolveConfig.js
     368
$ grep -n "^import.*resolveConfig\|expectSuperset(CULTURE_OPTIONS\|expectNoExtras(CULTURE_OPTIONS\|Object.keys(NAMING_DATA)\|canonicalTerrains" tests/components/gallery/facetAlignment.test.js
12:import { TERRAIN_WEIGHTS, CULTURES } from '../../../src/generators/steps/resolveConfig.js';
57:    const canonicalTerrains = TERRAIN_WEIGHTS.map(([terrain]) => terrain);
58:    expectSuperset(TERRAIN_OPTIONS, canonicalTerrains, 'terrain');
59:    expectNoExtras(TERRAIN_OPTIONS, canonicalTerrains, 'terrain');
75:    expectSuperset(CULTURE_OPTIONS, CULTURES, 'culture');
76:    expectNoExtras(CULTURE_OPTIONS, CULTURES, 'culture');
86:    expect(Object.keys(NAMING_DATA).sort()).toEqual([...CULTURES].sort());
$ grep -c "  it(\|  test(" tests/components/gallery/facetAlignment.test.js
6
```

⭐ P-3 said the contract pins culture in three places; `:58-59` shows it pins **terrain** the same
way. The extension in §9 is therefore an equality upgrade of arms that already exist, not new ground.

## P-18 · P-9, P-10 AND P-11 RE-RUN AT THE TIP — ALL THREE STILL HOLD

```
$ git grep -n "'plains'\|'germanic'" -- src/components/generate/ src/components/GenerateWizard.jsx src/components/ConfigurationPanel.jsx
                                        (no output; exit 1)
```
**The wizard still spells no option list.** The dropped manifest row stays dropped.

```
$ grep -o "src/[A-Za-z0-9._/-]*" scripts/build-edge-shared.mjs | sort -u
src/domain/aiCharter.js   src/domain/aiGrounding.js   src/domain/aiOutputSchema.js
src/domain/intentAtlas.js src/lib/analyticsEvents.js
```
**Five entries, neither new file among them.** `Generated artifacts: NONE` holds.

```
$ node -e '<diff scripts/mutation-coverage-manifest.json d31af2cee vs a41a0e109>'
invariants base: 704  tip: 705
ADDED: [ 'tests/generators/pipelinePinnedMode.test.js' ]      # EM-P0's row
REMOVED: []
facetAlignment present at tip? false
```
The manifest moved, but only by EM-P0's own row. `tests/components/` is still not an
`ENFORCER_DIRS` member and `facetAlignment.test.js` still carries no row — **zero owed**.

## P-19 · ⛔ THE LIGHTING CENSUS REGISTER MOVED — §5.2's TUPLE AND P-12's FIGURES ARE STALE

```
$ git show d31af2cee:tests/lint/.lighting-census-baseline.json   (figures)
  "files": 2645, "parked": 383, "credited": 2262, "titles": 25009, "suiteTitles": 6670
  note: "2026-09-19 fixes consist, lanes 35-37: seven new files … files 2638->2645"

$ git show a41a0e109:tests/lint/.lighting-census-baseline.json   (figures)
  "files": 2646, "parked": 383, "credited": 2263, "titles": 25005, "suiteTitles": 6671
  measuredBy: "EM-P0"   note: "EM-P0: one new test file (the pinned-mode battery)"
```

Base → tip: `files 2645→2646 · parked 383→383 · credited 2262→2263 · titles 25009→25005 ·
suiteTitles 6670→6671`. **The packet must not quote either tuple as its own absolute** (the R11
rule): EM-P3's own move is a DELTA on whatever the chair stamps at promotion. Its shape is
unchanged and is re-derived in the packet's §7.

## P-20 · ⭐⭐ THE BUNDLE BUDGETS, MEASURED — WHERE EVERY `src/` PATH LANDS

**How this was measured.** The repo's OWN derivations were executed, not replicated. `vite.config.js`
exports `EAGER_FIRST_PAINT_MODULES` (the first-paint closure) and carries the real `manualChunks(id)`
routing function on its config object; both were imported and called directly. A scratch OVERLAY of
the tip (`git archive a41a0e109 src vite.config.js package.json`, `node_modules` symlinked) was
patched with EM-P3's exact change manifest, and the same derivations re-run against it. The overlay's
CONTROL reproduces the tip exactly (`EAGER_FIRST_PAINT_MODULES size = 268` in both).

### (a) Chunk membership — control (tip) vs overlay (EM-P3 applied)

```
path                                       eager?   chunk          (IDENTICAL in both runs)
src/data/worldFactOptions.js               lazy     data-lazy
src/domain/worldFactOptions.js             lazy     (rollup default)
src/generators/steps/resolveConfig.js      lazy     engine
src/components/gallery/galleryUtils.js     lazy     (rollup default)
```

`vite.config.js` routes them: `if (id.includes('/src/generators/')) return 'engine';` and
`if (id.includes('/src/data/')) return isEagerData(id) ? 'data' : 'data-lazy';`.

### (b) The first-paint closure does NOT move

```
$ diff eager.control.txt eager.overlay.txt
                                        (no output)
IDENTICAL — no module enters or leaves the first-paint closure
     268 eager.control.txt
     268 eager.overlay.txt
```
`galleryUtils.js` is **not** a first-paint module, so the gallery MODIFY costs the first-paint
budgets nothing. The three owner-ratified first-paint ceilings (`CLOSURE_BUDGET_BYTES = 1_048_000`,
gzip `337_000`, Brotli `283_000`) are untouched.

### (c) ⛔ THE GENERATION WORKER — `resolveConfig.js` IS IN IT, AND THE NEW MODULE JOINS IT

Static closure from `src/workers/generation.worker.js`, using `vite.config.js`'s own edge semantics
(static `import ... from` / `export ... from` only; `import()` is a lazy boundary):

```
CONTROL  closure size: 219 source modules
  IN   src/generators/steps/resolveConfig.js
    via: generation.worker.js -> generationRequest.js -> generateSettlementPipeline.js
         -> steps/index.js -> steps/resolveConfig.js
OVERLAY  closure size: 220 source modules
  IN   src/data/worldFactOptions.js
    via: … -> steps/resolveConfig.js -> src/data/worldFactOptions.js
  OUT  src/domain/worldFactOptions.js
```

The worker is an independent entry bundle: `vite.config.js` has exactly ONE `rollupOptions`, and it
is under `build:`, not under `worker: { format: 'es' }`. **`manualChunks` does not apply to the worker**,
so `src/data/worldFactOptions.js` lands INSIDE `generation.worker-<hash>.js`.

### (d) ⛔⛔ THE WORKER CEILING HAS ZERO SLACK, AND NOTHING HAS SPENT IT SINCE THE MINT

`tests/build/generationWorkerLazy.test.js:138` → `WORKER_BUNDLE_CEILING_BYTES = 1401128`, re-minted
by the chair at `91d5f155b` to the EXACT measurement at `023eda2ec` ("re-minted at W EXACTLY (zero
slack, as every mint before it)"). Is any of that slack back?

```
$ git merge-base --is-ancestor 023eda2ec a41a0e109 && echo YES
YES — 023eda2ec is an ancestor of a41a0e109
$ git diff --name-only 023eda2ec a41a0e109
docs/DESIGN_EDIT_MODE_AND_DECREES.md     docs/implementation/charters/EDIT-MODE-TRAIN.md
docs/implementation/INDEX.md             docs/implementation/packets/settlement-editor/EM-P2.md
docs/implementation/PACKET_MANIFEST.json docs/implementation/surveys/SIM-SEALS-SURVEY-2026-09-19.md
tests/build/generationWorkerLazy.test.js tests/build/vendorPdfLazy.test.js
worker closure modules: 219
worker-closure modules among the 8 changed files: NONE
```

⛔ **Not one of the worker's 219 modules has changed since the ceiling was minted to the exact
measurement. The bundle at `a41a0e109` is still 1,401,128 B and the slack is still zero.**

### (e) The priced delta (esbuild per-module minify — an ESTIMATE, stated as such)

Vite's default minifier is esbuild (`vite.config.js` sets no `minify`); `esbuild@0.28.1` from the
consist's `node_modules` was used with `{ minify: true, format: 'esm' }`.

```
CONTROL (a41a0e109)
   6985 min    15026 raw   src/generators/steps/resolveConfig.js
OVERLAY (EM-P3 applied, charter-corrected: seven keys, no TRADE_ACCESS)
   6842 min    14636 raw   src/generators/steps/resolveConfig.js     (-143)
    777 min     1046 raw   src/data/worldFactOptions.js              (new)
   7619 MIN TOTAL
```

**WORKER NET DELTA = 7,619 − 6,985 = +634 B minified.** Projected worker bundle
1,401,128 + 634 = **1,401,762 B against a 1,401,128 B ceiling — a certain red, not a risk.**
Priced bound, the estimate ×2 (the brief's rule): **1,268 B**; bound ceiling ≤ **1,402,396 B**.

What drives it, decomposed by minifying the pieces alone:

```
    302 min   the MOVED values (TERRAIN_WEIGHTS + CULTURES)   — leave resolveConfig, arrive here: net ~0
    598 min   the NET-NEW vocabulary (TERRAINS + TRADE_ACCESS + WORLD_FACT_SOURCES)
    387 min   the whole home WITHOUT the citation map
```
⭐ **`WORLD_FACT_SOURCES` is essentially the entire cost, and the generation worker never reads it.**
A named alternative for the chair is recorded in the packet's §11 STOP-2.

### (f) The engine chunk SHRINKS; data-lazy is untroubled

`resolveConfig.js` is in the `engine` chunk and loses 143 minified bytes; the new module goes to
`data-lazy`, a different chunk. So the engine chunk's delta is **−143 B** against
`expect(size).toBeLessThan(679_000)` (measured 678,131 at `023eda2ec`; 869 B of margin) — a shrink,
no breach. `data-lazy` gains 777 B against `DATA_LAZY_RAW_CEILING_BYTES = 3_098_110` over a measured
939,520 raw — an allowance of ~2.16 MB, three orders of magnitude past this packet.

### (g) ⛔⛔ THE PLACEMENT HAZARD, MEASURED — THE GENERATOR MUST IMPORT `src/data/`, NEVER `src/domain/`

`computeEngineSharedDomain()` seeds into the EAGER `engine-core` chunk *"the transitive closure,
within src/domain, of every domain module any src/generators module imports"*. A second overlay was
built with one character changed — `resolveConfig.js` importing `../../domain/worldFactOptions.js`
instead of `../../data/worldFactOptions.js`:

```
=== HAZARD VARIANT: a generator imports src/domain/worldFactOptions.js ===
EAGER_FIRST_PAINT_MODULES size = 270            (was 268)
src/data/worldFactOptions.js        EAGER    data
src/domain/worldFactOptions.js      EAGER    engine-core
```

**Both new files enter the first-paint closure and start charging the three owner-ratified
first-paint budgets.** This is the FP-G8 / `cultureProfiles` defect verbatim — `vite.config.js`'s own
comment records `src/domain/cultureProfiles.js` being excised from ENGINE_SHARED_DOMAIN because it
*"would route … data/cultureProfiles.js into the EAGER 'data' chunk with it — ~21 kB of profile"*.
The packet's §6 sketch already imports from `src/data/`; **it is now pinned in §5.2 as a forbidden
alternative**, because nothing in the packet refused it and §2's prose invites the wrong read.

## P-21 · `src/domain/worldFactOptions.js` HAS ZERO PRODUCTION IMPORTERS AT THIS PACKET'S LANDING

P-20(c) shows it OUT of the worker closure, and P-20(a) gives it no manualChunks rule. Under
EM-P3's manifest the generator imports `src/data/`, the gallery imports `src/data/`, and the only
importer of the domain address is the acceptance test. **It is therefore tree-shaken out of every
production chunk and costs zero bundle bytes.** It is built now because the charter makes EM-A1
depend on this packet for a domain-reachable address; that is recorded in §2 rather than left to be
rediscovered as dead code.

## P-22 · ⭐⭐ THE CHARTER HAS ALREADY RULED §11 STOP-1 — TRADE ACCESS IS EM-P3b's

STOP-1 asked the chair to choose between an empty placeholder and dropping the row. At the packet's
base the charter had no EM-P3 row at all to answer with:

```
$ git show d31af2cee:docs/implementation/charters/EDIT-MODE-TRAIN.md | wc -l
      53
$ git show d31af2cee:docs/implementation/charters/EDIT-MODE-TRAIN.md | grep -c "EM-P3"
0
```

At the tip it does, and it answers:

```
$ grep -n "EM-P3" docs/implementation/charters/EDIT-MODE-TRAIN.md
16:| **EM-P3** the world-fact option sets' one home (as measured: two moves, four citations;
   trade access → EM-P3b) | …
18:**EM-P3b** (after wave 1): trade access gets its one list (`TRADE_ACCESS`, minted with its
   decision-fork row and its mechanism-coverage row) and the world-facts card declares it.
```

⭐ **The chair ruled a third disposition: the whole row moves to EM-P3b.** `TRADE_ACCESS` is
therefore REMOVED from this packet's CREATE symbols and from `WORLD_FACT_SOURCES`, which carries
SEVEN keys, not eight. Case A4's count moves 8 → 7 and gains a named-set arm so a silent drop still
reds. This is the chair's own landed ruling being applied, not a lane's adjudication; §11 records it
for veto.

## P-23 · THE TWO CEILING TESTS ARE FREE TO RESERVE, AND THE ACTION VOCABULARY ALLOWS THE ROWS

```
=== Does any NON-TERMINAL packet already reserve the two bundle-ceiling tests? ===
  none — both paths are free for EM-P3 to reserve
=== Who has EVER named them (any status)? ===
  (none)
```
`scripts/implementation-packets.mjs` validates change paths against `PACKET_ACTIONS =
['CREATE','DOC','MODIFY','REGISTER','TEST']` and refuses a `duplicate change path across packets`
only for non-terminal owners (`reservesChangePaths = !TERMINAL_PACKET_STATUSES.has(status)`).
Adding the two TEST rows is valid and reserves them for EM-P3's run.

Sibling statuses at the tip, for the `Depends on` re-check:

```
   EM-B3a   DRAFT        EM-B3b   LANDED        EM-B3    SUPERSEDED
   EM-P3    DRAFT        EM-P0    LANDED        EM-P2    STALE
```
`Depends on: NONE` stands — nothing EM-P3 needs is unlanded, and no other non-terminal packet
names any EM-P3 path.

## P-24 · THE SEALED DISPATCH, READ DRY AT `a41a0e109`

`scripts/implementation-session.mjs`, check by check, for a build lane on a branch cut at the tip
once the chair sets `verifiedBase = a41a0e109…`:

| check | source | verdict at the tip |
|---|---|---|
| status is READY | `:274` `packet.status !== 'READY'` | the chair's promotion supplies it |
| manifest validates | `:271` | PASSES — P-23 (no duplicate path; 7 acceptance cases ≤ 8; every action in the vocabulary) |
| branch matches | `:353` `dispatch branch mismatch` | the build lane holds the integration branch in ITS worktree; chair detached |
| base is an ancestor of HEAD | `:176-183` `merge-base --is-ancestor` | PASSES — base IS the tip |
| substrate unchanged since base | `:185-196` | **SHORT-CIRCUITS at `:184` (`head === packet.verifiedBase`)**. And it would pass anyway: P-16's window over the substrate (non-CREATE manifest paths + every `requiredSymbols` path) is EMPTY even from `d31af2cee` |
| capsule names every substrate path | `:197-200` | PASSES — the capsule is built from the same two lists |
| CREATE targets absent and Git-clean | `:205-211` | PASSES — P-16 shows both ABSENT and untracked-clean |
| non-CREATE targets Git-clean | `:212-213` | PASSES on a clean lane worktree; the two new TEST rows are existing, clean files |

⭐ One note for the chair: the substrate check **excludes CREATE rows** (`:186`
`.filter((row) => row.action !== 'CREATE')`), so adding the two ceiling tests as **TEST** rows puts
them INTO the substrate — which is correct and desirable: if another lane edits either ceiling file
between the stamp and the dispatch, this packet refuses rather than landing on a moved ceiling.

## P-25 · ⛔⛔ ADDING THE CEILING ROWS MAKES THE OLD BASE IMPOSSIBLE — STAMP TO THE TIP

The J-T1 window re-run with version 2's FULL path list (both new TEST rows and the new
`src/data/namingData.js` requiredSymbols row included):

```
$ git diff --stat d31af2ceebf643818201b2e2ab4a556765d2fc7c a41a0e109 -- \
    <every v2 change-manifest path> <every v2 requiredSymbols path>
 tests/build/generationWorkerLazy.test.js | 20 +++++++++++++++++++-
 tests/build/vendorPdfLazy.test.js        | 13 ++++++++++++-
 2 files changed, 31 insertions(+), 2 deletions(-)
```

Every other path is still empty (P-16). The two that moved are the two ceiling files, and the
commit that moved them is `91d5f155b` — EM-P0's own re-mint of the same two ceilings.

**Consequence, read against `scripts/implementation-session.mjs:185-196`:** the substrate is the
non-CREATE change-manifest paths plus every `requiredSymbols` path, so both ceiling files are now
substrate. Dispatching at the OLD base would throw:

```
verified-base descendant changed declared substrate:
  tests/build/generationWorkerLazy.test.js, tests/build/vendorPdfLazy.test.js
```

⭐ **The chair must stamp `verifiedBase` to `a41a0e109` or later.** At the tip the check
short-circuits at `:184` (`head === packet.verifiedBase`) and never runs the diff. This is the same
refusal that forced `f31ca0eb8` ("EM-P2 re-pinned to 00fab686d — train EM-T2's terminal cures moved
src/generators/pipeline.js, a required-symbol path, so the sealed dispatch would refuse at the old
base d86aabae6"). Version 1 had no such constraint; version 2 does, and it is the price of carrying
the ceilings honestly.

## P-26 · THE `requiredSymbols` DELTA, AND WHY

Added (each proven to exist verbatim at `a41a0e109`, `grep -cF` = 1):

```
src/data/namingData.js                     export const NAMING_DATA                    1  (line 4)
tests/build/generationWorkerLazy.test.js   export const WORKER_BUNDLE_CEILING_BYTES    1  (line 138)
```

- **`NAMING_DATA` was owed and missing at version 1.** Case A2 asserts
  `expect(Object.keys(NAMING_DATA).sort()).toEqual([...CULTURES].sort())` (`facetAlignment.test.js:86`)
  and §5.2 names it, but `src/data/namingData.js` appeared in no manifest list — so the dispatch was
  not pinning a file the acceptance directly depends on. Blob identity at the tip: `SAME`.
- **`WORKER_BUNDLE_CEILING_BYTES` is the re-mint target** of §8 step 9. Naming it makes the dispatch
  prove the declaration exists before the build lane goes looking for it.

Considered and NOT added: `expectSuperset` / `expectNoExtras` (`facetAlignment.test.js:39,45`) are
local functions of a file this packet already owns through a TEST row, so pinning them is noise, not
substrate. `TIER_ORDER`, `PROSPERITY_TIERS`, `getMagicLevel` from `src/data/constants.js` are the
test file's pre-existing dependencies for arms this packet does not touch. **None removed.**

---

# THE CHAIR'S RULINGS OF 2026-09-19, APPLIED AND RE-MEASURED

## P-27 · ⭐⭐ THE PLACEMENT CURE (ruling Q2) — ALL FOUR BUDGETS, AND THE GATE

**The placement.** `src/data/worldFactOptions.js` keeps the option VALUES (`TERRAIN_WEIGHTS`,
`TERRAINS`, `CULTURES`) because `src/generators` must reach them. `WORLD_FACT_SOURCES` moves into
`src/domain/worldFactOptions.js`, outside `resolveConfig`'s import closure. `resolveConfig.js` imports
the `src/data/` address; `galleryUtils.js` imports the `src/domain/` address.

A third overlay (`overlay-cure`) was built from `git archive a41a0e109` with exactly that shape, and
the repo's own `vite.config.js` derivations re-run against it.

### (d) ⛔ THE GATE THE CHAIR SET — THE EAGER FIRST-PAINT SET. IT HOLDS.

```
$ node eagerset.mjs > eager.cure.txt          # in overlay-cure
$ diff eager.control.txt eager.cure.txt
                                        (no output)
✅ IDENTICAL — byte-identical to the tip's 268
cure eager set size: 268
```

**Why it holds, proved rather than asserted.** `computeEngineSharedDomain()` seeds from
`src/generators` only. Every production reference to either new module, at the cure:

```
$ grep -rn "worldFactOptions" src/ --include='*.js' --include='*.jsx' \
    | grep -v "^src/data/worldFactOptions.js:" | grep -v "^src/domain/worldFactOptions.js:"
src/components/gallery/galleryUtils.js:1:import { TERRAINS, CULTURES as CANONICAL_CULTURES } from '../../domain/worldFactOptions.js';
src/generators/steps/resolveConfig.js:11:import { TERRAIN_WEIGHTS, CULTURES } from '../../data/worldFactOptions.js';

$ grep -rn "domain/worldFactOptions" src/generators/
                                        (no output; exit 1)
⛔ ESD GATE: no src/generators module imports the domain leaf — the seed is not tripped.
```

Exactly TWO production importers. Each checked against the repo's own eager set:

```
not-eager  src/domain/worldFactOptions.js
not-eager  src/data/worldFactOptions.js
not-eager  src/components/gallery/galleryUtils.js
  importer src/components/gallery/galleryUtils.js -> lazy ✅
```

**The domain leaf now carries data and imports the data module — the exact shape of the pinned
hazard — and it is safe because its only importer is not a first-paint module.** The hazard is the
GENERATOR edge, not the domain leaf itself (P-20g remains the proof of that: 268 → 270).

### Chunk routing under the cure — unchanged from v2

```
src/data/worldFactOptions.js               lazy     data-lazy
src/domain/worldFactOptions.js             lazy     (rollup default — co-locates with galleryUtils,
                                                     its sole importer; no manualChunks rule)
src/generators/steps/resolveConfig.js      lazy     engine
src/components/gallery/galleryUtils.js     lazy     (rollup default)
```

### (a) THE WORKER — closure and delta

```
$ node worker-closure.mjs src/workers/generation.worker.js …     # in overlay-cure
closure size: 220 source modules
IN   src/data/worldFactOptions.js
  via: generation.worker.js -> generationRequest.js -> generateSettlementPipeline.js
       -> steps/index.js -> steps/resolveConfig.js -> src/data/worldFactOptions.js
OUT  src/domain/worldFactOptions.js
OUT  src/components/gallery/galleryUtils.js
```

⭐ **The citation map and its leaf are OUT of the generation worker.** Minified (esbuild 0.28.1,
`{minify:true, format:'esm'}` — Vite's own minifier; an ESTIMATE):

```
CONTROL (tip)      6985 min   src/generators/steps/resolveConfig.js
                   3323 min   src/components/gallery/galleryUtils.js
CURE               6842 min   src/generators/steps/resolveConfig.js     (-143)
                    349 min   src/data/worldFactOptions.js              (new, IN the worker)
                    582 min   src/domain/worldFactOptions.js            (new, OUT of the worker)
                   3226 min   src/components/gallery/galleryUtils.js    (-97)

WORKER NET = (6842 + 349) - 6985 = +206 B      projected 1,401,334 vs the 1,401,128 ceiling
BOUND (estimate x2) = 412 B                    re-mint must land <= 1,401,540 B
```

**Against the rejected alternative: +634 B → +206 B, a saving of 428 B** — 67% of the ask, and every
saved byte is a byte the generation worker never executes. The lane's pre-ruling prediction was
"≈ +244 B"; the measured figure is +206 B.

### (b) THE ENGINE, (c) DATA-LAZY

```
(b) engine chunk   resolveConfig.js only:  -143 B   (a SHRINK)
                   against expect(size).toBeLessThan(679_000), measured 678,131 at 023eda2ec
                   (869 B of margin) — no breach, no edit.
(c) data-lazy      +349 B (the VALUES leaf only; the domain leaf is not routed here)
                   against DATA_LAZY_RAW_CEILING_BYTES = 3_098_110 over a measured 939,520
                   — a ~2.16 MB allowance.
```

⚠ **PLAUSIBLE, not confirmed:** the domain leaf's final chunk is Rollup's default co-location with
`galleryUtils.js`, its sole emitted importer. It carries no manualChunks rule, so a build is the only
thing that can say for certain where it lands. It is not in the worker (CONFIRMED above) and not in
the eager set (CONFIRMED above), which is what both ceilings turn on. Ruling Q3's new §8 step 9.7 —
READ and QUOTE the emitted engine size — is exactly the instrument that closes this at the build.

## P-28 · THE DRY READ, RE-RUN AGAINST THE AMENDED MANIFEST

Amended: six change rows (`vendorPdfLazy.test.js` dropped — ruling Q3), twelve `requiredSymbols`,
seven acceptance cases, eight `checks` arrays.

```
$ git diff --stat d31af2cee a41a0e109 -- <every AMENDED manifest + requiredSymbols path>
 tests/build/generationWorkerLazy.test.js | 20 +++++++++++++++++++-
 1 file changed, 19 insertions(+), 1 deletion(-)
```

⭐ **Dropping `vendorPdfLazy.test.js` removes one name from the refusal message and nothing else —
the base-stamp constraint stands on the worker row alone.** At `d31af2cee` the dispatch still throws
`verified-base descendant changed declared substrate: tests/build/generationWorkerLazy.test.js`; at
the tip `assertAncestorAndSubstrate` short-circuits at `:184` (`head === packet.verifiedBase`).

| check | source | verdict at the tip |
|---|---|---|
| status is READY | `:274` | the chair's promotion supplies it |
| manifest validates | `:271` | PASSES — six rows, no duplicate path; 7 cases ≤ 8; every action in `PACKET_ACTIONS`; every `checks` row a non-blank argv string array (`:868-873`) |
| branch matches the capsule | `:353` | the build lane holds the integration branch in ITS worktree |
| base is an ancestor of HEAD | `:176-183` | PASSES |
| substrate unchanged since base | `:185-196` | **SHORT-CIRCUITS at `:184`** once the base is the tip |
| capsule names every substrate path | `:197-200` | PASSES |
| CREATE targets absent and Git-clean | `:205-211` | PASSES — `ABSENT src/data/worldFactOptions.js`, `ABSENT src/domain/worldFactOptions.js` at `a41a0e109` |
| non-CREATE targets Git-clean | `:212-213` | PASSES on a clean lane worktree |

Reservation re-checked for the one remaining ceiling path, across all 188 packets:

```
tests/build/generationWorkerLazy.test.js → none — free for EM-P3 to reserve
```

## P-29 · WHY THE `VERIFY_DIST=1` INVOCATION IS NOT AN ARGV ROW (ruling (ii))

The ceiling arms are guarded:

```
$ grep -n "describe.runIf\|REQUIRE_DIST\|DIST_EXISTS" tests/build/generationWorkerLazy.test.js
114:const DIST_EXISTS = existsSync(DIST) && existsSync(ASSETS);
115:const REQUIRE_DIST = process.env.VERIFY_DIST === '1';
321:      !REQUIRE_DIST || DIST_EXISTS,
327:describe.runIf(DIST_EXISTS)('generation worker — production boundary', () => {
```

**Without `VERIFY_DIST=1` the whole production describe — including the ceiling arm — silently
skips.** A focused run then prints green having proved nothing: the vacuous-green class.

The manifest's `checks` cannot carry the env:

```
$ <argv[0] vocabulary across every declared check in the manifest>
{ npx: 534, npm: 247, node: 61, bash: 1 }        sh-rooted checks: 0
$ sed -n '186,194p' scripts/implementation-gate.mjs
function runArgv(argv, { cwd = ROOT, env = process.env } = {}) {
  …  spawnSync(command[0], command.slice(1), { cwd, env, …, shell: false });
```

`shell: false` means no argv row can hold `VAR=value`, and the estate's only shell-rooted check is
`["bash","-n","scripts/mutation-sweep.sh"]` — a syntax check, not a `-c` wrapper. **But the same
spawn takes `env = process.env`**, so the env reaches every check from the shell that invokes the
gate. Therefore: the manifest carries the plain `tests/build/…` argv row (added — `checks[3]`), and
§8 step 9.8 / §10 carry the authority that the build lane **exports `VERIFY_DIST=1`** in that shell.
Inventing an `sh -c` idiom with zero precedent was considered and rejected.
