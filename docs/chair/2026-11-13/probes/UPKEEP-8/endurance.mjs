// UPKEEP-8, step 4: the Food endurance line (defenseDisplay.js :: foodEnduranceLine, monthsInWords; RULED this lane's,
// the chair's 22:42 message) against the chair's three rules: the words contain the figure they stand for; what a siege
// WOULD do is said only where none is in force, what it HAS done only where one is; an arithmetic the line states adds
// up from the record's own stored months. Also: the Economics stores row (tonightSheet.js :: foodStoresWords, not this
// lane's) against the same stored months. usage: TREE=<tree> node endurance.mjs <births.full.ndjson>
import fs from 'node:fs'; import readline from 'node:readline';
const T = process.env.TREE;
const { foodEnduranceLine } = await import(T + '/src/domain/display/defenseDisplay.js');
const { foodEnduranceOf } = await import(T + '/src/domain/defense/defenseFacts.js');
const { foodStoresWords } = await import(T + '/src/domain/summary/tonightSheet.js');
const c = { lines: 0, weeksForDays: 0, tenseWrong: 0, fullNotTheStores: 0, halfNotTwiceTheStores: 0, economicsWeeksForDays: 0 }; const ex = {};
const note = (k, seed, t) => { c[k]++; (ex[k] = ex[k] || []).length < 3 && ex[k].push(`${seed}: ${t}`); };
/** the span a phrase claims, in months: [low, high] */
const SPAN = [[/^a day or two$/, 0, 0.1], [/^a few days$/, 0.05, 0.4], [/^a week or two$/, 0.2, 0.6], [/^a few weeks$/, 0.4, 1.05], [/^about a month$/, 0.7, 1.6],
  [/^about (\w+) months$/, null], [/^about a year$/, 11.5, 12.5], [/^more than a year$/, 12, 24], [/^more than two years$/, 24, 1e9]];
const NUM = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve'];
const holds = (phrase, months) => { for (const [re, lo, hi] of SPAN) { const m = re.exec(phrase); if (!m) continue; if (lo === null) { const n = NUM.indexOf(m[1]); return Math.abs(months - n) <= 0.5; } return months >= lo && months <= hi; } return false; };
for await (const l of readline.createInterface({ input: fs.createReadStream(process.argv[2]) })) {
  const { seed, s } = JSON.parse(l); const line = foodEnduranceLine(s); const end = foodEnduranceOf(s); if (!line || !end) continue; c.lines++;
  const t = line.sentence; const econ = foodStoresWords(s.economicState.foodSecurity.foodRecord);
  if (end.storedMonths < 0.33 && /a few weeks/.test(econ)) note('economicsWeeksForDays', seed, `${end.storedMonths.toFixed(2)} mo | ${econ}`);
  if (end.storedMonths < 0.33 && /a few weeks/.test(t)) note('weeksForDays', seed, `${end.storedMonths.toFixed(2)} mo | ${t.slice(0, 150)}`);
  if (end.besieged ? /would be lost/.test(t) : /\bare lost\b|\bhas taken\b|(?<!would )\b(?:carries|carry) the\b|(?<!would )\bstretches\b/.test(t)) note('tenseWrong', seed, `${end.besieged ? 'besieged' : 'no siege'} | ${t.slice(0, 170)}`);
  const full = /for (.+?) at full rations/.exec(t); if (full && !holds(full[1], end.storedMonths)) note('fullNotTheStores', seed, `${end.storedMonths.toFixed(2)} mo | "${full[1]}"`);
  const half = /, ([^,;]+?) on half/.exec(t); if (half && !holds(half[1], 2 * end.storedMonths)) note('halfNotTwiceTheStores', seed, `${end.storedMonths.toFixed(2)} mo | "${half[1]}"`);
}
console.log(JSON.stringify(c)); for (const [k, v] of Object.entries(ex)) { console.log('##', k); for (const e of v) console.log('  ', e); }
