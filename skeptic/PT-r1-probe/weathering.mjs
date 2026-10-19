// PT-r1 probe: drive the LANDED degradeTelling (imported, not copied) over N hops with a
// seeded fork; measure (a) how often a deed part at threshold 0.85 / 0.75 survives k hops,
// (b) the direction of the landed magnitude drift from each starting band.
const W = process.argv[2];
const { degradeTelling } = await import(`${W}/src/domain/spatial/rumorNetwork.js`);
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function fork(seed) { const r = mulberry32(seed); return { random: r, chance: (p) => r() < p, randInt: (a, b) => a + Math.floor(r() * (b - a + 1)) }; }
const digest = { settlementIds: ['a', 'b', 'c', 'd', 'e', 'f'] };
const N = 200000;
const out = {};
for (const hops of [1, 2, 3, 4]) {
  let r85 = 0, r75 = 0;
  for (let i = 0; i < N; i++) {
    let rec = { completeness01: 1, accuracy01: 1, content: { what: 'x', whereId: 'a', scope: 'regional', magnitude: 2, partyIds: ['a'], causeClass: null, deityName: null } };
    for (let h = 0; h < hops; h++) { const f = fork(i * 7919 + h * 104729 + hops * 15485863); const d = degradeTelling(rec, f, digest); rec = { ...rec, ...d }; }
    if (rec.completeness01 >= 0.85) r85++;
    if (rec.completeness01 >= 0.75) r75++;
  }
  out[`hops_${hops}`] = { reason_visible_at_0_85: +(r85 / N).toFixed(4), reason_visible_at_0_75_shown: +(r75 / N).toFixed(4) };
}
for (const start of [0, 1, 2, 3]) {
  let up = 0, down = 0, same = 0;
  for (let i = 0; i < N; i++) {
    const rec = { completeness01: 1, accuracy01: 1, content: { what: 'x', whereId: 'a', scope: 'regional', magnitude: start, partyIds: ['a'], causeClass: null, deityName: null } };
    const d = degradeTelling(rec, fork(i * 31 + start * 1000003), digest);
    if (d.content.magnitude > start) up++; else if (d.content.magnitude < start) down++; else same++;
  }
  out[`magnitude_from_${start}`] = { up: +(up / N).toFixed(4), down: +(down / N).toFixed(4), same: +(same / N).toFixed(4) };
}
console.log(JSON.stringify(out, null, 1));
