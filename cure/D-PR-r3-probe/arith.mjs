// D-PR-r3 probe (read-only imports from master 81f1cd963; no edits there).
// (1) PR-r2-3: campaign kept vs peace fielded under the round-3 rule.
// (2) PR-V3: the harassment trigger — old ("fielded at max in peace") vs new (the fork: peaceShare > PEACE_SHARE).
// (3) CARRY: the rider-time allocation — each rider ONE place a week; cadence words exact periods.
// (4) PR-V8: the leg's progress01 vs the hop-local fraction (master's namedPersonPathPosition).
const W = process.argv[2];
const { fnv1a32 } = await import(`${W}/src/kernel/proseHash.js`);
const { namedPersonPathPosition } = await import(`${W}/src/domain/worldPulse/namedPersonTransit.js`);
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const courts = [
  { name: 'bold (a=1,h=0)', a: 1, h: 0 }, { name: 'median (a=.5,h=0)', a: 0.5, h: 0 },
  { name: 'wary (a=0,h=0)', a: 0, h: 0 }, { name: 'lawful-cruel (a=.5,h=1)', a: 0.5, h: 1 },
  { name: 'wary+harsh (a=.25,h=.5)', a: 0.25, h: 0.5 },
];
const PEACE_SHARE = 0.6, CAMPAIGN_SHARE = 0.75, W_HARASS = 0.10;
let rows = 0, below = 0, equal = 0, above = 0, eqNotAtMax = 0, oldTrig = 0, newTrig = 0, oldOnlyRounding = 0;
console.log('== (1)+(2) the 60-row grid (5 courts x max 1..12)');
for (const c of courts) {
  const ps = clamp(PEACE_SHARE + 0.4 * (0.5 - c.a) + 0.2 * c.h, 0.4, 1.0);
  const harass = ps > PEACE_SHARE ? W_HARASS * clamp((ps - PEACE_SHARE) / (1 - PEACE_SHARE), 0, 1) : 0;
  for (let max = 1; max <= 12; max++) {
    const peace = Math.ceil(max * ps);
    const kept = Math.max(Math.ceil(max * CAMPAIGN_SHARE), Math.min(max, peace + 1));
    rows++;
    if (kept < peace) below++; else if (kept === peace) { equal++; if (peace !== max) eqNotAtMax++; } else above++;
    const ot = peace === max, nt = ps > PEACE_SHARE;
    if (ot) oldTrig++; if (nt) newTrig++; if (ot && !nt) oldOnlyRounding++;
    if (max <= 4 || max === 12) console.log(`${c.name.padEnd(26)} ps=${ps.toFixed(2)} max=${String(max).padStart(2)} peace=${String(peace).padStart(2)} kept=${String(kept).padStart(2)} oldTrigger=${ot ? 'Y' : '-'} newTrigger=${nt ? 'Y' : '-'} harassInput=${harass.toFixed(3)}`);
  }
}
console.log(`rows=${rows} campaignBelowPeace=${below} campaignEqualPeace=${equal} (of which peace<max: ${eqNotAtMax}) campaignAbovePeace=${above}`);
console.log(`harassment: oldTrigger(fielded==max)=${oldTrig} rows · newTrigger(fork)=${newTrig} rows · old fired by rounding alone (no fork)=${oldOnlyRounding}`);

