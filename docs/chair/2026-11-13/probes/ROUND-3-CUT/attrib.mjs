// ROUND-3-CUT step 3: the writer of each HIGH/MED cold line, at the line's tip. After REVIEW-W2A-3's attrib.mjs:
// names (town, people, powers, houses), tier nouns and numbers folded out; the longest fixed runs searched with
// git grep -F in src/ and docs/content; the enclosing function found by scanning up from the hit.
// node attrib.mjs <tree> <cold.json> <records dir> <out.json>
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [TREE,coldF,REC,OUT]=process.argv.slice(2);
const cold=JSON.parse(fs.readFileSync(coldF,'utf8')).filter(x=>x.severity!=='LOW');
const recs={}; const rec=(id)=>recs[id]??=JSON.parse(fs.readFileSync(`${REC}/${id}.json`,'utf8'));
function names(r){ const n=[r.name,...(r.npcs||[]).map(n=>n.name),...(r.npcs||[]).flatMap(n=>String(n.name||'').split(' ')),...(r.powerStructure?.factions||[]).map(f=>f.faction||f.name),...(r.institutions||[]).map(i=>i.name),...(r.institutions||[]).map(i=>String(i.name||'').replace(/\s*\([^)]*\)\s*$/,''))];
  return [...new Set(n.filter(s=>s&&String(s).length>2).map(String))].sort((a,b)=>b.length-a.length); }
function runs(x){ let s=x.sentence; for(const n of names(rec(x.town))) s=s.split(n).join('\u0001');
  s=s.replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/gi,'\u0001').replace(/[\d,.]+%?/g,'\u0001').replace(/[“”"]/g,'\u0001');
  return s.split('\u0001').map(t=>t.trim()).filter(t=>t.length>=14).sort((a,b)=>b.length-a.length); }
function grep(t){ try{ return execFileSync('git',['-C',TREE,'grep','-n','-F','-i',t,'--','src','docs/content'],{encoding:'utf8',maxBuffer:5e7}).trim().split('\n').filter(Boolean);}catch{return [];} }
const fileCache={}; const lines=(f)=>fileCache[f]??=fs.readFileSync(`${TREE}/${f}`,'utf8').split('\n');
const DEF=[/^\s*(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/, /^\s*(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/, /^\s{0,4}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*$/, /^\s{0,4}['"]?([A-Za-z_$][\w$-]*)['"]?\s*:\s*[\[{(]/];
function enclosing(f,ln){ const L=lines(f); for(let i=ln-1;i>=0;i--){ const l=L[i]; if(/^\s*(\/\/|\*|\/\*)/.test(l)) continue; for(const re of DEF){ const m=l.match(re); if(m && (l.match(/^\s*/)[0].length<=4)) return m[1]; } } return ''; }
const out=[];
for(const x of cold){ const R=runs(x); let hit=[],run='';
  for(const t of R.slice(0,5)){ let tt=t; let h=grep(tt); while(!h.length&&tt.length>22){ tt=tt.slice(0,Math.floor(tt.length*0.7)).trim(); h=grep(tt);} if(h.length){hit=h;run=tt;break;} }
  const nonTest=hit.filter(l=>!/\.test\.|\/tests?\/|__tests__/.test(l.split(':')[0]));
  const ranked=[...nonTest.filter(l=>/^src\/data\/dossierStateProse\/.*generated|RECEIPT_POOLS/.test(l)),...nonTest.filter(l=>/^src\/data\//.test(l)&&!/generated/.test(l)),...nonTest.filter(l=>/^src\//.test(l)&&!/^src\/data\//.test(l)),...nonTest.filter(l=>/^docs\//.test(l))];
  const top=ranked[0]||''; let file='',line=0,fn='';
  if(top){ const m=top.match(/^([^:]+):(\d+):/); file=m[1]; line=+m[2]; try{ fn=enclosing(file,line);}catch{} }
  out.push({n:x.n,run,file,line,fn,hits:[...new Set(ranked.map(l=>l.split(':')[0]))].slice(0,8),readerSource:x.source||''}); }
fs.writeFileSync(OUT,JSON.stringify(out,null,1));
console.log('HM',out.length,'grep-found',out.filter(o=>o.file).length,'not found',out.filter(o=>!o.file).length,'not found & no reader source',out.filter(o=>!o.file&&!o.readerSource).length);
