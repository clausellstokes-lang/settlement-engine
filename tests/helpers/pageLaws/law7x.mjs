// BAR7-AUDIT-I · LAW 7 WIDENED · 7x AN ORDINARY DAY UNDER AN OCCUPATION: a line that shows the town's own officers ruling
// freely (one audience gets a quick decision; a season planned on the seat's word; everyone knows who decides) printed
// under an occupation, where the page says the occupiers decide. The positive control C40850 (the power desk's DS-POW-5
// "autocrat" line, declared `no crisis: succession` only). FREE_RULE is the curated list of such lines in the power,
// general and economy desks (`src/data/dossierStateProse/{power,general,economy}.generated.js`; the static count is
// `docs/chair/2026-11-17/bar7/AUDIT/staticI.mjs`). Pure; reads one town read by `pageB.mjs :: readTown`; no I/O.
import { sentences } from './pageB.mjs';

export const FREE_RULE = /\b(one audience with the .+? gets a decision, good or bad, and it comes quickly|the answer comes quickly, and asking again seldom gets a different one|can plan a season ahead on its word|knows who decides, and nobody expects that to change this season|Every decision about .+? is taken by .+?, and every answer comes from there|what it decides carries in most quarters|it can make an unpopular decision and still be obeyed|there is nobody else to be sent to\. .+? decides|decides things the way a business does|what the hall decides is decided by that combination|Soldiers carry out the .+?'s orders)\b/;
/** the page's own lines that the occupiers decide */
const OCC_DECIDES = /\b(nothing it decides stands without the occupiers' approval|carries out what Occupation Authority decides|all significant decisions require approval or reversal|Keeping order in .+? is the occupiers' business now|The occupiers decide)\b/;
const SELF_MARKED = /\b(occupi\w+|before the|used to|no longer|until the)\b/i;

export function law7x(T, town) {
  if (!T.crises.has('occupied')) return [];
  const all = T.all.filter((x) => /^(Summary|Systems|World|Notes)\//.test(x.tab));
  let ag = null;
  for (const x of all) { if (OCC_DECIDES.test(x.text)) { ag = { tab: x.tab, line: sentences(x.text).find((s) => OCC_DECIDES.test(s)) || x.text }; break; } }
  const out = [];
  for (const x of all) {
    if (!FREE_RULE.test(x.text)) continue;
    for (const s of sentences(x.text)) {
      if (!FREE_RULE.test(s) || SELF_MARKED.test(s)) continue;
      out.push({ law: 'L7', rule: '7x.occupied-seat', town, tab: x.tab, line: x.text, sentence: s, cause: 'crisis',
        against: ag || { tab: 'record', line: 'stress.type = occupied' }, status: ag ? 'count' : 'apart',
        why: ag ? `the page prints "${ag.line}"; this unmarked line has the town's own seat deciding freely under the occupation` : 'under an occupation, the town\'s own seat deciding freely; the page prints no line that the occupiers decide (apart)' });
    }
  }
  return out;
}
