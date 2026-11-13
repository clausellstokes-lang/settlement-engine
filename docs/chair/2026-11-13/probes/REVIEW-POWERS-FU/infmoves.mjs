// infmoves.mjs <base corpus> <tip corpus>: every existing card whose influence moved, with what it is.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
async function load(f){ const m=new Map(); const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await(const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); m.set(seed,s);} return m; }
const [B,T]=process.argv.slice(2); const b=await load(B), t=await load(T); const cls={};
for(const [seed,ts] of t){ const bm=new Map(b.get(seed).npcs.map(p=>[p.id,p])); for(const p of ts.npcs){ const q=bm.get(p.id); if(!q||q.influence===p.influence) continue;
  const first=(p.memberships||[]).filter(m=>m.rank===1).map(m=>{const f=ts.powerStructure.factions.find(x=>(x.faction||x.name)===m.power); return `${m.power}[${f?.category}${f?.isGoverning?',gov':''}]`;}).join('+');
  const k=`${p.institution?.kind==='power'?'minted '+p.title:p.title} ${q.influence}->${p.influence} first:${first}`; cls[k]=(cls[k]||0)+1; } }
console.log(Object.entries(cls).sort((a,b)=>b[1]-a[1]).map(([k,v])=>v+'  '+k).join('\n'));
