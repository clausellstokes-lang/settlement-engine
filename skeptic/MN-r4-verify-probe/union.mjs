// D-MN-r4 probe (read-only): MN-r3-verify N1 — the suppressed raid part (0.35) composes with the town's own ramp
// threat T by the union `T + p(1 − T)`; master's stepEmbattlement latches a calm town above ENTER_THRESHOLD.
// Finds the ramp threshold T* under which a watched, raided country never latches, and checks both sides of it.
// Run: node union.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const emb = await import(pathToFileURL(path.join(W, 'src/domain/spatial/embattlement.js')).href);
const T = emb.EMBATTLEMENT_TUNING;
const p = 0.60 - 0.25; // MENACE_RAID_PRESENCE less ST's full sigma
const tStar = (T.ENTER_THRESHOLD - p) / (1 - p);
console.log(`ENTER ${T.ENTER_THRESHOLD} EXIT ${T.EXIT_THRESHOLD} DWELL ${T.MIN_DWELL_TICKS}; raid part p=${p.toFixed(2)}; T* = ${tStar.toFixed(4)}`);
for (const ramp of [0, 0.2, 0.3, 0.3077, 0.31, 0.36]) {
  const raw = ramp + p * (1 - ramp);
  let rec = null;
  rec = emb.stepEmbattlement(rec, raw, 1);
  console.log(`ramp T=${ramp.toFixed(4)} raw=${raw.toFixed(4)} → phase after one step from calm: ${rec?.phase}`);
}
