// UPKEEP-11 step 1: the three part labels where defencePartsOf lists them, against the walker's own absence reader.
import fs from 'node:fs'; import zlib from 'node:zlib'; import readline from 'node:readline';
const T = process.env.TREE;
const { defencePartsOf } = await import(T + '/src/generators/defenseGenerator.js');
const { factsOf } = await import(T + '/src/domain/facts/factsOf.js');
const { liveInstitutionNames } = await import(T + '/src/domain/facts/institutions.js');
const { REGISTERED_WORDS: W } = await import(T + '/src/domain/facts/registeredWords.js');
const P = { masons: 'mason', elders: 'house: reeve', alchemists: 'house: alchemist' };
const rl = readline.createInterface({ input: fs.createReadStream(process.argv[2]).pipe(zlib.createGunzip()), crlfDelay: Infinity });
const o = {};
for await (const line of rl) {
  if (!line.trim()) continue; const { s } = JSON.parse(line);
  const ids = new Set(defencePartsOf(s).map((p) => p.id)); let f = null, nm = null;
  for (const [id, thing] of Object.entries(P)) if (ids.has(id)) { f ??= factsOf(s); nm ??= liveInstitutionNames(s); const r = (o[id] ||= { listed: 0, absent: 0 }); r.listed++; if (W[thing].absent(f, nm)) r.absent++; }
}
console.log(o);
