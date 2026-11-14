// scopecheck: every Overview scope line's clauses read against the town's own record (roster, facts, size, water).
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src';
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const Q = await import(R+'/domain/summary/settlementQuickGuide.js');
const { factsOf } = await import(R+'/domain/facts/factsOf.js');
const { populationBandOf } = await import(R+'/domain/facts/populationBand.js');
const { liveInstitutions } = await import(R+'/domain/institutions/institutionRoster.js');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const issues={}; const add=(k,seed,extra)=>{(issues[k]=issues[k]||[]).push(seed+(extra?` [${extra}]`:''));};
const counts={};
const cnt=(k)=>counts[k]=(counts[k]||0)+1;
for await (const line of rl){ const {seed,s}=JSON.parse(line); const line2=Q.cultureScopeLine(s); if(!line2) continue;
  const F=factsOf(s); const band=populationBandOf(s); const tier=s.tier;
  const names=liveInstitutions(s).map(i=>String(i.name||'')).filter(n=>!/^access to/i.test(n));
  const has=(re)=>names.some(n=>re.test(n));
  const L=line2; const small=band==='small'||['thorp','hamlet','village'].includes(tier); const tiny=['thorp','hamlet'].includes(tier);
  const route=s.config?.tradeRouteAccess, terr=s.config?.terrainType;
  if(/harbour/.test(L)){ cnt('harbour'); if(!F.water.coast) add('harbour-no-water',seed,route+'/'+terr); if(!has(/dock|harbou?r|port|wharf|quay|pier|fishing|landing/i)) add('harbour-no-house',seed,tier+' '+s.population+' '+route+'/'+terr); }
  if(/agora/.test(L)){ cnt('agora'); if(F.market===false) add('agora-no-market',seed); if(tiny) add('agora-tiny',seed); }
  if(/bazaar/.test(L)){ cnt('bazaar'); if(F.market===false) add('bazaar-no-market',seed); if(tiny) add('bazaar-tiny',seed); }
  if(/market/.test(L)){ cnt('market'); if(F.market===false) add('market-no-market',seed,tier); }
  if(/civic square|masonry/.test(L)){ cnt('civicsq'); if(tiny) add('civicsq-tiny',seed); }
  if(/quarters|districts|wards/.test(L)){ cnt('quarters'); if(small) add('quarters-small',seed,tier+' '+s.population+' '+band); }
  if(/waterworks/.test(L)){ cnt('waterworks'); if(!has(/\baqueduct|\bcistern|\bwater system|\bwaterworks|\bfountain|\bbath(?:s|house)?\b/i)) add('waterworks-none',seed); }
  if(/endowed/.test(L)){ cnt('endowed'); if(!has(/\bchurch|\bcathedral|\btemple|\babbey|\bmonaster|\bfriary|\balmshouse|\bhospital|\bschool|\bcollege|\bacademy|\buniversity|\bmadrasa/i)) add('endowed-none',seed); }
  if(/guild/.test(L)){ cnt('guild'); if(!has(/guild/i)) add('guild-none',seed,tier); }
  if(/temple/.test(L)){ cnt('temple'); if(!has(/temple|church|cathedral|shrine|monaster|abbey/i)) add('temple-none',seed,tier+' '+names.filter(n=>/relig|priest|shrine|parish/i.test(n)).join('/')); }
  if(/bureau/.test(L)){ cnt('bureau'); if(small) add('bureau-small',seed); }
  if(/civic association/.test(L)){ cnt('civic'); if(['lord','priest','occupier'].includes(String(F.rulerKind))) add('civic-under-lord',seed); if((s.stress||[]).some?.(x=>x?.type==='occupied')) add('civic-under-occupation',seed,String(F.rulerKind)+' / '+(s.powerStructure?.governingName||'')); }
  if(/earthwork/.test(L)){ cnt('earthwork'); if(!F.defence?.walls) add('earthwork-no-walls',seed); }
  if(/pasture/.test(L)){ cnt('pasture'); if(!(s.config?.nearbyResources||[]).includes('grazing_land')) add('pasture-no-grazing',seed); }
  if(/its estates/.test(L)){ cnt('estates'); add('estates-at',seed,tier+' '+s.population); }
  if(/caravan/.test(L)){ cnt('caravan'); if(route==='isolated') add('caravan-isolated',seed,tier); }
  if(/\/|\(|\)/.test(L)) add('broken-slash',seed,L.slice(0,120));
  if(/ the [A-Z]/.test(L)) add('capital-seat',seed,(L.match(/the [A-Z][^,]*/)||[''])[0]);
}
console.log(counts); for(const [k,v] of Object.entries(issues)) console.log(k, v.length, v.slice(0,6).join(' | '));
