import { sealed, tangentialCensus, polyCrossesLine, segsCross } from '../i12-tangential.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
// 1 · is any wall a CLOSED ring (so the closing edge would be missed)?
for (const spec of S.CORPUS) {
  const { fabric } = S.buildOne(spec);
  for (const w of (fabric.walls||[])) {
    const p=w.polygon||[];
    const gap = p.length>1 ? Math.hypot(p[0][0]-p[p.length-1][0], p[0][1]-p[p.length-1][1]) : null;
    if (!w.halfRing || (gap!=null && gap < 1e-6)) console.log(`CLOSED-OR-NONHALF: ${spec.key}/${w.kind} halfRing=${w.halfRing} endGap=${gap}`);
  }
}
console.log('closed-ring scan done');
// 2 · hand-verify one crossing on town: pull a crosser and show the intersecting edge pair
const { fabric } = S.buildOne(S.CORPUS.find(s=>s.key==='town'));
const w = fabric.walls.find(x=>x.kind!=='old-core');
const res = tangentialCensus(fabric, w, S, { returnRows:true });
const cr = res.crossers.slice(0,3);
console.log('first 3 crossers:', JSON.stringify(cr));
const row = (res.rows||[]).find(b=>b.key===cr[0].key);
const body = row;
console.log('crosser row:', JSON.stringify({key:row.key,kind:row.kind,d:row.d,seg:row.seg,inside:row.inside,verdict:row.verdict}));
// find the actual body polygon and the wall segment it crosses
import { drawnBodySet } from '../i10-censuses.mjs';
const b = drawnBodySet(fabric).find(x=>x.key===cr[0].key);
const line = w.polygon;
let hits=0;
for (let i=0;i<b.poly.length;i++){ const p1=b.poly[i],p2=b.poly[(i+1)%b.poly.length];
  for (let j=0;j<line.length-1;j++) if (segsCross(p1,p2,line[j],line[j+1])) { if(hits<3) console.log(`  body edge ${i} [${p1.map(v=>v.toFixed(2))}]→[${p2.map(v=>v.toFixed(2))}]  crosses wall seg ${j} [${line[j].map(v=>v.toFixed(2))}]→[${line[j+1].map(v=>v.toFixed(2))}]`); hits++; } }
console.log('total edge-crossings for this body:',hits, ' body poly verts:',b.poly.length);
