import { ensureRegionalGraph } from '../domain/region/index.js';

const CHANNEL_COLORS = Object.freeze({
  trade_dependency: '#0f766e',
  export_market: '#a0762a',
  trade_route: '#2563eb',
  political_authority: '#7c3aed',
  tax_obligation: '#9a3412',
  military_protection: '#1d4ed8',
  war_front: '#b91c1c',
  service_dependency: '#047857',
  religious_authority: '#9333ea',
  criminal_corridor: '#4c1d95',
  migration_pressure: '#c2410c',
  information_flow: '#0369a1',
  resource_competition: '#854d0e',
});

const IMPACT_COLORS = Object.freeze({
  queued: '#c98500',
  applied: '#2a7a2a',
  ignored: '#8a8174',
  expired: '#8a8174',
  resolved: '#4f6f8f',
});

function pointBySettlement(placements = {}) {
  const out = new Map();
  for (const placement of Object.values(placements || {})) {
    if (!placement?.settlementId) continue;
    if (typeof placement.x !== 'number' || typeof placement.y !== 'number') continue;
    out.set(String(placement.settlementId), { x: placement.x, y: placement.y });
  }
  return out;
}

export function regionalChannelColor(type) {
  return CHANNEL_COLORS[type] || '#6f5f4d';
}

export function regionalImpactColor(status) {
  return IMPACT_COLORS[status] || '#c98500';
}

export function buildRegionalMapOverlay({
  campaign,
  placements,
  includeGm = true,
  includeHidden = false,
  channelTypes = null,
  impactStatuses = ['queued', 'applied', 'resolved'],
  minSeverity = 0,
} = /** @type {{ campaign?: any, placements?: any, includeGm?: boolean, includeHidden?: boolean, channelTypes?: string[]|null, impactStatuses?: string[]|null, minSeverity?: number }} */ ({})) {
  const graph = ensureRegionalGraph(campaign?.regionalGraph);
  const points = pointBySettlement(placements);
  const nodeNames = new Map(graph.nodes.map(node => [String(node.id), node.name]));
  const channelTypeSet = Array.isArray(channelTypes)
    ? new Set(channelTypes)
    : null;
  const impactStatusSet = Array.isArray(impactStatuses)
    ? new Set(impactStatuses)
    : null;
  const severityFloor = Math.max(0, Math.min(1, Number.isFinite(minSeverity) ? minSeverity : 0));

  const channels = graph.channels
    .filter(channel => channel.status === 'confirmed')
    .filter(channel => !channelTypeSet || channelTypeSet.has(channel.type))
    .filter(channel => includeHidden || channel.visibility !== 'hidden')
    .filter(channel => includeGm || channel.visibility !== 'gm')
    .map(channel => ({
      ...channel,
      fromPoint: points.get(String(channel.from)),
      toPoint: points.get(String(channel.to)),
      fromName: nodeNames.get(String(channel.from)) || channel.from,
      toName: nodeNames.get(String(channel.to)) || channel.to,
      color: regionalChannelColor(channel.type),
    }))
    .filter(channel => channel.fromPoint && channel.toPoint);

  const impacts = graph.queuedImpacts
    .filter(impact => !impactStatusSet || impactStatusSet.has(impact.status))
    .filter(impact => (impact.severity || 0) >= severityFloor)
    .map(impact => ({
      ...impact,
      point: points.get(String(impact.targetSettlementId)),
      sourceName: nodeNames.get(String(impact.sourceSettlementId)) || impact.sourceSettlementName || impact.sourceSettlementId,
      targetName: nodeNames.get(String(impact.targetSettlementId)) || impact.targetSettlementId,
      color: regionalImpactColor(impact.status),
    }))
    .filter(impact => impact.point);

  return { channels, impacts };
}
