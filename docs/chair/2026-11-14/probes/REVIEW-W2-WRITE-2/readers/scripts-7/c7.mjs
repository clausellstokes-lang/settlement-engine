import {stresses} from './stress.mjs';
export default (t,p,{page})=>{const b=t.powerStructure.publicLegitimacy?.breakdown||{};const st=stresses(t);
const watch=t.institutions.filter(i=>/watch|guard|militia|garrison|constab/i.test(i.name)).map(i=>i.name);
const bad=st.filter(s=>['under_siege','occupied','monster_pressure','wartime','insurgency','slave_revolt'].includes(s));
const ok=watch.length>0&&b.safety<0&&b.prosperity<0&&!bad.length&&!['corrupted','capture'].includes(t.powerStructure.criminalCaptureState);
return {ok,why:`st ${st} watch ${watch} b ${JSON.stringify(b)} cap ${t.powerStructure.criminalCaptureState}`};};
