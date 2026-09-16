# AUDIT — Town-Map Site Coherence & Reader-Walker Banking
**Repo** `/Users/cstokes/Desktop/settlement-engine/.claude/worktrees/minifold` · **branch** `claude/composite-r4` · **HEAD** `2c1ec70f` · **date** 2026-08-07
**Trigger** TCD-4 (`2c1ec70f`) routed `townLayoutV2.js` through `canonExports()`, so `economicState.primaryExports` reaches `siteGenesis.generateSite()` for the first time in production.
**Severity key** `H` = ships wrong world state or wrong persisted state · `M` = ships wrong user-visible output, or a guard/gate that cannot fail · `C` = stale machinery documentation.
**Method** five independent lenses (predicates · corpus · law · blast · walker), each adversarially refuted before landing here. No repo file was written; no state-mutating git command was run; no vitest run. All probes live under `/tmp/sca-probes/`.

---

## What is solid (verified — keep it this way)

| # | Verified fact | Anchor / receipt |
|---|---|---|
| S1 | `canonExports` / `canonExportsPresent` is the **single** enumeration point for the `primaryExports` / `exports` alias pair, and it correctly keeps "absent" and "authored empty" apart. | `src/domain/canonicalAccessors.js:54-78` (read in full) |
| S2 | None of the 17 site/asymmetry regexes carries `/g`, so there is no `lastIndex` statefulness across `.test()` calls. | source read, all 17 |
| S3 | `exports.join(' ')` at `siteGenesis.js:239` cannot throw — the `waterEconomy &&` short-circuit precedes it. Driven with `null`, `undefined`, a bare string, and `[{}, 'Peat fuel']`. | executed |
| S4 | The inline biome regexes at `:230/:238/:239/:247` lack `/i` but `biome` is lowercased at `:208`, so they are correct today (latent only if that lowercasing moves). | `siteGenesis.js:208` |
| S5 | The town map is **view-time projected** at 19 of 20 `buildTownMapModel` call sites (PDF, thumbnail, export, panes, interior footprint, scene worker). Exactly one persists — see H4. | call-site census |
| S6 | `mapEdits.pins` are anchor-keyed and survive a geometry shift; dangling pins drop gracefully. | `townLayoutV2.js:836-842`, `mapEdits.js:26` |
| S7 | The town-scene manifest is compiled per-view in `src/workers/townScene.worker.js` and is never persisted. | source read |
| S8 | Size ratchets have ample headroom and **none** of the touched files appears in `scripts/.size-baseline.json` (`siteGenesis.js` 205 effective lines vs an 800 ceiling; `townLayoutV2.js` 472; `asymmetrySources.js` 133). | `grep -n` over `.size-baseline.json` returned no rows |
| S9 | `fishing_grounds` is correctly terrain-gated (`terrainRequired: ['coastal']`) and *is* refused on desert — the machinery for M4/M5 already exists and already works. | `resourceData.js:22`; probe `lens3_resources.mjs` |
| S10 | The frozen walker baseline **is** the pre-TCD-4 tree: a materialized `94962c17` scan reproduced `scanStats {files 2057, reads 119754, resolved 12433, unresolved 107321}` byte-identically. | executed, integrity-counted `git archive` (6194 in / 6194 out) |
| S11 | HEAD `2c1ec70f` is **green** on the walker (`violations 0 stale 0 bankable 1`). The red on the live tree is foreign-lane work (M15). | executed, materialized-tree scan |
| S12 | The TCD-3 pin block drives the **live** spelling and does pin STAGE-0 water/landform and STAGE-1 resource causes, with a real anchored negative. The estate is not blind here — the **goldens** are (M8). | `tests/domain/townLayoutV2.test.js:220-270` |
| S13 | The probe replication of `townLayoutV2.js:256-283,320` matched the real `buildTownLayoutV2` `frame.water` byte-for-byte on **462/462** and `frame.landform.kind` on **462/462**. Generation is deterministic: an identical re-run reproduced 462/462 and the same 158-string vocabulary. | executed |
| S14 | `steadingTopography.js`'s `LANDFORM_*` tables are a separate steading-placement vocabulary with no relationship to `TownLandform`. Grep hits there are false positives. | source read |
| S15 | `seasonal-overlay-golden.json` is a spatial-digest golden with no town-map input. | source read |

---

## Measured baselines (every wave is graded against these)

**Corpus** 462 pipeline settlements, 0 generation errors = (6 settTypes × 7 `terrainOverride` × 5 seeds @ `tradeRouteAccess:'road'`) + (6 × 7 × 6 route values × 1 seed); culture rotated over all 11 `CULTURE_PROFILES` keys. Distinct export vocabulary = **158** strings; list length min 0 / max 21 / mean 10.4; **30/462** carry an empty list (TCD-4 is a no-op for those).

| Metric | Pre-TCD-4 | Post-TCD-4 (today) |
|---|---|---|
| siteKind `plain` / `river` / `mountain-flank` / `coast` / `marsh` / `dunes` | 108 / 90 / 108 / 102 / **0** / 54 | 44 / 129 / 115 / 102 / **41** / 31 |
| kind changed by the fix | — | **122/462 (26.4%)** |
| `hasWater` changed | — | 80/462 (17.3%) |
| water-on-dry-terrain | — | **80/462** |
| ├─ of which marsh-on-dry | — | 33/462 |
| └─ of which *purely* false-positive (every water-firing token is an FP) | — | **47/462** |
| mountain-flank-on-flat (plains/desert/riverside/coastal) | — | **23/462** (34 if forest counts) |
| dunes-on-non-dry | — | 0/462 |
| any contradiction | — | **103/462 (22.3%)** |

