// V-MG-r2 probe: the doctrine belief's total effect on split's score under the two readings of
// MG §4.1 row 2's "lighting condition" (MG-V2's cure). HB: anticipation = 1 + SPAN*cw*holdRank01, SPAN 0.20 (HB l.1546/2565).
// MG: each firing motive's mult in [1, 4] (MG10, DRAFT). Arithmetic only; no code imported.
const SPAN = 0.20, MOTIVE_MAX = 4;
const hb = (cw, rank) => 1 + SPAN * cw * rank;
const out = [];
for (const rank of [0.25, 0.5, 1]) {
  const term = hb(1, rank);
  // (A) per-dyad gate: row 2 fires only when the term != 1 -> the doctrine moves split by term x row2 mult
  const perDyad = term * MOTIVE_MAX;
  out.push(`holdRank01 ${rank}: HB term ${term.toFixed(2)} (HB's own bound ${hb(1,1).toFixed(2)}) · per-dyad gate: doctrine's effect on split up to x${perDyad.toFixed(2)} (row 2 admitted only because the belief exists)`);
}
// (B) flag-level gate: no doctrine belief -> term 1, yet row 2 fires on any believed pursuer
out.push(`flag-level gate, court holds NO doctrineBands for the foe: HB term 1.00 · row 2 still fires, split x up to ${MOTIVE_MAX} · receipt "hoping Tolle's host would do the same" has no read behind it`);
console.log(out.join('\n'));
