/**
 * domain/worldPulse/canonRelationshipImpact.js — Lane 2 of
 * [domain-events-region-1]: the LAZY applier that lands a NON-party DM canon
 * relationship event on the live campaign's pulse relationship edge.
 *
 * Sibling to partyImpact.js's applyPartyImpact, but a TYPE UPSERT (set the edge to
 * the event's CHOSEN relationship type, per the region-8 verdict "orientation
 * follows the type") plus the same bounded affective nudge Lane 1 uses — NOT a
 * ladder shift. It reuses the relationship CORE (ensureRelationshipState +
 * relationshipKeyFromEdge, the leaf) and the region graph channel-bundle sync, so
 * the war layer, dossier, and channels all read a consistent, canonical edge.
 *
 * WHY LAZY (not eager): this imports the relationship CONSTRUCTOR
 * (worldPulse/relationshipState.js — RELATIONSHIP_DEFAULTS + ensureRelationshipState),
 * which the first-paint budget deliberately keeps out of the entry closure. It
 * rides the memoized lazy world-engine chunk (store loadWorldEngine). The eager
 * store path (settlementSlice.applyEvent) only ever touches the LIGHT leaf
 * (events/canonRelationshipLinkage.js) — the two resolve the identical
 * relationshipKey via the shared canonEdgeKeyForPair, so no drift.
 *
 * MERGE RECONCILIATION (golden branch): reconciles with G1d Lane 1's party path —
 * see events/canonRelationshipLinkage.js's header + the Lane-2 report.
 *
 * Pure + deterministic: no rolls, no `new Date()` — the caller threads `now`.
 */

import { ensureWorldState } from './worldState.js';
import {
  ensureRelationshipState, normalizeRelationshipEdge, relationshipKeyFromEdge, clamp01,
} from './relationshipState.js';
import { ensureRegionalGraph, syncRelationshipChannelBundle } from '../region/index.js';
import {
  canonRelationshipTargetFor, canonEdgeKeyForPair, INFILTRATION_TARGET_RELATIONSHIPS,
} from '../events/canonRelationshipLinkage.js';
import { WAR_STRESSOR_TYPES } from './warStressorTypes.js';

/** @typedef {{ id?: string, from?: string, to?: string, relationshipType?: string, type?: string, status?: string, channelIds?: string[], evidence?: Array<Record<string, unknown>>, updatedAt?: string }} GraphEdge */
/** @typedef {{ type?: string, id?: unknown, targetId?: unknown, payload?: Record<string, unknown> }} CanonEvent */
/** @typedef {{ lastCanonEventId?: string }} StampedRelState */

// The toType tables — LAZY on purpose (first-paint split): the eager leaf keeps
// only the light target extraction. trade_partners (composer plural) →
// trade_partner mirrors mutateWorld.setNeighbourRelationship's LEGACY_REL_ALIASES.
const LEGACY_REL_ALIASES = /** @type {Record<string, string>} */ ({ trade_partners: 'trade_partner' });
const canonicalRelType = (/** @type {unknown} */ rel) => {
  const lower = String(rel ?? '').toLowerCase();
  return LEGACY_REL_ALIASES[lower] || lower;
};
// Polarity follows the TYPE (region-8 verdict). Amity warms; antagonism sours.
const SOUR_TYPES = new Set(['rival', 'cold_war', 'hostile', 'criminal_network']);
const WARM_TYPES = new Set(['allied', 'trade_partner', 'patron', 'client', 'vassal']);
/** @param {string} toType @returns {'warm'|'sour'|'neutral'} */
function polarityFor(toType) {
  if (SOUR_TYPES.has(toType)) return 'sour';
  if (WARM_TYPES.has(toType)) return 'warm';
  return 'neutral';
}

/**
 * Full mapping from a NON-party canon event to the pulse relationship it lands:
 * `{ homeId, targetId, toType, polarity }` or null. Built on the eager leaf's
 * light target extraction (single source, no drift) plus the toType derivation
 * that lives here (lazy). Mirrors mutateWorld.instigatorTargetRelationship for the
 * APPLY_STRESSOR souring (war → hostile; infiltration → the DM-chosen lighter sour).
 *
 * @param {CanonEvent|null|undefined} event
 * @param {string|number|null|undefined} homeId
 */
