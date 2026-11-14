// each part's dims (score points) before/after one change, at a tree: a debugging copy of the tree's generator is written
// beside it (untracked, removed after) exporting computeDefenseScores. TREE=<tree> node dims.mjs <rec.json.gz> add|ren "<house>" ["<to>"]
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const src=`${T}/src/generators/defenseGenerator.js`, dbg=`${T}/src/generators/defenseGenerator.__dbg.js`;
fs.writeFileSync(dbg, fs.readFileSync(src,'utf8')+'\nexport { computeDefenseScores };\n');
try {
  const { computeDefenseScores } = await import(dbg);
  const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
  const [f,op,h,to]=process.argv.slice(2); const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
  const s1= op==='add' ? {...s,institutions:[...s.institutions,{name:h,category:'x'}]} : {...s,institutions:s.institutions.map(i=>i.name===h?{...i,name:to}:i)};
  const k=keepOfRecord(s.economicState);
  const r0=computeDefenseScores(s,k), r1=computeDefenseScores(s1,k);
  const m=(r)=>Object.fromEntries(r.parts.map(p=>[p.id,Object.fromEntries(Object.entries(p.dims).map(([d,v])=>[d,Math.round(v*100)/100]))]));
  const a=m(r0), b=m(r1);
  for(const id of new Set([...Object.keys(a),...Object.keys(b)])) if(JSON.stringify(a[id])!==JSON.stringify(b[id])) console.log('  ',id, JSON.stringify(a[id]), '->', JSON.stringify(b[id]));
  console.log('   crises', JSON.stringify(r0.crises.map(c=>[c.name,c.points,c.took])), '->', JSON.stringify(r1.crises.map(c=>[c.name,c.points,c.took])));
  console.log('   full', JSON.stringify(r0.full), '->', JSON.stringify(r1.full));
} finally { fs.unlinkSync(dbg); }
