// one row per line: prints, towns, NEW-at-tip prints (true/false), smallest and largest size, towns under a forced crisis
import fs from 'node:fs';
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const A = process.argv.slice(2).map((f) => JSON.parse(fs.readFileSync(f, 'utf8'))); const keys = [...new Set(A.flatMap((r) => Object.keys(r)))].sort();
const crisis = (s) => /^r2s-/.test(s) || (/^rww-/.test(s) && !/-calm-/.test(s));
for (const k of keys) { let p = 0, t = 0, T = 0, F = 0, np = 0, nT = 0, nF = 0; const towns = [];
  for (const r of A) { const v = r[k]; if (!v) continue; p += v.prints; t += v.towns; T += v.true; F += v.false; np += v.newPrints; nT += v.newTrue; nF += v.newFalse; towns.push(...v.townList); }
  const sz = towns.map((s) => SZ.findIndex((z) => s.includes(z))).filter((i) => i >= 0);
  console.log(`| ${k} | ${p} in ${t} | ${T}/${F} | ${np} (${nT}/${nF}) | ${SZ[Math.min(...sz)]}–${SZ[Math.max(...sz)]} | ${towns.filter(crisis).length} |`); }
