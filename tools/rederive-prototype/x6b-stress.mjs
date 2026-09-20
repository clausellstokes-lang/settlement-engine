/**
 * X6b — the `summaryRoll` hazard: `assembleSettlement` re-renders each stress entry's summary
 * with the settlement name and then DELETES the token it rendered from. A record therefore
 * cannot re-render its own stress summary. Measured by holding `stress` from the record and
 * changing the culture (which changes the settlement's NAME).
 * usage: node --import ./hook.mjs x6b-stress.mjs
 */
import { instrumentedRoot, runHeadless } from './instrument.mjs';
import { h, clone, keyOf, sample63 } from './lib.mjs';

const STRESS_PRODUCERS = ['resolveStress', 'isolationPass', 'stressConfirmPass'];
for (const row of [sample63().find(r => r.settType === 'town'), sample63().find(r => r.settType === 'city')]) {
  const rec = runHeadless(row, instrumentedRoot(row._seed).root).settlement;
  const heldStress = clone(rec.stress);
  const hasRoll = (Array.isArray(heldStress) ? heldStress : [heldStress]).filter(e => e && Object.prototype.hasOwnProperty.call(e, 'summaryRoll')).length;
  const row2 = { ...row, culture: 'norse' };
  const free = runHeadless(row2, instrumentedRoot(row2._seed).root).settlement;
  const held = runHeadless(row2, instrumentedRoot(row2._seed).root, {
    onStep: (n, c) => { if (STRESS_PRODUCERS.includes(n)) c.stress = clone(heldStress); },
  }).settlement;
  const s = (x) => (Array.isArray(x?.stress) ? x.stress : [x?.stress]).map(e => e?.summary).filter(Boolean);
  console.log(`\n${keyOf(row)}`);
  console.log(`  record.stress entries carrying summaryRoll: ${hasRoll}   (record.name="${rec.name}")`);
  console.log(`  culture→norse, stress FREE : name="${free.name}"  summary[0]="${(s(free)[0] || '').slice(0, 90)}"`);
  console.log(`  culture→norse, stress HELD : name="${held.name}"  summary[0]="${(s(held)[0] || '').slice(0, 90)}"`);
  console.log(`  held summary still names the OLD settlement: ${(s(held)[0] || '').includes(rec.name)}`);
}
