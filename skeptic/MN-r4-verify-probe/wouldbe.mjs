// D-MN-r4 probe (read-only): RULINGS-ROUND4 A.14 — `warSiegeRefused` is derived from a WOULD-BE BIRTH:
// a `conflict` pressure at the besieged town at or above STRESSOR_CATALOG.siege.birthThreshold (0.72) AND
// the landed origin interpretation `declared_war` (hostileNeighborsOf's first row of type `hostile`).
// Re-runs the verifier's receipt.mjs cases through the cured derivation. Run: node wouldbe.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const dyn = await import(pathToFileURL(path.join(W, 'src/domain/worldPulse/stressorDynamics.js')).href);
const core = await import(pathToFileURL(path.join(W, 'src/domain/worldPulse/stressorsCore.js')).href);
const THRESH = core.STRESSOR_CATALOG.siege.birthThreshold;
const snap = (type) => ({ regionalGraph: { edges: [{ from: 'kell', to: 'merewick', type, relationshipType: type }] }, relationships: [], worldState: {} });
// the cured derivation, as MN §3.2 states it
function warSiegeRefused(snapshot, pressures, targetId, tick) {
  const conflict = (pressures || []).find((p) => p.kind === 'conflict' && String(p.settlementId) === String(targetId));
  if (!conflict || !(conflict.score >= THRESH)) return [];
  const origin = dyn.interpretStressorOrigin('siege', targetId, snapshot, tick);
  if (origin?.variant !== 'declared_war' || !origin.attackerSettlementId) return [];
  return [String(origin.attackerSettlementId)];
}
console.log('siege birthThreshold =', THRESH);
for (const t of ['hostile', 'cold_war', 'rival', 'allied']) {
  for (const score of [0.6, 0.72, 0.9]) {
    const r = warSiegeRefused(snap(t), [{ kind: 'conflict', settlementId: 'kell', score }], 'kell', 10);
    const old = dyn.hostileNeighborsOf(snap(t), 'kell').map((h) => h.otherId);
    console.log(`edge ${t.padEnd(8)} conflict ${score.toFixed(2)}: cured receipt ${JSON.stringify(r).padEnd(14)} · old (hostileNeighborsOf alone) ${JSON.stringify(old)}`);
  }
}