export function mapEventToCanonRelationship(event, homeId) {
  const target = canonRelationshipTargetFor(event, homeId);
  if (!target) return null;
  const type = event?.type;
  if (target.kind === 'relationship') {
    const toType = type === 'BROKERED_ALLIANCE'
      ? 'allied'
      : canonicalRelType(event?.payload?.relationshipType || (type === 'SETTLEMENT_DISPUTE' ? 'rival' : 'trade_partner'));
    return { homeId: target.homeId, targetId: target.targetId, toType, polarity: polarityFor(toType) };
  }
  // kind === 'stressor' — an APPLY_STRESSOR instigator souring.
  const stressorType = String(event?.payload?.stressorType ?? event?.targetId ?? '').toLowerCase();
  let toType;
  if (WAR_STRESSOR_TYPES.includes(stressorType)) {
    toType = 'hostile';
  } else {
    const picked = String(event?.payload?.instigatorRelationship ?? '').toLowerCase();
    toType = INFILTRATION_TARGET_RELATIONSHIPS.includes(picked) ? picked : 'rival';
  }
  return { homeId: target.homeId, targetId: target.targetId, toType, polarity: 'sour' };
}

// The bounded affective nudge, mirroring partyImpact.js's broker/inflame deltas
// (the "same bounded nudge semantics Lane 1 uses"). Signed deltas applied on top
// of the target type's affective baseline; the label itself is set to toType.
/** @param {number} m */
const WARM_DELTA = (m) => ({ trust: 0.12 * m, resentment: -0.16 * m, fear: -0.16 * m, pactStrength: 0.06 * m });
/** @param {number} m */
const SOUR_DELTA = (m) => ({ trust: -0.16 * m, resentment: 0.18 * m, fear: 0.14 * m, pactStrength: 0 });

/**
 * Apply a NON-party canon relationship event to a campaign's pulse relationship
 * edge. Returns `{ worldState, regionalGraph, relationshipKey, toType }` — the
 * pieces the store commits onto the live campaign — or null when the event
 * carries no relationship semantics (or is party-caused).
 *
 * @param {Object} [args]
 * @param {{ worldState?: Record<string, unknown>, regionalGraph?: import('../region/graph.js').RegionGraph }} [args.campaign]
 * @param {CanonEvent} [args.event]     the applied canon settlement event
 * @param {string|number} [args.homeId]  the acting settlement's campaign save id
 * @param {number} [args.magnitude]
 * @param {(string|null)} [args.now]
 */
