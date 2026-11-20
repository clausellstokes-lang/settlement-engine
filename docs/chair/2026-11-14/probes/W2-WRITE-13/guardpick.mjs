// guardpick.mjs <renderOut> <replay.json> : for each (pool, vid) that the tree's declarations took off some towns, a configOf-shaped seed of the case
import fs from 'node:fs'; import path from 'node:path';
const [rout, rp] = process.argv.slice(2); const A = JSON.parse(fs.readFileSync(rp, 'utf8')); const G = {};
const ok = (s) => /^(w5|rww)-(thorp|hamlet|village|town|city|metropolis)-([a-z_+]+)-(\d+)$/.test(s);
for (const [s, pools] of Object.entries(A)) { if (!ok(s)) continue;
  const B = JSON.parse(fs.readFileSync(path.join(rout, 'dumps', s + '.draws.json'), 'utf8'));
  for (const [pk, a] of Object.entries(pools)) for (const v of B[pk].e) if (!a.e.includes(v)) {
    const k = `${pk}::v${v}`; (G[k] ||= { drawnHere: [], elig: [] }); (B[pk].d.includes(v) ? G[k].drawnHere : G[k].elig).push(s); } }
for (const [k, g] of Object.entries(G).sort()) console.log(k, '|', (g.drawnHere[0] || g.elig[0]), '| drawn-before-here', g.drawnHere.length, 'eligible-only', g.elig.length);
