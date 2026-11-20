// town-20 side 0 and hamlet-17 sides: each rung's hash against its rate (read-only). argv: pool.json, tree src/
import fs from 'node:fs';
const R = process.argv[3];
const { castHash } = await import(R + 'domain/crisis/crisisCast.js');
const { FRAME_TUNING, ARCHETYPE_LADDER } = await import(R + 'domain/tension/sideArchetypes.js');
const { isOfficeStandIn } = await import(R + 'domain/dossier/seatHolder.js');
const { towns } = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
for (const [seed, type, sides] of [['frame-calm-town-20', 'crime_wave', [[0, 'enforcer'], [1, 'challenger']]], ['frame-calm-hamlet-17', 'succession_crisis', [[0, 'authority'], [1, 'challenger'], [2, 'profiteer']]]]) {
  const { s } = towns.find((t) => t.seed === seed);
  for (const [i, a] of sides) console.log(seed, i, a, ARCHETYPE_LADDER[a].map((k) => `${k}:${castHash(s._seed, type, `${i}:${k}`).toFixed(3)}/${FRAME_TUNING.rates[a][k]}`).join(' '));
  for (const n of s.npcs) if (/^The /.test(n.name)) console.log('  stand-in?', n.name, '| role', n.role, '|', isOfficeStandIn(n));
}
