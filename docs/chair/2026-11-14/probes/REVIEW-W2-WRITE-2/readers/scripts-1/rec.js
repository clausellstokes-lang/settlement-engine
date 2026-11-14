// usage: node rec.js town 'expr using t'
const fs=require('fs'),z=require('zlib');const R=process.env.R;
const [town,expr]=process.argv.slice(2);
const t=JSON.parse(z.gunzipSync(fs.readFileSync(`${R}/records/${town}.json.gz`)));
const v=eval(expr);console.log(typeof v==='string'?v:JSON.stringify(v));
