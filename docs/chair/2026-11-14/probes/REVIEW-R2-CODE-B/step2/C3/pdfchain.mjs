import fs from 'node:fs'; import zlib from 'node:zlib';
const T=process.env.T, SURF=process.env.SURF; const D=await import(T+'/src/domain/display/institutionDisplayName.js');
const lines=zlib.gunzipSync(fs.readFileSync(process.argv[2])).toString().trim().split('\n');
const variant=process.argv[3]||'pdf-canon_dossier';
let rows=0,bad=0; const badT=new Set(); const ex={};
for(const l of lines){ const {seed,s}=JSON.parse(l); const f=`${SURF}/${seed}.${variant}.txt`; if(!fs.existsSync(f)) continue;
  const labels=new Set(); for(const i of s.institutions||[]){ for(const fn of ['institutionHouseLabel','institutionDisplayName']){ try{ labels.add(D[fn](i.name)); labels.add(D[fn](i)); }catch{} } labels.add(i.name); }
  for(const ln of fs.readFileSync(f,'utf8').split('\n')){ const p=ln.split(' » '); if(p.length!==3) continue; rows++;
    for(const h of p[1].split(' + ')){ if(!labels.has(h)){ bad++; badT.add(seed); const k=h; ex[k]=(ex[k]||[]); if(ex[k].length<3) ex[k].push(seed+': '+ln.slice(0,140)); } } } }
console.log({rows,bad,towns:badT.size}); for(const [k,v] of Object.entries(ex).sort((a,b)=>b[1].length-a[1].length).slice(0,25)) console.log(k,'::',v.join(' || '));
