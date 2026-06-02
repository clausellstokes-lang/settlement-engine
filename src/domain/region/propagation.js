/**
 * domain/region/propagation.js
 *
 * Regional impact propagation across confirmed campaign channels. Direct
 * impacts are rule-based; follow-on waves are decayed, bounded transmissions
 * that keep campaign causality visible without turning one event into an
 * unbounded simulation.
 */

import { deriveLocalDelta } from './deriveRegionalState.js';
import {
  activeChannelsFrom,
  appendRegionalEvent,
  ensureRegionalGraph,
  queueRegionalImpacts,
} from './graph.js';
import { goodCriticality } from './goodsCatalog.js';
import { withActiveCondition } from '../activeConditions.js';

const REGIONAL_RULE_TYPES = new Set([
  'trade_dependency',
  'export_market',
  'trade_route',
  'political_authority',
  'tax_obligation',
  'military_protection',
  'war_front',
  'service_dependency',
  'religious_authority',
  'criminal_corridor',
  'migration_pressure',
  'information_flow',
  'resource_competition',
]);

function clamp01(value) {
  const n = typeof value === 'number' && Number.isFinite(value) ? value : 0;
  return Math.max(0, Math.min(1, n));
}

function idPart(value) {
  return String(value || 'unknown')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 80) || 'unknown';
}

function maxGoodCriticality(goods = []) {
  if (!goods.length) return 0.4;
  return Math.max(...goods.map(g => goodCriticality(g)));
}

function eventType(localDelta) {
  return localDelta?.cause?.event?.type || null;
}

function eventSeverity(localDelta, fallback = 0.5) {
  const severity = localDelta?.cause?.event?.payload?.severity;
  if (typeof severity === 'number' && Number.isFinite(severity)) {
    return clamp01(severity);
  }
  return fallback;
}

function matchingGoods(channel, change) {
  if (!Array.isArray(channel.goods) || !channel.goods.length) return [];
  if (change.good?.id) {
    return channel.goods.filter(g => g.id === change.good.id);
  }
  if (change.chain?.resource) {
    const resource = String(change.chain.resource).toLowerCase();
    return channel.goods.filter(g =>
      resource.includes(String(g.label || g.id).toLowerCase())
      || String(g.label || g.id).toLowerCase().includes(resource)
    );
  }
  return [];
}

function impactId(channel, localDelta, kind, goods) {
  const goodsPart = goods?.length ? goods.map(g => g.id).sort().join('_') : 'general';
  return [
    'regional_impact',
    idPart(localDelta.cause?.event?.id || localDelta.id),
    idPart(channel.id),
    idPart(kind),
    idPart(goodsPart),
  ].join('.');
}

function severityFor(channel, change, goods = [], multiplier = 1) {
  const channelStrength = clamp01(channel.strength ?? 0.5);
  const changeMagnitude = clamp01(change.magnitude ?? 0.4);
  const goodWeight = maxGoodCriticality(goods);
  return clamp01((0.25 + channelStrength * 0.45 + goodWeight * 0.2) * changeMagnitude * multiplier);
}

function impact(channel, localDelta, change, kind, goods, detail = {}) {
  const severity = detail.severity ?? severityFor(channel, change, goods, detail.severityMultiplier ?? 1);
  if (severity < 0.08) return null;
  return {
    id: impactId(channel, localDelta, kind, goods),
    kind,
    sourceSettlementId: channel.from,
    sourceSettlementName: localDelta.sourceSettlementName,
    targetSettlementId: channel.to,
    channelId: channel.id,
    channelType: channel.type,
    goods: goods.map(g => ({ ...g })),
    severity,
    confidence: channel.confidence,
    status: 'queued',
    delayTicks: detail.delayTicks ?? (severity >= 0.65 ? 0 : 1),
    maxAgeTicks: detail.maxAgeTicks ?? 12,
    waveDepth: detail.waveDepth ?? 0,
    waveDecay: detail.waveDecay ?? 1,
    sourceImpactId: detail.sourceImpactId || null,
    pathSettlementIds: detail.pathSettlementIds || [String(channel.from), String(channel.to)],
    sourceChange: {
      kind: change.kind,
      source: change.source,
      variable: change.variable || null,
      chainId: change.chain?.id || null,
    },
    explanation: detail.explanation || explainImpact(kind, channel, localDelta, goods),
    createdAt: new Date().toISOString(),
  };
}

