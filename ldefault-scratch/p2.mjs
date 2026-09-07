import { SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_RULES, DEFAULT_SIMULATION_PRESET_ID, normalizeSimulationRules } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/src/domain/worldPulse/simulationRules.js';
const rr = SIMULATION_RULE_PRESETS[DEFAULT_SIMULATION_PRESET_ID].rules;
const BOOLEAN_KEYS = Object.keys(DEFAULT_SIMULATION_RULES).filter(k => typeof DEFAULT_SIMULATION_RULES[k] === 'boolean');
const cmp = new Set(['propagationMode','intensity','migrationMode',...BOOLEAN_KEYS]);
// A LEGACY installed Realistic Regional save: exactly the DEFAULT surface, no virtual keys.
const legacySave = { ...DEFAULT_SIMULATION_RULES };
console.log('control: legacy save infers =', normalizeSimulationRules(legacySave).presetId);
// Class E candidates: keys FALSE in the defaults (so comparison keys) and dark on rr.
const classE = BOOLEAN_KEYS.filter(k => DEFAULT_SIMULATION_RULES[k] === false && rr[k] !== true);
console.log('class-E-shaped keys (false in DEFAULT, dark on the lit default):', classE.length);
console.log(classE.join(', '));
console.log('all of them RULE_COMPARISON_KEYS members?', classE.every(k => cmp.has(k)));
// THE TEST: light ONE of them on the default preset, then ask what a LEGACY save infers.
for (const k of classE.slice(0, 5)) {
  const hypotheticalPreset = { ...rr, [k]: true };
  // presetIdForRules is exercised through normalize on a keyless copy of the PRESET:
  const keyless = { ...hypotheticalPreset }; delete keyless.presetId;
  const presetSelf = normalizeSimulationRules(keyless).presetId;
  // ...and what the INSTALLED save now infers, given the preset table changed under it:
  console.log(`  ${k.padEnd(32)} preset re-infers as ${String(presetSelf).padEnd(20)} | legacy save still infers ${normalizeSimulationRules({ ...legacySave }).presetId}`);
}
