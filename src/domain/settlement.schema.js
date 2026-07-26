/**
 * domain/settlement.schema.js — Canonical settlement shape + version stamps.
 *
 * This file is the single source of truth for "what is a settlement,
 * structurally?" Three things live here:
 *
 *   1. JSDoc typedefs (zero runtime cost — purely documentary). Editors
 *      and code reviewers see the same contract that PDF authors and
 *      AI prompt authors read.
 *
 *   2. Version constants. Every settlement carries `schemaVersion`,
 *      `simulationVersion`, and `generatorVersion`. Migration helpers
 *      key off these to load older saves without breaking.
 *
 *   3. Field-name aliases. The historical codebase uses parallel names
 *      for the same concept (`stress` vs `stresses` vs `stressors`
 *      vs `stressTypes`). This file declares the canonical names. The
 *      `normalizeSettlement()` adapter in `domain/normalizeSettlement.js`
 *      reads from here when reconciling shapes.
 *
 * Architectural rule: this file imports nothing. Every consumer
 * (generator pipeline, store, PDF, AI overlay) reads from it. It must
 * never reach back into runtime code. Pure shape definitions only.
 *
 * The canonical shape is the *target*, not the current state. Today's
 * pipeline still produces the legacy shape. The plan is:
 *
 *   - Today:  Pipeline emits legacy shape. `normalizeSettlement()` runs
 *             at boundaries (save, load, PDF, AI) to produce the canonical
 *             shape for any consumer that asks.
 *   - Next:   New consumers (causal trace layer, faction profile reader,
 *             AI grounded-in-trace prompts) read canonical directly.
 *   - Future: One generator step at a time migrates to producing the
 *             canonical shape natively. `normalizeSettlement()` becomes
 *             increasingly an identity pass.
 *   - End:    Legacy shape deleted; `normalizeSettlement()` becomes a
 *             pure schema-version migrator.
 */

// ── Version stamps ──────────────────────────────────────────────────────────
// Bumped when the shape changes in a way that requires per-version handling.
// SCHEMA_VERSION jumps when fields are renamed, removed, or restructured.
// SIMULATION_VERSION jumps when generator output semantics change in a way
// that older saves wouldn't recompute identically. GENERATOR_VERSION is the
// build-time stamp — useful for "this save was made by SettlementForge 1.2.3."

export const SCHEMA_VERSION     = 1;
export const SIMULATION_VERSION = 1;
export const GENERATOR_VERSION  = '0.9.0';

// ── Canonical field-name map ────────────────────────────────────────────────
// When the legacy shape uses multiple names for the same concept, this map
// declares the canonical name (key) and the historical aliases (values).
// `normalizeSettlement()` reads from any alias, writes to the canonical key.

export const FIELD_ALIASES = Object.freeze({
  // stressTypes is deliberately NOT an alias of stressors: it holds type STRINGS,
  // not stressor objects (type/name/severity). canonicalAccessors.canonStressors
  // excludes it for the same reason; including it here let normalizeSettlement
  // write a string[] into the canonical `stressors` field when only stressTypes
  // was present, corrupting object-expecting substrate readers.
  stressors:      ['stress', 'stresses'],
  // (Future entries: e.g. `neighbors: ['neighbours', 'neighborRelationship']`
  // once that concept gets normalized.)
});

// NESTED aliases (under economicState) can't live in the top-level map above —
// `normalizeSettlement` only rewrites top-level keys. The economy's
// primaryExports/primaryImports (legacy: exports/imports) are resolved at read
// time by domain/canonicalAccessors.js (canonExports / canonImports), which is
// the single boundary the substrate readers go through.

// ── Canonical typedef ───────────────────────────────────────────────────────
// The eventual target shape. Today's pipeline output is a flatter version of
// this; `normalizeSettlement()` is the adapter. Update both this typedef and
// the adapter when adding fields.

/**
 * The seed-stable local expression of a selected culture profile.
 *
 * @typedef {Object} CulturalIdentity
 * @property {string} key
 * @property {string} label
 * @property {string} scope
 * @property {string[]} [sourceKeys]
 *   Present only for a mixed identity.
 * @property {string} builtForm
 * @property {string} civicPattern
 * @property {string} exchangePattern
 * @property {string} foodways
 * @property {string} sacredLife
 * @property {string} defensePattern
 * @property {string} socialTexture
 * @property {string} architecturalDetail
 */

/**
 * The effective, persisted generation config. Resource membership and
 * condition live here because `resourceAnalysis.availableResources` is a
 * derived chain-matching vocabulary, not a second resource roster.
 *
 * @typedef {{
 *   tradeRouteAccess?: string,
 *   monsterThreat?: string,
 *   magicLevel?: string,
 *   priorityMagic?: number,
 *   magicExists?: boolean,
 *   government?: unknown,
 *   primaryDeitySnapshot?: Record<string, unknown>,
 *   contentProfile?: 'heroic'|'grounded'|'grim'|'custom',
 *   contentBoundaries?: Record<string, boolean>|null,
 *   nearbyResources?: string[],
 *   nearbyResourcesState?: Record<string, string>,
 *   nearbyResourcesNative?: string[],
 *   nearbyResourcesCustom?: string[],
 *   nearbyResourcesDepleted?: string[],
 *   nearbyResourcesNativeDepleted?: string[],
 *   nearbyResourceDefinitions?: Array<Record<string, unknown>>,
 *   nearbyResourceDefinitionsDepleted?: Array<Record<string, unknown>>
 * } & Record<string, unknown>} GenerationResolvedConfig
 */

/**
 * @typedef {Object} IsolationSupportPath
 * @property {'local_foodshed'|'hinterland'|'reserves'|'seasonal_access'|'patronage'|'magical_transit'} type
 * @property {number} capacity
 * @property {'durable'|'seasonal'|'conditional'|'fragile'} stability
 * @property {string[]} evidence
 */

/**
 * @typedef {Object} IsolationSupportReceipt
 * @property {1} version
 * @property {boolean} applicable
 * @property {string} tier
 * @property {number} requiredCapacity
 * @property {number} capacity
 * @property {number} deficit
 * @property {'connected'|'resilient'|'viable'|'precarious'|'untenable'|'magic_supported'|'magic_dependent'} status
 * @property {IsolationSupportPath[]} paths
 * @property {boolean} magicDependent
 */

/**
 * @typedef {Object} GenerationCoherenceFinding
 * @property {string} path
 * @property {string} detail
 * @property {string} [evidence]
 */

/**
 * @typedef {Object} GenerationCoherenceCheck
 * @property {'template_tokens'|'narrative_quality'|'world_law_magic'|'content_boundaries'|'resource_truth'|'structural'|'food_verdict'|'npc_identity'|'isolation_support'|'final_graph'|'chronology'|'conservation'|'user_intent'|'narrative_realization'|'dramatic_tension'|'roster_repetition'|'provenance'} id
 * @property {string} label
 * @property {'pass'|'fail'} status
 * @property {GenerationCoherenceFinding[]} findings
 */

/**
 * One of the seven owner-facing judgments over the final dossier. Confidence
 * is categorical and supported by `evidence`; it is never a synthetic score.
 *
 * @typedef {Object} GenerationCoherenceJudgment
 * @property {'hard_structural_validity'|'cross_system_semantic_agreement'|'user_intent_fulfillment'|'narrative_realization'|'dramatic_tension'|'diversity_and_repetition'|'confidence_and_provenance'} id
 * @property {string} label
 * @property {'pass'|'pass_with_tension'|'needs_review'|'not_applicable'} status
 * @property {'single_settlement'} scope
 * @property {string} summary
 * @property {GenerationCoherenceFinding[]} findings
 * @property {GenerationCoherenceFinding[]} evidence
 */

/**
 * The post-repair audit of the final assembled settlement. It reports
 * coherence; it never repairs the settlement itself.
 *
 * @typedef {Object} GenerationCoherenceReceipt
 * @property {1} version
 * @property {'coherent'|'coherent_with_authored_tensions'|'needs_review'} status
 * @property {string} seed
 * @property {number|null} worldLawVersion
 * @property {string|null} cultureProfile
 * @property {'heroic'|'grounded'|'grim'|'custom'} contentProfile
 * @property {GenerationCoherenceCheck[]} checks
 * @property {GenerationCoherenceJudgment[]} [judgments]
 * @property {Array<Record<string, unknown>>} repairs
 * @property {Array<{type:string, subject:string|null, reason:string}>} authoredTensions
 */

