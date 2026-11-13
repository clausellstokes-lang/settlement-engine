// ROUND-3-CUT step 3, second pass: (a) a corpus line -> its generated pool (file, pool key, combination key, vid);
// (b) code -> the nearest TOP-LEVEL definition (indent 0, never a keyword); data -> the nearest top-level const and
// its first-level key; (c) the four lines traced by hand. node writers-fix.mjs <tree> <writers.json>
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [TREE,wf]=process.argv.slice(2); const W=JSON.parse(fs.readFileSync(wf,'utf8'));
const cache={}; const L=(f)=>cache[f]??=fs.readFileSync(`${TREE}/${f}`,'utf8').split('\n');
const KW=new Set(['if','for','while','switch','return','catch','else','do','try','x','at','pick']);
function topDef(f,ln){ const A=L(f); for(let i=Math.min(ln,A.length)-1;i>=0;i--){ const l=A[i]; let m=l.match(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/)||l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/)||l.match(/^\s{2}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*$/); if(m&&!KW.has(m[1])) return m[1]; } return ''; }
function dataKey(f,ln){ const A=L(f); let key=''; for(let i=Math.min(ln,A.length)-1;i>=0;i--){ const l=A[i]; const k=!key&&l.match(/^\s{2}['"]?([\w$ -]+?)['"]?\s*:\s*[\[{(]/); if(k) key=k[1]; const m=l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/); if(m) return key?`${m[1]}.${key}`:m[1]; } return key; }
function pool(run){ let out=''; try{ out=execFileSync('git',['-C',TREE,'grep','-n','-F','-i',run,'--','src/data/dossierStateProse'],{encoding:'utf8',maxBuffer:5e7}); }catch{} const h=out.split('\n').find(Boolean); if(!h) return null; const [f,ln]=h.split(':'); const A=L(f); let comb='',pk='',vid=''; for(let i=+ln;i<Math.min(+ln+12,A.length);i++){ const v=A[i].match(/"vid":\s*(\d+)/); if(v){vid=v[1];break;} }
  const ti=A[+ln-1].match(/^\s*/)[0].length; for(let i=+ln-1;i>=0;i--){ const m=A[i].match(/^(\s*)"([^"]+)":\s*[\[{]\s*$/); if(!m) continue; const d=m[1].length; if(!comb&&d===ti-4) comb=m[2]; else if(d===2){ pk=m[2]; break; } } return {file:f,line:+ln,fn:`${pk} › ${comb} · v${vid}`}; }
const HAND={145:{file:'src/generators/economy/economicState.js',fn:'generateEconomicState',line:463,evidence:'traced by hand at the line tip'},
  488:{file:'src/components/new/tabs/HistoryTab.jsx',fn:'HistoryTab (the founding row: founding.reason)',line:283,words:'src/data/narrativeData.js TERRAIN_NARRATIVE_HOOKS',evidence:'traced by hand at the line tip'}};
HAND[594]=HAND[488]; HAND[845]=HAND[488];
let fixed=0; for(const x of W){ if(HAND[x.n]){ x.writer=HAND[x.n]; fixed++; continue; } const w=x.writer; if(!w) continue;
  if(/^docs\/content\/RECEIPT_POOLS/.test(w.file)&&w.run){ const p=pool(w.run); if(p){ x.writer={...w,file:p.file,line:p.line,fn:p.fn,source:'docs/content/'+w.file.split('/').pop()}; fixed++; } continue; }
  if(/dossierStateProse\/.*generated/.test(w.file)&&w.run){ const p=pool(w.run); if(p){ x.writer={...w,fn:p.fn}; fixed++; } continue; }
  if(!w.line||!/^src\//.test(w.file)) continue;
  const nf=/^src\/data\//.test(w.file)?dataKey(w.file,w.line):topDef(w.file,w.line); if(nf&&nf!==w.fn){ w.fn=nf; fixed++; } }
fs.writeFileSync(wf,JSON.stringify(W,null,1));
const f={}; for(const x of W){ const k=x.writer?.fn||'(none)'; f[k]=(f[k]||0)+1;} console.log('fixed',fixed,'distinct fns',Object.keys(f).length,'none',f['(none)']||0);
const files={}; for(const x of W){ const k=x.writer?.file||'(none)'; files[k]=(files[k]||0)+1;} console.log('distinct files',Object.keys(files).length);
