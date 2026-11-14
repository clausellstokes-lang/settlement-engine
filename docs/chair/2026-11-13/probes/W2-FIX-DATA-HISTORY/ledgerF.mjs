import fs from 'node:fs';
const D='docs/census/declarations/';
const R={ 'Each lane seems to keep to its own trade, and each trade to its own lane.': { needs:['tier: ≥ town'] },
 'Tea is poured for a merchant before the bargaining begins, and the bargaining waits for it.': { needs:['market'] },
 'A merchant swears an oath on his scales, and the buyer watches the scales anyway.': { needs:['market'] },
 'Stacks of seasoning planks line the road in, taller than the carts that wait for them.': { excludes:['crisis: under_siege'], crisis:'any' } };
for (const [f,ind] of [['ARRIVAL_PEOPLE.json',2],['ARRIVAL_SENSES.json',1]]) { const j=JSON.parse(fs.readFileSync(D+f,'utf8')); let n=0;
  for (const pool of j.pools) for (const line of pool.lines) { const r=R[line.text]; if(!r) continue; if(r.needs) line.needs=r.needs; if(r.excludes) line.excludes=r.excludes; if(r.crisis) line.crisis=r.crisis; line.colour=false; n++; }
  fs.writeFileSync(D+f, JSON.stringify(j,null,ind)+'\n'); console.log(f,'lines followed',n); }
