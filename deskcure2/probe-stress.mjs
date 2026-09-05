import { STRESS_TYPE_MAP } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/d5b9a39f-b0b2-4d9c-a1a0-08b291896f89/scratchpad/laneINTEG-tree/src/data/stressTypes.js';
const keys = Object.keys(STRESS_TYPE_MAP);
console.log('types:', keys.length);
for (const t of keys) console.log(' ', t, '->', Object.keys(STRESS_TYPE_MAP[t]).join(','));
