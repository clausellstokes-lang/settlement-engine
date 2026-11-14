// find.mjs <ndjson.gz> <regex> [max]: every string in each record matching the regex: seed, path, tier, pop, stresses.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [file, re, max='999999'] = process.argv.slice(2); const RX = new RegExp(re);
const rl = readline.createInterface({ input: fs.createReadStream(file).pipe(zlib.createGunzip()), crlfDelay: Infinity });
let towns=0, hits=0; const paths={};
for await (const line of rl) {
  const { seed, s } = JSON.parse(line); let found=false;
  (function walk(v, p){ if (typeof v === 'string') { if (RX.test(v)) { found=true; hits++; const k=p.replace(/\[\d+\]/g,'[]'); paths[k]=(paths[k]||0)+1; if (hits<=+max) console.log(JSON.stringify({seed, tier:s.tier, pop:s.population, st:(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+'), path:p, v: v.length>400? v.slice(0,400)+'…':v})); } }
    else if (Array.isArray(v)) v.forEach((x,i)=>walk(x, p+'['+i+']')); else if (v && typeof v==='object') for (const k of Object.keys(v)) walk(v[k], p+'.'+k); })(s, '');
  if (found) towns++;
}
console.error('TOWNS', towns, 'HITS', hits, JSON.stringify(paths));
