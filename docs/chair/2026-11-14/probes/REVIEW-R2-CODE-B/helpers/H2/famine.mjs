import {towns,entries} from './load.mjs';
const T={}; const ex={};
for await (const {seed,s} of towns()){
  for(const e of entries(s)){ if(e.type!=='famine') continue; const t=e.summary||'';
    const fr=s.economicState?.foodSecurity?.foodRecord; const fs=fr?.foodSources;
    const k=(/gone short of food/.test(t)?'noGrain':/lost its harvest/.test(t)?'harvest':'other')+' fs='+JSON.stringify(fs);
    T[k]=(T[k]||0)+1; (ex[k]??=[]).push(seed);
  }
}
for(const k in T) console.log(T[k],k, ex[k].slice(0,4).join(','));