/**
 * @typedef {Object} CanonicalSettlement
 *
 * @property {string} id
 *   Stable identifier — opaque, slug-safe. Generated once at create time;
 *   preserved across regenerations and saves.
 *
 * @property {string} _seed
 *   PRNG seed used to generate this settlement. Replay determinism depends
 *   on this — never mutate.
 *
 * @property {number} schemaVersion
 * @property {number} simulationVersion
 * @property {string} generatorVersion
 *
 * @property {SettlementIdentity} identity
 *   Display-facing facts: name, tier, dominant culture, magic level, genre.
 *
 * @property {GenerationResolvedConfig} [config]
 *   Resolved generation facts. The raw, user-authored regeneration input may
 *   also be retained separately as `_config` by the current flat shape.
 *
 * @property {CulturalIdentity} [culturalIdentity]
 *   Structured local expression of the selected culture. `culturalNotes` is
 *   its legacy prose projection, not a second cultural authority.
 *
 * @property {Object} [geography]
 *   Terrain, climate, biome, river/road access, region. Today this is
 *   spread across `config.terrain`, `resourceAnalysis.terrain`, etc.; the
 *   canonical shape consolidates it.
 *
 * @property {ResourceEntry[]} [resources]
 *   Local + imported resources. Each entry has `id`, `name`, `tags`,
 *   `flow` (produced / imported / scarce / blocked). Until this future nested
 *   projection is native, the effective `config.nearbyResources*` sidecars are
 *   the authoritative current flat-shape roster.
 *
 * @property {StressorEntry[]} [stressors]
 *   Active stressors (plague, drought, raid pressure, etc.) that shape
 *   this generation run. Canonical name; legacy code may write to
 *   `stress`, `stresses`, or `stressTypes`.
 *
 * @property {ActiveCondition[]} [activeConditions]
 *   Persistent world conditions (Tier 2.3 in the roadmap) — initially empty.
 *   Populated as the event system promotes annotations to first-class
 *   conditions.
 *
 * @property {Institution[]} [institutions]
 * @property {Service[]} [services]
 * @property {SupplyChain[]} [supplyChains]
 *
 * @property {Object} [economy]
 *   Prosperity band, market state, prices, exports/imports.
 *
 * @property {Object} [government]
 *   Type, ruling body, succession rules, legitimacy.
 *
 * @property {Object} [power]
 *   Faction power distribution, public legitimacy ingredients, stability.
 *
 * @property {Faction[]} [factions]
 * @property {Object} [population]
 * @property {NPC[]} [npcRoster]
 * @property {Threat[]} [threats]
 * @property {Hook[]} [hooks]
 * @property {Object} [history]
 * @property {Neighbor[]} [neighbors]
 * @property {Object} [trade]
 * @property {IsolationSupportReceipt} [isolationSupport]
 *   Explainable capacity receipt for isolated settlements; connected
 *   settlements retain a non-applicable `connected` record.
 *
 * @property {GenerationCoherenceReceipt} [generationCoherenceReceipt]
 *   Final post-repair audit. A missing receipt means “not recorded,” not
 *   “coherent.”
 *
 * @property {Object} [userCanon]
 *   User-pinned or user-authored facts. These survive reruns; the generator
 *   must respect them.
 *
 * @property {TraceEntry[]} [simulationTrace]
 *   Causal trace data — populated by Tier 2.1's trace layer. Empty until
 *   the trace layer ships.
 *
 * @property {Object[]} [eventLog]
 *   Campaign events that have been applied in canon mode.
 *
 * @property {Object[]} [aiOverlays]
 *   Optional AI-generated prose layers. Distinct from canon facts.
 *
 * `GenerationContext.worldLaw` is intentionally absent from this persisted
 * shape: it is an immutable, function-bearing policy object scoped to one run.
 */

// ── Simulation flat-shape typedef ────────────────────────────────────────────
// SimSettlement is the CURRENT FLAT shape the simulation layer (worldPulse/,
// causalState, events, mutateEntities) actually reads at runtime — distinct from
// CanonicalSettlement's FUTURE NESTED target shape above. The sim code reads
// `settlement.factions` / `.npcs` / `.population` at the TOP level, not under
// `identity` / `population` sub-objects, so annotating those params with
// CanonicalSettlement would be semantically wrong (see the TYPING DEBT note above).
// This is the missing artifact that note calls for: a dedicated flat-shape typedef
// to thread through the ~3k sim call sites.
//
// LOOSE BY DESIGN. The `& Record<string, any>` intersection gives it a TS index
// signature, so accessing a field NOT listed below does NOT error (it resolves to
// `any`) — required to thread it into the sim layer without surfacing hundreds of
// full-tree / strict-ratchet errors while the field set is still being enumerated.
// The listed properties are still real constraints: misusing a listed scalar (e.g.
// `settlement.population.toUpperCase()`) DOES error, so the type earns its keep.
// As the paydown proceeds, MOVE fields out of the implicit index-signature bucket
// into explicit @property lines (tightening types) — never the reverse.
//
// Scalars below are typed as their real type ONLY where they are reliably that
// scalar; every array / nested object is typed LOOSELY (`any[]` / `Object` /
// `Record<string, any>`) to avoid over-constraining a shape still being mapped.
// All properties are optional: sim helpers routinely receive partial settlements
// (mid-tick projections, snapshot slices), and optionality keeps direct callers
// from newly erroring on legitimately-absent fields.
//
// The threading target: replace `@param {any} settlement` in the sim layer with
// `@param {import('../settlement.schema.js').SimSettlement} settlement`.
//
/**
 * @typedef {{
 *   name?: string,
 *   tier?: string,
 *   id?: string,
 *   genre?: string,
 *   schema?: string,
 *   schemaVersion?: number,
 *   simulationVersion?: number,
 *   population?: number,
 *   economicViability?: any,
 *   thievesGuildStrength?: number,
 *   nearbyResourcesDepleted?: boolean|string[],
 *   factions?: SimFaction[],
 *   npcs?: SimNpc[],
 *   institutions?: SimInstitution[],
 *   stressors?: SimStressor[],
 *   supplyChains?: SimSupplyChain[],
 *   activeConditions?: any[],
 *   neighbours?: any[],
 *   neighbors?: any[],
 *   plotHooks?: any[],
 *   hooks?: any[],
 *   threats?: any[],
 *   eventLog?: any[],
 *   simulationTrace?: any[],
 *   aiOverlays?: any[],
 *   relationships?: any[],
 *   interSettlementRelationships?: any[],
 *   config?: Record<string, any>,
 *   _config?: Record<string, any>,
 *   culturalIdentity?: CulturalIdentity,
 *   culturalNotes?: string|null,
 *   isolationSupport?: IsolationSupportReceipt,
 *   generationCoherenceReceipt?: GenerationCoherenceReceipt,
 *   powerStructure?: SimPowerStructure,
 *   economicState?: SimEconomicState,
 *   systemState?: Record<string, any>,
 *   defenseProfile?: SimDefenseProfile,
 *   resourceAnalysis?: SimResourceAnalysis,
 *   resourceHistory?: Record<string, any>,
 *   history?: SimHistory,
 *   institutionHistory?: Record<string, any>,
 *   tierHistory?: any[],
 *   populationHistory?: any[],
 *   neighbourNetwork?: any,
 *   neighborNetwork?: any,
 *   power?: Record<string, any>,
 *   economy?: Record<string, any>,
 *   spatialLayout?: Record<string, any>,
 *   primaryDeity?: Record<string, any>
 * } & Record<string, any>} SimSettlement
 *
 * The current FLAT settlement shape consumed by the simulation layer. Loose by
 * design (see the block comment above): unlisted fields resolve to `any` via the
 * `& Record<string, any>` index signature, so this is safe to thread through hot
 * sim signatures without over-constraining. Tighten it field-by-field over time;
 * it is the threading target for the sim-layer typing paydown, and the flat-shape
 * counterpart to CanonicalSettlement's future nested shape.
 */

// ── Sim flat-shape SUB-typedefs (B1 paydown) ─────────────────────────────────
// Real sub-shapes for SimSettlement's array + nested-object buckets, replacing
// the former `any[]` / `Record<string, any>` placeholders. Each was built by
// grepping the ACTUAL field accesses across the sim (worldPulse/, timeProgression,
// events, mutateEntities) and generator layers, then typing only the scalars that
// are reliably one type and leaving everything else loose.
//
// SAME SAFE FORM AS SimSettlement: every sub-type is an object literal of listed
// fields INTERSECTED with `& Record<string, any>`. That trailing index signature
// is NON-NEGOTIABLE — it guarantees access to any UNLISTED field still resolves to
// `any`, so tightening these buckets surfaces ZERO new type errors and keeps the
// full-tree typecheck + strict ratchet green. Tighten field-by-field over time;
// never drop the `& Record<string, any>`. All properties optional (sim helpers
// receive partial entities: mid-tick projections, snapshot slices).

/**
 * @typedef {{
 *   id?: string,
 *   name?: string,
 *   role?: string,
 *   title?: string,
 *   category?: string,
 *   importance?: any,
 *   notability?: number,
 *   influence?: (string | number),
 *   power?: number,
 *   corrupt?: boolean,
 *   ousted?: boolean,
 *   timesExposed?: number,
 *   dots?: number,
 *   factionId?: string,
 *   factionLink?: string,
 *   factionAffiliation?: string,
 *   secondaryAffiliation?: string,
 *   institutionId?: string,
 *   organizationId?: string,
 *   settlementId?: string,
 *   structuralPosition?: string,
 *   structuralRank?: (string | number),
 *   secret?: any,
 *   goal?: any,
 *   whereabouts?: { state?: string, placeId?: string, purposeKind?: string, sinceTick?: number, expectedReturnTick?: number|null, missionId?: string },
 *   personality?: any,
 *   physical?: any,
 *   presentation?: any,
 *   corruptTies?: any,
 *   corruptionVector?: any,
 *   plotHooks?: any[],
 *   linkedFactionIds?: any[],
 *   linkedInstitutionIds?: any[]
 * } & Record<string, any>} SimNpc
 *
 * CURRENT flat shape of an NPC as the sim + generator layers read it. Loose by
 * design (& Record<string, any>) pending full enumeration. `influence` and
 * `structuralRank` are unioned (string|number) because both forms appear across
 * legacy generator output. Nested prose/pointer fields (secret, goal, personality,
 * corruptTies …) stay loose until their own sub-shapes are enumerated.
 */

