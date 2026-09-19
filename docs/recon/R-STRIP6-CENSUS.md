# R-STRIP6 CENSUS — sweep + terminal guard (read-only recon)

LANE R-STRIP6 (Fable survey seat). **Code facts at BUILD TIP `eba286607`** (all `git grep`/`git show` receipts at that sha unless said otherwise); **docs/ledger facts at HEAD `8f208c46e`** (ledger branch `review-fixes-2026-07-08`). Charter: DESIGN_MAP_MODULE_SPLIT.md §11.2 STRIP-6 row, corrected by §11.4 (terminal census = DIRECTORY ALLOWLIST, never a word-set) and ODQ §748.3 (`generate-k*.mjs` are the dark K-1 arch kernel, NOT map scripts). Exemplar standard: docs/recon/R-STRIP4-CENSUS.md.

LANDED STATE AT THE TIP (CONFIRMED, `git log --oneline eba286607 | grep -iE 'STRIP'` over the full history): **STRIP-1 landed** (`43c3ac380`, `5d839e198`, `08fd4f921`), **STRIP-3 landed** (`250a13d4a` … `1a2471990`), **STRIP-2 is the concurrent lane** (TE-STRIP-2 rebasing onto this tip, §749.3), **STRIP-4 and STRIP-5 are UNLANDED** (zero TE-STRIP-2/4/5 landing commits in history). Every row below states which of those it waits on. All claims CONFIRMED by executed grep/show with stated denominators unless marked PLAUSIBLE. Two-pass rule closed per section.

---

## A. THE SCRIPT ROSTER — exactly 4 settlement-map-only scripts of 108 top-level `scripts/` entries

Denominators: `git ls-tree eba286607 scripts/ --name-only` = 108 entries; pass 1 `git grep -nE 'townMap|townCartography|landing-maps|townPanorama|massing|cartog' eba286607 -- scripts/`; pass 2 (different terms) `git grep -lE 'buildTownMap|hasDrawableMap|mapEdits|fogSession|bespokeStyles|townMapFixtures' eba286607 -- scripts/` → the union adds NO fifth map script. `package.json` script rows enumerated in full (86 rows); `.github/workflows/ci.yml` read in full.

| # | Script | Map receipts | package.json row | CI | Consumers |
|---|---|---|---|---|---|
| 1 | `scripts/gen-atlas-samples.mjs` | imports `buildTownMapModel` (:17), `buildTownMapSvg` (:18), `TOWN_MAP_STYLE_IDS` (:19), `makeTownFixture` (:20); writes `docs/samples/atlas/` | **`gen:atlas-samples`** (package.json:29) — the ONLY package.json row among the four | none | `tests/design/atlasSamples.test.js:14` imports `{ atlasSamples, ATLAS_DIR }` (byte-stability drift guard — dies with it) |
| 2 | `scripts/generate-landing-map-plates.mjs` | header: writes `public/landing-maps/<slug>.<styleId>.svg` (:30); its settlement outputs are ALREADY GONE (STRIP-1) | none | none | `generate-cnocby-candidates.mjs` and `generate-massing-samples.mjs:42` import `dressedStyle`/`replayFixtureTown` from it (both die together); comment-only mentions in retained `generate-realm-preview.mjs:6,40` + `src/domain/realmMap/realmPlateRenderer.js:57,360` (tolerate or trim) |
| 3 | `scripts/generate-cnocby-candidates.mjs` | `buildTownMapModel, hasDrawableMap, buildTownMapPanoramaSvg` (:36); `OUT_DIR = public/landing-maps` (:44) | none | none | none |
| 4 | `scripts/generate-massing-samples.mjs` | townMap barrel (:34-38), `glyphAssign` (:39), plate emitter import (:42); `OUT_DIR = public/landing-maps` (:45) | none | none | none |

All four are stale emitters already: `git ls-tree eba286607 public/landing-maps/` holds ONLY `realm-preview.*` ×6 (STAYS, Q9) + `k0/k0b/k1/k2/k3/k4-exhibit/` (64 files, arch kernel) — the 80 settlement plates left in STRIP-1.

