// node b2tier.mjs <out>: the census's culture-profile hits (cultureProfiles.js and the block's own file) by tier of the town: small (thorp/hamlet/village) vs town and larger
import fs from 'node:fs'; import zlib from 'node:zlib';
const out = process.argv[2]; const tier = {}; for (const l of zlib.gunzipSync(fs.readFileSync(out + '/corpus.ndjson.gz')).toString().split('\n')) { if (!l) continue; const o = JSON.parse(l); tier[o.seed] = o.s.tier; }
const h = JSON.parse(fs.readFileSync(out + '/hits.json', 'utf8')).filter((x) => x.writer && /cultureProfiles\.js/.test(x.writer.file));
const small = new Set(['thorp', 'hamlet', 'village']); const S = new Set(), L = new Set(), Lk = {};
for (const x of h) { if (small.has(tier[x.seed])) S.add(x.seed); else { L.add(x.seed); const k = x.line.slice(0, 70); Lk[k] = (Lk[k] || 0) + 1; } }
console.log('towns small', S.size, '· town and larger', L.size); for (const [k, n] of Object.entries(Lk).sort((a, b) => b[1] - a[1]).slice(0, 5)) console.log('  ', n, k);
