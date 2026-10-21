// D-FS-r1 probe 2 (FS-r1-14 re-check + the cured §3.3 / §10.1 weights): the DRAFT roll as CURED in round 1
// (no vault, no coffers stock read; demand = the wage bill over the custom gross; character from courtTemperOf's
// landed parts — malice, lawfulness, the SP-4 posture direction; INT-2's load at 1 where dark).
// Draws use master's own keyed hash (region/contestMath.js :: hash01), as FS10 requires.
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const { hash01 } = await import(M + '/src/domain/region/contestMath.js');
const HANDS = ['remitting', 'wonted', 'exacting', 'wringing'];
const STANDING_RAISE = { Endorsed: 1.2, Approved: 1.1, Tolerated: 1.0, Contested: 0.8, Crisis: 0.6 };
const STANDING_LIGHTER = { Endorsed: 1, Approved: 1, Tolerated: 1, Contested: 1.25, Crisis: 1.5 };
const HEARD_RAISE = [1, 0.85, 0.6, 0.35, 0.2]; // none · petition · gathering · refusal · riot
function weights(s) {
  const { current, need01, standing, rung = 0, malice = 0.5, lawful = 0.5, posture = 'neutral', customHeavy = false, load = 1 } = s;
  const i = HANDS.indexOf(current);
  const w = {};
  const bold = posture === 'lower', cautious = posture === 'raise';
  const damp = (f) => (bold ? 1 + (f - 1) / 2 : f);
  for (const j of [i - 1, i, i + 1]) {
    if (j < 0 || j >= HANDS.length) continue;
    const c = HANDS[j];
    let x = j === i ? 3 : 1;
    if (j > i) { // a RAISE — candidate only with a demand present, or a cruel seat (avarice)
      if (!(need01 > 0) && !(malice >= 0.7)) continue;
      x *= 0.25 + 1.75 * need01;
      x *= malice >= 0.7 ? 1 : STANDING_RAISE[standing];
      x *= damp(HEARD_RAISE[rung]);
      if (cautious) x *= 0.75;
      if (customHeavy) x *= 0.7;
      x *= load;
    } else if (j < i) { // a LIGHTER step
      const belowCustom = c === 'remitting';
      const fear = rung >= 2, mercy = malice <= 0.35 && (standing === 'Approved' || standing === 'Endorsed');
      if (belowCustom && !fear && !mercy) continue;
      x *= 1.5 - need01;
      x *= STANDING_LIGHTER[standing];
      x *= damp(1 + 0.5 * rung);
      if (bold && i > 1) x *= 0.75;
    }
    if (c === 'wringing') x *= 0.5 + malice;
    if (c === 'wonted') x *= 0.5 + lawful;
    if (c === 'remitting') x *= 1.5 - malice;
    w[c] = x;
  }
  const tot = Object.values(w).reduce((a, b) => a + b, 0);
  return Object.fromEntries(Object.entries(w).map(([k, v]) => [k, v / tot]));
}
function draw(w, key) { const u = hash01(key); let acc = 0; for (const h of HANDS) { if (!(h in w)) continue; acc += w[h]; if (u < acc) return h; } return Object.keys(w).pop(); }
function season(s, keys, seasons) { // returns share of (key, season) cells at >= exacting, and max step per decision
  let raised = 0, cells = 0, maxStep = 0;
  for (let k = 0; k < keys; k++) {
    let cur = s.current;
    for (let q = 0; q < seasons; q++) {
      const nxt = draw(weights({ ...s, current: cur }), `fiscal:s${k}:${q}`);
      maxStep = Math.max(maxStep, Math.abs(HANDS.indexOf(nxt) - HANDS.indexOf(cur)));
      cur = nxt; cells++; if (HANDS.indexOf(cur) >= 2) raised++;
    }
  }
  return { share: +(raised / cells).toFixed(4), maxStep };
}
// D-FS-r2 probe 4 (WS-r1-6 at FS, D.10): the posture is LIVE wherever a disposition entry exists, so §14 row 5's
// direction pin must hold at EVERY posture, not only at 'neutral' (round 1's executed magnitudes were neutral).
const out = [];
const gross = 55;
for (const posture of ['neutral', 'lower', 'raise']) {
  const ps = [];
  for (const [band, wage] of [['company', 8], ['host', 25], ['great_host', 55]]) {
    const need01 = Math.min(1, wage / gross);
    const w = weights({ current: 'wonted', need01, standing: 'Approved', customHeavy: true, posture });
    ps.push(+(w.exacting || 0).toFixed(3));
  }
  const peace = weights({ current: 'wonted', need01: 0, standing: 'Approved', customHeavy: true, posture });
  const mono = ps[0] < ps[1] && ps[1] < ps[2];
  out.push(`row 5 posture=${posture}: P(raise at the war trigger) company/host/great_host = ${ps.join(' / ')} · monotone=${mono} · at peace P(raise)=${(peace.exacting || 0)}`);
  const r4 = season({ current: 'wonted', need01: 0, standing: 'Approved', malice: 0.5, lawful: 0.5, posture }, 2000, 8);
  out.push(`row 4 posture=${posture}: share >= exacting at peace = ${r4.share} (asserted 0)`);
}
console.log(out.join('\n'));