**NOT map scripts, verified (the near-misses):** `generate-k0-spike|k0b|k1|k2|k3|k4.mjs` — arch kernel per ODQ §748.3; they import ONLY `src/domain/townMap/arch/**` (e.g. k1.mjs:23-31), and their `public/landing-maps/k*-exhibit` outputs are PINNED by `tests/architecture/archViewWall.test.js:171` (reads `k1-exhibit/index.html`, `k4-exhibit/index.html`) — deleting the exhibit dirs reds the arch wall. Never sweep them. Also not in scope: `validate-map-fork.mjs` (validates the FMG realm fork rooted at `public/map/`, :8 — the `validate:map` gate arm, STAYS), `generate-realm-preview.mjs` (realm surface), `optimize-landing-backgrounds.mjs` (page atmosphere, Q9), `generate-landing-fixture.mjs` (engine fixture — the map scripts import FROM it, not vice versa), `premise-map.mjs` (§77 packet machinery — word-match only), `scripts/audit/town-scene-local-matrix.mjs` (townScene, Q6′ — imports `tests/fixtures/townMapFixtures.js:35`, so that FIXTURE is retained), `generate-compendium-data.mjs` (retained generator with a townMapStyles import — §D5 coupling, TRIM not delete).

**⚠ MINT TRIGGER (§349.2):** the sweep deletes exactly ONE package.json row (`gen:atlas-samples`, package.json:29). Any package.json byte change is a mint trigger — this is one mint, not waved off. TE-STRIP-2's PDF/export-libs strip plausibly changes package.json dependencies in the same window; **land the row deletion in the same act as (or immediately behind) STRIP-2's package.json change so the program pays ONE mint, not two** (coordination row, §G1).

**CI disposition:** `.github/workflows/ci.yml` at the tip references NONE of the four scripts (denominator: full-file read; zero hits for atlas/cnocby/massing/landing-map). The one map-named CI step, `- run: npm run validate:map` in `check-validation`, is the FMG realm-fork validator — **STAYS UNTOUCHED**. STRIP-6 owes CI zero edits.

## B. HAZARD-REGISTRY + PREMORTEM MAP ROWS — the finding is that there are NONE to sweep

