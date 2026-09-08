import { readFileSync } from 'node:fs';
const SC='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad';
const A=JSON.parse(readFileSync(`${SC}/capacity/artifacts/research-lit-4s.cases/research-lit-4s-300y-4s-seed1.json`,'utf8'));
const B=JSON.parse(readFileSync(`${SC}/capacity-horizon/artifacts/horizon-600y-4s-lit.json`,'utf8'));
const flat=(o,p='',out={})=>{for(const[k,v]of Object.entries(o||{})){const key=p?`${p}.${k}`:k;if(v&&typeof v==='object'&&!Array.isArray(v))flat(v,key,out);else out[key]=Array.isArray(v)?`[array len=${v.length}]`:v;}return out;};
console.log('== TOP-LEVEL KEY SETS ==');
const ka=Object.keys(A), kb=Object.keys(B);
console.log('only in 300y:',ka.filter(k=>!kb.includes(k)).join(', '));
console.log('only in 600y:',kb.filter(k=>!ka.includes(k)).join(', '));
console.log('\n== SCALARS OF INTEREST ==');
for(const k of ['schemaVersion','kind','caseId','seed','years','settlements','preset','presetId','generatorVersion','sourceSha','now','divergenceYears']){
  console.log(k.padEnd(20), JSON.stringify(A[k]), '|', JSON.stringify(B[k]));
}
console.log('\n== subsystems (flattened) ==');
const sa=flat(A.subsystems||{}), sb=flat(B.subsystems||{});
const keys=[...new Set([...Object.keys(sa),...Object.keys(sb)])].sort();
let diffs=0;
for(const k of keys){const x=JSON.stringify(sa[k]),y=JSON.stringify(sb[k]);if(x!==y){console.log('DIFF',k,x,'|',y);diffs++;}}
console.log('subsystems keys compared:',keys.length,'diffs:',diffs);
console.log('\n== identity / config blocks present ==');
for(const k of ['identity','config','configuration','invocation','inputs','runDurationsMs']){
  if(A[k]!==undefined||B[k]!==undefined) console.log(k,'300y=',JSON.stringify(A[k]).slice(0,300),'\n   600y=',JSON.stringify(B[k]).slice(0,300));
}
