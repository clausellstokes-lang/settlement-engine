// V-MN-r1 probe 3 — after the press envelope is SPENT (held floor 0.55, under the 0.6 flight band), can the town's
// own escalation put the held record back over the flight band for the next tick's flows? The design's hold is
// Math.max(blockFloor, heldFloor, decayed): a FLOOR, which can only RAISE the aged value, so the un-held aged value
// below is a lower bound on the held one. Escalation formula and gate are the landed ones (stressors.js ::
// evaluateStressorRules). Run: node spent.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);
const { createPRNG } = await imp('src/kernel/prng.js');
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
const snap = { byId: new Map(), worldState: {} };
const SPENT = 0.55; const FLIGHT = 0.6;
for (const p of [0.65, 0.7, 0.75, 0.8, 0.9]) {
  const gate = p > 0.62 && SPENT < 0.92;
  const escalated = Math.min(1, Math.max(0, (SPENT + p) / 2 + 0.08));
  const rec = core.normalizeStressor({ id: 'world_stressor.siege.kell.menace.m1', type: 'siege', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: escalated, age: 10, durationPolicy: 'episodic', decayRate: core.STRESSOR_POLICIES.episodic.decay });
  const res = str.ageRoamingStressors([rec], snap, createPRNG('vmn-spent').fork('a'), { tick: 11 });
  const aged = (res.stressors.find(s => s.id === rec.id && s.status === 'active') || res.resolved[0] || {}).severity;
  const heldAged = Math.max(SPENT, aged);
  console.log(`conflict pressure ${p}: escalation gate ${gate} · escalated ${escalated.toFixed(3)} · next tick aged (held lower bound) ${heldAged.toFixed(3)} · flows draw (>= ${FLIGHT}): ${heldAged >= FLIGHT} · escalation applyMode ${escalated >= 0.78 ? 'proposal' : 'auto'} · escalation probability ${Math.min(0.42, 0.08 + p * 0.28).toFixed(3)}`);
}
