// dc.mjs <renderOut> '<block::pool>' : per vid, towns eligible / drawn, all and in famine / siege / occupied seeds (seed-named), with drawn seeds
import fs from 'node:fs'; import path from 'node:path';
const [rout, pk] = process.argv.slice(2); const d = path.join(rout, 'dumps');
const T = {}; const add = (k, vid, s) => { ((T[k] ||= {})[vid] ||= []).push(s); };
let reached = 0;
for (const f of fs.readdirSync(d).filter((x) => x.endsWith('.draws.json'))) {
  const s = f.replace('.draws.json', ''); const r = JSON.parse(fs.readFileSync(path.join(d, f), 'utf8'))[pk]; if (!r) continue; reached++;
  const cr = (s.match(/-(?:thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-/) || [])[1] || '';
  for (const v of r.d || []) { add('drawn', v, s); for (const c of ['famine', 'under_siege', 'occupied']) if (cr.split('+').includes(c)) add('drawn@' + c, v, s); }
  for (const v of r.e || []) add('elig', v, s);
  if (!(r.d || []).length) add('silent', 0, s);
}
console.log(pk, 'towns reaching the pool', reached);
for (const [k, m] of Object.entries(T)) console.log(' ', k.padEnd(18), Object.entries(m).map(([v, a]) => `v${v} ${a.length}`).join(' · '));
if (process.env.SEEDS) for (const [k, m] of Object.entries(T)) if (k.startsWith('drawn')) for (const [v, a] of Object.entries(m)) console.log(k, 'v' + v, a.join(' '));
