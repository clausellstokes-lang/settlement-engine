// probe-reach.mjs — READ-ONLY chair probe: at the §891 train tip, how does the writer-reach
// scanner grade `situationDesc on economicState` and `_seed on settlement`, and which files
// carry the R / N reads? Run from the dock: node <this file> <dockRoot> <outJson>
import { join } from 'node:path';
import { writeFileSync } from 'node:fs';

const root = process.argv[2];
const out = process.argv[3];
const { measure, liveViewOf } = await import(join(root, 'scripts/check-writer-reach.mjs'));
const { formatReach } = await import(join(root, 'scripts/lib/writer-reach-scan.mjs'));

const t0 = Date.now();
const m = await measure({ root });
const live = liveViewOf(m);
const rel = (f) => (f.startsWith(root) ? f.slice(root.length + 1) : f);
const ids = ['situationDesc on economicState', '_seed on settlement', 'prosperity on economicState', 'economicComplexity on economicState'];
const result = { root, ms: Date.now() - t0, closureSizes: live.closureSizes, population: live.population, identities: {} };
for (const id of ids) {
  const reads = m.reads.get(id) || { R: new Set(), N: new Set() };
  const row = m.verdicts.get(id);
  result.identities[id] = {
    verdict: row ? row.verdict : null,
    reach: row ? formatReach(row.reach) : null,
    R: [...reads.R].map(rel).sort(),
    N: [...reads.N].map(rel).sort(),
  };
}
const glance = join(root, 'src/components/new/tabs/EconomicsGlance.jsx');
const tab = join(root, 'src/components/new/tabs/EconomicsTab.jsx');
result.closureMembership = {
  'EconomicsGlance.jsx in web-display': m.closures['web-display'].has(glance),
  'EconomicsTab.jsx in web-display': m.closures['web-display'].has(tab),
  'EconomicsGlance.jsx in web-transitive': m.closures['web-transitive'].has(glance),
};
writeFileSync(out, JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
