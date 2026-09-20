/**
 * The pin diagnosis: THREE sources for the same four pins, over every tier.
 *   (1) POST-STEP  — ctx right after generatePopulation returned (what the step produced)
 *   (2) FINAL CTX  — the end-of-pipeline ctx (what EM-P0's landed A2 uses)
 *   (3) THE RECORD — settlement.npcs/... (what the runner's `Pins` typedef and
 *                    `rederive(record, …)` can actually reach)
 *
 * usage: node --import ./hook.mjs m7-pin-diagnosis.mjs
 */
import { createHash } from 'node:crypto';
import { instrumentedRoot, runHeadless, TREE } from './instrument.mjs';

const { goldenCorpus, keyOf } = await import(`${TREE}/tests/helpers/goldenMasterCorpus.js`);
const h = (v) => { let s; try { s = JSON.stringify(v); } catch { s = String(v); } return createHash('sha1').update(String(s)).digest('hex').slice(0, 16); };
const CHOOSERS = ['npcs', 'relationships', 'factions', 'conflicts'];
const STEP = 'generatePopulation';

// one row per tier, plus EM-P0's own acceptance config
const rows = [
  { settType: 'town', culture: 'germanic', terrainOverride: 'riverside', tradeRouteAccess: 'river', monsterThreat: 'civilized', _seed: 'em-p0-pinned-mode' },
  ...goldenCorpus().filter((_, i) => i % 71 === 0),
];

console.log('row\tpostStepPin\tfinalCtxPin\trecordPin\tcorruptionPassDrew\tpostStep!=finalCtx\tfinalCtx!=record');
const tally = { post: 0, final: 0, record: 0 };
for (const row of rows) {
  let postStep = null;
  const base = runHeadless(row, instrumentedRoot(row._seed).root, {
    onStep: (name, ctx) => { if (name === STEP) postStep = Object.fromEntries(CHOOSERS.map(k => [k, JSON.parse(JSON.stringify(ctx[k]))])); },
  });
  const inst = instrumentedRoot(row._seed);
  runHeadless(row, inst.root);
  const corrupt = inst.perStep.get('corruptionPass').draws;
  const target = h(base.settlement);
  const finalCtx = Object.fromEntries(CHOOSERS.map(k => [k, base[k]]));
  const record = Object.fromEntries(CHOOSERS.map(k => [k, base.settlement[k]]));
  const run = (pins) => { try { return h(runHeadless(row, instrumentedRoot(row._seed).root, { pins }).settlement); } catch (e) { return `THREW:${e.message.slice(0, 40)}`; } };
  const a = run(postStep) === target; const b = run(finalCtx) === target; const c = run(record) === target;
  if (a) tally.post += 1; if (b) tally.final += 1; if (c) tally.record += 1;
  const dPF = CHOOSERS.filter(k => h(postStep[k]) !== h(finalCtx[k]));
  const dFR = CHOOSERS.filter(k => h(finalCtx[k]) !== h(record[k]));
  console.log(`${keyOf(row)}\t${a}\t${b}\t${c}\t${corrupt}\t[${dPF.join('|')}]\t[${dFR.join('|')}]`);
}
console.log(`\nreproduces the record: POST-STEP ${tally.post}/${rows.length} · FINAL-CTX ${tally.final}/${rows.length} · RECORD ${tally.record}/${rows.length}`);
