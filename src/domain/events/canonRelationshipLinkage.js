/**
 * domain/events/canonRelationshipLinkage.js — LIGHT bridge for Lane 2 of
 * [domain-events-region-1]: map a NON-party DM canon relationship event to the
 * pulse relationship-edge it should upsert, and capture the pre-ripple undo
 * snapshot.
 *
 * EAGER-SAFE by construction — zero heavy imports (only the zero-import
 * warStressorTypes leaf). The eager store (settlementSlice.applyEvent) imports
 * this to snapshot the pre-ripple relationship state BEFORE rippleEventThroughWorld
 * lands the change; the LAZY applier (worldPulse/canonRelationshipImpact.js) imports
 * the SAME mapping + key derivation so both resolve the identical relationshipKey
 * (single source, no drift). The heavy relationshipState CONSTRUCTION
 * (RELATIONSHIP_DEFAULTS / ensureRelationshipState) stays out of first paint — it
 * lives only in the lazy applier. This leaf does only the light work: the
 * event→type mapping, the edge-key derivation, and a VERBATIM pre-value read.
 *
 * MERGE RECONCILIATION (golden branch): the golden branch's G1d Lane 1 routes
 * PARTY-caused BROKERED_ALLIANCE / SETTLEMENT_DISPUTE through partyImpact.js's
 * broker_relationship / inflame_relationship kinds; this is the NON-party
 * (DM-canon) store-path twin. Both target `relationshipKeyFromEdge` (edge.id else
 * `rel.<from>.<to>`); the duplicated key-derivation + edge-resolution reconcile
 * when the golden branch merges. See the Lane-2 report's merge checklist.
 *
 * Pure — no store, no engine call, no I/O.
 */

// Zero-import leaf ON PURPOSE (eager-safe): the war/infiltration stressor
// vocabularies for the APPLY_STRESSOR instigator-souring lane.
import {
  WAR_STRESSOR_TYPES,
  INFILTRATION_STRESSOR_TYPES,
  INFILTRATION_TARGET_RELATIONSHIPS,
} from '../worldPulse/warStressorTypes.js';
// The canonical edge-id mint. region/graph.js is ALREADY in the first-paint
// closure (the eager store's campaignRegionalSlice statically imports
// region/index.js), so this import adds zero eager bytes — and it makes the
// CREATE-case key IDENTICAL to the edge id deriveRegionalGraphFromSaves would
// mint for the same pair (edge.<slug>.<slug>), so a ripple-created pulse edge
// survives graph re-derivation instead of orphaning under a bespoke key.
import { edgeIdFor } from '../region/graph.js';

// Loose shapes at this seam — the regional graph, event, and campaign objects are
// schemaless open records elsewhere. Typed structurally with `unknown` for the
// dynamic bits (no `any` — the domain any-cast ratchet holds).
/** @typedef {{ id?: string, from?: string, to?: string, source?: string, target?: string, a?: string, b?: string, relationshipType?: string, type?: string }} GraphEdge */
/** @typedef {{ edges?: GraphEdge[] }} RegionGraphLite */
/** @typedef {{ type?: string, id?: unknown, targetId?: unknown, payload?: Record<string, unknown>, partyCaused?: unknown }} CanonEvent */
/** @typedef {{ id?: unknown, worldState?: { relationshipStates?: Record<string, unknown> }, regionalGraph?: RegionGraphLite }} CampaignLite */

// The three DM relationship events + APPLY_STRESSOR carry relationship semantics.
const RELATIONSHIP_EVENT_TYPES = new Set(['BROKERED_ALLIANCE', 'SETTLEMENT_DISPUTE', 'OPENED_TRADE_ROUTE']);

// FIRST-PAINT SPLIT: the toType derivation (canonicalRelType / the amity-vs-sour
// polarity / instigatorTargetRelationship) that only the APPLY step needs lives in
// the LAZY applier (worldPulse/canonRelationshipImpact.js). This eager leaf keeps
// only the light TARGET extraction + the edge-key + the verbatim pre-value read —
// the pieces the synchronous undo-snapshot capture in applyEvent must run before
// the ripple. Keeping the toType tables out of first paint shaves the entry closure.

/**
 * relationshipKeyFromEdge, reimplemented as a ZERO-import leaf copy — the
 * canonical lives in the LAZY worldPulse/relationshipState.js, and importing it
 * here would drag the engine chunk into first paint. Byte-identical logic.
 * @param {GraphEdge} edge @returns {string}
 */
function relationshipKeyFromEdge(edge) {
  if (edge?.id) return edge.id;
  const from = edge?.from || edge?.source || edge?.a || 'unknown-a';
  const to = edge?.to || edge?.target || edge?.b || 'unknown-b';
  return `rel.${from}.${to}`;
}

/** @param {GraphEdge} edge @param {unknown} homeId @param {unknown} targetId */
function pairMatches(edge, homeId, targetId) {
  const a = String(edge?.from ?? edge?.source ?? edge?.a ?? '');
  const b = String(edge?.to ?? edge?.target ?? edge?.b ?? '');
  const h = String(homeId);
  const t = String(targetId);
  return (a === h && b === t) || (a === t && b === h);
}

