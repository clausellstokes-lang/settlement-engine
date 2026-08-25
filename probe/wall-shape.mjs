import { sealed, drawnBodySet } from '../i10-censuses.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
for (const k of ['town','city']) {
  const { fabric } = S.buildOne(S.CORPUS.find(s=>s.key===k));
  console.log(`\n##### ${k}  frontage=${fabric.wallCircuit.frontage} builtRadius=${fabric.wallCircuit.builtRadius} gateRadius=${fabric.wallCircuit.gateRadius} glacisClear=${fabric.wallCircuit.glacisClear}`);
  for (const w of fabric.walls) {
    const closed = w.polygon.length>1 && w.polygon[0][0]===w.polygon[w.polygon.length-1][0] && w.polygon[0][1]===w.polygon[w.polygon.length-1][1];
    console.log(` wall ${w.kind} form=${w.form} halfRing=${w.halfRing} poly=${w.polygon.length}(closedFirstLast=${closed}) closedPoly=${w.closedPolygon&&w.closedPolygon.length} claimLine=${w.claimLine&&w.claimLine.length} band=${w.band}`);
    console.log('   gates=',JSON.stringify((w.gates||[]).slice(0,3)).slice(0,300),' n=',(w.gates||[]).length);
    console.log('   waterGates n=',(w.waterGates||[]).length);
    console.log('   runs n=',(w.runs||[]).length,' sample=',JSON.stringify((w.runs||[])[0]).slice(0,240));
    console.log('   bandParts=',JSON.stringify(w.bandParts).slice(0,240));
    console.log('   wallLanes n=',(w.wallLanes||[]).length,' sample=',JSON.stringify((w.wallLanes||[])[0]).slice(0,240));
    console.log('   laneRuns=',JSON.stringify(w.laneRuns).slice(0,200));
    console.log('   abuttedRuns=',JSON.stringify(w.abuttedRuns).slice(0,200));
    console.log('   ditch=',JSON.stringify(w.ditch).slice(0,160));
  }
  const bodies=drawnBodySet(fabric);
  console.log(' bodies:',bodies.length);
  const p=fabric.parcels[0];
  console.log(' parcel grainAngle=',p.grainAngle,' plotLine=',JSON.stringify(p.plotLine).slice(0,160),' area=',p.area);
}
