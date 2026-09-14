// READ-ONLY: append-disturbance under the shipped `% length` draw vs an index-stable argmax draw.
// For every shipped pool (L variants) and 200 seeds: append ONE variant; count reads whose drawn
// variant changed. Under `% length` the OLD variants may swap among themselves; under argmax a read
// changes only when the NEW variant wins.
import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6';
function fnv1a32(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function avalanche32(h){let x=h>>>0;x^=x>>>16;x=Math.imul(x,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return x>>>0;}
const H=(k)=>avalanche32(fnv1a32(k));
const gdir=path.join(D,'src/data/dossierStateProse'); const cells=[];
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) {
  const mod=await import(pathToFileURL(path.join(gdir,f)).href); const t=Object.values(mod)[0];
  for (const [block,b] of Object.entries(t)) for (const [pool,vs] of Object.entries(b.pools||{})) cells.push({block,pool,L:vs.length});
}
let n=0, modChanged=0, argChanged=0, argNewWins=0; const byL={};
const argmax=(key,L)=>{let best=-1,bi=-1;for(let v=0;v<L;v++){const h=H(`${key}::v${v}`);if(h>best){best=h;bi=v;}}return bi;};
for(let i=0;i<200;i++){const s='seed-'+i;
  for(const c of cells){const key=`${s}::${c.block}::${c.pool}`; n++;
    const m0=H(key)%c.L, m1=H(key)%(c.L+1); if(m0!==m1) modChanged++;
    const a0=argmax(key,c.L), a1=argmax(key,c.L+1); if(a0!==a1){argChanged++; if(a1===c.L) argNewWins++;}
    byL[c.L]??={n:0,mod:0,arg:0}; byL[c.L].n++; if(m0!==m1) byL[c.L].mod++; if(a0!==a1) byL[c.L].arg++;
  }}
console.log(`reads ${n}`);
console.log(`% length draw: reads that change on ONE append = ${(100*modChanged/n).toFixed(2)}%`);
console.log(`argmax draw:   reads that change on ONE append = ${(100*argChanged/n).toFixed(2)}%  (every change is to the NEW variant: ${argNewWins===argChanged})`);
for(const L of Object.keys(byL).sort((a,b)=>a-b)) console.log(`  L=${L}: % length ${(100*byL[L].mod/byL[L].n).toFixed(1)}%  argmax ${(100*byL[L].arg/byL[L].n).toFixed(1)}%  (expected 1/(L+1) = ${(100/(Number(L)+1)).toFixed(1)}%)`);
// uniformity of argmax over the shipped pools (share drawn per index, pooled over L=3 pools)
const hist={}; let m=0; for(let i=0;i<200;i++){const s='seed-'+i; for(const c of cells){ if(c.L!==3) continue; const a=argmax(`${s}::${c.block}::${c.pool}`,3); hist[a]=(hist[a]||0)+1; m++; }}
console.log('argmax uniformity on L=3 pools:', Object.entries(hist).map(([k,v])=>`${k}:${(100*v/m).toFixed(2)}%`).join(' '));
