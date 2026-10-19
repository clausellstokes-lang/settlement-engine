// V-FOLD-r1 probe (read-only): born rules vs realistic_regional, key counts and the lit keys' values
const root = process.argv[2];
const m = await import(root + '/src/domain/worldPulse/simulationRules.js');
const born = m.newCampaignSimulationRules();
const forced = m.newCampaignSimulationRules('realistic_regional');
const raw = m.SIMULATION_RULE_PRESETS.realistic_regional.rules;
const pick = ['pactFormationEnabled','faithUnseatingEnabled','roadsEnabled','npcLadderEnabled'];
console.log(JSON.stringify({
  bornKeys: Object.keys(born).length, forcedKeys: Object.keys(forced).length,
  bornPresetId: born.presetId, forcedPresetId: forced.presetId,
  bornVals: Object.fromEntries(pick.map(k=>[k, born[k]])),
  forcedVals: Object.fromEntries(pick.map(k=>[k, forced[k]])),
  rawPresetVals: Object.fromEntries(pick.map(k=>[k, raw[k]])),
  defaultVals: Object.fromEntries(pick.map(k=>[k, (m.DEFAULT_SIMULATION_RULES||{})[k]])),
  litInForcedNotBorn: Object.keys(forced).filter(k => forced[k] === true && born[k] !== true).length,
}, null, 1));
