import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T=process.env.TREE; const [,,F]=process.argv;
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js');
const { declarationAdmits, declarationOf } = await import(T+'/src/domain/facts/factVocabulary.js');
const rows=[/two bad weeks from genuine starvation/,/Since the .* failed, whoever holds the food|Since the harvest failed/,/knows where the hoarded/,/bakers of/,/promised a fair share/,/Hunger has made/];
const rl=readline.createInterface({input:fs.createReadStream(F).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); const p=s.pressureSentence||''; const i=rows.findIndex(r=>r.test(p)); if(i<0) continue;
 const fr=s.economicState?.foodSecurity?.foodRecord||{}; const f=factsOf(s);
 const gran=declarationAdmits(declarationOf({text:'x',needs:['institution: granary']}),f).admitted;
 const nf=(s.powerStructure?.factions||[]).length;
 console.log([seed,'row'+i,'granaryAtom='+gran,'hasGranary='+fr.hasGranary,'months='+fr.storageMonths,'held='+fr.storesHeld,'factions='+nf,'failed='+fr.failedSource,'src='+(fr.foodSources||[]).join('/'),'tier='+s.tier,'stress='+(s.stress||[]).map?.(x=>x.type).join('+')].join('\t'));
}
