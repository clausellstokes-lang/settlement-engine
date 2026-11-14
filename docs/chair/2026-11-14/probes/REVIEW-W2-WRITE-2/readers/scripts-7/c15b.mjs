import {mag} from './mg.mjs';
export default (t,p,{page})=>{const m=mag(t,page);
const af=t.powerStructure.factions.filter(f=>['arcane','magic'].includes(f.category)).map(f=>(f.faction||f.name)+':'+f.power);
const open=m.econ==='common'||m.rel==='Integral'||m.arc.length>0||m.leg==='regulated'||m.leg==='legal'||af.length>0;
const ok=m.f.heresySuppression&&!open;
return {ok,why:`acc ${m.acc} leg ${m.leg} rel ${m.rel} econ ${m.econ} arc ${m.arc} arcFaction ${af} int ${m.f.heresyIntensity.toFixed(2)}`};};
