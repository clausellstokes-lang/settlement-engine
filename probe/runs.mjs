import { sealed } from '../i12-tangential.mjs';
const wt = process.argv.find(a=>a.startsWith('--wt=')).slice(5);
const S = await sealed(wt);
const len=(l)=>{let s=0;for(let i=0;i<l.length-1;i++)s+=Math.hypot(l[i+1][0]-l[i][0],l[i+1][1]-l[i][1]);return s;};
for (const k of ['town','city','metropolis','polycentric','crossing']) {
  const { fabric } = S.buildOne(S.CORPUS.find(s=>s.key===k));
  for (const w of fabric.walls) {
    const runs=(w.runs||[]).filter(r=>r.line&&r.line.length>=2);
    const rl=runs.reduce((a,r)=>a+len(r.line),0);
    const pl=len(w.polygon);
    const cl=w.closedPolygon?len(w.closedPolygon):null;
    console.log(`${k}/${w.kind} halfRing=${w.halfRing}  polyLen=${pl.toFixed(1)} closedLen=${cl&&cl.toFixed(1)} runs=${runs.length}/${(w.runs||[]).length} runLen=${rl.toFixed(1)} (${(100*rl/pl).toFixed(1)}% of polygon)  gates=${(w.gates||[]).length} rampart=${!!w.rampart}`);
    console.log(`     run types: ${[...new Set((w.runs||[]).map(r=>r.type))].join(',')}   run pt-counts: ${(w.runs||[]).map(r=>(r.line||[]).length).join(',')}`);
  }
}
