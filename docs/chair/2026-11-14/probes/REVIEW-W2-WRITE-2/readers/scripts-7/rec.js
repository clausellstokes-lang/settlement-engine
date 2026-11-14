// usage: node rec.js town 'expr using t'
const fs=require('fs'),z=require('zlib');const [town,expr]=process.argv.slice(2);
const R='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip';
const t=JSON.parse(z.gunzipSync(fs.readFileSync(`${R}/records/${town}.json.gz`)));
const r=eval(expr);console.log(typeof r==='string'?r:JSON.stringify(r,null,0).slice(0,4000));
