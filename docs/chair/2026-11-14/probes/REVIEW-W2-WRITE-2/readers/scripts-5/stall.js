const {rec,L,crises}=require("./lib");
const LOC={livestock:[/grazing|herd|shepherd|cattle|stockyard|livestock/i,/^livestock$/i],clay:[/potter|brick|clay pit/i,/^(clay|pottery)$/i],fuel:[/charcoal|coal|woodcutter|peat|collier/i,/fuel|coal|peat|charcoal/i],food_processing:[/^mills?\b|mills \(|baker|butcher|granary|brewer/i,/flour|baked|preserved/i],warehouse_logistics:[/warehouse/i,/goods storage|warehous/i],hunting:[/hunter|hunting/i,/game|hides|fur/i],precious_metals_mining:[/mine|miner/i,/precious|gold|silver/i],stone:[/quarry|mason/i,/^stone$/i],smelting:[/smelter/i,/^iron bars|pig iron/i],cartography:[/cartograph|map/i,/maps/i],textiles:[/weaver|textile/i,/processed textiles/i],iron:[/iron mine|\bmine\b/i,/^iron$/i]};
module.exports=i=>{const rows=[];for(const p of L[i].prints){const t=rec(p.town);const names=t.institutions.map(x=>x.name);const lp=t.economicState.localProduction||[];
 const toks=[];for(const c of t.economicState.activeChains||[])for(const u of c.upstreamMissing||[])toks.push({chain:c.label,u,status:c.status});
 const absent=toks.filter(x=>{const r=LOC[x.u];if(!r)return true;return !(names.some(n=>r[0].test(n))||lp.some(v=>r[1].test(v)));});
 rows.push({town:p.town,tier:p.tier,cr:crises(t),toks,absent,route:t.config.tradeRouteAccess,imp:t.economicState.primaryImports||[],pr:(p.page[0]||{}).printed});}
return rows;};
if(require.main===module){const i=+process.argv[2];const rows=module.exports(i);const f=rows.filter(r=>!r.absent.length);
console.log(L[i].id,"n",rows.length,"allMissingPresentLocally",f.length,"isolated",rows.filter(r=>r.route==="isolated").length,"noImports",rows.filter(r=>!r.imp.length).length,"siege",rows.filter(r=>r.cr.includes("under_siege")).length);
f.forEach(r=>console.log("  F",r.town,r.tier,r.cr.join("+"),JSON.stringify(r.toks.map(x=>x.chain+"<-"+x.u))));
rows.filter(r=>r.route==="isolated"||!r.imp.length).forEach(r=>console.log("  iso/noimp",r.town,r.route,r.imp.length,r.cr.join("+")));}
