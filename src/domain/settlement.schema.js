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
  stressors:      ['stress', 'stresses', 'stressTypes'],
  // (Future entries: e.g. `neighbors: ['neighbours', 'neighborRelationship']`
  // once that concept gets normalized.)
});

// ── Canonical typedef ───────────────────────────────────────────────────────
// The eventual target shape. Today's pipeline output is a flatter version of
// this; `normalizeSettlement()` is the adapter. Update both this typedef and
// the adapter when adding fields.

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
 * @property {Object} [geography]
 *   Terrain, climate, biome, river/road access, region. Today this is
 *   spread across `config.terrain`, `resourceAnalysis.terrain`, etc.; the
 *   canonical shape consolidates it.
 *
 * @property {ResourceEntry[]} [resources]
 *   Local + imported resources. Each entry has `id`, `name`, `tags`,
 *   `flow` (produced / imported / scarce / blocked).
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
 */

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
 * @typedef {Object} ActiveCondition
 * @property {string} id                'condition.plague' | etc.
 * @property {number} severity          0-1
 * @property {string} status            'worsening' | 'stable' | 'easing'
 * @property {string} [duration]        Human-readable
 * @property {string[]} affectedSystems Subsystem names this condition feeds into
 * @property {string} [sourceEventId]
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
 */

/**
 * @typedef {Object} Threat
 * @property {string} [id]
 * @property {string} name
 * @property {string} [type]
 * @property {string} [trajectory]
 */

/**
 * @typedef {Object} Hook
 * @property {string} [id]
 * @property {string} text
 * @property {Object} [origin]
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
