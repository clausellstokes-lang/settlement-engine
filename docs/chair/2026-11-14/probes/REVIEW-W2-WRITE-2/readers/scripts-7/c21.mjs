import {stresses} from './stress.mjs';
const df=await import('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip/src/domain/defense/defenseFacts.js');
export default (t,p,{page})=>{const f=t.economicState.safetyProfile.flags;const d=df.defenseFactsOf(t);const ps=t.powerStructure;
const g=ps.factions.find(x=>x.isGoverning)||{};const merch=ps.factions.filter(x=>x.category==='economy'||/merchant|guild|trad/i.test(x.faction)).map(x=>x.faction+':'+x.power);
const merc=t.institutions.filter(i=>/mercenar|sellsword|hired/i.test(i.name)).map(i=>i.name);
const ok=f.merchantArmy&&!f.crimeIsGovt&&!f.stateCrime&&!stresses(t).includes('occupied');
return {ok,why:`st ${stresses(t)} gov ${g.faction}:${g.power}:${g.category} merch ${merch} merc ${merc} watch ${d.hasWatch} garrison ${d.hasGarrison} mercF ${d.hasMercenary}`};};
