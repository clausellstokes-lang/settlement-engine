/**
 * domain/region/discoverDependencyCandidates.js
 *
 * Finds likely P0 regional channels between saved settlements. Discovery is
 * deliberately advisory: candidates start as suggested channels and become
 * campaign truth only after the DM confirms them.
 */

import { deriveRegionalState, settlementFromSave } from './deriveRegionalState.js';
import { addRegionalChannels, deriveRegionalGraphFromSaves, normalizeChannel } from './graph.js';
import { goodCriticality, goodsIntersect } from './goodsCatalog.js';
import { canonicalEdgeForLink } from '../relationships/canonicalRelationship.js';
import { healingLedger } from '../healingLedger.js';
import { TIER_ORDER } from '../../data/constants.js';

const TRADE_FRIENDLY_RELATIONSHIPS = new Set([
  'trade_partner',
  'allied',
  'ally',
  'patron',
  'client',
  'vassal',
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

function linkBetween(sourceSave, targetSave) {
  const links = sourceSave?.settlement?.neighbourNetwork
    || sourceSave?.neighbourNetwork
    || [];
  const targetId = targetSave?.id || targetSave?.settlement?.id;
  const targetName = targetSave?.name || targetSave?.settlement?.name;
  return links.find(n =>
    (targetId && String(n.id || n.targetId) === String(targetId))
    || (targetName && (n.neighbourName === targetName || n.name === targetName))
  ) || null;
}

function relationshipChannel({ type, from, to, rel, strength = 0.5, confidence = 0.6, explanation }) {
  return candidate({
    type,
    from: from.id,
    to: to.id,
    strength,
    confidence,
    goods: [],
    relationshipType: rel,
    evidence: [{ source: 'neighbourNetwork', reason: `Relationship is ${rel}.` }],
    explanation: explanation || `${from.name} can transmit ${type.replace(/_/g, ' ')} pressure to ${to.name}.`,
  });
}

function addTwoWay(out, type, a, b, rel, strength, confidence, explanation) {
  out.push(relationshipChannel({ type, from: a, to: b, rel, strength, confidence, explanation }));
  out.push(relationshipChannel({ type, from: b, to: a, rel, strength, confidence, explanation }));
}

function addPatronageChannels(out, patron, client, rel, strength = 0.62, confidence = 0.7) {
  out.push(relationshipChannel({
    type: 'political_authority',
    from: patron,
    to: client,
    rel,
    strength,
    confidence,
    explanation: `${patron.name} appears to exercise patron authority over ${client.name}.`,
  }));
  out.push(relationshipChannel({
    type: 'military_protection',
    from: patron,
    to: client,
    rel,
    strength: Math.max(0.45, strength - 0.07),
    confidence: Math.max(0.55, confidence - 0.08),
    explanation: `${patron.name} may provide protection or leverage for ${client.name}.`,
  }));
  out.push(relationshipChannel({
    type: 'tax_obligation',
    from: client,
    to: patron,
    rel,
    strength: Math.max(0.38, strength - 0.17),
    confidence: Math.max(0.5, confidence - 0.15),
    explanation: `${client.name} may owe tribute, taxes, or obligations to ${patron.name}.`,
  }));
}

function addVassalageChannels(out, overlord, vassal, rel, strength = 0.82, confidence = 0.82) {
  out.push(relationshipChannel({
    type: 'political_authority',
    from: overlord,
    to: vassal,
    rel,
    strength,
    confidence,
    explanation: `${overlord.name} appears to exercise overlord authority over ${vassal.name}.`,
  }));
  out.push(relationshipChannel({
    type: 'military_protection',
    from: overlord,
    to: vassal,
    rel,
    strength: Math.max(0.6, strength - 0.12),
    confidence: Math.max(0.68, confidence - 0.06),
    explanation: `${overlord.name} is expected to protect or command ${vassal.name}.`,
  }));
  out.push(relationshipChannel({
    type: 'tax_obligation',
    from: vassal,
    to: overlord,
    rel,
    strength: Math.max(0.64, strength - 0.06),
    confidence: Math.max(0.7, confidence - 0.04),
    explanation: `${vassal.name} likely owes tribute, levies, or legal obligation to ${overlord.name}.`,
  }));
  addTwoWay(out, 'information_flow', overlord, vassal, rel, 0.43, 0.6);
}

function discoverRelationshipChannels(sourceSave, targetSave, source, target) {
  const out = [];
  const sourceRel = relationBetween(sourceSave, targetSave);
  const targetRel = relationBetween(targetSave, sourceSave);
  const relationshipLink = linkBetween(sourceSave, targetSave)
    || linkBetween(targetSave, sourceSave);
  const canonical = canonicalEdgeForLink(relationshipLink, sourceSave, targetSave);
  if (canonical?.relationshipType === 'patron') {
    const patron = String(canonical.from) === String(source.id) ? source : target;
    const client = patron === source ? target : source;
    addPatronageChannels(out, patron, client, 'patron', 0.62, 0.7);
  } else if (canonical?.relationshipType === 'vassal') {
    const overlord = String(canonical.from) === String(source.id) ? source : target;
    const vassal = overlord === source ? target : source;
    addVassalageChannels(out, overlord, vassal, 'vassal');
  }

  const rel = sourceRel || targetRel;
  if (!rel) return out.filter(Boolean);
  if (rel === 'allied' || rel === 'ally') {
    addTwoWay(out, 'military_protection', source, target, rel, 0.58, 0.68);
    addTwoWay(out, 'information_flow', source, target, rel, 0.5, 0.65);
  } else if (rel === 'trade_partner') {
    addTwoWay(out, 'information_flow', source, target, rel, 0.42, 0.6);
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
  if (rel === 'vassal') return 0.78;
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

// ── R3 decision (2026-06-11): SUGGESTED-only heuristics for the two formerly
// uncreatable channel types (service_dependency, migration_pressure).
// Deliberately conservative and low-confidence — the DM confirm gate is the
// safety; nothing here (or anywhere) auto-confirms them.

// Institutional-grade healing anchors — the hospital/monastic/temple-of-
// healing class of the canonical classifier vocabulary
// (HEALING_INSTITUTION_PATTERN in healingLedger.js). Shrines, chapels,
// herbalists, and the rest of the wayside vocabulary are healing-capable but
// none of them anchors a regional service hub on its own.
const INSTITUTIONAL_HEALING_PATTERN = /(hospital|monaster|temple)/i;

/**
 * Healing/service capacity, read from the raw save's institutions via the
 * canonical classifier (healingLedger) — the regional projection dropped its
 * dead `services` field in R4/H18 and it must NOT come back without a real
 * reader; discovery reads the raw save the same way relationBetween reads the
 * raw neighbourNetwork. A lone shrine is not a regional service hub — and
 * neither are two of them: a provider needs two-plus healing-capable
 * institutions of which at least one is institutional-grade (hospital/
 * monastery/temple class), and a dependent only counts as lacking when it
 * carries an institutions array yet has neither a healing institution nor an
 * offered healing service.
 */
function healingCapacityOf(save) {
  const settlement = settlementFromSave(save) || {};
  const ledger = healingLedger(settlement);
  const institutions = Array.isArray(settlement.institutions) ? settlement.institutions : [];
  const anchor = institutions.find(i => INSTITUTIONAL_HEALING_PATTERN.test(String(i?.name || '')));
  return {
    healerCount: ledger.healerCount,
    anchorName: anchor ? String(anchor.name) : null,
    provider: ledger.healerCount >= 2 && !!anchor,
    lacking: ledger.present && ledger.healerCount === 0 && ledger.services.length === 0,
  };
}

function tierRankOf(tier) {
  const rank = TIER_ORDER.indexOf(tier);
  return rank >= 0 ? rank : null;
}

/**
 * Discover channels between two saves. Direction is significant:
 * - trade_dependency supplier -> dependent
 * - export_market buyer/market -> exporter
 * - trade_route one route endpoint -> the other endpoint
 * - service_dependency service provider -> dependent (R3, suggested-only)
 * - migration_pressure smaller pole -> bigger pole (R3, suggested-only)
 *
 * Pass options.now for deterministic discoveredAt/updatedAt stamps (replay
 * must be byte-identical); the wall clock is the fallback ONLY when absent.
 */
export function discoverDependencyCandidates(sourceSave, targetSave, options = {}) {
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
  // The exact predicate under which a trade_route is suggested below — the
  // R3 service/migration heuristics ride the same route/trade link.
  const routeTradeLink = bothHaveRoutes && friendly && hasTradeEvidence;
  if (routeTradeLink) {
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

  // R3: service_dependency — provider -> dependent when the provider has real
  // healing/service capacity the dependent lacks, and the route/trade link
  // above makes the service reachable. Born suggested, never auto-confirmed.
  if (routeTradeLink) {
    const sourceHealing = healingCapacityOf(sourceSave);
    const targetHealing = healingCapacityOf(targetSave);
    for (const [provider, dependent, capacity, need] of [
      [source, target, sourceHealing, targetHealing],
      [target, source, targetHealing, sourceHealing],
    ]) {
      if (!capacity.provider || !need.lacking) continue;
      out.push(candidate({
        type: 'service_dependency',
        from: provider.id,
        to: dependent.id,
        strength: 0.45,
        confidence: 0.5,
        goods: [],
        evidence: [
          { source: 'institutions', reason: `${provider.name} anchors its ${capacity.healerCount} healing-capable institutions on ${capacity.anchorName}; ${dependent.name} has none.` },
          { source: 'route_state', reason: `An open trade link makes ${provider.name}'s services reachable.` },
        ],
        explanation: `${dependent.name} likely relies on ${provider.name} for healing and temple services.`,
      }));
    }
  }

  // R3: migration_pressure — along the same suggested trade route when the
  // poles are unbalanced (tier gap >= 2 or population ratio >= 4x). People
  // flow toward the bigger pole, so the channel runs smaller -> larger: a
  // crisis at the small end (health/security shock, population loss) sends
  // migration pressure to the big end. Born suggested, never auto-confirmed.
  if (routeTradeLink) {
    const sourceRank = tierRankOf(source.tier);
    const targetRank = tierRankOf(target.tier);
    const tierGap = sourceRank !== null && targetRank !== null ? Math.abs(sourceRank - targetRank) : 0;
    const populations = [source.population || 0, target.population || 0];
    const populationRatio = Math.min(...populations) > 0 ? Math.max(...populations) / Math.min(...populations) : 0;
    if (tierGap >= 2 || populationRatio >= 4) {
      const sourceIsLarger = sourceRank !== null && targetRank !== null && sourceRank !== targetRank
        ? sourceRank > targetRank
        : populations[0] >= populations[1];
      const smaller = sourceIsLarger ? target : source;
      const larger = sourceIsLarger ? source : target;
      out.push(candidate({
        type: 'migration_pressure',
        from: smaller.id,
        to: larger.id,
        strength: 0.4,
        confidence: 0.45,
        goods: [],
        evidence: [
          tierGap >= 2
            ? { source: 'settlement_tier', reason: `${larger.name} (${larger.tier}) outranks ${smaller.name} (${smaller.tier}) by ${tierGap} tiers.` }
            : { source: 'population', reason: `${larger.name} holds roughly ${Math.round(populationRatio)}x the population of ${smaller.name}.` },
          { source: 'route_state', reason: `The trade link between them gives migrants a path.` },
        ],
        explanation: `People under pressure in ${smaller.name} are likely to drift toward ${larger.name}.`,
      }));
    }
  }

  out.push(...discoverRelationshipChannels(sourceSave, targetSave, source, target));

  // Deterministic timestamp: same idiom as deriveRegionalImpacts — stamp the
  // threaded `now` over candidate()'s wall-clock default when provided.
  const candidates = out.filter(Boolean);
  if (options.now) {
    return candidates.map(channel => ({ ...channel, discoveredAt: options.now, updatedAt: options.now }));
  }
  return candidates;
}

export function discoverCampaignDependencyCandidates(saves = [], options = {}) {
  const out = [];
  const seen = new Set();
  for (let i = 0; i < saves.length; i++) {
    for (let j = i + 1; j < saves.length; j++) {
      for (const channel of discoverDependencyCandidates(saves[i], saves[j], options)) {
        if (seen.has(channel.id)) continue;
        seen.add(channel.id);
        out.push(channel);
      }
    }
  }
  return out;
}

export function deriveGraphWithDiscoveredCandidates(saves = [], existingGraph = null, options = {}) {
  const graph = deriveRegionalGraphFromSaves(saves, existingGraph, options);
  const candidates = discoverCampaignDependencyCandidates(saves, options);
  return addRegionalChannels(graph, candidates, options);
}
