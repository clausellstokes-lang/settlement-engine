// Theme tally: per size, the share of a town's printed hooks (all cards) holding each theme, and the share of towns
// whose cards hold it at least once. Usage: node themetally.mjs <tree>
import { bornAll } from './born.mjs';
const L = process.argv[2]; const { towns } = await bornAll(L);
const { themeOfText } = await import(`${L}/src/domain/hookThemes.js`);
for (const size of ['town', 'city', 'metropolis']) { const g = towns.filter((t) => t.tier === size); const c = new Map(); let n = 0; const tw = new Map();
  for (const t of g) { const seen = new Set(); for (const p of t.npcs) for (const h of p.plotHooks || []) { const th = themeOfText(h); c.set(th, (c.get(th) || 0) + 1); n++; seen.add(th); } for (const th of seen) tw.set(th, (tw.get(th) || 0) + 1); }
  console.log(`== ${size}: ${n} hooks in ${g.length} towns (mean ${(n / g.length).toFixed(1)} a town)`);
  for (const [th, k] of [...c].sort((a, b) => b[1] - a[1])) console.log(`  ${th.padEnd(20)} ${String(k).padStart(5)} ${(100 * k / n).toFixed(1).padStart(5)}% of hooks; mean ${(k / g.length).toFixed(2)} a town`); }
