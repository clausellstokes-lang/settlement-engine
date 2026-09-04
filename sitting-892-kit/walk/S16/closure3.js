const {execSync}=require('child_process');const path=require('path');
const R=process.argv[2],SHA=process.argv[3],start=process.argv[4];const seen=new Map();const q=[start];
while(q.length){const f=q.shift();if(seen.has(f))continue;let src;try{src=execSync(`git -C ${R} show ${SHA}:${f}`,{encoding:'utf8',stdio:['ignore','pipe','ignore']});}catch(e){continue;}seen.set(f,Buffer.byteLength(src));
for(const m of src.matchAll(/^\s*(?:import|export)[^'"]*?from\s*['"](\.[^'"]+)['"]/gm)){q.push(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));}
for(const m of src.matchAll(/^\s*import\s*['"](\.[^'"]+)['"]/gm)){q.push(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));}}
let bytes=0;for(const [f,b] of seen){bytes+=b;console.log(b,f);}console.log('TOTAL',seen.size,'modules',bytes,'bytes');