/**
 * @typedef {{
 *   id?: string,
 *   name?: string,
 *   faction?: string,
 *   label?: string,
 *   desc?: string,
 *   category?: string,
 *   archetype?: string,
 *   power?: number,
 *   weight?: number,
 *   score?: number,
 *   influence?: any,
 *   legitimacy?: number,
 *   isGoverning?: boolean,
 *   governmentPreference?: string,
 *   momentumBand?: string,
 *   controlStrength?: number,
 *   settlementId?: string,
 *   modifiers?: any,
 *   captureState?: any,
 *   internalSeats?: any,
 *   rivals?: any[],
 *   suppressedInstitutions?: any[],
 *   controlsInstitutionIds?: any[],
 *   controlledInstitutions?: any[]
 * } & Record<string, any>} SimFaction
 *
 * CURRENT flat shape of a faction as the sim + generator layers read it. Loose by
 * design (& Record<string, any>) pending full enumeration. `faction` is the legacy
 * NAME string (the generator's `{ faction, power, desc }` shape); `power` is the
 * numeric power score. `influence` is unioned (string|number) — legacy output uses
 * both. Nested structural fields (modifiers, captureState, internalSeats …) stay
 * loose until enumerated.
 */

/**
 * @typedef {{
 *   id?: string,
 *   name?: string,
 *   category?: string,
 *   status?: (string | Object),
 *   source?: string,
 *   desc?: string,
 *   tags?: any[],
 *   impairments?: any[],
 *   required?: any,
 *   exclusiveGroup?: (string | any[]),
 *   produces?: any,
 *   hasGarrison?: boolean,
 *   hasWatch?: boolean,
 *   hasMilitia?: boolean,
 *   hasWalls?: boolean,
 *   hasPrison?: boolean,
 *   hasChurch?: boolean,
 *   hasMercenary?: boolean,
 *   hasCharterHall?: boolean,
 *   hasCourtSystem?: boolean,
 *   hasMagicInst?: boolean
 * } & Record<string, any>} SimInstitution
 *
 * CURRENT flat shape of an institution as the sim + generator layers read it. Loose
 * by design (& Record<string, any>) pending full enumeration. `status` is unioned
 * (string|Object) — the schema's Institution typedef documents an object status but
 * the sim reads it as a string band in places. The `has*` booleans are capability
 * flags the power/defense generators set. `exclusiveGroup` appears as both a string
 * and an array across call sites.
 */

/**
 * @typedef {{
 *   id?: string,
 *   type?: string,
 *   name?: string,
 *   label?: string,
 *   severity?: number,
 *   peakSeverity?: number,
 *   status?: string,
 *   lifecycleStage?: string,
 *   age?: number,
 *   createdAt?: (string | number),
 *   updatedAt?: (string | number),
 *   resolvedAt?: (string | number),
 *   originSettlementId?: string,
 *   originRegion?: string,
 *   decayRate?: number,
 *   memoryStrength?: number,
 *   resolutionReason?: string,
 *   resolutionChance?: number,
 *   resolutionRoll?: number,
 *   durationPolicy?: any,
 *   originContext?: any,
 *   resolutionContext?: any,
 *   affectedSettlementIds?: any[],
 *   spreadChannels?: any[],
 *   residualEffects?: any[],
 *   severityBySettlement?: Record<string, any>,
 *   synergy?: any,
 *   counterforce?: any
 * } & Record<string, any>} SimStressor
 *
 * CURRENT flat shape of a world-pulse stressor as the sim layer reads it. Loose by
 * design (& Record<string, any>) pending full enumeration. `severity`/`peakSeverity`
 * are 0..1 numbers; `age` is a numeric tick count; timestamps are unioned
 * (string|number) since both epoch-ms and ISO forms appear. Structured sub-objects
 * (durationPolicy, originContext, synergy …) stay loose until enumerated.
 */

/**
 * @typedef {{
 *   id?: string,
 *   chainId?: string,
 *   name?: string,
 *   label?: string,
 *   needKey?: string,
 *   status?: string,
 *   controller?: string,
 *   resource?: string,
 *   rawResource?: string,
 *   resourceKey?: string|null,
 *   resourceCondition?: 'available'|'depleted'|'absent',
 *   resourceInputKey?: string|null,
 *   resourceInputCondition?: 'available'|'depleted'|'absent',
 *   resourceInputAvailable?: boolean,
 *   entrepot?: boolean,
 *   exportable?: boolean,
 *   resourceDepleted?: boolean,
 *   substituteActive?: boolean,
 *   upstreamMissing?: boolean,
 *   upstreamWeak?: boolean,
 *   upstreamNote?: string,
 *   magicNote?: string,
 *   magicRecovery?: any,
 *   activatedByResource?: any,
 *   failureConsequences?: string,
 *   dependency?: any,
 *   dependencies?: any[],
 *   substitutes?: any[],
 *   victims?: any[],
 *   services?: any[],
 *   outputs?: any[],
 *   intermediateGoods?: any[],
 *   upstreamChains?: any[],
 *   processingInstitutions?: any[]
 * } & Record<string, any>} SimSupplyChain
 *
 * CURRENT flat shape of an active supply chain (economicState.activeChains /
 * settlement.supplyChains) as the sim + generator layers read it via the `chain.`
 * accessor. Loose by design (& Record<string, any>) pending full enumeration.
 * `status` is a string band ('running' | 'operational' | 'vulnerable' | 'impaired'
 * | 'stable' …); the boolean flags gate resource/substitution logic. Structured
 * sub-objects and dependency lists stay loose until enumerated.
 */

/**
 * @typedef {{
 *   prosperity?: any,
 *   foodSecurity?: Record<string, any>,
 *   economicComplexity?: (string | number),
 *   isEntrepot?: boolean,
 *   situationDesc?: string,
 *   tradeCommodity?: string,
 *   safetyProfile?: any,
 *   transit?: any,
 *   compound?: any,
 *   primaryExports?: any[],
 *   primaryImports?: any[],
 *   exports?: any[],
 *   incomeSources?: any[],
 *   tradeLinks?: any[],
 *   activeChains?: SimSupplyChain[],
 *   customChains?: any[],
 *   customTradeLabels?: Record<string, any>,
 *   nativeTradeLabels?: Record<string, string[]>,
 *   customTradeEndpoints?: Record<string, Array<Record<string, unknown>>>,
 *   customCategoryExports?: any,
 *   customCategoryImports?: any
 * } & Record<string, any>} SimEconomicState
 *
 * CURRENT flat shape of settlement.economicState as the sim + generator layers read
 * it. Loose by design (& Record<string, any>) pending full enumeration.
 * `foodSecurity` is a NESTED OBJECT (storageMonths / resilienceScore / deficitPct …
 * per domain/fieldManifest.js), NOT a scalar — kept as Record<string, any>.
 * `prosperity` / `economicComplexity` are unioned (string|number): they appear as
 * both qualitative bands and numeric scores. `activeChains` reuses SimSupplyChain.
 */

/**
 * @typedef {{
 *   factions?: SimFaction[],
 *   government?: (string | Object),
 *   governingName?: string,
 *   publicLegitimacy?: any,
 *   stability?: (string | number),
 *   conflicts?: any[],
 *   previousGovernments?: any[],
 *   plotHooks?: any[],
 *   criminalCaptureState?: any
 * } & Record<string, any>} SimPowerStructure
 *
 * CURRENT flat shape of settlement.powerStructure as the sim + generator layers read
 * it. Loose by design (& Record<string, any>) pending full enumeration. `factions`
 * reuses SimFaction. `government` is unioned (string|Object) — the generator writes a
 * government-type STRING in places and a richer object elsewhere. `stability` appears
 * as both a band string and a number. (NB: the `powerStructure.includes(...)` /
 * `.toLowerCase()` grep hits are a LOCAL government-type string variable in
 * powerGenerator.js, not this settlement sub-object — deliberately not modeled here.)
 */

/**
 * @typedef {{
 *   scores?: Record<string, any>,
 *   readiness?: any,
 *   economicGates?: any,
 *   institutions?: any,
 *   threats?: any[],
 *   plotHooks?: any[]
 * } & Record<string, any>} SimDefenseProfile
 *
 * CURRENT flat shape of settlement.defenseProfile as the sim + generator layers read
 * it. Loose by design (& Record<string, any>) pending full enumeration. `scores` is
 * a per-dimension numeric MAP (object), not a scalar. `readiness` is unioned
 * (string|number) — a band label or a numeric score depending on the surface.
 */

/**
 * @typedef {{
 *   terrain?: (string | Object),
 *   issues?: any[],
 *   warnings?: any[],
 *   suggestions?: any[]
 * } & Record<string, any>} SimResourceAnalysis
 *
 * CURRENT flat shape of settlement.resourceAnalysis as the sim + generator layers
 * read it. Loose by design (& Record<string, any>) pending full enumeration. Very
 * few fields are accessed today; `terrain` is unioned (string|Object) since it is
 * read both as a bare label and as a structured terrain descriptor.
 */

