import { buildSubstrate, sampleAt } from '../../src/domain/townMap/fabric/substrate.js';
import { deriveCliffs, CLIFF } from '../../src/domain/townMap/fabric/cliffs.js';
import { makeWalledFixture } from '../../tests/fixtures/townMapFixtures.js';
const fx=(seed,t)=>makeWalledFixture({_seed:seed,config:{terrainType:t,tradeRouteAccess:'moderate'}});
for (const t of ['hills','mountain']) {
  const sub = buildSubstrate(fx(`kind-${t}`,t), t, {seed:`kind-${t}`}, {});
  const c = deriveCliffs(sub);
  const R = CLIFF.probeCells * sub.cell;
  const shares=[]; let vAll=0, vAgree=0;
  for (const e of c.edges) {
    let n=0, ag=0;
    for (let i=1;i+1<e.line.length;i++){
      const a=e.line[i-1],b=e.line[i+1],p=e.line[i];
      let nx=-(b[1]-a[1]), ny=b[0]-a[0]; const l=Math.sqrt(nx*nx+ny*ny)||1; nx/=l; ny/=l;
      const g1=sampleAt(sub,sub.slope,p[0]+nx*R,p[1]+ny*R), g2=sampleAt(sub,sub.slope,p[0]-nx*R,p[1]-ny*R);
      const up=g1<g2;
      const hG=sampleAt(sub,sub.height, up?p[0]+nx*R:p[0]-nx*R, up?p[1]+ny*R:p[1]-ny*R);
      const hC=sampleAt(sub,sub.height, up?p[0]-nx*R:p[0]+nx*R, up?p[1]-ny*R:p[1]+ny*R);
      n++; if (((hG>hC)?'brink':'foot')===e.kind) ag++;
    }
    if(n) { shares.push(ag/n); vAll+=n; vAgree+=ag; }
  }
  shares.sort((a,b)=>a-b);
  const q=(p)=>shares[Math.min(shares.length-1,Math.floor(p*(shares.length-1)))];
  console.log(`${t}: ${c.edges.length} edges | per-edge agreement min=${q(0).toFixed(3)} p10=${q(0.1).toFixed(3)} p50=${q(0.5).toFixed(3)} max=${q(1).toFixed(3)} | edges with majority>0.5: ${shares.filter(s=>s>0.5).length}/${shares.length} | overall vertex agreement ${(vAgree/vAll*100).toFixed(1)}% (${vAgree}/${vAll})`);
}
