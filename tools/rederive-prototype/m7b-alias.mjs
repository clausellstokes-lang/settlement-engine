/**
 * THE PIN ALIASING HAZARD, executed.
 * `corruptionPass` declares `mutates: [factions, npcs]` and mutates the ctx arrays IN PLACE.
 * A pin bag built from a record/context hands the runner THOSE SAME ARRAY OBJECTS, so a
 * pinned run can write through the pin into the caller's own record.
 * EM-P0's A6 asserts pins are unmutated — at ONE config, where corruptionPass draws 0.
 *
 * usage: node --import ./hook.mjs m7b-alias.mjs
 */
import { createHash } from 'node:crypto';
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';

const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);
const h = (v) => createHash('sha1').update(String(JSON.stringify(v))).digest('hex').slice(0, 16);
const CHOOSERS = ['npcs', 'relationships', 'factions', 'conflicts'];

const rows = [
  { settType: 'town', culture: 'germanic', terrainOverride: 'riverside', tradeRouteAccess: 'river', monsterThreat: 'civilized', _seed: 'em-p0-pinned-mode' },
  ...goldenCorpus().filter((_, i) => i % 71 === 0),
];

console.log('row\tcorruptionDraws\tPINS-FROM-CTX mutated?\tRECORD mutated by a ctx-pin run?\tPINS-FROM-RECORD mutated?');
for (const row of rows) {
  const inst = instrumentedRoot(row._seed);
  const base = runHeadless(row, inst.root);
  const corrupt = inst.perStep.get('corruptionPass').draws;

  const ctxPins = Object.fromEntries(CHOOSERS.map(k => [k, base[k]]));
  const ctxBefore = h(ctxPins);
  const recBefore = h(base.settlement);
  runHeadless(row, instrumentedRoot(row._seed).root, { pins: ctxPins });
  const ctxAfter = h(ctxPins);
  const recAfter = h(base.settlement);

  const base2 = runHeadless(row, instrumentedRoot(row._seed).root);
  const recPins = Object.fromEntries(CHOOSERS.map(k => [k, base2.settlement[k]]));
  const rpBefore = h(recPins);
  runHeadless(row, instrumentedRoot(row._seed).root, { pins: recPins });
  const rpAfter = h(recPins);

  console.log(`${keyOf(row)}\t${corrupt}\t${ctxBefore !== ctxAfter}\t${recBefore !== recAfter}\t${rpBefore !== rpAfter}`);
}
