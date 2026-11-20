// usage: node arm.mjs <tree> <dumps-dir> <corpus.ndjson.gz> <out.json> — the tree's page arm over rendered dumps
import fs from 'node:fs'; import zlib from 'node:zlib'; import path from 'node:path';
const [tree, dumps, corpus, out] = process.argv.slice(2);
const { pageCensusFindings } = await import(`${tree}/src/domain/coherence/pageCensusFindings.js`);
const recs = new Map(zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n').filter(Boolean).map((l) => { const r = JSON.parse(l); return [r.seed, r.s]; }));
export const viewsOf = (txt) => { const v = {}; let cur = null; for (const l of txt.split('\n')) { const m = l.match(/^== (.+) ==$/); if (m) { cur = m[1]; v[cur] = []; } else if (cur && l && !l.startsWith('[STYLE]')) v[cur].push(l); } return v; };
const res = {}; const counts = {};
for (const f of fs.readdirSync(dumps).filter((x) => x.endsWith('.txt'))) {
  const seed = f.replace(/\.txt$/, '');
  const found = pageCensusFindings(recs.get(seed), viewsOf(fs.readFileSync(path.join(dumps, f), 'utf8')));
  res[seed] = found; for (const r of new Set(found.map((x) => x.row))) counts[r] = (counts[r] || 0) + 1;
}
fs.writeFileSync(out, JSON.stringify(res));
console.log(Object.keys(res).length, JSON.stringify(Object.fromEntries(Object.entries(counts).sort())));
