import { unrenderedFacts } from '../laneINSTR/tests/helpers/dossierComposedFill.js';
const rows = unrenderedFacts();
let heldT=0, rendT=0;
for (const r of rows) {
  heldT += r.held.length; rendT += r.rendered.length;
  console.log(`\n=== ${r.file.split('/').pop()}  holds ${r.held.length} typed facts · renders ${r.rendered.length} · KEY-ONLY ${r.keyOnly.length}`);
  console.log('   key-only (a candidate for a new pool key): ' + r.keyOnly.map(f=>f.replace(/^readings\./,'r.').replace(/^settlement\./,'s.')).join(', '));
}
console.log(`\nTOTAL over the six composers: held ${heldT} · rendered ${rendT} · UNRENDERED ${heldT-rendT} (${((heldT-rendT)/heldT*100).toFixed(0)}%)`);