/**
 * @typedef {{
 *   founding?: any,
 *   age?: (string | number),
 *   historicalEvents?: any[],
 *   events?: any[],
 *   eventsTimeline?: any[],
 *   currentTensions?: any[],
 *   legacyAnnotations?: any[],
 *   recentDisruption?: any,
 *   unresolvedWound?: any,
 *   historicalCharacter?: any,
 *   siegeNarrative?: any
 * } & Record<string, any>} SimHistory
 *
 * CURRENT flat shape of settlement.history (the OBJECT form — sim code reads it as
 * `settlement.history || {}`) as the sim + generator layers read it. Loose by design
 * (& Record<string, any>) pending full enumeration. `age` is unioned (string|number).
 * NB: the array-like `history.length` / `.slice` grep hits belong to a DIFFERENT
 * per-relationship history array in worldPulse/, not this settlement sub-object.

/**
 * @typedef {Object} SettlementIdentity
 * @property {string} name
 * @property {Tier}   tier
 * @property {string[]} [tags]
 * @property {string} [genre]       'low_magic' | 'grimdark' | 'heroic' | etc.
 * @property {string} [magicLevel]  'none' | 'low' | 'moderate' | 'high'
 */

/** @typedef {'thorp' | 'hamlet' | 'village' | 'town' | 'city' | 'metropolis' | 'capital'} Tier */

/**
 * @typedef {Object} Institution
 * @property {string}   [id]      Stable id (e.g. "institution.town_watch"). Optional today; required after entity-registry migration.
 * @property {string}   name
 * @property {string}   [category] 'Government' | 'Religion' | 'Trade' | etc.
 * @property {string[]} [tags]    'civic' | 'security' | 'law' | 'religious' | 'economic' | etc.
 * @property {string}   [desc]
 * @property {Object}   [status]  'active' | 'impaired' | 'collapsed'
 * @property {Array<{ type?: string, [key: string]: unknown }>} [impairments]  Impairment records written by domain/corruption.js (InstitutionLike); also present on older saves that carried them inline.
 */

/**
 * @typedef {Object} Service
 * @property {string} [id]
 * @property {string} name
 * @property {string[]} [tags]
 */

/**
 * @typedef {Object} ResourceEntry
 * @property {string} [id]
 * @property {string} name
 * @property {string[]} [tags]
 * @property {'produced' | 'imported' | 'scarce' | 'blocked'} [flow]
 */

/**
 * @typedef {Object} StressorEntry
 * @property {string} [id]
 * @property {string} name
 * @property {number} [severity]
 * @property {string} [label]
 */

/**
 * @typedef {'low' | 'medium' | 'high' | 'critical'} ConditionSeverityBand
 *
 * Qualitative banding derived from the numeric severity score. Computed
 * by domain/activeConditions.js#severityBand; consumers should rely on
 * the band rather than the raw 0..1 number for display.
 */

/**
 * @typedef {'worsening' | 'stable' | 'easing'} ConditionStatus
 *
 * Trajectory hint for a condition. 'worsening' means the next tick
 * tends to compound effects; 'easing' means the condition is on its
 * way out; 'stable' is the no-information default.
 */

/**
 * @typedef {Object} ConditionTrigger
 *
 * Provenance for an active condition — where did it come from?
 *
 * @property {number}        tick                  Tick index at which the condition was added (0 for world creation).
 * @property {string | null} sourceEventType       e.g. 'PLAGUE_OUTBREAK', or null when generator-stamped.
 * @property {string | null} sourceEventTargetId   Stable id of the entity that triggered the condition.
 */

/**
 * @typedef {Object} ConditionDuration
 *
 * Time accounting for an active condition. Both fields are
 * interval-scale-weighted: a per-week tick advances elapsedTicks by
 * 0.25, a per-month tick by 1.0, a per-year tick by 6.0 — matching
 * the Phase 15 INTERVAL_SCALES.
 *
 * @property {number}        elapsedTicks      Cumulative scale-weighted advancement.
 * @property {number | null} expiresAtTicks    Threshold past which the condition expires; null = persists indefinitely.
 */

/**
 * @typedef {Object} ActiveCondition
 *
 * Tier 2.3 canonical shape. The set of these on a settlement is the
 * authoritative description of "what's going wrong right now."
 * Stored at settlement.activeConditions[]. Enriched (defaults applied,
 * band recomputed) by domain/activeConditions.js#deriveActiveCondition;
 * read by Phase 15 advanceTime when no external override is passed.
 *
 * @property {string}                  id               Stable id 'condition.<archetype>.<suffix>'.
 * @property {string}                  archetype        Matches factionRelationshipUpdate vocabulary.
 * @property {string}                  label            Display label.
 * @property {string}                  description      Single-line prose.
 * @property {number}                  severity         0..1 numeric (computation surface).
 * @property {ConditionSeverityBand}   severityBand     Derived band for display.
 * @property {ConditionStatus}         status           Trajectory.
 * @property {ConditionTrigger}        triggeredAt      Provenance.
 * @property {ConditionDuration}       duration         Time accounting.
 * @property {string[]}                affectedSystems  Subsystem labels this condition feeds into.
 * @property {Object[]}                causes           Optional structured causal pointers.
 */

/**
 * @typedef {Object} SupplyChain
 * @property {string} [id]
 * @property {string} name
 * @property {SupplyChainStatus} [status]
 * @property {string} [controller]
 * @property {string[]} [dependencies]
 *
 * Legacy compatibility note: today's generator produces chain entries
 * with shape `{ needKey, chainId, label, processingInstitutions, status:
 * 'operational' | 'running' | 'entrepot' | 'vulnerable' | 'impaired', … }`.
 * The Tier 4.3 stateful shape (SupplyChainState) is derived from this
 * on demand via domain/supplyChainState.js#deriveSupplyChainState.
 */

/**
 * @typedef {Object} SupplyChainState
 * Tier 4.3 structured shape. Returned by deriveSupplyChainState().
 *
 * @property {string}             id              Stable id ('chain.<need>.<inner>').
 * @property {string}             name
 * @property {string}             [needKey]
 * @property {string}             [needLabel]
 * @property {SupplyChainStatus}  status          Canonical state.
 * @property {string}             [legacyStatus]  Legacy value preserved for old consumers.
 * @property {string}             controller      Faction / institution that takes a rent.
 * @property {string[]}           dependencies    'resource: X', 'upstream: Y', 'processor: Z'.
 * @property {string[]}           substitutes
 * @property {string[]}           beneficiaries
 * @property {string[]}           victims
 * @property {string}             failureConsequences  Single-line consequence prose.
 */

/**
 * @typedef {'stable' | 'strained' | 'scarce' | 'blocked'
 *          | 'captured' | 'substituted' | 'collapsing'} SupplyChainStatus
 */

/**
 * @typedef {Object} Faction
 * @property {string} [id]
 * @property {string} name
 * @property {string} [archetype]
 * @property {number} [power]
 * @property {number} [legitimacy]
 *
 * Legacy compatibility note: today's generator produces factions with
 * shape `{ faction, power, desc }`. The Tier 4.1 enriched profile
 * (FactionProfile below) is derived from this on demand via
 * domain/factionProfile.js#deriveFactionProfile. When the generator
 * eventually produces structured profiles directly, the derivation
 * becomes an identity pass for already-structured input.
 */

/**
 * @typedef {Object} FactionProfile
 * Tier 4.1 structured shape. Returned by deriveFactionProfile().
 *
 * @property {string}            id         Stable id ('faction.<snake_name>').
 * @property {string}            name
 * @property {FactionArchetype}  archetype  Inferred from name patterns.
 * @property {number}            power      Numeric power score (legacy field).
 * @property {number}            legitimacy 0-100. Governing factions inherit the
 *                                          settlement's public legitimacy; non-
 *                                          governing factions default to 50.
 *                                          Tier 4.2 (event-driven updates) will
 *                                          adjust this per faction over time.
 * @property {FactionResources}  resources
 * @property {string[]}          wants
 * @property {string[]}          fears
 * @property {string[]}          leverage
 * @property {string[]}          vulnerabilities
 * @property {string}            [desc]     Preserved from legacy shape.
 */

/**
 * @typedef {'government' | 'military' | 'religious' | 'merchant' | 'craft'
 *          | 'criminal' | 'arcane' | 'occupation' | 'other'} FactionArchetype
 */

/**
 * @typedef {Object} FactionResources
 * Qualitative bands per the simulator roadmap §6. Real values are
 * 'low' | 'medium' | 'high'. Avoiding numbers here keeps the profile
 * legible for AI overlays and PDF authors without false precision.
 *
 * @property {'low'|'medium'|'high'} wealth
 * @property {'low'|'medium'|'high'} manpower
 * @property {'low'|'medium'|'high'} publicTrust
 * @property {'low'|'medium'|'high'} coerciveForce
 * @property {'low'|'medium'|'high'} informationAccess
 */

