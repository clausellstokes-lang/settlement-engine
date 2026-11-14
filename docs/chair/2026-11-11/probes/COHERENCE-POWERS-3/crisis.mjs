// node crisis.mjs <base.plan.jsonl> <tip.plan.jsonl> — the forced-crisis births where the crisis's own power is not on the page
import fs from 'node:fs';
const read = (f) => new Map(fs.readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l)).map((r) => [r.key, r]));
const TIERS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
/** the crisis's own power(s): the names stressFactions.js pushes for it (a pool-named power: the names it pushed) */
const FIXED = {
  under_siege: ['War Council'], wartime: ['War Council'], occupied: ['Occupation Authority'],
  politically_fractured: ['Loyalist Noble Bloc', 'Reform Noble Bloc', 'Third Bloc (Neutrals)'], indebted: ["Creditor's Representative", 'Crown Creditors (Noble Coalition)'],
  recently_betrayed: ['The Inquiry'], infiltrated: [], succession_void: ['Noble Claimant (Senior Line)', 'Noble Claimant (Reform Line)'],
  famine: ['Grain Holders'], plague_onset: ['Quarantine Council'], monster_pressure: ['Monster Hunters / Adventurers'],
  insurgency: ["Commons' Reform Assembly", "Journeymen's League", "People's Council", 'Loyalist Noble Opposition', "Reform Stewards' Coalition", 'Reform Movement'],
  mass_migration: ["Newcomers' Settlement", 'Departure Committee'], religious_conversion: ['New Faith Community', 'Reform Congregation', 'Conversion Enforcement Office', 'Underground Old Faith'],
  slave_revolt: ['Revolt Leadership', 'Abolitionist Network'],
};
const ALLFIXED = new Set(Object.values(FIXED).flat().concat(['Peace Movement', 'Resistance Network']));
const POOLED = ['politically_fractured', 'infiltrated', 'succession_void'];
const ownOf = (stress, pushed) => [...FIXED[stress], ...(POOLED.includes(stress) ? pushed.filter((n) => !ALLFIXED.has(n)) : [])];
const table = {}; const ex = {};
for (const [label, file] of [['line', process.argv[2]], ['tip', process.argv[3]]]) {
  for (const r of read(file).values()) {
    if (!r.stress) continue;
    const pushed = (r.pushed.at(-1)?.names) || [];
    const own = ownOf(r.stress, pushed);
    const roster = new Set(r.roster.map((x) => x[0]));
    const absent = own.length === 0 || !own.some((n) => roster.has(n));
    const k = r.stress; table[k] ||= {}; table[k][r.tier] ||= { line: [0, 0], tip: [0, 0] };
    table[k][r.tier][label][1]++;
    if (absent) { table[k][r.tier][label][0]++; if (label === 'tip') (ex[k] ||= []).push(`${r.key}: ${own.join('/') || '(nothing pushed)'}`); }
  }
}
console.log('| crisis | its own power | ' + TIERS.join(' | ') + ' | all |'); console.log('|---|---|' + TIERS.map(() => '---').join('|') + '|---|');
const OWN = { under_siege: 'War Council', wartime: 'War Council', occupied: 'Occupation Authority', politically_fractured: 'Loyalist Noble Bloc / a pool bloc', indebted: "Creditor's Representative / Crown Creditors", recently_betrayed: 'The Inquiry', infiltrated: 'a hidden pool power', succession_void: 'a claimant', famine: 'Grain Holders', plague_onset: 'Quarantine Council', monster_pressure: 'Monster Hunters / Adventurers', insurgency: "People's Council / the reform body", mass_migration: "Newcomers' Settlement / Departure Committee", religious_conversion: 'New Faith Community', slave_revolt: 'Revolt Leadership' };
let tl = [0, 0], tt = [0, 0];
for (const k of Object.keys(table).sort()) {
  const cells = TIERS.map((t) => { const c = table[k][t] || { line: [0, 0], tip: [0, 0] }; return `${c.line[0]} → ${c.tip[0]}`; });
  const sl = TIERS.reduce((a, t) => a + (table[k][t]?.line[0] || 0), 0), st = TIERS.reduce((a, t) => a + (table[k][t]?.tip[0] || 0), 0);
  const n = TIERS.reduce((a, t) => a + (table[k][t]?.tip[1] || 0), 0); tl[0] += sl; tt[0] += st; tl[1] += n;
  console.log(`| ${k} | ${OWN[k]} | ${cells.join(' | ')} | ${sl} → ${st} of ${n} |`);
}
console.log(`| all | | | | | | | | ${tl[0]} → ${tt[0]} of ${tl[1]} |`);
if (process.argv[4]) for (const [k, v] of Object.entries(ex)) console.log(k, v.length, v.slice(0, 4).join('; '));
