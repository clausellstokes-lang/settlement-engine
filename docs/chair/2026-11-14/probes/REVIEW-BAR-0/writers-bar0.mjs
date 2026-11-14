// REVIEW-BAR-0 part C: one writer per HIGH/MED row of the merged list, at the joined tree, by `git grep -n -F` of a
// fixed run of the sentence (the longest word window, 7 words down to 3, free of digits and of capitalised words
// after the first, found under src/; the window found in the fewest files wins). The function is the nearest
// enclosing definition above the hit (the cut's writers.mjs rule). Then, per writer file, the lanes holding it by
// their own commits since the line, and for HIGH rows whether the run still stands at each holder's CURRENT tip.
// node writers-bar0.mjs <repo> <join-tree> <merged.json> <out.json>
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [REPO,TREE,mf,out]=process.argv.slice(2);
const LINE='origin/lane/integration-2026-11-07';
const LANES=['r3-code-c-2026-11-13','r3-tabs-2026-11-13','r2-code-a-2026-11-13','r2-code-b-2026-11-13','powers-follow-up-2026-11-13','w2-fix-data-2026-11-13','w2-c-leaves-2026-11-13','coherence-upkeep-2026-11-12','w2-write-2026-11-13','w2-write-side-eco-2026-11-13','w2-write-side-rest-2026-11-13'];
const git=(args,cwd=REPO)=>{ try{ return execFileSync('git',args,{cwd,encoding:'utf8',maxBuffer:1<<26}); }catch(e){ return e.stdout||''; } };
const grep=(run,ref)=>git(ref?['grep','-n','-F','-e',run,ref,'--','src']:['grep','-n','-F','-e',run,'--','src'],ref?REPO:TREE).split('\n').filter(Boolean);
const DEF=[/^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/, /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/, /^\s{0,4}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*$/, /^\s{0,4}['"]?([A-Za-z_$][\w$-]*)['"]?\s*:\s*[\[{(]/];
const encl=(L,ln)=>{ for(let i=Math.min(ln,L.length)-1;i>=0;i--){ const l=L[i]; if(/^\s*(\/\/|\*|\/\*)/.test(l)) continue; for(const re of DEF){ const m=l.match(re); if(m&&l.match(/^\s*/)[0].length<=4) return m[1]; } } return ''; };
const id=(f)=>{ const m=f.match(/\b(?:id|key)\s*:\s*['"]([\w.-]+)['"]/); return m?m[1]:''; };
function find(sentence){
  const parts=sentence.replace(/[“”]/g,'"').replace(/[‘’]/g,"'").split(/(?<=[.;:!?·—|])\s+|\s+[·—|]\s+/);
  const cands=[];
  for(const p of parts){ const w=p.split(/\s+/).filter(Boolean);
    for(let n=Math.min(7,w.length);n>=3;n--) for(let i=0;i+n<=w.length;i++){ const win=w.slice(i,i+n);
      if(win.some((x,j)=>/\d/.test(x)||(j>0||i>0)&&/^[A-Z]/.test(x)&&!/^(I|A)$/.test(x))) continue;
      cands.push(win.join(' ').replace(/^[^\w]+|[,.;:!?)]+$/g,'')); } }
  for(const n of [7,6,5,4,3]){ let best=null;
    for(const c of cands.filter(c=>c.split(' ').length===n&&c.length>=14)){ const h=grep(c); if(!h.length) continue; const files=new Set(h.map(x=>x.split(':')[0]));
      if(!best||files.size<best.files.size) best={run:c,hits:h,files}; }
    if(best) return best; }
  return null; }
const M=JSON.parse(fs.readFileSync(mf,'utf8')); const holdCache={}; const res=[];
for(const r of M){ if(r.severity==='LOW') { res.push({...r,writer:null}); continue; }
  const f=find(r.sentence); let w=null;
  if(f){ const [file,ln]=f.hits[0].split(':'); const L=fs.readFileSync(`${TREE}/${file}`,'utf8').split('\n');
    w={file,line:+ln,fn:encl(L,+ln),poolId:id(L[+ln-1]||''),run:f.run,files:[...f.files],evidence:'git grep -n -F at the joined tree'}; }
  if(w){ holdCache[w.file] ??= LANES.filter(l=>git(['log','--oneline',`${LINE}..origin/lane/${l}`,'--',w.file]).trim());
    w.holders=holdCache[w.file];
    if(r.severity==='HIGH') w.standsAtHolderTip=Object.fromEntries(w.holders.map(l=>[l, grep(w.run,`origin/lane/${l}`).length>0])); }
  res.push({...r,writer:w}); }
fs.writeFileSync(out,JSON.stringify(res,null,1));
const hm=res.filter(r=>r.severity!=='LOW'); console.log('HIGH/MED',hm.length,'with a writer',hm.filter(r=>r.writer).length);
