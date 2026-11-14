import {towns,entries} from './load.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const {factsOf}=await import(S+'/tip/src/domain/facts/factsOf.js');
const {atomHolds}=await import(S+'/tip/src/domain/facts/factVocabulary.js');
for await (const {seed,s} of towns()){
  for(const e of entries(s)){ if(e.type!=='wartime') continue; const t=e.summary||''; const f=factsOf(s);
    const a=(x)=>atomHolds(x,f);
    const v=/doing well/.test(t)?'profit':'loss'; const car=/Supply caravans/.test(t); const price=/Food prices have doubled/.test(t); const army=/army has the carts/.test(t);
    const bad=[];
    if(v==='profit'&&(a('prosperity: ≥ moderate')!==true||a('market')!==true||a('route: isolated')===true)) bad.push('profit-refusal');
    if(car&&a('route: isolated')===true) bad.push('car-isolated');
    if(price&&a('crisis: hunger')!==true) bad.push('price-not-hungry');
    if(army&&a('route: isolated')===true) bad.push('army-road-isolated');
    if(army&&a('crisis: hunger')===true) bad.push('army-under-hunger');
    console.log([seed,s.tier,v,car?'car':'',price?'price':'',army?'army':'','iso='+a('route: isolated'),'hunger='+a('crisis: hunger'),'pros='+a('prosperity: ≥ moderate'),'mkt='+a('market'),bad.join(',')].join(' '));
  }
}
