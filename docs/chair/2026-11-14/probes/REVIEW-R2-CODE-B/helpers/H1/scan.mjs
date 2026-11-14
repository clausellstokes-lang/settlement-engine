// scan.mjs <births.gz> <out.jsonl>: per town, the H1 family's composed lines and the record facts they are read against.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const R='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip/src';
const { loadGenerationLawPayloads } = await import(R+'/domain/density/densityCreateBoundary.js'); await loadGenerationLawPayloads();
const T = await import(R+'/domain/summary/tonightSheet.js'); const Q = await import(R+'/domain/summary/settlementQuickGuide.js');
const SK = await import(R+'/domain/people/seatKeeper.js');
const { factsOf } = await import(R+'/domain/facts/factsOf.js').catch(()=>({}));
const out=fs.createWriteStream(process.argv[3]);
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
for await (const line of rl){ const {seed,s}=JSON.parse(line);
  const fsx=s.economicState?.foodSecurity||{}; const fr=fsx.foodRecord||{};
  let tonight=null, qg=null, scope='', err='';
  try{ tonight=T.composeTonightSheet(s); }catch(e){ err+='T:'+e.message; }
  try{ qg=Q.composeSettlementQuickGuide(s); scope=Q.cultureScopeLine(s); }catch(e){ err+='Q:'+e.message; }
  const stresses=(Array.isArray(s.stress)?s.stress:(s.stress?[s.stress]:[])).map(x=>x?.type).filter(Boolean);
  const insts=(s.institutions||[]).map(i=>i.name);
  let seatVacant=false, keeper=null, keeperForm='';
  try{ seatVacant=SK.isSeatVacant(s); const k=SK.seatKeeperOf(s); keeper=k?{id:k.id,name:k.name,role:k.role,title:k.title}:null; keeperForm=SK.keeperFormOf(s);}catch(e){err+='SK:'+e.message;}
  let F=null; try{ F=factsOf? factsOf(s):null; }catch(e){}
  out.write(JSON.stringify({seed,tier:s.tier,pop:s.population,culture:s.culturalIdentity?.key,stresses,
    food:{label:fsx.label,band:fr.band,gap:fr.gapPct,imp:fr.normalImportPct,grown:fr.grownPct,months:fr.storageMonths,granary:fr.hasGranary,held:fr.storesHeld,hasFamine:fsx.hasFamine,hasSiege:fsx.hasSiege,deficitPct:fsx.deficitPct,surplusPct:fsx.surplusPct,bandOf:T.foodBandOf(fr)?.label},
    seatVacant,keeper,keeperForm,
    route:s.config?.tradeRouteAccess, terrain:s.config?.terrainType, res:s.config?.nearbyResources,
    market:F?.market, guild:F?.guild, walls:F?.defence?.walls, rulerKind:F?.rulerKind,
    insts, tonight, qg, scope, err})+'\n');
}
out.end();
