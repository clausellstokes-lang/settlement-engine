import {stresses} from "./stress.mjs";
export default (t,p,{coup})=>{const c=coup.coupContenders(t);const lab=coup.coupRiskLabel(c);
const top=c.challengers[0];const st=stresses(t).join("+");
const ok=lab==='Holding'&&(!top||c.incumbent.amplifiedWeight>top.weight)&&!st.includes('occupied');
return {ok,why:`${lab} inc ${c.incumbent.amplifiedWeight} top ${top?.name} ${top?.weight} stress ${st}`};};
