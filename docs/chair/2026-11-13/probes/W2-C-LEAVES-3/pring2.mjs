import fs from 'node:fs'; import zlib from 'node:zlib';
const [corpus,A,B]=process.argv.slice(2); const a=await import(A+'/src/domain/display/defenseDisplay.js'), b=await import(B+'/src/domain/display/defenseDisplay.js');
const T={}; const ex=[];
for (const l of zlib.gunzipSync(fs.readFileSync(corpus)).toString().split('\n')) { if(!l) continue; const {seed,s}=JSON.parse(l);
  const x=a.deriveCriminalStructure(s), y=b.deriveCriminalStructure(s); const k=`${x?.key} -> ${y?.key}`; T[k]=(T[k]||0)+1;
  if(x?.key!==y?.key) ex.push(`${seed} | powers: ${(s.powerStructure?.factions||[]).filter(f=>f.category==='criminal').map(f=>f.faction+(f.isGoverning?'[gov]':'')).join(', ')} | houses: ${(s.institutions||[]).map(i=>i.name).filter(n=>/criminal|thie|gang|guild \(|underground|black market|smuggl/i.test(n)).join(', ')}`);
}
console.log(T); console.log(ex.filter((_,i)=>i%6===0).slice(0,14).join('\n'));
