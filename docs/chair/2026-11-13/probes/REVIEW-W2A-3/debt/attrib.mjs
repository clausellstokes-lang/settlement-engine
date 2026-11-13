// node attrib.mjs <tree> : attribute each HIGH/MED cold line to its source file by its longest fixed runs
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const TREE=process.argv[2]; const cold=JSON.parse(fs.readFileSync('/home/user/settlement-engine/docs/chair/2026-11-13/REVIEW-W2A-3-COLD-LIST.json','utf8')).lines;
const rows=cold.filter(x=>x.severity==='HIGH'||x.severity==='MED');
const recs={}; const rec=(id)=>recs[id]??=JSON.parse(fs.readFileSync(`/home/user/wt/r-tip/records/${id}.json`,'utf8'));
const esc=(s)=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
function runs(x){ const r=rec(x.town.id); const names=[r.name,...(r.npcs||[]).map(n=>n.name),...(r.npcs||[]).flatMap(n=>String(n.name||'').split(' ')),...(r.powerStructure?.factions||[]).map(f=>f.faction||f.name),...(r.institutions||[]).map(i=>i.name)].filter(s=>s&&s.length>2).sort((a,b)=>b.length-a.length);
  let s=x.sentence; for(const n of names) s=s.split(n).join('\u0001'); s=s.replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/gi,'\u0001').replace(/[\d,]+/g,'\u0001');
  return s.split('\u0001').map(t=>t.trim()).filter(t=>t.length>=14).sort((a,b)=>b.length-a.length); }
function grep(t){ try{ return execFileSync('git',['-C',TREE,'grep','-l','-F','-i',t,'--','src','docs/content'],{encoding:'utf8',maxBuffer:1e7}).trim().split('\n').filter(Boolean);}catch{return [];} }
const out=[];
for(const x of rows){ const R=runs(x); let hit=[],run='';
  for(const t of R.slice(0,4)){ let tt=t; let h=grep(tt); while(!h.length&&tt.length>24){ tt=tt.slice(0,Math.floor(tt.length*0.7)); h=grep(tt);} if(h.length){hit=h;run=tt;break;} }
  const files=hit.filter(f=>!/\.test\.|\/tests?\//.test(f));
  const pick=files.find(f=>/dossierStateProse\/.*generated|RECEIPT_POOLS/.test(f))||files.find(f=>/^src\/data\//.test(f))||files[0]||'';
  const owner=!pick?'unattributed':/dossierStateProse\/|RECEIPT_POOLS|\.generated\.js$/.test(pick)?'corpus':/institutionalCatalog|institutionDescColour|institutionDescVariants|institutionDisplayName/.test(pick)?'catalogue':/^src\/data\//.test(pick)?'data':'code';
  out.push({n:x.n,town:x.town.id,tab:x.tabs[0],severity:x.severity,mechanism:x.mechanism,sentence:x.sentence,fact:x.fact,owner,file:pick,run,allFiles:files.slice(0,6)}); }
fs.writeFileSync('/home/user/wt/debt/attrib.json',JSON.stringify(out,null,1));
const c={}; for(const o of out){ const k=o.owner+'/'+o.severity; c[k]=(c[k]||0)+1;} console.log(rows.length,c);
const f={}; for(const o of out){ f[o.file||'-']=(f[o.file||'-']||0)+1;} console.log(Object.entries(f).sort((a,b)=>b[1]-a[1]).slice(0,30).map(([k,v])=>v+'\t'+k).join('\n'));
