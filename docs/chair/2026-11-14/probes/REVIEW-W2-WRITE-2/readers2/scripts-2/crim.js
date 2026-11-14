const rec=require('./rec.js');const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
for(const t of L[+process.argv[2]].read){const r=rec(t.town);const sp=r.economicState.safetyProfile||{};
const ci=r.institutions.filter(i=>i.category==='Criminal').map(i=>i.name);
const cf=(r.powerStructure.factions||[]).filter(f=>f.category==='criminal').map(f=>f.faction+':'+f.power);
console.log(t.town,r.tier,'crimPri='+r.config.priorityCriminal,'inst=['+ci.join('; ')+']','sp=['+(sp.criminalInstitutions||[]).join(';')+']','cap='+r.powerStructure.criminalCaptureState,'bm='+sp.blackMarketCapture,'fac=['+cf.join(';')+']');}