Separately, over a 1008-settlement corpus: **347/1008 (34.4%)** ship at least one semantically nonsense resource-provenance string to the player; **27/1008 (2.7%)** have a legitimate mine/ore site suppressed by a collision.

---

## H — High

### H1 — `WATER_ECONOMY_RE` draws rivers across dry-terrain settlements; 47/462 are purely false-positive
**Anchor** `src/domain/townMap/siteGenesis.js:48` — `/fish|preserved|reed|peat|pearl|whal|ferry|barge|timber|lumber|mill/i`
**Claim** Of the 16 distinct corpus strings this matches, **7 are false positives**: `Preserved foods` (n=54), `Milled flour` (35), `Milled timber` (16), `Hewn timber` (3), `Shipbuilding timber` (2), `Milled lumber` (1), `Preserved foods (transit)` (1). Decisive-token table: `/preserved/` matches 55 settlements, is the *only* matching alternative in 37, decisive-on-dry in 20; `/mill/` matches 48, decisive 15, decisive-on-dry 12; `/timber/` matches 21, decisive 3, decisive-on-dry 1. `Milled flour` is authored by **both** `river_mills` (terrainRequired `['riverside']`, `resourceData.js:64`) and universal `grain_fields` (`:153`) — the predicate cannot tell a water mill from a windmill (`institutionalCatalog.js:535` states a mill is "Water or windmill"; `resourceChains.js:280` lists `['Windmill','Horse mill']`).
**Failure** `{settType:'hamlet', terrainOverride:'forest', tradeRouteAccess:'road'}`, seed `lens2-A-hamlet-forest-*` → settlement *Hartplatz*, `primaryExports` contains `Milled flour` → `/mill/` fires → `kind='river'`, a river path drawn across a forest town with a road route and no watercourse in its dossier. Pre-fix kind was `plain`. Same shape on desert: *Altanovum* carries `Preserved foods` → `dunes` flips to `river` — a river on a desert thorp.
**Evidence** CONFIRMED-executed over 462 settlements. The 47 FP-only cases: terrain forest 14 / desert 11 / mountain 9 / plains 8 / hills 5; resulting kind `river`×47; decisive strings `Preserved foods` 28, `Milled flour` 21, `Milled timber` 6, `Hewn timber` 2; pre-fix kinds `plain` 22, `mountain-flank` 14, `dunes` 11.

### H2 — `/coal/` matches `Charcoal`, and lowland coal is treated as mountain; the single largest decisive mountain token
**Anchor** `src/domain/townMap/siteGenesis.js:247` — `/ore|iron|stone|mine|silver|gold|coal/i` (the same alternative also lives at `asymmetrySources.js:70` — two homes, one token)
**Claim** `/coal/` matches `Coal` (n=68) and `Charcoal` (n=19). Charcoal is burnt from wood — resource `managed_forest`, `resourceData.js:118`, `tradeGoods ['Milled timber','Charcoal','Hardwood beams']` — with no orographic implication whatever. `Coal` itself is emitted on all seven terrains (plains 17 / hills 13 / riverside 12 / forest 9 / mountain 8 / desert 6 / coastal 3) from `coal_deposits`, whose own label is *"Coal or Peat Deposits — surface-accessible fuel"* (`resourceData.js:218-230`), i.e. explicitly **not** a mountain landform. `/coal/` matches 87 settlements, is decisive in 68, and is decisively responsible for 16 mountain-flanks on a non-mountain biome.
**Failure** `{settType:'thorp', terrainOverride:'plains', tradeRouteAccess:'road'}`, seed `lens2-A-thorp-plains-*` → *Cerrofundus*, `nearbyResources` includes `coal_deposits`, exports include `Coal` → `kind='mountain-flank'`, `generateLandform` draws a ridge crest plus four rows of downslope hachures across a plains thorp. Pre-fix `plain`. Independently: `generateSite({terrain:'forest', realmBiome:'forest', exports:['Charcoal']})` → `mountain-flank` where the export-less control returns `plain`.
**Evidence** CONFIRMED-executed by two lenses independently (predicates + corpus; merged here). mountain-flank-on-flat = 23/462 (plains 16, desert 7; town 6, thorp 5, hamlet 5, city 4, metropolis 2, village 1). Causing strings: `Coal` 15, `Iron ore` 6, `Quarried stone` 2, `Cut gemstones` 2, `Raw gemstones` 1, `Refined iron ingots` 1 — **15/23 caused only by strings classed false-positive**. Counting forest too: 34/462, of which forest 11. `Charcoal`'s own damage is currently *latent, not zero*: where it is the sole mountain match (10 settlements) the water branch shadows it in 8.

