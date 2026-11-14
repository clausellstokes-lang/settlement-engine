// parts (all fields) before/after adding one house; and the profile scores. TREE=<tree> node why2.mjs <rec.json.gz> "<house>" [category]
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { defencePartsOf, generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(process.argv[2])));
const s1={...s,institutions:[...s.institutions,{name:process.argv[3],category:process.argv[4]||'Religious'}]};
const r=(x)=>JSON.stringify(x,(k,v)=>typeof v==='number'?Math.round(v*100)/100:v);
const pa=defencePartsOf(s), pb=defencePartsOf(s1);
const ka=Object.fromEntries(pa.map(p=>[p.id,p])), kb=Object.fromEntries(pb.map(p=>[p.id,p]));
for(const k of new Set([...Object.keys(ka),...Object.keys(kb)])) if(r(ka[k])!==r(kb[k])) console.log(k,'\n  A',r(ka[k]),'\n  B',r(kb[k]));
const A=generateDefenseProfile(s,keepOfRecord(s.economicState)).scores, B=generateDefenseProfile(s1,keepOfRecord(s.economicState)).scores;
console.log('scores A',r({...A,traditions:undefined}),'\nscores B',r({...B,traditions:undefined}));
