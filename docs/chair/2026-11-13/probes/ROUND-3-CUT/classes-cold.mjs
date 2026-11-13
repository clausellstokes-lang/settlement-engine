// ROUND-3-CUT step 7: the cold list's HIGH/MED lines in each class, at the line's tip: owed vs cured, by writer and tab.
import fs from 'node:fs';
const R=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const CF=JSON.parse(fs.readFileSync(process.argv[3],'utf8'));
const NAMES=[...new Set(Object.values(CF.forms).flat())];
const A=(s)=>NAMES.some(n=>s.includes(n))||/[A-Z][A-Za-z'’ &-]{2,40} \((\d[\d,]*[-–]\d[\d,]*\+?|\d[\d,]*\+(?: only)?|[\d,]+[-–][\d,]+ households|if walled|multiple|high magic|district)\)/.test(s);
const B=(s)=>/[a-z)]REQ[A-Z]|^REQ$|^FORCED$|\d-order chain|· covers |affects: |^Breakdown$|^(Prosperity|Safety|Defense|Food|Magic|Stability) [+-]\d+$|minormajor$|^\((smuggling|covert|religious fraud|arcane underground)\)$/.test(s);
const out={}; for(const [k,f] of [['a',A],['b',B]]){ const x=R.filter(r=>r.at.line&&f(r.sentence)); const st=(p)=>['HIGH','MED'].map(s=>x.filter(r=>r.severity===s&&p(r)).length).join(' / ');
  console.log(`## class ${k}: at the line ${st(()=>true)} | owed ${st(r=>!!r.package)} | cured on a lane ${st(r=>r.status.startsWith('cured'))}`);
  const W={}; for(const r of x.filter(r=>r.package)){ const w=`${r.writer?.file} :: ${r.writer?.fn}`; (W[w]||={n:0,tabs:new Set(),h:new Set()}); W[w].n++; W[w].tabs.add(r.tab); r.holders.forEach(h=>W[w].h.add(h)); }
  for(const [w,v] of Object.entries(W).sort((a,b)=>b[1].n-a[1].n)) console.log(String(v.n).padStart(4),w,'|',[...v.tabs].join(', '),'| holders:',[...v.h].join(',')||'none');
  out[k]=x.map(r=>r.n); }
fs.writeFileSync(process.argv[4],JSON.stringify(out));
