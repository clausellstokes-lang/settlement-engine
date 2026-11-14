import fs from 'node:fs';
const TREE=process.env.TREE; process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href); const born=await boot(TREE);
const RE=/The hammering echoes through all of .+?, and the place plainly lives by its forges|lives by its forges: the clang of iron is in every lane/;
const out=[];
for (const seed of fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n')) { const s=born(seed); const a=JSON.stringify(s.arrivalScene||''); const m=a.match(RE); if(!m) continue;
  const inc=(s.economicState?.incomeSources||[]).map(x=>[x.source||x.label||x.name, x.percentage??x.share??x.pct]);
  const idx=inc.findIndex(([n])=>/iron|metal|smith|forge|smelt/i.test(String(n)));
  out.push({seed,tier:s.tier,stress:(s.stress?[].concat(s.stress):[]).map(x=>x.type),line:m[0].slice(0,60),metalRank:idx<0?null:idx+1,metal:idx<0?null:inc[idx],first:inc[0]}); }
fs.writeFileSync(process.env.OUT,out.map(x=>JSON.stringify(x)).join('\n')+'\n'); console.log(out.length,'prints; metal first in',out.filter(o=>o.metalRank===1).length);