/**
 * Resolve the regionalGraph edge between home & target (either orientation) and
 * its relationship key. `edge` is null when no live edge exists yet — the lazy
 * applier then CREATES the real graph edge under the CANONICAL id
 * (edgeIdFor(home, target) — the exact id deriveRegionalGraphFromSaves mints for
 * this pair), and the relationshipState keys off that id, so the entry survives
 * the pulse kernel's ensureRelationshipStatesForGraph rebuild (which drops any
 * state whose key has no graph edge) AND later graph re-derivation.
 * @param {RegionGraphLite | null | undefined} regionalGraph
 * @param {unknown} homeId
 * @param {unknown} targetId
 * @returns {{ key: string, edge: GraphEdge | null }}
 */
export function canonEdgeKeyForPair(regionalGraph, homeId, targetId) {
  const edges = Array.isArray(regionalGraph?.edges) ? regionalGraph.edges : [];
  const edge = edges.find((e) => pairMatches(e, homeId, targetId)) || null;
  const key = edge ? relationshipKeyFromEdge(edge) : edgeIdFor(homeId, targetId);
  return { key, edge };
}

/** Does this stressor type sour its named instigator? (war → hostile; infiltration
 * → a lighter sour). The SPECIFIC toType is derived lazily in the applier; the
 * eager gate + capture only need to know the instigator IS a relationship target.
 * @param {string} stressorType @returns {boolean}
 */
export function isInstigatorSouringStressor(stressorType) {
  return WAR_STRESSOR_TYPES.includes(stressorType) || INFILTRATION_STRESSOR_TYPES.includes(stressorType);
}

// Re-exported for the lazy applier's toType derivation (single source; no drift).
export { INFILTRATION_TARGET_RELATIONSHIPS };

/**
 * Extract the pulse-edge TARGET of a NON-party canon relationship event (LIGHT —
 * no toType/polarity, so the toType tables stay out of first paint). Returns
 * `{ homeId, targetId, kind }` or null when the event carries no relationship
 * semantics (or IS party-caused — the party path is Lane 1 through partyImpact.js).
 * `kind` is 'relationship' (the three DM events) or 'stressor' (APPLY_STRESSOR's
 * instigator souring), so the lazy applier can pick the right toType path.
 *
 * @param {CanonEvent|null|undefined} event
 * @param {string|number|null|undefined} homeId  the acting settlement's campaign save id
 * @returns {{ homeId: string, targetId: string, kind: 'relationship'|'stressor' }|null}
 */
export function canonRelationshipTargetFor(event, homeId) {
  if (!event || event.partyCaused || homeId == null || homeId === '') return null;
  const type = event.type;
  if (typeof type === 'string' && RELATIONSHIP_EVENT_TYPES.has(type)) {
    const targetId = String(event.targetId ?? '').trim();
    if (!targetId) return null;
    return { homeId: String(homeId), targetId, kind: 'relationship' };
  }
  if (type === 'APPLY_STRESSOR') {
    const instigator = String(event.payload?.instigatorNeighbour ?? '').trim();
    if (!instigator) return null;
    const stressorType = String(event.payload?.stressorType ?? event.targetId ?? '').toLowerCase();
    if (!isInstigatorSouringStressor(stressorType)) return null;
    return { homeId: String(homeId), targetId: instigator, kind: 'stressor' };
  }
  return null;
}

/**
 * Capture the pre-ripple undo snapshot: the campaign's CURRENT relationshipState
 * for the resolved key + the live edge's label, read VERBATIM (no engine
 * construction — a plain deep-copy of whatever is there, or null when absent).
 * undoLastEvent restores these when the event is undone (the crisis-twin
 * campaignTwin pattern, applied to the relationship ripple). Returns null when
 * the event carries no relationship semantics, so the eager caller stashes
 * nothing for the common (non-relationship) event.
 *
 * The snapshot also carries:
 *   • eventId — the forward applier stamps `lastCanonEventId` on the state entry
 *     it writes; the reverse restores ONLY while that stamp still names this
 *     event (the supersession guard — a later writer owns the key).
 *   • edgeCreated — no live edge existed at capture, so the forward CREATES the
 *     canonical graph edge; the reverse must remove that edge + its channel
 *     bundle, not merely delete the state entry.
 *
 * @param {CampaignLite} campaign
 * @param {CanonEvent} event
 * @param {string|number} homeId
 * @returns {{ campaignId: unknown, key: string, from: string, to: string, eventId: string|null, edgeCreated: boolean, priorRelState: unknown, priorEdgeType: string|null }|null}
 */
export function captureCanonRelationshipUndo(campaign, event, homeId) {
  const target = canonRelationshipTargetFor(event, homeId);
  if (!target || !campaign) return null;
  const { key, edge } = canonEdgeKeyForPair(campaign.regionalGraph, target.homeId, target.targetId);
  const priorRel = campaign.worldState?.relationshipStates?.[key];
  const priorEdgeType = edge ? (String(edge.relationshipType || edge.type || '') || null) : null;
  return {
    campaignId: campaign.id,
    key,
    from: target.homeId,
    to: target.targetId,
    eventId: event?.id != null ? String(event.id) : null,
    edgeCreated: !edge,
    priorRelState: priorRel != null ? JSON.parse(JSON.stringify(priorRel)) : null,
    priorEdgeType,
  };
}

// Exposed for tests + any UI that wants a "this will ripple to the pulse edge"
// affordance (mirrors partyEventLinkage.PARTY_LINKED_EVENT_TYPES).
export const CANON_RELATIONSHIP_EVENT_TYPES = Object.freeze([
  'BROKERED_ALLIANCE', 'SETTLEMENT_DISPUTE', 'OPENED_TRADE_ROUTE', 'APPLY_STRESSOR',
]);
