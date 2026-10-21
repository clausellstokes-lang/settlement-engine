// D-BD-p5b probe (a): the walls rung ONLY — does a readiness-free band exist on master's own ladder, and does it equal
// master's defensiveTerrain with `fortified` read as `sheltered`? Read-only: the function body is copied from master's file.
import fs from 'node:fs';
const M = process.argv[2];
const src = fs.readFileSync(M + '/src/domain/mapProfile.js', 'utf8');
const body = src.match(/function deriveDefensiveTerrain[\s\S]*?\n}\n/)[0];
const BANDS = ['exposed','open','mixed','sheltered','fortified'];
const cs = await import(M + '/src/domain/causalState.js');           // the LANDED walls test, exported
const resolveTerrain = (c) => c?.terrainType || '';
const master = new Function('DEFENSIVE_TERRAIN_BANDS','resolveTerrain','defenseProfileHasWalls', body + '\nreturn deriveDefensiveTerrain;')(BANDS, resolveTerrain, cs.defenseProfileHasWalls);
// The walls rung only: the same function with the readiness arm removed (no `causal` argument is read at all).
const rungBody = body.replace('const defense = causal.scores?.defense_readiness ?? 50;', 'const defense = -1; /* readiness never read */');
const rung = new Function('DEFENSIVE_TERRAIN_BANDS','resolveTerrain','defenseProfileHasWalls', rungBody + '\nreturn deriveDefensiveTerrain;')(BANDS, resolveTerrain, cs.defenseProfileHasWalls);
const terrains = ['plains','hills','forest','swamp','mountain','coast','river','tundra',''];
let cells = 0, agree = 0, readinessFlips = 0;
for (const t of terrains) for (const walls of [false, true]) {
  const s = { config: { terrainType: t }, defenseProfile: walls ? { walls: ['stone'] } : {}, institutions: [] };
  const seen = new Set();
  for (const d of [0, 30, 54, 55, 70, 100]) {
    const m = master(s, { scores: { defense_readiness: d } }, []);
    const r = rung(s, { scores: { defense_readiness: d } }, []);
    seen.add(r); cells++;
    if ((m === 'fortified' ? 'sheltered' : m) === r) agree++;
  }
  if (seen.size > 1) readinessFlips++;
  console.log(`terrain=${t||'(none)'} walls=${walls} -> rung ${[...seen].join(',')} | master@54 ${master(s,{scores:{defense_readiness:54}},[])} @55 ${master(s,{scores:{defense_readiness:55}},[])}`);
}
console.log(`cells ${cells} · rung == min(master, sheltered) in ${agree} · terrain×walls rows whose rung moves with readiness: ${readinessFlips}`);
