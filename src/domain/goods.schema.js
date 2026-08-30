/**
 * domain/goods.schema.js — THE GOODS NAMESPACE: one typed record vocabulary
 * over the nine physical modules that hold the resource → chain → demand →
 * category tables.
 *
 * WHY THIS FILE EXISTS AND WHY IT HAS NO RUNTIME EXPORTS
 * ─────────────────────────────────────────────────────────────────────────────
 * The goods vocabulary is split across nine modules, and the split is LOAD-
 * BEARING, not accidental: `data/resourceChains.js:1-17` states the law in the
 * tree's own words — "DO NOT re-export these from resourceData.js — an eager
 * re-export would re-drag them into first paint" (@enforced-by
 * tests/build/vendorPdfLazy.test.js). A single merged catalog is FORBIDDEN by
 * a gate that already exists. So the unification is a LOGICAL namespace, never
 * a file merge:
 *
 *   1. this module — the typed record vocabulary. Typedefs only, ZERO value
 *      exports, `export {}` at the foot (the domain/types.js idiom). Because
 *      every reference to it is a JSDoc `import('./goods.schema.js').T`
 *      annotation inside a comment, it carries NO runtime import edge at all:
 *      the eager-graph parser in vite.config.js strips comments before it
 *      walks imports, so this file cannot be an eager edge even in principle.
 *   2. `data/goods/identity.js` — the EAGER surface (identity + terrain).
 *   3. `data/goods/chains.js`   — the LAZY surface (chain + demand + tier).
 *
 * THE NINE PHYSICAL MODULES
 * ─────────────────────────────────────────────────────────────────────────────
 *   IDENTITY half (rides the first-paint `data` chunk)
 *     • src/data/resourceData.js          RESOURCE_DATA, SPECIAL_RESOURCES
 *   CHAINS half (rides `data-lazy`, except finishedGoodsCategory — see below)
 *     • src/data/resourceChains.js        RESOURCE_CHAINS, INDUSTRY_WATER_NEEDS
 *     • src/data/economicData.js          TRADE_DEPENDENCY_NEEDS
 *     • src/data/tradeGoodsData.js        GOODS_CATEGORIES, IMPORT_GOODS_BY_TIER,
 *                                         GOODS_MODIFIERS_BY_TIER, COMMODITY_CATEGORY_MAP
 *     • src/data/finishedGoodsCategory.js INSTITUTION_FINISHED_GOODS_DEMAND,
 *                                         finishedGoodsCategoryOf
 *     • src/data/supplyChainData.js       SUPPLY_CHAIN_NEEDS
 *     • src/data/supplyChainResourceIndex.js RESOURCE_TO_CHAINS, RETIRED_CHAIN_ALIASES,
 *                                         REAGENT_CHAIN_SPINE, REAGENT_STAPLE_LABEL
 *   NAMESPACE MEMBERS WITH NO SURFACE (typed here, imported directly)
 *     • src/domain/resourceSemantics.js   RESOURCE_SEMANTICS + its readers
 *     • src/generators/tradeCommodity.js  COMMODITY_SCAN (ordered!) + deriveTradeCommodity
 *
 * Those last two carry no surface door ON PURPOSE, and the reason is a lint
 * rule, not taste: the eslint src/data purity rule bans a data module from
 * importing the generators or lib layers, and a data → domain import would
 * invert the layer direction that every other data table honours. A surface
 * that re-exported them would either fail lint or invert the layering, so the
 * vocabulary types them and consumers reach them where they live. This is the
 * honest ≥9-module accounting the review demanded — not a five-file story.
 *
 * THE SURFACE LAW (the one rule that can break the build)
 * ─────────────────────────────────────────────────────────────────────────────
 *   • A module in the EAGER first-paint graph may import `goods/identity.js`.
 *   • A module in the EAGER first-paint graph may NEVER import `goods/chains.js`.
 *     One such edge would make vite's derived `isEagerData` classifier route
 *     every chains-half table into the first-paint `data` chunk (~+390 kB),
 *     blowing the 1,040,000-byte closure budget. This is exactly the edge
 *     `resourceChains.js:1-17` forbids, arriving through an index instead of a
 *     re-export.
 *   • The LAZY surface MAY re-export an eager table (`finishedGoodsCategory.js`
 *     is physically eager and semantically demand). lazy → eager is the safe
 *     direction — the `custom-registry` chunk precedent in vite.config.js.
 *   @enforced-by tests/build/vendorPdfLazy.test.js (the surface-law arms) and
 *                tests/joins/goods.test.js (the roster + re-export identity).
 *
 * THE PERSISTED-SHAPE CONSTRAINT (why no record here may be renamed)
 * ─────────────────────────────────────────────────────────────────────────────
 * Catalog shapes LEAK INTO SAVES. `src/pdf/lib/viewModelBodySlices.js` reads a
 * settlement's stored `resourceAnalysis.exploitation` and documents the entries
 * as "RESOURCE_CHAINS objects — resource in `rawResource`, processing in
 * `processingInstitutions[]`, outputs in `finalProducts[]`". Legacy saves hold
 * those field names. Renaming a field in this vocabulary is therefore NOT a
 * display-only change: it is a save-format change, and the reader's existing
 * fallback chain (`rawResource ?? resource ?? chainKey ?? name`) is the reason
 * old campaigns still render. See {@link ExploitationEntry}.
 * Two more shapes are order- or key-sensitive and must never be "canonicalised"
 * into a derived form: `COMMODITY_SCAN`'s list ORDER is load-bearing
 * ("fish before salt keeps 'Salted fish' → fish"), and `TRADE_DEPENDENCY_NEEDS`
 * keys are EXACT institution names joined against the institutional catalog.
 *
 * THE MIGRATION ROSTER
 * ─────────────────────────────────────────────────────────────────────────────
 * Every consumer of the namespace, the half(s) it reaches, and the door it uses.
 * Machine-read by tests/joins/goods.test.js, which RE-DERIVES the eager flag and
 * the halves from the import graph and fails on any drift — so this table can
 * neither rot nor be edited into agreement with a wrong tree.
 *
 * Columns: `R | <E|l> | <halves> | <door> | <path>`
 *   E/l    — the file is in / out of the eager first-paint module graph.
 *   halves — identity | chains | identity+chains | none (member-only consumer).
 *   door   — surface (imports the index) | direct (imports the physical module)
 *            | member (reaches only a no-surface namespace member).
 *
 * R | E | identity        | surface | src/domain/events/mutateWorld.js
 * R | E | chains          | direct  | src/domain/region/tradeLinks.js
 * R | E | identity        | surface | src/domain/resourceTerrainCompatibility.js
 * R | l | chains          | surface | src/components/new/SupplyChainsPanel.jsx
 * R | l | chains          | direct  | src/components/ServicesTogglePanel.jsx
 * R | l | identity+chains | surface | src/components/settlement/EventComposer.jsx
 * R | l | chains          | direct  | src/components/TradeDynamicsPanel.jsx
 * R | l | chains          | surface | src/domain/display/institutionProfile.js
 * R | l | identity        | surface | src/domain/resourceSites.js
 * R | l | none            | member  | src/domain/undercity/monotoneComponents.js
 * R | l | identity+chains | surface | src/domain/worldPulse/institutionLifecycle.js
 * R | l | chains          | surface | src/domain/worldPulse/magicSubstitutionReagents.js
 * R | l | identity+chains | surface | src/domain/worldPulse/resourceDynamicsKernel.js
 * R | l | identity        | surface | src/domain/worldPulse/resourceTaxonomy.js
 * R | l | identity        | surface | src/domain/worldPulse/steadingTopography.js
 * R | l | identity+chains | surface | src/domain/worldPulse/tierResourceDynamics.js
 * R | l | chains          | surface | src/generators/cascadeGenerator.js
 * R | l | identity+chains | surface | src/generators/computeActiveChains.js
 * R | l | chains          | surface | src/generators/economy/economicState.js
 * R | l | chains          | surface | src/generators/economy/finishedGoodsDemand.js
 * R | l | none            | member  | src/generators/economy/foodBalance.js
 * R | l | none            | member  | src/generators/economy/nativeEconomicInputs.js
 * R | l | identity+chains | surface | src/generators/economy/tradeGoods.js
 * R | l | chains          | surface | src/generators/economy/viability.js
 * R | l | none            | member  | src/generators/foodGenerator.js
 * R | l | none            | member  | src/generators/generationCoherence.js
 * R | l | none            | member  | src/generators/historyGenerator.js
 * R | l | chains          | surface | src/generators/institutionProbability.js
 * R | l | none            | member  | src/generators/narrativeGenerator.js
 * R | l | none            | member  | src/generators/npcGenerator.js
 * R | l | identity+chains | surface | src/generators/resourceGenerator.js
 * R | l | chains          | direct  | src/generators/services/institutionServices.js
 * R | l | identity        | surface | src/generators/steps/assembleInstitutions.js
 * R | l | none            | member  | src/generators/steps/generateNarratives.js
 * R | l | identity        | surface | src/generators/steps/resolveResources.js
 * R | l | identity+chains | surface | src/generators/structuralValidator.js
 * R | l | identity+chains | surface | src/lib/customRegistry.js
 * R | l | chains          | surface | src/lib/prebuiltResourceChains.js
 * R | l | chains          | direct  | src/pdf/sections/SupplyChainFlow.jsx
 *
 * THE FIVE `direct` ROWS, EACH WITH ITS REASON
 * ─────────────────────────────────────────────────────────────────────────────
 *   • `domain/region/tradeLinks.js` — the ONLY eager consumer of a chains-half
 *     table, and it is eager on purpose: FP-G4 split `finishedGoodsCategory.js`
 *     out of `economicData.js` precisely so this one first-paint edge would stop
 *     dragging the 21 kB TRADE_DEPENDENCY_NEEDS table into the closure. Routing
 *     it through the chains surface would undo FP-G4 and re-eager the whole
 *     chains half. It keeps the direct import FOREVER, and the surface law above
 *     is the executable form of that sentence.
 *   • `components/ServicesTogglePanel.jsx` and
 *     `generators/services/institutionServices.js` — neither actually wants goods
 *     vocabulary. Both reach `tradeGoodsData.js` only for `INSTITUTION_SERVICES`,
 *     which that file merely RE-EXPORTS from `data/institutionServices.js`. It is
 *     institution vocabulary wearing a goods file's address, so it is deliberately
 *     NOT on the chains surface: putting it there would make the goods namespace
 *     the door to a table that is not goods, and the roster would stop meaning
 *     what it says. Their rows read `chains` because the tree says so, and
 *     `direct` because the surface correctly refuses to carry that symbol.
 *   • `pdf/sections/SupplyChainFlow.jsx` — the one row decided by a MEASUREMENT
 *     rather than a rule. It was migrated, built, and reverted: routing it
 *     through the door grew `pdfRender.worker` by 3,595 B (2,342,505 →
 *     2,346,100) because that bundle carries its own copy of whatever it
 *     reaches and does not otherwise hold the chains half. Nothing else moved.
 *     It reads one table, so it keeps the one import. If a later PDF section
 *     needs the half properly, re-measure and move this row.
 *   • `components/TradeDynamicsPanel.jsx` — a landed guard names the physical
 *     module IN A SOURCE REGEX: F30's single-source-of-truth pin
 *     (`tests/components/tradeDynamicsGoodsSource.test.js`) asserts the panel
 *     imports GOODS_MODIFIERS_BY_TIER from `data/tradeGoodsData`, because the
 *     goods concept once existed as THREE drifted tables and that pin is what
 *     collapsed them onto the live one. Routing the panel through the door does
 *     not create a second table — the door re-exports the same binding by
 *     reference — but relaxing another wave's guard to fit a spelling change is
 *     not this car's business. The panel keeps the direct import and the pin
 *     keeps its exact meaning. FOUND BY THE FULL GATE, not by reasoning: it is
 *     a `tests/components/` source pin that no goods-shaped targeted run reaches.
 *
 * EVERY OTHER CONSUMER GOES THROUGH A DOOR, AND IT COST 395 BYTES.
 * The worry that motivated the two-surface split — an index dragging a whole half
 * into every bundle that touches one table — does NOT generally materialise,
 * because Rollup tree-shakes a pure re-export index: an importer that names one
 * binding pulls one module. MEASURED across the whole `dist/` before and after the
 * migration: total JS 17,717,738 → 17,718,133 B (+395, of which +300 is
 * advanceInterval.worker and +27 SupplyChainsPanel), with `data`, `data-lazy`,
 * `engine`, `engine-core`, `custom-registry`, `pdfRender.worker` and
 * `customContentPreview.worker` byte-IDENTICAL, and the first-paint closure
 * unmoved at 8 files / 1,026,756 B. The doors are free almost everywhere; the two
 * places they are not — an EAGER importer of the lazy door, and the PDF worker —
 * are the two the roster spends its `direct` rows on, one walked and one measured.
 *
 * @see src/data/goods/identity.js
 * @see src/data/goods/chains.js
 */

