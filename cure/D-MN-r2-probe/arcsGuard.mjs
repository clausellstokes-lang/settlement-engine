// D-MN-r2 probe — MN-r1-10 (FAIL): the verifier's scenario (a menace at Kell's walls: its held siege record, its raider
// record released the tick it went to the walls, and a waypoint raider record released at Tolle the week before).
// (1) master's countLiveMajorArcs counts 3; (2) the round-2 guard — `countLiveMajorArcs` skips a record carrying
// `originContext.menaceRelease` while `menacesEnabled` is lit (one line in narrativeTempo.js) — counts 1;
// (3) the stamp SURVIVES master's normalizeStressor and ageRoamingStressors (else the guard would lapse after a week);
// (4) dark (menacesEnabled absent) the guard is inert: the released tails count as ordinary stressors.
// The guard is applied as a pre-filter with exactly the guard's predicate (master is read-only).
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);
const { createPRNG } = await imp('src/kernel/prng.js');
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
const tempo = await imp('src/domain/worldPulse/narrativeTempo.js');
const ep = { durationPolicy: 'episodic', decayRate: core.STRESSOR_POLICIES.episodic.decay };
const oc = (extra = {}) => ({ variant: 'menace', menaceId: 'menace.m1', attackerSettlementId: null, sponsorSettlementId: null, ...extra });
const rel = { menaceRelease: { tick: 19, causedBy: 'realm_verb.MENACE_COURSE.kell.19.x' } };
const siege = core.normalizeStressor({ id: 'world_stressor.siege.kell.menace.m1', type: 'siege', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: 0.6, age: 1, originContext: oc({ attackerLabel: 'the Ashen Host' }), ...ep });
let raider = core.normalizeStressor({ id: 'world_stressor.monster_raider_pressure.kell.menace.m1', type: 'monster_raider_pressure', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: 0.6, age: 3, originContext: oc(rel), ...ep });
let tolle = core.normalizeStressor({ id: 'world_stressor.monster_raider_pressure.tolle.menace.m1', type: 'monster_raider_pressure', originSettlementId: 'tolle', affectedSettlementIds: ['tolle'], severity: 0.6, age: 1, originContext: oc(rel), ...ep });
const guard = (ws) => tempo.countLiveMajorArcs({ ...ws, stressors: (ws.stressors || []).filter((s) => !(ws?.simulationRules?.menacesEnabled === true && s?.originContext?.menaceRelease)) });
const lit = { menacesEnabled: true };
console.log(`(1) master, week 0: ${tempo.countLiveMajorArcs({ stressors: [siege, raider, tolle] })}`);
console.log(`(2) guarded (lit), week 0: ${guard({ stressors: [siege, raider, tolle], simulationRules: lit })}`);
console.log(`(4) guarded (dark), week 0: ${guard({ stressors: [siege, raider, tolle], simulationRules: {} })}`);
const snap = { byId: new Map(), worldState: {} };
let stampKept = true;
for (let w = 1; w <= 8; w++) {
  for (const name of ['raider', 'tolle']) {
    const rec = name === 'raider' ? raider : tolle;
    if (!rec) continue;
    const res = str.ageRoamingStressors([rec], snap, createPRNG(`dmn2-arcs-${w}`).fork(name), { tick: 19 + w });
    const next = res.resolved.length ? null : res.stressors[0];
    if (next && !next.originContext?.menaceRelease) stampKept = false;
    if (name === 'raider') raider = next; else tolle = next;
  }
  const live = [siege, raider, tolle].filter(Boolean);
  console.log(`week ${w}: master ${tempo.countLiveMajorArcs({ stressors: live })} · guarded ${guard({ stressors: live, simulationRules: lit })} · tails alive ${live.length - 1}`);
}
console.log(`(3) menaceRelease stamp survives normalize + aging on every surviving tail: ${stampKept}`);
