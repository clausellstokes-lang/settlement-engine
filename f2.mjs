import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneOSR18';
const gdir=path.join(D,'src/data/dossierStateProse'); const all=[];
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) {
  const mod=await import(pathToFileURL(path.join(gdir,f)).href); const t=Object.values(mod)[0];
  for (const [block,b] of Object.entries(t)) for (const [pool,vs] of Object.entries(b.pools||{})) for (const v of vs) all.push({block,pool,...v});
}
const show=(label,re,n=5)=>{const h=all.filter(v=>{re.lastIndex=0;return re.test(v.text)});console.log(`\n${label}: ${h.length}`);h.slice(0,n).forEach(x=>console.log(`   ${x.block} :: ${x.pool} [${x.angle}] ${x.text.slice(0,130)}`));};
show('fronted resumptive "What/what X <verb>, it <same verb>"', /\bwhat [^.,;]{2,40}\b(holds|has|keeps|builds|owns)\b[^.,;]{0,10},? it \1?/gi);
show('literal "it holds by"', /it holds by/gi);
show('present perfect "it has built|has built"', /has built/gi);
show('"must be built"', /must be built/gi);
show('"the margin"', /the margin/gi);
show('"a fair reading"', /fair reading/gi);
