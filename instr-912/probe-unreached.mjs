import { loadStateLeaves } from '../laneINSTR/tests/helpers/dossierCorpus.js';
import { fillSites, composedFillByBlock } from '../laneINSTR/tests/helpers/dossierComposedFill.js';
const r1 = await loadStateLeaves();
const blocks = [...new Set(r1.map(e=>e.block))].sort();
const byBlock = composedFillByBlock(fillSites());
const unreached = blocks.filter(b=>!byBlock.has(b));
console.log('leaf blocks', blocks.length, '| with a composer bag', blocks.filter(b=>byBlock.has(b)).length, '| UNREACHED', unreached.length);
console.log('unreached:', unreached.join(', '));
for (const b of unreached) {
  const vs = r1.filter(e=>e.block===b);
  console.log(`   ${b}: ${vs.length} variants in ${new Set(vs.map(v=>v.poolId)).size} pools`);
}
// the three brief-named measured cases
for (const [b,p] of [['DS-POW-5','line5'],['DS-GEN-18','craftSlots'],['DS-ECO-11','exploitSlots']]) {
  const row = byBlock.get(b);
  console.log(`\n${b} (${p}) composed union = [${row.slots.join(', ')}]  conditional=[${row.conditional.join(', ')}]`);
  for (const s of row.sites) console.log('    site', s.file.split('/').pop()+':'+s.line, 'pool='+s.poolExpr, 'slots=['+s.slots.join(',')+']');
}