export function applyCanonRelationshipEvent({ campaign, event, homeId, magnitude = 0.6, now = null } = {}) {
  const descriptor = mapEventToCanonRelationship(event, homeId);
  if (!descriptor) return null;

  const nowArg = /** @type {string|undefined} */ (now ?? undefined);
  const worldState = ensureWorldState(campaign?.worldState, campaign);
  let graph = ensureRegionalGraph(campaign?.regionalGraph, { now: nowArg });
  const tick = worldState.tick;
  const { key, edge } = canonEdgeKeyForPair(graph, descriptor.homeId, descriptor.targetId);

  // ORIENTATION NORMALIZATION (region-8: orientation follows the type). Run the
  // DM-supplied type through the pulse layer's OWN orientation rule
  // (normalizeRelationshipEdge) on a HOME-ORIENTED shape — viewer-relative, so a
  // stored edge authored target→home cannot flip the meaning. For a
  // 'client'-shaped pick this canonicalizes the LABEL to 'patron' (state and edge
  // can never diverge) and yields the hierarchy stamps (patron = the TARGET; the
  // home settlement declared itself the client). Direction is carried by the
  // STATE stamps, never by rewriting the stored edge's from/to — the pulse's own
  // convention ("readers resolve direction state-first", relationshipState.js).
  const normalizedAnchor = normalizeRelationshipEdge({
    id: key, from: String(descriptor.homeId), to: String(descriptor.targetId), relationshipType: descriptor.toType,
  });
  const canonicalToType = normalizedAnchor.relationshipType;
  const hierarchyStamps = normalizedAnchor.normalizedDirection === 'client_to_patron'
    ? { patronSaveId: String(normalizedAnchor.from), clientSaveId: String(normalizedAnchor.to) }
    : {};

  // Anchor for state construction: the live edge (or the canonical synthetic for
  // CREATE) forced to the canonical toType, so a FIRST upsert adopts the TARGET
  // type's affective baseline (a DM declaring "these two are now rivals" reads
  // rival-grade resentment, not a small bump on the prior label) BEFORE the nudge;
  // a pre-existing relationshipState keeps its evolved affective state (existing
  // wins over defaults in ensureRelationshipState) and is relabelled + nudged.
  const anchorEdge = {
    ...(edge || { id: key, from: String(descriptor.homeId), to: String(descriptor.targetId) }),
    relationshipType: canonicalToType,
  };

  const current = ensureRelationshipState(anchorEdge, worldState.relationshipStates?.[key]);
  const m = clamp01(magnitude);
  const delta = descriptor.polarity === 'sour' ? SOUR_DELTA(m)
    : descriptor.polarity === 'warm' ? WARM_DELTA(m)
      : { trust: 0, resentment: 0, fear: 0, pactStrength: 0 };
  const nudged = {
    ...current,
    relationshipType: canonicalToType,
    ...hierarchyStamps,
    trust: clamp01(current.trust + delta.trust),
    resentment: clamp01(current.resentment + delta.resentment),
    fear: clamp01(current.fear + delta.fear),
    pactStrength: clamp01(current.pactStrength + delta.pactStrength),
    trajectory: descriptor.polarity === 'sour' ? 'deteriorating'
      : descriptor.polarity === 'warm' ? 'thawing'
        : current.trajectory,
    lastTransitionTick: tick,
    updatedAt: now,
    recentIncidents: [
      ...(current.recentIncidents || []).slice(-7),
      { tick, type: `canon_${String(event?.type || '').toLowerCase()}`, severity: 0.4 + m * 0.4, outcomeId: event?.id || null },
    ],
  };
  // Re-run ensureRelationshipState so a CREATE gets the full default field set
  // (readers normalize anyway, but a persisted full state keeps the dossier + war
  // layer byte-consistent with a pulse-born edge). Then stamp the writer's event
  // id — the reverse's SUPERSESSION GUARD restores only while this event is still
  // the key's last canon writer. (Stamped AFTER ensure: ensureRelationshipState's
  // fixed field list would drop it; a pulse rebuild also drops it, which makes the
  // guard conservatively no-op post-advance — the evolved world owns the edge, the
  // same posture as the stressor-undo's "the pulse has spread it" rule.)
  const ensured = ensureRelationshipState(anchorEdge, nudged);
  const next = event?.id != null ? { ...ensured, lastCanonEventId: String(event.id) } : ensured;

  const nextWorldState = {
    ...worldState,
    relationshipStates: { ...(worldState.relationshipStates || {}), [key]: next },
  };

  // Land the change on the graph. When no edge exists yet, CREATE it under the
  // CANONICAL id (key === edgeIdFor(home, target) — the exact id
  // deriveRegionalGraphFromSaves mints for this pair, so re-derivation matches it
  // by id/pair instead of duplicating). Without a real edge the state entry is
  // TRANSIENT: pulseKernel's ensureRelationshipStatesForGraph rebuilds
  // relationshipStates from graph.edges only, so an edgeless key is dropped on
  // the first advance.
  /** @type {GraphEdge} */
  let liveEdge;
  if (edge) {
    liveEdge = {
      ...edge,
      relationshipType: canonicalToType,
      type: (edge.type === edge.relationshipType || !edge.type) ? canonicalToType : edge.type,
      updatedAt: nowArg,
    };
    graph = {
      ...graph,
      edges: (graph.edges || []).map((/** @type {GraphEdge} */ e) => (relationshipKeyFromEdge(e) === key ? liveEdge : e)),
    };
  } else {
    liveEdge = {
      id: key,
      from: String(descriptor.homeId),
      to: String(descriptor.targetId),
      relationshipType: canonicalToType,
      status: 'active',
      channelIds: [],
      evidence: [{ source: 'canon_event', reason: `Linked by a DM ${String(event?.type || '').replace(/_/g, ' ').toLowerCase()}.` }],
      updatedAt: nowArg,
    };
    graph = { ...graph, edges: [...(graph.edges || []), liveEdge] };
  }
  // The channel bundle reads edge.from as the patron/overlord — hand it a
  // role-oriented COPY when the stamps put the senior side at 'to' (mirrors
  // applyWorldPulse's roleOrientedEdge; the stored edge keeps its orientation).
  const bundleEdge = hierarchyStamps.patronSaveId && String(liveEdge.from) !== hierarchyStamps.patronSaveId
    ? { ...liveEdge, from: hierarchyStamps.patronSaveId, to: hierarchyStamps.clientSaveId }
    : liveEdge;
  graph = syncRelationshipChannelBundle(graph, bundleEdge, canonicalToType, {
    now: nowArg,
    status: 'confirmed',
    relationshipKey: key,
    reason: `A DM ${String(event?.type || '').replace(/_/g, ' ').toLowerCase()} set the relationship to ${canonicalToType.replace(/_/g, ' ')}.`,
  });

  return { worldState: nextWorldState, regionalGraph: graph, relationshipKey: key, toType: canonicalToType };
}

