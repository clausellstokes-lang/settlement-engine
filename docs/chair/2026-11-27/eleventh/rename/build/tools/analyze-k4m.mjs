// K4: per rename path, the card kinds whose ids a rename re-keys (towns, ids lost), and the DM's hide made before the rename,
// read after it on the served record; by size
import { readFileSync, existsSync } from 'node:fs';
for (const C of ['C', 'V']) {
  const f = `/home/user/scratch/work/K4M-${C}.jsonl`; if (!existsSync(f)) continue;
  const L = readFileSync(f, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const R = { births: 0, errors: 0, idsHeld: {}, withIdOf: { npc: [0, 0], institution: [0, 0], faction: [0, 0] }, paths: {} };
  for (const j of L) { if (j.error) { R.errors++; continue; } R.births++;
    for (const [k, n] of Object.entries(j.ids)) R.idsHeld[k] = (R.idsHeld[k] || 0) + n;
    for (const k of ['npc', 'institution', 'faction']) { R.withIdOf[k][0] += j.withIdCount[k]; R.withIdOf[k][1] += j.ids[k]; }
    for (const [p, v] of Object.entries(j.paths)) { const P = (R.paths[p] ||= { renamed: 0, townsReKeyed: 0, lostByKind: {}, hide: { tested: 0, hiddenBefore: 0, liftedAfter: 0 }, liftedBySize: {} });
      if (v.skip) continue; P.renamed++; if (Object.keys(v.lost).length) P.townsReKeyed++;
      for (const [k, n] of Object.entries(v.lost)) { P.lostByKind[k] ||= { towns: 0, ids: 0 }; P.lostByKind[k].towns++; P.lostByKind[k].ids += n; }
      if (v.hide && !v.hide.noDescription) { P.hide.tested++; if (v.hide.hiddenBefore) P.hide.hiddenBefore++; if (v.hide.hiddenBefore && !v.hide.hiddenAfter) { P.hide.liftedAfter++; P.liftedBySize[j.size] = (P.liftedBySize[j.size] || 0) + 1; } } } }
  console.log(`== ${C}`, JSON.stringify(R, null, 1));
}