// ── Identity half ────────────────────────────────────────────────────────────

/**
 * Where a native resource sits in the world's coarse geography. Closed set —
 * every RESOURCE_DATA entry carries exactly one.
 * @typedef {'land'|'water'|'subterranean'|'special'} ResourceCategory
 */

/**
 * A native-resource IDENTITY record: what the resource is, what terrain it
 * needs, which institutions it lifts, and what it puts on a trade table.
 * The key is a snake_case {@link ResourceKey}.
 *
 * @typedef {Object} ResourceRecord
 * @property {string} label                     display name ("Fishing Grounds")
 * @property {string} desc                      one-sentence description
 * @property {string[]} commodities             commodity keys this yields (join → COMMODITY_CATEGORY_MAP)
 * @property {Record<string, number>} instBoosts institution-name fragment → probability multiplier
 * @property {string[]} tradeGoods              authored trade-good labels
 * @property {string[]} forbidden               config keys that make this resource impossible
 * @property {string[]=} terrainRequired        terrain keys this resource requires (absent on specials)
 * @property {string=} terrain                  single terrain pin used by SPECIAL-tier entries
 * @property {string|null} warning              wizard-side warning text, or null
 * @property {ResourceCategory} category
 */

/**
 * A resource key — the snake_case identifier used as the key of RESOURCE_DATA,
 * RESOURCE_SEMANTICS and RESOURCE_TO_CHAINS. The three tables are keyed on the
 * SAME vocabulary; that join is what makes them one namespace.
 * @typedef {string} ResourceKey
 */

