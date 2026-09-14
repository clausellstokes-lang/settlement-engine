import { readFileSync } from 'node:fs';
import { coOccurringPairs, tierRows } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/skepINSTR2/src/domain/prose/wiringCensus.js';
const { rows, held } = JSON.parse(readFileSync('./rows.json','utf8'));
const j = JSON.parse(readFileSync('/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/instr-912/firings.json','utf8'));
const firings = j.firings;
const blind = coOccurringPairs({ firings, rows });
console.log('no floor: pairs', blind.pairs.length, '| notExecutable', JSON.stringify(blind.notExecutable).slice(0,80));
for (const f of [100,180,200,201]) {
  const r = coOccurringPairs({ firings, rows, minTowns: f });
  console.log(`floor ${f}: pairs ${r.pairs.length} (towns ${r.towns})`);
}
const at90 = coOccurringPairs({ firings, rows, minTowns: 180 });
const t = tierRows({ rows, held, pairs: at90.pairs });
const c = t.reduce((m,x)=>m.set(x.tier,(m.get(x.tier)||0)+1), new Map());
console.log('TIERS with pairs at floor 180:', [...c]);
const at100 = coOccurringPairs({ firings, rows, minTowns: 100 });
const t2 = tierRows({ rows, held, pairs: at100.pairs });
const c2 = t2.reduce((m,x)=>m.set(x.tier,(m.get(x.tier)||0)+1), new Map());
console.log('TIERS with pairs at floor 100:', [...c2]);
// duplicate: pair counted per town or per firing?
console.log('top pairs at floor 200:', at90.pairs.filter(p=>p.towns===200).length);
