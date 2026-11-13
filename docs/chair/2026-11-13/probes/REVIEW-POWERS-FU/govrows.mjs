// govrows.mjs <base corpus> <tip corpus>: relationship rows dealt from the 'government' pair pools (npcData.js gov_*) where a
// card the TIP minted (absent at base) stands on the GOVERNMENT side (npc1 for the pools' (r, s) = (government, other)).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
async function load(f){ const m=new Map(); const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity}); for await(const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); m.set(seed,s);} return m; }
const [B,T]=process.argv.slice(2); const b=await load(B), t=await load(T);
const out={rowsByKey:{}, lordGovSide:0, lordOtherSide:0, towns:new Set(), ex:[], baseClaimantGovSide:0};
for(const [seed,ts] of t){ const bs=b.get(seed); const bIds=new Set(bs.npcs.map(p=>p.id)); const lords=new Set(ts.npcs.filter(p=>!bIds.has(p.id)).map(p=>p.id));
  const baseMinted=new Set(bs.npcs.filter(p=>p.institution?.kind==='power'&&p.title==='the lord').map(p=>p.id));
  for(const r of ts.relationships||[]){ const k=r.archetypeKey||''; if(!/^gov_/.test(r.relKey||r.key||'')&&!/Financial Dependence|Political Obligation|Patronage|Appointment/i.test(r.typeName||'')) {}
    const lordFrom=lords.has(r.from), lordTo=lords.has(r.to); if(!lordFrom&&!lordTo) continue;
    out.rowsByKey[r.typeName]=(out.rowsByKey[r.typeName]||0)+1; }
  for(const r of bs.relationships||[]) if(baseMinted.has(r.from)&&r.typeName==='Financial Dependence') out.baseClaimantGovSide++;
  for(const r of ts.relationships||[]){ if(r.typeName!=='Financial Dependence') continue; if(lords.has(r.from)){ out.lordGovSide++; out.towns.add(seed); if(out.ex.length<6) out.ex.push(`${seed}: ${r.npc1Name} (${r.npc1Role}) ← ${r.npc2Name} (${r.npc2Role}): ${r.description}`);} else if(lords.has(r.to)) out.lordOtherSide++; }
}
out.towns=out.towns.size; console.log(JSON.stringify(out,null,1));
