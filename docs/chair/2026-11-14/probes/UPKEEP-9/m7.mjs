// UPKEEP-9 step 7 measures over a gzipped corpus (birthgz.mjs): usage TREE=<tree> node m7.mjs <corpus.ndjson.gz> <out.json>
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T=process.env.TREE;
const { getInstFlags, getStressFlags } = await import(T+'/src/generators/priorityHelpers.js');
const { defenseFactsOf } = await import(T+'/src/domain/defense/defenseFacts.js');
const { deriveCausalState } = await import(T+'/src/domain/causalState.js');
const rl=readline.createInterface({input:fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()),crlfDelay:Infinity});
const C={}; const ex={}; const inc=(k,seed)=>{C[k]=(C[k]||0)+1; (ex[k]??=[]); if(ex[k].length<6) ex[k].push(seed);};
const gangN=(insts)=>{let n=0;for(const i of insts){const m=String(i.name||'').toLowerCase();n+=m.includes('multiple criminal')?2:m.includes('street gang')?1:0;}return n;};
const MACH=/slider|priority|\d+\s*\/\s*\d+|capacity\)|tier-plausible|\(\d+-\d+\+?\)/i;
let n=0;
for await (const line of rl){ if(!line) continue; const {seed,s}=JSON.parse(line); n++;
  const insts=s.institutions||[]; const cfg={...(s.config||{})};
  const f=getInstFlags(cfg,insts); const home=defenseFactsOf({institutions:insts});
  const stress=s.config?.stressTypes||[]; const siege=stress.includes('under_siege');
  // #1082
  if(f.inst.hasGangInfra && gangN(insts)===0){ inc('gang.flagNoGangHouse',seed);
    const ct=(s.economicState?.safetyProfile?.crimeTypes||[]); if(ct.some(c=>c.type==='Street gang activity')) inc('gang.lineNoGangHouse',seed);
    const sf=getStressFlags(cfg,insts); if(sf.merchantArmy && !f.inst.hasMercenary) inc('gang.merchantArmyByGangFlagOnly',seed); }
  // #598
  if(home.hasCourt && !home.hasCourthouse){ inc('court.flagNoCourthouse',seed);
    const sp=JSON.stringify(s.economicState?.safetyProfile||{}); if(/court/i.test(sp)) { inc('court.safetyNamesCourt',seed); for(const m of sp.match(/[^".]*\bcourts?\b[^".]*/gi)||[]) inc('court.safety:'+m.trim().slice(0,90),seed);} }
  // viability
  const v=s.economicState?.economicViability||s.economicViability||{};
  for(const k of ['issues','warnings','dependencies','suggestions']) for(const it of (v[k]||[])){
    for(const fld of ['title','description','impact','priorityNote']) if(it?.[fld] && MACH.test(it[fld])) inc(`via.${k}.${fld}:`+String(it[fld]).replace(/\d+/g,'N').slice(0,80),seed);
    for(const fx of (it?.suggestedFixes||[])) if(MACH.test(fx)) inc(`via.${k}.fix:`+String(fx).replace(/\d+/g,'N').slice(0,80),seed);
    if(it?.title==='Locally Sustained Isolation'){ if(siege) inc('via.locallyViable.underSiege',seed); if(v.viable===false) inc('via.locallyViable.notViable',seed); }
    if(/Banks cannot operate without a merchant class/.test(it?.impact||'') && f.inst.hasMerchantGuild) inc('via.bankImpactBesideMerchants',seed);
  }
  // #869
  if(siege){ try{ const cs=deriveCausalState(s); const b=cs.bands?.trade_connectivity; inc('tc.siege.band:'+b,seed); }catch(e){ inc('tc.err',seed);} }
}
fs.writeFileSync(process.argv[3],JSON.stringify({n,C,ex},null,1)); console.log('n',n,'keys',Object.keys(C).length);
