// V-MN-r3 probe (read-only): MN §4.2 composes threatMap[id] = T + p·(1 − T) (T = the kernel's own rampThreat).
// MN5/M50 claim "a calm watched country NEVER LATCHES" because the suppressed raid part 0.35 < ENTER 0.55.
// Test the claim on the UNION, with master's own rampThreat and stepEmbattlement. Run: node union.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const emb = await import(pathToFileURL(path.join(W, 'src/domain/spatial/embattlement.js')).href);
const p = 0.35; // MN's suppressed raid-and-road part (0.60 − min(0.25, 0.20 + 0.15))
const cases = [
  { name: 'no base threat', inputs: {} },
  { name: 'crime 1.0, no security', inputs: { crime01: 1 } },
  { name: 'war exhaustion 0.6, no security', inputs: { warExhaustion01: 0.6 } },
  { name: 'war exhaustion 0.8, no security', inputs: { warExhaustion01: 0.8 } },
  { name: 'occupation extractive, no security', inputs: { occupationState: 'extractive' } },
  { name: 'war exhaustion 0.8, security 0.5', inputs: { warExhaustion01: 0.8, security01: 0.5 } },
];
for (const c of cases) {
  const T = emb.rampThreat(c.inputs);
  let recBase = null, recUnion = null; const seenBase = new Set(), seenUnion = new Set();
  for (let t = 1; t <= 26; t++) {
    recBase = emb.stepEmbattlement(recBase, T, t); seenBase.add(recBase ? recBase.phase : 'none');
    const raw = T + p * (1 - T);
    recUnion = emb.stepEmbattlement(recUnion, raw, t); seenUnion.add(recUnion ? recUnion.phase : 'none');
  }
  console.log(`${c.name}: T=${T.toFixed(3)} alone→${[...seenBase].join('/')} · union raw=${(T + p * (1 - T)).toFixed(3)}→${[...seenUnion].join('/')}`);
}
