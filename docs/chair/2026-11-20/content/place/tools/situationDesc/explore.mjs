// PLACE-1 · situationDesc MEASURE: a look at the goods the medium-branch places carry (section C's raw read).
//   node explore.mjs rows-plain.json > explore.out.txt
import { readFileSync } from 'node:fs';
const rows = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const top = (arr, k = 12) => { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1); return [...m].sort((a, b) => b[1] - a[1]).slice(0, k).map(([x, c]) => `${c}× ${x}`).join(' | '); };
for (const size of SIZES) {
  const med = rows.filter((r) => r.size === size && r.branch === 'medium');
  console.log(`\n== ${size}: ${med.length} medium`);
  console.log('lead export (record):', top(med.map((r) => r.exports[0] ?? '(none)')));
  console.log('lead export (printed):', top(med.map((r) => r.printed.exports[0] ?? '(none)')));
  console.log('lead import (record):', top(med.map((r) => r.imports[0] ?? '(none)')));
  console.log('lead import (printed):', top(med.map((r) => r.printed.imports[0] ?? '(none)')));
  console.log('route:', top(med.map((r) => r.facts.route)), '· market:', top(med.map((r) => String(r.facts.market))), '· guild:', top(med.map((r) => String(r.facts.guild))));
  console.log('prosperity:', top(med.map((r) => r.prosperity)), '· crisis:', top(med.map((r) => String(r.facts.crisisActive))));
}
