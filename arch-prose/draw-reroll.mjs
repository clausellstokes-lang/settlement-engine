// READ-ONLY: measure what the 4x wording family does to the kernel's draw under the two
// candidate roll shapes. Loads the shipped generated leaves at the product tip (laneB6).
import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6';
function fnv1a32(str){let h=0x811c9dc5;for(let i=0;i<str.length;i++){h^=str.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function avalanche32(h){let x=h>>>0;x^=x>>>16;x=Math.imul(x,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return x>>>0;}
const draw=(k,L)=>avalanche32(fnv1a32(k))%L;
const gdir = path.join(D,'src/data/dossierStateProse');
const cells=[]; let variants=0;
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) {
  const mod = await import(pathToFileURL(path.join(gdir,f)).href); const table=Object.values(mod)[0];
  for (const [block,b] of Object.entries(table)) for (const [pool,vs] of Object.entries(b.pools||{})) { cells.push({block,pool,L:vs.length}); variants+=vs.length; }
}
console.log(`R1 leaves: ${cells.length} pools, ${variants} variants, mean ${(variants/cells.length).toFixed(2)}`);
const hist={}; for(const c of cells) hist[c.L]=(hist[c.L]||0)+1;
console.log('pool-length histogram:', Object.entries(hist).sort((a,b)=>a[0]-b[0]).map(([k,v])=>`${k}->${v}`).join(' '));
const SEEDS=[]; for(let i=0;i<200;i++) SEEDS.push('seed-'+i);
let n=0, sameFlat=0, sameTwoLevel=0, sameWordingFace=0;
for (const s of SEEDS) for (const c of cells) {
  const key=`${s}::${c.block}::${c.pool}`;
  const old = draw(key, c.L);
  const flatParent = Math.floor(draw(key, c.L*4)/4);           // grouped flatten: 4 faces of variant i sit at 4i..4i+3
  const twoLevelParent = old;                                   // a second key rolls the face; the parent key is untouched
  n++; if (flatParent===old) sameFlat++; if (twoLevelParent===old) sameTwoLevel++;
  // under the two-level roll the face is drawn on a DIFFERENT key, so the parent never moves
  const face = draw(`${key}::wording`, 4); if (face===0) sameWordingFace++;
}
console.log(`(seed,pool) pairs measured: ${n} (200 seeds x ${cells.length} pools)`);
console.log(`FLATTENED one-level roll over 4L: semantic variant preserved on ${sameFlat}/${n} = ${(sameFlat/n*100).toFixed(2)}%`);
console.log(`TWO-LEVEL roll (parent key unchanged): semantic variant preserved on ${sameTwoLevel}/${n} = ${(sameTwoLevel/n*100).toFixed(2)}%`);
console.log(`face-0 share under the second key: ${(sameWordingFace/n*100).toFixed(2)}% (uniform target 25%)`);
