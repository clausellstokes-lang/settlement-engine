import {towns,entries} from './load.mjs';
const T={}; const add=(k,v)=>((T[k]??=[]).push(v));
for await (const {seed,s} of towns()){
  for(const e of entries(s)){ const t=e.summary||'';
    const fs=JSON.stringify(s.food?.foodSources ?? s.foodSecurity?.foodSources ?? s.economicState?.foodSources ?? null);
    if(e.type==='famine'){ const k=/gone short of food/.test(t)?'famine:noGrain':/lost its harvest/.test(t)?'famine:harvest':'famine:other';
      add(k, [seed,s.tier,'fs='+fs, t.slice(0,60)].join(' | ')); }
    if(e.type==='wartime'){ const k=/doing well out of it/.test(t)?'war:profit':'war:loss'; const car=/Supply caravans/.test(t), pr=/Food prices have doubled|army has the carts/.test(t);
      add(k+(car?'+car':'')+(pr?'+price':''), [seed,s.tier,'route='+(s.config?.tradeRouteAccess||s.tradeRoute||s.route||'?'),'pros='+(s.economicState?.prosperity),t.replace(/^.*?(Conscription)/,'$1').slice(0,200)].join(' | ')); }
  }
}
for(const [k,v] of Object.entries(T)) {console.log('##',k,v.length); console.log(v.slice(0,6).join('\n'));}
