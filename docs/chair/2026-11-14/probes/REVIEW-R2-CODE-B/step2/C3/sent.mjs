import fs from 'node:fs'; import zlib from 'node:zlib';
const S=['(arcane underground)','(commercial crime)','(covert)','(criminal governance)','(informal)','(lawless)','(religious fraud)','(smuggling)','(state apparatus)','(street gang)','(thieves guild)'];
const f=process.argv[2]; const lines=zlib.gunzipSync(fs.readFileSync(f)).toString().trim().split('\n');
let towns=0, rows=0, r720=0; const ex=[];
for(const l of lines){ const {seed,s}=JSON.parse(l); let n=0;
  const av=s.availableServices||{}; for(const [k,arr] of Object.entries(av)) if(Array.isArray(arr)) for(const x of arr) if(x&&S.includes(x.institution)){n++; if(ex.length<6) ex.push(seed+' '+k+' '+x.name+' '+x.institution);}
  if(n){towns++; rows+=n; if(/^r2[rs]-/.test(seed)) r720++;} }
console.log({total:lines.length,towns,rows,r720}); console.log(ex.join('\n'));
