// instigator.mjs <base corpus> <tip corpus>: the crisis cast's instigator, base vs tip; where the tip's is a lord the tip minted,
// its influence/power against the seat's keeper (the governing power's first).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
async function load(f){ const m=new Map(); const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await(const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); m.set(seed,s);} return m; }
const [B,T]=process.argv.slice(2); const b=await load(B), t=await load(T);
const casts=(s)=>[...(Array.isArray(s.stress)?s.stress:[s.stress]).filter(Boolean).map(x=>x.cast).filter(Boolean)];
const inst=(s)=>casts(s).flatMap(c=>(c.roles||[]).filter(r=>r.role==='instigator').map(r=>({id:r.id,name:r.name,reason:r.reason})));
const ord={low:0,moderate:1,high:2};
let changed=0,toLord=0,lordWeaker=0; const ex=[];
for(const [seed,ts] of t){ const bs=b.get(seed); const bi=JSON.stringify(inst(bs).map(x=>x.id)), ti=JSON.stringify(inst(ts).map(x=>x.id)); if(bi===ti) continue; changed++;
  const bIds=new Set(bs.npcs.map(p=>p.id));
  const gov=(ts.powerStructure.factions||[]).find(f=>f.isGoverning); const keeper=gov&&ts.npcs.find(c=>(c.memberships||[]).some(m=>m.power===(gov.faction||gov.name)&&m.rank===1));
  for(const r of inst(ts)){ if(bIds.has(r.id)) continue; toLord++; const p=ts.npcs.find(x=>x.id===r.id);
    const weaker = keeper && (ord[p.influence]<ord[keeper.influence] || (p.power||0)<(keeper.power||0));
    if(/more weight than whoever holds the seat/.test(r.reason)&&weaker){ lordWeaker++; if(ex.length<8) ex.push(`${seed}: ${p.name} (${p.influence} ${p.power}) vs ${keeper.name} (${keeper.influence} ${keeper.power}) — "${r.reason}"`); } }
}
console.log(JSON.stringify({instigatorChanged:changed, toNewLord:toLord, newLordWeakerThanSeatFirstUnderMoreWeight:lordWeaker, ex},null,1));
