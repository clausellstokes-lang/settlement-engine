// D-FOLD-r2 probe (read-only): FOLD-V2's receipt re-run — the born campaign's rules vs a forced realistic_regional birth
const root = process.argv[2];
const m = await import(root + '/src/domain/worldPulse/simulationRules.js');
const born = m.newCampaignSimulationRules();
const forced = m.newCampaignSimulationRules('realistic_regional');
const bornKeys = Object.keys(born), forcedKeys = Object.keys(forced);
const added = forcedKeys.filter(k => !(k in born)).sort();
const litNotBorn = forcedKeys.filter(k => forced[k] === true && born[k] !== true).sort();
const changedValue = forcedKeys.filter(k => (k in born) && JSON.stringify(born[k]) !== JSON.stringify(forced[k])).sort();
console.log(JSON.stringify({
  NEW_CAMPAIGN_SIMULATION_PRESET_ID: m.NEW_CAMPAIGN_SIMULATION_PRESET_ID ?? null,
  bornPresetId: born.presetId, forcedPresetId: forced.presetId,
  bornKeyCount: bornKeys.length, forcedKeyCount: forcedKeys.length,
  addedKeyCount: added.length, added,
  litInForcedNotBornCount: litNotBorn.length, litInForcedNotBorn: litNotBorn,
  sharedKeysWithDifferentValue: changedValue,
  navalEnabled: { born: born.navalEnabled ?? null, forced: forced.navalEnabled ?? null },
}, null, 1));
