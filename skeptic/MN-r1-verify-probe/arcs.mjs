// V-MN-r1 probe — does a RELEASED (unheld, still-active, episodic) menace record keep counting as a live
// drama arc? Imports master 81f1cd963's own modules read-only. Run: node arcs.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);
const { createPRNG } = await imp('src/kernel/prng.js');
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
const tempo = await imp('src/domain/worldPulse/narrativeTempo.js');
const ep = { durationPolicy: 'episodic', decayRate: core.STRESSOR_POLICIES.episodic.decay };
// the menace now at Kell's walls: its siege record (held in the design; here simply kept at its floor)
const siege = core.normalizeStressor({ id: 'world_stressor.siege.kell.menace.m1', type: 'siege', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: 0.6, age: 1, ...ep });
// its raider record at Kell, RELEASED the tick it went to the walls (age 3, at the capable floor 0.60)
let raider = core.normalizeStressor({ id: 'world_stressor.monster_raider_pressure.kell.menace.m1', type: 'monster_raider_pressure', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: 0.6, age: 3, ...ep });
// a waypoint raider record left at Tolle the week before (age 1), also released
let tolle = core.normalizeStressor({ id: 'world_stressor.monster_raider_pressure.tolle.menace.m1', type: 'monster_raider_pressure', originSettlementId: 'tolle', affectedSettlementIds: ['tolle'], severity: 0.6, age: 1, ...ep });
const snap = { byId: new Map(), worldState: {} };
const out = [];
out.push(`dramaClass siege=${tempo.dramaClassForStressorType ? tempo.dramaClassForStressorType('siege') : 'n/a'} raider=${tempo.dramaClassForStressorType ? tempo.dramaClassForStressorType('monster_raider_pressure') : 'n/a'}`);
for (let w = 0; w <= 10; w++) {
  const live = [siege, raider, tolle].filter(Boolean).filter(s => s.status === 'active');
  out.push(`week ${w}: arcs=${tempo.countLiveMajorArcs({ stressors: live })} stages=${live.map(s => s.type.slice(0, 7) + ':' + s.lifecycleStage + '@' + s.severity).join(' ')}`);
  const r = createPRNG(`vmn-${w}`);
  for (const name of ['raider', 'tolle']) {
    const rec = name === 'raider' ? raider : tolle;
    if (!rec || rec.status !== 'active') continue;
    const res = str.ageRoamingStressors([rec], snap, r.fork(name), { tick: w + 1 });
    const next = res.resolved.length ? null : res.stressors[0];
    if (name === 'raider') raider = next; else tolle = next;
  }
}
console.log(out.join('\n'));
