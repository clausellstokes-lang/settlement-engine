import {stresses} from './stress.mjs';
export default (t,p,{coup})=>{const c=coup.coupContenders(t);const g=c.governing||{};const st=stresses(t);
const kind=(()=>{const L=t.powerStructure.government||'';for(const [k,re] of [['occupier',/\b(?:occupation|foreign|martial administration)\b/i],['priest',/\b(?:church|theocratic|ecclesiastical|priestly|priest)\b/i],['elder',/\b(?:elder|headman|household council)\b/i],['mayor',/\b(?:mayor|reeve)\b/i],['lord',/\b(?:feudal|royal|noble|ducal|governorship|stewardship|appointee|regency|lord)\b/i]])if(re.test(L))return k;return 'council';})();
const ok=['government','civic','labor'].includes(g.category)&&!st.includes('succession_void')&&!(g.modifiers||[]).includes('vacant');
return {ok,why:`cat ${g.category} gov "${t.powerStructure.government}" kind ${kind} st ${st}`};};
