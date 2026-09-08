import { SIMULATION_RULE_PRESETS, DEFAULT_SIMULATION_PRESET_ID, newCampaignSimulationRules, normalizeSimulationRules, ENGINE_GATED_DORMANT_RULE_KEYS } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLDEFAULT/src/domain/worldPulse/simulationRules.js';
const born = newCampaignSimulationRules();
const lit = newCampaignSimulationRules(DEFAULT_SIMULATION_PRESET_ID);
console.log('dark birth keys      =', Object.keys(born).length, 'presetId', born.presetId);
console.log('lit rr birth keys    =', Object.keys(lit).length, 'presetId', lit.presetId);
console.log('DELTA                =', Object.keys(lit).length - Object.keys(born).length);
console.log('added keys           =', JSON.stringify(Object.keys(lit).filter(k => !(k in born))));
console.log('rr raw preset keys   =', Object.keys(SIMULATION_RULE_PRESETS.realistic_regional.rules).length);
const keyless = { ...SIMULATION_RULE_PRESETS.realistic_regional.rules }; delete keyless.presetId;
console.log('rr keyless re-infers =', normalizeSimulationRules(keyless).presetId);
// an INSTALLED legacy save: today's persisted default envelope, no virtual keys
const installed = normalizeSimulationRules();
console.log('installed re-infers  =', normalizeSimulationRules(installed).presetId, 'keys', Object.keys(normalizeSimulationRules(installed)).length);
console.log('DORMANT len          =', ENGINE_GATED_DORMANT_RULE_KEYS.length);
for (const [id,p] of Object.entries(SIMULATION_RULE_PRESETS)) console.log('  preset', id, Object.keys(p.rules).length);
