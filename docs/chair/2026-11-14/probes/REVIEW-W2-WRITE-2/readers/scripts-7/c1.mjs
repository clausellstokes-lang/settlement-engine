export default (t,p,{coup})=>{const c=coup.coupContenders(t);const lab=coup.coupRiskLabel(c);
const top=c.challengers[0];const pr=(p.page[0]||{}).printed||'';
const ok=lab==='Contested'&&top&&top.weight>c.incumbent.amplifiedWeight&&pr.startsWith(top.name)&&pr.includes('from '+c.incumbent.name);
return {ok,why:`${lab} inc ${c.incumbent.name} ${c.incumbent.amplifiedWeight} top ${top?.name} ${top?.weight}`};};
