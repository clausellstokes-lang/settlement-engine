// D-FOUR-r4 (G.5): the verifier's untargeted-riot probe with the r4 law beside the r3 law.
// The LADDER MODEL `run` is the verifier's, byte-for-byte (skeptic/FS-r3-verify-probe/untargeted-riot.mjs).
// r3 law (the verifier's `collect`): refused only while rung >= refusal AND the target is `hand`; the clock counts that stretch.
// r4 law (RULINGS-P6 G.5): WHILE ANY RIOT STANDS a raised hand collects CUSTOM, whatever its target; the completion
//   clock (D.8) runs ONLY FROM THE RIOT'S EASE — a refused stretch's first week is the first week at `refusal` against
//   the live hand with no riot standing; no target is adopted by an untargeted riot (the card = refusal against `hand`).
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
function run(targetRungs, startRung, hand, handWeek) { // the verifier's ladder model, unchanged
  let rung = startRung, since = -10, tgt = null; const out = [];
  for (let w = 0; w < targetRungs.length; w++) {
    const live = w - handWeek >= DWELL;
    const want = targetRungs[w];
    if (want > rung && (w - since >= DWELL || rung === 0)) {
      if (rung === R.gathering && want >= R.refusal) {
        if (live) { rung = R.refusal; tgt = 'hand'; } else { rung = R.riot; tgt = null; }
      } else if (rung === R.refusal) { rung = R.riot; }
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
function collectR3(seq, hand) { // the verifier's collect, unchanged
  let refusedSince = null; return seq.map(({ w, rung, tgt }) => {
    const stamped = rung >= R.refusal && tgt === 'hand';
    if (stamped) { if (refusedSince === null) refusedSince = w; } else refusedSince = null;
    const k = refusedSince === null ? 0 : Math.min(STEPS[hand], Math.floor((w - refusedSince) / 13));
    return { w, rung, refused: stamped, card: stamped, k };
  });
}
function collectR4(seq, hand) { // G.5
  let refusedSince = null; return seq.map(({ w, rung, tgt }) => {
    const riot = rung === R.riot;                         // ANY riot, whatever its target
    const targeted = rung === R.refusal && tgt === 'hand'; // the refusal against the live hand
    if (riot) refusedSince = null;                         // the clock does not run while a riot stands
    else if (targeted) { if (refusedSince === null) refusedSince = w; } // first week from the riot's ease (or a fresh refusal)
    else refusedSince = null;                              // below refusal, or a refusal of another act: ends
    const k = riot || refusedSince === null ? 0 : Math.min(STEPS[hand], Math.floor((w - refusedSince) / 13));
    return { w, rung, refused: riot || targeted, card: rung >= R.refusal && tgt === 'hand', k };
  });
}
const idx = (b) => TAX_RATE_BANDS.indexOf(b);
const A = Array.from({ length: 40 }, (_, w) => (w === 0 ? R.gathering : w <= 20 ? R.riot : R.refusal));
const B = Array.from({ length: 40 }, (_, w) => (w <= 20 ? R.riot : R.refusal));
// C (control): a TARGETED refusal that climbs to riot in its second refused season, then eases back to refusal
const C = Array.from({ length: 70 }, (_, w) => (w < 3 ? R.gathering : w < 20 ? R.refusal : w < 34 ? R.riot : R.refusal));
const lines = [];
for (const [lawName, collect] of [['r3', collectR3], ['r4', collectR4]]) {
  for (const [name, tr, start] of [['A gathering at the raise', A, R.gathering], ['B riot standing at the raise', B, R.riot], ['C targeted refusal -> riot -> refusal', C, R.gathering]]) {
    let cells = 0, riotWeeks = 0, riotFull = 0, riotAboveCustom = 0, inversion = 0, cardWeeks = 0, untargetedRiotCardWeeks = 0, easeAtCustom = 0, eased = 0, completesAfterEase = 0;
    for (const power of Object.keys(TAX_PROFILE).sort()) for (const form of TAX_FORMS) for (const hand of ['exacting', 'wringing']) {
      const prof = TAX_PROFILE[power][form]; const coercive = isCoerciveCell(power, form);
      const raised = handBandFor(TAX_RATE_BANDS, prof, hand, form, coercive); if (raised === prof) continue; cells++;
      const custom = prof;
      const seq = run(tr, start, hand, 0); const st = collect(seq, hand);
      let lastRiotBand = null, firstRefusalAfterRiot = null, sawRiot = false, lastBand = null;
      st.forEach((s, i) => {
        const band = s.refused ? handBandFor(TAX_RATE_BANDS, prof, pressedHandOf(hand, s.k), form, coercive) : raised;
        if (s.rung === R.riot) { riotWeeks++; sawRiot = true; if (band === raised) riotFull++; if (idx(band) > idx(custom)) riotAboveCustom++; lastRiotBand = band; if (s.card === false) {} }
        if (s.rung === R.riot && seq[i].tgt !== 'hand' && s.card) untargetedRiotCardWeeks++;
        if (s.card) cardWeeks++;
        if (sawRiot && s.rung === R.refusal && firstRefusalAfterRiot === null) { firstRefusalAfterRiot = band; eased++; if (band === custom) easeAtCustom++; }
        lastBand = band;
      });
      if (lastRiotBand && firstRefusalAfterRiot && idx(lastRiotBand) > idx(firstRefusalAfterRiot)) inversion++;
      if (sawRiot && lastBand === raised) completesAfterEase++;
    }
    lines.push(`[${lawName}] [${name}] cells ${cells} · riot weeks ${riotWeeks} · collecting the FULL raise ${riotFull} · above custom ${riotAboveCustom} · cells where the riot collected MORE than the refusal after it ${inversion} of ${cells} · first refusal after the riot at custom ${easeAtCustom} of ${eased} · completes to the hand's own band by the last week ${completesAfterEase} of ${cells} · card weeks ${cardWeeks} (an untargeted riot carrying the card: ${untargetedRiotCardWeeks})`);
  }
}
const prof = TAX_PROFILE.criminal.port_customs, co = isCoerciveCell('criminal', 'port_customs');
for (const [lawName, collect] of [['r3', collectR3], ['r4', collectR4]]) for (const [name, tr, start, ws] of [['A', A, R.gathering, [0, 1, 2, 20, 21, 22, 34, 35, 39]], ['C', C, R.gathering, [3, 15, 16, 19, 20, 33, 34, 46, 47, 59, 60, 69]]]) {
  const st = collect(run(tr, start, 'wringing', 0), 'wringing');
  lines.push(`trace [${lawName}] ${name} criminal.port_customs wringing (week:rung:band): ` + st.filter((s) => ws.includes(s.w)).map((s) => `${s.w}:${Object.keys(R)[s.rung]}:${s.refused ? handBandFor(TAX_RATE_BANDS, prof, pressedHandOf('wringing', s.k), 'port_customs', co) : handBandFor(TAX_RATE_BANDS, prof, 'wringing', 'port_customs', co)}`).join(' '));
}
console.log(lines.join('\n'));
