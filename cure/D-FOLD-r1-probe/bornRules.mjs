// D-FOLD-r1 probe (read-only): does a freshly born campaign carry the default preset's switches?
// Usage: node bornRules.mjs <master worktree path>
const root = process.argv[2];
const m = await import(root + '/src/domain/worldPulse/simulationRules.js');
const born = m.newCampaignSimulationRules();
const presets = m.SIMULATION_RULE_PRESETS;
const out = { NEW_CAMPAIGN_SIMULATION_PRESET_ID: m.NEW_CAMPAIGN_SIMULATION_PRESET_ID, bornPresetId: born.presetId, presetIds: Object.keys(presets), compare: {} };
const watch = ['pactFormationEnabled','faithUnseatingEnabled','warLayerEnabled','hearingWeekEnabled','npcConsequencesEnabled','faithSpreadEnabled','infoMode','spatialMode','politicalAutonomy'];
out.bornWatched = Object.fromEntries(watch.map(k => [k, born[k]]));
for (const id of Object.keys(presets)) {
  const pr = m.normalizeSimulationRules(presets[id].rules);
  const keys = new Set([...Object.keys(born), ...Object.keys(pr)]);
  const diff = [];
  for (const k of keys) if (JSON.stringify(born[k]) !== JSON.stringify(pr[k])) diff.push([k, born[k], pr[k]]);
  const litInPresetNotBorn = diff.filter(([k,b,p]) => p === true && b !== true).map(([k]) => k);
  out.compare[id] = { diffCount: diff.length, litInPresetNotBorn, presetWatched: Object.fromEntries(watch.map(k => [k, pr[k]])) };
}
console.log(JSON.stringify(out, null, 1));
