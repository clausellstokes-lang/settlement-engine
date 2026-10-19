// D-PS-r3 probe — PS-V2: a reroute must never raise a column's effective field strength.
// Uses the LANDED effectiveFieldStrength from master 81f1cd963 (read-only) and the landed
// battleInputs formula (armyTransitKernel.js :: battleInputs: ground = 1 - position01,
// fatigue = position01), replayed here because battleInputs is module-private.
// Run: node reroute.mjs <master-worktree>
const M = process.argv[2];
const { effectiveFieldStrength } = await import(`${M}/src/domain/spatial/armyTransit.js`);
const clamp01 = (x) => Math.max(0, Math.min(1, x));
const landedInputs = (p) => ({ groundAdvantage01: clamp01(1 - p), fatigue01: p });
const eff = (inp) => effectiveFieldStrength({ size: 60, readiness: 0.6, supplyQuality: 0.9, funding: 0.5, ...inp });

// A march of span S weeks, rerouted after w weeks onto a new path of span S2 starting in
// FOREIGN land (the unit stands in a third court's territory when refused).
let cases = 0, landedRaise = 0, fractionRaise = 0, bankedRaise = 0, bankedNonReroutedDiff = 0;
let worstLanded = 0;
for (let S = 2; S <= 52; S++) {
  for (let w = 1; w < S; w++) {
    const pBefore = w / S;                       // position at the reroute tick on the old path
    const before = eff(landedInputs(pBefore));
    for (let S2 = 1; S2 <= 52; S2++) {
      for (let k = 0; k <= S2; k += Math.max(1, Math.floor(S2 / 4))) { // weeks marched on the new path
        cases++;
        const p2 = k / S2;
        // (a) LANDED restart: battleInputs reads the new path's position01 (restarts at 0).
        const a = eff(landedInputs(p2));
        if (a > before + 1e-9) { landedRaise++; worstLanded = Math.max(worstLanded, a / before - 1); }
        // (b) the literal "fatigue = weeks marched since sinceTick" as a fraction of the
        //     lengthened march; ground from own land (foreign here -> 0).
        const fracF = (w + k) / (w + S2);
        const b = eff({ groundAdvantage01: 0, fatigue01: fracF });
        // compare against the strength the column had at the reroute IF it had not
        // been rerouted: the pin is "a reroute never RAISES strength" vs the moment before.
        if (k === 0 && b > before + 1e-9) fractionRaise++;
        // (c) BANKED: at the reroute bank fatigueFloor01 = landed fatigue then (pBefore)
        //     and groundCap01 = landed ground then (1 - pBefore); after: fatigue rises from
        //     the floor with the weeks marched on the new path; ground is 0 in foreign land,
        //     else min(cap, 1 - p2).
        const fatigueFloor01 = pBefore, groundCap01 = clamp01(1 - pBefore);
        const cF = clamp01(fatigueFloor01 + (1 - fatigueFloor01) * p2);
        const cGforeign = 0;
        const cGown = Math.min(groundCap01, clamp01(1 - p2));
        const cForeign = eff({ groundAdvantage01: cGforeign, fatigue01: cF });
        const cOwn = eff({ groundAdvantage01: cGown, fatigue01: cF });
        if (cForeign > before + 1e-9 || cOwn > before + 1e-9) bankedRaise++;
      }
    }
  }
}
// (d) a record with NO reroute banked: the banked derivation must equal the landed inputs.
for (let S = 1; S <= 52; S++) for (let w = 0; w <= S; w++) {
  const p = w / S; const l = landedInputs(p);
  // no floor/cap => the leaf returns battleInputs verbatim (the design); check identity of the formula path
  const banked = { groundAdvantage01: clamp01(1 - p), fatigue01: p };
  if (l.groundAdvantage01 !== banked.groundAdvantage01 || l.fatigue01 !== banked.fatigue01) bankedNonReroutedDiff++;
}
console.log([
  `cases ${cases} (span 2..52 x weeks-before x new span 1..52 x weeks-after samples)`,
  `(a) LANDED restart (position01 -> 0 on the new path): strength RAISED above the pre-reroute moment in ${landedRaise} cases; worst +${(worstLanded * 100).toFixed(1)}%`,
  `(b) literal fraction-of-campaign fatigue at the reroute instant: RAISED in ${fractionRaise} of the reroute-instant cases (the detour lengthens the march, so the fraction falls)`,
  `(c) BANKED floor/cap (fatigue rises from the floor; ground 0 abroad, capped at home): RAISED in ${bankedRaise}`,
  `(d) records with no reroute banked: inputs differ from the landed battleInputs in ${bankedNonReroutedDiff} (byte-identical by construction)`,
].join('\n'));