// (3) the rider-time allocation (DRAFT rule as written in PR §2.3, round 3)
function allocate(n, halves, power) {
  const H = halves.length; const out = new Map();
  if (n <= 0) { for (const h of halves) out.set(h, { cadence: 'never' }); return { out, rovers: [] }; }
  if (n >= H) { halves.forEach((h) => out.set(h, { cadence: 'weekly' })); return { out, rovers: [], spare: n - H }; }
  const r = Math.min(n - 1, Math.ceil((H - n) / 3)); const s = n - r; // the round's first half always stands (n >= 1)
  halves.slice(0, s).forEach((h) => out.set(h, { cadence: 'weekly' }));
  const roving = halves.slice(s); const period = roving.length <= 4 * r ? 4 : 13;
  const rovers = []; let idx = 0;
  for (let b = 0; b < r; b++) {
    const size = Math.floor(roving.length / r) + (b < roving.length % r ? 1 : 0);
    const block = roving.slice(idx, idx + Math.min(size, period)); idx += size;
    const slots = [...block].sort((x, y) => fnv1a32(`patrol:slot:${x}:${power}`) - fnv1a32(`patrol:slot:${y}:${power}`) || (x < y ? -1 : 1));
    const base = fnv1a32(`patrol:rover:${power}:${b}`) % period;
    slots.forEach((h, j) => out.set(h, { cadence: period === 4 ? 'every_four_weeks' : 'every_thirteen_weeks', period, slot: j, base }));
    rovers.push({ period, slots, base });
  }
  for (const h of roving) if (!out.has(h)) out.set(h, { cadence: 'never' });
  return { out, rovers };
}
let cases = 0, violations = 0, exactFails = 0, neverCount = 0, homeWeeks = 0, riderWeeks = 0;
for (let n = 0; n <= 12; n++) for (let H = 1; H <= 9; H++) {
  cases++;
  const halves = Array.from({ length: H }, (_, i) => `stretch:kell|n${i}#kell`);
  const { out, rovers } = allocate(n, halves, 'kell');
  const presentCount = new Map(halves.map((h) => [h, 0]));
  for (let t = 0; t < 52 * 4; t++) {
    let places = 0; // rider-places this week
    for (const h of halves) { const a = out.get(h); if (a.cadence === 'weekly') { places++; presentCount.set(h, presentCount.get(h) + 1); } }
    for (const rv of rovers) {
      const slot = (t + rv.base) % rv.period;
      if (slot < rv.slots.length) { places++; presentCount.set(rv.slots[slot], presentCount.get(rv.slots[slot]) + 1); } else { places++; homeWeeks++; }
    }
    riderWeeks += Math.min(n, H) > 0 ? places : 0;
    if (places > n) violations++;
  }
  for (const h of halves) {
    const a = out.get(h); const c = presentCount.get(h); const expect = { weekly: 208, every_four_weeks: 52, every_thirteen_weeks: 16, never: 0 }[a.cadence];
    if (c !== expect) exactFails++; if (a.cadence === 'never') neverCount++;
  }
}
console.log(`== (3) allocation: cases=${cases} (n 0..12 x H 1..9, 208 weeks each) · weeks with more rider-places than riders=${violations} · halves whose presence != its word's exact period=${exactFails} · 'never' halves=${neverCount} · rover home-weeks=${homeWeeks}`);
for (const [n, H] of [[1, 3], [2, 6], [4, 6], [3, 9], [1, 9]]) {
  const halves = Array.from({ length: H }, (_, i) => `h${i}`); const { out } = allocate(n, halves, 'kell');
  console.log(`  n=${n} H=${H}: ${halves.map((h) => out.get(h).cadence.replace('every_', '').replace('_weeks', 'w')).join(' · ')}`);
}

// (4) the leg's progress01 is LEG-wide; the hop and the half follow from it
console.log('== (4) namedPersonPathPosition on a 4-node path, departTick 0, arrivalTick 6');
for (let t = 0; t <= 6; t++) {
  const p = namedPersonPathPosition({ path: ['A', 'B', 'C', 'D'], departTick: 0, arrivalTick: 6, tick: t });
  const last = 3; const along = p.progress01; const local = along * last - p.hopIndex; const cut = 0.5;
  const legFrac = (p.hopIndex + cut) / last;
  const half = along < legFrac ? 'origin' : 'destination';
  console.log(`  t=${t} progress01=${p.progress01.toFixed(3)} hopIndex=${p.hopIndex} nodeId=${p.nodeId} hopLocal=${local.toFixed(3)} gateAtLegFraction=${legFrac.toFixed(3)} half=${half} agree=${(local < cut) === (along < legFrac)}`);
}
// never-count by n (H 1..9), the cost of the first-half-always-stands rule
for (let n = 0; n <= 4; n++) { let nev = 0, tot = 0; for (let H = 1; H <= 9; H++) { const hs = Array.from({ length: H }, (_, i) => `h${i}`); const { out } = allocate(n, hs, 'kell'); for (const h of hs) { tot++; if (out.get(h).cadence === 'never') nev++; } } console.log(`  n=${n}: never ${nev} of ${tot} halves (H 1..9)`); }
