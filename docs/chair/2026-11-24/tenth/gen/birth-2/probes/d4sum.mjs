import { readFileSync } from 'node:fs';
const Z = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
for (const c of ['C', 'V']) {
  const rows = readFileSync(`${process.argv[2]}/${c}.jsonl`, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  const t = {}; const ex = {};
  const add = (k, z, seed) => { ((t[k] ||= {})[z] = (t[k][z] || 0) + 1); (ex[k] ||= []).length < 3 && ex[k].push(seed); };
  for (const r of rows) {
    if (r.outOfPlace.length) add('outOfOrder', r.size, r.seed);
    if (r.outOfPlace.length && !r.outOfPlace.every((i) => i === r.n - 1 || r.outOfPlace.length <= 2)) add('moreThanLast', r.size, r.seed);
    for (const k of ['first', 'top3', 'top5', 'top8', 'second']) if (r[k][0] !== r[k][1]) add(k, r.size, r.seed);
    if (r.holder && r.holder !== r.gov && !String(r.holder).startsWith('ERR')) add('holderNotGov', r.size, r.seed);
    if (String(r.holder).startsWith('ERR')) add('holderErr', r.size, r.seed);
  }
  console.log(`${c}: ${rows.length} births`); console.log('reading'.padEnd(14) + Z.map((z) => z.slice(0, 5).padStart(6)).join('') + '   all  seeds');
  for (const [k, v] of Object.entries(t)) console.log(k.padEnd(14) + Z.map((z) => String(v[z] || 0).padStart(6)).join('') + String(Z.reduce((n, z) => n + (v[z] || 0), 0)).padStart(6) + '  ' + ex[k].join(' '));
}
