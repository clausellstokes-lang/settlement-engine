import { readFileSync } from 'node:fs';
import { parseSlotShapes } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/lib/dossier-slot-shapes.mjs';
const A='/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/docs/content/RECEIPT_POOLS_DOSSIER_STATE.md';
const r = parseSlotShapes(readFileSync(A,'utf8'), 'state annex');
const by={}; for(const [s,sh] of Object.entries(r.exact)) (by[sh] ||= []).push(s);
for (const [sh,list] of Object.entries(by)) console.log(`${sh} (${list.length}): ${list.sort().join(', ')}`);
console.log('prefix families:', JSON.stringify(r.prefixes));
console.log('total exact rows', Object.keys(r.exact).length);
