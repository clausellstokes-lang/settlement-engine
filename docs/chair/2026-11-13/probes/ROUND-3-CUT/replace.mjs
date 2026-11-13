// ROUND-3-CUT step 2: for every (line, lane) where the line prints at the line's tip and the lane removes it (prints at
// the lane's merge base, gone at its tip), the same tab at the lane's base and tip: lines removed, lines added, and the
// added line most like the gone sentence. node replace.mjs <r20> <matrix.json> <cold.json> <out.json>
import fs from 'node:fs';
const [R,mf,cf,out]=process.argv.slice(2); const M=JSON.parse(fs.readFileSync(mf,'utf8')); const C=Object.fromEntries(JSON.parse(fs.readFileSync(cf,'utf8')).map(r=>[r.n,r]));
const MB={wa:'mb-wa',wc:'mb-agree',ra:'base',rb:'base',up:'mb-agree',pw:'base',wr:'mb-old',fd:'mb-old',bd:'mb-old',vl:'base'};
const tabOf=(t,seed,tab)=>{ const L=fs.readFileSync(`${R}/${t}/dumps/${seed}.txt`,'utf8').split('\n'); const i=L.indexOf('== '+tab+' =='); if(i<0) return []; const o=[]; for(let j=i+1;j<L.length&&!L[j].startsWith('== ');j++) if(L[j]&&!L[j].startsWith('[STYLE]')) o.push(L[j].replace(/\s+/g,' ').trim()); return o; };
const w=(s)=>new Set(s.toLowerCase().match(/[a-z]{4,}/g)||[]);
const rows=[]; for(const m of M){ if(!m.atLine) continue; for(const [k,s] of Object.entries(m.lane)){ if(s!=='REMOVED') continue; const c=C[m.n];
  const a=tabOf(MB[k],c.town,c.tab), b=tabOf(k,c.town,c.tab); const A=new Set(a),B=new Set(b); const added=[...new Set(b.filter(x=>!A.has(x)))], removed=[...new Set(a.filter(x=>!B.has(x)))];
  const ws=w(c.sentence); let best='',bs=0; for(const x of added){ const o=[...w(x)].filter(t=>ws.has(t)).length; if(o>bs){bs=o;best=x;} }
  rows.push({n:m.n,lane:k,severity:c.severity,town:c.town,tab:c.tab,sentence:c.sentence,fact:c.fact,mechanism:c.mechanism,removed,added,best,bestOverlap:bs}); } }
fs.writeFileSync(out,JSON.stringify(rows,null,1));
const c=(f)=>['HIGH','MED'].map(s=>s+' '+rows.filter(r=>r.severity===s&&f(r)).length).join(' ');
console.log('pairs',c(()=>true)); console.log('no line added in the tab (NOTHING by script):',c(r=>r.added.length===0)); console.log('lines added, best overlap 0:',c(r=>r.added.length&&!r.bestOverlap)); console.log('lines added, some overlap:',c(r=>r.bestOverlap>0));
for(const k of Object.keys(MB)) { const x=rows.filter(r=>r.lane===k); if(x.length) console.log(k, 'pairs',x.length,'nothing-added',x.filter(r=>!r.added.length).length); }
