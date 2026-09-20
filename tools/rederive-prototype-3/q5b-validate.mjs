/** Q5.0 — the instrument's own control: every check must hold on 63/63 PLAIN records. */
import { sample63, keyOf } from './lib.mjs';
import { generate } from './seam.mjs';
import { checkExact, checkBands, observeBands, checkFlags, observeFlags, EXACT, BANDS } from './invariants.mjs';
const rows = sample63();
const recs = rows.map(r => generate(r));
const obs = observeBands(recs);
const FOBS = observeFlags(recs);
console.log(`=== Q5.0 — the invariant instrument's control over 63 PLAIN records ===`);
console.log(`exact checks=${EXACT.length}  band pairs=${BANDS.length}`);
let bad = 0;
recs.forEach((r, i) => {
  const e = checkExact(r); const b = [...checkBands(r, obs), ...checkFlags(r, FOBS)];
  if (e.length || b.length) { bad += 1; console.log(`  ⛔ ${keyOf(rows[i])}: ${[...e, ...b].join(' | ')}`); }
});
console.log(`rows violating any check: ${bad}/${recs.length}  ${bad === 0 ? '(the instrument is clean — it may convict a merged record)' : '⛔ the instrument is NOT clean'}`);
for (const [sp, lp] of BANDS) {
  const o = obs.get(`${sp}|${lp}`) || [];
  const byLabel = new Map();
  for (const [s, l] of o) { const e = byLabel.get(l) || [Infinity, -Infinity, 0]; byLabel.set(l, [Math.min(e[0], s), Math.max(e[1], s), e[2] + 1]); }
  console.log(`  ${lp}  observations=${o.length}  ${[...byLabel.entries()].sort((a, b) => a[1][0] - b[1][0]).map(([l, e]) => `${l}:[${e[0]}..${e[1]}]×${e[2]}`).join(' ')}`);
}
