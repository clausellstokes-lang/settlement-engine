// D-MN-r1 probe 2 — weeks to resolution of a RELEASED episodic siege record by its age at release (no counterforce, 200 seeds)
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);
const { createPRNG } = await imp('src/kernel/prng.js');
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
const snapshot = { byId: new Map(), worldState: {} };
for (const age of [1, 3, 6, 8, 20]) {
  const weeks = [];
  for (let s = 0; s < 200; s++) {
    let rec = core.normalizeStressor({ id: 'world_stressor.siege.kell.menace.m1', type: 'siege', originSettlementId: 'kell', severity: 0.85, age, durationPolicy: 'episodic', decayRate: core.STRESSOR_POLICIES.episodic.decay });
    const r = createPRNG(`dmn-r1-age-${s}`);
    let w = 0;
    while (w < 60) { w++; const res = str.ageRoamingStressors([rec], snapshot, r.fork(`w${w}`), { tick: w }); if (res.resolved.length) break; rec = res.stressors[0]; }
    weeks.push(w);
  }
  weeks.sort((a, b) => a - b);
  console.log(`age ${age}: median ${weeks[100]} · p90 ${weeks[180]} · max ${weeks[199]}`);
}
