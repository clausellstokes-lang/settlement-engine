import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneOSR18';
const gdir = path.join(D, 'src/data/dossierStateProse');
const sentences = t => t.replace(/\{[a-z_0-9]+\}/g,'X').split(/(?<=[.?!])\s+(?=[A-Z"'(])/).filter(Boolean).length;
const two = t => t.trim().split(/\s+/).slice(0,2).join(' ');
const all=[];
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir,f)).href); const table=Object.values(mod)[0];
  for (const [block,b] of Object.entries(table)) for (const [pool,vs] of Object.entries(b.pools||{})) for (const v of vs) all.push({block,pool,f,...v});
}
for (const key of ['terrain EXPOSED','readiness WEAK','readiness ADEQUATE','Invasion & War: walls AND professional garrison']) {
  console.log('POOL '+key);
  for (const v of all.filter(x=>x.pool===key&&x.block.startsWith('DS-DEF')))
    console.log(`   [${v.angle}] sentences=${sentences(v.text)} opener="${two(v.text)}"`);
}
console.log('\n--- phrase census across the whole dossier-state corpus ('+all.length+' variants) ---');
for (const re of [/says so/gi,/bears? (it|the .*?) out/gi,/another matter/gi,/does not pretend/gi,/rated for/gi,/deterrence/gi]) {
  const hits = all.filter(v=>re.test(v.text)); re.lastIndex=0;
  console.log(`${re.source}: ${hits.length}`);
  for (const h of hits.slice(0,6)) console.log(`    ${h.block} :: ${h.pool} [${h.angle}] ${h.text.slice(0,120)}`);
}
