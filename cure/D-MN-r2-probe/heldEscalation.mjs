// D-MN-r2 probe — the REFINED broadening of MN-r1-6's fence: does master's escalation arm also act on an UNSPENT held record,
// and at a strong/formidable might does it mint a DM PROPOSAL (applyMode 'proposal', severity >= 0.78) on a fact the
// weekly `menace_siege` hearing already holds? Run: node heldEscalation.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const imp = (p) => import(pathToFileURL(path.join(W, p)).href);
const core = await imp('src/domain/worldPulse/stressorsCore.js');
const str = await imp('src/domain/worldPulse/stressors.js');
for (const [might, sev] of [['capable', 0.6], ['strong', 0.8], ['formidable', 0.9]]) {
  for (const type of ['siege', 'monster_raider_pressure']) {
    const rec = core.normalizeStressor({ id: `world_stressor.${type}.kell.menace.m1`, type, originSettlementId: 'kell', affectedSettlementIds: ['kell'], severity: sev, age: 5, durationPolicy: 'episodic', originContext: { variant: 'menace', menaceId: 'menace.m1' } });
    const out = [];
    for (const p of [0.65, 0.7, 0.8]) {
      const snapshot = { byId: new Map(), worldState: { tick: 20, stressors: [rec], simulationRules: { propagationMode: 'off' } } };
      const pressureIdx = { get: (id, kind) => ({ score: p }) };
      const esc = str.evaluateStressorRules(snapshot, pressureIdx, { tick: 20, pressures: [] }).filter((c) => String(c.candidateType || '').startsWith('stressor_escalate_'));
      out.push(esc.length ? `p${p}→${esc[0].severity.toFixed(2)} ${esc[0].applyMode} (chance ${esc[0].probability.toFixed(2)})` : `p${p}→none`);
    }
    console.log(`${might} ${type} held at ${sev}: ${out.join(' · ')}`);
  }
}
