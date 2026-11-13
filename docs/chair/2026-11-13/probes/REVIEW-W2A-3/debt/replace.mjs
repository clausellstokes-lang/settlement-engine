// node replace.mjs <HIGH|MEDSAMPLE> : for each line gone from a lane page, the same tab's added lines at that lane
import fs from 'node:fs';
const A=JSON.parse(fs.readFileSync('/home/user/wt/debt/lanes.json','utf8'));
const mode=process.argv[2];
const tabOf=(txt,tab)=>{ const L=txt.split('\n'); const i=L.indexOf('== '+tab+' =='); if(i<0) return []; const o=[]; for(let j=i+1;j<L.length&&!L[j].startsWith('== ');j++) o.push(L[j]); return o; };
let pick=A.filter(x=>x.severity==='HIGH');
if(mode==='MEDSAMPLE'){ const m=A.filter(x=>x.severity==='MED'&&Object.values(x.lanes).some(l=>!l.prints&&!l.town.startsWith('RE-DEALT'))); const step=Math.max(1,Math.floor(m.length/30)); pick=m.filter((_,i)=>i%step===0).slice(0,30); }
const rows=[];
for(const x of pick){ for(const [k,l] of Object.entries(x.lanes)){ if(l.prints||l.town.startsWith('RE-DEALT')) continue;
  const a=tabOf(fs.readFileSync(`/home/user/wt/r-tip/dumps/${x.town}.txt`,'utf8'),x.tab), b=tabOf(fs.readFileSync(`/home/user/wt/r-${k}/dumps/${x.town}.txt`,'utf8'),x.tab);
  const A2=new Set(a), B2=new Set(b); const added=b.filter(s=>!A2.has(s)); const removed=a.filter(s=>!B2.has(s));
  // the most similar added line (word overlap) to the removed sentence
  const w=(s)=>new Set(s.toLowerCase().match(/[a-z]{4,}/g)||[]); const ws=w(x.sentence); let best='',bs=0; for(const s of added){ const o=[...w(s)].filter(t=>ws.has(t)).length; if(o>bs){bs=o;best=s;} }
  rows.push({n:x.n,lane:k,town:x.town,tab:x.tab,severity:x.severity,sentence:x.sentence,fact:x.fact,file:x.file,inPlace:best,removedCount:removed.length,addedCount:added.length}); } }
fs.writeFileSync(`/home/user/wt/debt/replace-${mode}.json`,JSON.stringify(rows,null,1));
for(const r of rows) console.log(`#${r.n} [${r.lane}] ${r.town.replace('rw3-','')} | ${r.tab}\n  WAS: ${r.sentence.slice(0,170)}\n  FACT: ${r.fact.slice(0,150)}\n  NOW: ${(r.inPlace||'(nothing similar added; '+r.addedCount+' lines added in tab)').slice(0,230)}`);
