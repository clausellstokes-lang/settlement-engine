// V-FS-r2 probe (FS-V3): does a refusal against a raised hand STAND long enough for D.8's
// time-based completion (13 weeks per step) under master's own commons ladder and price?
// Arithmetic over master's constants: the weekly coercive price at the RAISED bands (FS §4.2 —
// the price follows the raised band every week, A1.16), legitimacy falling by that price only
// (the rung dips and POP-2's pressed-through dip are IGNORED — they only make it faster),
// commonsGrievance01 on master with FS's DRAFT exaction row added (W 0.30 × input, cap 0.30),
// against master's riot threshold RUNG_RIOT 0.75 (target rung 3).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const T = await import(M + '/src/domain/worldPulse/treasury.js');
const CVK = await import(M + '/src/domain/worldPulse/commonsVoiceKernel.js');
const B = T.TAX_RATE_BANDS, P = T.TREASURY_TUNING.LEGITIMACY_PRICE_BY_BAND, CAP = T.TREASURY_TUNING.LEGITIMACY_PRICE_CAP;
const step = (band, hand, coercive) => {
  if (band === 'none') return band;
  const i = B.indexOf(band); const s = hand === 'wringing' ? 2 : hand === 'exacting' ? 1 : 0;
  const capIdx = coercive ? B.indexOf('extractive') : B.indexOf('heavy');
  return B[Math.max(i, Math.min(capIdx, i + s))];
};
const fixture = (L) => ({ powerStructure: { publicLegitimacy: { score: L } }, stressors: [] });
const out = [];
for (const power of Object.keys(T.TAX_PROFILE).sort()) {
  for (const hand of ['exacting', 'wringing']) {
    const row = T.TAX_PROFILE[power];
    let price = 0;
    for (const form of T.TAX_FORMS) {
      if (form === 'tithe_share') continue;
      const coercive = T.isCoerciveCell(power, form);
      if (!coercive) continue;
      price += P[step(row[form], hand, coercive)] || 0;
    }
    const weekly = Math.min(CAP, Math.round(price));
    const exaction = hand === 'wringing' ? 0.30 : 0.15;
    for (const L0 of [60, 45]) {
      let L = L0, w = 0, g = 0;
      while (w < 60) { g = Math.min(1, CVK.commonsGrievance01(fixture(L)) + exaction); if (g >= 0.75) break; L = Math.max(0, L - weekly); w++; }
      out.push(`${power.padEnd(16)} ${hand.padEnd(9)} price/wk=${weekly} L0=${L0}: grievance reaches riot (0.75) after ${w >= 60 ? '>60' : w} weeks (L=${L})`);
    }
  }
}
console.log(out.join('\n'));
