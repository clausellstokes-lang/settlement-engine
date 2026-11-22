// R5-DESC-MEASURE M5 (LIT): the strata's and the contenders' strings that name the act's hidden power or carry the mask, place by
// place, from the copied litsurf probe's shards (seatRead's strataHits).   node lit-strata.mjs <dir>
import { readFileSync, readdirSync } from 'node:fs';
const dir = process.argv[2];
const rows = readdirSync(dir).filter((f) => /^litsurf-shard\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(readFileSync(`${dir}/${f}`, 'utf8')).rows);
const J = (x) => JSON.stringify(x);
const out = []; let places = 0; let strings = 0; const byPath = {}; const bySrc = {};
for (const row of rows) for (const sc of row.seat || []) for (const [rd, r] of Object.entries(sc.reads || {})) for (const eng of ['server', 'twin']) {
  const hits = r?.[eng]?.strataHits || []; // seatRead returns it beside b_contest
  if (!hits.length) continue;
  places += 1; strings += hits.length;
  out.push(`${row.seed} act ${sc.scen} read ${rd} ${eng}: hidden power ${J(sc.hiddenPower)}; challengers ${J(r[eng].b_contest.challengers)}`);
  for (const [p, nm, mk, s] of hits) {
    const k = p.replace(/\[\d+\]/g, '[]'); byPath[k] = (byPath[k] || 0) + 1;
    const src = /\.faction\.(desc|crisisNote|description)$|\.governing\.(desc|crisisNote)$/.test(p) ? 'a served description (the raw row the strata hand back)' : /\.name$|\.faction\.faction$|\.governing\.faction$/.test(p) ? 'a served power name' : 'other';
    bySrc[src] = (bySrc[src] || 0) + 1;
    out.push(`    ${p} names=${nm} mask=${mk} ${J(s)}`);
  }
}
console.log(`M5 LIT: ${rows.length} births; ${places} place-reads (act x read x engine) whose strata/contenders strings hit; ${strings} strings`);
console.log(`by path: ${J(byPath)}`);
console.log(`by source: ${J(bySrc)}`);
console.log(out.join('\n'));
