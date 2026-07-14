/**
 * pulseShapes.js — shared JSDoc typedefs for the world-pulse war/trade/occupation
 * subsystems.
 *
 * The war layer reads a handful of large, heterogeneous "bag" shapes that the
 * pulse assembles at runtime: the pre-tick SNAPSHOT, the region GRAPH, the WAR
 * slice, per-settlement deployment records, capacity envelopes, and pulse
 * outcomes. Before this module those were annotated `@param {any}` hole-by-hole
 * (hundreds of them). Naming them here — with the key fields modeled and an
 * `[k: string]: any` index signature for the genuinely-dynamic remainder — turns
 * `@param {any} snapshot` into `@param {PulseSnapshot} snapshot`: the reader sees
 * WHAT the bag is, the any-cast counter (scripts/count-domain-any.mjs) sees one
 * fewer hole, and the strict typecheck (tsconfig.domain-strict.json) stays clean
 * because the index signature keeps every property access `any`-typed exactly as
 * before. These are deliberately LOOSE sim-shape typedefs (the reference tree's
 * own convention) — zero runtime; this file exports nothing at runtime.
 *
 * @module worldPulse/pulseShapes
 */

/**
 * A per-settlement record in `worldState.byId` — the generated settlement plus
 * its causal scores and power structure. Loose by design (deep, polymorphic).
 * @typedef {{ name?: string, settlement?: any, causal?: any, [k: string]: any }} SettlementItem
 */

/**
 * The mutable world-state ledgers threaded through the pulse (relationship
 * states, live deployments, the war-exhaustion scar, etc.).
 * @typedef {{ relationshipStates?: any, deployments?: Record<string, DeploymentRecord>, warExhaustion?: Record<string, number>, [k: string]: any }} WorldState
 */

/**
 * The region graph: relationship edges and directed channels (war_front,
 * trade_route, blockade …).
 * @typedef {{ edges?: any[], channels?: any[], [k: string]: any }} RegionGraph
 */

/**
 * The SINGLE pre-tick world snapshot every cross-settlement read comes from.
 * @typedef {{ byId?: Map<string, SettlementItem>, worldState?: WorldState, regionalGraph?: RegionGraph, relationships?: any[], [k: string]: any }} PulseSnapshot
 */

/**
 * A stateful army record (`worldState.deployments[saveId]`). Fields include
 * `targetId`, `sinceTick`, `role`, `maxStartStrength`, `currentEffectiveStrength`,
 * `deploymentAge`, `logisticsBurden`, and the supply facets. Kept a fully-loose
 * bag (not per-field typed) on purpose: the war code reads these fields through
 * `Number.isFinite`/coercion rather than TS narrowing, so per-field numeric types
 * would trip strict `possibly-undefined` on arithmetic that is already guarded.
 * @typedef {{ [k: string]: any }} DeploymentRecord
 */

/**
 * The military-capacity envelope for one settlement (militaryStrength.js).
 * `theoretical` is latent, `offensive` is projected force, `homeDefense` is the
 * force on the walls; `facets` are the underlying manpower/logistics/materiel etc.
 * @typedef {{ theoretical: number, offensive: number, homeDefense: number, facets: any }} CapacityEnvelope
 */

/**
 * A pulse OUTCOME object flowing through applyWorldPulseOutcomes (condition /
 * transfer / power-transfer shapes share this loose envelope).
 * @typedef {{ id?: any, type?: string, candidateType?: string, targetSaveId?: string, sourceEventTargetId?: string, severity?: number, [k: string]: any }} PulseOutcome
 */

/**
 * The WAR slice the pulse kernel passes between war modules.
 * @typedef {{ deployments?: Record<string, DeploymentRecord>, warExhaustion?: Record<string, number>, outcomes?: PulseOutcome[], graphChannels?: any[], [k: string]: any }} WarSlice
 */

/**
 * An occupation record (`worldState.occupations[saveId]`): the occupier, the
 * garrison/loyalty state, and the resistance ledger. Loose bag by design.
 * @typedef {{ [k: string]: any }} OccupationRecord
 */

/**
 * The injected deterministic RNG (kernel/prng.js): a stream with a stable
 * fork-by-key. Threaded so every roll is reproducible from the seed.
 * @typedef {{ random: () => number, fork: (label: string) => Rng }} Rng
 */

/**
 * A BOUNDED relationship nudge (war-5 strategy levers / war-6 pacific mobilization
 * reactions): clamped ABSOLUTE scalar values applied through applyRelationshipPatch
 * (which SETS, not deltas) plus the typed recentIncidents stamp the relationship
 * drift reads. Shared by settlementStrategy.js and mobilizationReactions.js.
 * @typedef {{ relationshipKey: string, relationshipPatch: Record<string, number>, incidentType: string }} RelationshipNudge
 */

export {};
