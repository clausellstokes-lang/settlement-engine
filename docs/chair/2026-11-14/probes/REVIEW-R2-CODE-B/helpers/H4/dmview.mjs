import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src/';
const B=await import(T+'domain/density/densityCreateBoundary.js'); if (B.loadGenerationLawPayloads) await B.loadGenerationLawPayloads();
const P=await import(T+'domain/people/patronage.js'); const L=await import(T+'domain/display/institutionDisplayName.js');
const carriesTitle = (name, title) => new RegExp(`(^|[^\\p{L}])${title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}($|[^\\p{L}])`, 'iu').test(String(name || ''));
const titleAfter = (face) => (face?.title && !carriesTitle(face.name, String(face.title)) ? `, ${face.title}` : '');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const sup={}; let towns=0; const out=fs.createWriteStream('dmview.tsv'); const houseLab={}; const mism=new Set(); let mismLines=0;
for await (const line of rl){ const {seed,s}=JSON.parse(line); const v=P.dmPowerViewOf(s); if(!v) continue; towns++;
 const faces=[...v.rulingThree.map(f=>['ruler',f]), ...v.answers.flatMap(g=>[...(g.boss?[['boss',g.boss]]:[]), ...g.handlers.flatMap(h=>[['handler',h],...h.agents.map(a=>['agent',a])])])];
 for(const [k,f] of faces){ if(f.title && carriesTitle(f.name,String(f.title))){ const key=`${k}|${f.name}|${f.title}`; (sup[key]=sup[key]||[]).push(seed);} }
 for(const [k,f] of faces) if(f.house){ const lab=L.institutionHouseLabel(f.house); const kk=`${f.house} => ${lab}`; houseLab[kk]=(houseLab[kk]||0)+1; }
 for(const f of v.fronts){ const lab=L.institutionHouseLabel(f.house); const kk=`FRONT ${f.house} => ${lab}`; houseLab[kk]=(houseLab[kk]||0)+1; }
 // handler not of house
 const byId=new Map((s.npcs||[]).map(n=>[String(n.id),n]));
 for (const g of v.answers) for (const h of g.handlers){ const hc=byId.get(String(h.id)); if(!hc) continue; for(const a of h.agents){ const ac=byId.get(String(a.id)); const al=ac?.allegiance; const guild=al?.power||al?.house; const of=String(hc.institution?.key||'')===guild || (hc.memberships||[]).some(m=>m?.power===guild); if(!of){ mism.add(seed); mismLines++; out.write([seed,s.tier,g.guild,h.name,hc.institution?.key||'',a.name].join('\t')+'\n'); } } }
}
out.end(); console.log('towns',towns,'handler-outside-house panel rows',mismLines,'towns',mism.size);
console.log('suppressed titles', Object.keys(sup).length); for(const [k,v] of Object.entries(sup).slice(0,25)) console.log(v.length,k,v[0]);
const hl=Object.entries(houseLab).sort((a,b)=>b[1]-a[1]); console.log('house labels distinct',hl.length); for(const [k,v] of hl.filter(([k])=>/=>.*[()]|undefined|_/.test(k)).concat(hl.filter(([k])=>{const [a,b]=k.replace('FRONT ','').split(' => ');return a!==b;}).slice(0,0))) console.log(v,k);
