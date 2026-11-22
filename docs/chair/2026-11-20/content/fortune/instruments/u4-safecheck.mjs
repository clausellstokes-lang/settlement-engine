// U4 (FS7 step 4): run from the tree's root: node <this> <births.json from u4-births.mjs>
// Is the breakdown's safety term the one the card's own safety label gives, under the law the town was born under?
import { readFileSync } from 'node:fs';
const a = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const { computePublicLegitimacy } = await import(process.cwd() + '/src/generators/factionDynamics.js');
let n = 0, dis = 0;
for (const r of a) { n++;
  const want = computePublicLegitimacy({ prosperity: 'Moderate', safetyProfile: { safetyLabel: r.safety }, foodSecurity: { label: 'Secure' } }, null, r.size, r.law).breakdown.safety;
  if (want !== r.breakdown.safety) { dis++; console.log('DISAGREE', r.law, r.size, r.seed, r.safety, 'term', r.breakdown.safety, 'card-would-be', want); } }
console.log(`read ${n}; the safety term disagrees with the card's own label in ${dis}`);
