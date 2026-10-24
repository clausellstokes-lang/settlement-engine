import { SIMULATION_RULE_PRESETS } from '/home/user/master-code-of-record/src/domain/worldPulse/simulationRules.js';
const keys = process.argv.slice(2);
for (const [id,p] of Object.entries(SIMULATION_RULE_PRESETS)) { const r = p.rules||p; console.log(id.padEnd(20), keys.map(k=>`${k}=${r[k]}`).join(' ')); }
