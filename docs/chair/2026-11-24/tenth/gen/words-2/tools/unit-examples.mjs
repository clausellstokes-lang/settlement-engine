// WORDS-2 · three before/after examples per unit. Usage: node unit-examples.mjs <before rows> <after rows> "UNIT,View,seed,seed,seed;..."
import { readFileSync } from 'node:fs'; import { join } from 'node:path';
const [,, BEFORE, AFTER, spec] = process.argv;
for (const item of spec.split(';')) { const [u, view, ...seeds] = item.split(','); console.log(`## ${u}`);
  for (const s of seeds) { const a = JSON.parse(readFileSync(join(BEFORE, `${s}.json`))).printed[view] || [], b = JSON.parse(readFileSync(join(AFTER, `${s}.json`))).printed[view] || [];
    const gone = a.filter((x) => !b.includes(x)), came = b.filter((x) => !a.includes(x));
    console.log(`  ${s} [${view}] - ${gone.map((x) => x.slice(0, 120)).join(' / ') || '(none)'}  + ${came.map((x) => x.slice(0, 120)).join(' / ') || '(none)'}`); } }
