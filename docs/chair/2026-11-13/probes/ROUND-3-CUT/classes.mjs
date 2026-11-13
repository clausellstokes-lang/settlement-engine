// ROUND-3-CUT step 7: the house's label (a) and the machinery (b), counted on every surface of the 20 towns at a tree.
// (a) every catalogue name that carries a parenthesis (catalogue-forms.json), printed with it; and any capitalised
//     name with a count range not in the catalogue (e.g. "Houses of worship (10-30)").
// (b) REQ / FORCED badges run onto a name, "N-order chain", "· covers", "affects:", a rating's breakdown rows
//     ("Breakdown", "Prosperity +20" ...), "minormajor" slider ends.
// node classes.mjs <catalogue-forms.json> <dumps dir> [surf dir] > out
import fs from 'node:fs';
const [cf,dumps,surf]=process.argv.slice(2); const CF=JSON.parse(fs.readFileSync(cf,'utf8'));
const NAMES=[...new Set(Object.values(CF.forms).flat())].sort((a,b)=>b.length-a.length); const FORM={}; for(const [k,v] of Object.entries(CF.forms)) for(const n of v) FORM[n]=k;
const RANGE=/([A-Z][A-Za-z'’ &-]{2,40}) \((\d[\d,]*[-–]\d[\d,]*\+?|\d[\d,]*\+(?: only)?)\)/g;
const B={ badgeREQ:/[a-z)]REQ[A-Z]|^REQ$/, badgeFORCED:/^FORCED$|[a-z)]FORCED/, chainDepth:/\d-order chain/, covers:/· covers /, affects:/affects: /, breakdown:/^Breakdown$|^(Prosperity|Safety|Defense|Food|Magic|Stability) [+-]\d+$/, sliderEnds:/minormajor$/ };
const A={}, Bc={}, ex={};
const add=(o,k,l)=>{ o[k]=(o[k]||0)+1; (ex[k]||=new Set()).size<3&&ex[k].add(l.slice(0,100)); };
function scan(surface,line){ if(/History & Founding \(|hooks to pull|institutions; the largest/.test(line)) return; const seen=new Set();
  for(const n of NAMES) if(line.includes(n)&&![...seen].some(s=>s.includes(n))){ seen.add(n); add(A,`${surface} :: ${FORM[n]}`,line); }
  for(const m of line.matchAll(RANGE)){ const full=m[0]; if(![...seen].some(s=>full.includes(s)||s.includes(full.replace(/^.* (?=[A-Z][^ ]* \()/,'')))) { add(A,`${surface} :: count range, a name the catalogue lacks`,line); } }
  for(const [k,re] of Object.entries(B)) if(re.test(line)) add(Bc,`${surface} :: ${k}`,line); }
for(const f of fs.readdirSync(dumps)){ let view=''; for(const l of fs.readFileSync(`${dumps}/${f}`,'utf8').split('\n')){ if(l.startsWith('== ')){view=l.replace(/^== | ==$/g,'');continue;} if(!l||l.startsWith('[STYLE]')) continue; scan('page '+view,l); } }
if(surf) for(const f of fs.readdirSync(surf).filter(f=>/^rr2s.*\.txt$/.test(f))){ const s=f.replace(/^rr2s-[^.]+\./,'').replace(/\.txt$/,''); for(const l of fs.readFileSync(`${surf}/${f}`,'utf8').split('\n')) if(l) scan(s,l); }
const pr=(o,t)=>{ console.log('##',t,'total',Object.values(o).reduce((a,b)=>a+b,0)); for(const [k,v] of Object.entries(o).sort((a,b)=>b[1]-a[1])) console.log(String(v).padStart(5),k,'   e.g.',[...ex[k]][0]); };
pr(A,'(a) the house label'); pr(Bc,'(b) the machinery');