/**
 * @typedef {Object} NPC
 * @property {string} [id]
 * @property {string} name
 * @property {string} [role]
 * @property {string} [factionId]
 * @property {string} [institutionId]
 *
 * Legacy compatibility note: today's generator produces NPC entries
 * with shape `{ id, name, role, category, factionAffiliation,
 * structuralPosition, structuralRank, power, influence, personality,
 * physical, goal, secret, plotHooks, … }`. The Tier 4.5 structured
 * shape (NpcProfile below) is derived from this on demand via
 * domain/npcProfile.js#deriveNpcProfile.
 */

/**
 * @typedef {Object} NpcProfile
 * Tier 4.5 structured shape. Returned by deriveNpcProfile().
 *
 * @property {string}        id                   Stable id ('npc_N' or 'npc.<snake>').
 * @property {string}        name
 * @property {string|null}   role
 * @property {string|null}   category             Legacy category field.
 * @property {FactionArchetype} archetype         Inferred via CATEGORY_TO_ARCHETYPE.
 * @property {NpcRank}       rank                 'dominant' | 'secondary' | 'minor'.
 * @property {number|null}   power
 * @property {string|null}   influence
 * @property {string|null}   institutionLink      Stable id of the linked institution.
 * @property {string|null}   factionLink          Stable id of the linked faction.
 * @property {string|null}   publicReputation     What the town knows of them.
 * @property {string|null}   privateAgenda        The NPC's long-term goal.
 * @property {boolean|null}  corrupt              Tri-state: false is a generation verdict, null a legacy save the corruption pass never judged.
 * @property {string|null}   corruptionVector     How they are compromised (corruptionPass.js mirror).
 * @property {number}        timesExposed         How many times their corruption has been surfaced.
 * @property {boolean}       ousted               Whether they have been removed from their seat.
 * @property {({ causeClass: string, family: string, stage: string, situation: string, role: string, originTick: number|null, resolvedTick: number|null, historicizedTick: number|null, exposedTick: number|null, ageBand: string|null })|null} [compromiseLifecycle]  W-C5 cause-resolution lifecycle RAW stamp (attributed cause + stage + situation + tick stamps + age band; the conjunction key W2 keys off). Null unless the world pulse touched this compromise; the lazy dossier card runs it through the generic content floor.
 * @property {string[]}      leverage             What they control.
 * @property {string[]}      vulnerabilities      What hangs over their head.
 * @property {string[]}      offerToPlayers       Hooks the players can engage with.
 * @property {string|null}   wantsFromPlayers     What the NPC needs.
 * @property {RemovalConsequence}     consequenceIfRemoved
 * @property {NpcRelationship|null}   primaryRelationship
 */

/**
 * @typedef {'dominant' | 'secondary' | 'minor'} NpcRank
 */

/**
 * @typedef {Object} RemovalConsequence
 * Tier 4.5 forecast of what happens when the NPC is removed from play.
 *
 * @property {NpcRank}  severity     Mirrors the NPC's structural rank.
 * @property {string[]} consequences Single-line consequence prose,
 *                                   ordered most-to-least immediate.
 */

/**
 * @typedef {Object} NpcRelationship
 * One primary relationship surfaced from settlement.relationships. V1
 * shape; full triangle support is a follow-up.
 *
 * @property {string}      otherId
 * @property {string}      otherName
 * @property {string}      type
 * @property {string|null} typeName
 * @property {string|null} description
 * @property {string|null} tension
 */

/**
 * @typedef {Object} FactionRelationshipUpdate
 * Tier 4.2 structured delta describing a single proposed change to a
 * single faction's structural metric, attributed to a specific event.
 *
 * Produced by recalculateFactionRelationships(). Pure data — the
 * domain layer never applies these deltas itself; downstream consumers
 * (event-apply layer, time progression, AI overlay) decide whether to
 * commit, preview, or render them.
 *
 * @property {string}              factionId        Stable id ('faction.<snake>').
 * @property {string}              factionName
 * @property {FactionArchetype}    archetype
 * @property {FactionUpdateField}  field            Which metric changes.
 * @property {number}              delta            Signed numeric change.
 * @property {string}              reason           Single-line causal prose.
 * @property {string}              eventType        Event type that produced this delta.
 * @property {string|null}        [eventTargetId]   Optional target id from the event.
 */

/**
 * @typedef {'power' | 'legitimacy' | 'wealth'
 *          | 'publicTrust' | 'manpower'} FactionUpdateField
 */

/**
 * @typedef {'one_week' | 'one_month' | 'one_season' | 'one_year'} TickInterval
 *
 * Time-progression intervals. Per Phase 15's intensity scale:
 *   one_week:   0.25× scale
 *   one_month:  1.00×  (baseline)
 *   one_season: 2.25×  (sub-linear vs 3 months due to diminishing returns)
 *   one_year:   6.00×  (sub-linear vs 12 months)
 */

/**
 * @typedef {Object} ClockAdvancement
 * @property {string}      clockId
 * @property {string}      label
 * @property {number}      previousStage
 * @property {number}      stage             New stage after the tick.
 * @property {number}      totalStages
 * @property {string|null} stageDescription
 * @property {boolean}     completed         True when stage >= totalStages.
 * @property {string}      triggerDescription
 */

/**
 * @typedef {Object} ClockResolution
 * Emitted when a previously-active clock is no longer triggered
 * (e.g. a strained supply chain recovered to stable).
 *
 * @property {string}  clockId
 * @property {number}  previousStage
 * @property {boolean} resolved
 */

/**
 * @typedef {Object} TimeProgressionTick
 * Structured payload describing one advanceTime() call.
 *
 * @property {TickInterval}                interval
 * @property {string[]}                    appliedConditions
 * @property {FactionRelationshipUpdate[]} factionDeltas
 * @property {Object}                      factionSummary      Aggregated per-faction.
 * @property {ClockAdvancement[]}          clockAdvancements
 * @property {ClockResolution[]}           clockResolutions
 * @property {ActiveCondition[]}           [conditionsExpired] Conditions that crossed expiresAtTicks this tick.
 * @property {ActiveCondition[]}           [activeConditions]  Live conditions after expiry + aging.
 * @property {string[]}                    summary             Human-readable lines.
 */

/**
 * @typedef {Object} TickState
 * The opaque state passed between consecutive advanceTime() calls so
 * clocks know where they left off.
 *
 * @property {Object<string, number>} clockStages   clockId → stage number.
 */

/**
 * @typedef {Object} Threat
 * @property {string} [id]
 * @property {string} name
 * @property {string} [type]
 * @property {string} [trajectory]
 */

/**
 * @typedef {'monster_pressure' | 'bandit_raids' | 'siege'
 *          | 'rival_neighbor' | 'plague' | 'famine'
 *          | 'corruption' | 'unrest' | 'arcane_instability'
 *          | 'cult' | 'economic_collapse' | 'other'} ThreatType
 *
 * Tier 4.6 canonical threat type vocabulary. Inferred from existing
 * settlement surfaces (config.monsterThreat, defenseProfile.scores,
 * stressors, neighbours, active conditions) by domain/threatProfile.js.
 */

/**
 * @typedef {'latent' | 'developing' | 'active' | 'imminent' | 'realized'} ThreatStage
 *
 * Trajectory stages a threat moves through as it materializes. Derived
 * from severity by domain/threatProfile.js#severityToStage.
 */

/**
 * @typedef {'open' | 'rumored' | 'hidden'} ThreatVisibility
 *
 * Whether the threat is publicly known, only rumored, or actively
 * concealed (cults, hidden cabals).
 */

/**
 * @typedef {Object} ThreatProfile
 *
 * Tier 4.6 canonical threat shape. The set of these on a settlement
 * is the authoritative read of "what does this settlement fear?"
 * Derived from existing surfaces by domain/threatProfile.js, NOT
 * stored on the settlement directly (yet) — Tier 4.16 (custom user
 * content as causal objects) will let users add structured threats.
 *
 * @property {string}          id                Stable id 'threat.<type>.<suffix>'.
 * @property {ThreatType}      type
 * @property {string}          label
 * @property {string}          description
 * @property {string}          source            Where the threat comes from.
 * @property {string}          target            What is threatened.
 * @property {string}          vector            How the threat materializes.
 * @property {ThreatVisibility} visibility
 * @property {number}          severity          0..1 numeric.
 * @property {ConditionSeverityBand} severityBand
 * @property {'worsening'|'stable'|'easing'} trajectory
 * @property {ThreatStage}     currentStage      Derived from severity.
 * @property {string[]}        beneficiaries     Who benefits if the threat continues.
 * @property {string[]}        victims           Who suffers.
 * @property {SystemVariableName[]} affectedSystems  Phase 17 variables this threat presses on.
 * @property {string}          originSurface     'config' | 'defenseProfile' | 'stressors' | 'neighbours' | 'activeConditions' | 'threats'
 */

/**
 * @typedef {Object} Hook
 * @property {string} [id]
 * @property {string} text
 * @property {Object} [origin]
 *
 * Legacy compatibility note: today's generator output produces hooks
 * with mixed shapes (bare strings on history events, `{ category, hook,
 * severity }` on economic viability, etc.). The Tier 4.10 structured
 * shape (StructuredHook below) is derived from any of these via
 * domain/hookEscalation.js#deriveStructuredHook.
 */

