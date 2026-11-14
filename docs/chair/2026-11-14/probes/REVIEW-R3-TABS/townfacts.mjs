// townfacts.mjs TREE IN SEEDS OUTDIR: a reader's fact sheet per town (JSON): size, crises with their summaries, forces
// (the desk's own reader), every institution, terrain/route/threat, readiness and the five threat scores with the band
// each prints, prosperity, government, factions, food record, the court/prison flags, criminal faction.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { standingDefenseForces } = await import(R+'/domain/institutions/defenseInstitutionBuckets.js');
const { scoreBand } = await import(R+'/domain/display/defenseScoreBands.js');
const want=new Set(fs.readFileSync(process.env.SEEDS,'utf8').trim().split('\n'));
const rl=readline.createInterface({input:fs.createReadStream(process.env.IN).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const l of rl){ const i=l.indexOf('","s"'); const seed=l.slice(9,i); if(!want.has(seed)) continue; const s=JSON.parse(l).s; const dp=s.defenseProfile||{}; const es=s.economicState||{};
  const f=standingDefenseForces(s); const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]);
  const o={ seed, name:s.name, tier:s.tier, population:s.population, crises:st.map(x=>({type:x.type,label:x.label,summary:x.summary})),
    config:{terrain:s.config?.terrainType, route:s.config?.tradeRouteAccess, monsterThreat:s.config?.monsterThreat, magic:s.config?.magicExists},
    forces:Object.fromEntries(Object.entries(f).map(([k,v])=>[k,v.present?v.names:null])),
    institutions:(s.institutions||[]).map(x=>x.name), readiness:dp.readiness, scores:Object.fromEntries(Object.entries(dp.scores||{}).map(([k,v])=>[k,`${Math.round(v)} ${scoreBand(v)}`])),
    prosperity:es.prosperity, government:s.powerStructure?.government?.name||s.powerStructure?.governmentType, factions:(s.powerStructure?.factions||[]).map(x=>`${x.faction}[${x.category} ${Math.round(x.power)}]`),
    food:{label:es.foodSecurity?.label, sources:es.foodSecurity?.foodRecord?.foodSources}, compound:es.compound?.inst, safety:{guardEff:es.safetyProfile?.guardEffectivenessDesc, safetyDesc:es.safetyProfile?.safetyDesc} };
  fs.writeFileSync(`${process.env.OUTDIR}/${seed}.facts.json`, JSON.stringify(o,null,1)); }
