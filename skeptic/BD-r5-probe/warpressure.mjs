// BD-r5 probe 3: the raider stressor's promoted condition (war_pressure, BD §22 A2's declared loop "+0.16 ONCE on the
// defence pressure") — every pressure kind it moves on master's own generated cities and villages, severity 0.5.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { generateSettlementPipeline } = await import(M + '/generators/generateSettlementPipeline.js');
const { deriveCausalState } = await import(M + '/domain/causalState.js');
const { deriveAllActiveConditions, withActiveCondition } = await import(M + '/domain/activeConditions.js');
const { deriveSettlementPressures } = await import(M + '/domain/worldPulse/pressureModel.js');
function pr(s) {
  const item = { id: 'x', name: 'x', settlement: s, causal: deriveCausalState(s), activeConditions: deriveAllActiveConditions(s) };
  const out = deriveSettlementPressures({ worldState: { calendar: { season: 'summer' }, simulationRules: {} }, settlements: [item], regionalGraph: { edges: [], channels: [] } });
  return Object.fromEntries(out.map(p => [p.kind, p.score]));
}
for (const tier of ['village', 'town', 'city']) {
  const agg = {};
  for (let i = 0; i < 8; i++) {
    const s0 = generateSettlementPipeline({ settType: tier, culture: 'germanic', terrainOverride: ['plains','forest','hills','riverside'][i % 4], tradeRouteAccess: 'road' }, null, { seed: `bd-r5-wp-${tier}-${i}`, customContent: {} });
    const b = pr(s0); const w = pr(withActiveCondition(s0, { archetype: 'war_pressure', severity: 0.5, triggeredAt: { tick: 1 } }));
    for (const k of Object.keys(b)) { (agg[k] ||= []).push(+(w[k] - b[k]).toFixed(4)); }
  }
  const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
  console.log(tier.padEnd(8), Object.entries(agg).filter(([, v]) => v.some(Boolean)).map(([k, v]) => `${k} med +${med(v)} (min ${Math.min(...v)} max ${Math.max(...v)})`).join(' · '));
}