/**
 * @typedef {Object} StructuredHook
 * Tier 4.10 structured shape. Returned by deriveStructuredHook().
 *
 * @property {string}      id          Stable id: 'hook.<snake_first_40_chars>'.
 * @property {string}      text        Single-line hook prose.
 * @property {HookOrigin}  origin      Classifier output.
 * @property {string}      severity    'low' | 'medium' | 'high' | 'critical'.
 * @property {string}      category    Either the generator's category
 *                                     or the inferred origin.
 * @property {string}      source      Where the hook came from on the
 *                                     settlement: 'economic' | 'history'
 *                                     | 'defense' | 'power' | 'aggregate'.
 * @property {string|null} [eventName] For history-event hooks.
 * @property {string[]}    ifIgnored
 * @property {string[]}    possibleResolutions
 */

/**
 * @typedef {'pressure' | 'factionConflict' | 'institution' | 'npc'
 *          | 'chain' | 'external' | 'other'} HookOrigin
 */

/**
 * @typedef {Object} HistoryBeat
 * Tier 4.7 structured shape. One slot in a HistoryBeats object.
 *
 * @property {string}             key         Canonical slot identifier
 *                                            (e.g. 'foundingCause').
 * @property {string}             label       Human-readable label
 *                                            (e.g. 'Founding cause').
 * @property {string}             text        Single-line causal prose.
 * @property {string}             source      Dotted path the data was
 *                                            sourced from (e.g.
 *                                            'history.historicalEvents').
 * @property {Object} [references]            Optional structured pointers
 *                                            (eventName, yearsAgo, etc.).
 */

/**
 * @typedef {Object} HistoryBeats
 * Tier 4.7 set of seven causal beats. Any beat may be null on a
 * settlement that lacks the source data; consumers must guard.
 *
 * @property {HistoryBeat | null} foundingCause
 * @property {HistoryBeat | null} firstProsperitySource
 * @property {HistoryBeat | null} definingCrisis
 * @property {HistoryBeat | null} institutionalLegacy
 * @property {HistoryBeat | null} recentDisruption
 * @property {HistoryBeat | null} unresolvedWound
 * @property {HistoryBeat | null} likelyFuture
 */

/**
 * @typedef {Object} EscalationClock
 * Tier 4.10 escalation trajectory. Returned by deriveEscalationClocks().
 *
 * @property {string}   id                  Stable id ('clock.<type>.<trigger>').
 * @property {string}   label               Display label (e.g. 'Bread Riot Clock').
 * @property {string}   triggerDescription  Why this clock is active.
 * @property {string}   triggerTargetId     Stable id of the entity that triggered it.
 * @property {string}   triggerSource       'supply_chain' | 'faction' | 'faction_pair'.
 * @property {string}   triggerStatus       Snapshot of the trigger's state.
 * @property {string[]} stages              Templated narrative stages (6 by default).
 */

/**
 * @typedef {Object} Neighbor
 * @property {string} [id]
 * @property {string} name
 * @property {string} [relationshipType]
 */

/**
 * @typedef {Object} TraceEntry
 * @property {string}  targetType
 * @property {string}  targetId
 * @property {string}  result
 * @property {Array<{source: string, effect: string, reason: string}>} [causes]
 * @property {Array<{target: string, effect: string}>} [downstreamEffects]
 */

/**
 * @typedef {'food_security' | 'labor_capacity' | 'public_legitimacy'
 *          | 'ruling_authority' | 'faction_power' | 'trade_connectivity'
 *          | 'healing_capacity' | 'defense_readiness' | 'criminal_opportunity'
 *          | 'religious_authority' | 'housing_pressure' | 'infrastructure_condition'
 *          | 'magical_stability' | 'social_trust'} SystemVariableName
 *
 * Tier 2.4 canonical substrate variable names. Every subsystem (events,
 * conditions, institutions, factions, supply chains, AI) reads from
 * the same 14-variable map produced by domain/causalState.js.
 */

/**
 * @typedef {'surplus' | 'adequate' | 'strained' | 'critical' | 'collapsed'} CausalBand
 *
 * The canonical 5-band vocabulary for substrate variables. Per Tier 5.4
 * this is the qualitative banding consumers should display in lieu of
 * raw numeric scores. Boundaries: ≥75 surplus, ≥55 adequate, ≥35
 * strained, ≥15 critical, else collapsed.
 */

/**
 * @typedef {Object} CausalContributor
 *
 * A single input that contributed to a variable's score. The list of
 * these on a SystemVariable is the trace of exactly how the score
 * was reached.
 *
 * @property {string} source   Stable id of the input ('chain.<id>',
 *                             'condition.<id>', 'faction.<id>', etc.).
 * @property {string} effect   Short tag describing the input's character.
 * @property {number} delta    Signed integer added to the variable's score.
 * @property {string} reason   Human-readable explanation.
 */

/**
 * @typedef {Object} SystemVariable
 *
 * One entry in the causal substrate. Score is the internal numeric
 * representation; band is the user-facing qualitative tag.
 *
 * @property {SystemVariableName} variable
 * @property {number}             score          0-100 clamped.
 * @property {CausalBand}         band
 * @property {CausalContributor[]} contributors
 */

/**
 * @typedef {Object} CausalState
 *
 * Tier 2.4 canonical substrate envelope. Produced by
 * domain/causalState.js#deriveCausalState. Read by every downstream
 * consumer that wants to know "what's going on with food / authority /
 * defense / etc."
 *
 * @property {Object<SystemVariableName, SystemVariable>} variables
 * @property {Object<SystemVariableName, CausalBand>}     bands
 * @property {Object<SystemVariableName, number>}         scores
 * @property {Object<CausalBand, SystemVariableName[]>}   summary    Variables grouped by band.
 */

/**
 * @typedef {'labor' | 'healing' | 'defense' | 'administrative'
 *          | 'food_production' | 'transport' | 'religious_welfare'
 *          | 'craft' | 'magical'} CapacityName
 *
 * Tier 4.4 canonical capacity vocabulary. Each capacity has a
 * supply-vs-demand model derived by domain/capacityModel.js. The 9
 * capacities cover the major operational pressures a settlement
 * tracks: who works, who heals, who fights, who governs, who feeds
 * everyone, who moves goods, who provides relief, who makes things,
 * and who controls arcane.
 */

/**
 * @typedef {Object} CapacityContributor
 *
 * A single supply-side or demand-side input on a capacity profile.
 * Same shape as the Phase 17 substrate contributor — { source,
 * effect, delta, reason } — but kept separate because the polarity
 * (supply vs demand) matters at the layer above.
 *
 * @property {string} source
 * @property {string} effect
 * @property {number} delta
 * @property {string} reason
 */

/**
 * @typedef {Object} CapacityProfile
 *
 * Tier 4.4 canonical capacity shape. Returned by
 * domain/capacityModel.js#deriveCapacityProfile. Composes Phase 16
 * conditions, Phase 17 substrate, Phase 20 threats.
 *
 * @property {CapacityName}            capacity
 * @property {string}                  label
 * @property {number}                  supply          0..100.
 * @property {number}                  demand          0..100.
 * @property {number}                  ratio           supply / demand (0 for an 'absent' capacity).
 * @property {CausalBand | 'absent'}   band            Derived from ratio; 'absent' = the capacity
 *                                                     does not exist in this world (dead-magic).
 * @property {CapacityContributor[]}   supplyContributors
 * @property {CapacityContributor[]}   demandContributors
 * @property {'improving' | 'stable' | 'worsening'} trajectory
 */

/**
 * @typedef {Object} AiGroundingPayload
 *
 * Tier 6.1 structured AI prompt-grounding envelope produced by
 * domain/aiGrounding.js#buildAiGroundingPayload. Composes every
 * Tier 2-5 derivation into a single shape the prompt assembler
 * stringifies into the dossier section of the AI call.
 *
 * @property {Object} identity            id / name / tier / seed / versions / canon breakdown.
 * @property {Object} spine               7-line SimulationSpine.
 * @property {{substrate: Object, capacities: Object}} bands  Phase 17 + Phase 21 band maps.
 * @property {Object|null} magic           Tier 4.8 magic facets (magicExists, availability/legality/cost/risk + role bands); null only on the no-settlement envelope.
 * @property {Array<{kind: string, entityIndex: number, label: string, path: string, value: string, editedAt: string|null}>} userEdits  Tier 6.6 — verbatim user-authored prose the AI must preserve.
 * @property {FactionProfile[]} factions  Phase 9.
 * @property {SupplyChainState[]} chains  Phase 10.
 * @property {ActiveCondition[]} conditions  Phase 16.
 * @property {ThreatProfile[]} threats    Phase 20.
 * @property {NpcProfile[]} npcs          Phase 13 (dominant rank by default).
 * @property {HistoryBeats} history       Phase 12 (7 canonical beats).
 * @property {StructuredHook[]} hooks     Phase 11 (top N by severity).
 * @property {Contradiction[]} contradictions  Phase 25.
 * @property {DailyLifeEnvelope} dailyLife  Phase 22 (8 slots).
 * @property {DistrictProfile[]} districts  Phase 29.
 * @property {RegionalGraph} region       Phase 30.
 * @property {Object|null} relationshipMemory  Sanitized world-pulse relationship-memory context (background regional posture for Daily Life); null when no context is threaded.
 * @property {Object} constraints         { forbidden[], lockedEntities[], userDirection }.
 */

