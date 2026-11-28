import fs from 'node:fs'; import zlib from 'node:zlib';
const rd=(f)=>{ const m=new Map(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().split('\n')) if(l){ const i=l.indexOf(',"s":'); const seed=JSON.parse(l.slice(0,i)+'}').seed; m.set(seed,l.slice(i)); } return m; };
const a=rd(process.argv[2]), b=rd(process.argv[3]); let d=0; const ex=[]; for(const [k,v] of a) if(b.get(k)!==v){ d++; if(ex.length<5) ex.push(k);} console.log(`records differ: ${d} of ${a.size}`, ex.join(' '));
