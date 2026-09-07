import { loadStateLeaves } from '../laneINSTR/tests/helpers/dossierCorpus.js';
import { fillSites, composedFillByBlock } from '../laneINSTR/tests/helpers/dossierComposedFill.js';
const OBJECT_SLOTS = ['good','resource','ruin','steading','calamity','asset'];
const INSTITUTION_SLOTS = ['institution','seat','govFaction','governing'];
const HISTORY_SLOTS = ['event','timeband_since','timeband_age'];
const leaves = await loadStateLeaves();
const blocks=[...new Set(leaves.map(e=>e.block))].sort();
const byBlock=composedFillByBlock(fillSites());
const rows=blocks.map(b=>{
  const row=byBlock.get(b); const slots=row?row.slots:null;
  if (!slots) return {b, members:null};
  const m=['V1'];
  if (slots.some(s=>OBJECT_SLOTS.includes(s))) m.push('V4');
  if (slots.some(s=>INSTITUTION_SLOTS.includes(s))) m.push('V5');
  if (slots.some(s=>HISTORY_SLOTS.includes(s))) m.push('V7');
  return {b, members:m, slots};
});
const tally=new Map();
for (const r of rows) { const k = r.members? r.members.length : 'no bag'; tally.set(k,(tally.get(k)||0)+1); }
console.log('LICENSED LEVEL-1 MEMBERS on the COMPOSED FILL, per block:');
for (const [k,v] of [...tally].sort()) console.log(`   ${String(k).padStart(7)} member(s): ${v} blocks`);
console.log(`\nblocks licensing ONE member only (V1 — the bare PRESENT): ${rows.filter(r=>r.members&&r.members.length===1).length} of ${blocks.length}`);
console.log('   ' + rows.filter(r=>r.members&&r.members.length===1).map(r=>r.b).join(', '));
console.log(`\nblocks licensing 2+ : ${rows.filter(r=>r.members&&r.members.length>1).map(r=>r.b+'('+r.members.join('/')+')').join(', ')}`);
console.log(`\nNOT-EXECUTABLE members on every block today: V2 (no structural-consequence field), V3/V8 (no typed none-exists / not-held field), V6 (no typed unresolved/contested/pending STATE field — SITTING A12)`);
