/**
 * domain/region/graph.js
 *
 * Campaign-level directed multigraph for regional causality. This layer is
 * intentionally separate from settlement.neighbourNetwork:
 * - neighbourNetwork records local dossier links
 * - regionalGraph records campaign-canon causal channels between settlements
 */

import { deriveRegionalState, settlementFromSave } from './deriveRegionalState.js';
import { canonicalEdgeForLink } from '../relationships/canonicalRelationship.js';
import { wallClockNow } from '../clock.js';

export const REGIONAL_GRAPH_SCHEMA_VERSION = 2;

// H18: the eventLog is a bounded audit trail, not cold storage. Wizard News is
// the durable DM-facing record; the log keeps the newest entries (FIFO drop)
// so campaign JSON stops growing without bound in localStorage/cloud sync.
export const REGIONAL_EVENT_LOG_LIMIT = 50;

export const REGIONAL_CHANNEL_TYPES = Object.freeze([
  // P0: logistics/economic
  'trade_dependency',
  'export_market',
  'trade_route',
  // P1: governance/force
  'political_authority',
  'tax_obligation',
  'military_protection',
  'war_front',
  // P2: social/cross-cutting
  'service_dependency',
  'religious_authority',
  'criminal_corridor',
  'migration_pressure',
  'information_flow',
  'resource_competition',
]);

export const REGIONAL_CHANNEL_STATUSES = Object.freeze([
  'suggested',
  'confirmed',
  'dormant',
  'disabled',
]);

export const REGIONAL_IMPACT_STATUSES = Object.freeze([
  'queued',
  'applied',
  'ignored',
  'expired',
  'resolved',
]);

export const P0_CHANNEL_TYPES = Object.freeze([
  'trade_dependency',
  'export_market',
  'trade_route',
]);

export const REGIONAL_CHANNEL_VISIBILITIES = Object.freeze([
  'public',
  'gm',
  'hidden',
]);

const DEFAULT_GM_CHANNEL_TYPES = new Set([
  'criminal_corridor',
  'information_flow',
  'religious_authority',
]);

function nowIso() {
  return wallClockNow();
}

// H12: the paid 'Opened Trade Route' event historically wrote the PLURAL
// label 'trade_partners', which no other subsystem recognizes (channel
// bundles minted 0 channels from it, discovery confidence dropped). The
// producer now writes the canonical 'trade_partner'; this shim heals LEGACY
// saves wherever link/edge labels enter the regional layer.
const LEGACY_RELATIONSHIP_LABEL_ALIASES = Object.freeze({
  trade_partners: 'trade_partner',
});

export function canonicalRelationshipLabel(label) {
  const raw = String(label || '').trim();
  return LEGACY_RELATIONSHIP_LABEL_ALIASES[raw.toLowerCase()] || raw;
}

export function stablePart(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'unknown';
}

export function edgeIdFor(from, to) {
  return `edge.${stablePart(from)}.${stablePart(to)}`;
}

export function channelIdFor(channel) {
  const goods = Array.isArray(channel.goods) && channel.goods.length
    ? channel.goods.map(g => g.id || g).sort().join('_')
    : 'general';
  return [
    'channel',
    channel.type || 'unknown',
    stablePart(channel.from),
    stablePart(channel.to),
    stablePart(goods),
  ].join('.');
}

// Deterministic timestamps (R4): every normalize* default-stamp path takes a
// threaded `now` so replay stamps no wall-clock time; nowIso() is the
// fallback ONLY when no `now` is provided.
function normalizeNode(node, now = null) {
  if (!node?.id) return null;
  return {
    id: String(node.id),
    name: node.name || String(node.id),
    tier: node.tier || null,
    settlementId: node.settlementId || node.id,
    updatedAt: node.updatedAt || now || nowIso(),
  };
}