### H3 — The substance predicates are unanchored substrings over a 910-name goods catalog; a majority of catalog-level mountain hits are semantic accidents
**Anchor** `src/domain/townMap/siteGenesis.js:48,247`
**Claim** Run over **every** good/service name reachable from `src/data/tradeGoodsData.js` (910 names): the mountain predicate matches 11 names of which only 4 are mining (`Cut stone`, `Iron refining`, `Raw ore extraction`, `Refined iron ingots`). The other 7 are substring accidents — `Charcoal`, `Charcoal supply`, `Foreign merchants` (f-**ORE**-ign), `Laborer hire` (lab-**ORE**-r), `Monster lore` (l-**ORE**), `Weather forecasting` (f-**ORE**-casting), `Millstone cutting`. `WATER_ECONOMY_RE` matches 20 names of which 10 imply no water (six `/mill/` hits, `Timber`, `Sawing timber`, `Preserved foods`). **Neither predicate uses word boundaries.** This is the class statement behind H1, H2, M1 and M2: the defect is not eight bad tokens, it is that a semantic classification is being done by unanchored substring match against a vocabulary nobody enumerated.
**Failure** `exports:['Foreign merchants']` on a plains town → `kind='mountain-flank'`, provenance *"the mountain flank (mining terrain)"*. The customContent path (`customTradeEndpointIntegration.js` pushes arbitrary user strings into `primaryExports`) arms every latent fragment on plausible input: "Wholesale goods" (`/ale/`), "Shop fittings" (`/hop/`), "Storehouse surplus" (`/ore/`).
**Evidence** CONFIRMED-executed (`lens3_corpus_regex.mjs` over 910 harvested names; `lens3_direct.mjs` confirms all four `/ore/`-accident strings and both coal strings return `mountain-flank` on plains/forest). Live token attribution over 126 settlements: water put on the map by `preserved` 16, `reed` 20, `peat` 14, `mill` 10, `timber` 9, `fish` 31; mountain-flank made by `coal` 12, `iron` 10, `mine` 7, `ore` 6, `stone` 1. **Scope honesty:** the four `/ore/`-accident names are `institutionServices.js` entries and did **not** appear in `primaryExports` across any sampled corpus — latent path, not an observed one (see *Deferred*).

### H4 — The persisted spatial substrate cannot see a site change; its reuse gate reuses a stale record verbatim
**Anchor** `src/lib/spatialSubstrateDerive.js:60` (`substrateSignatureOf`) and `:84` (the reuse short-circuit)
**Claim** One projection of the town map **is** written into `worldState` and persisted: `campaign.worldState.spatialLedgers.spatialSubstrate`, minted at canonize in `src/store/campaignWorldPulseDeferred.js:271-333`. `deriveSpatialSubstrate` reads district centroids, adjacency and wall sectors (`src/domain/spatial/spatialSubstrate.js:139-181`) — all of which move when the site moves. The rebuild gate hashes `SUBSTRATE_VERSION:layoutLawVersion:layoutVariant:_seed:tier:walls:quarterCount:hash32(institution names+status)` — **no export list, no siteKind, no terrain**. A changed site derivation therefore produces an identical signature and the stale record is reused. **This is already live from 2c1ec70f**, not only from the next change.
**Failure** A campaign canonized with `spatialConsequenceEnabled`. On the next canonize the prior record is reused, and `spatialConsequenceKernel`'s fire diffusion (`spatialSubstrateRead.js:156,202`) and `deploymentReturn`'s siege breach (`:252`) run against district centroids up to **354 view-units** away from the ones the player is looking at. The fire burns the quarter that is no longer there.
**Evidence** CONFIRMED-executed (`lens4-substrate.mjs`, seed `SUB-1`, town/hills/road): `sigA = 1:2:0:SUB-1:town:w1:q4:ieayv3`, `sigB = 1:2:0:SUB-1:town:w1:q4:ieayv3`, `SIGNATURES EQUAL? true`; `siteKind A/B = river / mountain-flank`; `substrate d[] EQUAL? false`; `districts moved: 4 of 4` incl. `{"id":"district.noxious_trades_quarter","dx":-354,"dy":-130}`; `adj EQUAL? false`; `walls EQUAL? false`; `REUSE GATE: re-derived? NO (stale subA reused)`. `tests/domain/spatialSubstrate.test.js:152-164` pins the signature only for roster and v1→v2 changes.

---

## M — Medium

### M1 — `/tin/` in the mine rule matches `casTINg`, `hunTINg`, `enchanTINg`, `minTINg`
**Anchor** `src/domain/townMap/asymmetrySources.js:70`
**Claim** The bare alternative `tin` is unanchored and matches four high-frequency non-mineral exports. `EXPORT_RULES.find` (`:113`) returns the **first** match and the mine rule sits at index 2, so it fires before the reagent rule at index 7. `Arcane services (identification, enchanting)` *does* match `/arcane/` but never reaches it. `Spellcasting`, `Hunting trophies` and `Coin minting` match no other rule at all — the collision does not merely misroute, it **invents an industrial mine site that should not exist**. The cause string reaches user-visible provenance at `townLayoutV2.js:624` (`sourceRef: srcA.cause`).
**Failure** `exports:['Spellcasting (1st-3rd level)','Iron ore']` → the `seenTargets` dedupe at `:115` lets the bogus string claim `industrial+edge` first, so the **real** iron-ore mine is suppressed entirely and the site bearing moves from `(244,244)` to `(500,140)` — a 276px shift in a 1000-unit view. Reversing the list order restores the correct site: the defect is export-order dependent.
**Evidence** CONFIRMED-executed over 1008 settlements. 347/1008 (34.4%) ship at least one nonsense provenance string; 27/1008 (2.7%) have a real mine suppressed. Shipped strings: `mine (Spellcasting (1st-3rd level) export)` **139**, `mine (Hunting trophies export)` **69**, `mine (Arcane services (identification, enchanting) export)` **37**, `mine (Coin minting export)` **16**.

