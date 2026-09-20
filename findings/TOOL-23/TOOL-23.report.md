# TOOL-23 — the reachability census: what the 248 actually are

**Lane:** TOOL-23 (Opus MEASUREMENT, read-only). **Chair:** Fable 5.1, session a9df403c.
**Read tip:** `$SP/read-tip-tool23`, detached at **`5dd5e8e68`** ("FIX-P1c: the seed field declares
the address ceiling…"). **Stamp (from `date`): `Sun Sep 20 13:41:50 EDT 2026`.**
**This lane edited nothing.** `git status --short` at the read tip printed **0 lines at start and
at end**; goldens read once at the end and never written:
`generator-golden-master.json 7177cd6e89ebee404dec05d725d91e98ff59d2cfa124104a9a22515a7c8e8f1e` ·
`dossier-prose-manifest-golden.json 88983938ddcf28341031e186d855fef950e6b299ec4b8fc87f170ece1b994084`.
No gate was run: every instrument is plain `node` or `git`, so no mutex window was taken.

---

## THE VERDICT IN ONE LINE

**The 248 reproduces as 249 at this tip and the count is sound — but "unreachable from the seven
Vite entries" is NOT "dead": 65 of the 249 (908,274 B) ship or are read by the typecheck, 140 are
instruments that measure shipped behaviour, and the genuinely retirable population is 44 modules
(291,756 B · 3,244 effective lines · 5,978 raw lines · 2 plant rows · 25 test files), of which
exactly 8 have no consumer of any kind.**

---

## 0. What moved since FIX-D9, and why the count differs

| figure | FIX-D9 (base `6a3e8089f`) | TOOL-23 (tip `5dd5e8e68`) |
|---|---|---|
| `src/` modules walked | 2,247 | **2,251** |
| `manualChunks()=='engine'` | 111 | **105** |
| reachable from some entry | 2,005 | **2,008** |
| UNREACHABLE roster | **248** | **249** |
| `EAGER_FIRST_PAINT_MODULES` | 268 | **269** |

**CONFIRMED.** FIX-D9's three commits are **not** on my tip —
`git merge-base --is-ancestor 47197c30a 5dd5e8e68` → *not an ancestor*; likewise `dbf3d09fe`. So
`tests/lint/deadCodeDisposition.walker.test.js` **does not exist at my read tip** and
`src/domain/region/foldTradeCategories.js` is still on disk and still in my roster. The brief's
"start from the remaining population" therefore means **245** for me; both figures are given below.

---

## 1. The entries, enumerated — never a hand list

The seven entries were re-derived at this tip from the three sources the brief names.
**CONFIRMED; the count is seven and it matches FIX-D9's.**

| # | entry | how it was found |
|---|---|---|
| 1 | `src/main.jsx` | `index.html:95` — `<script type="module" src="/src/main.jsx">`; the ONLY `type="module"` tag in the file |
| 2 | `src/workers/advanceInterval.worker.js` | `src/lib/advanceWorkerClient.js:79` `new Worker(new URL('../workers/advanceInterval.worker.js', import.meta.url))` |
| 3 | `src/workers/customContentPreview.worker.js` | `src/lib/customContentPreviewClient.js:17-18` |
| 4 | `src/workers/generation.worker.js` | `src/lib/generationClient.js:52` |
| 5 | `src/workers/townSceneExport.worker.js` | `src/lib/townScene/townSceneExport.js:74-75` |
| 6 | `src/workers/townScene.worker.js` | `src/lib/townScene/townSceneWorkerClient.js:98` |
| 7 | `src/utils/pdfRender.worker.js` | `src/utils/generateSettlementPDF.js:123-124` — **not** under `src/workers/` |

Closure controls, all executed at this tip:

- `git ls-files 'src/**' | grep -E '\.worker\.(js|jsx)$'` returns **exactly six** files, and all six
  appear above — no worker file is constructed by a path my `new Worker(` scan missed.
- `vite.config.js` has **no `input:` key** under `rollupOptions` (grep `input\s*:` → no hit), so
  Vite's default single-HTML entry stands; `index.html` is the only HTML at the build root
  (`public/**` and `docs/samples/**` are copied or out of tree, never built).
- **There is exactly one vite config** (`git ls-files | grep vite.*config` → `vite.config.js`), and
  `package.json`'s `build` is a plain `vite build`.
- ⭐ **The resolver's relative-only assumption is SOUND here, executed:** there is no
  `resolve.alias` in `vite.config.js`, no `paths` in `tsconfig.json`, and no `import.meta.glob`
  anywhere under `src`. The four `@/…` specifiers in the tree
  (`theme.js:14`, `copy/index.js:9`, `lib/entities.js:31`, `lib/flags.js:27`) are **all inside
  JSDoc/comment prose**, not real imports. An alias would have silently inflated the roster; it
  does not exist.
- Non-vacuity controls all `true`: `customContentSchema.js`, `generateSettlementPipeline.js`,
  `customSupplyChainActivation.js`.

`entries 7; src modules in graph 2251; REACHABLE from some entry 2008; roster 249.`
(2251 − 2008 = 243 while the roster is 249, for FIX-D9's stated reason: the reachable set counts six
non-`.js/.jsx` resolutions — five `.css` files and `foundry-module/scripts/markdownEscape.js`. The
**roster is the honest figure**, and it is what every table below is built from.)

---

## 2. ⛔ THE PREMISE CORRECTION — the seven entries are ONE runtime, not the product

The brief prices "the dead mass". Measurement says a large part of that mass is not dead: the Vite
browser bundle is one of **four** places this repo's `src/` runs or is read. Each of the following
is CONFIRMED by execution, and each is invisible to a Rollup-entry closure by construction.

### (a) The Supabase Edge Functions (Deno) — a second SHIPPED runtime. **5 modules.**

`supabase/functions/_shared/*.meta.json` declares each shipped bundle's entry and full input
closure. Cross-checking the roster against those five metas:

```
aiCharterBundle.meta.json      entry: src/domain/aiCharter.js      inputs: 114
aiGroundingBundle.meta.json    entry: src/domain/aiGrounding.js    inputs:  74
aiOutputSchemaBundle.meta.json entry: src/domain/aiOutputSchema.js inputs: 115
analyticsEventsBundle.meta.json entry: src/lib/analyticsEvents.js  inputs:   2
intentAtlasBundle.meta.json    entry: src/domain/intentAtlas.js    inputs:   2

DARK modules that are declared inputs of a SHIPPED edge bundle: 5
    src/domain/aiCharter.js       <-- BUNDLE ENTRY of aiCharterBundle.meta.json
    src/domain/aiGrounding.js     <-- BUNDLE ENTRY of aiGroundingBundle.meta.json
    src/domain/aiOutputSchema.js  <-- BUNDLE ENTRY of aiOutputSchemaBundle.meta.json
    src/domain/contradictions.js
    src/domain/intentAtlas.js     <-- BUNDLE ENTRY of intentAtlasBundle.meta.json
```

**These four bundle entries plus `contradictions.js` are live production code.** They are exactly
the modules the browser never imports *because* the edge functions are where they run. A retirement
list that trusted the seven-entry scan alone would have proposed deleting the AI layer's four
bundle roots. This is also the population LANE-PARALLEL's addendum-98 regeneration law already
guards; the law and this finding are the same fact seen from two sides.

*(`api/` is a third runtime but costs nothing here: `api/_galleryMeta.js` and `api/_metaShell.js`
import only `resolveTerrain.js`, `tierStockImage.js` and `worldCode.js`, **all three reachable**.
No roster member has an `api/` or a direct `supabase/` importer.)*

### (b) The authoring pipeline whose OUTPUT ships. **57 modules.**

Eleven `scripts/` producers write files that are **committed and served**:
`generate-k0-spike / k0b / k1 / k2 / k3 / k4 / realm-preview` → `public/landing-maps/**`
(**73 tracked files**, rendered by the live `src/components/home/LandingArtifacts.jsx`);
`generate-compendium-data` → `src/domain/compendium/generated/compendiumData.generated.js`;
`generate-dossier-state-prose` → `src/data/dossierStateProse/*.generated.js` (**6 tracked**);
`gen-organic-vars` → `src/styles/organicVars.css` (tracked); `generate-landing-fixture` → its
module path. Their transitive `src/` closure holds **57 roster members** — the whole
`src/domain/townMap/arch/**` kernel (the GLB/plate/mesh authoring stack), `src/domain/prose/`'s
walkers and holder table, `src/design/organic/**`, `src/domain/compendium/**`,
`src/domain/realmMap/realmPlateRenderer.js`. Deleting any of them breaks the ability to
**regenerate** a shipped asset; the asset itself is already in `dist/`.

### (c) The typecheck reads edges Rollup erases. **3 modules (5 pins).**

`@typedef {import('./x.js').T}` is a real `tsc` dependency and is **erased before Rollup ever
sees it** — so a JSDoc-type-only module is unreachable from every entry *by construction*. A
comment-stripping scanner (FIX-D9's, TOOL-12's, and my own first pass) cannot see this. Re-scanned
with comments KEPT:

| module | LIVE (reachable) type consumers | example |
|---|---:|---|
| `src/domain/worldPulse/pulseShapes.js` | **23** | `src/domain/display/armyStrength.js:35` |
| `src/domain/types.js` | **16** | `src/domain/coherence/checkDraftEdit.js:16` |
| `src/lib/importReconciliationTypes.js` | **2** | `src/lib/importReconciliationAdmission.js:37` |
| `src/domain/drawOpsSvg.js` | 1 | `src/domain/townMap/massing.js` *(also ARTIFACT-SOURCE)* |
| `src/domain/worldPulse/npcCirculationTransit.js` | 1 | `routeNetworkConsumersTransit.js` |

All three of the first rows sat in my orphan list until this scan. `tsconfig.full.json` includes
`src/domain/**/*.js`, `src/lib/**/*.js`, `src/hooks/**/*.js`, `src/store/**/*.js` — **deleting any
of them reds `npm run typecheck`, not the build.** The ORPHAN class drops 11 → **8**.

### (d) A file can be consumed by its PATH, with no import at all.

231 of 249 are named by some non-bulk file; **222 by a `tests/` file** and 84 by a `scripts/` file.
Two examples that change a disposition:
`tests/ui/networkEffectsAdvisoryPin.test.jsx:124` names
`src/components/settlementDetail/computeNetworkEcho.js` as a **named sibling in a single-home source
scan's denominator** — deleting the file reds that test even though nothing imports it; and
`tests/lint/settlementMapSurfaceAllowlist.walker.test.js:187` carries
`src/components/townMap/edgeAnnotations.js` in an `at:` allowlist row.
**18 modules are named by nothing but the bulk content-addressed registers** — that set is the
cheapest-retirement short list and it is given in §4.

---

## 3. The census — 249 rows, classified

Classes are **measured**, not read off headers. The decisive question is *what depends on this*:

| class | meaning, and the discriminator that decides it |
|---|---|
| `LIVE-EDGE-RUNTIME` | a declared input of a shipped `supabase/functions/_shared` bundle |
| `LIVE-AUTHORING` | in the import closure of a script that writes a **committed** artifact |
| `TYPE-PINNED` | a REACHABLE module imports its types in JSDoc; `tsc` resolves it, Rollup erases it |
| `ORACLE-INSTRUMENT` | its consuming test/script **also imports reachable `src/`** — it measures shipped behaviour |
| `TEST-ONLY-FIXTURE` | every consumer imports **no** reachable `src/` — the tests exercise dead code only (the brief's definition, made executable) |
| `BARREL-DEAD` | reachable only through a re-export nothing consumes |
| `ORPHAN` | no importer of any class, no type pin |
| *inherited* | a module whose only importers are other roster members takes the best class of its importer chain (a fixpoint; without it 25 `certification/subsystemRows*` leaves misgrade as fixtures) |

### Totals — whole roster (249)

| class | n | bytes | eff lines | plant rows (sweep/manifest) | OSR rows | tuning rows |
|---|---:|---:|---:|---:|---:|---:|
| LIVE-EDGE-RUNTIME | 5 | 123,135 | 1,223 | 0 / 3 | 5 | 3 |
| LIVE-AUTHORING | 57 | 763,948 | 7,131 | 8 / 5 | 57 | 35 |
| TYPE-PINNED | 3 | 21,191 | 3 | 0 / 0 | 3 | 0 |
| ORACLE-INSTRUMENT | 140 | 2,930,696 | 30,086 | 8 / 9 | 138 | 58 |
| TEST-ONLY-FIXTURE | 36 | 265,780 | 2,993 | 0 / 1 | 36 | 7 |
| **BARREL-DEAD** | **0** | 0 | 0 | 0 / 0 | 0 | 0 |
| ORPHAN | 8 | 25,976 | 251 | 0 / 1 | 8 | 0 |
| **TOTAL** | **249** | **4,130,726** | **41,687** | **16 / 19** | **247** | **103** |

### Totals — the remaining population (245: roster minus FIX-D9's four)

`245 modules · 4,077,887 B · 41,336 effective lines · 76,369 raw lines`

| class | n | bytes | eff | plants |
|---|---:|---:|---:|---:|
| LIVE-EDGE-RUNTIME | 5 | 123,135 | 1,223 | 3 |
| LIVE-AUTHORING | 57 | 763,948 | 7,131 | 9 |
| TYPE-PINNED | 3 | 21,191 | 3 | 0 |
| ORACLE-INSTRUMENT | 137 | 2,880,110 | 29,757 | 15 |
| TEST-ONLY-FIXTURE | 35 | 263,527 | 2,971 | 1 |
| BARREL-DEAD | 0 | 0 | 0 | 0 |
| ORPHAN | 8 | 25,976 | 251 | 1 |

### ⛔ Two of the brief's five classes came back EMPTY or NEAR-EMPTY — stated, not adjudicated

- **`BARREL-DEAD` = 0.** Only four roster members are barrels, and none is dead in the brief's
  sense: `src/domain/worldPulse/index.js` (22 `export *` rows) has **150 importers** — 143 test
  files and 7 scripts, zero `src/` — it is a **test-facing facade over reachable code** (443
  worldPulse modules exist; only 50 are in the roster); `src/design/organic/index.js` is an
  artifact-pipeline entry (`gen-organic-vars.mjs:12` imports `organicCssRootBlock` from it);
  `src/domain/interior/index.js` is a pure re-export whose five importers are tests. The one true
  barrel-with-no-consumer, `src/components/organic/index.js`, has **zero importers**, so it grades
  ORPHAN on the stricter test — it is the brief's BARREL-DEAD by intent and ORPHAN by measurement,
  and I name it in both places rather than pick.
- **`SUPERSEDED` was not computable as a bulk class** and I did not guess at it. It is a
  *historical* claim (FIX-D9 proved `foldTradeCategories`'s by tracing `d855b58fc8` →
  `c1ea091f7a`), and proving it for 249 modules means 249 history traces. I found **one** by
  measurement and prove it in §4: `src/store/deitySnapshot.js`. Every other candidate is graded by
  its dependency shape, and the SUPERSEDED question is left open per module.
- **`DARK-BY-DESIGN`**: FIX-D9's three density modules grade ORACLE-INSTRUMENT here (their one
  test, `tests/generators/densityLaw.test.js`, also imports reachable `src/`, which is exactly why
  it is a live oracle over the dormant law). FIX-D9's signed disposition stands and outranks my
  structural grade; I did not re-litigate it.

### The 249-row table

`$SP/lane-tool-23-scratch/table.md` (251 lines) holds one row per module:
class · bytes · effective lines · module · importers `tests/scripts/dark-src` · live JSDoc type
pins · path-string refs `tests/scripts/src` · plant flag (`S`=`mutation-sweep.sh`,
`M`=`mutation-coverage-manifest.json`) · register flags (`OSR`, `TUN`, `ANY`, `DISPO`) · birth date
· last-touched date. It is sorted by class then bytes; FIX-D9's four carry a ⓕ.

### Mutation obligations — plants aimed at the roster

**16 modules are named in `scripts/mutation-sweep.sh`; 19 in `scripts/mutation-coverage-manifest.json`
(30 distinct).** By class: LIVE-AUTHORING 8/5, ORACLE-INSTRUMENT 8/9, LIVE-EDGE 0/3,
TEST-ONLY-FIXTURE 0/1, ORPHAN 0/1. **Only two plant rows sit on a retirement candidate** —
`src/domain/display/heraldIndex.js` and `src/components/settlementDetail/computeNetworkEcho.js`,
the latter being the single-home-scan denominator member described in §2(d). The brief's worry that
"plants aimed at dead code are budget spent on nothing" is **28 of 30 misplaced**: the plants are
aimed at authoring code and oracles, which do run.

### Existing disposition rows — 5 of 249

`docs/DEAD_CODE_DISPOSITION.md` already names `src/data/categoryVocabulary.js`,
`src/domain/counterfactual.js`, `src/hooks/usePricingMoment.js`, `src/lib/debounce.js`,
`src/pdf/primitives/StatTile.jsx`. Four are KEEP-AS-SEAM / OWNER-VERIFY holds; `usePricingMoment.js`
is the **paid-surface OWNER-VERIFY** the 2026-07-14 ruling explicitly declined to cover.

---

## 4. ESD and eager, re-run with ALL unreachable generators skipped

Both derivations re-run verbatim at **my** tip (FIX-D9's `eager.mjs`, generalised to read the
roster instead of a hand-written trio). **CONFIRMED, executed:**

```
UNREACHABLE GENERATOR MODULES SKIPPED (3): src/generators/density/densityAscension.js,
  src/generators/density/successionGrammar.js, src/generators/density/titularSuccession.js
ESD post-excision   now 51   with ALL unreachable generators skipped 49
EAGER_FIRST_PAINT   now 269  with ALL unreachable generators skipped 267

== MODULES THAT LEAVE FIRST PAINT IF EVERY UNREACHABLE GENERATOR GOES (2) ==
     9476 B  src/domain/density/factionLifecycle.js
    25924 B  src/domain/spatial/cohesionWeave.js
  TOTAL 35400 B of SOURCE (624 lines) — source bytes, NOT emitted bytes
```

**The figure FIX-B3 should build against is ESD 51 → 49 and EAGER 269 → 267.** The roster holds
exactly three `src/generators/**` modules, so "all unreachable generators" and FIX-D9's "dark trio"
are the same set at this tip; the EAGER pair differs from FIX-D9's 268 → 266 only because the tip
moved (+1 eager module), and the two held modules are identical.

⭐ **A caveat FIX-B3 needs, and it is new:** `src/domain/spatial/cohesionWeave.js` — the larger half
of the 35,400 B — is a **declared input of BOTH `aiCharterBundle` and `aiOutputSchemaBundle`.**
Taking it out of the eager set does not take it out of the product; it still ships in the edge
runtime and is still emitted for its 17 non-generator browser importers. The honest claim remains
FIX-D9's: *two modules are pinned into the eager first-paint set by three modules nothing can
reach* — and I add that one of the two is independently load-bearing elsewhere. **PLAUSIBLE, NOT
CONFIRMED:** that emitted first-paint bytes fall at all. No build was run by this lane.

---

## 5. THE PROPOSAL — per class, with prices (§934.70's class: I propose, the owner decides)

**The retirable population is 44 modules: 291,756 B · 3,244 effective lines · 5,978 raw lines ·
25 distinct test files · 2 plant rows.** That is **7.1 %** of the roster's bytes. The other 205
modules (3,838,970 B) each have a measured reason to exist.

### The price of ONE retirement, measured from an executed precedent

`git show --stat 3a5618ed8` (FIX-D9's `foldTradeCategories` retirement) touched **five files**:

```
 docs/content/wiring-census.json          |  2 +-
 src/domain/customContentSchema.js        | 19 ++++++-----
 src/domain/region/foldTradeCategories.js | 44 -------------------------
 tests/domain/foldTradeCategories.test.js | 56 --------------------------------
 vite.config.js                           |  2 +-
 5 files changed, 13 insertions(+), 110 deletions(-)
```

Three prices fall out, all CONFIRMED:

1. **`scripts/.observed-shape-readers-baseline.json` is NOT in that list.** 247 of 249 carry an OSR
   row, and the executed precedent proves a retirement does **not** need the content-addressed
   register edited or a migration-bundle door. That removes the largest apparent cost from every
   row of the price sheet.
2. **`docs/content/wiring-census.json` moves by one counter** (`stamp.producerIndexFiles`, 1173 at
   this tip) and must be regenerated through its own door — **but only for modules inside the
   producer walk.** `scripts/wiring-census.mjs:218-224` walks `src/generators/**` and
   `src/domain/**` and nothing else. **18 of the 44 candidates are inside it; 26 are outside and
   cost no census move at all.**
3. **`vite.config.js` is touched only if the module has an `ENGINE_SHARED_DOMAIN_EXCISIONS` row.**
   None of the three cheapest candidates does.

**No golden moves for any candidate. CONFIRMED twice:** no candidate's *path* appears in either
golden, and a literal scan (every quoted prose-shaped string of ≥ 12 characters in all 44 files,
tested against both goldens) returns **0 hits**.

### The three cheapest safe retirements, named first

| # | module | bytes / eff | why it is safe | full price |
|---|---|---|---|---|
| 1 | **`src/store/deitySnapshot.js`** | 295 / 1 | **SUPERSEDED — the only one I can prove.** Its whole body is `export { deitySnapshotFrom } from '../domain/deitySnapshot.js';` under a header reading *"Compatibility path for callers that historically imported from the store. The zero-import authority now lives in domain."* The successor `src/domain/deitySnapshot.js` **is reachable** (not in the roster) and every live caller already imports it directly (`EventComposerDeityField.jsx:26`, `contentSampleCategoryFixtures.js:23`). The shim has **zero importers of any class**. | 1 file. Outside the wiring-census walk. No test, no plant, no `vite.config.js` row, no golden. |
| 2 | **`src/components/organic/index.js`** | 502 / 4 | **BARREL-DEAD / ORPHAN.** A four-line barrel re-exporting `Rule.jsx`, `Register.jsx`, `Manuscript.jsx`, `Ornament.jsx`. Raw path grep across `src tests e2e scripts api supabase` finds **no importer** — the only `organic/index.js` hits are the OSR register and the *different* `src/design/organic/index.js`. `tests/ui/organicPrimitives.test.jsx` imports the four leaves **directly**, so the barrel's deletion touches no test. | 1 file. Outside the census walk. No test, no plant, no register but OSR. |
| 3 | **`src/hooks/usePosture.js`** | 3,917 / 43 | **ORPHAN, zero references of any kind.** `git grep usePosture -- src tests e2e scripts api supabase docs` returns **only the OSR baseline and the file itself**. ⛔ Its own header at `:16` claims *"usePosture is imported only by the (lazy) organic …"* — **that claim is false at this tip**; the importer is gone and the comment was never updated. | 1 file. Outside the census walk. No test, no plant, no doc row. |

### Per class — the recommended fate and its price

| class | n | recommended fate | price of that fate |
|---|---:|---|---|
| LIVE-EDGE-RUNTIME | 5 | **KEEP — and fix the instrument, not the code.** These are shipped Deno entries. | Zero. The cure is a note in `docs/DEAD_CODE_DISPOSITION.md` and a `NON-VITE RUNTIME` exemption in whatever walker FIX-D9's arm becomes, so no later sweep proposes them again. |
| LIVE-AUTHORING | 57 | **KEEP with a header line.** Their output is committed and served; deleting them costs the ability to regenerate 73 + 7 tracked artifacts. | 57 one-line headers, or one directory-level note per family (`townMap/arch`, `domain/prose`, `design/organic`, `domain/compendium`) — four notes covers 50 of the 57. |
| TYPE-PINNED | 3 | **KEEP — the typecheck reads them.** | Zero. Same exemption line; they are precisely the "JSDoc-typedef-only" allowlist the 2026-07-14 doc's own proposed ratchet anticipated at line 118. |
| ORACLE-INSTRUMENT | 140 | **KEEP.** Their consumers measure shipped behaviour; the certification and prose families are the estate's own evidence apparatus. | Zero code. 15 plant rows and 58 tuning rows all stay live and correctly aimed. |
| TEST-ONLY-FIXTURE | 36 | **OWNER DECIDES, module by module.** These are built-and-tested behaviour that reaches no runtime: the un-mounted feature set. | Retiring all 36 = 265,780 B, 2,993 eff lines, 25 test files, 1 plant row, 7 tuning rows, 1 `.domain-any-baseline.json` row (shrink-only, legal). **All 18 of the candidates inside the wiring-census walk are in this class**; the other 18 are outside it. |
| BARREL-DEAD | 0 | — | — |
| ORPHAN | 8 | **RETIRE the clean ones; four are gated or registered.** | 25,976 B, 251 eff lines, **0 tests on all eight** (executed), and **none is inside the wiring-census walk** — every one sits under `src/components`, `src/hooks` or `src/store`. See the carve-outs below. |

### Named LAST, per the brief: the rows whose deletion moves a register or is owner-gated

- **`src/hooks/usePricingMoment.js`** (2,053 B) — **PAID SURFACE, owner-gated.** Already an
  OWNER-VERIFY hold the 2026-07-14 blanket ruling explicitly declined to cover
  (`DEAD_CODE_DISPOSITION.md:53`, `:159-160`). Two docs name it. **Not proposed.**
- **`src/components/settlementDetail/computeNetworkEcho.js`** (2,287 B) — carries a
  `mutation-coverage-manifest.json` rationale AND is a **named member of a single-home source
  scan's denominator** at `tests/ui/networkEffectsAdvisoryPin.test.jsx:124`. Deleting it reds that
  test and voids a documented two-plant proof. **Retirement requires editing the pin first.**
- **`src/components/interior/InteriorView.jsx`** (4,919 B) — registered as an **artwork plate** in
  `src/design/boundBook.js:115`, pinned by the build test `tests/build/interiorLazy.test.js`, and
  already dispositioned in prose at `src/config/entitlementLadder.js:225` ("*unshipped, so the claim
  had nothing behind it on either tier*"). Deleting it dangles an artwork row.
- **`src/components/townMap/edgeAnnotations.js`** (9,531 B) — an `at:` row in
  `tests/lint/settlementMapSurfaceAllowlist.walker.test.js:187`; both
  `scripts/check-observed-shape-readers.mjs:1089` and `tests/lint/observedShapeSentinel.test.js:1320`
  record it as having been *moved off* the genuinely-dead list. Deleting it is a walker-row change.
- **`src/components/new/tabs/tabPalette.js`** (2,472 B) — cited by comment from two **reachable**
  modules (`src/design/tokens.js:412`, `src/domain/display/dossierViewModel.js:41`, the latter
  calling it "the sanctioned exact-value escape hatch for colour"). Deleting it leaves two anchors
  the citation walker may convict.
- **`src/domain/display/regionWakeReplay.js`** (10,053 B) — the only candidate with a
  `tests/lint/.domain-any-baseline.json` row; a deletion needs a shrink-only baseline update.
- **`src/domain/display/heraldIndex.js`** (15,021 B) — the second plant row on a candidate.
- **The 18 candidates under `src/domain/**`** each regenerate `docs/content/wiring-census.json`
  (`producerIndexFiles` −1) through the census door, in FIX-D9's forced order.

---

## 6. ⛔ NOTICED AND NOT TOUCHED — each specific enough to slot

1. **The reachability walker FIX-D9 chartered will over-convict unless it learns three edge
   classes.** As briefed it proves "zero importers"; at this tip that would name 65 modules that
   ship or typecheck. It needs, as executed exemptions: (a) `supabase/functions/_shared/*.meta.json`
   inputs, (b) the committed-artifact producer closure, (c) JSDoc `import()` type edges.
   → **slot: FIX-D9's walker arm, before it composes.**
2. **`src/store/deitySnapshot.js` is a proven SUPERSEDED shim with zero callers** — 295 B, one
   effective line, no test, outside every walk. It is cheaper than `foldTradeCategories` was and the
   same shape. → **slot: a one-file retirement under the same door FIX-D9 used, at the owner's word.**
3. **`src/hooks/usePosture.js:16` asserts an importer that does not exist.** A false self-claim of
   the exact kind wave F7 cured in `pipelineRail.js`/`provenance.js`. → **slot: the same FIX that
   retires or keeps it; if kept, the header must say "BUILT but UNCONSUMED".**
4. **`docs/DEAD_CODE_DISPOSITION.md`'s own proposed ratchet (line 115-122) has not been built**, and
   its stated design ("walks the import graph FROM entry points across ALL of `src/`") is the design
   that produces the 65 false positives in item 1. → **slot: fold item 1's three exemptions into
   that proposal before it is built.**
5. **`src/domain/worldPulse/index.js` is a 22-row barrel with 150 consumers and zero `src/`
   importers** — a pure test-facing facade. It is neither dead nor product. If the estate wants the
   roster to mean something, this module wants its own disposition vocabulary ("TEST FACADE").
   → **slot: the disposition doc's vocabulary section.**
6. **The `src/domain/certification/**` family (29 modules, 967,513 B — 23 % of the roster's mass)
   is the estate's evidence apparatus living in `src/`.** `subsystemCertification.js` is reached
   from 15 tests and `scripts/audit/certify-subsystems.mjs`; the 25 `subsystemRows*` leaves are
   reached only through it. Nothing is wrong with it — but no walker or doc records that
   `src/domain/certification` is a non-product tree, so every future reachability sweep will
   re-find it. → **slot: a directory-level `@non-product` note, one file.**
7. **`tests/lint/.tuning-inventory.json` holds rows for 103 of the 249.** A retirement wave over
   the TEST-ONLY-FIXTURE class would touch 7 of them. Not measured: whether that register is
   shrink-only or frozen. → **slot: whichever lane prices the fixture retirements.**
8. **The `mutation-coverage-manifest.json` rationale for `computeNetworkEcho.js` records that a
   STANDING sweep plant is INELIGIBLE** because both targets carried uncommitted work "in this live
   shared tree" — dated to 2026-07-27 and conditioned on "add the standing plant when the wave
   folds". The wave folded. → **slot: TOOL-6b's family, alongside FIX-D9's item 5.**
9. **`src/lib/townScene/**` (5 modules, 34,596 B) all trace to the same removal**: TE-STRIP-1 and
   TE-STRIP-3 took the legacy settlement map off the website on 2026-08-29 and left the client,
   cache, view policy, adaptive quality and export behind — **yet `townScene.worker.js` and
   `townSceneExport.worker.js` are still two of the seven build entries.** The workers are
   reachable; their clients are not. That asymmetry is either a half-finished strip or a live
   surface with a dead front door, and I could not settle which without running the app.
   → **slot: an owner decision point on the TE-STRIP tail.**
10. **`src/data/dossierCausalProse.generated.js` is the single largest roster member (210,260 B,
    6,749 effective lines — 5 % of the mass on its own)**, a generated file with four consumers,
    none reachable. Its producer is not in my artifact-producer list, so it grades
    ORACLE-INSTRUMENT by its consumers rather than by its provenance. → **slot: whoever owns the
    prose corpus should confirm which generator writes it and whether the browser ever reads it.**
11. **The dossier-prose manifest golden moved between FIX-D9's base and this tip**
    (`921c51cf…` → `88983938…`), consistent with CURE-K/CURE-J. Recorded so no later lane reads
    FIX-D9's evidence hash as current. Not mine, not touched.
12. **`producerIndexFiles` is 1173 here** against FIX-D9's measured 1172→1171 at its base; the
    counter has moved with the tip. Any lane quoting a producer-index figure must re-measure.

---

## 7. Epistemic ledger

**CONFIRMED (executed; command and output in `$SP/lane-tool-23-scratch/`):** the seven entries and
their three sources; the absence of aliases, `input:`, `import.meta.glob` and a second vite config;
roster 249 and every per-module figure in `census.json`; the five edge-bundle members; the eleven
artifact producers and their committed outputs; the five live JSDoc type pins; the path-string
reference counts; ESD 51→49 and EAGER 269→267; the golden-literal scan returning zero; FIX-D9's
retirement `--stat`; `producerIndex`'s walk scope; FIX-D9 not being an ancestor of this tip.

**PLAUSIBLE, NOT CONFIRMED, and the experiment that would settle each:**
- *That retiring the 44 candidates leaves the gate green.* Settled by: a branch that deletes them
  and runs `tests/lint` whole plus `npm run typecheck`. This lane ran no gate.
- *That emitted first-paint bytes fall when the dark trio goes.* Settled by: `VERIFY_DIST=1` builds
  before and after. No build was run.
- *That the "commit that removed the last production importer" column is exact.* It is a basename
  pickaxe over `src` excluding the file itself, with the diff direction measured — strong where it
  prints `REMOVED` and names a strip wave (`townSceneWorkerClient.js`, `sceneCache.js`,
  `viewPolicy.js`, `adaptiveQuality.js`, `edgeAnnotations.js` → TE-STRIP-1/3; `townSceneExport.js`
  → TE-STRIP-4; `qualitativeBands.js` → the 2026-09-19 band-primitive removal), and only suggestive
  where it prints `ADDED`/`MOVED`/`-`. Settled per module by reading that commit's diff.
- *That `src/domain/certification/**` and `src/domain/prose/**` are non-product by owner intent
  rather than by accident.* Their headers say so (`wiringCensus.js:3` — "AN INSTRUMENT, NOT A
  PRODUCT SURFACE"); no register records it. Settled by the chair's ruling, not by measurement.

## 8. Artifacts

All under `$SP/lane-tool-23-scratch/` — nothing written anywhere else, no tree touched.

| file | what it holds |
|---|---|
| `TOOL-23.report.md` | this report |
| `table.md` | the 249-row table |
| `final.json` | the joined per-module record (every column in the table) |
| `census.json` · `census.out.txt` | bytes, lines, importers by class, exports, register membership |
| `classified3.json` · `classified3.txt` | the class assignment with its reason per module |
| `typedeps.json` · `typedeps.txt` | the JSDoc type-edge scan |
| `pathrefs.json` · `pathrefs.txt` | the path-as-string reference scan |
| `history.tsv.raw` | birth / last-touch / last-src-name-change per module |
| `declared.json` · `declared.txt` | header markers, governors, reverse-closure terminal consumer |
| `eager23.txt` | the ESD/eager re-run |
| `roster.txt` · `graph.json` · `closure.out.txt` | the roster and the graph it came from |
| `tools/` | every instrument (`census.mjs`, `classify3.mjs`, `typedeps.mjs`, `pathrefs.mjs`, `join.mjs`, `table.mjs`, `eager23.mjs`, `history.sh`, plus FIX-D9's and TOOL-12's copied read-only) |
