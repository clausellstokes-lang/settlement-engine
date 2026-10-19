// Probe of PL's OWN STATED RULES (no master code exists for them): §4.6 shape 3 (cap 24, newest-cap,
// the fealty_sworn BASELINE written when an edge has no epoch-bearing row, "or a record whose epoch rows
// were evicted by the cap") and §3.5's C8 term A = clamp01(weeksSince(newest RENEWING row) / (25*52)),
// renewing = fealty_sworn · fealty_renewed · protection_kept. Epoch-bearing = fealty_sworn · fealty_renewed · fealty_withheld.
const CAP = 24, YEAR = 52, HORIZON = 25 * YEAR;
const EPOCH = new Set(['fealty_sworn', 'fealty_renewed', 'fealty_withheld']);
const RENEW = new Set(['fealty_sworn', 'fealty_renewed', 'protection_kept']);
function run(rowsPerYear, kinds, years = 25) {
  let rec = [{ tick: 0, kind: 'fealty_sworn' }];
  let rebaselines = 0;
  const step = rowsPerYear > 0 ? Math.floor(YEAR / rowsPerYear) : Infinity;
  for (let t = 1; t <= years * YEAR; t++) {
    if (Number.isFinite(step) && t % step === 0) {
      rec.push({ tick: t, kind: kinds[(t / step) % kinds.length] });
      rec = rec.slice(-CAP); // newest-cap
    }
    if (!rec.some((r) => EPOCH.has(r.kind))) { rec.push({ tick: t, kind: 'fealty_sworn' }); rec = rec.slice(-CAP); rebaselines++; }
  }
  const T = years * YEAR;
  const renew = rec.filter((r) => RENEW.has(r.kind));
  const A = renew.length ? Math.min(1, (T - Math.max(...renew.map((r) => r.tick))) / HORIZON) : 1;
  return { rowsPerYear, kinds: kinds.join('+'), A: A.toFixed(3), rebaselines, newestRenewingTick: renew.length ? Math.max(...renew.map((r) => r.tick)) : null };
}
const failing = ['protection_failed', 'relief_kept', 'service_refused'];
console.log('quiet edge (no rows for 25y)      ', run(0, failing));
console.log('failing crown, 2 rows/yr          ', run(2, failing));
console.log('failing crown, 4 rows/yr (war)    ', run(4, failing));
console.log('failing crown, 8 rows/yr (war)    ', run(8, failing));
console.log('defied crown, 4 fealty_defied/yr  ', run(4, ['fealty_defied']));
