// Which presets light which flags (master 81f1cd963).
const M = process.argv[2];
const m = await import(M + '/src/domain/worldPulse/simulationRules.js');
const keys = process.argv.slice(3);
const presets = m.SIMULATION_RULE_PRESETS || {};
const list = Array.isArray(presets) ? presets : Object.values(presets);
const virt = new Set(m.ENGINE_GATED_VIRTUAL_RULE_KEYS || []);
console.log('presets:', list.map((p) => p.id).join(' '));
for (const k of keys) {
  const lit = list.filter((p) => p.rules && p.rules[k] === true).map((p) => p.id);
  console.log(k.padEnd(28), 'default=', JSON.stringify(m.DEFAULT_SIMULATION_RULES[k]), 'virtual=', virt.has(k), 'lit in:', lit.join(',') || '-');
}
