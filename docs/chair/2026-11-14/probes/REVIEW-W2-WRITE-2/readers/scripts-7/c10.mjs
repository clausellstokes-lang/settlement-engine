import {stresses} from './stress.mjs';
export default (t,p,{page})=>{const ci=(t.economicState.safetyProfile.criminalInstitutions||[]).map(c=>c.name||c);const st=stresses(t);
const first=ci[0]||'';const tr=t.config?.tradeRouteAccess;
const ok=/smuggling/i.test(first)&&!st.includes('under_siege')&&(t.economicState.primaryImports||[]).length>0;
return {ok,why:`first ${first} st ${st} trade ${tr} gate ${/gate/i.test(page)} walls ${t.institutions.some(i=>/wall/i.test(i.name))}`};};