/**
 * @typedef {Object} UserEdit
 *
 * Tier 5.4 single-field user edit record. Lives on the entity as
 * `entity._userEdits[path] = UserEdit`. Produced and consumed by
 * domain/userEdits.js.
 *
 * @property {string} value          The user-authored value currently in the field.
 * @property {*}      originalValue  The pre-edit value captured on the FIRST edit. Reverting restores this.
 * @property {string} editedAt       ISO-8601 timestamp of the most recent edit.
 */

/**
 * @typedef {'npc' | 'faction' | 'institution' | 'hook' | 'historicalEvent' | 'currentTension' | 'settlement'} UserEditableEntityType
 *
 * Tier 5.4 closed vocabulary of entity types whose prose fields the
 * UI may expose for user editing. See domain/userEdits.js EDITABLE_FIELDS
 * for the per-type whitelist of dotted paths.
 */

/**
 * @typedef {Object<string, UserEdit>} UserEditsMap
 *
 * Tier 5.4 — the `_userEdits` blob attached to any user-edited entity.
 * Keys are dotted field paths (e.g. 'secret.what'), values are
 * UserEdit records.
 */

/**
 * @typedef {Object} UserEditWalkEntry
 *
 * Tier 5.4 — one tuple yielded by domain/userEdits.js#walkUserEdits.
 *
 * @property {UserEditableEntityType|string} kind  Singular entity type ('npc', 'faction', etc.).
 * @property {number} entityIndex                  Array index of the entity (or -1 for settlement root).
 * @property {Object} entity                       The entity carrying the edit.
 * @property {string} path                         Dotted path to the edited field.
 * @property {UserEdit} record                     The edit record itself.
 */

/**
 * @typedef {'invented_entity' | 'removed_entity' | 'renamed_entity' | 'changed_fact' | 'changed_canon' | 'removed_history_beat' | 'changed_user_field'} AiOverlayViolationKind
 *
 * Tier 6.4 — the closed set of contract violations the AI overlay
 * verifier can flag. See domain/aiOverlayVerifier.js for semantics.
 */

/**
 * @typedef {Object} AiOverlayViolation
 *
 * Tier 6.4 single-violation record. Produced by
 * domain/aiOverlayVerifier.js#verifyAiOverlay.
 *
 * @property {AiOverlayViolationKind} kind  Closed-vocabulary violation type.
 * @property {string} field                 Settlement path (e.g. 'powerStructure.factions').
 * @property {string} key                   Entity-key the violation is anchored on.
 * @property {string} label                 Human-visible name of the offending entity.
 * @property {string} detail                One-sentence description of the violation.
 * @property {string} [newLabel]            For rename violations, the offending new name.
 * @property {any}    [before]              For changed_fact / changed_canon, the prior value.
 * @property {any}    [after]               For changed_fact / changed_canon, the new value.
 */

/**
 * @typedef {Object} AiOverlayVerification
 *
 * Tier 6.4 verification report returned by
 * domain/aiOverlayVerifier.js#verifyAiOverlay.
 *
 * @property {boolean} ok                 false if any violations were found.
 * @property {AiOverlayViolation[]} violations  Detail per violation.
 * @property {{
 *   invented: number,
 *   removed: number,
 *   renamed: number,
 *   contradicted: number,
 *   canonChanged: number,
 *   historyDropped: number,
 * }} summary  Counts by kind for at-a-glance reporting.
 */

/**
 * @typedef {'nudge' | 'rebalance' | 'reforge'} RegenerationMode
 *
 * Tier 5.2 reactive regeneration modes. Nudge preserves most;
 * Rebalance preserves canon and recalcs affected subsystems;
 * Reforge keeps only hard anchors.
 */

/**
 * @typedef {Object} RegenerationPlan
 *
 * Tier 5.2 preservation plan produced by
 * domain/regenerationMode.js#buildRegenerationPlan.
 *
 * @property {RegenerationMode} mode
 * @property {Array<{id: string, type: string, label: string, reason: string}>} preserveEntities
 * @property {Array<{id: string, type: string, label: string, reason: string}>} rerollEntities
 * @property {string[]} preserveFields    Hard-anchor settlement fields.
 * @property {string[]} rerollSubsystems  Pipeline-step keys to recompute.
 * @property {Array<{source: string, effect: string, reason: string}>} contributors
 */

/**
 * @typedef {'generated' | 'user' | 'event' | 'ai_overlay'} CanonSource
 */

/**
 * @typedef {'draft' | 'canon' | 'optional' | 'superseded'} CanonStatus
 */

/**
 * @typedef {Object} CanonTag
 *
 * Tier 5.3 canon-boundary metadata produced by
 * domain/canonStatus.js#tagEntityCanon.
 *
 * @property {CanonSource} source
 * @property {CanonStatus} canonStatus
 * @property {boolean} locked       Survives an NPC reroll (user-pinned / event-committed).
 *                                  Other sections have no preservation tail yet.
 */

/**
 * @typedef {Object} RegenerationDelta
 *
 * Tier 5.1 structured diff between two settlement snapshots, produced
 * by domain/regenerationDelta.js#deriveRegenerationDelta.
 *
 * @property {Array<Object>} directEffects        Phase 7 SystemState delta.
 * @property {Array<Object>} rippleEffects        Phase 17 CausalState delta.
 * @property {Array<Object>} capacityShifts       Phase 21 capacity delta.
 * @property {Array<Object>} dailyLifeShifts      Phase 22 daily-life delta.
 * @property {Array<Object>} preservedCanon       Entities present in both snapshots.
 * @property {string[]}      brokenDependencies   IDs of removed entities.
 * @property {Array<Object>} newEntities          Entities only in `after`.
 * @property {Array<Object>} removedEntities      Entities only in `before`.
 * @property {Array<Object>} newOpportunities     newEntities filtered to hooks.
 * @property {Array<Object>} newRisks             newEntities filtered to threats/conditions/clocks.
 * @property {string[]}      summary              Human-readable lines.
 */

/**
 * @typedef {Object} MapProfile
 *
 * Tier 4.14 bidirectional map ↔ simulator interface produced by
 * domain/mapProfile.js#deriveMapProfile.
 *
 * @property {{terrain: string|null, biome: string|null, riverAccess: string|null,
 *             roadAccess: string|null, tradeRouteAccess: string|null,
 *             monsterThreat: string|null, region: string|null}} inputs
 * @property {{roadImportance: 'low'|'moderate'|'major'|'critical',
 *             defensiveTerrain: 'exposed'|'open'|'mixed'|'sheltered'|'fortified',
 *             regionalAuthority: Array<{id: string, name: string, relationshipType: string}>,
 *             hazardMarkers: Array<{id: string, label: string, kind: string, severity: number, severityBand: string, visibility: string}>,
 *             suggestedFeatures: Array<{feature: string, reason: string}>}} outputs
 * @property {Array<{source: string, effect: string, reason: string}>} contributors
 */

/**
 * @typedef {'supplier' | 'dependent' | 'rival' | 'protector'
 *          | 'tax_authority' | 'pilgrimage_center' | 'market_hub'
 *          | 'refugee_source' | 'military_threat' | 'smuggling_partner'
 *          | 'religious_superior' | 'resource_provider'
 *          | 'other'} RegionalRelationshipType
 *
 * Tier 4.13 canonical relationship vocabulary for the regional graph.
 */

/**
 * @typedef {Object} RegionalLink
 *
 * One directional link in the regional graph produced by
 * domain/regionalGraph.js.
 *
 * @property {string} from
 * @property {string} to
 * @property {string} toName
 * @property {RegionalRelationshipType} relationshipType
 * @property {number} severity                0..1.
 * @property {'incoming' | 'outgoing' | 'bidirectional'} direction
 * @property {string[]} propagationHints     How events propagate over this link.
 * @property {Array<{source: string, effect: string, reason: string}>} contributors
 */

/**
 * @typedef {Object} RegionalGraph
 *
 * Tier 4.13 envelope.
 *
 * @property {string | null} center
 * @property {Array<{id: string, name: string, role: 'center' | 'neighbour'}>} nodes
 * @property {RegionalLink[]} links
 */

/**
 * @typedef {Object} DistrictProfile
 *
 * Tier 4.9 structured district produced by
 * domain/districtProfile.js#deriveDistrictProfile.
 *
 * @property {string} id
 * @property {string} name
 * @property {string|null} origin
 * @property {string} category
 * @property {string} wealth      'destitute' | 'poor' | 'modest' | 'comfortable' | 'wealthy' | 'opulent'
 * @property {string} safety      'lawless' | 'unsafe' | 'watched' | 'orderly' | 'fortified'
 * @property {{id: string, name: string, archetype: string} | null} dominantFaction
 * @property {Array<{id: string, label: string}>} institutions
 * @property {string[]} services
 * @property {string} sensoryIdentity
 * @property {string} currentTension
 * @property {string} hook
 * @property {string[]} connectedDistricts
 * @property {Array<{source: string, effect: string, reason: string}>} contributors
 */