### M2 — `/fur/` in the tannery rule matches `sulFUR` — 84 occurrences sited as a downstream tannery
**Anchor** `src/domain/townMap/asymmetrySources.js:68` — `/leather|hide|tann|fur|pelt/i`
**Claim** The tannery rule is index 0, so it wins over every later rule unconditionally. `Sulfur` is a mineral. `hide` is a second latent instance of the same shape (`hidden`, `hideaway`), unfired in the stock corpus.
**Failure** `cause='tannery (Sulfur export)'`, hint `downstream`, placing a leather-works attractor at `waterAnchor+(90,60)` and pulling the industrial quarter there; the string is rendered to the player via `townLayoutV2.js:624`.
**Evidence** CONFIRMED-executed. Tannery hits: `Furs and pelts` 100 (legitimate), **`Sulfur` 84 (spurious)**, `Leather goods` 39, `Camel leather` 27, + 2 taxed variants. `tannery (Sulfur export)` shipped 84× across 1008 settlements.

### M3 — The cause string embeds raw export text, then a downstream predicate re-parses it; `/trade/` and `/market/` silently suppress lawful reconciliation
**Anchor** `src/domain/townMap/siteGenesis.js:386` (consumer) · `asymmetrySources.js:119` (producer)
**Claim** `:119` composes `` cause: `${rule.label} (${ex} export)` `` — a prose composite carrying **unsanitized** export text. `:386` then pattern-matches that composite with `/waterfront|harbou?r|trade|market|quay/` to decide whether a lawful fortify town holds doctrine. Any export whose *name* contains `trade` or `market`, or any rule whose *label* contains them (`market-farms`, `:74`), flips a non-trade attractor into the trade class. Second-order collision on a string the code itself built.
**Failure** `reconciliationDisplacement` with a lawful fortify town (drift 0.2) and nearest latent advantage `reagent-works (Alchemical trade (potions, reagents) export)` returns `dx=0, effect='reconcile-hold'`. The identical rule with export name `Medicinal herbs` returns `dx=14, effect='reconcile-planned'`. An alchemy town's arcane quarter freezes purely because its export name contains the word "trade". `market-farms (Grain surplus export)` holds for the same reason via its own label.
**Evidence** CONFIRMED-executed (`lens1-recon.mjs`). Corpus: `Alchemical trade (potions, reagents)` = 170 occurrences.

### M4 — `marshlands` carries no `terrainRequired`; reed/peat exports are minted on desert and mountain
**Anchor** `src/data/resourceData.js:271-280`
**Claim** All 23 `Peat fuel` carriers and all 46 reed/peat carriers trace to `marshlands` (0 from `coal_deposits`). `marshlands` has neither a `terrainRequired` key (unlike `fishing_grounds`, `:22`) nor the sibling `terrain:` gate (unlike `oasis_water`, `hot_springs_mineral`). It was rolled onto 80/462 settlements including desert 9 and mountain 7. `siteGenesis.js:239` then upgrades those to `kind='marsh'`. **This is an upstream defect** — the regex is arguably right about reeds; the corpus is wrong to emit them in a desert.
**Failure** `{settType:'thorp', terrainOverride:'desert', tradeRouteAccess:'road'}`, seed `lens2-A-thorp-desert-*` → *Aristoikon*, exports contain `Reeds and thatch` and `Peat fuel` → `kind='marsh'`, `hasWater=true`, 34 wet-ground stipples and 13 reed tufts across a desert thorp. Pre-fix `dunes`.
**Evidence** CONFIRMED-executed. marsh-on-dry-terrain = 33/462 (hills 9, plains 8, forest 7, desert 5, mountain 4). Causing strings `Reeds and thatch` 32, `Peat fuel` 15. **0/33 involve any string classed a regex false positive.** `Reeds and thatch` and `Peat fuel` each appear on all 7 terrains. Pre-fix the corpus contained **zero** marsh sites; post-fix 41.

### M5 — `getCompatibleResources` falls through to universal for any entry lacking both terrain keys, so the dossier itself claims reeds in a desert
**Anchor** `src/domain/resourceTerrainCompatibility.js:102-106`
**Claim** The fallthrough (`// Universal resource: use route-based compatibility`) catches both `marshlands` and `coal_deposits` (`resourceData.js:218-230`), neither of which carries `terrain` or `terrainRequired`. On a road settlement they are legal on **every** terrain. For a large share of the flagged cases `siteGenesis` is a *faithful* projection of an already-incoherent dossier.
**Failure** `getCompatibleResources('road','desert')` returns `marshlands.compatible=true` and `coal_deposits.compatible=true`, while `fishing_grounds.compatible=false`. Any fix confined to `siteGenesis` leaves the dossier still asserting peat and waterfowl as a desert town's primary exports — which the PDF, the journal pages and the economics tab all print.
**Evidence** CONFIRMED-executed (`lens3_resources.mjs`, `lens3_res2.mjs`). Incoherent placements over 126 settlements (marshlands / coal): plains 0/18, 4/18 · forest 4/18, 6/18 · hills 5/18, 3/18 · mountain 3/18, 2/18 · desert 4/18, 1/18 · riverside 3/18, 3/18 · coastal 3/18, 2/18.

