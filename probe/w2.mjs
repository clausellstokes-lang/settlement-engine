import { sealed, drawnBodySet } from '../i10-censuses.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
const { fabric } = S.buildOne(S.CORPUS.find(s=>s.key==='town'));
const w = fabric.walls.find(x=>x.kind!=='old-core');
console.log('claimLine === polygon ?', JSON.stringify(w.claimLine)===JSON.stringify(w.polygon));
console.log('claimLine[0]',JSON.stringify(w.claimLine[0]),' polygon[0]',JSON.stringify(w.polygon[0]));
console.log('claimLine[5]',JSON.stringify(w.claimLine[5]),' polygon[5]',JSON.stringify(w.polygon[5]));
console.log('closedPolygon extra:', JSON.stringify(w.closedPolygon.slice(-4)));
console.log('\nstreetWeb keys:', Object.keys(fabric.streetWeb||{}).join(','));
const sw=fabric.streetWeb;
for (const k of Object.keys(sw||{})) { const v=sw[k]; console.log('  ',k,Array.isArray(v)?('array['+v.length+'] sample='+JSON.stringify(v[0]).slice(0,220)):typeof v); }
console.log('\nparcel sample plotLine/plotBack:', JSON.stringify(fabric.parcels[3].plotLine), JSON.stringify(fabric.parcels[3].plotBack));
console.log('grainAngle values sample:', fabric.parcels.slice(0,10).map(p=>p.grainAngle).join(','));
