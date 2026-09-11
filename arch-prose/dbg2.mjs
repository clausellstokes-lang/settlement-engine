import { pathToFileURL } from 'node:url';
const D='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6';
const imp=(p)=>import(pathToFileURL(D+'/'+p).href);
const {legibilityRung}=await imp('src/domain/display/stateProse/legibilityRung.js');
console.log('legibilityRung sample:', JSON.stringify(legibilityRung('glance',{blockId:'B',poolKey:'P',angle:'ledger',text:'A sentence here.'},[])));
