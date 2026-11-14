// facts.mjs TREE IN OUT: one row per town: the facts the cure's conditions read, from the record (jsonl).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { standingDefenseForces } = await import(R+'/domain/institutions/defenseInstitutionBuckets.js');
const { scoreBand } = await import(R+'/domain/display/defenseScoreBands.js');
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const out=fs.createWriteStream(process.env.OUT);
for await (const l of rl){ if(!l) continue; const {seed,s}=JSON.parse(l); const dp=s.defenseProfile||{}; const es=s.economicState||{};
  const f=standingDefenseForces(s); const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]);
  const sc=dp.scores||{};
  out.write(JSON.stringify({ seed, name:s.name, tier:s.tier, pop:s.population, stress:st.map(x=>x.type),
    walls:f.walls.present, garrison:f.garrison.present, militia:f.militia.present, watch:f.watch.present, merc:f.mercenary.present,
    forceNames:Object.fromEntries(Object.entries(f).filter(([k,v])=>v.present).map(([k,v])=>[k,v.names])),
    mil: typeof sc.military==='number'?Math.round(sc.military)+' '+scoreBand(sc.military):null,
    readiness: dp.readiness?.score!=null? Math.round(dp.readiness.score)+' '+scoreBand(dp.readiness.score):null,
    chainMil: dp.chainModifiers?.military, chainEco: dp.chainModifiers?.economic, threat:s.config?.monsterThreat,
    guard: es.safetyProfile?.guardEffectivenessDesc, terrain:s.config?.terrainType })+'\n'); }
out.end();
