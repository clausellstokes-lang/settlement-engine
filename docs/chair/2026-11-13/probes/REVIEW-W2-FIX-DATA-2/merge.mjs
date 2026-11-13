// REVIEW-W2-FIX-DATA-2: merge the six readers' rows into the cold list. Each sentence is checked verbatim in the tip
// dump and looked up in the 4114cf5a6 dump of the same town (same seed, same config): newAtTip = printed at the tip
// and not at 4114cf5a6.   S=<scratch> node merge.mjs <out.json>
import fs from 'node:fs';
const S=process.env.S; const all=[];
for(let n=1;n<=6;n++){ for(const x of JSON.parse(fs.readFileSync(`${S}/cold/reader-${n}.json`,'utf8'))) all.push({...x,reader:n}); }
const tip={}, prev={}; const rd=(m,dir,t)=>m[t]??=fs.readFileSync(`${S}/${dir}/dumps/${t}.txt`,'utf8');
const g=new Map();
for(const x of all){ const k=x.town+'||'+x.sentence; if(!g.has(k)) g.set(k,{...x,tabs:[x.tab]}); else { const y=g.get(k); if(!y.tabs.includes(x.tab)) y.tabs.push(x.tab);} }
const lines=[...g.values()].map((x,i)=>{ const {tab,...r}=x; r.n=i+1; r.verbatimAtTip=rd(tip,'r-tip',x.town).includes(x.sentence); r.atPrev=rd(prev,'r-prev',x.town).includes(x.sentence); r.newAtTip=r.verbatimAtTip&&!r.atPrev; return r; });
const count={total:lines.length}; for(const l of lines){ count[l.severity]=(count[l.severity]||0)+1; }
count.notVerbatim=lines.filter(l=>!l.verbatimAtTip).length; count.newAtTip=lines.filter(l=>l.newAtTip).length;
fs.writeFileSync(process.argv[2], JSON.stringify({_doc:'REVIEW-W2-FIX-DATA-2 cold list: twenty fresh towns (rf2-*), app configuration shape (selectedStresses, selectedStressesRandom:false), born and rendered at 34520a697 and at 4114cf5a6; read cold by six readers at the tip before any claim of the lane was read. newAtTip: printed at the tip and not at 4114cf5a6.', tip:'34520a697', prev:'4114cf5a6', count, lines},null,1));
console.log(JSON.stringify(count));
