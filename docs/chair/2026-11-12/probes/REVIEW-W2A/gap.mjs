const {town}=await import(process.env.S+'/tools/probe2.mjs');
for(const seed of process.argv.slice(2)){ const t=town(seed); const ra=t.resourceAnalysis||{};
 console.log('##',seed,'route',t.config?.tradeRouteAccess,'terrain',t.config?.terrainType);
 console.log(' critical:',JSON.stringify(ra.imports?.critical),' reasons:',JSON.stringify(ra.imports?.reasons).slice(0,300));
 console.log(' gaps:',JSON.stringify((ra.gaps||[]).filter(g=>g.institution)).slice(0,600));
 console.log(' primaryImports:',JSON.stringify(t.economicState.primaryImports).slice(0,400));
 const ch=(t.economicState.activeChains||[]).filter(c=>/pott|brick|clay|wine|vint|salt|grape/i.test((c.label||'')+(c.chainId||'')+(c.resourceKey||'')));
 for(const c of ch) console.log(' chain',c.chainId||c.label,'status',c.status,'resKey',c.resourceKey,'resActive',c.resourceActive,'subst',c.substituteActive,'entrepot',c.entrepot, 'procInst', JSON.stringify(c.processingInstitutions));
 console.log(' insts:', (t.institutions||[]).map(i=>i.name).filter(n=>/pott|brick|vint|salt/i.test(n)).join(', '));
}
