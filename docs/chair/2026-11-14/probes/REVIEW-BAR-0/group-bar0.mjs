// REVIEW-BAR-0 part C/D: fill the writers the grep probe could not find (the reader's own source file:line, PLAUSIBLE,
// holders computed the same way; a hand trace where named), then group HIGH/MED rows by writer file.
// node group-bar0.mjs <repo> <join-tree> <C-writers.json> <out.json>
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [REPO,TREE,wf,out]=process.argv.slice(2); const LINE='origin/lane/integration-2026-11-07';
const LANES=['r3-code-c-2026-11-13','r3-tabs-2026-11-13','r2-code-a-2026-11-13','r2-code-b-2026-11-13','powers-follow-up-2026-11-13','w2-fix-data-2026-11-13','w2-c-leaves-2026-11-13','coherence-upkeep-2026-11-12','w2-write-2026-11-13','w2-write-side-eco-2026-11-13','w2-write-side-rest-2026-11-13'];
const git=(a)=>{ try{ return execFileSync('git',a,{cwd:REPO,encoding:'utf8',maxBuffer:1<<26}); }catch(e){ return e.stdout||''; } };
const holders=(f)=>LANES.filter(l=>git(['log','--oneline',`${LINE}..origin/lane/${l}`,'--',f]).trim());
const HAND={272:{file:'src/generators/power/rulingStructure.js',line:317,fn:'generatePowerStructure (informalModifier: magic → "mage-advised")',run:'mage-advised',evidence:'hand trace at the joined tree (EXECUTED: read)'}};
const W=JSON.parse(fs.readFileSync(wf,'utf8'));
for(const r of W){ if(r.severity==='LOW') continue;
  if(HAND[r.n]) r.writer={...HAND[r.n]};
  else if(!r.writer){ const m=String(r.source||'').match(/(src\/[\w/.-]+\.(?:js|jsx|mjs|json))(?::(\d+))?/);
    if(m&&fs.existsSync(`${TREE}/${m[1]}`)) r.writer={file:m[1],line:m[2]?+m[2]:0,fn:'',evidence:"the reader's source (file present at the joined tree; PLAUSIBLE)"};
    else r.writer={file:'(not traced)',evidence:'no fixed run found; the reader named no source file'}; }
  if(r.writer.file!=='(not traced)'&&!r.writer.holders) r.writer.holders=holders(r.writer.file);
  if(r.severity==='HIGH'&&!r.writer.standsAtHolderTip) r.writer.standsAtHolderTip=Object.fromEntries((r.writer.holders||[]).map(l=>[l,!!git(['grep','-F','-e',r.writer.run||'',`origin/lane/${l}`,'--',r.writer.file]).trim()]));
}
fs.writeFileSync(out,JSON.stringify(W,null,1));
const hm=W.filter(r=>r.severity!=='LOW'); const g={};
for(const r of hm){ const k=r.writer.file; (g[k]??={file:k,H:0,M:0,towns:new Set(),ex:null,holders:r.writer.holders||[],ev:new Set()}); g[k][r.severity==='HIGH'?'H':'M']++; g[k].towns.add(r.town); g[k].ev.add(r.writer.evidence.startsWith('git grep')?'EXECUTED':r.writer.evidence.startsWith('hand')?'EXECUTED':'PLAUSIBLE'); if(!g[k].ex||r.severity==='HIGH'&&g[k].ex.severity!=='HIGH') g[k].ex=r; }
const rows=Object.values(g).sort((a,b)=>(b.H+b.M)-(a.H+a.M)||b.H-a.H);
let md='| writer (file) | HIGH | MED | towns | holding lanes (own commits since the line) | evidence | example |\n|---|---|---|---|---|---|---|\n';
for(const x of rows) md+=`| \`${x.file}\` | ${x.H} | ${x.M} | ${x.towns.size} | ${x.holders.length?x.holders.join(', '):'no lane'} | ${[...x.ev].join('+')} | ${x.ex.town.replace('bar0-','')} · ${x.ex.tab}: "${x.ex.sentence.slice(0,110).replace(/\|/g,'/')}${x.ex.sentence.length>110?'…':''}" (${x.ex.severity}) |\n`;
fs.writeFileSync(out.replace(/\.json$/,'.md'),md); console.log(md);
