// V-MN-r1 probe 2 — weeks a RELEASED menace raider record stays active (and so counted by countLiveMajorArcs),
// by severity at release (the might floors) and age; 400 seeds; no counterforce. Run: node tails.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);
const { createPRNG } = await imp('src/kernel/prng.js');
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
const tempo = await imp('src/domain/worldPulse/narrativeTempo.js');
const snap = { byId: new Map(), worldState: {} };
for (const [sev, age] of [[0.45, 1], [0.6, 1], [0.8, 1], [0.9, 1], [0.6, 3]]) {
  const weeks = []; let countedAtRelease = 0;
  for (let s = 0; s < 400; s++) {
    let rec = core.normalizeStressor({ id: 'world_stressor.monster_raider_pressure.tolle.menace.m1', type: 'monster_raider_pressure', originSettlementId: 'tolle', affectedSettlementIds: ['tolle'], severity: sev, age, durationPolicy: 'episodic', decayRate: core.STRESSOR_POLICIES.episodic.decay });
    if (s === 0) countedAtRelease = tempo.countLiveMajorArcs({ stressors: [rec] });
    const r = createPRNG(`vmn-tail-${sev}-${age}-${s}`);
    let w = 0;
    while (w < 60) { w++; const res = str.ageRoamingStressors([rec], snap, r.fork(`w${w}`), { tick: w }); if (res.resolved.length) break; rec = res.stressors[0]; }
    weeks.push(w);
  }
  weeks.sort((a, b) => a - b);
  const mean = weeks.reduce((a, b) => a + b, 0) / weeks.length;
  console.log(`raider released sev=${sev} age=${age}: counted-at-release=${countedAtRelease} · weeks active after release: median ${weeks[200]} · mean ${mean.toFixed(2)} · p90 ${weeks[360]} · max ${weeks[399]}`);
}
