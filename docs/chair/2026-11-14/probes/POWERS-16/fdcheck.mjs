import fs from 'node:fs'; import zlib from 'node:zlib';
const F = { 'Military/Guard': 'The Guard', 'Monster Hunters / Adventurers': 'Monster Hunters', 'Noble Claimant (Senior Line)': 'The Senior Line', 'Noble Claimant (Reform Line)': 'The Reform Line', 'Third Bloc (Neutrals)': 'The Neutrals', 'Crown Creditors (Noble Coalition)': 'Crown Creditors' };
const load = (d) => new Map(fs.readdirSync(d).filter((x) => x.endsWith('.ndjson.gz')).flatMap((x) => zlib.gunzipSync(fs.readFileSync(d + '/' + x)).toString().trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.key, r.s]; })));
const B = load(process.argv[2]), T = load(process.argv[3]);
let ok = 0, bad = 0, outside = 0; const ex = [];
const sub = (t) => { for (const [k, v] of Object.entries(F)) t = t.split(k).join(v); return t; };
const walk = (a, b, seed) => { if (a === b) return; if (a && b && typeof a === 'object') { for (const k of Object.keys(a)) walk(a[k], b[k], seed); return; }
  if (typeof a === 'string' && sub(a) === b) ok++; else { bad++; if (ex.length < 5) ex.push(seed + ': ' + String(a).slice(0, 140) + ' -> ' + String(b).slice(0, 140)); } };
for (const [seed, t] of T) { const b = B.get(seed); const has = b.powerStructure.factions.some((f) => F[f.faction]);
  const before = bad + ok; walk(b, t, seed); if (bad + ok > before && !has) outside++; }
console.log('substitutions', ok, 'other changes', bad, 'moved towns without such a power', outside); ex.forEach((e) => console.log(e));
