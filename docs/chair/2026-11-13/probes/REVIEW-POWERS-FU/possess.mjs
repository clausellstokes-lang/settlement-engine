// possess.mjs <corpus.ndjson.gz> <dumpsDir>: every power or institution name of each town whose last word is a plural
// (-s, not -us/-ss/-is), printed with "'s" anywhere on that town's rendered page. Counts by name and view.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [C,D]=process.argv.slice(2); const hits={}; let towns=0, townsHit=0; const ex=[];
const rl=readline.createInterface({input:fs.createReadStream(C).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await(const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); const f=`${D}/${seed}.txt`; if(!fs.existsSync(f)) continue; towns++;
  const names=new Set([...(s.powerStructure?.factions||[]).map(x=>x.faction||x.name), ...(s.institutions||[]).map(x=>x.name)].filter(Boolean).map(n=>String(n).split('/')[0].trim()));
  const plural=[...names].filter(n=>{const w=n.split(' ').at(-1); return /s$/i.test(w)&&!/(us|ss|is)$/i.test(w);});
  const text=fs.readFileSync(f,'utf8'); let hit=false; let view='';
  for(const line of text.split('\n')){ const m=line.match(/^== (.+?) ==/); if(m){view=m[1];continue;}
    for(const n of plural){ const re=new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+"'s\\b",'i'); if(re.test(line)){ hit=true; const k=`${n}'s @ ${view}`; hits[k]=(hits[k]||0)+1; if(ex.length<15) ex.push(`${seed} [${view}] ${line.slice(0,200)}`);} } }
  if(hit) townsHit++; }
console.log(JSON.stringify({towns,townsHit,hits:Object.entries(hits).sort((a,b)=>b[1]-a[1]).slice(0,40),ex},null,1));
