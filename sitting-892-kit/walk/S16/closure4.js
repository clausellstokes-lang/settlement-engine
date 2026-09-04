const {execSync}=require('child_process');const path=require('path');
const R=process.argv[2],SHA=process.argv[3];const starts=process.argv.slice(4);const seen=new Map();const q=[...starts];
while(q.length){const f=q.shift();if(seen.has(f))continue;let src;try{src=execSync(`git -C ${R} show ${SHA}:${f}`,{encoding:'utf8',stdio:['ignore','pipe','ignore']});}catch(e){continue;}seen.set(f,Buffer.byteLength(src));
for(const m of src.matchAll(/^\s*(?:import|export)[^'"]*?from\s*['"](\.[^'"]+)['"]/gm)){q.push(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));}
for(const m of src.matchAll(/^\s*import\s*['"](\.[^'"]+)['"]/gm)){q.push(path.posix.normalize(path.posix.join(path.posix.dirname(f),m[1])));}}
let bytes=0;for(const b of seen.values())bytes+=b;const leaf=starts[0];const lb=seen.get(leaf)||0;console.log(SHA,'closure of',starts.join('+'),'=',seen.size,'modules',bytes,'bytes; excluding leaf:',seen.size-(seen.has(leaf)?1:0),'modules',((bytes-lb)/1024).toFixed(0),'KB',((bytes-lb)/1048576).toFixed(2),'MB');
