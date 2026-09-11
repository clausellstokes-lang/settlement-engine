import { DOSSIER_STATE_PROSE_DEFENSE } from '../laneB6/src/data/dossierStateProse/defense.generated.js';
for (const id of ['DS-DEF-11','DS-DEF-2']) {
  const b = DOSSIER_STATE_PROSE_DEFENSE[id];
  if (!b) { console.log(id, 'MISSING'); continue; }
  console.log('=== ' + id + ' | slots=' + JSON.stringify(b.slots||[]) + ' | pools=' + Object.keys(b.pools).length);
  for (const [k,v] of Object.entries(b.pools)) {
    console.log('   pool: ' + JSON.stringify(k) + '  variants=' + v.length + '  angles=' + v.map(x=>x.angle||'-').join(','));
  }
}
