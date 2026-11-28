import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE; const D=process.argv[2];
const { defenseFactsOf } = await import(T+'/src/domain/defense/defenseFacts.js');
const rows=zlib.gunzipSync(fs.readFileSync(D+'/corpus.ndjson.gz')).toString().split('\n').filter(Boolean).map(l=>JSON.parse(l));
const c={}; for(const r of rows){ const h=defenseFactsOf({institutions:r.s.institutions||[]}); if(!(h.hasCourt&&!h.hasCourthouse)) continue;
 for(const line of fs.readFileSync(`${D}/dumps/${r.seed}.txt`,'utf8').split('\n')) { const m=line.match(/Legal Infrastructure(Court[^A-Z]*\S*)/); if(m) c[m[1]]=(c[m[1]]||0)+1; } }
console.log(c);
