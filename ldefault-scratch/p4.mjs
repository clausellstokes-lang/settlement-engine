import { SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES, DEFAULT_SIMULATION_PRESET_ID, ENGINE_GATED_VIRTUAL_RULE_KEYS, ENGINE_GATED_DORMANT_RULE_KEYS, normalizeSimulationRules } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/src/domain/worldPulse/simulationRules.js';
const rr = SIMULATION_RULE_PRESETS[DEFAULT_SIMULATION_PRESET_ID].rules;
const defKeys = new Set(Object.keys(DEFAULT_SIMULATION_RULES));
console.log('ENGINE_GATED_VIRTUAL_RULE_KEYS (authored) =', ENGINE_GATED_VIRTUAL_RULE_KEYS.length);
console.log('ENGINE_GATED_DORMANT_RULE_KEYS (derived)  =', ENGINE_GATED_DORMANT_RULE_KEYS.length);
const stillDark = ENGINE_GATED_VIRTUAL_RULE_KEYS.filter(k => rr[k] !== true);
console.log('\nVIRTUAL engine-gated keys STILL DARK on the lit default =', stillDark.length);
const selfInfer = (over) => { const o = { ...rr, ...over }; delete o.presetId; return normalizeSimulationRules(o).presetId; };
for (const k of stillDark) {
  const inDefault = defKeys.has(k);
  const id = selfInfer({ [k]: true });
  const safe = !inDefault && id === DEFAULT_SIMULATION_PRESET_ID;
  console.log(' ', k.padEnd(34), inDefault ? 'IN-DEFAULT' : 'virtual   ', '->', String(id).padEnd(20), safe ? 'SAFE on a legacy id' : '⛔ BREAKS IDENTITY');
}
