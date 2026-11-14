import fs from 'node:fs'; import zlib from 'node:zlib';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const C=await import(T+'domain/people/cardPowers.js'); const L=await import(T+'domain/display/institutionDisplayName.js');
const lines=zlib.gunzipSync(fs.readFileSync('../../out/births-tip.ndjson.gz')).toString().split('\n').filter(Boolean);
const t={}; let n=0; const towns=new Set(); const notHeld={};
for(const l of lines){const {seed,s}=JSON.parse(l); const names=new Set((s.institutions||[]).map(i=>i.name));
 for(const npc of s.npcs||[]){ const h=C.cardHouseOf(npc); if(!h) continue; n++; towns.add(seed); const lab=L.institutionHouseLabel(h);
  if(/[()]|\d|undefined|_/.test(lab)) t[`${h} => ${lab}`]=(t[`${h} => ${lab}`]||0)+1;
  if(!names.has(typeof h==='string'?h:h?.name)) notHeld[String(typeof h==='string'?h:JSON.stringify(h))]=(notHeld[String(h)]||0)+1; } }
console.log('cards',n,'towns',towns.size); console.log(Object.entries(t).sort((a,b)=>b[1]-a[1]).slice(0,30)); console.log('house not on roster', Object.entries(notHeld).slice(0,15));