function explainImpact(kind, channel, localDelta, goods) {
  const goodText = goods?.length ? goods.map(g => g.label).join(', ') : 'trade access';
  if (kind === 'import_shortage') {
    return `${localDelta.sourceSettlementName || channel.from} can no longer reliably supply ${goodText}.`;
  }
  if (kind === 'export_market_loss') {
    return `${localDelta.sourceSettlementName || channel.from} is a weaker market for ${goodText}.`;
  }
  if (kind === 'route_disruption') {
    return `A route shock at ${localDelta.sourceSettlementName || channel.from} threatens connected trade access.`;
  }
  if (kind === 'authority_instability') {
    return `${localDelta.sourceSettlementName || channel.from} is transmitting political instability.`;
  }
  if (kind === 'tax_revenue_disruption') {
    return `${localDelta.sourceSettlementName || channel.from} is less able to meet regional obligations.`;
  }
  if (kind === 'protection_gap') {
    return `${localDelta.sourceSettlementName || channel.from} is less able to provide protection.`;
  }
  if (kind === 'service_disruption') {
    return `${localDelta.sourceSettlementName || channel.from} is less able to provide regional services.`;
  }
  if (kind === 'conflict_pressure') {
    return `Conflict pressure at ${localDelta.sourceSettlementName || channel.from} threatens connected settlements.`;
  }
  if (kind === 'migration_pressure') {
    return `${localDelta.sourceSettlementName || channel.from} is pushing migration pressure through the region.`;
  }
  if (kind === 'information_shock') {
    return `News from ${localDelta.sourceSettlementName || channel.from} is likely to travel through the region.`;
  }
  if (kind === 'criminal_pressure') {
    return `Instability around ${localDelta.sourceSettlementName || channel.from} is feeding a criminal corridor.`;
  }
  if (kind === 'religious_pressure') {
    return `Religious authority around ${localDelta.sourceSettlementName || channel.from} is under regional strain.`;
  }
  return `Regional impact through ${channel.type}.`;
}

function waveImpactId(channel, sourceImpact, depth, kind, goods) {
  const goodsPart = goods?.length ? goods.map(g => g.id).sort().join('_') : 'general';
  return [
    'regional_wave',
    idPart(sourceImpact.id),
    idPart(channel.id),
    idPart(kind),
    `d${depth}`,
    idPart(goodsPart),
  ].join('.');
}

function goodsForWave(channel, sourceImpact) {
  const channelGoods = Array.isArray(channel.goods) ? channel.goods : [];
  const sourceGoods = Array.isArray(sourceImpact.goods) ? sourceImpact.goods : [];
  if (!channelGoods.length) return sourceGoods.map(g => ({ ...g }));
  if (!sourceGoods.length) return channelGoods.map(g => ({ ...g }));
  const sourceIds = new Set(sourceGoods.map(g => g.id));
  return channelGoods.filter(g => sourceIds.has(g.id)).map(g => ({ ...g }));
}

function waveKindForChannel(channel, sourceImpact) {
  if (channel.type === 'trade_dependency') {
    if (['route_disruption', 'export_market_loss'].includes(sourceImpact.kind)) return 'route_disruption';
    return 'import_shortage';
  }
  if (channel.type === 'export_market') return 'export_market_loss';
  if (channel.type === 'trade_route') return 'route_disruption';
  if (channel.type === 'political_authority') return 'authority_instability';
  if (channel.type === 'tax_obligation') return 'tax_revenue_disruption';
  if (channel.type === 'military_protection') return 'protection_gap';
  if (channel.type === 'war_front' || channel.type === 'resource_competition') return 'conflict_pressure';
  if (channel.type === 'service_dependency') return 'service_disruption';
  if (channel.type === 'religious_authority') return 'religious_pressure';
  if (channel.type === 'criminal_corridor') return 'criminal_pressure';
  if (channel.type === 'migration_pressure') return 'migration_pressure';
  if (channel.type === 'information_flow') return 'information_shock';
  return sourceImpact.kind;
}

