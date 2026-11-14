import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const C = require('./load.cjs')(process.argv[2]);
const src = require('fs').readFileSync(new URL('./classes.mjs', import.meta.url), 'utf8');
const MAKER = eval('(()=>{const NOT_ACCESS = (re) => (n) => !/^access to/i.test(n) && re.test(n);return ' + src.slice(src.indexOf('const MAKER = [') + 14, src.indexOf('];', src.indexOf('const MAKER = [')) + 1) + '})()');
const tally = { local: {}, exports: {}, any: new Set(), localT: new Set(), expT: new Set() };
for (const { seed, s } of C) {
  const n = s.institutions.map((i) => i.name);
  for (const [field, key] of [['localProduction', 'local'], ['primaryExports', 'exports']]) {
    const g = (s.economicState[field] || []).map(String);
    for (const [id, gre, mre] of MAKER) if (g.some((x) => gre.test(x)) && !n.some(mre)) { tally[key][id] = (tally[key][id] || 0) + 1; (key === 'local' ? tally.localT : tally.expT).add(seed); }
  }
}
const ex = (id) => !['coal', 'peat'].includes(id);
let noCP = new Set();
for (const { seed, s } of C) { const n = s.institutions.map((i) => i.name); const g = [...s.economicState.localProduction, ...s.economicState.primaryExports].map(String); if (MAKER.some(([id, gre, mre]) => ex(id) && g.some((x) => gre.test(x)) && !n.some(mre))) noCP.add(seed); }
console.log('local towns', tally.localT.size, 'export towns', tally.expT.size, 'c1 without coal/peat', noCP.size);
console.log('LOCAL', JSON.stringify(tally.local)); console.log('EXPORTS', JSON.stringify(tally.exports));
