import {stresses} from './stress.mjs';
const df=await import('/tmp/claude-0/-home-user-settlement-engine/b820d610-fd3f-5b2e-a6a5-c562b3a50edf/scratchpad/wt/tip/src/domain/defense/defenseFacts.js');
export default (t,p,{page})=>{const ci=(t.economicState.safetyProfile.criminalInstitutions||[]).map(c=>c.name||c);const st=stresses(t);
const f=df.defenseFactsOf(t);const walls=t.institutions.filter(i=>/wall|gate|palisade/i.test(i.name)).map(i=>i.name);
const ok=/smuggling/i.test(ci[0]||'')&&!st.includes('under_siege')&&f.hasGate&&walls.length>0;
return {ok,why:`first ${ci[0]} st ${st} gate ${f.hasGate} walls ${walls}`};};