/**
 * @typedef {Object} CustomEntityClassification
 *
 * Tier 4.16 structured shape for user-added content. Produced by
 * domain/customContent.js#classifyCustomEntity. Lets user prose flow
 * through Phase 18's pipeline and the Tier 4 derivations like a
 * generated entity.
 *
 * @property {'institution'|'faction'|'npc'|'threat'|'hook'} type
 * @property {string} rawName
 * @property {string | null} inferredCategory
 * @property {string[]} provides
 * @property {string[]} requires
 * @property {string} controlledBy
 * @property {string[]} risks
 * @property {{substrate: Object<string, number>, capacities: Object<string, {supply?: number, demand?: number}>}} effects
 * @property {Array<{source: string, effect: string, reason: string}>} contributors
 */

/**
 * @typedef {'low_magic' | 'grimdark' | 'heroic' | 'weird' | 'cozy'
 *          | 'frontier' | 'gothic' | 'political' | 'sword_and_sorcery'
 *          | 'mythic_high'} CanonicalGenre
 *
 * Tier 4.15 canonical genre vocabulary. (Its domain/genreProfile.js
 * mapper was removed as dead code; see docs/DEAD_CODE_DISPOSITION.md.)
 */

/**
 * @typedef {Object} GenreProfile
 *
 * Tier 4.15 structured genre shape (formerly produced by the now-removed
 * domain/genreProfile.js#deriveGenreProfile; see docs/DEAD_CODE_DISPOSITION.md).
 *
 * @property {CanonicalGenre | null} genre
 * @property {string[]} institutionEmphasis
 * @property {string[]} threatTypeBias
 * @property {'amplify' | 'neutral' | 'dampen'} magicBias
 * @property {'minimal' | 'restrained' | 'frank' | 'brutal'} violenceLevel
 * @property {'low' | 'moderate' | 'high' | 'pervasive'} weirdnessTolerance
 * @property {'gentle' | 'classic' | 'noir' | 'gothic' | 'mythic' | 'absurd'} hookStyle
 * @property {'sparse' | 'standard' | 'lush'} proseDensity
 * @property {Array<{source: string, effect: string, reason: string}>} contributors
 */

/**
 * @typedef {Object} MagicProfile
 *
 * Tier 4.8 structured magic shape produced by
 * domain/magicProfile.js#deriveMagicProfile. Reads config.magicLevel,
 * factions, institutions, and Phase 17 substrate to expose magic as
 * a 10-facet system.
 *
 * @property {'rare'|'limited'|'moderate'|'common'|'broad'|'pervasive'} availability
 * @property {'forbidden'|'restricted'|'regulated'|'tolerated'|'celebrated'} legality
 * @property {'unregulated'|'fragmented'|'guild_controlled'} institutionalControl
 * @property {'cheap'|'moderate'|'costly'|'extortionate'} cost
 * @property {'low'|'moderate'|'elevated'|'high'|'extreme'} risk
 * @property {'hostile'|'wary'|'indifferent'|'syncretic'|'celebrated'} religiousAcceptance
 * @property {{economic: string, military: string, medical: string, infrastructure: string}} roles
 *           Each role: 'absent' | 'occasional' | 'common' | 'integral'.
 * @property {Array<{source: string, effect: string, reason: string}>} contributors
 */

/**
 * @typedef {'invalid' | 'rare_but_justified'
 *          | 'interesting_tension' | 'user_authored_exception'} ContradictionClassification
 *
 * Tier 4.18 classification vocabulary. domain/contradictions.js
 * detects structural anomalies and tags each with one of these.
 */

/**
 * @typedef {Object} Contradiction
 *
 * Tier 4.18 structured anomaly with justification.
 *
 * @property {string}                       id
 * @property {string}                       type            One of CONTRADICTION_TYPES.
 * @property {ContradictionClassification}  classification
 * @property {string}                       description     What the anomaly is.
 * @property {string}                       explanation     Why it exists / is justified.
 * @property {string[]}                     consequences    What it implies.
 * @property {Array<{id: string, label: string, type: string}>} references
 */

/**
 * @typedef {'remove' | 'weaken' | 'strengthen' | 'replace'} CounterfactualAction
 *
 * Tier 4.17 action vocabulary. domain/counterfactual.js maps these
 * to either a Phase 18 event (for institutions/npcs) or a manual
 * clone-and-modify (for factions/chains).
 */

/**
 * @typedef {Object} CounterfactualResult
 *
 * Tier 4.17 envelope produced by domain/counterfactual.js#counterfactual.
 * Composes Phase 18 (event pipeline), Phase 19 (explainEntity),
 * Phase 17 substrate, Phase 21 capacities, Phase 22 daily life.
 *
 * @property {{id: string, type: string, label: string|null}} target
 * @property {CounterfactualAction | null} action
 * @property {Object | null}              nextSettlement   Projected settlement.
 * @property {Object | null}              beforeExplanation Phase 19 envelope.
 * @property {Object | null}              afterExplanation  Phase 19 envelope (may be empty if target removed).
 * @property {Object}                     deltas           { systemState, causalState, capacities, factionRelationships, dailyLife }.
 * @property {string[]}                   summary
 * @property {Array<Object>}              warnings
 */

/**
 * @typedef {'food_culture' | 'dawn_work' | 'gathering_places'
 *          | 'child_warnings' | 'commoner_resentments'
 *          | 'outsider_impressions' | 'unspoken_topics'
 *          | 'recent_changes'} DailyLifeSlotKey
 *
 * Tier 4.19 canonical 8-slot vocabulary for daily-life prose
 * derived by domain/dailyLife.js. Same slot pattern as Phase 12
 * history beats — every slot always renders something true even
 * when its source data is thin.
 */

/**
 * @typedef {Object} DailyLifeSlot
 *
 * One entry in a DailyLifeEnvelope. The text is structurally grounded
 * prose — it composes signals from substrate / capacities / threats /
 * conditions / history but presents them as human-readable narrative.
 *
 * @property {DailyLifeSlotKey} key
 * @property {string}           label
 * @property {string}           text       Narrative line.
 * @property {string}           source     Dotted path describing what fed the line.
 * @property {Array<{id: string, label: string, type: string}>} references
 *           Pointers to Phase 19 explainable entities.
 */

/**
 * @typedef {Object} DailyLifeEnvelope
 *
 * Tier 4.19 daily-life envelope produced by
 * domain/dailyLife.js#deriveDailyLife. Eight slots covering food
 * culture, dawn work, gathering places, child warnings, commoner
 * resentments, outsider impressions, unspoken topics, and recent
 * changes.
 *
 * @property {Object<DailyLifeSlotKey, DailyLifeSlot>} slots
 * @property {string[]}                                summary
 */

/**
 * @typedef {'institution' | 'faction' | 'npc' | 'chain' | 'hook'
 *          | 'condition' | 'clock' | 'history_beat'
 *          | 'system_variable' | 'threat' | 'capacity'
 *          | 'district'} ExplainableEntityType
 *
 * Tier 2.6 canonical entity-type vocabulary. The dispatcher in
 * domain/explanation.js#explainEntity routes to a per-type explainer
 * based on this. The id-prefix convention ('institution.', 'faction.',
 * etc.) lets the dispatcher infer the type when only an id is passed.
 */

/**
 * @typedef {Object} ExplanationCause
 *
 * A single input that contributed to an entity's existence or current
 * state. Mirrors the Phase 7 trace cause shape but pulls from any
 * source (traces, profiles, derivations, substrate contributors).
 *
 * @property {string}  source    Stable id of the input.
 * @property {string}  effect    Short verb ('controls', 'requires', 'establishes', ...).
 * @property {string}  reason    Human-readable explanation.
 * @property {string=} step      Optional pipeline step name (for trace-sourced causes).
 * @property {number=} delta     Optional numeric contribution (for substrate contributors).
 */

/**
 * @typedef {Object} ExplanationEffect
 *
 * A downstream effect the entity supports.
 *
 * @property {string}  target    Stable id or name of what's affected.
 * @property {string}  effect    Short verb describing the effect.
 * @property {string}  reason    Human-readable explanation.
 * @property {string=} step      Optional pipeline step name.
 */

/**
 * @typedef {Object} ExplanationReference
 *
 * A pointer to a related entity the consumer can navigate to.
 *
 * @property {string} id
 * @property {string} label
 * @property {string} type    May be 'unknown' when the type can't be inferred.
 */

/**
 * @typedef {Object} ExplanationEnvelope
 *
 * Tier 2.6 unified causal-explanation shape. Returned by
 * domain/explanation.js#explainEntity for every explainable entity.
 * Consumers can render the same UI for any entity type — institution
 * detail, faction profile, NPC card, chain status panel, etc. — by
 * reading the same envelope.
 *
 * @property {ExplainableEntityType | null} entityType
 * @property {string | null}                entityId
 * @property {string | null}                entityLabel
 * @property {string | null}                causalReason       One-line "why does this exist?"
 * @property {ExplanationCause[]}           causes
 * @property {ExplanationEffect[]}          downstreamEffects
 * @property {{consequences: string[]}}     ifRemoved
 * @property {Object | null}                profile            Per-type rich detail.
 * @property {ExplanationReference[]}       references         Navigation targets.
 * @property {string[]}                     sources            Which derivations contributed
 *                                                              (e.g. 'simulationTrace',
 *                                                              'factionProfile', 'causalState').
 */
