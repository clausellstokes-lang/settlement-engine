import { readFileSync } from 'node:fs';
const corpus = JSON.parse(readFileSync('corpus.json','utf8'));
const R6 = corpus.filter(r=>r.register==='R6');
const gramsOf=(t)=>{const w=t.toLowerCase().replace(/\{[a-z_0-9]+\}/gi,'{}').replace(/[^a-z0-9{}'\s]/g,' ').split(/\s+/).filter(Boolean);const s=new Set();for(let k=2;k<=4;k++)for(let i=0;i+k<=w.length;i++)s.add(w.slice(i,i+k).join(' '));return s;};
for (const g of ['is out the','destroyed but']) {
  const rows=R6.filter(r=>gramsOf(r.text).has(g));
  console.log('=== gram "'+g+'"  rows:'+rows.length+'  literal-in-text:'+rows.filter(r=>new RegExp(g,'i').test(r.text)).length);
  const ctxs={};
  for (const r of rows) { const m=r.text.match(new RegExp('.{0,14}'+g.split(' ')[0]+'\\W{0,3}'+g.split(' ')[1]+'.{0,14}','i')); const k=m?m[0]:'(SPANS punctuation - not contiguous)'; ctxs[k]=(ctxs[k]||0)+1; }
  Object.entries(ctxs).sort((a,b)=>b[1]-a[1]).slice(0,8).forEach(([k,v])=>console.log('   '+String(v).padStart(4)+'  ...'+k+'...'));
}
