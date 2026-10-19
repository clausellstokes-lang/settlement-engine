// D-MN-r2 probe — MN-r1-6 (FAIL): after the press envelope is SPENT the held floor is 0.55 (under the 0.6 flight band).
// (1) Does master's escalation arm (stressors.js :: evaluateStressorRules) emit a candidate that lifts such a record
//     over the flight band under conflict pressure? (the leak the verifier executed by formula)
// (2) With the round-2 cure — NO escalation candidate for a menace-held record (the fence), and the held floor — does the
//     record stay at exactly 0.55 for a year (so flows.js :: populationFlows' `severity < 0.6` gate never passes)?
// Imports master 81f1cd963's own modules read-only. Run: node spentFence.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);
const { createPRNG } = await imp('src/kernel/prng.js');
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
const SPENT = 0.55, FLIGHT = 0.6;
const ep = { durationPolicy: 'episodic', decayRate: core.STRESSOR_POLICIES.episodic.decay };
const mk = (sev) => core.normalizeStressor({ id: 'world_stressor.siege.kell.menace.m1', type: 'siege', label: 'A siege from outside', originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: sev, age: 10, originContext: { variant: 'menace', menaceId: 'menace.m1', attackerLabel: 'the Ashen Host', attackerSettlementId: null, sponsorSettlementId: null }, ...ep });
console.log('(1) master escalation arm on a spent held record (severity 0.55):');
for (const p of [0.6, 0.65, 0.7, 0.8, 0.9]) {
  const rec = mk(SPENT);
  const snapshot = { byId: new Map(), worldState: { tick: 20, stressors: [rec], simulationRules: { propagationMode: 'off' } } };
  const pressureIdx = { get: (id, kind) => (kind === 'conflict' ? { score: p } : { score: 0 }) };
  const cands = str.evaluateStressorRules(snapshot, pressureIdx, { tick: 20, pressures: [] });
  const esc = cands.filter((c) => String(c.candidateType || '').startsWith('stressor_escalate_'));
  console.log(`  conflict ${p}: escalation candidates ${esc.length}${esc.length ? ` · severity ${esc[0].severity.toFixed(3)} · applyMode ${esc[0].applyMode} · p ${esc[0].probability.toFixed(3)} · over flight band ${esc[0].severity >= FLIGHT}` : ''}`);
  console.log(`      with the fence (menace-held ⇒ no escalation candidate): ${cands.filter((c) => String(c.candidateType || '').startsWith('stressor_escalate_') && !(c.stressor?.originContext?.menaceId)).length}`);
}
console.log('(2) the fenced held record over 52 weeks at the spent floor (decay floored, no escalation):');
let rec = mk(SPENT); let maxSev = 0; let flowWeeks = 0; let resolved = 0;
const snap = { byId: new Map(), worldState: {} };
for (let w = 1; w <= 52; w++) {
  const res = str.ageRoamingStressors([rec], snap, createPRNG(`dmn2-${w}`).fork('a'), { tick: 20 + w });
  const aged = res.stressors.find((s) => s.id === rec.id) || res.resolved.find((s) => s.id === rec.id);
  if (res.resolved.length) resolved += 1; // master rolls resolution; the hold's `!held &&` conjunct suppresses it in the design
  const held = Math.max(SPENT, aged.severity); // the hold: Math.max(blockFloor, heldFloor, decayed)
  rec = core.normalizeStressor({ ...aged, status: 'active', severity: held });
  maxSev = Math.max(maxSev, held); if (held >= FLIGHT) flowWeeks += 1;
}
console.log(`  max severity ${maxSev.toFixed(3)} · weeks at or over the flight band ${flowWeeks} · (master would have rolled resolution ${resolved}× — suppressed by the hold)`);
