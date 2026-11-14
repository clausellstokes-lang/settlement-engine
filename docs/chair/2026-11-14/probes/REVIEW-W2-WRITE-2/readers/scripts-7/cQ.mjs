import {mag} from './mg.mjs';
// qualified ("magic against the faith") hunted lines: flag on, hunted band, a church reachable
export default (t,p,{page})=>{const m=mag(t,page);
const tem=t.institutions.some(i=>/temple|church|chapel|shrine|cathedral|monaster|priest|parish/i.test(i.name));
const ok=m.f.heresySuppression&&m.f.heresyIntensity>=0.5&&tem;
const low=['indifferent'].includes(m.acc)||['regulated','legal'].includes(m.leg);
return {ok,why:`${low?'LOW ':''}int ${m.f.heresyIntensity.toFixed(2)} temple ${tem} acc ${m.acc} leg ${m.leg} rel ${m.rel} arc ${m.arc}`};};