### M6 — Four water tokens, two mountain tokens, and the entire `/salt/` dunes leg are inert against the real corpus
**Anchor** `src/domain/townMap/siteGenesis.js:48,247,250`
**Claim** Against all 158 distinct strings the generator produces: `/pearl/`, `/whal/`, `/ferry/`, `/barge/` match **zero**; `/lumber/` matches only `Milled lumber` (n=1) which `/mill/` already catches; the mountain predicate's `/silver/` and `/gold/` match **zero**. The dunes leg at `:250` never decides anything — 0/462 settlements have `kind='dunes'` on a non-dry biome, so all 31 dunes sites come from the `dryBiome` leg and the `/salt/` export leg is 100% shadowed by the branches at `:230/:238/:247`.
**Failure** A regression test authored to pin "a salt-exporting town gets a dune field" passes for the wrong reason on a desert fixture (the `dryBiome` leg supplies the answer) and can never fail if `/salt/` is deleted. Symmetrically, deleting `/pearl|whal|ferry|barge/` and `/silver|gold/` changes **zero** of the 462 generated models — a mutant on those tokens is vacuous.
**Evidence** CONFIRMED-executed. `/salt/` carriers = 123 settlements; their kinds `coast` 51, `river` 33, `mountain-flank` 25, `dunes` 8, `marsh` 6. On a non-dry biome (100 settlements, where `/salt/` would have to be the decider): `coast` 46, `river` 27, `mountain-flank` 23, `marsh` 4, **`dunes` 0**.

### M7 — The realm-coherence pin is anchored on an export list the generator cannot produce, so it stays green while the law is broken in production
**Anchor** `tests/domain/townGenesisPipeline.test.js:43-48`
**Claim** `it('a DRY biome with no water economy invents NO river (realm-coherence)')` drives `exports: ['salt','copper ore']` — **neither string is in the live 158-string corpus**, and it uses the legacy alias besides. The generator's desert settlements carry `Preserved foods`, `Reeds and thatch` and `Peat fuel` instead. The pin asserts the guard's TRUE branch on inputs the pipeline never produces. Its sibling at `:37-41` pins the permissive direction. **There is no pin anywhere in `tests/` asserting that an export may NOT create geography the terrain denies.**
**Failure** Replace the fixture's exports with the live desert list `['Rock salt','Draft camels','Camel leather','Camel wool','Raw wool','Livestock','Transit trade','Toll revenue','Preserved foods']` (seed `lens3-desert-hamlet-0`) and `expect(m.frame.water).toBeNull()` **fails** — `frame.water` is a river path. The pin is not wrong; it is unreachable from production input.
**Evidence** CONFIRMED — source read at `:36-54`; live desert lists captured by `lens3_pipeline_site.mjs`. Grep over `tests/` for `generateSite|siteKind` returns 5 files; none contains a negative coherence assertion.

### M8 — No committed golden can move under an export-predicate change: all 20 v2 golden settlements carry an empty export list
**Anchor** `tests/fixtures/townMapFixtures.js:118-145` (`makeTownFixture` writes only `economicState: { prosperity: 'Modest' }`) and `:245` (the one export-bearing fixture: `s.economicState = { ...s.economicState, exports: ['reed', 'peat'] }` — **legacy spelling, and two strings the generator never emits**)
**Claim** `canonExports(settlement) === []` for **20/20** `V2_GOLDEN_CONFIGS`. `waterEconomy` is therefore false and the export arms of `:239/:247/:250` are dead for the whole corpus — a change to `WATER_ECONOMY_RE`, the mountain predicate or the `/salt/` predicate moves **zero bytes** in `town-map-v2-golden.json`, `illustrated-town-golden.json`, `illustrated-town-season-golden.json`, `town-panorama-golden.json` or `town-panorama-season-golden.json`. `town-map-golden.json`, `town-map-style-golden.json`, `age-overlay-golden.json`, `town-cartography-dormancy-golden.json` and `spatial-consequence-dormancy-golden.json` are driven by **v1** models (`buildTownMapModel(city, null)`) and never reach `generateSite` at all.
**Failure** The remediation lands, every golden stays green, and the team reads that as "no behaviour moved" — while 122/462 real settlements moved. This is the *identical* false-assurance pattern TCD-4 was about.
**Evidence** CONFIRMED-executed (`lens4-fixtures.mjs`, 20/20 printed `exports=[]`). Committed manifests are hash-only summaries: `town-map-v2-golden.json = {bytes:165667, configs:20, hash:0bdbb9e1…, totalDistricts:132}`. The only lever that *can* move them is the biome side: `sm1-8` (town/hills, `water:true` → `tradeRouteAccess 'coastal'`) and `sm1-17` (town/forest, `'coastal'`) both resolve `siteKind='coast'`.