/**
 * One entry of a SPECIAL_RESOURCES `institutionModifiers` list. Exactly one of
 * `name` / `tags` is present: `name` matches an institution by exact label,
 * `tags` by capability tag (the entityTags.js TAG vocabulary).
 * @typedef {Object} InstitutionModifier
 * @property {string=} name
 * @property {string[]=} tags
 * @property {number} modifier
 */

/**
 * A SPECIAL resource — a site-level feature (ruins, a ley node, a holy site)
 * rather than an extractable deposit. Shape differs from {@link ResourceRecord}
 * by design; do not unify the two records.
 * @typedef {Object} SpecialResourceRecord
 * @property {string} name
 * @property {string} description
 * @property {Object} effects
 * @property {InstitutionModifier[]} effects.institutionModifiers
 * @property {string[]} effects.resources         free-text yielded materials
 * @property {boolean=} effects.tourism
 * @property {string=} effects.strategicImportance
 */

// ── Semantics (namespace member: src/domain/resourceSemantics.js) ────────────

/**
 * What KIND of thing a resource is, for the state questions generation and
 * simulation ask. Deliberately exhaustive rather than inferred — adding a
 * resource requires an explicit decision here.
 * @typedef {'renewable'|'exhaustible'|'positional'|'infrastructure'|'magical'} ResourceType
 */

