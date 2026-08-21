/**
 * regionalFingerprint.js — privacy-safe extraction of REGIONAL / intersettlement
 * mutations. Same allowlist discipline as structuralFingerprint.js /
 * pulseFingerprint.js: copy ONLY enums, catalog ids, bands, counts — never
 * settlement names, prose headlines/summaries, or coordinates. The guarantee is
 * a TEST (tests/lib/regionalFingerprint.test.js).
 *
 *   - extractRegionalGraphSnapshot(graph) — topology/size of the region graph
 *     (RESEARCH; activates the long-dead regional_graph_snapshot event).
 *   - extractRegionalImpactDecision(impact, resolution, wasDmAction) — the
 *     accept/ignore/resolve of a cross-settlement impact (the permission signal).
 *   - extractRegionalChannelChange(channel, fromStatus, toStatus, wasDmAction)
 *     — channel curation with provenance + strength/visibility bands.
 *   - extractRegionalArcs(result) — realm/compound arc emergence from a pulse.
 *
 * NEVER copied: settlement names/ids (only counts), impact/channel prose
 * (explanation/headline/summary), goods detail beyond a count.
 */

import { band5, severityBand } from './structuralFingerprint.js';

const arr = (v) => (Array.isArray(v) ? v : []);
const num = (v) => (Number.isFinite(Number(v)) ? Number(v) : undefined);
const enumStr = (v) => (typeof v === 'string' && v.length > 0 && v.length <= 48 ? v : undefined);

/** Count array entries grouped by an enum field accessor. */
function tally(list, keyFn) {
  const out = {};
  for (const it of arr(list)) {
    const k = keyFn(it);
    if (k) out[k] = (out[k] || 0) + 1;
  }
  return out;
}

const topologyBand = (nodes) => {
  const n = Number(nodes) || 0;
  if (n < 3) return 'tiny';
  if (n < 8) return 'small';
  if (n < 20) return 'medium';
  return 'large';
};

// ── regional graph snapshot (RESEARCH) ───────────────────────────────────────
export function extractRegionalGraphSnapshot(graph) {
  if (!graph || typeof graph !== 'object') return null;
  const channels = arr(graph.channels);
  const queued = arr(graph.queuedImpacts);
  // fan-out: max confirmed/active channels emanating from a single settlement
  const perSettlement = {};
  for (const ch of channels) {
    const from = enumStr(String(ch?.from ?? ''));
    if (from) perSettlement[from] = (perSettlement[from] || 0) + 1;
  }
  const maxFanOut = Object.values(perSettlement).reduce((m, v) => Math.max(m, v), 0);
  return {
    node_count: arr(graph.nodes).length,
    edge_count: arr(graph.edges).length,
    channel_count: channels.length,
    channels_by_type: tally(channels, (c) => enumStr(c?.type)),
    channels_by_status: tally(channels, (c) => enumStr(c?.status)),
    channels_by_visibility: tally(channels, (c) => enumStr(c?.visibility)),
    queued_impact_count: queued.length,
    impacts_by_status: tally(queued, (i) => enumStr(i?.status)),
    impacts_by_kind: tally(queued, (i) => enumStr(i?.kind)),
    max_channels_per_settlement: maxFanOut,
    topology_size_band: topologyBand(arr(graph.nodes).length),
  };
}

// ── channel provenance (relationship-bundle vs discovered vs inferred) ────────
function channelProvenance(channel) {
  const rel = enumStr(channel?.relationshipType);
  if (rel === 'channel_inferred') return 'channel_inferred';
  if (rel) return 'relationship_bundle';
  return 'discovered';
}

// ── impact decision (accept / ignore / resolve / expire) ─────────────────────
/** resolution: applied | ignored | resolved | expired ; wasDmAction: boolean. */
export function extractRegionalImpactDecision(impact, resolution, wasDmAction) {
  const i = impact || {};
  return {
    resolution: enumStr(resolution) || 'unknown',
    was_dm_action: wasDmAction === true,
    impact_kind: enumStr(i.kind),
    channel_type: enumStr(i.channelType),
    severity_band: i.severity != null ? severityBand(i.severity) : undefined,
    wave_depth: num(i.waveDepth) ?? 0,
    delay_ticks: num(i.delayTicks),
    source_change_kind: enumStr(i.sourceChange?.kind),
  };
}

