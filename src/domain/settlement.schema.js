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
