import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.TREE; const { NPC_FACTION_LOYALTY } = await import(T+'/src/data/npcData.js');
const POOL=process.argv[3]||'religious'; const any=new RegExp(process.argv[4]||'^$');
const txt=(l)=>typeof l==='string'?l:l.text; const R=new Set(NPC_FACTION_LOYALTY[POOL].map(txt));
let prints=0, towns=new Set(), byCat={}, byStress={}, ex=[];
for(const l of zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().split('\n')){ if(!l) continue; const {seed,s}=JSON.parse(l);
  const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+')||'calm';
  for(const n of s.npcs||[]) for(const h of n.plotHooks||[]) if(R.has(h)&&n.category!==POOL&&!any.test(h)){ prints++; towns.add(seed); byCat[n.category]=(byCat[n.category]||0)+1; byStress[st]=(byStress[st]||0)+1; if(ex.length<400) ex.push([seed,n.name,n.role,n.category,h.slice(0,70)].join(' | ')); } }
console.log('prints',prints,'towns',towns.size,JSON.stringify(byCat),JSON.stringify(byStress)); fs.writeFileSync(process.env.EX||'/dev/null',ex.join('\n'));