function waveImpactForChannel(channel, sourceImpact, depth, decay) {
  const path = Array.isArray(sourceImpact.pathSettlementIds)
    ? sourceImpact.pathSettlementIds.map(String)
    : [String(sourceImpact.sourceSettlementId), String(sourceImpact.targetSettlementId)];
  if (path.includes(String(channel.to))) return null;

  const goods = goodsForWave(channel, sourceImpact);
  if (['trade_dependency', 'export_market'].includes(channel.type) && channel.goods?.length && sourceImpact.goods?.length && !goods.length) {
    return null;
  }

  const kind = waveKindForChannel(channel, sourceImpact);
  const severity = clamp01((sourceImpact.severity || 0) * clamp01(channel.strength ?? 0.5) * decay);
  if (severity < 0.08) return null;
  const nextPath = [...path, String(channel.to)];
  return {
    id: waveImpactId(channel, sourceImpact, depth, kind, goods),
    kind,
    sourceSettlementId: channel.from,
    sourceSettlementName: sourceImpact.targetSettlementName || sourceImpact.targetSettlementId || channel.from,
    targetSettlementId: channel.to,
    channelId: channel.id,
    channelType: channel.type,
    goods,
    severity,
    confidence: clamp01((sourceImpact.confidence ?? 0.5) * (channel.confidence ?? 0.5)),
    status: 'queued',
    delayTicks: Math.max(0, (sourceImpact.delayTicks || 0) + 1),
    maxAgeTicks: sourceImpact.maxAgeTicks ?? 12,
    waveDepth: depth,
    waveDecay: decay,
    sourceImpactId: sourceImpact.id,
    pathSettlementIds: nextPath,
    sourceChange: {
      kind: 'regional_wave',
      source: 'regional_engine',
      variable: sourceImpact.kind,
      chainId: sourceImpact.sourceChange?.chainId || null,
    },
    explanation: `${sourceImpact.explanation || 'Regional pressure'} The pressure continues through ${channel.type.replace(/_/g, ' ')}.`,
    createdAt: new Date().toISOString(),
  };
}

function ruleTradeDependency(channel, localDelta, change) {
  const goods = matchingGoods(channel, change);
  if (!goods.length) return null;
  if (change.kind === 'export_lost' || change.kind === 'local_production_lost' || change.kind === 'chain_degraded' || change.kind === 'depleted_good_gained') {
    return impact(channel, localDelta, change, 'import_shortage', goods);
  }
  if (change.kind === 'route_cut') {
    return impact(channel, localDelta, change, 'route_disruption', channel.goods || []);
  }
  return null;
}

function ruleExportMarket(channel, localDelta, change) {
  if (change.kind !== 'route_cut' && change.kind !== 'causal_shift') return null;
  if (change.kind === 'causal_shift' && !['trade_connectivity', 'resourcePressure', 'resilience'].includes(change.variable)) {
    return null;
  }
  const goods = channel.goods || [];
  return impact(channel, localDelta, change, 'export_market_loss', goods);
}

function ruleTradeRoute(channel, localDelta, change) {
  if (change.kind !== 'route_cut') return null;
  return impact(channel, localDelta, change, 'route_disruption', []);
}

function rulePoliticalAuthority(channel, localDelta, change) {
  if (change.kind === 'authority_shock' || change.kind === 'legitimacy_shock') {
    return impact(channel, localDelta, change, 'authority_instability', []);
  }
  if (change.kind === 'causal_shift' && ['public_legitimacy', 'faction_power', 'social_trust'].includes(change.variable)) {
    return impact(channel, localDelta, change, 'authority_instability', []);
  }
  return null;
}

