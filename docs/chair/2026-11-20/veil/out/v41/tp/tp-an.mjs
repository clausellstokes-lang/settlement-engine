// V41-TP tables: node tp-an.mjs <outdir> [<c1 receipt>]. Sums tp-shard*.json; Q0 (C1's 18), Q1 classes, Q2 outcomes, Q4 open places.
import { readFileSync, readdirSync } from 'node:fs';
const O = process.argv[2];
const J = readdirSync(O).filter((f) => /^tp-shard\d+\.json$/.test(f)).sort().map((f) => JSON.parse(readFileSync(`${O}/${f}`, 'utf8')));
const T = {}; const EX = {}; const R = [];
for (const j of J) { for (const [k, v] of Object.entries(j.tally)) T[k] = (T[k] || 0) + v; for (const [k, v] of Object.entries(j.examples)) (EX[k] ||= []).push(...v); R.push(...j.records); }
const pr = (...a) => console.log(...a);
pr(`DOCUMENTS ${R.length} (server ${J.every((j) => j.server)}); src ${J[0]?.src}`);
// Q0
const nonEmpty = R.filter((r) => r.tensions.some((t) => Array.isArray(t.factions) && t.factions.length)).length;
pr(`Q0 documents with a non-empty history.currentTensions[].factions[]: ${nonEmpty} of ${R.length}; tensions ${R.reduce((a, r) => a + r.tensions.length, 0)}, parties ${R.reduce((a, r) => a + r.tensions.reduce((b, t) => b + (t.factions || []).length, 0), 0)}`);
const c1 = R.filter((r) => r.c1.length);
const byRole = {}; for (const r of c1) byRole[r.role] = (byRole[r.role] || 0) + 1;
const c1v = {}; for (const r of c1) for (const x of r.c1) c1v[x] = (c1v[x] || 0) + 1;
pr(`Q0 C1's lookup (telling party served nowhere as a leaf, whole in served prose; twin, 10 settings x 2 Reveals): ${c1.length} documents ${JSON.stringify(byRole)}; values ${JSON.stringify(c1v)}`);
pr(`   seeds: ${c1.map((r) => r.seed).join(' ')}`);
for (const r of c1.slice(0, 40)) {
  const ts = r.tensions.map((t, j) => ({ t, j })).filter(({ t }) => r.c1.some((x) => (t.factions || []).some((v) => x.startsWith(`${v} ->`))));
  const forms = Object.entries(r.served).filter(([k]) => k.startsWith('twin|')).flatMap(([k, fs]) => fs.filter((f) => ts.some(({ j }) => j === f.j)).map((f) => `${k.split('|').slice(1).join('|')}:${f.why}`));
  const whys = {}; for (const f of forms) { const w = f.split(':').slice(1).join(':'); whys[w] = (whys[w] || 0) + 1; }
  pr(`   ${r.seed} ${r.role} hideable=${JSON.stringify(r.hideable)} criminalPowers=${JSON.stringify(r.powers.filter((p) => p.split('|')[1] === 'criminal'))} tension ${JSON.stringify(ts.map(({ t }) => [t.type, t.factions]))} twin: ${JSON.stringify(whys)}`);
}
// Q1
pr('Q1 party classes (every stored party):');
for (const k of Object.keys(T).filter((k) => k.startsWith('Q1 ')).sort()) pr(`   ${T[k]} ${k.slice(3)}`);
for (const [k, v] of Object.entries(EX).filter(([k]) => k.startsWith('Q1 '))) pr(`   e.g. ${k.slice(3)}: ${[...new Set(v)].slice(0, 6).join(' ; ')}`);
// Q2
pr('Q2 per engine/door | the party | what is served at the place (every read, both Reveals, 11 settings + unmarked):');
for (const k of Object.keys(T).filter((k) => k.startsWith('Q2 ')).sort()) pr(`   ${T[k]} ${k.slice(3)}`);
pr('Q2 by setting (twin), parties that name something hidden:');
for (const k of Object.keys(T).filter((k) => k.startsWith('Q2s twin') && !k.includes('names nothing hidden')).sort()) pr(`   ${T[k]} ${k.slice(4)}`);
pr('Q2 non-hidden parties not served as stored (twin): ' + Object.keys(T).filter((k) => k.startsWith('Q2 twin | names nothing hidden') && !k.endsWith('stored name served')).map((k) => `${T[k]} ${k}`).join(' ; '));
for (const [k, v] of Object.entries(EX).filter(([k]) => !k.startsWith('Q1 '))) pr(`   e.g. ${k}: ${v.slice(0, 4).join(' ; ')}`);
// Q4
const open = R.filter((r) => !r.hiddenEver.length && !r.withheldEver.length);
pr(`Q4 OPEN places (no hideable house hidden and no power withheld on any read): ${open.length} of ${R.length}`);
const maxOf = {}; for (const r of R) for (const t of r.tensions) maxOf[t.type] = Math.max(maxOf[t.type] || 0, (t.factions || []).length);
const shortOpen = {}; const shapesOpen = new Set();
for (const r of open) for (const t of r.tensions) {
  shapesOpen.add(`${t.type}::${JSON.stringify(t.factions)}`);
  if ((t.factions || []).length < maxOf[t.type]) { const k = `${t.type} ${(t.factions || []).length}/${maxOf[t.type]}`; shortOpen[k] = (shortOpen[k] || 0) + 1; }
}
pr(`   open tensions shorter than their kind's longest: ${Object.values(shortOpen).reduce((a, b) => a + b, 0)} ${JSON.stringify(shortOpen)}`);
const gone = {}; const goneShapes = {};
for (const r of R) for (const [k, fs] of Object.entries(r.served)) for (const f of fs) if (f.why === 'party gone') {
  const t = r.tensions[f.j]; const eng = k.split('|')[0];
  const shape = `${t.type}::${JSON.stringify(f.served)}`; const seen = shapesOpen.has(shape);
  const key = `${eng} | ${seen ? 'served shape SEEN on an open place' : 'served shape NEVER on an open place'}`; gone[key] = (gone[key] || 0) + 1;
  (goneShapes[`${eng}|${seen}`] ||= new Map()).set(`${t.type} ${JSON.stringify(t.factions)} -> ${JSON.stringify(f.served)}`, ((goneShapes[`${eng}|${seen}`].get(`${t.type} ${JSON.stringify(t.factions)} -> ${JSON.stringify(f.served)}`)) || 0) + 1);
}
pr(`   reads with a party gone, by whether the served shorter list occurs on an open place: ${JSON.stringify(gone)}`);
for (const [k, m] of Object.entries(goneShapes)) pr(`   ${k}: ${[...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([s, n]) => `${n}x ${s}`).join(' ; ')}`);
