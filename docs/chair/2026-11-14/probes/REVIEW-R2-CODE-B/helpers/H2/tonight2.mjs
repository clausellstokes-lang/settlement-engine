import fs from 'fs';
import {towns} from './load.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const {composeTonightSheet}=await import(S+'/tip/src/domain/summary/tonightSheet.js');
const c={};
for await (const {seed,s} of towns()){ const temp=(s.npcs||[]).filter(n=>n.temporary); if(!temp.length) continue;
  const t=composeTonightSheet(s); const def=t.facts.find(f=>/defen/i.test(f.label||f.id||''));
  const food=t.facts.find(f=>/food/i.test(f.label||f.id||''));
  for(const p of t.people.filter(p=>temp.some(x=>x.name===p.name))){
    const k=p.role+' | '+p.line+' | def='+(def?.text||'').slice(0,45);
    (c[k]??=[]).push(seed);
  }
  for(const x of temp) if(!t.people.some(p=>p.name===x.name)) (c['NOT ON TONIGHT '+x.role]??=[]).push(seed);
}
for(const k of Object.keys(c).sort()) console.log(c[k].length, k, c[k].filter(x=>/^r2/.test(x)).length+" census; "+c[k].slice(0,3).join(','));
