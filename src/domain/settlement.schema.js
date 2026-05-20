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
 * @property {number}                  ratio           supply / demand.
 * @property {CausalBand}              band            Derived from ratio.
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
 * @property {Object} constraints         { forbidden[], lockedEntities[], userDirection }.
 */

/**
 * @typedef {'invented_entity' | 'removed_entity' | 'renamed_entity' | 'changed_fact' | 'changed_canon' | 'removed_history_beat'} AiOverlayViolationKind
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
 * @property {boolean} locked       Will survive a reroll (user-pinned / event-committed).
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
 * Tier 4.15 canonical genre vocabulary. domain/genreProfile.js maps
 * each to a structured template of modifiers.
 */

/**
 * @typedef {Object} GenreProfile
 *
 * Tier 4.15 structured genre shape produced by
 * domain/genreProfile.js#deriveGenreProfile.
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
