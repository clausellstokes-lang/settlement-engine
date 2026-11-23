// bornsum.js <json>... : the born role probe merged: class totals by read, the dm/share split, five examples per class
const fs = require('fs'); const T = {}; const E = {}; let towns = 0, reads = 0, errors = 0;
for (const f of process.argv.slice(2)) { const j = JSON.parse(fs.readFileSync(f, 'utf8')); towns += j.towns; reads += j.reads; errors += j.errors;
  for (const [k, v] of Object.entries(j.tally)) { T[k] = (T[k] || 0) + v; if (!E[k]) E[k] = j.ex[k]; } }
console.log(`towns ${towns}, reads ${reads}, errors ${errors}`);
const by = {}; for (const [k, v] of Object.entries(T)) { const [cls, shape, share, dm, rd] = k.split('|'); const kk = `${cls} | ${rd ?? share} | ${cls.startsWith('TWIN') ? '' : `${dm}`}`; by[kk] = (by[kk] || 0) + v; }
for (const k of Object.keys(by).sort()) console.log(`${by[k]}\t${k}`);
for (const cls of ['CARRY', 'CHANGE', 'DROPVIS', 'TWIN-DIFFERS', 'UNMATCHED-TIE']) { const ks = Object.keys(T).filter((k) => k.startsWith(cls + '|')); if (!ks.length) continue;
  console.log(`== ${cls}: by share/read`); for (const k of ks.sort().slice(0, 14)) console.log(`  ${T[k]}\t${k}\t${(E[k] || []).slice(0, 1).join(' ').slice(0, 160)}`); }