### M9 — A siteKind flip rewrites the whole 3D heightfield, and the two scene readers use **opposite** precedence over the same pair — leaving `woodland` unreachable for every v2 model
**Anchor** `src/domain/townScene/sceneTerrainNetwork.js:130` vs `src/domain/townScene/compileTownSceneManifest.js:282`
**Claim** `buildSceneTerrain` derives `profileId` from `meta.siteKind || meta.terrain || 'plain'`; `compileTownSceneManifest` derives the manifest's `terrain` from `meta.terrain || meta.siteKind || 'plain'`. A v2 model **always** sets `meta.siteKind` (`generateSite` defaults to the truthy string `'plain'`), so `meta.terrain` is never consulted at `:130` on v2 and `/forest|wood/ → 'woodland'` is reachable only by a v1 model. `profileId` drives the whole quantized heightfield (`:141-167`) and landform marks are re-quantized at `:191-217`.
**Failure** A coherence guard flips a hills town `river → mountain-flank`: every cell of the 33×33 heightfield changes, `mapModelDigest` and the town-scene manifest digest move, and the 3D pane / GLB export / worker output all change. Separately, a v2 forest town renders as flat `plain` ground in 3D where v1 rendered `woodland` — covered by no golden, because `townCartographyDormancyGolden.test.js` compiles with `mapEdits:null` (v1 only).
**Evidence** CONFIRMED-executed (`lens4-scene.mjs`): `terrain=forest  v2 siteKind=plain  v2 profileId=plain | v1 meta.terrain=forest  v1 profileId=woodland`; `heightfield cells differing when siteKind mountain-flank → plain: 1085/1089`. `tests/helpers/townCartographyFixture.js:21` `FIXTURE_SITES` lists `'mountain','desert','woodland'` — three strings `generateSite` never emits — and omits `'mountain-flank'` and `'dunes'`, the two it does.

### M10 — `mapEdits.annotations` are the only persisted map state keyed by absolute coordinates; a site change silently mis-places every DM marker
**Anchor** `src/domain/townMap/mapEdits.js:88-96` and `:311-320`
**Claim** The container's own law comment at `:26` states *"ANCHOR-KEYED, NEVER COORDINATES"* for `pins`; `:94` makes the deliberate exception — *"annotations (free DM markers) legitimately carry x/y because a marker has no backing element to key on"*. `readAnnotations` (`:311`) keeps any finite x/y. There is **no orphan-inspection path** for annotations (`sceneOverrideOrphans.js:44-79` covers `sceneOverrides` only).
**Failure** A DM drops *"ambush here — the ford"* at `(520,560)` on a hills town's river. The guard removes the river, districts shift up to 354 units, and the marker floats over the market quarter with no orphan report and no signal that it moved relative to the map.
**Evidence** CONFIRMED — source inspection of the cited lines plus the 354-unit centroid shift measured in H4.

### M11 — Exactly **one** stale baseline row exists, and a TCD-4 revert stays GREEN
**Anchor** `scripts/.observed-shape-readers-baseline.json:1356`
**Claim** Across the whole 551-file / 2,168-identity frozen inventory the only row the tree no longer produces is `src/domain/townMap/townLayoutV2.js → "exports on economicState": 2` (actual **0**). Zero count-changed identities, zero removed files, zero other zeroed identities. Because `compare()` reports a shrink as `bankable` — a report-only channel that never affects the exit code (`check-observed-shape-readers.mjs:275`, and `:188-210` for `compare`) — reverting `2c1ec70f` restores the count to exactly the ceiling of 2 and the walker stays green.
**Failure** `git revert 2c1ec70f` (restoring `const exportsList = Array.isArray(s.economicState?.exports) ? ... : [];` at `townLayoutV2.js:283`). Scan of the materialized pre-TCD-4 tree `94962c17` against the **current** baseline: `findings 3261, violations 0, stale 0, bankable 0` — **green on the reverted tree**. The dead read returns, the STAGE-0 water/landform family goes dark on every generated settlement, and no gate says a word.
**Evidence** CONFIRMED-executed. Materialized HEAD `2c1ec70f`: `findings 3259 files 551 / violations 0 stale 0 bankable 1` → `BANKABLE — src/domain/townMap/townLayoutV2.js: "exports on economicState" is GONE against a ceiling of 2 — delete the row.` Inventory diff vs the frozen baseline: REMOVED identities (1) = that row; COUNT-CHANGED (0); files only-frozen: `[]`.

### M12 — The framing premise is wrong for TCD-1/2/3: they were already banked by the `ec525a59` re-freeze
**Anchor** `scripts/.observed-shape-readers-baseline.json:16` (`frozenAtSha "ec525a59"`)
**Claim** The baseline was written by commit `bd5e49f6` (13:41). TCD-1 (`9ecec2a2`, 04:59), TCD-2 (`b19038ec`, 05:28) and TCD-3 (`3800bcb6`, 05:46) landed eight hours earlier, and the walker's original freeze (`1d3cdf73`, 06:20) was itself post-TCD-3. Only TCD-4 (`2c1ec70f`, 16:16) postdates the freeze.
**Failure** Searching for four stale rows and "banking down" `rulingPower.js`'s `"id on factions": 2`, or any of the 31 remaining `id on factions` reads across 15 files, would **lower a ceiling below the tree's live count and turn the walker RED on a clean HEAD.** Those 31 reads are live pre-existing debt, not TCD-1 residue.
**Evidence** CONFIRMED-executed. `foundingTier on steadings` → 0 files, sum 0 (TCD-3 banked); `trade on settlement` → 0 files, sum 0, and `src/domain/envoyNegotiationPictureBuilder.js` is absent from the inventory entirely (TCD-2 banked); `id on factions` → 15 files, sum 31, HEAD scan reports `bankable=1` (townLayoutV2 only). Timestamps from `git log -1 --format='%h %ad' --date=iso`, all 2026-08-07 −0400.

