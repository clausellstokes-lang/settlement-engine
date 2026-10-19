// V-BD-r5 probe: B.18's guild_war condition on master's ONE affectedSystems join — how far can it move
// the kernel's security01 (= 1 - defence pressure) and crime01? Generated cities/metropolises, seeded.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { generateSettlementPipeline } = await import(M + '/generators/generateSettlementPipeline.js');
const { deriveCausalState } = await import(M + '/domain/causalState.js');
const { withActiveCondition } = await import(M + '/domain/activeConditions.js');
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const defP = (sc) => clamp01((70 - Math.round(((sc.defense_readiness ?? 50) + (sc.infrastructure_condition ?? 50) + (sc.labor_capacity ?? 50)) / 3)) / 70);
const crimeP = (sc) => clamp01((sc.criminal_opportunity ?? 50) / 100);
for (const tier of ['city', 'metropolis']) {
  for (let i = 0; i < 4; i++) {
    const s = generateSettlementPipeline({ settType: tier, culture: 'germanic', terrainOverride: 'plains', tradeRouteAccess: 'road' }, null, { seed: `vbd-r5-gw-${tier}-${i}`, customContent: {} });
    const c0 = deriveCausalState(s).scores;
    const out = [];
    for (const sev of [0.5, 0.8, 1.0]) {
      const s2 = withActiveCondition(s, { archetype: 'guild_war', label: 'Guild war', severity: sev, affectedSystems: ['criminal_opportunity', 'defense_readiness', 'social_trust'], triggeredAt: { tick: 1 } });
      const c1 = deriveCausalState(s2).scores;
      out.push(`sev ${sev}: d_def_readiness ${c1.defense_readiness - c0.defense_readiness} d_security01 ${(-(defP(c1) - defP(c0))).toFixed(3)} d_crimeP ${(crimeP(c1) - crimeP(c0)).toFixed(3)}`);
    }
    console.log(tier, i, 'base def_readiness', c0.defense_readiness, 'security01', (1 - defP(c0)).toFixed(3), '|', out.join(' | '));
  }
}
// the landed comparison: one DEFENSE archetype condition adds a flat +0.16 to the defence pressure (pressureModel.js)
console.log('landed DEFENSE_ARCHETYPES step on defence pressure: +0.16 (pressureModel.js "defense += 0.16;")');
// the gauge's own relief term (embattlement.js :: rampThreat): relief = min(SECURITY_MAX_RELIEF 0.25, W_SEC 0.4 x security01)
const { EMBATTLEMENT_TUNING: ET } = await import(M + '/domain/spatial/embattlement.js');
let moved = 0, total = 0;
for (const tier of ['town', 'city', 'metropolis']) {
  for (let i = 0; i < 8; i++) {
    const s = generateSettlementPipeline({ settType: tier, culture: 'germanic', terrainOverride: ['plains','forest','hills','riverside'][i % 4], tradeRouteAccess: 'road' }, null, { seed: `vbd-r5-gw2-${tier}-${i}`, customContent: {} });
    const sec0 = 1 - defP(deriveCausalState(s).scores);
    const s2 = withActiveCondition(s, { archetype: 'guild_war', label: 'Guild war', severity: 0.8, affectedSystems: ['criminal_opportunity', 'defense_readiness', 'social_trust'], triggeredAt: { tick: 1 } });
    const sec1 = 1 - defP(deriveCausalState(s2).scores);
    const r0 = Math.min(ET.SECURITY_MAX_RELIEF, ET.W_SEC * sec0), r1 = Math.min(ET.SECURITY_MAX_RELIEF, ET.W_SEC * sec1);
    total++; if (Math.abs(r1 - r0) > 1e-9) moved++;
  }
}
console.log(`gauge relief moved by the guild_war condition (sev 0.8) in ${moved}/${total} generated towns+ (W_SEC ${ET.W_SEC}, cap ${ET.SECURITY_MAX_RELIEF}: relief saturates at security01 >= ${(ET.SECURITY_MAX_RELIEF/ET.W_SEC).toFixed(3)})`);
