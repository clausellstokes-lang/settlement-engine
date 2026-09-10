import { readFileSync } from 'node:fs';
import { evaluateTripwires } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/soak/tripwires.mjs';
import { evaluateReceipt } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/soak/evaluate.mjs';
import { mintRefusals } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/scripts/soak/register.mjs';

const r = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const ev = evaluateTripwires(r);
console.log('findings:', ev.findings.length, ev.findings.map((f) => f.id).join(',') || '(none)');
console.log('observability:', ev.observability.length);
console.log('notExecutable:', JSON.stringify(ev.notExecutable, null, 2));
const e = evaluateReceipt(r, { profile: 'research-lit-4s' });
console.log('deterministicFirings:', e.deterministicFirings);
console.log('annotated.fullInstrument:', e.annotated.fullInstrument);
console.log('annotated.notExecutable:', JSON.stringify(e.annotated.notExecutable, null, 2));
console.log('mintRefusals:', JSON.stringify(mintRefusals(e.annotated), null, 2));
