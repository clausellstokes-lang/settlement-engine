import { sealed, bodyCensus, drawnBodySet } from '../i10-censuses.mjs';
import { centroid as simpleCentroid, distToRing, bbox } from '../lib/geom.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
const spec = S.CORPUS.find(s=>s.key==='city');
const { fabric } = S.buildOne(spec);
const node = fabric.wallCircuit;

console.log('wallCircuit: builtRadius=',node.builtRadius,' frontage=',node.frontage,' gateRadius=',node.gateRadius,' glacisClear=',node.glacisClear);
console.log('epochs:', node.epochs.map(e=>({i:e.index,walled:e.walled,bodyV:(e.body||[]).length})));

// the shrink curve: outside(s) for s from 1.00 down
const B0 = bodyCensus(fabric, S);
console.log(`B0 outside=${B0.outside}/${B0.members} suburb=${B0.suburb} drawn=${B0.bodies}`);
const curve=[];
for (let s=1.00; s>=0.60-1e-9; s-=0.01) {
  const r = bodyCensus(fabric, S, { ringScale: +s.toFixed(2) });
  curve.push([+s.toFixed(2), r.outside]);
  if (r.outside>0 && curve.filter(c=>c[1]>0).length<=3) console.log(`  first strand at scale ${s.toFixed(2)} → outside=${r.outside}/${r.members}`);
}
console.log('CURVE (scale:outside) non-zero head:', curve.filter(c=>c[1]>0).slice(0,12).map(c=>c[0]+':'+c[1]).join('  '));
console.log('CURVE full:', curve.map(c=>c[0]+':'+c[1]).join(' '));
