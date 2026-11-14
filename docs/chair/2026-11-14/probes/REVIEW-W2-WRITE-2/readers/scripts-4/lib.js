const fs=require("fs"),zlib=require("zlib");
const S="/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad";
const R=S+"/r/tip";
const cache={};
exports.rec=t=>cache[t]||(cache[t]=JSON.parse(zlib.gunzipSync(fs.readFileSync(`${R}/records/${t}.json.gz`))));
exports.page=t=>fs.readFileSync(`${R}/dumps/${t}.txt`,"utf8");
exports.lines=JSON.parse(fs.readFileSync(S+"/readers/lines-4.json"));
exports.R=R;exports.S=S;
exports.stress=r=>{const s=r.stresses||(r.stress?[r.stress]:[]);return s.map(x=>typeof x==="string"?x:(x.type||x.id||x.key||JSON.stringify(x).slice(0,40)))};
exports.feat=t=>{const r=exports.rec(t);const e=r.economicState||{};const f=e.foodSecurity||{};const fr=f.foodRecord||{};
 const st=[];for(const s of [].concat(r.stress||[]))if(s&&s.type&&!st.includes(s.type))st.push(s.type);if(Array.isArray(r.stressors))for(const s of r.stressors)if(s&&s.type&&!st.includes(s.type))st.push(s.type);
 const inst=(r.institutions||[]).map(i=>i.name);
 return {t,tier:r.tier,pop:r.population,st,pros:e.prosperity,acc:e.tradeAccess||r.config?.tradeRouteAccess,out:e.compound?.economyOutput,
 band:fr.band,grown:fr.grownPct,impPct:fr.normalImportPct,magic:fr.magicPct,gap:fr.gapPct,surplus:fr.surplusPct,stor:fr.storageMonths,src:fr.foodSources,failed:fr.failedSource,
 impCov:f.importCoverage,magOff:f.magicOffset,need:f.dailyNeed,prod:f.dailyProduction,siege:f.hasSiege,famine:f.hasFamine,
 exports:e.primaryExports||[],imports:e.primaryImports||[],ent:e.isEntrepot,transit:e.transit,income:(e.incomeSources||[]).map(x=>x.source+":"+x.percentage),
 vb:r.economicViability?.metrics?.foodBalance||{}, chains:(e.activeChains||[]),inst,market:inst.some(n=>/market|bazaar|fair/i.test(n)),safety:e.safetyProfile,r};};
