// D-PR-r5 probe: THE NET's lend under RULINGS-ROUND5 B.8 / PL §4.7 F.2 (r5), against the r4 per-member floor the verifier executed.
// Inputs quoted from the volumes (DRAFT, as written): PR §3.1 tier ceilings; PR §3.2 PEACE_SHARE 0.6 (posture dark);
// PL F.2 r5: lend(m) = max(1, floor(n(m) × s(m) × hold01)) while n(m) − lend(m) ≥ the home's minimum, s(m) the band share
// toward the IMMEDIATE liege (POLITY_LIEGE_SHARE: marginal 0.10 · present 0.25 · strong 0.38 · dominant 0.45), hold01 the crown's own read;
// PL §3.5 bands: staunch ≥ 0.45, unbroken ≥ 0.70. NET_HOME_MIN = 1 (PR's DRAFT constant: one rider always on the round's first half, PR §5.2).
const CEIL = { thorp: 0, hamlet: 1, village: 2, town: 4, city: 8, metropolis: 12 };
const LIEGE = { marginal: 0.10, present: 0.25, strong: 0.38, dominant: 0.45 };
const HOLDS = { 'staunch-low 0.45': 0.45, 'staunch-high 0.6999': 0.6999, 'unbroken-low 0.70': 0.70, 'unbroken-high 1.0': 1.0 };
const NET_HOME_MIN = 1;
const peaceN = max => Math.ceil(max * 0.6);
function lendR5(n, s, hold) { if (n <= 0) return 0; const l = Math.max(1, Math.floor(n * s * hold)); return (n - l >= NET_HOME_MIN) ? l : 0; }
function lendR4(n, s, hold) { return Math.floor(n * s * hold); }
function rootLend(n, hold) { return Math.max(0, Math.min(Math.floor(n * hold), n - NET_HOME_MIN)); }
const out = [];
let zeroAtStrongN2 = 0, rows = 0, homeBelowMin = 0;
for (const [hk, hold] of Object.entries(HOLDS)) {
  const lines = [];
  for (const [tier, max] of Object.entries(CEIL)) {
    for (const nKind of ['peace', 'max']) {
      const n = nKind === 'peace' ? peaceN(max) : max;
      const cells = Object.entries(LIEGE).map(([b, s]) => {
        const r5 = lendR5(n, s, hold), r4 = lendR4(n, s, hold); rows++;
        if (n >= 2 && r5 === 0) zeroAtStrongN2++;
        if (r5 > 0 && n - r5 < NET_HOME_MIN) homeBelowMin++;
        return `${b} r4:${r4}→r5:${r5}`;
      });
      lines.push(`${tier} n=${n}(${nKind}) ${cells.join(' · ')} · root ${rootLend(n, hold)}`);
    }
  }
  out.push(`hold01 ${hk}:\n  ${lines.join('\n  ')}`);
}
out.push(`CHECK (B.8 "never lends zero at a strong hold"): members with n ≥ 2 lending 0 = ${zeroAtStrongN2} of the rows (expected 0)`);
out.push(`CHECK (the home's minimum): rows where the lender keeps fewer than NET_HOME_MIN = ${homeBelowMin} (expected 0)`);
// R39 as cured: Merewick staunch (hold 0.60); Ashford a TOWN sub-vassal under Kell at peace (max 4 → n 3), any band toward Kell.
for (const [b, s] of Object.entries(LIEGE)) out.push(`R39 Ashford (town, n 3, ${b} toward Kell, hold 0.60): lend = ${lendR5(3, s, 0.60)} (r4: ${lendR4(3, s * 0.2, 0.60)} at the crown's own share)`);
// PL F.2's sum, ten town direct vassals (n 4, strong 0.38) at hold 0.60
const tenR5 = Array(10).fill(0).reduce(a => a + lendR5(4, 0.38, 0.60), 0);
const tenR4 = Array(10).fill(0).reduce(a => a + lendR4(4, 0.38, 0.60), 0);
out.push(`ten town vassals (n 4, strong, hold 0.60): Σ lend r5 = ${tenR5} (r4 per-member floor ${tenR4}; r4 PL Σ-then-floor 9)`);
// a hamlet (n 1) never lends; a village at peace (max 2 → n 2) lends 1 and keeps 1
out.push(`hamlet n 1: lend ${lendR5(1, 0.45, 1.0)} · village n 2 (strong, 0.6): lend ${lendR5(2, 0.38, 0.6)}, keeps ${2 - lendR5(2, 0.38, 0.6)}`);
console.log(out.join('\n'));
