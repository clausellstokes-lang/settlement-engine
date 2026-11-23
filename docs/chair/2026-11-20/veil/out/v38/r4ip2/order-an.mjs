// R4I-PAGE-2 item O: the counts of order.probe.jsx's shards.  node order-an.mjs <outdir>
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const births = readdirSync(dir).filter((f) => /^order-shard\d+\.json$/.test(f)).flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).births);
const line = (...a) => console.log(a.join(' '));
line('places', births.length, '| hidden-house', births.filter((b) => b.hidden > 0).length, '| controls', births.filter((b) => !b.hidden).length);
for (const eng of ['twin', 'server']) {
  const bs = births.filter((b) => b[eng]);
  if (!bs.length) { line(eng, 'not read'); continue; }
  line(`${eng}: SERVED DOCUMENT equal modulo the bijection on two reads:`, bs.filter((b) => b[eng].served.equal).length, 'of', bs.length);
  const keys = {}; const arrs = {}; const views = {};
  for (const b of bs) { for (const k of b[eng].served.keys) keys[k] = (keys[k] || 0) + 1; for (const k of b[eng].served.arrays) arrs[k] = (arrs[k] || 0) + 1; for (const v of b[eng].viewsMoved) views[v] = (views[v] || 0) + 1; }
  line(`${eng}: served top-level keys that move (places):`, JSON.stringify(keys));
  line(`${eng}: served person arrays that move (places):`, JSON.stringify(arrs));
  line(`${eng}: PRINTED views that move between two reads, by surface (places):`, JSON.stringify(views));
  if (eng === 'twin') line('twin (the client seam over an unserved row, as rendered): served equal on two reads:', bs.filter((b) => b.twin.seam.equal).length, 'of', bs.length);
  line(`${eng}: views rendered per place (min, max):`, Math.min(...bs.map((b) => b[eng].views)), Math.max(...bs.map((b) => b[eng].views)), '| the sheet drawn (places):', bs.filter((b) => b[eng].sheet > 100).length);
  line(`${eng}: places with any printed view moved:`, bs.filter((b) => b[eng].viewsMoved.length).length, 'of', bs.length);
  for (const b of bs.filter((x) => x[eng].viewsMoved.length).slice(0, 12)) line('  ', b.seed, b[eng].viewsMoved.join(', '));
}
const tv = births.filter((b) => b.server);
if (tv.length) line('twin vs server, first reads, served document equal modulo the bijection:', tv.filter((b) => b.server.twinVsServer.equal).length, 'of', tv.length, JSON.stringify(tv.flatMap((b) => b.server.twinVsServer.keys).reduce((m, k) => ({ ...m, [k]: (m[k] || 0) + 1 }), {})));
