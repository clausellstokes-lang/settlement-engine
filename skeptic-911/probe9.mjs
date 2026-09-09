import fs from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const {settlementShapeOf}=await import(`${D}/scripts/soak/register.mjs`);
const b=JSON.parse(fs.readFileSync(`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`,'utf8'));
const yp=b.yearlyPopulations, ids=['soak-a','soak-b','soak-c','soak-d'];
for(let s=0;s<4;s++){
  const series=yp.map(r=>r[s]);
  const fin=series[599], cen=series[499];
  console.log(`${ids[s]}: y500=${cen} final=${fin} |d|=${Math.abs(fin-cen)} 5%*final=${(0.05*fin).toFixed(2)} shape=${settlementShapeOf(series)} margin=${(0.05*fin-Math.abs(fin-cen)).toFixed(2)}`);
}