function normalizeEdge(edge, now = null) {
  if (!edge?.from || !edge?.to) return null;
  return {
    id: edge.id || edgeIdFor(edge.from, edge.to),
    from: String(edge.from),
    to: String(edge.to),
    relationshipType: edge.relationshipType || edge.relation || 'other',
    status: edge.status || 'active',
    channelIds: Array.isArray(edge.channelIds) ? [...new Set(edge.channelIds)] : [],
    evidence: Array.isArray(edge.evidence) ? [...edge.evidence] : [],
    updatedAt: edge.updatedAt || now || nowIso(),
  };
}

function normalizeImpact(impact, now = null) {
  if (!impact?.id) return null;
  const status = REGIONAL_IMPACT_STATUSES.includes(impact.status)
    ? impact.status
    : 'queued';
  return {
    ...impact,
    id: String(impact.id),
    status,
    severity: clamp01(impact.severity ?? 0),
    confidence: clamp01(impact.confidence ?? 0.5),
    delayTicks: Math.max(0, Number.isFinite(impact.delayTicks) ? impact.delayTicks : 0),
    ageTicks: Math.max(0, Number.isFinite(impact.ageTicks) ? impact.ageTicks : 0),
    maxAgeTicks: Number.isFinite(impact.maxAgeTicks) ? impact.maxAgeTicks : null,
    waveDepth: Math.max(0, Number.isFinite(impact.waveDepth) ? impact.waveDepth : 0),
    waveDecay: clamp01(impact.waveDecay ?? 1),
    createdAt: impact.createdAt || now || nowIso(),
    updatedAt: impact.updatedAt || impact.createdAt || now || nowIso(),
  };
}

export function normalizeChannel(channel, now = null) {
  if (!channel?.from || !channel?.to || !channel?.type) return null;
  if (!REGIONAL_CHANNEL_TYPES.includes(channel.type)) return null;
  const status = REGIONAL_CHANNEL_STATUSES.includes(channel.status)
    ? channel.status
    : 'suggested';
  const visibility = REGIONAL_CHANNEL_VISIBILITIES.includes(channel.visibility)
    ? channel.visibility
    : (DEFAULT_GM_CHANNEL_TYPES.has(channel.type) ? 'gm' : 'public');
  const normalized = {
    id: channel.id || channelIdFor(channel),
    type: channel.type,
    from: String(channel.from),
    to: String(channel.to),
    direction: channel.direction || 'directed',
    status,
    visibility,
    strength: clamp01(channel.strength ?? channel.severity ?? 0.5),
    confidence: clamp01(channel.confidence ?? 0.5),
    goods: Array.isArray(channel.goods) ? channel.goods.map(g => ({ ...g })) : [],
    evidence: Array.isArray(channel.evidence) ? [...channel.evidence] : [],
    explanation: channel.explanation || '',
    relationshipType: channel.relationshipType || null,
    relationshipKey: channel.relationshipKey || null,
    discoveredAt: channel.discoveredAt || now || nowIso(),
    confirmedAt: channel.confirmedAt || null,
    updatedAt: channel.updatedAt || now || nowIso(),
  };
  normalized.id = channel.id || channelIdFor(normalized);
  return normalized;
}

