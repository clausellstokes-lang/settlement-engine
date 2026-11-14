// deskfacts.mjs <deskdiff.jsonl> <births.gz> <lensRx> <textRx> : every moved desk row whose tip (or line, with LINE=1)
// sentence matches textRx, with the town's facts: tier, crises, readiness label/score, military score+band, the
// standing forces (tip tree's own reader), walls, monster threat, route, terrain, the defense header's status.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { standingDefenseForces } = await import(R+'/domain/institutions/defenseInstitutionBuckets.js');
const { scoreBand } = await import(R+'/domain/display/defenseScoreBands.js');
const [df, bf, lrx, trx] = process.argv.slice(2); const LR=new RegExp(lrx), TR=new RegExp(trx); const useLine=!!process.env.LINE;
const rows=fs.readFileSync(df,'utf8').trim().split('\n').map(JSON.parse).filter(r=>LR.test(r.k)&&TR.test((useLine?r.line:r.tip)||''));
const want=new Set(rows.map(r=>r.seed)); const rec=new Map();
const rl=readline.createInterface({input:fs.createReadStream(bf).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const l of rl){ const i=l.indexOf('","s"'); const seed=l.slice(9,i); if(want.has(seed)) rec.set(seed, JSON.parse(l).s); }
const F=(s)=>{ const f=standingDefenseForces(s); const dp=s.defenseProfile||{}; const st=(Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).join('+')||'calm';
  const fo=Object.entries(f).filter(([k,v])=>v.present).map(([k,v])=>k+'('+v.names.join(',')+')').join(' ');
  return `${s.tier} ${s.population} | ${st} | badge ${dp.readiness?.label} ${Math.round(dp.readiness?.score)} | mil ${Math.round(dp.scores?.military)} ${scoreBand(dp.scores?.military)} | ${fo||'NO FORCE'} | threat ${s.config?.monsterThreat} | route ${s.config?.tradeRouteAccess} ${s.config?.terrainType}`; };
for(const r of rows){ const s=rec.get(r.seed); console.log(`${r.seed} [${r.kind}] ${F(s)}\n    TIP: ${(r.tip||'(silent)').slice(0,240)}\n    WAS: ${(r.line||'(silent)').slice(0,160)}`); }
console.error('rows',rows.length);
