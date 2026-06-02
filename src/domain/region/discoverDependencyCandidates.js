/**
 * domain/region/discoverDependencyCandidates.js
 *
 * Finds likely P0 regional channels between saved settlements. Discovery is
 * deliberately advisory: candidates start as suggested channels and become
 * campaign truth only after the DM confirms them.
 */

import { deriveRegionalState } from './deriveRegionalState.js';
import { addRegionalChannels, deriveRegionalGraphFromSaves, normalizeChannel } from './graph.js';
import { goodCriticality, goodsIntersect } from './goodsCatalog.js';

const TRADE_FRIENDLY_RELATIONSHIPS = new Set([
  'trade_partner',
  'allied',
  'ally',
  'patron',
  'client',
  'neutral',
]);

function relationBetween(sourceSave, targetSave) {
  const links = sourceSave?.settlement?.neighbourNetwork
    || sourceSave?.neighbourNetwork
    || [];
  const targetId = targetSave?.id || targetSave?.settlement?.id;
  const targetName = targetSave?.name || targetSave?.settlement?.name;
  const link = links.find(n =>
    (targetId && String(n.id || n.targetId) === String(targetId))
    || (targetName && (n.neighbourName === targetName || n.name === targetName))
  );
  return link?.relationshipType || link?.type || null;
}

function relationshipChannel({ type, from, to, rel, strength = 0.5, confidence = 0.6, explanation }) {
  return candidate({
    type,
    from: from.id,
    to: to.id,
    strength,
    confidence,
    goods: [],
    evidence: [{ source: 'neighbourNetwork', reason: `Relationship is ${rel}.` }],
    explanation: explanation || `${from.name} can transmit ${type.replace(/_/g, ' ')} pressure to ${to.name}.`,
  });
}

function addTwoWay(out, type, a, b, rel, strength, confidence, explanation) {
  out.push(relationshipChannel({ type, from: a, to: b, rel, strength, confidence, explanation }));
  out.push(relationshipChannel({ type, from: b, to: a, rel, strength, confidence, explanation }));
}

function discoverRelationshipChannels(sourceSave, targetSave, source, target) {
  const out = [];
  const sourceRel = relationBetween(sourceSave, targetSave);
  const targetRel = relationBetween(targetSave, sourceSave);

  for (const [rel, from, to] of [
    [sourceRel, source, target],
    [targetRel, target, source],
  ]) {
    if (!rel) continue;
    if (rel === 'patron') {
      out.push(relationshipChannel({
        type: 'political_authority',
        from: to,
        to: from,
        rel,
        strength: 0.62,
        confidence: 0.7,
        explanation: `${to.name} appears to exercise patron authority over ${from.name}.`,
      }));
      out.push(relationshipChannel({
        type: 'military_protection',
        from: to,
        to: from,
        rel,
        strength: 0.55,
        confidence: 0.62,
        explanation: `${to.name} may provide protection or leverage for ${from.name}.`,
      }));
      out.push(relationshipChannel({
        type: 'tax_obligation',
        from,
        to,
        rel,
        strength: 0.45,
        confidence: 0.55,
        explanation: `${from.name} may owe tribute, taxes, or obligations to ${to.name}.`,
      }));
    } else if (rel === 'client') {
      out.push(relationshipChannel({
        type: 'political_authority',
        from,
        to,
        rel,
        strength: 0.55,
        confidence: 0.6,
        explanation: `${from.name} appears to have client leverage over ${to.name}.`,
      }));
      out.push(relationshipChannel({
        type: 'tax_obligation',
        from: to,
        to: from,
        rel,
        strength: 0.42,
        confidence: 0.55,
        explanation: `${to.name} may owe obligations to ${from.name}.`,
      }));
    }
  }

  const rel = sourceRel || targetRel;
  if (!rel) return out.filter(Boolean);
  if (rel === 'allied' || rel === 'ally') {
    addTwoWay(out, 'military_protection', source, target, rel, 0.58, 0.68);
    addTwoWay(out, 'information_flow', source, target, rel, 0.5, 0.65);
  } else if (rel === 'hostile') {
    addTwoWay(out, 'war_front', source, target, rel, 0.72, 0.75);
  } else if (rel === 'rival' || rel === 'cold_war') {
    addTwoWay(out, 'resource_competition', source, target, rel, 0.56, 0.58);
    addTwoWay(out, 'information_flow', source, target, rel, 0.45, 0.55);
  } else if (rel === 'criminal_network' || rel === 'criminal_corridor') {
    addTwoWay(out, 'criminal_corridor', source, target, rel, 0.68, 0.72);
  } else if (rel === 'religious_authority') {
    addTwoWay(out, 'religious_authority', source, target, rel, 0.62, 0.65);
  }

  return out.filter(Boolean);
}

function channelStrengthForGoods(goods, base = 0.5) {
  if (!goods.length) return base;
  const maxCriticality = Math.max(...goods.map(g => goodCriticality(g)));
  const countLift = Math.min(0.2, Math.max(0, goods.length - 1) * 0.05);
  return Math.max(0.1, Math.min(1, base + maxCriticality * 0.35 + countLift));
}

function relationshipConfidence(rel) {
  if (!rel) return 0.55;
  if (rel === 'trade_partner') return 0.9;
  if (rel === 'allied' || rel === 'ally') return 0.75;
  if (rel === 'patron' || rel === 'client') return 0.7;
  if (rel === 'neutral') return 0.55;
  if (rel === 'rival' || rel === 'cold_war') return 0.35;
  if (rel === 'hostile') return 0.15;
  return 0.5;
}

