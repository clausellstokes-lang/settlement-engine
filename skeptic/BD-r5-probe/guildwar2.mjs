// BD-r5 probe 2: the guild_war condition's reach into the landed stressors' BIRTH inputs (pressure kinds) —
// against BD §22 A7's "no stressor birth is touched". Prints each pressure kind's delta and the birth rules that read it.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { generateSettlementPipeline } = await import(M + '/generators/generateSettlementPipeline.js');
const { deriveCausalState } = await import(M + '/domain/causalState.js');
const { deriveAllActiveConditions, withActiveCondition } = await import(M + '/domain/activeConditions.js');
const { deriveSettlementPressures } = await import(M + '/domain/worldPulse/pressureModel.js');
const core = await import(M + '/domain/worldPulse/stressorsCore.js');
const catalog = core.STRESSOR_TYPES || core.STRESSOR_CATALOG || core.default || core;
const all = Object.entries(catalog).find(([k, v]) => v && typeof v === 'object' && v.criminal_corridor) ? Object.entries(catalog).find(([k, v]) => v && v.criminal_corridor)[1] : catalog;
function pr(s) {
  const item = { id: 'x', name: 'x', settlement: s, causal: deriveCausalState(s), activeConditions: deriveAllActiveConditions(s) };
  const out = deriveSettlementPressures({ worldState: { calendar: { season: 'summer' }, simulationRules: {} }, settlements: [item], regionalGraph: { edges: [], channels: [] } });
  return Object.fromEntries(out.map(p => [p.kind, p.score]));
}
const deltas = [];
for (let i = 0; i < 8; i++) {
  const s0 = generateSettlementPipeline({ settType: 'city', culture: 'germanic', terrainOverride: ['plains','forest','hills','riverside'][i % 4], tradeRouteAccess: 'road' }, null, { seed: `bd-r5-gw-${i}`, customContent: {} });
  const b = pr(s0);
  const g = pr(withActiveCondition(s0, { archetype: 'guild_war', label: 'Guild war', severity: 0.8, affectedSystems: ['criminal_opportunity', 'defense_readiness', 'social_trust'], triggeredAt: { tick: 1 }, causes: [] }));
  const d = {}; for (const k of Object.keys(b)) { const v = +(g[k] - b[k]).toFixed(4); if (v) d[k] = v; }
  deltas.push(d);
  console.log('city', i, 'pressure deltas at severity 0.8:', JSON.stringify(d), '| base conflict', b.conflict.toFixed(3), 'crime', b.crime.toFixed(3));
}
console.log('--- the birth rules that read the moved kinds (stressorsCore pressureKinds / birthThreshold):');
for (const [type, rule] of Object.entries(all)) {
  if (!rule || !Array.isArray(rule.pressureKinds)) continue;
  const hit = rule.pressureKinds.filter(k => deltas.some(d => d[k]));
  if (hit.length) console.log(type.padEnd(30), 'pressureKinds', JSON.stringify(rule.pressureKinds), 'birthThreshold', rule.birthThreshold, '<- moved:', hit.join(','));
}
