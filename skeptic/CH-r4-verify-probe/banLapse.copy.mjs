// D-CH-r3 probe (PT-V1, CH's half): a person's emergent windowed ban and the DM's indefinite banish at one door
// merge into ONE indefinite edge (strictest wins); CH's seat-change lapse must lift only a still-WINDOWED edge.
// Master's own writers, read-only. Usage: node banLapse.mjs <master worktree>
const M = process.argv[2];
const L = await import(`${M}/src/domain/worldPulse/npcLedger.js`);
const base = { tick: 100, simulationRules: { npcConsequencesEnabled: true } };
const guardedLapse = (ws, id, door) => {           // CH §11's cured rule
  const edge = L.exclusionsOf(ws, id).find((e) => e.settlementId === door && e.kind === 'banishment_edict');
  if (!edge || edge.indefinite === true) return { worldState: ws, lifted: [] };
  return L.liftExclusionEdges(ws, id, { settlementId: door });
};
// (a) emergent windowed only
let a = L.addExclusionEdge(base, 'wnpc_h', { settlementId: 'Kell', kind: 'banishment_edict', untilTick: 152 }).worldState;
const aOut = guardedLapse(a, 'wnpc_h', 'Kell');
// (b) emergent windowed, then the DM's indefinite banish at the same door
let b = L.addExclusionEdge(base, 'wnpc_h', { settlementId: 'Kell', kind: 'banishment_edict', untilTick: 152 }).worldState;
b = L.addExclusionEdge(b, 'wnpc_h', { settlementId: 'Kell', kind: 'banishment_edict', indefinite: true }).worldState;
const merged = L.exclusionsOf(b, 'wnpc_h');
const bGuarded = guardedLapse(b, 'wnpc_h', 'Kell');
const bUnguarded = L.liftExclusionEdges(b, 'wnpc_h', { settlementId: 'Kell' });
console.log(JSON.stringify({
  windowedOnly: { lifted: aOut.lifted.length, bannedAfter: L.isExcludedFrom(aOut.worldState, 'wnpc_h', 'Kell', 160) },
  mergedEdges: merged,
  guardedLapse: { lifted: bGuarded.lifted.length, bannedAfter: L.isExcludedFrom(bGuarded.worldState, 'wnpc_h', 'Kell', 160) },
  unguardedLapse: { lifted: bUnguarded.lifted.length, bannedAfter: L.isExcludedFrom(bUnguarded.worldState, 'wnpc_h', 'Kell', 160) },
}));
