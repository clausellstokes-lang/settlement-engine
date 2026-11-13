// UPKEEP-8, step 4 (MEASURE ONLY: the writer is defenseDisplay.js, not this lane's): the Food endurance line's months
// against the record's stored months and the Economics stores row. usage: TREE=<tree> node endurance.mjs <births.full.ndjson>
import fs from 'node:fs'; import readline from 'node:readline';
const T = process.env.TREE;
const { foodEnduranceLine } = await import(T + '/src/domain/display/defenseDisplay.js');
const { foodEnduranceOf } = await import(T + '/src/domain/defense/defenseFacts.js');
const { foodStoresWords } = await import(T + '/src/domain/summary/tonightSheet.js');
const c = { lines: 0, underAWeekSaidWeeks: 0, fullBeyondStoresWords: 0, halfOverTwiceStores: 0 }; const ex = {};
const note = (k, seed, t) => { c[k]++; (ex[k] = ex[k] || []).length < 3 && ex[k].push(`${seed}: ${t}`); };
for await (const l of readline.createInterface({ input: fs.createReadStream(process.argv[2]) })) {
  const { seed, s } = JSON.parse(l); const line = foodEnduranceLine(s); const end = foodEnduranceOf(s); if (!line || !end) continue; c.lines++;
  const econ = foodStoresWords(s.economicState.foodSecurity.foodRecord);
  if (end.storedMonths < 0.25 && /a few weeks/.test(line.sentence)) note('underAWeekSaidWeeks', seed, `${end.storedMonths.toFixed(2)} mo | ${line.sentence.slice(0, 150)}`);
  if (end.fullRationMonths !== null && Math.round(end.fullRationMonths) > Math.max(1, Math.round(end.storedMonths))) note('fullBeyondStoresWords', seed, `${end.storedMonths.toFixed(2)} mo stored; Economics "${econ}" | ${line.sentence.slice(0, 170)}`);
  if (end.halfRationMonths !== null && end.halfRationMonths > 2.5 * end.storedMonths) note('halfOverTwiceStores', seed, `${end.storedMonths.toFixed(2)} mo | ${line.sentence.slice(60, 230)}`);
}
console.log(JSON.stringify(c)); for (const [k, v] of Object.entries(ex)) { console.log('##', k); for (const e of v) console.log('  ', e); }
