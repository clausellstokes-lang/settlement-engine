import {towns,entries} from './load.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const {crisisHookFor}=await import(S+'/tip/src/domain/crisis/crisisHooks.js');
const out={filled:[],unfilled:[]};
for await (const {seed,s} of towns()){
  for(const e of entries(s)){ if(e.type!=='plague_onset') continue;
    const h=crisisHookFor(s,e); const lever=(e.cast?.roles||[]).find(r=>r.role==='lever');
    const n=lever&&s.npcs.find(x=>(x.id||x.name)===lever.id);
    const healers=s.npcs.filter(x=>/heal|apothec|midwi|hospital|physic/i.test(x.role||'')).map(x=>x.name+'('+x.role+')');
    const hinst=(s.institutions||[]).filter(i=>/heal|apothec|midwi|hospital|physic|herb/i.test(i.name)).map(i=>i.name);
    const filled=!h.startsWith('The healer who');
    (filled?out.filled:out.unfilled).push([seed,s.tier,'lever='+(lever?lever.kind+':'+lever.name+'/'+(n?.role||'')+'/'+lever.reason.slice(0,20):'none'),'HOOK: '+h.slice(0,110),'healers: '+healers.join(',')+' | inst: '+hinst.join(',')].join(' || '));
  }
}
console.log('FILLED',out.filled.length); console.log(out.filled.join('\n')); console.log('UNFILLED',out.unfilled.length); console.log(out.unfilled.join('\n'));