**hazard-registry.json** (CONFIRMED, two passes):
- Enforcer paths: **67 total** (extracted mechanically from every class's `enforcer.paths`); **zero** match `townmap|towncartog|town-map|panorama|fog|glyph|atlas|cnocby|massing|landing-map` — the single 'atlas' hit is `tests/edgeFunctions/intentAtlasBundle.freshness.test.js`, the AI intent atlas (word-match, not the map). `check-hazard-registry.mjs` arm D (:307) requires every enforcer path to EXIST on disk — satisfied through every strip wave, since no enforcer path is map-owned.
- Rows that MENTION townMap files: the TCD-4/SCW family only — `instanceEvidence` at :318 (townLayoutV2 `economicState.exports` cure), `watchFor` at :345 (`siteGenesis.js`, `asymmetrySources.js`) and :349 (`townLayoutV2.js:250-283,320`), plus :343 (SITE_COHERENCE_AUDIT). **Every named file is RETAINED substrate** (J-STRIP-1 / R-STRIP4 §A roster) — the rows stay TRUE post-strip. Row :507's check-chain quote includes `validate:map` — also stays true. Rows :388-396 are `SERVICE_CATEGORY_MAP` (a JS Map — word-occurrence, excluded per the membership law).
- **VERDICT: STRIP-6 owes ZERO hazard-registry edits.** The charter's presumption that map rows exist to sweep is corrected: they reference only what stays.

**premortem** (CONFIRMED): predicates are DERIVED from repo artifacts by design (premortem.mjs header), and none is map-named — `grep -iE 'townmap|carto|landing-maps|panorama'` over `scripts/premortem.mjs` = 0; `grep -ciE 'map|carto'` over `scripts/premortem-retro.json` = **0 lines** (whole file); `grep -ciE 'townmap|carto|landing-maps'` over `scripts/.premortem-firings.jsonl` = **0**. `validate:premortem`'s self-check arms (artifact-exists, population-non-empty, must-fire) re-derive from live artifacts, so the strips cannot stale it by name. **VERDICT: zero premortem edits owed.**

## C. DOCS/SAMPLES + E2E

**docs/samples** (denominator: `git ls-tree eba286607 docs/samples/` = exactly 3 subdirs):
- **GO:** `docs/samples/atlas/` (6 files: README + 5 lens SVGs) — guarded by `tests/design/atlasSamples.test.js` (existence + byte-identity, :28-29), which dies in the same act. **GO:** `docs/samples/town-map-v2/` (9 SVGs) — no test reads these files (`git grep -rn 'town-map-v2' -- tests/ scripts/ src/` hits only `tests/property/townMapV2Golden.test.js:25,74`, which reads `tests/fixtures/town-map-v2-golden.json`, a DIFFERENT artifact belonging to STRIP-4's test set — do not confuse the two).
- **STAYS:** `docs/samples/organic-craft/` — its `cartouche-*.svg`/`compass-rose*.svg` are ornament names that hit any 'carto'/'compass' grep. Word-trap; not map.

**e2e** (denominator: 9 spec files, `git grep -niE 'map|carto|panorama|fog' eba286607 -- e2e/`, every hit classified): **ZERO settlement-map-surface references.** The hits are (a) the tier NAME 'Cartographer' (flow-d:35,37,41; flow-e:49,55 — the tier survives per Q8/§726 and its NAME is permanent vocabulary), (b) JS `.map()`/`stashMap` word-matches, (c) `regional-causality.spec.js` = the WORLD map (`page.goto('/map')` :270,:326 — different surface, STAYS). CONFIRMED at this tip, consistent with the STRIP-1/2 receipts: **e2e does not reach the town-map surface; STRIP-6 owes e2e zero edits.** (`flow-d-export.spec.js` is the canonical client-side PDF journey — a STRIP-2 exposure, §G5, not a STRIP-6 one.)

## D. DEAD-CODE SWEEP CANDIDATES (residue of STRIPs 1–3 at the tip, plus the rows that ripen when 2/4/5 land)

- **D1 — the `mapSubTabs` orphan pair (sweepable NOW):** `src/lib/mapSubTabs.js` (TC-0, the Map tab sub-tab vocabulary) + `src/lib/lastMapView.js` + `tests/lib/mapSubTabs.test.js`. Importer census (CONFIRMED): `TOWN_MAP_VIEW_IDS` and `mapSubTabs` resolve to exactly those three files and nothing else; their Map-tab consumer died in STRIP-1, and `displayPrefsSlice.js:16-19` already records both pref keys retired (⚰ TE-STRIP-3, Q-S1). Test deletion cost: remove-only `test:ratchet` + the lighting census (§G2).
- **D2 — `src/components/townMap/edgeAnnotations.js` — a sweep row that is BLOCKED, not free:** the sole survivor of STRIP-1's 56-file delete, restored DELIBERATELY (J-STRIP1-E, commit `08fd4f921`): it carries the `{"neighbourNetwork on settlement": 2}` row in `scripts/.observed-shape-readers-baseline.json`, deleting it reds all four observedShapeReaders arms (the commit's arithmetic: missing 1 · stale 1 · banked 60→58 · cohort −1/−1/−2), and the baseline's ONLY lawful write path is **DEAD at the slot, pre-existing at 73f5dfc02** — both provenance digests stale, `check-observed-shape-readers.mjs --write` refuses ("an ordinary gate/write cannot migrate the instrument"), hand-edits throw on the rowTags digest. **Prerequisite: an observed-shape instrument migration** (the `migrate-observed-shape-readers.mjs` families are all RETIRED rungs — a new rung or digest re-freeze is chair/owner work, hazard class 12's machinery). Same migration should clear the baseline's ~60 stale content-address rows for the DELETED `src/components/townMap/**` files it still lists (manifest section, e.g. `MapTabShell.jsx` at baseline :6418). Note: `check:observed-shape-readers` is not in the `check` chain; enforcement is the class-12 test set.
- **D3 — `src/lib/townScene/townCartographyBlock.js` + `tests/lib/townCartographyBlock.test.js` (sweepable NOW):** importer census = the test only (:20). The TC-5b-i manifest seam whose UI consumer (`useTownCartographyBlock`) died in STRIP-1; NOT on ARM B's retained townScene→cartographySynthesis path.
- **D4 — `applyMapEdit`/`setMapEdits` (after STRIP-2, owner-gated):** `operationRegistry.js:312` row + `settlementSlice.js:1933-1936` verbs; sole UI caller is `StyleOverhaulPanel.jsx` (:42,:113,:123 — STRIP-2's disposition). If the panel dies, retirement rides `retiredBy` rows (§731.3) — ⚠ **the parked dead-operations list NEVER GROWS un-granted**; Q-S1's grant named three ops and `applyMapEdit` was not among them (it still had this caller). A fresh owner grant or explicit chair ruling is required.
- **D5 — the compendium's map vocabulary (after STRIP-4, SAME act):** `generate-compendium-data.mjs:56-59` imports `TOWN_MAP_STYLE_IDS, resolveTownMapStyle, FURNITURE_KINDS, HAZARD_GLYPHS, ANCHOR_GLYPHS, CONTRAST_LEVELS` from `src/design/townMapStyles.js`, and the generated, **user-visible** artifact still carries it (`compendiumData.generated.js:3` source list; :174 the "Apply a map edit" row). When STRIP-4 deletes the registry: trim the import AND regenerate (`gen:compendium-data`) in the same act — until then the live compendium documents map vocabulary, a website trace no other wave owns.
- **D6 — `townCartographyEnabled` virtual flag (after STRIP-4/5):** `simulationRules.js:765-783`; embedded verbatim in `aiCharterBundle.js:10667-10685`. Retiring it moves the edge bundles → `build:edge-shared` rebuild + the edgeFunctions freshness tests in the same act.
- **D7 — `customContentUsage.js:607`** `path.includes('townMap')` live branch (+ :238 comment) — goes dead post-STRIP-4; trim then.
- **D8 — comment tombstones (tolerate, or trim opportunistically):** `src/copy/landing.js:141-143` (deliberately RECORDS the STRIP-1 removal — keep), `tests/ui/homeLanding.test.jsx:217`, `src/components/organic/Rule.jsx:23`, `src/pdf/primitives/HouseDeviceSeal.jsx:5` (STRIP-2 will stale it further), `tests/components/aboutSplit.test.jsx:561`, `ARCHITECTURE.md` (1 line). **KEEP the six `src/domain/undercity/*` "never imports townMap" comments** — they are closure ASSERTIONS (§441.5(d)), not residue.
- **D9 — pricing copy (with STRIP-5, not before):** `src/copy/pricingPage.js:130-140` live rows `'map-view': 'The town map'`, `'all-lenses': 'Map lenses'`, `'panorama'`, `'map-editing'`, `'dm-pins'`, `'change-view'`, `'fog-table'`, `'v2-redraw'` — the website's pricing table still speaks these; they die with STRIP-5's ladder rows (`'interiors'` and the tier name survive). The terminal census must NOT allowlist them.
- **NOT in scope:** `src/domain/townMap/arch/shapeRegistry.js` (zero importers anywhere, per R-STRIP4 §C) — arch kernel, separate decision per §748.3.

## E. THE TERMINAL CENSUS — DIRECTORY ALLOWLIST (DRAFT; §11.4 law: never an exact word-set — the WEAVE program adds realm-surface map-word code afterwards BY DESIGN, and the realm/world map STAYS)

Current denominator (per-directory census of `git grep -lIiE 'townmap|towncartograph' eba286607 -- .`): tests/domain 79 · packets/town-cartography 43 · townMap/arch 26 · townMap 23 · tests/property 22 · docs 20 · tests/lint 18 · scripts 16 · tests/architecture 15 · townScene 14 · townCartography 14 · townMap/fabric 12 · … down the tail quoted in the receipts above. Post-STRIP-2/4/5/6, settlement-map vocabulary may legitimately survive ONLY inside:

1. `src/domain/townMap/**` — the retained headless substrate (J-STRIP-1: model+layout+readers; R-STRIP4 §A's 14) **plus `arch/**`** (36 dark kernel files — disposition is a separate decision, §748.3).
2. `src/domain/townCartography/**` — ARM B's 11 scene-substrate files (§748.3 chair ruling).
3. `src/domain/townScene/**` + `src/lib/townScene/**` — Q6′ stays (minus D3's orphan).
4. `src/domain/interior/**` + `src/components/interior/**` — substrate readers (⚠ `InteriorView.jsx:33` must be re-homed off `townMapStyles` first, §G3).
5. `src/lib/spatialSubstrateDerive.js` — the one canonize seam.
6. `src/domain/worldPulse/**` — kernel readers (roadsKernel:77, traditionsKernel:69, urbanFabricKernel; simulationRules until D6 lands).
7. The realm/world surface (different surface, STAYS): `src/components/map/**`, `src/store/mapSlice.js`, `src/domain/realmMap/**`, `public/map/**`, `src/lib/{mapBridge,mapRuntimeConfig,mapThumb,regionalMapOverlay,computeMapChains,mapLayerAnalytics,realmMapExport}.js` (realmMapExport minus its town half, per STRIP-2), `e2e/regional-causality.spec.js`.
8. `public/landing-maps/` restricted to `realm-preview.*` (6) + `k*-exhibit/**` (64, pinned by `archViewWall.test.js:171`).
9. `scripts/`: `generate-k*.mjs` ×6, `validate-map-fork.mjs`, `generate-realm-preview.mjs`, `audit/town-scene-local-matrix.mjs`, and the governed baselines under `scripts/.…` + `scripts/lib/` (they speak whatever the tree speaks).
10. `tests/`: the retained-surface set (R-STRIP4 §F's 36 + world-map/security/scene suites) + `tests/fixtures/townMapFixtures.js` (shared with the town-scene audit — RETAINED).
11. `supabase/functions/_shared/*Bundle*` + `supabase/functions/style-overhaul/**` — **only until the §G3 edge re-rule lands**; the terminal run must re-derive this row against that ruling.
12. `docs/**` — program history (ledger law; `docs/implementation/packets/town-cartography`'s 43 files are landed-packet HISTORY per §731.3). `docs/samples/atlas` + `docs/samples/town-map-v2` must be GONE.
13. `supabase/migrations/**` — append-only history (`burg_settlement_map` is WORLD-map, §11.4).
14. `src/store/settlementSlice.js` + `src/store/operationRegistry.js` — retained mapEdits verbs, pending D4's owner grant.
15. The tier name **'Cartographer' is allowlisted EVERYWHERE** (Q8: the tier survives; e2e, pricing, config and copy speak it by design).

DRAFT incantation (run at the terminal tip; two halves, both required):

```
# HALF 1 — no settlement-map vocabulary outside the allowlist (word list is the
# API vocabulary, deliberately NOT the bare word "map"):
git grep -nIiE '(townmap|towncartograph|town-map|buildtownmap|townpanorama|settlementmap|mapedits)' <tip> -- \
  src scripts tests e2e api public supabase/functions package.json \
  ':(exclude)src/domain/townMap' ':(exclude)src/domain/townCartography' \
  ':(exclude)src/domain/townScene' ':(exclude)src/lib/townScene' \
  ':(exclude)src/domain/interior' ':(exclude)src/components/interior' \
  ':(exclude)src/domain/worldPulse' ':(exclude)src/lib/spatialSubstrateDerive.js' \
  ':(exclude)src/components/map' ':(exclude)src/domain/realmMap' ':(exclude)public/map' \
  ':(exclude)public/landing-maps' ':(exclude)scripts/generate-k*.mjs' \
  ':(exclude)scripts/validate-map-fork.mjs' ':(exclude)scripts/generate-realm-preview.mjs' \
  ':(exclude)scripts/audit/town-scene-local-matrix.mjs' ':(exclude)scripts/.*' ':(exclude)scripts/lib' \
  ':(exclude)tests' ':(exclude)e2e/regional-causality.spec.js' \
  ':(exclude)src/store/settlementSlice.js' ':(exclude)src/store/operationRegistry.js' \
  ':(exclude)src/lib/realmMapExport.js'
# → every surviving hit is adjudicated by hand against rows 1-15; tests/ are
#   excluded above because their roster is governed by test:ratchet + the R-STRIP4
#   §F retained list, not by this grep.
# HALF 2 — the allowlist is not vacuous: every row 1-15 directory/file still
# EXISTS at the tip (a directory allowlist that outlives its directory proves
# nothing). git ls-tree <tip> each row; zero misses.
```

⚠ DRAFT status is deliberate: the final roster is re-derived at terminal dispatch AFTER STRIP-2/4/5 land (their re-homes move exact filenames — §G7), and the WEAVE program may have added realm-surface members by then. The allowlist SHAPE is the law; the member list is re-proved, never copied.

## F. ORDERING — what each row waits on

| Row | Waits on | Why |
|---|---|---|
| A (4 scripts + package.json row) + C docs/samples + atlasSamples.test | Nothing technically; **coordinate with STRIP-2**, and land **before or with STRIP-4** | Post-STRIP-4 the scripts hold broken imports inside the linted set (`lint: eslint src/ tests/ scripts/`); test deletions collide with TE-STRIP-2's chartered lighting re-freeze (§G2); the package.json byte rides ONE mint (§G1) |
| D1, D3 (orphan pairs) | Nothing | Sweepable now; test-removal census costs re-derived at own tip |
| D2 (edgeAnnotations) | The observed-shape instrument MIGRATION (chair/owner) | Write path dead pre-existing; not a strip dependency at all |
| D4 (applyMapEdit) | STRIP-2's panel ruling + a fresh OWNER grant | Dead-op list never grows un-granted |
| D5 (compendium trim+regen) | STRIP-4 | Same-act with the registry deletion |
| D6 (virtual flag) | STRIP-4/5 + edge-bundle rebuild | Bundle freshness tests move |
| D7, D8 | STRIP-4 (D7); anytime (D8) | — |
| D9 (pricing copy) | STRIP-5, same act | Live paid-surface copy |
| B (hazard/premortem) | — | ZERO edits owed; nothing to schedule |
| E (terminal census) | LAST — after STRIP-2, 4, 5 and every row above | It is the guard; also run `validate:packets` + full gate there (packet requiredSymbols pin symbols per §731.3 — TE-STRIP-2's 12 figure-pin edits are the current movement) |

## G. STRIP-2-DELTA — every row of mine TE-STRIP-2's charter could move (it lands on this same tip concurrently)

1. **package.json mint (§A):** my one-row deletion vs their export-libs/PDF dependency strip — same file, one mint if coordinated, two if not.
2. **Census collision:** their charter carries the lighting-census re-freeze; my test deletions (atlasSamples, mapSubTabs.test, townCartographyBlock.test) move `test:ratchet` + the same lighting walker. Land mine AFTER theirs and re-derive every count at my own committed tip (the re-stage/blind-diff law).
3. **⚠⚠ THE UN-CHARTERED SERVER HALF (biggest delta, and a charter correction):** their StyleOverhaulPanel disposition, as chartered, names the panel and four re-homes (`downloadBlob`, `drawListToSvg`, `SHADOW_DIR`, `coerceStyleId`). It does NOT name: `supabase/functions/style-overhaul/styleOverhaulCore.ts` (the panel's EDGE half); `src/lib/surveyorWrite.js:165` `await import('../design/townMapStyleWall.js')` (`buildStyleVocabulary` — a live PAID AI surface); the edge bundles EMBEDDING the registries (`aiCharterBundle.js:12120` townMapExportPalette, `:12152` townMapStyles + `resolveTownMapStyle` :12476, `:12828` townMapStyleWall, `:1084` `townMap.glyphAssign`; mirrored in `aiOutputSchemaBundle.js` + both `.meta.json`); and two further `townMapStyles` importers the chartered `coerceStyleId` re-home does NOT cover — `src/components/interior/InteriorView.jsx:33` (`DEFAULT_STYLE_ID`, retained surface) and `generate-compendium-data.mjs:56-59` (§D5). **Consequence: STRIP-4 cannot delete `townMapStyles`/`townMapStyleWall` until the surveyor style-overhaul task is ruled and the edge bundles are re-built — a ruling no wave currently owns.** Flagged to the chair.
4. **PDF variants:** `src/pdf/variants.js` `townMapPlate:` flags ×4 (:50,:88,:121,:160) + `HouseDeviceSeal.jsx:5` — their PDF strip's surface; my allowlist row 7 and D8 re-derive after.
5. **`e2e/flow-d-export.spec.js`** (the canonical PDF download journey via `generateSettlementPDF`): their plate strip can move its variant expectations; my §C e2e verdict ("zero settlement-map references") is about the MAP SURFACE and survives either way.
6. **Figure-pin packet edits:** their 12 packet edits touch the same governed packet surface my terminal row validates (`validate:packets`).
7. **Re-home renames:** `downloadBlob`/`drawListToSvg` re-homes change the import shapes in `realmMapExport.js`/`realmPlateRenderer.js` that my §E rows 7-9 cite — re-derive receipts at terminal, per the DRAFT law.

---

*Written by the R-STRIP6 recon lane, 2026-08-29(30). Read-only: no gate run, no build, no file touched but this one. Scratch charter copy used: the session scratchpad's DESIGN_MAP_MODULE_SPLIT.md; authoritative copies on the ledger branch.*