/** @typedef {'available'|'depleted'|'absent'} ResourceCondition */

/** @typedef {'natural'|'manual'|'requires_high_magic'|'not_applicable'} ResourceRecoveryMode */

/**
 * The semantics record for one {@link ResourceKey}. Canonical home is
 * `src/domain/resourceSemantics.js`, which re-declares this shape locally
 * because it is a domain module with runtime exports; the two must agree.
 * @typedef {Object} ResourceSemanticsRecord
 * @property {ResourceType} type
 * @property {boolean} randomDepletionEligible
 * @property {ResourceRecoveryMode} recoveryMode
 * @property {string} depletedDescription
 * @property {string|null} shortageImport
 */

// ── Chains half ──────────────────────────────────────────────────────────────

/**
 * How much a chain's finished goods are worth as an export. Closed, ordered
 * low → high. String-valued rather than numeric on purpose: the number that
 * would replace it is tuning, and tuning is owner-signed.
 * @typedef {'medium'|'high'|'very high'} ChainExportValue
 */

/**
 * A raw-resource → processing → export chain. `processingTags` is the
 * MECHANICAL matcher (a capability tag the institutional catalog declares);
 * `processingInstitutions` is the human-readable gap-row vocabulary and must
 * resolve under the same resolver the runtime uses. A few chains legitimately
 * carry an empty `processingTags` and lean on the exact-name fallback.
 *
 * ⚠ This record's field names are PERSISTED — see {@link ExploitationEntry}.
 *
 * @typedef {Object} ResourceChainRecord
 * @property {string} rawResource
 * @property {string[]} processingTags            values of the entityTags.js TAG map
 * @property {string[]} processingInstitutions    exact catalog names
 * @property {string[]} intermediateGoods
 * @property {string[]} finalProducts
 * @property {ChainExportValue} exportValue
 * @property {string[]} dependsOn                 free-text preconditions
 */

