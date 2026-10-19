// MN-r2-verify probe (read-only): does a town ALREADY embattled fall out of the latch when the
// suppressible raid part drops to 0.35 (MN5 "may fall out of the embattled latch"; M53 "Tolle relaxes
// by its own hysteresis") or 0.45 (ST §3.4: fortification suppression 0 while THE PATROLS are lit)?
// Imports master 81f1cd963's own embattlement module. Run: node hysteresis.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const emb = await import(pathToFileURL(path.join(W, 'src/domain/spatial/embattlement.js')).href);
const T = emb.EMBATTLEMENT_TUNING;
console.log(JSON.stringify({ ENTER: T.ENTER_THRESHOLD, EXIT: T.EXIT_THRESHOLD, MIN_DWELL_TICKS: T.MIN_DWELL_TICKS }));
for (const after of [0.35, 0.45]) {
  let rec = null; let tick = 0;
  for (let w = 0; w < 8; w++) { tick++; rec = emb.stepEmbattlement(rec, 0.60, tick); } // column (or unsuppressed raid) 8 weeks
  const atSwitch = { ...rec };
  let phases = new Set(); let lastLevel = null;
  for (let w = 0; w < 52; w++) { tick++; rec = emb.stepEmbattlement(rec, after, tick); if (rec) { phases.add(rec.phase); lastLevel = rec.level; } else { phases.add('pruned'); } }
  console.log(`after 8 weeks at 0.60 (phase ${atSwitch.phase}, level ${atSwitch.level}), then 52 weeks at raw ${after}: phases seen ${[...phases].join(',')}; final level ${lastLevel}`);
}
// a calm town under the suppressed raid part never enters (the M50 assertion)
let c = null; let t = 0; const seen = new Set();
for (let w = 0; w < 20; w++) { t++; c = emb.stepEmbattlement(c, 0.35, t); seen.add(c ? c.phase : 'pruned'); }
console.log(`calm town, 20 weeks at raw 0.35: phases seen ${[...seen].join(',')}`);
