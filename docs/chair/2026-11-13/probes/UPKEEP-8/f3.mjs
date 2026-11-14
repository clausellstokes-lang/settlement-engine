// UPKEEP-8, step 2 (F3): each PDF threat row (Beasts & Monsters, Invasion & War) with the band it prints, its
// sentence, and the forces the lane's one projection holds (standingDefenseForces). Reads births.mjs `full` rows
// and renders them with TREE's display code. usage: TREE=<tree> node f3.mjs <births.full.ndjson> <out.ndjson>
import fs from 'node:fs'; import readline from 'node:readline';
const T = process.env.TREE;
const { deriveDefenseReadiness } = await import(T + '/src/domain/display/defenseDisplay.js');
const { standingDefenseForces } = await import(T + '/src/domain/institutions/defenseInstitutionBuckets.js');
const out = fs.createWriteStream(process.argv[3]);
for await (const line of readline.createInterface({ input: fs.createReadStream(process.argv[2]) })) {
  const { seed, s } = JSON.parse(line);
  const f = standingDefenseForces(s);
  const forces = ['walls', 'garrison', 'militia', 'watch', 'mercenary', 'charter'].filter((k) => f[k].present);
  const rows = deriveDefenseReadiness(s).filter((r) => ['Beasts & Monsters', 'Invasion & War'].includes(r.label)).map((r) => ({ label: r.label, status: r.status, score: r.score, assess: r.assess }));
  out.write(JSON.stringify({ seed, tier: s.tier, crisis: (s.config?.stressTypes || []).join('+') || 'calm', threat: s.config?.monsterThreat, forces, rows }) + '\n');
}
out.end();
