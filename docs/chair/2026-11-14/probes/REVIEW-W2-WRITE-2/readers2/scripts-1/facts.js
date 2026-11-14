const z=require("zlib"),fs=require("fs");
const RD="/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/r/tip/records/";
const cache={};
function rec(t){if(!cache[t])cache[t]=JSON.parse(z.gunzipSync(fs.readFileSync(RD+t+".json.gz")));return cache[t];}
function facts(t){const R=rec(t);const D=R.defenseProfile||{};const I=D.institutions||{};
 const n=g=>(I[g]||[]).map(x=>x.name).join("/")||"-";
 const st=[].concat(R.stress||[]).filter(Boolean).map(s=>s.type).join(",")||"none";
 const E=R.economicState||{};const F=E.foodSecurity||{};
 const defInst=(R.institutions||[]).filter(i=>i.category==="Defense"||(i.tags||[]).includes("military")).map(i=>i.name+(i.status&&i.status!=="active"?"["+i.status+"]":""));
 return `${t} ${R.tier} pop${R.population} stress=${st} monster=${R.config&&R.config.monsterThreat} route=${R.config&&R.config.tradeRouteAccess} terr=${R.config&&R.config.terrainType} prosp=${E.prosperity} food=${F.label}/${F.storageMonths}mo/imp${F.importPct} ready=${D.readiness&&D.readiness.label}|walls=${n("walls")}|garr=${n("garrison")}|mil=${n("militia")}|watch=${n("watch")}|merc=${n("mercenary")}|defInst=${defInst.join("/")}`;}
module.exports={rec,facts};
if(require.main===module)for(const t of process.argv.slice(2))console.log(facts(t));