function clamp01(value) {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

function dedupeById(items) {
  const map = new Map();
  for (const item of items || []) {
    if (!item?.id) continue;
    map.set(item.id, { ...(map.get(item.id) || {}), ...item });
  }
  return [...map.values()];
}

export function ensureRegionalGraph(graph = {}, options = {}) {
  // Deterministic timestamps: ensure mints state (inferred edges below, plus
  // any missing default stamp), so callers that thread options.now get
  // byte-identical replays — without it, the channel_inferred edge minted for
  // an edgeless pair was the one record in a pulse apply still reading the
  // wall clock.
  const now = options.now || null;
  const nodes = dedupeById((graph.nodes || []).map(node => normalizeNode(node, now)).filter(Boolean));
  const edges = dedupeById((graph.edges || []).map(edge => normalizeEdge(edge, now)).filter(Boolean));
  const channels = dedupeById((graph.channels || []).map(channel => normalizeChannel(channel, now)).filter(Boolean));
  // Cap heals legacy saves that accumulated an unbounded log (H18).
  const eventLog = Array.isArray(graph.eventLog)
    ? graph.eventLog.slice(-REGIONAL_EVENT_LOG_LIMIT)
    : [];
  const queuedImpacts = dedupeById((graph.queuedImpacts || []).map(impact => normalizeImpact(impact, now)).filter(Boolean));

  const edgeByPair = new Map(edges.map(e => [`${e.from}->${e.to}`, e]));
  for (const channel of channels) {
    const key = `${channel.from}->${channel.to}`;
    let edge = edgeByPair.get(key);
    if (!edge) {
      edge = normalizeEdge({ from: channel.from, to: channel.to, relationshipType: 'channel_inferred' }, now);
      edges.push(edge);
      edgeByPair.set(key, edge);
    }
    if (!edge.channelIds.includes(channel.id)) edge.channelIds.push(channel.id);
  }

  return {
    schemaVersion: REGIONAL_GRAPH_SCHEMA_VERSION,
    nodes,
    edges,
    channels,
    queuedImpacts,
    eventLog,
    updatedAt: graph.updatedAt || now || nowIso(),
  };
}

function nodeFromSave(save, now = null) {
  const state = deriveRegionalState(save);
  if (!state.id) return null;
  return normalizeNode({
    id: state.id,
    settlementId: state.settlementId,
    name: state.name,
    tier: state.tier,
    updatedAt: now || undefined,
  });
}

function neighbourLinksFor(save) {
  const settlement = settlementFromSave(save);
  return settlement?.neighbourNetwork
      || settlement?.neighborNetwork
      || settlement?.neighbourLinks
      || [];
}

function findTargetSave(link, saves) {
  const targetId = link?.id || link?.targetId || link?.settlementId;
  if (targetId) {
    const match = saves.find(s => String(s.id || s.settlement?.id) === String(targetId));
    if (match) return match;
  }
  const name = link?.neighbourName || link?.name;
  if (!name) return null;
  return saves.find(s => s.name === name || s.settlement?.name === name) || null;
}

/**
 * Build a regional graph scaffold from saved settlements and their current
 * neighbourNetwork links. This does not auto-confirm any causal channel.
 */
export function deriveRegionalGraphFromSaves(saves = [], existingGraph = null, options = {}) {
  // Deterministic timestamps: callers thread options.now so a rebuild replay
  // stamps no wall-clock time (wall clock ONLY when not provided).
  const now = options.now || null;
  const existing = ensureRegionalGraph(existingGraph || {}, { now });
  const nodes = [...existing.nodes];
  const edges = [...existing.edges];
  const nodeIds = new Set(nodes.map(n => n.id));
  const edgesById = new Map(edges.map(e => [e.id, e]));
  const pairKeyFor = (a, b) => [String(a), String(b)].sort().join('::');
  const edgesByPair = new Map();
  for (const e of edges) {
    const key = pairKeyFor(e.from, e.to);
    if (!edgesByPair.has(key)) edgesByPair.set(key, e);
  }
  const relationshipKeys = new Set();

  for (const save of saves || []) {
    const node = nodeFromSave(save, now);
    if (node && !nodeIds.has(node.id)) {
      nodes.push(node);
      nodeIds.add(node.id);
    }
  }

  for (const save of saves || []) {
    const sourceId = save?.id || save?.settlement?.id;
    if (!sourceId) continue;
    for (const link of neighbourLinksFor(save)) {
      const target = findTargetSave(link, saves);
      const targetId = target?.id || target?.settlement?.id;
      if (!targetId || String(targetId) === String(sourceId)) continue;
      const canonical = canonicalEdgeForLink(link, save, target);
      if (!canonical) continue;
      const liveType = canonicalRelationshipLabel(canonical.relationshipType);
      const relationshipKey = link.linkId
        || [String(sourceId), String(targetId)].sort().join('::');
      if (relationshipKeys.has(relationshipKey)) continue;
      relationshipKeys.add(relationshipKey);
      const existingEdge = edgesById.get(edgeIdFor(canonical.from, canonical.to))
        || edgesByPair.get(pairKeyFor(canonical.from, canonical.to));
      if (existingEdge) {
        // H10: the saves' neighbourNetwork is the canonical relationship
        // source — a rebuild refreshes the edge's relationshipType from the
        // live link instead of freezing the first build forever. Pulse-
        // authored label changes stay authoritative between rebuilds because
        // the pulse writes them back to the links (H11): both sources
        // converge. Orientation stays as authored (the pulse's own label
        // updates do the same). Identity no-op when the label is unchanged;
        // edges for pairs no longer linked are preserved as-is.
        if (liveType && existingEdge.relationshipType !== liveType) {
          const refreshed = {
            ...existingEdge,
            relationshipType: liveType,
            evidence: [
              ...(existingEdge.evidence || []).filter(item => item?.source !== 'neighbourNetwork'),
              { source: 'neighbourNetwork', reason: `Linked as ${liveType}.` },
            ],
            updatedAt: now || nowIso(),
          };
          edges[edges.indexOf(existingEdge)] = refreshed;
          edgesById.set(refreshed.id, refreshed);
          edgesByPair.set(pairKeyFor(refreshed.from, refreshed.to), refreshed);
        }
        continue;
      }
      const edge = normalizeEdge({
        id: edgeIdFor(canonical.from, canonical.to),
        from: canonical.from,
        to: canonical.to,
        relationshipType: liveType,
        evidence: [{
          source: 'neighbourNetwork',
          reason: `Linked as ${liveType}.`,
        }],
        updatedAt: now || undefined,
      });
      if (edge) {
        edges.push(edge);
        edgesById.set(edge.id, edge);
        edgesByPair.set(pairKeyFor(edge.from, edge.to), edge);
      }
    }
  }

  return ensureRegionalGraph({
    ...existing,
    nodes,
    edges,
    channels: existing.channels,
    queuedImpacts: existing.queuedImpacts,
    eventLog: existing.eventLog,
    updatedAt: now || nowIso(),
  }, { now });
}

/**
 * Merge candidate channels into the graph. Discovery refreshes measurements,
 * never curation: an existing channel keeps its status (suggested, confirmed,
 * dormant, and disabled are all sticky), visibility, confirmedAt, and original
 * discoveredAt, while the candidate refreshes the measurement fields
 * (strength, confidence, goods, evidence, explanation). Only a brand-new
 * channel takes the candidate's status (discovery candidates are born
 * 'suggested').
 */
export function addRegionalChannels(graph, channels = [], options = {}) {
  // Deterministic timestamps: callers thread options.now (replay must stamp
  // no wall-clock time); the wall clock is the fallback ONLY when absent.
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  const byId = new Map(current.channels.map(c => [c.id, c]));
  for (const raw of channels) {
    const channel = normalizeChannel(raw, now);
    if (!channel) continue;
    const prev = byId.get(channel.id);
    if (prev) {
      byId.set(channel.id, {
        ...prev,
        ...channel,
        status: prev.status,
        visibility: prev.visibility,
        discoveredAt: prev.discoveredAt,
        confirmedAt: prev.confirmedAt,
        // Provenance only upgrades: a candidate without relationship
        // provenance must not orphan a relationship-generated channel.
        relationshipType: channel.relationshipType || prev.relationshipType || null,
        relationshipKey: channel.relationshipKey || prev.relationshipKey || null,
        updatedAt: now,
      });
    } else {
      byId.set(channel.id, { ...channel, updatedAt: now });
    }
  }
  return ensureRegionalGraph({ ...current, channels: [...byId.values()], updatedAt: now }, { now });
}

function relationshipEvidence(relationshipType, options = {}) {
  return [{
    source: 'relationship_label',
    reason: options.reason || `Relationship became ${String(relationshipType || 'linked').replace(/_/g, ' ')}.`,
    outcomeId: options.outcomeId || null,
  }];
}

function relationshipChannel(raw, relationshipType, options = {}) {
  const now = options.now || nowIso();
  return normalizeChannel({
    status: options.status || 'confirmed',
    confidence: options.confidence ?? 0.75,
    discoveredAt: now,
    confirmedAt: now,
    updatedAt: now,
    evidence: relationshipEvidence(relationshipType, options),
    relationshipType,
    relationshipKey: options.relationshipKey || null,
    ...raw,
  });
}

function twoWayChannels(type, from, to, relationshipType, options, strength, confidence, extra = {}) {
  return [
    relationshipChannel({ type, from, to, strength, confidence, ...extra }, relationshipType, options),
    relationshipChannel({ type, from: to, to: from, strength, confidence, ...extra }, relationshipType, options),
  ];
}

/**
 * Convert a relationship label into confirmed regional channels. Direction is
 * edge-significant for hierarchical labels: edge.from is the patron/overlord,
 * edge.to is the client/vassal.
 */
export function relationshipChannelBundle(edge, relationshipType, options = {}) {
  if (!edge?.from || !edge?.to || !relationshipType) return [];
  let from = String(edge.from);
  let to = String(edge.to);
  // Legacy plural 'trade_partners' still mints the full trade bundle (H12).
  let rel = canonicalRelationshipLabel(relationshipType);
  if (rel === 'client') {
    [from, to] = [to, from];
    rel = 'patron';
  }
  const base = { ...options, relationshipKey: options.relationshipKey || edge.id || `${from}->${to}` };
  const out = [];

  if (rel === 'vassal') {
    out.push(
      relationshipChannel({ type: 'political_authority', from, to, strength: 0.82, confidence: 0.82, explanation: `${from} exercises overlord authority over ${to}.` }, rel, base),
      relationshipChannel({ type: 'military_protection', from, to, strength: 0.7, confidence: 0.76, explanation: `${from} is expected to protect ${to}.` }, rel, base),
      relationshipChannel({ type: 'tax_obligation', from: to, to: from, strength: 0.76, confidence: 0.78, explanation: `${to} owes tribute or obligation to ${from}.` }, rel, base),
      relationshipChannel({ type: 'information_flow', from, to, strength: 0.46, confidence: 0.62, visibility: 'gm' }, rel, base),
      relationshipChannel({ type: 'information_flow', from: to, to: from, strength: 0.4, confidence: 0.58, visibility: 'gm' }, rel, base),
    );
  } else if (rel === 'patron') {
    out.push(
      relationshipChannel({ type: 'political_authority', from, to, strength: 0.62, confidence: 0.72, explanation: `${from} exercises patron authority over ${to}.` }, rel, base),
      relationshipChannel({ type: 'military_protection', from, to, strength: 0.55, confidence: 0.64, explanation: `${from} may protect or pressure ${to}.` }, rel, base),
      relationshipChannel({ type: 'tax_obligation', from: to, to: from, strength: 0.45, confidence: 0.58, explanation: `${to} may owe taxes, tribute, or concessions to ${from}.` }, rel, base),
    );
  } else if (rel === 'allied' || rel === 'ally') {
    out.push(
      ...twoWayChannels('military_protection', from, to, rel, base, 0.62, 0.72),
      ...twoWayChannels('trade_route', from, to, rel, base, 0.55, 0.66),
      ...twoWayChannels('information_flow', from, to, rel, base, 0.5, 0.65, { visibility: 'public' }),
    );
  } else if (rel === 'trade_partner') {
    out.push(
      ...twoWayChannels('trade_route', from, to, rel, base, 0.72, 0.82),
      ...twoWayChannels('information_flow', from, to, rel, base, 0.42, 0.6),
    );
  } else if (rel === 'hostile') {
    out.push(
      ...twoWayChannels('war_front', from, to, rel, base, 0.72, 0.78),
      ...twoWayChannels('resource_competition', from, to, rel, base, 0.58, 0.62),
    );
  } else if (rel === 'rival' || rel === 'cold_war') {
    out.push(
      ...twoWayChannels('resource_competition', from, to, rel, base, 0.56, 0.6),
      ...twoWayChannels('information_flow', from, to, rel, base, 0.44, 0.56, { visibility: 'gm' }),
    );
  } else if (rel === 'criminal_network' || rel === 'criminal_corridor') {
    out.push(
      ...twoWayChannels('criminal_corridor', from, to, rel, base, 0.68, 0.72, { visibility: 'gm' }),
      ...twoWayChannels('information_flow', from, to, rel, base, 0.36, 0.52, { visibility: 'hidden' }),
    );
  }

  return out.filter(Boolean);
}

/**
 * Mint a single DIRECTED regional channel that is NOT implied by a relationship
 * label — the one home for ad-hoc directed mints driven by the simulation rather
 * than diplomacy: a coalition war_front (each attacker → the besieged target,
 * Feature A) and a deity-gated religious_authority edge (faith carrier → convert,
 * Feature D). Returns a normalized channel, or null if the type/endpoints are
 * invalid. Deterministic: the id derives from type+from+to and `now` is INJECTED
 * (the pulse passes its tick clock — never wall-time here).
 *
 * @param {Object} args
 * @param {string} args.type      - a REGIONAL_CHANNEL_TYPES member (e.g. 'war_front')
 * @param {string} args.from
 * @param {string} args.to
 * @param {number} [args.strength]
 * @param {number} [args.confidence]
 * @param {string} [args.explanation]
 * @param {string} [args.visibility]
 * @param {string} [args.status]
 * @param {string|null} [args.relationshipKey] - provenance back to a stressor/contest
 * @param {string} [args.source]   - evidence source tag
 * @param {string|null} [args.now]
 * @returns {object|null}
 */
export function mintDirectedChannel({
  type, from, to, strength = 0.7, confidence = 0.7, explanation = '',
  visibility, status = 'confirmed', relationshipKey = null, source = 'directed_mint', now = null,
}) {
  const stamp = now || nowIso();
  return normalizeChannel({
    type,
    from,
    to,
    direction: 'directed',
    status,
    strength,
    confidence,
    explanation,
    ...(visibility ? { visibility } : {}),
    relationshipKey,
    discoveredAt: stamp,
    confirmedAt: stamp,
    updatedAt: stamp,
    evidence: [{ source, reason: explanation || `${from} → ${to} ${type}`, outcomeId: null }],
  }, /** @type {any} */ (stamp));
}

export function syncRelationshipChannelBundle(graph, edge, relationshipType, options = {}) {
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  const bundle = relationshipChannelBundle(edge, relationshipType, options);
  const nextIds = new Set(bundle.map(channel => channel.id));
  const from = String(edge?.from || '');
  const to = String(edge?.to || '');
  const relationshipKey = options.relationshipKey || edge?.id || `${from}->${to}`;
  const samePair = channel =>
    (String(channel.from) === from && String(channel.to) === to)
    || (String(channel.from) === to && String(channel.to) === from);
  const channels = current.channels.map(channel => {
    if (nextIds.has(channel.id)) {
      // A relationship label CHANGE is curation, not discovery: when the
      // bundle re-establishes channels for a re-warmed relationship, its OWN
      // channel ids re-confirm out of dormancy. DM 'disabled' is never
      // overridden, and plain Discover still resurrects nothing
      // (addRegionalChannels keeps every prior status sticky).
      if (channel.status !== 'dormant') return channel;
      return {
        ...channel,
        status: 'confirmed',
        confirmedAt: channel.confirmedAt || now,
        updatedAt: now,
        evidence: [
          ...(channel.evidence || []),
          { source: 'relationship_label', reason: `Re-confirmed after relationship became ${String(relationshipType).replace(/_/g, ' ')}.` },
        ],
      };
    }
    const relationshipGenerated = channel.relationshipKey === relationshipKey
      || (samePair(channel) && (channel.evidence || []).some(item => item.source === 'relationship_label'));
    // DM 'disabled' survives label changes outright — were it parked as
    // dormant here, a later re-establishment would re-confirm it.
    if (!relationshipGenerated || channel.status === 'disabled') return channel;
    return {
      ...channel,
      status: 'dormant',
      updatedAt: now,
      evidence: [
        ...(channel.evidence || []),
        { source: 'relationship_label', reason: `Dormant after relationship became ${String(relationshipType).replace(/_/g, ' ')}.` },
      ],
    };
  });
  return addRegionalChannels({ ...current, channels, updatedAt: now }, bundle, { now });
}

export function setRegionalChannelStatus(graph, channelId, status, options = {}) {
  if (!REGIONAL_CHANNEL_STATUSES.includes(status)) return ensureRegionalGraph(graph || {}, { now: options.now });
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  const channels = current.channels.map(channel => {
    if (channel.id !== channelId) return channel;
    return {
      ...channel,
      status,
      confirmedAt: status === 'confirmed' ? (channel.confirmedAt || now) : channel.confirmedAt,
      updatedAt: now,
    };
  });
  return ensureRegionalGraph({ ...current, channels, updatedAt: now }, { now });
}

export function setRegionalChannelVisibility(graph, channelId, visibility, options = {}) {
  if (!REGIONAL_CHANNEL_VISIBILITIES.includes(visibility)) return ensureRegionalGraph(graph || {}, { now: options.now });
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  const channels = current.channels.map(channel => {
    if (channel.id !== channelId) return channel;
    return { ...channel, visibility, updatedAt: now };
  });
  return ensureRegionalGraph({ ...current, channels, updatedAt: now }, { now });
}

export function activeChannelsFrom(graph, settlementId, options = {}) {
  const { includeSuggested = false, types = null, visibility = null, excludeHidden = false } = options;
  const typeSet = Array.isArray(types) ? new Set(types) : null;
  const visibilitySet = Array.isArray(visibility) ? new Set(visibility) : null;
  return ensureRegionalGraph(graph || {}).channels.filter(channel => {
    if (String(channel.from) !== String(settlementId)) return false;
    if (typeSet && !typeSet.has(channel.type)) return false;
    if (visibilitySet && !visibilitySet.has(channel.visibility)) return false;
    if (excludeHidden && channel.visibility === 'hidden') return false;
    if (channel.status === 'confirmed') return true;
    return includeSuggested && channel.status === 'suggested';
  });
}

export function appendRegionalEvent(graph, event, options = {}) {
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  return ensureRegionalGraph({
    ...current,
    // The append-side cap (newest REGIONAL_EVENT_LOG_LIMIT survive, FIFO drop)
    // keeps the log bounded even before the next ensure pass (H18).
    eventLog: [...current.eventLog, { ...event, recordedAt: event.recordedAt || now }]
      .slice(-REGIONAL_EVENT_LOG_LIMIT),
    updatedAt: now,
  }, { now });
}

export function queueRegionalImpacts(graph, impacts = [], options = {}) {
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  const byId = new Map(current.queuedImpacts.map(i => [i.id, i]));
  for (const impact of impacts) {
    const normalized = normalizeImpact(impact, now);
    if (!normalized) continue;
    const previous = byId.get(normalized.id);
    const merged = { ...(previous || {}), ...normalized, updatedAt: now };
    if (
      previous
      && ['applied', 'ignored', 'expired', 'resolved'].includes(previous.status)
      && normalized.status === 'queued'
    ) {
      merged.status = previous.status;
      merged.appliedAt = previous.appliedAt;
      merged.ignoredAt = previous.ignoredAt;
      merged.expiredAt = previous.expiredAt;
      merged.resolvedAt = previous.resolvedAt;
    }
    // An applied/resolved row's conditionId is load-bearing: its materialized
    // condition may live under the legacy truncated id (pre-hash rows carry no
    // conditionId at all). A re-derivation must not stamp the fresh hashed id
    // over it, or resolve would miss the real condition.
    if (previous && ['applied', 'resolved'].includes(previous.status)) {
      if ('conditionId' in previous) merged.conditionId = previous.conditionId;
      else delete merged.conditionId;
    }
    byId.set(normalized.id, merged);
  }
  return ensureRegionalGraph({
    ...current,
    queuedImpacts: [...byId.values()],
    updatedAt: now,
  }, { now });
}

export function setRegionalImpactStatus(graph, impactId, status, patch = {}, options = {}) {
  if (!REGIONAL_IMPACT_STATUSES.includes(status)) return ensureRegionalGraph(graph || {}, { now: options.now });
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  const queuedImpacts = current.queuedImpacts.map(impact => {
    if (impact.id !== impactId) return impact;
    return {
      ...impact,
      ...patch,
      status,
      appliedAt: status === 'applied' ? (impact.appliedAt || patch.appliedAt || now) : impact.appliedAt,
      ignoredAt: status === 'ignored' ? (impact.ignoredAt || patch.ignoredAt || now) : impact.ignoredAt,
      expiredAt: status === 'expired' ? (impact.expiredAt || patch.expiredAt || now) : impact.expiredAt,
      resolvedAt: status === 'resolved' ? (impact.resolvedAt || patch.resolvedAt || now) : impact.resolvedAt,
      updatedAt: now,
    };
  });
  return ensureRegionalGraph({ ...current, queuedImpacts, updatedAt: now }, { now });
}

export function isRegionalImpactAvailable(impact) {
  return impact?.status === 'queued' && (impact.delayTicks || 0) <= 0;
}

export function advanceRegionalImpacts(graph, ticks = 1, options = {}) {
  const now = options.now || nowIso();
  const current = ensureRegionalGraph(graph || {}, { now });
  const amount = Math.max(1, Math.floor(Number.isFinite(ticks) ? ticks : 1));
  const currentTick = Number.isFinite(options.currentTick) ? options.currentTick : null;
  const queuedImpacts = current.queuedImpacts.map(impact => {
    if (impact.status !== 'queued') return impact;
    const ageTicks = Math.max(0, (impact.ageTicks || 0) + amount);
    const delayTicks = Math.max(0, (impact.delayTicks || 0) - amount);
    const expiredByAge = Number.isFinite(impact.maxAgeTicks) && ageTicks >= impact.maxAgeTicks;
    const expiredByTick = currentTick !== null
      && Number.isFinite(impact.expiresAtTick)
      && currentTick >= impact.expiresAtTick;
    return {
      ...impact,
      ageTicks,
      delayTicks,
      status: expiredByAge || expiredByTick ? 'expired' : impact.status,
      expiredAt: expiredByAge || expiredByTick ? (impact.expiredAt || now) : impact.expiredAt,
      updatedAt: now,
    };
  });
  return ensureRegionalGraph({ ...current, queuedImpacts, updatedAt: now }, { now });
}

export function buildRegionalIndexes(graph) {
  const current = ensureRegionalGraph(graph || {});
  const outgoingBySettlement = new Map();
  const incomingBySettlement = new Map();
  const channelsByType = new Map();
  for (const channel of current.channels) {
    if (!outgoingBySettlement.has(channel.from)) outgoingBySettlement.set(channel.from, []);
    if (!incomingBySettlement.has(channel.to)) incomingBySettlement.set(channel.to, []);
    if (!channelsByType.has(channel.type)) channelsByType.set(channel.type, []);
    outgoingBySettlement.get(channel.from).push(channel);
    incomingBySettlement.get(channel.to).push(channel);
    channelsByType.get(channel.type).push(channel);
  }
  return { outgoingBySettlement, incomingBySettlement, channelsByType };
}