// ── channel status change (DM curation vs auto label-driven) ─────────────────
export function extractRegionalChannelChange(channel, fromStatus, toStatus, wasDmAction) {
  const c = channel || {};
  return {
    channel_type: enumStr(c.type),
    from_status: enumStr(fromStatus),
    to_status: enumStr(toStatus),
    visibility: enumStr(c.visibility),
    strength_band: c.strength != null ? band5(Number(c.strength) * 100) : undefined,
    confidence_band: c.confidence != null ? band5(Number(c.confidence) * 100) : undefined,
    provenance: channelProvenance(c),
    relationship_type: enumStr(c.relationshipType),
    was_dm_action: wasDmAction === true,
  };
}

// ── realm / compound arc emergence (from a pulse result's wizard news) ────────
const ARC_KINDS = new Set(['realm', 'compound']);

export function extractRegionalArcs(result) {
  const tick = num(result?.tick);
  const entries = arr(result?.wizardNews?.entries);
  const arcs = [];
  for (const e of entries) {
    if (!ARC_KINDS.has(e?.kind)) continue;
    if (tick != null && Number(e?.tick) !== tick) continue; // only THIS pulse's arcs
    arcs.push({
      arc_kind: enumStr(e.kind),
      signature_key: enumStr(e.impactKind),     // realm_<type> / compound_<sig>
      scope: enumStr(e.scope),
      severity_band: e.severity != null ? severityBand(e.severity) : undefined,
      settlement_count: arr(e.settlementIds).length,
    });
  }
  return arcs;
}

// ── neighbour binding at generation (the generation-time neighbour bias) ──────
/**
 * What a bound neighbour did to THIS settlement's generation. relationship_type
 * is already on generation_completed; the novel signal here is which axes the
 * neighbour mechanically BIASED (from the resolveNeighbour trace's "honest
 * receipts") — relationship_type alone does not reveal whether a bias fired.
 * Non-personal: the neighbour NAME (in the trace targetId / neighborRelationship)
 * is never copied.
 */
export function extractNeighbourGenerated(settlement) {
  const nr = settlement?.neighborRelationship;
  if (!nr) return null;
  const entry = arr(settlement?.simulationTrace)
    .find(t => typeof t?.targetId === 'string' && t.targetId.startsWith('neighbour.'));
  const axes = entry
    ? [...new Set(arr(entry.downstreamEffects).map(e => enumStr(e?.target)).filter(Boolean))]
    : [];
  return {
    relationship_type: enumStr(nr.relationshipType),
    neighbour_tier: enumStr(nr.tier),
    bias_axes: axes,                                   // economicState|factions|institutions|effectiveScores|generation
    had_mechanical_effect: axes.some(a => a !== 'generation'), // 'generation' = the no-bias receipt
  };
}

// ── propagation moment (a settlement change rippling across the region) ───────
/**
 * Summarize one cross-settlement propagation. impacts = the new impact objects
 * (each {kind, channelType, severity, waveDepth}); changes = the typed local
 * delta changes; genesis = 'canon_edit' | 'world_pulse'. Returns null when
 * nothing propagated. Non-personal: kinds/channels/bands/counts only.
 * @param {{ impacts?: any[], changes?: any[], genesis?: string, maxDepth?: number }} [args]
 */
export function extractRegionalPropagation({ impacts, changes, genesis, maxDepth } = {}) {
  const imps = arr(impacts);
  if (!imps.length) return null;
  let maxSev = 0; let maxWave = 0; let direct = 0; let wave = 0;
  for (const i of imps) {
    const wd = num(i?.waveDepth) ?? 0;
    if (wd > 0) wave += 1; else direct += 1;
    if (wd > maxWave) maxWave = wd;
    const sev = Number(i?.severity);
    if (Number.isFinite(sev) && sev > maxSev) maxSev = sev;
  }
  return {
    trigger_genesis: enumStr(genesis) || 'unknown',
    max_depth: num(maxDepth) ?? null,
    impact_count: imps.length,
    direct_impact_count: direct,
    wave_impact_count: wave,
    impact_kinds: tally(imps, i => enumStr(i?.kind)),
    channel_types: tally(imps, i => enumStr(i?.channelType)),
    severity_band_max: severityBand(maxSev),
    wave_depth_max: maxWave,
    change_kinds: tally(changes, c => enumStr(c?.kind)),
  };
}