function ruleTaxObligation(channel, localDelta, change) {
  if (change.kind === 'route_cut' || change.kind === 'export_lost' || change.kind === 'chain_degraded') {
    return impact(channel, localDelta, change, 'tax_revenue_disruption', channel.goods || []);
  }
  if (change.kind === 'causal_shift' && ['merchant_wealth', 'trade_connectivity', 'resourcePressure'].includes(change.variable)) {
    return impact(channel, localDelta, change, 'tax_revenue_disruption', channel.goods || []);
  }
  return null;
}

function ruleMilitaryProtection(channel, localDelta, change) {
  if (change.kind === 'security_shock' || change.kind === 'authority_shock') {
    return impact(channel, localDelta, change, 'protection_gap', []);
  }
  if (change.kind === 'causal_shift' && ['defense_readiness', 'resilience', 'externalThreat'].includes(change.variable)) {
    return impact(channel, localDelta, change, 'protection_gap', []);
  }
  return null;
}

function ruleWarFront(channel, localDelta, change) {
  if (change.kind === 'security_shock' || change.kind === 'route_cut') {
    return impact(channel, localDelta, change, 'conflict_pressure', []);
  }
  if (eventType(localDelta) === 'RAID_OR_MONSTER_ATTACK' && eventSeverity(localDelta, 0.6) >= 0.35) {
    return impact(channel, localDelta, change, 'conflict_pressure', []);
  }
  return null;
}

function ruleServiceDependency(channel, localDelta, change) {
  if (change.kind === 'health_shock' || change.kind === 'authority_shock') {
    return impact(channel, localDelta, change, 'service_disruption', channel.goods || []);
  }
  return null;
}

function ruleReligiousAuthority(channel, localDelta, change) {
  if (change.kind === 'health_shock' || change.kind === 'legitimacy_shock') {
    return impact(channel, localDelta, change, 'religious_pressure', []);
  }
  return null;
}

function ruleCriminalCorridor(channel, localDelta, change) {
  if (change.kind === 'legitimacy_shock' || change.kind === 'security_shock') {
    return impact(channel, localDelta, change, 'criminal_pressure', []);
  }
  if (change.kind === 'causal_shift' && ['criminal_opportunity', 'social_trust', 'merchant_wealth'].includes(change.variable)) {
    return impact(channel, localDelta, change, 'criminal_pressure', []);
  }
  return null;
}

function ruleMigrationPressure(channel, localDelta, change) {
  if (change.kind === 'migration_wave' || change.kind === 'health_shock' || change.kind === 'security_shock') {
    return impact(channel, localDelta, change, 'migration_pressure', []);
  }
  return null;
}

function ruleInformationFlow(channel, localDelta, change) {
  if (['authority_shock', 'legitimacy_shock', 'health_shock', 'security_shock', 'migration_wave'].includes(change.kind)) {
    return impact(channel, localDelta, change, 'information_shock', []);
  }
  return null;
}

function ruleResourceCompetition(channel, localDelta, change) {
  if (change.kind === 'depleted_good_gained' || change.kind === 'local_production_lost' || change.kind === 'chain_degraded') {
    return impact(channel, localDelta, change, 'conflict_pressure', change.good ? [change.good] : []);
  }
  return null;
}

function impactForChannel(channel, localDelta, change) {
  if (!REGIONAL_RULE_TYPES.has(channel.type)) return null;
  if (channel.type === 'trade_dependency') return ruleTradeDependency(channel, localDelta, change);
  if (channel.type === 'export_market') return ruleExportMarket(channel, localDelta, change);
  if (channel.type === 'trade_route') return ruleTradeRoute(channel, localDelta, change);
  if (channel.type === 'political_authority') return rulePoliticalAuthority(channel, localDelta, change);
  if (channel.type === 'tax_obligation') return ruleTaxObligation(channel, localDelta, change);
  if (channel.type === 'military_protection') return ruleMilitaryProtection(channel, localDelta, change);
  if (channel.type === 'war_front') return ruleWarFront(channel, localDelta, change);
  if (channel.type === 'service_dependency') return ruleServiceDependency(channel, localDelta, change);
  if (channel.type === 'religious_authority') return ruleReligiousAuthority(channel, localDelta, change);
  if (channel.type === 'criminal_corridor') return ruleCriminalCorridor(channel, localDelta, change);
  if (channel.type === 'migration_pressure') return ruleMigrationPressure(channel, localDelta, change);
  if (channel.type === 'information_flow') return ruleInformationFlow(channel, localDelta, change);
  if (channel.type === 'resource_competition') return ruleResourceCompetition(channel, localDelta, change);
  return null;
}

