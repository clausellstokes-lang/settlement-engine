// one record's parts in SCORE points per dim at a tree (debug copy of the generator, untracked, removed after), with the
// roster's defence houses. TREE=<tree> node parts2.mjs <rec.json.gz> [dim]
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const src=`${T}/src/generators/defenseGenerator.js`, dbg=`${T}/src/generators/defenseGenerator.__dbg.js`;
fs.writeFileSync(dbg, fs.readFileSync(src,'utf8')+'\nexport { computeDefenseScores };\n');
try {
  const { computeDefenseScores } = await import(dbg);
  const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
  const [f, dim]=process.argv.slice(2); const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
  const k=keepOfRecord(s.economicState); const r=computeDefenseScores(s,k);
  const rd=(v)=>Math.round(v*10)/10;
  console.log('  pop', s.population, 'tier', s.tier, 'stress', JSON.stringify((Array.isArray(s.stress)?s.stress:[s.stress]).map(x=>x?.type).filter(Boolean)), 'keep', JSON.stringify(k), 'threat', s.config?.monsterThreat, 'relPri', s.config?.priorityReligion, 'magPri', s.config?.priorityMagic);
  console.log('  roster', (s.institutions||[]).map(i=>i.name).join(' | '));
  for (const p of r.parts) { const v = dim ? p.dims[dim] : null; if (dim && !v && !(p.raw||{})[dim]) continue; console.log('   ', p.group, p.id, dim ? `${dim}: raw ${rd((p.raw||{})[dim]||0)} -> ${rd(v||0)}` : JSON.stringify(Object.fromEntries(Object.entries(p.dims).map(([d,x])=>[d,rd(x)])))); }
  console.log('   crises', JSON.stringify(r.crises.map(c=>[c.name,c.took])), 'full', JSON.stringify(Object.fromEntries(Object.entries(r.full).map(([d,x])=>[d,rd(x)]))));
} finally { fs.unlinkSync(dbg); }
