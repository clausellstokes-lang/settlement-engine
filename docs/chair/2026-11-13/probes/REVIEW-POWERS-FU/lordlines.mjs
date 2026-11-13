// lordlines.mjs <base corpus> <tip corpus> <tip dumps>: the structural lines (position/constraint) a lord minted at the tip reads
// on its own card (World/NPCs), by line.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
async function load(f){ const m=new Map(); const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await(const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); m.set(seed,s);} return m; }
const [B,T,D]=process.argv.slice(2); const b=await load(B), t=await load(T);
const SKIP=/^(Wants |Disposition |How they deal|Secret:|Flaw:|Temperament:|Called by|▲|▼)/;
const byLine={}; let lords=0, withLine=0; const ex=[];
for(const [seed,ts] of t){ const bIds=new Set(b.get(seed).npcs.map(p=>p.id)); const news=ts.npcs.filter(p=>!bIds.has(p.id)); if(!news.length) continue;
  const lines=fs.readFileSync(`${D}/${seed}.txt`,'utf8').split('\n'); const s0=lines.indexOf('== World/NPCs =='); const s1=lines.findIndex((l,i)=>i>s0&&/^== /.test(l));
  const v=lines.slice(s0+1,s1);
  for(const p of news){ lords++; const i=v.findIndex(l=>l.startsWith(p.name)&&/●+$/.test(l)); if(i<0) continue; const own=[];
    for(let j=i+1;j<v.length&&!/●+$/.test(v[j]);j++){ const l=v[j]; if(/^(Holds|Belongs|Runs|Leads|Heads|Serves|Works|Constraint:)/.test(l)) own.push(l); }
    if(own.length){ withLine++; for(const l of own){ const k=l.slice(0,90); byLine[k]=(byLine[k]||0)+1; } if(ex.length<6) ex.push(`${seed} ${p.name} (${(p.memberships||[]).map(m=>m.power).join('+')}): ${own.join(' / ')}`); } } }
console.log(JSON.stringify({lordsMintedAtTip:lords, lordsWithAStructuralLine:withLine, byLine:Object.entries(byLine).sort((a,b)=>b[1]-a[1]), ex},null,1));
