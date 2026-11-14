// deskclass.mjs <deskdiff.jsonl> <births.gz> [lensRx]: per tip template newly printed in a town (NEW/CHANGED), the
// distribution of the facts that decide it: crises, badge, military band, forces combination, monster threat, route.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R=process.env.TREE+'/src';
const { standingDefenseForces } = await import(R+'/domain/institutions/defenseInstitutionBuckets.js');
const { scoreBand } = await import(R+'/domain/display/defenseScoreBands.js');
const rows=fs.readFileSync(process.argv[2],'utf8').trim().split('\n').map(JSON.parse).filter(r=>r.tip&&(!process.argv[4]||new RegExp(process.argv[4]).test(r.k)));
const want=new Set(rows.map(r=>r.seed)); const rec=new Map();
const rl=readline.createInterface({input:fs.createReadStream(process.argv[3]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const l of rl){ const i=l.indexOf('","s"'); const seed=l.slice(9,i); if(want.has(seed)) rec.set(seed, JSON.parse(l).s); }
const g=new Map(); const inc=(o,k)=>o[k]=(o[k]||0)+1;
for(const r of rows){ const s=rec.get(r.seed); const esc=s.name.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); const T=r.tip.replace(new RegExp(esc,'g'),'{S}').replace(/\b(thorp|hamlet|village|town|city|metropolis)\b/g,'<tier>');
  const key=r.k+' | '+T.slice(0,120); const e=g.get(key)||{n:0,cr:{},bd:{},mil:{},fo:{},th:{},seeds:[]}; e.n++; e.seeds.push(r.seed);
  const f=standingDefenseForces(s); const dp=s.defenseProfile||{}; (Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type).forEach(t=>inc(e.cr,t)); if(!(s.stress&&(s.stress.length??1))) inc(e.cr,'calm');
  inc(e.bd,dp.readiness?.label); inc(e.mil,scoreBand(dp.scores?.military)); inc(e.fo,(f.walls.present?'W':'-')+(f.garrison.present?'G':'-')+(f.militia.present?'M':'-')+(f.watch.present?'w':'-')+(f.mercenary.present?'$':'-')); inc(e.th,s.config?.monsterThreat); g.set(key,e); }
const J=(o)=>Object.entries(o).sort((a,b)=>b[1]-a[1]).map(([k,v])=>k+':'+v).join(' ');
for(const [k,e] of [...g].sort((a,b)=>a[0].localeCompare(b[0]))) console.log(`${e.n}\t${k}\n\tcrises ${J(e.cr)}\n\tbadge ${J(e.bd)} | mil ${J(e.mil)} | forces(WGMw$) ${J(e.fo)} | threat ${J(e.th)}\n\te.g. ${e.seeds.slice(0,3).join(' ')}`);
