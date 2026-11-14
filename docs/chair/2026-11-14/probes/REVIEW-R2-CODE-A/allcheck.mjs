// allcheck.mjs <tree> <births.gz>: content checks over EVERY town each line prints in (record strings).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const [T, births] = process.argv.slice(2);
const { factsOf } = await import(T+'/src/domain/facts/factsOf.js'); const { hasMarketInstitution } = await import(T+'/src/domain/facts/market.js');
const FRA = await import(T+'/src/generators/narrative/foundingRowAdmits.js');
const tally={}; const ex={}; const t=(k,seed,note='')=>{ tally[k]=(tally[k]||0)+1; (ex[k]||(ex[k]=[])).length<4 && ex[k].push(seed+(note?` (${note})`:'')); };
const rl=readline.createInterface({input:fs.createReadStream(births).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const {seed,s}=JSON.parse(line); let f; try{ f=factsOf(s);}catch{ continue; }
  const strs=[]; (function w(v){ if(typeof v==='string') strs.push(v); else if(Array.isArray(v)) v.forEach(w); else if(v&&typeof v==='object') for(const k in v) w(v[k]); })(s); const has=(re)=>strs.some(x=>re.test(x)); const all=strs.join('\n');
  const st=new Set((Array.isArray(s.stress)?s.stress:s.stress?[s.stress]:[]).map(x=>x.type)); const fsq=s.economicState?.foodSecurity||{}; const imp=Number(fsq.importCoverage)>0; const mk=hasMarketInstitution(s.institutions||[]);
  const wk=f.water?.kind; const inst=(s.institutions||[]).map(i=>i.name).join('; ');
  if(has(/ones still at sea/)) t(wk==='maritime'?'L21a sea: maritime':'L21a sea: NOT maritime', seed, wk);
  if(has(/among those who fish, and the ones still working/)) t(`L21b fish: water ${wk}`, seed, s.config?.terrainType+'/'+s.config?.tradeRouteAccess);
  if(has(/the merchants are watching it decide/)) t(mk?'L22 merchants: market':'L22 merchants: NO MARKET', seed);
  if(has(/whoever brings the food in is watching it decide/)) t(mk?'L22 whoever: market (twin printed with a market)':'L22 whoever: no market', seed);
  if(has(/what food can still be bought from outside|spiked the price of grain\. The settlement must decide what it can still afford to import/)) t(`L22 buys from outside: imp ${imp} siege ${st.has('under_siege')} channel ${fsq.importChannel||'-'}`.slice(0,60), seed);
  if(has(/One importer now brings in all the grain/)) t((s.economicState?.primaryImports||[]).some(x=>/grain/i.test(String(x)))?'L23 importer: grain imported':'L23 importer: NO GRAIN IMPORT', seed);
  if(has(/No food comes in by trade now, and what is left here is in a few hands/)) t(`L23 hoard: siege ${st.has('under_siege')} imp ${imp}`, seed);
  if(has(/Something is killing the forest the timber comes from/)){ const keys=(s.config?.nearbyResources||[]); const stand=keys.some(k=>/^(managed_forest|shipbuilding_timber|mountain_timber)$/.test(k)); const depl=(s.resourceAnalysis?.resourceConditions||[]).filter(c=>/^(managed_forest|shipbuilding_timber|mountain_timber)$/.test(c.key)&&/deplet|exhaust/i.test(JSON.stringify(c))).length; t(`L24 forest: stand ${stand} depleted ${depl>0} siege ${st.has('under_siege')}`, seed); }
  if(has(/The timber rafts stopped coming a month ago/)) t(`L24 rafts: siege ${st.has('under_siege')} route ${s.config?.tradeRouteAccess}`, seed);
  const sr=(s.settlementReason||[]).join(' ');
  if(/it gets by on/.test(sr)) t(`L29/30 holds: siege ${st.has('under_siege')} imp ${imp} route ${s.config?.tradeRouteAccess}`, seed, (sr.match(/gets by on ([^.]*)/)||[])[1]);
  if(/it gets by on what it has in store/.test(sr)) t(`L29 store: granary ${fsq.foodRecord?.hasGranary} reserves-path ${(s.isolationSupport?.paths||[]).some(p=>p.type==='reserves')}`, seed);
  if(/(arrives expensively — through|The gap is closed through|What is missing comes in through|Survival here rests on|The shortfall is met through)/.test(sr)){ t(`L31 channels: imp ${imp} siege ${st.has('under_siege')}`, seed); if(/carriage by magic/.test(sr)) t(`L31 magic: magicExists ${s.config?.magicExists} path ${(s.isolationSupport?.paths||[]).some(p=>p.type==='magical_transit')}`, seed); if(/caravans that still come/.test(sr)) t('L31 caravans', seed, (s.isolationSupport?.paths||[]).find(p=>p.type==='seasonal_access')?.evidence?.join('|').slice(0,80)); if(/favour of a patron/.test(sr)) t('L31 patron', seed); if(/carts from the country around it/.test(sr)) t('L31 hinterland carts', seed); if(/tracks in a good season/.test(sr)) t('L31 tracks', seed); }
  if(/{channels}|{holds}|{ground}|undefined/.test(sr)) t('SR broken token', seed, sr.slice(0,120));
  if(/In ordinary times everything in the region/.test(sr)) t(`L33 metro: siege ${st.has('under_siege')}`, seed);
  if(st.has('under_siege') && /Everything in the region is bought, sold or decided here\./.test(sr) && !/In ordinary times/.test(sr)) t('L33 SIEGE metro plain line', seed);
  if(st.has('under_siege') && /(trade flowing|traffic|other people's journeys|busy roads|trade on every road|caravans that still come)/.test(sr)) t('L32 SIEGE traffic word in founding paragraph', seed, sr.match(/[^.]*(trade flowing|traffic|other people's journeys|busy roads|trade on every road|caravans that still come)[^.]*/)[0].slice(0,140));
  if(/other people's journeys/.test(sr)) t(`L32 journeys: tier ${s.tier} tavern ${/inn|tavern/i.test(inst)}`, seed);
  const ps=String(s.pressureSentence||'');
  if(/is surrounded\. Supply lines are cut/.test(ps)) t('L35 who: '+(ps.match(/morale is fracturing, and (.*?) is deciding/)||[])[1]?.replace(/^[A-Z][a-z]+ /,'X ').slice(0,40), seed);
  if(/the courts are not equipped/.test(ps)) t('L40 courts: '+(/court/i.test(inst)?'court on roster':'NO COURT'), seed);
  if(/grey zone that .* is not equipped/.test(ps)) t('L40 gov: '+(ps.match(/grey zone that (.*?) is not/)||[])[1], seed);
  if(/The bakers of/.test(ps)) t('L36 bakers: '+(/baker/i.test(inst)?'bakers':'NO BAKERS'), seed);
  if(/a workshop closed for want of a master/.test(ps)) t('L39 workshop', seed); if(/a trade left without its master/.test(ps)) t('L39 trade-twin', seed);
  if(/every household is watching what the others eat/.test(all)) t(`L47 famine ${st.has('famine')} tier ${s.tier}`, seed);
  if(/the local underworld/.test(all)) t(`L44 underworld: crime ${f.crime ?? f.crimeLevel ?? '?'} thieves ${/thie/i.test(inst+JSON.stringify((s.powerStructure?.factions||[]).map(x=>x.faction)))}`, seed);
  // founders: every printed Origin row and founder row passes its own test on the final record
  const fd=s.history?.founding; if(fd){ const state={ facts:f, resources:new Set((s.config?.nearbyResources||[]).map(String)) };
    const rt=FRA.FOUNDING_REASON_ADMITS[String(fd.reason)]; if(rt){ let ok; try{ ok=rt(state);}catch(e){ ok='ERR'; } t(`L25 row tested, final record ${ok}`, seed, String(fd.reason).slice(0,60)); }
    if(fd.reason==null||fd.reason==='') t('L25 reason empty', seed);
    const ft=FRA.FOUNDER_ADMITS[String(fd.foundedBy)]; if(ft){ let ok; try{ ok=ft(state);}catch(e){ok='ERR';} t(`L26 founder tested, final record ${ok}`, seed, String(fd.foundedBy).slice(0,50)); }
    if(FRA.NAMES_A_FOUNDER.has(String(fd.reason))) t('L25 Origin names a founder (drawn)', seed, String(fd.reason).slice(0,50)+' / '+fd.foundedBy); }
}
for(const k of Object.keys(tally).sort()) console.log(`${tally[k]}\t${k}\t${ex[k].join(' ')}`);
