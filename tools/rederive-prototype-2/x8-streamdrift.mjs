/** Does the S8 seam keep assembleSettlement's draw budget stable, while S1's moves? */
import { instrumentedRoot, runHeadless, getStepOrder } from './instrument.mjs';
import { h, clone, keyOf, rows9 } from './lib.mjs';
const CH = ['npcs', 'relationships', 'factions', 'conflicts'];
console.log('row\tbaseline assembly draws\tS1 (record pins)\tS8 (pin inside enrichNpcCoherence)');
for (const row of rows9()) {
  const i0 = instrumentedRoot(row._seed); const rec = runHeadless(row, i0.root).settlement;
  const d0 = i0.perStep.get('assembleSettlement').draws;
  const pins = () => Object.fromEntries(CH.map(k => [k, clone(rec[k])]));
  const i1 = instrumentedRoot(row._seed); runHeadless(row, i1.root, { pins: pins() });
  const d1 = i1.perStep.get('assembleSettlement').draws;
  globalThis.__FN_OVERRIDE__ = { enrichNpcCoherence: () => clone(rec.npcs) };
  const i2 = instrumentedRoot(row._seed); runHeadless(row, i2.root, { pins: pins() });
  globalThis.__FN_OVERRIDE__ = null;
  const d2 = i2.perStep.get('assembleSettlement').draws;
  console.log(`${keyOf(row)}\t${d0}\t${d1}${d1 === d0 ? '' : ' ⚠'}\t${d2}${d2 === d0 ? '' : ' ⚠'}`);
}
