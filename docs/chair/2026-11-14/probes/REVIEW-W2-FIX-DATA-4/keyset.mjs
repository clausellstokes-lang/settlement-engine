// Every key path (array indices folded) present in corpus B and absent from every town of corpus A.  A= B= node keyset.mjs
import fs from 'node:fs'; import zlib from 'node:zlib';
const keys=(f)=>{ const S=new Set(); for(const l of zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n')){ const {s}=JSON.parse(l);
  (function w(o,p){ if(o&&typeof o==='object'){ if(Array.isArray(o)) o.forEach(x=>w(x,p+'[]')); else for(const k of Object.keys(o)){ const q=p+'.'+k; S.add(q); w(o[k],q);} } })(s,''); } return S; };
const A=keys(process.env.A), B=keys(process.env.B);
const nw=[...B].filter(k=>!A.has(k)), gone=[...A].filter(k=>!B.has(k));
console.log('new key paths',nw.length); for(const k of nw.slice(0,40)) console.log(' +',k); console.log('gone key paths',gone.length); for(const k of gone.slice(0,40)) console.log(' -',k);
