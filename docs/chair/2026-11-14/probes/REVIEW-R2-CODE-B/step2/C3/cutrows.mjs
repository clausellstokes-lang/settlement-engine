import {towns} from './iter.mjs';
const T='/tmp/claude-0/-home-user-settlement-engine/a2e70bbe-8ee3-5a4b-b408-20d6830901c8/scratchpad/tip';
const D=await import(T+'/src/domain/display/institutionDisplayName.js');
for await (const {seed,s} of towns(process.argv[2])){ const inst=s.institutions||[];
  for(const i of s.economicViability?.issues||[]) if(/critically impaired|stockpiles/.test(i.description)) console.log(seed,'OUTLOOK:',D.houseLabelsInText(i.description,inst));
  for(const lv of s.stress?.cast?.levers||[]) console.log(seed,'LEVER:',lv.institution,'->',D.institutionHouseLabel(lv.institution));
  for(const n of ['Parish churches (10-30)','Parish churches (2-5)','Mills (2-5)','Gates (if walled)']) if(inst.some(i=>i.name===n)) console.log(seed,'LABEL',n,'->',D.institutionHouseLabel(n));
  const ch=(s.economicState?.activeChains||[]).find(c=>c.chainId==='bowyer_fletcher'); if(ch) console.log(seed,'BOW',ch.resource,ch.resourceDepleted,ch.processingInstitutions);
}
