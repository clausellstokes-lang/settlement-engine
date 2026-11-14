import {stresses} from './stress.mjs';
export default (t,p)=>{const b=t.powerStructure.publicLegitimacy?.breakdown||{};const st=stresses(t);
const ok=st.includes('wartime')&&b.safety<0&&b.prosperity<0&&!['corrupted','capture'].includes(t.powerStructure.criminalCaptureState);
return {ok,why:`st ${st} b ${JSON.stringify(b)} pros ${t.economicState.prosperity} cap ${t.powerStructure.criminalCaptureState}`};};
