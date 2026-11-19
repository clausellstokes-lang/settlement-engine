// UPKEEP-9 #598: in towns whose court flag stands with no courthouse (defenseFactsOf: hasCourt && !hasCourthouse),
// every rendered line that names a court. usage: TREE=<tree> node court598.mjs <census-out-dir> <out.json>
import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE; const D=process.argv[2];
const { defenseFactsOf } = await import(T+'/src/domain/defense/defenseFacts.js');
const rows=zlib.gunzipSync(fs.readFileSync(D+'/corpus.ndjson.gz')).toString().split('\n').filter(Boolean).map(l=>JSON.parse(l));
const COURT=/\bcourts?\b(?!yard|ier|ship)|\bcourthouses?\b/i;
const by={}; let towns=0; const townsHit=new Set();
for(const r of rows){ const seed=r.seed; const s=r.s||r.settlement||r.record; if(!s) continue;
  const h=defenseFactsOf({institutions:s.institutions||[]}); if(!(h.hasCourt && !h.hasCourthouse)) continue; towns++;
  const dump=fs.readFileSync(`${D}/dumps/${seed}.txt`,'utf8').split('\n'); let tab='';
  for(const line of dump){ if(/^== .* ==$/.test(line)){tab=line; continue;} if(COURT.test(line)){ const k=tab+' :: '+line.trim().replace(/\d+/g,'N').slice(0,160); (by[k]??=[]).push(seed); townsHit.add(seed);} } }
fs.writeFileSync(process.argv[3],JSON.stringify({towns,townsHit:townsHit.size,by},null,1));
console.log('towns flag-no-courthouse',towns,'towns with a court line',townsHit.size);
for(const [k,v] of Object.entries(by).sort((a,b)=>b[1].length-a[1].length)) console.log(String(v.length).padStart(4),k,'|',v.slice(0,3).join(' '));
