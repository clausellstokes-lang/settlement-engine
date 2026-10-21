// D-FS-r3 probe 1 (FS-V3 under RULINGS-P6 E.8): the refusal STAMP's life on the commons ladder, the r2 text's law
// against the r3 cure, over EVERY (ruling power × secular form × raised hand) cell of master's own TAX_PROFILE
// (master's TAX_RATE_BANDS and isCoerciveCell), and many deterministic rung walks on POP-2's extended ladder
// none → petition → gathering → refusal → riot (POP-2's REFUSAL rung named by its WORD; riot entered from a
// targeted refusal carries the target `hand`, the ladder's own record).
//   r2 law (the volume before this round): refused ⇔ the rung word is `refusal`; "the stamp and the steps clear the
//          tick the refusal leaves the ledger" — so a climb to `riot` clears them.
//   r3 law (E.8): refused ⇔ the rung is AT OR ABOVE `refusal` with target `hand` (the riot is the refusal gone to the
//          street); the stamp clears the tick the ladder steps BELOW `refusal` (POP-2's own de-escalation, at once —
//          its hold and decay tail are the ladder's, never FS's); a re-entry is a NEW refusal (custom again).
// Collection: band = refused ? pressed : raised; pressedSteps = min(hand steps, floor((week − refusedSinceWeek) / 13)).
const M = '/private/tmp/claude-502/-Users-cstokes-Desktop-settlement-engine/a73343ed-904d-46d0-a0f5-2969909eb66e/scratchpad/master-81f1cd963';
const T = await import(M + '/src/domain/worldPulse/treasury.js');
const { TAX_RATE_BANDS, TAX_PROFILE, isCoerciveCell, TAX_FORMS } = T;
const HANDS = ['remitting', 'wonted', 'exacting', 'wringing'];
const STEPS = { remitting: -1, wonted: 0, exacting: 1, wringing: 2 };
function handBandFor(bands, profileBand, hand, form, coercive) {
  if (form === 'tithe_share' || profileBand === 'none') return profileBand;
  const i = bands.indexOf(profileBand);
  let j = i + STEPS[hand];
  const floor = bands.indexOf('light');
  const cap = coercive ? bands.indexOf('extractive') : bands.indexOf('heavy');
  if (STEPS[hand] < 0) j = Math.max(j, Math.min(i, floor));
  if (STEPS[hand] > 0) j = Math.min(j, Math.max(i, cap));
  return bands[j];
}
const pressedHandOf = (hand, k) => HANDS[Math.min(HANDS.indexOf(hand), HANDS.indexOf('wonted') + Math.max(0, k))];
const RUNGS = ['none', 'petition', 'gathering', 'refusal', 'riot'];
const R = Object.fromEntries(RUNGS.map((w, i) => [w, i]));
// deterministic LCG (no Math.random)
function lcg(seed) { let s = seed >>> 0; return () => { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; return s / 4294967296; }; }
// a rung walk: escalate one rung only after a 3-week dwell (master's DWELL_TICKS), de-escalate one rung at once
function walk(seed, weeks, upP, downP) {
  const rnd = lcg(seed); const seq = []; let rung = R.gathering; let since = 0;
  for (let w = 0; w < weeks; w++) {
    const x = rnd();
    if (x < upP && rung < R.riot && w - since >= 3) { rung++; since = w; }
    else if (x > 1 - downP && rung > R.none) { rung--; since = w; }
    seq.push(rung);
  }
  return seq;
}
function collect(seq, law, steps) {
  // returns per-week { refused, pressedSteps } under the law
  let refusedSince = null; const out = [];
  for (let w = 0; w < seq.length; w++) {
    const r = seq[w];
    const inRefusal = law === 'r2' ? r === R.refusal : r >= R.refusal;
    if (inRefusal) { if (refusedSince === null) refusedSince = w; } else refusedSince = null;
    const k = refusedSince === null ? 0 : Math.min(steps, Math.floor((w - refusedSince) / 13));
    out.push({ refused: refusedSince !== null, k, since: refusedSince });
  }
  return out;
}
const idx = (b) => TAX_RATE_BANDS.indexOf(b);
const powers = Object.keys(TAX_PROFILE).sort();
const walks = [];
for (let s = 1; s <= 200; s++) walks.push(walk(s * 7919, 104, 0.30, 0.12));
for (let s = 1; s <= 100; s++) walks.push(walk(s * 104729, 104, 0.45, 0.04)); // riot-prone
const res = { r2: {}, r3: {} };
for (const law of ['r2', 'r3']) {
  const c = { cellWalks: 0, riotWeeks: 0, riotAbovePressed: 0, riotAboveRefusalWeekBefore: 0, stretchDecrease: 0,
    aboveRaised: 0, reentryNotCustom: 0, reentries: 0, longStretches: 0, longStretchCompleted: 0, activeCells: 0 };
  for (const power of powers) for (const form of TAX_FORMS) {
    const profileBand = TAX_PROFILE[power][form]; const coercive = isCoerciveCell(power, form);
    for (const hand of ['exacting', 'wringing']) {
      const raised = handBandFor(TAX_RATE_BANDS, profileBand, hand, form, coercive);
      if (raised === profileBand) continue; // the hand moves nothing on this cell (none, tithe, a cap) — nothing to refuse
      c.activeCells++;
      for (const seq of walks) {
        c.cellWalks++;
        const st = collect(seq, law, STEPS[hand]);
        // the reference: the r3 count of continuous refusal-or-riot (what the collectors have pressed through)
        const ref = collect(seq, 'r3', STEPS[hand]);
        let prevBand = null; let prevInStretch = false; let stretchLen = 0;
        for (let w = 0; w < seq.length; w++) {
          const band = st[w].refused ? handBandFor(TAX_RATE_BANDS, profileBand, pressedHandOf(hand, st[w].k), form, coercive) : raised;
          const refPressed = handBandFor(TAX_RATE_BANDS, profileBand, pressedHandOf(hand, ref[w].k), form, coercive);
          const inStretch = seq[w] >= R.refusal;
          if (idx(band) > idx(raised)) c.aboveRaised++;
          if (seq[w] === R.riot) {
            c.riotWeeks++;
            if (idx(band) > idx(refPressed)) c.riotAbovePressed++;
            if (w > 0 && seq[w - 1] === R.refusal && prevBand && idx(band) > idx(prevBand) && ref[w].k === ref[w - 1].k) c.riotAboveRefusalWeekBefore++;
          }
          if (inStretch && prevInStretch && prevBand && idx(band) < idx(prevBand)) c.stretchDecrease++;
          if (inStretch && !prevInStretch && w > 0 && ref[w].since === w) {
            // a (re-)entry into refusal: the first refused season collects custom
            c.reentries++;
            if (band !== profileBand) c.reentryNotCustom++;
          }
          stretchLen = inStretch ? stretchLen + 1 : 0;
          if (stretchLen === 13 * STEPS[hand] + 1) { c.longStretches++; if (band === raised) c.longStretchCompleted++; }
          prevBand = band; prevInStretch = inStretch;
        }
      }
    }
  }
  res[law] = c;
}
const lines = [];
lines.push(`walks: ${walks.length} deterministic rung walks of 104 weeks (200 ordinary, 100 riot-prone); cells where the hand moves the band: ${res.r3.activeCells} of 96`);
for (const law of ['r2', 'r3']) {
  const c = res[law];
  lines.push(`[${law}] cell×walk ${c.cellWalks} · riot weeks ${c.riotWeeks} · riot weeks collecting ABOVE the pressed band ${c.riotAbovePressed} · refusal→riot steps that raise the collection with no season turn ${c.riotAboveRefusalWeekBefore} · decreases inside one continuous refusal-or-riot stretch ${c.stretchDecrease} · weeks above the raised band ${c.aboveRaised} · (re-)entries ${c.reentries}, not collecting custom ${c.reentryNotCustom} · stretches of hand-steps×13+1 weeks ${c.longStretches}, completed at the hand's own band ${c.longStretchCompleted}`);
}
console.log(lines.join('\n'));