export function deriveRegionalImpacts(localDelta, graph, options = {}) {
  if (!localDelta?.sourceSettlementId) return [];
  const current = ensureRegionalGraph(graph || {});
  const channels = activeChannelsFrom(graph, localDelta.sourceSettlementId, {
    includeSuggested: !!options.includeSuggested,
    types: options.types || [...REGIONAL_RULE_TYPES],
  });
  const out = [];
  const seen = new Set();
  for (const channel of channels) {
    for (const change of localDelta.changes || []) {
      const next = impactForChannel(channel, localDelta, change);
      if (!next || seen.has(next.id)) continue;
      seen.add(next.id);
      out.push(next);
    }
  }
  const maxDepth = Math.max(0, Math.floor(Number.isFinite(options.maxDepth) ? options.maxDepth : 1));
  const waveDecay = clamp01(options.waveDecay ?? 0.45);
  let frontier = out;
  for (let depth = 1; depth <= maxDepth && frontier.length; depth += 1) {
    const nextFrontier = [];
    for (const sourceImpact of frontier) {
      const waveChannels = activeChannelsFrom(current, sourceImpact.targetSettlementId, {
        includeSuggested: !!options.includeSuggested,
        types: options.types || [...REGIONAL_RULE_TYPES],
      });
      for (const channel of waveChannels) {
        const next = waveImpactForChannel(channel, sourceImpact, depth, waveDecay);
        if (!next || seen.has(next.id)) continue;
        seen.add(next.id);
        out.push(next);
        nextFrontier.push(next);
      }
    }
    frontier = nextFrontier;
  }
  return out;
}

export function aggregateImpactBundles(impacts = []) {
  const groups = new Map();
  for (const impactItem of impacts) {
    const key = `${impactItem.targetSettlementId}:${impactItem.kind}`;
    if (!groups.has(key)) {
      groups.set(key, {
        id: `impact_bundle.${idPart(key)}`,
        targetSettlementId: impactItem.targetSettlementId,
        kind: impactItem.kind,
        impacts: [],
        goods: [],
        severity: 0,
        explanation: '',
      });
    }
    const bundle = groups.get(key);
    bundle.impacts.push(impactItem);
    bundle.severity = Math.max(bundle.severity, impactItem.severity);
    for (const good of impactItem.goods || []) {
      if (!bundle.goods.some(g => g.id === good.id)) bundle.goods.push(good);
    }
  }

  return [...groups.values()].map(bundle => ({
    ...bundle,
    severity: clamp01(bundle.severity + Math.min(0.2, (bundle.impacts.length - 1) * 0.05)),
    explanation: explainBundle(bundle),
  }));
}

function explainBundle(bundle) {
  const goods = bundle.goods.length ? bundle.goods.map(g => g.label).join(', ') : 'trade access';
  if (bundle.kind === 'import_shortage') return `Import pressure around ${goods}.`;
  if (bundle.kind === 'export_market_loss') return `Export-market pressure around ${goods}.`;
  if (bundle.kind === 'route_disruption') return 'Regional trade-route disruption.';
  if (bundle.kind === 'authority_instability') return 'Regional authority instability.';
  if (bundle.kind === 'tax_revenue_disruption') return 'Regional revenue disruption.';
  if (bundle.kind === 'protection_gap') return 'Regional protection gap.';
  if (bundle.kind === 'service_disruption') return 'Regional service disruption.';
  if (bundle.kind === 'conflict_pressure') return 'Regional conflict pressure.';
  if (bundle.kind === 'migration_pressure') return 'Regional migration pressure.';
  if (bundle.kind === 'information_shock') return 'Regional information shock.';
  if (bundle.kind === 'criminal_pressure') return 'Regional criminal pressure.';
  if (bundle.kind === 'religious_pressure') return 'Regional religious pressure.';
  return `${bundle.kind.replace(/_/g, ' ')}.`;
}

