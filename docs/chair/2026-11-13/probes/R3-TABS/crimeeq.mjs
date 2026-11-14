import fs from 'node:fs'; import zlib from 'node:zlib';
const A=/[.!?]["')\]]?(?=\s|$)/g, B=/[.!?][\x22\x27)\]]?(?=\s|$)/g;
let n=0,diff=0;
for(const f of process.argv.slice(2)) for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')){
  const {s}=JSON.parse(l);
  const walk=(o)=>{ if(typeof o==='string'){ n++; const a=[...o.matchAll(A)].map(m=>m.index+':'+m[0]).join(), b=[...o.matchAll(B)].map(m=>m.index+':'+m[0]).join(); if(a!==b) diff++; } else if(o&&typeof o==='object') for(const v of Object.values(o)) walk(v); };
  walk(s);
}
console.log('strings',n,'differ',diff);
