// V-WS-r2 probe 1: where does WAY_BLOODY_CUT (the grid median 0.3000) sit on the malice axis?
// Imports the landed expectedBloodyShare (read-only). evilLean01 = computeMalice (actorProfileOf).
const M = process.argv[2];
const { expectedBloodyShare } = await import(M + '/src/domain/worldPulse/supplyWebWarfare.js');
const { FACTION_ARCHETYPES } = await import(M + '/src/domain/factionArchetypes.js');
const CUT = 0.3000;
const arches = ['', ...Object.values(FACTION_ARCHETYPES)].sort();
for (const a of arches) {
  const row = [];
  for (const e of [0.45, 0.49, 0.4999, 0.5, 0.5001, 0.51, 0.55]) {
    const s = expectedBloodyShare({ archetype: a, evilLean01: e, lawfulLean01: 0.5 });
    row.push(`${e}:${s.toFixed(4)}${s >= CUT ? 'B' : 'b'}`);
  }
  // does lawfulness move it at fixed malice 0.5?
  const lawVar = [0, 0.5, 1].map((l) => expectedBloodyShare({ archetype: a, evilLean01: 0.5, lawfulLean01: l }).toFixed(4)).join('/');
  console.log(`${(a || '(none)').padEnd(12)} ${row.join(' ')} | law 0/0.5/1 at e=0.5: ${lawVar}`);
}