/**
 * An industry's water requirement. Keyed by EXACT institution name.
 * @typedef {Object} IndustryWaterNeed
 * @property {boolean} required
 * @property {string[]} alternatives    infrastructure that satisfies the need instead
 * @property {string} reason            the sentence shown to the reader
 */

/**
 * A raw-material dependency an institution has when the settlement cannot
 * supply it locally. Keyed by EXACT institutional-catalog name — the join is
 * silent when it fails, which is why tests/joins/goods.test.js pins it.
 * @typedef {Object} TradeDependencyNeed
 * @property {ResourceKey[]} resources   resource keys that satisfy the need locally
 * @property {string} label              short commodity label ("Grain")
 * @property {string} detail             the phrase used in prose
 * @property {string[]} svcs             services the dependency underwrites
 */

/**
 * Finished-goods demand for one institution CATEGORY. Fires when demand for
 * finished goods exceeds local production capacity — the complement of
 * {@link TradeDependencyNeed}, which fires when raw materials are absent.
 * @typedef {Object} FinishedGoodsDemandRecord
 * @property {Record<string, {demand: number}>} consumers    lowercased institution fragment → 1..5
 * @property {Record<string, {supply: number}>} suppliers    lowercased fragment → 1..5
 * @property {string[]} importLabels                          [small gap, medium gap, large gap]
 * @property {string=} exportBonus                            label when supply far exceeds demand
 */

/**
 * A supply-chain need cluster: one top-level need and the chains that serve it.
 * @typedef {Object} SupplyChainNeed
 * @property {string} label
 * @property {string} color             hex swatch for the configuration panel
 * @property {string} desc
 * @property {SupplyChainLink[]} chains
 */

