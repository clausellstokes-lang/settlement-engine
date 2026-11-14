export default (t,p,{coup})=>{const c=coup.coupContenders(t);const lab=coup.coupRiskLabel(c);
const top=c.challengers[0];const pr=(p.page[0]||{}).printed||'';
const ok=lab==='Contested'&&top&&top.weight>c.incumbent.amplifiedWeight&&pr.includes('but the '+c.incumbent.name+' has not');
const rawLess=top.power<c.incumbent.power;
return {ok,why:`${lab} inc ${c.incumbent.name} p${c.incumbent.power} w${c.incumbent.amplifiedWeight} top ${top?.name} p${top?.power} w${top?.weight} ${rawLess?'RAWLESS':''}`};};
