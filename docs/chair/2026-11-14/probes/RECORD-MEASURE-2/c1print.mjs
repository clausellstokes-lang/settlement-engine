// RECORD-MEASURE-2 · c1 printed by member: node c1print.mjs <c1.json (c1members)> <corpus> <dumps>
// a member PRINTS where the dump's tabs (Summary/Systems/World/Table) hold the good's label; the section is named
import fs from 'node:fs'; import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const [J, CORPUS, DUMPS] = process.argv.slice(2);
const src = fs.readFileSync(new URL('./classes.mjs', import.meta.url), 'utf8');
const MAKER = eval('(()=>{const NOT_ACCESS = (re) => (n) => !/^access to/i.test(n) && re.test(n);return ' + src.slice(src.indexOf('const MAKER = [') + 14, src.indexOf('];', src.indexOf('const MAKER = [')) + 1) + '})()');
const C = require('./load.cjs')(CORPUS);
const sect = (txt) => { const o = {}; let cur = ''; for (const l of txt.split('\n')) { const m = /^== (.+) ==$/.exec(l); if (m) cur = m[1]; else (o[cur] ??= []).push(l); } return Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.join('\n').toLowerCase()])); };
const strip = (g) => g.replace(/ \((transit|taxed by occupation|naval route only)\)$/, '');
const out = {}; const towns = { made: new Set(), exp: new Set(), any: new Set(), anyNoCP: new Set() };
for (const { seed, s } of C) {
  const n = s.institutions.map((i) => String(i.name)); const f = `${DUMPS}/${seed}.txt`; if (!fs.existsSync(f)) continue; let ds = null;
  for (const [id, gre, mre] of MAKER) {
    if (n.some(mre)) continue;
    for (const [side, list] of [['made', s.economicState.localProduction || []], ['exp', s.economicState.primaryExports || []]]) {
      for (const g of list.map(String).filter((x) => gre.test(x))) {
        ds ??= sect(fs.readFileSync(f, 'utf8'));
        const w = strip(g).toLowerCase(); const where = Object.entries(ds).filter(([k, v]) => /^(Summary|Systems|World|Table)\//.test(k) && v.includes(w)).map(([k]) => k);
        const k = `${side} ${id}`; (out[k] ??= { rec: new Set(), printed: new Set(), sec: {} }).rec.add(seed);
        if (where.length) { out[k].printed.add(seed); towns[side].add(seed); towns.any.add(seed); if (!['coal', 'peat'].includes(id)) towns.anyNoCP.add(seed); for (const x of where) out[k].sec[x] = (out[k].sec[x] || 0) + 1; }
      }
    }
  }
}
console.log(`printed: any ${towns.any.size} (w/o coal/peat ${towns.anyNoCP.size}) · made ${towns.made.size} · exported ${towns.exp.size}`);
for (const [k, v] of Object.entries(out).sort((a, b) => b[1].printed.size - a[1].printed.size)) console.log(`${k}\trecord ${v.rec.size}\tprinted ${v.printed.size}\t${Object.entries(v.sec).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([s, c]) => c + ':' + s).join(' ')}`);
