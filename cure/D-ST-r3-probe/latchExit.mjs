// D-ST-r3 probe (read-only): ST8 / §3.4's latch claims under MN §3.3's one composition, against master's own
// `embattlement.js :: stepEmbattlement` (ENTER 0.55 / EXIT 0.30 / MIN_DWELL_TICKS). Composed threat = T0 + p·(1 − T0).
// Run: node latchExit.mjs <master worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const emb = await import(pathToFileURL(path.join(W, 'src/domain/spatial/embattlement.js')).href);
const T = emb.EMBATTLEMENT_TUNING;
console.log(JSON.stringify({ ENTER: T.ENTER_THRESHOLD, EXIT: T.EXIT_THRESHOLD, MIN_DWELL_TICKS: T.MIN_DWELL_TICKS }));
const compose = (t0, p) => t0 + p * (1 - t0);
function run(label, t0, pBefore, weeksBefore, pAfter, weeksAfter) {
  let rec = null; let tick = 0;
  for (let w = 0; w < weeksBefore; w++) { tick++; rec = emb.stepEmbattlement(rec, compose(t0, pBefore), tick); }
  const before = rec ? rec.phase : 'pruned';
  const seen = []; let exitWeek = null;
  for (let w = 0; w < weeksAfter; w++) { tick++; rec = emb.stepEmbattlement(rec, compose(t0, pAfter), tick); const ph = rec ? rec.phase : 'pruned'; if (seen[seen.length - 1] !== ph) seen.push(ph); if (exitWeek === null && ph !== 'embattled') exitWeek = w + 1; }
  console.log(`${label}: T0=${t0} p ${pBefore}→${pAfter} (raw ${compose(t0, pBefore).toFixed(3)}→${compose(t0, pAfter).toFixed(3)}): phase before=${before}; after=${seen.join('→')}${exitWeek ? ` (left at week ${exitWeek})` : ' (never left in ' + weeksAfter + ' weeks)'}`);
}
// (a) a capable den in a sound keep at hand latches a calm town alone; a kept road (σ 0.25) then holds raw 0.35
run('capable den, then kept road', 0, 0.60, 8, 0.35, 52);
// (b) a menace raid (0.60) on a kept road: same arithmetic as (a) — MN M53's corrected tail
run('menace raid, then kept road', 0, 0.60, 8, 0.35, 52);
// (c) a modest den (0.40) sustains a town already embattled; kept road then 0.40 − 0.25 = 0.15
run('modest den sustains', 0, 0.60, 8, 0.40, 52);
run('modest den, then kept road (T0 0)', 0, 0.60, 8, 0.15, 52);
run('modest den, then kept road (T0 0.2)', 0.2, 0.60, 8, 0.15, 52);
// (d) a calm town never enters at the suppressed raid part
run('calm, kept road only', 0, 0.35, 0, 0.35, 20);
