import { rateGrid } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/scripts/prose-rate-corpus.mjs';
import { generateSettlementPipeline } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/generators/generateSettlementPipeline.js';
import { HOLDER_KINDS, holdersOf } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepSEAM/src/domain/prose/holderTable.js';
const held=new Map(); let towns=0;
for (const spec of rateGrid()) { let s; try{ s=generateSettlementPipeline(spec.config,null,{seed:spec.seed,customContent:{}});}catch{continue;} towns++;
  for (const k of HOLDER_KINDS) if (holdersOf(k,s).length) held.set(k,(held.get(k)||0)+1); }
console.log('towns',towns);
console.log(HOLDER_KINDS.map(k=>k+' '+(held.get(k)||0)+'/0').join(' · '));
