#!/usr/bin/env node
// BIRTH-1 D7, THE CHECK OVER EVERY BIRTH: node check-d7.mjs <births.jsonl from measure-d7.mjs> [label]
// The rule: no crisis line (the power step's sentence, the pressure line) names a local body of the crisis (the creditor's agent
// or representative; "two priests, two congregations") where the settled roster holds none of the crisis's own powers.
// THE ORACLE is independent of the tree's leaf (`crisisBody.js`): the crisis's own powers BY NAME, read off the roster names
// (`power/stressFactions.js` at the base). Also reported: where the leaf's reading (the measure's `holds`) and the oracle differ.
import { readFileSync } from 'node:fs';
const [file, label = ''] = process.argv.slice(2);
const OWN = { indebted: /Creditor/, religious_conversion: /^(New Faith Community|Reform Congregation|Conversion Enforcement Office|Underground Old Faith)$/ };
const NAMING = [["The creditor's agent has blocked the money for repairs.", 'indebted'], ['In public they talk of prudence;', 'indebted'],
  ["the creditor's representative arrived last month", 'indebted'], ['two priests, two congregations', 'religious_conversion']];
const TWINS = ['Word from the creditor has blocked the money for repairs.', 'In public those in charge talk of prudence;', "the creditor's letters began last month",
  'the converts keep their own register'];
const rows = readFileSync(file, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
let bad = 0, kept = 0, twins = 0, disagree = 0; const badSeeds = [];
for (const r of rows) {
  // the roster names exclude the seat: the measure's roster is every power; the seat is the governing name
  const held = (kind) => r.roster.some((n) => n !== r.seat && OWN[kind].test(String(n)));
  const text = `${r.recentConflict ?? ''}\n${r.pressure ?? ''}`;
  let b = false;
  for (const [w, kind] of NAMING) if (text.includes(w)) { if (held(kind)) kept++; else b = true; }
  if (b) { bad++; badSeeds.push(r.seed); }
  if (TWINS.some((t) => text.includes(t))) twins++;
  for (const kind of Object.keys(OWN)) if (r.holds && Object.hasOwn(r.holds, kind) && r.holds[kind] !== held(kind)) disagree++;
}
console.log(`${label} births ${rows.length}: naming an absent body ${bad}${badSeeds.length ? ` (${badSeeds.join(' ')})` : ''}; naming lines kept beside their body ${kept}; births printing a twin ${twins}; leaf vs oracle disagreements ${disagree}`);
process.exitCode = bad ? 1 : 0;
