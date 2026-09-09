// read-only: print pools + variants (angle, marks, slots, text length, first 6 words) for named blocks
import { DOSSIER_STATE_PROSE_DEFENSE } from '../laneB6/src/data/dossierStateProse/defense.generated.js';
import { DOSSIER_STATE_PROSE_GENERAL } from '../laneB6/src/data/dossierStateProse/general.generated.js';
import { DOSSIER_STATE_PROSE_ECONOMY } from '../laneB6/src/data/dossierStateProse/economy.generated.js';
const want = process.argv.slice(2);
const corp = { ...DOSSIER_STATE_PROSE_DEFENSE, ...DOSSIER_STATE_PROSE_GENERAL, ...DOSSIER_STATE_PROSE_ECONOMY };
for (const id of want) {
  const b = corp[id]; if (!b) { console.log('NO BLOCK', id); continue; }
  console.log(`\n=== ${id} :: ${b.title}`);
  console.log(`slots=${JSON.stringify(b.slots)} sectionTarget=${JSON.stringify(b.sectionTarget||[])}`);
  for (const [k, vs] of Object.entries(b.pools)) {
    console.log(`  POOL "${k}" (${vs.length})`);
    for (const v of vs) {
      const words = v.text.split(/\s+/);
      console.log(`     [${v.angle}${v.marks?' · '+v.marks.join(','):''}] slots=${JSON.stringify(v.slots)} ${words.length}w sents=${v.text.split(/(?<=[.?!])\s+(?=[A-Z])/).length} :: ${words.slice(0,6).join(' ')} …`);
    }
  }
}
