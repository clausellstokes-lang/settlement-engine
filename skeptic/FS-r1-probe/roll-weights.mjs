// FS-r1 probe: the volume's own §3.3 DRAFT roll weights, applied to its §14 scenario rows 4 and 5.
// Inputs not fixed by the scenario take entityThreshold's neutral defaults (lawfulness01 = malice01 = 0.5,
// momentum.js :: entityThreshold "finiteNumber(computeLawfulness(...), 0.5)"), fragility 0 at Approved.
const STANDING = { Endorsed: 1.2, Approved: 1.1, Tolerated: 1.0, Contested: 0.8, Crisis: 0.6 };
function weights({ current, need01, standing, rungFactorRaise = 1, rung = 0, malice = 0.5, lawful = 0.5,
  fragility = 0, remissionAllowed, customHeavy }) {
  const order = ['remitting', 'wonted', 'exacting', 'wringing'];
  const i = order.indexOf(current);
  const cands = [order[i - 1], order[i], order[i + 1]].filter(Boolean);
  const w = {};
  for (const c of cands) {
    const j = order.indexOf(c);
    let x = c === current ? 3 : 1;                       // inertia
    if (j > i) {                                         // a RAISE
      x *= (0.5 + 1.5 * need01) * (malice >= 0.7 ? 1 : STANDING[standing]) * rungFactorRaise;
      if (customHeavy) x *= 0.7;
    } else if (j < i) {                                  // a REMISSION
      if (!remissionAllowed) continue;
      x *= (1.5 - need01) * (1 + fragility) * (1 + 0.5 * rung);
    }
    if (c === 'wringing') x *= 0.5 + malice;
    if (c === 'wonted') x *= 0.5 + lawful;
    if (c === 'remitting') x *= 1.5 - malice;
    w[c] = x;
  }
  const tot = Object.values(w).reduce((a, b) => a + b, 0);
  return Object.fromEntries(Object.entries(w).map(([k, v]) => [k, +(v / tot).toFixed(3)]));
}
// Row 4: a COUNCIL at peace, vault full (need = vault term 0.1, cause plenty), Approved, street silent, 8 seasons.
const r4 = weights({ current: 'wonted', need01: 0.1, standing: 'Approved', remissionAllowed: true, customHeavy: false });
console.log('row 4 first-season probabilities from wonted:', r4);
console.log('row 4 P(no raise in the first season) =', (1 - r4.exacting).toFixed(3),
  '; the row asserts ZERO exacting/wringing hands over 8 seasons');
// Row 5: an AUTOCRAT, army takes the field, vault lean (need = vault term 0.7; coffersRead score01 = 0 while
// coverage >= COVERAGE_FULL_AT 12 ticks: a lean town vault <= 600 coin over a host's 25 coin/tick = up to 24 ticks),
// Approved, street silent; custom: the autocrat's levy_extraction is 'heavy' (TAX_PROFILE) => RAISE x 0.7.
const r5 = weights({ current: 'wonted', need01: 0.7, standing: 'Approved', remissionAllowed: false, customHeavy: true });
console.log('row 5 probabilities at the war trigger:', r5,
  '; the row asserts "a hand >= exacting within the war\'s first week"');
// Row 5 with the wage term at its maximum (score01 = 1 -> +0.6; need clamped to 1):
const r5max = weights({ current: 'wonted', need01: 1, standing: 'Approved', remissionAllowed: false, customHeavy: true });
console.log('row 5 with need01 = 1 (wages at full pressure):', r5max);
