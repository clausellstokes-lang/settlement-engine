const {rec}=require("./lib");
const t=rec(process.argv[2]);
const ex=t.resourceAnalysis.exploitation;
for(const k of ["fullyExploited","partiallyExploited","unexploited"])console.log(k,JSON.stringify((ex[k]||[]).map(r=>[r.rawResource,r.exportValue,r.processingInstitutions,(r.presentInstitutions||r.present||"")])));
console.log("gaps",JSON.stringify(t.resourceAnalysis.gaps));
console.log("chains",JSON.stringify((t.economicState.activeChains||[]).map(c=>[c.name||c.label||c.chainKey||c.key,c.resource,c.status,c.processingInstitutions,c.upstreamMissing])));
console.log("insts",JSON.stringify(t.institutions.map(i=>i.name+(i.status&&i.status!=="active"?"["+i.status+"]":""))));
console.log("imports",JSON.stringify(t.economicState.primaryImports),"exports",JSON.stringify(t.economicState.primaryExports),"local",JSON.stringify(t.economicState.localProduction));
console.log("cfg res",JSON.stringify(t.config.nearbyResources),"depl",JSON.stringify(t.config.nearbyResourcesDepleted),"route",t.config.tradeRouteAccess,"terrain",t.config.terrainType, "stress",JSON.stringify(t.stress&&t.stress.type||t.stress));
