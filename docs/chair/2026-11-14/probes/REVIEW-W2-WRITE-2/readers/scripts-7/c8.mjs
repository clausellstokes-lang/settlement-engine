import {stresses} from './stress.mjs';
export default (t,p)=>{const pr=(p.page[0]||{}).printed||'';const g=t.powerStructure.governingName;
const ok=t.powerStructure.criminalCaptureState==='corrupted'&&pr.includes(g);
return {ok,why:`cap ${t.powerStructure.criminalCaptureState} gov ${g} st ${stresses(t)} ci ${(t.economicState.safetyProfile.criminalInstitutions||[]).map(c=>c.name||c)}`};};