### M13 — There is no banking script; the only refresh path is a whole-tree amnesty that would legalise three foreign-lane findings right now
**Anchor** `scripts/check-observed-shape-readers.mjs:231` (the `--write` branch)
**Claim** No bank/refresh/refreeze script exists in `scripts/`, and no `UPDATE=`/`BANK=`/`REFRESH=` env var exists anywhere in the machinery. The only two env vars are `OSR_CORPUS` (`:216`) and `OSR_FREEZE_SHA` (`:248`) — neither banks. `--write` rewrites the **entire** baseline from whatever the tree produces at that instant: inventory, corpusMeta, scanStats and the anti-vacuity sentinel.
**Failure** Running `--write` on the current shared worktree would freeze in three findings belonging to other lanes — adding two brand-new **files** (551 → 553) and three identities, precisely what the baseline's own `_doc` forbids (*"Never raise a number, never add a file, never add an identity"*, mirrored at `:144-146`). Measured additions: `src/domain/worldPulse/commercialReasons.js "partnership01 on settlement":1` and `"severance01 on settlement":1`, `src/lib/spatialUsage.js "arrivals on npcs":1` — all absent at HEAD. It also re-baselines the sentinel (permanently lowering the 90% anti-vacuity floor if the tree is degraded) and rewrites `frozen` to today, erasing freeze provenance.
**Evidence** CONFIRMED-executed. `ls scripts/ | grep -iE 'bank|refresh|refreeze|freeze'` → none. `grep -n 'process\.env'` across the check script, `scripts/lib/observed-shape-corpus.mjs`, `scripts/lib/reader-shape-scan.mjs` and the walker test → only `:216` and `:248`. Live-tree scan: `violations 2 stale 0 bankable 1`; `files only-live: ['src/domain/worldPulse/commercialReasons.js','src/lib/spatialUsage.js']`.

### M14 — The documented shrink instruction is incomplete; "delete the row" alone REDS the walker
**Anchor** `scripts/check-observed-shape-readers.mjs:144-146` and the baseline `_doc` at `:243-244`
**Claim** Both say only *"LOWER this file's number for that identity … (delete the row when it reaches 0)"*. Neither mentions that the walker's static consistency test independently pins the derived aggregates `total` and `identities` against the inventory. A banker who follows the written instruction literally lands a RED gate — and the most likely recovery is `--write`, which is M13's amnesty path.
**Failure** Delete `"exports on economicState": 2` from `:1356` and change nothing else → `tests/lint/observedShapeReaders.walker.test.js` (HEAD `:155-156`; dirty worktree `:191-192`) fails twice: `sum(counts)=3259 !== baseline.total=3261` and `ids.length=2167 !== baseline.identities=2168`.
**Evidence** CONFIRMED-executed. Candidate C (delete only): `RED`. Candidate A (delete + `total` 3261→3259 + `identities` 2168→2167): `GREEN`; `HEAD → violations 0, stale 0, bankable 0`; `REVERT → violations 1` naming `NEW exports on economicState — 2 read(s); this file has no frozen row for it (ceiling 0)`.

### M15 — The walker is currently RED on the live shared worktree from two other lanes' uncommitted work; HEAD itself is green
**Anchor** `src/domain/worldPulse/commercialReasons.js:246`, `src/lib/spatialUsage.js:158`
**Claim** Scanning the live (dirty) tree produces 2 violation blocks / 3 new identities in files that are `M` in `git status` and belong to concurrent lanes. The underlying read *text* already exists at HEAD (`HEAD:236-237 clamp01(num(seam.severance01))` / `clamp01(num(seam.partnership01))`; `spatialUsage.js HEAD:158 sumLeaf(L.migration, r => r?.arrivals)`) — these are not new dead reads; the foreign edits perturbed receiver grounding, exactly the module-graph sensitivity the walker's own header documents.
**Failure** A banking lane runs the CLI to verify its edit, sees exit 1, and either concludes its bank broke the gate or reaches for `--write` — permanently legalising the other lanes' findings.
**Evidence** CONFIRMED-executed. Live: `violations 2 stale 0 bankable 1`. Materialized HEAD `2c1ec70f` of the same code: `violations 0 stale 0 bankable 1`. `git status --porcelain` shows both files `M` (plus 4 more foreign files); `git diff --stat HEAD` → `commercialReasons.js` +11/−1, `spatialUsage.js` +43.

### M16 — `--write` without `OSR_FREEZE_SHA` writes `frozenAtSha: null` and reds the walker
**Anchor** `scripts/check-observed-shape-readers.mjs:248`
**Claim** The refresh path writes `frozenAtSha: process.env.OSR_FREEZE_SHA || null`, but the walker asserts `expect(baseline.frozenAtSha).toMatch(/^[0-9a-f]{7,40}$/)` (HEAD `:176`; dirty worktree `:212`). The usage block at `:51-57` documents `--report`, `--write`, `--json=` and `OSR_CORPUS` and never mentions that `OSR_FREEZE_SHA` is mandatory.
**Failure** Someone runs `--write` as documented, spends 50–175s rebuilding the corpus, and the walker reds on `expected null to match /^[0-9a-f]{7,40}$/` — **after** the old baseline has been overwritten and the provenance sha lost.
**Evidence** CONFIRMED-inspection only (running `--write` would mutate the repo).

