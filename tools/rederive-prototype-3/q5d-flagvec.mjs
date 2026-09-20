import { sample63 } from './lib.mjs';
import { generate } from './seam.mjs';
const m = new Map();
for (const r of sample63()) {
  const f = generate(r).economicState?.foodSecurity; if (!f) continue;
  const vec = JSON.stringify(['isDeficit', 'isPressured', 'isSecure', 'isSurplus'].map(k => f[k]));
  if (!m.has(f.label)) m.set(f.label, new Map());
  m.get(f.label).set(vec, (m.get(f.label).get(vec) || 0) + 1);
}
for (const [l, v] of m) console.log(`${l.padEnd(26)} ${[...v.entries()].map(([k, n]) => `${k}×${n}`).join('  ')}`);
