// ROUND-3-CUT increment: the writer of each HIGH/MED line of another reader's cold list, at the line's tip, by the
// cut's own instruments: (1) a traced form (trace-forms signature); (2) a raw house name -> the tab's raw-name writer;
// (3) fixed runs by git grep -F (names folded by shape: no records of these towns are on hand); (4) the reader's source.
// Function: top-level definition / data key / corpus pool › combination · variant (as writers-fix.mjs).
// node inc-writers.mjs <tree> <list.json> <listId> <trace-forms.json> <trace-forms.out.json> <out.json>
import fs from 'node:fs'; import { execFileSync } from 'node:child_process';
const [TREE,lf,ID,tf,tof,out]=process.argv.slice(2);
const L=JSON.parse(fs.readFileSync(lf,'utf8')).map((r,i)=>({...r,_i:i+1})).filter(r=>r.severity==='HIGH'||r.severity==='MED');
const TF=JSON.parse(fs.readFileSync(tf,'utf8')); const TO=Object.fromEntries(JSON.parse(fs.readFileSync(tof,'utf8')).map(t=>[t.id,t]));
const sig=(r)=>r.tab+" :: "+r.sentence.replace(/[A-Z][\w'’ -]*\((?:[\d,]+[-–][\d,]+\+?|multiple|if walled)[^)]*\)/g,"<HOUSE>").replace(/(member|first|second|third|fourth|head) of [A-Z][\w ]+/g,"$1 of <F>").replace(/held by [A-Z][\w ]+/,"held by <P>").replace(/[+-]?\d+/g,"#").slice(0,70);
const bySig={}; for(const t of TF) bySig[t.signature]=TO[t.id]; const surf={}; for(const t of TF){ const o=TO[t.id]; if(/<HOUSE>/.test(t.signature)&&o) surf[t.signature.split(' :: ')[0]] ??= o; }
const HOUSE=/[A-Z][\w'’ -]*\((?:[\d,]+[-–][\d,]+\+?|multiple|if walled|[\d,]+\+ households|[\d,]+[-–][\d,]+ households|high magic|district)\)/;
const cache={}; const lines=(f)=>{ try{ return cache[f]??=fs.readFileSync(`${TREE}/${f}`,'utf8').split('\n'); }catch{ return null; } };
const grep=(t,scope=['src'])=>{ try{ return execFileSync('git',['-C',TREE,'grep','-n','-F','-i',t,'--',...scope],{encoding:'utf8',maxBuffer:5e7}).trim().split('\n').filter(l=>l&&!/\.test\.|\/tests?\/|__tests__/.test(l.split(':')[0])); }catch{ return []; } };
const KW=new Set(['if','for','while','switch','return','catch','else','do','try','x','at','pick']);
function topDef(f,ln){ const A=lines(f); for(let i=Math.min(ln,A.length)-1;i>=0;i--){ const l=A[i]; const m=l.match(/^(?:export\s+)?(?:default\s+)?(?:async\s+)?function\s*\*?\s*([A-Za-z_$][\w$]*)/)||l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/)||l.match(/^\s{2}([A-Za-z_$][\w$]*)\s*\([^)]*\)\s*\{\s*$/); if(m&&!KW.has(m[1])) return m[1]; } return ''; }
function dataKey(f,ln){ const A=lines(f); let key=''; for(let i=Math.min(ln,A.length)-1;i>=0;i--){ const l=A[i]; const k=!key&&l.match(/^\s{2}['"]?([\w$ -]+?)['"]?\s*:\s*[\[{(]/); if(k) key=k[1].trim(); const m=l.match(/^(?:export\s+)?(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=/); if(m) return key?`${m[1]}.${key}`:m[1]; } return key; }
function poolAt(f,ln){ const A=lines(f); if(!A||!A[ln-1]) return ""; const ti=A[ln-1].match(/^\s*/)[0].length; let comb='',pk='',vid=''; for(let i=ln;i<Math.min(ln+12,A.length);i++){ const v=A[i].match(/"vid":\s*(\d+)/); if(v){vid=v[1];break;} } for(let i=ln-1;i>=0;i--){ const m=A[i].match(/^(\s*)"([^"]+)":\s*[\[{]\s*$/); if(!m) continue; const d=m[1].length; if(!comb&&d===ti-4) comb=m[2]; else if(d===2){ pk=m[2]; break; } } return `${pk} › ${comb} · v${vid}`; }
const fnOf=(f,ln)=>/dossierStateProse\/.*generated/.test(f)?poolAt(f,ln):/^src\/data\//.test(f)?dataKey(f,ln):topDef(f,ln);
function runs(s){ s=s.replace(/[\d,.]+%?/g,'\u0001').replace(/[“”"]/g,'\u0001').replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/gi,'\u0001');
  s=s.replace(/(?<=[a-z,;:] )([A-Z][\w'’-]+(?:[ -](?:al-|ibn |de |of |the )?[A-Z][\w'’-]+)*)/g,'\u0001').replace(/^([A-Z][\w'’-]+(?: [A-Z][\w'’-]+)+)/,'\u0001').replace(/([A-Z][\w'’-]+)(?='s)/g,'\u0001');
  return s.split('\u0001').map(t=>t.trim()).filter(t=>t.length>=14).sort((a,b)=>b.length-a.length); }
const res=[]; for(const r of L){ let w=null; const s=sig(r);
  if(bySig[s]) w={file:bySig[s].writerFile,fn:bySig[s].writerFn,evidence:'traced form'};
  else if(HOUSE.test(r.sentence)&&surf[r.tab]) w={file:surf[r.tab].writerFile,fn:surf[r.tab].writerFn,evidence:"traced form (the tab's raw-name writer)"};
  if(!w){ for(const t of runs(r.sentence).slice(0,5)){ let tt=t, h=grep(tt); while(!h.length&&tt.length>22){ tt=tt.slice(0,Math.floor(tt.length*0.7)).trim(); h=grep(tt);} if(h.length){ const rk=[...h.filter(l=>/dossierStateProse\/.*generated/.test(l)),...h.filter(l=>/^src\/data\//.test(l)&&!/generated/.test(l)),...h.filter(l=>!/^src\/data\//.test(l))]; const [f,ln]=rk[0].split(':'); w={file:f,fn:fnOf(f,+ln),line:+ln,run:tt,evidence:'git grep -F at the line tip'}; break; } } }
  if(!w&&r.source){ const m=String(r.source).match(/(src\/[^\s:,]+)(?::(\d+))?/); if(m&&lines(m[1])) w={file:m[1],fn:m[2]?fnOf(m[1],+m[2]):'',line:m[2]?+m[2]:0,evidence:"the reader's source (function PLAUSIBLE)"}; }
  res.push({list:ID,i:r._i,severity:r.severity,town:r.town,tab:r.tab,sentence:r.sentence,fact:r.fact,mechanism:r.mechanism,origin:r.origin||(r.tipOnly?'tipOnly':''),writer:w}); }
fs.writeFileSync(out,JSON.stringify(res,null,1));
console.log(ID,'HM',res.length,'writer',res.filter(x=>x.writer).length,'none',res.filter(x=>!x.writer).length, JSON.stringify(res.reduce((a,x)=>{const k=x.writer?.evidence||'none'; a[k]=(a[k]||0)+1; return a;},{})));
