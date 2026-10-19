// D-MN-r3 probe (read-only): the cured M53/MN5 claims against master 81f1cd963's own stepEmbattlement.
// (1) a CALM town under the column (0.60, unsuppressed) latches; (2) when the column leaves and only the
// suppressed raid part remains (0.60 − min(0.25, 0.20 + 0.15) = 0.35), the town STAYS embattled and its
// level eases toward 0.35; (3) a calm watched country under the suppressed raid part alone never enters;
// (4) the raid stops (raw 0) → the town leaves only after EXIT 0.30 and the dwell.
// Also the A.15 multiplier arithmetic for M44. Run: node m53.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const emb = await import(pathToFileURL(path.join(W, 'src/domain/spatial/embattlement.js')).href);
const T = emb.EMBATTLEMENT_TUNING;
const sigma = Math.min(0.25, 0.20 + 0.15);
const raidPart = Math.max(0, 0.60 - sigma);
console.log(JSON.stringify({ ENTER: T.ENTER_THRESHOLD, EXIT: T.EXIT_THRESHOLD, MIN_DWELL_TICKS: T.MIN_DWELL_TICKS, sigma, raidPart: +raidPart.toFixed(4) }));
let rec = null, tick = 0;
const p = (x) => Math.max(0.60, x); // the composition's max with the column present
for (let w = 0; w < 4; w++) { tick++; rec = emb.stepEmbattlement(rec, p(raidPart), tick); }
console.log(`column present 4 weeks at raw ${p(raidPart)}: phase ${rec.phase}, level ${rec.level.toFixed(4)}`);
const levels = [];
for (let w = 0; w < 26; w++) { tick++; rec = emb.stepEmbattlement(rec, raidPart, tick); levels.push(rec ? rec.phase + '@' + rec.level.toFixed(3) : 'pruned'); }
console.log(`column gone, raid part ${raidPart.toFixed(2)} for 26 weeks: week1 ${levels[0]} · week6 ${levels[5]} · week13 ${levels[12]} · week26 ${levels[25]}`);
const phasesAfter = new Set(levels.map((s) => s.split('@')[0]));
console.log(`phases while the menace still raids: ${[...phasesAfter].join(',')}`);
let left = null;
for (let w = 0; w < 40; w++) { tick++; rec = emb.stepEmbattlement(rec, 0, tick); if (!rec || rec.phase !== 'embattled') { left = w + 1; break; } }
console.log(`the raid stops (raw 0): leaves embattled after ${left} week(s)`);
let c = null, t = 0; const seen = new Set();
for (let w = 0; w < 52; w++) { t++; c = emb.stepEmbattlement(c, raidPart, t); seen.add(c ? c.phase : 'pruned'); }
console.log(`calm watched country, 52 weeks at raw ${raidPart.toFixed(2)}: phases seen ${[...seen].join(',')}`);
// A.15: paragonLean returns { mult }; the wear read is score × mult
const MODEST = 0.35;
for (const score of [0.30, 0.32, 0.33]) console.log(`wear: score ${score} × 1.10 = ${(score * 1.10).toFixed(3)} ${score * 1.10 >= MODEST ? '≥' : '<'} modest ${MODEST}`);
// the siege draw: u × mult, the shift's size by u
for (const u of [0.1, 0.5, 0.9]) console.log(`siege draw u=${u}: × 1.05 → ${(Math.min(1, u * 1.05)).toFixed(3)} (shift +${(Math.min(1, u * 1.05) - u).toFixed(3)}); × 0.95 → ${(u * 0.95).toFixed(3)}`);
