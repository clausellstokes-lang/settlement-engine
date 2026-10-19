const M = process.argv[2];
const mod = await import(M + '/src/domain/worldPulse/simulationRules.js');
const list = Object.values(mod.SIMULATION_RULE_PRESETS);
const keys = new Set(Object.keys(mod.DEFAULT_SIMULATION_RULES));
for (const p of list) for (const k of Object.keys(p.rules||{})) keys.add(k);
const out = [];
for (const k of [...keys].filter(k=>/Enabled$/.test(k)).sort()) {
  const lit = list.filter(p => p.rules?.[k] === true).map(p=>p.id);
  out.push(`${k}\tdefault=${mod.DEFAULT_SIMULATION_RULES[k]}\tlit:${lit.join(',')}`);
}
console.log(out.join('\n'));
console.log('VIRTUAL:', [...(mod.ENGINE_GATED_VIRTUAL_RULE_KEYS||[])].join(','));
console.log('DORMANT:', [...(mod.ENGINE_GATED_DORMANT_RULE_KEYS||[])].join(','));
