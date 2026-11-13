// ROUND-3-CUT step 5: the same fault in round two's list (REVIEW-W2A-3 debt final.json, 481 lines): the same writer's
// file and the same mechanism, AND the same words (round two's fixed run found in this sentence, or a word overlap
// (Jaccard on words of 4+ letters, names folded) of at least 0.4). node join.mjs <cold.json> <writers.json> <final.json>
import fs from 'node:fs';
const C=Object.fromEntries(JSON.parse(fs.readFileSync(process.argv[2],'utf8')).map(r=>[r.n,r])); const W=JSON.parse(fs.readFileSync(process.argv[3],'utf8')); const F=JSON.parse(fs.readFileSync(process.argv[4],'utf8'));
const words=(s)=>new Set(String(s).toLowerCase().replace(/\([^)]*\)/g,' ').match(/[a-z]{4,}/g)||[]);
const jac=(a,b)=>{ const i=[...a].filter(x=>b.has(x)).length; return i/Math.max(1,a.size+b.size-i); };
const FW=F.map(f=>({f,w:words(f.sentence),files:new Set([f.file,...(f.allFiles||[])].filter(Boolean))}));
let m=0; for(const x of W){ const r=C[x.n]; const w=words(r.sentence); const file=x.writer?.file; const wordsFiles=Object.keys(x.wordsHolders||{});
  let best=null,bs=0; for(const g of FW){ if(g.f.mechanism!==r.mechanism) continue; const sameFile=g.files.has(file)||wordsFiles.some(f=>g.files.has(f)); const runHit=g.f.run&&r.sentence.toLowerCase().includes(g.f.run.toLowerCase()); const j=jac(w,g.w);
    const score=runHit?1+j:(sameFile&&j>=0.4?j:(j>=0.75?j:0)); if(score>bs){bs=score;best=g.f;} }
  x.round2=best?{n:best.n,owner:best.owner,status:best.status,curedOn:best.curedOn||null,file:best.file,score:+bs.toFixed(2),sentence:best.sentence.slice(0,120)}:null; if(best) m++; }
fs.writeFileSync(process.argv[3],JSON.stringify(W,null,1));
const hm=(f)=>['HIGH','MED'].map(s=>s+' '+W.filter(x=>x.severity===s&&f(x)).length).join(' ');
console.log('matched',hm(x=>x.round2)); const st={}; for(const x of W) if(x.round2){ st[x.round2.status]=(st[x.round2.status]||0)+1; } console.log(st);
console.log('distinct round-two lines matched', new Set(W.filter(x=>x.round2).map(x=>x.round2.n)).size);
for(const x of W.filter(x=>x.round2).filter((_,i)=>i%40===0)) console.log(' #'+x.n,'~ r2#'+x.round2.n,x.round2.score,'|',C[x.n].sentence.slice(0,60),'||',x.round2.sentence.slice(0,60));
