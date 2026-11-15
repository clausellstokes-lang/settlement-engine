// RECORD-MEASURE-2 · c1 by member: which goods, which lists (made / exported), which sizes. node c1members.mjs <corpus> [json-out]
import { createRequire } from 'node:module'; import fs from 'node:fs'; const require = createRequire(import.meta.url);
const C = require('./load.cjs')(process.argv[2]);
const src = fs.readFileSync(new URL('./classes.mjs', import.meta.url), 'utf8');
const MAKER = eval('(()=>{const NOT_ACCESS = (re) => (n) => !/^access to/i.test(n) && re.test(n);return ' + src.slice(src.indexOf('const MAKER = [') + 14, src.indexOf('];', src.indexOf('const MAKER = [')) + 1) + '})()');
const T = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const row = () => ({ made: new Set(), exp: new Set(), both: new Set(), tier: {}, goods: {} });
const M = {}; const anyT = new Set(), expT = new Set(), madeT = new Set(), expNoCP = new Set(), madeNoCP = new Set(), anyNoCP = new Set(); const detail = {};
for (const { seed, s } of C) {
  const n = s.institutions.map((i) => String(i.name)); const L = (s.economicState.localProduction || []).map(String), E = (s.economicState.primaryExports || []).map(String);
  for (const [id, gre, mre] of MAKER) {
    if (n.some(mre)) continue;
    const gl = L.filter((x) => gre.test(x)), ge = E.filter((x) => gre.test(x)); if (!gl.length && !ge.length) continue;
    const r = (M[id] ??= row()); const cp = ['coal', 'peat'].includes(id);
    anyT.add(seed); if (!cp) anyNoCP.add(seed);
    if (gl.length) { r.made.add(seed); madeT.add(seed); if (!cp) madeNoCP.add(seed); }
    if (ge.length) { r.exp.add(seed); expT.add(seed); if (!cp) expNoCP.add(seed); (detail[seed] ??= []).push(id + '|' + ge.join('|')); }
    if (gl.length && ge.length) r.both.add(seed);
    r.tier[s.tier] = (r.tier[s.tier] || 0) + 1;
    for (const g of [...gl.map((x) => 'made:' + x), ...ge.map((x) => 'exp:' + x)]) r.goods[g] = (r.goods[g] || 0) + 1;
  }
}
console.log(`c1 ${anyT.size} (w/o coal/peat ${anyNoCP.size}) · made-side ${madeT.size} (${madeNoCP.size}) · export-side ${expT.size} (${expNoCP.size})`);
for (const [id, r] of Object.entries(M).sort((a, b) => (b[1].made.size + b[1].exp.size) - (a[1].made.size + a[1].exp.size)))
  console.log(`${id}\tmade ${r.made.size}\texp ${r.exp.size}\tboth ${r.both.size}\t${T.map((t) => t[0] + (r.tier[t] || 0)).join(' ')}\t${Object.entries(r.goods).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([g, v]) => v + ':' + g).join(' ; ')}`);
if (process.argv[3]) fs.writeFileSync(process.argv[3], JSON.stringify({ expTowns: [...expT], expNoCP: [...expNoCP], detail }));
