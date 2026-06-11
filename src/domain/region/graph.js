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

export const REGIONAL_GRAPH_SCHEMA_VERSION = 2;

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
  return new Date().toISOString();
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

function normalizeNode(node) {
  if (!node?.id) return null;
  return {
    id: String(node.id),
    name: node.name || String(node.id),
    tier: node.tier || null,
    settlementId: node.settlementId || node.id,
    updatedAt: node.updatedAt || nowIso(),
  };
}

function normalizeEdge(edge) {
  if (!edge?.from || !edge?.to) return null;
  return {
    id: edge.id || edgeIdFor(edge.from, edge.to),
    from: String(edge.from),
    to: String(edge.to),
    relationshipType: edge.relationshipType || edge.relation || 'other',
    status: edge.status || 'active',
    channelIds: Array.isArray(edge.channelIds) ? [...new Set(edge.channelIds)] : [],
    evidence: Array.isArray(edge.evidence) ? [...edge.evidence] : [],
    updatedAt: edge.updatedAt || nowIso(),
  };
}

function normalizeImpact(impact) {
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
    createdAt: impact.createdAt || nowIso(),
    updatedAt: impact.updatedAt || impact.createdAt || nowIso(),
  };
}

export function normalizeChannel(channel) {
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
    discoveredAt: channel.discoveredAt || nowIso(),
    confirmedAt: channel.confirmedAt || null,
    updatedAt: channel.updatedAt || nowIso(),
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

export function ensureRegionalGraph(graph = {}) {
  const nodes = dedupeById((graph.nodes || []).map(normalizeNode).filter(Boolean));
  const edges = dedupeById((graph.edges || []).map(normalizeEdge).filter(Boolean));
  const channels = dedupeById((graph.channels || []).map(normalizeChannel).filter(Boolean));
  const eventLog = Array.isArray(graph.eventLog) ? [...graph.eventLog] : [];
  const queuedImpacts = dedupeById((graph.queuedImpacts || []).map(normalizeImpact).filter(Boolean));

  const edgeByPair = new Map(edges.map(e => [`${e.from}->${e.to}`, e]));
  for (const channel of channels) {
    const key = `${channel.from}->${channel.to}`;
    let edge = edgeByPair.get(key);
    if (!edge) {
      edge = normalizeEdge({ from: channel.from, to: channel.to, relationshipType: 'channel_inferred' });
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
    updatedAt: graph.updatedAt || nowIso(),
  };
}

function nodeFromSave(save) {
  const state = deriveRegionalState(save);
  if (!state.id) return null;
  return normalizeNode({
    id: state.id,
    settlementId: state.settlementId,
    name: state.name,
    tier: state.tier,
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
export function deriveRegionalGraphFromSaves(saves = [], existingGraph = null) {
  const existing = ensureRegionalGraph(existingGraph || {});
  const nodes = [...existing.nodes];
  const edges = [...existing.edges];
  const nodeIds = new Set(nodes.map(n => n.id));
  const edgeIds = new Set(edges.map(e => e.id));
  const relationshipKeys = new Set();

  for (const save of saves || []) {
    const node = nodeFromSave(save);
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
      const relationshipKey = link.linkId
        || [String(sourceId), String(targetId)].sort().join('::');
      if (relationshipKeys.has(relationshipKey)) continue;
      relationshipKeys.add(relationshipKey);
      const edge = normalizeEdge({
        id: edgeIdFor(canonical.from, canonical.to),
        from: canonical.from,
        to: canonical.to,
        relationshipType: canonical.relationshipType,
        evidence: [{
          source: 'neighbourNetwork',
          reason: `Linked as ${canonical.relationshipType}.`,
        }],
      });
      if (edge && !edgeIds.has(edge.id)) {
        edges.push(edge);
        edgeIds.add(edge.id);
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
    updatedAt: nowIso(),
  });
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
export function addRegionalChannels(graph, channels = []) {
  const current = ensureRegionalGraph(graph || {});
  const byId = new Map(current.channels.map(c => [c.id, c]));
  for (const raw of channels) {
    const channel = normalizeChannel(raw);
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
        updatedAt: nowIso(),
      });
    } else {
      byId.set(channel.id, { ...channel, updatedAt: nowIso() });
    }
  }
  return ensureRegionalGraph({ ...current, channels: [...byId.values()], updatedAt: nowIso() });
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
  let rel = String(relationshipType);
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

export function syncRelationshipChannelBundle(graph, edge, relationshipType, options = {}) {
  const current = ensureRegionalGraph(graph || {});
  const bundle = relationshipChannelBundle(edge, relationshipType, options);
  const nextIds = new Set(bundle.map(channel => channel.id));
  const from = String(edge?.from || '');
  const to = String(edge?.to || '');
  const relationshipKey = options.relationshipKey || edge?.id || `${from}->${to}`;
  const samePair = channel =>
    (String(channel.from) === from && String(channel.to) === to)
    || (String(channel.from) === to && String(channel.to) === from);
  const now = options.now || nowIso();
  const channels = current.channels.map(channel => {
    const relationshipGenerated = channel.relationshipKey === relationshipKey
      || (samePair(channel) && (channel.evidence || []).some(item => item.source === 'relationship_label'));
    if (!relationshipGenerated || nextIds.has(channel.id)) return channel;
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
  return addRegionalChannels({ ...current, channels, updatedAt: now }, bundle);
}

export function setRegionalChannelStatus(graph, channelId, status) {
  if (!REGIONAL_CHANNEL_STATUSES.includes(status)) return ensureRegionalGraph(graph || {});
  const current = ensureRegionalGraph(graph || {});
  const channels = current.channels.map(channel => {
    if (channel.id !== channelId) return channel;
    return {
      ...channel,
      status,
      confirmedAt: status === 'confirmed' ? (channel.confirmedAt || nowIso()) : channel.confirmedAt,
      updatedAt: nowIso(),
    };
  });
  return ensureRegionalGraph({ ...current, channels, updatedAt: nowIso() });
}

export function setRegionalChannelVisibility(graph, channelId, visibility) {
  if (!REGIONAL_CHANNEL_VISIBILITIES.includes(visibility)) return ensureRegionalGraph(graph || {});
  const current = ensureRegionalGraph(graph || {});
  const channels = current.channels.map(channel => {
    if (channel.id !== channelId) return channel;
    return { ...channel, visibility, updatedAt: nowIso() };
  });
  return ensureRegionalGraph({ ...current, channels, updatedAt: nowIso() });
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

export function appendRegionalEvent(graph, event) {
  const current = ensureRegionalGraph(graph || {});
  return ensureRegionalGraph({
    ...current,
    eventLog: [...current.eventLog, { ...event, recordedAt: event.recordedAt || nowIso() }],
    updatedAt: nowIso(),
  });
}

export function queueRegionalImpacts(graph, impacts = []) {
  const current = ensureRegionalGraph(graph || {});
  const byId = new Map(current.queuedImpacts.map(i => [i.id, i]));
  for (const impact of impacts) {
    const normalized = normalizeImpact(impact);
    if (!normalized) continue;
    const previous = byId.get(normalized.id);
    const merged = { ...(previous || {}), ...normalized, updatedAt: nowIso() };
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
    updatedAt: nowIso(),
  });
}

export function setRegionalImpactStatus(graph, impactId, status, patch = {}) {
  if (!REGIONAL_IMPACT_STATUSES.includes(status)) return ensureRegionalGraph(graph || {});
  const current = ensureRegionalGraph(graph || {});
  const now = nowIso();
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
  return ensureRegionalGraph({ ...current, queuedImpacts, updatedAt: now });
}

export function isRegionalImpactAvailable(impact) {
  return impact?.status === 'queued' && (impact.delayTicks || 0) <= 0;
}

export function advanceRegionalImpacts(graph, ticks = 1, options = {}) {
  const current = ensureRegionalGraph(graph || {});
  const amount = Math.max(1, Math.floor(Number.isFinite(ticks) ? ticks : 1));
  const now = nowIso();
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
  return ensureRegionalGraph({ ...current, queuedImpacts, updatedAt: now });
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
