import { activeChannelsFrom } from '../region/index.js';
import { stablePart } from './worldState.js';
import { intensityMultiplier, normalizeSimulationRules } from './simulationRules.js';

const INTERVAL_MONTHS = Object.freeze({
  one_week: 0.25,
  one_month: 1,
  one_season: 3,
  one_year: 12,
});

const MIGRATION_CHANNELS = Object.freeze(['migration_pressure', 'trade_route', 'political_authority', 'military_protection']);

function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function score(pressureIdx, settlementId, kind) {
  return pressureIdx?.get?.(settlementId, kind)?.score || 0;
}

function conditionsFor(item) {
  return item?.activeConditions || item?.settlement?.activeConditions || [];
}

function conditionText(item) {
  return conditionsFor(item)
    .map(c => `${c.archetype || ''} ${c.label || ''} ${c.description || ''}`.toLowerCase())
    .join(' ');
}

function hasCondition(item, pattern) {
  return pattern.test(conditionText(item));
}

function intervalMagnitude(interval) {
  const months = INTERVAL_MONTHS[interval] ?? 1;
  return Math.max(0.25, Math.pow(months, 0.85));
}

function migrationChoice(saveId, tick) {
  const text = `${saveId}:${tick}`;
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
  return ['void', 'distributed', 'concentrated'][hash % 3];
}

function candidateDestinations(snapshot, sourceId) {
  const byId = snapshot?.byId;
  const ids = new Set();
  for (const channel of activeChannelsFrom(snapshot?.regionalGraph, sourceId, { types: MIGRATION_CHANNELS })) {
    if (channel.to && String(channel.to) !== String(sourceId)) ids.add(String(channel.to));
  }
  for (const edge of snapshot?.regionalGraph?.edges || []) {
    const from = String(edge.from || edge.source || '');
    const to = String(edge.to || edge.target || '');
    if (from === String(sourceId) && to) ids.add(to);
    if (to === String(sourceId) && from) ids.add(from);
  }
  return [...ids].map(id => byId?.get?.(id)).filter(Boolean);
}

function destinationScore(item, pressureIdx) {
  const id = item.id;
  const safety = 1 - score(pressureIdx, id, 'conflict');
  const food = 1 - score(pressureIdx, id, 'food');
  const trade = 1 - score(pressureIdx, id, 'trade');
  const legitimacy = 1 - score(pressureIdx, id, 'legitimacy');
  return safety * 0.3 + food * 0.3 + trade * 0.22 + legitimacy * 0.18;
}

function distributeMigrants({ sourceId, migrants, snapshot, pressureIdx, mode, tick }) {
  const chosenMode = mode === 'roll' ? migrationChoice(sourceId, tick) : mode;
  if (chosenMode === 'void') return { mode: chosenMode, deltas: [] };

  const destinations = candidateDestinations(snapshot, sourceId)
    .filter(item => destinationScore(item, pressureIdx) >= 0.35)
    .sort((a, b) => destinationScore(b, pressureIdx) - destinationScore(a, pressureIdx));
  if (!destinations.length) return { mode: 'void', deltas: [] };

  if (chosenMode === 'concentrated') {
    return {
      mode: chosenMode,
      deltas: [{ saveId: destinations[0].id, delta: migrants, reason: 'Displaced population concentrates in the most plausible receiving settlement.' }],
    };
  }

  const top = destinations.slice(0, 4);
  const totalWeight = top.reduce((sum, item) => sum + Math.max(0.1, destinationScore(item, pressureIdx)), 0);
  let assigned = 0;
  const deltas = top.map((item, index) => {
    const last = index === top.length - 1;
    const delta = last
      ? migrants - assigned
      : Math.max(1, Math.round(migrants * (Math.max(0.1, destinationScore(item, pressureIdx)) / totalWeight)));
    assigned += delta;
    return { saveId: item.id, delta, reason: 'Displaced population disperses through regional links.' };
  }).filter(d => d.delta > 0);
  return { mode: chosenMode, deltas };
}

function populationPressureRate(item, pressureIdx, rules) {
  const id = item.id;
  const food = score(pressureIdx, id, 'food');
  const disease = score(pressureIdx, id, 'disease');
  const conflict = score(pressureIdx, id, 'conflict');
  const trade = score(pressureIdx, id, 'trade');
  const legitimacy = score(pressureIdx, id, 'legitimacy');
  const crime = score(pressureIdx, id, 'crime');

  const stability = 1 - ((food * 0.26) + (disease * 0.2) + (conflict * 0.22) + (trade * 0.14) + (legitimacy * 0.12) + (crime * 0.06));
  let monthlyRate = 0.0018 + (stability - 0.5) * 0.012;

  if (hasCondition(item, /regional_migration_pressure|refugee|migration/)) monthlyRate += 0.012;
  if (hasCondition(item, /famine|food_anchor|import_shortage/)) monthlyRate -= 0.013;
  if (hasCondition(item, /plague|disease/)) monthlyRate -= 0.02;
  if (hasCondition(item, /war|siege|occupation|raid|monster/)) monthlyRate -= 0.016;
  if (hasCondition(item, /alliance_burden|regional_protection_gap/)) monthlyRate -= 0.006;
  if (hasCondition(item, /siege_lifted|stressor_residual/)) monthlyRate += 0.002;

  return monthlyRate * intensityMultiplier(rules);
}

