// ROUND-3-CUT step 1: place each of REVIEW-R2-STAGES' 1,433 cold lines on each tree's page, with the reader's own
// placer (merge-cold.mjs, verbatim match rule: >12 chars -> substring of a page line; else whole-line/edge; fallback
// the first 60 chars). node place.mjs <r20 dir> <cold.json> <out.json> <tree,tree,...>
import fs from 'node:fs';
const [R,coldF,out,treesArg]=process.argv.slice(2); const TREES=treesArg.split(',');
const norm=(s)=>String(s).replace(/\s+/g,' ').trim(); const pages={};
const page=(t,seed)=>{ const k=t+'|'+seed; if(!pages[k]) pages[k]=fs.readFileSync(`${R}/${t}/dumps/${seed}.txt`,'utf8').split('\n').filter(l=>l&&!l.startsWith('== ')&&!l.startsWith('[STYLE]')).map(norm); return pages[k]; };
const cold=JSON.parse(fs.readFileSync(coldF,'utf8')); const res=[];
for(const r of cold){ const s=norm(r.sentence); const probe=s.length>12?s:null; const at={};
  for(const t of TREES){ const p=page(t,r.town); let hit=probe?p.some(l=>l.includes(s)):p.some(l=>l===s||l.startsWith(s+' ')||l.endsWith(' '+s)); let q=hit?(probe?'exact':'short-line'):'';
    if(!hit&&probe){ const head=s.slice(0,Math.min(60,s.length)); if(p.some(l=>l.includes(head))){hit=true;q='head';} }
    at[t]=q; }
  res.push({n:r.n,severity:r.severity,town:r.town,readerAt:r.at,at}); }
fs.writeFileSync(out, JSON.stringify(res));
const sev=['HIGH','MED','LOW']; const cnt=(f)=>res.filter(f).length;
for(const t of TREES) console.log(t.padEnd(5), sev.map(v=>v+' '+cnt(r=>r.severity===v&&r.at[t])).join('  '));
