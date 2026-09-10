// READ-ONLY. Reproduces INSTR-912 car 5's unrendered-facts census and the composed-fill
// slot census from the instruments' own helper, at skepINSTR (74a1aa0e8).
import { unrenderedFacts, fillSites, composedFillByBlock } from '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/26b2203a-14d7-409e-a7aa-8d0f3b0517db/scratchpad/skepINSTR/tests/helpers/dossierComposedFill.js';

const rows = unrenderedFacts();
let H = 0, R = 0, K = 0;
console.log('=== UNRENDERED-FACTS CENSUS ===');
for (const r of rows) {
  H += r.held.length; R += r.rendered.length; K += r.keyOnly.length;
  console.log(`${r.file.split('/').pop().padEnd(24)} holds ${String(r.held.length).padStart(3)} · rendered ${String(r.rendered.length).padStart(2)} · KEY-ONLY ${String(r.keyOnly.length).padStart(3)}`);
}
console.log(`TOTAL: holds ${H} · rendered ${R} · key-only ${K} (${Math.round(100*K/H)}%)`);
console.log('\n=== PER COMPOSER, THE FULL LISTS ===');
for (const r of rows) {
  console.log(`\n--- ${r.file}`);
  console.log('RENDERED: ' + (r.rendered.join(', ') || '(none)'));
  console.log('KEY-ONLY: ' + (r.keyOnly.join(', ') || '(none)'));
}

console.log('\n=== FILL SITES (composer, block, pool expr, slots) ===');
const sites = fillSites();
console.log(`sites: ${sites.length}`);
for (const s of sites) {
  console.log(`${s.file.split('/').pop()}:${s.line} block=${s.block} pool=${s.poolExpr} slots=[${s.slots.join(',')}] cond=[${s.conditional.join(',')}]${s.via ? ' via ' + s.via : ''}${s.unresolved.length ? ' UNRESOLVED=' + JSON.stringify(s.unresolved) : ''}`);
}

console.log('\n=== COMPOSED FILL BY BLOCK ===');
const byBlock = composedFillByBlock(sites);
const only = [];
const none = [];
for (const [block, row] of [...byBlock.entries()].sort()) {
  console.log(`${block.padEnd(14)} slots=[${row.slots.join(',')}] cond=[${row.conditional.join(',')}] sites=${row.sites.length}`);
  if (row.slots.length === 1 && row.slots[0] === 'settlement') only.push(block);
  if (row.slots.length === 0) none.push(block);
}
console.log(`\nblocks seen: ${byBlock.size}`);
console.log(`settlement-ONLY bag (${only.length}): ${only.join(' · ')}`);
console.log(`no bag at all (${none.length}): ${none.join(' · ')}`);
