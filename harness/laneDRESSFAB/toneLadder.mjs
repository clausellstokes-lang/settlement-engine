#!/usr/bin/env node
/** DRESS-FABRIC · the tone ladder printed with every pair the page's value hierarchy rests on. */
import { tones, valueCensus, contrast, GRAIN } from '../../src/domain/townMap/fabric/partitionDress.js';
import { resolveLens, luminance, LENS_IDS } from '../../src/domain/townMap/fabric/folioLenses.js';
const only = process.argv.includes('--all') ? [...LENS_IDS] : ['parchment'];
for (const id of only) {
  const L = resolveLens(id);
  const T = tones(L, {});
  console.log(`\n═══ LENS ${id} ═══   paper ${T.paper} (lum ${luminance(T.paper).toFixed(4)})`);
  for (const k of ['field', 'grain', 'street', 'plotGround', 'voidGround', 'built', 'roofSE', 'eaves', 'water', 'ink', 'wall']) {
    console.log(`  ${k.padEnd(12)} ${T[k]}  lum ${luminance(T[k]).toFixed(4)}  vs paper ${contrast(T.paper, T[k]).toFixed(3)}`);
  }
  const pairs = [
    ['field:paper', T.paper, T.field], ['grain:paper', T.paper, T.grain],
    ['field:street', T.street, T.field], ['grain:street', T.street, T.grain],
    ['field:plotGround', T.plotGround, T.field], ['grain:plotGround', T.plotGround, T.grain],
    ['field:built', T.built, T.field], ['grain:built', T.built, T.grain],
    ['built:paper', T.paper, T.built],
  ];
  console.log('  ── the hierarchy pairs the countryside is in ──');
  for (const [n, a, b] of pairs) {
    const darker = luminance(b) < luminance(a) ? 'FIELD-SIDE DARKER' : 'town-side darker';
    console.log(`  ${n.padEnd(18)} ${contrast(a, b).toFixed(3)}   ${darker}`);
  }
  console.log(`  GRAIN stroke ${GRAIN.stroke} opacity ${GRAIN.opacity}`);
  console.log(`  valueCensus: ${valueCensus(T).reason}`);
}