export function defaultFocusPolicy({ targetSettlementId, activeSettlementId, visibleSettlementIds = [] }) {
  if (activeSettlementId && String(targetSettlementId) === String(activeSettlementId)) return 'full';
  if (visibleSettlementIds.map(String).includes(String(targetSettlementId))) return 'partial';
  return 'queue';
}

function archetypeForImpact(impactItem) {
  if (impactItem.kind === 'import_shortage') return 'regional_import_shortage';
  if (impactItem.kind === 'export_market_loss') return 'regional_export_market_loss';
  if (impactItem.kind === 'route_disruption') return 'regional_route_disruption';
  if (impactItem.kind === 'authority_instability') return 'regional_authority_instability';
  if (impactItem.kind === 'tax_revenue_disruption') return 'regional_tax_revenue_disruption';
  if (impactItem.kind === 'protection_gap') return 'regional_protection_gap';
  if (impactItem.kind === 'service_disruption') return 'regional_service_disruption';
  if (impactItem.kind === 'conflict_pressure') return 'regional_conflict_pressure';
  if (impactItem.kind === 'migration_pressure') return 'regional_migration_pressure';
  if (impactItem.kind === 'information_shock') return 'regional_information_shock';
  if (impactItem.kind === 'criminal_pressure') return 'regional_criminal_pressure';
  if (impactItem.kind === 'religious_pressure') return 'regional_religious_pressure';
  return 'regional_pressure';
}

function affectedSystemsForImpact(impactItem) {
  const goodCritical = maxGoodCriticality(impactItem.goods || []);
  if (impactItem.kind === 'import_shortage') {
    const systems = ['trade_connectivity', 'public_legitimacy'];
    if (goodCritical >= 0.8) systems.push('food_security');
    if (goodCritical >= 0.65) systems.push('labor_capacity');
    return systems;
  }
  if (impactItem.kind === 'export_market_loss') {
    return ['trade_connectivity', 'faction_power', 'public_legitimacy'];
  }
  if (impactItem.kind === 'route_disruption') {
    return ['trade_connectivity', 'merchant_wealth', 'public_legitimacy'];
  }
  if (impactItem.kind === 'authority_instability') {
    return ['public_legitimacy', 'faction_power', 'social_trust'];
  }
  if (impactItem.kind === 'tax_revenue_disruption') {
    return ['merchant_wealth', 'faction_power', 'public_legitimacy'];
  }
  if (impactItem.kind === 'protection_gap') {
    return ['defense_readiness', 'trade_connectivity', 'public_legitimacy'];
  }
  if (impactItem.kind === 'service_disruption') {
    return ['healing_capacity', 'merchant_wealth', 'public_legitimacy'];
  }
  if (impactItem.kind === 'conflict_pressure') {
    return ['defense_readiness', 'trade_connectivity', 'public_legitimacy'];
  }
  if (impactItem.kind === 'migration_pressure') {
    return ['food_security', 'labor_capacity', 'public_legitimacy'];
  }
  if (impactItem.kind === 'information_shock') {
    return ['public_legitimacy', 'social_trust', 'faction_power'];
  }
  if (impactItem.kind === 'criminal_pressure') {
    return ['criminal_opportunity', 'social_trust', 'merchant_wealth'];
  }
  if (impactItem.kind === 'religious_pressure') {
    return ['public_legitimacy', 'social_trust', 'healing_capacity'];
  }
  return ['trade_connectivity'];
}

