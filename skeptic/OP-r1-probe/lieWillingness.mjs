// OP-r1 probe: does lieWillingness return 0 for every LAWFUL carrier (OP §2.3, §7.1, scenario 7)?
import { lieWillingness } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963/src/domain/worldPulse/disinformationPlant.js';
const rows = [];
for (const [name, l, m] of [['lawful_good',1,0],['lawful_neutral',1,0.5],['lawful_evil',1,1]]) {
  for (const d of [0, 0.3, 0.5, 1]) rows.push({ name, lawfulness01: l, malice01: m, desperation01: d, willingness: lieWillingness({ malice01: m, lawfulness01: l, desperation01: d }) });
}
console.log(JSON.stringify(rows, null, 1));
