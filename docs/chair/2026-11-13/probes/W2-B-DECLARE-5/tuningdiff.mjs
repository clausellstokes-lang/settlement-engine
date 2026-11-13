import { join } from 'node:path';
const root = process.argv[2];
const m = await import(join(root, 'scripts/lib/tuning-inventory.mjs'));
const live = m.measureTree(root, m.loadTuningRegister(root));
const committed = m.loadTuningInventory(root);
for (const id of Object.keys(live.tables)) { const w = committed.tables[id], n = live.tables[id]; if (!w) { console.log('NEW', id); continue; }
  for (const k of ['spanDigest','keys','idiom']) if (w[k] !== n[k]) console.log(id, k);
  if (JSON.stringify(w.leaves) !== JSON.stringify(n.leaves)) console.log(id, 'leaves');
  if (JSON.stringify(w.dependents) !== JSON.stringify(n.dependents)) { const a = new Set(w.dependents), b = new Set(n.dependents); console.log(id, 'dependents +', [...b].filter(x => !a.has(x)), '-', [...a].filter(x => !b.has(x))); } }
for (const id of Object.keys(committed.tables)) if (!live.tables[id]) console.log('GONE', id);
