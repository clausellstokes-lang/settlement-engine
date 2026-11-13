// node f456.mjs <dump.jsonl> — F4: a power with neither a member nor a declared line; F5: a clandestine power's
// membership unveiled; F6: a crisis power's first who leads another power
import fs from 'node:fs';
const rows = fs.readFileSync(process.argv[2], 'utf8').trim().split('\n').map((l) => JSON.parse(l));
const CRISIS = new Set(["War Council", 'Occupation Authority', 'Resistance Network', 'Loyalist Noble Bloc', 'Reform Noble Bloc', 'Third Bloc (Neutrals)', "Creditor's Representative", 'Crown Creditors (Noble Coalition)', 'The Inquiry', 'Noble Claimant (Senior Line)', 'Noble Claimant (Reform Line)', 'Grain Holders', 'Quarantine Council', 'Monster Hunters / Adventurers', "Commons' Reform Assembly", "Journeymen's League", "People's Council", 'Loyalist Noble Opposition', "Reform Stewards' Coalition", 'Reform Movement', "Newcomers' Settlement", 'Departure Committee', 'Peace Movement', 'New Faith Community', 'Reform Congregation', 'Conversion Enforcement Office', 'Underground Old Faith', 'Revolt Leadership', 'Abolitionist Network', 'The Peerage', 'The Highborn Circle']);
const VEILED = new Set(['Resistance Network']);
const f4 = [], f5 = [], f6 = []; const f4by = {};
for (const r of rows) {
  for (const p of r.powers) {
    const members = r.cards.filter((c) => c.ms.some((m) => m[0] === p.n));
    if (!members.length && !p.l) { f4.push(`${r.key}: ${p.n} (${p.p})`); f4by[p.n] = (f4by[p.n] || 0) + 1; }
    if (VEILED.has(p.n)) for (const c of members) { const m = c.ms.find((x) => x[0] === p.n); if (!m[3]) f5.push(`${r.key}: ${c.n} (${c.ikey})`); }
    if (CRISIS.has(p.n) && p.first) { const c = r.cards.find((x) => x.id === p.first); if (c && c.ms.some((m) => m[0] !== p.n && m[1] === 1)) f6.push(`${r.key}: ${p.n} led by ${c.n} (${c.ikey}), first of ${c.ms.filter((m) => m[0] !== p.n && m[1] === 1).map((m) => m[0]).join(', ')}`); }
  }
}
const byC = (l) => { const o = {}; for (const x of l) { const c = x.startsWith('rv') || x.startsWith('golden') ? 'R' : 'S'; o[c] = (o[c] || 0) + 1; } return JSON.stringify(o); };
console.log('F4', f4.length, byC(f4), JSON.stringify(f4by)); console.log('F5', f5.length, byC(f5), 'towns', new Set(f5.map((x) => x.split(':')[0])).size); console.log('F6', f6.length, byC(f6));
if (process.argv[3]) for (const x of { 4: f4, 5: f5, 6: f6 }[process.argv[3]].slice(0, 12)) console.log(' ', x);
