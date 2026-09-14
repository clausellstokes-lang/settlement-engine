// gatediff-gen.mjs <base.json> <new.json> [blockFilterRegex]
// Diffs two prose-wave-gate packets: unit and pool verdicts, owned FAIL/WITHHELD, and findings by arm.
import fs from 'node:fs';
const [bp,np,filt] = process.argv.slice(2);
const R = filt ? new RegExp(filt) : null;
const load=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const A=load(bp), B=load(np);
const key=f=>[f.klass,f.arm,f.id,f.clause,f.column,f.value].join(' ¦ ');
function collect(j){ const v={FAIL:0,WITHHELD:0,PASS:0}, pv={FAIL:0,WITHHELD:0,PASS:0}, F=new Map(), owned={FAIL:0,WITHHELD:0};
  for (const p of j.pools){ if (R && !R.test(p.block)) continue;
    pv[p.verdict]=(pv[p.verdict]||0)+1;
    for (const k of ['FAIL','WITHHELD','PASS']) v[k]+=(p.walk?.verdicts?.[k]||0);
    for (const f of (p.walk?.findings||[])) { const k=key(f); F.set(k,(F.get(k)||0)+1); if(f.channel==='FAIL'||f.channel==='WITHHELD'){} }
    if (p.owned) { }
  }
  return {v,pv,F}; }
const a=collect(A), b=collect(B);
const arm=m=>{ const o={}; for (const [k,n] of m) { const [kl,ar]=k.split(' ¦ '); const t=`${kl} · ${ar}`; o[t]=(o[t]||0)+n; } return o; };
const NEW=new Map(), GONE=new Map();
for (const [k,n] of b.F) { const d=n-(a.F.get(k)||0); if (d>0) NEW.set(k,d); }
for (const [k,n] of a.F) { const d=n-(b.F.get(k)||0); if (d>0) GONE.set(k,d); }
console.log(`units    FAIL ${a.v.FAIL} -> ${b.v.FAIL} · WITHHELD ${a.v.WITHHELD} -> ${b.v.WITHHELD} · PASS ${a.v.PASS} -> ${b.v.PASS}`);
console.log(`pools    FAIL ${a.pv.FAIL||0} -> ${b.pv.FAIL||0} · WITHHELD ${a.pv.WITHHELD||0} -> ${b.pv.WITHHELD||0} · PASS ${a.pv.PASS||0} -> ${b.pv.PASS||0}`);
const tot=m=>[...m.values()].reduce((x,y)=>x+y,0);
console.log(`findings ${tot(a.F)} -> ${tot(b.F)} · NEW ${tot(NEW)} · GONE ${tot(GONE)}`);
const show=(lbl,o)=>{ const e=Object.entries(o).sort((x,y)=>y[1]-x[1]); console.log(`  ${lbl}: ${e.length?e.map(([k,n])=>`${k} ${n}`).join(' · '):'none'}`); };
show('NEW by arm', arm(NEW)); show('GONE by arm', arm(GONE));
if (process.env.DETAIL) { console.log('\n--- NEW rows ---'); for (const [k,n] of NEW) console.log(`  x${n} ${k}`);
  console.log('\n--- GONE rows ---'); for (const [k,n] of GONE) console.log(`  x${n} ${k}`); }
// appended: the OWNED gate and the walk verdicts, printed from both packets
{ const ow=j=>{ let F=0,W=0,n=0; for (const p of j.pools){ if (R && !R.test(p.block)) continue; n++;
    const o=p.owned||{}; F+=(o.FAIL||o.verdicts?.FAIL||0); W+=(o.WITHHELD||o.verdicts?.WITHHELD||0); } return {F,W,n}; };
  const oa=ow(A), ob=ow(B);
  console.log(`OWNED    FAIL ${oa.F} -> ${ob.F} · WITHHELD ${oa.W} -> ${ob.W}  (over ${ob.n} pools)`);
  console.log(`WALK     FAIL ${A.walk.verdicts.FAIL} -> ${B.walk.verdicts.FAIL} · WITHHELD ${A.walk.verdicts.WITHHELD} -> ${B.walk.verdicts.WITHHELD} · PASS ${A.walk.verdicts.PASS} -> ${B.walk.verdicts.PASS}  (whole section)`); }
