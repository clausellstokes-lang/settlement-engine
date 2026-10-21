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
const out = [];
// ROW 4 (exact by candidacy): a council at peace — no demand present, malice < 0.7 — never raises.
const r4 = season({ current: 'wonted', need01: 0, standing: 'Approved', malice: 0.5, lawful: 0.5 }, 2000, 8);
out.push(`row 4  council at peace, no demand, malice 0.5: share of season-cells at >= exacting over 2000 keys x 8 seasons = ${r4.share} (asserted 0, a candidacy law); max step per decision = ${r4.maxStep}`);
const r4c = season({ current: 'wonted', need01: 0, standing: 'Approved', malice: 0.8, lawful: 0.3 }, 2000, 8);
out.push(`row 4b a CRUEL seat at peace (malice 0.8, avarice): share >= exacting = ${r4c.share} (> 0: the only peace-time raise, cause avarice)`);
// ROW 5 (direction): an autocrat town (custom levy heavy), demand by the wage bill over the custom gross
// (probe 1: autocrat town gross 55/tick; company 8 · host 25 · great_host 55 coin/tick).
const gross = 55;
for (const [band, wage] of [['company', 8], ['host', 25], ['great_host', 55]]) {
  const need01 = Math.min(1, wage / gross);
  const w = weights({ current: 'wonted', need01, standing: 'Approved', customHeavy: true });
  out.push(`row 5  autocrat, ${band} in the field: need01=${need01.toFixed(3)} P(raise at the war trigger)=${(w.exacting || 0).toFixed(3)}`);
}
out.push(`row 5  same autocrat at peace (no demand, malice 0.5): P(raise)=0 (no candidate)`);
const war4 = season({ current: 'wonted', need01: 25 / 55, standing: 'Approved', customHeavy: true }, 2000, 4);
out.push(`row 5  autocrat with a host over a 4-season war: share of season-cells at >= exacting = ${war4.share} (vs 0 at peace)`);
// ROW 9 (direction): the refusal default — yield vs hold (ease from wringing only).
function verdict({ need01, standing, posture, fromWringing }) {
  const c = posture === 'raise' ? 0.5 : posture === 'lower' ? -0.5 : 0;
  const STAND = { 'Crisis': 1.4, 'Contested': 1.2, 'Tolerated': 1.0, 'Approved': 0.8, 'Endorsed': 0.7 };
  const y = (1 + c) * (1.5 - need01) * STAND[standing];
  const e = fromWringing ? 1 : 0;
  const h = (1 - c) * (0.5 + need01);
  const t = y + e + h; return { remitted: y / t, abated: e / t, held_firm: h / t };
}
for (const st of ['Approved', 'Tolerated', 'Crisis']) {
  const bold = verdict({ need01: 0.7, standing: st, posture: 'lower', fromWringing: false });
  const caut = verdict({ need01: 0.2, standing: st, posture: 'raise', fromWringing: false });
  out.push(`row 9  ${st}: bold seat need 0.7 (exacting) P(held_firm)=${bold.held_firm.toFixed(3)} · cautious seat need 0.2 P(remitted)=${caut.remitted.toFixed(3)} · direction holds=${bold.held_firm > caut.held_firm && caut.remitted > bold.remitted}`);
}
const bw = verdict({ need01: 0.7, standing: 'Tolerated', posture: 'lower', fromWringing: true });
out.push(`row 9  from wringing, bold, need 0.7, Tolerated: ${JSON.stringify(Object.fromEntries(Object.entries(bw).map(([k, v]) => [k, +v.toFixed(3)])))}`);
console.log(out.join('\n'));