---

## C — Chore

### C1 — `HZ-READERNOWRITER`'s enforcer note is stale and its instance count omits TCD-4
**Anchor** `scripts/hazard-registry.json:299` (note), `:301` (`"instances": 3`), `:308` (`upgradePath`)
**Claim** The note reads *"⚠ The ratchet is COUNT-based, so an identity swap at constant count passes."* That was cured at `53029151` (schema 2, per-identity ceilings): the baseline is `"schema": 2` and `rowOf()` actively **throws** on a bare-number row (`check-observed-shape-readers.mjs:124-129`, *"RETIRED count-only form"*). The `upgradePath` likewise still says *"Known soft spot: make the ratchet identity-keyed rather than count-keyed"* — already done. `instances: 3` predates TCD-4, a fourth confirmed member of the class.
**Failure** A reviewer consults the gate-enforced registry (`npm run validate:hazard-registry`), believes the identity-swap hole is still open, and either re-does the `53029151` work or discounts the ratchet's guarantees. The metric the hazard-conversion law cares about — **instances per class** — reads 3 when it is 4.
**Evidence** CONFIRMED-executed grep of both files.

---

## Refuted (claimed, then killed — do not re-chase)

| Claim | Why it died |
|---|---|
| "TCD-1..TCD-4 left four stale walker rows to bank." | **Exactly one** row is stale. TCD-1/2/3 were banked by the `ec525a59` re-freeze eight hours before TCD-4 landed. Acting on the four-row premise would lower a ceiling below the live count and red a clean HEAD (M12). |
| "The walker is RED / broken at HEAD." | Materialized-HEAD scan is `violations 0 stale 0 bankable 1`. The live-tree red is three findings from two foreign lanes' uncommitted work (S11, M15). |
| "Bank the row by setting it to 0." | A `0` row reds the walker (every count is asserted a **positive** integer) and could never be reported again (`compare()`'s bankable arm is gated on `ceiling > 0`). The row must be **removed**, with `total` and `identities` adjusted (M14). |
| "`DRY_BIOME_RE` guards the WATER branch." (the framing premise) | Understated to the point of wrong: at `siteGenesis.js:217` the dry-biome suppression is itself disabled by `!waterEconomy`, so it guards water **only when the export list is empty** — precisely the pre-`2c1ec70f` condition. It has been inert since the day exports started arriving. `WET_BIOME_RE` never guards any kind branch at all. |
| "`coal_deposits` peat is producing marshes on plains." | All 23 `Peat fuel` carriers have `marshlands`; **0** come from `coal_deposits` without it. The `coal_deposits` peat path never fired in 462 settlements (M4). |
| "Narrowing the water predicates reduces contradictions." | **Measured worse in one axis.** Dropping `/timber|lumber|mill/` alone changes 9/168 — all `river → mountain-flank`, because the ore/stone arm becomes reachable once water stops shadowing it. Option B as a whole moved flank-on-flat **15 → 19**. Fixing one predicate in a first-match chain *redistributes load onto the next*. This is why the biome guard must precede predicate narrowing. |
| "The goldens will catch a site-derivation change." | 20/20 v2 golden settlements have `canonExports() === []`; the one export-bearing fixture uses the legacy alias and two non-corpus strings; every other town golden is v1-driven and never reaches `generateSite` (M8). |
| "The town map is never persisted, so a site change is view-only." | One projection **is** persisted — `spatialLedgers.spatialSubstrate` — and its reuse gate is blind to the site (H4). |
| "The `/ore/` catalog accidents (`Foreign merchants`, `Laborer hire`, `Monster lore`, `Weather forecasting`) are shipping today." | Catalog-reachable and confirmed to produce `mountain-flank` when injected, but **not observed** in `primaryExports` across 1008 + 126 sampled settlements. Latent path only — recorded as deferred, not as a live finding (H3). |
| "`siteGenesis.js` is near its size ceiling / the fix will trip a ratchet." | 205 effective lines against an 800 ceiling; none of the touched files appears in `scripts/.size-baseline.json`. |
| "`exports.join(' ')` can throw on a malformed export list." | Driven with `null`, `undefined`, a bare string, and `[{}, 'Peat fuel']` — the `waterEconomy &&` short-circuit prevents it (S3). |

---

## Open questions (not findings; nobody has executed these)

1. **Which existing pins redden under Waves 3–5.** No lens ran vitest (other lanes hold the slot). `townMapLandform.test.js:181` pins marsh/dunes/mountain geometry; `townLayoutV2.test.js:229-233` already carries the warning *"THE v2 GOLDEN CANNOT PIN THIS."*
2. **customContent trade endpoints.** Every probe ran `customContent: {}`. `customTradeEndpointIntegration.js` pushes arbitrary user strings into `primaryExports`, arming the latent fragments `/ale/`, `/hop/`, `/ore/`, `/hide/`, `/meat/`.
3. **Whether the panorama, PDF plate and four style lenses re-derive site kind independently or inherit it.** Not audited.
4. **`config.biome` set independently of `terrainOverride`.** No probe set it; `realmBiome` always fell back to terrain.
5. **Which foreign edit re-grounded which receiver** in M15. Attributed by the read-text-present-at-HEAD argument, not isolated.

