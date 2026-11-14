import {mag} from './mg.mjs';
export default (t,p,{page})=>{const m=mag(t,page);
const open=m.econ==='common'||m.rel==='Integral'||m.arc.length>0||m.leg==='regulated'||m.leg==='legal';
const ok=m.f.heresySuppression&&m.f.heresyIntensity>=0.5&&!open;
return {ok,why:`acc ${m.acc} leg ${m.leg} rel ${m.rel} econ ${m.econ} arc ${m.arc} int ${m.f.heresyIntensity.toFixed(2)}`};};
