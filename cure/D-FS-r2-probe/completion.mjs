// D-FS-r2 probe 1 (FS-r1-6 under RULINGS-P6 D.8 — TIME-BASED COMPLETION): the band the collectors bring back under a
// standing refusal, season by season, for EVERY (ruling power × secular form × raised hand) cell of master's own
// TAX_PROFILE, using master's TAX_RATE_BANDS and isCoerciveCell. The FS shift (handBandFor) is the volume's §4.1
// table; pressedHandOf(hand, k) = the hand word k steps above `wonted`, never above the hand itself.
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
function pressedHandOf(hand, k) { return HANDS[Math.min(HANDS.indexOf(hand), HANDS.indexOf('wonted') + Math.max(0, k))]; }
const out = [];
let cells = 0, firstSeasonCustom = 0, monotone = 0, completesBy = 0, neverAbove = 0, partialCells = 0, tithesUntouched = 0, noneUntouched = 0;
const powers = Object.keys(TAX_PROFILE).sort();
for (const power of powers) {
  for (const form of TAX_FORMS) {
    const profileBand = TAX_PROFILE[power][form];
    const coercive = isCoerciveCell(power, form);
    for (const hand of ['exacting', 'wringing']) {
      cells++;
      const raised = handBandFor(TAX_RATE_BANDS, profileBand, hand, form, coercive);
      const seq = [0, 1, 2, 3].map((k) => handBandFor(TAX_RATE_BANDS, profileBand, pressedHandOf(hand, k), form, coercive));
      if (seq[0] === profileBand) firstSeasonCustom++;
      if (seq.every((b, n) => n === 0 || TAX_RATE_BANDS.indexOf(b) >= TAX_RATE_BANDS.indexOf(seq[n - 1]))) monotone++;
      if (seq[STEPS[hand]] === raised && seq[3] === raised) completesBy++;
      if (seq.every((b) => TAX_RATE_BANDS.indexOf(b) <= TAX_RATE_BANDS.indexOf(raised))) neverAbove++;
      if (seq[0] !== raised) partialCells++;
      if (form === 'tithe_share' && seq.every((b) => b === profileBand)) tithesUntouched++;
      if (profileBand === 'none' && seq.every((b) => b === 'none')) noneUntouched++;
    }
  }
}
out.push(`cells (ruling power x form x raised hand) = ${cells} over ${powers.length} powers: ${powers.join(' · ')}`);
out.push(`first refused season collects CUSTOM (the profile band) in ${firstSeasonCustom}/${cells}`);
out.push(`collection non-decreasing season by season in ${monotone}/${cells}`);
out.push(`collection reaches the hand's own band by season (hand steps) and stays there in ${completesBy}/${cells}`);
out.push(`collection never above the raised band in ${neverAbove}/${cells}`);
out.push(`cells where the refusal actually withholds something in season 1 (raised != custom) = ${partialCells}`);
out.push(`tithe_share untouched ${tithesUntouched} · 'none' never opened ${noneUntouched}`);
// the chair's own example (D.8): a wringing hand on a coercive 'customary' cell
const ex = [];
for (const power of powers) for (const form of TAX_FORMS) {
  if (TAX_PROFILE[power][form] === 'customary' && isCoerciveCell(power, form)) ex.push(`${power}.${form}`);
}
const exCell = ex[0];
if (exCell) {
  const [power, form] = exCell.split('.');
  const seq = [0, 1, 2, 3].map((k) => handBandFor(TAX_RATE_BANDS, 'customary', pressedHandOf('wringing', k), form, true));
  out.push(`D.8's example — wringing on a coercive customary cell (${exCell}): refused seasons 1..4 collect ${seq.join(' -> ')}`);
  const seqE = [0, 1, 2].map((k) => handBandFor(TAX_RATE_BANDS, 'customary', pressedHandOf('exacting', k), form, true));
  out.push(`the same cell under an exacting hand: refused seasons 1..3 collect ${seqE.join(' -> ')}`);
} else out.push('no coercive customary cell on master (example not shown)');
console.log(out.join('\n'));
