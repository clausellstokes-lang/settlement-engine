// C item 3: towns where the Medical Readiness row said "Clerical care" at the base and not at the tip; their faith houses and people.
import fs from 'node:fs'; import zlib from 'node:zlib';
const [BT,TT,bg,tg]=process.argv.slice(2); const rd=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const o=JSON.parse(l); m.set(o.seed,o.s);} return m; };
const b=await import(BT+'/src/domain/display/defenseDisplay.js'), t=await import(TT+'/src/domain/display/defenseDisplay.js');
const B=rd(bg), T=rd(tg); const med=(m,s)=>{ try{ return (m.deriveSupportingCapabilities(s)||[]).find(r=>r.label==='Medical Readiness'); }catch(e){ return {note:'ERR '+e.message}; } };
let n=0; const cls={}; const rows=[];
for(const [k,s] of B){ const mb=med(b,s), mt=med(t,T.get(k)); if(!/Clerical care/.test(mb?.note||'')||/Clerical care/.test(mt?.note||'')) continue; n++;
  const faith=(s.institutions||[]).filter(i=>/church|temple|shrine|chapel|cathedral|monaster|abbey|priory|worship|clergy|friary|parish/i.test(i.name)).map(i=>i.name);
  const clerics=(s.npcs||[]).filter(p=>/priest|cleric|abbot|abbess|monk|nun|bishop|vicar|chaplain|friar|dean|curate|deacon|prior/i.test(`${p.role} ${p.title||''}`)).map(p=>p.role);
  const key=(faith.length?'faith houses: '+[...new Set(faith.map(x=>x.replace(/\s*\(.*\)/,'')))].join('/'):'no faith house')+(clerics.length?' | clerics: '+[...new Set(clerics)].join('/'):''); cls[key]=(cls[key]||0)+1; rows.push([k,s.tier,key,mt?.status]); }
console.log('Clerical care removed in',n,'towns');
for(const [k,v] of Object.entries(cls).sort((a,b)=>b[1]-a[1])) console.log(v,k.slice(0,200));
