import fs from 'node:fs';
const TREE=process.env.TREE; process.chdir(TREE);
const { boot } = await import(new URL('./born.mjs', import.meta.url).href); const born=await boot(TREE);
const L=fs.readFileSync(process.env.IN,'utf8').trim().split('\n').map(JSON.parse);
const key=d=>/It stands between/.test(d)?"S1":/cast in bars/.test(d)?"S1t":/what the mine yields/.test(d)?"S2":/by the bar/.test(d)?"S2t":/industrial intermediate/.test(d)?"CAT":"OTHER";
const out=[];
for(const o of L){ const s=born(o.seed); const ra=s.resourceAnalysis||{};
  const res=JSON.stringify(ra.availableResources||[]); const cond=JSON.stringify(ra.resourceConditions||{});
  const ore=/iron_deposits|precious_metals|copper|tin_deposits/.test(res);
  const imp=JSON.stringify([s.economicState?.primaryImports, s.economicState?.necessityImports, ra.imports]).match(/[^"]*\b(ore|iron|metal)[^"]*/gi)||[];
  const exh=/seams are exhausted|veins are exhausted/.test(cond);
  out.push({seed:o.seed,line:key(o.desc),tier:s.tier,stress:o.stress,ore,exh,imp:[...new Set(imp)].slice(0,4),smelt:(o.chains.find(c=>c.id==='smelting')||{}).status||'none'});
}
fs.writeFileSync(process.env.OUT,out.map(x=>JSON.stringify(x)).join('\n')+'\n');
const r={}; for(const x of out){const k=r[x.line]??={n:0,noOreNoImport:0,noOreImport:0,exh:0}; k.n++; if(!x.ore&&!x.imp.length)k.noOreNoImport++; if(!x.ore&&x.imp.length)k.noOreImport++; if(x.exh)k.exh++;} console.log(JSON.stringify(r));
