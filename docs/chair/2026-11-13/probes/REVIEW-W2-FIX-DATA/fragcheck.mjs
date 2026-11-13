// REVIEW-W2-FIX-DATA: towns printing an institution desc fragment, split by a record test. node fragcheck.mjs <corpus> <instRe> <fragRe> <testJs>
import fs from 'node:fs'; import zlib from 'node:zlib';
const [C,ir,fr,tj]=process.argv.slice(2); const I=new RegExp(ir,'i'), F=new RegExp(fr,'i'); const test=eval(tj);
const L=zlib.gunzipSync(fs.readFileSync(C)).toString().trim().split('\n'); let pass=0, fail=[];
for(const l of L){ const {seed,s}=JSON.parse(l); const inst=s.institutions.find(i=>I.test(i.name)&&F.test(i.desc||'')); if(!inst) continue; if(test(s)) pass++; else fail.push(seed+' ['+s.config.tradeRouteAccess+'/'+(s.config.terrainType||'')+']'); }
console.log('print',pass+fail.length,'| true by test',pass,'| false',fail.length,'|',fail.slice(0,8).join(' '));
