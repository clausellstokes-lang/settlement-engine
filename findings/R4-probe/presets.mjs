// R4 probe: which presets light which flags (normalized), against the worktree's simulationRules.
const W = process.argv[2];
const m = await import(W + '/src/domain/worldPulse/simulationRules.js');
const flags = process.argv.slice(3);
const out = {};
for (const [id, p] of Object.entries(m.SIMULATION_RULE_PRESETS)) {
  const rules = m.normalizeSimulationRules({ ...(p.rules || p) });
  out[id] = Object.fromEntries(flags.map((f) => [f, rules[f]]));
}
console.log('DEFAULT', m.DEFAULT_SIMULATION_PRESET_ID);
for (const f of flags) {
  const lit = Object.entries(out).filter(([, v]) => v[f] === true).map(([k]) => k);
  console.log(f.padEnd(34), 'default=' + String(m.DEFAULT_SIMULATION_RULES[f]).padEnd(9), 'lit:', lit.join(',') || '(none)');
}
