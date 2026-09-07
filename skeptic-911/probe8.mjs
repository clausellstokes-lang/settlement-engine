import fs from 'node:fs';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const {evaluateReceipt}=await import(`${D}/scripts/soak/evaluate.mjs`);
const tw=await import(`${D}/scripts/soak/tripwires.mjs`);
for(const [n,p] of [['M1_600y',`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`],
                    ['M2_dark',`${SC}/capacity-horizon/artifacts/probe-30y-12s-dark.json`],
                    ['907_300y',`${SC}/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json`]]){
  const r=JSON.parse(fs.readFileSync(p,'utf8'));
  const e=evaluateReceipt(r);
  console.log(n,'annotated.fullInstrument=',e.annotated?.fullInstrument,' annotated.notExecutable=',JSON.stringify(e.annotated?.notExecutable));
}
// horizon/plateau constants
const src=fs.readFileSync(`${D}/scripts/soak/tripwires.mjs`,'utf8');
for(const k of ['PLATEAU_HORIZON_YEARS','FLOOR_THAW_HORIZON_YEARS','MOVING_SHARE_FLOOR','MOTION_FLOOR_01']){
  const m=src.match(new RegExp(`${k}\\s*=\\s*([^;\\n]+)`)); console.log(k,'=',m?m[1].trim():'NOT FOUND');
}
const reg=fs.readFileSync(`${D}/scripts/soak/register.mjs`,'utf8');
for(const k of ['CENTURY','HALF_CENTURY','RUNAWAY_MULTIPLE','FLOORED_START_FRACTION','FLOORED_FLATNESS','PLATEAU_FLATNESS']){
  const m=reg.match(new RegExp(`const ${k}\\s*=\\s*([^;\\n]+)`)); console.log(k,'=',m?m[1].trim():'NOT FOUND');
}
