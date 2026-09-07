import { readFileSync } from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const A=JSON.parse(readFileSync(`${SC}/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json`,'utf8'));
const B=JSON.parse(readFileSync(`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`,'utf8'));
const L=JSON.parse(readFileSync(`${SC}/capacity-horizon/artifacts/probe-30y-12s-lit.json`,'utf8'));
console.log('subsystems non-stateKeys keys:', Object.keys(A.subsystems).filter(k=>k!=='stateKeys'));
const ra=A.subsystems.rules, rb=B.subsystems.rules;
const keys=[...new Set([...Object.keys(ra),...Object.keys(rb)])].sort();
let d=0;
for(const k of keys){const x=JSON.stringify(ra[k]),y=JSON.stringify(rb[k]);if(x!==y){console.log('RULES DIFF',k,x,'|',y);d++;}}
console.log('rules keys:',keys.length,'diffs:',d);
console.log('demographicsEnabled:',ra.demographicsEnabled,rb.demographicsEnabled, L.subsystems.rules.demographicsEnabled);
for(const k of Object.keys(A.subsystems).filter(k=>k!=='stateKeys'&&k!=='rules')){
  const x=JSON.stringify(A.subsystems[k]), y=JSON.stringify(B.subsystems[k]);
  console.log(k, x===y?'IDENTICAL':`DIFF\n  300y=${String(x).slice(0,400)}\n  600y=${String(y).slice(0,400)}`);
}