/**
 * One chain inside a {@link SupplyChainNeed}. `entrepot` marks goods that flow
 * through without local production (the crossroads/port model).
 * @typedef {Object} SupplyChainLink
 * @property {string} id                          unique within its need cluster
 * @property {string} label
 * @property {string} resource                    display label of the enabling resource
 * @property {string[]} rawInputs
 * @property {string[]} processingInstitutions
 * @property {string[]} intermediateGoods
 * @property {string[]} outputs
 * @property {string[]} services
 * @property {boolean} exportable
 * @property {boolean} entrepot
 * @property {string} minTier
 * @property {string[]=} resourceSubstitutes
 */

/**
 * A fully-qualified chain address, `"<needKey>.<chainId>"` — e.g.
 * `"food_security.grain"`. The key type of RESOURCE_TO_CHAINS' values and of
 * REAGENT_CHAIN_SPINE.
 * @typedef {string} ChainAddress
 */

/**
 * One rung of the arcane reagent spine: what a chain consumes, what it
 * produces, and how hard it pulls. Absolute scale is the regime's business and
 * lives in MAGIC_SUBSTITUTION_TUNING — never here.
 * @typedef {Object} ReagentChainRung
 * @property {ReadonlyArray<string>} consumes
 * @property {ReadonlyArray<string>} produces
 * @property {number} demandWeight
 */

// ── Tier + category half ─────────────────────────────────────────────────────

/**
 * A goods category. The values of the GOODS_CATEGORIES map — a closed set that
 * every IMPORT_GOODS_BY_TIER and GOODS_MODIFIERS_BY_TIER entry draws from.
 * @typedef {'agricultural'|'raw_materials'|'manufactured'|'luxury'|'services'|'food_processed'|'trade'} GoodsCategory
 */

/**
 * A good a settlement of some tier IMPORTS. `on` is the default toggle state
 * in the pre-generation configuration panel.
 * @typedef {Object} ImportGoodRecord
 * @property {string} name
 * @property {GoodsCategory} category
 * @property {boolean} on
 * @property {string} desc
 */

/**
 * A good a settlement of some tier can PRODUCE, with its base probability.
 * Keyed by the good's display label inside a per-tier block.
 * @typedef {Object} GoodsModifierRecord
 * @property {GoodsCategory} category
 * @property {number} p                probability 0..1
 * @property {boolean} on
 * @property {string} desc
 * @property {string=} requiredInstitution  free-string join against the catalog
 */

/**
 * The finished-goods category a label classifies into, or null when nothing
 * matches. Returned by `finishedGoodsCategoryOf`.
 * @typedef {'military'|'religious'|'maritime'|'luxury'|'alchemical'|string|null} FinishedGoodsCategory
 */

// ── The persisted seam ───────────────────────────────────────────────────────

/**
 * ⚠ THE ONE SHAPE THAT LIVES IN SAVES. `settlement.resourceAnalysis.exploitation`
 * holds arrays of these under `fullyExploited` / `partiallyExploited` /
 * `unexploited` (legacy saves use the display keys `full` / `partial` /
 * `unexploited`). Entries are {@link ResourceChainRecord}-shaped, and older
 * campaigns hold OLDER field spellings, which is why every reader keeps a
 * fallback chain rather than a single field read. A plain string entry is also
 * legal and means "resource name only".
 *
 * Renaming any field named here is a SAVE-FORMAT change, not a refactor.
 *
 * @typedef {Object} ExploitationEntry
 * @property {string=} rawResource   canonical resource field (RESOURCE_CHAINS spelling)
 * @property {string=} resource      legacy alias
 * @property {string=} chainKey      legacy alias
 * @property {string=} name          legacy alias
 * @property {string[]=} processingInstitutions
 * @property {string=} processing    legacy scalar alias
 * @property {string=} institution   legacy scalar alias
 * @property {string[]=} finalProducts
 */

// No runtime exports — this file is the goods namespace's JSDoc vocabulary only,
// and staying export-free is what keeps it off every chunk graph.
export {};
