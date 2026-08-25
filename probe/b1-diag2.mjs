import { sealed, bodyCensus, hullContainment } from '../i10-censuses.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
const spec = S.CORPUS.find(s=>s.key==='city');
const t0=Date.now();
const { fabric } = S.buildOne(spec);
console.log('buildOne ms=',Date.now()-t0);
const node = fabric.wallCircuit;

// 1 · FINE plant-site sweep at step 0.25 (the old one was step 2)
const t1=Date.now();
let scanned=0, found=null;
for (const e of node.epochs.filter(x=>x.walled&&x.body)) {
  const b = e.body.reduce((a,[x,y])=>[Math.min(a[0],x),Math.min(a[1],y),Math.max(a[2],x),Math.max(a[3],y)],[1e9,1e9,-1e9,-1e9]);
  for (let y=b[1]; y<=b[3]; y+=0.25) for (let x=b[0]; x<=b[2]; x+=0.25) {
    if (!S.pointIn(e.body,x,y)) continue;
    scanned++;
    const held = node.rings.some(r=>r.epoch>=e.index && (S.pointIn(r.polygon,x,y)||(r.halfRing&&r.closedPolygon&&S.pointIn(r.closedPolygon,x,y))));
    if (!held) { found={p:[x,y],epoch:e.index}; break; }
  }
  if (found) break;
}
console.log(`FINE plant sweep step=0.25 scanned=${scanned} in-body points, result=${found?JSON.stringify(found):'NONE'}  (${Date.now()-t1}ms)`);

// 2 · bisect for s* = largest scale with outside>0
const t2=Date.now();
const outAt=(s)=>bodyCensus(fabric,S,{ringScale:s}).outside;
let lo=0.60, hi=1.00, calls=0;
if (outAt(lo)===0) console.log('⛔ even 0.60 strands nothing');
for (let i=0;i<14;i++){ const mid=(lo+hi)/2; calls++; if (outAt(mid)>0) lo=mid; else hi=mid; }
console.log(`BISECT s* = ${lo.toFixed(5)} (largest scale with outside>0); outside(s*)=${outAt(lo)}  outside(hi=${hi.toFixed(5)})=${outAt(hi)}  calls=${calls} ${Date.now()-t2}ms`);
console.log(`  1 - s* = ${(1-lo).toFixed(5)}  → the gentlest circuit shrink that strands anyone is ${((1-lo)*100).toFixed(2)}%`);
console.log(`  outside(s*-0.05)=${outAt(lo-0.05)}  outside(0.95)=${outAt(0.95)}  outside(1.0)=${outAt(1.0)}`);

// 3 · §240.1 hull rows
console.log('hullContainment:', JSON.stringify(hullContainment(fabric,S)));
