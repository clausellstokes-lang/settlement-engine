import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const f=process.argv[2]; const rl=readline.createInterface({input:fs.createReadStream(f).pipe(zlib.createGunzip()),crlfDelay:Infinity});
let towns=0,rows=0,tog=0; const ex=[];
for await(const l of rl){ const {seed,s}=JSON.parse(l); const ins=(s.institutions||[]).filter(i=>i.source==='forced'); if(ins.length){towns++; rows+=ins.length; tog+=ins.filter(i=>i.forcedByToggle===true).length; if(ex.length<8) ex.push(seed+': '+ins.map(i=>i.name+'['+Object.keys(i).filter(k=>/forced/i.test(k)).join(',')+']').join('; '));} }
console.log({towns,rows,tog}); console.log(ex.join('\n'));
