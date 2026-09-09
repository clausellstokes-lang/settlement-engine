import { loadStateLeaves } from '../laneINSTR/tests/helpers/dossierCorpus.js';
import { fillSites, composedFillByBlock } from '../laneINSTR/tests/helpers/dossierComposedFill.js';
const leaves = await loadStateLeaves();
const blocks = [...new Set(leaves.map(e=>e.block))].sort();
const byBlock = composedFillByBlock(fillSites());
const rows = blocks.map(b => {
  const row = byBlock.get(b);
  return { b, slots: row ? row.slots : null };
});
const settlementOnly = rows.filter(r => r.slots && r.slots.length===1 && r.slots[0]==='settlement');
const noBag = rows.filter(r => !r.slots);
const richer = rows.filter(r => r.slots && r.slots.length>1);
console.log(`blocks ${blocks.length} | settlement-ONLY bag ${settlementOnly.length} | richer bag ${richer.length} | NO bag ${noBag.length}`);
console.log('\nsettlement-only blocks:', settlementOnly.map(r=>r.b).join(', '));
console.log('\nricher bags:');
for (const r of richer) console.log(`   ${r.b.padEnd(12)} [${r.slots.join(', ')}]`);
