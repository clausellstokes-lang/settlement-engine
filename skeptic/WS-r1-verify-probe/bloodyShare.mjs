// V-WS-r1 probe: the range of W-DOCTRINE-1's expectedBloodyShare over every archetype and a
// 0..1 grid of the alignment pair — does WS's DRAFT cut (share >= 0.5 is `bloody`) ever fire?
// Imports the worktree module read-only (no write, no git, no suite).
const M = process.argv[2];
const mod = await import(M + '/src/domain/worldPulse/supplyWebWarfare.js');
const { FACTION_ARCHETYPES } = await import(M + '/src/domain/factionArchetypes.js');
let max = { share: -1 }, min = { share: 2 }, n = 0, atOrAbove = 0;
const arches = ['', ...Object.values(FACTION_ARCHETYPES)];
for (const archetype of arches) for (let e = 0; e <= 20; e++) for (let l = 0; l <= 20; l++) {
  const actor = { archetype, evilLean01: e / 20, lawfulLean01: l / 20 };
  const share = mod.expectedBloodyShare(actor);
  n++; if (share >= 0.5) atOrAbove++;
  if (share > max.share) max = { share, ...actor };
  if (share < min.share) min = { share, ...actor };
}
console.log(`grid points ${n} · archetypes ${arches.length}`);
console.log(`max share ${max.share.toFixed(4)} at`, JSON.stringify(max));
console.log(`min share ${min.share.toFixed(4)} at`, JSON.stringify(min));
console.log(`points with share >= 0.5 (WS's 'bloody' cut): ${atOrAbove}/${n}`);
