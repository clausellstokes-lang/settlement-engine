// D-MG-r3 probe (E.3 · MG-V2): the cured law's arithmetic for MG §4.1 rows 2 and 15. Arithmetic only.
// HB (DESIGN_FP_ARCH_HB.md, HB-7): anticipationFactorFor -> 1 unless habitAnticipationActive; 1 unless the observer's
// belief record carries doctrineBands[cls]; else 1 + ANTICIPATION_SPAN * counterWeight * holdRank01, SPAN 0.20, cw in {-1,0,+1}.
// MG r3 (E.3): rows 2/15 LIGHT ON THE FLAG; their weight in [1, 1 + SPAN]; HB's term enters ONCE, in §5.1 (v).
const SPAN = 0.20, OLD_MOTIVE_MAX = 4, NEW_MOTIVE_MAX = 1 + SPAN;
const hb = (flag, hasBands, cw, rank) => (!flag || !hasBands) ? 1 : 1 + SPAN * cw * rank;
const out = [];
out.push(`HB's own bound (cw +1, rank 1): x${hb(true, true, 1, 1).toFixed(2)}; row 2/15 weight bound after E.3: x${NEW_MOTIVE_MAX.toFixed(2)} (r2: x${OLD_MOTIVE_MAX})`);
// (a) flag DARK: row 2 fires on nothing; (v) reads 1.
out.push(`(a) flag dark: row 2 factor x1 (no posture, no draw, no receipt); (v) x${hb(false, true, 1, 1).toFixed(2)}; split's doctrine-and-invitation product x1.00`);
for (const rank of [0.25, 0.5, 1]) {
  const withBands = NEW_MOTIVE_MAX * hb(true, true, 1, rank);
  const without = NEW_MOTIVE_MAX * hb(true, false, 1, rank);
  out.push(`(b) flag lit, holdRank01 ${rank}: the DOCTRINE's own effect on split = (v) term x${hb(true, true, 1, rank).toFixed(2)} (<= HB's x1.20) · row 2 at its bound x${NEW_MOTIVE_MAX.toFixed(2)} on a believed pursuer · product with doctrineBands x${withBands.toFixed(2)} vs without x${without.toFixed(2)} (ratio x${(withBands / without).toFixed(2)} = the (v) term) · r2's per-dyad worst case x${(OLD_MOTIVE_MAX * hb(true, true, 1, rank)).toFixed(2)}`);
}
out.push(`(c) flag lit, court holds NO doctrineBands for the foe: (v) x1.00; row 2 fires on the believed pursuer at most x${NEW_MOTIVE_MAX.toFixed(2)} (r2's flag-level reading: up to x${OLD_MOTIVE_MAX}.00)`);
out.push(`(d) a counter cell (cw -1, rank 1): (v) x${hb(true, true, -1, 1).toFixed(2)} — HB's term may LOWER split; the row's weight never goes below x1`);
console.log(out.join('\n'));
