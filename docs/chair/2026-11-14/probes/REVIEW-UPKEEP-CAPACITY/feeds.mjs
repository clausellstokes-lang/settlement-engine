// part id -> the scores it feeds, read from defencePartsOf over births. TREE=<tree> node feeds.mjs <dir> <seedlist>
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { defencePartsOf } = await import(T+'/src/generators/defenseGenerator.js');
const m={}; for(const seed of fs.readFileSync(process.argv[3],'utf8').trim().split('\n').slice(0,400)){ const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${process.argv[2]}/${seed}.json.gz`))); for(const p of defencePartsOf(s)) if(p.feeds) m[p.id]=p.feeds; }
console.log(JSON.stringify(m));
