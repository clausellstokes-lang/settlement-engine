import { readFileSync } from 'node:fs';
const R = JSON.parse(readFileSync('report.json','utf8'));
const corpus = JSON.parse(readFileSync('corpus.json','utf8'));
const byReg={}; for (const r of corpus) (byReg[r.register] ||= []).push(r);
const gramsOf=(t)=>{const w=t.toLowerCase().replace(/\{[a-z_0-9]+\}/gi,'{}').replace(/[^a-z0-9{}'\s]/g,' ').split(/\s+/).filter(Boolean);const s=new Set();for(let k=2;k<=4;k++)for(let i=0;i+k<=w.length;i++)s.add(w.slice(i,i+k).join(' '));return s;};
// deterministic sample: 1st, middle, last row that TRIGGERS at least one of the register's tics
for (const [reg,tics] of Object.entries(R.tics)) {
  if (reg==='BIBLE') continue;
  const rows=byReg[reg]||[];
  const T=tics.map(t=>t.gram);
  const hits=rows.map(r=>({r, g:T.filter(g=>gramsOf(r.text).has(g))})).filter(x=>x.g.length);
  const pick=[hits[0], hits[Math.floor(hits.length/2)], hits[hits.length-1]].filter(Boolean);
  console.log('\n===== '+reg+'  (rows '+rows.length+', tic-triggering rows '+hits.length+' = '+(100*hits.length/rows.length).toFixed(1)+'%) =====');
  for (const p of pick) console.log('  ['+p.g.join(' | ')+']\n     '+p.r.text.replace(/\s+/g,' ').slice(0,220));
}
