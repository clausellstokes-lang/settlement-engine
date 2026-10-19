const M = process.argv[2];
const m = await import(M + '/src/domain/worldPulse/simulationRules.js');
const list = Object.values(m.SIMULATION_RULE_PRESETS);
const fs = list.find((p) => p.id === 'full_simulation');
const rr = list.find((p) => p.id === 'realistic_regional');
const on = (p) => Object.keys(p.rules).filter((k) => p.rules[k] === true).sort();
console.log('full_simulation TRUE:', on(fs).join(' '));
console.log('\nrealistic_regional TRUE:', on(rr).join(' '));
console.log('\nVIRTUAL:', [...m.ENGINE_GATED_VIRTUAL_RULE_KEYS].join(' '));
