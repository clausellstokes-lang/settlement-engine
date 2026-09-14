import { walkPair, walkEntry } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/entryWalker.js';
const ground = { scope: 'estate', columns: { whoIsCounted: { closed: false, values: [] } } };
const before = { id: 'b', text: 'The watch at {settlement} keeps the gate, and every household is counted.', slots: ['settlement'] };
// AFTER keeps the old totality AND adds a second, different one over the same column.
const after  = { id: 'a', text: 'The watch at {settlement} keeps the gate, and every household is counted, and all souls are counted too.', slots: ['settlement'] };
const wb = walkEntry(before, ground); const wa = walkEntry(after, ground);
console.log('BEFORE fails', wb.fails.length, wb.fails.map(f=>f.klass+'|'+f.arm+'|'+f.column));
console.log('AFTER  fails', wa.fails.length, wa.fails.map(f=>f.klass+'|'+f.arm+'|'+f.column));
const p = walkPair(before, after, ground);
console.log('walkPair: added', p.added.length, '· preExisting', p.preExisting.length, '· cured', p.cured.length);
console.log('  added detail:', p.added.map(f=>f.text||f.arm));
