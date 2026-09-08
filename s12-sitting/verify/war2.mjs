import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const mod = await import(pathToFileURL(D+'/src/domain/worldPulse/warReceiptPools.js').href);
const shape=(v)=>Array.isArray(v)?`array[${v.length}] of ${[...new Set(v.map(x=>typeof x==='string'?'str':typeof x==='function'?'fn':Array.isArray(x)?'arr':typeof x))].join('|')}`:typeof v==='function'?'fn':typeof v==='object'&&v?`object{${Object.keys(v).length}}`:typeof v;
for(const [k,v] of Object.entries(mod)){ console.log(`## ${k}: ${shape(v)}`); if(v&&typeof v==='object'&&!Array.isArray(v)){ const ents=Object.entries(v); console.log(`   keys ${ents.length}: ` + ents.slice(0,40).map(([kk,vv])=>`${kk}=${shape(vv)}`).join(' · ')); } }
// count every string literal reachable as data, incl. inside objects and arrays of objects
let strs=0, arrs=0; const walk=(o)=>{ if(typeof o==='string'){strs++;} else if(Array.isArray(o)){arrs++; o.forEach(walk);} else if(o&&typeof o==='object'){ Object.values(o).forEach(walk);} };
for(const v of Object.values(mod)) walk(v); console.log(`reachable strings ${strs} · arrays ${arrs}`);
