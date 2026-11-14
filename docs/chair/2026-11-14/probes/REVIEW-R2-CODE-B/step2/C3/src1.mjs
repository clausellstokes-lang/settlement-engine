import {towns} from './iter.mjs';
const T=process.env.T; const {chainSourceOf, chainHousesOf}=await import(T+'/src/domain/display/chainHouses.js');
let P=null; try{ P=(await import(T+'/src/domain/display/chainPrintName.js')).chainPrintName; }catch(e){ console.log('no chainPrintName', e.message.slice(0,80)); }
const [B,seedRe,chainRe]=process.argv.slice(2);
for await (const {seed,s} of towns(B)){ if(!new RegExp(seedRe).test(seed)) continue; const names=(s.institutions||[]).map(i=>i.name);
  for(const c of s.economicState?.activeChains||[]) if(new RegExp(chainRe).test(c.chainId)){ const pr=P?P(c,s):null; console.log(seed,c.chainId,'res=',c.resource,c.resourceCondition,'printed=',JSON.stringify(pr&&{resource:pr.resource,label:pr.label}),'-> source:',chainSourceOf(c,pr),'| via:',chainHousesOf(c.processingInstitutions,names).map(h=>h.name).join(' · ')); } }
