import '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/consist/src/generators/generateSettlementPipeline.js';
import { getStepMeta, getStepOrder } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/923472dc-319b-4b73-9e42-fa911739df78/scratchpad/consist/src/generators/pipeline.js';
const meta = getStepMeta(); const order = getStepOrder();
let keys = 0;
for (const name of order) { const m = meta.find(x => x.name === name); keys += m.provides.length; console.log(String(m.provides.length).padStart(2), name.padEnd(30), '[' + m.provides.join(', ') + ']'); }
console.log('STEPS', order.length, 'PROVIDES KEYS', keys);
