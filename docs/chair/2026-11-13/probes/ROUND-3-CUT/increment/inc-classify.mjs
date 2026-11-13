// ROUND-3-CUT increment: SAME FAULT (the same writer file::function and the same mechanism class as a line of the cut),
// CHARGED (the list's own reader charged it to the lane it reviews: W2-WRITE origin OWN; POWERS-FU tip-only lines its
// reviewer classed O* or L*, the lane's own), or NEW. NEW lines get the holders by own commits and a package.
// node inc-classify.mjs <cut.json> <holders.json> <pf-tiponly.json> <out.json> <ww-w.json> <pf-w.json>
import fs from 'node:fs'; import { execSync } from 'node:child_process';
const [cf,hf,tof,out,...lists]=process.argv.slice(2);
const CUT=JSON.parse(fs.readFileSync(cf,'utf8')); const H=JSON.parse(fs.readFileSync(hf,'utf8')); const TO=JSON.parse(fs.readFileSync(tof,'utf8'));
const MC=(m)=>{ m=String(m||'').toLowerCase(); return /two homes/.test(m)?'homes': /normal times|under a crisis/.test(m)?'crisis': /internal|broken|count range|machinery|provenance|catalogue name|chip/.test(m)?'internal': /lacks|names a house|names a role/.test(m)?'lacks': /denies/.test(m)?'denies': /figure/.test(m)?'figure': /resource|good|chain/.test(m)?'resource': /size/.test(m)?'size': /\bcount\b/.test(m)?'count': /ruler|power|threat|history/.test(m)?'power': /role|rank|rival|mentor|trade|apprentice|lord|tie|kin/.test(m)?'people':'other'; };
const words=(s)=>new Set(String(s).toLowerCase().match(/[a-z]{4,}/g)||[]); const jac=(a,b)=>{ const i=[...a].filter(x=>b.has(x)).length; return i/Math.max(1,a.size+b.size-i); };
const byW={}; for(const c of CUT){ if(!c.writer) continue; (byW[c.writer.file+'::'+c.writer.fn] ||= []).push({...c,mc:MC(c.mechanism),w:words(c.sentence)}); }
const tipCls=new Map(TO.map(t=>[t.town+'|'+t.sentence,t.reviewerClass]));
const who=(f)=>Object.entries(H).filter(([k,v])=>v.files.includes(f)).map(([k])=>k);
const memo={}; const own=(f,hs)=>memo[f]??=(hs.length<2?hs:(()=>{ const sets=hs.map(k=>new Set(execSync(`git log --format=%H ${H[k].mergeBase}..${H[k].tip} -- ${f}`).toString().trim().split('\n').filter(Boolean))); return hs.filter((k,i)=>{ const o=new Set(sets.filter((_,j)=>j!==i).flatMap(s=>[...s])); return [...sets[i]].some(c=>!o.has(c)); }); })());
const FAM=(f)=>/dossierStateProse/.test(f)?'the corpus (src/data/dossierStateProse)': /^src\/data\/institution|institutionalCatalog/.test(f)?'the institution catalogue and its descriptions': /^src\/data\/people\//.test(f)?'people data (src/data/people)': /^src\/data\//.test(f)?'data tables (src/data)': /^src\/components\/new\/tabs\//.test(f)?'the tabs (src/components/new/tabs)': /^src\/components\//.test(f)?'page cards (src/components/new)': /^src\/generators\/power|^src\/domain\/power/.test(f)?'power generators': /^src\/generators\/people|npcGenerator|^src\/domain\/people/.test(f)?'people generators': /^src\/generators\/economy|computeActiveChains/.test(f)?'economy generators': /^src\/generators\//.test(f)?'generators (other)': /^src\/domain\/display\//.test(f)?'display leaves (src/domain/display)': /^src\/domain\//.test(f)?'domain (other)':'other';
const res=[]; for(const lf of lists){ for(const x of JSON.parse(fs.readFileSync(lf,'utf8'))){ const mc=MC(x.mechanism); let cls,same=null,charged='';
  if(x.list==='ww'&&x.origin==='OWN') charged='W2-WRITE (its reader: origin OWN)';
  if(x.list==='pf'&&x.origin==='tipOnly'){ const c=tipCls.get(x.town+'|'+x.sentence)||''; if(/^(O|L)\d/.test(c)) charged='POWERS-FU (its reviewer: '+c.slice(0,60)+')'; x.reviewerClass=c; }
  const k=x.writer.file+'::'+x.writer.fn; const cand=(byW[k]||[]).filter(c=>c.mc===mc); if(cand.length){ const w=words(x.sentence); cand.sort((a,b)=>(!!b.package-!!a.package)||jac(w,b.w)-jac(w,a.w)); const c=cand[0]; same={n:c.n,package:c.package,status:c.status,curedOn:c.curedOn}; }
  cls= charged?'CHARGED': same?'SAME FAULT':'NEW';
  const r={...x,mc,class:cls,charged,same}; if(cls==='NEW'){ const hs=who(x.writer.file); r.holders=hs; r.ownHolders=own(x.writer.file,hs); const o=r.ownHolders; r.package=o.length===1?`lane ${o[0]}`:o.length>1?`several lanes: ${o.join(', ')}`:hs.length?`several lanes, shared commits only: ${hs.join(', ')}`:`no lane: ${FAM(x.writer.file)}`; }
  res.push(r); } }
fs.writeFileSync(out,JSON.stringify(res,null,1));
const t=(f)=>['HIGH','MED'].map(s=>res.filter(r=>r.severity===s&&f(r)).length).join(' / ');
for(const L of ['ww','pf']) for(const c of ['SAME FAULT','CHARGED','NEW']) console.log(L,c.padEnd(11),t(r=>r.list===L&&r.class===c));
const N=res.filter(r=>r.class==='NEW'); console.log('NEW',t(r=>r.class==='NEW'),'distinct writers',new Set(N.map(r=>r.writer.file+'::'+r.writer.fn)).size,'files',new Set(N.map(r=>r.writer.file)).size);
const P={}; for(const r of N){ P[r.package]=P[r.package]||[0,0]; P[r.package][r.severity==='HIGH'?0:1]++; } for(const [k,v] of Object.entries(P).sort((a,b)=>b[1][0]-a[1][0]||b[1][1]-a[1][1])) console.log('  ',v.join(' / ').padEnd(9),k);
const S={}; for(const r of res.filter(r=>r.class==='SAME FAULT')){ const k=r.same.package||('cured: '+r.same.status); S[k]=(S[k]||0)+1; } console.log('SAME FAULT by my package:',JSON.stringify(S));
