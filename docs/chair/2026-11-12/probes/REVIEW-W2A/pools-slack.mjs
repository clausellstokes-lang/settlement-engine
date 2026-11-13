import { corpusPools, poolArm, readJson, POOL_TABLE_REL } from '/tmp/claude-0/-home-user-settlement-engine/14952270-4ad3-50ea-a235-97473a838194/scratchpad/plant/tests/lint/factLayers.shared.mjs';
const T=readJson(POOL_TABLE_REL).rows; const pools=await corpusPools();
const low=Object.fromEntries(Object.entries(T).map(([k,v])=>[k, v.layer==='W'?v:{...v,layer:1}]));
const r=await poolArm(pools, low);
const out=[]; for(const [id,vs] of Object.entries(r.violations)){ const max=Math.max(...vs.map(v=>+v.match(/layer (\d+)/)[1])); out.push([id,T[id].layer,max,T[id].src,vs.join('; ')]); }
console.log('pools with a declared/named fact:',out.length,'of',Object.values(T).filter(v=>v.layer!=='W').length);
console.log('slack hist (table layer - max fact layer):', JSON.stringify(out.reduce((h,o)=>{const k=o[1]-o[2];h[k]=(h[k]||0)+1;return h;},{})));
for(const o of out.filter(o=>o[1]-o[2]===1).slice(0,5)) console.log('TIGHT',o.join(' | ').slice(0,250));
for(const o of out.filter(o=>o[1]-o[2]>=2).slice(0,8)) console.log('SLACK',o.join(' | ').slice(0,250));
