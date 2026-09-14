// $SC/kit/eco-cut/try.mjs — one candidate wording at a time: moves, order id, the sweep's proxy,
// and whether the A0b arm still sees the `granary` field claimed under the ratified vocabulary.
import * as mg from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-clarity-ECONOMY/src/domain/prose/moveGrammar.js';
import { claimsField } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-clarity-ECONOMY/src/domain/prose/composedWalker.js';
import { fieldSynonymsFor } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/4e3d2f70-f45f-4e14-b571-514c339cfa17/scratchpad/kit/lane-clarity-ECONOMY/src/domain/prose/fieldSynonyms.js';
const ARCH=/\b(granary|infirmary|pedlar|factor|watchman|sexton|alehouse|bier|billhook|gaol|patrolman|tallow)\b/;
const GLOSS=/\b(has it that|have it that|puts it that|the account is|the talk is that|'s position is|'s account is|'s own account|'s word is|own answer is|the word is that|the view is that|'s view is)\b/;
function proxy(t){ const f=[]; if (t.includes(' and that ')) f.push('and-that'); if (GLOSS.test(t)) f.push('gloss');
  if (t.split(/(?<=[.!?])\s+/).some(x=>x.split(/\s+/).length>24)) f.push('>24w'); if (ARCH.test(t)) f.push('archaism'); if (/;|—|!|\d|\bwill\b|\bshall\b/.test(t)) f.push('bar'); return f; }
const V = fieldSynonymsFor({ reads:['granary','granary.available','granary.band'], source:{} });
for (const t of process.argv.slice(2)) {
  const m = mg.classifyMoves(t);
  console.log(`MOVES ${m.join('+')||'(none)'} · order ${mg.orderIdOf(m)||'none'} · proxy ${proxy(t).join(',')||'clean'} · claims granary as "${claimsField(t,'granary',V)}" · .available "${claimsField(t,'granary.available',V)}" · .band "${claimsField(t,'granary.band',V)}"\n   ${t}`);
}