function candidate(raw) {
  return normalizeChannel({
    status: 'suggested',
    discoveredAt: new Date().toISOString(),
    ...raw,
  });
}

/**
 * Discover channels between two saves. Direction is significant:
 * - trade_dependency supplier -> dependent
 * - export_market buyer/market -> exporter
 * - trade_route one route endpoint -> the other endpoint
 */
export function discoverDependencyCandidates(sourceSave, targetSave) {
  const source = deriveRegionalState(sourceSave);
  const target = deriveRegionalState(targetSave);
  if (!source.id || !target.id || source.id === target.id) return [];

  const rel = relationBetween(sourceSave, targetSave) || relationBetween(targetSave, sourceSave);
  const relConfidence = relationshipConfidence(rel);
  const out = [];

  const sourceExportsTargetImports = goodsIntersect(source.exports, target.imports);
  if (sourceExportsTargetImports.length) {
    out.push(candidate({
      type: 'trade_dependency',
      from: source.id,
      to: target.id,
      strength: channelStrengthForGoods(sourceExportsTargetImports, 0.35),
      confidence: Math.max(relConfidence, 0.62),
      goods: sourceExportsTargetImports,
      evidence: [
        { source: 'exports/imports', reason: `${source.name} exports goods ${target.name} imports.` },
        rel ? { source: 'neighbourNetwork', reason: `Current relationship is ${rel}.` } : null,
      ].filter(Boolean),
      explanation: `${target.name} likely depends on ${source.name} for ${sourceExportsTargetImports.map(g => g.label).join(', ')}.`,
    }));

    out.push(candidate({
      type: 'export_market',
      from: target.id,
      to: source.id,
      strength: channelStrengthForGoods(sourceExportsTargetImports, 0.25),
      confidence: Math.max(relConfidence - 0.05, 0.5),
      goods: sourceExportsTargetImports,
      evidence: [
        { source: 'imports/exports', reason: `${target.name} is a likely market for ${source.name}'s exports.` },
      ],
      explanation: `${source.name}'s exporters likely care about demand in ${target.name}.`,
    }));
  }

  const targetExportsSourceImports = goodsIntersect(target.exports, source.imports);
  if (targetExportsSourceImports.length) {
    out.push(candidate({
      type: 'trade_dependency',
      from: target.id,
      to: source.id,
      strength: channelStrengthForGoods(targetExportsSourceImports, 0.35),
      confidence: Math.max(relConfidence, 0.62),
      goods: targetExportsSourceImports,
      evidence: [
        { source: 'exports/imports', reason: `${target.name} exports goods ${source.name} imports.` },
        rel ? { source: 'neighbourNetwork', reason: `Current relationship is ${rel}.` } : null,
      ].filter(Boolean),
      explanation: `${source.name} likely depends on ${target.name} for ${targetExportsSourceImports.map(g => g.label).join(', ')}.`,
    }));

    out.push(candidate({
      type: 'export_market',
      from: source.id,
      to: target.id,
      strength: channelStrengthForGoods(targetExportsSourceImports, 0.25),
      confidence: Math.max(relConfidence - 0.05, 0.5),
      goods: targetExportsSourceImports,
      evidence: [
        { source: 'imports/exports', reason: `${source.name} is a likely market for ${target.name}'s exports.` },
      ],
      explanation: `${target.name}'s exporters likely care about demand in ${source.name}.`,
    }));
  }

  const bothHaveRoutes = source.route.open && target.route.open;
  const friendly = !rel || TRADE_FRIENDLY_RELATIONSHIPS.has(rel);
  const hasTradeEvidence = !!rel || sourceExportsTargetImports.length > 0 || targetExportsSourceImports.length > 0;
  if (bothHaveRoutes && friendly && hasTradeEvidence) {
    const routeStrength = rel === 'trade_partner' ? 0.72 : rel === 'allied' || rel === 'ally' ? 0.6 : 0.45;
    for (const [from, to] of [[source, target], [target, source]]) {
      out.push(candidate({
        type: 'trade_route',
        from: from.id,
        to: to.id,
        strength: routeStrength,
        confidence: rel ? Math.max(0.55, relConfidence) : 0.45,
        goods: [],
        evidence: [
          { source: 'route_state', reason: `${from.name} and ${to.name} both have open trade access.` },
          rel ? { source: 'neighbourNetwork', reason: `Relationship is ${rel}.` } : null,
        ].filter(Boolean),
        explanation: `${from.name} and ${to.name} can transmit route shocks through trade access.`,
      }));
    }
  }

  out.push(...discoverRelationshipChannels(sourceSave, targetSave, source, target));

  return out.filter(Boolean);
}

export function discoverCampaignDependencyCandidates(saves = []) {
  const out = [];
  const seen = new Set();
  for (let i = 0; i < saves.length; i++) {
    for (let j = i + 1; j < saves.length; j++) {
      for (const channel of discoverDependencyCandidates(saves[i], saves[j])) {
        if (seen.has(channel.id)) continue;
        seen.add(channel.id);
        out.push(channel);
      }
    }
  }
  return out;
}

export function deriveGraphWithDiscoveredCandidates(saves = [], existingGraph = null) {
  const graph = deriveRegionalGraphFromSaves(saves, existingGraph);
  const candidates = discoverCampaignDependencyCandidates(saves);
  return addRegionalChannels(graph, candidates);
}
