import {stresses} from './stress.mjs';
export default (t,p,{coup})=>{const c=coup.coupContenders(t);const g=c.governing||{};
const ok=g.category==='religious';
return {ok,why:`cat ${g.category} gov "${t.powerStructure.government}" name ${g.faction} mod ${g.modifier} st ${stresses(t)}`};};
