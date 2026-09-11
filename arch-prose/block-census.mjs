// READ-ONLY. Per-block pool and variant census from the SHIPPED leaves at laneB6 (3b1c0eaa5),
// joined to the composed-fill bag from the instruments' resolver.
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fillSites, composedFillByBlock } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/tests/helpers/dossierComposedFill.js';

const DIR = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/laneB6/src/data/dossierStateProse';
const files = readdirSync(DIR).filter((f) => f.endsWith('.generated.js')).sort();
const blocks = new Map();
let pools = 0, variants = 0;
const angleCount = {}; const markCount = {}; const slotDeclared = {};
for (const f of files) {
  const mod = await import(`file://${join(DIR, f)}`);
  const table = Object.values(mod)[0];
  for (const [block, b] of Object.entries(table)) {
    const poolKeys = Object.keys(b.pools || {});
    let v = 0; const declSlots = new Set(); const dims = new Set();
    for (const [pk, list] of Object.entries(b.pools || {})) {
      v += list.length;
      for (const x of list) {
        (x.slots || []).forEach((s) => declSlots.add(s));
        (x.marks || []).forEach((m) => { markCount[m] = (markCount[m] || 0) + 1; });
        if (x.angle) angleCount[x.angle] = (angleCount[x.angle] || 0) + 1;
      }
    }
    blocks.set(block, { file: f, pools: poolKeys.length, variants: v, blockSlots: b.slots || [], declSlots: [...declSlots].sort() });
    pools += poolKeys.length; variants += v;
    for (const s of declSlots) slotDeclared[s] = (slotDeclared[s] || 0) + 1;
  }
}
const byBlock = composedFillByBlock(fillSites());
console.log(`blocks ${blocks.size} · pools ${pools} · variants ${variants} · mean ${(variants/pools).toFixed(2)}/pool`);
console.log('\nblock          file        pools  variants  declaredSlots(union of variants)   bag(composer)');
for (const [id, r] of [...blocks.entries()].sort()) {
  const bag = byBlock.get(id);
  console.log(`${id.padEnd(12)} ${r.file.replace('.generated.js','').padEnd(10)} ${String(r.pools).padStart(5)} ${String(r.variants).padStart(8)}   [${r.declSlots.join(',')}]${' '.repeat(Math.max(0, 34-(r.declSlots.join(',').length+2)))} ${bag ? '['+bag.slots.join(',')+']' : 'NO CALL SITE'}`);
}
const noSite = [...blocks.keys()].filter((b) => !byBlock.has(b)).sort();
console.log(`\nblocks with NO readStateProse call site in the six composers (${noSite.length}): ${noSite.join(' · ')}`);
const declOnlySettlement = [...blocks.entries()].filter(([,r]) => r.declSlots.length===1 && r.declSlots[0]==='settlement').map(([b])=>b).sort();
const declNone = [...blocks.entries()].filter(([,r]) => r.declSlots.length===0).map(([b])=>b).sort();
console.log(`\nblocks whose VARIANTS declare only {settlement} (${declOnlySettlement.length}): ${declOnlySettlement.join(' · ')}`);
console.log(`blocks whose variants declare NO slot (${declNone.length}): ${declNone.join(' · ')}`);
console.log('\nslot → number of blocks whose variants name it:');
for (const [s,n] of Object.entries(slotDeclared).sort((a,b)=>b[1]-a[1])) console.log(`  ${s.padEnd(18)} ${n}`);
console.log('\nangle → variants:');
for (const [a,n] of Object.entries(angleCount).sort((x,y)=>y[1]-x[1])) console.log(`  ${a.padEnd(14)} ${n}`);
console.log('\nmark → variants:');
for (const [m,n] of Object.entries(markCount).sort((x,y)=>y[1]-x[1])) console.log(`  ${m.padEnd(16)} ${n}`);
