import {mag} from './mg.mjs';
// unqualified heresy lines: FALSE (MED) where the page shows magic openly worked/accepted
export default (t,p,{page})=>{const m=mag(t,page);
const af=t.powerStructure.factions.filter(f=>['arcane','magic'].includes(f.category)).map(f=>f.faction);
const strong=m.econ==='common'||m.rel==='Integral'||m.arc.length>0||['regulated','legal'].includes(m.leg)||['indifferent','accepting','welcoming','embraced'].includes(m.acc);
const low=!strong&&(af.length>0||/deliberately unresolved/.test(page)||m.acc==='wary');
const ok=m.f.heresySuppression&&!strong;
return {ok,why:`${low?'LOW ':''}acc ${m.acc} leg ${m.leg} rel ${m.rel} econ ${m.econ} arc ${m.arc} af ${af}`};};
