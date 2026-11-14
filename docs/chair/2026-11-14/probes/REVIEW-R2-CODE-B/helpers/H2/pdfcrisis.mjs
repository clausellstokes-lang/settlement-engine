import {towns} from './load.mjs';
const S='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad';
const {composeCrisisPage}=await import(S+'/tip/src/domain/crisis/crisisPage.js');
const {institutionHouseLabel}=await import(S+'/tip/src/domain/display/institutionDisplayName.js');
let castN=0, levN=0, castInst=new Set(), levT=new Set(); const odd={};
for await (const {seed,s} of towns()){
  let secs; try{secs=composeCrisisPage(s);}catch(e){console.log('ERR',seed,e.message);continue;}
  for(const x of secs){
    for(const r of x.cast){ castN++; if(r.kind==='institution'){ castInst.add(seed); const line=`${r.roleLabel}: ${institutionHouseLabel(r.name)} · ${r.reason}`; if(/[()]|\d|undefined/.test(line)) (odd[line]??=[]).push(seed);} }
    for(const l of x.levers){ levN++; levT.add(seed); const line=l.holderName?`${institutionHouseLabel(l.institution)}, held by ${l.holderName}.`:`${institutionHouseLabel(l.institution)}.`; if(/\(|\d|undefined/.test(line)) (odd[line.replace(/held by .*/,'held by <P>.')]??=[]).push(seed);}
  }
}
console.log('cast rows',castN,'inst cast towns',castInst.size,'lever rows',levN,'lever towns',levT.size);
for(const k in odd) console.log(odd[k].length,k,odd[k].slice(0,3).join(','));