export function conditionFromRegionalImpact(impactItem, options = {}) {
  const goods = impactItem.goods?.length ? impactItem.goods.map(g => g.label).join(', ') : null;
  const label =
    impactItem.kind === 'import_shortage' ? `Regional import shortage${goods ? `: ${goods}` : ''}` :
    impactItem.kind === 'export_market_loss' ? `Export market weakened${goods ? `: ${goods}` : ''}` :
    impactItem.kind === 'route_disruption' ? 'Regional route disruption' :
    impactItem.kind === 'authority_instability' ? 'Regional authority instability' :
    impactItem.kind === 'tax_revenue_disruption' ? 'Regional revenue disruption' :
    impactItem.kind === 'protection_gap' ? 'Regional protection gap' :
    impactItem.kind === 'service_disruption' ? 'Regional service disruption' :
    impactItem.kind === 'conflict_pressure' ? 'Regional conflict pressure' :
    impactItem.kind === 'migration_pressure' ? 'Regional migration pressure' :
    impactItem.kind === 'information_shock' ? 'Regional information shock' :
    impactItem.kind === 'criminal_pressure' ? 'Regional criminal pressure' :
    impactItem.kind === 'religious_pressure' ? 'Regional religious pressure' :
    'Regional pressure';
  return {
    id: `condition.${archetypeForImpact(impactItem)}.${idPart(impactItem.id)}`,
    archetype: archetypeForImpact(impactItem),
    label,
    description: impactItem.explanation,
    severity: impactItem.severity,
    status: impactItem.severity >= 0.65 ? 'worsening' : 'stable',
    triggeredAt: {
      tick: options.tick ?? 0,
      sourceEventType: impactItem.sourceChange?.kind || impactItem.kind,
      sourceEventTargetId: impactItem.sourceSettlementId,
    },
    duration: {
      elapsedTicks: 0,
      expiresAtTicks: impactItem.severity >= 0.65 ? 10 : 6,
    },
    affectedSystems: affectedSystemsForImpact(impactItem),
    causes: [{
      source: impactItem.channelId,
      effect: impactItem.kind,
      reason: impactItem.explanation,
    }],
  };
}

export function applyRegionalImpact(settlement, impactItem, options = {}) {
  if (!settlement || !impactItem) return settlement;
  return withActiveCondition(settlement, conditionFromRegionalImpact(impactItem, options));
}

/**
 * Pure regional propagation for one before/after local event.
 *
 * @param {Object} [args]
 * @param {Object} [args.graph]
 * @param {Object} [args.beforeSettlement]
 * @param {Object} [args.afterSettlement]
 * @param {Object|null} [args.event]
 * @param {string|null} [args.activeSettlementId]
 * @param {string[]} [args.visibleSettlementIds]
 * @param {boolean} [args.includeSuggested]
 * @param {number} [args.maxDepth]
 * @param {number} [args.waveDecay]
 */
export function propagateRegionalEvent(args = {}) {
  const {
    graph,
    beforeSettlement,
    afterSettlement,
    event = null,
    activeSettlementId = null,
    visibleSettlementIds = [],
    includeSuggested = false,
    maxDepth = 1,
    waveDecay = 0.45,
  } = args;
  const current = ensureRegionalGraph(graph || {});
  const localDelta = deriveLocalDelta(beforeSettlement, afterSettlement, { event });
  const impacts = deriveRegionalImpacts(localDelta, current, { includeSuggested, maxDepth, waveDecay });
  const bundles = aggregateImpactBundles(impacts);
  const focusDecisions = bundles.map(bundle => ({
    bundleId: bundle.id,
    targetSettlementId: bundle.targetSettlementId,
    focus: defaultFocusPolicy({
      targetSettlementId: bundle.targetSettlementId,
      activeSettlementId,
      visibleSettlementIds,
    }),
  }));

  let nextGraph = appendRegionalEvent(current, {
    id: `regional_event.${idPart(localDelta.id)}`,
    sourceSettlementId: localDelta.sourceSettlementId,
    sourceSettlementName: localDelta.sourceSettlementName,
    sourceEvent: event ? { id: event.id || null, type: event.type || null, targetId: event.targetId || null } : null,
    localDelta,
    impactIds: impacts.map(i => i.id),
  });
  nextGraph = queueRegionalImpacts(nextGraph, impacts);

  return {
    graph: nextGraph,
    localDelta,
    impacts,
    bundles,
    focusDecisions,
  };
}
