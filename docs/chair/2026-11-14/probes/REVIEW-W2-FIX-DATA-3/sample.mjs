// Pick, per line, the towns a reader reads: the smallest and largest size it prints at, one under a siege, a famine or
// an occupation where it prints under one, and one more (spread by seed). Writes assignment files for N readers.
import fs from 'node:fs';
const J=JSON.parse(fs.readFileSync(process.env.JUDGE,'utf8')); const N=+process.env.N||4; const OUT=process.env.OUT; fs.mkdirSync(OUT,{recursive:true});
const TI=['thorp','hamlet','village','town','city','metropolis'];
const ids=Object.keys(J).filter(id=>J[id].towns.length>0 && !['H07','E01'].includes(id));
const groups=Array.from({length:N},()=>[]);
ids.forEach((id,i)=>{ const x=J[id]; const ts=[...x.towns].sort((a,b)=>TI.indexOf(a.tier)-TI.indexOf(b.tier)||a.seed.localeCompare(b.seed));
  const pick=new Map(); const put=(t)=>t&&pick.size<4&&pick.set(t.seed,t);
  put(ts[0]); put(ts[ts.length-1]); put(ts.find(t=>t.crisis.some(c=>['under_siege','famine','occupied'].includes(c))&&!pick.has(t.seed)));
  put(ts[Math.floor(ts.length/2)]); put(ts.find(t=>!pick.has(t.seed)));
  groups[i%N].push({ id, kind:x.kind, file:x.file, fn:x.fn, pattern:x.re, declared:x.cond, printsInTowns:x.towns.length, read:[...pick.values()].map(t=>({seed:t.seed,name:t.name,tier:t.tier,pop:t.pop,crisis:t.crisis,views:t.views,sentence:t.sent})) }); });
groups.forEach((g,i)=>fs.writeFileSync(`${OUT}/assign-${i+1}.json`,JSON.stringify(g,null,1)));
console.log(groups.map(g=>g.length).join(' '), ids.length);
