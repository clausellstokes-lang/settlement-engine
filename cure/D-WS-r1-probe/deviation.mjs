// D-WS-r1 probe: the CURED deviation table (WS-r1-14) and the host-lean share rule (A.8).
// Pure arithmetic over the volume's cured tables; no worktree module is imported.
const WAYS = ['way_attrition','way_coalition','way_fortress','way_harassment','way_logistics','way_raiding','way_shock','way_subversion'];
const PARKED = new Set(['way_subversion']); // W-DOCTRINE-3b dark in every preset
const CAUSE_TO = {
  field_lost: 'way_fortress', seat_rotting: 'way_subversion', coffers_bare: 'way_raiding',
  levy_thin: 'way_coalition', foe_on_the_ways: 'way_logistics', ally_failed: 'way_fortress',
  siege_long: 'way_logistics', commander_bold: 'way_shock', commander_wary: 'way_fortress',
};
let fired = 0, onCause = 0, noop = 0, inert = 0;
const lines = [];
for (const way of WAYS) for (const [cause, to] of Object.entries(CAUSE_TO)) {
  if (PARKED.has(to)) { inert += 1; continue; }          // a cause toward a parked way never fires
  if (to === way) { noop += 1; continue; }               // already the cause's way: no deviation
  const landed = to;                                     // the cured rule: the deviation goes TO the cause's way
  fired += 1; if (landed === to) onCause += 1;
  lines.push(`${way} --${cause}--> ${landed}`);
}
console.log(lines.join('\n'));
console.log(`fired ${fired} · landed on the cause's way ${onCause}/${fired} · no-op (already there) ${noop} · inert (toward a parked way) ${inert}`);
// A.8: the host lean on C1/C2/C6 is the bundle sign scaled by the STRENGTH share of the winning fit.
const W = 0.12;
const hostLean = (sign, persSteps, strSteps) => {
  const total = persSteps + strSteps; const share = total > 0 ? strSteps / total : 0;
  return +(1 + sign * W * share).toFixed(4);
};
console.log('personality-only fit (4 pers, 0 str), deploy + :', hostLean(+1, 4, 0));
console.log('mixed fit (2 pers, 2 str), deploy + :', hostLean(+1, 2, 2));
console.log('strength-only fit (0 pers, 3 str), deploy - :', hostLean(-1, 0, 3));
