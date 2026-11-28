import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs'); const [A, B] = process.argv.slice(2);
const a = Object.fromEntries(L(A).map((r) => [r.seed, r.s]));
const seen = {}, keep = {};
for (const { seed, s } of L(B)) { if (!/^r2r-/.test(seed)) continue;
  (s.npcs || []).forEach((n, i) => { const o = a[seed].npcs[i];
    if (o.title !== n.title) { const k = o.title + ' ' + n.gender; (seen[k] ??= []).push(`${seed}\t${n.id}\t${n.name}\t${n.gender}\t${o.title} -> ${n.title}\trole ${n.role}\tface ${n.institution?.title}`); }
    else if (['the lord','the ferryman','the madam','the midwife','the alewife','the senior abbot','the front man'].includes(n.title)) (keep[n.title + ' ' + n.gender] ??= []).push(`${seed}\t${n.id}\t${n.name}\t${n.gender}\t${n.title}\trole ${n.role}`);
    if (n.gender === 'female' && /^Lord /.test(n.role)) (keep['office ' + n.role] ??= []).push(`${seed}\t${n.id}\t${n.name}\t${n.gender}\ttitle ${n.title}\trole ${n.role}`);
  }); }
for (const [k, v] of Object.entries(seen)) console.log(`MOVE ${k} (${v.length}): ${v.slice(0, 2).join(' || ')}`);
for (const [k, v] of Object.entries(keep)) console.log(`KEEP ${k} (${v.length}): ${v[0]}`);
