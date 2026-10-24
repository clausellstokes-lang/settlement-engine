import { HISTORICAL_EVENTS_DATA, EVENT_TYPE_NAMES, AGE_BY_TIER } from '/home/user/master-code-of-record/src/data/historyData.js';
console.log(JSON.stringify(AGE_BY_TIER));
for (const e of HISTORICAL_EVENTS_DATA) {
  console.log(`## ${e.type} | name=${e.name||EVENT_TYPE_NAMES[e.type]} | sev=${(e.severity||[]).join('/')} | keys=${Object.keys(e).join(',')}`);
  console.log(`  D: ${e.description}`);
  console.log(`  F: ${(e.factions||[]).join(' ; ')}`);
  console.log(`  L: ${(e.lastingEffects||[]).join(' ; ')}`);
}