/**
 * The INVERSE of applyCanonRelationshipEvent, for undoLastEvent. Restores the
 * campaign's pre-ripple pulse edge from the snapshot applyEvent stamped on
 * logEntry.undo.relationshipRipple (the crisis-twin campaignTwin pattern applied
 * to the relationship edge):
 *   • worldState.relationshipStates[key] returns to its exact pre-event value
 *     (DELETED when the ripple CREATED it — priorRelState null);
 *   • the regionalGraph returns to its prior shape — the edge label + channel
 *     bundle relabel back (priorEdgeType set), or the CREATED edge and every
 *     channel its bundle minted are REMOVED (snapshot.edgeCreated — a key the
 *     event GREW is deleted on undo, the undoEvent.js discipline).
 *
 * SUPERSESSION GUARD: the forward stamps `lastCanonEventId` on the state entry it
 * writes; this reverse restores ONLY while that stamp still names the undone
 * event. A later canon event on the same key (or a pulse advance, which
 * re-derives the entry and drops the stamp) supersedes the write — the reverse
 * then no-ops, leaving the later owner's value intact. Combined with the
 * forward's orphan guard this makes every apply/undo interleaving land on a
 * consistent value: forward-then-reverse restores; reverse-before-forward no-ops
 * here and orphan-guards there.
 *
 * Rides the SAME lazy chunk as the forward applier (it reaches
 * syncRelationshipChannelBundle, which the first-paint budget keeps out of the
 * eager closure). Returns `{ worldState, regionalGraph }` for the store to commit,
 * or null when there is nothing to reverse. This is an EXACT inverse of the lean
 * forward applier: that applier touches exactly the relationshipState entry + the
 * graph edge + the edge's channel bundle (it deliberately does NOT do the
 * full applyWorldPulseOutcomes cross-save neighbourNetwork writeback or Wizard
 * News), and this restores exactly those three. The HOME settlement's own
 * neighbourNetwork link is written + reversed independently by the settlement
 * mutation + its undoEvent.js SNAPSHOT_SETTLEMENT_KEYS snapshot.
 *
 * @param {Object} [args]
 * @param {{ worldState?: Record<string, unknown>, regionalGraph?: import('../region/graph.js').RegionGraph }} [args.campaign]
 * @param {{ key?: string, from?: unknown, to?: unknown, eventId?: string|null, edgeCreated?: boolean, priorRelState?: unknown, priorEdgeType?: string|null }} [args.snapshot]
 * @param {(string|null)} [args.now]
 */
export function reverseCanonRelationshipEvent({ campaign, snapshot, now = null } = {}) {
  const key = snapshot?.key;
  if (!key) return null;
  const nowArg = /** @type {string|undefined} */ (now ?? undefined);
  const worldState = ensureWorldState(campaign?.worldState, campaign);
  const priorRelState = snapshot?.priorRelState ?? null;
  const priorEdgeType = snapshot?.priorEdgeType ?? null;

  // SUPERSESSION GUARD — no current entry means the forward never landed (its
  // orphan guard will skip too) or a pulse rebuilt the states; a mismatched stamp
  // means a later event owns the key. Either way there is nothing of THIS
  // event's to reverse.
  const currentEntry = /** @type {StampedRelState|undefined} */ (worldState.relationshipStates?.[key]);
  if (!currentEntry) return null;
  if (snapshot?.eventId && currentEntry.lastCanonEventId !== snapshot.eventId) return null;

  // Restore the pre-ripple relationshipState VERBATIM (delete when created).
  const relationshipStates = { ...(worldState.relationshipStates || {}) };
  if (priorRelState == null) delete relationshipStates[key];
  else relationshipStates[key] = JSON.parse(JSON.stringify(priorRelState));

  let graph = ensureRegionalGraph(campaign?.regionalGraph, { now: nowArg });
  if (snapshot?.edgeCreated) {
    // The forward CREATED the edge — remove it and every channel its bundle
    // minted (they all carry relationshipKey === key; no pre-event channel can,
    // because no edge for the pair existed to sync a bundle for). Exact inverse:
    // the pair returns to unlinked.
    graph = {
      ...graph,
      edges: (graph.edges || []).filter((/** @type {GraphEdge} */ e) => relationshipKeyFromEdge(e) !== key),
      channels: (graph.channels || []).filter((/** @type {{ relationshipKey?: string }} */ ch) => ch.relationshipKey !== key),
      updatedAt: nowArg || graph.updatedAt,
    };
  } else if (priorEdgeType) {
    const { key: liveKey, edge } = canonEdgeKeyForPair(graph, snapshot?.from, snapshot?.to);
    if (edge && liveKey === key) {
      /** @type {GraphEdge} */
      const relabeled = {
        ...edge,
        relationshipType: priorEdgeType,
        type: (edge.type === edge.relationshipType || !edge.type) ? priorEdgeType : edge.type,
        updatedAt: nowArg,
      };
      graph = {
        ...graph,
        edges: (graph.edges || []).map((/** @type {GraphEdge} */ e) => (relationshipKeyFromEdge(e) === key ? relabeled : e)),
      };
      graph = syncRelationshipChannelBundle(graph, relabeled, priorEdgeType, {
        now: nowArg,
        status: 'confirmed',
        relationshipKey: key,
        reason: `Relationship restored to ${String(priorEdgeType).replace(/_/g, ' ')} (undo).`,
      });
    }
  }

  return { worldState: { ...worldState, relationshipStates }, regionalGraph: graph };
}
