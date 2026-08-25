import { sealed, tangentialCensus, thresholds } from '../i12-tangential.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
const quad=(x,y)=>`${y<500?'N':'S'}${x<500?'W':'E'}`;
for (const k of ['town','city','crossing','town-2','polycentric','metropolis','highwater','year-100']) {
  const { fabric } = S.buildOne(S.CORPUS.find(s=>s.key===k));
  for (const w of (fabric.walls||[]).filter(x=>x.kind!=='old-core')) {
    const r = tangentialCensus(fabric, w, S, { returnRows:true });
    if(!r.applicable) continue;
    const rows=r.rows||[];
    const cross=rows.filter(b=>b.verdict==='CROSSING');
    const byQ={}; for(const b of cross){const q=quad(b.c[0],b.c[1]); byQ[q]=(byQ[q]||0)+1;}
    const viol=rows.filter(b=>b.verdict&&b.verdict.startsWith('VIOLATION'));
    const vQ={}; for(const b of viol){const q=quad(b.c[0],b.c[1]); vQ[q]=(vQ[q]||0)+1;}
    const T=thresholds(fabric,w);
    const gates=(w.gates||[]).length, wg=(w.waterGates||[]).length;
    let per=0; for(let i=0;i<w.polygon.length-1;i++) per+=Math.hypot(w.polygon[i+1][0]-w.polygon[i][0],w.polygon[i+1][1]-w.polygon[i][1]);
    console.log(`\n${k}/${w.kind}  perimeter=${per.toFixed(0)}u  gates=${gates} waterGates=${wg}  (one gate per ${(per/Math.max(1,gates+wg)).toFixed(0)}u)`);
    console.log(`  CROSSINGS ${cross.length} by quadrant: ${JSON.stringify(byQ)}`);
    console.log(`  VIOLATIONS ${viol.length} by quadrant: ${JSON.stringify(vQ)}`);
    console.log(`  within reach ${r.withinReach}; tangential share inside=${r.c3Continuity.inside.tangentialShare} (median Δ ${r.c3Continuity.inside.medianDelta}°, n=${r.c3Continuity.inside.n})`
      + ` | outside=${r.c3Continuity.outside.tangentialShare} (median Δ ${r.c3Continuity.outside.medianDelta}°, n=${r.c3Continuity.outside.n})`);
  }
}
