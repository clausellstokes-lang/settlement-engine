import { buildIndex, edgeMapOf, surfaceClosures } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT/scripts/lib/writer-reach-scan.mjs';
import { sourceFiles } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT/scripts/check-observed-shape-readers.mjs';
const root = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneLMAT';
const files = sourceFiles(root);
const index = buildIndex(files);
const edges = edgeMapOf(index);
const rel = (f) => f.startsWith(root) ? f.slice(root.length + 1) : f;
const base = surfaceClosures({ edgesByFile: edges, root });
const wt = new Set([...base.closures['web-transitive']].map(rel));
const wd = new Set([...base.closures['web-display']].map(rel));
const probe = [
  'src/lib/importReconciliationAdmission.js',
  'src/lib/accountSettlementContentPortability.js',
  'src/domain/content/settlementContentProvenance.js',
  'src/domain/content/livingContentLawVersion.js',
  'src/lib/importScrub.js',
  'src/domain/density/densityCreateBoundary.js',
  'src/store/accountImportBody.js',
];
console.log('=== BASE (dock tip) membership ===');
for (const p of probe) console.log(p, '| web-transitive:', wt.has(p), '| web-display:', wd.has(p));
console.log('closure sizes', Object.fromEntries(Object.entries(base.closures).map(([k,v])=>[k,v.size])));

// COUNTERFACTUAL: add the remapper import edge to importReconciliationAdmission.js
const admission = [...edges.keys()].find((f) => rel(f) === 'src/lib/importReconciliationAdmission.js');
const port = [...edges.keys()].find((f) => rel(f) === 'src/lib/accountSettlementContentPortability.js');
const edges2 = new Map(edges);
edges2.set(admission, [...(edges.get(admission) || []), port]);
const cf = surfaceClosures({ edgesByFile: edges2, root });
const wt2 = new Set([...cf.closures['web-transitive']].map(rel));
console.log('=== COUNTERFACTUAL (remap import added) ===');
for (const p of probe) console.log(p, '| web-transitive:', wt2.has(p));
const added = [...wt2].filter((p) => !wt.has(p));
console.log('ADDED to web-transitive:', added);
console.log('sizes', Object.fromEntries(Object.entries(cf.closures).map(([k,v])=>[k,v.size])));
