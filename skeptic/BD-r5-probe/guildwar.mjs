// BD-r5 probe: the guild_war condition's MAGNITUDE on the security and crime reads (B.18's cure, BD §6.8 (d)).
// Generates cities with master's own pipeline; adds ONE inline condition shaped as BD §6.8 (d) writes it
// (affectedSystems criminal_opportunity · defense_readiness · social_trust; archetype 'guild_war', no template row
// -> deriveActiveCondition keeps the inline affectedSystems), and compares the defence/crime pressures
// (pressureModel.deriveSettlementPressures) before and after; the kernel's security01 = 1 - defence pressure.
// A landed DEFENSE archetype (war_pressure) and CRIME archetype (regional_criminal_pressure) at the same severity
// are the comparison.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { generateSettlementPipeline } = await import(M + '/generators/generateSettlementPipeline.js');
const { deriveCausalState } = await import(M + '/domain/causalState.js');
const { deriveAllActiveConditions, withActiveCondition } = await import(M + '/domain/activeConditions.js');
const { deriveSettlementPressures } = await import(M + '/domain/worldPulse/pressureModel.js');
function pressures(s) {
  const item = { id: 'x', name: 'x', settlement: s, causal: deriveCausalState(s), activeConditions: deriveAllActiveConditions(s) };
  const snap = { worldState: { calendar: { season: 'summer' }, simulationRules: {} }, settlements: [item], regionalGraph: { edges: [], channels: [] } };
  const out = deriveSettlementPressures(snap);
  const get = (k) => out.find(p => p.kind === k)?.score;
  return { defense: get('defense'), crime: get('crime'), conflict: get('conflict'), dr: item.causal.scores?.defense_readiness, co: item.causal.scores?.criminal_opportunity };
}
const rows = [];
for (let i = 0; i < 8; i++) {
  const s0 = generateSettlementPipeline({ settType: 'city', culture: 'germanic', terrainOverride: ['plains','forest','hills','riverside'][i % 4], tradeRouteAccess: 'road' }, null, { seed: `bd-r5-gw-${i}`, customContent: {} });
  const base = pressures(s0);
  const res = { i, base };
  for (const sev of [0.5, 0.8, 1.0]) {
    const gw = withActiveCondition(s0, { archetype: 'guild_war', label: 'Guild war', description: 'probe', severity: sev,
      affectedSystems: ['criminal_opportunity', 'defense_readiness', 'social_trust'], triggeredAt: { tick: 1, sourceEventType: 'BODY_GUILD_WAR', sourceEventTargetId: 'x' }, causes: [{ source: 'body:gang:probe', effect: 'guild_war', reason: 'probe' }] });
    const p = pressures(gw);
    res['gw' + sev] = { dDefense: +(p.defense - base.defense).toFixed(4), dCrime: +(p.crime - base.crime).toFixed(4), dSecurity01: +(-(p.defense - base.defense)).toFixed(4), dDR: p.dr - base.dr, dCO: p.co - base.co };
  }
  const wp = withActiveCondition(s0, { archetype: 'war_pressure', severity: 0.5, triggeredAt: { tick: 1 } });
  const pw = pressures(wp);
  res.war_pressure05 = { dDefense: +(pw.defense - base.defense).toFixed(4) };
  const cp = withActiveCondition(s0, { archetype: 'regional_criminal_pressure', severity: 0.5, triggeredAt: { tick: 1 } });
  const pc = pressures(cp);
  res.regional_criminal_pressure05 = { dCrime: +(pc.crime - base.crime).toFixed(4) };
  rows.push(res);
}
for (const r of rows) console.log(JSON.stringify(r));
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
for (const sev of [0.5, 0.8, 1.0]) {
  console.log(`guild_war severity ${sev}: median security01 fall ${med(rows.map(r => r['gw' + sev].dSecurity01))} · median crime-pressure rise ${med(rows.map(r => r['gw' + sev].dCrime))} · max security01 fall ${Math.max(...rows.map(r => r['gw' + sev].dSecurity01))}`);
}
console.log(`war_pressure 0.5 (a landed DEFENSE archetype): median security01 fall ${med(rows.map(r => r.war_pressure05.dDefense))}`);
console.log(`regional_criminal_pressure 0.5 (a landed CRIME archetype): median crime-pressure rise ${med(rows.map(r => r.regional_criminal_pressure05.dCrime))}`);
