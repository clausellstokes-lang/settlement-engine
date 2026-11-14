const rec=require('./rec.js');const L=require('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/readers2/removals-2.json');
for(const t of L[+process.argv[2]].read){const r=rec(t.town);const f=r.economicState.foodSecurity||{};const fr=f.foodRecord||{};
console.log(t.town,'ratio='+f.foodRatio,'store='+f.storageMonths,'gran='+fr.hasGranary,'grown='+fr.grownPct,'imp='+fr.normalImportPct,'magic='+fr.magicPct,'src='+(fr.foodSources||[]).join('/'),'failed='+fr.failedSource);}
