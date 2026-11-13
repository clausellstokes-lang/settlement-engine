// the 4,305 at one tree (births4305.mjs rows): relationship rows whose role word is masculine for a woman (any card),
// the styled feminine rows, the minted lords' categories, and office lines are not in the compact rows (not counted here)
import fs from 'node:fs'; import zlib from 'node:zlib';
const R = { births: 0, femMasc: 0, femStyled: 0, maleFem: 0, rows: 0, lordsCat: {}, govDebtOnLord: 0 };
for (const f of process.argv.slice(2)) for (const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) { if (!l) continue; const r = JSON.parse(l); R.births++;
  const by = new Map(r.npcs.map((p) => [p.id, p]));
  for (const p of r.npcs) if (p.title === 'the lord') R.lordsCat[p.cat] = (R.lordsCat[p.cat] || 0) + 1;
  for (const x of r.rel) { for (const [id, role] of [[x[0], x[4]], [x[1], x[5]]]) { const p = by.get(id); if (!p) continue; R.rows++;
      if (p.g === 'female' && /\b(lord|abbot|priest)\b/.test(role || '') && !/priestess/.test(role)) R.femMasc++;
      if (p.g === 'female' && /\b(lady|abbess|priestess)\b/.test(role || '')) R.femStyled++;
      if (p.g !== 'female' && /\b(lady|abbess|priestess)\b/.test(role || '')) R.maleFem++; }
    if (x[3] === 'Financial Dependence' && by.get(x[0])?.title === 'the lord') R.govDebtOnLord++; } }
console.log(JSON.stringify(R));
