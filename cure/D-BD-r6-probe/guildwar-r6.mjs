// D-BD-r6 probe (RULINGS-ROUND6 A.4): the guild war's ONE condition on the war_pressure channel and weight class,
// its crime term REMOVED. Generates cities and towns with master's own pipeline (seeded, headless), adds the
// condition as BD §6.8 (d) r6 writes it (affectedSystems defense_readiness · social_trust; NO criminal_opportunity),
// and reads the pressures with (a) master's pressureModel (guild_war NOT in DEFENSE_ARCHETYPES) and (b) a byte-copy
// of it whose ONLY change is 'guild_war' appended to DEFENSE_ARCHETYPES (pressureModel.patched.mjs, diffed in the
// .out header). Compares to master's war_pressure (0.5) and the r5 shape (criminal_opportunity included).
// It also lists every stressor birth rule whose pressure kinds moved and the base+delta against its threshold.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { generateSettlementPipeline } = await import(M + '/generators/generateSettlementPipeline.js');
const { deriveCausalState } = await import(M + '/domain/causalState.js');
const { deriveAllActiveConditions, withActiveCondition } = await import(M + '/domain/activeConditions.js');
const master = await import(M + '/domain/worldPulse/pressureModel.js');
const patched = await import(new URL('./pressureModel.patched.mjs', import.meta.url).href);
const core = await import(M + '/domain/worldPulse/stressorsCore.js');
const catalog = Object.values(core).find(v => v && typeof v === 'object' && v.criminal_corridor) || {};
function pr(s, model) {
  const item = { id: 'x', name: 'x', settlement: s, causal: deriveCausalState(s), activeConditions: deriveAllActiveConditions(s) };
  const out = model.deriveSettlementPressures({ worldState: { calendar: { season: 'summer' }, simulationRules: {} }, settlements: [item], regionalGraph: { edges: [], channels: [] } });
  return Object.fromEntries(out.map(p => [p.kind, p.score]));
}
const gw = (s0, sev, systems) => withActiveCondition(s0, { archetype: 'guild_war', label: 'Guild war', description: 'probe', severity: sev, status: 'stable',
  affectedSystems: systems, triggeredAt: { tick: 1, sourceEventType: 'WORLD_PULSE_GUILD_WAR', sourceEventTargetId: 'x' },
  duration: { elapsedTicks: 0, expiresAtTicks: 3 }, causes: [{ source: 'world_pulse', effect: 'guild_war', reason: 'probe' }] });
const R6 = ['defense_readiness', 'social_trust'];
const R5 = ['criminal_opportunity', 'defense_readiness', 'social_trust'];
const rows = [];
const kinds = ['defense', 'crime', 'conflict', 'legitimacy', 'trade', 'economy'];
for (const settType of ['town', 'city']) for (let i = 0; i < 8; i++) {
  const s0 = generateSettlementPipeline({ settType, culture: 'germanic', terrainOverride: ['plains', 'forest', 'hills', 'riverside'][i % 4], tradeRouteAccess: 'road' }, null, { seed: `bd-r6-gw-${settType}-${i}`, customContent: {} });
  const base = pr(s0, patched);
  const row = { settType, i, base: Object.fromEntries(kinds.map(k => [k, +base[k].toFixed(4)])) };
  for (const sev of [0.5, 0.8, 1.0]) {
    const pP = pr(gw(s0, sev, R6), patched);
    const pM = pr(gw(s0, sev, R6), master);
    const p5 = pr(gw(s0, sev, R5), master);
    row['r6_' + sev] = Object.fromEntries(kinds.map(k => [k, +(pP[k] - base[k]).toFixed(4)]));
    row['r6_noSet_' + sev] = { defense: +(pM.defense - base.defense).toFixed(4), crime: +(pM.crime - base.crime).toFixed(4) };
    row['r5_' + sev] = { defense: +(p5.defense - base.defense).toFixed(4), crime: +(p5.crime - base.crime).toFixed(4) };
  }
  const wp = pr(withActiveCondition(s0, { archetype: 'war_pressure', severity: 0.5, triggeredAt: { tick: 1 } }), patched);
  row.war_pressure05 = Object.fromEntries(kinds.map(k => [k, +(wp[k] - base[k]).toFixed(4)]));
  rows.push(row);
  console.log(JSON.stringify(row));
}
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
console.log('--- SUMMARY (security01 = 1 − defence pressure, so the security FALL = the defence-pressure rise) ---');
for (const sev of [0.5, 0.8, 1.0]) {
  const k = 'r6_' + sev;
  console.log(`r6 guild_war sev ${sev} (+DEFENSE_ARCHETYPES, no crime term): security fall med ${med(rows.map(r => r[k].defense))} min ${Math.min(...rows.map(r => r[k].defense))} max ${Math.max(...rows.map(r => r[k].defense))} · crime rise max ${Math.max(...rows.map(r => r[k].crime))} · conflict rise med ${med(rows.map(r => r[k].conflict))} max ${Math.max(...rows.map(r => r[k].conflict))} · legitimacy max ${Math.max(...rows.map(r => r[k].legitimacy))} · trade max ${Math.max(...rows.map(r => r[k].trade))}`);
  console.log(`   (without the Set entry: security fall med ${med(rows.map(r => r['r6_noSet_' + sev].defense))}; r5 shape: security ${med(rows.map(r => r['r5_' + sev].defense))} crime ${med(rows.map(r => r['r5_' + sev].crime))})`);
}
console.log(`war_pressure 0.5: security fall med ${med(rows.map(r => r.war_pressure05.defense))} · conflict med ${med(rows.map(r => r.war_pressure05.conflict))} · trade med ${med(rows.map(r => r.war_pressure05.trade))} · legitimacy med ${med(rows.map(r => r.war_pressure05.legitimacy))}`);
console.log('--- birth rules reading a kind the r6 condition moves (sev 1.0), worst-case base + delta vs threshold ---');
for (const [type, rule] of Object.entries(catalog)) {
  if (!rule || !Array.isArray(rule.pressureKinds)) continue;
  const moved = rule.pressureKinds.filter(k => rows.some(r => (r['r6_1'][k] || 0) > 0));
  if (!moved.length) continue;
  const worst = Math.max(...rows.map(r => Math.max(...moved.map(k => (r.base[k] || 0) + (r['r6_1'][k] || 0)))));
  console.log(`${type.padEnd(26)} kinds ${JSON.stringify(rule.pressureKinds)} threshold ${rule.birthThreshold} · moved ${moved.join(',')} · worst base+delta ${worst.toFixed(3)} ${worst >= rule.birthThreshold ? 'CROSSES' : 'below'}`);
}
