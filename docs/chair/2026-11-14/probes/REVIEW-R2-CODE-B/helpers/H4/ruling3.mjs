import fs from 'node:fs'; import zlib from 'node:zlib';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const B=await import(T+'domain/density/densityCreateBoundary.js'); await B.loadGenerationLawPayloads();
const P=await import(T+'domain/people/patronage.js');
const lines=zlib.gunzipSync(fs.readFileSync('../../out/births-tip.ndjson.gz')).toString().split('\n').filter(Boolean);
let r3=0,r3out=0,fr=0,frout=0; const ex=[]; const towns=new Set();
for(const l of lines){const {seed,s}=JSON.parse(l); const v=P.dmPowerViewOf(s); if(!v) continue; const byId=new Map((s.npcs||[]).map(n=>[String(n.id),n]));
 const outside=(card)=>{const a=card?.allegiance; const guild=a?.power||a?.house; const h=a?.handler?byId.get(String(a.handler)):null; if(!h) return null; const of=String(h.institution?.key||'')===guild||(h.memberships||[]).some(m=>m?.power===guild); return of?null:h.name;};
 for(const f of v.rulingThree){ if(f.answersTo?.handler){ r3++; const o=outside(byId.get(String(f.id))); if(o){r3out++; towns.add(seed); ex.length<3&&ex.push([seed,f.name,f.answersTo.guild,o]);} } }
 for(const f of v.fronts){ if(f.handler){ fr++; const o=outside(byId.get(String(f.id))); if(o){frout++; towns.add(seed); ex.length<6&&ex.push(['front',seed,f.name,f.guild,o]);} } } }
console.log({r3,r3out,fr,frout,towns:towns.size}); console.log(ex);
