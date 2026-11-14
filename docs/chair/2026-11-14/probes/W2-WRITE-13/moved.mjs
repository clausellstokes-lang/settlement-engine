// moved.mjs <renderOut> <replay.json> <poolRegex>: per pool, drawn per vid before -> after, the moves (old vid -> new vid) with towns
import fs from 'node:fs'; import path from 'node:path';
const [rout, rp, re] = process.argv.slice(2); const R = new RegExp(re); const A = JSON.parse(fs.readFileSync(rp, 'utf8'));
const P = {};
for (const [s, pools] of Object.entries(A)) {
  const B = JSON.parse(fs.readFileSync(path.join(rout, 'dumps', s + '.draws.json'), 'utf8'));
  for (const [pk, a] of Object.entries(pools)) { if (!R.test(pk)) continue; const b = B[pk].d[0]; const n = a.d[0] ?? 0;
    const p = (P[pk] ||= { before: {}, after: {}, moves: {} }); p.before[b] = (p.before[b] || 0) + 1; p.after[n] = (p.after[n] || 0) + 1;
    if (b !== n) (p.moves[`v${b}->${n ? 'v' + n : 'silent'}`] ||= []).push(s); }
}
const fmt = (o) => Object.entries(o).sort((x, y) => +x[0] - +y[0]).map(([v, c]) => (v === '0' ? 'silent' : 'v' + v) + ' ' + c).join(' / ');
for (const [pk, p] of Object.entries(P)) { if (!Object.keys(p.moves).length) continue; console.log(`## ${pk}\n  before ${fmt(p.before)}\n  after  ${fmt(p.after)}`);
  for (const [m, ss] of Object.entries(p.moves)) console.log(`  ${m}: ${ss.length} [${ss.slice(0, 8).join(' ')}${ss.length > 8 ? ' …' : ''}]`); }
