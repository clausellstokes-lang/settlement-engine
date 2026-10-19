// V-MN-r3 probe (read-only): MN §3.2 derives the receipt `warSiegeRefused: [<attackerId>]` from the landed
// `hostileNeighborsOf(snapshot, targetId)`. What does that read return for a town whose only "hostile" neighbour
// is a RIVAL or a COLD WAR (no war at all)? And does it consult any siege-birth pressure? Run: node receipt.mjs <worktree>
import { pathToFileURL } from 'node:url';
import path from 'node:path';
const W = process.argv[2];
const dyn = await import(pathToFileURL(path.join(W, 'src/domain/worldPulse/stressorDynamics.js')).href);
const snap = (type) => ({ regionalGraph: { edges: [{ from: 'kell', to: 'merewick', type, relationshipType: type }] }, relationships: [] });
for (const t of ['hostile', 'cold_war', 'rival', 'allied']) {
  const out = dyn.hostileNeighborsOf(snap(t), 'kell');
  const origin = dyn.interpretStressorOrigin('siege', 'kell', { ...snap(t), worldState: {} }, 10);
  console.log(`edge ${t}: hostileNeighborsOf(kell) = ${JSON.stringify(out)} · siege origin variant = ${origin?.variant ?? null}`);
}
console.log('hostileNeighborsOf signature reads only (snapshot, settlementId): no pressure, no birth candidate:', dyn.hostileNeighborsOf.length, 'params');
