// V-PR-r4 probe: THE NET's per-member lend, PR §10.3 (c): floor(n(m) × share01(m) × hold01).
// Inputs quoted from the volumes (DRAFT, as written): PR §3.1 tier ceilings; PL OD-PL-16 POLITY_PARAMOUNT_REACH;
// PL §4.7 F.2 / PR §10.3 (c) POLITY_LIEGE_SHARE; PL §3.5 bands (unbroken ≥ 0.70 · staunch ≥ 0.45).
const CEIL = { hamlet: 1, village: 2, town: 4, city: 8, metropolis: 12 };
const LIEGE = { marginal: 0.10, present: 0.25, strong: 0.38, dominant: 0.45 };
const REACH = { staunch: 0.2, unbroken: 0.3 };
const HOLD = { staunch: [0.45, 0.6999], unbroken: [0.70, 1.0] };
const out = [];
for (const crown of ['staunch', 'unbroken']) {
  const hMax = HOLD[crown][1];
  for (const rung of ['direct', 'sub']) {
    const rows = [];
    for (const [tier, n] of Object.entries(CEIL)) {
      const cells = Object.entries(LIEGE).map(([b, s]) => {
        const share = rung === 'direct' ? s : s * REACH[crown];
        return `${b}:${Math.floor(n * share * hMax)}`;
      });
      rows.push(`${tier}(n≤${n}) ${cells.join(' ')}`);
    }
    out.push(`crown ${crown} (hold01 ≤ ${hMax}) · ${rung} vassal · max lent riders = floor(n × share01 × hold01):\n  ${rows.join('\n  ')}`);
  }
}
// R39 as written: Merewick's own hold `staunch`; Ashford a SUB-vassal under Kell, any tier, any band toward Kell.
let best = 0; for (const n of Object.values(CEIL)) for (const s of Object.values(LIEGE)) best = Math.max(best, Math.floor(n * s * REACH.staunch * HOLD.staunch[1]));
out.push(`R39 (crown staunch; Ashford a sub-vassal): the most Ashford can ever lend = ${best}`);
// PL F.2's Σ (sum then floor) vs PR's per-member floor, a kingdom of ten town-sized direct vassals, band strong, hold 0.60
const members = Array(10).fill({ n: 4, share: LIEGE.strong }); const hold = 0.60;
const sumThenFloor = Math.floor(members.reduce((a, m) => a + m.n * m.share * hold, 0));
const floorEach = members.reduce((a, m) => a + Math.floor(m.n * m.share * hold), 0);
out.push(`ten town vassals (n 4, strong 0.38) at hold 0.60: PL F.2's Σ riders × share01 × hold01 = ${(10*4*0.38*0.6).toFixed(2)} → floor of the sum ${sumThenFloor}; PR's per-member floor summed = ${floorEach}`);
console.log(out.join('\n'));
