const {execSync}=require('child_process');const path=require('path');
const R=process.argv[2],SHA=process.argv[3],start=process.argv[4];
const seen=new Set();const q=[start];
while(q.length){const f=q.shift();if(seen.has(f))continue;seen.add(f);let src;try{src=execSync(`git -C ${R} show ${SHA}:${f}`,{encoding:'utf8',stdio:['ignore','pipe','ignore']});}catch(e){console.log('MISSING',f);continue;}
for(const m of src.matchAll(/^\s*(?:import|export)[^'"]*?from\s*['"](\.[^'"]+)['"]/gm)){q.push(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));}
for(const m of src.matchAll(/^\s*import\s*['"](\.[^'"]+)['"]/gm)){q.push(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));}}
console.log('closure size',seen.size);const dirty=process.argv.slice(5);const hit=[...seen].filter(f=>dirty.includes(f));console.log('dirty∩closure:',JSON.stringify(hit));
