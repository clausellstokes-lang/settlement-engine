import fs from 'fs'; import z from 'zlib';
const T='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip';
const R='/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip';
const m=await import(T+'/src/domain/rulingPowerCoup.js');
console.log(Object.keys(m));
const town=process.argv[2];
const t=JSON.parse(z.gunzipSync(fs.readFileSync(`${R}/records/${town}.json.gz`)));
const c=m.coupContenders(t); console.log(JSON.stringify(c).slice(0,1500)); console.log(m.coupRiskLabel(c));
