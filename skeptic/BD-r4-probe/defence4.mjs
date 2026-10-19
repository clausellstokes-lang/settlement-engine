// BD-r4 probe 4: the landed per-settlement defence read WC §1.8.1 names as "the ONE read-point"
// for a brigand against a town (defenseLedger.js :: defenseLedger) on master's sample settlements,
// beside the war capacity BD14 uses (militaryStrength.js :: deriveMilitaryCapacity → homeDefense).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src';
const { defenseLedger } = await import(M + '/domain/defenseLedger.js');
const { deriveMilitaryCapacity } = await import(M + '/domain/worldPulse/militaryStrength.js');
const mod = await import(M + '/data/sampleSettlements.js');
const list = Object.values(mod).flatMap(v => Array.isArray(v) ? v : (v && typeof v === 'object' ? Object.values(v) : []));
for (const s of list) {
  if (!s || typeof s !== 'object') continue;
  const tier = s.tier || s.config?.tier; if (!tier) continue;
  const L = defenseLedger(s);
  console.log(String(tier).padEnd(10), String(s.name || '?').slice(0, 20).padEnd(21), 'defenseLedger', JSON.stringify({ present: L.present, military: L.military, monster: L.monster, internal: L.internal }), 'homeDefense~', deriveMilitaryCapacity(s).currentCapacity.toFixed(1));
}
