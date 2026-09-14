import { readdirSync } from 'node:fs'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/laneB6';
function fnv1a32(s){let h=0x811c9dc5;for(let i=0;i<s.length;i++){h^=s.charCodeAt(i);h=Math.imul(h,0x01000193)>>>0;}return h>>>0;}
function avalanche32(h){let x=h>>>0;x^=x>>>16;x=Math.imul(x,0x85ebca6b);x^=x>>>13;x=Math.imul(x,0xc2b2ae35);x^=x>>>16;return x>>>0;}
const draw=(k,L)=>avalanche32(fnv1a32(k))%L;
const gdir=path.join(D,'src/data/dossierStateProse'); const cells=[];
for (const f of readdirSync(gdir).filter(f=>f.endsWith('.generated.js'))) {
  const mod=await import(pathToFileURL(path.join(gdir,f)).href); const t=Object.values(mod)[0];
  for (const [block,b] of Object.entries(t)) for (const [pool,vs] of Object.entries(b.pools||{})) cells.push({block,pool,L:vs.length});
}
let n=0,grouped=0,inter=0; const faceHist={0:0,1:0,2:0,3:0};
for(let i=0;i<200;i++){const s='seed-'+i;
 for(const c of cells){const key=`${s}::${c.block}::${c.pool}`;const old=draw(key,c.L);const j=draw(key,c.L*4);
  n++; if(Math.floor(j/4)===old) grouped++; if(j%c.L===old) inter++; faceHist[Math.floor(j/c.L)]++;}}
console.log('reads',n);
console.log('GROUPED flatten (faces of variant i at 4i..4i+3): semantic preserved',(grouped/n*100).toFixed(2)+'%');
console.log('INTERLEAVED flatten (index j -> variant j % L, face floor(j/L)): semantic preserved',(inter/n*100).toFixed(2)+'%');
console.log('face distribution under interleaved flatten:',JSON.stringify(Object.fromEntries(Object.entries(faceHist).map(([k,v])=>[k,(v/n*100).toFixed(2)+'%']))));
