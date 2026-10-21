// P5-verify probe: does the BD "visible walls band" (mapProfile.defensiveTerrain) read the truth readiness score?
// Read-only import of master 81f1cd963; nothing edited.
const M = process.argv[2];
const mp = await import(M + '/src/domain/mapProfile.js');
const cs = await import(M + '/src/domain/causalState.js');
const src = (await import('node:fs')).readFileSync(M + '/src/domain/mapProfile.js','utf8');
const m = src.match(/function deriveDefensiveTerrain[\s\S]*?\n}\n/);
const DEFENSIVE_TERRAIN_BANDS = ['exposed','open','mixed','sheltered','fortified'];
const resolveTerrain = (c) => c?.terrainType || '';
const defenseProfileHasWalls = (p) => !!p?.walls;
const fn = new Function('DEFENSIVE_TERRAIN_BANDS','resolveTerrain','defenseProfileHasWalls', m[0] + '\nreturn deriveDefensiveTerrain;')(DEFENSIVE_TERRAIN_BANDS, resolveTerrain, defenseProfileHasWalls);
const s = { config: { terrainType: 'plains' }, defenseProfile: { walls: true }, institutions: [] };
for (const d of [40, 54, 55, 70]) {
  console.log('walls=yes plains defense_readiness=' + d + ' -> ' + fn(s, { scores: { defense_readiness: d } }, []));
}
console.log('exported deriveMapProfile:', typeof mp.deriveMapProfile, '| causal export keys sample:', Object.keys(cs).filter(k=>/derive/i.test(k)).slice(0,5).join(','));
