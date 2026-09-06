import { SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES, DEFAULT_SIMULATION_PRESET_ID, normalizeSimulationRules } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/src/domain/worldPulse/simulationRules.js';
const rr = SIMULATION_RULE_PRESETS[DEFAULT_SIMULATION_PRESET_ID].rules;
const BOOLEAN_KEYS = Object.keys(DEFAULT_SIMULATION_RULES).filter(k => typeof DEFAULT_SIMULATION_RULES[k] === 'boolean');
const classE = BOOLEAN_KEYS.filter(k => DEFAULT_SIMULATION_RULES[k] === false && rr[k] !== true);
const selfInfer = (over) => { const o = { ...rr, ...over }; delete o.presetId; return normalizeSimulationRules(o).presetId; };
console.log('--- each class-E key alone ---');
const survivors = [];
for (const k of classE) { const id = selfInfer({ [k]: true }); if (id === DEFAULT_SIMULATION_PRESET_ID) survivors.push(k); console.log('  ', k.padEnd(30), '->', id); }
console.log('SURVIVORS (preset still round-trips):', JSON.stringify(survivors));
console.log('--- the faith pair together (the O-12 lockstep) ---');
console.log('  faithSpread+religionDynamics ->', selfInfer({ faithSpreadEnabled: true, religionDynamicsEnabled: true }));
console.log('--- ALL thirteen at once (what hunk 5 would do) ---');
console.log('  all class E ->', selfInfer(Object.fromEntries(classE.map(k => [k, true]))));
