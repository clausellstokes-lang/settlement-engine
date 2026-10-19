// V-PR-r3 independent probe: re-implements PR's round-3 rules FROM THE VOLUME'S TEXT (not D-PR's script).
// Imports only fnv1a32 from master 81f1cd963 (read-only).
const W = process.argv[2];
const { fnv1a32 } = await import(`${W}/src/kernel/proseHash.js`);
const PEACE_SHARE = 0.6, CAMPAIGN_SHARE = 0.75, W_HARASS = 0.10;
// (1) §3.2: kept vs peace on a continuous peaceShare grid (0.40..1.00 step .01) x max 0..12
let rows = 0, below = 0, equalNotAtMax = 0;
for (let k = 40; k <= 100; k++) { const ps = k / 100; for (let max = 0; max <= 12; max++) {
  const peace = Math.ceil(max * ps); const kept = Math.max(Math.ceil(max * CAMPAIGN_SHARE), Math.min(max, peace + 1));
  rows++; if (kept < peace) below++; if (kept === peace && peace < max) equalNotAtMax++; } }
console.log(`(1) kept-vs-peace rows=${rows} below=${below} equalWithRoom=${equalNotAtMax}`);
// (2) §7.5: excess sizing, zero-denominator guard (max 1,2) and the DM's 'first' order
const out2 = [];
for (let max = 1; max <= 12; max++) { const base = Math.ceil(max * PEACE_SHARE); const den = max - base;
  for (const ps of [0.8, 1.0]) { const fielded = Math.ceil(max * ps); const excess = fielded - base;
    const input = excess <= 0 ? 0 : W_HARASS * Math.min(1, Math.max(0, excess / den)); out2.push(`max=${max} ps=${ps} den=${den} excess=${excess} input=${input.toFixed(3)}${Number.isFinite(input) ? '' : ' NONFINITE'}`); } }
console.log('(2) ' + out2.filter((s) => s.includes('NONFINITE')).length + ' nonfinite of ' + out2.length); out2.slice(0, 6).forEach((s) => console.log('   ' + s));
// (3) §2.3 allocation over n 0..12 x H 1..12, 208 weeks: rider-places on halves per week <= n; exact periods
function alloc(n, H) { const halves = Array.from({ length: H }, (_, i) => `stretch:a|n${i}`); const m = new Map();
  if (n <= 0) { halves.forEach((h) => m.set(h, { c: 'never' })); return { halves, m, rovers: [] }; }
  if (n >= H) { halves.forEach((h) => m.set(h, { c: 'weekly' })); return { halves, m, rovers: [] }; }
  const r = Math.min(n - 1, Math.ceil((H - n) / 3)), s = n - r; halves.slice(0, s).forEach((h) => m.set(h, { c: 'weekly' }));
  const rest = halves.slice(s); const p = rest.length <= 4 * r ? 4 : 13; const rovers = []; let at = 0;
  for (let b = 0; b < r; b++) { const size = Math.floor(rest.length / r) + (b < rest.length % r ? 1 : 0); const blk = rest.slice(at, at + Math.min(size, p)); at += size;
    const slots = [...blk].sort((x, y) => (fnv1a32(`patrol:slot:${x}:a:a`) - fnv1a32(`patrol:slot:${y}:a:a`)) || (x < y ? -1 : 1));
    const base = fnv1a32(`patrol:rover:a:${b}`) % p; slots.forEach((h, j) => m.set(h, { c: p, slot: j, phase: ((j - base) % p + p) % p })); rovers.push({ p, slots, base }); }
  rest.forEach((h) => { if (!m.has(h)) m.set(h, { c: 'never' }); }); return { halves, m, rovers }; }
let viol = 0, offPeriod = 0, neverBeyond9 = 0, phaseMismatch = 0;
for (let n = 0; n <= 12; n++) for (let H = 1; H <= 12; H++) { const { halves, m, rovers } = alloc(n, H); const cnt = new Map(halves.map((h) => [h, 0]));
  for (let t = 0; t < 208; t++) { let onHalves = 0; for (const h of halves) { const a = m.get(h); if (a.c === 'weekly') { onHalves++; cnt.set(h, cnt.get(h) + 1); } }
    for (const rv of rovers) { const sl = (t + rv.base) % rv.p; if (sl < rv.slots.length) { onHalves++; const h = rv.slots[sl]; cnt.set(h, cnt.get(h) + 1); if ((t % rv.p) !== m.get(h).phase) phaseMismatch++; } }
    if (onHalves > n) viol++; }
  for (const h of halves) { const a = m.get(h); const exp = a.c === 'weekly' ? 208 : a.c === 'never' ? 0 : 208 / a.c; if (cnt.get(h) !== exp) offPeriod++; if (a.c === 'never' && n >= 2 && H > 9) neverBeyond9++; } }
console.log(`(3) allocation n0..12 x H1..12: weeksOverRiders=${viol} offPeriodHalves=${offPeriod} phaseFormulaMismatches=${phaseMismatch} neverHalvesWithN>=2(H>9)=${neverBeyond9}`);
// (4) §6.6 drawShare01 when fromCap.offensive is 0 and riders are kept
const off = 0, draw = 3; const drawn = Math.max(0, off - draw); const share = drawn / off; const pre = 0.5 * share * 1 * 1 <= 0.3 + 0.12;
console.log(`(4) drawShare01(offensive 0, draw 3) = ${share}; prefilter "<=" test = ${pre} (a NaN never skips the target)`);
