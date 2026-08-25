import { sealed, drawnBodySet } from '../i10-censuses.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
console.log('CORPUS keys:', S.CORPUS.map(s=>s.key).join(', '));
const spec = S.CORPUS.find(s=>s.key==='city');
const { fabric, ...rest } = S.buildOne(spec);
console.log('buildOne extra keys:', Object.keys(rest));
console.log('fabric keys:', Object.keys(fabric).join(', '));
console.log('meta:', JSON.stringify(fabric.meta).slice(0,900));
console.log('walls n=', (fabric.walls||[]).length);
for (const w of (fabric.walls||[])) {
  console.log('  wall kind=',w.kind,'keys=',Object.keys(w).join(','),
    'poly=',(w.polygon||[]).length,'closed=',(w.closedPolygon||[]).length,'claimLine=',(w.claimLine||[]).length,'band=',w.band);
}
console.log('wallCircuit keys:', Object.keys(fabric.wallCircuit||{}).join(','));
for (const r of (fabric.wallCircuit.rings||[])) console.log('  ring epoch=',r.epoch,'kind=',r.kind,'half=',!!r.halfRing,'keys=',Object.keys(r).join(','));
const bodies = drawnBodySet(fabric);
console.log('drawn bodies:', bodies.length, 'kinds:', [...new Set(bodies.map(b=>b.kind))].join(','));
console.log('parcel[0] keys:', Object.keys(fabric.parcels[0]||{}).join(','));
console.log('parcel[0]:', JSON.stringify(fabric.parcels[0]).slice(0,700));