function deltaForSettlement(item, pressureIdx, interval, rules) {
  const pop = Math.max(0, Math.round(finite(item?.settlement?.population, 0)));
  if (pop <= 0) return null;
  const magnitude = intervalMagnitude(interval);
  const rate = populationPressureRate(item, pressureIdx, rules);
  const severe = Math.abs(rate) >= 0.025 || hasCondition(item, /famine|plague|siege|occupation|mass_migration/);
  const cap = pop * (severe ? 0.18 : 0.055) * intensityMultiplier(rules);
  const rawDelta = Math.round(pop * rate * magnitude);
  const delta = Math.round(clamp(rawDelta, -cap, cap));
  if (Math.abs(delta) < Math.max(2, Math.round(pop * 0.001))) return null;
  return { pop, delta, severe };
}

function populationCandidate({ item, interval, pressureIdx, snapshot, rules, tick }) {
  const result = deltaForSettlement(item, pressureIdx, interval, rules);
  if (!result) return null;
  const { pop, delta, severe } = result;
  const sourceId = String(item.id);
  const abs = Math.abs(delta);
  const massThreshold = Math.max(25, Math.round(pop * 0.025));
  const isMassEmigration = delta < 0 && abs >= massThreshold && (severe || hasCondition(item, /migration|famine|war|siege|occupation|plague/));
  const populationDeltas = [{ saveId: sourceId, delta, reason: delta > 0 ? 'Organic growth from favorable conditions.' : 'Population loss from cumulative settlement pressure.' }];
  let transferMode = null;
  let migrants = 0;

  if (isMassEmigration && rules.migrationFlowsEnabled && !['off', 'local'].includes(rules.propagationMode)) {
    migrants = Math.max(0, Math.round(abs * 0.45));
    const transfer = distributeMigrants({
      sourceId,
      migrants,
      snapshot,
      pressureIdx,
      mode: rules.migrationMode,
      tick,
    });
    transferMode = transfer.mode;
    populationDeltas.push(...transfer.deltas);
  }

  const major = abs >= Math.max(80, Math.round(pop * 0.04)) || migrants >= Math.max(60, Math.round(pop * 0.025));
  const kind = delta > 0 ? 'growth' : isMassEmigration ? 'emigration' : 'decline';
  return {
    id: `candidate.population.${kind}.${stablePart(sourceId)}.${tick}`,
    type: 'population',
    candidateType: `population_${kind}`,
    ruleId: `population_${kind}`,
    ruleFamily: 'population',
    targetSaveId: sourceId,
    severity: clamp(abs / Math.max(1, pop * 0.12), 0.12, 1),
    probability: 1,
    applyMode: major && rules.majorChangesRequireProposal ? 'proposal' : 'auto',
    headline: `${item.name || sourceId} population may ${delta > 0 ? 'grow' : 'fall'}`,
    summary: delta > 0
      ? `${item.name || sourceId} gains about ${abs.toLocaleString()} people from favorable conditions.`
      : `${item.name || sourceId} loses about ${abs.toLocaleString()} people from cumulative pressure${migrants ? `; about ${migrants.toLocaleString()} may migrate onward` : ''}.`,
    reasons: [
      `Food ${score(pressureIdx, sourceId, 'food').toFixed(2)}, defense pressure ${score(pressureIdx, sourceId, 'conflict').toFixed(2)}, trade pressure ${score(pressureIdx, sourceId, 'trade').toFixed(2)}.`,
      `Interval ${interval.replace(/_/g, ' ')} with ${rules.intensity} intensity.`,
      transferMode ? `Migration mode resolved as ${transferMode.replace(/_/g, ' ')}.` : null,
    ].filter(Boolean),
    populationDeltas,
    generatedAtTick: tick,
    metadata: { populationKind: kind, transferMode, migrants },
    conflictTags: [`population:${sourceId}`],
  };
}

export function evaluatePopulationDynamics(snapshot, pressureIdx, context = {}) {
  const rules = normalizeSimulationRules(context.simulationRules || snapshot?.worldState?.simulationRules);
  if (!rules.populationDynamicsEnabled) return [];
  const tick = Number.isFinite(context.tick) ? context.tick : snapshot?.worldState?.tick || 0;
  const interval = context.interval || 'one_month';
  return (snapshot?.settlements || [])
    .map(item => populationCandidate({ item, interval, pressureIdx, snapshot, rules, tick }))
    .filter(Boolean);
}

export function applyPopulationOutcomeToSettlement(settlement, outcome, saveId) {
  if (!settlement || !outcome?.populationDeltas) return settlement;
  const delta = outcome.populationDeltas
    .filter(item => String(item.saveId) === String(saveId))
    .reduce((sum, item) => sum + (Number(item.delta) || 0), 0);
  if (!delta) return settlement;
  const current = Math.max(0, Math.round(finite(settlement.population, 0)));
  const nextPopulation = Math.max(0, current + Math.round(delta));
  return {
    ...settlement,
    population: nextPopulation,
    populationHistory: [
      ...(Array.isArray(settlement.populationHistory) ? settlement.populationHistory.slice(-11) : []),
      {
        tick: outcome.generatedAtTick || outcome.tick || null,
        delta,
        population: nextPopulation,
        reason: outcome.headline || outcome.candidateType,
        outcomeId: outcome.id,
      },
    ],
  };
}
