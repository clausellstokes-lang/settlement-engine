export default (t,p,{page})=>{const sp=t.economicState.safetyProfile;const ci=(sp.criminalInstitutions||[]).map(c=>c.name||c);
const watch=t.institutions.some(i=>/watch|guard|militia|garrison/i.test(i.name));
const ok=sp.flags.crimeIsGovt&&ci.some(n=>/gang|thie/i.test(n))&&watch&&/Extortion|protection/i.test(page);
return {ok,why:`flag ${sp.flags.crimeIsGovt} ci ${ci} watch ${watch} capture ${t.powerStructure.criminalCaptureState}`};};
