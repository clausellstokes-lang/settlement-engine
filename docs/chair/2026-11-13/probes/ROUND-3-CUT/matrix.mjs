// ROUND-3-CUT step 1 (summary): for each HIGH/MED line, printing or gone at each tree, and per lane its own diff
// (merge base -> tip): REMOVED (prints at its base, gone at its tip), KEPT (prints at both), UNSEEN (its base does not
// print the line; the lane's effect on it cannot be read from the tips), ADDED (gone at base, prints at tip).
import fs from 'node:fs';
const P=JSON.parse(fs.readFileSync(process.argv[2],'utf8')); const out=process.argv[3];
const MB={wa:'mb-wa',wc:'mb-agree',ra:'base',rb:'base',up:'mb-agree',pw:'base',wr:'mb-old',fd:'mb-old',bd:'mb-old',vl:'base'};
const res=[]; for(const r of P){ if(r.severity==='LOW') continue; const on=(t)=>!!r.at[t]; const lane={};
  for(const [k,mb] of Object.entries(MB)) lane[k]= on(mb)&&!on(k)?'REMOVED': on(mb)&&on(k)?'KEPT': !on(mb)&&on(k)?'ADDED':'UNSEEN';
  res.push({n:r.n,severity:r.severity,town:r.town,atLine:on('line'),atBase:on('base'),at:r.at,lane}); }
fs.writeFileSync(out,JSON.stringify(res));
const sev=['HIGH','MED']; const c=(f)=>sev.map(s=>s+' '+res.filter(r=>r.severity===s&&f(r)).length).join(' ');
console.log('at the line tip:',c(r=>r.atLine)); console.log('gone at the line tip, printing at its base e969a75b7:',c(r=>!r.atLine&&r.atBase)); console.log('at the line, not at base:',c(r=>r.atLine&&!r.atBase)); console.log('at neither:',c(r=>!r.atLine&&!r.atBase));
for(const k of Object.keys(MB)) console.log(k.padEnd(3),'of lines at the line tip ->', ['REMOVED','KEPT','UNSEEN','ADDED'].map(s=>s+': '+c(r=>r.atLine&&r.lane[k]===s)).join(' | '));
console.log('removed by >=1 lane (at line tip):',c(r=>r.atLine&&Object.values(r.lane).includes('REMOVED')));
