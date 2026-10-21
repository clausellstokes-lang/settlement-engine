// V-FS-r3 probe 1: the riot NOT entered from a targeted refusal. The volume's r3 law (FS6, §2.1, §6.2, row 31):
// the stamp stands while the ladder is AT OR ABOVE `refusal` AGAINST THIS HAND — the riot carries the target only
// when "entered from a targeted refusal" (D-FS-r3 §5 POP route). POP-2's own law (DESIGN_FP_POPULATIONS.md POP-2):
// "No live target ⇒ the ladder skips the rung as a TWO-STEP JUMP after ONE dwell (gathering→riot in a single escalation)".
// FS §6.1: the target `hand` is "a RAISE above custom that has stood at least one commons dwell".
// So: (A) a town at gathering (dwell met) when the seat raises; the next tick the exaction row lifts the grievance to the
// riot band; the hand has stood 1 week < 3 ⇒ no live target ⇒ POP-2's jump to riot, NO target ref ⇒ no stamp ⇒ the mint
// collects the RAISED band; when the street quiets to the refusal band the ladder steps riot→refusal against the (now live)
// hand ⇒ stamp ⇒ CUSTOM. (B) a town already at riot (misrule) when the seat raises: same.
// Bands from master's own TAX_PROFILE / TAX_RATE_BANDS / isCoerciveCell (READ-ONLY import).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const T = await import(M + '/src/domain/worldPulse/treasury.js');
const { TAX_RATE_BANDS, TAX_PROFILE, isCoerciveCell, TAX_FORMS } = T;
const HANDS = ['remitting', 'wonted', 'exacting', 'wringing'];
const STEPS = { remitting: -1, wonted: 0, exacting: 1, wringing: 2 };
function handBandFor(bands, profileBand, hand, form, coercive) {
  if (form === 'tithe_share' || profileBand === 'none') return profileBand;
  const i = bands.indexOf(profileBand); let j = i + STEPS[hand];
  const floor = bands.indexOf('light'); const cap = coercive ? bands.indexOf('extractive') : bands.indexOf('heavy');
  if (STEPS[hand] < 0) j = Math.max(j, Math.min(i, floor)); if (STEPS[hand] > 0) j = Math.min(j, Math.max(i, cap));
  return bands[j];
}
const pressedHandOf = (hand, k) => HANDS[Math.min(HANDS.indexOf(hand), 1 + Math.max(0, k))];
const R = { none: 0, petition: 1, gathering: 2, refusal: 3, riot: 4 };
const DWELL = 3;
// ladder per POP-2 + master's kernel: up one rung after the dwell (rung 0 at once); at gathering with NO live target and a
// target ≥ refusal: the two-step jump to riot; down one rung at once; riot→refusal only with a live target (else gathering).
function run(targetRungs, startRung, hand, handWeek) {
  let rung = startRung, since = -10, tgt = null; const out = [];
  for (let w = 0; w < targetRungs.length; w++) {
    const live = w - handWeek >= DWELL; // FS §6.1: the hand has stood one commons dwell
    const want = targetRungs[w];
    if (want > rung && (w - since >= DWELL || rung === 0)) {
      if (rung === R.gathering && want >= R.refusal) {
        if (live) { rung = R.refusal; tgt = 'hand'; } else { rung = R.riot; tgt = null; } // POP-2's jump: no target ref
      } else if (rung === R.refusal) { rung = R.riot; /* carries tgt (the lane's route) */ }
      else rung += 1;
      since = w;
    } else if (want < rung) {
      if (rung === R.riot) { if (live) { rung = R.refusal; if (!tgt) tgt = 'hand'; } else { rung = R.gathering; tgt = null; } }
      else { rung -= 1; if (rung < R.refusal) tgt = null; }
      since = w;
    }
    out.push({ w, rung, tgt });
  }
  return out;
}
function collect(seq, hand) {
  let refusedSince = null; return seq.map(({ w, rung, tgt }) => {
    const stamped = rung >= R.refusal && tgt === 'hand';
    if (stamped) { if (refusedSince === null) refusedSince = w; } else refusedSince = null;
    const k = refusedSince === null ? 0 : Math.min(STEPS[hand], Math.floor((w - refusedSince) / 13));
    return { w, rung, stamped, k };
  });
}
const idx = (b) => TAX_RATE_BANDS.indexOf(b);
const lines = [];
// target rung sequences (weeks 0..39): the grievance in the riot band for 20 weeks after the raise, then the refusal band
const A = Array.from({ length: 40 }, (_, w) => (w === 0 ? R.gathering : w <= 20 ? R.riot : R.refusal));
const B = Array.from({ length: 40 }, (_, w) => (w <= 20 ? R.riot : R.refusal));
for (const [name, tr, start] of [['A gathering at the raise', A, R.gathering], ['B riot standing at the raise', B, R.riot]]) {
  let cells = 0, riotFull = 0, riotWeeks = 0, inversion = 0, cardWeeks = 0;
  for (const power of Object.keys(TAX_PROFILE).sort()) for (const form of TAX_FORMS) for (const hand of ['exacting', 'wringing']) {
    const prof = TAX_PROFILE[power][form]; const coercive = isCoerciveCell(power, form);
    const raised = handBandFor(TAX_RATE_BANDS, prof, hand, form, coercive); if (raised === prof) continue; cells++;
    const st = collect(run(tr, start, hand, 0), hand);
    let lastRiotBand = null, firstRefusalBand = null;
    for (const s of st) {
      const band = s.stamped ? handBandFor(TAX_RATE_BANDS, prof, pressedHandOf(hand, s.k), form, coercive) : raised;
      if (s.rung === R.riot) { riotWeeks++; if (band === raised) riotFull++; lastRiotBand = band; }
      if (s.rung === R.refusal && s.stamped) { cardWeeks++; if (firstRefusalBand === null) firstRefusalBand = band; }
    }
    if (lastRiotBand && firstRefusalBand && idx(lastRiotBand) > idx(firstRefusalBand)) inversion++;
  }
  lines.push(`[${name}] active cells ${cells} · riot weeks ${riotWeeks}, collecting the FULL raised band ${riotFull} · cells where the riot collected MORE than the refusal that followed it ${inversion} of ${cells} · stamped (card) weeks ${cardWeeks}`);
}
// one trace for the record: criminal.port_customs (coercive customary), wringing, path A
const tr = collect(run(A, R.gathering, 'wringing', 0), 'wringing');
const prof = TAX_PROFILE.criminal.port_customs, co = isCoerciveCell('criminal', 'port_customs');
lines.push('trace A criminal.port_customs wringing (week:rung:band): ' + tr.filter((s) => [0, 1, 2, 5, 20, 21, 22, 34, 35].includes(s.w)).map((s) => `${s.w}:${Object.keys(R)[s.rung]}:${s.stamped ? handBandFor(TAX_RATE_BANDS, prof, pressedHandOf('wringing', s.k), 'port_customs', co) : handBandFor(TAX_RATE_BANDS, prof, 'wringing', 'port_customs', co)}`).join(' '));
console.log(lines.join('\n'));
