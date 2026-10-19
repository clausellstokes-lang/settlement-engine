// Which flags are lit in which preset (master worktree, read-only import).
const M = process.argv[2];
const mod = await import(M + '/src/domain/worldPulse/simulationRules.js');
const presets = mod.SIMULATION_RULE_PRESETS || [];
const list = Array.isArray(presets) ? presets : Object.values(presets);
const flags = process.argv.slice(3);
console.log('DEFAULT', flags.map(f => `${f}=${mod.DEFAULT_SIMULATION_RULES[f]}`).join(' '));
for (const p of list) {
  const r = p.rules || {};
  const lit = flags.filter(f => r[f] === true);
  console.log(p.id, '->', lit.join(',') || '(none)');
}
console.log('exports:', Object.keys(mod).filter(k=>/PRESET|DORMANT|VIRTUAL/.test(k)).join(','));
