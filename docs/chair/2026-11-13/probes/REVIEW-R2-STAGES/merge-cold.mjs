// REVIEW-R2-STAGES: merge the readers' files into one cold list and place each sentence on the five pages.
// node merge-cold.mjs <cold dir> <r20 dir> <out.json>
import fs from 'node:fs';
const [dir,R,out]=process.argv.slice(2);
const TREES=['a-tip','ab-base','b-tip','c-tip','c-base'];
const pages={}; const norm=(s)=>String(s).replace(/\s+/g,' ').trim();
const page=(t,seed)=>{ const k=t+'|'+seed; if(!pages[k]) pages[k]=fs.readFileSync(`${R}/${t}/dumps/${seed}.txt`,'utf8').split('\n').filter(l=>l&&!l.startsWith('== ')&&!l.startsWith('[STYLE]')).map(norm); return pages[k]; };
const rows=[]; for(const f of fs.readdirSync(dir).filter(f=>/^reader-\d+\.json$/.test(f)).sort((a,b)=>parseInt(a.slice(7))-parseInt(b.slice(7)))){
  let arr=[]; try{ arr=JSON.parse(fs.readFileSync(`${dir}/${f}`,'utf8')); }catch(e){ console.error('BAD',f,e.message); continue; }
  for(const r of arr) rows.push({reader:f.replace(/\.json$/,''),...r}); }
let n=0; const res=[];
for(const r of rows){
  const s=norm(r.sentence); const probe=s.length>12?s:null; const at={};
  for(const t of TREES){ const p=page(t,r.town); let hit=probe?p.some(l=>l.includes(s)):p.some(l=>l===s||l.startsWith(s+' ')||l.endsWith(' '+s)); let q=hit?(probe?'exact':'short-line'):'';
    if(!hit&&probe){ const head=s.slice(0,Math.min(60,s.length)); if(p.some(l=>l.includes(head))){hit=true;q='head';} }
    at[t]=hit?q:''; }
  const on=(t)=>!!at[t];
  const stage=[]; if(on('a-tip')&&!on('ab-base')) stage.push('A'); if(on('b-tip')&&!on('ab-base')) stage.push('B'); if(on('c-tip')&&!on('c-base')) stage.push('C');
  const gone=[]; if(!on('a-tip')&&on('ab-base')) gone.push('A'); if(!on('b-tip')&&on('ab-base')) gone.push('B'); if(!on('c-tip')&&on('c-base')) gone.push('C');
  res.push({n:++n,...r,at,newAtTip:stage,goneAtTip:gone});
}
fs.writeFileSync(out, JSON.stringify(res,null,1));
const cnt=(f)=>res.filter(f).length; const sev=['HIGH','MED','LOW'];
console.log('rows',res.length,'unplaced',cnt(r=>!Object.values(r.at).some(Boolean)));
for(const t of TREES) console.log(t, sev.map(v=>v+' '+cnt(r=>r.severity===v&&r.at[t])).join(' '));
for(const st of ['A','B','C']) console.log('new at '+st+' tip', sev.map(v=>v+' '+cnt(r=>r.severity===v&&r.newAtTip.includes(st))).join(' '), '| gone at tip', sev.map(v=>v+' '+cnt(r=>r.severity===v&&r.goneAtTip.includes(st))).join(' '));
