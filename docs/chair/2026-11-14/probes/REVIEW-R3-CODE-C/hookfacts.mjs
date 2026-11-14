// hookfacts.mjs <tree> <births.gz> <regex>: towns where a string leaf matches; print tier, pop, crisis, the hookTruth facts of the tree, and the path
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [tree, file, re] = process.argv.slice(2); const RX=new RegExp(re);
const { settlementHookFacts } = await import(tree+'/src/domain/coherence/hookTruth.js');
const rl=readline.createInterface({input:fs.createReadStream(file).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); const hits=[];
  (function w(x,p){ if(typeof x==='string'){ if(RX.test(x)) hits.push(p+' = '+x.slice(0,140)); } else if(Array.isArray(x)) x.forEach((y,i)=>w(y,p+'['+i+']')); else if(x&&typeof x==='object') for(const k in x) w(x[k],p+'.'+k); })(s,'');
  if(!hits.length) continue; const f=settlementHookFacts(s);
  console.log([seed,s.tier,s.population,[].concat(s.stress||[]).map(x=>x.type).join('+')||'calm','walls='+f.hasWalls,'defKnown='+f.defenseKnown,'council='+f.ruledByCouncil,'gov='+s.powerStructure?.government,'phys='+f.hasPhysician,'roster='+f.rosterKnown, hits.length+' hits', hits[0]].join('\t')); }
