// military's sources in small places: per birth, the military score, population, and each part's military points (score pts).
//   TREE=<tree> node milparts.mjs <recdir> <seedlist> <out.ndjson>
import fs from 'node:fs'; import zlib from 'node:zlib'; const T=process.env.TREE;
const { generateDefenseProfile } = await import(T+'/src/generators/defenseGenerator.js');
const { keepOfRecord } = await import(T+'/src/domain/facts/keep.js');
const { scoreBand } = await import(T+'/src/domain/display/defenseScoreBands.js');
const [dir, sf, of]=process.argv.slice(2); const o=fs.createWriteStream(of);
// the parts' dims: re-run the generator's own internals through defencePartsOf is in readiness points; we want score points on mil.
const G = await import(T+'/src/generators/defenseGenerator.js');
for (const seed of fs.readFileSync(sf,'utf8').trim().split('\n')) {
  const f=`${dir}/${seed}.json.gz`; if(!fs.existsSync(f)) continue; const s=JSON.parse(zlib.gunzipSync(fs.readFileSync(f)));
  const k=keepOfRecord(s.economicState); const p=generateDefenseProfile(s,k);
  const parts=G.defencePartsOf(s,k).map(x=>[x.id,x.points,x.feeds]);
  o.write(JSON.stringify({seed,tier:s.tier,pop:s.population,mil:p.scores.military,band:scoreBand(p.scores.military),stress:(Array.isArray(s.stress)?s.stress:[s.stress]).map(x=>x?.type).filter(Boolean),terrain:s.config?.terrainType,route:s.config?.tradeRouteAccess,milDial:s.config?.priorityMilitary,houses:(s.institutions||[]).map(i=>i.name).filter(n=>/levy|militia|watch|garrison|barrack|palisade|wall|charter|mercen|warden|hireling/i.test(n)),parts})+'\n');
}
o.end();
