// parts before/after adding one house: TREE=<tree> node why.mjs <record.json.gz> "<house name>" [category]
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { defencePartsOf } = await import(T+'/src/generators/defenseGenerator.js');
const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(process.argv[2])));
const add=process.argv[3]; const s1={...s,institutions:[...s.institutions,{name:add,category:process.argv[4]||'Religious'}]};
const show=(x)=>Object.fromEntries(defencePartsOf(x).map(p=>[p.id,{g:p.group,pts:Math.round(p.points*10)/10,dims:Object.fromEntries(Object.entries(p.dims||{}).map(([k,v])=>[k,Math.round(v*10)/10]))}]));
const a=show(s), b=show(s1);
for(const k of new Set([...Object.keys(a),...Object.keys(b)])) if(JSON.stringify(a[k])!==JSON.stringify(b[k])) console.log(k, JSON.stringify(a[k]), '=>', JSON.stringify(b[k]));
console.log('roster', s.institutions.map(i=>i.name).join(' | '));
